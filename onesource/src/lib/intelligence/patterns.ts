import {
  normalizeEmotion,
  normalizeSignal,
} from "../signals/normalize";
import { Creative } from "../types/creative";
import { incrementMap } from "../utils/helpers";
import { PatternResult } from "../types/intelligence";

export function buildPatterns(
  creatives: Creative[]
): PatternResult {
  const patternCount: Record<string, number> = {};

  creatives.forEach((item) => {
    const emotions =
      item.emotion_tags
        ?.map(normalizeEmotion)
        .filter((e): e is string => Boolean(e)) || [];

    const hooks =
      item.hook_types
        ?.map(normalizeSignal)
        .filter((h): h is string => Boolean(h)) || [];

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
    .filter(([_, count]) => count >= 2)
    .sort((a, b) => b[1] - a[1]);

  return {
    patternCount,
    topPatterns,
  };
}