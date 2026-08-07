(function(root) {
  "use strict";

  const CatInc = root.CatInc = root.CatInc || {};
  CatInc.data = CatInc.data || {};

  const LEGACY_CHARACTERS = Object.freeze({
    bernard: Object.freeze({ id: "bernardo", name: "Bernardo", side: "left", portrait: "img/Cat faces/Bernardo.png" }),
    mochi: Object.freeze({ id: "mochi", name: "Mochi", side: "right", portrait: "img/Cat faces/Mochi_Final.png" }),
    luna: Object.freeze({ id: "luna", name: "Luna", side: "right", portrait: "img/Cat faces/Luna_Final.png" }),
    incrementor: Object.freeze({ id: "incrementor", name: "The Greatest Incrementor", side: "right", portrait: "img/Cat faces/the-greatest-incrementor.png" }),
    incrementorAmused: Object.freeze({ id: "incrementor", name: "The Greatest Incrementor", side: "right", portrait: "img/Cat faces/the-greatest-incrementor-amused.png" }),
    incrementorLaugh: Object.freeze({ id: "incrementor", name: "The Greatest Incrementor", side: "right", portrait: "img/Cat faces/the-greatest-incrementor-laugh.png" }),
    explorator: Object.freeze({ id: "explorator", name: "Explorator", side: "right", initials: "E" }),
    enfant: Object.freeze({ id: "kid", name: "Kid", side: "right", initials: "K" }),
    maman: Object.freeze({ id: "mother", name: "Mom", side: "right", initials: "M" }),
    mere: Object.freeze({ id: "mother", name: "Mother", side: "right", initials: "M" })
  });

  const LEGACY_SCENES = Object.freeze([
    Object.freeze({ id: "ecran-intro", name: "Introduction", flag: "introVue", asset: Object.freeze({ type: "illustration", src: "img/Story scenes/Intro.png", alt: "A child reaches toward Bernardo while their mother holds their hand." }) }),
    Object.freeze({ id: "ecran-story-1", name: "Bernardo's plan begins", flag: "story1Vue", asset: Object.freeze({ type: "icon", src: "img/Cat faces/Bernardo.png", alt: "Portrait of Bernardo." }) }),
    Object.freeze({ id: "ecran-story-2", name: "Mochi joins the gang", flag: "story2Vue", asset: Object.freeze({ type: "icon", src: "img/Cat faces/Mochi_Final.png", alt: "Portrait of Mochi." }) }),
    Object.freeze({ id: "ecran-story-3", name: "The adventure begins", flag: "story3Vue", asset: Object.freeze({ type: "illustration", src: "img/Story scenes/Story 3.png", alt: "Bernardo addresses two other kittens in the garden." }) }),
    Object.freeze({ id: "ecran-story-camp-intro", name: "A garden to rebuild", flag: "storyCampIntroVue", asset: Object.freeze({ type: "illustration", src: "img/Story scenes/Story 3.png", alt: "Bernardo, Mochi and Luna inspect their cluttered new garden." }) }),
    Object.freeze({ id: "ecran-story-camp-full", name: "Room for one more", flag: "storyCampFullVue", asset: Object.freeze({ type: "icon", src: "img/Buildings/Cardboard Box_Final.png", alt: "A Cardboard Box shelter." }) }),
    Object.freeze({ id: "ecran-story-manual-focus", name: "A Little Encouragement", flag: "storyManualFocusVue", asset: Object.freeze({ type: "icon", src: "img/Cat faces/Bernardo.png", alt: "Portrait of Bernardo preparing to encourage the workers." }) }),
    Object.freeze({ id: "ecran-story-4", name: "Our first creation", flag: "story4Vue", asset: Object.freeze({ type: "illustration", src: "img/Story scenes/Story 4.png", alt: "Three kittens admire their first cardboard shelter." }) }),
    Object.freeze({ id: "ecran-story-greatest-incrementor-part-1", name: "The Greatest Incrementor — Part 1", flag: "storyGreatestIncrementorPart1Vue", asset: Object.freeze({ type: "icon", src: "img/Cat faces/the-greatest-incrementor.png", alt: "Portrait of The Greatest Incrementor." }) }),
    Object.freeze({ id: "ecran-story-basic-wood", name: "Beyond Cardboard", flag: "storyBasicWoodVue", asset: Object.freeze({ type: "icon", src: "img/resources/Basic Wood_Final.png?v=0.0029", alt: "A stack of sturdy Basic Wood logs." }) }),
    Object.freeze({ id: "ecran-story-5", name: "Gang on the rise", flag: "story5Vue", asset: Object.freeze({ type: "icon", src: "img/Cat faces/Bernardo.png", alt: "Portrait of Bernardo." }) }),
    Object.freeze({ id: "ecran-story-house-evacuation", name: "They Built a Camp", flag: "storyHouseEvacuationVue" }),
    Object.freeze({ id: "ecran-story-left-house", name: "The Neighbors Are Leaving", flag: "storyLeftHouseEvacuationVue" }),
    Object.freeze({ id: "ecran-story-6a", name: "What's that thing?", flag: "story6aVue", asset: Object.freeze({ type: "icon", src: "img/resources/Books_Final.png", alt: "A mysterious book found during scouting." }) }),
    Object.freeze({ id: "ecran-story-6b", name: "A job for everyone", flag: "story6bVue", asset: Object.freeze({ type: "illustration", src: "img/Story scenes/Story 6b.png", alt: "Bernardo studies charts and diagrams in an open book." }) }),
    Object.freeze({ id: "ecran-story-salad", name: "Chef's kiss", flag: "storySaladVue", asset: Object.freeze({ type: "icon", src: "img/resources/Catnip Salad_Final.png", alt: "A freshly prepared Catnip Salad." }) }),
    Object.freeze({ id: "ecran-story-seminar", name: "Everybody loves seminars, right?", flag: "storySeminarVue", asset: Object.freeze({ type: "icon", src: "img/resources/Books_Final.png", alt: "A corporate seminar booklet." }) }),
    Object.freeze({ id: "ecran-story-explorator", name: "A New Horizon", flag: "storyExploratorVue", asset: Object.freeze({ type: "icon", src: "img/Cat faces/Bernardo.png", alt: "Portrait of the gang's first Explorator." }) }),
    Object.freeze({ id: "ecran-story-bird", name: "The bird", flag: "storyBirdVue", asset: Object.freeze({ type: "illustration", src: "img/Story scenes/Bernardo caught bird.png?v=0.0029", alt: "Bernardo leaps toward a bird perched on a tree branch." }) })
  ]);

const LEGACY_SCENE_BEATS = Object.freeze({
  "ecran-intro": [
    {
      "classes": [],
      "speakerClass": "enfant",
      "speakerName": "Kid",
      "html": "Mom! That little cat at the end of the street has been staring at me for like ten minutes straight. It's kind of creepy. Can we keep him?"
    },
    {
      "classes": [],
      "speakerClass": "maman",
      "speakerName": "Mom",
      "html": "We barely have time for ourselves, let alone a cat. Come help me with the groceries."
    },
    {
      "classes": [],
      "speakerClass": "enfant",
      "speakerName": "Kid",
      "html": "PLEASE. He needs us. Look at those eyes."
    },
    {
      "classes": [],
      "speakerClass": "maman",
      "speakerName": "Mom",
      "html": "...Fine. But you're feeding him."
    },
    {
      "classes": [
        "intro-miaou"
      ],
      "speakerClass": "bernard",
      "speakerName": "Bernardo",
      "html": "<em>Miaou.</em> <span class=\"intro-traduit\">(It took him long enough to notice me, but the first step of the plan is complete.)</span>"
    }
  ],
  "ecran-story-1": [
    {
      "classes": [],
      "speakerClass": "enfant",
      "speakerName": "Kid",
      "html": "Got you! Welcome home, buddy. The garden's all yours. You're gonna love it here!"
    },
    {
      "classes": [
        "intro-miaou"
      ],
      "speakerClass": "bernard",
      "speakerName": "Bernardo",
      "html": "<em>Miaou miaou.</em> <span class=\"intro-traduit\">(At last, I have a warm garden and a human who thinks this was his idea, which is a very promising start.)</span>"
    },
    {
      "classes": [],
      "speakerClass": "enfant",
      "speakerName": "Kid",
      "html": "Hey... there's another cat at the end of the street! She looks lost. I should go get her!"
    },
    {
      "classes": [
        "intro-miaou"
      ],
      "speakerClass": "bernard",
      "speakerName": "Bernardo",
      "html": "<em>Miaou.</em> <span class=\"intro-traduit\">(There she is, and Mochi appears to remember her cue, so let's see whether our new human can be useful twice in one day.)</span>"
    }
  ],
  "ecran-story-2": [
    {
      "classes": [],
      "speakerClass": "enfant",
      "speakerName": "Kid",
      "html": "Phew, she was fast! But I got her. Two kitties. This is the best day ever."
    },
    {
      "classes": [
        "intro-miaou"
      ],
      "speakerClass": "bernard",
      "speakerName": "Bernardo",
      "html": "<em>Miaou miaou.</em> <span class=\"intro-traduit\">(Welcome, Mochi. That was a convincing sprint, and now the human feels like a hero.)</span>"
    },
    {
      "classes": [
        "intro-miaou"
      ],
      "speakerClass": "mochi",
      "speakerName": "Mochi",
      "html": "<em>Miaou.</em> <span class=\"intro-traduit\">(I nearly let him catch me sooner, but then I saw a butterfly.)</span>"
    },
    {
      "classes": [
        "intro-miaou"
      ],
      "speakerClass": "bernard",
      "speakerName": "Bernardo",
      "html": "<em>Miaou.</em> <span class=\"intro-traduit\">(Naturally, but you are here now and that is what matters.)</span>"
    },
    {
      "classes": [],
      "speakerClass": "enfant",
      "speakerName": "Kid",
      "html": "Wait... I'm pretty sure I saw another one near the park earlier. I'll go check!"
    },
    {
      "classes": [
        "intro-miaou"
      ],
      "speakerClass": "mochi",
      "speakerName": "Mochi",
      "html": "<em>Miaou?</em> <span class=\"intro-traduit\">(Luna too? This garden gets better every minute!)</span>"
    },
    {
      "classes": [
        "intro-miaou"
      ],
      "speakerClass": "bernard",
      "speakerName": "Bernardo",
      "html": "<em>Miaou miaou miaou.</em> <span class=\"intro-traduit\">(Exactly. We have a warm shelter, a predictable human, and soon we will have a proper gang.)</span>"
    }
  ],
  "ecran-story-3": [
    {
      "classes": [],
      "speakerClass": "enfant",
      "speakerName": "Kid",
      "html": "Three kitties in one day... I'm completely wiped out. I'll go watch some TV. They'll be fine!"
    },
    {
      "classes": [
        "intro-miaou"
      ],
      "speakerClass": null,
      "speakerName": null,
      "html": "Kid disappears inside"
    },
    {
      "classes": [],
      "speakerClass": "bernard",
      "speakerName": "Bernardo",
      "html": "Finally. The human has gone inside."
    },
    {
      "classes": [],
      "speakerClass": "mochi",
      "speakerName": "Mochi",
      "html": "Does that mean it is nap time?"
    },
    {
      "classes": [],
      "speakerClass": "luna",
      "speakerName": "Luna",
      "html": "For you, every time is nap time."
    },
    {
      "classes": [],
      "speakerClass": "bernard",
      "speakerName": "Bernardo",
      "html": "Not yet. This garden is safe, the humans are easy to manage, and there are useful materials everywhere, so we have everything we need to turn this place into a proper home."
    },
    {
      "classes": [],
      "speakerClass": "mochi",
      "speakerName": "Mochi",
      "html": "A proper home with snacks?"
    },
    {
      "classes": [],
      "speakerClass": "bernard",
      "speakerName": "Bernardo",
      "html": "A strong home with snacks."
    },
    {
      "classes": [],
      "speakerClass": "luna",
      "speakerName": "Luna",
      "html": "There it is. The condition that secured Mochi's loyalty."
    },
    {
      "classes": [],
      "speakerClass": "bernard",
      "speakerName": "Bernardo",
      "html": "Get on your paws, both of you. We start now."
    }
  ],
  "ecran-story-camp-intro": [
    {
      "classes": [],
      "speakerClass": "mochi",
      "speakerName": "Mochi",
      "html": "This garden looked much tidier from the street."
    },
    {
      "classes": [],
      "speakerClass": "luna",
      "speakerName": "Luna",
      "html": "From the street, you were looking at a sandwich wrapper."
    },
    {
      "classes": [],
      "speakerClass": "bernard",
      "speakerName": "Bernardo",
      "html": "The mess can wait. That old workshop is a Sawmill, and it only needs a few minor repairs. Once one of you gets it running, we can start producing proper building material."
    },
    {
      "classes": [],
      "speakerClass": "mochi",
      "speakerName": "Mochi",
      "html": "One of us?"
    },
    {
      "classes": [],
      "speakerClass": "bernard",
      "speakerName": "Bernardo",
      "html": "I will supervise from somewhere with a clear view. You and Luna will handle the work."
    }
  ],
  "ecran-story-camp-full": [
    {
      "classes": [],
      "speakerClass": "mochi",
      "speakerName": "Mochi",
      "html": "The visitor made it! Why are they still waiting outside?"
    },
    {
      "classes": [],
      "speakerClass": "luna",
      "speakerName": "Luna",
      "html": "Because there is no room left under the porch. We have filled every dry corner."
    },
    {
      "classes": [],
      "speakerClass": "bernard",
      "speakerName": "Bernardo",
      "html": "Then we need additional shelters. We can build simple Cardboard Boxes and connect them to the Camp. That will give every new Cat a place in the Gang."
    }
  ],
  "ecran-story-manual-focus": [
    {
      "classes": [
        "intro-miaou"
      ],
      "speakerClass": null,
      "speakerName": null,
      "html": "With a new recruit in the Gang, Bernardo watches the others return to work. Convincing one Cat has given him an idea."
    },
    {
      "classes": [],
      "speakerClass": "mochi",
      "speakerName": "Mochi",
      "html": "That new Cat really listened to you!"
    },
    {
      "classes": [],
      "speakerClass": "bernard",
      "speakerName": "Bernardo",
      "html": "That is leadership, Mochi. When you find the right words, Cats discover energy they never knew they had."
    },
    {
      "classes": [],
      "speakerClass": "luna",
      "speakerName": "Luna",
      "html": "Conveniently, while you discover somewhere comfortable to sit."
    },
    {
      "classes": [],
      "speakerClass": "bernard",
      "speakerName": "Bernardo",
      "html": "A leader needs to observe the work closely, and the warmest available surface usually offers the best view."
    },
    {
      "classes": [],
      "speakerClass": "mochi",
      "speakerName": "Mochi",
      "html": "Can I encourage the workers too?"
    },
    {
      "classes": [],
      "speakerClass": "luna",
      "speakerName": "Luna",
      "html": "You shout “snacks” every thirty seconds. You already do."
    },
    {
      "classes": [],
      "speakerClass": "bernard",
      "speakerName": "Bernardo",
      "html": "What matters is focusing that encouragement at the right moment. From my post, I can direct that energy toward Work or any active repair, cleanup, construction or upgrade in the Camp."
    },
    {
      "classes": [],
      "speakerClass": "luna",
      "speakerName": "Luna",
      "html": "At last, a management technique involving actual work."
    },
    {
      "classes": [
        "intro-miaou"
      ],
      "speakerClass": null,
      "speakerName": null,
      "html": "Manual Focus is now unlocked. Each click on an active Work phase or Camp task stores 0.8 seconds of ×2 speed, up to 30 seconds. Focusing another action resets the reserve."
    }
  ],
  "ecran-story-4": [
    {
      "classes": [],
      "speakerClass": "bernard",
      "speakerName": "Bernardo",
      "html": "Our first Cardboard Box has modest walls, excellent corners, and a perfectly defensible entrance."
    },
    {
      "classes": [],
      "speakerClass": "mochi",
      "speakerName": "Mochi",
      "html": "And it fits exactly one Cat!"
    },
    {
      "classes": [],
      "speakerClass": "luna",
      "speakerName": "Luna",
      "html": "It fits two if neither one is Mochi after lunch."
    },
    {
      "classes": [],
      "speakerClass": "mochi",
      "speakerName": "Mochi",
      "html": "That is fair."
    },
    {
      "classes": [],
      "speakerClass": "bernard",
      "speakerName": "Bernardo",
      "html": "Every house makes the camp stronger and encourages new Cats to trust us, so this Cardboard Box is only the beginning."
    },
    {
      "classes": [],
      "speakerClass": "luna",
      "speakerName": "Luna",
      "html": "Let us make sure the roof stays on before planning the rest of the neighborhood."
    },
    {
      "classes": [],
      "speakerClass": "bernard",
      "speakerName": "Bernardo",
      "html": "That is sensible. Inspect the roof."
    }
  ],
  "ecran-story-greatest-incrementor-part-1": [
    {
      "classes": [],
      "speakerClass": "bernard",
      "speakerName": "Bernardo",
      "html": "Hold on. The first Cardboard Box cost one plank. Why did this one cost two?"
    },
    {
      "classes": [],
      "speakerClass": "mochi",
      "speakerName": "Mochi",
      "html": "Maybe it grew a second stomach?"
    },
    {
      "classes": [],
      "speakerClass": "luna",
      "speakerName": "Luna",
      "html": "Boxes do not have stomachs, Mochi. And this one does not use twice as much cardboard."
    },
    {
      "classes": [],
      "speakerClass": "incrementorAmused",
      "speakerName": "The Greatest Incrementor",
      "html": "Oh, excellent. You noticed."
    },
    {
      "classes": [],
      "speakerClass": "bernard",
      "speakerName": "Bernardo",
      "html": "Who are you?"
    },
    {
      "classes": [],
      "speakerClass": "incrementor",
      "speakerName": "The Greatest Incrementor",
      "html": "I am the Greatest Incrementor. Every time you repeat a construction, its cost rises. That is the Law."
    },
    {
      "classes": [],
      "speakerClass": "luna",
      "speakerName": "Luna",
      "html": "Why?"
    },
    {
      "classes": [],
      "speakerClass": "incrementorAmused",
      "speakerName": "The Greatest Incrementor",
      "html": "Because I decided it does."
    },
    {
      "classes": [],
      "speakerClass": "bernard",
      "speakerName": "Bernardo",
      "html": "That is not a reason."
    },
    {
      "classes": [],
      "speakerClass": "incrementorAmused",
      "speakerName": "The Greatest Incrementor",
      "html": "It is when you are me."
    },
    {
      "classes": [],
      "speakerClass": "mochi",
      "speakerName": "Mochi",
      "html": "Can you decide that snacks get cheaper?"
    },
    {
      "classes": [],
      "speakerClass": "incrementorLaugh",
      "speakerName": "The Greatest Incrementor",
      "html": "Ha! No."
    },
    {
      "classes": ["intro-miaou"],
      "speakerClass": null,
      "speakerName": null,
      "html": "The white Cat vanishes, still laughing."
    },
    {
      "classes": [],
      "speakerClass": "bernard",
      "speakerName": "Bernardo",
      "html": "We need to learn more about this Incrementor—and what his Law allows him to change."
    },
    {
      "classes": [],
      "speakerClass": "luna",
      "speakerName": "Luna",
      "html": "Agreed. Preferably before our next box costs the entire garden."
    },
    {
      "classes": [],
      "speakerClass": "mochi",
      "speakerName": "Mochi",
      "html": "And before snacks get ideas."
    }
  ],
  "ecran-story-basic-wood": [
    {
      "classes": [
        "intro-miaou"
      ],
      "speakerClass": null,
      "speakerName": null,
      "html": "While exploring the garden, Mochi notices several logs stacked beneath an old shelter."
    },
    {
      "classes": [],
      "speakerClass": "mochi",
      "speakerName": "Mochi",
      "html": "Bernardo! The humans left trees cut into carryable pieces. That was very considerate of them."
    },
    {
      "classes": [],
      "speakerClass": "luna",
      "speakerName": "Luna",
      "html": "I doubt they prepared those logs for us."
    },
    {
      "classes": [],
      "speakerClass": "bernard",
      "speakerName": "Bernardo",
      "html": "Their intention is irrelevant when the material is sitting here unused, and this wood will let us build much stronger houses than cardboard ever could."
    },
    {
      "classes": [],
      "speakerClass": "mochi",
      "speakerName": "Mochi",
      "html": "So we are borrowing it?"
    },
    {
      "classes": [],
      "speakerClass": "luna",
      "speakerName": "Luna",
      "html": "Yes, in the permanent sense."
    },
    {
      "classes": [],
      "speakerClass": "bernard",
      "speakerName": "Bernardo",
      "html": "Gather every usable piece before the humans reconsider their generosity, because cardboard was only the beginning."
    },
    {
      "classes": [],
      "speakerClass": "mochi",
      "speakerName": "Mochi",
      "html": "I like generous humans."
    },
    {
      "classes": [],
      "speakerClass": "luna",
      "speakerName": "Luna",
      "html": "They have no idea how generous they are."
    },
    {
      "classes": [
        "intro-miaou"
      ],
      "speakerClass": null,
      "speakerName": null,
      "html": "Resources have multiple tiers. The Basic Wood Planks recipe is now available, but the current Sawmill cannot process it yet."
    },
    {
      "classes": [
        "intro-miaou"
      ],
      "speakerClass": null,
      "speakerName": null,
      "html": "Upgrade the existing Sawmill to Tier 2 for 5 Cardboard Planks and 2 Pebble Bricks. Other Work buildings will follow the same rule when their Tier 2 recipes are discovered."
    }
  ],
  "ecran-story-5": [
    {
      "classes": [
        "intro-miaou"
      ],
      "speakerClass": null,
      "speakerName": null,
      "html": "Eight kitties gathered in the garden"
    },
    {
      "classes": [],
      "speakerClass": "bernard",
      "speakerName": "Bernardo",
      "html": "Look at us now. There are eight of us, which means we are no longer a handful of Cats sharing a garden but a proper crew."
    },
    {
      "classes": [],
      "speakerClass": "mochi",
      "speakerName": "Mochi",
      "html": "Do proper crews get group snacks?"
    },
    {
      "classes": [],
      "speakerClass": "luna",
      "speakerName": "Luna",
      "html": "He has been waiting six Cats to ask that."
    },
    {
      "classes": [],
      "speakerClass": "bernard",
      "speakerName": "Bernardo",
      "html": "Proper crews earn their snacks by expanding their reach, and we have spent enough time staring at the same fence when there is an entire neighborhood outside it."
    },
    {
      "classes": [],
      "speakerClass": "mochi",
      "speakerName": "Mochi",
      "html": "I sniffed the trash bins yesterday. They seemed very promising."
    },
    {
      "classes": [],
      "speakerClass": "luna",
      "speakerName": "Luna",
      "html": "A glowing professional recommendation."
    },
    {
      "classes": [],
      "speakerClass": "bernard",
      "speakerName": "Bernardo",
      "html": "Then we need one place in Camp to plan routes, read the map and send teams safely."
    },
    {
      "classes": [],
      "speakerClass": "luna",
      "speakerName": "Luna",
      "html": "Also known as rummaging through our own rubbish."
    },
    {
      "classes": [],
      "speakerClass": "bernard",
      "speakerName": "Bernardo",
      "html": "Build an Operations Table in Camp. Exploration begins wherever opportunity smells strongest."
    },
    {
      "classes": [
        "intro-miaou"
      ],
      "speakerClass": null,
      "speakerName": null,
      "html": "<img class=\"titre-icone\" src=\"img/interface/Exploration_Final.png\" alt=\"\" style=\"image-rendering:pixelated;mix-blend-mode:multiply;\"> Operations Table discovered!"
    }
  ],
  "ecran-story-house-evacuation": [
    {
      "classes": [
        "intro-miaou"
      ],
      "speakerClass": null,
      "speakerName": null,
      "html": "From the kitchen window, the mother suddenly notices something moving in the garden"
    },
    {
      "classes": [],
      "speakerClass": "mere",
      "speakerName": "Mother",
      "html": "Wait. What is that?"
    },
    {
      "classes": [],
      "speakerClass": "enfant",
      "speakerName": "Child",
      "html": "Cats. There are cats everywhere."
    },
    {
      "classes": [],
      "speakerClass": "mere",
      "speakerName": "Mother",
      "html": "No, look at the garden. They built shelters. And tables. What are they doing?"
    },
    {
      "classes": [],
      "speakerClass": "enfant",
      "speakerName": "Child",
      "html": "I think they made a camp."
    },
    {
      "classes": [],
      "speakerClass": "mere",
      "speakerName": "Mother",
      "html": "Cats do not build camps. Get away from the window, now."
    },
    {
      "classes": [],
      "speakerClass": "enfant",
      "speakerName": "Child",
      "html": "But they look friendly."
    },
    {
      "classes": [],
      "speakerClass": "mere",
      "speakerName": "Mother",
      "html": "There are fifteen of them, and they are clearly organized. We are leaving before they notice us."
    },
    {
      "classes": [
        "intro-miaou"
      ],
      "speakerClass": null,
      "speakerName": null,
      "html": "The mother grabs the keys with trembling hands. The child takes one last look at the strange camp, then quickly gets into the car."
    },
    {
      "classes": [
        "intro-miaou"
      ],
      "speakerClass": null,
      "speakerName": null,
      "html": "They drive away toward the grandparents' house, leaving the garden, and the empty house, to the cats."
    },
    {
      "classes": [],
      "speakerClass": "mochi",
      "speakerName": "Mochi",
      "html": "They left very quickly. Should we be worried?"
    },
    {
      "classes": [],
      "speakerClass": "luna",
      "speakerName": "Luna",
      "html": "They saw you trying to carry a plank sideways."
    },
    {
      "classes": [],
      "speakerClass": "mochi",
      "speakerName": "Mochi",
      "html": "It almost fit through the gate."
    },
    {
      "classes": [],
      "speakerClass": "bernard",
      "speakerName": "Bernardo",
      "html": "Whatever frightened them, their house is empty now, so we should search it carefully and avoid leaving any obvious pawprints behind."
    },
    {
      "classes": [],
      "speakerClass": "luna",
      "speakerName": "Luna",
      "html": "So, not Mochi's usual method."
    },
    {
      "classes": [],
      "speakerClass": "mochi",
      "speakerName": "Mochi",
      "html": "I can wipe my paws."
    },
    {
      "classes": [],
      "speakerClass": "bernard",
      "speakerName": "Bernardo",
      "html": "That is progress."
    },
    {
      "classes": [
        "intro-miaou"
      ],
      "speakerClass": null,
      "speakerName": null,
      "html": "The house is finally empty. Search the house in the Explorations tab."
    }
  ],
  "ecran-story-left-house": [
    {
      "classes": [
        "intro-miaou"
      ],
      "speakerClass": null,
      "speakerName": null,
      "html": "The neighbors on the left peek through their curtains and see the camp growing in the garden next door."
    },
    {
      "classes": [],
      "speakerClass": "mere",
      "speakerName": "Neighbor",
      "html": "There are more cats every day. They are building shelters now."
    },
    {
      "classes": [],
      "speakerClass": "mere",
      "speakerName": "Neighbor",
      "html": "I am not waiting to see what they build next. Pack the car."
    },
    {
      "classes": [
        "intro-miaou"
      ],
      "speakerClass": null,
      "speakerName": null,
      "html": "They leave in a hurry, leaving their house empty and ready to be explored."
    },
    {
      "classes": [],
      "speakerClass": "mochi",
      "speakerName": "Mochi",
      "html": "Another car is leaving. Are we becoming popular?"
    },
    {
      "classes": [],
      "speakerClass": "luna",
      "speakerName": "Luna",
      "html": "In a very specific, property-emptying way."
    },
    {
      "classes": [],
      "speakerClass": "bernard",
      "speakerName": "Bernardo",
      "html": "Their house is unattended now, so we should respect their decision by making sure nothing useful goes to waste."
    },
    {
      "classes": [],
      "speakerClass": "luna",
      "speakerName": "Luna",
      "html": "Your respect is touching."
    },
    {
      "classes": [],
      "speakerClass": "bernard",
      "speakerName": "Bernardo",
      "html": "Leadership often is."
    }
  ],
  "ecran-story-6a": [
    {
      "classes": [
        "intro-miaou"
      ],
      "speakerClass": null,
      "speakerName": null,
      "html": "The squad returns from the trash run"
    },
    {
      "classes": [],
      "speakerClass": "mochi",
      "speakerName": "Mochi",
      "html": "We found a flat square thing that smells like dust and fingers."
    },
    {
      "classes": [],
      "speakerClass": "luna",
      "speakerName": "Luna",
      "html": "It is a book."
    },
    {
      "classes": [],
      "speakerClass": "mochi",
      "speakerName": "Mochi",
      "html": "A flat square book, then."
    },
    {
      "classes": [],
      "speakerClass": "bernard",
      "speakerName": "Bernardo",
      "html": "It is a school guide full of jobs, work structures, and efficiency charts, which suggests that humans write down obvious ideas and call the result education."
    },
    {
      "classes": [],
      "speakerClass": "luna",
      "speakerName": "Luna",
      "html": "You are already enjoying this far too much."
    },
    {
      "classes": [],
      "speakerClass": "bernard",
      "speakerName": "Bernardo",
      "html": "Give me enough time to study it properly, and I will find any useful system hidden among the human nonsense."
    },
    {
      "classes": [],
      "speakerClass": "mochi",
      "speakerName": "Mochi",
      "html": "Can I help?"
    },
    {
      "classes": [],
      "speakerClass": "bernard",
      "speakerName": "Bernardo",
      "html": "You can guard the book."
    },
    {
      "classes": [
        "intro-miaou"
      ],
      "speakerClass": null,
      "speakerName": null,
      "html": "Mochi immediately sits on it."
    },
    {
      "classes": [],
      "speakerClass": "luna",
      "speakerName": "Luna",
      "html": "He said guard it, not become a bookmark."
    },
    {
      "classes": [],
      "speakerClass": "bernard",
      "speakerName": "Bernardo",
      "html": "Please sit beside the book, Mochi."
    }
  ],
  "ecran-story-6b": [
    {
      "classes": [],
      "speakerClass": "bernard",
      "speakerName": "Bernardo",
      "html": "I finished the guide, and humans apparently have a title for whoever organizes everyone else: Chief Executive Officer."
    },
    {
      "classes": [
        "intro-miaou"
      ],
      "speakerClass": null,
      "speakerName": null,
      "html": "Bernardo carefully sets aside the page about the CEO."
    },
    {
      "classes": [],
      "speakerClass": "luna",
      "speakerName": "Luna",
      "html": "You read an entire book and kept the page with the biggest title."
    },
    {
      "classes": [],
      "speakerClass": "bernard",
      "speakerName": "Bernardo",
      "html": "The title is incidental, or at least it is mostly incidental."
    },
    {
      "classes": [],
      "speakerClass": "mochi",
      "speakerName": "Mochi",
      "html": "Does CEO mean Chief Eating Officer?"
    },
    {
      "classes": [],
      "speakerClass": "luna",
      "speakerName": "Luna",
      "html": "In your case, yes."
    },
    {
      "classes": [],
      "speakerClass": "bernard",
      "speakerName": "Bernardo",
      "html": "The useful lesson is that every Cat should have a job suited to their strengths, which means we need a proper Job Center where everyone can train."
    },
    {
      "classes": [],
      "speakerClass": "mochi",
      "speakerName": "Mochi",
      "html": "Can Chief Eating Officer be a real job?"
    },
    {
      "classes": [],
      "speakerClass": "bernard",
      "speakerName": "Bernardo",
      "html": "We can review applications after the Job Center is built."
    },
    {
      "classes": [],
      "speakerClass": "luna",
      "speakerName": "Luna",
      "html": "He means no."
    }
  ],
  "ecran-story-salad": [
    {
      "classes": [
        "intro-miaou"
      ],
      "speakerClass": null,
      "speakerName": null,
      "html": "The Catchen fills with the scent of fresh Catnip Salad."
    },
    {
      "classes": [],
      "speakerClass": "bernard",
      "speakerName": "Bernardo",
      "html": "That smells like actual prepared food. Did someone really make this?"
    },
    {
      "classes": [],
      "speakerClass": null,
      "speakerName": null,
      "html": "<span id=\"story-salad-cook-tag\" class=\"intro-perso cuisiner\"></span> Freshly made. I even resisted tasting it first."
    },
    {
      "classes": [],
      "speakerClass": "mochi",
      "speakerName": "Mochi",
      "html": "Can we establish a quality-control position? I volunteer."
    },
    {
      "classes": [],
      "speakerClass": "luna",
      "speakerName": "Luna",
      "html": "You have volunteered for every food-related position."
    },
    {
      "classes": [],
      "speakerClass": "mochi",
      "speakerName": "Mochi",
      "html": "Consistency is a strength."
    },
    {
      "classes": [],
      "speakerClass": "bernard",
      "speakerName": "Bernardo",
      "html": "The cook should have the first taste, and then everyone can eat because good food makes stronger Cats and stronger Cats make a stronger gang."
    },
    {
      "classes": [],
      "speakerClass": "luna",
      "speakerName": "Luna",
      "html": "It may also produce a quieter Mochi. Briefly."
    },
    {
      "classes": [],
      "speakerClass": "mochi",
      "speakerName": "Mochi",
      "html": "I can eat quietly."
    }
  ],
  "ecran-story-seminar": [
    {
      "classes": [
        "intro-miaou"
      ],
      "speakerClass": null,
      "speakerName": null,
      "html": "Bernardo closes the booklet and stares at the ceiling for a long moment."
    },
    {
      "classes": [],
      "speakerClass": "bernard",
      "speakerName": "Bernardo",
      "html": "According to this booklet, a seminar can turn ordinary colleagues into an aligned and highly effective team."
    },
    {
      "classes": [],
      "speakerClass": "luna",
      "speakerName": "Luna",
      "html": "How?"
    },
    {
      "classes": [],
      "speakerClass": "bernard",
      "speakerName": "Bernardo",
      "html": "It recommends shared exercises, motivational speeches, and something called structured reflection."
    },
    {
      "classes": [],
      "speakerClass": "mochi",
      "speakerName": "Mochi",
      "html": "Do we get matching scarves?"
    },
    {
      "classes": [],
      "speakerClass": "luna",
      "speakerName": "Luna",
      "html": "He heard “team” and immediately joined a parade."
    },
    {
      "classes": [],
      "speakerClass": "bernard",
      "speakerName": "Bernardo",
      "html": "The language is ridiculous, but the principle of helping every Cat sharpen their skills is sound, so I think we should build a Training Center."
    },
    {
      "classes": [],
      "speakerClass": "luna",
      "speakerName": "Luna",
      "html": "Fine, but if you schedule trust falls, I am leaving."
    },
    {
      "classes": [],
      "speakerClass": "mochi",
      "speakerName": "Mochi",
      "html": "I will catch you!"
    },
    {
      "classes": [],
      "speakerClass": "luna",
      "speakerName": "Luna",
      "html": "That is exactly why I am leaving."
    },
    {
      "classes": [],
      "speakerClass": "bernard",
      "speakerName": "Bernardo",
      "html": "We will begin with the Training Center and discuss the exercises later."
    }
  ],
  "ecran-story-explorator": [
    {
      "classes": [
        "intro-miaou"
      ],
      "speakerClass": null,
      "speakerName": null,
      "html": "After a long training session, the new Explorator steps out of the Job Center with a map tucked carefully under one paw."
    },
    {
      "classes": [],
      "speakerClass": "explorator",
      "speakerClasses": ["story-explorator-speaker"],
      "speakerName": "Explorator",
      "html": "I can read tracks, mark safe routes, and find my way home without following my own tail."
    },
    {
      "classes": [],
      "speakerClass": "bernard",
      "speakerName": "Bernardo",
      "html": "You have done very well, and as our first Explorator your paws can finally take the gang beyond the fence safely."
    },
    {
      "classes": [],
      "speakerClass": "explorator",
      "speakerClasses": ["story-explorator-speaker"],
      "speakerName": "Explorator",
      "html": "Where do we start?"
    },
    {
      "classes": [],
      "speakerClass": "bernard",
      "speakerName": "Bernardo",
      "html": "We will begin close to home because a good leader does not risk the gang merely for a dramatic entrance."
    },
    {
      "classes": [],
      "speakerClass": "explorator",
      "speakerClasses": ["story-explorator-speaker"],
      "speakerName": "Explorator",
      "html": "The trash bins?"
    },
    {
      "classes": [],
      "speakerClass": "bernard",
      "speakerName": "Bernardo",
      "html": "I prefer the term recovered assets, but yes, we will start with the trash bins."
    },
    {
      "id": "story-explorator-unlock-copy",
      "classes": ["intro-miaou"],
      "speakerClass": null,
      "speakerName": null,
      "html": "This cat is now an Explorator. You can explore the neighborhood using the map in the Explorations tab."
    }
  ],
  "ecran-story-bird": [
    {
      "classes": [
        "intro-miaou"
      ],
      "speakerClass": null,
      "speakerName": null,
      "html": "A noise comes from the tree at the back of the garden."
    },
    {
      "classes": [],
      "speakerClass": "bernard",
      "speakerName": "Bernardo",
      "html": "Everyone hold still."
    },
    {
      "classes": [],
      "speakerClass": "mochi",
      "speakerName": "Mochi",
      "html": "Is it dangerous?"
    },
    {
      "classes": [],
      "speakerClass": "luna",
      "speakerName": "Luna",
      "html": "Worse. It has feathers."
    },
    {
      "classes": [],
      "speakerClass": "bernard",
      "speakerName": "Bernardo",
      "html": "There is a bird beside the tree, and I need both of you to stay quiet while I approach it."
    },
    {
      "classes": [],
      "speakerClass": "mochi",
      "speakerName": "Mochi",
      "html": "Do you want me to distract it?"
    },
    {
      "classes": [],
      "speakerClass": "bernard",
      "speakerName": "Bernardo",
      "html": "Your natural volume may finally be useful, but not yet."
    },
    {
      "classes": [],
      "speakerClass": "luna",
      "speakerName": "Luna",
      "html": "Please continue explaining stealth out loud."
    },
    {
      "classes": [],
      "speakerClass": "bernard",
      "speakerName": "Bernardo",
      "html": "I am coordinating the hunt."
    },
    {
      "classes": [],
      "speakerClass": "mochi",
      "speakerName": "Mochi",
      "html": "He is very good at coordinating."
    },
    {
      "classes": [],
      "speakerClass": "luna",
      "speakerName": "Luna",
      "html": "The bird looks deeply coordinated."
    },
    {
      "classes": [],
      "speakerClass": "bernard",
      "speakerName": "Bernardo",
      "html": "Both of you, quiet. Stay low, keep your tails still, and watch the target."
    },
    {
      "classes": [
        "intro-miaou"
      ],
      "speakerClass": null,
      "speakerName": null,
      "html": "A leaf falls."
    },
    {
      "classes": [],
      "speakerClass": "mochi",
      "speakerName": "Mochi",
      "html": "Was that the signal?"
    },
    {
      "classes": [],
      "speakerClass": "bernard",
      "speakerName": "Bernardo",
      "html": "It is now. I'M GOING IN."
    }
  ]
});

  const DIALOGUE_CATALOG = CatInc.data.dialogueCatalog || Object.freeze({
    characters: LEGACY_CHARACTERS,
    scenes: LEGACY_SCENES.map(function(scene) {
      return Object.freeze({...scene, beats: LEGACY_SCENE_BEATS[scene.id] || []});
    })
  });
  const CHARACTERS = DIALOGUE_CATALOG.characters;
  const SCENES = DIALOGUE_CATALOG.scenes;
  const SCENE_BEATS = Object.freeze(SCENES.reduce(function(index, scene) {
    index[scene.id] = scene.beats || [];
    return index;
  }, {}));


function characterFromLine(line) {
    const label = line && line.querySelector(".intro-perso");
    if (!label) return null;
    if (label.dataset.dialoguePortrait && CHARACTERS[label.dataset.dialoguePortrait]) {
      return CHARACTERS[label.dataset.dialoguePortrait];
    }
    return Object.keys(CHARACTERS).reduce(function(found, className) {
      return found || (label.classList.contains(className) ? CHARACTERS[className] : null);
    }, null);
  }

  function createPortrait(character) {
    const portrait = document.createElement("span");
    portrait.className = "story-beat-portrait";
    portrait.setAttribute("aria-hidden", "true");
    if (character.portrait) {
      const image = document.createElement("img");
      image.src = character.portrait;
      image.alt = "";
      portrait.appendChild(image);
    } else {
      portrait.classList.add("story-beat-portrait-initials");
      portrait.textContent = character.initials || character.name.slice(0, 1);
    }
    return portrait;
  }

  function hydrateLine(line) {
    if (!line || line.dataset.dialogueBeat === "true") return;
    const character = characterFromLine(line);
    const speakerLabel = line.querySelector(".intro-perso");
    const speakerCharacter = speakerLabel && CHARACTERS[speakerLabel.dataset.dialogueSpeaker]
      ? CHARACTERS[speakerLabel.dataset.dialogueSpeaker]
      : character;
    const content = document.createElement("span");
    content.className = "story-beat-copy";
    Array.from(line.childNodes).forEach(function(node) {
      if (node !== speakerLabel) content.appendChild(node);
    });
    line.textContent = "";
    line.dataset.dialogueBeat = "true";
    line.classList.add("story-beat");
    if (!character) {
      line.classList.add("story-beat-narration");
      line.appendChild(content);
      return;
    }
    line.classList.add("story-beat-" + character.side);
    const bubble = document.createElement("span");
    bubble.className = "story-beat-bubble";
    const speaker = document.createElement("strong");
    speaker.className = ["story-beat-speaker"].concat(
      speakerLabel ? Array.from(speakerLabel.classList).filter(function(className) { return className !== "intro-perso"; }) : []
    ).join(" ");
    speaker.textContent = speakerCharacter.name;
    bubble.appendChild(speaker);
    bubble.appendChild(content);
    const portrait = createPortrait(character);
    if (character.side === "left") {
      line.appendChild(portrait);
      line.appendChild(bubble);
    } else {
      line.appendChild(bubble);
      line.appendChild(portrait);
    }
  }

  function renderSceneSource(modal, dialogue) {
    const beats = SCENE_BEATS[modal.id];
    if (!beats || dialogue.dataset.dialogueSourceRendered === "true") return;
    dialogue.textContent = "";
    beats.forEach(function(beat) {
      const line = document.createElement("p");
      line.className = ["intro-ligne"].concat(beat.classes || []).join(" ");
      if (beat.id) line.id = beat.id;
      if (beat.speakerClass) {
        const speaker = document.createElement("span");
        speaker.className = ["intro-perso", beat.speakerClass].concat(beat.speakerClasses || []).join(" ");
        speaker.textContent = beat.speakerName || beat.speakerClass;
        speaker.dataset.dialogueSpeaker = beat.speakerClass;
        speaker.dataset.dialoguePortrait = beat.portraitClass || beat.speakerClass;
        line.appendChild(speaker);
        line.appendChild(document.createTextNode(" "));
      }
      const template = document.createElement("template");
      template.innerHTML = beat.html;
      line.appendChild(template.content);
      dialogue.appendChild(line);
    });
    dialogue.dataset.dialogueSourceRendered = "true";
  }

  function hydrateModal(modal) {
    if (!modal || modal.dataset.dialogueHydrated === "true") return;
    const dialogue = modal.querySelector(".intro-dialogue");
    if (!dialogue) return;
    const scene = SCENES.find(function(item) { return item.id === modal.id; });
    const closeButton = modal.querySelector(".bouton-intro");
    if (scene && closeButton && scene.closeButton && scene.closeButton.label) {
      closeButton.textContent = scene.closeButton.label;
    }
    renderSceneSource(modal, dialogue);
    dialogue.classList.add("story-conversation");
    dialogue.setAttribute("aria-live", "polite");
    dialogue.querySelectorAll(".intro-ligne").forEach(hydrateLine);
    const hint = document.createElement("span");
    hint.className = "story-continue-hint";
    hint.setAttribute("aria-hidden", "true");
    hint.textContent = "Click to continue";
    dialogue.insertAdjacentElement("afterend", hint);
    modal.dataset.dialogueHydrated = "true";
  }

  function updateSequentialModal(modal, index) {
    if (!modal) return false;
    const lines = Array.from(modal.querySelectorAll(".intro-dialogue .intro-ligne"));
    if (!lines.length) return false;
    const current = Math.max(0, Math.min(lines.length - 1, Number(index) || 0));
    lines.forEach(function(line, lineIndex) {
      line.hidden = lineIndex > current;
      line.classList.toggle("story-beat-current", lineIndex === current);
    });
    modal.dataset.dialogueIndex = String(current);
    modal.dataset.dialogueComplete = current === lines.length - 1 ? "true" : "false";
    const action = modal.querySelector(".bouton-intro");
    if (action) action.hidden = current < lines.length - 1;
    const hint = modal.querySelector(".story-continue-hint");
    if (hint) hint.hidden = current >= lines.length - 1;
    const dialogue = modal.querySelector(".intro-dialogue");
    if (dialogue) {
      dialogue.scrollTop = dialogue.scrollHeight;
      if (typeof requestAnimationFrame === "function") {
        requestAnimationFrame(function() {
          dialogue.scrollTop = dialogue.scrollHeight;
        });
      }
    }
    return true;
  }

  function resetModal(modal) {
    hydrateModal(modal);
    return updateSequentialModal(modal, 0);
  }

  function advanceModal(modal) {
    if (!modal || modal.dataset.dialogueHydrated !== "true") return false;
    const lines = modal.querySelectorAll(".intro-dialogue .intro-ligne");
    const current = Math.max(0, Number(modal.dataset.dialogueIndex) || 0);
    if (!lines.length || current >= lines.length - 1) return false;
    return updateSequentialModal(modal, current + 1);
  }

  CatInc.data.dialogues = Object.freeze({
    characters: CHARACTERS,
    scenes: SCENES,
    beats: SCENE_BEATS,
    hydrateModal: hydrateModal,
    resetModal: resetModal,
    advanceModal: advanceModal
  });
})(typeof window !== "undefined" ? window : globalThis);
