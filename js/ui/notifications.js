(function(root) {
  "use strict";

  const CatInc = root.CatInc = root.CatInc || {};
  const ENTER_DELAY_MS = 10;
  const DISPLAY_DURATION_MS = 2600;
  const EXIT_DURATION_MS = 400;

  function createController(options) {
    const documentRef = options.document;
    const scheduleTimeout = options.setTimeout;
    const pendingMessages = [];
    let activeNotification = null;

    function showNext() {
      if (activeNotification || pendingMessages.length === 0) return;
      const pending = pendingMessages.shift();
      const message = pending.message;
      const container = pending.getContainer ? pending.getContainer() : documentRef.body;
      if (!container) { showNext(); return; }
      const element = documentRef.createElement("div");
      element.textContent = message;
      const symbol = /^(⚠️?|❌)\s*/u.exec(message);
      if (symbol) {
        element.textContent = message.slice(symbol[0].length);
        const icon = documentRef.createElement("span");
        icon.className = "interface-symbol " + (symbol[1] === "❌" ? "interface-cross" : "interface-warning");
        icon.setAttribute("aria-hidden", "true");
        element.prepend(icon, documentRef.createTextNode(" "));
      }
      element.className = "notification";
      element.setAttribute("role", "status");
      element.setAttribute("aria-live", "polite");
      if (pending.getContainer) element.classList.add("notification-experience");
      container.appendChild(element);
      activeNotification = { message: message, element: element, getContainer: pending.getContainer };
      scheduleTimeout(function() { element.classList.add("visible"); }, ENTER_DELAY_MS);
      scheduleTimeout(function() {
        element.classList.remove("visible");
        scheduleTimeout(function() {
          element.remove();
          activeNotification = null;
          showNext();
        }, EXIT_DURATION_MS);
      }, DISPLAY_DURATION_MS);
    }

    function show(message, getContainer) {
      const text = String(message || "").trim();
      if (!text) return;
      if (activeNotification && activeNotification.message === text) return;
      if (pendingMessages.some(function(pending) { return pending.message === text; })) return;
      pendingMessages.push({ message: text, getContainer: getContainer });
      showNext();
    }

    // Structural Gang renders replace the section, but keep the active timer.
    function refreshContainer() {
      if (!activeNotification || !activeNotification.getContainer) return;
      const container = activeNotification.getContainer();
      if (container) container.appendChild(activeNotification.element);
      else activeNotification.element.remove();
    }

    return Object.freeze({
      show: show,
      showNext: showNext,
      refreshContainer: refreshContainer
    });
  }

  CatInc.notifications = Object.freeze({
    createController: createController
  });
})(typeof window !== "undefined" ? window : globalThis);
