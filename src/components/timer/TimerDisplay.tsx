"use client";

import React from "react";
import { formatTime } from "@/lib/utils";

interface TimerDisplayProps {
  seconds: number;
  isRunning?: boolean;
  isPaused?: boolean;
  targetSeconds?: number;
  mode?: "stopwatch" | "countdown";
}

export const TimerDisplay: React.FC<TimerDisplayProps> = ({
  seconds,
  isRunning = false,
  isPaused = false,
  targetSeconds,
  mode = "stopwatch",
}) => {
  const displaySeconds =
    mode === "countdown" && targetSeconds !== undefined
      ? Math.max(0, targetSeconds - seconds)
      : seconds;

  const timeString = formatTime(displaySeconds, true);
  const [hrs, mins, secs] = timeString.split(":");

  return (
    <div className="relative flex flex-col items-center justify-center my-6 select-none">
      {/* Glow aura */}
      <div
        className={`absolute inset-0 rounded-full blur-3xl transition-opacity duration-700 pointer-events-none ${
          isRunning && !isPaused
            ? "bg-indigo-500/15 opacity-100"
            : isPaused
            ? "bg-amber-500/10 opacity-70"
            : "bg-transparent opacity-0"
        }`}
      />

      {/* Numerical display */}
      <div className="relative flex items-center justify-center font-mono font-bold tracking-tight text-6xl sm:text-7xl md:text-8xl tabular-nums text-slate-100 drop-shadow-md">
        <div className="flex flex-col items-center">
          <span className="leading-none">{hrs}</span>
          <span className="text-[10px] tracking-widest text-slate-500 uppercase mt-2 font-sans font-semibold">
            Hours
          </span>
        </div>

        <span className="leading-none pb-5 text-indigo-400/80 px-2 sm:px-3 animate-pulse">
          :
        </span>

        <div className="flex flex-col items-center">
          <span className="leading-none">{mins}</span>
          <span className="text-[10px] tracking-widest text-slate-500 uppercase mt-2 font-sans font-semibold">
            Minutes
          </span>
        </div>

        <span className="leading-none pb-5 text-indigo-400/80 px-2 sm:px-3 animate-pulse">
          :
        </span>

        <div className="flex flex-col items-center">
          <span className="leading-none text-indigo-400">{secs}</span>
          <span className="text-[10px] tracking-widest text-slate-500 uppercase mt-2 font-sans font-semibold">
            Seconds
          </span>
        </div>
      </div>

      {/* State Status Tag */}
      <div className="mt-4">
        {isRunning && !isPaused && (
          <div className="flex items-center gap-2 px-3 py-1 rounded-full bg-indigo-500/10 border border-indigo-500/30 text-indigo-400 text-xs font-semibold tracking-wide uppercase animate-pulse">
            <span className="w-2 h-2 rounded-full bg-indigo-400" />
            Focus in progress
          </div>
        )}
        {isPaused && (
          <div className="flex items-center gap-2 px-3 py-1 rounded-full bg-amber-500/10 border border-amber-500/30 text-amber-400 text-xs font-semibold tracking-wide uppercase">
            <span className="w-2 h-2 rounded-full bg-amber-400" />
            Session Paused
          </div>
        )}
        {!isRunning && (
          <div className="flex items-center gap-2 px-3 py-1 rounded-full bg-slate-800 border border-slate-700 text-slate-400 text-xs font-medium tracking-wide">
            Ready to Forge
          </div>
        )}
      </div>
    </div>
  );
};
