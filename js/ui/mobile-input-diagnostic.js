(function(global) {
  "use strict";

  const root = global.CatInc = global.CatInc || {};
  const query = global.location && typeof global.location.search === "string"
    ? global.location.search : "";
  const enabled = /(?:^|[?&])mobileInputDiag=1(?:&|$)/.test(query);
  const MAX_EVENTS = 240;
  const MAX_OUTCOMES = 120;
  const state = enabled ? {
    startedAt: new Date().toISOString(),
    startedAtMs: typeof performance !== "undefined" ? performance.now() : 0,
    events: [], outcomes: [], getUiState: null, installed: false, gameVersion: null
  } : null;

  function finite(value) {
    const number = Number(value);
    return Number.isFinite(number) ? number : null;
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

  function eventData(event, listenerPhase) {
    const point = eventPoint(event);
    let path = [];
    try { path = typeof event.composedPath === "function" ? event.composedPath() : []; }
    catch (error) { path = []; }
    const hit = point.x === null || point.y === null || !document.elementFromPoint
      ? null : document.elementFromPoint(point.x, point.y);
    const currentUi = uiState();
    return {
      relativeMs: Math.max(0, Math.round(performance.now() - state.startedAtMs)),
      type: event.type || null,
      listenerPhase: listenerPhase,
      eventPhase: finite(event.eventPhase),
      target: label(event.target), currentTarget: label(event.currentTarget),
      composedPath: path.slice(0, 14).map(label).filter(Boolean),
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
      openDialog: activeDialog(), campPendingGesture: currentUi.campPendingGesture || null
    };
  }

  function pushBounded(list, entry, maximum) {
    list.push(entry);
    if (list.length > maximum) list.shift();
  }

  function recordEvent(phase) {
    return function(event) {
      if (!enabled) return;
      pushBounded(state.events, eventData(event, phase), MAX_EVENTS);
    };
  }

  function recordOutcome(name, details) {
    if (!enabled) return null;
    const entry = {
      relativeMs: Math.max(0, Math.round(performance.now() - state.startedAtMs)),
      name: String(name || "outcome"), details: details || null, uiState: uiState()
    };
    pushBounded(state.outcomes, entry, MAX_OUTCOMES);
    return entry;
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

  function report() {
    if (!enabled) return null;
    return {
      schema: "cat-inc-mobile-input-diagnostic-v1",
      generatedAt: new Date().toISOString(), startedAt: state.startedAt,
      gameVersion: state.gameVersion,
      viewport: { width: finite(global.innerWidth), height: finite(global.innerHeight) },
      userAgent: global.navigator && global.navigator.userAgent || null,
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
    area.value = json;
    area.focus(); area.select();
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
      installListeners(); createControl(); recordOutcome("diagnostic.ready", null); return true;
    },
    recordOutcome: recordOutcome,
    report: report
  });
})(typeof window !== "undefined" ? window : globalThis);
