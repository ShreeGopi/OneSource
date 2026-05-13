import { describe, expect, it } from "vitest";
import { Creative } from "../types/creative";
import { buildRelationships } from "./buildRelationships";

const creatives: Creative[] = [
  {
    id: "a",
    emotion_tags: [" Curiosity ", "curiosity"],
    hook_types: [" Before-After "],
    visual_styles: [" UGC "],
    cta: " Try Now ",
    niche: " Fitness ",
  },
  {
    id: "b",
    emotion_tags: ["curiosity", "urgency"],
    hook_types: ["before-after"],
    visual_styles: ["ugc", "cinematic"],
    cta: "Try Now",
    niche: "Fitness",
  },
  {
    id: "c",
    emotion_tags: ["curiosity"],
    hook_types: ["problem-solution"],
    visual_styles: ["clean"],
    cta: "Get Yours Today",
    niche: "Skincare",
  },
];

describe("buildRelationships", () => {
  it("keeps repeated relationships and filters one-off relationships", () => {
    const result = buildRelationships(creatives);

    expect(result.relationships).toEqual(
      expect.arrayContaining([
        {
          type: "Emotion-Hook",
          left: "curiosity",
          right: "before-after",
          count: 2,
        },
        {
          type: "Hook-Visual",
          left: "before-after",
          right: "ugc",
          count: 3,
        },
        {
          type: "Emotion-CTA",
          left: "curiosity",
          right: "try now",
          count: 2,
        },
      ])
    );

    expect(result.relationships).not.toEqual(
      expect.arrayContaining([
        expect.objectContaining({
          left: "curiosity",
          right: "problem-solution",
        }),
      ])
    );
  });

  it("builds stable reinforced structures from normalized signals", () => {
    const { reinforcedStructures } =
      buildRelationships(creatives);

    expect(reinforcedStructures.curiosity).toMatchObject({
      emotion: "curiosity",
      hooks: {
        "before-after": 2,
        "problem-solution": 1,
      },
      visuals: {
        ugc: 2,
        cinematic: 1,
        clean: 1,
      },
      ctas: {
        "try now": 2,
        "get yours today": 1,
      },
      niches: {
        fitness: 2,
        skincare: 1,
      },
      totalStrength: 13,
    });
  });
});
