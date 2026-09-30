"use client";

import React from "react";
import { subDays, format, isSameDay, parseISO } from "date-fns";
import { DailyStatItem } from "@/types";
import { formatDurationSummary } from "@/lib/utils";

interface ContributionGridProps {
  history: DailyStatItem[];
}

export const ContributionGrid: React.FC<ContributionGridProps> = ({ history }) => {
  // 30 days grid (last 30 calendar days)
  const days = Array.from({ length: 30 }).map((_, i) => subDays(new Date(), 29 - i));

  const getDayData = (date: Date) => {
    return history.find((stat) => {
      try {
        const statDate = typeof stat.date === "string" ? parseISO(stat.date) : new Date(stat.date);
        return isSameDay(statDate, date);
      } catch {
        return false;
      }
    });
  };

  const getCellColor = (seconds: number, target: number) => {
    if (seconds === 0) return "bg-stone-100 border-stone-200";
    const ratio = seconds / target;
    if (ratio < 0.25) return "bg-amber-100 border-amber-200";
    if (ratio < 0.5) return "bg-amber-300 border-amber-400";
    if (ratio < 1.0) return "bg-amber-500 border-amber-600";
    return "bg-amber-700 border-amber-800 shadow-sm"; // Goal met or exceeded
  };

  return (
    <div className="w-full bg-[#FAF9F6] border border-stone-200/90 rounded-2xl p-6 shadow-tactile">
      <div className="flex items-center justify-between mb-4">
        <div>
          <h3 className="text-sm font-semibold text-stone-900 tracking-tight">
            30-Day Focus Constellation
          </h3>
          <p className="text-xs text-stone-500 font-sans mt-0.5">
            Daily focus density and consistency
          </p>
        </div>

        {/* Legend */}
        <div className="flex items-center gap-1.5 text-[10px] text-stone-400 font-medium">
          <span>Less</span>
          <div className="w-2.5 h-2.5 rounded-sm bg-stone-100 border border-stone-200" />
          <div className="w-2.5 h-2.5 rounded-sm bg-amber-100 border border-amber-200" />
          <div className="w-2.5 h-2.5 rounded-sm bg-amber-300 border border-amber-400" />
          <div className="w-2.5 h-2.5 rounded-sm bg-amber-500 border border-amber-600" />
          <div className="w-2.5 h-2.5 rounded-sm bg-amber-700 border border-amber-800" />
          <span>Goal met</span>
        </div>
      </div>

      {/* Grid of 30 squares (6 cols x 5 rows or 10 cols x 3 rows / responsive flex-wrap) */}
      <div className="grid grid-cols-6 sm:grid-cols-10 gap-2">
        {days.map((date, idx) => {
          const stat = getDayData(date);
          const totalSeconds = stat?.totalSeconds ?? 0;
          const targetSeconds = stat?.targetSeconds ?? 7200;
          const minutes = Math.floor(totalSeconds / 60);
          const isToday = isSameDay(date, new Date());

          return (
            <div
              key={idx}
              className="flex flex-col items-center group relative"
            >
              <div
                title={`${format(date, "MMM d, yyyy")}: ${formatDurationSummary(minutes)}`}
                className={`w-full aspect-square rounded-md border transition-all duration-150 group-hover:scale-110 cursor-pointer ${getCellColor(
                  totalSeconds,
                  targetSeconds
                )} ${isToday ? "ring-2 ring-stone-900 ring-offset-1 ring-offset-[#FAF9F6]" : ""}`}
              />
              <span className="text-[9px] text-stone-400 mt-1 font-mono">
                {format(date, "d")}
              </span>
            </div>
          );
        })}
      </div>
    </div>
  );
};
