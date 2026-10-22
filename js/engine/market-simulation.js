/* ==========================================================================
   Business Empire: Market Simulation & Asset Engine
   Simulates Stocks, Crypto Volatility, Real Estate, and Luxury Purchases
   ========================================================================== */

import { STOCK_DEFINITIONS, STOCK_MAP } from "../data/stocks-data.js";
import { CRYPTO_DEFINITIONS, CRYPTO_MAP } from "../data/crypto-data.js";
import { REAL_ESTATE_DEFINITIONS, REAL_ESTATE_MAP, REAL_ESTATE_TAX_RATE } from "../data/real-estate-data.js";
import { LUXURY_DEFINITIONS, LUXURY_MAP } from "../data/luxury-data.js";

export const MarketEngine = {
  /**
   * Initialize market states if missing
   */
  initMarketState(state) {
    if (!state.stockPrices) {
      state.stockPrices = {};
      for (const stock of STOCK_DEFINITIONS) {
        state.stockPrices[stock.ticker] = stock.basePrice;
      }
    }
    if (!state.stockPortfolio) {
      state.stockPortfolio = {}; // { ticker: ownedSharesCount }
    }
    if (!state.cryptoPrices) {
      state.cryptoPrices = {};
      for (const crypto of CRYPTO_DEFINITIONS) {
        state.cryptoPrices[crypto.symbol] = crypto.basePrice;
      }
    }
    if (!state.cryptoPortfolio) {
      state.cryptoPortfolio = {}; // { symbol: amountCoins }
    }
    if (!state.ownedProperties) {
      state.ownedProperties = {}; // { propertyId: upgradeLevel }
    }
    if (!state.ownedLuxury) {
      state.ownedLuxury = []; // Array of luxury item IDs
    }
  },

  /**
   * Update market prices with random-walk cycles
   */
  simulateMarketTick(state) {
    this.initMarketState(state);

    // 1. Stock price drift
    for (const stock of STOCK_DEFINITIONS) {
      const current = state.stockPrices[stock.ticker] || stock.basePrice;
      const changePct = (Math.random() - 0.49) * stock.volatility;
      let nextPrice = current * (1 + changePct);
      nextPrice = Math.max(stock.minPrice, Math.min(stock.maxPrice, nextPrice));
      state.stockPrices[stock.ticker] = Math.round(nextPrice * 100) / 100;
    }

    // 2. Crypto high-beta oscillation
    for (const crypto of CRYPTO_DEFINITIONS) {
      const current = state.cryptoPrices[crypto.symbol] || crypto.basePrice;
      // Asymmetric swings for thrilling trading
      const swing = (Math.random() - 0.48) * crypto.volatility;
      let nextPrice = current * (1 + swing);
      nextPrice = Math.max(crypto.minPrice, Math.min(crypto.maxPrice, nextPrice));
      state.cryptoPrices[crypto.symbol] = crypto.basePrice < 1
        ? Math.round(nextPrice * 1000) / 1000
        : Math.round(nextPrice * 100) / 100;
    }
  },

  // -------------------------------------------------------------
  // STOCK TRANSACTIONS
  // -------------------------------------------------------------
  buyStock(state, ticker, sharesCount = 1) {
    this.initMarketState(state);
    const stock = STOCK_MAP.get(ticker);
    if (!stock || sharesCount <= 0) return { success: false, error: "Invalid trade." };

    const price = state.stockPrices[ticker] || stock.basePrice;
    const totalCost = Math.round(price * sharesCount * 100) / 100;

    const owned = state.stockPortfolio[ticker] || 0;
    if (owned + sharesCount > stock.totalShares) {
      return { success: false, error: "Cannot exceed 100% total company shares." };
    }

    if (state.cash < totalCost) {
      return { success: false, error: "Insufficient cash." };
    }

    state.cash -= totalCost;
    state.stockPortfolio[ticker] = owned + sharesCount;

    return { success: true, ticker, sharesCount, totalCost };
  },

  sellStock(state, ticker, sharesCount = 1) {
    this.initMarketState(state);
    const stock = STOCK_MAP.get(ticker);
    if (!stock || sharesCount <= 0) return { success: false, error: "Invalid trade." };

    const owned = state.stockPortfolio[ticker] || 0;
    if (owned < sharesCount) {
      return { success: false, error: "Insufficient shares to sell." };
    }

    const price = state.stockPrices[ticker] || stock.basePrice;
    const totalPayout = Math.round(price * sharesCount * 100) / 100;

    state.cash += totalPayout;
    state.stockPortfolio[ticker] = owned - sharesCount;

    return { success: true, ticker, sharesCount, totalPayout };
  },

  calculateStockDividendsPerHour(state) {
    this.initMarketState(state);
    let dividendsHourly = 0;
    for (const [ticker, shares] of Object.entries(state.stockPortfolio)) {
      if (shares > 0) {
        const stock = STOCK_MAP.get(ticker);
        if (stock) {
          const price = state.stockPrices[ticker] || stock.basePrice;
          const totalVal = shares * price;
          // Annual yield divided by 8760 hours in a year (or game hour equivalent)
          const hourlyRate = stock.dividendYieldAnnual / 365;
          dividendsHourly += Math.floor(totalVal * hourlyRate);
        }
      }
    }
    return dividendsHourly;
  },

  isFullStockBuyout(state) {
    this.initMarketState(state);
    for (const stock of STOCK_DEFINITIONS) {
      const owned = state.stockPortfolio[stock.ticker] || 0;
      if (owned < stock.totalShares) return false;
    }
    return true;
  },

  // -------------------------------------------------------------
  // CRYPTOCURRENCY TRANSACTIONS
  // -------------------------------------------------------------
  buyCrypto(state, symbol, amountDollars) {
    this.initMarketState(state);
    const crypto = CRYPTO_MAP.get(symbol);
    if (!crypto || amountDollars <= 0) return { success: false, error: "Invalid trade." };

    if (state.cash < amountDollars) {
      return { success: false, error: "Insufficient cash." };
    }

    const price = state.cryptoPrices[symbol] || crypto.basePrice;
    const coins = amountDollars / price;

    state.cash -= amountDollars;
    state.cryptoPortfolio[symbol] = (state.cryptoPortfolio[symbol] || 0) + coins;

    return { success: true, symbol, coins, spent: amountDollars };
  },

  sellCrypto(state, symbol, percentToSell = 1.0) {
    this.initMarketState(state);
    const crypto = CRYPTO_MAP.get(symbol);
    if (!crypto) return { success: false, error: "Invalid crypto." };

    const ownedCoins = state.cryptoPortfolio[symbol] || 0;
    if (ownedCoins <= 0) return { success: false, error: "No coins owned." };

    const coinsToSell = ownedCoins * Math.min(1.0, Math.max(0.01, percentToSell));
    const price = state.cryptoPrices[symbol] || crypto.basePrice;
    const payout = Math.round(coinsToSell * price * 100) / 100;

    state.cash += payout;
    state.cryptoPortfolio[symbol] = ownedCoins - coinsToSell;

    return { success: true, symbol, coinsSold: coinsToSell, payout };
  },

  getCryptoPortfolioValue(state) {
    this.initMarketState(state);
    let total = 0;
    for (const [symbol, coins] of Object.entries(state.cryptoPortfolio)) {
      if (coins > 0) {
        const crypto = CRYPTO_MAP.get(symbol);
        const price = state.cryptoPrices[symbol] || (crypto ? crypto.basePrice : 0);
        total += coins * price;
      }
    }
    return Math.floor(total);
  },

  // -------------------------------------------------------------
  // REAL ESTATE TRANSACTIONS
  // -------------------------------------------------------------
  buyProperty(state, propertyId) {
    this.initMarketState(state);
    const prop = REAL_ESTATE_MAP.get(propertyId);
    if (!prop) return { success: false, error: "Property not found." };
    if (state.ownedProperties[propertyId]) {
      return { success: false, error: "Already own this property." };
    }
    if (state.cash < prop.baseCost) {
      return { success: false, error: "Insufficient cash." };
    }

    state.cash -= prop.baseCost;
    state.ownedProperties[propertyId] = 1; // Level 1

    return { success: true, propertyId, cost: prop.baseCost };
  },

  upgradeProperty(state, propertyId) {
    this.initMarketState(state);
    const prop = REAL_ESTATE_MAP.get(propertyId);
    if (!prop) return { success: false, error: "Property not found." };
    const currentLevel = state.ownedProperties[propertyId] || 0;
    if (currentLevel === 0) return { success: false, error: "You must buy the property first." };
    if (currentLevel >= prop.maxUpgradeLevel) return { success: false, error: "Property already at max luxury tier." };

    const cost = Math.floor(prop.upgradeCostBase * Math.pow(1.3, currentLevel - 1));
    if (state.cash < cost) {
      return { success: false, error: "Insufficient cash." };
    }

    state.cash -= cost;
    state.ownedProperties[propertyId] = currentLevel + 1;

    return { success: true, propertyId, newLevel: currentLevel + 1, cost };
  },

  sellProperty(state, propertyId) {
    this.initMarketState(state);
    const prop = REAL_ESTATE_MAP.get(propertyId);
    if (!prop) return { success: false, error: "Property not found." };
    const level = state.ownedProperties[propertyId] || 0;
    if (level === 0) return { success: false, error: "Property not owned." };

    // Total book value
    let totalInvested = prop.baseCost;
    for (let l = 1; l < level; l++) {
      totalInvested += Math.floor(prop.upgradeCostBase * Math.pow(1.3, l - 1));
    }

    // Apply 12% sales tax
    const payout = Math.floor(totalInvested * (1 - REAL_ESTATE_TAX_RATE));
    state.cash += payout;
    delete state.ownedProperties[propertyId];

    return { success: true, propertyId, payout, taxPaid: totalInvested - payout };
  },

  calculateRealEstateRentPerHour(state) {
    this.initMarketState(state);
    let rentHourly = 0;
    for (const [propId, level] of Object.entries(state.ownedProperties)) {
      if (level > 0) {
        const prop = REAL_ESTATE_MAP.get(propId);
        if (prop) {
          const mult = 1 + (level - 1) * 0.35;
          rentHourly += Math.floor(prop.baseRentPerHour * mult);
        }
      }
    }
    return rentHourly;
  },

  // -------------------------------------------------------------
  // LUXURY ASSETS
  // -------------------------------------------------------------
  buyLuxury(state, luxuryId) {
    this.initMarketState(state);
    const item = LUXURY_MAP.get(luxuryId);
    if (!item) return { success: false, error: "Item not found." };
    if (state.ownedLuxury.includes(luxuryId)) {
      return { success: false, error: "Already owned in your collection." };
    }
    if (state.cash < item.cost) {
      return { success: false, error: "Insufficient cash." };
    }

    state.cash -= item.cost;
    state.ownedLuxury.push(luxuryId);

    return { success: true, item };
  },

  getLuxuryCollectionValue(state) {
    this.initMarketState(state);
    let total = 0;
    for (const luxId of state.ownedLuxury) {
      const item = LUXURY_MAP.get(luxId);
      if (item) total += item.cost;
    }
    return total;
  }
};
