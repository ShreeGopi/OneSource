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

  // 🔥 PATTERN COMBINATIONS (WITH THRESHOLD)
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
    .filter(([_, count]) => count >= 2) // ✅ threshold
    .sort((a, b) => b[1] - a[1]);

  // 🔥 PLATFORM PATTERNS (WITH THRESHOLD)
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
      const filteredPatterns = Object.entries(patterns)
        .filter(([_, count]) => count >= 2) // ✅ threshold
        .sort((a, b) => b[1] - a[1]);

      return {
        platform,
        top: filteredPatterns[0],
      };
    }
  );

  return (
    <div className="p-8">
      <h1 className="text-2xl font-bold mb-6">Creative Gallery</h1>

      {/* 🔥 INSIGHTS */}
      <div className="mb-6 p-4 rounded-2xl bg-gray-900 text-white shadow">
        <h2 className="font-semibold mb-2 text-white text-lg"> 📊 Dataset Summary</h2>

        <p className="text-sm">
          Top Emotion: <span className="font-semibold">{topEmotion?.[0] || "-"}</span> ({topEmotion?.[1] || 0})
        </p>

        <p className="text-sm">
          Top Hook: <span className="font-semibold">{topHook?.[0] || "-"}</span> ({topHook?.[1] || 0})
        </p>

        <p className="text-sm">
          Top Platform: <span className="font-semibold">{topPlatform?.[0] || "-"}</span> ({topPlatform?.[1] || 0})
        </p>
      </div>

      {/* 🔥 TOP PATTERNS */}
      <div className="mb-6 p-4 rounded-2xl bg-gray-900 text-white shadow">
        <h2 className="font-semibold mb-3 text-white text-lg">
          🔥 Repeating Patterns
        </h2>

        {topPatterns.length === 0 && (
          <p className="text-sm text-gray-400">No strong patterns yet</p>
        )}

       {topPatterns.map(([pattern, count]) => {
          const [emotion, hook] = pattern.split(" + ");

          return (
            <div key={pattern} className="mb-2">
              <p className="text-sm text-white">
                <span className="text-gray-400">Emotion:</span>{" "}
                <span className="font-semibold">{emotion}</span>{" "}
                <span className="text-gray-500">•</span>{" "}
                <span className="text-gray-400">Hook:</span>{" "}
                <span className="font-semibold">{hook}</span>{" "}
                <span className="text-gray-400">({count})</span>
              </p>

              <p className="text-xs text-gray-400">
                ↳ Repeated across multiple creatives → likely common structure
              </p>
            </div>
          );
        })}
      </div>

      {/* 🔥 PLATFORM PATTERNS/📱 Platform Insights */}
      <div className="mb-6 p-4 rounded-2xl bg-gray-900 text-white shadow">
        <h2 className="font-semibold mb-3 text-gray-200">📱 Platform Insights</h2>

       {topPlatformPatterns.map(({ platform, top }) => {
          const emotion = top ? top[0].split(" + ")[0] : "";
          const hook = top ? top[0].split(" + ")[1] : "";

          return (
            <div key={platform} className="mb-2">
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
                  <span className="text-gray-400">No strong pattern yet</span>
                )}
              </p>

              {top && (
                <p className="text-xs text-gray-400">
                  ↳ Most repeated pattern on this platform
                </p>
              )}
            </div>
          );
        })}
      </div>

      {/* 🔽 FILTERS */}
      <div className="flex gap-4 mb-6 flex-wrap">
        <select
          className="bg-gray-900 text-white border border-gray-700 px-3 py-2 rounded-md"
          value={selectedEmotion}
          onChange={(e) => setSelectedEmotion(e.target.value)}
        >
          <option value="">All Emotions</option>
          {allEmotions.map((emotion) => (
            <option key={emotion} value={emotion}>{emotion}</option>
          ))}
        </select>

        <select
          className="bg-gray-900 text-white border border-gray-700 px-3 py-2 rounded-md"
          value={selectedHook}
          onChange={(e) => setSelectedHook(e.target.value)}
        >
          <option value="">All Hooks</option>
          {allHooks.map((hook) => (
            <option key={hook} value={hook}>{hook}</option>
          ))}
        </select>

        <select
          className="bg-gray-900 text-white border border-gray-700 px-3 py-2 rounded-md"
          value={selectedPlatform}
          onChange={(e) => setSelectedPlatform(e.target.value)}
        >
          <option value="">All Platforms</option>
          {allPlatforms.map((platform) => (
            <option key={platform} value={platform}>{platform}</option>
          ))}
        </select>
      </div>

      {/* 🔽 GRID */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {filtered.map((item) => (
          <div key={item.id} className="border p-4 rounded">
            {item.image_url && (
              <img
                src={item.image_url}
                alt="creative"
                className="w-full h-40 object-cover mb-2"
              />
            )}

            <h2 className="font-semibold">{item.title}</h2>
            <p className="text-sm text-gray-500">{item.brand}</p>

            <p className="mt-2 text-sm">
              <strong>Hook:</strong> {item.hook}
            </p>

            <p className="text-sm">
              <strong>CTA:</strong> {item.cta}
            </p>

            <div className="mt-2 text-xs text-gray-600">
              <p><strong>Emotion:</strong> {item.emotion_tags?.join(", ")}</p>
              <p><strong>Hook Type:</strong> {item.hook_types?.join(", ")}</p>
              <p><strong>Visual:</strong> {item.visual_styles?.join(", ")}</p>
            </div>

            <p className="text-xs text-gray-400 mt-2">
              {item.platform} • {item.niche}
            </p>
          </div>
        ))}
      </div>
    </div>
  );
}