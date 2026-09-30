"use client";

import { useState, useCallback, useEffect } from "react";
import { DailyLogData } from "@/types";

interface UseDailyStreakReturn {
  currentStreak: number;
  longestStreak: number;
  dailyGoalMins: number;
  todayDurationSeconds: number;
  isGoalAchievedToday: boolean;
  history: DailyLogData[];
  isLoading: boolean;
  recordSession: (durationSeconds: number) => Promise<void>;
  refreshStats: () => Promise<void>;
}

export function useDailyStreak(initialGoalMins: number = 120): UseDailyStreakReturn {
  const [currentStreak, setCurrentStreak] = useState(0);
  const [longestStreak, setLongestStreak] = useState(0);
  const [dailyGoalMins, setDailyGoalMins] = useState(initialGoalMins);
  const [todayDurationSeconds, setTodayDurationSeconds] = useState(0);
  const [history, setHistory] = useState<DailyLogData[]>([]);
  const [isLoading, setIsLoading] = useState(false);

  const isGoalAchievedToday = todayDurationSeconds >= dailyGoalMins * 60;

  const refreshStats = useCallback(async () => {
    setIsLoading(true);
    try {
      const res = await fetch("/api/sessions");
      if (res.ok) {
        const data = await res.json();
        setCurrentStreak(data.currentStreak ?? 0);
        setLongestStreak(data.longestStreak ?? 0);
        setDailyGoalMins(data.dailyGoalMins ?? initialGoalMins);
        setTodayDurationSeconds(data.todayDurationSeconds ?? 0);
        setHistory(data.history ?? []);
      }
    } catch (err) {
      console.error("Failed to fetch streak data", err);
    } finally {
      setIsLoading(false);
    }
  }, [initialGoalMins]);

  const recordSession = useCallback(
    async (durationSeconds: number) => {
      try {
        const res = await fetch("/api/sessions", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            duration: durationSeconds,
            startedAt: new Date(Date.now() - durationSeconds * 1000).toISOString(),
            endedAt: new Date().toISOString(),
          }),
        });

        if (res.ok) {
          await refreshStats();
        }
      } catch (err) {
        console.error("Failed to record session", err);
      }
    },
    [refreshStats]
  );

  useEffect(() => {
    refreshStats();
  }, [refreshStats]);

  return {
    currentStreak,
    longestStreak,
    dailyGoalMins,
    todayDurationSeconds,
    isGoalAchievedToday,
    history,
    isLoading,
    recordSession,
    refreshStats,
  };
}
