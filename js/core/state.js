(function(root) {
  "use strict";

  const CatInc = root.CatInc = root.CatInc || {};

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
  return {
  // Resources
  chatons:              0,
  cardboardPieces:            0,  cardboardPiecesTotalRecolte: 0,
  basicWood:            0,  basicWoodTotalRecolte: 0,
  catnip:               0,  catnipTotalRecolte:    0,
  pebbles:              0,  pebblesTotalRecolte:   0,
  rocks:                0,  rocksTotalRecolte:     0,
  cardboardPlanks:      0,  cardboardPlanksTotalProduit: 0,
  basicWoodPlanks:      0,  basicWoodPlanksTotalProduit: 0,
  pebbleBricks:         0,
  rockBricks:           0,
  salads:               0,
  anchovy:              0,  anchovyTotalRecolte:  0,
  grilledAnchovy:       0,
  humanLeftovers:       0,
  humanWorkersFood:     0,
  cannedCatFood:        0,
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
  volumeMusique:           0,
  uiTheme:                 "basic",
  campCatPortraitScale:    1,
  hideCampCatIcons:          false,
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
  regionCourante:      "startingNeighbourhood",
  zonesExplorees:      ["D1"], // D1 (home) always starts explored
  exploZoneEnCours:    null,   // { zoneId, kittyIndices, startTs, duree }
  resultatsExplorationZones: {}, // { zoneId: { success, kittyIndices } }
  resultatsCampaigns:  {},     // { campaignId: { success, kittyIndices, recompenses[] } }
  scoutingsEnCours:    {},     // { scoutingId: { kittyIndex, startTs } }
  butinsScouting:      {},     // { scoutingId: { successful, failed, regular, lucky, superLucky, doubled, tripled, rewards } }
  managers:            { wood: null, food: null, sawmill: null, catchen: null, rock: null, pawsonry: null },
  managersDebloques:   false,
  managerRoleTutorialShown: false,
  objectifsComplis: [],
  logs:          [],
  storiesVues:  [],
  releaseNotesSeenVersion: "",
  ongletsVisites: ["gang", "logs"],
  learningEnCours: null,   // { itemId, kittyIndex, startTs, duree } in ms (Study or legacy direct learning)
  formationTermineeEnAttente: null, // { kittyIndex, metier, finishedTs } until the player validates the result
  formationIngenieurTermineeEnAttente: null, // { kittyIndex, metier, engineerRank, finishedTs } until validation

  // Last real-world timestamp the game state was saved (for offline progress)
    dernierTimestamp: Date.now()
  };
}

  function remplacerEtat(cible, nouvelEtat) {
    Object.keys(cible).forEach(function(cle) { delete cible[cle]; });
    Object.assign(cible, nouvelEtat);
    return cible;
  }

  CatInc.state = Object.freeze({
    makeWorkRecipeSlot: makeWorkRecipeSlot,
    makeWorkRecipeSlots: makeWorkRecipeSlots,
    makeCampState: makeCampState,
    creerEtatInitial: creerEtatInitial,
    remplacerEtat: remplacerEtat
  });
})(typeof window !== "undefined" ? window : globalThis);
