"use client";

import { useEffect, useMemo, useState } from "react";
import Image from "next/image";

import { supabase } from "@/lib/supabase";

import { buildPatternExploration } from "@/lib/intelligence/exploration";
import { buildIntelligence } from "@/lib/intelligence";

import { getRelationshipStrength } from "@/lib/config/thresholds";
import { getTopEntries } from "@/lib/utils/aggregation";

import { Creative } from "@/lib/types/creative";

import { TabNav, TabItem } from "@/components/ui/TabNav";
import { PatternCard } from "@/components/intelligence/PatternCard";

import {
  Signal,
  SignalTag,
  SignalTagGroup,
} from "@/components/intelligence/SignalTag";

import {
  ExplorationPanel,
  ExplorationData,
} from "@/components/intelligence/ExplorationPanel";

// ── Pattern explanations ──────────────────────────────────────

const PATTERN_EXPLANATIONS: Record<string, string> = {
  "curiosity + before-after":
    "Before-after creates strong visual contrast while curiosity sustains attention.",

  "urgency + problem-solution":
    "Urgency accelerates action while problem-solution clarifies value.",

  "fear + problem-solution":
    "Fear introduces risk while problem-solution resolves uncertainty.",

  "aspiration + before-after":
    "Aspiration visualizes transformation and outcome progression.",
};

// ── Strength styles ───────────────────────────────────────────

const STRENGTH_STYLES: Record<string, string> = {
  Dominant: "text-green-400",
  Strong: "text-blue-400",
  Emerging: "text-yellow-400",
  Weak: "text-gray-500",
};

// ── Tabs ──────────────────────────────────────────────────────

const TABS: TabItem[] = [
  { id: "overview", label: "Overview" },
  { id: "patterns", label: "Patterns" },
  { id: "structures", label: "Structures" },
  { id: "platforms", label: "Platforms" },
  { id: "library", label: "Library" },
];

// ── Section wrapper ───────────────────────────────────────────

function Section({
  title,
  children,
}: {
  title: string;
  children: React.ReactNode;
}) {
  return (
    <div className="mb-8 p-5 rounded-2xl bg-[#111] border border-gray-800">
      <h2 className="font-semibold text-base mb-5 text-white">
        {title}
      </h2>
      {children}
    </div>
  );
}

// ── Main Page ─────────────────────────────────────────────────

export default function GalleryPage() {
  const [creatives, setCreatives] = useState<Creative[]>([]);

  const [activeTab, setActiveTab] = useState("overview");

  const [expandedPattern, setExpandedPattern] =
    useState<string | null>(null);

  const [showAllStructures, setShowAllStructures] =
    useState(false);

  // ── Global Exploration State ─────────────────────────────

  const [explorationChain, setExplorationChain] = useState<
    Signal[]
  >([]);

  const [activeSignal, setActiveSignal] =
    useState<Signal | null>(null);

  // ── Filters ──────────────────────────────────────────────

  const [selectedEmotion, setSelectedEmotion] = useState("");
  const [selectedHook, setSelectedHook] = useState("");
  const [selectedPlatform, setSelectedPlatform] =
    useState("");

  // ── Filter options ───────────────────────────────────────

  const [allEmotions, setAllEmotions] = useState<string[]>(
    []
  );

  const [allHooks, setAllHooks] = useState<string[]>([]);

  const [allPlatforms, setAllPlatforms] = useState<
    string[]
  >([]);

  // ── Fetch ────────────────────────────────────────────────

  useEffect(() => {
    const fetchData = async () => {
      const { data, error } = await supabase
        .from("creatives")
        .select("*")
        .order("created_at", { ascending: false });

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
        item.emotion_tags?.forEach((e: string) =>
          emotions.add(e)
        );

        item.hook_types?.forEach((h: string) =>
          hooks.add(h)
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

  // ── Filtered creatives ───────────────────────────────────

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
        matchEmotion && matchHook && matchPlatform
      );
    });
  }, [
    creatives,
    selectedEmotion,
    selectedHook,
    selectedPlatform,
  ]);

  // ── Intelligence ─────────────────────────────────────────

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

  const {
    topPlatformPatterns,
    crossPlatformData,
  } = platform;

  const visibleStructures = showAllStructures
    ? sortedReinforcedStructures
    : filteredReinforcedStructures;

  // ── Pattern exploration ──────────────────────────────────

  const expandedPatternData = useMemo(
    () => buildPatternExploration(filtered, expandedPattern),
    [filtered, expandedPattern]
  );

  function handlePatternToggle(pattern: string) {
    setExpandedPattern((prev) =>
      prev === pattern ? null : pattern
    );
  }

  // ── Signal exploration ───────────────────────────────────

  function handleSignalExplore(signal: Signal) {
    setActiveSignal(signal);

    setExplorationChain((prev) => {
      const last = prev[prev.length - 1];

      if (
        last &&
        last.type === signal.type &&
        last.value === signal.value
      ) {
        return prev;
      }

      return [...prev, signal];
    });
  }

  function handleChainJump(index: number) {
    const signal = explorationChain[index];

    setActiveSignal(signal);

    setExplorationChain((prev) =>
      prev.slice(0, index + 1)
    );
  }

  function closeExploration() {
    setActiveSignal(null);
    setExplorationChain([]);
  }

  // ── Build exploration graph ──────────────────────────────

  const explorationData = useMemo<
    ExplorationData | null
  >(() => {
    if (!activeSignal) return null;

    const matchingCreatives = filtered.filter((item) => {
      switch (activeSignal.type) {
        case "emotion":
          return item.emotion_tags?.includes(
            activeSignal.value
          );

        case "hook":
          return item.hook_types?.includes(
            activeSignal.value
          );

        case "visual":
          return item.visual_styles?.includes(
            activeSignal.value
          );

        case "platform":
          return item.platform === activeSignal.value;

        case "niche":
          return item.niche === activeSignal.value;

        case "cta":
          return item.cta?.includes(activeSignal.value);

        default:
          return false;
      }
    });

    const aggregate = (
      values: string[]
    ): Record<string, number> => {
      return values.reduce((acc, value) => {
        acc[value] = (acc[value] || 0) + 1;
        return acc;
      }, {} as Record<string, number>);
    };

    return {
      matchingCreatives,

      emotions: aggregate(
        matchingCreatives.flatMap(
          (c) => c.emotion_tags || []
        )
      ),

      hooks: aggregate(
        matchingCreatives.flatMap(
          (c) => c.hook_types || []
        )
      ),

      visuals: aggregate(
        matchingCreatives.flatMap(
          (c) => c.visual_styles || []
        )
      ),

      ctas: aggregate(
        matchingCreatives
          .map((c) => c.cta)
          .filter(Boolean) as string[]
      ),

      niches: aggregate(
        matchingCreatives
          .map((c) => c.niche)
          .filter(Boolean) as string[]
      ),

      platforms: aggregate(
        matchingCreatives
          .map((c) => c.platform)
          .filter(Boolean) as string[]
      ),
    };
  }, [activeSignal, filtered]);

  // ── Tab counts ───────────────────────────────────────────

  const tabsWithCounts: TabItem[] = TABS.map((tab) => {
    if (tab.id === "patterns") {
      return {
        ...tab,
        count: topPatterns.length,
      };
    }

    if (tab.id === "structures") {
      return {
        ...tab,
        count: filteredReinforcedStructures.length,
      };
    }

    if (tab.id === "library") {
      return {
        ...tab,
        count: filtered.length,
      };
    }

    return tab;
  });
  
  // ── Render ────────────────────────────────────────────────

  return (
    <div className="min-h-screen bg-black text-white">
      <div className="max-w-4xl mx-auto px-6 py-10">

        {/* Header */}
        <div className="mb-8">
          <h1 className="text-2xl font-bold text-white">
            Intelligence
          </h1>
          <p className="text-sm text-gray-500 mt-1">
            {filtered.length} creatives · attention pattern analysis
          </p>
        </div>

        {/* Tab Navigation */}
        <TabNav
          tabs={tabsWithCounts}
          active={activeTab}
          onChange={setActiveTab}
        />

        {/* ── TAB: OVERVIEW ──────────────────────────────── */}

        {activeTab === "overview" && (
          <div className="space-y-6">

            {/* Summary stats */}
            <div className="grid grid-cols-3 gap-4">
              {[
                { label: "Top Emotion", value: topEmotion?.[0], count: topEmotion?.[1] },
                { label: "Top Hook", value: topHook?.[0], count: topHook?.[1] },
                { label: "Top Platform", value: topPlatform?.[0], count: topPlatform?.[1] },
              ].map((stat) => (
                <div
                  key={stat.label}
                  className="p-4 rounded-xl bg-[#111] border border-gray-800"
                >
                  <p className="text-xs text-gray-500 mb-1">{stat.label}</p>
                 <div className="mt-1">
                    {stat.value ? (
                      <SignalTag
                        value={stat.value}
                        type={
                          stat.label === "Top Emotion"
                            ? "emotion"
                            : stat.label === "Top Hook"
                            ? "hook"
                            : "platform"
                        }
                        onClick={handleSignalExplore}
                        size="md"
                      />
                    ) : (
                      <p className="text-sm text-gray-600">—</p>
                    )}
                  </div>
                  {stat.count !== undefined && (
                    <p className="text-xs text-gray-600 mt-0.5">
                      {stat.count} creatives
                    </p>
                  )}
                </div>
              ))}
            </div>

            {/* Top patterns preview */}
            <Section title="Top Patterns">
              <div className="space-y-2">
                {topPatterns.slice(0, 5).map(([pattern, count]) => {
                  const [emotion, hook] = pattern.split(" + ");
                  const strength = getRelationshipStrength(count);
                  return (
                    <div
                      key={pattern}
                      className="flex items-center justify-between py-2 border-b border-gray-800 last:border-0"
                    >
                     <div className="flex items-center gap-2 text-sm flex-wrap">
                        <SignalTag
                          value={emotion}
                          type="emotion"
                          onClick={handleSignalExplore}
                        />

                        <span className="text-gray-600">→</span>

                        <SignalTag
                          value={hook}
                          type="hook"
                          onClick={handleSignalExplore}
                        />
                      </div>
                      <div className="flex items-center gap-3">
                        <span
                          className={`text-xs ${STRENGTH_STYLES[strength] ?? "text-gray-500"}`}
                        >
                          {strength}
                        </span>
                        <span className="text-xs text-gray-600">
                          {count}×
                        </span>
                      </div>
                    </div>
                  );
                })}
              </div>
              {topPatterns.length > 5 && (
                <button
                  onClick={() => setActiveTab("patterns")}
                  className="mt-4 text-xs text-gray-500 hover:text-white transition"
                >
                  View all {topPatterns.length} patterns →
                </button>
              )}
            </Section>

            {/* Top reinforced structure preview */}
            {filteredReinforcedStructures.slice(0, 2).map((structure) => (
              <div
                key={structure.emotion}
                className="p-4 rounded-xl bg-[#111] border border-gray-800"
              >
                <div className="flex items-center justify-between mb-3">
                <SignalTag
                    value={structure.emotion}
                    type="emotion"
                    onClick={handleSignalExplore}
                    size="md"
                />
                  <p className="text-xs text-gray-600">
                    strength {structure.totalStrength}
                  </p>
                </div>
                <div className="flex flex-wrap gap-2">
                  {getTopEntries(structure.hooks, 3).map(([hook]) => (
                   <SignalTag
                      key={hook}
                      value={hook}
                      type="hook"
                      onClick={handleSignalExplore}
                    />
                  ))}
                </div>
              </div>
            ))}
            {filteredReinforcedStructures.length > 2 && (
              <button
                onClick={() => setActiveTab("structures")}
                className="text-xs text-gray-500 hover:text-white transition"
              >
                View all structures →
              </button>
            )}
          </div>
        )}

        {/* ── TAB: PATTERNS ──────────────────────────────── */}

        {activeTab === "patterns" && (
          <div className="space-y-3">
            {topPatterns.length === 0 && (
              <p className="text-sm text-gray-500">
                No repeating patterns detected yet.
              </p>
            )}
            {topPatterns.map(([pattern, count]) => (
              <PatternCard
                key={pattern}
                pattern={pattern}
                count={count}
                explanation={PATTERN_EXPLANATIONS[pattern]}
                isExpanded={expandedPattern === pattern}
                onToggle={() => handlePatternToggle(pattern)}
                explorationData={
                  expandedPattern === pattern ? expandedPatternData : null
                }
              />
            ))}
          </div>
        )}

        {/* ── TAB: STRUCTURES ────────────────────────────── */}

        {activeTab === "structures" && (
          <div className="space-y-6">

            {/* Reinforced Structures */}
            <div className="flex items-center justify-between mb-2">
              <h2 className="font-semibold text-base text-white">
                Reinforced Structures
              </h2>
              <button
                onClick={() => setShowAllStructures(!showAllStructures)}
                className="text-xs px-3 py-1 rounded-lg bg-gray-800 text-gray-400 hover:text-white transition"
              >
                {showAllStructures ? "Strong only" : "Show all"}
              </button>
            </div>

            <div className="space-y-4">
              {visibleStructures.map((structure) => (
                <div
                  key={structure.emotion}
                  className="p-4 rounded-xl bg-[#111] border border-gray-800"
                >
                  <div className="flex items-center justify-between mb-4">
                  <SignalTag
                      value={structure.emotion}
                      type="emotion"
                      onClick={handleSignalExplore}
                      size="md"
                  />
                    <p className="text-xs text-gray-600">
                      strength {structure.totalStrength}
                    </p>
                  </div>

                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <p className="text-xs text-gray-500 mb-2 uppercase tracking-wider">
                        Hooks
                      </p>
                      {getTopEntries(structure.hooks, 4).map(([hook, count]) => (
                        <div
                          key={hook}
                          className="flex items-center justify-between py-1"
                        >
                         <SignalTag
                            value={hook}
                            type="hook"
                            onClick={handleSignalExplore}
                          />
                          <span className="text-xs text-gray-600">{count}</span>
                        </div>
                      ))}
                    </div>
                    <div>
                      <p className="text-xs text-gray-500 mb-2 uppercase tracking-wider">
                        Visuals
                      </p>
                      {getTopEntries(structure.visuals, 4).map(([visual, count]) => (
                        <div
                          key={visual}
                          className="flex items-center justify-between py-1"
                        >
                          <span className="text-xs text-gray-300">{visual}</span>
                          <span className="text-xs text-gray-600">{count}</span>
                        </div>
                      ))}
                    </div>
                  </div>
                </div>
              ))}
            </div>

            {/* Relationships */}
            <div className="mt-8">
              <h2 className="font-semibold text-base text-white mb-5">
                Relationship Intelligence
              </h2>
              {Object.entries(groupedRelationships).map(([type, items]) => (
                <div key={type} className="mb-6">
                  <p className="text-xs text-gray-500 mb-3 uppercase tracking-wider">
                    {type}
                  </p>
                  <div className="space-y-2">
                    {items.map((item) => {
                      const strength = getRelationshipStrength(item.count);
                      return (
                        <div
                          key={`${item.left}-${item.right}`}
                          className="flex items-center justify-between py-2 border-b border-gray-800 last:border-0"
                        >
                         <div className="flex items-center gap-2 flex-wrap">
                            <SignalTag
                              value={item.left}
                              type="emotion"
                              onClick={handleSignalExplore}
                            />

                            <span className="text-gray-600 text-xs">↔</span>

                            <SignalTag
                              value={item.right}
                              type="hook"
                              onClick={handleSignalExplore}
                            />
                          </div>
                          <div className="flex items-center gap-3">
                            <span
                              className={`text-xs ${STRENGTH_STYLES[strength] ?? "text-gray-500"}`}
                            >
                              {strength}
                            </span>
                            <span className="text-xs text-gray-600">
                              {item.count}×
                            </span>
                          </div>
                        </div>
                      );
                    })}
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* ── TAB: PLATFORMS ─────────────────────────────── */}

        {activeTab === "platforms" && (
          <div className="space-y-6">

            {/* Platform cards */}
            <Section title="Platform Insights">
              <div className="grid grid-cols-2 gap-4">
                {topPlatformPatterns.map((item) => (
                  <div
                    key={item.platform}
                    className="p-4 rounded-xl border border-gray-800 bg-black"
                  >
                   <div className="mb-2">
                      <SignalTag
                        value={item.platform}
                        type="platform"
                        onClick={handleSignalExplore}
                        size="md"
                      />
                    </div>
                    <p className="text-xs text-gray-400 truncate">
                      {item.top ? item.top[0] : "No dominant pattern"}
                    </p>
                    <div className="flex items-center gap-2 mt-2">
                      <span
                        className={`text-xs ${STRENGTH_STYLES[item.label] ?? "text-gray-500"}`}
                      >
                        {item.label}
                      </span>
                      <span className="text-xs text-gray-600">
                        {item.percentage}%
                      </span>
                    </div>
                  </div>
                ))}
              </div>
            </Section>

            {/* Cross-platform */}
            <Section title="Cross-Platform Comparison">
              <div className="space-y-6">
                {crossPlatformData.slice(0, 4).map((group) => (
                  <div key={group.pattern}>
                    <p className="text-xs font-semibold text-white mb-3">
                      {group.pattern}
                    </p>
                    <div className="space-y-2">
                      {group.platforms.map((entry) => (
                        <div
                          key={entry.platform}
                          className="flex items-center justify-between"
                        >
                          <span className="text-xs text-gray-400 capitalize w-24">
                            {entry.platform}
                          </span>
                          <div className="flex-1 mx-3 h-1 bg-gray-800 rounded-full overflow-hidden">
                            <div
                              className="h-full bg-gray-500 rounded-full"
                              style={{ width: `${entry.percentage}%` }}
                            />
                          </div>
                          <span className="text-xs text-gray-600 w-8 text-right">
                            {entry.percentage}%
                          </span>
                        </div>
                      ))}
                    </div>
                  </div>
                ))}
              </div>
            </Section>

            {/* Taxonomy clusters */}
            <Section title="Taxonomy Clusters">
              <div className="space-y-3">
                {taxonomy.map(([cluster, data]) => (
                  <div
                    key={cluster}
                    className="p-3 rounded-xl border border-gray-800 bg-black"
                  >
                    <div className="flex items-center justify-between mb-1">
                      <p className="text-xs font-semibold text-white">
                        {cluster}
                      </p>
                      <span className="text-xs text-gray-600">
                        {data.count}
                      </span>
                    </div>
                    <p className="text-xs text-gray-500">
                      {data.patterns.join(" · ")}
                    </p>
                  </div>
                ))}
              </div>
            </Section>
          </div>
        )}

        {/* ── TAB: LIBRARY ───────────────────────────────── */}

        {activeTab === "library" && (
          <div>
            {/* Filters */}
            <div className="flex gap-3 mb-6 flex-wrap">
              <select
                onChange={(e) => setSelectedEmotion(e.target.value)}
                className="bg-[#111] border border-gray-800 text-sm text-gray-300 px-3 py-2 rounded-lg focus:outline-none focus:border-gray-600"
              >
                <option value="">All Emotions</option>
                {allEmotions.map((e) => (
                  <option key={e} value={e}>{e}</option>
                ))}
              </select>

              <select
                onChange={(e) => setSelectedHook(e.target.value)}
                className="bg-[#111] border border-gray-800 text-sm text-gray-300 px-3 py-2 rounded-lg focus:outline-none focus:border-gray-600"
              >
                <option value="">All Hooks</option>
                {allHooks.map((h) => (
                  <option key={h} value={h}>{h}</option>
                ))}
              </select>

              <select
                onChange={(e) => setSelectedPlatform(e.target.value)}
                className="bg-[#111] border border-gray-800 text-sm text-gray-300 px-3 py-2 rounded-lg focus:outline-none focus:border-gray-600"
              >
                <option value="">All Platforms</option>
                {allPlatforms.map((p) => (
                  <option key={p} value={p}>{p}</option>
                ))}
              </select>

              {(selectedEmotion || selectedHook || selectedPlatform) && (
                <button
                  onClick={() => {
                    setSelectedEmotion("");
                    setSelectedHook("");
                    setSelectedPlatform("");
                  }}
                  className="text-xs text-gray-500 hover:text-white transition px-3 py-2"
                >
                  Clear filters
                </button>
              )}
            </div>

            {/* Grid */}
            {filtered.length === 0 ? (
              <p className="text-sm text-gray-500">No creatives match these filters.</p>
            ) : (
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                {filtered.map((item) => (
                  <div
                    key={item.id}
                    className="bg-[#111] border border-gray-800 rounded-xl p-4 hover:border-gray-700 transition"
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

                    <h2 className="text-sm font-semibold text-white">
                      {item.title}
                    </h2>
                    <p className="text-xs text-gray-500 mt-0.5">{item.brand}</p>

                 <div className="mt-4 space-y-3">

                  <div>
                    <p className="text-[10px] uppercase tracking-wider text-gray-600 mb-1">
                      Emotions
                    </p>

                    <SignalTagGroup
                      values={item.emotion_tags || []}
                      type="emotion"
                      onTagClick={handleSignalExplore}
                    />
                  </div>

                  <div>
                    <p className="text-[10px] uppercase tracking-wider text-gray-600 mb-1">
                      Hooks
                    </p>

                    <SignalTagGroup
                      values={item.hook_types || []}
                      type="hook"
                      onTagClick={handleSignalExplore}
                    />
                  </div>

                  <div>
                    <p className="text-[10px] uppercase tracking-wider text-gray-600 mb-1">
                      Visuals
                    </p>

                    <SignalTagGroup
                      values={item.visual_styles || []}
                      type="visual"
                      onTagClick={handleSignalExplore}
                    />
                  </div>
                </div>

                    <p className="text-xs text-gray-700 mt-3 capitalize">
                      {item.platform} · {item.niche}
                    </p>
                  </div>
                ))}
              </div>
            )}
          </div>
        )}
{/* ── Persistent Exploration Panel ───────────────────── */}

          {activeSignal && (
            <ExplorationPanel
              chain={explorationChain}
              activeSignal={activeSignal}
              data={explorationData}
              onSignalClick={handleSignalExplore}
              onChainJump={handleChainJump}
              onClose={closeExploration}
            />
          )}
      </div>
    </div>
  );
}