"use client";

import React from "react";
import { Flame } from "lucide-react";
import { cn } from "@/lib/utils";

interface StreakBadgeProps {
  currentStreak: number;
  longestStreak?: number;
  className?: string;
}

export const StreakBadge: React.FC<StreakBadgeProps> = ({
  currentStreak,
  longestStreak,
  className,
}) => {
  const hasStreak = currentStreak > 0;

  return (
    <div
      className={cn(
        "inline-flex items-center gap-2 px-3 py-1.5 rounded-full border transition-all duration-300",
        hasStreak
          ? "bg-amber-500/10 border-amber-500/30 text-amber-300 shadow-flame-glow"
          : "bg-slate-800/40 border-slate-700/60 text-slate-400",
        className
      )}
    >
      <Flame
        className={cn(
          "w-4 h-4 transition-transform duration-300",
          hasStreak ? "text-amber-400 animate-bounce" : "text-slate-500"
        )}
      />
      <span className="text-xs font-bold tracking-wide">
        {currentStreak} {currentStreak === 1 ? "Day Streak" : "Days Streak"}
      </span>
      {longestStreak !== undefined && longestStreak > 0 && (
        <span className="text-[10px] text-slate-500 border-l border-slate-700 pl-2">
          Best: {longestStreak}d
        </span>
      )}
    </div>
  );
};
