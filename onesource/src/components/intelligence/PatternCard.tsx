// ============================================================
// OneSource — Pattern Card
// Displays a single pattern with inline exploration expansion.
// Clicking opens the exploration inline — no page jump.
// ============================================================

"use client";

import { getRelationshipStrength } from "@/lib/config/thresholds";
import { getTopEntries } from "@/lib/utils/aggregation";
import { Creative } from "@/lib/types/creative";

// ── Strength styles ───────────────────────────────────────────

const STRENGTH_STYLES: Record<string, string> = {
  Dominant: "text-[#3c6a4a] bg-[#e7f0e8] border-[#b8cdb9]",
  Strong: "text-[#4f7475] bg-[#e5efee] border-[#bfd1cf]",
  Emerging: "text-[#8a6424] bg-[#f5ead2] border-[#dcc696]",
  Weak: "text-[#8a8174] bg-[#eee7dc] border-[#d8cec0]",
};

function StrengthPill({ count }: { count: number }) {
  const label = getRelationshipStrength(count);
  const style = STRENGTH_STYLES[label] ?? STRENGTH_STYLES.Weak;

  return (
    <span
      className={`rounded-full border px-2 py-0.5 text-xs font-medium ${style}`}
    >
      {label} / {count}
    </span>
  );
}

// ── Exploration data type ─────────────────────────────────────

type ExplorationData = {
  visuals: Record<string, number>;
  ctas: Record<string, number>;
  niches: Record<string, number>;
  platforms: Record<string, number>;
  matchingCreatives: Creative[];
};

// ── Sub-section inside exploration ───────────────────────────

function ExploreSection({
  label,
  data,
}: {
  label: string;
  data: Record<string, number>;
}) {
  const entries = getTopEntries(data, 4);
  if (entries.length === 0) return null;

  return (
    <div>
      <p className="mb-2 text-xs uppercase tracking-wider text-[#7c7265]">
        {label}
      </p>
      <div className="space-y-1">
        {entries.map(([key, count]) => (
          <div key={key} className="flex items-center justify-between">
            <span className="text-xs text-[#3a352d]">{key}</span>
            <StrengthPill count={count} />
          </div>
        ))}
      </div>
    </div>
  );
}

// ── Main Pattern Card ─────────────────────────────────────────

type PatternCardProps = {
  pattern: string;
  count: number;
  explanation?: string;
  isExpanded: boolean;
  onToggle: () => void;
  explorationData: ExplorationData | null;
};

export function PatternCard({
  pattern,
  count,
  explanation,
  isExpanded,
  onToggle,
  explorationData,
}: PatternCardProps) {
  const [emotion, hook] = pattern.split(" + ");

  return (
    <div
      className={`rounded-xl border transition-all ${
        isExpanded
          ? "border-[#7f9f94] bg-[#fffaf1]/88 shadow-sm shadow-[#22201c]/4"
          : "border-[#22201c]/8 bg-[#fffaf1]/76 hover:border-[#7f9f94]"
      }`}
    >
      {/* Card Header — always visible */}
      <button
        onClick={onToggle}
        className="w-full text-left px-4 py-4"
      >
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-3 flex-wrap">
            <span className="text-sm font-semibold text-[#22201c]">
              {emotion}
            </span>
            <span className="text-xs text-transparent before:text-[#8a8174] before:content-['→']">→</span>
            <span className="text-sm font-semibold text-[#22201c]">
              {hook}
            </span>
            <StrengthPill count={count} />
          </div>

          <span className="ml-4 text-xs text-[#7c7265]">
            {isExpanded ? "close" : "explore →"}
          </span>
        </div>

        {explanation && !isExpanded && (
          <p className="mt-2 text-xs leading-relaxed text-[#5f574f]">
            {explanation}
          </p>
        )}
      </button>

      {/* Inline Exploration — expands on click */}
      {isExpanded && explorationData && (
        <div className="space-y-5 border-t border-[#22201c]/10 px-4 pb-5 pt-4">
          {explanation && (
            <p className="text-xs leading-relaxed text-[#5f574f]">
              {explanation}
            </p>
          )}

          <div className="grid grid-cols-2 gap-5">
            <ExploreSection
              label="Visual Signals"
              data={explorationData.visuals}
            />
            <ExploreSection
              label="CTAs"
              data={explorationData.ctas}
            />
            <ExploreSection
              label="Niches"
              data={explorationData.niches}
            />
            <ExploreSection
              label="Platforms"
              data={explorationData.platforms}
            />
          </div>

          {explorationData.matchingCreatives.length > 0 && (
            <div>
              <p className="mb-3 text-xs uppercase tracking-wider text-[#7c7265]">
                Matching Creatives ({explorationData.matchingCreatives.length})
              </p>
              <div className="grid grid-cols-2 gap-2">
                {explorationData.matchingCreatives.map((item) => (
                  <div
                    key={item.id}
                    className="rounded-lg border border-[#22201c]/10 bg-[#f8f4ec]/75 p-3"
                  >
                    <p className="truncate text-xs font-medium text-[#22201c]">
                      {item.title}
                    </p>
                    <p className="mt-1 text-xs text-[#7c7265]">
                      {item.platform} / {item.niche}
                    </p>
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>
      )}

      {isExpanded && !explorationData && (
        <div className="border-t border-[#22201c]/10 px-4 pb-4 pt-2">
          <p className="text-xs text-[#7c7265]">
            No exploration data available for this pattern.
          </p>
        </div>
      )}
    </div>
  );
}
