/* ==========================================================================
   Empire Architect: Unlock Evaluator
   Centralized unlock logic based on Empire Level
   ========================================================================== */

import { calculateEligibleEmpireLevel, EMPIRE_LEVELS } from "./levels.js";
import { BUSINESS_DEFINITIONS } from "../data/businesses.js";

/**
 * Evaluates whether empire level should increase and unlocks businesses accordingly
 * @param {object} state
 * @param {number} totalBusinessesOwned
 * @returns {object} { levelUp: boolean, newLevel: number, newUnlocks: string[] }
 */
export function evaluateProgression(state, totalBusinessesOwned) {
  const eligibleLevel = calculateEligibleEmpireLevel(state.lifetimeEarnings, totalBusinessesOwned);
  const currentLevel = state.empireLevel || 1;

  if (eligibleLevel <= currentLevel) {
    return { levelUp: false, newLevel: currentLevel, newUnlocks: [] };
  }

  // Collect newly unlocked businesses
  const newlyUnlocked = [];
  const currentUnlocked = new Set(state.unlockedBusinessIds || []);

  for (let lvl = currentLevel + 1; lvl <= eligibleLevel; lvl++) {
    const tier = EMPIRE_LEVELS.find(t => t.level === lvl);
    if (tier && tier.unlocks) {
      for (const bizId of tier.unlocks) {
        if (!currentUnlocked.has(bizId)) {
          newlyUnlocked.push(bizId);
          currentUnlocked.add(bizId);
        }
      }
    }
  }

  return {
    levelUp: true,
    newLevel: eligibleLevel,
    newUnlocks: newlyUnlocked
  };
}
