"use client";

import { useState } from "react";
import { supabase } from "@/lib/supabase";

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
  
  const EMOTION_OPTIONS = [
  "curiosity",
  "urgency",
  "fear",
  "aspiration",
  "status",
  "trust",
  "scarcity",
  "hope",
  "satisfaction",
  ];
  const HOOK_OPTIONS = [
    "before-after",
    "problem-solution",
    "comparison",
    "authority",
    "social-proof",
    "demonstration",
    "urgency",
  ];
  const VISUAL_OPTIONS = [
  "ugc",
  "cinematic",
  "clean",
  "minimal",
  "luxury",
  ];


    const toggleSelection = (
    value: string,
    current: string[],
    setter: React.Dispatch<React.SetStateAction<string[]>>
  ) => {
    if (current.includes(value)) {
      setter(current.filter((item) => item !== value));
    } else {
      setter([...current, value]);
    }
  };

  const handleSubmit = async () => {

    const { data, error } = await supabase.from("creatives").insert([
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

    if (error) {
      alert("Error: " + error.message);
    } else {
      alert("Saved!");

      // ✅ RESET FORM
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

      console.log(data);
    }
  };

  return (
    <div className="p-8 max-w-xl mx-auto space-y-4">
      <h1 className="text-2xl font-bold">Add Creative</h1>

      <input
        className="w-full border p-2"
        placeholder="Title"
        value={title}
        onChange={(e) => setTitle(e.target.value)}
      />

      <input
        className="w-full border p-2"
        placeholder="Brand"
        value={brand}
        onChange={(e) => setBrand(e.target.value)}
      />

      <input
        className="w-full border p-2"
        placeholder="Platform (Amazon/TikTok)"
        value={platform}
        onChange={(e) => setPlatform(e.target.value)}
      />

      <input
        className="w-full border p-2"
        placeholder="Niche (Skincare, Fitness...)"
        value={niche}
        onChange={(e) => setNiche(e.target.value)}
      />

      <input
        className="w-full border p-2"
        placeholder="Image URL"
        value={imageUrl}
        onChange={(e) => setImageUrl(e.target.value)}
      />

      <div className="mb-4">
      <p className="text-sm font-semibold mb-2">Emotion Tags</p>
      <div className="flex flex-wrap gap-2">
        {EMOTION_OPTIONS.map((emotion) => (
          <button
            type="button"
            key={emotion}
            onClick={() =>
              toggleSelection(emotion, emotionTags, setEmotionTags)
            }
            className={`px-3 py-1 rounded-full text-sm border ${
              emotionTags.includes(emotion)
                ? "bg-white text-black"
                : "bg-black text-white border-gray-700"
            }`}
          >
            {emotion}
          </button>
        ))}
        </div>
        </div>

      <div className="mb-4">
            <p className="text-sm font-semibold mb-2">Hook Types</p>
            <div className="flex flex-wrap gap-2">
              {HOOK_OPTIONS.map((hook) => (
                <button
                  type="button"
                  key={hook}
                  onClick={() =>
                    toggleSelection(hook, hookTypes, setHookTypes)
                  }
                  className={`px-3 py-1 rounded-full text-sm border ${
                    hookTypes.includes(hook)
                      ? "bg-white text-black"
                      : "bg-black text-white border-gray-700"
                  }`}
                >
                  {hook}
                </button>
              ))}
        </div>
        </div>

        <div className="mb-4">
        <p className="text-sm font-semibold mb-2">Visual Styles</p>
        <div className="flex flex-wrap gap-2">
            {VISUAL_OPTIONS.map((visual) => (
              <button
                type="button"
                key={visual}
                onClick={() =>
                  toggleSelection(visual, visualStyles, setVisualStyles)
                }
                className={`px-3 py-1 rounded-full text-sm border ${
                  visualStyles.includes(visual)
                    ? "bg-white text-black"
                    : "bg-black text-white border-gray-700"
                }`}
              >
                {visual}
              </button>
            ))}
          </div>
        </div>

      <textarea
        className="w-full border p-2"
        placeholder="Hook"
        value={hook}
        onChange={(e) => setHook(e.target.value)}
      />

      <textarea
        className="w-full border p-2"
        placeholder="CTA"
        value={cta}
        onChange={(e) => setCta(e.target.value)}
      />

      <textarea
        className="w-full border p-2"
        placeholder="Notes"
        value={notes}
        onChange={(e) => setNotes(e.target.value)}
      />

      <button
        onClick={handleSubmit}
        className="bg-black text-white px-4 py-2"
      >
        Save Creative
      </button>
    </div>
  ); 
}