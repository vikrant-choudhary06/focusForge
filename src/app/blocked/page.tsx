"use client";

import React from "react";
import { signOut, useSession } from "next-auth/react";
import { ShieldAlert, LogOut, Flame } from "lucide-react";

export default function BlockedPage() {
  const { data: session } = useSession();

  return (
    <div className="min-h-screen bg-[#0F1015] text-slate-100 flex flex-col justify-between p-6 select-none">
      {/* Header */}
      <header className="max-w-4xl w-full mx-auto flex items-center justify-between">
        <div className="flex items-center gap-2.5">
          <div className="p-2 rounded-2xl bg-red-500/10 border border-red-500/20 text-red-400 shadow-sm">
            <Flame className="w-4 h-4 text-red-400" />
          </div>
          <span className="font-bold text-lg tracking-tight text-white font-sans">
            FocusForge
          </span>
        </div>
      </header>

      {/* Main Block Notice Box */}
      <div className="max-w-md w-full mx-auto my-12">
        <div className="bg-[#181A22] border border-rose-500/30 rounded-3xl p-8 shadow-2xl text-center space-y-5">
          <div className="inline-flex p-4 rounded-2xl bg-rose-500/10 border border-rose-500/20 text-rose-400">
            <ShieldAlert className="w-8 h-8" />
          </div>

          <div>
            <h1 className="text-2xl font-bold text-white">
              Account Suspended
            </h1>
            <p className="text-xs text-slate-400 font-sans mt-1">
              Your FocusForge access has been restricted by an administrator.
            </p>
          </div>

          <div className="p-4 rounded-2xl bg-rose-500/10 border border-rose-500/20 text-left text-xs space-y-1">
            <span className="font-semibold text-rose-300 block">Suspension Reason:</span>
            <p className="text-rose-200">
              {session?.user?.blockedReason ||
                "Violation of community study rules or unauthorized activity."}
            </p>
          </div>

          <button
            onClick={() => signOut({ callbackUrl: "/login" })}
            className="w-full flex items-center justify-center gap-2 py-3 px-4 rounded-2xl bg-white/10 hover:bg-white/20 text-white text-xs font-semibold shadow-sm transition active:scale-95 border border-white/10"
          >
            <LogOut className="w-4 h-4" />
            <span>Sign Out</span>
          </button>
        </div>
      </div>

      <footer className="max-w-4xl w-full mx-auto text-center text-xs text-slate-500 font-mono">
        <p>FocusForge &bull; Deep Work & Productivity Workspace</p>
      </footer>
    </div>
  );
}
