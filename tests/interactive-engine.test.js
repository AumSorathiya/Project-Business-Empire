import { test } from "node:test";
import assert from "node:assert/strict";
import { createInitialState } from "../js/persistence/migrations.js";
import { InteractiveEngine } from "../js/engine/interactive-engine.js";

test("InteractiveEngine: tap to earn builds combo and awards cash", () => {
  const state = createInitialState();
  state.cash = 1000;
  InteractiveEngine.initInteractiveState(state);

  const res1 = InteractiveEngine.registerTap(state);
  assert.ok(res1.gain >= 1.0);
  assert.ok(state.cash > 1000);
  assert.equal(state.statistics.totalTaps, 1);

  // Rapid tap should increase combo
  const res2 = InteractiveEngine.registerTap(state);
  assert.ok(res2.combo > 1.0);
});

test("InteractiveEngine: tap upgrades scale power and deduct cash", () => {
  const state = createInitialState();
  state.cash = 500;
  InteractiveEngine.initInteractiveState(state);

  const initialPower = InteractiveEngine.getTapPower(state);
  const bought = InteractiveEngine.buyTapUpgrade(state, "tap-intern");
  assert.equal(bought, true);
  assert.equal(state.tapUpgrades.levels["tap-intern"], 1);
  assert.ok(state.cash < 500);

  const newPower = InteractiveEngine.getTapPower(state);
  assert.ok(newPower > initialPower);
});

test("InteractiveEngine: crypto mining hardware purchases and generates crypto", () => {
  const state = createInitialState();
  state.cash = 10000;
  InteractiveEngine.initInteractiveState(state);

  const bought = InteractiveEngine.buyMiningRig(state, "rig-gtx");
  assert.equal(bought, true);
  assert.equal(state.miningFarm.ownedRigs["rig-gtx"], 1);

  // Process 3600s (1 hour)
  state.cryptoPrices = { DOGE: 0.15 };
  InteractiveEngine.processMiningTick(state, 3600);
  assert.ok(state.cryptoPortfolio["DOGE"] >= 80);
});

test("InteractiveEngine: car auction acquisition, repair and resale", () => {
  const state = createInitialState();
  state.cash = 100000;
  InteractiveEngine.initInteractiveState(state);

  // 1. Buy M4 salvage
  const bought = InteractiveEngine.buyAuctionCar(state, "auction-m4");
  assert.equal(bought, true);
  assert.equal(state.carGarage.inventory.length, 1);
  const inst = state.carGarage.inventory[0];
  assert.equal(inst.isRepaired, false);

  // 2. Repair car
  const repaired = InteractiveEngine.repairCar(state, inst.instanceId);
  assert.equal(repaired, true);
  assert.equal(inst.isRepaired, true);

  // 3. Resell in showroom
  const cashBeforeSale = state.cash;
  const sold = InteractiveEngine.sellCar(state, inst.instanceId);
  assert.equal(sold, true);
  assert.equal(state.carGarage.inventory.length, 0);
  assert.ok(state.cash > cashBeforeSale);
});

test("InteractiveEngine: IT software studio staff and project progress", () => {
  const state = createInitialState();
  state.cash = 50000;
  InteractiveEngine.initInteractiveState(state);

  const initialDevs = state.itStudio.staff.dev;
  const hired = InteractiveEngine.hireITStaff(state, "dev");
  assert.equal(hired, true);
  assert.equal(state.itStudio.staff.dev, initialDevs + 1);

  // Process tick
  InteractiveEngine.processITStudioTick(state, 10);
  assert.ok(state.itStudio.projectProgress > 0);
});

test("InteractiveEngine: Fortune wheel spin grants prize", () => {
  const state = createInitialState();
  state.cash = 25000;
  state.freeWheelSpins = 1;
  InteractiveEngine.initInteractiveState(state);

  const prize = InteractiveEngine.spinWheel(state);
  assert.ok(prize);
  assert.ok(prize.label);
  assert.equal(state.freeWheelSpins, 0);
});
