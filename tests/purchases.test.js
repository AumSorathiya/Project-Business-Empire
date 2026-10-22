import { test } from "node:test";
import assert from "node:assert/strict";
import { createInitialState } from "../js/persistence/migrations.js";
import { executePurchaseTransaction } from "../js/engine/purchases.js";

test("New game starts with 1,000 cash and parcel-relay unlocked", () => {
  const state = createInitialState();
  assert.equal(state.cash, 1000);
  assert.equal(state.empireLevel, 1);
  assert.ok(state.unlockedBusinessIds.includes("parcel-relay"));
});

test("Purchase transaction successfully buys business at 250 credits", () => {
  const state = createInitialState();
  const result = executePurchaseTransaction(state, "parcel-relay", 1);

  assert.equal(result.success, true);
  assert.equal(result.cost, 250);
  assert.equal(result.newQuantity, 1);
  assert.equal(state.cash, 750);
  assert.equal(state.businesses[0].quantity, 1);
  assert.equal(state.statistics.totalPurchases, 1);
});

test("Purchase fails if business is locked", () => {
  const state = createInitialState();
  // Corner Cafe requires Empire Level 2
  const result = executePurchaseTransaction(state, "corner-cafe", 1);

  assert.equal(result.success, false);
  assert.match(result.reason, /locked/i);
  assert.equal(state.cash, 1000, "Cash must remain unchanged on failure");
  assert.equal(state.businesses.length, 0);
});

test("Purchase fails when player has insufficient funds", () => {
  const state = createInitialState();
  state.cash = 100; // Not enough for 250

  const result = executePurchaseTransaction(state, "parcel-relay", 1);
  assert.equal(result.success, false);
  assert.match(result.reason, /insufficient/i);
  assert.equal(state.cash, 100);
  assert.equal(state.businesses.length, 0);
});
