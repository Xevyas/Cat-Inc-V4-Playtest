(function(root) {
  "use strict";

  const CatInc = root.CatInc = root.CatInc || {};
  CatInc.data = CatInc.data || {};

// BEGIN GENERATED AUDIO CREDITS — Documentation/audio-credits.json
CatInc.data.audioCredits = Object.freeze([
  {
    "creator": "LulleMusic",
    "pack": "Lo-Fi Music Pack",
    "sourceUrl": "https://lullemusic.itch.io/lo-fi-music-pack",
    "attributionStatus": "optional",
    "attributionText": "Music by LulleMusic — Lo-Fi Music Pack",
    "licenseSummary": "Royalty-free use in commercial and non-commercial projects is permitted.",
    "restriction": "The original tracks may not be redistributed or resold as standalone files.",
    "tracks": [
      "Sunbeams And Meadows",
      "Cattails",
      "Evening Drive",
      "Grooving On",
      "Neon Alley",
      "Snowdrifts"
    ]
  },
  {
    "creator": "EpsilonGamesOfficial",
    "pack": "Game Background Music Pack",
    "sourceUrl": "https://epsilongamesofficial.itch.io/game-background-music-pack",
    "attributionStatus": "not-stated",
    "attributionText": "Music by EpsilonGamesOfficial — Game Background Music Pack",
    "licenseSummary": "Use in commercial and non-commercial games, including modification, is permitted by the source page.",
    "restriction": "",
    "tracks": [
      "Chill Vibe #3",
      "Chill Vibe #4"
    ]
  },
  {
    "creator": "VOiD1 Gaming",
    "pack": "Lo-Fi Music Pack",
    "sourceUrl": "https://void1gaming.itch.io/",
    "attributionStatus": "optional",
    "attributionText": "Music by VOiD1 Gaming — Lo-Fi Music Pack",
    "licenseSummary": "Licensed for use and adaptation in games, including commercial and monetized games.",
    "restriction": "Cat Inc may distribute these tracks as part of the game, but not as reusable standalone audio assets.",
    "tracks": [
      "Moonlight Lullaby",
      "The Call of the Night",
      "Uncertainty",
      "Silence of Baba Yaga",
      "Flash form the Past",
      "Winning with a Sacrifice",
      "Crest",
      "Coherent"
    ]
  }
]);
// END GENERATED AUDIO CREDITS

const LIVRE_ICONE = '<img class="livre-icone" src="img/resources/Books_Final.png?v=0.0026" alt="Book">';

// Acquisition/use context stays with its owning runtime systems. Resource
// identity, presentation, Tier and feeding values come from Gameplay Studio.
const LEGACY_RESOURCE_CONTEXT = {
  "inv-res-cardboard": {produce: "Gathered by a Cat assigned to a Cardboard Planks recipe.", usage: "Used inside that recipe slot (10 pieces per plank). It is never stored globally."},
  "inv-res-cardboard-plank": {produce: "Assign a Cat to a Cardboard Planks recipe in Work. The slot gathers 10 Cardboard Pieces first.", usage: "Used to construct buildings like Houses."},
  "inv-res-basic-wood": {produce: "Gathered by a Cat assigned to a Basic Wood Planks recipe.", usage: "Used inside that recipe slot (10 logs per plank). It is never stored globally."},
  "inv-res-wood-plank": {produce: "Assign a Cat to a Basic Wood Planks recipe in Work. The slot gathers 10 Basic Wood first.", usage: "Used to construct buildings like Houses."},
  "inv-res-catnip": {produce: "Gathered by a Cat assigned to a Catnip Salad recipe.", usage: "Used as the input for that recipe (10 Catnip per salad). It is never stored globally."},
  "inv-res-salads": {produce: "Assign a Cat to a Catnip Salad recipe in Work. The slot gathers 10 Catnip first.", usage: "Feed to a Cat in the Gang tab."},
  "inv-res-anchovy": {produce: "Gathered by a Cat assigned to a Grilled Anchovy recipe.", usage: "Used as the input for that recipe (10 Anchovies per serving). It is never stored globally."},
  "inv-res-grilled-anchovy": {produce: "Assign a Cat to a Grilled Anchovy recipe in Work. The slot gathers 10 Anchovies first.", usage: "Feed to a Cat in the Gang tab."},
  "inv-res-pebbles": {produce: "Gathered by a Cat assigned to a Pebble Bricks recipe.", usage: "Used inside that recipe slot (10 pebbles per brick). It is never stored globally."},
  "inv-res-pebble-brick": {produce: "Assign a Cat to a Pebble Bricks recipe in Work. The slot gathers 10 Pebbles first.", usage: "Used to construct buildings like Facilities."},
  "inv-res-rocks": {produce: "Gathered by a Cat assigned to a Rock Bricks recipe.", usage: "Used inside that recipe slot (10 rocks per brick). It is never stored globally."},
  "inv-res-rock-brick": {produce: "Assign a Cat to a Rock Bricks recipe in Work. The slot gathers 10 Rocks first.", usage: "Used in advanced construction."},
  "inv-res-human-leftovers": {produce: "Found by sending cats on Exploration campaigns.", usage: "Feed to a Cat in the Gang tab."},
  "inv-res-human-workers-food": {produce: "Found by scouting the basement in A1 (unlocks after both A1 campaigns).", usage: "Feed to a Cat in the Gang tab."},
  "inv-res-canned-cat-food": {produce: "Complete or scout the Supermarket in the Exploration tab.", usage: "Used in the Training Center to improve job levels."}
};

const RESOURCE_INVENTORY_IDS = {
  cardboardPieces: "inv-res-cardboard", cardboardPlanks: "inv-res-cardboard-plank",
  basicWood: "inv-res-basic-wood", basicWoodPlanks: "inv-res-wood-plank",
  catnip: "inv-res-catnip", salads: "inv-res-salads", anchovy: "inv-res-anchovy",
  grilledAnchovy: "inv-res-grilled-anchovy", pebbles: "inv-res-pebbles",
  pebbleBricks: "inv-res-pebble-brick", rocks: "inv-res-rocks", rockBricks: "inv-res-rock-brick",
  humanLeftovers: "inv-res-human-leftovers", humanWorkersFood: "inv-res-human-workers-food",
  cannedCatFood: "inv-res-canned-cat-food"
};
const RESOURCE_INFO = Object.freeze((CatInc.resources?.definitions() || []).reduce(function(result, resource) {
  const inventoryId = RESOURCE_INVENTORY_IDS[resource.id]
    || "inv-res-" + resource.id.replace(/([A-Z])/g, "-$1").toLowerCase();
  const context = LEGACY_RESOURCE_CONTEXT[inventoryId] || {};
  result[inventoryId] = {
    resourceId: resource.id,
    nom: resource.name,
    tier: resource.tier ? "Tier " + resource.tier + " · " + resource.family + " family" : null,
    desc: resource.description,
    produce: context.produce || "Obtained through gameplay content.",
    usage: resource.feedable ? "Feed to a Cat in the Gang tab for +" + resource.feedXp + " XP."
      : context.usage || "Stored in your Inventory."
  };
  return result;
}, {}));

const BOOK_LEARNING_CONTENT = CatInc.data.campGameplay?.bookLearning || {};
const PURCHASABLE_CONTENT = CatInc.data.campGameplay?.purchasableContent || {};
function studioBookContent(itemId) {
  const authored = BOOK_LEARNING_CONTENT[itemId];
  return authored
    ? {description: authored.description, learningGame: authored.learningGame}
    : {description: "", learningGame: null};
}

const ITEMS = {
  smallFountainBlueprint: {
    id:           "smallFountainBlueprint",
    category:     "blueprint",
    nom:          PURCHASABLE_CONTENT.smallFountainBlueprint?.name || "",
    emoji:        LIVRE_ICONE,
    description:  PURCHASABLE_CONTENT.smallFountainBlueprint?.description || "",
    unlocksLabel: "Small Fountain in Camp Decorations",
    studyDuration: 3600000,
    learningMode: "timer-only",
    actions: [
      { id: "study", label: "Study (1h)" }
    ]
  },
  cardboardLitterboxBlueprint: {
    id:           "cardboardLitterboxBlueprint",
    category:     "blueprint",
    nom:          PURCHASABLE_CONTENT.cardboardLitterboxBlueprint?.name || "",
    emoji:        LIVRE_ICONE,
    description:  PURCHASABLE_CONTENT.cardboardLitterboxBlueprint?.description || "",
    unlocksLabel: "Cardboard Litterbox in Camp Decorations",
    studyDuration: 3600000,
    learningMode: "timer-only",
    actions: [
      { id: "study", label: "Study (1h)" }
    ]
  },
  compass: {
    id:           "compass",
    type:         "unique",
    nom:          "Compass",
    emoji:        '<img class="inv-item-sprite" src="img/resources/Compass_Final.png?v=0.0040" alt="Compass">',
    description:  "A battered compass recovered from the Gas Station. Its needle points beyond the neighbourhood, toward somewhere none of us have explored yet.",
    produce:      "Found in the Gas Station after sneaking through the back entrance.",
    usage:        "Useful for navigating through the woods and finding the way to the wider world.",
    actions:      []
  },
  schoolGuide: {
    id:           "schoolGuide",
    nom:          "School Guide",
    emoji:        LIVRE_ICONE,
    ...studioBookContent("schoolGuide"),
    unlocksLabel: "Explorator, Lumberjack, Carpenter, Farmer and Chef jobs",
    studyDuration: 60000,
    actions: [
      { id: "study", label: "Study" }
    ]
  },
  fishingGuide: {
    id:           "fishingGuide",
    nom:          "Fishing Guide for Dummies",
    emoji:        LIVRE_ICONE,
    ...studioBookContent("fishingGuide"),
    unlocksLabel: "Anchovy fishing and Grilled Anchovy",
    studyDuration: 3600000,
    actions: [
      { id: "study", label: "Study (1h)" }
    ]
  },
  constructionPlan: {
    id:           "constructionPlan",
    nom:          "Construction Plan",
    emoji:        LIVRE_ICONE,
    ...studioBookContent("constructionPlan"),
    unlocksLabel: "Wood Builder job",
    studyDuration: 3600000,
    actions: [
      { id: "study", label: "Study (1h)" }
    ]
  },
  seminarGuide: {
    id:           "seminarGuide",
    nom:          "Corporate Seminar Booklet",
    emoji:        LIVRE_ICONE,
    ...studioBookContent("seminarGuide"),
    unlocksLabel: "Training Center",
    studyDuration: 7200000,
    actions: [
      { id: "study", label: "Study (2h)" }
    ]
  },
  dailyPurpose: {
    id:           "dailyPurpose",
    nom:          "The Daily Purpose",
    emoji:        LIVRE_ICONE,
    ...studioBookContent("dailyPurpose"),
    unlocksLabel: "Daily Quests",
    studyDuration: 3600000,
    actions: [
      { id: "study", label: "Study (1h)" }
    ]
  },
  engineerGuide: {
    id:           "engineerGuide",
    nom:          "The Engineer's Path",
    emoji:        LIVRE_ICONE,
    ...studioBookContent("engineerGuide"),
    unlocksLabel: "Laboratory",
    studyDuration: 3600000,
    actions: [
      { id: "study", label: "Study (1h)" }
    ]
  },
  teamworkGuide: {
    id:           "teamworkGuide",
    nom:          "The Teamwork Advantage",
    emoji:        LIVRE_ICONE,
    ...studioBookContent("teamworkGuide"),
    unlocksLabel: "Engineer rank upgrades",
    studyDuration: 3600000,
    actions: [
      { id: "study", label: "Study (1h)" }
    ]
  },
  sturdyHousePlans: {
    id:           "sturdyHousePlans",
    nom:          "Sturdy House Plans",
    emoji:        LIVRE_ICONE,
    ...studioBookContent("sturdyHousePlans"),
    unlocksLabel: "Stone Storage Shed",
    studyDuration: 3600000,
    actions: [
      { id: "study", label: "Study (1h)" }
    ]
  },
  stoneGuide: {
    id:           "stoneGuide",
    nom:          "Stone Craft Guide",
    emoji:        LIVRE_ICONE,
    ...studioBookContent("stoneGuide"),
    unlocksLabel: "Miner and Stonemason jobs",
    studyDuration: 3600000,
    actions: [
      { id: "study", label: "Study (1h)" }
    ]
  }
};

const INTERFACE_ICON_PATHS = Object.freeze({
  builder: "img/interface/builder.png",
  "camp-engineer": "img/interface/camp-engineer.png",
  carpenter: "img/interface/carpenter.png",
  "cat-paw": "img/interface/cat-paw.png",
  chef: "img/interface/chef.png",
  difficulty: "img/interface/difficulty.png",
  explorator: "img/interface/explorator.png",
  farmer: "img/interface/farmer.png",
  "gang-leader": "img/interface/gang-leader.png",
  heart: "img/interface/heart.png",
  hourglass: "img/interface/hourglass.png",
  lock: "img/interface/lock.png",
  lumberjack: "img/interface/lumberjack.png",
  "magnifying-glass": "img/interface/magnifying-glass.png",
  miner: "img/interface/miner.png",
  pause: "img/interface/pause.png",
  play: "img/interface/play.png",
  power: "img/interface/power.png",
  "shop-owner": "img/interface/shop-owner.png",
  "sleep-bubble": "img/interface/sleep-bubble.png",
  stonemason: "img/interface/stonemason.png"
});

function interfaceIconHtml(iconId, className, alt) {
  const path = INTERFACE_ICON_PATHS[iconId];
  if (!path) return "";
  const classes = "interface-icon" + (className ? " " + className : "");
  return '<img class="' + classes + '" src="' + path + '" alt="' + (alt || "") + '">';
}

const METIERS = {
  lumberjack:    { id: "lumberjack",   nom: "Lumberjack",  emoji: interfaceIconHtml("lumberjack", "job-icon"), famille: "wood",    familleNom: "Wood resource family",    duree: 3600 },
  carpenter:     { id: "carpenter",   nom: "Carpenter",    emoji: interfaceIconHtml("carpenter", "job-icon"), famille: "sawmill", familleNom: "Sawmill resource family", duree: 3600 },
  farmer:        { id: "farmer",      nom: "Farmer",       emoji: interfaceIconHtml("farmer", "job-icon"), famille: "food",    familleNom: "Food resource family",    duree: 3600 },
  chef:          { id: "chef",        nom: "Chef",         emoji: interfaceIconHtml("chef", "job-icon"), famille: "catchen",    familleNom: "Catchen resource family",    duree: 3600 },
  explorator:    { id: "explorator",  nom: "Explorator",   emoji: interfaceIconHtml("explorator", "job-icon"), famille: "exploration", familleNom: "Exploration family",         duree: 3600 },
  builder:       { id: "builder",     nom: "Builder",      emoji: interfaceIconHtml("builder", "job-icon"), famille: null,         familleNom: "Camp construction",          duree: 3600, unlockItem: "constructionPlan" },
  miner:         { id: "miner",       nom: "Miner",        emoji: interfaceIconHtml("miner", "job-icon"), famille: "rock",        familleNom: "Rock resource family",       duree: 3600, unlockItem: "stoneGuide" },
  stonemason:    { id: "stonemason",  nom: "Stonemason",   emoji: interfaceIconHtml("stonemason", "job-icon"), famille: "pawsonry",    familleNom: "Pawsonry resource family",   duree: 3600, unlockItem: "stoneGuide" },
  "gang-leader": { id: "gang-leader", nom: "Gang Leader",  emoji: interfaceIconHtml("gang-leader", "job-icon"), famille: null,          familleNom: "Work speed",                 duree: 0 },
  "camp-engineer": { id: "camp-engineer", nom: "Camp Engineer", emoji: interfaceIconHtml("camp-engineer", "job-icon"), famille: "engineering", familleNom: "Passive camp systems", duree: 3600, engineer: true }
};

const explorationData = CatInc.data.exploration;
const ZONES_CARTE = explorationData.regions.startingNeighbourhood.zones;
const REGIONS = explorationData.regions;

function explorationCellKey(cell) {
  return cell.x + "," + cell.y;
}

function explorationZoneCells(zone) {
  return zone && Array.isArray(zone.occupiedCells)
    ? zone.occupiedCells.map(function(cell) { return { x: cell.x, y: cell.y }; })
    : [];
}

function explorationRegionById(regions, regionId) {
  return regions && Object.prototype.hasOwnProperty.call(regions, regionId) ? regions[regionId] : null;
}

function explorationZoneById(regions, zoneId, regionId) {
  if (regionId) {
    const region = explorationRegionById(regions, regionId);
    return region && region.zones && Object.prototype.hasOwnProperty.call(region.zones, zoneId)
      ? region.zones[zoneId] : null;
  }
  for (const region of Object.values(regions || {})) {
    if (region.zones && Object.prototype.hasOwnProperty.call(region.zones, zoneId)) return region.zones[zoneId];
  }
  return null;
}

function explorationZoneCellIndex(region) {
  const index = Object.create(null);
  Object.values(region && region.zones || {}).forEach(function(zone) {
    explorationZoneCells(zone).forEach(function(cell) { index[explorationCellKey(cell)] = zone.id; });
  });
  return index;
}

function explorationZonesAdjacent(first, second) {
  const secondCells = new Set(explorationZoneCells(second).map(explorationCellKey));
  return explorationZoneCells(first).some(function(cell) {
    return secondCells.has((cell.x - 1) + "," + cell.y)
      || secondCells.has((cell.x + 1) + "," + cell.y)
      || secondCells.has(cell.x + "," + (cell.y - 1))
      || secondCells.has(cell.x + "," + (cell.y + 1));
  });
}

// Returns the visual center of a zone in grid-boundary coordinates. Concave
// shapes whose bounding-box center is outside their owned cells use the
// nearest owned cell center, with coordinate tie-breakers for stable output.
function explorationZoneMarkerAnchor(zone) {
  const cells = explorationZoneCells(zone);
  if (!cells.length) return null;
  const minX = Math.min.apply(null, cells.map(function(cell) { return cell.x; }));
  const maxX = Math.max.apply(null, cells.map(function(cell) { return cell.x; }));
  const minY = Math.min.apply(null, cells.map(function(cell) { return cell.y; }));
  const maxY = Math.max.apply(null, cells.map(function(cell) { return cell.y; }));
  const center = { x: (minX + maxX + 1) / 2, y: (minY + maxY - 1) / 2 };
  const centerIsOwned = cells.some(function(cell) {
    return center.x >= cell.x && center.x <= cell.x + 1
      && center.y >= cell.y - 1 && center.y <= cell.y;
  });
  if (centerIsOwned) return { x: center.x, y: center.y, snapped: false };
  const nearest = cells.map(function(cell) {
    const x = cell.x + 0.5, y = cell.y - 0.5;
    return { x: x, y: y, distance: Math.pow(x - center.x, 2) + Math.pow(y - center.y, 2) };
  }).sort(function(first, second) {
    return first.distance - second.distance || second.y - first.y || first.x - second.x;
  })[0];
  return { x: nearest.x, y: nearest.y, snapped: true };
}

function validateExplorationRegion(region) {
  if (!region || !Number.isInteger(region.columns) || region.columns < 1
      || !Number.isInteger(region.rows) || region.rows < 1 || !region.zones) {
    return { ok: false, reason: "Region dimensions and zones are required." };
  }
  const occupied = new Set();
  for (const zone of Object.values(region.zones)) {
    const cells = explorationZoneCells(zone);
    if (!cells.length) return { ok: false, reason: "Every zone needs occupied cells." };
    const own = new Set();
    for (const cell of cells) {
      if (!Number.isInteger(cell.x) || !Number.isInteger(cell.y)
          || cell.x < 0 || cell.x >= region.columns || cell.y < 1 || cell.y > region.rows) {
        return { ok: false, reason: "Zone cells must be integer coordinates inside the region." };
      }
      const key = explorationCellKey(cell);
      if (own.has(key) || occupied.has(key)) return { ok: false, reason: "Zone cells must be unique." };
      own.add(key);
      occupied.add(key);
    }
    const first = cells[0];
    const visited = new Set([explorationCellKey(first)]);
    const pending = [first];
    while (pending.length) {
      const cell = pending.pop();
      [[-1, 0], [1, 0], [0, -1], [0, 1]].forEach(function(offset) {
        const key = (cell.x + offset[0]) + "," + (cell.y + offset[1]);
        if (own.has(key) && !visited.has(key)) {
          visited.add(key);
          const parts = key.split(",");
          pending.push({ x: Number(parts[0]), y: Number(parts[1]) });
        }
      });
    }
    if (visited.size !== own.size) return { ok: false, reason: "Zone cells must be orthogonally connected." };
  }
  return { ok: true };
}

const explorationGeometry = Object.freeze({
  cellKey: explorationCellKey,
  zoneCells: explorationZoneCells,
  regionById: explorationRegionById,
  zoneById: explorationZoneById,
  zoneCellIndex: explorationZoneCellIndex,
  zonesAdjacent: explorationZonesAdjacent,
  zoneMarkerAnchor: explorationZoneMarkerAnchor,
  validateRegion: validateExplorationRegion
});
const TIERS_KITTIES = [
  "Kitten", "Great Kitten", "Cat", "Great Cat",
  "General Cat", "Emperor Cat", "Godly Cat"
];

const NOMS_KITTIES = [
  "Bernardo", "Mochi", "Luna", "Whiskers", "Felix",
  "Cleopatra", "Biscuit", "Cosmo", "Zelda", "Napoleon", "Cannelle",
  "Duchess", "Rascal", "Aurora", "Chester", "Naya", "Pumpkin",
  "Oliver", "Mittens", "Shadow", "Simba", "Nala",
  "Tiger", "Max", "Lily", "Charlie", "Bella",
  "Jasper", "Ruby", "Oscar", "Daisy", "Leo",
  "Misty", "Ginger", "Oreo", "Salem", "Pixel",
  "Storm", "Amber", "Pepper", "Socks", "Fluffy",
  "Mocha", "Hazel", "Maple", "Fudge", "Cookie",
  "Olive", "Peaches", "Honey", "Caramel", "Clover",
  "Sage", "Willow", "Ivy", "Basil", "Rusty",
  "Smoky", "Patches", "Boots", "Whiskey", "Marmalade",
  "Pickles", "Waffles", "Muffin", "Snickers", "Cinnamon",
  "Vanilla", "Cocoa", "Espresso", "Latte", "Chai",
  "Nugget", "Peanut", "Walnut", "Acorn", "Chestnut",
  "Sprout", "Turnip", "Parsley", "Thyme", "Rosemary",
  "Juniper", "Birch", "Cedar", "Finch", "Robin",
  "Sparrow", "Wren", "Cricket", "Ripple", "Flint",
  "Copper", "Bronze", "Silver", "Goldie", "Indigo",
  "Violet", "Dune", "Cobble", "Toffee", "Pretzel"
];

const KITTY_ICON = '<img src="img/interface/Gang_Final.png?v=0.0026" class="kitty-icon" alt="cat">';
const CHECK_ICON = '<img src="img/interface/✅_Final.png?v=0.0026" class="check-icon" alt="done">';

// ── Per-kitty face icons ────────────────────────────────────
const LIVE_BERNARDO_FACE = CatInc.data.liveCatFaces && Array.isArray(CatInc.data.liveCatFaces.items)
  ? CatInc.data.liveCatFaces.items.find(function(item) { return item.id === "cat-faces-bernardo"; })
  : null;
const LIVE_MOCHI_FACE = CatInc.data.liveCatFaces && Array.isArray(CatInc.data.liveCatFaces.items)
  ? CatInc.data.liveCatFaces.items.find(function(item) { return item.id === "cat-faces-mochi-v2"; })
  : null;
const LIVE_LUNA_FACE = CatInc.data.liveCatFaces && Array.isArray(CatInc.data.liveCatFaces.items)
  ? CatInc.data.liveCatFaces.items.find(function(item) { return item.id === "cat-faces-luna-v2"; })
  : null;
const CAT_FACES = {
  bernardo: LIVE_BERNARDO_FACE
    ? LIVE_BERNARDO_FACE.runtimePath + "?v=live-r" + LIVE_BERNARDO_FACE.revision
    : "",
  mochi: LIVE_MOCHI_FACE
    ? LIVE_MOCHI_FACE.runtimePath + "?v=live-r" + LIVE_MOCHI_FACE.revision
    : "",
  luna: LIVE_LUNA_FACE
    ? LIVE_LUNA_FACE.runtimePath + "?v=live-r" + LIVE_LUNA_FACE.revision
    : ""
};
const LIVE_CANNELLE_FACE = CatInc.data.liveCatFaces && Array.isArray(CatInc.data.liveCatFaces.items)
  ? CatInc.data.liveCatFaces.items.find(function(item) { return item.id === "cat-faces-cannelle-3"; })
  : null;
CAT_FACES.cannelle = LIVE_CANNELLE_FACE
  ? LIVE_CANNELLE_FACE.runtimePath + "?v=live-r" + LIVE_CANNELLE_FACE.revision
  : "";
const LIVE_NAYA_FACE = CatInc.data.liveCatFaces && Array.isArray(CatInc.data.liveCatFaces.items)
  ? CatInc.data.liveCatFaces.items.find(function(item) { return item.id === "cat-faces-naya"; })
  : null;
CAT_FACES.naya = LIVE_NAYA_FACE
  ? LIVE_NAYA_FACE.runtimePath + "?v=live-r" + LIVE_NAYA_FACE.revision
  : "";
const LIVE_RANDOM_CAT_FACES = CatInc.data.liveCatFaces && Array.isArray(CatInc.data.liveCatFaces.randomCats)
  ? CatInc.data.liveCatFaces.randomCats.map(function(item) {
      return item.runtimePath + "?v=live-r" + item.revision;
    })
  : [];
const CAT_FACES_ALEATOIRES = Object.freeze(LIVE_RANDOM_CAT_FACES);

  CatInc.data.content = Object.freeze({
    LIVRE_ICONE: LIVRE_ICONE,
    RESOURCE_INFO: RESOURCE_INFO,
    ITEMS: ITEMS,
    METIERS: METIERS,
    ZONES_CARTE: ZONES_CARTE,
    REGIONS: REGIONS,
    explorationGeometry: explorationGeometry,
    TIERS_KITTIES: TIERS_KITTIES,
    NOMS_KITTIES: NOMS_KITTIES,
    KITTY_ICON: KITTY_ICON,
    CHECK_ICON: CHECK_ICON,
    INTERFACE_ICON_PATHS: INTERFACE_ICON_PATHS,
    interfaceIconHtml: interfaceIconHtml,
    CAT_FACES: CAT_FACES,
    CAT_FACES_ALEATOIRES: CAT_FACES_ALEATOIRES
  });
})(typeof window !== "undefined" ? window : globalThis);
