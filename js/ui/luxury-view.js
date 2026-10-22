/* ==========================================================================
   Business Empire: Luxury Lifestyle & Trophy Showroom View
   Personal Collection: Supercars, Megayachts, Aircraft, and Private Islands
   ========================================================================== */

import { LUXURY_DEFINITIONS, LUXURY_CATEGORIES, LUXURY_MAP } from "../data/luxury-data.js";
import { MarketEngine } from "../engine/market-simulation.js";
import { formatCredits } from "../utils/formatting.js";
import { AudioSystem } from "./audio.js";

export class LuxuryView {
  constructor(containerEl, callbacks = {}) {
    this.container = containerEl;
    this.callbacks = callbacks; // { onBuyLuxury }
    this.activeCategory = "all";
  }

  render(state) {
    if (!this.container || !state) return;

    MarketEngine.initMarketState(state);

    const totalValuation = MarketEngine.getLuxuryCollectionValue(state);
    const ownedCount = state.ownedLuxury.length;

    this.container.innerHTML = `
      <div class="invest-banner luxury-banner">
        <div class="banner-stat">
          <span class="label">Personal Luxury Collection Valuation</span>
          <span class="value income">${formatCredits(totalValuation)}</span>
        </div>
        <div class="banner-stat">
          <span class="label">Trophy Assets Owned</span>
          <span class="value" style="color: var(--color-gold);">${ownedCount} / ${LUXURY_DEFINITIONS.length} Items</span>
        </div>
      </div>

      <div class="be-subnav-bar">
        <div class="be-tabs">
          <button class="be-tab-btn ${this.activeCategory === 'all' ? 'active' : ''}" data-cat="all">
            All Collections
          </button>
          <button class="be-tab-btn ${this.activeCategory === LUXURY_CATEGORIES.VEHICLES ? 'active' : ''}" data-cat="${LUXURY_CATEGORIES.VEHICLES}">
            🏎️ Supercars
          </button>
          <button class="be-tab-btn ${this.activeCategory === LUXURY_CATEGORIES.YACHTS ? 'active' : ''}" data-cat="${LUXURY_CATEGORIES.YACHTS}">
            🛥️ Megayachts
          </button>
          <button class="be-tab-btn ${this.activeCategory === LUXURY_CATEGORIES.AIRCRAFT ? 'active' : ''}" data-cat="${LUXURY_CATEGORIES.AIRCRAFT}">
            ✈️ Private Aircraft
          </button>
          <button class="be-tab-btn ${this.activeCategory === LUXURY_CATEGORIES.ISLANDS ? 'active' : ''}" data-cat="${LUXURY_CATEGORIES.ISLANDS}">
            🏝️ Private Islands
          </button>
        </div>
      </div>

      <div class="invest-grid">
        ${this.renderItems(state)}
      </div>
    `;

    this.attachEvents(state);
  }

  renderItems(state) {
    const filtered = this.activeCategory === "all"
      ? LUXURY_DEFINITIONS
      : LUXURY_DEFINITIONS.filter(i => i.category === this.activeCategory);

    return filtered.map(item => {
      const isOwned = state.ownedLuxury.includes(item.id);
      const canAfford = state.cash >= item.cost && !isOwned;

      return `
        <div class="be-card luxury-card ${isOwned ? 'luxury-owned' : ''}">
          ${item.image ? `
            <div class="be-card-banner luxury-banner">
              <img src="${item.image}" alt="${item.name}" loading="lazy" />
              <div class="be-banner-overlay"></div>
            </div>
          ` : ''}
          <div class="be-card-header">
            <div>
              <span class="ticker-badge gold">${item.category.toUpperCase()}</span>
            </div>
            <div class="be-card-level">
              ${isOwned ? '★ In Collection' : formatCredits(item.cost)}
            </div>
          </div>
          <h3 class="be-card-title">${item.name}</h3>
          <p class="be-card-desc">${item.description}</p>

          <div class="be-card-metrics">
            <div class="metric-block">
              <span class="m-label">Net Worth Contribution</span>
              <span class="m-val income">+${formatCredits(item.cost)}</span>
            </div>
            <div class="metric-block">
              <span class="m-label">Status</span>
              <span class="m-val ${isOwned ? 'income' : ''}">${isOwned ? 'Owned' : 'Available for Acquisition'}</span>
            </div>
          </div>

          <div class="be-card-actions">
            ${isOwned ? `
              <button class="btn btn-gold btn-disabled" disabled>✓ In Personal Hangar</button>
            ` : `
              <button class="btn btn-gold btn-buy-luxury ${canAfford ? '' : 'btn-disabled'}"
                      data-luxury-id="${item.id}" ${canAfford ? '' : 'disabled'}>
                Acquire Asset (${formatCredits(item.cost)})
              </button>
            `}
          </div>
        </div>
      `;
    }).join("");
  }

  attachEvents(state) {
    this.container.querySelectorAll(".be-tab-btn").forEach(btn => {
      btn.addEventListener("click", () => {
        this.activeCategory = btn.dataset.cat;
        AudioSystem.playClick();
        this.render(state);
      });
    });

    this.container.querySelectorAll(".btn-buy-luxury").forEach(btn => {
      btn.addEventListener("click", () => {
        const luxId = btn.dataset.luxuryId;
        if (this.callbacks.onBuyLuxury) this.callbacks.onBuyLuxury(luxId);
      });
    });
  }
}
