/* ==========================================================================
   Business Empire: Interactive Game Engine
   Taps, Combos, Mining Farm, Car Garage, IT Studio & Fortune Wheel
   ========================================================================== */

import { TAP_UPGRADES, FORTUNE_WHEEL_SLICES } from "../data/tap-upgrades-data.js";
import { MINING_HARDWARE, MINING_HARDWARE_MAP } from "../data/mining-data.js";
import { AUCTION_CARS } from "../data/car-auction-data.js";
import { IT_STAFF_ROLES, IT_PROJECTS } from "../data/it-projects-data.js";
import { STOCK_DEFINITIONS } from "../data/stocks-data.js";
import { CRYPTO_DEFINITIONS } from "../data/crypto-data.js";

export class InteractiveEngine {
  static initInteractiveState(state) {
    if (!state.miningFarm) {
      state.miningFarm = {
        ownedRigs: {}, // { [rigId]: count }
        totalMinedValue: 0
      };
    }
    if (!state.carGarage) {
      state.carGarage = {
        inventory: [], // [{ ...car, isRepaired: false }]
        totalCarProfits: 0
      };
    }
    if (!state.itStudio) {
      state.itStudio = {
        staff: { dev: 1, designer: 1, qa: 0, lead: 0 },
        activeProjectId: "proj-messenger",
        projectProgress: 0,
        completedProjectsCount: 0
      };
    }
    if (!state.tapUpgrades) {
      state.tapUpgrades = {
        levels: {} // { [upgradeId]: level }
      };
    }
    if (state.tapCombo === undefined) state.tapCombo = 1.0;
    if (state.lastTapTime === undefined) state.lastTapTime = Date.now();
    if (state.freeWheelSpins === undefined) state.freeWheelSpins = 1;
    if (!state.activeBuffs) state.activeBuffs = []; // [{ type, multiplier, expiresAt }]
  }

  // --- TAP MECHANICS ---
  static getTapPower(state) {
    this.initInteractiveState(state);
    let base = 1.0;
    for (const upg of TAP_UPGRADES) {
      const lvl = state.tapUpgrades.levels[upg.id] || 0;
      base += upg.tapPowerBonus * lvl;
    }
    const combo = Math.min(5.0, state.tapCombo || 1.0);
    let buffMult = 1.0;
    const now = Date.now();
    for (const b of (state.activeBuffs || [])) {
      if (b.expiresAt > now && b.type === "tap") {
        buffMult *= b.multiplier;
      }
    }
    return base * combo * buffMult;
  }

  static getAutoTapsPerSecond(state) {
    this.initInteractiveState(state);
    let autoTaps = 0;
    for (const upg of TAP_UPGRADES) {
      const lvl = state.tapUpgrades.levels[upg.id] || 0;
      autoTaps += upg.autoTapsPerSec * lvl;
    }
    return autoTaps;
  }

  static registerTap(state) {
    this.initInteractiveState(state);
    const now = Date.now();
    const elapsed = now - state.lastTapTime;
    state.lastTapTime = now;

    // Build combo if tapped within 800ms
    if (elapsed < 800) {
      state.tapCombo = Math.min(5.0, (state.tapCombo || 1.0) + 0.15);
    } else {
      state.tapCombo = 1.0;
    }

    const power = this.getTapPower(state);
    const isCrit = Math.random() < 0.08; // 8% chance of critical tap
    const actualGain = isCrit ? power * 5 : power;

    state.cash += actualGain;
    state.lifetimeEarnings += actualGain;
    state.tapCount = (state.tapCount || 0) + 1;
    if (!state.statistics) state.statistics = {};
    state.statistics.totalTaps = (state.statistics.totalTaps || 0) + 1;

    return { gain: actualGain, isCrit, combo: state.tapCombo };
  }

  static getTapUpgradeCost(upgrade, currentLevel) {
    return Math.floor(upgrade.cost * Math.pow(upgrade.costMultiplier, currentLevel));
  }

  static buyTapUpgrade(state, upgradeId) {
    this.initInteractiveState(state);
    const upg = TAP_UPGRADES.find(u => u.id === upgradeId);
    if (!upg) return false;
    const currentLvl = state.tapUpgrades.levels[upgradeId] || 0;
    const cost = this.getTapUpgradeCost(upg, currentLvl);
    if (state.cash < cost) return false;

    state.cash -= cost;
    state.tapUpgrades.levels[upgradeId] = currentLvl + 1;
    return true;
  }

  static decayCombo(state) {
    if (!state.tapCombo || state.tapCombo <= 1.0) return;
    const elapsed = Date.now() - (state.lastTapTime || Date.now());
    if (elapsed > 1200) {
      state.tapCombo = Math.max(1.0, state.tapCombo - 0.2);
    }
  }

  // --- CRYPTO MINING FARM ---
  static buyMiningRig(state, rigId) {
    this.initInteractiveState(state);
    const rig = MINING_HARDWARE_MAP.get(rigId);
    if (!rig || state.cash < rig.cost) return false;

    state.cash -= rig.cost;
    state.miningFarm.ownedRigs[rigId] = (state.miningFarm.ownedRigs[rigId] || 0) + 1;
    return true;
  }

  static processMiningTick(state, deltaSeconds) {
    this.initInteractiveState(state);
    const rigs = state.miningFarm.ownedRigs || {};
    let netYieldValue = 0;

    for (const [rigId, count] of Object.entries(rigs)) {
      if (count <= 0) continue;
      const rig = MINING_HARDWARE_MAP.get(rigId);
      if (!rig) continue;

      const minedAmount = (rig.minedAmountPerHour / 3600) * count * deltaSeconds;
      const powerCost = (rig.powerCostPerHour / 3600) * count * deltaSeconds;

      if (state.cash >= powerCost) {
        state.cash -= powerCost;
        if (!state.cryptoPortfolio) state.cryptoPortfolio = {};
        state.cryptoPortfolio[rig.minedCryptoSymbol] = (state.cryptoPortfolio[rig.minedCryptoSymbol] || 0) + minedAmount;

        const currentPrice = (state.cryptoPrices && state.cryptoPrices[rig.minedCryptoSymbol]) || 1;
        netYieldValue += minedAmount * currentPrice;
      }
    }

    state.miningFarm.totalMinedValue = (state.miningFarm.totalMinedValue || 0) + netYieldValue;
    return netYieldValue;
  }

  // --- CAR DEALERSHIP GARAGE ---
  static buyAuctionCar(state, carId) {
    this.initInteractiveState(state);
    const carDef = AUCTION_CARS.find(c => c.id === carId);
    if (!carDef || state.cash < carDef.salvagePrice) return false;

    state.cash -= carDef.salvagePrice;
    state.carGarage.inventory.push({
      instanceId: `car-${Date.now()}-${Math.random().toString(36).substr(2, 4)}`,
      ...carDef,
      isRepaired: false
    });
    return true;
  }

  static repairCar(state, instanceId) {
    this.initInteractiveState(state);
    const car = state.carGarage.inventory.find(c => c.instanceId === instanceId);
    if (!car || car.isRepaired || state.cash < car.repairCost) return false;

    state.cash -= car.repairCost;
    car.isRepaired = true;
    return true;
  }

  static sellCar(state, instanceId) {
    this.initInteractiveState(state);
    const idx = state.carGarage.inventory.findIndex(c => c.instanceId === instanceId);
    if (idx === -1) return false;

    const car = state.carGarage.inventory[idx];
    const revenue = car.isRepaired ? car.showroomResaleValue : car.salvagePrice * 0.8;
    state.cash += revenue;
    state.lifetimeEarnings += revenue;
    state.carGarage.totalCarProfits += (car.isRepaired ? car.profit : 0);
    state.carGarage.inventory.splice(idx, 1);
    return true;
  }

  // --- IT SOFTWARE STUDIO ---
  static hireITStaff(state, roleId) {
    this.initInteractiveState(state);
    const role = IT_STAFF_ROLES.find(r => r.id === roleId);
    if (!role) return false;
    const hiringFee = role.salaryPerHour * 50;
    if (state.cash < hiringFee) return false;

    state.cash -= hiringFee;
    state.itStudio.staff[roleId] = (state.itStudio.staff[roleId] || 0) + 1;
    return true;
  }

  static processITStudioTick(state, deltaSeconds) {
    this.initInteractiveState(state);
    const studio = state.itStudio;
    const project = IT_PROJECTS.find(p => p.id === studio.activeProjectId);
    if (!project) return null;

    let pointsPerSec = 0;
    let totalSalaryPerSec = 0;

    for (const role of IT_STAFF_ROLES) {
      const count = studio.staff[role.id] || 0;
      pointsPerSec += (role.outputContribution / 3600) * count;
      totalSalaryPerSec += (role.salaryPerHour / 3600) * count;
    }

    const salary = totalSalaryPerSec * deltaSeconds;
    if (state.cash >= salary) {
      state.cash -= salary;
      studio.projectProgress = (studio.projectProgress || 0) + (pointsPerSec * deltaSeconds * 20); // Scaled for fun game responsiveness
    }

    // Check completion
    if (studio.projectProgress >= project.requiredPoints) {
      const payout = project.completionPayout;
      state.cash += payout;
      state.lifetimeEarnings += payout;
      studio.projectProgress = 0;
      studio.completedProjectsCount = (studio.completedProjectsCount || 0) + 1;
      return { completedProject: project, payout };
    }

    return null;
  }

  // --- FORTUNE WHEEL ---
  static spinWheel(state) {
    this.initInteractiveState(state);
    const hasFree = (state.freeWheelSpins || 0) > 0;
    const spinCost = 10000;
    if (!hasFree && state.cash < spinCost) return null;

    if (hasFree) {
      state.freeWheelSpins--;
    } else {
      state.cash -= spinCost;
    }

    const winningSlice = FORTUNE_WHEEL_SLICES[Math.floor(Math.random() * FORTUNE_WHEEL_SLICES.length)];

    // Apply prize
    if (winningSlice.type === "cash") {
      state.cash += winningSlice.value;
      state.lifetimeEarnings += winningSlice.value;
    } else if (winningSlice.type === "stock") {
      if (!state.stockPortfolio) state.stockPortfolio = {};
      state.stockPortfolio[winningSlice.ticker] = (state.stockPortfolio[winningSlice.ticker] || 0) + winningSlice.shares;
    } else if (winningSlice.type === "crypto") {
      if (!state.cryptoPortfolio) state.cryptoPortfolio = {};
      state.cryptoPortfolio[winningSlice.symbol] = (state.cryptoPortfolio[winningSlice.symbol] || 0) + winningSlice.amount;
    } else if (winningSlice.type === "luxury") {
      if (!state.ownedLuxury) state.ownedLuxury = [];
      if (!state.ownedLuxury.includes(winningSlice.idItem)) {
        state.ownedLuxury.push(winningSlice.idItem);
      }
    } else if (winningSlice.type === "buff") {
      if (!state.activeBuffs) state.activeBuffs = [];
      state.activeBuffs.push({
        type: "tap",
        multiplier: winningSlice.multiplier,
        expiresAt: Date.now() + (winningSlice.durationSec * 1000)
      });
    }

    return winningSlice;
  }

  // --- MARKET FLASH TICKER ---
  static getMarketFlashNews() {
    const headlines = [
      "⚡ BREAKING: Acro Technologies posts record quarterly revenue! Global hardware demand surges +12%.",
      "🚀 CRYPTO RALLY: BitGold breaks all-time resistance as corporate treasuries expand digital reserves.",
      "⚠️ SUPPLY SHOCK: LNG terminal maintenance boosts energy spot margins for Apex Energy Corporation.",
      "🏛️ MONACO EXCLUSIVE: Ultra-prime seaside estates see record multi-million bids from international syndicates.",
      "✈️ GLOBAL AVIATION: Trans-Continental Airlines achieves 99.4% seat load factor across European corridors.",
      "💡 AI SURGE: Quantum Cloud Dynamics signs $12B enterprise cloud contract with sovereign wealth institutions."
    ];
    return headlines[Math.floor(Math.random() * headlines.length)];
  }
}
