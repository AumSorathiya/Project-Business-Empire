import { test } from "node:test";
import assert from "node:assert/strict";
import { BUSINESS_DEFINITIONS, BUSINESS_MAP } from "../js/data/businesses.js";
import { UPGRADE_DEFINITIONS } from "../js/data/upgrades.js";
import {
  calculateBusinessCost,
  calculateUpgradeCost,
  calculateBusinessMultiplier,
  calculateBusinessNetIncome,
  calculatePaybackSeconds,
  calculatePortfolioNetIncome,
  calculateTotalInvestedCapital
} from "../js/engine/economy.js";

test("Business cost scaling formula", () => {
  const parcel = BUSINESS_MAP.get("parcel-relay");
  assert.ok(parcel, "Parcel Relay definition must exist");
  assert.equal(parcel.baseCost, 250);
  assert.equal(parcel.costGrowthRate, 1.15);

  // Cost for 1st unit (owned: 0)
  const cost0 = calculateBusinessCost(parcel, 0, 1);
  assert.equal(cost0, 250);

  // Cost for 2nd unit (owned: 1): Math.floor(250 * 1.15) = 287
  const cost1 = calculateBusinessCost(parcel, 1, 1);
  assert.equal(cost1, 287);

  // Multi-purchase cost: buying 2 units starting from 0: 250 + 287 = 537
  const cost2Units = calculateBusinessCost(parcel, 0, 2);
  assert.equal(cost2Units, 537);
});

test("Upgrade cost scaling formula", () => {
  const routeOpt = UPGRADE_DEFINITIONS.find(u => u.id === "route-optimization");
  assert.ok(routeOpt, "Route Optimization upgrade must exist");
  assert.equal(routeOpt.baseCost, 150);
  assert.equal(routeOpt.costGrowthRate, 1.6);
  assert.equal(routeOpt.effectPerLevel, 0.10);

  // Level 0 -> 1: Math.floor(150 * 1.6^0) = 150
  const costL0 = calculateUpgradeCost(routeOpt, 0);
  assert.equal(costL0, 150);

  // Level 1 -> 2: Math.floor(150 * 1.6^1) = 240
  const costL1 = calculateUpgradeCost(routeOpt, 1);
  assert.equal(costL1, 240);

  // Max level capped at Infinity cost
  const costMax = calculateUpgradeCost(routeOpt, routeOpt.maxLevel);
  assert.equal(costMax, Infinity);
});

test("Business income and multiplier calculations", () => {
  const parcel = BUSINESS_MAP.get("parcel-relay");
  assert.equal(parcel.baseNetIncomePerSecond, 2);

  // 1 unit, 0 upgrades: income = 1 * 2 * 1.0 = 2/s
  const income0 = calculateBusinessNetIncome(parcel, 1, {});
  assert.equal(income0, 2);

  // 1 unit with Route Optimization lvl 2 (+10% * 2 = +20%): multiplier = 1.20, income = 2.4/s
  const upgrades = { "route-optimization": 2 };
  const mult = calculateBusinessMultiplier("parcel-relay", upgrades);
  assert.equal(mult, 1.2);

  const incomeWithUpgrade = calculateBusinessNetIncome(parcel, 1, upgrades);
  assert.equal(incomeWithUpgrade, 2.4);

  // 5 units: 5 * 2 * 1.2 = 12/s
  const income5 = calculateBusinessNetIncome(parcel, 5, upgrades);
  assert.equal(income5, 12);
});

test("Payback period calculation", () => {
  // Cost 250, incremental income 2/s -> 125 seconds
  const payback = calculatePaybackSeconds(250, 2);
  assert.equal(payback, 125);

  // Zero or negative delta income returns Infinity
  assert.equal(calculatePaybackSeconds(1000, 0), Infinity);
  assert.equal(calculatePaybackSeconds(1000, -5), Infinity);
});

test("Portfolio net income and invested capital", () => {
  const businesses = [
    { businessId: "parcel-relay", quantity: 2 },
    { businessId: "corner-cafe", quantity: 1 }
  ];
  // parcel: 2 * 2 = 4
  // cafe: 1 * 8 = 8
  // total = 12/s
  const total = calculatePortfolioNetIncome(businesses, {});
  assert.equal(total, 12);

  const invested = calculateTotalInvestedCapital(businesses, {});
  // parcel 0 + 1 = 250 + 287 = 537
  // cafe 0 = 1000
  // total = 1537
  assert.equal(invested, 1537);
});
