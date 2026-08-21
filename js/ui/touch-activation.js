(function(root) {
  "use strict";

  const CatInc = root.CatInc = root.CatInc || {};
  const ACTION_SELECTOR = [
    "button", "a[href]", "summary", "[role='button']", "[role='menuitem']",
    "[role='tab']", "[data-clavier-clic]", "[onclick]", "[data-touch-activation-root]"
  ].join(",");
  const EXTERNAL_TOUCH_SELECTOR = "#camp-prototype-items [data-camp-uid]";
  const MANUAL_CONTROL_SELECTOR = [
    "input", "select", "textarea", "[contenteditable='true']", "[role='slider']",
    ".recruit-pitch-btn", "[data-touch-activation='manual']"
  ].join(",");
  const TAP_MOVE_TOLERANCE = 8;
  const TAP_MAX_DURATION_MS = 450;
  const MAX_SUPPRESSION_RECORDS = 64;
  const MAX_LEDGER_RECORDS = 256;
  const MAX_NATIVE_OWNERS = 32;
  const STATES = Object.freeze({
    TRACKING: "TRACKING",
    INVALIDATED: "INVALIDATED",
    VALIDATED: "VALIDATED",
    ACTIVATED_AWAIT_CLICK: "ACTIVATED_AWAIT_CLICK",
    QUIESCENT: "QUIESCENT",
    CLOSED: "CLOSED"
  });
  const ALLOWED_TRANSITIONS = Object.freeze({
    TRACKING: Object.freeze([STATES.INVALIDATED, STATES.VALIDATED]),
    INVALIDATED: Object.freeze([STATES.QUIESCENT, STATES.CLOSED]),
    VALIDATED: Object.freeze([STATES.ACTIVATED_AWAIT_CLICK, STATES.QUIESCENT, STATES.CLOSED]),
    ACTIVATED_AWAIT_CLICK: Object.freeze([STATES.QUIESCENT, STATES.CLOSED]),
    QUIESCENT: Object.freeze([STATES.CLOSED]),
    CLOSED: Object.freeze([])
  });

  function createController(options) {
    const documentRef = options.document;
    const scheduleMicrotask = options.queueMicrotask;
    const scheduleTask = typeof options.setTimeout === "function"
      ? function(callback) { options.setTimeout(callback, 0); }
      : scheduleMicrotask;
    // This is the sole logical generation store. All active, terminal,
    // suppression and native-owner state is represented by records in it.
    const ledger = new Map();
    const pointerQueues = new Map();
    const activeByPointer = new Map();
    const terminalByPointer = new Map();
    const activeTouchPointers = new Set();
    const semanticActions = new Map();
    // Bounded fail-closed credits for compacted, already-quiescent generations.
    // Collisions can suppress an ambiguous pointer click, but a proven native
    // mouse/pen owner and every keyboard/detail=0 click bypass this sentinel.
    const staleCreditBuckets = Array.from({ length: 256 }, function() {
      return { eligible: 0, exactOnly: 0 };
    });
    let staleEligibleCredits = 0;
    let generation = 0;
    let compactedRecords = 0;

    function recordDiagnostic(name, record, details) {
      const diagnostic = CatInc.mobileInputDiagnostic;
      if (!diagnostic || !diagnostic.enabled || typeof diagnostic.recordAuthority !== "function") return;
      const target = record && (record.root || record.target);
      diagnostic.recordAuthority(name, Object.assign({
        gestureToken: record && record.token ? record.token.id : null,
        pointerId: record ? record.pointerId : finitePointerId(details),
        pointerType: record ? record.pointerType : details && details.pointerType || null,
        state: record ? record.state : null,
        target: target && target.id ? "#" + target.id : null,
        actionId: target && target.getAttribute ? target.getAttribute("data-input-action") : null
      }, details || {}));
    }

    function finitePointerId(eventOrId) {
      const raw = eventOrId && typeof eventOrId === "object" ? eventOrId.pointerId : eventOrId;
      if (raw === null || raw === undefined || raw === "") return null;
      const value = Number(raw);
      return Number.isFinite(value) ? value : null;
    }

    function actionRoot(target) {
      if (!target || typeof target.closest !== "function") return null;
      if (target.closest(MANUAL_CONTROL_SELECTOR)) return null;
      const declared = target.closest("[data-touch-activation-root]");
      const action = target.closest(ACTION_SELECTOR);
      if (!action || action.disabled || action.getAttribute("aria-disabled") === "true") return null;
      if (target.closest(EXTERNAL_TOUCH_SELECTOR) && !declared) return null;
      return action;
    }

    function eventTimestamp(event) {
      const value = Number(event && event.timeStamp);
      return Number.isFinite(value) && value >= 0 ? value : 0;
    }

    function sameBranch(first, second) {
      return Boolean(first && second && (first === second
        || (typeof first.contains === "function" && first.contains(second))
        || (typeof second.contains === "function" && second.contains(first))));
    }

    function queueFor(pointerId) {
      if (!pointerQueues.has(pointerId)) pointerQueues.set(pointerId, []);
      return pointerQueues.get(pointerId);
    }

    function makeRecord(event, kind, details) {
      const pointerId = finitePointerId(event);
      (pointerQueues.get(pointerId) || []).filter(function(record) {
        return record.kind === "native" && record.state === STATES.ACTIVATED_AWAIT_CLICK;
      }).forEach(close);
      const previous = activeByPointer.get(pointerId);
      if (previous) {
        if (previous.kind === "touch") invalidateRecord(previous);
        else {
          transition(previous, STATES.INVALIDATED);
          close(previous);
        }
      }
      const nextGeneration = ++generation;
      const token = Object.freeze({
        id: "gesture:" + String(nextGeneration)
      });
      const record = {
        token: token,
        pointerId: pointerId,
        generation: nextGeneration,
        pointerType: event.pointerType,
        kind: kind,
        state: STATES.TRACKING,
        root: details.root || null,
        external: Boolean(details.external),
        manual: Boolean(details.manual),
        target: event.target || null,
        startX: Number(event.clientX) || 0,
        startY: Number(event.clientY) || 0,
        startTime: eventTimestamp(event),
        clientX: Number(event.clientX) || 0,
        clientY: Number(event.clientY) || 0,
        claimCount: 0,
        activationCount: 0,
        cleanupCount: 0,
        suppressionCredit: 0,
        suppressionConsumed: 0,
        transitions: [STATES.TRACKING]
      };
      ledger.set(token.id, record);
      queueFor(pointerId).push(record);
      activeByPointer.set(pointerId, record);
      recordDiagnostic("authority.owned", record, {
        ownership: kind, external: record.external, manual: record.manual
      });
      return record;
    }

    function transition(record, nextState) {
      if (!record || record.state === nextState) return false;
      if (!ALLOWED_TRANSITIONS[record.state].includes(nextState)) return false;
      record.state = nextState;
      record.transitions.push(nextState);
      recordDiagnostic("authority.transition", record, { nextState: nextState });
      if ((nextState === STATES.QUIESCENT || nextState === STATES.CLOSED) && record.cleanupCount === 0) {
        record.cleanupCount = 1;
      }
      return true;
    }

    function claim(record) {
      if (!record || record.claimCount !== 0) return false;
      record.claimCount = 1;
      return true;
    }

    function credit(record) {
      if (!record || record.suppressionCredit !== 0 || record.suppressionConsumed !== 0) return false;
      record.suppressionCredit = 1;
      compactSuppressionHistory();
      return true;
    }

    function close(record) {
      if (!record || record.state === STATES.CLOSED) return false;
      if (!transition(record, STATES.CLOSED)) return false;
      if (activeByPointer.get(record.pointerId) === record) activeByPointer.delete(record.pointerId);
      if (terminalByPointer.get(record.pointerId) === record) terminalByPointer.delete(record.pointerId);
      pruneClosedLedger();
      return true;
    }

    function pruneClosedLedger() {
      while (ledger.size > MAX_LEDGER_RECORDS) {
        const candidate = Array.from(ledger.values()).find(function(entry) {
          return entry.state === STATES.CLOSED;
        });
        if (!candidate) break;
        ledger.delete(candidate.token.id);
        const queue = pointerQueues.get(candidate.pointerId) || [];
        const index = queue.indexOf(candidate);
        if (index >= 0) queue.splice(index, 1);
        if (queue.length === 0) pointerQueues.delete(candidate.pointerId);
      }
    }

    function quiesce(record) {
      if (!record || record.state === STATES.CLOSED || record.state === STATES.QUIESCENT) return false;
      if (!transition(record, STATES.QUIESCENT)) return false;
      if (terminalByPointer.get(record.pointerId) === record) terminalByPointer.delete(record.pointerId);
      compactSuppressionHistory();
      return true;
    }

    function compactSuppressionHistory() {
      const credited = [];
      ledger.forEach(function(record) {
        if (record.suppressionCredit === 1 && record.suppressionConsumed === 0) credited.push(record);
      });
      while (credited.length > MAX_SUPPRESSION_RECORDS) {
        const candidate = credited.find(function(record) {
          return record.state === STATES.QUIESCENT;
        });
        if (!candidate) break; // Never evict a live hazard.
        candidate.suppressionCredit = 0;
        addStaleCredit(candidate);
        compactedRecords += 1;
        close(candidate);
        credited.splice(credited.indexOf(candidate), 1);
      }
    }

    function staleBucket(pointerId) {
      const text = String(pointerId);
      let hash = 2166136261;
      for (let index = 0; index < text.length; index += 1) {
        hash ^= text.charCodeAt(index);
        hash = Math.imul(hash, 16777619);
      }
      return hash >>> 24;
    }

    function addStaleCredit(record) {
      const bucket = staleCreditBuckets[staleBucket(record.pointerId)];
      if (record.activationCount === 1) {
        bucket.eligible += 1;
        staleEligibleCredits += 1;
      } else {
        bucket.exactOnly += 1;
      }
    }

    function consumeStaleCredit(pointerId) {
      const bucket = staleCreditBuckets[staleBucket(pointerId)];
      // A direct identity lookup must spend the most specific credit first.
      // Otherwise a hash collision can strand exact-only debt after consuming
      // generic cross-identity debt from the same compacted bucket.
      if (bucket.exactOnly > 0) {
        bucket.exactOnly -= 1;
        return true;
      }
      if (bucket.eligible === 0) return false;
      bucket.eligible -= 1;
      staleEligibleCredits -= 1;
      return true;
    }

    function consumeOldestStaleEligibleCredit() {
      if (staleEligibleCredits === 0) return false;
      const bucket = staleCreditBuckets.find(function(entry) { return entry.eligible > 0; });
      if (!bucket) return false;
      bucket.eligible -= 1;
      staleEligibleCredits -= 1;
      return true;
    }

    function staleCreditCount() {
      return staleCreditBuckets.reduce(function(total, bucket) {
        return total + bucket.eligible + bucket.exactOnly;
      }, 0);
    }

    function suppressionCount() {
      let count = 0;
      ledger.forEach(function(record) {
        if (record.suppressionCredit === 1 && record.suppressionConsumed === 0) count += 1;
      });
      return count;
    }

    function consumeCredit(pointerId) {
      const queue = pointerQueues.get(pointerId) || [];
      const record = queue.find(function(entry) {
        return entry.kind === "touch" && entry.suppressionCredit === 1 && entry.suppressionConsumed === 0;
      });
      if (!record) return null;
      record.suppressionCredit = 0;
      record.suppressionConsumed = 1;
      close(record);
      return record;
    }

    function consumeOldestTouchCredit() {
      if (consumeOldestStaleEligibleCredit()) return true;
      const record = Array.from(ledger.values()).find(function(entry) {
        return entry.kind === "touch" && entry.activationCount === 1
          && entry.suppressionCredit === 1 && entry.suppressionConsumed === 0;
      });
      if (!record) return null;
      record.suppressionCredit = 0;
      record.suppressionConsumed = 1;
      close(record);
      return record;
    }

    function boundNativeOwners() {
      const owners = Array.from(ledger.values()).filter(function(record) {
        return record.kind === "native" && record.state === STATES.ACTIVATED_AWAIT_CLICK;
      });
      while (owners.length > MAX_NATIVE_OWNERS) close(owners.shift());
    }

    function isEligibleOrphanMouseClick(event) {
      // Browser-native WebKit compatibility clicks can change both identity and
      // pointer type. Synthetic state tests omit isTrusted, while an explicitly
      // untrusted legacy element.click()/dispatchEvent click must traverse.
      return event.pointerType === "mouse" && Number(event.detail) > 0
        && event.isTrusted !== false;
    }

    function consumeNativeOwner(event, pointerId) {
      const queue = pointerQueues.get(pointerId) || [];
      const record = queue.find(function(entry) {
        return entry.kind === "native" && entry.state === STATES.ACTIVATED_AWAIT_CLICK
          && entry.pointerType === event.pointerType && sameBranch(entry.target, event.target)
          && Math.hypot((Number(event.clientX) || 0) - entry.clientX,
            (Number(event.clientY) || 0) - entry.clientY) <= TAP_MOVE_TOLERANCE;
      });
      if (!record) return null;
      close(record);
      return record;
    }

    function invalidateRecord(record) {
      if (!record) return false;
      if (record.state === STATES.TRACKING) transition(record, STATES.INVALIDATED);
      if (record.state !== STATES.INVALIDATED) {
        return record.suppressionCredit === 1 && record.suppressionConsumed === 0;
      }
      credit(record);
      if (activeByPointer.get(record.pointerId) === record) activeByPointer.delete(record.pointerId);
      if (!activeByPointer.has(record.pointerId)) terminalByPointer.set(record.pointerId, record);
      scheduleTask(function() { quiesce(record); });
      return true;
    }

    function invalidate(pointerId) {
      const id = finitePointerId(pointerId);
      if (id === null) return false;
      const record = activeByPointer.get(id) || terminalByPointer.get(id);
      if (record) return invalidateRecord(record);
      return (pointerQueues.get(id) || []).some(function(entry) {
        return entry.suppressionCredit === 1 && entry.suppressionConsumed === 0;
      });
    }

    function consumePointer(eventOrId) {
      const id = finitePointerId(eventOrId);
      if (id === null) return false;
      const record = activeByPointer.get(id) || terminalByPointer.get(id);
      if (!record || record.kind !== "touch") return false;
      if (record.state === STATES.TRACKING) transition(record, STATES.VALIDATED);
      if (record.state !== STATES.VALIDATED) {
        return record.suppressionCredit === 1 && record.suppressionConsumed === 0;
      }
      if (!claim(record)) return record.suppressionCredit === 1;
      credit(record);
      if (activeByPointer.get(id) === record) activeByPointer.delete(id);
      if (!activeByPointer.has(id)) terminalByPointer.set(id, record);
      scheduleTask(function() { quiesce(record); });
      return true;
    }

    function onPointerDown(event) {
      const pointerId = finitePointerId(event);
      if (pointerId === null) return;
      if (event.pointerType === "mouse" || event.pointerType === "pen") {
        if (event.button > 0 || event.isPrimary === false) return;
        makeRecord(event, "native", { root: event.target });
        return;
      }
      if (event.pointerType !== "touch") return;
      activeTouchPointers.add(pointerId);
      if (activeTouchPointers.size > 1) {
        Array.from(activeByPointer.values()).filter(function(record) {
          return record.kind === "touch";
        }).forEach(invalidateRecord);
        return;
      }
      if (event.button > 0 || event.isPrimary === false) return;
      const rootAction = actionRoot(event.target);
      const externalTouch = event.target && typeof event.target.closest === "function"
        ? event.target.closest(EXTERNAL_TOUCH_SELECTOR) : null;
      const manualTarget = event.target && typeof event.target.closest === "function"
        ? event.target.closest("[data-touch-activation='manual']") : null;
      if (!rootAction && !externalTouch && !manualTarget) {
        recordDiagnostic("authority.unowned", null, {
          pointerId: pointerId,
          pointerType: event.pointerType,
          decision: "no-action-root"
        });
        return;
      }
      makeRecord(event, "touch", {
        root: rootAction,
        external: Boolean(externalTouch),
        manual: Boolean(manualTarget)
      });
    }

    function onPointerMove(event) {
      const pointerId = finitePointerId(event);
      const record = pointerId === null ? null : activeByPointer.get(pointerId);
      if (!record || record.kind !== "touch") return;
      if (Math.hypot((Number(event.clientX) || 0) - record.startX,
        (Number(event.clientY) || 0) - record.startY) > TAP_MOVE_TOLERANCE) invalidateRecord(record);
    }

    function activateRecord(record) {
      if (!record || record.state !== STATES.VALIDATED) return false;
      const actionId = record.root && record.root.getAttribute
        ? record.root.getAttribute("data-input-action") : null;
      const semanticAction = actionId && semanticActions.get(actionId);
      if (semanticAction) {
        const payload = semanticAction.resolvePayload
          ? semanticAction.resolvePayload(record.root, record.token) : null;
        return dispatchSemanticAction(actionId, payload, record.token, semanticAction.activate);
      }
      if (!claim(record)) return false;
      transition(record, STATES.ACTIVATED_AWAIT_CLICK);
      record.activationCount = 1;
      recordDiagnostic("authority.activation", record, { activation: "legacy-click-adapter" });
      scheduleMicrotask(function() {
        if (!record.root || record.root.isConnected === false || record.root.disabled
          || record.root.getAttribute("aria-disabled") === "true") return;
        // Temporary Phase-1 legacy adapter. Semantic callsites migrate later.
        record.root.click();
      });
      scheduleTask(function() { quiesce(record); });
      return true;
    }

    function releaseRecord(record, event) {
      if (!record || !record.root || record.state !== STATES.VALIDATED) return;
      if (actionRoot(event.target) !== record.root) return;
      activateRecord(record);
    }

    function onPointerUp(event) {
      const pointerId = finitePointerId(event);
      if (pointerId === null) return;
      const record = activeByPointer.get(pointerId);
      if (event.pointerType === "mouse" || event.pointerType === "pen") {
        if (activeByPointer.get(pointerId) === record) activeByPointer.delete(pointerId);
        if (record && record.kind === "native" && record.pointerType === event.pointerType
          && sameBranch(record.target, event.target)) {
          transition(record, STATES.VALIDATED);
          transition(record, STATES.ACTIVATED_AWAIT_CLICK);
          record.target = event.target;
          record.clientX = Number(event.clientX) || 0;
          record.clientY = Number(event.clientY) || 0;
          boundNativeOwners();
        } else if (record) {
          transition(record, STATES.INVALIDATED);
          close(record);
        }
        return;
      }
      if (event.pointerType !== "touch") return;
      activeTouchPointers.delete(pointerId);
      if (!record || record.kind !== "touch" || record.state !== STATES.TRACKING) return;
      if (activeByPointer.get(pointerId) === record) activeByPointer.delete(pointerId);
      transition(record, STATES.VALIDATED);
      terminalByPointer.set(pointerId, record);
      const duration = eventTimestamp(event) - record.startTime;
      if (duration < 0 || duration > TAP_MAX_DURATION_MS) {
        credit(record);
        quiesce(record);
        return;
      }
      if (!record.root) {
        if (!record.external) {
          claim(record);
          credit(record);
          quiesce(record);
        } else {
          scheduleTask(function() {
            if (record.state === STATES.VALIDATED && record.claimCount === 0) {
              quiesce(record);
              close(record);
            }
          });
        }
        return;
      }
      if (actionRoot(event.target) !== record.root) {
        credit(record);
        quiesce(record);
        return;
      }
      credit(record);
      const release = function(releaseEvent) { releaseRecord(record, releaseEvent); };
      if (record.root && typeof record.root.addEventListener === "function") {
        record.root.addEventListener("pointerup", release, { once: true, capture: true });
      }
    }

    function onPointerUpAfterPropagation(event) {
      const pointerId = finitePointerId(event);
      if (pointerId !== null) releaseRecord(terminalByPointer.get(pointerId), event);
    }

    function onPointerCancel(event) {
      const pointerId = finitePointerId(event);
      if (pointerId === null) return;
      activeTouchPointers.delete(pointerId);
      const record = activeByPointer.get(pointerId);
      if (!record) return;
      if (record.kind === "native") {
        transition(record, STATES.INVALIDATED);
        close(record);
        return;
      }
      invalidateRecord(record);
    }

    function onContextMenu(event) {
      const pointerId = finitePointerId(event);
      if (pointerId !== null) invalidate(pointerId);
      else Array.from(activeByPointer.values()).forEach(invalidateRecord);
    }

    function onTouchCancel() {
      Array.from(activeByPointer.values()).filter(function(record) {
        return record.kind === "touch";
      }).forEach(invalidateRecord);
      activeTouchPointers.clear();
    }

    function onClick(event) {
      const pointerId = finitePointerId(event);
      if (Number(event.detail) === 0 || !event.pointerType) return;
      if (event.isTrusted === false) return;
      if (pointerId !== null && consumeNativeOwner(event, pointerId)) return;
      let consumed = pointerId === null ? null : consumeCredit(pointerId);
      if (!consumed && pointerId !== null && consumeStaleCredit(pointerId)) consumed = true;
      if (!consumed && isEligibleOrphanMouseClick(event)) consumed = consumeOldestTouchCredit();
      if (!consumed) return;
      event.preventDefault();
      event.stopPropagation();
      if (typeof event.stopImmediatePropagation === "function") event.stopImmediatePropagation();
    }

    function dispatchSemanticAction(actionId, payload, token, activate) {
      const record = token && ledger.get(token.id);
      if (!record || record.token !== token || typeof activate !== "function") return false;
      if (record.state !== STATES.VALIDATED) return false;
      if (record.activationCount !== 0 || !claim(record)) return false;
      transition(record, STATES.ACTIVATED_AWAIT_CLICK);
      record.activationCount = 1;
      recordDiagnostic("authority.activation", record, {
        actionId: actionId, activation: "semantic-action"
      });
      activate(payload, token);
      scheduleTask(function() { quiesce(record); });
      return true;
    }

    function registerSemanticAction(actionId, activate, resolvePayload) {
      if (typeof actionId !== "string" || !actionId || typeof activate !== "function") return false;
      semanticActions.set(actionId, Object.freeze({
        activate: activate,
        resolvePayload: typeof resolvePayload === "function" ? resolvePayload : null
      }));
      return true;
    }

    function unregisterSemanticAction(actionId) {
      return semanticActions.delete(actionId);
    }

    function dispatchPointerSemanticAction(eventOrId, actionId, payload, activate) {
      const id = finitePointerId(eventOrId);
      if (id === null) return false;
      const record = activeByPointer.get(id) || terminalByPointer.get(id);
      if (!record || record.kind !== "touch") return false;
      if (record.state === STATES.TRACKING) transition(record, STATES.VALIDATED);
      if (record.state !== STATES.VALIDATED) return false;
      credit(record);
      if (activeByPointer.get(id) === record) activeByPointer.delete(id);
      if (!activeByPointer.has(id)) terminalByPointer.set(id, record);
      const registered = semanticActions.get(actionId);
      const semanticAction = typeof activate === "function"
        ? activate : (registered && registered.activate);
      return dispatchSemanticAction(actionId, payload, record.token, semanticAction);
    }

    function snapshot() {
      return Array.from(ledger.values()).map(function(record) {
        return Object.freeze({
          token: record.token,
          pointerId: record.pointerId,
          generation: record.generation,
          pointerType: record.pointerType,
          state: record.state,
          claimCount: record.claimCount,
          activationCount: record.activationCount,
          cleanupCount: record.cleanupCount,
          suppressionCredit: record.suppressionCredit,
          suppressionConsumed: record.suppressionConsumed,
          transitions: Object.freeze(record.transitions.slice())
        });
      });
    }

    documentRef.addEventListener("pointerdown", onPointerDown, true);
    documentRef.addEventListener("pointermove", onPointerMove, true);
    documentRef.addEventListener("pointerup", onPointerUp, true);
    documentRef.addEventListener("pointerup", onPointerUpAfterPropagation, false);
    documentRef.addEventListener("pointercancel", onPointerCancel, true);
    documentRef.addEventListener("contextmenu", onContextMenu, true);
    documentRef.addEventListener("touchcancel", onTouchCancel, true);
    documentRef.addEventListener("click", onClick, true);

    return Object.freeze({
      consumePointer: consumePointer,
      invalidate: invalidate,
      dispatchSemanticAction: dispatchSemanticAction,
      dispatchPointerSemanticAction: dispatchPointerSemanticAction,
      registerSemanticAction: registerSemanticAction,
      unregisterSemanticAction: unregisterSemanticAction,
      states: STATES,
      _test: Object.freeze({
        actionRoot: actionRoot,
        activeGestureCount: function() { return activeByPointer.size; },
        tombstoneCount: suppressionCount,
        nativeOwnerCount: function() {
          return Array.from(ledger.values()).filter(function(record) {
            return record.kind === "native" && record.state === STATES.ACTIVATED_AWAIT_CLICK;
          }).length;
        },
        ledgerSnapshot: snapshot,
        compactedRecordCount: function() { return compactedRecords; },
        staleCreditCount: staleCreditCount
      })
    });
  }

  CatInc.touchActivation = Object.freeze({
    STATES: STATES,
    createController: createController,
    install: function(documentRef, scheduleMicrotask, scheduleTask) {
      return createController({ document: documentRef, queueMicrotask: scheduleMicrotask, setTimeout: scheduleTask });
    }
  });
  if (root.document && typeof root.queueMicrotask === "function") {
    CatInc.touchActivationController = CatInc.touchActivation.install(
      root.document,
      root.queueMicrotask.bind(root),
      typeof root.setTimeout === "function" ? root.setTimeout.bind(root) : null
    );
  }
})(typeof window !== "undefined" ? window : globalThis);
