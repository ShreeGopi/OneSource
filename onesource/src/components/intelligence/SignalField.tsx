"use client";

import { Signal, SignalType } from "./SignalTag";
import { getWeightedScore } from "@/lib/config/signalWeights";
import { RegionalIntelligence } from "@/lib/types/intelligence";

// ── Type-based colors (must match SignalTag) ─────────────────

const NODE_COLORS: Record<SignalType, string> = {
  emotion:  "bg-fuchsia-400",
  hook:     "bg-sky-400",
  visual:   "bg-teal-400",
  platform: "bg-zinc-400",
  niche:    "bg-amber-400",
  pattern:  "bg-violet-400",
  cta:      "bg-emerald-400",
};

const NODE_TEXT: Record<SignalType, string> = {
  emotion:  "text-fuchsia-200",
  hook:     "text-sky-200",
  visual:   "text-teal-200",
  platform: "text-zinc-200",
  niche:    "text-amber-200",
  pattern:  "text-violet-200",
  cta:      "text-emerald-200",
};

const NODE_BORDER: Record<SignalType, string> = {
  emotion:  "border-fuchsia-900/40",
  hook:     "border-sky-900/40",
  visual:   "border-teal-900/40",
  platform: "border-zinc-800",
  niche:    "border-amber-900/40",
  pattern:  "border-violet-900/40",
  cta:      "border-emerald-900/40",
};

const NODE_BG: Record<SignalType, string> = {
  emotion:  "bg-[#0f0a12]",
  hook:     "bg-[#0a1014]",
  visual:   "bg-[#091211]",
  platform: "bg-[#101010]",
  niche:    "bg-[#141006]",
  pattern:  "bg-[#110d18]",
  cta:      "bg-[#09120d]",
};

// ── Types ─────────────────────────────────────────────────────

export type SignalFieldItem = {
  value: string;
  type: SignalType;
  count: number;
  weightedScore?: number;
};

type SignalFieldProps = {
  items: SignalFieldItem[];
  onSignalClick?: (signal: Signal) => void;
  maxVisible?: number;
  label?: string;
};

// ── Weighted Signal Node ──────────────────────────────────────

function WeightedNode({
  item,
  weight,
  onClick,
}: {
  item: SignalFieldItem;
  weight: number; // 0–1
  onClick?: (signal: Signal) => void;
}) {
  const { value, type, count } = item;

  // Visual weight tiers
  const isDominant  = weight >= 0.85;
  const isStrong    = weight >= 0.55;
  // below 0.3 = weak/background

  // Opacity scales with weight — dominant is full, weak fades
  const opacity = Math.max(0.25, weight * 0.85 + 0.15);

  // Padding grows with weight
  const px = isDominant ? "px-3.5 py-2" : isStrong ? "px-3 py-1.5" : "px-2.5 py-1";

  // Text size scales with weight
  const fontSize = isDominant ? "text-xs" : "text-[11px]";

  // Dot size scales with weight
  const dotSize = isDominant
    ? "w-2.5 h-2.5"
    : isStrong
    ? "w-2 h-2"
    : "w-1.5 h-1.5";

  return (
    <button
      onClick={() => onClick?.({ type, value })}
      title={`Explore ${value} (${count})`}
      style={{ opacity }}
      className={`
        group relative overflow-hidden
        flex items-center gap-2
        border rounded-xl
        transition-all duration-200
        hover:opacity-100 hover:-translate-y-[1px]
        ${px}
        ${NODE_BG[type]}
        ${NODE_BORDER[type]}
      `}
    >
      {/* Top shimmer line */}
      <div className="absolute top-0 left-0 right-0 h-px bg-white/5" />

      {/* Node dot */}
      <div className="relative shrink-0">
        <div className={`rounded-full ${dotSize} ${NODE_COLORS[type]}`} />
        {isDominant && (
          <div
            className={`absolute inset-0 rounded-full ${NODE_COLORS[type]} opacity-20 animate-ping`}
          />
        )}
      </div>

      {/* Label */}
      <span className={`${fontSize} ${NODE_TEXT[type]} group-hover:text-white transition-colors`}>
        {value}
      </span>

      {/* Count badge — always visible but faded if not strong */}
      <span
        className={`text-[10px] tabular-nums transition-opacity ${
          isStrong ? "text-white/25" : "text-white/10 group-hover:opacity-100"
        }`}
      >
        {count}
      </span>

      {/* Subtle grid texture */}
      <div className="absolute inset-0 opacity-[0.03] pointer-events-none bg-[linear-gradient(to_right,white_1px,transparent_1px),linear-gradient(to_bottom,white_1px,transparent_1px)] bg-[size:6px_6px]" />
    </button>
  );
}

// ── Main Field ────────────────────────────────────────────────

export function SignalField({
  items,
  onSignalClick,
  maxVisible = 16,
  label,
}: SignalFieldProps) {
  if (!items || items.length === 0) return null;

  // Sort by weighted score (falls back to count)
  const sorted = [...items]
    .sort((a, b) =>
      (b.weightedScore ?? b.count) - (a.weightedScore ?? a.count)
    )
    .slice(0, maxVisible);

  const maxScore =
    sorted[0]?.weightedScore ?? sorted[0]?.count ?? 1;

  return (
    <div>
      {label && (
        <p className="text-[10px] text-gray-600 uppercase tracking-wider mb-2">
          {label}
        </p>
      )}
      <div className="flex flex-wrap gap-2 items-center">
        {sorted.map((item) => {
          const score = item.weightedScore ?? item.count;
          const weight = maxScore > 0 ? score / maxScore : 0;
          return (
            <WeightedNode
              key={`${item.type}-${item.value}`}
              item={item}
              weight={weight}
              onClick={onSignalClick}
            />
          );
        })}
      </div>
    </div>
  );
}

// ── Multi-type Signal Field ───────────────────────────────────
// Merges multiple signal maps into one weighted field.
// Applies semantic importance multipliers during merge.
// Used by ExplorationPanel to show all related signals at once.


function mapToItems(
  map: Record<string, number> | undefined,
  type: SignalType
): SignalFieldItem[] {
  if (!map) return [];

  return Object.entries(map).map(([value, count]) => ({
    value,
    type,
    count,
    weightedScore: getWeightedScore(count, type),
  }));
}

export function MergedSignalField({
  regions,
  onSignalClick,
}: {
  regions: RegionalIntelligence;
  onSignalClick?: (signal: Signal) => void;
}) {
  const regionsData = [
    {
      label: "Emotions",
      items: mapToItems(regions.behavioralDrivers, "emotion"),
    },
    {
      label: "Hooks",
      items: mapToItems(regions.persuasionMechanisms, "hook"),
    },
    {
      label: "Visual Style",
      items: mapToItems(regions.visualLanguage, "visual"),
    },
    {
      label: "Call to Action",
      items: mapToItems(regions.commercialIntent, "cta"),
    },
    {
      label: "Niche / Market",
      items: mapToItems(regions.niches, "niche"),
    },
    {
      label: "Platform",
      items: mapToItems(regions.platforms, "platform"),
    },
  ];

  return (
    <div className="space-y-6">
      {regionsData.map((region) => {
        // Deduplicate items within the region (especially important for distribution)
        const uniqueItems = Array.from(
          new Map(
            region.items.map((item) => [`${item.type}-${item.value}`, item])
          ).values()
        );

        if (uniqueItems.length === 0) return null;

        return (
          <SignalField
            key={region.label}
            label={region.label}
            items={uniqueItems}
            onSignalClick={onSignalClick}
            maxVisible={12}
          />
        );
      })}
    </div>
  );
}
