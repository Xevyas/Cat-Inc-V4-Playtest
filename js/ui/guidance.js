(function(root) {
  "use strict";

  const CatInc = root.CatInc = root.CatInc || {};

  function createController(options) {
    const documentRef = options.document;
    const readComputedStyle = options.getComputedStyle;
    const resolveDescriptor = options.resolveDescriptor;
    const getTopmostDialog = options.getTopmostDialog || function() { return null; };
    const settingsTriggerSelector = options.settingsTriggerSelector || ".bouton-settings";
    const settingsModalSelector = options.settingsModalSelector || "#settings-modal";
    let recoveryInProgress = false;
    let lastDiagnosticId = null;

    function closest(element, selector) {
      return element && typeof element.closest === "function" ? element.closest(selector) : null;
    }

    function isBranchVisible(element) {
      if (!element || element.isConnected === false || element.hidden === true) return false;
      if (closest(element, '[hidden], [aria-hidden="true"]')) return false;
      let current = element;
      while (current && current.nodeType !== 9) {
        const style = typeof readComputedStyle === "function" ? readComputedStyle(current) : null;
        if (style && (style.display === "none" || style.visibility === "hidden"
            || style.visibility === "collapse")) return false;
        current = current.parentElement;
      }
      return true;
    }

    function isElementActionable(element) {
      if (!isBranchVisible(element)) return false;
      if (element.disabled === true || (typeof element.hasAttribute === "function"
          && element.hasAttribute("disabled"))) return false;
      if (typeof element.getAttribute === "function"
          && element.getAttribute("aria-disabled") === "true") return false;
      const topmost = getTopmostDialog();
      if (topmost && typeof topmost.contains === "function" && !topmost.contains(element)) return false;
      if (typeof element.getClientRects === "function"
          && documentRef && documentRef.defaultView
          && element.getClientRects().length === 0) return false;
      return true;
    }

    function descriptorElements(descriptor) {
      const allowed = typeof descriptor.allowedTargets === "function"
        ? descriptor.allowedTargets() : [];
      const recovery = typeof descriptor.recoveryTargets === "function"
        ? descriptor.recoveryTargets() : [];
      return [].concat(allowed || [], recovery || []).filter(Boolean);
    }

    function hasActionableTarget(descriptor) {
      return Boolean(descriptor && descriptorElements(descriptor).some(isElementActionable));
    }

    function isSettingsElement(element) {
      if (!element) return false;
      if (closest(element, settingsTriggerSelector)) return true;
      const modal = closest(element, settingsModalSelector);
      return Boolean(modal && modal.getAttribute("aria-hidden") !== "true"
        && modal.style && modal.style.display !== "none");
    }

    function ensureActionableGuidance() {
      let descriptor = resolveDescriptor();
      if (!descriptor || hasActionableTarget(descriptor)) {
        lastDiagnosticId = null;
        return descriptor;
      }
      if (!recoveryInProgress && typeof descriptor.ensureActionableTarget === "function") {
        recoveryInProgress = true;
        try {
          descriptor.ensureActionableTarget();
        } finally {
          recoveryInProgress = false;
        }
        descriptor = resolveDescriptor();
      }
      if (!descriptor || hasActionableTarget(descriptor)) {
        lastDiagnosticId = null;
        return descriptor;
      }
      const diagnosticId = String(descriptor.id || "guided-interaction")
        + ":" + String(descriptor.stage || "active");
      if (lastDiagnosticId !== diagnosticId && typeof options.onDiagnostic === "function") {
        lastDiagnosticId = diagnosticId;
        options.onDiagnostic({ id: descriptor.id, stage: descriptor.stage });
      }
      return null;
    }

    function isElementAllowed(descriptor, element) {
      if (!descriptor || !element) return false;
      if (typeof descriptor.isElementAllowed === "function"
          && descriptor.isElementAllowed(element)) return true;
      return descriptorElements(descriptor).some(function(target) {
        return target === element || (typeof target.contains === "function" && target.contains(element));
      });
    }

    function shouldBlockEvent(event) {
      const descriptor = resolveDescriptor();
      if (!descriptor) return false;
      if (event && event.type === "keydown" && event.key === "Tab") return false;
      if (isSettingsElement(event && event.target)) return false;
      const actionableDescriptor = ensureActionableGuidance();
      if (!actionableDescriptor) return false;
      if (event && event.type === "keydown"
          && event.key !== "Enter" && event.key !== " ") return true;
      return !isElementAllowed(actionableDescriptor, event && event.target);
    }

    return Object.freeze({
      isElementActionable: isElementActionable,
      hasActionableTarget: hasActionableTarget,
      ensureActionableGuidance: ensureActionableGuidance,
      isSettingsElement: isSettingsElement,
      isElementAllowed: isElementAllowed,
      shouldBlockEvent: shouldBlockEvent
    });
  }

  CatInc.guidance = Object.freeze({ createController: createController });
})(typeof window !== "undefined" ? window : globalThis);
