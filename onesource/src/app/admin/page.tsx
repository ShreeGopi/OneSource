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
      },
    ]);

    if (error) {
      alert("Error: " + error.message);
    } else {
      alert("Saved!");
      console.log(data);
    }
  };

  return (
    <div className="p-8 max-w-xl mx-auto space-y-4">
      <h1 className="text-2xl font-bold">Add Creative</h1>

      <input
        className="w-full border p-2"
        placeholder="Title"
        onChange={(e) => setTitle(e.target.value)}
      />

      <input
        className="w-full border p-2"
        placeholder="Brand"
        onChange={(e) => setBrand(e.target.value)}
      />

      <input
        className="w-full border p-2"
        placeholder="Platform (Amazon/TikTok)"
        onChange={(e) => setPlatform(e.target.value)}
      />

      <input
        className="w-full border p-2"
        placeholder="Niche (Skincare, Fitness...)"
        onChange={(e) => setNiche(e.target.value)}
      />

      <input
        className="w-full border p-2"
        placeholder="Image URL"
        onChange={(e) => setImageUrl(e.target.value)}
      />

      <textarea
        className="w-full border p-2"
        placeholder="Hook"
        onChange={(e) => setHook(e.target.value)}
      />

      <textarea
        className="w-full border p-2"
        placeholder="CTA"
        onChange={(e) => setCta(e.target.value)}
      />

      <textarea
        className="w-full border p-2"
        placeholder="Notes"
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