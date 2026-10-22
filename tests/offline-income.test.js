import { test } from "node:test";
import assert from "node:assert/strict";
import { createInitialState } from "../js/persistence/migrations.js";
import { processOfflineEarnings } from "../js/persistence/offline-income.js";
import { executePurchaseTransaction } from "../js/engine/purchases.js";

test("Offline earnings are not awarded if elapsed time is under threshold", () => {
  const state = createInitialState();
  executePurchaseTransaction(state, "parcel-relay", 1); // 2/s income

  const now = Date.now();
  state.lastOfflineProcessedAt = now;

  // 5 seconds away (under 10s threshold)
  const result = processOfflineEarnings(state, now + 5000);
  assert.equal(result.awarded, false);
  assert.equal(result.creditsEarned, 0);
  assert.equal(state.cash, 750);
});

test("Offline earnings calculate correctly and credit once", () => {
  const state = createInitialState();
  executePurchaseTransaction(state, "parcel-relay", 1); // 2 credits/sec

  const now = Date.now();
  state.lastOfflineProcessedAt = now;

  // 100 seconds away: 100s * 2/s = 200 credits
  const result = processOfflineEarnings(state, now + 100 * 1000);
  assert.equal(result.awarded, true);
  assert.equal(result.creditsEarned, 200);
  assert.equal(result.wasCapped, false);
  assert.equal(state.cash, 750 + 200);
  assert.equal(state.lifetimeEarnings, 200);

  // Calling again immediately should yield 0 (idempotent / already processed)
  const immediateResult = processOfflineEarnings(state, now + 100 * 1000);
  assert.equal(immediateResult.awarded, false);
  assert.equal(immediateResult.creditsEarned, 0);
});

test("Offline earnings strictly respect 8-hour cap", () => {
  const state = createInitialState();
  executePurchaseTransaction(state, "parcel-relay", 1); // 2 credits/sec

  const now = Date.now();
  state.lastOfflineProcessedAt = now;

  // Away for 24 hours (86,400 seconds)
  const result = processOfflineEarnings(state, now + 86400 * 1000);
  assert.equal(result.awarded, true);
  assert.equal(result.wasCapped, true);
  assert.equal(result.eligibleSeconds, 8 * 3600); // 28,800s
  // 28,800s * 2 credits/sec = 57,600 credits
  assert.equal(result.creditsEarned, 57600);
  assert.equal(state.cash, 750 + 57600);
});
