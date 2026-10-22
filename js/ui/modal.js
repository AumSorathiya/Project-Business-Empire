/* ==========================================================================
   Empire Architect: Modal Dialog Manager
   Accessible modals for Offline Earnings, Reset Confirmation, and Guides
   ========================================================================== */

import { ICONS } from "./icons.js";
import { formatCredits } from "../utils/formatting.js";
import { formatDuration } from "../utils/time.js";

export class ModalManager {
  constructor() {
    this.overlay = null;
    this.init();
  }

  init() {
    let overlay = document.getElementById("app-modal-overlay");
    if (!overlay) {
      overlay = document.createElement("div");
      overlay.id = "app-modal-overlay";
      overlay.className = "modal-overlay";
      overlay.innerHTML = `
        <div class="modal-container" role="dialog" aria-modal="true" aria-labelledby="modal-title">
          <div class="modal-header">
            <h2 id="modal-title" class="modal-title"></h2>
            <button id="modal-close" class="modal-close-btn" aria-label="Close modal">
              <div style="width: 20px; height: 20px;">${ICONS.close}</div>
            </button>
          </div>
          <div id="modal-body" class="modal-body"></div>
          <div id="modal-footer" class="modal-footer"></div>
        </div>
      `;
      document.body.appendChild(overlay);
    }

    this.overlay = overlay;
    this.titleEl = overlay.querySelector("#modal-title");
    this.bodyEl = overlay.querySelector("#modal-body");
    this.footerEl = overlay.querySelector("#modal-footer");
    this.closeBtn = overlay.querySelector("#modal-close");

    this.closeBtn.addEventListener("click", () => this.hide());
    this.overlay.addEventListener("click", (e) => {
      if (e.target === this.overlay) this.hide();
    });

    document.addEventListener("keydown", (e) => {
      if (e.key === "Escape" && this.overlay.classList.contains("active")) {
        this.hide();
      }
    });
  }

  show({ title, bodyHtml, footerButtons = [] }) {
    this.titleEl.textContent = title;
    this.bodyEl.innerHTML = bodyHtml;
    this.footerEl.innerHTML = "";

    for (const btnConfig of footerButtons) {
      const btn = document.createElement("button");
      btn.className = `btn ${btnConfig.className || "btn-secondary"}`;
      btn.textContent = btnConfig.text;
      btn.addEventListener("click", () => {
        if (btnConfig.onClick) btnConfig.onClick();
        if (btnConfig.closeOnClick !== false) this.hide();
      });
      this.footerEl.appendChild(btn);
    }

    this.overlay.classList.add("active");
  }

  hide() {
    this.overlay.classList.remove("active");
  }

  showOfflineEarningsModal(offlineResult) {
    const elapsedFormatted = formatDuration(offlineResult.elapsedSeconds);
    const eligibleFormatted = formatDuration(offlineResult.eligibleSeconds);
    const creditsFormatted = formatCredits(offlineResult.creditsEarned, true);

    const capNotice = offlineResult.wasCapped
      ? `<div style="margin-top: 12px; padding: 10px; border-radius: var(--radius-sm); background: var(--color-gold-subtle); border: 1px solid var(--color-gold-border); font-size: var(--font-size-xs); color: var(--color-gold);">
           <strong>Notice:</strong> Your offline earnings reached the 8-hour cap (28,800s). Upgrade your portfolio to generate even more during future sessions!
         </div>`
      : "";

    const bodyHtml = `
      <div style="text-align: center; margin-bottom: 16px;">
        <div style="width: 52px; height: 52px; margin: 0 auto 12px; color: var(--color-gold);">${ICONS.brand}</div>
        <h3 style="font-size: var(--font-size-lg); color: var(--color-text); margin-bottom: 4px;">Welcome Back, Architect</h3>
        <p style="color: var(--color-text-muted); font-size: var(--font-size-sm);">Your enterprises continued generating revenue while you were away.</p>
      </div>

      <div style="background: var(--color-surface-raised); border: 1px solid var(--color-border); border-radius: var(--radius-sm); padding: 16px; display: grid; grid-template-columns: 1fr 1fr; gap: 12px;">
        <div>
          <div style="font-size: var(--font-size-xs); color: var(--color-text-dim); text-transform: uppercase;">Time Away</div>
          <div style="font-family: var(--font-family-mono); font-size: var(--font-size-md); font-weight: bold; color: var(--color-text);">${elapsedFormatted}</div>
        </div>
        <div>
          <div style="font-size: var(--font-size-xs); color: var(--color-text-dim); text-transform: uppercase;">Credited Duration</div>
          <div style="font-family: var(--font-family-mono); font-size: var(--font-size-md); font-weight: bold; color: var(--color-text);">${eligibleFormatted}</div>
        </div>
        <div style="grid-column: span 2; border-top: 1px solid var(--color-border-subtle); pt: 12px; margin-top: 4px;">
          <div style="font-size: var(--font-size-xs); color: var(--color-text-dim); text-transform: uppercase;">Total Offline Revenue Collected</div>
          <div style="font-family: var(--font-family-mono); font-size: var(--font-size-2xl); font-weight: bold; color: var(--color-gold);">+${creditsFormatted} credits</div>
        </div>
      </div>
      ${capNotice}
    `;

    this.show({
      title: "Offline Revenue Report",
      bodyHtml,
      footerButtons: [
        { text: "Collect & Proceed", className: "btn-primary", closeOnClick: true }
      ]
    });
  }

  showResetConfirmation(onConfirm) {
    const bodyHtml = `
      <div style="display: flex; gap: 16px; align-items: flex-start;">
        <div style="width: 40px; height: 40px; color: var(--color-negative); flex-shrink: 0;">${ICONS.close}</div>
        <div>
          <p style="margin-bottom: 12px; font-weight: var(--font-weight-semibold); color: var(--color-text);">
            Are you sure you want to completely reset your empire?
          </p>
          <p style="color: var(--color-text-muted); font-size: var(--font-size-sm); margin-bottom: 8px;">
            This will permanently erase all businesses, upgrades, achievements, and earnings. This action cannot be undone.
          </p>
        </div>
      </div>
    `;

    this.show({
      title: "Confirm Empire Reset",
      bodyHtml,
      footerButtons: [
        { text: "Cancel", className: "btn-secondary" },
        {
          text: "Yes, Reset Everything",
          className: "btn-danger",
          onClick: onConfirm
        }
      ]
    });
  }
}
