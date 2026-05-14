"use client";

import { useState, useMemo } from "react";
import { supabase } from "@/lib/supabase";
import { ScopeIntro } from "@/components/ScopeIntro";

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
    strong: "bg-[#e7f0e8] text-[#3c6a4a] border-[#b8cdb9]",
    moderate: "bg-[#f5ead2] text-[#8a6424] border-[#dcc696]",
    weak: "bg-[#f2ded8] text-[#8b4a3b] border-[#d7b0a4]",
  };

  return (
    <div
      className={`inline-flex items-center gap-2 rounded-full border px-3 py-1 text-xs font-semibold ${styles[quality]}`}
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
          ? "bg-[#22201c] text-[#fffaf1] border-[#22201c]"
          : "bg-[#fffaf1]/70 text-[#6f675d] border-[#22201c]/12 hover:border-[#22201c]/35 hover:text-[#22201c]"
      }`}
    >
      {label}
    </button>
  );
}

// ── Main Page ─────────────────────────────────────────────────

export default function AdminPage() {
  const [showScopeIntro, setShowScopeIntro] = useState(true);
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
    <div className="min-h-screen bg-[#f5f1e8] text-[#22201c]">
      {showScopeIntro ? (
        <ScopeIntro
          eyebrow="Current workspace"
          title="You are adding ecommerce creative signals."
          body="OneSource can study attention broadly. Right now, Admin keeps ecommerce inputs clean and consistent."
          detail="Add the hook, emotion, visual style, CTA, platform, and niche so the intelligence layer has useful signal."
          onPrimaryClick={() => setShowScopeIntro(false)}
          primaryLabel="Add ecommerce creative"
        />
      ) : (
        <div
          id="admin-ingestion"
          className="mx-auto min-h-screen max-w-2xl px-6 py-8"
          style={{
            backgroundImage:
              "linear-gradient(rgba(34,32,28,0.045) 1px, transparent 1px), linear-gradient(90deg, rgba(34,32,28,0.045) 1px, transparent 1px)",
            backgroundSize: "28px 28px",
          }}
        >
      <div className="space-y-6">

        {/* Header */}
        <div>
          <p className="mb-2 text-[10px] uppercase tracking-[0.22em] text-[#7c7265]">
            Signal Governance
          </p>
          <h1 className="text-2xl font-bold">Add Creative</h1>
          <p className="mt-1 text-sm text-[#6f675d]">
            Signal quality determines intelligence accuracy.
          </p>
        </div>

        {/* Live Validation Panel */}
        <div className="space-y-2.5 rounded-xl border border-[#22201c]/10 bg-[#fffaf1]/72 p-4 shadow-sm shadow-[#22201c]/5">
          <QualityBadge
            score={validation.score}
            quality={validation.quality}
          />

          {validation.errors.length > 0 && (
            <ul className="space-y-1">
              {validation.errors.map((err) => (
                <li key={err} className="flex gap-2 text-xs text-[#8b4a3b]">
                  <span aria-hidden="true">x</span>
                  <span>{err}</span>
                </li>
              ))}
            </ul>
          )}

          {validation.warnings.length > 0 && (
            <ul className="space-y-1">
              {validation.warnings.map((warn) => (
                <li key={warn} className="flex gap-2 text-xs text-[#8a6424]">
                  <span aria-hidden="true">!</span>
                  <span>{warn}</span>
                </li>
              ))}
            </ul>
          )}

          {validation.isValid && validation.warnings.length === 0 && (
            <p className="text-xs text-[#3c6a4a]">
              All signals complete. Ready to save.
            </p>
          )}
        </div>

        {/* Core Fields */}
        <div className="space-y-2.5">
          <input
            className="w-full rounded-lg border border-[#22201c]/12 bg-[#fffaf1]/78 px-4 py-2 text-sm text-[#22201c] placeholder-[#8a8174] focus:border-[#7f9f94] focus:outline-none"
            placeholder="Title *"
            value={title}
            onChange={(e) => setTitle(e.target.value)}
          />

          <input
            className="w-full rounded-lg border border-[#22201c]/12 bg-[#fffaf1]/78 px-4 py-2 text-sm text-[#22201c] placeholder-[#8a8174] focus:border-[#7f9f94] focus:outline-none"
            placeholder="Brand"
            value={brand}
            onChange={(e) => setBrand(e.target.value)}
          />

          {/* Platform — controlled select */}
          <select
            className="w-full rounded-lg border border-[#22201c]/12 bg-[#fffaf1]/78 px-4 py-2 text-sm text-[#3a352d] focus:border-[#7f9f94] focus:outline-none"
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
            className="w-full rounded-lg border border-[#22201c]/12 bg-[#fffaf1]/78 px-4 py-2 text-sm text-[#22201c] placeholder-[#8a8174] focus:border-[#7f9f94] focus:outline-none"
            placeholder="Niche (skincare, fitness...)"
            value={niche}
            onChange={(e) => setNiche(e.target.value)}
          />

          <input
            className="w-full rounded-lg border border-[#22201c]/12 bg-[#fffaf1]/78 px-4 py-2 text-sm text-[#22201c] placeholder-[#8a8174] focus:border-[#7f9f94] focus:outline-none"
            placeholder="Image URL"
            value={imageUrl}
            onChange={(e) => setImageUrl(e.target.value)}
          />
        </div>

        {/* Emotion Tags */}
        <div className="space-y-2">
          <p className="text-xs font-semibold uppercase tracking-wider text-[#7c7265]">
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
          <p className="text-xs font-semibold uppercase tracking-wider text-[#7c7265]">
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
          <p className="text-xs font-semibold uppercase tracking-wider text-[#7c7265]">
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
        <div className="space-y-2.5">
          <textarea
            className="w-full resize-none rounded-lg border border-[#22201c]/12 bg-[#fffaf1]/78 px-4 py-2 text-sm text-[#22201c] placeholder-[#8a8174] focus:border-[#7f9f94] focus:outline-none"
            placeholder="Hook text"
            rows={2}
            value={hook}
            onChange={(e) => setHook(e.target.value)}
          />

          <textarea
            className="w-full resize-none rounded-lg border border-[#22201c]/12 bg-[#fffaf1]/78 px-4 py-2 text-sm text-[#22201c] placeholder-[#8a8174] focus:border-[#7f9f94] focus:outline-none"
            placeholder="CTA"
            rows={2}
            value={cta}
            onChange={(e) => setCta(e.target.value)}
          />

          <textarea
            className="w-full resize-none rounded-lg border border-[#22201c]/12 bg-[#fffaf1]/78 px-4 py-2 text-sm text-[#22201c] placeholder-[#8a8174] focus:border-[#7f9f94] focus:outline-none"
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
              ? "bg-[#22201c] text-[#fffaf1] hover:bg-[#3a352d]"
              : "bg-[#e1d9cd] text-[#9b9285] cursor-not-allowed"
          }`}
        >
          {submitting ? "Saving..." : "Save Creative"}
        </button>

      </div>
        </div>
      )}
    </div>
  );
}
