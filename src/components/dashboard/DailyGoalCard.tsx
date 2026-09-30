"use client";

import React from "react";
import { Target, CheckCircle2, Zap } from "lucide-react";
import { Card } from "@/components/ui/Card";
import { formatDurationSummary } from "@/lib/utils";

interface DailyGoalCardProps {
  todaySeconds: number;
  dailyGoalMins: number;
  onEditGoal?: () => void;
}

export const DailyGoalCard: React.FC<DailyGoalCardProps> = ({
  todaySeconds,
  dailyGoalMins,
  onEditGoal,
}) => {
  const goalSeconds = dailyGoalMins * 60;
  const progressPercent = Math.min(Math.round((todaySeconds / goalSeconds) * 100), 100);
  const isCompleted = todaySeconds >= goalSeconds;

  const currentMins = Math.floor(todaySeconds / 60);

  return (
    <Card className="flex flex-col justify-between">
      <div className="flex items-center justify-between mb-4">
        <div className="flex items-center gap-2.5">
          <div className="p-2 rounded-xl bg-indigo-500/10 border border-indigo-500/20 text-indigo-400">
            <Target className="w-5 h-5" />
          </div>
          <div>
            <h3 className="text-sm font-semibold text-slate-100">Daily Target</h3>
            <p className="text-xs text-slate-400">Goal: {formatDurationSummary(dailyGoalMins)}</p>
          </div>
        </div>

        {isCompleted ? (
          <div className="flex items-center gap-1.5 px-2.5 py-1 rounded-full bg-emerald-500/10 border border-emerald-500/30 text-emerald-400 text-xs font-semibold">
            <CheckCircle2 className="w-3.5 h-3.5" />
            <span>Target Hit!</span>
          </div>
        ) : (
          <div className="flex items-center gap-1.5 px-2.5 py-1 rounded-full bg-slate-800 border border-slate-700 text-slate-300 text-xs font-medium">
            <Zap className="w-3.5 h-3.5 text-indigo-400" />
            <span>{progressPercent}%</span>
          </div>
        )}
      </div>

      <div className="space-y-2">
        <div className="flex justify-between text-xs font-medium">
          <span className="text-slate-300">
            {formatDurationSummary(currentMins)} focused
          </span>
          <span className="text-slate-400">
            {Math.max(0, dailyGoalMins - currentMins)}m remaining
          </span>
        </div>

        {/* Progress bar track */}
        <div className="h-3 w-full bg-slate-800/80 rounded-full overflow-hidden p-0.5 border border-slate-700/50">
          <div
            className={`h-full rounded-full transition-all duration-500 ${
              isCompleted
                ? "bg-gradient-to-r from-emerald-500 to-teal-400"
                : "bg-gradient-to-r from-indigo-500 to-cyan-400"
            }`}
            style={{ width: `${progressPercent}%` }}
          />
        </div>
      </div>
    </Card>
  );
};
