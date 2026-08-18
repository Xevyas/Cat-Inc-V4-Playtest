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
        "housingCapacity": 1
      },
      "upgradeTiers": {
        "2": {
          "durationSeconds": 1800,
          "costs": {
            "cardboardPlanks": 5
          },
          "effects": {
            "housingCapacity": 1,
            "appeal": 1
          },
          "unlock": {
            "kind": "runtime-rule",
            "id": "appealUnlocked"
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
        "storageCapacity": 10
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
            "appeal": 0.5
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
      "upgradeTiers": {},
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
    "trainingCenter": {
      "assetId": "training-center",
      "name": "Training Center",
      "category": "building",
      "repeatable": false,
      "footprint": {
        "width": 3,
        "height": 4
      },
      "unlock": {
        "kind": "runtime-rule",
        "id": "trainingCenterUnlocked"
      },
      "effects": {},
      "upgradeTiers": {},
      "simulation": {},
      "build": {
        "entryMode": "build",
        "durationSeconds": 1800,
        "costs": {
          "rockBricks": 10,
          "basicWoodPlanks": 20
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
      "effects": {},
      "upgradeTiers": {},
      "simulation": {
        "ranks": 12
      },
      "build": {
        "entryMode": "build",
        "durationSeconds": 1800,
        "costs": {
          "pebbleBricks": 1
        }
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
        "residentLevelBonusMultiplier": 1.05
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
    }
  }
});
})(typeof window !== "undefined" ? window : globalThis);
