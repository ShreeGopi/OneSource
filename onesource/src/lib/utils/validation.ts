// ============================================================
// OneSource — Signal Quality Validation
// Validates a creative before it enters the intelligence layer.
// Clean signal > more intelligence.
// ============================================================

export type SignalQuality = "strong" | "moderate" | "weak";

export type ValidationResult = {
  isValid: boolean;
  errors: string[];
  warnings: string[];
  quality: SignalQuality;
  score: number; // 0–100
};

type CreativeInput = {
  title?: string;
  platform?: string;
  niche?: string;
  emotion_tags?: string[];
  hook_types?: string[];
  visual_styles?: string[];
};

// ── Scoring Weights ──────────────────────────────────────────
// Total possible = 100
// Required fields carry errors (block submit)
// Optional fields carry warnings (reduce score)

const WEIGHTS = {
  title: 20,
  platform: 15,
  niche: 15,
  emotion_tags: 25,
  hook_types: 15,
  visual_styles: 10,
};

// ── Main Validator ───────────────────────────────────────────

export function validateCreative(
  data: CreativeInput
): ValidationResult {
  const errors: string[] = [];
  const warnings: string[] = [];
  let score = 0;

  // Title — required
  if (!data.title?.trim()) {
    errors.push("Title is required.");
  } else {
    score += WEIGHTS.title;
  }

  // Platform — required
  if (!data.platform?.trim()) {
    errors.push("Platform is required.");
  } else {
    score += WEIGHTS.platform;
  }

  // Niche — strongly recommended
  if (!data.niche?.trim()) {
    warnings.push("Niche missing — reduces pattern accuracy.");
  } else {
    score += WEIGHTS.niche;
  }

  // Emotion tags — required, at least 1
  if (!data.emotion_tags || data.emotion_tags.length === 0) {
    errors.push("At least one emotion tag is required.");
  } else {
    score += WEIGHTS.emotion_tags;

    if (data.emotion_tags.length > 3) {
      warnings.push(
        "More than 3 emotion tags may dilute signal quality."
      );
    }
  }

  // Hook types — required, at least 1
  if (!data.hook_types || data.hook_types.length === 0) {
    errors.push("At least one hook type is required.");
  } else {
    score += WEIGHTS.hook_types;
  }

  // Visual styles — recommended
  if (!data.visual_styles || data.visual_styles.length === 0) {
    warnings.push(
      "Visual style missing — reduces visual pattern detection."
    );
  } else {
    score += WEIGHTS.visual_styles;
  }

  const isValid = errors.length === 0;

  const quality: SignalQuality =
    score >= 80 ? "strong" : score >= 50 ? "moderate" : "weak";

  return {
    isValid,
    errors,
    warnings,
    quality,
    score,
  };
}