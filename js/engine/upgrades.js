/* ==========================================================================
   Empire Architect: Central Upgrade Service
   Atomic, validated upgrade transactions per Architecture.md
   ========================================================================== */

import { UPGRADE_MAP } from "../data/upgrades.js";
import { Selectors } from "../app/selectors.js";

/**
 * Execute an atomic upgrade transaction.
 * @param {object} state - authoritative game state
 * @param {string} upgradeId
 * @returns {object} { success: boolean, reason?: string, cost?: number, newLevel?: number, upgradeDef?: object }
 */
export function executeUpgradeTransaction(state, upgradeId) {
  if (!state) {
    return { success: false, reason: "Game state is not initialized." };
  }

  const upgradeDef = UPGRADE_MAP.get(upgradeId);
  if (!upgradeDef) {
    return { success: false, reason: `Unknown upgrade ID: ${upgradeId}` };
  }

  if (!Selectors.isUpgradeUnlocked(state, upgradeId)) {
    return { success: false, reason: `${upgradeDef.name} is currently locked.` };
  }

  const currentLevel = Selectors.getUpgradeLevel(state, upgradeId);
  if (currentLevel >= upgradeDef.maxLevel) {
    return { success: false, reason: `${upgradeDef.name} is already at maximum level (${upgradeDef.maxLevel}).` };
  }

  const cost = Selectors.getUpgradeCost(state, upgradeId);
  if (!Number.isFinite(cost) || cost <= 0) {
    return { success: false, reason: "Invalid upgrade cost calculation." };
  }

  if (state.cash < cost) {
    return {
      success: false,
      reason: `Insufficient credits. Required: ${cost}, available: ${Math.floor(state.cash)}`
    };
  }

  // Preconditions passed: execute atomic transaction
  state.cash -= cost;

  if (!state.upgrades) state.upgrades = {};
  state.upgrades[upgradeId] = currentLevel + 1;

  if (!state.statistics) state.statistics = {};
  state.statistics.totalUpgrades = (state.statistics.totalUpgrades || 0) + 1;

  return {
    success: true,
    cost,
    newLevel: state.upgrades[upgradeId],
    upgradeDef
  };
}
