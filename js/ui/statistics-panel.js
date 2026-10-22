/* ==========================================================================
   Empire Architect: Statistics Panel Component
   Displays detailed financial and empire operation metrics
   ========================================================================== */

import { Selectors } from "../app/selectors.js";
import { formatCredits, formatRate, formatInt } from "../utils/formatting.js";
import { formatDuration } from "../utils/time.js";
import { EMPIRE_LEVELS } from "../progression/levels.js";

export class StatisticsPanelView {
  constructor(containerEl) {
    this.container = containerEl;
  }

  render(state) {
    if (!this.container) return;

    const netWorth = Selectors.getNetWorth(state);
    const netIncomeSec = Selectors.getPortfolioNetIncomePerSecond(state);
    const hourlyIncome = netIncomeSec * 3600;
    const dailyIncome = netIncomeSec * 86400;
    const totalBiz = Selectors.getTotalBusinessesOwned(state);
    const distinctBiz = Selectors.getDistinctBusinessesOwned(state);
    const levelTier = EMPIRE_LEVELS.find(l => l.level === state.empireLevel) || EMPIRE_LEVELS[0];
    const totalPlayTime = formatDuration(state.statistics?.totalPlaySeconds || 0);
    const foundedDate = state.createdAt ? new Date(state.createdAt).toLocaleString() : "Recent";
    const lastSaved = state.lastSavedAt ? new Date(state.lastSavedAt).toLocaleTimeString() : "Just now";

    this.container.innerHTML = `
      <div style="display: grid; grid-template-columns: repeat(auto-fit, minmax(300px, 1fr)); gap: var(--space-20);">
        <!-- Financial Performance Card -->
        <div class="card">
          <h3 style="font-size: var(--font-size-md); color: var(--color-gold); margin-bottom: var(--space-16); text-transform: uppercase; letter-spacing: 0.05em;">Financial Balance Sheet</h3>
          <div style="display: flex; flex-direction: column; gap: 12px;">
            <div style="display: flex; justify-content: space-between; border-bottom: 1px solid var(--color-border-subtle); padding-bottom: 8px;">
              <span style="color: var(--color-text-muted); font-size: var(--font-size-sm);">Available Liquid Cash</span>
              <span style="font-family: var(--font-family-mono); font-weight: bold; color: var(--color-gold);">${formatCredits(state.cash)}</span>
            </div>
            <div style="display: flex; justify-content: space-between; border-bottom: 1px solid var(--color-border-subtle); padding-bottom: 8px;">
              <span style="color: var(--color-text-muted); font-size: var(--font-size-sm);">Total Empire Net Worth</span>
              <span style="font-family: var(--font-family-mono); font-weight: bold; color: var(--color-text);">${formatCredits(netWorth)}</span>
            </div>
            <div style="display: flex; justify-content: space-between; border-bottom: 1px solid var(--color-border-subtle); padding-bottom: 8px;">
              <span style="color: var(--color-text-muted); font-size: var(--font-size-sm);">Cumulative Lifetime Earnings</span>
              <span style="font-family: var(--font-family-mono); font-weight: bold; color: var(--color-positive);">${formatCredits(state.lifetimeEarnings)}</span>
            </div>
            <div style="display: flex; justify-content: space-between; border-bottom: 1px solid var(--color-border-subtle); padding-bottom: 8px;">
              <span style="color: var(--color-text-muted); font-size: var(--font-size-sm);">Net Income Rate</span>
              <span style="font-family: var(--font-family-mono); font-weight: bold; color: var(--color-positive);">${formatRate(netIncomeSec)}</span>
            </div>
            <div style="display: flex; justify-content: space-between; border-bottom: 1px solid var(--color-border-subtle); padding-bottom: 8px;">
              <span style="color: var(--color-text-muted); font-size: var(--font-size-sm);">Projected Hourly Revenue</span>
              <span style="font-family: var(--font-family-mono); font-weight: bold; color: var(--color-text);">${formatCredits(hourlyIncome)}/hr</span>
            </div>
            <div style="display: flex; justify-content: space-between;">
              <span style="color: var(--color-text-muted); font-size: var(--font-size-sm);">Projected Daily Revenue</span>
              <span style="font-family: var(--font-family-mono); font-weight: bold; color: var(--color-text);">${formatCredits(dailyIncome)}/day</span>
            </div>
          </div>
        </div>

        <!-- Operations & Portfolio Card -->
        <div class="card">
          <h3 style="font-size: var(--font-size-md); color: var(--color-gold); margin-bottom: var(--space-16); text-transform: uppercase; letter-spacing: 0.05em;">Operations & Portfolio</h3>
          <div style="display: flex; flex-direction: column; gap: 12px;">
            <div style="display: flex; justify-content: space-between; border-bottom: 1px solid var(--color-border-subtle); padding-bottom: 8px;">
              <span style="color: var(--color-text-muted); font-size: var(--font-size-sm);">Empire Standing</span>
              <span style="font-weight: bold; color: var(--color-gold);">Lvl ${state.empireLevel} (${levelTier.title})</span>
            </div>
            <div style="display: flex; justify-content: space-between; border-bottom: 1px solid var(--color-border-subtle); padding-bottom: 8px;">
              <span style="color: var(--color-text-muted); font-size: var(--font-size-sm);">Total Enterprises Owned</span>
              <span style="font-family: var(--font-family-mono); font-weight: bold; color: var(--color-text);">${formatInt(totalBiz)}</span>
            </div>
            <div style="display: flex; justify-content: space-between; border-bottom: 1px solid var(--color-border-subtle); padding-bottom: 8px;">
              <span style="color: var(--color-text-muted); font-size: var(--font-size-sm);">Active Industry Sectors</span>
              <span style="font-family: var(--font-family-mono); font-weight: bold; color: var(--color-text);">${distinctBiz} / 8</span>
            </div>
            <div style="display: flex; justify-content: space-between; border-bottom: 1px solid var(--color-border-subtle); padding-bottom: 8px;">
              <span style="color: var(--color-text-muted); font-size: var(--font-size-sm);">Total Acquisitions Made</span>
              <span style="font-family: var(--font-family-mono); font-weight: bold; color: var(--color-text);">${formatInt(state.statistics?.totalPurchases || 0)}</span>
            </div>
            <div style="display: flex; justify-content: space-between; border-bottom: 1px solid var(--color-border-subtle); padding-bottom: 8px;">
              <span style="color: var(--color-text-muted); font-size: var(--font-size-sm);">Technological Upgrades</span>
              <span style="font-family: var(--font-family-mono); font-weight: bold; color: var(--color-text);">${formatInt(state.statistics?.totalUpgrades || 0)}</span>
            </div>
            <div style="display: flex; justify-content: space-between;">
              <span style="color: var(--color-text-muted); font-size: var(--font-size-sm);">Achievements Completed</span>
              <span style="font-family: var(--font-family-mono); font-weight: bold; color: var(--color-gold);">${(state.completedAchievementIds || []).length} / 16</span>
            </div>
          </div>
        </div>

        <!-- Archival & Session Info Card -->
        <div class="card" style="grid-column: 1 / -1;">
          <h3 style="font-size: var(--font-size-md); color: var(--color-gold); margin-bottom: var(--space-16); text-transform: uppercase; letter-spacing: 0.05em;">Session & Integrity Record</h3>
          <div style="display: grid; grid-template-columns: repeat(auto-fit, minmax(200px, 1fr)); gap: 16px;">
            <div>
              <div style="font-size: var(--font-size-xs); color: var(--color-text-dim); text-transform: uppercase;">Total Playtime</div>
              <div style="font-family: var(--font-family-mono); font-size: var(--font-size-md); font-weight: bold; color: var(--color-text); margin-top: 4px;">${totalPlayTime}</div>
            </div>
            <div>
              <div style="font-size: var(--font-size-xs); color: var(--color-text-dim); text-transform: uppercase;">Enterprise Founded</div>
              <div style="font-family: var(--font-family-mono); font-size: var(--font-size-sm); color: var(--color-text); margin-top: 4px;">${foundedDate}</div>
            </div>
            <div>
              <div style="font-size: var(--font-size-xs); color: var(--color-text-dim); text-transform: uppercase;">Last Persistence Save</div>
              <div style="font-family: var(--font-family-mono); font-size: var(--font-size-sm); color: var(--color-text); margin-top: 4px;">${lastSaved}</div>
            </div>
            <div>
              <div style="font-size: var(--font-size-xs); color: var(--color-text-dim); text-transform: uppercase;">Data Storage Type</div>
              <div style="font-family: var(--font-family-mono); font-size: var(--font-size-sm); color: var(--color-text); margin-top: 4px;">LocalStorage (Versioned)</div>
            </div>
          </div>
        </div>
      </div>
    `;
  }
}
