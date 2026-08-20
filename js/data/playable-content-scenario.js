(function(root) {
  "use strict";

  const CatInc = root.CatInc = root.CatInc || {};
  const data = CatInc.data = CatInc.data || {};

  // LOT-006-A keeps one representative opening path adjustable as data. It
  // is an observation/checkpoint definition, not a second game simulator.
  const milestones = Object.freeze([
    Object.freeze({
      id: "camp-unlocked",
      label: "Base Camp is unlocked",
      check: function(state) { return Number(state && state.chatons) >= 3; }
    }),
    Object.freeze({
      id: "sawmill-ready",
      label: "The Sawmill is repaired",
      check: function(state) {
        return Boolean(state && state.camp
          && Array.isArray(state.camp.repairedBuildingIds)
          && state.camp.repairedBuildingIds.includes("sawmill"));
      }
    }),
    Object.freeze({
      id: "first-cardboard-plank",
      label: "The first Cardboard Plank is produced",
      check: function(state) { return Number(state && state.cardboardPlanksTotalProduit) >= 1; }
    }),
    Object.freeze({
      id: "first-box-accessible",
      label: "The first Cardboard Box is placed and reachable",
      check: function(state, context) {
        const layout = state && state.camp && Array.isArray(state.camp.layout)
          ? state.camp.layout
          : [];
        const box = layout.find(function(item) {
          return item && item.type === "cardboardBox" && item.construit !== false;
        });
        const byItem = context && context.connections && context.connections.byItem;
        return Boolean(box && byItem && byItem[box.uid] && byItem[box.uid].active === true);
      }
    }),
    Object.freeze({
      id: "first-work-boost",
      label: "The first bird activates Work ×5",
      check: function(state, context) {
        const now = Number(context && context.now) || Date.now();
        return Boolean(state && state.birdPremiereReussie === true
          && Number(state.workBoostFinTs) > now);
      }
    })
  ]);

  const steps = Object.freeze([
    Object.freeze({
      id: "open-camp", action: "recruit-third-cat", milestoneId: "camp-unlocked",
      durationSeconds: 0, resources: Object.freeze({}), outputs: Object.freeze({}),
      unlocks: Object.freeze(["camp"])
    }),
    Object.freeze({
      id: "repair-sawmill", action: "repair-sawmill", milestoneId: "sawmill-ready",
      durationSeconds: 60, resources: Object.freeze({}), outputs: Object.freeze({}),
      unlocks: Object.freeze(["work"])
    }),
    Object.freeze({
      id: "produce-first-plank", action: "produce-cardboard-plank",
      milestoneId: "first-cardboard-plank", durationSeconds: 600,
      resources: Object.freeze({ cardboardPieces: 10 }),
      outputs: Object.freeze({ cardboardPlanks: 1 }), unlocks: Object.freeze([])
    }),
    Object.freeze({
      id: "build-first-box", action: "build-first-box", milestoneId: "first-box-accessible",
      durationSeconds: 300, resources: Object.freeze({ cardboardPlanks: 1 }),
      outputs: Object.freeze({ cardboardBox: 1 }), unlocks: Object.freeze(["first-box-access"])
    }),
    Object.freeze({
      id: "catch-first-bird", action: "catch-first-bird", milestoneId: "first-work-boost",
      durationSeconds: 0, resources: Object.freeze({}), outputs: Object.freeze({ workBoost: 5 }),
      unlocks: Object.freeze(["work-boost"])
    })
  ]);

  function evaluate(state, context) {
    const options = context && typeof context === "object" ? context : {};
    const reached = milestones.map(function(milestone) {
      return {
        id: milestone.id,
        label: milestone.label,
        reached: Boolean(milestone.check(state || {}, options))
      };
    });
    const next = reached.find(function(milestone) { return !milestone.reached; }) || null;
    return {
      scenarioId: "lot-006-a-opening",
      reached: reached,
      complete: !next,
      nextMilestoneId: next ? next.id : null
    };
  }

  data.playableContentScenario = Object.freeze({
    id: "lot-006-a-opening",
    version: 1,
    purpose: "One adjustable representative new-save opening path for LOT-006-A QA.",
    milestones: milestones,
    steps: steps,
    evaluate: evaluate
  });
})(typeof window !== "undefined" ? window : globalThis);
