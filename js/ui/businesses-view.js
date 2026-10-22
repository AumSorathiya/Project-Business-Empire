/* ==========================================================================
   Business Empire: 21-Slot Businesses & Mergers View
   Manages owned businesses, new industry acquisitions, and mergers
   ========================================================================== */

import { BUSINESS_CATALOG, BUSINESS_CATALOG_MAP, BUSINESS_TYPES, MAX_BUSINESS_SLOTS } from "../data/business-catalog.js";
import { BusinessLogic } from "../engine/business-logic.js";
import { formatCredits } from "../utils/formatting.js";
import { AudioSystem } from "./audio.js";

export class BusinessesView {
  constructor(containerEl, callbacks = {}) {
    this.container = containerEl;
    this.callbacks = callbacks; // { onOpenBusiness, onUpgradeBusiness, onExecuteMerger, onOpenModal }
    this.activeTab = "owned";   // "owned" | "catalog" | "mergers"
  }

  render(state) {
    if (!this.container || !state) return;

    const owned = state.ownedBusinesses || [];
    const slotsUsed = owned.length;
    const canOpenMore = slotsUsed < MAX_BUSINESS_SLOTS;

    this.container.innerHTML = `
      <div class="be-subnav-bar">
        <div class="slots-pill ${canOpenMore ? 'available' : 'full'}">
          <span class="slots-dot"></span>
          <span>Slots: <strong>${slotsUsed} / ${MAX_BUSINESS_SLOTS}</strong></span>
        </div>
        <div class="be-tabs">
          <button class="be-tab-btn ${this.activeTab === 'owned' ? 'active' : ''}" data-tab="owned">
            My Businesses (${slotsUsed})
          </button>
          <button class="be-tab-btn ${this.activeTab === 'catalog' ? 'active' : ''}" data-tab="catalog">
            Open Business (12)
          </button>
          <button class="be-tab-btn ${this.activeTab === 'mergers' ? 'active' : ''}" data-tab="mergers">
            Mergers & Acquisitions (4)
          </button>
        </div>
      </div>

      <div class="be-tab-content">
        ${this.renderActiveTab(state, owned, slotsUsed)}
      </div>
    `;

    this.attachEvents(state);
  }

  renderActiveTab(state, owned, slotsUsed) {
    if (this.activeTab === "owned") {
      return this.renderOwnedBusinesses(state, owned);
    } else if (this.activeTab === "catalog") {
      return this.renderCatalog(state, slotsUsed);
    } else if (this.activeTab === "mergers") {
      return this.renderMergers(state);
    }
  }

  renderOwnedBusinesses(state, owned) {
    if (owned.length === 0) {
      return `
        <div class="be-empty-state">
          <div class="empty-icon">🏢</div>
          <h3>No Operational Businesses Yet</h3>
          <p>You have <strong>${MAX_BUSINESS_SLOTS}</strong> available business slots. Start by founding a Retail Store, Restaurant, or Metropolitan Taxi Co.</p>
          <button class="btn btn-gold switch-to-catalog-btn" style="margin-top: 1rem;">
            Browse Business Catalog
          </button>
        </div>
      `;
    }

    return `
      <div class="be-owned-grid">
        ${owned.map(inst => {
          const def = BUSINESS_CATALOG_MAP.get(inst.type);
          const hourlyIncome = BusinessLogic.calculateInstanceIncomePerHour(inst);
          const upgradeCost = Math.floor(def.upgradeCostBase * Math.pow(def.upgradeCostMultiplier, inst.level - 1));
          const isMax = inst.level >= def.maxLevel;
          const canAfford = state.cash >= upgradeCost && !isMax;

          return `
            <div class="be-card ${inst.type}" data-instance-id="${inst.id}">
              ${def.image ? `
                <div class="be-card-banner">
                  <img src="${def.image}" alt="${def.name}" loading="lazy" />
                  <div class="be-banner-overlay"></div>
                </div>
              ` : ''}
              <div class="be-card-header">
                <div class="be-card-badge">${def.category}</div>
                <div class="be-card-level">Level ${inst.level} ${isMax ? '(MAX)' : `/ ${def.maxLevel}`}</div>
              </div>
              <h3 class="be-card-title">${def.name}</h3>
              <p class="be-card-desc">${def.description}</p>
              
              <div class="be-card-metrics">
                <div class="metric-block">
                  <span class="m-label">Hourly Revenue</span>
                  <span class="m-val income">+${formatCredits(hourlyIncome)}/hr</span>
                </div>
                <div class="metric-block">
                  <span class="m-label">Capital Invested</span>
                  <span class="m-val">${formatCredits(inst.totalInvested || def.cost)}</span>
                </div>
              </div>

              ${inst.bankData ? `
                <div class="be-specialized-preview bank-preview">
                  <div class="slider-row">
                    <span>Deposit Rate: <strong>${inst.bankData.depositInterest.toFixed(2)}%</strong></span>
                    <span>Loan Rate: <strong>${inst.bankData.creditInterest.toFixed(2)}%</strong></span>
                  </div>
                  <div class="vault-info">
                    Vault: $${(inst.bankData.vaultCapacity).toLocaleString()}
                  </div>
                </div>
              ` : ''}

              <div class="be-card-actions">
                ${!isMax ? `
                  <button class="btn btn-primary btn-upgrade-inst ${canAfford ? '' : 'btn-disabled'}" 
                          data-instance-id="${inst.id}" ${canAfford ? '' : 'disabled'}>
                    Upgrade (${formatCredits(upgradeCost)})
                  </button>
                ` : `
                  <button class="btn btn-gold btn-disabled" disabled>Max Level Reached</button>
                `}
                
                ${def.hasBankSliders ? `
                  <button class="btn btn-secondary btn-manage-bank" data-instance-id="${inst.id}">
                    🏦 Vault Sliders
                  </button>
                ` : ''}

                ${inst.type === 'car-dealership' ? `
                  <button class="btn btn-gold btn-manage-garage" data-instance-id="${inst.id}">
                    🏎️ Salvage Garage
                  </button>
                ` : ''}

                ${inst.type === 'it-company' ? `
                  <button class="btn btn-secondary btn-manage-it" data-instance-id="${inst.id}">
                    💻 Software Studio
                  </button>
                ` : ''}
              </div>
            </div>
          `;
        }).join("")}
      </div>
    `;
  }

  renderCatalog(state, slotsUsed) {
    const standardBusinesses = BUSINESS_CATALOG.filter(b => !b.isMerger);
    const hasSlot = slotsUsed < MAX_BUSINESS_SLOTS;

    return `
      <div class="be-catalog-intro">
        <p>Found new commercial enterprises to automate your hourly cash flow. Maximum 21 concurrent business slots.</p>
      </div>
      <div class="be-catalog-grid">
        ${standardBusinesses.map(b => {
          const canAfford = state.cash >= b.cost && hasSlot;
          return `
            <div class="be-card catalog-card">
              ${b.image ? `
                <div class="be-card-banner">
                  <img src="${b.image}" alt="${b.name}" loading="lazy" />
                  <div class="be-banner-overlay"></div>
                </div>
              ` : ''}
              <div class="be-card-header">
                <span class="be-card-badge">${b.category}</span>
                <span class="be-card-cost">${formatCredits(b.cost)}</span>
              </div>
              <h3 class="be-card-title">${b.name}</h3>
              <p class="be-card-desc">${b.description}</p>
              
              <div class="be-card-metrics">
                <div class="metric-block">
                  <span class="m-label">Base Hourly Yield</span>
                  <span class="m-val income">+${formatCredits(b.baseIncomePerHour)}/hr</span>
                </div>
                <div class="metric-block">
                  <span class="m-label">Max Upgrade Tier</span>
                  <span class="m-val">Level ${b.maxLevel}</span>
                </div>
              </div>

              <div class="be-card-actions">
                <button class="btn btn-gold btn-found-biz ${canAfford ? '' : 'btn-disabled'}"
                        data-type-id="${b.id}" ${canAfford ? '' : 'disabled'}>
                  ${hasSlot ? `Found Business (${formatCredits(b.cost)})` : 'Slots Full (21/21)'}
                </button>
              </div>
            </div>
          `;
        }).join("")}
      </div>
    `;
  }

  renderMergers(state) {
    const mergers = BUSINESS_CATALOG.filter(b => b.isMerger);

    return `
      <div class="be-catalog-intro">
        <p>Consolidate lower-tier assets and scale into multibillion-dollar conglomerates.</p>
      </div>
      <div class="be-mergers-grid">
        ${mergers.map(m => {
          const check = BusinessLogic.canMerge(state, m.id);
          const reqs = m.requirements;

          return `
            <div class="be-card merger-card ${check.eligible ? 'merger-ready' : 'merger-locked'}">
              ${m.image ? `
                <div class="be-card-banner merger-banner">
                  <img src="${m.image}" alt="${m.name}" loading="lazy" />
                  <div class="be-banner-overlay"></div>
                </div>
              ` : ''}
              <div class="be-card-header">
                <span class="be-card-badge gold">MERGER</span>
                <span class="be-card-status ${check.eligible ? 'status-ready' : 'status-locked'}">
                  ${check.eligible ? '✓ Requirements Met' : 'Locked'}
                </span>
              </div>
              <h3 class="be-card-title">${m.name}</h3>
              <p class="be-card-desc">${m.description}</p>

              <div class="be-card-metrics">
                <div class="metric-block">
                  <span class="m-label">Base Hourly Revenue</span>
                  <span class="m-val income">+${formatCredits(m.baseIncomePerHour)}/hr</span>
                </div>
                <div class="metric-block">
                  <span class="m-label">Capital Requirement</span>
                  <span class="m-val">${formatCredits(reqs.cashCost)}</span>
                </div>
              </div>

              <div class="merger-requirements-list">
                <div class="req-title">Prerequisites:</div>
                ${reqs.businessTypes.map(bt => {
                  const reqDef = BUSINESS_CATALOG_MAP.get(bt.id);
                  const ownedMatch = (state.ownedBusinesses || []).find(b => b.type === bt.id && b.level >= bt.minLevel);
                  const isMet = Boolean(ownedMatch);
                  return `
                    <div class="req-item ${isMet ? 'met' : 'unmet'}">
                      <span>${isMet ? '✓' : '✗'} ${reqDef?.name || bt.id} (Level ${bt.minLevel}+)</span>
                    </div>
                  `;
                }).join("")}
                <div class="req-item ${state.cash >= reqs.cashCost ? 'met' : 'unmet'}">
                  <span>${state.cash >= reqs.cashCost ? '✓' : '✗'} Capital: ${formatCredits(reqs.cashCost)} Cash</span>
                </div>
                ${reqs.minCryptoPortfolioValue ? `
                  <div class="req-item ${(state.cryptoPortfolioValue || 0) >= reqs.minCryptoPortfolioValue ? 'met' : 'unmet'}">
                    <span>${(state.cryptoPortfolioValue || 0) >= reqs.minCryptoPortfolioValue ? '✓' : '✗'} $1 Billion in Crypto Holdings</span>
                  </div>
                ` : ''}
              </div>

              <div class="be-card-actions">
                <button class="btn btn-gold btn-exec-merger ${check.eligible ? '' : 'btn-disabled'}"
                        data-merger-id="${m.id}" ${check.eligible ? '' : 'disabled'}>
                  ${check.eligible ? 'Execute Corporate Merger' : (check.reason || 'Prerequisites Missing')}
                </button>
              </div>
            </div>
          `;
        }).join("")}
      </div>
    `;
  }

  attachEvents(state) {
    // Tab switching
    this.container.querySelectorAll(".be-tab-btn").forEach(btn => {
      btn.addEventListener("click", () => {
        this.activeTab = btn.dataset.tab;
        AudioSystem.playClick();
        this.render(state);
      });
    });

    const switchToCatalog = this.container.querySelector(".switch-to-catalog-btn");
    if (switchToCatalog) {
      switchToCatalog.addEventListener("click", () => {
        this.activeTab = "catalog";
        AudioSystem.playClick();
        this.render(state);
      });
    }

    // Found new business
    this.container.querySelectorAll(".btn-found-biz").forEach(btn => {
      btn.addEventListener("click", () => {
        const typeId = btn.dataset.typeId;
        if (this.callbacks.onOpenBusiness) {
          this.callbacks.onOpenBusiness(typeId);
        }
      });
    });

    // Upgrade business instance
    this.container.querySelectorAll(".btn-upgrade-inst").forEach(btn => {
      btn.addEventListener("click", () => {
        const instId = btn.dataset.instanceId;
        if (this.callbacks.onUpgradeBusiness) {
          this.callbacks.onUpgradeBusiness(instId);
        }
      });
    });

    // Execute merger
    this.container.querySelectorAll(".btn-exec-merger").forEach(btn => {
      btn.addEventListener("click", () => {
        const mergerId = btn.dataset.mergerId;
        if (this.callbacks.onExecuteMerger) {
          this.callbacks.onExecuteMerger(mergerId);
        }
      });
    });

    // Adjust Bank Rates modal
    this.container.querySelectorAll(".btn-manage-bank").forEach(btn => {
      btn.addEventListener("click", () => {
        const instId = btn.dataset.instanceId;
        if (this.callbacks.onOpenBankModal) {
          this.callbacks.onOpenBankModal(instId);
        }
      });
    });

    // Car Dealership Salvage Garage modal
    this.container.querySelectorAll(".btn-manage-garage").forEach(btn => {
      btn.addEventListener("click", () => {
        const instId = btn.dataset.instanceId;
        if (this.callbacks.onOpenCarGarage) {
          this.callbacks.onOpenCarGarage(instId);
        }
      });
    });

    // IT Software Studio modal
    this.container.querySelectorAll(".btn-manage-it").forEach(btn => {
      btn.addEventListener("click", () => {
        const instId = btn.dataset.instanceId;
        if (this.callbacks.onOpenITStudio) {
          this.callbacks.onOpenITStudio(instId);
        }
      });
    });
  }
}
