import { test } from "node:test";
import assert from "node:assert/strict";
import { createInitialState } from "../js/persistence/migrations.js";
import { executePurchaseTransaction } from "../js/engine/purchases.js";
import { executeUpgradeTransaction } from "../js/engine/upgrades.js";
import { evaluateAchievements } from "../js/progression/achievement-service.js";

test("Achievements unlock and reward once upon satisfying requirements", () => {
  const state = createInitialState();

  // Buy 1st business
  executePurchaseTransaction(state, "parcel-relay", 1);
  const unlockedAfterBuy = evaluateAchievements(state);

  const firstVenture = unlockedAfterBuy.find(a => a.id === "first-venture");
  assert.ok(firstVenture, "First Step achievement must unlock");
  assert.equal(firstVenture.rewardCredits, 50);
  assert.ok(state.completedAchievementIds.includes("first-venture"));
  // Cash was 750, + 50 reward = 800
  assert.equal(state.cash, 800);

  // Buy upgrade
  executeUpgradeTransaction(state, "route-optimization");
  const unlockedAfterUpgrade = evaluateAchievements(state);
  const firstUpgrade = unlockedAfterUpgrade.find(a => a.id === "first-upgrade");
  assert.ok(firstUpgrade, "First upgrade achievement must unlock");

  // Subsequent evaluations must NOT re-award
  const subsequent = evaluateAchievements(state);
  assert.equal(subsequent.length, 0);
});
