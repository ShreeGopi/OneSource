import { describe, expect, it } from "vitest";
import { Creative } from "../types/creative";
import { buildIntelligence } from "./index";

const creatives: Creative[] = [
  {
    id: "a",
    emotion_tags: [" Curiosity ", "curiosity"],
    hook_types: [" Before-After "],
    visual_styles: [" UGC "],
    cta: " Try Now ",
    platform: " TikTok ",
    niche: " Fitness ",
  },
  {
    id: "b",
    emotion_tags: ["curiosity", "urgency"],
    hook_types: ["before-after"],
    visual_styles: ["ugc", "cinematic"],
    cta: "Try Now",
    platform: "tiktok",
    niche: "Fitness",
  },
  {
    id: "c",
    emotion_tags: ["aspiration"],
    hook_types: ["comparison"],
    visual_styles: ["clean"],
    cta: "Order Now",
    platform: "Amazon",
    niche: "Beauty",
  },
  {
    id: "d",
    emotion_tags: ["curiosity"],
    hook_types: ["problem-solution"],
    visual_styles: ["clean"],
    cta: "Get Yours Today",
    platform: "Amazon",
    niche: "Skincare",
  },
];

describe("buildIntelligence", () => {
  it("builds the core intelligence shape from creative signals", () => {
    const intelligence = buildIntelligence(creatives);

    expect(intelligence.summary.topEmotion).toEqual([
      "curiosity",
      3,
    ]);
    expect(intelligence.summary.topHook).toEqual([
      "before-after",
      2,
    ]);

    expect(intelligence.patterns.topPatterns).toEqual([
      ["curiosity + before-after", 2],
    ]);

    expect(intelligence.relationships.relationships).toEqual(
      expect.arrayContaining([
        expect.objectContaining({
          type: "Emotion-Hook",
          left: "curiosity",
          right: "before-after",
          count: 2,
        }),
      ])
    );

    expect(
      intelligence.reinforced.sortedReinforcedStructures[0]
    ).toMatchObject({
      emotion: "curiosity",
      totalStrength: 13,
    });

    expect(intelligence.taxonomy[0]).toEqual([
      "AttentionSeeking \u00d7 Transformation",
      {
        count: 2,
        patterns: ["curiosity \u2192 before-after"],
      },
    ]);

    expect(intelligence.platform.topPlatformPatterns).toEqual(
      expect.arrayContaining([
        expect.objectContaining({
          platform: "tiktok",
          top: ["curiosity + before-after", 2],
          percentage: 67,
          label: "Dominant",
        }),
      ])
    );
  });
});
