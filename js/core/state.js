(function(root) {
  "use strict";

  const CatInc = root.CatInc = root.CatInc || {};

  function resourceCatalog() {
    return CatInc.data && CatInc.data.campGameplay
      && CatInc.data.campGameplay.resources || {};
  }

  function resourceDefinition(resourceId) {
    return Object.prototype.hasOwnProperty.call(resourceCatalog(), resourceId)
      ? resourceCatalog()[resourceId] : null;
  }

  function resourceDefinitions() {
    return Object.keys(resourceCatalog()).map(function(resourceId) {
      return Object.assign({id: resourceId}, resourceCatalog()[resourceId]);
    });
  }

  function globalResourceDefinitions() {
    return resourceDefinitions().filter(function(resource) {
      return resource.storageMode !== "recipe-slot";
    });
  }

  function feedableResourceDefinitions() {
    return globalResourceDefinitions().filter(function(resource) {
      return resource.family === "food" && resource.feedable === true
        && Number(resource.feedXp) > 0;
    });
  }

  function normalizeResourceBalances(source) {
    const state = source && typeof source === "object" ? source : {};
    const hasCanonicalMap = state.resources && typeof state.resources === "object"
      && !Array.isArray(state.resources);
    const balances = {};
    globalResourceDefinitions().forEach(function(resource) {
      const raw = hasCanonicalMap ? state.resources[resource.id] : state[resource.id];
      const amount = Number(raw);
      balances[resource.id] = Number.isFinite(amount) && amount >= 0 ? amount : 0;
    });
    return balances;
  }

  function resourceBalance(state, resourceId) {
    if (!resourceDefinition(resourceId) || !state || !state.resources) return 0;
    const amount = Number(state.resources[resourceId]);
    return Number.isFinite(amount) && amount >= 0 ? amount : 0;
  }

  function installLegacyResourceAccessors(state) {
    if (!state || typeof state !== "object") return state;
    state.resources = normalizeResourceBalances(state);
    globalResourceDefinitions().forEach(function(resource) {
      Object.defineProperty(state, resource.id, {
        configurable: true,
        enumerable: false,
        get: function() { return resourceBalance(state, resource.id); },
        set: function(value) {
          const amount = Number(value);
          state.resources[resource.id] = Number.isFinite(amount) && amount >= 0 ? amount : 0;
        }
      });
    });
    return state;
  }

  function grantResource(state, resourceId, amount, maximum) {
    const resource = resourceDefinition(resourceId);
    if (!resource || resource.storageMode === "recipe-slot") return 0;
    const qty = Number(amount);
    if (!Number.isFinite(qty) || qty <= 0) return 0;
    const before = resourceBalance(state, resourceId);
    const limit = Number.isFinite(maximum) ? Math.max(0, maximum) : Infinity;
    const after = Math.min(limit, before + qty);
    state.resources[resourceId] = after;
    return after - before;
  }

  function debitResource(state, resourceId, amount) {
    const qty = Number(amount);
    if (!Number.isFinite(qty) || qty <= 0) return false;
    const before = resourceBalance(state, resourceId);
    if (before < qty) return false;
    state.resources[resourceId] = before - qty;
    return true;
  }

  CatInc.resources = Object.freeze({
    definition: resourceDefinition,
    definitions: resourceDefinitions,
    globalDefinitions: globalResourceDefinitions,
    feedableDefinitions: feedableResourceDefinitions,
    normalizeBalances: normalizeResourceBalances,
    installLegacyAccessors: installLegacyResourceAccessors,
    balance: resourceBalance,
    grant: grantResource,
    debit: debitResource,
    isCampStorage: function(resourceId) {
      const resource = resourceDefinition(resourceId);
      return Boolean(resource && resource.storageMode === "camp-storage");
    },
    name: function(resourceId) { return resourceDefinition(resourceId)?.name || resourceId; },
    icon: function(resourceId) { return resourceDefinition(resourceId)?.iconPath || ""; },
    family: function(resourceId) { return resourceDefinition(resourceId)?.family || null; },
    tier: function(resourceId) { return resourceDefinition(resourceId)?.tier ?? null; },
    storageMode: function(resourceId) { return resourceDefinition(resourceId)?.storageMode || null; },
    feedXp: function(resourceId) { return Number(resourceDefinition(resourceId)?.feedXp) || 0; }
  });

function makeWorkRecipeSlot() {
  return {
    recipeId: null,
    kittyIndex: null,
    phase: "idle",
    phaseProgress: 0,
    outputCarry: 0,
    gatheredInputs: {},
    reservedInputs: {},
    birdCardboardPieces: 0
  };
}

function makeWorkRecipeSlots(n) {
  var slots = [];
  for (var i = 0; i < n; i++) slots.push(makeWorkRecipeSlot());
  return slots;
}

function makeCampState() {
  return {
    schemaVersion: 2,
    prototypeMigrationVersion: 0,
    recruitmentFormulaVersion: 0,
    layout: [],
    fences: [],
    terrain: null,
    demolitions: [],
    repairedBuildingIds: [],
    repairs: {},
    constructions: {},
    houseConstructions: {},
    housingAssignments: {},
    groundRewards: {},
    upgrades: {},
    // Stable gameplay identities. Placement is derived from camp.layout so a
    // unique item can never be both an inventory entry and a second object.
    uniqueItems: {},
    progression: {
      introCompleted: false,
      junkClearingUnlocked: false,
      operationsTableUnlocked: false,
      storageShedUnlocked: false,
      woodCathouseUnlocked: false,
      appealUnlocked: false,
      appealIntroSeen: false,
      appealRecruitConfirmationPending: false,
      workBoostCueDismissed: false,
      sawmillTutorialStage: "inactive",
      chefKissFeedTutorialStage: "inactive",
      firstBoxTutorialStage: "inactive",
      firstBoxUnlockDialogueDismissed: false,
      firstBoxRecruitConfirmationPending: false,
      firstBoxRecruitConfirmationAcknowledged: false,
      firstGroundRewardUid: null,
      quickDialogueQueue: [],
      quickDialoguesSeen: []
    }
  };
}

function creerEtatInitial() {
  const state = {
  // Resources
  chatons:              0,
  cardboardPieces:            0,  cardboardPiecesTotalRecolte: 0,
  basicWood:            0,  basicWoodTotalRecolte: 0,
  catnip:               0,  catnipTotalRecolte:    0,
  pebbles:              0,  pebblesTotalRecolte:   0,
  rocks:                0,  rocksTotalRecolte:     0,
  cardboardPlanksTotalProduit: 0,
  basicWoodPlanksTotalProduit: 0,
  anchovy:              0,  anchovyTotalRecolte:  0,
  resources:            {},
  cannelleTokens:       0,
  cannelleBargainNextAt: 0,
  cannelleBargainRulesSeen: false,
  boostInventory:       {},
  shortcutMapFinTs:     0,
  perksV2:              { version: 2, learned: [] },
  perkLearningEnCours:  null,   // { perkId, kittyIndex, jobId, startTs, duree, costs } in ms
  workBoostFinTs:       0,
  manualFocusOnboardingCompletedTs: 0,

  // Passive Catch/Recruit cooldown. false means the current cat is ready.
  sequenceEnCours:         false,
  sequenceDebutTs:         0,
  sequenceDuree:           0,
  // Raw catch-time already consumed by the active cycle. The last two fields
  // let the browser integrate speed changes as segments instead of applying
  // a newly-built house to time that was consumed before it existed.
  sequenceProgressBrute:    0,
  sequenceDerniereMajTs:   0,
  sequenceVitesseDerniere: 1,
  prochainVisageChaton:    null,
  clicCount:               0,
  reductionAuMomentDuClic: 0,
  afficherTempsAjusteRecrutement: false,
  avertirSurplusNourriture: true,
  volumeEffetsSonores:     0.3,
  volumeMusique:           0.3,
  campCatPortraitScale:    1,
  hideCampCatIcons:          false,
  campAnimationsEnabled:   true,
  // Resources hidden from the compact top rail. An empty list means every
  // unlocked resource is displayed by default.
  resourceBarHidden:       [],
  // Local presentation choices only. Camp Level, recruited Cat count and
  // Appeal stay derived from their gameplay authorities.
  campProfile:             { name: "My Camp", avatarCatFaceId: null },

  // Bird event progression. The first event is deliberately fixed at five
  // minutes; later events return to the normal random schedule.
  birdPremierSpawnTs:      Date.now() + 5 * 60 * 1000,
  birdPremierDeclenche:     false,
  birdPremiereReussie:     false,
  birdNextSpawnTs:          0,
  birdPityEchecs:           0,

  // First-production story state
  premiereSaladeFaite:        false,

  // Cathouse reduction accumulator (virtual seconds)
  reductionCumulee: 0,

  // Two recipe slots per family replace the former independent workers.
  workRecipeSlots: {
    wood: makeWorkRecipeSlots(2),
    food: makeWorkRecipeSlots(2),
    rock: makeWorkRecipeSlots(2)
  },

  // Authoritative Camp state. Spatial state and functional jobs travel with
  // the normal V4 save; reachability and capabilities are always derived.
  camp: makeCampState(),

  cathouses:          [],
  cathouseCount:      0,
  stoneCathouseCount: 0,
  solidStoneCathouseCount: 0,
  kittiesData:   [],   // { nom, metier, niveau, tier, catchTs }
  exploEnCours:        [],   // [{ id, kittyIndices, startTs, duree }]
  campaignsCompletees: [],
  itemsAcquis:         [],
  itemsAppris:         [],
  itemsEtudies:        [],
  jobCenterDebloque:        false,
  jobCenterConstruit:       false,
  laboratoryDebloque:       false,
  laboratoryConstruit:      false,
  engineerRankUpgradesDebloques: false,
  formationEnCours:    null,   // { kittyIndex, metier, startTs, duree }
  formationIngenieurEnCours: null, // { kittyIndex, metier, startTs, duree }
  // Daily quests unlocked by learning The Daily Purpose. The date key is
  // calculated in Europe/Paris so a new set starts at Paris midnight.
  dailyQuests: {
    dateKey: "",
    recipeFamily: "food",
    scoutingSuccesses: 0,
    catLevelUps: 0,
    birdCaught: false,
    recipesCompleted: 0,
    rewardClaimed: false
  },
  // Scouting Canned Cat Food stocks reset at Paris midnight independently
  // from the Daily Purpose book and its Daily Quests.
  dailyScoutingStocks: {
    dateKey: "",
    remaining: {
      raidSupermarketAgain: 3,
      stealGasStationAgain: 2
    }
  },
  // Naya's Inn shares the canonical Paris calendar day with Daily Purpose.
  // Generated identities and consumption flags are durable; balances and
  // mission state remain in their existing authorities.
  innDaily: {
    version: 2,
    dateKey: "",
    travelers: [],
    contracts: []
  },
  regionCourante:      "startingNeighbourhood",
  zonesExplorees:      ["D1"], // D1 (home) always starts explored
  exploZoneEnCours:    null,   // { zoneId, kittyIndices, startTs, duree }
  resultatsExplorationZones: {}, // { zoneId: { success, kittyIndices } }
  resultatsCampaigns:  {},     // { campaignId: { success, kittyIndices, recompenses[] } }
  explorationRetries: { zones: {}, campaigns: {} }, // Capped failure counts by canonical activity ID.
  scoutingsEnCours:    {},     // { scoutingId: { kittyIndex, startTs } }
  butinsScouting:      {},     // { scoutingId: { successful, failed, regular, lucky, superLucky, doubled, tripled, rewards } }
  explorationNouveautesNonVues: [], // Sparse "zone:<id>" / "scouting:<id>" acknowledgements only.
  managers:            { wood: null, food: null, sawmill: null, catchen: null, rock: null, pawsonry: null },
  managersDebloques:   false,
  managerRoleTutorialShown: false,
  objectifsComplis: [],
  logs:          [],
  storiesVues:  [],
  storySeenOrder: [],
  releaseNotesSeenVersion: "",
  ongletsVisites: ["gang", "logs"],
  learningEnCours: null,   // { itemId, kittyIndex, startTs, duree } in ms (Study or legacy direct learning)
  formationTermineeEnAttente: null, // { kittyIndex, metier, finishedTs } until the player validates the result
  formationIngenieurTermineeEnAttente: null, // { kittyIndex, metier, engineerRank, finishedTs } until validation

  // Last real-world timestamp the game state was saved (for offline progress)
    dernierTimestamp: Date.now()
  };
  return CatInc.resources ? CatInc.resources.installLegacyAccessors(state) : state;
}

  function remplacerEtat(cible, nouvelEtat) {
    Object.keys(cible).forEach(function(cle) { delete cible[cle]; });
    Object.assign(cible, nouvelEtat);
    return CatInc.resources ? CatInc.resources.installLegacyAccessors(cible) : cible;
  }

  CatInc.state = Object.freeze({
    makeWorkRecipeSlot: makeWorkRecipeSlot,
    makeWorkRecipeSlots: makeWorkRecipeSlots,
    makeCampState: makeCampState,
    creerEtatInitial: creerEtatInitial,
    remplacerEtat: remplacerEtat
  });
})(typeof window !== "undefined" ? window : globalThis);
