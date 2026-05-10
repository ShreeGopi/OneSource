import {
  normalizeEmotion,
  normalizeSignal,
} from "../signals/normalize";

import { Creative } from "../types/creative";


export function buildPatternExploration(
  creatives: Creative[],
  selectedPattern: string | null
) {
  if (!selectedPattern) return null;

  const [targetEmotion, targetHook] =
    selectedPattern.split(" + ");

  const visuals: Record<string, number> =
    {};

  const ctas: Record<string, number> = {};

  const niches: Record<string, number> =
    {};

  const platforms: Record<
    string,
    number
  > = {};

  const matchingCreatives =
    creatives.filter((item) => {
      const emotions =
        item.emotion_tags
          ?.map(normalizeEmotion)
          .filter(Boolean) || [];

      const hooks =
        item.hook_types
          ?.map(normalizeSignal)
          .filter(Boolean) || [];

      return (
        emotions.includes(targetEmotion) &&
        hooks.includes(targetHook)
      );
    });

  matchingCreatives.forEach((item) => {
    item.visual_styles
      ?.map(normalizeSignal)
      .filter(Boolean)
      .forEach((visual: string) => {
        visuals[visual] =
          (visuals[visual] || 0) + 1;
      });

    const cta = normalizeSignal(item.cta);

    if (cta) {
      ctas[cta] = (ctas[cta] || 0) + 1;
    }

    const niche =
      normalizeSignal(item.niche);

    if (niche) {
      niches[niche] =
        (niches[niche] || 0) + 1;
    }

    const platform =
      normalizeSignal(item.platform);

    if (platform) {
      platforms[platform] =
        (platforms[platform] || 0) + 1;
    }
  });

  return {
    visuals,
    ctas,
    niches,
    platforms,
    matchingCreatives,
  };
}