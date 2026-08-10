(function(root) {
  "use strict";

  const CatInc = root.CatInc = root.CatInc || {};
  const FOCUSABLE_SELECTOR = 'button:not([disabled]), input:not([disabled]):not([type="hidden"]), select:not([disabled]), textarea:not([disabled]), a[href], [tabindex]:not([tabindex="-1"])';

  function createController(options) {
    const documentRef = options.document;
    const scheduleFrame = options.requestAnimationFrame;
    const readComputedStyle = options.getComputedStyle;
    const configurations = new WeakMap();

    function resolveDialog(idOrElement) {
      return typeof idOrElement === "string"
        ? documentRef.getElementById(idOrElement)
        : idOrElement;
    }

    function getFocusableElements(dialogue) {
      return Array.from(dialogue.querySelectorAll(FOCUSABLE_SELECTOR)).filter(function(element) {
        if (element.getAttribute("aria-disabled") === "true") return false;
        const style = readComputedStyle(element);
        return style.display !== "none" && style.visibility !== "hidden";
      });
    }

    function open(idOrElement, optionsOuverture) {
      const dialogue = resolveDialog(idOrElement);
      if (!dialogue) return;
      const config = Object.assign({ dismissible: false }, optionsOuverture || {});
      config.elementRetour = documentRef.activeElement && documentRef.activeElement !== documentRef.body
        ? documentRef.activeElement
        : null;
      configurations.set(dialogue, config);
      dialogue.style.display = "flex";
      dialogue.setAttribute("aria-hidden", "false");
      scheduleFrame(function() {
        const cible = (config.focusSelector && dialogue.querySelector(config.focusSelector))
          || getFocusableElements(dialogue)[0]
          || dialogue.querySelector('[role="document"]')
          || dialogue;
        if (!cible.hasAttribute("tabindex") && cible === dialogue) cible.tabIndex = -1;
        cible.focus();
      });
    }

    function close(idOrElement) {
      const dialogue = resolveDialog(idOrElement);
      if (!dialogue) return;
      const config = configurations.get(dialogue) || {};
      dialogue.style.display = "none";
      dialogue.setAttribute("aria-hidden", "true");
      configurations.delete(dialogue);
      scheduleFrame(function() {
        const cible = (config.returnFocusSelector && documentRef.querySelector(config.returnFocusSelector))
          || (config.elementRetour && config.elementRetour.isConnected ? config.elementRetour : null);
        if (cible && typeof cible.focus === "function") cible.focus();
      });
    }

    function getTopmost() {
      const ouverts = Array.from(documentRef.querySelectorAll('[role="dialog"][aria-hidden="false"]'));
      return ouverts.length ? ouverts[ouverts.length - 1] : null;
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
      getFocusableElements: getFocusableElements
    });
  }

  CatInc.dialogs = Object.freeze({
    createController: createController
  });
})(typeof window !== "undefined" ? window : globalThis);
