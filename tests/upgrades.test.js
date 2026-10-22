import { test } from "node:test";
import assert from "node:assert/strict";
import { createInitialState } from "../js/persistence/migrations.js";
import { executeUpgradeTransaction } from "../js/engine/upgrades.js";

test("Upgrade transaction successfully upgrades Route Optimization at 150 credits", () => {
  const state = createInitialState();
  const result = executeUpgradeTransaction(state, "route-optimization");

  assert.equal(result.success, true);
  assert.equal(result.cost, 150);
  assert.equal(result.newLevel, 1);
  assert.equal(state.cash, 850);
  assert.equal(state.upgrades["route-optimization"], 1);
  assert.equal(state.statistics.totalUpgrades, 1);
});

test("Upgrade fails when player has insufficient funds", () => {
  const state = createInitialState();
  state.cash = 50; // Insufficient for 150

  const result = executeUpgradeTransaction(state, "route-optimization");
  assert.equal(result.success, false);
  assert.match(result.reason, /insufficient/i);
  assert.equal(state.cash, 50);
  assert.equal(state.upgrades["route-optimization"] || 0, 0);
});

test("Upgrade fails if parent business is locked", () => {
  const state = createInitialState();
  // Specialty micro-roasts belongs to Corner Cafe (Level 2)
  const result = executeUpgradeTransaction(state, "specialty-beans");
  assert.equal(result.success, false);
  assert.match(result.reason, /locked/i);
  assert.equal(state.cash, 1000);
});

test("Upgrade cannot exceed maximum level", () => {
  const state = createInitialState();
  state.cash = 100000000;
  state.upgrades["route-optimization"] = 25; // max level is 25

  const result = executeUpgradeTransaction(state, "route-optimization");
  assert.equal(result.success, false);
  assert.match(result.reason, /maximum level/i);
  assert.equal(state.upgrades["route-optimization"], 25);
});
