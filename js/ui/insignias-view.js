/* ==========================================================================
   Business Empire: Insignias & Tycoon Profile View
   The 5 Legendary Prestige Ranks and Financial Audit Telemetry
   ========================================================================== */

import { INSIGNIA_DEFINITIONS } from "../data/insignias-data.js";
import { Selectors } from "../app/selectors.js";
import { MarketEngine } from "../engine/market-simulation.js";
import { formatCredits } from "../utils/formatting.js";

export class InsigniasView {
  constructor(containerEl) {
    this.container = containerEl;
  }

  render(state) {
    if (!this.container || !state) return;

    const netWorth = Selectors.getNetWorth(state);
    const hourlyIncome = Selectors.getPortfolioHourlyIncome(state);
    const isFullBuyout = MarketEngine.isFullStockBuyout(state);
    const unlockedIds = state.unlockedInsigniaIds || [];

    // Financial Breakdown
    const cashVal = state.cash || 0;
    const businessCapital = (state.ownedBusinesses || []).reduce((sum, b) => sum + (b.totalInvested || 0), 0);
    const cryptoVal = MarketEngine.getCryptoPortfolioValue(state);
    const luxuryVal = MarketEngine.getLuxuryCollectionValue(state);

    this.container.innerHTML = `
      <div class="tycoon-profile-card">
        <div class="profile-header">
          <div class="profile-avatar">👑</div>
          <div class="profile-info">
            <h2>Sovereign Executive Profile</h2>
            <p class="profile-subtitle">Consolidated Global Net Worth & Asset Holdings</p>
          </div>
          <div class="profile-networth">
            <span class="nw-label">Total Net Worth</span>
            <span class="nw-value">${formatCredits(netWorth)}</span>
          </div>
        </div>

        <div class="profile-breakdown-grid">
          <div class="breakdown-item">
            <span class="b-label">Liquid Cash</span>
            <span class="b-val">${formatCredits(cashVal)}</span>
          </div>
          <div class="breakdown-item">
            <span class="b-label">Corporate Capital</span>
            <span class="b-val">${formatCredits(businessCapital)}</span>
          </div>
          <div class="breakdown-item">
            <span class="b-label">Crypto Assets</span>
            <span class="b-val">${formatCredits(cryptoVal)}</span>
          </div>
          <div class="breakdown-item">
            <span class="b-label">Luxury Collection</span>
            <span class="b-val">${formatCredits(luxuryVal)}</span>
          </div>
          <div class="breakdown-item">
            <span class="b-label">Hourly Cash Flow</span>
            <span class="b-val income">+${formatCredits(hourlyIncome)}/hr</span>
          </div>
          <div class="breakdown-item">
            <span class="b-label">Operational Slots</span>
            <span class="b-val">${(state.ownedBusinesses || []).length} / 21 Slots</span>
          </div>
        </div>
      </div>

      <div class="section-title-group" style="margin-top: 2rem;">
        <h2>The 5 Legendary Insignias</h2>
        <p>The ultimate milestone badges of sovereign wealth in Business Empire.</p>
      </div>

      <div class="insignias-grid">
        ${INSIGNIA_DEFINITIONS.map(insignia => {
          const isUnlocked = unlockedIds.includes(insignia.id);

          // Calculate progress percentage
          let progressPct = 0;
          if (insignia.id === "insignia-rich-man") {
            progressPct = Math.min(100, Math.floor((netWorth / 1000000) * 100));
          } else if (insignia.id === "insignia-investor") {
            progressPct = isFullBuyout ? 100 : 35;
          } else if (insignia.id === "insignia-business-empire") {
            const bizEarnings = state.businessEarningsLifetime || state.lifetimeEarnings || 0;
            progressPct = Math.min(100, Math.floor((bizEarnings / 100000000000000) * 100));
          } else if (insignia.id === "insignia-monopoly") {
            progressPct = Math.min(100, Math.floor((netWorth / 500000000000000) * 100));
          } else if (insignia.id === "insignia-the-owner") {
            progressPct = Math.min(100, Math.floor((netWorth / 5000000000000000) * 100));
          }

          if (isUnlocked) progressPct = 100;

          return `
            <div class="be-card insignia-card ${isUnlocked ? 'unlocked' : 'locked'}">
              <div class="be-card-header">
                <span class="insignia-tier">TIER ${insignia.tier}</span>
                <span class="insignia-badge-status ${isUnlocked ? 'badge-gold' : 'badge-locked'}">
                  ${isUnlocked ? '★ UNLOCKED' : 'LOCKED'}
                </span>
              </div>
              ${insignia.image ? `
                <div class="insignia-emblem-wrap">
                  <img src="${insignia.image}" alt="${insignia.name}" class="insignia-badge-img ${isUnlocked ? 'emblem-unlocked' : 'emblem-locked'}" />
                </div>
              ` : ''}
              <h3 class="be-card-title">${insignia.name}</h3>
              <p class="insignia-target">Target: <strong>${insignia.targetFormatted}</strong></p>
              <p class="be-card-desc">${insignia.description}</p>

              <div class="insignia-progress-bar-container">
                <div class="insignia-progress-bar" style="width: ${progressPct}%;"></div>
              </div>
              <div class="insignia-progress-label">${progressPct}% Complete</div>
            </div>
          `;
        }).join("")}
      </div>
    `;
  }
}
