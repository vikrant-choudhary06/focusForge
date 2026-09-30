"use client";

import React, { useState, useEffect, useRef } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
  Headphones,
  Radio,
  Youtube,
  ExternalLink,
  ChevronUp,
  ChevronDown,
  Link as LinkIcon,
  X,
  Maximize2,
} from "lucide-react";

type AudioSource = "spotify" | "youtube";

interface PresetTrack {
  id: string;
  name: string;
  url: string;
  appUrl: string;
}

const SPOTIFY_PRESETS: PresetTrack[] = [
  {
    id: "deep-focus",
    name: "Deep Focus (Ambient)",
    url: "https://open.spotify.com/embed/playlist/37i9dQZF1DX8Uebhn9wzrS?utm_source=generator&theme=0",
    appUrl: "https://open.spotify.com/playlist/37i9dQZF1DX8Uebhn9wzrS",
  },
  {
    id: "peaceful-piano",
    name: "Peaceful Piano",
    url: "https://open.spotify.com/embed/playlist/37i9dQZF1DX4sWSpwq3LiO?utm_source=generator&theme=0",
    appUrl: "https://open.spotify.com/playlist/37i9dQZF1DX4sWSpwq3LiO",
  },
  {
    id: "lofi-beats",
    name: "Lofi Beats",
    url: "https://open.spotify.com/embed/playlist/37i9dQZF1DXdLEN7aqioXM?utm_source=generator&theme=0",
    appUrl: "https://open.spotify.com/playlist/37i9dQZF1DXdLEN7aqioXM",
  },
  {
    id: "binaural-alpha",
    name: "Binaural Alpha Waves",
    url: "https://open.spotify.com/embed/playlist/37i9dQZF1DX7EF893k2BaM?utm_source=generator&theme=0",
    appUrl: "https://open.spotify.com/playlist/37i9dQZF1DX7EF893k2BaM",
  },
];

const YOUTUBE_PRESETS: PresetTrack[] = [
  {
    id: "lofi-girl",
    name: "Lofi Girl (Live 24/7)",
    url: "https://www.youtube.com/embed/jfKfPfyJRdk?autoplay=0",
    appUrl: "https://www.youtube.com/watch?v=jfKfPfyJRdk",
  },
  {
    id: "rainy-cafe",
    name: "Rain & Coffee Shop Ambience",
    url: "https://www.youtube.com/embed/lTRiuFIWV54?autoplay=0",
    appUrl: "https://www.youtube.com/watch?v=lTRiuFIWV54",
  },
  {
    id: "synthwave-radio",
    name: "Synthwave / Chillwave Radio",
    url: "https://www.youtube.com/embed/4xDzrJKXOOY?autoplay=0",
    appUrl: "https://www.youtube.com/watch?v=4xDzrJKXOOY",
  },
  {
    id: "binaural-study",
    name: "Binaural Alpha Waves",
    url: "https://www.youtube.com/embed/WPni755-Krg?autoplay=0",
    appUrl: "https://www.youtube.com/watch?v=WPni755-Krg",
  },
];

export const MediaDock: React.FC = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [activeSource, setActiveSource] = useState<AudioSource>("spotify");

  const [spotifyUrl, setSpotifyUrl] = useState<string>(SPOTIFY_PRESETS[0].url);
  const [selectedSpotifyPreset, setSelectedSpotifyPreset] = useState<string>(
    SPOTIFY_PRESETS[0].id
  );
  const [customSpotifyInput, setCustomSpotifyInput] = useState<string>("");

  const [youtubeUrl, setYoutubeUrl] = useState<string>(YOUTUBE_PRESETS[0].url);
  const [selectedYoutubePreset, setSelectedYoutubePreset] = useState<string>(
    YOUTUBE_PRESETS[0].id
  );
  const [customYoutubeInput, setCustomYoutubeInput] = useState<string>("");

  const [isCustomLinkOpen, setIsCustomLinkOpen] = useState(false);
  const popoverRef = useRef<HTMLDivElement>(null);

  // Restore persisted sound preferences
  useEffect(() => {
    try {
      const savedSource = localStorage.getItem("focusforge_media_source") as AudioSource;
      if (savedSource === "spotify" || savedSource === "youtube") {
        setActiveSource(savedSource);
      }

      const savedSpotify = localStorage.getItem("focusforge_custom_spotify_url");
      if (savedSpotify) {
        setSpotifyUrl(savedSpotify);
        const matched = SPOTIFY_PRESETS.find((p) => p.url === savedSpotify);
        if (matched) setSelectedSpotifyPreset(matched.id);
        else setSelectedSpotifyPreset("custom");
      }

      const savedYoutube = localStorage.getItem("focusforge_custom_youtube_url");
      if (savedYoutube) {
        setYoutubeUrl(savedYoutube);
        const matched = YOUTUBE_PRESETS.find((p) => p.url === savedYoutube);
        if (matched) setSelectedYoutubePreset(matched.id);
        else setSelectedYoutubePreset("custom");
      }
    } catch (e) {
      console.error("Failed to load soundscapes from localStorage", e);
    }
  }, []);

  // Handle outside click for custom link popover
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (popoverRef.current && !popoverRef.current.contains(event.target as Node)) {
        setIsCustomLinkOpen(false);
      }
    };
    if (isCustomLinkOpen) {
      document.addEventListener("mousedown", handleClickOutside);
    }
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, [isCustomLinkOpen]);

  const handleSourceChange = (src: AudioSource) => {
    setActiveSource(src);
    try {
      localStorage.setItem("focusforge_media_source", src);
    } catch (e) {
      console.error(e);
    }
  };

  const handleSpotifyPresetChange = (presetId: string) => {
    setSelectedSpotifyPreset(presetId);
    if (presetId === "custom") {
      setIsCustomLinkOpen(true);
      return;
    }
    const preset = SPOTIFY_PRESETS.find((p) => p.id === presetId);
    if (preset) {
      setSpotifyUrl(preset.url);
      try {
        localStorage.setItem("focusforge_custom_spotify_url", preset.url);
      } catch (e) {
        console.error(e);
      }
    }
  };

  const handleYoutubePresetChange = (presetId: string) => {
    setSelectedYoutubePreset(presetId);
    if (presetId === "custom") {
      setIsCustomLinkOpen(true);
      return;
    }
    const preset = YOUTUBE_PRESETS.find((p) => p.id === presetId);
    if (preset) {
      setYoutubeUrl(preset.url);
      try {
        localStorage.setItem("focusforge_custom_youtube_url", preset.url);
      } catch (e) {
        console.error(e);
      }
    }
  };

  const handleApplyCustomSpotify = (e: React.FormEvent) => {
    e.preventDefault();
    if (!customSpotifyInput.trim()) return;

    let input = customSpotifyInput.trim();
    let embedFormatted = input;

    if (input.includes("open.spotify.com/") && !input.includes("/embed/")) {
      embedFormatted = input.replace("open.spotify.com/", "open.spotify.com/embed/");
    } else if (input.startsWith("spotify:")) {
      const parts = input.split(":");
      if (parts.length >= 3) {
        embedFormatted = `https://open.spotify.com/embed/${parts[1]}/${parts[2]}`;
      }
    }

    setSpotifyUrl(embedFormatted);
    setSelectedSpotifyPreset("custom");
    try {
      localStorage.setItem("focusforge_custom_spotify_url", embedFormatted);
    } catch (e) {
      console.error(e);
    }
    setCustomSpotifyInput("");
    setIsCustomLinkOpen(false);
  };

  const handleApplyCustomYoutube = (e: React.FormEvent) => {
    e.preventDefault();
    if (!customYoutubeInput.trim()) return;

    let videoId = customYoutubeInput.trim();
    if (videoId.includes("v=")) {
      videoId = videoId.split("v=")[1].split("&")[0];
    } else if (videoId.includes("youtu.be/")) {
      videoId = videoId.split("youtu.be/")[1].split("?")[0];
    } else if (videoId.includes("embed/")) {
      videoId = videoId.split("embed/")[1].split("?")[0];
    }

    const embedFormatted = `https://www.youtube.com/embed/${videoId}?autoplay=1`;
    setYoutubeUrl(embedFormatted);
    setSelectedYoutubePreset("custom");
    try {
      localStorage.setItem("focusforge_custom_youtube_url", embedFormatted);
    } catch (e) {
      console.error(e);
    }
    setCustomYoutubeInput("");
    setIsCustomLinkOpen(false);
  };

  const openPlayerPopup = () => {
    const width = 420;
    const height = 560;
    const left = window.screenX + (window.outerWidth - width) / 2;
    const top = window.screenY + (window.outerHeight - height) / 2;

    const currentUrl = activeSource === "spotify" ? spotifyUrl : youtubeUrl;
    const popupUrl = `/player?source=${activeSource}&url=${encodeURIComponent(currentUrl)}`;

    window.open(
      popupUrl,
      "FocusForgePlayer",
      `width=${width},height=${height},left=${left},top=${top},resizable=yes,scrollbars=no,status=no`
    );
  };

  const getActiveAppUrl = () => {
    if (activeSource === "spotify") {
      const preset = SPOTIFY_PRESETS.find((p) => p.url === spotifyUrl);
      return preset ? preset.appUrl : "https://open.spotify.com";
    } else {
      const preset = YOUTUBE_PRESETS.find((p) => p.url === youtubeUrl);
      return preset ? preset.appUrl : "https://youtube.com";
    }
  };

  return (
    <div className="fixed bottom-6 left-1/2 -translate-x-1/2 z-50 flex flex-col items-center pointer-events-none">
      <div className="pointer-events-auto relative">
        <AnimatePresence mode="wait">
          {!isOpen ? (
            /* Collapsed Mode: Floating Pill */
            <motion.button
              key="collapsed-pill"
              layoutId="focus-soundscapes-dock"
              initial={{ y: 20, opacity: 0, scale: 0.95 }}
              animate={{ y: 0, opacity: 1, scale: 1 }}
              exit={{ y: 15, opacity: 0, scale: 0.95 }}
              transition={{ duration: 0.22, ease: "easeOut" }}
              onClick={() => setIsOpen(true)}
              className="theme-card flex items-center gap-2.5 px-5 py-2.5 rounded-full shadow-2xl hover:brightness-110 hover:scale-[1.02] active:scale-95 transition-all duration-200 group"
              title="Expand Focus Soundscapes"
            >
              <div className="relative flex items-center justify-center">
                <Headphones
                  style={{ color: "var(--accent-color, var(--accent-primary))" }}
                  className="w-4 h-4 group-hover:scale-110 transition-transform"
                />
                <span
                  style={{ backgroundColor: "var(--accent-color, var(--accent-primary))" }}
                  className="absolute -top-0.5 -right-0.5 w-1.5 h-1.5 rounded-full animate-pulse"
                />
              </div>

              <span className="text-xs font-semibold tracking-wide font-display">
                Focus Soundscapes
              </span>

              <ChevronUp className="w-3.5 h-3.5 opacity-60 group-hover:opacity-100 group-hover:-translate-y-0.5 transition-all" />
            </motion.button>
          ) : (
            /* Expanded Mode: Floating Horizontal Glassmorphic Audio Bar */
            <motion.div
              key="expanded-bar"
              layoutId="focus-soundscapes-dock"
              initial={{ y: 30, opacity: 0, scale: 0.96 }}
              animate={{ y: 0, opacity: 1, scale: 1 }}
              exit={{ y: 20, opacity: 0, scale: 0.96 }}
              transition={{ duration: 0.25, ease: "easeOut" }}
              className="theme-card w-[94vw] sm:w-[92vw] max-w-4xl p-2.5 sm:p-3 flex flex-col md:flex-row items-center justify-between gap-3 sm:gap-4 shadow-2xl relative"
            >
              {/* SECTION 1: Active Embed Player (Left) */}
              <div className="w-full md:w-[340px] lg:w-[360px] h-[80px] flex-shrink-0 relative rounded-xl overflow-hidden bg-black/50 shadow-inner">
                {activeSource === "spotify" ? (
                  <iframe
                    key={spotifyUrl}
                    src={spotifyUrl}
                    width="100%"
                    height="80"
                    frameBorder="0"
                    allow="autoplay; clipboard-write; encrypted-media; fullscreen; picture-in-picture"
                    loading="lazy"
                    title="Spotify Compact Embed"
                    className="w-full h-[80px] rounded-xl"
                  />
                ) : (
                  <div className="w-full h-full relative overflow-hidden rounded-xl">
                    <iframe
                      key={youtubeUrl}
                      src={youtubeUrl}
                      width="100%"
                      height="140"
                      frameBorder="0"
                      allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                      allowFullScreen
                      title="YouTube Compact Embed"
                      className="w-full h-[140px] -mt-[30px] rounded-xl pointer-events-auto"
                    />
                  </div>
                )}
              </div>

              {/* SECTION 2: Source Switcher (Center) */}
              <div
                style={{
                  backgroundColor: "rgba(255, 255, 255, 0.04)",
                }}
                className="flex items-center p-1 rounded-full flex-shrink-0 self-center"
              >
                <button
                  type="button"
                  onClick={() => handleSourceChange("spotify")}
                  style={{
                    backgroundColor:
                      activeSource === "spotify"
                        ? "rgba(255, 255, 255, 0.14)"
                        : "transparent",
                    color:
                      activeSource === "spotify"
                        ? "var(--text-primary)"
                        : "var(--text-secondary)",
                  }}
                  className={`flex items-center gap-1.5 px-3 py-1.5 rounded-full text-xs font-semibold transition-all duration-150 ${
                    activeSource === "spotify"
                      ? "shadow-sm"
                      : "hover:text-white"
                  }`}
                >
                  <Radio className="w-3.5 h-3.5 text-[#1DB954]" />
                  <span>Spotify</span>
                </button>

                <button
                  type="button"
                  onClick={() => handleSourceChange("youtube")}
                  style={{
                    backgroundColor:
                      activeSource === "youtube"
                        ? "rgba(255, 255, 255, 0.14)"
                        : "transparent",
                    color:
                      activeSource === "youtube"
                        ? "var(--text-primary)"
                        : "var(--text-secondary)",
                  }}
                  className={`flex items-center gap-1.5 px-3 py-1.5 rounded-full text-xs font-semibold transition-all duration-150 ${
                    activeSource === "youtube"
                      ? "shadow-sm"
                      : "hover:text-white"
                  }`}
                >
                  <Youtube className="w-3.5 h-3.5 text-[#FF0000]" />
                  <span>YouTube</span>
                </button>
              </div>

              {/* SECTION 3: Quick Selection Dropdown & Action Icon Buttons (Right) */}
              <div className="flex items-center justify-end gap-2 w-full md:w-auto flex-wrap sm:flex-nowrap">
                {/* Curated Playlist Select Menu */}
                <div className="relative min-w-[150px] sm:min-w-[170px] flex-1 sm:flex-initial">
                  <select
                    value={
                      activeSource === "spotify"
                        ? selectedSpotifyPreset
                        : selectedYoutubePreset
                    }
                    onChange={(e) =>
                      activeSource === "spotify"
                        ? handleSpotifyPresetChange(e.target.value)
                        : handleYoutubePresetChange(e.target.value)
                    }
                    style={{
                      backgroundColor: "rgba(255, 255, 255, 0.06)",
                      color: "var(--text-primary)",
                      fontFamily: "var(--font-body)",
                    }}
                    className="w-full px-3 py-2 pr-7 text-xs rounded-full appearance-none focus:outline-none focus:ring-1 focus:ring-white/30 cursor-pointer font-medium hover:bg-white/10 transition"
                  >
                    {activeSource === "spotify" ? (
                      <>
                        <optgroup label="Curated Playlists" className="bg-[#121418] text-white">
                          {SPOTIFY_PRESETS.map((p) => (
                            <option key={p.id} value={p.id} className="bg-[#121418] text-white py-1">
                              {p.name}
                            </option>
                          ))}
                        </optgroup>
                        <option value="custom" className="bg-[#121418] text-lime-400 py-1">
                          Custom Spotify URL...
                        </option>
                      </>
                    ) : (
                      <>
                        <optgroup label="Curated Streams" className="bg-[#121418] text-white">
                          {YOUTUBE_PRESETS.map((p) => (
                            <option key={p.id} value={p.id} className="bg-[#121418] text-white py-1">
                              {p.name}
                            </option>
                          ))}
                        </optgroup>
                        <option value="custom" className="bg-[#121418] text-rose-400 py-1">
                          Custom YouTube Stream...
                        </option>
                      </>
                    )}
                  </select>
                  <ChevronDown className="w-3.5 h-3.5 absolute right-2.5 top-1/2 -translate-y-1/2 opacity-60 pointer-events-none" />
                </div>

                {/* Action Buttons */}
                <div className="flex items-center gap-1.5">
                  {/* Custom Link Button */}
                  <button
                    type="button"
                    onClick={() => setIsCustomLinkOpen(!isCustomLinkOpen)}
                    style={{
                      backgroundColor: isCustomLinkOpen
                        ? "rgba(255, 255, 255, 0.16)"
                        : "rgba(255, 255, 255, 0.05)",
                    }}
                    className="p-2 rounded-full text-xs hover:bg-white/12 active:scale-95 transition"
                    title="Paste Custom Link"
                  >
                    <LinkIcon className="w-3.5 h-3.5" />
                  </button>

                  {/* Open App / External Tab Button */}
                  <a
                    href={getActiveAppUrl()}
                    target="_blank"
                    rel="noopener noreferrer"
                    style={{
                      backgroundColor: "rgba(255, 255, 255, 0.05)",
                    }}
                    className="p-2 rounded-full text-xs hover:bg-white/12 active:scale-95 transition"
                    title={`Open in ${activeSource === "spotify" ? "Spotify" : "YouTube"}`}
                  >
                    <ExternalLink className="w-3.5 h-3.5 opacity-80" />
                  </a>

                  {/* Detach Pop-out Window Button */}
                  <button
                    type="button"
                    onClick={openPlayerPopup}
                    style={{
                      backgroundColor: "rgba(255, 255, 255, 0.05)",
                    }}
                    className="p-2 rounded-full text-xs hover:bg-white/12 active:scale-95 transition"
                    title="Detach player into mini floating window"
                  >
                    <Maximize2 className="w-3.5 h-3.5 opacity-80" />
                  </button>

                  {/* Minimize Button */}
                  <button
                    type="button"
                    onClick={() => setIsOpen(false)}
                    style={{
                      backgroundColor: "rgba(255, 255, 255, 0.05)",
                    }}
                    className="p-2 rounded-full text-xs hover:bg-white/12 active:scale-95 transition"
                    title="Minimize Dock"
                  >
                    <ChevronDown className="w-3.5 h-3.5 opacity-80" />
                  </button>
                </div>
              </div>

              {/* Popover for Custom Link Input */}
              <AnimatePresence>
                {isCustomLinkOpen && (
                  <motion.div
                    ref={popoverRef}
                    initial={{ opacity: 0, y: 10, scale: 0.95 }}
                    animate={{ opacity: 1, y: 0, scale: 1 }}
                    exit={{ opacity: 0, y: 8, scale: 0.95 }}
                    transition={{ duration: 0.15 }}
                    className="theme-card absolute -top-16 left-0 right-0 p-2.5 z-30 flex items-center gap-2"
                  >
                    {activeSource === "spotify" ? (
                      <form
                        onSubmit={handleApplyCustomSpotify}
                        className="flex items-center gap-2 w-full"
                      >
                        <input
                          type="text"
                          placeholder="Paste Spotify Playlist / Track URL..."
                          value={customSpotifyInput}
                          onChange={(e) => setCustomSpotifyInput(e.target.value)}
                          autoFocus
                          style={{
                            backgroundColor: "rgba(255, 255, 255, 0.05)",
                            borderColor: "rgba(255, 255, 255, 0.15)",
                            color: "var(--text-primary)",
                          }}
                          className="flex-1 px-3 py-1.5 text-xs rounded-xl border placeholder:text-white/30 focus:outline-none focus:ring-1 focus:ring-white/40"
                        />
                        <button
                          type="submit"
                          className="theme-accent-btn px-3 py-1.5 text-xs font-bold rounded-xl shadow-md hover:brightness-110 active:scale-95 transition"
                        >
                          Load
                        </button>
                        <button
                          type="button"
                          onClick={() => setIsCustomLinkOpen(false)}
                          className="p-1.5 opacity-60 hover:opacity-100 transition rounded-lg hover:bg-white/10"
                        >
                          <X className="w-3.5 h-3.5" />
                        </button>
                      </form>
                    ) : (
                      <form
                        onSubmit={handleApplyCustomYoutube}
                        className="flex items-center gap-2 w-full"
                      >
                        <input
                          type="text"
                          placeholder="Paste YouTube Video / Stream URL or ID..."
                          value={customYoutubeInput}
                          onChange={(e) => setCustomYoutubeInput(e.target.value)}
                          autoFocus
                          style={{
                            backgroundColor: "rgba(255, 255, 255, 0.05)",
                            borderColor: "rgba(255, 255, 255, 0.15)",
                            color: "var(--text-primary)",
                          }}
                          className="flex-1 px-3 py-1.5 text-xs rounded-xl border placeholder:text-white/30 focus:outline-none focus:ring-1 focus:ring-white/40"
                        />
                        <button
                          type="submit"
                          className="theme-accent-btn px-3 py-1.5 text-xs font-bold rounded-xl shadow-md hover:brightness-110 active:scale-95 transition"
                        >
                          Play
                        </button>
                        <button
                          type="button"
                          onClick={() => setIsCustomLinkOpen(false)}
                          className="p-1.5 opacity-60 hover:opacity-100 transition rounded-lg hover:bg-white/10"
                        >
                          <X className="w-3.5 h-3.5" />
                        </button>
                      </form>
                    )}
                  </motion.div>
                )}
              </AnimatePresence>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </div>
  );
};

export const SoundscapesModal = MediaDock;
export default MediaDock;
