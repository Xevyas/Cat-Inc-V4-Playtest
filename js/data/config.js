(function(root) {
  "use strict";

  const CatInc = root.CatInc = root.CatInc || {};
  CatInc.data = CatInc.data || {};

const CONFIG = {
  combatTraining: {
    xpPerSecond: 1,
    xpPerLevel: 300, // XP to leave level n = 300 * n (initial calibration).
    beginnerMaxLevel: 5
  },
  hollowTreeCombat: {
    zoneId: "woodlandEntrance.hollowTree",
    rewardId: "hollowTreeLessons",
    advancedMaxLevel: 10,
    fighter: { baseHp: 20, hpPerLevel: 5, baseAttack: 2, defense: 0, attackSeconds: 2 },
    enemy: { name: "Woodland Rat", hp: 50, attack: 7, defense: 4, attackSeconds: 2.5,
      iconId: "other-woodland-rat", portraitPath: "img/Icons/woodland-rat.png" }
  },
  cathouse: {
    coutBase:            5,
    croissance:          3,
    reductionParSeconde: 1
  },
  realCathouse: {
    coutBase:            5,
    croissance:          3,
    reductionParSeconde: 5
  },
  stoneCathouse: {
    coutBasePlanks: 5,
    coutBaseBricks: 5,
    croissance:     1.7,
    speedBonus:     0.10
  },
  solidStoneCathouse: {
    coutBasePlanks: 10,
    coutBaseBricks: 5,
    croissance:     1.7,
    speedBonus:     0.40
  },
  woodcatting:      { secondesParUnite: 60 },
  basicWoodcatting: { secondesParUnite: 300 },
  grasscatting:     { secondesParUnite: 120 },
  pebblegathering: { deblocageA: 6,  secondesParUnite: 180 },
  rockgathering:   { secondesParUnite: 900 },
  rockFactory: {
    secondesParBrique: 4500,
    secondesParRock:   1200
  },
  sawmill: {
    deblocageA:           5,
    secondesParPlanche:   300,
    secondesParCardboard: 30
  },
  basicSawmill: {
    secondesParPlanche:   1500,
    secondesParBasicWood: 300
  },
  brickfactory: {
    deblocageA:        6,
    secondesParBrique: 900,
    secondesParPebble: 90
  },
  catchen: {
    deblocageA:        5,
    secondesParSalad:  600,
    secondesParCatnip: 60
  },
  fishcatting:     { secondesParUnite: 600 },
  grilledAnchovy: {
    secondesParRecette: 3000,
    secondesParAnchovy: 600
  },
  scoutings: CatInc.data.exploration.scoutings,
  campaigns: CatInc.data.exploration.campaigns
};

const VITESSES = [1, 2, 5, 10, 50, 100, 500, 1000];

  CatInc.data.config = Object.freeze({
    CONFIG: CONFIG,
    VITESSES: VITESSES
  });
})(typeof window !== "undefined" ? window : globalThis);
