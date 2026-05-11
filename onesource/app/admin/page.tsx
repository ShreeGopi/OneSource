"use client";

import { useState, useMemo } from "react";
import { supabase } from "@/lib/supabase";

import {
  VALID_EMOTIONS,
  VALID_HOOK_TYPES,
  VALID_VISUAL_STYLES,
  VALID_PLATFORMS,
} from "@/lib/config/ontology";

import { validateCreative } from "@/lib/utils/validation";

// ── Signal Quality Badge ─────────────────────────────────────

function QualityBadge({
  score,
  quality,
}: {
  score: number;
  quality: "strong" | "moderate" | "weak";
}) {
  const styles = {
    strong: "bg-green-900 text-green-300 border-green-700",
    moderate: "bg-yellow-900 text-yellow-300 border-yellow-700",
    weak: "bg-red-900 text-red-300 border-red-700",
  };

  return (
    <div
      className={`inline-flex items-center gap-2 px-3 py-1 rounded-full border text-xs font-semibold ${styles[quality]}`}
    >
      <span>Signal Quality</span>
      <span className="opacity-60">|</span>
      <span className="capitalize">{quality}</span>
      <span className="opacity-60">|</span>
      <span>{score}/100</span>
    </div>
  );
}

// ── Toggle Button ─────────────────────────────────────────────

function ToggleButton({
  label,
  selected,
  onClick,
}: {
  label: string;
  selected: boolean;
  onClick: () => void;
}) {
  return (
    <button
      type="button"
      onClick={onClick}
      className={`px-3 py-1 rounded-full text-xs border transition-all ${
        selected
          ? "bg-white text-black border-white"
          : "bg-transparent text-gray-400 border-gray-700 hover:border-gray-500"
      }`}
    >
      {label}
    </button>
  );
}

// ── Main Page ─────────────────────────────────────────────────

export default function AdminPage() {
  const [title, setTitle] = useState("");
  const [brand, setBrand] = useState("");
  const [platform, setPlatform] = useState("");
  const [niche, setNiche] = useState("");
  const [imageUrl, setImageUrl] = useState("");
  const [hook, setHook] = useState("");
  const [cta, setCta] = useState("");
  const [notes, setNotes] = useState("");
  const [emotionTags, setEmotionTags] = useState<string[]>([]);
  const [hookTypes, setHookTypes] = useState<string[]>([]);
  const [visualStyles, setVisualStyles] = useState<string[]>([]);
  const [submitting, setSubmitting] = useState(false);

  // ── Live Validation ────────────────────────────────────────

  const validation = useMemo(
    () =>
      validateCreative({
        title,
        platform,
        niche,
        emotion_tags: emotionTags,
        hook_types: hookTypes,
        visual_styles: visualStyles,
      }),
    [title, platform, niche, emotionTags, hookTypes, visualStyles]
  );

  // ── Toggle Helpers ─────────────────────────────────────────

  const toggle = (
    value: string,
    current: string[],
    setter: React.Dispatch<React.SetStateAction<string[]>>
  ) => {
    setter(
      current.includes(value)
        ? current.filter((v) => v !== value)
        : [...current, value]
    );
  };

  // ── Submit ─────────────────────────────────────────────────

  const handleSubmit = async () => {
    if (!validation.isValid) return;

    setSubmitting(true);

    const { error } = await supabase.from("creatives").insert([
      {
        title,
        brand,
        platform,
        niche,
        image_url: imageUrl,
        hook,
        cta,
        notes,
        emotion_tags: emotionTags,
        hook_types: hookTypes,
        visual_styles: visualStyles,
      },
    ]);

    setSubmitting(false);

    if (error) {
      alert("Error: " + error.message);
      return;
    }

    // Reset
    setTitle("");
    setBrand("");
    setPlatform("");
    setNiche("");
    setImageUrl("");
    setHook("");
    setCta("");
    setNotes("");
    setEmotionTags([]);
    setHookTypes([]);
    setVisualStyles([]);
  };

  // ── Render ─────────────────────────────────────────────────

  return (
    <div className="min-h-screen bg-black text-white">
      <div className="max-w-2xl mx-auto px-6 py-12 space-y-8">

        {/* Header */}
        <div>
          <h1 className="text-2xl font-bold">Add Creative</h1>
          <p className="text-sm text-gray-500 mt-1">
            Signal quality determines intelligence accuracy.
          </p>
        </div>

        {/* Live Validation Panel */}
        <div className="p-4 rounded-xl border border-gray-800 bg-[#0d0d0d] space-y-3">
          <QualityBadge
            score={validation.score}
            quality={validation.quality}
          />

          {validation.errors.length > 0 && (
            <ul className="space-y-1">
              {validation.errors.map((err) => (
                <li key={err} className="text-xs text-red-400 flex gap-2">
                  <span>✕</span>
                  <span>{err}</span>
                </li>
              ))}
            </ul>
          )}

          {validation.warnings.length > 0 && (
            <ul className="space-y-1">
              {validation.warnings.map((warn) => (
                <li key={warn} className="text-xs text-yellow-500 flex gap-2">
                  <span>⚠</span>
                  <span>{warn}</span>
                </li>
              ))}
            </ul>
          )}

          {validation.isValid && validation.warnings.length === 0 && (
            <p className="text-xs text-green-400">
              ✓ All signals complete. Ready to save.
            </p>
          )}
        </div>

        {/* Core Fields */}
        <div className="space-y-3">
          <input
            className="w-full bg-[#111] border border-gray-800 rounded-lg px-4 py-2 text-sm placeholder-gray-600 focus:outline-none focus:border-gray-600"
            placeholder="Title *"
            value={title}
            onChange={(e) => setTitle(e.target.value)}
          />

          <input
            className="w-full bg-[#111] border border-gray-800 rounded-lg px-4 py-2 text-sm placeholder-gray-600 focus:outline-none focus:border-gray-600"
            placeholder="Brand"
            value={brand}
            onChange={(e) => setBrand(e.target.value)}
          />

          {/* Platform — controlled select */}
          <select
            className="w-full bg-[#111] border border-gray-800 rounded-lg px-4 py-2 text-sm text-gray-300 focus:outline-none focus:border-gray-600"
            value={platform}
            onChange={(e) => setPlatform(e.target.value)}
          >
            <option value="">Select Platform *</option>
            {VALID_PLATFORMS.map((p) => (
              <option key={p} value={p}>
                {p}
              </option>
            ))}
          </select>

          <input
            className="w-full bg-[#111] border border-gray-800 rounded-lg px-4 py-2 text-sm placeholder-gray-600 focus:outline-none focus:border-gray-600"
            placeholder="Niche (skincare, fitness...)"
            value={niche}
            onChange={(e) => setNiche(e.target.value)}
          />

          <input
            className="w-full bg-[#111] border border-gray-800 rounded-lg px-4 py-2 text-sm placeholder-gray-600 focus:outline-none focus:border-gray-600"
            placeholder="Image URL"
            value={imageUrl}
            onChange={(e) => setImageUrl(e.target.value)}
          />
        </div>

        {/* Emotion Tags */}
        <div className="space-y-2">
          <p className="text-xs font-semibold text-gray-400 uppercase tracking-wider">
            Emotion Tags *
          </p>
          <div className="flex flex-wrap gap-2">
            {VALID_EMOTIONS.map((emotion) => (
              <ToggleButton
                key={emotion}
                label={emotion}
                selected={emotionTags.includes(emotion)}
                onClick={() => toggle(emotion, emotionTags, setEmotionTags)}
              />
            ))}
          </div>
        </div>

        {/* Hook Types */}
        <div className="space-y-2">
          <p className="text-xs font-semibold text-gray-400 uppercase tracking-wider">
            Hook Types *
          </p>
          <div className="flex flex-wrap gap-2">
            {VALID_HOOK_TYPES.map((hookType) => (
              <ToggleButton
                key={hookType}
                label={hookType}
                selected={hookTypes.includes(hookType)}
                onClick={() => toggle(hookType, hookTypes, setHookTypes)}
              />
            ))}
          </div>
        </div>

        {/* Visual Styles */}
        <div className="space-y-2">
          <p className="text-xs font-semibold text-gray-400 uppercase tracking-wider">
            Visual Styles
          </p>
          <div className="flex flex-wrap gap-2">
            {VALID_VISUAL_STYLES.map((visual) => (
              <ToggleButton
                key={visual}
                label={visual}
                selected={visualStyles.includes(visual)}
                onClick={() => toggle(visual, visualStyles, setVisualStyles)}
              />
            ))}
          </div>
        </div>

        {/* Optional Fields */}
        <div className="space-y-3">
          <textarea
            className="w-full bg-[#111] border border-gray-800 rounded-lg px-4 py-2 text-sm placeholder-gray-600 focus:outline-none focus:border-gray-600 resize-none"
            placeholder="Hook text"
            rows={2}
            value={hook}
            onChange={(e) => setHook(e.target.value)}
          />

          <textarea
            className="w-full bg-[#111] border border-gray-800 rounded-lg px-4 py-2 text-sm placeholder-gray-600 focus:outline-none focus:border-gray-600 resize-none"
            placeholder="CTA"
            rows={2}
            value={cta}
            onChange={(e) => setCta(e.target.value)}
          />

          <textarea
            className="w-full bg-[#111] border border-gray-800 rounded-lg px-4 py-2 text-sm placeholder-gray-600 focus:outline-none focus:border-gray-600 resize-none"
            placeholder="Notes"
            rows={2}
            value={notes}
            onChange={(e) => setNotes(e.target.value)}
          />
        </div>

        {/* Submit */}
        <button
          onClick={handleSubmit}
          disabled={!validation.isValid || submitting}
          className={`w-full py-3 rounded-xl text-sm font-semibold transition-all ${
            validation.isValid && !submitting
              ? "bg-white text-black hover:bg-gray-200"
              : "bg-gray-800 text-gray-600 cursor-not-allowed"
          }`}
        >
          {submitting ? "Saving..." : "Save Creative"}
        </button>

      </div>
    </div>
  );
}