(function(root) {
  "use strict";
  const CatInc = root.CatInc = root.CatInc || {};
  CatInc.data = CatInc.data || {};
  function deepFreeze(value) {
    if (!value || typeof value !== "object" || Object.isFrozen(value)) return value;
    Object.keys(value).forEach(function(key) { deepFreeze(value[key]); });
    return Object.freeze(value);
  }
  CatInc.data.campTemplates = deepFreeze({
  "schemaVersion": 1,
  "activeTemplateId": "base-camp",
  "templates": {
    "base-camp": {
      "id": "base-camp",
      "name": "Base Camp",
      "terrainVersion": 4,
      "grid": {
        "width": 18,
        "height": 12,
        "houseDecorHeight": 4
      },
      "defaultTerrainTypeId": "grass",
      "terrainTypes": [
        {
          "id": "grass",
          "label": "Stylized Grass",
          "variantSalt": 2179038169,
          "baseTile": {
            "id": "grassV1Base",
            "path": "img/Maps/Camp Runtime/Terrain/grass/base.png"
          },
          "detailOverlays": [
            {
              "id": "grassV1DetailA",
              "path": "img/Maps/Camp Runtime/Terrain/grass/detail-1.png"
            },
            {
              "id": "grassV1DetailB",
              "path": "img/Maps/Camp Runtime/Terrain/grass/detail-2.png"
            },
            {
              "id": "grassV1DetailC",
              "path": "img/Maps/Camp Runtime/Terrain/grass/detail-3.png"
            },
            {
              "id": "grassV1DetailD",
              "path": "img/Maps/Camp Runtime/Terrain/grass/detail-4.png"
            },
            {
              "id": "grassV1DetailE",
              "path": "img/Maps/Camp Runtime/Terrain/grass/detail-5.png"
            },
            {
              "id": "grassV1DetailF",
              "path": "img/Maps/Camp Runtime/Terrain/grass/detail-6.png"
            }
          ]
        }
      ],
      "initialBuildableRect": {
        "x": 6,
        "y": 4,
        "width": 6,
        "height": 3
      },
      "zones": [
        {
          "id": "redGarden",
          "label": "Red house garden",
          "x": 0,
          "y": 4,
          "width": 6,
          "height": 8,
          "initial": false
        },
        {
          "id": "home",
          "label": "Blue house garden",
          "x": 6,
          "y": 4,
          "width": 6,
          "height": 8,
          "initial": true
        },
        {
          "id": "greenGarden",
          "label": "Green house garden",
          "x": 12,
          "y": 4,
          "width": 6,
          "height": 8,
          "initial": false
        }
      ],
      "territoryAccessSites": [
        {
          "id": "garden-access-redGarden",
          "label": "West garden passage",
          "actionLabel": "Open the west garden passage",
          "explorationId": "C1",
          "fromZoneId": "home",
          "toZoneId": "redGarden",
          "costs": {
            "basicWoodPlanks": 10,
            "pebbleBricks": 5
          },
          "durationSeconds": 3600,
          "requiredCats": 2,
          "minCatLevel": 1,
          "position": {
            "x": 6,
            "y": 7,
            "side": "west"
          }
        },
        {
          "id": "garden-access-greenGarden",
          "label": "East garden passage",
          "actionLabel": "Open the east garden passage",
          "explorationId": "E1",
          "fromZoneId": "home",
          "toZoneId": "greenGarden",
          "costs": {
            "rockBricks": 50,
            "basicWoodPlanks": 100
          },
          "durationSeconds": 18000,
          "requiredCats": 2,
          "minCatLevel": 10,
          "position": {
            "x": 11,
            "y": 7,
            "side": "east"
          }
        }
      ],
      "connectionOriginCells": [
        {
          "x": 6,
          "y": 4
        },
        {
          "x": 7,
          "y": 4
        },
        {
          "x": 8,
          "y": 4
        },
        {
          "x": 9,
          "y": 4
        },
        {
          "x": 10,
          "y": 4
        },
        {
          "x": 11,
          "y": 4
        }
      ],
      "initialClearedCells": [
        "6:4",
        "7:4",
        "8:4",
        "9:4",
        "10:4",
        "11:4",
        "6:5",
        "7:5",
        "8:5",
        "9:5",
        "10:5",
        "11:5",
        "11:7",
        "8:8",
        "9:8",
        "11:8",
        "6:10",
        "7:10",
        "6:11",
        "7:11"
      ],
      "terrainPlacements": [
        {
          "uid": "home:6:4",
          "typeId": "tallGrass",
          "x": 9,
          "y": 7,
          "zoneId": "home"
        },
        {
          "uid": "home:7:4",
          "typeId": "tallGrass",
          "x": 8,
          "y": 7,
          "zoneId": "home"
        },
        {
          "uid": "home:6:5",
          "typeId": "tallGrass",
          "x": 7,
          "y": 6,
          "zoneId": "home"
        },
        {
          "uid": "home:6:6",
          "typeId": "tallGrass",
          "x": 6,
          "y": 7,
          "zoneId": "home"
        },
        {
          "uid": "home:7:6",
          "typeId": "pebblePile",
          "x": 10,
          "y": 7,
          "zoneId": "home",
          "reward": {
            "resourceId": "cardboardPlanks",
            "quantity": 1,
            "oneShot": true
          }
        },
        {
          "uid": "home:7:7",
          "typeId": "pebblePile",
          "x": 7,
          "y": 7,
          "zoneId": "home"
        },
        {
          "uid": "home:10:7",
          "typeId": "pebblePile",
          "x": 8,
          "y": 6,
          "zoneId": "home",
          "reward": {
            "resourceId": "cardboardPlanks",
            "quantity": 1,
            "oneShot": true
          }
        },
        {
          "uid": "home:6:8",
          "typeId": "greenBush",
          "x": 6,
          "y": 8,
          "zoneId": "home"
        },
        {
          "uid": "home:10:8",
          "typeId": "tallGrass",
          "x": 10,
          "y": 8,
          "zoneId": "home"
        },
        {
          "uid": "redGarden:0:4",
          "typeId": "stoneBlockPile",
          "x": 0,
          "y": 4,
          "zoneId": "redGarden"
        },
        {
          "uid": "redGarden:2:4",
          "typeId": "flowerBush",
          "x": 2,
          "y": 4,
          "zoneId": "redGarden"
        },
        {
          "uid": "redGarden:4:4",
          "typeId": "greenBush",
          "x": 4,
          "y": 4,
          "zoneId": "redGarden"
        },
        {
          "uid": "redGarden:2:5",
          "typeId": "pebblePile",
          "x": 2,
          "y": 5,
          "zoneId": "redGarden"
        },
        {
          "uid": "redGarden:3:5",
          "typeId": "flowerBush",
          "x": 3,
          "y": 5,
          "zoneId": "redGarden"
        },
        {
          "uid": "redGarden:5:5",
          "typeId": "pebblePile",
          "x": 5,
          "y": 5,
          "zoneId": "redGarden"
        },
        {
          "uid": "redGarden:0:6",
          "typeId": "greenBush",
          "x": 0,
          "y": 6,
          "zoneId": "redGarden"
        },
        {
          "uid": "redGarden:2:6",
          "typeId": "stoneBlockPile",
          "x": 2,
          "y": 6,
          "zoneId": "redGarden"
        },
        {
          "uid": "redGarden:4:6",
          "typeId": "flowerBush",
          "x": 4,
          "y": 6,
          "zoneId": "redGarden"
        },
        {
          "uid": "redGarden:0:7",
          "typeId": "thornBush",
          "x": 0,
          "y": 7,
          "zoneId": "redGarden"
        },
        {
          "uid": "redGarden:4:7",
          "typeId": "pebblePile",
          "x": 4,
          "y": 7,
          "zoneId": "redGarden"
        },
        {
          "uid": "redGarden:5:7",
          "typeId": "pebblePile",
          "x": 5,
          "y": 7,
          "zoneId": "redGarden"
        },
        {
          "uid": "redGarden:0:8",
          "typeId": "flowerBush",
          "x": 0,
          "y": 8,
          "zoneId": "redGarden"
        },
        {
          "uid": "redGarden:2:8",
          "typeId": "greenBush",
          "x": 2,
          "y": 8,
          "zoneId": "redGarden"
        },
        {
          "uid": "redGarden:4:8",
          "typeId": "stoneBlockPile",
          "x": 4,
          "y": 8,
          "zoneId": "redGarden"
        },
        {
          "uid": "redGarden:0:9",
          "typeId": "pebblePile",
          "x": 0,
          "y": 9,
          "zoneId": "redGarden"
        },
        {
          "uid": "redGarden:1:9",
          "typeId": "flowerBush",
          "x": 1,
          "y": 9,
          "zoneId": "redGarden"
        },
        {
          "uid": "redGarden:3:9",
          "typeId": "pebblePile",
          "x": 3,
          "y": 9,
          "zoneId": "redGarden"
        },
        {
          "uid": "redGarden:0:10",
          "typeId": "stoneBlockPile",
          "x": 0,
          "y": 10,
          "zoneId": "redGarden"
        },
        {
          "uid": "redGarden:2:10",
          "typeId": "flowerBush",
          "x": 2,
          "y": 10,
          "zoneId": "redGarden"
        },
        {
          "uid": "redGarden:4:10",
          "typeId": "greenBush",
          "x": 4,
          "y": 10,
          "zoneId": "redGarden"
        },
        {
          "uid": "redGarden:2:11",
          "typeId": "pebblePile",
          "x": 2,
          "y": 11,
          "zoneId": "redGarden"
        },
        {
          "uid": "redGarden:3:11",
          "typeId": "flowerBush",
          "x": 3,
          "y": 11,
          "zoneId": "redGarden"
        },
        {
          "uid": "redGarden:5:11",
          "typeId": "pebblePile",
          "x": 5,
          "y": 11,
          "zoneId": "redGarden"
        },
        {
          "uid": "greenGarden:12:4",
          "typeId": "tallGrass",
          "x": 12,
          "y": 4,
          "zoneId": "greenGarden"
        },
        {
          "uid": "greenGarden:13:4",
          "typeId": "stoneBlockPile",
          "x": 13,
          "y": 4,
          "zoneId": "greenGarden"
        },
        {
          "uid": "greenGarden:15:4",
          "typeId": "flowerBush",
          "x": 15,
          "y": 4,
          "zoneId": "greenGarden"
        },
        {
          "uid": "greenGarden:17:4",
          "typeId": "pebblePile",
          "x": 17,
          "y": 4,
          "zoneId": "greenGarden"
        },
        {
          "uid": "greenGarden:12:5",
          "typeId": "pebblePile",
          "x": 12,
          "y": 5,
          "zoneId": "greenGarden"
        },
        {
          "uid": "greenGarden:15:5",
          "typeId": "pebblePile",
          "x": 15,
          "y": 5,
          "zoneId": "greenGarden"
        },
        {
          "uid": "greenGarden:16:5",
          "typeId": "flowerBush",
          "x": 16,
          "y": 5,
          "zoneId": "greenGarden"
        },
        {
          "uid": "greenGarden:12:6",
          "typeId": "thornBush",
          "x": 12,
          "y": 6,
          "zoneId": "greenGarden"
        },
        {
          "uid": "greenGarden:14:6",
          "typeId": "tallGrass",
          "x": 14,
          "y": 6,
          "zoneId": "greenGarden"
        },
        {
          "uid": "greenGarden:15:6",
          "typeId": "stoneBlockPile",
          "x": 15,
          "y": 6,
          "zoneId": "greenGarden"
        },
        {
          "uid": "greenGarden:17:6",
          "typeId": "pebblePile",
          "x": 17,
          "y": 6,
          "zoneId": "greenGarden"
        },
        {
          "uid": "greenGarden:12:7",
          "typeId": "flowerBush",
          "x": 12,
          "y": 7,
          "zoneId": "greenGarden"
        },
        {
          "uid": "greenGarden:14:7",
          "typeId": "pebblePile",
          "x": 14,
          "y": 7,
          "zoneId": "greenGarden"
        },
        {
          "uid": "greenGarden:17:7",
          "typeId": "pebblePile",
          "x": 17,
          "y": 7,
          "zoneId": "greenGarden"
        },
        {
          "uid": "greenGarden:12:8",
          "typeId": "pebblePile",
          "x": 12,
          "y": 8,
          "zoneId": "greenGarden"
        },
        {
          "uid": "greenGarden:13:8",
          "typeId": "flowerBush",
          "x": 13,
          "y": 8,
          "zoneId": "greenGarden"
        },
        {
          "uid": "greenGarden:15:8",
          "typeId": "greenBush",
          "x": 15,
          "y": 8,
          "zoneId": "greenGarden"
        },
        {
          "uid": "greenGarden:17:8",
          "typeId": "tallGrass",
          "x": 17,
          "y": 8,
          "zoneId": "greenGarden"
        },
        {
          "uid": "greenGarden:12:9",
          "typeId": "stoneBlockPile",
          "x": 12,
          "y": 9,
          "zoneId": "greenGarden"
        },
        {
          "uid": "greenGarden:14:9",
          "typeId": "flowerBush",
          "x": 14,
          "y": 9,
          "zoneId": "greenGarden"
        },
        {
          "uid": "greenGarden:16:9",
          "typeId": "greenBush",
          "x": 16,
          "y": 9,
          "zoneId": "greenGarden"
        },
        {
          "uid": "greenGarden:14:10",
          "typeId": "pebblePile",
          "x": 14,
          "y": 10,
          "zoneId": "greenGarden"
        },
        {
          "uid": "greenGarden:15:10",
          "typeId": "flowerBush",
          "x": 15,
          "y": 10,
          "zoneId": "greenGarden"
        },
        {
          "uid": "greenGarden:17:10",
          "typeId": "pebblePile",
          "x": 17,
          "y": 10,
          "zoneId": "greenGarden"
        },
        {
          "uid": "greenGarden:12:11",
          "typeId": "greenBush",
          "x": 12,
          "y": 11,
          "zoneId": "greenGarden"
        },
        {
          "uid": "greenGarden:14:11",
          "typeId": "tallGrass",
          "x": 14,
          "y": 11,
          "zoneId": "greenGarden"
        },
        {
          "uid": "greenGarden:15:11",
          "typeId": "pebblePile",
          "x": 15,
          "y": 11,
          "zoneId": "greenGarden"
        },
        {
          "uid": "greenGarden:16:11",
          "typeId": "flowerBush",
          "x": 16,
          "y": 11,
          "zoneId": "greenGarden"
        },
        {
          "uid": "home:8:6",
          "typeId": "tallGrass",
          "x": 6,
          "y": 6,
          "zoneId": "home"
        },
        {
          "uid": "home:9:6",
          "typeId": "tallGrass",
          "x": 9,
          "y": 6,
          "zoneId": "home"
        },
        {
          "uid": "home:10:6",
          "typeId": "tallGrass",
          "x": 10,
          "y": 6,
          "zoneId": "home"
        },
        {
          "uid": "home:11:6",
          "typeId": "tallGrass",
          "x": 11,
          "y": 6,
          "zoneId": "home"
        },
        {
          "uid": "home:8:11",
          "typeId": "flowerBush",
          "x": 8,
          "y": 11,
          "zoneId": "home"
        },
        {
          "uid": "home:9:10",
          "typeId": "tallGrass",
          "x": 9,
          "y": 10,
          "zoneId": "home"
        },
        {
          "uid": "home:8:10",
          "typeId": "pebblePile",
          "x": 8,
          "y": 10,
          "zoneId": "home"
        },
        {
          "uid": "home:6:9",
          "typeId": "tallGrass",
          "x": 6,
          "y": 9,
          "zoneId": "home"
        },
        {
          "uid": "home:7:9",
          "typeId": "tallGrass",
          "x": 7,
          "y": 9,
          "zoneId": "home"
        },
        {
          "uid": "home:8:9",
          "typeId": "greenBush",
          "x": 8,
          "y": 9,
          "zoneId": "home"
        },
        {
          "uid": "home:10:9",
          "typeId": "greenBush",
          "x": 10,
          "y": 9,
          "zoneId": "home"
        },
        {
          "uid": "home:10:11",
          "typeId": "flowerBush",
          "x": 10,
          "y": 11,
          "zoneId": "home",
          "reward": {
            "resourceId": "basicWoodPlanks",
            "quantity": 1,
            "oneShot": true
          }
        },
        {
          "uid": "home:10:10",
          "typeId": "pebblePile",
          "x": 10,
          "y": 10,
          "zoneId": "home"
        },
        {
          "uid": "home:11:10",
          "typeId": "pebblePile",
          "x": 11,
          "y": 10,
          "zoneId": "home"
        }
      ],
      "initialItems": [
        {
          "uid": "camp-initial-sawmill",
          "typeId": "sawmill",
          "x": 10,
          "y": 4,
          "rotation": 0,
          "tier": 1
        },
        {
          "uid": "camp-initial-catchen",
          "typeId": "catchen",
          "x": 11,
          "y": 7,
          "rotation": 270,
          "tier": 1
        },
        {
          "uid": "camp-initial-pawsonry",
          "typeId": "pawsonry",
          "x": 6,
          "y": 10,
          "rotation": 90,
          "tier": 1
        },
        {
          "uid": "camp-initial-tree-2",
          "typeId": "tree",
          "x": 6,
          "y": 4,
          "rotation": 0,
          "tier": 1
        },
        {
          "uid": "camp-initial-operationsTable",
          "typeId": "operationsTable",
          "x": 8,
          "y": 8,
          "rotation": 180,
          "tier": 1
        }
      ]
    }
  }
});
})(typeof window !== "undefined" ? window : globalThis);
