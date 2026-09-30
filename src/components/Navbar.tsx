"use client";

import React, { useState } from "react";
import Link from "next/link";
import { signOut } from "next-auth/react";
import { Flame, Crown, Palette, Timer, BarChart2, LogOut, LogIn } from "lucide-react";

interface NavbarProps {
  user?: {
    id?: string;
    name?: string | null;
    email?: string | null;
    image?: string | null;
    role?: string;
  } | null;
  onOpenThemeModal?: () => void;
  onOpenAnalytics?: () => void;
}

export const Navbar: React.FC<NavbarProps> = ({
  user,
  onOpenThemeModal,
  onOpenAnalytics,
}) => {
  const [imageError, setImageError] = useState(false);

  const userInitial = user?.name
    ? user.name.trim()[0].toUpperCase()
    : user?.email
    ? user.email.trim()[0].toUpperCase()
    : "F";

  const isAdmin =
    user?.role === "ADMIN" ||
    user?.email?.toLowerCase().trim() === "vdevlekar81@gmail.com";

  return (
    <header className="w-full px-4 sm:px-6 pt-2 sm:pt-4 sticky top-0 z-40 pointer-events-none">
      <div className="max-w-4xl mx-auto bg-white text-stone-900 rounded-full px-6 sm:px-8 py-3 sm:py-3.5 flex items-center justify-between shadow-[0_12px_40px_rgba(0,0,0,0.6)] pointer-events-auto transition-all duration-300">
        {/* Left: Brand Title */}
        <Link href="/dashboard" className="flex items-center gap-2.5 group">
          <div
            style={{ color: "var(--accent-color, var(--accent-primary))" }}
            className="p-1.5 rounded-full bg-stone-950 transition-transform group-hover:scale-105 shadow-sm"
          >
            <Flame className="w-4 h-4 fill-current" />
          </div>
          <span className="font-extrabold text-base sm:text-lg tracking-tight font-sans text-stone-950">
            FocusForge
          </span>
        </Link>

        {/* Center: Minimal Navigation Links */}
        <nav className="hidden md:flex items-center gap-6 text-xs font-semibold text-stone-600">
          <a
            href="#stopwatch"
            className="hover:text-stone-950 transition-colors flex items-center gap-1.5"
          >
            <Timer className="w-3.5 h-3.5" />
            <span>Stopwatch</span>
          </a>

          <button
            type="button"
            onClick={onOpenThemeModal}
            className="hover:text-stone-950 transition-colors flex items-center gap-1.5 cursor-pointer"
          >
            <Palette
              style={{ color: "var(--accent-color, var(--accent-primary))" }}
              className="w-3.5 h-3.5"
            />
            <span>Themes</span>
          </button>

          <a
            href="#constellation"
            onClick={onOpenAnalytics}
            className="hover:text-stone-950 transition-colors flex items-center gap-1.5"
          >
            <BarChart2 className="w-3.5 h-3.5" />
            <span>Analytics</span>
          </a>

          {isAdmin && (
            <Link
              href="/admin"
              className="flex items-center gap-1 text-rose-600 font-bold hover:text-rose-700 transition-colors"
            >
              <Crown className="w-3.5 h-3.5" />
              <span>Admin</span>
            </Link>
          )}
        </nav>

        {/* Right: User Profile Avatar Capsule and Dark Sign In/Out Button */}
        <div className="flex items-center gap-2 sm:gap-3">
          {user ? (
            <>
              {/* Profile Avatar Pill */}
              <button
                type="button"
                onClick={onOpenThemeModal}
                className="flex items-center gap-2 p-0.5 rounded-full hover:opacity-85 transition-all shadow-sm"
                title="Theme Engine & Profile"
              >
                {!imageError && user.image ? (
                  <img
                    src={user.image}
                    alt={user.name || "User Avatar"}
                    onError={() => setImageError(true)}
                    className="w-8 h-8 rounded-full object-cover border border-stone-200"
                  />
                ) : (
                  <div
                    style={{ color: "var(--accent-color, var(--accent-primary))" }}
                    className="w-8 h-8 rounded-full font-bold text-xs flex items-center justify-center bg-stone-950 shadow-sm"
                  >
                    {userInitial}
                  </div>
                )}
              </button>

              {/* Rounded Dark Sign Out Button */}
              <button
                type="button"
                onClick={() => signOut({ callbackUrl: "/login" })}
                className="bg-stone-950 hover:bg-stone-800 text-white rounded-full px-4 sm:px-5 py-2 text-xs font-semibold shadow-md active:scale-95 transition-all flex items-center gap-1.5"
                title="Sign out of FocusForge"
              >
                <span>Sign out</span>
                <LogOut className="w-3 h-3 opacity-60" />
              </button>
            </>
          ) : (
            <Link
              href="/login"
              className="bg-stone-950 hover:bg-stone-800 text-white rounded-full px-5 py-2 text-xs font-semibold shadow-md active:scale-95 transition-all flex items-center gap-1.5"
            >
              <span>Login</span>
              <LogIn
                style={{ color: "var(--accent-color, var(--accent-primary))" }}
                className="w-3.5 h-3.5"
              />
            </Link>
          )}
        </div>
      </div>
    </header>
  );
};

export default Navbar;
