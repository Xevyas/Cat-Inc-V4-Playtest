(function(root) {
  "use strict";

  const CatInc = root.CatInc = root.CatInc || {};
  const stateCore = CatInc.state;
  if (!stateCore) throw new Error("CatInc.state must be loaded before CatInc.save.");
  const perksV2Api = CatInc.perksV2 || Object.freeze({
    normalizeProgress: function() { return { version: 2, learned: [] }; }
  });

  function normaliserExplorationRetries(value, etat) {
    const result = { zones: {}, campaigns: {} };
    const data = CatInc.data || {};
    const catalogs = {
      zones: data.content && data.content.ZONES_CARTE,
      campaigns: data.config && data.config.CONFIG.campaigns
    };
    ["zones", "campaigns"].forEach(function(kind) {
      const counts = value && value[kind];
      if (!counts || typeof counts !== "object" || Array.isArray(counts)) return;
      const completed = (kind === "zones" ? etat.zonesExplorees : etat.campaignsCompletees) || [];
      const pending = (kind === "zones" ? etat.resultatsExplorationZones : etat.resultatsCampaigns) || {};
      Object.keys(counts).forEach(function(id) {
        if (["__proto__", "constructor", "prototype"].includes(id)) return;
        if (catalogs[kind] && !Object.prototype.hasOwnProperty.call(catalogs[kind], id)) return;
        if (completed.includes(id) || (pending[id] && pending[id].success)) return;
        if (Number.isInteger(counts[id]) && counts[id] > 0) result[kind][id] = Math.min(3, counts[id]);
      });
    });
    return result;
  }

  // V4 environments must never read or overwrite V3 browser data. The
  // Playtest deployment will use its own namespace when publication begins.
  const STORAGE_NAMESPACE = "catInc.v4.playtest";
  const SAVE_KEY = STORAGE_NAMESPACE + ".save";
  const SAVE_RECOVERY_KEY = STORAGE_NAMESPACE + ".saveRecovery";
  function isRealDevEnvironment() {
    return STORAGE_NAMESPACE.endsWith(".v4.dev");
  }
  // Version 3 starts the redesigned Camp progression. Camp jobs now remain
  // pending at 100% until the player validates them, so older saves are reset.
  const SAVE_VERSION = 3;
  const ONGLETS_VALIDES = ["gang", "camp", "work", "buildings", "facilities", "explorations", "inventaire", "logs"];
  const WORK_FAMILIES = ["wood", "food", "rock"];
  const WORK_RECIPE_PHASES = ["idle", "gathering", "processing", "waiting"];
  const JOB_IDS = [
    "lumberjack", "carpenter", "farmer", "chef", "explorator", "builder",
    "miner", "stonemason", "gang-leader", "camp-engineer", "shop-owner"
  ];
  const SCOUTING_REWARD_IDS = ["humanLeftovers", "humanWorkersFood", "cannedCatFood"];
  const CAMP_BUILDING_IDS = ["sawmill", "catchen", "pawsonry"];
  const CAMP_CANONICAL_REPAIR_IDS = [
    "cardboardBox", "storage", "operationsTable", "jobCenter",
    "laboratory", "marketStall", "smallFountain"
  ];
  function canonicalCampUpgradeEligible(typeId, startTier, targetTier) {
    const definition = CatInc.data && CatInc.data.campGameplay
      && CatInc.data.campGameplay.definitions && CatInc.data.campGameplay.definitions[typeId];
    const tier = definition && definition.upgradeTiers && definition.upgradeTiers[String(targetTier)];
    if (tier && targetTier === startTier + 1) return true;
    // Production upgrades predate per-tier authored unlock/visual records.
    return CAMP_BUILDING_IDS.includes(typeId) && startTier === 1 && targetTier === 2;
  }
  function canonicalCampUpgradeQuoteValid(upgrade) {
    const definition = CatInc.data && CatInc.data.campGameplay
      && CatInc.data.campGameplay.definitions && CatInc.data.campGameplay.definitions[upgrade.type];
    const tier = definition && definition.upgradeTiers
      && definition.upgradeTiers[String(upgrade.targetTier)];
    const legacyProduction = CAMP_BUILDING_IDS.includes(upgrade.type)
      && upgrade.startTier === 1 && upgrade.targetTier === 2;
    const rank = Number.isInteger(upgrade.rank) && upgrade.rank > 0
      ? upgrade.rank : (legacyProduction && upgrade.rank === undefined ? 1 : null);
    const law = CatInc.incrementorLaw;
    if (!tier || rank === null || !law || typeof law.scaleCosts !== "function") return false;
    const expected = law.scaleCosts(
      tier.costs,
      rank,
      Number(tier.costGrowth) || 1,
      definition && definition.law && definition.law.rounding || "ceil"
    );
    const expectedKeys = Object.keys(expected).sort();
    const actualKeys = Object.keys(upgrade.costs).sort();
    return expectedKeys.length === actualKeys.length
      && expectedKeys.every(function(resourceId, index) {
        return actualKeys[index] === resourceId
          && typeof upgrade.costs[resourceId] === "number"
          && Number.isFinite(upgrade.costs[resourceId])
          && upgrade.costs[resourceId] === expected[resourceId];
      });
  }
  function canonicalCampRepairEligible(typeId, definition) {
    if (
      !CAMP_CANONICAL_REPAIR_IDS.includes(typeId)
      || !definition || !definition.build || definition.build.entryMode !== "repair"
      || definition.unlock && definition.unlock.kind === "not-wired"
    ) return false;
    const assets = CatInc.data && CatInc.data.campAssets && CatInc.data.campAssets.assets || {};
    const family = Object.keys(assets).map(function(runtimeId) { return assets[runtimeId]; })
      .find(function(candidate) { return candidate && candidate.assetId === definition.assetId; });
    const tier = family && family.tiers && family.tiers["1"];
    const liveRevision = tier && tier.liveRevision;
    const revision = liveRevision !== null && liveRevision !== undefined
      && tier.revisions && tier.revisions[String(liveRevision)];
    return Boolean(revision && revision.status === "live");
  }
  function campRepairBuildingIds() {
    return Array.from(new Set(CAMP_BUILDING_IDS.concat(
      Object.keys(CatInc.data && CatInc.data.campGameplay && CatInc.data.campGameplay.definitions || {})
      .filter(function(typeId) {
        const definition = CatInc.data.campGameplay.definitions[typeId];
        return canonicalCampRepairEligible(typeId, definition);
      })
    )));
  }
  function canonicalCampHouseConstructionEligible(typeId) {
    const definition = CatInc.data && CatInc.data.campGameplay
      && CatInc.data.campGameplay.definitions && CatInc.data.campGameplay.definitions[typeId];
    return Boolean(definition
      && definition.category === "house"
      && definition.repeatable === true
      && definition.build && definition.build.entryMode === "build"
      && CatInc.incrementorLaw && CatInc.incrementorLaw.definition(typeId));
  }
  function campPaidCostsValid(paidCosts) {
    return estObjetSauvegarde(paidCosts)
      && Object.keys(paidCosts).length > 0
      && Object.keys(paidCosts).length <= 8
      && Object.keys(paidCosts).every(function(resourceId) {
        return /^[A-Za-z][A-Za-z0-9]*$/.test(resourceId)
          && typeof paidCosts[resourceId] === "number"
          && Number.isFinite(paidCosts[resourceId])
          && paidCosts[resourceId] >= 0;
      });
  }
  const CAMP_SCHEMA_VERSION = 2;
  const SAWMILL_TUTORIAL_STAGES = [
    "inactive", "sawmill", "work-action", "wood-slot-1-recipe",
    "wood-slot-1-cat", "wood-slot-2-recipe", "wood-slot-2-cat",
    "return-camp", "confirm-camp", "complete"
  ];
  const SAWMILL_TUTORIAL_STAGE_INDEX = SAWMILL_TUTORIAL_STAGES.reduce(function(index, stage, position) {
    index[stage] = position;
    return index;
  }, {});
  const CHEF_KISS_FEED_TUTORIAL_STAGES = [
    "inactive", "story", "gang", "mochi", "feed", "bonuses", "complete"
  ];
  const RESOURCE_BAR_KEYS = [
    "cardboardPlanks", "basicWoodPlanks", "pebbleBricks", "rockBricks",
    "salads", "grilledAnchovy", "humanLeftovers", "humanWorkersFood", "cannedCatFood"
  ];

function estObjetSauvegarde(valeur) {
  return valeur !== null && typeof valeur === "object" && !Array.isArray(valeur);
}

function normaliserStickerSelectionSauvegarde(value) {
  if (!estObjetSauvegarde(value)) return null;
  const normalized = {};
  ["stickerId", "colorId", "slotId", "anchorChoice"].forEach(function(key) {
    if (typeof value[key] === "string" && value[key].length <= 160 && !/[<>]/.test(value[key])) {
      normalized[key] = value[key];
    }
  });
  if (typeof value.scale === "number" && Number.isFinite(value.scale)) {
    normalized.scale = Math.round(Math.max(0.8, Math.min(2, value.scale)) * 1000) / 1000;
  }
  return normalized;
}

function normaliserLayoutStickersSauvegarde(layout) {
  return (Array.isArray(layout) ? layout : []).map(function(item) {
    if (!estObjetSauvegarde(item)) return item;
    const copy = {...item};
    const sticker = normaliserStickerSelectionSauvegarde(copy.sticker);
    if (sticker) copy.sticker = sticker;
    else delete copy.sticker;
    return copy;
  });
}

function normaliserProfilCampSauvegarde(value) {
  const source = estObjetSauvegarde(value) ? value : {};
  const name = typeof source.name === "string"
    ? source.name.replace(/[\u0000-\u001f\u007f]/g, " ").replace(/\s+/g, " ").trim().slice(0, 32)
    : "";
  const avatar = typeof source.avatarCatFaceId === "string"
    ? source.avatarCatFaceId.trim()
    : "";
  return {
    name: name || "My Camp",
    avatarCatFaceId: /^[a-z0-9][a-z0-9-]{0,79}$/.test(avatar) ? avatar : null
  };
}

function normaliserUiTheme(value) {
  return value === "basic" ? "basic" : "stylish";
}

function donneesSauvegardeReconnaissables(d) {
  if (!estObjetSauvegarde(d)) return false;
  const champsConnus = ["chatons", "wood", "cardboard", "cardboardPieces", "kittiesData", "workRecipeSlots"];
  return champsConnus.some(function(cle) { return d[cle] !== undefined; });
}

function deriverEtapeTutorielSawmill(d, campSource, progressionSource) {
  if (Number(d.chatons) >= 4) return "complete";
  const repaired = Array.isArray(campSource.repairedBuildingIds)
    ? campSource.repairedBuildingIds.includes("sawmill")
    : (Array.isArray(d.batimentsCampRepares) && d.batimentsCampRepares.includes("sawmill"));
  if (!repaired || Number(d.chatons) !== 3) return "inactive";
  const sawmillDialoguePending = progressionSource
    && Array.isArray(progressionSource.quickDialogueQueue)
    && progressionSource.quickDialogueQueue.includes("sawmillRepaired")
    && (!Array.isArray(progressionSource.quickDialoguesSeen)
      || !progressionSource.quickDialoguesSeen.includes("sawmillRepaired"));
  if (sawmillDialoguePending) return "inactive";
  const slots = d.workRecipeSlots && Array.isArray(d.workRecipeSlots.wood)
    ? d.workRecipeSlots.wood
    : [];
  const first = slots[0];
  const second = slots[1];
  const configured = function(slot) { return Boolean(slot && slot.recipeId); };
  const assigned = function(slot) {
    return configured(slot) && Number.isInteger(slot.kittyIndex) && slot.kittyIndex >= 0;
  };
  const firstRecipe = configured(first);
  const firstCat = assigned(first);
  const secondRecipe = configured(second);
  const secondCat = assigned(second);
  const complete = firstCat && secondCat && first.kittyIndex !== second.kittyIndex;
  let derived = "sawmill";
  if (firstRecipe) {
    derived = "wood-slot-1-cat";
  }
  if (firstCat) {
    derived = "wood-slot-2-recipe";
  }
  if (firstCat && secondRecipe) {
    derived = "wood-slot-2-cat";
  }
  if (complete) {
    derived = "return-camp";
  }

  const persisted = progressionSource && progressionSource.sawmillTutorialStage;
  if (!SAWMILL_TUTORIAL_STAGES.includes(persisted)) return derived;
  if (persisted === "complete") return "complete";
  if (persisted === "confirm-camp" && complete) return "confirm-camp";
  const achievedIndex = SAWMILL_TUTORIAL_STAGE_INDEX[derived];
  const persistedIndex = SAWMILL_TUTORIAL_STAGE_INDEX[persisted];
  // Reconciliation is monotone: authoritative slot facts may move a bypassed
  // save forward, but recovery never rewinds a persisted stage or edits the
  // slots that proved it. Navigation-only stages remain persisted because a
  // selected tab is transient rather than gameplay authority.
  return persistedIndex >= achievedIndex ? persisted : derived;
}

function validerStructureSauvegarde(d) {
  if (!estObjetSauvegarde(d)) return "The save root must be an object.";

  if (!donneesSauvegardeReconnaissables(d)) {
    return "This file does not contain recognizable Cat Inc save data.";
  }

  if (!Number.isInteger(d.saveVersion) || d.saveVersion < 0) return "Invalid save version.";
  if (d.saveVersion > SAVE_VERSION) return "This save was created by a newer version of Cat Inc.";
  if (d.saveVersion < SAVE_VERSION) return "This save uses the previous Camp progression and requires a new game.";

  const champsTableaux = [
    "cathouses", "kittiesData", "exploEnCours", "campaignsCompletees", "itemsAcquis", "itemsAppris", "itemsEtudies",
    "zonesExplorees", "objectifsComplis", "logs", "storiesVues", "ongletsVisites", "resourceBarHidden",
    "batimentsCampRepares"
  ];

  for (const cle of champsTableaux) {
    if (d[cle] !== undefined && !Array.isArray(d[cle])) return "Invalid field: " + cle + " must be an array.";
  }

  const champsObjets = ["workRecipeSlots", "perksV2", "boostInventory", "scoutingsEnCours", "resultatsExplorationZones", "resultatsCampaigns", "butinsScouting", "managers", "dailyQuests", "dailyScoutingStocks", "reparationsCamp", "constructionsMaisonsCamp", "camp", "campProfile"];
  for (const cle of champsObjets) {
    if (d[cle] !== undefined && !estObjetSauvegarde(d[cle])) return "Invalid field: " + cle + " must be an object.";
  }
  if (d.perksV2 !== undefined) {
    if (d.perksV2.version !== 2 || !Array.isArray(d.perksV2.learned)) return "Invalid Perks V2 progress.";
    if (Object.keys(d.perksV2).some(function(key) { return key !== "version" && key !== "learned"; })) {
      return "Invalid Perks V2 progress fields.";
    }
    if (d.perksV2.learned.some(function(perkId) { return typeof perkId !== "string"; })) {
      return "Invalid Perks V2 learned IDs.";
    }
  }
  if (d.boostInventory !== undefined) {
    const boostIds = Object.keys(d.boostInventory);
    if (boostIds.length > 128 || boostIds.some(function(boostId) {
      return !/^[A-Za-z][A-Za-z0-9]{0,79}$/.test(boostId)
        || !Number.isInteger(d.boostInventory[boostId]) || d.boostInventory[boostId] < 0;
    })) return "Invalid boost inventory.";
  }
  if (d.campProfile !== undefined) {
    if (Object.keys(d.campProfile).some(function(key) {
      return key !== "name" && key !== "avatarCatFaceId";
    })) return "Invalid Camp Profile fields.";
    if (d.campProfile.name !== undefined && typeof d.campProfile.name !== "string") {
      return "Invalid Camp Profile name.";
    }
    if (d.campProfile.avatarCatFaceId !== undefined && d.campProfile.avatarCatFaceId !== null
        && typeof d.campProfile.avatarCatFaceId !== "string") {
      return "Invalid Camp Profile avatar.";
    }
  }

  const champsObjetsOuNuls = ["learningEnCours", "perkLearningEnCours", "formationEnCours", "formationIngenieurEnCours", "formationTermineeEnAttente", "formationIngenieurTermineeEnAttente", "exploZoneEnCours"];
  for (const cle of champsObjetsOuNuls) {
    if (d[cle] !== undefined && d[cle] !== null && !estObjetSauvegarde(d[cle])) {
      return "Invalid field: " + cle + " must be an object or null.";
    }
  }

  const champsNumeriques = [
    "dernierTimestamp", "chatons", "wood", "woodTotalRecolte", "cardboard", "cardboardTotalRecolte",
    "cardboardPieces", "cardboardPiecesTotalRecolte", "basicWood", "basicWoodTotalRecolte", "catnip",
    "catnipTotalRecolte", "pebbles", "pebblesTotalRecolte", "rocks", "rocksTotalRecolte", "planks",
    "cardboardPlanks", "cardboardPlanksTotalProduit", "basicWoodPlanks", "basicWoodPlanksTotalProduit", "bricks", "pebbleBricks", "rockBricks", "salads", "anchovy",
    "anchovyTotalRecolte", "grilledAnchovy", "humanLeftovers", "humanWorkersFood", "cannedCatFood",
    "cannelleTokens", "cannelleBargainNextAt", "shortcutMapFinTs",
    "workBoostFinTs", "manualFocusOnboardingCompletedTs", "birdPremierSpawnTs", "birdPityEchecs", "sequenceDebutTs", "sequenceDuree", "sequenceProgressBrute", "sequenceDerniereMajTs", "sequenceVitesseDerniere", "clicCount", "reductionAuMomentDuClic",
    "reductionCumulee", "cathouseCount", "stoneCathouseCount", "solidStoneCathouseCount", "volumeEffetsSonores", "volumeMusique", "campCatPortraitScale"
  ];
  for (const cle of champsNumeriques) {
    if (d[cle] !== undefined && (typeof d[cle] !== "number" || !Number.isFinite(d[cle]) || d[cle] < 0)) {
      return "Invalid numeric field: " + cle + ".";
    }
  }
  if (d.birdPityEchecs !== undefined && (!Number.isInteger(d.birdPityEchecs) || d.birdPityEchecs < 0)) {
    return "Invalid Bird pity data.";
  }

  if (d.dailyQuests !== undefined) {
    const q = d.dailyQuests;
    if (typeof q.dateKey !== "string" || q.dateKey.length > 20) return "Invalid daily quest date.";
    if (!["food", "wood", "rock"].includes(q.recipeFamily)) return "Invalid daily quest recipe family.";
    for (const cle of ["scoutingSuccesses", "catLevelUps", "recipesCompleted"]) {
      if (!Number.isInteger(q[cle]) || q[cle] < 0) return "Invalid daily quest progress.";
    }
    if (typeof q.birdCaught !== "boolean" || typeof q.rewardClaimed !== "boolean") {
      return "Invalid daily quest flags.";
    }
    if (q.scoutingCannedCatFood !== undefined) {
      if (!estObjetSauvegarde(q.scoutingCannedCatFood)) return "Invalid daily scouting stock.";
      for (const cle of ["raidSupermarketAgain", "stealGasStationAgain"]) {
        if (!Number.isInteger(q.scoutingCannedCatFood[cle]) || q.scoutingCannedCatFood[cle] < 0) return "Invalid daily scouting stock.";
      }
    }
  }
  if (d.dailyScoutingStocks !== undefined) {
    const stocks = d.dailyScoutingStocks;
    if (typeof stocks.dateKey !== "string" || stocks.dateKey.length > 20) return "Invalid daily scouting stock date.";
    if (!estObjetSauvegarde(stocks.remaining)) return "Invalid daily scouting stock.";
    for (const cle of ["raidSupermarketAgain", "stealGasStationAgain"]) {
      if (!Number.isInteger(stocks.remaining[cle]) || stocks.remaining[cle] < 0) return "Invalid daily scouting stock.";
    }
  }

  if (d.prochainVisageChaton !== undefined && d.prochainVisageChaton !== null
      && (typeof d.prochainVisageChaton !== "string" || d.prochainVisageChaton.length > 300)) {
    return "Invalid next cat portrait.";
  }
  if (d.releaseNotesSeenVersion !== undefined
      && (typeof d.releaseNotesSeenVersion !== "string" || d.releaseNotesSeenVersion.length > 30 || /[<>]/.test(d.releaseNotesSeenVersion))) {
    return "Invalid release notes version.";
  }
  for (const cle of ["volumeEffetsSonores", "volumeMusique"]) {
    if (d[cle] !== undefined && d[cle] > 1) return "Invalid audio volume: " + cle + ".";
  }
  if (d.campCatPortraitScale !== undefined
      && (d.campCatPortraitScale < 0.7 || d.campCatPortraitScale > 1.3)) {
    return "Invalid Camp Cat portrait scale.";
  }

  const champsBooleens = [
    "sequenceEnCours", "afficherTempsAjusteRecrutement", "avertirSurplusNourriture", "scieriBloquee", "basicSawmillBloquee",
    "brickBloquee", "rockFactoryBloquee", "catchenBloquee", "catchenAnchovyBloquee", "premiereSaladeFaite",
    "jobCenterDebloque", "jobCenterConstruit", "laboratoryDebloque", "laboratoryConstruit", "engineerRankUpgradesDebloques", "birdPremierDeclenche", "birdPremiereReussie",
    "managersDebloques", "managerRoleTutorialShown", "hideCampCatIcons", "cannelleBargainRulesSeen"
  ];
  // Accepted only so pre-removal saves remain valid; migration intentionally ignores it.
  const champsBooleensLegacy = ["tutorialCompletionPopupSeen"];
  for (const cle of champsBooleens.concat(champsBooleensLegacy)) {
    if (d[cle] !== undefined && typeof d[cle] !== "boolean") return "Invalid boolean field: " + cle + ".";
  }

  if (d.cathouses && !d.cathouses.every(function(ts) { return typeof ts === "number" && Number.isFinite(ts) && ts >= 0; })) {
    return "Invalid cathouse history.";
  }

  const champsTableauxDeChaines = ["campaignsCompletees", "itemsAcquis", "itemsAppris", "itemsEtudies", "zonesExplorees", "objectifsComplis", "storiesVues", "ongletsVisites", "resourceBarHidden"];
  for (const cle of champsTableauxDeChaines) {
    if (d[cle] && !d[cle].every(function(valeur) { return typeof valeur === "string"; })) {
      return "Invalid entries in field: " + cle + ".";
    }
  }

  if (d.ongletsVisites && !d.ongletsVisites.every(function(id) { return ONGLETS_VALIDES.includes(id); })) {
    return "Invalid visited tab data.";
  }
  if (d.resourceBarHidden && !d.resourceBarHidden.every(function(id) { return RESOURCE_BAR_KEYS.includes(id); })) {
    return "Invalid resource bar preferences.";
  }

  const nombreKitties = Math.max(
    Number.isInteger(d.chatons) ? d.chatons : 0,
    Array.isArray(d.kittiesData) ? d.kittiesData.length : 0
  );
  function indexKittyValide(kittyIndex, nullable) {
    if (nullable && kittyIndex === null) return true;
    return Number.isInteger(kittyIndex) && kittyIndex >= 0 && kittyIndex < nombreKitties;
  }

  if (d.camp !== undefined) {
    const camp = d.camp;
    if (!Number.isInteger(camp.schemaVersion) || camp.schemaVersion !== CAMP_SCHEMA_VERSION) {
      return "Invalid Camp schema version.";
    }
    if (!Number.isInteger(camp.prototypeMigrationVersion) || camp.prototypeMigrationVersion < 0) {
      return "Invalid Camp migration data.";
    }
    if (camp.recruitmentFormulaVersion !== undefined
        && (!Number.isInteger(camp.recruitmentFormulaVersion) || camp.recruitmentFormulaVersion < 0)) {
      return "Invalid Camp recruitment migration data.";
    }
    if (!Array.isArray(camp.layout) || camp.layout.length > 512) return "Invalid Camp layout.";
    if (camp.fences !== undefined
        && (!Array.isArray(camp.fences) || camp.fences.length > 1024)) {
      return "Invalid Camp fence data.";
    }
    if (!Array.isArray(camp.demolitions) || camp.demolitions.length > 256) return "Invalid Camp demolition data.";
    if (!Array.isArray(camp.repairedBuildingIds)) return "Invalid repaired Camp building data.";
    if (!estObjetSauvegarde(camp.repairs)
        || !estObjetSauvegarde(camp.constructions)
        || !estObjetSauvegarde(camp.houseConstructions)
        || (camp.housingAssignments !== undefined && !estObjetSauvegarde(camp.housingAssignments))
        || (camp.groundRewards !== undefined && !estObjetSauvegarde(camp.groundRewards))
        || !estObjetSauvegarde(camp.upgrades)
        || !estObjetSauvegarde(camp.progression)) {
      return "Invalid Camp job data.";
    }
    const progressionCamp = camp.progression;
    if (["introCompleted", "junkClearingUnlocked", "operationsTableUnlocked"].some(function(cle) {
      return typeof progressionCamp[cle] !== "boolean";
    })) return "Invalid Camp progression data.";
    if (progressionCamp.storageShedUnlocked !== undefined
        && typeof progressionCamp.storageShedUnlocked !== "boolean") {
      return "Invalid Camp storage progression data.";
    }
    if (progressionCamp.woodCathouseUnlocked !== undefined
        && typeof progressionCamp.woodCathouseUnlocked !== "boolean") {
      return "Invalid Wood Cathouse progression data.";
    }
    if (["appealUnlocked", "appealIntroSeen", "appealRecruitConfirmationPending"].some(function(cle) {
      return progressionCamp[cle] !== undefined && typeof progressionCamp[cle] !== "boolean";
    })) return "Invalid Camp Appeal progression data.";
    if (progressionCamp.workBoostCueDismissed !== undefined
        && typeof progressionCamp.workBoostCueDismissed !== "boolean") {
      return "Invalid Camp Work boost cue data.";
    }
    if (progressionCamp.sawmillTutorialStage !== undefined
        && !SAWMILL_TUTORIAL_STAGES.includes(progressionCamp.sawmillTutorialStage)) {
      return "Invalid Sawmill tutorial stage.";
    }
    if (progressionCamp.chefKissFeedTutorialStage !== undefined
        && !CHEF_KISS_FEED_TUTORIAL_STAGES.includes(progressionCamp.chefKissFeedTutorialStage)) {
      return "Invalid Chef's Kiss Feed tutorial stage.";
    }
    if (progressionCamp.firstBoxTutorialStage !== undefined
        && !["inactive", "place", "assign", "complete"].includes(progressionCamp.firstBoxTutorialStage)) {
      return "Invalid first Cardboard Box tutorial stage.";
    }
    if (progressionCamp.firstBoxUnlockDialogueDismissed !== undefined
        && typeof progressionCamp.firstBoxUnlockDialogueDismissed !== "boolean") {
      return "Invalid first Cardboard Box unlock dialogue state.";
    }
    if (["firstBoxRecruitConfirmationPending", "firstBoxRecruitConfirmationAcknowledged"].some(function(cle) {
      return progressionCamp[cle] !== undefined && typeof progressionCamp[cle] !== "boolean";
    })) return "Invalid first Cardboard Box recruit confirmation state.";
    if (progressionCamp.firstGroundRewardUid !== undefined
        && progressionCamp.firstGroundRewardUid !== null
        && (typeof progressionCamp.firstGroundRewardUid !== "string"
          || progressionCamp.firstGroundRewardUid.length < 1
          || progressionCamp.firstGroundRewardUid.length > 120
          || /[<>]/.test(progressionCamp.firstGroundRewardUid))) {
      return "Invalid first ground reward tutorial target.";
    }
    if (!["quickDialogueQueue", "quickDialoguesSeen"].every(function(cle) {
      return Array.isArray(progressionCamp[cle])
        && progressionCamp[cle].length <= 128
        && progressionCamp[cle].every(function(id) {
          return typeof id === "string" && id.length > 0 && id.length <= 100 && !/[<>]/.test(id);
        });
    })) return "Invalid Camp quick dialogue data.";
    if (camp.terrain !== null && !estObjetSauvegarde(camp.terrain)) return "Invalid Camp terrain.";
    const layoutValide = camp.layout.every(function(item) {
      return estObjetSauvegarde(item)
        && typeof item.uid === "string" && item.uid.length > 0 && item.uid.length <= 120
        && typeof item.type === "string" && item.type.length > 0 && item.type.length <= 80
        && Number.isInteger(item.x) && Number.isInteger(item.y)
        && (item.tier === undefined || (Number.isInteger(item.tier) && item.tier > 0 && item.tier <= 100))
        && (item.rotation === undefined || [0, 90, 180, 270].includes(item.rotation))
        && (item.lawRank === undefined || (Number.isInteger(item.lawRank) && item.lawRank > 0))
        && (item.paidCosts === undefined || (
          estObjetSauvegarde(item.paidCosts)
          && Object.keys(item.paidCosts).length <= 8
          && Object.keys(item.paidCosts).every(function(resourceId) {
            return /^[A-Za-z][A-Za-z0-9]*$/.test(resourceId)
              && typeof item.paidCosts[resourceId] === "number"
              && Number.isFinite(item.paidCosts[resourceId])
              && item.paidCosts[resourceId] >= 0;
          })
        ))
        && (item.sticker === undefined || item.sticker === null || (
          estObjetSauvegarde(item.sticker)
          && Object.keys(item.sticker).length <= 6
          && ["stickerId", "colorId", "slotId", "anchorChoice"].every(function(key) {
            return item.sticker[key] === undefined
              || (typeof item.sticker[key] === "string"
                && item.sticker[key].length <= 160
                && !/[<>]/.test(item.sticker[key]));
          })
          && (item.sticker.scale === undefined
            || (typeof item.sticker.scale === "number" && Number.isFinite(item.sticker.scale)))
        ));
    });
    if (!layoutValide) return "Invalid Camp layout item.";
    const cloturesValides = (camp.fences || []).every(function(edge) {
      return estObjetSauvegarde(edge)
        && typeof edge.type === "string" && edge.type.length > 0 && edge.type.length <= 80
        && Number.isInteger(edge.x) && Number.isInteger(edge.y)
        && ["horizontal", "vertical"].includes(edge.orientation);
    });
    if (!cloturesValides) return "Invalid Camp fence edge.";
    const demolitionsValides = camp.demolitions.every(function(demolition) {
      const modernAssignment = Array.isArray(demolition && demolition.kittyIndices);
      const hasRequiredCats = Number.isInteger(demolition && demolition.requiredCats);
      const legacyAssignment = !modernAssignment && !hasRequiredCats;
      const kittyIndices = modernAssignment
        ? demolition.kittyIndices
        : [demolition && demolition.kittyIndex];
      // Legacy records only carried kittyIndex. Any record carrying
      // kittyIndices is modern and must carry the persisted required count;
      // runtime still reconciles that count against the authoritative target.
      const kittyCountValide = legacyAssignment
        ? kittyIndices.length === 1
        : modernAssignment
          && hasRequiredCats
          && demolition.requiredCats >= 1
          && demolition.requiredCats <= 8
          && kittyIndices.length === demolition.requiredCats;
      const paidCosts = demolition && demolition.paidCosts;
      const grandfatheredRightOneCatAccess = Boolean(
        demolition
        && demolition.targetKind === "access"
        && demolition.obstacleUid === "garden-access-greenGarden"
        && modernAssignment
        && demolition.requiredCats === 1
        && kittyIndices.length === 1
        && estObjetSauvegarde(paidCosts)
        && Object.keys(paidCosts).length === 2
        && Number(paidCosts.basicWoodPlanks) === 30
        && Number(paidCosts.pebbleBricks) === 30
      );
      const accessAssignmentValide = (demolition && demolition.targetKind !== "access")
        || grandfatheredRightOneCatAccess
        || (modernAssignment
          && demolition.requiredCats === 2
          && kittyIndices.length === 2);
      return estObjetSauvegarde(demolition)
        && typeof demolition.obstacleUid === "string"
        && demolition.obstacleUid.length > 0
        && demolition.obstacleUid.length <= 160
        && !/[<>]/.test(demolition.obstacleUid)
        && ["terrain", "layout", "access"].includes(demolition.targetKind)
        && indexKittyValide(demolition.kittyIndex, false)
        && kittyIndices.length > 0
        && kittyIndices.length <= 8
        && kittyIndices.every(function(kittyIndex) { return indexKittyValide(kittyIndex, false); })
        && new Set(kittyIndices).size === kittyIndices.length
        && kittyCountValide
        && accessAssignmentValide
        && typeof demolition.startTs === "number"
        && Number.isFinite(demolition.startTs)
        && demolition.startTs >= 0
        && typeof demolition.duree === "number"
        && Number.isFinite(demolition.duree)
        && demolition.duree > 0
        && typeof demolition.readyToClaim === "boolean";
    });
    if (!demolitionsValides) return "Invalid Camp demolition data.";
    if (!camp.repairedBuildingIds.every(function(id) { return campRepairBuildingIds().includes(id); })) {
      return "Invalid repaired Camp building data.";
    }
    const reparationsCampValides = Object.keys(camp.repairs).length <= campRepairBuildingIds().length
      && Object.keys(camp.repairs).every(function(buildingId) {
        const reparation = camp.repairs[buildingId];
        return campRepairBuildingIds().includes(buildingId)
          && estObjetSauvegarde(reparation)
          && indexKittyValide(reparation.kittyIndex, false)
          && typeof reparation.startTs === "number" && Number.isFinite(reparation.startTs) && reparation.startTs >= 0
          && typeof reparation.duree === "number" && Number.isFinite(reparation.duree) && reparation.duree > 0
          && typeof reparation.readyToClaim === "boolean";
      });
    if (!reparationsCampValides) return "Invalid Camp repair data.";
    const constructionsCampValides = Object.keys(camp.houseConstructions).length <= 128
      && Object.keys(camp.houseConstructions).every(function(uid) {
        const construction = camp.houseConstructions[uid];
        const coutLegacyCardboardValide = construction
          && construction.type === "cardboardBox"
          && typeof construction.coutCardboardPlanks === "number"
          && Number.isFinite(construction.coutCardboardPlanks)
          && construction.coutCardboardPlanks >= 0;
        const coutsPayesValides = construction && construction.paidCosts !== undefined
          ? campPaidCostsValid(construction.paidCosts)
          : coutLegacyCardboardValide;
        return typeof uid === "string" && uid.length > 0 && uid.length <= 160 && !/[<>]/.test(uid)
          && estObjetSauvegarde(construction)
          && canonicalCampHouseConstructionEligible(construction.type)
          && indexKittyValide(construction.kittyIndex, false)
          && typeof construction.startTs === "number" && Number.isFinite(construction.startTs) && construction.startTs >= 0
          && typeof construction.duree === "number" && Number.isFinite(construction.duree) && construction.duree > 0
          && Number.isInteger(construction.lawRank) && construction.lawRank > 0
          && coutsPayesValides
          && (construction.coutCardboardPlanks === undefined || coutLegacyCardboardValide)
          && typeof construction.readyToClaim === "boolean";
      });
    if (!constructionsCampValides) return "Invalid Camp house construction data.";
    const housingAssignmentsSource = camp.housingAssignments || {};
    const housingAssignmentsValides = Object.keys(housingAssignmentsSource).length <= 128
      && Object.keys(housingAssignmentsSource).every(function(kittyIndex) {
        return /^(0|[1-9][0-9]*)$/.test(kittyIndex)
          && indexKittyValide(Number(kittyIndex), false)
          && typeof housingAssignmentsSource[kittyIndex] === "string"
          && housingAssignmentsSource[kittyIndex].length > 0
          && housingAssignmentsSource[kittyIndex].length <= 160
          && !/[<>]/.test(housingAssignmentsSource[kittyIndex]);
      });
    if (!housingAssignmentsValides) return "Invalid Camp housing assignment data.";
    const groundRewardsSource = camp.groundRewards || {};
    const groundRewardsValides = Object.keys(groundRewardsSource).length <= 256
      && Object.keys(groundRewardsSource).every(function(uid) {
        const reward = groundRewardsSource[uid];
        return typeof uid === "string" && uid.length > 0 && uid.length <= 160 && !/[<>]/.test(uid)
          && estObjetSauvegarde(reward)
          && typeof reward.resourceId === "string" && /^[A-Za-z][A-Za-z0-9]*$/.test(reward.resourceId)
          && reward.resourceId.length <= 80
          && typeof reward.quantity === "number" && Number.isFinite(reward.quantity)
          && reward.quantity > 0 && reward.quantity <= 1000000
          && (reward.targetKind === undefined || ["terrain", "layout"].includes(reward.targetKind))
          && (reward.foundBy === undefined || (typeof reward.foundBy === "string"
            && reward.foundBy.length <= 160 && !/[<>]/.test(reward.foundBy)))
          && (reward.anchor === undefined || (
            estObjetSauvegarde(reward.anchor)
            && Number.isInteger(reward.anchor.x) && reward.anchor.x >= 0
            && Number.isInteger(reward.anchor.y) && reward.anchor.y >= 0
            && Number.isInteger(reward.anchor.width) && reward.anchor.width > 0
            && Number.isInteger(reward.anchor.height) && reward.anchor.height > 0
          ));
      });
    if (!groundRewardsValides) return "Invalid Camp ground reward data.";
    const buildingConstructionIds = [
      "operationsTable", "jobCenter", "laboratory", "storage",
      "marketStall", "smallFountain", "cardboardLitterbox"
    ];
    const constructionsBatimentsValides = Object.keys(camp.constructions).length <= 128
      && Object.keys(camp.constructions).every(function(uid) {
        const construction = camp.constructions[uid];
        return typeof uid === "string" && uid.length > 0 && uid.length <= 160 && !/[<>]/.test(uid)
          && estObjetSauvegarde(construction)
          && buildingConstructionIds.includes(construction.type)
          && indexKittyValide(construction.kittyIndex, false)
          && typeof construction.startTs === "number" && Number.isFinite(construction.startTs) && construction.startTs >= 0
           && typeof construction.duration === "number" && Number.isFinite(construction.duration) && construction.duration > 0
           && typeof construction.readyToClaim === "boolean"
           && (construction.lawRank === undefined
             || (Number.isInteger(construction.lawRank) && construction.lawRank > 0))
           && (construction.paidCosts === undefined || (
             estObjetSauvegarde(construction.paidCosts)
             && Object.keys(construction.paidCosts).length <= 8
             && Object.keys(construction.paidCosts).every(function(resourceId) {
               return /^[A-Za-z][A-Za-z0-9]*$/.test(resourceId)
                 && typeof construction.paidCosts[resourceId] === "number"
                 && Number.isFinite(construction.paidCosts[resourceId])
                 && construction.paidCosts[resourceId] >= 0;
             })
           ))
           && estObjetSauvegarde(construction.costs)
          && Object.keys(construction.costs).length <= 8
          && Object.keys(construction.costs).every(function(resourceId) {
            return typeof resourceId === "string" && /^[A-Za-z][A-Za-z0-9]*$/.test(resourceId)
              && typeof construction.costs[resourceId] === "number"
              && Number.isFinite(construction.costs[resourceId]) && construction.costs[resourceId] >= 0;
          });
      });
    if (!constructionsBatimentsValides) return "Invalid Camp building construction data.";
    const ameliorationsCampValides = Object.keys(camp.upgrades).length <= 128
      && Object.keys(camp.upgrades).every(function(uid) {
        const upgrade = camp.upgrades[uid];
        return typeof uid === "string" && uid.length > 0 && uid.length <= 160 && !/[<>]/.test(uid)
          && estObjetSauvegarde(upgrade)
          && typeof upgrade.type === "string"
          && indexKittyValide(upgrade.kittyIndex, false)
          && Number.isInteger(upgrade.startTier) && upgrade.startTier > 0 && upgrade.startTier <= 100
          && Number.isInteger(upgrade.targetTier) && upgrade.targetTier === upgrade.startTier + 1 && upgrade.targetTier <= 100
          && canonicalCampUpgradeEligible(upgrade.type, upgrade.startTier, upgrade.targetTier)
          && (upgrade.rank === undefined || (Number.isInteger(upgrade.rank) && upgrade.rank > 0))
          && typeof upgrade.startTs === "number" && Number.isFinite(upgrade.startTs) && upgrade.startTs >= 0
          && typeof upgrade.duration === "number" && Number.isFinite(upgrade.duration) && upgrade.duration > 0
          && typeof upgrade.readyToClaim === "boolean"
          && estObjetSauvegarde(upgrade.costs)
          && Object.keys(upgrade.costs).length <= 8
          && Object.keys(upgrade.costs).every(function(resourceId) {
            return typeof resourceId === "string" && /^[A-Za-z][A-Za-z0-9]*$/.test(resourceId)
              && typeof upgrade.costs[resourceId] === "number"
              && Number.isFinite(upgrade.costs[resourceId])
              && upgrade.costs[resourceId] >= 0;
          })
          && canonicalCampUpgradeQuoteValid(upgrade);
      });
    if (!ameliorationsCampValides) return "Invalid Camp upgrade data.";
  }
  if (d.batimentsCampRepares && !d.batimentsCampRepares.every(function(id) {
    return campRepairBuildingIds().includes(id);
  })) {
    return "Invalid repaired Camp building data.";
  }
  if (d.reparationsCamp) {
    const reparationsValides = Object.keys(d.reparationsCamp).every(function(buildingId) {
      const reparation = d.reparationsCamp[buildingId];
      return campRepairBuildingIds().includes(buildingId)
        && estObjetSauvegarde(reparation)
        && Number.isInteger(reparation.kittyIndex)
        && reparation.kittyIndex >= 0
        && typeof reparation.startTs === "number"
        && Number.isFinite(reparation.startTs)
        && reparation.startTs >= 0
        && typeof reparation.duree === "number"
        && Number.isFinite(reparation.duree)
        && reparation.duree > 0;
    });
    if (!reparationsValides) return "Invalid Camp repair data.";
  }
  if (d.constructionsMaisonsCamp) {
    const constructionsValides = Object.keys(d.constructionsMaisonsCamp).every(function(uid) {
      const construction = d.constructionsMaisonsCamp[uid];
      return typeof uid === "string"
        && uid.length > 0
        && uid.length <= 160
        && !/[<>]/.test(uid)
        && estObjetSauvegarde(construction)
        && construction.type === "cardboardBox"
        && Number.isInteger(construction.kittyIndex)
        && construction.kittyIndex >= 0
        && typeof construction.startTs === "number"
        && Number.isFinite(construction.startTs)
        && construction.startTs >= 0
        && typeof construction.duree === "number"
        && Number.isFinite(construction.duree)
        && construction.duree > 0
        && typeof construction.coutCardboardPlanks === "number"
        && Number.isFinite(construction.coutCardboardPlanks)
        && construction.coutCardboardPlanks >= 0;
    });
    if (!constructionsValides) return "Invalid Camp house construction data.";
  }

  if (d.kittiesData) {
    const kittiesValides = d.kittiesData.every(function(k) {
      if (!estObjetSauvegarde(k)) return false;
      if (k.nom !== undefined && (typeof k.nom !== "string" || k.nom.length > 100 || /[<>]/.test(k.nom))) return false;
      return ["niveau", "xp", "tier", "managerMult", "jobNiveau", "engineerRank"].every(function(cle) {
        return k[cle] === undefined || (typeof k[cle] === "number" && Number.isFinite(k[cle]) && k[cle] >= 0);
      });
    });
    if (!kittiesValides) return "Invalid cat data.";
  }

  if (d.reparationsCamp && !Object.values(d.reparationsCamp).every(function(reparation) {
    return indexKittyValide(reparation.kittyIndex, false);
  })) {
    return "Invalid Cat assigned to Camp repair.";
  }
  if (d.constructionsMaisonsCamp && !Object.values(d.constructionsMaisonsCamp).every(function(construction) {
    return indexKittyValide(construction.kittyIndex, false);
  })) {
    return "Invalid Cat assigned to Camp house construction.";
  }

  if (!d.workRecipeSlots || !WORK_FAMILIES.every(function(family) {
    return Array.isArray(d.workRecipeSlots[family]) && d.workRecipeSlots[family].length >= 2;
  })) {
    return "Invalid Work recipe slot data.";
  }
  const recipeSlotsValides = WORK_FAMILIES.every(function(family) {
    return d.workRecipeSlots[family].every(function(slot) {
      if (!estObjetSauvegarde(slot)
          || !indexKittyValide(slot.kittyIndex, true)
          || (slot.recipeId !== null && (typeof slot.recipeId !== "string" || slot.recipeId.length > 100 || /[<>]/.test(slot.recipeId)))
          || !WORK_RECIPE_PHASES.includes(slot.phase)
          || typeof slot.phaseProgress !== "number" || !Number.isFinite(slot.phaseProgress) || slot.phaseProgress < 0
          || typeof slot.outputCarry !== "number" || !Number.isFinite(slot.outputCarry) || slot.outputCarry < 0
          || !estObjetSauvegarde(slot.gatheredInputs)
          || !estObjetSauvegarde(slot.reservedInputs)) return false;
      return [slot.gatheredInputs, slot.reservedInputs].every(function(inputs) {
        return Object.keys(inputs).every(function(resourceId) {
          const quantity = inputs[resourceId];
          return resourceId.length <= 100 && !/[<>]/.test(resourceId)
            && typeof quantity === "number" && Number.isFinite(quantity) && quantity >= 0;
        });
      });
    });
  });
  if (!recipeSlotsValides) return "Invalid Work recipe slot data.";

  if (d.managers) {
    const managersValides = Object.values(d.managers).every(function(kittyIndex) {
      return indexKittyValide(kittyIndex, true);
    });
    if (!managersValides) return "Invalid manager data.";
  }

  if (d.exploEnCours && !d.exploEnCours.every(function(explo) {
    return estObjetSauvegarde(explo)
      && typeof explo.id === "string"
      && Array.isArray(explo.kittyIndices)
      && explo.kittyIndices.every(function(kittyIndex) { return indexKittyValide(kittyIndex, false); })
      && typeof explo.startTs === "number" && Number.isFinite(explo.startTs)
      && typeof explo.duree === "number" && Number.isFinite(explo.duree) && explo.duree >= 0;
  })) return "Invalid campaign data.";

  if (d.exploZoneEnCours) {
    const zoneValide = typeof d.exploZoneEnCours.zoneId === "string"
      && Array.isArray(d.exploZoneEnCours.kittyIndices)
      && d.exploZoneEnCours.kittyIndices.every(function(kittyIndex) { return indexKittyValide(kittyIndex, false); })
      && typeof d.exploZoneEnCours.startTs === "number" && Number.isFinite(d.exploZoneEnCours.startTs)
      && typeof d.exploZoneEnCours.duree === "number" && Number.isFinite(d.exploZoneEnCours.duree) && d.exploZoneEnCours.duree >= 0;
    if (!zoneValide) return "Invalid zone exploration data.";
  }

  if (d.scoutingsEnCours) {
    const scoutingsValides = Object.values(d.scoutingsEnCours).every(function(scouting) {
      return estObjetSauvegarde(scouting)
        && indexKittyValide(scouting.kittyIndex, false)
        && typeof scouting.startTs === "number" && Number.isFinite(scouting.startTs)
        && (scouting.duree === undefined || (typeof scouting.duree === "number" && Number.isFinite(scouting.duree) && scouting.duree >= 0));
    });
    if (!scoutingsValides) return "Invalid scouting data.";
  }

  if (d.resultatsExplorationZones) {
    const resultatsZonesValides = Object.values(d.resultatsExplorationZones).every(function(resultat) {
      return estObjetSauvegarde(resultat)
        && typeof resultat.success === "boolean"
        && Array.isArray(resultat.kittyIndices)
        && resultat.kittyIndices.every(function(kittyIndex) { return indexKittyValide(kittyIndex, false); });
    });
    if (!resultatsZonesValides) return "Invalid pending zone exploration results.";
  }

  if (d.resultatsCampaigns) {
    const resultatsCampaignsValides = Object.values(d.resultatsCampaigns).every(function(resultat) {
      return estObjetSauvegarde(resultat)
        && typeof resultat.success === "boolean"
        && Array.isArray(resultat.kittyIndices)
        && resultat.kittyIndices.every(function(kittyIndex) { return indexKittyValide(kittyIndex, false); })
        && Array.isArray(resultat.recompenses)
        && resultat.recompenses.every(function(recompense) {
          return estObjetSauvegarde(recompense)
            && typeof recompense.recompense === "string"
            && typeof recompense.qty === "number" && Number.isFinite(recompense.qty) && recompense.qty >= 0;
        });
    });
    if (!resultatsCampaignsValides) return "Invalid pending campaign results.";
  }

  if (d.butinsScouting) {
    const compteurs = ["successful", "failed", "regular", "lucky", "superLucky", "doubled"];
    const butinsValides = Object.values(d.butinsScouting).every(function(butin) {
      return estObjetSauvegarde(butin)
        && compteurs.every(function(cle) {
          return Number.isInteger(butin[cle]) && butin[cle] >= 0;
        })
        && (butin.tripled === undefined || (Number.isInteger(butin.tripled) && butin.tripled >= 0))
        && estObjetSauvegarde(butin.rewards)
        && Object.values(butin.rewards).every(function(qty) {
          return typeof qty === "number" && Number.isFinite(qty) && qty >= 0;
        });
    });
    if (!butinsValides) return "Invalid accumulated scouting rewards.";
  }

  if (d.learningEnCours) {
    const learningValide = typeof d.learningEnCours.itemId === "string"
      && typeof d.learningEnCours.startTs === "number" && Number.isFinite(d.learningEnCours.startTs)
      && typeof d.learningEnCours.duree === "number" && Number.isFinite(d.learningEnCours.duree) && d.learningEnCours.duree >= 0
      && (d.learningEnCours.kittyIndex === undefined || indexKittyValide(d.learningEnCours.kittyIndex, false));
    if (!learningValide) return "Invalid learning data.";
  }

  if (d.perkLearningEnCours) {
    const learning = d.perkLearningEnCours;
    const node = CatInc.data && CatInc.data.perksV2
      && Array.isArray(CatInc.data.perksV2.nodes)
      ? CatInc.data.perksV2.nodes.find(function(candidate) {
          return candidate && candidate.id === learning.perkId && candidate.available && !candidate.granted;
        })
      : null;
    const canonicalCost = node && Number(node.costs && node.costs.cannedCatFood);
    const costKeys = estObjetSauvegarde(learning.costs) ? Object.keys(learning.costs) : [];
    const learningValide = indexKittyValide(learning.kittyIndex, false)
      && typeof learning.perkId === "string"
      && typeof learning.jobId === "string"
      && node && learning.jobId === node.jobId
      && Number.isFinite(canonicalCost) && canonicalCost > 0
      && typeof learning.startTs === "number" && Number.isFinite(learning.startTs)
      && learning.duree === canonicalCost * 60 * 60 * 1000
      && costKeys.length === 1 && costKeys[0] === "cannedCatFood"
      && learning.costs.cannedCatFood === canonicalCost;
    if (!learningValide) return "Invalid Perk learning data.";
  }

  if (d.formationEnCours) {
    const formationValide = indexKittyValide(d.formationEnCours.kittyIndex, false)
      && typeof d.formationEnCours.metier === "string"
      && typeof d.formationEnCours.startTs === "number" && Number.isFinite(d.formationEnCours.startTs)
      && typeof d.formationEnCours.duree === "number" && Number.isFinite(d.formationEnCours.duree) && d.formationEnCours.duree >= 0;
    if (!formationValide) return "Invalid training data.";
  }

  if (d.formationIngenieurEnCours) {
    const formationValide = indexKittyValide(d.formationIngenieurEnCours.kittyIndex, false)
      && d.formationIngenieurEnCours.metier === "camp-engineer"
      && typeof d.formationIngenieurEnCours.startTs === "number" && Number.isFinite(d.formationIngenieurEnCours.startTs)
      && typeof d.formationIngenieurEnCours.duree === "number" && Number.isFinite(d.formationIngenieurEnCours.duree) && d.formationIngenieurEnCours.duree >= 0
      && (d.formationIngenieurEnCours.engineerRank === undefined || (Number.isInteger(d.formationIngenieurEnCours.engineerRank) && d.formationIngenieurEnCours.engineerRank >= 1));
    if (!formationValide) return "Invalid engineer training data.";
  }

  if (d.regionCourante !== undefined && typeof d.regionCourante !== "string") return "Invalid current region.";

  if (d.logs) {
    const logsValides = d.logs.every(function(entry) {
      if (!estObjetSauvegarde(entry) || typeof entry.type !== "string") return false;
      if (entry.heure !== undefined && typeof entry.heure !== "string") return false;
      if (entry.texte !== undefined && typeof entry.texte !== "string") return false;
      return entry.lignes === undefined || (Array.isArray(entry.lignes) && entry.lignes.every(function(ligne) { return typeof ligne === "string"; }));
    });
    if (!logsValides) return "Invalid log data.";
  }

  return null;
}

function analyserSauvegardeBrute(raw) {
  let data;
  try {
    data = JSON.parse(raw);
  } catch (e) {
    return { ok: false, erreur: "The file does not contain valid JSON." };
  }

  const version = data && data.saveVersion === undefined ? 0 : data && data.saveVersion;
  if (donneesSauvegardeReconnaissables(data)
      && Number.isInteger(version) && version >= 0 && version < SAVE_VERSION) {
    return {
      ok: false,
      incompatible: true,
      ancienneVersion: version,
      data: data,
      erreur: "This save uses the previous Camp progression and requires a new game."
    };
  }
  if (estObjetSauvegarde(data) && estObjetSauvegarde(data.camp)) {
    data = {
      ...data,
      camp: {
        ...data.camp,
        layout: normaliserLayoutStickersSauvegarde(data.camp.layout)
      }
    };
  }
  if (estObjetSauvegarde(data)) {
    data = {
      ...data,
      campProfile: normaliserProfilCampSauvegarde(data.campProfile),
      uiTheme: normaliserUiTheme(data.uiTheme)
    };
  }
  const erreur = validerStructureSauvegarde(data);
  return erreur ? { ok: false, erreur: erreur } : { ok: true, data: data };
}

  function creerDonneesSauvegarde(etat) {
    return {
    saveVersion:          SAVE_VERSION,
    dernierTimestamp:     etat.dernierTimestamp,
    chatons:                etat.chatons,
    cardboardPieces:              etat.cardboardPieces,         cardboardPiecesTotalRecolte: etat.cardboardPiecesTotalRecolte,
    basicWood:              etat.basicWood,         basicWoodTotalRecolte: etat.basicWoodTotalRecolte,
    catnip:                 etat.catnip,            catnipTotalRecolte:    etat.catnipTotalRecolte,
    pebbles:                etat.pebbles,           pebblesTotalRecolte:   etat.pebblesTotalRecolte,
    rocks:                  etat.rocks,             rocksTotalRecolte:     etat.rocksTotalRecolte,
    cardboardPlanks:        etat.cardboardPlanks,
    cardboardPlanksTotalProduit: etat.cardboardPlanksTotalProduit,
    basicWoodPlanks:        etat.basicWoodPlanks,
    basicWoodPlanksTotalProduit: etat.basicWoodPlanksTotalProduit,
    pebbleBricks:           etat.pebbleBricks,
    rockBricks:             etat.rockBricks,
    salads:                 etat.salads,
    anchovy:                etat.anchovy,             anchovyTotalRecolte:  etat.anchovyTotalRecolte,
    grilledAnchovy:         etat.grilledAnchovy,
    humanLeftovers:         etat.humanLeftovers,
    humanWorkersFood:       etat.humanWorkersFood,
    cannedCatFood:          etat.cannedCatFood,
    cannelleTokens:         etat.cannelleTokens,
    cannelleBargainNextAt:  etat.cannelleBargainNextAt,
    cannelleBargainRulesSeen: etat.cannelleBargainRulesSeen,
    boostInventory:         etat.boostInventory,
    shortcutMapFinTs:       etat.shortcutMapFinTs,
    perksV2:                perksV2Api.normalizeProgress(etat.perksV2),
    perkLearningEnCours:    etat.perkLearningEnCours,
    workBoostFinTs:         etat.workBoostFinTs,
    manualFocusOnboardingCompletedTs: etat.manualFocusOnboardingCompletedTs,
    birdPremierSpawnTs:      etat.birdPremierSpawnTs,
    birdPremierDeclenche:    etat.birdPremierDeclenche,
    birdPremiereReussie:     etat.birdPremiereReussie,
    birdPityEchecs:          etat.birdPityEchecs,
    sequenceEnCours:         etat.sequenceEnCours,
    sequenceDebutTs:         etat.sequenceDebutTs,
    sequenceDuree:           etat.sequenceDuree,
    sequenceProgressBrute:   etat.sequenceProgressBrute,
    sequenceDerniereMajTs:   etat.sequenceDerniereMajTs,
    sequenceVitesseDerniere: etat.sequenceVitesseDerniere,
    prochainVisageChaton:    etat.prochainVisageChaton,
    clicCount:               etat.clicCount,
    reductionAuMomentDuClic: etat.reductionAuMomentDuClic,
    afficherTempsAjusteRecrutement: etat.afficherTempsAjusteRecrutement,
    avertirSurplusNourriture: etat.avertirSurplusNourriture,
    volumeEffetsSonores:     etat.volumeEffetsSonores,
    volumeMusique:           etat.volumeMusique,
    uiTheme:                 normaliserUiTheme(etat.uiTheme),
    campCatPortraitScale:    etat.campCatPortraitScale,
    hideCampCatIcons:          etat.hideCampCatIcons,
    resourceBarHidden:       etat.resourceBarHidden,
    campProfile:             normaliserProfilCampSauvegarde(etat.campProfile),
    scieriBloquee:              etat.scieriBloquee,
    basicSawmillBloquee:        etat.basicSawmillBloquee,
    brickBloquee:               etat.brickBloquee,
    rockFactoryBloquee:         etat.rockFactoryBloquee,
    catchenBloquee:             etat.catchenBloquee,
    catchenAnchovyBloquee:      etat.catchenAnchovyBloquee,
    premiereSaladeFaite:        etat.premiereSaladeFaite,
    reductionCumulee: etat.reductionCumulee,
    workRecipeSlots: etat.workRecipeSlots,
    camp: {
      ...etat.camp,
      layout: normaliserLayoutStickersSauvegarde(etat.camp && etat.camp.layout)
    },
    cathouses:          etat.cathouses,
    cathouseCount:      etat.cathouseCount,
    stoneCathouseCount: etat.stoneCathouseCount,
    solidStoneCathouseCount: etat.solidStoneCathouseCount,
    kittiesData:         etat.kittiesData,
    exploEnCours:        etat.exploEnCours,
    campaignsCompletees: etat.campaignsCompletees,
    itemsAcquis:         etat.itemsAcquis,
    itemsAppris:         etat.itemsAppris,
    itemsEtudies:        etat.itemsEtudies,
    learningEnCours:     etat.learningEnCours,
    jobCenterDebloque:        etat.jobCenterDebloque,
    jobCenterConstruit:       etat.jobCenterConstruit,
    laboratoryDebloque:       etat.laboratoryDebloque,
    laboratoryConstruit:      etat.laboratoryConstruit,
    engineerRankUpgradesDebloques: etat.engineerRankUpgradesDebloques,
    formationEnCours:         etat.formationEnCours,
    formationIngenieurEnCours: etat.formationIngenieurEnCours,
    formationTermineeEnAttente: etat.formationTermineeEnAttente,
    formationIngenieurTermineeEnAttente: etat.formationIngenieurTermineeEnAttente,
    dailyQuests:          etat.dailyQuests,
    dailyScoutingStocks:  etat.dailyScoutingStocks,
    regionCourante:           etat.regionCourante,
    zonesExplorees:      etat.zonesExplorees,
    exploZoneEnCours:    etat.exploZoneEnCours,
    resultatsExplorationZones: etat.resultatsExplorationZones,
    resultatsCampaigns:  etat.resultatsCampaigns,
    explorationRetries: normaliserExplorationRetries(etat.explorationRetries, etat),
    scoutingsEnCours:    etat.scoutingsEnCours,
    butinsScouting:      etat.butinsScouting,
    managers:            etat.managers,
    managersDebloques:   etat.managersDebloques,
    managerRoleTutorialShown: etat.managerRoleTutorialShown,
    objectifsComplis: etat.objectifsComplis,
    logs:          etat.logs,
    storiesVues:   etat.storiesVues,
    releaseNotesSeenVersion: etat.releaseNotesSeenVersion,
    ongletsVisites: etat.ongletsVisites
  };
  }

  function serialiserEtat(etat) {
    return JSON.stringify(creerDonneesSauvegarde(etat));
  }

  function migrerDonneesSauvegarde(data, options) {
    options = options || {};
    const maintenant = Number.isFinite(options.maintenant) ? options.maintenant : Date.now();
    const NOMS_KITTIES = options.nomsKitties || [];
    const assignerVisageChaton = typeof options.assignerVisageChaton === "function"
      ? options.assignerVisageChaton
      : function() { return null; };
    const normaliserVisageChaton = typeof options.normaliserVisageChaton === "function"
      ? options.normaliserVisageChaton
      : null;
    const jobIds = new Set(Array.isArray(options.jobIds) ? options.jobIds : JOB_IDS);
    const jobIdMigration = { bucheron: "lumberjack", charpentier: "carpenter", fermier: "farmer", cuisinier: "chef" };
    function normaliserJobId(value) {
      if (value === null || value === undefined || value === "") return null;
      const migrated = jobIdMigration[value] || value;
      return typeof migrated === "string" && jobIds.has(migrated) ? migrated : null;
    }
    const d = JSON.parse(JSON.stringify(data));
    const etat = stateCore.creerEtatInitial(maintenant);


  etat.dernierTimestamp       = d.dernierTimestamp       || maintenant;
  etat.chatons                = d.chatons                || 0;
  // Migration: wood → cardboard
  etat.cardboardPieces              = d.cardboardPieces              !== undefined ? d.cardboardPieces              : d.cardboard              !== undefined ? d.cardboard              : (d.wood || 0);
  etat.cardboardPiecesTotalRecolte  = d.cardboardPiecesTotalRecolte  !== undefined ? d.cardboardPiecesTotalRecolte  : d.cardboardTotalRecolte  !== undefined ? d.cardboardTotalRecolte  : (d.woodTotalRecolte || 0);
  etat.basicWood              = d.basicWood              || 0;
  etat.basicWoodTotalRecolte  = d.basicWoodTotalRecolte  || 0;
  etat.catnip                 = d.catnip                 || 0;
  etat.catnipTotalRecolte     = d.catnipTotalRecolte     || 0;
  etat.pebbles                = d.pebbles                || 0;
  etat.pebblesTotalRecolte    = d.pebblesTotalRecolte    || 0;
  etat.rocks                  = d.rocks                  || 0;
  etat.rocksTotalRecolte      = d.rocksTotalRecolte      || 0;
  // Migration: planks → cardboardPlanks, bricks → pebbleBricks
  etat.cardboardPlanks        = d.cardboardPlanks        !== undefined ? d.cardboardPlanks        : (d.planks || 0);
  // New saves track lifetime finished Cardboard Planks. Older saves can
  // safely infer completion when the tutorial objective was already done;
  // otherwise keep at least the current stock as the conservative baseline.
  const legacyTenPlanks = Array.isArray(d.objectifsComplis) && d.objectifsComplis.includes("tenPlanks");
  etat.cardboardPlanksTotalProduit = d.cardboardPlanksTotalProduit !== undefined
    ? d.cardboardPlanksTotalProduit
    : Math.max(etat.cardboardPlanks, legacyTenPlanks ? 10 : 0);
  etat.basicWoodPlanks        = d.basicWoodPlanks        || 0;
  etat.basicWoodPlanksTotalProduit = d.basicWoodPlanksTotalProduit || 0;
  etat.pebbleBricks           = d.pebbleBricks           !== undefined ? d.pebbleBricks           : (d.bricks || 0);
  etat.rockBricks             = d.rockBricks             || 0;
  etat.salads                 = d.salads                 || 0;
  etat.anchovy                = d.anchovy                || 0;
  etat.anchovyTotalRecolte    = d.anchovyTotalRecolte    || 0;
  etat.grilledAnchovy         = d.grilledAnchovy         || 0;
  etat.humanLeftovers         = d.humanLeftovers         || 0;
  etat.humanWorkersFood       = d.humanWorkersFood       || 0;
  etat.cannedCatFood          = d.cannedCatFood          || 0;
  etat.cannelleTokens         = Number.isFinite(d.cannelleTokens) ? Math.max(0, Math.floor(d.cannelleTokens)) : 0;
  etat.cannelleBargainNextAt  = Number.isFinite(d.cannelleBargainNextAt) ? Math.max(0, d.cannelleBargainNextAt) : 0;
  etat.cannelleBargainRulesSeen = d.cannelleBargainRulesSeen === true;
  etat.boostInventory         = d.boostInventory && typeof d.boostInventory === "object"
    ? Object.keys(d.boostInventory).reduce(function(inventory, boostId) {
        inventory[boostId] = Math.max(0, Math.floor(Number(d.boostInventory[boostId]) || 0));
        return inventory;
      }, Object.create(null))
    : {};
  etat.shortcutMapFinTs       = Number.isFinite(d.shortcutMapFinTs) ? Math.max(0, d.shortcutMapFinTs) : 0;
  etat.perksV2                = perksV2Api.normalizeProgress(d.perksV2);
  etat.perkLearningEnCours    = d.perkLearningEnCours    || null;
  etat.workBoostFinTs         = d.workBoostFinTs         || 0;
  etat.manualFocusOnboardingCompletedTs = Number.isFinite(d.manualFocusOnboardingCompletedTs)
    ? d.manualFocusOnboardingCompletedTs
    : 0;
  etat.campProfile = normaliserProfilCampSauvegarde(d.campProfile);
  etat.birdPremierSpawnTs     = Number.isFinite(d.birdPremierSpawnTs)
    ? d.birdPremierSpawnTs
    : maintenant + 5 * 60 * 1000;
  etat.birdPremierDeclenche   = d.birdPremierDeclenche === true;
  etat.birdPremiereReussie    = d.birdPremiereReussie === true;
  etat.birdPityEchecs         = Number.isInteger(d.birdPityEchecs) ? Math.max(0, d.birdPityEchecs) : 0;
  if (!etat.birdPremiereReussie && etat.birdPremierDeclenche
      && (!(etat.manualFocusOnboardingCompletedTs > 0)
        || maintenant < etat.manualFocusOnboardingCompletedTs + 30000)) {
    etat.birdPremierDeclenche = false;
    etat.birdPremierSpawnTs = 0;
  }

  etat.sequenceEnCours         = d.sequenceEnCours         || false;
  etat.sequenceDebutTs         = d.sequenceDebutTs         || 0;
  etat.sequenceDuree           = d.sequenceDuree           || 0;
  etat.sequenceProgressBrute   = d.sequenceProgressBrute   !== undefined ? d.sequenceProgressBrute   : 0;
  etat.sequenceDerniereMajTs   = d.sequenceDerniereMajTs   !== undefined ? d.sequenceDerniereMajTs   : 0;
  etat.sequenceVitesseDerniere = d.sequenceVitesseDerniere !== undefined ? d.sequenceVitesseDerniere : 1;
  if (d.prochainVisageChaton && normaliserVisageChaton) {
    const prochainNom = NOMS_KITTIES[etat.chatons] || ("Cat #" + (etat.chatons + 1));
    etat.prochainVisageChaton = normaliserVisageChaton({
      nom: prochainNom,
      visage: d.prochainVisageChaton
    });
  } else {
    // The save core does not know the runtime portrait catalog. Without the
    // authoritative normalizer, discarding the path is safer than preserving
    // an imported URL that could later reach an image src.
    etat.prochainVisageChaton = null;
  }
  etat.clicCount               = d.clicCount               || 0;
  etat.reductionAuMomentDuClic = d.reductionAuMomentDuClic || 0;
  etat.afficherTempsAjusteRecrutement = d.afficherTempsAjusteRecrutement || false;
  etat.avertirSurplusNourriture = d.avertirSurplusNourriture !== false;
  etat.volumeEffetsSonores = d.volumeEffetsSonores !== undefined ? Math.min(1, d.volumeEffetsSonores) : 0.3;
  etat.volumeMusique       = d.volumeMusique       !== undefined ? Math.min(1, d.volumeMusique)       : 0;
  etat.uiTheme             = normaliserUiTheme(d.uiTheme);
  etat.campCatPortraitScale = d.campCatPortraitScale !== undefined
    ? Math.max(0.7, Math.min(1.3, d.campCatPortraitScale))
    : 1;
  etat.hideCampCatIcons          = d.hideCampCatIcons === true;
  etat.resourceBarHidden = Array.isArray(d.resourceBarHidden)
    ? Array.from(new Set(d.resourceBarHidden.filter(function(id) { return RESOURCE_BAR_KEYS.includes(id); })))
    : [];

  etat.premiereSaladeFaite        = d.premiereSaladeFaite        || false;
  // Migration: compute reduction from old timestamp-based saves
  etat.reductionCumulee = d.reductionCumulee !== undefined
    ? d.reductionCumulee
    : (d.cathouses || []).reduce(function(total, ts) {
        return total + Math.floor((maintenant - ts) / 1000);
      }, 0);

  const makeWorkRecipeSlots = stateCore.makeWorkRecipeSlots;
  etat.workRecipeSlots = d.workRecipeSlots || {
    wood: makeWorkRecipeSlots(2),
    food: makeWorkRecipeSlots(2),
    rock: makeWorkRecipeSlots(2)
  };
  const ancienneProgressionWood = Number(d.chatons) >= 3;
  const campSource = estObjetSauvegarde(d.camp) ? d.camp : {};
  etat.camp = stateCore.makeCampState();
  etat.camp.schemaVersion = CAMP_SCHEMA_VERSION;
  etat.camp.prototypeMigrationVersion = Number.isInteger(campSource.prototypeMigrationVersion)
    ? Math.max(0, campSource.prototypeMigrationVersion)
    : 0;
  etat.camp.recruitmentFormulaVersion = Number.isInteger(campSource.recruitmentFormulaVersion)
    ? Math.max(0, campSource.recruitmentFormulaVersion)
    : 0;
  etat.camp.layout = normaliserLayoutStickersSauvegarde(campSource.layout);
  etat.camp.fences = Array.isArray(campSource.fences) ? campSource.fences : [];
  etat.camp.terrain = estObjetSauvegarde(campSource.terrain) ? campSource.terrain : null;
  etat.camp.demolitions = Array.isArray(campSource.demolitions) ? campSource.demolitions : [];
  etat.camp.repairedBuildingIds = Array.isArray(campSource.repairedBuildingIds)
    ? campSource.repairedBuildingIds.filter(function(id) { return campRepairBuildingIds().includes(id); })
    : (Array.isArray(d.batimentsCampRepares)
      ? d.batimentsCampRepares.filter(function(id) { return campRepairBuildingIds().includes(id); })
      : (ancienneProgressionWood ? ["sawmill"] : []));
  etat.camp.repairs = estObjetSauvegarde(campSource.repairs)
    ? campSource.repairs
      : (estObjetSauvegarde(d.reparationsCamp) ? d.reparationsCamp : {});
  etat.camp.constructions = estObjetSauvegarde(campSource.constructions)
    ? campSource.constructions
    : {};
  etat.camp.houseConstructions = estObjetSauvegarde(campSource.houseConstructions)
    ? campSource.houseConstructions
    : (estObjetSauvegarde(d.constructionsMaisonsCamp) ? d.constructionsMaisonsCamp : {});
  etat.camp.housingAssignments = estObjetSauvegarde(campSource.housingAssignments)
    ? campSource.housingAssignments
    : {};
  etat.camp.groundRewards = estObjetSauvegarde(campSource.groundRewards)
    ? campSource.groundRewards
    : {};
  etat.camp.upgrades = estObjetSauvegarde(campSource.upgrades) ? campSource.upgrades : {};
  const progressionSource = estObjetSauvegarde(campSource.progression)
    ? campSource.progression
    : {};
  etat.camp.progression = {
    introCompleted: progressionSource.introCompleted === true,
    junkClearingUnlocked: progressionSource.junkClearingUnlocked === true,
    operationsTableUnlocked: progressionSource.operationsTableUnlocked === true,
    storageShedUnlocked: progressionSource.storageShedUnlocked === true,
    // Inventory can come from exploration rewards.  Reconcile only direct
    // production evidence; older possession/objective state is not sufficient.
    woodCathouseUnlocked: progressionSource.woodCathouseUnlocked === true
      || Number(d.basicWoodPlanksTotalProduit) > 0,
    appealUnlocked: progressionSource.appealUnlocked === true,
    appealIntroSeen: progressionSource.appealIntroSeen === true
      && progressionSource.appealUnlocked === true,
    appealRecruitConfirmationPending: progressionSource.appealRecruitConfirmationPending === true
      && progressionSource.appealUnlocked !== true
      && progressionSource.appealIntroSeen !== true,
    workBoostCueDismissed: progressionSource.workBoostCueDismissed === true,
    sawmillTutorialStage: deriverEtapeTutorielSawmill(d, campSource, progressionSource),
    chefKissFeedTutorialStage: CHEF_KISS_FEED_TUTORIAL_STAGES.includes(
      progressionSource.chefKissFeedTutorialStage
    ) ? progressionSource.chefKissFeedTutorialStage : (d.premiereSaladeFaite ? "complete" : "inactive"),
    firstBoxTutorialStage: ["place", "assign", "complete"].includes(progressionSource.firstBoxTutorialStage)
      ? progressionSource.firstBoxTutorialStage : "inactive",
    firstBoxUnlockDialogueDismissed: progressionSource.firstBoxUnlockDialogueDismissed === true,
    firstBoxRecruitConfirmationPending: progressionSource.firstBoxRecruitConfirmationPending === true
      && progressionSource.firstBoxRecruitConfirmationAcknowledged !== true
      && !(Array.isArray(progressionSource.quickDialoguesSeen)
        && progressionSource.quickDialoguesSeen.includes("firstBox")),
    firstBoxRecruitConfirmationAcknowledged: progressionSource.firstBoxRecruitConfirmationAcknowledged === true
      || (Array.isArray(progressionSource.quickDialoguesSeen)
        && progressionSource.quickDialoguesSeen.includes("firstBox")),
    firstGroundRewardUid: typeof progressionSource.firstGroundRewardUid === "string"
      ? progressionSource.firstGroundRewardUid : null,
    quickDialogueQueue: Array.isArray(progressionSource.quickDialogueQueue)
      ? progressionSource.quickDialogueQueue.slice(0, 128)
      : [],
    quickDialoguesSeen: Array.isArray(progressionSource.quickDialoguesSeen)
      ? progressionSource.quickDialoguesSeen.slice(0, 128)
      : []
  };

  etat.cathouses          = d.cathouses          || [];
  etat.cathouseCount      = d.cathouseCount      || 0;
  etat.stoneCathouseCount = d.stoneCathouseCount || 0;
  etat.solidStoneCathouseCount = d.solidStoneCathouseCount || 0;
  etat.exploEnCours        = d.exploEnCours        || [];
  etat.campaignsCompletees = d.campaignsCompletees || [];
  etat.itemsAcquis         = d.itemsAcquis         || [];
  etat.itemsAppris         = d.itemsAppris         || [];
  etat.itemsEtudies        = d.itemsEtudies        || [];
  etat.learningEnCours     = d.learningEnCours     || null;
  etat.jobCenterDebloque        = d.jobCenterDebloque        || false;
  etat.jobCenterConstruit       = d.jobCenterConstruit       || false;
  etat.laboratoryDebloque       = d.laboratoryDebloque       || etat.itemsAppris.includes("engineerGuide");
  etat.laboratoryConstruit      = d.laboratoryConstruit      || false;
  etat.engineerRankUpgradesDebloques = d.engineerRankUpgradesDebloques || etat.itemsAppris.includes("teamworkGuide");
  etat.formationEnCours         = d.formationEnCours         || null;
  etat.formationIngenieurEnCours = d.formationIngenieurEnCours || null;
  etat.dailyQuests              = d.dailyQuests || etat.dailyQuests;
  if (!etat.dailyQuests || typeof etat.dailyQuests !== "object") {
    etat.dailyQuests = {
      dateKey: "", recipeFamily: "food", scoutingSuccesses: 0,
      catLevelUps: 0, birdCaught: false, recipesCompleted: 0, rewardClaimed: false
    };
  }
  // Remove the temporary unlock flag from saves created by the immediately
  // previous daily-panel experiment. Book study remains the unlock source.
  if (Object.prototype.hasOwnProperty.call(etat.dailyQuests, "unlocked")) delete etat.dailyQuests.unlocked;
  // Migrate the former stocks nested in Daily Quests. Keeping the old date
  // preserves stock already consumed today; the runtime resets stale dates.
  const legacyScoutingStocks = etat.dailyQuests.scoutingCannedCatFood;
  etat.dailyScoutingStocks = d.dailyScoutingStocks || {
    dateKey: etat.dailyQuests.dateKey || "",
    remaining: {
      raidSupermarketAgain: legacyScoutingStocks && Number.isInteger(legacyScoutingStocks.raidSupermarketAgain)
        ? legacyScoutingStocks.raidSupermarketAgain : 3,
      stealGasStationAgain: legacyScoutingStocks && Number.isInteger(legacyScoutingStocks.stealGasStationAgain)
        ? legacyScoutingStocks.stealGasStationAgain : 2
    }
  };
  if (!etat.dailyScoutingStocks || typeof etat.dailyScoutingStocks !== "object") {
    etat.dailyScoutingStocks = { dateKey: "", remaining: {} };
  }
  if (typeof etat.dailyScoutingStocks.dateKey !== "string") etat.dailyScoutingStocks.dateKey = "";
  if (!etat.dailyScoutingStocks.remaining || typeof etat.dailyScoutingStocks.remaining !== "object") {
    etat.dailyScoutingStocks.remaining = {};
  }
  if (!Number.isInteger(etat.dailyScoutingStocks.remaining.raidSupermarketAgain)) etat.dailyScoutingStocks.remaining.raidSupermarketAgain = 3;
  if (!Number.isInteger(etat.dailyScoutingStocks.remaining.stealGasStationAgain)) etat.dailyScoutingStocks.remaining.stealGasStationAgain = 2;
  if (Object.prototype.hasOwnProperty.call(etat.dailyQuests, "scoutingCannedCatFood")) {
    delete etat.dailyQuests.scoutingCannedCatFood;
  }
  etat.regionCourante      = d.regionCourante      || "startingNeighbourhood";
  etat.zonesExplorees      = d.zonesExplorees      || ["D1"];
  if (!etat.zonesExplorees.includes("D1")) etat.zonesExplorees.push("D1");
  etat.exploZoneEnCours    = d.exploZoneEnCours    || null;
  etat.resultatsExplorationZones = d.resultatsExplorationZones || {};
  etat.resultatsCampaigns  = d.resultatsCampaigns  || {};
  etat.explorationRetries = normaliserExplorationRetries(d.explorationRetries, etat);
  etat.scoutingsEnCours    = d.scoutingsEnCours    || {};
  etat.butinsScouting      = d.butinsScouting      || {};
  Object.values(etat.butinsScouting).forEach(function(butin) {
    if (!Number.isInteger(butin.tripled) || butin.tripled < 0) butin.tripled = 0;
    butin.rewards = Object.keys(butin.rewards || {}).reduce(function(rewards, rewardId) {
      if (SCOUTING_REWARD_IDS.includes(rewardId) && Number(butin.rewards[rewardId]) > 0) {
        rewards[rewardId] = butin.rewards[rewardId];
      }
      return rewards;
    }, {});
  });
  etat.managers            = { wood: null, food: null, sawmill: null, catchen: null, rock: null, pawsonry: null };
  Object.keys(etat.managers).forEach(function(familyId) {
    if (d.managers && d.managers[familyId] !== undefined) etat.managers[familyId] = d.managers[familyId];
  });
  etat.managersDebloques   = d.managersDebloques   || false;
  etat.managerRoleTutorialShown = d.managerRoleTutorialShown === true;
  etat.formationTermineeEnAttente = d.formationTermineeEnAttente || null;
  etat.formationIngenieurTermineeEnAttente = d.formationIngenieurTermineeEnAttente || null;
  // Migration: backfill manager keys added in later versions
  if (etat.managers.wood     === undefined) etat.managers.wood     = null;
  if (etat.managers.food     === undefined) etat.managers.food     = null;
  if (etat.managers.sawmill  === undefined) etat.managers.sawmill  = null;
  if (etat.managers.catchen  === undefined) etat.managers.catchen  = null;
  if (etat.managers.rock     === undefined) etat.managers.rock     = null;
  if (etat.managers.pawsonry === undefined) etat.managers.pawsonry = null;
  etat.objectifsComplis = d.objectifsComplis || [];
  etat.logs            = d.logs            || [];
  etat.releaseNotesSeenVersion = typeof d.releaseNotesSeenVersion === "string" ? d.releaseNotesSeenVersion : "";
  if (Array.isArray(d.storiesVues)) {
    etat.storiesVues = d.storiesVues.filter(function(flag) {
      return flag !== "story5Vue";
    });
  } else {
    // Legacy saves kept story flags outside the exported state. Reconstruct
    // only what this save's own progression proves, never from the browser's
    // newer localStorage flags.
    const storiesInferees = [];
    const ajouterStory = function(flag, condition) { if (condition) storiesInferees.push(flag); };
    const itemsAcquis = d.itemsAcquis || [];
    const itemsAppris = d.itemsAppris || [];
    const campaigns = d.campaignsCompletees || [];
    const chatons = d.chatons || 0;
    ajouterStory("introVue", chatons > 0);
    ajouterStory("story1Vue", chatons >= 1);
    ajouterStory("story2Vue", chatons >= 2);
    ajouterStory("story3Vue", chatons >= 3);
    ajouterStory("story4Vue", Array.isArray(d.cathouses) && d.cathouses.length >= 1);
    ajouterStory("storyBasicWoodVue", (d.cardboardPlanks || d.planks || 0) >= 10 || (d.basicWoodTotalRecolte || 0) >= 1 || (d.objectifsComplis || []).includes("tenPlanks"));
    ajouterStory("storyHouseEvacuationVue", chatons >= 15);
    ajouterStory("storyLeftHouseEvacuationVue", chatons >= 17);
    ajouterStory("story6aVue", itemsAcquis.includes("schoolGuide") || campaigns.includes("checkTheTrash"));
    ajouterStory("story6bVue", itemsAppris.includes("schoolGuide") || !!d.jobCenterDebloque || !!d.jobCenterConstruit);
    ajouterStory("storySaladVue", !!d.premiereSaladeFaite);
    ajouterStory("storySeminarVue", itemsAppris.includes("seminarGuide"));
    etat.storiesVues = storiesInferees;
  }
  if (Array.isArray(d.ongletsVisites)) {
    etat.ongletsVisites = Array.from(new Set(d.ongletsVisites.filter(function(id) {
      return ONGLETS_VALIDES.includes(id);
    }).map(function(id) {
      return id === "buildings" ? "camp" : id;
    })));
  } else {
    // Saves created before tab visits were tracked should not show old unlocks as new.
    etat.ongletsVisites = ["gang", "logs"];
    if (etat.chatons >= 3) etat.ongletsVisites.push("work");
    if (etat.chatons >= 3) etat.ongletsVisites.push("camp");
    if (etat.jobCenterConstruit) etat.ongletsVisites.push("facilities");
    if (etat.chatons >= 8) etat.ongletsVisites.push("explorations");
    if (etat.cardboardPiecesTotalRecolte >= 1) etat.ongletsVisites.push("inventaire");
  }
  ["gang", "logs"].forEach(function(id) {
    if (!etat.ongletsVisites.includes(id)) etat.ongletsVisites.push(id);
  });
  etat.kittiesData     = d.kittiesData     || [];

  // Imported job identifiers are data, not display copy. Keep known current
  // and legacy IDs, and turn every unknown value into the existing Stray Cat
  // fallback instead of rejecting the complete save.
  etat.kittiesData.forEach(function(k) { k.metier = normaliserJobId(k.metier); });
  if (etat.perkLearningEnCours) {
    const learning = etat.perkLearningEnCours;
    const kitty = Number.isInteger(learning.kittyIndex) ? etat.kittiesData[learning.kittyIndex] : null;
    const node = CatInc.data && CatInc.data.perksV2 && Array.isArray(CatInc.data.perksV2.nodes)
      ? CatInc.data.perksV2.nodes.find(function(candidate) { return candidate.id === learning.perkId; })
      : null;
    if (!kitty || !node || kitty.metier !== learning.jobId || node.jobId !== learning.jobId
        || (perksV2Api.isEffective && perksV2Api.isEffective(etat.perksV2, learning.perkId))) {
      etat.perkLearningEnCours = null;
    }
  }
  if (etat.formationEnCours) {
    etat.formationEnCours.metier = normaliserJobId(etat.formationEnCours.metier);
    if (!etat.formationEnCours.metier || etat.formationEnCours.metier === "shop-owner") etat.formationEnCours = null;
  }
  if (etat.formationTermineeEnAttente) {
    etat.formationTermineeEnAttente.metier = normaliserJobId(etat.formationTermineeEnAttente.metier);
    if (!etat.formationTermineeEnAttente.metier || etat.formationTermineeEnAttente.metier === "shop-owner") etat.formationTermineeEnAttente = null;
  }
  if (etat.formationIngenieurEnCours && etat.formationIngenieurEnCours.metier !== "camp-engineer") {
    etat.formationIngenieurEnCours = null;
  }
  if (etat.formationIngenieurTermineeEnAttente
      && etat.formationIngenieurTermineeEnAttente.metier !== "camp-engineer") {
    etat.formationIngenieurTermineeEnAttente = null;
  }

  // Migration: backfill kittiesData if save predates the feature
  while (etat.kittiesData.length < etat.chatons) {
    const nom = NOMS_KITTIES[etat.kittiesData.length] || ("Cat #" + (etat.kittiesData.length + 1));
    etat.kittiesData.push({ nom: nom, metier: null, niveau: 0, xp: 0, tier: 0, managerMult: 1.5, catchTs: null, visage: assignerVisageChaton(nom), jobNiveau: 0 });
  }
  let cannelleRoleBound = false;
  etat.kittiesData.forEach(function(k) {
    if (k.nom === "Cannelle" && !cannelleRoleBound) {
      k.metier = "shop-owner";
      cannelleRoleBound = true;
    } else if (k.metier === "shop-owner") {
      k.metier = null;
    }
  });
  // Permanent specialists cannot occupy a training station in any lifecycle
  // state. Resolve reservations after specialist roles have been rebound.
  ["perkLearningEnCours", "formationEnCours", "formationTermineeEnAttente",
    "formationIngenieurEnCours", "formationIngenieurTermineeEnAttente"].forEach(function(field) {
    const reservation = etat[field];
    const kitty = reservation && Number.isInteger(reservation.kittyIndex)
      ? etat.kittiesData[reservation.kittyIndex]
      : null;
    if (kitty && kitty.metier === "shop-owner") etat[field] = null;
  });
  // Older current-version saves assigned the profession when the timer ended,
  // even though the ready record still awaited explicit validation. The ready
  // record is authoritative: keep the Cat reserved, but remove that premature
  // capability until the player validates it through the existing action.
  const prematureReadyKittyIndices = new Set();
  ["formationTermineeEnAttente", "formationIngenieurTermineeEnAttente"].forEach(function(field) {
    const reservation = etat[field];
    const kitty = reservation && Number.isInteger(reservation.kittyIndex)
      ? etat.kittiesData[reservation.kittyIndex]
      : null;
    if (!kitty) return;
    prematureReadyKittyIndices.add(reservation.kittyIndex);
    if (kitty.metier !== reservation.metier) return;
    kitty.metier = null;
    if (field === "formationIngenieurTermineeEnAttente") delete kitty.engineerRank;
  });
  if (prematureReadyKittyIndices.size > 0) {
    Object.keys(etat.managers).forEach(function(family) {
      if (prematureReadyKittyIndices.has(etat.managers[family])) etat.managers[family] = null;
    });
    const regularJobs = new Set(JOB_IDS.filter(function(jobId) {
      return !["gang-leader", "camp-engineer", "shop-owner"].includes(jobId);
    }));
    const managerJobs = new Set([
      "lumberjack", "carpenter", "farmer", "chef", "builder", "miner", "stonemason"
    ]);
    const hasValidatedRegularJob = etat.kittiesData.some(function(kitty) {
      return kitty && regularJobs.has(kitty.metier);
    });
    const hasValidatedManagerJob = etat.kittiesData.some(function(kitty) {
      return kitty && managerJobs.has(kitty.metier);
    });
    if (!hasValidatedRegularJob) etat.managersDebloques = false;
    if (!hasValidatedManagerJob) etat.managerRoleTutorialShown = false;
    const hasValidatedExplorator = etat.kittiesData.some(function(kitty) {
      return kitty && kitty.metier === "explorator";
    });
    if (!hasValidatedExplorator) {
      etat.storiesVues = etat.storiesVues.filter(function(flag) {
        return flag !== "storyExploratorVue";
      });
    }
  }
  // Migration: cats from the pre-XP format used level 1 as their initial
  // value. Only that legacy shape may be converted; current level-1 cats
  // already have an xp field and must survive every reload unchanged.
  etat.kittiesData.forEach(function(k) {
    const legacySansXp = k.xp === undefined;
    if (legacySansXp) {
      k.xp = 0;
      if (k.niveau === undefined || k.niveau === 1) k.niveau = 0;
    } else if (k.niveau === undefined) {
      k.niveau = 0;
    }
    // Balance update: the former default manager speed was ×2. Existing
    // current-era saves are converted once so managers use ×1.5 too.
    if (k.managerMult === undefined || k.managerMult === 2) k.managerMult = 1.5;
    if (normaliserVisageChaton) k.visage = normaliserVisageChaton(k);
    else k.visage = assignerVisageChaton(k.nom);
    if (k.jobNiveau === undefined) k.jobNiveau = 0;
    if (k.metier === "camp-engineer" && k.engineerRank === undefined) k.engineerRank = 1;
  });

    return etat;
  }

  CatInc.save = Object.freeze({
    STORAGE_NAMESPACE: STORAGE_NAMESPACE,
    isRealDevEnvironment: isRealDevEnvironment,
    SAVE_KEY: SAVE_KEY,
    SAVE_RECOVERY_KEY: SAVE_RECOVERY_KEY,
    SAVE_VERSION: SAVE_VERSION,
    estObjetSauvegarde: estObjetSauvegarde,
    validerStructureSauvegarde: validerStructureSauvegarde,
    analyserSauvegardeBrute: analyserSauvegardeBrute,
    creerDonneesSauvegarde: creerDonneesSauvegarde,
    serialiserEtat: serialiserEtat,
    normaliserStickerSelectionSauvegarde: normaliserStickerSelectionSauvegarde,
    normaliserLayoutStickersSauvegarde: normaliserLayoutStickersSauvegarde,
    normaliserProfilCampSauvegarde: normaliserProfilCampSauvegarde,
    normaliserUiTheme: normaliserUiTheme,
    migrerDonneesSauvegarde: migrerDonneesSauvegarde,
    deriverEtapeTutorielSawmill: deriverEtapeTutorielSawmill
  });
})(typeof window !== "undefined" ? window : globalThis);
