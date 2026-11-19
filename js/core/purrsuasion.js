(function(root) {
  "use strict";

  const CatInc = root.CatInc = root.CatInc || {};

  // Pure Purrsuasion rules (ticket #343). Profiles stay data-driven in jeu.js
  // (`profilPurrsuasionV2`); session, DOM and rewards stay in the game controller.

  function bands(quality) {
    if (quality === "good") return ["bronze", "silver", "gold"];
    if (quality === "neutral") return ["bronze", "silver"];
    return ["bronze"];
  }

  function geometry(quality) {
    if (quality === "good") return {bronze: 1, silver: 0.55, gold: 0.2};
    if (quality === "neutral") return {bronze: 0.55, silver: 0.2, gold: -1};
    return {bronze: 0.2, silver: -1, gold: -1};
  }

  function score(quality, cursorPct, targetSize) {
    const distance = Math.abs(Number(cursorPct) - 50);
    const halfTarget = Math.max(1, Number(targetSize)) / 2;
    const ratio = distance / halfTarget;
    const zones = geometry(quality);
    if (ratio <= zones.gold) return 3;
    if (ratio <= zones.silver) return 2;
    if (ratio <= zones.bronze) return 1;
    return 0;
  }

  // Splits a round into its two contributions: the dialogue choice and the paw timing.
  // Timing is read on the widest (good-answer) bands so it does not depend on the choice.
  function roundDetail(quality, cursorPct, targetSize) {
    const timing = score("good", cursorPct, targetSize);
    const choice = {good: "Good answer", neutral: "Okay answer"}[quality] || "Weak answer";
    const timingCopy = ["timing missed", "timing a bit off", "good timing", "perfect timing"][timing];
    const aligned = (quality === "good") === (timing >= 2);
    return choice + (aligned ? " and " : ", but ") + timingCopy + ".";
  }

  function result(total, profile) {
    return { total: Number(total) || 0, required: profile.required, success: (Number(total) || 0) >= profile.required };
  }

  function progress(total, required) {
    const points = Math.max(0, Number(total) || 0);
    const goal = Math.max(1, Number(required) || 1);
    return {score: points, required: goal, ratio: Math.min(1, points / goal)};
  }

  // Draws three distinct scenarios from `pool` (Fisher-Yates on a copy) and one
  // visitor line variant each. `random` is injected so the caller keeps Math.random.
  function chooseScenarios(scenarioPool, random) {
    const pool = scenarioPool.slice();
    for (let index = pool.length - 1; index > 0; index -= 1) {
      const other = Math.floor(random() * (index + 1));
      [pool[index], pool[other]] = [pool[other], pool[index]];
    }
    return pool.slice(0, 3).map(function(scenario) {
      const variants = scenario.visitorLines;
      return {
        id: scenario.id,
        visitor: variants[Math.floor(random() * variants.length)],
        replies: ["good", "neutral", "bad"].map(function(quality) {
          return {quality: quality, text: scenario.replies[quality]};
        })
      };
    });
  }

  CatInc.purrsuasion = Object.freeze({
    bands: bands,
    geometry: geometry,
    score: score,
    roundDetail: roundDetail,
    result: result,
    progress: progress,
    chooseScenarios: chooseScenarios
  });
})(typeof window !== "undefined" ? window : globalThis);
