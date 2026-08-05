// ════════════════════════════════════════════════════════════
// 1. CONSTANTS & CONFIG
// ════════════════════════════════════════════════════════════

// Static balance data lives in js/data/config.js.
const gameConfigData = globalThis.CatInc.data.config;
const CONFIG = gameConfigData.CONFIG;

// Static game content lives in js/data/content.js.
const gameContentData = globalThis.CatInc.data.content;
const LIVRE_ICONE = gameContentData.LIVRE_ICONE;
const RESOURCE_INFO = gameContentData.RESOURCE_INFO;
const ITEMS = gameContentData.ITEMS;
const METIERS = gameContentData.METIERS;
const SPHERE_GRIDS = gameContentData.SPHERE_GRIDS;
const ZONES_CARTE = gameContentData.ZONES_CARTE;
const REGIONS = gameContentData.REGIONS;

function zonesRegion() {
  return REGIONS[etat.regionCourante].zones;
}

const TIERS_KITTIES = gameContentData.TIERS_KITTIES;
const NOMS_KITTIES = gameContentData.NOMS_KITTIES;
const VITESSES = gameConfigData.VITESSES;
const KITTY_ICON = gameContentData.KITTY_ICON;
const CHECK_ICON = gameContentData.CHECK_ICON;
const CAT_FACES = gameContentData.CAT_FACES;
const CAT_FACES_ALEATOIRES = gameContentData.CAT_FACES_ALEATOIRES;

const changelogData = globalThis.CatInc.data.changelog;
const GAME_RELEASE_VERSION = changelogData.currentVersion;
const GAME_RELEASE_NOTES = changelogData.releases[0].categories;
const GAME_CHANGELOG = changelogData.releases;
const campPrototypeApi = globalThis.CatInc.camp;
const campCapabilitiesApi = globalThis.CatInc.campCapabilities;

// Prevent mobile browsers from opening the native context menu when a player
// holds a game icon or other interactive sprite. Text and controls remain
// usable through the game's normal click/touch handlers.
if (typeof document !== "undefined") {
  document.addEventListener("contextmenu", function(event) {
    if (event.target.closest && event.target.closest("img, button, svg, [role='button']")) {
      event.preventDefault();
    }
  }, { passive: false });
}

// Keep navigation and log copy text-only. Resource and item cards retain their
// visual sprites; this only strips decorative emoji from interface labels and
// any legacy log entries loaded from an older save.
function retirerEmojisInterface(texte) {
  return String(texte == null ? "" : texte)
    .replace(/[\u{1F000}-\u{1FAFF}\u{2600}-\u{27BF}\uFE0F\u200D]/gu, "")
    .replace(/\s{2,}/g, " ")
    .trim();
}

// Development helpers are available only through an explicit URL flag.
// Normal games always run at 1× and never expose the forced bird trigger.
const devQuery = typeof location !== "undefined" ? location.search : "";
const DEV_MODE = /(?:^|[?&])debug=1(?:&|$)/.test(devQuery);
if (typeof document !== "undefined" && document.body) {
  document.body.dataset.devMode = DEV_MODE ? "true" : "false";
}

function assignerVisageChaton(nom) {
  if (nom === "Bernardo") return CAT_FACES.bernardo;
  if (nom === "Mochi")    return CAT_FACES.mochi;
  if (nom === "Luna")     return CAT_FACES.luna;
  return CAT_FACES_ALEATOIRES[Math.floor(Math.random() * CAT_FACES_ALEATOIRES.length)];
}

function kittyIconHtml(kitty) {
  if (!kitty || !kitty.visage) return KITTY_ICON;
  return '<img src="' + kitty.visage + '" class="kitty-icon" alt="' + kitty.nom + '">';
}

function recetteChoisieCount(recipeId) {
  return Object.values(etat.workRecipeSlots || {}).reduce(function(total, slots) {
    return total + slots.filter(function(slot) { return slot.recipeId === recipeId; }).length;
  }, 0);
}

const OBJECTIFS = [
  // ── Kitties
  {
    id: "firstKitty", label: "Catch your first cat",
    visible:  function(e) { return true; },
    accompli: function(e) { return e.chatons >= 1; }
  },
  {
    id: "secondKitty", label: "Catch a second cat",
    visible:  function(e) { return e.chatons >= 1; },
    accompli: function(e) { return e.chatons >= 2; }
  },
  {
    id: "thirdKitty", label: "Catch your third cat",
    visible:  function(e) { return e.chatons >= 2; },
    accompli: function(e) { return e.chatons >= 3; }
  },
  {
    id: "repairSawmill", label: "Repair and connect the Sawmill in Camp",
    visible: function(e) { return e.chatons >= 3 && campDebloque(); },
    accompli: function() {
      return batimentCampRepare("sawmill")
        && capaciteBatimentCamp("sawmill", 1, { contentUnlocked: true }).available;
    }
  },
  // ── Cardboard & Buildings
  {
    id: "firstWoodcatter", label: "Choose the Cardboard Planks recipe",
    visible:  function() { return catheringDebloquee(); },
    accompli: function() { return recetteChoisieCount("cardboardPlanks") >= 1; }
  },
  {
    id: "firstCathouse", label: "Build your first Cardboard Box",
    visible:  function() { return maisonCampDebloquee("cardboardBox"); },
    accompli: function(e) { return e.cathouses.length >= 1; }
  },

  // ── Cardboard Planks recipe
  {
    id: "firstSawmillWorker", label: "Assign a cat to the Cardboard Planks recipe",
    visible:  function() { return recetteChoisieCount("cardboardPlanks") >= 1; },
    accompli: function() { return allocationCount("cardboardPlanks") >= 1; }
  },
  {
    id: "firstPlank", label: "Produce your first Cardboard Plank",
    visible:  function() { return allocationCount("cardboardPlanks") >= 1; },
    accompli: function(e) { return e.cardboardPlanks >= 1; }
  },
  {
    id: "tenPlanks", label: "Produce 10 Cardboard Planks to unlock Basic Wood",
    visible:  function(e) { return e.cardboardPlanks >= 1 || e.objectifsComplis.includes("firstPlank"); },
    accompli: function(e) { return e.cardboardPlanksTotalProduit >= 10 || storyEstVue("storyBasicWoodVue"); }
  },

  // ── Catnip & Catchen
  {
    id: "firstGrasscatter", label: "Choose the Catnip Salad recipe",
    visible:  function() { return batimentCampRepare("catchen"); },
    accompli: function() { return recetteChoisieCount("salads") >= 1; }
  },
  {
    id: "repairCatchen", label: "Repair and connect the Catchen in Camp",
    visible: function() { return nettoyageJunksDebloque(); },
    accompli: function() {
      return batimentCampRepare("catchen")
        && capaciteBatimentCamp("catchen", 1, { contentUnlocked: true }).available;
    }
  },
  {
    id: "firstCatchenWorker", label: "Assign a cat to the Catnip Salad recipe",
    visible:  function() { return recetteChoisieCount("salads") >= 1; },
    accompli: function() { return allocationCount("salads") >= 1; }
  },
  {
    id: "firstSalad", label: "Produce your first Catnip Salad",
    visible:  function() { return allocationCount("salads") >= 1; },
    accompli: function(e) { return e.salads >= 1; }
  },
  {
    id: "workerLevelTwo", label: "Raise a worker cat to level 2",
    visible:  function() { return nettoyageJunksDebloque(); },
    accompli: function(e) {
      return e.kittiesData.some(function(k) {
        return k.nom !== "Bernardo" && k.metier !== "gang-leader" && k.niveau >= 2;
      });
    }
  },

  // ── Pebbles & Pawsonry
  {
    id: "firstPebbleGatherer", label: "Choose the Pebble Bricks recipe",
    visible:  function() { return batimentCampRepare("pawsonry"); },
    accompli: function() { return recetteChoisieCount("pebbleBricks") >= 1; }
  },
  {
    id: "repairPawsonry", label: "Repair and connect the Pawsonry in Camp",
    visible: function(e) {
      return e.kittiesData.some(function(k) {
        return k.nom !== "Bernardo" && k.metier !== "gang-leader" && k.niveau >= 2;
      });
    },
    accompli: function() {
      return batimentCampRepare("pawsonry")
        && capaciteBatimentCamp("pawsonry", 1, { contentUnlocked: true }).available;
    }
  },
  {
    id: "firstPawsonryWorker", label: "Assign a cat to the Pebble Bricks recipe",
    visible:  function() { return recetteChoisieCount("pebbleBricks") >= 1; },
    accompli: function() { return allocationCount("pebbleBricks") >= 1; }
  },
  {
    id: "firstBrick", label: "Produce your first Pebble Brick",
    visible:  function() { return allocationCount("pebbleBricks") >= 1; },
    accompli: function() { return operationsTableDebloquee(); }
  },

  // ── Explorations & Job Center
  {
    id: "buildOperationsTable", label: "Build and connect the Operations Table in Camp",
    visible: function() { return operationsTableDebloquee(); },
    accompli: function() { return explorationCampFonctionnelle(); }
  },
  {
    id: "firstCampaign", label: "Complete the \"Search our trash\" campaign",
    visible:  function() { return explorationCampFonctionnelle(); },
    accompli: function(e) { return e.itemsAcquis.indexOf("schoolGuide") !== -1 || e.campaignsCompletees.indexOf("checkTheTrash") !== -1; }
  },
  {
    id: "learnFromSchoolGuide", label: "Study and learn from the School Guide in Inventory",
    visible:  function(e) { return e.itemsAcquis.indexOf("schoolGuide") !== -1; },
    accompli: function(e) { return e.itemsAppris.indexOf("schoolGuide") !== -1; }
  },
  {
    id: "buildJobCenter", label: "Build the Job Center (10 Pebble Bricks + 1 Basic Wood Plank)",
    labelHtml: 'Build the Job Center (10 <img class="obj-sprite" src="img/resources/Pebble Brick_Final.png" alt="Pebble Brick"> + 1 <img class="obj-sprite" src="img/resources/Basic Wood Plank_Final.png" alt="Basic Wood Plank">)',
    visible:  function(e) { return e.jobCenterDebloque; },
    accompli: function(e) { return e.jobCenterConstruit; }
  },
  {
    id: "firstJobTraining", label: "Train a cat as an Explorator",
    visible:  function(e) { return e.jobCenterConstruit; },
    accompli: function(e) { return e.kittiesData.some(function(k) { return k.metier === "explorator"; }); }
  },

  // ── Basic Wood
  {
    id: "firstBasicWoodGatherer", label: "Choose the Basic Wood Planks recipe",
    visible:  function() { return basicWoodDebloquee(); },
    accompli: function() { return recetteChoisieCount("basicWoodPlanks") >= 1; }
  },
  {
    id: "upgradeSawmillTier2", label: "Upgrade the Sawmill to Tier 2",
    visible: function() { return basicWoodDebloquee(); },
    accompli: function() {
      const sawmill = itemCampPrototypeParType("sawmill");
      return Boolean(sawmill && (sawmill.tier || 1) >= 2
        && capaciteBatimentCamp("sawmill", 2, { item: sawmill, contentUnlocked: true }).available);
    }
  },
  {
    id: "firstBasicSawmill", label: "Assign a cat to the Basic Wood Planks recipe",
    visible:  function() { return recetteChoisieCount("basicWoodPlanks") >= 1; },
    accompli: function() { return allocationCount("basicWoodPlanks") >= 1; }
  },
  {
    id: "firstBasicWoodPlank", label: "Produce your first Basic Wood Plank",
    visible:  function() { return allocationCount("basicWoodPlanks") >= 1; },
    accompli: function(e) { return e.basicWoodPlanks >= 1; }
  },

  // ── Cathouse (real)
  {
    id: "buildRealCathouse", label: "Build a Wood Cathouse to increase Cat capacity",
    // Use lifetime gathering, not the fluctuating current stock consumed by the Sawmill.
    visible:  function(e) { return e.basicWoodTotalRecolte >= 1 || e.cathouseCount > 0; },
    accompli: function(e) { return e.cathouseCount >= 1; }
  }
];

// Presentation metadata only: this guides the player without changing unlocks,
// objective visibility or completion rules above.
const OBJECTIF_GUIDE = Object.freeze({
  firstKitty:               { ordre: 10,  onglet: "gang",         cible: "#bouton-sequence",       action: "Recruit ↑",        progression: function(e) { return { actuel: e.chatons, cible: 1 }; } },
  secondKitty:              { ordre: 20,  onglet: "gang",         cible: "#bouton-sequence",       action: "Recruit ↑",        progression: function(e) { return { actuel: e.chatons, cible: 2 }; } },
  thirdKitty:               { ordre: 30,  onglet: "gang",         cible: "#bouton-sequence",       action: "Recruit ↑",        progression: function(e) { return { actuel: e.chatons, cible: 3 }; } },
  repairSawmill:            { ordre: 35,  onglet: "camp",         cible: '[data-camp-type="sawmill"]', action: "Repair Sawmill", progression: function() { return { actuel: batimentCampRepare("sawmill") ? 1 : 0, cible: 1 }; } },
  firstWoodcatter:          { ordre: 40,  onglet: "work",         cible: "#recipe-slot-wood-0",    filtre: "wood", progression: function() { return { actuel: recetteChoisieCount("cardboardPlanks"), cible: 1 }; } },
  firstSawmillWorker:       { ordre: 80,  onglet: "work",         cible: "#recipe-slot-wood-0",    filtre: "wood", progression: function() { return { actuel: allocationCount("cardboardPlanks"), cible: 1 }; } },
  firstPlank:               { ordre: 90,  onglet: "work",         cible: "#work-recipe-slots-wood", filtre: "wood", progression: function(e) { return { actuel: e.cardboardPlanks, cible: 1 }; } },
  firstCathouse:            { ordre: 100, onglet: "camp",         cible: '[data-camp-category="house"]', action: "Open Houses", progression: function(e) { return { actuel: e.cathouses.length, cible: 1 }; } },
  repairCatchen:            { ordre: 108, onglet: "camp",         cible: '[data-camp-type="catchen"]', action: "Repair Catchen", progression: function() { return { actuel: batimentCampRepare("catchen") ? 1 : 0, cible: 1 }; } },
  firstGrasscatter:         { ordre: 110, onglet: "work",         cible: "#recipe-slot-food-0",    filtre: "food", progression: function() { return { actuel: recetteChoisieCount("salads"), cible: 1 }; } },
  firstCatchenWorker:       { ordre: 130, onglet: "work",         cible: "#recipe-slot-food-0",    filtre: "food", progression: function() { return { actuel: allocationCount("salads"), cible: 1 }; } },
  firstSalad:               { ordre: 140, onglet: "work",         cible: "#work-recipe-slots-food", filtre: "food", progression: function(e) { return { actuel: e.salads, cible: 1 }; } },
  workerLevelTwo:           { ordre: 145, onglet: "gang",         cible: "#detail-experience",       action: "Raise a worker to level 2", progression: function(e) {
    const niveau = e.kittiesData.reduce(function(maximum, kitty) {
      return kitty.nom === "Bernardo" || kitty.metier === "gang-leader"
        ? maximum
        : Math.max(maximum, kitty.niveau || 0);
    }, 0);
    return { actuel: Math.min(2, niveau), cible: 2 };
  } },
  repairPawsonry:           { ordre: 152, onglet: "camp",         cible: '[data-camp-type="pawsonry"]', action: "Repair Pawsonry", progression: function() { return { actuel: batimentCampRepare("pawsonry") ? 1 : 0, cible: 1 }; } },
  buildOperationsTable:     { ordre: 155, onglet: "camp",         cible: '[data-camp-category="building"]', action: "Open Buildings", progression: function() { return { actuel: explorationCampFonctionnelle() ? 1 : 0, cible: 1 }; } },
  firstCampaign:            { ordre: 160, onglet: "explorations", cible: "#section-campaigns",     progression: function(e) {
    const mission = e.exploEnCours.find(function(explo) { return explo.id === "checkTheTrash"; });
    if (!mission) return { actuel: 0, cible: 1, texte: "Not started" };
    const ecoule = Math.min(mission.duree, Math.max(0, (Date.now() - mission.startTs) / 1000));
    return { actuel: ecoule, cible: mission.duree, texte: formaterTemps(Math.ceil(ecoule)) + " / " + formaterTemps(mission.duree) };
  } },
  learnFromSchoolGuide:     { ordre: 170, onglet: "inventaire",   cible: "#section-items",         progression: function(e) {
    const lecture = e.learningEnCours && e.learningEnCours.itemId === "schoolGuide" ? e.learningEnCours : null;
    if (e.itemsEtudies && e.itemsEtudies.includes("schoolGuide")) return { actuel: 0.75, cible: 1, texte: "Study complete · solve the lesson" };
    if (!lecture) return { actuel: 0, cible: 1, texte: "Ready to study" };
    const ecoule = Math.min(lecture.duree / 1000, Math.max(0, (Date.now() - lecture.startTs) / 1000));
    return { actuel: ecoule, cible: lecture.duree / 1000, texte: formaterTemps(Math.ceil(ecoule)) + " / " + formaterTemps(lecture.duree / 1000) };
  } },
  tenPlanks:                { ordre: 180, onglet: "work",         cible: "#work-recipe-slots-wood", filtre: "wood", progression: function(e) { return { actuel: Math.min(10, e.cardboardPlanksTotalProduit), cible: 10 }; } },
  upgradeSawmillTier2:      { ordre: 185, onglet: "camp",         cible: '[data-camp-type="sawmill"]', action: "Upgrade Sawmill", progression: function() { const sawmill = itemCampPrototypeParType("sawmill"); return { actuel: sawmill ? Math.min(2, sawmill.tier || 1) : 0, cible: 2 }; } },
  firstBasicWoodGatherer:   { ordre: 190, onglet: "work",         cible: "#work-recipe-slots-wood", filtre: "wood", progression: function() { return { actuel: recetteChoisieCount("basicWoodPlanks"), cible: 1 }; } },
  firstPebbleGatherer:      { ordre: 210, onglet: "work",         cible: "#recipe-slot-rock-0",    filtre: "rock", progression: function() { return { actuel: recetteChoisieCount("pebbleBricks"), cible: 1 }; } },
  firstPawsonryWorker:      { ordre: 230, onglet: "work",         cible: "#recipe-slot-rock-0",    filtre: "rock", progression: function() { return { actuel: allocationCount("pebbleBricks"), cible: 1 }; } },
  firstBrick:               { ordre: 240, onglet: "work",         cible: "#work-recipe-slots-rock", filtre: "rock", progression: function() { return { actuel: operationsTableDebloquee() ? 1 : 0, cible: 1 }; } },
  firstBasicSawmill:        { ordre: 250, onglet: "work",         cible: "#work-recipe-slots-wood", filtre: "wood", progression: function() { return { actuel: allocationCount("basicWoodPlanks"), cible: 1 }; } },
  firstBasicWoodPlank:      { ordre: 260, onglet: "work",         cible: "#work-recipe-slots-wood", filtre: "wood", progression: function(e) { return { actuel: e.basicWoodPlanks, cible: 1 }; } },
  buildRealCathouse:        { ordre: 270, onglet: "camp",         cible: '[data-camp-category="house"]', action: "Open Houses", progression: function(e) { return { actuel: e.cathouseCount, cible: 1 }; } },
  buildJobCenter:           { ordre: 280, onglet: "camp",         cible: '[data-camp-category="building"]', action: "Open Buildings", progression: function(e) {
    const briques = Math.min(10, e.pebbleBricks);
    const planches = Math.min(1, e.basicWoodPlanks);
    return { actuel: Math.min(briques / 10, planches), cible: 1, texte: formaterNombre(briques) + "/10 bricks · " + formaterNombre(planches) + "/1 plank" };
  } },
  firstJobTraining:         { ordre: 290, onglet: "facilities",   cible: "#jc-interface",          progression: function(e) {
    if (!e.formationEnCours) return { actuel: 0, cible: 1, texte: "Choose a cat and a job" };
    const ecoule = Math.min(e.formationEnCours.duree, Math.max(0, (Date.now() - e.formationEnCours.startTs) / 1000));
    return { actuel: ecoule, cible: e.formationEnCours.duree, texte: formaterTemps(Math.ceil(ecoule)) + " / " + formaterTemps(e.formationEnCours.duree) };
  } }
});


// ════════════════════════════════════════════════════════════
// 2. GAME STATE
// ════════════════════════════════════════════════════════════

// State factory lives in js/core/state.js.
const stateCore = globalThis.CatInc.state;
const creerEtatInitial = stateCore.creerEtatInitial;
const remplacerEtat = stateCore.remplacerEtat;
const etat = creerEtatInitial();

function reinitialiserEtat() {
  remplacerEtat(etat, creerEtatInitial());
  workStructureInitialisee = false;
}


// ════════════════════════════════════════════════════════════
// 3. DERIVED VALUES & CALCULATIONS
// ════════════════════════════════════════════════════════════



function allocationCount(action) {
  const pair = RESOURCE_PAIRS.find(function(candidate) {
    return candidate.rawAction === action || candidate.procAction === action || candidate.recipeId === action;
  });
  if (pair) {
    return (etat.workRecipeSlots[pair.family] || []).filter(function(slot) {
      return slot.recipeId === pair.recipeId && slot.kittyIndex !== null;
    }).length;
  }
  return 0;
}

function kittyIsInWorkerSlot(kittyIdx) {
  return Object.values(etat.workRecipeSlots || {}).some(function(slots) {
    return slots.some(function(s) { return s.kittyIndex === kittyIdx; });
  });
}

function reinitialiserProgressionRecette(slot, retirerRecette) {
  if (!slot) return;
  viderProgressionRecette(slot);
  slot.kittyIndex = null;
  if (retirerRecette) slot.recipeId = null;
}

function viderProgressionRecette(slot) {
  if (!slot) return;
  slot.phase = "idle";
  slot.phaseProgress = 0;
  slot.outputCarry = 0;
  slot.gatheredInputs = {};
  slot.reservedInputs = {};
}

function kittyIsInTraining(kittyIdx) {
  return !!((etat.formationEnCours && etat.formationEnCours.kittyIndex === kittyIdx)
    || (etat.formationIngenieurEnCours && etat.formationIngenieurEnCours.kittyIndex === kittyIdx));
}

function kittyIsLearningBook(kittyIdx) {
  return !!(etat.learningEnCours && etat.learningEnCours.kittyIndex === kittyIdx);
}

function kittyIsOnExpedition(kittyIdx) {
  return etat.exploEnCours.some(function(e) { return e.kittyIndices.includes(kittyIdx); });
}

function kittyEstManager(kittyIdx) {
  return Object.values(etat.managers).some(function(mi) { return mi === kittyIdx; });
}

function kittyIsOnZoneExplo(kittyIdx) {
  return !!(etat.exploZoneEnCours && etat.exploZoneEnCours.kittyIndices.includes(kittyIdx));
}

function estBernardoSuperviseur(kittyOuIndex) {
  const kitty = Number.isInteger(kittyOuIndex)
    ? etat.kittiesData[kittyOuIndex]
    : kittyOuIndex;
  return Boolean(kitty && (kitty.nom === "Bernardo" || kitty.metier === "gang-leader"));
}

function kittyPeutExecuterTacheCamp(kittyIndex, minLevel) {
  const kitty = etat.kittiesData[kittyIndex];
  return Boolean(kitty
    && !estBernardoSuperviseur(kitty)
    && !estIngenieur(kitty)
    && (Number(kitty.niveau) || 0) >= Math.max(0, Number(minLevel) || 0)
    && !kittyIsBusy(kittyIndex)
    && !kittyIsInExplorationStaging(kittyIndex));
}

function kittyIsBusy(kittyIdx) {
  const kitty = etat.kittiesData[kittyIdx];
  const constructionMaisonCamp = typeof kittyIsBuildingCampHouse === "function"
    && kittyIsBuildingCampHouse(kittyIdx);
  const constructionBatimentCamp = typeof kittyIsBuildingCampBuilding === "function"
    && kittyIsBuildingCampBuilding(kittyIdx);
  const reparationCamp = typeof kittyIsRepairingCamp === "function"
    && kittyIsRepairingCamp(kittyIdx);
  const demolitionCamp = typeof kittyIsDemolishingCamp === "function"
    && kittyIsDemolishingCamp(kittyIdx);
  const ameliorationCamp = typeof kittyIsUpgradingCamp === "function"
    && kittyIsUpgradingCamp(kittyIdx);
  return estIngenieur(kitty) || kittyEstManager(kittyIdx) || kittyIsOnExpedition(kittyIdx) || kittyIsInWorkerSlot(kittyIdx) || kittyIsInTraining(kittyIdx) || kittyIsOnZoneExplo(kittyIdx) || kittyIsOnScouting(kittyIdx) || kittyIsInScoutingStaging(kittyIdx) || kittyIsLearningBook(kittyIdx) || constructionMaisonCamp || constructionBatimentCamp || reparationCamp || demolitionCamp || ameliorationCamp;
}

function isAvailableForAutoAssign(ki, currentSlots) {
  if (!etat.kittiesData[ki]) return false;
  if (estBernardoSuperviseur(ki)) return false;
  if (currentSlots && currentSlots.indexOf(ki) !== -1) return false;
  if (kittyIsBusy(ki)) return false;
  if (kittyEstManager(ki)) return false;
  return true;
}

function estExplorateurDeZone(kittyIndex) {
  var k = etat.kittiesData[kittyIndex];
  return !!(k && k.metier === 'explorator');
}

function autoAssignPickPriority(available) {
  var explo = available.find(function(i) {
    return estExplorateurDeZone(i) && etat.kittiesData[i].metier === 'explorator';
  });
  if (explo !== undefined) return explo;
  return null;
}

function autoAssignPickBest(available, difficulte, currentPower) {
  if (available.length === 0) return null;
  var remaining = difficulte - currentPower;
  var under = available.filter(function(i) { return kittyEP(i) <= remaining; });
  if (under.length > 0) {
    return under.reduce(function(best, i) { return kittyEP(i) > kittyEP(best) ? i : best; });
  }
  return available.reduce(function(best, i) { return kittyEP(i) < kittyEP(best) ? i : best; });
}

function exclusifyStagedKitty(ki, exceptType, exceptId) {
  Object.keys(exploKittiesSelectionnees).forEach(function(campId) {
    if (exceptType === 'campaign' && campId === exceptId) return;
    var s = exploKittiesSelectionnees[campId];
    if (s) for (var i = 0; i < s.length; i++) { if (s[i] === ki) s[i] = null; }
  });
  Object.keys(carteExploSlots).forEach(function(zoneId) {
    if (exceptType === 'zone' && zoneId === exceptId) return;
    var s = carteExploSlots[zoneId];
    if (s) for (var i = 0; i < s.length; i++) { if (s[i] === ki) s[i] = null; }
  });
  Object.keys(scoutingsStagingKitty).forEach(function(scId) {
    if (exceptType === 'scouting' && scId === exceptId) return;
    if (scoutingsStagingKitty[scId] === ki) delete scoutingsStagingKitty[scId];
  });
}

function autoAssignExplo(type, id) {
  var allKittyIndices = Object.keys(etat.kittiesData).map(Number).filter(function(i) { return !!etat.kittiesData[i]; });

  if (type === 'scouting') {
    var def = CONFIG.scoutings[id];
    if (!def || scoutingsStagingKitty[id] !== undefined) return;
    var avail = allKittyIndices.filter(function(i) { return isAvailableForAutoAssign(i, []); });
    var chosen = autoAssignPickPriority(avail);
    if (chosen === null) chosen = autoAssignPickBest(avail, def.difficulte, 0);
    if (chosen !== null && chosen !== undefined) {
      scoutingsStagingKitty[id] = chosen;
      exclusifyStagedKitty(chosen, 'scouting', id);
      exploTabDirty = true;
      renderCampaignCards();
    }
    return;
  }

  var difficulte, slots, nbSlots;
  if (type === 'campaign') {
    var camp = CONFIG.campaigns[id];
    if (!camp) return;
    difficulte = camp.difficulte; nbSlots = camp.slots;
    if (!exploKittiesSelectionnees[id]) exploKittiesSelectionnees[id] = new Array(nbSlots).fill(null);
    slots = exploKittiesSelectionnees[id];
  } else if (type === 'zone') {
    var zone = ZONES_CARTE[id];
    if (!zone) return;
    difficulte = zone.difficulte; nbSlots = zone.slots;
    if (!carteExploSlots[id]) carteExploSlots[id] = new Array(nbSlots).fill(null);
    slots = carteExploSlots[id];
    if (slots[0] !== null && !estExplorateurDeZone(slots[0])) slots[0] = null;
  } else { return; }

  for (var si = 0; si < nbSlots; si++) {
    if (slots[si] !== null) continue;
    var avail2 = allKittyIndices.filter(function(i) {
      return isAvailableForAutoAssign(i, slots) && (type !== 'zone' || si !== 0 || estExplorateurDeZone(i));
    });
    if (avail2.length === 0) break;
    var currentPower = slots.reduce(function(s, ki) { return s + (ki !== null ? kittyEP(ki) : 0); }, 0);
    var hasPriority = slots.some(function(ki) {
      if (ki === null) return false;
      var k = etat.kittiesData[ki];
      return estExplorateurDeZone(ki);
    });
    var pick = null;
    if (!hasPriority) pick = autoAssignPickPriority(avail2);
    if (pick === null || pick === undefined) pick = autoAssignPickBest(avail2, difficulte, currentPower);
    if (pick === null || pick === undefined) break;
    slots[si] = pick;
    exclusifyStagedKitty(pick, type, id);
  }
  exploTabDirty = true;
  renderCampaignCards();
}

function totalAlloue() {
  var total = 0;
  var managersAlloues = new Set();
  Object.values(etat.workRecipeSlots || {}).forEach(function(slots) {
    slots.forEach(function(s) { if (s.kittyIndex !== null) total++; });
  });
  Object.values(etat.managers || {}).forEach(function(ki) {
    if (Number.isInteger(ki)) managersAlloues.add(ki);
  });
  total += managersAlloues.size;
  if (etat.formationEnCours) total++;
  if (etat.formationIngenieurEnCours) total++;
  if (etat.learningEnCours && Number.isInteger(etat.learningEnCours.kittyIndex)) total++;
  if (typeof campPrototypeDemolitionsActives === "function") {
    total += campPrototypeDemolitionsActives().length;
  }
  if (typeof reparationsCampActives === "function") {
    total += reparationsCampActives().length;
  }
  if (typeof constructionsMaisonsCampActives === "function") {
    total += constructionsMaisonsCampActives().length;
  }
  total += ingenieursFormes().length;
  return total;
}
function chatonsEnExplo() {
  return etat.exploEnCours.reduce(function(s, e) { return s + e.kittyIndices.length; }, 0);
}
function chatonsEnZoneExplo() {
  return etat.exploZoneEnCours ? etat.exploZoneEnCours.kittyIndices.length : 0;
}
function chatonsEnScouting() {
  return Object.keys(etat.scoutingsEnCours).length;
}
function kittyIsOnScouting(kittyIdx) {
  return Object.values(etat.scoutingsEnCours).some(function(sc) { return sc.kittyIndex === kittyIdx; });
}
function kittyIsInScoutingStaging(kittyIdx) {
  return Object.values(scoutingsStagingKitty).some(function(ki) { return ki === kittyIdx; });
}

// Exploration slots are temporary reservations rather than running actions.
// Keep them separate from kittyIsBusy so a player can move a Cat between
// pending slots, while other actions still respect the one-action invariant.
function kittyIsInExplorationStaging(kittyIdx) {
  var inCampaignSlot = (typeof exploKittiesSelectionnees !== "undefined")
    && Object.values(exploKittiesSelectionnees || {}).some(function(slots) {
      return Array.isArray(slots) && slots.includes(kittyIdx);
    });
  var inZoneSlot = (typeof carteExploSlots !== "undefined")
    && Object.values(carteExploSlots || {}).some(function(slots) {
      return Array.isArray(slots) && slots.includes(kittyIdx);
    });
  return inCampaignSlot || inZoneSlot;
}

function kittyHasNonReplaceableAction(kittyIdx) {
  return estIngenieur(etat.kittiesData[kittyIdx])
    || kittyIsOnExpedition(kittyIdx)
    || kittyIsOnZoneExplo(kittyIdx)
    || kittyIsOnScouting(kittyIdx)
    || kittyIsInScoutingStaging(kittyIdx)
    || kittyIsInTraining(kittyIdx)
    || kittyIsLearningBook(kittyIdx)
    || (typeof kittyIsBuildingCampHouse === "function" && kittyIsBuildingCampHouse(kittyIdx))
    || (typeof kittyIsBuildingCampBuilding === "function" && kittyIsBuildingCampBuilding(kittyIdx))
    || (typeof kittyIsRepairingCamp === "function" && kittyIsRepairingCamp(kittyIdx))
    || (typeof kittyIsUpgradingCamp === "function" && kittyIsUpgradingCamp(kittyIdx))
    || (typeof kittyIsDemolishingCamp === "function" && kittyIsDemolishingCamp(kittyIdx));
}

// Repair older saves and protect the core invariant: a Cat can own one action
// at most. Running actions have priority over replaceable assignments; when an
// invalid duplicate is found, the later assignment is released.
function normaliserOccupationsChatons() {
  var changed = false;
  ["gl-explo", "gl-explo-halves", "gl-explo-luck", "gl-explo-power", "gl-explo-catfood"]
    .forEach(function(perkId) {
      if (etat.spherePerks && Object.prototype.hasOwnProperty.call(etat.spherePerks, perkId)) {
        delete etat.spherePerks[perkId];
        changed = true;
      }
    });
  var claimed = new Set();
  var kittyValide = function(ki) {
    return Number.isInteger(ki) && !!etat.kittiesData[ki];
  };
  var estIngenieurEtat = function(ki) {
    var kitty = etat.kittiesData[ki];
    return typeof estIngenieur === "function" ? estIngenieur(kitty) : !!(kitty && /engineer/i.test(String(kitty.metier || "")));
  };
  var claim = function(ki, autoriserBernardo) {
    if (!kittyValide(ki) || estIngenieurEtat(ki)
        || (!autoriserBernardo && estBernardoSuperviseur(ki)) || claimed.has(ki)) return false;
    claimed.add(ki);
    return true;
  };
  var cleanIndices = function(indices) {
    if (!Array.isArray(indices)) return [];
    var result = [];
    indices.forEach(function(ki) {
      if (claim(ki)) result.push(ki);
      else changed = true;
    });
    return result;
  };

  if (etat.exploZoneEnCours) {
    var zoneBefore = etat.exploZoneEnCours.kittyIndices;
    var zoneAfter = cleanIndices(zoneBefore);
    if (!Array.isArray(zoneBefore) || zoneAfter.length !== zoneBefore.length) changed = true;
    etat.exploZoneEnCours.kittyIndices = zoneAfter;
  }
  (etat.exploEnCours || []).forEach(function(mission) {
    if (!mission) return;
    var before = mission.kittyIndices;
    var after = cleanIndices(before);
    if (!Array.isArray(before) || after.length !== before.length) changed = true;
    mission.kittyIndices = after;
  });
  Object.keys(etat.scoutingsEnCours || {}).forEach(function(id) {
    var scouting = etat.scoutingsEnCours[id];
    if (!scouting || !claim(scouting.kittyIndex)) {
      delete etat.scoutingsEnCours[id];
      changed = true;
    }
  });
  ["formationEnCours", "formationIngenieurEnCours"].forEach(function(field) {
    var action = etat[field];
    if (!action) return;
    if (!claim(action.kittyIndex)) {
      etat[field] = null;
      changed = true;
    }
  });
  if (etat.learningEnCours && !claim(etat.learningEnCours.kittyIndex, true)) {
    etat.learningEnCours = null;
    changed = true;
  }
  if (
    typeof normaliserConstructionsMaisonsCamp === "function"
    && normaliserConstructionsMaisonsCamp(claim)
  ) changed = true;
  if (
    typeof normaliserConstructionsBatimentsCamp === "function"
    && normaliserConstructionsBatimentsCamp(claim)
  ) changed = true;
  if (
    typeof normaliserReparationsCamp === "function"
    && normaliserReparationsCamp(claim)
  ) changed = true;
  if (
    typeof normaliserAmeliorationsCamp === "function"
    && normaliserAmeliorationsCamp(claim)
  ) changed = true;
  if (
    typeof normaliserDemolitionsCampPrototype === "function"
    && normaliserDemolitionsCampPrototype(claim)
  ) changed = true;
  Object.keys(etat.managers || {}).forEach(function(famille) {
    var ki = etat.managers[famille];
    if (ki === null || ki === undefined) return;
    if (!claim(ki)) {
      etat.managers[famille] = null;
      changed = true;
    }
  });
  Object.values(etat.workRecipeSlots || {}).forEach(function(slots) {
    (slots || []).forEach(function(slot) {
      if (!slot || slot.kittyIndex === null || slot.kittyIndex === undefined) return;
      if (!claim(slot.kittyIndex)) {
        slot.kittyIndex = null;
        changed = true;
      }
    });
  });

  // Engineers are passive and cannot remain attached to any running action.
  var retirerIngenieurs = function(indices) {
    if (!Array.isArray(indices)) return indices;
    var filtered = indices.filter(function(ki) { return !estIngenieurEtat(ki); });
    if (filtered.length !== indices.length) changed = true;
    return filtered;
  };
  if (etat.exploZoneEnCours) etat.exploZoneEnCours.kittyIndices = retirerIngenieurs(etat.exploZoneEnCours.kittyIndices);
  (etat.exploEnCours || []).forEach(function(mission) {
    if (mission) mission.kittyIndices = retirerIngenieurs(mission.kittyIndices);
  });
  return changed;
}

// Maps a worker action to the exact resource it produces, e.g. "génère des Cardboard Pieces"
var ACTION_DISPLAY = { fishcatting: "Anchovy", grilledAnchovy: "Grilled Anchovy", woodcatting: "Cardboard Pieces", basicWoodcatting: "Basic Wood", grasscatting: "Catnip", pebblegathering: "Pebbles", rockgathering: "Rocks", sawmill: "Cardboard Planks", basicSawmill: "Basic Wood Planks", brickfactory: "Pebble Bricks", rockFactory: "Rock Bricks", catchen: "Catnip Salad" };

function kittyAllocationLabel(kittyIdx) {
  const kittyForLabel = etat.kittiesData[kittyIdx];
  const missionZoneLabel = function(type, zoneId) { return type + ": " + (zoneId || "Unknown zone"); };
  if (kittyIsLearningBook(kittyIdx)) {
    const book = etat.learningEnCours && ITEMS[etat.learningEnCours.itemId];
    return { text: "Studying: " + (book ? book.nom : "a book"), cls: "kitty-statut-training" };
  }
  if (etat.formationIngenieurEnCours && etat.formationIngenieurEnCours.kittyIndex === kittyIdx) {
    return { text: "In training: Camp Engineer", cls: "kitty-statut-training" };
  }
  if (estIngenieur(kittyForLabel)) {
    return { text: "Engineer: passive bonus", cls: "kitty-statut-work" };
  }
  const constructionMaisonCamp = typeof constructionMaisonCampPourKitty === "function"
    ? constructionMaisonCampPourKitty(kittyIdx)
    : null;
  if (constructionMaisonCamp) {
    return { text: "Building: " + constructionMaisonCamp.label, cls: "kitty-statut-work" };
  }
  const constructionBatimentCamp = typeof constructionBatimentCampPourKitty === "function"
    ? constructionBatimentCampPourKitty(kittyIdx)
    : null;
  if (constructionBatimentCamp) {
    return { text: "Building: " + constructionBatimentCamp.label, cls: "kitty-statut-work" };
  }
  const reparationCamp = typeof reparationCampPourKitty === "function"
    ? reparationCampPourKitty(kittyIdx)
    : null;
  if (reparationCamp) {
    return { text: "Repairing: " + reparationCamp.label, cls: "kitty-statut-work" };
  }
  const ameliorationCamp = typeof ameliorationCampPourKitty === "function"
    ? ameliorationCampPourKitty(kittyIdx)
    : null;
  if (ameliorationCamp) {
    const typeAmeliore = typeof typeCampPrototype === "function"
      ? typeCampPrototype(ameliorationCamp.type)
      : null;
    return {
      text: "Upgrading: " + (typeAmeliore ? typeAmeliore.label : ameliorationCamp.type)
        + " to T" + ameliorationCamp.targetTier,
      cls: "kitty-statut-work"
    };
  }
  const demolitionCamp = typeof demolitionCampPrototypePourKitty === "function"
    ? demolitionCampPrototypePourKitty(kittyIdx)
    : null;
  if (demolitionCamp) {
    return { text: "Demolition: Camp", cls: "kitty-statut-work" };
  }
  // Recipe slot
  var assignedRecipe = null;
  Object.keys(etat.workRecipeSlots || {}).forEach(function(family) {
    const slot = etat.workRecipeSlots[family].find(function(candidate) { return candidate.kittyIndex === kittyIdx; });
    if (slot) assignedRecipe = RESOURCE_PAIRS.find(function(pair) { return pair.recipeId === slot.recipeId; });
  });
  if (assignedRecipe) {
    return { text: "Producing: " + assignedRecipe.procLabel, cls: "kitty-statut-work" };
  }
  // Manager
  var managerFamille = Object.keys(etat.managers).find(function(f) { return etat.managers[f] === kittyIdx; });
  if (managerFamille) {
    return { text: "Manager: " + managerFamille.charAt(0).toUpperCase() + managerFamille.slice(1), cls: "kitty-statut-work" };
  }
  // Training
  if (etat.formationEnCours && etat.formationEnCours.kittyIndex === kittyIdx) {
    var jobNom = etat.formationEnCours.metier && METIERS[etat.formationEnCours.metier] ? METIERS[etat.formationEnCours.metier].nom : "training";
    return { text: "In training: " + jobNom, cls: "kitty-statut-training" };
  }
  // Zone exploration (running)
  if (etat.exploZoneEnCours && etat.exploZoneEnCours.kittyIndices.includes(kittyIdx)) {
    var explorationZoneId = etat.exploZoneEnCours.zoneId;
    var z = ZONES_CARTE[explorationZoneId];
    var explorationZoneRevealed = Array.isArray(etat.zonesExplorees) && etat.zonesExplorees.includes(explorationZoneId);
    var explorationZoneLabel = explorationZoneRevealed && z ? explorationZoneId : null;
    return { text: missionZoneLabel("Exploration", explorationZoneLabel), cls: "kitty-statut-explo" };
  }
  // Zone exploration (staged)
  var stagedZone = Object.keys(carteExploSlots).find(function(zoneId) {
    return (carteExploSlots[zoneId] || []).includes(kittyIdx);
  });
  if (stagedZone) {
    var zs = ZONES_CARTE[stagedZone];
    var stagedZoneRevealed = Array.isArray(etat.zonesExplorees) && etat.zonesExplorees.includes(stagedZone);
    var stagedZoneLabel = stagedZoneRevealed && zs ? stagedZone : null;
    return { text: missionZoneLabel("Exploration", stagedZoneLabel), cls: "kitty-statut-explo" };
  }
  // Campaign (running)
  var runningCamp = etat.exploEnCours.find(function(e) { return e.kittyIndices.includes(kittyIdx); });
  if (runningCamp) {
    var camp = CONFIG.campaigns[runningCamp.id];
    return { text: missionZoneLabel("Campaign", camp ? camp.zone : null), cls: "kitty-statut-explo" };
  }
  // Campaign (staged)
  var stagedCamp = Object.keys(exploKittiesSelectionnees).find(function(campId) {
    return (exploKittiesSelectionnees[campId] || []).includes(kittyIdx);
  });
  if (stagedCamp) {
    var sc2 = CONFIG.campaigns[stagedCamp];
    return { text: missionZoneLabel("Campaign", sc2 ? sc2.zone : null), cls: "kitty-statut-explo" };
  }
  // Scouting (running)
  var runningScouting = Object.keys(etat.scoutingsEnCours).find(function(id) {
    return etat.scoutingsEnCours[id].kittyIndex === kittyIdx;
  });
  if (runningScouting) {
    var sd = CONFIG.scoutings[runningScouting];
    return { text: missionZoneLabel("Scouting", sd ? sd.zone : null), cls: "kitty-statut-explo" };
  }
  // Scouting (staged)
  var stagedScouting = Object.keys(scoutingsStagingKitty).find(function(id) {
    return scoutingsStagingKitty[id] === kittyIdx;
  });
  if (stagedScouting) {
    var sds = CONFIG.scoutings[stagedScouting];
    return { text: missionZoneLabel("Scouting", sds ? sds.zone : null), cls: "kitty-statut-explo" };
  }
  return { text: "Free", cls: "kitty-statut-free" };
}
function chatonsLibres() { return etat.chatons - totalAlloue() - chatonsEnExplo() - chatonsEnZoneExplo() - chatonsEnScouting() - Object.keys(scoutingsStagingKitty).length; }

function scoutingDebloquee(scoutingDef) {
  if (scoutingDef.unlockCampaign && !etat.campaignsCompletees.includes(scoutingDef.unlockCampaign)) return false;
  if (scoutingDef.zone && !etat.zonesExplorees.includes(scoutingDef.zone)) return false;
  return true;
}

function tirerRecompenseScouting(range) {
  var roll = Math.random() * 100, cumul = 0;
  for (var i = 0; i < range.length; i++) {
    cumul += range[i].weight;
    if (roll < cumul) return range[i].qty;
  }
  return range[range.length - 1].qty;
}

function butinScoutingVide() {
  return { successful: 0, failed: 0, regular: 0, lucky: 0, superLucky: 0, doubled: 0, tripled: 0, rewards: {} };
}

function obtenirButinScouting(scoutingId) {
  if (!etat.butinsScouting) etat.butinsScouting = {};
  if (!etat.butinsScouting[scoutingId]) etat.butinsScouting[scoutingId] = butinScoutingVide();
  const butin = etat.butinsScouting[scoutingId];
  if (!Number.isInteger(butin.tripled) || butin.tripled < 0) butin.tripled = 0;
  return butin;
}

function scoutingIdsAvecButinZone(zoneId) {
  if (!zoneId || !etat.butinsScouting) return [];
  return Object.keys(etat.butinsScouting).filter(function(scoutingId) {
    const scouting = CONFIG.scoutings[scoutingId];
    const butin = etat.butinsScouting[scoutingId];
    return scouting && scouting.zone === zoneId && butin
      && Object.values(butin.rewards || {}).some(function(qty) { return Number(qty) > 0; });
  });
}

function categorieRecompenseScouting(entries, selected) {
  if (!entries || entries.length <= 1) return "regular";
  const triees = entries.slice().sort(function(a, b) { return b.weight - a.weight; });
  const rang = triees.findIndex(function(entry) {
    return entry === selected || (entry.recompense === selected.recompense && entry.qty === selected.qty);
  });
  if (rang <= 0) return "regular";
  if (rang === triees.length - 1) return "superLucky";
  return "lucky";
}

function ajouterAuButinScouting(butin, recompenseId, qty, categorie, rewardMultiplier) {
  if (!recompenseId || qty <= 0) return;
  butin[categorie] += 1;
  if (rewardMultiplier === 3) butin.tripled += 1;
  else if (rewardMultiplier === 2) butin.doubled += 1;
  butin.rewards[recompenseId] = (butin.rewards[recompenseId] || 0) + qty;
}

function multiplicateurRecompenseScoutingApplique(baseQty, actualQty) {
  if (baseQty > 0 && actualQty >= baseQty * 3) return 3;
  if (baseQty > 0 && actualQty >= baseQty * 2) return 2;
  return 1;
}

function stocksScoutingQuotidiensParDefaut(dateKey) {
  const remaining = {};
  Object.keys(CONFIG.scoutings).forEach(function(id) {
    const def = CONFIG.scoutings[id];
    if (Number.isFinite(def.dailyCannedCatFoodStock)) remaining[id] = def.dailyCannedCatFoodStock;
  });
  return { dateKey: dateKey, remaining: remaining };
}

function initialiserStocksScoutingQuotidiens() {
  const dateKey = cleDateParis(Date.now());
  const actuel = etat.dailyScoutingStocks;
  const idsAvecStock = Object.keys(CONFIG.scoutings).filter(function(id) {
    return Number.isFinite(CONFIG.scoutings[id].dailyCannedCatFoodStock);
  });
  const invalide = !actuel
    || actuel.dateKey !== dateKey
    || !actuel.remaining
    || idsAvecStock.some(function(id) { return !Number.isInteger(actuel.remaining[id]); });
  if (!invalide) return false;
  etat.dailyScoutingStocks = stocksScoutingQuotidiensParDefaut(dateKey);
  return true;
}

function stockCannedCatFoodScouting(scoutingId) {
  const def = CONFIG.scoutings[scoutingId];
  if (!def || !Number.isFinite(def.dailyCannedCatFoodStock)) return null;
  initialiserStocksScoutingQuotidiens();
  const stocks = etat.dailyScoutingStocks && etat.dailyScoutingStocks.remaining;
  if (!stocks) return null;
  const remaining = Number.isFinite(stocks[scoutingId])
    ? Math.min(def.dailyCannedCatFoodStock, Math.max(0, stocks[scoutingId]))
    : def.dailyCannedCatFoodStock;
  if (!Number.isFinite(stocks[scoutingId])) stocks[scoutingId] = remaining;
  return { remaining: remaining, total: def.dailyCannedCatFoodStock };
}

function limiterRecompenseScouting(scoutingId, recompenseId, qty, kittyIndex) {
  if (recompenseId !== "cannedCatFood") return Math.max(0, qty || 0);
  const stock = stockCannedCatFoodScouting(scoutingId);
  if (!stock) return Math.max(0, qty || 0);
  const desired = Math.max(0, qty || 0);
  if (stock.remaining <= 0 || desired <= 0) return 0;
  if (Math.random() < scoutingLuckyFoodChance(kittyIndex)) return desired;
  const awarded = Math.min(desired, stock.remaining);
  if (awarded > 0) etat.dailyScoutingStocks.remaining[scoutingId] = stock.remaining - awarded;
  return awarded;
}

function terminerScouting(scoutingId) {
  var runs = arguments[1];
  var def = CONFIG.scoutings[scoutingId];
  var sc  = etat.scoutingsEnCours[scoutingId];
  if (!def || !sc) return;
  var runCount = Math.max(1, Math.floor(runs || 1));
  var butin = obtenirButinScouting(scoutingId);
  var dailySuccesses = 0;
  for (var run = 0; run < runCount; run++) {
    // Success power is frozen for the active run. Later auto-repeats use the
    // cat's current power, matching the former restart behavior.
    var power = run === 0 && Number.isFinite(sc.power) ? sc.power : kittyEP(sc.kittyIndex);
    var successChance = def.difficulte > 0 ? Math.min(1, power / def.difficulte) : 1;
    var success = Math.random() < successChance;
    if (!success) {
      butin.failed += 1;
      continue;
    }
    butin.successful += 1;
    dailySuccesses += 1;
    if (def.recompenseTable) {
      var table = applyPerkCatFood(def.recompenseTable, sc.kittyIndex);
      var entry = resoudreRecompenseTable(table);
      var tableQty = tryDoubleReward(entry.qty, sc.kittyIndex);
      var tableActualQty = limiterRecompenseScouting(scoutingId, entry.recompense, tableQty, sc.kittyIndex);
      var tableMultiplier = multiplicateurRecompenseScoutingApplique(entry.qty, tableActualQty);
      ajouterAuButinScouting(butin, entry.recompense, tableActualQty, categorieRecompenseScouting(def.recompenseTable, entry), tableMultiplier);
    } else if (!def.dropChance || Math.random() < def.dropChance) {
      var range = def.recompenseRange || [{ qty: 1, weight: 100 }];
      var selectedRange = resoudreRecompenseTable(range);
      var rangeQty = tryDoubleReward(selectedRange.qty, sc.kittyIndex);
      var rangeActualQty = limiterRecompenseScouting(scoutingId, def.recompense, rangeQty, sc.kittyIndex);
      var rangeMultiplier = multiplicateurRecompenseScoutingApplique(selectedRange.qty, rangeActualQty);
      ajouterAuButinScouting(butin, def.recompense, rangeActualQty, categorieRecompenseScouting(range, selectedRange), rangeMultiplier);
    }
  }
  if (dailySuccesses > 0 && typeof enregistrerSuccesScoutingQuotidien === "function") enregistrerSuccesScoutingQuotidien(dailySuccesses);
  ajouterLog("event", runCount + " scouting run" + (runCount === 1 ? "" : "s") + " completed for " + def.nom + ". Rewards are waiting on the map.");
  // Auto-restart with the same kitty while preserving any elapsed remainder.
  var restartDuree = scoutingHalveTime(sc.kittyIndex) ? def.duree / 2 : def.duree;
  etat.scoutingsEnCours[scoutingId] = {
    kittyIndex: sc.kittyIndex,
    power: kittyEP(sc.kittyIndex),
    startTs: sc.startTs + runCount * ((sc.duree !== undefined) ? sc.duree : def.duree) * 1000,
    duree: restartDuree
  };
  carteDirty = true;
  exploTabDirty = true;
}

function scoutingHalveTime(kittyIndex) {
  var k = etat.kittiesData[kittyIndex];
  return Boolean(k && k.metier === 'explorator');
}

function assignerKittyScouting(scoutingId, kittyIndex) {
  if (!autoriserActionTableOperationsCamp() || estBernardoSuperviseur(kittyIndex)) return false;
  if (etat.scoutingsEnCours[scoutingId] || !etat.kittiesData[kittyIndex] || kittyIsBusy(kittyIndex)) return false;
  var def = CONFIG.scoutings[scoutingId];
  var duree = def ? (scoutingHalveTime(kittyIndex) ? def.duree / 2 : def.duree) : 120;
  etat.scoutingsEnCours[scoutingId] = { kittyIndex: kittyIndex, power: kittyEP(kittyIndex), startTs: Date.now(), duree: duree };
  // The map badge is derived from the persisted running-scouting state. Mark
  // the map dirty and refresh it immediately so the zone turns green without
  // waiting for a reload or the next game tick.
  carteDirty = true;
  exploTabDirty = true;
  sauvegarder();
  renduCarte(unlocks());
  renderCampaignCards();
  return true;
}

function retirerKittyScouting(scoutingId) {
  delete etat.scoutingsEnCours[scoutingId];
  carteDirty = true;
  exploTabDirty = true;
  sauvegarder();
  renduCarte(unlocks());
  renderCampaignCards();
}

function retirerScoutingStaging(scoutingId) {
  delete scoutingsStagingKitty[scoutingId];
  exploTabDirty = true;
  renderCampaignCards();
}

function lancerScouting(scoutingId) {
  var ki = scoutingsStagingKitty[scoutingId];
  if (ki === undefined) return;
  delete scoutingsStagingKitty[scoutingId];
  assignerKittyScouting(scoutingId, ki);
}

function cardboardBoxesActivesCampPrototype() {
  const construites = etat.cathouses.length;
  if (typeof connexionsCampPrototypeActuelles !== "function") {
    return construites;
  }
  const connexions = connexionsCampPrototypeActuelles();
  const connectees = campPrototypeLayout.filter(function(item) {
    return item.type === "cardboardBox"
      && item.construit === true
      && connexions.byItem[item.uid]
      && connexions.byItem[item.uid].active;
  }).length;
  return Math.min(construites, connectees);
}

const CAMP_BASE_HOUSING_CAPACITY = 4;
const CAMP_HOUSING_CAPACITY = Object.freeze({
  cardboardBox: 1,
  woodCathouse: 2,
  stoneCathouse: 3,
  solidStoneCathouse: 4
});

function capaciteLogementCamp() {
  const capaciteMaisons = cardboardBoxesActivesCampPrototype() * CAMP_HOUSING_CAPACITY.cardboardBox
    // These three legacy counters keep imported V3 saves playable until their
    // matching visual Camp assets are migrated to placed instances.
    + Math.max(0, Number(etat.cathouseCount) || 0) * CAMP_HOUSING_CAPACITY.woodCathouse
    + Math.max(0, Number(etat.stoneCathouseCount) || 0) * CAMP_HOUSING_CAPACITY.stoneCathouse
    + Math.max(0, Number(etat.solidStoneCathouseCount) || 0) * CAMP_HOUSING_CAPACITY.solidStoneCathouse;
  return CAMP_BASE_HOUSING_CAPACITY + capaciteMaisons
    + bonusCapaciteLogementBuilder(capaciteMaisons);
}

function bonusCapaciteLogementBuilder(capaciteMaisons) {
  const builder = managerKittyForFamily("houses");
  if (!builder) return 0;
  const boites = cardboardBoxesActivesCampPrototype();
  const maisonsBois = Math.max(0, Number(etat.cathouseCount) || 0);
  return Math.floor(Math.max(0, capaciteMaisons) * (managerSpeedMultiplier(builder, "houses") - 1))
    + (spherePerkLearned("builder-box-boost") ? Math.floor(boites / 3) : 0)
    + (spherePerkLearned("builder-box-speed") ? boites : 0)
    + (spherePerkLearned("builder-wood-speed") ? maisonsBois * 2 : 0);
}

function bonusPourcentageCapaciteBuilder() {
  return (spherePerkLearned("builder-speed") ? 25 : 0)
    + (spherePerkLearned("builder-speed-2") ? 25 : 0)
    + (spherePerkLearned("builder-speed-3") ? 25 : 0);
}

function placesLogementLibresCamp() {
  return Math.max(0, capaciteLogementCamp() - Math.max(0, Number(etat.chatons) || 0));
}

function campLogementSature() {
  return placesLogementLibresCamp() <= 0;
}

function recrutementDepuisCampDebloque() {
  return etat.chatons < 3 || batimentCampRepare("sawmill");
}

function annulerArriveeChatQuatreAvantSawmill() {
  if (etat.chatons !== 3 || batimentCampRepare("sawmill") || !etat.sequenceEnCours) return false;
  etat.sequenceEnCours = false;
  etat.sequenceDebutTs = 0;
  etat.sequenceDuree = 0;
  etat.sequenceProgressBrute = 0;
  etat.sequenceDerniereMajTs = 0;
  etat.sequenceVitesseDerniere = 0;
  return true;
}

let campRecruitCapacityMessageTimer = null;

function masquerMessageCapaciteRecrutementCamp() {
  const message = document.getElementById("camp-recruit-capacity-message");
  if (campRecruitCapacityMessageTimer) clearTimeout(campRecruitCapacityMessageTimer);
  campRecruitCapacityMessageTimer = null;
  if (message) {
    message.hidden = true;
    const plot = message.closest(".camp-prototype-house-plot");
    if (plot) plot.classList.remove("camp-recruit-capacity-visible");
  }
}

function afficherMessageCapaciteRecrutementCamp() {
  const message = document.getElementById("camp-recruit-capacity-message");
  if (!message) return false;
  message.textContent = "Camp full: " + etat.chatons + " / " + capaciteLogementCamp()
    + ". Build and connect a Cardboard Box to welcome this Cat.";
  message.hidden = false;
  const plot = message.closest(".camp-prototype-house-plot");
  if (plot) plot.classList.add("camp-recruit-capacity-visible");
  if (campRecruitCapacityMessageTimer) clearTimeout(campRecruitCapacityMessageTimer);
  campRecruitCapacityMessageTimer = setTimeout(function() {
    message.hidden = true;
    if (plot) plot.classList.remove("camp-recruit-capacity-visible");
    campRecruitCapacityMessageTimer = null;
  }, 5000);
  return true;
}

function expliquerCampPleinRecrutement() {
  if (!storyEstVue("storyCampFullVue")) {
    marquerStoryVue("storyCampFullVue");
    ajouterLog("unlock", "Cardboard Box unlocked after the Gang ran out of room under the porch.");
    afficherNotification("Cardboard Box unlocked. Build and connect one to welcome another Cat.");
    renduCampPrototype();
    afficherModal("ecran-story-camp-full");
    renduStories();
    return true;
  }
  return afficherMessageCapaciteRecrutementCamp();
}

// Passive bonus from the Gang Leader: scales with total cat count + leader's own level.
// Applies as a global multiplier to all Work tab worker progress.
function gangLeaderBonus() {
  const gl = etat.kittiesData.find(function(k) { return k.metier === "gang-leader"; });
  if (!gl) return 1;
  const n = etat.kittiesData.length;
  if (n <= 1) return 1;
  const catBonus = Math.pow(n - 1, 1.3) * 0.015;
  return 1 + catBonus * (1 + gl.niveau * 0.12);
}

function gangLeaderPerksHtml(kittyIndex) {
  if (!etat.spherePerks) return "";
  var html = "";
  if (etat.spherePerks['gl-qol'] === 'learned') {
    html += "<div class='detail-job-bonus'>Food Management unlocked (perk)</div>";
  }
  if (etat.spherePerks['gl-daily-1'] === 'learned') {
    html += "<div class='detail-job-bonus'><span class='bonus-var'>×" + recompenseQuetesQuotidiennes() + "</span> Daily Quest reward (perk)</div>";
  }
  if (etat.spherePerks['gl-rec'] === 'learned') {
    html += "<div class='detail-job-bonus'><span class='bonus-var'>+" + bonusAttractiviteBernardo() + "</span> Camp Appeal (perk)</div>";
  }
  if (etat.spherePerks['gl-mini'] === 'learned') {
    html += "<div class='detail-job-bonus'><span class='bonus-var'>×" + manualFocusMultiplier() + "</span> Manual Focus power (perk)</div>";
  }
  if (etat.spherePerks['gl-manual-capacity'] === 'learned') {
    html += "<div class='detail-job-bonus'><span class='bonus-var'>" + manualFocusMaxSeconds() + "s</span> Manual Focus capacity (perk)</div>";
  }
  if (etat.spherePerks['gl-manual-click'] === 'learned') {
    html += "<div class='detail-job-bonus'><span class='bonus-var'>" + manualFocusSecondsPerClick() + "s</span> Manual Focus per click (perk)</div>";
  }
  return html;
}

function vitesseAttrapage() {
  // Arrival duration already includes difficulty and Camp Appeal. Houses only
  // provide capacity and never accelerate recruitment.
  return 1;
}

// XP / leveling
const FOOD_XP = { salads: 1, grilledAnchovy: 10, humanLeftovers: 1, humanWorkersFood: 15 };
const GATHER_LEVEL_MULTIPLIER = 1.05;
// Global level ceiling. Keep this in one place so every XP source (food,
// offline progression and future systems) shares the same maximum.
const MAX_CAT_LEVEL = 100;

function xpPourNiveau(n) {
  return Math.max(n + 1, Math.ceil(Math.pow(n, 1.7)));
}

function productionParChaton(action) {
  return 1;
}

// Production engine lives in js/core/production.js.
const productionProcBonus = globalThis.CatInc.production.productionProcBonus;
const avancerRecetteSlot = globalThis.CatInc.production.avancerRecetteSlot;

// 5% bonus per level, multiplicative — amplifies every job effect
function jobLevelMultiplier(kitty) {
  return Math.pow(1.05, kitty ? kitty.niveau : 0);
}

// Each family (raw gathering OR its processed output) has its own independent manager
const MAP_FAMILLE = {
  woodcatting: "wood", basicWoodcatting: "wood",
  grasscatting: "food", fishcatting: "food",
  sawmill: "sawmill",
  catchen: "catchen", grilledAnchovy: "catchen",
  pebblegathering: "rock", rockgathering: "rock",
  brickfactory: "pawsonry", rockFactory: "pawsonry"
};
const METIER_PAR_FAMILLE = { wood: ["lumberjack"], food: ["farmer"], sawmill: ["carpenter"], catchen: ["chef"], rock: ["miner"], pawsonry: ["stonemason"], houses: ["builder"] };
const ENGINEER_JOB_ID = "camp-engineer";
const ENGINEER_TRAINING_DURATIONS = [7200, 14400, 28800, 43200, 57600, 72000, 86400];
const ENGINEER_RANKS = Object.freeze({
  "camp-engineer": Object.freeze({
    1: Object.freeze({ maxLevel: Infinity, help: "AFK Timer Bonus by 6 minutes per level", type: "afk-cap-minutes", value: 6 }),
    2: Object.freeze({ maxLevel: 100, help: "Increase AFK Ratio by 0.5% per level", type: "afk-ratio-percent", value: 0.5 })
  })
});

function estIngenieur(kitty) {
  return !!(kitty && kitty.metier && METIERS[kitty.metier] && METIERS[kitty.metier].engineer);
}

function ingenieursFormes() {
  return (etat.kittiesData || []).filter(estIngenieur);
}

function ingenieursDuMetier(metierId) {
  return (etat.kittiesData || []).filter(function(kitty) { return kitty && kitty.metier === metierId; });
}

function rangIngenieurSuivant(metierId) {
  return ingenieursDuMetier(metierId).reduce(function(maxRank, kitty) {
    return Math.max(maxRank, Number(kitty.engineerRank) || 1);
  }, 0) + 1;
}

function rangIngenieurInfo(kitty) {
  const ranks = kitty && ENGINEER_RANKS[kitty.metier];
  if (!ranks) return null;
  return ranks[Math.max(1, Number(kitty.engineerRank) || 1)] || ranks[1] || null;
}

function niveauMaxChat(kitty) {
  const info = rangIngenieurInfo(kitty);
  // Engineer ranks may define a lower ceiling in the future, but no Cat can
  // ever exceed the global cap.
  return info && Number.isFinite(info.maxLevel)
    ? Math.min(MAX_CAT_LEVEL, info.maxLevel)
    : MAX_CAT_LEVEL;
}

function ingenieurPeutEtreForme(metierId) {
  const rangs = ENGINEER_RANKS[metierId];
  const dejaFormes = ingenieursDuMetier(metierId).length;
  if (!etat.engineerRankUpgradesDebloques) return dejaFormes === 0;
  return !!rangs && dejaFormes < Object.keys(rangs).length;
}

function laboratoireIngenieurDuree() {
  return ENGINEER_TRAINING_DURATIONS[Math.min(ENGINEER_TRAINING_DURATIONS.length - 1, ingenieursFormes().length)] || ENGINEER_TRAINING_DURATIONS[0];
}

function gangSousOngletsDebloques() {
  return ingenieursFormes().length > 0;
}
const MANAGER_SPHERE_PERKS = {
  wood: { production: 'lj-prod', production2: 'lj-prod-2', speed: 'lj-speed', speed2: 'lj-speed-2', slot: 'lj-slot', recipeFamily: 'wood' },
  food: { production: 'farmer-prod', production2: 'farmer-prod-2', speed: 'farmer-speed', speed2: 'farmer-speed-2', slot: 'farmer-slot', recipeFamily: 'food' },
  rock: { production: 'miner-prod', production2: 'miner-prod-2', speed: 'miner-speed', speed2: 'miner-speed-2', slot: 'miner-slot', recipeFamily: 'rock' },
  sawmill: { cost: 'carpenter-cost', cost2: 'carpenter-cost-2', speed: 'carpenter-speed', speed2: 'carpenter-speed-2', slot: 'carpenter-slot', recipeFamily: 'wood' },
  catchen: { cost: 'chef-cost', cost2: 'chef-cost-2', speed: 'chef-speed', speed2: 'chef-speed-2', slot: 'chef-slot', recipeFamily: 'food' },
  pawsonry: { cost: 'stonemason-cost', cost2: 'stonemason-cost-2', speed: 'stonemason-speed', speed2: 'stonemason-speed-2', slot: 'stonemason-slot', recipeFamily: 'rock' },
  houses: {
    auto: 'builder-auto',
    perfect1: 'builder-perfect-1',
    perfect2: 'builder-perfect-2',
    formula: 'builder-cost',
    formula2: 'builder-expo-2',
    formula3: 'builder-expo-3',
    houseCost: 'builder-cost-half-1',
    houseCost2: 'builder-cost-half-2',
    boxBoost: 'builder-box-boost',
    speed: 'builder-speed',
    speed2: 'builder-speed-2',
    speed3: 'builder-speed-3',
    boxSpeed: 'builder-box-speed',
    woodSpeed: 'builder-wood-speed'
  }
};

function spherePerkLearned(perkId) {
  return !!(perkId && etat.spherePerks && etat.spherePerks[perkId] === 'learned');
}

function managerSpeedMultiplier(kitty, famille) {
  const base = (kitty.managerMult || 1.5) * jobLevelMultiplier(kitty);
  const perks = MANAGER_SPHERE_PERKS[famille];
  if (!perks) return base;
  const boost = (spherePerkLearned(perks.speed) ? 0.25 : 0)
    + (spherePerkLearned(perks.speed2) ? 0.25 : 0)
    + (spherePerkLearned(perks.speed3) ? 0.25 : 0);
  return base * (1 + boost);
}

function managerProductionMultiplier(famille) {
  const perks = MANAGER_SPHERE_PERKS[famille];
  if (!perks) return 1;
  return 1 + (spherePerkLearned(perks.production) ? 0.25 : 0)
    + (spherePerkLearned(perks.production2) ? 0.25 : 0);
}

function managerCostMultiplier(famille) {
  const perks = MANAGER_SPHERE_PERKS[famille];
  if (!perks) return 1;
  if (spherePerkLearned(perks.cost2)) return 0.6;
  return spherePerkLearned(perks.cost) ? 0.8 : 1;
}

function managerSphereStateKey(famille) {
  const perks = MANAGER_SPHERE_PERKS[famille];
  if (!perks) return "";
  return (spherePerkLearned(perks.production) ? "prod" : "")
    + (spherePerkLearned(perks.production2) ? "prod2" : "")
    + (spherePerkLearned(perks.speed) ? "speed" : "")
    + (spherePerkLearned(perks.speed2) ? "speed2" : "")
    + (spherePerkLearned(perks.speed3) ? "speed3" : "")
    + (spherePerkLearned(perks.cost) ? "cost" : "")
    + (spherePerkLearned(perks.cost2) ? "cost2" : "")
    + (spherePerkLearned(perks.formula) ? "formula" : "")
    + (spherePerkLearned(perks.formula2) ? "formula2" : "")
    + (spherePerkLearned(perks.formula3) ? "formula3" : "")
    + (spherePerkLearned(perks.houseCost) ? "houseCost" : "")
    + (spherePerkLearned(perks.houseCost2) ? "houseCost2" : "")
    + (spherePerkLearned(perks.perfect1) ? "perfect1" : "")
    + (spherePerkLearned(perks.perfect2) ? "perfect2" : "")
    + (spherePerkLearned(perks.boxBoost) ? "boxBoost" : "")
    + (spherePerkLearned(perks.boxSpeed) ? "boxSpeed" : "")
    + (spherePerkLearned(perks.woodSpeed) ? "woodSpeed" : "")
    + (spherePerkLearned(perks.slot) ? "slot" : "");
}

function managerPerksHtml(famille, className, hideHouseBuildPerks) {
  const perks = MANAGER_SPHERE_PERKS[famille];
  if (!perks) return "";
  const cls = className || "manager-perk-txt";
  let html = "";
  if (famille === "houses") {
    if (!hideHouseBuildPerks) {
      if (spherePerkLearned(perks.auto)) {
        html += '<span class="' + cls + '">Auto Build Wood Houses (perk)</span>';
      }
      if (spherePerkLearned(perks.perfect1)) {
        html += '<span class="' + cls + '">Free Cardboard Boxes with Auto Build (perk)</span>';
      }
      if (spherePerkLearned(perks.perfect2)) {
        html += '<span class="' + cls + '">Free Wood Cathouses with Auto Build (perk)</span>';
      }
      if (spherePerkLearned(perks.formula)) {
        html += '<span class="' + cls + '"><span class="bonus-var">' + woodHouseCostExponent() + '^n</span> house cost exponent (perk)</span>';
      }
      if (spherePerkLearned(perks.houseCost)) {
        html += '<span class="' + cls + '"><span class="bonus-var">×' + woodHouseCostMultiplier() + '</span> Wood House cost (perk)</span>';
      }
    }
    if (spherePerkLearned(perks.speed)) {
      html += '<span class="' + cls + '"><span class="bonus-var">+' + bonusPourcentageCapaciteBuilder() + '%</span> Builder housing capacity (perk)</span>';
    }
    if (spherePerkLearned(perks.boxBoost)) {
      html += '<span class="' + cls + '"><span class="bonus-var">+1</span> capacity per 3 connected Cardboard Boxes (perk)</span>';
    }
    if (spherePerkLearned(perks.boxSpeed)) {
      html += '<span class="' + cls + '"><span class="bonus-var">+1</span> capacity per connected Cardboard Box (perk)</span>';
    }
    if (spherePerkLearned(perks.woodSpeed)) {
      html += '<span class="' + cls + '"><span class="bonus-var">+2</span> capacity per Wood Cathouse (perk)</span>';
    }
    return html;
  }
  if (spherePerkLearned(perks.production)) {
    html += '<span class="' + cls + '"><span class="bonus-var">×1.25</span> production quantity (perk)</span>';
  }
  if (spherePerkLearned(perks.production2)) {
    html += '<span class="' + cls + '"><span class="bonus-var">×1.5</span> production quantity (perk)</span>';
  }
  if (spherePerkLearned(perks.cost)) {
    html += '<span class="' + cls + '"><span class="bonus-var">×0.8</span> gathering target (perk)</span>';
  }
  if (spherePerkLearned(perks.cost2)) {
    html += '<span class="' + cls + '"><span class="bonus-var">×0.6</span> gathering target (perk)</span>';
  }
  if (spherePerkLearned(perks.formula) && !hideHouseBuildPerks) {
    html += '<span class="' + cls + '">1.6^n house cost (perk)</span>';
  }
  if (spherePerkLearned(perks.auto) && !hideHouseBuildPerks) {
    html += '<span class="' + cls + '">Auto build Wood Houses (perk)</span>';
  }
  if (spherePerkLearned(perks.speed)) {
    html += '<span class="' + cls + '"><span class="bonus-var">×1.25</span> manager speed (perk)</span>';
  }
  if (spherePerkLearned(perks.speed2)) {
    html += '<span class="' + cls + '"><span class="bonus-var">×1.5</span> manager speed (perk)</span>';
  }
  if (spherePerkLearned(perks.slot) && perks.recipeFamily) {
    const familyLabel = WORK_FAMILIES[perks.recipeFamily] ? WORK_FAMILIES[perks.recipeFamily].label : perks.recipeFamily;
    html += '<span class="' + cls + '">+1 ' + familyLabel + ' recipe slot (perk)</span>';
  }
  return html;
}

function synchroniserSlotsRecettesAvecPerks() {
  if (!etat.workRecipeSlots) etat.workRecipeSlots = {};
  let changed = false;
  Object.keys(WORK_FAMILIES).forEach(function(recipeFamily) {
    let slots = Array.isArray(etat.workRecipeSlots[recipeFamily]) ? etat.workRecipeSlots[recipeFamily] : [];
    while (slots.length < 2) {
      slots.push(stateCore.makeWorkRecipeSlot());
      changed = true;
    }
    const extraSlots = Object.keys(MANAGER_SPHERE_PERKS).reduce(function(total, managerFamily) {
      const perks = MANAGER_SPHERE_PERKS[managerFamily];
      return total + (perks.recipeFamily === recipeFamily && spherePerkLearned(perks.slot) ? 1 : 0);
    }, 0);
    const targetCount = 2 + extraSlots;
    while (slots.length < targetCount) {
      slots.push(stateCore.makeWorkRecipeSlot());
      changed = true;
    }
    etat.workRecipeSlots[recipeFamily] = slots;
  });
  return changed;
}

function managerKittyForFamily(famille) {
  if (!famille || !METIER_PAR_FAMILLE[famille]) return null;
  if (typeof batimentFonctionnelCamp === "function"
      && !batimentFonctionnelCamp("jobCenter").available) return null;
  const managerIdx = etat.managers[famille];
  if (managerIdx === null || managerIdx === undefined) return null;
  const kitty = etat.kittiesData[managerIdx];
  return kitty && METIER_PAR_FAMILLE[famille].includes(kitty.metier) ? kitty : null;
}

function multiplicateurFamille(action) {
  const famille = MAP_FAMILLE[action];
  if (!famille) return 1;
  const kitty = managerKittyForFamily(famille);
  return kitty ? managerSpeedMultiplier(kitty, famille) : 1;
}

function multiplicateurProductionFamille(action) {
  const famille = MAP_FAMILLE[action];
  return managerKittyForFamily(famille) ? managerProductionMultiplier(famille) : 1;
}

function multiplicateurCoutFamille(action) {
  const famille = MAP_FAMILLE[action];
  return managerKittyForFamily(famille) ? managerCostMultiplier(famille) : 1;
}

const RECRUITMENT_FORMULA_VERSION = 1;
const CAMP_APPEAL_DECORATION_VALUES = Object.freeze({
  tree: 2,
  catToy: 3
});

function decorationsAppealDebloquees() {
  return campPrototypeLayout.some(function(item) {
    const type = item && item.construit !== false ? typeCampPrototype(item.type) : null;
    return type && type.category === "decoration";
  });
}

function territoireAppealDebloque() {
  return explorationCampFonctionnelle();
}

function scoreDecorationsCamp() {
  if (!decorationsAppealDebloquees()) return 0;
  return campPrototypeLayout.reduce(function(total, item) {
    if (!item || item.construit === false) return total;
    const type = typeCampPrototype(item.type);
    if (!type || type.category !== "decoration") return total;
    if (!decorationAccessibleDepuisCamp(item)) return total;
    return total + (CAMP_APPEAL_DECORATION_VALUES[item.type] || 1);
  }, 0);
}

function scoreInfluenceTerritoire() {
  if (!territoireAppealDebloque()) return 0;
  return (Array.isArray(etat.zonesExplorees) ? etat.zonesExplorees : []).filter(function(zoneId) {
    return zoneId && zoneId !== "D1";
  }).length * 4;
}

function bonusAttractiviteBernardo() {
  if (!etat.spherePerks || etat.spherePerks["gl-rec"] !== "learned") return 0;
  return etat.spherePerks["gl-rec-2"] === "learned" ? 6 : 3;
}

function valeurPrestigeKitty(kitty) {
  if (!kitty) return 0;
  return Math.floor(Math.max(0, Number(kitty.niveau) || 0) / 5)
    + Math.max(0, Number(kitty.tier) || 0);
}

function scorePrestigeGang() {
  const meilleurs = etat.kittiesData.map(function(kitty) {
    return valeurPrestigeKitty(kitty);
  }).sort(function(a, b) { return b - a; }).slice(0, 3);
  return meilleurs.reduce(function(total, score) { return total + score; }, 0)
    + bonusAttractiviteBernardo();
}

function scoreAttractiviteCamp() {
  const decorations = scoreDecorationsCamp();
  const territoire = scoreInfluenceTerritoire();
  const prestige = scorePrestigeGang();
  return {
    decorations: decorations,
    territoire: territoire,
    prestige: prestige,
    total: decorations + territoire + prestige
  };
}

function detailsAttractiviteCamp() {
  const decorations = campPrototypeLayout.filter(function(item) {
    const type = item && item.construit !== false ? typeCampPrototype(item.type) : null;
    return type && type.category === "decoration";
  }).map(function(item) {
    const type = typeCampPrototype(item.type);
    const accessible = decorationAccessibleDepuisCamp(item);
    return {
      label: (type ? type.label : item.type) + (accessible ? "" : " (not connected)"),
      value: accessible ? (CAMP_APPEAL_DECORATION_VALUES[item.type] || 1) : 0
    };
  });
  const territoire = (Array.isArray(etat.zonesExplorees) ? etat.zonesExplorees : [])
    .filter(function(zoneId) { return zoneId && zoneId !== "D1"; })
    .map(function(zoneId) { return { label: "Explored territory " + zoneId, value: 4 }; });
  const prestige = etat.kittiesData.map(function(kitty) {
    if (!kitty) return null;
    return {
      label: kitty.nom || "Cat",
      value: valeurPrestigeKitty(kitty)
    };
  }).filter(Boolean).sort(function(a, b) { return b.value - a.value; }).slice(0, 3);
  const bernardo = bonusAttractiviteBernardo();
  if (bernardo > 0) prestige.push({ label: "Bernardo reputation perk", value: bernardo });
  return { decorations: decorations, territoire: territoire, prestige: prestige };
}

function renduDetailsAttractiviteCamp() {
  const panneau = document.getElementById("camp-appeal-details");
  if (!panneau || panneau.hidden) return;
  const score = scoreAttractiviteCamp();
  const details = detailsAttractiviteCamp();
  const sections = [{ label: "Cat prestige", value: score.prestige, items: details.prestige }];
  if (decorationsAppealDebloquees()) {
    sections.push({ label: "Decorations", value: score.decorations, items: details.decorations });
  }
  if (territoireAppealDebloque()) {
    sections.push({ label: "Territory influence", value: score.territoire, items: details.territoire });
  }
  panneau.innerHTML = '<strong>Appeal ' + score.total + '</strong>'
    + sections.map(function(section) {
      return '<span class="camp-appeal-detail-section"><b>' + section.label
        + '<em>+' + section.value + '</em></b>'
        + (section.items.length
          ? '<span>' + section.items.map(function(item) {
              return '<i>' + echapperAttributHtml(item.label) + '<em>+' + item.value + '</em></i>';
            }).join("") + '</span>'
          : '<i class="camp-appeal-detail-empty">Nothing included yet</i>')
        + '</span>';
    }).join("");
  positionnerDetailsAttractiviteCamp();
}

function positionnerDetailsAttractiviteCamp() {
  const bouton = document.getElementById("camp-appeal-summary");
  const panneau = document.getElementById("camp-appeal-details");
  if (!bouton || !panneau || panneau.hidden || typeof window === "undefined") return;
  if (panneau.parentElement !== document.body) document.body.appendChild(panneau);
  const marge = 8;
  const rect = bouton.getBoundingClientRect();
  const largeur = Math.min(330, Math.max(220, window.innerWidth - marge * 2));
  const gauche = Math.min(
    window.innerWidth - largeur - marge,
    Math.max(marge, rect.left + rect.width / 2 - largeur / 2)
  );
  panneau.style.width = largeur + "px";
  panneau.style.left = gauche + "px";
  panneau.style.top = Math.min(window.innerHeight - marge, rect.bottom + 8) + "px";
  panneau.style.transform = "none";
}

function toggleDetailsAttractiviteCamp(event) {
  if (event) {
    event.preventDefault();
    event.stopPropagation();
  }
  const bouton = document.getElementById("camp-appeal-summary");
  const panneau = document.getElementById("camp-appeal-details");
  if (!bouton || !panneau) return;
  panneau.hidden = !panneau.hidden;
  bouton.setAttribute("aria-expanded", panneau.hidden ? "false" : "true");
  renduDetailsAttractiviteCamp();
}

if (typeof document !== "undefined") {
  document.addEventListener("click", function(event) {
    const panneau = document.getElementById("camp-appeal-details");
    if (!panneau || panneau.hidden
        || event.target.closest(".camp-appeal-wrap, #camp-appeal-details")) return;
    panneau.hidden = true;
    const bouton = document.getElementById("camp-appeal-summary");
    if (bouton) bouton.setAttribute("aria-expanded", "false");
  });
  window.addEventListener("resize", positionnerDetailsAttractiviteCamp);
}

function niveauDifficulteRecrutement() {
  return Math.max(1, etat.chatons - 2);
}

const RECRUITMENT_APPEAL_SPEED_PER_POINT = 0.1;

function dureeReferenceRecrutementV3(nombreChatsPresents) {
  const n = Math.max(0, Math.floor(Number(nombreChatsPresents) || 0));
  if (n <= 10) return 5 * Math.pow(3, n);
  if (n <= 15) return 5 * Math.pow(3, 10) * Math.pow(2, n - 10);
  return 5 * Math.pow(3, 10) * Math.pow(2, 5) * Math.pow(1.5, n - 15);
}

function multiplicateurVitesseAppealCamp(appeal) {
  return 1 + Math.max(0, Number(appeal) || 0) * RECRUITMENT_APPEAL_SPEED_PER_POINT;
}

function calculRecrutementCamp() {
  const niveau = niveauDifficulteRecrutement();
  const attractivite = scoreAttractiviteCamp();
  const tempsReference = dureeReferenceRecrutementV3(etat.chatons);
  const multiplicateurAppeal = multiplicateurVitesseAppealCamp(attractivite.total);
  return {
    niveau: niveau,
    attractivite: attractivite,
    tempsReference: tempsReference,
    multiplicateurAppeal: multiplicateurAppeal,
    dureeArrivee: Math.max(1, tempsReference / multiplicateurAppeal)
  };
}

function dureeBrute() {
  if (etat.chatons < 3) return [5, 15, 30][etat.chatons] || 30;
  return calculRecrutementCamp().dureeArrivee;
}
function dureeEffective() { return Math.max(1, dureeBrute() / vitesseAttrapage()); }

// Integrate the catch/recruit cooldown as a sequence of speed segments. This
// is important when a house or manager is added during an active cycle: the
// speed that was active before the change consumes only the elapsed time up
// to the change, while the new speed consumes the remaining raw time.
function vitesseSequenceEffective() {
  const devSpeed = (typeof vitesse === "number" && Number.isFinite(vitesse) && vitesse > 0) ? vitesse : 1;
  return Math.max(0.000001, vitesseAttrapage() * devSpeed);
}

function synchroniserDureeArriveeCamp() {
  if (!etat.sequenceEnCours) return false;
  const ancienneDuree = Math.max(0, Number(etat.sequenceDuree) || 0);
  const nouvelleDuree = Math.max(0, dureeBrute());
  if (Math.abs(nouvelleDuree - ancienneDuree) < 0.001) return false;
  const progression = ancienneDuree > 0
    ? Math.min(1, Math.max(0, Number(etat.sequenceProgressBrute) || 0) / ancienneDuree)
    : 0;
  etat.sequenceDuree = nouvelleDuree;
  etat.sequenceProgressBrute = nouvelleDuree * progression;
  return true;
}

function actualiserProgressionSequence(maintenant) {
  if (!etat.sequenceEnCours) return;
  const maintenantTs = Number.isFinite(maintenant) ? maintenant : Date.now();
  const duree = Math.max(0, Number(etat.sequenceDuree) || 0);

  // Saves created before segmented progress existed only have a start time.
  // Preserve their current visible progress once, then continue with the new
  // non-retroactive model from this point onward.
  if (!Number.isFinite(etat.sequenceDerniereMajTs) || etat.sequenceDerniereMajTs <= 0) {
    const debut = Number.isFinite(etat.sequenceDebutTs) && etat.sequenceDebutTs > 0
      ? etat.sequenceDebutTs
      : maintenantTs;
    const elapsed = Math.max(0, (maintenantTs - debut) / 1000);
    const currentSpeed = vitesseSequenceEffective();
    etat.sequenceProgressBrute = Math.min(duree, Math.max(0, elapsed * currentSpeed));
    etat.sequenceDerniereMajTs = maintenantTs;
    etat.sequenceVitesseDerniere = currentSpeed;
    synchroniserDureeArriveeCamp();
    return;
  }

  const dernierTs = etat.sequenceDerniereMajTs;
  const elapsed = Math.max(0, (maintenantTs - dernierTs) / 1000);
  const previousSpeed = Number.isFinite(etat.sequenceVitesseDerniere) && etat.sequenceVitesseDerniere > 0
    ? etat.sequenceVitesseDerniere
    : vitesseSequenceEffective();
  const progress = Number.isFinite(etat.sequenceProgressBrute) ? etat.sequenceProgressBrute : 0;
  etat.sequenceProgressBrute = Math.min(duree, Math.max(0, progress) + elapsed * previousSpeed);
  etat.sequenceDerniereMajTs = maintenantTs;
  etat.sequenceVitesseDerniere = vitesseSequenceEffective();
  synchroniserDureeArriveeCamp();
}

function tempsRestantSequence() {
  if (!etat.sequenceEnCours) return 0;
  actualiserProgressionSequence();
  return Math.max(0, etat.sequenceDuree - etat.sequenceProgressBrute);
}

function progressionSequence() {
  if (!etat.sequenceEnCours) return 1;
  actualiserProgressionSequence();
  return etat.sequenceDuree > 0
    ? Math.min(1, Math.max(0, etat.sequenceProgressBrute) / etat.sequenceDuree)
    : 1;
}

function recupererButinScouting(scoutingId) {
  const butin = etat.butinsScouting[scoutingId];
  if (!butin) return;
  if (!autoriserActionTableOperationsCamp()) return false;
  const recompenses = Object.keys(butin.rewards || {}).map(function(recompenseId) {
    return { recompense: recompenseId, qty: Number(butin.rewards[recompenseId]) || 0 };
  });
  if (!autoriserEntreeStockageRecompenses(recompenses)) return false;
  const rewardReady = Object.keys(butin.rewards).some(function(recompenseId) {
    return Number(butin.rewards[recompenseId]) > 0;
  });
  if (rewardReady && typeof jouerSonRewardChest === "function") jouerSonRewardChest();
  Object.keys(butin.rewards).forEach(function(recompenseId) {
    appliquerRecompense(recompenseId, butin.rewards[recompenseId]);
  });
  const totalRuns = butin.successful + butin.failed;
  ajouterLog("event", "Scouting rewards claimed after " + totalRuns + " run" + (totalRuns === 1 ? "" : "s") + ".");
  delete etat.butinsScouting[scoutingId];
  carteDirty = true;
  exploTabDirty = true;
  sauvegarder(); rendu();
  return true;
}

function recupererButinsScoutingZone(zoneId) {
  scoutingIdsAvecButinZone(zoneId).forEach(function(scoutingId) {
    recupererButinScouting(scoutingId);
  });
}

function donneesResumeButinsScoutingZone(zoneId) {
  const totals = { successful: 0, failed: 0, regular: 0, lucky: 0, superLucky: 0, doubled: 0, tripled: 0, rewards: {} };
  const ids = scoutingIdsAvecButinZone(zoneId);
  ids.forEach(function(scoutingId) {
    const butin = etat.butinsScouting[scoutingId];
    if (!butin) return;
    totals.successful += Number(butin.successful) || 0;
    totals.failed += Number(butin.failed) || 0;
    totals.regular += Number(butin.regular) || 0;
    totals.lucky += Number(butin.lucky) || 0;
    totals.superLucky += Number(butin.superLucky) || 0;
    totals.doubled += Number(butin.doubled) || 0;
    totals.tripled += Number(butin.tripled) || 0;
    Object.keys(butin.rewards || {}).forEach(function(recompenseId) {
      totals.rewards[recompenseId] = (totals.rewards[recompenseId] || 0) + (Number(butin.rewards[recompenseId]) || 0);
    });
  });
  return { ids: ids, totals: totals };
}

function renduPopupButinsScoutingZone(zoneId) {
  const content = document.getElementById("scouting-reward-summary-content");
  if (!content) return;
  const data = donneesResumeButinsScoutingZone(zoneId);
  const totals = data.totals;
  const rewardsText = Object.keys(totals.rewards).filter(function(recompenseId) {
    return totals.rewards[recompenseId] > 0;
  }).map(function(recompenseId) {
    return echapperAttributHtml(RESOURCE_DISPLAY_NAMES[recompenseId] || recompenseId) + ' ×' + formaterNombre(totals.rewards[recompenseId]);
  }).join(' · ');
  const extraLuck = (totals.doubled > 0 ? '<strong class="scouting-doubled">Doubled ' + totals.doubled + '</strong>' : '')
    + (totals.tripled > 0 ? '<strong class="scouting-tripled">Tripled ' + totals.tripled + '</strong>' : '');
  content.innerHTML = '<div class="scouting-accumulator scouting-reward-summary-accumulator">'
    + '<div class="scouting-runs"><span class="scouting-metric-label">Scouting Runs:</span><strong class="scouting-successful">Successful ' + totals.successful + '</strong><span class="scouting-failed">Failed ' + totals.failed + '</span></div>'
    + '<div class="scouting-luck"><span class="scouting-metric-label">Rewards Luck:</span><span>Regular ' + totals.regular + '</span><span class="scouting-lucky">Lucky ' + totals.lucky + '</span><strong class="scouting-super-lucky">Super Lucky ' + totals.superLucky + '</strong>' + extraLuck + '</div>'
    + '<div class="scouting-rewards">' + (rewardsText || 'No rewards collected yet') + '</div>'
    + '</div>';
}

function ouvrirPopupButinsScoutingZone(zoneId) {
  const modal = document.getElementById("scouting-reward-summary-modal");
  const data = donneesResumeButinsScoutingZone(zoneId);
  if (!modal || !data.ids.length) return;
  modal.dataset.zoneId = zoneId;
  renduPopupButinsScoutingZone(zoneId);
  const claimButton = document.getElementById("scouting-reward-summary-claim");
  if (claimButton) claimButton.setAttribute("aria-label", "Claim " + data.ids.length + " scouting " + (data.ids.length === 1 ? "reward" : "rewards"));
  ouvrirDialogueModal("scouting-reward-summary-modal", {
    dismissible: true,
    fermer: fermerPopupButinsScoutingZone,
    focusSelector: "#scouting-reward-summary-claim",
    returnFocusSelector: ".zone-info-mobile-reward"
  });
}

function fermerPopupButinsScoutingZone() {
  fermerDialogueModal("scouting-reward-summary-modal");
}

function recupererButinsScoutingZoneDepuisPopup() {
  const modal = document.getElementById("scouting-reward-summary-modal");
  const zoneId = modal && modal.dataset.zoneId;
  if (!zoneId) return;
  fermerPopupButinsScoutingZone();
  recupererButinsScoutingZone(zoneId);
}

function sequenceEstPrete() {
  return !etat.sequenceEnCours || tempsRestantSequence() <= 0;
}

function nomProchainChat() {
  return NOMS_KITTIES[etat.kittiesData.length] || ("Cat #" + (etat.kittiesData.length + 1));
}

function assurerVisageProchainChat() {
  if (!etat.prochainVisageChaton) {
    etat.prochainVisageChaton = assignerVisageChaton(nomProchainChat());
    sauvegarder();
  }
  return etat.prochainVisageChaton;
}

function demarrerRechargeCatch() {
  assurerVisageProchainChat();
  etat.sequenceEnCours = true;
  etat.sequenceDebutTs = Date.now();
  etat.sequenceDuree = dureeBrute();
  etat.sequenceProgressBrute = 0;
  etat.sequenceDerniereMajTs = etat.sequenceDebutTs;
  etat.sequenceVitesseDerniere = vitesseSequenceEffective();
}

function normaliserFormuleRecrutementCamp() {
  if (!etat.camp || etat.camp.recruitmentFormulaVersion >= RECRUITMENT_FORMULA_VERSION) return false;
  if (etat.sequenceEnCours) {
    const ancienneDuree = Math.max(0, Number(etat.sequenceDuree) || 0);
    const progression = ancienneDuree > 0
      ? Math.min(1, Math.max(0, Number(etat.sequenceProgressBrute) || 0) / ancienneDuree)
      : 0;
    etat.sequenceDuree = dureeBrute();
    etat.sequenceProgressBrute = etat.sequenceDuree * progression;
    etat.sequenceDerniereMajTs = Date.now();
    etat.sequenceVitesseDerniere = vitesseSequenceEffective();
  }
  etat.camp.recruitmentFormulaVersion = RECRUITMENT_FORMULA_VERSION;
  return true;
}

function marquerSequencePrete() {
  if (!etat.sequenceEnCours || tempsRestantSequence() > 0) return false;
  etat.sequenceEnCours = false;
  sauvegarder();
  return true;
}

function woodHouseCostExponent() {
  if (spherePerkLearned('builder-expo-3')) return 1.5;
  if (spherePerkLearned('builder-expo-2')) return 1.55;
  return spherePerkLearned('builder-cost') ? 1.6 : 1.7;
}

function woodHouseCostMultiplier() {
  if (spherePerkLearned('builder-cost-half-2')) return 0.25;
  return spherePerkLearned('builder-cost-half-1') ? 0.5 : 1;
}

function woodHouseCostForCount(count) {
  const exponentCost = Math.ceil(Math.pow(woodHouseCostExponent(), count));
  return Math.max(1, Math.ceil(exponentCost * woodHouseCostMultiplier()));
}

function coutProchaineCathouse() {
  return woodHouseCostForCount(nombreAssetsCampPlaces("cardboardBox"));
}

function coutProchaineCatHouse() {
  return woodHouseCostForCount(etat.cathouseCount);
}

function autoBuildWoodHousesIfNeeded() {
  if (!etat.autoBuildWoodHouses || !spherePerkLearned('builder-auto')) return 0;
  let construits = 0;
  while (construits < 1000) {
    let construitCettePasse = false;
    const coutCarton = coutProchaineCathouse();
    if (coutCarton * 2 < etat.cardboardPlanks) {
      if (!spherePerkLearned('builder-perfect-1')) {
        etat.cardboardPlanks -= coutCarton;
      }
      etat.cathouses.push(Date.now());
      construits += 1;
      construitCettePasse = true;
    }
    if (construits >= 1000) break;
    const coutBois = coutProchaineCatHouse();
    if (coutBois * 2 < etat.basicWoodPlanks) {
      if (!spherePerkLearned('builder-perfect-2')) {
        etat.basicWoodPlanks -= coutBois;
      }
      etat.cathouseCount += 1;
      construits += 1;
      construitCettePasse = true;
    }
    if (!construitCettePasse) break;
  }
  if (construits > 0) {
    ajouterLog("event", "Auto-built " + construits + " Wood House" + (construits > 1 ? "s." : "."));
  }
  return construits;
}

function coutProchaineStoneCathouse() {
  const n = etat.stoneCathouseCount;
  const f = Math.pow(CONFIG.stoneCathouse.croissance, n);
  return {
    planks: Math.ceil(CONFIG.stoneCathouse.coutBasePlanks * f),
    bricks: Math.ceil(CONFIG.stoneCathouse.coutBaseBricks * f)
  };
}

function coutProchaineSolidStoneCathouse() {
  const n = etat.solidStoneCathouseCount;
  const f = Math.pow(CONFIG.solidStoneCathouse.croissance, n);
  return {
    planks: Math.ceil(CONFIG.solidStoneCathouse.coutBasePlanks * f),
    bricks: Math.ceil(CONFIG.solidStoneCathouse.coutBaseBricks * f)
  };
}


// ════════════════════════════════════════════════════════════
// 4. UNLOCK CONDITIONS
// ════════════════════════════════════════════════════════════

function catheringDebloquee()       { return campDebloque() && batimentCampRepare("sawmill"); }
function grasscattingDebloquee()    { return batimentCampRepare("catchen"); }
function pebblegatheringDebloquee() { return batimentCampRepare("pawsonry"); }
function rockgatheringDebloquee()   { return etat.itemsAppris.includes("stoneGuide"); }
function rockfactoryDebloquee()     { return etat.itemsAppris.includes("stoneGuide"); }
function basicWoodDebloquee()       { return etat.cardboardPlanksTotalProduit >= 10 || etat.cardboardPlanks >= 10 || etat.objectifsComplis.includes("tenPlanks") || storyEstVue("storyBasicWoodVue") || etat.basicWoodTotalRecolte >= 1; }
function basicSawmillDebloquee()    { return basicWoodDebloquee(); }
function catHouseDebloquee()        { return etat.basicWoodTotalRecolte >= 1 || etat.cathouseCount > 0; }
function stoneHousesDebloques()     { return etat.pebbleBricks >= 1 || etat.stoneCathouseCount > 0 || etat.objectifsComplis.includes("firstBrick"); }
function solidStoneCathouseDebloquee() { return etat.itemsAppris.includes("sturdyHousePlans") || etat.solidStoneCathouseCount > 0; }
function buildingsDebloques()       { return storyEstVue("storyCampFullVue") || etat.cathouses.length > 0; }
function scierieDebloquee()         { return catheringDebloquee(); }
function brickfactoryDebloquee()    { return pebblegatheringDebloquee(); }
function pawcessingDebloquee()      { return scierieDebloquee(); }
function catchenDebloquee()         { return grasscattingDebloquee(); }
function anchovyDebloquee()         { return etat.itemsAppris.includes("fishingGuide"); }
function grilledAnchovyDebloquee()  { return anchovyDebloquee(); }
function operationsTableDebloquee() {
  return Boolean(etat.camp && etat.camp.progression
    && etat.camp.progression.operationsTableUnlocked);
}
function explorationDebloquee() {
  const table = typeof itemCampPrototypeParType === "function"
    ? itemCampPrototypeParType("operationsTable")
    : null;
  return Boolean(operationsTableDebloquee() && table && table.construit === true);
}
function explorationCampFonctionnelle() {
  return explorationDebloquee()
    && typeof batimentFonctionnelCamp === "function"
    && batimentFonctionnelCamp("operationsTable").available;
}
function autoriserActionTableOperationsCamp() {
  const capacite = typeof batimentFonctionnelCamp === "function"
    ? batimentFonctionnelCamp("operationsTable")
    : null;
  if (explorationDebloquee() && capacite && capacite.available) return true;
  afficherNotification(capacite && capacite.reason
    ? capacite.reason
    : "Build and connect the Operations Table first.");
  return false;
}
function explorateurPresent()       { return etat.kittiesData.some(function(k) { return k.metier === "explorator"; }); }
function inventaireDebloque()       { return etat.cardboardPiecesTotalRecolte >= 1; }
function jobCenterDebloquee()        { return etat.jobCenterDebloque; }
function trainingCenterDebloquee()   { return etat.trainingCenterDebloque; }
function laboratoryDebloquee()       { return etat.laboratoryDebloque; }


// ════════════════════════════════════════════════════════════
// 5. FORMATTING HELPERS
// ════════════════════════════════════════════════════════════

function formaterNombre(n) {
  if (n >= 1e9) return (n / 1e9).toFixed(1) + "B";
  if (n >= 1e6) return (n / 1e6).toFixed(1) + "M";
  if (n >= 1e3) return (n / 1e3).toFixed(1) + "K";
  return Math.floor(n).toString();
}

function formaterTemps(sec) {
  if (sec <= 0) return "";
  sec = Math.ceil(sec);
  const y = Math.floor(sec / 31536000);
  const d = Math.floor((sec % 31536000) / 86400);
  const h = Math.floor((sec % 86400) / 3600);
  const m = Math.floor((sec % 3600) / 60);
  const s = sec % 60;
  if (y > 0) return y + "y " + d + "d " + h + "h " + m + "m " + s + "s";
  if (d > 0) return d + "d " + h + "h " + m + "m " + s + "s";
  if (h > 0) return h + "h " + m + "m " + s + "s";
  if (m > 0) return m + "m " + s + "s";
  return s + "s";
}

function formaterSecondesBrutes(sec) {
  if (!Number.isFinite(sec) || sec <= 0) return "";
  return Math.max(1, Math.ceil(sec)) + "s";
}

function formaterCatchTime(ts) {
  if (!ts) return "Unknown";
  const d    = new Date(ts);
  const date = d.toLocaleDateString("en-GB", { day: "2-digit", month: "short", year: "numeric" });
  const h    = String(d.getHours()).padStart(2, "0");
  const m    = String(d.getMinutes()).padStart(2, "0");
  return date + " · " + h + ":" + m;
}

// Shared keyboard behavior for non-native interactive surfaces.
// Only the element carrying data-clavier-clic reacts: nested native buttons
// keep their own behavior without activating the parent card.
function echapperAttributHtml(valeur) {
  return String(valeur)
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;");
}

function etatVideHtml(titre, description) {
  return '<div class="etat-vide"><strong>' + echapperAttributHtml(titre) + '</strong><span>' + echapperAttributHtml(description) + '</span></div>';
}

function attributsActivationClavier(label) {
  return ' tabindex="0" role="button" data-clavier-clic="true" aria-label="' + echapperAttributHtml(label) + '"';
}

function rendreActivableClavier(element, label) {
  element.tabIndex = 0;
  element.setAttribute("role", "button");
  element.dataset.clavierClic = "true";
  element.setAttribute("aria-label", label);
}

function gererActivationClavier(event) {
  const cible = event.target;
  if (!cible || typeof cible.matches !== "function" || !cible.matches("[data-clavier-clic]")) return;
  if (event.repeat || (event.key !== "Enter" && event.key !== " ")) return;
  event.preventDefault();
  cible.click();
}

if (typeof document !== "undefined") document.addEventListener("keydown", gererActivationClavier);

// Accessible modal lifecycle: initial focus, Tab containment, optional Escape,
// and focus return to the control that opened the dialog.
const configurationsDialogues = new WeakMap();

function elementsFocusablesDialogue(dialogue) {
  return Array.from(dialogue.querySelectorAll(
    'button:not([disabled]), input:not([disabled]):not([type="hidden"]), select:not([disabled]), textarea:not([disabled]), a[href], [tabindex]:not([tabindex="-1"])'
  )).filter(function(element) {
    if (element.getAttribute("aria-disabled") === "true") return false;
    const style = getComputedStyle(element);
    return style.display !== "none" && style.visibility !== "hidden";
  });
}

function ouvrirDialogueModal(id, options) {
  const dialogue = typeof id === "string" ? document.getElementById(id) : id;
  if (!dialogue) return;
  const config = Object.assign({ dismissible: false }, options || {});
  config.elementRetour = document.activeElement && document.activeElement !== document.body
    ? document.activeElement
    : null;
  configurationsDialogues.set(dialogue, config);
  dialogue.style.display = "flex";
  dialogue.setAttribute("aria-hidden", "false");
  requestAnimationFrame(function() {
    const cible = (config.focusSelector && dialogue.querySelector(config.focusSelector))
      || elementsFocusablesDialogue(dialogue)[0]
      || dialogue.querySelector('[role="document"]')
      || dialogue;
    if (!cible.hasAttribute("tabindex") && cible === dialogue) cible.tabIndex = -1;
    cible.focus();
  });
}

function fermerDialogueModal(id) {
  const dialogue = typeof id === "string" ? document.getElementById(id) : id;
  if (!dialogue) return;
  const config = configurationsDialogues.get(dialogue) || {};
  dialogue.style.display = "none";
  dialogue.setAttribute("aria-hidden", "true");
  configurationsDialogues.delete(dialogue);
  requestAnimationFrame(function() {
    const cible = (config.returnFocusSelector && document.querySelector(config.returnFocusSelector))
      || (config.elementRetour && config.elementRetour.isConnected ? config.elementRetour : null);
    if (cible && typeof cible.focus === "function") cible.focus();
  });
}

function dialogueOuvertAuPremierPlan() {
  const ouverts = Array.from(document.querySelectorAll('[role="dialog"][aria-hidden="false"]'));
  return ouverts.length ? ouverts[ouverts.length - 1] : null;
}

function gererClavierDialogue(event) {
  const dialogue = dialogueOuvertAuPremierPlan();
  if (!dialogue) return;
  const config = configurationsDialogues.get(dialogue) || {};

  if (event.key === "Escape" && config.dismissible && typeof config.fermer === "function") {
    event.preventDefault();
    config.fermer();
    return;
  }
  if (event.key !== "Tab") return;

  const focusables = elementsFocusablesDialogue(dialogue);
  if (focusables.length === 0) {
    event.preventDefault();
    dialogue.focus();
    return;
  }
  const premier = focusables[0];
  const dernier = focusables[focusables.length - 1];
  if (event.shiftKey && (document.activeElement === premier || !dialogue.contains(document.activeElement))) {
    event.preventDefault();
    dernier.focus();
  } else if (!event.shiftKey && (document.activeElement === dernier || !dialogue.contains(document.activeElement))) {
    event.preventDefault();
    premier.focus();
  }
}

if (typeof document !== "undefined") document.addEventListener("keydown", gererClavierDialogue, true);


// ════════════════════════════════════════════════════════════
// 6. SAVE / LOAD / RESET
// ════════════════════════════════════════════════════════════

const saveCore = globalThis.CatInc.save;
const V4_STORAGE_NAMESPACE = saveCore.STORAGE_NAMESPACE;
const SAVE_KEY = saveCore.SAVE_KEY;
const SAVE_RECOVERY_KEY = saveCore.SAVE_RECOVERY_KEY;
const SAVE_VERSION = saveCore.SAVE_VERSION;
const WORK_DETAILS_HINT_STORAGE_KEY = V4_STORAGE_NAMESPACE + ".workDetailsHintSeen";
const validerStructureSauvegarde = saveCore.validerStructureSauvegarde;
const analyserSauvegardeBrute = saveCore.analyserSauvegardeBrute;

let sauvegardeVerrouillee = false; // set right before a reload we must not let a stale autosave clobber
let redemarrageMajeurRequis = false;
let preferencesAncienneSauvegarde = null;

function jouerSonAffectation() {
  const audio = globalThis.CatInc && globalThis.CatInc.audio;
  if (audio && typeof audio.playCatAssignment === "function") {
    audio.playCatAssignment(etat.volumeEffetsSonores);
  }
}

function jouerSonMiaulement() {
  const audio = globalThis.CatInc && globalThis.CatInc.audio;
  if (audio && typeof audio.playCatMeow === "function") {
    audio.playCatMeow(etat.volumeEffetsSonores);
  }
}

function jouerSonAilesOiseau() {
  const audio = globalThis.CatInc && globalThis.CatInc.audio;
  if (audio && typeof audio.playBirdWingFlaps === "function") {
    audio.playBirdWingFlaps(etat.volumeEffetsSonores);
  }
}

function jouerSonRevelationExploration() {
  const audio = globalThis.CatInc && globalThis.CatInc.audio;
  if (audio && typeof audio.playExplorationReveal === "function") {
    audio.playExplorationReveal(etat.volumeEffetsSonores);
  }
}

function jouerSonRewardChest() {
  const audio = globalThis.CatInc && globalThis.CatInc.audio;
  if (audio && typeof audio.playRewardChest === "function") {
    audio.playRewardChest(etat.volumeEffetsSonores);
  }
}

function jouerSonReparation() {
  const audio = globalThis.CatInc && globalThis.CatInc.audio;
  if (audio && typeof audio.playRepair === "function") {
    audio.playRepair(etat.volumeEffetsSonores);
  }
}

function jouerSonScieBois() {
  const audio = globalThis.CatInc && globalThis.CatInc.audio;
  if (audio && typeof audio.playHandsawWood === "function") {
    audio.playHandsawWood(etat.volumeEffetsSonores);
  }
}

function jouerSonVoixDialogue() {
  const audio = globalThis.CatInc && globalThis.CatInc.audio;
  if (audio && typeof audio.playDialogueVoice === "function") {
    audio.playDialogueVoice(etat.volumeEffetsSonores);
  }
}

function jouerVoixBulleDialogue(modal) {
  if (!modal) return false;
  const index = Math.max(0, Number(modal.dataset.dialogueIndex) || 0);
  const ligne = modal.querySelectorAll(".intro-dialogue .intro-ligne")[index];
  if (!ligne || !ligne.querySelector(".story-beat-bubble")) return false;
  const cle = String(index);
  if (modal.dataset.dialogueVoiceBeat === cle) return false;
  modal.dataset.dialogueVoiceBeat = cle;
  jouerSonVoixDialogue();
  return true;
}

function demarrerMusiqueAmbiante() {
  const audio = globalThis.CatInc && globalThis.CatInc.audio;
  if (audio && typeof audio.startMusic === "function") {
    audio.startMusic(etat.volumeMusique);
  }
}

function conserverSauvegardeRecuperation(raw, raison) {
  try {
    localStorage.setItem(SAVE_RECOVERY_KEY, JSON.stringify({
      savedAt: Date.now(),
      reason: raison,
      raw: raw
    }));
    return true;
  } catch (e) {
    // If localStorage is full or unavailable, the original save remains untouched under SAVE_KEY.
    return false;
  }
}

function sauvegarder() {
  if (sauvegardeVerrouillee) return;
  if (typeof synchroniserEtatCampDepuisPrototype === "function") {
    synchroniserEtatCampDepuisPrototype();
  }
  etat.dernierTimestamp = Date.now();
  localStorage.setItem(SAVE_KEY, saveCore.serialiserEtat(etat));
}

function charger() {
  const raw = localStorage.getItem(SAVE_KEY);
  if (!raw) return false;
  const analyse = analyserSauvegardeBrute(raw);
  if (!analyse.ok) {
    if (analyse.incompatible) {
      const ancienneSauvegarde = analyse.data || {};
      preferencesAncienneSauvegarde = {
        volumeEffetsSonores: Number.isFinite(ancienneSauvegarde.volumeEffetsSonores)
          ? Math.max(0, Math.min(1, ancienneSauvegarde.volumeEffetsSonores))
          : 0.3,
        volumeMusique: Number.isFinite(ancienneSauvegarde.volumeMusique)
          ? Math.max(0, Math.min(1, ancienneSauvegarde.volumeMusique))
          : 0,
        afficherTempsAjusteRecrutement: ancienneSauvegarde.afficherTempsAjusteRecrutement === true,
        avertirSurplusNourriture: ancienneSauvegarde.avertirSurplusNourriture !== false
      };
      redemarrageMajeurRequis = true;
      sauvegardeVerrouillee = true;
      return false;
    }
    const copieRecuperationCreee = conserverSauvegardeRecuperation(raw, analyse.erreur);
    sauvegardeVerrouillee = true;
    alert("Your save could not be loaded safely. It was left untouched"
      + (copieRecuperationCreee ? " and a recovery copy was stored. " : ". ")
      + "Import a valid save or use Start over to begin again.\n\nReason: " + analyse.erreur);
    return false;
  }

  const nouvelEtat = saveCore.migrerDonneesSauvegarde(analyse.data, {
    maintenant: Date.now(),
    nomsKitties: NOMS_KITTIES,
    assignerVisageChaton: assignerVisageChaton
  });
  remplacerEtat(etat, nouvelEtat);
  workStructureInitialisee = false;
  if (typeof normaliserOccupationsChatons === "function" && normaliserOccupationsChatons()) sauvegarder();

  // Promotion remains in the browser layer because it creates a notification and a log.
  if (etat.itemsAppris.includes("schoolGuide") || etat.jobCenterConstruit) assignerGangLeader();
  return true;
}

function confirmerRedemarrageMajeur() {
  const preferences = preferencesAncienneSauvegarde || {};
  localStorage.removeItem(SAVE_KEY);
  STORIES.forEach(function(story) { localStorage.removeItem(story.flag); });
  localStorage.removeItem(WORK_DETAILS_HINT_STORAGE_KEY);
  reinitialiserEtat();
  etat.volumeEffetsSonores = Number.isFinite(preferences.volumeEffetsSonores) ? preferences.volumeEffetsSonores : 0.3;
  etat.volumeMusique = Number.isFinite(preferences.volumeMusique) ? preferences.volumeMusique : 0;
  etat.afficherTempsAjusteRecrutement = preferences.afficherTempsAjusteRecrutement === true;
  etat.avertirSurplusNourriture = preferences.avertirSurplusNourriture !== false;
  preferencesAncienneSauvegarde = null;
  redemarrageMajeurRequis = false;
  sauvegardeVerrouillee = false;
  sauvegarder();
  fermerDialogueModal("save-upgrade-modal");
  rendu();
  renduLogs();
  renduStories();
  renduObjectifs();
  renduManagement();
  afficherModal("ecran-intro");
}

function reset() {
  if (!confirm("Start over from scratch?")) return;
  fermerModalSettings();
  localStorage.removeItem(SAVE_KEY);
  STORIES.forEach(function(s) { localStorage.removeItem(s.flag); });
  localStorage.removeItem(WORK_DETAILS_HINT_STORAGE_KEY);
  sauvegardeVerrouillee = false;
  reinitialiserEtat();
  reinitialiserCampPrototypeNouvellePartie();
  rendu(); renduLogs(); renduObjectifs(); renduManagement();
  afficherModal("ecran-intro");
}

function ouvrirModalSettings() {
  document.getElementById("toggle-adjusted-time").checked = etat.afficherTempsAjusteRecrutement;
  const overfoodToggle = document.getElementById("toggle-overfood-warning");
  if (overfoodToggle) overfoodToggle.checked = etat.avertirSurplusNourriture !== false;
  const campCatIconsToggle = document.getElementById("toggle-camp-cat-icons");
  if (campCatIconsToggle) campCatIconsToggle.checked = etat.hideCampCatIcons === true;
  const sfxInput = document.getElementById("settings-sfx-volume");
  const musicInput = document.getElementById("settings-music-volume");
  if (sfxInput) {
    sfxInput.value = Math.round(etat.volumeEffetsSonores * 100);
    actualiserVolumeAudioUI("sfx", sfxInput.value);
  }
  if (musicInput) {
    musicInput.value = Math.round(etat.volumeMusique * 100);
    actualiserVolumeAudioUI("music", musicInput.value);
  }
  ouvrirDialogueModal("settings-modal", {
    dismissible: true,
    fermer: fermerModalSettings,
    focusSelector: ".explo-modal-close",
    returnFocusSelector: ".bouton-settings"
  });
}
function actualiserVolumeAudioUI(canal, rawValue) {
  const value = Math.max(0, Math.min(100, Number(rawValue) || 0));
  const output = document.getElementById(canal === "sfx" ? "settings-sfx-volume-value" : "settings-music-volume-value");
  if (output) output.value = Math.round(value) + "%";
  if (output) output.textContent = Math.round(value) + "%";
}
function gererVolumeAudio(canal, rawValue) {
  const value = Math.max(0, Math.min(100, Number(rawValue) || 0)) / 100;
  if (canal === "sfx") etat.volumeEffetsSonores = value;
  if (canal === "music") {
    etat.volumeMusique = value;
    const audio = globalThis.CatInc && globalThis.CatInc.audio;
    if (audio && typeof audio.setMusicVolume === "function") audio.setMusicVolume(value);
  }
  actualiserVolumeAudioUI(canal, value * 100);
  sauvegarder();
}
function basculerAffichageTempsAjuste(checked) {
  etat.afficherTempsAjusteRecrutement = checked;
  sauvegarder();
  renduSequence();
}
function basculerAvertissementSurplusNourriture(checked) {
  etat.avertirSurplusNourriture = checked !== false;
  sauvegarder();
}
function basculerIconesChatsCamp(checked) {
  etat.hideCampCatIcons = checked === true;
  document.body.classList.toggle("camp-cat-icons-hidden", etat.hideCampCatIcons);
  sauvegarder();
  renduCampPrototype();
}
function fermerModalSettings() {
  fermerDialogueModal("settings-modal");
}

function categoriesChangelogNonVides(categories) {
  return (categories || []).filter(function(category) {
    return Array.isArray(category.changes) && category.changes.length > 0;
  });
}

function rendreChangelog() {
  const conteneur = document.getElementById("changelog-releases");
  if (!conteneur) return;
  conteneur.innerHTML = "";
  const formaterDateRelease = function(date) {
    if (!date) return "";
    const parsed = new Date(date + "T00:00:00");
    if (Number.isNaN(parsed.getTime())) return date;
    return new Intl.DateTimeFormat("en-US", {
      year: "numeric", month: "long", day: "numeric"
    }).format(parsed);
  };
  GAME_CHANGELOG.forEach(function(release, index) {
    const section = document.createElement("section");
    section.className = "changelog-release";
    const titre = document.createElement("h3");
    const date = formaterDateRelease(release.date);
    titre.textContent = "v" + release.version
      + (date ? " · " + date : "")
      + (index === 0 ? " · Current" : "");
    section.appendChild(titre);
    categoriesChangelogNonVides(release.categories).forEach(function(category) {
      const changes = category.changes;
      const bloc = document.createElement("div");
      bloc.className = "changelog-category";
      const categorieTitre = document.createElement("h4");
      categorieTitre.textContent = category.label;
      bloc.appendChild(categorieTitre);
      const liste = document.createElement("ul");
      changes.forEach(function(change) {
        const item = document.createElement("li");
        item.textContent = change;
        liste.appendChild(item);
      });
      bloc.appendChild(liste);
      section.appendChild(bloc);
    });
    conteneur.appendChild(section);
  });
}

function ouvrirChangelog() {
  rendreChangelog();
  ouvrirDialogueModal("changelog-modal", {
    dismissible: true,
    fermer: fermerChangelog,
    focusSelector: ".explo-modal-close",
    returnFocusSelector: ".settings-changelog-btn"
  });
}

function fermerChangelog() {
  fermerDialogueModal("changelog-modal");
}

function sauvegarderManuel() {
  sauvegarder();
  afficherNotification("💾 Game saved!");
}

function exporterSauvegarde() {
  sauvegarder();
  const raw = localStorage.getItem(SAVE_KEY);
  if (!raw) return;
  const date = new Date().toISOString().slice(0, 10);
  const blob = new Blob([raw], { type: "text/plain" });
  const url  = URL.createObjectURL(blob);
  const a    = document.createElement("a");
  a.href     = url;
  a.download = "cat-inc-save-" + date + ".txt";
  document.body.appendChild(a);
  a.click();
  a.remove();
  URL.revokeObjectURL(url);
  afficherNotification("⬇️ Save exported!");
}

function importerSauvegarde(event) {
  const file = event.target.files[0];
  if (!file) return;
  const reader = new FileReader();
  reader.onload = function() {
    const analyse = analyserSauvegardeBrute(reader.result);
    if (!analyse.ok) {
      if (analyse.incompatible) {
        alert("This save uses the previous Work system and cannot be imported into this version. Start a new game to use recipe-based production.");
        event.target.value = "";
        return;
      }
      alert("This file isn't a valid Cat Inc save.\n\nReason: " + analyse.erreur);
      event.target.value = "";
      return;
    }
    if (!confirm("Import this save? Your current progress will be replaced.")) {
      event.target.value = "";
      return;
    }
    sauvegardeVerrouillee = true; // block the visibilitychange autosave from clobbering the import during reload
    localStorage.setItem(SAVE_KEY, reader.result);
    location.reload();
  };
  reader.readAsText(file);
}


// ════════════════════════════════════════════════════════════
// 7. NOTIFICATIONS & LOGS
// ════════════════════════════════════════════════════════════

const notificationsEnAttente = [];
let notificationActive = null;
const DUREE_NOTIFICATION_MS = 2600;
const DUREE_FONDU_NOTIFICATION_MS = 400;

function afficherNotification(message) {
  const texte = String(message || "").trim();
  if (!texte) return;
  if (notificationActive && notificationActive.message === texte) return;
  if (notificationsEnAttente.includes(texte)) return;
  notificationsEnAttente.push(texte);
  afficherNotificationSuivante();
}

function afficherNotificationSuivante() {
  if (notificationActive || notificationsEnAttente.length === 0) return;
  const message = notificationsEnAttente.shift();
  const el = document.createElement("div");
  el.textContent = message;
  el.className   = "notification";
  el.setAttribute("role", "status");
  el.setAttribute("aria-live", "polite");
  document.body.appendChild(el);
  notificationActive = { message: message, element: el };
  setTimeout(function() { el.classList.add("visible"); }, 10);
  setTimeout(function() {
    el.classList.remove("visible");
    setTimeout(function() {
      el.remove();
      notificationActive = null;
      afficherNotificationSuivante();
    }, DUREE_FONDU_NOTIFICATION_MS);
  }, DUREE_NOTIFICATION_MS);
}

const LOG_MAX = 60;

function ajouterLog(type, lignes) {
  const now = new Date();
  const h   = String(now.getHours()).padStart(2, "0");
  const m   = String(now.getMinutes()).padStart(2, "0");
  etat.logs.unshift({ type: type, lignes: Array.isArray(lignes) ? lignes : [lignes], heure: h + ":" + m });
  if (etat.logs.length > LOG_MAX) etat.logs.pop();
  renduLogs();
}

const logFiltres = { event: true, unlock: true, objective: false };

function renduLogs() {
  const conteneur = document.getElementById("logs-liste");
  if (!conteneur) return;
  conteneur.innerHTML = "";
  let affiches = 0;
  etat.logs.forEach(function(entry) {
    const lignes = entry.lignes || (entry.texte ? [entry.texte] : []);
    const typeEffectif = entry.type === "unlock" && lignes.some(function(ligne) {
      return ligne.indexOf("Objective complete:") === 0;
    }) ? "objective" : entry.type;
    if (!logFiltres[typeEffectif]) return;
    affiches++;
    const el    = document.createElement("div");
    el.className = "log-entry log-" + typeEffectif;
    const heure = document.createElement("span");
    heure.className   = "log-heure";
    heure.textContent = entry.heure;
    const bloc  = document.createElement("span");
    bloc.className = "log-texte";
    lignes.forEach(function(ligne, i) {
      if (i > 0) bloc.appendChild(document.createElement("br"));
      bloc.appendChild(document.createTextNode(retirerEmojisInterface(ligne)));
    });
    el.appendChild(heure);
    el.appendChild(bloc);
    conteneur.appendChild(el);
  });
  if (affiches === 0) {
    conteneur.innerHTML = etatVideHtml(
      etat.logs.length === 0 ? "No activity yet" : "No matching entries",
      etat.logs.length === 0 ? "Your gang's important events will appear here." : "Enable another filter to reveal more of the gang's history."
    );
  }
}

function toggleFiltreLogs(type) {
  logFiltres[type] = !logFiltres[type];
  const btn = document.getElementById("filtre-" + type);
  if (btn) {
    btn.classList.toggle("filtre-inactif", !logFiltres[type]);
    btn.setAttribute("aria-pressed", logFiltres[type] ? "true" : "false");
  }
  renduLogs();
}


// ════════════════════════════════════════════════════════════
// DAILY QUESTS
// ════════════════════════════════════════════════════════════

const DAILY_RECIPE_FAMILIES = ["food", "wood", "rock"];

function dailyQuetesDebloquees() {
  // Study only prepares the lesson. Daily quests unlock after the player
  // completes the book's Learn mini-game and the book is truly learned.
  return Array.isArray(etat.itemsAppris) && etat.itemsAppris.includes("dailyPurpose");
}

function cleDateParis(timestamp) {
  const date = new Date(Number.isFinite(timestamp) ? timestamp : Date.now());
  try {
    const parts = new Intl.DateTimeFormat("en-CA", {
      timeZone: "Europe/Paris", year: "numeric", month: "2-digit", day: "2-digit"
    }).formatToParts(date);
    const values = {};
    parts.forEach(function(part) { values[part.type] = part.value; });
    return values.year + "-" + values.month + "-" + values.day;
  } catch (e) {
    return date.toISOString().slice(0, 10);
  }
}

function partsDateParis(timestamp) {
  const date = new Date(Number.isFinite(timestamp) ? timestamp : Date.now());
  try {
    const parts = new Intl.DateTimeFormat("en-CA", {
      timeZone: "Europe/Paris", year: "numeric", month: "2-digit", day: "2-digit",
      hour: "2-digit", minute: "2-digit", second: "2-digit", hourCycle: "h23"
    }).formatToParts(date);
    const values = {};
    parts.forEach(function(part) { values[part.type] = Number(part.value); });
    return values;
  } catch (e) {
    const iso = date.toISOString();
    return {
      year: Number(iso.slice(0, 4)), month: Number(iso.slice(5, 7)), day: Number(iso.slice(8, 10)),
      hour: Number(iso.slice(11, 13)), minute: Number(iso.slice(14, 16)), second: Number(iso.slice(17, 19))
    };
  }
}

function millisecondesAvantMinuitParis(timestamp) {
  const now = Number.isFinite(timestamp) ? timestamp : Date.now();
  const parts = partsDateParis(now);
  const prochainMinuitParisUtc = Date.UTC(parts.year, parts.month - 1, parts.day + 1, 0, 0, 0);
  // Convert the next Paris midnight back to an absolute timestamp. Recompute
  // the offset once at the target to remain correct across DST transitions.
  const offsetActuel = Date.UTC(parts.year, parts.month - 1, parts.day, parts.hour, parts.minute, parts.second) - now;
  let cible = prochainMinuitParisUtc - offsetActuel;
  const cibleParts = partsDateParis(cible);
  const offsetCible = Date.UTC(cibleParts.year, cibleParts.month - 1, cibleParts.day, cibleParts.hour, cibleParts.minute, cibleParts.second) - cible;
  cible = prochainMinuitParisUtc - offsetCible;
  return Math.max(0, cible - now);
}

function formaterCompteAReboursQuetes(milliseconds) {
  const totalMinutes = Math.max(0, Math.ceil(milliseconds / 60000));
  const heures = Math.floor(totalMinutes / 60);
  const minutes = totalMinutes % 60;
  return heures + "h " + String(minutes).padStart(2, "0") + "m";
}

function familleRecetteQuotidienne(dateKey) {
  const parts = String(dateKey || "").split("-").map(Number);
  if (parts.length !== 3 || parts.some(function(value) { return !Number.isFinite(value); })) return "food";
  const dayNumber = Math.floor(Date.UTC(parts[0], parts[1] - 1, parts[2]) / 86400000);
  return DAILY_RECIPE_FAMILIES[((dayNumber % DAILY_RECIPE_FAMILIES.length) + DAILY_RECIPE_FAMILIES.length) % DAILY_RECIPE_FAMILIES.length];
}

function queteQuotidienneParDefaut(dateKey) {
  return {
    dateKey: dateKey,
    recipeFamily: familleRecetteQuotidienne(dateKey),
    scoutingSuccesses: 0,
    catLevelUps: 0,
    birdCaught: false,
    recipesCompleted: 0,
    rewardClaimed: false
  };
}

function initialiserQuetesQuotidiennes() {
  if (!dailyQuetesDebloquees()) return false;
  const dateKey = cleDateParis(Date.now());
  const actuel = etat.dailyQuests;
  if (!actuel || actuel.dateKey !== dateKey || !DAILY_RECIPE_FAMILIES.includes(actuel.recipeFamily)
      || !Number.isInteger(actuel.scoutingSuccesses)
      || !Number.isInteger(actuel.catLevelUps)
      || !Number.isInteger(actuel.recipesCompleted)) {
    etat.dailyQuests = queteQuotidienneParDefaut(dateKey);
    return true;
  }
  return false;
}

function modifierQueteQuotidienne(modifier) {
  if (!dailyQuetesDebloquees()) return false;
  initialiserQuetesQuotidiennes();
  const q = etat.dailyQuests;
  const avant = JSON.stringify(q);
  modifier(q);
  if (JSON.stringify(q) === avant) return false;
  sauvegarder();
  return true;
}

function enregistrerSuccesScoutingQuotidien(nombre) {
  modifierQueteQuotidienne(function(q) {
    q.scoutingSuccesses = Math.min(10, q.scoutingSuccesses + Math.max(0, Math.floor(nombre || 0)));
  });
}

function enregistrerNiveauQuotidien(nombre) {
  modifierQueteQuotidienne(function(q) {
    q.catLevelUps = Math.min(1, q.catLevelUps + Math.max(0, Math.floor(nombre || 0)));
  });
}

function enregistrerOiseauQuotidien() {
  modifierQueteQuotidienne(function(q) { q.birdCaught = true; });
}

function enregistrerRecettesQuotidiennes(familyId, nombre) {
  modifierQueteQuotidienne(function(q) {
    if (q.recipeFamily !== familyId) return;
    q.recipesCompleted = Math.min(10, q.recipesCompleted + Math.max(0, Math.floor(nombre || 0)));
  });
}

function quetesQuotidiennesCompletes(q) {
  return q && q.scoutingSuccesses >= 10 && q.catLevelUps >= 1 && q.birdCaught === true && q.recipesCompleted >= 10;
}

function recompenseQuetesQuotidiennes() {
  if (!etat.spherePerks) return 1;
  if (etat.spherePerks['gl-daily-2'] === 'learned') return 3;
  return etat.spherePerks['gl-daily-1'] === 'learned' ? 2 : 1;
}

function reclamerRecompenseQuotidienne() {
  if (!dailyQuetesDebloquees()) return;
  initialiserQuetesQuotidiennes();
  const q = etat.dailyQuests;
  if (!quetesQuotidiennesCompletes(q) || q.rewardClaimed) return;
  const rewardQty = recompenseQuetesQuotidiennes();
  q.rewardClaimed = true;
  etat.cannedCatFood += rewardQty;
  ajouterLog("event", "Daily quests complete. " + rewardQty + " Canned Cat Food received.");
  afficherNotification("Daily reward claimed: " + rewardQty + " Canned Cat Food");
  sauvegarder();
  rendu();
  renduObjectifs();
}


// ════════════════════════════════════════════════════════════
// 8. OBJECTIVES
// ════════════════════════════════════════════════════════════

let tutorielCompletionEnAttente = false;

function ouvrirCompletionTutorielSiNecessaire() {
  if (!tutorielCompletionEnAttente || etat.tutorialCompletionPopupSeen) return;
  // Release notes, story screens and the save-upgrade dialog take priority.
  // Keep the acknowledgement queued instead of marking it seen behind one of
  // those overlays, so it cannot disappear during the initial launch flow.
  const autreModalOuvert = Array.from(document.querySelectorAll('.explo-modal, .ecran-intro')).some(function(el) {
    return el.id !== "tutorial-complete-modal"
      && el.style.display !== "none"
      && el.getAttribute("aria-hidden") !== "true";
  });
  if (autreModalOuvert) {
    setTimeout(ouvrirCompletionTutorielSiNecessaire, 250);
    return;
  }
  tutorielCompletionEnAttente = false;
  etat.tutorialCompletionPopupSeen = true;
  sauvegarder();
  ouvrirDialogueModal("tutorial-complete-modal", {
    focusSelector: "#tutorial-complete-confirm"
  });
}

function verifierObjectifs() {
  let changed = false;
  const workerNiveauDeux = etat.kittiesData.some(function(kitty) {
    return kitty && !estBernardoSuperviseur(kitty) && (Number(kitty.niveau) || 0) >= 2;
  });
  if (workerNiveauDeux) mettreDialogueRapideCampEnFile("workerLevelTwo");
  OBJECTIFS.forEach(function(obj) {
    if (etat.objectifsComplis.indexOf(obj.id) === -1 && obj.accompli(etat)) {
      etat.objectifsComplis.push(obj.id);
      ajouterLog("objective", "Objective complete: " + obj.label);
      changed = true;
    }
  });
  // Tutorial completion is independent from Daily Quests. Daily Purpose may
  // be learned later, so tying this check to dailyQuetesDebloquees() could
  // silently skip the completion acknowledgement altogether.
  const tutorielTermine = objectifsActifsTries().length === 0;
  const afficherFinTutoriel = tutorielTermine && !etat.tutorialCompletionPopupSeen && !tutorielCompletionEnAttente;
  if (afficherFinTutoriel) tutorielCompletionEnAttente = true;
  if (changed || afficherFinTutoriel) { rendu(); sauvegarder(); }
  renduObjectifs();
  if (afficherFinTutoriel) {
    setTimeout(ouvrirCompletionTutorielSiNecessaire, 0);
  }
}

function fermerTutorialComplete() {
  fermerDialogueModal("tutorial-complete-modal");
}

let objectifPrincipalId = null;
let objectifGuideSelectionneId = null;
let objectifsGuideStructureKey = "";
let objectifsCampReplies = false;
const NOMS_DESTINATIONS_GUIDE = {
  gang: "Recruitment",
  camp: "Base Camp",
  work: "Work",
  facilities: "Facilities",
  explorations: "Explorations",
  inventaire: "Inventory",
  logs: "Logs"
};

function objectifsActifsTries() {
  return OBJECTIFS.filter(function(obj) {
    return etat.objectifsComplis.indexOf(obj.id) === -1 && obj.visible(etat);
  }).sort(function(a, b) {
    const ordreA = OBJECTIF_GUIDE[a.id] ? OBJECTIF_GUIDE[a.id].ordre : Number.MAX_SAFE_INTEGER;
    const ordreB = OBJECTIF_GUIDE[b.id] ? OBJECTIF_GUIDE[b.id].ordre : Number.MAX_SAFE_INTEGER;
    return ordreA - ordreB;
  });
}

function valeurProgressionGuide(valeur) {
  if (!Number.isFinite(valeur)) return "0";
  if (Math.abs(valeur - Math.round(valeur)) < 0.001) return String(Math.round(valeur));
  return formaterNombre(valeur);
}

function ordreObjectifGuide(objectifId) {
  return OBJECTIF_GUIDE[objectifId] ? OBJECTIF_GUIDE[objectifId].ordre : Number.MAX_SAFE_INTEGER;
}

function normaliserObjectifGuideSelectionne(actifs) {
  if (actifs.some(function(obj) { return obj.id === objectifGuideSelectionneId; })) return;
  const ancienOrdre = objectifGuideSelectionneId ? ordreObjectifGuide(objectifGuideSelectionneId) : -1;
  const suivant = actifs.find(function(obj) { return ordreObjectifGuide(obj.id) >= ancienOrdre; });
  objectifGuideSelectionneId = (suivant || actifs[0]).id;
}

function objectifGuideCarteHtml(obj) {
  const id = echapperAttributHtml(obj.id);
  const label = obj.labelHtml || echapperAttributHtml(obj.label);
  return '<button id="objectif-guide-action-' + id + '" class="obj-guide-action" type="button" data-objectif-id="' + id + '" onclick="allerObjectif(\'' + id + '\')">' +
    '<span class="obj-guide-destination"></span>' +
    '<span class="obj-guide-label">' + label + '</span>' +
    '<span class="obj-guide-progression" role="progressbar" aria-label="' + echapperAttributHtml(obj.label) + ' progress" aria-valuemin="0" aria-valuemax="100" aria-valuenow="0">' +
      '<span class="obj-guide-barre"></span>' +
    '</span>' +
    '<span class="obj-guide-pied">' +
      '<span class="obj-guide-valeur"></span>' +
      '<span class="obj-guide-lien"></span>' +
    '</span>' +
  '</button>';
}

function mettreAJourProgressionObjectif(obj, bouton, guide) {
  const progression = typeof guide.progression === "function" ? guide.progression(etat) : null;
  const progressionEl = bouton.querySelector(".obj-guide-progression");
  const barre = bouton.querySelector(".obj-guide-barre");
  const valeur = bouton.querySelector(".obj-guide-valeur");
  if (progression && Number.isFinite(progression.actuel) && Number.isFinite(progression.cible) && progression.cible > 0) {
    const ratio = Math.max(0, Math.min(1, progression.actuel / progression.cible));
    ecrireStyle(progressionEl, "display", "block");
    const largeur = (ratio * 100).toFixed(1) + "%";
    if (barre.style.width !== largeur) barre.style.width = largeur;
    const ariaNow = String(Math.round(ratio * 100));
    if (progressionEl.getAttribute("aria-valuenow") !== ariaNow) progressionEl.setAttribute("aria-valuenow", ariaNow);
    ecrireTexte(valeur, progression.texte || (valeurProgressionGuide(progression.actuel) + " / " + valeurProgressionGuide(progression.cible)));
  } else {
    ecrireStyle(progressionEl, "display", "none");
    ecrireTexte(valeur, "");
  }
}

let objectifVueActive = "guide";

function renduQuetesQuotidiennes() {
  const q = etat.dailyQuests || queteQuotidienneParDefaut(cleDateParis(Date.now()));
  const familleRecette = (typeof WORK_FAMILIES !== "undefined" && WORK_FAMILIES[q.recipeFamily])
    ? WORK_FAMILIES[q.recipeFamily].label
    : ({ wood: "Wood", food: "Food", rock: "Rocks" }[q.recipeFamily] || "selected family");
  const lignes = [
    { label: "10 successful scouting missions", value: Math.min(10, q.scoutingSuccesses) + " / 10", done: q.scoutingSuccesses >= 10 },
    { label: "Level up one Cat", value: Math.min(1, q.catLevelUps) + " / 1", done: q.catLevelUps >= 1 },
    { label: "Catch a bird", value: (q.birdCaught ? 1 : 0) + " / 1", done: q.birdCaught },
    { label: "Complete 10 " + familleRecette + " recipes", value: Math.min(10, q.recipesCompleted) + " / 10", done: q.recipesCompleted >= 10 }
  ];
  const liste = document.getElementById("daily-quests-liste");
  if (!liste) return;
  ecrireHTML(liste, lignes.map(function(ligne) {
    return '<div class="daily-quest-row' + (ligne.done ? ' daily-quest-done' : '') + '">' +
      '<span class="daily-quest-label">' + (ligne.done ? '<span class="daily-quest-check" aria-hidden="true">✓</span>' : '') + echapperAttributHtml(ligne.label) + '</span>' +
      '<span class="daily-quest-value">' + echapperAttributHtml(ligne.value) + '</span>' +
    '</div>';
  }).join(""));
  const complete = quetesQuotidiennesCompletes(q);
  const reward = document.getElementById("daily-quests-reward");
  if (reward) {
    const rewardQty = recompenseQuetesQuotidiennes();
    const resetLabel = "Resets in " + formaterCompteAReboursQuetes(millisecondesAvantMinuitParis(Date.now()));
    ecrireHTML(reward, '<span class="daily-reward-action"><img class="daily-reward-icon" src="img/resources/Canned Cat Food_Final.png" alt="Canned Cat Food">' +
      '<strong class="daily-reward-quantity">×' + rewardQty + '</strong>' +
      '<button id="daily-claim-reward" class="daily-claim-button" type="button" onclick="reclamerRecompenseQuotidienne()"' + (complete && !q.rewardClaimed ? '' : ' disabled') + '>' + (q.rewardClaimed ? 'Claimed' : 'Claim reward') + '</button></span>' +
      '<span class="daily-reward-reset">' + echapperAttributHtml(resetLabel) + '</span>');
  }
  ecrireTexte(document.getElementById("daily-quests-secondaires"), "");
}

function renduObjectifsCamp(actifs, dailyAvailable, dailyRewardClaimed) {
  const panneau = document.getElementById("camp-active-objectives");
  const liste = document.getElementById("camp-active-objectives-list");
  const bascule = document.getElementById("camp-active-objectives-toggle");
  if (!panneau || !liste) return;
  const objectifs = Array.isArray(actifs) ? actifs : [];
  const afficherDaily = Boolean(dailyAvailable && !dailyRewardClaimed && objectifs.length === 0);
  panneau.hidden = objectifs.length === 0 && !afficherDaily;
  liste.hidden = objectifsCampReplies;
  panneau.classList.toggle("camp-active-objectives-collapsed", objectifsCampReplies);
  if (bascule) {
    bascule.textContent = objectifsCampReplies ? "+" : "−";
    bascule.setAttribute("aria-expanded", objectifsCampReplies ? "false" : "true");
    bascule.setAttribute("aria-label", (objectifsCampReplies ? "Expand" : "Collapse") + " Active goals");
  }
  if (!objectifs.length && !afficherDaily) {
    liste.innerHTML = "";
    return;
  }
  if (afficherDaily) {
    const q = etat.dailyQuests || queteQuotidienneParDefaut(cleDateParis(Date.now()));
    const lignes = [
      { label: "Scout successfully", value: Math.min(10, q.scoutingSuccesses) + "/10", done: q.scoutingSuccesses >= 10 },
      { label: "Level up a Cat", value: Math.min(1, q.catLevelUps) + "/1", done: q.catLevelUps >= 1 },
      { label: "Catch a bird", value: (q.birdCaught ? 1 : 0) + "/1", done: q.birdCaught },
      { label: "Complete recipes", value: Math.min(10, q.recipesCompleted) + "/10", done: q.recipesCompleted >= 10 }
    ];
    liste.innerHTML = lignes.map(function(ligne) {
      return '<span class="camp-active-daily' + (ligne.done ? ' done' : '') + '"><span aria-hidden="true">'
        + (ligne.done ? '✓' : '○') + '</span>' + echapperAttributHtml(ligne.label)
        + '<b>' + ligne.value + '</b></span>';
    }).join("") + (quetesQuotidiennesCompletes(q)
      ? '<button type="button" onclick="reclamerRecompenseQuotidienne()">Claim daily reward</button>'
      : '');
    return;
  }
  liste.innerHTML = objectifs.map(function(obj) {
    const guide = OBJECTIF_GUIDE[obj.id] || {};
    const action = guide.action || obj.label;
    return '<button type="button" data-camp-objective-id="' + echapperAttributHtml(obj.id)
      + '" onclick="allerObjectif(\'' + echapperAttributHtml(obj.id) + '\')" title="'
      + echapperAttributHtml(obj.label) + '"><span aria-hidden="true">○</span>'
      + echapperAttributHtml(action) + '</button>';
  }).join("");
}

function basculerObjectifsCamp(event) {
  if (event) {
    event.preventDefault();
    event.stopPropagation();
  }
  objectifsCampReplies = !objectifsCampReplies;
  const liste = document.getElementById("camp-active-objectives-list");
  const panneau = document.getElementById("camp-active-objectives");
  const bascule = document.getElementById("camp-active-objectives-toggle");
  if (liste) liste.hidden = objectifsCampReplies;
  if (panneau) panneau.classList.toggle("camp-active-objectives-collapsed", objectifsCampReplies);
  if (bascule) {
    bascule.textContent = objectifsCampReplies ? "+" : "−";
    bascule.setAttribute("aria-expanded", objectifsCampReplies ? "false" : "true");
    bascule.setAttribute("aria-label", (objectifsCampReplies ? "Expand" : "Collapse") + " Active goals");
  }
}

function toggleObjectifsVue() {
  if (!dailyQuetesDebloquees()) return;
  objectifVueActive = objectifVueActive === "daily" ? "guide" : "daily";
  renduObjectifs();
}

function renduObjectifs() {
  const panneau = document.getElementById("panneau-objectifs");
  const liste = document.getElementById("objectif-guide-liste");
  if (!panneau || !liste) return;

  const reset = initialiserQuetesQuotidiennes();
  if (reset) {
    sauvegarder();
    exploTabDirty = true;
  }
  const dailyAvailable = dailyQuetesDebloquees();
  if (!dailyAvailable && objectifVueActive === "daily") objectifVueActive = "guide";
  const actifs = objectifsActifsTries();
  // Daily quests temporarily replace the completed tutorial until their
  // reward is claimed. Claiming hides the whole objectives panel until the
  // next Paris-midnight reset starts a fresh set.
  const dailyRewardClaimed = dailyAvailable && etat.dailyQuests && etat.dailyQuests.rewardClaimed === true;
  renduObjectifsCamp(actifs, dailyAvailable, dailyRewardClaimed);
  if (dailyRewardClaimed && objectifVueActive === "daily") objectifVueActive = "guide";
  const tutorielTermine = dailyAvailable && !dailyRewardClaimed && actifs.length === 0;
  if (tutorielTermine) objectifVueActive = "daily";
  // Keep the guide's original availability check explicit for compatibility
  // with lightweight UI audits that inspect this render path.
  document.body.classList.toggle("objectifs-disponibles", actifs.length > 0);
  const visible = actifs.length > 0 || (dailyAvailable && !dailyRewardClaimed);
  document.body.classList.toggle("objectifs-disponibles", visible);
  const modeButton = document.getElementById("objectifs-vue-toggle");
  if (modeButton) {
    modeButton.style.display = dailyAvailable && !tutorielTermine && !dailyRewardClaimed ? "inline-flex" : "none";
    modeButton.textContent = objectifVueActive === "daily" ? "Guide" : "Daily";
    modeButton.setAttribute("aria-pressed", objectifVueActive === "daily" ? "true" : "false");
  }
  if (!visible) {
    ecrireStyle(panneau, "display", "none");
    objectifPrincipalId = null;
    objectifGuideSelectionneId = null;
    objectifsGuideStructureKey = "";
    ecrireHTML(liste, "");
    return;
  }
  ecrireStyle(panneau, "display", "");
  const guideBody = document.getElementById("objectifs-actifs");
  const dailyBody = document.getElementById("objectifs-daily");
  if (objectifVueActive === "daily" && dailyAvailable && !dailyRewardClaimed) {
    if (guideBody) guideBody.style.display = "none";
    if (dailyBody) dailyBody.style.display = "flex";
    const q = etat.dailyQuests;
    const completeCount = (q.scoutingSuccesses >= 10 ? 1 : 0) + (q.catLevelUps >= 1 ? 1 : 0) + (q.birdCaught ? 1 : 0) + (q.recipesCompleted >= 10 ? 1 : 0);
    ecrireTexte(document.getElementById("objectifs-titre"), tutorielTermine ? "Daily quests" : "Daily quests · " + completeCount + " / 4");
    const titreDaily = document.getElementById("objectifs-titre");
    if (titreDaily) titreDaily.setAttribute("aria-label", "Toggle daily quests");
    renduQuetesQuotidiennes();
    return;
  }
  if (guideBody) guideBody.style.display = "flex";
  if (dailyBody) dailyBody.style.display = "none";
  if (actifs.length === 0) {
    objectifPrincipalId = null;
    objectifGuideSelectionneId = null;
    objectifsGuideStructureKey = "";
    ecrireHTML(liste, '<div class="objectifs-terminees">Tutorial complete. Open Daily quests when you are ready.</div>');
    ecrireTexte(document.getElementById("objectifs-titre"), "Tutorial complete");
    const titreTermine = document.getElementById("objectifs-titre");
    if (titreTermine) titreTermine.setAttribute("aria-label", "Toggle tutorial guide");
    ecrireTexte(document.getElementById("objectif-guide-secondaires"), "");
    return;
  }

  normaliserObjectifGuideSelectionne(actifs);
  objectifPrincipalId = objectifGuideSelectionneId;
  const selectedIndex = Math.max(0, actifs.findIndex(function(obj) { return obj.id === objectifGuideSelectionneId; }));
  const selected = actifs[selectedIndex];
  const structureKey = actifs.map(function(obj) { return obj.id; }).join("|");
  if (structureKey !== objectifsGuideStructureKey) {
    ecrireHTML(liste, actifs.map(objectifGuideCarteHtml).join(""));
    objectifsGuideStructureKey = structureKey;
  }

  actifs.forEach(function(obj, index) {
    const guide = OBJECTIF_GUIDE[obj.id] || {};
    const destination = NOMS_DESTINATIONS_GUIDE[guide.onglet] || "Game";
    const bouton = liste.querySelector('[data-objectif-id="' + obj.id + '"]');
    if (!bouton) return;
    bouton.classList.toggle("obj-guide-recommande", index === 0);
    bouton.classList.toggle("obj-guide-selectionne", obj.id === objectifGuideSelectionneId);
    if (obj.id === objectifGuideSelectionneId) bouton.setAttribute("aria-current", "step");
    else bouton.removeAttribute("aria-current");
    ecrireTexte(bouton.querySelector(".obj-guide-destination"), (index === 0 ? "Recommended · " : "") + destination);
    ecrireTexte(bouton.querySelector(".obj-guide-lien"), guide.action || ("Open " + destination + " →"));
    const ariaLabel = "Go to objective: " + obj.label + ". " + (guide.action || ("Open " + destination));
    if (bouton.getAttribute("aria-label") !== ariaLabel) bouton.setAttribute("aria-label", ariaLabel);
    mettreAJourProgressionObjectif(obj, bouton, guide);
  });

  const estMobile = window.matchMedia("(max-width: 768px)").matches;
  ecrireTexte(document.getElementById("objectifs-titre"), estMobile
    ? "Goal " + (selectedIndex + 1) + "/" + actifs.length + ": " + selected.label
    : "Current goals · " + actifs.length);
  const titreGuide = document.getElementById("objectifs-titre");
  if (titreGuide) titreGuide.setAttribute("aria-label", "Toggle tutorial guide");
  ecrireTexte(document.getElementById("objectif-guide-compteur"), (selectedIndex + 1) + " / " + actifs.length);
  const precedent = document.getElementById("objectif-guide-precedent");
  const suivant = document.getElementById("objectif-guide-suivant");
  if (precedent) precedent.disabled = actifs.length < 2;
  if (suivant) suivant.disabled = actifs.length < 2;
  ecrireTexte(document.getElementById("objectif-guide-secondaires"), "Completed goals are saved in Logs");
}

function changerObjectifGuide(delta) {
  const actifs = objectifsActifsTries();
  if (actifs.length < 2) return;
  let index = actifs.findIndex(function(obj) { return obj.id === objectifGuideSelectionneId; });
  if (index < 0) index = 0;
  index = (index + delta + actifs.length) % actifs.length;
  objectifGuideSelectionneId = actifs[index].id;
  objectifPrincipalId = objectifGuideSelectionneId;
  renduObjectifs();
}

function allerObjectif(objectifId) {
  if (!objectifId) return;
  const guide = OBJECTIF_GUIDE[objectifId];
  if (!guide) return;

  objectifGuideSelectionneId = objectifId;
  objectifPrincipalId = objectifId;
  if (objectifId === "firstCampaign") {
    carteZoneSelectionnee = "D1";
    carteDirty = true;
    exploTabDirty = true;
    explorationMobileVue = "zone";
    explorationMobileTypeMission = "campaigns";
  }
  if (guide.onglet) changerOnglet(guide.onglet);
  // changerOnglet() rerenders the selected tab's content, but Gang is kept
  // outside the master dispatcher. Rebuild it after setting the tutorial's
  // kitty selection so Bernardo's detail panel is actually opened.
  if (guide.onglet === "gang") renduManagement();
  if (guide.filtre !== undefined) filtrerWork(guide.filtre);

  if (window.matchMedia("(max-width: 768px)").matches) definirObjectifsReduits(true);
  setTimeout(function() {
    const cible = guide.cible ? document.querySelector(guide.cible) : null;
    if (!cible) return;
    if (!cible.closest("#top-bar")) cible.scrollIntoView({ behavior: "smooth", block: "center" });
    cible.classList.remove("objectif-cible-highlight");
    void cible.offsetWidth;
    cible.classList.add("objectif-cible-highlight");
    setTimeout(function() { cible.classList.remove("objectif-cible-highlight"); }, 1700);
  }, 80);
}

function allerObjectifPrincipal() {
  allerObjectif(objectifPrincipalId);
}


// ════════════════════════════════════════════════════════════
// 9. RENDER
// ════════════════════════════════════════════════════════════

// DOM helpers live in js/ui/dom.js.
const domUtils = globalThis.CatInc.dom;
const domParId = domUtils.domParId;
const ecrireTexte = domUtils.ecrireTexte;
const ecrireHTML = domUtils.ecrireHTML;
const ecrireStyle = domUtils.ecrireStyle;
const ecrirePropriete = domUtils.ecrirePropriete;
const ecrireVariableStyle = domUtils.ecrireVariableStyle;
const basculerClasse = domUtils.basculerClasse;
const setBarreProgress = domUtils.setBarreProgress;

// Helper: compute all unlock flags once per render cycle
function unlocks() {
  return {
    libres:       chatonsLibres(),
    cathering:    catheringDebloquee(),
    grasscat:     grasscattingDebloquee(),
    pebblecat:    pebblegatheringDebloquee(),
    rockcat:      rockgatheringDebloquee(),
    rockfact:     rockfactoryDebloquee(),
    basicWood:    basicWoodDebloquee(),
    catHouse:     catHouseDebloquee(),
    stoneHouses:  stoneHousesDebloques(),
    solidStoneCathouse: solidStoneCathouseDebloquee(),
    buildings:    buildingsDebloques(),
    scierie:      scierieDebloquee(),
    basicSawmill: basicSawmillDebloquee(),
    brickfact:    brickfactoryDebloquee(),
    pawcessing:   pawcessingDebloquee(),
    catchen:      catchenDebloquee(),
    exploration:  explorationDebloquee(),
    explorateurPresent: explorateurPresent(),
    inventaire:   inventaireDebloque(),
    jobCenter:       jobCenterDebloquee(),
    trainingCenter:  trainingCenterDebloquee(),
    laboratory:      laboratoryDebloquee(),
    anchovy:         anchovyDebloquee(),
    grilledAnchovy: grilledAnchovyDebloquee()
  };
}

const IDS_ONGLETS = ["gang", "camp", "work", "facilities", "explorations", "inventaire", "logs"];

function ongletDejaVisite(id) {
  return Array.isArray(etat.ongletsVisites) && etat.ongletsVisites.includes(id);
}

function actualiserBadgeOnglet(id, visible) {
  const bouton = domParId("onglet-" + id);
  if (!bouton) return;
  const nouveau = visible && !ongletDejaVisite(id);
  basculerClasse(bouton, "onglet-nouveau", nouveau);

  const labelElement = bouton.querySelector(".onglet-label");
  const label = labelElement ? labelElement.textContent.trim() : id;
  const labelAccessible = label + (nouveau ? " (new)" : "");
  if (bouton.getAttribute("aria-label") !== labelAccessible) bouton.setAttribute("aria-label", labelAccessible);
  if (nouveau) {
    const titre = label + " — New";
    if (bouton.title !== titre) bouton.title = titre;
  } else if (bouton.hasAttribute("title")) {
    bouton.removeAttribute("title");
  }
}

function marquerOngletVisite(id) {
  if (!Array.isArray(etat.ongletsVisites)) etat.ongletsVisites = ["gang", "logs"];
  if (!etat.ongletsVisites.includes(id)) {
    etat.ongletsVisites.push(id);
    sauvegarder();
  }
  actualiserBadgeOnglet(id, true);
}

// ── 9a. Resources bar
const RESOURCE_BAR_ITEMS = Object.freeze([
  { key: "cardboardPlanks", rowId: "row-cardboard-planks", label: "Cardboard Planks", icon: "img/resources/Cardboard Plank_Final.png", tier: "T1", unlocked: function(u) { return u.scierie; } },
  { key: "basicWoodPlanks", rowId: "row-basic-wood-planks", label: "Basic Wood Planks", icon: "img/resources/Basic Wood Plank_Final.png", tier: "T2", unlocked: function(u) { return u.basicSawmill; } },
  { key: "pebbleBricks", rowId: "row-pebble-bricks", label: "Pebble Bricks", icon: "img/resources/Pebble Brick_Final.png", tier: "T1", unlocked: function(u) { return u.brickfact; } },
  { key: "rockBricks", rowId: "row-rock-bricks", label: "Rock Bricks", icon: "img/resources/Rock Brick_Final.png", tier: "T2", unlocked: function(u) { return u.rockfact; } },
  { key: "salads", rowId: "row-salads", label: "Catnip Salad", icon: "img/resources/Catnip Salad_Final.png", tier: "T1", unlocked: function(u) { return u.catchen; } },
  { key: "grilledAnchovy", rowId: "row-grilled-anchovy", label: "Grilled Anchovy", icon: "img/resources/Grilled Anchovy_Final.png?v=0.0029", tier: "T2", unlocked: function(u) { return u.grilledAnchovy; } },
  { key: "humanLeftovers", rowId: "row-human-leftovers", label: "Human Leftovers", icon: "img/resources/Human Leftovers_Final.png?v=0.0029", tier: null, unlocked: function() { return etat.humanLeftovers > 0; } },
  { key: "humanWorkersFood", rowId: "row-human-workers-food", label: "Workers Food", icon: "img/resources/Human Workers Food_Final.png?v=0.0029", tier: null, unlocked: function() { return etat.humanWorkersFood > 0; } },
  { key: "cannedCatFood", rowId: "row-canned-cat-food", label: "Canned Cat Food", icon: "img/resources/Canned Cat Food_Final.png?v=0.0029", tier: null, unlocked: function() { return etat.cannedCatFood > 0; } }
]);
let dernierEtatDeblocageRessources = null;

function ressourcesMasqueesBandeau() {
  if (!Array.isArray(etat.resourceBarHidden)) etat.resourceBarHidden = [];
  return etat.resourceBarHidden;
}

function ressourceFavoriteBandeau(key) {
  return !ressourcesMasqueesBandeau().includes(key);
}

function ressourcesDisponiblesBandeau(u) {
  u = u || dernierEtatDeblocageRessources || unlocks();
  return RESOURCE_BAR_ITEMS.filter(function(item) { return !!item.unlocked(u); });
}

function rendreGestionRessources() {
  const conteneur = document.getElementById("resource-bar-favorites");
  if (!conteneur) return;
  const disponibles = ressourcesDisponiblesBandeau();
  if (!disponibles.length) {
    conteneur.innerHTML = etatVideHtml("No resources yet", "Unlocked resources will appear here automatically.");
    return;
  }
  conteneur.innerHTML = disponibles.map(function(item) {
    const favorite = ressourceFavoriteBandeau(item.key);
    const tier = item.tier
      ? '<span class="resource-favorite-tier resource-favorite-tier-' + item.tier.toLowerCase() + '">' + item.tier + '</span>'
      : '';
    return '<button type="button" class="resource-favorite-card' + (favorite ? ' resource-favorite-card-active' : '') + '"'
      + ' aria-pressed="' + (favorite ? 'true' : 'false') + '" onclick="basculerRessourceFavorite(\'' + item.key + '\')">'
      + '<span class="resource-favorite-visual">' + tier + '<img src="' + item.icon + '" alt=""></span>'
      + '<span class="resource-favorite-info"><strong>' + item.label + '</strong><small>' + formaterNombre(etat[item.key] || 0) + '</small></span>'
      + '<span class="resource-favorite-star" aria-hidden="true">★</span>'
      + '</button>';
  }).join("");
}

function ouvrirGestionRessources() {
  rendreGestionRessources();
  ouvrirDialogueModal("resource-bar-modal", {
    dismissible: true,
    fermer: fermerGestionRessources,
    focusSelector: ".resource-favorite-card, .resource-bar-done",
    returnFocusSelector: ".ressources-gerer"
  });
}

function fermerGestionRessources() {
  fermerDialogueModal("resource-bar-modal");
}

function appliquerPreferencesRessourcesBandeau() {
  const u = dernierEtatDeblocageRessources || unlocks();
  RESOURCE_BAR_ITEMS.forEach(function(item) {
    ecrireStyle(domParId(item.rowId), "display", item.unlocked(u) && ressourceFavoriteBandeau(item.key) ? "flex" : "none");
  });
}

function basculerRessourceFavorite(key) {
  if (!RESOURCE_BAR_ITEMS.some(function(item) { return item.key === key; })) return;
  const masquees = ressourcesMasqueesBandeau();
  const index = masquees.indexOf(key);
  if (index >= 0) masquees.splice(index, 1);
  else masquees.push(key);
  appliquerPreferencesRessourcesBandeau();
  rendreGestionRessources();
  sauvegarder();
}

function afficherToutesRessourcesBandeau() {
  etat.resourceBarHidden = [];
  appliquerPreferencesRessourcesBandeau();
  rendreGestionRessources();
  sauvegarder();
}

function afficherRessourcesTierDeuxPlus() {
  etat.resourceBarHidden = RESOURCE_BAR_ITEMS
    .filter(function(item) { return item.tier === "T1"; })
    .map(function(item) { return item.key; });
  appliquerPreferencesRessourcesBandeau();
  rendreGestionRessources();
  sauvegarder();
}

function renduRessources(u) {
  dernierEtatDeblocageRessources = u;
  ecrireTexte(domParId("val-chatons"), etat.chatons + " / " + capaciteLogementCamp());
  [
    ["val-cardboard-planks", etat.cardboardPlanks],
    ["val-basic-wood-planks", etat.basicWoodPlanks],
    ["val-pebble-bricks", etat.pebbleBricks],
    ["val-rock-bricks", etat.rockBricks],
    ["val-salads", etat.salads],
    ["val-grilled-anchovy", etat.grilledAnchovy],
    ["val-human-leftovers", etat.humanLeftovers],
    ["val-human-workers-food", etat.humanWorkersFood],
    ["val-canned-cat-food", etat.cannedCatFood]
  ].forEach(function(entry) {
    ecrireTexte(domParId(entry[0]), formaterNombre(entry[1]));
  });
  const appealSummary = document.getElementById("camp-appeal-summary");
  if (appealSummary) {
    appealSummary.textContent = "Appeal " + scoreAttractiviteCamp().total;
    appealSummary.closest(".camp-appeal-wrap").hidden = !campDebloque();
  }

  [
    ["work", u.cathering],
    ["facilities", u.jobCenter],
    ["explorations", u.exploration && explorationCampFonctionnelle()],
    ["inventaire", u.inventaire]
  ].forEach(function(entry) {
    ecrireStyle(domParId("onglet-" + entry[0]), "display", entry[1] ? "inline-flex" : "none");
    actualiserBadgeOnglet(entry[0], entry[1]);
  });
  const campVisible = campDebloque();
  ecrireStyle(domParId("onglet-camp"), "display", campVisible ? "inline-flex" : "none");
  actualiserBadgeOnglet("camp", campVisible);
  actualiserIndicateurFormationJob();
  const logsVisible = etat.chatons >= 3;
  ecrireStyle(domParId("onglet-logs"), "display", logsVisible ? "inline-flex" : "none");
  actualiserBadgeOnglet("gang", true);
  actualiserBadgeOnglet("logs", logsVisible);
  actualiserIndicateursExploration();

  appliquerPreferencesRessourcesBandeau();

  var boostEl = domParId("work-boost-indicator");
  var boostActif = !!(etat.workBoostFinTs && Date.now() < etat.workBoostFinTs);
  if (document.body) document.body.classList.toggle("work-boost-actif", boostActif);
  if (boostEl) {
    if (boostActif) {
      var boostRestant = Math.ceil((etat.workBoostFinTs - Date.now()) / 1000);
      ecrireTexte(boostEl, "⚡ Work ×10 — " + formaterTemps(boostRestant));
      ecrireStyle(boostEl, "display", "block");
    } else {
      ecrireStyle(boostEl, "display", "none");
    }
  }

  RESOURCE_PAIRS.forEach(function(pair) {
    var resKey = pair.procRes.replace(/([A-Z])/g, '-$1').toLowerCase();
    afficherTauxNet("taux-" + resKey, pair.procUnlocked(u) ? tauxNetRessource(pair.procRes, u) : 0);
  });
}

function afficherTauxNet(elementId, net) {
  const el = domParId(elementId);
  if (!el) return;
  if (Math.abs(net) < 0.0005) {
    ecrireTexte(el, "");
    basculerClasse(el, "ressource-taux-positif", false);
    basculerClasse(el, "ressource-taux-negatif", false);
    return;
  }
  const parMin = net * 60;
  ecrireTexte(el, (parMin > 0 ? "+" : "") + parMin.toFixed(2) + "/m");
  basculerClasse(el, "ressource-taux-positif", net > 0);
  basculerClasse(el, "ressource-taux-negatif", net < 0);
}

// ── 9b. Catch sequence (header)
function renduSequence() {
  if (annulerArriveeChatQuatreAvantSawmill()) sauvegarder();
  const enCours = etat.sequenceEnCours && tempsRestantSequence() > 0;
  const pret = !enCours;
  const restant = etat.afficherTempsAjusteRecrutement
    ? tempsRestantSequence() / vitesseAttrapage()
    : tempsRestantSequence();
  const btnSeq   = domParId("bouton-sequence");
  const marker   = domParId("sequence-chat-marker");
  const recruit  = etat.chatons >= 3;
  document.body.classList.toggle("camp-recruitment-unlocked", recruit);
  const campPlein = recruit && campLogementSature();
  const tentativeOuverte = _catCatchActif || _recruitMiniJeuActif;
  const prochainNom = nomProchainChat();
  const prochainVisage = assurerVisageProchainChat();
  ecrirePropriete(btnSeq, "disabled", false);
  const statsWrapper = domParId("stats-attrapage-wrapper");
  ecrireStyle(statsWrapper, "display", recruit ? "" : "none");
  if (!recruit && statsAttrapageOuvert) definirStatsAttrapageOuvert(false);
  ecrireStyle(btnSeq, "display", pret && !tentativeOuverte ? "" : "none");
  basculerClasse(btnSeq, "recruit", recruit);
  ecrireTexte(btnSeq, campPlein ? "Camp full · Build housing" : (recruit ? "Recruit the Cat" : "Catch the Cat"));
  // The first three Cats still use the header cooldown. Later visitors show
  // their progress physically on the Camp map instead.
  ecrireStyle(domParId("conteneur-barre-sequence"), "display", recruit ? "none" : "block");
  setBarreProgress("barre-sequence", progressionSequence());
  if (marker && marker.getAttribute("src") !== prochainVisage) marker.setAttribute("src", prochainVisage);
  if (marker && marker.getAttribute("alt") !== prochainNom) marker.setAttribute("alt", prochainNom);
  ecrireTexte(domParId("info-sequence-timer"), campPlein
    ? etat.chatons + " / " + capaciteLogementCamp() + " places"
    : (enCours ? formaterTemps(restant) : "Ready"));
  ecrireTexte(domParId("info-sequence-label"), recruit
    ? (enCours ? "Cat approaching" : "Visitor at the blue house")
    : "Next Cat");

  renduVisiteurCampRecrutement();

  renduStatsAttrapage();
}

function activerRecrutementDepuisCamp(event) {
  if (event) {
    event.preventDefault();
    event.stopPropagation();
  }
  if (!recrutementDepuisCampDebloque()
      || !sequenceEstPrete() || etat.chatons < 3 || _recruitMiniJeuActif) return false;
  if (campLogementSature()) {
    expliquerCampPleinRecrutement();
    return false;
  }
  marquerSequencePrete();
  ouvrirMiniJeuRecruit();
  return true;
}

function renduVisiteurCampRecrutement() {
  const visiteur = document.getElementById("camp-recruit-visitor");
  const route = document.getElementById("camp-recruit-route");
  if (!visiteur) return;
  const visible = campDebloque() && etat.chatons >= 3 && recrutementDepuisCampDebloque();
  visiteur.hidden = !visible;
  if (route) route.hidden = !visible;
  if (!visible) {
    masquerMessageCapaciteRecrutementCamp();
    return;
  }
  const visage = assurerVisageProchainChat();
  const portrait = document.getElementById("camp-recruit-visitor-face");
  if (portrait && portrait.getAttribute("src") !== visage) portrait.setAttribute("src", visage);
  const prochainNom = nomProchainChat();
  if (portrait && portrait.getAttribute("alt") !== prochainNom) portrait.setAttribute("alt", prochainNom);
  const enCours = etat.sequenceEnCours && tempsRestantSequence() > 0;
  const progression = enCours ? progressionSequence() : 1;
  const progressionBornee = Math.min(1, Math.max(0, progression));
  // Keep the visitor on the same gentle curve drawn by the Camp route. The
  // residents remain centred beneath the porch, so both groups stay distinct.
  const gauche = 8 - 2 * progressionBornee * (1 - progressionBornee);
  const haut = 4 + 84 * progressionBornee;
  visiteur.style.setProperty("--camp-recruit-left", gauche.toFixed(2) + "%");
  visiteur.style.setProperty("--camp-recruit-top", haut.toFixed(2) + "%");
  if (route) {
    route.querySelectorAll("[data-camp-recruit-paw-step]").forEach(function(patte) {
      const etape = Number(patte.dataset.campRecruitPawStep);
      patte.classList.toggle("camp-recruit-paw-reached", progressionBornee >= etape);
    });
  }
  const statut = _recruitMiniJeuActif
    ? "Talking to Bernardo"
    : (enCours ? "Approaching · " + formaterTemps(tempsRestantSequence()) : "Waiting for Bernardo");
  const statutArrivee = document.getElementById("camp-recruit-arrival-status");
  ecrireTexte(statutArrivee, enCours ? formaterTemps(tempsRestantSequence()) : "");
  if (statutArrivee) statutArrivee.hidden = !enCours;
  visiteur.setAttribute("aria-label", prochainNom + " · " + statut);
  visiteur.classList.toggle("camp-recruit-visitor-arrived", !enCours);
  visiteur.classList.toggle("camp-recruit-visitor-ready", !enCours && !campLogementSature());
  if (enCours || !campLogementSature()) masquerMessageCapaciteRecrutementCamp();
}

// ── 9b-bis. Recruiting stats popover
let statsAttrapageOuvert = false;

function positionnerStatsAttrapagePopover() {
  const popover = document.getElementById("popover-stats-attrapage");
  const bouton = document.getElementById("bouton-stats-attrapage");
  if (!popover || !bouton) return;
  if (statsAttrapageOuvert && window.innerWidth <= 768) {
    const rect = bouton.getBoundingClientRect();
    popover.style.position = "fixed";
    popover.style.left = "8px";
    popover.style.right = "8px";
    popover.style.top = (rect.bottom + 10) + "px";
    popover.style.minWidth = "0";
    popover.style.maxWidth = "none";
  } else {
    ["position", "left", "right", "top", "minWidth", "maxWidth"].forEach(function(property) {
      popover.style[property] = "";
    });
  }
}

function definirStatsAttrapageOuvert(ouvert) {
  statsAttrapageOuvert = Boolean(ouvert);
  const popover = document.getElementById("popover-stats-attrapage");
  const bouton  = document.getElementById("bouton-stats-attrapage");
  popover.style.display = statsAttrapageOuvert ? "flex" : "none";
  popover.setAttribute("aria-hidden", statsAttrapageOuvert ? "false" : "true");
  bouton.setAttribute("aria-expanded", statsAttrapageOuvert ? "true" : "false");
  bouton.setAttribute("aria-label", statsAttrapageOuvert ? "Hide recruiting stats" : "Show recruiting stats");
  if (statsAttrapageOuvert) renduStatsAttrapage();
  positionnerStatsAttrapagePopover();
}

function toggleStatsAttrapage() {
  definirStatsAttrapageOuvert(!statsAttrapageOuvert);
}

function formaterTempsStat(sec) {
  return sec <= 0 ? "0s" : formaterTemps(sec);
}

function renduStatsAttrapage() {
  if (!statsAttrapageOuvert) return;
  const calcul = calculRecrutementCamp();
  const restant = sequenceEstPrete() ? 0 : tempsRestantSequence();
  const decorationRow = document.getElementById("stat-decorations-row");
  const territoryRow = document.getElementById("stat-territory-row");
  if (decorationRow) decorationRow.hidden = !decorationsAppealDebloquees();
  if (territoryRow) territoryRow.hidden = !territoireAppealDebloque();
  document.getElementById("stat-recruit-difficulty").textContent = "Cat " + (etat.chatons + 1);
  document.getElementById("stat-minimum").textContent = formaterTempsStat(calcul.tempsReference);
  document.getElementById("stat-appeal").textContent = calcul.attractivite.total;
  document.getElementById("stat-decorations").textContent = "+" + calcul.attractivite.decorations;
  document.getElementById("stat-territory").textContent = "+" + calcul.attractivite.territoire;
  document.getElementById("stat-prestige").textContent = "+" + calcul.attractivite.prestige;
  document.getElementById("stat-deficit").textContent = "×" + calcul.multiplicateurAppeal.toFixed(2);
  document.getElementById("stat-housing").textContent = etat.chatons + " / " + capaciteLogementCamp();
  document.getElementById("stat-raw").textContent = formaterTempsStat(calcul.dureeArrivee);
  document.getElementById("stat-adjusted").textContent = formaterTempsStat(restant);
}

document.addEventListener("click", function(e) {
  if (!statsAttrapageOuvert) return;
  const wrapper   = document.getElementById("stats-attrapage-wrapper");
  const catchBtn  = document.getElementById("bouton-sequence");
  if (wrapper && !wrapper.contains(e.target) && e.target !== catchBtn) {
    definirStatsAttrapageOuvert(false);
  }
});

document.addEventListener("keydown", function(e) {
  if (e.key !== "Escape" || !statsAttrapageOuvert) return;
  definirStatsAttrapageOuvert(false);
  document.getElementById("bouton-stats-attrapage").focus();
});
window.addEventListener("resize", positionnerStatsAttrapagePopover);
document.addEventListener("scroll", positionnerStatsAttrapagePopover, true);

// ── 9c. Work resources (separate Gathering and Processing views)
const RESOURCE_PAIRS = [
  {
    recipeId: "cardboardPlanks", family: "wood", tier: 1, rawTotalKey: "cardboardPiecesTotalRecolte", procTotalKey: "cardboardPlanksTotalProduit",
    rawAction: "woodcatting", rawRes: "cardboardPieces", rawCfg: CONFIG.woodcatting,
    rawLabel: "Cardboard Pieces", rawIcon: "img/resources/Cardboard Pieces_Final.png",
    rawUnlocked: function(u) { return u.cathering; },
    procAction: "sawmill", procRes: "cardboardPlanks", procCfg: CONFIG.sawmill,
    procLabel: "Cardboard Planks", procIcon: "img/resources/Cardboard Plank_Final.png",
    procSecUnite: "secondesParPlanche", procSecRaw: "secondesParCardboard",
    procMultAction: "sawmill", procUnlocked: function(u) { return u.scierie; },
    bloqueeKey: "scieriBloquee",
    inputs: [{ res: "cardboardPieces", label: "Cardboard Pieces", icon: "img/resources/Cardboard Pieces_Final.png", baseQuantity: 10, costAdjusted: true }]
  },
  {
    recipeId: "basicWoodPlanks", family: "wood", tier: 2, rawTotalKey: "basicWoodTotalRecolte",
    rawAction: "basicWoodcatting", rawRes: "basicWood", rawCfg: CONFIG.basicWoodcatting,
    rawLabel: "Basic Wood", rawIcon: "img/resources/Basic Wood_Final.png",
    rawUnlocked: function(u) { return u.basicWood; },
    procAction: "basicSawmill", procRes: "basicWoodPlanks", procCfg: CONFIG.basicSawmill,
    procLabel: "Basic Wood Planks", procIcon: "img/resources/Basic Wood Plank_Final.png",
    procSecUnite: "secondesParPlanche", procSecRaw: "secondesParBasicWood",
    procMultAction: "sawmill", procUnlocked: function(u) { return u.basicSawmill; },
    bloqueeKey: "basicSawmillBloquee",
    inputs: [{ res: "basicWood", label: "Basic Wood", icon: "img/resources/Basic Wood_Final.png", baseQuantity: 10, costAdjusted: true }]
  },
  {
    recipeId: "salads", family: "food", tier: 1, rawTotalKey: "catnipTotalRecolte",
    rawAction: "grasscatting", rawRes: "catnip", rawCfg: CONFIG.grasscatting,
    rawLabel: "Catnip", rawIcon: "img/resources/Catnip_Final.png",
    rawUnlocked: function(u) { return u.grasscat; },
    procAction: "catchen", procRes: "salads", procCfg: CONFIG.catchen,
    procLabel: "Catnip Salad", procIcon: "img/resources/Catnip Salad_Final.png",
    procSecUnite: "secondesParSalad", procSecRaw: "secondesParCatnip",
    procMultAction: "catchen", procUnlocked: function(u) { return u.catchen; },
    bloqueeKey: "catchenBloquee",
    inputs: [{ res: "catnip", label: "Catnip", icon: "img/resources/Catnip_Final.png", baseQuantity: 10, costAdjusted: true }]
  },
  {
    recipeId: "grilledAnchovy", family: "food", tier: 2, rawTotalKey: "anchovyTotalRecolte",
    rawAction: "fishcatting", rawRes: "anchovy", rawCfg: CONFIG.fishcatting,
    rawLabel: "Anchovy", rawIcon: "img/resources/Anchovy_Final.png?v=0.0029",
    rawUnlocked: function(u) { return u.anchovy; },
    procAction: "grilledAnchovy", procRes: "grilledAnchovy", procCfg: CONFIG.grilledAnchovy,
    procLabel: "Grilled Anchovy", procIcon: "img/resources/Grilled Anchovy_Final.png?v=0.0029",
    procSecUnite: "secondesParRecette", procSecRaw: "secondesParAnchovy",
    procMultAction: "grilledAnchovy", procUnlocked: function(u) { return u.grilledAnchovy; },
    bloqueeKey: "catchenAnchovyBloquee",
    inputs: [{ res: "anchovy", label: "Anchovy", icon: "img/resources/Anchovy_Final.png?v=0.0029", baseQuantity: 10, costAdjusted: true }]
  },
  {
    recipeId: "pebbleBricks", family: "rock", tier: 1, rawTotalKey: "pebblesTotalRecolte",
    rawAction: "pebblegathering", rawRes: "pebbles", rawCfg: CONFIG.pebblegathering,
    rawLabel: "Pebbles", rawIcon: "img/resources/Pebbles_Final.png",
    rawUnlocked: function(u) { return u.pebblecat; },
    procAction: "brickfactory", procRes: "pebbleBricks", procCfg: CONFIG.brickfactory,
    procLabel: "Pebble Bricks", procIcon: "img/resources/Pebble Brick_Final.png",
    procSecUnite: "secondesParBrique", procSecRaw: "secondesParPebble",
    procMultAction: "brickfactory", procUnlocked: function(u) { return u.brickfact; },
    bloqueeKey: "brickBloquee",
    inputs: [{ res: "pebbles", label: "Pebbles", icon: "img/resources/Pebbles_Final.png", baseQuantity: 10, costAdjusted: true }]
  },
  {
    recipeId: "rockBricks", family: "rock", tier: 2, rawTotalKey: "rocksTotalRecolte",
    rawAction: "rockgathering", rawRes: "rocks", rawCfg: CONFIG.rockgathering,
    rawLabel: "Rocks", rawIcon: "img/resources/Rock_Final.png",
    rawUnlocked: function(u) { return u.rockcat; },
    procAction: "rockFactory", procRes: "rockBricks", procCfg: CONFIG.rockFactory,
    procLabel: "Rock Bricks", procIcon: "img/resources/Rock Brick_Final.png",
    procSecUnite: "secondesParBrique", procSecRaw: "secondesParRock",
    procMultAction: "rockFactory", procUnlocked: function(u) { return u.rockfact; },
    bloqueeKey: "rockFactoryBloquee",
    inputs: [{ res: "rocks", label: "Rocks", icon: "img/resources/Rock_Final.png", baseQuantity: 10, costAdjusted: true }]
  }
];

const WORK_FAMILIES = {
  wood: { label: "Wood", gatheringScope: "Wood resources", gatheringManager: "wood", processingScope: "Sawmill and planks", processingManager: "sawmill" },
  food: { label: "Food", gatheringScope: "Raw food", gatheringManager: "food", processingScope: "Catchen and prepared food", processingManager: "catchen" },
  rock: { label: "Rocks", gatheringScope: "Raw stone", gatheringManager: "rock", processingScope: "Pawsonry and bricks", processingManager: "pawsonry" }
};

const WORK_BUILDING_BY_FAMILY = Object.freeze({
  wood: "sawmill",
  food: "catchen",
  rock: "pawsonry"
});

function recetteWorkContenuDebloque(pair, u) {
  return Boolean(pair && pair.rawUnlocked(u) && pair.procUnlocked(u));
}

function capaciteRecetteWork(pair, u) {
  if (!pair) return { available: false, reason: "This recipe does not exist." };
  const contentUnlocked = recetteWorkContenuDebloque(pair, u || unlocks());
  return capaciteBatimentCamp(
    WORK_BUILDING_BY_FAMILY[pair.family],
    pair.tier,
    { contentUnlocked: contentUnlocked }
  );
}

let workStructureInitialisee = false;
const WORK_MANUAL_FOCUS_BASE_MULTIPLIER = 2;
const WORK_MANUAL_FOCUS_BASE_SECONDS_PER_CLICK = 0.8;
const WORK_MANUAL_FOCUS_BASE_MAX_SECONDS = 30;
const WORK_MANUAL_FOCUS_LOW_SECONDS = 5;
let workManualFocus = null;

function manualFocusDebloque() {
  return etat.chatons >= 4;
}

function manualFocusMultiplier() {
  if (!etat.spherePerks || etat.spherePerks['gl-mini'] !== 'learned') {
    return WORK_MANUAL_FOCUS_BASE_MULTIPLIER;
  }
  return etat.spherePerks['gl-manual-power'] === 'learned' ? 4 : 3;
}

function manualFocusSecondsPerClick() {
  return etat.spherePerks && etat.spherePerks['gl-manual-click'] === 'learned'
    ? 2
    : WORK_MANUAL_FOCUS_BASE_SECONDS_PER_CLICK;
}

function manualFocusMaxSeconds() {
  return etat.spherePerks && etat.spherePerks['gl-manual-capacity'] === 'learned'
    ? 60
    : WORK_MANUAL_FOCUS_BASE_MAX_SECONDS;
}

function phaseActiveRecette(slot) {
  return slot && slot.phase === "processing" ? "processing" : "gathering";
}

function synchroniserReserveManualFocus(now) {
  if (!workManualFocus) return 0;
  now = Number(now) || Date.now();
  if (workManualFocus.kind === "camp") {
    const tacheCamp = retrouverTacheManualFocusCamp(workManualFocus);
    if (!tacheCamp || !tacheCamp.job || tacheCamp.job.readyToClaim) {
      workManualFocus = null;
      return 0;
    }
    if (workManualFocus.lastDrainTs) {
      const elapsedCamp = Math.max(0, (now - workManualFocus.lastDrainTs) / 1000);
      workManualFocus.reserveSeconds = Math.max(0, workManualFocus.reserveSeconds - elapsedCamp);
    }
    if (!(workManualFocus.reserveSeconds > 0)) {
      workManualFocus = null;
      return 0;
    }
    workManualFocus.lastDrainTs = now;
    return workManualFocus.reserveSeconds;
  }
  const slot = slotRecette(workManualFocus.familyId, workManualFocus.slotIdx);
  if (!slot || !slot.recipeId || slot.kittyIndex === null) {
    workManualFocus = null;
    return 0;
  }
  if (workManualFocus.lastDrainTs) {
    const elapsed = Math.max(0, (now - workManualFocus.lastDrainTs) / 1000);
    workManualFocus.reserveSeconds = Math.max(0, workManualFocus.reserveSeconds - elapsed);
  }
  if (!(workManualFocus.reserveSeconds > 0)) {
    workManualFocus = null;
    return 0;
  }
  workManualFocus.phase = phaseActiveRecette(slot);
  workManualFocus.lastDrainTs = now;
  return workManualFocus.reserveSeconds;
}

function manualFocusRecetteActif(familyId, slotIdx) {
  if (!(synchroniserReserveManualFocus() > 0) || !workManualFocus) return false;
  return workManualFocus.kind !== "camp"
    && workManualFocus.familyId === familyId && workManualFocus.slotIdx === slotIdx;
}

function manualFocusEstActif(familyId, slotIdx, phase) {
  return manualFocusRecetteActif(familyId, slotIdx)
    && workManualFocus.phase === phase;
}

function actualiserFocusManuelWork() {
  const reserve = synchroniserReserveManualFocus();
  document.querySelectorAll(".work-recipe-resource[data-manual-family]").forEach(function(card) {
    const familyId = card.dataset.manualFamily;
    const slotIdx = Number(card.dataset.manualSlot);
    const phase = card.dataset.manualPhase;
    const actif = reserve > 0 && !!workManualFocus && workManualFocus.phase === phase
      && workManualFocus.familyId === familyId && workManualFocus.slotIdx === slotIdx;
    const visible = actif;
    card.classList.toggle("work-manual-focus-active", actif);
    card.classList.toggle("work-manual-focus-low", visible && reserve <= WORK_MANUAL_FOCUS_LOW_SECONDS);
    const badge = card.querySelector(".work-manual-focus-badge");
    if (badge) {
      badge.setAttribute("aria-hidden", visible ? "false" : "true");
      const label = badge.querySelector(".work-manual-focus-label");
      const timer = badge.querySelector(".work-manual-focus-time");
      const fill = badge.querySelector(".work-manual-focus-fill");
      if (label) label.textContent = libelleManualFocus();
      if (timer) timer.textContent = libelleTempsManualFocus(reserve);
      if (fill) fill.style.width = Math.min(100, reserve / manualFocusMaxSeconds() * 100) + "%";
    }
  });
}

function annulerFocusManuelWork(familyId, slotIdx) {
  if (!workManualFocus) return;
  if (workManualFocus.kind === "camp" && familyId !== undefined) return;
  if (familyId !== undefined && (workManualFocus.familyId !== familyId || workManualFocus.slotIdx !== slotIdx)) return;
  workManualFocus = null;
  actualiserFocusManuelWork();
}

function poursuivreFocusManuelWork(familyId, slotIdx) {
  if (!workManualFocus
      || workManualFocus.kind === "camp"
      || workManualFocus.familyId !== familyId
      || workManualFocus.slotIdx !== slotIdx) return;
  synchroniserReserveManualFocus();
  actualiserFocusManuelWork();
}

function activerManualFocus(familyId, slotIdx, phase, evt) {
  if (evt) {
    evt.preventDefault();
    evt.stopPropagation();
  }
  const slot = slotRecette(familyId, slotIdx);
  if (!manualFocusDebloque() || !slot || !slot.recipeId || slot.kittyIndex === null) return;
  if (phaseActiveRecette(slot) !== phase) return;

  const now = Date.now();
  const memeRecette = !!workManualFocus
    && workManualFocus.familyId === familyId
    && workManualFocus.slotIdx === slotIdx;
  const reserve = memeRecette ? synchroniserReserveManualFocus(now) : 0;
  workManualFocus = {
    kind: "work",
    familyId: familyId,
    slotIdx: slotIdx,
    phase: phase,
    reserveSeconds: Math.min(
      manualFocusMaxSeconds(),
      reserve + manualFocusSecondsPerClick()
    ),
    lastDrainTs: now
  };
  actualiserFocusManuelWork();

  const card = evt && evt.currentTarget;
  if (card && card.classList) {
    card.classList.remove("work-manual-focus-tap");
    void card.offsetWidth;
    card.classList.add("work-manual-focus-tap");
    setTimeout(function() { card.classList.remove("work-manual-focus-tap"); }, 180);
  }
}

function modificateursManualFocus(familyId, slotIdx, slot) {
  const focused = manualFocusRecetteActif(familyId, slotIdx);
  return {
    gatheringManualSpeed: focused ? manualFocusMultiplier() : 1,
    processingManualSpeed: focused ? manualFocusMultiplier() : 1
  };
}

function vitessesManualFocusRecette(familyId, slotIdx) {
  const focused = manualFocusRecetteActif(familyId, slotIdx);
  const multiplier = focused ? manualFocusMultiplier() : 1;
  return {
    gathering: focused ? multiplier : 1,
    processing: focused ? multiplier : 1
  };
}

function dureesAffichageRecette(pair, kitty, familyId, slotIdx) {
  if (!pair || !kitty) return { gathering: Infinity, processing: Infinity, cycle: Infinity, gatheringSpeed: 1, processingSpeed: 1 };
  const manualSpeeds = vitessesManualFocusRecette(familyId, slotIdx);
  const gathering = dureeGatheringRecette(pair, kitty) / manualSpeeds.gathering;
  const processing = dureeProcessingRecette(pair, kitty) / manualSpeeds.processing;
  return {
    gathering: gathering,
    processing: processing,
    cycle: gathering + processing,
    gatheringSpeed: manualSpeeds.gathering,
    processingSpeed: manualSpeeds.processing
  };
}

function libelleManualFocus() {
  const compact = typeof window !== "undefined" && window.innerWidth <= 600;
  const multiplier = manualFocusMultiplier();
  return compact ? "FOCUS ×" + multiplier : "MANUAL FOCUS ×" + multiplier;
}

function libelleTempsManualFocus(reserve) {
  const maxSeconds = manualFocusMaxSeconds();
  if (reserve >= maxSeconds - 0.05) return "MAX " + maxSeconds + "s";
  const compact = typeof window !== "undefined" && window.innerWidth <= 600;
  return reserve.toFixed(1) + (compact ? "/" + maxSeconds + "s" : "s / " + maxSeconds + "s");
}

function manualFocusBadgeHtml(actif, reserve) {
  const visible = actif;
  const label = libelleManualFocus();
  const temps = libelleTempsManualFocus(reserve);
  const largeur = Math.min(100, reserve / manualFocusMaxSeconds() * 100);
  return '<span class="work-manual-focus-badge" aria-hidden="' + (visible ? 'false' : 'true') + '">'
    + '<span class="work-manual-focus-row"><span class="work-manual-focus-label">' + label + '</span><span class="work-manual-focus-time">' + temps + '</span></span>'
    + '<span class="work-manual-focus-track"><span class="work-manual-focus-fill" style="width:' + largeur + '%"></span></span>'
    + '</span>';
}

function initialiserWorkStructure() {
  if (workStructureInitialisee) return;
  synchroniserSlotsRecettesAvecPerks();
  const section = domParId("section-work-pairs");
  if (!section) return;
  const familyHtml = Object.keys(WORK_FAMILIES).map(function(familyId) {
    const family = WORK_FAMILIES[familyId];
    const slots = etat.workRecipeSlots[familyId] || [];
    const slotsHtml = slots.map(function(slot, slotIdx) {
      return '<article class="work-recipe-slot" id="recipe-slot-' + familyId + '-' + slotIdx + '"></article>';
    }).join("");
    return '<div id="famille-' + familyId + '" class="work-recipe-family">'
      + '<header class="work-recipe-family-header">'
      +   '<div><span class="pair-family-kicker">Production family</span><h2>' + family.label + '</h2></div>'
      +   '<section id="work-managers-' + familyId + '" class="work-recipe-managers" aria-label="' + family.label + ' managers" style="display:none">'
      +     '<div class="work-recipe-manager-card"><div class="pair-manager-copy"><span class="pair-manager-role">Gathering Manager</span></div><div id="manager-slot-' + family.gatheringManager + '" class="manager-slot-conteneur"></div></div>'
      +     '<div class="work-recipe-manager-card"><div class="pair-manager-copy"><span class="pair-manager-role">Processing Manager</span></div><div id="manager-slot-' + family.processingManager + '" class="manager-slot-conteneur"></div></div>'
      +   '</section>'
      + '</header>'
      + '<div class="work-recipe-slots" id="work-recipe-slots-' + familyId + '">'
      +   slotsHtml
      + '</div>'
      + '</div>';
  }).join("");
  section.innerHTML = '<div id="work-summary-all" class="work-summary-all" aria-label="Current production summary"></div>' + familyHtml;
  workStructureInitialisee = true;
}

function paireRecette(recipeId) {
  return RESOURCE_PAIRS.find(function(pair) { return pair.recipeId === recipeId; }) || null;
}

function slotRecette(familyId, slotIdx) {
  const slots = etat.workRecipeSlots && etat.workRecipeSlots[familyId];
  return slots && slots[slotIdx] ? slots[slotIdx] : null;
}

function recettesDisponiblesFamille(familyId, u) {
  return RESOURCE_PAIRS.filter(function(pair) {
    return pair.family === familyId && recetteWorkContenuDebloque(pair, u);
  }).sort(function(a, b) { return b.tier - a.tier; });
}

function libelleNombreDecimal(value, digits) {
  const number = Math.max(0, Number(value) || 0);
  if (Math.abs(number - Math.round(number)) < 0.005) return String(Math.round(number));
  return number.toFixed(digits === undefined ? 1 : digits);
}

function progressionsSlotRecette(slot, pair) {
  const empty = { gathering: 0, processing: 0, phase: 0, overall: 0 };
  // A recipe keeps its private progress when its Cat is removed. Continue to
  // derive the phase percentages from the slot so the paused Processing value
  // remains visible while the slot waits for another Cat.
  if (!slot || !pair) return empty;
  const gathered = Math.max(0, Number(slot.gatheredInputs && slot.gatheredInputs[pair.rawRes]) || 0);
  const target = quantiteInputEffective(pair, pair.inputs[0]);
  const gathering = slot.phase === "processing"
    ? 1
    : (target > 0 ? Math.max(0, Math.min(1, gathered / target)) : 0);
  const processing = slot.phase === "processing"
    ? Math.max(0, Math.min(1, Number(slot.phaseProgress) || 0))
    : 0;
  return {
    gathering: gathering,
    processing: processing,
    phase: slot.phase === "processing" ? processing : gathering,
    overall: (gathering + processing) / 2
  };
}

function workSummaryManagerHtml(label, managerFamily) {
  const kitty = managerKittyForFamily(managerFamily);
  const managerValue = kitty
    ? '<strong>' + echapperAttributHtml(kitty.nom) + '</strong>'
    : '<strong class="work-summary-manager-empty">None</strong>';
  return '<span class="work-summary-manager"><small>' + label + '</small>' + managerValue + '</span>';
}

function renduWorkSummary(unlockedFamilies) {
  const summary = domParId("work-summary-all");
  if (!summary) return;
  const jobCenterActif = batimentFonctionnelCamp("jobCenter").available;
  const stateParts = [jobCenterActif ? 1 : 0];
  const cards = unlockedFamilies.map(function(familyId) {
    const family = WORK_FAMILIES[familyId];
    const slots = etat.workRecipeSlots[familyId] || [];
    const availableSlotCount = slots.length;
    const active = [];
    const waiting = [];
    // Include the capacity in the render key so unlocking an additional empty
    // slot immediately refreshes the summary counter.
    stateParts.push(familyId + "-slots", availableSlotCount);

    slots.forEach(function(slot, slotIdx) {
      const pair = paireRecette(slot.recipeId);
      if (!pair) return;
      const kitty = slot.kittyIndex === null ? null : etat.kittiesData[slot.kittyIndex];
      if (!kitty) {
        waiting.push({ pair: pair, slotIdx: slotIdx });
        stateParts.push(familyId, slotIdx, pair.recipeId, "waiting");
        return;
      }
      const progress = progressionsSlotRecette(slot, pair).overall;
      const durations = dureesAffichageRecette(pair, kitty, familyId, slotIdx);
      const ratePerMinute = Number.isFinite(durations.cycle) && durations.cycle > 0
        ? productionProcBonus(kitty) / durations.cycle * 60
        : 0;
      active.push({ pair: pair, slotIdx: slotIdx, kitty: kitty, progress: progress, ratePerMinute: ratePerMinute });
      stateParts.push(familyId, slotIdx, pair.recipeId, slot.kittyIndex, kitty.niveau,
        Math.floor(progress * 100), ratePerMinute.toFixed(3));
    });

    let managerHtml = "";
    if (jobCenterActif) {
      const gatherManager = managerKittyForFamily(family.gatheringManager);
      const processManager = managerKittyForFamily(family.processingManager);
      stateParts.push(familyId + "-managers",
        gatherManager ? gatherManager.nom + ":" + managerSpeedMultiplier(gatherManager, family.gatheringManager).toFixed(2) : "none",
        processManager ? processManager.nom + ":" + managerSpeedMultiplier(processManager, family.processingManager).toFixed(2) : "none");
      managerHtml = '<div class="work-summary-managers">'
        + workSummaryManagerHtml("Gathering Manager", family.gatheringManager)
        + workSummaryManagerHtml("Processing Manager", family.processingManager)
        + '</div>';
    }

    const rowsHtml = active.map(function(item) {
      const progressPct = Math.round(item.progress * 100);
      const rateLabel = libelleNombreDecimal(item.ratePerMinute, 2) + "/min";
      return '<button type="button" class="work-summary-row" data-work-family="' + familyId + '" data-work-slot="' + item.slotIdx + '" onclick="ouvrirSlotDepuisResume(\'' + familyId + '\',' + item.slotIdx + ')" aria-label="Open ' + echapperAttributHtml(item.pair.procLabel) + ' produced by ' + echapperAttributHtml(item.kitty.nom) + ', ' + rateLabel + '">'
        + '<span class="work-summary-recipe"><span class="work-summary-tier work-tier-badge work-tier-badge-tier-' + item.pair.tier + '" aria-hidden="true">T' + item.pair.tier + '</span><img src="' + item.pair.procIcon + '" alt=""></span>'
        + '<span class="work-summary-worker">'
        +   '<span class="work-summary-ring" style="--prog:' + item.progress + '" role="progressbar" aria-label="Full recipe cycle progress" aria-valuemin="0" aria-valuemax="100" aria-valuenow="' + progressPct + '"><span class="work-summary-face">' + kittyIconHtml(item.kitty) + '</span></span>'
        +   '<span>' + echapperAttributHtml(item.kitty.nom) + ' (lvl ' + item.kitty.niveau + ')</span>'
        + '</span>'
        + '<strong class="work-summary-rate">' + rateLabel + '</strong>'
        + '<span class="work-summary-open" aria-hidden="true">›</span>'
        + '</button>';
    }).join("");

    const emptyHtml = active.length === 0
      ? '<div class="work-summary-empty">No active production</div>'
      : "";
    const goToFamilyHtml = active.length === 0
      ? '<button type="button" class="work-summary-go" onclick="ouvrirFamilleDepuisResume(\'' + familyId + '\')" aria-label="Go to ' + echapperAttributHtml(family.label) + ' production">Go to ' + echapperAttributHtml(family.label) + '</button>'
      : "";
    const waitingHtml = waiting.length > 0
      ? '<button type="button" class="work-summary-waiting" onclick="ouvrirRecetteEnAttenteDepuisResume(\'' + familyId + '\',' + waiting[0].slotIdx + ')">' + waiting.length + ' recipe' + (waiting.length > 1 ? 's' : '') + ' waiting for a Cat</button>'
      : "";

    return '<section class="work-summary-family work-summary-family-' + familyId + '">'
      + '<header class="work-summary-header"><div><span>Production family</span><h2>' + family.label + '</h2></div><strong' + (active.length ? '' : ' class="is-empty"') + '>' + active.length + '/' + availableSlotCount + ' ACTIVE</strong></header>'
      + managerHtml
      + '<div class="work-summary-list">' + rowsHtml + emptyHtml + goToFamilyHtml + waitingHtml + '</div>'
      + '</section>';
  }).join("");

  const stateKey = stateParts.join("|");
  if (summary.dataset.summaryState === stateKey) return;
  summary.dataset.summaryState = stateKey;
  summary.innerHTML = cards;
}

function ouvrirFamilleDepuisResume(familyId) {
  filtrerWork(familyId);
}

function ouvrirSlotDepuisResume(familyId, slotIdx) {
  filtrerWork(familyId);
  setTimeout(function() {
    const slot = domParId("recipe-slot-" + familyId + "-" + slotIdx);
    if (!slot) return;
    slot.scrollIntoView({ behavior: "smooth", block: "center" });
    slot.classList.remove("objectif-cible-highlight");
    void slot.offsetWidth;
    slot.classList.add("objectif-cible-highlight");
    const focusTarget = slot.querySelector(".work-recipe-selected");
    if (focusTarget) focusTarget.focus({ preventScroll: true });
    setTimeout(function() { slot.classList.remove("objectif-cible-highlight"); }, 1700);
  }, 80);
}

function ouvrirRecetteEnAttenteDepuisResume(familyId, slotIdx) {
  filtrerWork(familyId);
  setTimeout(function() { ouvrirModalWorkerRecette(familyId, slotIdx); }, 80);
}

function renduSlotRecette(familyId, slotIdx) {
  const el = domParId("recipe-slot-" + familyId + "-" + slotIdx);
  const slot = slotRecette(familyId, slotIdx);
  if (!el || !slot) return;
  const pair = paireRecette(slot.recipeId);
  const capacite = pair ? capaciteRecetteWork(pair, unlocks()) : null;
  const stockage = pair ? etatStockageRessource(pair.procRes) : null;
  const pauseReason = capacite && !capacite.available
    ? capacite.reason
    : (stockage && stockage.plein
      ? "Storage full for " + pair.procLabel + " (" + formaterNombre(stockage.stock)
        + " / " + formaterNombre(stockage.capacite) + ")."
      : "");
  const kitty = slot.kittyIndex === null ? null : etat.kittiesData[slot.kittyIndex];
  const progress = progressionsSlotRecette(slot, pair);
  const focusReserveForRender = synchroniserReserveManualFocus();
  const focusPhaseForRender = focusReserveForRender > 0 && workManualFocus
    && workManualFocus.familyId === familyId
    && workManualFocus.slotIdx === slotIdx
    ? workManualFocus.phase
    : "none";
  const stateKey = [slot.recipeId || "-", slot.kittyIndex, slot.phase,
    Math.floor(progress.gathering * 100), Math.floor(progress.processing * 100), Math.floor(progress.overall * 100),
    pair ? Math.floor((Number(slot.gatheredInputs[pair.rawRes]) || 0) * 10) : 0,
    kitty ? kitty.niveau : -1, batimentFonctionnelCamp("jobCenter").available ? 1 : 0,
    pair ? Math.floor((Number(etat[pair.procRes]) || 0) * 100) : 0,
    pair ? multiplicateurCoutFamille(pair.procMultAction) : 1,
    pair ? multiplicateurFamille(pair.rawAction) : 1,
    pair ? multiplicateurFamille(pair.procMultAction) : 1,
    workBoostMult(), gangLeaderBonus(), manualFocusDebloque() ? 1 : 0,
    focusPhaseForRender, manualFocusMultiplier(),
    capacite && capacite.available ? 1 : 0,
    capacite ? capacite.reason : "",
    stockage ? stockage.capacite : 0,
    pauseReason].join("|");
  if (el.dataset.recipeState === stateKey) return;
  el.dataset.recipeState = stateKey;
  el.dataset.recipePhase = slot.phase;
  el.classList.toggle("work-recipe-slot-paused", Boolean(pauseReason));

  if (!pair) {
    el.innerHTML = '<div class="work-recipe-slot-top work-recipe-slot-top-empty"><span class="work-recipe-slot-number" aria-label="Recipe slot ' + (slotIdx + 1) + '">' + (slotIdx + 1) + '</span></div>'
      + '<button class="work-recipe-choose-empty" onclick="ouvrirModalRecette(\'' + familyId + '\',' + slotIdx + ')">'
      + '<span class="work-recipe-choose-plus">+</span><strong>Choose a recipe</strong><small>Then assign a Cat to produce it</small></button>';
    if (_workPopupContext && _workPopupContext.familyId === familyId && _workPopupContext.slotIdx === slotIdx) hideResPopup();
    return;
  }

  const input = pair.inputs[0];
  const target = quantiteInputEffective(pair, input);
  const gathered = Math.min(target, Math.max(0, Number(slot.gatheredInputs[pair.rawRes]) || 0));
  const gatherRate = kitty ? tauxGatheringRecette(pair, kitty) : 0;
  const durations = kitty ? dureesAffichageRecette(pair, kitty, familyId, slotIdx) : null;
  const gatherDuration = durations ? durations.gathering : Infinity;
  const gatherUnitDuration = kitty && gatherRate > 0
    ? 1 / (gatherRate * durations.gatheringSpeed)
    : Infinity;
  const outputPerCycle = kitty ? productionProcBonus(kitty) : 1;
  const outputRate = kitty && durations && durations.cycle > 0 ? outputPerCycle / durations.cycle : 0;
  const processingDuration = durations ? durations.processing : Infinity;
  const fullCycleDuration = durations ? durations.cycle : Infinity;
  const catHtml = kitty
    ? '<div class="work-recipe-cat-ring" style="--prog:' + progress.overall + '" role="progressbar" aria-label="Full recipe progress" aria-valuemin="0" aria-valuemax="100" aria-valuenow="' + Math.round(progress.overall * 100) + '"><div class="work-recipe-cat-face"' + attributsActivationClavier("Change " + kitty.nom + " assigned to this recipe") + ' onclick="ouvrirModalWorkerRecette(\'' + familyId + '\',' + slotIdx + ')">' + kittyIconHtml(kitty) + '</div>'
      + '<button class="work-recipe-cat-remove" aria-label="Remove ' + echapperAttributHtml(kitty.nom) + ' from this recipe" onclick="retirerWorkerRecette(\'' + familyId + '\',' + slotIdx + ');event.stopPropagation()"><img src="img/interface/Red Cross_Final.png?v=0.0029" alt=""></button></div>'
      + '<strong class="work-recipe-cat-name">' + echapperAttributHtml(kitty.nom) + '</strong>'
      + '<span class="work-recipe-cat-rate">' + libelleNombreDecimal(outputRate * 60, 2) + '/min</span>'
      + '<span class="work-recipe-cat-cycle">Cycle: ' + formaterTemps(fullCycleDuration) + '</span>'
    : '<button class="work-recipe-cat-empty" onclick="ouvrirModalWorkerRecette(\'' + familyId + '\',' + slotIdx + ')" aria-label="Assign a Cat to ' + echapperAttributHtml(pair.procLabel) + '">+</button><strong class="work-recipe-cat-name">Assign a Cat</strong>';

  const currentPhase = phaseActiveRecette(slot);
  const gatherFocusable = manualFocusDebloque() && !!kitty && currentPhase === "gathering";
  const processFocusable = manualFocusDebloque() && !!kitty && currentPhase === "processing";
  const gatherFocusActive = manualFocusEstActif(familyId, slotIdx, "gathering");
  const processFocusActive = manualFocusEstActif(familyId, slotIdx, "processing");
  const manualFocusReserve = synchroniserReserveManualFocus();
  const gatherTrigger = gatherFocusable
    ? attributsActivationClavier("Apply Manual Focus to Gathering for " + pair.procLabel)
      + ' onclick="activerManualFocus(\'' + familyId + '\',' + slotIdx + ',\'gathering\',event)"'
    : "";
  const produceTrigger = processFocusable
    ? attributsActivationClavier("Apply Manual Focus to Processing for " + pair.procLabel)
      + ' onclick="activerManualFocus(\'' + familyId + '\',' + slotIdx + ',\'processing\',event)"'
    : "";
  const gatherInfo = '<button type="button" class="work-recipe-info-btn" aria-label="Show production details for ' + echapperAttributHtml(pair.rawLabel) + '" data-work-family="' + familyId + '" data-work-slot="' + slotIdx + '" data-work-phase="gather" aria-controls="inv-res-popup" aria-expanded="false" onclick="toggleWorkResourcePopup(this,event)">?</button>';
  const processInfo = '<button type="button" class="work-recipe-info-btn" aria-label="Show production details for ' + echapperAttributHtml(pair.procLabel) + '" data-work-family="' + familyId + '" data-work-slot="' + slotIdx + '" data-work-phase="process" aria-controls="inv-res-popup" aria-expanded="false" onclick="toggleWorkResourcePopup(this,event)">?</button>';

  const pauseHtml = pauseReason
    ? '<p class="work-recipe-building-status" role="status"><strong>Paused</strong><span>'
      + echapperAttributHtml(pauseReason) + '</span></p>'
    : '';
  el.innerHTML = pauseHtml + '<div class="work-recipe-slot-top">'
    + '<span class="work-recipe-slot-number" aria-label="Recipe slot ' + (slotIdx + 1) + '">' + (slotIdx + 1) + '</span>'
    + '<button type="button" class="work-recipe-selected" aria-label="Change recipe in slot ' + (slotIdx + 1) + ', currently Tier ' + pair.tier + ' ' + echapperAttributHtml(pair.procLabel) + '" onclick="ouvrirModalRecette(\'' + familyId + '\',' + slotIdx + ')"><span class="work-recipe-tier work-tier-badge work-tier-badge-tier-' + pair.tier + '" aria-hidden="true">T' + pair.tier + '</span><img src="' + pair.procIcon + '" alt=""><span><small>RECIPE</small><strong>' + pair.procLabel + '</strong></span><span class="work-recipe-change">Change</span></button>'
    + '</div>'
    + '<div class="work-recipe-flow">'
    + '<section class="work-recipe-resource work-recipe-resource-input' + (gatherFocusable ? ' work-manual-focus-available' : '') + (gatherFocusActive ? ' work-manual-focus-active' : '') + '" data-manual-family="' + familyId + '" data-manual-slot="' + slotIdx + '" data-manual-phase="gathering"' + gatherTrigger + ' style="--fill:' + Math.round(progress.gathering * 100) + '%">' + gatherInfo + manualFocusBadgeHtml(gatherFocusActive, manualFocusReserve) + '<span class="work-recipe-node-kicker">GATHERING</span><img src="' + pair.rawIcon + '" alt=""><strong>' + pair.rawLabel + '</strong><span class="work-recipe-gathered">' + libelleNombreDecimal(gathered, 1) + ' / ' + libelleNombreDecimal(target, 1) + '</span><small>' + (kitty ? formaterTemps(gatherDuration) + ' (1 every ' + formaterTemps(gatherUnitDuration) + ')' : 'Input') + '</small></section>'
      + '<section class="work-recipe-cat">' + catHtml + '</section>'
    + '<section class="work-recipe-resource work-recipe-resource-output' + (processFocusable ? ' work-manual-focus-available' : '') + (processFocusActive ? ' work-manual-focus-active' : '') + '" data-manual-family="' + familyId + '" data-manual-slot="' + slotIdx + '" data-manual-phase="processing"' + produceTrigger + ' style="--fill:' + Math.round(progress.processing * 100) + '%">' + processInfo + manualFocusBadgeHtml(processFocusActive, manualFocusReserve) + '<span class="work-recipe-node-kicker">PROCESSING</span><img src="' + pair.procIcon + '" alt=""><strong>' + pair.procLabel + '</strong><span class="work-recipe-output-progress">' + Math.round(progress.processing * 100) + '%</span>' + (kitty ? '<small class="work-recipe-output-details">' + formaterTemps(processingDuration) + ' for ' + libelleNombreDecimal(outputPerCycle, 2) + ' · Stock ' + formaterNombre(etat[pair.procRes]) + ' / ' + formaterNombre(stockage.capacite) + '</small>' : '<small class="work-recipe-output-details">Output</small>') + '</section>'
    + '</div>';
  if (_workPopupContext && _workPopupContext.familyId === familyId && _workPopupContext.slotIdx === slotIdx) {
    const trigger = el.querySelector('.work-recipe-info-btn[data-work-phase="' + _workPopupContext.phase + '"]');
    if (trigger) showWorkResourcePopup(trigger);
    else hideResPopup();
  }
}

function actualiserIndicateursExploration() {
  const indicateur = document.getElementById("exploration-tab-alerts");
  if (!indicateur) return;
  const campaignReady = Object.values(etat.resultatsCampaigns).some(function(resultat) { return resultat.success; });
  const revealReady = Object.values(etat.resultatsExplorationZones).some(function(resultat) { return resultat.success; });
  const emojis = (revealReady ? "🔍" : "") + (campaignReady ? "🎁" : "");
  const labels = [];
  if (revealReady) labels.push("zone ready to reveal");
  if (campaignReady) labels.push("campaign reward ready");
  ecrireTexte(indicateur, emojis);
  ecrireStyle(indicateur, "display", emojis ? "inline-flex" : "none");
  ecrirePropriete(indicateur, "aria-label", labels.join(", "));
  basculerClasse(document.getElementById("onglet-explorations"), "onglet-alerte", !!emojis);
}

function actualiserIndicateurFormationJob() {
  const bouton = document.getElementById("onglet-facilities");
  if (!bouton) return;
  const enAttente = !!(etat.formationTermineeEnAttente || etat.formationIngenieurTermineeEnAttente);
  basculerClasse(bouton, "onglet-formation-alerte", enAttente);
  const labelElement = bouton.querySelector(".onglet-label");
  const label = labelElement ? labelElement.textContent.trim() : "Facilities";
  const labelAccessible = label + (enAttente ? " (training ready to validate)" : "");
  if (bouton.getAttribute("aria-label") !== labelAccessible) bouton.setAttribute("aria-label", labelAccessible);
  if (enAttente) bouton.title = label + " - Training ready to validate";
  else if (!bouton.classList.contains("onglet-nouveau") && bouton.hasAttribute("title")) bouton.removeAttribute("title");
}

function quantiteInputEffective(pair, input) {
  const baseQuantity = Number.isFinite(input.baseQuantity)
    ? input.baseQuantity
    : pair.procCfg[pair.procSecUnite] / pair.procCfg[pair.procSecRaw];
  const costMultiplier = input.costAdjusted === false ? 1 : multiplicateurCoutFamille(pair.procMultAction);
  return baseQuantity * costMultiplier;
}

function tauxGatheringRecette(pair, kitty) {
  if (!pair || !kitty) return 0;
  return multiplicateurFamille(pair.rawAction)
    * multiplicateurProductionFamille(pair.rawAction)
    * Math.pow(1.05, kitty.niveau)
    * gangLeaderBonus()
    * workBoostMult()
    / pair.rawCfg.secondesParUnite;
}

function dureeGatheringRecette(pair, kitty) {
  if (!pair || !kitty) return Infinity;
  const rawRate = tauxGatheringRecette(pair, kitty);
  const input = pair.inputs[0];
  const target = quantiteInputEffective(pair, input);
  return rawRate > 0 && target > 0 ? target / rawRate : Infinity;
}

function dureeProcessingRecette(pair, kitty) {
  if (!pair || !kitty) return Infinity;
  const processingSpeed = multiplicateurFamille(pair.procMultAction) * gangLeaderBonus() * workBoostMult();
  const processingSeconds = Number(pair.procCfg[pair.procSecUnite]);
  return processingSpeed > 0 && processingSeconds > 0 ? processingSeconds / processingSpeed : Infinity;
}

function dureeCycleRecette(pair, kitty) {
  if (!pair || !kitty) return Infinity;
  const gatheringDuration = dureeGatheringRecette(pair, kitty);
  const processingDuration = dureeProcessingRecette(pair, kitty);
  if (!Number.isFinite(gatheringDuration) || !Number.isFinite(processingDuration)) return Infinity;
  return gatheringDuration + processingDuration;
}

function tauxProductionSlotRecette(pair, slot) {
  if (!slot || slot.kittyIndex === null || slot.recipeId !== pair.recipeId) return 0;
  const kitty = etat.kittiesData[slot.kittyIndex];
  const slotIdx = (etat.workRecipeSlots[pair.family] || []).indexOf(slot);
  const cycleDuration = slotIdx >= 0
    ? dureesAffichageRecette(pair, kitty, pair.family, slotIdx).cycle
    : dureeCycleRecette(pair, kitty);
  return Number.isFinite(cycleDuration) && cycleDuration > 0 ? productionProcBonus(kitty) / cycleDuration : 0;
}

function tauxProductionBrute(action) {
  const pair = RESOURCE_PAIRS.find(function(candidate) { return candidate.rawAction === action; });
  if (!pair) return 0;
  return (etat.workRecipeSlots[pair.family] || []).reduce(function(total, slot) {
    if (slot.recipeId !== pair.recipeId || slot.kittyIndex === null) return total;
    return total + tauxGatheringRecette(pair, etat.kittiesData[slot.kittyIndex]);
  }, 0);
}

function tauxProductionTransformee(pair) {
  return (etat.workRecipeSlots[pair.family] || []).reduce(function(total, slot) {
    return total + tauxProductionSlotRecette(pair, slot);
  }, 0);
}

// Simple resources are private slot inputs, so only processed outputs expose a
// shared production rate.
function tauxProductionRessource(resourceKey, u) {
  let rate = 0;
  RESOURCE_PAIRS.forEach(function(pair) {
    if (pair.procRes === resourceKey && pair.rawUnlocked(u)) rate += tauxProductionTransformee(pair);
  });
  return rate;
}

function tauxConsommationRessource() { return 0; }

function tauxNetRessource(resourceKey, u) {
  return tauxProductionRessource(resourceKey, u) - tauxConsommationRessource(resourceKey, u);
}

function libelleTauxNetCourt(net) {
  const parMin = net * 60;
  if (Math.abs(parMin) < 0.005) return "0.00/m";
  return (parMin > 0 ? "+" : "") + parMin.toFixed(2) + "/m";
}

function sourceProductionRessource(resourceKey) {
  for (let i = 0; i < RESOURCE_PAIRS.length; i++) {
    const pair = RESOURCE_PAIRS[i];
    if (pair.rawRes === resourceKey) {
      return { family: pair.family, action: pair.rawAction, recipeId: pair.recipeId, targetId: "work-recipe-slots-" + pair.family, label: pair.rawLabel };
    }
    if (pair.procRes === resourceKey) {
      return { family: pair.family, action: pair.procAction, recipeId: pair.recipeId, targetId: "work-recipe-slots-" + pair.family, label: pair.procLabel };
    }
  }
  return null;
}

function mettreEnEvidenceRessourceWork(source) {
  if (!source) return;
  setTimeout(function() {
    const cible = domParId(source.targetId);
    if (!cible) return;
    cible.scrollIntoView({ behavior: "smooth", block: "center" });
    cible.classList.remove("objectif-cible-highlight");
    void cible.offsetWidth;
    cible.classList.add("objectif-cible-highlight");
    setTimeout(function() { cible.classList.remove("objectif-cible-highlight"); }, 1700);
  }, 80);
}

function allerRessourceWork(resourceKey) {
  const source = sourceProductionRessource(resourceKey);
  if (!source) return;
  filtrerWork(source.family);
  mettreEnEvidenceRessourceWork(source);
}

function ouvrirAllocationRessource(resourceKey) {
  const source = sourceProductionRessource(resourceKey);
  if (!source) return;
  filtrerWork(source.family);
  const slots = etat.workRecipeSlots[source.family] || [];
  let slotIdx = slots.findIndex(function(slot) { return slot.recipeId === source.recipeId && slot.kittyIndex === null; });
  if (slotIdx < 0) slotIdx = slots.findIndex(function(slot) { return !slot.recipeId; });
  if (slotIdx < 0) { mettreEnEvidenceRessourceWork(source); return; }
  if (!slots[slotIdx].recipeId) slots[slotIdx].recipeId = source.recipeId;
  ouvrirModalWorkerRecette(source.family, slotIdx);
}

function renduWorkPairs(u) {
  if (synchroniserSlotsRecettesAvecPerks()) workStructureInitialisee = false;
  initialiserWorkStructure();

  // Each family button appears only when at least one gathering tier is unlocked.
  const setDisplay = function(id, show) { ecrireStyle(domParId(id), "display", show ? "" : "none"); };
  setDisplay("filtre-work-all", u.cathering);
  setDisplay("filtre-work-wood", u.cathering);
  setDisplay("filtre-work-food", u.grasscat);
  setDisplay("filtre-work-rock", u.pebblecat || u.rockcat);
  const filtresBar = document.querySelector(".work-filtres");
  ecrireStyle(filtresBar, "display", u.cathering ? "" : "none");

  const sectionEl = domParId("section-work-pairs");
  if (!u.cathering) { ecrireStyle(sectionEl, "display", "none"); return; }
  ecrireStyle(sectionEl, "display", "");
  const indiceEl = domParId("work-discovery-hint");
  if (indiceEl) ecrireStyle(
    indiceEl,
    "display",
    localStorage.getItem(WORK_DETAILS_HINT_STORAGE_KEY) ? "none" : "flex"
  );

  // Gang Leader passive speed banner
  const banner = domParId("gang-leader-banner");
  if (banner) {
    const gl = etat.kittiesData.find(function(k) { return k.metier === "gang-leader"; });
    if (gl) {
      const mult = gangLeaderBonus();
      ecrireStyle(banner, "display", "");
      ecrireHTML(banner, "👑 <strong>" + gl.nom + "</strong> is leading the gang: ×" + mult.toFixed(2) + " work speed (" + etat.kittiesData.length + " cats · " + gl.nom + " Lvl " + gl.niveau + ")");
    } else {
      ecrireStyle(banner, "display", "none");
    }
  }

  const unlockedFamilies = ["wood"];
  if (u.grasscat) unlockedFamilies.push("food");
  if (u.pebblecat || u.rockcat) unlockedFamilies.push("rock");
  const availableFilters = ["all"].concat(unlockedFamilies);
  if (!availableFilters.includes(workFiltre)) workFiltre = "all";
  document.body.dataset.workFilter = workFiltre;
  ["all", "wood", "food", "rock"].forEach(function(familyId) {
    const button = domParId("filtre-work-" + familyId);
    if (!button) return;
    const active = familyId === workFiltre;
    basculerClasse(button, "btn-filtre-work-actif", active);
    button.setAttribute("aria-pressed", active ? "true" : "false");
  });

  const summaryVisible = workFiltre === "all";
  ecrireStyle(domParId("btn-unaffect-all"), "display", summaryVisible ? "" : "none");
  ecrireStyle(domParId("work-summary-all"), "display", summaryVisible ? "grid" : "none");
  ["wood", "food", "rock"].forEach(function(familyId) {
    const familyEl = domParId("famille-" + familyId);
    const visible = familyId === workFiltre && unlockedFamilies.includes(familyId);
    const familyHeader = familyEl && familyEl.querySelector(".work-recipe-family-header");
    ecrireStyle(familyEl, "display", visible ? "grid" : "none");
    const jobCenterActif = batimentFonctionnelCamp("jobCenter").available;
    ecrireStyle(domParId("work-managers-" + familyId), "display", visible && jobCenterActif ? "grid" : "none");
    basculerClasse(familyHeader, "work-recipe-family-header-no-manager", !visible || !jobCenterActif);
  });

  unlockedFamilies.forEach(function(familyId) {
    const discovered = recettesDisponiblesFamille(familyId, u);
    (etat.workRecipeSlots[familyId] || []).forEach(function(slot) {
      if (slot.recipeId && !discovered.some(function(pair) { return pair.recipeId === slot.recipeId; })) {
        reinitialiserProgressionRecette(slot, true);
      }
    });
  });

  if (summaryVisible) {
    renduWorkSummary(unlockedFamilies);
  } else {
    const currentFamily = WORK_FAMILIES[workFiltre];
    if (currentFamily && batimentFonctionnelCamp("jobCenter").available) {
      renderManagerSlot(currentFamily.gatheringManager);
      renderManagerSlot(currentFamily.processingManager);
    }
    (etat.workRecipeSlots[workFiltre] || []).forEach(function(slot, slotIdx) {
      renduSlotRecette(workFiltre, slotIdx);
    });
  }

  ["wood", "food", "rock"].forEach(function(familyId) {
    const badge = domParId("work-warning-" + familyId);
    const firstRecipe = recettesDisponiblesFamille(familyId, u).slice(-1)[0] || null;
    const familyCapacity = firstRecipe ? capaciteRecetteWork(firstRecipe, u) : null;
    if (badge) {
      ecrireTexte(badge, familyCapacity && !familyCapacity.available ? "!" : "");
      badge.hidden = !(familyCapacity && !familyCapacity.available);
      badge.title = familyCapacity && !familyCapacity.available ? familyCapacity.reason : "";
    }
    const button = domParId("filtre-work-" + familyId);
    if (button) button.setAttribute("aria-label", WORK_FAMILIES[familyId].label + " recipes"
      + (familyCapacity && !familyCapacity.available ? ". " + familyCapacity.reason : ""));
  });
  const allButton = domParId("filtre-work-all");
  if (allButton) allButton.setAttribute("aria-label", "All active production");
  actualiserFocusManuelWork();
}

function fermerWorkDiscoveryHint() {
  localStorage.setItem(WORK_DETAILS_HINT_STORAGE_KEY, "1");
  const indiceEl = document.getElementById("work-discovery-hint");
  if (indiceEl) ecrireStyle(indiceEl, "display", "none");
}

// Tapping or keyboard-activating a resource icon opens its detailed tooltip.
(function() {
  const section = document.getElementById("section-work-pairs");
  if (!section) return;
  section.querySelectorAll(".pair-icon").forEach(function(icon) {
    rendreActivableClavier(icon, "Show details for " + (icon.alt || "this resource"));
    icon.setAttribute("aria-expanded", "false");
  });

  function fermerInfosPaires() {
    document.querySelectorAll(".pair-row.pair-info-ouverte").forEach(function(r) {
      r.classList.remove("pair-info-ouverte");
      const trigger = r.querySelector(".pair-icon[data-clavier-clic]");
      if (trigger) trigger.setAttribute("aria-expanded", "false");
    });
  }

  section.addEventListener("click", function(e) {
    const icon = e.target.closest(".pair-icon");
    if (!icon) return;
    const row = icon.closest(".pair-row");
    if (!row) return;
    const dejaOuverte = row.classList.contains("pair-info-ouverte");
    fermerInfosPaires();
    if (!dejaOuverte) {
      row.classList.add("pair-info-ouverte");
      icon.setAttribute("aria-expanded", "true");
    }
    fermerWorkDiscoveryHint();
    e.stopPropagation();
  });
  document.addEventListener("click", function() {
    fermerInfosPaires();
  });
  // Desktop: position fixed tooltip so it appears below the hovered row without clipping.
  section.addEventListener("mouseover", function(e) {
    const row = e.target.closest(".pair-row");
    if (!row) return;
    const info = row.querySelector(".pair-info");
    if (!info) return;
    const rect = row.getBoundingClientRect();
    info.style.top   = rect.bottom + "px";
    info.style.left  = rect.left + "px";
    info.style.width = rect.width + "px";
  });
})();

// ── 9d. Buildings section
function badgeTierCout(tier) {
  return '<span class="cout-tier-badge work-tier-badge-tier-' + tier + '" aria-label="Tier ' + tier + '">T' + tier + '</span>';
}

function renduBuildings(u) {
  if (!u.buildings) return;

  // ── Wood Houses
  const cout = coutProchaineCathouse();
  ecrireTexte(domParId("possede-cathouse"), etat.cathouses.length);
  ecrireTexte(domParId("cout-cathouse"), cout);
  ecrirePropriete(domParId("bouton-cathouse"), "disabled", etat.cardboardPlanks < cout);
  const cardboardBoxesActives = cardboardBoxesActivesCampPrototype();
  ecrireTexte(domParId("reduction-active"), etat.cathouses.length > 0
    ? "+" + (cardboardBoxesActives * CAMP_HOUSING_CAPACITY.cardboardBox)
      + " Cat capacity"
      + (DEV_MODE ? " · " + cardboardBoxesActives + "/" + etat.cathouses.length
        + " connected" : "")
    : "");

  ecrireStyle(domParId("bloc-wood-cathouse"), "display", u.catHouse ? "flex" : "none");
  const autoBuildDisponible = spherePerkLearned('builder-auto');
  const autoBuildToggle = domParId("builder-auto-toggle");
  ecrireStyle(autoBuildToggle, "display", autoBuildDisponible ? "flex" : "none");
  const autoBuildInput = domParId("toggle-auto-build-wood-houses");
  if (autoBuildInput) autoBuildInput.checked = !!etat.autoBuildWoodHouses;
  if (u.catHouse) {
    const cout2 = coutProchaineCatHouse();
    ecrireTexte(domParId("possede-cathouse2"), etat.cathouseCount);
    ecrireTexte(domParId("cout-cathouse2"), cout2);
    ecrirePropriete(domParId("bouton-cathouse2"), "disabled", etat.basicWoodPlanks < cout2);
    ecrireTexte(domParId("reduction-wood-cathouse"), etat.cathouseCount > 0
      ? "+" + (etat.cathouseCount * CAMP_HOUSING_CAPACITY.woodCathouse) + " Cat capacity" : "");
  }

  renderManagerSlot("houses");

  // ── Stone Houses
  const secStone = domParId("section-stone-houses");
  ecrireStyle(secStone, "display", u.stoneHouses || u.solidStoneCathouse ? "" : "none");
  if (u.stoneHouses || u.solidStoneCathouse) {
    const sc = coutProchaineStoneCathouse();
    const btnSC = domParId("bouton-stone-cathouse");
    ecrirePropriete(btnSC, "disabled", etat.basicWoodPlanks < sc.planks || etat.pebbleBricks < sc.bricks);
    ecrireTexte(domParId("cout-stone-planks"), sc.planks);
    ecrireTexte(domParId("cout-stone-bricks"), sc.bricks);
    ecrireTexte(domParId("possede-stone-cathouse"), etat.stoneCathouseCount);
    ecrireTexte(domParId("reduction-stone-cathouse"), etat.stoneCathouseCount > 0
      ? "+" + (etat.stoneCathouseCount * CAMP_HOUSING_CAPACITY.stoneCathouse) + " Cat capacity" : "");

    const blocSolid = domParId("bloc-solid-stone-cathouse");
    ecrireStyle(blocSolid, "display", u.solidStoneCathouse ? "flex" : "none");
    if (u.solidStoneCathouse) {
      const solid = coutProchaineSolidStoneCathouse();
      ecrirePropriete(domParId("bouton-solid-stone-cathouse"), "disabled",
        etat.basicWoodPlanks < solid.planks || etat.rockBricks < solid.bricks);
      ecrireTexte(domParId("cout-solid-stone-planks"), solid.planks);
      ecrireTexte(domParId("cout-solid-stone-bricks"), solid.bricks);
      ecrireTexte(domParId("possede-solid-stone-cathouse"), etat.solidStoneCathouseCount);
      ecrireTexte(domParId("reduction-solid-stone-cathouse"), etat.solidStoneCathouseCount > 0
        ? "+" + (etat.solidStoneCathouseCount * CAMP_HOUSING_CAPACITY.solidStoneCathouse) + " Cat capacity" : "");
    }
  }
}

// ── 9e. Facilities section
let facilitiesMobileVue = "jobs";

function actualiserSousOngletsFacilities(u) {
  const nav = domParId("facilities-subtabs");
  const contenu = domParId("contenu-facilities");
  if (!nav || !contenu) return;

  const sousOngletsVisibles = !!u.trainingCenter;
  if (facilitiesMobileVue === "lab" && !u.laboratory) facilitiesMobileVue = "jobs";

  nav.dataset.hasTabs = sousOngletsVisibles ? "true" : "false";
  nav.dataset.tabCount = u.laboratory ? "3" : "2";
  nav.setAttribute("aria-hidden", sousOngletsVisibles ? "false" : "true");
  contenu.dataset.facilitiesView = facilitiesMobileVue;
  document.body.classList.toggle("facilities-subtabs-actifs", sousOngletsVisibles);

  ["jobs", "training", "lab"].forEach(function(view) {
    const bouton = domParId("facilities-subtab-" + view);
    if (!bouton) return;
    const actif = view === facilitiesMobileVue;
    bouton.classList.toggle("facilities-subtab-active", actif);
    bouton.classList.toggle("btn-filtre-work-actif", actif);
    bouton.setAttribute("aria-selected", actif ? "true" : "false");
    bouton.tabIndex = actif ? 0 : -1;
  });

  const boutonLab = domParId("facilities-subtab-lab");
  if (boutonLab) ecrireStyle(boutonLab, "display", u.laboratory ? "" : "none");
}

function selectionnerVueFacilitiesMobile(view) {
  const u = unlocks();
  if (view !== "jobs" && view !== "training" && view !== "lab") return;
  if (view === "training" && !u.trainingCenter) return;
  if (view === "lab" && !u.laboratory) return;
  facilitiesMobileVue = view;
  jcDirty = true;
  labDirty = true;
  _tcKey = null;
  rendu();
  requestAnimationFrame(function() {
    const cibleId = view === "training" ? "section-training-center" : (view === "lab" ? "section-laboratory" : "section-job-center");
    const section = domParId(cibleId);
    if (section) section.scrollIntoView({ block: "start" });
  });
}

function renduFacilities(u) {
  if (!u.jobCenter) return;
  actualiserSousOngletsFacilities(u);
  const btnJC = domParId("bouton-jobcenter");
  const jcCapacity = batimentFonctionnelCamp("jobCenter");
  const jcItem = itemCampPrototypeParType("jobCenter");
  const jcConstruction = jcItem && constructionBatimentCampPourItem(jcItem.uid);
  ecrirePropriete(btnJC, "disabled", Boolean(jcConstruction)
    || (!etat.jobCenterConstruit && (etat.pebbleBricks < 10 || etat.basicWoodPlanks < 1)));
  ecrireHTML(btnJC, jcCapacity.available ? CHECK_ICON + " Built in Camp"
    : (jcConstruction ? "Construction in progress"
      : (etat.jobCenterConstruit ? "Check placement in Camp" :
    '<span class="cout-groupe">10' + badgeTierCout(1) + '<img class="cout-icone" src="img/resources/Pebble Brick_Final.png" alt="Pebble Brick"></span>'
    + '<span class="cout-groupe cout-groupe-suite"><span class="cout-plus">+</span>1' + badgeTierCout(2) + '<img class="cout-icone" src="img/resources/Basic Wood Plank_Final.png" alt="Basic Wood Plank"></span>')));
  const jcIface = domParId("jc-interface");
  ecrireStyle(jcIface, "display", jcCapacity.available ? "block" : "none");
  if (jcCapacity.available) renduJobCenter(u);

  const secTC = domParId("section-training-center");
  const facilities = domParId("contenu-facilities");
  if (facilities) facilities.classList.toggle("training-center-available", !!u.trainingCenter);
  if (secTC) {
    ecrireStyle(secTC, "display", u.trainingCenter ? "" : "none");
    if (u.trainingCenter) {
      const btnTC = domParId("bouton-training-center");
      const tcCapacity = batimentFonctionnelCamp("trainingCenter");
      const tcItem = itemCampPrototypeParType("trainingCenter");
      const tcConstruction = tcItem && constructionBatimentCampPourItem(tcItem.uid);
      if (btnTC) {
        ecrirePropriete(btnTC, "disabled", Boolean(tcConstruction)
          || (!etat.trainingCenterConstruit && (etat.rockBricks < 10 || etat.basicWoodPlanks < 20)));
        ecrireHTML(btnTC, tcCapacity.available ? CHECK_ICON + " Built in Camp"
          : (tcConstruction ? "Construction in progress"
            : (etat.trainingCenterConstruit ? "Check placement in Camp" :
          '<span class="cout-groupe">10' + badgeTierCout(2) + '<img class="cout-icone" src="img/resources/Rock Brick_Final.png" alt="Rock Brick"></span>'
          + '<span class="cout-groupe cout-groupe-suite"><span class="cout-plus">+</span>20' + badgeTierCout(2) + '<img class="cout-icone" src="img/resources/Basic Wood Plank_Final.png" alt="Basic Wood Plank"></span>')));
      }
      const tcOverview = domParId("tc-overview");
      const tcIface = domParId("tc-interface");
      const tcIntro = domParId("training-center-intro-copy");
      ecrireStyle(tcOverview, "display", "block");
      ecrireTexte(tcIntro, tcCapacity.available
        ? "Select a cat to review its specialization sphere."
        : "A place where cats sharpen their skills. Unlock specializations to make every job more powerful.");
      ecrireStyle(tcIface, "display", tcCapacity.available ? "block" : "none");
      if (tcCapacity.available) renduTrainingCenter();
    }
  }

  const secLab = domParId("section-laboratory");
  if (secLab) {
    ecrireStyle(secLab, "display", u.laboratory ? "" : "none");
    if (u.laboratory) {
      const btnLab = domParId("bouton-laboratory");
      const labCapacity = batimentFonctionnelCamp("laboratory");
      const labItem = itemCampPrototypeParType("laboratory");
      const labConstruction = labItem && constructionBatimentCampPourItem(labItem.uid);
      if (btnLab) {
        ecrirePropriete(btnLab, "disabled", Boolean(labConstruction)
          || (!etat.laboratoryConstruit && (etat.rockBricks < 100 || etat.basicWoodPlanks < 100)));
        ecrireHTML(btnLab, labCapacity.available ? CHECK_ICON + " Built in Camp"
          : (labConstruction ? "Construction in progress"
            : (etat.laboratoryConstruit ? "Check placement in Camp" :
          '<span class="cout-groupe">100' + badgeTierCout(2) + '<img class="cout-icone" src="img/resources/Rock Brick_Final.png" alt="Rock Brick"></span>'
          + '<span class="cout-groupe cout-groupe-suite"><span class="cout-plus">+</span>100' + badgeTierCout(2) + '<img class="cout-icone" src="img/resources/Basic Wood Plank_Final.png" alt="Basic Wood Plank"></span>')));
      }
      const labIface = domParId("laboratory-interface");
      if (labIface) {
        ecrireStyle(labIface, "display", labCapacity.available ? "block" : "none");
        if (labCapacity.available) renduLaboratoire();
      }
    }
  }
}

// ── 9f-i. Laboratory engineering training
let labEngineerKittySelectionne = null;
let labEngineerMetierSelectionne = null;
let labDirty = true;
let labRenderKey = null;

function laboratoireKittysDisponibles() {
  return etat.kittiesData.reduce(function(acc, kitty, index) {
    if (kitty && kitty.metier === null && !kittyIsBusy(index) && !kittyIsInExplorationStaging(index)) acc.push({ kitty: kitty, index: index });
    return acc;
  }, []);
}

function laboratoireEtatCle() {
  const training = etat.formationIngenieurEnCours;
  const available = laboratoireKittysDisponibles().map(function(entry) { return entry.index; }).join(",");
  const engineers = ingenieursFormes().map(function(kitty) {
    return kitty.nom + ":" + (kitty.niveau || 0) + ":" + (kitty.engineerRank || 1);
  }).join(",");
  return [
    training ? [training.kittyIndex, training.metier, training.engineerRank || 1, training.startTs, training.duree].join(":") : "idle",
    etat.formationIngenieurTermineeEnAttente ? [etat.formationIngenieurTermineeEnAttente.kittyIndex, etat.formationIngenieurTermineeEnAttente.engineerRank || 1, etat.formationIngenieurTermineeEnAttente.finishedTs].join(":") : "no-pending",
    labEngineerKittySelectionne === null ? "none" : labEngineerKittySelectionne,
    labEngineerMetierSelectionne || "none",
    available,
    engineers,
    etat.engineerRankUpgradesDebloques ? "ranks-unlocked" : "ranks-locked"
  ].join("|");
}

function renduLaboratoire() {
  const el = document.getElementById("laboratory-interface");
  if (!el || !etat.laboratoryConstruit) return;
  const training = etat.formationIngenieurEnCours;
  const available = laboratoireKittysDisponibles();
  if (labEngineerKittySelectionne !== null
      && !available.some(function(entry) { return entry.index === labEngineerKittySelectionne; })) {
    labEngineerKittySelectionne = null;
  }
  const renderKey = laboratoireEtatCle();
  if (labDirty || labRenderKey !== renderKey) {
    let html = '<div class="jc-section-titre">DISCOVERING</div>';
    if (etat.formationIngenieurTermineeEnAttente) {
      labEngineerKittySelectionne = null;
      labEngineerMetierSelectionne = null;
      const completed = etat.formationIngenieurTermineeEnAttente;
      const completedKitty = etat.kittiesData[completed.kittyIndex];
      html += '<div class="jc-formation-terminee">';
      html += '<div class="jc-slot-filled"><span class="jc-slot-emoji">' + kittyIconHtml(completedKitty) + '</span>';
      html += '<div class="jc-slot-info"><span class="jc-slot-nom">' + (completedKitty ? echapperAttributHtml(completedKitty.nom) : "Cat") + '</span>';
      html += '<span class="jc-slot-metier">Camp Engineer · Rank ' + (completed.engineerRank || 1) + ' learned!</span></div></div>';
      html += '<button type="button" class="btn-jc-validate" onclick="validerFormationIngenieur()">✓ Validate formation</button>';
      html += '</div>';
    } else if (training) {
      const kitty = etat.kittiesData[training.kittyIndex];
      html += '<div class="jc-formation-en-cours"><div class="jc-slot-filled">';
      html += '<span class="jc-slot-emoji">' + kittyIconHtml(kitty) + '</span>';
      html += '<div class="jc-slot-info"><span class="jc-slot-nom">' + (kitty ? echapperAttributHtml(kitty.nom) : "Cat") + '</span><span class="jc-slot-metier">Becoming Camp Engineer · Rank ' + (training.engineerRank || 1) + '...</span></div>';
      html += '</div><div class="inv-learning-barre jc-learning-barre">'
        + '<div id="barre-lab-formation" class="inv-learning-progres"></div>'
        + '<img id="lab-training-marker" class="inv-learning-marker" src="' + (kitty && kitty.visage ? kitty.visage : CAT_FACES.bernardo) + '" alt="' + (kitty ? echapperAttributHtml(kitty.nom) : 'Cat') + '">'
        + '</div><div class="jc-timer lab-jc-timer"></div></div>';
    } else {
      const duree = laboratoireIngenieurDuree();
      if (labEngineerKittySelectionne !== null && etat.kittiesData[labEngineerKittySelectionne]) {
        const selected = etat.kittiesData[labEngineerKittySelectionne];
        html += '<div class="jc-slot-wrap"><div class="jc-slot-filled" data-jc-modal-trigger="engineer"' + attributsActivationClavier("Change the Stray Cat selected for engineering training") + ' onclick="ouvrirModalJC(\'engineer\')">';
        html += '<span class="jc-slot-emoji">' + kittyIconHtml(selected) + '</span><div class="jc-slot-info"><span class="jc-slot-nom">' + echapperAttributHtml(selected.nom) + '</span><span class="jc-slot-metier">Stray Cat</span></div></div>';
        html += '<button class="jc-slot-remove" aria-label="Remove ' + echapperAttributHtml(selected.nom) + ' from engineering training" onclick="labEngineerKittySelectionne=null;labDirty=true;renduLaboratoire();event.stopPropagation()"><img src="img/interface/Red Cross_Final.png?v=0.0029" alt=""></button></div>';
      } else {
        html += '<div class="jc-slot-empty" data-jc-modal-trigger="engineer"' + attributsActivationClavier("Select an unassigned cat for engineering training") + ' onclick="ouvrirModalJC(\'engineer\')"><span class="jc-slot-plus">+</span><span class="jc-slot-label">Select an unassigned cat</span></div>';
      }

      html += '<div class="jc-metiers">';
      const metier = METIERS[ENGINEER_JOB_ID];
      const metierDisponible = ingenieurPeutEtreForme(ENGINEER_JOB_ID);
      const metierDejaAppris = !metierDisponible;
      html += '<span class="jc-metier-info-wrap" data-jc-job-info="' + ENGINEER_JOB_ID + '" onmouseenter="afficherInfoMetierJC(\'' + ENGINEER_JOB_ID + '\', this.firstElementChild)" onmouseleave="masquerInfoMetierJC()" onfocusin="afficherInfoMetierJC(\'' + ENGINEER_JOB_ID + '\', this.firstElementChild)" onfocusout="masquerInfoMetierJC()" onclick="afficherInfoMetierJC(\'' + ENGINEER_JOB_ID + '\', this.firstElementChild);event.stopPropagation()">';
      html += '<button data-jc-job-id="' + ENGINEER_JOB_ID + '" class="jc-metier-btn' + (labEngineerMetierSelectionne === ENGINEER_JOB_ID && metierDisponible ? ' jc-metier-actif' : '') + '"' + (metierDejaAppris ? ' disabled title="Already trained or rank unavailable"' : ' onclick="selectionnerMetierIngenieur(\'' + ENGINEER_JOB_ID + '\');event.stopPropagation()"') + '>' + (metier ? metier.emoji + ' ' + metier.nom : 'Camp Engineer') + (metierDejaAppris ? ' ✓' : '') + '</button></span>';
      html += '</div>';
      html += '<button class="btn-jc-train"' + (!metierDisponible || labEngineerKittySelectionne === null || labEngineerMetierSelectionne !== ENGINEER_JOB_ID ? ' disabled' : '') + ' onclick="lancerFormationIngenieur()">⏱ Train (' + formaterTemps(duree) + ')</button>';
    }
    el.innerHTML = html;
    labRenderKey = renderKey;
    labDirty = false;
  }

  if (training) {
    const elapsed = Math.min(training.duree, Math.max(0, (Date.now() - training.startTs) / 1000));
    const pct = training.duree ? Math.round(elapsed / training.duree * 100) : 100;
    ecrireStyle(domParId("barre-lab-formation"), "width", pct + "%");
    ecrireStyle(domParId("lab-training-marker"), "left", pct + "%");
    ecrireTexte(el.querySelector(".lab-jc-timer"), formaterTemps(Math.max(0, training.duree - elapsed)));
  }
}

function selectionnerIngenieurLaboratoire(index) {
  if (etat.formationIngenieurEnCours || !etat.kittiesData[index] || etat.kittiesData[index].metier !== null || kittyIsBusy(index) || kittyIsInExplorationStaging(index)) return;
  labEngineerKittySelectionne = index;
  labDirty = true;
  if (jcModalOuvert && jcModalOuvert.mode === "engineer") {
    jouerSonAffectation();
    fermerModalJC();
  }
  renduLaboratoire();
}

function selectionnerMetierIngenieur(jobId) {
  if (jobId !== ENGINEER_JOB_ID || !ingenieurPeutEtreForme(jobId)) return;
  labEngineerMetierSelectionne = jobId;
  labDirty = true;
  renduLaboratoire();
}

function lancerFormationIngenieur() {
  if (!batimentFonctionnelCamp("laboratory").available || etat.formationIngenieurEnCours || etat.formationIngenieurTermineeEnAttente || !ingenieurPeutEtreForme(ENGINEER_JOB_ID) || labEngineerKittySelectionne === null || labEngineerMetierSelectionne !== ENGINEER_JOB_ID) return;
  const kitty = etat.kittiesData[labEngineerKittySelectionne];
  if (!kitty || kitty.metier !== null || kittyIsBusy(labEngineerKittySelectionne) || kittyIsInExplorationStaging(labEngineerKittySelectionne)) return;
  const engineerRank = rangIngenieurSuivant(ENGINEER_JOB_ID);
  etat.formationIngenieurEnCours = {
    kittyIndex: labEngineerKittySelectionne,
    metier: ENGINEER_JOB_ID,
    engineerRank: engineerRank,
    startTs: Date.now(),
    duree: laboratoireIngenieurDuree()
  };
  labEngineerKittySelectionne = null;
  labDirty = true;
  afficherNotification("🔬 Camp Engineer training started.");
  ajouterLog("event", kitty.nom + " started Camp Engineer training.");
  sauvegarder(); rendu();
}

function terminerFormationIngenieur() {
  const training = etat.formationIngenieurEnCours;
  if (!training) return;
  const kitty = etat.kittiesData[training.kittyIndex];
  etat.formationIngenieurEnCours = null;
  etat.formationIngenieurTermineeEnAttente = {
    kittyIndex: training.kittyIndex,
    metier: training.metier,
    engineerRank: training.engineerRank || 1,
    finishedTs: Date.now()
  };
  if (kitty) {
    kitty.metier = ENGINEER_JOB_ID;
    kitty.engineerRank = Math.max(1, Number(training.engineerRank) || rangIngenieurSuivant(ENGINEER_JOB_ID));
    afficherNotification("🔧 " + kitty.nom + " is now a Camp Engineer (Rank " + kitty.engineerRank + ")!");
    ajouterLog("unlock", kitty.nom + " trained as a Camp Engineer (Rank " + kitty.engineerRank + "). Their passive AFK bonus is now active.");
  }
  labDirty = true;
  sauvegarder(); rendu(); renduManagement();
}

function validerFormationIngenieur() {
  if (!etat.formationIngenieurTermineeEnAttente) return;
  etat.formationIngenieurTermineeEnAttente = null;
  labEngineerKittySelectionne = null;
  labEngineerMetierSelectionne = null;
  labDirty = true;
  sauvegarder();
  rendu();
  renduManagement();
}

// ── 9f-ii. Training Center specialization
function trainingCenterKitties() {
  const metierOrder = Object.keys(METIERS);
  const roster = etat.kittiesData.reduce(function(acc, k, i) {
    if (k && k.metier && METIERS[k.metier] && k.metier !== "camp-engineer") acc.push({ k: k, i: i });
    return acc;
  }, []);
  roster.sort(function(a, b) {
    const aBernardo = a.k.nom === "Bernardo";
    const bBernardo = b.k.nom === "Bernardo";
    if (aBernardo !== bBernardo) return aBernardo ? -1 : 1;
    const aOrder = metierOrder.indexOf(a.k.metier);
    const bOrder = metierOrder.indexOf(b.k.metier);
    if (aOrder !== bOrder) return aOrder - bOrder;
    return a.i - b.i;
  });
  return roster;
}

function sphereEtatEffectif(sphere) {
  if (!sphere) return null;
  // A job's central perk is acquired with the job and can never be downgraded
  // by an adjacent perk trying to unlock one of its connections.
  if (sphere.etat === 'learned') return 'learned';
  return (etat.spherePerks && etat.spherePerks[sphere.id]) || sphere.etat;
}

function synchroniserDeblocagesSpherePerks() {
  if (!etat.spherePerks) etat.spherePerks = {};
  var changed = false;
  var unlockedSomething = true;
  while (unlockedSomething) {
    unlockedSomething = false;
    Object.keys(SPHERE_GRIDS).forEach(function(jobId) {
      var grid = SPHERE_GRIDS[jobId];
      var byId = {};
      grid.spheres.forEach(function(sphere) { byId[sphere.id] = sphere; });
      grid.connections.forEach(function(connection) {
        var parent = byId[connection[0]];
        var child = byId[connection[1]];
        if (!parent || !child) return;
        var parentState = parent.etat === 'learned'
          ? 'learned'
          : (etat.spherePerks[parent.id] || parent.etat);
        var childState = etat.spherePerks[child.id] || child.etat;
        if (parentState === 'learned' && childState === 'locked') {
          etat.spherePerks[child.id] = 'unlocked';
          unlockedSomething = true;
          changed = true;
        }
      });
    });
  }
  return changed;
}

function renduTrainingCenter() {
  const el = document.getElementById("tc-interface");
  if (!el || !etat.trainingCenterConstruit) return;

  const roster = trainingCenterKitties();
  const rosterKey = roster.map(function(entry) {
    return entry.i + ":" + entry.k.metier + ":" + (entry.k.jobNiveau || 0);
  }).join(",");
  const selectedExists = roster.some(function(entry) { return entry.i === tcSpecKittySelectionne; });
  if (!selectedExists) tcSpecKittySelectionne = roster.length > 0 ? roster[0].i : null;
  const k = tcSpecKittySelectionne !== null ? etat.kittiesData[tcSpecKittySelectionne] : null;
  const selectedGrid = k && SPHERE_GRIDS[k.metier];
  const sphereKey = selectedGrid ? selectedGrid.spheres.map(function(s) {
    return s.id + ":" + sphereEtatEffectif(s);
  }).join(",") : "";
  const key = rosterKey + '|' + (tcSpecKittySelectionne ?? '') + '|' + (k ? k.metier + '|' + k.jobNiveau : '') + '|' + sphereKey;
  if (key === _tcKey) return;
  _tcKey = key;

  let html = '<div class="tc-workspace">';
  if (k) {
    const pickerMetier = METIERS[k.metier];
    const pickerLevel = jobLevelInfo(k.metier);
    html += '<button type="button" class="tc-mobile-picker" data-jc-modal-trigger="spec" onclick="ouvrirModalJC(\'spec\')" aria-label="Change the cat selected for specialization">';
    html += '<span class="tc-cat-icon">' + kittyIconHtml(k) + '</span>';
    html += '<span class="tc-cat-info"><span class="tc-cat-name">' + echapperAttributHtml(k.nom) + '</span><span class="tc-cat-job">' + (pickerMetier ? pickerMetier.emoji + ' ' + pickerMetier.nom : k.metier) + ' · Lv. ' + pickerLevel.cur + '/' + pickerLevel.max + '</span></span>';
    html += '<span class="tc-mobile-picker-action">Change</span></button>';
  } else {
    html += '<button type="button" class="tc-mobile-picker tc-mobile-picker-empty" data-jc-modal-trigger="spec" onclick="ouvrirModalJC(\'spec\')"><span class="jc-slot-plus">+</span><span>Select a cat with a job</span></button>';
  }
  html += '<div class="tc-workspace-grid">';
  html += '<aside class="tc-roster tc-roster-desktop" aria-label="Cats with jobs">';
  html += '<div class="tc-roster-title">Cats with jobs</div>';
  html += '<div class="tc-roster-list" role="group" aria-label="Cats with jobs">';
  if (roster.length === 0) {
    html += '<p class="tc-empty">Train a cat in the Job Center first.</p>';
  } else {
    roster.forEach(function(entry) {
      const kitty = entry.k;
      const metier = METIERS[kitty.metier];
      const level = jobLevelInfo(kitty.metier);
      const active = entry.i === tcSpecKittySelectionne;
      html += '<button type="button" class="tc-cat-card' + (active ? ' tc-cat-card-active' : '') + '" aria-pressed="' + (active ? 'true' : 'false') + '" onclick="selectionnerTrainingCat(' + entry.i + ')">';
      html += '<span class="tc-cat-icon">' + kittyIconHtml(kitty) + '</span>';
      html += '<span class="tc-cat-info"><span class="tc-cat-name">' + echapperAttributHtml(kitty.nom) + '</span><span class="tc-cat-job">' + (metier ? metier.emoji + ' ' + metier.nom : kitty.metier) + '</span></span>';
      html += '<span class="tc-cat-level">Lv. ' + level.cur + '/' + level.max + '</span>';
      html += '</button>';
    });
  }
  html += '</div></aside>';
  html += '<section class="tc-sphere-column" aria-label="Selected cat specialization">';
  if (k) {
    const metier = METIERS[k.metier];
    const level = jobLevelInfo(k.metier);
    html += '<div class="tc-selected-cat">';
    html += '<div class="tc-selected-icon">' + kittyIconHtml(k) + '</div>';
    html += '<div><div class="tc-selected-name">' + echapperAttributHtml(k.nom) + '</div><div class="tc-selected-job">' + (metier ? metier.emoji + ' ' + metier.nom : k.metier) + ' · Specialization Lv. ' + level.cur + ' / ' + level.max + '</div></div>';
    html += '</div>';
    if (selectedGrid) html += '<div id="sphere-grid-container" class="sphere-grid-wrapper"></div>';
    else html += '<p class="tc-empty">This job does not have a specialization sphere yet.</p>';
  } else {
    html += '<div class="tc-empty tc-empty-large">Select a cat to view its sphere.</div>';
  }
  html += '</section></div></div>';
  el.innerHTML = html;
  if (k && selectedGrid) renduSphereGrid(k.metier);
}

function renduSphereGrid(jobId) {
  var containerEl = document.getElementById('sphere-grid-container');
  if (!containerEl) return;
  _sphereGridJob      = jobId;
  _sphereSelectionnee = null;

  var def = SPHERE_GRIDS[jobId];
  if (!def) { containerEl.innerHTML = ''; return; }

  var sphereMap = {};
  def.spheres.forEach(function(s) { sphereMap[s.id] = s; });

  // Resolve actual state without ever downgrading a job's learned central perk.
  function sphereEtat(s) {
    return sphereEtatEffectif(s);
  }

  var parts = [];
  var sphereFogNow = Date.now();
  var sphereFogClass = SPHERE_FOG_MOTION_ENABLED ? ' sphere-fog-motion' : '';
  var sphereFogStyle = '--sphere-fog-animation-delay:-' + (sphereFogNow % MAP_FOG_ANIMATION_DURATION_MS) + 'ms;'
    + '--sphere-fog-secondary-animation-delay:-' + (sphereFogNow % MAP_FOG_SECONDARY_DURATION_MS) + 'ms;';
  parts.push('<svg viewBox="0 0 580 580" xmlns="http://www.w3.org/2000/svg" class="sphere-svg' + sphereFogClass + '" style="' + sphereFogStyle + '">');
  parts.push(
    '<defs>'
    + '<clipPath id="sphere-fog-clip"><rect x="0" y="0" width="580" height="580" rx="12" ry="12"></rect></clipPath>'
    + '<filter id="sphere-fog-seam-softener" x="-2%" y="-1%" width="104%" height="102%" color-interpolation-filters="sRGB">'
    + '<feGaussianBlur in="SourceGraphic" stdDeviation="1.8 0"></feGaussianBlur>'
    + '</filter>'
    + '</defs>'
    + '<g clip-path="url(#sphere-fog-clip)">'
    + '<rect x="0" y="0" width="580" height="580" fill="#2f2925"></rect>'
    + '<g class="sphere-fog-primary-track" filter="url(#sphere-fog-seam-softener)">'
    + '<image href="img/Maps/Perks fog.png" x="0" y="0" width="580" height="580" preserveAspectRatio="none"></image>'
    + '<image href="img/Maps/Perks fog.png" x="0" y="0" width="580" height="580" preserveAspectRatio="none" transform="translate(1160 0) scale(-1 1)"></image>'
    + '<image href="img/Maps/Perks fog.png" x="1160" y="0" width="580" height="580" preserveAspectRatio="none"></image>'
    + '</g>'
    + '<g class="sphere-fog-secondary-track" filter="url(#sphere-fog-seam-softener)">'
    + '<image href="img/Maps/Perks fog.png" x="0" y="-35" width="580" height="650" preserveAspectRatio="none"></image>'
    + '<image href="img/Maps/Perks fog.png" x="0" y="-35" width="580" height="650" preserveAspectRatio="none" transform="translate(1160 0) scale(-1 1)"></image>'
    + '<image href="img/Maps/Perks fog.png" x="1160" y="-35" width="580" height="650" preserveAspectRatio="none"></image>'
    + '</g></g>'
  );

  // Connections
  def.connections.forEach(function(conn) {
    var a = sphereMap[conn[0]], b = sphereMap[conn[1]];
    if (!a || !b) return;
    var learned = sphereEtat(a) === 'learned';
    parts.push(
      '<line x1="' + a.x + '" y1="' + a.y + '" x2="' + b.x + '" y2="' + b.y + '"'
      + ' stroke="' + (learned ? a.couleur : '#cccccc') + '" stroke-width="2"'
      + (learned ? '' : ' stroke-dasharray="6 4"') + '/>'
    );
  });

  // Spheres
  def.spheres.forEach(function(s) {
    var actualEtat = sphereEtat(s);
    var isLearned  = actualEtat === 'learned';
    var isUnlocked = actualEtat === 'unlocked';
    var fill, strokeColor, textColor, opacity;
    if (isLearned) {
      fill = s.couleur; strokeColor = 'rgba(255,255,255,0.5)'; textColor = '#ffffff'; opacity = 1;
    } else if (isUnlocked) {
      fill = '#ffffff'; strokeColor = s.couleur; textColor = s.couleur; opacity = 1;
    } else {
      // Keep locked nodes visually muted through their grey palette, but leave
      // the circle itself opaque so dotted connectors beneath cannot show
      // through its surface.
      fill = '#e8e8e8'; strokeColor = '#bbbbbb'; textColor = '#a0a0a0'; opacity = 1;
    }

    parts.push(
      '<g id="sphere-node-' + s.id + '"'
      + ((isLearned || isUnlocked) ? ' onclick="clickerSphere(\'' + s.id + '\')" style="cursor:pointer"' : '')
      + ' opacity="' + opacity + '">'
    );
    // Selection ring (hidden by default)
    parts.push(
      '<circle id="sphere-ring-' + s.id + '" cx="' + s.x + '" cy="' + s.y + '" r="' + (s.r + 7) + '"'
      + ' fill="none" stroke="#ffc940" stroke-width="2.5" opacity="0"/>'
    );
    parts.push(
      '<circle cx="' + s.x + '" cy="' + s.y + '" r="' + s.r + '"'
      + ' fill="' + fill + '" stroke="' + strokeColor + '" stroke-width="' + (isLearned ? 2.5 : 2) + '"/>'
    );
    // Label (split on spaces, one tspan per word)
    var words = s.nom.split(' ');
    var fontSize = s.r >= 32 ? 10 : (s.r >= 28 ? 9 : 8);
    var lineH    = fontSize + 2.5;
    var baseY    = s.y - (words.length - 1) * lineH / 2;
    words.forEach(function(w, i) {
      parts.push(
        '<text x="' + s.x + '" y="' + (baseY + i * lineH + fontSize * 0.38).toFixed(1) + '"'
        + ' text-anchor="middle" font-size="' + fontSize + 'px" font-weight="900"'
        + ' font-family="\'Nunito\',sans-serif" fill="' + textColor + '" pointer-events="none">'
        + w.toUpperCase() + '</text>'
      );
    });
    parts.push('</g>');
  });

  parts.push('</svg>');

  containerEl.innerHTML = parts.join('')
    + '<div class="sphere-detail-panel" id="sphere-detail-panel">'
    + '<div class="sphere-detail-nom" id="sphere-detail-nom">Select a perk to see its description.</div>'
    + '<div class="sphere-detail-desc" id="sphere-detail-desc"></div>'
    + '</div>';
}

function clickerSphere(sphereId) {
  // Deselect previous
  if (_sphereSelectionnee) {
    var prevRing = document.getElementById('sphere-ring-' + _sphereSelectionnee);
    if (prevRing) prevRing.setAttribute('opacity', '0');
  }
  // Toggle: click same sphere again to deselect
  if (_sphereSelectionnee === sphereId) {
    _sphereSelectionnee = null;
    var nomEl  = document.getElementById('sphere-detail-nom');
    var descEl = document.getElementById('sphere-detail-desc');
    if (nomEl)  nomEl.textContent  = 'Select a perk to see its description.';
    if (descEl) descEl.textContent = '';
    return;
  }
  _sphereSelectionnee = sphereId;
  var ring = document.getElementById('sphere-ring-' + sphereId);
  if (ring) ring.setAttribute('opacity', '1');
  // Find sphere data
  var def    = _sphereGridJob ? SPHERE_GRIDS[_sphereGridJob] : null;
  var sphere = def ? def.spheres.find(function(s) { return s.id === sphereId; }) : null;
  var actualEtat = sphereEtatEffectif(sphere);
  var nomEl  = document.getElementById('sphere-detail-nom');
  var descEl = document.getElementById('sphere-detail-desc');
  if (nomEl)  nomEl.textContent = sphere ? String(sphere.nom).toUpperCase() : '';
  if (descEl) {
    var learnHtml = '';
    if (actualEtat === 'unlocked' && sphere && sphere.cout) {
      var cout = sphere.cout;
      var canAfford = Object.keys(cout).every(function(res) { return (etat[res] || 0) >= cout[res]; });
      var coutLabel = Object.keys(cout).map(function(res) {
        var noms = { cannedCatFood: 'Canned Cat Food' };
        return cout[res] + ' ' + (noms[res] || res);
      }).join(', ');
      learnHtml = '<div class="sphere-cout">'
        + '<span class="sphere-cout-label">Cost: ' + coutLabel + '</span>'
        + (canAfford
            ? '<button class="sphere-learn-btn" onclick="apprendrePerk(\'' + sphereId + '\')">Learn</button>'
            : '<button class="sphere-learn-btn sphere-learn-disabled" disabled>Not enough resources</button>')
        + '</div>';
    }
    descEl.innerHTML = (sphere ? '<p class="sphere-desc-texte">' + sphere.desc + '</p>' : '') + learnHtml;
  }
}

function apprendrePerk(sphereId) {
  if (_sphereGridJob && !batimentFonctionnelCamp("trainingCenter").available) return;
  if (!etat.spherePerks) etat.spherePerks = {};
  var def    = _sphereGridJob ? SPHERE_GRIDS[_sphereGridJob] : null;
  var sphere = def ? def.spheres.find(function(s) { return s.id === sphereId; }) : null;
  // Check and deduct cost
  if (sphere && sphere.cout) {
    var canAfford = Object.keys(sphere.cout).every(function(res) { return (etat[res] || 0) >= sphere.cout[res]; });
    if (!canAfford) { afficherNotification("Not enough resources to learn this perk."); return; }
    Object.keys(sphere.cout).forEach(function(res) { etat[res] -= sphere.cout[res]; });
  }
  etat.spherePerks[sphereId] = 'learned';
  if (sphere && /-slot$/.test(sphereId)) {
    if (synchroniserSlotsRecettesAvecPerks()) workStructureInitialisee = false;
  }
  // Unlock children of this sphere
  if (def) {
    def.connections.forEach(function(conn) {
      var enfant = def.spheres.find(function(s) { return s.id === conn[1]; });
      if (conn[0] === sphereId && enfant && sphereEtatEffectif(enfant) === 'locked') {
        etat.spherePerks[conn[1]] = 'unlocked';
      }
    });
  }
  sauvegarder();
  _tcKey = null; // force TC re-render so sphere grid rebuilds
  renduTrainingCenter();
  renduGangTools();
}

function specialiserJobKitty(index) {
  const kitty = etat.kittiesData[index];
  if (!kitty || !kitty.metier) return;
  kitty.jobNiveau = (kitty.jobNiveau || 0) + 1;
  const jobNom = METIERS[kitty.metier] ? METIERS[kitty.metier].nom : kitty.metier;
  afficherNotification(kitty.nom + "'s " + jobNom + " reached level " + kitty.jobNiveau + "!");
  ajouterLog("event", kitty.nom + " specialized in " + jobNom + " — now Lv. " + kitty.jobNiveau + ".");
  renduTrainingCenter();
  sauvegarder();
}

function jobLevelInfo(metier) {
  var grid = SPHERE_GRIDS[metier];
  if (!grid) return { cur: 1, max: 1 };
  var cur = grid.spheres.filter(function(s) {
    return (etat.spherePerks && etat.spherePerks[s.id] === 'learned') || s.etat === 'learned';
  }).length;
  return { cur: cur, max: grid.spheres.length };
}

// ── 9g. Management tab
let kittySelectionnee = null;
let detailKittyMobileOuvert = false;
let experienceHelpOuvert = false;
let gangSousOnglet = "all";

function fermerExperienceHelp() {
  experienceHelpOuvert = false;
  const popup = document.getElementById("experience-bonus-help");
  const button = document.getElementById("experience-bonus-help-button");
  if (popup) {
    popup.style.display = "none";
    popup.setAttribute("aria-hidden", "true");
  }
  if (button) button.setAttribute("aria-expanded", "false");
}

function toggleExperienceHelp(event) {
  if (event) event.stopPropagation();
  const popup = document.getElementById("experience-bonus-help");
  const button = document.getElementById("experience-bonus-help-button");
  if (!popup || !button) return;
  experienceHelpOuvert = !experienceHelpOuvert;
  popup.style.display = experienceHelpOuvert ? "block" : "none";
  popup.setAttribute("aria-hidden", experienceHelpOuvert ? "false" : "true");
  button.setAttribute("aria-expanded", experienceHelpOuvert ? "true" : "false");
}

function fermerPanneauAides() {
  document.querySelectorAll(".panneau-aide-popover").forEach(function(popup) {
    popup.style.display = "none";
    popup.setAttribute("aria-hidden", "true");
  });
  document.querySelectorAll(".panneau-aide-btn").forEach(function(button) {
    button.setAttribute("aria-expanded", "false");
  });
}

function togglePanneauAide(event) {
  if (event) event.stopPropagation();
  const button = event && event.currentTarget ? event.currentTarget : null;
  if (!button) return;
  const popup = document.getElementById(button.getAttribute("aria-controls"));
  if (!popup) return;
  const ouvert = popup.getAttribute("aria-hidden") !== "true";
  fermerPanneauAides();
  if (!ouvert) {
    popup.style.display = "block";
    popup.setAttribute("aria-hidden", "false");
    button.setAttribute("aria-expanded", "true");
  }
}

document.addEventListener("click", function(event) {
  if (!event.target.closest || !event.target.closest(".panneau-aide-wrap")) fermerPanneauAides();
});

document.addEventListener("keydown", function(event) {
  if (event.key === "Escape") fermerPanneauAides();
});

document.addEventListener("click", function(event) {
  if (!experienceHelpOuvert) return;
  const wrapper = document.getElementById("experience-help-wrap");
  if (wrapper && !wrapper.contains(event.target)) fermerExperienceHelp();
});

document.addEventListener("keydown", function(event) {
  if (event.key === "Escape" && experienceHelpOuvert) fermerExperienceHelp();
});

function selectionnerKitty(index) {
  const conserverFocus = document.activeElement && document.activeElement.dataset.kittyIndex === String(index);
  kittySelectionnee = index;
  detailKittyMobileOuvert = true;
  renduManagement();
  if (conserverFocus) {
    requestAnimationFrame(function() {
      const vueMobile = matchMedia("(max-width: 768px)").matches;
      const cible = vueMobile
        ? document.querySelector("#detail-kitty .bouton-retour-mobile")
        : document.querySelector('.kitty-carte[data-kitty-index="' + index + '"]');
      if (cible) cible.focus();
    });
  }
}

function deselectionnerKitty() {
  detailKittyMobileOuvert = false;
  renduManagement();
  requestAnimationFrame(function() {
    const carte = document.querySelector('.kitty-carte[data-kitty-index="' + kittySelectionnee + '"]');
    if (carte) carte.focus();
  });
}

function renduGangTools() {
  var el = document.getElementById('gang-tools');
  if (!el) return;
  var qolLearned = etat.spherePerks && etat.spherePerks['gl-qol'] === 'learned';
  if (qolLearned) {
    el.style.display = 'block';
    el.innerHTML = '<button class="gang-tool-btn' + (_foodMgmtOuvert ? ' gang-tool-btn-actif' : '') + '" onclick="toggleFoodManagement()">Food Management</button>';
  } else {
    el.style.display = 'none';
  }
}

// ── Food Management ──────────────────────────────────────────────────────────
var _foodMgmtOuvert = false;
var _foodMgmtPct    = 50;
var _foodMgmtHelp   = null;

const FOOD_DISPLAY = {
  salads:           { nom: 'Catnip Salad',    sprite: 'img/resources/Catnip Salad_Final.png' },
  grilledAnchovy:   { nom: 'Grilled Anchovy', sprite: 'img/resources/Grilled Anchovy_Final.png' },
  humanLeftovers:   { nom: 'Human Leftovers', sprite: 'img/resources/Human Leftovers_Final.png' },
  humanWorkersFood: { nom: 'Workers Food',    sprite: 'img/resources/Human Workers Food_Final.png' }
};

function totalFoodXp() {
  return Object.keys(FOOD_XP).reduce(function(s, f) { return s + (etat[f] || 0) * FOOD_XP[f]; }, 0);
}

function toggleFoodManagement() {
  _foodMgmtOuvert = !_foodMgmtOuvert;
  if (!_foodMgmtOuvert) _foodMgmtHelp = null;
  var panel = document.getElementById('food-management-panel');
  if (panel) panel.style.display = _foodMgmtOuvert ? 'block' : 'none';
  if (_foodMgmtOuvert) renduFoodManagement();
  renduGangTools(); // update button active state
}

function setFoodMgmtPct(p) {
  _foodMgmtPct = p;
  renduFoodManagement();
}

function estMetierManager(kitty) {
  return !!(kitty && kitty.metier && (kitty.metier === "gang-leader" || Object.keys(METIER_PAR_FAMILLE).some(function(famille) {
    return METIER_PAR_FAMILLE[famille].includes(kitty.metier);
  })));
}

function changerSousOngletGang(vue) {
  if (!gangSousOngletsDebloques()) return;
  gangSousOnglet = ["all", "managers", "engineers", "strays"].includes(vue) ? vue : "all";
  kittySelectionnee = null;
  detailKittyMobileOuvert = false;
  renduManagement();
}

function renduGangSubtabs() {
  const el = document.getElementById("gang-subtabs");
  if (!el) return;
  const visible = gangSousOngletsDebloques();
  el.style.display = visible ? "flex" : "none";
  document.body.classList.toggle("gang-subtabs-actifs", visible);
  if (!visible) {
    delete el.dataset.hasTabs;
    return;
  }
  el.dataset.hasTabs = "true";
  const tabs = [
    ["all", "All"],
    ["managers", "Managers"],
    ["engineers", "Engineers"],
    ["strays", "Stray Cats"]
  ];
  el.innerHTML = tabs.map(function(tab) {
    const active = gangSousOnglet === tab[0];
    return '<button type="button" class="gang-subtab btn-filtre-work' + (active ? ' gang-subtab-active btn-filtre-work-actif' : '') + '" role="tab" aria-selected="' + (active ? 'true' : 'false') + '" aria-controls="liste-kitties" onclick="changerSousOngletGang(\'' + tab[0] + '\')">' + tab[1] + '</button>';
  }).join("");
}

function toggleFoodManagementHelp(mode) {
  _foodMgmtHelp = _foodMgmtHelp === mode ? null : mode;
  renduFoodManagement();
}

function fermerFoodDistributionModal() {
  fermerDialogueModal("food-distribution-modal");
}

function afficherFoodDistributionRecap(recap) {
  const summary = document.getElementById("food-distribution-summary");
  if (!summary) return;
  const recipients = recap.filter(function(entry) { return entry.foodUnits > 0; });
  if (!recipients.length) return;

  const totalFoodUnits = recipients.reduce(function(total, entry) { return total + entry.foodUnits; }, 0);
  const totalXp = recipients.reduce(function(total, entry) { return total + entry.xp; }, 0);
  const totalLevelUps = recipients.reduce(function(total, entry) { return total + entry.levelUps; }, 0);
  const catsFedLabel = recipients.length + (recipients.length === 1 ? " Cat fed" : " Cats fed");
  const levelLabel = totalLevelUps + (totalLevelUps === 1 ? " level gained" : " levels gained");
  summary.innerHTML = '<div class="food-distribution-stats">' + totalXp + ' XP distributed · ' + levelLabel + ' · ' + catsFedLabel + '</div>'
    + '<div class="food-distribution-summary">'
    + recipients.map(function(entry) {
      const foodLabel = entry.foodUnits + (entry.foodUnits === 1 ? " food item" : " food items");
      const levelLabel = entry.niveauAvant + " => " + entry.kitty.niveau + " (+" + entry.levelUps + (entry.levelUps === 1 ? " level" : " levels") + ")";
      return '<div class="food-distribution-row">'
        + '<span class="food-distribution-portrait">' + kittyIconHtml(entry.kitty) + '</span>'
        + '<span><strong class="food-distribution-name">' + echapperAttributHtml(entry.kitty.nom) + '</strong>'
        + '<span class="food-distribution-details"><span>' + foodLabel + '</span><span>+' + entry.xp + ' XP</span></span></span>'
        + '<strong class="food-distribution-level' + (entry.levelUps ? "" : " none") + '">' + levelLabel + '</strong>'
        + '</div>';
    }).join("")
    + '<div class="food-distribution-total">Total: ' + totalFoodUnits + (totalFoodUnits === 1 ? " food item" : " food items")
    + ' · +' + totalXp + ' XP · +' + totalLevelUps + (totalLevelUps === 1 ? " level" : " levels") + '</div>'
    + '</div>';

  ouvrirDialogueModal("food-distribution-modal", {
    dismissible: true,
    fermer: fermerFoodDistributionModal,
    focusSelector: ".food-distribution-continue",
    returnFocusSelector: "#gang-tools .gang-tool-btn"
  });
}

function renduFoodManagement() {
  var panel = document.getElementById('food-management-panel');
  if (!panel) return;

  var totalXp = totalFoodXp();
  var xpPreview = Math.floor(totalXp * _foodMgmtPct / 100);

  var foodItems = Object.keys(FOOD_XP).filter(function(f) { return (etat[f] || 0) > 0; });
  var tableHtml;
  if (foodItems.length === 0) {
    tableHtml = '<div class="fm-empty">No food available.</div>';
  } else {
    tableHtml = '<div class="fm-grid">';
    foodItems.forEach(function(f) {
      var qty  = etat[f] || 0;
      var info = FOOD_DISPLAY[f] || { nom: f };
      var icone = info.sprite ? '<img class="fm-food-icone" src="' + info.sprite + '" alt="">' : '';
      tableHtml += '<div class="fm-cell">'
        + icone
        + '<span class="fm-cell-nom">' + info.nom + '</span>'
        + '<span class="fm-cell-detail">x' + qty + ' &middot; ' + FOOD_XP[f] + ' XP</span>'
        + '<span class="fm-cell-total">' + (qty * FOOD_XP[f]) + ' XP</span>'
        + '</div>';
    });
    tableHtml += '</div>';
    tableHtml += '<div class="fm-total">Total: <strong>' + totalXp + ' XP</strong></div>';
  }

  var pctBtns = [10, 25, 50, 100].map(function(p) {
    return '<button class="fm-pct-btn' + (_foodMgmtPct === p ? ' fm-pct-actif' : '') + '" onclick="setFoodMgmtPct(' + p + ')">' + p + '%</button>';
  }).join('');

  var noFood = totalXp === 0;

  var helpHtml = '';
  if (_foodMgmtHelp === 'egal') {
    helpHtml = '<div class="fm-help-detail" role="note"><strong>Distribute evenly</strong> Each cat receives the same amount of XP. Food is consumed in whole units. The actual percentage used may be slightly below the selected value if the XP does not divide evenly.</div>';
  } else if (_foodMgmtHelp === 'basniveau') {
    helpHtml = '<div class="fm-help-detail" role="note"><strong>Prioritize low-level cats</strong> Levels up the lowest-level cat first, then moves to the next, until the budget runs out. If a cat needs less XP than the smallest available food unit, one unit is consumed anyway. The excess XP is banked toward the cat\'s next level.</div>';
  }

  panel.innerHTML = '<div class="fm-carte">'
    + '<div class="fm-titre">Food Management <button class="fm-fermer" onclick="toggleFoodManagement()">x</button></div>'
    + '<div class="fm-section-titre">Available food</div>'
    + tableHtml
    + '<div class="fm-section-titre">Amount to distribute</div>'
    + '<div class="fm-pct-btns">' + pctBtns + '</div>'
    + '<div class="fm-xp-preview">' + xpPreview + ' XP will be distributed (' + _foodMgmtPct + '%)</div>'
    + '<div class="fm-actions">'
    + '<div class="fm-action-option"><button class="fm-help-btn" type="button" aria-label="Explain distribute evenly" aria-expanded="' + (_foodMgmtHelp === 'egal' ? 'true' : 'false') + '" onclick="toggleFoodManagementHelp(\'egal\')">?</button><button class="fm-action-btn" onclick="distribuerFood(\'egal\')"' + (noFood ? ' disabled' : '') + '>Distribute evenly</button></div>'
    + '<div class="fm-action-option"><button class="fm-help-btn" type="button" aria-label="Explain prioritize low-level cats" aria-expanded="' + (_foodMgmtHelp === 'basniveau' ? 'true' : 'false') + '" onclick="toggleFoodManagementHelp(\'basniveau\')">?</button><button class="fm-action-btn" onclick="distribuerFood(\'basniveau\')"' + (noFood ? ' disabled' : '') + '>Prioritize low-level cats</button></div>'
    + '</div>'
    + helpHtml
    + '</div>';
}

function distribuerFood(mode) {
  var totalXp  = totalFoodXp();
  var xpBudget = Math.floor(totalXp * _foodMgmtPct / 100);
  var nbChats  = etat.kittiesData.filter(function(k) {
    return k && k.niveau < niveauMaxChat(k);
  }).length;
  if (!xpBudget || !nbChats) { afficherNotification("No food to distribute."); return; }

  var foods = Object.keys(FOOD_XP).sort(function(a, b) { return FOOD_XP[a] - FOOD_XP[b]; });
  var totalLevelUps = 0;
  var distributionRecap = etat.kittiesData.map(function(k) {
    return { kitty: k, niveauAvant: k.niveau, foodUnits: 0, xp: 0, levelUps: 0 };
  });
  function recapPour(k) {
    var index = etat.kittiesData.indexOf(k);
    return index >= 0 ? distributionRecap[index] : null;
  }

  // Consume at most `cible` XP using floor division per food type (never overshoots).
  // If floor division yields 0 units for every type but stock exists and forceSingle is true,
  // consume exactly 1 unit of the smallest available food (handles "need 1 XP, only have 15-XP items").
  function consommerXp(cible, forceSingle, recap) {
    var consomme = 0;
    foods.forEach(function(f) {
      var stock = etat[f] || 0;
      if (!stock) return;
      var reste  = cible - consomme;
      var units  = Math.min(Math.floor(reste / FOOD_XP[f]), stock);
      etat[f]   -= units;
      consomme  += units * FOOD_XP[f];
      if (recap) recap.foodUnits += units;
    });
    // If nothing was consumed but forced (e.g. needed=1, smallest unit=15), consume 1 of the smallest
    if (consomme === 0 && forceSingle) {
      for (var fi = 0; fi < foods.length; fi++) {
        if ((etat[foods[fi]] || 0) > 0) {
          etat[foods[fi]] -= 1;
          consomme = FOOD_XP[foods[fi]];
          if (recap) recap.foodUnits += 1;
          break;
        }
      }
    }
    return consomme;
  }

  function donnerXp(k, xp, recap) {
    const niveauMax = niveauMaxChat(k);
    if (Number.isFinite(niveauMax) && k.niveau >= niveauMax) return;
    k.xp += xp;
    if (recap) recap.xp += xp;
    while (k.xp >= xpPourNiveau(k.niveau) && k.niveau < niveauMax) {
      k.xp -= xpPourNiveau(k.niveau);
      k.niveau++;
      totalLevelUps++;
      if (recap) recap.levelUps++;
      ajouterLog("event", k.nom + " reached Level " + k.niveau + "!");
    }
    if (Number.isFinite(niveauMax) && k.niveau >= niveauMax) k.xp = 0;
  }

  if (mode === 'egal') {
    var xpParChat = Math.floor(xpBudget / nbChats);
    if (!xpParChat) { afficherNotification("Not enough XP to distribute evenly."); return; }
    // floor division: each cat gets at most xpParChat XP, no overshoot
    etat.kittiesData.forEach(function(k) {
      var recap = recapPour(k);
      donnerXp(k, consommerXp(xpParChat, false, recap), recap);
    });

  } else { // basniveau — level up lowest cats first (Option A)
    var budget = xpBudget;
    while (budget > 0) {
      var best = null, bestScore = Infinity;
      etat.kittiesData.forEach(function(k) {
        if (!k || k.niveau >= niveauMaxChat(k)) return;
        var needed = xpPourNiveau(k.niveau) - k.xp;
        var score  = k.niveau * 100000 + needed;
        if (score < bestScore) { bestScore = score; best = k; }
      });
      if (!best) break;
      var needed = xpPourNiveau(best.niveau) - best.xp;
      if (needed > budget) break;
      // forceSingle=true: if needed < smallest unit, consume 1 unit anyway (XP overflow goes to cat's bank)
      var recap = recapPour(best);
      var gained = consommerXp(needed, true, recap);
      if (gained === 0) break; // no food left at all
      budget -= gained;
      donnerXp(best, gained, recap);
    }
  }

  // Register the result once after the whole distribution. This covers both
  // distribution modes and avoids depending on the nested XP helper's scope.
  if (totalLevelUps > 0 && typeof enregistrerNiveauQuotidien === "function") {
    enregistrerNiveauQuotidien(totalLevelUps);
  }
  verifierObjectifs();
  sauvegarder();
  var msg = totalLevelUps > 0
    ? totalLevelUps + " level-up" + (totalLevelUps > 1 ? "s" : "") + "!"
    : "XP distributed — no level-ups yet.";
  afficherNotification(msg);
  renduManagement();
  if (_foodMgmtOuvert) renduFoodManagement();
  afficherFoodDistributionRecap(distributionRecap);
}

function renduManagement() {
  const liste  = document.getElementById("liste-kitties");
  const detail = document.getElementById("detail-kitty");
  const layout = document.getElementById("management-layout");
  if (!liste || !detail) return;

  renduGangTools();
  renduGangSubtabs();

  // Left: kitty list
  liste.innerHTML = "";
  if (etat.kittiesData.length === 0) {
    kittySelectionnee = null;
    detailKittyMobileOuvert = false;
    if (layout) layout.classList.remove("affiche-detail-mobile");
    liste.innerHTML = etatVideHtml("Your gang is waiting", "Catch your first cat using the button above.");
    detail.innerHTML = etatVideHtml("No profile yet", "Your first recruit's details will appear here.");
    return;
  }

  if (kittySelectionnee === null || !etat.kittiesData[kittySelectionnee]) {
    kittySelectionnee = 0;
    detailKittyMobileOuvert = false;
  }
  if (layout) layout.classList.toggle("affiche-detail-mobile", detailKittyMobileOuvert);
  const niveauxGangVisibles = grasscattingDebloquee();

  function creerCarteKitty(kitty, i) {
    const carte  = document.createElement("div");
    carte.className = "kitty-carte" + (kittySelectionnee === i ? " kitty-carte-active" : "");
    carte.onclick   = function() { selectionnerKitty(i); };

    const photo = document.createElement("div");
    photo.className   = "kitty-photo kitty-photo-tier-" + (kitty.tier || 0);
    photo.innerHTML = kittyIconHtml(kitty);

    const infos = document.createElement("div");
    infos.className = "kitty-infos";

    const metierLabel = kitty.metier
      ? (METIERS[kitty.metier] ? METIERS[kitty.metier].emoji + " " + METIERS[kitty.metier].nom : kitty.metier)
      : "Stray Cat";
    const alloc = kittyAllocationLabel(i);
    rendreActivableClavier(carte, kitty.nom + ", " + metierLabel + (niveauxGangVisibles ? ", level " + kitty.niveau : "") + ", " + alloc.text);
    carte.dataset.kittyIndex = String(i);
    carte.setAttribute("aria-pressed", kittySelectionnee === i ? "true" : "false");
    const spans = [
      { cls: "kitty-nom",    txt: kitty.nom },
      { cls: "kitty-metier" + (kitty.metier ? "" : " kitty-vagabond"), txt: metierLabel },
      { cls: "kitty-statut " + alloc.cls, txt: alloc.text }
    ];
    if (niveauxGangVisibles) spans.splice(2, 0, { cls: "kitty-niveau", txt: "Lvl " + kitty.niveau });
    spans.forEach(function(s) {
      const el = document.createElement("span");
      el.className   = s.cls;
      el.textContent = s.txt;
      infos.appendChild(el);
    });

    carte.appendChild(photo);
    carte.appendChild(infos);
    return carte;
  }

  const parNiveauDesc = function(a, b) { return b.kitty.niveau - a.kitty.niveau; };
  const toutesEntrees = etat.kittiesData.map(function(kitty, i) { return { kitty: kitty, i: i }; });
  const filtreGang = function(entry) {
    if (!gangSousOngletsDebloques() || gangSousOnglet === "all") return true;
    if (gangSousOnglet === "managers") return estMetierManager(entry.kitty);
    if (gangSousOnglet === "engineers") return estIngenieur(entry.kitty);
    if (gangSousOnglet === "strays") return !entry.kitty.metier;
    return true;
  };
  const entrees = toutesEntrees.filter(filtreGang);
  if (entrees.length && !entrees.some(function(entry) { return entry.i === kittySelectionnee; })) {
    kittySelectionnee = entrees[0].i;
  }
  if (!entrees.length) {
    kittySelectionnee = null;
    detailKittyMobileOuvert = false;
    if (layout) layout.classList.remove("affiche-detail-mobile");
    liste.innerHTML = '<p class="gang-subtab-empty">No cats in this view yet.</p>';
    detail.innerHTML = etatVideHtml("No cat selected", "Choose another Gang view.");
    return;
  }
  const avecJob   = entrees.filter(function(e) { return e.kitty.metier; }).sort(parNiveauDesc);
  const sansJob   = entrees.filter(function(e) { return !e.kitty.metier; }).sort(parNiveauDesc);

  avecJob.forEach(function(e) { liste.appendChild(creerCarteKitty(e.kitty, e.i)); });
  if (sansJob.length > 0) {
    // Before the Job Center exists, cats are simply part of the roster. The
    // JOBLESS category is introduced with the job system, so do not expose
    // that label prematurely.
    if (jobCenterDebloquee()) {
      const entete = document.createElement("div");
      entete.className   = "kitty-section-titre";
      entete.textContent = "JOBLESS";
      liste.appendChild(entete);
    }
    sansJob.forEach(function(e) { liste.appendChild(creerCarteKitty(e.kitty, e.i)); });
  }

  // Right: detail panel
  const k       = etat.kittiesData[kittySelectionnee];
  const tierIdx = k.tier || 0;
  detail.innerHTML = "";

  const retour = document.createElement("button");
  retour.className   = "bouton-retour-mobile";
  retour.textContent = "← Back";
  retour.onclick      = deselectionnerKitty;
  detail.appendChild(retour);

  // Left: identity card
  const gauche = document.createElement("div");
  gauche.className = "detail-gauche";
  gauche.innerHTML =
    "<div class=\"kitty-photo detail-photo kitty-photo-tier-" + tierIdx + "\">" + kittyIconHtml(k) + "</div>" +
    "<div class=\"detail-nom\">" + k.nom + "</div>";

  // Right: conditional sections
  const droite = document.createElement("div");
  droite.className = "detail-droite";
  let hasContent = false;

  // Experience section — only shown after first Catnip Salad ever crafted
  if (etat.premiereSaladeFaite) {
    hasContent = true;
    const isEngineer = k.metier === ENGINEER_JOB_ID;
    const engineerInfo = isEngineer ? rangIngenieurInfo(k) : null;
    const maxLevel = niveauMaxChat(k);
    const atMaxLevel = Number.isFinite(maxLevel) && k.niveau >= maxLevel;
    const xpNext = atMaxLevel ? 0 : xpPourNiveau(k.niveau);
    const xpPct  = atMaxLevel ? 100 : Math.min(100, Math.floor((k.xp / xpNext) * 100));
    const FOOD_LABELS = {
      salads:         { sprite: "img/resources/Catnip Salad_Final.png",    nom: "Salad" },
      grilledAnchovy: { sprite: "img/resources/Grilled Anchovy_Final.png", nom: "Grilled Anchovy" },
      humanLeftovers:   { sprite: "img/resources/Human Leftovers_Final.png",     nom: "Human Leftovers" },
      humanWorkersFood: { sprite: "img/resources/Human Workers Food_Final.png",  nom: "Workers Food" }
    };
    const feedBtns = atMaxLevel ? "" : Object.keys(FOOD_XP).filter(function(f) { return etat[f] > 0; }).map(function(f) {
      const info  = FOOD_LABELS[f] || { nom: f };
      const icone = info.sprite ? '<img class="cout-icone" src="' + info.sprite + '" alt="' + info.nom + '">' : "";
      return "<button class='btn-xp-feed' onclick='nourrir(" + kittySelectionnee + ",\"" + f + "\")'>" + icone + "<span class='xp-gain'>+" + FOOD_XP[f] + " XP</span><span class='xp-stock'>×" + etat[f] + "</span></button>";
    }).join("");
    const xpManquant   = atMaxLevel ? 0 : xpNext - k.xp;
    const xpDisponible = Object.keys(FOOD_XP).reduce(function(s, f) { return s + etat[f] * FOOD_XP[f]; }, 0);
    const autoBtnDisabled = atMaxLevel || xpDisponible < xpManquant;
    const autoLevelBtn = atMaxLevel
      ? "<div class='xp-max-level'>Maximum level reached</div>"
      : "<button class='btn-xp-auto'" + (autoBtnDisabled ? " disabled" : "") + " onclick='nourrirAutoNiveau(" + kittySelectionnee + ")'>Auto-feed to next level (<span class='xp-gain'>" + xpManquant + " XP needed</span>)</button>";
    // Keep these derived values aligned with the level multipliers used by
    // Gathering, Processing and manager speed calculations below.
    const gatherLevelPercent = Math.round((Math.pow(GATHER_LEVEL_MULTIPLIER, 1) - 1) * 100);
    const processLevelPercent = Math.round((productionProcBonus({ niveau: 1 }) - 1) * 100);
    const managerLevelPercent = Math.round((jobLevelMultiplier({ niveau: 1 }) - 1) * 100);
    const experienceHelpBody = isEngineer
      ? "<strong>Each additional level increases the following passives:</strong><span>" + (engineerInfo ? engineerInfo.help : "AFK Timer Bonus by 6 minutes per level") + "</span>"
      : "<strong>Each additional level increases these bonuses:</strong>" +
        "<span>Gather Production Bonus by " + gatherLevelPercent + "%</span>" +
        "<span>Process Production Bonus by " + processLevelPercent + "%</span>" +
        "<span>Exploration Power by 1</span>" +
        "<span>(If applicable) Manager Speed Bonus by " + managerLevelPercent + "%</span>";
    const experienceHelp =
      "<span class='detail-section-titre-label'>Experience</span>" +
      "<span id='experience-help-wrap' class='detail-help-wrap'>" +
      "<button type='button' id='experience-bonus-help-button' class='detail-help-btn' aria-label='Explain experience bonuses' aria-expanded='" + (experienceHelpOuvert ? "true" : "false") + "' aria-controls='experience-bonus-help' onclick='toggleExperienceHelp(event)'>?</button>" +
      "<span id='experience-bonus-help' class='detail-help-popover' role='note' aria-hidden='" + (experienceHelpOuvert ? "false" : "true") + "' style='display:" + (experienceHelpOuvert ? "block" : "none") + "'>" +
      experienceHelpBody +
      "</span></span>";
    const managerSpeedBonusLine = !isEngineer && k.metier && METIERS[k.metier] && METIER_PAR_FAMILLE[METIERS[k.metier].famille]
      ? "<span class='xp-bonus-ligne'><span class='bonus-var'>x" + managerSpeedMultiplier(k, METIERS[k.metier].famille).toFixed(2) + "</span> Manager Speed Bonus</span>"
      : "";
    const levelBonuses = k.niveau > 0 ? (
      isEngineer
        ? "<div class='xp-bonus-actifs'><span class='xp-bonus-ligne'><span class='bonus-var'>+" + (engineerInfo && engineerInfo.type === "afk-ratio-percent" ? (k.niveau * engineerInfo.value) + "%" : (k.niveau * (engineerInfo ? engineerInfo.value : 6)) + " min") + "</span> " + (engineerInfo && engineerInfo.type === "afk-ratio-percent" ? "AFK Ratio Bonus" : "AFK Timer Bonus") + "</span></div>"
        : "<div class='xp-bonus-actifs'>" +
          "<span class='xp-bonus-ligne'><span class='bonus-var'>x" + Math.pow(GATHER_LEVEL_MULTIPLIER, k.niveau).toFixed(2) + "</span> Gather Production Bonus</span>" +
          "<span class='xp-bonus-ligne'><span class='bonus-var'>x" + productionProcBonus(k).toFixed(2) + "</span> Process Production Bonus</span>" +
          managerSpeedBonusLine +
          "<span class='xp-bonus-ligne'><span class='bonus-var'>+" + k.niveau + "</span> Exploration Power</span>" +
          "</div>"
    ) : "";
    droite.innerHTML +=
      "<div class='detail-section' id='detail-experience'>" +
      "<div class='detail-section-titre detail-section-titre-with-help'>" + experienceHelp + "</div>" +
      "<div class='detail-level-row'><span class='detail-level-num'>Level " + k.niveau + (Number.isFinite(maxLevel) ? " / " + maxLevel : "") + "</span><span class='detail-xp-counter'>" + (atMaxLevel ? "MAX XP" : k.xp + " / " + xpNext + " XP") + "</span></div>" +
      "<div class='conteneur-barre'><div class='barre barre-verte' style='width:" + xpPct + "%'></div></div>" +
      levelBonuses +
      autoLevelBtn +
      (feedBtns ? "<div class='xp-aliments'>" + feedBtns + "</div>" : "<div class='xp-aliments-vide'>" + (atMaxLevel ? "Maximum level reached." : "No food available.") + "</div>") +
      "</div>";
  }

  // Job section — shown under the kitty identity once the Job Center is built.
  // Tier and acquisition date stay hidden here until their future dedicated UI.
  if (etat.jobCenterDebloque) {
    hasContent = true;
    if (!k.metier) {
      gauche.innerHTML += "<div class='detail-stray-cat kitty-vagabond'>STRAY CAT</div>";
    } else {
      const jobName = METIERS[k.metier] ? METIERS[k.metier].nom : k.metier;
      const jobBonus = k.metier ? (
        k.metier === "gang-leader"
          ? "<div class='detail-job-bonus'><span class='bonus-var'>×" + gangLeaderBonus().toFixed(2) + "</span> Work speed for all workers<div class='bonus-sub'>Scales with gang size · own level amplifies</div></div>"
            + gangLeaderPerksHtml(kittySelectionnee)
          : k.metier === "camp-engineer"
            ? (function() {
                const engineerInfo = rangIngenieurInfo(k);
                const engineerValue = (k.niveau || 0) * (engineerInfo ? engineerInfo.value : 6);
                const engineerBonus = engineerInfo && engineerInfo.type === "afk-ratio-percent"
                  ? "+" + engineerValue + "% AFK ratio"
                  : "+" + engineerValue + " min AFK time taken into account";
                return "<div class='detail-job-bonus'><span class='bonus-var'>" + engineerBonus.split(" ")[0] + "</span> " + engineerBonus.split(" ").slice(1).join(" ") + "</div><div class='bonus-sub'>Passive bonus · Rank " + (k.engineerRank || 1) + "</div>";
              })()
          : k.metier === "explorator"
            ? "<div class='detail-job-bonus'>Halves all missions type times in Exploration</div>"
              + (etat.spherePerks && etat.spherePerks['ex-qol'] === 'learned' ? "<div class='detail-job-bonus'>Auto Assign for Exploration missions (perk)</div>" : "")
              + (exploratorPowerMultiplier(kittySelectionnee) > 1 ? "<div class='detail-job-bonus'><span class='bonus-var'>×" + exploratorPowerMultiplier(kittySelectionnee) + "</span> Exploration Power (perk)</div>" : "")
              + (exploratorCatFoodMultiplier(kittySelectionnee) > 1 ? "<div class='detail-job-bonus'><span class='bonus-var'>×" + exploratorCatFoodMultiplier(kittySelectionnee) + "</span> Canned Cat Food chance in scoutings (perk)</div>" : "")
              + (exploratorDoubleChance(kittySelectionnee) > 0 ? "<div class='detail-job-bonus'><span class='bonus-var'>" + Math.round(exploratorDoubleChance(kittySelectionnee) * 100) + "%</span> chance to double scouting reward (perk)</div>" : "")
              + (exploratorTripleChance(kittySelectionnee) > 0 ? "<div class='detail-job-bonus'><span class='bonus-var'>" + Math.round(exploratorTripleChance(kittySelectionnee) * 100) + "%</span> chance to upgrade a doubled reward to triple (perk)</div>" : "")
              + (exploratorLuckyFoodChance(kittySelectionnee) > 0 ? "<div class='detail-job-bonus'><span class='bonus-var'>" + Math.round(exploratorLuckyFoodChance(kittySelectionnee) * 100) + "%</span> chance to preserve scouting Canned Cat Food stock (perk)</div>" : "")
            : (METIERS[k.metier] && METIER_PAR_FAMILLE[METIERS[k.metier].famille] ? "<div class='detail-job-bonus'><span class='bonus-var'>×" + managerSpeedMultiplier(k, METIERS[k.metier].famille).toFixed(2) + "</span> production speed on " + METIERS[k.metier].familleNom + " when assigned as manager</div>" + managerPerksHtml(METIERS[k.metier].famille, "detail-job-perk") : "")
      ) : "";
      const _jlvl = jobLevelInfo(k.metier);
      const tcJobLvl = etat.trainingCenterConstruit && k.metier && !estIngenieur(k)
        ? "<div class='detail-level-row'><span class='detail-level-num'>Level " + _jlvl.cur + " / " + _jlvl.max + "</span></div>"
        : "";
      gauche.innerHTML +=
        "<div class='detail-section detail-job-left' id='detail-job'>" +
        "<div class='detail-job-header'>" +
        "<span class='detail-section-titre'>Job</span>" +
        "<span class='detail-job-nom'>" + jobName + "</span>" +
        "</div>" +
        tcJobLvl +
        (jobBonus ? "<div>" + jobBonus + "</div>" : "") +
        "</div>";
    }
  }

  const corps = document.createElement("div");
  corps.className = "detail-corps" + (hasContent ? "" : " detail-corps-solo");
  corps.appendChild(gauche);
  if (hasContent) corps.appendChild(droite);
  detail.appendChild(corps);
}

// ── 9h. Master render dispatcher
// Fast simulation can otherwise replace a button between pointerdown and click.
// Keep the simulation running, coalesce visual renders, then refresh once the
// interaction has safely completed.
const RENDER_INTERACTION_GRACE_MS = 120;
const SELECTEUR_INTERACTION_STABLE = [
  "button",
  "a[href]",
  "input",
  "select",
  "textarea",
  "summary",
  "[role='button']",
  "[data-clavier-clic]",
  "[onclick]"
].join(",");
const pointeursInteractionActifs = new Set();
let renduInteractionVerrouJusqua = 0;
let renduInteractionEnAttente = false;
let renduInteractionTimer = null;

function cibleInteractionStable(target) {
  return target instanceof Element ? target.closest(SELECTEUR_INTERACTION_STABLE) : null;
}

function renduVerrouilleParInteraction() {
  return pointeursInteractionActifs.size > 0 || Date.now() < renduInteractionVerrouJusqua;
}

function planifierRenduApresInteraction() {
  if (!renduInteractionEnAttente || pointeursInteractionActifs.size > 0) return;
  if (renduInteractionTimer) clearTimeout(renduInteractionTimer);
  const delai = Math.max(0, renduInteractionVerrouJusqua - Date.now()) + 1;
  renduInteractionTimer = setTimeout(function() {
    renduInteractionTimer = null;
    if (renduVerrouilleParInteraction()) {
      planifierRenduApresInteraction();
      return;
    }
    if (!renduInteractionEnAttente) return;
    renduInteractionEnAttente = false;
    rendu();
  }, delai);
}

function terminerProtectionInteraction(pointerId) {
  pointeursInteractionActifs.delete(pointerId);
  if (pointeursInteractionActifs.size > 0) return;
  renduInteractionVerrouJusqua = Date.now() + RENDER_INTERACTION_GRACE_MS;
  planifierRenduApresInteraction();
}

document.addEventListener("pointerdown", function(event) {
  if (!cibleInteractionStable(event.target)) return;
  pointeursInteractionActifs.add(event.pointerId);
  renduInteractionVerrouJusqua = 0;
  if (renduInteractionTimer) {
    clearTimeout(renduInteractionTimer);
    renduInteractionTimer = null;
  }
}, true);
document.addEventListener("pointerup", function(event) {
  if (pointeursInteractionActifs.has(event.pointerId)) terminerProtectionInteraction(event.pointerId);
}, true);
document.addEventListener("pointercancel", function(event) {
  if (pointeursInteractionActifs.has(event.pointerId)) terminerProtectionInteraction(event.pointerId);
}, true);
document.addEventListener("click", function(event) {
  if (!cibleInteractionStable(event.target)) return;
  // The browser has now resolved the original click target. Action handlers may
  // render synchronously again without risking the control disappearing first.
  renduInteractionVerrouJusqua = 0;
  if (renduInteractionTimer) {
    clearTimeout(renduInteractionTimer);
    renduInteractionTimer = null;
  }
  queueMicrotask(function() {
    if (!renduInteractionEnAttente || renduVerrouilleParInteraction()) return;
    renduInteractionEnAttente = false;
    rendu();
  });
}, true);
window.addEventListener("blur", function() {
  if (pointeursInteractionActifs.size === 0) return;
  pointeursInteractionActifs.clear();
  renduInteractionVerrouJusqua = Date.now() + RENDER_INTERACTION_GRACE_MS;
  planifierRenduApresInteraction();
});

function rendu() {
  if (renduVerrouilleParInteraction()) {
    renduInteractionEnAttente = true;
    planifierRenduApresInteraction();
    return;
  }
  // Action mini-games own the foreground while they are open. The simulation
  // keeps ticking, but rebuilding the game UI behind a translucent modal every
  // 100 ms competes with their animation on mobile WebKit.
  if (typeof miniJeuRuntimeActif === "function" && miniJeuRuntimeActif()) {
    miniJeuRuntime.renduEnAttente = true;
    return;
  }
  renduInteractionEnAttente = false;
  renduDialogueRapideCamp();
  if (typeof normaliserOccupationsChatons === "function" && normaliserOccupationsChatons()) sauvegarder();
  const u = unlocks();
  renduRessources(u);
  renduSequence();
  const ongletActif = document.body.dataset.ongletActif || "gang";
  if (ongletActif === "camp")         renduCampPrototype();
  if (ongletActif === "work")         renduWorkPairs(u);
  if (ongletActif === "buildings")    renduBuildings(u);
  if (ongletActif === "facilities")   renduFacilities(u);
  if (ongletActif === "explorations") renduExplorations(u);
  if (ongletActif === "inventaire")   renduInventaire(u);
}

// The simulation clock stays at 100 ms, but it must not rebuild every active
// screen at that cadence. This path updates timers, quantities and progress
// in place, while structural changes continue to use the full rendu() path.
// Keep this split explicit: future systems should add a cheap dynamic updater
// here instead of adding another full render to tick().
function renduDynamique() {
  if (typeof miniJeuRuntimeActif === "function" && miniJeuRuntimeActif()) {
    miniJeuRuntime.renduEnAttente = true;
    return;
  }
  if (renduVerrouilleParInteraction()) {
    renduInteractionEnAttente = true;
    planifierRenduApresInteraction();
    return;
  }

  const u = unlocks();
  renduDialogueRapideCamp();
  const ongletActif = document.body.dataset.ongletActif || "gang";

  // These two sections are intentionally direct-DOM/timer updates and are
  // needed even when the visible tab is not one of the gameplay panels.
  renduRessources(u);
  renduSequence();

  // Completion and unlock paths mark their section dirty. Promote those
  // transitions to one full render so result cards, buttons and assignments
  // never remain stale.
  if (ongletActif === "explorations" && (carteDirty || exploTabDirty)) {
    rendu();
    return;
  }
  if (ongletActif === "facilities" && (jcDirty || labDirty)) {
    rendu();
    return;
  }
  if (ongletActif === "inventaire" && inventaireDirty) {
    rendu();
    return;
  }

  if (ongletActif === "work")         renduWorkDynamique();
  if (ongletActif === "camp")         renduCampPrototypeDynamique();
  if (ongletActif === "buildings")    renduBuildings(u);
  if (ongletActif === "facilities")   renduFacilities(u);
  if (ongletActif === "explorations") renduExplorationsDynamique(u);
  if (ongletActif === "inventaire")   renduInventaire(u);
}

let renduOngletPlanifie = false;
let renduOngletCallback = null;

function planifierRenduOnglet(callback) {
  if (typeof callback === "function") renduOngletCallback = callback;
  if (renduOngletPlanifie) return;
  renduOngletPlanifie = true;
  const afficher = function() {
    renduOngletPlanifie = false;
    const action = renduOngletCallback;
    renduOngletCallback = null;
    if (action) action();
    else rendu();
  };
  if (typeof requestAnimationFrame === "function") requestAnimationFrame(afficher);
  else setTimeout(afficher, 0);
}

function ecrireAttributDynamique(el, attribut, valeur) {
  if (!el) return false;
  const texte = String(valeur);
  if (el.getAttribute(attribut) === texte) return false;
  el.setAttribute(attribut, texte);
  return true;
}

function actualiserProgressionSlotRecette(familyId, slotIdx) {
  const el = domParId("recipe-slot-" + familyId + "-" + slotIdx);
  const slot = slotRecette(familyId, slotIdx);
  if (!el || !slot) return false;

  const pair = paireRecette(slot.recipeId);
  const kitty = slot.kittyIndex === null ? null : etat.kittiesData[slot.kittyIndex];
  if (!pair || !kitty) return true;

  // A phase change also changes which controls can receive Manual Focus. Let
  // the structural renderer rebuild that slot once; ordinary progress stays
  // entirely in place.
  if (el.dataset.recipePhase !== slot.phase) return false;

  const progress = progressionsSlotRecette(slot, pair);
  const input = pair.inputs[0];
  const target = quantiteInputEffective(pair, input);
  const gathered = Math.min(target, Math.max(0, Number(slot.gatheredInputs[pair.rawRes]) || 0));
  const outputProgress = Math.round(progress.processing * 100) + "%";
  const ringProgress = Math.round(progress.overall * 100);
  const inputEl = el.querySelector(".work-recipe-resource-input");
  const outputEl = el.querySelector(".work-recipe-resource-output");
  const ringEl = el.querySelector(".work-recipe-cat-ring");
  if (!inputEl || !outputEl || !ringEl) return false;

  ecrireVariableStyle(inputEl, "--fill", Math.round(progress.gathering * 100) + "%");
  ecrireVariableStyle(outputEl, "--fill", Math.round(progress.processing * 100) + "%");
  ecrireVariableStyle(ringEl, "--prog", progress.overall);
  ecrireAttributDynamique(ringEl, "aria-valuenow", ringProgress);
  ecrireTexte(inputEl.querySelector(".work-recipe-gathered"), libelleNombreDecimal(gathered, 1) + " / " + libelleNombreDecimal(target, 1));
  ecrireTexte(outputEl.querySelector(".work-recipe-output-progress"), outputProgress);
  const durations = dureesAffichageRecette(pair, kitty, familyId, slotIdx);
  const outputPerCycle = productionProcBonus(kitty);
  ecrireTexte(
    outputEl.querySelector(".work-recipe-output-details"),
    formaterTemps(durations.processing) + " for " + libelleNombreDecimal(outputPerCycle, 2) + " · Stock " + formaterNombre(etat[pair.procRes])
  );
  return true;
}

function actualiserProgressionWorkSummary() {
  const summary = domParId("work-summary-all");
  if (!summary || workFiltre !== "all") return true;
  let stable = true;
  ["wood", "food", "rock"].forEach(function(familyId) {
    (etat.workRecipeSlots[familyId] || []).forEach(function(slot, slotIdx) {
      if (!slot.recipeId || slot.kittyIndex === null) return;
      const pair = paireRecette(slot.recipeId);
      if (!pair) return;
      const row = summary.querySelector('[data-work-family="' + familyId + '"][data-work-slot="' + slotIdx + '"]');
      const ring = row && row.querySelector(".work-summary-ring");
      if (!row || !ring) { stable = false; return; }
      const progress = progressionsSlotRecette(slot, pair).overall;
      ecrireVariableStyle(ring, "--prog", progress);
      ecrireAttributDynamique(ring, "aria-valuenow", Math.round(progress * 100));
    });
  });
  return stable;
}

function renduWorkDynamique() {
  if (!workStructureInitialisee) { rendu(); return; }
  let stable = true;
  if (workFiltre === "all") {
    stable = actualiserProgressionWorkSummary();
  } else {
    const slots = etat.workRecipeSlots[workFiltre] || [];
    slots.forEach(function(slot, slotIdx) {
      if (!actualiserProgressionSlotRecette(workFiltre, slotIdx)) stable = false;
    });
  }
  actualiserFocusManuelWork();
  if (!stable) rendu();
}


// ════════════════════════════════════════════════════════════
// 9b. EXPLORATIONS RENDER
// ════════════════════════════════════════════════════════════

let workFiltre = "all";  // "all" | "wood" | "food" | "rock"

function appliquerFiltreWork(filtre) {
  workFiltre = filtre || "all";
  document.body.dataset.workFilter = workFiltre;
  ["all", "wood", "food", "rock"].forEach(function(f) {
    const el = document.getElementById("filtre-work-" + f);
    if (el) {
      el.classList.toggle("btn-filtre-work-actif", f === workFiltre);
      el.setAttribute("aria-pressed", f === workFiltre ? "true" : "false");
    }
  });
}

function filtrerWork(filtre) {
  appliquerFiltreWork(filtre);
  rendu();
}

function deallouerTous() {
  annulerFocusManuelWork();
  Object.values(etat.workRecipeSlots || {}).forEach(function(slots) {
    slots.forEach(function(slot) { reinitialiserProgressionRecette(slot, false); });
  });
  sauvegarder(); rendu();
}

let exploKittiesSelectionnees = {};  // { campaignId: Array<kittyIndex|null> }
let scoutingsStagingKitty    = {};  // { scoutingId: kittyIndex } — staged but not yet sent
let exploTabDirty  = true;
let exploModalOuvert = null;  // { campId?, zoneId?, slotIndex } or null

let carteDirty            = true;
let carteZoneSelectionnee = "D1"; // Home is always accessible — show its missions right away
let carteExploSlots       = {};  // { zoneId: Array<kittyIndex|null> }
let _zoneInfoKey          = null; // cache key to skip innerHTML rebuild when nothing changed
let _tcKey                = null; // same pattern for Training Center
let explorationMobileVue  = "map";
let explorationMobileTypeMission = "campaigns";

function estExplorationMobile() {
  return typeof window !== "undefined" && window.matchMedia("(max-width: 768px)").matches;
}

function campagnesAfficheesPourZone(zoneId) {
  return Object.values(CONFIG.campaigns).filter(function(campaign) {
    if (campaign.zone !== zoneId) return false;
    if (campaign.unlockAfterCampaign) return etat.campaignsCompletees.includes(campaign.unlockAfterCampaign);
    return true;
  });
}

function scoutingsAffichesPourZone(zoneId) {
  return Object.values(CONFIG.scoutings).filter(function(scouting) {
    return scouting.zone === zoneId && scoutingDebloquee(scouting);
  });
}

function synchroniserNavigationExplorationMobile() {
  const contenu = document.getElementById("contenu-explorations");
  const entete = document.getElementById("exploration-mobile-zone-header");
  if (!contenu || !entete) return;

  const zone = carteZoneSelectionnee ? ZONES_CARTE[carteZoneSelectionnee] : null;
  const mobile = estExplorationMobile();
  const zoneOuverte = mobile && explorationMobileVue === "zone" && !!zone;
  contenu.classList.toggle("exploration-mobile-zone-open", zoneOuverte);
  contenu.classList.toggle("exploration-mobile-tab-scoutings", zoneOuverte && explorationMobileTypeMission === "scoutings");
  contenu.classList.toggle("exploration-mobile-tab-campaigns", zoneOuverte && explorationMobileTypeMission !== "scoutings");
  entete.setAttribute("aria-hidden", zoneOuverte ? "false" : "true");

  if (!zone) return;
  const exploree = zone.type === "home" || etat.zonesExplorees.includes(zone.id);
  const campagnes = campagnesAfficheesPourZone(zone.id);
  const scoutings = scoutingsAffichesPourZone(zone.id);
  const titre = document.getElementById("exploration-mobile-zone-title");
  const coordonnee = document.getElementById("exploration-mobile-zone-coordinate");
  const statut = document.getElementById("exploration-mobile-zone-status");
  const onglets = document.getElementById("exploration-mobile-mission-tabs");
  const boutonCampaigns = document.getElementById("exploration-mobile-campaigns-tab");
  const boutonScoutings = document.getElementById("exploration-mobile-scoutings-tab");

  ecrireTexte(coordonnee, exploree ? zone.id : "");
  if (coordonnee) coordonnee.style.display = exploree ? "" : "none";
  ecrireTexte(titre, exploree ? zone.nom : "Unknown zone");
  ecrireTexte(statut, exploree ? "Explored" : "Unexplored");
  if (statut) statut.classList.toggle("exploration-mobile-zone-status-explored", exploree);
  ecrireTexte(document.getElementById("exploration-mobile-campaigns-count"), String(campagnes.length));
  ecrireTexte(document.getElementById("exploration-mobile-scoutings-count"), String(scoutings.length));

  if (onglets) onglets.style.display = exploree ? "" : "none";
  if (boutonCampaigns) {
    const selectionne = explorationMobileTypeMission !== "scoutings";
    boutonCampaigns.classList.toggle("actif", selectionne);
    boutonCampaigns.setAttribute("aria-selected", selectionne ? "true" : "false");
  }
  if (boutonScoutings) {
    const selectionne = explorationMobileTypeMission === "scoutings";
    boutonScoutings.classList.toggle("actif", selectionne);
    boutonScoutings.setAttribute("aria-selected", selectionne ? "true" : "false");
  }
}

function ouvrirZoneExplorationMobile() {
  if (!estExplorationMobile() || !carteZoneSelectionnee || !ZONES_CARTE[carteZoneSelectionnee]) return;
  const zone = ZONES_CARTE[carteZoneSelectionnee];
  const exploree = zone.type === "home" || etat.zonesExplorees.includes(zone.id);
  if (exploree) {
    const campagnes = campagnesAfficheesPourZone(zone.id);
    const scoutings = scoutingsAffichesPourZone(zone.id);
    if (campagnes.length === 0 && scoutings.length > 0) explorationMobileTypeMission = "scoutings";
  }
  explorationMobileVue = "zone";
  renderCampaignCards();
  synchroniserNavigationExplorationMobile();
  requestAnimationFrame(function() {
    const entete = document.getElementById("exploration-mobile-zone-header");
    if (entete) entete.scrollIntoView({ block: "start" });
  });
}

function retourCarteExplorationMobile() {
  explorationMobileVue = "map";
  synchroniserNavigationExplorationMobile();
  requestAnimationFrame(function() {
    const carte = document.getElementById("section-explo-map");
    if (carte) carte.scrollIntoView({ block: "start" });
  });
}

function selectionnerTypeMissionExplorationMobile(type) {
  if (type !== "campaigns" && type !== "scoutings") return;
  explorationMobileTypeMission = type;
  synchroniserNavigationExplorationMobile();
  requestAnimationFrame(function() {
    const entete = document.getElementById("exploration-mobile-zone-header");
    if (entete) entete.scrollIntoView({ block: "start" });
  });
}

function totalKittiesSelectionnees() {
  return Object.values(exploKittiesSelectionnees).reduce(function(s, slots) {
    return s + (slots ? slots.filter(function(x) { return x !== null; }).length : 0);
  }, 0);
}

function kittyDejaSelectionnee(kittyIndex, excludeCampId, excludeSlotIndex) {
  return Object.keys(exploKittiesSelectionnees).some(function(campId) {
    const slots = exploKittiesSelectionnees[campId];
    if (!slots) return false;
    return slots.some(function(ki, si) {
      if (campId === excludeCampId && si === excludeSlotIndex) return false;
      return ki === kittyIndex;
    });
  });
}

const RECOMPENSE_LIVRES = {
  schoolGuide:      { emoji: LIVRE_ICONE, nom: "School guide on jobs" },
  fishingGuide:     { emoji: LIVRE_ICONE, nom: "Fishing Guide for Dummies" },
  constructionPlan: { emoji: LIVRE_ICONE, nom: "Construction Plan" },
  stoneGuide:       { emoji: LIVRE_ICONE, nom: "Stone Craft Guide" },
  seminarGuide:     { emoji: LIVRE_ICONE, nom: "Corporate Seminar Booklet" },
  dailyPurpose:     { emoji: LIVRE_ICONE, nom: "The Daily Purpose" },
  engineerGuide:    { emoji: LIVRE_ICONE, nom: "The Engineer's Path" },
  teamworkGuide:    { emoji: LIVRE_ICONE, nom: "The Teamwork Advantage" },
  sturdyHousePlans: { emoji: LIVRE_ICONE, nom: "Sturdy House Plans" }
};

const RESOURCE_DISPLAY_NAMES = {
  basicWoodPlanks:  "Basic Wood Planks",
  rockBricks:       "Rock Bricks",
  humanLeftovers:   "Human Leftovers",
  cannedCatFood:    "Canned Cat Food",
  humanWorkersFood: "Workers Food",
};

function renduRecompensesLuckScouting(sc, kittyIndex) {
  var entries;
  if (sc.recompenseTable) {
    entries = applyPerkCatFood(sc.recompenseTable, kittyIndex);
  } else if (sc.recompenseRange) {
    entries = sc.recompenseRange.map(function(entry) {
      return Object.assign({ recompense: sc.recompense }, entry);
    });
  } else if (sc.dropChance) {
    entries = [{ recompense: sc.recompense, qty: (sc.recompenseRange && sc.recompenseRange[0] ? sc.recompenseRange[0].qty : 1), weight: sc.dropChance * 100 }];
  } else {
    entries = [];
  }
  if (!entries.length) return '<div class="scouting-reward-table"><div class="scouting-reward-option scouting-reward-regular">Reward details unavailable</div></div>';
  var total = entries.reduce(function(sum, entry) { return sum + Number(entry.weight || 0); }, 0) || 100;
  var ordered = entries.slice().sort(function(a, b) { return b.weight - a.weight; });
  const stock = stockCannedCatFoodScouting(sc.id);
  const resetLabel = stock ? formaterCompteAReboursQuetes(millisecondesAvantMinuitParis(Date.now())) : "";
  const stockMarkup = stock
    ? '<span class="scouting-reward-stock" aria-label="Canned Cat Food stock"><button type="button" class="scouting-reward-stock-icon" data-res-id="inv-res-canned-cat-food" aria-label="Show details for Canned Cat Food" aria-expanded="false" aria-controls="inv-res-popup" onclick="toggleResPopup(this,event)"><img src="img/resources/Canned Cat Food_Final.png" alt="Canned Cat Food"></button><strong class="scouting-reward-stock-count">' + stock.remaining + '/' + stock.total + '</strong><span class="scouting-reward-stock-reset"><span>reset in</span><strong>' + echapperAttributHtml(resetLabel) + '</strong></span></span>'
    : '';
  var stockAttached = false;
  const columnCount = Math.min(3, ordered.length);
  const tableHtml = '<div class="scouting-reward-table scouting-reward-columns-' + columnCount + '" aria-label="Scouting reward chances">' + ordered.map(function(entry, index) {
    var category = index === 0 ? "regular" : (index === ordered.length - 1 ? "super-lucky" : "lucky");
    var categoryLabel = category === "regular" ? "Regular Reward" : (category === "lucky" ? "Lucky Reward" : "Super Lucky Reward");
    var chance = Math.round(Number(entry.weight || 0) / total * 100);
    var rewardName = RESOURCE_DISPLAY_NAMES[entry.recompense] || entry.recompense;
    var isCannedCatFood = entry.recompense === "cannedCatFood" && stock;
    var rewardStock = isCannedCatFood && !stockAttached ? stockMarkup : '';
    if (rewardStock) stockAttached = true;
    var rewardQuantity = isCannedCatFood ? '' : '<span class="scouting-reward-quantity">' + entry.qty + ' ' + rewardName + '</span>';
    return '<div class="scouting-reward-option scouting-reward-' + category + '"><div class="scouting-reward-heading"><strong>' + categoryLabel + '</strong><span>' + chance + '%</span></div><div class="scouting-reward-quantity-line">' + rewardQuantity + rewardStock + '</div></div>';
  }).join('') + '</div>';
  return tableHtml;
}

function recompenseLabel(camp) {
  if (camp.recompenses) {
    return camp.recompenses.map(function(entry) {
      return entry.qty + "x " + (RESOURCE_DISPLAY_NAMES[entry.recompense] || entry.recompense);
    }).join(' · ') + ' received';
  }
  const id = camp.recompense;
  if (id === "worldMap") return "Unlock the World Map";
  const livre = id && RECOMPENSE_LIVRES[id];
  if (livre) {
    const hint = etat.itemsAppris.includes(id) ? "Learned" : "go to Inventory to learn it";
    return livre.emoji + " " + livre.nom + " received <span class='recompense-hint'>(" + hint + ")</span>";
  }
  const item = id && ITEMS[id];
  if (item) return item.emoji + " " + item.nom + " received";
  if (camp.recompenseTable) {
    return camp.recompenseTable.map(function(e) {
      return e.weight + '% ' + (RESOURCE_DISPLAY_NAMES[e.recompense] || e.recompense);
    }).join(' / ') + ' received';
  }
  const name = RESOURCE_DISPLAY_NAMES[id];
  if (name) return (camp.recompenseQty ? camp.recompenseQty + "x " : "") + name + " received";
  return (id || "reward") + " received";
}

function renderCampaignCards() {
  const listeEl   = document.getElementById("liste-campaigns");
  const scoutEl   = document.getElementById("liste-scoutings");
  const missionEl = document.getElementById("liste-explo-mission");
  const missionSection = document.getElementById("section-explo-mission");
  const campScoutGrid  = document.getElementById("grille-campaigns-scoutings");
  if (!listeEl) return;

  const zoneId = carteZoneSelectionnee;
  synchroniserNavigationExplorationMobile();

  // No zone selected
  if (!zoneId) {
    if (missionSection) missionSection.style.display = "none";
    if (campScoutGrid)  campScoutGrid.style.display  = "none";
    return;
  }

  const zone     = ZONES_CARTE[zoneId];
  const exploree = etat.zonesExplorees.includes(zoneId);
  let html = "";

  // ── Zone exploration mission (shown in its own panel when zone is not yet explored, non-home) ──
  if (zone && zone.type !== "home" && !exploree) {
    if (campScoutGrid)  campScoutGrid.style.display  = "none";
    if (missionSection) missionSection.style.display = "";
    const inProgress = !!(etat.exploZoneEnCours && etat.exploZoneEnCours.zoneId === zoneId);
    const resultatZone = etat.resultatsExplorationZones[zoneId];
    html += '<div class="explo-card">';
    html += '<div class="explo-nom">&#x1F50D; Explore this zone</div>';
    if (zone.description) html += '<div class="explo-description zone-description">' + zone.description + '</div>';
    html += '<div class="explo-meta">&#x2694;&#xFE0F; Difficulty ' + zone.difficulte + ' &nbsp;&middot;&nbsp; &#x23F1; ' + formaterTempsStat(zone.duree) + ' &nbsp;&middot;&nbsp; &#x1F431; ' + zone.slots + ' slot(s)</div>';
    if (resultatZone) {
      if (resultatZone.success) {
        html += '<button class="explo-result-action explo-result-reveal" onclick="revelerZoneExploree(\'' + zoneId + '\')">🔍 Reveal the explored zone</button>';
      } else {
        html += '<button class="explo-result-action explo-result-failure" onclick="reessayerExploZone(\'' + zoneId + '\')"><img src="img/interface/Red Cross_Final.png?v=0.0029" alt="">Try again</button>';
      }
    } else if (inProgress) {
      const ez        = etat.exploZoneEnCours;
      const elapsed   = (Date.now() - ez.startTs) / 1000;
      const remaining = Math.max(0, ez.duree - elapsed);
      const prog      = Math.min(1, elapsed / ez.duree);
      const names     = ez.kittyIndices.map(function(i) { return etat.kittiesData[i] ? etat.kittiesData[i].nom : "?"; }).join(", ");
      html += '<p class="carte-detail-desc">&#x1F431; ' + names + ' are exploring...</p>';
      html += '<div class="conteneur-barre"><div class="barre barre-explo" id="barre-explo-zone" style="width:' + Math.round(prog * 100) + '%"></div></div>';
      html += '<div class="explo-timer" id="timer-explo-zone">' + formaterTempsStat(Math.ceil(remaining)) + ' remaining</div>';
    } else {
      if (!carteExploSlots[zoneId]) carteExploSlots[zoneId] = new Array(zone.slots).fill(null);
      const slots     = carteExploSlots[zoneId];
      const power     = slots.reduce(function(s, ki) { return s + (ki !== null && etat.kittiesData[ki] ? kittyEP(ki) : 0); }, 0);
      const allFilled = slots.every(function(k) { return k !== null; });
      const chance    = power > 0 ? Math.min(100, Math.round(power / zone.difficulte * 100)) : 0;
      html += '<div class="explo-slots">';
      for (let si = 0; si < zone.slots; si++) {
        const ki = slots[si];
        const requiredExploratorSlot = si === 0;
        const slotWrapperClass = requiredExploratorSlot ? 'explo-slot-required-wrap' : '';
        const slotRequiredClass = requiredExploratorSlot ? ' explo-slot-required' : '';
        const slotRequiredLabel = requiredExploratorSlot ? '<div class="explo-slot-required-label">Explorator</div>' : '';
        const slotAssignmentLabel = (requiredExploratorSlot ? "Assign an Explorator to " : "Assign a cat to ") + zone.nom + ", slot " + (si + 1);
        if (ki === null) {
          html += '<div class="' + slotWrapperClass + '">';
          html += '<div class="explo-slot explo-slot-empty' + slotRequiredClass + '" data-explo-trigger="zone:' + zoneId + ':' + si + '"' + attributsActivationClavier(slotAssignmentLabel) + ' onclick="ouvrirModalExploZone(\'' + zoneId + '\',' + si + ')">';
          html += '<div class="explo-slot-plus">+</div><div class="explo-slot-label">Add cat</div></div>' + slotRequiredLabel;
          html += '</div>';
        } else {
          const k = etat.kittiesData[ki];
          html += '<div class="explo-slot-wrap ' + slotWrapperClass + '">';
          html += '<div class="explo-slot explo-slot-filled' + slotRequiredClass + '" data-explo-trigger="zone:' + zoneId + ':' + si + '"' + attributsActivationClavier("Change " + (k ? k.nom : "cat") + " in " + zone.nom + ", slot " + (si + 1)) + ' onclick="ouvrirModalExploZone(\'' + zoneId + '\',' + si + ')">';
          html += '<span class="explo-slot-emoji">' + kittyIconHtml(k) + '</span>';
          html += '<div class="explo-slot-kitty-info">';
          html += '<span class="explo-slot-kitty-nom">' + (k ? k.nom : "?") + '</span>';
          html += '<span class="explo-slot-kitty-power">&#x26A1; EP ' + kittyEP(ki) + '</span>';
          html += '</div>';
          html += '</div>' + slotRequiredLabel;
          html += '<button class="explo-slot-remove" aria-label="Remove ' + echapperAttributHtml(k ? k.nom : "cat") + ' from ' + echapperAttributHtml(zone.nom) + '" onclick="retirerKittyExploZone(\'' + zoneId + '\',' + si + ')">&#x2715;</button>';
          html += '</div>';
        }
      }
      html += '</div>';
      if (power > 0) {
        var zoneHalves = slots.some(function(ki) { return ki !== null && scoutingHalveTime(ki); });
        var zoneHalvesLabel = slots.some(function(ki) { return ki !== null && etat.kittiesData[ki] && etat.kittiesData[ki].metier === 'explorator'; }) ? 'Explorator' : 'Exploration perk';
        var zoneEffDuree = zoneHalves ? zone.duree / 2 : zone.duree;
        var zoneTimeNote = zoneHalves ? ' &nbsp;&middot;&nbsp; &#x23F1; <strong>' + formaterTempsStat(zoneEffDuree) + '</strong> (' + zoneHalvesLabel + ')' : '';
        html += '<div class="explo-power-display">Exploration Power: ' + power + ' / ' + zone.difficulte + ' &#x2014; <strong>' + chance + '%</strong> success' + zoneTimeNote + '</div>';
      } else {
        html += '<div class="explo-power-display explo-power-hint">Assign cats to start the exploration.</div>';
      }
      const requiredExploratorAssigned = zone.slots === 0 || estExplorateurDeZone(slots[0]);
      const canLaunch = allFilled && requiredExploratorAssigned && !etat.exploZoneEnCours;
      if (!etat.exploZoneEnCours && etat.spherePerks && etat.spherePerks['ex-qol'] === 'learned') {
        html += '<button class="btn-auto-assign" onclick="autoAssignExplo(\'zone\',\'' + zoneId + '\')">Auto Assign</button>';
      }
      html += '<button class="btn-lancer-explo"' + (canLaunch ? '' : ' disabled') + ' onclick="lancerExploZone()">Explore &#x27A4;</button>';
    }
    html += '</div>';
    if (missionEl) missionEl.innerHTML = html;
  return;
  }

  if (campScoutGrid)  campScoutGrid.style.display  = "";
  if (missionSection) missionSection.style.display = "none";

  // ── Campaigns for explored zone (or home) ──
  const campDefs = Object.values(CONFIG.campaigns).filter(function(c) {
    if (c.zone !== zoneId) return false;
    if (c.unlockAfterCampaign) return etat.campaignsCompletees.includes(c.unlockAfterCampaign);
    return true;
  });

  if (campDefs.length === 0) {
    listeEl.innerHTML = '<p class="explo-vide">No campaigns available for this zone yet.</p>';
  } else {
    campDefs.forEach(function(camp) {
      const completed  = etat.campaignsCompletees.includes(camp.id);
      const inProgress = etat.exploEnCours.find(function(e) { return e.id === camp.id; });
      const resultatCampaign = etat.resultatsCampaigns[camp.id];

      if (!exploKittiesSelectionnees[camp.id]) {
        exploKittiesSelectionnees[camp.id] = new Array(camp.slots).fill(null);
      }
      const slots = exploKittiesSelectionnees[camp.id];

      const requiredItemMissing = camp.requiredItem && !etat.itemsAcquis.includes(camp.requiredItem);
      const storyLock = camp.unlockAfterStory && !storyEstVue(camp.unlockAfterStory);
      const campaignLocked = (storyLock && camp.lockedReason) || requiredItemMissing || (!camp.unlockAfterStory && camp.lockedReason);
      const campaignDescription = campaignLocked && camp.lockedDescription ? camp.lockedDescription : camp.description;
      html += '<div class="explo-card' + (campaignLocked && !completed ? ' explo-card-locked' : '') + '">';
      html += '<div class="explo-nom">' + camp.nom + '</div>';
      html += '<div class="explo-description">' + campaignDescription + '</div>';

      if (resultatCampaign) {
        if (resultatCampaign.success) {
          html += '<button class="explo-result-action explo-result-reward" onclick="recupererRecompenseCampaign(\'' + camp.id + '\')">🎁 Claim campaign reward</button>';
        } else {
          html += '<button class="explo-result-action explo-result-failure" onclick="reessayerCampaign(\'' + camp.id + '\')"><img src="img/interface/Red Cross_Final.png?v=0.0029" alt="">Try again</button>';
        }
      } else if (completed) {
        html += '<div class="explo-complete">' + CHECK_ICON + ' Completed &#x2014; ' + recompenseLabel(camp) + '</div>';
      } else if (campaignLocked) {
        html += '<div class="explo-locked-reason">' + (camp.lockedReason || ('Requires ' + (ITEMS[camp.requiredItem] ? ITEMS[camp.requiredItem].nom : camp.requiredItem) + '.')) + '</div>';
      } else if (inProgress) {
        const elapsed   = (Date.now() - inProgress.startTs) / 1000;
        const remaining = Math.max(0, inProgress.duree - elapsed);
        const progress  = Math.min(1, elapsed / inProgress.duree);
        const names     = inProgress.kittyIndices.map(function(i) { return etat.kittiesData[i] ? etat.kittiesData[i].nom : "?"; }).join(", ");
        const power     = Number.isFinite(inProgress.power) ? inProgress.power : inProgress.kittyIndices.reduce(function(s, i) { return s + kittyEP(i); }, 0);
        const chance    = Math.min(100, Math.round(power / camp.difficulte * 100));
        html += '<div class="explo-meta">&#x2694;&#xFE0F; Difficulty ' + camp.difficulte + ' &nbsp;&middot;&nbsp; &#x1F431; ' + names + ' &nbsp;&middot;&nbsp; ' + chance + '% success</div>';
        html += '<div class="conteneur-barre"><div class="barre barre-explo" id="explo-barre-' + camp.id + '" style="width:' + Math.round(progress * 100) + '%"></div></div>';
        html += '<div class="explo-timer" id="explo-timer-' + camp.id + '">' + formaterTempsStat(Math.ceil(remaining)) + ' remaining</div>';
      } else {
        const selPower  = slots.reduce(function(s, ki) { return s + (ki !== null && etat.kittiesData[ki] ? kittyEP(ki) : 0); }, 0);
        const allFilled = slots.every(function(x) { return x !== null; });
        const chance    = selPower > 0 ? Math.min(100, Math.round(selPower / camp.difficulte * 100)) : 0;
        html += '<div class="explo-meta">&#x2694;&#xFE0F; Difficulty ' + camp.difficulte + ' &nbsp;&middot;&nbsp; &#x23F1; ' + formaterTempsStat(camp.duree) + ' &nbsp;&middot;&nbsp; &#x1F381; To be discovered</div>';
        html += '<div class="explo-slots">';
        for (let si = 0; si < camp.slots; si++) {
          const ki = slots[si];
          if (ki === null) {
            html += '<div class="explo-slot explo-slot-empty" data-explo-trigger="campaign:' + camp.id + ':' + si + '"' + attributsActivationClavier("Assign a cat to " + camp.nom + ", slot " + (si + 1)) + ' onclick="ouvrirModalExplo(\'' + camp.id + '\',' + si + ')">';
            html += '<div class="explo-slot-plus">+</div><div class="explo-slot-label">Add cat</div></div>';
          } else {
            const k = etat.kittiesData[ki];
            html += '<div class="explo-slot-wrap">';
            html += '<div class="explo-slot explo-slot-filled" data-explo-trigger="campaign:' + camp.id + ':' + si + '"' + attributsActivationClavier("Change " + (k ? k.nom : "cat") + " in " + camp.nom + ", slot " + (si + 1)) + ' onclick="ouvrirModalExplo(\'' + camp.id + '\',' + si + ')">';
            html += '<span class="explo-slot-emoji">' + kittyIconHtml(k) + '</span>';
            html += '<div class="explo-slot-kitty-info">';
            html += '<span class="explo-slot-kitty-nom">' + (k ? k.nom : "?") + '</span>';
            html += '<span class="explo-slot-kitty-power">&#x26A1; EP ' + kittyEP(ki) + '</span>';
            html += '</div>';
            html += '</div>';
            html += '<button class="explo-slot-remove" aria-label="Remove ' + echapperAttributHtml(k ? k.nom : "cat") + ' from ' + echapperAttributHtml(camp.nom) + '" onclick="retirerKittySlot(\'' + camp.id + '\',' + si + ')">&#x2715;</button>';
            html += '</div>';
          }
        }
        html += '</div>';
        if (selPower > 0) {
          var campHalves = slots.some(function(ki) { return ki !== null && scoutingHalveTime(ki); });
          var campHalvesLabel = slots.some(function(ki) { return ki !== null && etat.kittiesData[ki] && etat.kittiesData[ki].metier === 'explorator'; }) ? 'Explorator' : 'Exploration perk';
          var campEffDuree = campHalves ? camp.duree / 2 : camp.duree;
          var campTimeNote = campHalves ? ' &nbsp;&middot;&nbsp; &#x23F1; <strong>' + formaterTempsStat(campEffDuree) + '</strong> (' + campHalvesLabel + ')' : '';
          html += '<div class="explo-power-display">Exploration Power: ' + selPower + ' / ' + camp.difficulte + ' &#x2014; <strong>' + chance + '%</strong> success' + campTimeNote + '</div>';
        } else {
          html += '<div class="explo-power-display explo-power-hint">Click a slot to assign a cat.</div>';
        }
        if (etat.spherePerks && etat.spherePerks['ex-qol'] === 'learned') {
          html += '<button class="btn-auto-assign" onclick="autoAssignExplo(\'campaign\',\'' + camp.id + '\')">Auto Assign</button>';
        }
        html += '<button class="btn-lancer-explo"' + (allFilled ? '' : ' disabled') + ' onclick="lancerExplo(\'' + camp.id + '\')">Send on campaign &#x27A4;</button>';
      }
      html += '</div>';
    });
    listeEl.innerHTML = html;
  }

  // ── Scoutings for explored zone ──
  if (scoutEl) {
    var scoutDefs = Object.values(CONFIG.scoutings).filter(function(s) {
      return s.zone === zoneId && scoutingDebloquee(s);
    });
    if (scoutDefs.length === 0) {
      scoutEl.innerHTML = '<p class="explo-vide">No scouting missions available yet.</p>';
    } else {
      var scoutHtml = "";
      scoutDefs.forEach(function(sc) {
        var running = etat.scoutingsEnCours[sc.id];
        var scKiDisp = running ? running.kittyIndex : scoutingsStagingKitty[sc.id];
        scoutHtml += '<div class="explo-card">';
        scoutHtml += '<div class="explo-nom">' + sc.nom + '</div>';
        scoutHtml += '<div class="explo-description">' + sc.description + '</div>';
        scoutHtml += '<div class="explo-meta">&#x2694;&#xFE0F; Difficulty ' + sc.difficulte + ' &nbsp;&middot;&nbsp; &#x23F1; ' + formaterTempsStat(sc.duree) + '</div>';
        scoutHtml += renduRecompensesLuckScouting(sc, scKiDisp);
        if (scKiDisp !== undefined) {
          var kDisp = etat.kittiesData[scKiDisp];
          var perkParts = [];
          if (scoutingCatFoodMultiplier(scKiDisp) > 1) perkParts.push('×' + scoutingCatFoodMultiplier(scKiDisp) + ' Canned Cat Food chance');
          if (scoutingLuckyFoodChance(scKiDisp) > 0) perkParts.push(Math.round(scoutingLuckyFoodChance(scKiDisp) * 100) + '% stock preservation');
          if (scoutingDoubleChance(scKiDisp) > 0) perkParts.push(Math.round(scoutingDoubleChance(scKiDisp) * 100) + '% Double');
          if (scoutingTripleChance(scKiDisp) > 0) perkParts.push(Math.round(scoutingTripleChance(scKiDisp) * 100) + '% Triple after Double');
          if (kDisp && perkParts.length > 0) {
            var rewardPerkOwner = kDisp.metier === 'explorator' ? 'Explorator' : kDisp.nom;
            scoutHtml += '<div class="scouting-reward-perk">' + rewardPerkOwner + ' perks: ' + perkParts.join(' · ') + '</div>';
          }
        }
        if (running) {
          var effectiveDuree = (running.duree !== undefined) ? running.duree : sc.duree;
          var elapsed   = (Date.now() - running.startTs) / 1000;
          var remaining = Math.max(0, effectiveDuree - elapsed);
          var prog      = Math.min(1, elapsed / effectiveDuree);
          var k         = etat.kittiesData[running.kittyIndex];
          var kNom      = k ? k.nom : "?";
          var kPower    = Number.isFinite(running.power) ? running.power : kittyEP(running.kittyIndex);
          scoutHtml += '<div class="explo-slots">';
          scoutHtml += '<div class="explo-slot-wrap">';
          scoutHtml += '<div class="explo-slot explo-slot-filled">';
          scoutHtml += '<span class="explo-slot-emoji">' + kittyIconHtml(k) + '</span>';
          scoutHtml += '<div class="explo-slot-kitty-info">';
          scoutHtml += '<span class="explo-slot-kitty-nom">' + kNom + '</span>';
          scoutHtml += '<span class="explo-slot-kitty-power">&#x26A1; EP ' + kPower + '</span>';
          scoutHtml += '</div>';
          scoutHtml += '</div>';
          scoutHtml += '<button class="explo-slot-remove" aria-label="Remove ' + echapperAttributHtml(kNom) + ' from ' + echapperAttributHtml(sc.nom) + '" onclick="retirerKittyScouting(\'' + sc.id + '\')">&#x2715;</button>';
          scoutHtml += '</div>';
          scoutHtml += '</div>';
          scoutHtml += '<div class="conteneur-barre"><div class="barre barre-explo" id="scout-barre-' + sc.id + '" style="width:' + Math.round(prog * 100) + '%"></div></div>';
          scoutHtml += '<div class="explo-timer" id="scout-timer-' + sc.id + '">' + formaterTempsStat(Math.ceil(remaining)) + ' remaining &#x21BA; auto-repeats</div>';
        } else {
          var stagedKi  = scoutingsStagingKitty[sc.id];
          var stagedK   = (stagedKi !== undefined) ? etat.kittiesData[stagedKi] : null;
          var selPower  = stagedKi !== undefined ? kittyEP(stagedKi) : 0;
          var chance    = selPower > 0 ? Math.min(100, Math.round(selPower / sc.difficulte * 100)) : 0;
          scoutHtml += '<div class="explo-slots">';
          if (stagedKi !== undefined) {
            scoutHtml += '<div class="explo-slot-wrap">';
            scoutHtml += '<div class="explo-slot explo-slot-filled" data-explo-trigger="scouting:' + sc.id + '"' + attributsActivationClavier("Change " + (stagedK ? stagedK.nom : "cat") + " in " + sc.nom) + ' onclick="ouvrirModalScouting(\'' + sc.id + '\')">';
            scoutHtml += '<span class="explo-slot-emoji">' + kittyIconHtml(stagedK) + '</span>';
            scoutHtml += '<div class="explo-slot-kitty-info">';
            scoutHtml += '<span class="explo-slot-kitty-nom">' + (stagedK ? stagedK.nom : "?") + '</span>';
            scoutHtml += '<span class="explo-slot-kitty-power">&#x26A1; EP ' + selPower + '</span>';
            scoutHtml += '</div>';
            scoutHtml += '</div>';
            scoutHtml += '<button class="explo-slot-remove" aria-label="Remove ' + echapperAttributHtml(stagedK ? stagedK.nom : "cat") + ' from ' + echapperAttributHtml(sc.nom) + '" onclick="retirerScoutingStaging(\'' + sc.id + '\')">&#x2715;</button>';
            scoutHtml += '</div>';
          } else {
            scoutHtml += '<div class="explo-slot explo-slot-empty" data-explo-trigger="scouting:' + sc.id + '"' + attributsActivationClavier("Assign a cat to " + sc.nom) + ' onclick="ouvrirModalScouting(\'' + sc.id + '\')">';
            scoutHtml += '<div class="explo-slot-plus">+</div><div class="explo-slot-label">Add cat</div></div>';
          }
          scoutHtml += '</div>';
          if (selPower > 0) {
            var scoutHalves = stagedKi !== undefined && scoutingHalveTime(stagedKi);
            var scoutEffDuree = scoutHalves ? sc.duree / 2 : sc.duree;
            var scoutHalvesLabel = stagedK && stagedK.metier === 'explorator' ? 'Explorator' : 'Exploration perk';
            var scoutTimeNote = scoutHalves ? ' &nbsp;&middot;&nbsp; &#x23F1; <strong>' + formaterTempsStat(scoutEffDuree) + '</strong> (' + scoutHalvesLabel + ')' : '';
            scoutHtml += '<div class="explo-power-display">Exploration Power: ' + selPower + ' / ' + sc.difficulte + ' &#x2014; <strong>' + chance + '%</strong> success' + scoutTimeNote + '</div>';
          } else {
            scoutHtml += '<div class="explo-power-display explo-power-hint">Click a slot to assign a cat.</div>';
          }
          if (etat.spherePerks && etat.spherePerks['ex-qol'] === 'learned') {
            scoutHtml += '<button class="btn-auto-assign" onclick="autoAssignExplo(\'scouting\',\'' + sc.id + '\')">Auto Assign</button>';
          }
          scoutHtml += '<button class="btn-lancer-explo"' + (stagedKi !== undefined ? '' : ' disabled') + ' onclick="lancerScouting(\'' + sc.id + '\')">Send to scout &#x27A4;</button>';
        }
        var butin = etat.butinsScouting[sc.id];
        if (butin && butin.successful + butin.failed > 0) {
          var rewardsText = Object.keys(butin.rewards).map(function(recompenseId) {
            return (RESOURCE_DISPLAY_NAMES[recompenseId] || recompenseId) + ' ×' + formaterNombre(butin.rewards[recompenseId]);
          }).join(' · ');
          var doubledVisible = false;
          var tripledVisible = false;
          if (running && scoutingDoubleChance(running.kittyIndex) > 0) {
            var runningKitty = etat.kittiesData[running.kittyIndex];
            doubledVisible = !!runningKitty;
            tripledVisible = !!runningKitty && scoutingTripleChance(running.kittyIndex) > 0;
          }
          scoutHtml += '<div class="scouting-accumulator">';
          scoutHtml += '<div class="scouting-runs"><span class="scouting-metric-label">Scouting Runs:</span><strong class="scouting-successful">Successful ' + butin.successful + '</strong><span class="scouting-failed">Failed ' + butin.failed + '</span></div>';
          scoutHtml += '<div class="scouting-luck"><span class="scouting-metric-label">Rewards Luck:</span><span>Regular ' + butin.regular + '</span><span class="scouting-lucky">Lucky ' + butin.lucky + '</span><strong class="scouting-super-lucky">Super Lucky ' + butin.superLucky + '</strong>' + (doubledVisible ? '<strong class="scouting-doubled">Doubled ' + butin.doubled + '</strong>' : '') + (tripledVisible ? '<strong class="scouting-tripled">Tripled ' + (butin.tripled || 0) + '</strong>' : '') + '</div>';
          scoutHtml += '<div class="scouting-rewards">' + (rewardsText || 'No rewards collected yet') + '</div>';
          scoutHtml += '<button class="explo-result-action explo-result-reward" onclick="recupererButinScouting(\'' + sc.id + '\')">🎁 Claim scouting rewards</button>';
          scoutHtml += '</div>';
        }
        scoutHtml += '</div>';
      });
      scoutEl.innerHTML = scoutHtml;
    }
  }
}

// ── Carte d'exploration ──────────────────────────────────────

// Returns all [col, row] pairs occupied by a zone (handles colSpan/rowSpan and multi-part zones).
function getZoneCells(zone) {
  function partCells(p) {
    const cs = p.colSpan || 1, rs = p.rowSpan || 1;
    const out = [];
    for (let dc = 0; dc < cs; dc++)
      for (let dr = 0; dr < rs; dr++)
        out.push([p.col + dc, p.row + dr]);
    return out;
  }
  if (zone.parts) {
    const all = [];
    zone.parts.forEach(function(p) { partCells(p).forEach(function(c) { all.push(c); }); });
    return all;
  }
  return partCells(zone);
}

// Returns the CSS grid-column/row placement string for one rectangular part.
// topGameRow is the highest-numbered game row the part occupies (= part.row + rowSpan - 1).
function getPartGridStyle(part, ROWS) {
  const cs = part.colSpan || 1, rs = part.rowSpan || 1;
  const topGameRow  = part.row + rs - 1;
  const cssRowStart = ROWS - topGameRow + 1;
  const cssColStart = part.col + 2; // column 1 is the row-label
  return 'grid-column:' + cssColStart + '/' + (cssColStart + cs)
       + ';grid-row:'   + cssRowStart + '/' + (cssRowStart + rs);
}

// Single rollback switch for the decorative fog drift. The static fog remains
// the gameplay/fallback layer when this is false.
const MAP_FOG_MOTION_ENABLED = true;
const SPHERE_FOG_MOTION_ENABLED = true;
// Keep the fog phase stable when selecting a zone rebuilds the map DOM. The
// CSS animation uses this shared clock as a negative delay, so a click cannot
// visibly reset or stop the continuous rightward drift.
const MAP_FOG_ANIMATION_DURATION_MS = 90000;
const MAP_FOG_SECONDARY_DURATION_MS = 140000;

// Fog of war: a zone is revealed if it's Home, already explored, or any of its
// cells is orthogonally adjacent to any cell of an already-explored zone.
function zoneEstVisible(zoneId) {
  const zone = ZONES_CARTE[zoneId];
  if (!zone) return false;
  if (zone.type === "home") return true;
  if (etat.zonesExplorees.includes(zoneId)) return true;
  const myCells = getZoneCells(zone);
  return Object.values(ZONES_CARTE).some(function(z) {
    if (!etat.zonesExplorees.includes(z.id)) return false;
    const expCells = getZoneCells(z);
    return myCells.some(function(mc) {
      return expCells.some(function(ec) {
        return Math.abs(ec[0] - mc[0]) + Math.abs(ec[1] - mc[1]) === 1;
      });
    });
  });
}

function renduCarteGrille() {
  const el = document.getElementById("carte-grille");
  if (!el) return;
  el.classList.toggle("carte-fog-motion", MAP_FOG_MOTION_ENABLED);
  if (MAP_FOG_MOTION_ENABLED) {
    const cycleMs = MAP_FOG_ANIMATION_DURATION_MS;
    const phaseMs = Date.now() % cycleMs;
    el.style.setProperty('--fog-animation-delay', '-' + phaseMs + 'ms');
    const secondaryPhaseMs = Date.now() % MAP_FOG_SECONDARY_DURATION_MS;
    el.style.setProperty('--fog-secondary-animation-delay', '-' + secondaryPhaseMs + 'ms');
  }
  const ROWS = 5, COLS = 7, LETTERS = "ABCDEFG";
  const explorateurOk = explorateurPresent();

  const region = REGIONS[etat.regionCourante] || {};
  const mapImg = region.mapImg || null;

  function renduFogGlobal() {
    const unit = 100;
    const mapWidth = COLS * unit;
    const mapHeight = ROWS * unit;
    let mask = '<rect x="0" y="0" width="' + mapWidth + '" height="' + mapHeight + '" fill="white" shape-rendering="crispEdges"></rect>';

    Object.values(ZONES_CARTE).forEach(function(zone) {
      const revealed = zone.type === "home" || etat.zonesExplorees.includes(zone.id);
      if (!revealed) return;
      (zone.parts || [zone]).forEach(function(part) {
        const x = part.col * unit;
        const y = (ROWS + 1 - part.row - (part.rowSpan || 1)) * unit;
        const width = (part.colSpan || 1) * unit;
        const height = (part.rowSpan || 1) * unit;
        mask += '<rect x="' + x + '" y="' + y + '" width="' + width + '" height="' + height + '" fill="black" shape-rendering="crispEdges"></rect>';
      });
    });

    return '<svg class="carte-fog-global" viewBox="0 0 ' + mapWidth + ' ' + mapHeight + '" preserveAspectRatio="none" aria-hidden="true">'
      + '<defs><mask id="carte-fog-global-mask" maskUnits="userSpaceOnUse" x="0" y="0" width="' + mapWidth + '" height="' + mapHeight + '">'
      + mask
      + '</mask>'
      + '<filter id="carte-fog-seam-softener" x="-2%" y="-1%" width="104%" height="102%" color-interpolation-filters="sRGB">'
      + '<feGaussianBlur in="SourceGraphic" stdDeviation="1.8 0"></feGaussianBlur>'
      + '</filter></defs>'
      + '<g mask="url(#carte-fog-global-mask)">'
      + '<rect x="0" y="0" width="' + mapWidth + '" height="' + mapHeight + '" fill="#74778f"></rect>'
      + '<g class="carte-fog-global-track" filter="url(#carte-fog-seam-softener)">'
      + '<image href="img/Maps/Fog of War.png" x="0" y="0" width="' + mapWidth + '" height="' + mapHeight + '" preserveAspectRatio="none"></image>'
      + '<image href="img/Maps/Fog of War.png" x="0" y="0" width="' + mapWidth + '" height="' + mapHeight + '" preserveAspectRatio="none" transform="translate(' + (mapWidth * 2) + ' 0) scale(-1 1)"></image>'
      + '<image href="img/Maps/Fog of War.png" x="' + (mapWidth * 2) + '" y="0" width="' + mapWidth + '" height="' + mapHeight + '" preserveAspectRatio="none"></image>'
      + '</g>'
      + '<g class="carte-fog-secondary-track" filter="url(#carte-fog-seam-softener)">'
      + '<image href="img/Maps/Fog of War.png" x="0" y="-30" width="' + mapWidth + '" height="' + (mapHeight + 60) + '" preserveAspectRatio="none"></image>'
      + '<image href="img/Maps/Fog of War.png" x="0" y="-30" width="' + mapWidth + '" height="' + (mapHeight + 60) + '" preserveAspectRatio="none" transform="translate(' + (mapWidth * 2) + ' 0) scale(-1 1)"></image>'
      + '<image href="img/Maps/Fog of War.png" x="' + (mapWidth * 2) + '" y="-30" width="' + mapWidth + '" height="' + (mapHeight + 60) + '" preserveAspectRatio="none"></image>'
      + '</g></g></svg>';
  }

  // Build cell → zone map (supports multi-part zones).
  const cellMap = {};
  Object.values(ZONES_CARTE).forEach(function(z) {
    getZoneCells(z).forEach(function(c) { cellMap[c[0] + ',' + c[1]] = z.id; });
  });

  const rendered = new Set();
  let html = "";
  if (mapImg) {
    html += '<div class="carte-map-artwork" style="grid-column:2 / 9;grid-row:1 / 6;background-image:url(\'' + mapImg + '\')" aria-hidden="true"></div>';
  }

  for (let row = ROWS; row >= 1; row--) {
    const cssRow = ROWS - row + 1; // grid row 1 = game row 5 (top)
    html += '<div class="carte-row-lbl" style="grid-column:1;grid-row:' + cssRow + '">' + row + '</div>';

    for (let ci = 0; ci < COLS; ci++) {
      const zoneId = cellMap[ci + ',' + row];
      const cssCol  = ci + 2;

      if (!zoneId) {
        html += '<div class="carte-cellule carte-fog" style="grid-column:' + cssCol + ';grid-row:' + cssRow + '"></div>';
        continue;
      }
      if (rendered.has(zoneId)) continue;
      rendered.add(zoneId);

      const zone  = ZONES_CARTE[zoneId];
      const parts = zone.parts || [zone]; // single-rect zones act as their own part
      const isMulti = getZoneCells(zone).length > 1;

      if (!zoneEstVisible(zoneId)) {
        parts.forEach(function(p) {
          html += '<div class="carte-cellule carte-fog" style="' + getPartGridStyle(p, ROWS) + '"></div>';
        });
        continue;
      }

      const exploree   = etat.zonesExplorees.includes(zoneId);
      const inProgress = !!(etat.exploZoneEnCours && etat.exploZoneEnCours.zoneId === zoneId);
      const revealReady = !!(etat.resultatsExplorationZones[zoneId] && etat.resultatsExplorationZones[zoneId].success);
      const campaignRewardReady = Object.keys(etat.resultatsCampaigns).some(function(campaignId) {
        const camp = CONFIG.campaigns[campaignId];
        return camp && camp.zone === zoneId && etat.resultatsCampaigns[campaignId].success;
      });
      const failedResultReady = !!(etat.resultatsExplorationZones[zoneId] && !etat.resultatsExplorationZones[zoneId].success)
        || Object.keys(etat.resultatsCampaigns).some(function(campaignId) {
          const camp = CONFIG.campaigns[campaignId];
          return camp && camp.zone === zoneId && !etat.resultatsCampaigns[campaignId].success;
        });
      const scoutingRewardReady = scoutingIdsAvecButinZone(zoneId).length > 0;
      const selected   = carteZoneSelectionnee === zoneId;
      const locked     = zone.type !== "home" && !explorateurOk;
      const zoneEtatLabel = locked ? "locked" : (inProgress ? "exploration in progress" : (exploree ? "explored" : "unexplored"));

      parts.forEach(function(p, pi) {
        const isPrimary = pi === 0;
        let cls = "carte-cellule carte-" + zone.type;
        if (mapImg)     cls += " carte-avec-image";
        if (isMulti)    cls += " carte-multicel";
        if (!isPrimary) cls += " carte-part-secondary";
        if (!exploree)  cls += " carte-inexploree";
        if (selected)   cls += " carte-selectionnee";
        if (locked)     cls += " carte-verrouillee";

        html += '<div class="' + cls + '" style="' + getPartGridStyle(p, ROWS) + '" data-zone-part-id="' + zoneId + '"'
          + (isPrimary
            ? attributsActivationClavier(zone.nom + ", " + zoneEtatLabel) + ' data-zone-id="' + zoneId + '" aria-pressed="' + (selected ? "true" : "false") + '"'
            : ' aria-hidden="true"')
          + ' onclick="clicZoneCarte(\'' + zoneId + '\')"'
          + ' title="' + (locked ? "Train an Explorator to unlock" : "") + '">';
        if (isPrimary) {
          if (!exploree) {
            html += locked
              ? '<span class="carte-icone">🔒</span>'
              : '<span class="carte-badge-inconnu">?</span>';
          }
          if (inProgress) html += '<span class="carte-badge-encours">⏳</span>';
          if (revealReady) html += '<span class="carte-badge-result carte-badge-reveal" title="Zone ready to reveal">🔍</span>';
          if (campaignRewardReady || scoutingRewardReady) html += '<span class="carte-badge-result carte-badge-reward" title="Rewards ready to claim">🎁</span>';
          if (failedResultReady) html += '<span class="carte-badge-result carte-badge-failure" title="Mission ready to retry">❌</span>';
          if (exploree) {
            var zoneScouts = Object.values(CONFIG.scoutings).filter(function(s) {
              return s.zone === zoneId && scoutingDebloquee(s);
            });
            if (zoneScouts.length > 0) {
              var anyActive = zoneScouts.some(function(s) { return !!etat.scoutingsEnCours[s.id]; });
              html += '<span class="carte-badge-scout ' + (anyActive ? 'carte-badge-scout-actif' : 'carte-badge-scout-idle') + '"></span>';
            }
          }
        }
        html += '</div>';
      });
    }
  }

  html += renduFogGlobal();
  el.innerHTML = html;
}

function renduCarteDetail() {
  const el = document.getElementById("carte-zone-detail");
  if (!el) return;
  const zoneId = carteZoneSelectionnee;
  if (!zoneId) {
    el.innerHTML = '<p class="carte-hint">Click a zone to see details.</p>';
    return;
  }
  const zone    = ZONES_CARTE[zoneId];
  if (!zone) { el.innerHTML = ""; return; }
  const exploree   = etat.zonesExplorees.includes(zoneId);
  const inProgress = !!(etat.exploZoneEnCours && etat.exploZoneEnCours.zoneId === zoneId);
  let html = '<div class="carte-detail-panneau">';
  html += '<div class="carte-detail-titre">' + zone.icone + ' ' + zone.nom + '</div>';
  if (zone.type === "home") {
    html += '<p class="carte-detail-statut exploree">' + CHECK_ICON + ' Home — always accessible.</p>';
    html += '</div>'; el.innerHTML = html; return;
  }
  html += '<div class="carte-detail-stats">';
  html += '<span>⚔️ Difficulty: ' + zone.difficulte + '</span>';
  html += '<span>⏱ Duration: ' + formaterTempsStat(zone.duree) + '</span>';
  html += '<span>' + KITTY_ICON + ' ' + zone.slots + ' slot' + (zone.slots > 1 ? 's' : '') + '</span>';
  html += '</div>';
  if (exploree) {
    html += '<p class="carte-detail-statut exploree">' + CHECK_ICON + ' Explored — missions coming soon.</p>';
  } else if (inProgress) {
    const ez = etat.exploZoneEnCours;
    const elapsed   = (Date.now() - ez.startTs) / 1000;
    const remaining = Math.max(0, ez.duree - elapsed);
    const prog      = Math.min(1, elapsed / ez.duree);
    const names     = ez.kittyIndices.map(function(i) { return etat.kittiesData[i] ? etat.kittiesData[i].nom : "?"; }).join(", ");
    html += '<p class="carte-detail-desc">' + KITTY_ICON + ' ' + names + ' are exploring...</p>';
    html += '<div class="conteneur-barre"><div class="barre barre-explo" id="barre-explo-zone" style="width:' + Math.round(prog * 100) + '%"></div></div>';
    html += '<div class="explo-timer" id="timer-explo-zone">' + formaterTempsStat(Math.ceil(remaining)) + ' remaining</div>';
  } else {
    if (!carteExploSlots[zoneId]) carteExploSlots[zoneId] = new Array(zone.slots).fill(null);
    const slots    = carteExploSlots[zoneId];
    const power    = slots.reduce(function(s, ki) { return s + (ki !== null && etat.kittiesData[ki] ? kittyEP(ki) : 0); }, 0);
    const allFilled = slots.every(function(k) { return k !== null; });
    const chance   = power > 0 ? Math.min(100, Math.round(power / zone.difficulte * 100)) : 0;
    html += '<div class="explo-slots">';
    for (let si = 0; si < zone.slots; si++) {
      const ki = slots[si];
      const requiredExploratorSlot = si === 0;
      const slotWrapperClass = requiredExploratorSlot ? 'explo-slot-required-wrap' : '';
      const slotRequiredClass = requiredExploratorSlot ? ' explo-slot-required' : '';
      const slotRequiredLabel = requiredExploratorSlot ? '<div class="explo-slot-required-label">Explorator</div>' : '';
      const slotAssignmentLabel = (requiredExploratorSlot ? "Assign an Explorator to " : "Assign a cat to ") + zone.nom + ", slot " + (si + 1);
      if (ki === null) {
        html += '<div class="' + slotWrapperClass + '">' + slotRequiredLabel;
        html += '<div class="explo-slot explo-slot-empty' + slotRequiredClass + '" data-explo-trigger="zone:' + zoneId + ':' + si + '"' + attributsActivationClavier(slotAssignmentLabel) + ' onclick="ouvrirModalExploZone(\'' + zoneId + '\',' + si + ')">';
        html += '<div class="explo-slot-plus">+</div><div class="explo-slot-label">Add cat</div></div>';
        html += '</div>';
      } else {
        const k = etat.kittiesData[ki];
        html += '<div class="explo-slot-wrap ' + slotWrapperClass + '">' + slotRequiredLabel;
        html += '<div class="explo-slot explo-slot-filled' + slotRequiredClass + '" data-explo-trigger="zone:' + zoneId + ':' + si + '"' + attributsActivationClavier("Change " + (k ? k.nom : "cat") + " in " + zone.nom + ", slot " + (si + 1)) + ' onclick="ouvrirModalExploZone(\'' + zoneId + '\',' + si + ')">';
        html += '<span class="explo-slot-emoji">' + kittyIconHtml(k) + '</span>';
        html += '<div class="explo-slot-kitty-info">';
        html += '<span class="explo-slot-kitty-nom">' + (k ? k.nom : "?") + '</span>';
        html += '<span class="explo-slot-kitty-power">⚡ EP ' + kittyEP(ki) + '</span>';
        html += '</div>';
        html += '</div>';
        html += '<button class="explo-slot-remove" aria-label="Remove ' + echapperAttributHtml(k ? k.nom : "cat") + ' from ' + echapperAttributHtml(zone.nom) + '" onclick="retirerKittyExploZone(\'' + zoneId + '\',' + si + ')"><img src="img/interface/Red Cross_Final.png?v=0.0029" alt=""></button>';
        html += '</div>';
      }
    }
    html += '</div>';
    if (power > 0) {
      html += '<div class="explo-power-display">Exploration Power: ' + power + ' / ' + zone.difficulte + ' — <strong>' + chance + '%</strong> success</div>';
    } else {
      html += '<div class="explo-power-display explo-power-hint">Assign cats to start the exploration.</div>';
    }
    const requiredExploratorAssigned = zone.slots === 0 || estExplorateurDeZone(slots[0]);
    const canLaunch = allFilled && requiredExploratorAssigned && !etat.exploZoneEnCours;
    if (!etat.exploZoneEnCours && etat.spherePerks && etat.spherePerks['ex-qol'] === 'learned') {
      html += '<button class="btn-auto-assign" onclick="autoAssignExplo(\'zone\',\'' + zoneId + '\')">Auto Assign</button>';
    }
    html += '<button class="btn-lancer-explo"' + (canLaunch ? '' : ' disabled') + ' onclick="lancerExploZone()">Explore ➤</button>';
  }
  html += '</div>';
  el.innerHTML = html;
}

function renduCarte(u) {
  const el = document.getElementById("explo-map-section");
  if (!el) return;
  if (carteDirty || !document.getElementById("carte-grille")) {
    // The detail panel is recreated below, so its content cache must not
    // suppress the first render when the selected zone stays unchanged.
    _zoneInfoKey = null;
    el.innerHTML =
      '<div class="carte-grille-conteneur">' +
        (etat.jobCenterConstruit && (!u || !u.explorateurPresent) ? '<p class="explo-map-hint">Train an <strong>Explorator</strong> in the Job Center to unlock other zones.</p>' : '') +
        '<div class="carte-grille" id="carte-grille"></div>' +
        '<div class="carte-col-lbls" id="carte-col-lbls"></div>' +
      '</div>' +
      '<div class="carte-zone-info" id="carte-zone-info"></div>';
    const clEl = document.getElementById("carte-col-lbls");
    if (clEl) {
      let h = '<div></div>';
      "ABCDEFG".split("").forEach(function(l) { h += '<div class="carte-col-lbl">' + l + '</div>'; });
      clEl.innerHTML = h;
    }
    carteDirty = false;
    renduCarteGrille();
  }
  renduZoneInfo();
}

function renduZoneInfo() {
  const el = document.getElementById("carte-zone-info");
  if (!el) return;
  const zoneId = carteZoneSelectionnee;

  // Build a cache key covering everything that affects this panel's content.
  // Timer elements (barre-explo-zone, timer-explo-zone) are updated via direct DOM — they
  // don't need a full rebuild, so we intentionally exclude running timers from the key.
  const exploree = zoneId ? etat.zonesExplorees.includes(zoneId) : false;
  const completedCamps = zoneId
    ? Object.keys(CONFIG.campaigns).filter(function(id) {
        return CONFIG.campaigns[id].zone === zoneId && etat.campaignsCompletees.includes(id);
      }).sort().join(',')
    : '';
  const activeScouts = zoneId
    ? Object.keys(etat.scoutingsEnCours).filter(function(id) {
        return CONFIG.scoutings[id] && CONFIG.scoutings[id].zone === zoneId;
      }).sort().join(',')
    : '';
  const pendingCampaignResults = zoneId
    ? Object.keys(etat.resultatsCampaigns).filter(function(id) {
        return CONFIG.campaigns[id] && CONFIG.campaigns[id].zone === zoneId;
      }).sort().join(',')
    : '';
  const pendingZoneResult = zoneId && etat.resultatsExplorationZones[zoneId]
    ? (etat.resultatsExplorationZones[zoneId].success ? 'success' : 'failure')
    : '';
  const scoutingRewardIds = scoutingIdsAvecButinZone(zoneId).sort();
  const scoutingRewardCount = scoutingRewardIds.reduce(function(total, scoutingId) {
    const butin = etat.butinsScouting[scoutingId];
    return total + Object.values((butin && butin.rewards) || {}).reduce(function(sum, qty) {
      return sum + Math.max(0, Number(qty) || 0);
    }, 0);
  }, 0);
  const scoutingRewards = scoutingRewardIds.join(',');
  const key = (zoneId || '') + '|' + exploree + '|' + completedCamps + '|' + activeScouts
    + '|' + pendingCampaignResults + '|' + pendingZoneResult + '|' + scoutingRewards;
  if (key === _zoneInfoKey) return;
  _zoneInfoKey = key;

  if (!zoneId) { el.innerHTML = '<p class="explo-vide">Select a zone to see its details.</p>'; return; }
  const zone = ZONES_CARTE[zoneId];
  if (!zone) { el.innerHTML = ""; return; }

  let html = '<div class="zone-info-titre">' + (exploree ? zone.nom : 'Unknown zone') + '</div>';
  if (zone.description) html += '<div class="zone-description">' + zone.description + '</div>';

  const zoneAccessible = zone.type === "home" || exploree;
  const campagnesZone = campagnesAfficheesPourZone(zoneId);
  const scoutingsZone = scoutingsAffichesPourZone(zoneId);
  const campaignsDoneCount = campagnesZone.filter(function(campaign) {
    return etat.campaignsCompletees.includes(campaign.id);
  }).length;
  const campaignsAvailableCount = campagnesZone.filter(function(campaign) {
    if (etat.campaignsCompletees.includes(campaign.id)) return false;
    const requiredItemMissing = campaign.requiredItem && !etat.itemsAcquis.includes(campaign.requiredItem);
    const storyLock = campaign.unlockAfterStory && !storyEstVue(campaign.unlockAfterStory);
    const campaignLocked = (storyLock && campaign.lockedReason)
      || requiredItemMissing
      || (!campaign.unlockAfterStory && campaign.lockedReason);
    return !campaignLocked;
  }).length;
  const activeScoutingCount = scoutingsZone.filter(function(scouting) {
    return !!etat.scoutingsEnCours[scouting.id];
  }).length;
  const inactiveScoutingCount = Math.max(0, scoutingsZone.length - activeScoutingCount);
  let mobileSummary = '<span><strong>1</strong> Exploration mission</span>';
  if (zoneAccessible) {
    if (campagnesZone.length === 0 && scoutingsZone.length === 0) {
      mobileSummary = '<span class="zone-info-mobile-empty">Empty</span>';
    } else {
      mobileSummary = '<span class="zone-info-mobile-done"><strong>' + campaignsDoneCount + '</strong> Campaign'
        + (campaignsDoneCount === 1 ? '' : 's') + ' done</span>';
      if (campaignsAvailableCount > 0) {
        mobileSummary += '<span class="zone-info-mobile-available"><strong>' + campaignsAvailableCount + '</strong> Campaign'
          + (campaignsAvailableCount === 1 ? '' : 's') + ' avail</span>';
      }
      if (inactiveScoutingCount > 0) {
        mobileSummary += '<span class="zone-info-mobile-inactive"><strong>' + inactiveScoutingCount + '</strong> Scouting'
          + (inactiveScoutingCount === 1 ? '' : 's') + ' inactive</span>';
      }
      if (activeScoutingCount > 0) {
        mobileSummary += '<span class="zone-info-mobile-active"><strong>' + activeScoutingCount + '</strong> Scouting'
          + (activeScoutingCount === 1 ? '' : 's') + ' active</span>';
      }
      if (scoutingRewardCount > 0) {
        const rewardLabel = scoutingRewardCount === 1 ? 'scouting reward' : 'scouting rewards';
        const rewardCountLabel = scoutingRewardCount > 99 ? '99+' : String(scoutingRewardCount);
        mobileSummary += '<button type="button" class="zone-info-mobile-reward" onclick="ouvrirPopupButinsScoutingZone(\'' + zoneId + '\')" aria-label="View ' + rewardCountLabel + ' ' + rewardLabel + '">🎁 <strong>' + rewardCountLabel + '</strong> ' + rewardLabel + '</button>';
      }
    }
  }
  html += '<div class="zone-info-mobile-summary">' + mobileSummary + '</div>';
  html += '<button type="button" class="zone-info-open-btn" onclick="ouvrirZoneExplorationMobile()">Open zone</button>';

  html += '<div class="zone-info-ligne"><span>Exploration Status ' + (exploree ? CHECK_ICON : '<img class="icon-close-inline" src="img/interface/Red Cross_Final.png?v=0.0029" alt="not explored">') + '</span></div>';

  html += '<div class="zone-info-bloc"><span class="zone-info-label">Campaign completion</span>';
  if (!exploree) {
    html += '<div class="zone-info-item">?</div>';
  } else {
    const camps     = Object.values(CONFIG.campaigns).filter(function(c) { return c.zone === zoneId; });
    const completed = camps.filter(function(c) { return etat.campaignsCompletees.includes(c.id); });
    const pending   = camps.filter(function(c) { return !etat.campaignsCompletees.includes(c.id); });
    if (completed.length > 0) {
      html += completed.map(function(c) { return '<div class="zone-info-item">' + CHECK_ICON + ' ' + c.nom + '</div>'; }).join('');
    } else if (pending.length > 0) {
      html += pending.map(function(c) { return '<div class="zone-info-item">⏳ ' + c.nom + '</div>'; }).join('');
    } else {
      html += '<div class="zone-info-item">—</div>';
    }
  }
  html += '</div>';

  html += '<div class="zone-info-bloc"><span class="zone-info-label">Scoutings</span>';
  const scouts   = Object.values(CONFIG.scoutings).filter(function(s) { return s.zone === zoneId; });
  const unlocked = scouts.filter(function(s) { return scoutingDebloquee(s); });
  if (unlocked.length === 0) {
    html += '<div class="zone-info-item">—</div>';
  } else {
    html += unlocked.map(function(s) {
      const active = !!etat.scoutingsEnCours[s.id];
      return '<div class="zone-info-item">' + (active ? '🟢' : '⚪') + ' ' + s.nom + (active ? ' — active' : ' — idle') + '</div>';
    }).join('');
  }
  html += '</div>';

  el.innerHTML = html;
}

function actualiserTimersExplorations() {
  // Campaign timers
  etat.exploEnCours.forEach(function(explo) {
    const elapsed   = (Date.now() - explo.startTs) / 1000;
    const remaining = Math.max(0, explo.duree - elapsed);
    const progress  = Math.min(1, elapsed / explo.duree);
    const timerEl   = domParId("explo-timer-" + explo.id);
    const barEl     = domParId("explo-barre-" + explo.id);
    ecrireTexte(timerEl, formaterTempsStat(Math.ceil(remaining)) + " remaining");
    ecrireStyle(barEl, "width", Math.round(progress * 100) + "%");
  });

  // Zone exploration timer (direct DOM update)
  if (etat.exploZoneEnCours) {
    const ez        = etat.exploZoneEnCours;
    const elapsed   = (Date.now() - ez.startTs) / 1000;
    const remaining = Math.max(0, ez.duree - elapsed);
    const progress  = Math.min(1, elapsed / ez.duree);
    const barEl     = domParId("barre-explo-zone");
    const timerEl   = domParId("timer-explo-zone");
    ecrireStyle(barEl, "width", Math.round(progress * 100) + "%");
    ecrireTexte(timerEl, formaterTempsStat(Math.ceil(remaining)) + " remaining");
  }

  // Scouting timers (direct DOM update)
  Object.keys(etat.scoutingsEnCours).forEach(function(scoutingId) {
    const def = CONFIG.scoutings[scoutingId];
    const sc  = etat.scoutingsEnCours[scoutingId];
    if (!def || !sc) return;
    const effectiveDuree = (sc.duree !== undefined) ? sc.duree : def.duree;
    const elapsed   = (Date.now() - sc.startTs) / 1000;
    const remaining = Math.max(0, effectiveDuree - elapsed);
    const progress  = Math.min(1, elapsed / effectiveDuree);
    const barEl     = domParId("scout-barre-" + scoutingId);
    const timerEl   = domParId("scout-timer-" + scoutingId);
    ecrireStyle(barEl, "width", Math.round(progress * 100) + "%");
    ecrireTexte(timerEl, formaterTempsStat(Math.ceil(remaining)) + " remaining ↺ auto-repeats");
  });
}

function renduExplorations(u) {
  if (!u || !u.exploration || !explorationCampFonctionnelle()) return;

  renduCarte(u);

  if (exploTabDirty) {
    renderCampaignCards();
    exploTabDirty = false;
  }
  synchroniserNavigationExplorationMobile();
  actualiserTimersExplorations();
}

function renduExplorationsDynamique(u) {
  if (!u || !u.exploration || !explorationCampFonctionnelle()) return;
  actualiserTimersExplorations();
}

function ouvrirModalExplo(campId, slotIndex) {
  exploModalOuvert = { campId: campId, slotIndex: slotIndex };
  renduModalExplo();
  ouvrirDialogueModal("explo-modal", {
    dismissible: true,
    fermer: fermerModalExplo,
    focusSelector: ".explo-modal-kitty[data-clavier-clic]",
    returnFocusSelector: '[data-explo-trigger="campaign:' + campId + ':' + slotIndex + '"]'
  });
}

function ouvrirModalExploZone(zoneId, slotIndex) {
  exploModalOuvert = { zoneId: zoneId, slotIndex: slotIndex };
  renduModalExplo();
  ouvrirDialogueModal("explo-modal", {
    dismissible: true,
    fermer: fermerModalExplo,
    focusSelector: ".explo-modal-kitty[data-clavier-clic]",
    returnFocusSelector: '[data-explo-trigger="zone:' + zoneId + ':' + slotIndex + '"]'
  });
}

function ouvrirModalScouting(scoutingId) {
  exploModalOuvert = { scoutingId: scoutingId };
  renduModalExplo();
  ouvrirDialogueModal("explo-modal", {
    dismissible: true,
    fermer: fermerModalExplo,
    focusSelector: ".explo-modal-kitty[data-clavier-clic]",
    returnFocusSelector: '[data-explo-trigger="scouting:' + scoutingId + '"]'
  });
}

function fermerModalExplo() {
  exploModalOuvert = null;
  fermerDialogueModal("explo-modal");
}

function renduModalExplo() {
  const conteneurEl = document.getElementById("explo-modal-kitties");
  if (!conteneurEl || !exploModalOuvert) return;
  const { slotIndex } = exploModalOuvert;
  let html = "";

  const requiredExploratorSlot = !!(exploModalOuvert.zoneId && slotIndex === 0);
  var kittyList = etat.kittiesData
    .map(function(k, i) { return { k: k, i: i }; })
    .filter(function(entry) {
      if (estIngenieur(entry.k) || estBernardoSuperviseur(entry.k)) return false;
      return !requiredExploratorSlot || estExplorateurDeZone(entry.i);
    });
  kittyList.sort(function(a, b) {
    var aExp = a.k.metier === "explorator" ? 0 : 1;
    var bExp = b.k.metier === "explorator" ? 0 : 1;
    if (aExp !== bExp) return aExp - bExp;
    return b.k.niveau - a.k.niveau;
  });
  kittyList.forEach(function(entry) {
    var k = entry.k, i = entry.i;
    const onExplo      = kittyIsOnExpedition(i);
    const inOtherSlot  = exploModalOuvert.campId ? kittyDejaSelectionnee(i, exploModalOuvert.campId, exploModalOuvert.slotIndex) : false;
    const inWorker     = kittyIsInWorkerSlot(i);
    const isManager    = kittyEstManager(i);
    const inTraining   = kittyIsInTraining(i);
    const isLearning   = kittyIsLearningBook(i);
    const inDemolition = kittyIsDemolishingCamp(i);
    const onZoneExplo  = kittyIsOnZoneExplo(i);
    const onScouting   = kittyIsOnScouting(i) || (kittyIsInScoutingStaging(i) && scoutingsStagingKitty[exploModalOuvert.scoutingId] !== i);
    const inZoneSlot   = exploModalOuvert.zoneId
      ? (carteExploSlots[exploModalOuvert.zoneId] || []).some(function(ki, si) { return ki === i && si !== exploModalOuvert.slotIndex; })
      : false;
    const requiresExplorator = !!(exploModalOuvert.zoneId && exploModalOuvert.slotIndex === 0);
    const validExplorator = !requiresExplorator || estExplorateurDeZone(i);
    const disabled     = onExplo || inOtherSlot || inWorker || isManager || inTraining || isLearning || inDemolition || onZoneExplo || inZoneSlot || onScouting || !validExplorator;
    const forcable     = validExplorator && !onExplo && !inOtherSlot && !inTraining && !isLearning && !inDemolition && !onZoneExplo && !inZoneSlot && !onScouting && (inWorker || isManager);
    let statusLabel    = !validExplorator ? "Explorator required" : (onExplo || onZoneExplo || onScouting || inTraining || isLearning || inDemolition || isManager || inWorker) ? kittyAllocationLabel(i).text : (inOtherSlot || inZoneSlot) ? "in another slot" : "";

    html += '<div class="explo-modal-kitty' + (disabled ? ' explo-modal-kitty-disabled' : '') + '"' +
            (disabled ? ' aria-disabled="true"' : attributsActivationClavier("Select " + k.nom + " for this exploration") + ' onclick="selectionnerKittySlot(' + i + ')"') + '>';
    html += '<span class="explo-modal-kitty-emoji">' + kittyIconHtml(k) + '</span>';
    html += '<div class="explo-modal-kitty-info">';
    html += '<span class="explo-modal-kitty-nom">' + k.nom + '</span>';
    html += '<span class="explo-modal-kitty-power">&#x26A1; Exploration Power ' + kittyEP(i) + '</span>';
    var halvesTime = scoutingHalveTime(i);
    if (halvesTime) html += '<span class="explo-modal-kitty-effect">&#x23F1; Halves mission time</span>';
    if (statusLabel) html += '<span class="explo-modal-kitty-status">' + statusLabel + '</span>';
    html += '</div>';
    if (forcable) html += '<button class="btn-forcer" aria-label="Force assign ' + echapperAttributHtml(k.nom) + '" onclick="forcerKittySlot(' + i + ');event.stopPropagation()">Force</button>';
    html += '</div>';
  });

  conteneurEl.innerHTML = html || '<p class="explo-vide">No cats available.</p>';
}

function selectionnerKittySlot(kittyIndex) {
  if (!exploModalOuvert) return;
  if (estIngenieur(etat.kittiesData[kittyIndex]) || estBernardoSuperviseur(kittyIndex)) return;
  if (kittyIsBusy(kittyIndex)) return;

  if (exploModalOuvert.scoutingId) {
    const scoutingId = exploModalOuvert.scoutingId;
    const alreadyStaged = scoutingsStagingKitty[scoutingId] !== undefined;
    if (!alreadyStaged && chatonsLibres() <= 0) {
      fermerModalExplo();
      afficherNotification("⚠️ Not enough free cats!");
      return;
    }
    scoutingsStagingKitty[scoutingId] = kittyIndex;
    exclusifyStagedKitty(kittyIndex, 'scouting', scoutingId);
    jouerSonAffectation();
    fermerModalExplo();
    exploTabDirty = true;
    renderCampaignCards();
    return;
  }

  if (exploModalOuvert.zoneId) {
    const { zoneId, slotIndex } = exploModalOuvert;
    const z = ZONES_CARTE[zoneId];
    if (!z) { fermerModalExplo(); return; }
    if (slotIndex === 0 && !estExplorateurDeZone(kittyIndex)) {
      afficherNotification("An Explorator is required in the first slot.");
      return;
    }
    if (!carteExploSlots[zoneId]) carteExploSlots[zoneId] = new Array(z.slots).fill(null);
    carteExploSlots[zoneId][slotIndex] = kittyIndex;
    exclusifyStagedKitty(kittyIndex, 'zone', zoneId);
    jouerSonAffectation();
    fermerModalExplo();
    exploTabDirty = true;
    renderCampaignCards();
    return;
  }

  const { campId, slotIndex } = exploModalOuvert;
  const camp = CONFIG.campaigns[campId];
  if (!camp) return;

  if (!exploKittiesSelectionnees[campId]) {
    exploKittiesSelectionnees[campId] = new Array(camp.slots).fill(null);
  }

  // If replacing an empty slot, check the capacity cap
  const wasEmpty = exploKittiesSelectionnees[campId][slotIndex] === null;
  if (wasEmpty && totalKittiesSelectionnees() >= chatonsLibres()) {
    fermerModalExplo();
    afficherNotification("⚠️ Not enough free cats!");
    return;
  }

  exploKittiesSelectionnees[campId][slotIndex] = kittyIndex;
  exclusifyStagedKitty(kittyIndex, 'campaign', campId);
  jouerSonAffectation();
  fermerModalExplo();
  exploTabDirty = true;
  renduExplorations(unlocks());
}

// Pulls a busy kitty (worker or manager) out of its current role, then assigns it to the
// exploration slot/campaign/scouting currently open in the modal.
function forcerKittySlot(kittyIndex) {
  if (estIngenieur(etat.kittiesData[kittyIndex]) || estBernardoSuperviseur(kittyIndex)
      || kittyHasNonReplaceableAction(kittyIndex)) return;
  retirerKittyDeSesRoles(kittyIndex);
  selectionnerKittySlot(kittyIndex);
}

function retirerKittySlot(campId, slotIndex) {
  if (!exploKittiesSelectionnees[campId]) return;
  exploKittiesSelectionnees[campId][slotIndex] = null;
  exploTabDirty = true;
  renduExplorations(unlocks());
}

// ── Zone exploration ─────────────────────────────────────────

function actualiserSelectionCarte() {
  document.querySelectorAll('#carte-grille .carte-cellule[data-zone-part-id]').forEach(function(cellule) {
    const selectionnee = cellule.dataset.zonePartId === carteZoneSelectionnee;
    cellule.classList.toggle("carte-selectionnee", selectionnee);
    if (cellule.dataset.zoneId) cellule.setAttribute("aria-pressed", selectionnee ? "true" : "false");
  });
}

function clicZoneCarte(zoneId) {
  const z = ZONES_CARTE[zoneId];
  if (!z) return;
  if (z.type !== "home" && !explorateurPresent()) {
    afficherNotification("🧭 Train an Explorator in the Job Center to unlock this zone.");
    return;
  }
  const conserverFocus = document.activeElement && document.activeElement.dataset.zoneId === zoneId;
  const mobile = estExplorationMobile();
  carteZoneSelectionnee = (!mobile && carteZoneSelectionnee === zoneId) ? null : zoneId;
  if (mobile) explorationMobileVue = "map";
  if (carteZoneSelectionnee && !carteExploSlots[zoneId]) {
    carteExploSlots[zoneId] = new Array(z.slots).fill(null);
  }
  exploTabDirty = true;
  // Selecting a zone only changes its outline and adjacent information. Keep
  // the existing map and global fog SVG alive so its animations never restart
  // or jump after returning from another tab.
  actualiserSelectionCarte();
  renduZoneInfo();
  renderCampaignCards();
  synchroniserNavigationExplorationMobile();
  if (conserverFocus) {
    requestAnimationFrame(function() {
      const cellule = document.querySelector('.carte-cellule[data-zone-id="' + zoneId + '"]');
      if (cellule) cellule.focus();
    });
  }
}

function retirerKittyExploZone(zoneId, slotIdx) {
  if (carteExploSlots[zoneId]) carteExploSlots[zoneId][slotIdx] = null;
  exploTabDirty = true;
  renderCampaignCards();
}

function lancerExploZone() {
  if (!autoriserActionTableOperationsCamp()) return;
  const zoneId = carteZoneSelectionnee;
  if (!zoneId || etat.exploZoneEnCours || etat.resultatsExplorationZones[zoneId]) return;
  const z = ZONES_CARTE[zoneId];
  if (!z || etat.zonesExplorees.includes(zoneId)) return;
  const slots = carteExploSlots[zoneId] || [];
  if (!slots.every(function(k) { return k !== null; })) return;
  if (new Set(slots).size !== slots.length || slots.some(function(ki) {
    return !Number.isInteger(ki) || !etat.kittiesData[ki] || kittyIsBusy(ki);
  })) return;
  if (!estExplorateurDeZone(slots[0])) {
    afficherNotification("An Explorator is required in the first slot.");
    return;
  }
  var hasHalvesTime = slots.some(function(ki) { return ki !== null && scoutingHalveTime(ki); });
  var launchPower = slots.reduce(function(s, ki) { return s + kittyEP(ki); }, 0);
  etat.exploZoneEnCours = { zoneId: zoneId, kittyIndices: slots.slice(), power: launchPower, startTs: Date.now(), duree: hasHalvesTime ? z.duree / 2 : z.duree };
  if (estExplorationMobile()) {
    explorationMobileVue = "map";
    explorationMobileTypeMission = "campaigns";
  }
  carteDirty = true;
  exploTabDirty = true;
  sauvegarder(); rendu();
}

function terminerExploZone() {
  if (!etat.exploZoneEnCours) return;
  const mission = etat.exploZoneEnCours;
  const zoneId = mission.zoneId;
  const z = ZONES_CARTE[zoneId];
  const power = Number.isFinite(mission.power) ? mission.power : mission.kittyIndices.reduce(function(s, i) {
    return s + kittyEP(i);
  }, 0);
  const success = Boolean(z) && Math.random() < Math.min(1, power / z.difficulte);
  const names = mission.kittyIndices.map(function(i) {
    return etat.kittiesData[i] ? etat.kittiesData[i].nom : "?";
  }).join(", ");

  etat.exploZoneEnCours = null;
  carteDirty = true;
  exploTabDirty = true;
  if (carteExploSlots[zoneId]) carteExploSlots[zoneId] = carteExploSlots[zoneId].map(function() { return null; });

  if (!etat.resultatsExplorationZones) etat.resultatsExplorationZones = {};
  etat.resultatsExplorationZones[zoneId] = { success: success, kittyIndices: mission.kittyIndices.slice() };
  afficherNotification(success ? "🔍 The explored zone is ready to be revealed!" : "❌ The zone exploration failed. Check the map to try again.");
  ajouterLog("event", success
    ? "Zone exploration completed. The zone is ready to reveal."
    : "Zone exploration failed. " + names + " returned safely.");
}

function kittyDisponiblePourNouvelleMission(kittyIndex) {
  return !!etat.kittiesData[kittyIndex]
    && !estBernardoSuperviseur(kittyIndex)
    && !kittyIsBusy(kittyIndex)
    && !kittyEstManager(kittyIndex);
}

function revelerZoneExploree(zoneId) {
  if (!autoriserActionTableOperationsCamp()) return;
  const resultat = etat.resultatsExplorationZones[zoneId];
  const zone = ZONES_CARTE[zoneId];
  if (!resultat || !resultat.success || !zone) return;
  if (typeof jouerSonRevelationExploration === "function") jouerSonRevelationExploration();
  delete etat.resultatsExplorationZones[zoneId];
  if (!etat.zonesExplorees.includes(zoneId)) etat.zonesExplorees.push(zoneId);
  afficherNotification("✅ The explored zone is now revealed!");
  ajouterLog("unlock", "Zone explored: " + zone.nom + ".");
  carteDirty = true;
  exploTabDirty = true;
  verifierObjectifs(); sauvegarder(); rendu();
}

function reessayerExploZone(zoneId) {
  const resultat = etat.resultatsExplorationZones[zoneId];
  const zone = ZONES_CARTE[zoneId];
  if (!resultat || resultat.success || !zone) return;
  delete etat.resultatsExplorationZones[zoneId];
  carteExploSlots[zoneId] = new Array(zone.slots).fill(null);
  resultat.kittyIndices.slice(0, zone.slots).forEach(function(kittyIndex, slotIndex) {
    if (kittyDisponiblePourNouvelleMission(kittyIndex)) {
      carteExploSlots[zoneId][slotIndex] = kittyIndex;
      exclusifyStagedKitty(kittyIndex, "zone", zoneId);
    }
  });
  carteDirty = true;
  exploTabDirty = true;
  sauvegarder(); rendu();
}

function lancerExplo(id) {
  if (!autoriserActionTableOperationsCamp()) return;
  const slots = exploKittiesSelectionnees[id];
  const camp  = CONFIG.campaigns[id];
  if (!camp || !slots || etat.resultatsCampaigns[id] || etat.exploEnCours.some(function(mission) { return mission.id === id; })) return;
  if (camp.unlockAfterStory && !storyEstVue(camp.unlockAfterStory)) return;
  if (camp.unlockAfterCampaign && !etat.campaignsCompletees.includes(camp.unlockAfterCampaign)) return;
  if (camp.requiredItem && !etat.itemsAcquis.includes(camp.requiredItem)) return;
  const kittyIndices = slots.filter(function(x) { return x !== null; });
  if (kittyIndices.length < camp.slots) return;
  if (new Set(kittyIndices).size !== kittyIndices.length || kittyIndices.some(function(ki) {
    return !Number.isInteger(ki) || !etat.kittiesData[ki] || kittyIsBusy(ki);
  })) return;
  if (kittyIndices.length > chatonsLibres()) {
    afficherNotification("⚠️ Not enough free cats!");
    return;
  }
  var hasHalvesTime = kittyIndices.some(function(ki) { return scoutingHalveTime(ki); });
  var launchPower = kittyIndices.reduce(function(s, ki) { return s + kittyEP(ki); }, 0);
  etat.exploEnCours.push({ id: id, kittyIndices: kittyIndices, power: launchPower, startTs: Date.now(), duree: hasHalvesTime ? camp.duree / 2 : camp.duree });
  exploKittiesSelectionnees[id] = new Array(camp.slots).fill(null);
  exploTabDirty = true;
  sauvegarder(); rendu();
}

function terminerExplo(explo) {
  const camp = CONFIG.campaigns[explo.id];
  if (!camp) return;

  const power   = Number.isFinite(explo.power) ? explo.power : explo.kittyIndices.reduce(function(s, i) {
    return s + kittyEP(i);
  }, 0);
  const success = Math.random() < Math.min(1, power / camp.difficulte);
  const names   = explo.kittyIndices.map(function(i) {
    return etat.kittiesData[i] ? etat.kittiesData[i].nom : "?";
  }).join(", ");

  var recompenses = [];
  if (success && camp.recompenses) {
    recompenses = camp.recompenses.map(function(entry) { return { recompense: entry.recompense, qty: entry.qty }; });
  } else if (success && camp.recompenseTable) {
    var rewardEntry = resoudreRecompenseTable(camp.recompenseTable);
    recompenses = [{ recompense: rewardEntry.recompense, qty: rewardEntry.qty }];
  } else if (success) {
    recompenses = [{ recompense: camp.recompense, qty: camp.recompenseQty || 1 }];
  }
  if (!etat.resultatsCampaigns) etat.resultatsCampaigns = {};
  etat.resultatsCampaigns[explo.id] = { success: success, kittyIndices: explo.kittyIndices.slice(), recompenses: recompenses };
  ajouterLog("event", success
    ? "Campaign '" + camp.nom + "' succeeded. Its reward is waiting to be claimed."
    : "Campaign '" + camp.nom + "' failed. " + names + " returned empty-pawed.");
  afficherNotification(success ? "🎁 " + camp.nom + " reward ready!" : "❌ " + camp.nom + " failed. Open the zone to try again.");
  carteDirty = true;
  exploTabDirty = true;
}

function recupererRecompenseCampaign(campaignId) {
  const resultat = etat.resultatsCampaigns[campaignId];
  const camp = CONFIG.campaigns[campaignId];
  if (!resultat || !resultat.success || !camp) return;
  if (!autoriserActionTableOperationsCamp()) return false;
  if (!autoriserEntreeStockageRecompenses(resultat.recompenses)) return false;
  if (typeof jouerSonRewardChest === "function") jouerSonRewardChest();
  resultat.recompenses.forEach(function(entry) { appliquerRecompense(entry.recompense, entry.qty); });
  if (!etat.campaignsCompletees.includes(campaignId)) etat.campaignsCompletees.push(campaignId);
  delete etat.resultatsCampaigns[campaignId];
  ajouterLog("unlock", "Campaign completed: " + camp.nom + ". Reward claimed.");
  carteDirty = true;
  exploTabDirty = true;
  verifierObjectifs(); sauvegarder(); rendu();
  return true;
}

function reessayerCampaign(campaignId) {
  const resultat = etat.resultatsCampaigns[campaignId];
  const camp = CONFIG.campaigns[campaignId];
  if (!resultat || resultat.success || !camp) return;
  delete etat.resultatsCampaigns[campaignId];
  exploKittiesSelectionnees[campaignId] = new Array(camp.slots).fill(null);
  resultat.kittyIndices.slice(0, camp.slots).forEach(function(kittyIndex, slotIndex) {
    if (kittyDisponiblePourNouvelleMission(kittyIndex)) {
      exploKittiesSelectionnees[campaignId][slotIndex] = kittyIndex;
      exclusifyStagedKitty(kittyIndex, "campaign", campaignId);
    }
  });
  exploTabDirty = true;
  sauvegarder(); rendu();
}

function exploratorPowerMultiplier(kittyIndex) {
  var k = etat.kittiesData[kittyIndex];
  if (!k || k.metier !== 'explorator' || !etat.spherePerks) return 1;
  return etat.spherePerks['ex-power-2'] === 'learned' ? 1.5
    : etat.spherePerks['ex-power'] === 'learned' ? 1.25 : 1;
}

// Returns the effective Exploration Power with job-specific sphere perks.
function kittyEP(ki) {
  var k = etat.kittiesData[ki];
  if (!k) return 1;
  var base = k.niveau + 1;
  return Math.ceil(base * exploratorPowerMultiplier(ki));
}

function exploratorCatFoodMultiplier(kittyIndex) {
  var k = etat.kittiesData[kittyIndex];
  if (!k || k.metier !== 'explorator') return 1;
  if (!etat.spherePerks) return 1;
  return etat.spherePerks['ex-food-2'] === 'learned' ? 2
    : etat.spherePerks['ex-food'] === 'learned' ? 1.5 : 1;
}

function exploratorDoubleChance(kittyIndex) {
  var k = etat.kittiesData[kittyIndex];
  if (!k || k.metier !== 'explorator') return 0;
  if (!etat.spherePerks) return 0;
  return etat.spherePerks['ex-luck-2'] === 'learned' ? 0.40
    : etat.spherePerks['ex-luck'] === 'learned' ? 0.20 : 0;
}

function exploratorTripleChance(kittyIndex) {
  var k = etat.kittiesData[kittyIndex];
  if (!k || k.metier !== 'explorator' || !etat.spherePerks) return 0;
  return etat.spherePerks['ex-triple-2'] === 'learned' ? 0.30
    : etat.spherePerks['ex-triple'] === 'learned' ? 0.15 : 0;
}

function exploratorLuckyFoodChance(kittyIndex) {
  var k = etat.kittiesData[kittyIndex];
  if (!k || k.metier !== 'explorator' || !etat.spherePerks) return 0;
  return etat.spherePerks['ex-food-lucky-2'] === 'learned' ? 0.30
    : etat.spherePerks['ex-food-lucky'] === 'learned' ? 0.15 : 0;
}

function scoutingCatFoodMultiplier(kittyIndex) {
  var k = etat.kittiesData[kittyIndex];
  return k && k.metier === 'explorator' ? exploratorCatFoodMultiplier(kittyIndex) : 1;
}

function scoutingDoubleChance(kittyIndex) {
  var k = etat.kittiesData[kittyIndex];
  return k && k.metier === 'explorator' ? exploratorDoubleChance(kittyIndex) : 0;
}

function scoutingTripleChance(kittyIndex) {
  var k = etat.kittiesData[kittyIndex];
  return k && k.metier === 'explorator' ? exploratorTripleChance(kittyIndex) : 0;
}

function scoutingLuckyFoodChance(kittyIndex) {
  var k = etat.kittiesData[kittyIndex];
  return k && k.metier === 'explorator' ? exploratorLuckyFoodChance(kittyIndex) : 0;
}

function scoutingRewardMultiplier(kittyIndex) {
  if (Math.random() >= scoutingDoubleChance(kittyIndex)) return 1;
  return Math.random() < scoutingTripleChance(kittyIndex) ? 3 : 2;
}

// First rolls CHANCE DOUBLE, then conditionally upgrades the result to triple.
function tryDoubleReward(qty, kittyIndex) {
  return qty * scoutingRewardMultiplier(kittyIndex);
}

function resoudreRecompenseTable(table) {
  var total = table.reduce(function(s, e) { return s + e.weight; }, 0);
  var roll  = Math.random() * total;
  var cumul = 0;
  for (var i = 0; i < table.length; i++) {
    cumul += table[i].weight;
    if (roll < cumul) return table[i];
  }
  return table[table.length - 1];
}

// Returns a modified loot table where Canned Cat Food chance is increased by
// the assigned scouting Cat's learned perk.
function applyPerkCatFood(table, kittyIndex) {
  var multiplier = scoutingCatFoodMultiplier(kittyIndex);
  if (multiplier <= 1) return table;
  var cfEntry = table.find(function(e) { return e.recompense === 'cannedCatFood'; });
  if (!cfEntry) return table;
  var total    = table.reduce(function(s, e) { return s + e.weight; }, 0);
  var cfPct    = cfEntry.weight / total;
  var newCfPct = Math.min(0.99, cfPct * multiplier);
  var wOthers  = total - cfEntry.weight;
  var newCfW   = Math.round(newCfPct * wOthers / (1 - newCfPct));
  return table.map(function(e) {
    return e.recompense === 'cannedCatFood' ? Object.assign({}, e, { weight: newCfW }) : e;
  });
}

function appliquerRecompense(recompenseId, recompenseQty) {
  if (recompenseId === "compass") {
    if (!etat.itemsAcquis.includes("compass")) {
      etat.itemsAcquis.push("compass");
      inventaireDirty = true;
      afficherNotification("Compass obtained! A path beyond the neighbourhood may be opening.");
      ajouterLog("unlock", "Compass added to your Inventory.");
    }
  }
  if (recompenseId === "basicWoodPlanks") {
    const qty = recompenseQty || 1;
    etat.basicWoodPlanks += qty;
    afficherNotification(qty + " Basic Wood Planks found!");
    ajouterLog("event", qty + " Basic Wood Planks added to inventory.");
  }
  if (recompenseId === "rockBricks") {
    const qty = recompenseQty || 1;
    etat.rockBricks += qty;
    afficherNotification(qty + " Rock Bricks found!");
    ajouterLog("event", qty + " Rock Bricks added to inventory.");
  }
  if (recompenseId === "humanLeftovers") {
    const qty = recompenseQty || 1;
    etat.humanLeftovers += qty;
    afficherNotification(qty + " Human Leftovers found!");
    ajouterLog("event", qty + " Human Leftovers found in the neighbor's trash.");
  }
  if (recompenseId === "schoolGuide") {
    if (!etat.itemsAcquis.includes("schoolGuide")) {
      etat.itemsAcquis.push("schoolGuide");
      inventaireDirty = true;
    }
    afficherNotification("School Guide obtained! Check your Inventory.");
    ajouterLog("unlock", "School Guide added to your Inventory.");
    if (!storyEstVue("story6aVue")) {
      marquerStoryVue("story6aVue");
      afficherModal("ecran-story-6a");
      renduStories();
    }
  }
  if (recompenseId === "fishingGuide") {
    if (!etat.itemsAcquis.includes("fishingGuide")) {
      etat.itemsAcquis.push("fishingGuide");
      inventaireDirty = true;
    }
    afficherNotification("Fishing Guide obtained! Check your Inventory.");
    ajouterLog("unlock", "Fishing Guide for Dummies added to your Inventory.");
  }
  if (recompenseId === "constructionPlan") {
    if (!etat.itemsAcquis.includes("constructionPlan")) {
      etat.itemsAcquis.push("constructionPlan");
      inventaireDirty = true;
    }
    afficherNotification("Construction Plan obtained! Check your Inventory.");
    ajouterLog("unlock", "Construction Plan added to your Inventory.");
  }
  if (recompenseId === "stoneGuide") {
    if (!etat.itemsAcquis.includes("stoneGuide")) {
      etat.itemsAcquis.push("stoneGuide");
      inventaireDirty = true;
    }
    afficherNotification("Stone Craft Guide obtained! Check your Inventory.");
    ajouterLog("unlock", "Stone Craft Guide added to your Inventory.");
  }
  if (recompenseId === "seminarGuide") {
    if (!etat.itemsAcquis.includes("seminarGuide")) {
      etat.itemsAcquis.push("seminarGuide");
      inventaireDirty = true;
    }
    afficherNotification("Corporate Seminar Booklet obtained! Check your Inventory.");
    ajouterLog("unlock", "Corporate Seminar Booklet added to your Inventory.");
  }
  if (recompenseId === "dailyPurpose") {
    if (!etat.itemsAcquis.includes("dailyPurpose")) {
      etat.itemsAcquis.push("dailyPurpose");
      inventaireDirty = true;
    }
    afficherNotification("The Daily Purpose obtained! Check your Inventory.");
    ajouterLog("unlock", "The Daily Purpose added to your Inventory.");
  }
  if (recompenseId === "engineerGuide") {
    if (!etat.itemsAcquis.includes("engineerGuide")) {
      etat.itemsAcquis.push("engineerGuide");
      inventaireDirty = true;
    }
    afficherNotification("The Engineer's Path obtained! Check your Inventory.");
    ajouterLog("unlock", "The Engineer's Path added to your Inventory.");
  }
  if (recompenseId === "teamworkGuide") {
    if (!etat.itemsAcquis.includes("teamworkGuide")) {
      etat.itemsAcquis.push("teamworkGuide");
      inventaireDirty = true;
    }
    afficherNotification("The Teamwork Advantage obtained! Check your Inventory.");
    ajouterLog("unlock", "The Teamwork Advantage added to your Inventory.");
  }
  if (recompenseId === "sturdyHousePlans") {
    if (!etat.itemsAcquis.includes("sturdyHousePlans")) {
      etat.itemsAcquis.push("sturdyHousePlans");
      inventaireDirty = true;
    }
    afficherNotification("Sturdy House Plans obtained! Check your Inventory.");
    ajouterLog("unlock", "Sturdy House Plans added to your Inventory.");
  }
  if (recompenseId === "cannedCatFood") {
    etat.cannedCatFood += (recompenseQty || 1);
    afficherNotification("Canned Cat Food obtained!");
    ajouterLog("event", "Canned Cat Food added to inventory.");
  }
  if (recompenseId === "humanWorkersFood") {
    const qty = recompenseQty || 1;
    etat.humanWorkersFood += qty;
    afficherNotification(qty + " Human Workers Food found!");
    ajouterLog("event", qty + " Human Workers Food added to inventory.");
  }
}

// ════════════════════════════════════════════════════════════
// 9c. INVENTORY RENDER
// ════════════════════════════════════════════════════════════

let itemSelectionne      = null;
let inventaireDirty      = true;
let resCategorieFiltree  = "all";

// ── Resource info popup ───────────────────────────────────────
let _resPopupTarget = null;
let _workPopupContext = null;

function workResourcePair(resource, phase) {
  return RESOURCE_PAIRS.find(function(pair) {
    return phase === "gather" ? pair.rawRes === resource : pair.procRes === resource;
  }) || null;
}

function workMultiplierLabel(value) {
  return "×" + Number(value).toFixed(2);
}

function workResourceDetails(pair, slot, phase, familyId, slotIdx) {
  const gather = phase === "gather";
  const kitty = slot && slot.kittyIndex !== null ? etat.kittiesData[slot.kittyIndex] : null;
  const managerFamily = MAP_FAMILLE[gather ? pair.rawAction : pair.procMultAction];
  const manager = managerKittyForFamily(managerFamily);
  const gangLeader = etat.kittiesData.find(function(k) { return k.metier === "gang-leader"; });
  const speedBonuses = [];
  const productionBonuses = [];
  let speedMultiplier = 1;
  let productionMultiplier = 1;
  const gangSpeed = gangLeaderBonus();

  if (gangLeader && gangSpeed > 1) {
    speedBonuses.push({ label: gangLeader.nom + " Gang Leader", value: gangSpeed });
    speedMultiplier *= gangSpeed;
  }
  if (manager) {
    const managerSpeed = managerSpeedMultiplier(manager, managerFamily);
    speedBonuses.push({ label: manager.nom + " Manager", value: managerSpeed });
    speedMultiplier *= managerSpeed;
  }
  const devWorkSpeed = workBoostMult();
  if (devWorkSpeed > 1) {
    speedBonuses.push({ label: "Dev Work Boost", value: devWorkSpeed });
    speedMultiplier *= devWorkSpeed;
  }
  if (kitty && slot && familyId !== undefined && slotIdx !== undefined
      && manualFocusRecetteActif(familyId, slotIdx)) {
    speedBonuses.push({ label: "Manual Focus", value: manualFocusMultiplier() });
    speedMultiplier *= manualFocusMultiplier();
  }

  if (kitty && kitty.niveau > 0) {
    const workerProduction = gather ? Math.pow(GATHER_LEVEL_MULTIPLIER, kitty.niveau) : productionProcBonus(kitty);
    productionBonuses.push({ label: kitty.nom + " worker", value: workerProduction });
    productionMultiplier *= workerProduction;
  }
  if (gather && manager && managerProductionMultiplier(managerFamily) > 1) {
    const managerProduction = managerProductionMultiplier(managerFamily);
    productionBonuses.push({ label: manager.nom + " Manager (perk)", value: managerProduction });
    productionMultiplier *= managerProduction;
  }

  const rawTime = gather ? Number(pair.rawCfg.secondesParUnite) : Number(pair.procCfg[pair.procSecUnite]);
  const adjustedTime = rawTime / (speedMultiplier * (gather ? productionMultiplier : 1));
  const target = quantiteInputEffective(pair, pair.inputs[0]);
  const outputPerCycle = kitty ? productionProcBonus(kitty) : 1;
  return {
    pair: pair,
    kitty: kitty,
    gather: gather,
    rawTime: rawTime,
    adjustedTime: adjustedTime,
    target: target,
    speedBonuses: speedBonuses,
    productionBonuses: productionBonuses,
    outputPerCycle: outputPerCycle
  };
}

function workResourceDetailsHtml(details, spriteSrc) {
  const pair = details.pair;
  let html = '<div class="irp-header">';
  if (spriteSrc) html += '<img class="irp-icon" src="' + spriteSrc + '" alt="">';
  html += '<div class="irp-header-text"><div class="irp-nom">' + echapperAttributHtml(details.gather ? pair.rawLabel : pair.procLabel) + '</div><div class="irp-tier">' + (details.gather ? "Gathering" : "Processing") + '</div></div></div>';
  html += '<div class="irp-production-details">';
  html += '<div class="irp-detail-line"><span class="irp-detail-label">' + (details.gather ? "Raw time for one" : "Raw time for one cycle") + '</span><strong>' + formaterTemps(details.rawTime) + '</strong></div>';
  if (details.speedBonuses.length) {
    html += '<div class="irp-detail-section"><span class="irp-detail-section-title">Current speed bonus</span>';
    details.speedBonuses.forEach(function(bonus) {
      html += '<div class="irp-detail-line"><span>' + echapperAttributHtml(bonus.label) + '</span><strong>' + workMultiplierLabel(bonus.value) + '</strong></div>';
    });
    html += '</div>';
  }
  if (details.productionBonuses.length) {
    html += '<div class="irp-detail-section"><span class="irp-detail-section-title">Current production bonus</span>';
    details.productionBonuses.forEach(function(bonus) {
      html += '<div class="irp-detail-line"><span>' + echapperAttributHtml(bonus.label) + '</span><strong>' + workMultiplierLabel(bonus.value) + '</strong></div>';
    });
    html += '</div>';
  }
  if (details.gather) {
    html += '<div class="irp-detail-line irp-detail-result"><span class="irp-detail-label">Adjusted time for 1</span><strong>' + formaterTemps(details.adjustedTime) + '</strong></div>';
    html += '<div class="irp-detail-line irp-detail-result"><span class="irp-detail-label">Adjusted time for ' + libelleNombreDecimal(details.target, 1) + '</span><strong>' + formaterTemps(details.adjustedTime * details.target) + '</strong></div>';
  } else {
    html += '<div class="irp-detail-line irp-detail-result"><span class="irp-detail-label">Adjusted time for one cycle</span><strong>' + formaterTemps(details.adjustedTime) + '</strong></div>';
    if (details.kitty) {
      html += '<div class="irp-detail-line"><span class="irp-detail-label">Output per cycle</span><strong>' + libelleNombreDecimal(details.outputPerCycle, 2) + '</strong></div>';
    }
  }
  return html + '</div>';
}

function positionnerWorkResourcePopup(el, popup) {
  const rect = el.getBoundingClientRect();
  const pw = popup.offsetWidth || 300;
  const ph = popup.offsetHeight || 220;
  const mg = 8;
  let left = rect.left;
  let top = rect.bottom + mg;
  if (left + pw > window.innerWidth - mg) left = window.innerWidth - pw - mg;
  if (left < mg) left = mg;
  if (top + ph > window.innerHeight - mg) top = rect.top - ph - mg;
  if (top < mg) top = mg;
  popup.style.left = left + "px";
  popup.style.top = top + "px";
}

function showWorkResourcePopup(el) {
  const familyId = el.dataset.workFamily;
  const slotIdx = Number(el.dataset.workSlot);
  const phase = el.dataset.workPhase;
  const slot = slotRecette(familyId, slotIdx);
  const pair = slot && paireRecette(slot.recipeId);
  if (!pair || !phase) return;
  const details = workResourceDetails(pair, slot, phase, familyId, slotIdx);
  if (_resPopupTarget && _resPopupTarget !== el) _resPopupTarget.setAttribute("aria-expanded", "false");
  _resPopupTarget = el;
  _workPopupContext = { familyId: familyId, slotIdx: slotIdx, phase: phase };
  el.setAttribute("aria-expanded", "true");
  const popup = document.getElementById("inv-res-popup");
  popup.classList.add("work-production-popup");
  popup.setAttribute("aria-hidden", "false");
  const sprite = el.querySelector("img");
  popup.innerHTML = workResourceDetailsHtml(details, sprite && sprite.src);
  popup.style.display = "block";
  positionnerWorkResourcePopup(el, popup);
}

function toggleWorkResourcePopup(el, evt) {
  if (evt) evt.stopPropagation();
  if (_resPopupTarget === el) { hideResPopup(); return; }
  showWorkResourcePopup(el);
}

function showResPopup(el) {
  var id   = el.dataset.resId;
  var info = RESOURCE_INFO[id];
  if (!info) return;
  if (_resPopupTarget && _resPopupTarget !== el) _resPopupTarget.setAttribute("aria-expanded", "false");
  _resPopupTarget = el;
  _workPopupContext = null;
  el.setAttribute("aria-expanded", "true");
  var popup  = document.getElementById("inv-res-popup");
  popup.classList.remove("work-production-popup");
  popup.setAttribute("aria-hidden", "false");
  var sprite = el.querySelector("img");
  var html   = '<div class="irp-header">';
  if (sprite) html += '<img class="irp-icon" src="' + sprite.src + '" alt="">';
  html += '<div class="irp-header-text"><div class="irp-nom">' + info.nom + '</div>';
  if (info.tier) html += '<div class="irp-tier">' + info.tier + '</div>';
  html += '</div></div>';
  html += '<p class="irp-desc">' + info.desc + '</p>';
  html += '<div class="irp-ligne"><span class="irp-label">How to get</span>' + info.produce + '</div>';
  html += '<div class="irp-ligne"><span class="irp-label">Used for</span>' + info.usage + '</div>';
  popup.innerHTML = html;
  popup.style.display = "block";
  var rect = el.getBoundingClientRect();
  var pw   = popup.offsetWidth  || 260;
  var ph   = popup.offsetHeight || 160;
  var mg   = 8;
  var left = rect.left;
  var top  = rect.bottom + mg;
  if (left + pw > window.innerWidth  - mg) left = window.innerWidth  - pw - mg;
  if (left < mg) left = mg;
  if (top  + ph > window.innerHeight - mg) top  = rect.top - ph - mg;
  if (top  < mg) top  = mg;
  popup.style.left = left + "px";
  popup.style.top  = top  + "px";
}

function hideResPopup() {
  const popup = document.getElementById("inv-res-popup");
  popup.style.display = "none";
  popup.classList.remove("work-production-popup");
  popup.setAttribute("aria-hidden", "true");
  if (_resPopupTarget) _resPopupTarget.setAttribute("aria-expanded", "false");
  _resPopupTarget = null;
  _workPopupContext = null;
}

function toggleResPopup(el, evt) {
  evt.stopPropagation();
  if (_resPopupTarget === el) { hideResPopup(); return; }
  showResPopup(el);
}

function showUniqueItemPopup(el) {
  var item = ITEMS[el.dataset.uniqueItemId];
  if (!item) return;
  if (_resPopupTarget && _resPopupTarget !== el) _resPopupTarget.setAttribute("aria-expanded", "false");
  _resPopupTarget = el;
  _workPopupContext = null;
  el.setAttribute("aria-expanded", "true");
  var popup = document.getElementById("inv-res-popup");
  popup.classList.remove("work-production-popup");
  popup.setAttribute("aria-hidden", "false");
  popup.innerHTML = '<div class="irp-header"><span class="irp-icon irp-icon-html">' + item.emoji + '</span><div class="irp-header-text"><div class="irp-nom">' + item.nom + '</div><div class="irp-tier">Unique item</div></div></div>' +
    '<p class="irp-desc">' + item.description + '</p>' +
    (item.produce ? '<div class="irp-ligne"><span class="irp-label">How to get</span>' + item.produce + '</div>' : '') +
    (item.usage ? '<div class="irp-ligne"><span class="irp-label">Used for</span>' + item.usage + '</div>' : '');
  popup.style.display = "block";
  var rect = el.getBoundingClientRect();
  var pw = popup.offsetWidth || 260;
  var ph = popup.offsetHeight || 140;
  var mg = 8;
  var left = rect.left;
  var top = rect.bottom + mg;
  if (left + pw > window.innerWidth - mg) left = window.innerWidth - pw - mg;
  if (left < mg) left = mg;
  if (top + ph > window.innerHeight - mg) top = rect.top - ph - mg;
  if (top < mg) top = mg;
  popup.style.left = left + "px";
  popup.style.top = top + "px";
}

function toggleUniqueItemPopup(el, evt) {
  evt.stopPropagation();
  if (_resPopupTarget === el) { hideResPopup(); return; }
  showUniqueItemPopup(el);
}

function selectionnerItem(itemId) {
  const conserverFocus = document.activeElement && document.activeElement.dataset.itemId === itemId;
  itemSelectionne = (itemSelectionne === itemId) ? null : itemId;
  inventaireDirty = true;
  renduInventaire(unlocks());
  if (conserverFocus) {
    requestAnimationFrame(function() {
      const carte = document.getElementById("inv-item-card-" + itemId);
      if (carte) carte.focus();
    });
  }
}

function filtrerResources(cat) {
  const conserverFocus = document.activeElement && document.activeElement.classList.contains("inv-res-tab");
  resCategorieFiltree = cat;
  inventaireDirty = true;
  var resEl  = document.getElementById("inv-resources");
  if (resEl) resEl.dataset.visibleKey = "";  // force rebuild
  renduInventaire(unlocks());
  if (conserverFocus) {
    requestAnimationFrame(function() {
      const onglet = document.querySelector(".inv-res-tab-actif");
      if (onglet) onglet.focus();
    });
  }
}

function actionCoutLabel(cout) {
  return "";
}

function peutPayerAction(cout) {
  return true;
}

function bernardoIndex() {
  return etat.kittiesData.findIndex(function(k) { return k && k.nom === "Bernardo"; });
}

function bernardoEstEnExploration(kittyIdx) {
  if (kittyIsOnExpedition(kittyIdx) || kittyIsOnZoneExplo(kittyIdx)
      || kittyIsOnScouting(kittyIdx) || kittyIsInScoutingStaging(kittyIdx)) return true;
  const stagedCampaign = Object.values(exploKittiesSelectionnees || {}).some(function(slots) {
    return Array.isArray(slots) && slots.includes(kittyIdx);
  });
  const stagedZone = Object.values(carteExploSlots || {}).some(function(slots) {
    return Array.isArray(slots) && slots.includes(kittyIdx);
  });
  return stagedCampaign || stagedZone;
}

function demarrerEtudeLivre(itemId, kittyIdx) {
  const item = ITEMS[itemId];
  if (!item || !item.learningGame || etat.itemsAppris.includes(itemId) || etat.itemsEtudies.includes(itemId)) return;
  if (!etat.kittiesData[kittyIdx] || kittyIsBusy(kittyIdx) || kittyIsInExplorationStaging(kittyIdx)) return;
  const duree = item.studyDuration || 60000;
  etat.learningEnCours = { itemId: itemId, kittyIndex: kittyIdx, startTs: Date.now(), duree: duree };
  jouerSonAffectation();
  inventaireDirty = true;
  afficherNotification("📖 Studying " + item.nom + " with Bernardo... " + formaterTemps(duree / 1000) + " remaining.");
  sauvegarder(); rendu(); renduManagement();
}

function preparerEtudeLivre(itemId) {
  const item = ITEMS[itemId];
  if (!item || !item.learningGame) return;
  if (etat.itemsAppris.includes(itemId) || etat.itemsEtudies.includes(itemId)) return;
  if (etat.learningEnCours) {
    afficherNotification("A book is already being studied.");
    return;
  }
  const kittyIdx = bernardoIndex();
  if (kittyIdx < 0) {
    afficherNotification("Bernardo must be in the Gang before he can study.");
    return;
  }
  if (bernardoEstEnExploration(kittyIdx)) {
    afficherNotification("Bernardo is currently exploring and cannot study this book.");
    return;
  }
  if (kittyHasNonReplaceableAction(kittyIdx) || kittyIsInExplorationStaging(kittyIdx)) {
    afficherNotification("Bernardo is busy with another assignment and cannot study this book right now.");
    return;
  }
  const role = kittyAllocationLabel(kittyIdx);
  if (kittyIsInWorkerSlot(kittyIdx) || kittyEstManager(kittyIdx)) {
    ouvrirConfirmationTravail(
      "Reassign Bernardo to study?",
      "Bernardo is currently " + role.text.toLowerCase() + ". Reassign him to study this book?",
      function() {
        retirerKittyDeSesRoles(kittyIdx);
        demarrerEtudeLivre(itemId, kittyIdx);
      },
      "Reassign and study"
    );
    return;
  }
  demarrerEtudeLivre(itemId, kittyIdx);
}

function actionItem(itemId, actionId) {
  const item = ITEMS[itemId];
  if (!item) return;

  if (actionId === "study" && item.learningGame) {
    if (etat.itemsAppris.includes(itemId)) return;
    if (etat.itemsEtudies.includes(itemId)) return;
    preparerEtudeLivre(itemId);
    return;
  }

  if (actionId === "learn" && item.learningGame) {
    if (etat.itemsAppris.includes(itemId)) return;
    if (!etat.itemsEtudies.includes(itemId)) return;
    ouvrirMiniJeuLivre(itemId);
    return;
  }
}

function terminerApprentissage(itemId) {
  const item = ITEMS[itemId];
  if (item && item.learningGame && !etat.itemsAppris.includes(itemId)) {
    if (!etat.itemsEtudies.includes(itemId)) etat.itemsEtudies.push(itemId);
    etat.learningEnCours = null;
    inventaireDirty = true;
    afficherNotification("📖 " + item.nom + " studied! Complete its lesson to learn it.");
    ajouterLog("event", item.nom + " study complete — its lesson is ready in Inventory.");
    sauvegarder(); rendu(); renduManagement();
    return;
  }

  apprendreLivre(itemId);
}

function apprendreLivre(itemId) {
  if (etat.itemsAppris.includes(itemId)) return;
  if (!ITEMS[itemId]) return;
  etat.itemsAppris.push(itemId);
  if (itemId === "schoolGuide") {
    etat.jobCenterDebloque = true;
    assignerGangLeader();
    afficherNotification("🏫 Job Center unlocked! Build it in the Facilities tab.");
    ajouterLog("unlock", "Job Center unlocked — build it from the Facilities tab.");
    if (!storyEstVue("story6bVue")) {
      marquerStoryVue("story6bVue");
      afficherModal("ecran-story-6b");
      renduStories();
    }
  }
  if (itemId === "fishingGuide") {
    mettreDialogueRapideCampEnFile("catchenTierTwo");
    afficherNotification("🎣 Fishing unlocked! Anchovy available in Food, Grilled Anchovy in the Catchen.");
    ajouterLog("unlock", "Fishing Guide learned — Anchovy gathering and Grilled Anchovy recipe unlocked.");
  }
  if (itemId === "constructionPlan") {
    afficherNotification("🏗️ Construction Plan learned! Wood Builder job unlocked in the Job Center.");
    ajouterLog("unlock", "Construction Plan learned — the Wood Builder job is now available in the Job Center.");
  }
  if (itemId === "stoneGuide") {
    mettreDialogueRapideCampEnFile("pawsonryTierTwo");
    afficherNotification("⛏️ Stone Craft Guide learned! Miner and Stonemason jobs unlocked in the Job Center.");
    ajouterLog("unlock", "Stone Craft Guide learned — Miner and Stonemason jobs are now available in the Job Center.");
  }
  if (itemId === "seminarGuide") {
    etat.trainingCenterDebloque = true;
    afficherNotification("🏋️ Seminar Booklet mastered! Training Center unlocked — build it in Facilities.");
    ajouterLog("unlock", "Corporate Seminar Booklet studied — Training Center is now available in the Facilities tab.");
    if (!storyEstVue("storySeminarVue")) {
      marquerStoryVue("storySeminarVue");
      afficherModal("ecran-story-seminar");
      renduStories();
    }
  }
  if (itemId === "engineerGuide") {
    etat.laboratoryDebloque = true;
    afficherNotification("🔬 The Engineer's Path learned! Laboratory unlocked in Facilities.");
    ajouterLog("unlock", "The Engineer's Path learned — Laboratory is now available in the Facilities tab.");
  }
  if (itemId === "teamworkGuide") {
    etat.engineerRankUpgradesDebloques = true;
    afficherNotification("The Teamwork Advantage learned! Engineer rank upgrades are now unlocked.");
    ajouterLog("unlock", "The Teamwork Advantage learned. Engineer rank upgrades are now available.");
  }
  if (itemId === "sturdyHousePlans") {
    afficherNotification("Solid Stone Cathouse unlocked! Build it in Houses.");
    ajouterLog("unlock", "Sturdy House Plans learned. Solid Stone Cathouse is now available in Houses.");
  }
  if (itemId === "dailyPurpose") {
    // Any quest state created by the old Study-time unlock was premature.
    // Start the first legitimate set when the lesson is actually learned.
    etat.dailyQuests = null;
    initialiserQuetesQuotidiennes();
    afficherNotification("Daily quests unlocked! Open the guide to see today's goals.");
    ajouterLog("unlock", "The Daily Purpose learned. Daily quests are now available in the guide.");
  }
  etat.learningEnCours = null;
  inventaireDirty = true;
  verifierObjectifs();
  sauvegarder(); rendu();
}

let livreMiniJeuItemId = null;
let livreMiniJeuMots = [];
let livreMiniJeuTrous = [];
let livreMiniJeuMessage = "";

function melangerMotsLivre(mots) {
  const melanges = mots.map(function(mot, index) { return { id: index, mot: mot }; });
  for (let i = melanges.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    const temporaire = melanges[i];
    melanges[i] = melanges[j];
    melanges[j] = temporaire;
  }
  return melanges;
}

function ouvrirMiniJeuLivre(itemId) {
  const item = ITEMS[itemId];
  const jeu = item && item.learningGame;
  if (!jeu || etat.itemsAppris.includes(itemId) || !etat.itemsEtudies.includes(itemId)) return;
  if (!ouvrirSessionMiniJeu("book")) return;

  livreMiniJeuItemId = itemId;
  livreMiniJeuMots = melangerMotsLivre(jeu.answers);
  livreMiniJeuTrous = jeu.answers.map(function() { return null; });
  livreMiniJeuMessage = "";
  renduMiniJeuLivre();
  ouvrirDialogueModal("book-learning-modal", {
    dismissible: true,
    fermer: fermerMiniJeuLivre,
    focusSelector: ".book-learning-word",
    returnFocusSelector: '#inv-item-card-' + itemId
  });
}

function fermerMiniJeuLivre() {
  fermerDialogueModal("book-learning-modal");
  fermerSessionMiniJeu("book");
  livreMiniJeuItemId = null;
  livreMiniJeuMots = [];
  livreMiniJeuTrous = [];
  livreMiniJeuMessage = "";
}

function placerMotMiniJeuLivre(motId) {
  if (livreMiniJeuTrous.includes(motId)) return;
  const premierTrou = livreMiniJeuTrous.indexOf(null);
  if (premierTrou < 0) return;
  livreMiniJeuTrous[premierTrou] = motId;
  livreMiniJeuMessage = "";
  renduMiniJeuLivre();
}

function retirerMotMiniJeuLivre(trouIndex) {
  if (trouIndex < 0 || trouIndex >= livreMiniJeuTrous.length) return;
  livreMiniJeuTrous[trouIndex] = null;
  livreMiniJeuMessage = "";
  renduMiniJeuLivre();
}

function motMiniJeuLivre(motId) {
  const entree = livreMiniJeuMots.find(function(mot) { return mot.id === motId; });
  return entree ? entree.mot : "";
}

function renduMiniJeuLivre() {
  const item = ITEMS[livreMiniJeuItemId];
  const jeu = item && item.learningGame;
  const phraseEl = document.getElementById("book-learning-phrase");
  const motsEl = document.getElementById("book-learning-words");
  const feedbackEl = document.getElementById("book-learning-feedback");
  const checkEl = document.getElementById("book-learning-check");
  const titreEl = document.getElementById("book-learning-title");
  if (!jeu || !phraseEl || !motsEl || !feedbackEl || !checkEl) return;

  if (titreEl) titreEl.textContent = "Learn from the " + item.nom;
  let phraseHtml = "";
  jeu.phraseParts.forEach(function(partie, index) {
    phraseHtml += '<span>' + echapperAttributHtml(partie) + '</span>';
    if (index >= jeu.answers.length) return;
    const motId = livreMiniJeuTrous[index];
    const mot = motId === null ? "" : motMiniJeuLivre(motId);
    phraseHtml += '<button class="book-learning-blank' + (mot ? " book-learning-blank-filled" : "") + '"' +
      ' aria-label="Blank ' + (index + 1) + (mot ? ": " + echapperAttributHtml(mot) + ". Click to remove." : ": empty") + '"' +
      (mot ? ' onclick="retirerMotMiniJeuLivre(' + index + ')"' : ' disabled') + '>' +
      (mot ? echapperAttributHtml(mot) : "___") + '</button>';
  });
  phraseEl.innerHTML = phraseHtml;

  motsEl.innerHTML = livreMiniJeuMots.filter(function(entree) {
    return !livreMiniJeuTrous.includes(entree.id);
  }).map(function(entree) {
    return '<button class="book-learning-word" onclick="placerMotMiniJeuLivre(' + entree.id + ')">' + echapperAttributHtml(entree.mot) + '</button>';
  }).join("");

  feedbackEl.textContent = livreMiniJeuMessage;
  checkEl.disabled = livreMiniJeuTrous.some(function(motId) { return motId === null; });
}

function verifierMiniJeuLivre() {
  const itemId = livreMiniJeuItemId;
  const item = ITEMS[itemId];
  const jeu = item && item.learningGame;
  if (!jeu || livreMiniJeuTrous.some(function(motId) { return motId === null; })) return;

  const correcte = livreMiniJeuTrous.every(function(motId, index) {
    return motMiniJeuLivre(motId) === jeu.answers[index];
  });
  if (!correcte) {
    livreMiniJeuTrous = jeu.answers.map(function() { return null; });
    livreMiniJeuMessage = "Incorrect. Try again.";
    renduMiniJeuLivre();
    return;
  }

  fermerMiniJeuLivre();
  apprendreLivre(itemId);
}

function renduInventaire(u) {
  // Items list — only rebuild when dirty (avoids killing click events every 100ms)
  if (inventaireDirty) {
    renderItemsList();
    inventaireDirty = false;
  }

  renderInventoryTabs(u);
  actualiserVisibiliteInventaire();
  renderResourcesSection(u);
}

const RES_CATEGORIES = [
  { id: "wood",     label: "Woods"             },
  { id: "food",     label: "Food"              },
  { id: "stone",    label: "Stone"             },
  { id: "training", label: "Training Materials"},
  // metal: { id: "metal", label: "Metal" }
];

function buildRessourcesList(u) {
  return [
    { id: "inv-res-cardboard",       label: "Cardboard Pieces",  category: "wood",  sprite: "img/resources/Cardboard Pieces_Final.png",  val: function() { return 0; }, simple: true, visible: u.cathering    },
    { id: "inv-res-cardboard-plank", label: "Cardboard Planks",  category: "wood",  sprite: "img/resources/Cardboard Plank_Final.png",   val: function() { return etat.cardboardPlanks;  }, visible: u.scierie      },
    { id: "inv-res-basic-wood",      label: "Basic Wood",        category: "wood",  sprite: "img/resources/Basic Wood_Final.png",        val: function() { return 0; }, simple: true, visible: u.basicWood    },
    { id: "inv-res-wood-plank",      label: "Basic Wood Planks", category: "wood",  sprite: "img/resources/Basic Wood Plank_Final.png",  val: function() { return etat.basicWoodPlanks;  }, visible: u.basicSawmill },
    { id: "inv-res-catnip",          label: "Catnip",            category: "food",  sprite: "img/resources/Catnip_Final.png",            val: function() { return 0; }, simple: true, visible: u.grasscat     },
    { id: "inv-res-salads",          label: "Catnip Salad",       category: "food",  sprite: "img/resources/Catnip Salad_Final.png",      val: function() { return etat.salads;           }, visible: u.catchen      },
    { id: "inv-res-anchovy",         label: "Anchovy",           category: "food",  sprite: "img/resources/Anchovy_Final.png",           val: function() { return 0; }, simple: true, visible: u.anchovy      },
    { id: "inv-res-grilled-anchovy", label: "Grilled Anchovy",   category: "food",  sprite: "img/resources/Grilled Anchovy_Final.png",   val: function() { return etat.grilledAnchovy;   }, visible: u.grilledAnchovy },
    { id: "inv-res-human-leftovers",   label: "Human Leftovers",  category: "food",  sprite: "img/resources/Human Leftovers_Final.png",    val: function() { return etat.humanLeftovers;    }, visible: etat.humanLeftovers > 0    },
    { id: "inv-res-human-workers-food", label: "Workers Food",    category: "food",  sprite: "img/resources/Human Workers Food_Final.png", val: function() { return etat.humanWorkersFood;  }, visible: etat.humanWorkersFood > 0  },
    { id: "inv-res-canned-cat-food",   label: "Canned Cat Food", category: "training", sprite: "img/resources/Canned Cat Food_Final.png",   val: function() { return etat.cannedCatFood;     }, visible: etat.cannedCatFood > 0     },
    { id: "inv-res-pebbles",         label: "Pebbles",           category: "stone", sprite: "img/resources/Pebbles_Final.png",           val: function() { return 0; }, simple: true, visible: u.pebblecat    },
    { id: "inv-res-pebble-brick",    label: "Pebble Bricks",     category: "stone", sprite: "img/resources/Pebble Brick_Final.png",      val: function() { return etat.pebbleBricks;     }, visible: u.brickfact    },
    { id: "inv-res-rocks",           label: "Rocks",             category: "stone", sprite: "img/resources/Rock_Final.png",              val: function() { return 0; }, simple: true, visible: u.rockcat      },
    // Rock Bricks can arrive as an Exploration campaign reward before the
    // Rock Bricks recipe is unlocked, so a positive stock must reveal them.
    { id: "inv-res-rock-brick",      label: "Rock Bricks",       category: "stone", sprite: "img/resources/Rock Brick_Final.png",        val: function() { return etat.rockBricks;       }, visible: u.rockfact || etat.rockBricks > 0 },
    // metal: add here when metal resources are implemented
  ];
}

function renderInventoryTabs(u) {
  const tabsEl = document.getElementById("inv-res-tabs");
  if (!tabsEl) return;

  const allVisible = buildRessourcesList(u).filter(function(r) { return r.visible; });
  const itemIds = etat.itemsAcquis.filter(function(itemId) { return !!ITEMS[itemId]; });
  const hasBooks = itemIds.some(function(itemId) { return ITEMS[itemId].type !== "unique"; });
  const hasUnique = itemIds.some(function(itemId) { return ITEMS[itemId].type === "unique"; });
  const availableCats = RES_CATEGORIES.filter(function(cat) {
    return allVisible.some(function(r) { return r.category === cat.id; });
  });
  const availableTabs = [{ id: "all", label: "All" }];
  if (hasBooks) availableTabs.push({ id: "books", label: "Books" });
  if (hasUnique) availableTabs.push({ id: "unique", label: "Unique" });
  availableCats.forEach(function(cat) { availableTabs.push(cat); });

  const validFilter = availableTabs.some(function(tab) { return tab.id === resCategorieFiltree; });
  if (!validFilter) resCategorieFiltree = "all";

  const tabsKey = availableTabs.map(function(tab) { return tab.id; }).join(",") + "|" + resCategorieFiltree;
  if (tabsEl.dataset.tabsKey === tabsKey) return;
  tabsEl.dataset.tabsKey = tabsKey;

  if (availableTabs.length <= 1) {
    tabsEl.innerHTML = "";
    delete tabsEl.dataset.hasTabs;
    return;
  }

  let tabsHtml = '<div class="inv-res-tabs" role="group" aria-label="Inventory categories">';
  availableTabs.forEach(function(tab) {
    const actif = resCategorieFiltree === tab.id;
    tabsHtml += '<button class="inv-res-tab' + (actif ? " inv-res-tab-actif" : "") + '" aria-pressed="' + (actif ? "true" : "false") + '" onclick="filtrerResources(\'' + tab.id + '\')">' + retirerEmojisInterface(tab.label) + '</button>';
  });
  tabsHtml += '</div>';
  tabsEl.innerHTML = tabsHtml;
  tabsEl.dataset.hasTabs = "true";
}

function actualiserVisibiliteInventaire() {
  const afficheItems = resCategorieFiltree === "all" || resCategorieFiltree === "books" || resCategorieFiltree === "unique";
  const afficheResources = resCategorieFiltree !== "books" && resCategorieFiltree !== "unique";
  const itemsSection = document.getElementById("section-items");
  const resourcesSection = document.getElementById("section-inv-resources");
  if (itemsSection) {
    itemsSection.style.display = afficheItems ? "" : "none";
    itemsSection.setAttribute("aria-hidden", afficheItems ? "false" : "true");
  }
  if (resourcesSection) {
    resourcesSection.style.display = afficheResources ? "" : "none";
    resourcesSection.setAttribute("aria-hidden", afficheResources ? "false" : "true");
  }
}

function renderResourcesSection(u) {
  const resEl  = document.getElementById("inv-resources");
  if (!resEl) return;

  const storageSummary = document.getElementById("inventory-storage-summary");
  if (storageSummary) {
    const stockagesActifs = stockagesCampActifs();
    const capacite = capaciteStockageCamp();
    const depassements = CAMP_STORAGE_RESOURCE_IDS.filter(function(resourceId) {
      return etatStockageRessource(resourceId).depasse;
    }).map(function(resourceId) {
      return libelleRessourceCamp(resourceId);
    });
    storageSummary.textContent = "Storage: " + formaterNombre(capacite) + " per resource · "
      + stockagesActifs.length + " active shed" + (stockagesActifs.length === 1 ? "" : "s")
      + (depassements.length ? " · Over capacity: " + depassements.join(", ") : "");
    storageSummary.classList.toggle("inventory-storage-summary-over", depassements.length > 0);
  }

  const ressources = buildRessourcesList(u);
  const allVisible = ressources.filter(function(r) { return r.visible; });

  // Rebuild when visible set or active filter changes
  const visibleKey = allVisible.map(function(r) { return r.id; }).join(",") + "|" + resCategorieFiltree;
  if (resEl.dataset.visibleKey !== visibleKey) {
    resEl.dataset.visibleKey = visibleKey;

    if (allVisible.length === 0) {
      resEl.innerHTML = etatVideHtml("No resources yet", "Unlock Work and assign a cat to begin gathering materials.");
      return;
    }

    const availableCats = RES_CATEGORIES.filter(function(cat) {
      return allVisible.some(function(r) { return r.category === cat.id; });
    });
    // Resources grid — filtered or all
    const showAll = resCategorieFiltree === "all";
    const catsToShow = showAll ? availableCats : availableCats.filter(function(c) { return c.id === resCategorieFiltree; });
    let resHtml = "";
    catsToShow.forEach(function(cat) {
      const catRes = allVisible.filter(function(r) { return r.category === cat.id; });
      if (catRes.length === 0) return;
      if (showAll) resHtml += '<div class="inv-res-categorie">' + cat.label + '</div>';
      resHtml += '<div class="inv-res-grille">';
      catRes.forEach(function(r) {
        resHtml += '<div class="inv-res-cell" data-res-id="' + r.id + '" id="' + r.id + '"'
                 + attributsActivationClavier("Show details for " + r.label)
                 + ' aria-expanded="false" aria-controls="inv-res-popup"'
                 + ' onmouseenter="if(matchMedia(\'(hover:hover)\').matches)showResPopup(this)"'
                 + ' onmouseleave="if(matchMedia(\'(hover:hover)\').matches)hideResPopup()"'
                 + ' onclick="toggleResPopup(this,event)">';
        resHtml += '<img class="inv-res-sprite" src="' + r.sprite + '" alt="' + r.label + '">';
        resHtml += '<span class="inv-res-name">' + r.label + '</span>';
        if (!r.simple) resHtml += '<span class="inv-res-qty" id="' + r.id + '-qty"></span>';
        resHtml += '</div>';
      });
      resHtml += '</div>';
    });
    resEl.innerHTML = resHtml;
  }

  // Update quantities in-place every tick
  const displayed = allVisible.filter(function(r) {
    return resCategorieFiltree === "all" || r.category === resCategorieFiltree;
  });
  displayed.forEach(function(r) {
    if (r.simple) return;
    const qtyEl = domParId(r.id + "-qty");
    const resourceId = {
      "inv-res-cardboard-plank": "cardboardPlanks",
      "inv-res-wood-plank": "basicWoodPlanks",
      "inv-res-salads": "salads",
      "inv-res-grilled-anchovy": "grilledAnchovy",
      "inv-res-human-leftovers": "humanLeftovers",
      "inv-res-human-workers-food": "humanWorkersFood",
      "inv-res-canned-cat-food": "cannedCatFood",
      "inv-res-pebble-brick": "pebbleBricks",
      "inv-res-rock-brick": "rockBricks"
    }[r.id];
    const stockage = resourceId ? etatStockageRessource(resourceId) : null;
    ecrireTexte(qtyEl, stockage
      ? formaterNombre(Math.floor(r.val())) + " / " + formaterNombre(stockage.capacite)
      : formaterNombre(Math.floor(r.val())));
    if (qtyEl) qtyEl.classList.toggle("inv-res-qty-full", Boolean(stockage && stockage.plein));
  });
}

function renderItemsList() {
  const listeEl = document.getElementById("inv-liste-items");
  if (!listeEl) return;

  if (etat.itemsAcquis.length === 0) {
    listeEl.innerHTML = etatVideHtml("Your backpack is empty", "Explorations and discoveries will add useful guides here.");
    return;
  }

  function carteItemHtml(itemId) {
    const item   = ITEMS[itemId];
    if (!item) return "";
    const appris = etat.itemsAppris.includes(itemId);
    const etudie = etat.itemsEtudies.includes(itemId);
    const actif  = itemSelectionne === itemId;
    let html = '';

    html += '<div id="inv-item-card-' + itemId + '" class="inv-item-carte' + (actif ? " inv-item-actif" : "") +
            '" data-item-id="' + itemId + '"' + attributsActivationClavier((actif ? "Hide " : "Show ") + item.nom + " details") +
            ' aria-expanded="' + (actif ? "true" : "false") + '" aria-controls="inv-item-detail-' + itemId + '" onclick="selectionnerItem(\'' + itemId + '\')">';
    html += '<span class="inv-item-emoji">' + item.emoji + '</span>';
    html += '<div class="inv-item-entete">';
    html += '<span class="inv-item-nom">' + item.nom + '</span>';
    if (appris) html += '<span class="inv-item-tag">' + CHECK_ICON + ' Learned</span>';
    else if (etudie) html += '<span class="inv-item-tag inv-item-tag-studied">Studied</span>';
    html += '</div>';
    html += '</div>';

    if (actif) {
      html += '<div class="inv-item-detail" id="inv-item-detail-' + itemId + '">';
      html += '<p class="inv-item-desc">' + item.description + '</p>';
      if (appris) {
        var unlocksTxt = item.unlocksLabel ? ' — ' + item.unlocksLabel : '';
        html += '<div class="inv-item-appris">' + CHECK_ICON + ' Learned' + unlocksTxt + '</div>';
      } else if (etat.learningEnCours && etat.learningEnCours.itemId === itemId) {
        const elapsed = Date.now() - etat.learningEnCours.startTs;
        const pct = Math.min(100, Math.floor(elapsed / etat.learningEnCours.duree * 100));
        const remaining = Math.max(0, Math.ceil((etat.learningEnCours.duree - elapsed) / 1000));
        const actionLabel = item.learningGame ? "Studying" : "Learning";
        html += '<div class="inv-action-row">';
        html += '<div id="inv-learning-label" class="inv-learning-label">' + actionLabel + '... ' + remaining + 's</div>';
        html += '<div class="inv-learning-barre">'
          + '<div id="inv-learning-progres" class="inv-learning-progres" style="width:' + pct + '%"></div>'
          + '<img id="inv-learning-marker" class="inv-learning-marker" src="' + CAT_FACES.bernardo + '" alt="Bernardo">'
          + '</div>';
        html += '</div>';
      } else if (etudie && item.learningGame) {
        html += '<div class="inv-action-row">';
        html += '<button class="btn-inv-action" onclick="actionItem(\'' + itemId + '\',\'learn\');event.stopPropagation()">Learn</button>';
        html += '</div>';
      } else if (item.actions && item.actions.length > 0) {
        item.actions.forEach(function(action) {
          html += '<div class="inv-action-row">';
          html += '<button id="inv-item-action-' + itemId + '-' + action.id + '" class="btn-inv-action"' +
                  ' onclick="actionItem(\'' + itemId + '\',\'' + action.id + '\');event.stopPropagation()">';
          html += action.label;
          html += '</button>';
          html += '</div>';
        });
      }
      html += '</div>';
    }
    return html;
  }

  function carteUniqueItemHtml(itemId) {
    const item = ITEMS[itemId];
    if (!item) return "";
    return '<div id="inv-item-card-' + itemId + '" class="inv-unique-carte" data-unique-item-id="' + itemId + '"' +
      attributsActivationClavier("Show details for " + item.nom) +
      ' aria-expanded="false" aria-controls="inv-res-popup" onmouseenter="if(matchMedia(\'(hover:hover)\').matches)showUniqueItemPopup(this)" onmouseleave="if(matchMedia(\'(hover:hover)\').matches)hideResPopup()" onclick="toggleUniqueItemPopup(this,event)">' +
      '<span class="inv-unique-icone">' + item.emoji + '</span>' +
      '<span class="inv-unique-nom">' + item.nom + '</span>' +
      '</div>';
  }

  const itemIdsConnus = etat.itemsAcquis.filter(function(itemId) { return !!ITEMS[itemId]; });
  const uniqueIds = itemIdsConnus.filter(function(itemId) { return ITEMS[itemId].type === "unique"; });
  const bookIds = itemIdsConnus.filter(function(itemId) { return ITEMS[itemId].type !== "unique"; });
  const afficheBooks = resCategorieFiltree === "all" || resCategorieFiltree === "books";
  const afficheUnique = resCategorieFiltree === "all" || resCategorieFiltree === "unique";
  let html = "";
  if (afficheBooks) {
    html += '<div class="inv-items-section-titre">BOOKS</div>';
    html += bookIds.length > 0 ? bookIds.map(carteItemHtml).join("") : '<p class="inv-vide inv-items-section-vide">No books yet.</p>';
  }
  if (afficheUnique) {
    html += '<div class="inv-items-section-titre">UNIQUE ITEMS</div>';
    html += uniqueIds.length > 0
      ? '<div class="inv-unique-grille">' + uniqueIds.map(carteUniqueItemHtml).join("") + '</div>'
      : '<p class="inv-vide inv-items-section-vide">No unique items yet.</p>';
  }
  listeEl.innerHTML = html;
}

// ════════════════════════════════════════════════════════════
// 9c. JOB CENTER RENDER
// ════════════════════════════════════════════════════════════

let jcDirty = true;
let jcModalOuvert  = null;   // { mode: "formation"|"manager"|"spec", famille?: string }
let jcFormationKittySelectionne = null;
let jcMetierSelectionne = null;

let tcSpecKittySelectionne = null;
let _sphereGridJob        = null;  // job id of the currently rendered sphere grid
let _sphereSelectionnee   = null;  // id of the selected sphere node
let jcJobInfoAnchor        = null;

const JOB_CENTER_JOB_INFO = Object.freeze({
  lumberjack: {
    description: "Improve workers’ wood-gathering production.",
    impact: "Work · Wood gathering recipes",
    bonus: "50% increase in wood gathering production speed"
  },
  carpenter: {
    description: "Improve workers’ processing of wood into planks.",
    impact: "Work · Wood processing recipes",
    bonus: "50% increase in wood processing production speed"
  },
  farmer: {
    description: "Improve workers’ food-gathering production.",
    impact: "Work · Food gathering recipes",
    bonus: "50% increase in food gathering production speed"
  },
  chef: {
    description: "Improve workers’ processing of food into prepared meals.",
    impact: "Work · Food processing recipes",
    bonus: "50% increase in food processing production speed"
  },
  miner: {
    description: "Improve workers’ rock-gathering production.",
    impact: "Work · Rocks gathering recipes",
    bonus: "50% increase in rock gathering production speed"
  },
  stonemason: {
    description: "Improve workers’ processing of rocks into bricks.",
    impact: "Work · Rocks processing recipes",
    bonus: "50% increase in rock processing production speed"
  },
  builder: {
    description: "Build more efficient housing for the gang.",
    impact: "Camp · Housing costs and Cat capacity",
    bonus: "50% increase in capacity provided by Camp houses"
  },
  explorator: {
    description: "Leads expeditions to discover and unlock new areas.",
    impact: "Exploration · Map, Campaigns and Scoutings",
    bonus: "Halves all mission times in Exploration"
  },
  "camp-engineer": {
    description: "Improves the gang's passive AFK systems.",
    impact: "AFK · Offline progression cap",
    bonus: "Rank 1: +6 minutes to the AFK cap per cat level · Rank 2: +0.5% AFK ratio per cat level"
  }
});

function positionnerInfoMetierJC(anchor, popup) {
  const rect = anchor ? anchor.getBoundingClientRect() : null;
  const mg = 8;
  const pw = popup.offsetWidth || 300;
  const ph = popup.offsetHeight || 150;
  let left = rect ? rect.left : (window.innerWidth - pw) / 2;
  const mobile = window.matchMedia && window.matchMedia("(max-width: 768px)").matches;
  let top = rect
    ? (mobile ? rect.top - ph - mg : rect.bottom + mg)
    : (window.innerHeight - ph) / 2;
  if (left + pw > window.innerWidth - mg) left = window.innerWidth - pw - mg;
  if (left < mg) left = mg;
  if (top + ph > window.innerHeight - mg && rect) top = rect.top - ph - mg;
  if (top < mg && rect) {
    const belowTop = rect.bottom + mg;
    top = belowTop + ph <= window.innerHeight - mg ? belowTop : mg;
  }
  if (top < mg) top = mg;
  popup.style.left = Math.round(left) + "px";
  popup.style.top = Math.round(top) + "px";
}

function afficherInfoMetierJC(jobId, anchor) {
  const info = JOB_CENTER_JOB_INFO[jobId];
  const metier = METIERS[jobId];
  if (!info || !metier) return;
  let popup = document.getElementById("jc-job-info-popup");
  if (!popup) {
    popup = document.createElement("div");
    popup.id = "jc-job-info-popup";
    popup.className = "jc-job-info-popup";
    popup.setAttribute("role", "tooltip");
    popup.setAttribute("aria-hidden", "true");
    document.body.appendChild(popup);
  }
  if (jcJobInfoAnchor && jcJobInfoAnchor !== anchor) jcJobInfoAnchor.removeAttribute("aria-describedby");
  jcJobInfoAnchor = anchor || null;
  if (jcJobInfoAnchor) jcJobInfoAnchor.setAttribute("aria-describedby", "jc-job-info-popup");
  popup.innerHTML = '<div class="jc-job-info-title"><span aria-hidden="true">' + metier.emoji + '</span><strong>' + echapperAttributHtml(metier.nom) + '</strong></div>' +
    '<p class="jc-job-info-description">' + echapperAttributHtml(info.description) + '</p>' +
    '<div class="jc-job-info-line"><span>Impacts</span><strong>' + echapperAttributHtml(info.impact) + '</strong></div>' +
    '<div class="jc-job-info-line"><span>Base bonus</span><strong>' + echapperAttributHtml(info.bonus) + '</strong></div>';
  popup.style.display = "block";
  popup.setAttribute("aria-hidden", "false");
  positionnerInfoMetierJC(jcJobInfoAnchor, popup);
}

function masquerInfoMetierJC(force) {
  if (!force && window.matchMedia && window.matchMedia("(max-width: 768px)").matches) return;
  const popup = document.getElementById("jc-job-info-popup");
  if (!popup) return;
  popup.style.display = "none";
  popup.setAttribute("aria-hidden", "true");
  if (jcJobInfoAnchor) jcJobInfoAnchor.removeAttribute("aria-describedby");
  jcJobInfoAnchor = null;
}

document.addEventListener("click", function(event) {
  const popup = document.getElementById("jc-job-info-popup");
  if (!popup || popup.style.display === "none") return;
  const trigger = event.target && event.target.closest ? event.target.closest(".jc-metier-info-wrap") : null;
  if (!trigger && !popup.contains(event.target)) {
    const wasMobile = window.matchMedia && window.matchMedia("(max-width: 768px)").matches;
    popup.style.display = "none";
    popup.setAttribute("aria-hidden", "true");
    if (jcJobInfoAnchor) jcJobInfoAnchor.removeAttribute("aria-describedby");
    jcJobInfoAnchor = null;
    if (wasMobile) event.stopPropagation();
  }
});

document.addEventListener("keydown", function(event) {
  if (event.key !== "Escape") return;
  const popup = document.getElementById("jc-job-info-popup");
  if (!popup || popup.style.display === "none") return;
  popup.style.display = "none";
  popup.setAttribute("aria-hidden", "true");
  if (jcJobInfoAnchor) {
    jcJobInfoAnchor.removeAttribute("aria-describedby");
    jcJobInfoAnchor.focus();
  }
  jcJobInfoAnchor = null;
});

window.addEventListener("resize", function() {
  const popup = document.getElementById("jc-job-info-popup");
  if (popup && popup.style.display !== "none") positionnerInfoMetierJC(jcJobInfoAnchor, popup);
});
document.addEventListener("scroll", function() {
  const popup = document.getElementById("jc-job-info-popup");
  if (popup && popup.style.display !== "none") positionnerInfoMetierJC(jcJobInfoAnchor, popup);
}, true);

function kittysSansMetier() {
  return etat.kittiesData.reduce(function(acc, k, i) {
    if (k.metier === null) acc.push(i);
    return acc;
  }, []);
}

function metierDejaAttribue(metierId) {
  return etat.kittiesData.some(function(k) { return k.metier === metierId; });
}

function ouvrirModalJC(mode, famille) {
  jcModalOuvert = { mode: mode, famille: famille || null };
  renduModalJC();
  const retour = mode === "manager"
    ? "#manager-slot-" + famille + " button"
    : mode === "engineer"
      ? "#laboratory-interface button"
    : '[data-jc-modal-trigger="' + mode + '"]';
  ouvrirDialogueModal("jc-modal", {
    dismissible: true,
    fermer: fermerModalJC,
    focusSelector: ".jc-modal-kitty[data-clavier-clic]",
    returnFocusSelector: retour
  });
}

function fermerModalJC() {
  jcModalOuvert = null;
  fermerDialogueModal("jc-modal");
}

function renduModalJC() {
  if (!jcModalOuvert) return;
  const titreEl = document.getElementById("jc-modal-titre");
  const contenuEl = document.getElementById("jc-modal-contenu");
  if (!contenuEl) return;
  let html = "";

  if (jcModalOuvert.mode === "engineer") {
    if (titreEl) titreEl.textContent = "Choose a Stray Cat for engineering training";
    const available = laboratoireKittysDisponibles();
    if (available.length === 0) {
      html = '<p class="jc-modal-vide">No available Stray Cats.</p>';
    } else {
      available.forEach(function(entry) {
        const k = entry.kitty;
        html += '<div class="jc-modal-kitty"' + attributsActivationClavier("Select " + k.nom + " for engineering training") + ' onclick="selectionnerIngenieurLaboratoire(' + entry.index + ')">';
        html += '<span class="jc-modal-kitty-emoji">' + kittyIconHtml(k) + '</span>';
        html += '<div class="jc-modal-kitty-info"><span class="jc-modal-kitty-nom">' + echapperAttributHtml(k.nom) + '</span><span class="jc-modal-kitty-tier">Stray Cat · Level ' + (k.niveau || 0) + '</span></div>';
        html += '</div>';
      });
    }
  } else if (jcModalOuvert.mode === "formation") {
    if (titreEl) titreEl.innerHTML = KITTY_ICON + " Choose a Stray Cat";
    const stray = kittysSansMetier();
    if (stray.length === 0) {
      html = '<p class="jc-modal-vide">No Stray Cats available.</p>';
    } else {
      stray.forEach(function(idx) {
        const k        = etat.kittiesData[idx];
        const tier     = TIERS_KITTIES[k.tier] || "Kitty";
        const busy     = kittyIsBusy(idx);
        const enWorker = kittyIsInWorkerSlot(idx);
        const forcable = busy && enWorker && !kittyHasNonReplaceableAction(idx) && !kittyIsInExplorationStaging(idx);
        const busyLbl  = busy ? kittyAllocationLabel(idx).text : "";
        html += '<div class="jc-modal-kitty' + (busy ? ' jc-modal-kitty-disabled' : '') + '"' +
                (busy ? ' aria-disabled="true"' : attributsActivationClavier("Select " + k.nom + " for job training") + ' onclick="selectionnerKittyFormation(' + idx + ')"') + '>';
        html += '<div class="jc-modal-kitty-info">';
        html += '<span class="jc-modal-kitty-nom">' + k.nom + '</span>';
        html += '<span class="jc-modal-kitty-tier">' + tier + (busyLbl ? ' — ' + busyLbl : '') + '</span>';
        html += '</div>';
        if (forcable) html += '<button class="btn-forcer" aria-label="Force assign ' + echapperAttributHtml(k.nom) + '" onclick="forcerKittyFormation(' + idx + ');event.stopPropagation()">Force</button>';
        html += '</div>';
      });
    }
  } else if (jcModalOuvert.mode === "manager") {
    const famille = jcModalOuvert.famille;
    const metiersEligibles = METIER_PAR_FAMILLE[famille] || [];
    if (titreEl) titreEl.textContent = "👤 Assign a Manager";
    const dejaMgr = {};
    Object.keys(etat.managers).forEach(function(f) {
      if (etat.managers[f] !== null && etat.managers[f] !== undefined) dejaMgr[etat.managers[f]] = f;
    });
    {
      const eligibles = etat.kittiesData.reduce(function(acc, k, i) {
        if (metiersEligibles.includes(k.metier) && !estIngenieur(k) && !estBernardoSuperviseur(k)) acc.push(i);
        return acc;
      }, []);
      if (eligibles.length === 0) {
        html = '<p class="jc-modal-vide">No cat with the required job.</p>';
      } else {
        eligibles.forEach(function(idx) {
          const k = etat.kittiesData[idx];
          const m = METIERS[k.metier];
          const bonus = managerSpeedMultiplier(k, famille).toFixed(2);
          const autreFamille = dejaMgr[idx];
          const enWorker    = kittyIsInWorkerSlot(idx);
          const onExplo     = kittyIsOnExpedition(idx);
          const onZoneExplo = kittyIsOnZoneExplo(idx);
          const onScouting  = kittyIsOnScouting(idx) || kittyIsInScoutingStaging(idx);
          const inTraining  = kittyIsInTraining(idx);
          const isLearning = kittyIsLearningBook(idx);
          const inExplorationStaging = kittyIsInExplorationStaging(idx);
          const forcable = (enWorker || !!autreFamille) && !kittyHasNonReplaceableAction(idx) && !inExplorationStaging;
          const occupe   = enWorker || !!autreFamille || onExplo || onZoneExplo || onScouting || inTraining || isLearning || inExplorationStaging;
          const statutTxt = occupe ? " — " + kittyAllocationLabel(idx).text : "";
          html += '<div class="jc-modal-kitty' + (occupe ? ' jc-modal-kitty-disabled' : '') + '"' +
                  (occupe ? ' aria-disabled="true"' : attributsActivationClavier("Assign " + k.nom + " as manager") + ' onclick="assignerManager(\'' + famille + '\',' + idx + ')"') + '>';
          html += '<div class="jc-modal-kitty-info">';
          html += '<span class="jc-modal-kitty-nom">' + k.nom + '</span>';
          html += '<span class="jc-modal-kitty-tier">' + (m ? m.emoji + " " + m.nom : k.metier) + statutTxt + '</span>';
          html += '</div>';
          html += '<div class="jc-modal-kitty-bonus">';
          html += '<div class="jc-modal-kitty-bonus-ligne">×' + bonus + ' <span class="jc-modal-kitty-bonus-label">production speed</span></div>';
          html += '</div>';
          if (forcable) html += '<button class="btn-forcer" aria-label="Force assign ' + echapperAttributHtml(k.nom) + ' as manager" onclick="forcerManager(\'' + famille + '\',' + idx + ');event.stopPropagation()">Force</button>';
          html += '</div>';
        });
      }
    }
  } else if (jcModalOuvert.mode === "spec") {
    if (titreEl) titreEl.textContent = "🎓 Select a cat to specialize";
    const avecMetier = etat.kittiesData.reduce(function(acc, k, i) {
      if (k.metier !== null && !estIngenieur(k) && !estBernardoSuperviseur(k)) acc.push(i);
      return acc;
    }, []);
    if (avecMetier.length === 0) {
      html = '<p class="jc-modal-vide">No cats have a job yet.</p>';
    } else {
      avecMetier.forEach(function(idx) {
        const k = etat.kittiesData[idx];
        const m = METIERS[k.metier];
        const _mlvl = jobLevelInfo(k.metier);
        html += '<div class="jc-modal-kitty"' + attributsActivationClavier("Select " + k.nom + " to specialize") + ' onclick="selectionnerKittySpec(' + idx + ')">';
        html += '<span class="jc-modal-kitty-emoji">' + kittyIconHtml(k) + '</span>';
        html += '<div class="jc-modal-kitty-info">';
        html += '<span class="jc-modal-kitty-nom">' + k.nom + '</span>';
        html += '<span class="jc-modal-kitty-tier">' + (m ? m.emoji + ' ' + m.nom : k.metier) + '</span>';
        html += '</div>';
        html += '<div class="jc-modal-kitty-bonus">';
        html += '<div class="jc-modal-kitty-bonus-ligne">Lv. <span class="jc-modal-kitty-bonus-label">' + _mlvl.cur + ' / ' + _mlvl.max + '</span></div>';
        html += '</div>';
        html += '</div>';
      });
    }
  }

  contenuEl.innerHTML = html;
}

function selectionnerKittyFormation(kittyIndex) {
  if (!etat.kittiesData[kittyIndex] || estIngenieur(etat.kittiesData[kittyIndex])
      || estBernardoSuperviseur(kittyIndex) || kittyIsBusy(kittyIndex)
      || kittyIsInExplorationStaging(kittyIndex)) return;
  jcFormationKittySelectionne = kittyIndex;
  jouerSonAffectation();
  fermerModalJC();
  jcDirty = true;
  renduJobCenter(unlocks());
}

function selectionnerTrainingCat(kittyIndex) {
  const kitty = etat.kittiesData[kittyIndex];
  if (!kitty || estBernardoSuperviseur(kitty) || !kitty.metier || !METIERS[kitty.metier]) return;
  tcSpecKittySelectionne = kittyIndex;
  _tcKey = null;
  renduTrainingCenter();
}

function selectionnerKittySpec(kittyIndex) {
  selectionnerTrainingCat(kittyIndex);
  jouerSonAffectation();
  fermerModalJC();
}

function forcerKittyFormation(kittyIndex) {
  if (estIngenieur(etat.kittiesData[kittyIndex]) || estBernardoSuperviseur(kittyIndex)
      || kittyHasNonReplaceableAction(kittyIndex) || kittyIsInExplorationStaging(kittyIndex)) return;
  retirerKittyDeSesRoles(kittyIndex);
  selectionnerKittyFormation(kittyIndex);
}

function selectionnerMetierJC(metierId) {
  if (!explorateurPresent() && metierId !== "explorator") return;
  jcMetierSelectionne = jcMetierSelectionne === metierId ? null : metierId;
  jcDirty = true;
  renduJobCenter(unlocks());
  if (window.matchMedia && window.matchMedia("(max-width: 768px)").matches) {
    const button = document.querySelector('[data-jc-job-id="' + metierId + '"]');
    afficherInfoMetierJC(metierId, button);
  }
}

function lancerFormation() {
  if (!batimentFonctionnelCamp("jobCenter").available) return;
  if (etat.formationEnCours || etat.formationTermineeEnAttente) return;
  if (jcFormationKittySelectionne === null || !jcMetierSelectionne
      || estBernardoSuperviseur(jcFormationKittySelectionne)) return;
  if (!explorateurPresent() && jcMetierSelectionne !== "explorator") return;
  if (metierDejaAttribue(jcMetierSelectionne)) return;
  if (kittyIsBusy(jcFormationKittySelectionne) || kittyIsInExplorationStaging(jcFormationKittySelectionne)) return;
  const metier = METIERS[jcMetierSelectionne];
  etat.formationEnCours = {
    kittyIndex: jcFormationKittySelectionne,
    metier:     jcMetierSelectionne,
    startTs:    Date.now(),
    duree:      metier.duree
  };
  jcFormationKittySelectionne = null;
  jcMetierSelectionne = null;
  jcDirty = true;
  sauvegarder(); rendu();
}

function terminerFormation() {
  if (!etat.formationEnCours) return;
  const kittyIndex = etat.formationEnCours.kittyIndex;
  const metierId   = etat.formationEnCours.metier;
  const kitty      = etat.kittiesData[kittyIndex];
  const m          = METIERS[metierId];
  etat.formationEnCours = null;
  etat.formationTermineeEnAttente = {
    kittyIndex: kittyIndex,
    metier: metierId,
    finishedTs: Date.now()
  };
  if (kitty) {
    kitty.metier = metierId;
    afficherNotification((m ? m.emoji + " " : "") + kitty.nom + " is now a " + (m ? m.nom : metierId) + "!");
    ajouterLog("unlock", kitty.nom + " trained as " + (m ? m.nom : metierId) + ".");
    if (metierId === "explorator") {
      afficherNotification("🗺️ Exploration map unlocked!");
      ajouterLog("unlock", "The exploration map is now available in the Explorations tab.");
      carteDirty = true;
      if (!storyEstVue("storyExploratorVue")) {
        preparerStoryExplorator(kittyIndex);
        marquerStoryVue("storyExploratorVue");
        afficherModal("ecran-story-explorator");
        renduStories();
      }
    }
  }
  if (!etat.managersDebloques) {
    etat.managersDebloques = true;
    afficherNotification("🏢 Manager slots unlocked in the Work tab!");
    ajouterLog("unlock", "Manager slots are now available in Work families.");
  }
  jcDirty = true;
  sauvegarder(); rendu(); renduManagement();
}

function validerFormation() {
  if (!etat.formationTermineeEnAttente) return;
  const formationValidee = etat.formationTermineeEnAttente;
  const managerValide = estMetierManager({ metier: formationValidee.metier });
  etat.formationTermineeEnAttente = null;
  jcFormationKittySelectionne = null;
  jcMetierSelectionne = null;
  jcDirty = true;
  sauvegarder();
  rendu();
  renduManagement();
  if (managerValide) afficherTutorielRoleManager();
}

function assignerManager(famille, kittyIndex) {
  if (!etat.kittiesData[kittyIndex] || estIngenieur(etat.kittiesData[kittyIndex])
      || estBernardoSuperviseur(kittyIndex) || kittyIsBusy(kittyIndex)
      || kittyIsInExplorationStaging(kittyIndex)) return;
  etat.managers[famille] = kittyIndex;
  jouerSonAffectation();
  fermerModalJC();
  jcDirty = true;
  sauvegarder(); rendu(); renduManagement();
}

// Pulls a kitty out of whatever worker slot or manager role it currently holds, then assigns it
// to the new target — used by the "Force" button on busy kitties in the selection modals.
function retirerKittyDeSesRoles(kittyIdx) {
  annulerFocusManuelWork();
  Object.values(etat.workRecipeSlots || {}).forEach(function(slots) {
    slots.forEach(function(slot) {
      // A recipe's cycle belongs to the slot, not to the Cat assigned to it.
      // Moving a Cat away therefore leaves the selected recipe, gathered input
      // and current phase ready for the next Cat. Only changing/clearing the
      // recipe itself should discard that progress.
      if (slot.kittyIndex === kittyIdx) slot.kittyIndex = null;
    });
  });
  Object.keys(etat.managers).forEach(function(f) {
    if (etat.managers[f] === kittyIdx) etat.managers[f] = null;
  });
}

function forcerWorkerRecette(kittyIdx, familyId, slotIdx) {
  if (estIngenieur(etat.kittiesData[kittyIdx]) || estBernardoSuperviseur(kittyIdx)
      || kittyHasNonReplaceableAction(kittyIdx) || kittyIsInExplorationStaging(kittyIdx)) return;
  retirerKittyDeSesRoles(kittyIdx);
  const slot = slotRecette(familyId, slotIdx);
  if (!slot || !slot.recipeId) return;
  slot.kittyIndex = kittyIdx;
  jouerSonAffectation();
  fermerModalWorker();
  jcDirty = true;
  verifierObjectifs(); sauvegarder(); rendu();
}

function forcerManager(famille, kittyIdx) {
  if (estIngenieur(etat.kittiesData[kittyIdx]) || estBernardoSuperviseur(kittyIdx)
      || kittyHasNonReplaceableAction(kittyIdx) || kittyIsInExplorationStaging(kittyIdx)) return;
  retirerKittyDeSesRoles(kittyIdx);
  etat.managers[famille] = kittyIdx;
  jouerSonAffectation();
  fermerModalJC();
  jcDirty = true;
  sauvegarder(); rendu(); renduManagement();
}

function afficherTutorielRoleManager() {
  if (etat.managerRoleTutorialShown) return;
  etat.managerRoleTutorialShown = true;
  sauvegarder();
  setTimeout(function() {
    ouvrirDialogueModal("manager-role-tutorial-modal", {
      focusSelector: "#manager-role-tutorial-confirm"
    });
  }, 0);
}

function fermerManagerRoleTutorial() {
  fermerDialogueModal("manager-role-tutorial-modal");
}

function retirerManager(famille) {
  etat.managers[famille] = null;
  jcDirty = true;
  sauvegarder(); rendu(); renduManagement();
}

function renderManagerSlot(famille) {
  const el = domParId("manager-slot-" + famille);
  if (!el) return;
  const debloque = famille === "houses"
    ? etat.itemsAppris.includes("constructionPlan")
    : batimentFonctionnelCamp("jobCenter").available;
  if (!debloque) {
    if (famille === "houses") {
      ecrireStyle(el, "display", "none");
      return;
    }
    ecrireStyle(el, "display", "flex");
    if (el.dataset.slotState !== "locked") {
      el.dataset.slotState = "locked";
      el.innerHTML = '<span class="manager-slot-locked">Available after building the Job Center</span>';
    }
    return;
  }
  ecrireStyle(el, "display", "flex");
  const managerIdx = etat.managers[famille];
  const metiersEligibles = METIER_PAR_FAMILLE[famille] || [];

  // Resolve actual state: filled (valid manager) or empty
  let kitty = null;
  if (managerIdx !== null && managerIdx !== undefined) {
    const k = etat.kittiesData[managerIdx];
    if (k && metiersEligibles.includes(k.metier)) kitty = k;
    else etat.managers[famille] = null;
  }

  // Only rebuild DOM when state changes — prevents destroying the button mid-click
  const currentState = el.dataset.slotState || "";
  const newState = kitty ? "filled:" + managerIdx + ":" + managerSpeedMultiplier(kitty, famille).toFixed(2) + ":" + managerSphereStateKey(famille) : "empty";
  if (currentState === newState) return;
  el.dataset.slotState = newState;

  if (kitty) {
    const tierIdx = kitty.tier || 0;
    const m = METIERS[kitty.metier];
    const bonusTxt = m ? '<span class="manager-speed-line"><span class="bonus-var">×' + managerSpeedMultiplier(kitty, famille).toFixed(2) + '</span> ' + (m.bonusLabel || "production speed") + '</span>' + managerPerksHtml(famille, null, famille === "houses") : '';
    el.innerHTML = '<div class="manager-slot-filled">'
      + '<div class="manager-cercle kitty-photo-tier-' + tierIdx + '">' + kittyIconHtml(kitty) + '</div>'
      + '<div class="manager-info">'
      +   '<span class="manager-kitty-nom">' + kitty.nom + '</span>'
      +   '<span class="manager-bonus-txt">' + bonusTxt + '</span>'
      + '</div>'
      + '<button class="manager-slot-remove" aria-label="Remove ' + echapperAttributHtml(kitty.nom) + ' as ' + echapperAttributHtml(famille) + ' manager" onclick="retirerManager(\'' + famille + '\');event.stopPropagation()"><img src="img/interface/Red Cross_Final.png?v=0.0029" alt=""></button>'
      + '</div>';
  } else {
    el.innerHTML = '<button class="manager-slot-btn" aria-label="Assign a ' + echapperAttributHtml(famille) + ' manager" onclick="ouvrirModalJC(\'manager\',\'' + famille + '\')">+ Manager</button>';
  }
}

// Recipe selection keeps the chosen recipe in the slot. Changing it only
// discards that slot's private inputs and current cycle.
let recipeModalOuvert = null; // { familyId, slotIdx }
let travailConfirmationEnAttente = null;

function afficherDialogueRecette() {
  if (!recipeModalOuvert) return;
  ouvrirDialogueModal("recipe-modal", {
    dismissible: true,
    fermer: fermerModalRecette,
    focusSelector: ".recipe-modal-choice",
    returnFocusSelector: "#recipe-slot-" + recipeModalOuvert.familyId + "-" + recipeModalOuvert.slotIdx + " .work-recipe-selected"
  });
}

function ouvrirModalRecette(familyId, slotIdx) {
  recipeModalOuvert = { familyId: familyId, slotIdx: slotIdx };
  renduModalRecette();
  afficherDialogueRecette();
}

function fermerModalRecette() {
  recipeModalOuvert = null;
  fermerDialogueModal("recipe-modal");
}

function renduModalRecette() {
  const conteneur = domParId("recipe-modal-list");
  if (!conteneur || !recipeModalOuvert) return;
  const familyId = recipeModalOuvert.familyId;
  const slot = slotRecette(familyId, recipeModalOuvert.slotIdx);
  const choices = recettesDisponiblesFamille(familyId, unlocks());
  ecrireTexte(domParId("recipe-modal-title"), "Choose a " + WORK_FAMILIES[familyId].label + " recipe");
  let html = choices.map(function(pair) {
    const selected = slot && slot.recipeId === pair.recipeId;
    const cost = quantiteInputEffective(pair, pair.inputs[0]);
    const capacite = capaciteRecetteWork(pair, unlocks());
    const disabled = !capacite.available;
    return '<button type="button" class="recipe-modal-choice' + (selected ? ' is-selected' : '')
      + (disabled ? ' is-building-locked' : '') + '"'
      + (disabled ? ' disabled aria-disabled="true"' : ' onclick="selectionnerRecette(\'' + pair.recipeId + '\')"')
      + (selected ? ' aria-current="true"' : '') + '>'
      + '<span class="work-tier-badge work-tier-badge-tier-' + pair.tier + '">Tier ' + pair.tier + '</span>'
      + '<span class="recipe-modal-formula"><span><img src="' + pair.rawIcon + '" alt=""><strong>' + libelleNombreDecimal(cost, 1) + ' ' + pair.rawLabel + '</strong></span><b>→</b><span><img src="' + pair.procIcon + '" alt=""><strong>' + pair.procLabel + '</strong></span></span>'
      + '<small>' + (disabled ? echapperAttributHtml(capacite.reason) : 'The assigned Cat gathers the input, then processes the result.') + '</small></button>';
  }).join("");
  if (slot && slot.recipeId) html += '<button type="button" class="recipe-modal-clear" onclick="retirerRecetteSelectionnee()">Clear this recipe slot</button>';
  conteneur.innerHTML = html || '<p class="worker-modal-vide">No recipe available in this family yet.</p>';
}

function ouvrirConfirmationTravail(titre, message, action, libelleAction) {
  const recetteSuspendue = !!recipeModalOuvert;
  travailConfirmationEnAttente = { action: action, restaurerRecette: recetteSuspendue };
  ecrireTexte(domParId("work-confirm-title"), titre);
  ecrireTexte(domParId("work-confirm-copy"), message);
  ecrireTexte(domParId("work-confirm-accept"), libelleAction || "Continue");
  // Avoid stacking two aria-modal dialogs. Some mobile browsers leave the
  // first dialog's overlay above the confirmation and swallow every tap.
  if (recetteSuspendue) fermerDialogueModal("recipe-modal");
  ouvrirDialogueModal("work-confirm-modal", {
    dismissible: true,
    fermer: annulerConfirmationTravail,
    focusSelector: "#work-confirm-cancel"
  });
}

function annulerConfirmationTravail() {
  const confirmation = travailConfirmationEnAttente;
  travailConfirmationEnAttente = null;
  fermerDialogueModal("work-confirm-modal");
  if (confirmation && confirmation.restaurerRecette && recipeModalOuvert) {
    requestAnimationFrame(afficherDialogueRecette);
  }
}

function confirmerActionTravail() {
  const confirmation = travailConfirmationEnAttente;
  travailConfirmationEnAttente = null;
  fermerDialogueModal("work-confirm-modal");
  if (confirmation && typeof confirmation.action === "function") confirmation.action();
}

function selectionnerRecette(recipeId) {
  if (!recipeModalOuvert) return;
  const familyId = recipeModalOuvert.familyId;
  const slotIdx = recipeModalOuvert.slotIdx;
  const slot = slotRecette(familyId, slotIdx);
  const pair = paireRecette(recipeId);
  if (!slot || !pair || pair.family !== familyId) return;
  const capacite = capaciteRecetteWork(pair, unlocks());
  if (!capacite.available) {
    afficherNotification(capacite.reason);
    renduModalRecette();
    return;
  }
  if (slot.recipeId === recipeId) { fermerModalRecette(); return; }
  if (slot.recipeId && slot.kittyIndex !== null) {
    ouvrirConfirmationTravail(
      "Change recipe?",
      "Changing this recipe will discard its gathered input and current progress.",
      function() { appliquerSelectionRecette(familyId, slotIdx, recipeId); },
      "Change recipe"
    );
    return;
  }
  appliquerSelectionRecette(familyId, slotIdx, recipeId);
}

function appliquerSelectionRecette(familyId, slotIdx, recipeId) {
  const slot = slotRecette(familyId, slotIdx);
  const pair = paireRecette(recipeId);
  if (!slot || !pair || pair.family !== familyId) return;
  if (!capaciteRecetteWork(pair, unlocks()).available) return;
  if (slot.recipeId === recipeId) { fermerModalRecette(); return; }
  annulerFocusManuelWork(familyId, slotIdx);
  const proposeWorker = slot.kittyIndex === null;
  viderProgressionRecette(slot);
  slot.recipeId = recipeId;
  fermerModalRecette();
  if (!proposeWorker && familyId === "wood") jouerSonScieBois();
  verifierObjectifs(); sauvegarder(); rendu();
  // A newly chosen recipe is not useful until a Cat is assigned. Keep the
  // existing selection flow for occupied slots, but chain directly to the
  // Cat picker when this slot had no Cat yet.
  if (proposeWorker) ouvrirModalWorkerRecette(familyId, slotIdx);
}

function retirerRecetteSelectionnee() {
  if (!recipeModalOuvert) return;
  const slot = slotRecette(recipeModalOuvert.familyId, recipeModalOuvert.slotIdx);
  if (!slot) return;
  if (slot.kittyIndex !== null) {
    ouvrirConfirmationTravail(
      "Clear recipe slot?",
      "Clearing this slot removes its Cat and discards all gathered input and progress.",
      retirerRecetteSelectionneeConfirme,
      "Clear slot"
    );
    return;
  }
  retirerRecetteSelectionneeConfirme();
}

function retirerRecetteSelectionneeConfirme() {
  if (!recipeModalOuvert) return;
  const slot = slotRecette(recipeModalOuvert.familyId, recipeModalOuvert.slotIdx);
  if (!slot) return;
  annulerFocusManuelWork(recipeModalOuvert.familyId, recipeModalOuvert.slotIdx);
  reinitialiserProgressionRecette(slot, true);
  fermerModalRecette();
  sauvegarder(); rendu();
}

// ── Recipe Cat selection modal ───────────────────────────────
let workerModalOuvert = null; // { familyId, slotIdx }

function ouvrirModalWorkerRecette(familyId, slotIdx) {
  const slot = slotRecette(familyId, slotIdx);
  if (!slot || !slot.recipeId) { ouvrirModalRecette(familyId, slotIdx); return; }
  const pair = paireRecette(slot.recipeId);
  const capacite = capaciteRecetteWork(pair, unlocks());
  if (!capacite.available) {
    afficherNotification(capacite.reason);
    return;
  }
  workerModalOuvert = { familyId: familyId, slotIdx: slotIdx };
  renduModalWorker();
  ouvrirDialogueModal("worker-modal", {
    dismissible: true,
    fermer: fermerModalWorker,
    focusSelector: ".worker-modal-kitty[data-clavier-clic]",
    returnFocusSelector: "#recipe-slot-" + familyId + "-" + slotIdx + " button"
  });
}

function fermerModalWorker() {
  workerModalOuvert = null;
  fermerDialogueModal("worker-modal");
}

function renduModalWorker() {
  const conteneur = document.getElementById("worker-modal-kitties");
  if (!conteneur || !workerModalOuvert) return;
  const slot = slotRecette(workerModalOuvert.familyId, workerModalOuvert.slotIdx);
  const pair = slot && paireRecette(slot.recipeId);
  if (!pair) return;
  ecrireTexte(domParId("worker-modal-titre"), "Assign a Cat to " + pair.procLabel);
  const bonusFn = function(niveau) { return Math.pow(GATHER_LEVEL_MULTIPLIER, niveau) * productionProcBonus({ niveau: niveau }); };
  let html = "";
  const ordre = etat.kittiesData
    .map(function(k, i) { return { k: k, i: i }; })
    .filter(function(entry) { return !estIngenieur(entry.k) && !estBernardoSuperviseur(entry.k); });
  ordre.sort(function(a, b) { return bonusFn(b.k.niveau) - bonusFn(a.k.niveau); });
  ordre.forEach(function(entry) {
    const k = entry.k, i = entry.i;
    const onExplo     = kittyIsOnExpedition(i);
    const onZoneExplo = kittyIsOnZoneExplo(i);
    const onScouting  = kittyIsOnScouting(i) || kittyIsInScoutingStaging(i);
    const inWorker    = kittyIsInWorkerSlot(i);
    const inTraining  = kittyIsInTraining(i);
    const isManager   = kittyEstManager(i);
    const isLearning  = kittyIsLearningBook(i);
    const inDemolition = kittyIsDemolishingCamp(i);
    const inExplorationStaging = kittyIsInExplorationStaging(i);
    const disabled    = onExplo || onZoneExplo || onScouting || inExplorationStaging || inWorker || inTraining || isLearning || inDemolition || isManager;
    const forcable    = !isLearning && !inDemolition && !onExplo && !onZoneExplo && !onScouting && !inExplorationStaging && !inTraining && (inWorker || isManager);
    const status      = disabled ? kittyAllocationLabel(i).text : "";
    html += '<div class="worker-modal-kitty' + (disabled ? ' worker-modal-kitty-disabled' : '') + '"' +
            (disabled ? ' aria-disabled="true"' : attributsActivationClavier("Assign " + k.nom + " to this work slot") + ' onclick="assignerWorkerSlot(' + i + ')"') + '>';
    html += '<span class="worker-modal-kitty-emoji">' + kittyIconHtml(k) + '</span>';
    html += '<div class="worker-modal-kitty-info">';
    html += '<span class="worker-modal-kitty-nom">' + k.nom + '</span>';
    if (status) html += '<span class="worker-modal-kitty-status">' + status + '</span>';
    html += '</div>';
    html += '<div class="worker-modal-kitty-bonus">';
    html += '<div class="worker-modal-kitty-bonus-ligne"><span>×' + Math.pow(GATHER_LEVEL_MULTIPLIER, k.niveau).toFixed(2) + ' <span class="worker-modal-kitty-bonus-label">Gather Prod</span></span><span>×' + productionProcBonus(k).toFixed(2) + ' <span class="worker-modal-kitty-bonus-label">Process Prod</span></span></div>';
    html += '</div>';
    if (forcable) html += '<button class="btn-forcer" aria-label="Force assign ' + echapperAttributHtml(k.nom) + '" onclick="forcerWorkerRecette(' + i + ',\'' + workerModalOuvert.familyId + '\',' + workerModalOuvert.slotIdx + ');event.stopPropagation()">Force</button>';
    else html += '<div></div>';
    html += '</div>';
  });
  conteneur.innerHTML = html || '<p class="worker-modal-vide">No free cats available.</p>';
}

function assignerWorkerSlot(kittyIndex) {
  if (!workerModalOuvert) return;
  if (estIngenieur(etat.kittiesData[kittyIndex]) || estBernardoSuperviseur(kittyIndex)) return;
  if (kittyIsBusy(kittyIndex)) return;
  if (kittyIsInExplorationStaging(kittyIndex)) return;
  const slot = slotRecette(workerModalOuvert.familyId, workerModalOuvert.slotIdx);
  if (!slot || !slot.recipeId) return;
  if (!capaciteRecetteWork(paireRecette(slot.recipeId), unlocks()).available) return;
  annulerFocusManuelWork(workerModalOuvert.familyId, workerModalOuvert.slotIdx);
  // Replacing the Cat does not restart the recipe. Gathering/processing
  // progress and private inputs are reset only when the recipe changes or is
  // cleared (see appliquerSelectionRecette / retirerRecetteSelectionneeConfirme).
  slot.kittyIndex = kittyIndex;
  if (workerModalOuvert.familyId === "wood") jouerSonScieBois();
  else jouerSonAffectation();
  fermerModalWorker();
  verifierObjectifs(); sauvegarder(); rendu();
}

function retirerWorkerRecette(familyId, slotIdx) {
  const slot = slotRecette(familyId, slotIdx);
  if (!slot) return;
  annulerFocusManuelWork(familyId, slotIdx);
  // Keep the recipe cycle intact while the slot waits for another Cat.
  slot.kittyIndex = null;
  sauvegarder(); rendu();
}

function renduJobCenter(u) {
  const el = document.getElementById("jc-interface");
  if (!el) return;

  if (jcDirty) {
    masquerInfoMetierJC(true);
    let html = '<div class="jc-section-titre">Training</div>';

    if (etat.formationTermineeEnAttente) {
      jcFormationKittySelectionne = null;
      jcMetierSelectionne = null;
      const f = etat.formationTermineeEnAttente;
      const m = METIERS[f.metier];
      const kitty = etat.kittiesData[f.kittyIndex];
      html += '<div class="jc-formation-terminee">';
      html += '<div class="jc-slot-filled">';
      html += '<span class="jc-slot-emoji">' + kittyIconHtml(kitty) + '</span>';
      html += '<div class="jc-slot-info">';
      html += '<span class="jc-slot-nom">' + (kitty ? kitty.nom : "?") + '</span>';
      html += '<span class="jc-slot-metier">' + (m ? m.nom : f.metier) + ' learned!</span>';
      html += '</div></div>';
      html += '<button type="button" class="btn-jc-validate" onclick="validerFormation()">✓ Validate formation</button>';
      html += '</div>';
    } else if (etat.formationEnCours) {
      const f = etat.formationEnCours;
      const m = METIERS[f.metier];
      const kitty = etat.kittiesData[f.kittyIndex];
      const elapsed = Math.min(f.duree, (Date.now() - f.startTs) / 1000);
      const prog    = elapsed / f.duree;
      const restant = Math.max(0, f.duree - elapsed);
      html += '<div class="jc-formation-en-cours">';
      html += '<div class="jc-slot-filled">';
      html += '<span class="jc-slot-emoji">' + kittyIconHtml(kitty) + '</span>';
      html += '<div class="jc-slot-info">';
      html += '<span class="jc-slot-nom">' + (kitty ? kitty.nom : "?") + '</span>';
      html += '<span class="jc-slot-metier">Becoming ' + (m ? m.nom : f.metier) + '...</span>';
      html += '</div></div>';
      html += '<div class="inv-learning-barre jc-learning-barre">'
        + '<div id="barre-jc-formation" class="inv-learning-progres" style="width:' + Math.round(prog * 100) + '%"></div>'
        + '<img id="jc-training-marker" class="inv-learning-marker" src="' + (kitty && kitty.visage ? kitty.visage : CAT_FACES.bernardo) + '" alt="' + (kitty ? echapperAttributHtml(kitty.nom) : 'Cat') + '">'
        + '</div>';
      html += '<div class="jc-timer">' + formaterTemps(restant) + '</div>';
      html += '</div>';
    } else {
      // Auto-clear if selected kitty went on expedition or into a worker slot
      if (jcFormationKittySelectionne !== null && (kittyIsBusy(jcFormationKittySelectionne) || kittyIsInExplorationStaging(jcFormationKittySelectionne))) {
        jcFormationKittySelectionne = null;
      }
      // Kitty slot
      if (jcFormationKittySelectionne !== null) {
        const kitty = etat.kittiesData[jcFormationKittySelectionne];
        html += '<div class="jc-slot-wrap">';
        html += '<div class="jc-slot-filled" data-jc-modal-trigger="formation"' + attributsActivationClavier("Change the Stray Cat selected for job training") + ' onclick="ouvrirModalJC(\'formation\')">';
        html += '<span class="jc-slot-emoji">' + kittyIconHtml(kitty) + '</span>';
        html += '<div class="jc-slot-info">';
        html += '<span class="jc-slot-nom">' + (kitty ? kitty.nom : "?") + '</span>';
        html += '<span class="jc-slot-metier">Stray Cat</span>';
        html += '</div>';
        html += '</div>';
        html += '<button class="jc-slot-remove" aria-label="Remove ' + echapperAttributHtml(kitty ? kitty.nom : "cat") + ' from job training" onclick="jcFormationKittySelectionne=null;jcDirty=true"><img src="img/interface/Red Cross_Final.png?v=0.0029" alt=""></button>';
        html += '</div>';
      } else {
        html += '<div class="jc-slot-empty" data-jc-modal-trigger="formation"' + attributsActivationClavier("Select an unassigned cat for job training") + ' onclick="ouvrirModalJC(\'formation\')">';
        html += '<span class="jc-slot-plus">+</span>';
        html += '<span class="jc-slot-label">Select an unassigned cat</span>';
        html += '</div>';
      }

      // Job selection
      html += '<div class="jc-metiers">';
      const premierExploratorRequis = !explorateurPresent();
      Object.values(METIERS).filter(function(m) {
        return m.id !== "gang-leader" && !m.engineer && (!m.unlockItem || etat.itemsAppris.includes(m.unlockItem));
      }).sort(function(a, b) {
        if (a.id === "explorator") return -1;
        if (b.id === "explorator") return 1;
        return 0;
      }).forEach(function(m) {
        const pris      = metierDejaAttribue(m.id);
        const sel       = jcMetierSelectionne === m.id;
        const recommande = m.id === "explorator";
        const verrouille = premierExploratorRequis && m.id !== "explorator";
        html += '<span class="jc-metier-info-wrap" data-jc-job-info="' + m.id + '"' +
          ' onmouseenter="afficherInfoMetierJC(\'' + m.id + '\', this.firstElementChild)"' +
          ' onmouseleave="masquerInfoMetierJC()"' +
          ' onfocusin="afficherInfoMetierJC(\'' + m.id + '\', this.firstElementChild)"' +
          ' onfocusout="masquerInfoMetierJC()"' +
          ' onclick="afficherInfoMetierJC(\'' + m.id + '\', this.firstElementChild);event.stopPropagation()">';
        html += '<button data-jc-job-id="' + m.id + '" class="jc-metier-btn' + (sel ? ' jc-metier-actif' : '') + (recommande ? ' jc-metier-recommande' : '') + '"';
        if (pris || verrouille) {
          html += ' disabled title="' + (pris ? 'Already trained' : 'Train an Explorator first') + '"';
        } else {
          html += ' onclick="selectionnerMetierJC(\'' + m.id + '\');event.stopPropagation()"';
        }
        html += '>' + m.emoji + ' ' + m.nom + (pris ? ' ✓' : '') + (recommande && !pris ? ' ⭐' : '') + '</button></span>';
      });
      html += '</div>';

      const peutLancer = jcFormationKittySelectionne !== null && jcMetierSelectionne !== null &&
        (!premierExploratorRequis || jcMetierSelectionne === "explorator");
      html += '<button class="btn-jc-train"' + (peutLancer ? '' : ' disabled') + ' onclick="lancerFormation()">⏱ Train (1h)</button>';
    }

    el.innerHTML = html;
    jcDirty = false;
  } else if (etat.formationEnCours) {
    const f = etat.formationEnCours;
    const elapsed = Math.min(f.duree, (Date.now() - f.startTs) / 1000);
    const prog    = elapsed / f.duree;
    const restant = Math.max(0, f.duree - elapsed);
    const barre = domParId("barre-jc-formation");
    const pct = Math.round(prog * 100);
    ecrireStyle(barre, "width", pct + "%");
    ecrireStyle(domParId("jc-training-marker"), "left", pct + "%");
    const timer = el.querySelector(".jc-timer");
    ecrireTexte(timer, formaterTemps(restant));
  }
}


// ════════════════════════════════════════════════════════════
// 10. ACTIONS
// ════════════════════════════════════════════════════════════

// ── 10a. Catch sequence
document.getElementById("bouton-sequence").addEventListener("click", function() {
  if (!sequenceEstPrete()) return;
  if (etat.chatons >= 3 && !recrutementDepuisCampDebloque()) {
    changerOnglet("camp");
    return;
  }
  if (etat.chatons >= 3 && campLogementSature()) {
    changerOnglet("camp");
    expliquerCampPleinRecrutement();
    return;
  }
  marquerSequencePrete();
  if (etat.chatons < 3) ouvrirMiniJeuCatch();
  else ouvrirMiniJeuRecruit();
});

function terminerSequence() {
  const etaitRecruit = etat.chatons >= 3;
  if (etaitRecruit && campLogementSature()) return null;
  etat.sequenceEnCours = false;
  const visage = assurerVisageProchainChat();
  etat.chatons        += 1;
  etat.clicCount      += 1;
  const nom = nomProchainChat();
  etat.kittiesData.push({ nom: nom, metier: null, niveau: 0, xp: 0, tier: 0, managerMult: 1.5, catchTs: Date.now(), visage: visage, jobNiveau: 0 });
  etat.prochainVisageChaton = null;
  jouerSonMiaulement();
  if (!etaitRecruit) afficherNotification("🐱 " + nom + " joined the gang!");
  ajouterLog("event", nom + (etaitRecruit ? " recruited!" : " caught!"));
  if (etaitRecruit) demarrerRechargeCatch();
  renduManagement();
  exploTabDirty = true;
  verifierStoryModals();
  sauvegarder(); rendu();
  return { nom: nom, visage: visage, recruit: etaitRecruit };
}

// ── 10b. Worker deallocation (bulk unassign)

// ── 10c. Buildings, Purrks, Boosts
function acheterCathouse() {
  const cout = coutProchaineCathouse();
  if (etat.cardboardPlanks < cout) return;
  etat.cardboardPlanks -= cout;
  etat.cathouses.push(Date.now());
  afficherNotification("📦 Cardboard Box built!");
  ajouterLog("event", "Cardboard Box #" + etat.cathouses.length + " built!");
  if (etat.cathouses.length === 1 && !storyEstVue("story4Vue")) {
    marquerStoryVue("story4Vue");
    afficherModal("ecran-story-4");
    renduStories();
  }
  verifierObjectifs(); sauvegarder(); rendu();
}

function acheterCatHouse() {
  const cout = coutProchaineCatHouse();
  if (etat.basicWoodPlanks < cout) return;
  etat.basicWoodPlanks -= cout;
  etat.cathouseCount += 1;
  afficherNotification("🏠 Wood Cathouse built!");
  ajouterLog("event", "Wood Cathouse #" + etat.cathouseCount + " built!");
  verifierObjectifs(); sauvegarder(); rendu();
}

function basculerAutoBuildWoodHouses(checked) {
  etat.autoBuildWoodHouses = !!checked && spherePerkLearned('builder-auto');
  sauvegarder();
  rendu();
}

function acheterStoneCathouse() {
  const cout = coutProchaineStoneCathouse();
  if (etat.basicWoodPlanks < cout.planks || etat.pebbleBricks < cout.bricks) return;
  etat.basicWoodPlanks -= cout.planks;
  etat.pebbleBricks    -= cout.bricks;
  etat.stoneCathouseCount++;
  afficherNotification("🪨 Basic Stone Cathouse built!");
  ajouterLog("event", "Basic Stone Cathouse #" + etat.stoneCathouseCount + " built!");
  verifierObjectifs(); sauvegarder(); rendu();
}

function acheterSolidStoneCathouse() {
  if (!solidStoneCathouseDebloquee()) return;
  const cout = coutProchaineSolidStoneCathouse();
  if (etat.basicWoodPlanks < cout.planks || etat.rockBricks < cout.bricks) return;
  etat.basicWoodPlanks -= cout.planks;
  etat.rockBricks      -= cout.bricks;
  etat.solidStoneCathouseCount++;
  afficherNotification("Solid Stone Cathouse built!");
  ajouterLog("event", "Solid Stone Cathouse #" + etat.solidStoneCathouseCount + " built!");
  verifierObjectifs(); sauvegarder(); rendu();
}

function nourrir(kittyIdx, foodType) {
  const xpGain = FOOD_XP[foodType];
  if (!xpGain || etat[foodType] < 1) return;
  const k = etat.kittiesData[kittyIdx];
  if (!k) return;
  const niveauMax = niveauMaxChat(k);
  if (Number.isFinite(niveauMax) && k.niveau >= niveauMax) return;
  const niveauAvant = k.niveau;
  etat[foodType] -= 1;
  k.xp += xpGain;
  while (k.xp >= xpPourNiveau(k.niveau) && k.niveau < niveauMax) {
    k.xp -= xpPourNiveau(k.niveau);
    k.niveau++;
    ajouterLog("event", k.nom + " reached Level " + k.niveau + "!");
    afficherNotification("🎉 " + k.nom + " is now Level " + k.niveau + "!");
  }
  if (Number.isFinite(niveauMax) && k.niveau >= niveauMax) k.xp = 0;
  if (k.niveau > niveauAvant && typeof enregistrerNiveauQuotidien === "function") {
    enregistrerNiveauQuotidien(k.niveau - niveauAvant);
  }
  verifierObjectifs(); sauvegarder(); renduManagement();
}

function calculerPlanNourritureAuto(xpCible) {
  const foods = Object.keys(FOOD_XP);
  const maxFoodXp = Math.max.apply(null, foods.map(function(foodType) { return FOOD_XP[foodType]; }));
  const maxTotal = xpCible + maxFoodXp - 1;
  let plans = new Array(maxTotal + 1).fill(null);
  plans[0] = { units: 0, quantities: {} };

  foods.forEach(function(foodType) {
    const xp = FOOD_XP[foodType];
    const stock = Math.max(0, Number(etat[foodType]) || 0);
    const maxUnits = Math.min(stock, Math.floor(maxTotal / xp));
    const nextPlans = plans.slice();
    for (let total = 0; total <= maxTotal; total++) {
      const base = plans[total];
      if (!base) continue;
      for (let quantity = 1; quantity <= maxUnits && total + quantity * xp <= maxTotal; quantity++) {
        const newTotal = total + quantity * xp;
        const candidate = {
          units: base.units + quantity,
          quantities: Object.assign({}, base.quantities)
        };
        candidate.quantities[foodType] = quantity;
        if (!nextPlans[newTotal] || candidate.units < nextPlans[newTotal].units) {
          nextPlans[newTotal] = candidate;
        }
      }
    }
    plans = nextPlans;
  });

  for (let total = xpCible; total <= maxTotal; total++) {
    if (plans[total]) {
      return { xpTotal: total, surplus: total - xpCible, quantities: plans[total].quantities };
    }
  }
  return null;
}

function nourrirAutoNiveau(kittyIdx) {
  const k = etat.kittiesData[kittyIdx];
  if (!k) return;
  const niveauMax = niveauMaxChat(k);
  if (Number.isFinite(niveauMax) && k.niveau >= niveauMax) return;
  const niveauAvant = k.niveau;
  const xpManquant = xpPourNiveau(k.niveau) - k.xp;
  if (xpManquant <= 0) return;
  const plan = calculerPlanNourritureAuto(xpManquant);
  if (!plan) return;

  const appliquerPlan = function() {
    Object.keys(plan.quantities).forEach(function(foodType) {
      etat[foodType] -= plan.quantities[foodType];
    });
    k.xp += plan.xpTotal;
    while (k.xp >= xpPourNiveau(k.niveau) && k.niveau < niveauMax) {
      k.xp -= xpPourNiveau(k.niveau);
      k.niveau++;
      ajouterLog("event", k.nom + " reached Level " + k.niveau + "!");
      afficherNotification("🎉 " + k.nom + " is now Level " + k.niveau + "!");
    }
    if (Number.isFinite(niveauMax) && k.niveau >= niveauMax) k.xp = 0;
    if (k.niveau > niveauAvant && typeof enregistrerNiveauQuotidien === "function") {
      enregistrerNiveauQuotidien(k.niveau - niveauAvant);
    }
    verifierObjectifs(); sauvegarder(); renduManagement();
  };

  if (plan.surplus > 0 && etat.avertirSurplusNourriture !== false) {
    ouvrirConfirmationTravail(
      "Confirm auto-feed",
      "This will provide " + plan.xpTotal + " XP, which is " + plan.surplus + " XP more than " + k.nom + " needs for the next level.",
      appliquerPlan,
      "Feed " + k.nom
    );
    return;
  }
  appliquerPlan();
}

function assignerGangLeader() {
  const bernardo = etat.kittiesData.find(function(k) { return k.nom === "Bernardo"; });
  if (bernardo && bernardo.metier !== "gang-leader") {
    bernardo.metier = "gang-leader";
    afficherNotification("👑 Bernardo is now the Gang Leader!");
    ajouterLog("event", "Bernardo has been promoted to Gang Leader. His strength grows with every cat you recruit.");
  }
}

function acheterJobCenter() {
  return preparerPlacementBatimentCamp("jobCenter");
}

function acheterTrainingCenter() {
  return preparerPlacementBatimentCamp("trainingCenter");
}

function acheterLaboratoire() {
  return preparerPlacementBatimentCamp("laboratory");
}



// ════════════════════════════════════════════════════════════
// 11. GAME LOOP (TICK)
// ════════════════════════════════════════════════════════════

let vitesse  = 1;
const TICK_DT = 0.1; // seconds per tick

function workBoostMult() {
  return (etat.workBoostFinTs && Date.now() < etat.workBoostFinTs) ? 10 : 1;
}

function definitionMoteurRecette(pair) {
  const input = pair.inputs && pair.inputs[0];
  return {
    rawRes: pair.rawRes,
    rawTotalKey: pair.rawTotalKey,
    procTotalKey: pair.procTotalKey,
    rawSeconds: pair.rawCfg.secondesParUnite,
    rawQuantity: input && Number.isFinite(input.baseQuantity)
      ? input.baseQuantity
      : pair.procCfg[pair.procSecUnite] / pair.procCfg[pair.procSecRaw],
    processingSeconds: pair.procCfg[pair.procSecUnite],
    outputRes: pair.procRes
  };
}

function modificateursRecette(pair, kitty) {
  return {
    gatheringSpeed: multiplicateurFamille(pair.rawAction),
    gatheringProduction: multiplicateurProductionFamille(pair.rawAction),
    processingSpeed: multiplicateurFamille(pair.procMultAction),
    costMultiplier: multiplicateurCoutFamille(pair.procMultAction),
    basicProduction: kitty ? Math.pow(GATHER_LEVEL_MULTIPLIER, kitty.niveau) : 1,
    complexProduction: productionProcBonus(kitty),
    globalSpeed: gangLeaderBonus()
  };
}

function tickWorkRecipes(dt, manualFocusAutorise) {
  const resultats = {};
  const recettesTermineesParFamille = {};
  RESOURCE_PAIRS.forEach(function(pair) { etat[pair.rawRes] = 0; });
  Object.keys(etat.workRecipeSlots || {}).forEach(function(family) {
    if (family === "wood" && !catheringDebloquee()) return;
    (etat.workRecipeSlots[family] || []).forEach(function(slot, slotIdx) {
      if (!slot || slot.kittyIndex === null || !slot.recipeId) return;
      const pair = RESOURCE_PAIRS.find(function(candidate) {
        return candidate.family === family && candidate.recipeId === slot.recipeId;
      });
      const kitty = etat.kittiesData[slot.kittyIndex];
      if (!pair || !kitty) return;
      if (!capaciteRecetteWork(pair, unlocks()).available) return;
      if (etatStockageRessource(pair.procRes).plein) return;
      const phaseAvant = phaseActiveRecette(slot);
      const modifiers = Object.assign(
        modificateursRecette(pair, kitty),
        manualFocusAutorise
          ? modificateursManualFocus(family, slotIdx, slot)
          : { gatheringManualSpeed: 1, processingManualSpeed: 1 }
      );
      const result = avancerRecetteSlot(etat, definitionMoteurRecette(pair), slot, dt, modifiers);
      if (manualFocusAutorise && workManualFocus
          && workManualFocus.kind !== "camp"
          && workManualFocus.familyId === family
          && workManualFocus.slotIdx === slotIdx
          && (phaseActiveRecette(slot) !== phaseAvant || result.completedCycles > 0)) {
        poursuivreFocusManuelWork(family, slotIdx);
      }
      if (!resultats[pair.recipeId]) {
        resultats[pair.recipeId] = { active: false, gathered: 0, produced: 0, completedCycles: 0, firstProducerIndex: null };
      }
      const aggregate = resultats[pair.recipeId];
      aggregate.active = aggregate.active || result.active;
      aggregate.gathered += result.gathered;
      aggregate.produced += result.produced;
      aggregate.completedCycles += result.completedCycles;
      if (result.completedCycles > 0) {
        recettesTermineesParFamille[family] = (recettesTermineesParFamille[family] || 0) + result.completedCycles;
      }
      if (aggregate.firstProducerIndex === null && result.firstProducerIndex !== null) {
        aggregate.firstProducerIndex = result.firstProducerIndex;
      }
    });
  });
  Object.keys(recettesTermineesParFamille).forEach(function(family) {
    if (typeof enregistrerRecettesQuotidiennes === "function") enregistrerRecettesQuotidiennes(family, recettesTermineesParFamille[family]);
  });
  return resultats;
}

function tick() {
  // Cathouse reduction accumulation (speed-aware)
  if (etat.cathouses.length > 0) {
  }

  // Speed-up: advance timestamps so exploration timers consume real-time faster.
  // The catch/recruit sequence integrates its own effective speed segments in
  // actualiserProgressionSequence(), so it must not also be shifted here.
  if (vitesse > 1) {
    const avance = (vitesse - 1) * 100;
    etat.exploEnCours.forEach(function(explo) {
      explo.startTs -= avance;
    });
    if (etat.exploZoneEnCours) {
      etat.exploZoneEnCours.startTs -= avance;
    }
    Object.values(etat.scoutingsEnCours).forEach(function(sc) {
      sc.startTs -= avance;
    });
    if (etat.formationEnCours) {
      etat.formationEnCours.startTs -= avance;
    }
    if (etat.formationIngenieurEnCours) {
      etat.formationIngenieurEnCours.startTs -= avance;
    }
    if (etat.learningEnCours) {
      etat.learningEnCours.startTs -= avance;
    }
    Object.values(etat.camp.repairs || {}).forEach(function(reparation) {
      if (reparation) reparation.startTs -= avance;
    });
    Object.values(etat.camp.houseConstructions || {}).forEach(function(construction) {
      if (construction) construction.startTs -= avance;
    });
    Object.values(etat.camp.constructions || {}).forEach(function(construction) {
      if (construction) construction.startTs -= avance;
    });
    Object.values(etat.camp.upgrades || {}).forEach(function(amelioration) {
      if (amelioration) amelioration.startTs -= avance;
    });
    campPrototypeDemolitionsActives().forEach(function(demolition) {
      demolition.startTs -= avance;
    });
  }

  appliquerManualFocusCamp(TICK_DT);

  // Check learning completion
  if (etat.learningEnCours) {
    const lc = etat.learningEnCours;
    if (Date.now() - lc.startTs >= lc.duree) {
      terminerApprentissage(lc.itemId);
    } else {
      const elapsed   = Date.now() - lc.startTs;
      const pct       = Math.min(100, Math.floor(elapsed / lc.duree * 100));
      const remaining = Math.max(0, Math.ceil((lc.duree - elapsed) / 1000));
      const labelEl   = document.getElementById("inv-learning-label");
      const progEl    = document.getElementById("inv-learning-progres");
      const markerEl  = document.getElementById("inv-learning-marker");
      const actionLabel = ITEMS[lc.itemId] && ITEMS[lc.itemId].learningGame ? "Studying" : "Learning";
      if (labelEl) labelEl.textContent = actionLabel + "... " + remaining + "s";
      if (progEl)  progEl.style.width  = pct + "%";
      if (markerEl) markerEl.style.left = pct + "%";
    }
  }

  // A completed cooldown stays ready until the player actively catches/recruits.
  marquerSequencePrete();

  // Check exploration completion
  const maintenant = Date.now();
  terminerConstructionsMaisonsCamp(maintenant);
  terminerConstructionsBatimentsCamp(maintenant);
  terminerReparationsCamp(maintenant);
  terminerAmeliorationsCamp(maintenant);
  terminerDemolitionsCampPrototype(maintenant);
  let exploTerminees = false;
  etat.exploEnCours = etat.exploEnCours.filter(function(explo) {
    if ((maintenant - explo.startTs) / 1000 >= explo.duree) {
      terminerExplo(explo);
      exploTerminees = true;
      return false;
    }
    return true;
  });
  if (exploTerminees) { sauvegarder(); }

  // Check zone exploration completion
  if (etat.exploZoneEnCours && (maintenant - etat.exploZoneEnCours.startTs) / 1000 >= etat.exploZoneEnCours.duree) {
    terminerExploZone();
    sauvegarder();
  }

  // Check scouting completions
  var scoutsDirty = false;
  Object.keys(etat.scoutingsEnCours).forEach(function(scoutingId) {
    var sc  = etat.scoutingsEnCours[scoutingId];
    var def = CONFIG.scoutings[scoutingId];
    var effectiveDuree = (sc.duree !== undefined) ? sc.duree : (def ? def.duree : 120);
    if (def && sc && (maintenant - sc.startTs) / 1000 >= effectiveDuree) {
      var completedRuns = Math.floor((maintenant - sc.startTs) / 1000 / effectiveDuree);
      terminerScouting(scoutingId, completedRuns);
      scoutsDirty = true;
    }
  });
  if (scoutsDirty) sauvegarder();

  // Every assigned cat now runs a complete private Gathering then Processing cycle.
  const cardboardPlanksTotalAvant = etat.cardboardPlanksTotalProduit;
  const resultatsRecettes = tickWorkRecipes(vitesse * TICK_DT * workBoostMult(), true);
  const resultatPremierePlanche = resultatsRecettes.cardboardPlanks;
  if (resultatPremierePlanche && resultatPremierePlanche.produced > 0) {
    mettreDialogueRapideCampEnFile("firstPlank");
  }
  const resultatPremiereBrique = resultatsRecettes.pebbleBricks;
  if (resultatPremiereBrique && resultatPremiereBrique.produced > 0
      && !operationsTableDebloquee()) {
    progressionCamp().operationsTableUnlocked = true;
    mettreDialogueRapideCampEnFile("firstPebbleBrick");
    ajouterLog("unlock", "Operations Table unlocked after producing the first Pebble Brick.");
    sauvegarder();
    renduCampPrototype();
  }
  if (cardboardPlanksTotalAvant < 10 && etat.cardboardPlanksTotalProduit >= 10 && !storyEstVue("storyBasicWoodVue")) {
    marquerStoryVue("storyBasicWoodVue");
    afficherModal("ecran-story-basic-wood");
    renduStories();
  }
  const resultatSalade = resultatsRecettes.salads;
  if (resultatSalade && resultatSalade.produced > 0 && !etat.premiereSaladeFaite) {
    etat.premiereSaladeFaite = true;
    const cookIndex = resultatSalade.firstProducerIndex;
    const cookName = etat.kittiesData[cookIndex] ? etat.kittiesData[cookIndex].nom : "a Cat";
    const el1 = document.getElementById("story-salad-cook-name");
    const el2 = document.getElementById("story-salad-cook-name-2");
    const tag = document.getElementById("story-salad-cook-tag");
    if (el1) el1.textContent = cookName;
    if (el2) el2.textContent = cookName;
    if (tag) tag.textContent = cookName;
    marquerStoryVue("storySaladVue");
    afficherModal("ecran-story-salad");
    renduStories();
  }

  // Job Center training completion
  if (etat.formationEnCours) {
    const elapsed = (Date.now() - etat.formationEnCours.startTs) / 1000;
    if (elapsed >= etat.formationEnCours.duree) terminerFormation();
  }
  if (etat.formationIngenieurEnCours) {
    const elapsedEngineer = (Date.now() - etat.formationIngenieurEnCours.startTs) / 1000;
    if (elapsedEngineer >= etat.formationIngenieurEnCours.duree) terminerFormationIngenieur();
  }

  verifierObjectifs();
  renduDynamique();
}

setInterval(tick, 100);
setInterval(sauvegarder, 30000);


// ════════════════════════════════════════════════════════════
// 11b. OFFLINE PROGRESS
// ════════════════════════════════════════════════════════════

// Offline progression is deliberately centralised here so the balance can be
// tuned later without changing each individual timer. The cap applies to
// real time away from the game; only the configured ratio is simulated.
const VITESSE_HORS_LIGNE  = 0.1;
const MAX_AFK_SECONDS     = 10 * 60 * 60;
const ABSENCE_MIN_MS      = 60000; // ignore gaps shorter than 1 minute
const AFK_RESUME_RELOAD_KEY = V4_STORAGE_NAMESPACE + ".afkResumeReload";
const VERSION_MANIFEST_PATH = "version.json";
let afkReloadProgramme = false;
let afkNavigationLancee = false;
let verificationVersionAfkEnCours = false;
let resumeAbsenceRechargeEffectue = false;

function maxAfkSeconds() {
  const bonusMinutes = ingenieursFormes().reduce(function(total, kitty) {
    const info = rangIngenieurInfo(kitty);
    if (!info || info.type !== "afk-cap-minutes") return total;
    return total + Math.max(0, Number(kitty.niveau) || 0) * info.value;
  }, 0);
  return MAX_AFK_SECONDS + bonusMinutes * 60;
}

function ratioAfkHorsLigne() {
  const bonusPercent = ingenieursFormes().reduce(function(total, kitty) {
    const info = rangIngenieurInfo(kitty);
    if (!info || info.type !== "afk-ratio-percent") return total;
    const niveau = Math.min(niveauMaxChat(kitty), Math.max(0, Number(kitty.niveau) || 0));
    return total + niveau * info.value;
  }, 0);
  return Math.min(1, VITESSE_HORS_LIGNE + bonusPercent / 100);
}

function tempsSimuleHorsLigne(ecouleReelMs) {
  const plafondAfk = maxAfkSeconds(); // MAX_AFK_SECONDS plus engineer extensions
  // VITESSE_HORS_LIGNE remains the base ratio; rank bonuses are layered on top.
  const secondesReelles = Math.min(
    plafondAfk,
    Math.max(0, Number(ecouleReelMs) || 0) / 1000
  );
  return secondesReelles * ratioAfkHorsLigne();
}

// Timers use wall-clock timestamps while the game is open. During an AFK
// period, move every active timer forward by the discarded part of the gap;
// the remaining elapsed time is therefore exactly the reduced simulated time.
function appliquerDecalageTimersHorsLigne(decalageMs) {
  if (!Number.isFinite(decalageMs) || decalageMs === 0) return;
  etat.exploEnCours.forEach(function(explo) { explo.startTs += decalageMs; });
  if (etat.exploZoneEnCours) etat.exploZoneEnCours.startTs += decalageMs;
  Object.values(etat.scoutingsEnCours || {}).forEach(function(sc) {
    if (sc) sc.startTs += decalageMs;
  });
  if (etat.formationEnCours) etat.formationEnCours.startTs += decalageMs;
  if (etat.formationIngenieurEnCours) etat.formationIngenieurEnCours.startTs += decalageMs;
  if (etat.learningEnCours) etat.learningEnCours.startTs += decalageMs;
  Object.values(etat.camp.repairs || {}).forEach(function(reparation) {
    if (reparation) reparation.startTs += decalageMs;
  });
  Object.values(etat.camp.houseConstructions || {}).forEach(function(construction) {
    if (construction) construction.startTs += decalageMs;
  });
  Object.values(etat.camp.constructions || {}).forEach(function(construction) {
    if (construction) construction.startTs += decalageMs;
  });
  Object.values(etat.camp.upgrades || {}).forEach(function(amelioration) {
    if (amelioration) amelioration.startTs += decalageMs;
  });
  campPrototypeDemolitionsActives().forEach(function(demolition) {
    demolition.startTs += decalageMs;
  });
}

// The catch/recruit sequence has segmented speed bonuses, so advance it in
// the same chunks as Work. This lets an auto-built house change only the
// remaining simulated time, just like it does during normal play.
function simulerSequenceHorsLigne(dt) {
  if (!etat.sequenceEnCours || !(dt > 0)) return;
  const duree = Math.max(0, Number(etat.sequenceDuree) || 0);
  const vitesseSegment = Number.isFinite(etat.sequenceVitesseDerniere) && etat.sequenceVitesseDerniere > 0
    ? etat.sequenceVitesseDerniere
    : vitesseSequenceEffective();
  const progress = Number.isFinite(etat.sequenceProgressBrute) ? etat.sequenceProgressBrute : 0;
  etat.sequenceProgressBrute = Math.min(duree, Math.max(0, progress) + dt * vitesseSegment);
  etat.sequenceVitesseDerniere = vitesseSequenceEffective();
}

// One simulated step of gathering/processing, no notifications/logs (used for offline catch-up)
function simulerTickHorsLigne(dt) {
  const resultatsRecettes = tickWorkRecipes(dt);
  if (resultatsRecettes.salads && resultatsRecettes.salads.produced > 0) {
    etat.premiereSaladeFaite = true;
  }
}

// Applies offline progress since the last save. Returns a summary object, or null if nothing to report.
function appliquerProgressionHorsLigne() {
  const maintenant   = Date.now();
  const dernierTimestamp = Number.isFinite(etat.dernierTimestamp) ? etat.dernierTimestamp : maintenant;
  const ecouleReelMs = Math.max(0, maintenant - dernierTimestamp);
  if (ecouleReelMs < ABSENCE_MIN_MS) {
    etat.dernierTimestamp = maintenant;
    return null;
  }

  const avant = {
    cardboardPlanks: etat.cardboardPlanks,
    basicWoodPlanks: etat.basicWoodPlanks,
    pebbleBricks: etat.pebbleBricks,
    rockBricks: etat.rockBricks,
    salads: etat.salads,
    grilledAnchovy: etat.grilledAnchovy
  };

  const dtSimTotal = tempsSimuleHorsLigne(ecouleReelMs);
  const ecouleReelPrisEnCompteMs = Math.min(ecouleReelMs, maxAfkSeconds() * 1000);
  const decalageMs = ecouleReelPrisEnCompteMs - (dtSimTotal * 1000);

  // Work is advanced directly through its shared engine. All other systems
  // retain their own timestamps, so shift them before checking completions.
  appliquerDecalageTimersHorsLigne(decalageMs);
  // Include the small interval between the last sequence update and the save
  // at full active speed, then apply the reduced AFK interval in chunks.
  if (etat.sequenceEnCours) {
    const sauvegardeTs = Number(etat.dernierTimestamp) || maintenant;
    actualiserProgressionSequence(sauvegardeTs);
    etat.sequenceDerniereMajTs = sauvegardeTs;
    etat.sequenceVitesseDerniere = vitesseSequenceEffective();
  }
  const nbChunks    = Math.min(2000, Math.max(1, Math.ceil(dtSimTotal)));
  const tailleChunk = dtSimTotal / nbChunks;
  for (let i = 0; i < nbChunks; i++) {
    simulerTickHorsLigne(tailleChunk);
    simulerSequenceHorsLigne(tailleChunk);
  }
  if (etat.sequenceEnCours) etat.sequenceDerniereMajTs = maintenant;

  // Catch/Recruit uses the same reduced simulated time as every other timer.
  // Returning players only find the action ready: a cat is never granted automatically while offline.
  if (etat.sequenceEnCours && tempsRestantSequence() <= 0) etat.sequenceEnCours = false;

  // Resolve every timer that became complete during the simulated period.
  // These functions freeze mission power at launch and keep their normal
  // reward-pending behavior; only the elapsed time is reduced while AFK.
  const maintenantApresDecalage = Date.now();
  etat.exploEnCours = etat.exploEnCours.filter(function(explo) {
    if ((maintenantApresDecalage - explo.startTs) / 1000 >= explo.duree) {
      terminerExplo(explo);
      return false;
    }
    return true;
  });
  if (etat.exploZoneEnCours
      && (maintenantApresDecalage - etat.exploZoneEnCours.startTs) / 1000 >= etat.exploZoneEnCours.duree) {
    terminerExploZone();
  }
  Object.keys(etat.scoutingsEnCours || {}).forEach(function(scoutingId) {
    const sc = etat.scoutingsEnCours[scoutingId];
    const def = CONFIG.scoutings[scoutingId];
    const duree = sc && sc.duree !== undefined ? sc.duree : (def ? def.duree : 120);
    if (!sc || !def || duree <= 0) return;
    const runs = Math.floor(Math.max(0, (maintenantApresDecalage - sc.startTs) / 1000) / duree);
    if (runs > 0) terminerScouting(scoutingId, runs);
  });
  if (etat.learningEnCours
      && maintenantApresDecalage - etat.learningEnCours.startTs >= etat.learningEnCours.duree) {
    terminerApprentissage(etat.learningEnCours.itemId);
  }
  if (etat.formationEnCours
      && (maintenantApresDecalage - etat.formationEnCours.startTs) / 1000 >= etat.formationEnCours.duree) {
    terminerFormation();
  }
  if (etat.formationIngenieurEnCours
      && (maintenantApresDecalage - etat.formationIngenieurEnCours.startTs) / 1000 >= etat.formationIngenieurEnCours.duree) {
    terminerFormationIngenieur();
  }
  terminerConstructionsMaisonsCamp(maintenantApresDecalage);
  terminerConstructionsBatimentsCamp(maintenantApresDecalage);
  terminerReparationsCamp(maintenantApresDecalage);
  terminerAmeliorationsCamp(maintenantApresDecalage);
  terminerDemolitionsCampPrototype(maintenantApresDecalage);

  etat.dernierTimestamp = maintenant;
  verifierObjectifs();
  sauvegarder();

  return {
    dureeReelleSec: ecouleReelMs / 1000,
    dureeSimuleeSec: dtSimTotal,
    cardboardPlanks: etat.cardboardPlanks - avant.cardboardPlanks,
    basicWoodPlanks: etat.basicWoodPlanks - avant.basicWoodPlanks,
    pebbleBricks:    etat.pebbleBricks   - avant.pebbleBricks,
    rockBricks:      etat.rockBricks     - avant.rockBricks,
    salads:          etat.salads         - avant.salads,
    grilledAnchovy:  etat.grilledAnchovy - avant.grilledAnchovy,
    kittyAttrape:    null
  };
}

function afficherResumeAbsence(resume) {
  const conteneur = document.getElementById("absence-contenu");
  if (!conteneur) return;
  conteneur.innerHTML = "";

  // MAX_AFK_SECONDS is the base cap. Rank 1 Camp Engineers extend the cap; rank 2 Camp Engineers increase the
  // effective AFK ratio. Both values are derived from the same live state used
  // by the catch-up simulation above. VITESSE_HORS_LIGNE is the base ratio.
  const maxAfkHeures = maxAfkSeconds() / 3600;
  const maxAfkLabel = Number.isInteger(maxAfkHeures)
    ? maxAfkHeures + "h"
    : formaterTemps(maxAfkSeconds());
  const ratioLabel = (ratioAfkHorsLigne() * 100).toLocaleString("en-US", {
    maximumFractionDigits: 2
  }) + "%";
  const parametres = document.createElement("div");
  parametres.className = "absence-regles";
  parametres.setAttribute("role", "note");
  parametres.textContent = "Max AFK : " + maxAfkLabel + " / Ratio : " + ratioLabel + " of real time";
  conteneur.appendChild(parametres);

  function ligne(label, valeur, iconeSrc) {
    const el = document.createElement("div");
    el.className = "absence-ligne";
    const lbl = document.createElement("span");
    lbl.className = "absence-libelle";
    if (iconeSrc) {
      const icone = document.createElement("img");
      icone.className = "absence-icone";
      icone.src = iconeSrc;
      icone.alt = "";
      lbl.appendChild(icone);
    }
    const texte = document.createElement("span");
    texte.textContent = label;
    lbl.appendChild(texte);
    const val = document.createElement("span");
    val.className   = "absence-val";
    val.textContent = valeur;
    el.appendChild(lbl);
    el.appendChild(val);
    conteneur.appendChild(el);
  }

  ligne("Time away", formaterTemps(resume.dureeReelleSec), "img/interface/Settings_Final.png");
  ligne("Game time applied", formaterTemps(resume.dureeSimuleeSec), "img/interface/Work_Final.png");

  const ressources = [
    ["Cardboard Planks", resume.cardboardPlanks, "img/resources/Cardboard Plank_Final.png"],
    ["Basic Wood Planks", resume.basicWoodPlanks, "img/resources/Basic Wood Plank_Final.png"],
    ["Pebble Bricks",    resume.pebbleBricks,    "img/resources/Pebble Brick_Final.png"],
    ["Rock Bricks",      resume.rockBricks,      "img/resources/Rock Brick_Final.png"],
    ["Catnip Salad",     resume.salads,          "img/resources/Catnip Salad_Final.png"],
    ["Grilled Anchovy",  resume.grilledAnchovy,  "img/resources/Grilled Anchovy_Final.png"]
  ];
  let produit = false;
  ressources.forEach(function(r) {
    if (r[1] > 0) { ligne(r[0], "+" + formaterNombre(r[1]), r[2]); produit = true; }
  });
  if (!produit) ligne("Production", "Nothing produced", "img/interface/Work_Final.png");

  if (resume.kittyAttrape) {
    const kitty = etat.kittiesData.find(function(k) { return k.nom === resume.kittyAttrape; });
    ligne("New cat", resume.kittyAttrape + " joined the gang!", kitty && kitty.visage ? kitty.visage : CAT_FACES.bernardo);
  }

  afficherModal("ecran-absence");
  if (arguments[1] && arguments[1].apresRechargement) return;
  verifierMiseAJourApresResumeAfk(resume);
}

function supprimerResumeAbsenceStocke() {
  try {
    sessionStorage.removeItem(AFK_RESUME_RELOAD_KEY);
  } catch (e) {}
}

function versionPublieePlusRecente(versionPubliee, versionCourante) {
  const formatVersion = /^\d+(?:\.\d+)*$/;
  if (!formatVersion.test(versionPubliee) || !formatVersion.test(versionCourante)) return false;
  const publiee = versionPubliee.split(".").map(Number);
  const courante = versionCourante.split(".").map(Number);
  const longueur = Math.max(publiee.length, courante.length);
  for (let i = 0; i < longueur; i++) {
    const segmentPublie = publiee[i] || 0;
    const segmentCourant = courante[i] || 0;
    if (segmentPublie !== segmentCourant) return segmentPublie > segmentCourant;
  }
  return false;
}

function miseAJourPublieeDisponible() {
  const url = new URL(VERSION_MANIFEST_PATH, window.location.href);
  url.searchParams.set("cacheBust", String(Date.now()));
  return fetch(url.href, { cache: "no-store" }).then(function(response) {
    if (!response.ok) return null;
    return response.json();
  }).then(function(manifest) {
    return !!manifest
      && typeof manifest.version === "string"
      && versionPublieePlusRecente(manifest.version, GAME_RELEASE_VERSION);
  }).catch(function() {
    // Offline play and hosts without the manifest remain fully usable.
    return false;
  });
}

function verifierMiseAJourApresResumeAfk(resume) {
  if (resumeAbsenceRechargeEffectue || afkReloadProgramme || verificationVersionAfkEnCours) return;
  try {
    sessionStorage.setItem(AFK_RESUME_RELOAD_KEY, JSON.stringify(resume));
  } catch (e) {
    // A reload would lose the summary if sessionStorage is unavailable.
    return;
  }

  verificationVersionAfkEnCours = true;
  miseAJourPublieeDisponible().then(function(disponible) {
    if (!disponible) {
      supprimerResumeAbsenceStocke();
      return;
    }
    afkReloadProgramme = true;
    setTimeout(rechargerPourMiseAJourAfk, 250);
  }).catch(function() {
    supprimerResumeAbsenceStocke();
  }).then(function() {
    verificationVersionAfkEnCours = false;
  });
}

function recupererResumeAbsenceApresRechargement() {
  try {
    const raw = sessionStorage.getItem(AFK_RESUME_RELOAD_KEY);
    if (!raw) return null;
    sessionStorage.removeItem(AFK_RESUME_RELOAD_KEY);
    const resume = JSON.parse(raw);
    return resume && typeof resume === "object" ? resume : null;
  } catch (e) {
    return null;
  }
}

function fermerResumeAbsenceEtRecharger() {
  fermerModal("ecran-absence");
  if (resumeAbsenceRechargeEffectue || !afkReloadProgramme) return;
  rechargerPourMiseAJourAfk();
}

function rechargerPourMiseAJourAfk() {
  if (afkNavigationLancee) return;
  afkNavigationLancee = true;
  sauvegarder();
  sauvegardeVerrouillee = true;
  const url = new URL(window.location.href);
  url.searchParams.set("app-refresh", String(Date.now()));
  window.location.replace(url.href);
}

let releaseNotesTimer = null;
let releaseNotesDeadline = 0;
let releaseNotesSuite = null;

function releaseNotesNecessaires() {
  return etat.releaseNotesSeenVersion !== GAME_RELEASE_VERSION;
}

function releaseNotesAutomatiquesPlaytestGitHub() {
  if (typeof location === "undefined") return false;
  const hostname = String(location.hostname || "").toLowerCase();
  const pathname = String(location.pathname || "").toLowerCase();
  return hostname === "xevyas.github.io"
    && /^\/cat-inc-v4-playtest(?:\/|$)/.test(pathname);
}

function releaseNotesAffichablesAuDemarrage(partieExistante) {
  return releaseNotesAutomatiquesPlaytestGitHub()
    && !!partieExistante
    && campDebloque()
    && releaseNotesNecessaires();
}

function mettreAJourCompteAReboursNotes() {
  const bouton = document.getElementById("release-notes-close");
  const compteur = document.getElementById("release-notes-countdown");
  const secondes = Math.max(0, Math.ceil((releaseNotesDeadline - Date.now()) / 1000));
  if (secondes > 0) {
    if (bouton) {
      bouton.disabled = true;
      bouton.textContent = "Continue in " + secondes + "s";
    }
    if (compteur) compteur.textContent = "Please read the changes. Continue in " + secondes + "s.";
    return;
  }
  if (releaseNotesTimer) {
    clearInterval(releaseNotesTimer);
    releaseNotesTimer = null;
  }
  if (bouton) {
    bouton.disabled = false;
    bouton.textContent = "Continue";
  }
  if (compteur) compteur.textContent = "You are all caught up with this release.";
}

function afficherNotesVersion(suite) {
  const el = document.getElementById("ecran-release-notes");
  const liste = document.getElementById("release-notes-list");
  const titre = document.getElementById("release-notes-title");
  if (!el || !liste) {
    if (typeof suite === "function") suite();
    return;
  }
  releaseNotesSuite = typeof suite === "function" ? suite : null;
  const currentRelease = GAME_CHANGELOG[0];
  const currentReleaseDate = currentRelease && currentRelease.date
    ? new Intl.DateTimeFormat("en-US", {
        year: "numeric", month: "long", day: "numeric"
      }).format(new Date(currentRelease.date + "T00:00:00"))
    : "";
  if (titre) {
    titre.textContent = "What's new in v" + GAME_RELEASE_VERSION
      + (currentReleaseDate ? " · " + currentReleaseDate : "");
  }
  liste.innerHTML = "";
  categoriesChangelogNonVides(GAME_RELEASE_NOTES).forEach(function(category) {
    const bloc = document.createElement("section");
    bloc.className = "release-notes-category";
    const titreCategorie = document.createElement("h3");
    titreCategorie.textContent = category.label;
    bloc.appendChild(titreCategorie);
    const listeCategorie = document.createElement("ul");
    category.changes.forEach(function(note) {
      const item = document.createElement("li");
      item.textContent = note;
      listeCategorie.appendChild(item);
    });
    bloc.appendChild(listeCategorie);
    liste.appendChild(bloc);
  });
  releaseNotesDeadline = Date.now() + 5000;
  mettreAJourCompteAReboursNotes();
  releaseNotesTimer = setInterval(mettreAJourCompteAReboursNotes, 250);
  ouvrirDialogueModal(el, { focusSelector: "#release-notes-close" });
}

function fermerNotesVersion() {
  if (Date.now() < releaseNotesDeadline) return;
  if (releaseNotesTimer) {
    clearInterval(releaseNotesTimer);
    releaseNotesTimer = null;
  }
  etat.releaseNotesSeenVersion = GAME_RELEASE_VERSION;
  sauvegarder();
  fermerDialogueModal("ecran-release-notes");
  const suite = releaseNotesSuite;
  releaseNotesSuite = null;
  if (suite) suite();
}


// ════════════════════════════════════════════════════════════
// 12. STORY MODALS
// ════════════════════════════════════════════════════════════

const DIALOGUE_DATA = CatInc.data.dialogues;
const STORIES = DIALOGUE_DATA.scenes.map(function(scene) {
  return Object.freeze({ id: scene.id, nom: scene.name, flag: scene.flag });
});
const STORY_ASSETS = DIALOGUE_DATA.scenes.reduce(function(index, scene) {
  if (scene.asset) index[scene.id] = scene.asset;
  return index;
}, {});

const CAMP_QUICK_DIALOGUES = Object.freeze({
  sawmillRepaired: "The Sawmill is ready. Mochi and Luna can now produce Cardboard Planks in Work.",
  firstPlank: "Good. The Sawmill works, and we finally have a proper building material.",
  firstBox: "We will run out of room quickly. It is time for the others to clear away the humans' junk.",
  catchenRepaired: "The Catchen is usable again. The others can start preparing Catnip Salad.",
  workerLevelTwo: "A stronger worker can handle the thorny brambles blocking the deeper garden.",
  pawsonryRepaired: "The Pawsonry is ready. We can finally turn gathered pebbles into proper bricks.",
  firstPebbleBrick: "A real Pebble Brick. Build an Operations Table and I can organize expeditions from the Camp.",
  catchenTierTwo: "The Fishing Guide is useful, but Grilled Anchovy needs a Tier 2 Catchen first.",
  pawsonryTierTwo: "The Stone Guide opens stronger masonry. Upgrade the Pawsonry to Tier 2 before producing Rock Bricks."
});

function progressionCamp() {
  return assurerEtatCampPrincipal().progression;
}

function mettreDialogueRapideCampEnFile(id) {
  if (!CAMP_QUICK_DIALOGUES[id]) return false;
  const progression = progressionCamp();
  if (progression.quickDialoguesSeen.includes(id)
      || progression.quickDialogueQueue.includes(id)) return false;
  progression.quickDialogueQueue.push(id);
  sauvegarder();
  renduDialogueRapideCamp();
  return true;
}

function renduDialogueRapideCamp() {
  const element = document.getElementById("camp-quick-dialogue");
  const copy = document.getElementById("camp-quick-dialogue-copy");
  if (!element || !copy || !etat || !etat.camp) return;
  const file = progressionCamp().quickDialogueQueue;
  const id = file.length ? file[0] : null;
  const texte = id && CAMP_QUICK_DIALOGUES[id];
  element.hidden = !texte;
  if (texte) copy.textContent = texte;
}

function fermerDialogueRapideCamp() {
  const progression = progressionCamp();
  const id = progression.quickDialogueQueue.shift();
  if (id && !progression.quickDialoguesSeen.includes(id)) {
    progression.quickDialoguesSeen.push(id);
  }
  sauvegarder();
  renduDialogueRapideCamp();
}

let manualFocusStoryApresRecruit = false;
const PROLOGUE_CATS = Object.freeze([
  Object.freeze({ name: "Bernardo", position: "center" }),
  Object.freeze({ name: "Mochi", position: "top-left" }),
  Object.freeze({ name: "Luna", position: "bottom-right" })
]);

function prologueCaptureEnCours() {
  return etat.chatons < 3 || (etat.chatons === 3 && !storyEstVue("story3TransitionVue"));
}

function definirModePrologue(actif) {
  if (!document.body) return;
  document.body.classList.toggle("prologue-actif", Boolean(actif));
}

function masquerCiblePrologue() {
  const stage = document.getElementById("prologue-capture-stage");
  if (!stage) return;
  stage.hidden = true;
  stage.setAttribute("aria-hidden", "true");
}

function afficherCiblePrologue() {
  if (!storyEstVue("introVue") || etat.chatons >= 3) return false;
  const stage = document.getElementById("prologue-capture-stage");
  const target = document.getElementById("prologue-cat-target");
  const face = document.getElementById("prologue-cat-face");
  const cat = PROLOGUE_CATS[etat.chatons];
  if (!stage || !target || !face || !cat) return false;
  definirModePrologue(true);
  target.classList.remove(
    "prologue-cat-target-center",
    "prologue-cat-target-top-left",
    "prologue-cat-target-bottom-right"
  );
  target.classList.add("prologue-cat-target-" + cat.position);
  const src = assurerVisageProchainChat();
  const appliquerCadrage = function() {
    face.classList.remove("camp-cat-face-normalized");
    ["width", "height", "left", "top", "transform"].forEach(function(property) {
      face.style[property] = "";
    });
    normaliserImageVisageCamp(face);
  };
  if (face.getAttribute("src") !== src) {
    face.addEventListener("load", appliquerCadrage, { once: true });
    face.setAttribute("src", src);
  } else {
    appliquerCadrage();
  }
  target.setAttribute("aria-label", "Catch " + cat.name);
  stage.hidden = false;
  stage.setAttribute("aria-hidden", "false");
  requestAnimationFrame(function() { target.focus({ preventScroll: true }); });
  return true;
}

function cliquerCiblePrologue() {
  if (etat.chatons >= 3 || _catCatchActif) return;
  masquerCiblePrologue();
  ouvrirMiniJeuCatch();
}

function fermerStoryPrologue(storyId) {
  fermerModal(storyId);
  afficherCiblePrologue();
}

function storyEstVue(flag) {
  return Array.isArray(etat.storiesVues) && etat.storiesVues.includes(flag);
}

function marquerStoryVue(flag) {
  if (!Array.isArray(etat.storiesVues)) etat.storiesVues = [];
  if (etat.storiesVues.includes(flag)) return false;
  etat.storiesVues.push(flag);
  sauvegarder();
  return true;
}

function renduStories() {
  const conteneur = document.getElementById("stories-liste");
  if (!conteneur) return;
  conteneur.innerHTML = "";
  let affichees = 0;
  STORIES.forEach(function(story) {
    if (!storyEstVue(story.flag)) return;
    if (story.id === "ecran-story-explorator") preparerStoryExplorator();
    affichees++;
    const carte = document.createElement("button");
    carte.className = "story-carte";
    carte.onclick = function() { afficherModal(story.id); };
    const asset = STORY_ASSETS[story.id];
    if (asset) {
      const img = document.createElement("img");
      img.className = asset.type === "icon" ? "story-carte-image story-carte-image-icon" : "story-carte-image";
      img.src = asset.src;
      img.alt = "";
      carte.appendChild(img);
    }
    const nom = document.createElement("span");
    nom.className   = "story-carte-nom";
    nom.textContent = story.nom;
    carte.appendChild(nom);
    conteneur.appendChild(carte);
  });
  if (affichees === 0) {
    conteneur.innerHTML = etatVideHtml("No stories unlocked", "Progress through the adventure to replay memorable scenes here.");
  }
}

function changerSousOngletLogs(vue) {
  ["log", "stories"].forEach(function(v) {
    const actif = v === vue;
    const panneau = document.getElementById("logs-vue-" + v);
    const bouton = document.getElementById("logs-subtab-" + v);
    panneau.style.display = actif ? "flex" : "none";
    panneau.setAttribute("aria-hidden", actif ? "false" : "true");
    bouton.classList.toggle("logs-subtab-actif", actif);
    bouton.setAttribute("aria-selected", actif ? "true" : "false");
    bouton.tabIndex = actif ? 0 : -1;
  });
  if (vue === "stories") renduStories();
}

function gererNavigationSousOngletsLogs(e) {
  if (!e.target.matches(".logs-subtab[role='tab']")) return;
  const onglets = Array.from(document.querySelectorAll("#logs-souscontenu .logs-subtab"));
  const index = onglets.indexOf(e.target);
  let suivant = null;
  if (e.key === "ArrowRight") suivant = (index + 1) % onglets.length;
  if (e.key === "ArrowLeft")  suivant = (index - 1 + onglets.length) % onglets.length;
  if (e.key === "Home") suivant = 0;
  if (e.key === "End")  suivant = onglets.length - 1;
  if (suivant === null) return;
  e.preventDefault();
  const cible = onglets[suivant];
  cible.focus();
  changerSousOngletLogs(cible.id.replace("logs-subtab-", ""));
}

document.getElementById("logs-souscontenu").addEventListener("keydown", gererNavigationSousOngletsLogs);

function fermerModal(id) { fermerDialogueModal(id); }

function fermerStoryAdventure() {
  fermerModal("ecran-story-3");
  if (storyEstVue("story3TransitionVue")) return;
  marquerStoryVue("story3TransitionVue");
  masquerCiblePrologue();
  preparerPremierAffichageCampPrototype();
  definirModePrologue(false);
  rendu();
  changerOnglet("camp");
  document.body.classList.add("camp-prologue-reveal");
  setTimeout(function() { document.body.classList.remove("camp-prologue-reveal"); }, 1300);
  setTimeout(function() {
    if (!progressionCamp().introCompleted) afficherModal("ecran-story-camp-intro");
  }, 500);
}

function terminerIntroCamp() {
  fermerModal("ecran-story-camp-intro");
  const progression = progressionCamp();
  progression.introCompleted = true;
  if (!storyEstVue("storyCampIntroVue")) marquerStoryVue("storyCampIntroVue");
  ajouterLog("unlock", "Sawmill repair unlocked. Bernardo now supervises the Camp.");
  sauvegarder();
  rendu();
  changerOnglet("camp");
}

function validerStoryJob() {
  fermerModal("ecran-story-6b");
  ouvrirDialogueModal("gang-leader-unlock-modal", {
    focusSelector: ".gang-leader-unlock-action"
  });
}

function allerVoirJobBernardo() {
  fermerDialogueModal("gang-leader-unlock-modal");
  const bernardoIndex = etat.kittiesData.findIndex(function(k) { return k.nom === "Bernardo"; });
  if (bernardoIndex < 0) return;

  kittySelectionnee = bernardoIndex;
  detailKittyMobileOuvert = true;
  changerOnglet("gang");
  renduManagement();

  setTimeout(function() {
    const job = document.getElementById("detail-job");
    if (!job) return;
    job.scrollIntoView({ behavior: "smooth", block: "center" });
    job.classList.remove("objectif-cible-highlight");
    void job.offsetWidth;
    job.classList.add("objectif-cible-highlight");
    setTimeout(function() { job.classList.remove("objectif-cible-highlight"); }, 1700);
  }, 80);
}

function preparerStoryExplorator(kittyIndex) {
  let index = Number.isInteger(kittyIndex) ? kittyIndex : -1;
  if (!etat.kittiesData[index] || etat.kittiesData[index].metier !== "explorator") {
    index = etat.kittiesData.findIndex(function(k) { return k.metier === "explorator"; });
  }
  if (index < 0) return;
  const kitty = etat.kittiesData[index];
  document.querySelectorAll("#ecran-story-explorator .story-explorator-speaker").forEach(function(el) {
    el.textContent = kitty.nom;
  });
  ecrireTexte(
    document.getElementById("story-explorator-unlock-copy"),
    kitty.nom + " is now an Explorator. You can explore the neighborhood using the map in the Explorations tab."
  );
  const asset = STORY_ASSETS["ecran-story-explorator"];
  asset.src = kitty.visage || CAT_FACES.bernardo;
  asset.alt = "Portrait of " + kitty.nom + ", the gang's first Explorator.";
}

function ouvrirCarteExplorationsDepuisStory(storyId) {
  fermerModal(storyId);
  explorationMobileVue = "map";
  carteDirty = true;
  exploTabDirty = true;
  changerOnglet("explorations");
  setTimeout(function() {
    const carte = document.getElementById("section-explo-map");
    if (!carte) return;
    carte.scrollIntoView({ behavior: "smooth", block: "start" });
    carte.classList.remove("objectif-cible-highlight");
    void carte.offsetWidth;
    carte.classList.add("objectif-cible-highlight");
    setTimeout(function() { carte.classList.remove("objectif-cible-highlight"); }, 1700);
  }, 80);
}

function ouvrirCarteDepuisStoryExplorator() {
  ouvrirCarteExplorationsDepuisStory("ecran-story-explorator");
}

function ouvrirCarteDepuisStoryGangRise() {
  fermerModal("ecran-story-5");
  changerOnglet("camp");
  setTimeout(function() {
    ouvrirCategorieCampPrototype("building");
    const cible = document.querySelector('[data-camp-category="building"]');
    if (!cible) return;
    cible.classList.remove("objectif-cible-highlight");
    void cible.offsetWidth;
    cible.classList.add("objectif-cible-highlight");
    setTimeout(function() { cible.classList.remove("objectif-cible-highlight"); }, 1700);
  }, 80);
}

function ouvrirManualFocusDepuisStory() {
  fermerModal("ecran-story-manual-focus");
  let cible = null;
  ["wood", "food", "rock"].some(function(familyId) {
    const slots = etat.workRecipeSlots[familyId] || [];
    let slotIdx = slots.findIndex(function(slot) { return slot.recipeId && slot.kittyIndex !== null; });
    if (slotIdx < 0) slotIdx = slots.findIndex(function(slot) { return !!slot.recipeId; });
    if (slotIdx < 0) return false;
    cible = { familyId: familyId, slotIdx: slotIdx };
    return true;
  });
  if (!cible) cible = { familyId: "wood", slotIdx: 0 };

  workFiltre = cible.familyId;
  changerOnglet("work");
  setTimeout(function() {
    const slot = domParId("recipe-slot-" + cible.familyId + "-" + cible.slotIdx);
    if (!slot) return;
    const slotData = slotRecette(cible.familyId, cible.slotIdx);
    const phase = phaseActiveRecette(slotData);
    const phaseCard = slot.querySelector('.work-recipe-resource[data-manual-phase="' + phase + '"]');
    const target = phaseCard || slot.querySelector(".work-recipe-selected, .work-recipe-choose-empty") || slot;
    target.scrollIntoView({ behavior: "smooth", block: "center" });
    target.classList.remove("objectif-cible-highlight");
    void target.offsetWidth;
    target.classList.add("objectif-cible-highlight");
    setTimeout(function() { target.classList.remove("objectif-cible-highlight"); }, 1700);
  }, 80);
}

function ouvrirMaisonDepuisStory() {
  ouvrirCarteExplorationsDepuisStory("ecran-story-house-evacuation");
}

function ouvrirMaisonVoisineGaucheDepuisStory() {
  fermerModal("ecran-story-left-house");
  carteZoneSelectionnee = "C1";
  explorationMobileVue = "map";
  carteDirty = true;
  exploTabDirty = true;
  changerOnglet("explorations");
  setTimeout(function() {
    const carte = document.getElementById("section-explo-map");
    if (!carte) return;
    carte.scrollIntoView({ behavior: "smooth", block: "start" });
    carte.classList.remove("objectif-cible-highlight");
    void carte.offsetWidth;
    carte.classList.add("objectif-cible-highlight");
    setTimeout(function() { carte.classList.remove("objectif-cible-highlight"); }, 1700);
  }, 80);
}

function allerEtudierSchoolGuideDepuisStory() {
  fermerModal("ecran-story-6a");
  resCategorieFiltree = "books";
  itemSelectionne = "schoolGuide";
  inventaireDirty = true;
  changerOnglet("inventaire");
  setTimeout(function() {
    const cible = document.getElementById("inv-item-action-schoolGuide-study") ||
      document.getElementById("inv-item-card-schoolGuide");
    if (!cible) return;
    cible.scrollIntoView({ behavior: "smooth", block: "center" });
    cible.classList.remove("objectif-cible-highlight");
    void cible.offsetWidth;
    cible.classList.add("objectif-cible-highlight");
    setTimeout(function() { cible.classList.remove("objectif-cible-highlight"); }, 1700);
  }, 80);
}

function fermerStoryBird() {
  fermerModal("ecran-story-bird");
  if (!_birdMiniJeuPending) return;
  _birdMiniJeuPending = false;
  var el = document.getElementById("bird-btn");
  if (el) el.style.display = "none";
  demarrerBirdMiniJeu();
}
function afficherModal(id) {
  const el = document.getElementById(id);
  if (!el) return;
  if (STORIES.some(function(s) { return s.id === id; })) {
    delete el.dataset.dialogueVoiceBeat;
    DIALOGUE_DATA.resetModal(el);
    jouerVoixBulleDialogue(el);
    if (["ecran-intro", "ecran-story-1", "ecran-story-2", "ecran-story-3"].includes(id)) {
      definirModePrologue(true);
      masquerCiblePrologue();
    }
  }
  if (id === "ecran-story-explorator") preparerStoryExplorator();
  const boite = el.querySelector(".intro-boite");
  const asset = STORY_ASSETS[id];
  const storyData = STORIES.find(function(s) { return s.id === id; });
  if (boite) {
    boite.setAttribute("role", "document");
    boite.tabIndex = -1;
    let img = boite.querySelector(".story-image, .story-image-icon");
    if (asset) {
      const cls = asset.type === "icon" ? "story-image-icon" : "story-image";
      if (!img || img.className !== cls) {
        if (img) img.remove();
        img = document.createElement("img");
        img.className = cls;
        boite.insertBefore(img, boite.firstChild);
      }
      img.src = asset.src;
      img.alt = asset.alt;
    } else if (img) {
      img.remove();
    }
    let titre = boite.querySelector(".story-modal-titre");
    if (storyData) {
      if (!titre) {
        titre = document.createElement("p");
        titre.className = "story-modal-titre";
        boite.insertBefore(titre, img ? img.nextSibling : boite.firstChild);
      }
      titre.id = id + "-titre";
      titre.textContent = storyData.nom;
      el.setAttribute("aria-labelledby", titre.id);
      el.removeAttribute("aria-label");
    } else if (titre) {
      titre.remove();
    }
  }
  if (!storyData) el.setAttribute("aria-label", id === "ecran-absence" ? "While you were away" : "Cat Inc story");
  ouvrirDialogueModal(el, { focusSelector: ".intro-boite" });
}

document.addEventListener("click", function(event) {
  const modal = event.target && event.target.closest
    ? event.target.closest('.ecran-intro[data-dialogue-hydrated="true"]')
    : null;
  if (!modal || modal.style.display === "none") return;
  if (event.target.closest("button, a, input, select, textarea, [role=button]")) return;
  if (DIALOGUE_DATA.advanceModal(modal)) {
    jouerVoixBulleDialogue(modal);
    event.preventDefault();
  }
});

document.addEventListener("keydown", function(event) {
  if (event.key !== " " && event.key !== "Enter") return;
  if (event.target && event.target.closest
      && event.target.closest("button, a, input, select, textarea, [role=button]")) return;
  const modal = dialogueOuvertAuPremierPlan();
  if (!modal || modal.dataset.dialogueHydrated !== "true") return;
  if (DIALOGUE_DATA.advanceModal(modal)) {
    jouerVoixBulleDialogue(modal);
    event.preventDefault();
  }
});

function verifierStoryModals() {
  if (etat.chatons === 1 && !storyEstVue("story1Vue")) {
    marquerStoryVue("story1Vue");
    afficherModal("ecran-story-1");
    renduStories();
  }
  if (etat.chatons === 2 && !storyEstVue("story2Vue")) {
    marquerStoryVue("story2Vue");
    afficherModal("ecran-story-2");
    renduStories();
  }
  if (etat.chatons === 3 && !storyEstVue("story3Vue")) {
    marquerStoryVue("story3Vue");
    afficherModal("ecran-story-3");
    renduStories();
  }
  if (etat.chatons >= 3 && storyEstVue("story3TransitionVue")
      && !progressionCamp().introCompleted
      && !document.querySelector(".ecran-intro[style*='display: flex']")) {
    afficherModal("ecran-story-camp-intro");
  }
  if (etat.chatons >= 4 && !storyEstVue("storyManualFocusVue") && !manualFocusStoryApresRecruit) {
    marquerStoryVue("storyManualFocusVue");
    afficherModal("ecran-story-manual-focus");
    renduStories();
  }
  if (etat.chatons >= 15 && !storyEstVue("storyHouseEvacuationVue")) {
    marquerStoryVue("storyHouseEvacuationVue");
    afficherModal("ecran-story-house-evacuation");
    renduStories();
  }
  if (etat.chatons >= 17 && !storyEstVue("storyLeftHouseEvacuationVue")) {
    marquerStoryVue("storyLeftHouseEvacuationVue");
    afficherModal("ecran-story-left-house");
    renduStories();
  }
}

document.getElementById("bouton-intro").addEventListener("click", function() {
  fermerModal("ecran-intro");
  marquerStoryVue("introVue");
  if (etat.chatons < 3) afficherCiblePrologue();
  sauvegarder();
  renduStories();
});


// ════════════════════════════════════════════════════════════
// 12e. BASE CAMP PLACEMENT PROTOTYPE (development mode only)
// ════════════════════════════════════════════════════════════

const CAMP_PROTOTYPE_STORAGE_KEY = V4_STORAGE_NAMESPACE + ".camp.layout.v2";
const CAMP_PROTOTYPE_LEGACY_STORAGE_KEY = V4_STORAGE_NAMESPACE + ".camp.layout.v1";
const CAMP_PROTOTYPE_TERRAIN_STORAGE_KEY = V4_STORAGE_NAMESPACE + ".camp.terrain.v4";
const CAMP_PROTOTYPE_DEMOLITIONS_STORAGE_KEY = V4_STORAGE_NAMESPACE + ".camp.demolitions.v1";
const CAMP_PROTOTYPE_TERRAIN_LEGACY_STORAGE_KEYS = [
  V4_STORAGE_NAMESPACE + ".camp.terrain.v3",
  V4_STORAGE_NAMESPACE + ".camp.terrain.v2",
  V4_STORAGE_NAMESPACE + ".camp.terrain.v1"
];
const CAMP_PROTOTYPE_ZOOM_STORAGE_KEY = V4_STORAGE_NAMESPACE + ".camp.zoom.v1";
const CAMP_PROTOTYPE_LONG_PRESS_MS = 450;
const CAMP_PROTOTYPE_LONG_PRESS_MOVE_TOLERANCE = 8;
const CAMP_PROTOTYPE_ZOOM_MIN = 0.75;
const CAMP_PROTOTYPE_ZOOM_MAX = 4;
const CAMP_PROTOTYPE_ZOOM_STEP = 0.25;
const CAMP_PROTOTYPE_WORK_FAMILY_BY_TYPE = Object.freeze({
  sawmill: "wood",
  catchen: "food",
  pawsonry: "rock"
});
const CAMP_PROTOTYPE_FUNCTION_BY_TYPE = Object.freeze({
  operationsTable: "explorations",
  jobCenter: "jobs",
  trainingCenter: "training",
  laboratory: "lab",
  storage: "inventory"
});
const CAMP_BUILDING_REPAIR_DURATIONS = Object.freeze({
  sawmill: 60,
  catchen: 10 * 60,
  pawsonry: 20 * 60
});
const CAMP_BUILDING_REPAIR_COSTS = Object.freeze({
  sawmill: Object.freeze({}),
  catchen: Object.freeze({ cardboardPlanks: 2 }),
  pawsonry: Object.freeze({ cardboardPlanks: 5 })
});
const CAMP_BUILDING_UPGRADE_TIERS = Object.freeze({
  sawmill: Object.freeze({
    2: Object.freeze({ duration: 10 * 60, costs: Object.freeze({ cardboardPlanks: 5, pebbleBricks: 2 }) })
  }),
  catchen: Object.freeze({
    2: Object.freeze({ duration: 15 * 60, costs: Object.freeze({ basicWoodPlanks: 5, pebbleBricks: 5 }) })
  }),
  pawsonry: Object.freeze({
    2: Object.freeze({ duration: 15 * 60, costs: Object.freeze({ basicWoodPlanks: 10, pebbleBricks: 10 }) })
  }),
  storage: Object.freeze({
    2: Object.freeze({ duration: 15 * 60, costs: Object.freeze({ basicWoodPlanks: 5, pebbleBricks: 5 }) })
  })
});
const CAMP_BUILDING_CONSTRUCTION_CONFIG = Object.freeze({
  operationsTable: Object.freeze({
    duration: 60,
    costs: Object.freeze({ cardboardPlanks: 2, pebbleBricks: 1 }),
    stateField: null
  }),
  jobCenter: Object.freeze({
    duration: 10 * 60,
    costs: Object.freeze({ pebbleBricks: 10, basicWoodPlanks: 1 }),
    stateField: "jobCenterConstruit"
  }),
  trainingCenter: Object.freeze({
    duration: 30 * 60,
    costs: Object.freeze({ rockBricks: 10, basicWoodPlanks: 20 }),
    stateField: "trainingCenterConstruit"
  }),
  laboratory: Object.freeze({
    duration: 60 * 60,
    costs: Object.freeze({ rockBricks: 100, basicWoodPlanks: 100 }),
    stateField: "laboratoryConstruit"
  }),
  storage: Object.freeze({
    duration: 2 * 60,
    costs: Object.freeze({ cardboardPlanks: 2 }),
    stateField: null
  })
});
const CAMP_HOUSE_CONSTRUCTION_DURATIONS = Object.freeze({
  cardboardBox: 5 * 60
});
const CAMP_PROTOTYPE_INITIAL_LAYOUT = Object.freeze([
  Object.freeze({
    uid: "camp-initial-sawmill",
    type: "sawmill",
    x: 10,
    y: 4,
    rotation: 0,
    tier: 1
  }),
  Object.freeze({
    uid: "camp-initial-catchen",
    type: "catchen",
    x: 11,
    y: 7,
    rotation: 270,
    tier: 1
  }),
  Object.freeze({
    uid: "camp-initial-pawsonry",
    type: "pawsonry",
    x: 6,
    y: 10,
    rotation: 0,
    tier: 1
  }),
  Object.freeze({
    uid: "camp-initial-tree",
    type: "tree",
    x: 8,
    y: 7,
    rotation: 0,
    tier: 1
  })
]);

function creerLayoutInitialCampPrototype() {
  return CAMP_PROTOTYPE_INITIAL_LAYOUT.map(function(item) {
    return Object.assign({}, item);
  });
}

function assurerBatimentsInitiauxCampPrototype(layout) {
  const source = Array.isArray(layout) ? layout.slice() : [];
  CAMP_PROTOTYPE_INITIAL_LAYOUT.forEach(function(initial) {
    if (source.some(function(item) { return item && item.type === initial.type; })) return;
    const dimensionsInitiales = dimensionsCampPrototype(initial.type, initial.rotation);
    const chevauche = source.some(function(item) {
      if (!item || !typeCampPrototype(item.type)) return false;
      const dimensionsItem = dimensionsCampPrototype(item.type, item.rotation);
      return initial.x < item.x + dimensionsItem.width
        && initial.x + dimensionsInitiales.width > item.x
        && initial.y < item.y + dimensionsItem.height
        && initial.y + dimensionsInitiales.height > item.y;
    });
    if (!chevauche) source.push(Object.assign({}, initial));
  });
  return source;
}

function migrerOrientationCatchenInitialeCampPrototype(layout) {
  return (Array.isArray(layout) ? layout : []).map(function(item) {
    if (
      !item
      || item.uid !== "camp-initial-catchen"
      || item.type !== "catchen"
      || item.x !== 11
      || item.y !== 7
      || campPrototypeApi.normaliserRotation(item.rotation) !== 90
    ) return item;
    return Object.assign({}, item, { rotation: 270 });
  });
}

let campPrototypeLayout = creerLayoutInitialCampPrototype();
let campPrototypeClotures = [];
let campPrototypeTerrain = campPrototypeApi.creerTerrainInitial();
let campPrototypeZoom = 1;
let campPrototypeTypeAPlacer = null;
let campPrototypeRotationAPlacer = 0;
let campPrototypeGommeRoutes = false;
let campPrototypeGommeClotures = false;
let campPrototypeSelectionUid = null;
let campPrototypePointeur = null;
let campPrototypeUidCompteur = 0;
let campPrototypeInitialise = false;
let campPrototypeCameraInitialisee = false;
let campPrototypeCadrageMobileInitialise = false;
let campPrototypeModeEdition = false;
let campPrototypeCategorieOuverte = null;
let campPrototypeInteractionUid = null;
let campPrototypePlacementEnCours = null;
let campPrototypeDemolitions = [];
let campPrototypeDemolitionObstacleUid = null;
let campPrototypeDemolitionTargetKind = null;
let campPrototypeRepairBuildingId = null;
let campPrototypeRepairUid = null;
let campPrototypeUpgradeUid = null;
let campPrototypeConstructionMaisonTypeId = null;
let campPrototypeConstructionBatimentTypeId = null;
let campPrototypeDerniereSecondeDemolition = null;
let campPrototypeDerniereActivationPointeur = 0;
let campPrototypeDerniereActivationItemPointeur = 0;
let campPrototypeMessage = "";
let campPrototypeAppuiProlongeTimer = null;
let campPrototypePincement = null;
let campPrototypeConnexionsCache = null;
const campPrototypeAssetsRotationPrecharges = new Map();

function assurerEtatCampPrincipal() {
  const base = stateCore.makeCampState();
  if (!etat.camp || typeof etat.camp !== "object" || Array.isArray(etat.camp)) {
    etat.camp = base;
    return etat.camp;
  }
  Object.keys(base).forEach(function(key) {
    if (etat.camp[key] === undefined) etat.camp[key] = base[key];
  });
  return etat.camp;
}

function synchroniserEtatCampDepuisPrototype() {
  const camp = assurerEtatCampPrincipal();
  camp.schemaVersion = 2;
  camp.layout = (Array.isArray(campPrototypeLayout) ? campPrototypeLayout : []).map(function(item) {
    return Object.assign({}, item);
  });
  camp.fences = (Array.isArray(campPrototypeClotures) ? campPrototypeClotures : []).map(function(edge) {
    return Object.assign({}, edge);
  });
  const terrain = campPrototypeApi.normaliserTerrain(campPrototypeTerrain);
  camp.terrain = {
    claimedZoneIds: terrain.claimedZoneIds.slice(),
    clearedCells: terrain.clearedCells.slice()
  };
  camp.demolitions = campPrototypeDemolitionsActives().map(function(demolition) {
    return Object.assign({}, demolition);
  });
  return camp;
}

function supprimerAncienStockageCampPrototype() {
  if (typeof localStorage === "undefined") return;
  const cles = [
    CAMP_PROTOTYPE_STORAGE_KEY,
    CAMP_PROTOTYPE_LEGACY_STORAGE_KEY,
    CAMP_PROTOTYPE_TERRAIN_STORAGE_KEY,
    CAMP_PROTOTYPE_DEMOLITIONS_STORAGE_KEY
  ].concat(CAMP_PROTOTYPE_TERRAIN_LEGACY_STORAGE_KEYS);
  try {
    cles.forEach(function(storageKey) { localStorage.removeItem(storageKey); });
  } catch (error) {}
}

function campDebloque() {
  return storyEstVue("story3Vue");
}

function reparationCampDebloquee(buildingId) {
  if (DEV_MODE) return true;
  if (buildingId === "sawmill") return progressionCamp().introCompleted;
  if (buildingId === "catchen") return progressionCamp().junkClearingUnlocked;
  if (buildingId === "pawsonry") {
    return progressionCamp().junkClearingUnlocked
      && etat.kittiesData.some(function(kitty) {
        return kitty && !estBernardoSuperviseur(kitty) && (Number(kitty.niveau) || 0) >= 2;
      });
  }
  return false;
}

function maisonCampDebloquee(typeId) {
  if (typeId === "cardboardBox") {
    return buildingsDebloques()
      || Object.values(etat.camp.houseConstructions || {}).some(function(construction) {
        return construction && construction.type === typeId;
      });
  }
  return false;
}

function constructionsMaisonsCampActives() {
  if (!etat.camp.houseConstructions || typeof etat.camp.houseConstructions !== "object") {
    return [];
  }
  return Object.keys(etat.camp.houseConstructions).map(function(uid) {
    const construction = etat.camp.houseConstructions[uid];
    const type = construction && typeCampPrototype(construction.type);
    return Object.assign({
      uid: uid,
      label: type ? type.label : "House"
    }, construction);
  });
}

function constructionMaisonCampPourItem(uid) {
  return etat.camp.houseConstructions && etat.camp.houseConstructions[uid]
    ? etat.camp.houseConstructions[uid]
    : null;
}

function constructionMaisonCampPourKitty(kittyIndex) {
  return constructionsMaisonsCampActives().find(function(construction) {
    return construction.kittyIndex === kittyIndex;
  }) || null;
}

function kittyIsBuildingCampHouse(kittyIndex) {
  return Boolean(constructionMaisonCampPourKitty(kittyIndex));
}

function nombreAssetsCampPlaces(typeId) {
  if (!Array.isArray(campPrototypeLayout)) return 0;
  return campPrototypeLayout.filter(function(item) {
    return item && item.type === typeId;
  }).length;
}

function coutMaisonCamp(typeId) {
  if (typeId === "cardboardBox") {
    return {
      cardboardPlanks: woodHouseCostForCount(nombreAssetsCampPlaces(typeId))
    };
  }
  return null;
}

function ressourcesMaisonCampSuffisantes(typeId) {
  const cout = coutMaisonCamp(typeId);
  return Boolean(cout && etat.cardboardPlanks >= (cout.cardboardPlanks || 0));
}

function kittyDisponibleConstructionMaisonCamp() {
  return etat.kittiesData.some(function(kitty, kittyIndex) {
    return kittyPeutExecuterTacheCamp(kittyIndex);
  });
}

function maisonCampConstructible(typeId) {
  return ressourcesMaisonCampSuffisantes(typeId)
    && kittyDisponibleConstructionMaisonCamp();
}

function normaliserConstructionsMaisonsCamp(claimKitty) {
  if (!etat.camp.houseConstructions || typeof etat.camp.houseConstructions !== "object") {
    etat.camp.houseConstructions = {};
    return true;
  }
  let changed = false;
  Object.keys(etat.camp.houseConstructions).forEach(function(uid) {
    const construction = etat.camp.houseConstructions[uid];
    const dureeAttendue = construction
      && CAMP_HOUSE_CONSTRUCTION_DURATIONS[construction.type];
    const valide = Boolean(
      typeof uid === "string"
      && uid
      && construction
      && maisonCampDebloquee(construction.type)
      && dureeAttendue
      && Number.isInteger(construction.kittyIndex)
      && Number.isFinite(construction.startTs)
      && Number.isFinite(construction.duree)
      && construction.duree > 0
      && Number.isFinite(construction.coutCardboardPlanks)
      && construction.coutCardboardPlanks >= 0
      && (typeof claimKitty !== "function" || claimKitty(construction.kittyIndex))
    );
    if (!valide) {
      delete etat.camp.houseConstructions[uid];
      changed = true;
      return;
    }
    if (construction.duree !== dureeAttendue) {
      construction.duree = dureeAttendue;
      changed = true;
    }
  });
  return changed;
}

function reconcilierMaisonsCampChargees() {
  let changed = false;
  const constructions = etat.camp.houseConstructions || {};
  Object.keys(constructions).forEach(function(uid) {
    const item = itemCampPrototype(uid);
    const construction = constructions[uid];
    if (item && construction && item.type === construction.type && item.construit !== true) return;
    if (construction && Number.isFinite(construction.coutCardboardPlanks)) {
      etat.cardboardPlanks += construction.coutCardboardPlanks;
    }
    delete constructions[uid];
    changed = true;
  });
  let boitesLegacyRestantes = etat.cathouses.length;
  campPrototypeLayout.forEach(function(item) {
    if (item.type !== "cardboardBox") return;
    if (item.construit === true) {
      boitesLegacyRestantes = Math.max(0, boitesLegacyRestantes - 1);
      return;
    }
    if (constructionMaisonCampPourItem(item.uid) || boitesLegacyRestantes <= 0) return;
    item.construit = true;
    boitesLegacyRestantes -= 1;
    changed = true;
  });
  return changed;
}

function terminerConstructionsMaisonsCamp(maintenant) {
  const timestamp = Number.isFinite(maintenant) ? maintenant : Date.now();
  const terminees = constructionsMaisonsCampActives().filter(function(construction) {
    return !construction.readyToClaim
      && (timestamp - construction.startTs) / 1000 >= construction.duree;
  });
  if (terminees.length === 0) return false;
  terminees.forEach(function(construction) {
    const job = etat.camp.houseConstructions[construction.uid];
    if (job) job.readyToClaim = true;
  });
  sauvegarder();
  if ((document.body.dataset.ongletActif || "gang") === "camp") renduCampPrototype();
  return true;
}

function validerConstructionMaisonCamp(uid) {
  const construction = constructionMaisonCampPourItem(uid);
  if (!construction || !construction.readyToClaim) return false;
  const item = itemCampPrototype(uid);
  if (!item || item.type !== construction.type) {
    etat.cardboardPlanks += construction.coutCardboardPlanks || 0;
    delete etat.camp.houseConstructions[uid];
    sauvegarder();
    return false;
  }
  item.construit = true;
  delete etat.camp.houseConstructions[uid];
  if (construction.type === "cardboardBox") etat.cathouses.push(Date.now());
  const kitty = etat.kittiesData[construction.kittyIndex];
  const type = typeCampPrototype(construction.type);
  const label = type ? type.label : "House";
  ajouterLog("event", (kitty ? kitty.nom : "A Cat") + " finished building "
    + label + " at Base Camp.");
  afficherNotification("📦 " + label + " built!");
  if (etat.cathouses.length >= 1) {
    assurerEtatCampPrincipal().progression.junkClearingUnlocked = true;
    if (!storyEstVue("story4Vue")) marquerStoryVue("story4Vue");
    mettreDialogueRapideCampEnFile("firstBox");
  }
  sauvegarderCampPrototype();
  verifierObjectifs();
  sauvegarder();
  rendu();
  renduCampPrototype();
  if ((document.body.dataset.ongletActif || "gang") === "gang") renduManagement();
  return true;
}

function constructionsBatimentsCampActives() {
  if (!etat.camp.constructions || typeof etat.camp.constructions !== "object") return [];
  return Object.keys(etat.camp.constructions).map(function(uid) {
    const construction = etat.camp.constructions[uid];
    const type = construction && typeCampPrototype(construction.type);
    return Object.assign({ uid: uid, label: type ? type.label : "Building" }, construction);
  });
}

function constructionBatimentCampPourItem(uid) {
  return etat.camp.constructions && etat.camp.constructions[uid]
    ? etat.camp.constructions[uid]
    : null;
}

function constructionBatimentCampPourKitty(kittyIndex) {
  return constructionsBatimentsCampActives().find(function(construction) {
    return construction.kittyIndex === kittyIndex;
  }) || null;
}

function kittyIsBuildingCampBuilding(kittyIndex) {
  return Boolean(constructionBatimentCampPourKitty(kittyIndex));
}

function contenuBatimentCampDebloque(typeId) {
  if (typeId === "operationsTable") return operationsTableDebloquee();
  if (typeId === "jobCenter") return jobCenterDebloquee();
  if (typeId === "trainingCenter") return trainingCenterDebloquee();
  if (typeId === "laboratory") return laboratoryDebloquee();
  if (typeId === "storage") return inventaireDebloque();
  return false;
}

function batimentCampDejaPossede(typeId) {
  const config = CAMP_BUILDING_CONSTRUCTION_CONFIG[typeId];
  return Boolean(config && config.stateField && etat[config.stateField]);
}

function batimentFonctionnelCamp(typeId) {
  const item = itemCampPrototypeParType(typeId);
  return capaciteBatimentCamp(typeId, 1, {
    item: item,
    contentUnlocked: contenuBatimentCampDebloque(typeId)
  });
}

function normaliserConstructionsBatimentsCamp(claimKitty) {
  if (!etat.camp.constructions || typeof etat.camp.constructions !== "object") {
    etat.camp.constructions = {};
    return true;
  }
  let changed = false;
  Object.keys(etat.camp.constructions).forEach(function(uid) {
    const construction = etat.camp.constructions[uid];
    const config = construction && CAMP_BUILDING_CONSTRUCTION_CONFIG[construction.type];
    const validCosts = Boolean(config && construction.costs
      && Object.keys(config.costs).every(function(resourceId) {
        return Number(construction.costs[resourceId]) === Number(config.costs[resourceId]);
      }));
    const valide = Boolean(
      typeof uid === "string" && uid
      && construction && config
      && Number.isInteger(construction.kittyIndex)
      && Number.isFinite(construction.startTs)
      && construction.duration === config.duration
      && validCosts
      && (typeof claimKitty !== "function" || claimKitty(construction.kittyIndex))
    );
    if (!valide) {
      delete etat.camp.constructions[uid];
      changed = true;
    }
  });
  return changed;
}

function reconcilierConstructionsBatimentsCampChargees() {
  let changed = false;
  constructionsBatimentsCampActives().forEach(function(construction) {
    const item = itemCampPrototype(construction.uid);
    if (item && item.type === construction.type && item.construit === false) return;
    Object.keys(construction.costs || {}).forEach(function(resourceId) {
      if (typeof etat[resourceId] === "number") etat[resourceId] += Number(construction.costs[resourceId]) || 0;
    });
    delete etat.camp.constructions[construction.uid];
    changed = true;
  });
  Object.keys(CAMP_BUILDING_CONSTRUCTION_CONFIG).forEach(function(typeId) {
    const item = itemCampPrototypeParType(typeId);
    const config = CAMP_BUILDING_CONSTRUCTION_CONFIG[typeId];
    if (!item || constructionBatimentCampPourItem(item.uid)) return;
    if (item.construit === true && config.stateField && !etat[config.stateField]) {
      etat[config.stateField] = true;
      changed = true;
    } else if (batimentCampDejaPossede(typeId) && item.construit !== true) {
      item.construit = true;
      changed = true;
    }
  });
  return changed;
}

function terminerConstructionsBatimentsCamp(maintenant) {
  const timestamp = Number.isFinite(maintenant) ? maintenant : Date.now();
  const terminees = constructionsBatimentsCampActives().filter(function(construction) {
    return !construction.readyToClaim
      && (timestamp - construction.startTs) / 1000 >= construction.duration;
  });
  if (terminees.length === 0) return false;
  terminees.forEach(function(construction) {
    const job = etat.camp.constructions[construction.uid];
    if (job) job.readyToClaim = true;
  });
  sauvegarder();
  if ((document.body.dataset.ongletActif || "gang") === "camp") renduCampPrototype();
  return true;
}

function validerConstructionBatimentCamp(uid) {
  const construction = constructionBatimentCampPourItem(uid);
  if (!construction || !construction.readyToClaim) return false;
  const item = itemCampPrototype(uid);
  const config = CAMP_BUILDING_CONSTRUCTION_CONFIG[construction.type];
  if (!item || item.type !== construction.type || !config) {
    Object.keys(construction.costs || {}).forEach(function(resourceId) {
      if (typeof etat[resourceId] === "number") etat[resourceId] += Number(construction.costs[resourceId]) || 0;
    });
    delete etat.camp.constructions[uid];
    sauvegarder();
    return false;
  }
  item.construit = true;
  if (config.stateField) etat[config.stateField] = true;
  if (construction.type === "operationsTable") {
    assurerEtatCampPrincipal().progression.operationsTableUnlocked = true;
  }
  if (construction.type === "jobCenter") {
    etat.managersDebloques = true;
    jcDirty = true;
  }
  if (construction.type === "laboratory") labDirty = true;
  delete etat.camp.constructions[uid];
  const kitty = etat.kittiesData[construction.kittyIndex];
  const type = typeCampPrototype(construction.type);
  ajouterLog("event", (kitty ? kitty.nom : "A Cat") + " finished building "
    + (type ? type.label : construction.type) + " at Base Camp.");
  afficherNotification((type ? type.label : construction.type) + " built!");
  sauvegarderCampPrototype();
  sauvegarder();
  rendu();
  renduCampPrototype();
  if ((document.body.dataset.ongletActif || "gang") === "gang") renduManagement();
  return true;
}

function batimentCampRepare(buildingId) {
  return Array.isArray(etat.camp.repairedBuildingIds)
    && etat.camp.repairedBuildingIds.includes(buildingId);
}

function reparationCampPourBatiment(buildingId) {
  const reparations = etat.camp.repairs;
  return reparations && reparations[buildingId] ? reparations[buildingId] : null;
}

function coutsReparationCamp(buildingId) {
  return CAMP_BUILDING_REPAIR_COSTS[buildingId] || Object.freeze({});
}

function reparationCampAbordable(buildingId) {
  return Object.keys(coutsReparationCamp(buildingId)).every(function(resourceId) {
    return (Number(etat[resourceId]) || 0) >= coutsReparationCamp(buildingId)[resourceId];
  });
}

function libelleCoutReparationCamp(buildingId) {
  const couts = coutsReparationCamp(buildingId);
  const morceaux = Object.keys(couts).map(function(resourceId) {
    return couts[resourceId] + " " + libelleRessourceCamp(resourceId);
  });
  return morceaux.length ? morceaux.join(" · ") : "No resource cost";
}

function reparationsCampActives() {
  if (!etat.camp.repairs || typeof etat.camp.repairs !== "object") return [];
  return Object.keys(etat.camp.repairs).map(function(buildingId) {
    const reparation = etat.camp.repairs[buildingId];
    const type = typeCampPrototype(buildingId);
    return Object.assign({
      buildingId: buildingId,
      label: type ? type.label : buildingId
    }, reparation);
  });
}

function reparationCampPourKitty(kittyIndex) {
  return reparationsCampActives().find(function(reparation) {
    return reparation.kittyIndex === kittyIndex;
  }) || null;
}

function kittyIsRepairingCamp(kittyIndex) {
  return Boolean(reparationCampPourKitty(kittyIndex));
}

function normaliserReparationsCamp(claimKitty) {
  if (!etat.camp.repairs || typeof etat.camp.repairs !== "object") {
    etat.camp.repairs = {};
    return true;
  }
  let changed = false;
  Object.keys(etat.camp.repairs).forEach(function(buildingId) {
    const reparation = etat.camp.repairs[buildingId];
    const dureeAttendue = CAMP_BUILDING_REPAIR_DURATIONS[buildingId];
    const valide = Boolean(
      dureeAttendue
      && !batimentCampRepare(buildingId)
      && reparation
      && Number.isInteger(reparation.kittyIndex)
      && Number.isFinite(reparation.startTs)
      && Number.isFinite(reparation.duree)
      && reparation.duree > 0
      && (typeof claimKitty !== "function" || claimKitty(reparation.kittyIndex))
    );
    if (!valide) {
      delete etat.camp.repairs[buildingId];
      changed = true;
      return;
    }
    if (reparation.duree !== dureeAttendue) {
      reparation.duree = dureeAttendue;
      changed = true;
    }
  });
  return changed;
}

function terminerReparationsCamp(maintenant) {
  const timestamp = Number.isFinite(maintenant) ? maintenant : Date.now();
  const terminees = reparationsCampActives().filter(function(reparation) {
    return !reparation.readyToClaim
      && (timestamp - reparation.startTs) / 1000 >= reparation.duree;
  });
  if (terminees.length === 0) return false;
  terminees.forEach(function(reparation) {
    const job = etat.camp.repairs[reparation.buildingId];
    if (job) job.readyToClaim = true;
  });
  sauvegarder();
  if ((document.body.dataset.ongletActif || "gang") === "camp") renduCampPrototype();
  return true;
}

function validerReparationCamp(buildingId) {
  const reparation = reparationCampPourBatiment(buildingId);
  if (!reparation || !reparation.readyToClaim) return false;
  if (!Array.isArray(etat.camp.repairedBuildingIds)) etat.camp.repairedBuildingIds = [];
  if (!etat.camp.repairedBuildingIds.includes(buildingId)) {
    etat.camp.repairedBuildingIds.push(buildingId);
  }
  delete etat.camp.repairs[buildingId];
  const kitty = etat.kittiesData[reparation.kittyIndex];
  const type = typeCampPrototype(buildingId);
  const label = type ? type.label : buildingId;
  ajouterLog("event", (kitty ? kitty.nom : "A Cat") + " finished repairing "
    + label + " at Base Camp.");
  afficherNotification("🔧 " + label + " repaired! "
    + (buildingId === "sawmill" ? "Wood Work unlocked." : ""));
  if (buildingId === "sawmill") {
    mettreDialogueRapideCampEnFile("sawmillRepaired");
    planifierOiseau();
    // Cat 4 only starts approaching after the repaired Sawmill is explicitly
    // validated, so the following Manual Focus story always has usable Work.
    if (!etat.sequenceEnCours && etat.chatons === 3) demarrerRechargeCatch();
  }
  if (buildingId === "catchen") mettreDialogueRapideCampEnFile("catchenRepaired");
  if (buildingId === "pawsonry") mettreDialogueRapideCampEnFile("pawsonryRepaired");
  sauvegarder();
  rendu();
  renduCampPrototype();
  if ((document.body.dataset.ongletActif || "gang") === "gang") renduManagement();
  return true;
}

function ameliorationsCampActives() {
  if (!etat.camp.upgrades || typeof etat.camp.upgrades !== "object") return [];
  return Object.keys(etat.camp.upgrades).map(function(uid) {
    return Object.assign({ uid: uid }, etat.camp.upgrades[uid]);
  });
}

function ameliorationCampPourItem(uid) {
  return etat.camp.upgrades && etat.camp.upgrades[uid]
    ? etat.camp.upgrades[uid]
    : null;
}

function ameliorationCampPourKitty(kittyIndex) {
  return ameliorationsCampActives().find(function(amelioration) {
    return amelioration.kittyIndex === kittyIndex;
  }) || null;
}

function kittyIsUpgradingCamp(kittyIndex) {
  return Boolean(ameliorationCampPourKitty(kittyIndex));
}

function configurationAmeliorationCamp(typeId, targetTier) {
  const tiers = CAMP_BUILDING_UPGRADE_TIERS[typeId];
  return tiers && tiers[targetTier] ? tiers[targetTier] : null;
}

function normaliserAmeliorationsCamp(claimKitty) {
  if (!etat.camp.upgrades || typeof etat.camp.upgrades !== "object") {
    etat.camp.upgrades = {};
    return true;
  }
  let changed = false;
  Object.keys(etat.camp.upgrades).forEach(function(uid) {
    const job = etat.camp.upgrades[uid];
    const config = job && configurationAmeliorationCamp(job.type, job.targetTier);
    const costs = config && config.costs;
    const validCosts = Boolean(job && job.costs && Object.keys(costs || {}).every(function(resourceId) {
      return Number(job.costs[resourceId]) === Number(costs[resourceId]);
    }));
    const valide = Boolean(
      typeof uid === "string" && uid
      && job
      && config
      && Number.isInteger(job.kittyIndex)
      && Number.isInteger(job.startTier)
      && job.targetTier === job.startTier + 1
      && Number.isFinite(job.startTs)
      && Number.isFinite(job.duration)
      && job.duration === config.duration
      && validCosts
      && (typeof claimKitty !== "function" || claimKitty(job.kittyIndex))
    );
    if (!valide) {
      delete etat.camp.upgrades[uid];
      changed = true;
    }
  });
  return changed;
}

function reconcilierAmeliorationsCampChargees() {
  let changed = false;
  ameliorationsCampActives().forEach(function(job) {
    const item = itemCampPrototype(job.uid);
    if (item && item.type === job.type && (item.tier || 1) === job.startTier) return;
    Object.keys(job.costs || {}).forEach(function(resourceId) {
      if (typeof etat[resourceId] === "number") etat[resourceId] += Number(job.costs[resourceId]) || 0;
    });
    delete etat.camp.upgrades[job.uid];
    changed = true;
  });
  return changed;
}

function terminerAmeliorationsCamp(maintenant) {
  const timestamp = Number.isFinite(maintenant) ? maintenant : Date.now();
  const terminees = ameliorationsCampActives().filter(function(job) {
    return !job.readyToClaim && (timestamp - job.startTs) / 1000 >= job.duration;
  });
  if (terminees.length === 0) return false;
  terminees.forEach(function(job) {
    const upgrade = etat.camp.upgrades[job.uid];
    if (upgrade) upgrade.readyToClaim = true;
  });
  sauvegarder();
  if ((document.body.dataset.ongletActif || "gang") === "camp") renduCampPrototype();
  return true;
}

function validerAmeliorationCamp(uid) {
  const job = ameliorationCampPourItem(uid);
  if (!job || !job.readyToClaim) return false;
  const item = itemCampPrototype(uid);
  if (!item || item.type !== job.type || (item.tier || 1) !== job.startTier) {
    Object.keys(job.costs || {}).forEach(function(resourceId) {
      if (typeof etat[resourceId] === "number") etat[resourceId] += Number(job.costs[resourceId]) || 0;
    });
    delete etat.camp.upgrades[uid];
    sauvegarder();
    return false;
  }
  item.tier = job.targetTier;
  delete etat.camp.upgrades[uid];
  const kitty = etat.kittiesData[job.kittyIndex];
  const type = typeCampPrototype(job.type);
  ajouterLog("event", (kitty ? kitty.nom : "A Cat") + " upgraded "
    + (type ? type.label : job.type) + " to Tier " + job.targetTier + ".");
  afficherNotification((type ? type.label : job.type) + " reached Tier " + job.targetTier + "!");
  sauvegarderCampPrototype();
  sauvegarder();
  rendu();
  renduCampPrototype();
  if ((document.body.dataset.ongletActif || "gang") === "gang") renduManagement();
  return true;
}

function typeCampPrototype(typeId) {
  return campPrototypeApi.ITEM_TYPES[typeId] || null;
}

function categorieCampPrototypeAccessible(categorie) {
  return categorie === "house"
    || categorie === "fence"
    || (categorie === "building" && batimentCampDisponiblePlacement())
    || (DEV_MODE && ["building", "decoration", "road", "junk", "terrain", "dev-library"].includes(categorie));
}

function batimentWorkRecupereDisponible(typeId) {
  const disponibles = {
    sawmill: campDebloque(),
    catchen: grasscattingDebloquee(),
    pawsonry: pebblegatheringDebloquee()
  };
  if (typeId) {
    return Boolean(disponibles[typeId] && !itemCampPrototypeParType(typeId));
  }
  return Object.keys(disponibles).some(function(id) {
    return disponibles[id] && !itemCampPrototypeParType(id);
  });
}

function batimentCampDisponiblePlacement(typeId) {
  if (typeId) {
    return batimentWorkRecupereDisponible(typeId)
      || Boolean(CAMP_BUILDING_CONSTRUCTION_CONFIG[typeId]
        && contenuBatimentCampDebloque(typeId)
        && (typeId === "storage" || !itemCampPrototypeParType(typeId)));
  }
  return batimentWorkRecupereDisponible()
    || Object.keys(CAMP_BUILDING_CONSTRUCTION_CONFIG).some(function(id) {
      return contenuBatimentCampDebloque(id) && (id === "storage" || !itemCampPrototypeParType(id));
    });
}

function typeCampPrototypeModifiable(typeId) {
  const type = typeCampPrototype(typeId);
  const item = itemCampPrototypeParType(typeId);
  const verrouilleParReparation = Boolean(
    CAMP_BUILDING_REPAIR_DURATIONS[typeId]
    && item
    && !batimentCampRepare(typeId)
  );
  return Boolean(
    type
    && type.id !== "tree"
    && !verrouilleParReparation
    && (DEV_MODE || type.category === "house" || Boolean(CAMP_PROTOTYPE_WORK_FAMILY_BY_TYPE[type.id])
      || Boolean(CAMP_BUILDING_CONSTRUCTION_CONFIG[type.id]))
  );
}

function invaliderConnexionsCampPrototype() {
  campPrototypeConnexionsCache = null;
}

function connexionsCampPrototypeActuelles() {
  if (!campPrototypeConnexionsCache) {
    campPrototypeConnexionsCache = campPrototypeApi.evaluerConnexionsLayout(
      campPrototypeLayout,
      campPrototypeTerrain
    );
  }
  return campPrototypeConnexionsCache;
}

function itemCampPrototypeParType(typeId) {
  return campPrototypeLayout.find(function(item) {
    return item && item.type === typeId;
  }) || null;
}

function capaciteBatimentCamp(typeId, requiredTier, options) {
  const config = options && typeof options === "object" ? options : {};
  const type = typeCampPrototype(typeId);
  const item = config.item || itemCampPrototypeParType(typeId);
  const connexions = connexionsCampPrototypeActuelles();
  const repairRequired = Boolean(CAMP_BUILDING_REPAIR_DURATIONS[typeId]);
  return campCapabilitiesApi.evaluer({
    contentUnlocked: config.contentUnlocked !== false,
    item: item,
    label: type ? type.label : (config.label || "This building"),
    repaired: repairRequired ? batimentCampRepare(typeId) : true,
    repairing: Boolean(reparationCampPourBatiment(typeId)),
    constructing: Boolean(item && (
      constructionMaisonCampPourItem(item.uid)
      || constructionBatimentCampPourItem(item.uid)
    )),
    upgrading: Boolean(item && etat.camp.upgrades && etat.camp.upgrades[item.uid]),
    connection: item && connexions.byItem ? connexions.byItem[item.uid] : null,
    accessRequired: Boolean(type && type.access),
    requiredTier: requiredTier
  });
}

const CAMP_STORAGE_BASE_CAPACITY = 5;
const CAMP_STORAGE_CAPACITY_PER_TIER = 10;
const CAMP_STORAGE_RESOURCE_IDS = Object.freeze([
  "cardboardPieces", "basicWood", "catnip", "pebbles", "rocks",
  "cardboardPlanks", "basicWoodPlanks", "pebbleBricks", "rockBricks",
  "salads", "anchovy", "grilledAnchovy", "humanLeftovers",
  "humanWorkersFood"
]);

function ressourceSoumiseStockage(resourceId) {
  return CAMP_STORAGE_RESOURCE_IDS.includes(resourceId);
}

function stockagesCampActifs() {
  if (!inventaireDebloque()) return [];
  return campPrototypeLayout.filter(function(item) {
    return item && item.type === "storage"
      && capaciteBatimentCamp("storage", item.tier || 1, {
        item: item,
        contentUnlocked: true
      }).available;
  });
}

function capaciteStockageCamp() {
  return CAMP_STORAGE_BASE_CAPACITY + stockagesCampActifs().reduce(function(total, item) {
    return total + CAMP_STORAGE_CAPACITY_PER_TIER * Math.max(1, Number(item.tier) || 1);
  }, 0);
}

function etatStockageRessource(resourceId) {
  const stock = Math.max(0, Number(etat[resourceId]) || 0);
  const capacite = capaciteStockageCamp();
  return {
    stock: stock,
    capacite: capacite,
    plein: ressourceSoumiseStockage(resourceId) && stock >= capacite,
    depasse: ressourceSoumiseStockage(resourceId) && stock > capacite
  };
}

function autoriserEntreeStockageRecompenses(recompenses) {
  const ajouts = {};
  (Array.isArray(recompenses) ? recompenses : []).forEach(function(entry) {
    if (!entry || !ressourceSoumiseStockage(entry.recompense)) return;
    ajouts[entry.recompense] = (ajouts[entry.recompense] || 0)
      + Math.max(0, Number(entry.qty) || 0);
  });
  const bloquee = Object.keys(ajouts).find(function(resourceId) {
    const stockage = etatStockageRessource(resourceId);
    return stockage.stock + ajouts[resourceId] > stockage.capacite;
  });
  if (!bloquee) return true;
  const stockage = etatStockageRessource(bloquee);
  const label = RESOURCE_DISPLAY_NAMES[bloquee] || bloquee;
  afficherNotification("Storage full for " + label + " ("
    + formaterNombre(stockage.stock) + " / " + formaterNombre(stockage.capacite)
    + "). The reward is still waiting.");
  return false;
}

function itemCampPrototype(uid) {
  return campPrototypeLayout.find(function(item) { return item.uid === uid; }) || null;
}

function obstacleCampPrototypeActif(uid) {
  return campPrototypeApi.obstaclesTerrain(campPrototypeTerrain).find(function(obstacle) {
    return obstacle.uid === uid;
  }) || null;
}

function cibleDemolitionCampPrototype(uid, targetKind) {
  const kind = targetKind === "layout" ? "layout" : "terrain";
  if (kind === "terrain") {
    const obstacle = obstacleCampPrototypeActif(uid);
    if (!obstacle) return null;
    return {
      kind: "terrain",
      uid: obstacle.uid,
      label: obstacle.label,
      x: obstacle.x,
      y: obstacle.y,
      width: obstacle.width,
      height: obstacle.height,
      cells: obstacle.cells,
      minCatLevel: obstacle.minCatLevel,
      reward: obstacle.reward || null,
      obstacle: obstacle
    };
  }
  const item = itemCampPrototype(uid);
  const type = item && typeCampPrototype(item.type);
  if (!item || !type || type.category !== "junk") return null;
  const dimensions = dimensionsCampPrototype(item.type, item.rotation);
  return {
    kind: "layout",
    uid: item.uid,
    label: type.label,
    x: item.x,
    y: item.y,
    width: dimensions.width,
    height: dimensions.height,
    cells: campPrototypeApi.cellulesRectangle({
      x: item.x,
      y: item.y,
      width: dimensions.width,
      height: dimensions.height
    }),
    minCatLevel: Number(type.minCatLevel) || 0,
    reward: item.reward || type.reward || null,
    item: item
  };
}

function nettoyageJunksDebloque() {
  const progression = assurerEtatCampPrincipal().progression;
  return Boolean(DEV_MODE || (progression && progression.junkClearingUnlocked));
}

function cellulesAdjacentesRectangleCamp(cible) {
  if (!cible) return [];
  const cellulesCible = new Set((cible.cells || campPrototypeApi.cellulesRectangle(cible)).map(function(cellule) {
    return campPrototypeApi.cleCellule(cellule.x, cellule.y);
  }));
  const voisines = new Map();
  cellulesCible.forEach(function(cle) {
    const parties = cle.split(":").map(Number);
    [
      { x: parties[0], y: parties[1] - 1 },
      { x: parties[0] + 1, y: parties[1] },
      { x: parties[0], y: parties[1] + 1 },
      { x: parties[0] - 1, y: parties[1] }
    ].forEach(function(cellule) {
      if (!campPrototypeApi.celluleDansGrille(cellule.x, cellule.y)) return;
      const cleVoisine = campPrototypeApi.cleCellule(cellule.x, cellule.y);
      if (!cellulesCible.has(cleVoisine)) voisines.set(cleVoisine, cellule);
    });
  });
  return Array.from(voisines.values());
}

function cibleAccessibleDepuisCamp(cible) {
  if (!cible) return false;
  const atteignables = new Set(connexionsCampPrototypeActuelles().reachableCellKeys || []);
  return cellulesAdjacentesRectangleCamp(cible).some(function(cellule) {
    return atteignables.has(campPrototypeApi.cleCellule(cellule.x, cellule.y));
  });
}

function itemAccessibleDepuisCamp(item) {
  const type = item && typeCampPrototype(item.type);
  if (!item || !type) return false;
  const connexions = connexionsCampPrototypeActuelles();
  const connexion = connexions.byItem && connexions.byItem[item.uid];
  if (type.access && connexion) return connexion.active;
  const dimensions = dimensionsCampPrototype(item.type, item.rotation);
  return cibleAccessibleDepuisCamp({
    x: item.x,
    y: item.y,
    width: dimensions.width,
    height: dimensions.height,
    cells: campPrototypeApi.cellulesRectangle({
      x: item.x,
      y: item.y,
      width: dimensions.width,
      height: dimensions.height
    })
  });
}

function decorationAccessibleDepuisCamp(item) {
  const type = item && typeCampPrototype(item.type);
  if (!item || !type || type.category !== "decoration" || item.construit === false) return false;
  const layoutBloquant = campPrototypeLayout.filter(function(entry) {
    if (!entry) return false;
    const entryType = typeCampPrototype(entry.type);
    return entry.uid === item.uid || Boolean(entryType && entryType.category === "junk");
  });
  const atteignables = new Set(
    campPrototypeApi.evaluerConnexionsLayout(layoutBloquant, campPrototypeTerrain).reachableCellKeys || []
  );
  const dimensions = dimensionsCampPrototype(item.type, item.rotation);
  return cellulesAdjacentesRectangleCamp({
    x: item.x,
    y: item.y,
    width: dimensions.width,
    height: dimensions.height,
    cells: campPrototypeApi.cellulesRectangle({
      x: item.x,
      y: item.y,
      width: dimensions.width,
      height: dimensions.height
    })
  }).some(function(cellule) {
    return atteignables.has(campPrototypeApi.cleCellule(cellule.x, cellule.y));
  });
}

function niveauMinimumCibleDemolition(cible) {
  if (!cible) return 0;
  if (Number.isFinite(cible.minCatLevel)) return Math.max(0, cible.minCatLevel);
  const type = cible.item && typeCampPrototype(cible.item.type);
  return Math.max(0, Number(type && type.minCatLevel) || 0);
}

function peutDemolirCibleCampPrototype(cible) {
  if (!cible) return { valide: false, raison: "This debris is no longer available." };
  if (!nettoyageJunksDebloque()) {
    return { valide: false, raison: "Build the first Cardboard Box before clearing junk." };
  }
  if (cible.kind === "terrain") {
    const resultatTerrain = campPrototypeApi.peutDebroussailler(
      campPrototypeTerrain,
      cible.x,
      cible.y
    );
    if (!resultatTerrain.valide) return resultatTerrain;
    return cibleAccessibleDepuisCamp(cible)
      ? { valide: true, raison: "", obstacle: cible }
      : { valide: false, raison: "This junk is not reachable from the camp yet." };
  }
  if (!cibleDemolitionCampPrototype(cible.uid, "layout")) {
    return { valide: false, raison: "This debris is no longer available." };
  }
  return cibleAccessibleDepuisCamp(cible)
    ? { valide: true, raison: "", cible: cible }
    : { valide: false, raison: "This junk is not reachable from the camp yet." };
}

function cleCibleDemolitionCampPrototype(uid, targetKind) {
  return (targetKind === "layout" ? "layout" : "terrain") + ":" + uid;
}

function campPrototypeDemolitionsActives() {
  return Array.isArray(campPrototypeDemolitions) ? campPrototypeDemolitions : [];
}

function demolitionCampPrototypePourCible(uid, targetKind) {
  const cle = cleCibleDemolitionCampPrototype(uid, targetKind);
  return campPrototypeDemolitionsActives().find(function(demolition) {
    return cleCibleDemolitionCampPrototype(
      demolition.obstacleUid,
      demolition.targetKind
    ) === cle;
  }) || null;
}

function demolitionCampPrototypePourObstacle(uid) {
  return demolitionCampPrototypePourCible(uid, "terrain");
}

function demolitionCampPrototypePourKitty(kittyIndex) {
  return campPrototypeDemolitionsActives().find(function(demolition) {
    return demolition.kittyIndex === kittyIndex;
  }) || null;
}

function kittyIsDemolishingCamp(kittyIndex) {
  return Boolean(demolitionCampPrototypePourKitty(kittyIndex));
}

function sauvegarderDemolitionsCampPrototype() {
  synchroniserEtatCampDepuisPrototype();
}

function normaliserDemolitionsCampPrototype(claimKitty) {
  const source = Array.isArray(campPrototypeDemolitions) ? campPrototypeDemolitions : [];
  const ciblesPrises = new Set();
  const chatonsPris = new Set();
  const normalisees = [];
  let changed = !Array.isArray(campPrototypeDemolitions);
  source.forEach(function(demolition) {
    const targetKind = demolition && demolition.targetKind === "layout"
      ? "layout"
      : "terrain";
    const cible = demolition && cibleDemolitionCampPrototype(
      demolition.obstacleUid,
      targetKind
    );
    const cleCible = cible && cleCibleDemolitionCampPrototype(cible.uid, cible.kind);
    const kittyIndex = demolition && Number(demolition.kittyIndex);
    const startTs = demolition && Number(demolition.startTs);
    const duree = demolition && Number(demolition.duree);
    const valide = Boolean(
      cible
      && Number.isInteger(kittyIndex)
      && Number.isFinite(startTs)
      && Number.isFinite(duree)
      && duree > 0
      && !ciblesPrises.has(cleCible)
      && !chatonsPris.has(kittyIndex)
    );
    if (!valide || (typeof claimKitty === "function" && !claimKitty(kittyIndex))) {
      changed = true;
      return;
    }
    const entree = {
      obstacleUid: cible.uid,
      targetKind: cible.kind,
      kittyIndex: kittyIndex,
      startTs: startTs,
      duree: duree,
      readyToClaim: demolition.readyToClaim === true
    };
    if (
      demolition.obstacleUid !== entree.obstacleUid
      || demolition.targetKind !== entree.targetKind
      || demolition.kittyIndex !== entree.kittyIndex
      || demolition.startTs !== entree.startTs
      || demolition.duree !== entree.duree
      || demolition.readyToClaim !== entree.readyToClaim
    ) changed = true;
    ciblesPrises.add(cleCible);
    chatonsPris.add(kittyIndex);
    normalisees.push(entree);
  });
  if (normalisees.length !== source.length) changed = true;
  campPrototypeDemolitions = normalisees;
  if (changed) sauvegarderDemolitionsCampPrototype();
  return changed;
}

function chargerDemolitionsCampPrototype() {
  const camp = assurerEtatCampPrincipal();
  campPrototypeDemolitions = Array.isArray(camp.demolitions)
    ? camp.demolitions.map(function(demolition) { return Object.assign({}, demolition); })
    : [];
  normaliserDemolitionsCampPrototype();
}

function placementCampPrototypePourItem(uid) {
  return campPrototypePlacementEnCours
    && campPrototypePlacementEnCours.mode === "existing"
    && campPrototypePlacementEnCours.uid === uid
    ? campPrototypePlacementEnCours
    : null;
}

function evaluerPlacementCampPrototype(placement) {
  if (
    !placement
    || !Number.isFinite(placement.x)
    || !Number.isFinite(placement.y)
  ) {
    return { valide: false, raison: "Choose a position on the grid." };
  }
  return campPrototypeApi.testerPlacement(
    campPrototypeLayout,
    placement.type,
    placement.x,
    placement.y,
    placement.mode === "existing" ? placement.uid : null,
    placement.rotation,
    campPrototypeTerrain
  );
}

function actualiserValiditePlacementCampPrototype() {
  if (!campPrototypePlacementEnCours) return null;
  const resultat = evaluerPlacementCampPrototype(campPrototypePlacementEnCours);
  campPrototypePlacementEnCours.valide = resultat.valide;
  campPrototypePlacementEnCours.raison = resultat.raison;
  return resultat;
}

function commencerPlacementExistantCampPrototype(item) {
  if (!item) return null;
  campPrototypePlacementEnCours = {
    mode: "existing",
    uid: item.uid,
    type: item.type,
    tier: item.tier || 1,
    x: item.x,
    y: item.y,
    rotation: item.rotation || 0,
    original: {
      x: item.x,
      y: item.y,
      rotation: item.rotation || 0
    },
    valide: true,
    raison: ""
  };
  actualiserValiditePlacementCampPrototype();
  prechargerRotationSuivanteCampPrototype(
    typeCampPrototype(item.type),
    campPrototypePlacementEnCours.rotation,
    campPrototypePlacementEnCours.tier
  );
  return campPrototypePlacementEnCours;
}

function commencerNouveauPlacementCampPrototype(typeId) {
  const type = typeCampPrototype(typeId);
  if (!type || type.continuous) return null;
  campPrototypePlacementEnCours = {
    mode: "new",
    uid: null,
    type: typeId,
    tier: 1,
    x: null,
    y: null,
    rotation: 0,
    original: null,
    valide: false,
    raison: "Choose a position on the grid."
  };
  prechargerRotationSuivanteCampPrototype(type, 0, 1);
  return campPrototypePlacementEnCours;
}

function definirPositionPlacementCampPrototype(typeId, x, y, rotation, uid) {
  const type = typeCampPrototype(typeId);
  if (!type || type.continuous) return false;
  let placement = campPrototypePlacementEnCours;
  if (
    !placement
    || placement.type !== typeId
    || (uid && placement.uid !== uid)
    || (!uid && placement.mode !== "new")
  ) {
    const item = uid ? itemCampPrototype(uid) : null;
    placement = item
      ? commencerPlacementExistantCampPrototype(item)
      : commencerNouveauPlacementCampPrototype(typeId);
  }
  if (!placement) return false;
  placement.x = x;
  placement.y = y;
  placement.rotation = type.rotatable
    ? campPrototypeApi.normaliserRotation(rotation)
    : 0;
  if (placement.mode === "new") {
    campPrototypeRotationAPlacer = placement.rotation;
  }
  const resultat = actualiserValiditePlacementCampPrototype();
  const dimensions = dimensionsCampPrototype(placement.type, placement.rotation);
  definirMessageCampPrototype(resultat.valide
    ? type.label + " ready at column " + (placement.x + 1) + ", row "
      + (placement.y + 1) + ". Confirm to place it."
    : type.label + " cannot be placed here: " + resultat.raison
      + " Move or rotate it before confirming.");
  rendreItemsCampPrototype();
  actualiserCommandesCampPrototype();
  return Boolean(dimensions);
}

function dimensionsCampPrototype(typeId, rotation) {
  return campPrototypeApi.dimensionsType(typeId, rotation);
}

function definirMessageCampPrototype(message) {
  campPrototypeMessage = message;
  ecrireTexte(document.getElementById("camp-prototype-status"), message);
}

function sauvegarderCampPrototype() {
  invaliderConnexionsCampPrototype();
  synchroniserEtatCampDepuisPrototype();
  sauvegarder();
}

function chargerCampPrototype() {
  invaliderConnexionsCampPrototype();
  campPrototypeLayout = creerLayoutInitialCampPrototype();
  campPrototypeClotures = [];
  campPrototypeTerrain = campPrototypeApi.creerTerrainInitial();
  campPrototypeDemolitions = [];
  campPrototypeZoom = 1;
  const camp = assurerEtatCampPrincipal();
  let dispositionBrute = Array.isArray(camp.layout) ? camp.layout : [];
  let cloturesBrutes = Array.isArray(camp.fences) ? camp.fences : [];
  let terrainBrut = camp.terrain;
  let demolitionsBrutes = Array.isArray(camp.demolitions) ? camp.demolitions : [];
  let adapterAncienLayout = false;
  let migrationPrototype = camp.prototypeMigrationVersion < 1;
  let migrationOrientationCatchen = camp.prototypeMigrationVersion < 2;
  try {
    if (migrationPrototype && typeof localStorage !== "undefined") {
      const courant = localStorage.getItem(CAMP_PROTOTYPE_STORAGE_KEY);
      const legacy = courant === null
        ? localStorage.getItem(CAMP_PROTOTYPE_LEGACY_STORAGE_KEY)
        : null;
      const brut = courant !== null ? courant : legacy;
      const terrainCourant = localStorage.getItem(CAMP_PROTOTYPE_TERRAIN_STORAGE_KEY);
      let terrainLegacy = null;
      if (terrainCourant === null) {
        for (let index = 0; index < CAMP_PROTOTYPE_TERRAIN_LEGACY_STORAGE_KEYS.length; index += 1) {
          const candidat = localStorage.getItem(CAMP_PROTOTYPE_TERRAIN_LEGACY_STORAGE_KEYS[index]);
          if (candidat === null) continue;
          terrainLegacy = candidat;
          break;
        }
      }
      const terrainStocke = terrainCourant !== null ? terrainCourant : terrainLegacy;
      const demolitionsStockees = localStorage.getItem(CAMP_PROTOTYPE_DEMOLITIONS_STORAGE_KEY);
      if (brut !== null) dispositionBrute = JSON.parse(brut);
      if (terrainStocke !== null) terrainBrut = JSON.parse(terrainStocke);
      if (demolitionsStockees !== null) demolitionsBrutes = JSON.parse(demolitionsStockees);
      adapterAncienLayout = brut !== null && terrainCourant === null;
    }
    if (migrationOrientationCatchen) {
      dispositionBrute = migrerOrientationCatchenInitialeCampPrototype(dispositionBrute);
    }
    campPrototypeTerrain = campPrototypeApi.normaliserTerrain(
      terrainBrut
    );
    const dispositionSansTerrain = campPrototypeApi.normaliserLayout(
      assurerBatimentsInitiauxCampPrototype(dispositionBrute)
    );
    if ((adapterAncienLayout || dispositionSansTerrain.length > 0) && dispositionSansTerrain.length > 0) {
      campPrototypeTerrain = campPrototypeApi.adapterTerrainAuLayout(
        campPrototypeTerrain,
        dispositionSansTerrain
      );
    }
    campPrototypeLayout = campPrototypeApi.normaliserLayout(
      dispositionSansTerrain,
      campPrototypeTerrain
    );
    campPrototypeClotures = normaliserCloturesCampPrototype(cloturesBrutes);
    campPrototypeDemolitions = Array.isArray(demolitionsBrutes)
      ? demolitionsBrutes.map(function(demolition) { return Object.assign({}, demolition); })
      : [];
    if (typeof localStorage !== "undefined") {
      const zoomBrut = Number(localStorage.getItem(CAMP_PROTOTYPE_ZOOM_STORAGE_KEY));
      if (Number.isFinite(zoomBrut) && zoomBrut > 0) {
        campPrototypeZoom = Math.max(
          CAMP_PROTOTYPE_ZOOM_MIN,
          Math.min(CAMP_PROTOTYPE_ZOOM_MAX, zoomBrut)
        );
      }
    }
  } catch (error) {
    campPrototypeLayout = creerLayoutInitialCampPrototype();
    campPrototypeClotures = [];
    campPrototypeTerrain = campPrototypeApi.creerTerrainInitial();
    campPrototypeDemolitions = [];
  }
  camp.prototypeMigrationVersion = 2;
  normaliserDemolitionsCampPrototype();
  if (reconcilierMaisonsCampChargees()) {
    synchroniserEtatCampDepuisPrototype();
  }
  if (reconcilierConstructionsBatimentsCampChargees()) {
    synchroniserEtatCampDepuisPrototype();
  }
  if (reconcilierAmeliorationsCampChargees()) {
    synchroniserEtatCampDepuisPrototype();
  }
  synchroniserEtatCampDepuisPrototype();
  if (migrationPrototype || migrationOrientationCatchen) {
    sauvegarder();
  }
  if (migrationPrototype) {
    supprimerAncienStockageCampPrototype();
  }
}

function reinitialiserCampPrototypeNouvellePartie() {
  invaliderConnexionsCampPrototype();
  if (typeof localStorage !== "undefined") {
    const clesCamp = [
      CAMP_PROTOTYPE_STORAGE_KEY,
      CAMP_PROTOTYPE_LEGACY_STORAGE_KEY,
      CAMP_PROTOTYPE_TERRAIN_STORAGE_KEY,
      CAMP_PROTOTYPE_DEMOLITIONS_STORAGE_KEY,
      CAMP_PROTOTYPE_ZOOM_STORAGE_KEY
    ].concat(CAMP_PROTOTYPE_TERRAIN_LEGACY_STORAGE_KEYS);
    try {
      clesCamp.forEach(function(storageKey) {
        localStorage.removeItem(storageKey);
      });
    } catch (error) {}
  }

  campPrototypeLayout = creerLayoutInitialCampPrototype();
  campPrototypeClotures = [];
  campPrototypeTerrain = campPrototypeApi.creerTerrainInitial();
  campPrototypeZoom = 1;
  campPrototypeTypeAPlacer = null;
  campPrototypeRotationAPlacer = 0;
  campPrototypeGommeRoutes = false;
  campPrototypeGommeClotures = false;
  campPrototypeSelectionUid = null;
  campPrototypePointeur = null;
  campPrototypeUidCompteur = 0;
  campPrototypeCameraInitialisee = false;
  campPrototypeCadrageMobileInitialise = false;
  campPrototypeModeEdition = false;
  campPrototypeCategorieOuverte = null;
  campPrototypeInteractionUid = null;
  campPrototypePlacementEnCours = null;
  campPrototypeDemolitions = [];
  campPrototypeDemolitionObstacleUid = null;
  campPrototypeDemolitionTargetKind = null;
  campPrototypeRepairBuildingId = null;
  campPrototypeRepairUid = null;
  campPrototypeConstructionMaisonTypeId = null;
  campPrototypeDerniereSecondeDemolition = null;
  campPrototypeMessage = "";
  campPrototypePincement = null;
  etat.camp = stateCore.makeCampState();
  etat.camp.prototypeMigrationVersion = 2;
  synchroniserEtatCampDepuisPrototype();
  annulerAppuiProlongeCampPrototype();

  if (!campPrototypeInitialise) return;
  masquerApercuCampPrototype();
  invaliderLargeurBaseCampPrototype();
  renduCampPrototype();
}

function normaliserZoomCampPrototype(value) {
  const nombre = Number(value);
  if (!Number.isFinite(nombre)) return 1;
  const parPas = Math.round(nombre / CAMP_PROTOTYPE_ZOOM_STEP) * CAMP_PROTOTYPE_ZOOM_STEP;
  return Math.max(zoomMinimumCampPrototype(), Math.min(CAMP_PROTOTYPE_ZOOM_MAX, parPas));
}

function jardinsVoisinsDecouvertsCampPrototype() {
  const zonesExplorees = new Set(Array.isArray(etat.zonesExplorees) ? etat.zonesExplorees : []);
  return {
    red: zonesExplorees.has("C1"),
    green: zonesExplorees.has("E1")
  };
}

function cadrageJardinCentralMobileCampPrototype() {
  if (typeof window === "undefined" || window.innerWidth > 768) return null;
  const viewport = document.querySelector(".camp-prototype-viewport");
  const board = document.getElementById("camp-prototype-board");
  if (!viewport || !board) return null;
  const largeurBase = Number(board.dataset.campBaseWidth);
  if (!Number.isFinite(largeurBase) || largeurBase <= 0 || viewport.clientWidth <= 0) return null;
  return Math.min(
    CAMP_PROTOTYPE_ZOOM_MAX,
    viewport.clientWidth * 3 / largeurBase
  );
}

function zoomMinimumCampPrototype() {
  const voisins = jardinsVoisinsDecouvertsCampPrototype();
  if (voisins.red || voisins.green) return CAMP_PROTOTYPE_ZOOM_MIN;
  return Math.max(CAMP_PROTOTYPE_ZOOM_MIN, cadrageJardinCentralMobileCampPrototype() || 0);
}

function bornerCameraHorizontaleMobileCampPrototype() {
  if (typeof window === "undefined" || window.innerWidth > 768) return false;
  const viewport = document.querySelector(".camp-prototype-viewport");
  const board = document.getElementById("camp-prototype-board");
  if (!viewport || !board || board.offsetWidth <= 0) return false;
  const voisins = jardinsVoisinsDecouvertsCampPrototype();
  const largeurJardin = board.offsetWidth / 3;
  const minimum = board.offsetLeft + (voisins.red ? 0 : largeurJardin);
  const bordDroit = board.offsetLeft + (voisins.green ? board.offsetWidth : largeurJardin * 2);
  const maximum = Math.max(minimum, bordDroit - viewport.clientWidth);
  const cible = Math.max(minimum, Math.min(maximum, viewport.scrollLeft));
  if (Math.abs(viewport.scrollLeft - cible) < 0.5) return false;
  viewport.scrollLeft = cible;
  return true;
}

function actualiserCadrageMobileCampPrototype() {
  const viewport = document.querySelector(".camp-prototype-viewport");
  if (!viewport) return;
  if (typeof window === "undefined" || window.innerWidth > 768) {
    viewport.classList.remove("camp-mobile-home-only");
    campPrototypeCadrageMobileInitialise = false;
    return;
  }
  const voisins = jardinsVoisinsDecouvertsCampPrototype();
  viewport.classList.toggle("camp-mobile-home-only", !voisins.red && !voisins.green);
  const minimum = zoomMinimumCampPrototype();
  if (!campPrototypeCadrageMobileInitialise && !voisins.red && !voisins.green) {
    campPrototypeZoom = minimum;
    campPrototypeCadrageMobileInitialise = true;
    appliquerZoomCampPrototype(false);
  } else if (campPrototypeZoom < minimum) {
    campPrototypeZoom = minimum;
    appliquerZoomCampPrototype(false);
  }
  bornerCameraHorizontaleMobileCampPrototype();
  actualiserCommandesZoomCampPrototype();
}

function actualiserCommandesZoomCampPrototype() {
  const valeur = document.getElementById("camp-prototype-zoom-value");
  const moins = document.getElementById("camp-prototype-zoom-out");
  const plus = document.getElementById("camp-prototype-zoom-in");
  if (valeur) {
    valeur.textContent = Math.round(campPrototypeZoom * 100) + "%";
    valeur.setAttribute("aria-label", "Reset Camp zoom, currently "
      + Math.round(campPrototypeZoom * 100) + " percent");
  }
  if (moins) moins.disabled = campPrototypeZoom <= zoomMinimumCampPrototype();
  if (plus) plus.disabled = campPrototypeZoom >= CAMP_PROTOTYPE_ZOOM_MAX;
}

function invaliderLargeurBaseCampPrototype() {
  const board = document.getElementById("camp-prototype-board");
  const map = document.querySelector(".camp-prototype-map");
  if (board) delete board.dataset.campBaseWidth;
  if (map) map.style.removeProperty("width");
}

function conteneurDefilementVerticalCampPrototype(viewport) {
  if (!viewport || typeof document === "undefined") return null;
  let candidat = viewport.parentElement;
  while (candidat && candidat !== document.body && candidat !== document.documentElement) {
    const style = typeof getComputedStyle === "function" ? getComputedStyle(candidat) : null;
    const peutDefiler = style && /^(auto|scroll|overlay)$/.test(style.overflowY);
    if (peutDefiler && candidat.scrollHeight > candidat.clientHeight + 1) return candidat;
    candidat = candidat.parentElement;
  }
  const racine = document.scrollingElement;
  return racine && racine !== viewport && racine.scrollHeight > racine.clientHeight + 1
    ? racine
    : null;
}

function appliquerZoomCampPrototype(conserverCentre, ancrageClient) {
  const viewport = document.querySelector(".camp-prototype-viewport");
  const map = document.querySelector(".camp-prototype-map");
  const board = document.getElementById("camp-prototype-board");
  if (!viewport || !map || !board || board.getClientRects().length === 0) return;
  const ancienScrollLeft = viewport.scrollLeft;
  const ancienScrollTop = viewport.scrollTop;
  const viewportRect = viewport.getBoundingClientRect();
  const boardRect = board.getBoundingClientRect();
  const clientX = ancrageClient && Number.isFinite(ancrageClient.clientX)
    ? ancrageClient.clientX
    : viewportRect.left + viewport.clientWidth / 2;
  const clientY = ancrageClient && Number.isFinite(ancrageClient.clientY)
    ? ancrageClient.clientY
    : viewportRect.top + viewport.clientHeight / 2;
  const ratioX = ancrageClient && Number.isFinite(ancrageClient.ratioX)
    ? Math.max(0, Math.min(1, ancrageClient.ratioX))
    : (boardRect.width > 0
      ? Math.max(0, Math.min(1, (clientX - boardRect.left) / boardRect.width))
      : 0.5);
  const ratioY = ancrageClient && Number.isFinite(ancrageClient.ratioY)
    ? Math.max(0, Math.min(1, ancrageClient.ratioY))
    : (boardRect.height > 0
      ? Math.max(0, Math.min(1, (clientY - boardRect.top) / boardRect.height))
      : 0.5);
  let largeurBase = Number(board.dataset.campBaseWidth);
  if (!Number.isFinite(largeurBase) || largeurBase <= 0) {
    map.style.removeProperty("width");
    largeurBase = board.getBoundingClientRect().width;
    if (largeurBase > 0) board.dataset.campBaseWidth = String(largeurBase);
  }
  if (largeurBase <= 0) return;
  map.style.width = (largeurBase * campPrototypeZoom) + "px";
  board.style.setProperty("--camp-prototype-obstacle-size", (16 * campPrototypeZoom) + "px");
  board.dataset.campZoom = String(campPrototypeZoom);
  actualiserCommandesZoomCampPrototype();
  const nouveauBoardRect = board.getBoundingClientRect();
  if (conserverCentre) {
    const decalageX = nouveauBoardRect.left + ratioX * nouveauBoardRect.width - clientX;
    const decalageY = nouveauBoardRect.top + ratioY * nouveauBoardRect.height - clientY;
    viewport.scrollLeft += decalageX;
    const ancienScrollTopViewport = viewport.scrollTop;
    viewport.scrollTop += decalageY;
    const decalageVerticalRestant = decalageY
      - (viewport.scrollTop - ancienScrollTopViewport);
    if (Math.abs(decalageVerticalRestant) > 0.5) {
      const conteneurVertical = conteneurDefilementVerticalCampPrototype(viewport);
      if (conteneurVertical) conteneurVertical.scrollTop += decalageVerticalRestant;
    }
    return;
  }
  viewport.scrollLeft = Math.min(
    ancienScrollLeft,
    Math.max(0, viewport.scrollWidth - viewport.clientWidth)
  );
  viewport.scrollTop = Math.min(
    ancienScrollTop,
    Math.max(0, viewport.scrollHeight - viewport.clientHeight)
  );
}

function definirZoomCampPrototype(value, ancrageClient) {
  if (!DEV_MODE && !campDebloque()) return;
  campPrototypeZoom = normaliserZoomCampPrototype(value);
  if (typeof localStorage !== "undefined") {
    try {
      localStorage.setItem(CAMP_PROTOTYPE_ZOOM_STORAGE_KEY, String(campPrototypeZoom));
    } catch (error) {}
  }
  appliquerZoomCampPrototype(true, ancrageClient);
}

function ajusterZoomCampPrototype(delta) {
  const changement = Number(delta || 0);
  const minimum = zoomMinimumCampPrototype();
  const minimumHorsPas = Math.abs(minimum / CAMP_PROTOTYPE_ZOOM_STEP
    - Math.round(minimum / CAMP_PROTOTYPE_ZOOM_STEP)) > 0.001;
  const cible = changement > 0
    && minimumHorsPas
    && Math.abs(campPrototypeZoom - minimum) < 0.001
      ? Math.ceil(minimum / CAMP_PROTOTYPE_ZOOM_STEP) * CAMP_PROTOTYPE_ZOOM_STEP
      : campPrototypeZoom + changement;
  definirZoomCampPrototype(cible);
}

function distancePincementCampPrototype(touches) {
  if (!touches || touches.length < 2) return 0;
  return Math.hypot(
    touches[1].clientX - touches[0].clientX,
    touches[1].clientY - touches[0].clientY
  );
}

function centrePincementCampPrototype(touches) {
  return {
    clientX: (touches[0].clientX + touches[1].clientX) / 2,
    clientY: (touches[0].clientY + touches[1].clientY) / 2
  };
}

function demarrerPincementCampPrototype(event) {
  if (event.touches.length !== 2 || (!DEV_MODE && !campDebloque())) return;
  const distance = distancePincementCampPrototype(event.touches);
  if (distance <= 0) return;
  const interaction = campPrototypePointeur;
  const board = document.getElementById("camp-prototype-board");
  annulerAppuiProlongeCampPrototype();
  if (
    interaction
    && board
    && board.hasPointerCapture(interaction.pointerId)
  ) {
    board.releasePointerCapture(interaction.pointerId);
  }
  campPrototypePointeur = null;
  masquerApercuCampPrototype();
  const centre = centrePincementCampPrototype(event.touches);
  const boardRect = board ? board.getBoundingClientRect() : null;
  campPrototypePincement = {
    distanceInitiale: distance,
    zoomInitial: campPrototypeZoom,
    ratioX: boardRect && boardRect.width > 0
      ? Math.max(0, Math.min(1, (centre.clientX - boardRect.left) / boardRect.width))
      : 0.5,
    ratioY: boardRect && boardRect.height > 0
      ? Math.max(0, Math.min(1, (centre.clientY - boardRect.top) / boardRect.height))
      : 0.5
  };
  campPrototypeCameraInitialisee = true;
  event.preventDefault();
}

function deplacerPincementCampPrototype(event) {
  if (!campPrototypePincement || event.touches.length !== 2) return;
  const distance = distancePincementCampPrototype(event.touches);
  if (distance <= 0) return;
  const zoomCible = campPrototypePincement.zoomInitial
    * distance / campPrototypePincement.distanceInitiale;
  const centre = centrePincementCampPrototype(event.touches);
  definirZoomCampPrototype(zoomCible, {
    clientX: centre.clientX,
    clientY: centre.clientY,
    ratioX: campPrototypePincement.ratioX,
    ratioY: campPrototypePincement.ratioY
  });
  event.preventDefault();
}

function terminerPincementCampPrototype(event) {
  if (!campPrototypePincement) return;
  if (event.touches && event.touches.length >= 2) return;
  campPrototypePincement = null;
  if (campPrototypePlacementEnCours) rendreItemsCampPrototype();
}

function centrerCameraCampPrototype(x, y) {
  const viewport = document.querySelector(".camp-prototype-viewport");
  const board = document.getElementById("camp-prototype-board");
  if (!viewport || !board || board.getClientRects().length === 0) return false;
  const cibleX = board.offsetLeft + x / campPrototypeApi.GRID_WIDTH * board.offsetWidth;
  const cibleY = board.offsetTop + y / campPrototypeApi.GRID_HEIGHT * board.offsetHeight;
  viewport.scrollLeft = Math.max(0, cibleX - viewport.clientWidth / 2);
  viewport.scrollTop = Math.max(0, cibleY - viewport.clientHeight / 2);
  return true;
}

function centrerCameraInitialeCampPrototype() {
  const rectangle = campPrototypeApi.INITIAL_BUILDABLE_RECT;
  return centrerCameraCampPrototype(
    rectangle.x + rectangle.width / 2,
    rectangle.y + rectangle.height / 2
  );
}

function appliquerCadreCampPrototype(element, type, x, y, rotation) {
  if (!element || !type) return;
  const dimensions = dimensionsCampPrototype(type.id, rotation);
  element.style.left = (x / campPrototypeApi.GRID_WIDTH * 100) + "%";
  element.style.top = (y / campPrototypeApi.GRID_HEIGHT * 100) + "%";
  element.style.width = (dimensions.width / campPrototypeApi.GRID_WIDTH * 100) + "%";
  element.style.height = (dimensions.height / campPrototypeApi.GRID_HEIGHT * 100) + "%";
}

function appliquerCadreTerrainCampPrototype(element, x, y, width, height) {
  if (!element) return;
  element.style.left = (x / campPrototypeApi.GRID_WIDTH * 100) + "%";
  element.style.top = (y / campPrototypeApi.GRID_HEIGHT * 100) + "%";
  element.style.width = ((width || 1) / campPrototypeApi.GRID_WIDTH * 100) + "%";
  element.style.height = ((height || 1) / campPrototypeApi.GRID_HEIGHT * 100) + "%";
}

function assetCampPrototypePourRotation(type, rotation, functionalTier) {
  if (!type || !type.asset) return "";
  const rotationNormalisee = campPrototypeApi.normaliserRotation(rotation);
  const direction = {
    0: "down",
    90: "right",
    180: "up",
    270: "left"
  }[rotationNormalisee];
  const runtimeVisual = campPrototypeApi.runtimeVisualForTier(
    type.id,
    Number.isInteger(functionalTier) && functionalTier > 0 ? functionalTier : 1
  );
  if (runtimeVisual && direction && runtimeVisual.sprites[direction]) {
    return runtimeVisual.sprites[direction];
  }
  if (type.assets) {
    if (direction && type.assets[direction]) return type.assets[direction];
  }
  if (rotationNormalisee === 0) return type.asset;
  return type.asset.replace(
    /(\.[a-z0-9]+)(\?[^#]*)?$/i,
    "_r" + rotationNormalisee + "$1$2"
  );
}

function prechargerRotationSuivanteCampPrototype(type, rotation, functionalTier) {
  if (!type || !type.rotatable || !type.asset || typeof Image !== "function") return;
  const rotationSuivante = campPrototypeApi.normaliserRotation((rotation || 0) + 90);
  if (rotationSuivante === 0) return;
  const src = assetCampPrototypePourRotation(type, rotationSuivante, functionalTier);
  if (!src || campPrototypeAssetsRotationPrecharges.has(src)) return;
  const image = new Image();
  image.src = src;
  campPrototypeAssetsRotationPrecharges.set(src, image);
}

function remplirItemCampPrototype(element, type, rotation, functionalTier) {
  if (!element || !type) return;
  const dimensions = dimensionsCampPrototype(type.id, rotation);
  element.innerHTML = "";
  if (type.asset) {
    const image = document.createElement("img");
    image.className = "camp-prototype-building-sprite";
    image.src = assetCampPrototypePourRotation(type, dimensions.rotation, functionalTier);
    image.alt = "";
    image.draggable = false;
    image.style.width = "100%";
    image.style.height = "100%";
    image.style.transform = "translate(-50%, -50%)";
    element.classList.add("camp-prototype-item-has-sprite");
    element.appendChild(image);
    const label = document.createElement("span");
    label.className = "camp-prototype-accessible-label";
    label.textContent = type.label;
    element.appendChild(label);
    return;
  }
  element.classList.remove("camp-prototype-item-has-sprite");
  element.innerHTML = "<strong>" + type.label + "</strong><span>"
    + dimensions.width + " × " + dimensions.height + "</span>";
}

function ajouterRaccordsRouteBatimentCampPrototype(element, layout, item, type) {
  if (!element || !item || !type || !type.access) return;
  campPrototypeApi.raccordsRouteItem(layout, item).forEach(function(raccord) {
    const connecteur = document.createElement("i");
    connecteur.className = "camp-prototype-building-road-connector "
      + "camp-prototype-building-road-connector-" + raccord.direction;
    if (raccord.shape) {
      connecteur.classList.add(
        "camp-prototype-building-road-connector-" + raccord.shape
      );
    }
    connecteur.dataset.roadMaterial = raccord.material;
    connecteur.dataset.campAccessPort = raccord.portId;
    connecteur.setAttribute("aria-hidden", "true");
    connecteur.style.setProperty(
      "--camp-road-connector-anchor",
      (raccord.anchor * 100) + "%"
    );
    connecteur.style.setProperty(
      "--camp-road-connector-width",
      (raccord.width * 100) + "%"
    );
    connecteur.style.setProperty(
      "--camp-road-connector-length",
      (raccord.length * 100) + "%"
    );
    if (Number.isFinite(raccord.innerRatio)) {
      connecteur.style.setProperty(
        "--camp-road-connector-inner-start",
        ((0.5 - raccord.innerRatio / 2) * 100) + "%"
      );
      connecteur.style.setProperty(
        "--camp-road-connector-inner-end",
        ((0.5 + raccord.innerRatio / 2) * 100) + "%"
      );
    }
    if (Number.isFinite(raccord.textureX) && Number.isFinite(raccord.textureY)) {
      connecteur.style.setProperty(
        "--camp-road-connector-texture-x",
        raccord.textureX + "%"
      );
      connecteur.style.setProperty(
        "--camp-road-connector-texture-y",
        raccord.textureY + "%"
      );
    }
    element.insertBefore(connecteur, element.firstChild);
  });
}

function fermerMenuInteractionCampPrototype() {
  const menu = document.getElementById("camp-prototype-interaction-menu");
  if (menu) {
    menu.hidden = true;
    delete menu.dataset.workFamily;
    delete menu.dataset.campBuildingId;
    delete menu.dataset.campUid;
    delete menu.dataset.obstacleUid;
    delete menu.dataset.demolitionTargetKind;
    delete menu.dataset.interactionKind;
  }
  document.querySelectorAll('[aria-controls="camp-prototype-interaction-menu"]').forEach(function(item) {
    item.setAttribute("aria-expanded", "false");
  });
  campPrototypeInteractionUid = null;
}

function synchroniserDeclencheurMenuCampPrototype() {
  const menu = document.getElementById("camp-prototype-interaction-menu");
  if (!menu || menu.hidden) return;
  const selecteur = menu.dataset.campUid
    ? '[data-camp-uid="' + menu.dataset.campUid + '"]'
    : (menu.dataset.obstacleUid
        ? '[data-camp-obstacle-uid="' + menu.dataset.obstacleUid + '"]'
        : null);
  const declencheur = selecteur ? document.querySelector(selecteur) : null;
  if (!declencheur) {
    fermerMenuInteractionCampPrototype();
    return;
  }
  declencheur.setAttribute("aria-expanded", "true");
}

function actionMenuCampPrototypeDepuisEvenement(menu, event) {
  if (!menu || !event || !(event.target instanceof Element)) return null;
  const bouton = event.target.closest("[data-camp-menu-action]");
  if (bouton && menu.contains(bouton)) return bouton.dataset.campMenuAction || null;
  if (event.target === menu) {
    const actionUnique = menu.querySelector("[data-camp-menu-action]");
    return actionUnique ? actionUnique.dataset.campMenuAction || null : null;
  }
  return null;
}

function executerActionMenuCampPrototype(action, event) {
  if (!action) return false;
  if (event) {
    event.preventDefault();
    event.stopPropagation();
  }
  if (action === "work") return ouvrirWorkDepuisCamp();
  if (action === "function") return ouvrirFonctionDepuisCamp();
  if (action === "repair") return ouvrirModalReparationCamp();
  if (action === "upgrade") return ouvrirModalAmeliorationCamp();
  if (action === "demolition") return ouvrirModalDemolitionCamp();
  if (action === "claim") return validerTacheCampDepuisMenu();
  if (action === "manual-focus") return activerManualFocusCampDepuisMenu();
  return false;
}

function tacheCampPourItem(item) {
  if (!item) return null;
  const maison = constructionMaisonCampPourItem(item.uid);
  if (maison) return { kind: "house", job: maison };
  const batiment = constructionBatimentCampPourItem(item.uid);
  if (batiment) return { kind: "building", job: batiment };
  const reparation = reparationCampPourBatiment(item.type);
  if (reparation) return { kind: "repair", job: reparation };
  const amelioration = ameliorationCampPourItem(item.uid);
  if (amelioration) return { kind: "upgrade", job: amelioration };
  return null;
}

function retrouverTacheManualFocusCamp(focus) {
  if (!focus || focus.kind !== "camp") return null;
  if (focus.campTaskKind === "demolition") {
    const demolition = demolitionCampPrototypePourCible(focus.obstacleUid, focus.targetKind);
    return demolition ? { kind: "demolition", job: demolition } : null;
  }
  return tacheCampPourItem(itemCampPrototype(focus.campUid));
}

function manualFocusTacheCampActif(tache) {
  if (!(synchroniserReserveManualFocus() > 0) || !workManualFocus
      || workManualFocus.kind !== "camp") return false;
  const cible = retrouverTacheManualFocusCamp(workManualFocus);
  return Boolean(cible && tache && cible.job === tache.job);
}

function activerManualFocusCampDepuisMenu() {
  if (!manualFocusDebloque()) return false;
  const menu = document.getElementById("camp-prototype-interaction-menu");
  if (!menu) return false;
  let tache = null;
  let cible = null;
  if (menu.dataset.interactionKind === "demolition") {
    const job = demolitionCampPrototypePourCible(
      menu.dataset.obstacleUid,
      menu.dataset.demolitionTargetKind
    );
    if (job) {
      tache = { kind: "demolition", job: job };
      cible = {
        campTaskKind: "demolition",
        obstacleUid: menu.dataset.obstacleUid,
        targetKind: menu.dataset.demolitionTargetKind
      };
    }
  } else {
    const item = itemCampPrototype(menu.dataset.campUid);
    tache = tacheCampPourItem(item);
    if (tache) cible = { campTaskKind: tache.kind, campUid: item.uid };
  }
  if (!tache || !tache.job || tache.job.readyToClaim || !cible) return false;
  const now = Date.now();
  const memeCible = workManualFocus && workManualFocus.kind === "camp"
    && workManualFocus.campTaskKind === cible.campTaskKind
    && workManualFocus.campUid === cible.campUid
    && workManualFocus.obstacleUid === cible.obstacleUid
    && workManualFocus.targetKind === cible.targetKind;
  const reserve = memeCible ? synchroniserReserveManualFocus(now) : 0;
  workManualFocus = Object.assign({
    kind: "camp",
    reserveSeconds: Math.min(
      manualFocusMaxSeconds(),
      reserve + manualFocusSecondsPerClick()
    ),
    lastDrainTs: now
  }, cible);
  actualiserFocusManuelWork();
  rafraichirMenuInteractionCampPrototype();
  return true;
}

function appliquerManualFocusCamp(dtSeconds) {
  if (!(Number(dtSeconds) > 0) || !(synchroniserReserveManualFocus() > 0)
      || !workManualFocus || workManualFocus.kind !== "camp") return false;
  const tache = retrouverTacheManualFocusCamp(workManualFocus);
  if (!tache || !tache.job || tache.job.readyToClaim) return false;
  tache.job.startTs -= Number(dtSeconds) * (manualFocusMultiplier() - 1) * 1000;
  return true;
}

function libelleTacheCamp(tache, type) {
  if (!tache) return "Camp action";
  if (tache.kind === "repair") return "Repair " + type.label;
  if (tache.kind === "upgrade") return "Upgrade " + type.label + " to Tier " + tache.job.targetTier;
  return "Build " + type.label;
}

function htmlMenuTacheCamp(tache, type) {
  const label = libelleTacheCamp(tache, type);
  if (tache.job.readyToClaim) {
    return '<button type="button" class="camp-task-claim-action" role="menuitem"'
      + ' data-camp-menu-action="claim" aria-label="Validate ' + echapperAttributHtml(label)
      + '"><span aria-hidden="true">✓</span><strong>Validate</strong></button>';
  }
  const state = etatTacheTemporeeCamp(tache, Date.now());
  return '<span class="camp-prototype-demolition-menu-status"><span aria-hidden="true">⏱</span> '
    + '<span data-camp-task-menu-timer>' + formaterTemps(state ? state.remaining : 0) + '</span></span>'
    + (manualFocusDebloque()
      ? '<button type="button" class="camp-task-manual-focus-action" role="menuitem"'
        + ' data-camp-menu-action="manual-focus" aria-label="Manual Focus on '
        + echapperAttributHtml(label) + '">Focus</button>'
      : '');
}

function validerTacheCampDepuisMenu() {
  const menu = document.getElementById("camp-prototype-interaction-menu");
  if (!menu) return false;
  if (menu.dataset.interactionKind === "demolition") {
    return validerDemolitionCampPrototype(
      menu.dataset.obstacleUid,
      menu.dataset.demolitionTargetKind
    );
  }
  const item = itemCampPrototype(menu.dataset.campUid);
  const tache = tacheCampPourItem(item);
  if (!tache || !tache.job.readyToClaim) return false;
  fermerMenuInteractionCampPrototype();
  if (tache.kind === "house") return validerConstructionMaisonCamp(item.uid);
  if (tache.kind === "building") return validerConstructionBatimentCamp(item.uid);
  if (tache.kind === "repair") return validerReparationCamp(item.type);
  if (tache.kind === "upgrade") return validerAmeliorationCamp(item.uid);
  return false;
}

function validerTacheCampDepuisChat(kittyIndex) {
  const tache = tacheTemporeeCampPourKitty(kittyIndex);
  if (!tache || !tache.job || !tache.job.readyToClaim) return false;
  fermerMenuInteractionCampPrototype();
  if (tache.kind === "house") return validerConstructionMaisonCamp(tache.job.uid);
  if (tache.kind === "building") return validerConstructionBatimentCamp(tache.job.uid);
  if (tache.kind === "repair") return validerReparationCamp(tache.job.buildingId);
  if (tache.kind === "upgrade") return validerAmeliorationCamp(tache.job.uid);
  if (tache.kind === "demolition") {
    return validerDemolitionCampPrototype(tache.job.obstacleUid, tache.job.targetKind);
  }
  return false;
}

function gererPointeurActionMenuCampPrototype(event) {
  // Run primary mouse and pen actions on pointerup. Waiting for the later click
  // is unreliable on desktop when a Camp render replaces the floating control
  // between pointerup and click. Keyboard and touch activation use the click
  // handler below.
  if (!event.isPrimary || event.button > 0) return;
  const menu = event.currentTarget;
  const action = actionMenuCampPrototypeDepuisEvenement(menu, event);
  if (!action) {
    event.stopPropagation();
    return;
  }
  // Touch browsers dispatch a synthetic click after pointerup. Opening a modal
  // here would put its dismissible backdrop under that later click and close it
  // immediately. Keep the menu stable and let the click handler run the action.
  if (event.pointerType === "touch") {
    event.stopPropagation();
    return;
  }
  campPrototypeDerniereActivationPointeur = Date.now();
  executerActionMenuCampPrototype(action, event);
}

function gererClicActionMenuCampPrototype(event) {
  const menu = event.currentTarget;
  const action = actionMenuCampPrototypeDepuisEvenement(menu, event);
  if (!action) {
    event.stopPropagation();
    return;
  }
  if (Date.now() - campPrototypeDerniereActivationPointeur < 700) {
    event.preventDefault();
    event.stopPropagation();
    return;
  }
  executerActionMenuCampPrototype(action, event);
}

function ouvrirMenuInteractionCampPrototype(uid, options) {
  if ((!DEV_MODE && !campDebloque()) || campPrototypeModeEdition) return false;
  const item = itemCampPrototype(uid);
  const type = item && typeCampPrototype(item.type);
  const famille = type && CAMP_PROTOTYPE_WORK_FAMILY_BY_TYPE[type.id];
  const fonction = type && CAMP_PROTOTYPE_FUNCTION_BY_TYPE[type.id];
  const tache = item && tacheCampPourItem(item);
  const menu = document.getElementById("camp-prototype-interaction-menu");
  if (!item || !type || (!famille && !fonction && !tache) || !menu) {
    fermerMenuInteractionCampPrototype();
    return false;
  }
  const conserverOuvert = Boolean(options && options.conserverOuvert);
  if (campPrototypeInteractionUid === uid && !menu.hidden && !conserverOuvert) {
    fermerMenuInteractionCampPrototype();
    return false;
  }
  fermerMenuInteractionCampPrototype();
  const dimensions = dimensionsCampPrototype(item.type, item.rotation);
  menu.style.left = ((item.x + dimensions.width / 2) / campPrototypeApi.GRID_WIDTH * 100) + "%";
  menu.style.top = (item.y / campPrototypeApi.GRID_HEIGHT * 100) + "%";
  menu.dataset.workFamily = famille || "";
  menu.dataset.campFunction = fonction || "";
  menu.dataset.campBuildingId = type.id;
  menu.dataset.campUid = uid;
  menu.dataset.interactionKind = "building";
  menu.setAttribute("aria-label", type.label + " actions");
  const reparation = reparationCampPourBatiment(type.id);
  const amelioration = ameliorationCampPourItem(item.uid);
  if (tache) {
    menu.innerHTML = htmlMenuTacheCamp(tache, type);
  } else if (batimentCampRepare(type.id) || !CAMP_BUILDING_REPAIR_DURATIONS[type.id]) {
    const capacite = capaciteBatimentCamp(type.id, 1, {
      item: item,
      contentUnlocked: famille ? true : contenuBatimentCampDebloque(type.id)
    });
    if (amelioration) {
      menu.innerHTML = '<span class="camp-prototype-demolition-menu-status">Tier '
        + amelioration.targetTier + ' · <span data-camp-upgrade-menu-timer>'
        + formaterTemps(Math.max(0, amelioration.duration - (Date.now() - amelioration.startTs) / 1000))
        + '</span></span>';
    } else if (capacite.available) {
      menu.innerHTML = '<button type="button" role="menuitem" data-camp-menu-action="'
        + (famille ? 'work' : 'function') + '" aria-label="Open '
        + echapperAttributHtml(type.label)
        + (famille ? ' in Work' : '') + '"><span aria-hidden="true">→</span></button>';
      const upgrade = prochaineAmeliorationCamp(item);
      if (upgrade) {
        menu.innerHTML += '<button type="button" class="camp-prototype-upgrade-action" role="menuitem"'
          + ' data-camp-menu-action="upgrade" aria-label="Upgrade '
          + echapperAttributHtml(type.label) + ' to Tier ' + upgrade.targetTier + '">T'
          + upgrade.targetTier + ' ↑</button>';
      }
    } else {
      menu.innerHTML = '<span class="camp-prototype-demolition-menu-status camp-building-blocked-reason">'
        + echapperAttributHtml(capacite.reason) + '</span>';
    }
  } else if (reparation) {
    menu.innerHTML = '<span class="camp-prototype-demolition-menu-status">'
      + '<span aria-hidden="true">🔧</span> '
      + '<span data-camp-repair-menu-timer>'
      + formaterTemps(Math.max(0, reparation.duree - (Date.now() - reparation.startTs) / 1000))
      + '</span></span>';
  } else {
    menu.innerHTML = '<button type="button" class="camp-prototype-repair-action" role="menuitem"'
      + ' data-camp-menu-action="repair"'
      + ' aria-label="Repair ' + echapperAttributHtml(type.label)
        + '"><img src="img/interface/Repair_Final.png?v=0.0004" alt=""></button>';
  }
  const itemElement = document.querySelector('[data-camp-uid="' + uid + '"]');
  if (itemElement) itemElement.setAttribute("aria-expanded", "true");
  campPrototypeInteractionUid = uid;
  menu.hidden = false;
  return true;
}

function activerItemCampPrototype(uid) {
  const item = itemCampPrototype(uid);
  const type = item && typeCampPrototype(item.type);
  if (item && tacheCampPourItem(item)) {
    ouvrirMenuInteractionCampPrototype(item.uid);
    return;
  }
  if (
    item
    && type
    && CAMP_BUILDING_REPAIR_DURATIONS[type.id]
    && reparationCampDebloquee(type.id)
    && !batimentCampRepare(type.id)
    && !reparationCampPourBatiment(type.id)
  ) {
    ouvrirModalReparationCamp(null, type.id, item.uid);
    return;
  }
  if (type && CAMP_PROTOTYPE_WORK_FAMILY_BY_TYPE[type.id]) {
    ouvrirMenuInteractionCampPrototype(item.uid);
  } else if (type && CAMP_PROTOTYPE_FUNCTION_BY_TYPE[type.id]) {
    ouvrirMenuInteractionCampPrototype(item.uid);
  } else if (type && type.category === "junk") {
    ouvrirMenuDemolitionCampPrototype(item.uid, "layout");
  } else if (type) {
    fermerMenuInteractionCampPrototype();
    definirMessageCampPrototype(type.label + " selected. Its gameplay interaction will be connected later.");
  }
}

function ouvrirMenuDemolitionCampPrototype(targetUid, targetKind, options) {
  if ((!DEV_MODE && !campDebloque()) || campPrototypeModeEdition) return false;
  const cible = cibleDemolitionCampPrototype(targetUid, targetKind);
  const menu = document.getElementById("camp-prototype-interaction-menu");
  if (!cible || !menu) {
    fermerMenuInteractionCampPrototype();
    return false;
  }
  const resultat = peutDemolirCibleCampPrototype(cible);
  if (!resultat.valide) {
    fermerMenuInteractionCampPrototype();
    definirMessageCampPrototype(resultat.raison);
    return false;
  }
  const interactionUid = cleCibleDemolitionCampPrototype(cible.uid, cible.kind);
  const conserverOuvert = Boolean(options && options.conserverOuvert);
  if (campPrototypeInteractionUid === interactionUid && !menu.hidden && !conserverOuvert) {
    fermerMenuInteractionCampPrototype();
    return false;
  }
  fermerMenuInteractionCampPrototype();
  menu.style.left = ((cible.x + cible.width / 2) / campPrototypeApi.GRID_WIDTH * 100) + "%";
  menu.style.top = (cible.y / campPrototypeApi.GRID_HEIGHT * 100) + "%";
  menu.dataset.obstacleUid = cible.uid;
  menu.dataset.demolitionTargetKind = cible.kind;
  if (cible.kind === "layout") menu.dataset.campUid = cible.uid;
  menu.dataset.interactionKind = "demolition";
  menu.setAttribute("aria-label", cible.label + " actions");
  const demolition = demolitionCampPrototypePourCible(cible.uid, cible.kind);
  if (demolition) {
    if (demolition.readyToClaim) {
      const reward = cible.reward;
      const rewardHtml = reward
        ? '<span class="camp-junk-reward"><img src="'
          + echapperAttributHtml(iconeRessourceCamp(reward.resourceId)) + '" alt="">×'
          + Math.max(0, Number(reward.quantity) || 0) + '</span>'
        : '';
      menu.innerHTML = '<button type="button" class="camp-task-claim-action" role="menuitem"'
        + ' data-camp-menu-action="claim" aria-label="Validate cleanup of '
        + echapperAttributHtml(cible.label) + '">' + rewardHtml
        + '<span aria-hidden="true">✓</span><strong>Validate</strong></button>';
    } else {
      menu.innerHTML = '<span class="camp-prototype-demolition-menu-status">'
        + '<span aria-hidden="true">⏱</span> '
        + '<span data-camp-demolition-menu-timer>'
        + formaterTemps(Math.max(0, demolition.duree - (Date.now() - demolition.startTs) / 1000))
        + '</span></span>'
        + (manualFocusDebloque()
          ? '<button type="button" class="camp-task-manual-focus-action" role="menuitem"'
            + ' data-camp-menu-action="manual-focus" aria-label="Manual Focus on clearing '
            + echapperAttributHtml(cible.label) + '">Focus</button>'
          : '');
    }
  } else {
    menu.innerHTML = '<button type="button" class="camp-prototype-demolition-action" role="menuitem"'
      + ' data-camp-menu-action="demolition"'
      + ' aria-label="Demolish ' + echapperAttributHtml(cible.label)
      + '"><img src="img/interface/Trash_Final.png?v=0.0001" alt=""></button>';
  }
  const declencheur = document.querySelector(
    cible.kind === "layout"
      ? '[data-camp-uid="' + cible.uid + '"]'
      : '[data-camp-obstacle-uid="' + cible.uid + '"]'
  );
  if (declencheur) declencheur.setAttribute("aria-expanded", "true");
  campPrototypeInteractionUid = interactionUid;
  menu.hidden = false;
  return true;
}

function rafraichirMenuInteractionCampPrototype() {
  const menu = document.getElementById("camp-prototype-interaction-menu");
  if (!menu || menu.hidden) return false;
  const interactionKind = menu.dataset.interactionKind;
  const campUid = menu.dataset.campUid;
  const obstacleUid = menu.dataset.obstacleUid;
  const demolitionTargetKind = menu.dataset.demolitionTargetKind;
  const boutonActif = menu.contains(document.activeElement)
    && document.activeElement.dataset
      ? document.activeElement.dataset.campMenuAction || null
      : null;
  const restaure = interactionKind === "building"
    ? ouvrirMenuInteractionCampPrototype(campUid, { conserverOuvert: true })
    : (interactionKind === "demolition"
        ? ouvrirMenuDemolitionCampPrototype(
            obstacleUid,
            demolitionTargetKind,
            { conserverOuvert: true }
          )
        : false);
  if (!restaure) {
    fermerMenuInteractionCampPrototype();
    return false;
  }
  synchroniserDeclencheurMenuCampPrototype();
  if (boutonActif) {
    const nouveauBouton = menu.querySelector('[data-camp-menu-action="' + boutonActif + '"]');
    if (nouveauBouton) nouveauBouton.focus({ preventScroll: true });
  }
  return true;
}

function ouvrirWorkDepuisCamp(event) {
  if (event) {
    event.preventDefault();
    event.stopPropagation();
  }
  const menu = document.getElementById("camp-prototype-interaction-menu");
  const famille = menu && menu.dataset.workFamily;
  const buildingId = menu && menu.dataset.campBuildingId;
  if (!["wood", "food", "rock"].includes(famille) || !buildingId) return false;
  const capacite = capaciteBatimentCamp(buildingId, 1);
  if (!capacite.available) {
    fermerMenuInteractionCampPrototype();
    definirMessageCampPrototype(capacite.reason);
    return false;
  }
  fermerMenuInteractionCampPrototype();
  changerOnglet("work");
  appliquerFiltreWork(famille);
  requestAnimationFrame(function() {
    const filtre = document.getElementById("filtre-work-" + famille);
    if (filtre) filtre.focus();
  });
  return true;
}

function ouvrirFonctionDepuisCamp(event) {
  if (event) {
    event.preventDefault();
    event.stopPropagation();
  }
  const menu = document.getElementById("camp-prototype-interaction-menu");
  const fonction = menu && menu.dataset.campFunction;
  const buildingId = menu && menu.dataset.campBuildingId;
  const item = menu && itemCampPrototype(menu.dataset.campUid);
  if (!fonction || !buildingId) return false;
  const capacite = capaciteBatimentCamp(buildingId, 1, {
    item: item,
    contentUnlocked: contenuBatimentCampDebloque(buildingId)
  });
  if (!capacite.available) {
    fermerMenuInteractionCampPrototype();
    definirMessageCampPrototype(capacite.reason);
    return false;
  }
  fermerMenuInteractionCampPrototype();
  if (fonction === "explorations") changerOnglet("explorations");
  else if (fonction === "inventory") changerOnglet("inventaire");
  else {
    changerOnglet("facilities");
    if (fonction === "training" || fonction === "lab") {
      selectionnerVueFacilitiesMobile(fonction);
    } else {
      selectionnerVueFacilitiesMobile("jobs");
    }
  }
  return true;
}

function ouvrirModalConstructionMaisonCamp() {
  const placement = campPrototypePlacementEnCours;
  const type = placement && typeCampPrototype(placement.type);
  const resultat = actualiserValiditePlacementCampPrototype();
  if (
    !placement
    || placement.mode !== "new"
    || !type
    || type.category !== "house"
    || !resultat
    || !resultat.valide
    || !maisonCampDebloquee(type.id)
    || !ressourcesMaisonCampSuffisantes(type.id)
    || !kittyDisponibleConstructionMaisonCamp()
  ) {
    definirMessageCampPrototype("This house cannot be built yet.");
    actualiserCommandesCampPrototype();
    return false;
  }
  campPrototypeModeEdition = false;
  campPrototypeCategorieOuverte = null;
  campPrototypeTypeAPlacer = null;
  campPrototypeRotationAPlacer = 0;
  campPrototypeGommeRoutes = false;
  campPrototypeSelectionUid = null;
  campPrototypePointeur = null;
  annulerAppuiProlongeCampPrototype();
  campPrototypeConstructionMaisonTypeId = type.id;
  renduCampPrototype();
  renduModalConstructionMaisonCamp();
  ouvrirDialogueModal("camp-house-construction-modal", {
    dismissible: true,
    fermer: fermerModalConstructionMaisonCamp,
    focusSelector: ".camp-demolition-kitty[data-clavier-clic]",
    returnFocusSelector: '[data-camp-category="house"]'
  });
  return true;
}

function fermerModalConstructionMaisonCamp() {
  const placement = campPrototypePlacementEnCours;
  const annulerPlacement = Boolean(
    placement
    && placement.mode === "new"
    && placement.type === campPrototypeConstructionMaisonTypeId
  );
  campPrototypeConstructionMaisonTypeId = null;
  fermerDialogueModal("camp-house-construction-modal");
  if (!annulerPlacement) return;
  campPrototypePlacementEnCours = null;
  campPrototypeSelectionUid = null;
  campPrototypeTypeAPlacer = null;
  campPrototypeRotationAPlacer = 0;
  masquerApercuCampPrototype();
  definirMessageCampPrototype("House placement cancelled.");
  renduCampPrototype();
}

function renduModalConstructionMaisonCamp() {
  const typeId = campPrototypeConstructionMaisonTypeId;
  const type = typeCampPrototype(typeId);
  const contenu = document.getElementById("camp-house-construction-modal-kitties");
  const duree = CAMP_HOUSE_CONSTRUCTION_DURATIONS[typeId];
  const cout = coutMaisonCamp(typeId);
  if (!type || !contenu || !duree || !cout) return;
  ecrireTexte(
    document.getElementById("camp-house-construction-modal-title"),
    "Assign a Cat to build " + type.label
  );
  ecrireTexte(
    document.getElementById("camp-house-construction-modal-summary"),
    "Construction time · " + formaterTemps(duree)
      + " · Cost " + cout.cardboardPlanks + " Cardboard Plank"
      + (cout.cardboardPlanks === 1 ? "" : "s")
  );
  let html = "";
  etat.kittiesData.forEach(function(kitty, kittyIndex) {
    if (!kitty || estIngenieur(kitty) || estBernardoSuperviseur(kitty)) return;
    const busy = kittyIsBusy(kittyIndex) || kittyIsInExplorationStaging(kittyIndex);
    const status = busy ? kittyAllocationLabel(kittyIndex).text : "Available";
    const tier = TIERS_KITTIES[kitty.tier] || "Kitty";
    html += '<div class="camp-demolition-kitty'
      + (busy ? ' camp-demolition-kitty-disabled' : '') + '"'
      + (busy
        ? ' aria-disabled="true"'
        : attributsActivationClavier("Assign " + kitty.nom + " to build " + type.label)
          + ' onclick="selectionnerKittyConstructionMaisonCamp(' + kittyIndex + ')"')
      + '><span class="camp-demolition-kitty-icon">' + kittyIconHtml(kitty) + '</span>'
      + '<span class="camp-demolition-kitty-copy"><strong>' + echapperAttributHtml(kitty.nom)
      + '</strong><small>' + echapperAttributHtml(tier) + ' · Level ' + (kitty.niveau || 0)
      + '</small></span><span class="camp-demolition-kitty-status">'
      + echapperAttributHtml(status) + '</span></div>';
  });
  contenu.innerHTML = html
    || '<p class="camp-demolition-empty">No Cat is available to build this house.</p>';
}

function selectionnerKittyConstructionMaisonCamp(kittyIndex) {
  const placement = campPrototypePlacementEnCours;
  const typeId = campPrototypeConstructionMaisonTypeId;
  const type = placement && typeCampPrototype(placement.type);
  const duree = CAMP_HOUSE_CONSTRUCTION_DURATIONS[typeId];
  const cout = coutMaisonCamp(typeId);
  const resultat = actualiserValiditePlacementCampPrototype();
  if (
    !placement
    || placement.mode !== "new"
    || !type
    || type.id !== typeId
    || type.category !== "house"
    || !resultat
    || !resultat.valide
    || !duree
    || !cout
    || !ressourcesMaisonCampSuffisantes(typeId)
    || !kittyPeutExecuterTacheCamp(kittyIndex)
  ) return false;
  const item = {
    uid: nouvelleUidCampPrototype(),
    type: typeId,
    tier: 1,
    x: placement.x,
    y: placement.y,
    construit: false
  };
  if (type.rotatable) item.rotation = placement.rotation;
  const kitty = etat.kittiesData[kittyIndex];
  etat.cardboardPlanks -= cout.cardboardPlanks;
  if (!etat.camp.houseConstructions || typeof etat.camp.houseConstructions !== "object") {
    etat.camp.houseConstructions = {};
  }
  etat.camp.houseConstructions[item.uid] = {
    type: typeId,
    kittyIndex: kittyIndex,
    startTs: Date.now(),
    duree: duree,
    coutCardboardPlanks: cout.cardboardPlanks,
    readyToClaim: false
  };
  campPrototypeLayout.push(item);
  campPrototypePlacementEnCours = null;
  campPrototypeSelectionUid = null;
  campPrototypeTypeAPlacer = null;
  campPrototypeRotationAPlacer = 0;
  fermerModalConstructionMaisonCamp();
  masquerApercuCampPrototype();
  invaliderConnexionsCampPrototype();
  ajouterLog("event", kitty.nom + " started building " + type.label + " at Base Camp.");
  definirMessageCampPrototype(kitty.nom + " is building " + type.label
    + " · " + formaterTemps(duree) + " remaining.");
  sauvegarderCampPrototype();
  sauvegarder();
  renduCampPrototype();
  renduManagement();
  return true;
}

function ressourcesConstructionBatimentCampSuffisantes(typeId) {
  const config = CAMP_BUILDING_CONSTRUCTION_CONFIG[typeId];
  return Boolean(config && Object.keys(config.costs).every(function(resourceId) {
    return (Number(etat[resourceId]) || 0) >= Number(config.costs[resourceId]);
  }));
}

function coutConstructionBatimentCampTexte(typeId) {
  const config = CAMP_BUILDING_CONSTRUCTION_CONFIG[typeId];
  return Object.keys(config && config.costs || {}).map(function(resourceId) {
    return config.costs[resourceId] + " " + libelleRessourceCamp(resourceId);
  }).join(" + ");
}

function preparerPlacementBatimentCamp(typeId) {
  const type = typeCampPrototype(typeId);
  const existant = typeId === "storage" ? null : itemCampPrototypeParType(typeId);
  if (!type || !CAMP_BUILDING_CONSTRUCTION_CONFIG[typeId] || !contenuBatimentCampDebloque(typeId)) return false;
  changerOnglet("camp");
  if (existant) {
    campPrototypeSelectionUid = existant.uid;
    definirMessageCampPrototype(type.label + " is already placed in the Camp.");
    renduCampPrototype();
    return true;
  }
  campPrototypeModeEdition = true;
  campPrototypeCategorieOuverte = null;
  campPrototypeTypeAPlacer = typeId;
  campPrototypeRotationAPlacer = 0;
  campPrototypeSelectionUid = null;
  campPrototypeGommeRoutes = false;
  commencerNouveauPlacementCampPrototype(typeId);
  renduCampPrototype();
  definirMessageCampPrototype("Choose where to place " + type.label + ", then confirm.");
  return true;
}

function ouvrirModalConstructionBatimentCamp() {
  const placement = campPrototypePlacementEnCours;
  const type = placement && typeCampPrototype(placement.type);
  const config = type && CAMP_BUILDING_CONSTRUCTION_CONFIG[type.id];
  const resultat = actualiserValiditePlacementCampPrototype();
  if (!placement || placement.mode !== "new" || !type || !config
      || !resultat || !resultat.valide || !contenuBatimentCampDebloque(type.id)) return false;
  if (batimentCampDejaPossede(type.id)) {
    const item = {
      uid: nouvelleUidCampPrototype(), type: type.id, tier: 1,
      x: placement.x, y: placement.y, construit: true
    };
    if (type.rotatable) item.rotation = placement.rotation;
    campPrototypeLayout.push(item);
    campPrototypePlacementEnCours = null;
    campPrototypeTypeAPlacer = null;
    sauvegarderCampPrototype();
    masquerApercuCampPrototype();
    quitterEditionCampPrototype(false);
    definirMessageCampPrototype(type.label + " restored in the Camp without paying its cost again.");
    return true;
  }
  if (!ressourcesConstructionBatimentCampSuffisantes(type.id)) {
    definirMessageCampPrototype("Not enough resources to build " + type.label + ".");
    return false;
  }
  campPrototypeModeEdition = false;
  campPrototypeCategorieOuverte = null;
  campPrototypeTypeAPlacer = null;
  campPrototypeRotationAPlacer = 0;
  campPrototypeSelectionUid = null;
  campPrototypePointeur = null;
  annulerAppuiProlongeCampPrototype();
  campPrototypeConstructionBatimentTypeId = type.id;
  renduCampPrototype();
  renduModalConstructionBatimentCamp();
  ouvrirDialogueModal("camp-building-construction-modal", {
    dismissible: true,
    fermer: fermerModalConstructionBatimentCamp,
    focusSelector: ".camp-demolition-kitty[data-clavier-clic]",
    returnFocusSelector: '[data-camp-category="building"]'
  });
  return true;
}

function fermerModalConstructionBatimentCamp() {
  const placement = campPrototypePlacementEnCours;
  const annulerPlacement = Boolean(placement && placement.mode === "new"
    && placement.type === campPrototypeConstructionBatimentTypeId);
  campPrototypeConstructionBatimentTypeId = null;
  fermerDialogueModal("camp-building-construction-modal");
  if (!annulerPlacement) return;
  campPrototypePlacementEnCours = null;
  campPrototypeTypeAPlacer = null;
  masquerApercuCampPrototype();
  definirMessageCampPrototype("Building placement cancelled.");
  renduCampPrototype();
}

function renduModalConstructionBatimentCamp() {
  const typeId = campPrototypeConstructionBatimentTypeId;
  const type = typeCampPrototype(typeId);
  const config = CAMP_BUILDING_CONSTRUCTION_CONFIG[typeId];
  const contenu = document.getElementById("camp-building-construction-modal-kitties");
  if (!type || !config || !contenu) return;
  ecrireTexte(document.getElementById("camp-building-construction-modal-title"),
    "Assign a Cat to build " + type.label);
  ecrireTexte(document.getElementById("camp-building-construction-modal-summary"),
    coutConstructionBatimentCampTexte(typeId) + " · 1 Cat · " + formaterTemps(config.duration));
  let html = "";
  etat.kittiesData.forEach(function(kitty, kittyIndex) {
    if (!kitty || estIngenieur(kitty) || estBernardoSuperviseur(kitty)) return;
    const busy = kittyIsBusy(kittyIndex) || kittyIsInExplorationStaging(kittyIndex);
    const status = busy ? kittyAllocationLabel(kittyIndex).text : "Available";
    html += '<div class="camp-demolition-kitty' + (busy ? ' camp-demolition-kitty-disabled' : '') + '"'
      + (busy ? ' aria-disabled="true"' : attributsActivationClavier("Assign " + kitty.nom + " to build " + type.label)
        + ' onclick="selectionnerKittyConstructionBatimentCamp(' + kittyIndex + ')"') + '>'
      + '<span class="camp-demolition-kitty-icon">' + kittyIconHtml(kitty) + '</span>'
      + '<span class="camp-demolition-kitty-copy"><strong>' + echapperAttributHtml(kitty.nom)
      + '</strong><small>Level ' + (kitty.niveau || 0) + '</small></span>'
      + '<span class="camp-demolition-kitty-status">' + echapperAttributHtml(status) + '</span></div>';
  });
  contenu.innerHTML = html || '<p class="camp-demolition-empty">No Cat is available to build this facility.</p>';
}

function selectionnerKittyConstructionBatimentCamp(kittyIndex) {
  const placement = campPrototypePlacementEnCours;
  const typeId = campPrototypeConstructionBatimentTypeId;
  const type = placement && typeCampPrototype(placement.type);
  const config = CAMP_BUILDING_CONSTRUCTION_CONFIG[typeId];
  const resultat = actualiserValiditePlacementCampPrototype();
  if (!placement || placement.mode !== "new" || !type || type.id !== typeId || !config
      || !resultat || !resultat.valide || !ressourcesConstructionBatimentCampSuffisantes(typeId)
      || !kittyPeutExecuterTacheCamp(kittyIndex)) return false;
  const item = {
    uid: nouvelleUidCampPrototype(), type: typeId, tier: 1,
    x: placement.x, y: placement.y, construit: false
  };
  if (type.rotatable) item.rotation = placement.rotation;
  Object.keys(config.costs).forEach(function(resourceId) {
    etat[resourceId] -= config.costs[resourceId];
  });
  etat.camp.constructions[item.uid] = {
    type: typeId,
    kittyIndex: kittyIndex,
    startTs: Date.now(),
    duration: config.duration,
    costs: Object.assign({}, config.costs),
    readyToClaim: false
  };
  campPrototypeLayout.push(item);
  campPrototypePlacementEnCours = null;
  campPrototypeTypeAPlacer = null;
  const kitty = etat.kittiesData[kittyIndex];
  fermerModalConstructionBatimentCamp();
  masquerApercuCampPrototype();
  invaliderConnexionsCampPrototype();
  ajouterLog("event", kitty.nom + " started building " + type.label + " at Base Camp.");
  definirMessageCampPrototype(type.label + " construction in progress · "
    + formaterTemps(config.duration) + " remaining.");
  sauvegarderCampPrototype();
  sauvegarder();
  renduCampPrototype();
  renduManagement();
  return true;
}

function prochaineAmeliorationCamp(item) {
  if (!item) return null;
  const targetTier = (item.tier || 1) + 1;
  const config = configurationAmeliorationCamp(item.type, targetTier);
  if (!config) return null;
  const familyId = CAMP_PROTOTYPE_WORK_FAMILY_BY_TYPE[item.type];
  const pertinente = item.type === "storage" || RESOURCE_PAIRS.some(function(pair) {
    return pair.family === familyId
      && pair.tier === targetTier
      && recetteWorkContenuDebloque(pair, unlocks());
  });
  return pertinente ? {
    targetTier: targetTier,
    duration: config.duration,
    costs: config.costs
  } : null;
}

function libelleRessourceCamp(resourceId) {
  return {
    cardboardPlanks: "Cardboard Planks",
    basicWoodPlanks: "Basic Wood Planks",
    pebbleBricks: "Pebble Bricks",
    rockBricks: "Rock Bricks"
  }[resourceId] || resourceId;
}

function iconeRessourceCamp(resourceId) {
  return {
    cardboardPlanks: "img/resources/Cardboard Plank_Final.png",
    basicWoodPlanks: "img/resources/Basic Wood Plank_Final.png",
    pebbleBricks: "img/resources/Pebble Brick_Final.png",
    rockBricks: "img/resources/Rock Brick_Final.png"
  }[resourceId] || "";
}

function ressourcesAmeliorationCampSuffisantes(upgrade) {
  return Boolean(upgrade && Object.keys(upgrade.costs || {}).every(function(resourceId) {
    return (Number(etat[resourceId]) || 0) >= (Number(upgrade.costs[resourceId]) || 0);
  }));
}

function coutAmeliorationCampTexte(upgrade) {
  return Object.keys(upgrade && upgrade.costs || {}).map(function(resourceId) {
    return upgrade.costs[resourceId] + " " + libelleRessourceCamp(resourceId);
  }).join(" + ");
}

function ouvrirModalAmeliorationCamp(event) {
  if (event) {
    event.preventDefault();
    event.stopPropagation();
  }
  const menu = document.getElementById("camp-prototype-interaction-menu");
  const uid = menu && menu.dataset.campUid;
  const item = itemCampPrototype(uid);
  const upgrade = prochaineAmeliorationCamp(item);
  const capacite = item && capaciteBatimentCamp(item.type, item.tier || 1, { item: item });
  if (!item || !upgrade || !capacite.available || ameliorationCampPourItem(uid)) {
    fermerMenuInteractionCampPrototype();
    return false;
  }
  campPrototypeUpgradeUid = uid;
  fermerMenuInteractionCampPrototype();
  renduModalAmeliorationCamp();
  ouvrirDialogueModal("camp-upgrade-modal", {
    dismissible: true,
    fermer: fermerModalAmeliorationCamp,
    focusSelector: ".camp-demolition-kitty[data-clavier-clic]",
    returnFocusSelector: '[data-camp-uid="' + uid + '"]'
  });
  return true;
}

function fermerModalAmeliorationCamp() {
  campPrototypeUpgradeUid = null;
  fermerDialogueModal("camp-upgrade-modal");
}

function renduModalAmeliorationCamp() {
  const item = itemCampPrototype(campPrototypeUpgradeUid);
  const type = item && typeCampPrototype(item.type);
  const upgrade = prochaineAmeliorationCamp(item);
  const contenu = document.getElementById("camp-upgrade-modal-kitties");
  if (!item || !type || !upgrade || !contenu) return;
  const ressourcesOk = ressourcesAmeliorationCampSuffisantes(upgrade);
  ecrireTexte(document.getElementById("camp-upgrade-modal-title"),
    "Upgrade " + type.label + " to Tier " + upgrade.targetTier);
  ecrireTexte(document.getElementById("camp-upgrade-modal-summary"),
    coutAmeliorationCampTexte(upgrade) + " · 1 Cat · " + formaterTemps(upgrade.duration)
      + (ressourcesOk ? "" : " · Not enough resources"));
  let html = "";
  etat.kittiesData.forEach(function(kitty, kittyIndex) {
    if (!kitty || estIngenieur(kitty) || estBernardoSuperviseur(kitty)) return;
    const busy = kittyIsBusy(kittyIndex) || kittyIsInExplorationStaging(kittyIndex);
    const disabled = busy || !ressourcesOk;
    const status = !ressourcesOk ? "Resources missing" : (busy ? kittyAllocationLabel(kittyIndex).text : "Available");
    html += '<div class="camp-demolition-kitty' + (disabled ? ' camp-demolition-kitty-disabled' : '') + '"'
      + (disabled ? ' aria-disabled="true"' : attributsActivationClavier("Assign " + kitty.nom + " to upgrade " + type.label)
        + ' onclick="selectionnerKittyAmeliorationCamp(' + kittyIndex + ')"') + '>'
      + '<span class="camp-demolition-kitty-icon">' + kittyIconHtml(kitty) + '</span>'
      + '<span class="camp-demolition-kitty-copy"><strong>' + echapperAttributHtml(kitty.nom)
      + '</strong><small>Level ' + (kitty.niveau || 0) + '</small></span>'
      + '<span class="camp-demolition-kitty-status">' + echapperAttributHtml(status) + '</span></div>';
  });
  contenu.innerHTML = html || '<p class="camp-demolition-empty">No Cat is available for this upgrade.</p>';
}

function selectionnerKittyAmeliorationCamp(kittyIndex) {
  const item = itemCampPrototype(campPrototypeUpgradeUid);
  const type = item && typeCampPrototype(item.type);
  const upgrade = prochaineAmeliorationCamp(item);
  const capacite = item && capaciteBatimentCamp(item.type, item.tier || 1, { item: item });
  if (!item || !type || !upgrade || !capacite.available
      || !ressourcesAmeliorationCampSuffisantes(upgrade)
      || !kittyPeutExecuterTacheCamp(kittyIndex)
      || ameliorationCampPourItem(item.uid)) return false;
  Object.keys(upgrade.costs).forEach(function(resourceId) {
    etat[resourceId] -= upgrade.costs[resourceId];
  });
  etat.camp.upgrades[item.uid] = {
    type: item.type,
    kittyIndex: kittyIndex,
    startTier: item.tier || 1,
    targetTier: upgrade.targetTier,
    startTs: Date.now(),
    duration: upgrade.duration,
    costs: Object.assign({}, upgrade.costs),
    readyToClaim: false
  };
  const kitty = etat.kittiesData[kittyIndex];
  fermerModalAmeliorationCamp();
  ajouterLog("event", kitty.nom + " started upgrading " + type.label
    + " to Tier " + upgrade.targetTier + ".");
  definirMessageCampPrototype(type.label + " upgrade in progress · "
    + formaterTemps(upgrade.duration) + " remaining.");
  sauvegarder();
  rendu();
  renduCampPrototype();
  renduManagement();
  return true;
}

function ouvrirModalReparationCamp(event, buildingIdForce, uidForce) {
  if (event) {
    event.preventDefault();
    event.stopPropagation();
  }
  const menu = document.getElementById("camp-prototype-interaction-menu");
  const buildingId = buildingIdForce || (menu && menu.dataset.campBuildingId);
  const uid = uidForce || (menu && menu.dataset.campUid);
  const item = itemCampPrototype(uid);
  if (
    !item
    || item.type !== buildingId
    || !CAMP_BUILDING_REPAIR_DURATIONS[buildingId]
    || !reparationCampDebloquee(buildingId)
    || batimentCampRepare(buildingId)
    || reparationCampPourBatiment(buildingId)
    || !itemAccessibleDepuisCamp(item)
  ) {
    fermerMenuInteractionCampPrototype();
    return false;
  }
  campPrototypeRepairBuildingId = buildingId;
  campPrototypeRepairUid = uid;
  fermerMenuInteractionCampPrototype();
  renduModalReparationCamp();
  ouvrirDialogueModal("camp-repair-modal", {
    dismissible: true,
    fermer: fermerModalReparationCamp,
    focusSelector: ".camp-demolition-kitty[data-clavier-clic]",
    returnFocusSelector: '[data-camp-uid="' + uid + '"]'
  });
  return true;
}

function fermerModalReparationCamp() {
  campPrototypeRepairBuildingId = null;
  campPrototypeRepairUid = null;
  fermerDialogueModal("camp-repair-modal");
}

function renduModalReparationCamp() {
  const buildingId = campPrototypeRepairBuildingId;
  const type = typeCampPrototype(buildingId);
  const contenu = document.getElementById("camp-repair-modal-kitties");
  const duree = CAMP_BUILDING_REPAIR_DURATIONS[buildingId];
  const coutAbordable = reparationCampAbordable(buildingId);
  if (!type || !contenu || !duree) return;
  ecrireTexte(
    document.getElementById("camp-repair-modal-title"),
    "Assign a Cat to repair " + type.label
  );
  ecrireTexte(
    document.getElementById("camp-repair-modal-summary"),
    "Repair time · " + formaterTemps(duree) + " · Cost · " + libelleCoutReparationCamp(buildingId)
  );
  let html = "";
  etat.kittiesData.forEach(function(kitty, kittyIndex) {
    if (!kitty || estIngenieur(kitty) || estBernardoSuperviseur(kitty)) return;
    const busy = kittyIsBusy(kittyIndex) || kittyIsInExplorationStaging(kittyIndex);
    const disabled = busy || !coutAbordable;
    const status = busy
      ? kittyAllocationLabel(kittyIndex).text
      : (coutAbordable ? "Available" : "Needs " + libelleCoutReparationCamp(buildingId));
    const tier = TIERS_KITTIES[kitty.tier] || "Kitty";
    html += '<div class="camp-demolition-kitty'
      + (disabled ? ' camp-demolition-kitty-disabled' : '') + '"'
      + (disabled
        ? ' aria-disabled="true"'
        : attributsActivationClavier("Assign " + kitty.nom + " to repair " + type.label)
          + ' onclick="selectionnerKittyReparationCamp(' + kittyIndex + ')"')
      + '><span class="camp-demolition-kitty-icon">' + kittyIconHtml(kitty) + '</span>'
      + '<span class="camp-demolition-kitty-copy"><strong>' + echapperAttributHtml(kitty.nom)
      + '</strong><small>' + echapperAttributHtml(tier) + ' · Level ' + (kitty.niveau || 0)
      + '</small></span><span class="camp-demolition-kitty-status">'
      + echapperAttributHtml(status) + '</span></div>';
  });
  contenu.innerHTML = html
    || '<p class="camp-demolition-empty">No Cat is available to repair this building.</p>';
}

function selectionnerKittyReparationCamp(kittyIndex) {
  const buildingId = campPrototypeRepairBuildingId;
  const type = typeCampPrototype(buildingId);
  const duree = CAMP_BUILDING_REPAIR_DURATIONS[buildingId];
  if (
    !type
    || !duree
    || !kittyPeutExecuterTacheCamp(kittyIndex)
    || batimentCampRepare(buildingId)
    || reparationCampPourBatiment(buildingId)
    || !itemAccessibleDepuisCamp(itemCampPrototype(campPrototypeRepairUid))
  ) return false;
  if (!reparationCampAbordable(buildingId)) {
    afficherNotification("Not enough resources · " + libelleCoutReparationCamp(buildingId) + " required.");
    renduModalReparationCamp();
    return false;
  }
  const kitty = etat.kittiesData[kittyIndex];
  if (!etat.camp.repairs || typeof etat.camp.repairs !== "object") {
    etat.camp.repairs = {};
  }
  etat.camp.repairs[buildingId] = {
    kittyIndex: kittyIndex,
    startTs: Date.now(),
    duree: duree,
    readyToClaim: false
  };
  const couts = coutsReparationCamp(buildingId);
  Object.keys(couts).forEach(function(resourceId) {
    etat[resourceId] -= couts[resourceId];
  });
  fermerModalReparationCamp();
  jouerSonReparation();
  ajouterLog("event", kitty.nom + " started repairing " + type.label + " at Base Camp.");
  definirMessageCampPrototype(kitty.nom + " is repairing " + type.label
    + " · " + formaterTemps(duree) + " remaining.");
  sauvegarder();
  renduCampPrototype();
  renduManagement();
  return true;
}

function ouvrirModalDemolitionCamp(event) {
  if (event) {
    event.preventDefault();
    event.stopPropagation();
  }
  const menu = document.getElementById("camp-prototype-interaction-menu");
  const targetUid = menu && menu.dataset.obstacleUid;
  const targetKind = menu && menu.dataset.demolitionTargetKind;
  const cible = cibleDemolitionCampPrototype(
    targetUid,
    targetKind
  );
  const resultat = peutDemolirCibleCampPrototype(cible);
  if (
    !cible
    || !resultat.valide
    || demolitionCampPrototypePourCible(targetUid, targetKind)
  ) {
    fermerMenuInteractionCampPrototype();
    return false;
  }
  campPrototypeDemolitionObstacleUid = targetUid;
  campPrototypeDemolitionTargetKind = cible.kind;
  fermerMenuInteractionCampPrototype();
  renduModalDemolitionCamp();
  ouvrirDialogueModal("camp-demolition-modal", {
    dismissible: true,
    fermer: fermerModalDemolitionCamp,
    focusSelector: ".camp-demolition-kitty[data-clavier-clic]",
    returnFocusSelector: cible.kind === "layout"
      ? '[data-camp-uid="' + targetUid + '"]'
      : '[data-camp-obstacle-uid="' + targetUid + '"]'
  });
  return true;
}

function fermerModalDemolitionCamp() {
  campPrototypeDemolitionObstacleUid = null;
  campPrototypeDemolitionTargetKind = null;
  fermerDialogueModal("camp-demolition-modal");
}

function renduModalDemolitionCamp() {
  const obstacle = cibleDemolitionCampPrototype(
    campPrototypeDemolitionObstacleUid,
    campPrototypeDemolitionTargetKind
  );
  const contenu = document.getElementById("camp-demolition-modal-kitties");
  if (!obstacle || !contenu) return;
  const duree = campPrototypeApi.dureeDemolitionObstacle(obstacle);
  const minLevel = niveauMinimumCibleDemolition(obstacle);
  ecrireTexte(
    document.getElementById("camp-demolition-modal-title"),
    "Assign a Cat to demolish " + obstacle.label
  );
  ecrireTexte(
    document.getElementById("camp-demolition-modal-summary"),
    obstacle.cells.length + (obstacle.cells.length === 1 ? " cell" : " cells")
      + " · " + formaterTemps(duree) + " · Cat level " + minLevel + "+"
  );
  let html = "";
  etat.kittiesData.forEach(function(kitty, kittyIndex) {
    if (!kitty || estIngenieur(kitty) || estBernardoSuperviseur(kitty)) return;
    const busy = kittyIsBusy(kittyIndex) || kittyIsInExplorationStaging(kittyIndex);
    const levelTooLow = (Number(kitty.niveau) || 0) < minLevel;
    const disabled = busy || levelTooLow;
    const status = busy
      ? kittyAllocationLabel(kittyIndex).text
      : (levelTooLow ? "Requires level " + minLevel : "Available");
    const tier = TIERS_KITTIES[kitty.tier] || "Kitty";
    html += '<div class="camp-demolition-kitty' + (disabled ? ' camp-demolition-kitty-disabled' : '') + '"'
      + (disabled
        ? ' aria-disabled="true"'
        : attributsActivationClavier("Assign " + kitty.nom + " to demolish " + obstacle.label)
          + ' onclick="selectionnerKittyDemolitionCamp(' + kittyIndex + ')"')
      + '><span class="camp-demolition-kitty-icon">' + kittyIconHtml(kitty) + '</span>'
      + '<span class="camp-demolition-kitty-copy"><strong>' + echapperAttributHtml(kitty.nom)
      + '</strong><small>' + echapperAttributHtml(tier) + ' · Level ' + (kitty.niveau || 0)
      + '</small></span><span class="camp-demolition-kitty-status">'
      + echapperAttributHtml(status) + '</span></div>';
  });
  contenu.innerHTML = html || '<p class="camp-demolition-empty">No Cat can demolish this obstacle yet.</p>';
}

function selectionnerKittyDemolitionCamp(kittyIndex) {
  const obstacle = cibleDemolitionCampPrototype(
    campPrototypeDemolitionObstacleUid,
    campPrototypeDemolitionTargetKind
  );
  if (
    !obstacle
    || !kittyPeutExecuterTacheCamp(kittyIndex, niveauMinimumCibleDemolition(obstacle))
    || demolitionCampPrototypePourCible(obstacle.uid, obstacle.kind)
  ) return false;
  const resultat = peutDemolirCibleCampPrototype(obstacle);
  if (!resultat.valide) return false;
  const duree = campPrototypeApi.dureeDemolitionObstacle(obstacle);
  if (!duree) return false;
  const kitty = etat.kittiesData[kittyIndex];
  campPrototypeDemolitions.push({
    obstacleUid: obstacle.uid,
    targetKind: obstacle.kind,
    kittyIndex: kittyIndex,
    startTs: Date.now(),
    duree: duree,
    readyToClaim: false
  });
  sauvegarderDemolitionsCampPrototype();
  jouerSonAffectation();
  ajouterLog("event", kitty.nom + " started demolishing " + obstacle.label
    + " at Base Camp (" + formaterTemps(duree) + ").");
  sauvegarder();
  fermerModalDemolitionCamp();
  definirMessageCampPrototype(kitty.nom + " is demolishing " + obstacle.label
    + ". Time remaining: " + formaterTemps(duree) + ".");
  rendu();
  renduManagement();
  return true;
}

function terminerDemolitionsCampPrototype(maintenant) {
  if (campPrototypeDemolitionsActives().length === 0) return false;
  const timestamp = Number.isFinite(maintenant) ? maintenant : Date.now();
  const terminees = campPrototypeDemolitionsActives().filter(function(demolition) {
    return !demolition.readyToClaim
      && (timestamp - demolition.startTs) / 1000 >= demolition.duree;
  });
  if (terminees.length === 0) return false;
  terminees.forEach(function(demolition) {
    demolition.readyToClaim = true;
  });
  sauvegarderCampPrototype();
  campPrototypeDerniereSecondeDemolition = null;
  if ((document.body.dataset.ongletActif || "gang") === "camp") {
    renduCampPrototype();
  }
  return true;
}

function validerDemolitionCampPrototype(uid, targetKind) {
  const demolition = demolitionCampPrototypePourCible(uid, targetKind);
  if (!demolition || !demolition.readyToClaim) return false;
  const obstacle = cibleDemolitionCampPrototype(uid, targetKind);
  const kitty = etat.kittiesData[demolition.kittyIndex];
  if (!obstacle) {
    campPrototypeDemolitions = campPrototypeDemolitionsActives().filter(function(job) {
      return job !== demolition;
    });
    sauvegarderCampPrototype();
    return false;
  }
  if (obstacle.kind === "terrain") {
    const resultat = campPrototypeApi.debroussaillerTerrain(
      campPrototypeTerrain,
      obstacle.x,
      obstacle.y
    );
    if (!resultat.valide) return false;
    campPrototypeTerrain = resultat.terrain;
  } else {
    campPrototypeLayout = campPrototypeLayout.filter(function(item) {
      return item.uid !== obstacle.uid;
    });
  }
  const reward = obstacle.reward;
  if (reward && typeof etat[reward.resourceId] === "number") {
    etat[reward.resourceId] += Math.max(0, Number(reward.quantity) || 0);
    afficherNotification("Found " + reward.quantity + " "
      + libelleRessourceCamp(reward.resourceId) + " while clearing the junk!");
  }
  campPrototypeDemolitions = campPrototypeDemolitionsActives().filter(function(job) {
    return job !== demolition;
  });
  ajouterLog("event", (kitty ? kitty.nom : "A Cat") + " finished clearing "
    + obstacle.label + " at Base Camp.");
  afficherNotification("⛏ " + obstacle.label + " cleared at Base Camp!");
  invaliderConnexionsCampPrototype();
  sauvegarderCampPrototype();
  verifierObjectifs();
  rendu();
  renduCampPrototype();
  if ((document.body.dataset.ongletActif || "gang") === "gang") renduManagement();
  return true;
}

function renduCampPrototypeDynamique(maintenant) {
  if ((!DEV_MODE && !campDebloque()) || (document.body.dataset.ongletActif || "gang") !== "camp") return;
  const timestamp = Number.isFinite(maintenant) ? maintenant : Date.now();
  const seconde = Math.floor(timestamp / 1000);
  if (campPrototypeDerniereSecondeDemolition === seconde) return;
  campPrototypeDerniereSecondeDemolition = seconde;
  document.querySelectorAll("[data-camp-task-kitty-index]").forEach(function(worker) {
    const kittyIndex = Number(worker.dataset.campTaskKittyIndex);
    const tache = Number.isInteger(kittyIndex) ? tacheTemporeeCampPourKitty(kittyIndex) : null;
    const state = etatTacheTemporeeCamp(tache, timestamp);
    if (!state) return;
    worker.classList.toggle("camp-task-manual-focus-active", manualFocusTacheCampActif(tache));
    worker.style.setProperty("--camp-task-progress", (state.progress * 100).toFixed(2) + "%");
    const timer = worker.querySelector("[data-camp-task-timer]");
    if (timer) timer.textContent = formaterTemps(state.remaining);
  });
  document.querySelectorAll("[data-camp-repair-timer]").forEach(function(element) {
    const reparation = reparationCampPourBatiment(element.dataset.campRepairTimer);
    if (!reparation) return;
    const restant = Math.max(0, reparation.duree - (timestamp - reparation.startTs) / 1000);
    element.textContent = formaterTemps(restant);
  });
  const repairTimerMenu = document.querySelector("[data-camp-repair-menu-timer]");
  const repairMenu = document.getElementById("camp-prototype-interaction-menu");
  const reparationMenu = repairMenu
    && reparationCampPourBatiment(repairMenu.dataset.campBuildingId);
  if (repairTimerMenu && reparationMenu) {
    repairTimerMenu.textContent = formaterTemps(Math.max(
      0,
      reparationMenu.duree - (timestamp - reparationMenu.startTs) / 1000
    ));
  }
  document.querySelectorAll("[data-camp-upgrade-timer]").forEach(function(element) {
    const amelioration = ameliorationCampPourItem(element.dataset.campUpgradeTimer);
    if (!amelioration) return;
    element.textContent = formaterTemps(Math.max(
      0,
      amelioration.duration - (timestamp - amelioration.startTs) / 1000
    ));
  });
  const upgradeTimerMenu = document.querySelector("[data-camp-upgrade-menu-timer]");
  const upgradeMenu = repairMenu && ameliorationCampPourItem(repairMenu.dataset.campUid);
  if (upgradeTimerMenu && upgradeMenu) {
    upgradeTimerMenu.textContent = formaterTemps(Math.max(
      0,
      upgradeMenu.duration - (timestamp - upgradeMenu.startTs) / 1000
    ));
  }
  document.querySelectorAll("[data-camp-house-construction-timer]").forEach(function(element) {
    const construction = constructionMaisonCampPourItem(
      element.dataset.campHouseConstructionTimer
    );
    if (!construction) return;
    const restant = Math.max(
      0,
      construction.duree - (timestamp - construction.startTs) / 1000
    );
    element.textContent = formaterTemps(restant);
  });
  document.querySelectorAll("[data-camp-building-construction-timer]").forEach(function(element) {
    const construction = constructionBatimentCampPourItem(
      element.dataset.campBuildingConstructionTimer
    );
    if (!construction) return;
    element.textContent = formaterTemps(Math.max(
      0,
      construction.duration - (timestamp - construction.startTs) / 1000
    ));
  });
  document.querySelectorAll("[data-camp-demolition-timer]").forEach(function(element) {
    const demolition = demolitionCampPrototypePourCible(
      element.dataset.campDemolitionTimer,
      element.dataset.campDemolitionKind
    );
    if (!demolition) return;
    const restant = Math.max(0, demolition.duree - (timestamp - demolition.startTs) / 1000);
    element.textContent = formaterTemps(restant);
    const cible = element.closest("[data-camp-demolition-label]");
    if (cible) {
      cible.setAttribute(
        "aria-label",
        cible.dataset.campDemolitionLabel
          + ", demolition in progress, " + formaterTemps(restant) + " remaining"
      );
    }
  });
  const timerMenu = document.querySelector("[data-camp-demolition-menu-timer]");
  const menu = document.getElementById("camp-prototype-interaction-menu");
  const demolitionMenu = menu && demolitionCampPrototypePourCible(
    menu.dataset.obstacleUid,
    menu.dataset.demolitionTargetKind
  );
  if (timerMenu && demolitionMenu) {
    timerMenu.textContent = formaterTemps(Math.max(
      0,
      demolitionMenu.duree - (timestamp - demolitionMenu.startTs) / 1000
    ));
  }
}

function normaliserAreteClotureCampPrototype(edge) {
  if (!edge || !["horizontal", "vertical"].includes(edge.orientation)) return null;
  const x = Number(edge.x);
  const y = Number(edge.y);
  if (!Number.isInteger(x) || !Number.isInteger(y)) return null;
  const dansGrille = edge.orientation === "vertical"
    ? x >= 0 && x <= campPrototypeApi.GRID_WIDTH && y >= 0 && y < campPrototypeApi.GRID_HEIGHT
    : x >= 0 && x < campPrototypeApi.GRID_WIDTH && y >= 0 && y <= campPrototypeApi.GRID_HEIGHT;
  if (!dansGrille) return null;
  const type = typeCampPrototype(edge.type || "campBoundaryFence");
  if (!type || !type.edgePlacement) return null;
  return {
    type: type.id,
    x: x,
    y: y,
    orientation: edge.orientation
  };
}

function cleAreteClotureCampPrototype(edge) {
  return edge.orientation + ":" + edge.x + ":" + edge.y;
}

function normaliserCloturesCampPrototype(edges) {
  const uniques = new Map();
  (Array.isArray(edges) ? edges : []).forEach(function(edge) {
    const normalisee = normaliserAreteClotureCampPrototype(edge);
    if (normalisee) uniques.set(cleAreteClotureCampPrototype(normalisee), normalisee);
  });
  return Array.from(uniques.values()).slice(0, 1024);
}

function aretesCloturesSystemeCampPrototype(zonesConquises) {
  const zones = zonesConquises instanceof Set
    ? zonesConquises
    : new Set(campPrototypeTerrain.claimedZoneIds);
  const edges = [];
  [
    { x: 6, zoneId: "redGarden" },
    { x: 12, zoneId: "greenGarden" }
  ].forEach(function(boundary) {
    const passageOuvert = zones.has(boundary.zoneId);
    for (let y = 0; y < campPrototypeApi.GRID_HEIGHT; y += 1) {
      // Conquering a neighboring garden opens a deliberate one-cell passage;
      // the rest of the separating fence remains visible as part of the world.
      if (passageOuvert && y === 7) continue;
      edges.push({
        type: "campBoundaryFence",
        x: boundary.x,
        y: y,
        orientation: "vertical",
        system: true,
        zoneId: boundary.zoneId
      });
    }
  });
  return edges;
}

function cellulesAdjacentesAreteClotureCampPrototype(edge) {
  const candidates = edge.orientation === "vertical"
    ? [{ x: edge.x - 1, y: edge.y }, { x: edge.x, y: edge.y }]
    : [{ x: edge.x, y: edge.y - 1 }, { x: edge.x, y: edge.y }];
  return candidates.filter(function(cell) {
    return campPrototypeApi.celluleDansGrille(cell.x, cell.y);
  });
}

function areteClotureConstructibleCampPrototype(edge) {
  const normalisee = normaliserAreteClotureCampPrototype(edge);
  if (!normalisee) return false;
  const cellules = cellulesAdjacentesAreteClotureCampPrototype(normalisee);
  if (cellules.length !== 2 || !cellules.every(function(cell) {
    return campPrototypeApi.estCelluleConstructible(campPrototypeTerrain, cell.x, cell.y);
  })) return false;
  const systeme = new Set(aretesCloturesSystemeCampPrototype().map(cleAreteClotureCampPrototype));
  return !systeme.has(cleAreteClotureCampPrototype(normalisee));
}

function cleSpriteAreteClotureCampPrototype(edge) {
  const phaseCoordinate = edge.orientation === "vertical" ? edge.y : edge.x;
  const variant = ((phaseCoordinate % 2) + 2) % 2 === 0 ? "A" : "B";
  return edge.orientation === "vertical"
    ? "vertical" + variant
    : "horizontal" + variant;
}

function ajouterImageAreteClotureCampPrototype(element, edge, type) {
  const kit = type.edgeSprites || {};
  const phaseCoordinate = edge.orientation === "vertical" ? edge.y : edge.x;
  const kitKey = cleSpriteAreteClotureCampPrototype(edge);
  if (kit[kitKey]) {
    element.classList.add("camp-prototype-fence-edge-modular");
    const modularImage = document.createElement("img");
    modularImage.src = kit[kitKey];
    modularImage.alt = "";
    modularImage.draggable = false;
    element.appendChild(modularImage);
    return;
  }
  const direction = edge.orientation === "vertical" ? "down" : "right";
  const src = type.assets && (type.assets[direction] || type.assets.down || type.assets.right);
  if (!src) return;
  const bounds = type.spriteBounds && type.spriteBounds[direction];
  const motifLength = Math.max(1, Number(type.motifLength) || 1);
  const phase = ((phaseCoordinate % motifLength) + motifLength) % motifLength;
  let imageSpan = motifLength * 100;
  let imageOffset = -phase * 100;
  if (bounds) {
    const contentLength = edge.orientation === "vertical"
      ? bounds.bottom - bounds.top
      : bounds.right - bounds.left;
    const canvasLength = edge.orientation === "vertical"
      ? bounds.canvasHeight
      : bounds.canvasWidth;
    const contentStart = edge.orientation === "vertical" ? bounds.top : bounds.left;
    if (contentLength > 0 && canvasLength > 0) {
      imageSpan = canvasLength / contentLength * motifLength * 100;
      imageOffset = -(contentStart / contentLength * motifLength + phase) * 100;
    }
  }
  element.style.setProperty("--camp-fence-image-span", imageSpan + "%");
  element.style.setProperty("--camp-fence-image-offset", imageOffset + "%");
  const image = document.createElement("img");
  image.src = src;
  image.alt = "";
  image.draggable = false;
  element.appendChild(image);
}

function ajouterPremierPlanAreteClotureCampPrototype(host, edge, type) {
  const foreground = type.edgeForegroundSprites || {};
  const kitKey = cleSpriteAreteClotureCampPrototype(edge);
  const src = foreground[kitKey];
  if (!host || !src) return;
  const element = document.createElement("span");
  element.className = "camp-prototype-fence-edge camp-prototype-fence-edge-"
    + edge.orientation + " camp-prototype-fence-edge-modular "
    + "camp-prototype-fence-edge-foreground camp-prototype-fence-edge-"
    + (edge.system ? "system" : "player");
  element.dataset.campFenceForeground = cleAreteClotureCampPrototype(edge);
  element.style.left = (edge.x / campPrototypeApi.GRID_WIDTH * 100) + "%";
  element.style.top = (edge.y / campPrototypeApi.GRID_HEIGHT * 100) + "%";
  const image = document.createElement("img");
  image.src = src;
  image.alt = "";
  image.draggable = false;
  element.appendChild(image);
  host.appendChild(element);
}

function sommetsAreteClotureCampPrototype(edge) {
  return edge.orientation === "vertical"
    ? [{ x: edge.x, y: edge.y }, { x: edge.x, y: edge.y + 1 }]
    : [{ x: edge.x, y: edge.y }, { x: edge.x + 1, y: edge.y }];
}

function ajouterJonctionClotureCampPrototype(host, jonction) {
  const type = typeCampPrototype(jonction.type);
  const src = type && type.edgeSprites && type.edgeSprites.post;
  if (!host || !type || !src) return;
  const element = document.createElement("span");
  element.className = "camp-prototype-fence-junction camp-prototype-fence-junction-modular"
    + " camp-prototype-fence-edge-" + (jonction.system ? "system" : "player");
  element.dataset.campFenceJunction = jonction.type + ":" + jonction.x + ":" + jonction.y;
  element.style.left = (jonction.x / campPrototypeApi.GRID_WIDTH * 100) + "%";
  element.style.top = (jonction.y / campPrototypeApi.GRID_HEIGHT * 100) + "%";
  const image = document.createElement("img");
  image.src = src;
  image.alt = "";
  image.draggable = false;
  element.appendChild(image);
  host.appendChild(element);
}

function rendreCloturesCampPrototype(zonesConquises) {
  const host = document.getElementById("camp-prototype-fences");
  if (!host) return;
  host.innerHTML = "";
  const edges = aretesCloturesSystemeCampPrototype(zonesConquises)
    .concat(campPrototypeClotures.map(function(edge) { return Object.assign({ system: false }, edge); }));
  const dejaVues = new Set();
  const jonctions = new Map();
  const aretesRendues = [];
  edges.forEach(function(edge) {
    const key = cleAreteClotureCampPrototype(edge);
    if (dejaVues.has(key)) return;
    dejaVues.add(key);
    const type = typeCampPrototype(edge.type);
    if (!type || !type.edgePlacement) return;
    const element = document.createElement("span");
    element.className = "camp-prototype-fence-edge camp-prototype-fence-edge-"
      + edge.orientation + " camp-prototype-fence-edge-" + (edge.system ? "system" : "player");
    element.dataset.campFenceEdge = key;
    element.style.left = (edge.x / campPrototypeApi.GRID_WIDTH * 100) + "%";
    element.style.top = (edge.y / campPrototypeApi.GRID_HEIGHT * 100) + "%";
    if (edge.zoneId) element.dataset.campBoundaryZone = edge.zoneId;
    ajouterImageAreteClotureCampPrototype(element, edge, type);
    host.appendChild(element);
    aretesRendues.push({edge: edge, type: type});
    sommetsAreteClotureCampPrototype(edge).forEach(function(sommet) {
      const junctionKey = type.id + ":" + sommet.x + ":" + sommet.y;
      let jonction = jonctions.get(junctionKey);
      if (!jonction) {
        jonction = {
          type: type.id,
          x: sommet.x,
          y: sommet.y,
          degree: 0,
          system: true,
          orientations: new Set()
        };
        jonctions.set(junctionKey, jonction);
      }
      jonction.degree += 1;
      jonction.system = jonction.system && Boolean(edge.system);
      jonction.orientations.add(edge.orientation);
    });
  });
  jonctions.forEach(function(jonction) {
    ajouterJonctionClotureCampPrototype(host, jonction);
  });
  aretesRendues.forEach(function(item) {
    ajouterPremierPlanAreteClotureCampPrototype(host, item.edge, item.type);
  });
}

function rendreContinuationCloturesRiveCampPrototype(zonesConquises) {
  const host = document.getElementById("camp-prototype-shore-fences");
  if (!host) return;
  host.innerHTML = "";
  const zones = zonesConquises instanceof Set
    ? zonesConquises
    : new Set(campPrototypeTerrain.claimedZoneIds);
  const type = typeCampPrototype("campBoundaryFence");
  if (!type || !type.edgeSprites) return;
  [
    { x: 6, zoneId: "redGarden" },
    { x: 12, zoneId: "greenGarden" }
  ].forEach(function(boundary) {
    const edge = {
      type: type.id,
      x: boundary.x,
      y: campPrototypeApi.GRID_HEIGHT,
      orientation: "vertical",
      system: true
    };
    const element = document.createElement("span");
    element.className = "camp-prototype-fence-edge camp-prototype-fence-edge-vertical "
      + "camp-prototype-fence-edge-system camp-prototype-shore-fence-edge";
    element.style.left = (boundary.x / campPrototypeApi.GRID_WIDTH * 100) + "%";
    element.style.top = "0";
    ajouterImageAreteClotureCampPrototype(element, edge, type);
    host.appendChild(element);
    ["top", "bottom"].forEach(function(position) {
      const post = document.createElement("span");
      post.className = "camp-prototype-fence-junction camp-prototype-fence-junction-modular "
        + "camp-prototype-fence-edge-system camp-prototype-shore-fence-post camp-prototype-shore-fence-post-"
        + position;
      post.style.left = (boundary.x / campPrototypeApi.GRID_WIDTH * 100) + "%";
      const image = document.createElement("img");
      image.src = type.edgeSprites.post;
      image.alt = "";
      image.draggable = false;
      post.appendChild(image);
      host.appendChild(post);
    });
    const foreground = type.edgeForegroundSprites
      && type.edgeForegroundSprites[cleSpriteAreteClotureCampPrototype(edge)];
    if (foreground) {
      const front = document.createElement("span");
      front.className = "camp-prototype-fence-edge camp-prototype-fence-edge-vertical "
        + "camp-prototype-fence-edge-modular camp-prototype-fence-edge-foreground "
        + "camp-prototype-fence-edge-system camp-prototype-shore-fence-edge";
      front.style.left = (boundary.x / campPrototypeApi.GRID_WIDTH * 100) + "%";
      front.style.top = "0";
      const image = document.createElement("img");
      image.src = foreground;
      image.alt = "";
      image.draggable = false;
      front.appendChild(image);
      host.appendChild(front);
    }
  });
}

function actualiserMasquageJardinsVoisinsCampPrototype() {
  const zonesExplorees = new Set(Array.isArray(etat.zonesExplorees) ? etat.zonesExplorees : []);
  const explorationParJardin = { redGarden: "C1", greenGarden: "E1" };
  const classeGardeParJardin = {
    redGarden: "camp-neighbor-red-unknown",
    greenGarden: "camp-neighbor-green-unknown"
  };
  const carte = document.querySelector(".camp-prototype-map");
  document.querySelectorAll("[data-camp-neighbor-zone]").forEach(function(masqueVoisin) {
    const gardenId = masqueVoisin.dataset.campNeighborZone;
    const explorationId = explorationParJardin[gardenId];
    const decouvert = Boolean(explorationId && zonesExplorees.has(explorationId));
    const classeGarde = classeGardeParJardin[gardenId];
    if (carte && classeGarde) carte.classList.toggle(classeGarde, !decouvert);
    masqueVoisin.hidden = decouvert;
    masqueVoisin.dataset.campNeighborState = explorationCampFonctionnelle()
      ? "exploration-available"
      : "unknown";
  });
}

function preparerPremierAffichageCampPrototype() {
  const carte = document.querySelector(".camp-prototype-map");
  const rideau = document.getElementById("camp-prototype-first-reveal-cover");
  if (carte) carte.classList.add("camp-prototype-map-preparing");
  if (rideau) rideau.hidden = false;
  actualiserMasquageJardinsVoisinsCampPrototype();
}

function finaliserPremierAffichageCampPrototype() {
  const carte = document.querySelector(".camp-prototype-map");
  const rideau = document.getElementById("camp-prototype-first-reveal-cover");
  if (carte) carte.classList.remove("camp-prototype-map-preparing");
  if (rideau) rideau.hidden = true;
}

function actualiserCloturesCampPrototype(zonesConquises) {
  const zones = zonesConquises instanceof Set
    ? zonesConquises
    : new Set(campPrototypeTerrain.claimedZoneIds);
  rendreCloturesCampPrototype(zones);
  rendreContinuationCloturesRiveCampPrototype(zones);
  actualiserMasquageJardinsVoisinsCampPrototype();
}

function rendreTerrainCampPrototype(presencesCamp) {
  const zones = document.getElementById("camp-prototype-territory-zones");
  const terrain = document.getElementById("camp-prototype-terrain");
  if (!zones || !terrain) return;
  zones.innerHTML = "";
  terrain.innerHTML = "";
  const presences = presencesCamp || indexerPresencesChatsCamp();
  const zonesConquises = new Set(campPrototypeTerrain.claimedZoneIds);
  const cellulesLibres = new Set(campPrototypeTerrain.clearedCells);
  const zonesExplorees = new Set(Array.isArray(etat.zonesExplorees) ? etat.zonesExplorees : []);
  const explorationParJardin = { redGarden: "C1", greenGarden: "E1" };
  actualiserCloturesCampPrototype(zonesConquises);
  Object.keys(campPrototypeApi.TERRITORY_ZONES).forEach(function(zoneId) {
    const zone = campPrototypeApi.TERRITORY_ZONES[zoneId];
    const conquise = zonesConquises.has(zoneId);
    if (conquise) return;
    const explorationId = explorationParJardin[zoneId];
    if (explorationId && !zonesExplorees.has(explorationId)) return;
    const disponible = campPrototypeApi.peutConquerirZone(campPrototypeTerrain, zoneId).valide;
    const element = document.createElement("div");
    element.className = "camp-prototype-territory-zone"
      + (disponible ? " camp-prototype-territory-zone-claimable" : "");
    element.dataset.campZoneId = zoneId;
    element.innerHTML = "<span>" + zone.label + "<br>"
      + (disponible ? "Reachable" : "Locked") + "</span>";
    appliquerCadreTerrainCampPrototype(element, zone.x, zone.y, zone.width, zone.height);
    zones.appendChild(element);
  });
  for (let y = 0; y < campPrototypeApi.GRID_HEIGHT; y += 1) {
    for (let x = 0; x < campPrototypeApi.GRID_WIDTH; x += 1) {
      const cle = campPrototypeApi.cleCellule(x, y);
      if (cellulesLibres.has(cle)) {
        const libre = document.createElement("span");
        libre.className = "camp-prototype-terrain-cleared";
        libre.setAttribute("aria-hidden", "true");
        appliquerCadreTerrainCampPrototype(libre, x, y, 1, 1);
        terrain.appendChild(libre);
      }
    }
  }
  campPrototypeApi.obstaclesTerrain(campPrototypeTerrain).forEach(function(obstacle) {
    const cibleObstacle = cibleDemolitionCampPrototype(obstacle.uid, "terrain");
    const resultatRetrait = peutDemolirCibleCampPrototype(cibleObstacle);
    const peutRetirer = resultatRetrait.valide;
    const peutInteragir = (DEV_MODE || campDebloque()) && peutRetirer && !campPrototypeModeEdition;
    const demolition = demolitionCampPrototypePourObstacle(obstacle.uid);
    const preteAValider = Boolean(demolition && demolition.readyToClaim);
    const bouton = document.createElement("button");
    bouton.type = "button";
    bouton.className = "camp-prototype-obstacle camp-prototype-obstacle-" + obstacle.id
      + (peutRetirer ? " camp-prototype-obstacle-clearable" : "")
      + (demolition ? " camp-prototype-obstacle-demolition-active" : "")
      + (preteAValider ? " camp-task-ready-to-claim" : "");
    bouton.dataset.campObstacleUid = obstacle.uid;
    bouton.dataset.campObstacleLabel = obstacle.label;
    bouton.dataset.campDemolitionLabel = obstacle.label;
    bouton.dataset.campTerrainX = String(obstacle.x);
    bouton.dataset.campTerrainY = String(obstacle.y);
    bouton.setAttribute("aria-label", obstacle.label + ", "
      + obstacle.width + " by " + obstacle.height + " tiles, column " + (obstacle.x + 1)
      + ", row " + (obstacle.y + 1)
      + (demolition
        ? (preteAValider ? ", cleanup ready to validate" : ", demolition in progress")
        : (peutInteragir
            ? ", available for demolition"
            : (peutRetirer ? ", editing disabled" : ", not reachable yet"))));
    bouton.setAttribute(
      "aria-disabled",
      peutInteragir ? "false" : "true"
    );
    if (peutInteragir) {
      bouton.setAttribute("aria-haspopup", "menu");
      bouton.setAttribute("aria-expanded", "false");
      bouton.setAttribute("aria-controls", "camp-prototype-interaction-menu");
    } else {
      bouton.tabIndex = -1;
    }
    const image = document.createElement("img");
    image.className = "camp-prototype-obstacle-sprite";
    image.src = obstacle.asset;
    image.alt = "";
    image.draggable = false;
    bouton.appendChild(image);
    ajouterPortraitsChatsCamp(bouton, presences.byTerrain[obstacle.uid] || []);
    appliquerCadreTerrainCampPrototype(
      bouton,
      obstacle.x,
      obstacle.y,
      obstacle.width,
      obstacle.height
    );
    terrain.appendChild(bouton);
  });
}

function positionnerActionsPlacementCampPrototype(typeId, x, y, rotation) {
  const actionsPlacement = document.getElementById("camp-prototype-placement-actions");
  const board = document.getElementById("camp-prototype-board");
  const alerteAcces = document.getElementById("camp-prototype-house-access-warning");
  const type = typeCampPrototype(typeId);
  if (
    !actionsPlacement
    || !type
    || type.continuous
    || !Number.isFinite(x)
    || !Number.isFinite(y)
  ) return false;
  const dimensions = dimensionsCampPrototype(typeId, rotation);
  const centreX = (x + dimensions.width / 2) / campPrototypeApi.GRID_WIDTH * 100;
  const haut = y / campPrototypeApi.GRID_HEIGHT * 100;
  actionsPlacement.style.setProperty("--camp-placement-center-x", centreX + "%");
  actionsPlacement.style.setProperty("--camp-placement-top", haut + "%");
  const alerteVisible = Boolean(alerteAcces && !alerteAcces.hidden);
  const hauteurBoard = board ? board.clientHeight : 0;
  const espaceAuDessus = hauteurBoard * y / campPrototypeApi.GRID_HEIGHT;
  const hauteurNecessaire = actionsPlacement.offsetHeight
    + (alerteVisible ? alerteAcces.offsetHeight + 14 : 0);
  const placerSousAsset = alerteVisible
    && hauteurBoard > 0
    && espaceAuDessus - hauteurNecessaire < 64;
  actionsPlacement.classList.toggle(
    "camp-prototype-placement-actions-below-item",
    placerSousAsset
  );
  if (placerSousAsset) {
    const basAsset = hauteurBoard
      * (y + dimensions.height)
      / campPrototypeApi.GRID_HEIGHT;
    actionsPlacement.style.setProperty(
      "--camp-placement-below-top",
      (basAsset + alerteAcces.offsetHeight + 14) + "px"
    );
  } else {
    actionsPlacement.style.removeProperty("--camp-placement-below-top");
  }
  return true;
}

function actualiserCommandesCampPrototype() {
  const palette = document.getElementById("camp-prototype-palette");
  if (palette) {
    palette.querySelectorAll("[data-camp-type]").forEach(function(bouton) {
      const actif = bouton.dataset.campType === campPrototypeTypeAPlacer;
      bouton.classList.toggle("camp-prototype-palette-active", actif);
      bouton.setAttribute("aria-pressed", actif ? "true" : "false");
    });
  }
  const supprimer = document.getElementById("camp-prototype-delete");
  const selection = itemCampPrototype(campPrototypeSelectionUid);
  if (supprimer) {
    supprimer.disabled = !selection
      || !typeCampPrototypeModifiable(selection.type)
      || Boolean(constructionMaisonCampPourItem(selection.uid))
      || Boolean(constructionBatimentCampPourItem(selection.uid));
  }
  const tourner = document.getElementById("camp-prototype-rotate");
  if (tourner) {
    const typeSelectionne = typeCampPrototype(
      campPrototypePlacementEnCours
        ? campPrototypePlacementEnCours.type
        : (selection ? selection.type : campPrototypeTypeAPlacer)
    );
    tourner.disabled = !(typeSelectionne
      && typeSelectionne.rotatable
      && typeCampPrototypeModifiable(typeSelectionne.id));
  }
  const actionsPlacement = document.getElementById("camp-prototype-placement-actions");
  const confirmerPlacement = document.getElementById("camp-prototype-placement-confirm");
  const placementActif = Boolean(
    campPrototypePlacementEnCours
    && typeCampPrototype(campPrototypePlacementEnCours.type)
    && !typeCampPrototype(campPrototypePlacementEnCours.type).continuous
  );
  const placementAffichable = Boolean(
    placementActif
    && Number.isFinite(campPrototypePlacementEnCours.x)
    && Number.isFinite(campPrototypePlacementEnCours.y)
  );
  if (actionsPlacement) {
    actionsPlacement.hidden = !placementAffichable;
    if (placementAffichable) {
      positionnerActionsPlacementCampPrototype(
        campPrototypePlacementEnCours.type,
        campPrototypePlacementEnCours.x,
        campPrototypePlacementEnCours.y,
        campPrototypePlacementEnCours.rotation
      );
    }
  }
  if (confirmerPlacement) {
    confirmerPlacement.disabled = !(
      placementActif
      && campPrototypePlacementEnCours.valide
      && (
        typeCampPrototype(campPrototypePlacementEnCours.type).category !== "house"
        || ressourcesMaisonCampSuffisantes(campPrototypePlacementEnCours.type)
      )
      && Number.isFinite(campPrototypePlacementEnCours.x)
      && Number.isFinite(campPrototypePlacementEnCours.y)
    );
  }
  const gomme = document.getElementById("camp-prototype-road-erase");
  if (gomme) {
    gomme.classList.toggle("camp-prototype-action-active", campPrototypeGommeRoutes);
    gomme.setAttribute("aria-pressed", campPrototypeGommeRoutes ? "true" : "false");
  }
  const gommeClotures = document.getElementById("camp-prototype-fence-erase");
  if (gommeClotures) {
    gommeClotures.classList.toggle("camp-prototype-action-active", campPrototypeGommeClotures);
    gommeClotures.setAttribute("aria-pressed", campPrototypeGommeClotures ? "true" : "false");
  }
  const typeActif = typeCampPrototype(campPrototypeTypeAPlacer);
  document.querySelectorAll("[data-camp-category]").forEach(function(bouton) {
    const categorie = bouton.dataset.campCategory;
    const visible = categorie === "house"
      ? maisonCampDebloquee("cardboardBox")
      : (categorie === "building"
          ? batimentCampDisponiblePlacement() || DEV_MODE
          : (categorie === "fence" ? Boolean(campPrototypeApi.FENCE_TYPES.campBoundaryFence) : DEV_MODE));
    bouton.hidden = !visible;
    const actif = campPrototypeCategorieOuverte === categorie
      || (typeActif && typeActif.category === categorie)
      || (categorie === "road" && campPrototypeGommeRoutes)
      || (categorie === "fence" && campPrototypeGommeClotures);
    bouton.classList.toggle("camp-prototype-category-active", Boolean(actif));
    bouton.setAttribute("aria-pressed", actif ? "true" : "false");
  });
  const board = document.getElementById("camp-prototype-board");
  const menu = document.getElementById("camp-prototype-category-sheet");
  if (board) {
    const outilContinu = campPrototypeGommeRoutes
      || campPrototypeGommeClotures
      || Boolean(typeActif && typeActif.continuous);
    board.classList.toggle("camp-prototype-tool-continuous", outilContinu);
  }
  document.body.classList.toggle("camp-prototype-editing", campPrototypeModeEdition);
  if (menu) menu.hidden = campPrototypeModeEdition || !campPrototypeCategorieOuverte;
}

function rendrePaletteCampPrototype() {
  const palette = document.getElementById("camp-prototype-palette");
  if (!palette) return;
  palette.innerHTML = "";
  const categorie = campPrototypeCategorieOuverte;
  if (!categorie) {
    actualiserCommandesCampPrototype();
    return;
  }
  const labels = {
    house: "Houses",
    building: "Buildings",
    decoration: "Decorations",
    road: "Paths",
    fence: "Fences",
    junk: "Junk",
    terrain: "Terrain"
    ,"dev-library": "DEV Library"
  };
  ecrireTexte(document.getElementById("camp-prototype-category-title"), labels[categorie] || "Camp items");
  if (categorie === "terrain") {
    const resume = document.createElement("div");
    resume.className = "camp-prototype-terrain-summary";
    resume.textContent = campPrototypeTerrain.clearedCells.length + " / "
      + campPrototypeApi.TERRAIN_CELL_COUNT
      + " cells cleared · " + campPrototypeTerrain.claimedZoneIds.length + " / "
      + Object.keys(campPrototypeApi.TERRITORY_ZONES).length + " territories claimed";
    palette.appendChild(resume);

    Object.keys(campPrototypeApi.TERRITORY_ZONES).forEach(function(zoneId) {
      if (zoneId === "home") return;
      const zone = campPrototypeApi.TERRITORY_ZONES[zoneId];
      const conquise = campPrototypeApi.estZoneConquise(campPrototypeTerrain, zoneId);
      const resultat = campPrototypeApi.peutConquerirZone(campPrototypeTerrain, zoneId);
      const bouton = document.createElement("button");
      bouton.type = "button";
      bouton.className = "camp-prototype-palette-item camp-prototype-terrain-zone-action";
      bouton.disabled = conquise || !resultat.valide;
      bouton.innerHTML = "<strong>" + zone.label + "</strong><span>"
        + (conquise ? "Claimed" : (resultat.valide ? "Claim adjacent territory" : resultat.raison))
        + "</span>";
      bouton.addEventListener("click", function() {
        conquerirZoneCampPrototype(zoneId);
      });
      palette.appendChild(bouton);
    });

    const viderDisposition = document.createElement("button");
    viderDisposition.type = "button";
    viderDisposition.className = "camp-prototype-palette-item camp-prototype-terrain-reset";
    viderDisposition.innerHTML = "<strong>Clear placed items</strong><span>Keep current land progression</span>";
    viderDisposition.addEventListener("click", reinitialiserCampPrototype);
    palette.appendChild(viderDisposition);

    const reinitialiser = document.createElement("button");
    reinitialiser.type = "button";
    reinitialiser.className = "camp-prototype-palette-item camp-prototype-terrain-reset";
    reinitialiser.innerHTML = "<strong>Reset land</strong><span>Restore the first 3 rows of the blue garden</span>";
    reinitialiser.addEventListener("click", reinitialiserTerrainCampPrototype);
    palette.appendChild(reinitialiser);
    actualiserCommandesCampPrototype();
    return;
  }
  Object.keys(campPrototypeApi.ITEM_TYPES).forEach(function(typeId) {
    const type = typeCampPrototype(typeId);
    if (type.category !== categorie) return;
    if (categorie === "house" && !maisonCampDebloquee(typeId)) return;
    if (categorie === "building" && !DEV_MODE && !batimentCampDisponiblePlacement(typeId)) return;
    const bouton = document.createElement("button");
    bouton.type = "button";
    bouton.dataset.campType = typeId;
    bouton.className = "camp-prototype-palette-item camp-prototype-color-" + type.color;
    bouton.setAttribute("aria-pressed", "false");
    const cout = categorie === "house" ? coutMaisonCamp(typeId) : null;
    const chatDisponible = categorie !== "house" || kittyDisponibleConstructionMaisonCamp();
    if (categorie === "house") {
      bouton.disabled = !maisonCampConstructible(typeId);
      if (!ressourcesMaisonCampSuffisantes(typeId)) {
        bouton.title = "Not enough resources.";
      } else if (!chatDisponible) {
        bouton.title = "No Cat is available to build.";
      }
    }
    bouton.innerHTML = (type.asset
      ? '<img class="camp-prototype-palette-sprite" src="' + type.asset + '" alt="" draggable="false">'
      : "")
      + '<span class="camp-prototype-palette-copy"><strong>' + type.label
      + ' <span class="camp-prototype-palette-dimensions">'
      + (type.edgePlacement ? '(grid edge · ' + type.motifLength + '-cell motif)' : '(' + type.width + " × " + type.height + ")")
      + "</span></strong>"
      + (cout
        ? '<span class="camp-prototype-palette-requirements">'
          + '<span class="camp-prototype-palette-cost">' + cout.cardboardPlanks
          + ' <img src="img/resources/Cardboard%20Plank_Final.png" alt="Cardboard Plank">'
          + '<span class="camp-prototype-tier-badge work-tier-badge-tier-1" aria-label="Tier 1">T1</span></span>'
          + '<span aria-hidden="true">·</span><span>1 Cat</span>'
          + '<span aria-hidden="true">·</span><span>'
          + Math.round(CAMP_HOUSE_CONSTRUCTION_DURATIONS[typeId] / 60) + " mins"
          + "</span></span>"
        : "")
      + (type.visualOnly
        ? '<span class="camp-prototype-visual-only-badge">Visual only</span>'
        : "")
      + "</span>";
    bouton.addEventListener("click", function() {
      if (categorie === "house" && !maisonCampConstructible(typeId)) {
        definirMessageCampPrototype(!ressourcesMaisonCampSuffisantes(typeId)
          ? "Not enough resources to build " + type.label + "."
          : "No Cat is available to build " + type.label + ".");
        return;
      }
      campPrototypeModeEdition = true;
      campPrototypePlacementEnCours = null;
      campPrototypeTypeAPlacer = typeId;
      campPrototypeRotationAPlacer = 0;
      campPrototypeGommeRoutes = false;
      campPrototypeGommeClotures = false;
      campPrototypeSelectionUid = null;
      campPrototypeCategorieOuverte = null;
      masquerApercuCampPrototype();
      if (!type.continuous) {
        commencerNouveauPlacementCampPrototype(typeId);
      }
      rendreItemsCampPrototype();
      actualiserCommandesCampPrototype();
      definirMessageCampPrototype(type.continuous
        ? (type.edgePlacement
            ? "Drag along grid edges to paint fences one edge at a time."
            : "Drag across the grid to paint Basic Trails.")
        : "Tap the grid to preview " + type.label
          + ", then confirm or cancel its placement.");
    });
    palette.appendChild(bouton);
  });
  if (categorie === "house" && palette.children.length === 0) {
    const vide = document.createElement("p");
    vide.className = "camp-prototype-terrain-summary";
    vide.textContent = "No houses unlocked yet.";
    palette.appendChild(vide);
  }
  if (categorie === "road") {
    const gomme = document.createElement("button");
    gomme.id = "camp-prototype-road-erase";
    gomme.type = "button";
    gomme.className = "camp-prototype-palette-item camp-prototype-road-eraser";
    gomme.setAttribute("aria-pressed", "false");
    gomme.innerHTML = "<strong>Trail eraser</strong><span>Drag over Basic Trails to remove them</span>";
    gomme.addEventListener("click", basculerGommeRoutesCampPrototype);
    palette.appendChild(gomme);
  }
  if (categorie === "fence") {
    const gomme = document.createElement("button");
    gomme.id = "camp-prototype-fence-erase";
    gomme.type = "button";
    gomme.className = "camp-prototype-palette-item camp-prototype-road-eraser";
    gomme.setAttribute("aria-pressed", "false");
    gomme.innerHTML = "<strong>Fence eraser</strong><span>Drag over player-built fence edges to remove them</span>";
    gomme.addEventListener("click", basculerGommeCloturesCampPrototype);
    palette.appendChild(gomme);
  }
  actualiserCommandesCampPrototype();
}

function ouvrirCategorieCampPrototype(categorie) {
  if (campPrototypeModeEdition || !categorieCampPrototypeAccessible(categorie)) return;
  if (categorie === "house" && !maisonCampDebloquee("cardboardBox")) return;
  campPrototypeCategorieOuverte = campPrototypeCategorieOuverte === categorie ? null : categorie;
  rendrePaletteCampPrototype();
  actualiserCommandesCampPrototype();
}

function fermerCategorieCampPrototype() {
  campPrototypeCategorieOuverte = null;
  rendrePaletteCampPrototype();
  actualiserCommandesCampPrototype();
}

function quitterEditionCampPrototype(restaurerFocus) {
  if (!campPrototypeModeEdition) return;
  campPrototypeModeEdition = false;
  campPrototypeCategorieOuverte = null;
  campPrototypeTypeAPlacer = null;
  campPrototypeRotationAPlacer = 0;
  campPrototypeGommeRoutes = false;
  campPrototypeGommeClotures = false;
  campPrototypeSelectionUid = null;
  campPrototypePlacementEnCours = null;
  campPrototypePointeur = null;
  annulerAppuiProlongeCampPrototype();
  masquerApercuCampPrototype();
  campPrototypeMessage = "";
  renduCampPrototype();
  if (restaurerFocus === false) return;
  requestAnimationFrame(function() {
    const houses = document.querySelector('[data-camp-category="house"]');
    if (houses && !houses.hidden) houses.focus();
  });
}

function contexteConnexionsAfficheesCampPrototype() {
  const placement = campPrototypePlacementEnCours;
  if (
    !placement
    || !Number.isFinite(placement.x)
    || !Number.isFinite(placement.y)
  ) {
    return {
      evaluation: connexionsCampPrototypeActuelles(),
      layout: campPrototypeLayout,
      pendingUid: null
    };
  }

  if (placement.mode === "existing") {
    const layoutAffiche = campPrototypeLayout.map(function(item) {
      if (item.uid !== placement.uid) return item;
      return {
        uid: item.uid,
        type: item.type,
        x: placement.x,
        y: placement.y,
        rotation: placement.rotation
      };
    });
    return {
      evaluation: campPrototypeApi.evaluerConnexionsLayout(
        layoutAffiche,
        campPrototypeTerrain
      ),
      layout: layoutAffiche,
      pendingUid: null
    };
  }

  const pendingUid = "camp-pending-connectivity";
  const layoutAffiche = campPrototypeLayout.concat([{
    uid: pendingUid,
    type: placement.type,
    x: placement.x,
    y: placement.y,
    rotation: placement.rotation
  }]);
  return {
    evaluation: campPrototypeApi.evaluerConnexionsLayout(
      layoutAffiche,
      campPrototypeTerrain
    ),
    layout: layoutAffiche,
    pendingUid: pendingUid
  };
}

function ajouterBadgeConnexionInactiveCampPrototype(
  conteneur,
  uid,
  type,
  x,
  y,
  rotation,
  connexion
) {
  if (!conteneur || !type || !connexion || connexion.active) return;
  const dimensions = dimensionsCampPrototype(type.id, rotation);
  const badge = document.createElement("span");
  badge.className = "camp-prototype-inactive-badge";
  badge.dataset.campConnectivityUid = uid;
  badge.title = type.label + " inactive. " + connexion.reason;
  badge.style.left = ((x + dimensions.width - 0.25)
    / campPrototypeApi.GRID_WIDTH * 100) + "%";
  badge.style.top = ((y + 0.25) / campPrototypeApi.GRID_HEIGHT * 100) + "%";
  const image = document.createElement("img");
  image.src = "img/interface/Red%20Cross_Final.png?v=0.0029";
  image.alt = "";
  badge.appendChild(image);
  conteneur.appendChild(badge);
}

function fermerAlerteBatimentsBloquesCampPrototype() {
  const bouton = document.getElementById("camp-prototype-blocked-alert-toggle");
  const panneau = document.getElementById("camp-prototype-blocked-alert-panel");
  if (bouton) bouton.setAttribute("aria-expanded", "false");
  if (panneau) panneau.hidden = true;
}

function basculerAlerteBatimentsBloquesCampPrototype(event) {
  if (event) event.stopPropagation();
  const bouton = document.getElementById("camp-prototype-blocked-alert-toggle");
  const panneau = document.getElementById("camp-prototype-blocked-alert-panel");
  if (!bouton || !panneau) return false;
  const ouvrir = panneau.hidden;
  panneau.hidden = !ouvrir;
  bouton.setAttribute("aria-expanded", ouvrir ? "true" : "false");
  return ouvrir;
}

function batimentsBloquesCampPrototype(evaluation) {
  const connexions = evaluation && evaluation.byItem ? evaluation.byItem : {};
  return campPrototypeLayout.map(function(item) {
    const type = typeCampPrototype(item.type);
    const connexion = connexions[item.uid];
    if (!type || !type.access || !connexion || connexion.active) return null;
    if (CAMP_BUILDING_REPAIR_DURATIONS[item.type] && !batimentCampRepare(item.type)) return null;
    const placement = placementCampPrototypePourItem(item.uid);
    return {
      uid: item.uid,
      label: type.label,
      x: placement ? placement.x : item.x,
      y: placement ? placement.y : item.y
    };
  }).filter(Boolean);
}

function actualiserAlerteBatimentsBloquesCampPrototype(evaluation) {
  const alerte = document.getElementById("camp-prototype-blocked-alert");
  const bouton = document.getElementById("camp-prototype-blocked-alert-toggle");
  const panneau = document.getElementById("camp-prototype-blocked-alert-panel");
  const titre = document.getElementById("camp-prototype-blocked-alert-title");
  const liste = document.getElementById("camp-prototype-blocked-alert-list");
  if (!alerte || !bouton || !panneau || !titre || !liste) return;
  const bloques = batimentsBloquesCampPrototype(evaluation);
  alerte.hidden = bloques.length === 0;
  if (bloques.length === 0) {
    fermerAlerteBatimentsBloquesCampPrototype();
    liste.innerHTML = "";
    return;
  }
  const resume = bloques.length === 1
    ? "1 blocked building"
    : bloques.length + " blocked buildings";
  bouton.setAttribute("aria-label", "Show " + resume);
  bouton.title = resume;
  titre.textContent = resume;
  liste.innerHTML = "";
  bloques.forEach(function(batiment) {
    const entree = document.createElement("li");
    const nom = document.createElement("strong");
    const position = document.createElement("span");
    nom.textContent = batiment.label;
    position.textContent = "Column " + (batiment.x + 1) + ", row " + (batiment.y + 1);
    entree.appendChild(nom);
    entree.appendChild(position);
    liste.appendChild(entree);
  });
}

function directionAccesCampPrototype(cellule, x, y, dimensions) {
  if (cellule.y < y) return "north";
  if (cellule.x >= x + dimensions.width) return "east";
  if (cellule.y >= y + dimensions.height) return "south";
  if (cellule.x < x) return "west";
  return "south";
}

function positionMarqueurAccesCampPrototype(cellule, x, y, dimensions, direction) {
  const retraitInterieur = 0.4;
  if (direction === "north") {
    return { x: cellule.x + 0.5, y: y + retraitInterieur };
  }
  if (direction === "east") {
    return { x: x + dimensions.width - retraitInterieur, y: cellule.y + 0.5 };
  }
  if (direction === "west") {
    return { x: x + retraitInterieur, y: cellule.y + 0.5 };
  }
  return {
    x: cellule.x + 0.5,
    y: y + dimensions.height - retraitInterieur
  };
}

function ajouterMarqueursAccesCampPrototype(
  conteneur,
  uid,
  type,
  x,
  y,
  rotation,
  connexion
) {
  if (!conteneur || !type || !type.access || !connexion) return;
  const dimensions = dimensionsCampPrototype(type.id, rotation);
  connexion.ports.forEach(function(port) {
    const cellulesLibres = new Set(port.clearCells.map(function(cellule) {
      return campPrototypeApi.cleCellule(cellule.x, cellule.y);
    }));
    const cellulesAtteignables = new Set(port.reachableCells.map(function(cellule) {
      return campPrototypeApi.cleCellule(cellule.x, cellule.y);
    }));
    port.cells.forEach(function(cellule) {
      const cle = campPrototypeApi.cleCellule(cellule.x, cellule.y);
      const etatAcces = cellulesAtteignables.has(cle)
        ? "reachable"
        : (cellulesLibres.has(cle) ? "disconnected" : "blocked");
      const direction = directionAccesCampPrototype(cellule, x, y, dimensions);
      const position = positionMarqueurAccesCampPrototype(
        cellule,
        x,
        y,
        dimensions,
        direction
      );
      const angles = { north: -90, east: 0, south: 90, west: 180 };
      const marqueur = document.createElement("span");
      marqueur.className = "camp-prototype-access-marker camp-prototype-access-" + etatAcces;
      marqueur.dataset.campAccessUid = uid;
      marqueur.dataset.campAccessPort = port.id;
      marqueur.dataset.campAccessState = etatAcces;
      marqueur.title = etatAcces === "reachable"
        ? "Free and connected access"
        : (etatAcces === "disconnected"
            ? "Free access, but not connected to the camp"
            : "Blocked access");
      marqueur.style.left = (position.x / campPrototypeApi.GRID_WIDTH * 100) + "%";
      marqueur.style.top = (position.y / campPrototypeApi.GRID_HEIGHT * 100) + "%";
      marqueur.style.setProperty("--camp-access-arrow-angle", angles[direction] + "deg");
      const fleche = document.createElement("i");
      fleche.className = "camp-prototype-access-arrow";
      marqueur.appendChild(fleche);
      conteneur.appendChild(marqueur);
    });
  });
}

function entreeCampBloqueeCampPrototype(contexteConnexions) {
  if (!contexteConnexions) return false;
  return !campPrototypeApi.accesExterieurDisponible(contexteConnexions.evaluation);
}

function placementFermeAccesMaisonCampPrototype(contexteConnexions) {
  return Boolean(
    campPrototypePlacementEnCours
    && entreeCampBloqueeCampPrototype(contexteConnexions)
  );
}

function ajouterMarqueursEntreeBloqueeCampPrototype(conteneur, entreeBloquee) {
  if (!conteneur || !entreeBloquee) return;
  campPrototypeApi.CONNECTION_ORIGIN_CELLS.forEach(function(cellule) {
    const marqueur = document.createElement("span");
    marqueur.className = "camp-prototype-exterior-blocked-marker";
    marqueur.dataset.campExteriorAccessCell = campPrototypeApi.cleCellule(
      cellule.x,
      cellule.y
    );
    marqueur.style.left = ((cellule.x + 0.5) / campPrototypeApi.GRID_WIDTH * 100) + "%";
    marqueur.style.top = (cellule.y / campPrototypeApi.GRID_HEIGHT * 100) + "%";
    const image = document.createElement("img");
    image.src = "img/interface/Red%20Cross_Final.png?v=0.0029";
    image.alt = "";
    marqueur.appendChild(image);
    conteneur.appendChild(marqueur);
  });
}

function actualiserAlerteAccesMaisonCampPrototype(contexteConnexions) {
  const alerte = document.getElementById("camp-prototype-house-access-warning");
  const actions = document.getElementById("camp-prototype-placement-actions");
  if (!alerte || !actions) return;
  const fermee = placementFermeAccesMaisonCampPrototype(contexteConnexions);
  alerte.hidden = !fermee;
  actions.classList.toggle("camp-prototype-placement-actions-has-warning", fermee);
  alerte.textContent = fermee
    ? "This placement would completely block access from the house. The cats need an open route into the camp."
    : "";
}

function rendreItemsCampPrototype(presencesCamp) {
  const conteneur = document.getElementById("camp-prototype-items");
  const statutsConnexion = document.getElementById("camp-prototype-connectivity-statuses");
  if (!conteneur) return;
  const presences = presencesCamp || indexerPresencesChatsCamp();
  // A normal-view render may happen while the pointer travels from an item to
  // its floating action. Keep that menu alive; Edit mode never exposes it.
  if (campPrototypeModeEdition) fermerMenuInteractionCampPrototype();
  conteneur.innerHTML = "";
  if (statutsConnexion) statutsConnexion.innerHTML = "";
  const contexteConnexions = contexteConnexionsAfficheesCampPrototype();
  actualiserAlerteAccesMaisonCampPrototype(contexteConnexions);
  actualiserAlerteBatimentsBloquesCampPrototype(contexteConnexions.evaluation);
  const entreeCampBloquee = entreeCampBloqueeCampPrototype(contexteConnexions);
  ajouterMarqueursEntreeBloqueeCampPrototype(
    statutsConnexion,
    entreeCampBloquee
  );
  const connexionsParItem = contexteConnexions.evaluation.byItem;
  campPrototypeLayout.forEach(function(item) {
    const type = typeCampPrototype(item.type);
    if (!type) return;
    const demolitionJunk = type.category === "junk"
      ? demolitionCampPrototypePourCible(item.uid, "layout")
      : null;
    const reparationBatiment = reparationCampPourBatiment(type.id);
    const constructionMaison = constructionMaisonCampPourItem(item.uid);
    const constructionBatiment = constructionBatimentCampPourItem(item.uid);
    const ameliorationBatiment = ameliorationCampPourItem(item.uid);
    const tacheItem = tacheCampPourItem(item);
    const preteAValider = Boolean(tacheItem && tacheItem.job.readyToClaim);
    const doitEtreRepare = Boolean(
      CAMP_BUILDING_REPAIR_DURATIONS[type.id]
      && !batimentCampRepare(type.id)
    );
    const placement = placementCampPrototypePourItem(item.uid);
    const xAffiche = placement ? placement.x : item.x;
    const yAffiche = placement ? placement.y : item.y;
    const rotationAffiche = placement ? placement.rotation : item.rotation;
    const dimensions = dimensionsCampPrototype(item.type, rotationAffiche);
    const connexion = connexionsParItem[item.uid] || null;
    const connexionInactive = Boolean(connexion && !connexion.active);
    const bouton = document.createElement("button");
    bouton.type = "button";
    bouton.className = "camp-prototype-item camp-prototype-color-" + type.color;
    if (demolitionJunk) bouton.classList.add("camp-prototype-item-demolition-active");
    if (doitEtreRepare) bouton.classList.add("camp-prototype-item-needs-repair");
    if (reparationBatiment) bouton.classList.add("camp-prototype-item-repair-active");
    if (constructionMaison) bouton.classList.add("camp-prototype-item-construction-active");
    if (constructionBatiment) bouton.classList.add("camp-prototype-item-construction-active");
    if (ameliorationBatiment) bouton.classList.add("camp-prototype-item-upgrade-active");
    if (preteAValider) bouton.classList.add("camp-task-ready-to-claim");
    if (connexionInactive) bouton.classList.add("camp-prototype-item-inactive");
    bouton.dataset.campUid = item.uid;
    bouton.dataset.campType = item.type;
    if (type.category === "junk") bouton.dataset.campDemolitionLabel = type.label;
    if (type.category === "road") {
      const connexions = campPrototypeApi.connexionsRoute(
        contexteConnexions.layout,
        item.x,
        item.y
      );
      bouton.classList.add("camp-prototype-road");
      let connexionsRoutesVoisines = 0;
      ["north", "east", "south", "west"].forEach(function(direction) {
        if (connexions[direction]) bouton.classList.add("camp-prototype-road-" + direction);
        if (connexions.road[direction]) connexionsRoutesVoisines += 1;
        if (connexions.building[direction]) {
          bouton.classList.add(
            "camp-prototype-road-building-" + direction,
            "camp-prototype-road-has-building-connection"
          );
        }
        if (connexions.mergedBuilding[direction]) {
          bouton.classList.add(
            "camp-prototype-road-building-merged-" + direction
          );
        }
      });
      if (
        connexions.building.mask
        && !connexions.mergedBuilding.mask
        && connexionsRoutesVoisines >= 2
      ) {
        bouton.classList.add("camp-prototype-road-building-junction");
      }
      bouton.dataset.roadConnections = String(connexions.mask);
      bouton.dataset.roadNeighborConnections = String(connexions.road.mask);
      bouton.dataset.roadBuildingConnections = String(connexions.building.mask);
    }
    const selectionne = campPrototypeModeEdition && item.uid === campPrototypeSelectionUid;
    bouton.classList.toggle("camp-prototype-item-selected", selectionne);
    if (placement) {
      bouton.classList.add(
        "camp-prototype-item-placement-pending",
        placement.valide
          ? "camp-prototype-item-placement-valid"
          : "camp-prototype-item-placement-invalid"
      );
    }
    bouton.setAttribute("aria-pressed", selectionne ? "true" : "false");
    bouton.setAttribute("aria-label", type.label + ", column " + (xAffiche + 1)
      + ", row " + (yAffiche + 1) + ", " + dimensions.width + " by "
      + dimensions.height + " cells, Tier " + (item.tier || 1)
      + ", rotation " + dimensions.rotation + " degrees"
      + (placement ? (placement.valide
          ? ", pending valid placement"
          : ", pending invalid placement") : "")
      + (demolitionJunk ? ", demolition in progress" : "")
      + (doitEtreRepare
          ? (reparationBatiment ? ", repair in progress" : ", needs repair")
          : "")
      + (constructionMaison ? ", construction in progress" : "")
      + (constructionBatiment ? ", construction in progress" : "")
      + (preteAValider ? ", action ready to validate" : "")
      + (connexionInactive ? ", inactive, " + connexion.reason : ""));
    const workFamily = CAMP_PROTOTYPE_WORK_FAMILY_BY_TYPE[type.id];
    if (doitEtreRepare && reparationCampDebloquee(type.id)
        && !reparationBatiment && !campPrototypeModeEdition
        && itemAccessibleDepuisCamp(item)) {
      bouton.setAttribute("aria-haspopup", "dialog");
      bouton.setAttribute("aria-controls", "camp-repair-modal");
    } else if ((workFamily || CAMP_PROTOTYPE_FUNCTION_BY_TYPE[type.id] || type.category === "junk") && !campPrototypeModeEdition) {
      bouton.setAttribute("aria-haspopup", "menu");
      bouton.setAttribute("aria-expanded", "false");
      bouton.setAttribute("aria-controls", "camp-prototype-interaction-menu");
    }
    if (type.category === "road") {
      bouton.innerHTML = '<i class="camp-prototype-road-center" aria-hidden="true"></i>'
        + '<i class="camp-prototype-road-segment camp-prototype-road-segment-north" aria-hidden="true"></i>'
        + '<i class="camp-prototype-road-segment camp-prototype-road-segment-east" aria-hidden="true"></i>'
        + '<i class="camp-prototype-road-segment camp-prototype-road-segment-south" aria-hidden="true"></i>'
        + '<i class="camp-prototype-road-segment camp-prototype-road-segment-west" aria-hidden="true"></i>';
    } else {
      remplirItemCampPrototype(bouton, type, rotationAffiche, item.tier || 1);
      if (type.visualOnly) {
        const visualBadge = document.createElement("span");
        visualBadge.className = "camp-prototype-visual-only-badge camp-prototype-visual-only-badge-placed";
        visualBadge.textContent = "Visual only";
        bouton.appendChild(visualBadge);
      }
      ajouterRaccordsRouteBatimentCampPrototype(
        bouton,
        contexteConnexions.layout,
        {
          uid: item.uid,
          type: item.type,
          x: xAffiche,
          y: yAffiche,
          rotation: rotationAffiche
        },
        type
      );
      if ((item.tier || 1) > 1) {
        const tierBadge = document.createElement("span");
        tierBadge.className = "camp-building-tier-badge";
        tierBadge.textContent = "T" + (item.tier || 1);
        bouton.appendChild(tierBadge);
      }
    }
    ajouterPortraitsChatsCamp(
      bouton,
      (presences.byItem[item.uid] || []).concat(presences.byType[item.type] || [])
    );
    appliquerCadreCampPrototype(bouton, type, xAffiche, yAffiche, rotationAffiche);
    conteneur.appendChild(bouton);
    if (doitEtreRepare && reparationCampDebloquee(type.id)
        && !reparationBatiment && !campPrototypeModeEdition
        && itemAccessibleDepuisCamp(item)) {
      const repairQuick = document.createElement("button");
      repairQuick.type = "button";
      repairQuick.className = "camp-prototype-repair-quick";
      repairQuick.dataset.campRepairQuick = type.id;
      repairQuick.setAttribute("aria-label", "Repair " + type.label);
      repairQuick.title = "Repair " + type.label;
      repairQuick.style.left = ((xAffiche + dimensions.width - 0.18)
        / campPrototypeApi.GRID_WIDTH * 100) + "%";
      repairQuick.style.top = ((yAffiche + 0.18)
        / campPrototypeApi.GRID_HEIGHT * 100) + "%";
      repairQuick.innerHTML = '<img src="img/interface/Repair_Final.png?v=0.0004" alt="">';
      repairQuick.addEventListener("pointerdown", function(event) {
        event.stopPropagation();
      });
      repairQuick.addEventListener("click", function(event) {
        ouvrirModalReparationCamp(event, type.id, item.uid);
      });
      conteneur.appendChild(repairQuick);
    }
    if (!placement) {
      ajouterBadgeConnexionInactiveCampPrototype(
        statutsConnexion,
        item.uid,
        type,
        xAffiche,
        yAffiche,
        rotationAffiche,
        connexion
      );
    }
    if (placement && type.access) {
      ajouterMarqueursAccesCampPrototype(
        statutsConnexion,
        item.uid,
        type,
        xAffiche,
        yAffiche,
        rotationAffiche,
        connexion
      );
    }
  });
  const nouveauPlacement = campPrototypePlacementEnCours
    && campPrototypePlacementEnCours.mode === "new"
    ? campPrototypePlacementEnCours
    : null;
  if (
    nouveauPlacement
    && Number.isFinite(nouveauPlacement.x)
    && Number.isFinite(nouveauPlacement.y)
  ) {
    afficherApercuCampPrototype(
      nouveauPlacement.type,
      nouveauPlacement.x,
      nouveauPlacement.y,
      null,
      nouveauPlacement.rotation
    );
    const typeNouveauPlacement = typeCampPrototype(nouveauPlacement.type);
    const connexionNouveauPlacement =
      contexteConnexions.evaluation.byItem[contexteConnexions.pendingUid];
    ajouterMarqueursAccesCampPrototype(
      statutsConnexion,
      contexteConnexions.pendingUid,
      typeNouveauPlacement,
      nouveauPlacement.x,
      nouveauPlacement.y,
      nouveauPlacement.rotation,
      connexionNouveauPlacement
    );
  } else if (!campPrototypePointeur) {
    const ghost = document.getElementById("camp-prototype-ghost");
    if (ghost) ghost.hidden = true;
  }
}

function renduCampPrototype() {
  if (!DEV_MODE && !campDebloque()) return;
  document.body.classList.toggle("camp-cat-icons-hidden", etat.hideCampCatIcons === true);
  ecrireTexte(domParId("val-chatons"), etat.chatons + " / " + capaciteLogementCamp());
  const appealSummary = document.getElementById("camp-appeal-summary");
  if (appealSummary) appealSummary.textContent = "Appeal " + scoreAttractiviteCamp().total;
  renduDetailsAttractiviteCamp();
  const presencesCamp = indexerPresencesChatsCamp();
  renduVisiteurCampRecrutement();
  renduPresenceGangCamp(presencesCamp);
  rendrePaletteCampPrototype();
  rendreTerrainCampPrototype(presencesCamp);
  rendreItemsCampPrototype(presencesCamp);
  rafraichirMenuInteractionCampPrototype();
  actualiserCommandesCampPrototype();
  definirMessageCampPrototype(campPrototypeMessage);
  requestAnimationFrame(function() {
    appliquerZoomCampPrototype(false);
    if (!campPrototypeCameraInitialisee && centrerCameraInitialeCampPrototype()) {
      campPrototypeCameraInitialisee = true;
    }
    actualiserCadrageMobileCampPrototype();
    requestAnimationFrame(finaliserPremierAffichageCampPrototype);
  });
}

function localisationChatCamp(kittyIndex) {
  const missions = Array.isArray(etat.exploEnCours) ? etat.exploEnCours : [];
  const loinDuCamp = Boolean(
    missions.some(function(mission) {
      return mission && Array.isArray(mission.kittyIndices)
        && mission.kittyIndices.includes(kittyIndex);
    })
    || (etat.exploZoneEnCours
      && Array.isArray(etat.exploZoneEnCours.kittyIndices)
      && etat.exploZoneEnCours.kittyIndices.includes(kittyIndex))
    || Object.keys(etat.scoutingsEnCours || {}).some(function(scoutingId) {
      const scouting = etat.scoutingsEnCours[scoutingId];
      return scouting && scouting.kittyIndex === kittyIndex;
    })
  );
  if (loinDuCamp) return { kind: "away" };

  const constructionMaison = constructionMaisonCampPourKitty(kittyIndex);
  if (constructionMaison) return { kind: "item", uid: constructionMaison.uid };
  const constructionBatiment = constructionBatimentCampPourKitty(kittyIndex);
  if (constructionBatiment) return { kind: "item", uid: constructionBatiment.uid };
  const reparation = reparationCampPourKitty(kittyIndex);
  if (reparation) return { kind: "type", type: reparation.buildingId };
  const amelioration = ameliorationCampPourKitty(kittyIndex);
  if (amelioration) return { kind: "item", uid: amelioration.uid };
  const demolition = demolitionCampPrototypePourKitty(kittyIndex);
  if (demolition) {
    return demolition.targetKind === "layout"
      ? { kind: "item", uid: demolition.obstacleUid }
      : { kind: "terrain", uid: demolition.obstacleUid };
  }

  if ((etat.formationEnCours && etat.formationEnCours.kittyIndex === kittyIndex)
      || (etat.formationTermineeEnAttente
        && etat.formationTermineeEnAttente.kittyIndex === kittyIndex)) {
    return { kind: "type", type: "jobCenter" };
  }
  if ((etat.formationIngenieurEnCours
        && etat.formationIngenieurEnCours.kittyIndex === kittyIndex)
      || (etat.formationIngenieurTermineeEnAttente
        && etat.formationIngenieurTermineeEnAttente.kittyIndex === kittyIndex)) {
    return { kind: "type", type: "laboratory" };
  }

  const familleRecette = Object.keys(etat.workRecipeSlots || {}).find(function(family) {
    return (etat.workRecipeSlots[family] || []).some(function(slot) {
      return slot && slot.kittyIndex === kittyIndex;
    });
  });
  const batimentsWork = { wood: "sawmill", food: "catchen", rock: "pawsonry" };
  if (familleRecette && batimentsWork[familleRecette]) {
    return { kind: "type", type: batimentsWork[familleRecette] };
  }

  const familleManager = Object.keys(etat.managers || {}).find(function(family) {
    return etat.managers[family] === kittyIndex;
  });
  const batimentsManagers = {
    wood: "sawmill",
    sawmill: "sawmill",
    food: "catchen",
    catchen: "catchen",
    rock: "pawsonry",
    pawsonry: "pawsonry"
  };
  if (familleManager && batimentsManagers[familleManager]) {
    return { kind: "type", type: batimentsManagers[familleManager] };
  }

  const prepareExploration = Object.keys(carteExploSlots || {}).some(function(zoneId) {
    return (carteExploSlots[zoneId] || []).includes(kittyIndex);
  }) || Object.keys(exploKittiesSelectionnees || {}).some(function(campaignId) {
    return (exploKittiesSelectionnees[campaignId] || []).includes(kittyIndex);
  }) || Object.keys(scoutingsStagingKitty || {}).some(function(scoutingId) {
    return scoutingsStagingKitty[scoutingId] === kittyIndex;
  });
  if (prepareExploration) return { kind: "type", type: "operationsTable" };
  return { kind: "home" };
}

function tacheTemporeeCampPourKitty(kittyIndex) {
  const constructionMaison = constructionMaisonCampPourKitty(kittyIndex);
  if (constructionMaison) return { kind: "house", job: constructionMaison };
  const constructionBatiment = constructionBatimentCampPourKitty(kittyIndex);
  if (constructionBatiment) return { kind: "building", job: constructionBatiment };
  const reparation = reparationCampPourKitty(kittyIndex);
  if (reparation) return { kind: "repair", job: reparation };
  const amelioration = ameliorationCampPourKitty(kittyIndex);
  if (amelioration) return { kind: "upgrade", job: amelioration };
  const demolition = demolitionCampPrototypePourKitty(kittyIndex);
  if (demolition) return { kind: "demolition", job: demolition };
  return null;
}

function etatTacheTemporeeCamp(tache, maintenant) {
  if (!tache || !tache.job) return null;
  const duration = Math.max(0, Number(tache.job.duree || tache.job.duration) || 0);
  const elapsed = Math.max(0, ((Number(maintenant) || Date.now()) - Number(tache.job.startTs || 0)) / 1000);
  return {
    duration: duration,
    remaining: Math.max(0, duration - elapsed),
    progress: duration > 0 ? Math.min(1, elapsed / duration) : 1,
    readyToClaim: tache.job.readyToClaim === true
  };
}

function indexerPresencesChatsCamp() {
  const presences = { home: [], byItem: {}, byType: {}, byTerrain: {} };
  (etat.kittiesData || []).forEach(function(kitty, kittyIndex) {
    if (!kitty) return;
    const localisation = localisationChatCamp(kittyIndex);
    if (!localisation || localisation.kind === "away") return;
    const entree = {
      kitty: kitty,
      kittyIndex: kittyIndex,
      activity: kittyAllocationLabel(kittyIndex).text,
      timedTask: tacheTemporeeCampPourKitty(kittyIndex)
    };
    if (localisation.kind === "home") {
      presences.home.push(entree);
      return;
    }
    const groupe = localisation.kind === "item"
      ? presences.byItem
      : (localisation.kind === "terrain" ? presences.byTerrain : presences.byType);
    const cle = localisation.uid || localisation.type;
    if (!groupe[cle]) groupe[cle] = [];
    groupe[cle].push(entree);
  });
  return presences;
}

const campPortraitMetricsCache = new Map();

function appliquerCadrageVisageCamp(image, metrics) {
  if (!image || !metrics) return;
  image.classList.add("camp-cat-face-normalized");
  image.style.width = metrics.width + "%";
  image.style.height = metrics.height + "%";
  image.style.left = "50%";
  image.style.top = "50%";
  image.style.transform = "translate(-" + metrics.centerX + "%, -" + metrics.centerY + "%)";
}

function mesurerPixelsVisageCamp(image) {
  const largeurSource = image.naturalWidth;
  const hauteurSource = image.naturalHeight;
  if (!largeurSource || !hauteurSource) return null;
  const limite = 256;
  const ratio = Math.min(1, limite / Math.max(largeurSource, hauteurSource));
  const largeur = Math.max(1, Math.round(largeurSource * ratio));
  const hauteur = Math.max(1, Math.round(hauteurSource * ratio));
  const canvas = document.createElement("canvas");
  canvas.width = largeur;
  canvas.height = hauteur;
  const contexte = canvas.getContext("2d", { willReadFrequently: true });
  if (!contexte) return null;
  contexte.drawImage(image, 0, 0, largeur, hauteur);
  const pixels = contexte.getImageData(0, 0, largeur, hauteur).data;
  let gauche = largeur;
  let droite = -1;
  let haut = hauteur;
  let bas = -1;
  for (let y = 0; y < hauteur; y += 1) {
    for (let x = 0; x < largeur; x += 1) {
      if (pixels[(y * largeur + x) * 4 + 3] <= 12) continue;
      gauche = Math.min(gauche, x);
      droite = Math.max(droite, x);
      haut = Math.min(haut, y);
      bas = Math.max(bas, y);
    }
  }
  if (droite < gauche || bas < haut) return null;
  const largeurVisible = droite - gauche + 1;
  const hauteurVisible = bas - haut + 1;
  const dimensionVisible = Math.max(largeurVisible, hauteurVisible);
  const remplissage = 84;
  return {
    width: Number((remplissage * largeur / dimensionVisible).toFixed(3)),
    height: Number((remplissage * hauteur / dimensionVisible).toFixed(3)),
    centerX: Number((((gauche + droite + 1) / 2) / largeur * 100).toFixed(3)),
    centerY: Number((((haut + bas + 1) / 2) / hauteur * 100).toFixed(3))
  };
}

function normaliserImageVisageCamp(image) {
  if (!image) return;
  const appliquer = function() {
    const src = image.currentSrc || image.src;
    let metrics = campPortraitMetricsCache.get(src);
    if (!metrics) {
      try {
        metrics = mesurerPixelsVisageCamp(image);
      } catch (erreur) {
        metrics = null;
      }
      if (metrics) campPortraitMetricsCache.set(src, metrics);
    }
    if (metrics) appliquerCadrageVisageCamp(image, metrics);
  };
  if (image.complete && image.naturalWidth) {
    requestAnimationFrame(appliquer);
  } else {
    image.addEventListener("load", appliquer, { once: true });
  }
}

function configurerTimerTacheCamp(timer, tache) {
  if (!timer || !tache || !tache.job) return;
  const job = tache.job;
  if (tache.kind === "repair") timer.dataset.campRepairTimer = job.buildingId;
  if (tache.kind === "house") timer.dataset.campHouseConstructionTimer = job.uid;
  if (tache.kind === "building") timer.dataset.campBuildingConstructionTimer = job.uid;
  if (tache.kind === "upgrade") timer.dataset.campUpgradeTimer = job.uid;
  if (tache.kind === "demolition") {
    timer.dataset.campDemolitionTimer = job.obstacleUid;
    timer.dataset.campDemolitionKind = job.targetKind;
  }
}

function ajouterTacheTemporeeChatCamp(element, presence) {
  if (!element || !presence || !presence.timedTask) return;
  const state = etatTacheTemporeeCamp(presence.timedTask, Date.now());
  if (!state) return;
  const worker = document.createElement(state.readyToClaim ? "button" : "span");
  worker.className = "camp-task-worker";
  if (state.readyToClaim) worker.classList.add("camp-task-worker-ready");
  if (manualFocusTacheCampActif(presence.timedTask)) {
    worker.classList.add("camp-task-manual-focus-active");
  }
  worker.dataset.campTaskKittyIndex = String(presence.kittyIndex);
  worker.style.setProperty("--camp-task-progress", (state.progress * 100).toFixed(2) + "%");
  worker.title = presence.kitty.nom + " · " + presence.activity
    + (state.readyToClaim ? " · Ready to validate" : "");
  if (state.readyToClaim) {
    worker.type = "button";
    worker.setAttribute("aria-label", "Validate " + presence.activity + " with " + presence.kitty.nom);
    worker.addEventListener("pointerdown", function(event) { event.stopPropagation(); });
    worker.addEventListener("click", function(event) {
      event.preventDefault();
      event.stopPropagation();
      validerTacheCampDepuisChat(presence.kittyIndex);
    });
  } else {
    worker.setAttribute("aria-hidden", "true");
  }

  const ring = document.createElement("span");
  ring.className = "camp-task-progress-ring";
  const portrait = document.createElement("span");
  portrait.className = "camp-location-cat camp-task-worker-portrait";
  const image = document.createElement("img");
  image.src = presence.kitty.visage;
  image.alt = "";
  portrait.appendChild(image);
  normaliserImageVisageCamp(image);
  ring.appendChild(portrait);
  worker.appendChild(ring);

  if (!state.readyToClaim) {
    const timer = document.createElement("small");
    timer.className = "camp-task-worker-timer";
    timer.dataset.campTaskTimer = "true";
    timer.textContent = formaterTemps(state.remaining);
    configurerTimerTacheCamp(timer, presence.timedTask);
    worker.appendChild(timer);
  }
  element.appendChild(worker);
}

function ajouterPortraitsChatsCamp(element, presences) {
  if (!element || !Array.isArray(presences) || presences.length === 0) return;
  const presenceTemporee = presences.find(function(presence) { return Boolean(presence.timedTask); });
  if (presenceTemporee) ajouterTacheTemporeeChatCamp(element, presenceTemporee);
  const presencesOrdinaires = presences.filter(function(presence) {
    return !presenceTemporee || presence.kittyIndex !== presenceTemporee.kittyIndex;
  });
  if (!presencesOrdinaires.length) {
    element.setAttribute("aria-label", (element.getAttribute("aria-label") || "Camp location")
      + ", Cat working here: " + presenceTemporee.kitty.nom);
    return;
  }
  const groupe = document.createElement("span");
  groupe.className = "camp-location-cats";
  groupe.setAttribute("aria-hidden", "true");
  presencesOrdinaires.slice(0, 5).forEach(function(presence) {
    const portrait = document.createElement("span");
    portrait.className = "camp-location-cat";
    portrait.title = presence.kitty.nom + " · " + presence.activity;
    portrait.dataset.campKittyIndex = String(presence.kittyIndex);
    const image = document.createElement("img");
    image.src = presence.kitty.visage;
    image.alt = "";
    portrait.appendChild(image);
    normaliserImageVisageCamp(image);
    groupe.appendChild(portrait);
  });
  if (presencesOrdinaires.length > 5) {
    const surplus = document.createElement("strong");
    surplus.className = "camp-location-cat-more";
    surplus.textContent = "+" + (presencesOrdinaires.length - 5);
    groupe.appendChild(surplus);
  }
  element.appendChild(groupe);
  const noms = presences.map(function(presence) { return presence.kitty.nom; }).join(", ");
  element.setAttribute("aria-label", (element.getAttribute("aria-label") || "Camp location")
    + ", Cats here: " + noms);
}

function renduPresenceGangCamp(presencesCamp) {
  const conteneur = document.getElementById("camp-resident-cats");
  if (!conteneur) return;
  const presences = presencesCamp || indexerPresencesChatsCamp();
  const chatsMaison = presences.home.filter(function(presence) {
    return !estBernardoSuperviseur(presence.kitty);
  });
  const chats = chatsMaison.slice(0, 5);
  const key = chats.map(function(presence) {
    return presence.kitty.nom + "|" + presence.kitty.visage + "|" + presence.activity;
  }).join(";") + "|" + chatsMaison.length;
  if (conteneur.dataset.stateKey === key) return;
  conteneur.dataset.stateKey = key;
  conteneur.setAttribute("aria-label", chatsMaison.length + " Cat"
    + (chatsMaison.length === 1 ? "" : "s") + " near the blue house");
  conteneur.innerHTML = chats.map(function(presence) {
    return '<span class="camp-resident-cat" title="' + echapperAttributHtml(presence.kitty.nom)
      + ' · ' + echapperAttributHtml(presence.activity) + '">'
      + '<img src="' + echapperAttributHtml(presence.kitty.visage) + '" alt=""></span>';
  }).join("") + (chatsMaison.length > chats.length
    ? '<strong class="camp-resident-more">+' + (chatsMaison.length - chats.length) + '</strong>'
    : "");
  conteneur.querySelectorAll(".camp-resident-cat img").forEach(normaliserImageVisageCamp);
  const poste = document.getElementById("camp-supervisor-bernardo");
  if (poste) {
    const bernardo = etat.kittiesData.find(function(kitty) {
      return estBernardoSuperviseur(kitty);
    });
    poste.hidden = !bernardo;
    if (bernardo) {
      poste.innerHTML = '<span title="Bernardo · Supervising Base Camp"><img src="'
        + echapperAttributHtml(bernardo.visage) + '" alt=""></span>';
      normaliserImageVisageCamp(poste.querySelector("img"));
    } else {
      poste.innerHTML = "";
    }
  }
}

function nouvelleUidCampPrototype() {
  campPrototypeUidCompteur += 1;
  return "camp-" + Date.now().toString(36) + "-" + campPrototypeUidCompteur.toString(36);
}

function conquerirZoneCampPrototype(zoneId) {
  if (!DEV_MODE) return false;
  const zone = campPrototypeApi.TERRITORY_ZONES[zoneId];
  const resultat = campPrototypeApi.conquerirZoneTerrain(campPrototypeTerrain, zoneId);
  if (!zone || !resultat.valide) {
    definirMessageCampPrototype(resultat.raison || "This territory cannot be claimed yet.");
    return false;
  }
  campPrototypeTerrain = resultat.terrain;
  sauvegarderCampPrototype();
  definirMessageCampPrototype(zone.label
    + " claimed. The cats demolished the boundary fence. Clear its obstacles"
    + " to make the new cells buildable.");
  rendrePaletteCampPrototype();
  rendreTerrainCampPrototype();
  actualiserCommandesCampPrototype();
  return true;
}

function reinitialiserTerrainCampPrototype() {
  if (!DEV_MODE) return;
  constructionsMaisonsCampActives().forEach(function(construction) {
    etat.cardboardPlanks += construction.coutCardboardPlanks || 0;
  });
  etat.camp.houseConstructions = {};
  constructionsBatimentsCampActives().forEach(function(construction) {
    Object.keys(construction.costs || {}).forEach(function(resourceId) {
      if (typeof etat[resourceId] === "number") etat[resourceId] += Number(construction.costs[resourceId]) || 0;
    });
  });
  etat.camp.constructions = {};
  campPrototypeTerrain = campPrototypeApi.creerTerrainInitial();
  campPrototypeLayout = [];
  campPrototypeClotures = [];
  campPrototypeDemolitions = [];
  campPrototypeCameraInitialisee = false;
  campPrototypeCadrageMobileInitialise = false;
  campPrototypeSelectionUid = null;
  campPrototypeTypeAPlacer = null;
  campPrototypePlacementEnCours = null;
  campPrototypeRotationAPlacer = 0;
  campPrototypeGommeRoutes = false;
  campPrototypeGommeClotures = false;
  campPrototypeCategorieOuverte = null;
  sauvegarderCampPrototype();
  sauvegarder();
  definirMessageCampPrototype("Land reset to the first 3 rows of the blue garden.");
  renduCampPrototype();
}

function positionCampDepuisPointeur(event, typeId, decalageX, decalageY, rotation) {
  const board = document.getElementById("camp-prototype-board");
  const type = typeCampPrototype(typeId);
  if (!board || !type) return null;
  const dimensions = dimensionsCampPrototype(typeId, rotation);
  const cadre = board.getBoundingClientRect();
  if (cadre.width <= 0 || cadre.height <= 0) return null;
  const colonne = Math.floor((event.clientX - cadre.left) / cadre.width * campPrototypeApi.GRID_WIDTH);
  const ligne = Math.floor((event.clientY - cadre.top) / cadre.height * campPrototypeApi.GRID_HEIGHT);
  const x = Math.max(0, Math.min(
    campPrototypeApi.GRID_WIDTH - dimensions.width,
    colonne - (Number.isFinite(decalageX) ? decalageX : Math.floor(dimensions.width / 2))
  ));
  const y = Math.max(0, Math.min(
    campPrototypeApi.GRID_HEIGHT - dimensions.height,
    ligne - (Number.isFinite(decalageY) ? decalageY : Math.floor(dimensions.height / 2))
  ));
  return { x: x, y: y };
}

function areteClotureDepuisPointeurCampPrototype(event, typeId) {
  const board = document.getElementById("camp-prototype-board");
  const type = typeCampPrototype(typeId);
  if (!board || !type || !type.edgePlacement) return null;
  const cadre = board.getBoundingClientRect();
  if (cadre.width <= 0 || cadre.height <= 0) return null;
  const gridX = Math.max(0, Math.min(
    campPrototypeApi.GRID_WIDTH,
    (event.clientX - cadre.left) / cadre.width * campPrototypeApi.GRID_WIDTH
  ));
  const gridY = Math.max(0, Math.min(
    campPrototypeApi.GRID_HEIGHT,
    (event.clientY - cadre.top) / cadre.height * campPrototypeApi.GRID_HEIGHT
  ));
  const verticalX = Math.round(gridX);
  const horizontalY = Math.round(gridY);
  const distanceVerticale = Math.abs(gridX - verticalX);
  const distanceHorizontale = Math.abs(gridY - horizontalY);
  if (distanceVerticale <= distanceHorizontale) {
    return normaliserAreteClotureCampPrototype({
      type: typeId,
      x: verticalX,
      y: Math.min(campPrototypeApi.GRID_HEIGHT - 1, Math.floor(gridY)),
      orientation: "vertical"
    });
  }
  return normaliserAreteClotureCampPrototype({
    type: typeId,
    x: Math.min(campPrototypeApi.GRID_WIDTH - 1, Math.floor(gridX)),
    y: horizontalY,
    orientation: "horizontal"
  });
}

function afficherApercuCampPrototype(typeId, x, y, ignoreUid, rotation) {
  const ghost = document.getElementById("camp-prototype-ghost");
  const type = typeCampPrototype(typeId);
  if (!ghost || !type) return null;
  const resultat = campPrototypeApi.testerPlacement(
    campPrototypeLayout,
    typeId,
    x,
    y,
    ignoreUid,
    rotation,
    campPrototypeTerrain
  );
  ghost.hidden = false;
  ghost.className = "camp-prototype-item camp-prototype-ghost camp-prototype-color-"
    + type.color + (resultat.valide ? " camp-prototype-ghost-valid" : " camp-prototype-ghost-invalid");
  remplirItemCampPrototype(
    ghost,
    type,
    rotation,
    campPrototypePlacementEnCours ? campPrototypePlacementEnCours.tier : 1
  );
  ajouterRaccordsRouteBatimentCampPrototype(
    ghost,
    campPrototypeLayout,
    {
      uid: ignoreUid || "camp-pending-connector",
      type: typeId,
      x: x,
      y: y,
      rotation: rotation
    },
    type
  );
  appliquerCadreCampPrototype(ghost, type, x, y, rotation);
  if (campPrototypePlacementEnCours) {
    positionnerActionsPlacementCampPrototype(typeId, x, y, rotation);
  }
  return resultat;
}

function masquerApercuCampPrototype() {
  const ghost = document.getElementById("camp-prototype-ghost");
  if (ghost) ghost.hidden = true;
  document.querySelectorAll(".camp-prototype-item-dragging").forEach(function(item) {
    item.classList.remove("camp-prototype-item-dragging");
  });
  document.querySelectorAll(".camp-prototype-item-hold-pending").forEach(function(item) {
    item.classList.remove("camp-prototype-item-hold-pending");
  });
}

function annulerAppuiProlongeCampPrototype() {
  if (campPrototypeAppuiProlongeTimer !== null) {
    clearTimeout(campPrototypeAppuiProlongeTimer);
    campPrototypeAppuiProlongeTimer = null;
  }
  document.querySelectorAll(".camp-prototype-item-hold-pending").forEach(function(item) {
    item.classList.remove("camp-prototype-item-hold-pending");
  });
}

function selectionnerItemParAppuiProlongeCampPrototype(uid) {
  const item = itemCampPrototype(uid);
  const type = item && typeCampPrototype(item.type);
  const interaction = campPrototypePointeur;
  if (
    !item
    || !typeCampPrototypeModifiable(item.type)
    || constructionMaisonCampPourItem(item.uid)
    || constructionBatimentCampPourItem(item.uid)
    || ameliorationCampPourItem(item.uid)
    || (type && type.category === "junk"
      && demolitionCampPrototypePourCible(item.uid, "layout"))
    || !interaction
    || interaction.mode !== "hold-select"
    || interaction.uid !== uid
  ) return;
  campPrototypeAppuiProlongeTimer = null;
  fermerMenuInteractionCampPrototype();
  campPrototypeModeEdition = true;
  campPrototypeCategorieOuverte = null;
  campPrototypeSelectionUid = uid;
  campPrototypeTypeAPlacer = null;
  campPrototypeRotationAPlacer = 0;
  campPrototypeGommeRoutes = false;
  commencerPlacementExistantCampPrototype(item);
  interaction.mode = "hold-selected";
  renduCampPrototype();
  definirMessageCampPrototype(typeCampPrototype(item.type).label
    + " selected. Move or rotate it, then confirm or cancel the placement.");
  if (navigator.vibrate) navigator.vibrate(20);
}

function placerItemCampPrototype(typeId, x, y, rotation) {
  if (!campPrototypeModeEdition || !typeCampPrototypeModifiable(typeId)) return false;
  return definirPositionPlacementCampPrototype(typeId, x, y, rotation, null);
}

function modifierRoutesCampPrototype(cellules, effacer) {
  if (!campPrototypeModeEdition) return false;
  const uniques = [];
  const dejaVues = new Set();
  (cellules || []).forEach(function(cellule) {
    const cle = cellule.x + ":" + cellule.y;
    if (dejaVues.has(cle)) return;
    dejaVues.add(cle);
    uniques.push(cellule);
  });
  let modifications = 0;
  if (effacer) {
    const cles = new Set(uniques.map(function(cellule) {
      return cellule.x + ":" + cellule.y;
    }));
    const avant = campPrototypeLayout.length;
    campPrototypeLayout = campPrototypeLayout.filter(function(item) {
      return item.type !== "road" || !cles.has(item.x + ":" + item.y);
    });
    modifications = avant - campPrototypeLayout.length;
  } else {
    uniques.forEach(function(cellule) {
      if (!campPrototypeApi.testerPlacement(
        campPrototypeLayout,
        "road",
        cellule.x,
        cellule.y,
        null,
        0,
        campPrototypeTerrain
      ).valide) return;
      campPrototypeLayout.push({
        uid: nouvelleUidCampPrototype(),
        type: "road",
        tier: 1,
        x: cellule.x,
        y: cellule.y
      });
      modifications += 1;
    });
  }
  if (modifications <= 0) return false;
  campPrototypeSelectionUid = null;
  sauvegarderCampPrototype();
  rendreItemsCampPrototype();
  actualiserCommandesCampPrototype();
  definirMessageCampPrototype(effacer
    ? "Basic Trail tile" + (modifications === 1 ? "" : "s") + " removed."
    : "Basic Trail extended by " + modifications + " tile" + (modifications === 1 ? "." : "s."));
  return true;
}

function modifierCloturesCampPrototype(edges, effacer) {
  if (!campPrototypeModeEdition) return false;
  const uniques = new Map();
  (edges || []).forEach(function(edge) {
    const normalisee = normaliserAreteClotureCampPrototype(edge);
    if (normalisee) uniques.set(cleAreteClotureCampPrototype(normalisee), normalisee);
  });
  let modifications = 0;
  if (effacer) {
    const keys = new Set(uniques.keys());
    const avant = campPrototypeClotures.length;
    campPrototypeClotures = campPrototypeClotures.filter(function(edge) {
      return !keys.has(cleAreteClotureCampPrototype(edge));
    });
    modifications = avant - campPrototypeClotures.length;
  } else {
    const existantes = new Set(campPrototypeClotures.map(cleAreteClotureCampPrototype));
    uniques.forEach(function(edge, key) {
      if (existantes.has(key) || !areteClotureConstructibleCampPrototype(edge)) return;
      campPrototypeClotures.push(edge);
      existantes.add(key);
      modifications += 1;
    });
  }
  if (modifications <= 0) return false;
  sauvegarderCampPrototype();
  rendreCloturesCampPrototype();
  actualiserCommandesCampPrototype();
  definirMessageCampPrototype(effacer
    ? modifications + " fence edge" + (modifications === 1 ? " removed." : "s removed.")
    : "Fence extended by " + modifications + " edge" + (modifications === 1 ? "." : "s."));
  return true;
}

function basculerGommeRoutesCampPrototype() {
  if (!DEV_MODE) return;
  campPrototypeModeEdition = true;
  campPrototypeGommeRoutes = !campPrototypeGommeRoutes;
  campPrototypeTypeAPlacer = null;
  campPrototypePlacementEnCours = null;
  campPrototypeRotationAPlacer = 0;
  campPrototypeSelectionUid = null;
  campPrototypeCategorieOuverte = null;
  masquerApercuCampPrototype();
  rendreItemsCampPrototype();
  actualiserCommandesCampPrototype();
  definirMessageCampPrototype(campPrototypeGommeRoutes
    ? "Drag across Basic Trail tiles to erase them."
    : "Trail eraser disabled.");
}

function basculerGommeCloturesCampPrototype() {
  campPrototypeModeEdition = true;
  campPrototypeGommeClotures = !campPrototypeGommeClotures;
  campPrototypeGommeRoutes = false;
  campPrototypeTypeAPlacer = null;
  campPrototypePlacementEnCours = null;
  campPrototypeRotationAPlacer = 0;
  campPrototypeSelectionUid = null;
  campPrototypeCategorieOuverte = null;
  masquerApercuCampPrototype();
  rendreCloturesCampPrototype();
  actualiserCommandesCampPrototype();
  definirMessageCampPrototype(campPrototypeGommeClotures
    ? "Drag across player-built fence edges to erase them."
    : "Fence eraser disabled.");
}

function deplacerItemCampPrototype(uid, x, y) {
  if (!campPrototypeModeEdition) return false;
  const item = itemCampPrototype(uid);
  if (!item) return false;
  const type = typeCampPrototype(item.type);
  if (!typeCampPrototypeModifiable(item.type)) return false;
  if (constructionMaisonCampPourItem(item.uid)) {
    definirMessageCampPrototype(type.label + " cannot be moved during construction.");
    return false;
  }
  if (constructionBatimentCampPourItem(item.uid)) {
    definirMessageCampPrototype(type.label + " cannot be moved during construction.");
    return false;
  }
  if (ameliorationCampPourItem(item.uid)) {
    definirMessageCampPrototype(type.label + " cannot be moved during its upgrade.");
    return false;
  }
  if (
    type
    && type.category === "junk"
    && demolitionCampPrototypePourCible(item.uid, "layout")
  ) {
    definirMessageCampPrototype(type.label + " cannot be moved during demolition.");
    return false;
  }
  const placement = placementCampPrototypePourItem(uid)
    || commencerPlacementExistantCampPrototype(item);
  return definirPositionPlacementCampPrototype(
    item.type,
    Math.max(0, Math.min(campPrototypeApi.GRID_WIDTH - 1, x)),
    Math.max(0, Math.min(campPrototypeApi.GRID_HEIGHT - 1, y)),
    placement.rotation,
    uid
  );
}

function selectionnerItemCampPrototype(uid) {
  if (!campPrototypeModeEdition) return;
  const item = itemCampPrototype(uid);
  const type = item && typeCampPrototype(item.type);
  if (item && tacheCampPourItem(item)) {
    definirMessageCampPrototype(type.label + " cannot be moved while its Camp action is active or awaiting validation.");
    return;
  }
  if (item && !typeCampPrototypeModifiable(item.type)) {
    definirMessageCampPrototype(type.label + " cannot be edited.");
    return;
  }
  if (item && constructionMaisonCampPourItem(item.uid)) {
    definirMessageCampPrototype(type.label + " cannot be moved during construction.");
    return;
  }
  if (item && constructionBatimentCampPourItem(item.uid)) {
    definirMessageCampPrototype(type.label + " cannot be moved during construction.");
    return;
  }
  if (item && ameliorationCampPourItem(item.uid)) {
    definirMessageCampPrototype(type.label + " cannot be moved during its upgrade.");
    return;
  }
  if (
    item
    && type
    && type.category === "junk"
    && demolitionCampPrototypePourCible(item.uid, "layout")
  ) {
    campPrototypeSelectionUid = null;
    campPrototypePlacementEnCours = null;
    definirMessageCampPrototype(type.label + " cannot be edited during demolition.");
    rendreItemsCampPrototype();
    actualiserCommandesCampPrototype();
    return;
  }
  campPrototypeSelectionUid = item ? uid : null;
  campPrototypeTypeAPlacer = null;
  campPrototypeRotationAPlacer = 0;
  campPrototypeGommeRoutes = false;
  if (item && !placementCampPrototypePourItem(uid)) {
    commencerPlacementExistantCampPrototype(item);
  }
  rendreItemsCampPrototype();
  actualiserCommandesCampPrototype();
  if (item) definirMessageCampPrototype(typeCampPrototype(item.type).label
    + " selected. Move or rotate it, then confirm or cancel the placement.");
}

function tournerSelectionCampPrototype() {
  if (!campPrototypeModeEdition) return false;
  let placement = campPrototypePlacementEnCours;
  const item = itemCampPrototype(campPrototypeSelectionUid);
  if (!placement && item) placement = commencerPlacementExistantCampPrototype(item);
  if (!placement && campPrototypeTypeAPlacer) {
    placement = commencerNouveauPlacementCampPrototype(campPrototypeTypeAPlacer);
  }
  const type = placement && typeCampPrototype(placement.type);
  if (!placement || !type || !type.rotatable || !typeCampPrototypeModifiable(type.id)) return false;
  placement.rotation = campPrototypeApi.normaliserRotation((placement.rotation || 0) + 90);
  if (placement.mode === "new") campPrototypeRotationAPlacer = placement.rotation;
  prechargerRotationSuivanteCampPrototype(type, placement.rotation, placement.tier || 1);
  const resultat = actualiserValiditePlacementCampPrototype();
  const dimensions = dimensionsCampPrototype(placement.type, placement.rotation);
  definirMessageCampPrototype(type.label + " rotated to " + placement.rotation
    + "°. Footprint: " + dimensions.width + " × " + dimensions.height + ". "
    + (resultat.valide
      ? "Confirm to place it."
      : resultat.raison + " Move it to compatible cells before confirming."));
  rendreItemsCampPrototype();
  actualiserCommandesCampPrototype();
  return true;
}

function validerPlacementCampPrototype() {
  const placement = campPrototypePlacementEnCours;
  if (!campPrototypeModeEdition || !placement) return false;
  const type = typeCampPrototype(placement.type);
  const resultat = actualiserValiditePlacementCampPrototype();
  if (!type || !resultat.valide) {
    definirMessageCampPrototype((resultat && resultat.raison)
      || "Move this item to compatible cells before confirming.");
    actualiserCommandesCampPrototype();
    return false;
  }
  if (!typeCampPrototypeModifiable(type.id)) return false;
  if (placement.mode === "existing") {
    const itemExistant = itemCampPrototype(placement.uid);
    if (itemExistant && tacheCampPourItem(itemExistant)) {
      definirMessageCampPrototype(type.label + " cannot be moved while its Camp action is active or awaiting validation.");
      annulerPlacementCampPrototype();
      return false;
    }
  }
  if (placement.mode === "new" && type.category === "house") {
    return ouvrirModalConstructionMaisonCamp();
  }
  if (placement.mode === "new" && CAMP_BUILDING_CONSTRUCTION_CONFIG[type.id] && !DEV_MODE) {
    return ouvrirModalConstructionBatimentCamp();
  }
  let item = null;
  if (placement.mode === "existing") {
    item = itemCampPrototype(placement.uid);
    if (!item) return false;
    item.x = placement.x;
    item.y = placement.y;
    if (type.rotatable) item.rotation = placement.rotation;
  } else {
    item = {
      uid: nouvelleUidCampPrototype(),
      type: placement.type,
      tier: placement.tier || 1,
      x: placement.x,
      y: placement.y
    };
    if (type.rotatable) item.rotation = placement.rotation;
    campPrototypeLayout.push(item);
  }
  campPrototypePlacementEnCours = null;
  campPrototypeSelectionUid = null;
  campPrototypeTypeAPlacer = null;
  campPrototypeRotationAPlacer = 0;
  sauvegarderCampPrototype();
  masquerApercuCampPrototype();
  const message = type.label + " placed at column " + (item.x + 1)
    + ", row " + (item.y + 1) + ".";
  quitterEditionCampPrototype(false);
  definirMessageCampPrototype(message);
  return true;
}

function annulerPlacementCampPrototype() {
  const placement = campPrototypePlacementEnCours;
  if (!campPrototypeModeEdition || !placement) return false;
  const type = typeCampPrototype(placement.type);
  const etaitExistant = placement.mode === "existing";
  campPrototypePlacementEnCours = null;
  campPrototypeSelectionUid = null;
  campPrototypeTypeAPlacer = null;
  campPrototypeRotationAPlacer = 0;
  campPrototypePointeur = null;
  annulerAppuiProlongeCampPrototype();
  masquerApercuCampPrototype();
  const message = (type ? type.label : "Placement")
    + (etaitExistant
      ? " returned to its original position."
      : " placement cancelled.");
  quitterEditionCampPrototype(false);
  definirMessageCampPrototype(message);
  return true;
}

function supprimerSelectionCampPrototype() {
  const item = itemCampPrototype(campPrototypeSelectionUid);
  if (!campPrototypeModeEdition || !item || !typeCampPrototypeModifiable(item.type)) return;
  const type = typeCampPrototype(item.type);
  if (tacheCampPourItem(item)) {
    definirMessageCampPrototype(type.label + " cannot be removed while its Camp action is active or awaiting validation.");
    return;
  }
  if (constructionMaisonCampPourItem(item.uid)) {
    definirMessageCampPrototype(type.label + " cannot be removed during construction.");
    return;
  }
  if (constructionBatimentCampPourItem(item.uid)) {
    definirMessageCampPrototype(type.label + " cannot be removed during construction.");
    return;
  }
  if (ameliorationCampPourItem(item.uid)) {
    definirMessageCampPrototype(type.label + " cannot be removed during its upgrade.");
    return;
  }
  if (
    type
    && type.category === "junk"
    && demolitionCampPrototypePourCible(item.uid, "layout")
  ) {
    definirMessageCampPrototype(type.label + " cannot be removed during demolition.");
    return;
  }
  if (item.type === "cardboardBox" && item.construit === true) {
    const layoutAvantVerification = campPrototypeLayout;
    campPrototypeLayout = campPrototypeLayout.filter(function(candidate) {
      return candidate.uid !== item.uid;
    });
    invaliderConnexionsCampPrototype();
    const capaciteApresSuppression = capaciteLogementCamp();
    campPrototypeLayout = layoutAvantVerification;
    invaliderConnexionsCampPrototype();
    if (capaciteApresSuppression < etat.chatons) {
      definirMessageCampPrototype("This house is still needed by the Gang. Add more housing before removing it.");
      return;
    }
  }
  const label = type.label;
  campPrototypeLayout = campPrototypeLayout.filter(function(candidate) {
    return candidate.uid !== item.uid;
  });
  if (item.type === "cardboardBox" && item.construit === true && etat.cathouses.length > 0) {
    etat.cathouses.pop();
  }
  campPrototypeSelectionUid = null;
  campPrototypePlacementEnCours = null;
  invaliderConnexionsCampPrototype();
  sauvegarderCampPrototype();
  sauvegarder();
  quitterEditionCampPrototype(false);
  definirMessageCampPrototype(label + " removed from Base Camp.");
}

function reinitialiserCampPrototype() {
  if (!DEV_MODE) return;
  constructionsMaisonsCampActives().forEach(function(construction) {
    etat.cardboardPlanks += construction.coutCardboardPlanks || 0;
  });
  etat.camp.houseConstructions = {};
  ameliorationsCampActives().forEach(function(job) {
    Object.keys(job.costs || {}).forEach(function(resourceId) {
      if (typeof etat[resourceId] === "number") etat[resourceId] += Number(job.costs[resourceId]) || 0;
    });
  });
  etat.camp.upgrades = {};
  campPrototypeLayout = [];
  campPrototypeClotures = [];
  campPrototypeDemolitions = campPrototypeDemolitionsActives().filter(function(demolition) {
    return demolition.targetKind !== "layout";
  });
  campPrototypeSelectionUid = null;
  campPrototypeTypeAPlacer = null;
  campPrototypePlacementEnCours = null;
  campPrototypeRotationAPlacer = 0;
  campPrototypeGommeRoutes = false;
  campPrototypeGommeClotures = false;
  campPrototypeModeEdition = false;
  campPrototypeCategorieOuverte = null;
  sauvegarderCampPrototype();
  sauvegarder();
  masquerApercuCampPrototype();
  definirMessageCampPrototype("Prototype camp cleared.");
  renduCampPrototype();
}

function demarrerInteractionCampPrototype(event) {
  if (event.button > 0) return;
  const board = document.getElementById("camp-prototype-board");
  const cible = event.target.closest("[data-camp-uid]");
  if (!campPrototypeModeEdition) {
    if (!cible) return;
    const itemNormal = itemCampPrototype(cible.dataset.campUid);
    const typeNormal = itemNormal && typeCampPrototype(itemNormal.type);
    if (
      !itemNormal
      || !typeNormal
      || !typeCampPrototypeModifiable(itemNormal.type)
      || tacheCampPourItem(itemNormal)
      || constructionMaisonCampPourItem(itemNormal.uid)
      || constructionBatimentCampPourItem(itemNormal.uid)
      || (typeNormal.category === "junk"
        && demolitionCampPrototypePourCible(itemNormal.uid, "layout"))
    ) return;
    annulerAppuiProlongeCampPrototype();
    campPrototypePointeur = {
      pointerId: event.pointerId,
      mode: "hold-select",
      uid: itemNormal.uid,
      departX: event.clientX,
      departY: event.clientY
    };
    cible.classList.add("camp-prototype-item-hold-pending");
    campPrototypeAppuiProlongeTimer = setTimeout(function() {
      selectionnerItemParAppuiProlongeCampPrototype(itemNormal.uid);
    }, CAMP_PROTOTYPE_LONG_PRESS_MS);
    board.setPointerCapture(event.pointerId);
    return;
  }
  const typeContinuActif = typeCampPrototype(campPrototypeTypeAPlacer);
  if (campPrototypeGommeClotures || (typeContinuActif && typeContinuActif.edgePlacement)) {
    const typeId = typeContinuActif && typeContinuActif.edgePlacement
      ? typeContinuActif.id
      : "campBoundaryFence";
    const edge = areteClotureDepuisPointeurCampPrototype(event, typeId);
    if (!edge) return;
    const effacer = campPrototypeGommeClotures;
    campPrototypePointeur = {
      pointerId: event.pointerId,
      mode: effacer ? "erase-fence" : "paint-fence",
      type: typeId,
      edge: edge
    };
    modifierCloturesCampPrototype([edge], effacer);
    board.setPointerCapture(event.pointerId);
    event.preventDefault();
    return;
  }
  if (campPrototypeGommeRoutes || campPrototypeTypeAPlacer === "road") {
    const positionRoute = positionCampDepuisPointeur(event, "road", 0, 0);
    if (!positionRoute) return;
    const effacer = campPrototypeGommeRoutes;
    campPrototypePointeur = {
      pointerId: event.pointerId,
      mode: effacer ? "erase-road" : "paint-road",
      type: "road",
      x: positionRoute.x,
      y: positionRoute.y
    };
    modifierRoutesCampPrototype([positionRoute], effacer);
    board.setPointerCapture(event.pointerId);
    event.preventDefault();
    return;
  }
  if (campPrototypeTypeAPlacer) {
    const position = positionCampDepuisPointeur(
      event,
      campPrototypeTypeAPlacer,
      undefined,
      undefined,
      campPrototypeRotationAPlacer
    );
    if (!position) return;
    campPrototypePointeur = {
      pointerId: event.pointerId,
      mode: "place",
      type: campPrototypeTypeAPlacer,
      rotation: campPrototypeRotationAPlacer,
      x: position.x,
      y: position.y
    };
    afficherApercuCampPrototype(
      campPrototypeTypeAPlacer,
      position.x,
      position.y,
      null,
      campPrototypeRotationAPlacer
    );
    board.setPointerCapture(event.pointerId);
    event.preventDefault();
    return;
  }
  if (cible) {
    const item = itemCampPrototype(cible.dataset.campUid);
    if (!item) return;
    const type = typeCampPrototype(item.type);
    if (!typeCampPrototypeModifiable(item.type)) {
      definirMessageCampPrototype(type.label + " cannot be edited.");
      event.preventDefault();
      return;
    }
    if (constructionMaisonCampPourItem(item.uid)) {
      definirMessageCampPrototype(type.label + " cannot be moved during construction.");
      event.preventDefault();
      return;
    }
    if (constructionBatimentCampPourItem(item.uid)) {
      definirMessageCampPrototype(type.label + " cannot be moved during construction.");
      event.preventDefault();
      return;
    }
    if (ameliorationCampPourItem(item.uid)) {
      definirMessageCampPrototype(type.label + " cannot be moved during its upgrade.");
      event.preventDefault();
      return;
    }
    if (
      type
      && type.category === "junk"
      && demolitionCampPrototypePourCible(item.uid, "layout")
    ) {
      definirMessageCampPrototype(type.label + " cannot be edited during demolition.");
      event.preventDefault();
      return;
    }
    const cadre = board.getBoundingClientRect();
    const colonne = Math.floor((event.clientX - cadre.left) / cadre.width * campPrototypeApi.GRID_WIDTH);
    const ligne = Math.floor((event.clientY - cadre.top) / cadre.height * campPrototypeApi.GRID_HEIGHT);
    if (item.uid !== campPrototypeSelectionUid) {
      annulerAppuiProlongeCampPrototype();
      campPrototypePointeur = {
        pointerId: event.pointerId,
        mode: "hold-select",
        uid: item.uid,
        departX: event.clientX,
        departY: event.clientY
      };
      cible.classList.add("camp-prototype-item-hold-pending");
      campPrototypeAppuiProlongeTimer = setTimeout(function() {
        selectionnerItemParAppuiProlongeCampPrototype(item.uid);
      }, CAMP_PROTOTYPE_LONG_PRESS_MS);
      board.setPointerCapture(event.pointerId);
      return;
    }
    campPrototypeSelectionUid = item.uid;
    campPrototypeTypeAPlacer = null;
    campPrototypeRotationAPlacer = 0;
    const placement = placementCampPrototypePourItem(item.uid)
      || commencerPlacementExistantCampPrototype(item);
    const dimensions = dimensionsCampPrototype(item.type, placement.rotation);
    campPrototypePointeur = {
      pointerId: event.pointerId,
      mode: "move",
      uid: item.uid,
      type: item.type,
      rotation: placement.rotation,
      decalageX: Math.max(0, Math.min(dimensions.width - 1, colonne - placement.x)),
      decalageY: Math.max(0, Math.min(dimensions.height - 1, ligne - placement.y)),
      x: placement.x,
      y: placement.y,
      departX: event.clientX,
      departY: event.clientY,
      bouge: false
    };
    board.querySelectorAll("[data-camp-uid]").forEach(function(element) {
      const selectionne = element === cible;
      element.classList.toggle("camp-prototype-item-selected", selectionne);
      element.setAttribute("aria-pressed", selectionne ? "true" : "false");
    });
    cible.classList.add("camp-prototype-item-dragging");
    board.setPointerCapture(event.pointerId);
    actualiserCommandesCampPrototype();
    event.preventDefault();
    return;
  }
  if (!campPrototypeTypeAPlacer) {
    if (!campPrototypePlacementEnCours) {
      campPrototypeSelectionUid = null;
      rendreItemsCampPrototype();
      actualiserCommandesCampPrototype();
    }
    return;
  }
}

function deplacerInteractionCampPrototype(event) {
  if (!campPrototypePointeur) return;
  if (!campPrototypeModeEdition && campPrototypePointeur.mode !== "hold-select") return;
  if (event.pointerId !== campPrototypePointeur.pointerId) return;
  if (campPrototypePointeur.mode === "hold-select") {
    const distance = Math.hypot(
      event.clientX - campPrototypePointeur.departX,
      event.clientY - campPrototypePointeur.departY
    );
    if (distance > CAMP_PROTOTYPE_LONG_PRESS_MOVE_TOLERANCE) {
      annulerAppuiProlongeCampPrototype();
      const board = document.getElementById("camp-prototype-board");
      if (board && board.hasPointerCapture(event.pointerId)) {
        board.releasePointerCapture(event.pointerId);
      }
      campPrototypePointeur = null;
    }
    return;
  }
  if (campPrototypePointeur.mode === "hold-selected") {
    event.preventDefault();
    return;
  }
  if (
    campPrototypePointeur.mode === "paint-road"
    || campPrototypePointeur.mode === "erase-road"
  ) {
    const positionRoute = positionCampDepuisPointeur(event, "road", 0, 0);
    if (!positionRoute) return;
    const cellules = campPrototypeApi.cellulesLigne(
      campPrototypePointeur.x,
      campPrototypePointeur.y,
      positionRoute.x,
      positionRoute.y
    );
    modifierRoutesCampPrototype(
      cellules,
      campPrototypePointeur.mode === "erase-road"
    );
    campPrototypePointeur.x = positionRoute.x;
    campPrototypePointeur.y = positionRoute.y;
    event.preventDefault();
    return;
  }
  if (
    campPrototypePointeur.mode === "paint-fence"
    || campPrototypePointeur.mode === "erase-fence"
  ) {
    const edge = areteClotureDepuisPointeurCampPrototype(
      event,
      campPrototypePointeur.type
    );
    if (!edge) return;
    const edges = campPrototypeApi.aretesLigne(campPrototypePointeur.edge, edge).map(function(candidate) {
      return Object.assign({ type: campPrototypePointeur.type }, candidate);
    });
    modifierCloturesCampPrototype(
      edges,
      campPrototypePointeur.mode === "erase-fence"
    );
    campPrototypePointeur.edge = edge;
    event.preventDefault();
    return;
  }
  const position = positionCampDepuisPointeur(
    event,
    campPrototypePointeur.type,
    campPrototypePointeur.mode === "move" ? campPrototypePointeur.decalageX : undefined,
    campPrototypePointeur.mode === "move" ? campPrototypePointeur.decalageY : undefined,
    campPrototypePointeur.rotation
  );
  if (!position) return;
  campPrototypePointeur.x = position.x;
  campPrototypePointeur.y = position.y;
  if (campPrototypePointeur.mode === "move") {
    campPrototypePointeur.bouge = campPrototypePointeur.bouge
      || Math.abs(event.clientX - campPrototypePointeur.departX) > 3
      || Math.abs(event.clientY - campPrototypePointeur.departY) > 3;
  }
  afficherApercuCampPrototype(
    campPrototypePointeur.type,
    position.x,
    position.y,
    campPrototypePointeur.mode === "move" ? campPrototypePointeur.uid : null,
    campPrototypePointeur.rotation
  );
  event.preventDefault();
}

function terminerInteractionCampPrototype(event, annulee) {
  if (!campPrototypePointeur || event.pointerId !== campPrototypePointeur.pointerId) return;
  const interaction = campPrototypePointeur;
  campPrototypePointeur = null;
  annulerAppuiProlongeCampPrototype();
  const board = document.getElementById("camp-prototype-board");
  if (board && board.hasPointerCapture(event.pointerId)) board.releasePointerCapture(event.pointerId);
  if (interaction.mode === "hold-select") {
    if (!annulee) {
      campPrototypeDerniereActivationItemPointeur = Date.now();
      activerItemCampPrototype(interaction.uid);
      event.preventDefault();
    }
    return;
  }
  if (interaction.mode === "hold-selected") {
    event.preventDefault();
    return;
  }
  masquerApercuCampPrototype();
  if (!annulee) {
    if (interaction.mode === "place") {
      placerItemCampPrototype(
        interaction.type,
        interaction.x,
        interaction.y,
        interaction.rotation
      );
    } else if (interaction.mode === "paint-road" || interaction.mode === "erase-road") {
      definirMessageCampPrototype(interaction.mode === "paint-road"
        ? "Basic Trail tool active. Keep dragging to extend paths."
        : "Trail eraser active. Keep dragging to remove paths.");
    } else if (interaction.mode === "paint-fence" || interaction.mode === "erase-fence") {
      definirMessageCampPrototype(interaction.mode === "paint-fence"
        ? "Fence tool active. Keep dragging along grid edges to extend it."
        : "Fence eraser active. Keep dragging along grid edges to remove it.");
    } else if (interaction.bouge) {
      deplacerItemCampPrototype(interaction.uid, interaction.x, interaction.y);
    } else {
      selectionnerItemCampPrototype(interaction.uid);
    }
  } else {
    rendreItemsCampPrototype();
    actualiserCommandesCampPrototype();
  }
  event.preventDefault();
}

function gererClavierCampPrototype(event) {
  if (!campPrototypeModeEdition) return;
  const item = itemCampPrototype(campPrototypeSelectionUid);
  if (event.key === "Escape") {
    if (campPrototypePlacementEnCours) {
      annulerPlacementCampPrototype();
      event.stopPropagation();
    } else {
      quitterEditionCampPrototype();
    }
    event.preventDefault();
    return;
  }
  if (event.key === "r" || event.key === "R") {
    tournerSelectionCampPrototype();
    event.preventDefault();
    return;
  }
  if (!item) return;
  if (event.key === "Delete" || event.key === "Backspace") {
    supprimerSelectionCampPrototype();
    event.preventDefault();
    return;
  }
  const delta = {
    ArrowLeft: [-1, 0],
    ArrowRight: [1, 0],
    ArrowUp: [0, -1],
    ArrowDown: [0, 1]
  }[event.key];
  if (!delta) return;
  const uid = item.uid;
  const placement = placementCampPrototypePourItem(uid)
    || commencerPlacementExistantCampPrototype(item);
  if (deplacerItemCampPrototype(
    uid,
    placement.x + delta[0],
    placement.y + delta[1]
  )) {
    requestAnimationFrame(function() {
      const cible = document.querySelector('[data-camp-uid="' + uid + '"]');
      if (cible) cible.focus();
    });
  }
  event.preventDefault();
}

function initialiserCampPrototype() {
  if (campPrototypeInitialise) return;
  const board = document.getElementById("camp-prototype-board");
  const viewport = document.querySelector(".camp-prototype-viewport");
  const menuInteraction = document.getElementById("camp-prototype-interaction-menu");
  const actionsPlacement = document.getElementById("camp-prototype-placement-actions");
  if (!board || !viewport || !menuInteraction || !actionsPlacement) return;
  campPrototypeInitialise = true;
  chargerCampPrototype();
  board.addEventListener("pointerdown", demarrerInteractionCampPrototype);
  board.addEventListener("pointermove", deplacerInteractionCampPrototype);
  board.addEventListener("pointerup", function(event) {
    terminerInteractionCampPrototype(event, false);
  });
  board.addEventListener("pointercancel", function(event) {
    terminerInteractionCampPrototype(event, true);
  });
  board.addEventListener("pointerleave", function() {
    if (!campPrototypePointeur && !campPrototypePlacementEnCours) {
      masquerApercuCampPrototype();
    }
  });
  viewport.addEventListener("touchstart", demarrerPincementCampPrototype, { passive: false });
  viewport.addEventListener("touchmove", deplacerPincementCampPrototype, { passive: false });
  viewport.addEventListener("touchend", terminerPincementCampPrototype);
  viewport.addEventListener("touchcancel", terminerPincementCampPrototype);
  viewport.addEventListener("scroll", function() {
    bornerCameraHorizontaleMobileCampPrototype();
    if (viewport.scrollLeft !== 0 || viewport.scrollTop !== 0) {
      campPrototypeCameraInitialisee = true;
    }
  }, { passive: true });
  board.addEventListener("keydown", gererClavierCampPrototype);
  actionsPlacement.addEventListener("pointerdown", function(event) {
    event.stopPropagation();
  });
  actionsPlacement.addEventListener("click", function(event) {
    event.stopPropagation();
  });
  menuInteraction.addEventListener("pointerdown", function(event) {
    event.stopPropagation();
  });
  menuInteraction.addEventListener("pointerup", gererPointeurActionMenuCampPrototype);
  menuInteraction.addEventListener("click", gererClicActionMenuCampPrototype);
  document.addEventListener("click", function(event) {
    const alerteBloques = document.getElementById("camp-prototype-blocked-alert");
    if (
      alerteBloques
      && event.target.closest
      && !event.target.closest("#camp-prototype-blocked-alert")
    ) {
      fermerAlerteBatimentsBloquesCampPrototype();
    }
  });
  window.addEventListener("resize", function() {
    invaliderLargeurBaseCampPrototype();
    appliquerZoomCampPrototype(false);
    requestAnimationFrame(actualiserCadrageMobileCampPrototype);
  });
  board.addEventListener("click", function(event) {
    if (Date.now() - campPrototypeDerniereActivationItemPointeur < 700) {
      event.preventDefault();
      event.stopPropagation();
      return;
    }
    const cible = event.target.closest("[data-camp-uid]");
    const cibleObstacle = event.target.closest("[data-camp-obstacle-uid]");
    if (!cible && cibleObstacle) {
      if (campPrototypeModeEdition) {
        fermerMenuInteractionCampPrototype();
        definirMessageCampPrototype("Debris cannot be changed in Edit mode.");
      } else {
        ouvrirMenuDemolitionCampPrototype(
          cibleObstacle.dataset.campObstacleUid,
          "terrain"
        );
      }
      return;
    }
    if (!cible) {
      if (!campPrototypeModeEdition) fermerMenuInteractionCampPrototype();
      return;
    }
    if (campPrototypeModeEdition && event.detail === 0) {
      selectionnerItemCampPrototype(cible.dataset.campUid);
      return;
    }
    if (!campPrototypeModeEdition) {
      activerItemCampPrototype(cible.dataset.campUid);
    }
  });
  document.addEventListener("keydown", function(event) {
    if (event.key === "Escape") {
      const panneauBloques = document.getElementById("camp-prototype-blocked-alert-panel");
      if (panneauBloques && !panneauBloques.hidden) {
        fermerAlerteBatimentsBloquesCampPrototype();
        const boutonBloques = document.getElementById("camp-prototype-blocked-alert-toggle");
        if (boutonBloques) boutonBloques.focus();
        event.preventDefault();
        return;
      }
    }
    if (!campPrototypeModeEdition) return;
    if (event.key === "Escape") {
      if (campPrototypePlacementEnCours) {
        annulerPlacementCampPrototype();
      } else {
        quitterEditionCampPrototype();
      }
      event.preventDefault();
      return;
    }
  });
  renduCampPrototype();
}

// ════════════════════════════════════════════════════════════
// 13. UI CONTROLS  (tabs · speed · panel toggles)
// ════════════════════════════════════════════════════════════

function changerOnglet(id) {
  if (!IDS_ONGLETS.includes(id)) return;
  if (id === "camp" && !campDebloque()) return;
  if (id === "explorations" && !explorationCampFonctionnelle()) return;
  if (id === "logs" && etat.chatons < 3) return;
  if (id !== "camp") fermerMenuInteractionCampPrototype();
  if (id !== "camp" && campPrototypeModeEdition) quitterEditionCampPrototype(false);
  const estMobile = window.matchMedia("(max-width: 768px)").matches;
  // On mobile, the Gang tab is the list landing view. Returning to it from
  // another tab must not reopen the kitty profile that was previously open.
  if (id === "gang" && estMobile) {
    detailKittyMobileOuvert = false;
  }
  // Explorations is the map landing page on mobile. A zone workspace is
  // temporary, so returning to the tab always starts from the map.
  if (id === "explorations" && estMobile) {
    explorationMobileVue = "map";
    explorationMobileTypeMission = "campaigns";
  }
  document.body.classList.remove("interface-compacte");
  const premierAffichageCamp = id === "camp"
    && (!Array.isArray(etat.ongletsVisites) || !etat.ongletsVisites.includes("camp"));
  if (premierAffichageCamp) preparerPremierAffichageCampPrototype();
  marquerOngletVisite(id);
  // The Camp panel becomes visible before its heavier render is scheduled.
  // Apply neighbor masks synchronously so no undiscovered garden can flash.
  if (id === "camp") actualiserMasquageJardinsVoisinsCampPrototype();
  IDS_ONGLETS.forEach(function(tab) {
    const actif = id === tab;
    const panneau = document.getElementById("contenu-" + tab);
    const bouton = document.getElementById("onglet-" + tab);
    panneau.style.display = actif ? "block" : "none";
    panneau.setAttribute("aria-hidden", actif ? "false" : "true");
    bouton.classList.toggle("onglet-actif", actif);
    bouton.setAttribute("aria-selected", actif ? "true" : "false");
    bouton.tabIndex = actif ? 0 : -1;
  });
  document.body.dataset.ongletActif = id;
  if (id === "camp") definirObjectifsReduits(true);
  if (id === "explorations") { exploTabDirty  = true; }
  if (id === "inventaire")  { inventaireDirty = true; }
  if (id === "facilities")  { jcDirty = true; labDirty = true; }
  // Let the browser paint the new tab state before doing the heavier section
  // render. Calls are coalesced so rapid taps only render the final tab.
  planifierRenduOnglet(function() {
    rendu(); // render the newly visible tab immediately instead of waiting for the next 100 ms tick
    if (id === "gang") renduManagement();
  });
  if (estMobile) {
    // Every tab opens from its own top. The guide is collapsed into its fixed
    // dock so it cannot retain an overlay or move the new section off-screen.
    definirObjectifsReduits(true);
    const contenuPrincipal = document.getElementById("contenu-principal");
    const panneauActif = document.getElementById("contenu-" + id);
    if (contenuPrincipal) contenuPrincipal.scrollTop = 0;
    if (panneauActif) panneauActif.scrollTop = 0;
  }
}

function gererNavigationOnglets(e) {
  if (!e.target.matches(".onglet[role='tab']")) return;
  const onglets = Array.from(document.querySelectorAll(".barre-onglets .onglet")).filter(function(onglet) {
    return !onglet.disabled && getComputedStyle(onglet).display !== "none";
  });
  const index = onglets.indexOf(e.target);
  let suivant = null;
  const navigationVerticale = window.matchMedia("(min-width: 769px)").matches;
  if (e.key === "ArrowRight" || (navigationVerticale && e.key === "ArrowDown")) suivant = (index + 1) % onglets.length;
  if (e.key === "ArrowLeft" || (navigationVerticale && e.key === "ArrowUp"))  suivant = (index - 1 + onglets.length) % onglets.length;
  if (e.key === "Home") suivant = 0;
  if (e.key === "End")  suivant = onglets.length - 1;
  if (suivant === null) return;
  e.preventDefault();
  const cible = onglets[suivant];
  cible.focus();
  changerOnglet(cible.id.replace("onglet-", ""));
}

document.querySelector(".barre-onglets").addEventListener("keydown", gererNavigationOnglets);

function actualiserOrientationNavigationPrincipale() {
  const navigation = document.querySelector(".barre-onglets");
  if (!navigation) return;
  navigation.setAttribute("aria-orientation", window.innerWidth > 768 ? "vertical" : "horizontal");
}

actualiserOrientationNavigationPrincipale();
window.addEventListener("resize", actualiserOrientationNavigationPrincipale);

const SEUIL_COMPACTAGE_ENTETE_MOBILE = 48;
const SEUIL_DECOMPACTAGE_ENTETE_MOBILE = 8;

function gererDensiteMobileAuScroll() {
  if (window.innerWidth > 768) {
    document.body.classList.remove("interface-compacte");
    return;
  }
  const contenuPrincipal = document.getElementById("contenu-principal");
  const position = contenuPrincipal ? contenuPrincipal.scrollTop : window.scrollY;
  const estCompacte = document.body.classList.contains("interface-compacte");

  // Deux seuils evitent la boucle produite quand le bandeau raccourci modifie
  // instantanement la position de scroll autour du point de bascule.
  if (!estCompacte && position > SEUIL_COMPACTAGE_ENTETE_MOBILE) {
    document.body.classList.add("interface-compacte");
  } else if (estCompacte && position < SEUIL_DECOMPACTAGE_ENTETE_MOBILE) {
    document.body.classList.remove("interface-compacte");
  }
}

document.addEventListener("scroll", gererDensiteMobileAuScroll, true);
function actualiserHauteurTopBar() {
  const topBar = document.getElementById("top-bar");
  if (!topBar) return;
  document.documentElement.style.setProperty("--hauteur-top-bar", topBar.getBoundingClientRect().height + "px");
}
const topBarPourResize = document.getElementById("top-bar");
if (topBarPourResize && typeof ResizeObserver === "function") {
  new ResizeObserver(actualiserHauteurTopBar).observe(topBarPourResize);
}
actualiserHauteurTopBar();
window.addEventListener("resize", function() {
  if (window.innerWidth > 768) document.body.classList.remove("interface-compacte");
  actualiserHauteurTopBar();
  renduObjectifs();
});

function cyclerVitesse() {
  if (!DEV_MODE) {
    vitesse = 1;
    return;
  }
  const idx = VITESSES.indexOf(vitesse);
  vitesse = VITESSES[(idx + 1) % VITESSES.length];
  const btn = document.getElementById("bouton-vitesse");
  btn.textContent = vitesse === 1 ? "1×" : "⚡ " + vitesse + "×";
  btn.classList.toggle("vitesse-active", vitesse > 1);
}

function definirObjectifsReduits(reduit) {
  const panneau = document.getElementById("panneau-objectifs");
  const btn     = document.getElementById("objectifs-toggle");
  const titre   = document.getElementById("objectifs-titre");
  panneau.classList.toggle("reduit", reduit);
  btn.textContent = reduit ? "+" : "−";
  btn.setAttribute("aria-expanded", reduit ? "false" : "true");
  btn.title = reduit ? "Expand guide" : "Collapse guide";
  titre.setAttribute("aria-expanded", reduit ? "false" : "true");
}

function toggleObjectifs() {
  const panneau = document.getElementById("panneau-objectifs");
  definirObjectifsReduits(!panneau.classList.contains("reduit"));
}

var ressourceTooltipFlottant = null;
var ressourceTooltipSource = null;

function fermerTooltipRessource() {
  if (ressourceTooltipSource) {
    ressourceTooltipSource.setAttribute("aria-expanded", "false");
    const descriptions = ressourceTooltipSource.dataset.descriptionIds || "";
    if (descriptions) ressourceTooltipSource.setAttribute("aria-describedby", descriptions);
    else ressourceTooltipSource.removeAttribute("aria-describedby");
  }
  if (ressourceTooltipFlottant) ressourceTooltipFlottant.remove();
  ressourceTooltipFlottant = null;
  ressourceTooltipSource = null;
}

function ouvrirTooltipRessource(ressource) {
  if (!ressource || !ressource.dataset.tooltip) return;
  if (ressourceTooltipSource === ressource) {
    fermerTooltipRessource();
    return;
  }
  fermerTooltipRessource();

  const tooltip = document.createElement("div");
  tooltip.id = "ressource-tooltip";
  tooltip.className = "ressource-tooltip-flottant";
  tooltip.setAttribute("role", "tooltip");
  tooltip.textContent = ressource.dataset.tooltip;
  document.body.appendChild(tooltip);

  const rect = ressource.getBoundingClientRect();
  const demiLargeur = tooltip.offsetWidth / 2;
  const marge = 8;
  const centre = Math.min(
    window.innerWidth - demiLargeur - marge,
    Math.max(demiLargeur + marge, rect.left + rect.width / 2)
  );
  let top = rect.bottom + 6;
  if (top + tooltip.offsetHeight > window.innerHeight - marge) top = rect.top - tooltip.offsetHeight - 6;
  tooltip.style.left = centre + "px";
  tooltip.style.top = Math.max(marge, top) + "px";

  ressourceTooltipFlottant = tooltip;
  ressourceTooltipSource = ressource;
  ressource.setAttribute("aria-expanded", "true");
  const descriptions = [ressource.dataset.descriptionIds, tooltip.id].filter(Boolean).join(" ");
  ressource.setAttribute("aria-describedby", descriptions);
}

function initialiserRessourcesAccessibles() {
  document.querySelectorAll(".ressource[data-tooltip]").forEach(function(ressource) {
    ressource.tabIndex = 0;
    ressource.setAttribute("role", "button");
    ressource.setAttribute("aria-label", ressource.dataset.tooltip);
    ressource.setAttribute("aria-expanded", "false");
    ressource.setAttribute("aria-controls", "ressource-tooltip");
    const descriptions = Array.from(ressource.querySelectorAll(".ressource-valeur[id], .ressource-taux[id]"))
      .map(function(element) { return element.id; })
      .join(" ");
    ressource.dataset.descriptionIds = descriptions;
    if (descriptions) ressource.setAttribute("aria-describedby", descriptions);
  });

  document.addEventListener("click", function(event) {
    const ressource = event.target.closest ? event.target.closest(".ressource[data-tooltip]") : null;
    if (ressource) ouvrirTooltipRessource(ressource);
    else fermerTooltipRessource();
  });
  document.addEventListener("keydown", function(event) {
    const ressource = event.target.closest ? event.target.closest(".ressource[data-tooltip]") : null;
    if (ressource && (event.key === "Enter" || event.key === " ")) {
      event.preventDefault();
      ouvrirTooltipRessource(ressource);
    } else if (event.key === "Escape") {
      fermerTooltipRessource();
    }
  });
  const barreRessources = document.getElementById("ressources-liste");
  if (barreRessources) barreRessources.addEventListener("scroll", fermerTooltipRessource, { passive: true });
  window.addEventListener("resize", fermerTooltipRessource);
}


// ════════════════════════════════════════════════════════════
// 13a-bis. SHARED MINI-GAME RUNTIME
// ════════════════════════════════════════════════════════════

const MINI_JEU_FRAME_DT_MAX = 0.05;
const miniJeuRuntime = {
  actif: null,
  generation: 0,
  animations: new Map(),
  layoutVersion: 0,
  renduEnAttente: false
};

function miniJeuRuntimeActif(id) {
  return id ? miniJeuRuntime.actif === id : miniJeuRuntime.actif !== null;
}

function ouvrirSessionMiniJeu(id) {
  if (!id || miniJeuRuntime.actif) return false;
  miniJeuRuntime.actif = id;
  miniJeuRuntime.generation += 1;
  miniJeuRuntime.layoutVersion += 1;
  miniJeuRuntime.renduEnAttente = false;
  if (document.body) {
    document.body.classList.add("mini-game-runtime-active");
    document.body.dataset.activeMiniGame = id;
  }
  return true;
}

function arreterAnimationMiniJeu(id) {
  const animation = miniJeuRuntime.animations.get(id);
  if (!animation) return;
  if (animation.raf !== null) cancelAnimationFrame(animation.raf);
  miniJeuRuntime.animations.delete(id);
}

function demarrerAnimationMiniJeu(id, callback) {
  if (!miniJeuRuntimeActif(id) || typeof callback !== "function") return false;
  arreterAnimationMiniJeu(id);
  const generation = miniJeuRuntime.generation;
  const animation = {
    raf: null,
    last: performance.now(),
    layoutVersion: -1
  };

  function frame(timestamp) {
    if (!miniJeuRuntimeActif(id) || generation !== miniJeuRuntime.generation) {
      miniJeuRuntime.animations.delete(id);
      return;
    }
    const dt = Math.min(MINI_JEU_FRAME_DT_MAX, Math.max(0, (timestamp - animation.last) / 1000));
    const layoutChanged = animation.layoutVersion !== miniJeuRuntime.layoutVersion;
    animation.last = timestamp;
    animation.layoutVersion = miniJeuRuntime.layoutVersion;
    const continuer = callback(dt, { layoutChanged: layoutChanged, timestamp: timestamp });
    if (continuer === false || !miniJeuRuntimeActif(id) || generation !== miniJeuRuntime.generation) {
      miniJeuRuntime.animations.delete(id);
      return;
    }
    animation.raf = requestAnimationFrame(frame);
  }

  animation.raf = requestAnimationFrame(frame);
  miniJeuRuntime.animations.set(id, animation);
  return true;
}

function fermerSessionMiniJeu(id) {
  arreterAnimationMiniJeu(id);
  if (!miniJeuRuntimeActif(id)) return;
  miniJeuRuntime.actif = null;
  miniJeuRuntime.generation += 1;
  if (document.body) {
    document.body.classList.remove("mini-game-runtime-active");
    delete document.body.dataset.activeMiniGame;
  }
  const renduRequis = miniJeuRuntime.renduEnAttente;
  miniJeuRuntime.renduEnAttente = false;
  requestAnimationFrame(function() {
    // One clean foreground refresh replaces every skipped background render.
    if (renduRequis || !miniJeuRuntimeActif()) rendu();
  });
}

function reinitialiserHorlogesMiniJeux() {
  miniJeuRuntime.layoutVersion += 1;
  const maintenant = performance.now();
  miniJeuRuntime.animations.forEach(function(animation) {
    animation.last = maintenant;
  });
}

document.addEventListener("visibilitychange", function() {
  if (document.visibilityState === "visible") reinitialiserHorlogesMiniJeux();
});
window.addEventListener("pageshow", reinitialiserHorlogesMiniJeux);
window.addEventListener("focus", reinitialiserHorlogesMiniJeux);
window.addEventListener("resize", reinitialiserHorlogesMiniJeux, { passive: true });

function positionnerCurseurMiniJeu(cursor, largeurPiste, pourcentage) {
  if (!cursor) return;
  const x = Math.max(0, Math.min(100, pourcentage)) / 100 * Math.max(0, largeurPiste || 0);
  cursor.style.transform = "translate3d(" + x.toFixed(2) + "px, 0, 0) translateX(-50%)";
}

// ════════════════════════════════════════════════════════════
// 13b. FIRST THREE CATS CATCH MINI-GAME
// ════════════════════════════════════════════════════════════

var _catCatchCursorPct = 0;
var _catCatchDir = 1;
var _catCatchActif = false;
var _catCatchNom = "";
const CAT_CATCH_SPEEDS = [60, 80, 100];

function arreterAnimationMiniJeuCatch() {
  arreterAnimationMiniJeu("catch-cat");
}

function ouvrirMiniJeuCatch() {
  if (etat.chatons >= 3 || !sequenceEstPrete() || _catCatchActif) return;
  if (!ouvrirSessionMiniJeu("catch-cat")) return;
  _catCatchNom = nomProchainChat();
  const vitesseCatch = CAT_CATCH_SPEEDS[etat.chatons] || 100;
  const visage = assurerVisageProchainChat();
  const titre = document.getElementById("cat-catch-minijeu-titre");
  const icone = document.getElementById("cat-catch-target-icone");
  if (titre) titre.textContent = "Catch " + _catCatchNom + "!";
  if (icone) {
    icone.src = visage;
    icone.alt = _catCatchNom + " target";
  }

  _catCatchActif = true;
  renduSequence();
  _catCatchCursorPct = 0;
  _catCatchDir = 1;
  ouvrirDialogueModal("cat-catch-minijeu", {
    dismissible: true,
    fermer: echouerMiniJeuCatch,
    focusSelector: ".cat-catch-action",
    returnFocusSelector: "#bouton-sequence"
  });

  const cursor = document.getElementById("cat-catch-cursor");
  const track = cursor ? cursor.closest(".bird-track") : null;
  let largeurPiste = track ? track.clientWidth : 0;
  positionnerCurseurMiniJeu(cursor, largeurPiste, _catCatchCursorPct);
  demarrerAnimationMiniJeu("catch-cat", function(dt, frameInfo) {
    if (!_catCatchActif) return false;
    if (frameInfo.layoutChanged && track) largeurPiste = track.clientWidth;
    _catCatchCursorPct += _catCatchDir * vitesseCatch * dt;
    if (_catCatchCursorPct >= 100) { _catCatchCursorPct = 100; _catCatchDir = -1; }
    if (_catCatchCursorPct <= 0)   { _catCatchCursorPct = 0;   _catCatchDir =  1; }
    positionnerCurseurMiniJeu(cursor, largeurPiste, _catCatchCursorPct);
    return true;
  });
}

function echouerMiniJeuCatch() {
  if (!_catCatchActif) return;
  _catCatchActif = false;
  arreterAnimationMiniJeuCatch();
  fermerDialogueModal("cat-catch-minijeu");
  fermerSessionMiniJeu("catch-cat");
  if (prologueCaptureEnCours()) {
    etat.sequenceEnCours = false;
    afficherNotification(_catCatchNom + " got away. Try again!");
    afficherCiblePrologue();
  } else {
    demarrerRechargeCatch();
    afficherNotification(_catCatchNom + " got away. Try again when the timer is ready!");
  }
  ajouterLog("event", "Failed to catch " + _catCatchNom + ".");
  sauvegarder();
  rendu();
}

function clickerCatCatch() {
  if (!_catCatchActif) return;
  const success = _catCatchCursorPct >= 40 && _catCatchCursorPct <= 60;
  if (!success) {
    echouerMiniJeuCatch();
    return;
  }
  _catCatchActif = false;
  arreterAnimationMiniJeuCatch();
  fermerDialogueModal("cat-catch-minijeu");
  fermerSessionMiniJeu("catch-cat");
  terminerSequence();
}

document.addEventListener("keydown", function(e) {
  if (e.key !== " " && e.key !== "Enter") return;
  var modal = document.getElementById("cat-catch-minijeu");
  if (!modal || modal.style.display === "none") return;
  if (e.target && e.target.closest && e.target.closest("button, input, select, textarea, [role=button]")) return;
  e.preventDefault();
  clickerCatCatch();
});

// ════════════════════════════════════════════════════════════
// 13c. RECRUITMENT MINI-GAME: PURRSUASION
// ════════════════════════════════════════════════════════════

const RECRUIT_GAME_DURATION = 10;
const RECRUIT_GOOD_MIN = 42;
const RECRUIT_GOOD_MAX = 68;
const RECRUIT_HOLD_TARGET = 2;
const RECRUIT_RISE_SPEED = 42;
const RECRUIT_FALL_SPEED = 20;
const RECRUIT_DIALOGUES = [
  {
    visitor: "I'm alone... and I haven't eaten in days.",
    bernardo: "We have plenty of food. Join us, and you'll never go hungry again."
  },
  {
    visitor: "I don't have anywhere safe to sleep.",
    bernardo: "We have shelter, warm beds, and cats watching each other's backs."
  },
  {
    visitor: "The humans keep chasing me away.",
    bernardo: "Then you need protection. Nobody messes with a member of my gang."
  },
  {
    visitor: "I don't trust gangs.",
    bernardo: "Good instinct. This isn't just a gang - it's an organization. With snacks."
  },
  {
    visitor: "What exactly do I get if I join?",
    bernardo: "Food, shelter, purpose, and the privilege of exceptional leadership."
  },
  {
    visitor: "I've always managed perfectly well on my own.",
    bernardo: "So did I. Then I realized being alone means nobody brings you dinner."
  },
  {
    visitor: "Why should I follow you?",
    bernardo: "Because I have a plan, a camp, and several cats who already pretend to agree with me."
  },
  {
    visitor: "I'm not much of a fighter.",
    bernardo: "Perfect. We need builders, cooks, explorers... Everyone has a place here."
  },
  {
    visitor: "The humans own everything around here.",
    bernardo: "Not for long. We're building something of our own, one cardboard box at a time."
  },
  {
    visitor: "This sounds suspiciously like work.",
    bernardo: "It is - but organized work, with meals, shelter, and promotion opportunities."
  }
];
var _recruitMiniJeuActif = false;
var _recruitPitchActif = false;
var _recruitTimerDemarre = false;
var _recruitTrust = 18;
var _recruitGoodTime = 0;
var _recruitTimeLeft = RECRUIT_GAME_DURATION;
var _recruitNom = "";
var _recruitDifficulty = 1;
var _recruitSpeedMultiplier = 1;
var _recruitDialoguePrecedent = -1;
var _recruitTrackWidth = 0;

function choisirDialogueRecruit() {
  var index = Math.floor(Math.random() * RECRUIT_DIALOGUES.length);
  if (index === _recruitDialoguePrecedent && RECRUIT_DIALOGUES.length > 1) {
    index = (index + 1 + Math.floor(Math.random() * (RECRUIT_DIALOGUES.length - 1))) % RECRUIT_DIALOGUES.length;
  }
  _recruitDialoguePrecedent = index;
  return RECRUIT_DIALOGUES[index];
}

function arreterAnimationMiniJeuRecruit() {
  arreterAnimationMiniJeu("recruit");
}

function mettreAJourMiniJeuRecruit() {
  const track = document.getElementById("recruit-trust-track");
  const fill = document.getElementById("recruit-trust-fill");
  const marker = document.getElementById("recruit-trust-marker");
  const time = document.getElementById("recruit-time-left");
  const progress = document.getElementById("recruit-hold-progress");
  const pct = Math.max(0, Math.min(100, _recruitTrust));
  if (fill) {
    fill.style.width = "100%";
    fill.style.transform = "scaleX(" + (pct / 100).toFixed(4) + ")";
  }
  if (marker) {
    marker.style.left = "0";
    positionnerCurseurMiniJeu(marker, _recruitTrackWidth, pct);
  }
  if (track) track.setAttribute("aria-valuenow", Math.round(pct));
  if (time) time.textContent = Math.max(0, _recruitTimeLeft).toFixed(1) + "s";
  if (progress) progress.textContent = "Keep their interest: " + Math.min(RECRUIT_HOLD_TARGET, _recruitGoodTime).toFixed(1) + " / " + RECRUIT_HOLD_TARGET.toFixed(1) + "s";
}

function definirPitchRecruitActif(actif) {
  _recruitPitchActif = Boolean(actif) && _recruitMiniJeuActif;
  const bouton = document.getElementById("recruit-pitch-btn");
  if (bouton) bouton.classList.toggle("pitch-active", _recruitPitchActif);
}

function demarrerTimerMiniJeuRecruit() {
  if (_recruitTimerDemarre || !_recruitMiniJeuActif) return;
  _recruitTimerDemarre = true;
  const bouton = document.getElementById("recruit-pitch-btn");
  if (bouton) bouton.textContent = "HOLD TO MAKE YOUR PITCH";
  demarrerAnimationMiniJeu("recruit", function(dt, frameInfo) {
    if (!_recruitMiniJeuActif) return false;
    if (frameInfo.layoutChanged) {
      const track = document.getElementById("recruit-trust-track");
      _recruitTrackWidth = track ? track.clientWidth : 0;
    }
    _recruitTimeLeft -= dt;
    const vitesse = (_recruitPitchActif ? RECRUIT_RISE_SPEED : -RECRUIT_FALL_SPEED) * _recruitSpeedMultiplier;
    _recruitTrust += vitesse * dt;
    _recruitTrust = Math.max(0, _recruitTrust);
    if (_recruitTrust >= RECRUIT_GOOD_MIN && _recruitTrust < RECRUIT_GOOD_MAX) _recruitGoodTime += dt;
    mettreAJourMiniJeuRecruit();

    if (_recruitTrust >= RECRUIT_GOOD_MAX) {
      echouerMiniJeuRecruit("too-pushy");
      return false;
    }
    if (_recruitGoodTime >= RECRUIT_HOLD_TARGET) {
      reussirMiniJeuRecruit();
      return false;
    }
    if (_recruitTimeLeft <= 0) {
      echouerMiniJeuRecruit("timeout");
      return false;
    }
    return true;
  });
}

function commencerPitchRecruit(event) {
  if (event) event.preventDefault();
  demarrerTimerMiniJeuRecruit();
  definirPitchRecruitActif(true);
}

function arreterPitchRecruit(event) {
  if (event) event.preventDefault();
  definirPitchRecruitActif(false);
}

function gererClavierPitchRecruit(event, actif) {
  if (event.key !== " " && event.key !== "Enter") return;
  event.preventDefault();
  definirPitchRecruitActif(actif);
}

function ouvrirMiniJeuRecruit() {
  if (etat.chatons < 3 || !recrutementDepuisCampDebloque()
      || !sequenceEstPrete() || _recruitMiniJeuActif || campLogementSature()) return;
  if (!ouvrirSessionMiniJeu("recruit")) return;
  _recruitNom = nomProchainChat();
  const portrait = document.getElementById("recruit-target-portrait");
  const nom = document.getElementById("recruit-target-name");
  const visitorSpeech = document.getElementById("recruit-visitor-speech");
  const bernardoSpeech = document.getElementById("recruit-bernardo-speech");
  const dialogue = choisirDialogueRecruit();
  if (portrait) portrait.src = assurerVisageProchainChat();
  if (nom) nom.textContent = _recruitNom;
  if (visitorSpeech) {
    visitorSpeech.textContent = dialogue.visitor;
    visitorSpeech.setAttribute("aria-label", _recruitNom + " says: " + dialogue.visitor);
  }
  if (bernardoSpeech) {
    bernardoSpeech.textContent = dialogue.bernardo;
    bernardoSpeech.setAttribute("aria-label", "Bernardo says: " + dialogue.bernardo);
  }

  _recruitMiniJeuActif = true;
  renduSequence();
  _recruitPitchActif = false;
  _recruitTimerDemarre = false;
  _recruitTrust = 18;
  _recruitGoodTime = 0;
  _recruitTimeLeft = RECRUIT_GAME_DURATION;
  _recruitDifficulty = Math.max(1, etat.chatons - 2);
  _recruitSpeedMultiplier = 1 + (_recruitDifficulty - 1) * 0.1;
  const difficulty = document.getElementById("recruit-difficulty");
  const bouton = document.getElementById("recruit-pitch-btn");
  if (difficulty) difficulty.textContent = "Difficulty " + _recruitDifficulty + " · Cursor speed ×" + _recruitSpeedMultiplier.toFixed(2);
  if (bouton) bouton.textContent = "HOLD TO START YOUR PITCH";
  ouvrirDialogueModal("recruit-minijeu", {
    dismissible: true,
    fermer: function() { echouerMiniJeuRecruit("closed"); },
    focusSelector: "#recruit-pitch-btn",
    returnFocusSelector: "#bouton-sequence"
  });
  const trustTrack = document.getElementById("recruit-trust-track");
  _recruitTrackWidth = trustTrack ? trustTrack.clientWidth : 0;
  mettreAJourMiniJeuRecruit();
}

function echouerMiniJeuRecruit(raison) {
  if (!_recruitMiniJeuActif) return;
  _recruitMiniJeuActif = false;
  definirPitchRecruitActif(false);
  arreterAnimationMiniJeuRecruit();
  fermerDialogueModal("recruit-minijeu");
  fermerSessionMiniJeu("recruit");
  const visage = assurerVisageProchainChat();
  demarrerRechargeCatch();
  ajouterLog("event", "Failed to recruit " + _recruitNom + ".");
  sauvegarder();
  rendu();
  ouvrirPopupRecruitResult(false, _recruitNom, visage);
}

function reussirMiniJeuRecruit() {
  if (!_recruitMiniJeuActif) return;
  _recruitMiniJeuActif = false;
  definirPitchRecruitActif(false);
  arreterAnimationMiniJeuRecruit();
  fermerDialogueModal("recruit-minijeu");
  fermerSessionMiniJeu("recruit");
  manualFocusStoryApresRecruit = etat.chatons === 3 && !storyEstVue("storyManualFocusVue");
  const resultat = terminerSequence();
  if (!resultat) {
    afficherNotification("Camp full. Build and connect housing before recruiting another Cat.");
    sauvegarder();
    rendu();
    return;
  }
  ouvrirPopupRecruitResult(true, resultat.nom, resultat.visage);
}

function ouvrirPopupRecruitResult(reussi, nom, visage) {
  const card = document.getElementById("recruit-result-card");
  const title = document.getElementById("recruit-result-title");
  const portrait = document.getElementById("recruit-result-portrait");
  const badge = document.getElementById("recruit-result-badge");
  const message = document.getElementById("recruit-result-message");
  if (card) card.classList.toggle("recruit-result-failed", !reussi);
  if (title) title.textContent = reussi ? "Recruitment successful!" : "Recruitment failed";
  if (portrait) {
    portrait.src = visage;
    portrait.alt = nom + " portrait";
  }
  if (badge) {
    badge.src = reussi ? "img/interface/✅_Final.png?v=0.0026" : "img/interface/Red Cross_Final.png?v=0.0029";
    badge.alt = reussi ? "Success" : "Failed";
  }
  if (message) message.textContent = reussi
    ? nom + " is convinced and agrees to join the Gang!"
    : nom + " wasn't convinced. Try again later.";
  ouvrirDialogueModal("recruit-result-popup", {
    focusSelector: "#recruit-result-action",
    returnFocusSelector: "#bouton-sequence"
  });
}

function fermerPopupRecruitResult() {
  fermerDialogueModal("recruit-result-popup");
  if (!manualFocusStoryApresRecruit || storyEstVue("storyManualFocusVue")) return;
  manualFocusStoryApresRecruit = false;
  marquerStoryVue("storyManualFocusVue");
  afficherModal("ecran-story-manual-focus");
  renduStories();
}

document.addEventListener("pointerup", function() { definirPitchRecruitActif(false); });
window.addEventListener("blur", function() { definirPitchRecruitActif(false); });
document.addEventListener("selectstart", function(event) {
  var target = event.target;
  if (target && target.closest && target.closest(".recruit-minijeu-carte")) event.preventDefault();
});

// ════════════════════════════════════════════════════════════
// 13d. BIRD MINI-GAME
// ════════════════════════════════════════════════════════════

var _birdTimerId        = null;
var _birdCursorPct      = 0;
var _birdDir            = 1;
var _birdMiniJeuPending = false;
const BIRD_PITY_REDUCTION_PER_FAIL = 0.05;
const BIRD_PITY_MAX_REDUCTION = 0.35;

function multiplicateurPityOiseau() {
  const echecs = Number.isInteger(etat.birdPityEchecs) ? Math.max(0, etat.birdPityEchecs) : 0;
  const reduction = Math.min(BIRD_PITY_MAX_REDUCTION, echecs * BIRD_PITY_REDUCTION_PER_FAIL);
  return 1 - reduction;
}

function arbreAccessibleCamp() {
  const arbre = itemCampPrototypeParType("tree");
  return Boolean(arbre && decorationAccessibleDepuisCamp(arbre));
}

function planifierOiseau() {
  if (!catheringDebloquee()) {
    if (_birdTimerId) clearTimeout(_birdTimerId);
    _birdTimerId = null;
    return;
  }
  if (_birdTimerId) clearTimeout(_birdTimerId);
  if (!arbreAccessibleCamp()) {
    _birdTimerId = setTimeout(planifierOiseau, 30000);
    return;
  }
  var premiere = !etat.birdPremiereReussie;
  var delai;
  if (premiere) {
    if (!Number.isFinite(etat.birdPremierSpawnTs) || etat.birdPremierSpawnTs <= 0) {
      etat.birdPremierSpawnTs = Date.now() + 5 * 60 * 1000;
      sauvegarder();
    }
    delai = Math.max(0, etat.birdPremierSpawnTs - Date.now());
  } else {
    delai = (Math.random() * 600 + 300) * 1000; // 5 à 15 min
  }
  _birdTimerId = setTimeout(montrerOiseau, delai);
}

function montrerOiseau() {
  if (!catheringDebloquee() || !arbreAccessibleCamp()) {
    planifierOiseau();
    return;
  }
  jouerSonAilesOiseau();
  var el = document.getElementById("bird-btn");
  if (el) el.style.display = "inline-flex";
  var dbg = document.getElementById("bird-debug-btn");
  if (dbg) dbg.style.display = "none";
}

function demarrerBirdMiniJeu() {
  if (!catheringDebloquee() || !arbreAccessibleCamp()) return;
  if (!ouvrirSessionMiniJeu("bird")) return;
  var premiere = !etat.birdPremiereReussie;
  var el = document.getElementById("bird-btn");
  if (el) el.style.display = "none";
  _birdCursorPct = 0;
  _birdDir = 1;
  ouvrirDialogueModal("bird-minijeu", {
    focusSelector: ".bird-catch-btn",
    returnFocusSelector: "#bird-btn"
  });
  var carte = document.querySelector('.bird-minijeu-carte');
  if (carte) {
    carte.classList.toggle('bird-premiere', premiere);
    carte.classList.remove('bird-facile');
  }
  var desc = document.getElementById("bird-minijeu-desc");
  if (desc) desc.textContent = premiere
    ? "Take your time. Click CATCH! when the cursor reaches the bird. You can try again if you miss."
    : "Click CATCH! when the cursor reaches the bird.";
  var pityEl = document.getElementById("bird-pity");
  var pityCount = Number.isInteger(etat.birdPityEchecs) ? Math.max(0, etat.birdPityEchecs) : 0;
  if (pityEl) {
    pityEl.hidden = premiere;
    if (!premiere) {
      var pityReduction = Math.round((1 - multiplicateurPityOiseau()) * 100);
      pityEl.textContent = pityCount + " fails : " + pityReduction + "% speed reduced";
    }
  }
  var speed = premiere ? 35 : 150 * multiplicateurPityOiseau();
  const cursor = document.getElementById("bird-cursor");
  const track = cursor ? cursor.closest(".bird-track") : null;
  let largeurPiste = track ? track.clientWidth : 0;
  positionnerCurseurMiniJeu(cursor, largeurPiste, _birdCursorPct);
  demarrerAnimationMiniJeu("bird", function(dt, frameInfo) {
    if (frameInfo.layoutChanged && track) largeurPiste = track.clientWidth;
    _birdCursorPct += _birdDir * speed * dt;
    if (_birdCursorPct >= 100) { _birdCursorPct = 100; _birdDir = -1; }
    if (_birdCursorPct <= 0)   { _birdCursorPct = 0;   _birdDir =  1; }
    positionnerCurseurMiniJeu(cursor, largeurPiste, _birdCursorPct);
    return true;
  });
}

function ouvrirBirdMiniJeu() {
  if (!catheringDebloquee() || !arbreAccessibleCamp()) {
    const birdBtn = document.getElementById("bird-btn");
    if (birdBtn) birdBtn.style.display = "none";
    planifierOiseau();
    return;
  }
  if (!storyEstVue("storyBirdVue")) {
    marquerStoryVue("storyBirdVue");
    var birdBtn = document.getElementById("bird-btn");
    if (birdBtn) birdBtn.style.display = "none";
    _birdMiniJeuPending = true;
    afficherModal("ecran-story-bird");
    renduStories();
    return;
  }
  demarrerBirdMiniJeu();
}

function _apresMinijeuOiseau() {
  var dbg = document.getElementById("bird-debug-btn");
  if (dbg) dbg.style.display = DEV_MODE ? "inline-flex" : "none";
  planifierOiseau();
}

function clickerBird() {
  var premiere = !etat.birdPremiereReussie;
  var success = premiere
    ? (_birdCursorPct >= 20 && _birdCursorPct <= 80)
    : (_birdCursorPct >= 45 && _birdCursorPct <= 55);
  if (premiere && !success) {
    var desc = document.getElementById("bird-minijeu-desc");
    if (desc) desc.textContent = "Almost! The first lesson is forgiving. Try CATCH! again when the cursor is closer.";
    return;
  }
  arreterAnimationMiniJeu("bird");
  fermerDialogueModal("bird-minijeu");
  fermerSessionMiniJeu("bird");
  if (success) {
    if (premiere) etat.birdPremiereReussie = true;
    etat.birdPityEchecs = 0;
    if (typeof enregistrerOiseauQuotidien === "function") enregistrerOiseauQuotidien();
    etat.workBoostFinTs = Date.now() + 60000;
    ajouterLog("event", "Bernardo caught a bird, boosting worker production x10 for 1 minute!");
    var successMessage = document.getElementById("bird-success-titre");
    if (successMessage) successMessage.textContent = premiere
      ? "Great catch! This mini-game boosts worker production for a short time. Other bird types may appear in the future, and it will be harder from now on."
      : "Well done, Bernardo! That graceful move has motivated the gang. They will work faster for a short time.";
    sauvegarder();
    renduRessources(unlocks());
    ouvrirDialogueModal("bird-success-popup", {
      focusSelector: ".bird-success-btn",
      returnFocusSelector: "#bouton-sequence"
    });
  } else {
    etat.birdPityEchecs = (Number.isInteger(etat.birdPityEchecs) ? etat.birdPityEchecs : 0) + 1;
    afficherNotification("The bird got away...");
    ajouterLog("event", "Bernardo missed the bird.");
    sauvegarder();
    _apresMinijeuOiseau();
  }
}

function fermerBirdSuccessPopup() {
  fermerDialogueModal("bird-success-popup");
  _apresMinijeuOiseau();
}

function skipBird() {
  if (!etat.birdPremiereReussie) return;
  arreterAnimationMiniJeu("bird");
  fermerDialogueModal("bird-minijeu");
  fermerSessionMiniJeu("bird");
  ajouterLog("event", "A bird flew past... and nobody noticed.");
  _apresMinijeuOiseau();
}

document.addEventListener("keydown", function(e) {
  if (e.key !== " " && e.key !== "Enter") return;
  var modal = document.getElementById("bird-minijeu");
  if (modal && modal.style.display !== "none") {
    if (e.target && e.target.closest && e.target.closest("button, input, select, textarea, [role=button]")) return;
    e.preventDefault();
    clickerBird();
  }
});

// ════════════════════════════════════════════════════════════
// 14. INITIALIZATION
// ════════════════════════════════════════════════════════════

initialiserRessourcesAccessibles();
const partieExistante = charger();
initialiserCampPrototype();
normaliserFormuleRecrutementCamp();
synchroniserDeblocagesSpherePerks();
const resumeAbsence    = partieExistante ? appliquerProgressionHorsLigne() : null;
const resumeAbsenceApresRechargement = recupererResumeAbsenceApresRechargement();
resumeAbsenceRechargeEffectue = !!resumeAbsenceApresRechargement;
rendu();
renduLogs();
renduStories();
renduObjectifs();
verifierObjectifs();
renduManagement();
if (campDebloque()) changerOnglet("camp");

function lancerOuvertureInitiale() {
  if (!storyEstVue("introVue")) {
    afficherModal("ecran-intro");
  } else if (etat.chatons < 3) {
    definirModePrologue(true);
    afficherCiblePrologue();
  } else if (etat.chatons === 3 && !storyEstVue("story3TransitionVue")) {
    definirModePrologue(true);
    afficherModal("ecran-story-3");
  } else {
    definirModePrologue(false);
  }
  verifierStoryModals();
  if (!storyEstVue("storyExploratorVue")) {
    const exploratorExistant = etat.kittiesData.findIndex(function(k) { return k.metier === "explorator"; });
    if (exploratorExistant >= 0) {
      preparerStoryExplorator(exploratorExistant);
      marquerStoryVue("storyExploratorVue");
      afficherModal("ecran-story-explorator");
      renduStories();
    }
  }
  if (resumeAbsence) afficherResumeAbsence(resumeAbsence);
  else if (resumeAbsenceApresRechargement) afficherResumeAbsence(resumeAbsenceApresRechargement, { apresRechargement: true });
  planifierOiseau();
}

if (redemarrageMajeurRequis) {
  ouvrirDialogueModal("save-upgrade-modal", { focusSelector: "#save-upgrade-restart" });
} else if (releaseNotesAffichablesAuDemarrage(partieExistante)) {
  afficherNotesVersion(lancerOuvertureInitiale);
} else {
  lancerOuvertureInitiale();
}

if (window.matchMedia("(max-width: 768px)").matches) {
  definirObjectifsReduits(true);
}

// Mobile browsers may suspend timers, put a page in the back/forward cache,
// or freeze it without running another game tick. Keep the last timestamp
// durable before suspension and run the catch-up on every reliable return
// signal. The guard makes visibility + pageshow/focus events harmless when
// they arrive together.
let rattrapageAfkEnCours = false;
let suspensionAfkConfirmee = false;

function rattraperProgressionAfk() {
  if (rattrapageAfkEnCours || sauvegardeVerrouillee || redemarrageMajeurRequis) return null;
  rattrapageAfkEnCours = true;
  try {
    const resume = appliquerProgressionHorsLigne();
    rendu();
    renduLogs();
    renduObjectifs();
    renduManagement();
    if (resume) afficherResumeAbsence(resume);
    return resume;
  } finally {
    rattrapageAfkEnCours = false;
  }
}

function sauvegarderAvantSuspension() {
  if (!sauvegardeVerrouillee && !redemarrageMajeurRequis) sauvegarder();
}

function marquerSuspensionAfk() {
  suspensionAfkConfirmee = true;
  sauvegarderAvantSuspension();
}

function rattraperApresSuspensionAfk() {
  if (
    !suspensionAfkConfirmee
    || rattrapageAfkEnCours
    || sauvegardeVerrouillee
    || redemarrageMajeurRequis
  ) return null;
  suspensionAfkConfirmee = false;
  return rattraperProgressionAfk();
}

document.addEventListener("visibilitychange", function() {
  if (document.visibilityState === "hidden") marquerSuspensionAfk();
  else if (document.visibilityState === "visible") rattraperApresSuspensionAfk();
});

// pageshow is essential for iOS Safari/Android Chrome when the page returns
// from bfcache without a normal reload or a second visibilitychange event.
window.addEventListener("pageshow", function() {
  if (document.visibilityState !== "hidden") rattraperApresSuspensionAfk();
});

// Some mobile browsers restore focus without dispatching pageshow. Focus alone
// is not an AFK signal: it may also follow a full-screen in-page overlay such
// as temporary Camp placement. Only a preceding hidden/pagehide/freeze event authorizes the
// catch-up, so visible gameplay always stays at full active speed.
window.addEventListener("focus", function() {
  if (document.visibilityState !== "hidden") rattraperApresSuspensionAfk();
});

// pagehide/freeze are the last persistence opportunities before a mobile tab
// is discarded or frozen, including cases where visibilitychange is skipped.
window.addEventListener("pagehide", marquerSuspensionAfk);
if (typeof document.addEventListener === "function") {
  document.addEventListener("freeze", marquerSuspensionAfk);
}

// Browsers block autoplay until the player interacts with the page. Start the
// loop on the first pointer or keyboard action, then keep its volume synced
// through Settings.
document.addEventListener("pointerdown", demarrerMusiqueAmbiante, { passive: true });
document.addEventListener("keydown", demarrerMusiqueAmbiante, { passive: true });
