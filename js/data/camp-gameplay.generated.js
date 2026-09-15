(function(root) {
  "use strict";
  const CatInc = root.CatInc = root.CatInc || {};
  CatInc.data = CatInc.data || {};
  function deepFreeze(value) {
    if (!value || typeof value !== "object" || Object.isFrozen(value)) return value;
    Object.keys(value).forEach(function(key) { deepFreeze(value[key]); });
    return Object.freeze(value);
  }
  CatInc.data.campGameplay = deepFreeze({
  "schemaVersion": 1,
  "storageRules": {
    "baseCapacity": 5,
    "resourceIds": [
      "cardboardPieces",
      "basicWood",
      "catnip",
      "pebbles",
      "rocks",
      "cardboardPlanks",
      "basicWoodPlanks",
      "pebbleBricks",
      "rockBricks",
      "salads",
      "anchovy",
      "grilledAnchovy",
      "humanLeftovers",
      "humanWorkersFood"
    ]
  },
  "campLevelRules": {
    "baseXp": 3,
    "growth": 1.5,
    "appealPerLevel": 1
  },
  "generalRules": {
    "catLeveling": {
      "xpGrowthExponent": 2.1
    },
    "recruitment": {
      "authoredBaseSeconds": {
        "3": 60,
        "4": 120
      },
      "curveBaseSeconds": 5,
      "earlyMaxCats": 10,
      "earlyGrowth": 2.5,
      "middleMaxCats": 15,
      "middleGrowth": 2,
      "lateGrowth": 1.7,
      "appealSpeedPerPoint": 1.1
    },
    "afk": {
      "minimumAbsenceSeconds": 60,
      "baseRatio": 0.2,
      "baseMaxSeconds": 14400,
      "engineerRank1CapMinutesPerLevel": 6,
      "engineerRank2RatioPercentPerLevel": 0.5,
      "maxRatio": 1
    }
  },
  "purrsuasion": {
    "rounds": 3,
    "scores": {
      "gold": 3,
      "silver": 2,
      "bronze": 1,
      "miss": 0
    },
    "profiles": [
      {
        "cat": 4,
        "required": 3,
        "answerSeconds": 30,
        "targetSize": 54,
        "speed": 55
      },
      {
        "cat": 5,
        "required": 3,
        "answerSeconds": 27,
        "targetSize": 54,
        "speed": 55
      },
      {
        "cat": 6,
        "required": 3,
        "answerSeconds": 27,
        "targetSize": 51,
        "speed": 55
      },
      {
        "cat": 7,
        "required": 3,
        "answerSeconds": 27,
        "targetSize": 51,
        "speed": 60
      },
      {
        "cat": 8,
        "required": 4,
        "answerSeconds": 27,
        "targetSize": 51,
        "speed": 60
      },
      {
        "cat": 9,
        "required": 4,
        "answerSeconds": 24,
        "targetSize": 51,
        "speed": 60
      },
      {
        "cat": 10,
        "required": 4,
        "answerSeconds": 24,
        "targetSize": 48,
        "speed": 60
      },
      {
        "cat": 11,
        "required": 4,
        "answerSeconds": 24,
        "targetSize": 48,
        "speed": 65
      },
      {
        "cat": 12,
        "required": 4,
        "answerSeconds": 21,
        "targetSize": 48,
        "speed": 65
      },
      {
        "cat": 13,
        "required": 4,
        "answerSeconds": 21,
        "targetSize": 45,
        "speed": 65
      },
      {
        "cat": 14,
        "required": 4,
        "answerSeconds": 21,
        "targetSize": 45,
        "speed": 70
      },
      {
        "cat": 15,
        "required": 5,
        "answerSeconds": 21,
        "targetSize": 45,
        "speed": 70
      },
      {
        "cat": 16,
        "required": 5,
        "answerSeconds": 18,
        "targetSize": 45,
        "speed": 70
      },
      {
        "cat": 17,
        "required": 5,
        "answerSeconds": 18,
        "targetSize": 42,
        "speed": 70
      },
      {
        "cat": 18,
        "required": 5,
        "answerSeconds": 18,
        "targetSize": 42,
        "speed": 75
      },
      {
        "cat": 19,
        "required": 5,
        "answerSeconds": 15,
        "targetSize": 42,
        "speed": 75
      },
      {
        "cat": 20,
        "required": 5,
        "answerSeconds": 15,
        "targetSize": 39,
        "speed": 75
      }
    ]
  },
  "cannelleBargain": {
    "offersPerRound": 3,
    "rounds": 5,
    "scores": {
      "correct": 1,
      "fastestCorrectBonus": 1,
      "wrongOrTimeout": 0
    },
    "unlockLevelStep": 10,
    "rewardPerDifficulty": 1,
    "roundSeconds": 7,
    "cooldownHours": 3,
    "difficulties": [
      {
        "difficulty": 1,
        "minDelaySeconds": 4,
        "maxDelaySeconds": 6,
        "accuracyPercent": 60,
        "minGapPercent": 30
      },
      {
        "difficulty": 2,
        "minDelaySeconds": 3,
        "maxDelaySeconds": 5,
        "accuracyPercent": 70,
        "minGapPercent": 22
      },
      {
        "difficulty": 3,
        "minDelaySeconds": 4,
        "maxDelaySeconds": 4,
        "accuracyPercent": 78,
        "minGapPercent": 16
      },
      {
        "difficulty": 4,
        "minDelaySeconds": 2.5,
        "maxDelaySeconds": 3.5,
        "accuracyPercent": 85,
        "minGapPercent": 11
      },
      {
        "difficulty": 5,
        "minDelaySeconds": 2,
        "maxDelaySeconds": 3,
        "accuracyPercent": 90,
        "minGapPercent": 7.5
      }
    ],
    "laterDifficulty": {
      "minDelayStepSeconds": 0.09,
      "minDelayFloorSeconds": 0.7,
      "maxDelayStepSeconds": 0.1,
      "maxDelayFloorSeconds": 1.1,
      "accuracyStepPercent": 1.5,
      "accuracyCeilingPercent": 96,
      "minGapStepPercent": 0.6,
      "minGapFloorPercent": 4
    }
  },
  "nayaInn": {
    "stateVersion": 2,
    "rarityWeights": {
      "common": 50,
      "rare": 30,
      "epic": 15,
      "legendary": 5
    },
    "contracts": {
      "common": {
        "inputAmount": 4,
        "outputAmount": 4
      },
      "rare": {
        "inputAmount": 5,
        "outputAmount": 8
      },
      "epic": {
        "inputAmount": 6,
        "outputAmount": 12
      },
      "legendary": {
        "inputAmount": 12,
        "outputAmount": 1
      }
    },
    "travelers": {
      "helperPower": {
        "common": 10,
        "rare": 15,
        "epic": 20,
        "legendary": 25
      },
      "guideReductionPercent": {
        "common": 15,
        "rare": 25,
        "epic": 35,
        "legendary": 50
      }
    }
  },
  "bookLearning": {
    "schoolGuide": {
      "name": "School Guide",
      "description": "A human guide to a few job orientations for kids. We may learn something from it.",
      "unlocksLabel": "Explorator, Lumberjack, Carpenter, Farmer and Chef jobs",
      "learningGame": {
        "phraseParts": [
          "You can ",
          " to be anything: a brave ",
          ", a skilled ",
          ", or even a great ",
          "!"
        ],
        "answers": [
          "learn",
          "explorer",
          "builder",
          "chef"
        ]
      }
    },
    "fishingGuide": {
      "name": "Fishing Guide for Dummies",
      "description": "A complete beginner's guide to feline fishing. Spoiler: you don't need a rod.",
      "unlocksLabel": "Anchovy fishing and Grilled Anchovy",
      "learningGame": {
        "phraseParts": [
          "A patient ",
          " watches the ",
          ", catches an ",
          ", then grills it in the ",
          "!"
        ],
        "answers": [
          "fisher",
          "water",
          "anchovy",
          "Catchen"
        ]
      }
    },
    "constructionPlan": {
      "name": "Construction Plan",
      "description": "Blueprints for renovating the house. Someone's been busy.",
      "unlocksLabel": "Wood Builder job",
      "learningGame": {
        "phraseParts": [
          "Every sturdy ",
          " begins with a careful ",
          ": measure the ",
          ", then let the ",
          " start working!"
        ],
        "answers": [
          "house",
          "plan",
          "planks",
          "builder"
        ]
      }
    },
    "seminarGuide": {
      "name": "Corporate Seminar Booklet",
      "description": "A booklet about professional training seminars. Participants walk out with new skills and sharper instincts for their trade.",
      "unlocksLabel": "Training Center",
      "learningGame": {
        "phraseParts": [
          "An effective seminar aligns our ",
          ", unlocks collective ",
          ", fosters meaningful ",
          ", strengthens team ",
          ", accelerates sustainable ",
          ", and transforms every challenge into an ",
          "!"
        ],
        "answers": [
          "values",
          "potential",
          "collaboration",
          "synergy",
          "growth",
          "opportunity"
        ]
      }
    },
    "dailyPurpose": {
      "name": "The Daily Purpose",
      "description": "A human self-help book about building a daily routine and becoming the best version of yourself. The kind of advice that sounds profound before breakfast.",
      "unlocksLabel": "Daily Quests",
      "learningGame": {
        "phraseParts": [
          "Rise with ",
          ", honor your ",
          ", and unlock the ",
          " ",
          " of ",
          ", one tiny ",
          " at a time!"
        ],
        "answers": [
          "purpose",
          "routine",
          "best",
          "version",
          "yourself",
          "step"
        ]
      }
    },
    "engineerGuide": {
      "name": "The Engineer's Path",
      "description": "A human engineering guide pointing toward a new generation of recipes and specialists.",
      "unlocksLabel": "Laboratory",
      "learningGame": {
        "phraseParts": [
          "An engineer turns a ",
          " into a ",
          ", tests the ",
          ", learns from each ",
          ", and improves the final ",
          " for ",
          "."
        ],
        "answers": [
          "problem",
          "design",
          "prototype",
          "failure",
          "solution",
          "everyone"
        ]
      }
    },
    "teamworkGuide": {
      "name": "The Teamwork Advantage",
      "description": "A human teamwork guide about combining different minds to uncover perspectives and solutions no one could find alone.",
      "unlocksLabel": "Engineer rank upgrades",
      "learningGame": {
        "phraseParts": [
          "Bring different ",
          " together around one ",
          ", and their varied ",
          " can reveal ",
          " solutions that no single ",
          " could ",
          " alone."
        ],
        "answers": [
          "minds",
          "challenge",
          "perspectives",
          "unexpected",
          "person",
          "find"
        ]
      }
    },
    "sturdyHousePlans": {
      "name": "Sturdy House Plans",
      "description": "Detailed human blueprints for a compact stone house, with strict instructions on foundations, load-bearing walls, and structural stability. Excessively serious, but apparently very good at keeping a roof where it belongs.",
      "unlocksLabel": "Stone Storage Shed",
      "learningGame": {
        "phraseParts": [
          "A durable stone house depends on firm ",
          ", carefully fitted ",
          ", reinforced ",
          ", evenly distributed ",
          ", reliable ",
          ", and a properly supported ",
          "."
        ],
        "answers": [
          "foundations",
          "blocks",
          "walls",
          "loads",
          "drainage",
          "roof"
        ]
      }
    },
    "stoneGuide": {
      "name": "Stone Craft Guide",
      "description": "A human guide to mining and stone masonry. Heavy reading, heavy lifting.",
      "unlocksLabel": "Miner and Stonemason jobs",
      "learningGame": {
        "phraseParts": [
          "A skilled ",
          " breaks through ",
          " like butter, while a careful ",
          " shapes them into solid ",
          "!"
        ],
        "answers": [
          "miner",
          "rocks",
          "stonemason",
          "bricks"
        ]
      }
    }
  },
  "uniqueItems": {
    "old-radio-gift": {
      "name": "Old radio",
      "assetId": "old-radio",
      "runtimeTypeId": "oldRadio",
      "grant": {
        "kind": "story-seen",
        "flag": "storyMarketStallCompleteVue"
      }
    }
  },
  "definitions": {
    "cardboardBox": {
      "assetId": "cardboard-box",
      "name": "Cardboard Box",
      "category": "house",
      "repeatable": true,
      "footprint": {
        "width": 1,
        "height": 1
      },
      "unlock": {
        "kind": "runtime-rule",
        "id": "buildingsUnlocked"
      },
      "effects": {
        "housingCapacity": 1,
        "campXp": 1
      },
      "upgradeTiers": {
        "2": {
          "durationSeconds": 1800,
          "costs": {
            "cardboardPlanks": 5
          },
          "effects": {
            "housingCapacity": 1,
            "appeal": 1,
            "campXp": 2
          },
          "unlock": {
            "kind": "runtime-rule",
            "id": "appealUnlocked"
          },
          "costGrowth": 1.7,
          "durationGrowth": 1.4
        },
        "3": {
          "durationSeconds": 14400,
          "costs": {
            "cardboardPlanks": 100
          },
          "effects": {
            "housingCapacity": 2,
            "appeal": 3,
            "campXp": 5
          },
          "unlock": {
            "kind": "perk-tier-unlock",
            "targetTypeId": "cardboardBox",
            "targetTier": 3
          },
          "maxInstancesAtTier": 1,
          "visualFallbackTier": 2,
          "costGrowth": 1,
          "durationGrowth": 1
        }
      },
      "simulation": {
        "ranks": 12
      },
      "build": {
        "entryMode": "build",
        "durationSeconds": 300
      },
      "law": {
        "family": "cardboard-box",
        "baseCosts": {
          "cardboardPlanks": 1
        },
        "growth": 1.7,
        "authoredRanks": {
          "1": {
            "cardboardPlanks": 1
          },
          "2": {
            "cardboardPlanks": 2
          }
        },
        "rounding": "ceil",
        "refundRate": 0.5,
        "durationGrowth": 1.4
      }
    },
    "storage": {
      "assetId": "small-storage-shed",
      "name": "Small Storage Shed",
      "category": "building",
      "repeatable": true,
      "footprint": {
        "width": 1,
        "height": 1
      },
      "unlock": {
        "kind": "resource-cap-reached",
        "scope": "regular-storage"
      },
      "effects": {
        "storageCapacity": 10,
        "campXp": 1
      },
      "upgradeTiers": {
        "2": {
          "durationSeconds": 3600,
          "costs": {
            "cardboardPlanks": 5,
            "pebbleBricks": 1
          },
          "effects": {
            "storageCapacity": 15,
            "appeal": 0.5,
            "campXp": 2
          },
          "unlock": {
            "kind": "runtime-rule",
            "id": "appealUnlocked"
          },
          "costGrowth": 1.5,
          "durationGrowth": 1.4
        }
      },
      "simulation": {
        "ranks": 20,
        "upgradeTierAvailableFromRank": 7
      },
      "build": {
        "entryMode": "build",
        "durationSeconds": 900
      },
      "law": {
        "family": "small-storage-shed",
        "baseCosts": {
          "cardboardPlanks": 3
        },
        "growth": 1.7,
        "authoredRanks": {
          "1": {
            "cardboardPlanks": 3
          }
        },
        "rounding": "ceil",
        "refundRate": 0.5,
        "durationGrowth": 1.4
      }
    },
    "operationsTable": {
      "assetId": "operation-table",
      "name": "Operation Table",
      "category": "building",
      "repeatable": false,
      "footprint": {
        "width": 2,
        "height": 1
      },
      "unlock": {
        "kind": "runtime-rule",
        "id": "operationsTableUnlocked"
      },
      "effects": {},
      "upgradeTiers": {},
      "simulation": {},
      "build": {
        "entryMode": "repair",
        "durationSeconds": 1800,
        "costs": {
          "cardboardPlanks": 5
        }
      }
    },
    "jobCenter": {
      "assetId": "job-center",
      "name": "Job Center",
      "category": "building",
      "repeatable": false,
      "footprint": {
        "width": 2,
        "height": 2
      },
      "unlock": {
        "kind": "runtime-rule",
        "id": "jobCenterUnlocked"
      },
      "effects": {},
      "upgradeTiers": {
        "2": {
          "durationSeconds": 1800,
          "costs": {
            "rockBricks": 10,
            "basicWoodPlanks": 20
          },
          "effects": {},
          "unlock": {
            "kind": "runtime-rule",
            "id": "seminarGuideLearned"
          }
        }
      },
      "simulation": {},
      "build": {
        "entryMode": "build",
        "durationSeconds": 600,
        "costs": {
          "pebbleBricks": 10,
          "basicWoodPlanks": 2
        }
      }
    },
    "laboratory": {
      "assetId": "laboratory",
      "name": "Laboratory",
      "category": "building",
      "repeatable": false,
      "footprint": {
        "width": 3,
        "height": 1
      },
      "unlock": {
        "kind": "runtime-rule",
        "id": "laboratoryUnlocked"
      },
      "effects": {},
      "upgradeTiers": {},
      "simulation": {},
      "build": {
        "entryMode": "build",
        "durationSeconds": 3600,
        "costs": {
          "rockBricks": 100,
          "basicWoodPlanks": 100
        }
      }
    },
    "sawmill": {
      "assetId": "sawmill",
      "name": "Sawmill",
      "category": "production-building",
      "repeatable": false,
      "footprint": {
        "width": 2,
        "height": 1
      },
      "unlock": {
        "kind": "runtime-rule",
        "id": "sawmillTier2Available"
      },
      "effects": {},
      "upgradeTiers": {
        "2": {
          "durationSeconds": 900,
          "costs": {
            "cardboardPlanks": 5,
            "pebbleBricks": 2
          },
          "effects": {}
        }
      },
      "simulation": {}
    },
    "catchen": {
      "assetId": "catchen",
      "name": "Catchen",
      "category": "production-building",
      "repeatable": false,
      "footprint": {
        "width": 2,
        "height": 1
      },
      "unlock": {
        "kind": "runtime-rule",
        "id": "catchenTier2Available"
      },
      "effects": {},
      "upgradeTiers": {
        "2": {
          "durationSeconds": 1800,
          "costs": {
            "basicWoodPlanks": 5,
            "pebbleBricks": 5
          },
          "effects": {}
        }
      },
      "simulation": {}
    },
    "pawsonry": {
      "assetId": "pawsonry",
      "name": "Pawsonry",
      "category": "production-building",
      "repeatable": false,
      "footprint": {
        "width": 2,
        "height": 2
      },
      "unlock": {
        "kind": "runtime-rule",
        "id": "pawsonryTier2Available"
      },
      "effects": {},
      "upgradeTiers": {
        "2": {
          "durationSeconds": 2700,
          "costs": {
            "basicWoodPlanks": 10,
            "pebbleBricks": 10
          },
          "effects": {}
        }
      },
      "simulation": {}
    },
    "marketStall": {
      "assetId": "market-stall",
      "name": "Market Stall",
      "category": "building",
      "repeatable": false,
      "footprint": {
        "width": 2,
        "height": 2
      },
      "unlock": {
        "kind": "runtime-rule",
        "id": "cannelleRecruitStoryComplete"
      },
      "effects": {
        "campXp": 10,
        "appeal": 3
      },
      "upgradeTiers": {},
      "simulation": {},
      "build": {
        "entryMode": "build",
        "durationSeconds": 3600,
        "costs": {
          "cardboardPlanks": 20
        }
      }
    },
    "smallFountain": {
      "assetId": "small-fountain",
      "name": "Small fountain",
      "category": "decoration",
      "repeatable": true,
      "footprint": {
        "width": 1,
        "height": 1
      },
      "unlock": {
        "kind": "runtime-rule",
        "id": "smallFountainBlueprintLearned"
      },
      "effects": {
        "appeal": 1
      },
      "upgradeTiers": {},
      "simulation": {
        "ranks": 12
      },
      "build": {
        "entryMode": "build",
        "durationSeconds": 1800
      },
      "law": {
        "family": "small-fountain",
        "baseCosts": {
          "pebbleBricks": 5
        },
        "growth": 10,
        "authoredRanks": {
          "1": {
            "pebbleBricks": 5
          }
        },
        "rounding": "ceil",
        "refundRate": 0.5,
        "durationGrowth": 5
      }
    },
    "cardboardLitterbox": {
      "assetId": "cardboard-litterbox",
      "name": "Cardboard Litterbox",
      "category": "decoration",
      "repeatable": true,
      "footprint": {
        "width": 1,
        "height": 1
      },
      "unlock": {
        "kind": "runtime-rule",
        "id": "cardboardLitterboxBlueprintLearned"
      },
      "effects": {
        "campXp": 8
      },
      "upgradeTiers": {},
      "simulation": {
        "ranks": 12
      },
      "build": {
        "entryMode": "build",
        "durationSeconds": 3600
      },
      "law": {
        "family": "cardboard-litterbox",
        "baseCosts": {
          "cardboardPlanks": 5
        },
        "growth": 10,
        "authoredRanks": {
          "1": {
            "cardboardPlanks": 5
          }
        },
        "rounding": "ceil",
        "refundRate": 0.5,
        "durationGrowth": 5
      }
    },
    "woodCathouse": {
      "assetId": "wood-cathouse",
      "name": "Wood Cathouse",
      "category": "house",
      "repeatable": true,
      "footprint": {
        "width": 1,
        "height": 1
      },
      "unlock": {
        "kind": "runtime-rule",
        "id": "woodCathouseUnlocked"
      },
      "effects": {
        "housingCapacity": 1,
        "residentLevelBonusMultiplier": 1.05,
        "campXp": 2
      },
      "upgradeTiers": {
        "2": {
          "durationSeconds": 3600,
          "costs": {
            "basicWoodPlanks": 8
          },
          "effects": {
            "residentLevelBonusMultiplier": 1.05,
            "housingCapacity": 1,
            "appeal": 1,
            "campXp": 3
          },
          "unlock": {
            "kind": "runtime-rule",
            "id": "appealUnlocked"
          },
          "costGrowth": 1.7,
          "durationGrowth": 1.4
        },
        "3": {
          "durationSeconds": 21600,
          "costs": {
            "basicWoodPlanks": 100
          },
          "effects": {
            "housingCapacity": 2,
            "appeal": 5,
            "residentLevelBonusMultiplier": 1.15,
            "campXp": 7
          },
          "unlock": {
            "kind": "perk-tier-unlock",
            "targetTypeId": "woodCathouse",
            "targetTier": 3
          },
          "maxInstancesAtTier": 1,
          "visualFallbackTier": 2,
          "costGrowth": 1,
          "durationGrowth": 1
        }
      },
      "simulation": {
        "ranks": 12
      },
      "build": {
        "entryMode": "build",
        "durationSeconds": 1800
      },
      "law": {
        "family": "wood-cathouse",
        "baseCosts": {
          "basicWoodPlanks": 2
        },
        "growth": 1.7,
        "authoredRanks": {
          "1": {
            "basicWoodPlanks": 2
          }
        },
        "rounding": "ceil",
        "refundRate": 0.5,
        "durationGrowth": 1.4
      }
    },
    "lanternOnPole": {
      "assetId": "lantern-on-pole",
      "name": "Lantern on pole",
      "category": "decoration",
      "repeatable": true,
      "footprint": {
        "width": 1,
        "height": 1
      },
      "unlock": {
        "kind": "not-wired"
      },
      "effects": {
        "appeal": 1.5
      },
      "upgradeTiers": {},
      "simulation": {
        "ranks": 12
      },
      "build": {
        "entryMode": "build",
        "durationSeconds": 3600
      },
      "law": {
        "family": "lantern-on-pole",
        "baseCosts": {
          "basicWoodPlanks": 10
        },
        "growth": 1.7,
        "authoredRanks": {
          "1": {
            "basicWoodPlanks": 10
          }
        },
        "rounding": "ceil",
        "refundRate": 0.5,
        "durationGrowth": 1.4
      }
    },
    "stoneStorageShed": {
      "assetId": "stone-storage-shed",
      "name": "Stone Storage Shed",
      "category": "building",
      "repeatable": true,
      "footprint": {
        "width": 1,
        "height": 1
      },
      "unlock": {
        "kind": "runtime-rule",
        "id": "sturdyHousePlansLearned"
      },
      "effects": {
        "storageCapacity": 20,
        "campXp": 3
      },
      "upgradeTiers": {
        "2": {
          "durationSeconds": 3600,
          "costs": {
            "rockBricks": 15
          },
          "effects": {
            "campXp": 5,
            "storageCapacity": 30,
            "appeal": 1
          },
          "costGrowth": 1.7,
          "durationGrowth": 1.4
        }
      },
      "simulation": {
        "ranks": 12
      },
      "build": {
        "entryMode": "build",
        "durationSeconds": 1800
      },
      "law": {
        "family": "stone-storage-shed",
        "baseCosts": {
          "rockBricks": 5
        },
        "growth": 1.7,
        "authoredRanks": {
          "1": {
            "rockBricks": 5
          }
        },
        "rounding": "ceil",
        "refundRate": 0.5,
        "durationGrowth": 1.4
      }
    },
    "nayaSInn": {
      "assetId": "naya-s-inn",
      "name": "Naya's Inn",
      "category": "building",
      "repeatable": false,
      "footprint": {
        "width": 3,
        "height": 2
      },
      "unlock": {
        "kind": "runtime-rule",
        "id": "nayaRecruitStoryComplete"
      },
      "effects": {
        "appeal": 3,
        "campXp": 15
      },
      "upgradeTiers": {},
      "simulation": {},
      "build": {
        "entryMode": "build",
        "durationSeconds": 7200,
        "costs": {
          "rockBricks": 20,
          "pebbleBricks": 40,
          "basicWoodPlanks": 50
        }
      }
    }
  }
});
})(typeof window !== "undefined" ? window : globalThis);
