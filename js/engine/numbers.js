/* ==========================================================================
   Empire Architect: Numeric Safeguards
   ========================================================================== */

/**
 * Clean floating point inaccuracies to safe decimal boundaries
 * @param {number} num
 * @param {number} precision
 * @returns {number}
 */
export function roundTo(num, precision = 4) {
  if (!Number.isFinite(num)) return 0;
  const factor = 10 ** precision;
  return Math.round(num * factor) / factor;
}

/**
 * Clamp a number between min and max
 * @param {number} val
 * @param {number} min
 * @param {number} max
 * @returns {number}
 */
export function clamp(val, min, max) {
  if (!Number.isFinite(val)) return min;
  return Math.max(min, Math.min(max, val));
}
