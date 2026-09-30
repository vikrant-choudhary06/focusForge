"use client";

import React, { Suspense, useState, useEffect } from "react";
import { useSearchParams } from "next/navigation";
import { Flame, Radio, Youtube } from "lucide-react";

function PlayerView() {
  const searchParams = useSearchParams();
  const initialSource = (searchParams.get("source") as "spotify" | "youtube") || "spotify";
  const initialUrl = searchParams.get("url");

  const [source, setSource] = useState<"spotify" | "youtube">(initialSource);
  const [spotifyUrl, setSpotifyUrl] = useState<string>(
    initialUrl && initialSource === "spotify"
      ? initialUrl
      : "https://open.spotify.com/embed/playlist/37i9dQZF1DX8Uebhn9wzrS?utm_source=generator&theme=0"
  );
  const [youtubeUrl, setYoutubeUrl] = useState<string>(
    initialUrl && initialSource === "youtube"
      ? initialUrl
      : "https://www.youtube.com/embed/jfKfPfyJRdk?autoplay=1"
  );

  useEffect(() => {
    try {
      const savedSpotify = localStorage.getItem("focusforge_custom_spotify_url");
      if (savedSpotify && !initialUrl) setSpotifyUrl(savedSpotify);
      const savedYoutube = localStorage.getItem("focusforge_custom_youtube_url");
      if (savedYoutube && !initialUrl) setYoutubeUrl(savedYoutube);
    } catch (e) {
      console.error(e);
    }
  }, [initialUrl]);

  return (
    <div className="min-h-screen bg-[#0F1015] text-slate-100 flex flex-col p-4 select-none">
      {/* Top Header */}
      <div className="flex items-center justify-between pb-3 border-b border-white/10">
        <div className="flex items-center gap-2">
          <Flame className="w-4 h-4 text-red-400 animate-pulse" />
          <span className="font-bold text-sm tracking-wide text-white">
            FocusForge Soundscapes
          </span>
        </div>
        <span className="text-[10px] uppercase font-mono tracking-wider text-emerald-400 bg-emerald-950/60 border border-emerald-800 px-2 py-0.5 rounded-full">
          Live Detached
        </span>
      </div>

      {/* Tabs */}
      <div className="flex items-center gap-1.5 p-1 bg-white/5 rounded-xl my-3 border border-white/10">
        <button
          onClick={() => setSource("spotify")}
          className={`flex-1 flex items-center justify-center gap-1.5 py-1.5 text-xs font-semibold rounded-lg transition-all ${
            source === "spotify"
              ? "bg-white/15 text-white shadow-sm border border-white/20"
              : "text-slate-400 hover:text-white"
          }`}
        >
          <Radio className="w-3.5 h-3.5 text-emerald-400" />
          <span>Spotify</span>
        </button>
        <button
          onClick={() => setSource("youtube")}
          className={`flex-1 flex items-center justify-center gap-1.5 py-1.5 text-xs font-semibold rounded-lg transition-all ${
            source === "youtube"
              ? "bg-white/15 text-white shadow-sm border border-white/20"
              : "text-slate-400 hover:text-white"
          }`}
        >
          <Youtube className="w-3.5 h-3.5 text-rose-500" />
          <span>YouTube Lofi</span>
        </button>
      </div>

      {/* Main Player Embed */}
      <div className="flex-1 flex flex-col justify-center rounded-2xl overflow-hidden border border-white/10 bg-black/40 p-2 shadow-inner">
        {source === "spotify" ? (
          <div className="w-full flex-1 flex flex-col justify-center">
            <iframe
              src={spotifyUrl}
              width="100%"
              height="352"
              frameBorder="0"
              allow="autoplay; clipboard-write; encrypted-media; fullscreen; picture-in-picture"
              loading="lazy"
              title="Spotify Independent Mini Player"
              className="rounded-xl w-full"
            />
          </div>
        ) : (
          <div className="w-full aspect-video rounded-xl overflow-hidden bg-black">
            <iframe
              src={youtubeUrl}
              width="100%"
              height="100%"
              frameBorder="0"
              allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
              allowFullScreen
              title="YouTube Lofi Independent Player"
              className="w-full h-full rounded-xl"
            />
          </div>
        )}
      </div>

      {/* Bottom Hint */}
      <div className="pt-3 text-center">
        <p className="text-[11px] text-slate-500 font-mono italic">
          Keep this pop-up open in the background for continuous uninterrupted focus soundscapes.
        </p>
      </div>
    </div>
  );
}

export default function PlayerPage() {
  return (
    <Suspense
      fallback={
        <div className="min-h-screen bg-[#0F1015] text-slate-400 flex items-center justify-center text-xs">
          Loading player companion...
        </div>
      }
    >
      <PlayerView />
    </Suspense>
  );
}
