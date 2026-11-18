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
  // Raw catch-time already consumed by the active cycle. The last update time
  // lets the browser integrate speed changes as segments instead of applying
  // a newly-built house to time that was consumed before it existed. The live
  // segment speed (`sequenceVitesseDerniere`) is runtime-only: it can include
  // DEV debug speed, so it is derived when absent and never saved.
  sequenceProgressBrute:    0,
  sequenceDerniereMajTs:   0,
  prochainVisageChaton:    null,
  randomCatFaceRotationUsedIds: [],
  clicCount:               0,
  reductionAuMomentDuClic: 0,
  afficherTempsAjusteRecrutement: false,
  avertirSurplusNourriture: true,
  volumeEffetsSonores:     0.3,
  volumeMusique:           0.3,
  campCatPortraitScale:    1,
  hideCampCatIcons:          false,
  campAnimationsEnabled:   true,
  showCampTierBadges:      true,
  // Resources hidden from the compact top rail. An empty list means every
  // unlocked resource is displayed by default.
  resourceBarHidden:       [],
  // Local presentation choices only. Camp Level, recruited Cat count and
  // Appeal stay derived from their gameplay authorities.
  campProfile:             { name: "My Camp", avatarCatFaceId: null },
  // Permanent first-reach Camp milestone. Current Camp Level remains derived
  // and may decrease independently of this monotonic reward authority.
  highestCampLevelReached: 0,

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
    forge: makeWorkRecipeSlots(2),
    metal: makeWorkRecipeSlots(2),
    leather: makeWorkRecipeSlots(2),
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
  equipmentStock: {}, // Unassigned crafted items; equipped items live on Cats.
  combatTraining:     null,   // { kittyIndex }; progress lives only on the Cat.
  hollowTreeEncounter: null, // Starting combat stats + elapsed seconds, including an unclaimed result.
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

(function(root) {
  "use strict";
  const CatInc = root.CatInc = root.CatInc || {};
  const slots = Object.freeze(["weapon", "protection"]);
  function definitions() { return CatInc.data.campGameplay.equipment || {}; }
  function definition(id) {
    return Object.prototype.hasOwnProperty.call(definitions(), id) ? definitions()[id] : null;
  }
  function stock(state, id) {
    const count = state && state.equipmentStock && state.equipmentStock[id];
    return Number.isSafeInteger(count) && count >= 0 ? count : 0;
  }
  function inputsAvailable(state, recipe) {
    return !!recipe && recipe.mode === "craft" && Array.isArray(recipe.inputs) && recipe.inputs.length > 0
      && recipe.inputs.every(function(input) {
        const resource = CatInc.resources.definition(input.resourceId);
        return resource && resource.storageMode === "camp-storage"
          && Number.isFinite(input.quantity) && input.quantity > 0
          && CatInc.resources.balance(state, input.resourceId) >= input.quantity;
      });
  }
  // The completion transaction owns both the debit and the one delivered item.
  // Resetting progress here also makes a repeated completion a no-op.
  function completeCraft(state, slot) {
    const recipe = slot && CatInc.data.campGameplay.workRecipes[slot.recipeId];
    const item = recipe && recipe.mode === "craft" && recipe.output && definition(recipe.output.equipmentId);
    if (!item || !state || !slot || !Number.isInteger(slot.kittyIndex)
        || !state.kittiesData[slot.kittyIndex] || slot.phase !== "processing"
        || !Number.isFinite(slot.phaseProgress) || slot.phaseProgress !== 1 || !inputsAvailable(state, recipe)
        || stock(state, recipe.output.equipmentId) >= Number.MAX_SAFE_INTEGER) return false;
    recipe.inputs.forEach(function(input) {
      CatInc.resources.debit(state, input.resourceId, input.quantity);
    });
    if (!state.equipmentStock) state.equipmentStock = {};
    state.equipmentStock[recipe.output.equipmentId] = stock(state, recipe.output.equipmentId) + 1;
    slot.phaseProgress = 0;
    return true;
  }
  function equip(state, kittyIndex, id) {
    const kitty = Number.isInteger(kittyIndex) && state.kittiesData[kittyIndex];
    const item = definition(id);
    if (!kitty || kitty.metier !== "fighter" || !item || stock(state, id) < 1
        || (CatInc.combat && CatInc.combat.occupies(state, kittyIndex))) return false;
    const held = kitty.equipment && kitty.equipment[item.slot];
    if (held === id || (held && (!definition(held) || definition(held).slot !== item.slot
        || stock(state, held) >= Number.MAX_SAFE_INTEGER))) return false;
    if (!kitty.equipment) kitty.equipment = {};
    state.equipmentStock[id] = stock(state, id) - 1;
    if (held) state.equipmentStock[held] = stock(state, held) + 1;
    kitty.equipment[item.slot] = id;
    return true;
  }
  function unequip(state, kittyIndex, slot) {
    const kitty = Number.isInteger(kittyIndex) && state.kittiesData[kittyIndex];
    const id = kitty && kitty.equipment && kitty.equipment[slot];
    if (!slots.includes(slot) || !definition(id) || stock(state, id) >= Number.MAX_SAFE_INTEGER
        || (CatInc.combat && CatInc.combat.occupies(state, kittyIndex))) return false;
    if (!state.equipmentStock) state.equipmentStock = {};
    state.equipmentStock[id] = stock(state, id) + 1;
    delete kitty.equipment[slot];
    return true;
  }
  function bonuses(kitty) {
    const result = {attack: 0, defense: 0};
    if (!kitty || kitty.metier !== "fighter") return result;
    slots.forEach(function(slot) {
      const item = definition(kitty.equipment && kitty.equipment[slot]);
      if (item && item.slot === slot) {
        result.attack += item.attack;
        result.defense += item.defense;
      }
    });
    return result;
  }
  CatInc.equipment = Object.freeze({slots, definitions, definition, stock, inputsAvailable, completeCraft, equip, unequip, bonuses});
})(typeof window !== "undefined" ? window : globalThis);

(function(root) {
  "use strict";
  const CatInc = root.CatInc = root.CatInc || {};
  function config() { return CatInc.data.config.CONFIG.hollowTreeCombat; }
  // Saves created before enemy snapshots keep their original encounter,
  // including a pending victory. New balance applies only to new attempts.
  const legacyEnemyStats = Object.freeze({hp:36, attack:7, defense:1, attackSeconds:2.5});
  function enemyStats() {
    const enemy = config().enemy;
    return {hp:enemy.hp, attack:enemy.attack, defense:enemy.defense, attackSeconds:enemy.attackSeconds};
  }
  const cached = new WeakMap();
  function learned(state) { return state.itemsAppris.includes(config().rewardId); }
  function trainingCap(state) {
    return learned(state) ? config().advancedMaxLevel : CatInc.data.config.CONFIG.combatTraining.beginnerMaxLevel;
  }
  function snapshot(state, kittyIndex) {
    const kitty = state.kittiesData[kittyIndex];
    const level = kitty.combatProgress.level;
    const equipment = CatInc.equipment.bonuses(kitty);
    return { kittyIndex: kittyIndex, jobId: kitty.metier,
      maxHp: config().fighter.baseHp + config().fighter.hpPerLevel * (level - 1),
      attack: config().fighter.baseAttack + level + equipment.attack
        + CatInc.perksV2.combatAttackBonus(state.perksV2, kitty.metier),
      defense: config().fighter.defense + equipment.defense,
      attackSeconds: config().fighter.attackSeconds,
      powerStrike: CatInc.perksV2.combatAttackMultiplier(state.perksV2, kitty.metier, 3) };
  }
  // Replay the small deterministic encounter from its immutable starting stats.
  // Only elapsed simulated seconds and explicit abandonment are saved: HP,
  // attack counts, occupation and the result are derived from the same attempt.
  function result(attempt) {
    if (!attempt) return null;
    const prior = cached.get(attempt);
    if (prior && prior.elapsed === attempt.elapsed && prior.abandoned === attempt.abandoned) return prior.value;
    const fighters = attempt.fighters.map(function(f) { return Object.assign({}, f, { hp: f.maxHp, attacks: 0 }); });
    const stats = attempt.enemyStats || legacyEnemyStats;
    const enemy = Object.assign({}, config().enemy, stats, { maxHp: stats.hp, attacks: 0 });
    // `events` lists every hit of the latest resolved instant, so simultaneous
    // attacks all stay visible; `last` remains the final one of them.
    let time = 0, outcome = "running", last = null, events = [];
    // Each successful hit does at least one damage. Even the minimum-strength
    // team resolves this first encounter well before the bounded save horizon.
    while (outcome === "running") {
      const alive = fighters.filter(function(f) { return f.hp > 0; });
      const next = Math.min(enemy.attackSeconds * (enemy.attacks + 1),
        ...alive.map(function(f) { return f.attackSeconds * (f.attacks + 1); }));
      if (next > attempt.elapsed + 1e-9) break;
      time = next;
      events = [];
      // Equal-time attacks resolve in stable team order, followed by the enemy.
      alive.forEach(function(f) {
        if (enemy.hp <= 0 || f.attackSeconds * (f.attacks + 1) > next + 1e-9) return;
        f.attacks++;
        const power = f.attacks % 3 === 0 ? f.powerStrike : 1;
        const damage = Math.max(1, Math.round(Math.max(1, f.attack - enemy.defense) * power));
        enemy.hp = Math.max(0, enemy.hp - damage);
        last = { at: time, source: f.kittyIndex, target: "enemy", damage: damage, power: power > 1 };
        events.push(last);
      });
      if (enemy.hp === 0) { outcome = "won"; break; }
      if (enemy.attackSeconds * (enemy.attacks + 1) <= next + 1e-9) {
        enemy.attacks++;
        const target = fighters.find(function(f) { return f.hp > 0; });
        const damage = Math.max(1, enemy.attack - target.defense);
        target.hp = Math.max(0, target.hp - damage);
        last = { at: time, source: "enemy", target: target.kittyIndex, damage: damage, power: false };
        events.push(last);
      }
      if (fighters.every(function(f) { return f.hp === 0; })) outcome = "lost";
    }
    if (outcome === "running" && attempt.abandoned === true) outcome = "abandoned";
    const value = { outcome: outcome, fighters: fighters, enemy: enemy, last: last, events: events,
      elapsed: outcome === "running" ? attempt.elapsed : time };
    cached.set(attempt, { elapsed: attempt.elapsed, abandoned: attempt.abandoned, value: value });
    return value;
  }
  function occupies(state, kittyIndex) {
    const attempt = state.hollowTreeEncounter;
    return !!(attempt && attempt.fighters.some(function(f) { return f.kittyIndex === kittyIndex; })
      && result(attempt).outcome === "running");
  }
  function advance(state, dt) {
    const attempt = state.hollowTreeEncounter;
    if (!attempt || !Number.isFinite(dt) || dt <= 0 || result(attempt).outcome !== "running") return false;
    attempt.elapsed = Math.min(3600, attempt.elapsed + dt);
    const resolved = result(attempt);
    if (resolved.outcome === "running") return false;
    attempt.elapsed = resolved.elapsed;
    return true;
  }
  function claim(state) {
    const resolved = result(state.hollowTreeEncounter);
    if (!resolved || resolved.outcome === "running") return false;
    if (resolved.outcome === "won" && !learned(state)) {
      if (!state.itemsAcquis.includes(config().rewardId)) state.itemsAcquis.push(config().rewardId);
      state.itemsAppris.push(config().rewardId);
    }
    state.hollowTreeEncounter = null;
    return true;
  }
  function validate(attempt, kitties) {
    if (attempt === undefined || attempt === null) return true;
    if (typeof attempt !== "object" || Array.isArray(attempt)
        || Object.keys(attempt).some(function(k) { return !["elapsed", "fighters", "abandoned", "enemyStats"].includes(k); })
        || !Number.isFinite(attempt.elapsed) || attempt.elapsed < 0 || attempt.elapsed > 3600
        || (attempt.abandoned !== undefined && attempt.abandoned !== true)
        || !Array.isArray(attempt.fighters) || !attempt.fighters.length) return false;
    const stats = attempt.enemyStats;
    if (stats !== undefined && (!stats || typeof stats !== "object" || Array.isArray(stats)
        || Object.keys(stats).length !== 4
        || !Number.isInteger(stats.hp) || stats.hp < 1 || stats.hp > 1000
        || !Number.isInteger(stats.attack) || stats.attack < 1 || stats.attack > 100000
        || !Number.isInteger(stats.defense) || stats.defense < 0 || stats.defense > 100000
        || !Number.isFinite(stats.attackSeconds) || stats.attackSeconds < .1 || stats.attackSeconds > 60)) return false;
    const combatJobs = Object.keys(CatInc.data.content.METIERS).filter(function(id) { return CatInc.data.content.METIERS[id].combat; });
    if (attempt.fighters.length > combatJobs.length) return false;
    const seenCats = new Set(), seenJobs = new Set();
    return attempt.fighters.every(function(f) {
      if (!f || typeof f !== "object" || Array.isArray(f)
          || Object.keys(f).length !== 7
          || !Number.isInteger(f.kittyIndex) || f.kittyIndex < 0 || !kitties[f.kittyIndex]
          || seenCats.has(f.kittyIndex) || !combatJobs.includes(f.jobId) || seenJobs.has(f.jobId)
          || !Number.isInteger(f.maxHp) || f.maxHp < 1 || f.maxHp > 100000
          || !Number.isInteger(f.attack) || f.attack < 1 || f.attack > 200000
          || !Number.isInteger(f.defense) || f.defense < 0 || f.defense > 100000
          || f.attackSeconds !== config().fighter.attackSeconds || ![1, 1.5].includes(f.powerStrike)) return false;
      seenCats.add(f.kittyIndex); seenJobs.add(f.jobId);
      return true;
    });
  }
  CatInc.combat = Object.freeze({ learned: learned, trainingCap: trainingCap, enemyStats: enemyStats,
    snapshot: snapshot, result: result, occupies: occupies, advance: advance, claim: claim, validate: validate });
})(typeof window !== "undefined" ? window : globalThis);
