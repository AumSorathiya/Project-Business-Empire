/* ==========================================================================
   Empire Architect: Upgrade Panel Component
   Displays business upgrades, levels, multipliers, and purchase actions
   ========================================================================== */

import { UPGRADE_DEFINITIONS } from "../data/upgrades.js";
import { BUSINESS_MAP } from "../data/businesses.js";
import { Selectors } from "../app/selectors.js";
import { formatCredits, formatPercent } from "../utils/formatting.js";
import { formatPayback } from "../utils/time.js";
import { ICONS } from "./icons.js";

export class UpgradePanelView {
  constructor(containerEl, onUpgrade) {
    this.container = containerEl;
    this.onUpgrade = onUpgrade;
  }

  render(state) {
    if (!this.container) return;
    this.container.innerHTML = "";

    // Technologies R&D Hero Banner with illustration
    const banner = document.createElement("div");
    banner.className = "milestone-banner tech-banner";
    banner.style.marginBottom = "var(--space-20)";
    banner.innerHTML = `
      <div class="milestone-info">
        <div class="milestone-tag">
          <span style="display: inline-block; width: 6px; height: 6px; border-radius: 50%; background: var(--color-gold);"></span>
          Research & Innovation Labs
        </div>
        <div class="milestone-title">Technological Optimizations</div>
        <div class="milestone-desc">Deploy corporate research advancements to compound enterprise profit margins and operational throughput.</div>
      </div>
    `;
    this.container.appendChild(banner);

    const grid = document.createElement("div");
    grid.className = "business-grid";

    for (const upgradeDef of UPGRADE_DEFINITIONS) {
      const parentBiz = BUSINESS_MAP.get(upgradeDef.businessId);
      const isUnlocked = Selectors.isUpgradeUnlocked(state, upgradeDef.id);
      const currentLevel = Selectors.getUpgradeLevel(state, upgradeDef.id);
      const isMax = currentLevel >= upgradeDef.maxLevel;
      const cost = isMax ? Infinity : Selectors.getUpgradeCost(state, upgradeDef.id);
      const payback = isMax ? Infinity : Selectors.getUpgradePayback(state, upgradeDef.id);
      const canAfford = !isMax && state.cash >= cost;
      const parentQty = parentBiz ? Selectors.getBusinessQuantity(state, parentBiz.id) : 0;

      const card = document.createElement("div");
      card.className = `card ${isUnlocked ? "" : "locked"}`;
      card.id = `upgrade-${upgradeDef.id}`;
      card.style.display = "flex";
      card.style.flexDirection = "column";
      card.style.gap = "var(--space-12)";

      const parentImg = parentBiz?.image
        ? `<img src="${parentBiz.image}" alt="${parentBiz.name}" class="upgrade-item-thumb" loading="lazy" />`
        : `<div class="business-icon-wrapper">${ICONS.upgrades}</div>`;

      if (!isUnlocked) {
        card.innerHTML = `
          <div style="display: flex; align-items: center; gap: 12px; opacity: 0.7;">
            ${parentBiz?.image ? `<img src="${parentBiz.image}" alt="${parentBiz.name}" class="upgrade-item-thumb" style="filter: grayscale(40%); opacity: 0.75;" />` : `<div style="width: 48px; height: 48px; color: var(--color-text-dim);">${ICONS.lock}</div>`}
            <div>
              <div style="font-weight: bold; color: var(--color-text); font-size: var(--font-size-base);">${upgradeDef.name}</div>
              <div style="font-size: var(--font-size-xs); color: var(--color-text-dim);">${parentBiz ? parentBiz.name : "Enterprise"} Optimization</div>
            </div>
          </div>
          <div style="padding: 12px; border-radius: var(--radius-sm); background: var(--color-surface-raised); font-size: var(--font-size-xs); color: var(--color-gold); font-weight: 600; text-align: center; border: 1px solid var(--color-border-subtle);">
            Requires ${parentBiz ? parentBiz.name : "Enterprise"} Unlocked (Empire Level ${upgradeDef.unlockLevel})
          </div>
        `;
      } else {
        const progressPct = Math.round((currentLevel / upgradeDef.maxLevel) * 100);

        card.innerHTML = `
          <div style="display: flex; align-items: center; justify-content: space-between; gap: 12px;">
            <div style="display: flex; align-items: center; gap: 12px; min-width: 0;">
              ${parentImg}
              <div style="min-width: 0;">
                <div style="font-weight: bold; font-size: var(--font-size-base); color: var(--color-text); white-space: nowrap; overflow: hidden; text-overflow: ellipsis;">${upgradeDef.name}</div>
                <div style="font-size: var(--font-size-xs); color: var(--color-gold); font-weight: 600;">${parentBiz ? parentBiz.name : ""} Upgrade</div>
              </div>
            </div>
            <span class="business-qty-badge" style="flex-shrink: 0;">${currentLevel} / ${upgradeDef.maxLevel}</span>
          </div>

          <p style="font-size: var(--font-size-xs); color: var(--color-text-muted); line-height: 1.45;">${upgradeDef.description}</p>

          <div class="progress-container">
            <div class="progress-bar" style="width: ${progressPct}%;"></div>
          </div>

          <div class="business-stats-row">
            <div class="stat-cell">
              <span class="label">Total Bonus</span>
              <span class="value highlight">${formatPercent(currentLevel * upgradeDef.effectPerLevel)}</span>
            </div>
            <div class="stat-cell">
              <span class="label">Next Level Cost</span>
              <span class="value">${isMax ? "MAX" : formatCredits(cost)}</span>
            </div>
            <div class="stat-cell" style="grid-column: span 2;">
              <span class="label">Est. Payback (${parentQty} owned units)</span>
              <span class="value">${isMax ? "Completed" : (parentQty === 0 ? "Own 1+ units to benefit" : formatPayback(payback))}</span>
            </div>
          </div>

          <div style="margin-top: auto; display: flex;">
            <button class="btn ${isMax ? "btn-secondary" : "btn-primary"} btn-sm buy-upgrade-btn" style="width: 100%;"
              ${!canAfford || isMax ? "disabled" : ""}>
              ${isMax ? "Max Level Reached" : `Upgrade (${formatCredits(cost)})`}
            </button>
          </div>
        `;

        const buyBtn = card.querySelector(".buy-upgrade-btn");
        if (buyBtn && !isMax) {
          buyBtn.addEventListener("click", () => {
            if (this.onUpgrade) this.onUpgrade(upgradeDef.id);
          });
        }
      }

      grid.appendChild(card);
    }

    this.container.appendChild(grid);
  }
}
