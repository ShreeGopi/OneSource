export const SIGNAL_IMPORTANCE: Record<string, number> = {
  emotion:  1.0,    // Behavioral — highest intelligence value
  hook:     0.95,   // Mechanism — near-behavioral
  visual:   0.85,   // Language — meaningful creative signal
  cta:      0.7,    // Commercial intent — useful but secondary
  niche:    0.6,    // Category — contextual, not behavioral
  pattern:  0.9,    // Compound signal — high value
  platform: 0.35,   // Distribution — purely infrastructural
};

// ── Weighted Score ───────────────────────────────────────────

export function getWeightedScore(
  count: number,
  type: string
): number {
  const importance =
    SIGNAL_IMPORTANCE[type] ?? 0.5;

  return count * importance;
}
