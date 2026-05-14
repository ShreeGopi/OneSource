"use client";

import { useCallback, useEffect, useMemo, useRef, useState } from "react";
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
import { ScopeIntro } from "@/components/ScopeIntro";

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
  Dominant: "text-[#3c6a4a]",
  Strong: "text-[#4f7475]",
  Emerging: "text-[#8a6424]",
  Weak: "text-[#8a8174]",
};

// ── Tabs ──────────────────────────────────────────────────────

const TABS: TabItem[] = [
  { id: "overview", label: "Overview" },
  { id: "patterns", label: "Patterns" },
  { id: "structures", label: "Structures" },
  { id: "platforms", label: "Platforms" },
  { id: "library", label: "Library" },
];

const TOUR_STEPS: {
  tab: string;
  focus: "tab" | "section";
  title: string;
  body: string;
}[] = [
  {
    tab: "overview",
    focus: "tab",
    title: "Overview",
    body: "Start with the current dataset summary.",
  },
  {
    tab: "overview",
    focus: "section",
    title: "Overview Signals",
    body: "Use this section to see which signals and patterns show up most often.",
  },
  {
    tab: "patterns",
    focus: "tab",
    title: "Patterns",
    body: "Open repeated emotion + hook combinations.",
  },
  {
    tab: "patterns",
    focus: "section",
    title: "Pattern Evidence",
    body: "Study combinations that repeat enough to become useful creative structures.",
  },
  {
    tab: "structures",
    focus: "tab",
    title: "Structures",
    body: "Move from signals into reinforcement.",
  },
  {
    tab: "structures",
    focus: "section",
    title: "Reinforcement Map",
    body: "See what supports an emotional trigger across hooks, visuals, CTAs, and niches.",
  },
  {
    tab: "platforms",
    focus: "tab",
    title: "Platforms",
    body: "Separate channel context from behavior.",
  },
  {
    tab: "platforms",
    focus: "section",
    title: "Platform Context",
    body: "Compare whether a pattern is broad or concentrated in one environment.",
  },
  {
    tab: "library",
    focus: "tab",
    title: "Library",
    body: "Inspect the records behind the analysis.",
  },
  {
    tab: "library",
    focus: "section",
    title: "Source Dataset",
    body: "Use the library to verify the creative records that power the intelligence layer.",
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
    <div className="mb-8 rounded-2xl border border-[#22201c]/8 bg-[#fffaf1]/76 p-5 shadow-sm shadow-[#22201c]/4">
      <h2 className="mb-5 text-base font-semibold text-[#22201c]">
        {title}
      </h2>
      {description && (
        <p className="mb-5 max-w-2xl text-sm leading-6 text-[#5f574f]">
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
  const [showScopeIntro, setShowScopeIntro] = useState(true);
  const tabNavRef = useRef<HTMLDivElement>(null);
  const tourSectionRef = useRef<HTMLDivElement>(null);
  const tourCardRef = useRef<HTMLDivElement>(null);
  const explorationPanelRef = useRef<HTMLDivElement>(null);

  const [activeTab, setActiveTab] = useState("overview");

  const [showTour, setShowTour] = useState(false);
  const [tourStep, setTourStep] = useState(0);
  const [tourSeen, setTourSeen] = useState(false);
  const [isMobileTour, setIsMobileTour] = useState(false);
  const [tourPosition, setTourPosition] = useState({
    top: 280,
    left: 24,
    anchorX: 24,
    anchorY: 280,
    lineEndX: 24,
    lineEndY: 280,
  });

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

  function scrollToExplorationPanel() {
    window.setTimeout(() => {
      explorationPanelRef.current?.scrollIntoView({
        behavior: "smooth",
        block: "start",
      });
    }, 0);
  }

  function handleSignalExplore(signal: Signal) {
    const normalizedSignal =
      normalizeExplorationSignal(signal);

    if (
      activeSignal?.type === normalizedSignal.type &&
      activeSignal.value === normalizedSignal.value
    ) {
      scrollToExplorationPanel();
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

    scrollToExplorationPanel();
  }

  function handleChainJump(index: number) {
    const signal = explorationChain[index];

    setActiveSignal(signal);

    setExplorationChain((prev) =>
      prev.slice(0, index + 1)
    );

    scrollToExplorationPanel();
  }

  function closeExploration() {
    setActiveSignal(null);
    setExplorationChain([]);
  }

  function startTour() {
    setShowTour(true);
    setTourSeen(false);
    setTourStep(0);
    setActiveTab(TOUR_STEPS[0].tab);
  }

  function goToTourStep(index: number) {
    setTourStep(index);
    setActiveTab(TOUR_STEPS[index].tab);
  }

  function closeTour() {
    setShowTour(false);
    setTourSeen(true);
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

  const getTourTarget = useCallback(() => {
    return activeTourStep.focus === "tab"
      ? tabNavRef.current?.querySelector<HTMLElement>(
          `[data-tab-id="${activeTourStep.tab}"]`
        )
      : tourSectionRef.current;
  }, [activeTourStep.focus, activeTourStep.tab]);

  useEffect(() => {
    function updateMobileTour() {
      setIsMobileTour(window.innerWidth < 640);
    }

    updateMobileTour();
    window.addEventListener("resize", updateMobileTour);

    return () => {
      window.removeEventListener("resize", updateMobileTour);
    };
  }, []);

  useEffect(() => {
    if (!showTour) return;

    function updateTourPosition() {
      const target = getTourTarget();

      if (!target) return;

      const rect = target.getBoundingClientRect();
      const cardWidth = Math.min(window.innerWidth - 32, 360);
      const cardHeight =
        tourCardRef.current?.getBoundingClientRect().height ?? 310;
      const gap = 22;
      const anchorX =
        activeTourStep.focus === "tab"
          ? rect.left + rect.width / 2
          : rect.right - 48;
      const anchorY =
        activeTourStep.focus === "tab" ? rect.bottom - 2 : rect.top + 2;
      const sectionLeft = rect.right - cardWidth - 28;
      const preferredLeft =
        activeTourStep.focus === "tab"
          ? anchorX - cardWidth / 2
          : sectionLeft;
      const left = Math.max(
        16,
        Math.min(preferredLeft, window.innerWidth - cardWidth - 16)
      );
      const preferredTop =
        activeTourStep.focus === "tab"
          ? anchorY + gap
          : rect.top + 12;
      const fallbackTop =
        activeTourStep.focus === "tab" ? anchorY - cardHeight - gap : rect.bottom + gap;
      const top =
        preferredTop >= 16 && preferredTop + cardHeight <= window.innerHeight - 16
          ? preferredTop
          : Math.max(16, Math.min(fallbackTop, window.innerHeight - cardHeight - 16));
      const cardIsBelow = top > anchorY;
      const lineEndX = Math.max(left + 28, Math.min(anchorX, left + cardWidth - 28));
      const lineEndY = cardIsBelow ? top : top + cardHeight;

      setTourPosition({
        top,
        left,
        anchorX,
        anchorY,
        lineEndX,
        lineEndY,
      });
    }

    const frame = window.requestAnimationFrame(() => {
      const target = getTourTarget();

      target?.scrollIntoView({
        behavior: "smooth",
        block: isMobileTour ? "center" : "nearest",
        inline: "center",
      });

      if (!isMobileTour) {
        window.requestAnimationFrame(updateTourPosition);
      }
    });

    if (isMobileTour) {
      return () => {
        window.cancelAnimationFrame(frame);
      };
    }

    window.addEventListener("resize", updateTourPosition);
    window.addEventListener("scroll", updateTourPosition, true);

    return () => {
      window.cancelAnimationFrame(frame);
      window.removeEventListener("resize", updateTourPosition);
      window.removeEventListener("scroll", updateTourPosition, true);
    };
  }, [activeTourStep, getTourTarget, isMobileTour, showTour]);
  
  // ── Render ────────────────────────────────────────────────

  return (
    <div className="min-h-screen bg-[#f5f1e8] text-[#22201c]">
      {showScopeIntro ? (
        <ScopeIntro
          eyebrow="Current workspace"
          title="You are entering the ecommerce creative workspace."
          body="OneSource can study attention broadly. Right now, this workspace focuses on ecommerce because the signals are clear enough to compare."
          detail="You will explore hooks, emotions, visuals, CTAs, platforms, and niches from the current dataset."
          onPrimaryClick={() => setShowScopeIntro(false)}
          primaryLabel="Open intelligence workspace"
        />
      ) : (
        <div
          id="intelligence-workspace"
          className="mx-auto min-h-screen max-w-5xl px-6 py-10"
          style={{
            backgroundImage:
              "linear-gradient(rgba(34,32,28,0.032) 1px, transparent 1px), linear-gradient(90deg, rgba(34,32,28,0.032) 1px, transparent 1px)",
            backgroundSize: "28px 28px",
          }}
        >

        {/* Header */}
        <div className="mb-6">
          <p className="mb-2 text-[10px] uppercase tracking-[0.22em] text-[#7c7265]">
            Attention Workspace
          </p>
          <h1 className="text-2xl font-bold text-[#22201c]">
            Intelligence
          </h1>
          <p className="mt-1 text-sm text-[#5f574f]">
            {filtered.length} creatives - attention pattern analysis
          </p>
        </div>

        <div className="mb-6 rounded-xl border border-[#22201c]/8 bg-[#fffaf1]/76 p-4 shadow-sm shadow-[#22201c]/4">
          <div className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
            <div>
              <p className="text-sm font-semibold text-[#22201c]">
                Intelligence workspace
              </p>
              <p className="mt-2 max-w-2xl text-sm leading-6 text-[#5f574f]">
                Explore attention signals, repeated patterns, reinforced
                structures, platform behavior, and the creative library behind
                this analysis.
              </p>
            </div>
            <button
              type="button"
              onClick={startTour}
              disabled={showTour}
              className={`w-fit rounded-lg border px-3 py-2 text-xs font-semibold transition ${
                showTour
                  ? "cursor-default border-[#22201c]/10 bg-[#e9e1d4] text-[#7c7265]"
                  : "border-[#22201c]/20 bg-[#22201c] text-[#fffaf1] hover:-translate-y-px hover:bg-[#3a352d] hover:shadow-md hover:shadow-[#22201c]/10"
              }`}
            >
              {showTour ? "Tour running" : tourSeen ? "Restart tour" : "Start quick tour"}
            </button>
          </div>
        </div>

        {/* Tab Navigation */}
        <div ref={tabNavRef}>
          <TabNav
            tabs={tabsWithCounts}
            active={activeTab}
            onChange={setActiveTab}
          />
        </div>

        <div
          ref={tourSectionRef}
          className="mb-5 rounded-xl border border-[#22201c]/8 bg-[#fffaf1]/76 px-4 py-3 shadow-sm shadow-[#22201c]/4"
        >
          <p className="text-sm leading-6 text-[#2f2a24]">
            <span className="font-semibold text-[#22201c]">
              {TAB_HELP[activeTab].title}:
            </span>{" "}
            {TAB_HELP[activeTab].body}
          </p>
          <p className="mt-1 text-xs leading-5 text-[#5f574f]">
            {TAB_HELP[activeTab].benefit}
          </p>
        </div>

        {showTour && (
          <div className="pointer-events-none fixed inset-0 z-50">
            {!isMobileTour && (
            <svg className="fixed inset-0 h-full w-full" aria-hidden="true">
              <line
                x1={tourPosition.anchorX}
                y1={tourPosition.anchorY}
                x2={tourPosition.lineEndX}
                y2={tourPosition.lineEndY}
                stroke="#22201c"
                strokeWidth="2"
                strokeLinecap="round"
              />
              <circle
                cx={tourPosition.anchorX}
                cy={tourPosition.anchorY}
                r="7"
                fill="#22201c"
                opacity="0.16"
              >
                <animate
                  attributeName="r"
                  values="6;11;6"
                  dur="1.6s"
                  repeatCount="indefinite"
                />
                <animate
                  attributeName="opacity"
                  values="0.2;0.04;0.2"
                  dur="1.6s"
                  repeatCount="indefinite"
                />
              </circle>
              <circle
                cx={tourPosition.anchorX}
                cy={tourPosition.anchorY}
                r="4"
                fill="#22201c"
              />
              <circle
                cx={tourPosition.lineEndX}
                cy={tourPosition.lineEndY}
                r="4"
                fill="#22201c"
              />
            </svg>
            )}
            <div
              ref={tourCardRef}
              className={`pointer-events-auto fixed rounded-2xl border border-[#22201c]/12 bg-[#fffaf1] p-4 text-[#22201c] shadow-xl shadow-[#22201c]/12 ${
                isMobileTour
                  ? "inset-x-3 bottom-3"
                  : "w-[calc(100%-2rem)] max-w-[360px]"
              }`}
              style={
                isMobileTour
                  ? undefined
                  : {
                      top: tourPosition.top,
                      left: tourPosition.left,
                    }
              }
            >
              <div className="mb-4 flex items-start justify-between gap-4">
                <div>
                  <p className="text-xs uppercase tracking-[0.18em] text-[#7c7265]">
                    Quick tour {tourStep + 1} of {TOUR_STEPS.length}
                  </p>
                  <h2 className="mt-3 text-lg font-semibold text-[#22201c]">
                    {activeTourStep.title}
                  </h2>
                  <p className="mt-3 text-sm leading-6 text-[#465a50]">
                    {activeTourStep.body}
                  </p>
                  <p className="mt-3 text-xs leading-5 text-[#5f574f] sm:block">
                    {activeTourStep.focus === "tab"
                      ? "This points to the tab you are entering."
                      : "This points to the section that explains how to use it."}
                  </p>
                </div>
                <button
                  type="button"
                  onClick={closeTour}
                  className="text-xs font-semibold text-[#7c7265] transition hover:text-[#22201c]"
                >
                  Close
                </button>
              </div>

              <div className="mb-5 flex gap-1.5">
                {TOUR_STEPS.map((step, index) => (
                  <button
                    key={`${step.tab}-${step.focus}-${index}`}
                    type="button"
                    onClick={() => goToTourStep(index)}
                    className={`h-1.5 flex-1 rounded-full transition ${
                      index === tourStep ? "bg-[#22201c]" : "bg-[#e1d9cd]"
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
                  className="rounded-lg border border-[#22201c]/15 px-3 py-2 text-xs font-semibold text-[#5f574f] transition hover:border-[#7f9f94] hover:text-[#22201c] disabled:cursor-not-allowed disabled:opacity-40"
                >
                  Back
                </button>
                <div className="flex gap-2">
                  {tourStep < TOUR_STEPS.length - 1 ? (
                    <button
                      type="button"
                      onClick={() => goToTourStep(tourStep + 1)}
                      className="rounded-lg bg-[#22201c] px-4 py-2 text-xs font-semibold text-[#fffaf1] transition hover:bg-[#3a352d]"
                    >
                      Next
                    </button>
                  ) : (
                    <button
                      type="button"
                      onClick={closeTour}
                      className="rounded-lg bg-[#22201c] px-4 py-2 text-xs font-semibold text-[#fffaf1] transition hover:bg-[#3a352d]"
                    >
                      Finish
                    </button>
                  )}
                  <button
                    type="button"
                    onClick={closeTour}
                    className="rounded-lg border border-[#22201c]/15 px-3 py-2 text-xs font-semibold text-[#5f574f] transition hover:border-[#7f9f94] hover:text-[#22201c]"
                  >
                    Close
                  </button>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* ── TAB: OVERVIEW ──────────────────────────────── */}

        {activeTab === "overview" && (
          <div className="space-y-5">
            <div className="rounded-xl border border-[#22201c]/8 bg-[#fffaf1]/76 p-4 shadow-sm shadow-[#22201c]/4">
              <div className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
                <div>
                  <p className="text-sm font-semibold text-[#22201c]">
                    Test dataset
                  </p>
                  <p className="mt-2 max-w-2xl text-sm leading-6 text-[#5f574f]">
                    This view is currently using a curated test dataset. It does
                    not represent a live production dataset, but it is structured
                    like real ecommerce creative data to verify how OneSource
                    analyzes attention patterns.
                  </p>
                </div>
                <button
                  type="button"
                  onClick={() => setActiveTab("library")}
                  className="w-fit rounded-lg border border-[#22201c]/20 bg-[#22201c] px-3 py-2 text-xs font-semibold text-[#fffaf1] transition hover:-translate-y-px hover:bg-[#3a352d] hover:shadow-md hover:shadow-[#22201c]/10"
                >
                  View dataset
                </button>
              </div>
            </div>

            {/* Summary stats */}
            <div className="grid grid-cols-1 gap-4 sm:grid-cols-3">
              {[
                { label: "Top Emotion", value: topEmotion?.[0], count: topEmotion?.[1] },
                { label: "Top Hook", value: topHook?.[0], count: topHook?.[1] },
                { label: "Top Platform", value: topPlatform?.[0], count: topPlatform?.[1] },
              ].map((stat) => (
                <div
                  key={stat.label}
                  className="rounded-xl border border-[#22201c]/8 bg-[#fffaf1]/76 p-4 shadow-sm shadow-[#22201c]/4"
                >
                  <p className="mb-1 text-xs text-[#7c7265]">{stat.label}</p>
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
                      <p className="text-sm text-[#8a8174]">—</p>
                    )}
                  </div>
                  {stat.count !== undefined && (
                    <p className="mt-0.5 text-xs text-[#7c7265]">
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
                      className="flex items-center justify-between border-b border-[#22201c]/10 py-2 last:border-0"
                    >
                     <div className="flex items-center gap-2 text-sm flex-wrap">
                        <SignalTag
                          value={emotion}
                          type="emotion"
                          onClick={handleSignalExplore}
                        />

                        <span className="text-[#8a8174]">→</span>

                        <SignalTag
                          value={hook}
                          type="hook"
                          onClick={handleSignalExplore}
                        />
                      </div>
                      <div className="flex items-center gap-3">
                        <span
                          className={`text-xs ${STRENGTH_STYLES[strength] ?? "text-[#8a8174]"}`}
                        >
                          {strength}
                        </span>
                        <span className="text-xs text-[#7c7265]">
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
                  className="mt-4 text-xs text-[#7c7265] transition hover:text-[#22201c]"
                >
                  View all {topPatterns.length} patterns →
                </button>
              )}
            </Section>

            {/* Top reinforced structure preview */}
            {filteredReinforcedStructures.slice(0, 2).map((structure) => (
              <div
                key={structure.emotion}
                className="rounded-xl border border-[#22201c]/8 bg-[#fffaf1]/76 p-4 shadow-sm shadow-[#22201c]/4"
              >
                <div className="flex items-center justify-between mb-3">
                <SignalTag
                    value={structure.emotion}
                    type="emotion"
                    onClick={handleSignalExplore}
                    size="md"
                />
                  <p className="text-xs text-[#7c7265]">
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
                className="text-xs text-[#7c7265] transition hover:text-[#22201c]"
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
              <p className="text-sm text-[#7c7265]">
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
              <h2 className="text-base font-semibold text-[#22201c]">
                Reinforced Structures
              </h2>
              <button
                onClick={() => setShowAllStructures(!showAllStructures)}
                className="rounded-lg border border-[#22201c]/8 bg-[#fffaf1]/76 px-3 py-1 text-xs text-[#5f574f] transition hover:border-[#22201c]/25 hover:text-[#22201c]"
              >
                {showAllStructures ? "Strong only" : "Show all"}
              </button>
            </div>

            <div className="space-y-4">
              {visibleStructures.map((structure) => (
                <div
                  key={structure.emotion}
                  className="rounded-xl border border-[#22201c]/8 bg-[#fffaf1]/76 p-4 shadow-sm shadow-[#22201c]/4"
                >
                  <div className="flex items-center justify-between mb-4">
                  <SignalTag
                      value={structure.emotion}
                      type="emotion"
                      onClick={handleSignalExplore}
                      size="md"
                  />
                    <p className="text-xs text-[#7c7265]">
                      strength {structure.totalStrength}
                    </p>
                  </div>

                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <p className="mb-2 text-xs uppercase tracking-wider text-[#7c7265]">
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
                          <span className="text-xs text-[#7c7265]">{count}</span>
                        </div>
                      ))}
                    </div>
                    <div>
                      <p className="mb-2 text-xs uppercase tracking-wider text-[#7c7265]">
                        Visuals
                      </p>
                      {getTopEntries(structure.visuals, 4).map(([visual, count]) => (
                        <div
                          key={visual}
                          className="flex items-center justify-between py-1"
                        >
                          <span className="text-xs text-[#3a352d]">{visual}</span>
                          <span className="text-xs text-[#7c7265]">{count}</span>
                        </div>
                      ))}
                    </div>
                  </div>
                </div>
              ))}
            </div>

            {/* Relationships */}
            <div className="mt-8">
              <h2 className="mb-5 text-base font-semibold text-[#22201c]">
                Relationship Intelligence
              </h2>
              {Object.entries(groupedRelationships).map(([type, items]) => (
                <div key={type} className="mb-6">
                  <p className="mb-3 text-xs uppercase tracking-wider text-[#7c7265]">
                    {type}
                  </p>
                  <div className="space-y-2">
                    {items.map((item) => {
                      const strength = getRelationshipStrength(item.count);
                      return (
                        <div
                          key={`${item.left}-${item.right}`}
                          className="flex items-center justify-between border-b border-[#22201c]/10 py-2 last:border-0"
                        >
                         <div className="flex items-center gap-2 flex-wrap">
                            <SignalTag
                              value={item.left}
                              type="emotion"
                              onClick={handleSignalExplore}
                            />

                            <span className="text-xs text-[#8a8174]">↔</span>

                            <SignalTag
                              value={item.right}
                              type="hook"
                              onClick={handleSignalExplore}
                            />
                          </div>
                          <div className="flex items-center gap-3">
                            <span
                              className={`text-xs ${STRENGTH_STYLES[strength] ?? "text-[#8a8174]"}`}
                            >
                              {strength}
                            </span>
                            <span className="text-xs text-[#7c7265]">
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
                    className="rounded-xl border border-[#22201c]/8 bg-[#fffaf1]/76 p-4 shadow-sm shadow-[#22201c]/4"
                  >
                   <div className="mb-2">
                      <SignalTag
                        value={item.platform}
                        type="platform"
                        onClick={handleSignalExplore}
                        size="md"
                      />
                    </div>
                    <p className="truncate text-xs text-[#5f574f]">
                      {item.top ? item.top[0] : "No dominant pattern"}
                    </p>
                    <div className="flex items-center gap-2 mt-2">
                      <span
                        className={`text-xs ${STRENGTH_STYLES[item.label] ?? "text-[#8a8174]"}`}
                      >
                        {item.label}
                      </span>
                      <span className="text-xs text-[#7c7265]">
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
                    <p className="mb-3 text-xs font-semibold text-[#22201c]">
                      {group.pattern}
                    </p>
                    <div className="space-y-2">
                      {group.platforms.map((entry) => (
                        <div
                          key={entry.platform}
                          className="flex items-center justify-between"
                        >
                          <span className="w-24 text-xs capitalize text-[#5f574f]">
                            {entry.platform}
                          </span>
                          <div className="mx-3 h-1 flex-1 overflow-hidden rounded-full bg-[#e1d9cd]">
                            <div
                              className="h-full rounded-full bg-[#7f9f94]"
                              style={{ width: `${entry.percentage}%` }}
                            />
                          </div>
                          <span className="w-8 text-right text-xs text-[#7c7265]">
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
                    className="rounded-xl border border-[#22201c]/8 bg-[#fffaf1]/76 p-3 shadow-sm shadow-[#22201c]/4"
                  >
                    <div className="flex items-center justify-between mb-1">
                      <p className="text-xs font-semibold text-[#22201c]">
                        {cluster}
                      </p>
                      <span className="text-xs text-[#7c7265]">
                        {data.count}
                      </span>
                    </div>
                    <p className="text-xs text-[#5f574f]">
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
                className="rounded-lg border border-[#22201c]/12 bg-[#fffaf1]/78 px-3 py-2 text-sm text-[#3a352d] focus:border-[#7f9f94] focus:outline-none"
              >
                <option value="">All Emotions</option>
                {allEmotions.map((e) => (
                  <option key={e} value={e}>{e}</option>
                ))}
              </select>

              <select
                onChange={(e) => setSelectedHook(e.target.value)}
                className="rounded-lg border border-[#22201c]/12 bg-[#fffaf1]/78 px-3 py-2 text-sm text-[#3a352d] focus:border-[#7f9f94] focus:outline-none"
              >
                <option value="">All Hooks</option>
                {allHooks.map((h) => (
                  <option key={h} value={h}>{h}</option>
                ))}
              </select>

              <select
                onChange={(e) => setSelectedPlatform(e.target.value)}
                className="rounded-lg border border-[#22201c]/12 bg-[#fffaf1]/78 px-3 py-2 text-sm text-[#3a352d] focus:border-[#7f9f94] focus:outline-none"
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
                  className="px-3 py-2 text-xs text-[#7c7265] transition hover:text-[#22201c]"
                >
                  Clear filters
                </button>
              )}
            </div>

            {/* Grid */}
            {filtered.length === 0 ? (
              <p className="text-sm text-[#5f574f]">No creatives match these filters.</p>
            ) : (
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                {filtered.map((item) => (
                  <div
                    key={item.id}
                    className="rounded-xl border border-[#22201c]/8 bg-[#fffaf1]/76 p-4 shadow-sm shadow-[#22201c]/4 transition hover:border-[#7f9f94]"
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

                    <h2 className="text-sm font-semibold text-[#22201c]">
                      {item.title}
                    </h2>
                    <p className="mt-0.5 text-xs text-[#5f574f]">{item.brand}</p>

                 <div className="mt-4 space-y-3">

                  <div>
                    <p className="mb-1 text-[10px] uppercase tracking-wider text-[#7c7265]">
                      Emotions
                    </p>

                    <SignalTagGroup
                      values={item.emotion_tags || []}
                      type="emotion"
                      onTagClick={handleSignalExplore}
                    />
                  </div>

                  <div>
                    <p className="mb-1 text-[10px] uppercase tracking-wider text-[#7c7265]">
                      Hooks
                    </p>

                    <SignalTagGroup
                      values={item.hook_types || []}
                      type="hook"
                      onTagClick={handleSignalExplore}
                    />
                  </div>

                  <div>
                    <p className="mb-1 text-[10px] uppercase tracking-wider text-[#7c7265]">
                      Visuals
                    </p>

                    <SignalTagGroup
                      values={item.visual_styles || []}
                      type="visual"
                      onTagClick={handleSignalExplore}
                    />
                  </div>
                </div>

                    <p className="mt-3 text-xs capitalize text-[#7c7265]">
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
            <div ref={explorationPanelRef}>
              <ExplorationPanel
                chain={explorationChain}
                activeSignal={activeSignal}
                data={explorationData}
                onSignalClick={handleSignalExplore}
                onChainJump={handleChainJump}
                onClose={closeExploration}
              />
            </div>
          )}
        </div>
      )}
    </div>
  );
}
