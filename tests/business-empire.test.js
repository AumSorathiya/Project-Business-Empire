/* ==========================================================================
   Business Empire: Mechanics & Systems Unit Tests
   Covers 21 Slots, Bank Spreads, IT Studio, Stocks, Crypto, Real Estate,
   Mergers, and Insignias
   ========================================================================== */

import test from "node:test";
import assert from "node:assert/strict";

import { createInitialState } from "../js/persistence/migrations.js";
import { BusinessLogic } from "../js/engine/business-logic.js";
import { MarketEngine } from "../js/engine/market-simulation.js";
import { Selectors } from "../js/app/selectors.js";
import { BUSINESS_TYPES } from "../js/data/business-catalog.js";
import { INSIGNIA_DEFINITIONS } from "../js/data/insignias-data.js";

test("Business Empire: Can open businesses up to 21 slots limit", () => {
  const state = createInitialState();
  state.cash = 1000000000; // $1 Billion

  for (let i = 0; i < 21; i++) {
    assert.equal(BusinessLogic.canOpenBusiness(state), true);
    const res = BusinessLogic.openBusiness(state, BUSINESS_TYPES.RETAIL_STORE);
    assert.equal(res.success, true);
  }

  assert.equal(state.ownedBusinesses.length, 21);
  assert.equal(BusinessLogic.canOpenBusiness(state), false);

  const overflowRes = BusinessLogic.openBusiness(state, BUSINESS_TYPES.RETAIL_STORE);
  assert.equal(overflowRes.success, false);
  assert.match(overflowRes.error, /Maximum slot limit reached/);
});

test("Business Empire: Bank spread calculation correctly responds to interest sliders", () => {
  const state = createInitialState();
  state.cash = 50000000;

  const res = BusinessLogic.openBusiness(state, BUSINESS_TYPES.BANK);
  assert.equal(res.success, true);
  const bankInstance = res.instance;

  // Default optimal setting: 6.30% dep / 9.60% cred
  const optimalHourly = BusinessLogic.calculateInstanceIncomePerHour(bankInstance);
  assert.ok(optimalHourly > 1000000, "Bank should generate millions per hour");

  // Extreme unoptimized setting: high deposit payout (squeezed spread)
  bankInstance.bankData.depositInterest = 9.0;
  bankInstance.bankData.creditInterest = 9.5;
  const squeezedHourly = BusinessLogic.calculateInstanceIncomePerHour(bankInstance);
  assert.ok(squeezedHourly < optimalHourly, "Squeezed spread should yield lower profit");
});

test("Business Empire: Stock purchases, dividends, and full buyout evaluation", () => {
  const state = createInitialState();
  state.cash = 5000000000; // $5B

  // Buy 1000 shares of ACRO
  const buyRes = MarketEngine.buyStock(state, "ACRO", 1000);
  assert.equal(buyRes.success, true);
  assert.equal(state.stockPortfolio["ACRO"], 1000);

  // Dividend yield should be positive
  const dividends = MarketEngine.calculateStockDividendsPerHour(state);
  assert.ok(dividends > 0, "Dividends should be positive when holding shares");

  // Buyout check before and after
  assert.equal(MarketEngine.isFullStockBuyout(state), false);
});

test("Business Empire: Cryptocurrency trading correctly calculates profits and coin balances", () => {
  const state = createInitialState();
  state.cash = 100000;

  // Buy $50,000 worth of BitGold
  const buyRes = MarketEngine.buyCrypto(state, "BTG", 50000);
  assert.equal(buyRes.success, true);
  assert.equal(state.cash, 50000);
  assert.ok(state.cryptoPortfolio["BTG"] > 0);

  // Value check
  const val = MarketEngine.getCryptoPortfolioValue(state);
  assert.ok(val >= 48000 && val <= 52000);

  // Sell 100% of BitGold
  const sellRes = MarketEngine.sellCrypto(state, "BTG", 1.0);
  assert.equal(sellRes.success, true);
  assert.equal(state.cryptoPortfolio["BTG"], 0);
  assert.ok(state.cash >= 98000);
});

test("Business Empire: Real Estate purchase, upgrades, rental yield, and 12% sales tax liquidation", () => {
  const state = createInitialState();
  state.cash = 1000000;

  // Buy Lublin Flat ($45,000)
  const buyRes = MarketEngine.buyProperty(state, "prop-lublin");
  assert.equal(buyRes.success, true);
  assert.equal(state.ownedProperties["prop-lublin"], 1);

  const initialRent = MarketEngine.calculateRealEstateRentPerHour(state);
  assert.ok(initialRent > 0);

  // Upgrade property to tier 2
  const upRes = MarketEngine.upgradeProperty(state, "prop-lublin");
  assert.equal(upRes.success, true);
  assert.equal(state.ownedProperties["prop-lublin"], 2);

  const upgradedRent = MarketEngine.calculateRealEstateRentPerHour(state);
  assert.ok(upgradedRent > initialRent);

  // Liquidate with 12% sales tax
  const cashBeforeSell = state.cash;
  const sellRes = MarketEngine.sellProperty(state, "prop-lublin");
  assert.equal(sellRes.success, true);
  assert.ok(state.cash > cashBeforeSell);
  assert.ok(sellRes.taxPaid > 0);
  assert.equal(state.ownedProperties["prop-lublin"], undefined);
});

test("Business Empire: Luxury asset purchase directly inflates Net Worth", () => {
  const state = createInitialState();
  state.cash = 30000000;

  const netWorthBefore = Selectors.getNetWorth(state);
  const buyRes = MarketEngine.buyLuxury(state, "lux-yacht-mundo");
  assert.equal(buyRes.success, true);

  // Cash decreased by $20.5M, but yacht is now part of assets: Net Worth remains preserved
  const netWorthAfter = Selectors.getNetWorth(state);
  assert.equal(netWorthAfter, netWorthBefore);
});

test("Business Empire: Corporate Mergers validation (Clothing Brand and Holding Company)", () => {
  const state = createInitialState();
  state.cash = 100000000000; // $100B

  // Should fail merger without prerequisite businesses
  const failCheck = BusinessLogic.canMerge(state, BUSINESS_TYPES.HOLDING_COMPANY);
  assert.equal(failCheck.eligible, false);

  // Create prerequisite Bank and scale to Level 30
  const bankRes = BusinessLogic.openBusiness(state, BUSINESS_TYPES.BANK);
  assert.equal(bankRes.success, true);
  const bank = bankRes.instance;
  bank.level = 30;

  // Now eligible to merge into Holding Company
  const passCheck = BusinessLogic.canMerge(state, BUSINESS_TYPES.HOLDING_COMPANY);
  assert.equal(passCheck.eligible, true);

  // Execute merger
  const execRes = BusinessLogic.executeMerger(state, BUSINESS_TYPES.HOLDING_COMPANY);
  assert.equal(execRes.success, true);
  assert.equal(execRes.instance.type, BUSINESS_TYPES.HOLDING_COMPANY);

  // Holding company produces $8.7 Billion/hour
  const income = BusinessLogic.calculateInstanceIncomePerHour(execRes.instance);
  assert.equal(income, 8700000000);
});

test("Business Empire: Legendary Insignias evaluate net worth thresholds", () => {
  const state = createInitialState();
  state.cash = 1500000; // Over $1M

  const richManInsignia = INSIGNIA_DEFINITIONS.find(i => i.id === "insignia-rich-man");
  assert.ok(richManInsignia);
  assert.equal(richManInsignia.checkUnlock(state, Selectors.getNetWorth(state), false), true);

  const monopolyInsignia = INSIGNIA_DEFINITIONS.find(i => i.id === "insignia-monopoly");
  assert.ok(monopolyInsignia);
  assert.equal(monopolyInsignia.checkUnlock(state, Selectors.getNetWorth(state), false), false);
});
