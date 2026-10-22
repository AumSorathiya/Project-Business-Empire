/* ==========================================================================
   Empire Architect: Main Entry Point
   Initializes game controller on DOM ready
   ========================================================================== */

import { GameController } from "./app/controller.js";
import { ThemeManager } from "./ui/theme-manager.js";

document.addEventListener("DOMContentLoaded", () => {
  ThemeManager.init();

  const controller = new GameController();
  controller.init();

  // Expose controller globally for inspection/debugging/testing if needed
  window.__EMPIRE_ARCHITECT__ = controller;
  window.ThemeManager = ThemeManager;
});
