/* ==========================================================================
   Empire Architect: Achievement Service
   Authoritative achievement evaluation and one-time reward distribution
   ========================================================================== */

import { ACHIEVEMENTS } from "../data/achievements.js";
import { Selectors } from "../app/selectors.js";

/**
 * Centrally evaluates achievements against authoritative game state.
 * Awards rewards atomically and idempotently.
 * @param {object} state - Mutable state object
 * @returns {Array} List of newly awarded achievement objects
 */
export function evaluateAchievements(state) {
  if (!state.completedAchievementIds) {
    state.completedAchievementIds = [];
  }

  const completedSet = new Set(state.completedAchievementIds);
  const newlyUnlocked = [];

  for (const ach of ACHIEVEMENTS) {
    if (completedSet.has(ach.id)) {
      continue;
    }

    try {
      if (ach.check(state, Selectors)) {
        completedSet.add(ach.id);
        state.completedAchievementIds.push(ach.id);

        // Award one-time credit reward
        if (ach.rewardCredits && ach.rewardCredits > 0) {
          state.cash += ach.rewardCredits;
          state.lifetimeEarnings += ach.rewardCredits;
        }

        newlyUnlocked.push(ach);
      }
    } catch (err) {
      console.error(`Error evaluating achievement ${ach.id}:`, err);
    }
  }

  return newlyUnlocked;
}
