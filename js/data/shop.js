(function(root) {
  "use strict";
  const CatInc = root.CatInc = root.CatInc || {};
  CatInc.data = CatInc.data || {};

  const gameplay = CatInc.data.campGameplay;
  if (!gameplay || !gameplay.purchasableContent || !gameplay.cannelleShop) {
    throw new Error("Cannelle's Shop requires canonical Gameplay & Balance data");
  }
  const merchandise = Object.freeze(gameplay.cannelleShop.merchandise.map(function(entry) {
    const content = gameplay.purchasableContent[entry.contentId];
    if (!content) throw new Error("Cannelle's Shop contains unknown content " + entry.contentId);
    const product = {
      id: entry.id,
      category: entry.category,
      name: content.name,
      requiredLevel: entry.requiredLevel,
      priceResource: entry.priceResource,
      priceAmount: entry.priceAmount,
      rewardType: content.contentType,
      rewardId: entry.contentId,
      repeatable: entry.repeatable
    };
    if (content.previewAssetId) product.previewAssetId = content.previewAssetId;
    if (content.iconId) product.iconId = content.iconId;
    if (content.iconRuntimePath) product.iconRuntimePath = content.iconRuntimePath;
    if (content.contentType === "boost-quantity") product.description = content.description;
    return Object.freeze(product);
  }));

  function isShopOwner(kitty) {
    return Boolean(kitty && kitty.nom === "Cannelle" && kitty.metier === "shop-owner");
  }

  function nextMerchandiseLevel(level) {
    const current = Math.max(0, Number(level) || 0);
    const future = merchandise.map(function(product) { return product.requiredLevel; })
      .filter(function(requiredLevel) { return requiredLevel > current; });
    return future.length ? Math.min.apply(null, future) : null;
  }

  function productOwned(state, product) {
    return Boolean(product && product.rewardType === "inventory-item"
      && Array.isArray(state && state.itemsAcquis)
      && state.itemsAcquis.includes(product.rewardId));
  }

  function productState(state, product) {
    if (!product || product.rewardType !== "inventory-item") return "available";
    if (Array.isArray(state && state.itemsAppris) && state.itemsAppris.includes(product.rewardId)) {
      return "learned";
    }
    if (state && state.learningEnCours && state.learningEnCours.itemId === product.rewardId) {
      return "learning";
    }
    if (Array.isArray(state && state.itemsEtudies) && state.itemsEtudies.includes(product.rewardId)) {
      return "studied";
    }
    return productOwned(state, product) ? "owned" : "available";
  }

  function purchase(state, product, available, ownerLevel) {
    if (!state || !product || available !== true) return { ok: false, reason: "unavailable" };
    if ((Number(ownerLevel) || 0) < product.requiredLevel) return { ok: false, reason: "level" };
    const currentState = productState(state, product);
    if (!product.repeatable && currentState !== "available") {
      return { ok: false, reason: currentState };
    }
    const balance = Number(state[product.priceResource]) || 0;
    if (balance < product.priceAmount) return { ok: false, reason: "funds" };
    if (product.rewardType !== "inventory-item" && product.rewardType !== "boost-quantity") {
      return { ok: false, reason: "reward" };
    }
    if (!Array.isArray(state.itemsAcquis)) state.itemsAcquis = [];
    if (!state.boostInventory || typeof state.boostInventory !== "object" || Array.isArray(state.boostInventory)) {
      state.boostInventory = {};
    }
    state[product.priceResource] = Math.max(0, balance - product.priceAmount);
    if (product.rewardType === "inventory-item" && !state.itemsAcquis.includes(product.rewardId)) {
      state.itemsAcquis.push(product.rewardId);
    }
    if (product.rewardType === "boost-quantity") {
      state.boostInventory[product.rewardId] = Math.max(0, Math.floor(Number(state.boostInventory[product.rewardId]) || 0)) + 1;
    }
    return { ok: true, reason: "purchased" };
  }

  CatInc.data.shop = Object.freeze({
    categories: Object.freeze([
      Object.freeze({ id: "blueprints", label: "Blueprints", requiredLevel: 0 }),
      Object.freeze({ id: "boosts", label: "Boosts", requiredLevel: 10 }),
      Object.freeze({ id: "trade", label: "Trade", requiredLevel: 0 })
    ]),
    activeCategoryId: "blueprints",
    merchandise: merchandise,
    isShopOwner: isShopOwner,
    nextMerchandiseLevel: nextMerchandiseLevel,
    productOwned: productOwned,
    productState: productState,
    purchase: purchase
  });
})(typeof window !== "undefined" ? window : globalThis);
