(function(root) {
  "use strict";
  const CatInc = root.CatInc = root.CatInc || {};
  CatInc.data = CatInc.data || {};

  const merchandise = Object.freeze([
    Object.freeze({
      id: "small-fountain-blueprint",
      category: "blueprints",
      name: "Small Fountain Blueprint",
      requiredLevel: 0,
      previewAssetId: "small-fountain",
      priceResource: "cannedCatFood",
      priceAmount: 1,
      rewardType: "inventory-item",
      rewardId: "smallFountainBlueprint",
      repeatable: false
    }),
    Object.freeze({
      id: "cardboard-litterbox-blueprint",
      category: "blueprints",
      name: "Cardboard Litterbox Blueprint",
      requiredLevel: 10,
      previewAssetId: "cardboard-litterbox",
      priceResource: "cannedCatFood",
      priceAmount: 1,
      rewardType: "inventory-item",
      rewardId: "cardboardLitterboxBlueprint",
      repeatable: false
    }),
    Object.freeze({
      id: "bird-whistle",
      category: "boosts",
      name: "Bird Whistle",
      description: "Calls the next Bird event immediately.",
      requiredLevel: 10,
      iconId: "items-bird-whistle",
      iconRuntimePath: "img/items/bird-whistle.png",
      priceResource: "cannelleTokens",
      priceAmount: 3,
      rewardType: "boost-quantity",
      rewardId: "birdWhistle",
      repeatable: true
    }),
    Object.freeze({
      id: "shortcut-map",
      category: "boosts",
      name: "Shortcut Map",
      description: "Exploration Speed ×2 for 10 real-time minutes.",
      requiredLevel: 10,
      iconId: "items-shortcut-map",
      iconRuntimePath: "img/items/shortcut-map.png",
      priceResource: "cannelleTokens",
      priceAmount: 3,
      rewardType: "boost-quantity",
      rewardId: "shortcutMap",
      repeatable: true
    })
  ]);

  function isShopOwner(kitty) {
    return Boolean(kitty && kitty.nom === "Cannelle" && kitty.metier === "shop-owner");
  }

  function nextMerchandiseLevel(level) {
    return (Math.floor(Math.max(0, Number(level) || 0) / 10) + 1) * 10;
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
      Object.freeze({ id: "boosts", label: "Boosts", requiredLevel: 10 })
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
