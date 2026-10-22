/* ==========================================================================
   Empire Architect: Floating Numbers Micro-Interactions
   Spawns floating numeric particles at click coordinates
   ========================================================================== */

export function spawnFloatingText(text, x, y, color = "var(--color-gold)") {
  const el = document.createElement("div");
  el.className = "floating-text";
  el.textContent = text;
  el.style.left = `${x}px`;
  el.style.top = `${y}px`;
  el.style.color = color;

  document.body.appendChild(el);

  el.addEventListener("animationend", () => {
    el.remove();
  });
}
