"use client";

import React, { useState } from "react";
import { Headphones, Radio, Music, ChevronUp, ChevronDown, X } from "lucide-react";

type AudioSource = "spotify" | "youtube" | "off";

export const AudioDock: React.FC = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [activeSource, setActiveSource] = useState<AudioSource>("spotify");

  const spotifyEmbedUrl =
    "https://open.spotify.com/embed/playlist/37i9dQZF1DX8Uebhn9wzrS?utm_source=generator&theme=0";
  const youtubeEmbedUrl =
    "https://www.youtube.com/embed/jfKfPfyJRdk?autoplay=0&enablejsapi=1";

  return (
    <div className="fixed bottom-6 left-1/2 -translate-x-1/2 z-50 flex flex-col items-center">
      {/* Expanded Audio Card */}
      {isOpen && (
        <div className="mb-3 w-80 sm:w-96 bg-[#FAF9F6] border border-stone-300 rounded-2xl shadow-tactile-hover p-4 animate-in fade-in slide-in-from-bottom-3 duration-200">
          {/* Header */}
          <div className="flex items-center justify-between pb-3 border-b border-stone-200">
            <div className="flex items-center gap-2">
              <Headphones className="w-4 h-4 text-amber-700" />
              <h4 className="font-medium text-xs text-stone-900 tracking-wide uppercase">
                Ambient Focus Companion
              </h4>
            </div>
            <button
              onClick={() => setIsOpen(false)}
              className="p-1 rounded-md text-stone-400 hover:text-stone-700 hover:bg-stone-100 transition"
              aria-label="Close audio player"
            >
              <X className="w-4 h-4" />
            </button>
          </div>

          {/* Source Toggle Tabs */}
          <div className="flex items-center gap-1.5 p-1 bg-stone-100 rounded-xl my-3 border border-stone-200/80">
            <button
              onClick={() => setActiveSource("spotify")}
              className={`flex-1 flex items-center justify-center gap-1.5 py-1.5 text-xs font-medium rounded-lg transition-all ${
                activeSource === "spotify"
                  ? "bg-[#FAF9F6] text-stone-900 shadow-sm border border-stone-200"
                  : "text-stone-500 hover:text-stone-800"
              }`}
            >
              <Radio className="w-3.5 h-3.5 text-emerald-700" />
              <span>Spotify Flow</span>
            </button>
            <button
              onClick={() => setActiveSource("youtube")}
              className={`flex-1 flex items-center justify-center gap-1.5 py-1.5 text-xs font-medium rounded-lg transition-all ${
                activeSource === "youtube"
                  ? "bg-[#FAF9F6] text-stone-900 shadow-sm border border-stone-200"
                  : "text-stone-500 hover:text-stone-800"
              }`}
            >
              <Music className="w-3.5 h-3.5 text-amber-700" />
              <span>Lofi Stream</span>
            </button>
          </div>

          {/* Player Display */}
          <div className="overflow-hidden rounded-xl border border-stone-200 bg-stone-50 shadow-inner">
            {activeSource === "spotify" ? (
              <iframe
                src={spotifyEmbedUrl}
                width="100%"
                height="152"
                frameBorder="0"
                allow="autoplay; clipboard-write; encrypted-media; fullscreen; picture-in-picture"
                loading="lazy"
                title="Spotify Ambient Focus Player"
                className="rounded-xl"
              />
            ) : (
              <div className="aspect-video w-full">
                <iframe
                  src={youtubeEmbedUrl}
                  width="100%"
                  height="100%"
                  frameBorder="0"
                  allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                  allowFullScreen
                  title="YouTube Lofi Stream Player"
                  className="w-full h-full rounded-xl"
                />
              </div>
            )}
          </div>
        </div>
      )}

      {/* Floating Pill Dock Button */}
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="flex items-center gap-2.5 px-5 py-2.5 rounded-full bg-[#FAF9F6] border border-stone-300 text-stone-800 shadow-tactile hover:shadow-tactile-hover hover:border-stone-400 active:scale-95 transition-all duration-200"
      >
        <Headphones className="w-4 h-4 text-amber-700" />
        <span className="text-xs font-medium tracking-wide">
          {isOpen ? "Hide Audio Dock" : "Ambient Soundtracks"}
        </span>
        {isOpen ? (
          <ChevronDown className="w-3.5 h-3.5 text-stone-400" />
        ) : (
          <ChevronUp className="w-3.5 h-3.5 text-stone-400" />
        )}
      </button>
    </div>
  );
};
