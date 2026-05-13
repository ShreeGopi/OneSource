import { describe, expect, it } from "vitest";
import { Creative } from "../types/creative";
import { buildSignalExploration } from "./signalExploration";

const creatives: Creative[] = [
  {
    id: "a",
    title: "A",
    emotion_tags: [" Curiosity ", "curiosity"],
    hook_types: [" Before-After "],
    visual_styles: [" UGC "],
    cta: " Try Now ",
    platform: " TikTok ",
    niche: " Fitness ",
  },
  {
    id: "b",
    title: "B",
    emotion_tags: ["curiosity", "urgency"],
    hook_types: ["before-after"],
    visual_styles: ["ugc", "cinematic"],
    cta: "Try Now",
    platform: "tiktok",
    niche: "Fitness",
  },
  {
    id: "c",
    title: "C",
    emotion_tags: ["aspiration"],
    hook_types: ["comparison"],
    visual_styles: ["clean"],
    cta: "Order Now",
    platform: "Amazon",
    niche: "Beauty",
  },
  {
    id: "d",
    title: "D",
    emotion_tags: ["curiosity"],
    hook_types: ["problem-solution"],
    visual_styles: ["clean"],
    cta: "Get Yours Today",
    platform: "Amazon",
    niche: "Skincare",
  },
];

function ids(
  result: ReturnType<typeof buildSignalExploration>
) {
  return result?.matchingCreatives.map((creative) => creative.id);
}

describe("buildSignalExploration", () => {
  it("explores every supported signal type with normalized matching", () => {
    expect(
      ids(buildSignalExploration(creatives, {
        type: "emotion",
        value: " Curiosity ",
      }))
    ).toEqual(["a", "b", "d"]);

    expect(
      ids(buildSignalExploration(creatives, {
        type: "hook",
        value: "Before-After",
      }))
    ).toEqual(["a", "b"]);

    expect(
      ids(buildSignalExploration(creatives, {
        type: "visual",
        value: "UGC",
      }))
    ).toEqual(["a", "b"]);

    expect(
      ids(buildSignalExploration(creatives, {
        type: "cta",
        value: "try now",
      }))
    ).toEqual(["a", "b"]);

    expect(
      ids(buildSignalExploration(creatives, {
        type: "platform",
        value: "tiktok",
      }))
    ).toEqual(["a", "b"]);

    expect(
      ids(buildSignalExploration(creatives, {
        type: "niche",
        value: "fitness",
      }))
    ).toEqual(["a", "b"]);
  });

  it("explores compound patterns and returns normalized regional counts", () => {
    const result = buildSignalExploration(creatives, {
      type: "pattern",
      value: " Curiosity + Before-After ",
    });

    expect(ids(result)).toEqual(["a", "b"]);
    expect(result?.regions.behavioralDrivers).toEqual({
      curiosity: 2,
      urgency: 1,
    });
    expect(result?.regions.persuasionMechanisms).toEqual({
      "before-after": 2,
    });
    expect(result?.regions.visualLanguage).toEqual({
      ugc: 2,
      cinematic: 1,
    });
    expect(result?.regions.commercialIntent).toEqual({
      "try now": 2,
    });
    expect(result?.regions.platforms).toEqual({
      tiktok: 2,
    });
    expect(result?.regions.niches).toEqual({
      fitness: 2,
    });
  });

  it("returns an empty exploration result when no creative contains the signal", () => {
    const result = buildSignalExploration(creatives, {
      type: "visual",
      value: "luxury",
    });

    expect(result?.matchingCreatives).toEqual([]);
    expect(result?.regions.visualLanguage).toEqual({});
  });
});
