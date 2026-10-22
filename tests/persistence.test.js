import { test } from "node:test";
import assert from "node:assert/strict";
import { createInitialState, migrateState } from "../js/persistence/migrations.js";
import { SaveManager } from "../js/persistence/save-manager.js";

test("migrateState sanitizes corrupted or partial state safely", () => {
  const corrupted = {
    cash: -500, // Invalid negative cash
    businesses: "corrupt string", // Should be array
    upgrades: null,
    lifetimeEarnings: "not a number"
  };

  const clean = migrateState(corrupted);
  assert.equal(clean.cash, 1000); // Reset to starting cash
  assert.equal(clean.lifetimeEarnings, 0);
  assert.ok(Array.isArray(clean.businesses));
  assert.equal(typeof clean.upgrades, "object");
  assert.ok(clean.unlockedBusinessIds.includes("parcel-relay"));
});

test("SaveManager handles storage gracefully in environments without localStorage", () => {
  // SaveManager.load returns fresh state if localStorage is absent
  const loaded = SaveManager.load();
  assert.ok(loaded.state);
  assert.equal(loaded.state.cash, 1000);
});
