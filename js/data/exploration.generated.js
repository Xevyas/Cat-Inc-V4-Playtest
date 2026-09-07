(function(root) {
  "use strict";
  const CatInc = root.CatInc = root.CatInc || {};
  CatInc.data = CatInc.data || {};
  function deepFreeze(value) {
    if (!value || typeof value !== "object" || Object.isFrozen(value)) return value;
    Object.keys(value).forEach(function(key) { deepFreeze(value[key]); });
    return Object.freeze(value);
  }
  CatInc.data.exploration = deepFreeze({
  "schemaVersion": 1,
  "regions": {
    "startingNeighbourhood": {
      "id": "startingNeighbourhood",
      "nom": "Starting Neighbourhood",
      "mapImg": "img/Maps/Starting Neighbourhood.webp",
      "zones": {
        "D1": {
          "id": "D1",
          "nom": "Home",
          "col": 3,
          "row": 1,
          "type": "home",
          "icone": "🏠",
          "difficulte": 0,
          "duree": 0,
          "slots": 0,
          "description": ""
        },
        "C1": {
          "id": "C1",
          "nom": "Left neighbor",
          "col": 2,
          "row": 1,
          "type": "neighbor",
          "icone": "🏡",
          "difficulte": 10,
          "duree": 600,
          "slots": 2,
          "description": "Looks like our humans but nextdoor. They probably throw useful items as well."
        },
        "E1": {
          "id": "E1",
          "nom": "Right neighbor",
          "col": 4,
          "row": 1,
          "type": "neighbor",
          "icone": "🏡",
          "difficulte": 10,
          "duree": 600,
          "slots": 2,
          "description": "Looks like our humans but nextdoor. They probably throw useful items as well."
        },
        "B1": {
          "id": "B1",
          "nom": "Empty Garden",
          "col": 1,
          "row": 1,
          "type": "other",
          "icone": "🌿",
          "difficulte": 20,
          "duree": 1200,
          "slots": 2,
          "description": "Untamed grass, nobody tending it. Smells like mice have been through."
        },
        "A1": {
          "id": "A1",
          "nom": "House under construction",
          "col": 0,
          "row": 1,
          "type": "chantier",
          "icone": "🏗️",
          "difficulte": 30,
          "duree": 1500,
          "slots": 2,
          "description": "Humans are building something here. Lots of wood and scrap material piling up. Empty at night."
        },
        "F1": {
          "id": "F1",
          "nom": "Empty Garden",
          "col": 5,
          "row": 1,
          "type": "other",
          "icone": "🌿",
          "difficulte": 20,
          "duree": 1200,
          "slots": 2,
          "description": "Untamed grass, nobody tending it. Smells like mice have been through."
        },
        "G1": {
          "id": "G1",
          "nom": "Squatted House",
          "col": 6,
          "row": 1,
          "type": "neighbor",
          "icone": "🏚️",
          "difficulte": 30,
          "duree": 1500,
          "slots": 2,
          "description": "Something feels off about this place. No usual human signs. Saw a light through the boards at night once."
        },
        "residentialStreet": {
          "id": "residentialStreet",
          "nom": "Residential Bloc Street",
          "col": 0,
          "row": 2,
          "colSpan": 7,
          "rowSpan": 1,
          "type": "street",
          "icone": "🛣️",
          "difficulte": 30,
          "duree": 1800,
          "slots": 2,
          "description": "The street in front of the houses. Bins come out on Thursdays. Dogs in the morning — Be careful."
        },
        "commercialStreet": {
          "id": "commercialStreet",
          "nom": "Commercial Street",
          "col": 3,
          "row": 3,
          "colSpan": 1,
          "rowSpan": 2,
          "type": "street",
          "icone": "🛣️",
          "difficulte": 40,
          "duree": 2400,
          "slots": 2,
          "description": "A busy road. Cars and trucks, engines idling. Smells like petrol. I don't like it."
        },
        "gasStation": {
          "id": "gasStation",
          "nom": "Gas Station",
          "col": 0,
          "row": 3,
          "colSpan": 2,
          "rowSpan": 2,
          "type": "shop",
          "icone": "⛽",
          "difficulte": 50,
          "duree": 3000,
          "slots": 2,
          "description": "That brightly lit corner that never closes. Cars are stopping in front and leaving a few minutes after. Weird place."
        },
        "parkingLeft": {
          "id": "parkingLeft",
          "nom": "Parking",
          "col": 2,
          "row": 3,
          "colSpan": 1,
          "rowSpan": 2,
          "type": "other",
          "icone": "🅿️",
          "difficulte": 40,
          "duree": 2400,
          "slots": 2,
          "description": "A wide open area full of parked cars. Lots of shadows. Quiet at night."
        },
        "parkingRight": {
          "id": "parkingRight",
          "nom": "Parking",
          "col": 4,
          "row": 3,
          "colSpan": 1,
          "rowSpan": 2,
          "type": "other",
          "icone": "🅿️",
          "difficulte": 40,
          "duree": 2400,
          "slots": 2,
          "description": "A wide open area full of parked cars. Lots of shadows. Quiet at night."
        },
        "supermarket": {
          "id": "supermarket",
          "nom": "Supermarket",
          "col": 5,
          "row": 3,
          "colSpan": 2,
          "rowSpan": 2,
          "type": "shop",
          "icone": "🛒",
          "difficulte": 50,
          "duree": 3000,
          "slots": 2,
          "description": "The glass building where humans carry out lots of plastic bags. Smells great with loads of unidentified smells. I need to get in there."
        },
        "forestEntrance": {
          "id": "forestEntrance",
          "nom": "Forest Entrance",
          "col": 0,
          "row": 5,
          "colSpan": 7,
          "rowSpan": 1,
          "type": "forest",
          "icone": "🌲",
          "difficulte": 60,
          "duree": 3600,
          "slots": 2,
          "description": "Where the street ends and the trees begin. Nature seems to have resisted human greediness. At least for now..."
        }
      }
    }
  },
  "campaigns": {
    "checkTheTrash": {
      "id": "checkTheTrash",
      "nom": "Search our trash",
      "description": "Dig through the bins at home. You never know what's there.",
      "difficulte": 1,
      "duree": 300,
      "slots": 1,
      "recompense": "schoolGuide",
      "zone": "D1"
    },
    "searchHomeHouse": {
      "id": "searchHomeHouse",
      "nom": "Search the house",
      "description": "The house is empty now. Search quickly before the humans come back.",
      "lockedDescription": "There may be useful things inside, but a human is still home.",
      "difficulte": 70,
      "duree": 3600,
      "slots": 2,
      "recompense": "engineerGuide",
      "zone": "D1",
      "unlockAfterStory": "storyHouseEvacuationVue",
      "lockedReason": "Human inside the house. Your cats can't search it yet."
    },
    "searchNeighborTrash": {
      "id": "searchNeighborTrash",
      "nom": "Search Neighbor's trash",
      "description": "The right neighbor throws away more than they should. Time to investigate.",
      "difficulte": 15,
      "duree": 600,
      "slots": 2,
      "recompense": "fishingGuide",
      "zone": "E1"
    },
    "searchRightGarden": {
      "id": "searchRightGarden",
      "nom": "Search the garden",
      "description": "A few scraps are visible in a corner of the garden, as if people have been tossing their trash over the fence.",
      "difficulte": 15,
      "duree": 1200,
      "slots": 2,
      "recompense": "humanLeftovers",
      "recompenseQty": 10,
      "zone": "F1"
    },
    "searchRightHouse": {
      "id": "searchRightHouse",
      "nom": "Search the house",
      "description": "There may be useful things inside, but a human is still home.",
      "difficulte": 0,
      "duree": 0,
      "slots": 2,
      "recompense": null,
      "zone": "E1",
      "lockedReason": "Human inside the house. Your cats can't search it yet."
    },
    "searchLeftNeighborTrash": {
      "id": "searchLeftNeighborTrash",
      "nom": "Search Left Neighbor's Trash",
      "description": "The left neighbor throws away more than they should. Time to investigate.",
      "difficulte": 15,
      "duree": 600,
      "slots": 2,
      "recompense": "humanLeftovers",
      "recompenseQty": 10,
      "zone": "C1"
    },
    "searchLeftGarden": {
      "id": "searchLeftGarden",
      "nom": "Search the garden",
      "description": "A few scraps are visible in a corner of the garden, as if people have been tossing their trash over the fence.",
      "difficulte": 15,
      "duree": 1200,
      "slots": 2,
      "recompense": "humanLeftovers",
      "recompenseQty": 10,
      "zone": "B1"
    },
    "searchLeftHouse": {
      "id": "searchLeftHouse",
      "nom": "Search Left Neighbor's House",
      "description": "The left neighbors have left in a hurry. Their empty house may hold useful tools and ideas.",
      "difficulte": 80,
      "duree": 4800,
      "slots": 2,
      "recompense": "teamworkGuide",
      "zone": "C1",
      "unlockAfterStory": "storyLeftHouseEvacuationVue",
      "lockedReason": "Human inside the house. Your cats can't search it yet."
    },
    "exploreSquattedGarden": {
      "id": "exploreSquattedGarden",
      "nom": "Explore the Garden",
      "description": "The garden outside the squatted house looks abandoned. Something might be hidden in there.",
      "difficulte": 40,
      "duree": 1800,
      "slots": 2,
      "recompense": "stoneGuide",
      "zone": "G1"
    },
    "searchSquattedHouse": {
      "id": "searchSquattedHouse",
      "nom": "Search the House",
      "description": "The house itself hides more secrets — but dangerous threats lurk inside.",
      "difficulte": 0,
      "duree": 0,
      "slots": 2,
      "recompense": null,
      "zone": "G1",
      "unlockAfterCampaign": "exploreSquattedGarden",
      "lockedReason": "⚠️ Threats detected inside — your cats can't fight them yet."
    },
    "exploreGroundFloor": {
      "id": "exploreGroundFloor",
      "nom": "Explore the Ground Floor",
      "description": "The ground floor is being renovated. Time to take a look around.",
      "difficulte": 35,
      "duree": 1800,
      "slots": 2,
      "recompense": "constructionPlan",
      "zone": "A1"
    },
    "exploreBasement": {
      "id": "exploreBasement",
      "nom": "Explore the Basement",
      "description": "Below the ground floor lies a basement no one seems to have touched in years. Might be worth a look.",
      "difficulte": 50,
      "duree": 3600,
      "slots": 2,
      "recompense": "seminarGuide",
      "zone": "A1",
      "unlockAfterCampaign": "exploreGroundFloor"
    },
    "searchUpperFloor": {
      "id": "searchUpperFloor",
      "nom": "Search the upper floor",
      "description": "The builders left the upper floor exposed behind the scaffolding. Climb up, search the unfinished rooms, and get back down before the crew returns.",
      "difficulte": 80,
      "duree": 3600,
      "slots": 2,
      "recompense": "sturdyHousePlans",
      "zone": "A1",
      "unlockAfterCampaign": "exploreGroundFloor"
    },
    "searchLeftParking": {
      "id": "searchLeftParking",
      "nom": "Search the parking",
      "description": "A pile of materials used by humans seems to be piling up in one corner of the parking lot.",
      "difficulte": 35,
      "duree": 2400,
      "slots": 2,
      "recompenses": [
        {
          "recompense": "rockBricks",
          "qty": 2
        }
      ],
      "zone": "parkingLeft"
    },
    "searchRightParking": {
      "id": "searchRightParking",
      "nom": "Search the parking",
      "description": "A pile of materials used by humans seems to be piling up in one corner of the parking lot.",
      "difficulte": 35,
      "duree": 2400,
      "slots": 2,
      "recompenses": [
        {
          "recompense": "rockBricks",
          "qty": 1
        },
        {
          "recompense": "basicWoodPlanks",
          "qty": 5
        }
      ],
      "zone": "parkingRight"
    },
    "infiltrateSupermarket": {
      "id": "infiltrateSupermarket",
      "nom": "Infiltrate the Supermarket",
      "description": "The supermarket is full of things we need. We just need to get in there without being noticed.",
      "difficulte": 60,
      "duree": 3600,
      "slots": 2,
      "recompense": "cannedCatFood",
      "recompenseQty": 2,
      "zone": "supermarket"
    },
    "checkSupermarketBookSection": {
      "id": "checkSupermarketBookSection",
      "nom": "Check the book section",
      "description": "The humans keep a whole section of books about becoming better versions of themselves. Let's see what all the fuss is about.",
      "difficulte": 65,
      "duree": 3600,
      "slots": 2,
      "recompense": "dailyPurpose",
      "zone": "supermarket",
      "unlockAfterCampaign": "infiltrateSupermarket"
    },
    "exploreOutside": {
      "id": "exploreOutside",
      "nom": "Explore the outside",
      "description": "Have a look around this strange structure, I also spotted a potential back entrance we could use",
      "difficulte": 50,
      "duree": 2400,
      "slots": 2,
      "recompenses": [
        {
          "recompense": "basicWoodPlanks",
          "qty": 10
        },
        {
          "recompense": "humanLeftovers",
          "qty": 20
        },
        {
          "recompense": "humanWorkersFood",
          "qty": 1
        }
      ],
      "zone": "gasStation"
    },
    "sneakBackEntrance": {
      "id": "sneakBackEntrance",
      "nom": "Sneak through the back entrance",
      "description": "Slip through the back door while the humans are busy out front. Search quickly, keep quiet, and leave no pawprints behind.",
      "difficulte": 80,
      "duree": 5400,
      "slots": 2,
      "recompense": "compass",
      "zone": "gasStation",
      "unlockAfterCampaign": "exploreOutside"
    },
    "navigateThroughWoods": {
      "id": "navigateThroughWoods",
      "nom": "Navigate through the woods",
      "description": "With the Compass in paw, follow the trail through the woods and see what lies beyond our neighbourhood.",
      "difficulte": 100,
      "duree": 5400,
      "slots": 2,
      "recompense": "worldMap",
      "requiredItem": "compass",
      "zone": "forestEntrance"
    }
  },
  "scoutings": {
    "searchTrashAgain": {
      "id": "searchTrashAgain",
      "nom": "Search our trash again",
      "description": "Keep digging — there's always something new in the bins.",
      "difficulte": 1,
      "duree": 600,
      "slots": 1,
      "recompense": "humanLeftovers",
      "recompenseRange": [
        {
          "qty": 1,
          "weight": 70
        },
        {
          "qty": 2,
          "weight": 20
        },
        {
          "qty": 3,
          "weight": 10
        }
      ],
      "zone": "D1",
      "unlockCampaign": "checkTheTrash"
    },
    "searchNeighborTrashAgain": {
      "id": "searchNeighborTrashAgain",
      "nom": "Search neighbor's trash again",
      "description": "The right neighbor keeps throwing good stuff away. Worth another look.",
      "difficulte": 15,
      "duree": 1200,
      "slots": 1,
      "recompense": "humanLeftovers",
      "recompenseRange": [
        {
          "qty": 1,
          "weight": 70
        },
        {
          "qty": 2,
          "weight": 20
        },
        {
          "qty": 3,
          "weight": 10
        }
      ],
      "zone": "E1",
      "unlockCampaign": "searchNeighborTrash"
    },
    "searchLeftNeighborTrashAgain": {
      "id": "searchLeftNeighborTrashAgain",
      "nom": "Search left neighbor's trash again",
      "description": "The left neighbor keeps throwing good stuff away. Worth another look.",
      "difficulte": 15,
      "duree": 1200,
      "slots": 1,
      "recompense": "humanLeftovers",
      "recompenseRange": [
        {
          "qty": 1,
          "weight": 70
        },
        {
          "qty": 2,
          "weight": 20
        },
        {
          "qty": 3,
          "weight": 10
        }
      ],
      "zone": "C1",
      "unlockCampaign": "searchLeftNeighborTrash"
    },
    "searchBasementAgain": {
      "id": "searchBasementAgain",
      "nom": "Search Basement again",
      "description": "We may have missed a few things down there. Let's take another look.",
      "difficulte": 30,
      "duree": 3000,
      "slots": 1,
      "recompense": "humanWorkersFood",
      "recompenseRange": [
        {
          "qty": 1,
          "weight": 70
        },
        {
          "qty": 2,
          "weight": 20
        },
        {
          "qty": 3,
          "weight": 10
        }
      ],
      "zone": "A1",
      "unlockCampaign": "exploreBasement"
    },
    "raidSupermarketAgain": {
      "id": "raidSupermarketAgain",
      "nom": "Infiltrate the Supermarket again",
      "description": "We got something last time. Let's push our luck.",
      "difficulte": 60,
      "duree": 3600,
      "slots": 1,
      "recompenseTable": [
        {
          "recompense": "cannedCatFood",
          "qty": 1,
          "weight": 25
        },
        {
          "recompense": "humanWorkersFood",
          "qty": 1,
          "weight": 75
        }
      ],
      "dailyCannedCatFoodStock": 3,
      "zone": "supermarket",
      "unlockCampaign": "infiltrateSupermarket"
    },
    "stealGasStationAgain": {
      "id": "stealGasStationAgain",
      "nom": "Let's try stealing more",
      "description": "Now that we know the way in, let's try to bring back a few more useful things without being noticed.",
      "difficulte": 50,
      "duree": 3000,
      "slots": 2,
      "recompenseTable": [
        {
          "recompense": "humanWorkersFood",
          "qty": 2,
          "weight": 50
        },
        {
          "recompense": "humanWorkersFood",
          "qty": 4,
          "weight": 45
        },
        {
          "recompense": "cannedCatFood",
          "qty": 1,
          "weight": 5
        }
      ],
      "dailyCannedCatFoodStock": 2,
      "zone": "gasStation",
      "unlockCampaign": "sneakBackEntrance"
    }
  }
});
})(typeof window !== "undefined" ? window : globalThis);
