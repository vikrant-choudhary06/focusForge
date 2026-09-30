"use client";

import React, { useState } from "react";
import { Music, Radio, Volume2, X, ChevronUp, ChevronDown, Disc } from "lucide-react";
import { PRESET_TRACKS, PresetTrack } from "@/hooks/useAudioPlayer";
import { SpotifyEmbed } from "./SpotifyEmbed";
import { YouTubeEmbed } from "./YouTubeEmbed";
import { Button } from "@/components/ui/Button";

interface AudioDockProps {
  selectedTrack: PresetTrack | null;
  onSelectTrack: (track: PresetTrack) => void;
  onClearTrack: () => void;
}

export const AudioDock: React.FC<AudioDockProps> = ({
  selectedTrack,
  onSelectTrack,
  onClearTrack,
}) => {
  const [isOpen, setIsOpen] = useState(false);
  const [activeCategory, setActiveCategory] = useState<string>("all");

  const categories = [
    { id: "all", label: "All Sounds" },
    { id: "lofi", label: "Lofi Beats" },
    { id: "nature", label: "Nature Ambience" },
    { id: "ambient", label: "Deep Ambient" },
  ];

  const filteredTracks =
    activeCategory === "all"
      ? PRESET_TRACKS
      : PRESET_TRACKS.filter((t) => t.category === activeCategory);

  return (
    <div className="fixed bottom-6 right-6 z-40 flex flex-col items-end">
      {/* Expanded Dock Panel */}
      {isOpen && (
        <div className="mb-3 w-80 sm:w-96 bg-slate-900/95 backdrop-blur-xl border border-slate-800 rounded-2xl shadow-2xl p-4 animate-in fade-in slide-in-from-bottom-5 duration-200">
          <div className="flex items-center justify-between pb-3 border-b border-slate-800">
            <div className="flex items-center gap-2">
              <Disc className="w-5 h-5 text-indigo-400 animate-spin" style={{ animationDuration: "8s" }} />
              <h4 className="font-semibold text-sm text-slate-100">Audio Workspace Dock</h4>
            </div>
            <button
              onClick={() => setIsOpen(false)}
              className="p-1 rounded-lg text-slate-400 hover:text-white hover:bg-slate-800 transition"
            >
              <X className="w-4 h-4" />
            </button>
          </div>

          {/* Active Player */}
          {selectedTrack && (
            <div className="my-3 p-3 bg-slate-950/80 rounded-xl border border-slate-800">
              <div className="flex items-center justify-between mb-2">
                <span className="text-xs font-medium text-indigo-400 uppercase tracking-wider">
                  Now Playing ({selectedTrack.provider})
                </span>
                <button
                  onClick={onClearTrack}
                  className="text-xs text-rose-400 hover:text-rose-300 font-medium"
                >
                  Stop Audio
                </button>
              </div>
              <p className="text-sm font-medium text-slate-200 mb-2 truncate">
                {selectedTrack.name}
              </p>

              {selectedTrack.provider === "spotify" ? (
                <SpotifyEmbed url={selectedTrack.url} />
              ) : (
                <YouTubeEmbed url={selectedTrack.url} />
              )}
            </div>
          )}

          {/* Filter Categories */}
          <div className="flex gap-1 overflow-x-auto py-2 scrollbar-none">
            {categories.map((cat) => (
              <button
                key={cat.id}
                onClick={() => setActiveCategory(cat.id)}
                className={`px-2.5 py-1 text-xs rounded-lg font-medium whitespace-nowrap transition ${
                  activeCategory === cat.id
                    ? "bg-indigo-600 text-white"
                    : "text-slate-400 hover:text-slate-200 hover:bg-slate-800"
                }`}
              >
                {cat.label}
              </button>
            ))}
          </div>

          {/* Track Selection List */}
          <div className="space-y-1.5 max-h-48 overflow-y-auto mt-2 pr-1">
            {filteredTracks.map((track) => {
              const isCurrent = selectedTrack?.id === track.id;
              return (
                <button
                  key={track.id}
                  onClick={() => onSelectTrack(track)}
                  className={`w-full flex items-center justify-between p-2 rounded-xl text-left text-xs transition ${
                    isCurrent
                      ? "bg-indigo-600/20 text-indigo-300 border border-indigo-500/40"
                      : "bg-slate-800/40 text-slate-300 hover:bg-slate-800 border border-transparent"
                  }`}
                >
                  <div className="flex items-center gap-2 truncate">
                    {track.provider === "spotify" ? (
                      <Radio className="w-3.5 h-3.5 text-emerald-400 flex-shrink-0" />
                    ) : (
                      <Music className="w-3.5 h-3.5 text-rose-400 flex-shrink-0" />
                    )}
                    <span className="truncate">{track.name}</span>
                  </div>
                  <span className="text-[10px] text-slate-500 uppercase ml-2 flex-shrink-0">
                    {track.category}
                  </span>
                </button>
              );
            })}
          </div>
        </div>
      )}

      {/* Floating Toggle Button */}
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="flex items-center gap-2.5 px-4 py-2.5 rounded-full bg-slate-900 border border-indigo-500/40 text-slate-100 shadow-glow hover:border-indigo-400 hover:scale-105 active:scale-95 transition-all duration-200"
      >
        <Volume2 className="w-4 h-4 text-indigo-400" />
        <span className="text-xs font-semibold">
          {selectedTrack ? "Audio Active" : "Soundtracks & Ambience"}
        </span>
        {isOpen ? (
          <ChevronDown className="w-3.5 h-3.5 text-slate-400" />
        ) : (
          <ChevronUp className="w-3.5 h-3.5 text-slate-400" />
        )}
      </button>
    </div>
  );
};
