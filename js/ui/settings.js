/* ==========================================================================
   Empire Architect: Settings Panel Component
   Save management, preferences, and reset controls
   ========================================================================== */

import { ThemeManager, THEMES } from "./theme-manager.js";

export class SettingsPanelView {
  constructor(containerEl, { onSaveNow, onResetGame, onToggleSetting }) {
    this.container = containerEl;
    this.onSaveNow = onSaveNow;
    this.onResetGame = onResetGame;
    this.onToggleSetting = onToggleSetting;
  }

  render(state) {
    if (!this.container) return;

    const compactNumbers = state.settings?.compactNumbers ?? true;
    const lastSavedTime = state.lastSavedAt ? new Date(state.lastSavedAt).toLocaleTimeString() : "Never";

    this.container.innerHTML = `
      <div style="max-width: 680px; display: flex; flex-direction: column; gap: var(--space-20);">
        <!-- Preferences Card -->
        <div class="card">
          <h3 style="font-size: var(--font-size-md); color: var(--color-gold); margin-bottom: var(--space-16); text-transform: uppercase; letter-spacing: 0.05em;">Visual Color Palette & Theme</h3>
          <p style="font-size: var(--font-size-xs); color: var(--color-text-muted); margin-bottom: 14px;">Select your preferred executive game palette:</p>

          <div style="display: grid; grid-template-columns: repeat(auto-fit, minmax(240px, 1fr)); gap: 10px; margin-bottom: 20px;">
            ${THEMES.map(t => {
              const isActive = (ThemeManager.getCurrentTheme() === t.id);
              return `
                <div class="settings-theme-card ${isActive ? 'active' : ''}" data-theme-id="${t.id}" style="padding: 12px; border-radius: var(--radius-sm); border: 1px solid ${isActive ? 'var(--color-gold)' : 'var(--color-border)'}; background: ${isActive ? 'var(--color-gold-subtle)' : 'var(--color-surface-raised)'}; cursor: pointer; display: flex; flex-direction: column; gap: 8px; transition: all 0.2s ease;">
                  <div style="display: flex; justify-content: space-between; align-items: center;">
                    <strong style="color: var(--color-text); font-size: 13px;">${t.name}</strong>
                    <div class="theme-swatch">
                      ${t.previewColors.map(c => `<div class="theme-swatch-dot" style="background: ${c};"></div>`).join("")}
                    </div>
                  </div>
                  <div style="font-size: 11px; color: var(--color-text-muted);">${t.description}</div>
                  <div style="font-size: 10px; font-weight: bold; color: ${isActive ? 'var(--color-gold)' : 'var(--color-text-dim)'};">
                    ${isActive ? '✓ CURRENT THEME' : 'CLICK TO APPLY'}
                  </div>
                </div>
              `;
            }).join("")}
          </div>

          <div class="toggle-control" style="border-top: 1px solid var(--color-border); padding-top: 14px;">
            <div>
              <div style="font-weight: 600; color: var(--color-text);">Compact Notation (K, M, B)</div>
              <div style="font-size: var(--font-size-xs); color: var(--color-text-muted);">Shorten large currency numbers for streamlined viewing</div>
            </div>
            <label class="toggle-switch">
              <input type="checkbox" id="toggle-compact" ${compactNumbers ? "checked" : ""}>
              <span class="toggle-slider"></span>
            </label>
          </div>
        </div>

        <!-- Persistence & Data Management -->
        <div class="card">
          <div style="display: flex; align-items: center; justify-content: space-between; margin-bottom: var(--space-12);">
            <h3 style="font-size: var(--font-size-md); color: var(--color-gold); text-transform: uppercase; letter-spacing: 0.05em;">Continuous Auto-Save</h3>
            <span class="save-status-badge autosaved">
              <span class="indicator-dot"></span>
              <span class="status-text">Active (Every 3s)</span>
            </span>
          </div>
          <p style="font-size: var(--font-size-sm); color: var(--color-text-muted); margin-bottom: var(--space-16); line-height: 1.5;">
            Your empire progress automatically saves continuously every 3 seconds, after every acquisition or upgrade, and whenever your browser tab changes or closes. A redundant backup is also preserved in local storage.
          </p>

          <div style="display: flex; align-items: center; justify-content: space-between; padding: 12px; border-radius: var(--radius-sm); background: var(--color-surface-raised); margin-bottom: var(--space-16); border: 1px solid var(--color-border-subtle);">
            <div>
              <div style="font-size: var(--font-size-xs); color: var(--color-text-dim); text-transform: uppercase;">Last Auto-Saved</div>
              <div style="font-family: var(--font-family-mono); font-size: var(--font-size-sm); color: var(--color-text); font-weight: bold;">${lastSavedTime}</div>
            </div>
            <button id="btn-manual-save" class="btn btn-secondary btn-sm">Force Save Now</button>
          </div>
        </div>

        <!-- Danger Zone -->
        <div class="card" style="border-color: var(--color-negative-border);">
          <h3 style="font-size: var(--font-size-md); color: var(--color-negative); margin-bottom: var(--space-12); text-transform: uppercase; letter-spacing: 0.05em;">Danger Zone</h3>
          <p style="font-size: var(--font-size-sm); color: var(--color-text-muted); margin-bottom: var(--space-16); line-height: 1.5;">
            Resetting clears all local data, owned enterprises, technological upgrades, and achievements, returning your empire to day one.
          </p>
          <button id="btn-reset-game" class="btn btn-danger btn-sm">Reset All Progress</button>
        </div>
      </div>
    `;

    // Event listeners
    const compactToggle = this.container.querySelector("#toggle-compact");
    if (compactToggle) {
      compactToggle.addEventListener("change", (e) => {
        if (this.onToggleSetting) this.onToggleSetting("compactNumbers", e.target.checked);
      });
    }

    const manualSaveBtn = this.container.querySelector("#btn-manual-save");
    if (manualSaveBtn) {
      manualSaveBtn.addEventListener("click", () => {
        if (this.onSaveNow) this.onSaveNow();
      });
    }

    // Theme selection listeners
    this.container.querySelectorAll(".settings-theme-card").forEach(card => {
      card.addEventListener("click", () => {
        const themeId = card.dataset.themeId;
        if (themeId) {
          ThemeManager.applyTheme(themeId);
          this.render(state);
        }
      });
    });

    const resetBtn = this.container.querySelector("#btn-reset-game");
    if (resetBtn) {
      resetBtn.addEventListener("click", () => {
        if (this.onResetGame) this.onResetGame();
      });
    }
  }
}
