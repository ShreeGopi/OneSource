"use client";

import { useEffect, useMemo, useState } from "react";
import Image from "next/image";

import { supabase } from "@/lib/supabase";

import { buildPatternExploration } from "@/lib/intelligence/exploration";
import { buildIntelligence } from "@/lib/intelligence";
import { buildSignalExploration } from "@/lib/intelligence/signalExploration";

import { getRelationshipStrength } from "@/lib/config/thresholds";
import { getTopEntries } from "@/lib/utils/aggregation";
import { normalizeSignal } from "@/lib/signals/normalize";

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

const TOUR_STEPS = [
  {
    tab: "overview",
    title: "Overview",
    body: "Start here to see the strongest signals in the current dataset.",
  },
  {
    tab: "patterns",
    title: "Patterns",
    body: "Look here for repeated emotion + hook combinations.",
  },
  {
    tab: "structures",
    title: "Structures",
    body: "Use this to see what reinforces an emotional trigger.",
  },
  {
    tab: "platforms",
    title: "Platforms",
    body: "Compare how patterns behave across channels.",
  },
  {
    tab: "library",
    title: "Library",
    body: "Inspect the curated test dataset behind the analysis.",
  },
];

const TAB_HELP: Record<
  string,
  {
    title: string;
    body: string;
    benefit: string;
  }
> = {
  overview: {
    title: "Overview",
    body: "Shows the strongest signals and repeated patterns in the current dataset.",
    benefit:
      "Use it to quickly understand what kind of attention behavior is showing up most often.",
  },
  patterns: {
    title: "Patterns",
    body: "Shows emotion + hook combinations that repeat enough to become useful signals.",
    benefit:
      "Use it to spot creative structures that may be worth studying or reusing.",
  },
  structures: {
    title: "Structures",
    body: "Shows how emotions connect to hooks, visuals, CTAs, and niches.",
    benefit:
      "Use it to understand what reinforces an emotional trigger across creatives.",
  },
  platforms: {
    title: "Platforms",
    body: "Shows how patterns behave across environments like TikTok, Amazon, and landing pages.",
    benefit:
      "Use it to compare whether a pattern is broad or concentrated in a specific channel.",
  },
  library: {
    title: "Library",
    body: "Shows the underlying creative records used by the intelligence layer.",
    benefit:
      "Use it to inspect the source data behind the analysis and filter by signal type.",
  },
};

function normalizeExplorationSignal(
  signal: Signal
): Signal {
  if (signal.type === "pattern") {
    const [emotion, hook] =
      signal.value.split(" + ");

    return {
      type: signal.type,
      value: `${normalizeSignal(emotion)} + ${normalizeSignal(hook)}`,
    };
  }

  return {
    type: signal.type,
    value: normalizeSignal(signal.value),
  };
}

// ── Section wrapper ───────────────────────────────────────────

function Section({
  title,
  description,
  children,
}: {
  title: string;
  description?: string;
  children: React.ReactNode;
}) {
  return (
    <div className="mb-8 rounded-2xl border border-[#27362f] bg-[#141b17] p-5 shadow-sm shadow-black/20">
      <h2 className="mb-5 text-base font-semibold text-[#f4f0e8]">
        {title}
      </h2>
      {description && (
        <p className="mb-5 max-w-2xl text-sm leading-6 text-[#87968d]">
          {description}
        </p>
      )}
      {children}
    </div>
  );
}

// ── Main Page ─────────────────────────────────────────────────

export default function GalleryPage() {
  const [creatives, setCreatives] = useState<Creative[]>([]);

  const [activeTab, setActiveTab] = useState("overview");

  const [showTour, setShowTour] = useState(false);
  const [tourStep, setTourStep] = useState(0);

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
    const normalizedSignal =
      normalizeExplorationSignal(signal);

    if (
      activeSignal?.type === normalizedSignal.type &&
      activeSignal.value === normalizedSignal.value
    ) {
      return;
    }

    setActiveSignal(normalizedSignal);

    setExplorationChain((prev) => {
      // Check if this signal already exists in the chain
      const existingIndex = prev.findIndex(
        (s) =>
          s.type === normalizedSignal.type &&
          s.value === normalizedSignal.value
      );

      // If it exists, jump back (collapse the cycle)
      if (existingIndex !== -1) {
        return prev.slice(0, existingIndex + 1);
      }

      // Otherwise, append to traversal history
      return [...prev, normalizedSignal];
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

  function startTour() {
    setShowTour(true);
    setTourStep(0);
    setActiveTab(TOUR_STEPS[0].tab);
  }

  function goToTourStep(index: number) {
    setTourStep(index);
    setActiveTab(TOUR_STEPS[index].tab);
  }

  // ── Build exploration graph ──────────────────────────────

  const explorationData = useMemo<ExplorationData | null>(
    () => buildSignalExploration(filtered, activeSignal),
    [activeSignal, filtered]
  );

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

  const activeTourStep = TOUR_STEPS[tourStep];
  
  // ── Render ────────────────────────────────────────────────

  return (
    <div className="min-h-screen bg-[#0f1411] text-[#f4f0e8]">
      <div className="max-w-4xl mx-auto px-6 py-10">

        {/* Header */}
        <div className="mb-8">
          <h1 className="text-2xl font-bold text-[#f4f0e8]">
            Intelligence
          </h1>
          <p className="mt-1 text-sm text-[#7d8f84]">
            {filtered.length} creatives · attention pattern analysis
          </p>
        </div>

        <div className="mb-8 rounded-xl border border-[#27362f] bg-[#141b17] p-4 shadow-sm shadow-black/20">
          <div className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
            <div>
              <p className="text-sm font-semibold text-[#f4f0e8]">
                Intelligence workspace
              </p>
              <p className="mt-2 max-w-2xl text-sm leading-6 text-[#87968d]">
                Explore attention signals, repeated patterns, reinforced
                structures, platform behavior, and the creative library behind
                this analysis.
              </p>
            </div>
            <button
              type="button"
              onClick={startTour}
              className="w-fit rounded-lg border border-[#33463d] bg-[#19231e] px-3 py-2 text-xs font-semibold text-[#d9e4dc] transition hover:border-[#5f7c6c] hover:text-white"
            >
              Start quick tour
            </button>
          </div>
        </div>

        {/* Tab Navigation */}
        <TabNav
          tabs={tabsWithCounts}
          active={activeTab}
          onChange={setActiveTab}
        />

        <div className="mb-6 rounded-xl border border-[#24352d] bg-[#121914] px-4 py-3">
          <p className="text-sm leading-6 text-[#b9c7bd]">
            <span className="font-semibold text-[#c8e6d4]">
              {TAB_HELP[activeTab].title}:
            </span>{" "}
            {TAB_HELP[activeTab].body}
          </p>
          <p className="mt-1 text-xs leading-5 text-[#74867c]">
            {TAB_HELP[activeTab].benefit}
          </p>
        </div>

        {showTour && (
          <div className="pointer-events-none fixed inset-0 z-50">
            <div className="pointer-events-auto absolute bottom-5 left-5 w-[calc(100%-2.5rem)] max-w-sm rounded-2xl border border-[#3a5146] bg-[#f2eadf] p-5 text-[#17211b] shadow-2xl shadow-black/40">
              <div className="absolute -top-8 left-8 h-8 w-px bg-[#9fb7a8]" />
              <div className="absolute -top-10 left-[27px] h-3 w-3 rotate-45 border-l border-t border-[#9fb7a8]" />
              <div className="mb-5 flex items-start justify-between gap-4">
                <div>
                  <p className="text-xs uppercase tracking-[0.18em] text-[#6f8175]">
                    Quick tour {tourStep + 1} of {TOUR_STEPS.length}
                  </p>
                  <h2 className="mt-3 text-lg font-semibold text-[#17211b]">
                    {activeTourStep.title}
                  </h2>
                  <p className="mt-3 text-sm leading-6 text-[#4c5f54]">
                    {activeTourStep.body}
                  </p>
                  <p className="mt-3 text-xs leading-5 text-[#6f8175]">
                    The matching tab is active behind this card, so you can
                    inspect the section while moving through the tour.
                  </p>
                </div>
                <button
                  type="button"
                  onClick={() => setShowTour(false)}
                  className="text-xs font-semibold text-[#6f8175] transition hover:text-[#17211b]"
                >
                  Close
                </button>
              </div>

              <div className="mb-5 flex gap-1.5">
                {TOUR_STEPS.map((step, index) => (
                  <button
                    key={step.tab}
                    type="button"
                    onClick={() => goToTourStep(index)}
                    className={`h-1.5 flex-1 rounded-full transition ${
                      index === tourStep ? "bg-[#17211b]" : "bg-[#d9cfc0]"
                    }`}
                    aria-label={`Go to ${step.title}`}
                  />
                ))}
              </div>

              <div className="flex items-center justify-between gap-2">
                <button
                  type="button"
                  onClick={() => goToTourStep(tourStep - 1)}
                  disabled={tourStep === 0}
                  className="rounded-lg border border-[#d5c8b8] px-3 py-2 text-xs font-semibold text-[#53665b] transition hover:border-[#9fb7a8] hover:text-[#17211b] disabled:cursor-not-allowed disabled:opacity-40"
                >
                  Back
                </button>
                <div className="flex gap-2">
                  {tourStep < TOUR_STEPS.length - 1 ? (
                    <button
                      type="button"
                      onClick={() => goToTourStep(tourStep + 1)}
                      className="rounded-lg bg-[#17211b] px-4 py-2 text-xs font-semibold text-[#f2eadf] transition hover:bg-[#29382f]"
                    >
                      Next
                    </button>
                  ) : (
                    <button
                      type="button"
                      onClick={() => setShowTour(false)}
                      className="rounded-lg bg-[#17211b] px-4 py-2 text-xs font-semibold text-[#f2eadf] transition hover:bg-[#29382f]"
                    >
                      Finish
                    </button>
                  )}
                  <button
                    type="button"
                    onClick={() => setShowTour(false)}
                    className="rounded-lg border border-[#d5c8b8] px-3 py-2 text-xs font-semibold text-[#53665b] transition hover:border-[#9fb7a8] hover:text-[#17211b]"
                  >
                    Skip
                  </button>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* ── TAB: OVERVIEW ──────────────────────────────── */}

        {activeTab === "overview" && (
          <div className="space-y-6">
            <div className="rounded-xl border border-[#27362f] bg-[#141b17] p-4 shadow-sm shadow-black/20">
              <div className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
                <div>
                  <p className="text-sm font-semibold text-[#f4f0e8]">
                    Test dataset
                  </p>
                  <p className="mt-2 max-w-2xl text-sm leading-6 text-[#87968d]">
                    This view is currently using a curated test dataset. It does
                    not represent a live production dataset, but it is structured
                    like real ecommerce creative data to verify how OneSource
                    analyzes attention patterns.
                  </p>
                </div>
                <button
                  type="button"
                  onClick={() => setActiveTab("library")}
                  className="w-fit rounded-lg border border-[#33463d] bg-[#19231e] px-3 py-2 text-xs font-semibold text-[#d9e4dc] transition hover:border-[#5f7c6c] hover:text-white"
                >
                  View dataset
                </button>
              </div>
            </div>

            {/* Summary stats */}
            <div className="grid grid-cols-3 gap-4">
              {[
                { label: "Top Emotion", value: topEmotion?.[0], count: topEmotion?.[1] },
                { label: "Top Hook", value: topHook?.[0], count: topHook?.[1] },
                { label: "Top Platform", value: topPlatform?.[0], count: topPlatform?.[1] },
              ].map((stat) => (
                <div
                  key={stat.label}
                  className="rounded-xl border border-[#27362f] bg-[#141b17] p-4 shadow-sm shadow-black/20"
                >
                  <p className="mb-1 text-xs text-[#7d8f84]">{stat.label}</p>
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
                      <p className="text-sm text-[#5f7166]">—</p>
                    )}
                  </div>
                  {stat.count !== undefined && (
                    <p className="mt-0.5 text-xs text-[#6f8175]">
                      {stat.count} creatives
                    </p>
                  )}
                </div>
              ))}
            </div>

            {/* Top patterns preview */}
            <Section
              title="Top Patterns"
              description="Repeated combinations reveal creative structures that show up more than once in the dataset."
            >
              <div className="space-y-2">
                {topPatterns.slice(0, 5).map(([pattern, count]) => {
                  const [emotion, hook] = pattern.split(" + ");
                  const strength = getRelationshipStrength(count);
                  return (
                    <div
                      key={pattern}
                      className="flex items-center justify-between border-b border-[#27362f] py-2 last:border-0"
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
                        <span className="text-xs text-[#6f8175]">
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
                  className="mt-4 text-xs text-[#7d8f84] transition hover:text-[#f4f0e8]"
                >
                  View all {topPatterns.length} patterns →
                </button>
              )}
            </Section>

            {/* Top reinforced structure preview */}
            {filteredReinforcedStructures.slice(0, 2).map((structure) => (
              <div
                key={structure.emotion}
                className="rounded-xl border border-[#27362f] bg-[#141b17] p-4 shadow-sm shadow-black/20"
              >
                <div className="flex items-center justify-between mb-3">
                <SignalTag
                    value={structure.emotion}
                    type="emotion"
                    onClick={handleSignalExplore}
                    size="md"
                />
                  <p className="text-xs text-[#6f8175]">
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
              <h2 className="text-base font-semibold text-[#f4f0e8]">
                Reinforced Structures
              </h2>
              <button
                onClick={() => setShowAllStructures(!showAllStructures)}
                className="rounded-lg bg-[#19231e] px-3 py-1 text-xs text-[#9fb0a6] transition hover:text-[#f4f0e8]"
              >
                {showAllStructures ? "Strong only" : "Show all"}
              </button>
            </div>

            <div className="space-y-4">
              {visibleStructures.map((structure) => (
                <div
                  key={structure.emotion}
                  className="rounded-xl border border-[#27362f] bg-[#141b17] p-4 shadow-sm shadow-black/20"
                >
                  <div className="flex items-center justify-between mb-4">
                  <SignalTag
                      value={structure.emotion}
                      type="emotion"
                      onClick={handleSignalExplore}
                      size="md"
                  />
                    <p className="text-xs text-[#6f8175]">
                      strength {structure.totalStrength}
                    </p>
                  </div>

                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <p className="mb-2 text-xs uppercase tracking-wider text-[#7d8f84]">
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
                          <span className="text-xs text-[#6f8175]">{count}</span>
                        </div>
                      ))}
                    </div>
                    <div>
                      <p className="mb-2 text-xs uppercase tracking-wider text-[#7d8f84]">
                        Visuals
                      </p>
                      {getTopEntries(structure.visuals, 4).map(([visual, count]) => (
                        <div
                          key={visual}
                          className="flex items-center justify-between py-1"
                        >
                          <span className="text-xs text-[#cfd8d1]">{visual}</span>
                          <span className="text-xs text-[#6f8175]">{count}</span>
                        </div>
                      ))}
                    </div>
                  </div>
                </div>
              ))}
            </div>

            {/* Relationships */}
            <div className="mt-8">
              <h2 className="mb-5 text-base font-semibold text-[#f4f0e8]">
                Relationship Intelligence
              </h2>
              {Object.entries(groupedRelationships).map(([type, items]) => (
                <div key={type} className="mb-6">
                  <p className="mb-3 text-xs uppercase tracking-wider text-[#7d8f84]">
                    {type}
                  </p>
                  <div className="space-y-2">
                    {items.map((item) => {
                      const strength = getRelationshipStrength(item.count);
                      return (
                        <div
                          key={`${item.left}-${item.right}`}
                          className="flex items-center justify-between border-b border-[#27362f] py-2 last:border-0"
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
                            <span className="text-xs text-[#6f8175]">
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
            <Section
              title="Platform Insights"
              description="This keeps channel context separate from behavioral signals, so platforms do not compete with emotions or hooks."
            >
              <div className="grid grid-cols-2 gap-4">
                {topPlatformPatterns.map((item) => (
                  <div
                    key={item.platform}
                    className="rounded-xl border border-[#27362f] bg-[#101612] p-4"
                  >
                   <div className="mb-2">
                      <SignalTag
                        value={item.platform}
                        type="platform"
                        onClick={handleSignalExplore}
                        size="md"
                      />
                    </div>
                    <p className="truncate text-xs text-[#9fb0a6]">
                      {item.top ? item.top[0] : "No dominant pattern"}
                    </p>
                    <div className="flex items-center gap-2 mt-2">
                      <span
                        className={`text-xs ${STRENGTH_STYLES[item.label] ?? "text-gray-500"}`}
                      >
                        {item.label}
                      </span>
                      <span className="text-xs text-[#6f8175]">
                        {item.percentage}%
                      </span>
                    </div>
                  </div>
                ))}
              </div>
            </Section>

            {/* Cross-platform */}
            <Section
              title="Cross-Platform Comparison"
              description="Compare whether a repeated attention pattern is concentrated in one environment or distributed across several."
            >
              <div className="space-y-6">
                {crossPlatformData.slice(0, 4).map((group) => (
                  <div key={group.pattern}>
                    <p className="mb-3 text-xs font-semibold text-[#f4f0e8]">
                      {group.pattern}
                    </p>
                    <div className="space-y-2">
                      {group.platforms.map((entry) => (
                        <div
                          key={entry.platform}
                          className="flex items-center justify-between"
                        >
                          <span className="w-24 text-xs capitalize text-[#9fb0a6]">
                            {entry.platform}
                          </span>
                          <div className="mx-3 h-1 flex-1 overflow-hidden rounded-full bg-[#24352d]">
                            <div
                              className="h-full rounded-full bg-[#9fb7a8]"
                              style={{ width: `${entry.percentage}%` }}
                            />
                          </div>
                          <span className="w-8 text-right text-xs text-[#6f8175]">
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
                    className="rounded-xl border border-[#27362f] bg-[#101612] p-3"
                  >
                    <div className="flex items-center justify-between mb-1">
                      <p className="text-xs font-semibold text-[#f4f0e8]">
                        {cluster}
                      </p>
                      <span className="text-xs text-[#6f8175]">
                        {data.count}
                      </span>
                    </div>
                    <p className="text-xs text-[#87968d]">
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
                className="rounded-lg border border-[#27362f] bg-[#141b17] px-3 py-2 text-sm text-[#d9e4dc] focus:border-[#5f7c6c] focus:outline-none"
              >
                <option value="">All Emotions</option>
                {allEmotions.map((e) => (
                  <option key={e} value={e}>{e}</option>
                ))}
              </select>

              <select
                onChange={(e) => setSelectedHook(e.target.value)}
                className="rounded-lg border border-[#27362f] bg-[#141b17] px-3 py-2 text-sm text-[#d9e4dc] focus:border-[#5f7c6c] focus:outline-none"
              >
                <option value="">All Hooks</option>
                {allHooks.map((h) => (
                  <option key={h} value={h}>{h}</option>
                ))}
              </select>

              <select
                onChange={(e) => setSelectedPlatform(e.target.value)}
                className="rounded-lg border border-[#27362f] bg-[#141b17] px-3 py-2 text-sm text-[#d9e4dc] focus:border-[#5f7c6c] focus:outline-none"
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
                  className="px-3 py-2 text-xs text-[#7d8f84] transition hover:text-[#f4f0e8]"
                >
                  Clear filters
                </button>
              )}
            </div>

            {/* Grid */}
            {filtered.length === 0 ? (
              <p className="text-sm text-[#87968d]">No creatives match these filters.</p>
            ) : (
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                {filtered.map((item) => (
                  <div
                    key={item.id}
                    className="rounded-xl border border-[#27362f] bg-[#141b17] p-4 transition hover:border-[#5f7c6c]"
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

                    <h2 className="text-sm font-semibold text-[#f4f0e8]">
                      {item.title}
                    </h2>
                    <p className="mt-0.5 text-xs text-[#87968d]">{item.brand}</p>

                 <div className="mt-4 space-y-3">

                  <div>
                    <p className="mb-1 text-[10px] uppercase tracking-wider text-[#6f8175]">
                      Emotions
                    </p>

                    <SignalTagGroup
                      values={item.emotion_tags || []}
                      type="emotion"
                      onTagClick={handleSignalExplore}
                    />
                  </div>

                  <div>
                    <p className="mb-1 text-[10px] uppercase tracking-wider text-[#6f8175]">
                      Hooks
                    </p>

                    <SignalTagGroup
                      values={item.hook_types || []}
                      type="hook"
                      onTagClick={handleSignalExplore}
                    />
                  </div>

                  <div>
                    <p className="mb-1 text-[10px] uppercase tracking-wider text-[#6f8175]">
                      Visuals
                    </p>

                    <SignalTagGroup
                      values={item.visual_styles || []}
                      type="visual"
                      onTagClick={handleSignalExplore}
                    />
                  </div>
                </div>

                    <p className="mt-3 text-xs capitalize text-[#5f7166]">
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
