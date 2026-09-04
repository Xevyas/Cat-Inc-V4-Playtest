(function(root) {
  "use strict";

  const CatInc = root.CatInc = root.CatInc || {};
  const domParIdCache = new Map();
  const barreProgres = {};

  // Stable nodes are cached. Dynamic nodes replaced through innerHTML are
  // automatically looked up again once the old node is disconnected.
  function domParId(id) {
    let el = domParIdCache.get(id);
    if (!el || el.isConnected === false) {
      el = root.document.getElementById(id);
      if (el) domParIdCache.set(id, el);
      else domParIdCache.delete(id);
    }
    return el;
  }

  function ecrireTexte(el, valeur) {
    if (!el) return false;
    const texte = String(valeur);
    if (el.textContent === texte) return false;
    el.textContent = texte;
    return true;
  }

  function ecrireHTML(el, valeur) {
    if (!el || el.innerHTML === valeur) return false;
    el.innerHTML = valeur;
    return true;
  }

  function ecrireStyle(el, propriete, valeur) {
    if (!el || el.style[propriete] === valeur) return false;
    el.style[propriete] = valeur;
    return true;
  }

  function ecrirePropriete(el, propriete, valeur) {
    if (!el || el[propriete] === valeur) return false;
    el[propriete] = valeur;
    return true;
  }

  function ecrireVariableStyle(el, propriete, valeur) {
    if (!el) return false;
    const texte = String(valeur);
    if (el.style.getPropertyValue(propriete) === texte) return false;
    el.style.setProperty(propriete, texte);
    return true;
  }

  function basculerClasse(el, classe, active) {
    if (!el || el.classList.contains(classe) === active) return false;
    el.classList.toggle(classe, active);
    return true;
  }

  function setBarreProgress(id, ratio) {
    const el = domParId(id);
    if (!el) return;
    const pct = Math.min(ratio * 100, 100);
    const ancien = barreProgres[id] || 0;
    const largeur = pct + "%";
    if (pct === ancien && el.style.width === largeur) return;
    if (pct < ancien - 5) {
      el.style.transition = "none";
      el.style.width = largeur;
      el.getBoundingClientRect();
      el.style.transition = "";
    } else {
      ecrireStyle(el, "width", largeur);
    }
    barreProgres[id] = pct;
  }

  CatInc.dom = Object.freeze({
    domParId: domParId,
    ecrireTexte: ecrireTexte,
    ecrireHTML: ecrireHTML,
    ecrireStyle: ecrireStyle,
    ecrirePropriete: ecrirePropriete,
    ecrireVariableStyle: ecrireVariableStyle,
    basculerClasse: basculerClasse,
    setBarreProgress: setBarreProgress
  });

  // One boot-only scan of the real rendered surface, never a game asset manifest.
  // Layout is retained behind the opaque curtain, including the Camp camera.
  if (CatInc.boot) CatInc.boot.ready = async function() {
    const boot = CatInc.boot;
    const frames = function() {
      return new Promise(resolve => root.requestAnimationFrame(() => root.requestAnimationFrame(resolve)));
    };
    const assets = new Map();
    const failures = new Set();
    function awaitImage(url, image) {
      if (!url || assets.has(url)) return;
      if (!image) {
        image = new root.Image();
        image.src = url;
      }
      assets.set(url, image.decode().catch(function(error) {
        failures.add(url);
        root.console.warn("Cat Inc boot image could not be decoded:", url, error);
      }));
    }
    function scan() {
      root.document.body.querySelectorAll("*").forEach(function(element) {
        if (element.closest("#boot-curtain") || !element.getClientRects().length) return;
        const style = root.getComputedStyle(element);
        if (style.visibility !== "visible" || style.display === "none") return;
        if (element.tagName === "IMG" && element.loading !== "lazy") {
          awaitImage(element.currentSrc || element.src, element);
        }
        // Includes the renderer's terrain, paths and fog, plus visible UI
        // backgrounds. Reading computed URLs reuses their canonical paths.
        [style, root.getComputedStyle(element, "::before"), root.getComputedStyle(element, "::after")].forEach(function(paint, index) {
          if (index && (paint.content === "none" || paint.content === "normal" || paint.display === "none")) return;
          const images = paint.backgroundImage + " " + paint.maskImage;
          for (const match of images.matchAll(/url\((?:"([^"]*)"|'([^']*)'|([^)]*))\)/g)) {
            const url = match[1] || match[2] || match[3];
            if (!url.startsWith("data:")) awaitImage(url);
          }
        });
      });
    }
    try {
      // The existing Camp renderer finalizes its camera/first reveal in two
      // frames. Let that seam run before discovering its visible world layers.
      await frames();
      boot.surfaceRendered = true;
      let previousSize;
      do {
        scan();
        previousSize = assets.size;
        await Promise.all(assets.values());
        await root.document.fonts.ready;
        await frames();
        scan();
      } while (assets.size !== previousSize);
      root.document.dispatchEvent(new CustomEvent("catinc:boot-ready", {
        detail: {assets: Array.from(assets.keys()), failures: Array.from(failures)}
      }));
      if (failures.size) boot.fail("Some pictures could not load. You can reload or continue playing.", true);
      else boot.reveal();
    } catch (error) {
      root.console.error("Cat Inc boot readiness failed:", error);
      boot.fail("Cat Inc could not finish loading. Please reload to try again.", false);
    }
  };
})(typeof window !== "undefined" ? window : globalThis);
