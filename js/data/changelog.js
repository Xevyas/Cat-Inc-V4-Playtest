(function(root) {
  "use strict";

  const CatInc = root.CatInc = root.CatInc || {};
  CatInc.data = CatInc.data || {};

  const release0034Categories = Object.freeze([
      Object.freeze({
        label: "New Features",
        changes: Object.freeze([
          "The top resource bar can now be customized with persistent resource favorites and a T2+ preset.",
          "Mobile Exploration now opens selected zones in a dedicated Campaigns or Scoutings workspace after a compact map preview."
        ])
      }),
      Object.freeze({
        label: "Balancing",
        changes: Object.freeze([
          "Explorator reward perks now reach 40% Double chance and a conditional 30% Triple chance.",
          "Wood Builder BOX BOOST now adds 5% per Cardboard Box instead of compounding multiplicatively.",
          "Gang Leader Daily Boost perks now cost 3 and 5 Canned Cat Food, while the first Supermarket campaign grants 2.",
          "Bernardo's Manual Focus power upgrades now cost 2 and 4 Canned Cat Food, with 60 seconds of capacity and 2 seconds per click."
        ])
      }),
      Object.freeze({
        label: "Quality of Life",
        changes: Object.freeze([
          "The top resource rail now uses larger desktop icons, a compact two-row mobile layout and fixed Cat, Bird and management controls.",
          "Manual Focus remains active across tabs and updates Gathering, Processing, full-cycle timing and production projections while active.",
          "Manual Focus text, active outlines and animations are clearer and smoother.",
          "House, Facilities and Inventory explanations now open from compact contextual help buttons.",
          "Daily scouting Canned Cat Food stocks now reset at Paris midnight independently from Daily Quests.",
          "Recruiting details hide Wood and Stone House bonuses until the corresponding House family is unlocked.",
          "JOBLESS remains hidden in Gang until the Job Center is built.",
          "Cat portraits are now centered safely inside circular badges throughout the game.",
          "Long presses no longer select or open game icons on mobile.",
          "Release dates are now displayed in the launch notes and Settings changelog."
        ])
      }),
      Object.freeze({
        label: "Bug Fixes",
        changes: Object.freeze([
          "A Cat can no longer be assigned to more than one action, and conflicting legacy assignments are repaired when a save loads.",
          "Daily Quests now unlock only after The Daily Purpose is fully learned, and recipe objectives display their required family.",
          "The Explorations unlock notification now appears at 8 Cats instead of 6.",
          "The Houses unlock notification no longer repeats whenever Plank stock returns from 0 to 1.",
          "The Exploration fog animation no longer jumps after changing tabs or selecting a zone.",
          "Bird, Catch, Recruit and Book mini-games now share a mobile-safe foreground runtime that prevents duplicate animation loops and reduces severe iOS frame drops."
        ])
      }),
      Object.freeze({
        label: "Other",
        changes: Object.freeze([
          "Story dialogue now gives Bernardo, Mochi and Luna clearer personalities and more natural conversations.",
          "Undiscovered mobile zones no longer reveal their internal identifier before exploration.",
          "The Laboratory now uses its dedicated building artwork in Facilities."
        ])
      })
  ]);

  const release0036Categories = Object.freeze([
    Object.freeze({
      label: "New Features",
      changes: Object.freeze([
        "Mobile Exploration now lets players open a scouting reward summary directly from the map and claim all accumulated loot for the selected zone."
      ])
    }),
    Object.freeze({
      label: "Balancing",
      changes: Object.freeze([])
    }),
    Object.freeze({
      label: "Quality of Life",
      changes: Object.freeze([
        "Work All now uses the compact Tier and resource-icon view, leaving room for each worker's name and level.",
        "Mobile Work manager cards now place Gathering and Processing side by side, with the remove control at the top right.",
        "Gang activity labels now show only the mission type and map zone, such as Scouting: D1.",
        "Job information popups open above their mobile action when space allows, keeping the training button accessible.",
        "The AFK return flow refreshes the page once after the summary is prepared, so players receive the latest published version automatically.",
        "Tab changes and live recipe progress now use lighter, coalesced updates on mobile while mini-games keep their foreground animation lifecycle."
      ])
    }),
    Object.freeze({
      label: "Bug Fixes",
      changes: Object.freeze([
        "The mobile map no longer shows faint grid lines caused by fractional artwork and fog-mask edges.",
        "Map scouting indicators now display the total number of loot units available, using 99+ for larger pools."
      ])
    }),
    Object.freeze({
      label: "Other",
      changes: Object.freeze([])
    })
  ]);

  const release0037Categories = Object.freeze([
    Object.freeze({
      label: "New Features",
      changes: Object.freeze([])
    }),
    Object.freeze({
      label: "Balancing",
      changes: Object.freeze([])
    }),
    Object.freeze({
      label: "Quality of Life",
      changes: Object.freeze([
        "Returning from an AFK period now checks the published version without cache and reloads only when an update is actually available."
      ])
    }),
    Object.freeze({
      label: "Bug Fixes",
      changes: Object.freeze([
        "Map selection outlines, locks and unknown-zone markers are visible again above the fog layer."
      ])
    }),
    Object.freeze({
      label: "Other",
      changes: Object.freeze([])
    })
  ]);

  const release0038Categories = Object.freeze([
    Object.freeze({
      label: "New Features",
      changes: Object.freeze([
        "A development-only Base Camp prototype now supports manual building and decoration placement plus connected road painting on a 20 by 30 grid."
      ])
    }),
    Object.freeze({
      label: "Balancing",
      changes: Object.freeze([])
    }),
    Object.freeze({
      label: "Quality of Life",
      changes: Object.freeze([
        "Release notes and changelog history now hide categories that contain no listed changes."
      ])
    }),
    Object.freeze({
      label: "Bug Fixes",
      changes: Object.freeze([])
    }),
    Object.freeze({
      label: "Other",
      changes: Object.freeze([])
    })
  ]);

  const release0039Categories = Object.freeze([
    Object.freeze({
      label: "New Features",
      changes: Object.freeze([
        "The Base Camp now drives early progression: repair the Sawmill, produce Planks, expand Cat capacity, clear Junk, restore workshops and build the Operations Table to unlock Exploration.",
        "Camp repairs, construction, upgrades and Junk clearing now finish in a ready state that the player validates, including after an offline return.",
        "Camp Junk now has access rules, Cat-level requirements and occasional visible resource finds that support the opening progression.",
        "Camp Appeal now controls visitor arrival speed, while connected housing controls how many Cats can join the gang.",
        "Manual Focus can now accelerate active Camp repairs, construction, upgrades and Junk clearing."
      ])
    }),
    Object.freeze({
      label: "Balancing",
      changes: Object.freeze([
        "Visitor arrival now uses the original rising recruitment curve divided by the Camp Appeal multiplier, making early recruits progressively more demanding.",
        "Decorations contribute Appeal only when their Camp area is reachable; player-built structures do not block that connection.",
        "Bernardo no longer contributes worker or Explorator bonuses and starts with no Prestige bonus at level 0."
      ])
    }),
    Object.freeze({
      label: "Quality of Life",
      changes: Object.freeze([
        "Completed Camp actions and recruitable visitors now use a stronger green target aura and can be validated directly from their portrait.",
        "The Camp top bar now shows Cats, capacity and Appeal, while Cat markers can be hidden when a clearer map view is needed.",
        "Mobile Camp controls stay reachable at the bottom, pinch zoom follows the two-finger target and the camera can pan across both axes.",
        "The Appeal breakdown now opens above the Camp instead of being clipped by the map."
      ])
    }),
    Object.freeze({
      label: "Bug Fixes",
      changes: Object.freeze([
        "Junk and damaged workshops can no longer be selected through inaccessible terrain.",
        "Completed offline Junk actions no longer trap their assigned Cat.",
        "Camp elements with an active Camp action can no longer be moved until that action is resolved.",
        "The Bird event is available only when its Tree is reachable, and its Manual Focus reward is visible again."
      ])
    }),
    Object.freeze({
      label: "Other",
      changes: Object.freeze([
        "Bernardo now supervises the Camp from the roof instead of acting as a worker, with updated guidance and progression dialogue."
      ])
    })
  ]);

  const release0040Categories = Object.freeze([
    Object.freeze({
      label: "New Features",
      changes: Object.freeze([
        "Repairing the Sawmill now starts a guided Camp-to-Work tutorial that assigns Mochi and Luna before introducing the next visitor.",
        "Validated character expressions can now appear as speaker-specific portraits in story dialogue."
      ])
    }),
    Object.freeze({
      label: "Quality of Life",
      changes: Object.freeze([
        "Manual Focus can now be activated directly on a Cat assigned to Camp construction.",
        "Camp Build categories now use recognizable game artwork instead of placeholder symbols.",
        "Idle Cats display a small local sleep marker, while working Cats and Bernardo remain visually active.",
        "The first Bird appears at its Tree and now explains that later catches will be less forgiving.",
        "Early story conversations have been rewritten with a more natural, playful voice for Bernardo, Mochi and Luna."
      ])
    }),
    Object.freeze({
      label: "Bug Fixes",
      changes: Object.freeze([
        "Resources found beneath cleared Junk now remain visible on the ground and are collected exactly once when clicked.",
        "In-progress Camp construction now keeps its paid cost and timer correctly after reloading the game.",
        "The Sawmill tutorial now resumes from its saved step without duplicating assignments or visitor arrival.",
        "Character portraits and expressions preserve cleaner transparent edges and locked facial details."
      ])
    }),
    Object.freeze({
      label: "Other",
      changes: Object.freeze([
        "Camp construction and upgrade costs now use one validated gameplay catalogue, keeping displayed quotes and runtime payments aligned."
      ])
    })
  ]);

  const release0035Categories = Object.freeze([
    Object.freeze({
      label: "Quality of Life",
      changes: Object.freeze([
        "Mobile Exploration now returns to the map when the Explorations tab or the zone Explore action is opened again.",
        "Exploration headers now expose their description through the same contextual help button used by other game panels.",
        "Mobile panels now share consistent horizontal margins, full available width and spacing below navigation rails.",
        "Facilities gains mobile Jobs, Train and Lab subtabs as each specialized building becomes available.",
        "The Training Center now opens directly in Facilities, with a compact mobile Cat picker replacing the long inline roster.",
        "Multi-resource building costs now wrap as complete resource groups on narrow mobile screens.",
        "The AFK summary now uses the game's interface and resource artwork instead of emojis."
      ])
    }),
    Object.freeze({
      label: "Bug Fixes",
      changes: Object.freeze([
        "The Tutorial completion acknowledgement now appears even when Daily Purpose has not been learned yet.",
        "The Houses tab no longer creates a horizontal scrollbar on narrow mobile screens.",
        "Exploration assignment cards now stay aligned when the first slot carries the required Explorator label."
      ])
    })
  ]);

  const release0042Categories = Object.freeze([
    Object.freeze({
      label: "New Features",
      changes: Object.freeze([
        "Camp actions now use compact assignment panels with clear duration, level, material tier and Cat-slot information.",
        "Explored neighboring gardens now expand the Camp view and can be opened through dedicated two-Cat access projects.",
        "Junk may reveal resources on the ground, which must be collected before that cell can be used again."
      ])
    }),
    Object.freeze({
      label: "Quality of Life",
      changes: Object.freeze([
        "The opening Camp progression now guides the first Cardboard Box, the path to the Catchen and early production without lengthy explanations.",
        "Camp production buildings can assign recipes and Cats directly from their map panels.",
        "Resource storage limits are visible in the top bar and full resources are highlighted.",
        "The Camp now scales more naturally across desktop and mobile screens and uses refreshed houses and riverbank artwork."
      ])
    }),
    Object.freeze({
      label: "Bug Fixes",
      changes: Object.freeze([
        "Tutorial steps now survive reloads, block unrelated actions and update their highlighted target immediately without requiring a refresh.",
        "Buildings and Camp action popups now stay above neighboring-property layers and inaccessible buildings cannot be repaired early.",
        "Multi-Cat Junk, construction, repair and access projects now enforce their exact Cat requirements.",
        "Camp rewards, shore artwork, house framing and Bernardo's supervisor portrait now render in their intended positions."
      ])
    })
  ]);

  const release0041Categories = Object.freeze([
    Object.freeze({
      label: "New Features",
      changes: Object.freeze([
        "Eligible Camp buildings can now carry reusable colored stickers that remain aligned with their authored surface as the building rotates.",
        "The Small Storage Shed now ships with its functional storage symbol, while decorative building stickers remain reserved for a future reward."
      ])
    }),
    Object.freeze({
      label: "Quality of Life",
      changes: Object.freeze([
        "Camp asset colors can now be tuned locally before rendering without spending AI tokens or creating extra variations.",
        "Manual Focus now updates the remaining time shown beneath Cats working on Camp construction, repair, upgrades and Junk clearing."
      ])
    }),
    Object.freeze({
      label: "Bug Fixes",
      changes: Object.freeze([
        "Manual Focus now accelerates the authoritative Camp job instead of a temporary display copy.",
        "Building stickers now follow every building rotation consistently in both the Camp preview and the game."
      ])
    })
  ]);

  const release0043Categories = Object.freeze([
    Object.freeze({
      label: "New Features",
      changes: Object.freeze([
        "Job Center, Training Center and Laboratory now carry a dedicated Jobs emblem that follows their Camp orientation."
      ])
    }),
    Object.freeze({
      label: "Quality of Life",
      changes: Object.freeze([
        "Story conversations now provide a clear touch-friendly continue button.",
        "Stories replayed from Logs now close safely without repeating their original progression action."
      ])
    }),
    Object.freeze({
      label: "Bug Fixes",
      changes: Object.freeze([
        "Release notes now wait for guided Camp interactions to finish instead of interrupting the active tutorial.",
        "Camp asset access cells now stay aligned when an authored building footprint is resized."
      ])
    })
  ]);

  const release0044Categories = Object.freeze([
    Object.freeze({
      label: "New Features",
      changes: Object.freeze([
        "The Job Center now uses its compact 2 by 2 Revision 7 artwork in all four Camp orientations."
      ])
    }),
    Object.freeze({
      label: "Bug Fixes",
      changes: Object.freeze([
        "Existing Camp layouts now normalize the Job Center to its live 2 by 2 footprint while preserving its position and orientation."
      ])
    }),
    Object.freeze({
      label: "Other",
      changes: Object.freeze([
        "Dialogs, Logs, notifications and the changelog now use dedicated interface modules with the same player behavior.",
        "Catchen Tier 2, Basic Fabric and Flames authoring assets are now approved in the Camp Studio for future use."
      ])
    })
  ]);

  const release0045Categories = Object.freeze([
    Object.freeze({
      label: "Quality of Life",
      changes: Object.freeze([
        "Settings now remains available during guided Camp interactions and returns you to the same tutorial step when closed."
      ])
    }),
    Object.freeze({
      label: "Bug Fixes",
      changes: Object.freeze([
        "Guided Camp interactions now recover missing or hidden targets instead of leaving the interface locked.",
        "The Sawmill tutorial now restores its Work action and avoids trapping Cat assignment when no eligible Cat is available."
      ])
    })
  ]);

  const release0046Categories = Object.freeze([
    Object.freeze({
      label: "Bug Fixes",
      changes: Object.freeze([
        "Guided Camp targets such as the Sawmill now respond to a normal tap without accidentally starting Edit mode.",
        "Completed or cancelled Camp taps now release their long-press state cleanly after pointer capture."
      ])
    })
  ]);

  const release0047Categories = Object.freeze([
    Object.freeze({
      label: "Bug Fixes",
      changes: Object.freeze([
        "A single Sawmill tap now keeps its Work action visible and usable when the guided tutorial advances to the next step."
      ])
    })
  ]);

  const release0048Categories = Object.freeze([
    Object.freeze({
      label: "Quality of Life",
      changes: Object.freeze([
        "Guided Camp tutorials now follow completed game actions without blocking normal taps, Settings or Camp gestures."
      ])
    })
  ]);

  const release0049Categories = Object.freeze([
    Object.freeze({
      label: "Other",
      changes: Object.freeze([
        "An opt-in Camp production-panel diagnostic is available for device troubleshooting without changing normal gameplay."
      ])
    })
  ]);

  const release0050Categories = Object.freeze([
    Object.freeze({
      label: "Bug Fixes",
      changes: Object.freeze([
        "Camp production panels now stay inside the visible mobile viewport when browser bars, scrolling or orientation reduce the usable screen area."
      ])
    })
  ]);

  const release0051Categories = Object.freeze([
    Object.freeze({
      label: "Other",
      changes: Object.freeze([
        "An opt-in Camp touch diagnostic now records real pointer and click targets on mobile devices for BUG-MOBILE-TAP-001 investigation."
      ])
    })
  ]);

  const release0052Categories = Object.freeze([
    Object.freeze({
      label: "Bug Fixes",
      changes: Object.freeze([
        "A first touch on a Camp building now opens only its panel; Work requires a separate explicit touch, regardless of where the building was tapped."
      ])
    })
  ]);

  const release0053Categories = Object.freeze([
    Object.freeze({
      label: "Quality of Life",
      changes: Object.freeze([
        "The Sawmill tutorial now enforces its intended job order and safely resumes existing games whose production setup is already ahead."
      ])
    }),
    Object.freeze({
      label: "Bug Fixes",
      changes: Object.freeze([
        "Production buildings are now permanent: they can still be moved or rotated, but can no longer be deleted."
      ])
    }),
    Object.freeze({
      label: "Other",
      changes: Object.freeze([
        "An opt-in mobile input diagnostic is available for investigating unreliable taps on iPhone Safari."
      ])
    })
  ]);

  const release0062Categories = Object.freeze([
    Object.freeze({
      label: "New Features",
      changes: Object.freeze([
        "The Camp now includes the final Studio-approved Catchen Tier 2, Market Stall and Operation Table artwork and placement data."
      ])
    }),
    Object.freeze({
      label: "Other",
      changes: Object.freeze([
        "Approved Cat portrait expressions are now carried into releases automatically from their current live portrait rig."
      ])
    })
  ]);

  const release0063Categories = Object.freeze([
    Object.freeze({
      label: "New Features",
      changes: Object.freeze([
        "Cannelle can now join the Camp, open her Market Stall and sell a growing selection of useful supplies.",
        "The repaired Operation Table now leads into the first expedition, with its story and progression tracked from the Studio catalog.",
        "Camp decorations now include the Small Fountain and the upgraded Cardboard Box artwork."
      ])
    }),
    Object.freeze({
      label: "Quality of Life",
      changes: Object.freeze([
        "Early Camp progression now explains repairs, construction and Work boosts more clearly, including persistent indicators across tabs.",
        "Dialogue and story content now comes from the governed Studio catalog so authored updates remain consistent in game."
      ])
    }),
    Object.freeze({
      label: "Bug Fixes",
      changes: Object.freeze([
        "Early-progression saves now recover safely when the first Cardboard Box, Sawmill or Operation Table is missing or ahead of its expected step."
      ])
    })
  ]);

  const release0064Categories = Object.freeze([
    Object.freeze({
      label: "New Features",
      changes: Object.freeze([
        "Camp buildings now use canonical Studio-authored upgrade tiers and progression rules.",
        "Cat Houses now let residents be assigned or swapped directly from the Camp.",
        "Neighbor plots now reveal through governed access paths with visible boundary fences."
      ])
    }),
    Object.freeze({
      label: "Quality of Life",
      changes: Object.freeze([
        "Jobs and Camp actions now use clearer icons and ready-state alerts.",
        "Camp placement now supports irregular building footprints more faithfully."
      ])
    }),
    Object.freeze({
      label: "Bug Fixes",
      changes: Object.freeze([
        "Professions now apply only after their job is validated.",
        "Neighbor fog and boundary fences now stay consistent as access changes."
      ])
    })
  ]);

  const release0061Categories = Object.freeze([
    Object.freeze({
      label: "Quality of Life",
      changes: Object.freeze([
        "Stories replayed from Logs are now read-only and return cleanly to the Stories list.",
        "Release notes no longer interrupt onboarding and remain available manually from Settings."
      ])
    })
  ]);

  const release0060Categories = Object.freeze([
    Object.freeze({
      label: "Quality of Life",
      changes: Object.freeze([
        "Settings now stays inside the useful mobile viewport, with every control reachable on smaller screens."
      ])
    }),
    Object.freeze({
      label: "Bug Fixes",
      changes: Object.freeze([
        "Camp taps now open Repair reliably without the same touch immediately closing the new window.",
        "Quick Repair now receives its own touch instead of passing it through to the building underneath."
      ])
    })
  ]);

  const release0059Categories = Object.freeze([
    Object.freeze({
      label: "Quality of Life",
      changes: Object.freeze([
        "Manual Focus now keeps up with rapid taps on iPhone, and dialogue cards respond across their intended surface."
      ])
    }),
    Object.freeze({
      label: "Bug Fixes",
      changes: Object.freeze([
        "Sawmill Cat removal now becomes available immediately after its tutorial step, and Manual Focus feedback stays visible near the top of the Camp."
      ])
    })
  ]);

  const release0058Categories = Object.freeze([
    Object.freeze({
      label: "Bug Fixes",
      changes: Object.freeze([
        "Camp touch interactions are now consistent: production panels dismiss safely, quick dialogues respond across their card, inert obstacles no longer capture taps, and existing Cardboard Boxes rotate correctly."
      ])
    })
  ]);

  const release0057Categories = Object.freeze([
    Object.freeze({
      label: "Bug Fixes",
      changes: Object.freeze([
        "Touch controls now accept Safari's signed pointer identities, so taps remain reliable even when iPhone Safari omits the final click."
      ])
    })
  ]);

  const release0056Categories = Object.freeze([
    Object.freeze({
      label: "Bug Fixes",
      changes: Object.freeze([
        "Touch controls now activate reliably even when iPhone Safari omits the final click, without allowing a delayed click to activate a newly opened panel."
      ])
    })
  ]);

  const release0055Categories = Object.freeze([
    Object.freeze({
      label: "Bug Fixes",
      changes: Object.freeze([
        "Camp building taps now complete reliably on iPhone Safari when WebKit reports the final touch-generated click as a mouse click."
      ])
    })
  ]);

  // Local changes made after the latest published release live here.
  // On publication, promote this entry to `releases`, assign its version/date,
  // then replace these categories with a fresh empty pending release.
  const pendingRelease = Object.freeze({
    baseVersion: "0.0064",
    categories: Object.freeze([
      Object.freeze({ label: "New Features", changes: Object.freeze([]) }),
      Object.freeze({ label: "Balancing", changes: Object.freeze([]) }),
      Object.freeze({ label: "Quality of Life", changes: Object.freeze([]) }),
      Object.freeze({ label: "Bug Fixes", changes: Object.freeze([]) }),
      Object.freeze({ label: "Other", changes: Object.freeze([]) })
    ])
  });

  // Keep the newest release first. The game uses the first entry for the
  // one-time launch panel and renders the complete array in Settings.
  const releases = [
    Object.freeze({
      version: "0.0064",
      date: "2026-08-16",
      categories: release0064Categories
    }),
    Object.freeze({
      version: "0.0063",
      date: "2026-08-16",
      categories: release0063Categories
    }),
    Object.freeze({
      version: "0.0062",
      date: "2026-08-14",
      categories: release0062Categories
    }),
    Object.freeze({
      version: "0.0061",
      date: "2026-08-12",
      categories: release0061Categories
    }),
    Object.freeze({
      version: "0.0060",
      date: "2026-08-12",
      categories: release0060Categories
    }),
    Object.freeze({
      version: "0.0059",
      date: "2026-08-11",
      categories: release0059Categories
    }),
    Object.freeze({
      version: "0.0058",
      date: "2026-08-11",
      categories: release0058Categories
    }),
    Object.freeze({
      version: "0.0057",
      date: "2026-08-11",
      categories: release0057Categories
    }),
    Object.freeze({
      version: "0.0056",
      date: "2026-08-11",
      categories: release0056Categories
    }),
    Object.freeze({
      version: "0.0055",
      date: "2026-08-11",
      categories: release0055Categories
    }),
    Object.freeze({
      version: "0.0053",
      date: "2026-08-11",
      categories: release0053Categories
    }),
    Object.freeze({
      version: "0.0052",
      date: "2026-08-11",
      categories: release0052Categories
    }),
    Object.freeze({
      version: "0.0051",
      date: "2026-08-11",
      categories: release0051Categories
    }),
    Object.freeze({
      version: "0.0050",
      date: "2026-08-11",
      categories: release0050Categories
    }),
    Object.freeze({
      version: "0.0049",
      date: "2026-08-11",
      categories: release0049Categories
    }),
    Object.freeze({
      version: "0.0048",
      date: "2026-08-11",
      categories: release0048Categories
    }),
    Object.freeze({
      version: "0.0047",
      date: "2026-08-11",
      categories: release0047Categories
    }),
    Object.freeze({
      version: "0.0046",
      date: "2026-08-11",
      categories: release0046Categories
    }),
    Object.freeze({
      version: "0.0045",
      date: "2026-08-10",
      categories: release0045Categories
    }),
    Object.freeze({
      version: "0.0044",
      date: "2026-08-10",
      categories: release0044Categories
    }),
    Object.freeze({
      version: "0.0043",
      date: "2026-08-10",
      categories: release0043Categories
    }),
    Object.freeze({
      version: "0.0042",
      date: "2026-08-09",
      categories: release0042Categories
    }),
    Object.freeze({
      version: "0.0041",
      date: "2026-08-09",
      categories: release0041Categories
    }),
    Object.freeze({
      version: "0.0040",
      date: "2026-08-07",
      categories: release0040Categories
    }),
    Object.freeze({
      version: "0.0039",
      date: "2026-08-05",
      categories: release0039Categories
    }),
    Object.freeze({
      version: "0.0038",
      date: "2026-07-28",
      categories: release0038Categories
    }),
    Object.freeze({
      version: "0.0037",
      date: "2026-07-28",
      categories: release0037Categories
    }),
    Object.freeze({
      version: "0.0036",
      date: "2026-07-27",
      categories: release0036Categories
    }),
    Object.freeze({
      version: "0.0035",
      date: "2026-07-26",
      categories: release0035Categories
    }),
    Object.freeze({
      version: "0.0034",
      date: "2026-07-26",
      categories: release0034Categories
    }),
    Object.freeze({
      version: "0.0033",
      // ISO format keeps the release history sortable and easy to localize.
      date: "2026-07-25",
      categories: Object.freeze([
        Object.freeze({
          label: "New Features",
          changes: Object.freeze([
            "In-game release notes now appear once after each update, and the complete version history is available from Settings.",
            "Manual Focus unlocks at 4 Cats. Clicks store 0.8 seconds of ×2 production speed, up to 30 seconds, and the reserve follows both phases of the selected recipe.",
            "Camp Engineers now support multiple ranks. Rank 1 extends the AFK cap, while Rank 2 improves the AFK ratio.",
            "New garden and parking campaigns provide Human Leftovers, Rock Bricks and Basic Wood Planks.",
            "A new A1 upper-floor campaign rewards Sturdy House Plans and unlocks the Solid Stone Cathouse.",
            "Bernardo's Gang Leader sphere now includes Daily Quest upgrades, global recruitment speed, Manual Focus improvements and Exploration perks.",
            "The Wood Builder sphere now includes Perfect Auto Builds, scalable cost reductions and specialized Cardboard Box and Wood Cathouse bonuses.",
            "The Explorator sphere now includes Canned Cat Food stock preservation, conditional Triple rewards and separate Doubled and Tripled scouting counters.",
            "Gathering and Processing managers now have two-level production, speed and cost branches, plus additional recipe-slot perks."
          ])
        }),
        Object.freeze({
          label: "Balancing",
          changes: Object.freeze([
            "The recruitment timer now uses ×3 growth through the first 10 steps, ×2 through step 15, then ×1.5 afterward.",
            "Pebbles now unlock at 6 Cats and Explorations at 8 Cats.",
            "Exploration missions now require an Explorator in their first slot. Bernardo can replace one after learning EXPLORATOR.",
            "All Cats now have a maximum level of 100.",
            "Camp Engineer Rank 2 adds 0.5 percentage point to the AFK ratio per Cat level.",
            "Engineer training durations now follow the 2h, 4h, 8h, 12h, 16h, 20h and 24h progression.",
            "Gathering and Processing manager perks now grant 25% per level. Their NEW SLOT perks cost 3 Canned Cat Food.",
            "The first Basic Stone Cathouse now costs 5 Basic Wood Planks and 5 Pebble Bricks.",
            "Bird pity now reduces cursor speed by 5% per failure, up to 35%. Bernardo no longer modifies Bird difficulty."
          ])
        }),
        Object.freeze({
          label: "Quality of Life",
          changes: Object.freeze([
            "Cat levels remain hidden in Gang until Catnip Salad is unlocked.",
            "Work recipes now display their complete Gathering and Processing cycle time and preserve visible Processing progress when a Cat is removed.",
            "Building costs and resource displays now use clearer Tier badges.",
            "Auto-feed selects a more efficient food combination and warns before unavoidable overfeeding.",
            "Bernardo is now visibly assigned while studying a book and cannot perform another action simultaneously.",
            "Job Center and Laboratory training now require explicit validation, show completion notifications and use the trainee's portrait in their progress bars.",
            "A one-time explanation now teaches how manager slots work after the first manager is trained.",
            "Fast simulation no longer makes interactive controls difficult to click or hold.",
            "Sphere connectors remain behind perk nodes, and learning a perk no longer visually resets the central job perk.",
            "Exploration reveals and claimed Exploration rewards now have dedicated sound effects.",
            "Completing the Tutorial now displays a short acknowledgement message."
          ])
        }),
        Object.freeze({
          label: "Other",
          changes: Object.freeze([
            "The D1 house description now correctly states that a human is still home before the evacuation event.",
            "Undiscovered zone names remain hidden in notifications and Gang activity labels.",
            "Exploration fog and Training Center backgrounds now use seamless layered cloud animations.",
            "Rock Bricks obtained before unlocking their recipe now display correctly and remain visible in Inventory.",
            "Two additional Cat portraits have been added to random recruitments.",
            "Grilled Anchovy now correctly states that it grants 10 XP."
          ])
        })
      ])
    })
  ];

  CatInc.data.changelog = Object.freeze({
    currentVersion: releases[0].version,
    releases: Object.freeze(releases),
    pendingRelease: pendingRelease
  });
})(typeof window !== "undefined" ? window : globalThis);
