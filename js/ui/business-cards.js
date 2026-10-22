/* ==========================================================================
   Empire Architect: Business Cards Component
   Renders and updates business grid cards with category filters, bulk buy multipliers,
   and visual artwork per Design.md & PRD.md
   ========================================================================== */

import { BUSINESS_DEFINITIONS } from "../data/businesses.js";
import { Selectors } from "../app/selectors.js";
import { formatCredits, formatRate } from "../utils/formatting.js";
import { formatPayback } from "../utils/time.js";
import { ICONS } from "./icons.js";

function getMaxAffordable(state, bizDefId) {
  if (Selectors.getBusinessCost(state, bizDefId, 1) > state.cash) {
    return 1;
  }
  let low = 1;
  let high = 5000;
  let best = 1;
  while (low <= high) {
    const mid = Math.floor((low + high) / 2);
    const cost = Selectors.getBusinessCost(state, bizDefId, mid);
    if (cost <= state.cash) {
      best = mid;
      low = mid + 1;
    } else {
      high = mid - 1;
    }
  }
  return best;
}

export class BusinessCardsView {
  constructor(containerEl, onPurchase) {
    this.container = containerEl;
    this.onPurchase = onPurchase;
    this.selectedCategory = "all";
    this.selectedMultiplier = 1; // 1, 10, 25, 'max'
  }

  render(state) {
    if (!this.container) return;
    this.container.innerHTML = "";

    // 1. Controls Header Toolbar (Category Filter + Buy Multiplier)
    const toolbar = document.createElement("div");
    toolbar.className = "controls-header-bar";

    const filterBar = document.createElement("div");
    filterBar.className = "filter-pills-bar";

    const categories = [
      { id: "all", label: "All Sectors" },
      { id: "Logistics", label: "Logistics" },
      { id: "Hospitality", label: "Hospitality" },
      { id: "Technology", label: "Technology" },
      { id: "Infrastructure", label: "Infrastructure" },
      { id: "Consumer Goods", label: "Consumer Goods" },
      { id: "Industrial", label: "Industrial" },
      { id: "Aerospace", label: "Aerospace" },
      { id: "Advanced Materials", label: "Materials" }
    ];

    for (const cat of categories) {
      const pill = document.createElement("button");
      pill.type = "button";
      pill.className = `filter-pill ${this.selectedCategory === cat.id ? "active" : ""}`;
      pill.textContent = cat.label;
      pill.addEventListener("click", () => {
        this.selectedCategory = cat.id;
        this.render(state);
      });
      filterBar.appendChild(pill);
    }

    const multGroup = document.createElement("div");
    multGroup.className = "multiplier-group";

    const multLabel = document.createElement("span");
    multLabel.className = "multiplier-label";
    multLabel.textContent = "Buy";
    multGroup.appendChild(multLabel);

    const multipliers = [
      { id: 1, label: "1x" },
      { id: 10, label: "10x" },
      { id: 25, label: "25x" },
      { id: "max", label: "MAX" }
    ];

    for (const m of multipliers) {
      const btn = document.createElement("button");
      btn.type = "button";
      btn.className = `mult-btn ${this.selectedMultiplier === m.id ? "active" : ""}`;
      btn.textContent = m.label;
      btn.addEventListener("click", () => {
        this.selectedMultiplier = m.id;
        this.render(state);
      });
      multGroup.appendChild(btn);
    }

    toolbar.appendChild(filterBar);
    toolbar.appendChild(multGroup);
    this.container.appendChild(toolbar);

    // 2. Business Grid
    const grid = document.createElement("div");
    grid.className = "business-grid";

    BUSINESS_DEFINITIONS.forEach((bizDef, index) => {
      // Category filter check
      if (this.selectedCategory !== "all" && bizDef.category !== this.selectedCategory) {
        return;
      }

      const isUnlocked = Selectors.isBusinessUnlocked(state, bizDef.id);
      const qty = Selectors.getBusinessQuantity(state, bizDef.id);
      const currentNetIncome = Selectors.getBusinessNetIncomePerSecond(state, bizDef.id);
      const multiplier = Selectors.getBusinessMultiplier(state, bizDef.id);
      const tierNum = index + 1;

      // Determine purchase quantities and costs based on active multiplier
      let targetCount = this.selectedMultiplier === "max"
        ? getMaxAffordable(state, bizDef.id)
        : this.selectedMultiplier;

      const targetCost = Selectors.getBusinessCost(state, bizDef.id, targetCount);
      const canAffordTarget = state.cash >= targetCost;

      const cost1 = Selectors.getBusinessCost(state, bizDef.id, 1);
      const cost10 = Selectors.getBusinessCost(state, bizDef.id, 10);
      const payback1 = Selectors.getBusinessPurchasePayback(state, bizDef.id, 1);
      const canAfford1 = state.cash >= cost1;
      const canAfford10 = state.cash >= cost10;

      const card = document.createElement("div");
      card.className = `business-card ${isUnlocked ? "unlocked" : "locked"}`;
      card.id = `card-${bizDef.id}`;

      const iconSvg = ICONS[bizDef.icon] || ICONS.businesses;
      const imageUrl = bizDef.image || "assets/illustrations/banner.jpg";
      const catClass = bizDef.category.toLowerCase().replace(/\s+/g, "-");

      if (!isUnlocked) {
        card.innerHTML = `
          <div class="business-card-banner">
            <span class="business-tier-badge">TIER ${tierNum}</span>
            <img src="${imageUrl}" alt="${bizDef.name}" class="business-card-img" loading="lazy" />
            <div class="business-banner-overlay"></div>
            <span class="business-qty-badge-floating" style="color: var(--color-text-dim); border-color: var(--color-border); font-size: 0.7rem;">Locked</span>
          </div>
          <div class="business-card-body">
            <div class="business-card-header">
              <div class="business-icon-wrapper" style="opacity: 0.6; background-color: var(--color-surface-raised); border-color: var(--color-border); color: var(--color-text-dim);">${iconSvg}</div>
              <div class="business-title-box">
                <div class="business-name">${bizDef.name}</div>
                <div class="business-category">
                  <span class="business-category-tag ${catClass}">${bizDef.category}</span>
                </div>
              </div>
            </div>
            <div class="lock-overlay" style="padding: var(--space-12) 0; border: 1px dashed var(--color-border); border-radius: var(--radius-sm); background-color: var(--color-surface-raised);">
              <div class="lock-icon" style="width: 24px; height: 24px;">${ICONS.lock}</div>
              <div class="lock-req">Requires Empire Level ${bizDef.unlock.minimumLevel}</div>
              <p style="font-size: var(--font-size-xs); color: var(--color-text-dim); margin-top: 4px; padding: 0 10px;">${bizDef.description}</p>
            </div>
          </div>
        `;
      } else {
        const primaryLabel = targetCount === 1
          ? `Buy 1 (${formatCredits(targetCost)})`
          : `Buy ${targetCount}x (${formatCredits(targetCost)})`;

        const secondaryCount = targetCount === 1 ? 10 : 1;
        const secondaryCost = targetCount === 1 ? cost10 : cost1;
        const canAffordSec = targetCount === 1 ? canAfford10 : canAfford1;
        const secondaryLabel = `+${secondaryCount} (${formatCredits(secondaryCost)})`;

        card.innerHTML = `
          <div class="business-card-banner">
            <span class="business-tier-badge">TIER ${tierNum}</span>
            <img src="${imageUrl}" alt="${bizDef.name}" class="business-card-img" loading="lazy" />
            <div class="business-banner-overlay"></div>
            <span class="business-qty-badge-floating">x${qty}</span>
          </div>

          <div class="business-card-body">
            <div class="business-card-header">
              <div class="business-icon-wrapper">${iconSvg}</div>
              <div class="business-title-box">
                <div class="business-name">${bizDef.name}</div>
                <div class="business-category">
                  <span class="business-category-tag ${catClass}">${bizDef.category}</span>
                </div>
              </div>
            </div>

            <p class="business-desc">${bizDef.description}</p>

            <div class="business-stats-row">
              <div class="stat-cell">
                <span class="label">Net Income</span>
                <span class="value highlight">${formatRate(currentNetIncome)}</span>
              </div>
              <div class="stat-cell">
                <span class="label">Efficiency</span>
                <span class="value">${multiplier.toFixed(2)}x</span>
              </div>
              <div class="stat-cell">
                <span class="label">Next Unit Cost</span>
                <span class="value">${formatCredits(cost1)}</span>
              </div>
              <div class="stat-cell">
                <span class="label">Est. Payback</span>
                <span class="value" title="Break-even time for next purchase">${formatPayback(payback1)}</span>
              </div>
            </div>

            <div class="business-actions">
              <button type="button" class="btn btn-primary btn-sm buy-btn-primary" ${canAffordTarget ? "" : "disabled"} title="${canAffordTarget ? `Purchase ${targetCount} units for ${formatCredits(targetCost)}` : `Need ${formatCredits(targetCost)} credits`}">
                ${primaryLabel}
              </button>
              <button type="button" class="btn btn-secondary btn-sm buy-btn-secondary" ${canAffordSec ? "" : "disabled"} title="${canAffordSec ? `Purchase ${secondaryCount} units for ${formatCredits(secondaryCost)}` : `Need ${formatCredits(secondaryCost)} credits`}">
                ${secondaryLabel}
              </button>
            </div>
          </div>
        `;

        const primaryBtn = card.querySelector(".buy-btn-primary");
        const secondaryBtn = card.querySelector(".buy-btn-secondary");

        if (primaryBtn) {
          primaryBtn.addEventListener("click", () => {
            if (this.onPurchase) this.onPurchase(bizDef.id, targetCount);
          });
        }

        if (secondaryBtn) {
          secondaryBtn.addEventListener("click", () => {
            if (this.onPurchase) this.onPurchase(bizDef.id, secondaryCount);
          });
        }
      }

      grid.appendChild(card);
    });

    this.container.appendChild(grid);
  }
}
