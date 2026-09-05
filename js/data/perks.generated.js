(function(root) {
  "use strict";
  const CatInc = root.CatInc = root.CatInc || {};
  CatInc.data = CatInc.data || {};
  function deepFreeze(value) {
    if (!value || typeof value !== "object" || Object.isFrozen(value)) return value;
    Object.keys(value).forEach(function(key) { deepFreeze(value[key]); });
    return Object.freeze(value);
  }
  const catalog = deepFreeze({
  "schemaVersion": 2,
  "progressVersion": 2,
  "nodes": [
    {
      "id": "gangLeaderLeadership",
      "jobId": "gang-leader",
      "name": "Leadership",
      "description": "Initial job perk",
      "starting": false,
      "granted": true,
      "available": true,
      "prerequisites": [],
      "costs": {},
      "effects": [],
      "layout": {
        "x": 60,
        "y": 270
      }
    },
    {
      "id": "gangLeaderFoodManagement",
      "jobId": "gang-leader",
      "name": "Food Management",
      "description": "Unlocks the existing Food Management capability.",
      "starting": false,
      "granted": false,
      "available": true,
      "prerequisites": [
        "gangLeaderLeadership"
      ],
      "costs": {
        "cannedCatFood": 1
      },
      "effects": [
        {
          "effectId": "gangLeaderFoodManagement",
          "parameters": {}
        }
      ],
      "layout": {
        "x": 300,
        "y": 70
      }
    },
    {
      "id": "gangLeaderDailyReward1",
      "jobId": "gang-leader",
      "name": "Daily Reward I",
      "description": "Raises the Daily Quest reward from 1 to 2 Canned Cat Food.",
      "starting": false,
      "granted": false,
      "available": true,
      "prerequisites": [
        "gangLeaderFoodManagement"
      ],
      "costs": {
        "cannedCatFood": 3
      },
      "effects": [
        {
          "effectId": "gangLeaderDailyReward",
          "parameters": {
            "amount": 2
          }
        }
      ],
      "layout": {
        "x": 540,
        "y": 70
      }
    },
    {
      "id": "gangLeaderDailyReward2",
      "jobId": "gang-leader",
      "name": "Daily Reward II",
      "description": "Raises the total Daily Quest reward from 2 to 3 Canned Cat Food.",
      "starting": false,
      "granted": false,
      "available": true,
      "prerequisites": [
        "gangLeaderDailyReward1"
      ],
      "costs": {
        "cannedCatFood": 5
      },
      "effects": [
        {
          "effectId": "gangLeaderDailyReward",
          "parameters": {
            "amount": 3
          }
        }
      ],
      "layout": {
        "x": 780,
        "y": 70
      }
    },
    {
      "id": "gangLeaderRecruiter1",
      "jobId": "gang-leader",
      "name": "Recruiter I",
      "description": "Sets the total Recruit Speed perk multiplier to ×1.25.",
      "starting": false,
      "granted": false,
      "available": true,
      "prerequisites": [
        "gangLeaderLeadership"
      ],
      "costs": {
        "cannedCatFood": 2
      },
      "effects": [
        {
          "effectId": "gangLeaderRecruitSpeed",
          "parameters": {
            "factor": 1.25
          }
        }
      ],
      "layout": {
        "x": 300,
        "y": 230
      }
    },
    {
      "id": "gangLeaderRecruiter2",
      "jobId": "gang-leader",
      "name": "Recruiter II",
      "description": "Sets the total Recruit Speed perk multiplier to ×1.50.",
      "starting": false,
      "granted": false,
      "available": true,
      "prerequisites": [
        "gangLeaderRecruiter1"
      ],
      "costs": {
        "cannedCatFood": 4
      },
      "effects": [
        {
          "effectId": "gangLeaderRecruitSpeed",
          "parameters": {
            "factor": 1.5
          }
        }
      ],
      "layout": {
        "x": 540,
        "y": 230
      }
    },
    {
      "id": "gangLeaderManualFocus",
      "jobId": "gang-leader",
      "name": "Manual Focus",
      "description": "Raises the existing Manual Focus multiplier from ×2 to ×3.",
      "starting": false,
      "granted": false,
      "available": true,
      "prerequisites": [
        "gangLeaderLeadership"
      ],
      "costs": {
        "cannedCatFood": 2
      },
      "effects": [
        {
          "effectId": "gangLeaderManualFocusMultiplier",
          "parameters": {
            "factor": 3
          }
        }
      ],
      "layout": {
        "x": 300,
        "y": 430
      }
    },
    {
      "id": "gangLeaderQuickCharge",
      "jobId": "gang-leader",
      "name": "Quick Charge",
      "description": "Raises Manual Focus charge from 0.8 to 2 seconds per click.",
      "starting": false,
      "granted": false,
      "available": true,
      "prerequisites": [
        "gangLeaderManualFocus"
      ],
      "costs": {
        "cannedCatFood": 2
      },
      "effects": [
        {
          "effectId": "gangLeaderManualFocusChargeSeconds",
          "parameters": {
            "seconds": 2
          }
        }
      ],
      "layout": {
        "x": 540,
        "y": 360
      }
    },
    {
      "id": "gangLeaderDeepFocus",
      "jobId": "gang-leader",
      "name": "Deep Focus",
      "description": "Raises Manual Focus capacity from 30 to 60 seconds.",
      "starting": false,
      "granted": false,
      "available": true,
      "prerequisites": [
        "gangLeaderManualFocus"
      ],
      "costs": {
        "cannedCatFood": 2
      },
      "effects": [
        {
          "effectId": "gangLeaderManualFocusCapacitySeconds",
          "parameters": {
            "seconds": 60
          }
        }
      ],
      "layout": {
        "x": 540,
        "y": 500
      }
    },
    {
      "id": "gangLeaderTotalFocus",
      "jobId": "gang-leader",
      "name": "Total Focus",
      "description": "Raises the total Manual Focus multiplier from ×3 to ×4.",
      "starting": false,
      "granted": false,
      "available": true,
      "prerequisites": [
        "gangLeaderQuickCharge",
        "gangLeaderDeepFocus"
      ],
      "costs": {
        "cannedCatFood": 4
      },
      "effects": [
        {
          "effectId": "gangLeaderManualFocusMultiplier",
          "parameters": {
            "factor": 4
          }
        }
      ],
      "layout": {
        "x": 780,
        "y": 430
      }
    },
    {
      "id": "exploratorPathfinder",
      "jobId": "explorator",
      "name": "Pathfinder",
      "description": "Initial job perk",
      "starting": false,
      "granted": true,
      "available": true,
      "prerequisites": [],
      "costs": {},
      "effects": [],
      "layout": {
        "x": 60,
        "y": 300
      }
    },
    {
      "id": "exploratorAutoAssign",
      "jobId": "explorator",
      "name": "Auto Assign",
      "description": "Unlocks the existing Exploration Auto Assign capability.",
      "starting": false,
      "granted": false,
      "available": true,
      "prerequisites": [
        "exploratorPathfinder"
      ],
      "costs": {
        "cannedCatFood": 1
      },
      "effects": [
        {
          "effectId": "exploratorAutoAssign",
          "parameters": {}
        }
      ],
      "layout": {
        "x": 300,
        "y": 40
      }
    },
    {
      "id": "exploratorCatFoodFinder1",
      "jobId": "explorator",
      "name": "Cat Food Finder I",
      "description": "Sets the Canned Cat Food scouting reward weight multiplier to ×1.5.",
      "starting": false,
      "granted": false,
      "available": true,
      "prerequisites": [
        "exploratorPathfinder"
      ],
      "costs": {
        "cannedCatFood": 1
      },
      "effects": [
        {
          "effectId": "exploratorCannedCatFoodChance",
          "parameters": {
            "factor": 1.5,
            "jobId": "explorator",
            "resourceId": "cannedCatFood"
          }
        }
      ],
      "layout": {
        "x": 300,
        "y": 160
      }
    },
    {
      "id": "exploratorCatFoodFinder2",
      "jobId": "explorator",
      "name": "Cat Food Finder II",
      "description": "Sets the total Canned Cat Food scouting reward weight multiplier to ×2.",
      "starting": false,
      "granted": false,
      "available": true,
      "prerequisites": [
        "exploratorCatFoodFinder1"
      ],
      "costs": {
        "cannedCatFood": 2
      },
      "effects": [
        {
          "effectId": "exploratorCannedCatFoodChance",
          "parameters": {
            "factor": 2,
            "jobId": "explorator",
            "resourceId": "cannedCatFood"
          }
        }
      ],
      "layout": {
        "x": 540,
        "y": 110
      }
    },
    {
      "id": "exploratorLuckyFood1",
      "jobId": "explorator",
      "name": "Lucky Food I",
      "description": "Adds a 15% chance that an awarded Canned Cat Food reward preserves remaining daily stock.",
      "starting": false,
      "granted": false,
      "available": true,
      "prerequisites": [
        "exploratorCatFoodFinder1"
      ],
      "costs": {
        "cannedCatFood": 2
      },
      "effects": [
        {
          "effectId": "exploratorStockPreservation",
          "parameters": {
            "chance": 0.15
          }
        }
      ],
      "layout": {
        "x": 540,
        "y": 210
      }
    },
    {
      "id": "exploratorLuckyFood2",
      "jobId": "explorator",
      "name": "Lucky Food II",
      "description": "Sets the total Canned Cat Food stock-preservation chance to 30%.",
      "starting": false,
      "granted": false,
      "available": true,
      "prerequisites": [
        "exploratorLuckyFood1"
      ],
      "costs": {
        "cannedCatFood": 3
      },
      "effects": [
        {
          "effectId": "exploratorStockPreservation",
          "parameters": {
            "chance": 0.3
          }
        }
      ],
      "layout": {
        "x": 780,
        "y": 210
      }
    },
    {
      "id": "exploratorLuckyLoot1",
      "jobId": "explorator",
      "name": "Lucky Loot I",
      "description": "Adds a 20% chance to double a scouting reward.",
      "starting": false,
      "granted": false,
      "available": true,
      "prerequisites": [
        "exploratorPathfinder"
      ],
      "costs": {
        "cannedCatFood": 1
      },
      "effects": [
        {
          "effectId": "exploratorDoubleReward",
          "parameters": {
            "chance": 0.2
          }
        }
      ],
      "layout": {
        "x": 300,
        "y": 350
      }
    },
    {
      "id": "exploratorLuckyLoot2",
      "jobId": "explorator",
      "name": "Lucky Loot II",
      "description": "Sets the total scouting Double chance to 40%.",
      "starting": false,
      "granted": false,
      "available": true,
      "prerequisites": [
        "exploratorLuckyLoot1"
      ],
      "costs": {
        "cannedCatFood": 2
      },
      "effects": [
        {
          "effectId": "exploratorDoubleReward",
          "parameters": {
            "chance": 0.4
          }
        }
      ],
      "layout": {
        "x": 540,
        "y": 310
      }
    },
    {
      "id": "exploratorSuperLuck1",
      "jobId": "explorator",
      "name": "Super Luck I",
      "description": "After Double succeeds, adds a 15% chance to upgrade ×2 to ×3.",
      "starting": false,
      "granted": false,
      "available": true,
      "prerequisites": [
        "exploratorLuckyLoot1"
      ],
      "costs": {
        "cannedCatFood": 3
      },
      "effects": [
        {
          "effectId": "exploratorConditionalTriple",
          "parameters": {
            "chance": 0.15
          }
        }
      ],
      "layout": {
        "x": 540,
        "y": 410
      }
    },
    {
      "id": "exploratorSuperLuck2",
      "jobId": "explorator",
      "name": "Super Luck II",
      "description": "Sets the total conditional Triple chance to 30%.",
      "starting": false,
      "granted": false,
      "available": true,
      "prerequisites": [
        "exploratorSuperLuck1"
      ],
      "costs": {
        "cannedCatFood": 4
      },
      "effects": [
        {
          "effectId": "exploratorConditionalTriple",
          "parameters": {
            "chance": 0.3
          }
        }
      ],
      "layout": {
        "x": 780,
        "y": 410
      }
    },
    {
      "id": "exploratorPower1",
      "jobId": "explorator",
      "name": "Exploration Power I",
      "description": "Sets the total Explorator Exploration Power multiplier to ×1.25.",
      "starting": false,
      "granted": false,
      "available": true,
      "prerequisites": [
        "exploratorPathfinder"
      ],
      "costs": {
        "cannedCatFood": 1
      },
      "effects": [
        {
          "effectId": "exploratorPower",
          "parameters": {
            "factor": 1.25,
            "jobId": "explorator"
          }
        }
      ],
      "layout": {
        "x": 300,
        "y": 560
      }
    },
    {
      "id": "exploratorPower2",
      "jobId": "explorator",
      "name": "Exploration Power II",
      "description": "Sets the total Explorator Exploration Power multiplier to ×1.50.",
      "starting": false,
      "granted": false,
      "available": true,
      "prerequisites": [
        "exploratorPower1"
      ],
      "costs": {
        "cannedCatFood": 2
      },
      "effects": [
        {
          "effectId": "exploratorPower",
          "parameters": {
            "factor": 1.5,
            "jobId": "explorator"
          }
        }
      ],
      "layout": {
        "x": 540,
        "y": 560
      }
    },
    {
      "id": "lumberjackGatherManager",
      "jobId": "lumberjack",
      "name": "Gather Manager",
      "description": "Initial job perk",
      "starting": false,
      "granted": true,
      "available": true,
      "prerequisites": [],
      "costs": {},
      "effects": [],
      "layout": {
        "x": 60,
        "y": 270
      }
    },
    {
      "id": "lumberjackGatherOutput1",
      "jobId": "lumberjack",
      "name": "Gather Output I",
      "description": "Sets the total Wood Gathering output multiplier to ×1.25.",
      "starting": false,
      "granted": false,
      "available": true,
      "prerequisites": [
        "lumberjackGatherManager"
      ],
      "costs": {
        "cannedCatFood": 1
      },
      "effects": [
        {
          "effectId": "workGatherOutputMultiplier",
          "parameters": {
            "factor": 1.25,
            "familyId": "wood"
          }
        }
      ],
      "layout": {
        "x": 300,
        "y": 120
      }
    },
    {
      "id": "lumberjackGatherOutput2",
      "jobId": "lumberjack",
      "name": "Gather Output II",
      "description": "Sets the total Wood Gathering output multiplier to ×1.50.",
      "starting": false,
      "granted": false,
      "available": true,
      "prerequisites": [
        "lumberjackGatherOutput1"
      ],
      "costs": {
        "cannedCatFood": 2
      },
      "effects": [
        {
          "effectId": "workGatherOutputMultiplier",
          "parameters": {
            "factor": 1.5,
            "familyId": "wood"
          }
        }
      ],
      "layout": {
        "x": 540,
        "y": 120
      }
    },
    {
      "id": "lumberjackManagerSpeed1",
      "jobId": "lumberjack",
      "name": "Manager Speed I",
      "description": "Sets the total Wood Gathering manager perk multiplier to ×1.25.",
      "starting": false,
      "granted": false,
      "available": true,
      "prerequisites": [
        "lumberjackGatherManager"
      ],
      "costs": {
        "cannedCatFood": 1
      },
      "effects": [
        {
          "effectId": "workManagerSpeedMultiplier",
          "parameters": {
            "factor": 1.25,
            "familyId": "wood"
          }
        }
      ],
      "layout": {
        "x": 300,
        "y": 270
      }
    },
    {
      "id": "lumberjackManagerSpeed2",
      "jobId": "lumberjack",
      "name": "Manager Speed II",
      "description": "Sets the total Wood Gathering manager perk multiplier to ×1.50.",
      "starting": false,
      "granted": false,
      "available": true,
      "prerequisites": [
        "lumberjackManagerSpeed1"
      ],
      "costs": {
        "cannedCatFood": 2
      },
      "effects": [
        {
          "effectId": "workManagerSpeedMultiplier",
          "parameters": {
            "factor": 1.5,
            "familyId": "wood"
          }
        }
      ],
      "layout": {
        "x": 540,
        "y": 270
      }
    },
    {
      "id": "lumberjackExtraSlot",
      "jobId": "lumberjack",
      "name": "Extra Slot",
      "description": "Adds one Wood recipe slot.",
      "starting": false,
      "granted": false,
      "available": true,
      "prerequisites": [
        "lumberjackGatherManager"
      ],
      "costs": {
        "cannedCatFood": 3
      },
      "effects": [
        {
          "effectId": "workRecipeSlotDelta",
          "parameters": {
            "delta": 1,
            "familyId": "wood"
          }
        }
      ],
      "layout": {
        "x": 300,
        "y": 420
      }
    },
    {
      "id": "farmerGatherManager",
      "jobId": "farmer",
      "name": "Gather Manager",
      "description": "Initial job perk",
      "starting": false,
      "granted": true,
      "available": true,
      "prerequisites": [],
      "costs": {},
      "effects": [],
      "layout": {
        "x": 60,
        "y": 270
      }
    },
    {
      "id": "farmerGatherOutput1",
      "jobId": "farmer",
      "name": "Gather Output I",
      "description": "Sets the total Food Gathering output multiplier to ×1.25.",
      "starting": false,
      "granted": false,
      "available": true,
      "prerequisites": [
        "farmerGatherManager"
      ],
      "costs": {
        "cannedCatFood": 1
      },
      "effects": [
        {
          "effectId": "workGatherOutputMultiplier",
          "parameters": {
            "factor": 1.25,
            "familyId": "food"
          }
        }
      ],
      "layout": {
        "x": 300,
        "y": 120
      }
    },
    {
      "id": "farmerGatherOutput2",
      "jobId": "farmer",
      "name": "Gather Output II",
      "description": "Sets the total Food Gathering output multiplier to ×1.50.",
      "starting": false,
      "granted": false,
      "available": true,
      "prerequisites": [
        "farmerGatherOutput1"
      ],
      "costs": {
        "cannedCatFood": 2
      },
      "effects": [
        {
          "effectId": "workGatherOutputMultiplier",
          "parameters": {
            "factor": 1.5,
            "familyId": "food"
          }
        }
      ],
      "layout": {
        "x": 540,
        "y": 120
      }
    },
    {
      "id": "farmerManagerSpeed1",
      "jobId": "farmer",
      "name": "Manager Speed I",
      "description": "Sets the total Food Gathering manager perk multiplier to ×1.25.",
      "starting": false,
      "granted": false,
      "available": true,
      "prerequisites": [
        "farmerGatherManager"
      ],
      "costs": {
        "cannedCatFood": 1
      },
      "effects": [
        {
          "effectId": "workManagerSpeedMultiplier",
          "parameters": {
            "factor": 1.25,
            "familyId": "food"
          }
        }
      ],
      "layout": {
        "x": 300,
        "y": 270
      }
    },
    {
      "id": "farmerManagerSpeed2",
      "jobId": "farmer",
      "name": "Manager Speed II",
      "description": "Sets the total Food Gathering manager perk multiplier to ×1.50.",
      "starting": false,
      "granted": false,
      "available": true,
      "prerequisites": [
        "farmerManagerSpeed1"
      ],
      "costs": {
        "cannedCatFood": 2
      },
      "effects": [
        {
          "effectId": "workManagerSpeedMultiplier",
          "parameters": {
            "factor": 1.5,
            "familyId": "food"
          }
        }
      ],
      "layout": {
        "x": 540,
        "y": 270
      }
    },
    {
      "id": "farmerExtraSlot",
      "jobId": "farmer",
      "name": "Extra Slot",
      "description": "Adds one Food recipe slot.",
      "starting": false,
      "granted": false,
      "available": true,
      "prerequisites": [
        "farmerGatherManager"
      ],
      "costs": {
        "cannedCatFood": 3
      },
      "effects": [
        {
          "effectId": "workRecipeSlotDelta",
          "parameters": {
            "delta": 1,
            "familyId": "food"
          }
        }
      ],
      "layout": {
        "x": 300,
        "y": 420
      }
    },
    {
      "id": "minerGatherManager",
      "jobId": "miner",
      "name": "Gather Manager",
      "description": "Initial job perk",
      "starting": false,
      "granted": true,
      "available": true,
      "prerequisites": [],
      "costs": {},
      "effects": [],
      "layout": {
        "x": 60,
        "y": 270
      }
    },
    {
      "id": "minerGatherOutput1",
      "jobId": "miner",
      "name": "Gather Output I",
      "description": "Sets the total Rock Gathering output multiplier to ×1.25.",
      "starting": false,
      "granted": false,
      "available": true,
      "prerequisites": [
        "minerGatherManager"
      ],
      "costs": {
        "cannedCatFood": 1
      },
      "effects": [
        {
          "effectId": "workGatherOutputMultiplier",
          "parameters": {
            "factor": 1.25,
            "familyId": "rock"
          }
        }
      ],
      "layout": {
        "x": 300,
        "y": 120
      }
    },
    {
      "id": "minerGatherOutput2",
      "jobId": "miner",
      "name": "Gather Output II",
      "description": "Sets the total Rock Gathering output multiplier to ×1.50.",
      "starting": false,
      "granted": false,
      "available": true,
      "prerequisites": [
        "minerGatherOutput1"
      ],
      "costs": {
        "cannedCatFood": 2
      },
      "effects": [
        {
          "effectId": "workGatherOutputMultiplier",
          "parameters": {
            "factor": 1.5,
            "familyId": "rock"
          }
        }
      ],
      "layout": {
        "x": 540,
        "y": 120
      }
    },
    {
      "id": "minerManagerSpeed1",
      "jobId": "miner",
      "name": "Manager Speed I",
      "description": "Sets the total Rock Gathering manager perk multiplier to ×1.25.",
      "starting": false,
      "granted": false,
      "available": true,
      "prerequisites": [
        "minerGatherManager"
      ],
      "costs": {
        "cannedCatFood": 1
      },
      "effects": [
        {
          "effectId": "workManagerSpeedMultiplier",
          "parameters": {
            "factor": 1.25,
            "familyId": "rock"
          }
        }
      ],
      "layout": {
        "x": 300,
        "y": 270
      }
    },
    {
      "id": "minerManagerSpeed2",
      "jobId": "miner",
      "name": "Manager Speed II",
      "description": "Sets the total Rock Gathering manager perk multiplier to ×1.50.",
      "starting": false,
      "granted": false,
      "available": true,
      "prerequisites": [
        "minerManagerSpeed1"
      ],
      "costs": {
        "cannedCatFood": 2
      },
      "effects": [
        {
          "effectId": "workManagerSpeedMultiplier",
          "parameters": {
            "factor": 1.5,
            "familyId": "rock"
          }
        }
      ],
      "layout": {
        "x": 540,
        "y": 270
      }
    },
    {
      "id": "minerExtraSlot",
      "jobId": "miner",
      "name": "Extra Slot",
      "description": "Adds one Rock recipe slot.",
      "starting": false,
      "granted": false,
      "available": true,
      "prerequisites": [
        "minerGatherManager"
      ],
      "costs": {
        "cannedCatFood": 3
      },
      "effects": [
        {
          "effectId": "workRecipeSlotDelta",
          "parameters": {
            "delta": 1,
            "familyId": "rock"
          }
        }
      ],
      "layout": {
        "x": 300,
        "y": 420
      }
    },
    {
      "id": "carpenterProcessManager",
      "jobId": "carpenter",
      "name": "Process Manager",
      "description": "Initial job perk",
      "starting": false,
      "granted": true,
      "available": true,
      "prerequisites": [],
      "costs": {},
      "effects": [],
      "layout": {
        "x": 60,
        "y": 270
      }
    },
    {
      "id": "carpenterInputEfficiency1",
      "jobId": "carpenter",
      "name": "Input Efficiency I",
      "description": "Changes the matching recipe Gathering target from 10 to 8.",
      "starting": false,
      "granted": false,
      "available": true,
      "prerequisites": [
        "carpenterProcessManager"
      ],
      "costs": {
        "cannedCatFood": 1
      },
      "effects": [
        {
          "effectId": "workRecipeInputTarget",
          "parameters": {
            "target": 8,
            "familyId": "sawmill"
          }
        }
      ],
      "layout": {
        "x": 300,
        "y": 120
      }
    },
    {
      "id": "carpenterInputEfficiency2",
      "jobId": "carpenter",
      "name": "Input Efficiency II",
      "description": "Changes the matching recipe Gathering target from 8 to 6.",
      "starting": false,
      "granted": false,
      "available": true,
      "prerequisites": [
        "carpenterInputEfficiency1"
      ],
      "costs": {
        "cannedCatFood": 2
      },
      "effects": [
        {
          "effectId": "workRecipeInputTarget",
          "parameters": {
            "target": 6,
            "familyId": "sawmill"
          }
        }
      ],
      "layout": {
        "x": 540,
        "y": 120
      }
    },
    {
      "id": "carpenterProcessSpeed1",
      "jobId": "carpenter",
      "name": "Process Speed I",
      "description": "Sets the total Wood Processing manager perk multiplier to ×1.25.",
      "starting": false,
      "granted": false,
      "available": true,
      "prerequisites": [
        "carpenterProcessManager"
      ],
      "costs": {
        "cannedCatFood": 1
      },
      "effects": [
        {
          "effectId": "workManagerSpeedMultiplier",
          "parameters": {
            "factor": 1.25,
            "familyId": "sawmill"
          }
        }
      ],
      "layout": {
        "x": 300,
        "y": 270
      }
    },
    {
      "id": "carpenterProcessSpeed2",
      "jobId": "carpenter",
      "name": "Process Speed II",
      "description": "Sets the total Wood Processing manager perk multiplier to ×1.50.",
      "starting": false,
      "granted": false,
      "available": true,
      "prerequisites": [
        "carpenterProcessSpeed1"
      ],
      "costs": {
        "cannedCatFood": 2
      },
      "effects": [
        {
          "effectId": "workManagerSpeedMultiplier",
          "parameters": {
            "factor": 1.5,
            "familyId": "sawmill"
          }
        }
      ],
      "layout": {
        "x": 540,
        "y": 270
      }
    },
    {
      "id": "carpenterExtraSlot",
      "jobId": "carpenter",
      "name": "Extra Slot",
      "description": "Adds one Wood recipe slot and stacks with the matching Gather Manager slot.",
      "starting": false,
      "granted": false,
      "available": true,
      "prerequisites": [
        "carpenterProcessManager"
      ],
      "costs": {
        "cannedCatFood": 3
      },
      "effects": [
        {
          "effectId": "workRecipeSlotDelta",
          "parameters": {
            "delta": 1,
            "familyId": "wood"
          }
        }
      ],
      "layout": {
        "x": 300,
        "y": 420
      }
    },
    {
      "id": "chefProcessManager",
      "jobId": "chef",
      "name": "Process Manager",
      "description": "Initial job perk",
      "starting": false,
      "granted": true,
      "available": true,
      "prerequisites": [],
      "costs": {},
      "effects": [],
      "layout": {
        "x": 60,
        "y": 270
      }
    },
    {
      "id": "chefInputEfficiency1",
      "jobId": "chef",
      "name": "Input Efficiency I",
      "description": "Changes the matching recipe Gathering target from 10 to 8.",
      "starting": false,
      "granted": false,
      "available": true,
      "prerequisites": [
        "chefProcessManager"
      ],
      "costs": {
        "cannedCatFood": 1
      },
      "effects": [
        {
          "effectId": "workRecipeInputTarget",
          "parameters": {
            "target": 8,
            "familyId": "catchen"
          }
        }
      ],
      "layout": {
        "x": 300,
        "y": 120
      }
    },
    {
      "id": "chefInputEfficiency2",
      "jobId": "chef",
      "name": "Input Efficiency II",
      "description": "Changes the matching recipe Gathering target from 8 to 6.",
      "starting": false,
      "granted": false,
      "available": true,
      "prerequisites": [
        "chefInputEfficiency1"
      ],
      "costs": {
        "cannedCatFood": 2
      },
      "effects": [
        {
          "effectId": "workRecipeInputTarget",
          "parameters": {
            "target": 6,
            "familyId": "catchen"
          }
        }
      ],
      "layout": {
        "x": 540,
        "y": 120
      }
    },
    {
      "id": "chefProcessSpeed1",
      "jobId": "chef",
      "name": "Process Speed I",
      "description": "Sets the total Food Processing manager perk multiplier to ×1.25.",
      "starting": false,
      "granted": false,
      "available": true,
      "prerequisites": [
        "chefProcessManager"
      ],
      "costs": {
        "cannedCatFood": 1
      },
      "effects": [
        {
          "effectId": "workManagerSpeedMultiplier",
          "parameters": {
            "factor": 1.25,
            "familyId": "catchen"
          }
        }
      ],
      "layout": {
        "x": 300,
        "y": 270
      }
    },
    {
      "id": "chefProcessSpeed2",
      "jobId": "chef",
      "name": "Process Speed II",
      "description": "Sets the total Food Processing manager perk multiplier to ×1.50.",
      "starting": false,
      "granted": false,
      "available": true,
      "prerequisites": [
        "chefProcessSpeed1"
      ],
      "costs": {
        "cannedCatFood": 2
      },
      "effects": [
        {
          "effectId": "workManagerSpeedMultiplier",
          "parameters": {
            "factor": 1.5,
            "familyId": "catchen"
          }
        }
      ],
      "layout": {
        "x": 540,
        "y": 270
      }
    },
    {
      "id": "chefExtraSlot",
      "jobId": "chef",
      "name": "Extra Slot",
      "description": "Adds one Food recipe slot and stacks with the matching Gather Manager slot.",
      "starting": false,
      "granted": false,
      "available": true,
      "prerequisites": [
        "chefProcessManager"
      ],
      "costs": {
        "cannedCatFood": 3
      },
      "effects": [
        {
          "effectId": "workRecipeSlotDelta",
          "parameters": {
            "delta": 1,
            "familyId": "food"
          }
        }
      ],
      "layout": {
        "x": 300,
        "y": 420
      }
    },
    {
      "id": "stonemasonProcessManager",
      "jobId": "stonemason",
      "name": "Process Manager",
      "description": "Initial job perk",
      "starting": false,
      "granted": true,
      "available": true,
      "prerequisites": [],
      "costs": {},
      "effects": [],
      "layout": {
        "x": 60,
        "y": 270
      }
    },
    {
      "id": "stonemasonInputEfficiency1",
      "jobId": "stonemason",
      "name": "Input Efficiency I",
      "description": "Changes the matching recipe Gathering target from 10 to 8.",
      "starting": false,
      "granted": false,
      "available": true,
      "prerequisites": [
        "stonemasonProcessManager"
      ],
      "costs": {
        "cannedCatFood": 1
      },
      "effects": [
        {
          "effectId": "workRecipeInputTarget",
          "parameters": {
            "target": 8,
            "familyId": "pawsonry"
          }
        }
      ],
      "layout": {
        "x": 300,
        "y": 120
      }
    },
    {
      "id": "stonemasonInputEfficiency2",
      "jobId": "stonemason",
      "name": "Input Efficiency II",
      "description": "Changes the matching recipe Gathering target from 8 to 6.",
      "starting": false,
      "granted": false,
      "available": true,
      "prerequisites": [
        "stonemasonInputEfficiency1"
      ],
      "costs": {
        "cannedCatFood": 2
      },
      "effects": [
        {
          "effectId": "workRecipeInputTarget",
          "parameters": {
            "target": 6,
            "familyId": "pawsonry"
          }
        }
      ],
      "layout": {
        "x": 540,
        "y": 120
      }
    },
    {
      "id": "stonemasonProcessSpeed1",
      "jobId": "stonemason",
      "name": "Process Speed I",
      "description": "Sets the total Rock Processing manager perk multiplier to ×1.25.",
      "starting": false,
      "granted": false,
      "available": true,
      "prerequisites": [
        "stonemasonProcessManager"
      ],
      "costs": {
        "cannedCatFood": 1
      },
      "effects": [
        {
          "effectId": "workManagerSpeedMultiplier",
          "parameters": {
            "factor": 1.25,
            "familyId": "pawsonry"
          }
        }
      ],
      "layout": {
        "x": 300,
        "y": 270
      }
    },
    {
      "id": "stonemasonProcessSpeed2",
      "jobId": "stonemason",
      "name": "Process Speed II",
      "description": "Sets the total Rock Processing manager perk multiplier to ×1.50.",
      "starting": false,
      "granted": false,
      "available": true,
      "prerequisites": [
        "stonemasonProcessSpeed1"
      ],
      "costs": {
        "cannedCatFood": 2
      },
      "effects": [
        {
          "effectId": "workManagerSpeedMultiplier",
          "parameters": {
            "factor": 1.5,
            "familyId": "pawsonry"
          }
        }
      ],
      "layout": {
        "x": 540,
        "y": 270
      }
    },
    {
      "id": "stonemasonExtraSlot",
      "jobId": "stonemason",
      "name": "Extra Slot",
      "description": "Adds one Rock recipe slot and stacks with the matching Gather Manager slot.",
      "starting": false,
      "granted": false,
      "available": true,
      "prerequisites": [
        "stonemasonProcessManager"
      ],
      "costs": {
        "cannedCatFood": 3
      },
      "effects": [
        {
          "effectId": "workRecipeSlotDelta",
          "parameters": {
            "delta": 1,
            "familyId": "rock"
          }
        }
      ],
      "layout": {
        "x": 300,
        "y": 420
      }
    },
    {
      "id": "builderConstructionSpecialist",
      "jobId": "builder",
      "name": "Builder",
      "description": "+2% multiplicative Construction / Repair / Tier Upgrade speed per Cat level while assigned.",
      "starting": false,
      "granted": true,
      "available": true,
      "prerequisites": [],
      "costs": {},
      "effects": [
        {
          "effectId": "assignedCampActionLevelSpeedMultiplier",
          "parameters": {
            "factor": 1.02,
            "jobId": "builder",
            "taskScope": "construction-repair-upgrade"
          }
        }
      ],
      "layout": {
        "x": 60,
        "y": 300
      }
    },
    {
      "id": "builderConstructionSpeed1",
      "jobId": "builder",
      "name": "Construction Speed I",
      "description": "Sets this assigned Builder's personal construction, Repair and Tier Upgrade speed to ×1.25 total.",
      "starting": false,
      "granted": false,
      "available": true,
      "prerequisites": [
        "builderConstructionSpecialist"
      ],
      "costs": {
        "cannedCatFood": 1
      },
      "effects": [
        {
          "effectId": "assignedCampActionSpeedMultiplier",
          "parameters": {
            "factor": 1.25,
            "jobId": "builder",
            "taskScope": "construction-repair-upgrade"
          }
        }
      ],
      "layout": {
        "x": 300,
        "y": 60
      }
    },
    {
      "id": "builderConstructionSpeed2",
      "jobId": "builder",
      "name": "Construction Speed II",
      "description": "Sets this assigned Builder's personal construction, Repair and Tier Upgrade speed to ×1.50 total.",
      "starting": false,
      "granted": false,
      "available": true,
      "prerequisites": [
        "builderConstructionSpeed1"
      ],
      "costs": {
        "cannedCatFood": 2
      },
      "effects": [
        {
          "effectId": "assignedCampActionSpeedMultiplier",
          "parameters": {
            "factor": 1.5,
            "jobId": "builder",
            "taskScope": "construction-repair-upgrade"
          }
        }
      ],
      "layout": {
        "x": 540,
        "y": 60
      }
    },
    {
      "id": "builderConstructionSpeed3",
      "jobId": "builder",
      "name": "Construction Speed III",
      "description": "Sets this assigned Builder's personal construction, Repair and Tier Upgrade speed to ×1.75 total.",
      "starting": false,
      "granted": false,
      "available": true,
      "prerequisites": [
        "builderConstructionSpeed2"
      ],
      "costs": {
        "cannedCatFood": 4
      },
      "effects": [
        {
          "effectId": "assignedCampActionSpeedMultiplier",
          "parameters": {
            "factor": 1.75,
            "jobId": "builder",
            "taskScope": "construction-repair-upgrade"
          }
        }
      ],
      "layout": {
        "x": 780,
        "y": 60
      }
    },
    {
      "id": "builderMaterialEfficiency1",
      "jobId": "builder",
      "name": "Material Efficiency I",
      "description": "Globally reduces the payable cost of new repeatable House construction by 10%.",
      "starting": false,
      "granted": false,
      "available": true,
      "prerequisites": [
        "builderConstructionSpecialist"
      ],
      "costs": {
        "cannedCatFood": 2
      },
      "effects": [
        {
          "effectId": "houseConstructionCostMultiplier",
          "parameters": {
            "factor": 0.9
          }
        }
      ],
      "layout": {
        "x": 300,
        "y": 180
      }
    },
    {
      "id": "builderMaterialEfficiency2",
      "jobId": "builder",
      "name": "Material Efficiency II",
      "description": "Globally reduces the payable cost of new repeatable House construction by 20% total.",
      "starting": false,
      "granted": false,
      "available": true,
      "prerequisites": [
        "builderMaterialEfficiency1"
      ],
      "costs": {
        "cannedCatFood": 3
      },
      "effects": [
        {
          "effectId": "houseConstructionCostMultiplier",
          "parameters": {
            "factor": 0.8
          }
        }
      ],
      "layout": {
        "x": 540,
        "y": 180
      }
    },
    {
      "id": "builderMaterialEfficiency3",
      "jobId": "builder",
      "name": "Material Efficiency III",
      "description": "Globally reduces the payable cost of new repeatable House construction by 30% total.",
      "starting": false,
      "granted": false,
      "available": true,
      "prerequisites": [
        "builderMaterialEfficiency2"
      ],
      "costs": {
        "cannedCatFood": 5
      },
      "effects": [
        {
          "effectId": "houseConstructionCostMultiplier",
          "parameters": {
            "factor": 0.7
          }
        }
      ],
      "layout": {
        "x": 780,
        "y": 180
      }
    },
    {
      "id": "builderMasterBuilder",
      "jobId": "builder",
      "name": "Master Builder",
      "description": "Globally multiplies Camp construction, Repair and Tier Upgrade speed by ×1.10.",
      "starting": false,
      "granted": false,
      "available": true,
      "prerequisites": [
        "builderConstructionSpecialist"
      ],
      "costs": {
        "cannedCatFood": 5
      },
      "effects": [
        {
          "effectId": "globalCampActionSpeedMultiplier",
          "parameters": {
            "factor": 1.1,
            "taskScope": "construction-repair-upgrade"
          }
        }
      ],
      "layout": {
        "x": 300,
        "y": 300
      }
    },
    {
      "id": "builderHouseOptimization1",
      "jobId": "builder",
      "name": "House Optimization I",
      "description": "Sets the repeatable House initial-construction cost exponent to 1.60.",
      "starting": false,
      "granted": false,
      "available": true,
      "prerequisites": [
        "builderConstructionSpecialist"
      ],
      "costs": {
        "cannedCatFood": 3
      },
      "effects": [
        {
          "effectId": "houseCostExponentOverride",
          "parameters": {
            "exponent": 1.6
          }
        }
      ],
      "layout": {
        "x": 300,
        "y": 420
      }
    },
    {
      "id": "builderHouseOptimization2",
      "jobId": "builder",
      "name": "House Optimization II",
      "description": "Sets the repeatable House initial-construction cost exponent to 1.55 total.",
      "starting": false,
      "granted": false,
      "available": true,
      "prerequisites": [
        "builderHouseOptimization1"
      ],
      "costs": {
        "cannedCatFood": 5
      },
      "effects": [
        {
          "effectId": "houseCostExponentOverride",
          "parameters": {
            "exponent": 1.55
          }
        }
      ],
      "layout": {
        "x": 540,
        "y": 420
      }
    },
    {
      "id": "builderSalvage1",
      "jobId": "builder",
      "name": "Salvage I",
      "description": "Raises permitted Camp deletion refunds to 60% of actual paid construction cost.",
      "starting": false,
      "granted": false,
      "available": true,
      "prerequisites": [
        "builderConstructionSpecialist"
      ],
      "costs": {
        "cannedCatFood": 2
      },
      "effects": [
        {
          "effectId": "demolitionRefundRatio",
          "parameters": {
            "ratio": 0.6
          }
        }
      ],
      "layout": {
        "x": 300,
        "y": 540
      }
    },
    {
      "id": "builderSalvage2",
      "jobId": "builder",
      "name": "Salvage II",
      "description": "Raises permitted Camp deletion refunds to 75% of actual paid construction cost.",
      "starting": false,
      "granted": false,
      "available": true,
      "prerequisites": [
        "builderSalvage1"
      ],
      "costs": {
        "cannedCatFood": 4
      },
      "effects": [
        {
          "effectId": "demolitionRefundRatio",
          "parameters": {
            "ratio": 0.75
          }
        }
      ],
      "layout": {
        "x": 540,
        "y": 540
      }
    },
    {
      "id": "builderReinforcedCardboardBox",
      "jobId": "builder",
      "name": "Reinforced Cardboard Box",
      "description": "Unlocks the unique Cardboard Box Tier 3 upgrade.",
      "starting": false,
      "granted": false,
      "available": true,
      "prerequisites": [
        "builderConstructionSpecialist"
      ],
      "costs": {
        "cannedCatFood": 3
      },
      "effects": [
        {
          "effectId": "campTierUnlock",
          "parameters": {
            "targetTypeId": "cardboardBox",
            "targetTier": 3
          }
        }
      ],
      "layout": {
        "x": 300,
        "y": 660
      }
    },
    {
      "id": "builderMasterWoodCathouse",
      "jobId": "builder",
      "name": "Master Wood Cathouse",
      "description": "Unlocks the unique Wood Cathouse Tier 3 upgrade.",
      "starting": false,
      "granted": false,
      "available": true,
      "prerequisites": [
        "builderConstructionSpecialist"
      ],
      "costs": {
        "cannedCatFood": 4
      },
      "effects": [
        {
          "effectId": "campTierUnlock",
          "parameters": {
            "targetTypeId": "woodCathouse",
            "targetTier": 3
          }
        }
      ],
      "layout": {
        "x": 540,
        "y": 660
      }
    }
  ]
});
  const effectContract = deepFreeze({
  "gangLeaderRecruitSpeed": {
    "shape": "numerical-multiplier",
    "parameters": {
      "factor": {
        "type": "number",
        "exclusiveMinimum": 0,
        "maximum": 10
      }
    }
  },
  "gangLeaderFoodManagement": {
    "shape": "capability",
    "parameters": {}
  },
  "gangLeaderDailyReward": {
    "shape": "reward-amount",
    "parameters": {
      "amount": {
        "type": "number",
        "exclusiveMinimum": 0,
        "maximum": 10
      }
    }
  },
  "gangLeaderManualFocusMultiplier": {
    "shape": "numerical-multiplier",
    "parameters": {
      "factor": {
        "type": "number",
        "exclusiveMinimum": 0,
        "maximum": 10
      }
    }
  },
  "gangLeaderManualFocusChargeSeconds": {
    "shape": "duration-seconds",
    "parameters": {
      "seconds": {
        "type": "number",
        "exclusiveMinimum": 0,
        "maximum": 120
      }
    }
  },
  "gangLeaderManualFocusCapacitySeconds": {
    "shape": "duration-seconds",
    "parameters": {
      "seconds": {
        "type": "number",
        "exclusiveMinimum": 0,
        "maximum": 600
      }
    }
  },
  "exploratorAutoAssign": {
    "shape": "capability",
    "parameters": {}
  },
  "exploratorCannedCatFoodChance": {
    "shape": "scoped-multiplier",
    "parameters": {
      "factor": {
        "type": "number",
        "exclusiveMinimum": 0,
        "maximum": 10
      },
      "jobId": {
        "type": "job-id"
      },
      "resourceId": {
        "type": "resource-id"
      }
    }
  },
  "exploratorStockPreservation": {
    "shape": "probability",
    "parameters": {
      "chance": {
        "type": "number",
        "exclusiveMinimum": 0,
        "maximum": 1
      }
    }
  },
  "exploratorDoubleReward": {
    "shape": "probability",
    "parameters": {
      "chance": {
        "type": "number",
        "exclusiveMinimum": 0,
        "maximum": 1
      }
    }
  },
  "exploratorConditionalTriple": {
    "shape": "conditional-probability",
    "parameters": {
      "chance": {
        "type": "number",
        "exclusiveMinimum": 0,
        "maximum": 1
      }
    }
  },
  "exploratorPower": {
    "shape": "job-scoped-multiplier",
    "parameters": {
      "factor": {
        "type": "number",
        "exclusiveMinimum": 0,
        "maximum": 10
      },
      "jobId": {
        "type": "job-id"
      }
    }
  },
  "workGatherOutputMultiplier": {
    "shape": "family-scoped-multiplier",
    "parameters": {
      "factor": {
        "type": "number",
        "exclusiveMinimum": 0,
        "maximum": 10
      },
      "familyId": {
        "type": "recipe-family-id"
      }
    }
  },
  "workManagerSpeedMultiplier": {
    "shape": "family-scoped-multiplier",
    "parameters": {
      "factor": {
        "type": "number",
        "exclusiveMinimum": 0,
        "maximum": 10
      },
      "familyId": {
        "type": "manager-family-id"
      }
    }
  },
  "workRecipeInputTarget": {
    "shape": "recipe-input-target",
    "parameters": {
      "target": {
        "type": "number",
        "exclusiveMinimum": 0,
        "maximum": 1000
      },
      "familyId": {
        "type": "manager-family-id"
      }
    }
  },
  "workRecipeSlotDelta": {
    "shape": "recipe-slot-delta",
    "parameters": {
      "delta": {
        "type": "number",
        "exclusiveMinimum": 0,
        "maximum": 10
      },
      "familyId": {
        "type": "recipe-family-id"
      }
    }
  },
  "assignedCampActionSpeedMultiplier": {
    "shape": "job-and-task-scoped-multiplier",
    "parameters": {
      "factor": {
        "type": "number",
        "exclusiveMinimum": 0,
        "maximum": 10
      },
      "jobId": {
        "type": "job-id"
      },
      "taskScope": {
        "type": "camp-task-scope"
      }
    }
  },
  "assignedCampActionLevelSpeedMultiplier": {
    "shape": "job-and-task-scoped-level-multiplier",
    "parameters": {
      "factor": {
        "type": "number",
        "exclusiveMinimum": 0,
        "maximum": 10
      },
      "jobId": {
        "type": "job-id"
      },
      "taskScope": {
        "type": "camp-task-scope"
      }
    }
  },
  "globalCampActionSpeedMultiplier": {
    "shape": "task-scoped-multiplier",
    "parameters": {
      "factor": {
        "type": "number",
        "exclusiveMinimum": 0,
        "maximum": 10
      },
      "taskScope": {
        "type": "camp-task-scope"
      }
    }
  },
  "houseConstructionCostMultiplier": {
    "shape": "payable-cost-multiplier",
    "parameters": {
      "factor": {
        "type": "number",
        "exclusiveMinimum": 0,
        "maximum": 1
      }
    }
  },
  "houseCostExponentOverride": {
    "shape": "cost-exponent-override",
    "parameters": {
      "exponent": {
        "type": "number",
        "minimum": 1,
        "maximum": 1.7
      }
    }
  },
  "demolitionRefundRatio": {
    "shape": "refund-ratio",
    "parameters": {
      "ratio": {
        "type": "number",
        "exclusiveMinimum": 0,
        "maximum": 1
      }
    }
  },
  "campTierUnlock": {
    "shape": "target-tier-capability",
    "parameters": {
      "targetTypeId": {
        "type": "camp-tier-type-id"
      },
      "targetTier": {
        "type": "integer",
        "minimum": 2,
        "maximum": 100
      }
    }
  }
});
  const nodesById = Object.create(null);
  catalog.nodes.forEach(function(node) { nodesById[node.id] = node; });

  function normalizeProgress(value) {
    const learned = [];
    if (value && value.version === 2 && Array.isArray(value.learned)) {
      value.learned.forEach(function(perkId) {
        const node = typeof perkId === "string" && nodesById[perkId];
        if (node && node.available && !node.granted && learned.indexOf(perkId) === -1) learned.push(perkId);
      });
    }
    return {version: 2, learned: learned};
  }

  function campTaskScopeMatches(taskScope, taskKind) {
    return taskScope === "construction-repair-upgrade"
      && (taskKind === "construction" || taskKind === "repair" || taskKind === "upgrade");
  }

  function activeNodeIds(progress) {
    const result = new Set(normalizeProgress(progress).learned);
    catalog.nodes.forEach(function(node) { if (node.available && node.granted) result.add(node.id); });
    return result;
  }

  function isEffective(progress, perkId) {
    return activeNodeIds(progress).has(perkId);
  }

  function nodesForJob(jobId) {
    return catalog.nodes.filter(function(node) { return node.available && node.jobId === jobId; });
  }

  const effectImplementations = Object.freeze({
    gangLeaderRecruitSpeed: function(current, parameters) { return Math.max(current, parameters.factor); },
    gangLeaderFoodManagement: function() { return true; },
    gangLeaderDailyReward: function(current, parameters) { return Math.max(current, parameters.amount); },
    gangLeaderManualFocusMultiplier: function(current, parameters) { return Math.max(current, parameters.factor); },
    gangLeaderManualFocusChargeSeconds: function(current, parameters) { return Math.max(current, parameters.seconds); },
    gangLeaderManualFocusCapacitySeconds: function(current, parameters) { return Math.max(current, parameters.seconds); },
    exploratorAutoAssign: function() { return true; },
    exploratorCannedCatFoodChance: function(current, parameters, context) {
      return context && context.jobId === parameters.jobId && context.resourceId === parameters.resourceId
        ? Math.max(current, parameters.factor) : current;
    },
    exploratorStockPreservation: function(current, parameters) { return Math.max(current, parameters.chance); },
    exploratorDoubleReward: function(current, parameters) { return Math.max(current, parameters.chance); },
    exploratorConditionalTriple: function(current, parameters) { return Math.max(current, parameters.chance); },
    exploratorPower: function(current, parameters, context) {
      return context && context.jobId === parameters.jobId ? Math.max(current, parameters.factor) : current;
    },
    workGatherOutputMultiplier: function(current, parameters, context) {
      return context && context.familyId === parameters.familyId ? Math.max(current, parameters.factor) : current;
    },
    workManagerSpeedMultiplier: function(current, parameters, context) {
      return context && context.familyId === parameters.familyId ? Math.max(current, parameters.factor) : current;
    },
    workRecipeInputTarget: function(current, parameters, context) {
      return context && context.familyId === parameters.familyId ? Math.min(current, parameters.target) : current;
    },
    workRecipeSlotDelta: function(current, parameters, context) {
      return context && context.familyId === parameters.familyId ? current + parameters.delta : current;
    },
    assignedCampActionSpeedMultiplier: function(current, parameters, context) {
      return context && context.jobId === parameters.jobId
        && campTaskScopeMatches(parameters.taskScope, context.taskKind)
        ? Math.max(current, parameters.factor) : current;
    },
    assignedCampActionLevelSpeedMultiplier: function(current, parameters, context) {
      return context && context.jobId === parameters.jobId
        && campTaskScopeMatches(parameters.taskScope, context.taskKind)
        ? current * Math.pow(parameters.factor, Math.max(0, Number(context.catLevel) || 0)) : current;
    },
    globalCampActionSpeedMultiplier: function(current, parameters, context) {
      return context && campTaskScopeMatches(parameters.taskScope, context.taskKind)
        ? Math.max(current, parameters.factor) : current;
    },
    houseConstructionCostMultiplier: function(current, parameters) {
      return Math.min(current, parameters.factor);
    },
    houseCostExponentOverride: function(current, parameters) {
      return Math.min(current, parameters.exponent);
    },
    demolitionRefundRatio: function(current, parameters) {
      return Math.max(current, parameters.ratio);
    },
    campTierUnlock: function(current, parameters, context) {
      return current || Boolean(context && context.targetTypeId === parameters.targetTypeId
        && context.targetTier === parameters.targetTier);
    }
  });
  const contractIds = Object.keys(effectContract).sort();
  const implementationIds = Object.keys(effectImplementations).sort();
  if (JSON.stringify(contractIds) !== JSON.stringify(implementationIds)) {
    throw new Error("Perks V2 effect contract/runtime mismatch");
  }

  function effectsFor(progress, effectId, explain) {
    if (!effectContract[effectId] || !effectImplementations[effectId]) return [];
    const active = activeNodeIds(progress);
    const effects = [];
    catalog.nodes.forEach(function(node) {
      if (!active.has(node.id)) return;
      node.effects.forEach(function(effect) {
        if (effect.effectId === effectId) effects.push(explain
          ? Object.assign({nodeId: node.id, label: node.name}, effect) : effect);
      });
    });
    return effects;
  }

  function effectValue(progress, effectId, initial, context, modifiers) {
    const contributions = modifiers ? [] : null;
    const result = effectsFor(progress, effectId, modifiers).reduce(function(value, effect) {
      const next = effectImplementations[effectId](value, effect.parameters, context || null);
      if (modifiers && next !== value) {
        // A replacing effect (e.g. the highest learned speed tier) supersedes
        // earlier contributions; stacking effects retain their relative factor.
        const standalone = effectImplementations[effectId](initial, effect.parameters, context || null);
        if (next === standalone) contributions.length = 0;
        contributions.push({id: effect.nodeId, label: effect.label,
          factor: next / (next === standalone ? initial : value)});
      }
      return next;
    }, initial);
    if (modifiers) contributions.forEach(function(entry) { modifiers.push(entry); });
    return result;
  }

  function multiplier(progress, effectId, context, modifiers) {
    return effectValue(progress, effectId, 1, context, modifiers);
  }

  function hasCapability(progress, effectId) {
    if (!effectContract[effectId] || effectContract[effectId].shape !== "capability") return false;
    return effectsFor(progress, effectId).some(function(effect) {
      return effectImplementations[effectId](false, effect.parameters, null) === true;
    });
  }

  function validateLearn(progress, perkId, access) {
    const node = nodesById[perkId];
    if (!node) return {ok: false, reason: "unknown"};
    if (!node.available) return {ok: false, reason: "unavailable"};
    if (!access || access.jobId !== node.jobId) return {ok: false, reason: "job"};
    const active = activeNodeIds(progress);
    if (active.has(perkId)) return {ok: false, reason: "learned"};
    if (!node.starting && !node.prerequisites.every(function(item) { return active.has(item); })) {
      return {ok: false, reason: "prerequisites"};
    }
    return {ok: true, reason: null};
  }

  function canLearn(progress, perkId, resources, access) {
    const result = validateLearn(progress, perkId, access);
    if (!result.ok) return result;
    const node = nodesById[perkId];
    const wallet = resources && typeof resources === "object" ? resources : {};
    const affordable = Object.keys(node.costs).every(function(resourceId) {
      return Number.isFinite(wallet[resourceId]) && wallet[resourceId] >= node.costs[resourceId];
    });
    return affordable ? {ok: true, reason: null} : {ok: false, reason: "cost"};
  }

  function beginLearn(progress, perkId, resources, access) {
    const result = canLearn(progress, perkId, resources, access);
    const currentProgress = normalizeProgress(progress);
    const currentResources = Object.assign({}, resources || {});
    if (!result.ok) return {ok: false, reason: result.reason, progress: currentProgress, resources: currentResources};
    const node = nodesById[perkId];
    Object.keys(node.costs).forEach(function(resourceId) { currentResources[resourceId] -= node.costs[resourceId]; });
    return {ok: true, reason: null, progress: currentProgress, resources: currentResources};
  }

  function completeLearn(progress, perkId, access) {
    const result = validateLearn(progress, perkId, access);
    const currentProgress = normalizeProgress(progress);
    if (!result.ok) return {ok: false, reason: result.reason, progress: currentProgress};
    currentProgress.learned.push(perkId);
    return {ok: true, reason: null, progress: currentProgress};
  }

  function learn(progress, perkId, resources, access) {
    const started = beginLearn(progress, perkId, resources, access);
    if (!started.ok) return started;
    const completed = completeLearn(started.progress, perkId, access);
    return {
      ok: completed.ok,
      reason: completed.reason,
      progress: completed.progress,
      resources: started.resources
    };
  }

  CatInc.data.perksV2 = catalog;
  CatInc.perksV2 = Object.freeze({
    effectContract: effectContract,
    implementedEffectIds: Object.freeze(implementationIds),
    normalizeProgress: normalizeProgress,
    isEffective: isEffective,
    nodesForJob: nodesForJob,
    canLearn: canLearn,
    beginLearn: beginLearn,
    completeLearn: completeLearn,
    learn: learn,
    recruitSpeedMultiplier: function(progress) { return multiplier(progress, "gangLeaderRecruitSpeed", null); },
    hasFoodManagement: function(progress) { return hasCapability(progress, "gangLeaderFoodManagement"); },
    dailyRewardAmount: function(progress) { return effectValue(progress, "gangLeaderDailyReward", 1, null); },
    manualFocusMultiplier: function(progress, baseFactor) {
      const initial = Number.isFinite(baseFactor) ? baseFactor : 1;
      return effectValue(progress, "gangLeaderManualFocusMultiplier", initial, null);
    },
    manualFocusChargeSeconds: function(progress, baseSeconds) {
      return effectValue(progress, "gangLeaderManualFocusChargeSeconds", baseSeconds, null);
    },
    manualFocusCapacitySeconds: function(progress, baseSeconds) {
      return effectValue(progress, "gangLeaderManualFocusCapacitySeconds", baseSeconds, null);
    },
    hasExplorationAutoAssign: function(progress) { return hasCapability(progress, "exploratorAutoAssign"); },
    explorationRewardChanceMultiplier: function(progress, jobId, resourceId) {
      return multiplier(progress, "exploratorCannedCatFoodChance", {jobId: jobId, resourceId: resourceId});
    },
    explorationStockPreservationChance: function(progress) {
      return effectValue(progress, "exploratorStockPreservation", 0, null);
    },
    explorationDoubleRewardChance: function(progress) {
      return effectValue(progress, "exploratorDoubleReward", 0, null);
    },
    explorationConditionalTripleChance: function(progress) {
      return effectValue(progress, "exploratorConditionalTriple", 0, null);
    },
    explorationPowerMultiplier: function(progress, jobId) {
      return multiplier(progress, "exploratorPower", {jobId: jobId});
    },
    workGatherOutputMultiplier: function(progress, familyId) {
      return multiplier(progress, "workGatherOutputMultiplier", {familyId: familyId});
    },
    workManagerSpeedMultiplier: function(progress, familyId) {
      return multiplier(progress, "workManagerSpeedMultiplier", {familyId: familyId});
    },
    workRecipeInputTarget: function(progress, familyId, baseTarget) {
      return effectValue(progress, "workRecipeInputTarget", baseTarget, {familyId: familyId});
    },
    workRecipeSlotDelta: function(progress, familyId) {
      return effectValue(progress, "workRecipeSlotDelta", 0, {familyId: familyId});
    },
    assignedCampActionLevelSpeedMultiplier: function(progress, jobId, taskKind, catLevel) {
      return multiplier(progress, "assignedCampActionLevelSpeedMultiplier", {jobId: jobId, taskKind: taskKind, catLevel: catLevel});
    },
    assignedCampActionSpeedMultiplier: function(progress, jobId, taskKind, catLevel, modifiers) {
      const context = {jobId: jobId, taskKind: taskKind, catLevel: catLevel};
      return multiplier(progress, "assignedCampActionSpeedMultiplier", context, modifiers)
        * multiplier(progress, "assignedCampActionLevelSpeedMultiplier", context, modifiers);
    },
    globalCampActionSpeedMultiplier: function(progress, taskKind, modifiers) {
      return multiplier(progress, "globalCampActionSpeedMultiplier", {taskKind: taskKind}, modifiers);
    },
    houseConstructionCostMultiplier: function(progress) {
      return multiplier(progress, "houseConstructionCostMultiplier", null);
    },
    houseCostExponent: function(progress, baseExponent) {
      return effectValue(progress, "houseCostExponentOverride", baseExponent, null);
    },
    demolitionRefundRatio: function(progress, baseRatio) {
      return effectValue(progress, "demolitionRefundRatio", baseRatio, null);
    },
    campTierUnlocked: function(progress, targetTypeId, targetTier) {
      return effectValue(progress, "campTierUnlock", false, {
        targetTypeId: targetTypeId,
        targetTier: targetTier
      });
    }
  });
})(typeof window !== "undefined" ? window : globalThis);
