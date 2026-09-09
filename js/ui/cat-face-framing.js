(function(root) {
  "use strict";

  const CatInc = root.CatInc = root.CatInc || {};
  CatInc.ui = CatInc.ui || {};

  const VISIBLE_FILL = 0.9;
  const framingByPath = (CatInc.data && CatInc.data.liveCatFaces
    && CatInc.data.liveCatFaces.framingByPath) || {};

  function isCatFaceSource(source) {
    let normalized = String(source || "").replace(/\\/g, "/");
    try {
      normalized = decodeURI(normalized);
    } catch (error) {
      // A malformed URL is not a runtime Cat Face authority.
      return false;
    }
    return /(?:^|\/)img\/Cat faces\//i.test(normalized);
  }

  function sourcePath(source) {
    let normalized = String(source || "").replace(/\\/g, "/");
    try { normalized = decodeURI(normalized); } catch (error) { return ""; }
    const match = normalized.match(/(?:^|\/)(img\/Cat faces\/[^?#]+)/i);
    return match ? match[1] : "";
  }

  function framingVariables(framing) {
    if (!framing || !framing.width || !framing.height || !framing.bounds) return null;
    const bounds = framing.bounds;
    // Cat Face hosts are square. Derive the final transform entirely from the
    // exported pixel bounds so it can be installed before the image is painted.
    const sourceScale = 1 / Math.max(framing.width, framing.height);
    const visibleWidth = (bounds[2] - bounds[0]) * sourceScale;
    const visibleHeight = (bounds[3] - bounds[1]) * sourceScale;
    if (!visibleWidth || !visibleHeight) return false;
    const scale = VISIBLE_FILL / Math.max(visibleWidth, visibleHeight);
    const centerX = (bounds[0] + bounds[2]) / 2;
    const centerY = (bounds[1] + bounds[3]) / 2;
    return Object.freeze({
      scale: scale,
      x: -scale * (centerX - framing.width / 2) * sourceScale * 100,
      y: -scale * (centerY - framing.height / 2) * sourceScale * 100
    });
  }

  function variablesForSource(source) {
    return framingVariables(framingByPath[sourcePath(source)]);
  }

  function applyVariables(image, variables) {
    if (!image || !variables) return false;
    image.style.setProperty("--cat-face-frame-scale", String(variables.scale));
    image.style.setProperty("--cat-face-frame-x", variables.x + "%");
    image.style.setProperty("--cat-face-frame-y", variables.y + "%");
    return true;
  }

  function frameImage(image) {
    if (!image) return Promise.resolve(false);
    const declaredSource = image.getAttribute("src") || "";
    if (!isCatFaceSource(declaredSource)) {
      image.classList.remove("cat-face-runtime-framed");
      delete image.dataset.catFaceSource;
      return Promise.resolve(false);
    }
    const variables = variablesForSource(declaredSource);
    if (!variables) return Promise.resolve(false);
    image.dataset.catFaceSource = declaredSource;
    image.classList.add("cat-face-runtime-framed");
    return Promise.resolve(applyVariables(image, variables));
  }

  function originalSource(image) {
    if (!image) return "";
    return image.dataset.catFaceSource || image.getAttribute("src") || "";
  }

  function setSource(image, source) {
    if (!image || originalSource(image) === source) return false;
    image.classList.remove("cat-face-runtime-framed");
    delete image.dataset.catFaceSource;
    image.style.removeProperty("--cat-face-frame-scale");
    image.style.removeProperty("--cat-face-frame-x");
    image.style.removeProperty("--cat-face-frame-y");
    const variables = variablesForSource(source);
    if (variables) {
      image.dataset.catFaceSource = source;
      image.classList.add("cat-face-runtime-framed");
      applyVariables(image, variables);
    }
    image.setAttribute("src", source);
    return true;
  }

  document.addEventListener("load", function(event) {
    if (event.target && event.target.tagName === "IMG") frameImage(event.target);
  }, true);
  Array.from(document.images || []).forEach(frameImage);
  if (typeof MutationObserver === "function" && document.documentElement) {
    new MutationObserver(function(records) {
      records.forEach(function(record) {
        if (record.type === "attributes") {
          frameImage(record.target);
          return;
        }
        Array.from(record.addedNodes || []).forEach(function(node) {
          if (!node || node.nodeType !== 1) return;
          if (node.tagName === "IMG") frameImage(node);
          Array.from(node.querySelectorAll ? node.querySelectorAll("img") : []).forEach(frameImage);
        });
      });
    }).observe(document.documentElement, { childList: true, subtree: true, attributes: true, attributeFilter: ["src"] });
  }

  CatInc.ui.catFaceFraming = Object.freeze({
    frameImage: frameImage,
    isCatFaceSource: isCatFaceSource,
    originalSource: originalSource,
    setSource: setSource,
    variablesForSource: variablesForSource
  });
})(typeof window !== "undefined" ? window : globalThis);
