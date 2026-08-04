(function(root) {
  "use strict";

  const CatInc = root.CatInc = root.CatInc || {};

  const REASONS = Object.freeze({
    AVAILABLE: "available",
    CONTENT_LOCKED: "content-locked",
    MISSING_BUILDING: "missing-building",
    UNDER_REPAIR: "under-repair",
    UNDER_CONSTRUCTION: "under-construction",
    UPGRADING: "upgrading",
    ACCESS_BLOCKED: "access-blocked",
    TIER_REQUIRED: "tier-required"
  });

  function entierPositif(value, fallback) {
    const number = Number(value);
    return Number.isInteger(number) && number > 0 ? number : fallback;
  }

  function resultat(available, code, reason, item, requiredTier) {
    return {
      available: available,
      code: code,
      reason: reason,
      itemUid: item && item.uid ? item.uid : null,
      functionalTier: item ? entierPositif(item.tier, 1) : 0,
      requiredTier: entierPositif(requiredTier, 1)
    };
  }

  function evaluer(options) {
    const config = options && typeof options === "object" ? options : {};
    const item = config.item || null;
    const label = String(config.label || "This building");
    const requiredTier = entierPositif(config.requiredTier, 1);

    if (config.contentUnlocked === false) {
      return resultat(false, REASONS.CONTENT_LOCKED, "This content is not unlocked yet.", item, requiredTier);
    }
    if (!item) {
      return resultat(false, REASONS.MISSING_BUILDING, label + " must be placed in the Camp.", null, requiredTier);
    }
    if (config.repairing === true || config.repaired === false) {
      return resultat(false, REASONS.UNDER_REPAIR, "Repair " + label + " first.", item, requiredTier);
    }
    if (config.constructing === true || item.construit === false) {
      return resultat(false, REASONS.UNDER_CONSTRUCTION, label + " is still under construction.", item, requiredTier);
    }
    if (config.upgrading === true) {
      return resultat(false, REASONS.UPGRADING, label + " is being upgraded.", item, requiredTier);
    }
    if (config.accessRequired !== false && config.connection && config.connection.active !== true) {
      return resultat(
        false,
        REASONS.ACCESS_BLOCKED,
        config.connection.reason || (label + " is not connected to the Camp."),
        item,
        requiredTier
      );
    }
    if (entierPositif(item.tier, 1) < requiredTier) {
      return resultat(
        false,
        REASONS.TIER_REQUIRED,
        label + " Tier " + requiredTier + " required.",
        item,
        requiredTier
      );
    }
    return resultat(true, REASONS.AVAILABLE, "", item, requiredTier);
  }

  CatInc.campCapabilities = Object.freeze({
    REASONS: REASONS,
    evaluer: evaluer
  });
})(typeof window !== "undefined" ? window : globalThis);
