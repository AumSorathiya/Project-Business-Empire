/* ==========================================================================
   Empire Architect: Offline Earnings Service
   Calculates and applies capped offline earnings per Architecture.md & Rules.md
   ========================================================================== */

import { BALANCE } from "../data/balance.js";
import { Selectors } from "../app/selectors.js";

/**
 * Centrally processes offline earnings once upon return.
 * @param {object} state - Authoritative mutable game state
 * @param {number} currentTime - current epoch ms (default Date.now())
 * @returns {object} { awarded: boolean, elapsedSeconds: number, eligibleSeconds: number, creditsEarned: number, wasCapped: boolean, incomeRate: number }
 */
export function processOfflineEarnings(state, currentTime = Date.now()) {
  if (!state) {
    return { awarded: false, elapsedSeconds: 0, eligibleSeconds: 0, creditsEarned: 0, wasCapped: false, incomeRate: 0 };
  }

  const previousTimestamp = state.lastOfflineProcessedAt || state.lastSavedAt || state.createdAt || currentTime;
  const elapsedMs = Math.max(0, currentTime - previousTimestamp);
  const elapsedSeconds = elapsedMs / 1000;

  // Always advance the offline processed timestamp to prevent double credits
  state.lastOfflineProcessedAt = currentTime;

  // Check if absence is long enough to consider offline
  if (elapsedSeconds < BALANCE.minOfflineThresholdSeconds) {
    return {
      awarded: false,
      elapsedSeconds,
      eligibleSeconds: 0,
      creditsEarned: 0,
      wasCapped: false,
      incomeRate: 0
    };
  }

  const incomeRate = Selectors.getPortfolioNetIncomePerSecond(state);
  if (incomeRate <= 0) {
    return {
      awarded: false,
      elapsedSeconds,
      eligibleSeconds: 0,
      creditsEarned: 0,
      wasCapped: false,
      incomeRate: 0
    };
  }

  const wasCapped = elapsedSeconds > BALANCE.offlineEarningsCapSeconds;
  const eligibleSeconds = Math.min(elapsedSeconds, BALANCE.offlineEarningsCapSeconds);
  const creditsEarned = Math.floor(eligibleSeconds * incomeRate * BALANCE.offlineEarningsRate);

  if (creditsEarned > 0) {
    state.cash += creditsEarned;
    state.lifetimeEarnings += creditsEarned;
  }

  return {
    awarded: creditsEarned > 0,
    elapsedSeconds,
    eligibleSeconds,
    creditsEarned,
    wasCapped,
    incomeRate
  };
}
