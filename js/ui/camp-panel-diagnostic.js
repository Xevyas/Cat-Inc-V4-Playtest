(function(global) {
  "use strict";

  const root = global.CatInc = global.CatInc || {};
  const query = typeof global.location !== "undefined" ? global.location.search : "";
  const enabled = /(?:^|[?&])campPanelDiag=1(?:&|$)/.test(query);
  const MAX_EVENTS = 160;
  const MAX_SNAPSHOTS = 80;
  const MAX_STACK_LINES = 6;
  const state = enabled ? {
    startedAt: new Date().toISOString(),
    gameVersion: null,
    events: [],
    snapshots: [],
    counts: { open: 0, close: 0 },
    lastOpen: null,
    lastClose: null,
    getUiState: null
  } : null;

  function finite(value) {
    const number = Number(value);
    return Number.isFinite(number) ? number : null;
  }

  function elementLabel(element) {
    if (!element || element.nodeType !== 1) return null;
    const id = element.id ? "#" + element.id : "";
    const classes = typeof element.className === "string" && element.className.trim()
      ? "." + element.className.trim().split(/\s+/).slice(0, 5).join(".") : "";
    return String(element.tagName || "element").toLowerCase() + id + classes;
  }

  function rect(element) {
    if (!element || typeof element.getBoundingClientRect !== "function") return null;
    const value = element.getBoundingClientRect();
    return {
      x: finite(value.x), y: finite(value.y), left: finite(value.left), top: finite(value.top),
      right: finite(value.right), bottom: finite(value.bottom), width: finite(value.width),
      height: finite(value.height)
    };
  }

  function computed(element) {
    if (!element || typeof global.getComputedStyle !== "function") return null;
    const style = global.getComputedStyle(element);
    return {
      display: style.display, visibility: style.visibility, opacity: style.opacity,
      position: style.position, zIndex: style.zIndex, pointerEvents: style.pointerEvents,
      transform: style.transform, transformOrigin: style.transformOrigin,
      overflow: style.overflow, overflowX: style.overflowX, overflowY: style.overflowY,
      clipPath: style.clipPath, contain: style.contain, isolation: style.isolation,
      filter: style.filter, perspective: style.perspective, inset: style.inset,
      top: style.top, right: style.right, bottom: style.bottom, left: style.left,
      width: style.width, height: style.height, maxWidth: style.maxWidth,
      maxHeight: style.maxHeight
    };
  }

  function elementData(element) {
    if (!element) return null;
    return {
      label: elementLabel(element),
      isConnected: Boolean(element.isConnected),
      hidden: Boolean(element.hidden),
      ariaHidden: element.getAttribute ? element.getAttribute("aria-hidden") : null,
      className: typeof element.className === "string" ? element.className : null,
      dataset: element.dataset ? {
        campUid: element.dataset.campUid || null,
        campBuildingId: element.dataset.campBuildingId || null,
        interactionKind: element.dataset.interactionKind || null,
        workFamily: element.dataset.workFamily || null
      } : null,
      parent: elementLabel(element.parentElement),
      clientRectsLength: typeof element.getClientRects === "function"
        ? element.getClientRects().length : null,
      rect: rect(element),
      offsetWidth: finite(element.offsetWidth), offsetHeight: finite(element.offsetHeight),
      clientWidth: finite(element.clientWidth), clientHeight: finite(element.clientHeight),
      scrollWidth: finite(element.scrollWidth), scrollHeight: finite(element.scrollHeight),
      scrollLeft: finite(element.scrollLeft), scrollTop: finite(element.scrollTop),
      computed: computed(element)
    };
  }

  function parentChain(element) {
    const chain = [];
    let current = element && element.parentElement;
    while (current && chain.length < 24) {
      const style = computed(current) || {};
      chain.push({
        label: elementLabel(current), rect: rect(current), position: style.position,
        overflow: style.overflow, overflowX: style.overflowX, overflowY: style.overflowY,
        transform: style.transform, filter: style.filter, perspective: style.perspective,
        contain: style.contain, isolation: style.isolation, zIndex: style.zIndex,
        clipPath: style.clipPath, visibility: style.visibility, opacity: style.opacity
      });
      if (current === document.body) break;
      current = current.parentElement;
    }
    return chain;
  }

  function visualViewportData() {
    const viewport = global.visualViewport;
    if (!viewport) return null;
    return {
      width: finite(viewport.width), height: finite(viewport.height),
      offsetLeft: finite(viewport.offsetLeft), offsetTop: finite(viewport.offsetTop),
      pageLeft: finite(viewport.pageLeft), pageTop: finite(viewport.pageTop),
      scale: finite(viewport.scale)
    };
  }

  function visibleViewportRect() {
    const viewport = visualViewportData();
    const left = viewport && viewport.offsetLeft !== null ? viewport.offsetLeft : 0;
    const top = viewport && viewport.offsetTop !== null ? viewport.offsetTop : 0;
    const width = viewport && viewport.width !== null ? viewport.width : finite(global.innerWidth) || 0;
    const height = viewport && viewport.height !== null ? viewport.height : finite(global.innerHeight) || 0;
    return { left: left, top: top, right: left + width, bottom: top + height, width: width, height: height };
  }

  function intersects(a, b) {
    return Boolean(a && b && a.width > 0 && a.height > 0
      && a.right > b.left && a.left < b.right && a.bottom > b.top && a.top < b.bottom);
  }

  function hitTesting(menu, menuRect, viewportRect) {
    if (!menu || !intersects(menuRect, viewportRect) || typeof document.elementFromPoint !== "function") return [];
    const left = Math.max(menuRect.left, viewportRect.left);
    const top = Math.max(menuRect.top, viewportRect.top);
    const right = Math.min(menuRect.right, viewportRect.right);
    const bottom = Math.min(menuRect.bottom, viewportRect.bottom);
    const points = [
      [(left + right) / 2, (top + bottom) / 2],
      [left + (right - left) * .25, top + (bottom - top) * .25],
      [left + (right - left) * .75, top + (bottom - top) * .75]
    ];
    return points.map(function(point) {
      const above = document.elementFromPoint(point[0], point[1]);
      return {
        x: Math.round(point[0]), y: Math.round(point[1]), element: elementLabel(above),
        belongsToMenu: Boolean(above && (above === menu || menu.contains(above)))
      };
    });
  }

  function clippingAncestor(chain, menuRect) {
    return (chain || []).find(function(entry) {
      const overflow = [entry.overflow, entry.overflowX, entry.overflowY];
      const clips = overflow.some(function(value) { return value && value !== "visible"; })
        || (entry.clipPath && entry.clipPath !== "none");
      return clips && entry.rect && menuRect && !intersects(entry.rect, menuRect);
    }) || null;
  }

  function classify(menuData, viewportRect, chain, hits) {
    if (!menuData) return "not-created";
    if (!menuData.isConnected) return "disconnected";
    if (menuData.hidden) return "hidden-attribute";
    if (menuData.computed && menuData.computed.display === "none") return "display-none";
    if (menuData.computed && menuData.computed.visibility === "hidden") return "visibility-hidden";
    if (!menuData.rect || !menuData.rect.width || !menuData.rect.height) return "zero-size";
    const layoutWidth = finite(global.innerWidth) || 0;
    const layoutHeight = finite(global.innerHeight) || 0;
    const layoutViewport = {
      left: 0, top: 0, right: layoutWidth, bottom: layoutHeight,
      width: layoutWidth, height: layoutHeight
    };
    if (!intersects(menuData.rect, layoutViewport)) return "offscreen-layout-viewport";
    if (!intersects(menuData.rect, viewportRect)) return "offscreen-visual-viewport";
    if (clippingAncestor(chain, menuData.rect)) return "likely-clipped-by-ancestor";
    if (hits && hits.length && hits.every(function(hit) { return !hit.belongsToMenu; })) return "covered-by-element";
    if (hits && hits.some(function(hit) { return hit.belongsToMenu; })) return "geometrically-visible";
    return "unknown";
  }

  function shortStack() {
    let stack = "";
    try { stack = String(new Error().stack || ""); } catch (error) { return []; }
    const origin = global.location && global.location.origin ? global.location.origin : "";
    const search = global.location && global.location.search ? global.location.search : "";
    return stack.split("\n").slice(2, 2 + MAX_STACK_LINES).map(function(line) {
      return line.replace(origin, "").replace(search, "").trim().slice(0, 220);
    });
  }

  function environment() {
    const orientation = global.screen && global.screen.orientation;
    return {
      gameVersion: state.gameVersion,
      pathname: global.location ? global.location.pathname : null,
      queryFlags: {
        campPanelDiag: enabled,
        debug: /(?:^|[?&])debug=1(?:&|$)/.test(query)
      },
      userAgent: global.navigator ? global.navigator.userAgent : null,
      platform: global.navigator && global.navigator.platform ? global.navigator.platform : null,
      devicePixelRatio: finite(global.devicePixelRatio),
      screen: global.screen ? {
        width: finite(global.screen.width), height: finite(global.screen.height),
        availWidth: finite(global.screen.availWidth), availHeight: finite(global.screen.availHeight)
      } : null,
      window: {
        innerWidth: finite(global.innerWidth), innerHeight: finite(global.innerHeight),
        scrollX: finite(global.scrollX), scrollY: finite(global.scrollY)
      },
      orientation: orientation ? { type: orientation.type || null, angle: finite(orientation.angle) } : null,
      visualViewport: visualViewportData()
    };
  }

  function surface(selector) {
    const element = selector.charAt(0) === "#"
      ? document.getElementById(selector.slice(1)) : document.querySelector(selector);
    return elementData(element);
  }

  function capture(label, details) {
    if (!enabled) return null;
    const menu = document.getElementById("camp-prototype-interaction-menu");
    const menuData = elementData(menu);
    const viewportRect = visibleViewportRect();
    const chain = parentChain(menu);
    const hits = hitTesting(menu, menuData && menuData.rect, viewportRect);
    let uiState = {};
    try { uiState = state.getUiState ? state.getUiState() || {} : {}; } catch (error) {
      uiState = { providerError: String(error && error.message || error) };
    }
    const sawmill = document.querySelector('[data-camp-type="sawmill"]');
    const snapshot = {
      label: String(label || "SNAPSHOT"), atMs: Math.round(performance.now()), details: details || null,
      environment: environment(), uiState: Object.assign({}, uiState, {
        menuOpenCount: state.counts.open, menuCloseCount: state.counts.close,
        lastOpenReason: state.lastOpen && state.lastOpen.reason,
        lastOpenCaller: state.lastOpen && state.lastOpen.stack,
        lastCloseReason: state.lastClose && state.lastClose.reason,
        lastCloseCaller: state.lastClose && state.lastClose.stack
      }),
      menu: menuData,
      menuParentChain: chain,
      sawmill: sawmill ? Object.assign(elementData(sawmill), {
        ariaExpanded: sawmill.getAttribute("aria-expanded")
      }) : null,
      surfaces: {
        visualViewport: viewportRect,
        viewport: surface(".camp-prototype-viewport"),
        map: surface(".camp-prototype-map"),
        board: surface("#camp-prototype-board"),
        stage: surface(".camp-prototype-stage"),
        main: surface("#contenu-principal")
      },
      hitTesting: hits,
      classification: classify(menuData, viewportRect, chain, hits)
    };
    state.snapshots.push(snapshot);
    if (state.snapshots.length > MAX_SNAPSHOTS) state.snapshots.shift();
    return snapshot;
  }

  function recordCall(name, details) {
    if (!enabled) return null;
    const stack = shortStack();
    const event = { name: String(name), atMs: Math.round(performance.now()), details: details || null, stack: stack };
    if (name === "ouvrirMenuInteractionCampPrototype") {
      state.counts.open += 1;
      state.lastOpen = { reason: details && details.reason || null, stack: stack };
    } else if (name === "fermerMenuInteractionCampPrototype") {
      state.counts.close += 1;
      state.lastClose = { reason: details && details.reason || null, stack: stack };
    }
    state.events.push(event);
    if (state.events.length > MAX_EVENTS) state.events.shift();
    return event;
  }

  function scheduleOpenSnapshots(details) {
    if (!enabled) return;
    global.requestAnimationFrame(function() {
      capture("NEXT_ANIMATION_FRAME", details);
      global.requestAnimationFrame(function() { capture("SECOND_ANIMATION_FRAME", details); });
    });
    global.setTimeout(function() { capture("+100ms", details); }, 100);
    global.setTimeout(function() { capture("+700ms", details); }, 700);
  }

  function report() {
    if (!enabled) return null;
    return {
      schema: "cat-inc-camp-panel-diagnostic-v1",
      generatedAt: new Date().toISOString(),
      startedAt: state.startedAt,
      environment: environment(),
      counts: state.counts,
      events: state.events.slice(),
      snapshots: state.snapshots.slice()
    };
  }

  function showFallback(json) {
    let fallback = document.getElementById("camp-panel-diag-fallback");
    if (!fallback) {
      fallback = document.createElement("div");
      fallback.id = "camp-panel-diag-fallback";
      fallback.innerHTML = '<label>Copy diagnostic JSON<textarea readonly></textarea></label>'
        + '<button type="button">Close</button>';
      fallback.querySelector("button").addEventListener("click", function() { fallback.remove(); });
      document.body.appendChild(fallback);
    }
    const textarea = fallback.querySelector("textarea");
    textarea.value = json;
    textarea.focus();
    textarea.select();
  }

  async function copyReport(status) {
    capture("COPY_REQUESTED", null);
    const json = JSON.stringify(report(), null, 2);
    try {
      if (!global.navigator || !global.navigator.clipboard || !global.navigator.clipboard.writeText) {
        throw new Error("Clipboard API unavailable");
      }
      await global.navigator.clipboard.writeText(json);
      status.textContent = "Copied";
    } catch (error) {
      showFallback(json);
      status.textContent = "Select JSON";
    }
  }

  function createControl() {
    if (!enabled || document.getElementById("camp-panel-diag-control")) return;
    const control = document.createElement("aside");
    control.id = "camp-panel-diag-control";
    control.setAttribute("aria-label", "Camp production panel diagnostic");
    control.innerHTML = '<span>Panel diag</span><button type="button">Copy JSON</button><output aria-live="polite"></output>';
    const status = control.querySelector("output");
    control.querySelector("button").addEventListener("click", function() { copyReport(status); });
    document.body.appendChild(control);
  }

  root.campPanelDiagnostic = {
    enabled: enabled,
    configure: function(options) {
      if (!enabled) return false;
      state.gameVersion = options && options.gameVersion || null;
      state.getUiState = options && typeof options.getUiState === "function" ? options.getUiState : null;
      createControl();
      capture("DIAGNOSTIC_READY", null);
      return true;
    },
    recordCall: recordCall,
    capture: capture,
    scheduleOpenSnapshots: scheduleOpenSnapshots,
    report: report,
    _test: { classify: classify, intersects: intersects }
  };
})(typeof window !== "undefined" ? window : globalThis);
