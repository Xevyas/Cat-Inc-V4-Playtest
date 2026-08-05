(function(root) {
  "use strict";

  const CatInc = root.CatInc = root.CatInc || {};
  const campConnectivity = CatInc.campConnectivity;
  if (!campConnectivity) {
    throw new Error("CatInc.campConnectivity must be loaded before CatInc.camp.");
  }
  const GRID_WIDTH = 18;
  const GRID_HEIGHT = 12;
  const HOUSE_DECOR_HEIGHT = 4;
  const OBSTACLE_ASSET_ROOT = "img/Maps/Camp%20Runtime/Obstacles/";
  const RUNTIME_MANIFEST = CatInc.data && CatInc.data.campAssets
    ? CatInc.data.campAssets
    : { assets: {} };
  const runtimeSearch = root.location && typeof root.location.search === "string"
    ? root.location.search
    : "";
  const runtimeDebug = /(?:^|[?&])debug=1(?:&|$)/.test(runtimeSearch);

  function runtimeQueryValue(name) {
    const match = runtimeSearch.match(new RegExp("(?:^|[?&])" + name + "=([^&]*)"));
    if (!match) return "";
    try {
      return decodeURIComponent(match[1].replace(/\+/g, " "));
    } catch (error) {
      return "";
    }
  }

  const runtimeTestSelection = runtimeDebug ? {
    assetId: runtimeQueryValue("campAssetTest"),
    tier: Number(runtimeQueryValue("campAssetTier")),
    revision: Number(runtimeQueryValue("campAssetRevision"))
  } : null;

  function runtimeRevision(typeId, preferredTier) {
    const family = RUNTIME_MANIFEST.assets && RUNTIME_MANIFEST.assets[typeId];
    if (!family || !family.tiers) return null;
    let tierNumber = Number.isInteger(preferredTier) && preferredTier > 0
      ? preferredTier
      : 1;
    let revisionNumber = null;
    if (
      runtimeTestSelection
      && runtimeTestSelection.assetId === family.assetId
      && Number.isFinite(runtimeTestSelection.tier)
      && Number.isFinite(runtimeTestSelection.revision)
    ) {
      tierNumber = runtimeTestSelection.tier;
      revisionNumber = runtimeTestSelection.revision;
    }
    let tier = family.tiers[String(tierNumber)];
    if ((!tier || !Number.isInteger(tier.liveRevision)) && revisionNumber == null) {
      const fallbackTiers = Object.keys(family.tiers).map(Number).filter(function(candidate) {
        const candidateTier = family.tiers[String(candidate)];
        return Number.isInteger(candidate)
          && candidate <= tierNumber
          && candidateTier
          && Number.isInteger(candidateTier.liveRevision);
      }).sort(function(a, b) { return b - a; });
      tierNumber = fallbackTiers.length > 0 ? fallbackTiers[0] : 1;
      tier = family.tiers[String(tierNumber)];
    }
    if (!tier) return null;
    if (revisionNumber == null) revisionNumber = tier.liveRevision;
    return revisionNumber == null
      ? null
      : tier.revisions[String(revisionNumber)] || null;
  }

  function runtimeSpritePath(path, revision) {
    if (!path) return "";
    const separator = String(path).includes("?") ? "&" : "?";
    return String(path) + separator + "camp-runtime=" + revision.tier + "." + revision.revision;
  }

  function runtimeAccess(runtimeAccessValue, fallbackAccess) {
    if (!runtimeAccessValue) return fallbackAccess;
    if (!fallbackAccess || !Array.isArray(runtimeAccessValue.ports)) return runtimeAccessValue;
    const fallbackPorts = new Map((fallbackAccess.ports || []).map(function(port) {
      return [port.id, port];
    }));
    return Object.freeze({
      ...fallbackAccess,
      ...runtimeAccessValue,
      ports: Object.freeze(runtimeAccessValue.ports.map(function(port, index) {
        const fallbackPort = fallbackPorts.get(port.id) || (fallbackAccess.ports || [])[index];
        return Object.freeze({...fallbackPort, ...port});
      }))
    });
  }

  function runtimeItem(typeId, fallback) {
    const revision = runtimeRevision(typeId, 1);
    if (!revision) return Object.freeze(fallback);
    const sprites = {};
    Object.keys(revision.sprites || {}).forEach(function(direction) {
      sprites[direction] = runtimeSpritePath(revision.sprites[direction], revision);
    });
    return Object.freeze({
      ...fallback,
      label: revision.name || fallback.label,
      width: revision.width,
      height: revision.height,
      asset: sprites.down || fallback.asset,
      assets: Object.freeze(sprites),
      access: Object.prototype.hasOwnProperty.call(revision, "access")
        ? runtimeAccess(revision.access, fallback.access)
        : fallback.access,
      minCatLevel: revision.gameplay && Number.isInteger(revision.gameplay.minCatLevel)
        ? revision.gameplay.minCatLevel
        : fallback.minCatLevel,
      durationSeconds: revision.gameplay && Number.isInteger(revision.gameplay.clearDurationSeconds)
        ? revision.gameplay.clearDurationSeconds
        : fallback.durationSeconds,
      runtimeTier: revision.tier,
      runtimeRevision: revision.revision,
      runtimeStatus: revision.status
    });
  }

  function runtimeVisualForTier(typeId, functionalTier) {
    const revision = runtimeRevision(typeId, functionalTier);
    if (!revision || !revision.sprites) return null;
    const sprites = {};
    Object.keys(revision.sprites).forEach(function(direction) {
      sprites[direction] = runtimeSpritePath(revision.sprites[direction], revision);
    });
    return {
      tier: revision.tier,
      revision: revision.revision,
      sprites: sprites
    };
  }

  function runtimeEnvironmentRevision(typeId, preferredTier) {
    const registry = RUNTIME_MANIFEST.edgeAssets || RUNTIME_MANIFEST.environmentAssets || {};
    const family = registry[typeId];
    if (!family || !family.tiers) return null;
    const tierNumber = Number.isInteger(preferredTier) && preferredTier > 0
      ? preferredTier
      : 1;
    const tier = family.tiers[String(tierNumber)];
    if (!tier || !Number.isInteger(tier.liveRevision)) return null;
    return tier.revisions && tier.revisions[String(tier.liveRevision)] || null;
  }

  function runtimeFenceType(typeId) {
    const revision = runtimeEnvironmentRevision(typeId, 1);
    if (!revision || !revision.sprites) return null;
    const sprites = {};
    Object.keys(revision.sprites).forEach(function(direction) {
      sprites[direction] = runtimeSpritePath(revision.sprites[direction], revision);
    });
    const edgeSprites = {};
    Object.keys(revision.edgeSprites || {}).forEach(function(part) {
      edgeSprites[part] = runtimeSpritePath(revision.edgeSprites[part], revision);
    });
    const edgeForegroundSprites = {};
    Object.keys(revision.edgeForegroundSprites || {}).forEach(function(part) {
      edgeForegroundSprites[part] = runtimeSpritePath(
        revision.edgeForegroundSprites[part],
        revision
      );
    });
    return Object.freeze({
      id: typeId,
      label: revision.name || "Camp Fence",
      width: 1,
      height: 1,
      color: "fence",
      category: "fence",
      continuous: true,
      edgePlacement: true,
      blocksMovement: false,
      motifLength: Object.keys(edgeSprites).length
        ? 2
        : Math.max(1, revision.width || 1, revision.height || 1),
      asset: sprites.right || sprites.down || "",
      assets: Object.freeze(sprites),
      edgeSprites: Object.freeze(edgeSprites),
      edgeForegroundSprites: Object.freeze(edgeForegroundSprites),
      spriteBounds: Object.freeze(revision.spriteBounds || {}),
      runtimeTier: revision.tier,
      runtimeRevision: revision.revision,
      runtimeStatus: revision.status
    });
  }
  const CARDBOARD_BOX_ACCESS = Object.freeze({
    activationPolicy: "all-ports-reachable",
    cellPolicy: "all-cells-reachable",
    ports: Object.freeze([
      Object.freeze({
        id: "main-door",
        side: "south",
        approachCells: Object.freeze([
          Object.freeze({ x: 0, y: 1 })
        ]),
        minimumReachableCells: 1,
        visualConnector: Object.freeze({
          material: "inherit",
          anchor: 0.5,
          width: 0.32,
          length: 0.34
        })
      })
    ])
  });
  const JOB_CENTER_ACCESS = Object.freeze({
    activationPolicy: "all-ports-reachable",
    cellPolicy: "all-cells-reachable",
    ports: Object.freeze([
      Object.freeze({
        id: "main-door",
        side: "south",
        approachCells: Object.freeze([
          Object.freeze({ x: 0, y: 3 }),
          Object.freeze({ x: 1, y: 3 })
        ]),
        minimumReachableCells: 2,
        visualConnector: Object.freeze({
          material: "inherit",
          width: 0.32,
          length: 0.68,
          mergeContiguous: true,
          mergedWidth: 1.82,
          mergedInnerWidth: 0.62,
          mergedLength: 0.8
        })
      })
    ])
  });

  function singleEntranceAccess(width, height) {
    return Object.freeze({
      activationPolicy: "all-ports-reachable",
      cellPolicy: "all-cells-reachable",
      ports: Object.freeze([
        Object.freeze({
          id: "main-door",
          side: "south",
          approachCells: Object.freeze([
            Object.freeze({ x: Math.floor(width / 2), y: height })
          ]),
          minimumReachableCells: 1
        })
      ])
    });
  }

  const CATCHEN_ACCESS = Object.freeze({
    activationPolicy: "all-ports-reachable",
    ports: Object.freeze([
      Object.freeze({
        id: "access-1",
        side: "south",
        cellPolicy: "any-cell-reachable",
        approachCells: Object.freeze([
          Object.freeze({ x: 0, y: 1 }),
          Object.freeze({ x: 1, y: 1 })
        ]),
        minimumReachableCells: 1
      })
    ])
  });
  const PAWSONRY_ACCESS = singleEntranceAccess(2, 2);
  const TRAINING_CENTER_ACCESS = singleEntranceAccess(3, 4);
  const OPERATIONS_TABLE_ACCESS = singleEntranceAccess(2, 1);
  const LABORATORY_ACCESS = singleEntranceAccess(3, 3);
  const STORAGE_ACCESS = singleEntranceAccess(2, 2);

  const BASE_ITEM_TYPES = {
    cardboardBox: runtimeItem("cardboardBox", {
      id: "cardboardBox",
      label: "Cardboard Box",
      width: 1,
      height: 1,
      color: "cardboard",
      category: "house",
      rotatable: true,
      blocksMovement: true,
      access: CARDBOARD_BOX_ACCESS,
      asset: "img/Buildings/Camp%20Runtime/cardboard-box/tier-1/revision-5/down.png?v=0.0001"
    }),
    jobCenter: runtimeItem("jobCenter", {
      id: "jobCenter",
      label: "Job Center",
      width: 2,
      height: 3,
      color: "job-center",
      category: "building",
      rotatable: true,
      blocksMovement: true,
      access: JOB_CENTER_ACCESS,
      asset: "img/Buildings/Camp%20Runtime/job-center/tier-1/revision-6/down.png?v=0.0001",
      assets: Object.freeze({
        down: "img/Buildings/Camp%20Runtime/job-center/tier-1/revision-6/down.png?v=0.0001",
        right: "img/Buildings/Camp%20Runtime/job-center/tier-1/revision-6/right.png?v=0.0001",
        up: "img/Buildings/Camp%20Runtime/job-center/tier-1/revision-6/up.png?v=0.0001",
        left: "img/Buildings/Camp%20Runtime/job-center/tier-1/revision-6/left.png?v=0.0001"
      })
    }),
    sawmill: runtimeItem("sawmill", {
      id: "sawmill",
      label: "Sawmill",
      width: 2,
      height: 1,
      color: "wood",
      category: "building",
      rotatable: true,
      asset: "img/Buildings/Camp%20Runtime/sawmill/tier-1/revision-3/down.png?v=0.0001"
    }),
    catchen: runtimeItem("catchen", {
      id: "catchen",
      label: "Catchen",
      width: 2,
      height: 1,
      color: "food",
      category: "building",
      rotatable: true,
      blocksMovement: true,
      access: CATCHEN_ACCESS,
      asset: "img/Buildings/Camp%20Runtime/catchen/tier-1/revision-4/down.png?v=0.0001"
    }),
    pawsonry: runtimeItem("pawsonry", {
      id: "pawsonry",
      label: "Pawsonry",
      width: 2,
      height: 2,
      color: "stone",
      category: "building",
      rotatable: true,
      blocksMovement: true,
      access: PAWSONRY_ACCESS,
      asset: "img/Buildings/Camp%20Runtime/pawsonry/tier-1/revision-4/down.png?v=0.0001"
    }),
    trainingCenter: runtimeItem("trainingCenter", {
      id: "trainingCenter",
      label: "Training Center",
      width: 3,
      height: 4,
      color: "training",
      category: "building",
      rotatable: true,
      blocksMovement: true,
      access: TRAINING_CENTER_ACCESS,
      asset: "img/Buildings/Camp%20Runtime/training-center/tier-1/revision-1/down.png?v=0.0001",
      assets: Object.freeze({
        down: "img/Buildings/Camp%20Runtime/training-center/tier-1/revision-1/down.png?v=0.0001",
        right: "img/Buildings/Camp%20Runtime/training-center/tier-1/revision-1/right.png?v=0.0001",
        up: "img/Buildings/Camp%20Runtime/training-center/tier-1/revision-1/up.png?v=0.0001",
        left: "img/Buildings/Camp%20Runtime/training-center/tier-1/revision-1/left.png?v=0.0001"
      })
    }),
    operationsTable: Object.freeze({
      id: "operationsTable",
      label: "Operations Table",
      width: 2,
      height: 1,
      color: "operations",
      category: "building",
      rotatable: true,
      blocksMovement: true,
      access: OPERATIONS_TABLE_ACCESS
    }),
    laboratory: Object.freeze({
      id: "laboratory",
      label: "Laboratory",
      width: 2,
      height: 1,
      color: "laboratory",
      category: "building",
      rotatable: false,
      blocksMovement: true,
      access: LABORATORY_ACCESS,
      asset: "img/Buildings/Laboratory_Final.png?v=0.0034"
    }),
    storage: Object.freeze({
      id: "storage",
      label: "Storage Shed",
      width: 2,
      height: 2,
      color: "storage",
      category: "building",
      rotatable: true,
      blocksMovement: true,
      access: STORAGE_ACCESS
    }),
    tree: runtimeItem("tree", {
      id: "tree",
      label: "Tree",
      width: 2,
      height: 2,
      color: "nature",
      category: "decoration",
      asset: "img/Buildings/Camp%20Runtime/garden-tree/tier-1/revision-1/down.png?v=0.0001"
    }),
    catToy: Object.freeze({
      id: "catToy",
      label: "Cat Toy",
      width: 1,
      height: 1,
      color: "toy",
      category: "decoration"
    }),
    junkGreenBush: runtimeItem("junkGreenBush", {
      id: "junkGreenBush",
      label: "Green Bush",
      width: 2,
      height: 1,
      color: "junk",
      category: "junk",
      asset: OBSTACLE_ASSET_ROOT + "Green%20Bush_Camp_Obstacle_Watercolor_Game_v1.png?v=0.0001",
      minCatLevel: 0,
      durationSeconds: 20 * 60
    }),
    junkThornBush: runtimeItem("junkThornBush", {
      id: "junkThornBush",
      label: "Thorny Bramble Bush",
      width: 2,
      height: 1,
      color: "junk",
      category: "junk",
      asset: OBSTACLE_ASSET_ROOT + "Thorn%20Bush_Camp_Obstacle_Watercolor_Game_v1.png?v=0.0001",
      minCatLevel: 2,
      durationSeconds: 20 * 60
    }),
    junkFlowerBush: runtimeItem("junkFlowerBush", {
      id: "junkFlowerBush",
      label: "Flowering Bush",
      width: 2,
      height: 1,
      color: "junk",
      category: "junk",
      asset: OBSTACLE_ASSET_ROOT + "Flower%20Bush_Camp_Obstacle_Watercolor_Game_v1.png?v=0.0001",
      minCatLevel: 0,
      durationSeconds: 20 * 60
    }),
    junkPebblePile: runtimeItem("junkPebblePile", {
      id: "junkPebblePile",
      label: "Pile of Pebbles",
      width: 1,
      height: 1,
      color: "junk",
      category: "junk",
      asset: OBSTACLE_ASSET_ROOT + "Pebble%20Pile_Camp_Obstacle_Watercolor_Game_v1.png?v=0.0001",
      minCatLevel: 0,
      durationSeconds: 10 * 60
    }),
    junkStoneBlockPile: runtimeItem("junkStoneBlockPile", {
      id: "junkStoneBlockPile",
      label: "Pile of Stone Blocks",
      width: 2,
      height: 2,
      color: "junk",
      category: "junk",
      asset: OBSTACLE_ASSET_ROOT + "Stone%20Block%20Pile_Camp_Obstacle_Watercolor_Game_v1.png?v=0.0001",
      minCatLevel: 4,
      durationSeconds: 80 * 60
    }),
    junkTallGrass: runtimeItem("junkTallGrass", {
      id: "junkTallGrass",
      label: "Tall Green Grass",
      width: 1,
      height: 1,
      color: "junk",
      category: "junk",
      asset: OBSTACLE_ASSET_ROOT + "Tall%20Grass_Camp_Obstacle_Watercolor_Game_v1.png?v=0.0001",
      minCatLevel: 0,
      durationSeconds: 10 * 60
    }),
    road: Object.freeze({
      id: "road",
      label: "Basic Trail",
      width: 1,
      height: 1,
      color: "road",
      category: "road",
      continuous: true,
      blocksMovement: false,
      roadMaterial: "basicTrail",
      asset: "img/Maps/Camp%20Runtime/Paths/Basic%20Trail_Camp_TopDown_Watercolor_Game_v1.png?v=0.0001"
    })
  };
  const LEGACY_TYPE_ALIASES = Object.freeze({
    kitchen: "catchen"
  });
  const INITIAL_BUILDABLE_RECT = Object.freeze({
    x: 6,
    y: HOUSE_DECOR_HEIGHT,
    width: 6,
    height: 3
  });
  const TERRITORY_ZONES = Object.freeze({
    redGarden: Object.freeze({
      id: "redGarden",
      label: "Red house garden",
      x: 0,
      y: HOUSE_DECOR_HEIGHT,
      width: 6,
      height: GRID_HEIGHT - HOUSE_DECOR_HEIGHT
    }),
    home: Object.freeze({
      id: "home",
      label: "Blue house garden",
      x: 6,
      y: HOUSE_DECOR_HEIGHT,
      width: 6,
      height: GRID_HEIGHT - HOUSE_DECOR_HEIGHT,
      initial: true
    }),
    greenGarden: Object.freeze({
      id: "greenGarden",
      label: "Green house garden",
      x: 12,
      y: HOUSE_DECOR_HEIGHT,
      width: 6,
      height: GRID_HEIGHT - HOUSE_DECOR_HEIGHT
    })
  });

  function devVisualItemTypes(baseTypes) {
    if (!runtimeDebug || !RUNTIME_MANIFEST.assets) return {};
    const visualTypes = {};
    Object.keys(RUNTIME_MANIFEST.assets).forEach(function(runtimeId) {
      if (baseTypes[runtimeId]) return;
      const family = RUNTIME_MANIFEST.assets[runtimeId];
      Object.keys(family.tiers || {}).map(Number).sort(function(a, b) { return a - b; }).forEach(function(tierNumber) {
        const tier = family.tiers[String(tierNumber)];
        if (!tier || !Number.isInteger(tier.liveRevision)) return;
        const revision = tier.revisions && tier.revisions[String(tier.liveRevision)];
        if (!revision || revision.status !== "live") return;
        const sprites = {};
        Object.keys(revision.sprites || {}).forEach(function(direction) {
          sprites[direction] = runtimeSpritePath(revision.sprites[direction], revision);
        });
        const typeId = "devVisual" + runtimeId.charAt(0).toUpperCase() + runtimeId.slice(1) + "Tier" + tierNumber;
        visualTypes[typeId] = Object.freeze({
          id: typeId,
          label: (revision.name || family.name || runtimeId) + " · T" + tierNumber,
          width: revision.width,
          height: revision.height,
          color: "dev-visual",
          category: "dev-library",
          rotatable: Object.keys(sprites).length > 1,
          blocksMovement: true,
          visualOnly: true,
          asset: sprites.down || "",
          assets: Object.freeze(sprites),
          access: revision.access,
          runtimeId: runtimeId,
          runtimeTier: tierNumber,
          runtimeRevision: revision.revision,
          runtimeStatus: revision.status
        });
      });
    });
    return visualTypes;
  }

  const FENCE_TYPES = Object.freeze({
    campBoundaryFence: runtimeFenceType("campBoundaryFence")
  });
  const ITEM_TYPES = Object.freeze({
    ...BASE_ITEM_TYPES,
    ...Object.keys(FENCE_TYPES).reduce(function(types, typeId) {
      if (FENCE_TYPES[typeId]) types[typeId] = FENCE_TYPES[typeId];
      return types;
    }, {}),
    ...devVisualItemTypes(BASE_ITEM_TYPES)
  });
  const CONNECTION_ORIGIN_CELLS = Object.freeze(Array.from(
    { length: TERRITORY_ZONES.home.width },
    function(_, index) {
      return Object.freeze({
        x: TERRITORY_ZONES.home.x + index,
        y: TERRITORY_ZONES.home.y
      });
    }
  ));
  const TERRAIN_CELL_COUNT = Object.keys(TERRITORY_ZONES).reduce(function(total, zoneId) {
    const zone = TERRITORY_ZONES[zoneId];
    return total + zone.width * zone.height;
  }, 0);
  function runtimeObstacle(runtimeTypeId, fallback) {
    const revision = runtimeRevision(runtimeTypeId, 1);
    if (!revision) return Object.freeze(fallback);
    return Object.freeze({
      ...fallback,
      label: revision.name || fallback.label,
      width: revision.width,
      height: revision.height,
      minCatLevel: revision.gameplay && Number.isInteger(revision.gameplay.minCatLevel)
        ? revision.gameplay.minCatLevel
        : fallback.minCatLevel,
      durationSeconds: revision.gameplay && Number.isInteger(revision.gameplay.clearDurationSeconds)
        ? revision.gameplay.clearDurationSeconds
        : fallback.durationSeconds,
      asset: runtimeSpritePath(revision.sprites && revision.sprites.down, revision) || fallback.asset
    });
  }
  const OBSTACLE_TYPES = Object.freeze([
    runtimeObstacle("junkGreenBush", {
      id: "greenBush",
      label: "Green bush",
      width: 2,
      height: 1,
      minCatLevel: 0,
      durationSeconds: 20 * 60,
      asset: OBSTACLE_ASSET_ROOT + "Green%20Bush_Camp_Obstacle_Watercolor_Game_v1.png?v=0.0001"
    }),
    runtimeObstacle("junkThornBush", {
      id: "thornBush",
      label: "Thorny bramble bush",
      width: 2,
      height: 1,
      minCatLevel: 2,
      durationSeconds: 20 * 60,
      asset: OBSTACLE_ASSET_ROOT + "Thorn%20Bush_Camp_Obstacle_Watercolor_Game_v1.png?v=0.0001"
    }),
    runtimeObstacle("junkFlowerBush", {
      id: "flowerBush",
      label: "Flowering bush",
      width: 2,
      height: 1,
      minCatLevel: 0,
      durationSeconds: 20 * 60,
      asset: OBSTACLE_ASSET_ROOT + "Flower%20Bush_Camp_Obstacle_Watercolor_Game_v1.png?v=0.0001"
    }),
    runtimeObstacle("junkPebblePile", {
      id: "pebblePile",
      label: "Pile of pebbles",
      width: 1,
      height: 1,
      minCatLevel: 0,
      durationSeconds: 10 * 60,
      asset: OBSTACLE_ASSET_ROOT + "Pebble%20Pile_Camp_Obstacle_Watercolor_Game_v1.png?v=0.0001"
    }),
    runtimeObstacle("junkStoneBlockPile", {
      id: "stoneBlockPile",
      label: "Pile of stone blocks",
      width: 2,
      height: 2,
      minCatLevel: 4,
      durationSeconds: 80 * 60,
      asset: OBSTACLE_ASSET_ROOT + "Stone%20Block%20Pile_Camp_Obstacle_Watercolor_Game_v1.png?v=0.0001"
    }),
    runtimeObstacle("junkTallGrass", {
      id: "tallGrass",
      label: "Tall green grass",
      width: 1,
      height: 1,
      minCatLevel: 0,
      durationSeconds: 10 * 60,
      asset: OBSTACLE_ASSET_ROOT + "Tall%20Grass_Camp_Obstacle_Watercolor_Game_v1.png?v=0.0001"
    })
  ]);
  const HOME_OBSTACLE_BLUEPRINT = Object.freeze([
    Object.freeze({ id: "tallGrass", x: 6, y: 4 }),
    Object.freeze({ id: "tallGrass", x: 7, y: 4 }),
    Object.freeze({ id: "tallGrass", x: 6, y: 5 }),
    Object.freeze({ id: "tallGrass", x: 7, y: 5 }),
    Object.freeze({ id: "tallGrass", x: 6, y: 6 }),
    // This one-time early reward softens the opening without making every
    // junk deterministic loot. It is revealed only when the cleanup is ready.
    Object.freeze({
      id: "pebblePile",
      x: 7,
      y: 6,
      reward: Object.freeze({ resourceId: "pebbleBricks", quantity: 1 })
    }),
    Object.freeze({ id: "flowerBush", x: 8, y: 6 }),
    Object.freeze({ id: "flowerBush", x: 10, y: 6 }),
    Object.freeze({ id: "pebblePile", x: 7, y: 7 }),
    Object.freeze({ id: "pebblePile", x: 10, y: 7 }),
    Object.freeze({ id: "greenBush", x: 6, y: 8 }),
    Object.freeze({ id: "tallGrass", x: 10, y: 8 }),
    Object.freeze({ id: "thornBush", x: 6, y: 9 }),
    Object.freeze({ id: "thornBush", x: 8, y: 9 }),
    Object.freeze({ id: "thornBush", x: 10, y: 9 }),
    Object.freeze({ id: "stoneBlockPile", x: 8, y: 10 }),
    Object.freeze({ id: "stoneBlockPile", x: 10, y: 10 })
  ]);
  const INITIAL_CLEARED_CELLS = Object.freeze([
    "8:4", "9:4", "10:4", "11:4",
    "8:5", "9:5", "10:5", "11:5",
    "6:7", "8:7", "9:7", "11:7",
    "8:8", "9:8", "11:8",
    "6:10", "7:10", "6:11", "7:11"
  ]);
  const DEMOLITION_BASE_DURATION_SECONDS = 10 * 60;

  function entier(value) {
    const number = Number(value);
    return Number.isFinite(number) ? Math.round(number) : NaN;
  }

  function normaliserRotation(value) {
    const angle = entier(value);
    if (!Number.isFinite(angle)) return 0;
    return ((Math.round(angle / 90) * 90) % 360 + 360) % 360;
  }

  function celluleDansGrille(x, y) {
    return Number.isFinite(entier(x))
      && Number.isFinite(entier(y))
      && entier(x) >= 0
      && entier(y) >= 0
      && entier(x) < GRID_WIDTH
      && entier(y) < GRID_HEIGHT;
  }

  function cleCellule(x, y) {
    return entier(x) + ":" + entier(y);
  }

  function lireCleCellule(value) {
    if (typeof value !== "string" || !/^\d+:\d+$/.test(value)) return null;
    const parties = value.split(":");
    const x = entier(parties[0]);
    const y = entier(parties[1]);
    return celluleDansGrille(x, y) ? { x: x, y: y } : null;
  }

  function celluleDansZone(zone, x, y) {
    return Boolean(zone)
      && x >= zone.x
      && y >= zone.y
      && x < zone.x + zone.width
      && y < zone.y + zone.height;
  }

  function zoneTerrainPourCellule(x, y) {
    const positionX = entier(x);
    const positionY = entier(y);
    if (!celluleDansGrille(positionX, positionY)) return null;
    const ids = Object.keys(TERRITORY_ZONES);
    for (let index = 0; index < ids.length; index += 1) {
      const zone = TERRITORY_ZONES[ids[index]];
      if (celluleDansZone(zone, positionX, positionY)) return zone;
    }
    return null;
  }

  function cellulesRectangle(rectangle) {
    if (!rectangle) return [];
    const cellules = [];
    for (let y = rectangle.y; y < rectangle.y + rectangle.height; y += 1) {
      for (let x = rectangle.x; x < rectangle.x + rectangle.width; x += 1) {
        if (celluleDansGrille(x, y)) cellules.push({ x: x, y: y });
      }
    }
    return cellules;
  }

  function creerLayoutObstacles() {
    const obstacles = [];
    const cellulesOccupees = new Set(INITIAL_CLEARED_CELLS);
    HOME_OBSTACLE_BLUEPRINT.forEach(function(definition) {
      const type = OBSTACLE_TYPES.find(function(candidat) { return candidat.id === definition.id; });
      const zone = TERRITORY_ZONES.home;
      if (!type) return;
      const cellules = cellulesRectangle({
        x: definition.x,
        y: definition.y,
        width: type.width,
        height: type.height
      });
      if (
        cellules.length !== type.width * type.height
        || cellules.some(function(cellule) {
          return !celluleDansZone(zone, cellule.x, cellule.y)
            || cellulesOccupees.has(cleCellule(cellule.x, cellule.y));
        })
      ) return;
      cellules.forEach(function(cellule) { cellulesOccupees.add(cleCellule(cellule.x, cellule.y)); });
      obstacles.push(Object.freeze({
        uid: zone.id + ":" + definition.x + ":" + definition.y,
        id: type.id,
        label: type.label,
        width: type.width,
        height: type.height,
        minCatLevel: type.minCatLevel,
        durationSeconds: type.durationSeconds,
        reward: definition.reward || null,
        asset: type.asset,
        zoneId: zone.id,
        x: definition.x,
        y: definition.y,
        cells: Object.freeze(cellules.map(function(cellule) {
          return Object.freeze({ x: cellule.x, y: cellule.y });
        }))
      }));
    });
    const zoneIds = Object.keys(TERRITORY_ZONES).filter(function(zoneId) {
      return zoneId !== "home";
    });
    zoneIds.forEach(function(zoneId, zoneIndex) {
      const zone = TERRITORY_ZONES[zoneId];
      for (let y = zone.y; y < zone.y + zone.height; y += 1) {
        for (let x = zone.x; x < zone.x + zone.width; x += 1) {
          if (cellulesOccupees.has(cleCellule(x, y))) continue;
          const indexInitial = Math.abs(x * 17 + y * 31 + zoneIndex * 43)
            % OBSTACLE_TYPES.length;
          let selection = null;
          for (let decalage = 0; decalage < OBSTACLE_TYPES.length; decalage += 1) {
            const type = OBSTACLE_TYPES[(indexInitial + decalage) % OBSTACLE_TYPES.length];
            const cellules = cellulesRectangle({
              x: x,
              y: y,
              width: type.width,
              height: type.height
            });
            const tientDansZone = cellules.length === type.width * type.height
              && cellules.every(function(cellule) {
                return celluleDansZone(zone, cellule.x, cellule.y)
                  && !cellulesOccupees.has(cleCellule(cellule.x, cellule.y));
              });
            if (!tientDansZone) continue;
            selection = { type: type, cellules: cellules };
            break;
          }
          if (!selection) continue;
          selection.cellules.forEach(function(cellule) {
            cellulesOccupees.add(cleCellule(cellule.x, cellule.y));
          });
          obstacles.push(Object.freeze({
            uid: zone.id + ":" + x + ":" + y,
            id: selection.type.id,
            label: selection.type.label,
            width: selection.type.width,
            height: selection.type.height,
            minCatLevel: selection.type.minCatLevel,
            durationSeconds: selection.type.durationSeconds,
            reward: null,
            asset: selection.type.asset,
            zoneId: zone.id,
            x: x,
            y: y,
            cells: Object.freeze(selection.cellules.map(function(cellule) {
              return Object.freeze({ x: cellule.x, y: cellule.y });
            }))
          }));
        }
      }
    });
    return Object.freeze(obstacles);
  }

  const OBSTACLE_LAYOUT = creerLayoutObstacles();
  const OBSTACLE_BY_CELL_KEY = Object.freeze(OBSTACLE_LAYOUT.reduce(function(index, obstacle) {
    obstacle.cells.forEach(function(cellule) {
      index[cleCellule(cellule.x, cellule.y)] = obstacle;
    });
    return index;
  }, {}));

  function creerTerrainInitial() {
    return {
      version: 4,
      claimedZoneIds: ["home"],
      clearedCells: INITIAL_CLEARED_CELLS.slice()
    };
  }

  function normaliserTerrain(value) {
    const source = value && typeof value === "object" ? value : {};
    const zonesConquises = new Set(["home"]);
    if (Array.isArray(source.claimedZoneIds)) {
      source.claimedZoneIds.forEach(function(zoneId) {
        if (TERRITORY_ZONES[zoneId]) zonesConquises.add(zoneId);
      });
    }
    const cellulesLibres = new Set(creerTerrainInitial().clearedCells);
    if (Array.isArray(source.clearedCells)) {
      source.clearedCells.forEach(function(cle) {
        const cellule = lireCleCellule(cle);
        const zone = cellule && zoneTerrainPourCellule(cellule.x, cellule.y);
        if (zone && zonesConquises.has(zone.id)) cellulesLibres.add(cleCellule(cellule.x, cellule.y));
      });
    }
    Array.from(cellulesLibres).forEach(function(cle) {
      const obstacle = OBSTACLE_BY_CELL_KEY[cle];
      if (!obstacle || !zonesConquises.has(obstacle.zoneId)) return;
      obstacle.cells.forEach(function(cellule) {
        cellulesLibres.add(cleCellule(cellule.x, cellule.y));
      });
    });
    return {
      version: 4,
      claimedZoneIds: Object.keys(TERRITORY_ZONES).filter(function(zoneId) {
        return zonesConquises.has(zoneId);
      }),
      clearedCells: Array.from(cellulesLibres).sort(function(a, b) {
        const celluleA = lireCleCellule(a);
        const celluleB = lireCleCellule(b);
        return celluleA.y - celluleB.y || celluleA.x - celluleB.x;
      })
    };
  }

  function estZoneConquise(terrain, zoneId) {
    const normalise = normaliserTerrain(terrain);
    return normalise.claimedZoneIds.includes(zoneId);
  }

  function estCelluleConstructible(terrain, x, y) {
    if (!celluleDansGrille(x, y)) return false;
    const normalise = normaliserTerrain(terrain);
    const zone = zoneTerrainPourCellule(x, y);
    return Boolean(zone)
      && normalise.claimedZoneIds.includes(zone.id)
      && normalise.clearedCells.includes(cleCellule(x, y));
  }

  function cellulesVoisines(x, y) {
    return [
      { x: x, y: y - 1 },
      { x: x + 1, y: y },
      { x: x, y: y + 1 },
      { x: x - 1, y: y }
    ].filter(function(cellule) {
      return celluleDansGrille(cellule.x, cellule.y);
    });
  }

  function peutDebroussailler(terrain, x, y) {
    const positionX = entier(x);
    const positionY = entier(y);
    const zone = zoneTerrainPourCellule(positionX, positionY);
    const normalise = normaliserTerrain(terrain);
    if (!zone) return { valide: false, raison: "This cell is outside the camp." };
    if (!normalise.claimedZoneIds.includes(zone.id)) {
      return { valide: false, raison: "Conquer this territory before clearing it." };
    }
    if (normalise.clearedCells.includes(cleCellule(positionX, positionY))) {
      return { valide: false, raison: "This cell is already clear." };
    }
    const obstacle = OBSTACLE_BY_CELL_KEY[cleCellule(positionX, positionY)];
    if (!obstacle) return { valide: false, raison: "There is nothing to clear here." };
    const cellulesObstacle = new Set(obstacle.cells.map(function(cellule) {
      return cleCellule(cellule.x, cellule.y);
    }));
    const cellulesLibres = new Set(normalise.clearedCells);
    const toucheTerrainLibre = obstacle.cells.some(function(celluleObstacle) {
      return cellulesVoisines(celluleObstacle.x, celluleObstacle.y).some(function(cellule) {
        const cle = cleCellule(cellule.x, cellule.y);
        return !cellulesObstacle.has(cle) && cellulesLibres.has(cle);
      });
    });
    return toucheTerrainLibre
      ? { valide: true, raison: "", obstacle: obstacle }
      : { valide: false, raison: "Clear a neighboring cell first." };
  }

  function debroussaillerTerrain(terrain, x, y) {
    const resultat = peutDebroussailler(terrain, x, y);
    if (!resultat.valide) {
      return { valide: false, raison: resultat.raison, terrain: normaliserTerrain(terrain) };
    }
    const normalise = normaliserTerrain(terrain);
    resultat.obstacle.cells.forEach(function(cellule) {
      normalise.clearedCells.push(cleCellule(cellule.x, cellule.y));
    });
    return {
      valide: true,
      raison: "",
      obstacle: resultat.obstacle,
      terrain: normaliserTerrain(normalise)
    };
  }

  function peutConquerirZone(terrain, zoneId) {
    const zone = TERRITORY_ZONES[zoneId];
    if (!zone) return { valide: false, raison: "Unknown territory." };
    if (estZoneConquise(terrain, zoneId)) {
      return { valide: false, raison: "This territory is already part of the camp." };
    }
    const toucheFrontiereLibre = cellulesRectangle(zone).some(function(cellule) {
      return cellulesVoisines(cellule.x, cellule.y).some(function(voisine) {
        return !celluleDansZone(zone, voisine.x, voisine.y)
          && estCelluleConstructible(terrain, voisine.x, voisine.y);
      });
    });
    return toucheFrontiereLibre
      ? { valide: true, raison: "" }
      : { valide: false, raison: "Clear a path to this territory first." };
  }

  function conquerirZoneTerrain(terrain, zoneId) {
    const resultat = peutConquerirZone(terrain, zoneId);
    if (!resultat.valide) {
      return { valide: false, raison: resultat.raison, terrain: normaliserTerrain(terrain) };
    }
    const normalise = normaliserTerrain(terrain);
    normalise.claimedZoneIds.push(zoneId);
    return { valide: true, raison: "", terrain: normaliserTerrain(normalise) };
  }

  function obstacleCellule(terrain, x, y) {
    const normalise = normaliserTerrain(terrain);
    const obstacle = OBSTACLE_BY_CELL_KEY[cleCellule(x, y)];
    if (!obstacle || !normalise.claimedZoneIds.includes(obstacle.zoneId)) return null;
    const cellulesLibres = new Set(normalise.clearedCells);
    return obstacle.cells.some(function(cellule) {
      return !cellulesLibres.has(cleCellule(cellule.x, cellule.y));
    }) ? obstacle : null;
  }

  function dureeDemolitionObstacle(obstacle) {
    if (obstacle && Number.isFinite(obstacle.durationSeconds) && obstacle.durationSeconds > 0) {
      return obstacle.durationSeconds;
    }
    const cellules = obstacle && Array.isArray(obstacle.cells)
      ? obstacle.cells.length
      : 0;
    if (cellules < 1) return 0;
    return DEMOLITION_BASE_DURATION_SECONDS * Math.pow(2, cellules - 1);
  }

  function obstaclesTerrain(terrain) {
    const normalise = normaliserTerrain(terrain);
    const zonesConquises = new Set(normalise.claimedZoneIds);
    const cellulesLibres = new Set(normalise.clearedCells);
    return OBSTACLE_LAYOUT.filter(function(obstacle) {
      return zonesConquises.has(obstacle.zoneId)
        && obstacle.cells.some(function(cellule) {
          return !cellulesLibres.has(cleCellule(cellule.x, cellule.y));
        });
    });
  }

  function adapterTerrainAuLayout(terrain, layout) {
    const normalise = normaliserTerrain(terrain);
    const zonesConquises = new Set(normalise.claimedZoneIds);
    const cellulesLibres = new Set(normalise.clearedCells);
    (Array.isArray(layout) ? layout : []).forEach(function(item) {
      const rectangle = rectangleItem(item);
      cellulesRectangle(rectangle).forEach(function(cellule) {
        const zone = zoneTerrainPourCellule(cellule.x, cellule.y);
        if (!zone) return;
        zonesConquises.add(zone.id);
        cellulesLibres.add(cleCellule(cellule.x, cellule.y));
      });
    });
    return normaliserTerrain({
      claimedZoneIds: Array.from(zonesConquises),
      clearedCells: Array.from(cellulesLibres)
    });
  }

  function dimensionsType(typeOuId, rotation) {
    const type = typeof typeOuId === "string" ? ITEM_TYPES[typeOuId] : typeOuId;
    if (!type) return null;
    const angle = type.rotatable ? normaliserRotation(rotation) : 0;
    const permute = angle === 90 || angle === 270;
    return {
      width: permute ? type.height : type.width,
      height: permute ? type.width : type.height,
      rotation: angle
    };
  }

  function rectangleItem(item) {
    const typeId = item && (LEGACY_TYPE_ALIASES[item.type] || item.type);
    const type = typeId && ITEM_TYPES[typeId];
    if (!type) return null;
    const dimensions = dimensionsType(type, item.rotation);
    return {
      x: entier(item.x),
      y: entier(item.y),
      width: dimensions.width,
      height: dimensions.height
    };
  }

  function rectanglesSeChevauchent(a, b) {
    return a.x < b.x + b.width
      && a.x + a.width > b.x
      && a.y < b.y + b.height
      && a.y + a.height > b.y;
  }

  function testerPlacement(layout, typeId, x, y, ignoreUid, rotation, terrain) {
    const type = ITEM_TYPES[typeId];
    const positionX = entier(x);
    const positionY = entier(y);
    if (!type) return { valide: false, raison: "Unknown prototype item." };
    if (!Number.isFinite(positionX) || !Number.isFinite(positionY)) {
      return { valide: false, raison: "Choose a grid position." };
    }

    const dimensions = dimensionsType(type, rotation);
    const rectangle = {
      x: positionX,
      y: positionY,
      width: dimensions.width,
      height: dimensions.height
    };
    if (
      rectangle.x < 0
      || rectangle.y < 0
      || rectangle.x + rectangle.width > GRID_WIDTH
      || rectangle.y + rectangle.height > GRID_HEIGHT
    ) {
      return { valide: false, raison: "This item would extend outside the camp." };
    }
    if (
      terrain
      && cellulesRectangle(rectangle).some(function(cellule) {
        return !estCelluleConstructible(terrain, cellule.x, cellule.y);
      })
    ) {
      return { valide: false, raison: "Clear and claim every cell under this item first." };
    }

    const elements = Array.isArray(layout) ? layout : [];
    for (let index = 0; index < elements.length; index += 1) {
      const autre = elements[index];
      if (!autre || autre.uid === ignoreUid) continue;
      const autreRectangle = rectangleItem(autre);
      if (autreRectangle && rectanglesSeChevauchent(rectangle, autreRectangle)) {
        const autreType = ITEM_TYPES[autre.type];
        return {
          valide: false,
          raison: "This space is occupied by " + (autreType ? autreType.label : "another item") + "."
        };
      }
    }

    return { valide: true, raison: "" };
  }

  function normaliserLayout(value, terrain) {
    if (!Array.isArray(value)) return [];
    const layout = [];
    value.forEach(function(item, index) {
      if (!item || typeof item !== "object") return;
      const typeId = LEGACY_TYPE_ALIASES[item.type] || item.type;
      if (!ITEM_TYPES[typeId]) return;
      const uid = typeof item.uid === "string" && item.uid
        ? item.uid
        : "camp-import-" + index;
      if (layout.some(function(existing) { return existing.uid === uid; })) return;
      const x = entier(item.x);
      const y = entier(item.y);
      const type = ITEM_TYPES[typeId];
      const rotation = type.rotatable ? normaliserRotation(item.rotation) : 0;
      if (!testerPlacement(layout, typeId, x, y, null, rotation, terrain).valide) return;
      const normalise = {
        uid: uid,
        type: typeId,
        x: x,
        y: y,
        tier: Number.isInteger(item.tier) && item.tier > 0 ? item.tier : 1
      };
      if (type.rotatable) normalise.rotation = rotation;
      if (type.category === "house") normalise.construit = item.construit === true;
      layout.push(normalise);
    });
    return layout;
  }

  function directionAccesItem(cellule, item) {
    const rectangle = rectangleItem(item);
    if (!cellule || !rectangle) return "south";
    if (cellule.y < rectangle.y) return "north";
    if (cellule.x >= rectangle.x + rectangle.width) return "east";
    if (cellule.y >= rectangle.y + rectangle.height) return "south";
    if (cellule.x < rectangle.x) return "west";
    return "south";
  }

  function directionOpposee(direction) {
    return {
      north: "south",
      east: "west",
      south: "north",
      west: "east"
    }[direction] || "north";
  }

  function arrondirGeometrieRaccord(value) {
    return Math.round(Number(value) * 1000000) / 1000000;
  }

  function raccordsRouteItem(layout, item, routesIndexees) {
    const type = item && ITEM_TYPES[item.type];
    const access = type && type.access;
    if (!type || !access || !Array.isArray(access.ports)) return [];
    const routesParCellule = routesIndexees instanceof Map
      ? routesIndexees
      : new Map();
    if (!(routesIndexees instanceof Map)) {
      (Array.isArray(layout) ? layout : []).forEach(function(entree) {
        const routeType = entree && ITEM_TYPES[entree.type];
        if (!routeType || routeType.category !== "road") return;
        routesParCellule.set(cleCellule(entree.x, entree.y), routeType);
      });
    }
    const portsCalcules = campConnectivity.portsItem(item, type);
    const rectangle = rectangleItem(item);
    if (!rectangle) return [];
    const portsParId = new Map(access.ports.map(function(port) {
      return [port.id || "entrance", port];
    }));
    const raccords = [];
    portsCalcules.forEach(function(portCalcule) {
      const port = portsParId.get(portCalcule.id);
      const visuel = port && port.visualConnector;
      if (!visuel) return;
      const cellulesRaccordees = portCalcule.cells.map(function(cellule) {
        const routeType = routesParCellule.get(cleCellule(cellule.x, cellule.y));
        if (!routeType) return null;
        const direction = directionAccesItem(cellule, item);
        const axeVertical = direction === "north" || direction === "south";
        const ancrageAutomatique = axeVertical
          ? (cellule.x - rectangle.x + 0.5) / rectangle.width
          : (cellule.y - rectangle.y + 0.5) / rectangle.height;
        return {
          cell: { x: cellule.x, y: cellule.y },
          direction: direction,
          material: visuel.material === "inherit"
            ? (routeType.roadMaterial || routeType.id)
            : visuel.material,
          automaticAnchor: ancrageAutomatique
        };
      }).filter(Boolean);
      const directions = new Set(cellulesRaccordees.map(function(raccord) {
        return raccord.direction;
      }));
      const materials = new Set(cellulesRaccordees.map(function(raccord) {
        return raccord.material;
      }));
      const fusionner = visuel.mergeContiguous === true
        && cellulesRaccordees.length > 1
        && cellulesRaccordees.length === portCalcule.cells.length
        && directions.size === 1
        && materials.size === 1;
      if (fusionner) {
        const premier = cellulesRaccordees[0];
        const axeVertical = premier.direction === "north"
          || premier.direction === "south";
        const largeurCellules = Number(visuel.mergedWidth)
          || cellulesRaccordees.length * 0.82;
        const largeurInterieureCellules = Math.min(
          largeurCellules,
          Number(visuel.mergedInnerWidth) || 0.62
        );
        const longueurCellules = Number(visuel.mergedLength)
          || Number(visuel.length)
          || 0.34;
        const tailleAxeTransversal = axeVertical
          ? rectangle.width
          : rectangle.height;
        const tailleAxeLongitudinal = axeVertical
          ? rectangle.height
          : rectangle.width;
        const ancrage = cellulesRaccordees.reduce(function(total, raccord) {
          return total + raccord.automaticAnchor;
        }, 0) / cellulesRaccordees.length;
        const referenceTextureCellules = Number(visuel.textureScaleCells) || 1.394;
        raccords.push({
          portId: portCalcule.id,
          cell: premier.cell,
          cells: cellulesRaccordees.map(function(raccord) { return raccord.cell; }),
          direction: premier.direction,
          material: premier.material,
          shape: "merged-cone",
          anchor: Math.max(0, Math.min(1, ancrage)),
          width: Math.max(0.02, Math.min(
            1,
            largeurCellules / tailleAxeTransversal
          )),
          innerRatio: Math.max(0.08, Math.min(
            1,
            largeurInterieureCellules / largeurCellules
          )),
          length: Math.max(0.02, Math.min(
            1,
            longueurCellules / tailleAxeLongitudinal
          )),
          textureX: arrondirGeometrieRaccord(referenceTextureCellules
            / (axeVertical ? largeurCellules : longueurCellules) * 100),
          textureY: arrondirGeometrieRaccord(referenceTextureCellules
            / (axeVertical ? longueurCellules : largeurCellules) * 100)
        });
        return;
      }
      cellulesRaccordees.forEach(function(raccordCellule) {
        const direction = raccordCellule.direction;
        const axeVertical = direction === "north" || direction === "south";
        const ancrageConfigure = Number(visuel.anchor);
        const largeurCellules = Number(visuel.width) || 0.32;
        const longueurCellules = Number(visuel.length) || 0.34;
        const tailleAxeTransversal = axeVertical
          ? rectangle.width
          : rectangle.height;
        const tailleAxeLongitudinal = axeVertical
          ? rectangle.height
          : rectangle.width;
        const referenceTextureCellules = Number(visuel.textureScaleCells) || 1.394;
        raccords.push({
          portId: portCalcule.id,
          cell: raccordCellule.cell,
          direction: direction,
          material: raccordCellule.material,
          anchor: Math.max(0, Math.min(
            1,
            Number.isFinite(ancrageConfigure)
              ? ancrageConfigure
              : raccordCellule.automaticAnchor
          )),
          width: Math.max(0.02, Math.min(
            1,
            largeurCellules / tailleAxeTransversal
          )),
          length: Math.max(0.02, Math.min(
            1,
            longueurCellules / tailleAxeLongitudinal
          )),
          textureX: arrondirGeometrieRaccord(referenceTextureCellules
            / (axeVertical ? largeurCellules : longueurCellules) * 100),
          textureY: arrondirGeometrieRaccord(referenceTextureCellules
            / (axeVertical ? longueurCellules : largeurCellules) * 100)
        });
      });
    });
    return raccords;
  }

  function connexionsRoute(layout, x, y) {
    const layoutNormalise = Array.isArray(layout) ? layout : [];
    const routesParCellule = new Map();
    layoutNormalise.forEach(function(item) {
      const routeType = item && ITEM_TYPES[item.type];
      if (!routeType || routeType.category !== "road") return;
      routesParCellule.set(cleCellule(item.x, item.y), routeType);
    });
    const positionX = entier(x);
    const positionY = entier(y);
    const connexionsBatiments = new Set();
    const connexionsBatimentsFusionnees = new Set();
    layoutNormalise.forEach(function(item) {
      raccordsRouteItem(layoutNormalise, item, routesParCellule).forEach(function(raccord) {
        const cellules = Array.isArray(raccord.cells)
          ? raccord.cells
          : [raccord.cell];
        if (!cellules.some(function(cellule) {
          return cellule.x === positionX && cellule.y === positionY;
        })) return;
        const direction = directionOpposee(raccord.direction);
        connexionsBatiments.add(direction);
        if (raccord.shape === "merged-cone") {
          connexionsBatimentsFusionnees.add(direction);
        }
      });
    });
    const roadNorth = routesParCellule.has(positionX + ":" + (positionY - 1));
    const roadEast = routesParCellule.has((positionX + 1) + ":" + positionY);
    const roadSouth = routesParCellule.has(positionX + ":" + (positionY + 1));
    const roadWest = routesParCellule.has((positionX - 1) + ":" + positionY);
    const buildingNorth = connexionsBatiments.has("north");
    const buildingEast = connexionsBatiments.has("east");
    const buildingSouth = connexionsBatiments.has("south");
    const buildingWest = connexionsBatiments.has("west");
    const mergedBuildingNorth = connexionsBatimentsFusionnees.has("north");
    const mergedBuildingEast = connexionsBatimentsFusionnees.has("east");
    const mergedBuildingSouth = connexionsBatimentsFusionnees.has("south");
    const mergedBuildingWest = connexionsBatimentsFusionnees.has("west");
    const north = roadNorth || buildingNorth;
    const east = roadEast || buildingEast;
    const south = roadSouth || buildingSouth;
    const west = roadWest || buildingWest;
    return {
      north: north,
      east: east,
      south: south,
      west: west,
      mask: (north ? 1 : 0) | (east ? 2 : 0) | (south ? 4 : 0) | (west ? 8 : 0),
      road: {
        north: roadNorth,
        east: roadEast,
        south: roadSouth,
        west: roadWest,
        mask: (roadNorth ? 1 : 0)
          | (roadEast ? 2 : 0)
          | (roadSouth ? 4 : 0)
          | (roadWest ? 8 : 0)
      },
      building: {
        north: buildingNorth,
        east: buildingEast,
        south: buildingSouth,
        west: buildingWest,
        mask: (buildingNorth ? 1 : 0)
          | (buildingEast ? 2 : 0)
          | (buildingSouth ? 4 : 0)
          | (buildingWest ? 8 : 0)
      },
      mergedBuilding: {
        north: mergedBuildingNorth,
        east: mergedBuildingEast,
        south: mergedBuildingSouth,
        west: mergedBuildingWest,
        mask: (mergedBuildingNorth ? 1 : 0)
          | (mergedBuildingEast ? 2 : 0)
          | (mergedBuildingSouth ? 4 : 0)
          | (mergedBuildingWest ? 8 : 0)
      }
    };
  }

  function evaluerConnexionsLayout(layout, terrain) {
    const terrainNormalise = normaliserTerrain(terrain);
    return campConnectivity.evaluerConnexions({
      gridWidth: GRID_WIDTH,
      gridHeight: GRID_HEIGHT,
      layout: Array.isArray(layout) ? layout : [],
      itemTypes: ITEM_TYPES,
      walkableCellKeys: terrainNormalise.clearedCells,
      originCells: CONNECTION_ORIGIN_CELLS
    });
  }

  function accesExterieurDisponible(evaluation) {
    const atteignables = new Set(
      evaluation && Array.isArray(evaluation.reachableCellKeys)
        ? evaluation.reachableCellKeys
        : []
    );
    return CONNECTION_ORIGIN_CELLS.some(function(cellule) {
      return atteignables.has(cleCellule(cellule.x, cellule.y + 1));
    });
  }

  function cellulesLigne(x0, y0, x1, y1) {
    let debutX = entier(x0);
    let debutY = entier(y0);
    const finX = entier(x1);
    const finY = entier(y1);
    if (![debutX, debutY, finX, finY].every(Number.isFinite)) return [];
    const cellules = [];
    const deltaX = Math.abs(finX - debutX);
    const pasX = debutX < finX ? 1 : -1;
    const deltaY = -Math.abs(finY - debutY);
    const pasY = debutY < finY ? 1 : -1;
    let erreur = deltaX + deltaY;

    while (true) {
      const precedente = cellules[cellules.length - 1];
      if (
        precedente
        && precedente.x !== debutX
        && precedente.y !== debutY
      ) {
        cellules.push({ x: debutX, y: precedente.y });
      }
      cellules.push({ x: debutX, y: debutY });
      if (debutX === finX && debutY === finY) break;
      const doubleErreur = 2 * erreur;
      if (doubleErreur >= deltaY) {
        erreur += deltaY;
        debutX += pasX;
      }
      if (doubleErreur <= deltaX) {
        erreur += deltaX;
        debutY += pasY;
      }
    }
    return cellules;
  }

  function aretesLigne(debut, fin) {
    if (!debut || !fin) return [];
    const aretes = [];
    if (debut.orientation === "vertical" && debut.x === fin.x) {
      const pas = debut.y <= fin.y ? 1 : -1;
      for (let y = debut.y; y !== fin.y + pas; y += pas) {
        aretes.push({ x: debut.x, y: y, orientation: "vertical" });
      }
      return aretes;
    }
    if (debut.orientation === "horizontal" && debut.y === fin.y) {
      const pas = debut.x <= fin.x ? 1 : -1;
      for (let x = debut.x; x !== fin.x + pas; x += pas) {
        aretes.push({ x: x, y: debut.y, orientation: "horizontal" });
      }
      return aretes;
    }
    const sommets = function(arete) {
      return arete.orientation === "vertical"
        ? [{ x: arete.x, y: arete.y }, { x: arete.x, y: arete.y + 1 }]
        : [{ x: arete.x, y: arete.y }, { x: arete.x + 1, y: arete.y }];
    };
    let raccord = null;
    sommets(debut).forEach(function(sortie) {
      sommets(fin).forEach(function(entree) {
        const distance = Math.abs(entree.x - sortie.x) + Math.abs(entree.y - sortie.y);
        if (!raccord || distance < raccord.distance) {
          raccord = { sortie: sortie, entree: entree, distance: distance };
        }
      });
    });
    aretes.push(debut);
    let x = raccord.sortie.x;
    let y = raccord.sortie.y;
    const ajouterHorizontalement = function() {
      while (x !== raccord.entree.x) {
        const suivant = x + (raccord.entree.x > x ? 1 : -1);
        aretes.push({
          x: Math.min(x, suivant),
          y: y,
          orientation: "horizontal"
        });
        x = suivant;
      }
    };
    const ajouterVerticalement = function() {
      while (y !== raccord.entree.y) {
        const suivant = y + (raccord.entree.y > y ? 1 : -1);
        aretes.push({
          x: x,
          y: Math.min(y, suivant),
          orientation: "vertical"
        });
        y = suivant;
      }
    };
    if (debut.orientation === "horizontal") {
      ajouterHorizontalement();
      ajouterVerticalement();
    } else {
      ajouterVerticalement();
      ajouterHorizontalement();
    }
    aretes.push(fin);
    const uniques = new Map();
    aretes.forEach(function(arete) {
      uniques.set(arete.orientation + ":" + arete.x + ":" + arete.y, arete);
    });
    return Array.from(uniques.values());
  }

  CatInc.camp = Object.freeze({
    GRID_WIDTH: GRID_WIDTH,
    GRID_HEIGHT: GRID_HEIGHT,
    HOUSE_DECOR_HEIGHT: HOUSE_DECOR_HEIGHT,
    TERRAIN_CELL_COUNT: TERRAIN_CELL_COUNT,
    ITEM_TYPES: ITEM_TYPES,
    FENCE_TYPES: FENCE_TYPES,
    runtimeVisualForTier: runtimeVisualForTier,
    CONNECTION_ORIGIN_CELLS: CONNECTION_ORIGIN_CELLS,
    INITIAL_BUILDABLE_RECT: INITIAL_BUILDABLE_RECT,
    INITIAL_CLEARED_CELLS: INITIAL_CLEARED_CELLS,
    HOME_OBSTACLE_BLUEPRINT: HOME_OBSTACLE_BLUEPRINT,
    TERRITORY_ZONES: TERRITORY_ZONES,
    OBSTACLE_TYPES: OBSTACLE_TYPES,
    OBSTACLE_LAYOUT: OBSTACLE_LAYOUT,
    DEMOLITION_BASE_DURATION_SECONDS: DEMOLITION_BASE_DURATION_SECONDS,
    normaliserRotation: normaliserRotation,
    celluleDansGrille: celluleDansGrille,
    cleCellule: cleCellule,
    zoneTerrainPourCellule: zoneTerrainPourCellule,
    cellulesRectangle: cellulesRectangle,
    aretesLigne: aretesLigne,
    creerTerrainInitial: creerTerrainInitial,
    normaliserTerrain: normaliserTerrain,
    estZoneConquise: estZoneConquise,
    estCelluleConstructible: estCelluleConstructible,
    peutDebroussailler: peutDebroussailler,
    debroussaillerTerrain: debroussaillerTerrain,
    peutConquerirZone: peutConquerirZone,
    conquerirZoneTerrain: conquerirZoneTerrain,
    obstacleCellule: obstacleCellule,
    obstaclesTerrain: obstaclesTerrain,
    dureeDemolitionObstacle: dureeDemolitionObstacle,
    adapterTerrainAuLayout: adapterTerrainAuLayout,
    dimensionsType: dimensionsType,
    rectangleItem: rectangleItem,
    rectanglesSeChevauchent: rectanglesSeChevauchent,
    testerPlacement: testerPlacement,
    normaliserLayout: normaliserLayout,
    evaluerConnexionsLayout: evaluerConnexionsLayout,
    accesExterieurDisponible: accesExterieurDisponible,
    raccordsRouteItem: raccordsRouteItem,
    connexionsRoute: connexionsRoute,
    cellulesLigne: cellulesLigne
  });
})(typeof window !== "undefined" ? window : globalThis);
