"use client";

import { useEffect, useMemo, useState } from "react";
import Image from "next/image";

import { supabase } from "@/lib/supabase";

import { buildSignalExploration } from "@/lib/intelligence/signalExploration";
import { buildPatternExploration } from "@/lib/intelligence/exploration";
import { buildIntelligence } from "@/lib/intelligence";

import {
  getRelationshipStrength,
} from "@/lib/config/thresholds";

import {
  getTopEntries,
} from "@/lib/utils/aggregation";

import { Creative } from "@/lib/types/creative";

const patternExplanations: Record<string, string> = {
  "curiosity + before-after":
    "Before-after creates strong visual contrast while curiosity sustains attention.",
  "urgency + problem-solution":
    "Urgency accelerates action while problem-solution clarifies value.",
  "fear + problem-solution":
    "Fear introduces risk while problem-solution resolves uncertainty.",
  "aspiration + before-after":
    "Aspiration visualizes transformation and outcome progression.",
};


export default function GalleryPage() {
  const [creatives, setCreatives] = useState<Creative[]>([]);
  const [signalExplorer, setSignalExplorer] =
    useState<{
      type: string;
      value: string;
    } | null>(null);
  const [selectedPattern, setSelectedPattern] =
    useState<string | null>(null);

  const [selectedEmotion, setSelectedEmotion] =
    useState("");

  const [selectedHook, setSelectedHook] =
    useState("");

  const [selectedPlatform, setSelectedPlatform] =
    useState("");

  const [showAllStructures, setShowAllStructures] =
    useState(false);

  const [allEmotions, setAllEmotions] =
    useState<string[]>([]);

  const [allHooks, setAllHooks] =
    useState<string[]>([]);

  const [allPlatforms, setAllPlatforms] =
    useState<string[]>([]);

  useEffect(() => {
    const fetchData = async () => {
      const { data, error } = await supabase
        .from("creatives")
        .select("*")
        .order("created_at", {
          ascending: false,
        });

      if (error) {
        console.error(error);
        return;
      }

      const creativesData = data || [];

      setCreatives(creativesData);

      const emotions = new Set<string>();
      const hooks = new Set<string>();
      const platforms = new Set<string>();

      creativesData.forEach((item) => {
        item.emotion_tags?.forEach((tag: string) =>
          emotions.add(tag)
        );

        item.hook_types?.forEach((tag: string) =>
          hooks.add(tag)
        );

        if (item.platform) {
          platforms.add(item.platform);
        }
      });

      setAllEmotions(Array.from(emotions));
      setAllHooks(Array.from(hooks));
      setAllPlatforms(Array.from(platforms));
    };

    void fetchData();
  }, []);

  // FILTERS

  const filtered = useMemo(() => {
    return creatives.filter((item) => {
      const matchEmotion = selectedEmotion
        ? item.emotion_tags?.includes(selectedEmotion)
        : true;

      const matchHook = selectedHook
        ? item.hook_types?.includes(selectedHook)
        : true;

      const matchPlatform = selectedPlatform
        ? item.platform === selectedPlatform
        : true;

      return (
        matchEmotion &&
        matchHook &&
        matchPlatform
      );
    });
  }, [
    creatives,
    selectedEmotion,
    selectedHook,
    selectedPlatform,
  ]);

  const intelligence = useMemo(
    () => buildIntelligence(filtered),
    [filtered]
  );

  const {
    summary,
    patterns,
    relationships,
    reinforced,
    taxonomy,
    platform,
  } = intelligence;

  const { topEmotion, topHook, topPlatform } = summary;
  const { topPatterns } = patterns;
  const { groupedRelationships } = relationships;
  const {
    sortedReinforcedStructures,
    filteredReinforcedStructures,
  } = reinforced;

  const visibleStructures =
    showAllStructures
      ? sortedReinforcedStructures
      : filteredReinforcedStructures;

  const {
    topPlatformPatterns,
    crossPlatformData,
  } = platform;

  const signalExploration = useMemo(
    () =>
      buildSignalExploration(
        filtered,
        signalExplorer
      ),
    [filtered, signalExplorer]
  );
   
  // PATTERN EXPLORATION

  const selectedPatternData = useMemo(() =>
    buildPatternExploration(
      filtered,
      selectedPattern
    ), [filtered, selectedPattern]);

  return (
    <div className="p-8 bg-black min-h-screen text-white">
      <h1 className="text-3xl font-bold mb-2">
        Creative Gallery
      </h1>

      <p className="text-sm text-gray-400 mb-8">
        Structured attention signal exploration.
      </p>

      {/* SUMMARY */}

      <div className="mb-6 p-5 rounded-2xl bg-[#111] border border-gray-800">
        <h2 className="font-semibold text-lg mb-3">
          📊 Dataset Summary
        </h2>

        <div className="space-y-2 text-sm">
          <p>
            Top Emotion: {topEmotion?.[0]} (
            {topEmotion?.[1]})
          </p>

          <p>
            Top Hook: {topHook?.[0]} (
            {topHook?.[1]})
          </p>

          <p>
            Top Platform: {topPlatform?.[0]} (
            {topPlatform?.[1]})
          </p>
        </div>
      </div>

      {/* PATTERNS */}

      <div className="mb-6 p-5 rounded-2xl bg-[#111] border border-gray-800">
        <h2 className="font-semibold text-lg mb-4">
          🔥 Repeating Patterns
        </h2>

        {topPatterns.map(([pattern, count]) => {
          const [emotion, hook] =
            pattern.split(" + ");

          return (
            <div
              key={pattern}
              onClick={() =>
              setSignalExplorer({
                type: "pattern",
                value: pattern,
              })
            }
              className="mb-3 p-3 rounded-xl border border-gray-800 cursor-pointer hover:border-gray-600 transition"
            >
              <p className="text-sm">
                <span className="font-semibold">
                  {emotion}
                </span>{" "}
                →{" "}
                <span className="font-semibold">
                  {hook}
                </span>{" "}
                ({count})
              </p>

              {patternExplanations[pattern] && (
                <p className="text-xs text-gray-400 mt-2">
                  💡{" "}
                  {
                    patternExplanations[
                      pattern
                    ]
                  }
                </p>
              )}
            </div>
          );
        })}
      </div>

      {/* PLATFORM INSIGHTS */}

      <div className="mb-6 p-5 rounded-2xl bg-[#111] border border-gray-800">
        <h2 className="font-semibold text-lg mb-4">
          🌐 Platform Insights
        </h2>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {topPlatformPatterns.map((item) => (
            <div
              key={item.platform}
              className="rounded-xl border border-gray-800 p-3"
            >
              <p className="text-sm font-semibold">
                {item.platform}
              </p>
              <p className="text-xs text-gray-400 mt-1">
                {item.top ? item.top[0] : "No pattern"} ({item.top?.[1] ?? 0})
              </p>
              <p className="text-xs text-gray-400 mt-1">
                {item.label} • {item.percentage}%
              </p>
            </div>
          ))}
        </div>

        <div className="mt-5">
          <h3 className="text-sm font-semibold mb-3">
            Cross-platform pattern spread
          </h3>
          <div className="space-y-3 text-xs text-gray-400">
            {crossPlatformData.slice(0, 3).map((patternGroup) => (
              <div key={patternGroup.pattern}>
                <p className="font-semibold text-white">
                  {patternGroup.pattern}
                </p>
                <div className="grid grid-cols-1 gap-2 mt-2">
                  {patternGroup.platforms.map((entry) => (
                    <p key={entry.platform}>
                      {entry.platform}: {entry.count} ({entry.label})
                    </p>
                  ))}
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* TAXONOMY */}

      <div className="mb-6 p-5 rounded-2xl bg-[#111] border border-gray-800">
        <h2 className="font-semibold text-lg mb-4">
          🧭 Taxonomy Clusters
        </h2>

        <div className="space-y-4 text-xs text-gray-400">
          {taxonomy.map(([cluster, data]) => (
            <div key={cluster} className="rounded-xl border border-gray-800 p-3">
              <p className="font-semibold text-white">
                {cluster} ({data.count})
              </p>
              <p className="mt-2">
                {data.patterns.join(", ")}
              </p>
            </div>
          ))}
        </div>
      </div>

      {/* RELATIONSHIPS */}

      <div className="mb-6 p-5 rounded-2xl bg-[#111] border border-gray-800">
        <h2 className="font-semibold text-lg mb-4">
          🧠 Relationship Intelligence
        </h2>

        {Object.entries(
          groupedRelationships
        ).map(([type, items]) => (
          <div key={type} className="mb-5">
            <h3 className="text-sm font-semibold mb-2">
              {type}
            </h3>

            <div className="space-y-2">
              {items.map((item) => (
                <div
                  key={`${item.left}-${item.right}`}
                  className="text-xs text-gray-400 cursor-pointer hover:text-white"
                  onClick={() =>
                setSignalExplorer({
                  type: "relationship",
                  value: `${item.left}::${item.right}`,
                })
              }
                >
                  {item.left} ↔ {item.right} (
                  {item.count}) —{" "}
                  {getRelationshipStrength(
                    item.count
                  )}
                </div>
              ))}
            </div>
          </div>
        ))}
      </div>

      {/* REINFORCED STRUCTURES */}

      <div className="mb-6 p-5 rounded-2xl bg-[#111] border border-gray-800">
        <div className="flex items-center justify-between mb-4">
          <h2 className="font-semibold text-lg">
            🧠 Reinforced Structures
          </h2>

          <button
            onClick={() =>
              setShowAllStructures(
                !showAllStructures
              )
            }
            className="text-xs px-3 py-1 rounded-lg bg-gray-800"
          >
            {showAllStructures
              ? "Show Strong Only"
              : "Show All"}
          </button>
        </div>

        {visibleStructures.map((structure) => (
          <div
          key={structure.emotion}
          onClick={() =>
            setSignalExplorer({
              type: "emotion",
              value: structure.emotion,
            })
          }
            className="mb-4 p-4 rounded-xl border border-gray-800 cursor-pointer hover:border-gray-600 transition"
          >
            <p className="font-semibold capitalize">
              {structure.emotion}
            </p>

            <p className="text-xs text-gray-500 mt-1">
              Reinforcement Strength:{" "}
              {structure.totalStrength}
            </p>

            <div className="mt-4">
              <p className="text-xs text-gray-500 mb-2">
                Hooks
              </p>

              {getTopEntries(
                structure.hooks
              ).map(([hook, count]) => (
                <p
                  key={hook}
                  className="text-xs text-gray-300"
                >
                  • {hook} ({count})
                </p>
              ))}
            </div>

            <div className="mt-4">
              <p className="text-xs text-gray-500 mb-2">
                Visuals
              </p>

              {getTopEntries(
                structure.visuals
              ).map(([visual, count]) => (
                <p
                  key={visual}
                  className="text-xs text-gray-300"
                >
                  • {visual} ({count})
                </p>
              ))}
            </div>
          </div>
        ))}
      </div>
      
      {/* SIGNAL EXPLORATION */}

          {signalExplorer &&
            signalExploration && (
              <div className="mb-6 p-5 rounded-2xl bg-[#111] border border-gray-800">

                <div className="flex items-center justify-between mb-4">
                  <h2 className="font-semibold text-lg">
                    🧠 Signal Exploration
                  </h2>

                  <button
                    onClick={() =>
                      setSignalExplorer(null)
                    }
                    className="text-xs text-gray-400 hover:text-white"
                  >
                    Close
                  </button>
                </div>

                <p className="text-sm text-yellow-400 mb-5">
                  Exploring:{" "}
                  {signalExplorer.value}
                </p>

                {/* EMOTIONS */}

                <div className="mb-4">
                  <p className="text-xs text-gray-500 mb-2">
                    Emotions
                  </p>

                  {Object.entries(
                    signalExploration.emotions
                  )
                    .sort((a, b) => b[1] - a[1])
                    .slice(0, 5)
                    .map(([emotion, count]) => (
                      <p
                        key={emotion}
                        className="text-xs text-gray-300"
                      >
                        • {emotion} ({count})
                      </p>
                    ))}
                </div>

                {/* HOOKS */}

                <div className="mb-4">
                  <p className="text-xs text-gray-500 mb-2">
                    Hooks
                  </p>

                  {Object.entries(
                    signalExploration.hooks
                  )
                    .sort((a, b) => b[1] - a[1])
                    .slice(0, 5)
                    .map(([hook, count]) => (
                      <p
                        key={hook}
                        className="text-xs text-gray-300"
                      >
                        • {hook} ({count})
                      </p>
                    ))}
                </div>

                {/* VISUALS */}

                <div className="mb-4">
                  <p className="text-xs text-gray-500 mb-2">
                    Visuals
                  </p>

                  {Object.entries(
                    signalExploration.visuals
                  )
                    .sort((a, b) => b[1] - a[1])
                    .slice(0, 5)
                    .map(([visual, count]) => (
                      <p
                        key={visual}
                        className="text-xs text-gray-300"
                      >
                        • {visual} ({count})
                      </p>
                    ))}
                </div>

                {/* CTA */}

                <div className="mb-4">
                  <p className="text-xs text-gray-500 mb-2">
                    CTA
                  </p>

                  {Object.entries(
                    signalExploration.ctas
                  )
                    .sort((a, b) => b[1] - a[1])
                    .slice(0, 5)
                    .map(([cta, count]) => (
                      <p
                        key={cta}
                        className="text-xs text-gray-300"
                      >
                        • {cta} ({count})
                      </p>
                    ))}
                </div>

                {/* MATCHING CREATIVES */}

                <div>
                  <p className="text-xs text-gray-500 mb-3">
                    Matching Creatives
                  </p>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                    {signalExploration.matchingCreatives.map(
                      (item: Creative) => (
                        <div
                          key={item.id}
                          className="bg-black border border-gray-800 rounded-lg p-3"
                        >
                          <p className="text-sm font-medium">
                            {item.title}
                          </p>

                          <p className="text-xs text-gray-500 mt-1">
                            {item.platform} •{" "}
                            {item.niche}
                          </p>
                        </div>
                      )
                    )}
                  </div>
                </div>
              </div>
          )}
          
      {/* PATTERN EXPLORATION */}

      {selectedPattern &&
        selectedPatternData && (
          <div className="mb-6 p-5 rounded-2xl bg-[#111] border border-gray-800">

            <div className="flex items-center justify-between mb-4">
              <h2 className="font-semibold text-lg">
                🧠 Pattern Exploration
              </h2>

              <button
                onClick={() =>
                  setSelectedPattern(null)
                }
                className="text-xs text-gray-400 hover:text-white"
              >
                Close
              </button>
            </div>

            <p className="text-sm text-yellow-400 mb-4">
              Selected Pattern: {selectedPattern}
            </p>

            {/* VISUALS */}

            <div className="mb-4">
              <p className="text-xs text-gray-500 mb-2">
                Visual Relationships
              </p>

              {getTopEntries(
                selectedPatternData.visuals
              ).map(([visual, count]) => (
                <p
                  key={visual}
                  className="text-xs text-gray-300"
                >
                  • {visual} ({count}) —{" "}
                  {getRelationshipStrength(count)}
                </p>
              ))}
            </div>

            {/* CTA */}

            <div className="mb-4">
              <p className="text-xs text-gray-500 mb-2">
                CTA Relationships
              </p>

              {getTopEntries(
                selectedPatternData.ctas
              ).map(([cta, count]) => (
                <p
                  key={cta}
                  className="text-xs text-gray-300"
                >
                  • {cta} ({count}) —{" "}
                  {getRelationshipStrength(count)}
                </p>
              ))}
            </div>

            {/* NICHES */}

            <div className="mb-4">
              <p className="text-xs text-gray-500 mb-2">
                Niche Relationships
              </p>

              {getTopEntries(
                selectedPatternData.niches
              ).map(([niche, count]) => (
                <p
                  key={niche}
                  className="text-xs text-gray-300"
                >
                  • {niche} ({count}) —{" "}
                  {getRelationshipStrength(count)}
                </p>
              ))}
            </div>

            {/* PLATFORMS */}

            <div className="mb-4">
              <p className="text-xs text-gray-500 mb-2">
                Platform Relationships
              </p>

              {getTopEntries(
                selectedPatternData.platforms
              ).map(([platform, count]) => (
                <p
                  key={platform}
                  className="text-xs text-gray-300"
                >
                  • {platform} ({count}) —{" "}
                  {getRelationshipStrength(count)}
                </p>
              ))}
            </div>

            {/* MATCHING CREATIVES */}

            <div>
              <p className="text-xs text-gray-500 mb-3">
                Matching Creatives
              </p>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                {selectedPatternData.matchingCreatives.map(
                  (item: Creative) => (
                    <div
                      key={item.id}
                      className="bg-black border border-gray-800 rounded-lg p-3"
                    >
                      <p className="text-sm font-medium">
                        {item.title}
                      </p>

                      <p className="text-xs text-gray-500 mt-1">
                        {item.platform} •{" "}
                        {item.niche}
                      </p>
                    </div>
                  )
                )}
              </div>
            </div>
          </div>
      )}

      {/* FILTERS */}

      <div className="flex gap-4 mb-8">
        <select
          onChange={(e) =>
            setSelectedEmotion(
              e.target.value
            )
          }
          className="bg-[#111] border border-gray-700 p-2 rounded-lg"
        >
          <option value="">
            All Emotions
          </option>

          {allEmotions.map((emotion) => (
            <option key={emotion}>
              {emotion}
            </option>
          ))}
        </select>

        <select
          onChange={(e) =>
            setSelectedHook(e.target.value)
          }
          className="bg-[#111] border border-gray-700 p-2 rounded-lg"
        >
          <option value="">
            All Hooks
          </option>

          {allHooks.map((hook) => (
            <option key={hook}>
              {hook}
            </option>
          ))}
        </select>

        <select
          onChange={(e) =>
            setSelectedPlatform(
              e.target.value
            )
          }
          className="bg-[#111] border border-gray-700 p-2 rounded-lg"
        >
          <option value="">
            All Platforms
          </option>

          {allPlatforms.map((platform) => (
            <option key={platform}>
              {platform}
            </option>
          ))}
        </select>
      </div>

      {/* GRID */}

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {filtered.map((item) => (
          <div
            key={item.id}
            className="bg-[#111] border border-gray-800 rounded-xl p-4"
          >
            {item.image_url && (
              <Image
                src={item.image_url}
                alt="creative"
                width={400}
                height={160}
                className="w-full h-40 object-cover rounded-lg mb-4"
              />
            )}

            <h2 className="font-semibold">
              {item.title}
            </h2>

            <p className="text-sm text-gray-400">
              {item.brand}
            </p>

            <div className="mt-3 text-xs text-gray-400 space-y-1">
              <p>
                Emotion:{" "}
                {item.emotion_tags?.join(
                  ", "
                )}
              </p>

              <p>
                Hooks:{" "}
                {item.hook_types?.join(
                  ", "
                )}
              </p>

              <p>
                Visuals:{" "}
                {item.visual_styles?.join(
                  ", "
                )}
              </p>
            </div>

            <p className="text-xs text-gray-500 mt-4">
              {item.platform} •{" "}
              {item.niche}
            </p>
          </div>
        ))}
      </div>
    </div>
  );
}