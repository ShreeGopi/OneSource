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
  Dominant: "text-green-400 bg-green-900/30 border-green-800",
  Strong: "text-blue-400 bg-blue-900/30 border-blue-800",
  Emerging: "text-yellow-400 bg-yellow-900/30 border-yellow-800",
  Weak: "text-gray-500 bg-gray-900/30 border-gray-800",
};

function StrengthPill({ count }: { count: number }) {
  const label = getRelationshipStrength(count);
  const style = STRENGTH_STYLES[label] ?? STRENGTH_STYLES.Weak;

  return (
    <span
      className={`text-xs px-2 py-0.5 rounded-full border font-medium ${style}`}
    >
      {label} · {count}
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
      <p className="text-xs text-gray-500 mb-2 uppercase tracking-wider">
        {label}
      </p>
      <div className="space-y-1">
        {entries.map(([key, count]) => (
          <div key={key} className="flex items-center justify-between">
            <span className="text-xs text-gray-300">{key}</span>
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
          ? "border-gray-600 bg-[#0d0d0d]"
          : "border-gray-800 bg-[#111] hover:border-gray-700"
      }`}
    >
      {/* Card Header — always visible */}
      <button
        onClick={onToggle}
        className="w-full text-left px-4 py-4"
      >
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-3 flex-wrap">
            <span className="text-sm font-semibold text-white">
              {emotion}
            </span>
            <span className="text-gray-600 text-xs">→</span>
            <span className="text-sm font-semibold text-white">
              {hook}
            </span>
            <StrengthPill count={count} />
          </div>

          <span className="text-gray-600 text-xs ml-4">
            {isExpanded ? "↑ close" : "explore →"}
          </span>
        </div>

        {explanation && !isExpanded && (
          <p className="text-xs text-gray-500 mt-2 leading-relaxed">
            💡 {explanation}
          </p>
        )}
      </button>

      {/* Inline Exploration — expands on click */}
      {isExpanded && explorationData && (
        <div className="px-4 pb-5 border-t border-gray-800 pt-4 space-y-5">
          {explanation && (
            <p className="text-xs text-gray-400 leading-relaxed">
              💡 {explanation}
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
              <p className="text-xs text-gray-500 mb-3 uppercase tracking-wider">
                Matching Creatives ({explorationData.matchingCreatives.length})
              </p>
              <div className="grid grid-cols-2 gap-2">
                {explorationData.matchingCreatives.map((item) => (
                  <div
                    key={item.id}
                    className="bg-black border border-gray-800 rounded-lg p-3"
                  >
                    <p className="text-xs font-medium text-white truncate">
                      {item.title}
                    </p>
                    <p className="text-xs text-gray-600 mt-1">
                      {item.platform} · {item.niche}
                    </p>
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>
      )}

      {isExpanded && !explorationData && (
        <div className="px-4 pb-4 pt-2 border-t border-gray-800">
          <p className="text-xs text-gray-600">
            No exploration data available for this pattern.
          </p>
        </div>
      )}
    </div>
  );
}