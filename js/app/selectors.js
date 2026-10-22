/* ==========================================================================
   Empire Architect: Authoritative State Selectors
   Pure functions deriving state without mutating it
   ========================================================================== */

import { BUSINESS_MAP } from "../data/businesses.js";
import { UPGRADE_MAP } from "../data/upgrades.js";
import {
  calculateBusinessCost,
  calculateUpgradeCost,
  calculateBusinessNetIncome,
  calculateBusinessMultiplier,
  calculatePortfolioNetIncome,
  calculateTotalInvestedCapital,
  calculatePaybackSeconds
} from "../engine/economy.js";
import { BusinessLogic } from "../engine/business-logic.js";
import { MarketEngine } from "../engine/market-simulation.js";
import { STOCK_MAP } from "../data/stocks-data.js";
import { REAL_ESTATE_MAP } from "../data/real-estate-data.js";
import { LUXURY_MAP } from "../data/luxury-data.js";

export const Selectors = {
  getBusinessQuantity(state, businessId) {
    if (!state || !state.businesses) return 0;
    const found = state.businesses.find(b => b.businessId === businessId);
    return found ? found.quantity : 0;
  },

  getUpgradeLevel(state, upgradeId) {
    if (!state || !state.upgrades) return 0;
    return state.upgrades[upgradeId] || 0;
  },

  isBusinessUnlocked(state, businessId) {
    if (!state) return false;
    if (state.unlockedBusinessIds && state.unlockedBusinessIds.includes(businessId)) {
      return true;
    }
    const def = BUSINESS_MAP.get(businessId);
    if (!def) return false;
    return state.empireLevel >= (def.unlock?.minimumLevel || 1);
  },

  isUpgradeUnlocked(state, upgradeId) {
    const def = UPGRADE_MAP.get(upgradeId);
    if (!def) return false;
    return Selectors.isBusinessUnlocked(state, def.businessId) &&
           state.empireLevel >= (def.unlockLevel || 1);
  },

  getBusinessMultiplier(state, businessId) {
    return calculateBusinessMultiplier(businessId, state.upgrades || {});
  },

  getBusinessNetIncomePerSecond(state, businessId) {
    const def = BUSINESS_MAP.get(businessId);
    if (!def) return 0;
    const qty = Selectors.getBusinessQuantity(state, businessId);
    return calculateBusinessNetIncome(def, qty, state.upgrades || {});
  },

  /**
   * Portfolio Net Income Per Second (Aggregates Businesses, Stock Dividends, and Real Estate Rent)
   */
  getPortfolioNetIncomePerSecond(state) {
    if (!state) return 0;
    // 1. Classic businesses income (for backward compatibility)
    let totalPerSecond = calculatePortfolioNetIncome(state.businesses || [], state.upgrades || {});

    // 2. Business Empire 21-slots owned businesses
    if (Array.isArray(state.ownedBusinesses)) {
      for (const biz of state.ownedBusinesses) {
        const hourly = BusinessLogic.calculateInstanceIncomePerHour(biz);
        totalPerSecond += hourly / 3600;
      }
    }

    // 3. Stock dividends (converted from hourly to per second)
    const stockHourly = MarketEngine.calculateStockDividendsPerHour(state);
    totalPerSecond += stockHourly / 3600;

    // 4. Real estate rental yield (converted from hourly to per second)
    const rentHourly = MarketEngine.calculateRealEstateRentPerHour(state);
    totalPerSecond += rentHourly / 3600;

    return totalPerSecond;
  },

  getPortfolioHourlyIncome(state) {
    return Math.round(Selectors.getPortfolioNetIncomePerSecond(state) * 3600);
  },

  getTotalBusinessesOwned(state) {
    if (!state) return 0;
    const classicCount = (state.businesses || []).reduce((sum, b) => sum + (b.quantity || 0), 0);
    const modernCount = Array.isArray(state.ownedBusinesses) ? state.ownedBusinesses.length : 0;
    return classicCount + modernCount;
  },

  getOwnedBusinessSlotsCount(state) {
    if (!state || !Array.isArray(state.ownedBusinesses)) return 0;
    return state.ownedBusinesses.length;
  },

  getDistinctBusinessesOwned(state) {
    if (!state || !state.businesses) return 0;
    return state.businesses.filter(b => b.quantity > 0).length;
  },

  /**
   * Aggregate Total Net Worth (Cash + Businesses + Stocks + Crypto + Real Estate + Luxury)
   */
  getNetWorth(state) {
    if (!state) return 0;
    const cash = state.cash || 0;

    // 1. Classic businesses capital invested
    const classicInvested = calculateTotalInvestedCapital(state.businesses || [], state.upgrades || {});

    // 2. Owned businesses capital invested
    let modernInvested = 0;
    if (Array.isArray(state.ownedBusinesses)) {
      for (const b of state.ownedBusinesses) {
        modernInvested += (b.totalInvested || 0);
      }
    }

    // 3. Stock portfolio valuation
    let stockValuation = 0;
    if (state.stockPortfolio && state.stockPrices) {
      for (const [ticker, shares] of Object.entries(state.stockPortfolio)) {
        if (shares > 0) {
          const price = state.stockPrices[ticker] || (STOCK_MAP.get(ticker)?.basePrice || 0);
          stockValuation += shares * price;
        }
      }
    }

    // 4. Crypto portfolio valuation
    const cryptoValuation = MarketEngine.getCryptoPortfolioValue(state);

    // 5. Real estate property valuation
    let realEstateValuation = 0;
    if (state.ownedProperties) {
      for (const [propId, level] of Object.entries(state.ownedProperties)) {
        const prop = REAL_ESTATE_MAP.get(propId);
        if (prop && level > 0) {
          realEstateValuation += prop.baseCost;
          for (let l = 1; l < level; l++) {
            realEstateValuation += Math.floor(prop.upgradeCostBase * Math.pow(1.3, l - 1));
          }
        }
      }
    }

    // 6. Luxury collection valuation
    const luxuryValuation = MarketEngine.getLuxuryCollectionValue(state);

    return Math.floor(cash + classicInvested + modernInvested + stockValuation + cryptoValuation + realEstateValuation + luxuryValuation);
  },

  getBusinessCost(state, businessId, count = 1) {
    const def = BUSINESS_MAP.get(businessId);
    if (!def) return Infinity;
    const currentQty = Selectors.getBusinessQuantity(state, businessId);
    return calculateBusinessCost(def, currentQty, count);
  },

  getUpgradeCost(state, upgradeId) {
    const def = UPGRADE_MAP.get(upgradeId);
    if (!def) return Infinity;
    const currentLevel = Selectors.getUpgradeLevel(state, upgradeId);
    return calculateUpgradeCost(def, currentLevel);
  },

  getBusinessPurchasePayback(state, businessId, count = 1) {
    const def = BUSINESS_MAP.get(businessId);
    if (!def) return Infinity;
    const cost = Selectors.getBusinessCost(state, businessId, count);
    const multiplier = Selectors.getBusinessMultiplier(state, businessId);
    const deltaIncome = count * def.baseNetIncomePerSecond * multiplier;
    return calculatePaybackSeconds(cost, deltaIncome);
  },

  getUpgradePayback(state, upgradeId) {
    const uDef = UPGRADE_MAP.get(upgradeId);
    if (!uDef) return Infinity;
    const cost = Selectors.getUpgradeCost(state, upgradeId);
    const bDef = BUSINESS_MAP.get(uDef.businessId);
    if (!bDef) return Infinity;
    const qty = Selectors.getBusinessQuantity(state, uDef.businessId);
    if (qty === 0) return Infinity;
    const deltaIncome = qty * bDef.baseNetIncomePerSecond * uDef.effectPerLevel;
    return calculatePaybackSeconds(cost, deltaIncome);
  }
};
