(function(root) {
  "use strict";

  const CatInc = root.CatInc = root.CatInc || {};

  function filterNonEmptyCategories(categories) {
    return (categories || []).filter(function(category) {
      return Array.isArray(category.changes) && category.changes.length > 0;
    });
  }

  function formatReleaseDate(date) {
    if (!date) return "";
    const parsed = new Date(date + "T00:00:00");
    if (Number.isNaN(parsed.getTime())) return date;
    return new Intl.DateTimeFormat("en-US", {
      year: "numeric", month: "long", day: "numeric"
    }).format(parsed);
  }

  function createController(options) {
    const documentRef = options.document;
    const releases = options.releases;
    const openModal = options.openModal;

    function render() {
      const conteneur = documentRef.getElementById("changelog-releases");
      if (!conteneur) return;
      conteneur.innerHTML = "";
      releases.forEach(function(release, index) {
        const section = documentRef.createElement("section");
        section.className = "changelog-release";
        const titre = documentRef.createElement("h3");
        const date = formatReleaseDate(release.date);
        titre.textContent = "v" + release.version
          + (date ? " · " + date : "")
          + (index === 0 ? " · Current" : "");
        section.appendChild(titre);
        filterNonEmptyCategories(release.categories).forEach(function(category) {
          const changes = category.changes;
          const bloc = documentRef.createElement("div");
          bloc.className = "changelog-category";
          const categorieTitre = documentRef.createElement("h4");
          categorieTitre.textContent = category.label;
          bloc.appendChild(categorieTitre);
          const liste = documentRef.createElement("ul");
          changes.forEach(function(change) {
            const item = documentRef.createElement("li");
            item.textContent = change;
            liste.appendChild(item);
          });
          bloc.appendChild(liste);
          section.appendChild(bloc);
        });
        conteneur.appendChild(section);
      });
    }

    function open() {
      render();
      openModal();
    }

    return Object.freeze({
      render: render,
      open: open
    });
  }

  CatInc.changelog = Object.freeze({
    filterNonEmptyCategories: filterNonEmptyCategories,
    createController: createController
  });
})(typeof window !== "undefined" ? window : globalThis);
