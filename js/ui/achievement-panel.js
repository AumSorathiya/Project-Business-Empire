/* ==========================================================================
   Empire Architect: Achievement Panel Component
   Displays grouped achievements, progress, and rewards
   ========================================================================== */

import { ACHIEVEMENTS, ACHIEVEMENT_GROUPS } from "../data/achievements.js";
import { formatCredits } from "../utils/formatting.js";
import { ICONS } from "./icons.js";

export class AchievementPanelView {
  constructor(containerEl) {
    this.container = containerEl;
  }

  render(state) {
    if (!this.container) return;
    this.container.innerHTML = "";

    const completedSet = new Set(state.completedAchievementIds || []);
    const totalCount = ACHIEVEMENTS.length;
    const completedCount = completedSet.size;

    // Header summary banner with illustration
    const summaryCard = document.createElement("div");
    summaryCard.className = "milestone-banner achievements-banner";
    summaryCard.style.marginBottom = "var(--space-24)";
    summaryCard.innerHTML = `
      <div class="milestone-info">
        <div class="milestone-tag">
          <span style="display: inline-block; width: 6px; height: 6px; border-radius: 50%; background: var(--color-gold);"></span>
          Executive Honors & Credentials
        </div>
        <div class="milestone-title">Syndicate Milestones & Accolades</div>
        <div class="milestone-desc">Achieve key enterprise objectives to claim executive capital bonuses and industrial renown.</div>
      </div>
      <div class="milestone-progress-wrap">
        <div class="milestone-progress-meta">
          <span>Completed</span>
          <span style="font-weight: bold; color: var(--color-gold); font-family: var(--font-family-mono); font-size: var(--font-size-base);">${completedCount} / ${totalCount}</span>
        </div>
        <div class="progress-container">
          <div class="progress-bar" style="width: ${Math.round((completedCount / totalCount) * 100)}%;"></div>
        </div>
      </div>
    `;
    this.container.appendChild(summaryCard);

    // Group achievements
    for (const groupName of Object.values(ACHIEVEMENT_GROUPS)) {
      const groupAchievements = ACHIEVEMENTS.filter(a => a.group === groupName);
      if (groupAchievements.length === 0) continue;

      const groupSection = document.createElement("div");
      groupSection.style.marginBottom = "var(--space-24)";

      const groupTitle = document.createElement("h4");
      groupTitle.style.fontSize = "var(--font-size-md)";
      groupTitle.style.fontWeight = "var(--font-weight-bold)";
      groupTitle.style.color = "var(--color-gold)";
      groupTitle.style.marginBottom = "var(--space-12)";
      groupTitle.textContent = groupName;
      groupSection.appendChild(groupTitle);

      const grid = document.createElement("div");
      grid.className = "business-grid";

      for (const ach of groupAchievements) {
        const isDone = completedSet.has(ach.id);
        const card = document.createElement("div");
        card.className = `card ${isDone ? "" : "locked"}`;
        card.style.display = "flex";
        card.style.flexDirection = "column";
        card.style.gap = "var(--space-8)";
        card.style.padding = "var(--space-16)";

        card.innerHTML = `
          <div style="display: flex; align-items: flex-start; justify-content: space-between; gap: 8px;">
            <div style="display: flex; align-items: center; gap: 8px;">
              <div style="width: 22px; height: 22px; color: ${isDone ? "var(--color-gold)" : "var(--color-text-dim)"}; flex-shrink: 0;">
                ${isDone ? ICONS.check : ICONS.achievements}
              </div>
              <span style="font-weight: bold; font-size: var(--font-size-sm); color: ${isDone ? "var(--color-text)" : "var(--color-text-muted)"};">
                ${ach.title}
              </span>
            </div>
            <span style="font-family: var(--font-family-mono); font-size: var(--font-size-xs); font-weight: bold; color: ${isDone ? "var(--color-positive)" : "var(--color-text-dim)"};">
              +${formatCredits(ach.rewardCredits)}
            </span>
          </div>
          <p style="font-size: var(--font-size-xs); color: var(--color-text-dim); line-height: 1.4;">
            ${ach.description}
          </p>
          <div style="margin-top: auto; padding-top: 6px; font-size: var(--font-size-xs); font-weight: 600; color: ${isDone ? "var(--color-positive)" : "var(--color-text-dim)"};">
            ${isDone ? "✓ Completed" : "In Progress"}
          </div>
        `;

        grid.appendChild(card);
      }

      groupSection.appendChild(grid);
      this.container.appendChild(groupSection);
    }
  }
}
