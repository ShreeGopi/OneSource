import { describe, expect, it } from "vitest";
import { Creative } from "../types/creative";
import { extractCreativeSignals, hasSignal } from "./extractSignals";

describe("extractCreativeSignals", () => {
  it("normalizes, deduplicates, and filters creative signals", () => {
    const creative: Creative = {
      emotion_tags: [
        " Curiosity ",
        "curiosity",
        "",
        "not-an-emotion",
      ],
      hook_types: [
        " Before-After ",
        "before-after",
        "",
      ],
      visual_styles: [" UGC ", "ugc", " "],
      cta: " Try Now ",
      platform: " TikTok ",
      niche: " Fitness ",
    };

    const signals = extractCreativeSignals(creative);

    expect(signals).toEqual({
      emotions: ["curiosity"],
      hooks: ["before-after"],
      visuals: ["ugc"],
      ctas: ["try now"],
      platforms: ["tiktok"],
      niches: ["fitness"],
    });
  });

  it("checks signal membership by type", () => {
    const signals = extractCreativeSignals({
      emotion_tags: ["urgency"],
      hook_types: ["problem-solution"],
      visual_styles: ["clean"],
      cta: "Buy Now",
      platform: "Amazon",
      niche: "Skincare",
    });

    expect(hasSignal(signals, "emotion", "urgency")).toBe(true);
    expect(hasSignal(signals, "hook", "problem-solution")).toBe(true);
    expect(hasSignal(signals, "visual", "clean")).toBe(true);
    expect(hasSignal(signals, "cta", "buy now")).toBe(true);
    expect(hasSignal(signals, "platform", "amazon")).toBe(true);
    expect(hasSignal(signals, "niche", "skincare")).toBe(true);
    expect(hasSignal(signals, "unknown", "urgency")).toBe(false);
  });
});
