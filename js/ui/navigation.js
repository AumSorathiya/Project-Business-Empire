/* ==========================================================================
   Empire Architect: Navigation & Header Controller
   View switching and sticky topbar financial metrics updater
   ========================================================================== */

import { Selectors } from "../app/selectors.js";
import { formatCredits, formatRate } from "../utils/formatting.js";
import { EMPIRE_LEVELS } from "../progression/levels.js";

export class NavigationController {
  constructor({ onNavigate }) {
    this.currentView = "dashboard";
    this.onNavigate = onNavigate;

    this.sidebarEl = document.querySelector(".app-sidebar");
    this.backdropEl = document.querySelector(".sidebar-backdrop");
    this.menuToggleBtn = document.querySelector(".mobile-menu-toggle");

    // Topbar metric elements
    this.cashValEl = document.querySelector("#topbar-cash");
    this.netWorthValEl = document.querySelector("#topbar-net-worth");
    this.incomeValEl = document.querySelector("#topbar-income");
    this.slotsValEl = document.querySelector("#topbar-slots");
    this.levelValEl = document.querySelector("#topbar-level");
    this.saveStatusEl = document.querySelector("#save-status");
    this.achievementsBadgeEl = document.querySelector("#nav-achievements-badge");

    this.navLinks = document.querySelectorAll(".nav-item[data-view]");
    this.viewSections = document.querySelectorAll(".view-section");

    this.bindEvents();
  }

  bindEvents() {
    this.navLinks.forEach(link => {
      link.addEventListener("click", (e) => {
        e.preventDefault();
        const view = link.getAttribute("data-view");
        this.switchView(view);
        this.closeMobileSidebar();
      });
    });

    if (this.menuToggleBtn) {
      this.menuToggleBtn.addEventListener("click", () => {
        this.toggleMobileSidebar();
      });
    }

    if (this.backdropEl) {
      this.backdropEl.addEventListener("click", () => {
        this.closeMobileSidebar();
      });
    }
  }

  switchView(viewName) {
    this.currentView = viewName;

    // Update active nav links
    this.navLinks.forEach(link => {
      const target = link.getAttribute("data-view");
      link.classList.toggle("active", target === viewName);
    });

    // Update active view sections
    this.viewSections.forEach(sec => {
      const secView = sec.getAttribute("data-view");
      sec.classList.toggle("active", secView === viewName);
    });

    if (this.onNavigate) {
      this.onNavigate(viewName);
    }
  }

  toggleMobileSidebar() {
    if (this.sidebarEl) {
      this.sidebarEl.classList.toggle("open");
    }
    if (this.backdropEl) {
      this.backdropEl.classList.toggle("active");
    }
  }

  closeMobileSidebar() {
    if (this.sidebarEl) {
      this.sidebarEl.classList.remove("open");
    }
    if (this.backdropEl) {
      this.backdropEl.classList.remove("active");
    }
  }

  updateTopbar(state) {
    if (!state) return;

    const netWorth = Selectors.getNetWorth(state);
    const hourlyIncome = Selectors.getPortfolioHourlyIncome(state);
    const compact = state.settings?.compactNumbers ?? true;
    const tier = EMPIRE_LEVELS.find(l => l.level === state.empireLevel) || EMPIRE_LEVELS[0];
    const slotsUsed = (state.ownedBusinesses || []).length;

    if (this.cashValEl) {
      this.cashValEl.textContent = formatCredits(state.cash, compact);
    }
    if (this.netWorthValEl) {
      this.netWorthValEl.textContent = formatCredits(netWorth, compact);
    }
    if (this.incomeValEl) {
      this.incomeValEl.textContent = `+${formatCredits(hourlyIncome, compact)}/hr`;
    }
    if (this.slotsValEl) {
      this.slotsValEl.textContent = `${slotsUsed} / 21`;
      this.slotsValEl.style.color = slotsUsed >= 21 ? "var(--color-negative)" : "var(--color-gold)";
    }
    if (this.levelValEl) {
      this.levelValEl.textContent = `Lvl ${state.empireLevel} (${tier.title})`;
    }
    if (this.achievementsBadgeEl) {
      const completed = (state.completedAchievementIds || []).length;
      this.achievementsBadgeEl.textContent = completed > 0 ? `${completed}` : "";
    }
  }

  setSaveStatus(status) {
    if (!this.saveStatusEl) return;
    const textEl = this.saveStatusEl.querySelector(".status-text");

    if (status === "saving") {
      this.saveStatusEl.className = "save-status-badge saving";
      if (textEl) textEl.textContent = "Auto-Saving...";
    } else if (status === "saved") {
      this.saveStatusEl.className = "save-status-badge autosaved";
      if (textEl) textEl.textContent = "Auto-Saved";
    } else if (status === "error") {
      this.saveStatusEl.className = "save-status-badge error";
      if (textEl) textEl.textContent = "Storage Error";
    }
  }
}
