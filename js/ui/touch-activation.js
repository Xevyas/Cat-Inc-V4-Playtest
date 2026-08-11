(function(root) {
  "use strict";

  const CatInc = root.CatInc = root.CatInc || {};
  const ACTION_SELECTOR = [
    "button",
    "a[href]",
    "summary",
    "[role='button']",
    "[role='menuitem']",
    "[role='tab']",
    "[data-clavier-clic]",
    "[onclick]"
  ].join(",");
  const EXTERNAL_TOUCH_SELECTOR = "#camp-prototype-items [data-camp-uid]";
  const MANUAL_GESTURE_SELECTOR = [
    "input",
    "select",
    "textarea",
    "[contenteditable='true']",
    "[role='slider']",
    "#camp-prototype-placement-actions",
    EXTERNAL_TOUCH_SELECTOR,
    ".recruit-pitch-btn",
    "[data-touch-activation='manual']"
  ].join(",");
  const TAP_MOVE_TOLERANCE = 8;
  const TAP_MAX_DURATION_MS = 450;
  const MAX_TOUCH_TOMBSTONES = 64;
  const MAX_NATIVE_OWNERS = 32;

  function createController(options) {
    const documentRef = options.document;
    const scheduleMicrotask = options.queueMicrotask;
    const touchCycles = new Map();
    const endedTouchCycles = new Map();
    const activeTouchPointers = new Set();
    const touchTombstones = [];
    const nativeCycles = new Map();
    const nativeOwners = [];
    const pendingTouchActivations = new Map();
    let generation = 0;

    function finitePointerId(eventOrId) {
      const raw = eventOrId && typeof eventOrId === "object"
        ? eventOrId.pointerId : eventOrId;
      if (raw === null || raw === undefined || raw === "") return null;
      const value = Number(raw);
      return Number.isFinite(value) ? value : null;
    }

    function actionRoot(target) {
      if (!target || typeof target.closest !== "function") return null;
      if (target.closest(MANUAL_GESTURE_SELECTOR)) return null;
      const action = target.closest(ACTION_SELECTOR);
      if (!action || action.disabled || action.getAttribute("aria-disabled") === "true") return null;
      return action;
    }

    function eventTimestamp(event) {
      const value = Number(event && event.timeStamp);
      return Number.isFinite(value) && value >= 0 ? value : 0;
    }

    function sameBranch(first, second) {
      return Boolean(first && second && (
        first === second
        || (typeof first.contains === "function" && first.contains(second))
        || (typeof second.contains === "function" && second.contains(first))
      ));
    }

    function addTombstone(cycle) {
      if (!cycle) return false;
      touchTombstones.push({ pointerId: cycle.pointerId, generation: cycle.generation });
      if (touchTombstones.length > MAX_TOUCH_TOMBSTONES) touchTombstones.shift();
      return true;
    }

    function consumeTombstone(pointerId) {
      const index = touchTombstones.findIndex(function(entry) {
        return entry.pointerId === pointerId;
      });
      if (index < 0) return null;
      return touchTombstones.splice(index, 1)[0];
    }

    function addNativeOwner(cycle) {
      nativeOwners.push(cycle);
      if (nativeOwners.length > MAX_NATIVE_OWNERS) nativeOwners.shift();
    }

    function consumeNativeOwner(event, pointerId) {
      const index = nativeOwners.findIndex(function(owner) {
        return owner.pointerId === pointerId
          && owner.pointerType === event.pointerType
          && sameBranch(owner.target, event.target)
          && Math.hypot(
            (Number(event.clientX) || 0) - owner.clientX,
            (Number(event.clientY) || 0) - owner.clientY
          ) <= TAP_MOVE_TOLERANCE;
      });
      if (index < 0) return null;
      return nativeOwners.splice(index, 1)[0];
    }

    function invalidate(pointerId) {
      const id = finitePointerId(pointerId);
      if (id === null) return false;
      const cycle = endedTouchCycles.get(id) || touchCycles.get(id);
      touchCycles.delete(id);
      endedTouchCycles.delete(id);
      if (cycle) return addTombstone(cycle);
      return touchTombstones.some(function(entry) { return entry.pointerId === id; });
    }

    function consumePointer(eventOrId) {
      const id = finitePointerId(eventOrId);
      if (id === null) return false;
      const cycle = endedTouchCycles.get(id) || touchCycles.get(id);
      if (!cycle) return false;
      touchCycles.delete(id);
      endedTouchCycles.delete(id);
      return addTombstone(cycle);
    }

    function onPointerDown(event) {
      const pointerId = finitePointerId(event);
      if (pointerId === null) return;
      if (event.pointerType === "mouse" || event.pointerType === "pen") {
        if (event.button > 0 || event.isPrimary === false) return;
        if (nativeCycles.size >= MAX_NATIVE_OWNERS) {
          nativeCycles.delete(nativeCycles.keys().next().value);
        }
        nativeCycles.set(pointerId, {
          pointerId: pointerId,
          pointerType: event.pointerType,
          target: event.target,
          clientX: Number(event.clientX) || 0,
          clientY: Number(event.clientY) || 0,
          generation: ++generation
        });
        return;
      }
      if (event.pointerType !== "touch") return;
      activeTouchPointers.add(pointerId);
      if (activeTouchPointers.size > 1) {
        touchCycles.forEach(addTombstone);
        touchCycles.clear();
        endedTouchCycles.clear();
        return;
      }
      if (event.button > 0 || event.isPrimary === false) return;
      const rootAction = actionRoot(event.target);
      const externalTouch = event.target && typeof event.target.closest === "function"
        ? event.target.closest(EXTERNAL_TOUCH_SELECTOR) : null;
      const manualTarget = event.target && typeof event.target.closest === "function"
        ? event.target.closest("[data-touch-activation='manual']") : null;
      if (!rootAction && !externalTouch && !manualTarget) return;
      touchCycles.set(pointerId, {
        pointerId: pointerId,
        generation: ++generation,
        root: rootAction,
        external: Boolean(externalTouch),
        manual: Boolean(manualTarget),
        startX: Number(event.clientX) || 0,
        startY: Number(event.clientY) || 0,
        startTime: eventTimestamp(event)
      });
    }

    function onPointerMove(event) {
      const pointerId = finitePointerId(event);
      const gesture = pointerId === null ? null : touchCycles.get(pointerId);
      if (!gesture) return;
      const distance = Math.hypot(
        (Number(event.clientX) || 0) - gesture.startX,
        (Number(event.clientY) || 0) - gesture.startY
      );
      if (distance > TAP_MOVE_TOLERANCE) invalidate(pointerId);
    }

    function onPointerUp(event) {
      const pointerId = finitePointerId(event);
      if (pointerId === null) return;
      if (event.pointerType === "mouse" || event.pointerType === "pen") {
        const nativeCycle = nativeCycles.get(pointerId);
        nativeCycles.delete(pointerId);
        if (nativeCycle && nativeCycle.pointerType === event.pointerType
          && sameBranch(nativeCycle.target, event.target)) {
          nativeCycle.target = event.target;
          nativeCycle.clientX = Number(event.clientX) || 0;
          nativeCycle.clientY = Number(event.clientY) || 0;
          addNativeOwner(nativeCycle);
        }
        return;
      }
      if (event.pointerType !== "touch") return;
      activeTouchPointers.delete(pointerId);
      const gesture = touchCycles.get(pointerId);
      touchCycles.delete(pointerId);
      if (!gesture) return;
      endedTouchCycles.set(pointerId, gesture);
      scheduleMicrotask(function() {
        if (endedTouchCycles.get(pointerId) === gesture) endedTouchCycles.delete(pointerId);
      });
      const duration = eventTimestamp(event) - gesture.startTime;
      if (duration < 0 || duration > TAP_MAX_DURATION_MS) {
        endedTouchCycles.delete(pointerId);
        addTombstone(gesture);
        return;
      }
      // Manual owners (such as the Camp production dismiss surface) have no
      // synthetic activation, but still own and shield their compatibility
      // click through the same bounded tombstone authority.
      if (!gesture.root) {
        // Camp item gestures have their own pointerup consumer below. The
        // structural dismiss surface is manual but not an external Camp item,
        // so it is the only rootless path armed here.
        if (!gesture.external) addTombstone(gesture);
        return;
      }
      if (actionRoot(event.target) !== gesture.root) {
        endedTouchCycles.delete(pointerId);
        addTombstone(gesture);
        return;
      }
      addTombstone(gesture);
      // Do not synthesize the activation from the capture listener.  A
      // microtask queued there can run before a platform has finished the
      // physical pointerup dispatch, allowing newly-rendered UI to receive
      // the compatibility click.  The bubble boundary below observes the
      // completed event first; the tombstone is already armed here.
      pendingTouchActivations.set(pointerId, { gesture: gesture, target: event.target });
    }

    function onPointerUpAfterPropagation(event) {
      const pointerId = finitePointerId(event);
      if (pointerId === null || event.pointerType !== "touch") return;
      const pending = pendingTouchActivations.get(pointerId);
      if (!pending) return;
      pendingTouchActivations.delete(pointerId);
      endedTouchCycles.delete(pointerId);
      if (actionRoot(event.target) !== pending.gesture.root) return;
      scheduleMicrotask(function() {
        const gesture = pending.gesture;
        if (gesture.root.isConnected === false
          || gesture.root.disabled
          || gesture.root.getAttribute("aria-disabled") === "true") return;
        gesture.root.click();
      });
    }

    function onPointerCancel(event) {
      const pointerId = finitePointerId(event);
      if (pointerId === null) return;
      activeTouchPointers.delete(pointerId);
      pendingTouchActivations.delete(pointerId);
      invalidate(pointerId);
      nativeCycles.delete(pointerId);
    }

    function onContextMenu(event) {
      const pointerId = finitePointerId(event);
      if (pointerId !== null) invalidate(pointerId);
      else {
        touchCycles.clear();
        endedTouchCycles.clear();
      }
    }

    function onTouchCancel() {
      touchCycles.clear();
      endedTouchCycles.clear();
      pendingTouchActivations.clear();
      activeTouchPointers.clear();
    }

    function onClick(event) {
      const pointerId = finitePointerId(event);
      if (pointerId === null || consumeNativeOwner(event, pointerId)) return;
      if (!consumeTombstone(pointerId)) return;
      event.preventDefault();
      event.stopPropagation();
      if (typeof event.stopImmediatePropagation === "function") event.stopImmediatePropagation();
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
      _test: Object.freeze({
        actionRoot: actionRoot,
        activeGestureCount: function() { return touchCycles.size; },
        tombstoneCount: function() { return touchTombstones.length; },
        nativeOwnerCount: function() { return nativeOwners.length; }
      })
    });
  }

  CatInc.touchActivation = Object.freeze({
    createController: createController,
    install: function(documentRef, scheduleMicrotask) {
      return createController({
        document: documentRef,
        queueMicrotask: scheduleMicrotask
      });
    }
  });
  if (root.document && typeof root.queueMicrotask === "function") {
    CatInc.touchActivationController = CatInc.touchActivation.install(
      root.document,
      root.queueMicrotask.bind(root)
    );
  }
})(typeof window !== "undefined" ? window : globalThis);
