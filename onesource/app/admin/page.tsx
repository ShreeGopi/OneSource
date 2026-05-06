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

  const [emotionTags, setEmotionTags] = useState("");
  const [hookTypes, setHookTypes] = useState("");
  const [visualStyles, setVisualStyles] = useState("");

  // 🔥 CLEAN FUNCTION (STEP 9 CORE)
  const cleanTags = (input: string) => {
    return Array.from(
      new Set(
        input
          .split(",")
          .map((tag) => tag.trim().toLowerCase())
          .filter((tag) => tag !== "")
      )
    );
  };

  const handleSubmit = async () => {
    const cleanedEmotionTags = cleanTags(emotionTags);
    const cleanedHookTypes = cleanTags(hookTypes);
    const cleanedVisualStyles = cleanTags(visualStyles);

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
        emotion_tags: cleanedEmotionTags,
        hook_types: cleanedHookTypes,
        visual_styles: cleanedVisualStyles,
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
      setEmotionTags("");
      setHookTypes("");
      setVisualStyles("");

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

      <input
        className="w-full border p-2"
        placeholder="Emotion Tags (comma separated)"
        value={emotionTags}
        onChange={(e) => setEmotionTags(e.target.value)}
      />

      <input
        className="w-full border p-2"
        placeholder="Hook Types (comma separated)"
        value={hookTypes}
        onChange={(e) => setHookTypes(e.target.value)}
      />

      <input
        className="w-full border p-2"
        placeholder="Visual Styles (comma separated)"
        value={visualStyles}
        onChange={(e) => setVisualStyles(e.target.value)}
      />

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