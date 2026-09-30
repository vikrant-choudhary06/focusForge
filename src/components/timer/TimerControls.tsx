"use client";

import React from "react";
import { Play, Pause, RotateCcw, CheckCircle2 } from "lucide-react";
import { Button } from "@/components/ui/Button";

interface TimerControlsProps {
  isRunning: boolean;
  isPaused: boolean;
  secondsElapsed: number;
  onStart: () => void;
  onPause: () => void;
  onResume: () => void;
  onReset: () => void;
  onLogSession: () => void;
  isSaving?: boolean;
}

export const TimerControls: React.FC<TimerControlsProps> = ({
  isRunning,
  isPaused,
  secondsElapsed,
  onStart,
  onPause,
  onResume,
  onReset,
  onLogSession,
  isSaving = false,
}) => {
  return (
    <div className="flex flex-wrap items-center justify-center gap-3 mt-6">
      {/* Reset Button */}
      {secondsElapsed > 0 && (
        <Button
          variant="ghost"
          size="md"
          onClick={onReset}
          disabled={isSaving}
          title="Reset timer"
          className="text-slate-400 hover:text-rose-400"
        >
          <RotateCcw className="w-4 h-4" />
          <span>Reset</span>
        </Button>
      )}

      {/* Main Action Button (Start / Pause / Resume) */}
      {!isRunning ? (
        <Button
          variant="primary"
          size="lg"
          onClick={onStart}
          className="px-8 shadow-glow text-base font-semibold"
        >
          <Play className="w-5 h-5 fill-current" />
          <span>Start Focus</span>
        </Button>
      ) : isPaused ? (
        <Button
          variant="primary"
          size="lg"
          onClick={onResume}
          className="px-8 bg-indigo-600 hover:bg-indigo-500 shadow-glow"
        >
          <Play className="w-5 h-5 fill-current" />
          <span>Resume</span>
        </Button>
      ) : (
        <Button
          variant="secondary"
          size="lg"
          onClick={onPause}
          className="px-8 border-amber-500/30 text-amber-300 hover:bg-amber-500/10"
        >
          <Pause className="w-5 h-5 fill-current" />
          <span>Pause</span>
        </Button>
      )}

      {/* Finish & Log Session Button */}
      {secondsElapsed > 0 && (
        <Button
          variant="secondary"
          size="lg"
          onClick={onLogSession}
          isLoading={isSaving}
          className="bg-emerald-950/40 border-emerald-500/30 text-emerald-400 hover:bg-emerald-900/40 hover:text-emerald-300 hover:border-emerald-500/50"
        >
          <CheckCircle2 className="w-5 h-5" />
          <span>Log & Finish</span>
        </Button>
      )}
    </div>
  );
};
