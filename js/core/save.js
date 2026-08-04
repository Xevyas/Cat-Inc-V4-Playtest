(function(root) {
  "use strict";

  const CatInc = root.CatInc = root.CatInc || {};
  const stateCore = CatInc.state;
  if (!stateCore) throw new Error("CatInc.state must be loaded before CatInc.save.");

  // V4 environments must never read or overwrite V3 browser data. The
  // Playtest deployment will use its own namespace when publication begins.
  const STORAGE_NAMESPACE = "catInc.v4.dev";
  const SAVE_KEY = STORAGE_NAMESPACE + ".save";
  const SAVE_RECOVERY_KEY = STORAGE_NAMESPACE + ".saveRecovery";
  // Version 2 introduces recipe slots and deliberately starts a new save era.
  // Version 0/1 saves belong to the former independent Gathering/Processing model.
  const SAVE_VERSION = 2;
  const ONGLETS_VALIDES = ["gang", "camp", "work", "buildings", "facilities", "explorations", "inventaire", "logs"];
  const WORK_FAMILIES = ["wood", "food", "rock"];
  const WORK_RECIPE_PHASES = ["idle", "gathering", "processing", "waiting"];
  const CAMP_BUILDING_IDS = ["sawmill", "catchen", "pawsonry"];
  const CAMP_SCHEMA_VERSION = 1;
  const RESOURCE_BAR_KEYS = [
    "cardboardPlanks", "basicWoodPlanks", "pebbleBricks", "rockBricks",
    "salads", "grilledAnchovy", "humanLeftovers", "humanWorkersFood", "cannedCatFood"
  ];

function estObjetSauvegarde(valeur) {
  return valeur !== null && typeof valeur === "object" && !Array.isArray(valeur);
}

function donneesSauvegardeReconnaissables(d) {
  if (!estObjetSauvegarde(d)) return false;
  const champsConnus = ["chatons", "wood", "cardboard", "cardboardPieces", "kittiesData", "workRecipeSlots"];
  return champsConnus.some(function(cle) { return d[cle] !== undefined; });
}

function validerStructureSauvegarde(d) {
  if (!estObjetSauvegarde(d)) return "The save root must be an object.";

  if (!donneesSauvegardeReconnaissables(d)) {
    return "This file does not contain recognizable Cat Inc save data.";
  }

  if (!Number.isInteger(d.saveVersion) || d.saveVersion < 0) return "Invalid save version.";
  if (d.saveVersion > SAVE_VERSION) return "This save was created by a newer version of Cat Inc.";
  if (d.saveVersion < SAVE_VERSION) return "This save uses the previous Work system and requires a new game.";

  const champsTableaux = [
    "cathouses", "kittiesData", "exploEnCours", "campaignsCompletees", "itemsAcquis", "itemsAppris", "itemsEtudies",
    "zonesExplorees", "objectifsComplis", "logs", "storiesVues", "ongletsVisites", "resourceBarHidden",
    "batimentsCampRepares"
  ];
  for (const cle of champsTableaux) {
    if (d[cle] !== undefined && !Array.isArray(d[cle])) return "Invalid field: " + cle + " must be an array.";
  }

  const champsObjets = ["workRecipeSlots", "spherePerks", "scoutingsEnCours", "resultatsExplorationZones", "resultatsCampaigns", "butinsScouting", "managers", "dailyQuests", "dailyScoutingStocks", "reparationsCamp", "constructionsMaisonsCamp", "camp"];
  for (const cle of champsObjets) {
    if (d[cle] !== undefined && !estObjetSauvegarde(d[cle])) return "Invalid field: " + cle + " must be an object.";
  }

  const champsObjetsOuNuls = ["learningEnCours", "formationEnCours", "formationIngenieurEnCours", "formationTermineeEnAttente", "formationIngenieurTermineeEnAttente", "exploZoneEnCours"];
  for (const cle of champsObjetsOuNuls) {
    if (d[cle] !== undefined && d[cle] !== null && !estObjetSauvegarde(d[cle])) {
      return "Invalid field: " + cle + " must be an object or null.";
    }
  }

  const champsNumeriques = [
    "dernierTimestamp", "chatons", "wood", "woodTotalRecolte", "cardboard", "cardboardTotalRecolte",
    "cardboardPieces", "cardboardPiecesTotalRecolte", "basicWood", "basicWoodTotalRecolte", "catnip",
    "catnipTotalRecolte", "pebbles", "pebblesTotalRecolte", "rocks", "rocksTotalRecolte", "planks",
    "cardboardPlanks", "cardboardPlanksTotalProduit", "basicWoodPlanks", "bricks", "pebbleBricks", "rockBricks", "salads", "anchovy",
    "anchovyTotalRecolte", "grilledAnchovy", "humanLeftovers", "humanWorkersFood", "cannedCatFood",
    "workBoostFinTs", "birdPremierSpawnTs", "birdPityEchecs", "sequenceDebutTs", "sequenceDuree", "sequenceProgressBrute", "sequenceDerniereMajTs", "sequenceVitesseDerniere", "clicCount", "reductionAuMomentDuClic",
    "reductionCumulee", "cathouseCount", "stoneCathouseCount", "solidStoneCathouseCount", "volumeEffetsSonores", "volumeMusique"
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
      && (typeof d.prochainVisageChaton !== "string" || d.prochainVisageChaton.length > 300 || /[<>]/.test(d.prochainVisageChaton))) {
    return "Invalid next cat portrait.";
  }
  if (d.releaseNotesSeenVersion !== undefined
      && (typeof d.releaseNotesSeenVersion !== "string" || d.releaseNotesSeenVersion.length > 30 || /[<>]/.test(d.releaseNotesSeenVersion))) {
    return "Invalid release notes version.";
  }
  for (const cle of ["volumeEffetsSonores", "volumeMusique"]) {
    if (d[cle] !== undefined && d[cle] > 1) return "Invalid audio volume: " + cle + ".";
  }

  const champsBooleens = [
    "sequenceEnCours", "afficherTempsAjusteRecrutement", "avertirSurplusNourriture", "autoBuildWoodHouses", "scieriBloquee", "basicSawmillBloquee",
    "brickBloquee", "rockFactoryBloquee", "catchenBloquee", "catchenAnchovyBloquee", "premiereSaladeFaite",
    "jobCenterDebloque", "jobCenterConstruit", "trainingCenterDebloque", "trainingCenterConstruit", "laboratoryDebloque", "laboratoryConstruit", "engineerRankUpgradesDebloques", "birdPremiereReussie",
    "managersDebloques", "tutorialCompletionPopupSeen", "managerRoleTutorialShown"
  ];
  for (const cle of champsBooleens) {
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
        || !estObjetSauvegarde(camp.upgrades)) {
      return "Invalid Camp job data.";
    }
    if (camp.terrain !== null && !estObjetSauvegarde(camp.terrain)) return "Invalid Camp terrain.";
    const layoutValide = camp.layout.every(function(item) {
      return estObjetSauvegarde(item)
        && typeof item.uid === "string" && item.uid.length > 0 && item.uid.length <= 120
        && typeof item.type === "string" && item.type.length > 0 && item.type.length <= 80
        && Number.isInteger(item.x) && Number.isInteger(item.y)
        && (item.tier === undefined || (Number.isInteger(item.tier) && item.tier > 0 && item.tier <= 100))
        && (item.rotation === undefined || [0, 90, 180, 270].includes(item.rotation));
    });
    if (!layoutValide) return "Invalid Camp layout item.";
    const cloturesValides = (camp.fences || []).every(function(edge) {
      return estObjetSauvegarde(edge)
        && typeof edge.type === "string" && edge.type.length > 0 && edge.type.length <= 80
        && Number.isInteger(edge.x) && Number.isInteger(edge.y)
        && ["horizontal", "vertical"].includes(edge.orientation);
    });
    if (!cloturesValides) return "Invalid Camp fence edge.";
    if (!camp.repairedBuildingIds.every(function(id) { return CAMP_BUILDING_IDS.includes(id); })) {
      return "Invalid repaired Camp building data.";
    }
    const reparationsCampValides = Object.keys(camp.repairs).length <= CAMP_BUILDING_IDS.length
      && Object.keys(camp.repairs).every(function(buildingId) {
        const reparation = camp.repairs[buildingId];
        return CAMP_BUILDING_IDS.includes(buildingId)
          && estObjetSauvegarde(reparation)
          && indexKittyValide(reparation.kittyIndex, false)
          && typeof reparation.startTs === "number" && Number.isFinite(reparation.startTs) && reparation.startTs >= 0
          && typeof reparation.duree === "number" && Number.isFinite(reparation.duree) && reparation.duree > 0;
      });
    if (!reparationsCampValides) return "Invalid Camp repair data.";
    const constructionsCampValides = Object.keys(camp.houseConstructions).length <= 128
      && Object.keys(camp.houseConstructions).every(function(uid) {
        const construction = camp.houseConstructions[uid];
        return typeof uid === "string" && uid.length > 0 && uid.length <= 160 && !/[<>]/.test(uid)
          && estObjetSauvegarde(construction)
          && construction.type === "cardboardBox"
          && indexKittyValide(construction.kittyIndex, false)
          && typeof construction.startTs === "number" && Number.isFinite(construction.startTs) && construction.startTs >= 0
          && typeof construction.duree === "number" && Number.isFinite(construction.duree) && construction.duree > 0
          && typeof construction.coutCardboardPlanks === "number"
          && Number.isFinite(construction.coutCardboardPlanks) && construction.coutCardboardPlanks >= 0;
      });
    if (!constructionsCampValides) return "Invalid Camp house construction data.";
    const buildingConstructionIds = ["operationsTable", "jobCenter", "trainingCenter", "laboratory", "storage"];
    const constructionsBatimentsValides = Object.keys(camp.constructions).length <= 128
      && Object.keys(camp.constructions).every(function(uid) {
        const construction = camp.constructions[uid];
        return typeof uid === "string" && uid.length > 0 && uid.length <= 160 && !/[<>]/.test(uid)
          && estObjetSauvegarde(construction)
          && buildingConstructionIds.includes(construction.type)
          && indexKittyValide(construction.kittyIndex, false)
          && typeof construction.startTs === "number" && Number.isFinite(construction.startTs) && construction.startTs >= 0
          && typeof construction.duration === "number" && Number.isFinite(construction.duration) && construction.duration > 0
          && estObjetSauvegarde(construction.costs)
          && Object.keys(construction.costs).length <= 8
          && Object.keys(construction.costs).every(function(resourceId) {
            return typeof resourceId === "string" && /^[A-Za-z][A-Za-z0-9]*$/.test(resourceId)
              && typeof construction.costs[resourceId] === "number"
              && Number.isFinite(construction.costs[resourceId]) && construction.costs[resourceId] >= 0;
          });
      });
    if (!constructionsBatimentsValides) return "Invalid Camp building construction data.";
    const upgradeResources = ["cardboardPlanks", "basicWoodPlanks", "pebbleBricks", "rockBricks"];
    const ameliorationsCampValides = Object.keys(camp.upgrades).length <= 128
      && Object.keys(camp.upgrades).every(function(uid) {
        const upgrade = camp.upgrades[uid];
        return typeof uid === "string" && uid.length > 0 && uid.length <= 160 && !/[<>]/.test(uid)
          && estObjetSauvegarde(upgrade)
          && CAMP_BUILDING_IDS.includes(upgrade.type)
          && indexKittyValide(upgrade.kittyIndex, false)
          && Number.isInteger(upgrade.startTier) && upgrade.startTier > 0 && upgrade.startTier <= 100
          && Number.isInteger(upgrade.targetTier) && upgrade.targetTier === upgrade.startTier + 1 && upgrade.targetTier <= 100
          && typeof upgrade.startTs === "number" && Number.isFinite(upgrade.startTs) && upgrade.startTs >= 0
          && typeof upgrade.duration === "number" && Number.isFinite(upgrade.duration) && upgrade.duration > 0
          && estObjetSauvegarde(upgrade.costs)
          && Object.keys(upgrade.costs).length <= upgradeResources.length
          && Object.keys(upgrade.costs).every(function(resourceId) {
            return upgradeResources.includes(resourceId)
              && typeof upgrade.costs[resourceId] === "number"
              && Number.isFinite(upgrade.costs[resourceId])
              && upgrade.costs[resourceId] >= 0;
          });
      });
    if (!ameliorationsCampValides) return "Invalid Camp upgrade data.";
  }
  if (d.batimentsCampRepares && !d.batimentsCampRepares.every(function(id) {
    return CAMP_BUILDING_IDS.includes(id);
  })) {
    return "Invalid repaired Camp building data.";
  }
  if (d.reparationsCamp) {
    const reparationsValides = Object.keys(d.reparationsCamp).every(function(buildingId) {
      const reparation = d.reparationsCamp[buildingId];
      return CAMP_BUILDING_IDS.includes(buildingId)
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

  const nombreKitties = Math.max(
    Number.isInteger(d.chatons) ? d.chatons : 0,
    Array.isArray(d.kittiesData) ? d.kittiesData.length : 0
  );
  function indexKittyValide(kittyIndex, nullable) {
    if (nullable && kittyIndex === null) return true;
    return Number.isInteger(kittyIndex) && kittyIndex >= 0 && kittyIndex < nombreKitties;
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
      erreur: "This save uses the previous Work system and requires a new game."
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
    pebbleBricks:           etat.pebbleBricks,
    rockBricks:             etat.rockBricks,
    salads:                 etat.salads,
    anchovy:                etat.anchovy,             anchovyTotalRecolte:  etat.anchovyTotalRecolte,
    grilledAnchovy:         etat.grilledAnchovy,
    humanLeftovers:         etat.humanLeftovers,
    humanWorkersFood:       etat.humanWorkersFood,
    cannedCatFood:          etat.cannedCatFood,
    spherePerks:            etat.spherePerks,
    workBoostFinTs:         etat.workBoostFinTs,
    birdPremierSpawnTs:      etat.birdPremierSpawnTs,
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
    autoBuildWoodHouses:       etat.autoBuildWoodHouses,
    resourceBarHidden:       etat.resourceBarHidden,
    scieriBloquee:              etat.scieriBloquee,
    basicSawmillBloquee:        etat.basicSawmillBloquee,
    brickBloquee:               etat.brickBloquee,
    rockFactoryBloquee:         etat.rockFactoryBloquee,
    catchenBloquee:             etat.catchenBloquee,
    catchenAnchovyBloquee:      etat.catchenAnchovyBloquee,
    premiereSaladeFaite:        etat.premiereSaladeFaite,
    reductionCumulee: etat.reductionCumulee,
    workRecipeSlots: etat.workRecipeSlots,
    camp: etat.camp,
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
    trainingCenterDebloque:   etat.trainingCenterDebloque,
    trainingCenterConstruit:  etat.trainingCenterConstruit,
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
    scoutingsEnCours:    etat.scoutingsEnCours,
    butinsScouting:      etat.butinsScouting,
    managers:            etat.managers,
    managersDebloques:   etat.managersDebloques,
    managerRoleTutorialShown: etat.managerRoleTutorialShown,
    objectifsComplis: etat.objectifsComplis,
    tutorialCompletionPopupSeen: etat.tutorialCompletionPopupSeen,
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
  etat.pebbleBricks           = d.pebbleBricks           !== undefined ? d.pebbleBricks           : (d.bricks || 0);
  etat.rockBricks             = d.rockBricks             || 0;
  etat.salads                 = d.salads                 || 0;
  etat.anchovy                = d.anchovy                || 0;
  etat.anchovyTotalRecolte    = d.anchovyTotalRecolte    || 0;
  etat.grilledAnchovy         = d.grilledAnchovy         || 0;
  etat.humanLeftovers         = d.humanLeftovers         || 0;
  etat.humanWorkersFood       = d.humanWorkersFood       || 0;
  etat.cannedCatFood          = d.cannedCatFood          || 0;
  etat.spherePerks            = d.spherePerks            || {};
  etat.workBoostFinTs         = d.workBoostFinTs         || 0;
  etat.birdPremierSpawnTs     = Number.isFinite(d.birdPremierSpawnTs)
    ? d.birdPremierSpawnTs
    : maintenant + 5 * 60 * 1000;
  etat.birdPremiereReussie    = d.birdPremiereReussie === true;
  etat.birdPityEchecs         = Number.isInteger(d.birdPityEchecs) ? Math.max(0, d.birdPityEchecs) : 0;

  etat.sequenceEnCours         = d.sequenceEnCours         || false;
  etat.sequenceDebutTs         = d.sequenceDebutTs         || 0;
  etat.sequenceDuree           = d.sequenceDuree           || 0;
  etat.sequenceProgressBrute   = d.sequenceProgressBrute   !== undefined ? d.sequenceProgressBrute   : 0;
  etat.sequenceDerniereMajTs   = d.sequenceDerniereMajTs   !== undefined ? d.sequenceDerniereMajTs   : 0;
  etat.sequenceVitesseDerniere = d.sequenceVitesseDerniere !== undefined ? d.sequenceVitesseDerniere : 1;
  etat.prochainVisageChaton    = d.prochainVisageChaton    || null;
  etat.clicCount               = d.clicCount               || 0;
  etat.reductionAuMomentDuClic = d.reductionAuMomentDuClic || 0;
  etat.afficherTempsAjusteRecrutement = d.afficherTempsAjusteRecrutement || false;
  etat.avertirSurplusNourriture = d.avertirSurplusNourriture !== false;
  etat.volumeEffetsSonores = d.volumeEffetsSonores !== undefined ? Math.min(1, d.volumeEffetsSonores) : 0.3;
  etat.volumeMusique       = d.volumeMusique       !== undefined ? Math.min(1, d.volumeMusique)       : 0;
  etat.autoBuildWoodHouses       = d.autoBuildWoodHouses || false;
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
  etat.camp.layout = Array.isArray(campSource.layout) ? campSource.layout : [];
  etat.camp.fences = Array.isArray(campSource.fences) ? campSource.fences : [];
  etat.camp.terrain = estObjetSauvegarde(campSource.terrain) ? campSource.terrain : null;
  etat.camp.demolitions = Array.isArray(campSource.demolitions) ? campSource.demolitions : [];
  etat.camp.repairedBuildingIds = Array.isArray(campSource.repairedBuildingIds)
    ? campSource.repairedBuildingIds.filter(function(id) { return CAMP_BUILDING_IDS.includes(id); })
    : (Array.isArray(d.batimentsCampRepares)
      ? d.batimentsCampRepares.filter(function(id) { return CAMP_BUILDING_IDS.includes(id); })
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
  etat.camp.upgrades = estObjetSauvegarde(campSource.upgrades) ? campSource.upgrades : {};

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
  etat.trainingCenterDebloque   = d.trainingCenterDebloque   || false;
  etat.trainingCenterConstruit  = d.trainingCenterConstruit  || false;
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
  etat.scoutingsEnCours    = d.scoutingsEnCours    || {};
  etat.butinsScouting      = d.butinsScouting      || {};
  Object.values(etat.butinsScouting).forEach(function(butin) {
    if (!Number.isInteger(butin.tripled) || butin.tripled < 0) butin.tripled = 0;
  });
  etat.managers            = d.managers            || { wood: null, food: null, sawmill: null, catchen: null, rock: null, pawsonry: null };
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
  if (etat.managers.houses   === undefined) etat.managers.houses   = null;
  etat.objectifsComplis = d.objectifsComplis || [];
  etat.tutorialCompletionPopupSeen = d.tutorialCompletionPopupSeen === true;
  etat.logs            = d.logs            || [];
  etat.releaseNotesSeenVersion = typeof d.releaseNotesSeenVersion === "string" ? d.releaseNotesSeenVersion : "";
  if (Array.isArray(d.storiesVues)) {
    etat.storiesVues = d.storiesVues;
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
    ajouterStory("story5Vue", chatons >= 8);
    ajouterStory("storyHouseEvacuationVue", chatons >= 15);
    ajouterStory("storyLeftHouseEvacuationVue", chatons >= 17);
    ajouterStory("story6aVue", itemsAcquis.includes("schoolGuide") || campaigns.includes("checkTheTrash"));
    ajouterStory("story6bVue", itemsAppris.includes("schoolGuide") || !!d.jobCenterDebloque || !!d.jobCenterConstruit);
    ajouterStory("storySaladVue", !!d.premiereSaladeFaite);
    ajouterStory("storySeminarVue", itemsAppris.includes("seminarGuide") || !!d.trainingCenterDebloque || !!d.trainingCenterConstruit);
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
    if (etat.jobCenterDebloque) etat.ongletsVisites.push("facilities");
    if (etat.chatons >= 8) etat.ongletsVisites.push("explorations");
    if (etat.cardboardPiecesTotalRecolte >= 1) etat.ongletsVisites.push("inventaire");
  }
  ["gang", "logs"].forEach(function(id) {
    if (!etat.ongletsVisites.includes(id)) etat.ongletsVisites.push(id);
  });
  etat.kittiesData     = d.kittiesData     || [];

  // Migration: rename legacy French job IDs to English
  const jobIdMigration = { bucheron: "lumberjack", charpentier: "carpenter", fermier: "farmer", cuisinier: "chef" };
  etat.kittiesData.forEach(function(k) { if (k.metier && jobIdMigration[k.metier]) k.metier = jobIdMigration[k.metier]; });
  if (etat.formationEnCours && jobIdMigration[etat.formationEnCours.metier]) {
    etat.formationEnCours.metier = jobIdMigration[etat.formationEnCours.metier];
  }

  // Migration: backfill kittiesData if save predates the feature
  while (etat.kittiesData.length < etat.chatons) {
    const nom = NOMS_KITTIES[etat.kittiesData.length] || ("Cat #" + (etat.kittiesData.length + 1));
    etat.kittiesData.push({ nom: nom, metier: null, niveau: 0, xp: 0, tier: 0, managerMult: 1.5, catchTs: null, visage: assignerVisageChaton(nom), jobNiveau: 0 });
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
    if (!k.visage) k.visage = assignerVisageChaton(k.nom);
    if (k.jobNiveau === undefined) k.jobNiveau = 0;
    if (k.metier === "camp-engineer" && k.engineerRank === undefined) k.engineerRank = 1;
  });

    return etat;
  }

  CatInc.save = Object.freeze({
    STORAGE_NAMESPACE: STORAGE_NAMESPACE,
    SAVE_KEY: SAVE_KEY,
    SAVE_RECOVERY_KEY: SAVE_RECOVERY_KEY,
    SAVE_VERSION: SAVE_VERSION,
    estObjetSauvegarde: estObjetSauvegarde,
    validerStructureSauvegarde: validerStructureSauvegarde,
    analyserSauvegardeBrute: analyserSauvegardeBrute,
    creerDonneesSauvegarde: creerDonneesSauvegarde,
    serialiserEtat: serialiserEtat,
    migrerDonneesSauvegarde: migrerDonneesSauvegarde
  });
})(typeof window !== "undefined" ? window : globalThis);
