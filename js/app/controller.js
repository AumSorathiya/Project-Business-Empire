/* ==========================================================================
   Empire Architect: Application Controller
   Coordinates lifecycle, engine loop, event dispatch, audio synthesis, and UI rendering
   ========================================================================== */

import { SaveManager } from "../persistence/save-manager.js";
import { processOfflineEarnings } from "../persistence/offline-income.js";
import { simulateTick } from "../engine/simulation.js";
import { GameActions } from "./actions.js";
import { BALANCE } from "../data/balance.js";
import { formatCredits } from "../utils/formatting.js";

import { NavigationController } from "../ui/navigation.js";
import { DashboardView } from "../ui/dashboard.js";
import { BusinessesView } from "../ui/businesses-view.js";
import { InvestmentsView } from "../ui/investments-view.js";
import { LuxuryView } from "../ui/luxury-view.js";
import { InsigniasView } from "../ui/insignias-view.js";
import { UpgradePanelView } from "../ui/upgrade-panel.js";
import { AchievementPanelView } from "../ui/achievement-panel.js";
import { StatisticsPanelView } from "../ui/statistics-panel.js";
import { SettingsPanelView } from "../ui/settings.js";
import { NotificationService } from "../ui/notifications.js";
import { ModalManager } from "../ui/modal.js";
import { AudioSystem } from "../ui/audio.js";
import { ConfettiCelebration } from "../ui/confetti.js";
import { spawnFloatingText } from "../ui/floating-text.js";
import { InteractiveEngine } from "../engine/interactive-engine.js";
import { InteractiveModals } from "../ui/interactive-modals.js";

export class GameController {
  constructor() {
    this.state = null;
    this.lastTickTime = performance.now();
    this.isProcessingAction = false;
    this.currentViewName = "dashboard";
  }

  init() {
    // 1. Initialize UI Services
    this.notifications = new NotificationService(document.getElementById("toast-container"));
    this.modal = new ModalManager();
    this.confetti = new ConfettiCelebration(document.getElementById("confetti-canvas"));

    // 2. Setup Topbar Sound Toggle Button
    const soundBtn = document.getElementById("sound-toggle-btn");
    if (soundBtn) {
      soundBtn.addEventListener("click", () => {
        const isMuted = AudioSystem.toggleMute();
        soundBtn.classList.toggle("muted", isMuted);
        const onIcon = soundBtn.querySelector(".sound-icon-on");
        const offIcon = soundBtn.querySelector(".sound-icon-off");
        if (onIcon) onIcon.style.display = isMuted ? "none" : "block";
        if (offIcon) offIcon.style.display = isMuted ? "block" : "none";
        if (!isMuted) AudioSystem.playClick();
      });
    }

    // 3. Setup Topbar Tap to Earn Button ($1.00/tap)
    const topbarTapBtn = document.getElementById("topbar-tap-btn");
    if (topbarTapBtn) {
      topbarTapBtn.addEventListener("click", (e) => {
        this.handleTapToEarn(e);
      });
    }

    // 4. Load State
    const loadResult = SaveManager.load();
    this.state = loadResult.state;

    // 5. Process Offline Earnings
    const offlineResult = processOfflineEarnings(this.state, Date.now());
    if (offlineResult.awarded) {
      SaveManager.save(this.state);
      setTimeout(() => {
        this.modal.showOfflineEarningsModal(offlineResult);
        AudioSystem.playCoin();
      }, 200);
    }

    // 6. Initialize Views
    this.navigation = new NavigationController({
      onNavigate: (viewName) => {
        AudioSystem.playClick();
        this.handleViewChange(viewName);
      }
    });

    this.dashboardView = new DashboardView(document.getElementById("dashboard-view-content"), {
      onNavigate: (viewName) => {
        AudioSystem.playClick();
        this.navigation.switchView(viewName);
      },
      onQuickPurchase: (bizId, count) => this.handlePurchase(bizId, count),
      onQuickUpgrade: (upId) => this.handleUpgrade(upId),
      onDealmaker: (e, reward) => this.handleDealmaker(e, reward),
      onHeroCoinTap: (tapResult) => {
        this.navigation.updateTopbar(this.state);
      },
      onStateChanged: () => {
        this.saveAndRefresh();
      }
    });

    // Business Empire 21-slots & Mergers View
    this.businessesView = new BusinessesView(
      document.getElementById("businesses-view-content"),
      {
        onOpenBusiness: (typeId) => this.handleOpenBusiness(typeId),
        onUpgradeBusiness: (instId) => this.handleUpgradeBusinessInstance(instId),
        onExecuteMerger: (mergerId) => this.handleExecuteMerger(mergerId),
        onOpenBankModal: (instId) => this.handleOpenBankModal(instId),
        onOpenCarGarage: () => {
          InteractiveModals.openCarDealershipModal(this.state, () => this.saveAndRefresh());
        },
        onOpenITStudio: () => {
          InteractiveModals.openITStudioModal(this.state, () => this.saveAndRefresh());
        }
      }
    );

    // Investments View (Stocks, Crypto, Real Estate, Mining Farm)
    this.investmentsView = new InvestmentsView(
      document.getElementById("investments-view-content"),
      {
        onBuyStock: (ticker, count) => this.handleBuyStock(ticker, count),
        onSellStock: (ticker, count) => this.handleSellStock(ticker, count),
        onBuyCrypto: (symbol, amount) => this.handleBuyCrypto(symbol, amount),
        onSellCrypto: (symbol, pct) => this.handleSellCrypto(symbol, pct),
        onBuyProperty: (propId) => this.handleBuyProperty(propId),
        onUpgradeProperty: (propId) => this.handleUpgradeProperty(propId),
        onSellProperty: (propId) => this.handleSellProperty(propId),
        onStateChanged: () => this.saveAndRefresh()
      }
    );

    // Luxury View
    this.luxuryView = new LuxuryView(
      document.getElementById("luxury-view-content"),
      {
        onBuyLuxury: (luxId) => this.handleBuyLuxury(luxId)
      }
    );

    // Insignias View
    this.insigniasView = new InsigniasView(
      document.getElementById("insignias-view-content")
    );

    this.upgradesView = new UpgradePanelView(
      document.getElementById("upgrades-view-content"),
      (upId) => this.handleUpgrade(upId)
    );

    this.achievementsView = new AchievementPanelView(
      document.getElementById("achievements-view-content")
    );

    this.statisticsView = new StatisticsPanelView(
      document.getElementById("statistics-view-content")
    );

    this.settingsView = new SettingsPanelView(
      document.getElementById("settings-view-content"),
      {
        onSaveNow: () => this.handleSaveNow(),
        onResetGame: () => this.handleResetRequest(),
        onToggleSetting: (key, val) => this.handleSettingToggle(key, val)
      }
    );

    // Initial Render
    this.renderActiveView();
    this.navigation.updateTopbar(this.state);

    // 7. Start Simulation Loop
    this.lastTickTime = performance.now();
    this.startSimulationLoop();

    // 8. Setup Lifecycle & Autosave Listeners
    this.setupLifecycleHandlers();
  }

  handleViewChange(viewName) {
    this.currentViewName = viewName;
    this.renderActiveView();
  }

  renderActiveView() {
    switch (this.currentViewName) {
      case "dashboard":
        this.dashboardView.render(this.state);
        break;
      case "businesses":
        this.businessesView.render(this.state);
        break;
      case "investments":
        this.investmentsView.render(this.state);
        break;
      case "luxury":
        this.luxuryView.render(this.state);
        break;
      case "insignias":
        this.insigniasView.render(this.state);
        break;
      case "upgrades":
        this.upgradesView.render(this.state);
        break;
      case "achievements":
        this.achievementsView.render(this.state);
        break;
      case "statistics":
        this.statisticsView.render(this.state);
        break;
      case "settings":
        this.settingsView.render(this.state);
        break;
    }
  }

  handleTapToEarn(e) {
    const res = InteractiveEngine.registerTap(this.state);
    AudioSystem.playCoin();
    if (e && e.clientX && e.clientY) {
      const text = res.isCrit ? `🔥 CRITICAL +${formatCredits(res.gain)}!` : `+${formatCredits(res.gain)}`;
      spawnFloatingText(text, e.clientX, e.clientY);
    }
    this.navigation.updateTopbar(this.state);
    if (this.currentViewName === "dashboard") {
      this.dashboardView.render(this.state);
    }
  }

  handleDealmaker(e, reward) {
    const res = GameActions.executeDeal(this.state, reward);
    if (res.success) {
      AudioSystem.playCoin();
      if (e && e.clientX && e.clientY) {
        spawnFloatingText(`+${formatCredits(reward)}`, e.clientX, e.clientY);
      }
      this.navigation.updateTopbar(this.state);
      this.dashboardView.render(this.state);
    }
  }

  // -------------------------------------------------------------
  // BUSINESS EMPIRE: 21-SLOTS & MERGERS HANDLERS
  // -------------------------------------------------------------
  handleOpenBusiness(typeId) {
    const res = GameActions.openNewBusiness(this.state, typeId);
    if (res.success) {
      AudioSystem.playPurchase();
      this.notifications.success("Enterprise Founded", `Successfully opened ${res.instance.name}!`);
      this.saveAndRefresh();
    } else {
      this.notifications.error("Acquisition Declined", res.error);
    }
  }

  handleUpgradeBusinessInstance(instId) {
    const res = GameActions.upgradeBusinessInstance(this.state, instId);
    if (res.success) {
      AudioSystem.playUpgrade();
      this.notifications.success("Enterprise Upgraded", `Scaled to Level ${res.newLevel} (-${formatCredits(res.cost)})!`);
      this.saveAndRefresh();
    } else {
      this.notifications.error("Upgrade Declined", res.error);
    }
  }

  handleExecuteMerger(mergerId) {
    const res = GameActions.executeMerger(this.state, mergerId);
    if (res.success) {
      AudioSystem.playFanfare();
      this.confetti.fire();
      this.notifications.achievement("Corporate Merger Executed!", `Established ${res.instance.name}!`);
      this.saveAndRefresh();
    } else {
      this.notifications.error("Merger Ineligible", res.error);
    }
  }

  handleOpenBankModal(instId) {
    InteractiveModals.openBankModal(this.state, instId, () => {
      this.saveAndRefresh();
    });
  }

  // -------------------------------------------------------------
  // INVESTMENTS HANDLERS (Stocks, Crypto, Real Estate)
  // -------------------------------------------------------------
  handleBuyStock(ticker, count) {
    const res = GameActions.buyStock(this.state, ticker, count);
    if (res.success) {
      AudioSystem.playPurchase();
      this.notifications.success("Shares Purchased", `Bought ${count} shares of ${ticker} for ${formatCredits(res.totalCost)}.`);
      this.saveAndRefresh();
    } else {
      this.notifications.error("Trade Order Failed", res.error);
    }
  }

  handleSellStock(ticker, count) {
    const res = GameActions.sellStock(this.state, ticker, count);
    if (res.success) {
      AudioSystem.playCoin();
      this.notifications.success("Shares Liquidated", `Sold ${count} shares of ${ticker} for ${formatCredits(res.totalPayout)}.`);
      this.saveAndRefresh();
    } else {
      this.notifications.error("Trade Order Failed", res.error);
    }
  }

  handleBuyCrypto(symbol, amount) {
    const res = GameActions.buyCrypto(this.state, symbol, amount);
    if (res.success) {
      AudioSystem.playPurchase();
      this.notifications.success("Crypto Order Filled", `Acquired ${res.coins.toFixed(4)} ${symbol} for ${formatCredits(amount)}.`);
      this.saveAndRefresh();
    } else {
      this.notifications.error("Crypto Buy Failed", res.error);
    }
  }

  handleSellCrypto(symbol, pct) {
    const res = GameActions.sellCrypto(this.state, symbol, pct);
    if (res.success) {
      AudioSystem.playCoin();
      this.notifications.success("Crypto Liquidated", `Sold ${res.coinsSold.toFixed(4)} ${symbol} for ${formatCredits(res.payout)}.`);
      this.saveAndRefresh();
    } else {
      this.notifications.error("Crypto Sell Failed", res.error);
    }
  }

  handleBuyProperty(propId) {
    const res = GameActions.buyProperty(this.state, propId);
    if (res.success) {
      AudioSystem.playPurchase();
      this.notifications.success("Real Estate Acquired", `Property added to portfolio for ${formatCredits(res.cost)}.`);
      this.saveAndRefresh();
    } else {
      this.notifications.error("Acquisition Failed", res.error);
    }
  }

  handleUpgradeProperty(propId) {
    const res = GameActions.upgradeProperty(this.state, propId);
    if (res.success) {
      AudioSystem.playUpgrade();
      this.notifications.success("Property Upgraded", `Tier ${res.newLevel} luxury specifications deployed!`);
      this.saveAndRefresh();
    } else {
      this.notifications.error("Upgrade Failed", res.error);
    }
  }

  handleSellProperty(propId) {
    const res = GameActions.sellProperty(this.state, propId);
    if (res.success) {
      AudioSystem.playCoin();
      this.notifications.success("Property Sold", `Liquidated for ${formatCredits(res.payout)} (Tax: ${formatCredits(res.taxPaid)}).`);
      this.saveAndRefresh();
    } else {
      this.notifications.error("Sale Failed", res.error);
    }
  }

  handleBuyLuxury(luxId) {
    const res = GameActions.buyLuxury(this.state, luxId);
    if (res.success) {
      AudioSystem.playFanfare();
      this.confetti.fire();
      this.notifications.achievement("Trophy Asset Acquired!", `${res.item.name} is now in your personal collection!`);
      this.saveAndRefresh();
    } else {
      this.notifications.error("Purchase Declined", res.error);
    }
  }

  saveAndRefresh() {
    this.navigation.setSaveStatus("saving");
    SaveManager.save(this.state);
    setTimeout(() => this.navigation.setSaveStatus("saved"), 250);
    this.navigation.updateTopbar(this.state);
    this.renderActiveView();
  }

  handlePurchase(businessId, count = 1) {
    if (this.isProcessingAction) return;
    this.isProcessingAction = true;

    try {
      const result = GameActions.purchaseBusiness(this.state, businessId, count);
      if (result.success) {
        AudioSystem.playPurchase();
        this.notifications.success(
          `Acquired ${count}x ${result.businessDef.name}`,
          `Investment: ${formatCredits(result.cost)} credits. Portfolio expanded.`
        );

        this.saveAndRefresh();
      } else {
        this.notifications.error("Transaction Declined", result.reason);
      }
    } finally {
      this.isProcessingAction = false;
    }
  }

  handleUpgrade(upgradeId) {
    if (this.isProcessingAction) return;
    this.isProcessingAction = true;

    try {
      const result = GameActions.purchaseUpgrade(this.state, upgradeId);
      if (result.success) {
        AudioSystem.playUpgrade();
        this.notifications.success(
          `Technology Deployed: ${result.upgradeDef.name}`,
          `Level ${result.newLevel} activated (-${formatCredits(result.cost)} credits).`
        );

        this.saveAndRefresh();
      } else {
        this.notifications.error("Upgrade Declined", result.reason);
      }
    } finally {
      this.isProcessingAction = false;
    }
  }

  handleSaveNow() {
    this.navigation.setSaveStatus("saving");
    const res = GameActions.saveGame(this.state);
    if (res.success) {
      AudioSystem.playClick();
      this.notifications.success("Game Saved", "All progress written to persistent storage.");
      this.navigation.setSaveStatus("saved");
      if (this.currentViewName === "settings") {
        this.settingsView.render(this.state);
      }
    } else {
      this.notifications.error("Save Failed", res.error);
      this.navigation.setSaveStatus("error");
    }
  }

  handleResetRequest() {
    this.modal.showResetConfirmation(() => {
      this.state = GameActions.resetGame();
      AudioSystem.playCoin();
      this.notifications.success("Empire Reset", "A new venture has been chartered with starting capital.");
      this.navigation.switchView("dashboard");
      this.renderActiveView();
      this.navigation.updateTopbar(this.state);
    });
  }

  handleSettingToggle(key, value) {
    AudioSystem.playClick();
    GameActions.updateSetting(this.state, key, value);
    this.navigation.updateTopbar(this.state);
    this.renderActiveView();
  }

  startSimulationLoop() {
    let lastRenderUpdate = performance.now();

    const loop = (currentTime) => {
      const elapsedMs = currentTime - this.lastTickTime;
      this.lastTickTime = currentTime;

      const elapsedSeconds = elapsedMs / 1000;

      if (elapsedSeconds > 0) {
        // 1. Process Mining Farm Background Production
        InteractiveEngine.processMiningTick(this.state, elapsedSeconds);

        // 2. Process IT Software Studio Progress
        const itRes = InteractiveEngine.processITStudioTick(this.state, elapsedSeconds);
        if (itRes) {
          AudioSystem.playFanfare();
          this.confetti.fire();
          this.notifications.achievement(
            `Software Launched: ${itRes.completedProject.name}!`,
            `Enterprise payout collected: +${formatCredits(itRes.payout)}`
          );
          this.renderActiveView();
        }

        // 3. Auto-taps from trading servers and bots
        const autoTaps = InteractiveEngine.getAutoTapsPerSecond(this.state);
        if (autoTaps > 0) {
          const autoGain = autoTaps * InteractiveEngine.getTapPower(this.state) * elapsedSeconds;
          this.state.cash += autoGain;
          this.state.lifetimeEarnings += autoGain;
        }

        // 4. Decay tap combo
        InteractiveEngine.decayCombo(this.state);

        // 5. Simulate standard business cash flows
        const tickResult = simulateTick(this.state, elapsedSeconds);

        // Level up evaluation
        if (tickResult.progression && tickResult.progression.levelUp) {
          AudioSystem.playFanfare();
          this.confetti.fire();
          this.notifications.achievement(
            `Empire Level ${tickResult.progression.newLevel}!`,
            `Congratulations! New enterprises and upgrades are now unlocked.`
          );
          this.renderActiveView();
        }

        // Achievements evaluation
        if (tickResult.newAchievements && tickResult.newAchievements.length > 0) {
          AudioSystem.playFanfare();
          this.confetti.fire();
          for (const ach of tickResult.newAchievements) {
            this.notifications.achievement(
              `Milestone: ${ach.title}`,
              `${ach.description} (+${formatCredits(ach.rewardCredits)} credits)`
            );
          }
          this.renderActiveView();
        }

        // Insignias evaluation
        if (tickResult.newInsignias && tickResult.newInsignias.length > 0) {
          AudioSystem.playFanfare();
          this.confetti.fire();
          for (const ins of tickResult.newInsignias) {
            this.notifications.achievement(
              `★ LEGENDARY INSIGNIA: ${ins.name}!`,
              `${ins.description}`
            );
          }
          this.renderActiveView();
        }
      }

      // Smooth topbar update (every ~100ms)
      if (currentTime - lastRenderUpdate >= BALANCE.fastTickIntervalMs) {
        this.navigation.updateTopbar(this.state);
        lastRenderUpdate = currentTime;
      }

      requestAnimationFrame(loop);
    };

    requestAnimationFrame(loop);
  }

  setupLifecycleHandlers() {
    // 1. Continuous Autosave (every 3 seconds)
    setInterval(() => {
      SaveManager.save(this.state);
      this.navigation.setSaveStatus("saved");
      if (this.currentViewName === "settings") {
        this.settingsView.render(this.state);
      }
    }, BALANCE.autosaveIntervalMs);

    // 2. Save on page hide / unload
    window.addEventListener("beforeunload", () => {
      SaveManager.save(this.state);
    });

    window.addEventListener("pagehide", () => {
      SaveManager.save(this.state);
    });

    // 3. Tab Visibility Change (Background/Foreground catch-up)
    document.addEventListener("visibilitychange", () => {
      if (document.visibilityState === "visible") {
        this.lastTickTime = performance.now();
        this.navigation.updateTopbar(this.state);
        this.renderActiveView();
      } else {
        SaveManager.save(this.state);
      }
    });
  }
}
