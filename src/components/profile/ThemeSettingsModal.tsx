"use client";

import React, { useState, useRef } from "react";
import Link from "next/link";
import { signOut, useSession } from "next-auth/react";
import {
  X,
  LogOut,
  Palette,
  Upload,
  ShieldCheck,
  Check,
  Loader2,
  Crown,
  Link as LinkIcon,
} from "lucide-react";
import { useTheme, ThemeId } from "@/context/ThemeContext";

interface ThemeSettingsModalProps {
  isOpen: boolean;
  onClose: () => void;
  user: {
    id?: string;
    name?: string | null;
    email?: string | null;
    image?: string | null;
    role?: "USER" | "ADMIN";
  };
  onAvatarUpdated?: (newImage: string) => void;
}

export const ThemeSettingsModal: React.FC<ThemeSettingsModalProps> = ({
  isOpen,
  onClose,
  user,
  onAvatarUpdated,
}) => {
  const { currentThemeId, setTheme, themes } = useTheme();
  const { update: updateSession } = useSession();

  const [currentImage, setCurrentImage] = useState<string | null>(user.image || null);
  const [imageError, setImageError] = useState(false);
  const [isUploading, setIsUploading] = useState(false);
  const [customImageUrlInput, setCustomImageUrlInput] = useState("");
  const [avatarSuccessMsg, setAvatarSuccessMsg] = useState<string | null>(null);
  const [avatarErrorMsg, setAvatarErrorMsg] = useState<string | null>(null);

  const fileInputRef = useRef<HTMLInputElement>(null);

  if (!isOpen) return null;

  const userInitial = user.name
    ? user.name.trim()[0].toUpperCase()
    : user.email
    ? user.email.trim()[0].toUpperCase()
    : "F";

  const handleSaveAvatar = async (imageUrl: string) => {
    setIsUploading(true);
    setAvatarSuccessMsg(null);
    setAvatarErrorMsg(null);

    try {
      const res = await fetch("/api/user/avatar", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ image: imageUrl }),
      });

      if (res.ok) {
        setCurrentImage(imageUrl);
        setImageError(false);
        setAvatarSuccessMsg("Profile picture updated!");
        onAvatarUpdated?.(imageUrl);
        await updateSession({ image: imageUrl });
      } else {
        const err = await res.json();
        setAvatarErrorMsg(err.error || "Failed to update avatar");
      }
    } catch (e) {
      console.error(e);
      setAvatarErrorMsg("Network error updating avatar.");
    } finally {
      setIsUploading(false);
    }
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    if (file.size > 2 * 1024 * 1024) {
      setAvatarErrorMsg("Image file size must be less than 2MB.");
      return;
    }

    const reader = new FileReader();
    reader.onloadend = () => {
      const base64String = reader.result as string;
      handleSaveAvatar(base64String);
    };
    reader.readAsDataURL(file);
  };

  const handleCustomUrlSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!customImageUrlInput.trim()) return;
    handleSaveAvatar(customImageUrlInput.trim());
    setCustomImageUrlInput("");
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 sm:p-6 animate-in fade-in duration-200">
      {/* Backdrop */}
      <div
        className="fixed inset-0 bg-black/75 backdrop-blur-md"
        onClick={onClose}
      />

      {/* Modal Dialog */}
      <div
        style={{
          backgroundColor: "var(--bg-card)",
          border: "var(--border-card)",
          color: "var(--text-primary)",
          borderRadius: "var(--card-radius)",
          boxShadow: "var(--card-shadow)",
          backdropFilter: "blur(var(--backdrop-blur))",
          WebkitBackdropFilter: "blur(var(--backdrop-blur))",
        }}
        className="relative z-10 w-full max-w-xl max-h-[92vh] overflow-y-auto p-6 sm:p-8 space-y-6"
      >
        {/* Header */}
        <div
          style={{ borderColor: "rgba(255, 255, 255, 0.1)" }}
          className="flex items-center justify-between pb-4 border-b"
        >
          <div className="flex items-center gap-2.5">
            <Palette
              style={{ color: "var(--accent-color, var(--accent-primary))" }}
              className="w-5 h-5"
            />
            <h2 className="font-bold text-lg tracking-tight font-display">
              Settings & Theme Engine
            </h2>
          </div>
          <button
            onClick={onClose}
            className="p-1.5 rounded-xl opacity-60 hover:opacity-100 hover:bg-white/10 transition"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* User Account Bar */}
        <div
          style={{
            backgroundColor: "rgba(255, 255, 255, 0.03)",
            borderColor: "rgba(255, 255, 255, 0.08)",
          }}
          className="p-4 rounded-2xl border flex items-center justify-between"
        >
          <div className="flex items-center gap-3.5">
            <div className="relative">
              {!imageError && currentImage ? (
                <img
                  src={currentImage}
                  alt={user.name || "User Avatar"}
                  onError={() => setImageError(true)}
                  className="w-12 h-12 rounded-full border-2 border-white/20 object-cover shadow-sm"
                />
              ) : (
                <div
                  style={{
                    backgroundColor: "var(--accent-color, var(--accent-primary))",
                    color: "var(--accent-btn-text)",
                  }}
                  className="w-12 h-12 rounded-full font-bold text-lg flex items-center justify-center shadow-sm border-2 border-white/20"
                >
                  {userInitial}
                </div>
              )}
              <span className="absolute -bottom-0.5 -right-0.5 p-0.5 rounded-full bg-emerald-500 border-2 border-[#0F1015]">
                <ShieldCheck className="w-3 h-3 text-white" />
              </span>
            </div>

            <div className="flex flex-col">
              <div className="flex items-center gap-1.5">
                <span className="font-semibold text-sm">
                  {user.name || "FocusForge Scholar"}
                </span>
                {user.role === "ADMIN" && (
                  <span
                    style={{
                      backgroundColor: "rgba(255, 255, 255, 0.1)",
                      color: "var(--accent-color, var(--accent-primary))",
                      borderColor: "rgba(255, 255, 255, 0.2)",
                    }}
                    className="inline-flex items-center gap-0.5 px-2 py-0.5 rounded text-[10px] font-bold border"
                  >
                    <Crown className="w-2.5 h-2.5" />
                    Admin
                  </span>
                )}
              </div>
              <span
                style={{ color: "var(--text-secondary)" }}
                className="text-xs font-sans"
              >
                {user.email || "Authenticated Account"}
              </span>
            </div>
          </div>

          <div className="flex items-center gap-2">
            {user.role === "ADMIN" && (
              <Link
                href="/admin"
                className="flex items-center gap-1 px-3 py-1.5 rounded-xl text-xs font-semibold bg-white/10 hover:bg-white/15 border border-white/20 transition"
              >
                <Crown className="w-3.5 h-3.5" />
                <span>Admin</span>
              </Link>
            )}

            <button
              onClick={() => signOut({ callbackUrl: "/login" })}
              className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl text-xs font-semibold bg-white/5 hover:bg-white/10 border border-white/10 opacity-80 hover:opacity-100 transition active:scale-95"
            >
              <LogOut className="w-3.5 h-3.5" />
              <span>Sign Out</span>
            </button>
          </div>
        </div>

        {/* 5-Theme Selection Engine */}
        <div className="space-y-3">
          <div className="flex items-center justify-between">
            <label
              style={{ color: "var(--text-secondary)" }}
              className="block text-xs font-bold uppercase tracking-wider font-display"
            >
              Visual Themes (5 Presets)
            </label>
            <span
              style={{ color: "var(--accent-color, var(--accent-primary))" }}
              className="text-xs font-mono font-semibold"
            >
              Active: {currentThemeId.toUpperCase()}
            </span>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            {themes.map((theme) => {
              const isActive = currentThemeId === theme.id;
              return (
                <button
                  key={theme.id}
                  onClick={() => setTheme(theme.id as ThemeId)}
                  className={`p-4 rounded-2xl border text-left transition-all duration-200 relative overflow-hidden group flex flex-col justify-between ${
                    isActive
                      ? "ring-2 ring-offset-2 ring-offset-[#080A09] shadow-lg scale-[1.02]"
                      : "hover:scale-[1.01] opacity-80 hover:opacity-100"
                  }`}
                  style={{
                    backgroundColor: theme.bgCard,
                    borderColor: isActive ? theme.accentPrimary : theme.borderColor,
                    color: theme.textPrimary,
                  }}
                >
                  <div className="flex items-center justify-between w-full mb-2">
                    <div className="flex items-center gap-2">
                      <div className="flex items-center -space-x-1">
                        <span
                          className="w-3.5 h-3.5 rounded-full border border-white/40 shadow-sm"
                          style={{ backgroundColor: theme.bgPage }}
                        />
                        <span
                          className="w-3.5 h-3.5 rounded-full border border-white/40 shadow-sm"
                          style={{ backgroundColor: theme.accentPrimary }}
                        />
                        <span
                          className="w-3.5 h-3.5 rounded-full border border-white/40 shadow-sm"
                          style={{ backgroundColor: theme.accentSecondary }}
                        />
                      </div>
                      <span className="text-xs font-bold font-display">{theme.name}</span>
                    </div>

                    {isActive && (
                      <span
                        style={{
                          backgroundColor: theme.accentPrimary,
                          color: theme.accentBtnText,
                        }}
                        className="w-5 h-5 rounded-full flex items-center justify-center text-xs font-bold shadow-sm"
                      >
                        <Check className="w-3.5 h-3.5 stroke-[3]" />
                      </span>
                    )}
                  </div>

                  <p
                    style={{ color: theme.textSecondary }}
                    className="text-[11px] mb-2 leading-relaxed"
                  >
                    {theme.subtitle}
                  </p>

                  <div className="flex items-center justify-between text-[10px] pt-2 border-t border-white/10">
                    <span
                      style={{ color: theme.textSecondary }}
                      className="font-mono text-[9px]"
                    >
                      {theme.fontDisplay}
                    </span>
                    <span
                      style={{ color: theme.accentPrimary }}
                      className="font-semibold font-mono"
                    >
                      {isActive ? "✓ Selected" : "Apply"}
                    </span>
                  </div>
                </button>
              );
            })}
          </div>
        </div>

        {/* Custom Profile Picture Upload */}
        <div
          style={{
            backgroundColor: "rgba(255, 255, 255, 0.02)",
            borderColor: "rgba(255, 255, 255, 0.08)",
          }}
          className="space-y-3 p-4 rounded-2xl border"
        >
          <label
            style={{ color: "var(--text-secondary)" }}
            className="block text-xs font-semibold uppercase tracking-wider font-display"
          >
            Custom Avatar
          </label>

          <div className="flex flex-wrap items-center gap-2.5">
            <input
              type="file"
              ref={fileInputRef}
              onChange={handleFileChange}
              accept="image/png, image/jpeg, image/webp"
              className="hidden"
            />
            <button
              onClick={() => fileInputRef.current?.click()}
              disabled={isUploading}
              style={{
                borderColor: "rgba(255, 255, 255, 0.15)",
                backgroundColor: "rgba(255, 255, 255, 0.06)",
              }}
              className="flex items-center gap-1.5 px-3.5 py-2 text-xs font-semibold rounded-xl border hover:bg-white/10 shadow-sm transition active:scale-95 disabled:opacity-60"
            >
              {isUploading ? (
                <Loader2 className="w-3.5 h-3.5 animate-spin" />
              ) : (
                <Upload className="w-3.5 h-3.5 opacity-80" />
              )}
              <span>Upload Image (PNG/JPG)</span>
            </button>
          </div>

          <form onSubmit={handleCustomUrlSubmit} className="flex items-center gap-1.5 pt-1">
            <div className="relative flex-1">
              <LinkIcon className="w-3 h-3 text-white/40 absolute left-2.5 top-1/2 -translate-y-1/2" />
              <input
                type="url"
                placeholder="Or paste direct image URL (https://...)"
                value={customImageUrlInput}
                onChange={(e) => setCustomImageUrlInput(e.target.value)}
                style={{
                  backgroundColor: "rgba(255, 255, 255, 0.04)",
                  borderColor: "rgba(255, 255, 255, 0.12)",
                  color: "var(--text-primary)",
                }}
                className="w-full pl-7 pr-3 py-2 text-xs rounded-xl border placeholder:text-white/30 focus:outline-none focus:ring-1 focus:ring-white/40"
              />
            </div>
            <button
              type="submit"
              disabled={isUploading || !customImageUrlInput.trim()}
              className="theme-accent-btn px-3.5 py-2 text-xs font-semibold rounded-xl shadow-sm hover:brightness-110 disabled:opacity-50 transition"
            >
              Save URL
            </button>
          </form>

          {avatarSuccessMsg && (
            <p className="text-[11px] text-emerald-400 font-medium flex items-center gap-1">
              <Check className="w-3 h-3" /> {avatarSuccessMsg}
            </p>
          )}
          {avatarErrorMsg && (
            <p className="text-[11px] text-rose-400 font-medium">{avatarErrorMsg}</p>
          )}
        </div>

        {/* Footer */}
        <div
          style={{ borderColor: "rgba(255, 255, 255, 0.1)" }}
          className="flex items-center justify-end pt-4 border-t"
        >
          <button
            onClick={onClose}
            className="theme-accent-btn px-6 py-2.5 text-xs font-bold shadow-md hover:brightness-110 active:scale-95 transition"
            style={{
              borderRadius: "var(--card-radius)",
            }}
          >
            Done & Apply Theme
          </button>
        </div>
      </div>
    </div>
  );
};
