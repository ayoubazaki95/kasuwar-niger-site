"use client";

import { useState } from "react";

export default function ImageSlider({
  images,
  fallbackColor,
  className = "",
  alt = "",
}: {
  images?: string[];
  fallbackColor: string;
  className?: string;
  alt?: string;
}) {
  const [index, setIndex] = useState(0);
  const list = (images || []).filter(Boolean);

  if (list.length === 0) {
    return <div className={`bg-gradient-to-br ${fallbackColor} ${className}`} />;
  }

  return (
    <div className={`relative overflow-hidden ${className}`}>
      {/* eslint-disable-next-line @next/next/no-img-element */}
      <img
        src={list[index]}
        alt={alt}
        className="w-full h-full object-cover animate-fade-in"
        key={index}
      />
      {list.length > 1 && (
        <div className="absolute bottom-1.5 left-0 right-0 flex items-center justify-center gap-1">
          {list.map((_, i) => (
            <button
              key={i}
              onClick={(e) => {
                e.preventDefault();
                e.stopPropagation();
                setIndex(i);
              }}
              className={`w-1.5 h-1.5 rounded-full transition-all ${i === index ? "bg-white w-3" : "bg-white/50"}`}
              aria-label={`Image ${i + 1}`}
            />
          ))}
        </div>
      )}
    </div>
  );
}
