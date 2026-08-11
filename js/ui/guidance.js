(function(root) {
  "use strict";

  const CatInc = root.CatInc = root.CatInc || {};

  function createController(options) {
    const resolveDescriptor = options.resolveDescriptor;
    const readComputedStyle = options.getComputedStyle;
    const documentRef = options.document;
    let reconciling = false;
    let lastObservedDescriptor = null;
    const consumedObservedDescriptors = new WeakSet();

    function resolveCurrentDescriptor() {
      return typeof resolveDescriptor === "function" ? resolveDescriptor() : null;
    }

    function currentDescriptor() {
      const descriptor = resolveCurrentDescriptor();
      lastObservedDescriptor = descriptor;
      return descriptor;
    }

    function closest(element, selector) {
      return element && typeof element.closest === "function" ? element.closest(selector) : null;
    }

    function isElementActionable(element) {
      if (!element || element.isConnected === false || element.hidden === true) return false;
      if (closest(element, '[hidden], [aria-hidden="true"]')) return false;
      if (element.disabled === true || (typeof element.hasAttribute === "function"
          && element.hasAttribute("disabled"))) return false;
      if (typeof element.getAttribute === "function"
          && element.getAttribute("aria-disabled") === "true") return false;
      let current = element;
      while (current && current.nodeType !== 9) {
        const style = typeof readComputedStyle === "function" ? readComputedStyle(current) : null;
        if (style && (style.display === "none" || style.visibility === "hidden"
            || style.visibility === "collapse")) return false;
        current = current.parentElement;
      }
      if (typeof element.getClientRects === "function" && documentRef
          && documentRef.defaultView && element.getClientRects().length === 0) return false;
      return true;
    }

    function targets(descriptor) {
      const active = descriptor || currentDescriptor();
      if (!active || typeof active.targets !== "function") return [];
      return [].concat(active.targets() || []).filter(Boolean);
    }

    function reconcile() {
      const descriptor = currentDescriptor();
      if (!descriptor || reconciling || typeof descriptor.reconcile !== "function") {
        return descriptor;
      }
      reconciling = true;
      try {
        descriptor.reconcile();
      } finally {
        reconciling = false;
      }
      return currentDescriptor();
    }

    function actionContext(action) {
      return Object.keys(action).reduce(function(context, key) {
        if (key !== "type") context[key] = action[key];
        return context;
      }, {});
    }

    function actionCommitted(action, observedDescriptor) {
      if (!action || typeof action.type !== "string" || !action.type) return false;
      const current = resolveCurrentDescriptor();
      const descriptor = observedDescriptor || current;
      const before = descriptor && descriptor.stage;
      let matched = false;
      const sameCurrent = descriptor && current && (descriptor === current
        || (descriptor.id === current.id && descriptor.stage === current.stage));
      const observedObject = observedDescriptor
        && (typeof observedDescriptor === "object" || typeof observedDescriptor === "function");
      const observedUnused = !observedObject
        || !consumedObservedDescriptors.has(observedDescriptor);
      const validObserved = !observedDescriptor || (observedUnused
        && (sameCurrent || (observedObject && observedDescriptor === lastObservedDescriptor)));
      if (observedObject && validObserved) consumedObservedDescriptors.add(observedDescriptor);
      if (validObserved && descriptor && typeof descriptor.onActionCommitted === "function") {
        matched = descriptor.onActionCommitted(Object.freeze(Object.assign({}, action))) === true;
      }
      const afterDescriptor = resolveCurrentDescriptor();
      if (typeof options.onTrace === "function") {
        options.onTrace(Object.freeze({
          guidanceId: descriptor && descriptor.id || null,
          stageBefore: before === undefined ? null : before,
          actionType: action.type,
          actionContext: Object.freeze(actionContext(action)),
          matched: matched,
          stageAfter: afterDescriptor && afterDescriptor.stage !== undefined
            ? afterDescriptor.stage : null
        }));
      }
      return matched;
    }

    return Object.freeze({
      currentDescriptor: currentDescriptor,
      targets: targets,
      reconcile: reconcile,
      actionCommitted: actionCommitted,
      isElementActionable: isElementActionable
    });
  }

  CatInc.guidance = Object.freeze({ createController: createController });
})(typeof window !== "undefined" ? window : globalThis);
