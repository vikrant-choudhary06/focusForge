"use client";

import { useState, useCallback } from "react";
import { AudioProvider } from "@/types";

export interface PresetTrack {
  id: string;
  name: string;
  provider: AudioProvider;
  url: string;
  category: "lofi" | "nature" | "ambient" | "binaural";
}

export const PRESET_TRACKS: PresetTrack[] = [
  {
    id: "lofi-girl",
    name: "Lofi Hip Hop Radio - Beats to Relax/Study to",
    provider: "youtube",
    url: "https://www.youtube.com/embed/jfKfPfyJRdk?autoplay=1",
    category: "lofi",
  },
  {
    id: "rainy-cafe",
    name: "Rain & Coffee Shop Ambience",
    provider: "youtube",
    url: "https://www.youtube.com/embed/lTRiuFIWV54?autoplay=1",
    category: "nature",
  },
  {
    id: "deep-focus-spotify",
    name: "Deep Focus Playlist",
    provider: "spotify",
    url: "https://open.spotify.com/embed/playlist/37i9dQZF1DX4sWSpwq3LiO?utm_source=generator&theme=0",
    category: "ambient",
  },
  {
    id: "peaceful-piano",
    name: "Peaceful Piano Focus",
    provider: "spotify",
    url: "https://open.spotify.com/embed/playlist/37i9dQZF1DX4sWSpwq3LiO",
    category: "lofi",
  },
];

export function useAudioPlayer() {
  const [provider, setProvider] = useState<AudioProvider>("none");
  const [currentTrack, setCurrentTrack] = useState<PresetTrack | null>(null);
  const [isDockOpen, setIsDockOpen] = useState(false);
  const [volume, setVolume] = useState<number>(0.8);

  const selectTrack = useCallback((track: PresetTrack) => {
    setCurrentTrack(track);
    setProvider(track.provider);
  }, []);

  const clearTrack = useCallback(() => {
    setCurrentTrack(null);
    setProvider("none");
  }, []);

  const toggleDock = useCallback(() => {
    setIsDockOpen((prev) => !prev);
  }, []);

  return {
    provider,
    setProvider,
    currentTrack,
    selectTrack,
    clearTrack,
    isDockOpen,
    setIsDockOpen,
    toggleDock,
    volume,
    setVolume,
    presetTracks: PRESET_TRACKS,
  };
}
