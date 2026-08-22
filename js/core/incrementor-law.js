(function(root) {
  "use strict";

  const CatInc = root.CatInc = root.CatInc || {};
  const GAMEPLAY = CatInc.data && CatInc.data.campGameplay;
  if (!GAMEPLAY || !GAMEPLAY.definitions) {
    throw new Error("CatInc.data.campGameplay must be loaded before the Incrementor Law.");
  }
  const DEFINITIONS = Object.freeze(Object.keys(GAMEPLAY.definitions).reduce(function(resultat, typeId) {
    const definitionGameplay = GAMEPLAY.definitions[typeId];
    if (definitionGameplay && definitionGameplay.repeatable && definitionGameplay.law) {
      resultat[typeId] = definitionGameplay.law;
    }
    return resultat;
  }, {}));

  function entierPositif(value, fallback) {
    const nombre = Number(value);
    return Number.isInteger(nombre) && nombre > 0 ? nombre : fallback;
  }

  function arrondir(value, mode) {
    if (mode === "floor") return Math.floor(value);
    if (mode === "round") return Math.round(value);
    return Math.ceil(value);
  }

  function copierCouts(costs) {
    if (!costs || typeof costs !== "object" || Array.isArray(costs)) return {};
    return Object.keys(costs).reduce(function(resultat, resourceId) {
      const valeur = Number(costs[resourceId]);
      if (Number.isFinite(valeur) && valeur >= 0) resultat[resourceId] = valeur;
      return resultat;
    }, {});
  }

  function definition(typeId) {
    return DEFINITIONS[typeId] || null;
  }

  function rangSuivant(nombrePossede, nombreEngage) {
    const possede = Math.max(0, Math.floor(Number(nombrePossede) || 0));
    const engage = Math.max(0, Math.floor(Number(nombreEngage) || 0));
    return possede + engage + 1;
  }

  function coutPourRang(typeId, rank, options) {
    const config = definition(typeId);
    if (!config) return null;
    const rang = entierPositif(rank, 1);
    const reglages = options || {};
    const croissance = Number.isFinite(Number(reglages.growth)) && Number(reglages.growth) > 0
      ? Number(reglages.growth)
      : config.growth;
    const multiplicateur = Number.isFinite(Number(reglages.multiplier)) && Number(reglages.multiplier) >= 0
      ? Number(reglages.multiplier)
      : 1;
    const coutsAuteurs = config.authoredRanks[rang];
    const coutsBase = coutsAuteurs || Object.keys(config.baseCosts).reduce(function(resultat, resourceId) {
      resultat[resourceId] = config.baseCosts[resourceId] * Math.pow(croissance, rang - 1);
      return resultat;
    }, {});
    return Object.keys(coutsBase).reduce(function(resultat, resourceId) {
      const montantCanonique = Number(coutsBase[resourceId]) || 0;
      resultat[resourceId] = montantCanonique === 0
        ? 0
        : Math.max(1, arrondir(montantCanonique * multiplicateur, config.rounding));
      return resultat;
    }, {});
  }

  // Tier actions share the same authored rounding as Tier 1 construction,
  // but do not belong to a Law family of their own.
  function coutsEchelles(costs, rank, growth, rounding) {
    const rang = entierPositif(rank, 1);
    const facteur = Number.isFinite(Number(growth)) && Number(growth) > 0
      ? Number(growth) : 1;
    return Object.keys(copierCouts(costs)).reduce(function(resultat, resourceId) {
      const base = Number(costs[resourceId]) || 0;
      resultat[resourceId] = base === 0 ? 0 : Math.max(1,
        arrondir(base * Math.pow(facteur, rang - 1), rounding || "ceil"));
      return resultat;
    }, {});
  }

  function valeurEchelonnee(value, rank, growth, rounding) {
    const rang = entierPositif(rank, 1);
    const facteur = Number.isFinite(Number(growth)) && Number(growth) > 0
      ? Number(growth) : 1;
    return Math.max(1, arrondir((Number(value) || 0) * Math.pow(facteur, rang - 1), rounding || "ceil"));
  }

  function remboursement(typeId, paidCosts, options) {
    const config = definition(typeId);
    if (!config) return {};
    const couts = copierCouts(paidCosts);
    const requestedRate = Number(options && options.refundRate);
    const refundRate = Number.isFinite(requestedRate) && requestedRate >= 0 && requestedRate <= 1
      ? requestedRate
      : config.refundRate;
    return Object.keys(couts).reduce(function(resultat, resourceId) {
      resultat[resourceId] = Math.min(couts[resourceId], Math.floor(couts[resourceId] * refundRate));
      return resultat;
    }, {});
  }

  CatInc.incrementorLaw = Object.freeze({
    definitions: DEFINITIONS,
    definition: definition,
    nextRank: rangSuivant,
    costForRank: coutPourRang,
    scaleCosts: coutsEchelles,
    scaleValue: valeurEchelonnee,
    copyCosts: copierCouts,
    refundForPaidCosts: remboursement
  });
})(typeof window !== "undefined" ? window : globalThis);
