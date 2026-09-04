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
  "stickers": {
    "schemaVersion": 1,
    "colors": [
      {
        "id": "kraft",
        "name": "Kraft",
        "hex": "#C48A57"
      },
      {
        "id": "sky-blue",
        "name": "Sky blue",
        "hex": "#6D9CC8"
      },
      {
        "id": "rose",
        "name": "Rose",
        "hex": "#C96B82"
      },
      {
        "id": "cream",
        "name": "Cream",
        "hex": "#F1D58C"
      }
    ],
    "items": [
      {
        "id": "storage-stacked-boxes",
        "name": "Stacked boxes",
        "category": "storage",
        "runtimePath": "img/Buildings/Camp Runtime/Stickers/storage-stacked-boxes.png",
        "colorIds": [
          "kraft",
          "sky-blue",
          "cream"
        ],
        "defaultColorId": "kraft"
      },
      {
        "id": "general-heart",
        "name": "Heart",
        "category": "general",
        "runtimePath": "img/Buildings/Camp Runtime/Stickers/general-heart.png",
        "colorIds": [
          "rose",
          "cream",
          "sky-blue"
        ],
        "defaultColorId": "rose"
      },
      {
        "id": "jobs-briefcase-paw",
        "name": "Briefcase Paw",
        "category": "jobs",
        "runtimePath": "img/Buildings/Camp Runtime/Stickers/jobs-briefcase-paw.png",
        "colorIds": [
          "kraft",
          "sky-blue",
          "cream"
        ],
        "defaultColorId": "sky-blue"
      }
    ]
  },
  "assets": {
    "basicTrail": {
      "assetId": "basic-trail",
      "name": "Basic Trail",
      "category": "path",
      "placeable": true,
      "tiers": {
        "1": {
          "liveRevision": 1,
          "revisions": {
            "1": {
              "name": "Basic Trail",
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
              "buildingJoin": {
                "width": 0.32,
                "maxWidth": 0.8,
                "length": 0.34,
                "multiCellLength": 0.68,
                "textureScaleCells": 1.394,
                "merged": {
                  "outerInset": 0.09,
                  "innerWidth": 0.62,
                  "length": 0.8
                }
              }
            }
          }
        }
      }
    },
    "cardboardBox": {
      "assetId": "cardboard-box",
      "name": "Cardboard Box",
      "category": "house",
      "placeable": true,
      "tiers": {
        "1": {
          "liveRevision": 13,
          "revisions": {
            "13": {
              "name": "Cardboard Box",
              "tier": 1,
              "revision": 13,
              "status": "live",
              "width": 1,
              "height": 1,
              "sprites": {
                "down": "img/Buildings/Camp Runtime/cardboard-box/tier-1/revision-13/down.png",
                "right": "img/Buildings/Camp Runtime/cardboard-box/tier-1/revision-13/right.png",
                "up": "img/Buildings/Camp Runtime/cardboard-box/tier-1/revision-13/up.png",
                "left": "img/Buildings/Camp Runtime/cardboard-box/tier-1/revision-13/left.png"
              },
              "groundingSprites": {
                "down": "img/Buildings/Camp Runtime/cardboard-box/tier-1/revision-13/grounding-down.png",
                "right": "img/Buildings/Camp Runtime/cardboard-box/tier-1/revision-13/grounding-right.png",
                "up": "img/Buildings/Camp Runtime/cardboard-box/tier-1/revision-13/grounding-up.png",
                "left": "img/Buildings/Camp Runtime/cardboard-box/tier-1/revision-13/grounding-left.png"
              },
              "groundingBounds": {
                "down": {
                  "x": -1.0,
                  "y": -1.0,
                  "width": 3.0,
                  "height": 3.0
                },
                "right": {
                  "x": -1.0,
                  "y": -1.0,
                  "width": 3.0,
                  "height": 3.0
                },
                "up": {
                  "x": -1.0,
                  "y": -1.0,
                  "width": 3.0,
                  "height": 3.0
                },
                "left": {
                  "x": -1.0,
                  "y": -1.0,
                  "width": 3.0,
                  "height": 3.0
                }
              },
              "stickerSlot": {
                "id": "front-surface",
                "enabled": false,
                "mode": "pitched-roof",
                "category": "general",
                "anchors": {
                  "down": {
                    "auto": "right",
                    "left": {
                      "x": 0.5,
                      "y": 0.2756,
                      "rotation": 0.0,
                      "quad": [
                        {
                          "x": 0.569245,
                          "y": 0.293262
                        },
                        {
                          "x": 0.430755,
                          "y": 0.293262
                        },
                        {
                          "x": 0.432854,
                          "y": 0.258494
                        },
                        {
                          "x": 0.567146,
                          "y": 0.258494
                        }
                      ],
                      "visible": true
                    },
                    "right": {
                      "x": 0.65,
                      "y": 0.52,
                      "rotation": 0.0,
                      "quad": [
                        {
                          "x": 0.5778,
                          "y": 0.449096
                        },
                        {
                          "x": 0.721431,
                          "y": 0.449096
                        },
                        {
                          "x": 0.722571,
                          "y": 0.591269
                        },
                        {
                          "x": 0.578201,
                          "y": 0.591269
                        }
                      ],
                      "visible": true
                    }
                  },
                  "right": {
                    "auto": "right",
                    "left": {
                      "x": 0.322,
                      "y": 0.4042,
                      "rotation": 0.0,
                      "quad": [
                        {
                          "x": 0.382283,
                          "y": 0.328045
                        },
                        {
                          "x": 0.379713,
                          "y": 0.432183
                        },
                        {
                          "x": 0.261259,
                          "y": 0.480982
                        },
                        {
                          "x": 0.266293,
                          "y": 0.377177
                        }
                      ],
                      "visible": true
                    },
                    "right": {
                      "x": 0.6579,
                      "y": 0.2913,
                      "rotation": 0.0,
                      "quad": [
                        {
                          "x": 0.60102,
                          "y": 0.316726
                        },
                        {
                          "x": 0.598903,
                          "y": 0.217016
                        },
                        {
                          "x": 0.712926,
                          "y": 0.266638
                        },
                        {
                          "x": 0.717423,
                          "y": 0.366089
                        }
                      ],
                      "visible": true
                    }
                  },
                  "up": {
                    "auto": "left",
                    "left": {
                      "x": 0.5,
                      "y": 0.54,
                      "rotation": 0.0,
                      "quad": [
                        {
                          "x": 0.428185,
                          "y": 0.469045
                        },
                        {
                          "x": 0.571815,
                          "y": 0.469045
                        },
                        {
                          "x": 0.572185,
                          "y": 0.61132
                        },
                        {
                          "x": 0.427815,
                          "y": 0.61132
                        }
                      ],
                      "visible": true
                    },
                    "right": {
                      "x": 0.3572,
                      "y": 0.2805,
                      "rotation": 0.0,
                      "quad": [
                        {
                          "x": 0.424598,
                          "y": 0.298341
                        },
                        {
                          "x": 0.285393,
                          "y": 0.298341
                        },
                        {
                          "x": 0.291933,
                          "y": 0.263245
                        },
                        {
                          "x": 0.426895,
                          "y": 0.263245
                        }
                      ],
                      "visible": true
                    }
                  },
                  "left": {
                    "auto": "left",
                    "left": {
                      "x": 0.678,
                      "y": 0.4042,
                      "rotation": 0.0,
                      "quad": [
                        {
                          "x": 0.620287,
                          "y": 0.432183
                        },
                        {
                          "x": 0.617717,
                          "y": 0.328045
                        },
                        {
                          "x": 0.733707,
                          "y": 0.377177
                        },
                        {
                          "x": 0.738741,
                          "y": 0.480982
                        }
                      ],
                      "visible": true
                    },
                    "right": {
                      "x": 0.3348,
                      "y": 0.5082,
                      "rotation": 0.0,
                      "quad": [
                        {
                          "x": 0.396583,
                          "y": 0.429676
                        },
                        {
                          "x": 0.394266,
                          "y": 0.538803
                        },
                        {
                          "x": 0.272571,
                          "y": 0.587392
                        },
                        {
                          "x": 0.277486,
                          "y": 0.47868
                        }
                      ],
                      "visible": true
                    }
                  }
                },
                "anchorReview": true,
                "required": false,
                "baseSticker": false,
                "defaultScale": 1.31,
                "defaultAnchorChoice": "auto",
                "defaultStickerId": "general-heart",
                "defaultColorId": "rose"
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
                        "y": 1,
                        "side": "south"
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
          "liveRevision": 11,
          "revisions": {
            "11": {
              "name": "Cardboard Box",
              "tier": 2,
              "revision": 11,
              "status": "live",
              "width": 1,
              "height": 1,
              "sprites": {
                "down": "img/Buildings/Camp Runtime/cardboard-box/tier-2/revision-11/down.png",
                "right": "img/Buildings/Camp Runtime/cardboard-box/tier-2/revision-11/right.png",
                "up": "img/Buildings/Camp Runtime/cardboard-box/tier-2/revision-11/up.png",
                "left": "img/Buildings/Camp Runtime/cardboard-box/tier-2/revision-11/left.png"
              },
              "groundingSprites": {
                "down": "img/Buildings/Camp Runtime/cardboard-box/tier-2/revision-11/grounding-down.png",
                "right": "img/Buildings/Camp Runtime/cardboard-box/tier-2/revision-11/grounding-right.png",
                "up": "img/Buildings/Camp Runtime/cardboard-box/tier-2/revision-11/grounding-up.png",
                "left": "img/Buildings/Camp Runtime/cardboard-box/tier-2/revision-11/grounding-left.png"
              },
              "groundingBounds": {
                "down": {
                  "x": -1.0,
                  "y": -1.0,
                  "width": 3.0,
                  "height": 3.0
                },
                "right": {
                  "x": -1.0,
                  "y": -1.0,
                  "width": 3.0,
                  "height": 3.0
                },
                "up": {
                  "x": -1.0,
                  "y": -1.0,
                  "width": 3.0,
                  "height": 3.0
                },
                "left": {
                  "x": -1.0,
                  "y": -1.0,
                  "width": 3.0,
                  "height": 3.0
                }
              },
              "stickerSlot": {
                "id": "front-surface",
                "enabled": true,
                "mode": "surface",
                "category": "general",
                "anchors": {
                  "down": {
                    "auto": "surface",
                    "surface": {
                      "x": 0.64,
                      "y": 0.52,
                      "quad": [
                        {
                          "x": 0.567826,
                          "y": 0.449096
                        },
                        {
                          "x": 0.711457,
                          "y": 0.449096
                        },
                        {
                          "x": 0.712546,
                          "y": 0.591269
                        },
                        {
                          "x": 0.568175,
                          "y": 0.591269
                        }
                      ],
                      "visible": true
                    }
                  },
                  "right": {
                    "auto": "surface",
                    "surface": {
                      "x": 0.6582,
                      "y": 0.2982,
                      "quad": [
                        {
                          "x": 0.60117,
                          "y": 0.323809
                        },
                        {
                          "x": 0.599047,
                          "y": 0.223805
                        },
                        {
                          "x": 0.713232,
                          "y": 0.273411
                        },
                        {
                          "x": 0.717742,
                          "y": 0.373152
                        }
                      ],
                      "visible": true
                    }
                  },
                  "up": {
                    "auto": "surface",
                    "surface": {
                      "x": 0.3668,
                      "y": 0.2805,
                      "quad": [
                        {
                          "x": 0.434264,
                          "y": 0.298341
                        },
                        {
                          "x": 0.29506,
                          "y": 0.298341
                        },
                        {
                          "x": 0.301305,
                          "y": 0.263245
                        },
                        {
                          "x": 0.436268,
                          "y": 0.263245
                        }
                      ],
                      "visible": true
                    }
                  },
                  "left": {
                    "auto": "surface",
                    "surface": {
                      "x": 0.3351,
                      "y": 0.5007,
                      "quad": [
                        {
                          "x": 0.39674,
                          "y": 0.422275
                        },
                        {
                          "x": 0.39443,
                          "y": 0.531067
                        },
                        {
                          "x": 0.272919,
                          "y": 0.579688
                        },
                        {
                          "x": 0.27782,
                          "y": 0.471304
                        }
                      ],
                      "visible": true
                    }
                  }
                },
                "anchorReview": true,
                "required": false,
                "baseSticker": false,
                "defaultScale": 1.16,
                "defaultAnchorChoice": "auto",
                "defaultStickerId": "general-heart",
                "defaultColorId": "rose"
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
                        "y": 1,
                        "side": "south"
                      }
                    ],
                    "minimumReachableCells": 1
                  }
                ]
              }
            }
          }
        },
        "3": {
          "liveRevision": 7,
          "revisions": {
            "7": {
              "name": "Cardboard Box",
              "tier": 3,
              "revision": 7,
              "status": "live",
              "width": 1,
              "height": 1,
              "sprites": {
                "down": "img/Buildings/Camp Runtime/cardboard-box/tier-3/revision-7/down.png",
                "right": "img/Buildings/Camp Runtime/cardboard-box/tier-3/revision-7/right.png",
                "up": "img/Buildings/Camp Runtime/cardboard-box/tier-3/revision-7/up.png",
                "left": "img/Buildings/Camp Runtime/cardboard-box/tier-3/revision-7/left.png"
              },
              "groundingSprites": {
                "down": "img/Buildings/Camp Runtime/cardboard-box/tier-3/revision-7/grounding-down.png",
                "right": "img/Buildings/Camp Runtime/cardboard-box/tier-3/revision-7/grounding-right.png",
                "up": "img/Buildings/Camp Runtime/cardboard-box/tier-3/revision-7/grounding-up.png",
                "left": "img/Buildings/Camp Runtime/cardboard-box/tier-3/revision-7/grounding-left.png"
              },
              "groundingBounds": {
                "down": {
                  "x": -1.0,
                  "y": -1.0,
                  "width": 3.0,
                  "height": 3.0
                },
                "right": {
                  "x": -1.0,
                  "y": -1.0,
                  "width": 3.0,
                  "height": 3.0
                },
                "up": {
                  "x": -1.0,
                  "y": -1.0,
                  "width": 3.0,
                  "height": 3.0
                },
                "left": {
                  "x": -1.0,
                  "y": -1.0,
                  "width": 3.0,
                  "height": 3.0
                }
              },
              "stickerSlot": {
                "id": "front-surface",
                "enabled": true,
                "mode": "surface",
                "category": "general",
                "anchors": {
                  "down": {
                    "auto": "surface",
                    "surface": {
                      "x": 0.64,
                      "y": 0.52,
                      "quad": [
                        {
                          "x": 0.567826,
                          "y": 0.449096
                        },
                        {
                          "x": 0.711457,
                          "y": 0.449096
                        },
                        {
                          "x": 0.712546,
                          "y": 0.591269
                        },
                        {
                          "x": 0.568175,
                          "y": 0.591269
                        }
                      ],
                      "visible": true
                    }
                  },
                  "right": {
                    "auto": "surface",
                    "surface": {
                      "x": 0.6582,
                      "y": 0.2982,
                      "quad": [
                        {
                          "x": 0.60117,
                          "y": 0.323809
                        },
                        {
                          "x": 0.599047,
                          "y": 0.223805
                        },
                        {
                          "x": 0.713232,
                          "y": 0.273411
                        },
                        {
                          "x": 0.717742,
                          "y": 0.373152
                        }
                      ],
                      "visible": true
                    }
                  },
                  "up": {
                    "auto": "surface",
                    "surface": {
                      "x": 0.3668,
                      "y": 0.2805,
                      "quad": [
                        {
                          "x": 0.434264,
                          "y": 0.298341
                        },
                        {
                          "x": 0.29506,
                          "y": 0.298341
                        },
                        {
                          "x": 0.301305,
                          "y": 0.263245
                        },
                        {
                          "x": 0.436268,
                          "y": 0.263245
                        }
                      ],
                      "visible": true
                    }
                  },
                  "left": {
                    "auto": "surface",
                    "surface": {
                      "x": 0.3351,
                      "y": 0.5007,
                      "quad": [
                        {
                          "x": 0.39674,
                          "y": 0.422275
                        },
                        {
                          "x": 0.39443,
                          "y": 0.531067
                        },
                        {
                          "x": 0.272919,
                          "y": 0.579688
                        },
                        {
                          "x": 0.27782,
                          "y": 0.471304
                        }
                      ],
                      "visible": true
                    }
                  }
                },
                "anchorReview": true,
                "required": false,
                "baseSticker": false,
                "defaultScale": 1.16,
                "defaultAnchorChoice": "auto",
                "defaultStickerId": "general-heart",
                "defaultColorId": "rose"
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
                        "y": 1,
                        "side": "south"
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
    "cardboardLitterbox": {
      "assetId": "cardboard-litterbox",
      "name": "Cardboard Litterbox",
      "category": "decoration",
      "placeable": true,
      "tiers": {
        "1": {
          "liveRevision": 6,
          "revisions": {
            "6": {
              "name": "Cardboard Litterbox",
              "tier": 1,
              "revision": 6,
              "status": "live",
              "width": 1,
              "height": 1,
              "sprites": {
                "down": "img/Buildings/Camp Runtime/cardboard-litterbox/tier-1/revision-6/down.png",
                "right": "img/Buildings/Camp Runtime/cardboard-litterbox/tier-1/revision-6/right.png",
                "up": "img/Buildings/Camp Runtime/cardboard-litterbox/tier-1/revision-6/up.png",
                "left": "img/Buildings/Camp Runtime/cardboard-litterbox/tier-1/revision-6/left.png"
              },
              "groundingSprites": {
                "down": "img/Buildings/Camp Runtime/cardboard-litterbox/tier-1/revision-6/grounding-down.png",
                "right": "img/Buildings/Camp Runtime/cardboard-litterbox/tier-1/revision-6/grounding-right.png",
                "up": "img/Buildings/Camp Runtime/cardboard-litterbox/tier-1/revision-6/grounding-up.png",
                "left": "img/Buildings/Camp Runtime/cardboard-litterbox/tier-1/revision-6/grounding-left.png"
              },
              "groundingBounds": {
                "down": {
                  "x": -1.0,
                  "y": -1.0,
                  "width": 3.0,
                  "height": 3.0
                },
                "right": {
                  "x": -1.0,
                  "y": -1.0,
                  "width": 3.0,
                  "height": 3.0
                },
                "up": {
                  "x": -1.0,
                  "y": -1.0,
                  "width": 3.0,
                  "height": 3.0
                },
                "left": {
                  "x": -1.0,
                  "y": -1.0,
                  "width": 3.0,
                  "height": 3.0
                }
              }
            }
          }
        }
      }
    },
    "catStatueV2": {
      "assetId": "cat-statue-v2",
      "name": "Cat Statue",
      "category": "decoration",
      "placeable": true,
      "tiers": {
        "1": {
          "liveRevision": 6,
          "revisions": {
            "6": {
              "name": "Cat Statue",
              "tier": 1,
              "revision": 6,
              "status": "live",
              "width": 1,
              "height": 1,
              "sprites": {
                "down": "img/Buildings/Camp Runtime/cat-statue-v2/tier-1/revision-6/down.png",
                "right": "img/Buildings/Camp Runtime/cat-statue-v2/tier-1/revision-6/right.png",
                "up": "img/Buildings/Camp Runtime/cat-statue-v2/tier-1/revision-6/up.png",
                "left": "img/Buildings/Camp Runtime/cat-statue-v2/tier-1/revision-6/left.png"
              },
              "groundingSprites": {
                "down": "img/Buildings/Camp Runtime/cat-statue-v2/tier-1/revision-6/grounding-down.png",
                "right": "img/Buildings/Camp Runtime/cat-statue-v2/tier-1/revision-6/grounding-right.png",
                "up": "img/Buildings/Camp Runtime/cat-statue-v2/tier-1/revision-6/grounding-up.png",
                "left": "img/Buildings/Camp Runtime/cat-statue-v2/tier-1/revision-6/grounding-left.png"
              },
              "groundingBounds": {
                "down": {
                  "x": -1.0,
                  "y": -1.0,
                  "width": 3.0,
                  "height": 3.0
                },
                "right": {
                  "x": -1.0,
                  "y": -1.0,
                  "width": 3.0,
                  "height": 3.0
                },
                "up": {
                  "x": -1.0,
                  "y": -1.0,
                  "width": 3.0,
                  "height": 3.0
                },
                "left": {
                  "x": -1.0,
                  "y": -1.0,
                  "width": 3.0,
                  "height": 3.0
                }
              }
            }
          }
        }
      }
    },
    "catchen": {
      "assetId": "catchen",
      "name": "Catchen",
      "category": "production-building",
      "placeable": true,
      "tiers": {
        "1": {
          "liveRevision": 8,
          "revisions": {
            "8": {
              "name": "Catchen",
              "tier": 1,
              "revision": 8,
              "status": "live",
              "width": 2,
              "height": 1,
              "sprites": {
                "down": "img/Buildings/Camp Runtime/catchen/tier-1/revision-8/down.png",
                "right": "img/Buildings/Camp Runtime/catchen/tier-1/revision-8/right.png",
                "up": "img/Buildings/Camp Runtime/catchen/tier-1/revision-8/up.png",
                "left": "img/Buildings/Camp Runtime/catchen/tier-1/revision-8/left.png"
              },
              "groundingSprites": {
                "down": "img/Buildings/Camp Runtime/catchen/tier-1/revision-8/grounding-down.png",
                "right": "img/Buildings/Camp Runtime/catchen/tier-1/revision-8/grounding-right.png",
                "up": "img/Buildings/Camp Runtime/catchen/tier-1/revision-8/grounding-up.png",
                "left": "img/Buildings/Camp Runtime/catchen/tier-1/revision-8/grounding-left.png"
              },
              "groundingBounds": {
                "down": {
                  "x": -1.0,
                  "y": -1.0,
                  "width": 4.0,
                  "height": 3.0
                },
                "right": {
                  "x": -1.0,
                  "y": -1.0,
                  "width": 3.0,
                  "height": 4.0
                },
                "up": {
                  "x": -1.0,
                  "y": -1.0,
                  "width": 4.0,
                  "height": 3.0
                },
                "left": {
                  "x": -1.0,
                  "y": -1.0,
                  "width": 3.0,
                  "height": 4.0
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
                        "y": 1,
                        "side": "south"
                      },
                      {
                        "x": 1,
                        "y": 1,
                        "side": "south"
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
          "liveRevision": 8,
          "revisions": {
            "8": {
              "name": "Catchen",
              "tier": 2,
              "revision": 8,
              "status": "live",
              "width": 3,
              "height": 1,
              "sprites": {
                "down": "img/Buildings/Camp Runtime/catchen/tier-2/revision-8/down.png",
                "right": "img/Buildings/Camp Runtime/catchen/tier-2/revision-8/right.png",
                "up": "img/Buildings/Camp Runtime/catchen/tier-2/revision-8/up.png",
                "left": "img/Buildings/Camp Runtime/catchen/tier-2/revision-8/left.png"
              },
              "groundingSprites": {
                "down": "img/Buildings/Camp Runtime/catchen/tier-2/revision-8/grounding-down.png",
                "right": "img/Buildings/Camp Runtime/catchen/tier-2/revision-8/grounding-right.png",
                "up": "img/Buildings/Camp Runtime/catchen/tier-2/revision-8/grounding-up.png",
                "left": "img/Buildings/Camp Runtime/catchen/tier-2/revision-8/grounding-left.png"
              },
              "groundingBounds": {
                "down": {
                  "x": -1.0,
                  "y": -1.0,
                  "width": 5.0,
                  "height": 3.0
                },
                "right": {
                  "x": -1.0,
                  "y": -1.0,
                  "width": 3.0,
                  "height": 5.0
                },
                "up": {
                  "x": -1.0,
                  "y": -1.0,
                  "width": 5.0,
                  "height": 3.0
                },
                "left": {
                  "x": -1.0,
                  "y": -1.0,
                  "width": 3.0,
                  "height": 5.0
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
                        "y": 1,
                        "side": "south"
                      },
                      {
                        "x": 1,
                        "y": 1,
                        "side": "south"
                      },
                      {
                        "x": 2,
                        "y": 1,
                        "side": "south"
                      }
                    ],
                    "minimumReachableCells": 3
                  }
                ]
              }
            }
          }
        }
      }
    },
    "junkFlowerBush": {
      "assetId": "junk-flower-bush",
      "name": "Flowering Bush",
      "category": "junk",
      "placeable": true,
      "tiers": {
        "1": {
          "liveRevision": 3,
          "revisions": {
            "3": {
              "name": "Flowering Bush",
              "tier": 1,
              "revision": 3,
              "status": "live",
              "width": 2,
              "height": 1,
              "sprites": {
                "down": "img/Buildings/Camp Runtime/junk-flower-bush/tier-1/revision-3/down.png",
                "right": "img/Buildings/Camp Runtime/junk-flower-bush/tier-1/revision-3/right.png",
                "up": "img/Buildings/Camp Runtime/junk-flower-bush/tier-1/revision-3/up.png",
                "left": "img/Buildings/Camp Runtime/junk-flower-bush/tier-1/revision-3/left.png"
              },
              "groundingSprites": {
                "down": "img/Buildings/Camp Runtime/junk-flower-bush/tier-1/revision-3/grounding-down.png",
                "right": "img/Buildings/Camp Runtime/junk-flower-bush/tier-1/revision-3/grounding-right.png",
                "up": "img/Buildings/Camp Runtime/junk-flower-bush/tier-1/revision-3/grounding-up.png",
                "left": "img/Buildings/Camp Runtime/junk-flower-bush/tier-1/revision-3/grounding-left.png"
              },
              "groundingBounds": {
                "down": {
                  "x": -0.45,
                  "y": -0.45,
                  "width": 2.9,
                  "height": 1.9
                },
                "right": {
                  "x": -0.45,
                  "y": -0.45,
                  "width": 2.9,
                  "height": 1.9
                },
                "up": {
                  "x": -0.45,
                  "y": -0.45,
                  "width": 2.9,
                  "height": 1.9
                },
                "left": {
                  "x": -0.45,
                  "y": -0.45,
                  "width": 2.9,
                  "height": 1.9
                }
              },
              "gameplay": {
                "clearDurationSeconds": 1800,
                "minCatLevel": 2,
                "requiredCats": 2
              }
            }
          }
        }
      }
    },
    "junkGreenBush": {
      "assetId": "junk-green-bush",
      "name": "Green Bush",
      "category": "junk",
      "placeable": true,
      "tiers": {
        "1": {
          "liveRevision": 5,
          "revisions": {
            "5": {
              "name": "Green Bush",
              "tier": 1,
              "revision": 5,
              "status": "live",
              "width": 2,
              "height": 1,
              "sprites": {
                "down": "img/Buildings/Camp Runtime/junk-green-bush/tier-1/revision-5/down.png",
                "right": "img/Buildings/Camp Runtime/junk-green-bush/tier-1/revision-5/right.png",
                "up": "img/Buildings/Camp Runtime/junk-green-bush/tier-1/revision-5/up.png",
                "left": "img/Buildings/Camp Runtime/junk-green-bush/tier-1/revision-5/left.png"
              },
              "groundingSprites": {
                "down": "img/Buildings/Camp Runtime/junk-green-bush/tier-1/revision-5/grounding-down.png",
                "right": "img/Buildings/Camp Runtime/junk-green-bush/tier-1/revision-5/grounding-right.png",
                "up": "img/Buildings/Camp Runtime/junk-green-bush/tier-1/revision-5/grounding-up.png",
                "left": "img/Buildings/Camp Runtime/junk-green-bush/tier-1/revision-5/grounding-left.png"
              },
              "groundingBounds": {
                "down": {
                  "x": -0.45,
                  "y": -0.45,
                  "width": 2.9,
                  "height": 1.9
                },
                "right": {
                  "x": -0.45,
                  "y": -0.45,
                  "width": 2.9,
                  "height": 1.9
                },
                "up": {
                  "x": -0.45,
                  "y": -0.45,
                  "width": 2.9,
                  "height": 1.9
                },
                "left": {
                  "x": -0.45,
                  "y": -0.45,
                  "width": 2.9,
                  "height": 1.9
                }
              },
              "gameplay": {
                "clearDurationSeconds": 1200,
                "minCatLevel": 0,
                "requiredCats": 2
              }
            }
          }
        }
      }
    },
    "jobCenter": {
      "assetId": "job-center",
      "name": "Job Center",
      "category": "building",
      "placeable": true,
      "tiers": {
        "1": {
          "liveRevision": 10,
          "revisions": {
            "10": {
              "name": "Job Center",
              "tier": 1,
              "revision": 10,
              "status": "live",
              "width": 2,
              "height": 2,
              "sprites": {
                "down": "img/Buildings/Camp Runtime/job-center/tier-1/revision-10/down.png",
                "right": "img/Buildings/Camp Runtime/job-center/tier-1/revision-10/right.png",
                "up": "img/Buildings/Camp Runtime/job-center/tier-1/revision-10/up.png",
                "left": "img/Buildings/Camp Runtime/job-center/tier-1/revision-10/left.png"
              },
              "groundingSprites": {
                "down": "img/Buildings/Camp Runtime/job-center/tier-1/revision-10/grounding-down.png",
                "right": "img/Buildings/Camp Runtime/job-center/tier-1/revision-10/grounding-right.png",
                "up": "img/Buildings/Camp Runtime/job-center/tier-1/revision-10/grounding-up.png",
                "left": "img/Buildings/Camp Runtime/job-center/tier-1/revision-10/grounding-left.png"
              },
              "groundingBounds": {
                "down": {
                  "x": -1.0,
                  "y": -1.0,
                  "width": 4.0,
                  "height": 4.0
                },
                "right": {
                  "x": -1.0,
                  "y": -1.0,
                  "width": 4.0,
                  "height": 4.0
                },
                "up": {
                  "x": -1.0,
                  "y": -1.0,
                  "width": 4.0,
                  "height": 4.0
                },
                "left": {
                  "x": -1.0,
                  "y": -1.0,
                  "width": 4.0,
                  "height": 4.0
                }
              },
              "stickerSlot": {
                "id": "jobs-emblem",
                "enabled": true,
                "mode": "pitched-roof",
                "category": "jobs",
                "anchors": {
                  "down": {
                    "auto": "right",
                    "left": {
                      "x": 0.5,
                      "y": 0.2336,
                      "rotation": 0.0,
                      "quad": [
                        {
                          "x": 0.56591,
                          "y": 0.188019
                        },
                        {
                          "x": 0.43409,
                          "y": 0.188019
                        },
                        {
                          "x": 0.435649,
                          "y": 0.278129
                        },
                        {
                          "x": 0.564351,
                          "y": 0.278129
                        }
                      ],
                      "visible": false
                    },
                    "right": {
                      "x": 0.73,
                      "y": 0.74,
                      "rotation": 0.0,
                      "quad": [
                        {
                          "x": 0.66012,
                          "y": 0.696318
                        },
                        {
                          "x": 0.806051,
                          "y": 0.696318
                        },
                        {
                          "x": 0.798054,
                          "y": 0.782541
                        },
                        {
                          "x": 0.655936,
                          "y": 0.782541
                        }
                      ],
                      "visible": true
                    }
                  },
                  "right": {
                    "auto": "left",
                    "left": {
                      "x": 0.1748,
                      "y": 0.4694,
                      "rotation": 0.0,
                      "quad": [
                        {
                          "x": 0.174156,
                          "y": 0.372751
                        },
                        {
                          "x": 0.167118,
                          "y": 0.477259
                        },
                        {
                          "x": 0.175472,
                          "y": 0.56557
                        },
                        {
                          "x": 0.182165,
                          "y": 0.461809
                        }
                      ],
                      "visible": false
                    },
                    "right": {
                      "x": 0.8137,
                      "y": 0.3184,
                      "rotation": 0.0,
                      "quad": [
                        {
                          "x": 0.820844,
                          "y": 0.322545
                        },
                        {
                          "x": 0.814281,
                          "y": 0.2246
                        },
                        {
                          "x": 0.806802,
                          "y": 0.314357
                        },
                        {
                          "x": 0.813054,
                          "y": 0.411752
                        }
                      ],
                      "visible": false
                    }
                  },
                  "up": {
                    "auto": "left",
                    "left": {
                      "x": 0.5,
                      "y": 0.73,
                      "rotation": 0.0,
                      "quad": [
                        {
                          "x": 0.427034,
                          "y": 0.686184
                        },
                        {
                          "x": 0.572966,
                          "y": 0.686184
                        },
                        {
                          "x": 0.571059,
                          "y": 0.772671
                        },
                        {
                          "x": 0.428941,
                          "y": 0.772671
                        }
                      ],
                      "visible": true
                    },
                    "right": {
                      "x": 0.2919,
                      "y": 0.244,
                      "rotation": 0.0,
                      "quad": [
                        {
                          "x": 0.35532,
                          "y": 0.198554
                        },
                        {
                          "x": 0.223461,
                          "y": 0.198554
                        },
                        {
                          "x": 0.230006,
                          "y": 0.28844
                        },
                        {
                          "x": 0.358745,
                          "y": 0.28844
                        }
                      ],
                      "visible": false
                    }
                  },
                  "left": {
                    "auto": "left",
                    "left": {
                      "x": 0.8252,
                      "y": 0.4694,
                      "rotation": 0.0,
                      "quad": [
                        {
                          "x": 0.832882,
                          "y": 0.477259
                        },
                        {
                          "x": 0.825844,
                          "y": 0.372751
                        },
                        {
                          "x": 0.817835,
                          "y": 0.461809
                        },
                        {
                          "x": 0.824528,
                          "y": 0.56557
                        }
                      ],
                      "visible": false
                    },
                    "right": {
                      "x": 0.1645,
                      "y": 0.6521,
                      "rotation": 0.0,
                      "quad": [
                        {
                          "x": 0.163746,
                          "y": 0.552505
                        },
                        {
                          "x": 0.156223,
                          "y": 0.664787
                        },
                        {
                          "x": 0.165152,
                          "y": 0.751315
                        },
                        {
                          "x": 0.172294,
                          "y": 0.640042
                        }
                      ],
                      "visible": false
                    }
                  }
                },
                "anchorReview": true,
                "required": false,
                "baseSticker": false,
                "defaultScale": 1.46,
                "defaultAnchorChoice": "auto",
                "defaultStickerId": "jobs-briefcase-paw",
                "defaultColorId": "kraft"
              },
              "access": {
                "activationPolicy": "all-ports-reachable",
                "ports": [
                  {
                    "id": "main-access",
                    "side": "south",
                    "cellPolicy": "all-cells-reachable",
                    "approachCells": [
                      {
                        "x": 0,
                        "y": 2,
                        "side": "south"
                      },
                      {
                        "x": 1,
                        "y": 2,
                        "side": "south"
                      }
                    ],
                    "minimumReachableCells": 2
                  }
                ]
              }
            }
          }
        },
        "2": {
          "liveRevision": 6,
          "revisions": {
            "6": {
              "name": "Job Center",
              "tier": 2,
              "revision": 6,
              "status": "live",
              "width": 2,
              "height": 3,
              "sprites": {
                "down": "img/Buildings/Camp Runtime/job-center/tier-2/revision-6/down.png",
                "right": "img/Buildings/Camp Runtime/job-center/tier-2/revision-6/right.png",
                "up": "img/Buildings/Camp Runtime/job-center/tier-2/revision-6/up.png",
                "left": "img/Buildings/Camp Runtime/job-center/tier-2/revision-6/left.png"
              },
              "groundingSprites": {
                "down": "img/Buildings/Camp Runtime/job-center/tier-2/revision-6/grounding-down.png",
                "right": "img/Buildings/Camp Runtime/job-center/tier-2/revision-6/grounding-right.png",
                "up": "img/Buildings/Camp Runtime/job-center/tier-2/revision-6/grounding-up.png",
                "left": "img/Buildings/Camp Runtime/job-center/tier-2/revision-6/grounding-left.png"
              },
              "groundingBounds": {
                "down": {
                  "x": -1.0,
                  "y": -1.0,
                  "width": 4.0,
                  "height": 5.0
                },
                "right": {
                  "x": -1.0,
                  "y": -1.0,
                  "width": 5.0,
                  "height": 4.0
                },
                "up": {
                  "x": -1.0,
                  "y": -1.0,
                  "width": 4.0,
                  "height": 5.0
                },
                "left": {
                  "x": -1.0,
                  "y": -1.0,
                  "width": 5.0,
                  "height": 4.0
                }
              },
              "stickerSlot": {
                "id": "jobs-emblem",
                "enabled": true,
                "mode": "pitched-roof",
                "category": "jobs",
                "anchors": {
                  "down": {
                    "auto": "right",
                    "left": {
                      "x": 0.6011,
                      "y": 0.0,
                      "rotation": -85.0,
                      "quad": [
                        {
                          "x": 0.545356,
                          "y": -0.09715
                        },
                        {
                          "x": 0.64912,
                          "y": -0.032712
                        },
                        {
                          "x": 0.655335,
                          "y": -0.149137
                        },
                        {
                          "x": 0.55353,
                          "y": -0.213268
                        }
                      ],
                      "visible": false
                    },
                    "right": {
                      "x": 0.62,
                      "y": 0.48,
                      "rotation": 85.0,
                      "quad": [
                        {
                          "x": 0.668879,
                          "y": 0.426808
                        },
                        {
                          "x": 0.558524,
                          "y": 0.386423
                        },
                        {
                          "x": 0.569629,
                          "y": 0.534816
                        },
                        {
                          "x": 0.681894,
                          "y": 0.574213
                        }
                      ],
                      "visible": true
                    }
                  },
                  "right": {
                    "auto": "right",
                    "left": {
                      "x": 0.2299,
                      "y": 0.0517,
                      "rotation": -85.0,
                      "quad": [
                        {
                          "x": 0.280626,
                          "y": 0.0855
                        },
                        {
                          "x": 0.296403,
                          "y": 0.024101
                        },
                        {
                          "x": 0.180648,
                          "y": 0.018878
                        },
                        {
                          "x": 0.161888,
                          "y": 0.08
                        }
                      ],
                      "visible": true
                    },
                    "right": {
                      "x": 0.7655,
                      "y": 0.0462,
                      "rotation": 85.0,
                      "quad": [
                        {
                          "x": 0.699187,
                          "y": 0.018664
                        },
                        {
                          "x": 0.714836,
                          "y": 0.079871
                        },
                        {
                          "x": 0.833488,
                          "y": 0.074388
                        },
                        {
                          "x": 0.814861,
                          "y": 0.013457
                        }
                      ],
                      "visible": true
                    }
                  },
                  "up": {
                    "auto": "left",
                    "left": {
                      "x": 0.39,
                      "y": 0.48,
                      "rotation": -85.0,
                      "quad": [
                        {
                          "x": 0.451443,
                          "y": 0.386421
                        },
                        {
                          "x": 0.340972,
                          "y": 0.426807
                        },
                        {
                          "x": 0.328139,
                          "y": 0.574214
                        },
                        {
                          "x": 0.440525,
                          "y": 0.534816
                        }
                      ],
                      "visible": true
                    },
                    "right": {
                      "x": 0.3896,
                      "y": 0.0,
                      "rotation": 85.0,
                      "quad": [
                        {
                          "x": 0.341436,
                          "y": -0.023697
                        },
                        {
                          "x": 0.445262,
                          "y": -0.088149
                        },
                        {
                          "x": 0.437251,
                          "y": -0.204581
                        },
                        {
                          "x": 0.335386,
                          "y": -0.140434
                        }
                      ],
                      "visible": false
                    }
                  },
                  "left": {
                    "auto": "left",
                    "left": {
                      "x": 0.779,
                      "y": 0.283,
                      "rotation": -85.0,
                      "quad": [
                        {
                          "x": 0.722571,
                          "y": 0.188029
                        },
                        {
                          "x": 0.7135,
                          "y": 0.363271
                        },
                        {
                          "x": 0.835846,
                          "y": 0.378724
                        },
                        {
                          "x": 0.844041,
                          "y": 0.20326
                        }
                      ],
                      "visible": true
                    },
                    "right": {
                      "x": 0.2249,
                      "y": 0.2989,
                      "rotation": 85.0,
                      "quad": [
                        {
                          "x": 0.290501,
                          "y": 0.379355
                        },
                        {
                          "x": 0.281381,
                          "y": 0.203617
                        },
                        {
                          "x": 0.15965,
                          "y": 0.218891
                        },
                        {
                          "x": 0.16789,
                          "y": 0.394852
                        }
                      ],
                      "visible": true
                    }
                  }
                },
                "anchorReview": true,
                "required": true,
                "baseSticker": true,
                "defaultScale": 1.19,
                "defaultAnchorChoice": "auto",
                "defaultStickerId": "jobs-briefcase-paw",
                "defaultColorId": "kraft"
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
                        "y": 3,
                        "side": "south"
                      },
                      {
                        "x": 1,
                        "y": 3,
                        "side": "south"
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
    "laboratory": {
      "assetId": "laboratory",
      "name": "Laboratory",
      "category": "building",
      "placeable": true,
      "tiers": {
        "1": {
          "liveRevision": 1,
          "revisions": {
            "1": {
              "name": "Laboratory",
              "tier": 1,
              "revision": 1,
              "status": "live",
              "width": 3,
              "height": 1,
              "sprites": {
                "down": "img/Buildings/Laboratory_Final.png",
                "right": "img/Buildings/Laboratory_Final.png",
                "up": "img/Buildings/Laboratory_Final.png",
                "left": "img/Buildings/Laboratory_Final.png"
              },
              "stickerSlot": {
                "id": "jobs-emblem",
                "enabled": true,
                "mode": "surface",
                "category": "jobs",
                "anchors": {
                  "down": {
                    "auto": "surface",
                    "surface": {
                      "x": 0.5,
                      "y": 0.38
                    }
                  },
                  "right": {
                    "auto": "surface",
                    "surface": {
                      "x": 0.5,
                      "y": 0.38
                    }
                  },
                  "up": {
                    "auto": "surface",
                    "surface": {
                      "x": 0.5,
                      "y": 0.38
                    }
                  },
                  "left": {
                    "auto": "surface",
                    "surface": {
                      "x": 0.5,
                      "y": 0.38
                    }
                  }
                },
                "anchorReview": true,
                "required": true,
                "baseSticker": true,
                "defaultScale": 0.8,
                "defaultAnchorChoice": "auto",
                "defaultStickerId": "jobs-briefcase-paw",
                "defaultColorId": "sky-blue"
              },
              "access": {
                "activationPolicy": "all-ports-reachable",
                "ports": [
                  {
                    "id": "main-access",
                    "side": "south",
                    "cellPolicy": "all-cells-reachable",
                    "approachCells": [
                      {
                        "x": 1,
                        "y": 1,
                        "side": "south"
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
    "lanternOnPole": {
      "assetId": "lantern-on-pole",
      "name": "Lantern on pole",
      "category": "decoration",
      "placeable": true,
      "tiers": {
        "1": {
          "liveRevision": 7,
          "revisions": {
            "7": {
              "name": "Lantern on pole",
              "tier": 1,
              "revision": 7,
              "status": "live",
              "width": 1,
              "height": 1,
              "sprites": {
                "down": "img/Buildings/Camp Runtime/lantern-on-pole/tier-1/revision-7/down.png",
                "right": "img/Buildings/Camp Runtime/lantern-on-pole/tier-1/revision-7/right.png",
                "up": "img/Buildings/Camp Runtime/lantern-on-pole/tier-1/revision-7/up.png",
                "left": "img/Buildings/Camp Runtime/lantern-on-pole/tier-1/revision-7/left.png"
              },
              "groundingSprites": {
                "down": "img/Buildings/Camp Runtime/lantern-on-pole/tier-1/revision-7/grounding-down.png",
                "right": "img/Buildings/Camp Runtime/lantern-on-pole/tier-1/revision-7/grounding-right.png",
                "up": "img/Buildings/Camp Runtime/lantern-on-pole/tier-1/revision-7/grounding-up.png",
                "left": "img/Buildings/Camp Runtime/lantern-on-pole/tier-1/revision-7/grounding-left.png"
              },
              "groundingBounds": {
                "down": {
                  "x": -1.0,
                  "y": -1.0,
                  "width": 3.0,
                  "height": 3.0
                },
                "right": {
                  "x": -1.0,
                  "y": -1.0,
                  "width": 3.0,
                  "height": 3.0
                },
                "up": {
                  "x": -1.0,
                  "y": -1.0,
                  "width": 3.0,
                  "height": 3.0
                },
                "left": {
                  "x": -1.0,
                  "y": -1.0,
                  "width": 3.0,
                  "height": 3.0
                }
              }
            }
          }
        }
      }
    },
    "marketStall": {
      "assetId": "market-stall",
      "name": "Market Stall",
      "category": "building",
      "placeable": true,
      "tiers": {
        "1": {
          "liveRevision": 8,
          "revisions": {
            "8": {
              "name": "Market Stall",
              "tier": 1,
              "revision": 8,
              "status": "live",
              "width": 2,
              "height": 2,
              "sprites": {
                "down": "img/Buildings/Camp Runtime/market-stall/tier-1/revision-8/down.png",
                "right": "img/Buildings/Camp Runtime/market-stall/tier-1/revision-8/right.png",
                "up": "img/Buildings/Camp Runtime/market-stall/tier-1/revision-8/up.png",
                "left": "img/Buildings/Camp Runtime/market-stall/tier-1/revision-8/left.png"
              },
              "groundingSprites": {
                "down": "img/Buildings/Camp Runtime/market-stall/tier-1/revision-8/grounding-down.png",
                "right": "img/Buildings/Camp Runtime/market-stall/tier-1/revision-8/grounding-right.png",
                "up": "img/Buildings/Camp Runtime/market-stall/tier-1/revision-8/grounding-up.png",
                "left": "img/Buildings/Camp Runtime/market-stall/tier-1/revision-8/grounding-left.png"
              },
              "groundingBounds": {
                "down": {
                  "x": -1.0,
                  "y": -1.0,
                  "width": 4.0,
                  "height": 4.0
                },
                "right": {
                  "x": -1.0,
                  "y": -1.0,
                  "width": 4.0,
                  "height": 4.0
                },
                "up": {
                  "x": -1.0,
                  "y": -1.0,
                  "width": 4.0,
                  "height": 4.0
                },
                "left": {
                  "x": -1.0,
                  "y": -1.0,
                  "width": 4.0,
                  "height": 4.0
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
                        "y": 2,
                        "side": "south"
                      },
                      {
                        "x": 1,
                        "y": 2,
                        "side": "south"
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
    "operationTable": {
      "assetId": "operation-table",
      "name": "Operation Table",
      "category": "building",
      "placeable": true,
      "tiers": {
        "1": {
          "liveRevision": 16,
          "revisions": {
            "16": {
              "name": "Operation Table",
              "tier": 1,
              "revision": 16,
              "status": "live",
              "width": 2,
              "height": 1,
              "sprites": {
                "down": "img/Buildings/Camp Runtime/operation-table/tier-1/revision-16/down.png",
                "right": "img/Buildings/Camp Runtime/operation-table/tier-1/revision-16/right.png",
                "up": "img/Buildings/Camp Runtime/operation-table/tier-1/revision-16/up.png",
                "left": "img/Buildings/Camp Runtime/operation-table/tier-1/revision-16/left.png"
              },
              "groundingSprites": {
                "down": "img/Buildings/Camp Runtime/operation-table/tier-1/revision-16/grounding-down.png",
                "right": "img/Buildings/Camp Runtime/operation-table/tier-1/revision-16/grounding-right.png",
                "up": "img/Buildings/Camp Runtime/operation-table/tier-1/revision-16/grounding-up.png",
                "left": "img/Buildings/Camp Runtime/operation-table/tier-1/revision-16/grounding-left.png"
              },
              "groundingBounds": {
                "down": {
                  "x": -1.0,
                  "y": -1.0,
                  "width": 4.0,
                  "height": 3.0
                },
                "right": {
                  "x": -1.0,
                  "y": -1.0,
                  "width": 3.0,
                  "height": 4.0
                },
                "up": {
                  "x": -1.0,
                  "y": -1.0,
                  "width": 4.0,
                  "height": 3.0
                },
                "left": {
                  "x": -1.0,
                  "y": -1.0,
                  "width": 3.0,
                  "height": 4.0
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
                        "x": 1,
                        "y": 1,
                        "side": "south"
                      },
                      {
                        "x": 0,
                        "y": 1,
                        "side": "south"
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
      "name": "Pawsonry",
      "category": "production-building",
      "placeable": true,
      "tiers": {
        "1": {
          "liveRevision": 7,
          "revisions": {
            "7": {
              "name": "Pawsonry",
              "tier": 1,
              "revision": 7,
              "status": "live",
              "width": 2,
              "height": 2,
              "sprites": {
                "down": "img/Buildings/Camp Runtime/pawsonry/tier-1/revision-7/down.png",
                "right": "img/Buildings/Camp Runtime/pawsonry/tier-1/revision-7/right.png",
                "up": "img/Buildings/Camp Runtime/pawsonry/tier-1/revision-7/up.png",
                "left": "img/Buildings/Camp Runtime/pawsonry/tier-1/revision-7/left.png"
              },
              "groundingSprites": {
                "down": "img/Buildings/Camp Runtime/pawsonry/tier-1/revision-7/grounding-down.png",
                "right": "img/Buildings/Camp Runtime/pawsonry/tier-1/revision-7/grounding-right.png",
                "up": "img/Buildings/Camp Runtime/pawsonry/tier-1/revision-7/grounding-up.png",
                "left": "img/Buildings/Camp Runtime/pawsonry/tier-1/revision-7/grounding-left.png"
              },
              "groundingBounds": {
                "down": {
                  "x": -1.0,
                  "y": -1.0,
                  "width": 4.0,
                  "height": 4.0
                },
                "right": {
                  "x": -1.0,
                  "y": -1.0,
                  "width": 4.0,
                  "height": 4.0
                },
                "up": {
                  "x": -1.0,
                  "y": -1.0,
                  "width": 4.0,
                  "height": 4.0
                },
                "left": {
                  "x": -1.0,
                  "y": -1.0,
                  "width": 4.0,
                  "height": 4.0
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
                        "y": 2,
                        "side": "south"
                      },
                      {
                        "x": 1,
                        "y": 2,
                        "side": "south"
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
    "junkPebblePile": {
      "assetId": "junk-pebble-pile",
      "name": "Pile of Pebbles",
      "category": "junk",
      "placeable": true,
      "tiers": {
        "1": {
          "liveRevision": 1,
          "revisions": {
            "1": {
              "name": "Pile of Pebbles",
              "tier": 1,
              "revision": 1,
              "status": "live",
              "width": 1,
              "height": 1,
              "sprites": {
                "down": "img/Buildings/Camp Runtime/junk-pebble-pile/tier-1/revision-1/down.png",
                "right": "img/Buildings/Camp Runtime/junk-pebble-pile/tier-1/revision-1/right.png",
                "up": "img/Buildings/Camp Runtime/junk-pebble-pile/tier-1/revision-1/up.png",
                "left": "img/Buildings/Camp Runtime/junk-pebble-pile/tier-1/revision-1/left.png"
              },
              "groundingSprites": {
                "down": "img/Buildings/Camp Runtime/junk-pebble-pile/tier-1/revision-1/grounding-down.png",
                "right": "img/Buildings/Camp Runtime/junk-pebble-pile/tier-1/revision-1/grounding-right.png",
                "up": "img/Buildings/Camp Runtime/junk-pebble-pile/tier-1/revision-1/grounding-up.png",
                "left": "img/Buildings/Camp Runtime/junk-pebble-pile/tier-1/revision-1/grounding-left.png"
              },
              "groundingBounds": {
                "down": {
                  "x": -0.45,
                  "y": -0.45,
                  "width": 1.9,
                  "height": 1.9
                },
                "right": {
                  "x": -0.45,
                  "y": -0.45,
                  "width": 1.9,
                  "height": 1.9
                },
                "up": {
                  "x": -0.45,
                  "y": -0.45,
                  "width": 1.9,
                  "height": 1.9
                },
                "left": {
                  "x": -0.45,
                  "y": -0.45,
                  "width": 1.9,
                  "height": 1.9
                }
              },
              "gameplay": {
                "clearDurationSeconds": 600,
                "minCatLevel": 0,
                "requiredCats": 1
              }
            }
          }
        }
      }
    },
    "junkStoneBlockPile": {
      "assetId": "junk-stone-block-pile",
      "name": "Pile of Stone Blocks",
      "category": "junk",
      "placeable": true,
      "tiers": {
        "1": {
          "liveRevision": 2,
          "revisions": {
            "2": {
              "name": "Pile of Stone Blocks",
              "tier": 1,
              "revision": 2,
              "status": "live",
              "width": 2,
              "height": 2,
              "sprites": {
                "down": "img/Buildings/Camp Runtime/junk-stone-block-pile/tier-1/revision-2/down.png",
                "right": "img/Buildings/Camp Runtime/junk-stone-block-pile/tier-1/revision-2/right.png",
                "up": "img/Buildings/Camp Runtime/junk-stone-block-pile/tier-1/revision-2/up.png",
                "left": "img/Buildings/Camp Runtime/junk-stone-block-pile/tier-1/revision-2/left.png"
              },
              "groundingSprites": {
                "down": "img/Buildings/Camp Runtime/junk-stone-block-pile/tier-1/revision-2/grounding-down.png",
                "right": "img/Buildings/Camp Runtime/junk-stone-block-pile/tier-1/revision-2/grounding-right.png",
                "up": "img/Buildings/Camp Runtime/junk-stone-block-pile/tier-1/revision-2/grounding-up.png",
                "left": "img/Buildings/Camp Runtime/junk-stone-block-pile/tier-1/revision-2/grounding-left.png"
              },
              "groundingBounds": {
                "down": {
                  "x": -0.45,
                  "y": -0.45,
                  "width": 2.9,
                  "height": 2.9
                },
                "right": {
                  "x": -0.45,
                  "y": -0.45,
                  "width": 2.9,
                  "height": 2.9
                },
                "up": {
                  "x": -0.45,
                  "y": -0.45,
                  "width": 2.9,
                  "height": 2.9
                },
                "left": {
                  "x": -0.45,
                  "y": -0.45,
                  "width": 2.9,
                  "height": 2.9
                }
              },
              "gameplay": {
                "clearDurationSeconds": 4800,
                "minCatLevel": 8,
                "requiredCats": 3
              }
            }
          }
        }
      }
    },
    "sawmill": {
      "assetId": "sawmill",
      "name": "Sawmill",
      "category": "production-building",
      "placeable": true,
      "tiers": {
        "1": {
          "liveRevision": 5,
          "revisions": {
            "5": {
              "name": "Sawmill",
              "tier": 1,
              "revision": 5,
              "status": "live",
              "width": 2,
              "height": 1,
              "sprites": {
                "down": "img/Buildings/Camp Runtime/sawmill/tier-1/revision-5/down.png",
                "right": "img/Buildings/Camp Runtime/sawmill/tier-1/revision-5/right.png",
                "up": "img/Buildings/Camp Runtime/sawmill/tier-1/revision-5/up.png",
                "left": "img/Buildings/Camp Runtime/sawmill/tier-1/revision-5/left.png"
              },
              "groundingSprites": {
                "down": "img/Buildings/Camp Runtime/sawmill/tier-1/revision-5/grounding-down.png",
                "right": "img/Buildings/Camp Runtime/sawmill/tier-1/revision-5/grounding-right.png",
                "up": "img/Buildings/Camp Runtime/sawmill/tier-1/revision-5/grounding-up.png",
                "left": "img/Buildings/Camp Runtime/sawmill/tier-1/revision-5/grounding-left.png"
              },
              "groundingBounds": {
                "down": {
                  "x": -0.5,
                  "y": -0.5,
                  "width": 3.0,
                  "height": 2.0
                },
                "right": {
                  "x": -0.5,
                  "y": -0.5,
                  "width": 2.0,
                  "height": 3.0
                },
                "up": {
                  "x": -0.5,
                  "y": -0.5,
                  "width": 3.0,
                  "height": 2.0
                },
                "left": {
                  "x": -0.5,
                  "y": -0.5,
                  "width": 2.0,
                  "height": 3.0
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
                        "y": 1,
                        "side": "south"
                      },
                      {
                        "x": 1,
                        "y": 1,
                        "side": "south"
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
    "smallFountain": {
      "assetId": "small-fountain",
      "name": "Small fountain",
      "category": "decoration",
      "placeable": true,
      "tiers": {
        "1": {
          "liveRevision": 5,
          "revisions": {
            "5": {
              "name": "Small fountain",
              "tier": 1,
              "revision": 5,
              "status": "live",
              "width": 1,
              "height": 1,
              "sprites": {
                "down": "img/Buildings/Camp Runtime/small-fountain/tier-1/revision-5/down.png",
                "right": "img/Buildings/Camp Runtime/small-fountain/tier-1/revision-5/right.png",
                "up": "img/Buildings/Camp Runtime/small-fountain/tier-1/revision-5/up.png",
                "left": "img/Buildings/Camp Runtime/small-fountain/tier-1/revision-5/left.png"
              },
              "groundingSprites": {
                "down": "img/Buildings/Camp Runtime/small-fountain/tier-1/revision-5/grounding-down.png",
                "right": "img/Buildings/Camp Runtime/small-fountain/tier-1/revision-5/grounding-right.png",
                "up": "img/Buildings/Camp Runtime/small-fountain/tier-1/revision-5/grounding-up.png",
                "left": "img/Buildings/Camp Runtime/small-fountain/tier-1/revision-5/grounding-left.png"
              },
              "groundingBounds": {
                "down": {
                  "x": -1.0,
                  "y": -1.0,
                  "width": 3.0,
                  "height": 3.0
                },
                "right": {
                  "x": -1.0,
                  "y": -1.0,
                  "width": 3.0,
                  "height": 3.0
                },
                "up": {
                  "x": -1.0,
                  "y": -1.0,
                  "width": 3.0,
                  "height": 3.0
                },
                "left": {
                  "x": -1.0,
                  "y": -1.0,
                  "width": 3.0,
                  "height": 3.0
                }
              }
            }
          }
        }
      }
    },
    "storage": {
      "assetId": "small-storage-shed",
      "name": "Small Storage Shed",
      "category": "building",
      "placeable": true,
      "tiers": {
        "1": {
          "liveRevision": 5,
          "revisions": {
            "5": {
              "name": "Small Storage Shed",
              "tier": 1,
              "revision": 5,
              "status": "live",
              "width": 1,
              "height": 1,
              "sprites": {
                "down": "img/Buildings/Camp Runtime/small-storage-shed/tier-1/revision-5/down.png",
                "right": "img/Buildings/Camp Runtime/small-storage-shed/tier-1/revision-5/right.png",
                "up": "img/Buildings/Camp Runtime/small-storage-shed/tier-1/revision-5/up.png",
                "left": "img/Buildings/Camp Runtime/small-storage-shed/tier-1/revision-5/left.png"
              },
              "groundingSprites": {
                "down": "img/Buildings/Camp Runtime/small-storage-shed/tier-1/revision-5/grounding-down.png",
                "right": "img/Buildings/Camp Runtime/small-storage-shed/tier-1/revision-5/grounding-right.png",
                "up": "img/Buildings/Camp Runtime/small-storage-shed/tier-1/revision-5/grounding-up.png",
                "left": "img/Buildings/Camp Runtime/small-storage-shed/tier-1/revision-5/grounding-left.png"
              },
              "groundingBounds": {
                "down": {
                  "x": -1.0,
                  "y": -1.0,
                  "width": 3.0,
                  "height": 3.0
                },
                "right": {
                  "x": -1.0,
                  "y": -1.0,
                  "width": 3.0,
                  "height": 3.0
                },
                "up": {
                  "x": -1.0,
                  "y": -1.0,
                  "width": 3.0,
                  "height": 3.0
                },
                "left": {
                  "x": -1.0,
                  "y": -1.0,
                  "width": 3.0,
                  "height": 3.0
                }
              },
              "stickerSlot": {
                "id": "front-surface",
                "enabled": false,
                "mode": "surface",
                "category": "storage",
                "anchors": {
                  "down": {
                    "auto": "surface",
                    "surface": {
                      "x": 0.5,
                      "y": 0.3
                    }
                  },
                  "right": {
                    "auto": "surface",
                    "surface": {
                      "x": 0.5,
                      "y": 0.3
                    }
                  },
                  "up": {
                    "auto": "surface",
                    "surface": {
                      "x": 0.5,
                      "y": 0.3
                    }
                  },
                  "left": {
                    "auto": "surface",
                    "surface": {
                      "x": 0.5,
                      "y": 0.3
                    }
                  }
                },
                "anchorReview": true,
                "required": true,
                "baseSticker": true,
                "defaultScale": 1.5,
                "defaultAnchorChoice": "auto",
                "defaultStickerId": "storage-stacked-boxes",
                "defaultColorId": "kraft"
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
                        "y": 1,
                        "side": "south"
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
          "liveRevision": 3,
          "revisions": {
            "3": {
              "name": "Small Storage Shed",
              "tier": 2,
              "revision": 3,
              "status": "live",
              "width": 1,
              "height": 1,
              "sprites": {
                "down": "img/Buildings/Camp Runtime/small-storage-shed/tier-2/revision-3/down.png",
                "right": "img/Buildings/Camp Runtime/small-storage-shed/tier-2/revision-3/right.png",
                "up": "img/Buildings/Camp Runtime/small-storage-shed/tier-2/revision-3/up.png",
                "left": "img/Buildings/Camp Runtime/small-storage-shed/tier-2/revision-3/left.png"
              },
              "groundingSprites": {
                "down": "img/Buildings/Camp Runtime/small-storage-shed/tier-2/revision-3/grounding-down.png",
                "right": "img/Buildings/Camp Runtime/small-storage-shed/tier-2/revision-3/grounding-right.png",
                "up": "img/Buildings/Camp Runtime/small-storage-shed/tier-2/revision-3/grounding-up.png",
                "left": "img/Buildings/Camp Runtime/small-storage-shed/tier-2/revision-3/grounding-left.png"
              },
              "groundingBounds": {
                "down": {
                  "x": -1.0,
                  "y": -1.0,
                  "width": 3.0,
                  "height": 3.0
                },
                "right": {
                  "x": -1.0,
                  "y": -1.0,
                  "width": 3.0,
                  "height": 3.0
                },
                "up": {
                  "x": -1.0,
                  "y": -1.0,
                  "width": 3.0,
                  "height": 3.0
                },
                "left": {
                  "x": -1.0,
                  "y": -1.0,
                  "width": 3.0,
                  "height": 3.0
                }
              },
              "stickerSlot": {
                "id": "front-surface",
                "enabled": true,
                "mode": "surface",
                "category": "storage",
                "anchors": {
                  "down": {
                    "auto": "surface",
                    "surface": {
                      "x": 0.5,
                      "y": 0.3
                    }
                  },
                  "right": {
                    "auto": "surface",
                    "surface": {
                      "x": 0.5,
                      "y": 0.3
                    }
                  },
                  "up": {
                    "auto": "surface",
                    "surface": {
                      "x": 0.5,
                      "y": 0.3
                    }
                  },
                  "left": {
                    "auto": "surface",
                    "surface": {
                      "x": 0.5,
                      "y": 0.3
                    }
                  }
                },
                "anchorReview": true,
                "required": true,
                "baseSticker": true,
                "defaultScale": 1.5,
                "defaultAnchorChoice": "auto",
                "defaultStickerId": "storage-stacked-boxes",
                "defaultColorId": "kraft"
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
                        "y": 1,
                        "side": "south"
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
    "snowyGreenBush": {
      "assetId": "snowy-green-bush",
      "name": "Snowy Green Bush",
      "category": "junk",
      "placeable": true,
      "tiers": {
        "1": {
          "liveRevision": 1,
          "revisions": {
            "1": {
              "name": "Snowy Green Bush",
              "tier": 1,
              "revision": 1,
              "status": "live",
              "width": 2,
              "height": 1,
              "sprites": {
                "down": "img/Buildings/Camp Runtime/snowy-green-bush/tier-1/revision-1/down.png",
                "right": "img/Buildings/Camp Runtime/snowy-green-bush/tier-1/revision-1/right.png",
                "up": "img/Buildings/Camp Runtime/snowy-green-bush/tier-1/revision-1/up.png",
                "left": "img/Buildings/Camp Runtime/snowy-green-bush/tier-1/revision-1/left.png"
              },
              "groundingSprites": {
                "down": "img/Buildings/Camp Runtime/snowy-green-bush/tier-1/revision-1/grounding-down.png",
                "right": "img/Buildings/Camp Runtime/snowy-green-bush/tier-1/revision-1/grounding-right.png",
                "up": "img/Buildings/Camp Runtime/snowy-green-bush/tier-1/revision-1/grounding-up.png",
                "left": "img/Buildings/Camp Runtime/snowy-green-bush/tier-1/revision-1/grounding-left.png"
              },
              "groundingBounds": {
                "down": {
                  "x": -0.45,
                  "y": -0.45,
                  "width": 2.9,
                  "height": 1.9
                },
                "right": {
                  "x": -0.45,
                  "y": -0.45,
                  "width": 2.9,
                  "height": 1.9
                },
                "up": {
                  "x": -0.45,
                  "y": -0.45,
                  "width": 2.9,
                  "height": 1.9
                },
                "left": {
                  "x": -0.45,
                  "y": -0.45,
                  "width": 2.9,
                  "height": 1.9
                }
              }
            }
          }
        }
      }
    },
    "junkTallGrass": {
      "assetId": "junk-tall-grass",
      "name": "Tall Green Grass",
      "category": "junk",
      "placeable": true,
      "tiers": {
        "1": {
          "liveRevision": 7,
          "revisions": {
            "7": {
              "name": "Tall Green Grass",
              "tier": 1,
              "revision": 7,
              "status": "live",
              "width": 1,
              "height": 1,
              "sprites": {
                "down": "img/Buildings/Camp Runtime/junk-tall-grass/tier-1/revision-7/down.png",
                "right": "img/Buildings/Camp Runtime/junk-tall-grass/tier-1/revision-7/right.png",
                "up": "img/Buildings/Camp Runtime/junk-tall-grass/tier-1/revision-7/up.png",
                "left": "img/Buildings/Camp Runtime/junk-tall-grass/tier-1/revision-7/left.png"
              },
              "groundingSprites": {
                "down": "img/Buildings/Camp Runtime/junk-tall-grass/tier-1/revision-7/grounding-down.png",
                "right": "img/Buildings/Camp Runtime/junk-tall-grass/tier-1/revision-7/grounding-right.png",
                "up": "img/Buildings/Camp Runtime/junk-tall-grass/tier-1/revision-7/grounding-up.png",
                "left": "img/Buildings/Camp Runtime/junk-tall-grass/tier-1/revision-7/grounding-left.png"
              },
              "groundingBounds": {
                "down": {
                  "x": -0.45,
                  "y": -0.45,
                  "width": 1.9,
                  "height": 1.9
                },
                "right": {
                  "x": -0.45,
                  "y": -0.45,
                  "width": 1.9,
                  "height": 1.9
                },
                "up": {
                  "x": -0.45,
                  "y": -0.45,
                  "width": 1.9,
                  "height": 1.9
                },
                "left": {
                  "x": -0.45,
                  "y": -0.45,
                  "width": 1.9,
                  "height": 1.9
                }
              },
              "gameplay": {
                "clearDurationSeconds": 360,
                "minCatLevel": 0,
                "requiredCats": 1
              }
            }
          }
        }
      }
    },
    "junkThornBush": {
      "assetId": "junk-thorn-bush",
      "name": "Thorny Bramble Bush",
      "category": "junk",
      "placeable": true,
      "tiers": {
        "1": {
          "liveRevision": 2,
          "revisions": {
            "2": {
              "name": "Thorny Bramble Bush",
              "tier": 1,
              "revision": 2,
              "status": "live",
              "width": 2,
              "height": 1,
              "sprites": {
                "down": "img/Buildings/Camp Runtime/junk-thorn-bush/tier-1/revision-2/down.png",
                "right": "img/Buildings/Camp Runtime/junk-thorn-bush/tier-1/revision-2/right.png",
                "up": "img/Buildings/Camp Runtime/junk-thorn-bush/tier-1/revision-2/up.png",
                "left": "img/Buildings/Camp Runtime/junk-thorn-bush/tier-1/revision-2/left.png"
              },
              "groundingSprites": {
                "down": "img/Buildings/Camp Runtime/junk-thorn-bush/tier-1/revision-2/grounding-down.png",
                "right": "img/Buildings/Camp Runtime/junk-thorn-bush/tier-1/revision-2/grounding-right.png",
                "up": "img/Buildings/Camp Runtime/junk-thorn-bush/tier-1/revision-2/grounding-up.png",
                "left": "img/Buildings/Camp Runtime/junk-thorn-bush/tier-1/revision-2/grounding-left.png"
              },
              "groundingBounds": {
                "down": {
                  "x": -0.45,
                  "y": -0.45,
                  "width": 2.9,
                  "height": 1.9
                },
                "right": {
                  "x": -0.45,
                  "y": -0.45,
                  "width": 2.9,
                  "height": 1.9
                },
                "up": {
                  "x": -0.45,
                  "y": -0.45,
                  "width": 2.9,
                  "height": 1.9
                },
                "left": {
                  "x": -0.45,
                  "y": -0.45,
                  "width": 2.9,
                  "height": 1.9
                }
              },
              "gameplay": {
                "clearDurationSeconds": 2400,
                "minCatLevel": 5,
                "requiredCats": 2
              }
            }
          }
        }
      }
    },
    "catTreeV2": {
      "assetId": "cat-tree-v2",
      "name": "Wood Cat Tree",
      "category": "decoration",
      "placeable": true,
      "tiers": {
        "1": {
          "liveRevision": 3,
          "revisions": {
            "3": {
              "name": "Wood Cat Tree",
              "tier": 1,
              "revision": 3,
              "status": "live",
              "width": 1,
              "height": 1,
              "sprites": {
                "down": "img/Buildings/Camp Runtime/cat-tree-v2/tier-1/revision-3/down.png",
                "right": "img/Buildings/Camp Runtime/cat-tree-v2/tier-1/revision-3/right.png",
                "up": "img/Buildings/Camp Runtime/cat-tree-v2/tier-1/revision-3/up.png",
                "left": "img/Buildings/Camp Runtime/cat-tree-v2/tier-1/revision-3/left.png"
              },
              "groundingSprites": {
                "down": "img/Buildings/Camp Runtime/cat-tree-v2/tier-1/revision-3/grounding-down.png",
                "right": "img/Buildings/Camp Runtime/cat-tree-v2/tier-1/revision-3/grounding-right.png",
                "up": "img/Buildings/Camp Runtime/cat-tree-v2/tier-1/revision-3/grounding-up.png",
                "left": "img/Buildings/Camp Runtime/cat-tree-v2/tier-1/revision-3/grounding-left.png"
              },
              "groundingBounds": {
                "down": {
                  "x": -1.0,
                  "y": -1.0,
                  "width": 3.0,
                  "height": 3.0
                },
                "right": {
                  "x": -1.0,
                  "y": -1.0,
                  "width": 3.0,
                  "height": 3.0
                },
                "up": {
                  "x": -1.0,
                  "y": -1.0,
                  "width": 3.0,
                  "height": 3.0
                },
                "left": {
                  "x": -1.0,
                  "y": -1.0,
                  "width": 3.0,
                  "height": 3.0
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
                        "y": 1,
                        "side": "south"
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
    "woodCathouse": {
      "assetId": "wood-cathouse",
      "name": "Wood Cathouse",
      "category": "house",
      "placeable": true,
      "tiers": {
        "1": {
          "liveRevision": 9,
          "revisions": {
            "9": {
              "name": "Wood Cathouse",
              "tier": 1,
              "revision": 9,
              "status": "live",
              "width": 1,
              "height": 1,
              "sprites": {
                "down": "img/Buildings/Camp Runtime/wood-cathouse/tier-1/revision-9/down.png",
                "right": "img/Buildings/Camp Runtime/wood-cathouse/tier-1/revision-9/right.png",
                "up": "img/Buildings/Camp Runtime/wood-cathouse/tier-1/revision-9/up.png",
                "left": "img/Buildings/Camp Runtime/wood-cathouse/tier-1/revision-9/left.png"
              },
              "groundingSprites": {
                "down": "img/Buildings/Camp Runtime/wood-cathouse/tier-1/revision-9/grounding-down.png",
                "right": "img/Buildings/Camp Runtime/wood-cathouse/tier-1/revision-9/grounding-right.png",
                "up": "img/Buildings/Camp Runtime/wood-cathouse/tier-1/revision-9/grounding-up.png",
                "left": "img/Buildings/Camp Runtime/wood-cathouse/tier-1/revision-9/grounding-left.png"
              },
              "groundingBounds": {
                "down": {
                  "x": -1.0,
                  "y": -1.0,
                  "width": 3.0,
                  "height": 3.0
                },
                "right": {
                  "x": -1.0,
                  "y": -1.0,
                  "width": 3.0,
                  "height": 3.0
                },
                "up": {
                  "x": -1.0,
                  "y": -1.0,
                  "width": 3.0,
                  "height": 3.0
                },
                "left": {
                  "x": -1.0,
                  "y": -1.0,
                  "width": 3.0,
                  "height": 3.0
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
                        "y": 1,
                        "side": "south"
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
          "liveRevision": 3,
          "revisions": {
            "3": {
              "name": "Wood Cathouse",
              "tier": 2,
              "revision": 3,
              "status": "live",
              "width": 1,
              "height": 1,
              "sprites": {
                "down": "img/Buildings/Camp Runtime/wood-cathouse/tier-2/revision-3/down.png",
                "right": "img/Buildings/Camp Runtime/wood-cathouse/tier-2/revision-3/right.png",
                "up": "img/Buildings/Camp Runtime/wood-cathouse/tier-2/revision-3/up.png",
                "left": "img/Buildings/Camp Runtime/wood-cathouse/tier-2/revision-3/left.png"
              },
              "groundingSprites": {
                "down": "img/Buildings/Camp Runtime/wood-cathouse/tier-2/revision-3/grounding-down.png",
                "right": "img/Buildings/Camp Runtime/wood-cathouse/tier-2/revision-3/grounding-right.png",
                "up": "img/Buildings/Camp Runtime/wood-cathouse/tier-2/revision-3/grounding-up.png",
                "left": "img/Buildings/Camp Runtime/wood-cathouse/tier-2/revision-3/grounding-left.png"
              },
              "groundingBounds": {
                "down": {
                  "x": -1.0,
                  "y": -1.0,
                  "width": 3.0,
                  "height": 3.0
                },
                "right": {
                  "x": -1.0,
                  "y": -1.0,
                  "width": 3.0,
                  "height": 3.0
                },
                "up": {
                  "x": -1.0,
                  "y": -1.0,
                  "width": 3.0,
                  "height": 3.0
                },
                "left": {
                  "x": -1.0,
                  "y": -1.0,
                  "width": 3.0,
                  "height": 3.0
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
                        "y": 1,
                        "side": "south"
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
      "name": "Camp Boundary Fence",
      "category": "fence",
      "placeable": false,
      "tiers": {
        "1": {
          "liveRevision": 3,
          "revisions": {
            "3": {
              "name": "Camp Boundary Fence",
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
              "edgeForegroundSprites": {
                "verticalA": "img/Buildings/Camp Runtime/camp-boundary-fence/tier-1/revision-3/edge-foreground-verticalA.png",
                "verticalB": "img/Buildings/Camp Runtime/camp-boundary-fence/tier-1/revision-3/edge-foreground-verticalB.png"
              }
            }
          }
        }
      }
    }
  }
});
})(typeof window !== "undefined" ? window : globalThis);
