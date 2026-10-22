import { test } from "node:test";
import assert from "node:assert/strict";
import { createInitialState } from "../js/persistence/migrations.js";
import { executePurchaseTransaction } from "../js/engine/purchases.js";
import { executeUpgradeTransaction } from "../js/engine/upgrades.js";
import { simulateTick } from "../js/engine/simulation.js";
import { Selectors } from "../js/app/selectors.js";

test("Full gameplay loop simulation: buy, simulate income, upgrade, level up", () => {
  const state = createInitialState();
  assert.equal(state.cash, 1000);
  assert.equal(state.empireLevel, 1);

  // 1. Buy 2 Parcel Relays (250 + 287 = 537 credits)
  const buy1 = executePurchaseTransaction(state, "parcel-relay", 2);
  assert.equal(buy1.success, true);
  assert.equal(state.cash, 1000 - 537); // 463
  assert.equal(Selectors.getBusinessQuantity(state, "parcel-relay"), 2);

  // Income should now be 2 units * 2/s = 4/s
  assert.equal(Selectors.getPortfolioNetIncomePerSecond(state), 4);

  // 2. Simulate 60 seconds of idle income
  // Note: During simulation, the "First Step" achievement completes, awarding +50 credits.
  const tick1 = simulateTick(state, 60);
  assert.equal(tick1.deltaCash, 240); // 4 * 60 = 240
  assert.equal(state.cash, 463 + 240 + 50); // 753 (includes +50 First Step achievement reward)
  assert.equal(state.lifetimeEarnings, 240 + 50);

  // 3. Buy Route Optimization Upgrade (+10% effect, cost 150)
  const up1 = executeUpgradeTransaction(state, "route-optimization");
  assert.equal(up1.success, true);
  assert.equal(state.cash, 753 - 150); // 603

  // Income should now be 2 * 2 * 1.10 = 4.4/s
  assert.equal(Selectors.getPortfolioNetIncomePerSecond(state), 4.4);

  // 4. Simulate enough time to pass 1000 lifetime earnings -> Empire Level 2
  // We need 1000 - 240 = 760 more earnings. At 4.4/s, ~175 seconds.
  simulateTick(state, 200); // 4.4 * 200 = 880 earnings
  assert.ok(state.lifetimeEarnings >= 1000);

  // Empire Level 2 requires 1000 lifetime earnings and 2 businesses owned (we own 2 Parcel Relays)
  assert.equal(state.empireLevel, 2);
  assert.ok(Selectors.isBusinessUnlocked(state, "corner-cafe"));

  // 5. Net worth check
  const netWorth = Selectors.getNetWorth(state);
  assert.ok(netWorth > state.cash, "Net worth includes cash plus invested asset value");
});
