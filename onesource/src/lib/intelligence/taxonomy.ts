export const HOOK_BEHAVIOR_MAP: Record<
  string,
  string
> = {
  "before-after": "Transformation",
  "problem-solution":
    "ProblemSolving",
  comparison: "Evaluation",
  authority: "Trust",
  "social-proof": "Trust",
  demonstration: "Demonstration",
  urgency: "ActionPressure",
};

export const EMOTION_BEHAVIOR_MAP: Record<
  string,
  string
> = {
  curiosity: "AttentionSeeking",
  urgency: "ActionPressure",
  fear: "RiskAvoidance",
  aspiration: "Transformation",
  status: "StatusSeeking",
  trust: "Trust",
  scarcity: "LossAvoidance",
  hope: "Transformation",
  satisfaction: "Reward",
};

type TaxonomyCluster = {
  count: number;
  patterns: string[];
};

export function buildTaxonomyClusters(
  topPatterns: [string, number][]
) {
  const taxonomyClusters: Record<
    string,
    TaxonomyCluster
  > = {};

  topPatterns.forEach(
    ([pattern, count]) => {
      const [emotion, hook] =
        pattern.split(" + ");

      const emotionBehavior =
        EMOTION_BEHAVIOR_MAP[
          emotion
        ] || "Unknown";

      const hookBehavior =
        HOOK_BEHAVIOR_MAP[hook] ||
        "Unknown";

      const clusterKey =
        `${emotionBehavior} × ${hookBehavior}`;

      if (
        !taxonomyClusters[clusterKey]
      ) {
        taxonomyClusters[
          clusterKey
        ] = {
          count: 0,
          patterns: [],
        };
      }

      taxonomyClusters[
        clusterKey
      ].count += count;

      taxonomyClusters[
        clusterKey
      ].patterns.push(
        `${emotion} → ${hook}`
      );
    }
  );

  return Object.entries(
    taxonomyClusters
  ).sort(
    (a, b) =>
      b[1].count - a[1].count
  );
}