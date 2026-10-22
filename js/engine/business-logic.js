/* ==========================================================================
   Business Empire: Specialized Business Logic Engine
   Handles 21-slot allocation, Bank spreads, IT staffing, Mergers, and Upgrades
   ========================================================================== */

import {
  BUSINESS_TYPES,
  BUSINESS_CATALOG_MAP,
  MAX_BUSINESS_SLOTS
} from "../data/business-catalog.js";

export const BusinessLogic = {
  /**
   * Check if player can open another business (under 21 slots)
   */
  canOpenBusiness(state) {
    if (!state || !Array.isArray(state.ownedBusinesses)) return true;
    return state.ownedBusinesses.length < MAX_BUSINESS_SLOTS;
  },

  /**
   * Open a new business instance
   */
  openBusiness(state, businessTypeId) {
    const def = BUSINESS_CATALOG_MAP.get(businessTypeId);
    if (!def) return { success: false, error: "Invalid business type." };
    if (!this.canOpenBusiness(state)) {
      return { success: false, error: `Maximum slot limit reached (${MAX_BUSINESS_SLOTS} businesses).` };
    }
    if (state.cash < def.cost) {
      return { success: false, error: "Insufficient cash." };
    }

    state.cash -= def.cost;

    const instanceId = `${businessTypeId}-${Date.now()}-${Math.floor(Math.random() * 1000)}`;
    const newInstance = {
      id: instanceId,
      type: businessTypeId,
      name: def.name,
      level: 1,
      openedAt: Date.now(),
      totalInvested: def.cost,
      // Custom specialized business states:
      bankData: def.hasBankSliders ? {
        vaultCapacity: 50000000, // Starts at 50M, scales with level to 420B
        vaultCurrent: 50000000,
        depositInterest: 6.30,   // Default optimal community sweetspot
        creditInterest: 9.60
      } : null,
      itData: def.hasITStudio ? {
        seniorDevs: 1,
        designers: 1,
        testers: 1,
        teamLeaders: 1,
        activeProject: "web-crm", // "web-crm", "mobile-app", "game", "os"
        projectProgress: 0,       // 0 to 100%
        projectRequiredPoints: 100
      } : null,
      dealershipData: businessTypeId === BUSINESS_TYPES.CAR_DEALERSHIP ? {
        inventory: [
          { name: "Sedan LX", buyPrice: 14000, condition: 60, repairCost: 4000, targetSale: 24000, repaired: false }
        ]
      } : null,
      airlineData: businessTypeId === BUSINESS_TYPES.AIRLINE ? {
        fleetCount: 5,
        loadFactor: 0.98,
        ticketPriceMultiplier: 1.0
      } : null,
      oilData: businessTypeId === BUSINESS_TYPES.OIL_GAS ? {
        wellsCount: 10,
        lngUnits: 2
      } : null
    };

    if (!Array.isArray(state.ownedBusinesses)) {
      state.ownedBusinesses = [];
    }
    state.ownedBusinesses.push(newInstance);

    return { success: true, instance: newInstance };
  },

  /**
   * Upgrade an owned business instance
   */
  upgradeBusiness(state, instanceId) {
    if (!state || !Array.isArray(state.ownedBusinesses)) return { success: false, error: "No businesses owned." };
    const instance = state.ownedBusinesses.find(b => b.id === instanceId);
    if (!instance) return { success: false, error: "Business not found." };

    const def = BUSINESS_CATALOG_MAP.get(instance.type);
    if (!def) return { success: false, error: "Business definition missing." };
    if (instance.level >= def.maxLevel) return { success: false, error: "Maximum level reached." };

    const upgradeCost = Math.floor(def.upgradeCostBase * Math.pow(def.upgradeCostMultiplier, instance.level - 1));
    if (state.cash < upgradeCost) {
      return { success: false, error: "Insufficient cash." };
    }

    state.cash -= upgradeCost;
    instance.level += 1;
    instance.totalInvested = (instance.totalInvested || 0) + upgradeCost;

    // Scale specialized attributes
    if (instance.bankData) {
      // Vault capacity scales to 420 Billion at Level 30
      instance.bankData.vaultCapacity = Math.floor(50000000 * Math.pow(1.36, instance.level - 1));
      instance.bankData.vaultCurrent = instance.bankData.vaultCapacity;
    }
    if (instance.airlineData) {
      instance.airlineData.fleetCount += 4;
    }
    if (instance.oilData) {
      instance.oilData.wellsCount += 5;
      if (instance.level % 5 === 0) instance.oilData.lngUnits += 1;
    }

    return { success: true, newLevel: instance.level, cost: upgradeCost };
  },

  /**
   * Calculate hourly income for an owned business instance
   */
  calculateInstanceIncomePerHour(instance) {
    if (!instance) return 0;
    const def = BUSINESS_CATALOG_MAP.get(instance.type);
    if (!def) return 0;

    // Base multiplier from level
    const levelMult = 1 + (instance.level - 1) * 0.45;
    let hourly = def.baseIncomePerHour * levelMult;

    // Specialized business adjustments:
    // 1. Bank spread formula
    if (instance.bankData) {
      const dep = instance.bankData.depositInterest || 6.30;
      const cred = instance.bankData.creditInterest || 9.60;
      const vault = instance.bankData.vaultCapacity || 50000000;
      // Spread profit: optimal around 6.30% dep and 9.60% credit yields peak margin (3.30% spread)
      const spread = Math.max(0.1, (cred - dep));
      const penalty = dep > 8.0 ? 0.65 : (cred > 12.0 ? 0.75 : 1.0); // Extreme settings penalty
      const spreadRatio = spread / 3.30;
      const vaultScale = vault / 50000000;
      hourly = Math.floor(def.baseIncomePerHour * spreadRatio * penalty * levelMult * vaultScale);
    }

    // 2. Oil & Gas exponential scaling towards $13B/hr at Level 62
    if (instance.type === BUSINESS_TYPES.OIL_GAS) {
      hourly = Math.floor(def.baseIncomePerHour * Math.pow(1.055, instance.level - 1));
      if (instance.level >= 62) {
        hourly = 13000000000; // Exact $13 Billion per hour at max
      }
    }

    // 3. Holding Company steady $8.7B/hour baseline
    if (instance.type === BUSINESS_TYPES.HOLDING_COMPANY) {
      hourly = Math.floor(8700000000 * (1 + (instance.level - 1) * 0.15));
    }

    return hourly;
  },

  /**
   * Check merger eligibility
   */
  canMerge(state, mergerTypeId) {
    const mergerDef = BUSINESS_CATALOG_MAP.get(mergerTypeId);
    if (!mergerDef || !mergerDef.isMerger) return { eligible: false, reason: "Not a valid merger." };
    if (!this.canOpenBusiness(state) && mergerTypeId !== BUSINESS_TYPES.HOLDING_COMPANY) {
      return { eligible: false, reason: "No business slots available." };
    }
    if (state.cash < mergerDef.requirements.cashCost) {
      return { eligible: false, reason: `Requires $${mergerDef.requirements.cashCost.toLocaleString()} cash.` };
    }

    const owned = state.ownedBusinesses || [];

    for (const req of mergerDef.requirements.businessTypes) {
      const match = owned.find(b => b.type === req.id && b.level >= req.minLevel);
      if (!match) {
        const reqDef = BUSINESS_CATALOG_MAP.get(req.id);
        return {
          eligible: false,
          reason: `Requires ${reqDef?.name || req.id} at Level ${req.minLevel} or higher.`
        };
      }
    }

    if (mergerDef.requirements.minCryptoPortfolioValue) {
      const cryptoVal = state.cryptoPortfolioValue || 0;
      if (cryptoVal < mergerDef.requirements.minCryptoPortfolioValue) {
        return { eligible: false, reason: `Requires $${mergerDef.requirements.minCryptoPortfolioValue.toLocaleString()} in Crypto assets.` };
      }
    }

    return { eligible: true };
  },

  /**
   * Execute merger
   */
  executeMerger(state, mergerTypeId) {
    const check = this.canMerge(state, mergerTypeId);
    if (!check.eligible) return { success: false, error: check.reason };

    const mergerDef = BUSINESS_CATALOG_MAP.get(mergerTypeId);
    state.cash -= mergerDef.requirements.cashCost;

    // For Holding Company, convert the bank
    if (mergerTypeId === BUSINESS_TYPES.HOLDING_COMPANY) {
      const bankIndex = state.ownedBusinesses.findIndex(b => b.type === BUSINESS_TYPES.BANK && b.level >= 30);
      if (bankIndex !== -1) {
        state.ownedBusinesses.splice(bankIndex, 1);
      }
    }

    // Add merged entity
    const instanceId = `${mergerTypeId}-${Date.now()}`;
    const mergedInstance = {
      id: instanceId,
      type: mergerTypeId,
      name: mergerDef.name,
      level: 1,
      openedAt: Date.now(),
      totalInvested: mergerDef.requirements.cashCost
    };

    if (!Array.isArray(state.ownedBusinesses)) state.ownedBusinesses = [];
    state.ownedBusinesses.push(mergedInstance);

    return { success: true, instance: mergedInstance };
  }
};
