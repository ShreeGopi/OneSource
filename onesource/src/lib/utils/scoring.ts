export type StrengthLabel =
  | "Dominant"
  | "Strong"
  | "Emerging"
  | "Weak";

export function getStrengthLabel(
  percentage: number
): StrengthLabel {
  if (percentage >= 50) {
    return "Dominant";
  }

  if (percentage >= 30) {
    return "Strong";
  }

  if (percentage >= 15) {
    return "Emerging";
  }

  return "Weak";
}