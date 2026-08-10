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
      const message = pendingMessages.shift();
      const element = documentRef.createElement("div");
      element.textContent = message;
      element.className = "notification";
      element.setAttribute("role", "status");
      element.setAttribute("aria-live", "polite");
      documentRef.body.appendChild(element);
      activeNotification = { message: message, element: element };
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

    function show(message) {
      const text = String(message || "").trim();
      if (!text) return;
      if (activeNotification && activeNotification.message === text) return;
      if (pendingMessages.includes(text)) return;
      pendingMessages.push(text);
      showNext();
    }

    return Object.freeze({
      show: show,
      showNext: showNext
    });
  }

  CatInc.notifications = Object.freeze({
    createController: createController
  });
})(typeof window !== "undefined" ? window : globalThis);
