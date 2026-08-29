(function(root) {
  "use strict";

  const CatInc = root.CatInc = root.CatInc || {};
  CatInc.data = CatInc.data || {};

const LIVRE_ICONE = '<img class="livre-icone" src="img/resources/Books_Final.png?v=0.0026" alt="Book">';

// ── Resource info popups (Inventory tab) ─────────────────────
// Keep this in sync whenever a resource is added or changed.
const RESOURCE_INFO = {
  "inv-res-cardboard": {
    nom:     "Cardboard Pieces",
    tier:    "Tier 1 · Wood family",
    desc:    "Small patches of cardboard found lying on the ground. Might be useful.",
    produce: "Gathered by a Cat assigned to a Cardboard Planks recipe.",
    usage:   "Used inside that recipe slot (10 pieces per plank). It is never stored globally."
  },
  "inv-res-cardboard-plank": {
    resourceId: "cardboardPlanks",
    nom:     "Cardboard Planks",
    tier:    "Tier 1 · Wood family (processed)",
    desc:    "Sturdy planks pressed from cardboard. The backbone of early construction.",
    produce: "Assign a Cat to a Cardboard Planks recipe in Work. The slot gathers 10 Cardboard Pieces first.",
    usage:   "Used to construct buildings like Houses."
  },
  "inv-res-basic-wood": {
    nom:     "Basic Wood",
    tier:    "Tier 2 · Wood family",
    desc:    "Rough wooden planks salvaged from human furniture. Heavier to carry, but sturdier.",
    produce: "Gathered by a Cat assigned to a Basic Wood Planks recipe.",
    usage:   "Used inside that recipe slot (10 logs per plank). It is never stored globally."
  },
  "inv-res-wood-plank": {
    resourceId: "basicWoodPlanks",
    nom:     "Basic Wood Planks",
    tier:    "Tier 2 · Wood family (processed)",
    desc:    "Refined wooden planks, sanded and shaped. A real upgrade from cardboard.",
    produce: "Assign a Cat to a Basic Wood Planks recipe in Work. The slot gathers 10 Basic Wood first.",
    usage:   "Used to construct buildings like Houses."
  },
  "inv-res-catnip": {
    nom:     "Catnip",
    tier:    "Tier 1 · Food family",
    desc:    "Fresh catnip from the garden. Nutritious, if you're a cat.",
    produce: "Gathered by a Cat assigned to a Catnip Salad recipe.",
    usage:   "Used as the input for that recipe (10 Catnip per salad). It is never stored globally."
  },
  "inv-res-salads": {
    resourceId: "salads",
    nom:     "Catnip Salad",
    tier:    "Tier 1 · Food family (processed)",
    desc:    "A balanced catnip salad. Even Bernardo eats his greens.",
    produce: "Assign a Cat to a Catnip Salad recipe in Work. The slot gathers 10 Catnip first.",
    usage:   "Feed to a Cat in the Gang tab to give them +1 XP."
  },
  "inv-res-anchovy": {
    nom:     "Anchovy",
    tier:    "Tier 2 · Food family",
    desc:    "Fresh anchovies fished from the nearby stream. A cat's favourite.",
    produce: "Gathered by a Cat assigned to a Grilled Anchovy recipe.",
    usage:   "Used as the input for that recipe (10 Anchovies per serving). It is never stored globally."
  },
  "inv-res-grilled-anchovy": {
    resourceId: "grilledAnchovy",
    nom:     "Grilled Anchovy",
    tier:    "Tier 2 · Food family (processed)",
    desc:    "Golden, crispy, perfectly grilled. Worth every second of cooking.",
    produce: "Assign a Cat to a Grilled Anchovy recipe in Work. The slot gathers 10 Anchovies first.",
    usage:   "Feed to a Cat in the Gang tab to give them +10 XP."
  },
  "inv-res-pebbles": {
    nom:     "Pebbles",
    tier:    "Tier 1 · Rock family",
    desc:    "Small smooth pebbles gathered from the yard. Heavy pockets, light heart.",
    produce: "Gathered by a Cat assigned to a Pebble Bricks recipe.",
    usage:   "Used inside that recipe slot (10 pebbles per brick). It is never stored globally."
  },
  "inv-res-pebble-brick": {
    resourceId: "pebbleBricks",
    nom:     "Pebble Bricks",
    tier:    "Tier 1 · Rock family (processed)",
    desc:    "Compact bricks made from compressed pebbles. Surprisingly solid.",
    produce: "Assign a Cat to a Pebble Bricks recipe in Work. The slot gathers 10 Pebbles first.",
    usage:   "Used to construct buildings like Facilities."
  },
  "inv-res-rocks": {
    nom:     "Rocks",
    tier:    "Tier 2 · Rock family",
    desc:    "Dense stones hauled from deeper in the yard. Much heavier than pebbles.",
    produce: "Gathered by a Cat assigned to a Rock Bricks recipe.",
    usage:   "Used inside that recipe slot (10 rocks per brick). It is never stored globally."
  },
  "inv-res-rock-brick": {
    resourceId: "rockBricks",
    nom:     "Rock Bricks",
    tier:    "Tier 2 · Rock family (processed)",
    desc:    "Solid bricks forged from dense rock. Built to last.",
    produce: "Assign a Cat to a Rock Bricks recipe in Work. The slot gathers 10 Rocks first.",
    usage:   "Used in advanced construction."
  },
  "inv-res-human-leftovers": {
    resourceId: "humanLeftovers",
    nom:     "Human Leftovers",
    tier:    null,
    desc:    "Bits and pieces left behind by humans. One human's trash is another cat's treasure.",
    produce: "Found by sending cats on Exploration campaigns.",
    usage:   "Feed to a Cat in the Gang tab to give them +1 XP."
  },
  "inv-res-human-workers-food": {
    resourceId: "humanWorkersFood",
    nom:     "Workers Food",
    tier:    null,
    desc:    "Packed lunches left behind by the construction workers. Still good.",
    produce: "Found by scouting the basement in A1 (unlocks after both A1 campaigns).",
    usage:   "Feed to a Cat in the Gang tab to give them +15 XP."
  },
  "inv-res-canned-cat-food": {
    resourceId: "cannedCatFood",
    nom:     "Canned Cat Food",
    tier:    "Training Materials",
    desc:    "A sealed can of premium cat food found in the supermarket. This is the good stuff.",
    produce: "Complete or scout the Supermarket in the Exploration tab.",
    usage:   "Used in the Training Center to improve job levels."
  }
};

const ITEMS = {
  smallFountainBlueprint: {
    id:           "smallFountainBlueprint",
    category:     "blueprint",
    nom:          "Small Fountain Blueprint",
    emoji:        LIVRE_ICONE,
    description:  "Cannelle's plan for a compact stone fountain that brings a little calm to the Camp.",
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
    nom:          "Cardboard Litterbox Blueprint",
    emoji:        LIVRE_ICONE,
    description:  "Cannelle's practical plan for a compact cardboard litterbox at the Camp.",
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
    description:  "A human guide to a few job orientations for kids. We may learn something from it.",
    unlocksLabel: "Explorator, Lumberjack, Carpenter, Farmer and Chef jobs",
    studyDuration: 60000,
    learningGame: {
      phraseParts: [
        "You can ",
        " to be anything: a brave ",
        ", a skilled ",
        ", or even a great ",
        "!"
      ],
      answers: ["learn", "explorer", "builder", "chef"]
    },
    actions: [
      { id: "study", label: "Study" }
    ]
  },
  fishingGuide: {
    id:           "fishingGuide",
    nom:          "Fishing Guide for Dummies",
    emoji:        LIVRE_ICONE,
    description:  "A complete beginner's guide to feline fishing. Spoiler: you don't need a rod.",
    unlocksLabel: "Anchovy fishing and Grilled Anchovy",
    studyDuration: 3600000,
    learningGame: {
      phraseParts: [
        "A patient ",
        " watches the ",
        ", catches an ",
        ", then grills it in the ",
        "!"
      ],
      answers: ["fisher", "water", "anchovy", "Catchen"]
    },
    actions: [
      { id: "study", label: "Study (1h)" }
    ]
  },
  constructionPlan: {
    id:           "constructionPlan",
    nom:          "Construction Plan",
    emoji:        LIVRE_ICONE,
    description:  "Blueprints for renovating the house. Someone's been busy.",
    unlocksLabel: "Wood Builder job",
    studyDuration: 3600000,
    learningGame: {
      phraseParts: [
        "Every sturdy ",
        " begins with a careful ",
        ": measure the ",
        ", then let the ",
        " start working!"
      ],
      answers: ["house", "plan", "planks", "builder"]
    },
    actions: [
      { id: "study", label: "Study (1h)" }
    ]
  },
  seminarGuide: {
    id:           "seminarGuide",
    nom:          "Corporate Seminar Booklet",
    emoji:        LIVRE_ICONE,
    description:  "A booklet about professional training seminars. Participants walk out with new skills and sharper instincts for their trade.",
    unlocksLabel: "Training Center",
    studyDuration: 7200000,
    learningGame: {
      phraseParts: [
        "An effective seminar aligns our ",
        ", unlocks collective ",
        ", fosters meaningful ",
        ", strengthens team ",
        ", accelerates sustainable ",
        ", and transforms every challenge into an ",
        "!"
      ],
      answers: ["values", "potential", "collaboration", "synergy", "growth", "opportunity"]
    },
    actions: [
      { id: "study", label: "Study (2h)" }
    ]
  },
  dailyPurpose: {
    id:           "dailyPurpose",
    nom:          "The Daily Purpose",
    emoji:        LIVRE_ICONE,
    description:  "A human self-help book about building a daily routine and becoming the best version of yourself. The kind of advice that sounds profound before breakfast.",
    unlocksLabel: "Daily Quests",
    studyDuration: 3600000,
    learningGame: {
      phraseParts: [
        "Rise with ",
        ", honor your ",
        ", and unlock the ",
        " ",
        " of ",
        ", one tiny ",
        " at a time!"
      ],
      answers: ["purpose", "routine", "best", "version", "yourself", "step"]
    },
    actions: [
      { id: "study", label: "Study (1h)" }
    ]
  },
  engineerGuide: {
    id:           "engineerGuide",
    nom:          "The Engineer's Path",
    emoji:        LIVRE_ICONE,
    description:  "A human engineering guide pointing toward a new generation of recipes and specialists.",
    unlocksLabel: "Laboratory",
    studyDuration: 3600000,
    learningGame: {
      phraseParts: [
        "An engineer turns a ",
        " into a ",
        ", tests the ",
        ", learns from each ",
        ", and improves the final ",
        " for ",
        "."
      ],
      answers: ["problem", "design", "prototype", "failure", "solution", "everyone"]
    },
    actions: [
      { id: "study", label: "Study (1h)" }
    ]
  },
  teamworkGuide: {
    id:           "teamworkGuide",
    nom:          "The Teamwork Advantage",
    emoji:        LIVRE_ICONE,
    description:  "A human teamwork guide about combining different minds to uncover perspectives and solutions no one could find alone.",
    unlocksLabel: "Engineer rank upgrades",
    studyDuration: 3600000,
    learningGame: {
      phraseParts: [
        "Bring different ",
        " together around one ",
        ", and their varied ",
        " can reveal ",
        " solutions that no single ",
        " could ",
        " alone."
      ],
      answers: ["minds", "challenge", "perspectives", "unexpected", "person", "find"]
    },
    actions: [
      { id: "study", label: "Study (1h)" }
    ]
  },
  sturdyHousePlans: {
    id:           "sturdyHousePlans",
    nom:          "Sturdy House Plans",
    emoji:        LIVRE_ICONE,
    description:  "Detailed human blueprints for a compact stone house, with strict instructions on foundations, load-bearing walls, and structural stability. Excessively serious, but apparently very good at keeping a roof where it belongs.",
    unlocksLabel: "Solid Stone Cathouse",
    studyDuration: 3600000,
    learningGame: {
      phraseParts: [
        "A durable stone house depends on firm ",
        ", carefully fitted ",
        ", reinforced ",
        ", evenly distributed ",
        ", reliable ",
        ", and a properly supported ",
        "."
      ],
      answers: ["foundations", "blocks", "walls", "loads", "drainage", "roof"]
    },
    actions: [
      { id: "study", label: "Study (1h)" }
    ]
  },
  stoneGuide: {
    id:           "stoneGuide",
    nom:          "Stone Craft Guide",
    emoji:        LIVRE_ICONE,
    description:  "A human guide to mining and stone masonry. Heavy reading, heavy lifting.",
    unlocksLabel: "Miner and Stonemason jobs",
    studyDuration: 3600000,
    learningGame: {
      phraseParts: [
        "A skilled ",
        " breaks through ",
        " like butter, while a careful ",
        " shapes them into solid ",
        "!"
      ],
      answers: ["miner", "rocks", "stonemason", "bricks"]
    },
    actions: [
      { id: "study", label: "Study (1h)" }
    ]
  }
};

const METIERS = {
  lumberjack:    { id: "lumberjack",   nom: "Lumberjack",  emoji: "🪓", famille: "wood",    familleNom: "Wood resource family",    duree: 3600 },
  carpenter:     { id: "carpenter",   nom: "Carpenter",    emoji: "🔨", famille: "sawmill", familleNom: "Sawmill resource family", duree: 3600 },
  farmer:        { id: "farmer",      nom: "Farmer",       emoji: "🌾", famille: "food",    familleNom: "Food resource family",    duree: 3600 },
  chef:          { id: "chef",        nom: "Chef",         emoji: "🍳", famille: "catchen",    familleNom: "Catchen resource family",    duree: 3600 },
  explorator:    { id: "explorator",  nom: "Explorator",   emoji: "🧭", famille: "exploration", familleNom: "Exploration family",         duree: 3600 },
  builder:       { id: "builder",     nom: "Builder",      emoji: "🏗️", famille: null,         familleNom: "Camp construction",          duree: 3600, unlockItem: "constructionPlan" },
  miner:         { id: "miner",       nom: "Miner",        emoji: "⛏️", famille: "rock",        familleNom: "Rock resource family",       duree: 3600, unlockItem: "stoneGuide" },
  stonemason:    { id: "stonemason",  nom: "Stonemason",   emoji: "🪨", famille: "pawsonry",    familleNom: "Pawsonry resource family",   duree: 3600, unlockItem: "stoneGuide" },
  "gang-leader": { id: "gang-leader", nom: "Gang Leader",  emoji: "👑", famille: null,          familleNom: "Work speed",                 duree: 0 },
  "camp-engineer": { id: "camp-engineer", nom: "Camp Engineer", emoji: "🔧", famille: "engineering", familleNom: "Passive camp systems", duree: 3600, engineer: true }
};

const DESC_NEIGHBOR    = "Looks like our humans but nextdoor. They probably throw useful items as well.";
const DESC_GARDEN      = "Untamed grass, nobody tending it. Smells like mice have been through.";
const DESC_PARKING     = "A wide open area full of parked cars. Lots of shadows. Quiet at night.";

const ZONES_CARTE = {
  "D1": { id: "D1", nom: "Home",                    col: 3, row: 1, type: "home",     icone: "🏠", difficulte: 0,  duree: 0,   slots: 0, description: "" },
  "C1": { id: "C1", nom: "Left neighbor",            col: 2, row: 1, type: "neighbor", icone: "🏡", difficulte: 10, duree: 600,  slots: 2, description: DESC_NEIGHBOR },
  "E1": { id: "E1", nom: "Right neighbor",           col: 4, row: 1, type: "neighbor", icone: "🏡", difficulte: 10, duree: 600,  slots: 2, description: DESC_NEIGHBOR },
  "B1": { id: "B1", nom: "Empty Garden",             col: 1, row: 1, type: "other",    icone: "🌿", difficulte: 20, duree: 1200, slots: 2, description: DESC_GARDEN },
  "A1": { id: "A1", nom: "House under construction", col: 0, row: 1, type: "chantier", icone: "🏗️", difficulte: 30, duree: 1500, slots: 2, description: "Humans are building something here. Lots of wood and scrap material piling up. Empty at night." },
  "F1": { id: "F1", nom: "Empty Garden",             col: 5, row: 1, type: "other",    icone: "🌿", difficulte: 20, duree: 1200, slots: 2, description: DESC_GARDEN },
  "G1": { id: "G1", nom: "Squatted House",           col: 6, row: 1, type: "neighbor", icone: "🏚️", difficulte: 30, duree: 1500, slots: 2, description: "Something feels off about this place. No usual human signs. Saw a light through the boards at night once." },
  // Row 2 — full-width street
  "residentialStreet": { id: "residentialStreet", nom: "Residential Bloc Street", col: 0, row: 2, colSpan: 7, rowSpan: 1, type: "street", icone: "🛣️", difficulte: 30, duree: 1800, slots: 2, description: "The street in front of the houses. Bins come out on Thursdays. Dogs in the morning — Be careful." },
  "commercialStreet":  { id: "commercialStreet",  nom: "Commercial Street",       col: 3, row: 3, colSpan: 1, rowSpan: 2, type: "street", icone: "🛣️", difficulte: 40, duree: 2400, slots: 2, description: "A busy road. Cars and trucks, engines idling. Smells like petrol. I don't like it." },
  // Row 3-4 multi-cell zones
  "gasStation":    { id: "gasStation",    nom: "Gas Station",     col: 0, row: 3, colSpan: 2, rowSpan: 2, type: "shop",   icone: "⛽", difficulte: 50, duree: 3000, slots: 2, description: "That brightly lit corner that never closes. Cars are stopping in front and leaving a few minutes after. Weird place." },
  "parkingLeft":   { id: "parkingLeft",   nom: "Parking",         col: 2, row: 3, colSpan: 1, rowSpan: 2, type: "other",  icone: "🅿️", difficulte: 40, duree: 2400, slots: 2, description: DESC_PARKING },
  "parkingRight":  { id: "parkingRight",  nom: "Parking",         col: 4, row: 3, colSpan: 1, rowSpan: 2, type: "other",  icone: "🅿️", difficulte: 40, duree: 2400, slots: 2, description: DESC_PARKING },
  "supermarket":   { id: "supermarket",   nom: "Supermarket",     col: 5, row: 3, colSpan: 2, rowSpan: 2, type: "shop",   icone: "🛒", difficulte: 50, duree: 3000, slots: 2, description: "The glass building where humans carry out lots of plastic bags. Smells great with loads of unidentified smells. I need to get in there." },
  // Row 5 — full-width Forest Entrance
  "forestEntrance": { id: "forestEntrance", nom: "Forest Entrance", col: 0, row: 5, colSpan: 7, rowSpan: 1, type: "forest", icone: "🌲", difficulte: 60, duree: 3600, slots: 2, description: "Where the street ends and the trees begin. Nature seems to have resisted human greediness. At least for now..." },
};

// ── Regions ────────────────────────────────────────────────────────────────
// Each region has its own zone grid. ZONES_CARTE is the starting neighbourhood.
// zonesRegion() resolves the active region's zones; use it for new region-aware code.
const REGIONS = {
  startingNeighbourhood: {
    id:     "startingNeighbourhood",
    nom:    "Starting Neighbourhood",
    mapImg: "img/Maps/Starting Neighbourhood.png",
    zones:  ZONES_CARTE,
  },
};

const TIERS_KITTIES = [
  "Kitten", "Great Kitten", "Cat", "Great Cat",
  "General Cat", "Emperor Cat", "Godly Cat"
];

const NOMS_KITTIES = [
  "Bernardo", "Mochi", "Luna", "Whiskers", "Felix",
  "Cleopatra", "Biscuit", "Cosmo", "Zelda", "Cannelle", "Napoleon",
  "Duchess", "Rascal", "Aurora", "Chester", "Pumpkin",
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
const CAT_FACES = {
  bernardo: LIVE_BERNARDO_FACE
    ? LIVE_BERNARDO_FACE.runtimePath + "?v=live-r" + LIVE_BERNARDO_FACE.revision
    : "",
  mochi:    "img/Cat faces/Mochi_Final.png?v=0.0026",
  luna:     "img/Cat faces/Luna_Final.png?v=0.0026",
  alt1:     "img/Cat faces/Alternative Kitty face 1_Final.png?v=0.0026",
  alt2:     "img/Cat faces/Alternative Kitty face 2_Final.png?v=0.0026",
  alt3:     "img/Cat faces/Alternative Kitty face 3_Final.png?v=0.0026",
  alt4:     "img/Cat faces/Alternative Kitty face 4_Final.png?v=0.0026"
};
const LIVE_CANNELLE_FACE = CatInc.data.liveCatFaces && Array.isArray(CatInc.data.liveCatFaces.items)
  ? CatInc.data.liveCatFaces.items.find(function(item) { return item.id === "cat-faces-cannelle-3"; })
  : null;
CAT_FACES.cannelle = LIVE_CANNELLE_FACE
  ? LIVE_CANNELLE_FACE.runtimePath + "?v=live-r" + LIVE_CANNELLE_FACE.revision
  : "";
const LIVE_ALTERNATIVE_CAT_FACES = CatInc.data.liveCatFaces && Array.isArray(CatInc.data.liveCatFaces.alternatives)
  ? CatInc.data.liveCatFaces.alternatives.map(function(item) {
      return item.runtimePath + "?v=live-r" + item.revision;
    })
  : [];
const CAT_FACES_ALEATOIRES = Object.freeze(LIVE_ALTERNATIVE_CAT_FACES.length
  ? LIVE_ALTERNATIVE_CAT_FACES
  : [CAT_FACES.alt1, CAT_FACES.alt2, CAT_FACES.alt3, CAT_FACES.alt4]);

  CatInc.data.content = Object.freeze({
    LIVRE_ICONE: LIVRE_ICONE,
    RESOURCE_INFO: RESOURCE_INFO,
    ITEMS: ITEMS,
    METIERS: METIERS,
    ZONES_CARTE: ZONES_CARTE,
    REGIONS: REGIONS,
    TIERS_KITTIES: TIERS_KITTIES,
    NOMS_KITTIES: NOMS_KITTIES,
    KITTY_ICON: KITTY_ICON,
    CHECK_ICON: CHECK_ICON,
    CAT_FACES: CAT_FACES,
    CAT_FACES_ALEATOIRES: CAT_FACES_ALEATOIRES
  });
})(typeof window !== "undefined" ? window : globalThis);
