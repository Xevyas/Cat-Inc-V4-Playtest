(function(root) {
  "use strict";
  const CatInc = root.CatInc = root.CatInc || {};
  CatInc.data = CatInc.data || {};
  function deepFreeze(value) {
    if (!value || typeof value !== "object" || Object.isFrozen(value)) return value;
    Object.keys(value).forEach(function(key) { deepFreeze(value[key]); });
    return Object.freeze(value);
  }
  CatInc.data.dialogueCatalog = deepFreeze({
  "schemaVersion": 1,
  "characters": {
    "bernard": {
      "id": "bernardo",
      "name": "Bernardo",
      "side": "left",
      "portrait": "img/Cat faces/Bernardo.png",
      "speakerKey": "bernard"
    },
    "mochi": {
      "id": "mochi",
      "name": "Mochi",
      "side": "right",
      "portrait": "img/Cat faces/Mochi_Final.png",
      "speakerKey": "mochi"
    },
    "luna": {
      "id": "luna",
      "name": "Luna",
      "side": "right",
      "portrait": "img/Cat faces/Luna_Final.png",
      "speakerKey": "luna"
    },
    "incrementor": {
      "id": "incrementor",
      "name": "The Greatest Incrementor",
      "side": "right",
      "portrait": "img/Cat faces/the-greatest-incrementor.png",
      "speakerKey": "incrementor"
    },
    "incrementorAmused": {
      "id": "incrementor",
      "name": "The Greatest Incrementor",
      "side": "right",
      "portrait": "img/Cat faces/the-greatest-incrementor-amused.png",
      "speakerKey": "incrementorAmused"
    },
    "incrementorLaugh": {
      "id": "incrementor",
      "name": "The Greatest Incrementor",
      "side": "right",
      "portrait": "img/Cat faces/the-greatest-incrementor-laugh.png",
      "speakerKey": "incrementorLaugh"
    },
    "explorator": {
      "id": "explorator",
      "name": "Explorator",
      "side": "right",
      "initials": "E",
      "speakerKey": "explorator"
    },
    "enfant": {
      "id": "kid",
      "name": "Kid",
      "side": "right",
      "initials": "K",
      "speakerKey": "enfant"
    },
    "maman": {
      "id": "mother",
      "name": "Mom",
      "side": "right",
      "initials": "M",
      "speakerKey": "maman"
    },
    "mere": {
      "id": "mother",
      "name": "Mother",
      "side": "right",
      "initials": "M",
      "speakerKey": "mere"
    },
    "bernardPresetAngry": {
      "id": "bernardo",
      "name": "Bernardo · Angry",
      "side": "left",
      "portrait": "img/Cat faces/Presets/cat-faces-bernardo/angry.png",
      "speakerKey": "bernard",
      "presetId": "angry",
      "presetRevision": 1
    },
    "bernardPresetHappy": {
      "id": "bernardo",
      "name": "Bernardo · Happy",
      "side": "left",
      "portrait": "img/Cat faces/Presets/cat-faces-bernardo/happy.png",
      "speakerKey": "bernard",
      "presetId": "happy",
      "presetRevision": 1
    },
    "mochiPresetChewingCatnip": {
      "id": "mochi",
      "name": "Mochi · Chewing catnip",
      "side": "right",
      "portrait": "img/Cat faces/Presets/cat-faces-mochi/chewing-catnip.png",
      "speakerKey": "mochi",
      "presetId": "chewing-catnip",
      "presetRevision": 1
    },
    "mochiPresetSurprised": {
      "id": "mochi",
      "name": "Mochi · Surprised",
      "side": "right",
      "portrait": "img/Cat faces/Presets/cat-faces-mochi/surprised.png",
      "speakerKey": "mochi",
      "presetId": "surprised",
      "presetRevision": 1
    },
    "mochiPresetAngry": {
      "id": "mochi",
      "name": "Mochi · Angry",
      "side": "right",
      "portrait": "img/Cat faces/Presets/cat-faces-mochi/angry.png",
      "speakerKey": "mochi",
      "presetId": "angry",
      "presetRevision": 1
    },
    "lunaPresetAmused": {
      "id": "luna",
      "name": "Luna · Amused",
      "side": "right",
      "portrait": "img/Cat faces/Presets/cat-faces-luna/amused.png",
      "speakerKey": "luna",
      "presetId": "amused",
      "presetRevision": 1
    },
    "incrementorPresetAmusedMockery": {
      "id": "incrementor",
      "name": "The Greatest Incrementor · Amused / Mockery",
      "side": "right",
      "portrait": "img/Cat faces/Presets/cat-faces-the-greatest-incrementor/amused-mockery.png",
      "speakerKey": "incrementor",
      "presetId": "amused-mockery",
      "presetRevision": 1
    },
    "incrementorPresetLaughExit": {
      "id": "incrementor",
      "name": "The Greatest Incrementor · Laugh / Exit",
      "side": "right",
      "portrait": "img/Cat faces/Presets/cat-faces-the-greatest-incrementor/laugh-exit.png",
      "speakerKey": "incrementor",
      "presetId": "laugh-exit",
      "presetRevision": 1
    }
  },
  "scenes": [
    {
      "id": "ecran-intro",
      "name": "Introduction",
      "flag": "introVue",
      "trigger": "New game, before the introduction has been completed.",
      "closeButton": {
        "label": "Start the adventure 🐾",
        "handler": "",
        "actionSummary": "Close the introduction, mark it viewed and start the first Cat capture."
      },
      "beats": [
        {
          "classes": [],
          "speakerClass": "bernard",
          "speakerName": "Bernardo",
          "portraitClass": "bernard",
          "html": "\u003cem\u003eMeooooww\u003c/em\u003e"
        },
        {
          "classes": [],
          "speakerClass": "enfant",
          "speakerName": "Kid",
          "portraitClass": "enfant",
          "html": "Mom, that cat has been watching us for ages. Can we keep him?"
        },
        {
          "classes": [],
          "speakerClass": "maman",
          "speakerName": "Mom",
          "portraitClass": "maman",
          "html": "We barely have time for ourselves, let alone a cat. Come help with the groceries."
        },
        {
          "classes": [],
          "speakerClass": "enfant",
          "speakerName": "Kid",
          "portraitClass": "enfant",
          "html": "Please, Mom, just look at him and tell me he does not need a home."
        },
        {
          "classes": [],
          "speakerClass": "maman",
          "speakerName": "Mom",
          "portraitClass": "maman",
          "html": "Fine, but you are feeding him."
        },
        {
          "classes": [
            "intro-miaou"
          ],
          "speakerClass": "bernard",
          "speakerName": "Bernardo",
          "portraitClass": "bernardPresetHappy",
          "html": "\u003cem\u003eMeow.\u003c/em\u003e \u003cspan class=\"intro-traduit\"\u003e(Great, let's put an act so he'll think I didn't want to be caught)\u003c/span\u003e"
        }
      ],
      "asset": {
        "type": "icon",
        "src": "img/Cat faces/Bernardo.png",
        "alt": "Bernardo"
      }
    },
    {
      "id": "ecran-story-1",
      "name": "Bernardo's plan begins",
      "flag": "story1Vue",
      "trigger": "The first Cat has joined the gang.",
      "closeButton": {
        "label": "Let's go get him!",
        "handler": "fermerStoryPrologue('ecran-story-1')",
        "actionSummary": "Close the dialogue and reveal the next prologue Cat target."
      },
      "beats": [
        {
          "classes": [],
          "speakerClass": "enfant",
          "speakerName": "Kid",
          "portraitClass": "enfant",
          "html": "Got you! Welcome home, little guy, and enjoy having this whole garden to yourself."
        },
        {
          "classes": [
            "intro-miaou"
          ],
          "speakerClass": "bernard",
          "speakerName": "Bernardo",
          "portraitClass": "bernard",
          "html": "\u003cem\u003eMeow.\u003c/em\u003e \u003cspan class=\"intro-traduit\"\u003e(We'll have shelter, plenty of space, and a helpful human, exactly as planned.)\u003c/span\u003e"
        },
        {
          "classes": [],
          "speakerClass": "enfant",
          "speakerName": "Kid",
          "portraitClass": "enfant",
          "html": "Wait, there is another cat down the street, and he looks lost!"
        },
        {
          "classes": [
            "intro-miaou"
          ],
          "speakerClass": "bernard",
          "speakerName": "Bernardo",
          "portraitClass": "bernard",
          "html": "\u003cem\u003eMeow, meow.\u003c/em\u003e \u003cspan class=\"intro-traduit\"\u003e(You are right on time, Mochi, but try to look helpless rather than delighted.)\u003c/span\u003e"
        }
      ],
      "asset": {
        "type": "icon",
        "src": "img/Cat faces/Bernardo.png",
        "alt": "Bernardo"
      }
    },
    {
      "id": "ecran-story-2",
      "name": "Mochi joins the gang",
      "flag": "story2Vue",
      "trigger": "The second Cat has joined the gang.",
      "closeButton": {
        "label": "One more can't hurt!",
        "handler": "fermerStoryPrologue('ecran-story-2')",
        "actionSummary": "Close the dialogue and reveal the next prologue Cat target."
      },
      "beats": [
        {
          "classes": [],
          "speakerClass": "enfant",
          "speakerName": "Kid",
          "portraitClass": "enfant",
          "html": "I got him! We have two cats now, this is the best day ever !"
        },
        {
          "classes": [
            "intro-miaou"
          ],
          "speakerClass": "mochi",
          "speakerName": "Mochi",
          "portraitClass": "mochi",
          "html": "\u003cem\u003eMeow!\u003c/em\u003e \u003cspan class=\"intro-traduit\"\u003e(I knew your plan would work, Bernardo!)\u003c/span\u003e"
        },
        {
          "classes": [
            "intro-miaou"
          ],
          "speakerClass": "bernard",
          "speakerName": "Bernardo",
          "portraitClass": "bernard",
          "html": "\u003cem\u003eMeow.\u003c/em\u003e \u003cspan class=\"intro-traduit\"\u003e(You played your part well, although the butterfly detour was unexpected.)\u003c/span\u003e"
        },
        {
          "classes": [
            "intro-miaou"
          ],
          "speakerClass": "mochi",
          "speakerName": "Mochi",
          "portraitClass": "mochiPresetAngry",
          "html": "\u003cem\u003eMeow.\u003c/em\u003e \u003cspan class=\"intro-traduit\"\u003e(I couldn't resist hunting that butterfly...)\u003c/span\u003e"
        },
        {
          "classes": [],
          "speakerClass": "enfant",
          "speakerName": "Kid",
          "portraitClass": "enfant",
          "html": "I saw another cat near the park earlier, and maybe she needs a home too."
        },
        {
          "classes": [
            "intro-miaou"
          ],
          "speakerClass": "mochi",
          "speakerName": "Mochi",
          "portraitClass": "mochiPresetSurprised",
          "html": "\u003cem\u003eMeow?\u003c/em\u003e \u003cspan class=\"intro-traduit\"\u003e(Luna too? That means the whole gang will be together!)\u003c/span\u003e"
        },
        {
          "classes": [
            "intro-miaou"
          ],
          "speakerClass": "bernard",
          "speakerName": "Bernardo",
          "portraitClass": "bernardPresetHappy",
          "html": "\u003cem\u003eMeow.\u003c/em\u003e \u003cspan class=\"intro-traduit\"\u003e(Exactly, and after one more rescue, we can finally begin.)\u003c/span\u003e"
        }
      ],
      "asset": {
        "type": "icon",
        "src": "img/Cat faces/Mochi_Final.png",
        "alt": "Portrait of Mochi."
      }
    },
    {
      "id": "ecran-story-3",
      "name": "The adventure begins",
      "flag": "story3Vue",
      "trigger": "The third Cat has joined the gang.",
      "closeButton": {
        "label": "Time to work!",
        "handler": "fermerStoryAdventure()",
        "actionSummary": "Close the prologue, unlock the Camp transition and open the Camp introduction."
      },
      "beats": [
        {
          "classes": [],
          "speakerClass": "luna",
          "speakerName": "Luna",
          "portraitClass": "luna",
          "html": "\u003cem\u003eMiaow ! \u003c/em\u003e (Ouch, that kid was brutal !)"
        },
        {
          "classes": [],
          "speakerClass": "enfant",
          "speakerName": "Kid",
          "portraitClass": "enfant",
          "html": "Catching three cats in one day has worn me out, I am going inside for a break. You will be fine out here!"
        },
        {
          "classes": [
            "intro-miaou"
          ],
          "speakerClass": null,
          "speakerName": null,
          "portraitClass": null,
          "html": "The door closes behind the Kid."
        },
        {
          "classes": [],
          "speakerClass": "mochi",
          "speakerName": "Mochi",
          "portraitClass": "mochi",
          "html": "It worked! Bernardo said we would all end up here."
        },
        {
          "classes": [],
          "speakerClass": "luna",
          "speakerName": "Luna",
          "portraitClass": "luna",
          "html": "He also said the human would be easy to train, and I dislike that he was right."
        },
        {
          "classes": [],
          "speakerClass": "bernard",
          "speakerName": "Bernardo",
          "portraitClass": "bernard",
          "html": "This garden is safe, sheltered, and full of useful things. We can turn it into a real home for every Cat who needs one."
        },
        {
          "classes": [],
          "speakerClass": "luna",
          "speakerName": "Luna",
          "portraitClass": "luna",
          "html": "It is a good plan, although it will also take a great deal of work."
        },
        {
          "classes": [],
          "speakerClass": "mochi",
          "speakerName": "Mochi",
          "portraitClass": "mochi",
          "html": "Then tell us where to start."
        },
        {
          "classes": [],
          "speakerClass": "bernard",
          "speakerName": "Bernardo",
          "portraitClass": "bernard",
          "html": "First, we inspect our new camp, so get on your paws, both of you."
        }
      ],
      "asset": {
        "type": "icon",
        "src": "img/Story scenes/Story 3.png",
        "alt": "Bernardo addresses two other kittens in the garden."
      }
    },
    {
      "id": "ecran-story-camp-intro",
      "name": "A garden to rebuild",
      "flag": "storyCampIntroVue",
      "trigger": "The three-Cat prologue is complete and the starting Camp has not been inspected yet.",
      "closeButton": {
        "label": "Inspect the Sawmill",
        "handler": "terminerIntroCamp()",
        "actionSummary": "Mark the Camp introduction complete, open Camp and focus the Sawmill repair."
      },
      "beats": [
        {
          "classes": [],
          "speakerClass": "mochi",
          "speakerName": "Mochi",
          "portraitClass": "mochi",
          "html": "This garden looked much tidier from the street."
        },
        {
          "classes": [],
          "speakerClass": "luna",
          "speakerName": "Luna",
          "portraitClass": "luna",
          "html": "It also looked smaller, and we clearly have plenty to repair. \nThat old machine is a sawmill, which humans use to cut wood into planks."
        },
        {
          "classes": [],
          "speakerClass": "bernard",
          "speakerName": "Bernardo",
          "portraitClass": "bernard",
          "html": "Then it must be our first priority, it will probably help us buidling things. We just need to find what..."
        },
        {
          "classes": [],
          "speakerClass": "mochi",
          "speakerName": "Mochi",
          "portraitClass": "mochi",
          "html": "Can it make beds?"
        },
        {
          "classes": [],
          "speakerClass": "luna",
          "speakerName": "Luna",
          "portraitClass": "luna",
          "html": "It only makes planks, so someone still has to build the bed."
        },
        {
          "classes": [],
          "speakerClass": "bernard",
          "speakerName": "Bernardo",
          "portraitClass": "bernard",
          "html": "Mochi, help Luna inspect the damage while I decide what we should build first."
        },
        {
          "classes": [],
          "speakerClass": "mochi",
          "speakerName": "Mochi",
          "portraitClass": "mochi",
          "html": "You already have a list, don't you?"
        },
        {
          "classes": [],
          "speakerClass": "bernard",
          "speakerName": "Bernardo",
          "portraitClass": "bernardPresetHappy",
          "html": "Of course I have, I just need to find where I put it..."
        }
      ],
      "asset": {
        "type": "icon",
        "src": "img/Story scenes/Story 3.png",
        "alt": "Bernardo, Mochi and Luna inspect their cluttered new garden."
      }
    },
    {
      "id": "ecran-story-camp-full",
      "name": "Room for one more",
      "flag": "storyCampFullVue",
      "trigger": "The first attempt to welcome a waiting visitor while housing is full.",
      "closeButton": {
        "label": "Build more shelter",
        "handler": "fermerModal('ecran-story-camp-full')",
        "actionSummary": "Close the dialogue and return to the current screen."
      },
      "beats": [
        {
          "classes": [],
          "speakerClass": "mochi",
          "speakerName": "Mochi",
          "portraitClass": "mochi",
          "html": "They made it! Why are they still waiting outside?"
        },
        {
          "classes": [],
          "speakerClass": "luna",
          "speakerName": "Luna",
          "portraitClass": "luna",
          "html": "Every dry spot under the porch is taken. We have nowhere safe for them to sleep."
        },
        {
          "classes": [],
          "speakerClass": "mochi",
          "speakerName": "Mochi",
          "portraitClass": "mochiPresetSurprised",
          "html": "We cannot leave them out there."
        },
        {
          "classes": [],
          "speakerClass": "bernard",
          "speakerName": "Bernardo",
          "portraitClass": "bernardPresetHappy",
          "html": "I have an idea! I mean... I found my list of things to build. We need shelters, and cardboard is the perfect material for advanced construction. I present to you... BOXES!"
        }
      ],
      "asset": {
        "type": "icon",
        "src": "img/Buildings/Cardboard Box_Final.png",
        "alt": "box"
      }
    },
    {
      "id": "ecran-story-manual-focus",
      "name": "A Little Encouragement",
      "flag": "storyManualFocusVue",
      "trigger": "The first recruitment after the three-Cat prologue, or a loaded save with at least four Cats.",
      "closeButton": {
        "label": "Try Manual Focus",
        "handler": "ouvrirManualFocusDepuisStory()",
        "actionSummary": "Open Work and focus an active recipe so Manual Focus can be tried immediately."
      },
      "beats": [
        {
          "classes": [
            "intro-miaou"
          ],
          "speakerClass": null,
          "speakerName": null,
          "portraitClass": null,
          "html": "The new recruit joins the others in the garden. Bernardo watches from his favorite spot."
        },
        {
          "classes": [],
          "speakerClass": "mochi",
          "speakerName": "Mochi",
          "portraitClass": "mochi",
          "html": "Our new companion really listened to you, Bernardo!"
        },
        {
          "classes": [],
          "speakerClass": "bernard",
          "speakerName": "Bernardo",
          "portraitClass": "bernardPresetHappy",
          "html": "The right words can give a Cat the push they need. That is part of good leadership."
        },
        {
          "classes": [],
          "speakerClass": "luna",
          "speakerName": "Luna",
          "portraitClass": "lunaPresetAmused",
          "html": "Especially when the leader finds a warm place to do it from."
        },
        {
          "classes": [],
          "speakerClass": "bernard",
          "speakerName": "Bernardo",
          "portraitClass": "bernard",
          "html": "A good view helps me see who needs encouragement."
        },
        {
          "classes": [],
          "speakerClass": "mochi",
          "speakerName": "Mochi",
          "portraitClass": "mochi",
          "html": "Can I encourage everyone too?"
        },
        {
          "classes": [],
          "speakerClass": "luna",
          "speakerName": "Luna",
          "portraitClass": "luna",
          "html": "You already yell about snacks every thirty seconds."
        },
        {
          "classes": [],
          "speakerClass": "bernard",
          "speakerName": "Bernardo",
          "portraitClass": "bernard",
          "html": "Timing matters. I can only encourage one Cat at a time, but they'll definitely be more productive."
        },
        {
          "classes": [],
          "speakerClass": "luna",
          "speakerName": "Luna",
          "portraitClass": "lunaPresetAmused",
          "html": "At least this plan makes your talking useful."
        },
        {
          "classes": [
            "intro-miaou"
          ],
          "speakerClass": null,
          "speakerName": null,
          "portraitClass": null,
          "html": "Manual Focus is now unlocked. Each click on an active Work phase or Camp task stores 0.8 seconds of ×2 speed, up to 30 seconds. Focusing another action resets the reserve."
        }
      ],
      "asset": {
        "type": "icon",
        "src": "img/Cat faces/Bernardo.png",
        "alt": "Portrait of Bernardo preparing to encourage the workers."
      }
    },
    {
      "id": "ecran-story-4",
      "name": "Our first creation",
      "flag": "story4Vue",
      "trigger": "The first Cardboard Box is completed. The current runtime records the story and uses a quick Camp dialogue instead of opening it automatically.",
      "closeButton": {
        "label": "Onwards!",
        "handler": "fermerModal('ecran-story-4')",
        "actionSummary": "Close the dialogue and return to the current screen."
      },
      "beats": [
        {
          "classes": [],
          "speakerClass": "bernard",
          "speakerName": "Bernardo",
          "portraitClass": "bernardPresetHappy",
          "html": "Our first invention is ready. It may be small, but it has solid walls, good corners, and a proper entrance."
        },
        {
          "classes": [],
          "speakerClass": "mochi",
          "speakerName": "Mochi",
          "portraitClass": "mochi",
          "html": "I can barely fit inside!"
        },
        {
          "classes": [],
          "speakerClass": "luna",
          "speakerName": "Luna",
          "portraitClass": "lunaPresetAmused",
          "html": "Mochi, I already told you that eating snacks all day would catch up with you..."
        },
        {
          "classes": [],
          "speakerClass": "mochi",
          "speakerName": "Mochi",
          "portraitClass": "mochi",
          "html": "Don't be mean, Luna... I try my best, but Catnip is so good, and it's a vegetable!"
        },
        {
          "classes": [],
          "speakerClass": "bernard",
          "speakerName": "Bernardo",
          "portraitClass": "bernard",
          "html": "Focus, friends! Every new shelter lets us welcome another Cat. This box is only the beginning."
        },
        {
          "classes": [],
          "speakerClass": "luna",
          "speakerName": "Luna",
          "portraitClass": "luna",
          "html": "The roof is leaning."
        },
        {
          "classes": [],
          "speakerClass": "bernard",
          "speakerName": "Bernardo",
          "portraitClass": "bernard",
          "html": "The floor is at fault."
        }
      ],
      "asset": {
        "type": "icon",
        "src": "img/Buildings/Cardboard Box_Final.png",
        "alt": "Three kittens admire their first cardboard shelter."
      }
    },
    {
      "id": "ecran-story-greatest-incrementor-part-1",
      "name": "The Greatest Incrementor — Part 1",
      "flag": "storyGreatestIncrementorPart1Vue",
      "trigger": "The second Cardboard Box is completed and reveals the Incrementor Law.",
      "closeButton": {
        "label": "Find out more",
        "handler": "fermerModal('ecran-story-greatest-incrementor-part-1')",
        "actionSummary": "Close the dialogue and return to the current screen."
      },
      "beats": [
        {
          "classes": [],
          "speakerClass": "bernard",
          "speakerName": "Bernardo",
          "portraitClass": "bernard",
          "html": "Wait. What just happened... Why our second box was harder to build ?"
        },
        {
          "classes": [],
          "speakerClass": "luna",
          "speakerName": "Luna",
          "portraitClass": "luna",
          "html": "Strange indeed, it's like some kind of magic forced our hands."
        },
        {
          "classes": [],
          "speakerClass": "incrementor",
          "speakerName": "The Greatest Incrementor",
          "portraitClass": "incrementorPresetAmusedMockery",
          "html": "Ah! It's time I introduce myself properly."
        },
        {
          "classes": [],
          "speakerClass": "bernard",
          "speakerName": "Bernardo",
          "portraitClass": "bernardPresetAngry",
          "html": "Who are you, and why are you touching my construction plans?"
        },
        {
          "classes": [],
          "speakerClass": "incrementor",
          "speakerName": "The Greatest Incrementor",
          "portraitClass": "incrementor",
          "html": "I am the Greatest Incrementor. You should kneel before me, but let's skip that part for once. My power applies in all kingdoms, and yours in no exception."
        },
        {
          "classes": [],
          "speakerClass": "luna",
          "speakerName": "Luna",
          "portraitClass": "luna",
          "html": "What do you mean your power? That explains nothing!"
        },
        {
          "classes": [],
          "speakerClass": "incrementor",
          "speakerName": "The Greatest Incrementor",
          "portraitClass": "incrementorPresetAmusedMockery",
          "html": "Let me be more precise, my Law applies in this world. And that is why each time you build, you must pay a little more in my honor."
        },
        {
          "classes": [],
          "speakerClass": "bernard",
          "speakerName": "Bernardo",
          "portraitClass": "bernardPresetAngry",
          "html": "Then we will learn how your Law works and find a way around it."
        },
        {
          "classes": [],
          "speakerClass": "incrementor",
          "speakerName": "The Greatest Incrementor",
          "portraitClass": "incrementorPresetAmusedMockery",
          "html": "Please try. Watching tiny Cats challenge a god should be adorable."
        },
        {
          "classes": [],
          "speakerClass": "mochi",
          "speakerName": "Mochi",
          "portraitClass": "mochi",
          "html": "Can your Law make snacks cheaper?"
        },
        {
          "classes": [],
          "speakerClass": "incrementor",
          "speakerName": "The Greatest Incrementor",
          "portraitClass": "incrementorPresetLaughExit",
          "html": "Absolutely not!"
        },
        {
          "classes": [
            "intro-miaou"
          ],
          "speakerClass": null,
          "speakerName": null,
          "portraitClass": null,
          "html": "The white Cat vanishes in a burst of laughter."
        },
        {
          "classes": [],
          "speakerClass": "bernard",
          "speakerName": "Bernardo",
          "portraitClass": "bernard",
          "html": "He wants us to feel powerless. I intend to disappoint him."
        },
        {
          "classes": [],
          "speakerClass": "luna",
          "speakerName": "Luna",
          "portraitClass": "lunaPresetAmused",
          "html": "Good. I already dislike his laugh."
        },
        {
          "classes": [],
          "speakerClass": "mochi",
          "speakerName": "Mochi",
          "portraitClass": "mochiPresetAngry",
          "html": "I dislike his snack policy."
        }
      ],
      "asset": {
        "type": "icon",
        "src": "img/Cat faces/the-greatest-incrementor.png",
        "alt": "Portrait of The Greatest Incrementor."
      }
    },
    {
      "id": "ecran-story-basic-wood",
      "name": "Beyond Cardboard",
      "flag": "storyBasicWoodVue",
      "trigger": "The gang produces its tenth Cardboard Plank for the first time.",
      "closeButton": {
        "label": "Put that wood to work!",
        "handler": "fermerModal('ecran-story-basic-wood')",
        "actionSummary": "Close the dialogue and return to the current screen."
      },
      "beats": [
        {
          "classes": [
            "intro-miaou"
          ],
          "speakerClass": null,
          "speakerName": null,
          "portraitClass": null,
          "html": "Mochi finds several logs stacked beneath an old shelter."
        },
        {
          "classes": [],
          "speakerClass": "mochi",
          "speakerName": "Mochi",
          "portraitClass": "mochiPresetSurprised",
          "html": "Bernardo! The humans cut trees into pieces we can carry. That was very thoughtful of them."
        },
        {
          "classes": [],
          "speakerClass": "luna",
          "speakerName": "Luna",
          "portraitClass": "lunaPresetAmused",
          "html": "I don't think they prepared those logs for us Mochi, but good catch."
        },
        {
          "classes": [],
          "speakerClass": "bernard",
          "speakerName": "Bernardo",
          "portraitClass": "bernardPresetHappy",
          "html": "They left good wood sitting in our garden. Not accepting such generosity would be rude."
        },
        {
          "classes": [],
          "speakerClass": "mochi",
          "speakerName": "Mochi",
          "portraitClass": "mochi",
          "html": "We are borrowing it, then?"
        },
        {
          "classes": [],
          "speakerClass": "luna",
          "speakerName": "Luna",
          "portraitClass": "lunaPresetAmused",
          "html": "Until the humans ask for it back, which may be difficult once it becomes a house."
        },
        {
          "classes": [],
          "speakerClass": "bernard",
          "speakerName": "Bernardo",
          "portraitClass": "bernard",
          "html": "Cardboard gave us shelter. This wood can give us a real camp, but our Sawmill needs an upgrade before it can cut these logs."
        },
        {
          "classes": [
            "intro-miaou"
          ],
          "speakerClass": null,
          "speakerName": null,
          "portraitClass": null,
          "html": "Resources have multiple tiers. The Basic Wood Planks recipe is now available, but the current Sawmill cannot process it yet."
        },
        {
          "classes": [
            "intro-miaou"
          ],
          "speakerClass": null,
          "speakerName": null,
          "portraitClass": null,
          "html": "Upgrade the existing Sawmill to Tier 2 for 5 Cardboard Planks and 2 Pebble Bricks. Other Work buildings will follow the same rule when their Tier 2 recipes are discovered."
        }
      ],
      "asset": {
        "type": "icon",
        "src": "img/resources/Basic Wood_Final.png",
        "alt": "A stack of sturdy Basic Wood logs."
      }
    },
    {
      "id": "ecran-story-5",
      "name": "Gang on the rise",
      "flag": "story5Vue",
      "trigger": "No automatic trigger is currently connected to this legacy Operations Table story.",
      "closeButton": {
        "label": "Plan our Camp!",
        "handler": "ouvrirCarteDepuisStoryGangRise()",
        "actionSummary": "Open Camp buildings and focus the Operations Table."
      },
      "beats": [
        {
          "classes": [
            "intro-miaou"
          ],
          "speakerClass": null,
          "speakerName": null,
          "portraitClass": null,
          "html": "Eight Cats gather around Bernardo in the garden."
        },
        {
          "classes": [],
          "speakerClass": "bernard",
          "speakerName": "Bernardo",
          "portraitClass": "bernardPresetHappy",
          "html": "Look at us now! Eight Cats, one growing camp, and enough paws to explore beyond this garden."
        },
        {
          "classes": [],
          "speakerClass": "mochi",
          "speakerName": "Mochi",
          "portraitClass": "mochi",
          "html": "Do proper gangs get more snacks?"
        },
        {
          "classes": [],
          "speakerClass": "luna",
          "speakerName": "Luna",
          "portraitClass": "lunaPresetAmused",
          "html": "You have been holding yourself to ask that before, haven't you?"
        },
        {
          "classes": [],
          "speakerClass": "bernard",
          "speakerName": "Bernardo",
          "portraitClass": "bernard",
          "html": "The neighborhood is full of useful places, but we need safe routes before sending anyone beyond the fence."
        },
        {
          "classes": [],
          "speakerClass": "mochi",
          "speakerName": "Mochi",
          "portraitClass": "mochi",
          "html": "I inspected the trash bins yesterday. They smell very promising."
        },
        {
          "classes": [],
          "speakerClass": "luna",
          "speakerName": "Luna",
          "portraitClass": "luna",
          "html": "A thorough strategic assessment."
        },
        {
          "classes": [],
          "speakerClass": "bernard",
          "speakerName": "Bernardo",
          "portraitClass": "bernardPresetHappy",
          "html": "We need to build an Operations Table for maps, routes, and assignments. At least that's how they were doing it in the movie the humans were watching. I was peaking through the window."
        },
        {
          "classes": [],
          "speakerClass": "luna",
          "speakerName": "Luna",
          "portraitClass": "lunaPresetAmused",
          "html": "That seems like hard work you do up there."
        },
        {
          "classes": [],
          "speakerClass": "bernard",
          "speakerName": "Bernardo",
          "portraitClass": "bernard",
          "html": "Always happy to give the best of me."
        },
        {
          "classes": [
            "intro-miaou"
          ],
          "speakerClass": null,
          "speakerName": null,
          "portraitClass": null,
          "html": "\u003cimg class=\"titre-icone\" src=\"img/interface/Exploration_Final.png\" alt=\"\" style=\"image-rendering:pixelated;mix-blend-mode:multiply;\"\u003e Operations Table discovered!"
        }
      ],
      "asset": {
        "type": "icon",
        "src": "img/Cat faces/Bernardo.png",
        "alt": "Portrait of Bernardo."
      }
    },
    {
      "id": "ecran-story-house-evacuation",
      "name": "They Built a Camp",
      "flag": "storyHouseEvacuationVue",
      "trigger": "The gang reaches fifteen Cats.",
      "closeButton": {
        "label": "Search the empty house!",
        "handler": "ouvrirMaisonDepuisStory()",
        "actionSummary": "Open Exploration and focus the newly available empty house."
      },
      "beats": [
        {
          "classes": [
            "intro-miaou"
          ],
          "speakerClass": null,
          "speakerName": null,
          "portraitClass": null,
          "html": "The mother finally notices the busy camp through the kitchen window."
        },
        {
          "classes": [],
          "speakerClass": "mere",
          "speakerName": "Mother",
          "portraitClass": "mere",
          "html": "What happened to the garden?"
        },
        {
          "classes": [],
          "speakerClass": "enfant",
          "speakerName": "Kid",
          "portraitClass": "enfant",
          "html": "The cats have been busy. Look, they even built little houses!"
        },
        {
          "classes": [],
          "speakerClass": "mere",
          "speakerName": "Mother",
          "portraitClass": "mere",
          "html": "Cats normally don't build houses. Why are they carrying our tools?"
        },
        {
          "classes": [],
          "speakerClass": "enfant",
          "speakerName": "Kid",
          "portraitClass": "enfant",
          "html": "Maybe they are very clever cats. It is kind of cute."
        },
        {
          "classes": [],
          "speakerClass": "mere",
          "speakerName": "Mother",
          "portraitClass": "mere",
          "html": "There are fifteen organized cats in our garden. That's not cute but scary. Pack a bag we can't stay here."
        },
        {
          "classes": [],
          "speakerClass": "enfant",
          "speakerName": "Kid",
          "portraitClass": "enfant",
          "html": "Can Bernardo come with us?"
        },
        {
          "classes": [],
          "speakerClass": "mere",
          "speakerName": "Mother",
          "portraitClass": "mere",
          "html": "The one watching us from the roof? Absolutely not."
        },
        {
          "classes": [
            "intro-miaou"
          ],
          "speakerClass": null,
          "speakerName": null,
          "portraitClass": null,
          "html": "The humans rush into their car and drive away from the house."
        },
        {
          "classes": [],
          "speakerClass": "mochi",
          "speakerName": "Mochi",
          "portraitClass": "mochiPresetSurprised",
          "html": "They left without saying goodbye. Did we do something wrong?"
        },
        {
          "classes": [],
          "speakerClass": "luna",
          "speakerName": "Luna",
          "portraitClass": "lunaPresetAmused",
          "html": "They finally noticed that we turned their garden into a starting society."
        },
        {
          "classes": [],
          "speakerClass": "mochi",
          "speakerName": "Mochi",
          "portraitClass": "mochi",
          "html": "They should have told us sooner. We could have shown them around."
        },
        {
          "classes": [],
          "speakerClass": "bernard",
          "speakerName": "Bernardo",
          "portraitClass": "bernardPresetHappy",
          "html": "Their sudden departure leaves us responsible for an empty house full of useful human equipment."
        },
        {
          "classes": [],
          "speakerClass": "luna",
          "speakerName": "Luna",
          "portraitClass": "luna",
          "html": "That is a very generous interpretation of events."
        },
        {
          "classes": [],
          "speakerClass": "bernard",
          "speakerName": "Bernardo",
          "portraitClass": "bernard",
          "html": "We will inspect the house carefully and leave no obvious pawprints."
        },
        {
          "classes": [
            "intro-miaou"
          ],
          "speakerClass": null,
          "speakerName": null,
          "portraitClass": null,
          "html": "The house is finally empty. Search the house in the Explorations tab."
        }
      ]
    },
    {
      "id": "ecran-story-left-house",
      "name": "The Neighbors Are Leaving",
      "flag": "storyLeftHouseEvacuationVue",
      "trigger": "The gang reaches seventeen Cats.",
      "closeButton": {
        "label": "Search the left neighbor's house!",
        "handler": "ouvrirMaisonVoisineGaucheDepuisStory()",
        "actionSummary": "Open Exploration and focus the left neighbor's house."
      },
      "beats": [
        {
          "classes": [
            "intro-miaou"
          ],
          "speakerClass": null,
          "speakerName": null,
          "portraitClass": null,
          "html": "The neighbors on the left peek through their curtains and see the camp growing in the garden next door."
        },
        {
          "classes": [],
          "speakerClass": "mere",
          "speakerName": "Mother",
          "portraitClass": "mere",
          "html": "There are more cats every day. They are building shelters now."
        },
        {
          "classes": [],
          "speakerClass": "mere",
          "speakerName": "Mother",
          "portraitClass": "mere",
          "html": "I am not waiting to see what they build next. Pack the car."
        },
        {
          "classes": [
            "intro-miaou"
          ],
          "speakerClass": null,
          "speakerName": null,
          "portraitClass": null,
          "html": "They leave in a hurry, leaving their house empty and ready to be explored."
        },
        {
          "classes": [],
          "speakerClass": "mochi",
          "speakerName": "Mochi",
          "portraitClass": "mochi",
          "html": "Another car is leaving. Are we becoming popular?"
        },
        {
          "classes": [],
          "speakerClass": "luna",
          "speakerName": "Luna",
          "portraitClass": "luna",
          "html": "In a very specific, property-emptying way."
        },
        {
          "classes": [],
          "speakerClass": "bernard",
          "speakerName": "Bernardo",
          "portraitClass": "bernard",
          "html": "Their house is unattended now, so we should respect their decision by making sure nothing useful goes to waste."
        },
        {
          "classes": [],
          "speakerClass": "luna",
          "speakerName": "Luna",
          "portraitClass": "luna",
          "html": "Your respect is touching."
        },
        {
          "classes": [],
          "speakerClass": "bernard",
          "speakerName": "Bernardo",
          "portraitClass": "bernard",
          "html": "Leadership often is."
        }
      ]
    },
    {
      "id": "ecran-story-6a",
      "name": "What's that thing?",
      "flag": "story6aVue",
      "trigger": "The School Guide is obtained for the first time.",
      "closeButton": {
        "label": "Have a read, Bernardo",
        "handler": "allerEtudierSchoolGuideDepuisStory()",
        "actionSummary": "Open Inventory, select the School Guide and focus its Study action."
      },
      "beats": [
        {
          "classes": [
            "intro-miaou"
          ],
          "speakerClass": null,
          "speakerName": null,
          "portraitClass": null,
          "html": "The squad returns from the trash run with a dusty book."
        },
        {
          "classes": [],
          "speakerClass": "mochi",
          "speakerName": "Mochi",
          "portraitClass": "mochiPresetSurprised",
          "html": "A flat square thing that smells like dust and humans was found in expedition."
        },
        {
          "classes": [],
          "speakerClass": "luna",
          "speakerName": "Luna",
          "portraitClass": "luna",
          "html": "That is a book. Humans store knowledge inside them."
        },
        {
          "classes": [],
          "speakerClass": "bernard",
          "speakerName": "Bernardo",
          "portraitClass": "bernardPresetHappy",
          "html": "It looks like a School Guide. Humans wrote down their ideas and knowledge in such objects."
        },
        {
          "classes": [],
          "speakerClass": "luna",
          "speakerName": "Luna",
          "portraitClass": "lunaPresetAmused",
          "html": "You have never looked happier."
        },
        {
          "classes": [],
          "speakerClass": "bernard",
          "speakerName": "Bernardo",
          "portraitClass": "bernard",
          "html": "Give me time to study it. There may be one or two human ideas worth keeping."
        },
        {
          "classes": [],
          "speakerClass": "mochi",
          "speakerName": "Mochi",
          "portraitClass": "mochi",
          "html": "Can I help?"
        },
        {
          "classes": [],
          "speakerClass": "bernard",
          "speakerName": "Bernardo",
          "portraitClass": "bernard",
          "html": "Another time Mochi, another time."
        },
        {
          "classes": [],
          "speakerClass": null,
          "speakerName": null,
          "portraitClass": null,
          "html": "Mochi leaves happily, looking forward to this other time."
        },
        {
          "classes": [],
          "speakerClass": "luna",
          "speakerName": "Luna",
          "portraitClass": "luna",
          "html": "Let us know if you find something useful in there. I'll check on Mochi, making sure he doesn't empty our food stocks after such false promises."
        }
      ],
      "asset": {
        "type": "icon",
        "src": "img/resources/Books_Final.png",
        "alt": "A mysterious book found during scouting."
      }
    },
    {
      "id": "ecran-story-6b",
      "name": "A job for everyone",
      "flag": "story6bVue",
      "trigger": "The School Guide is learned for the first time.",
      "closeButton": {
        "label": "Let's build it!",
        "handler": "validerStoryJob()",
        "actionSummary": "Close the story and open the Gang Leader job discovery dialogue."
      },
      "beats": [
        {
          "classes": [],
          "speakerClass": "bernard",
          "speakerName": "Bernardo",
          "portraitClass": "bernardPresetHappy",
          "html": "I finished the guide! Humans have a special title for the Cat who leads an organization: Chief Executive Officer."
        },
        {
          "classes": [
            "intro-miaou"
          ],
          "speakerClass": null,
          "speakerName": null,
          "portraitClass": null,
          "html": "Bernardo carefully separates the page about the CEO from the rest of his notes."
        },
        {
          "classes": [],
          "speakerClass": "luna",
          "speakerName": "Luna",
          "portraitClass": "lunaPresetAmused",
          "html": "You read an entire book and kept the page with the biggest title."
        },
        {
          "classes": [],
          "speakerClass": "bernard",
          "speakerName": "Bernardo",
          "portraitClass": "bernard",
          "html": "That is a complete coincidence."
        },
        {
          "classes": [],
          "speakerClass": "mochi",
          "speakerName": "Mochi",
          "portraitClass": "mochiPresetSurprised",
          "html": "Have I heard Chief Eating Officer?"
        },
        {
          "classes": [],
          "speakerClass": "luna",
          "speakerName": "Luna",
          "portraitClass": "luna",
          "html": "You have been training for that job your whole life."
        },
        {
          "classes": [],
          "speakerClass": "bernard",
          "speakerName": "Bernardo",
          "portraitClass": "bernard",
          "html": "The useful part is giving every Cat a job that suits their strengths. We need to build a Job Center where the whole gang can learn."
        },
        {
          "classes": [],
          "speakerClass": "mochi",
          "speakerName": "Mochi",
          "portraitClass": "mochi",
          "html": "Should I start preparing for my CEO interview?"
        },
        {
          "classes": [],
          "speakerClass": "bernard",
          "speakerName": "Bernardo",
          "portraitClass": "bernardPresetHappy",
          "html": "Applications open after we build the Job Center."
        },
        {
          "classes": [],
          "speakerClass": "luna",
          "speakerName": "Luna",
          "portraitClass": "lunaPresetAmused",
          "html": "That was a very polished no."
        }
      ],
      "asset": {
        "type": "illustration",
        "src": "img/Story scenes/Story 6b.png",
        "alt": "Bernardo studies charts and diagrams in an open book."
      }
    },
    {
      "id": "ecran-story-salad",
      "name": "Chef's kiss",
      "flag": "storySaladVue",
      "trigger": "The first Catnip Salad is completed.",
      "closeButton": {
        "label": "Let's get stronger!",
        "handler": "fermerModal('ecran-story-salad')",
        "actionSummary": "Close the dialogue and return to the current screen."
      },
      "beats": [
        {
          "classes": [
            "intro-miaou"
          ],
          "speakerClass": null,
          "speakerName": null,
          "portraitClass": null,
          "html": "The Catchen fills with the scent of fresh Catnip Salad."
        },
        {
          "classes": [],
          "speakerClass": "mochi",
          "speakerName": "Mochi",
          "portraitClass": "mochiPresetSurprised",
          "html": "Our first meal is ready ! And it still needs a quality tester. I volunteer."
        },
        {
          "classes": [],
          "speakerClass": "luna",
          "speakerName": "Luna",
          "portraitClass": "lunaPresetAmused",
          "html": "Of course you do."
        },
        {
          "classes": [],
          "speakerClass": "mochi",
          "speakerName": "Mochi",
          "portraitClass": "mochi",
          "html": "Someone has to protect the gang."
        },
        {
          "classes": [],
          "speakerClass": "bernard",
          "speakerName": "Bernardo",
          "portraitClass": "bernard",
          "html": "The supervisor should get the first bite, I don't want to put you at risk Mochi."
        },
        {
          "classes": [],
          "speakerClass": "mochi",
          "speakerName": "Mochi",
          "portraitClass": "mochi",
          "html": "There are risks I am willing to take !"
        },
        {
          "classes": [],
          "speakerClass": "luna",
          "speakerName": "Luna",
          "portraitClass": "lunaPresetAmused",
          "html": "Your courage continues to amaze us."
        }
      ],
      "asset": {
        "type": "icon",
        "src": "img/resources/Catnip Salad_Final.png",
        "alt": "A freshly prepared Catnip Salad."
      }
    },
    {
      "id": "ecran-story-seminar",
      "name": "Everybody loves seminars, right?",
      "flag": "storySeminarVue",
      "trigger": "The Corporate Seminar Booklet is learned for the first time.",
      "closeButton": {
        "label": "Let's build it!",
        "handler": "fermerModal('ecran-story-seminar')",
        "actionSummary": "Close the dialogue and return to the current screen."
      },
      "beats": [
        {
          "classes": [
            "intro-miaou"
          ],
          "speakerClass": null,
          "speakerName": null,
          "portraitClass": null,
          "html": "Bernardo closes the Corporate Seminar Booklet and stares into the distance."
        },
        {
          "classes": [],
          "speakerClass": "mochi",
          "speakerName": "Mochi",
          "portraitClass": "mochi",
          "html": "Did the book say something scary?"
        },
        {
          "classes": [],
          "speakerClass": "bernard",
          "speakerName": "Bernardo",
          "portraitClass": "bernard",
          "html": "It says seminars create aligned teams through motivational speeches and structured reflection."
        },
        {
          "classes": [],
          "speakerClass": "luna",
          "speakerName": "Luna",
          "portraitClass": "luna",
          "html": "Do humans understand those words?"
        },
        {
          "classes": [],
          "speakerClass": "bernard",
          "speakerName": "Bernardo",
          "portraitClass": "bernardPresetHappy",
          "html": "Probably not, but training together is a good idea. We should build a Training Center."
        },
        {
          "classes": [],
          "speakerClass": "mochi",
          "speakerName": "Mochi",
          "portraitClass": "mochiPresetSurprised",
          "html": "Will our team get matching scarves?"
        },
        {
          "classes": [],
          "speakerClass": "luna",
          "speakerName": "Luna",
          "portraitClass": "lunaPresetAmused",
          "html": "He heard team and immediately planned a parade."
        },
        {
          "classes": [],
          "speakerClass": "mochi",
          "speakerName": "Mochi",
          "portraitClass": "mochi",
          "html": "We would look very organized."
        },
        {
          "classes": [],
          "speakerClass": "luna",
          "speakerName": "Luna",
          "portraitClass": "luna",
          "html": "Fine, but I am not doing trust falls."
        },
        {
          "classes": [],
          "speakerClass": "mochi",
          "speakerName": "Mochi",
          "portraitClass": "mochi",
          "html": "I would catch you!"
        },
        {
          "classes": [],
          "speakerClass": "luna",
          "speakerName": "Luna",
          "portraitClass": "lunaPresetAmused",
          "html": "I couldn't be less sure about anything else."
        },
        {
          "classes": [],
          "speakerClass": "bernard",
          "speakerName": "Bernardo",
          "portraitClass": "bernard",
          "html": "Training Center first. Scarves and falling exercises can wait."
        }
      ],
      "asset": {
        "type": "icon",
        "src": "img/resources/Books_Final.png",
        "alt": "A corporate seminar booklet."
      }
    },
    {
      "id": "ecran-story-explorator",
      "name": "A New Horizon",
      "flag": "storyExploratorVue",
      "trigger": "The first Explorator finishes training, or an existing Explorator is detected when loading.",
      "closeButton": {
        "label": "Open the map",
        "handler": "ouvrirCarteDepuisStoryExplorator()",
        "actionSummary": "Close the dialogue and open the Exploration map."
      },
      "beats": [
        {
          "classes": [
            "intro-miaou"
          ],
          "speakerClass": null,
          "speakerName": null,
          "portraitClass": null,
          "html": "The first Explorator steps out of the Job Center with a map tucked beneath one paw."
        },
        {
          "classes": [],
          "speakerClass": "explorator",
          "speakerName": "Explorator",
          "portraitClass": "explorator",
          "html": "I can read tracks, mark safe paths, and find my way home without chasing my own tail."
        },
        {
          "classes": [],
          "speakerClass": "bernard",
          "speakerName": "Bernardo",
          "portraitClass": "bernardPresetHappy",
          "html": "Excellent work! You are ready to lead our first expedition beyond the fence."
        },
        {
          "classes": [],
          "speakerClass": "explorator",
          "speakerName": "Explorator",
          "portraitClass": "explorator",
          "html": "Where do we start?"
        },
        {
          "classes": [],
          "speakerClass": "bernard",
          "speakerName": "Bernardo",
          "portraitClass": "bernard",
          "html": "Close to home. A good leader does not risk the gang just to make him shine."
        },
        {
          "classes": [],
          "speakerClass": "explorator",
          "speakerName": "Explorator",
          "portraitClass": "explorator",
          "html": "The trash bins?"
        },
        {
          "classes": [],
          "speakerClass": "bernard",
          "speakerName": "Bernardo",
          "portraitClass": "bernardPresetHappy",
          "html": "Surprise Bins. Please use the official expedition terminology."
        },
        {
          "classes": [],
          "speakerClass": "explorator",
          "speakerName": "Explorator",
          "portraitClass": "explorator",
          "html": "I will write down both."
        },
        {
          "classes": [
            "intro-miaou"
          ],
          "speakerClass": null,
          "speakerName": null,
          "portraitClass": null,
          "html": "This cat is now an Explorator. You can explore the neighborhood using the map in the Explorations tab.",
          "id": "story-explorator-unlock-copy"
        }
      ],
      "asset": {
        "type": "icon",
        "src": "img/Cat faces/Bernardo.png",
        "alt": "Portrait of the gang's first Explorator."
      }
    },
    {
      "id": "ecran-story-bird",
      "name": "The bird",
      "flag": "storyBirdVue",
      "trigger": "The first bird event becomes available.",
      "closeButton": {
        "label": "GO, BERNARDO!",
        "handler": "fermerStoryBird()",
        "actionSummary": "Close the dialogue and start the pending bird mini-game."
      },
      "beats": [
        {
          "classes": [
            "intro-miaou"
          ],
          "speakerClass": null,
          "speakerName": null,
          "portraitClass": null,
          "html": "A branch rustles at the back of the garden."
        },
        {
          "classes": [],
          "speakerClass": "bernard",
          "speakerName": "Bernardo",
          "portraitClass": "bernardPresetAngry",
          "html": "Nobody move."
        },
        {
          "classes": [],
          "speakerClass": "mochi",
          "speakerName": "Mochi",
          "portraitClass": "mochiPresetSurprised",
          "html": "Is it dangerous?"
        },
        {
          "classes": [],
          "speakerClass": "luna",
          "speakerName": "Luna",
          "portraitClass": "lunaPresetAmused",
          "html": "Worse. It has feathers."
        },
        {
          "classes": [],
          "speakerClass": "bernard",
          "speakerName": "Bernardo",
          "portraitClass": "bernardPresetAngry",
          "html": "Keep your voices down. I am going to approach it."
        },
        {
          "classes": [],
          "speakerClass": "mochi",
          "speakerName": "Mochi",
          "portraitClass": "mochi",
          "html": "Do you want me to distract it?"
        },
        {
          "classes": [],
          "speakerClass": "bernard",
          "speakerName": "Bernardo",
          "portraitClass": "bernard",
          "html": "Stop Mochi ! That's not how hunting works !"
        },
        {
          "classes": [],
          "speakerClass": "luna",
          "speakerName": "Luna",
          "portraitClass": "lunaPresetAmused",
          "html": "Please keep explaining stealth out loud. The bird may learn things."
        },
        {
          "classes": [],
          "speakerClass": "bernard",
          "speakerName": "Bernardo",
          "portraitClass": "bernardPresetAngry",
          "html": "Stay low, keep your tails still, and wait for my signal."
        },
        {
          "classes": [
            "intro-miaou"
          ],
          "speakerClass": null,
          "speakerName": null,
          "portraitClass": null,
          "html": "A leaf falls between them."
        },
        {
          "classes": [],
          "speakerClass": "mochi",
          "speakerName": "Mochi",
          "portraitClass": "mochiPresetSurprised",
          "html": "Was that the signal?"
        },
        {
          "classes": [],
          "speakerClass": "bernard",
          "speakerName": "Bernardo",
          "portraitClass": "bernardPresetAngry",
          "html": "It is now. I'M GOING IN!"
        }
      ],
      "asset": {
        "type": "icon",
        "src": "img/interface/Bird Minigame Icon_Final.png",
        "alt": "bird"
      }
    }
  ]
});
})(typeof window !== "undefined" ? window : globalThis);
