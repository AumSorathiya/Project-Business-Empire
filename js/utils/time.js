/* ==========================================================================
   Empire Architect: Time Utilities
   ========================================================================== */

/**
 * Format seconds into human readable duration (e.g. "2h 15m 30s" or "45s")
 * @param {number} totalSeconds
 * @returns {string}
 */
export function formatDuration(totalSeconds) {
  if (!Number.isFinite(totalSeconds) || totalSeconds <= 0) {
    return "0s";
  }

  const s = Math.floor(totalSeconds % 60);
  const m = Math.floor((totalSeconds / 60) % 60);
  const h = Math.floor((totalSeconds / 3600) % 24);
  const d = Math.floor(totalSeconds / 86400);

  const parts = [];
  if (d > 0) parts.push(`${d}d`);
  if (h > 0) parts.push(`${h}h`);
  if (m > 0 && d === 0) parts.push(`${m}m`);
  if ((s > 0 && h === 0 && d === 0) || parts.length === 0) parts.push(`${s}s`);

  return parts.join(" ");
}

/**
 * Format Payback time (e.g. "4m 10s" or "Immediate" / "None")
 * @param {number} paybackSeconds
 * @returns {string}
 */
export function formatPayback(paybackSeconds) {
  if (!Number.isFinite(paybackSeconds) || paybackSeconds <= 0) {
    return "—";
  }
  if (paybackSeconds > 86400 * 365) {
    return "> 1 yr";
  }
  return formatDuration(paybackSeconds);
}
