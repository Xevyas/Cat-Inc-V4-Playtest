(function(root) {
  "use strict";
  const CatInc = root.CatInc = root.CatInc || {};
  CatInc.data = CatInc.data || {};
  function deepFreeze(value) {
    if (!value || typeof value !== "object" || Object.isFrozen(value)) return value;
    Object.keys(value).forEach(function(key) { deepFreeze(value[key]); });
    return Object.freeze(value);
  }
  CatInc.data.campAssets = deepFreeze({
  "schemaVersion": 1,
  "assets": {
    "cardboardBox": {
      "assetId": "cardboard-box",
      "runtimeId": "cardboardBox",
      "name": "Cardboard Box",
      "category": "house",
      "placeable": true,
      "tiers": {
        "1": {
          "liveRevision": 6,
          "revisions": {
            "5": {
              "assetId": "cardboard-box",
              "runtimeId": "cardboardBox",
              "name": "Cardboard Box",
              "category": "house",
              "placeable": true,
              "tier": 1,
              "revision": 5,
              "status": "retired",
              "width": 1,
              "height": 1,
              "sprites": {
                "down": "tools/camp_asset_studio/library/assets/cardboard-box/tier-1/revision-5/down.png",
                "right": "tools/camp_asset_studio/library/assets/cardboard-box/tier-1/revision-5/right.png",
                "up": "tools/camp_asset_studio/library/assets/cardboard-box/tier-1/revision-5/up.png",
                "left": "tools/camp_asset_studio/library/assets/cardboard-box/tier-1/revision-5/left.png"
              },
              "spriteBounds": {
                "down": {
                  "canvasWidth": 360,
                  "canvasHeight": 360,
                  "left": 50,
                  "top": 78,
                  "right": 310,
                  "bottom": 333
                },
                "right": {
                  "canvasWidth": 360,
                  "canvasHeight": 360,
                  "left": 39,
                  "top": 24,
                  "right": 320,
                  "bottom": 329
                },
                "up": {
                  "canvasWidth": 360,
                  "canvasHeight": 360,
                  "left": 50,
                  "top": 71,
                  "right": 310,
                  "bottom": 329
                },
                "left": {
                  "canvasWidth": 360,
                  "canvasHeight": 360,
                  "left": 40,
                  "top": 23,
                  "right": 320,
                  "bottom": 329
                }
              },
              "access": {
                "activationPolicy": "all-ports-reachable",
                "ports": [
                  {
                    "id": "access-1",
                    "side": "south",
                    "cellPolicy": "all-cells-reachable",
                    "approachCells": [
                      {
                        "x": 0,
                        "y": 1
                      }
                    ],
                    "minimumReachableCells": 1
                  }
                ]
              }
            },
            "6": {
              "assetId": "cardboard-box",
              "runtimeId": "cardboardBox",
              "name": "Cardboard Box",
              "category": "house",
              "placeable": true,
              "tier": 1,
              "revision": 6,
              "status": "live",
              "width": 1,
              "height": 1,
              "sprites": {
                "down": "img/Buildings/Camp Runtime/cardboard-box/tier-1/revision-6/down.png",
                "right": "img/Buildings/Camp Runtime/cardboard-box/tier-1/revision-6/right.png",
                "up": "img/Buildings/Camp Runtime/cardboard-box/tier-1/revision-6/up.png",
                "left": "img/Buildings/Camp Runtime/cardboard-box/tier-1/revision-6/left.png"
              },
              "spriteBounds": {
                "down": {
                  "canvasWidth": 360,
                  "canvasHeight": 360,
                  "left": 49,
                  "top": 77,
                  "right": 310,
                  "bottom": 333
                },
                "right": {
                  "canvasWidth": 360,
                  "canvasHeight": 360,
                  "left": 38,
                  "top": 23,
                  "right": 321,
                  "bottom": 330
                },
                "up": {
                  "canvasWidth": 360,
                  "canvasHeight": 360,
                  "left": 49,
                  "top": 77,
                  "right": 311,
                  "bottom": 330
                },
                "left": {
                  "canvasWidth": 360,
                  "canvasHeight": 360,
                  "left": 39,
                  "top": 23,
                  "right": 321,
                  "bottom": 330
                }
              },
              "access": {
                "activationPolicy": "all-ports-reachable",
                "ports": [
                  {
                    "id": "access-1",
                    "side": "south",
                    "cellPolicy": "all-cells-reachable",
                    "approachCells": [
                      {
                        "x": 0,
                        "y": 1
                      }
                    ],
                    "minimumReachableCells": 1
                  }
                ]
              }
            }
          }
        }
      }
    },
    "catStatueV2": {
      "assetId": "cat-statue-v2",
      "runtimeId": "catStatueV2",
      "name": "Cat Statue",
      "category": "decoration",
      "placeable": true,
      "tiers": {
        "1": {
          "liveRevision": 1,
          "revisions": {
            "1": {
              "assetId": "cat-statue-v2",
              "runtimeId": "catStatueV2",
              "name": "Cat Statue",
              "category": "decoration",
              "placeable": true,
              "tier": 1,
              "revision": 1,
              "status": "live",
              "width": 1,
              "height": 1,
              "sprites": {
                "down": "img/Buildings/Camp Runtime/cat-statue-v2/tier-1/revision-1/down.png",
                "right": "img/Buildings/Camp Runtime/cat-statue-v2/tier-1/revision-1/right.png",
                "up": "img/Buildings/Camp Runtime/cat-statue-v2/tier-1/revision-1/up.png",
                "left": "img/Buildings/Camp Runtime/cat-statue-v2/tier-1/revision-1/left.png"
              },
              "spriteBounds": {
                "down": {
                  "canvasWidth": 420,
                  "canvasHeight": 420,
                  "left": 88,
                  "top": 120,
                  "right": 410,
                  "bottom": 412
                },
                "right": {
                  "canvasWidth": 420,
                  "canvasHeight": 420,
                  "left": 101,
                  "top": 115,
                  "right": 331,
                  "bottom": 420
                },
                "up": {
                  "canvasWidth": 420,
                  "canvasHeight": 420,
                  "left": 17,
                  "top": 56,
                  "right": 333,
                  "bottom": 412
                },
                "left": {
                  "canvasWidth": 420,
                  "canvasHeight": 420,
                  "left": 90,
                  "top": 18,
                  "right": 319,
                  "bottom": 420
                }
              }
            }
          }
        }
      }
    },
    "catchen": {
      "assetId": "catchen",
      "runtimeId": "catchen",
      "name": "Catchen",
      "category": "production-building",
      "placeable": true,
      "tiers": {
        "1": {
          "liveRevision": 4,
          "revisions": {
            "3": {
              "assetId": "catchen",
              "runtimeId": "catchen",
              "name": "Catchen",
              "category": "production-building",
              "placeable": true,
              "tier": 1,
              "revision": 3,
              "status": "retired",
              "width": 3,
              "height": 3,
              "sprites": {
                "down": "tools/camp_asset_studio/library/assets/catchen/tier-1/revision-3/down.png",
                "right": "tools/camp_asset_studio/library/assets/catchen/tier-1/revision-3/right.png",
                "up": "tools/camp_asset_studio/library/assets/catchen/tier-1/revision-3/up.png",
                "left": "tools/camp_asset_studio/library/assets/catchen/tier-1/revision-3/left.png"
              },
              "spriteBounds": {
                "down": {
                  "canvasWidth": 600,
                  "canvasHeight": 600,
                  "left": 82,
                  "top": 67,
                  "right": 517,
                  "bottom": 522
                },
                "right": {
                  "canvasWidth": 600,
                  "canvasHeight": 600,
                  "left": 78,
                  "top": 82,
                  "right": 533,
                  "bottom": 517
                },
                "up": {
                  "canvasWidth": 600,
                  "canvasHeight": 600,
                  "left": 83,
                  "top": 78,
                  "right": 518,
                  "bottom": 533
                },
                "left": {
                  "canvasWidth": 600,
                  "canvasHeight": 600,
                  "left": 67,
                  "top": 83,
                  "right": 522,
                  "bottom": 518
                }
              }
            },
            "4": {
              "assetId": "catchen",
              "runtimeId": "catchen",
              "name": "Catchen",
              "category": "production-building",
              "placeable": true,
              "tier": 1,
              "revision": 4,
              "status": "live",
              "width": 2,
              "height": 1,
              "sprites": {
                "down": "img/Buildings/Camp Runtime/catchen/tier-1/revision-4/down.png",
                "right": "img/Buildings/Camp Runtime/catchen/tier-1/revision-4/right.png",
                "up": "img/Buildings/Camp Runtime/catchen/tier-1/revision-4/up.png",
                "left": "img/Buildings/Camp Runtime/catchen/tier-1/revision-4/left.png"
              },
              "spriteBounds": {
                "down": {
                  "canvasWidth": 640,
                  "canvasHeight": 320,
                  "left": 69,
                  "top": 23,
                  "right": 572,
                  "bottom": 299
                },
                "right": {
                  "canvasWidth": 320,
                  "canvasHeight": 640,
                  "left": 48,
                  "top": 107,
                  "right": 271,
                  "bottom": 562
                },
                "up": {
                  "canvasWidth": 640,
                  "canvasHeight": 320,
                  "left": 68,
                  "top": 47,
                  "right": 571,
                  "bottom": 299
                },
                "left": {
                  "canvasWidth": 320,
                  "canvasHeight": 640,
                  "left": 48,
                  "top": 93,
                  "right": 271,
                  "bottom": 563
                }
              }
            }
          }
        }
      }
    },
    "pawsonry": {
      "assetId": "pawsonry",
      "runtimeId": "pawsonry",
      "name": "Pawsonry",
      "category": "production-building",
      "placeable": true,
      "tiers": {
        "1": {
          "liveRevision": 4,
          "revisions": {
            "3": {
              "assetId": "pawsonry",
              "runtimeId": "pawsonry",
              "name": "Pawsonry",
              "category": "production-building",
              "placeable": true,
              "tier": 1,
              "revision": 3,
              "status": "retired",
              "width": 3,
              "height": 3,
              "sprites": {
                "down": "tools/camp_asset_studio/library/assets/pawsonry/tier-1/revision-3/down.png",
                "right": "tools/camp_asset_studio/library/assets/pawsonry/tier-1/revision-3/right.png",
                "up": "tools/camp_asset_studio/library/assets/pawsonry/tier-1/revision-3/up.png",
                "left": "tools/camp_asset_studio/library/assets/pawsonry/tier-1/revision-3/left.png"
              },
              "spriteBounds": {
                "down": {
                  "canvasWidth": 600,
                  "canvasHeight": 600,
                  "left": 76,
                  "top": 65,
                  "right": 524,
                  "bottom": 529
                },
                "right": {
                  "canvasWidth": 600,
                  "canvasHeight": 600,
                  "left": 71,
                  "top": 76,
                  "right": 535,
                  "bottom": 524
                },
                "up": {
                  "canvasWidth": 600,
                  "canvasHeight": 600,
                  "left": 76,
                  "top": 71,
                  "right": 524,
                  "bottom": 535
                },
                "left": {
                  "canvasWidth": 600,
                  "canvasHeight": 600,
                  "left": 65,
                  "top": 76,
                  "right": 529,
                  "bottom": 524
                }
              }
            },
            "4": {
              "assetId": "pawsonry",
              "runtimeId": "pawsonry",
              "name": "Pawsonry",
              "category": "production-building",
              "placeable": true,
              "tier": 1,
              "revision": 4,
              "status": "live",
              "width": 2,
              "height": 2,
              "sprites": {
                "down": "img/Buildings/Camp Runtime/pawsonry/tier-1/revision-4/down.png",
                "right": "img/Buildings/Camp Runtime/pawsonry/tier-1/revision-4/right.png",
                "up": "img/Buildings/Camp Runtime/pawsonry/tier-1/revision-4/up.png",
                "left": "img/Buildings/Camp Runtime/pawsonry/tier-1/revision-4/left.png"
              },
              "spriteBounds": {
                "down": {
                  "canvasWidth": 640,
                  "canvasHeight": 640,
                  "left": 77,
                  "top": 153,
                  "right": 596,
                  "bottom": 507
                },
                "right": {
                  "canvasWidth": 640,
                  "canvasHeight": 640,
                  "left": 35,
                  "top": 126,
                  "right": 481,
                  "bottom": 542
                },
                "up": {
                  "canvasWidth": 640,
                  "canvasHeight": 640,
                  "left": 53,
                  "top": 179,
                  "right": 559,
                  "bottom": 605
                },
                "left": {
                  "canvasWidth": 640,
                  "canvasHeight": 640,
                  "left": 142,
                  "top": 121,
                  "right": 600,
                  "bottom": 593
                }
              },
              "access": {
                "activationPolicy": "all-ports-reachable",
                "ports": [
                  {
                    "id": "access-1",
                    "side": "south",
                    "cellPolicy": "any-cell-reachable",
                    "approachCells": [
                      {
                        "x": 0,
                        "y": 2
                      },
                      {
                        "x": 1,
                        "y": 2
                      }
                    ],
                    "minimumReachableCells": 1
                  }
                ]
              }
            }
          }
        }
      }
    },
    "sawmill": {
      "assetId": "sawmill",
      "runtimeId": "sawmill",
      "name": "Sawmill",
      "category": "production-building",
      "placeable": true,
      "tiers": {
        "1": {
          "liveRevision": 3,
          "revisions": {
            "2": {
              "assetId": "sawmill",
              "runtimeId": "sawmill",
              "name": "Sawmill",
              "category": "production-building",
              "placeable": true,
              "tier": 1,
              "revision": 2,
              "status": "retired",
              "width": 3,
              "height": 2,
              "sprites": {
                "down": "tools/camp_asset_studio/library/assets/sawmill/tier-1/revision-2/down.png",
                "right": "tools/camp_asset_studio/library/assets/sawmill/tier-1/revision-2/right.png",
                "up": "tools/camp_asset_studio/library/assets/sawmill/tier-1/revision-2/up.png",
                "left": "tools/camp_asset_studio/library/assets/sawmill/tier-1/revision-2/left.png"
              },
              "spriteBounds": {
                "down": {
                  "canvasWidth": 600,
                  "canvasHeight": 400,
                  "left": 82,
                  "top": 49,
                  "right": 525,
                  "bottom": 331
                },
                "right": {
                  "canvasWidth": 400,
                  "canvasHeight": 600,
                  "left": 69,
                  "top": 82,
                  "right": 351,
                  "bottom": 525
                },
                "up": {
                  "canvasWidth": 600,
                  "canvasHeight": 400,
                  "left": 75,
                  "top": 69,
                  "right": 518,
                  "bottom": 351
                },
                "left": {
                  "canvasWidth": 400,
                  "canvasHeight": 600,
                  "left": 49,
                  "top": 75,
                  "right": 331,
                  "bottom": 518
                }
              }
            },
            "3": {
              "assetId": "sawmill",
              "runtimeId": "sawmill",
              "name": "Sawmill",
              "category": "production-building",
              "placeable": true,
              "tier": 1,
              "revision": 3,
              "status": "live",
              "width": 2,
              "height": 1,
              "sprites": {
                "down": "img/Buildings/Camp Runtime/sawmill/tier-1/revision-3/down.png",
                "right": "img/Buildings/Camp Runtime/sawmill/tier-1/revision-3/right.png",
                "up": "img/Buildings/Camp Runtime/sawmill/tier-1/revision-3/up.png",
                "left": "img/Buildings/Camp Runtime/sawmill/tier-1/revision-3/left.png"
              },
              "spriteBounds": {
                "down": {
                  "canvasWidth": 640,
                  "canvasHeight": 320,
                  "left": 63,
                  "top": 11,
                  "right": 578,
                  "bottom": 302
                },
                "right": {
                  "canvasWidth": 320,
                  "canvasHeight": 640,
                  "left": 48,
                  "top": 105,
                  "right": 270,
                  "bottom": 569
                },
                "up": {
                  "canvasWidth": 640,
                  "canvasHeight": 320,
                  "left": 62,
                  "top": 50,
                  "right": 577,
                  "bottom": 301
                },
                "left": {
                  "canvasWidth": 320,
                  "canvasHeight": 640,
                  "left": 49,
                  "top": 70,
                  "right": 271,
                  "bottom": 569
                }
              },
              "access": {
                "activationPolicy": "all-ports-reachable",
                "ports": [
                  {
                    "id": "access-1",
                    "side": "south",
                    "cellPolicy": "any-cell-reachable",
                    "approachCells": [
                      {
                        "x": 0,
                        "y": 1
                      },
                      {
                        "x": 1,
                        "y": 1
                      }
                    ],
                    "minimumReachableCells": 1
                  }
                ]
              }
            }
          }
        },
        "2": {
          "liveRevision": null,
          "revisions": {
            "1": {
              "assetId": "sawmill",
              "runtimeId": "sawmill",
              "name": "Sawmill",
              "category": "production-building",
              "placeable": true,
              "tier": 2,
              "revision": 1,
              "status": "approved",
              "width": 2,
              "height": 1,
              "sprites": {
                "down": "tools/camp_asset_studio/library/assets/sawmill/tier-2/revision-1/down.png",
                "right": "tools/camp_asset_studio/library/assets/sawmill/tier-2/revision-1/right.png",
                "up": "tools/camp_asset_studio/library/assets/sawmill/tier-2/revision-1/up.png",
                "left": "tools/camp_asset_studio/library/assets/sawmill/tier-2/revision-1/left.png"
              },
              "spriteBounds": {
                "down": {
                  "canvasWidth": 640,
                  "canvasHeight": 320,
                  "left": 61,
                  "top": 0,
                  "right": 580,
                  "bottom": 310
                },
                "right": {
                  "canvasWidth": 320,
                  "canvasHeight": 640,
                  "left": 46,
                  "top": 23,
                  "right": 266,
                  "bottom": 579
                },
                "up": {
                  "canvasWidth": 640,
                  "canvasHeight": 320,
                  "left": 60,
                  "top": 1,
                  "right": 579,
                  "bottom": 310
                },
                "left": {
                  "canvasWidth": 320,
                  "canvasHeight": 640,
                  "left": 53,
                  "top": 97,
                  "right": 272,
                  "bottom": 579
                }
              },
              "access": {
                "activationPolicy": "all-ports-reachable",
                "ports": [
                  {
                    "id": "access-1",
                    "side": "south",
                    "cellPolicy": "any-cell-reachable",
                    "approachCells": [
                      {
                        "x": 0,
                        "y": 1
                      },
                      {
                        "x": 1,
                        "y": 1
                      }
                    ],
                    "minimumReachableCells": 1
                  }
                ]
              }
            }
          }
        }
      }
    },
    "smallCatStatue": {
      "assetId": "small-cat-statue",
      "runtimeId": "smallCatStatue",
      "name": "Small cat statue",
      "category": "decoration",
      "placeable": true,
      "tiers": {
        "1": {
          "liveRevision": null,
          "revisions": {
            "1": {
              "assetId": "small-cat-statue",
              "runtimeId": "smallCatStatue",
              "name": "Small cat statue",
              "category": "decoration",
              "placeable": true,
              "tier": 1,
              "revision": 1,
              "status": "retired",
              "width": 1,
              "height": 1,
              "sprites": {
                "down": "tools/camp_asset_studio/library/assets/small-cat-statue/tier-1/revision-1/down.png",
                "right": "tools/camp_asset_studio/library/assets/small-cat-statue/tier-1/revision-1/right.png",
                "up": "tools/camp_asset_studio/library/assets/small-cat-statue/tier-1/revision-1/up.png",
                "left": "tools/camp_asset_studio/library/assets/small-cat-statue/tier-1/revision-1/left.png"
              },
              "spriteBounds": {
                "down": {
                  "canvasWidth": 420,
                  "canvasHeight": 420,
                  "left": 102,
                  "top": 70,
                  "right": 334,
                  "bottom": 395
                },
                "right": {
                  "canvasWidth": 420,
                  "canvasHeight": 420,
                  "left": 96,
                  "top": 19,
                  "right": 348,
                  "bottom": 395
                },
                "up": {
                  "canvasWidth": 420,
                  "canvasHeight": 420,
                  "left": 88,
                  "top": 28,
                  "right": 325,
                  "bottom": 395
                },
                "left": {
                  "canvasWidth": 420,
                  "canvasHeight": 420,
                  "left": 71,
                  "top": 51,
                  "right": 319,
                  "bottom": 395
                }
              }
            }
          }
        }
      }
    },
    "woodCathouse": {
      "assetId": "wood-cathouse",
      "runtimeId": "woodCathouse",
      "name": "Wood Cathouse",
      "category": "house",
      "placeable": true,
      "tiers": {
        "1": {
          "liveRevision": 1,
          "revisions": {
            "1": {
              "assetId": "wood-cathouse",
              "runtimeId": "woodCathouse",
              "name": "Wood Cathouse",
              "category": "house",
              "placeable": true,
              "tier": 1,
              "revision": 1,
              "status": "live",
              "width": 2,
              "height": 1,
              "sprites": {
                "down": "img/Buildings/Camp Runtime/wood-cathouse/tier-1/revision-1/down.png",
                "right": "img/Buildings/Camp Runtime/wood-cathouse/tier-1/revision-1/right.png",
                "up": "img/Buildings/Camp Runtime/wood-cathouse/tier-1/revision-1/up.png",
                "left": "img/Buildings/Camp Runtime/wood-cathouse/tier-1/revision-1/left.png"
              },
              "spriteBounds": {
                "down": {
                  "canvasWidth": 640,
                  "canvasHeight": 320,
                  "left": 52,
                  "top": 22,
                  "right": 588,
                  "bottom": 313
                },
                "right": {
                  "canvasWidth": 320,
                  "canvasHeight": 640,
                  "left": 6,
                  "top": 33,
                  "right": 313,
                  "bottom": 572
                },
                "up": {
                  "canvasWidth": 640,
                  "canvasHeight": 320,
                  "left": 52,
                  "top": 22,
                  "right": 587,
                  "bottom": 312
                },
                "left": {
                  "canvasWidth": 320,
                  "canvasHeight": 640,
                  "left": 6,
                  "top": 33,
                  "right": 314,
                  "bottom": 567
                }
              },
              "access": {
                "activationPolicy": "all-ports-reachable",
                "ports": [
                  {
                    "id": "access-1",
                    "side": "west",
                    "cellPolicy": "all-cells-reachable",
                    "approachCells": [
                      {
                        "x": -1,
                        "y": 0
                      }
                    ],
                    "minimumReachableCells": 1
                  }
                ]
              }
            }
          }
        }
      }
    }
  },
  "environmentAssets": {},
  "edgeAssets": {
    "campBoundaryFence": {
      "assetId": "camp-boundary-fence",
      "runtimeId": "campBoundaryFence",
      "name": "Camp Boundary Fence",
      "category": "fence",
      "placeable": false,
      "tiers": {
        "1": {
          "liveRevision": 3,
          "revisions": {
            "1": {
              "assetId": "camp-boundary-fence",
              "runtimeId": "campBoundaryFence",
              "name": "Camp Boundary Fence",
              "category": "fence",
              "placeable": false,
              "tier": 1,
              "revision": 1,
              "status": "retired",
              "width": 1,
              "height": 2,
              "sprites": {
                "down": "tools/camp_asset_studio/library/assets/camp-boundary-fence/tier-1/revision-1/down.png",
                "right": "tools/camp_asset_studio/library/assets/camp-boundary-fence/tier-1/revision-1/right.png",
                "up": "tools/camp_asset_studio/library/assets/camp-boundary-fence/tier-1/revision-1/up.png",
                "left": "tools/camp_asset_studio/library/assets/camp-boundary-fence/tier-1/revision-1/left.png"
              },
              "spriteBounds": {
                "down": {
                  "canvasWidth": 320,
                  "canvasHeight": 640,
                  "left": 134,
                  "top": 84,
                  "right": 186,
                  "bottom": 561
                },
                "right": {
                  "canvasWidth": 640,
                  "canvasHeight": 320,
                  "left": 84,
                  "top": 75,
                  "right": 557,
                  "bottom": 233
                },
                "up": {
                  "canvasWidth": 320,
                  "canvasHeight": 640,
                  "left": 134,
                  "top": 88,
                  "right": 185,
                  "bottom": 564
                },
                "left": {
                  "canvasWidth": 640,
                  "canvasHeight": 320,
                  "left": 83,
                  "top": 71,
                  "right": 558,
                  "bottom": 233
                }
              }
            },
            "2": {
              "assetId": "camp-boundary-fence",
              "runtimeId": "campBoundaryFence",
              "name": "Camp Boundary Fence",
              "category": "fence",
              "placeable": false,
              "tier": 1,
              "revision": 2,
              "status": "retired",
              "width": 1,
              "height": 1,
              "sprites": {
                "down": "tools/camp_asset_studio/library/assets/camp-boundary-fence/tier-1/revision-2/down.png",
                "right": "tools/camp_asset_studio/library/assets/camp-boundary-fence/tier-1/revision-2/right.png",
                "up": "tools/camp_asset_studio/library/assets/camp-boundary-fence/tier-1/revision-2/up.png",
                "left": "tools/camp_asset_studio/library/assets/camp-boundary-fence/tier-1/revision-2/left.png"
              },
              "spriteBounds": {
                "down": {
                  "canvasWidth": 360,
                  "canvasHeight": 360,
                  "left": 40,
                  "top": 89,
                  "right": 320,
                  "bottom": 306
                },
                "right": {
                  "canvasWidth": 360,
                  "canvasHeight": 360,
                  "left": 38,
                  "top": 91,
                  "right": 318,
                  "bottom": 305
                },
                "up": {
                  "canvasWidth": 360,
                  "canvasHeight": 360,
                  "left": 41,
                  "top": 89,
                  "right": 318,
                  "bottom": 309
                },
                "left": {
                  "canvasWidth": 360,
                  "canvasHeight": 360,
                  "left": 39,
                  "top": 92,
                  "right": 318,
                  "bottom": 308
                }
              },
              "edgeSprites": {
                "horizontalA": "tools/camp_asset_studio/library/assets/camp-boundary-fence/tier-1/revision-2/edge-horizontalA.png",
                "horizontalB": "tools/camp_asset_studio/library/assets/camp-boundary-fence/tier-1/revision-2/edge-horizontalB.png",
                "verticalA": "tools/camp_asset_studio/library/assets/camp-boundary-fence/tier-1/revision-2/edge-verticalA.png",
                "verticalB": "tools/camp_asset_studio/library/assets/camp-boundary-fence/tier-1/revision-2/edge-verticalB.png",
                "post": "tools/camp_asset_studio/library/assets/camp-boundary-fence/tier-1/revision-2/edge-post.png"
              },
              "edgeSpriteBounds": {
                "horizontalA": {
                  "canvasWidth": 360,
                  "canvasHeight": 360,
                  "left": 0,
                  "top": 125,
                  "right": 360,
                  "bottom": 212
                },
                "horizontalB": {
                  "canvasWidth": 360,
                  "canvasHeight": 360,
                  "left": 0,
                  "top": 129,
                  "right": 360,
                  "bottom": 209
                },
                "verticalA": {
                  "canvasWidth": 360,
                  "canvasHeight": 360,
                  "left": 155,
                  "top": 0,
                  "right": 205,
                  "bottom": 360
                },
                "verticalB": {
                  "canvasWidth": 360,
                  "canvasHeight": 360,
                  "left": 155,
                  "top": 0,
                  "right": 205,
                  "bottom": 360
                },
                "post": {
                  "canvasWidth": 360,
                  "canvasHeight": 360,
                  "left": 158,
                  "top": 91,
                  "right": 204,
                  "bottom": 248
                }
              },
              "assembledPreview": "tools/camp_asset_studio/library/assets/camp-boundary-fence/tier-1/revision-2/assembled-preview.png"
            },
            "3": {
              "assetId": "camp-boundary-fence",
              "runtimeId": "campBoundaryFence",
              "name": "Camp Boundary Fence",
              "category": "fence",
              "placeable": false,
              "tier": 1,
              "revision": 3,
              "status": "live",
              "width": 1,
              "height": 1,
              "sprites": {
                "down": "img/Buildings/Camp Runtime/camp-boundary-fence/tier-1/revision-3/down.png",
                "right": "img/Buildings/Camp Runtime/camp-boundary-fence/tier-1/revision-3/right.png",
                "up": "img/Buildings/Camp Runtime/camp-boundary-fence/tier-1/revision-3/up.png",
                "left": "img/Buildings/Camp Runtime/camp-boundary-fence/tier-1/revision-3/left.png"
              },
              "spriteBounds": {
                "down": {
                  "canvasWidth": 360,
                  "canvasHeight": 360,
                  "left": 41,
                  "top": 93,
                  "right": 319,
                  "bottom": 250
                },
                "right": {
                  "canvasWidth": 360,
                  "canvasHeight": 360,
                  "left": 39,
                  "top": 94,
                  "right": 321,
                  "bottom": 249
                },
                "up": {
                  "canvasWidth": 360,
                  "canvasHeight": 360,
                  "left": 42,
                  "top": 93,
                  "right": 320,
                  "bottom": 253
                },
                "left": {
                  "canvasWidth": 360,
                  "canvasHeight": 360,
                  "left": 39,
                  "top": 95,
                  "right": 318,
                  "bottom": 252
                }
              },
              "edgeSprites": {
                "horizontalA": "img/Buildings/Camp Runtime/camp-boundary-fence/tier-1/revision-3/edge-horizontalA.png",
                "horizontalB": "img/Buildings/Camp Runtime/camp-boundary-fence/tier-1/revision-3/edge-horizontalB.png",
                "verticalA": "img/Buildings/Camp Runtime/camp-boundary-fence/tier-1/revision-3/edge-verticalA.png",
                "verticalB": "img/Buildings/Camp Runtime/camp-boundary-fence/tier-1/revision-3/edge-verticalB.png",
                "post": "img/Buildings/Camp Runtime/camp-boundary-fence/tier-1/revision-3/edge-post.png"
              },
              "edgeSpriteBounds": {
                "horizontalA": {
                  "canvasWidth": 360,
                  "canvasHeight": 360,
                  "left": 0,
                  "top": 128,
                  "right": 360,
                  "bottom": 215
                },
                "horizontalB": {
                  "canvasWidth": 360,
                  "canvasHeight": 360,
                  "left": 0,
                  "top": 132,
                  "right": 360,
                  "bottom": 212
                },
                "verticalA": {
                  "canvasWidth": 360,
                  "canvasHeight": 360,
                  "left": 157,
                  "top": 0,
                  "right": 204,
                  "bottom": 360
                },
                "verticalB": {
                  "canvasWidth": 360,
                  "canvasHeight": 360,
                  "left": 155,
                  "top": 0,
                  "right": 203,
                  "bottom": 360
                },
                "post": {
                  "canvasWidth": 360,
                  "canvasHeight": 360,
                  "left": 158,
                  "top": 94,
                  "right": 204,
                  "bottom": 251
                }
              },
              "edgeForegroundSprites": {
                "verticalA": "img/Buildings/Camp Runtime/camp-boundary-fence/tier-1/revision-3/edge-foreground-verticalA.png",
                "verticalB": "img/Buildings/Camp Runtime/camp-boundary-fence/tier-1/revision-3/edge-foreground-verticalB.png"
              },
              "assembledPreview": "tools/camp_asset_studio/library/assets/camp-boundary-fence/tier-1/revision-3/assembled-preview.png"
            }
          }
        }
      },
      "runtimeRole": "camp-fence",
      "placementMode": "edge"
    }
  },
  "reviewAssets": {
    "basicTrail": {
      "assetId": "basic-trail",
      "runtimeId": "basicTrail",
      "name": "Basic Trail",
      "category": "path",
      "placeable": true,
      "tiers": {
        "1": {
          "liveRevision": 1,
          "revisions": {
            "1": {
              "assetId": "basic-trail",
              "runtimeId": "basicTrail",
              "name": "Basic Trail",
              "category": "path",
              "placeable": true,
              "tier": 1,
              "revision": 1,
              "status": "live",
              "width": 1,
              "height": 1,
              "sprites": {
                "down": "img/Maps/Camp Runtime/Paths/Basic Trail_Camp_TopDown_Watercolor_Game_v1.png",
                "right": "img/Maps/Camp Runtime/Paths/Basic Trail_Camp_TopDown_Watercolor_Game_v1.png",
                "up": "img/Maps/Camp Runtime/Paths/Basic Trail_Camp_TopDown_Watercolor_Game_v1.png",
                "left": "img/Maps/Camp Runtime/Paths/Basic Trail_Camp_TopDown_Watercolor_Game_v1.png"
              },
              "spriteBounds": {
                "down": {
                  "canvasWidth": 256,
                  "canvasHeight": 256,
                  "left": 0,
                  "top": 0,
                  "right": 256,
                  "bottom": 256
                },
                "right": {
                  "canvasWidth": 256,
                  "canvasHeight": 256,
                  "left": 0,
                  "top": 0,
                  "right": 256,
                  "bottom": 256
                },
                "up": {
                  "canvasWidth": 256,
                  "canvasHeight": 256,
                  "left": 0,
                  "top": 0,
                  "right": 256,
                  "bottom": 256
                },
                "left": {
                  "canvasWidth": 256,
                  "canvasHeight": 256,
                  "left": 0,
                  "top": 0,
                  "right": 256,
                  "bottom": 256
                }
              }
            }
          }
        }
      }
    },
    "campBoundaryFence": {
      "assetId": "camp-boundary-fence",
      "runtimeId": "campBoundaryFence",
      "name": "Camp Boundary Fence",
      "category": "fence",
      "placeable": false,
      "tiers": {
        "1": {
          "liveRevision": 3,
          "revisions": {
            "1": {
              "assetId": "camp-boundary-fence",
              "runtimeId": "campBoundaryFence",
              "name": "Camp Boundary Fence",
              "category": "fence",
              "placeable": false,
              "tier": 1,
              "revision": 1,
              "status": "retired",
              "width": 1,
              "height": 2,
              "sprites": {
                "down": "tools/camp_asset_studio/library/assets/camp-boundary-fence/tier-1/revision-1/down.png",
                "right": "tools/camp_asset_studio/library/assets/camp-boundary-fence/tier-1/revision-1/right.png",
                "up": "tools/camp_asset_studio/library/assets/camp-boundary-fence/tier-1/revision-1/up.png",
                "left": "tools/camp_asset_studio/library/assets/camp-boundary-fence/tier-1/revision-1/left.png"
              },
              "spriteBounds": {
                "down": {
                  "canvasWidth": 320,
                  "canvasHeight": 640,
                  "left": 134,
                  "top": 84,
                  "right": 186,
                  "bottom": 561
                },
                "right": {
                  "canvasWidth": 640,
                  "canvasHeight": 320,
                  "left": 84,
                  "top": 75,
                  "right": 557,
                  "bottom": 233
                },
                "up": {
                  "canvasWidth": 320,
                  "canvasHeight": 640,
                  "left": 134,
                  "top": 88,
                  "right": 185,
                  "bottom": 564
                },
                "left": {
                  "canvasWidth": 640,
                  "canvasHeight": 320,
                  "left": 83,
                  "top": 71,
                  "right": 558,
                  "bottom": 233
                }
              }
            },
            "2": {
              "assetId": "camp-boundary-fence",
              "runtimeId": "campBoundaryFence",
              "name": "Camp Boundary Fence",
              "category": "fence",
              "placeable": false,
              "tier": 1,
              "revision": 2,
              "status": "retired",
              "width": 1,
              "height": 1,
              "sprites": {
                "down": "tools/camp_asset_studio/library/assets/camp-boundary-fence/tier-1/revision-2/down.png",
                "right": "tools/camp_asset_studio/library/assets/camp-boundary-fence/tier-1/revision-2/right.png",
                "up": "tools/camp_asset_studio/library/assets/camp-boundary-fence/tier-1/revision-2/up.png",
                "left": "tools/camp_asset_studio/library/assets/camp-boundary-fence/tier-1/revision-2/left.png"
              },
              "spriteBounds": {
                "down": {
                  "canvasWidth": 360,
                  "canvasHeight": 360,
                  "left": 40,
                  "top": 89,
                  "right": 320,
                  "bottom": 306
                },
                "right": {
                  "canvasWidth": 360,
                  "canvasHeight": 360,
                  "left": 38,
                  "top": 91,
                  "right": 318,
                  "bottom": 305
                },
                "up": {
                  "canvasWidth": 360,
                  "canvasHeight": 360,
                  "left": 41,
                  "top": 89,
                  "right": 318,
                  "bottom": 309
                },
                "left": {
                  "canvasWidth": 360,
                  "canvasHeight": 360,
                  "left": 39,
                  "top": 92,
                  "right": 318,
                  "bottom": 308
                }
              },
              "edgeSprites": {
                "horizontalA": "tools/camp_asset_studio/library/assets/camp-boundary-fence/tier-1/revision-2/edge-horizontalA.png",
                "horizontalB": "tools/camp_asset_studio/library/assets/camp-boundary-fence/tier-1/revision-2/edge-horizontalB.png",
                "verticalA": "tools/camp_asset_studio/library/assets/camp-boundary-fence/tier-1/revision-2/edge-verticalA.png",
                "verticalB": "tools/camp_asset_studio/library/assets/camp-boundary-fence/tier-1/revision-2/edge-verticalB.png",
                "post": "tools/camp_asset_studio/library/assets/camp-boundary-fence/tier-1/revision-2/edge-post.png"
              },
              "edgeSpriteBounds": {
                "horizontalA": {
                  "canvasWidth": 360,
                  "canvasHeight": 360,
                  "left": 0,
                  "top": 125,
                  "right": 360,
                  "bottom": 212
                },
                "horizontalB": {
                  "canvasWidth": 360,
                  "canvasHeight": 360,
                  "left": 0,
                  "top": 129,
                  "right": 360,
                  "bottom": 209
                },
                "verticalA": {
                  "canvasWidth": 360,
                  "canvasHeight": 360,
                  "left": 155,
                  "top": 0,
                  "right": 205,
                  "bottom": 360
                },
                "verticalB": {
                  "canvasWidth": 360,
                  "canvasHeight": 360,
                  "left": 155,
                  "top": 0,
                  "right": 205,
                  "bottom": 360
                },
                "post": {
                  "canvasWidth": 360,
                  "canvasHeight": 360,
                  "left": 158,
                  "top": 91,
                  "right": 204,
                  "bottom": 248
                }
              },
              "assembledPreview": "tools/camp_asset_studio/library/assets/camp-boundary-fence/tier-1/revision-2/assembled-preview.png"
            },
            "3": {
              "assetId": "camp-boundary-fence",
              "runtimeId": "campBoundaryFence",
              "name": "Camp Boundary Fence",
              "category": "fence",
              "placeable": false,
              "tier": 1,
              "revision": 3,
              "status": "live",
              "width": 1,
              "height": 1,
              "sprites": {
                "down": "img/Buildings/Camp Runtime/camp-boundary-fence/tier-1/revision-3/down.png",
                "right": "img/Buildings/Camp Runtime/camp-boundary-fence/tier-1/revision-3/right.png",
                "up": "img/Buildings/Camp Runtime/camp-boundary-fence/tier-1/revision-3/up.png",
                "left": "img/Buildings/Camp Runtime/camp-boundary-fence/tier-1/revision-3/left.png"
              },
              "spriteBounds": {
                "down": {
                  "canvasWidth": 360,
                  "canvasHeight": 360,
                  "left": 41,
                  "top": 93,
                  "right": 319,
                  "bottom": 250
                },
                "right": {
                  "canvasWidth": 360,
                  "canvasHeight": 360,
                  "left": 39,
                  "top": 94,
                  "right": 321,
                  "bottom": 249
                },
                "up": {
                  "canvasWidth": 360,
                  "canvasHeight": 360,
                  "left": 42,
                  "top": 93,
                  "right": 320,
                  "bottom": 253
                },
                "left": {
                  "canvasWidth": 360,
                  "canvasHeight": 360,
                  "left": 39,
                  "top": 95,
                  "right": 318,
                  "bottom": 252
                }
              },
              "edgeSprites": {
                "horizontalA": "img/Buildings/Camp Runtime/camp-boundary-fence/tier-1/revision-3/edge-horizontalA.png",
                "horizontalB": "img/Buildings/Camp Runtime/camp-boundary-fence/tier-1/revision-3/edge-horizontalB.png",
                "verticalA": "img/Buildings/Camp Runtime/camp-boundary-fence/tier-1/revision-3/edge-verticalA.png",
                "verticalB": "img/Buildings/Camp Runtime/camp-boundary-fence/tier-1/revision-3/edge-verticalB.png",
                "post": "img/Buildings/Camp Runtime/camp-boundary-fence/tier-1/revision-3/edge-post.png"
              },
              "edgeSpriteBounds": {
                "horizontalA": {
                  "canvasWidth": 360,
                  "canvasHeight": 360,
                  "left": 0,
                  "top": 128,
                  "right": 360,
                  "bottom": 215
                },
                "horizontalB": {
                  "canvasWidth": 360,
                  "canvasHeight": 360,
                  "left": 0,
                  "top": 132,
                  "right": 360,
                  "bottom": 212
                },
                "verticalA": {
                  "canvasWidth": 360,
                  "canvasHeight": 360,
                  "left": 157,
                  "top": 0,
                  "right": 204,
                  "bottom": 360
                },
                "verticalB": {
                  "canvasWidth": 360,
                  "canvasHeight": 360,
                  "left": 155,
                  "top": 0,
                  "right": 203,
                  "bottom": 360
                },
                "post": {
                  "canvasWidth": 360,
                  "canvasHeight": 360,
                  "left": 158,
                  "top": 94,
                  "right": 204,
                  "bottom": 251
                }
              },
              "edgeForegroundSprites": {
                "verticalA": "img/Buildings/Camp Runtime/camp-boundary-fence/tier-1/revision-3/edge-foreground-verticalA.png",
                "verticalB": "img/Buildings/Camp Runtime/camp-boundary-fence/tier-1/revision-3/edge-foreground-verticalB.png"
              },
              "assembledPreview": "tools/camp_asset_studio/library/assets/camp-boundary-fence/tier-1/revision-3/assembled-preview.png"
            }
          }
        }
      },
      "runtimeRole": "camp-fence",
      "placementMode": "edge"
    },
    "cardboardBox": {
      "assetId": "cardboard-box",
      "runtimeId": "cardboardBox",
      "name": "Cardboard Box",
      "category": "house",
      "placeable": true,
      "tiers": {
        "1": {
          "liveRevision": 6,
          "revisions": {
            "5": {
              "assetId": "cardboard-box",
              "runtimeId": "cardboardBox",
              "name": "Cardboard Box",
              "category": "house",
              "placeable": true,
              "tier": 1,
              "revision": 5,
              "status": "retired",
              "width": 1,
              "height": 1,
              "sprites": {
                "down": "tools/camp_asset_studio/library/assets/cardboard-box/tier-1/revision-5/down.png",
                "right": "tools/camp_asset_studio/library/assets/cardboard-box/tier-1/revision-5/right.png",
                "up": "tools/camp_asset_studio/library/assets/cardboard-box/tier-1/revision-5/up.png",
                "left": "tools/camp_asset_studio/library/assets/cardboard-box/tier-1/revision-5/left.png"
              },
              "spriteBounds": {
                "down": {
                  "canvasWidth": 360,
                  "canvasHeight": 360,
                  "left": 50,
                  "top": 78,
                  "right": 310,
                  "bottom": 333
                },
                "right": {
                  "canvasWidth": 360,
                  "canvasHeight": 360,
                  "left": 39,
                  "top": 24,
                  "right": 320,
                  "bottom": 329
                },
                "up": {
                  "canvasWidth": 360,
                  "canvasHeight": 360,
                  "left": 50,
                  "top": 71,
                  "right": 310,
                  "bottom": 329
                },
                "left": {
                  "canvasWidth": 360,
                  "canvasHeight": 360,
                  "left": 40,
                  "top": 23,
                  "right": 320,
                  "bottom": 329
                }
              },
              "access": {
                "activationPolicy": "all-ports-reachable",
                "ports": [
                  {
                    "id": "access-1",
                    "side": "south",
                    "cellPolicy": "all-cells-reachable",
                    "approachCells": [
                      {
                        "x": 0,
                        "y": 1
                      }
                    ],
                    "minimumReachableCells": 1
                  }
                ]
              }
            },
            "6": {
              "assetId": "cardboard-box",
              "runtimeId": "cardboardBox",
              "name": "Cardboard Box",
              "category": "house",
              "placeable": true,
              "tier": 1,
              "revision": 6,
              "status": "live",
              "width": 1,
              "height": 1,
              "sprites": {
                "down": "img/Buildings/Camp Runtime/cardboard-box/tier-1/revision-6/down.png",
                "right": "img/Buildings/Camp Runtime/cardboard-box/tier-1/revision-6/right.png",
                "up": "img/Buildings/Camp Runtime/cardboard-box/tier-1/revision-6/up.png",
                "left": "img/Buildings/Camp Runtime/cardboard-box/tier-1/revision-6/left.png"
              },
              "spriteBounds": {
                "down": {
                  "canvasWidth": 360,
                  "canvasHeight": 360,
                  "left": 49,
                  "top": 77,
                  "right": 310,
                  "bottom": 333
                },
                "right": {
                  "canvasWidth": 360,
                  "canvasHeight": 360,
                  "left": 38,
                  "top": 23,
                  "right": 321,
                  "bottom": 330
                },
                "up": {
                  "canvasWidth": 360,
                  "canvasHeight": 360,
                  "left": 49,
                  "top": 77,
                  "right": 311,
                  "bottom": 330
                },
                "left": {
                  "canvasWidth": 360,
                  "canvasHeight": 360,
                  "left": 39,
                  "top": 23,
                  "right": 321,
                  "bottom": 330
                }
              },
              "access": {
                "activationPolicy": "all-ports-reachable",
                "ports": [
                  {
                    "id": "access-1",
                    "side": "south",
                    "cellPolicy": "all-cells-reachable",
                    "approachCells": [
                      {
                        "x": 0,
                        "y": 1
                      }
                    ],
                    "minimumReachableCells": 1
                  }
                ]
              }
            }
          }
        }
      }
    },
    "catStatueV2": {
      "assetId": "cat-statue-v2",
      "runtimeId": "catStatueV2",
      "name": "Cat Statue",
      "category": "decoration",
      "placeable": true,
      "tiers": {
        "1": {
          "liveRevision": 1,
          "revisions": {
            "1": {
              "assetId": "cat-statue-v2",
              "runtimeId": "catStatueV2",
              "name": "Cat Statue",
              "category": "decoration",
              "placeable": true,
              "tier": 1,
              "revision": 1,
              "status": "live",
              "width": 1,
              "height": 1,
              "sprites": {
                "down": "img/Buildings/Camp Runtime/cat-statue-v2/tier-1/revision-1/down.png",
                "right": "img/Buildings/Camp Runtime/cat-statue-v2/tier-1/revision-1/right.png",
                "up": "img/Buildings/Camp Runtime/cat-statue-v2/tier-1/revision-1/up.png",
                "left": "img/Buildings/Camp Runtime/cat-statue-v2/tier-1/revision-1/left.png"
              },
              "spriteBounds": {
                "down": {
                  "canvasWidth": 420,
                  "canvasHeight": 420,
                  "left": 88,
                  "top": 120,
                  "right": 410,
                  "bottom": 412
                },
                "right": {
                  "canvasWidth": 420,
                  "canvasHeight": 420,
                  "left": 101,
                  "top": 115,
                  "right": 331,
                  "bottom": 420
                },
                "up": {
                  "canvasWidth": 420,
                  "canvasHeight": 420,
                  "left": 17,
                  "top": 56,
                  "right": 333,
                  "bottom": 412
                },
                "left": {
                  "canvasWidth": 420,
                  "canvasHeight": 420,
                  "left": 90,
                  "top": 18,
                  "right": 319,
                  "bottom": 420
                }
              }
            }
          }
        }
      }
    },
    "catchen": {
      "assetId": "catchen",
      "runtimeId": "catchen",
      "name": "Catchen",
      "category": "production-building",
      "placeable": true,
      "tiers": {
        "1": {
          "liveRevision": 4,
          "revisions": {
            "3": {
              "assetId": "catchen",
              "runtimeId": "catchen",
              "name": "Catchen",
              "category": "production-building",
              "placeable": true,
              "tier": 1,
              "revision": 3,
              "status": "retired",
              "width": 3,
              "height": 3,
              "sprites": {
                "down": "tools/camp_asset_studio/library/assets/catchen/tier-1/revision-3/down.png",
                "right": "tools/camp_asset_studio/library/assets/catchen/tier-1/revision-3/right.png",
                "up": "tools/camp_asset_studio/library/assets/catchen/tier-1/revision-3/up.png",
                "left": "tools/camp_asset_studio/library/assets/catchen/tier-1/revision-3/left.png"
              },
              "spriteBounds": {
                "down": {
                  "canvasWidth": 600,
                  "canvasHeight": 600,
                  "left": 82,
                  "top": 67,
                  "right": 517,
                  "bottom": 522
                },
                "right": {
                  "canvasWidth": 600,
                  "canvasHeight": 600,
                  "left": 78,
                  "top": 82,
                  "right": 533,
                  "bottom": 517
                },
                "up": {
                  "canvasWidth": 600,
                  "canvasHeight": 600,
                  "left": 83,
                  "top": 78,
                  "right": 518,
                  "bottom": 533
                },
                "left": {
                  "canvasWidth": 600,
                  "canvasHeight": 600,
                  "left": 67,
                  "top": 83,
                  "right": 522,
                  "bottom": 518
                }
              }
            },
            "4": {
              "assetId": "catchen",
              "runtimeId": "catchen",
              "name": "Catchen",
              "category": "production-building",
              "placeable": true,
              "tier": 1,
              "revision": 4,
              "status": "live",
              "width": 2,
              "height": 1,
              "sprites": {
                "down": "img/Buildings/Camp Runtime/catchen/tier-1/revision-4/down.png",
                "right": "img/Buildings/Camp Runtime/catchen/tier-1/revision-4/right.png",
                "up": "img/Buildings/Camp Runtime/catchen/tier-1/revision-4/up.png",
                "left": "img/Buildings/Camp Runtime/catchen/tier-1/revision-4/left.png"
              },
              "spriteBounds": {
                "down": {
                  "canvasWidth": 640,
                  "canvasHeight": 320,
                  "left": 69,
                  "top": 23,
                  "right": 572,
                  "bottom": 299
                },
                "right": {
                  "canvasWidth": 320,
                  "canvasHeight": 640,
                  "left": 48,
                  "top": 107,
                  "right": 271,
                  "bottom": 562
                },
                "up": {
                  "canvasWidth": 640,
                  "canvasHeight": 320,
                  "left": 68,
                  "top": 47,
                  "right": 571,
                  "bottom": 299
                },
                "left": {
                  "canvasWidth": 320,
                  "canvasHeight": 640,
                  "left": 48,
                  "top": 93,
                  "right": 271,
                  "bottom": 563
                }
              }
            }
          }
        }
      }
    },
    "tree": {
      "assetId": "garden-tree",
      "runtimeId": "tree",
      "name": "Garden Tree",
      "category": "decoration",
      "placeable": true,
      "tiers": {
        "1": {
          "liveRevision": null,
          "revisions": {
            "1": {
              "assetId": "garden-tree",
              "runtimeId": "tree",
              "name": "Garden Tree",
              "category": "decoration",
              "placeable": true,
              "tier": 1,
              "revision": 1,
              "status": "approved",
              "width": 2,
              "height": 2,
              "sprites": {
                "down": "tools/camp_asset_studio/library/assets/garden-tree/tier-1/revision-1/down.png",
                "right": "tools/camp_asset_studio/library/assets/garden-tree/tier-1/revision-1/down.png",
                "up": "tools/camp_asset_studio/library/assets/garden-tree/tier-1/revision-1/down.png",
                "left": "tools/camp_asset_studio/library/assets/garden-tree/tier-1/revision-1/down.png"
              },
              "spriteBounds": {
                "down": {
                  "canvasWidth": 400,
                  "canvasHeight": 400,
                  "left": 72,
                  "top": 64,
                  "right": 331,
                  "bottom": 331
                },
                "right": {
                  "canvasWidth": 400,
                  "canvasHeight": 400,
                  "left": 72,
                  "top": 64,
                  "right": 331,
                  "bottom": 331
                },
                "up": {
                  "canvasWidth": 400,
                  "canvasHeight": 400,
                  "left": 72,
                  "top": 64,
                  "right": 331,
                  "bottom": 331
                },
                "left": {
                  "canvasWidth": 400,
                  "canvasHeight": 400,
                  "left": 72,
                  "top": 64,
                  "right": 331,
                  "bottom": 331
                }
              }
            }
          }
        }
      }
    },
    "jobCenter": {
      "assetId": "job-center",
      "runtimeId": "jobCenter",
      "name": "Job Center",
      "category": "building",
      "placeable": true,
      "tiers": {
        "1": {
          "liveRevision": 6,
          "revisions": {
            "6": {
              "assetId": "job-center",
              "runtimeId": "jobCenter",
              "name": "Job Center",
              "category": "building",
              "placeable": true,
              "tier": 1,
              "revision": 6,
              "status": "live",
              "width": 2,
              "height": 3,
              "sprites": {
                "down": "img/Buildings/Camp Runtime/job-center/tier-1/revision-6/down.png",
                "right": "img/Buildings/Camp Runtime/job-center/tier-1/revision-6/right.png",
                "up": "img/Buildings/Camp Runtime/job-center/tier-1/revision-6/up.png",
                "left": "img/Buildings/Camp Runtime/job-center/tier-1/revision-6/left.png"
              },
              "spriteBounds": {
                "down": {
                  "canvasWidth": 640,
                  "canvasHeight": 960,
                  "left": 36,
                  "top": 73,
                  "right": 605,
                  "bottom": 786
                },
                "right": {
                  "canvasWidth": 960,
                  "canvasHeight": 640,
                  "left": 118,
                  "top": 56,
                  "right": 845,
                  "bottom": 548
                },
                "up": {
                  "canvasWidth": 640,
                  "canvasHeight": 960,
                  "left": 42,
                  "top": 74,
                  "right": 597,
                  "bottom": 781
                },
                "left": {
                  "canvasWidth": 960,
                  "canvasHeight": 640,
                  "left": 116,
                  "top": 57,
                  "right": 841,
                  "bottom": 548
                }
              },
              "access": {
                "activationPolicy": "all-ports-reachable",
                "ports": [
                  {
                    "id": "access-1",
                    "side": "south",
                    "cellPolicy": "all-cells-reachable",
                    "approachCells": [
                      {
                        "x": 0,
                        "y": 3
                      },
                      {
                        "x": 1,
                        "y": 3
                      }
                    ],
                    "minimumReachableCells": 2
                  }
                ]
              }
            }
          }
        }
      }
    },
    "pawsonry": {
      "assetId": "pawsonry",
      "runtimeId": "pawsonry",
      "name": "Pawsonry",
      "category": "production-building",
      "placeable": true,
      "tiers": {
        "1": {
          "liveRevision": 4,
          "revisions": {
            "3": {
              "assetId": "pawsonry",
              "runtimeId": "pawsonry",
              "name": "Pawsonry",
              "category": "production-building",
              "placeable": true,
              "tier": 1,
              "revision": 3,
              "status": "retired",
              "width": 3,
              "height": 3,
              "sprites": {
                "down": "tools/camp_asset_studio/library/assets/pawsonry/tier-1/revision-3/down.png",
                "right": "tools/camp_asset_studio/library/assets/pawsonry/tier-1/revision-3/right.png",
                "up": "tools/camp_asset_studio/library/assets/pawsonry/tier-1/revision-3/up.png",
                "left": "tools/camp_asset_studio/library/assets/pawsonry/tier-1/revision-3/left.png"
              },
              "spriteBounds": {
                "down": {
                  "canvasWidth": 600,
                  "canvasHeight": 600,
                  "left": 76,
                  "top": 65,
                  "right": 524,
                  "bottom": 529
                },
                "right": {
                  "canvasWidth": 600,
                  "canvasHeight": 600,
                  "left": 71,
                  "top": 76,
                  "right": 535,
                  "bottom": 524
                },
                "up": {
                  "canvasWidth": 600,
                  "canvasHeight": 600,
                  "left": 76,
                  "top": 71,
                  "right": 524,
                  "bottom": 535
                },
                "left": {
                  "canvasWidth": 600,
                  "canvasHeight": 600,
                  "left": 65,
                  "top": 76,
                  "right": 529,
                  "bottom": 524
                }
              }
            },
            "4": {
              "assetId": "pawsonry",
              "runtimeId": "pawsonry",
              "name": "Pawsonry",
              "category": "production-building",
              "placeable": true,
              "tier": 1,
              "revision": 4,
              "status": "live",
              "width": 2,
              "height": 2,
              "sprites": {
                "down": "img/Buildings/Camp Runtime/pawsonry/tier-1/revision-4/down.png",
                "right": "img/Buildings/Camp Runtime/pawsonry/tier-1/revision-4/right.png",
                "up": "img/Buildings/Camp Runtime/pawsonry/tier-1/revision-4/up.png",
                "left": "img/Buildings/Camp Runtime/pawsonry/tier-1/revision-4/left.png"
              },
              "spriteBounds": {
                "down": {
                  "canvasWidth": 640,
                  "canvasHeight": 640,
                  "left": 77,
                  "top": 153,
                  "right": 596,
                  "bottom": 507
                },
                "right": {
                  "canvasWidth": 640,
                  "canvasHeight": 640,
                  "left": 35,
                  "top": 126,
                  "right": 481,
                  "bottom": 542
                },
                "up": {
                  "canvasWidth": 640,
                  "canvasHeight": 640,
                  "left": 53,
                  "top": 179,
                  "right": 559,
                  "bottom": 605
                },
                "left": {
                  "canvasWidth": 640,
                  "canvasHeight": 640,
                  "left": 142,
                  "top": 121,
                  "right": 600,
                  "bottom": 593
                }
              },
              "access": {
                "activationPolicy": "all-ports-reachable",
                "ports": [
                  {
                    "id": "access-1",
                    "side": "south",
                    "cellPolicy": "any-cell-reachable",
                    "approachCells": [
                      {
                        "x": 0,
                        "y": 2
                      },
                      {
                        "x": 1,
                        "y": 2
                      }
                    ],
                    "minimumReachableCells": 1
                  }
                ]
              }
            }
          }
        }
      }
    },
    "sawmill": {
      "assetId": "sawmill",
      "runtimeId": "sawmill",
      "name": "Sawmill",
      "category": "production-building",
      "placeable": true,
      "tiers": {
        "1": {
          "liveRevision": 3,
          "revisions": {
            "2": {
              "assetId": "sawmill",
              "runtimeId": "sawmill",
              "name": "Sawmill",
              "category": "production-building",
              "placeable": true,
              "tier": 1,
              "revision": 2,
              "status": "retired",
              "width": 3,
              "height": 2,
              "sprites": {
                "down": "tools/camp_asset_studio/library/assets/sawmill/tier-1/revision-2/down.png",
                "right": "tools/camp_asset_studio/library/assets/sawmill/tier-1/revision-2/right.png",
                "up": "tools/camp_asset_studio/library/assets/sawmill/tier-1/revision-2/up.png",
                "left": "tools/camp_asset_studio/library/assets/sawmill/tier-1/revision-2/left.png"
              },
              "spriteBounds": {
                "down": {
                  "canvasWidth": 600,
                  "canvasHeight": 400,
                  "left": 82,
                  "top": 49,
                  "right": 525,
                  "bottom": 331
                },
                "right": {
                  "canvasWidth": 400,
                  "canvasHeight": 600,
                  "left": 69,
                  "top": 82,
                  "right": 351,
                  "bottom": 525
                },
                "up": {
                  "canvasWidth": 600,
                  "canvasHeight": 400,
                  "left": 75,
                  "top": 69,
                  "right": 518,
                  "bottom": 351
                },
                "left": {
                  "canvasWidth": 400,
                  "canvasHeight": 600,
                  "left": 49,
                  "top": 75,
                  "right": 331,
                  "bottom": 518
                }
              }
            },
            "3": {
              "assetId": "sawmill",
              "runtimeId": "sawmill",
              "name": "Sawmill",
              "category": "production-building",
              "placeable": true,
              "tier": 1,
              "revision": 3,
              "status": "live",
              "width": 2,
              "height": 1,
              "sprites": {
                "down": "img/Buildings/Camp Runtime/sawmill/tier-1/revision-3/down.png",
                "right": "img/Buildings/Camp Runtime/sawmill/tier-1/revision-3/right.png",
                "up": "img/Buildings/Camp Runtime/sawmill/tier-1/revision-3/up.png",
                "left": "img/Buildings/Camp Runtime/sawmill/tier-1/revision-3/left.png"
              },
              "spriteBounds": {
                "down": {
                  "canvasWidth": 640,
                  "canvasHeight": 320,
                  "left": 63,
                  "top": 11,
                  "right": 578,
                  "bottom": 302
                },
                "right": {
                  "canvasWidth": 320,
                  "canvasHeight": 640,
                  "left": 48,
                  "top": 105,
                  "right": 270,
                  "bottom": 569
                },
                "up": {
                  "canvasWidth": 640,
                  "canvasHeight": 320,
                  "left": 62,
                  "top": 50,
                  "right": 577,
                  "bottom": 301
                },
                "left": {
                  "canvasWidth": 320,
                  "canvasHeight": 640,
                  "left": 49,
                  "top": 70,
                  "right": 271,
                  "bottom": 569
                }
              },
              "access": {
                "activationPolicy": "all-ports-reachable",
                "ports": [
                  {
                    "id": "access-1",
                    "side": "south",
                    "cellPolicy": "any-cell-reachable",
                    "approachCells": [
                      {
                        "x": 0,
                        "y": 1
                      },
                      {
                        "x": 1,
                        "y": 1
                      }
                    ],
                    "minimumReachableCells": 1
                  }
                ]
              }
            }
          }
        },
        "2": {
          "liveRevision": null,
          "revisions": {
            "1": {
              "assetId": "sawmill",
              "runtimeId": "sawmill",
              "name": "Sawmill",
              "category": "production-building",
              "placeable": true,
              "tier": 2,
              "revision": 1,
              "status": "approved",
              "width": 2,
              "height": 1,
              "sprites": {
                "down": "tools/camp_asset_studio/library/assets/sawmill/tier-2/revision-1/down.png",
                "right": "tools/camp_asset_studio/library/assets/sawmill/tier-2/revision-1/right.png",
                "up": "tools/camp_asset_studio/library/assets/sawmill/tier-2/revision-1/up.png",
                "left": "tools/camp_asset_studio/library/assets/sawmill/tier-2/revision-1/left.png"
              },
              "spriteBounds": {
                "down": {
                  "canvasWidth": 640,
                  "canvasHeight": 320,
                  "left": 61,
                  "top": 0,
                  "right": 580,
                  "bottom": 310
                },
                "right": {
                  "canvasWidth": 320,
                  "canvasHeight": 640,
                  "left": 46,
                  "top": 23,
                  "right": 266,
                  "bottom": 579
                },
                "up": {
                  "canvasWidth": 640,
                  "canvasHeight": 320,
                  "left": 60,
                  "top": 1,
                  "right": 579,
                  "bottom": 310
                },
                "left": {
                  "canvasWidth": 320,
                  "canvasHeight": 640,
                  "left": 53,
                  "top": 97,
                  "right": 272,
                  "bottom": 579
                }
              },
              "access": {
                "activationPolicy": "all-ports-reachable",
                "ports": [
                  {
                    "id": "access-1",
                    "side": "south",
                    "cellPolicy": "any-cell-reachable",
                    "approachCells": [
                      {
                        "x": 0,
                        "y": 1
                      },
                      {
                        "x": 1,
                        "y": 1
                      }
                    ],
                    "minimumReachableCells": 1
                  }
                ]
              }
            }
          }
        }
      }
    },
    "smallCatStatue": {
      "assetId": "small-cat-statue",
      "runtimeId": "smallCatStatue",
      "name": "Small cat statue",
      "category": "decoration",
      "placeable": true,
      "tiers": {
        "1": {
          "liveRevision": null,
          "revisions": {
            "1": {
              "assetId": "small-cat-statue",
              "runtimeId": "smallCatStatue",
              "name": "Small cat statue",
              "category": "decoration",
              "placeable": true,
              "tier": 1,
              "revision": 1,
              "status": "retired",
              "width": 1,
              "height": 1,
              "sprites": {
                "down": "tools/camp_asset_studio/library/assets/small-cat-statue/tier-1/revision-1/down.png",
                "right": "tools/camp_asset_studio/library/assets/small-cat-statue/tier-1/revision-1/right.png",
                "up": "tools/camp_asset_studio/library/assets/small-cat-statue/tier-1/revision-1/up.png",
                "left": "tools/camp_asset_studio/library/assets/small-cat-statue/tier-1/revision-1/left.png"
              },
              "spriteBounds": {
                "down": {
                  "canvasWidth": 420,
                  "canvasHeight": 420,
                  "left": 102,
                  "top": 70,
                  "right": 334,
                  "bottom": 395
                },
                "right": {
                  "canvasWidth": 420,
                  "canvasHeight": 420,
                  "left": 96,
                  "top": 19,
                  "right": 348,
                  "bottom": 395
                },
                "up": {
                  "canvasWidth": 420,
                  "canvasHeight": 420,
                  "left": 88,
                  "top": 28,
                  "right": 325,
                  "bottom": 395
                },
                "left": {
                  "canvasWidth": 420,
                  "canvasHeight": 420,
                  "left": 71,
                  "top": 51,
                  "right": 319,
                  "bottom": 395
                }
              }
            }
          }
        }
      }
    },
    "trainingCenter": {
      "assetId": "training-center",
      "runtimeId": "trainingCenter",
      "name": "Training Center",
      "category": "building",
      "placeable": true,
      "tiers": {
        "1": {
          "liveRevision": null,
          "revisions": {
            "1": {
              "assetId": "training-center",
              "runtimeId": "trainingCenter",
              "name": "Training Center",
              "category": "building",
              "placeable": true,
              "tier": 1,
              "revision": 1,
              "status": "approved",
              "width": 3,
              "height": 4,
              "sprites": {
                "down": "tools/camp_asset_studio/library/assets/training-center/tier-1/revision-1/down.png",
                "right": "tools/camp_asset_studio/library/assets/training-center/tier-1/revision-1/right.png",
                "up": "tools/camp_asset_studio/library/assets/training-center/tier-1/revision-1/up.png",
                "left": "tools/camp_asset_studio/library/assets/training-center/tier-1/revision-1/left.png"
              },
              "spriteBounds": {
                "down": {
                  "canvasWidth": 450,
                  "canvasHeight": 600,
                  "left": 60,
                  "top": 38,
                  "right": 390,
                  "bottom": 536
                },
                "right": {
                  "canvasWidth": 600,
                  "canvasHeight": 450,
                  "left": 64,
                  "top": 60,
                  "right": 562,
                  "bottom": 390
                },
                "up": {
                  "canvasWidth": 450,
                  "canvasHeight": 600,
                  "left": 60,
                  "top": 64,
                  "right": 390,
                  "bottom": 562
                },
                "left": {
                  "canvasWidth": 600,
                  "canvasHeight": 450,
                  "left": 38,
                  "top": 60,
                  "right": 536,
                  "bottom": 390
                }
              }
            }
          }
        }
      }
    },
    "woodCathouse": {
      "assetId": "wood-cathouse",
      "runtimeId": "woodCathouse",
      "name": "Wood Cathouse",
      "category": "house",
      "placeable": true,
      "tiers": {
        "1": {
          "liveRevision": 1,
          "revisions": {
            "1": {
              "assetId": "wood-cathouse",
              "runtimeId": "woodCathouse",
              "name": "Wood Cathouse",
              "category": "house",
              "placeable": true,
              "tier": 1,
              "revision": 1,
              "status": "live",
              "width": 2,
              "height": 1,
              "sprites": {
                "down": "img/Buildings/Camp Runtime/wood-cathouse/tier-1/revision-1/down.png",
                "right": "img/Buildings/Camp Runtime/wood-cathouse/tier-1/revision-1/right.png",
                "up": "img/Buildings/Camp Runtime/wood-cathouse/tier-1/revision-1/up.png",
                "left": "img/Buildings/Camp Runtime/wood-cathouse/tier-1/revision-1/left.png"
              },
              "spriteBounds": {
                "down": {
                  "canvasWidth": 640,
                  "canvasHeight": 320,
                  "left": 52,
                  "top": 22,
                  "right": 588,
                  "bottom": 313
                },
                "right": {
                  "canvasWidth": 320,
                  "canvasHeight": 640,
                  "left": 6,
                  "top": 33,
                  "right": 313,
                  "bottom": 572
                },
                "up": {
                  "canvasWidth": 640,
                  "canvasHeight": 320,
                  "left": 52,
                  "top": 22,
                  "right": 587,
                  "bottom": 312
                },
                "left": {
                  "canvasWidth": 320,
                  "canvasHeight": 640,
                  "left": 6,
                  "top": 33,
                  "right": 314,
                  "bottom": 567
                }
              },
              "access": {
                "activationPolicy": "all-ports-reachable",
                "ports": [
                  {
                    "id": "access-1",
                    "side": "west",
                    "cellPolicy": "all-cells-reachable",
                    "approachCells": [
                      {
                        "x": -1,
                        "y": 0
                      }
                    ],
                    "minimumReachableCells": 1
                  }
                ]
              }
            }
          }
        }
      }
    }
  }
});
})(typeof window !== "undefined" ? window : globalThis);
