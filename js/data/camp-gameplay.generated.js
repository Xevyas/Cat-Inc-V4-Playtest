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
  "resources": {
    "cardboardPieces": {
      "name": "Cardboard Pieces",
      "iconId": "resources-cardboard-pieces",
      "family": "wood",
      "storageMode": "recipe-slot",
      "feedable": false,
      "description": "Small patches of cardboard found lying on the ground. Might be useful.",
      "tier": 1,
      "iconPath": "img/resources/Cardboard Pieces_Final.png"
    },
    "cardboardPlanks": {
      "name": "Cardboard Planks",
      "iconId": "resources-cardboard-plank",
      "family": "wood",
      "storageMode": "camp-storage",
      "feedable": false,
      "description": "Sturdy planks pressed from cardboard. The backbone of early construction.",
      "tier": 1,
      "iconPath": "img/resources/Cardboard Plank_Final.png"
    },
    "basicWood": {
      "name": "Basic Wood",
      "iconId": "resources-basic-wood",
      "family": "wood",
      "storageMode": "recipe-slot",
      "feedable": false,
      "description": "Rough wood salvaged from human furniture. Heavier to carry, but sturdier.",
      "tier": 2,
      "iconPath": "img/resources/Basic Wood_Final.png"
    },
    "basicWoodPlanks": {
      "name": "Basic Wood Planks",
      "iconId": "resources-basic-wood-plank",
      "family": "wood",
      "storageMode": "camp-storage",
      "feedable": false,
      "description": "Refined wooden planks, sanded and shaped. A real upgrade from cardboard.",
      "tier": 2,
      "iconPath": "img/resources/Basic Wood Plank_Final.png"
    },
    "catnip": {
      "name": "Catnip",
      "iconId": "resources-catnip",
      "family": "food",
      "storageMode": "recipe-slot",
      "feedable": false,
      "description": "Fresh catnip from the garden. Nutritious, if you're a cat.",
      "tier": 1,
      "iconPath": "img/resources/Catnip_Final.png"
    },
    "salads": {
      "name": "Catnip Salad",
      "iconId": "resources-catnip-salad",
      "family": "food",
      "storageMode": "camp-storage",
      "feedable": true,
      "description": "A balanced catnip salad. Even Bernardo eats his greens.",
      "tier": 1,
      "feedXp": 1,
      "iconPath": "img/resources/Catnip Salad_Final.png"
    },
    "anchovy": {
      "name": "Anchovy",
      "iconId": "resources-anchovy",
      "family": "food",
      "storageMode": "recipe-slot",
      "feedable": false,
      "description": "Fresh anchovies fished from the nearby stream. A cat's favourite.",
      "tier": 2,
      "iconPath": "img/resources/Anchovy_Final.png"
    },
    "grilledAnchovy": {
      "name": "Grilled Anchovy",
      "iconId": "resources-grilled-anchovy",
      "family": "food",
      "storageMode": "camp-storage",
      "feedable": true,
      "description": "Golden, crispy, perfectly grilled. Worth every second of cooking.",
      "tier": 2,
      "feedXp": 10,
      "iconPath": "img/resources/Grilled Anchovy_Final.png"
    },
    "pebbles": {
      "name": "Pebbles",
      "iconId": "resources-pebbles",
      "family": "stone",
      "storageMode": "recipe-slot",
      "feedable": false,
      "description": "Small smooth pebbles gathered from the yard. Heavy pockets, light heart.",
      "tier": 1,
      "iconPath": "img/resources/Pebbles_Final.png"
    },
    "pebbleBricks": {
      "name": "Pebble Bricks",
      "iconId": "resources-pebble-brick",
      "family": "stone",
      "storageMode": "camp-storage",
      "feedable": false,
      "description": "Compact bricks made from compressed pebbles. Surprisingly solid.",
      "tier": 1,
      "iconPath": "img/resources/Pebble Brick_Final.png"
    },
    "rocks": {
      "name": "Rocks",
      "iconId": "resources-rock",
      "family": "stone",
      "storageMode": "recipe-slot",
      "feedable": false,
      "description": "Dense stones hauled from deeper in the yard. Much heavier than pebbles.",
      "tier": 2,
      "iconPath": "img/resources/Rock_Final.png"
    },
    "rockBricks": {
      "name": "Rock Bricks",
      "iconId": "resources-rock-brick",
      "family": "stone",
      "storageMode": "camp-storage",
      "feedable": false,
      "description": "Solid bricks forged from dense rock. Built to last.",
      "tier": 2,
      "iconPath": "img/resources/Rock Brick_Final.png"
    },
    "humanLeftovers": {
      "name": "Human Leftovers",
      "iconId": "resources-human-leftovers",
      "family": "food",
      "storageMode": "camp-storage",
      "feedable": true,
      "description": "Bits and pieces left behind by humans. One human's trash is another cat's treasure.",
      "tier": 1,
      "feedXp": 1,
      "iconPath": "img/resources/Human Leftovers_Final.png"
    },
    "humanWorkersFood": {
      "name": "Workers Food",
      "iconId": "resources-human-workers-food",
      "family": "food",
      "storageMode": "camp-storage",
      "feedable": true,
      "description": "Packed lunches left behind by the construction workers. Still good.",
      "tier": 2,
      "feedXp": 15,
      "iconPath": "img/resources/Human Workers Food_Final.png"
    },
    "cannedCatFood": {
      "name": "Canned Cat Food",
      "iconId": "resources-canned-cat-food",
      "family": "training",
      "storageMode": "global-uncapped",
      "feedable": false,
      "description": "A sealed can of premium cat food found in the supermarket. This is the good stuff.",
      "iconPath": "img/resources/Canned Cat Food_Final.png"
    },
    "smallprey": {
      "name": "Small prey",
      "iconId": "resources-small-prey",
      "family": "food",
      "storageMode": "camp-storage",
      "feedable": true,
      "description": "A small prey",
      "tier": 3,
      "feedXp": 30,
      "iconPath": "img/resources/small-prey.png"
    }
  },
  "workRecipes": {
    "cardboardPlanks": {
      "name": "Cardboard Planks",
      "family": "wood",
      "tier": 1,
      "input": {
        "resourceId": "cardboardPieces",
        "quantity": 10,
        "gatherSecondsPerUnit": 30
      },
      "output": {
        "resourceId": "cardboardPlanks",
        "quantity": 1,
        "processSeconds": 180
      },
      "production": {
        "buildingTypeId": "sawmill",
        "minimumBuildingTier": 1
      },
      "unlockProfile": "wood-tier1"
    },
    "basicWoodPlanks": {
      "name": "Basic Wood Planks",
      "family": "wood",
      "tier": 2,
      "input": {
        "resourceId": "basicWood",
        "quantity": 10,
        "gatherSecondsPerUnit": 300
      },
      "output": {
        "resourceId": "basicWoodPlanks",
        "quantity": 1,
        "processSeconds": 1500
      },
      "production": {
        "buildingTypeId": "sawmill",
        "minimumBuildingTier": 2
      },
      "unlockProfile": "wood-tier2"
    },
    "salads": {
      "name": "Catnip Salad",
      "family": "food",
      "tier": 1,
      "input": {
        "resourceId": "catnip",
        "quantity": 10,
        "gatherSecondsPerUnit": 60
      },
      "output": {
        "resourceId": "salads",
        "quantity": 1,
        "processSeconds": 300
      },
      "production": {
        "buildingTypeId": "catchen",
        "minimumBuildingTier": 1
      },
      "unlockProfile": "food-tier1"
    },
    "grilledAnchovy": {
      "name": "Grilled Anchovy",
      "family": "food",
      "tier": 2,
      "input": {
        "resourceId": "anchovy",
        "quantity": 10,
        "gatherSecondsPerUnit": 600
      },
      "output": {
        "resourceId": "grilledAnchovy",
        "quantity": 1,
        "processSeconds": 3000
      },
      "production": {
        "buildingTypeId": "catchen",
        "minimumBuildingTier": 2
      },
      "unlockProfile": "fishing-guide"
    },
    "pebbleBricks": {
      "name": "Pebble Bricks",
      "family": "stone",
      "tier": 1,
      "input": {
        "resourceId": "pebbles",
        "quantity": 10,
        "gatherSecondsPerUnit": 903
      },
      "output": {
        "resourceId": "pebbleBricks",
        "quantity": 1,
        "processSeconds": 600
      },
      "production": {
        "buildingTypeId": "pawsonry",
        "minimumBuildingTier": 1
      },
      "unlockProfile": "stone-tier1"
    },
    "rockBricks": {
      "name": "Rock Bricks",
      "family": "stone",
      "tier": 2,
      "input": {
        "resourceId": "rocks",
        "quantity": 10,
        "gatherSecondsPerUnit": 900
      },
      "output": {
        "resourceId": "rockBricks",
        "quantity": 1,
        "processSeconds": 4500
      },
      "production": {
        "buildingTypeId": "pawsonry",
        "minimumBuildingTier": 2
      },
      "unlockProfile": "stone-tier2"
    }
  },
  "storageRules": {
    "baseCapacity": 5,
    "resourceIds": [
      "cardboardPlanks",
      "basicWoodPlanks",
      "salads",
      "grilledAnchovy",
      "pebbleBricks",
      "rockBricks",
      "humanLeftovers",
      "humanWorkersFood",
      "smallprey"
    ]
  },
  "campLevelRules": {
    "baseXp": 3,
    "growth": 1.5,
    "levelRewards": [
      {
        "level": 1,
        "rewards": [
          {
            "type": "appeal",
            "amount": 1
          }
        ]
      },
      {
        "level": 2,
        "rewards": [
          {
            "type": "appeal",
            "amount": 1
          }
        ]
      },
      {
        "level": 3,
        "rewards": [
          {
            "type": "unlockCampItem",
            "assetId": "dirt-path"
          }
        ]
      },
      {
        "level": 4,
        "rewards": [
          {
            "type": "appeal",
            "amount": 2
          }
        ]
      },
      {
        "level": 5,
        "rewards": [
          {
            "type": "campActionSpeed",
            "amount": 10
          }
        ]
      },
      {
        "level": 6,
        "rewards": [
          {
            "type": "unlockCampItem",
            "assetId": "pebble-path"
          },
          {
            "type": "appeal",
            "amount": 1
          }
        ]
      },
      {
        "level": 7,
        "rewards": [
          {
            "type": "appeal",
            "amount": 2
          }
        ]
      },
      {
        "level": 8,
        "rewards": [
          {
            "type": "appeal",
            "amount": 2
          }
        ]
      },
      {
        "level": 9,
        "rewards": [
          {
            "type": "unlockCampItem",
            "assetId": "grey-paved-floor"
          }
        ]
      },
      {
        "level": 10,
        "rewards": [
          {
            "type": "campActionSpeed",
            "amount": 10
          }
        ]
      },
      {
        "level": 11,
        "rewards": [
          {
            "type": "appeal",
            "amount": 2
          }
        ]
      },
      {
        "level": 12,
        "rewards": [
          {
            "type": "appeal",
            "amount": 2
          },
          {
            "type": "unlockCampItem",
            "assetId": "stone-paved-path"
          }
        ]
      }
    ]
  },
  "generalRules": {
    "catLeveling": {
      "xpGrowthExponent": 1.7
    },
    "recruitment": {
      "authoredBaseSeconds": {
        "3": 20,
        "4": 60
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
      "baseRatio": 0.25,
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
        "speed": 60
      },
      {
        "cat": 6,
        "required": 3,
        "answerSeconds": 27,
        "targetSize": 51,
        "speed": 60
      },
      {
        "cat": 7,
        "required": 3,
        "answerSeconds": 27,
        "targetSize": 51,
        "speed": 65
      },
      {
        "cat": 8,
        "required": 4,
        "answerSeconds": 27,
        "targetSize": 51,
        "speed": 65
      },
      {
        "cat": 9,
        "required": 4,
        "answerSeconds": 24,
        "targetSize": 51,
        "speed": 70
      },
      {
        "cat": 10,
        "required": 4,
        "answerSeconds": 24,
        "targetSize": 48,
        "speed": 70
      },
      {
        "cat": 11,
        "required": 4,
        "answerSeconds": 24,
        "targetSize": 48,
        "speed": 75
      },
      {
        "cat": 12,
        "required": 4,
        "answerSeconds": 21,
        "targetSize": 48,
        "speed": 75
      },
      {
        "cat": 13,
        "required": 4,
        "answerSeconds": 21,
        "targetSize": 45,
        "speed": 80
      },
      {
        "cat": 14,
        "required": 4,
        "answerSeconds": 21,
        "targetSize": 45,
        "speed": 80
      },
      {
        "cat": 15,
        "required": 5,
        "answerSeconds": 21,
        "targetSize": 45,
        "speed": 85
      },
      {
        "cat": 16,
        "required": 5,
        "answerSeconds": 18,
        "targetSize": 45,
        "speed": 85
      },
      {
        "cat": 17,
        "required": 5,
        "answerSeconds": 18,
        "targetSize": 42,
        "speed": 90
      },
      {
        "cat": 18,
        "required": 5,
        "answerSeconds": 18,
        "targetSize": 42,
        "speed": 90
      },
      {
        "cat": 19,
        "required": 5,
        "answerSeconds": 15,
        "targetSize": 42,
        "speed": 95
      },
      {
        "cat": 20,
        "required": 5,
        "answerSeconds": 15,
        "targetSize": 39,
        "speed": 95
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
  "purchasableContent": {
    "smallFountainBlueprint": {
      "contentType": "inventory-item",
      "name": "Small Fountain Blueprint",
      "description": "Cannelle's plan for a compact stone fountain that brings a little calm to the Camp.",
      "previewAssetId": "small-fountain"
    },
    "cardboardLitterboxBlueprint": {
      "contentType": "inventory-item",
      "name": "Cardboard Litterbox Blueprint",
      "description": "Cannelle's practical plan for a compact cardboard litterbox at the Camp.",
      "previewAssetId": "cardboard-litterbox"
    },
    "birdWhistle": {
      "contentType": "boost-quantity",
      "name": "Bird Whistle",
      "description": "Calls the next Bird event immediately.",
      "iconId": "items-bird-whistle",
      "iconRuntimePath": "img/items/bird-whistle.png"
    },
    "shortcutMap": {
      "contentType": "boost-quantity",
      "name": "Shortcut Map",
      "description": "Exploration Speed ×2 for 10 real-time minutes.",
      "iconId": "items-shortcut-map",
      "iconRuntimePath": "img/items/shortcut-map.png"
    },
    "lanternOnPoleBlueprint": {
      "contentType": "inventory-item",
      "name": "Lantern on pole Blueprint",
      "description": "A blueprint for building Lantern on pole in Camp Decorations.",
      "previewAssetId": "lantern-on-pole"
    },
    "catTreeV2Blueprint": {
      "contentType": "inventory-item",
      "name": "Wood Cat Tree Blueprint",
      "description": "A blueprint for building Wood Cat Tree in Camp Decorations.",
      "previewAssetId": "cat-tree-v2"
    }
  },
  "cannelleShop": {
    "merchandise": [
      {
        "id": "cardboard-litterbox-blueprint",
        "category": "blueprints",
        "contentId": "cardboardLitterboxBlueprint",
        "requiredLevel": 0,
        "priceResource": "cannedCatFood",
        "priceAmount": 1,
        "repeatable": false
      },
      {
        "id": "small-fountain-blueprint",
        "category": "blueprints",
        "contentId": "smallFountainBlueprint",
        "requiredLevel": 0,
        "priceResource": "cannedCatFood",
        "priceAmount": 1,
        "repeatable": false
      },
      {
        "id": "lantern-on-pole-blueprint",
        "category": "blueprints",
        "contentId": "lanternOnPoleBlueprint",
        "requiredLevel": 10,
        "priceResource": "cannedCatFood",
        "priceAmount": 3,
        "repeatable": false
      },
      {
        "id": "bird-whistle",
        "category": "boosts",
        "contentId": "birdWhistle",
        "requiredLevel": 10,
        "priceResource": "cannelleTokens",
        "priceAmount": 3,
        "repeatable": true
      },
      {
        "id": "shortcut-map",
        "category": "boosts",
        "contentId": "shortcutMap",
        "requiredLevel": 10,
        "priceResource": "cannelleTokens",
        "priceAmount": 3,
        "repeatable": true
      },
      {
        "id": "cat-tree-v2-blueprint",
        "category": "blueprints",
        "contentId": "catTreeV2Blueprint",
        "requiredLevel": 20,
        "priceResource": "cannedCatFood",
        "priceAmount": 5,
        "repeatable": false
      }
    ]
  },
  "nayaInn": {
    "stateVersion": 2,
    "maxTierChancePercent": 30,
    "rarityWeights": {
      "common": 80,
      "rare": 15,
      "epic": 4,
      "legendary": 1
    },
    "contracts": {
      "common": {
        "inputAmount": 2,
        "outputAmount": 2
      },
      "rare": {
        "inputAmount": 3,
        "outputAmount": 4
      },
      "epic": {
        "inputAmount": 4,
        "outputAmount": 6
      },
      "legendary": {
        "inputAmount": 5,
        "outputAmount": 8
      }
    },
    "travelers": {
      "helperPower": {
        "common": 5,
        "rare": 10,
        "epic": 15,
        "legendary": 20
      },
      "guideReductionPercent": {
        "common": 5,
        "rare": 10,
        "epic": 15,
        "legendary": 20
      }
    },
    "levelMilestones": [
      {
        "level": 5,
        "kind": "rarity",
        "rarityWeights": {
          "common": 70,
          "rare": 20,
          "epic": 8,
          "legendary": 2
        }
      },
      {
        "level": 10,
        "kind": "effects",
        "contracts": {
          "common": {
            "inputAmount": 3,
            "outputAmount": 3
          },
          "rare": {
            "inputAmount": 4,
            "outputAmount": 6
          },
          "epic": {
            "inputAmount": 5,
            "outputAmount": 8
          },
          "legendary": {
            "inputAmount": 6,
            "outputAmount": 10
          }
        },
        "travelers": {
          "helperPower": {
            "common": 7,
            "rare": 12,
            "epic": 17,
            "legendary": 25
          },
          "guideReductionPercent": {
            "common": 7,
            "rare": 12,
            "epic": 17,
            "legendary": 25
          }
        }
      },
      {
        "level": 15,
        "kind": "tierChance",
        "maxTierChancePercent": 40
      },
      {
        "level": 20,
        "kind": "rarity",
        "rarityWeights": {
          "common": 60,
          "rare": 25,
          "epic": 10,
          "legendary": 5
        }
      },
      {
        "level": 25,
        "kind": "effects",
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
            "outputAmount": 10
          },
          "legendary": {
            "inputAmount": 7,
            "outputAmount": 13
          }
        },
        "travelers": {
          "helperPower": {
            "common": 10,
            "rare": 15,
            "epic": 20,
            "legendary": 30
          },
          "guideReductionPercent": {
            "common": 10,
            "rare": 15,
            "epic": 20,
            "legendary": 30
          }
        }
      },
      {
        "level": 30,
        "kind": "tierChance",
        "maxTierChancePercent": 50
      },
      {
        "level": 35,
        "kind": "rarity",
        "rarityWeights": {
          "common": 45,
          "rare": 35,
          "epic": 15,
          "legendary": 5
        }
      },
      {
        "level": 40,
        "kind": "effects",
        "contracts": {
          "common": {
            "inputAmount": 5,
            "outputAmount": 5
          },
          "rare": {
            "inputAmount": 6,
            "outputAmount": 10
          },
          "epic": {
            "inputAmount": 7,
            "outputAmount": 12
          },
          "legendary": {
            "inputAmount": 8,
            "outputAmount": 16
          }
        },
        "travelers": {
          "helperPower": {
            "common": 15,
            "rare": 20,
            "epic": 25,
            "legendary": 40
          },
          "guideReductionPercent": {
            "common": 15,
            "rare": 20,
            "epic": 25,
            "legendary": 40
          }
        }
      },
      {
        "level": 45,
        "kind": "tierChance",
        "maxTierChancePercent": 65
      },
      {
        "level": 50,
        "kind": "rarity",
        "rarityWeights": {
          "common": 25,
          "rare": 50,
          "epic": 20,
          "legendary": 5
        }
      }
    ]
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
      "description": "A complete beginner's guide to fishing.",
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
          "Kitchen"
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
      "description": "Detailed human blueprints for a compact stone building, with strict instructions on foundations, load-bearing walls, and structural stability. Excessively serious, but apparently very good at keeping a roof where it belongs.",
      "unlocksLabel": "Stone Storage Shed",
      "learningGame": {
        "phraseParts": [
          "A durable stone building depends on firm ",
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
      "simulation": {},
      "build": {
        "entryMode": "repair",
        "durationSeconds": 10,
        "costs": {}
      }
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
      "simulation": {},
      "build": {
        "entryMode": "repair",
        "durationSeconds": 30,
        "costs": {
          "cardboardPlanks": 2
        }
      }
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
      "simulation": {},
      "build": {
        "entryMode": "repair",
        "durationSeconds": 1200,
        "costs": {
          "cardboardPlanks": 5
        }
      }
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
        "kind": "blueprint-learned",
        "itemId": "smallFountainBlueprint"
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
        "kind": "blueprint-learned",
        "itemId": "cardboardLitterboxBlueprint"
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
        "kind": "blueprint-learned",
        "itemId": "lanternOnPoleBlueprint"
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
        "growth": 10,
        "authoredRanks": {
          "1": {
            "basicWoodPlanks": 10
          }
        },
        "rounding": "ceil",
        "refundRate": 0.5,
        "durationGrowth": 5
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
    },
    "catTreeV2": {
      "assetId": "cat-tree-v2",
      "name": "Wood Cat Tree",
      "category": "decoration",
      "repeatable": true,
      "footprint": {
        "width": 1,
        "height": 1
      },
      "unlock": {
        "kind": "blueprint-learned",
        "itemId": "catTreeV2Blueprint"
      },
      "effects": {
        "appeal": 2,
        "campXp": 10
      },
      "upgradeTiers": {},
      "simulation": {
        "ranks": 12
      },
      "build": {
        "entryMode": "build",
        "durationSeconds": 5400
      },
      "law": {
        "family": "cat-tree-v2",
        "baseCosts": {
          "basicWoodPlanks": 5
        },
        "growth": 10,
        "authoredRanks": {
          "1": {
            "basicWoodPlanks": 5
          }
        },
        "rounding": "ceil",
        "refundRate": 0.5,
        "durationGrowth": 5
      }
    }
  }
});
})(typeof window !== "undefined" ? window : globalThis);
