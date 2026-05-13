import { getTopEntry } from "../utils/sorting";
import { incrementMap } from "../utils/helpers";
import { Creative } from "../types/creative";
import { DatasetSummary } from "../types/intelligence";
import { extractCreativeSignals } from "../signals/extractSignals";

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
    const signals =
      extractCreativeSignals(item);

    signals.emotions.forEach(
      (emotion) => {
        incrementMap(emotionCount, emotion);
      }
    );

    signals.hooks.forEach(
      (hook) => {
        incrementMap(hookCount, hook);
      }
    );

    signals.platforms.forEach(
      (platform) => {
        incrementMap(platformCount, platform);
      }
    );
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
