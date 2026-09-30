"use client";

import React from "react";

interface YouTubeEmbedProps {
  url: string;
  className?: string;
  hidden?: boolean;
}

export const YouTubeEmbed: React.FC<YouTubeEmbedProps> = ({ url, className, hidden = false }) => {
  return (
    <div
      className={`relative w-full aspect-video rounded-xl overflow-hidden border border-slate-800 shadow-lg ${
        hidden ? "hidden" : ""
      } ${className ?? ""}`}
    >
      <iframe
        src={url}
        width="100%"
        height="100%"
        title="YouTube Focus Audio"
        frameBorder="0"
        allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share"
        referrerPolicy="strict-origin-when-cross-origin"
        allowFullScreen
        className="w-full h-full"
      />
    </div>
  );
};
