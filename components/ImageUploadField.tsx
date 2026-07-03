"use client";

import { useRef, useState } from "react";
import { ImagePlus, X } from "lucide-react";
import { fileToCompressedDataUrl } from "@/lib/image-utils";

export default function ImageUploadField({
  images,
  onChange,
  label = "Photos (2 recommandées)",
  max = 4,
}: {
  images: string[];
  onChange: (images: string[]) => void;
  label?: string;
  max?: number;
}) {
  const inputRef = useRef<HTMLInputElement>(null);
  const [busy, setBusy] = useState(false);
  const [error, setError] = useState("");

  const handleFiles = async (files: FileList | null) => {
    if (!files || files.length === 0) return;
    setError("");
    setBusy(true);
    try {
      const remaining = Math.max(0, max - images.length);
      const toProcess = Array.from(files).slice(0, remaining);
      const results = await Promise.all(toProcess.map((f) => fileToCompressedDataUrl(f)));
      onChange([...images, ...results]);
    } catch {
      setError("Impossible de charger cette image. Réessayez avec une autre photo.");
    } finally {
      setBusy(false);
      if (inputRef.current) inputRef.current.value = "";
    }
  };

  const removeAt = (i: number) => {
    onChange(images.filter((_, idx) => idx !== i));
  };

  return (
    <div className="md:col-span-2">
      <span className="text-xs font-semibold text-inkSoft">{label}</span>
      <div className="flex flex-wrap gap-2 mt-1.5">
        {images.map((src, i) => (
          // eslint-disable-next-line @next/next/no-img-element
          <div key={i} className="relative w-20 h-20 rounded-xl overflow-hidden border border-line">
            <img src={src} alt={`Photo ${i + 1}`} className="w-full h-full object-cover" />
            <button
              type="button"
              onClick={() => removeAt(i)}
              className="absolute top-1 right-1 w-5 h-5 rounded-full bg-ink/70 flex items-center justify-center"
            >
              <X size={11} className="text-white" />
            </button>
          </div>
        ))}
        {images.length < max && (
          <button
            type="button"
            onClick={() => inputRef.current?.click()}
            disabled={busy}
            className="w-20 h-20 rounded-xl border border-dashed border-line flex flex-col items-center justify-center gap-1 text-inkSoft"
          >
            <ImagePlus size={16} />
            <span className="text-[9px] font-medium">{busy ? "..." : "Ajouter"}</span>
          </button>
        )}
      </div>
      <input
        ref={inputRef}
        type="file"
        accept="image/*"
        multiple
        className="hidden"
        onChange={(e) => handleFiles(e.target.files)}
      />
      {error && <p className="text-[11px] text-orange mt-1">{error}</p>}
      <p className="text-[10px] text-inkSoft mt-1">
        Stockées dans ce navigateur (pas de serveur d&apos;images) — jusqu&apos;à {max} photos, compressées automatiquement.
      </p>
    </div>
  );
}
