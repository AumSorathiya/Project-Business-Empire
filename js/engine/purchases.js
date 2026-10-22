/* ==========================================================================
   Empire Architect: Central Purchase Service
   Atomic, validated purchasing transactions per Architecture.md
   ========================================================================== */

import { BUSINESS_MAP } from "../data/businesses.js";
import { Selectors } from "../app/selectors.js";

/**
 * Execute an atomic purchase transaction.
 * @param {object} state - authoritative game state
 * @param {string} businessId
 * @param {number} count (default 1)
 * @returns {object} { success: boolean, reason?: string, cost?: number, newQuantity?: number, businessDef?: object }
 */
export function executePurchaseTransaction(state, businessId, count = 1) {
  if (!state) {
    return { success: false, reason: "Game state is not initialized." };
  }

  const businessDef = BUSINESS_MAP.get(businessId);
  if (!businessDef) {
    return { success: false, reason: `Unknown business ID: ${businessId}` };
  }

  if (!Selectors.isBusinessUnlocked(state, businessId)) {
    return { success: false, reason: `${businessDef.name} is currently locked.` };
  }

  if (!Number.isInteger(count) || count <= 0) {
    return { success: false, reason: "Invalid purchase count." };
  }

  const cost = Selectors.getBusinessCost(state, businessId, count);
  if (!Number.isFinite(cost) || cost <= 0) {
    return { success: false, reason: "Invalid business cost calculation." };
  }

  if (state.cash < cost) {
    return {
      success: false,
      reason: `Insufficient credits. Required: ${cost}, available: ${Math.floor(state.cash)}`
    };
  }

  // Preconditions passed: execute atomic transaction
  state.cash -= cost;

  let playerBusiness = state.businesses.find(b => b.businessId === businessId);
  if (!playerBusiness) {
    playerBusiness = { businessId, quantity: 0 };
    state.businesses.push(playerBusiness);
  }

  playerBusiness.quantity += count;

  if (!state.statistics) state.statistics = {};
  state.statistics.totalPurchases = (state.statistics.totalPurchases || 0) + count;

  return {
    success: true,
    cost,
    newQuantity: playerBusiness.quantity,
    businessDef
  };
}
