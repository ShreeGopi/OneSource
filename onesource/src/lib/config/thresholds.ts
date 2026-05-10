export const MIN_STRUCTURE_STRENGTH = 10;

export const SIGNAL_THRESHOLDS = {
  dominant: 6,
  strong: 4,
  emerging: 2,
};

export function getRelationshipStrength(
  count: number
) {
  if (count >= SIGNAL_THRESHOLDS.dominant) {
    return "Dominant";
  }

  if (count >= SIGNAL_THRESHOLDS.strong) {
    return "Strong";
  }

  if (count >= SIGNAL_THRESHOLDS.emerging) {
    return "Emerging";
  }

  return "Weak";
}