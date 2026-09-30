"use client";

import React from "react";
import { format, subDays, isSameDay, parseISO } from "date-fns";
import { Card } from "@/components/ui/Card";
import { DailyLogData } from "@/types";
import { formatDurationSummary } from "@/lib/utils";

interface WeeklyHeatmapProps {
  history: DailyLogData[];
}

export const WeeklyHeatmap: React.FC<WeeklyHeatmapProps> = ({ history }) => {
  // Generate last 7 days
  const last7Days = Array.from({ length: 7 })
    .map((_, i) => subDays(new Date(), 6 - i));

  const getDayData = (date: Date) => {
    return history.find((log) => {
      try {
        const logDate = parseISO(log.date);
        return isSameDay(logDate, date);
      } catch {
        return false;
      }
    });
  };

  const getIntensityClass = (durationSeconds: number) => {
    const mins = Math.floor(durationSeconds / 60);
    if (mins === 0) return "bg-white/[0.03] border-white/[0.05] text-white/40";
    if (mins < 30) return "bg-lime-500/15 border-lime-400/25 text-lime-300";
    if (mins < 60) return "bg-lime-500/30 border-lime-400/40 text-lime-200";
    if (mins < 120) return "bg-lime-500/50 border-lime-400/60 text-white shadow-sm shadow-lime-500/20";
    return "bg-lime-400 text-black font-extrabold border-lime-300 shadow-md shadow-lime-400/30";
  };

  return (
    <Card className="flex flex-col justify-between">
      <div className="flex items-center justify-between mb-4">
        <div>
          <h3 className="text-sm font-semibold" style={{ color: "var(--text-primary)" }}>7-Day Activity Heatmap</h3>
          <p className="text-xs" style={{ color: "var(--text-secondary)" }}>Consistency log</p>
        </div>
      </div>

      <div className="grid grid-cols-7 gap-2">
        {last7Days.map((date, idx) => {
          const dayLog = getDayData(date);
          const duration = dayLog ? (dayLog.totalSeconds ?? (dayLog as any).totalDuration ?? 0) : 0;
          const mins = Math.floor(duration / 60);
          const dayLabel = format(date, "EEE");
          const dateNum = format(date, "d");
          const isToday = isSameDay(date, new Date());

          return (
            <div key={idx} className="flex flex-col items-center gap-1.5">
              <span className="text-[10px] font-medium" style={{ color: "var(--text-secondary)" }}>{dayLabel}</span>
              <div
                title={`${format(date, "MMM dd")}: ${formatDurationSummary(mins)}`}
                className={`w-full aspect-square rounded-xl flex flex-col items-center justify-center border transition-all duration-200 hover:scale-105 cursor-pointer ${getIntensityClass(
                  duration
                )} ${isToday ? "ring-2 ring-lime-400/80 ring-offset-2 ring-offset-black" : ""}`}
              >
                <span className="text-xs font-bold">{dateNum}</span>
              </div>
              <span className="text-[9px] font-mono" style={{ color: "var(--text-secondary)" }}>
                {mins > 0 ? `${mins}m` : "-"}
              </span>
            </div>
          );
        })}
      </div>
    </Card>
  );
};
