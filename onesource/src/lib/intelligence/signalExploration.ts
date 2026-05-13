import { Creative } from "../types/creative";
import {
  extractCreativeSignals,
  hasSignal,
} from "../signals/extractSignals";
import { normalizeSignal } from "../signals/normalize";
import { incrementMap } from "../utils/helpers";

type SignalExplorer = {
  type: string;
  value: string;
};

function normalizeExplorer(
  explorer: SignalExplorer
): SignalExplorer {
  if (explorer.type === "pattern") {
    const [emotion, hook] =
      explorer.value.split(" + ");

    return {
      type: explorer.type,
      value: `${normalizeSignal(emotion)} + ${normalizeSignal(hook)}`,
    };
  }

  return {
    type: explorer.type,
    value: normalizeSignal(explorer.value),
  };
}

function matchesExplorer(
  creative: Creative,
  explorer: SignalExplorer
): boolean {
  const signals = extractCreativeSignals(creative);

  if (explorer.type === "pattern") {
    const [emotion, hook] =
      explorer.value.split(" + ");

    return (
      signals.emotions.includes(emotion) &&
      signals.hooks.includes(hook)
    );
  }

  if (explorer.type === "relationship") {
    const [left, right] =
      explorer.value
        .split("::")
        .map(normalizeSignal);

    const signalTypes = [
      "emotion",
      "hook",
      "visual",
      "cta",
      "platform",
      "niche",
    ];

    return (
      signalTypes.some((type) =>
        hasSignal(signals, type, left)
      ) &&
      signalTypes.some((type) =>
        hasSignal(signals, type, right)
      )
    );
  }

  return hasSignal(
    signals,
    explorer.type,
    explorer.value
  );
}

export const buildSignalExploration = (
  creatives: Creative[],
  explorer: SignalExplorer | null
) => {
  if (!explorer) return null;

  const normalizedExplorer =
    normalizeExplorer(explorer);

  const matchingCreatives = creatives.filter(
    (item) =>
      matchesExplorer(item, normalizedExplorer)
  );

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
    const signals =
      extractCreativeSignals(item);

    signals.visuals.forEach(
      (visual) =>
        incrementMap(visuals, visual)
    );

    signals.hooks.forEach(
      (hook) =>
        incrementMap(hooks, hook)
    );

    signals.emotions.forEach(
      (emotion) =>
        incrementMap(emotions, emotion)
    );

    signals.ctas.forEach(
      (cta) =>
        incrementMap(ctas, cta)
    );

    signals.niches.forEach(
      (niche) =>
        incrementMap(niches, niche)
    );

    signals.platforms.forEach(
      (platform) =>
        incrementMap(platforms, platform)
    );
  });

  return {
    matchingCreatives,
    regions: {
      behavioralDrivers: emotions,
      persuasionMechanisms: hooks,
      visualLanguage: visuals,
      commercialIntent: ctas,
      platforms,
      niches,
    },
  };
};
