(function(root) {
  "use strict";

  const CatInc = root.CatInc = root.CatInc || {};
  const LOG_MAX = 60;
  const DEFAULT_FILTERS = Object.freeze({ event: true, unlock: true, objective: false });

  function createController(options) {
    const getEntries = options.getEntries;
    const documentRef = options.document;
    const clock = options.clock;
    const normalizeText = options.normalizeText;
    const emptyStateHtml = options.emptyStateHtml;
    const filters = {
      event: DEFAULT_FILTERS.event,
      unlock: DEFAULT_FILTERS.unlock,
      objective: DEFAULT_FILTERS.objective
    };

    function render() {
      const conteneur = documentRef.getElementById("logs-liste");
      if (!conteneur) return;
      const entries = getEntries();
      conteneur.innerHTML = "";
      let affiches = 0;
      entries.forEach(function(entry) {
        const lignes = entry.lignes || (entry.texte ? [entry.texte] : []);
        const typeEffectif = entry.type === "unlock" && lignes.some(function(ligne) {
          return ligne.indexOf("Objective complete:") === 0;
        }) ? "objective" : entry.type;
        if (!filters[typeEffectif]) return;
        affiches++;
        const el = documentRef.createElement("div");
        el.className = "log-entry log-" + typeEffectif;
        const heure = documentRef.createElement("span");
        heure.className = "log-heure";
        heure.textContent = entry.heure;
        const bloc = documentRef.createElement("span");
        bloc.className = "log-texte";
        lignes.forEach(function(ligne, i) {
          if (i > 0) bloc.appendChild(documentRef.createElement("br"));
          bloc.appendChild(documentRef.createTextNode(normalizeText(ligne)));
        });
        el.appendChild(heure);
        el.appendChild(bloc);
        conteneur.appendChild(el);
      });
      if (affiches === 0) {
        conteneur.innerHTML = emptyStateHtml(
          entries.length === 0 ? "No activity yet" : "No matching entries",
          entries.length === 0 ? "Your gang's important events will appear here." : "Enable another filter to reveal more of the gang's history."
        );
      }
    }

    function add(type, lines) {
      const now = clock();
      const h = String(now.getHours()).padStart(2, "0");
      const m = String(now.getMinutes()).padStart(2, "0");
      const entries = getEntries();
      entries.unshift({ type: type, lignes: Array.isArray(lines) ? lines : [lines], heure: h + ":" + m });
      if (entries.length > LOG_MAX) entries.pop();
      render();
    }

    function toggleFilter(type) {
      filters[type] = !filters[type];
      const btn = documentRef.getElementById("filtre-" + type);
      if (btn) {
        btn.classList.toggle("filtre-inactif", !filters[type]);
        btn.setAttribute("aria-pressed", filters[type] ? "true" : "false");
      }
      render();
    }

    function getFilters() {
      return Object.freeze({
        event: filters.event,
        unlock: filters.unlock,
        objective: filters.objective
      });
    }

    return Object.freeze({
      add: add,
      render: render,
      toggleFilter: toggleFilter,
      getFilters: getFilters
    });
  }

  CatInc.logs = Object.freeze({
    createController: createController
  });
})(typeof window !== "undefined" ? window : globalThis);
