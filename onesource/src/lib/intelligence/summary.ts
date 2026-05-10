import { getTopEntry } from "../utils/sorting";
import { incrementMap } from "../utils/helpers";
import { Creative } from "../types/creative";
import { DatasetSummary } from "../types/intelligence";

export function buildDatasetSummary(
  creatives: Creative[]
): DatasetSummary {
  const emotionCount: Record<
    string,
    number
  > = {};

  const hookCount: Record<
    string,
    number
  > = {};

  const platformCount: Record<
    string,
    number
  > = {};

  creatives.forEach((item) => {
    item.emotion_tags?.forEach(
      (emotion: string) => {
        incrementMap(emotionCount, emotion);
      }
    );

    item.hook_types?.forEach(
      (hook: string) => {
        incrementMap(hookCount, hook);
      }
    );

    if (item.platform) {
      incrementMap(platformCount, item.platform);
    }
  });

  return {
    topEmotion:
      getTopEntry(emotionCount),

    topHook:
      getTopEntry(hookCount),

    topPlatform:
      getTopEntry(platformCount),
  };
}