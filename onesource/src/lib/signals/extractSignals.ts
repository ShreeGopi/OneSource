import { Creative } from "../types/creative";
import {
  normalizeEmotion,
  normalizeSignal,
} from "./normalize";

export type CreativeSignals = {
  emotions: string[];
  hooks: string[];
  visuals: string[];
  ctas: string[];
  platforms: string[];
  niches: string[];
};

function uniqueSignals(
  values: string[]
): string[] {
  return Array.from(new Set(values));
}

function normalizeSignals(
  values?: string[]
): string[] {
  return uniqueSignals(
    values
      ?.map(normalizeSignal)
      .filter((value): value is string => Boolean(value)) || []
  );
}

export function extractCreativeSignals(
  creative: Creative
): CreativeSignals {
  return {
    emotions: uniqueSignals(
      creative.emotion_tags
        ?.map(normalizeEmotion)
        .filter((value): value is string => Boolean(value)) || []
    ),
    hooks: normalizeSignals(creative.hook_types),
    visuals: normalizeSignals(creative.visual_styles),
    ctas: normalizeSignals(
      creative.cta ? [creative.cta] : []
    ),
    platforms: normalizeSignals(
      creative.platform ? [creative.platform] : []
    ),
    niches: normalizeSignals(
      creative.niche ? [creative.niche] : []
    ),
  };
}

export function hasSignal(
  signals: CreativeSignals,
  type: string,
  value: string
): boolean {
  switch (type) {
    case "emotion":
      return signals.emotions.includes(value);

    case "hook":
      return signals.hooks.includes(value);

    case "visual":
      return signals.visuals.includes(value);

    case "cta":
      return signals.ctas.includes(value);

    case "platform":
      return signals.platforms.includes(value);

    case "niche":
      return signals.niches.includes(value);

    default:
      return false;
  }
}
