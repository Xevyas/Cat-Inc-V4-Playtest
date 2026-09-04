(function(root) {
  "use strict";

  const CatInc = root.CatInc = root.CatInc || {};
  const FOCUSABLE_SELECTOR = 'button:not([disabled]), input:not([disabled]):not([type="hidden"]), select:not([disabled]), textarea:not([disabled]), a[href], [tabindex]:not([tabindex="-1"])';

  function createController(options) {
    const documentRef = options.document;
    const scheduleFrame = options.requestAnimationFrame;
    const readComputedStyle = options.getComputedStyle;
    const configurations = new WeakMap();
    const managedStack = [];
    const openStack = [];
    const backgroundState = new Map();
    let openSequence = 0;
    let viewportListening = false;
    let savedBodyOverflow = "";

    function resolveDialog(idOrElement) {
      return typeof idOrElement === "string"
        ? documentRef.getElementById(idOrElement)
        : idOrElement;
    }

    function inputAuthority() {
      return root.CatInc && root.CatInc.touchActivationController;
    }

    function getFocusableElements(dialogue) {
      return Array.from(dialogue.querySelectorAll(FOCUSABLE_SELECTOR)).filter(function(element) {
        if (element.getAttribute("aria-disabled") === "true") return false;
        const style = readComputedStyle(element);
        return style.display !== "none" && style.visibility !== "hidden";
      });
    }

    function isManaged(dialogue) {
      return dialogue && dialogue.getAttribute
        && dialogue.getAttribute("data-overlay-managed") === "true";
    }

    function ensureOverlayRoot() {
      let overlayRoot = documentRef.getElementById("overlay-root");
      if (!overlayRoot && documentRef.createElement) {
        overlayRoot = documentRef.createElement("div");
        overlayRoot.id = "overlay-root";
        overlayRoot.setAttribute("aria-live", "off");
        documentRef.body.appendChild(overlayRoot);
      }
      return overlayRoot;
    }

    function usefulViewport() {
      const viewport = root.visualViewport;
      return {
        left: viewport ? viewport.offsetLeft : 0,
        top: viewport ? viewport.offsetTop : 0,
        width: viewport ? viewport.width : (root.innerWidth || 0),
        height: viewport ? viewport.height : (root.innerHeight || 0)
      };
    }

    function updateUsefulViewport() {
      const overlayRoot = ensureOverlayRoot();
      if (!overlayRoot || !overlayRoot.style) return;
      const viewport = usefulViewport();
      overlayRoot.style.setProperty("--overlay-viewport-left", viewport.left + "px");
      overlayRoot.style.setProperty("--overlay-viewport-top", viewport.top + "px");
      overlayRoot.style.setProperty("--overlay-viewport-width", viewport.width + "px");
      overlayRoot.style.setProperty("--overlay-viewport-height", viewport.height + "px");
    }

    function listenForUsefulViewport() {
      if (viewportListening || !root.addEventListener) return;
      viewportListening = true;
      root.addEventListener("resize", updateUsefulViewport);
      if (root.visualViewport && root.visualViewport.addEventListener) {
        root.visualViewport.addEventListener("resize", updateUsefulViewport);
        root.visualViewport.addEventListener("scroll", updateUsefulViewport);
      }
    }

    function restoreBackground() {
      backgroundState.forEach(function(state, element) {
        element.inert = state.inert;
        if (state.ariaHidden === null) element.removeAttribute("aria-hidden");
        else element.setAttribute("aria-hidden", state.ariaHidden);
      });
      backgroundState.clear();
      if (documentRef.body && documentRef.body.style) documentRef.body.style.overflow = savedBodyOverflow;
    }

    function updateBackground() {
      if (!documentRef.body || !documentRef.body.children) return;
      const top = getTopmost();
      if (!top || managedStack.length === 0) {
        restoreBackground();
        return;
      }
      managedStack.forEach(function(dialogue) {
        const active = dialogue === top;
        dialogue.inert = !active;
        dialogue.setAttribute("aria-hidden", active ? "false" : "true");
        dialogue.classList.toggle("overlay-managed-top", active);
      });
      const overlayRoot = ensureOverlayRoot();
      const allowed = isManaged(top) ? overlayRoot : top;
      const firstLock = backgroundState.size === 0;
      if (firstLock && documentRef.body.style) savedBodyOverflow = documentRef.body.style.overflow || "";
      Array.from(documentRef.body.children).forEach(function(element) {
        // The first-paint curtain owns input independently until atomic reveal.
        if (element.id === "boot-curtain") return;
        if (!backgroundState.has(element)) {
          backgroundState.set(element, {
            inert: Boolean(element.inert),
            ariaHidden: element.getAttribute ? element.getAttribute("aria-hidden") : null
          });
        }
        const active = element === allowed;
        element.inert = !active;
        if (!active && element.setAttribute) element.setAttribute("aria-hidden", "true");
        if (active && element.getAttribute && backgroundState.get(element).ariaHidden === null) {
          element.removeAttribute("aria-hidden");
        }
      });
      if (documentRef.body.style) documentRef.body.style.overflow = "hidden";
    }

    function registerManagedAction(actionId, callback) {
      const authority = inputAuthority();
      if (authority && authority.registerSemanticAction) authority.registerSemanticAction(actionId, callback);
    }

    function unregisterManagedAction(actionId) {
      const authority = inputAuthority();
      if (authority && authority.unregisterSemanticAction) authority.unregisterSemanticAction(actionId);
    }

    function mountManaged(dialogue, config) {
      const overlayRoot = ensureOverlayRoot();
      if (!overlayRoot || !documentRef.createElement || !dialogue.parentNode) return false;
      config.placeholder = documentRef.createComment("overlay:" + dialogue.id);
      dialogue.parentNode.insertBefore(config.placeholder, dialogue);
      overlayRoot.appendChild(dialogue);
      dialogue.classList.add("overlay-managed");
      const backdrop = documentRef.createElement("div");
      backdrop.className = "overlay-manager-backdrop";
      backdrop.setAttribute("aria-hidden", "true");
      backdrop.setAttribute("data-touch-activation-root", "true");
      config.closeActionId = "overlay.close:" + dialogue.id;
      backdrop.setAttribute("data-input-action", config.closeActionId);
      dialogue.insertBefore(backdrop, dialogue.firstChild);
      config.backdrop = backdrop;
      config.closeButtons = Array.from(dialogue.querySelectorAll(".explo-modal-close"));
      config.closeButtons.forEach(function(button) {
        button.setAttribute("data-input-action", config.closeActionId);
      });
      const requestClose = function(payload, token) {
        if (token && config.openerToken && token.id === config.openerToken.id) return false;
        if (typeof config.fermer === "function") config.fermer();
        return true;
      };
      registerManagedAction(config.closeActionId, requestClose);
      config.closeButtonHandler = function(event) {
        if (!event.defaultPrevented) requestClose(null, null);
      };
      config.closeButtons.forEach(function(button) {
        button.addEventListener("click", config.closeButtonHandler);
      });
      backdrop.addEventListener("click", function(event) {
        if (event.detail === 0) return;
        requestClose(null, null);
      });
      managedStack.push(dialogue);
      updateUsefulViewport();
      listenForUsefulViewport();
      return true;
    }

    function unmountManaged(dialogue, config) {
      const index = managedStack.indexOf(dialogue);
      if (index >= 0) managedStack.splice(index, 1);
      unregisterManagedAction(config.closeActionId);
      (config.closeButtons || []).forEach(function(button) {
        if (config.closeButtonHandler) button.removeEventListener("click", config.closeButtonHandler);
        button.removeAttribute("data-input-action");
      });
      if (config.backdrop && config.backdrop.parentNode) config.backdrop.parentNode.removeChild(config.backdrop);
      dialogue.classList.remove("overlay-managed");
      dialogue.classList.remove("overlay-managed-top");
      dialogue.inert = false;
      if (config.placeholder && config.placeholder.parentNode) {
        config.placeholder.parentNode.insertBefore(dialogue, config.placeholder);
        config.placeholder.parentNode.removeChild(config.placeholder);
      }
    }

    function open(idOrElement, optionsOuverture) {
      const dialogue = resolveDialog(idOrElement);
      if (!dialogue) return false;
      if (configurations.has(dialogue) && dialogue.getAttribute("aria-hidden") === "false") return false;
      const config = Object.assign({ dismissible: false }, optionsOuverture || {});
      config.elementRetour = documentRef.activeElement && documentRef.activeElement !== documentRef.body
        ? documentRef.activeElement
        : null;
      config.openedAt = ++openSequence;
      config.openerToken = config.openerToken || null;
      configurations.set(dialogue, config);
      if (isManaged(dialogue) && !mountManaged(dialogue, config)) return false;
      openStack.push(dialogue);
      dialogue.style.display = "flex";
      dialogue.setAttribute("aria-hidden", "false");
      updateBackground();
      scheduleFrame(function() {
        const cible = (config.focusSelector && dialogue.querySelector(config.focusSelector))
          || getFocusableElements(dialogue)[0]
          || dialogue.querySelector('[role="document"]')
          || dialogue;
        if (!cible.hasAttribute("tabindex") && cible === dialogue) cible.tabIndex = -1;
        cible.focus();
      });
      return true;
    }

    function close(idOrElement) {
      const dialogue = resolveDialog(idOrElement);
      if (!dialogue) return false;
      const config = configurations.get(dialogue) || {};
      const openIndex = openStack.lastIndexOf(dialogue);
      if (openIndex >= 0) openStack.splice(openIndex, 1);
      dialogue.style.display = "none";
      dialogue.setAttribute("aria-hidden", "true");
      if (isManaged(dialogue)) unmountManaged(dialogue, config);
      configurations.delete(dialogue);
      updateBackground();
      scheduleFrame(function() {
        const cible = (config.returnFocusSelector && documentRef.querySelector(config.returnFocusSelector))
          || (config.elementRetour && config.elementRetour.isConnected ? config.elementRetour : null);
        if (cible && typeof cible.focus === "function") cible.focus();
      });
      return true;
    }

    function getTopmost() {
      return openStack.length ? openStack[openStack.length - 1] : null;
    }

    function handleKeydown(event) {
      const dialogue = getTopmost();
      if (!dialogue) return;
      const config = configurations.get(dialogue) || {};

      if (event.key === "Escape" && config.dismissible && typeof config.fermer === "function") {
        event.preventDefault();
        config.fermer();
        return;
      }
      if (event.key !== "Tab") return;

      const focusables = getFocusableElements(dialogue);
      if (focusables.length === 0) {
        event.preventDefault();
        dialogue.focus();
        return;
      }
      const premier = focusables[0];
      const dernier = focusables[focusables.length - 1];
      if (event.shiftKey && (documentRef.activeElement === premier || !dialogue.contains(documentRef.activeElement))) {
        event.preventDefault();
        dernier.focus();
      } else if (!event.shiftKey && (documentRef.activeElement === dernier || !dialogue.contains(documentRef.activeElement))) {
        event.preventDefault();
        premier.focus();
      }
    }

    return Object.freeze({
      open: open,
      close: close,
      handleKeydown: handleKeydown,
      getTopmost: getTopmost,
      getFocusableElements: getFocusableElements,
      updateUsefulViewport: updateUsefulViewport
    });
  }

  CatInc.dialogs = Object.freeze({
    createController: createController
  });
})(typeof window !== "undefined" ? window : globalThis);
