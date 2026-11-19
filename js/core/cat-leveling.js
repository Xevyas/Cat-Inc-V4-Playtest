(function(root) {
  "use strict";

  const CatInc = root.CatInc = root.CatInc || {};

  // Pure Cat XP curve (tickets #345, #349-D). The curve parameters come from
  // the Studio General rules (`generalRules.catLeveling`: xpBase,
  // xpLevelExponent, xpGrowth) and the level ceiling from jeu.js
  // (`niveauMaxChat`, Infinity for every Cat except capped engineer ranks);
  // logs, recaps and saves stay there.

  // XP needed to go from `level` to `level + 1`:
  // ceil(xpBase × (level + 1)^xpLevelExponent × xpGrowth^level), at least 1.
  function xpForLevel(level, rules) {
    const amount = rules.xpBase * Math.pow(level + 1, rules.xpLevelExponent) * Math.pow(rules.xpGrowth, level);
    return Math.max(1, Math.ceil(amount));
  }

  // Adds `gained` XP to a Cat at `level` holding `xp`, levelling up while the
  // bank covers the next step and the ceiling allows it. A Cat that reaches
  // a finite ceiling keeps no banked XP. Callers reject Cats already at the
  // ceiling.
  function applyXp(level, xp, gained, maxLevel, rules) {
    let nextLevel = level;
    let bank = xp + gained;
    while (nextLevel < maxLevel && bank >= xpForLevel(nextLevel, rules)) {
      bank -= xpForLevel(nextLevel, rules);
      nextLevel += 1;
    }
    if (Number.isFinite(maxLevel) && nextLevel >= maxLevel) bank = 0;
    return {level: nextLevel, xp: bank, levelsGained: nextLevel - level};
  }

  CatInc.catLeveling = Object.freeze({
    xpForLevel: xpForLevel,
    applyXp: applyXp
  });
})(typeof window !== "undefined" ? window : globalThis);
