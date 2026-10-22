/* ==========================================================================
   Empire Architect: Formatting Utilities
   ========================================================================== */

/**
 * Format numbers with compact suffixes (K, M, B, T, etc.) or standard comma separation
 * @param {number} value
 * @param {boolean} compact
 * @returns {string}
 */
export function formatCredits(value, compact = true) {
  if (value === undefined || value === null || !Number.isFinite(value)) {
    return "0";
  }

  const absVal = Math.abs(value);
  const sign = value < 0 ? "-" : "";

  if (compact && absVal >= 10000) {
    const units = [
      { threshold: 1e15, symbol: "Q" },
      { threshold: 1e12, symbol: "T" },
      { threshold: 1e9, symbol: "B" },
      { threshold: 1e6, symbol: "M" },
      { threshold: 1e3, symbol: "K" }
    ];

    for (const unit of units) {
      if (absVal >= unit.threshold) {
        const scaled = absVal / unit.threshold;
        const decimals = scaled >= 100 ? 1 : 2;
        return `${sign}${scaled.toFixed(decimals)}${unit.symbol}`;
      }
    }
  }

  return new Intl.NumberFormat("en-US", {
    minimumFractionDigits: Number.isInteger(value) ? 0 : 1,
    maximumFractionDigits: 1
  }).format(value);
}

/**
 * Format income rate (e.g. +12.5/s)
 * @param {number} rate
 * @param {boolean} compact
 * @returns {string}
 */
export function formatRate(rate, compact = true) {
  const formatted = formatCredits(rate, compact);
  return `${rate >= 0 ? "+" : ""}${formatted}/s`;
}

/**
 * Format percentages (e.g. +10%)
 * @param {number} val (e.g. 0.1 for 10%)
 * @returns {string}
 */
export function formatPercent(val) {
  const percent = Math.round(val * 100);
  return `${percent >= 0 ? "+" : ""}${percent}%`;
}

/**
 * Format standard integers
 * @param {number} val
 * @returns {string}
 */
export function formatInt(val) {
  if (!Number.isFinite(val)) return "0";
  return new Intl.NumberFormat("en-US").format(Math.floor(val));
}

/**
 * Format duration in seconds
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
 * Format payback in seconds
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
