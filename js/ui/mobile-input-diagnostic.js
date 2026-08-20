(function(global) {
  "use strict";

  const root = global.CatInc = global.CatInc || {};
  const query = global.location && typeof global.location.search === "string"
    ? global.location.search : "";
  const enabled = /(?:^|[?&])mobileInputDiag=1(?:&|$)/.test(query);
  const MAX_EVENTS = 160;
  const MAX_OUTCOMES = 80;
  const MAX_INTERACTIONS = 64;
  const MAX_MARKERS_PER_INTERACTION = 32;
  const MAX_EXCEPTIONS = 48;
  const FRAME_GAP_MS = 50;
  const SLOW_THRESHOLDS = Object.freeze({ tick: 24, renduDynamique: 24, rendu: 40 });
  const state = enabled ? {
    startedAt: new Date().toISOString(),
    startedAtMs: now(),
    events: [], outcomes: [], interactions: [], interactionById: new Map(),
    pointerCorrelations: new Map(), pointerSequences: new Map(),
    lastCorrelation: null, getUiState: null, getCampEvidence: null,
    installed: false, frameSamplingInstalled: false, gameVersion: null,
    performance: {
      timings: { tick: summary(), renduDynamique: summary(), rendu: summary() },
      frameIntervals: summary(), exceptions: []
    }
  } : null;

  function now() {
    return global.performance && typeof global.performance.now === "function"
      ? global.performance.now() : Date.now();
  }

  function summary() { return { count: 0, totalMs: 0, maxMs: 0, slowCount: 0 }; }

  function finite(value) {
    const number = Number(value);
    return Number.isFinite(number) ? number : null;
  }

  function relativeMs(value) {
    return Math.max(0, Math.round((value === undefined ? now() : value) - state.startedAtMs));
  }

  function label(node) {
    if (!node) return null;
    if (node === global) return "window";
    if (typeof document !== "undefined" && node === document) return "document";
    if (node.nodeType !== 1) return String(node.nodeName || "node").toLowerCase();
    const id = node.id ? "#" + node.id : "";
    const classes = typeof node.className === "string" && node.className.trim()
      ? "." + node.className.trim().split(/\s+/).slice(0, 4).join(".") : "";
    return String(node.tagName || "element").toLowerCase() + id + classes;
  }

  function uiState() {
    if (!state || !state.getUiState) return {};
    try { return state.getUiState() || {}; }
    catch (error) { return { providerError: String(error && error.message || error) }; }
  }

  function activeDialog() {
    if (typeof document === "undefined") return null;
    const dialogs = Array.from(document.querySelectorAll('[role="dialog"]'));
    const open = dialogs.find(function(dialog) {
      return dialog.getAttribute("aria-hidden") !== "true"
        && !dialog.hidden && (!dialog.style || dialog.style.display !== "none");
    });
    return label(open);
  }

  function eventPoint(event) {
    const touch = event.changedTouches && event.changedTouches[0]
      || event.touches && event.touches[0];
    return {
      x: finite(touch ? touch.clientX : event.clientX),
      y: finite(touch ? touch.clientY : event.clientY)
    };
  }

  function pushBounded(list, entry, maximum) {
    list.push(entry);
    if (list.length > maximum) list.shift();
  }

  function pruneInteraction(interaction) {
    if (!interaction) return;
    state.interactionById.delete(interaction.id);
    Array.from(state.pointerCorrelations.entries()).forEach(function(entry) {
      if (entry[1] === interaction.id) state.pointerCorrelations.delete(entry[0]);
    });
  }

  function ensureInteraction(correlationId, details, at) {
    if (!correlationId) return null;
    let interaction = state.interactionById.get(correlationId);
    if (interaction) return interaction;
    interaction = {
      id: correlationId,
      gestureToken: details && details.gestureToken || null,
      pointerId: finite(details && details.pointerId),
      pointerType: details && details.pointerType || null,
      target: details && details.target || null,
      startedRelativeMs: relativeMs(at), action: null, markers: [], overlaps: []
    };
    state.interactions.push(interaction);
    state.interactionById.set(correlationId, interaction);
    if (state.interactions.length > MAX_INTERACTIONS) pruneInteraction(state.interactions.shift());
    return interaction;
  }

  function correlationForPointer(pointerId, create, event) {
    const id = finite(pointerId);
    if (id === null) return null;
    const existing = state.pointerCorrelations.get(id);
    if (existing) return existing;
    if (!create) return null;
    const sequence = (state.pointerSequences.get(id) || 0) + 1;
    state.pointerSequences.set(id, sequence);
    const correlationId = "pointer:" + id + ":" + sequence;
    state.pointerCorrelations.set(id, correlationId);
    ensureInteraction(correlationId, {
      pointerId: id, pointerType: event && event.pointerType || null,
      target: event && (event.target ? label(event.target) : event.target)
    });
    return correlationId;
  }

  function recentCorrelation(eventOrToken) {
    if (eventOrToken && typeof eventOrToken === "object") {
      if (eventOrToken.id && state.interactionById.has(eventOrToken.id)) return eventOrToken.id;
      const byPointer = correlationForPointer(eventOrToken.pointerId, false);
      if (byPointer) return byPointer;
    }
    if (!state.lastCorrelation) return null;
    return now() - state.lastCorrelation.at <= 1500 ? state.lastCorrelation.id : null;
  }

  function addMarker(interaction, phase, name, details, at) {
    if (!interaction) return null;
    const marker = {
      relativeMs: relativeMs(at), phase: phase, name: name, details: details || null
    };
    pushBounded(interaction.markers, marker, MAX_MARKERS_PER_INTERACTION);
    state.lastCorrelation = { id: interaction.id, at: at === undefined ? now() : at };
    return marker;
  }

  function eventData(event, listenerPhase, correlationId) {
    const point = eventPoint(event);
    let path = [];
    try { path = typeof event.composedPath === "function" ? event.composedPath() : []; }
    catch (error) { path = []; }
    const hit = point.x === null || point.y === null || !document.elementFromPoint
      ? null : document.elementFromPoint(point.x, point.y);
    const currentUi = uiState();
    return {
      relativeMs: relativeMs(), correlationId: correlationId,
      type: event.type || null, listenerPhase: listenerPhase,
      eventPhase: finite(event.eventPhase), target: label(event.target),
      currentTarget: label(event.currentTarget),
      composedPath: path.slice(0, 12).map(label).filter(Boolean),
      clientX: point.x, clientY: point.y,
      pointerId: finite(event.pointerId), pointerType: event.pointerType || null,
      isPrimary: typeof event.isPrimary === "boolean" ? event.isPrimary : null,
      button: finite(event.button), detail: finite(event.detail),
      isTrusted: typeof event.isTrusted === "boolean" ? event.isTrusted : null,
      cancelable: Boolean(event.cancelable), defaultPrevented: Boolean(event.defaultPrevented),
      firesTouchEvents: event.sourceCapabilities
        && typeof event.sourceCapabilities.firesTouchEvents === "boolean"
        ? event.sourceCapabilities.firesTouchEvents : null,
      elementFromPoint: label(hit), activeElement: label(document.activeElement),
      activeTab: document.body && document.body.dataset.ongletActif || currentUi.activeTab || null,
      openDialog: activeDialog()
    };
  }

  function recordEvent(phase) {
    return function(event) {
      if (!enabled) return;
      const create = event.type === "pointerdown" || event.type === "touchstart";
      let correlationId = correlationForPointer(event.pointerId, create, event);
      if (!correlationId && event.type === "click") correlationId = recentCorrelation(event);
      const data = eventData(event, phase, correlationId);
      pushBounded(state.events, data, MAX_EVENTS);
      if (phase === "capture" && correlationId) {
        const interaction = ensureInteraction(correlationId, {
          pointerId: event.pointerId, pointerType: event.pointerType, target: label(event.target)
        });
        addMarker(interaction, "input", "input." + (event.type || "event"), {
          target: label(event.target), trusted: data.isTrusted
        });
      }
      if (/^(?:pointerup|pointercancel|touchend|touchcancel)$/.test(event.type)) {
        const pointerId = finite(event.pointerId);
        if (pointerId !== null && typeof global.setTimeout === "function") global.setTimeout(function() {
          if (state.pointerCorrelations.get(pointerId) === correlationId) {
            state.pointerCorrelations.delete(pointerId);
          }
        }, 1600);
      }
    };
  }

  function recordAuthority(name, details) {
    if (!enabled) return null;
    const data = details || {};
    const gestureToken = data.gestureToken || null;
    const pointerId = finite(data.pointerId);
    let correlationId = gestureToken;
    if (!correlationId) correlationId = correlationForPointer(pointerId, true, data);
    if (pointerId !== null && correlationId) state.pointerCorrelations.set(pointerId, correlationId);
    const interaction = ensureInteraction(correlationId, {
      gestureToken: gestureToken, pointerId: pointerId,
      pointerType: data.pointerType, target: data.target
    });
    return addMarker(interaction, "input-authority", String(name || "decision"), data);
  }

  function campEvidence() {
    if (!state.getCampEvidence) return null;
    try { return state.getCampEvidence() || null; }
    catch (error) { return { providerError: String(error && error.message || error) }; }
  }

  function scheduleUiCompletion(interaction) {
    if (!interaction || typeof global.requestAnimationFrame !== "function") return;
    global.requestAnimationFrame(function(firstAt) {
      addMarker(interaction, "ui-completion", "animation-frame.next", null,
        Number.isFinite(firstAt) ? firstAt : now());
      global.requestAnimationFrame(function(secondAt) {
        addMarker(interaction, "ui-completion", "animation-frame.second", null,
          Number.isFinite(secondAt) ? secondAt : now());
      });
    });
  }

  function recordBusiness(name, details, eventOrToken) {
    if (!enabled) return null;
    const correlationId = recentCorrelation(eventOrToken);
    const interaction = correlationId ? state.interactionById.get(correlationId) : null;
    const currentUi = uiState();
    const payload = Object.assign({}, details || {});
    const activeTab = currentUi.activeTab
      || (typeof document !== "undefined" && document.body && document.body.dataset.ongletActif) || null;
    if (activeTab === "camp" || String(name || "").indexOf("camp.") === 0) {
      payload.camp = campEvidence();
    }
    if (interaction && !interaction.action) interaction.action = String(name || "business.action");
    const marker = addMarker(interaction, "business", String(name || "business.action"), payload);
    scheduleUiCompletion(interaction);
    return marker;
  }

  function recordOutcome(name, details) {
    if (!enabled) return null;
    const entry = {
      relativeMs: relativeMs(), name: String(name || "outcome"), details: details || null,
      uiState: uiState(), correlationId: recentCorrelation(null)
    };
    pushBounded(state.outcomes, entry, MAX_OUTCOMES);
    return entry;
  }

  function updateSummary(target, duration, slow) {
    target.count += 1;
    target.totalMs = Math.round((target.totalMs + duration) * 100) / 100;
    target.maxMs = Math.max(target.maxMs, Math.round(duration * 100) / 100);
    if (slow) target.slowCount += 1;
  }

  function overlappingInteractions(startAt, endAt) {
    return state.interactions.filter(function(interaction) {
      const start = state.startedAtMs + interaction.startedRelativeMs;
      const last = interaction.markers.length
        ? state.startedAtMs + interaction.markers[interaction.markers.length - 1].relativeMs : start;
      return start <= endAt && last + 1500 >= startAt;
    });
  }

  function recordException(kind, name, startAt, duration, threshold) {
    const overlaps = overlappingInteractions(startAt, startAt + duration);
    const sample = {
      relativeMs: relativeMs(startAt), kind: kind, name: name,
      durationMs: Math.round(duration * 100) / 100, thresholdMs: threshold,
      correlationIds: overlaps.map(function(interaction) { return interaction.id; })
    };
    pushBounded(state.performance.exceptions, sample, MAX_EXCEPTIONS);
    overlaps.forEach(function(interaction) {
      pushBounded(interaction.overlaps, {
        kind: kind, name: name, relativeMs: sample.relativeMs, durationMs: sample.durationMs
      }, 12);
    });
  }

  function startTiming(name) {
    return enabled && state.performance.timings[name] ? now() : null;
  }

  function endTiming(name, startedAt, details) {
    if (!enabled || startedAt === null || !state.performance.timings[name]) return null;
    const duration = Math.max(0, now() - startedAt);
    const threshold = SLOW_THRESHOLDS[name];
    const slow = duration >= threshold;
    updateSummary(state.performance.timings[name], duration, slow);
    if (slow) recordException("work", name, startedAt, duration, threshold);
    const correlationId = recentCorrelation(null);
    const interaction = correlationId && state.interactionById.get(correlationId);
    if (interaction) addMarker(interaction, "render", name, Object.assign({
      durationMs: Math.round(duration * 100) / 100
    }, details || {}), startedAt + duration);
    return duration;
  }

  function installFrameSampling() {
    if (!enabled || state.frameSamplingInstalled
        || typeof global.requestAnimationFrame !== "function") return false;
    state.frameSamplingInstalled = true;
    let previous = null;
    function sample(timestamp) {
      const current = Number.isFinite(timestamp) ? timestamp : now();
      if (previous !== null) {
        const gap = Math.max(0, current - previous);
        const significant = gap >= FRAME_GAP_MS;
        updateSummary(state.performance.frameIntervals, gap, significant);
        if (significant) recordException("frame-gap", "requestAnimationFrame", previous, gap, FRAME_GAP_MS);
      }
      previous = current;
      global.requestAnimationFrame(sample);
    }
    global.requestAnimationFrame(sample);
    return true;
  }

  function installListeners() {
    if (!enabled || state.installed || typeof document === "undefined") return false;
    state.installed = true;
    ["touchstart", "touchend", "touchcancel", "pointerdown", "pointerup",
      "pointercancel", "click"].forEach(function(type) {
      document.addEventListener(type, recordEvent("capture"), true);
      document.addEventListener(type, recordEvent("bubble"), false);
    });
    return true;
  }

  function normalizedSummary(value) {
    return {
      count: value.count,
      averageMs: value.count ? Math.round(value.totalMs / value.count * 100) / 100 : 0,
      maxMs: value.maxMs, slowCount: value.slowCount
    };
  }

  function report() {
    if (!enabled) return null;
    return {
      schema: "cat-inc-mobile-input-diagnostic-v2",
      generatedAt: new Date().toISOString(), startedAt: state.startedAt,
      gameVersion: state.gameVersion,
      environment: {
        viewport: { width: finite(global.innerWidth), height: finite(global.innerHeight) },
        visualViewport: global.visualViewport ? {
          width: finite(global.visualViewport.width), height: finite(global.visualViewport.height),
          scale: finite(global.visualViewport.scale)
        } : null,
        devicePixelRatio: finite(global.devicePixelRatio),
        userAgent: global.navigator && global.navigator.userAgent || null
      },
      bounds: {
        events: MAX_EVENTS, outcomes: MAX_OUTCOMES, interactions: MAX_INTERACTIONS,
        markersPerInteraction: MAX_MARKERS_PER_INTERACTION,
        performanceExceptions: MAX_EXCEPTIONS
      },
      interactions: state.interactions.slice(),
      performance: {
        timings: {
          tick: normalizedSummary(state.performance.timings.tick),
          renduDynamique: normalizedSummary(state.performance.timings.renduDynamique),
          rendu: normalizedSummary(state.performance.timings.rendu)
        },
        frameIntervals: normalizedSummary(state.performance.frameIntervals),
        significantFrameGapMs: FRAME_GAP_MS,
        exceptions: state.performance.exceptions.slice()
      },
      events: state.events.slice(), outcomes: state.outcomes.slice()
    };
  }

  function fallback(json) {
    let area = document.getElementById("mobile-input-diag-fallback");
    if (!area) {
      area = document.createElement("textarea");
      area.id = "mobile-input-diag-fallback";
      area.setAttribute("aria-label", "Mobile input diagnostic JSON");
      area.style.cssText = "position:fixed;inset:10%;z-index:2147483647;width:80%;height:70%";
      document.body.appendChild(area);
    }
    area.value = json; area.focus(); area.select();
  }

  async function copy(status) {
    const json = JSON.stringify(report(), null, 2);
    try {
      if (!navigator.clipboard || !navigator.clipboard.writeText) throw new Error("clipboard unavailable");
      await navigator.clipboard.writeText(json); status.textContent = "Copied";
    } catch (error) { fallback(json); status.textContent = "Select JSON"; }
  }

  function createControl() {
    if (!enabled || document.getElementById("mobile-input-diag-control")) return;
    const control = document.createElement("aside");
    control.id = "mobile-input-diag-control";
    control.style.cssText = "position:fixed;right:8px;bottom:8px;z-index:2147483646;background:#fff8e8;border:1px solid #765;padding:6px;border-radius:7px";
    control.innerHTML = '<button type="button">Mobile input diag &middot; Copy JSON</button> <output aria-live="polite"></output>';
    const status = control.querySelector("output");
    control.querySelector("button").addEventListener("click", function() { copy(status); });
    document.body.appendChild(control);
  }

  root.mobileInputDiagnostic = Object.freeze({
    enabled: enabled,
    configure: function(options) {
      if (!enabled) return false;
      state.gameVersion = options && options.gameVersion || null;
      state.getUiState = options && typeof options.getUiState === "function" ? options.getUiState : null;
      state.getCampEvidence = options && typeof options.getCampEvidence === "function"
        ? options.getCampEvidence : null;
      installListeners(); installFrameSampling(); createControl();
      recordOutcome("diagnostic.ready", null); return true;
    },
    recordAuthority: recordAuthority, recordBusiness: recordBusiness,
    recordOutcome: recordOutcome, startTiming: startTiming, endTiming: endTiming,
    report: report
  });
})(typeof window !== "undefined" ? window : globalThis);
