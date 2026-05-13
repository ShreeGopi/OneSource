import { Creative } from "../types/creative";
import { incrementMap } from "../utils/helpers";
import { PatternResult } from "../types/intelligence";
import { extractCreativeSignals } from "../signals/extractSignals";

export function buildPatterns(
  creatives: Creative[]
): PatternResult {
  const patternCount: Record<string, number> = {};

  creatives.forEach((item) => {
    const { emotions, hooks } =
      extractCreativeSignals(item);

    emotions.forEach((emotion: string) => {
      hooks.forEach((hook: string) => {
        const key = `${emotion} + ${hook}`;

       incrementMap(patternCount, key);
      });
    });
  });

  const topPatterns = Object.entries(
    patternCount
  )
    .filter(([, count]) => count >= 2)
    .sort((a, b) => b[1] - a[1]);

  return {
    patternCount,
    topPatterns,
  };
}
