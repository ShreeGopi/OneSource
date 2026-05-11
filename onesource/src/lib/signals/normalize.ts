// ============================================================
// OneSource — Signal Normalization
// Imports vocabulary from ontology — no local definitions.
// ============================================================

import { VALID_EMOTIONS } from "../config/ontology";

export { VALID_EMOTIONS };

export const normalizeSignal = (
  value?: string
): string => {
  if (!value) return "";

  return value.toLowerCase().trim();
};

export const normalizeEmotion = (
  emotion?: string
): string | null => {
  const normalized = normalizeSignal(emotion);

  if (
    !VALID_EMOTIONS.includes(
      normalized as (typeof VALID_EMOTIONS)[number]
    )
  ) {
    return null;
  }

  return normalized;
};