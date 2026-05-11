// ============================================================
// OneSource — Controlled Vocabulary (Single Source of Truth)
// All signal options live here. Nothing else defines these.
// ============================================================

export const VALID_EMOTIONS = [
  "curiosity",
  "urgency",
  "fear",
  "aspiration",
  "status",
  "trust",
  "scarcity",
  "hope",
  "satisfaction",
] as const;

export const VALID_HOOK_TYPES = [
  "before-after",
  "problem-solution",
  "comparison",
  "authority",
  "social-proof",
  "demonstration",
  "urgency",
] as const;

export const VALID_VISUAL_STYLES = [
  "ugc",
  "cinematic",
  "clean",
  "minimal",
  "luxury",
] as const;

export const VALID_PLATFORMS = [
  "amazon",
  "tiktok",
  "meta",
  "pinterest",
  "landing-page",
  "youtube",
] as const;

// ── Derived Types ────────────────────────────────────────────

export type Emotion = (typeof VALID_EMOTIONS)[number];
export type HookType = (typeof VALID_HOOK_TYPES)[number];
export type VisualStyle = (typeof VALID_VISUAL_STYLES)[number];
export type Platform = (typeof VALID_PLATFORMS)[number];