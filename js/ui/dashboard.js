/* ==========================================================================
   Empire Architect: Dashboard View Component
   Strategic financial overview, milestone tracker, and recommendations
   ========================================================================== */

import { Selectors } from "../app/selectors.js";
import { BUSINESS_MAP, BUSINESS_DEFINITIONS } from "../data/businesses.js";
import { UPGRADE_DEFINITIONS } from "../data/upgrades.js";
import { EMPIRE_LEVELS, getNextMilestone } from "../progression/levels.js";
import { ACHIEVEMENTS } from "../data/achievements.js";
import { formatCredits, formatRate, formatPercent } from "../utils/formatting.js";
import { formatPayback } from "../utils/time.js";
import { ICONS } from "./icons.js";
import { InteractiveEngine } from "../engine/interactive-engine.js";
import { InteractiveModals } from "./interactive-modals.js";
import { TAP_UPGRADES } from "../data/tap-upgrades-data.js";
import { MarketEngine } from "../engine/market-simulation.js";
import { AudioSystem } from "./audio.js";
import { spawnFloatingText } from "./floating-text.js";

export class DashboardView {
  constructor(containerEl, { onNavigate, onQuickPurchase, onQuickUpgrade, onDealmaker, onHeroCoinTap, onStateChanged }) {
    this.container = containerEl;
    this.onNavigate = onNavigate;
    this.onQuickPurchase = onQuickPurchase;
    this.onQuickUpgrade = onQuickUpgrade;
    this.onDealmaker = onDealmaker;
    this.onHeroCoinTap = onHeroCoinTap;
    this.onStateChanged = onStateChanged;
  }

  render(state) {
    if (!this.container) return;

    MarketEngine.initMarketState(state);

    const netWorth = Selectors.getNetWorth(state);
    const netIncomeSec = Selectors.getPortfolioNetIncomePerSecond(state);
    const hourlyIncome = Selectors.getPortfolioHourlyIncome(state);
    const totalBiz = Selectors.getTotalBusinessesOwned(state);
    const currentTier = EMPIRE_LEVELS.find(l => l.level === state.empireLevel) || EMPIRE_LEVELS[0];
    const nextMilestone = getNextMilestone(state.empireLevel);

    const stockDividendsHourly = MarketEngine.calculateStockDividendsPerHour(state);
    const realEstateRentHourly = MarketEngine.calculateRealEstateRentPerHour(state);
    const luxuryVal = MarketEngine.getLuxuryCollectionValue(state);

    // Dynamic Dealmaker reward scaling with level & income
    const dealReward = Math.max(15, Math.round(15 * Math.pow(1.35, state.empireLevel - 1) + netIncomeSec * 2));

    // Calculate milestone progress
    let milestonePct = 100;
    let milestoneReqText = "Maximum Tier Achieved";
    if (nextMilestone) {
      const earningsProgress = Math.min(1, state.lifetimeEarnings / (nextMilestone.requiredLifetimeEarnings || 1));
      const bizProgress = Math.min(1, totalBiz / (nextMilestone.requiredBusinessesOwned || 1));
      milestonePct = Math.round(((earningsProgress + bizProgress) / 2) * 100);
      milestoneReqText = `${formatCredits(state.lifetimeEarnings)} / ${formatCredits(nextMilestone.requiredLifetimeEarnings)} earnings & ${totalBiz} / ${nextMilestone.requiredBusinessesOwned} businesses`;
    }

    // Best investment recommendation engine
    const bestInvestment = this.findBestInvestment(state);

    // Show onboarding guide if early in game
    const showOnboarding = state.lifetimeEarnings < 500 && totalBiz <= 2;

    this.container.innerHTML = `
      <!-- Milestone Progress Banner with Executive VIP Crest -->
      <div class="milestone-banner">
        <div style="display: flex; align-items: center; gap: 16px;">
          <div class="vip-crest-badge" style="width: 52px; height: 52px; border-radius: 12px; background: linear-gradient(135deg, rgba(212, 175, 55, 0.28), rgba(12, 17, 30, 0.95)); border: 1px solid var(--color-gold); display: flex; align-items: center; justify-content: center; font-size: 26px; box-shadow: 0 4px 14px rgba(0,0,0,0.5); flex-shrink: 0;">
            👑
          </div>
          <div class="milestone-info">
            <div class="milestone-tag">
              <span style="display: inline-block; width: 6px; height: 6px; border-radius: 50%; background: var(--color-gold);"></span>
              Empire Standing: Level ${state.empireLevel} — ${currentTier.title}
            </div>
            <div class="milestone-title">
              ${nextMilestone ? `Next Expansion: Level ${nextMilestone.level} (${nextMilestone.title})` : "Peak Empire Hegemony"}
            </div>
            <div class="milestone-desc">
              ${nextMilestone ? `Unlocks: ${nextMilestone.unlocks.map(id => BUSINESS_MAP.get(id)?.name || id).join(", ") || "Advanced Market Authority"}. Requirement: ${milestoneReqText}` : "You dominate all commercial sectors."}
            </div>
          </div>
        </div>
        <div class="milestone-progress-wrap">
          <div class="milestone-progress-meta">
            <span>Tier Progress</span>
            <span style="font-weight: bold; color: var(--color-gold); font-family: var(--font-family-mono);">${milestonePct}%</span>
          </div>
          <div class="progress-container">
            <div class="progress-bar" style="width: ${milestonePct}%;"></div>
          </div>
        </div>
      </div>

      <!-- Quick Metrics Grid -->
      <div class="metrics-grid">
        <div class="metric-card gold">
          <div class="metric-card-header">
            <span class="metric-card-label">Spendable Cash</span>
            <div class="metric-card-icon">${ICONS.brand}</div>
          </div>
          <div class="metric-card-value">${formatCredits(state.cash)}</div>
          <div class="metric-card-sub">Liquid commercial capital</div>
        </div>

        <div class="metric-card green">
          <div class="metric-card-header">
            <span class="metric-card-label">Net Income Rate</span>
            <div class="metric-card-icon">${ICONS.energy}</div>
          </div>
          <div class="metric-card-value" style="color: var(--color-positive);">${formatRate(netIncomeSec)}</div>
          <div class="metric-card-sub">+${formatCredits(hourlyIncome)}/hr commercial yield</div>
        </div>

        <div class="metric-card blue">
          <div class="metric-card-header">
            <span class="metric-card-label">Empire Net Worth</span>
            <div class="metric-card-icon">${ICONS.artisan}</div>
          </div>
          <div class="metric-card-value">${formatCredits(netWorth)}</div>
          <div class="metric-card-sub">Liquid cash + asset equity</div>
        </div>

        <div class="metric-card">
          <div class="metric-card-header">
            <span class="metric-card-label">Enterprises Owned</span>
            <div class="metric-card-icon">${ICONS.businesses}</div>
          </div>
          <div class="metric-card-value">${totalBiz}</div>
          <div class="metric-card-sub">${Selectors.getDistinctBusinessesOwned(state)} of 8 active sectors</div>
        </div>
      </div>

      <!-- Hero 3D Gold Coin Tap Console -->
      <div class="hero-tap-console">
        <div class="tap-console-left">
          <div class="tap-combo-badge">
            <span>⚡</span>
            <span>COMBO: <strong id="tap-combo-multiplier">${(state.tapCombo || 1.0).toFixed(1)}x</strong></span>
            ${(state.tapCombo || 1.0) >= 3.0 ? '<span style="color:#EF4444; font-weight:900;">🔥 FEVER</span>' : ''}
          </div>
          <div style="font-size: var(--font-size-xl); font-weight: 800; color: var(--color-text); line-height: 1.2;">
            Imperial Gold Bullion Mint
          </div>
          <div style="font-size: var(--font-size-xs); color: var(--color-text-dim); margin-top: 4px; max-width: 440px;">
            Tap the physical 24K bullion medallion to mint instant capital (+${formatCredits(InteractiveEngine.getTapPower(state))}/tap). Rapid taps unleash up to 5.0x Combo Multipliers and 5x Critical Surges!
          </div>

          <div class="tap-combo-meter-bg">
            <div class="tap-combo-meter-fill" id="tap-combo-fill" style="width: ${Math.min(100, Math.max(12, ((state.tapCombo || 1.0) / 5.0) * 100))}%;"></div>
          </div>

          <div style="display: flex; gap: 10px; margin-top: 14px; align-items: center; flex-wrap: wrap;">
            <button id="dealmaker-pitch-btn" class="btn btn-secondary btn-sm" style="border-color: rgba(245, 158, 11, 0.4);">
              <span>💼 Pitch Syndicate (+${formatCredits(dealReward)})</span>
            </button>
            <button id="hero-fortune-btn" class="btn btn-gold btn-sm" style="display: flex; align-items: center; gap: 6px;">
              <span>🎡 Fortune Wheel</span>
              ${(state.freeWheelSpins || 0) > 0 ? '<span class="badge" style="background:#EF4444; color:#fff; font-size:10px; padding:1px 5px;">FREE</span>' : ''}
            </button>
            <button id="toggle-tap-upgrades-btn" class="btn btn-secondary btn-sm">
              <span>⚡ Tap Upgrades (${Object.values(state.tapUpgrades?.levels || {}).reduce((a, b) => a + b, 0)}) ▾</span>
            </button>
          </div>
        </div>

        <div class="tap-coin-stage" id="hero-3d-coin-stage" title="Click repeatedly to earn gold!">
          <div class="tap-ring-pulse"></div>
          <img src="assets/illustrations/tap-coin.png" alt="3D Gold Bullion Coin" class="giant-3d-coin" id="hero-3d-coin-img" draggable="false" />
        </div>
      </div>

      <!-- Quick Tap Boosters Drawer -->
      <div id="tap-upgrades-drawer" class="card" style="display: none; margin-bottom: var(--space-24); background: rgba(17, 23, 38, 0.95); border: 1px solid var(--color-gold-border);">
        <div style="display: flex; justify-content: space-between; align-items: center; margin-bottom: 12px;">
          <h4 style="font-size: var(--font-size-sm); color: var(--color-gold); text-transform: uppercase;">Tap Multipliers & High-Frequency Bots</h4>
          <span style="font-size: var(--font-size-xs); color: var(--color-text-dim);">Automated & Scaled Tap Yields</span>
        </div>
        <div style="display: grid; grid-template-columns: repeat(auto-fill, minmax(220px, 1fr)); gap: 10px;">
          ${TAP_UPGRADES.map(u => {
            const lvl = (state.tapUpgrades?.levels || {})[u.id] || 0;
            const cost = InteractiveEngine.getTapUpgradeCost(u, lvl);
            const canAfford = state.cash >= cost;
            return `
              <div style="background: rgba(255, 255, 255, 0.03); border: 1px solid var(--color-border); border-radius: var(--radius-sm); padding: 10px; display: flex; flex-direction: column; justify-content: space-between;">
                <div>
                  <div style="display: flex; justify-content: space-between; font-size: var(--font-size-xs);">
                    <strong style="color: var(--color-text);">${u.name}</strong>
                    <span class="badge" style="font-size: 10px;">Lvl ${lvl}</span>
                  </div>
                  <div style="font-size: 11px; color: var(--color-text-muted); margin: 4px 0;">
                    ${u.tapPowerBonus > 0 ? `+${u.tapPowerBonus}/tap` : ''} ${u.autoTapsPerSec > 0 ? `+${u.autoTapsPerSec} auto/s` : ''}
                  </div>
                </div>
                <button class="btn btn-sm btn-gold btn-buy-tap-upg ${canAfford ? '' : 'btn-disabled'}" data-upg-id="${u.id}" ${canAfford ? '' : 'disabled'} style="margin-top: 8px; font-size: 11px;">
                  Upgrade (${formatCredits(cost)})
                </button>
              </div>
            `;
          }).join("")}
        </div>
      </div>

      <!-- 4 Pillars Navigation Quick Portals with Rich Photography -->
      <div class="metrics-grid" style="margin-bottom: var(--space-20);">
        <!-- 1. Enterprises & Mergers -->
        <div class="pillar-portal-card clickable-portal" id="portal-businesses">
          <img src="assets/illustrations/cityscape.jpg" alt="Enterprises" class="portal-bg-img" loading="lazy" />
          <div class="portal-overlay"></div>
          <div class="portal-content">
            <div class="portal-top">
              <span class="portal-tag">🏢 ENTERPRISES & MERGERS</span>
              <span class="badge badge-gold">21 SLOTS</span>
            </div>
            <div class="portal-value">${(state.ownedBusinesses || []).length} / 21 Active</div>
            <div class="portal-action-row">
              <span style="color: var(--color-positive); font-family: var(--font-family-mono); font-size: 11px;">+${formatCredits(hourlyIncome)}/hr</span>
              <span>Manage Holdings →</span>
            </div>
          </div>
        </div>

        <!-- 2. Financial Markets & Real Estate -->
        <div class="pillar-portal-card clickable-portal" id="portal-investments">
          <img src="assets/realestate/waterfront.jpg" alt="Financial Markets" class="portal-bg-img" loading="lazy" />
          <div class="portal-overlay"></div>
          <div class="portal-content">
            <div class="portal-top">
              <span class="portal-tag" style="color: #60A5FA;">📈 FINANCIAL MARKETS</span>
              <span class="ticker-badge" style="margin: 0; background: rgba(59, 130, 246, 0.2); border-color: rgba(59, 130, 246, 0.4); color: #93C5FD;">DIVIDENDS</span>
            </div>
            <div class="portal-value" style="color: #93C5FD;">Global Portfolio</div>
            <div class="portal-action-row">
              <span style="color: var(--color-positive); font-family: var(--font-family-mono); font-size: 11px;">+${formatCredits(stockDividendsHourly + realEstateRentHourly)}/hr</span>
              <span style="color: #60A5FA;">Trade & Rent →</span>
            </div>
          </div>
        </div>

        <!-- 3. Luxury Lifestyle Showroom -->
        <div class="pillar-portal-card clickable-portal" id="portal-luxury">
          <img src="assets/luxury/hypercar.jpg" alt="Luxury Showroom" class="portal-bg-img" loading="lazy" />
          <div class="portal-overlay"></div>
          <div class="portal-content">
            <div class="portal-top">
              <span class="portal-tag">🏎️ LUXURY SHOWROOM</span>
              <span class="badge badge-gold">TROPHY</span>
            </div>
            <div class="portal-value">${(state.ownedLuxury || []).length} Trophies</div>
            <div class="portal-action-row">
              <span style="color: var(--color-gold); font-size: 11px;">${formatCredits(luxuryVal)} Value</span>
              <span>Supercars & Yachts →</span>
            </div>
          </div>
        </div>

        <!-- 4. Sovereign Prestige Insignias -->
        <div class="pillar-portal-card clickable-portal" id="portal-insignias">
          <img src="assets/illustrations/dealmaker-desk.jpg" alt="The 5 Insignias" class="portal-bg-img" loading="lazy" />
          <div class="portal-overlay" style="background: linear-gradient(135deg, rgba(16, 22, 36, 0.9) 0%, rgba(8, 11, 18, 0.96) 100%);"></div>
          <div class="portal-content">
            <div class="portal-top">
              <span class="portal-tag" style="color: var(--color-positive);">👑 THE 5 INSIGNIAS</span>
              <span class="badge badge-gold">PRESTIGE</span>
            </div>
            <div style="display: flex; align-items: center; justify-content: space-between;">
              <div class="portal-value" style="color: var(--color-positive);">${(state.unlockedInsigniaIds || []).length} / 5</div>
              <div class="portal-mini-insignias">
                <img src="assets/insignias/rich-man.svg" alt="Rich Man" class="portal-mini-insignia-icon" style="opacity: ${(state.unlockedInsigniaIds || []).includes('insignia-rich-man') ? '1' : '0.3'};" />
                <img src="assets/insignias/investor.svg" alt="Investor" class="portal-mini-insignia-icon" style="opacity: ${(state.unlockedInsigniaIds || []).includes('insignia-investor') ? '1' : '0.3'};" />
                <img src="assets/insignias/business-empire.svg" alt="Empire" class="portal-mini-insignia-icon" style="opacity: ${(state.unlockedInsigniaIds || []).includes('insignia-business-empire') ? '1' : '0.3'};" />
                <img src="assets/insignias/monopoly.svg" alt="Monopoly" class="portal-mini-insignia-icon" style="opacity: ${(state.unlockedInsigniaIds || []).includes('insignia-monopoly') ? '1' : '0.3'};" />
                <img src="assets/insignias/the-owner.svg" alt="Owner" class="portal-mini-insignia-icon" style="opacity: ${(state.unlockedInsigniaIds || []).includes('insignia-the-owner') ? '1' : '0.3'};" />
              </div>
            </div>
            <div class="portal-action-row">
              <span style="color: var(--color-positive); font-size: 11px;">Ranks & Objectives</span>
              <span style="color: var(--color-positive);">View Standing →</span>
            </div>
          </div>
        </div>
      </div>

      ${showOnboarding ? `
        <!-- Onboarding Guide for new players -->
        <div class="onboarding-guide-card">
          <div style="display: flex; align-items: center; gap: 8px;">
            <div style="width: 20px; height: 20px; color: var(--color-info);">${ICONS.brand}</div>
            <h3 style="font-size: var(--font-size-md); font-weight: bold; color: var(--color-text);">Empire Architect Directive</h3>
          </div>
          <p style="font-size: var(--font-size-xs); color: var(--color-text-muted); margin-top: 4px;">Welcome to executive headquarters. Follow these principles to scale your commercial power:</p>

          <div class="onboarding-steps">
            <div class="onboarding-step-item">
              <div class="step-number">1</div>
              <div class="step-text">
                <h4>Acquire Starter Hub</h4>
                <p>Buy your initial Parcel Relay to establish steady passive cash flow.</p>
              </div>
            </div>
            <div class="onboarding-step-item">
              <div class="step-number">2</div>
              <div class="step-text">
                <h4>Reinvest Income</h4>
                <p>Channel cash flow into more units or technological optimizations.</p>
              </div>
            </div>
            <div class="onboarding-step-item">
              <div class="step-number">3</div>
              <div class="step-text">
                <h4>Expand Sectors</h4>
                <p>Unlock Corner Cafés, Pixel Foundries, and advanced industries.</p>
              </div>
            </div>
          </div>
        </div>
      ` : ""}

      <!-- 2-Column Split: Portfolio Breakdown & Investment Advice -->
      <div class="dashboard-columns">
        <div class="dashboard-main-col">
          <!-- Portfolio Revenue Breakdown -->
          <div class="card">
            <div style="display: flex; justify-content: space-between; align-items: center; margin-bottom: var(--space-16);">
              <h3 style="font-size: var(--font-size-md); color: var(--color-gold); text-transform: uppercase; letter-spacing: 0.05em;">Revenue Portfolio Breakdown</h3>
              <button id="dash-view-businesses-btn" class="btn btn-secondary btn-sm">Manage Enterprises →</button>
            </div>

            <div class="portfolio-breakdown-list">
              ${this.renderPortfolioBreakdown(state, netIncomeSec)}
            </div>
          </div>
        </div>

        <div class="dashboard-side-col">
          <!-- Suggested Next Investment -->
          <div class="recommendation-card">
            <div class="rec-header">
              <div style="width: 16px; height: 16px;">${ICONS.upgrades}</div>
              <span>Optimal Acquisition</span>
            </div>
            ${bestInvestment ? `
              <div style="display: flex; gap: var(--space-12); align-items: center; margin-bottom: var(--space-14);">
                ${bestInvestment.image ? `<img src="${bestInvestment.image}" alt="${bestInvestment.name}" class="portfolio-item-thumb" style="width: 54px; height: 54px; border-radius: var(--radius-sm);" loading="lazy" />` : ""}
                <div style="flex: 1; min-width: 0;">
                  <div style="display: flex; align-items: center; gap: 6px;">
                    <strong style="color: var(--color-text); font-size: var(--font-size-base);">${bestInvestment.name}</strong>
                    <span class="business-category-tag logistics" style="font-size: 0.65rem; padding: 1px 6px;">${bestInvestment.type}</span>
                  </div>
                  <div style="font-size: var(--font-size-xs); color: var(--color-text-muted); margin-top: 3px;">${bestInvestment.description}</div>
                </div>
              </div>
              <div class="rec-stats">
                <div>
                  <div style="font-size: var(--font-size-xs); color: var(--color-text-dim);">Cost</div>
                  <div style="font-family: var(--font-family-mono); font-weight: bold; color: var(--color-gold);">${formatCredits(bestInvestment.cost)}</div>
                </div>
                <div>
                  <div style="font-size: var(--font-size-xs); color: var(--color-text-dim);">Payback</div>
                  <div style="font-family: var(--font-family-mono); font-weight: bold; color: var(--color-positive);">${formatPayback(bestInvestment.payback)}</div>
                </div>
              </div>
              <button id="dash-quick-invest-btn" class="btn btn-primary btn-sm" style="width: 100%;" ${state.cash >= bestInvestment.cost ? "" : "disabled"}>
                Execute Investment (${formatCredits(bestInvestment.cost)})
              </button>
            ` : `
              <div style="font-size: var(--font-size-sm); color: var(--color-text-muted);">
                All current opportunities maxed. Unlock higher empire levels to reveal new sectors.
              </div>
            `}
          </div>

          <!-- Recent Achievements -->
          <div class="card">
            <div style="display: flex; justify-content: space-between; align-items: center; margin-bottom: var(--space-12);">
              <h3 style="font-size: var(--font-size-xs); color: var(--color-text-muted); text-transform: uppercase; letter-spacing: 0.05em; font-weight: bold;">Accomplishments</h3>
              <span style="font-size: var(--font-size-xs); color: var(--color-gold); font-weight: bold;">${(state.completedAchievementIds || []).length} / 16</span>
            </div>
            <div style="display: flex; flex-direction: column; gap: 8px;">
              ${this.renderRecentAchievements(state)}
            </div>
          </div>
        </div>
      </div>
    `;

    // Event listeners
    const coinStage = this.container.querySelector("#hero-3d-coin-stage");
    if (coinStage) {
      coinStage.addEventListener("click", (e) => {
        const res = InteractiveEngine.registerTap(state);
        AudioSystem.playCoin();

        // Spring bounce animation on the 3D coin
        const coinImg = this.container.querySelector("#hero-3d-coin-img");
        if (coinImg) {
          coinImg.style.transform = "scale(0.88) rotate(-6deg)";
          setTimeout(() => {
            coinImg.style.transform = "";
          }, 90);
        }

        // Spawn juicy floating particle text
        const rect = coinStage.getBoundingClientRect();
        const x = e.clientX || (rect.left + rect.width / 2);
        const y = e.clientY || (rect.top + rect.height / 2);
        const text = res.isCrit ? `🔥 CRITICAL +${formatCredits(res.gain)}!` : `+${formatCredits(res.gain)}`;
        spawnFloatingText(text, x, y);

        // Update combo meter without full re-render for smooth 60fps clicking
        const comboVal = this.container.querySelector("#tap-combo-multiplier");
        const comboFill = this.container.querySelector("#tap-combo-fill");
        if (comboVal) comboVal.textContent = `${res.combo.toFixed(1)}x`;
        if (comboFill) comboFill.style.width = `${Math.min(100, Math.max(12, (res.combo / 5.0) * 100))}%`;

        if (this.onHeroCoinTap) this.onHeroCoinTap(res);
      });
    }

    const fortuneBtn = this.container.querySelector("#hero-fortune-btn");
    if (fortuneBtn) {
      fortuneBtn.addEventListener("click", () => {
        AudioSystem.playClick();
        InteractiveModals.openFortuneWheelModal(state, () => {
          this.render(state);
          if (this.onStateChanged) this.onStateChanged();
        });
      });
    }

    const toggleDrawerBtn = this.container.querySelector("#toggle-tap-upgrades-btn");
    const drawerEl = this.container.querySelector("#tap-upgrades-drawer");
    if (toggleDrawerBtn && drawerEl) {
      toggleDrawerBtn.addEventListener("click", () => {
        const isHidden = drawerEl.style.display === "none";
        drawerEl.style.display = isHidden ? "block" : "none";
        toggleDrawerBtn.textContent = isHidden ? "⚡ Tap Upgrades ▴" : "⚡ Tap Upgrades ▾";
      });
    }

    this.container.querySelectorAll(".btn-buy-tap-upg").forEach(btn => {
      btn.addEventListener("click", () => {
        const upgId = btn.dataset.upgId;
        if (InteractiveEngine.buyTapUpgrade(state, upgId)) {
          AudioSystem.playPurchase();
          this.render(state);
          if (this.onStateChanged) this.onStateChanged();
        }
      });
    });

    const dealmakerBtn = this.container.querySelector("#dealmaker-pitch-btn");
    if (dealmakerBtn) {
      dealmakerBtn.addEventListener("click", (e) => {
        if (this.onDealmaker) this.onDealmaker(e, dealReward);
      });
    }

    const viewBizBtn = this.container.querySelector("#dash-view-businesses-btn");
    if (viewBizBtn) {
      viewBizBtn.addEventListener("click", () => {
        if (this.onNavigate) this.onNavigate("businesses");
      });
    }

    // 4-Pillars Quick Portals
    const portalBiz = this.container.querySelector("#portal-businesses");
    if (portalBiz) portalBiz.addEventListener("click", () => this.onNavigate?.("businesses"));

    const portalInvest = this.container.querySelector("#portal-investments");
    if (portalInvest) portalInvest.addEventListener("click", () => this.onNavigate?.("investments"));

    const portalLuxury = this.container.querySelector("#portal-luxury");
    if (portalLuxury) portalLuxury.addEventListener("click", () => this.onNavigate?.("luxury"));

    const portalInsignias = this.container.querySelector("#portal-insignias");
    if (portalInsignias) portalInsignias.addEventListener("click", () => this.onNavigate?.("insignias"));

    const quickInvestBtn = this.container.querySelector("#dash-quick-invest-btn");
    if (quickInvestBtn && bestInvestment) {
      quickInvestBtn.addEventListener("click", () => {
        if (bestInvestment.type === "Business") {
          if (this.onQuickPurchase) this.onQuickPurchase(bestInvestment.id, 1);
        } else {
          if (this.onQuickUpgrade) this.onQuickUpgrade(bestInvestment.id);
        }
      });
    }
  }

  renderPortfolioBreakdown(state, totalIncomeSec) {
    const ownedBusinesses = BUSINESS_DEFINITIONS.filter(b => Selectors.getBusinessQuantity(state, b.id) > 0);
    if (ownedBusinesses.length === 0) {
      return `
        <div style="padding: 24px; text-align: center; color: var(--color-text-muted); font-size: var(--font-size-sm); background: var(--color-surface-raised); border-radius: var(--radius-sm);">
          No active enterprises generating revenue yet. Purchase your first <strong>Parcel Relay</strong> to begin!
        </div>
      `;
    }

    return ownedBusinesses.map(bizDef => {
      const income = Selectors.getBusinessNetIncomePerSecond(state, bizDef.id);
      const qty = Selectors.getBusinessQuantity(state, bizDef.id);
      const sharePct = totalIncomeSec > 0 ? Math.round((income / totalIncomeSec) * 100) : 0;
      const imgThumb = bizDef.image
        ? `<img src="${bizDef.image}" alt="${bizDef.name}" class="portfolio-item-thumb" loading="lazy" />`
        : `<div class="portfolio-item-icon">${ICONS[bizDef.icon] || ICONS.businesses}</div>`;

      return `
        <div class="portfolio-item">
          ${imgThumb}
          <div class="portfolio-item-details">
            <div class="portfolio-item-top">
              <span class="portfolio-item-name">${bizDef.name} (x${qty})</span>
              <span class="portfolio-item-income">${formatRate(income)} (${sharePct}%)</span>
            </div>
            <div class="portfolio-item-bar-bg">
              <div class="portfolio-item-bar-fill" style="width: ${sharePct}%;"></div>
            </div>
          </div>
        </div>
      `;
    }).join("");
  }

  renderRecentAchievements(state) {
    const completedIds = state.completedAchievementIds || [];
    if (completedIds.length === 0) {
      return `<div style="font-size: var(--font-size-xs); color: var(--color-text-dim);">No achievements unlocked yet. Purchase your first business to earn "First Step"!</div>`;
    }

    const recent = completedIds.slice(-3).reverse();
    return recent.map(id => {
      const ach = ACHIEVEMENTS.find(a => a.id === id);
      if (!ach) return "";
      return `
        <div style="display: flex; align-items: center; justify-content: space-between; padding: 6px 8px; border-radius: var(--radius-xs); background: var(--color-surface-raised); font-size: var(--font-size-xs);">
          <div style="display: flex; align-items: center; gap: 6px;">
            <div style="width: 14px; height: 14px; color: var(--color-gold);">${ICONS.check}</div>
            <span style="color: var(--color-text); font-weight: 500;">${ach.title}</span>
          </div>
          <span style="color: var(--color-positive); font-family: var(--font-family-mono);">+${formatCredits(ach.rewardCredits)}</span>
        </div>
      `;
    }).join("");
  }

  findBestInvestment(state) {
    const opportunities = [];

    // Consider unlocked businesses
    for (const b of BUSINESS_DEFINITIONS) {
      if (Selectors.isBusinessUnlocked(state, b.id)) {
        const cost = Selectors.getBusinessCost(state, b.id, 1);
        const payback = Selectors.getBusinessPurchasePayback(state, b.id, 1);
        if (Number.isFinite(payback) && payback > 0) {
          opportunities.push({
            id: b.id,
            name: b.name,
            type: "Business",
            image: b.image,
            cost,
            payback,
            description: `Adds +${formatRate(b.baseNetIncomePerSecond * Selectors.getBusinessMultiplier(state, b.id))} income`
          });
        }
      }
    }

    // Consider unlocked upgrades
    for (const u of UPGRADE_DEFINITIONS) {
      if (Selectors.isUpgradeUnlocked(state, u.id)) {
        const currentLvl = Selectors.getUpgradeLevel(state, u.id);
        if (currentLvl < u.maxLevel) {
          const cost = Selectors.getUpgradeCost(state, u.id);
          const payback = Selectors.getUpgradePayback(state, u.id);
          const parentBiz = BUSINESS_MAP.get(u.businessId);
          if (Number.isFinite(payback) && payback > 0) {
            opportunities.push({
              id: u.id,
              name: u.name,
              type: "Upgrade",
              image: parentBiz?.image,
              cost,
              payback,
              description: u.description
            });
          }
        }
      }
    }

    if (opportunities.length === 0) return null;

    // Sort by fastest payback period
    opportunities.sort((a, b) => a.payback - b.payback);
    return opportunities[0];
  }
}
