/* ==========================================================================
   Empire Architect: Central Economy Engine
   Authoritative calculations for costs, multipliers, income, and payback
   ========================================================================== */

import { BUSINESS_MAP } from "../data/businesses.js";
import { UPGRADE_MAP, UPGRADE_DEFINITIONS } from "../data/upgrades.js";

/**
 * Calculate the purchase cost for buying `count` units of a business.
 * @param {object} businessDef
 * @param {number} currentQuantity
 * @param {number} count (e.g. 1, 10, 100)
 * @returns {number}
 */
export function calculateBusinessCost(businessDef, currentQuantity = 0, count = 1) {
  if (!businessDef || count <= 0) return 0;
  let total = 0;
  for (let i = 0; i < count; i++) {
    const unitCost = Math.floor(businessDef.baseCost * Math.pow(businessDef.costGrowthRate, currentQuantity + i));
    total += unitCost;
  }
  return total;
}

/**
 * Calculate the cost of the next upgrade level.
 * @param {object} upgradeDef
 * @param {number} currentLevel
 * @returns {number}
 */
export function calculateUpgradeCost(upgradeDef, currentLevel = 0) {
  if (!upgradeDef) return 0;
  if (currentLevel >= upgradeDef.maxLevel) return Infinity;
  return Math.floor(upgradeDef.baseCost * Math.pow(upgradeDef.costGrowthRate, currentLevel));
}

/**
 * Calculate the cumulative income multiplier for a business from all its upgrades.
 * @param {string} businessId
 * @param {object} upgradeLevelsMap - Map or object { [upgradeId]: level }
 * @returns {number}
 */
export function calculateBusinessMultiplier(businessId, upgradeLevelsMap = {}) {
  let bonus = 0;
  for (const upgrade of UPGRADE_DEFINITIONS) {
    if (upgrade.businessId === businessId) {
      const level = upgradeLevelsMap[upgrade.id] || 0;
      bonus += level * upgrade.effectPerLevel;
    }
  }
  return 1 + bonus;
}

/**
 * Calculate the net income per second for a single business.
 * @param {object} businessDef
 * @param {number} quantity
 * @param {object} upgradeLevelsMap
 * @returns {number}
 */
export function calculateBusinessNetIncome(businessDef, quantity = 0, upgradeLevelsMap = {}) {
  if (!businessDef || quantity <= 0) return 0;
  const multiplier = calculateBusinessMultiplier(businessDef.id, upgradeLevelsMap);
  return quantity * businessDef.baseNetIncomePerSecond * multiplier;
}

/**
 * Calculate the payback time in seconds for an investment.
 * @param {number} cost
 * @param {number} deltaIncomePerSecond
 * @returns {number} seconds to break even
 */
export function calculatePaybackSeconds(cost, deltaIncomePerSecond) {
  if (!Number.isFinite(cost) || cost <= 0) return 0;
  if (!Number.isFinite(deltaIncomePerSecond) || deltaIncomePerSecond <= 0) return Infinity;
  return cost / deltaIncomePerSecond;
}

/**
 * Calculate total portfolio net income per second across all owned businesses.
 * @param {Array} playerBusinesses - Array of { businessId, quantity }
 * @param {object} playerUpgrades - { [upgradeId]: level }
 * @returns {number}
 */
export function calculatePortfolioNetIncome(playerBusinesses = [], playerUpgrades = {}) {
  let totalIncome = 0;
  for (const pb of playerBusinesses) {
    const bDef = BUSINESS_MAP.get(pb.businessId);
    if (bDef && pb.quantity > 0) {
      totalIncome += calculateBusinessNetIncome(bDef, pb.quantity, playerUpgrades);
    }
  }
  return totalIncome;
}

/**
 * Calculate total invested capital in businesses and upgrades (cost basis).
 * @param {Array} playerBusinesses
 * @param {object} playerUpgrades
 * @returns {number}
 */
export function calculateTotalInvestedCapital(playerBusinesses = [], playerUpgrades = {}) {
  let invested = 0;

  // Sum cost of owned businesses
  for (const pb of playerBusinesses) {
    const bDef = BUSINESS_MAP.get(pb.businessId);
    if (bDef && pb.quantity > 0) {
      for (let i = 0; i < pb.quantity; i++) {
        invested += Math.floor(bDef.baseCost * Math.pow(bDef.costGrowthRate, i));
      }
    }
  }

  // Sum cost of upgrades
  for (const [upgradeId, level] of Object.entries(playerUpgrades)) {
    const uDef = UPGRADE_MAP.get(upgradeId);
    if (uDef && level > 0) {
      for (let l = 0; l < level; l++) {
        invested += Math.floor(uDef.baseCost * Math.pow(uDef.costGrowthRate, l));
      }
    }
  }

  return invested;
}
