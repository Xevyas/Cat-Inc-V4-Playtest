(function(root) {
  "use strict";

  const CatInc = root.CatInc = root.CatInc || {};
  CatInc.data = CatInc.data || {};

  const TUNING = CatInc.data.campGameplay && CatInc.data.campGameplay.cannelleBargain;
  if (!TUNING) throw new Error("Cannelle's Bargain requires canonical Gameplay & Balance data");

  function clamp(value, min, max) {
    return Math.max(min, Math.min(max, value));
  }

  function difficultyConfig(difficulty) {
    const level = Math.max(1, Math.floor(Number(difficulty) || 1));
    const authored = TUNING.difficulties[level - 1];
    if (authored) return Object.freeze({
      minDelayMs: Math.round(authored.minDelaySeconds * 1000),
      maxDelayMs: Math.round(authored.maxDelaySeconds * 1000),
      accuracy: authored.accuracyPercent / 100,
      minGap: authored.minGapPercent / 100
    });
    const base = TUNING.difficulties[TUNING.difficulties.length - 1];
    const later = TUNING.laterDifficulty;
    const extra = level - TUNING.difficulties.length;
    return Object.freeze({
      minDelayMs: Math.round(Math.max(later.minDelayFloorSeconds, base.minDelaySeconds - extra * later.minDelayStepSeconds) * 1000),
      maxDelayMs: Math.round(Math.max(later.maxDelayFloorSeconds, base.maxDelaySeconds - extra * later.maxDelayStepSeconds) * 1000),
      accuracy: Math.min(later.accuracyCeilingPercent, base.accuracyPercent + extra * later.accuracyStepPercent) / 100,
      minGap: Math.max(later.minGapFloorPercent, base.minGapPercent - extra * later.minGapStepPercent) / 100
    });
  }

  function roundDurationMs() {
    return TUNING.roundSeconds * 1000;
  }

  function cooldownMs() {
    return TUNING.cooldownHours * 60 * 60 * 1000;
  }

  function normalRounds() {
    return TUNING.rounds;
  }

  function unlockedDifficulties(cannelleLevel) {
    const count = Math.max(0, Math.floor((Number(cannelleLevel) || 0) / TUNING.unlockLevelStep));
    return Array.from({ length: count }, function(_, index) { return index + 1; });
  }

  function offerRatio(offer) {
    return Number(offer.food) / Number(offer.price);
  }

  function bestOfferIndex(offers) {
    if (!Array.isArray(offers) || offers.length !== TUNING.offersPerRound) return -1;
    let best = 0;
    for (let index = 1; index < offers.length; index += 1) {
      if (offerRatio(offers[index]) > offerRatio(offers[best])) best = index;
    }
    return best;
  }

  function qualityGap(offers) {
    const ratios = offers.map(offerRatio).sort(function(a, b) { return b - a; });
    return ratios.length === TUNING.offersPerRound && ratios[1] > 0 ? ratios[0] / ratios[1] - 1 : 0;
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
    state.cannelleBargainNextAt = startedAt + cooldownMs();
    return state.cannelleBargainNextAt;
  }

  function creditReward(state, transaction, difficulty, won) {
    if (!state || !transaction || transaction.rewardCredited || !won) return 0;
    const reward = Math.max(1, Math.floor(Number(difficulty) || 1)) * TUNING.rewardPerDifficulty;
    transaction.rewardCredited = true;
    state.cannelleTokens = Math.max(0, Number(state.cannelleTokens) || 0) + reward;
    return reward;
  }

  CatInc.data.cannelleBargain = Object.freeze({
    roundDurationMs: roundDurationMs,
    cooldownMs: cooldownMs,
    normalRounds: normalRounds,
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
