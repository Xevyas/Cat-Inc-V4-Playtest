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
        "growth": 1.5,
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
          "durationSeconds": 600,
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
          "durationSeconds": 900,
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
          "durationSeconds": 900,
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
      "effects": {},
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
        "growth": 1.7,
        "authoredRanks": {
          "1": {
            "pebbleBricks": 5
          }
        },
        "rounding": "ceil",
        "refundRate": 0.5,
        "durationGrowth": 1.4
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
        "growth": 1.7,
        "authoredRanks": {
          "1": {
            "cardboardPlanks": 5
          }
        },
        "rounding": "ceil",
        "refundRate": 0.5,
        "durationGrowth": 1.4
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
    }
  }
});
})(typeof window !== "undefined" ? window : globalThis);
