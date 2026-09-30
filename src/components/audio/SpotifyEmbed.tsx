"use client";

import React from "react";

interface SpotifyEmbedProps {
  url: string;
  className?: string;
}

export const SpotifyEmbed: React.FC<SpotifyEmbedProps> = ({ url, className }) => {
  return (
    <div className={`w-full overflow-hidden rounded-xl shadow-lg border border-slate-800 ${className ?? ""}`}>
      <iframe
        src={url}
        width="100%"
        height="152"
        frameBorder="0"
        allow="autoplay; clipboard-write; encrypted-media; fullscreen; picture-in-picture"
        loading="lazy"
        className="rounded-xl"
        title="Spotify Focus Audio"
      />
    </div>
  );
};
