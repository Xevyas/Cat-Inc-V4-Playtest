(function(root) {
  "use strict";

  const CatInc = root.CatInc = root.CatInc || {};
  CatInc.data = CatInc.data || {};

  const COOLDOWN_MS = 3 * 60 * 60 * 1000;
  const NORMAL_ROUNDS = 5;
  const ROUND_DURATION_MS = 5000;
  const INITIAL_DIFFICULTIES = Object.freeze([
    Object.freeze({ minDelayMs: 2200, maxDelayMs: 3000, accuracy: 0.60, minGap: 0.30 }),
    Object.freeze({ minDelayMs: 1900, maxDelayMs: 2600, accuracy: 0.70, minGap: 0.22 }),
    Object.freeze({ minDelayMs: 1600, maxDelayMs: 2300, accuracy: 0.78, minGap: 0.16 }),
    Object.freeze({ minDelayMs: 1350, maxDelayMs: 2000, accuracy: 0.85, minGap: 0.11 }),
    Object.freeze({ minDelayMs: 1150, maxDelayMs: 1800, accuracy: 0.90, minGap: 0.075 })
  ]);

  function clamp(value, min, max) {
    return Math.max(min, Math.min(max, value));
  }

  function difficultyConfig(difficulty) {
    const level = Math.max(1, Math.floor(Number(difficulty) || 1));
    if (level <= INITIAL_DIFFICULTIES.length) return INITIAL_DIFFICULTIES[level - 1];
    const extra = level - INITIAL_DIFFICULTIES.length;
    return Object.freeze({
      minDelayMs: Math.round(clamp(1150 - extra * 90, 700, 1150)),
      maxDelayMs: Math.round(clamp(1800 - extra * 100, 1100, 1800)),
      accuracy: clamp(0.90 + extra * 0.015, 0.90, 0.96),
      minGap: clamp(0.075 - extra * 0.006, 0.04, 0.075)
    });
  }

  function unlockedDifficulties(cannelleLevel) {
    const count = Math.max(0, Math.floor((Number(cannelleLevel) || 0) / 10));
    return Array.from({ length: count }, function(_, index) { return index + 1; });
  }

  function offerRatio(offer) {
    return Number(offer.food) / Number(offer.price);
  }

  function bestOfferIndex(offers) {
    if (!Array.isArray(offers) || offers.length !== 3) return -1;
    let best = 0;
    for (let index = 1; index < offers.length; index += 1) {
      if (offerRatio(offers[index]) > offerRatio(offers[best])) best = index;
    }
    return best;
  }

  function qualityGap(offers) {
    const ratios = offers.map(offerRatio).sort(function(a, b) { return b - a; });
    return ratios.length === 3 && ratios[1] > 0 ? ratios[0] / ratios[1] - 1 : 0;
  }

  function randomIndex(length, random) {
    return Math.min(length - 1, Math.floor(clamp(random(), 0, 0.999999) * length));
  }

  function generateOffers(difficulty, random) {
    random = typeof random === "function" ? random : Math.random;
    const config = difficultyConfig(difficulty);
    const all = [];
    for (let price = 3; price <= 12; price += 1) {
      for (let food = 5; food <= 24; food += 1) all.push({ food: food, price: price });
    }
    for (let attempt = 0; attempt < 120; attempt += 1) {
      const best = all[randomIndex(all.length, random)];
      const bestRatio = offerRatio(best);
      const candidates = all.filter(function(offer) {
        const ratio = offerRatio(offer);
        const gap = bestRatio / ratio - 1;
        return gap >= config.minGap && gap <= config.minGap + 0.10
          && (offer.food !== best.food || offer.price !== best.price);
      });
      if (candidates.length < 2) continue;
      const second = candidates[randomIndex(candidates.length, random)];
      const remaining = candidates.filter(function(offer) {
        return offer.food !== second.food || offer.price !== second.price;
      });
      if (!remaining.length) continue;
      const third = remaining[randomIndex(remaining.length, random)];
      const offers = [best, second, third].map(function(offer) {
        return { food: offer.food, price: offer.price };
      });
      for (let index = offers.length - 1; index > 0; index -= 1) {
        const swap = randomIndex(index + 1, random);
        const held = offers[index]; offers[index] = offers[swap]; offers[swap] = held;
      }
      if (qualityGap(offers) + 1e-9 >= config.minGap) return offers;
    }
    return [{ food: 12, price: 4 }, { food: 9, price: 4 }, { food: 10, price: 5 }];
  }

  function scoreRound(bestIndex, bernardoChoice, bernardoAt, cannelleChoice, cannelleAt) {
    const bernardoCorrect = bernardoChoice === bestIndex;
    const cannelleCorrect = cannelleChoice === bestIndex;
    let bernardo = bernardoCorrect ? 1 : 0;
    let cannelle = cannelleCorrect ? 1 : 0;
    if (bernardoCorrect && (!cannelleCorrect || bernardoAt <= cannelleAt)) bernardo += 1;
    else if (cannelleCorrect) cannelle += 1;
    return Object.freeze({ bernardo: bernardo, cannelle: cannelle });
  }

  function chooseCannelleOffer(offers, difficulty, random) {
    random = typeof random === "function" ? random : Math.random;
    const best = bestOfferIndex(offers);
    if (random() < difficultyConfig(difficulty).accuracy) return best;
    const wrong = [0, 1, 2].filter(function(index) { return index !== best; });
    return wrong[randomIndex(wrong.length, random)];
  }

  function cannelleDelayMs(difficulty, random) {
    random = typeof random === "function" ? random : Math.random;
    const config = difficultyConfig(difficulty);
    return Math.round(config.minDelayMs + clamp(random(), 0, 1) * (config.maxDelayMs - config.minDelayMs));
  }

  function remainingCooldown(nextAt, now) {
    return Math.max(0, (Number(nextAt) || 0) - (Number.isFinite(now) ? now : Date.now()));
  }

  function commitCooldown(state, now) {
    if (!state || typeof state !== "object") return 0;
    const startedAt = Number.isFinite(now) ? now : Date.now();
    state.cannelleBargainNextAt = startedAt + COOLDOWN_MS;
    return state.cannelleBargainNextAt;
  }

  function creditReward(state, transaction, difficulty, won) {
    if (!state || !transaction || transaction.rewardCredited || !won) return 0;
    const reward = Math.max(1, Math.floor(Number(difficulty) || 1));
    transaction.rewardCredited = true;
    state.cannelleTokens = Math.max(0, Number(state.cannelleTokens) || 0) + reward;
    return reward;
  }

  CatInc.data.cannelleBargain = Object.freeze({
    COOLDOWN_MS: COOLDOWN_MS,
    NORMAL_ROUNDS: NORMAL_ROUNDS,
    ROUND_DURATION_MS: ROUND_DURATION_MS,
    difficultyConfig: difficultyConfig,
    unlockedDifficulties: unlockedDifficulties,
    offerRatio: offerRatio,
    bestOfferIndex: bestOfferIndex,
    qualityGap: qualityGap,
    generateOffers: generateOffers,
    scoreRound: scoreRound,
    chooseCannelleOffer: chooseCannelleOffer,
    cannelleDelayMs: cannelleDelayMs,
    remainingCooldown: remainingCooldown,
    commitCooldown: commitCooldown,
    creditReward: creditReward
  });
})(typeof window !== "undefined" ? window : globalThis);
