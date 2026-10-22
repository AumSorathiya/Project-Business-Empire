/* ==========================================================================
   Empire Architect: Validation Utilities
   ========================================================================== */

export function isFinitePositiveNumber(val) {
  return typeof val === "number" && Number.isFinite(val) && val >= 0;
}

export function isValidId(id) {
  return typeof id === "string" && id.trim().length > 0;
}
