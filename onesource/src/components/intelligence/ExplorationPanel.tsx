"use client";

import { Signal, SignalTag, SignalType } from "./SignalTag";
import { MergedSignalField, SignalFieldItem } from "./SignalField";
import { Creative } from "@/lib/types/creative";
import { getWeightedScore } from "@/lib/config/signalWeights";
import { ExplorationData } from "@/lib/types/intelligence";

// ── Types ─────────────────────────────────────────────────────


// ── Breadcrumb chain ──────────────────────────────────────────

function ExplorationChain({
  chain,
  onJump,
}: {
  chain: Signal[];
  onJump: (index: number) => void;
}) {
  if (chain.length <= 1) return null;

  return (
    <div className="flex items-center gap-1 flex-wrap">
      {chain.map((signal, i) => {
        const isActive = i === chain.length - 1;

        return (
          <span
            key={`${signal.type}-${signal.value}-${i}`}
            className="flex items-center gap-1"
          >
            <button
              onClick={() => onJump(i)}
              className={`text-xs px-1.5 py-0.5 rounded transition-all ${isActive
                ? "text-white font-medium"
                : "text-gray-600 hover:text-gray-400"
                }`}
            >
              {signal.value}
            </button>

            {!isActive && (
              <span className="text-gray-800 text-xs">→</span>
            )}
          </span>
        );
      })}
    </div>
  );
}

// ── Matching creatives strip ──────────────────────────────────

function CreativesStrip({
  creatives,
  onSignalClick,
}: {
  creatives: Creative[];
  onSignalClick: (signal: Signal) => void;
}) {
  if (creatives.length === 0) return null;

  const visible = creatives.slice(0, 6);

  return (
    <div className="border-t border-gray-800/60 pt-4">
      <p className="text-[10px] text-gray-600 uppercase tracking-wider mb-3">
        {creatives.length} matching creative
        {creatives.length !== 1 ? "s" : ""}
      </p>

      <div className="grid grid-cols-2 md:grid-cols-3 gap-2">
        {visible.map((item) => (
          <div
            key={item.id}
            className="bg-black/60 border border-gray-800/60 rounded-lg p-3 hover:border-gray-700 transition"
          >
            <p className="text-xs font-medium text-white truncate">
              {item.title}
            </p>

            {(item.emotion_tags?.length ?? 0) > 0 && (
              <div className="flex flex-wrap gap-1 mt-2">
                {item.emotion_tags?.slice(0, 2).map((tag) => (
                  <SignalTag
                    key={tag}
                    value={tag}
                    type="emotion"
                    onClick={onSignalClick}
                  />
                ))}
              </div>
            )}

            <p className="text-[10px] text-gray-700 mt-2 capitalize">
              {[item.platform, item.niche]
                .filter(Boolean)
                .join(" · ")}
            </p>
          </div>
        ))}
      </div>
    </div>
  );
}

// ── Main Panel ────────────────────────────────────────────────

type ExplorationPanelProps = {
  chain: Signal[];
  activeSignal: Signal;
  data: ExplorationData | null;
  onSignalClick: (signal: Signal) => void;
  onChainJump: (index: number) => void;
  onClose: () => void;
};

export function ExplorationPanel({
  chain,
  activeSignal,
  data,
  onSignalClick,
  onChainJump,
  onClose,
}: ExplorationPanelProps) {
  const matchCount = data?.matchingCreatives.length ?? 0;

  const hasData =
    !!data &&
    Object.values(data.regions).some(
      (region) => Object.keys(region).length > 0
    );

  // ── Strongest RELATED co-signal ────────────────────────────
  // Uses semantic weighting. Excludes currently active signal.
  // Behavioral signals surface. Infrastructural signals recede.

  const dominantSignal: SignalFieldItem | null = (() => {
    if (!data) return null;

    const all: SignalFieldItem[] = [
      ...Object.entries(data.regions.behavioralDrivers).map(([v, c]) => ({
        value: v,
        type: "emotion" as SignalType,
        count: c,
        weightedScore: getWeightedScore(c, "emotion"),
      })),

      ...Object.entries(data.regions.persuasionMechanisms).map(([v, c]) => ({
        value: v,
        type: "hook" as SignalType,
        count: c,
        weightedScore: getWeightedScore(c, "hook"),
      })),

      ...Object.entries(data.regions.visualLanguage).map(([v, c]) => ({
        value: v,
        type: "visual" as SignalType,
        count: c,
        weightedScore: getWeightedScore(c, "visual"),
      })),

      ...Object.entries(data.regions.commercialIntent).map(([v, c]) => ({
        value: v,
        type: "cta" as SignalType,
        count: c,
        weightedScore: getWeightedScore(c, "cta"),
      })),

      ...Object.entries(data.regions.platforms).map(([v, c]) => ({
        value: v,
        type: "platform" as SignalType,
        count: c,
        weightedScore: getWeightedScore(c, "platform"),
      })),

      ...Object.entries(data.regions.niches).map(([v, c]) => ({
        value: v,
        type: "niche" as SignalType,
        count: c,
        weightedScore: getWeightedScore(c, "niche"),
      })),
    ];

    const filtered = all.filter(
      (item) =>
        !(
          item.value === activeSignal.value &&
          item.type === activeSignal.type
        )
    );

    // Sort by weighted score — behavioral signals rise
    filtered.sort((a, b) =>
      (b.weightedScore ?? b.count) - (a.weightedScore ?? a.count)
    );

    // Threshold uses weighted score
    const topScore = filtered[0]?.weightedScore ?? filtered[0]?.count ?? 0;
    return topScore >= 1.5 ? filtered[0] : null;
  })();

  return (
    <div className="mt-8 rounded-2xl border border-gray-700/60 bg-[#080808] overflow-hidden">

      {/* Header */}

      <div className="flex items-center justify-between px-5 py-4 border-b border-gray-800/60">
        <div className="flex items-center gap-3 flex-wrap">
          <span className="text-[10px] text-gray-600 uppercase tracking-wider">
            Exploring
          </span>

          <SignalTag
            value={activeSignal.value}
            type={activeSignal.type}
            active
            size="md"
          />

          {matchCount > 0 && (
            <span className="text-xs text-gray-600">
              {matchCount} creative
              {matchCount !== 1 ? "s" : ""}
            </span>
          )}
        </div>

        <button
          onClick={onClose}
          className="text-[11px] text-gray-700 hover:text-white transition"
        >
          ✕ close
        </button>
      </div>

      {/* Breadcrumb */}

      {chain.length > 1 && (
        <div className="px-5 py-3 border-b border-gray-800/40">
          <ExplorationChain
            chain={chain}
            onJump={onChainJump}
          />
        </div>
      )}

      {/* Body */}

      <div className="px-5 py-5 space-y-5">
        {hasData ? (
          <>
            {/* Unified weighted signal field */}

            <div>
              <p className="text-[10px] text-gray-600 uppercase tracking-wider mb-3">
                Common signals found with this
              </p>

              <MergedSignalField
                regions={data.regions}
                onSignalClick={onSignalClick}
              />
            </div>

            {/* Strongest co-signal */}

            {dominantSignal && (
              <div className="rounded-xl border border-gray-800/40 bg-black/40 px-4 py-3">
                <p className="text-[10px] text-gray-600 uppercase tracking-wider mb-2">
                  Strongest related signal
                </p>

                <div className="flex items-center gap-3 flex-wrap">
                  <SignalTag
                    value={dominantSignal.value}
                    type={dominantSignal.type}
                    onClick={onSignalClick}
                    size="md"
                    active
                  />

                  <span className="text-xs text-gray-500">
                    appears together {dominantSignal.count}x
                  </span>
                </div>
              </div>
            )}

            {/* Matching creatives */}

            <CreativesStrip
              creatives={data!.matchingCreatives}
              onSignalClick={onSignalClick}
            />
          </>
        ) : (
          <p className="text-xs text-gray-700 py-2">
            No related signals found for this exploration.
          </p>
        )}
      </div>
    </div>
  );
}

export type { ExplorationData };
