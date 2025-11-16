"use client";

import { useState } from "react";

interface ImageSliderProps {
  photos: string[];
}

export default function ImageSlider({ photos }: ImageSliderProps) {
  const [selectedIndex, setSelectedIndex] = useState(0);

  if (photos.length === 0) {
    return null;
  }

  return (
    <div className="mb-6">
      <div className="relative mb-4">
        <img
          src={photos[selectedIndex]}
          alt={`Photo ${selectedIndex + 1}`}
          className="w-full h-96 object-cover rounded-lg"
        />
        
        {/* Navigation flèches */}
        {photos.length > 1 && (
          <>
            <button
              onClick={() => setSelectedIndex((prev) => (prev - 1 + photos.length) % photos.length)}
              className="absolute left-2 top-1/2 -translate-y-1/2 bg-black/50 text-white p-2 rounded-full hover:bg-black/70 transition-colors"
            >
              ←
            </button>
            <button
              onClick={() => setSelectedIndex((prev) => (prev + 1) % photos.length)}
              className="absolute right-2 top-1/2 -translate-y-1/2 bg-black/50 text-white p-2 rounded-full hover:bg-black/70 transition-colors"
            >
              →
            </button>
          </>
        )}
      </div>

      {/* Miniatures */}
      {photos.length > 1 && (
        <div className="flex gap-2 overflow-x-auto pb-2">
          {photos.map((photo: string, idx: number) => (
            <button
              key={idx}
              onClick={() => setSelectedIndex(idx)}
              className={`flex-shrink-0 rounded-lg overflow-hidden border-2 transition-all ${
                idx === selectedIndex
                  ? "border-indigo-500 scale-105"
                  : "border-gray-300 hover:border-gray-400"
              }`}
            >
              <img
                src={photo}
                alt={`Miniature ${idx + 1}`}
                className="w-20 h-20 object-cover"
              />
            </button>
          ))}
        </div>
      )}
    </div>
  );
}
