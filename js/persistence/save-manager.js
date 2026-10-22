/* ==========================================================================
   Empire Architect: Save Manager
   Safe local storage persistence, backups, envelope validation, and reset
   ========================================================================== */

import { BALANCE } from "../data/balance.js";
import { createInitialState, migrateState } from "./migrations.js";

const SAVE_KEY = "empire-architect-save";
const BACKUP_KEY = "empire-architect-save-backup";

export const SaveManager = {
  /**
   * Save the current state to localStorage.
   * Maintains a backup of the previous valid save.
   * @param {object} state
   * @returns {object} { success: boolean, savedAt: number, error?: string }
   */
  save(state) {
    if (!state) {
      return { success: false, error: "Cannot save null or undefined state." };
    }

    try {
      const now = Date.now();
      state.lastSavedAt = now;

      // Wrap in versioned save envelope
      const envelope = {
        appId: BALANCE.appId,
        schemaVersion: BALANCE.schemaVersion,
        balanceVersion: BALANCE.version,
        savedAt: now,
        state: state
      };

      const serialized = JSON.stringify(envelope);

      // Back up previous valid save if it exists
      if (typeof window !== "undefined" && window.localStorage) {
        const existing = window.localStorage.getItem(SAVE_KEY);
        if (existing) {
          try {
            window.localStorage.setItem(BACKUP_KEY, existing);
          } catch (e) {
            // Non-fatal backup warning
            console.warn("Could not write backup save:", e);
          }
        }
        window.localStorage.setItem(SAVE_KEY, serialized);
      }

      return { success: true, savedAt: now };
    } catch (err) {
      console.error("SaveManager error:", err);
      return { success: false, error: err.message || "Failed to save state." };
    }
  },

  /**
   * Load and validate save data from localStorage.
   * Falls back to backup if primary save is corrupt, or initializes fresh state.
   * @returns {object} { state: object, source: "primary"|"backup"|"new", error?: string }
   */
  load() {
    if (typeof window === "undefined" || !window.localStorage) {
      return { state: createInitialState(), source: "new" };
    }

    // Try primary save
    const primaryRaw = window.localStorage.getItem(SAVE_KEY);
    if (primaryRaw) {
      try {
        const envelope = JSON.parse(primaryRaw);
        if (envelope && envelope.appId === BALANCE.appId && envelope.state) {
          const migrated = migrateState(envelope.state);
          return { state: migrated, source: "primary" };
        }
      } catch (err) {
        console.warn("Primary save corrupted, attempting backup recovery:", err);
      }
    }

    // Try backup save
    const backupRaw = window.localStorage.getItem(BACKUP_KEY);
    if (backupRaw) {
      try {
        const envelope = JSON.parse(backupRaw);
        if (envelope && envelope.appId === BALANCE.appId && envelope.state) {
          const migrated = migrateState(envelope.state);
          return { state: migrated, source: "backup" };
        }
      } catch (err) {
        console.warn("Backup save corrupted as well:", err);
      }
    }

    // No valid save found, initialize fresh new state
    return { state: createInitialState(), source: "new" };
  },

  /**
   * Destructively reset game state (clears primary and backup storage)
   * @returns {object} Fresh initial state
   */
  reset() {
    if (typeof window !== "undefined" && window.localStorage) {
      window.localStorage.removeItem(SAVE_KEY);
      window.localStorage.removeItem(BACKUP_KEY);
    }
    return createInitialState();
  }
};
