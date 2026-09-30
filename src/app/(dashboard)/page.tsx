"use client";

import React, { useState } from "react";
import { useStopwatch } from "@/hooks/useStopwatch";
import { useDailyStreak } from "@/hooks/useDailyStreak";
import { useAudioPlayer } from "@/hooks/useAudioPlayer";
import { TimerDisplay } from "@/components/timer/TimerDisplay";
import { TimerControls } from "@/components/timer/TimerControls";
import { StreakBadge } from "@/components/dashboard/StreakBadge";
import { DailyGoalCard } from "@/components/dashboard/DailyGoalCard";
import { WeeklyHeatmap } from "@/components/dashboard/WeeklyHeatmap";
import { AudioDock } from "@/components/audio/AudioDock";
import { Tabs } from "@/components/ui/Tabs";
import { Card } from "@/components/ui/Card";
import { Modal } from "@/components/ui/Modal";
import { Button } from "@/components/ui/Button";
import { Timer, Hourglass, Sparkles, CheckCircle, Flame } from "lucide-react";
import { formatTime } from "@/lib/utils";

export default function DashboardPage() {
  const [timerMode, setTimerMode] = useState<"stopwatch" | "countdown">("stopwatch");
  const [countdownMinutes, setCountdownMinutes] = useState<number>(25);
  const [sessionTitle, setSessionTitle] = useState("");
  const [isLogModalOpen, setIsLogModalOpen] = useState(false);
  const [isSaving, setIsSaving] = useState(false);

  // Hooks
  const { secondsElapsed, isRunning, isPaused, start, pause, resume, reset } =
    useStopwatch();

  const {
    currentStreak,
    longestStreak,
    dailyGoalMins,
    todayDurationSeconds,
    history,
    recordSession,
  } = useDailyStreak();

  const {
    currentTrack,
    selectTrack,
    clearTrack,
  } = useAudioPlayer();

  const handleOpenLogModal = () => {
    pause();
    setIsLogModalOpen(true);
  };

  const handleConfirmSaveSession = async () => {
    if (secondsElapsed <= 0) return;
    setIsSaving(true);
    try {
      await recordSession(secondsElapsed);
      reset();
      setIsLogModalOpen(false);
      setSessionTitle("");
    } catch (err) {
      console.error(err);
    } finally {
      setIsSaving(false);
    }
  };

  return (
    <div className="space-y-8">
      {/* Top Banner with Streak and Greeting */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-2 border-b border-slate-800/60">
        <div>
          <h1 className="text-2xl sm:text-3xl font-bold tracking-tight text-white flex items-center gap-2">
            Focus Workspace
          </h1>
          <p className="text-sm text-slate-400 mt-0.5">
            Eliminate distractions and forge your deep work.
          </p>
        </div>

        <div className="flex items-center gap-3">
          <StreakBadge currentStreak={currentStreak} longestStreak={longestStreak} />
        </div>
      </div>

      {/* Main Focus Centerpiece */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
        {/* Left / Center: Timer & Controls (8 Cols) */}
        <div className="lg:col-span-8 flex flex-col items-center">
          <Card className="w-full p-8 sm:p-10 flex flex-col items-center justify-center relative overflow-hidden bg-slate-900/80 border-slate-800 shadow-2xl">
            {/* Mode Switcher Tabs */}
            <div className="w-full max-w-xs mb-2">
              <Tabs
                tabs={[
                  { id: "stopwatch", label: "Open Focus", icon: <Timer className="w-4 h-4" /> },
                  { id: "countdown", label: "Pomodoro (25m)", icon: <Hourglass className="w-4 h-4" /> },
                ]}
                activeTab={timerMode}
                onChange={(id) => {
                  if (!isRunning) {
                    setTimerMode(id as "stopwatch" | "countdown");
                  }
                }}
              />
            </div>

            {/* Core Timer Component */}
            <TimerDisplay
              seconds={secondsElapsed}
              isRunning={isRunning}
              isPaused={isPaused}
              mode={timerMode}
              targetSeconds={countdownMinutes * 60}
            />

            {/* Action Buttons */}
            <TimerControls
              isRunning={isRunning}
              isPaused={isPaused}
              secondsElapsed={secondsElapsed}
              onStart={start}
              onPause={pause}
              onResume={resume}
              onReset={reset}
              onLogSession={handleOpenLogModal}
              isSaving={isSaving}
            />
          </Card>
        </div>

        {/* Right: Daily Target & Heatmap stats (4 Cols) */}
        <div className="lg:col-span-4 space-y-6">
          <DailyGoalCard
            todaySeconds={todayDurationSeconds + (isRunning ? secondsElapsed : 0)}
            dailyGoalMins={dailyGoalMins}
          />

          <WeeklyHeatmap history={history} />
        </div>
      </div>

      {/* Floating Audio Dock */}
      <AudioDock
        selectedTrack={currentTrack}
        onSelectTrack={selectTrack}
        onClearTrack={clearTrack}
      />

      {/* Modal for saving session */}
      <Modal
        isOpen={isLogModalOpen}
        onClose={() => setIsLogModalOpen(false)}
        title="Log Focus Session"
      >
        <div className="space-y-4">
          <div className="p-4 rounded-xl bg-slate-800/60 border border-slate-700/60 flex items-center justify-between">
            <span className="text-sm text-slate-300">Elapsed Focus Time:</span>
            <span className="text-lg font-mono font-bold text-indigo-400">
              {formatTime(secondsElapsed, true)}
            </span>
          </div>

          <div>
            <label className="block text-xs font-semibold text-slate-300 uppercase tracking-wider mb-1.5">
              Session Label (Optional)
            </label>
            <input
              type="text"
              placeholder="e.g., Code review, Design sprint, Writing thesis"
              value={sessionTitle}
              onChange={(e) => setSessionTitle(e.target.value)}
              className="w-full px-3.5 py-2.5 rounded-xl bg-slate-950 border border-slate-800 text-sm text-slate-100 placeholder-slate-500 focus:outline-none focus:border-indigo-500 focus:ring-1 focus:ring-indigo-500"
            />
          </div>

          <div className="flex items-center justify-end gap-3 pt-4 border-t border-slate-800">
            <Button
              variant="ghost"
              size="md"
              onClick={() => setIsLogModalOpen(false)}
              disabled={isSaving}
            >
              Cancel
            </Button>
            <Button
              variant="primary"
              size="md"
              onClick={handleConfirmSaveSession}
              isLoading={isSaving}
              className="bg-emerald-600 hover:bg-emerald-500"
            >
              <CheckCircle className="w-4 h-4" />
              <span>Save & Add to Streak</span>
            </Button>
          </div>
        </div>
      </Modal>
    </div>
  );
}
