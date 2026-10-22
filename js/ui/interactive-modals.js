/* ==========================================================================
   Business Empire: Interactive Minigame Modals
   Bank Vault, Car Auction Garage, IT Software Studio, and Fortune Wheel
   ========================================================================== */

import { formatCredits } from "../utils/formatting.js";
import { AUCTION_CARS } from "../data/car-auction-data.js";
import { IT_STAFF_ROLES, IT_PROJECTS } from "../data/it-projects-data.js";
import { FORTUNE_WHEEL_SLICES } from "../data/tap-upgrades-data.js";
import { InteractiveEngine } from "../engine/interactive-engine.js";
import { BusinessLogic } from "../engine/business-logic.js";
import { AudioSystem } from "./audio.js";

export class InteractiveModals {
  static openBankModal(state, instanceId, onUpdate) {
    const inst = (state.ownedBusinesses || []).find(b => b.id === instanceId);
    if (!inst) return;

    if (!inst.bankData) {
      inst.bankData = { depositInterest: 6.30, creditInterest: 9.60, vaultCapacity: 50000000 };
    }

    const modalOverlay = document.createElement("div");
    modalOverlay.className = "be-modal-overlay";
    modalOverlay.innerHTML = `
      <div class="be-modal-box">
        <div class="be-modal-header">
          <div style="display: flex; align-items: center; gap: 10px;">
            <span style="font-size: 24px;">🏦</span>
            <div>
              <h3>Commercial Reserve Bank — Vault Operations</h3>
              <p class="modal-subtitle">Optimize interest spread across client deposits and credit facilities</p>
            </div>
          </div>
          <button class="modal-close-btn">&times;</button>
        </div>

        <div class="vault-fill-container">
          <div class="vault-fill-label">
            <span>Vault Reserve Fill</span>
            <strong style="color: var(--color-gold);">$${inst.bankData.vaultCapacity.toLocaleString()} / $420,000,000,000 MAX</strong>
          </div>
          <div class="vault-progress-bg">
            <div class="vault-progress-fill" style="width: ${Math.min(100, (inst.bankData.vaultCapacity / 420000000000) * 100)}%;"></div>
          </div>
        </div>

        <div class="slider-control-card">
          <div class="slider-header">
            <span>Deposit Interest Rate (Client Attraction)</span>
            <strong id="deposit-val" class="highlight-val">${inst.bankData.depositInterest.toFixed(2)}%</strong>
          </div>
          <input type="range" id="deposit-slider" min="1.0" max="14.0" step="0.1" value="${inst.bankData.depositInterest}" class="be-slider" />
          <div class="slider-hint">Optimal market sweet spot: ~6.30% (High deposits, balanced retention)</div>
        </div>

        <div class="slider-control-card">
          <div class="slider-header">
            <span>Credit / Loan Interest Rate (Lending Revenue)</span>
            <strong id="credit-val" class="highlight-val">${inst.bankData.creditInterest.toFixed(2)}%</strong>
          </div>
          <input type="range" id="credit-slider" min="4.0" max="18.0" step="0.1" value="${inst.bankData.creditInterest}" class="be-slider" />
          <div class="slider-hint">Optimal market sweet spot: ~9.60% (Excessive rates reduce borrower volume)</div>
        </div>

        <div class="spread-calculation-card">
          <div class="spread-item">
            <span class="s-label">Gross Margin Spread</span>
            <span class="s-val" id="spread-val">${(inst.bankData.creditInterest - inst.bankData.depositInterest).toFixed(2)}%</span>
          </div>
          <div class="spread-item">
            <span class="s-label">Projected Hourly Profit</span>
            <span class="s-val income" id="profit-val">+${formatCredits(BusinessLogic.calculateInstanceIncomePerHour(inst))}/hr</span>
          </div>
        </div>

        <div class="modal-actions">
          <button class="btn btn-gold modal-save-btn">Confirm Rate Calibration</button>
        </div>
      </div>
    `;

    document.body.appendChild(modalOverlay);

    const depSlider = modalOverlay.querySelector("#deposit-slider");
    const credSlider = modalOverlay.querySelector("#credit-slider");
    const depVal = modalOverlay.querySelector("#deposit-val");
    const credVal = modalOverlay.querySelector("#credit-val");
    const spreadVal = modalOverlay.querySelector("#spread-val");
    const profitVal = modalOverlay.querySelector("#profit-val");

    const updatePreview = () => {
      inst.bankData.depositInterest = parseFloat(depSlider.value);
      inst.bankData.creditInterest = parseFloat(credSlider.value);
      depVal.textContent = `${inst.bankData.depositInterest.toFixed(2)}%`;
      credVal.textContent = `${inst.bankData.creditInterest.toFixed(2)}%`;
      spreadVal.textContent = `${(inst.bankData.creditInterest - inst.bankData.depositInterest).toFixed(2)}%`;
      profitVal.textContent = `+${formatCredits(BusinessLogic.calculateInstanceIncomePerHour(inst))}/hr`;
    };

    depSlider.addEventListener("input", updatePreview);
    credSlider.addEventListener("input", updatePreview);

    const close = () => {
      modalOverlay.remove();
      if (onUpdate) onUpdate();
    };

    modalOverlay.querySelector(".modal-close-btn").addEventListener("click", close);
    modalOverlay.querySelector(".modal-save-btn").addEventListener("click", () => {
      AudioSystem.play("purchase");
      close();
    });
    modalOverlay.addEventListener("click", e => {
      if (e.target === modalOverlay) close();
    });
  }

  static openCarDealershipModal(state, onUpdate) {
    InteractiveEngine.initInteractiveState(state);

    const modalOverlay = document.createElement("div");
    modalOverlay.className = "be-modal-overlay";

    const render = () => {
      const inventory = state.carGarage.inventory || [];

      modalOverlay.innerHTML = `
        <div class="be-modal-box large-modal">
          <div class="be-modal-header">
            <div style="display: flex; align-items: center; gap: 10px;">
              <span style="font-size: 26px;">🏎️</span>
              <div>
                <h3>Premier Car Dealership — Salvage Auction & Garage</h3>
                <p class="modal-subtitle">Acquire insurance-writeoff exotics, repair in your garage, and sell for massive profit</p>
              </div>
            </div>
            <button class="modal-close-btn">&times;</button>
          </div>

          <div class="car-dealership-stats-bar">
            <span>Showroom Inventory: <strong>${inventory.length} Cars</strong></span>
            <span>Total Flipping Profit: <strong style="color: var(--color-positive);">+${formatCredits(state.carGarage.totalCarProfits)}</strong></span>
          </div>

          <div class="car-modal-sections">
            <!-- Available Auction Salvage -->
            <div class="car-section">
              <h4>Available Auction Lots</h4>
              <div class="auction-cars-grid">
                ${AUCTION_CARS.map(car => {
                  const canAfford = state.cash >= car.salvagePrice;
                  return `
                    <div class="auction-car-card">
                      ${car.image ? `
                        <div style="position: relative; overflow: hidden; border-radius: var(--radius-xs); height: 110px; margin-bottom: 8px;">
                          <img src="${car.image}" alt="${car.name}" style="width: 100%; height: 100%; object-fit: cover; display: block;" />
                          <div style="position: absolute; inset: 0; background: linear-gradient(180deg, transparent 50%, rgba(12, 17, 30, 0.9) 100%);"></div>
                          <span class="car-tier" style="position: absolute; top: 6px; left: 8px; background: rgba(0,0,0,0.75); padding: 2px 6px; border-radius: 4px; font-size: 10px; font-weight: bold; color: var(--color-gold);">${car.tier}</span>
                        </div>
                      ` : ''}
                      <div class="car-card-top" style="align-items: center;">
                        <h5 style="margin: 0; font-size: 14px; font-weight: bold;">${car.name}</h5>
                        <span class="car-salvage-price">${formatCredits(car.salvagePrice)}</span>
                      </div>
                      <div class="car-defects-list" style="margin-top: 6px;">
                        ${car.defects.map(d => `<span class="defect-tag">⚠️ ${d}</span>`).join("")}
                      </div>
                      <div class="car-pricing-breakdown">
                        <span>Est. Repair: ${formatCredits(car.repairCost)}</span>
                        <span>Showroom Resale: ${formatCredits(car.showroomResaleValue)}</span>
                        <strong style="color: var(--color-positive);">Net Profit: +${formatCredits(car.profit)}</strong>
                      </div>
                      <button class="btn btn-sm btn-gold btn-bid-car ${canAfford ? '' : 'btn-disabled'}" data-car-id="${car.id}" ${canAfford ? '' : 'disabled'} style="margin-top: 8px;">
                        Bid & Acquire (${formatCredits(car.salvagePrice)})
                      </button>
                    </div>
                  `;
                }).join("")}
              </div>
            </div>

            <!-- In Garage Inventory -->
            <div class="car-section">
              <h4>Your Garage Workshop (${inventory.length})</h4>
              ${inventory.length === 0 ? `
                <div class="empty-garage-hint">No vehicles in workshop. Win salvage lots from the auction above to start restoring.</div>
              ` : `
                <div class="auction-cars-grid">
                  ${inventory.map(car => {
                    const canAffordRepair = state.cash >= car.repairCost && !car.isRepaired;
                    return `
                      <div class="auction-car-card garage-card ${car.isRepaired ? 'repaired' : ''}">
                        ${car.image ? `
                          <div style="position: relative; overflow: hidden; border-radius: var(--radius-xs); height: 110px; margin-bottom: 8px;">
                            <img src="${car.image}" alt="${car.name}" style="width: 100%; height: 100%; object-fit: cover; display: block;" />
                            <div style="position: absolute; inset: 0; background: linear-gradient(180deg, transparent 50%, rgba(12, 17, 30, 0.9) 100%);"></div>
                            <span class="badge ${car.isRepaired ? 'badge-gold' : 'badge-locked'}" style="position: absolute; top: 6px; right: 8px;">
                              ${car.isRepaired ? '✓ RESTORED' : 'DAMAGED'}
                            </span>
                          </div>
                        ` : ''}
                        <div class="car-card-top">
                          <span class="car-tier">${car.tier}</span>
                        </div>
                        <h5>${car.name}</h5>
                        <div class="car-actions-row" style="margin-top: 8px;">
                          ${!car.isRepaired ? `
                            <button class="btn btn-sm btn-primary btn-repair-car ${canAffordRepair ? '' : 'btn-disabled'}" data-inst-id="${car.instanceId}" ${canAffordRepair ? '' : 'disabled'}>
                              🔧 Repair Vehicle (${formatCredits(car.repairCost)})
                            </button>
                          ` : `
                            <button class="btn btn-sm btn-gold btn-sell-car" data-inst-id="${car.instanceId}">
                              💰 Sell in Showroom (+${formatCredits(car.showroomResaleValue)})
                            </button>
                          `}
                        </div>
                      </div>
                    `;
                  }).join("")}
                </div>
              `}
            </div>
          </div>
        </div>
      `;

      modalOverlay.querySelector(".modal-close-btn").addEventListener("click", () => {
        modalOverlay.remove();
        if (onUpdate) onUpdate();
      });

      modalOverlay.querySelectorAll(".btn-bid-car").forEach(btn => {
        btn.addEventListener("click", () => {
          const carId = btn.dataset.carId;
          if (InteractiveEngine.buyAuctionCar(state, carId)) {
            AudioSystem.play("purchase");
            render();
          }
        });
      });

      modalOverlay.querySelectorAll(".btn-repair-car").forEach(btn => {
        btn.addEventListener("click", () => {
          const instId = btn.dataset.instId;
          if (InteractiveEngine.repairCar(state, instId)) {
            AudioSystem.play("upgrade");
            render();
          }
        });
      });

      modalOverlay.querySelectorAll(".btn-sell-car").forEach(btn => {
        btn.addEventListener("click", () => {
          const instId = btn.dataset.instId;
          if (InteractiveEngine.sellCar(state, instId)) {
            AudioSystem.play("achievement");
            render();
          }
        });
      });
    };

    render();
    document.body.appendChild(modalOverlay);
    modalOverlay.addEventListener("click", e => {
      if (e.target === modalOverlay) {
        modalOverlay.remove();
        if (onUpdate) onUpdate();
      }
    });
  }

  static openITStudioModal(state, onUpdate) {
    InteractiveEngine.initInteractiveState(state);

    const modalOverlay = document.createElement("div");
    modalOverlay.className = "be-modal-overlay";

    const render = () => {
      const studio = state.itStudio;
      const activeProj = IT_PROJECTS.find(p => p.id === studio.activeProjectId) || IT_PROJECTS[0];
      const progressPct = Math.min(100, Math.floor((studio.projectProgress / activeProj.requiredPoints) * 100));

      modalOverlay.innerHTML = `
        <div class="be-modal-box large-modal">
          <div class="be-modal-header">
            <div style="display: flex; align-items: center; gap: 10px;">
              <span style="font-size: 26px;">💻</span>
              <div>
                <h3>Apex Software Studio — Software Development Lab</h3>
                <p class="modal-subtitle">Hire specialized engineers and release flagship commercial software</p>
              </div>
            </div>
            <button class="modal-close-btn">&times;</button>
          </div>

          <div class="it-active-project-card">
            <div style="display: flex; justify-content: space-between; align-items: center;">
              <div>
                <span class="badge badge-gold">ACTIVE DEVELOPMENT</span>
                <h4>${activeProj.name}</h4>
                <p style="font-size: var(--font-size-xs); color: var(--color-text-muted);">${activeProj.description}</p>
              </div>
              <div style="text-align: right;">
                <span style="font-size: var(--font-size-xs); color: var(--color-text-dim);">Completion Payout</span>
                <div style="font-size: var(--font-size-xl); font-weight: bold; color: var(--color-positive);">+${formatCredits(activeProj.completionPayout)}</div>
              </div>
            </div>

            <div class="vault-progress-bg" style="margin-top: 14px; height: 10px;">
              <div class="vault-progress-fill" style="width: ${progressPct}%; background: var(--gradient-gold);"></div>
            </div>
            <div style="display: flex; justify-content: space-between; font-size: 11px; color: var(--color-text-dim); margin-top: 4px;">
              <span>Progress: ${Math.floor(studio.projectProgress)} / ${activeProj.requiredPoints} Dev Points</span>
              <span>${progressPct}% Completed</span>
            </div>
          </div>

          <h4 style="margin: 20px 0 10px;">Staff Roster & Hiring</h4>
          <div class="it-staff-grid">
            ${IT_STAFF_ROLES.map(role => {
              const count = studio.staff[role.id] || 0;
              const fee = role.salaryPerHour * 50;
              const canAfford = state.cash >= fee;

              return `
                <div class="it-role-card">
                  <div style="display: flex; justify-content: space-between;">
                    <strong>${role.name}</strong>
                    <span class="badge" style="background: rgba(56, 189, 248, 0.15); color: #38BDF8;">${count} Hired</span>
                  </div>
                  <div style="font-size: var(--font-size-xs); color: var(--color-text-muted); margin: 6px 0;">
                    Salary: $${role.salaryPerHour}/hr • Output: +${role.outputContribution} pts/hr
                  </div>
                  <button class="btn btn-sm btn-secondary btn-hire-staff ${canAfford ? '' : 'btn-disabled'}" data-role-id="${role.id}" ${canAfford ? '' : 'disabled'}>
                    Hire (+1) for ${formatCredits(fee)}
                  </button>
                </div>
              `;
            }).join("")}
          </div>

          <h4 style="margin: 20px 0 10px;">Select Project Pipeline</h4>
          <div class="it-projects-grid">
            ${IT_PROJECTS.map(proj => {
              const isActive = proj.id === studio.activeProjectId;
              return `
                <div class="it-proj-select-card ${isActive ? 'selected' : ''}" data-proj-id="${proj.id}">
                  <div style="display:flex; justify-content:space-between;">
                    <strong>${proj.name}</strong>
                    <span style="color: var(--color-positive); font-weight: bold;">+${formatCredits(proj.completionPayout)}</span>
                  </div>
                  <div style="font-size: 11px; color: var(--color-text-dim); margin-top: 4px;">Points Required: ${proj.requiredPoints}</div>
                </div>
              `;
            }).join("")}
          </div>
        </div>
      `;

      modalOverlay.querySelector(".modal-close-btn").addEventListener("click", () => {
        modalOverlay.remove();
        if (onUpdate) onUpdate();
      });

      modalOverlay.querySelectorAll(".btn-hire-staff").forEach(btn => {
        btn.addEventListener("click", () => {
          const roleId = btn.dataset.roleId;
          if (InteractiveEngine.hireITStaff(state, roleId)) {
            AudioSystem.play("purchase");
            render();
          }
        });
      });

      modalOverlay.querySelectorAll(".it-proj-select-card").forEach(card => {
        card.addEventListener("click", () => {
          studio.activeProjectId = card.dataset.projId;
          studio.projectProgress = 0;
          AudioSystem.play("click");
          render();
        });
      });
    };

    render();
    document.body.appendChild(modalOverlay);
    modalOverlay.addEventListener("click", e => {
      if (e.target === modalOverlay) {
        modalOverlay.remove();
        if (onUpdate) onUpdate();
      }
    });
  }

  static openFortuneWheelModal(state, onUpdate) {
    InteractiveEngine.initInteractiveState(state);

    const modalOverlay = document.createElement("div");
    modalOverlay.className = "be-modal-overlay";

    const hasFree = (state.freeWheelSpins || 0) > 0;

    modalOverlay.innerHTML = `
      <div class="be-modal-box wheel-modal-box">
        <div class="be-modal-header">
          <div style="display: flex; align-items: center; gap: 10px;">
            <span style="font-size: 26px;">🎡</span>
            <div>
              <h3>Lucky Tycoon Fortune Wheel</h3>
              <p class="modal-subtitle">Spin for instant cash windfalls, free blue-chip stocks, and rare hypercars!</p>
            </div>
          </div>
          <button class="modal-close-btn">&times;</button>
        </div>

        <div class="wheel-stage">
          <div class="wheel-pointer">▼</div>
          <div class="wheel-disc" id="wheel-disc">
            ${FORTUNE_WHEEL_SLICES.map((s, idx) => {
              const rotation = idx * 45;
              return `
                <div class="wheel-slice" style="transform: rotate(${rotation}deg); background: ${s.color};">
                  <span class="wheel-slice-text">${s.label}</span>
                </div>
              `;
            }).join("")}
          </div>
        </div>

        <div class="wheel-status-msg" id="wheel-status-msg">
          ${hasFree ? "★ You have 1 FREE daily spin available!" : "Cost per Spin: $10,000"}
        </div>

        <div class="modal-actions" style="margin-top: 20px;">
          <button id="btn-spin-wheel" class="btn btn-gold btn-lg" style="width: 100%;">
            🎲 SPIN THE WHEEL (${hasFree ? 'FREE' : '$10,000'})
          </button>
        </div>
      </div>
    `;

    document.body.appendChild(modalOverlay);

    const spinBtn = modalOverlay.querySelector("#btn-spin-wheel");
    const wheelDisc = modalOverlay.querySelector("#wheel-disc");
    const statusMsg = modalOverlay.querySelector("#wheel-status-msg");
    let isSpinning = false;

    spinBtn.addEventListener("click", () => {
      if (isSpinning) return;
      const res = InteractiveEngine.spinWheel(state);
      if (!res) {
        statusMsg.textContent = "Insufficient funds for additional spins ($10,000 required).";
        return;
      }

      isSpinning = true;
      spinBtn.disabled = true;

      // Calculate winning angle (8 slices, 45 deg each)
      const sliceIdx = FORTUNE_WHEEL_SLICES.findIndex(s => s.id === res.id);
      const targetDeg = (360 * 5) + (360 - (sliceIdx * 45) - 22.5);

      wheelDisc.style.transition = "transform 4s cubic-bezier(0.15, 0.95, 0.35, 1)";
      wheelDisc.style.transform = `rotate(${targetDeg}deg)`;
      AudioSystem.play("upgrade");

      setTimeout(() => {
        isSpinning = false;
        spinBtn.disabled = false;
        AudioSystem.play("achievement");
        statusMsg.innerHTML = `<span style="color: var(--color-positive); font-weight: bold; font-size: 16px;">🎉 CONGRATULATIONS! You won: ${res.label}!</span>`;
        if (onUpdate) onUpdate();
      }, 4100);
    });

    const close = () => {
      modalOverlay.remove();
      if (onUpdate) onUpdate();
    };

    modalOverlay.querySelector(".modal-close-btn").addEventListener("click", close);
    modalOverlay.addEventListener("click", e => {
      if (e.target === modalOverlay && !isSpinning) close();
    });
  }
}
