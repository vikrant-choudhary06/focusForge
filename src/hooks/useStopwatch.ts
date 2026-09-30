"use client";

import { useState, useRef, useCallback, useEffect } from "react";

interface StopwatchOptions {
  onTick?: (seconds: number) => void;
  onComplete?: () => void;
}

export function useStopwatch(options: StopwatchOptions = {}) {
  const [secondsElapsed, setSecondsElapsed] = useState(0);
  const [isRunning, setIsRunning] = useState(false);
  const [isPaused, setIsPaused] = useState(false);

  const startTimeRef = useRef<number | null>(null);
  const accumulatedTimeRef = useRef<number>(0);
  const animationFrameRef = useRef<number | null>(null);

  const updateTimer = useCallback(() => {
    if (!startTimeRef.current) return;

    const now = performance.now();
    const deltaMs = now - startTimeRef.current + accumulatedTimeRef.current;
    const currentSeconds = Math.floor(deltaMs / 1000);

    setSecondsElapsed(currentSeconds);
    options.onTick?.(currentSeconds);

    animationFrameRef.current = requestAnimationFrame(updateTimer);
  }, [options]);

  const start = useCallback(() => {
    if (isRunning && !isPaused) return;

    startTimeRef.current = performance.now();
    setIsRunning(true);
    setIsPaused(false);
    animationFrameRef.current = requestAnimationFrame(updateTimer);
  }, [isRunning, isPaused, updateTimer]);

  const pause = useCallback(() => {
    if (!isRunning || isPaused) return;

    if (startTimeRef.current) {
      accumulatedTimeRef.current += performance.now() - startTimeRef.current;
    }
    if (animationFrameRef.current) {
      cancelAnimationFrame(animationFrameRef.current);
    }
    setIsPaused(true);
  }, [isRunning, isPaused]);

  const resume = useCallback(() => {
    if (!isRunning || !isPaused) return;

    startTimeRef.current = performance.now();
    setIsPaused(false);
    animationFrameRef.current = requestAnimationFrame(updateTimer);
  }, [isRunning, isPaused, updateTimer]);

  const reset = useCallback(() => {
    if (animationFrameRef.current) {
      cancelAnimationFrame(animationFrameRef.current);
    }
    startTimeRef.current = null;
    accumulatedTimeRef.current = 0;
    setSecondsElapsed(0);
    setIsRunning(false);
    setIsPaused(false);
  }, []);

  const setSeconds = useCallback((sec: number) => {
    accumulatedTimeRef.current = sec * 1000;
    startTimeRef.current = isRunning && !isPaused ? performance.now() : null;
    setSecondsElapsed(sec);
  }, [isRunning, isPaused]);

  useEffect(() => {
    return () => {
      if (animationFrameRef.current) {
        cancelAnimationFrame(animationFrameRef.current);
      }
    };
  }, []);

  return {
    secondsElapsed,
    isRunning,
    isPaused,
    start,
    pause,
    resume,
    reset,
    setSeconds,
  };
}
