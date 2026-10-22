/* ==========================================================================
   Empire Architect: Central Balance Configuration
   Authoritative gameplay and economy constants
   ========================================================================== */

export const BALANCE = {
  version: 1,
  startingCash: 1000,
  offlineEarningsCapSeconds: 8 * 3600, // 8 hours (28,800s)
  offlineEarningsRate: 1.0,           // 100% of saved net income
  minOfflineThresholdSeconds: 10,     // minimum absence to show offline summary
  autosaveIntervalMs: 3000,           // 3 seconds frequent autosave
  fastTickIntervalMs: 100,            // 100ms simulation tick
  compactNumberThreshold: 10000,
  schemaVersion: 1,
  appId: "empire-architect"
};
