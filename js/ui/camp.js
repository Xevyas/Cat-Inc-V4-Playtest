(function(root) {
  "use strict";

  const CatInc = root.CatInc = root.CatInc || {};
  const campConnectivity = CatInc.campConnectivity;
  if (!campConnectivity) {
    throw new Error("CatInc.campConnectivity must be loaded before CatInc.camp.");
  }
  const CAMP_TEMPLATE_MANIFEST = CatInc.data && CatInc.data.campTemplates;
  const ACTIVE_CAMP_TEMPLATE = CAMP_TEMPLATE_MANIFEST
    && CAMP_TEMPLATE_MANIFEST.templates
    && CAMP_TEMPLATE_MANIFEST.templates[CAMP_TEMPLATE_MANIFEST.activeTemplateId];
  if (!ACTIVE_CAMP_TEMPLATE) {
    throw new Error("CatInc.data.campTemplates must contain an active template before CatInc.camp.");
  }
  const GRID_WIDTH = ACTIVE_CAMP_TEMPLATE.grid.width;
  const GRID_HEIGHT = ACTIVE_CAMP_TEMPLATE.grid.height;
  const HOUSE_DECOR_HEIGHT = ACTIVE_CAMP_TEMPLATE.grid.houseDecorHeight;
  const OBSTACLE_ASSET_ROOT = "img/Maps/Camp%20Runtime/Obstacles/";
  const RUNTIME_MANIFEST = CatInc.data && CatInc.data.campAssets
    ? CatInc.data.campAssets
    : { assets: {} };
  const STICKER_CATALOG = RUNTIME_MANIFEST.stickers || { schemaVersion: 1, colors: [], items: [] };
  const STICKER_ITEMS = Object.freeze((STICKER_CATALOG.items || []).reduce(function(index, item) {
    if (item && typeof item.id === "string") index[item.id] = Object.freeze({...item});
    return index;
  }, {}));
  const STICKER_COLORS = Object.freeze((STICKER_CATALOG.colors || []).reduce(function(index, color) {
    if (color && typeof color.id === "string") index[color.id] = Object.freeze({...color});
    return index;
  }, {}));
  const GAMEPLAY_MANIFEST = CatInc.data && CatInc.data.campGameplay
    ? CatInc.data.campGameplay
    : { definitions: {} };
  const runtimeSearch = root.location && typeof root.location.search === "string"
    ? root.location.search
    : "";
  const runtimeDebug = /(?:^|[?&])debug=1(?:&|$)/.test(runtimeSearch);
  const runtimeFootprintFixture = runtimeDebug
    && /(?:^|[?&])footprintFixture=1(?:&|$)/.test(runtimeSearch);

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

  function runtimeRevision(typeId, preferredTier, allowedFallbackTier) {
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
    const reviewRevisionRequested = revisionNumber != null;
    let tier = family.tiers[String(tierNumber)];
    const exactLiveRevision = tier && Number.isInteger(tier.liveRevision)
      && tier.revisions && tier.revisions[String(tier.liveRevision)];
    if ((!exactLiveRevision || exactLiveRevision.status !== "live") && !reviewRevisionRequested) {
      const fallbackTiers = Object.keys(family.tiers).map(Number).filter(function(candidate) {
        const candidateTier = family.tiers[String(candidate)];
        const candidateRevision = candidateTier && Number.isInteger(candidateTier.liveRevision)
          && candidateTier.revisions && candidateTier.revisions[String(candidateTier.liveRevision)];
        return Number.isInteger(candidate)
          && candidate <= tierNumber
          && (!Number.isInteger(allowedFallbackTier) || candidate === allowedFallbackTier)
          && candidateTier
          && candidateRevision && candidateRevision.status === "live";
      }).sort(function(a, b) { return b - a; });
      tierNumber = fallbackTiers.length > 0 ? fallbackTiers[0] : 1;
      tier = family.tiers[String(tierNumber)];
    }
    if (!tier) return null;
    if (revisionNumber == null) revisionNumber = tier.liveRevision;
    if (revisionNumber == null) return null;
    const revision = tier.revisions[String(revisionNumber)] || null;
    return revision && (reviewRevisionRequested || revision.status === "live")
      ? revision
      : null;
  }

  function runtimeSpritePath(path, revision) {
    if (!path) return "";
    const separator = String(path).includes("?") ? "&" : "?";
    return String(path) + separator + "camp-runtime=" + revision.tier + "." + revision.revision;
  }

  function runtimeReviewRevision(typeId, preferredTier) {
    const family = RUNTIME_MANIFEST.reviewAssets
      && RUNTIME_MANIFEST.reviewAssets[typeId];
    const tier = family && family.tiers
      && family.tiers[String(preferredTier || 1)];
    if (!tier || !Number.isInteger(tier.liveRevision)) return null;
    const revision = tier.revisions && tier.revisions[String(tier.liveRevision)];
    return revision && revision.status === "live" ? revision : null;
  }

  function normaliserStickerSlot(value) {
    if (!value || typeof value !== "object") return null;
    if (value.enabled === false) return null;
    const mode = value.mode === "surface" || value.mode === "pitched-roof"
      ? value.mode
      : "none";
    if (mode === "none" || typeof value.id !== "string") return null;
    const allowed = mode === "surface" ? ["surface"] : ["left", "right"];
    if (!["storage", "general", "jobs"].includes(value.category)) return null;
    if (!value.anchors || typeof value.anchors !== "object") return null;
    const anchors = {};
    for (const direction of ["down", "right", "up", "left"]) {
      const mapping = value.anchors[direction];
      if (!mapping || !allowed.includes(mapping.auto)) return null;
      const normalized = {auto: mapping.auto};
      for (const anchorId of allowed) {
        const point = mapping[anchorId];
        if (!point || !Number.isFinite(Number(point.x)) || !Number.isFinite(Number(point.y))) return null;
        normalized[anchorId] = Object.freeze({
          x: Math.max(0, Math.min(1, Number(point.x))),
          y: Math.max(0, Math.min(1, Number(point.y))),
          visible: point.visible !== false,
          quad: Array.isArray(point.quad) && point.quad.length === 4
            && point.quad.every(function(corner) {
              return corner && Number.isFinite(Number(corner.x)) && Number.isFinite(Number(corner.y));
            })
            ? Object.freeze(point.quad.map(function(corner) {
                return Object.freeze({x: Number(corner.x), y: Number(corner.y)});
              }))
            : null
        });
      }
      anchors[direction] = Object.freeze(normalized);
    }
    return Object.freeze({
      id: value.id,
      mode: mode,
      category: value.category,
      anchors: Object.freeze(anchors),
      anchorReview: value.anchorReview === true,
      required: value.required === true || value.category === "storage",
      baseSticker: value.baseSticker === true || value.category === "storage",
      defaultStickerId: typeof value.defaultStickerId === "string" ? value.defaultStickerId : null,
      defaultColorId: typeof value.defaultColorId === "string" ? value.defaultColorId : null,
      defaultScale: Number.isFinite(Number(value.defaultScale))
        ? Math.max(0.8, Math.min(2, Number(value.defaultScale)))
        : 1,
      defaultAnchorChoice: value.defaultAnchorChoice === "left" || value.defaultAnchorChoice === "right"
        ? value.defaultAnchorChoice
        : "auto"
    });
  }

  function stickerSlotForType(typeOrId) {
    const type = typeof typeOrId === "string" ? ITEM_TYPES[typeOrId] : typeOrId;
    return type && type.stickerSlot ? normaliserStickerSlot(type.stickerSlot) : null;
  }

  function normaliserStickerSelection(value, typeOrId) {
    const slot = stickerSlotForType(typeOrId);
    if (!slot) return null;
    const source = value && typeof value === "object" && !Array.isArray(value) ? value : {};
    let sticker = STICKER_ITEMS[source.stickerId];
    const explicitSelection = Boolean(
      sticker && sticker.category === slot.category && source.slotId === slot.id
    );
    if (!explicitSelection) {
      if (!slot.baseSticker) return null;
      sticker = slot.defaultStickerId && STICKER_ITEMS[slot.defaultStickerId];
    }
    if (!sticker || sticker.category !== slot.category) return null;
    const colorId = sticker.colorIds.includes(source.colorId)
      ? source.colorId
      : (slot.defaultColorId && sticker.colorIds.includes(slot.defaultColorId)
        ? slot.defaultColorId
        : sticker.defaultColorId);
    const rawScale = Number(source.scale);
    const scale = Number.isFinite(rawScale)
      ? Math.max(0.8, Math.min(2, rawScale))
      : slot.defaultScale;
    const anchorChoice = slot.mode === "pitched-roof"
      && (source.anchorChoice === "left" || source.anchorChoice === "right")
      ? source.anchorChoice
      : slot.defaultAnchorChoice;
    return Object.freeze({
      stickerId: sticker.id,
      colorId: colorId,
      scale: Math.round(scale * 1000) / 1000,
      slotId: slot.id,
      anchorChoice: anchorChoice
    });
  }

  function resoudreAncrageSticker(typeOrId, rotation, anchorChoice) {
    const slot = stickerSlotForType(typeOrId);
    if (!slot) return null;
    const direction = ({0: "down", 90: "right", 180: "up", 270: "left"})[normaliserRotation(rotation)] || "down";
    const mapping = slot.anchors[direction];
    const requested = anchorChoice === "auto" ? mapping.auto : anchorChoice;
    const anchorId = mapping[requested] ? requested : mapping.auto;
    const point = mapping[anchorId];
    return Object.freeze({anchorId: anchorId, x: point.x, y: point.y, quad: point.quad, visible: point.visible});
  }

  function stickerVisualForSelection(typeOrId, value, rotation) {
    const selection = normaliserStickerSelection(value, typeOrId);
    if (!selection) return null;
    const sticker = STICKER_ITEMS[selection.stickerId];
    const color = STICKER_COLORS[selection.colorId];
    const anchor = resoudreAncrageSticker(typeOrId, rotation, selection.anchorChoice);
    if (!sticker || !color || !anchor || anchor.visible === false) return null;
    return Object.freeze({
      ...selection,
      image: sticker.maskDataUri || (
        sticker.runtimePath + (sticker.runtimePath.includes("?") ? "&" : "?") + "sticker-art=3"
      ),
      color: color.hex,
      x: anchor.x,
      y: anchor.y,
      quad: anchor.quad || null,
      rotation: normaliserRotation(rotation)
    });
  }

  function stickerChoicesForType(typeOrId) {
    const slot = stickerSlotForType(typeOrId);
    if (!slot) return Object.freeze([]);
    return Object.freeze(Object.values(STICKER_ITEMS).filter(function(item) {
      return item.category === slot.category;
    }));
  }

  function stickerFocusControlKey(value) {
    return ["id", "color", "scale", "anchor"].includes(value) ? value : "scale";
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
    const family = RUNTIME_MANIFEST.assets && RUNTIME_MANIFEST.assets[typeId];
    const tierFootprints = {};
    const tierAccess = {};
    Object.keys(family && family.tiers || {}).forEach(function(tierNumber) {
      const tierRevision = runtimeRevision(typeId, Number(tierNumber));
      if (!tierRevision) return;
      tierFootprints[tierNumber] = Object.freeze({
        width: tierRevision.width,
        height: tierRevision.height,
        occupiedCells: Array.isArray(tierRevision.occupiedCells)
          ? Object.freeze(tierRevision.occupiedCells.map(function(cell) { return Object.freeze({...cell}); }))
          : undefined
      });
      const tierFallbackAccess = Number(tierNumber) === 1 ? fallback.access : null;
      tierAccess[tierNumber] = Object.prototype.hasOwnProperty.call(tierRevision, "access")
        ? runtimeAccess(tierRevision.access, tierFallbackAccess)
        : tierFallbackAccess;
    });
    const sprites = {};
    Object.keys(revision.sprites || {}).forEach(function(direction) {
      sprites[direction] = runtimeSpritePath(revision.sprites[direction], revision);
    });
    return Object.freeze({
      ...fallback,
      label: revision.name || fallback.label,
      width: revision.width,
      height: revision.height,
      occupiedCells: revision.occupiedCells,
      tierFootprints: Object.freeze(tierFootprints),
      tierAccess: Object.freeze(tierAccess),
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
      requiredCats: revision.gameplay && Number.isInteger(revision.gameplay.requiredCats)
        ? revision.gameplay.requiredCats
        : (fallback.requiredCats || 1),
      gameplay: revision.gameplay || fallback.gameplay,
      stickerSlot: normaliserStickerSlot(revision.stickerSlot || fallback.stickerSlot),
      canonicalOrientation: family && family.category === "junk" ? "down" : "",
      runtimeTier: revision.tier,
      runtimeRevision: revision.revision,
      runtimeStatus: revision.status
    });
  }

  function runtimePathType(typeId, fallback) {
    const revision = runtimeReviewRevision(typeId, 1);
    if (!revision || !revision.buildingJoin) return Object.freeze(fallback);
    return Object.freeze({
      ...fallback,
      label: revision.name || fallback.label,
      roadMaterial: typeId,
      buildingJoin: Object.freeze({
        ...revision.buildingJoin,
        merged: Object.freeze({...revision.buildingJoin.merged})
      }),
      asset: runtimeSpritePath(
        revision.sprites && revision.sprites.down,
        revision
      ) || fallback.asset
    });
  }

  function gameplayItem(typeId, fallback) {
    const definition = GAMEPLAY_MANIFEST.definitions && GAMEPLAY_MANIFEST.definitions[typeId];
    if (!definition) return fallback;
    return Object.freeze({
      ...fallback,
      label: fallback.label || definition.name
    });
  }

  function gameplayRuntimeItem(typeId, fallback) {
    const definition = GAMEPLAY_MANIFEST.definitions && GAMEPLAY_MANIFEST.definitions[typeId];
    const runtimeId = definition && definition.assetId
      ? Object.keys(RUNTIME_MANIFEST.assets || {}).find(function(candidateId) {
        return RUNTIME_MANIFEST.assets[candidateId].assetId === definition.assetId;
      })
      : null;
    return runtimeItem(runtimeId || typeId, fallback);
  }

  function runtimeVisualForTier(typeId, functionalTier) {
    const definition = GAMEPLAY_MANIFEST.definitions && GAMEPLAY_MANIFEST.definitions[typeId];
    const tierConfig = definition && definition.upgradeTiers
      && definition.upgradeTiers[String(functionalTier)];
    const allowedFallbackTier = tierConfig && Number.isInteger(tierConfig.visualFallbackTier)
      ? tierConfig.visualFallbackTier
      : null;
    const revision = runtimeRevision(typeId, functionalTier, allowedFallbackTier);
    if (!revision || !revision.sprites) return null;
    const sprites = {};
    Object.keys(revision.sprites).forEach(function(direction) {
      sprites[direction] = runtimeSpritePath(revision.sprites[direction], revision);
    });
    const groundingSprites = {};
    Object.keys(revision.groundingSprites || {}).forEach(function(direction) {
      groundingSprites[direction] = runtimeSpritePath(
        revision.groundingSprites[direction], revision
      );
    });
    return {
      tier: revision.tier,
      revision: revision.revision,
      sprites: sprites,
      groundingSprites: groundingSprites,
      groundingBounds: revision.groundingBounds || null,
      width: revision.width,
      height: revision.height,
      occupiedCells: revision.occupiedCells
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
        minimumReachableCells: 1
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
          Object.freeze({ x: 0, y: 2 }),
          Object.freeze({ x: 1, y: 2 })
        ]),
        minimumReachableCells: 2
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
  const OPERATIONS_TABLE_ACCESS = singleEntranceAccess(2, 1);
  const LABORATORY_ACCESS = singleEntranceAccess(3, 1);
  const STORAGE_ACCESS = singleEntranceAccess(1, 1);
  const STORAGE_STICKER_SLOT = Object.freeze({
    id: "front-surface",
    mode: "surface",
    category: "storage",
    required: true,
    defaultStickerId: "storage-stacked-boxes",
    defaultColorId: "kraft",
    defaultScale: 1,
    defaultAnchorChoice: "auto",
    anchors: Object.freeze({
      down: Object.freeze({auto: "surface", surface: Object.freeze({x: 0.5, y: 0.46})}),
      right: Object.freeze({auto: "surface", surface: Object.freeze({x: 0.55, y: 0.46})}),
      up: Object.freeze({auto: "surface", surface: Object.freeze({x: 0.5, y: 0.46})}),
      left: Object.freeze({auto: "surface", surface: Object.freeze({x: 0.45, y: 0.46})})
    })
  });

  const BASE_ITEM_TYPES = {
    cardboardBox: gameplayItem("cardboardBox", runtimeItem("cardboardBox", {
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
    })),
    woodCathouse: gameplayItem("woodCathouse", gameplayRuntimeItem("woodCathouse", {
      id: "woodCathouse",
      label: "Wood Cathouse",
      width: 1,
      height: 1,
      color: "wood",
      category: "house",
      rotatable: true,
      blocksMovement: true,
      access: singleEntranceAccess(1, 1)
    })),
    jobCenter: runtimeItem("jobCenter", {
      id: "jobCenter",
      label: "Job Center",
      width: 2,
      height: 2,
      color: "job-center",
      category: "building",
      rotatable: true,
      blocksMovement: true,
      access: JOB_CENTER_ACCESS,
      asset: "img/Buildings/Camp%20Runtime/job-center/tier-1/revision-7/down.png?v=0.0001",
      assets: Object.freeze({
        down: "img/Buildings/Camp%20Runtime/job-center/tier-1/revision-7/down.png?v=0.0001",
        right: "img/Buildings/Camp%20Runtime/job-center/tier-1/revision-7/right.png?v=0.0001",
        up: "img/Buildings/Camp%20Runtime/job-center/tier-1/revision-7/up.png?v=0.0001",
        left: "img/Buildings/Camp%20Runtime/job-center/tier-1/revision-7/left.png?v=0.0001"
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
    operationsTable: gameplayItem("operationsTable", gameplayRuntimeItem("operationsTable", {
      id: "operationsTable",
      label: "Operations Table",
      width: 2,
      height: 1,
      color: "operations",
      category: "building",
      rotatable: true,
      blocksMovement: true,
      access: OPERATIONS_TABLE_ACCESS
    })),
    laboratory: runtimeItem("laboratory", Object.freeze({
      id: "laboratory",
      label: "Laboratory",
      width: 3,
      height: 1,
      color: "laboratory",
      category: "building",
      rotatable: false,
      blocksMovement: true,
      access: LABORATORY_ACCESS,
      asset: "img/Buildings/Laboratory_Final.png?v=0.0034"
    })),
    storage: gameplayItem("storage", runtimeItem("storage", Object.freeze({
      id: "storage",
      label: "Small Storage Shed",
      width: 1,
      height: 1,
      color: "storage",
      category: "building",
      rotatable: true,
      blocksMovement: true,
      access: STORAGE_ACCESS,
      stickerSlot: STORAGE_STICKER_SLOT
    }))),
    marketStall: gameplayItem("marketStall", gameplayRuntimeItem("marketStall", {
      id: "marketStall",
      label: "Market Stall",
      width: 2,
      height: 2,
      color: "market",
      category: "building",
      rotatable: true,
      blocksMovement: true,
      access: singleEntranceAccess(2, 2)
    })),
    smallFountain: gameplayItem("smallFountain", gameplayRuntimeItem("smallFountain", {
      id: "smallFountain",
      label: "Small Fountain",
      width: 1,
      height: 1,
      color: "fountain",
      category: "decoration",
      rotatable: true,
      blocksMovement: true
    })),
    cardboardLitterbox: gameplayItem("cardboardLitterbox", gameplayRuntimeItem("cardboardLitterbox", {
      id: "cardboardLitterbox",
      label: "Cardboard Litterbox",
      width: 1,
      height: 1,
      color: "cardboard",
      category: "decoration",
      rotatable: true,
      blocksMovement: true
    })),
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
    road: runtimePathType("basicTrail", {
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
  const INITIAL_BUILDABLE_RECT = Object.freeze({...ACTIVE_CAMP_TEMPLATE.initialBuildableRect});
  const TERRITORY_ZONES = Object.freeze(ACTIVE_CAMP_TEMPLATE.zones.reduce(function(zones, zone) {
    zones[zone.id] = Object.freeze({...zone});
    return zones;
  }, {}));
  const INITIAL_ZONE_ID = ACTIVE_CAMP_TEMPLATE.zones.find(function(zone) { return zone.initial; }).id;

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
          occupiedCells: revision.occupiedCells,
          tierFootprints: Object.freeze({
            [String(tierNumber)]: Object.freeze({
              width: revision.width, height: revision.height,
              occupiedCells: revision.occupiedCells
            })
          }),
          color: "dev-visual",
          category: "dev-library",
          rotatable: family.category !== "junk" && Object.keys(sprites).length > 1,
          canonicalOrientation: family.category === "junk" ? "down" : "",
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
    if (runtimeFootprintFixture && baseTypes.cardboardBox) {
      const fixture = baseTypes.cardboardBox;
      visualTypes.cardboardBox = Object.freeze({
        ...fixture,
        occupiedCells: undefined,
        tierAccess: Object.freeze({
          ...(fixture.tierAccess || {}),
          2: Object.freeze({
            activationPolicy: "all-ports-reachable",
            ports: Object.freeze([Object.freeze({
              id: "fixture-notch",
              side: "west",
              cellPolicy: "all-cells-reachable",
              approachCells: Object.freeze([Object.freeze({x: 0, y: 0, side: "west"})]),
              minimumReachableCells: 1
            })])
          })
        }),
        tierFootprints: Object.freeze({
          1: Object.freeze({width: 1, height: 1}),
          2: Object.freeze({
            width: 2, height: 2,
            occupiedCells: Object.freeze([
              Object.freeze({x: 1, y: 0}), Object.freeze({x: 0, y: 1}),
              Object.freeze({x: 1, y: 1})
            ])
          })
        })
      });
    }
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
  const CONNECTION_ORIGIN_CELLS = Object.freeze(ACTIVE_CAMP_TEMPLATE.connectionOriginCells.map(function(cell) {
    return Object.freeze({ x: cell.x, y: cell.y });
  }));
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
      requiredCats: revision.gameplay && Number.isInteger(revision.gameplay.requiredCats)
        ? revision.gameplay.requiredCats
        : (fallback.requiredCats || 1),
      asset: runtimeSpritePath(revision.sprites && revision.sprites.down, revision) || fallback.asset
    });
  }
  const LEGACY_TERRAIN_RUNTIME_IDS = Object.freeze(new Set([
    "junkGreenBush", "junkThornBush", "junkFlowerBush", "junkPebblePile",
    "junkStoneBlockPile", "junkTallGrass"
  ]));
  function liveStudioJunkObstacleTypes() {
    return Object.keys(RUNTIME_MANIFEST.assets || {}).sort().reduce(function(items, runtimeId) {
      const family = RUNTIME_MANIFEST.assets[runtimeId];
      if (!family || family.category !== "junk" || LEGACY_TERRAIN_RUNTIME_IDS.has(runtimeId)) return items;
      const tier = family.tiers && family.tiers["1"];
      const revision = tier && Number.isInteger(tier.liveRevision)
        ? tier.revisions && tier.revisions[String(tier.liveRevision)]
        : null;
      if (!revision || revision.status !== "live" || !revision.sprites || !revision.sprites.down) return items;
      const gameplay = revision.gameplay || {};
      items.push(Object.freeze({
        id: family.assetId || runtimeId,
        label: revision.name || family.name || family.assetId || runtimeId,
        width: revision.width,
        height: revision.height,
        minCatLevel: Number.isInteger(gameplay.minCatLevel) ? gameplay.minCatLevel : 0,
        durationSeconds: Number.isInteger(gameplay.clearDurationSeconds) ? gameplay.clearDurationSeconds : 10 * 60,
        requiredCats: Number.isInteger(gameplay.requiredCats) ? gameplay.requiredCats : 1,
        asset: runtimeSpritePath(revision.sprites.down, revision)
      }));
      return items;
    }, []);
  }
  const LEGACY_OBSTACLE_TYPES = Object.freeze([
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
  const OBSTACLE_TYPES = Object.freeze(LEGACY_OBSTACLE_TYPES.concat(liveStudioJunkObstacleTypes()));
  const HOME_OBSTACLE_BLUEPRINT = Object.freeze(ACTIVE_CAMP_TEMPLATE.terrainPlacements
    .filter(function(placement) { return placement.zoneId === INITIAL_ZONE_ID; })
    .map(function(placement) {
      const result = { id: placement.typeId, x: placement.x, y: placement.y };
      if (placement.reward) result.reward = Object.freeze({...placement.reward});
      return Object.freeze(result);
    }));
  const INITIAL_CLEARED_CELLS = Object.freeze(ACTIVE_CAMP_TEMPLATE.initialClearedCells.slice());
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
    return Object.freeze(ACTIVE_CAMP_TEMPLATE.terrainPlacements.map(function(definition) {
      const type = OBSTACLE_TYPES.find(function(candidate) {
        return candidate.id === definition.typeId;
      });
      if (!type) return null;
      const cells = cellulesRectangle({
        x: definition.x,
        y: definition.y,
        width: type.width,
        height: type.height
      });
      return Object.freeze({
        uid: definition.uid,
        id: type.id,
        label: type.label,
        width: type.width,
        height: type.height,
        minCatLevel: type.minCatLevel,
        durationSeconds: type.durationSeconds,
        requiredCats: type.requiredCats || 1,
        reward: definition.reward ? Object.freeze({...definition.reward}) : null,
        asset: type.asset,
        zoneId: definition.zoneId,
        x: definition.x,
        y: definition.y,
        cells: Object.freeze(cells.map(function(cell) {
          return Object.freeze({ x: cell.x, y: cell.y });
        }))
      });
    }).filter(Boolean));
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
      version: ACTIVE_CAMP_TEMPLATE.terrainVersion,
      claimedZoneIds: ACTIVE_CAMP_TEMPLATE.zones.filter(function(zone) { return zone.initial; }).map(function(zone) { return zone.id; }),
      clearedCells: INITIAL_CLEARED_CELLS.slice()
    };
  }

  function normaliserTerrain(value) {
    const source = value && typeof value === "object" ? value : {};
    const zonesConquises = new Set([INITIAL_ZONE_ID]);
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
      version: ACTIVE_CAMP_TEMPLATE.terrainVersion,
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
      cellulesOccupeesItem(item).forEach(function(cellule) {
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

  function dimensionsType(typeOuId, rotation, tier) {
    const type = typeof typeOuId === "string" ? ITEM_TYPES[typeOuId] : typeOuId;
    if (!type) return null;
    return campConnectivity.dimensionsType(type, rotation, tier);
  }

  function cellulesOccupeesItem(item, requestedTier) {
    if (!item) return [];
    const typeId = LEGACY_TYPE_ALIASES[item.type] || item.type;
    const type = ITEM_TYPES[typeId];
    return campConnectivity.cellulesOccupeesItem(item, type, requestedTier);
  }

  function cellulesReserveesItem(item) {
    if (!item) return [];
    const typeId = LEGACY_TYPE_ALIASES[item.type] || item.type;
    return campConnectivity.cellulesReserveesItem(item, ITEM_TYPES[typeId]);
  }

  function rectangleItem(item) {
    const typeId = item && (LEGACY_TYPE_ALIASES[item.type] || item.type);
    const type = typeId && ITEM_TYPES[typeId];
    if (!type) return null;
    const dimensions = dimensionsType(type, item.rotation, item.tier || 1);
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

  function testerPlacement(layout, typeId, x, y, ignoreUid, rotation, terrain, tier) {
    const type = ITEM_TYPES[typeId];
    const positionX = entier(x);
    const positionY = entier(y);
    if (!type) return { valide: false, raison: "Unknown prototype item." };
    if (!Number.isFinite(positionX) || !Number.isFinite(positionY)) {
      return { valide: false, raison: "Choose a grid position." };
    }

    const dimensions = dimensionsType(type, rotation, tier || 1);
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
      && campConnectivity.cellulesOccupeesItem({x: positionX, y: positionY, rotation: rotation, tier: tier || 1}, type).some(function(cellule) {
        return !estCelluleConstructible(terrain, cellule.x, cellule.y);
      })
    ) {
      return { valide: false, raison: "Clear and claim every cell under this item first." };
    }

    const elements = Array.isArray(layout) ? layout : [];
    for (let index = 0; index < elements.length; index += 1) {
      const autre = elements[index];
      if (!autre || autre.uid === ignoreUid) continue;
      const candidateCells = new Set(campConnectivity.cellulesOccupeesItem(
        {x: positionX, y: positionY, rotation: rotation, tier: tier || 1}, type
      ).map(function(cell) { return cleCellule(cell.x, cell.y); }));
      if (cellulesReserveesItem(autre).some(function(cell) { return candidateCells.has(cleCellule(cell.x, cell.y)); })) {
        const autreType = ITEM_TYPES[autre.type];
        return {
          valide: false,
          raison: "This space is occupied by " + (autreType ? autreType.label : "another item") + "."
        };
      }
    }

    return { valide: true, raison: "" };
  }

  // Deterministic fixture/search seam built on the same placement and access
  // authorities as player placement. It never mutates the supplied layout.
  function trouverPlacementFonctionnel(layout, typeId, tier, terrain, options) {
    const type = ITEM_TYPES[typeId];
    const targetTier = Number(tier);
    const config = options && typeof options === "object" ? options : {};
    if (!type || !Number.isInteger(targetTier) || targetTier < 1) return null;
    const elements = Array.isArray(layout) ? layout : [];
    const uid = typeof config.uid === "string" && config.uid
      ? config.uid : "dev-canonical-" + typeId + "-t" + targetTier;
    if (elements.some(function(item) { return item && item.uid === uid; })) return null;
    const rotations = type.rotatable ? [0, 90, 180, 270] : [0];
    const before = evaluerConnexionsLayout(elements, terrain);
    const activeUids = Object.keys(before.byItem || {}).filter(function(itemUid) {
      return before.byItem[itemUid] && before.byItem[itemUid].active;
    });
    for (let rotationIndex = 0; rotationIndex < rotations.length; rotationIndex += 1) {
      const rotation = rotations[rotationIndex];
      for (let y = 0; y < GRID_HEIGHT; y += 1) {
        for (let x = 0; x < GRID_WIDTH; x += 1) {
          const placement = testerPlacement(
            elements, typeId, x, y, null, rotation, terrain, targetTier
          );
          if (!placement.valide) continue;
          const candidate = {
            uid: uid, type: typeId, x: x, y: y,
            tier: targetTier, construit: true
          };
          if (type.rotatable) candidate.rotation = rotation;
          const evaluation = evaluerConnexionsLayout(elements.concat([candidate]), terrain);
          if (!(evaluation.byItem[uid] && evaluation.byItem[uid].active)) continue;
          if (!activeUids.every(function(itemUid) {
            return evaluation.byItem[itemUid] && evaluation.byItem[itemUid].active;
          })) continue;
          return Object.freeze({
            item: Object.freeze(candidate),
            dimensions: Object.freeze(dimensionsType(type, rotation, targetTier)),
            occupiedCells: Object.freeze(cellulesOccupeesItem(candidate).map(function(cell) {
              return Object.freeze({x: cell.x, y: cell.y});
            })),
            access: campConnectivity.resoudreAccesType(type, targetTier)
          });
        }
      }
    }
    return null;
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
      const tier = Number.isInteger(item.tier) && item.tier > 0 ? item.tier : 1;
      if (!testerPlacement(layout, typeId, x, y, null, rotation, terrain, tier).valide) return;
      const normalise = {
        uid: uid,
        type: typeId,
        x: x,
        y: y,
        tier: tier
      };
      if (type.rotatable) normalise.rotation = rotation;
      if (type.category === "house" || type.category === "building") {
        // Building saves predate the explicit `construit` flag. Preserve an
        // in-progress false value, while treating older completed layouts as
        // built so reload reconciliation does not regress them.
        normalise.construit = type.category === "building"
          ? item.construit !== false
          : item.construit === true;
        if (Number.isInteger(item.lawRank) && item.lawRank > 0) normalise.lawRank = item.lawRank;
        if (item.paidCosts && typeof item.paidCosts === "object" && !Array.isArray(item.paidCosts)) {
          normalise.paidCosts = Object.keys(item.paidCosts).reduce(function(costs, resourceId) {
            const valeur = Number(item.paidCosts[resourceId]);
            if (Number.isFinite(valeur) && valeur >= 0) costs[resourceId] = valeur;
            return costs;
          }, {});
        }
      }
      const sticker = item.sticker ? normaliserStickerSelection(item.sticker, type) : null;
      if (sticker) normalise.sticker = sticker;
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
    const access = campConnectivity.resoudreAccesType(type, item && item.tier || 1);
    if (!type || !access || !Array.isArray(access.ports)) return [];
    const routesParCellule = routesIndexees instanceof Map
      ? routesIndexees
      : new Map();
    if (!(routesIndexees instanceof Map)) {
      (Array.isArray(layout) ? layout : []).forEach(function(entree) {
        const routeType = entree && ITEM_TYPES[entree.type];
        if (!routeType || routeType.category !== "road") return;
        campConnectivity.cellulesOccupeesItem(entree, routeType).forEach(function(cell) {
          routesParCellule.set(cleCellule(cell.x, cell.y), routeType);
        });
      });
    }
    const portsCalcules = campConnectivity.portsItem(item, type);
    const rectangle = rectangleItem(item);
    if (!rectangle) return [];
    const cellulesCandidates = [];
    portsCalcules.forEach(function(portCalcule) {
      portCalcule.cells.forEach(function(cellule) {
        const routeType = routesParCellule.get(cleCellule(cellule.x, cellule.y));
        const visuel = routeType && routeType.buildingJoin;
        if (!routeType || !visuel) return;
        const direction = cellule.side || directionAccesItem(cellule, item);
        const axeVertical = direction === "north" || direction === "south";
        const ancrageAutomatique = axeVertical
          ? (cellule.x - rectangle.x + 0.5) / rectangle.width
          : (cellule.y - rectangle.y + 0.5) / rectangle.height;
        cellulesCandidates.push({
          portId: portCalcule.id,
          cell: { x: cellule.x, y: cellule.y },
          direction: direction,
          material: routeType.roadMaterial || routeType.id,
          sprite: routeType.asset || "",
          visual: visuel,
          sourceCellCount: portCalcule.cells.length,
          automaticAnchor: ancrageAutomatique
      });
      });
    });
    const candidatesUniques = new Map();
    cellulesCandidates.forEach(function(candidate) {
      const key = [
        candidate.direction, candidate.material,
        candidate.cell.x, candidate.cell.y
      ].join(":");
      const existant = candidatesUniques.get(key);
      if (!existant) {
        candidatesUniques.set(key, candidate);
        return;
      }
      existant.sourceCellCount = Math.max(
        existant.sourceCellCount,
        candidate.sourceCellCount
      );
    });
    const groupesParVisuel = new Map();
    candidatesUniques.forEach(function(candidate) {
      const key = JSON.stringify([
        candidate.direction, candidate.material, candidate.sprite
      ]);
      if (!groupesParVisuel.has(key)) groupesParVisuel.set(key, []);
      groupesParVisuel.get(key).push(candidate);
    });
    const groupesContigus = [];
    groupesParVisuel.forEach(function(candidates) {
      const axeVertical = candidates[0].direction === "north"
        || candidates[0].direction === "south";
      candidates.sort(function(a, b) {
        return axeVertical
          ? a.cell.x - b.cell.x || a.cell.y - b.cell.y
          : a.cell.y - b.cell.y || a.cell.x - b.cell.x;
      });
      let groupe = [];
      candidates.forEach(function(candidate) {
        const precedente = groupe[groupe.length - 1];
        const adjacent = precedente && (axeVertical
          ? candidate.cell.y === precedente.cell.y
            && candidate.cell.x === precedente.cell.x + 1
          : candidate.cell.x === precedente.cell.x
            && candidate.cell.y === precedente.cell.y + 1);
        if (precedente && !adjacent) {
          groupesContigus.push(groupe);
          groupe = [];
        }
        groupe.push(candidate);
      });
      if (groupe.length) groupesContigus.push(groupe);
    });
    const raccords = [];
    groupesContigus.forEach(function(cellulesRaccordees) {
      const premier = cellulesRaccordees[0];
      const visuel = premier.visual;
      if (cellulesRaccordees.length > 1 && visuel.merged) {
        const axeVertical = premier.direction === "north"
          || premier.direction === "south";
        const largeurCellules = Math.min(
          Number(visuel.maxWidth),
          cellulesRaccordees.length - 2 * Number(visuel.merged.outerInset)
        );
        const largeurInterieureCellules = Math.min(
          largeurCellules,
          Number(visuel.merged.innerWidth)
        );
        const longueurCellules = Number(visuel.merged.length);
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
          portId: premier.portId,
          cell: premier.cell,
          cells: cellulesRaccordees.map(function(raccord) { return raccord.cell; }),
          direction: premier.direction,
          material: premier.material,
          sprite: premier.sprite,
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
        const visuelCellule = raccordCellule.visual;
        const direction = raccordCellule.direction;
        const axeVertical = direction === "north" || direction === "south";
        const largeurCellules = Number(visuelCellule.width);
        const longueurCellules = raccordCellule.sourceCellCount > 1
          ? Number(visuelCellule.multiCellLength)
          : Number(visuelCellule.length);
        const tailleAxeTransversal = axeVertical
          ? rectangle.width
          : rectangle.height;
        const tailleAxeLongitudinal = axeVertical
          ? rectangle.height
          : rectangle.width;
        const referenceTextureCellules = Number(visuelCellule.textureScaleCells);
        raccords.push({
          portId: raccordCellule.portId,
          cell: raccordCellule.cell,
          direction: direction,
          material: raccordCellule.material,
          sprite: raccordCellule.sprite,
          anchor: Math.max(0, Math.min(1, raccordCellule.automaticAnchor)),
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
      campConnectivity.cellulesOccupeesItem(item, routeType).forEach(function(cell) {
        routesParCellule.set(cleCellule(cell.x, cell.y), routeType);
      });
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
    ACTIVE_TEMPLATE_ID: CAMP_TEMPLATE_MANIFEST.activeTemplateId,
    GRID_WIDTH: GRID_WIDTH,
    GRID_HEIGHT: GRID_HEIGHT,
    HOUSE_DECOR_HEIGHT: HOUSE_DECOR_HEIGHT,
    TERRAIN_CELL_COUNT: TERRAIN_CELL_COUNT,
    ITEM_TYPES: ITEM_TYPES,
    FENCE_TYPES: FENCE_TYPES,
    STICKER_CATALOG: STICKER_CATALOG,
    normaliserStickerSlot: normaliserStickerSlot,
    normaliserStickerSelection: normaliserStickerSelection,
    resoudreAncrageSticker: resoudreAncrageSticker,
    stickerVisualForSelection: stickerVisualForSelection,
    stickerChoicesForType: stickerChoicesForType,
    stickerFocusControlKey: stickerFocusControlKey,
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
    resoudreAccesType: campConnectivity.resoudreAccesType,
    cellulesOccupeesItem: cellulesOccupeesItem,
    cellulesReserveesItem: cellulesReserveesItem,
    rectangleItem: rectangleItem,
    rectanglesSeChevauchent: rectanglesSeChevauchent,
    testerPlacement: testerPlacement,
    trouverPlacementFonctionnel: trouverPlacementFonctionnel,
    normaliserLayout: normaliserLayout,
    evaluerConnexionsLayout: evaluerConnexionsLayout,
    accesExterieurDisponible: accesExterieurDisponible,
    raccordsRouteItem: raccordsRouteItem,
    connexionsRoute: connexionsRoute,
    cellulesLigne: cellulesLigne
  });
})(typeof window !== "undefined" ? window : globalThis);
