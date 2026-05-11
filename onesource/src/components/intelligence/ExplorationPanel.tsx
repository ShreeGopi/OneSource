// ============================================================
// OneSource — Exploration Panel
// Persistent context panel. Follows you across tabs.
// Every related signal inside is clickable — chains exploration.
// ============================================================

"use client";

import { SignalTag, SignalTagGroup, Signal, SignalType } from "./SignalTag";
import { Creative } from "@/lib/types/creative";

// ── Types ─────────────────────────────────────────────────────

export type ExplorationData = {
  matchingCreatives: Creative[];
  visuals: Record<string, number>;
  hooks: Record<string, number>;
  emotions: Record<string, number>;
  ctas: Record<string, number>;
  niches: Record<string, number>;
  platforms: Record<string, number>;
};

// ── Helpers ───────────────────────────────────────────────────

function topEntries(
  map: Record<string, number>,
  limit = 6
): [string, number][] {
  return Object.entries(map)
    .sort((a, b) => b[1] - a[1])
    .slice(0, limit);
}

// ── Breadcrumb ────────────────────────────────────────────────

function ExplorationChain({
  chain,
  onJump,
}: {
  chain: Signal[];
  onJump: (index: number) => void;
}) {
  if (chain.length <= 1) return null;

  return (
    <div className="flex items-center gap-1 flex-wrap mb-4">
      {chain.map((signal, i) => (
        <span key={`${signal.type}-${signal.value}-${i}`} className="flex items-center gap-1">
          <button
            onClick={() => onJump(i)}
            className={`text-xs px-2 py-0.5 rounded transition-all ${
              i === chain.length - 1
                ? "text-white font-medium"
                : "text-gray-600 hover:text-gray-400"
            }`}
          >
            {signal.value}
          </button>
          {i < chain.length - 1 && (
            <span className="text-gray-700 text-xs">→</span>
          )}
        </span>
      ))}
    </div>
  );
}

// ── Related signals section ───────────────────────────────────

function RelatedSection({
  label,
  entries,
  type,
  onSignalClick,
}: {
  label: string;
  entries: [string, number][];
  type: SignalType;
  onSignalClick: (signal: Signal) => void;
}) {
  if (entries.length === 0) return null;

  return (
    <div>
      <p className="text-xs text-gray-600 mb-2 uppercase tracking-wider">
        {label}
      </p>
      <div className="flex flex-wrap gap-1.5">
        {entries.map(([value, count]) => (
          <div
            key={value}
            className="flex items-center gap-2"
          >
            <SignalTag
              value={value}
              type={type}
              onClick={onSignalClick}
            />

            <span className="text-[10px] text-gray-600 min-w-[14px]">
              {count}
            </span>
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

  return (
    <div className="mt-8 rounded-2xl border border-gray-700 bg-[#0a0a0a] overflow-hidden">

      {/* Panel Header */}
      <div className="flex items-center justify-between px-5 py-4 border-b border-gray-800">
        <div className="flex items-center gap-3 flex-wrap">
          <span className="text-xs text-gray-500 uppercase tracking-wider">
            Exploring
          </span>
          <SignalTag
            value={activeSignal.value}
            type={activeSignal.type}
            active
          />
          <span className="text-xs text-gray-600">
            {matchCount} creative{matchCount !== 1 ? "s" : ""}
          </span>
        </div>
        <button
          onClick={onClose}
          className="text-xs text-gray-600 hover:text-white transition px-2 py-1"
        >
          close ✕
        </button>
      </div>

      {/* Exploration chain breadcrumb */}
      {chain.length > 1 && (
        <div className="px-5 pt-4">
          <ExplorationChain chain={chain} onJump={onChainJump} />
        </div>
      )}

      {/* Related signals */}
      {data ? (
        <div className="px-5 py-4 grid grid-cols-2 gap-5">
          <RelatedSection
            label="Emotions"
            entries={topEntries(data.emotions)}
            type="emotion"
            onSignalClick={onSignalClick}
          />
          <RelatedSection
            label="Hooks"
            entries={topEntries(data.hooks)}
            type="hook"
            onSignalClick={onSignalClick}
          />
          <RelatedSection
            label="Visuals"
            entries={topEntries(data.visuals)}
            type="visual"
            onSignalClick={onSignalClick}
          />
          <RelatedSection
            label="CTAs"
            entries={topEntries(data.ctas)}
            type="cta"
            onSignalClick={onSignalClick}
          />
          <RelatedSection
            label="Platforms"
            entries={topEntries(data.platforms)}
            type="platform"
            onSignalClick={onSignalClick}
          />
          <RelatedSection
            label="Niches"
            entries={topEntries(data.niches)}
            type="niche"
            onSignalClick={onSignalClick}
          />
        </div>
      ) : (
        <div className="px-5 py-4">
          <p className="text-xs text-gray-600">
            No signal data found for this exploration.
          </p>
        </div>
      )}

      {/* Matching creatives strip */}
      {data && data.matchingCreatives.length > 0 && (
        <div className="px-5 pb-5 border-t border-gray-800 pt-4">
          <p className="text-xs text-gray-600 mb-3 uppercase tracking-wider">
            Matching Creatives
          </p>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-2">
            {data.matchingCreatives.slice(0, 8).map((item) => (
              <div
                key={item.id}
                className="bg-black border border-gray-800 rounded-lg p-3 hover:border-gray-700 transition"
              >
                <p className="text-xs font-medium text-white truncate">
                  {item.title}
                </p>
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
                <p className="text-xs text-gray-700 mt-1 capitalize">
                  {item.platform}
                </p>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}