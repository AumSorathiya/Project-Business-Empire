/* ==========================================================================
   Empire Architect: Game Actions
   Centralized transaction dispatchers coordinating engine and state
   ========================================================================== */

import { executePurchaseTransaction } from "../engine/purchases.js";
import { executeUpgradeTransaction } from "../engine/upgrades.js";
import { BusinessLogic } from "../engine/business-logic.js";
import { MarketEngine } from "../engine/market-simulation.js";
import { SaveManager } from "../persistence/save-manager.js";

export const GameActions = {
  // Classic compatibility
  purchaseBusiness(state, businessId, count = 1) {
    return executePurchaseTransaction(state, businessId, count);
  },

  purchaseUpgrade(state, upgradeId) {
    return executeUpgradeTransaction(state, upgradeId);
  },

  // -------------------------------------------------------------
  // BUSINESS EMPIRE 4-PILLAR ACTIONS
  // -------------------------------------------------------------
  tapToEarn(state) {
    if (!state) return { success: false };
    const amount = 1.00; // $1.00 per tap
    state.cash = (state.cash || 0) + amount;
    state.lifetimeEarnings = (state.lifetimeEarnings || 0) + amount;
    state.tapCount = (state.tapCount || 0) + 1;
    if (!state.statistics) state.statistics = {};
    state.statistics.totalTaps = (state.statistics.totalTaps || 0) + 1;
    return { success: true, reward: amount };
  },

  openNewBusiness(state, businessTypeId) {
    return BusinessLogic.openBusiness(state, businessTypeId);
  },

  upgradeBusinessInstance(state, instanceId) {
    return BusinessLogic.upgradeBusiness(state, instanceId);
  },

  executeMerger(state, mergerTypeId) {
    return BusinessLogic.executeMerger(state, mergerTypeId);
  },

  setBankInterestRates(state, instanceId, depositInterest, creditInterest) {
    const inst = (state.ownedBusinesses || []).find(b => b.id === instanceId);
    if (!inst || !inst.bankData) return { success: false, error: "Not a valid bank." };
    inst.bankData.depositInterest = Math.max(0.1, Math.min(15.0, Number(depositInterest)));
    inst.bankData.creditInterest = Math.max(0.1, Math.min(25.0, Number(creditInterest)));
    return { success: true };
  },

  buyStock(state, ticker, count = 1) {
    return MarketEngine.buyStock(state, ticker, count);
  },

  sellStock(state, ticker, count = 1) {
    return MarketEngine.sellStock(state, ticker, count);
  },

  buyCrypto(state, symbol, amountDollars) {
    return MarketEngine.buyCrypto(state, symbol, amountDollars);
  },

  sellCrypto(state, symbol, pct = 1.0) {
    return MarketEngine.sellCrypto(state, symbol, pct);
  },

  buyProperty(state, propertyId) {
    return MarketEngine.buyProperty(state, propertyId);
  },

  upgradeProperty(state, propertyId) {
    return MarketEngine.upgradeProperty(state, propertyId);
  },

  sellProperty(state, propertyId) {
    return MarketEngine.sellProperty(state, propertyId);
  },

  buyLuxury(state, luxuryId) {
    return MarketEngine.buyLuxury(state, luxuryId);
  },

  saveGame(state) {
    return SaveManager.save(state);
  },

  resetGame() {
    return SaveManager.reset();
  },

  updateSetting(state, key, value) {
    if (!state.settings) state.settings = {};
    state.settings[key] = value;
    return SaveManager.save(state);
  },

  executeDeal(state, amount) {
    if (!amount || amount <= 0) return { success: false, reason: "Invalid amount" };
    state.cash += amount;
    state.lifetimeEarnings += amount;
    return { success: true, reward: amount };
  }
};
