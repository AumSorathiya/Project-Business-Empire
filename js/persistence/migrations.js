/* ==========================================================================
   Empire Architect: Save Schema Migrations
   Safely migrates older save schemas to current version
   ========================================================================== */

import { BALANCE } from "../data/balance.js";
import { STOCK_DEFINITIONS } from "../data/stocks-data.js";
import { CRYPTO_DEFINITIONS } from "../data/crypto-data.js";

export function createInitialState() {
  const now = Date.now();

  const initialStockPrices = {};
  for (const s of STOCK_DEFINITIONS) {
    initialStockPrices[s.ticker] = s.basePrice;
  }

  const initialCryptoPrices = {};
  for (const c of CRYPTO_DEFINITIONS) {
    initialCryptoPrices[c.symbol] = c.basePrice;
  }

  return {
    schemaVersion: BALANCE.schemaVersion,
    balanceVersion: BALANCE.version,
    createdAt: now,
    lastSavedAt: now,
    lastOfflineProcessedAt: now,
    cash: BALANCE.startingCash,
    lifetimeEarnings: 0,
    businessEarningsLifetime: 0,
    tapCount: 0,
    empireLevel: 1,
    experience: 0,
    businesses: [],
    upgrades: {},
    unlockedBusinessIds: ["parcel-relay"],
    completedAchievementIds: [],
    // Business Empire 4-Pillar Structures:
    ownedBusinesses: [], // Up to 21 instances
    stockPrices: initialStockPrices,
    stockPortfolio: {},  // { ticker: shares }
    cryptoPrices: initialCryptoPrices,
    cryptoPortfolio: {}, // { symbol: amountCoins }
    ownedProperties: {}, // { propertyId: level }
    ownedLuxury: [],     // [ luxuryId ]
    unlockedInsigniaIds: [],
    statistics: {
      totalPurchases: 0,
      totalUpgrades: 0,
      totalPlaySeconds: 0,
      totalTaps: 0
    },
    settings: {
      compactNumbers: true,
      reducedMotion: false,
      soundEnabled: false
    }
  };
}

/**
 * Migrate a parsed state object to current schema version
 * @param {object} state
 * @returns {object} Migrated and sanitized state
 */
export function migrateState(state) {
  if (!state || typeof state !== "object") {
    return createInitialState();
  }

  const initial = createInitialState();

  // Ensure all top-level keys exist and are typed
  const sanitized = {
    ...initial,
    ...state,
    schemaVersion: BALANCE.schemaVersion,
    balanceVersion: BALANCE.version
  };

  // Deep sanitize businesses array
  if (!Array.isArray(sanitized.businesses)) {
    sanitized.businesses = [];
  } else {
    sanitized.businesses = sanitized.businesses
      .filter(b => b && typeof b.businessId === "string" && Number.isFinite(b.quantity) && b.quantity > 0)
      .map(b => ({
        businessId: b.businessId,
        quantity: Math.floor(b.quantity)
      }));
  }

  // Deep sanitize ownedBusinesses (21 slots)
  if (!Array.isArray(sanitized.ownedBusinesses)) {
    sanitized.ownedBusinesses = [];
  } else {
    sanitized.ownedBusinesses = sanitized.ownedBusinesses
      .filter(b => b && typeof b.id === "string" && typeof b.type === "string")
      .slice(0, 21); // Maximum 21 slots enforced
  }

  // Deep sanitize stocks & crypto
  if (!sanitized.stockPortfolio || typeof sanitized.stockPortfolio !== "object") sanitized.stockPortfolio = {};
  if (!sanitized.stockPrices || typeof sanitized.stockPrices !== "object") sanitized.stockPrices = initial.stockPrices;
  if (!sanitized.cryptoPortfolio || typeof sanitized.cryptoPortfolio !== "object") sanitized.cryptoPortfolio = {};
  if (!sanitized.cryptoPrices || typeof sanitized.cryptoPrices !== "object") sanitized.cryptoPrices = initial.cryptoPrices;
  if (!sanitized.ownedProperties || typeof sanitized.ownedProperties !== "object") sanitized.ownedProperties = {};
  if (!Array.isArray(sanitized.ownedLuxury)) sanitized.ownedLuxury = [];
  if (!Array.isArray(sanitized.unlockedInsigniaIds)) sanitized.unlockedInsigniaIds = [];

  // Deep sanitize upgrades object
  if (!sanitized.upgrades || typeof sanitized.upgrades !== "object" || Array.isArray(sanitized.upgrades)) {
    sanitized.upgrades = {};
  } else {
    const cleanUpgrades = {};
    for (const [key, val] of Object.entries(sanitized.upgrades)) {
      if (typeof key === "string" && Number.isFinite(val) && val > 0) {
        cleanUpgrades[key] = Math.floor(val);
      }
    }
    sanitized.upgrades = cleanUpgrades;
  }

  // Ensure cash and lifetimeEarnings are positive finite numbers
  if (!Number.isFinite(sanitized.cash) || sanitized.cash < 0) {
    sanitized.cash = BALANCE.startingCash;
  }
  if (!Number.isFinite(sanitized.lifetimeEarnings) || sanitized.lifetimeEarnings < 0) {
    sanitized.lifetimeEarnings = 0;
  }

  // Ensure unlockedBusinessIds includes parcel-relay
  if (!Array.isArray(sanitized.unlockedBusinessIds) || !sanitized.unlockedBusinessIds.includes("parcel-relay")) {
    sanitized.unlockedBusinessIds = Array.from(new Set(["parcel-relay", ...(sanitized.unlockedBusinessIds || [])]));
  }

  // Ensure completedAchievementIds is an array
  if (!Array.isArray(sanitized.completedAchievementIds)) {
    sanitized.completedAchievementIds = [];
  }

  return sanitized;
}
