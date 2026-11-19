(function(root) {
  "use strict";

  const CatInc = root.CatInc = root.CatInc || {};

  // Pure mission odds (tickets #345, #349-C): success chance of zone
  // explorations, Campaigns and Scoutings, and the retry bonus after failed
  // attempts. The tuning values are the Studio-owned
  // `generalRules.missionOdds`; team power, persisted retry counters and copy
  // stay in jeu.js.
  //
  //   base chance  = ((power / difficulty - threshold) / (1 - threshold))^exponent,
  //                  0 at or below the threshold, capped at 1
  //   final chance = min(1, base chance x (1 + retryBonusPerFailure x failures)),
  //                  failures capped at retryMaxFailures

  function checkedRules(rules) {
    const value = rules || {};
    const threshold = Number(value.threshold);
    const exponent = Number(value.exponent);
    const bonus = Number(value.retryBonusPerFailure);
    const maxFailures = Number(value.retryMaxFailures);
    if (!(threshold >= 0 && threshold < 1) || !(exponent > 0) || !(bonus >= 0)
        || !Number.isInteger(maxFailures) || maxFailures < 0) {
      throw new Error("missionOdds rules are invalid");
    }
    return Object.freeze({threshold: threshold, exponent: exponent, retryBonusPerFailure: bonus, retryMaxFailures: maxFailures});
  }

  function create(rawRules) {
    const rules = checkedRules(rawRules);

    // Base probability that a run with `power` beats `difficulty`. A
    // non-positive difficulty is a sure success.
    function successChance(power, difficulty) {
      if (!(difficulty > 0)) return 1;
      const ratio = Number(power) / difficulty;
      if (!(ratio > rules.threshold)) return 0;
      return Math.min(1, Math.pow((ratio - rules.threshold) / (1 - rules.threshold), rules.exponent));
    }

    // Normalises a persisted failure counter to the counted range [0, cap].
    function retryFailures(count) {
      return Number.isInteger(count) && count > 0 ? Math.min(rules.retryMaxFailures, count) : 0;
    }

    function retryMultiplier(failures) {
      return 1 + rules.retryBonusPerFailure * retryFailures(failures);
    }

    // Final chance: the retry bonus multiplies the base chance, never power.
    function finalChance(power, difficulty, failures) {
      return Math.min(1, successChance(power, difficulty) * retryMultiplier(failures));
    }

    // Rounded percentage shown to the player.
    function chancePercent(chance) {
      return Math.round(Math.min(1, Math.max(0, Number(chance) || 0)) * 100);
    }

    // Counter after a resolved run; a success clears it (returns 0).
    function nextRetryFailures(failures, success) {
      return success ? 0 : Math.min(rules.retryMaxFailures, retryFailures(failures) + 1);
    }

    return Object.freeze({
      rules: rules,
      successChance: successChance,
      retryFailures: retryFailures,
      retryMultiplier: retryMultiplier,
      finalChance: finalChance,
      chancePercent: chancePercent,
      nextRetryFailures: nextRetryFailures
    });
  }

  CatInc.missionOdds = Object.freeze({create: create});
})(typeof window !== "undefined" ? window : globalThis);
