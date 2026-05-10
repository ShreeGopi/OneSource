import { Creative } from "../types/creative";

export const buildSignalExploration = (
  creatives: Creative[],
  explorer:
    | {
        type: string;
        value: string;
      }
    | null
) => {
  if (!explorer) return null;

  let matchingCreatives: Creative[] = [];

  // PATTERN
  
  if (explorer.type === "pattern") {
    const [emotion, hook] =
      explorer.value.split(" + ");

    matchingCreatives = creatives.filter(
      (item) =>
        item.emotion_tags?.includes(
          emotion
        ) &&
        item.hook_types?.includes(hook)
    );
  }

  // EMOTION

  if (explorer.type === "emotion") {
    matchingCreatives = creatives.filter(
      (item) =>
        item.emotion_tags?.includes(
          explorer.value
        )
    );
  }

  // RELATIONSHIP

  if (explorer.type === "relationship") {
    const [left, right] =
      explorer.value.split("::");

    matchingCreatives = creatives.filter(
      (item) => {
        const hasLeft =
          item.emotion_tags?.includes(
            left
          ) ||
          item.hook_types?.includes(left) ||
          item.visual_styles?.includes(
            left
          ) ||
          item.cta === left ||
          item.niche === left;

        const hasRight =
          item.emotion_tags?.includes(
            right
          ) ||
          item.hook_types?.includes(
            right
          ) ||
          item.visual_styles?.includes(
            right
          ) ||
          item.cta === right ||
          item.niche === right;

        return hasLeft && hasRight;
      }
    );
  }

  const visuals: Record<string, number> =
    {};

  const hooks: Record<string, number> = {};

  const emotions: Record<
    string,
    number
  > = {};

  const ctas: Record<string, number> = {};

  const niches: Record<
    string,
    number
  > = {};

  const platforms: Record<
    string,
    number
  > = {};

  matchingCreatives.forEach((item) => {
    item.visual_styles?.forEach(
      (visual: string) => {
        visuals[visual] =
          (visuals[visual] || 0) + 1;
      }
    );

    item.hook_types?.forEach(
      (hook: string) => {
        hooks[hook] =
          (hooks[hook] || 0) + 1;
      }
    );

    item.emotion_tags?.forEach(
      (emotion: string) => {
        emotions[emotion] =
          (emotions[emotion] || 0) + 1;
      }
    );

    if (item.cta) {
      ctas[item.cta] =
        (ctas[item.cta] || 0) + 1;
    }

    if (item.niche) {
      niches[item.niche] =
        (niches[item.niche] || 0) + 1;
    }

    if (item.platform) {
      platforms[item.platform] =
        (platforms[item.platform] || 0) +
        1;
    }
  });

  return {
    matchingCreatives,
    visuals,
    hooks,
    emotions,
    ctas,
    niches,
    platforms,
  };
};