import { Creative } from "../types/creative";
import { PlatformResult } from "../types/intelligence";
import { getStrengthLabel } from "../utils/scoring";
import {
  calculatePercentage,
} from "../utils/percentages";

import {
  sumValues,
} from "../utils/aggregation";
import { extractCreativeSignals } from "../signals/extractSignals";

export function buildPlatformInsights(
  creatives: Creative[],
  topPatterns: [string, number][]
): PlatformResult {
  const platformMap: Record<
    string,
    Record<string, number>
  > = {};

  creatives.forEach((item) => {
    const {
      emotions,
      hooks,
      platforms,
    } = extractCreativeSignals(item);

    platforms.forEach((platform) => {
      if (!platformMap[platform]) {
        platformMap[platform] = {};
      }

      emotions.forEach((emotion) => {
        hooks.forEach((hook) => {
          const key = `${emotion} + ${hook}`;

          platformMap[platform][key] =
            (platformMap[platform][key] || 0) + 1;
        });
      });
    });
  });

  const topPlatformPatterns =
    Object.entries(platformMap).map(
      ([platform, patterns]) => {
        const sorted = Object.entries(
          patterns
        ).sort((a, b) => b[1] - a[1]);

        const total = sumValues(patterns);

        const top = sorted[0];

        const percentage = top
  ? calculatePercentage(
      top[1],
      total
    )
  : 0;

       const label = getStrengthLabel(percentage);
 
        return {
          platform,
          top,
          percentage,
          label,
        };
      }
    );

  const crossPlatformData =
    topPatterns.map(([pattern]) => {
      const platforms = Object.entries(
        platformMap
      ).map(([platform, patterns]) => {
        const total = sumValues(patterns);

        const count = patterns[pattern] || 0;

       const percentage =
        calculatePercentage(
          count,
          total
        );

        const label = getStrengthLabel(percentage);

        return {
          platform,
          count,
          percentage,
          label,
        };
      });

      return {
        pattern,
        platforms,
      };
    });

  return {
    topPlatformPatterns,
    crossPlatformData,
  };
}
