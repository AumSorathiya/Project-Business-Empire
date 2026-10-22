import { Selectors } from "../app/selectors.js";
import { evaluateProgression } from "../progression/unlocks.js";
import { evaluateAchievements } from "../progression/achievement-service.js";
import { MarketEngine } from "./market-simulation.js";
import { INSIGNIA_DEFINITIONS } from "../data/insignias-data.js";

let lastMarketTickTime = 0;

/**
 * Advances the simulation by a specified elapsed wall-clock duration in seconds.
 * Purely deterministic based on state and elapsed duration.
 * @param {object} state - mutable authoritative game state
 * @param {number} elapsedSeconds - elapsed duration
 * @returns {object} { deltaCash, netIncomePerSecond, progression, newAchievements, newInsignias }
 */
export function simulateTick(state, elapsedSeconds) {
  if (!state || !Number.isFinite(elapsedSeconds) || elapsedSeconds <= 0) {
    return {
      deltaCash: 0,
      netIncomePerSecond: Selectors.getPortfolioNetIncomePerSecond(state),
      progression: { levelUp: false },
      newAchievements: [],
      newInsignias: []
    };
  }

  // Prevent absurd anomalous spikes while preserving accuracy
  const clampedElapsed = Math.min(elapsedSeconds, 86400);

  const netIncomePerSecond = Selectors.getPortfolioNetIncomePerSecond(state);
  const deltaCash = netIncomePerSecond * clampedElapsed;

  if (deltaCash > 0) {
    state.cash += deltaCash;
    state.lifetimeEarnings += deltaCash;
    state.businessEarningsLifetime = (state.businessEarningsLifetime || 0) + deltaCash;
  }

  if (!state.statistics) state.statistics = {};
  state.statistics.totalPlaySeconds = (state.statistics.totalPlaySeconds || 0) + clampedElapsed;

  // Market tick: update stock & crypto prices periodically (every ~3 seconds of elapsed simulation time)
  const now = Date.now();
  if (now - lastMarketTickTime > 3000) {
    lastMarketTickTime = now;
    MarketEngine.simulateMarketTick(state);
  }

  // Progression & Level evaluation
  const totalBusinesses = Selectors.getTotalBusinessesOwned(state);
  const progression = evaluateProgression(state, totalBusinesses);
  if (progression.levelUp) {
    state.empireLevel = progression.newLevel;
    for (const bizId of progression.newUnlocks) {
      if (!state.unlockedBusinessIds.includes(bizId)) {
        state.unlockedBusinessIds.push(bizId);
      }
    }
  }

  // Achievement evaluation
  const newAchievements = evaluateAchievements(state);

  // Insignias evaluation
  const newInsignias = [];
  if (!Array.isArray(state.unlockedInsigniaIds)) {
    state.unlockedInsigniaIds = [];
  }
  const currentNetWorth = Selectors.getNetWorth(state);
  const isFullBuyout = MarketEngine.isFullStockBuyout(state);

  for (const insignia of INSIGNIA_DEFINITIONS) {
    if (!state.unlockedInsigniaIds.includes(insignia.id)) {
      if (insignia.checkUnlock(state, currentNetWorth, isFullBuyout)) {
        state.unlockedInsigniaIds.push(insignia.id);
        newInsignias.push(insignia);
      }
    }
  }

  return {
    deltaCash,
    netIncomePerSecond,
    progression,
    newAchievements,
    newInsignias
  };
}
