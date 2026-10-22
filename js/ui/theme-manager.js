/* ==========================================================================
   Business Empire: Theme & Color Palette Manager
   Provides live theme switching between:
     1. obsidian (Obsidian & 24K Gold)
     2. emerald (Emerald Dynasty / Macau VIP)
     3. sapphire (Midnight Sapphire / Wall Street)
     4. cyber (Cyber Carbon / Tokyo Syndicate)
   ========================================================================== */

export const THEMES = [
  {
    id: "obsidian",
    name: "Obsidian & 24K Gold",
    shortName: "Obsidian Gold",
    description: "Classic high-stakes executive luxury. Deep carbon slate with brushed champagne bullion gold.",
    previewColors: ["#090C12", "#D4AF37", "#10B981", "#151D2E"]
  },
  {
    id: "emerald",
    name: "Emerald Dynasty",
    shortName: "Emerald Jade",
    description: "Macau high-roller & private banking. Rich imperial jade, emerald marble, and lustrous gold leaf.",
    previewColors: ["#05100B", "#10B981", "#34D399", "#0F2A1E"]
  },
  {
    id: "sapphire",
    name: "Midnight Sapphire",
    shortName: "Sapphire Blue",
    description: "Wall Street & London financial district. Deep midnight navy with royal sapphire and platinum.",
    previewColors: ["#060B16", "#38BDF8", "#3B82F6", "#101D38"]
  },
  {
    id: "cyber",
    name: "Cyber Carbon",
    shortName: "Cyber Amber",
    description: "Tokyo syndicate & Silicon titan. True OLED carbon with razor amber gold and electric neon accents.",
    previewColors: ["#050608", "#F59E0B", "#10B981", "#151724"]
  }
];

export class ThemeManager {
  static STORAGE_KEY = "empire_theme";

  static init() {
    const savedTheme = localStorage.getItem(this.STORAGE_KEY) || "obsidian";
    this.applyTheme(savedTheme, false);
    this.setupDropdown();
  }

  static getCurrentTheme() {
    return localStorage.getItem(this.STORAGE_KEY) || "obsidian";
  }

  static applyTheme(themeId, playSound = true) {
    const validTheme = THEMES.find(t => t.id === themeId) ? themeId : "obsidian";
    
    if (validTheme === "obsidian") {
      document.documentElement.removeAttribute("data-theme");
    } else {
      document.documentElement.setAttribute("data-theme", validTheme);
    }
    
    localStorage.setItem(this.STORAGE_KEY, validTheme);

    // Update topbar button text if exists
    const labelEl = document.querySelector(".theme-btn-label");
    const matched = THEMES.find(t => t.id === validTheme);
    if (labelEl && matched) {
      labelEl.textContent = matched.shortName;
    }

    // Active state in dropdown
    document.querySelectorAll(".theme-option-item").forEach(el => {
      if (el.dataset.themeId === validTheme) {
        el.classList.add("active");
      } else {
        el.classList.remove("active");
      }
    });

    if (playSound && window.AudioSystem) {
      window.AudioSystem.playClick();
    }
  }

  static setupDropdown() {
    const btn = document.getElementById("theme-toggle-btn");
    const dropdown = document.getElementById("theme-dropdown-menu");
    if (!btn || !dropdown) return;

    btn.addEventListener("click", (e) => {
      e.stopPropagation();
      const isOpen = dropdown.classList.contains("show");
      if (isOpen) {
        dropdown.classList.remove("show");
      } else {
        dropdown.classList.add("show");
      }
    });

    dropdown.addEventListener("click", (e) => {
      const option = e.target.closest(".theme-option-item");
      if (!option) return;
      const themeId = option.dataset.themeId;
      if (themeId) {
        this.applyTheme(themeId);
        dropdown.classList.remove("show");
      }
    });

    document.addEventListener("click", (e) => {
      if (!dropdown.contains(e.target) && !btn.contains(e.target)) {
        dropdown.classList.remove("show");
      }
    });
  }
}
