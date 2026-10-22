/* ==========================================================================
   Empire Architect: Notification / Toast Service
   Non-intrusive micro-feedback for gameplay events
   ========================================================================== */

import { ICONS } from "./icons.js";

export class NotificationService {
  constructor(containerEl) {
    this.container = containerEl;
  }

  show({ title, message, type = "success", duration = 4000 }) {
    if (!this.container) return;

    const toast = document.createElement("div");
    toast.className = `toast toast-${type}`;
    toast.setAttribute("role", "alert");

    let iconSvg = ICONS.check;
    if (type === "error") iconSvg = ICONS.close;
    if (type === "gold") iconSvg = ICONS.achievements;

    toast.innerHTML = `
      <div class="toast-icon" style="width: 20px; height: 20px; flex-shrink: 0;">${iconSvg}</div>
      <div class="toast-content">
        <div class="toast-title">${title}</div>
        ${message ? `<div class="toast-message">${message}</div>` : ""}
      </div>
    `;

    this.container.appendChild(toast);

    setTimeout(() => {
      toast.style.transition = "opacity 250ms ease, transform 250ms ease";
      toast.style.opacity = "0";
      toast.style.transform = "translateX(20px)";
      setTimeout(() => toast.remove(), 260);
    }, duration);
  }

  success(title, message) {
    this.show({ title, message, type: "success" });
  }

  error(title, message) {
    this.show({ title, message, type: "error" });
  }

  achievement(title, message) {
    this.show({ title, message, type: "gold", duration: 5500 });
  }
}
