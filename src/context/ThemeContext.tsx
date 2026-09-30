"use client";

import React, { createContext, useContext, useState, useEffect } from "react";

export type ThemeId = "theme-1" | "theme-2" | "theme-3" | "theme-4" | "theme-5";

export interface ThemeDefinition {
  id: ThemeId;
  name: string;
  subtitle: string;
  bgPage: string;
  bgCard: string;
  borderColor: string;
  textPrimary: string;
  textSecondary: string;
  accentPrimary: string;
  accentSecondary: string;
  accentBtnText: string;
  fontDisplay: string;
  fontBody: string;
}

export const THEMES: Record<ThemeId, ThemeDefinition> = {
  "theme-1": {
    id: "theme-1",
    name: "SecuNet Cyber Grid",
    subtitle: "Dark Grid Canvas & Cyber Lime",
    bgPage: "#070809",
    bgCard: "rgba(14, 16, 20, 0.70)",
    borderColor: "rgba(255, 255, 255, 0.06)",
    textPrimary: "#FFFFFF",
    textSecondary: "#94A3B8",
    accentPrimary: "#72E929", // Cyber Lime
    accentSecondary: "#4FC513",
    accentBtnText: "#050805",
    fontDisplay: "Plus Jakarta Sans",
    fontBody: "Plus Jakarta Sans",
  },
  "theme-2": {
    id: "theme-2",
    name: "Cyber Lime Glassmorphism",
    subtitle: "Deep Emerald Canvas & Volt Lime",
    bgPage: "#050706",
    bgCard: "rgba(14, 16, 20, 0.70)",
    borderColor: "rgba(255, 255, 255, 0.06)",
    textPrimary: "#FFFFFF",
    textSecondary: "#8E968F",
    accentPrimary: "#D4FF32", // Volt Lime
    accentSecondary: "#A3E635",
    accentBtnText: "#080A09",
    fontDisplay: "Syne",
    fontBody: "Plus Jakarta Sans",
  },
  "theme-3": {
    id: "theme-3",
    name: "Retro Monochrome Matrix",
    subtitle: "Pitch Obsidian & Terminal Green",
    bgPage: "#050505",
    bgCard: "rgba(14, 16, 20, 0.70)",
    borderColor: "rgba(255, 255, 255, 0.06)",
    textPrimary: "#FFFFFF",
    textSecondary: "#00FF66",
    accentPrimary: "#00FF66", // Terminal Green
    accentSecondary: "#00FF66",
    accentBtnText: "#050505",
    fontDisplay: "Silkscreen",
    fontBody: "JetBrains Mono",
  },
  "theme-4": {
    id: "theme-4",
    name: "Pop Neo-Brutalism",
    subtitle: "High Contrast & Canary Yellow",
    bgPage: "#0A0A0B",
    bgCard: "rgba(14, 16, 20, 0.70)",
    borderColor: "rgba(255, 255, 255, 0.06)",
    textPrimary: "#FFFFFF",
    textSecondary: "#FFD147",
    accentPrimary: "#FFD147", // Canary Yellow
    accentSecondary: "#FF9900",
    accentBtnText: "#000000",
    fontDisplay: "Bebas Neue",
    fontBody: "Poppins",
  },
  "theme-5": {
    id: "theme-5",
    name: "Gen-Z Sunset Neo-Grotesk",
    subtitle: "Deep Charcoal & Peach Coral",
    bgPage: "#121316",
    bgCard: "rgba(14, 16, 20, 0.70)",
    borderColor: "rgba(255, 255, 255, 0.06)",
    textPrimary: "#FFFFFF",
    textSecondary: "#9CA3AF",
    accentPrimary: "#F87171", // Peach Coral
    accentSecondary: "#FB923C",
    accentBtnText: "#FFFFFF",
    fontDisplay: "Plus Jakarta Sans",
    fontBody: "Inter",
  },
};

interface ThemeContextType {
  currentThemeId: ThemeId;
  currentTheme: ThemeDefinition;
  setTheme: (id: ThemeId) => void;
  themes: ThemeDefinition[];
}

const THEME_STORAGE_KEY = "focusforge-theme";

const ThemeContext = createContext<ThemeContextType | undefined>(undefined);

export function ThemeProvider({ children }: { children: React.ReactNode }) {
  const [currentThemeId, setCurrentThemeId] = useState<ThemeId>("theme-1");
  const [isMounted, setIsMounted] = useState(false);

  useEffect(() => {
    setIsMounted(true);
    try {
      const savedTheme = localStorage.getItem(THEME_STORAGE_KEY) as ThemeId | null;
      if (savedTheme && THEMES[savedTheme]) {
        setCurrentThemeId(savedTheme);
        document.documentElement.setAttribute("data-theme", savedTheme);
        document.body.setAttribute("data-theme", savedTheme);
      } else {
        document.documentElement.setAttribute("data-theme", "theme-1");
        document.body.setAttribute("data-theme", "theme-1");
      }
    } catch (e) {
      console.error("Failed to read theme from localStorage", e);
    }
  }, []);

  const setTheme = (id: ThemeId) => {
    if (!THEMES[id]) return;
    setCurrentThemeId(id);
    document.documentElement.setAttribute("data-theme", id);
    document.body.setAttribute("data-theme", id);
    try {
      localStorage.setItem(THEME_STORAGE_KEY, id);
    } catch (e) {
      console.error("Failed to save theme to localStorage", e);
    }
  };

  const currentTheme = THEMES[currentThemeId] || THEMES["theme-1"];
  const themes = Object.values(THEMES);

  return (
    <ThemeContext.Provider
      value={{
        currentThemeId,
        currentTheme,
        setTheme,
        themes,
      }}
    >
      {children}
    </ThemeContext.Provider>
  );
}

export function useTheme() {
  const context = useContext(ThemeContext);
  if (!context) {
    throw new Error("useTheme must be used within a ThemeProvider");
  }
  return context;
}
