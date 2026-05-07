"use client";

import { useEffect, useState } from "react";
import { supabase } from "@/lib/supabase";

export default function GalleryPage() {
  const [creatives, setCreatives] = useState<any[]>([]);

  const [selectedEmotion, setSelectedEmotion] = useState("");
  const [selectedHook, setSelectedHook] = useState("");
  const [selectedPlatform, setSelectedPlatform] = useState("");

  const [allEmotions, setAllEmotions] = useState<string[]>([]);
  const [allHooks, setAllHooks] = useState<string[]>([]);
  const [allPlatforms, setAllPlatforms] = useState<string[]>([]);

  const patternExplanations: Record<string, string> = {
    "curiosity + before-after":
      "Before-after creates strong visual contrast, while curiosity keeps users engaged.",
    "urgency + problem-solution":
      "Urgency pushes immediate action, while problem-solution clearly communicates value.",
    "fear + problem-solution":
      "Fear highlights risk, and problem-solution provides a clear fix.",
    "aspiration + before-after":
      "Aspiration shows desired outcome, while before-after makes transformation believable.",
  };

  useEffect(() => {
    fetchData();
  }, []);

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

    const emotionsSet = new Set<string>();
    const hooksSet = new Set<string>();
    const platformSet = new Set<string>();

    creativesData.forEach((item) => {
      item.emotion_tags?.forEach((tag: string) => {
        emotionsSet.add(tag);
      });

      item.hook_types?.forEach((tag: string) => {
        hooksSet.add(tag);
      });

      if (item.platform) {
        platformSet.add(item.platform);
      }
    });

    setAllEmotions(Array.from(emotionsSet));
    setAllHooks(Array.from(hooksSet));
    setAllPlatforms(Array.from(platformSet));
  };

  // 🔥 FILTER
  const filtered = creatives.filter((item) => {
    const matchEmotion = selectedEmotion
      ? item.emotion_tags?.includes(selectedEmotion)
      : true;

    const matchHook = selectedHook
      ? item.hook_types?.includes(selectedHook)
      : true;

    const matchPlatform = selectedPlatform
      ? item.platform === selectedPlatform
      : true;

    return matchEmotion && matchHook && matchPlatform;
  });

  // 🔥 INSIGHTS
  const emotionCount: Record<string, number> = {};
  const hookCount: Record<string, number> = {};
  const platformCount: Record<string, number> = {};

  filtered.forEach((item) => {
    item.emotion_tags?.forEach((tag: string) => {
      emotionCount[tag] = (emotionCount[tag] || 0) + 1;
    });

    item.hook_types?.forEach((tag: string) => {
      hookCount[tag] = (hookCount[tag] || 0) + 1;
    });

    if (item.platform) {
      platformCount[item.platform] =
        (platformCount[item.platform] || 0) + 1;
    }
  });

  const getTop = (obj: Record<string, number>) => {
    const sorted = Object.entries(obj).sort((a, b) => b[1] - a[1]);
    return sorted[0];
  };

  const topEmotion = getTop(emotionCount);
  const topHook = getTop(hookCount);
  const topPlatform = getTop(platformCount);
  const getStrengthLabel = (percentage: number) => {
    if (percentage >= 60) return "Dominant";
    if (percentage >= 30) return "Strong";
    return "Weak";
  };

  // 🔥 PATTERN COMBINATIONS
  const patternCount: Record<string, number> = {};

  filtered.forEach((item) => {
    item.emotion_tags?.forEach((emotion: string) => {
      item.hook_types?.forEach((hook: string) => {
        const key = `${emotion} + ${hook}`;
        patternCount[key] = (patternCount[key] || 0) + 1;
      });
    });
  });

  const topPatterns = Object.entries(patternCount)
    .filter(([_, count]) => count >= 2)
    .sort((a, b) => b[1] - a[1]);

  // 🔥 PLATFORM PATTERNS
  const platformPatterns: Record<string, Record<string, number>> = {};

  filtered.forEach((item) => {
    const platform = item.platform;
    if (!platform) return;

    if (!platformPatterns[platform]) {
      platformPatterns[platform] = {};
    }

    item.emotion_tags?.forEach((emotion: string) => {
      item.hook_types?.forEach((hook: string) => {
        const key = `${emotion} + ${hook}`;
        platformPatterns[platform][key] =
          (platformPatterns[platform][key] || 0) + 1;
      });
    });
  });

const topPlatformPatterns = Object.entries(platformPatterns).map(
  ([platform, patterns]) => {
    const totalItems = filtered.filter(
      (item) => item.platform === platform
    ).length;

    const filteredPatterns = Object.entries(patterns)
      .filter(([_, count]) => count >= 2)
      .sort((a, b) => b[1] - a[1]);

    const top = filteredPatterns[0];

    let percentage = 0;
    let label = "";

    if (top && totalItems > 0) {
      percentage = Math.round((top[1] / totalItems) * 100);
      label = getStrengthLabel(percentage);
    }

    return {
      platform,
      top,
      percentage,
      label,
    };
  }
);

// 🔥 CROSS-PLATFORM COMPARISON

const crossPlatformData = topPatterns.map(([pattern, _]) => {
  const result: {
    pattern: string;
    platforms: {
      platform: string;
      percentage: number;
      label: string;
      count: number;
    }[];
  } = {
    pattern,
    platforms: [],
  };

  Object.keys(platformPatterns).forEach((platform) => {
    const totalItems = filtered.filter(
      (item) => item.platform === platform
    ).length;

    const count = platformPatterns[platform][pattern] || 0;

    let percentage = 0;
    let label = "";

    if (totalItems > 0 && count > 0) {
      percentage = Math.round((count / totalItems) * 100);
      label = getStrengthLabel(percentage);
    }

    // ✅ FIRST push
    result.platforms.push({
      platform,
      percentage,
      label,
      count,
    });
  });

  // ✅ THEN sort (after loop)
  result.platforms.sort((a, b) => b.percentage - a.percentage);

  return result;
});

// 🧠 PATTERN CLUSTERS

const patternClusters: Record<string, string[]> = {
  Transformation: [
    "before-after",
    "transformation",
    "results",
  ],

  ProblemSolving: [
    "problem-solution",
    "demonstration",
  ],

  AuthorityTrust: [
    "authority",
    "social-proof",
  ],

  ActionPressure: [
    "urgency",
    "scarcity",
  ],
};

const clusterSignals: Record<
  string,
  {
    count: number;
    patterns: string[];
  }
> = {};

topPatterns.forEach(([pattern, count]) => {
  const hook = pattern.split(" + ")[1];

  Object.entries(patternClusters).forEach(([cluster, hooks]) => {
    if (hooks.includes(hook)) {
      if (!clusterSignals[cluster]) {
        clusterSignals[cluster] = {
          count: 0,
          patterns: [],
        };
      }

      clusterSignals[cluster].count += count;

      clusterSignals[cluster].patterns.push(pattern);
    }
  });
});

const sortedClusters = Object.entries(clusterSignals).sort(
  (a, b) => b[1].count - a[1].count
);
  return (
    <div className="p-8">
      <h1 className="text-2xl font-bold mb-2">Creative Gallery</h1>
      <p className="text-sm text-gray-400 mb-6">
        Explore repeating creative patterns across platforms.
      </p>

      {/* 📊 INSIGHTS */}
<div className="mb-6 p-4 rounded-2xl bg-gray-900 text-white">
        <h2 className="font-semibold mb-2 text-lg">📊 Dataset Summary</h2>
        <p>Top Emotion: {topEmotion?.[0]} ({topEmotion?.[1]})</p>
        <p>Top Hook: {topHook?.[0]} ({topHook?.[1]})</p>
        <p>Top Platform: {topPlatform?.[0]} ({topPlatform?.[1]})</p>
</div>

{/* 🔥 PATTERNS */}
<div className="bg-[#111] border border-gray-800 p-4 rounded-xl mb-6">
        <h2 className="font-semibold mb-3 text-lg text-white">
          🔥 Repeating Patterns
        </h2>

              {topPatterns.map(([pattern, count], index) => {
                const [emotion, hook] = pattern.split(" + ");
                const explanation = patternExplanations[pattern];
                const isStrong = index === 0;

                return (
                  <div
                    key={pattern}
                    className={`mb-4 p-3 rounded-lg ${
                      isStrong ? "bg-[#1a1a1a] border border-yellow-500" : "bg-[#111]"
                    }`}
                  >
                    <p className={`text-xs mb-1 ${isStrong ? "text-yellow-400" : "text-gray-500"}`}>
                      {isStrong ? "🔥 Strong Signal" : "⚪ Secondary Pattern"}
                    </p>

                    <p className="text-sm text-white">
                      Emotion: <span className="font-semibold">{emotion}</span> • Hook:{" "}
                      <span className="font-semibold">{hook}</span> ({count})
                    </p>

                    <p className="text-xs text-gray-400">
                      ↳ Repeated across multiple creatives
                    </p>

                    {explanation && (
                      <p className="text-xs text-gray-400 mt-1">
                        💡 Why this works: {explanation}
                      </p>
                    )}
                  </div>
                );
              })}

              <p className="text-xs text-gray-500 mt-2">
                → Use these patterns as reference when creating creatives.
              </p>
</div>

{/* 📱 PLATFORM */}            
<div className="mb-6 p-4 rounded-2xl bg-gray-900 text-white shadow">
            <h2 className="font-semibold mb-3 text-gray-200">
              📱 Platform Insights
            </h2>

              {topPlatformPatterns.map(({ platform, top, percentage, label }) => {
                const emotion = top ? top[0].split(" + ")[0] : "";
                const hook = top ? top[0].split(" + ")[1] : "";

                return (
                  <div key={platform} className="mb-3">
                    <p className="text-sm">
                      <span className="font-semibold text-white">{platform}</span> →{" "}
                      {top ? (
                        <>
                          <span className="text-gray-400">Emotion:</span>{" "}
                          <span className="font-semibold">{emotion}</span>{" "}
                          <span className="text-gray-500">•</span>{" "}
                          <span className="text-gray-400">Hook:</span>{" "}
                          <span className="font-semibold">{hook}</span>{" "}
                          <span className="text-gray-400">({top[1]})</span>
                        </>
                      ) : (
                        <span className="text-gray-400">
                          No strong pattern yet
                        </span>
                      )}
                    </p>

                    {top && (
                      <>
                        <p className="text-xs text-gray-400">
                          ↳ {percentage}% of creatives on this platform
                        </p>
                        <p className="text-xs text-gray-400">
                          ↳ {label} pattern
                        </p>
                      </>
                    )}
                  </div>
                );
              })}
</div>

{/* ⚖️ CROSS-PLATFORM COMPARISON */}
<div className="mb-6 p-4 rounded-2xl bg-gray-900 text-white shadow">
  <h2 className="font-semibold mb-3 text-gray-200">
    ⚖️ Cross-Platform Comparison
  </h2>

  {crossPlatformData.length > 0 ? (
    crossPlatformData.map(({ pattern, platforms }) => {
      const [emotion, hook] = pattern.split(" + ");

      return (
        <div key={pattern} className="mb-4">
          <p className="text-sm font-semibold text-white mb-1">
            Emotion: {emotion} • Hook: {hook}
          </p>

          <div className="text-xs text-gray-400 space-y-1">
            {platforms.map(({ platform, percentage, label, count }) => (
              <p key={platform}>
                {platform} →{" "}
                {count >= 2 ? (
                  <>
                    {percentage}% ({label})
                  </>
                ) : (
                  "Low presence (< 2 occurrences)"
                )}
              </p>
            ))}
          </div>
        </div>
      );
    })
  ) : (
    <p className="text-sm text-gray-500">No comparable patterns yet</p>
  )}
</div>

{/* 🧠 BEHAVIOR CLUSTERS */}
<div className="mb-6 p-4 rounded-2xl bg-gray-900 text-white shadow">
  <h2 className="font-semibold mb-3 text-gray-200">
    🧠 Behavior Clusters
  </h2>

  {sortedClusters.length > 0 ? (
    sortedClusters.map(([cluster, data]) => (
      <div
        key={cluster}
        className="mb-4 border border-gray-800 rounded-lg p-3"
      >
        <p className="text-sm font-semibold text-white">
          {cluster} Cluster
        </p>

        <p className="text-xs text-gray-400 mt-1">
          Total Signal Strength: {data.count}
        </p>

        <div className="mt-2 text-xs text-gray-500">
          {data.patterns.map((pattern) => {
            const [emotion, hook] = pattern.split(" + ");

            return (
              <p key={pattern}>
                • Emotion: {emotion} → Hook: {hook}
              </p>
            );
          })}
        </div>
      </div>
    ))
  ) : (
    <p className="text-sm text-gray-500">
      No cluster signals yet
    </p>
  )}
</div>

{/* FILTERS */}
<div className="flex gap-4 mb-6">
        <select onChange={(e) => setSelectedEmotion(e.target.value)}>
          <option value="">All Emotions</option>
          {allEmotions.map((e) => <option key={e}>{e}</option>)}
        </select>

        <select onChange={(e) => setSelectedHook(e.target.value)}>
          <option value="">All Hooks</option>
          {allHooks.map((h) => <option key={h}>{h}</option>)}
        </select>

        <select onChange={(e) => setSelectedPlatform(e.target.value)}>
          <option value="">All Platforms</option>
          {allPlatforms.map((p) => <option key={p}>{p}</option>)}
        </select>
</div>

{/* 🔽 GRID */}
<div className="grid grid-cols-1 md:grid-cols-3 gap-6">
  {filtered.map((item) => (
    <div key={item.id} className="border border-gray-800 bg-[#111] p-4 rounded-xl">
      
      {/* ✅ IMAGE (FIXED) */}
      {item.image_url && (
        <img
          src={item.image_url}
          alt="creative"
          className="w-full h-40 object-cover mb-3 rounded-md"
        />
      )}

      {/* TEXT CONTENT */}
      <h2 className="font-semibold text-white">{item.title}</h2>
      <p className="text-sm text-gray-400">{item.brand}</p>

      <p className="mt-2 text-sm text-gray-300">
        <strong>Hook:</strong> {item.hook}
      </p>

      <p className="text-sm text-gray-300">
        <strong>CTA:</strong> {item.cta}
      </p>

      {/* TAGS */}
      <div className="mt-2 text-xs text-gray-400 space-y-1">
        <p>
          <strong>Emotion:</strong> {item.emotion_tags?.join(", ")}
        </p>
        <p>
          <strong>Hook Type:</strong> {item.hook_types?.join(", ")}
        </p>
        <p>
          <strong>Visual:</strong> {item.visual_styles?.join(", ")}
        </p>
      </div>

      <p className="text-xs text-gray-500 mt-3">
        {item.platform} • {item.niche}
      </p>
    </div>
  ))}
</div>
    </div>
  );
}