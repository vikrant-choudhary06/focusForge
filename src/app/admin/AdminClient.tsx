"use client";

import React, { useState, useEffect, useCallback } from "react";
import Link from "next/link";
import {
  ShieldAlert,
  ShieldCheck,
  Search,
  ArrowLeft,
  Flame,
  Clock,
  UserX,
  UserCheck,
  AlertTriangle,
  Loader2,
  RefreshCw,
  Crown,
  Users,
  Hourglass,
} from "lucide-react";

interface AdminUserRecord {
  id: string;
  name: string | null;
  email: string;
  image: string | null;
  role: "USER" | "ADMIN";
  isBlocked: boolean;
  blockedReason: string | null;
  createdAt: string;
  totalFocusSeconds: number;
  allTimeFocusMinutes: number;
  focusSessionCount: number;
  activeStreak: number;
}

interface SystemStats {
  totalSystemHours: string;
  totalUsers: number;
  activeCount: number;
  blockedCount: number;
}

export function AdminClient({
  currentUser,
}: {
  currentUser: { id: string; email?: string | null; name?: string | null; role?: string };
}) {
  const [users, setUsers] = useState<AdminUserRecord[]>([]);
  const [systemStats, setSystemStats] = useState<SystemStats>({
    totalSystemHours: "0.0",
    totalUsers: 0,
    activeCount: 0,
    blockedCount: 0,
  });
  const [isLoading, setIsLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState("");
  const [statusFilter, setStatusFilter] = useState<string>("ALL");

  // Block modal state
  const [selectedUserForBlock, setSelectedUserForBlock] = useState<AdminUserRecord | null>(null);
  const [blockReasonInput, setBlockReasonInput] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [actionError, setActionError] = useState<string | null>(null);

  const fetchUsers = useCallback(async () => {
    setIsLoading(true);
    setActionError(null);
    try {
      const res = await fetch("/api/admin/users");
      if (res.ok) {
        const data = await res.json();
        setUsers(data.users || []);
        if (data.systemStats) {
          setSystemStats(data.systemStats);
        }
      } else {
        const err = await res.json();
        setActionError(err.error || "Failed to fetch users");
      }
    } catch (e) {
      console.error(e);
      setActionError("Error connecting to admin API.");
    } finally {
      setIsLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchUsers();
  }, [fetchUsers]);

  const handleConfirmBlock = async () => {
    if (!selectedUserForBlock) return;
    setIsSubmitting(true);
    setActionError(null);

    try {
      const res = await fetch("/api/admin/users", {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          userId: selectedUserForBlock.id,
          isBlocked: true,
          blockedReason: blockReasonInput.trim() || "Account suspended by administrator.",
        }),
      });

      if (res.ok) {
        setSelectedUserForBlock(null);
        setBlockReasonInput("");
        await fetchUsers();
      } else {
        const err = await res.json();
        setActionError(err.error || "Failed to block user");
      }
    } catch (e) {
      console.error(e);
      setActionError("Failed to submit block action.");
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleUnblock = async (user: AdminUserRecord) => {
    try {
      const res = await fetch("/api/admin/users", {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          userId: user.id,
          isBlocked: false,
        }),
      });
      if (res.ok) {
        await fetchUsers();
      } else {
        const err = await res.json();
        alert(err.error || "Failed to unblock user");
      }
    } catch (e) {
      console.error(e);
    }
  };

  const filteredUsers = users.filter((u) => {
    const matchesSearch =
      (u.name && u.name.toLowerCase().includes(searchQuery.toLowerCase())) ||
      u.email.toLowerCase().includes(searchQuery.toLowerCase());

    const matchesStatus =
      statusFilter === "ALL" ||
      (statusFilter === "BLOCKED" && u.isBlocked) ||
      (statusFilter === "ACTIVE" && !u.isBlocked);

    return matchesSearch && matchesStatus;
  });

  return (
    <div
      style={{
        backgroundColor: "var(--bg-page)",
        color: "var(--text-primary)",
      }}
      className="min-h-screen flex flex-col justify-between selection:bg-red-500/20"
    >
      {/* Top Header */}
      <header
        style={{
          backgroundColor: "var(--bg-card)",
          borderColor: "var(--border-color)",
        }}
        className="w-full border-b backdrop-blur-md sticky top-0 z-30"
      >
        <div className="max-w-6xl mx-auto px-4 sm:px-6 h-16 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <Link
              href="/dashboard"
              style={{
                backgroundColor: "rgba(255, 255, 255, 0.05)",
                borderColor: "var(--border-color)",
              }}
              className="flex items-center gap-1.5 text-xs font-semibold px-3 py-1.5 rounded-xl border hover:bg-white/10 transition active:scale-95 shadow-sm"
            >
              <ArrowLeft className="w-3.5 h-3.5" />
              <span>Back to Dashboard</span>
            </Link>

            <div className="flex items-center gap-2 border-l border-white/10 pl-3">
              <Flame
                style={{ color: "var(--accent-primary)" }}
                className="w-4 h-4"
              />
              <span className="font-bold text-base tracking-tight font-sans">
                FocusForge Admin
              </span>
              <span
                style={{
                  backgroundColor: "rgba(248, 113, 113, 0.15)",
                  borderColor: "rgba(248, 113, 113, 0.3)",
                  color: "var(--accent-primary)",
                }}
                className="text-[10px] font-mono uppercase px-2 py-0.5 rounded-md border font-bold flex items-center gap-1"
              >
                <Crown className="w-2.5 h-2.5" />
                Super Admin
              </span>
            </div>
          </div>

          <div className="flex items-center gap-3">
            <span
              style={{ color: "var(--text-secondary)" }}
              className="hidden sm:inline-block text-xs font-sans"
            >
              Admin: <strong>{currentUser.email}</strong>
            </span>

            <button
              onClick={fetchUsers}
              style={{ color: "var(--text-secondary)" }}
              className="flex items-center gap-1 text-xs hover:text-white transition"
              title="Refresh users"
            >
              <RefreshCw className={`w-3.5 h-3.5 ${isLoading ? "animate-spin" : ""}`} />
            </button>
          </div>
        </div>
      </header>

      {/* Main Content Area */}
      <main className="flex-1 max-w-6xl w-full mx-auto px-4 sm:px-6 py-8 space-y-8">
        {/* System Overview Statistics Cards */}
        <div>
          <div className="mb-4">
            <h1 className="text-2xl font-bold tracking-tight">
              FocusForge Analytics & User Moderation
            </h1>
            <p
              style={{ color: "var(--text-secondary)" }}
              className="text-xs sm:text-sm font-sans mt-0.5"
            >
              Real-time platform overview and administrative control over scholar accounts.
            </p>
          </div>

          {/* 3 Analytics Cards */}
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
            <div
              style={{
                backgroundColor: "var(--bg-card)",
                border: "var(--border-card)",
                borderRadius: "var(--card-radius)",
                boxShadow: "var(--card-shadow)",
                backdropFilter: "blur(16px)",
              }}
              className="p-5 space-y-2"
            >
              <div className="flex items-center justify-between">
                <span
                  style={{ color: "var(--text-secondary)" }}
                  className="text-xs font-semibold uppercase tracking-wider font-mono"
                >
                  Total Focus Hours
                </span>
                <div
                  style={{
                    backgroundColor: "rgba(116, 234, 46, 0.12)",
                    color: "var(--accent-primary)",
                  }}
                  className="p-2 rounded-xl"
                >
                  <Hourglass className="w-4 h-4" />
                </div>
              </div>
              <div className="flex items-baseline gap-1.5">
                <span className="text-2xl sm:text-3xl font-mono font-bold tabular-numbers">
                  {systemStats.totalSystemHours}
                </span>
                <span
                  style={{ color: "var(--text-secondary)" }}
                  className="text-xs font-sans font-semibold"
                >
                  Hours
                </span>
              </div>
            </div>

            <div
              style={{
                backgroundColor: "var(--bg-card)",
                border: "var(--border-card)",
                borderRadius: "var(--card-radius)",
                boxShadow: "var(--card-shadow)",
                backdropFilter: "blur(16px)",
              }}
              className="p-5 space-y-2"
            >
              <div className="flex items-center justify-between">
                <span
                  style={{ color: "var(--text-secondary)" }}
                  className="text-xs font-semibold uppercase tracking-wider font-mono"
                >
                  Active Users
                </span>
                <div className="p-2 rounded-xl bg-emerald-500/10 text-emerald-400">
                  <Users className="w-4 h-4" />
                </div>
              </div>
              <div className="flex items-baseline gap-1.5">
                <span className="text-2xl sm:text-3xl font-mono font-bold tabular-numbers">
                  {systemStats.activeCount}
                </span>
                <span
                  style={{ color: "var(--text-secondary)" }}
                  className="text-xs font-sans font-semibold"
                >
                  / {systemStats.totalUsers} Total
                </span>
              </div>
            </div>

            <div
              style={{
                backgroundColor: "var(--bg-card)",
                border: "var(--border-card)",
                borderRadius: "var(--card-radius)",
                boxShadow: "var(--card-shadow)",
                backdropFilter: "blur(16px)",
              }}
              className="p-5 space-y-2"
            >
              <div className="flex items-center justify-between">
                <span
                  style={{ color: "var(--text-secondary)" }}
                  className="text-xs font-semibold uppercase tracking-wider font-mono"
                >
                  Suspended Accounts
                </span>
                <div className="p-2 rounded-xl bg-rose-500/10 text-rose-400">
                  <ShieldAlert className="w-4 h-4" />
                </div>
              </div>
              <div className="flex items-baseline gap-1.5">
                <span className="text-2xl sm:text-3xl font-mono font-bold tabular-numbers text-rose-400">
                  {systemStats.blockedCount}
                </span>
                <span className="text-xs font-sans text-rose-400 font-semibold">Blocked</span>
              </div>
            </div>
          </div>
        </div>

        {/* User Management Section */}
        <div className="space-y-4">
          <div className="flex flex-col sm:flex-row items-stretch sm:items-center justify-between gap-3">
            <div className="relative flex-1 max-w-md">
              <Search className="w-4 h-4 text-white/40 absolute left-3.5 top-1/2 -translate-y-1/2" />
              <input
                type="text"
                placeholder="Search scholars by name or email..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                style={{
                  backgroundColor: "var(--bg-card)",
                  border: "var(--border-subtle)",
                  color: "var(--text-primary)",
                }}
                className="w-full pl-9 pr-4 py-2 text-xs rounded-full border placeholder:text-white/30 focus:outline-none focus:ring-1 focus:ring-lime-400 shadow-sm"
              />
            </div>

            <div className="flex items-center gap-2">
              <select
                value={statusFilter}
                onChange={(e) => setStatusFilter(e.target.value)}
                style={{
                  backgroundColor: "var(--bg-card)",
                  border: "var(--border-subtle)",
                  color: "var(--text-primary)",
                }}
                className="px-3 py-2 text-xs rounded-full border focus:outline-none shadow-sm cursor-pointer"
              >
                <option value="ALL">All Accounts ({users.length})</option>
                <option value="ACTIVE">Active Users ({systemStats.activeCount})</option>
                <option value="BLOCKED">Suspended Users ({systemStats.blockedCount})</option>
              </select>
            </div>
          </div>

          {actionError && (
            <div className="p-3 rounded-xl bg-rose-500/15 border border-rose-500/30 text-rose-300 text-xs flex items-center gap-2">
              <AlertTriangle className="w-4 h-4 text-rose-400 flex-shrink-0" />
              <span>{actionError}</span>
            </div>
          )}

          {/* Users Table */}
          <div
            style={{
              backgroundColor: "var(--bg-card)",
              border: "var(--border-card)",
              borderRadius: "var(--card-radius)",
              boxShadow: "var(--card-shadow)",
              backdropFilter: "blur(16px)",
            }}
            className="overflow-hidden"
          >
            {isLoading ? (
              <div className="p-16 text-center text-xs text-white/50 flex flex-col items-center gap-2">
                <Loader2 className="w-6 h-6 animate-spin text-amber-500" />
                <span>Loading user records...</span>
              </div>
            ) : filteredUsers.length === 0 ? (
              <div
                style={{ color: "var(--text-secondary)" }}
                className="p-16 text-center text-xs italic"
              >
                No matching accounts found.
              </div>
            ) : (
              <div className="overflow-x-auto">
                <table className="w-full text-left text-xs">
                  <thead
                    style={{
                      backgroundColor: "rgba(255, 255, 255, 0.03)",
                      borderColor: "var(--border-color)",
                      color: "var(--text-secondary)",
                    }}
                    className="border-b font-semibold uppercase text-[10px] tracking-wider"
                  >
                    <tr>
                      <th className="p-3.5 pl-5">Scholar</th>
                      <th className="p-3.5">Active Streak</th>
                      <th className="p-3.5">All-Time Focus</th>
                      <th className="p-3.5">Status</th>
                      <th className="p-3.5 text-right pr-5">Moderation Actions</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-white/5">
                    {filteredUsers.map((u) => {
                      const isSelf = u.id === currentUser.id;
                      const initial = u.name ? u.name.trim()[0].toUpperCase() : u.email[0].toUpperCase();

                      return (
                        <tr
                          key={u.id}
                          className={`hover:bg-white/[0.02] transition-colors ${
                            u.isBlocked ? "bg-rose-500/[0.06]" : ""
                          }`}
                        >
                          <td className="p-3.5 pl-5 flex items-center gap-3">
                            {u.image ? (
                              <img
                                src={u.image}
                                alt={u.name || "User Avatar"}
                                className="w-8 h-8 rounded-full object-cover border border-white/20"
                              />
                            ) : (
                              <div
                                style={{
                                  backgroundColor: "var(--accent-primary)",
                                  color: "#FFFFFF",
                                }}
                                className="w-8 h-8 rounded-full font-bold flex items-center justify-center text-xs shadow-sm"
                              >
                                {initial}
                              </div>
                            )}
                            <div className="flex flex-col truncate max-w-[220px]">
                              <span className="font-semibold flex items-center gap-1.5 truncate">
                                <span>{u.name || "Anonymous Scholar"}</span>
                                {u.role === "ADMIN" && (
                                  <Crown
                                    style={{ color: "var(--accent-primary)" }}
                                    className="w-3 h-3 flex-shrink-0"
                                  />
                                )}
                                {isSelf && (
                                  <span className="text-[9px] bg-white/10 px-1.5 py-0.2 rounded font-normal">
                                    You
                                  </span>
                                )}
                              </span>
                              <span
                                style={{ color: "var(--text-secondary)" }}
                                className="text-[10px] font-sans truncate"
                              >
                                {u.email}
                              </span>
                            </div>
                          </td>

                          <td className="p-3.5">
                            <span className="inline-flex items-center gap-1 font-bold text-amber-300 bg-amber-500/10 px-2 py-0.5 rounded-md border border-amber-500/20">
                              🔥 {u.activeStreak} {u.activeStreak === 1 ? "day" : "days"}
                            </span>
                          </td>

                          <td className="p-3.5 font-mono">
                            <span className="font-bold">{u.allTimeFocusMinutes}</span> mins
                            <span
                              style={{ color: "var(--text-secondary)" }}
                              className="text-[10px] block font-sans"
                            >
                              {u.focusSessionCount} session{u.focusSessionCount === 1 ? "" : "s"}
                            </span>
                          </td>

                          <td className="p-3.5">
                            {u.isBlocked ? (
                              <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-[10px] font-semibold bg-rose-500/20 text-rose-300 border border-rose-500/30">
                                <ShieldAlert className="w-3 h-3" />
                                Suspended
                              </span>
                            ) : (
                              <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-[10px] font-semibold bg-emerald-500/20 text-emerald-300 border border-emerald-500/30">
                                <ShieldCheck className="w-3 h-3" />
                                Active
                              </span>
                            )}
                          </td>

                          <td className="p-3.5 text-right pr-5">
                            {isSelf ? (
                              <span
                                style={{ color: "var(--text-secondary)" }}
                                className="text-[10px] italic"
                              >
                                Self (Admin)
                              </span>
                            ) : u.isBlocked ? (
                              <button
                                onClick={() => handleUnblock(u)}
                                className="inline-flex items-center gap-1 px-3 py-1 text-xs font-semibold rounded-xl bg-emerald-600 hover:bg-emerald-500 text-white shadow-sm transition active:scale-95"
                              >
                                <UserCheck className="w-3.5 h-3.5" />
                                <span>Unblock Account</span>
                              </button>
                            ) : (
                              <button
                                onClick={() => setSelectedUserForBlock(u)}
                                className="inline-flex items-center gap-1 px-3 py-1 text-xs font-semibold rounded-xl bg-rose-500/20 hover:bg-rose-500/30 text-rose-300 border border-rose-500/40 transition active:scale-95"
                              >
                                <UserX className="w-3.5 h-3.5" />
                                <span>Block Account</span>
                              </button>
                            )}
                          </td>
                        </tr>
                      );
                    })}
                  </tbody>
                </table>
              </div>
            )}
          </div>
        </div>
      </main>

      {/* Block Confirmation Modal */}
      {selectedUserForBlock && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/70 backdrop-blur-md animate-in fade-in duration-150">
          <div
            style={{
              backgroundColor: "var(--bg-card)",
              borderColor: "var(--border-color)",
              color: "var(--text-primary)",
            }}
            className="border rounded-3xl p-6 max-w-md w-full shadow-2xl space-y-4"
          >
            <div className="flex items-center gap-2.5 text-rose-400">
              <ShieldAlert className="w-5 h-5" />
              <h3 className="font-bold text-base">
                Suspend Scholar Account
              </h3>
            </div>

            <p
              style={{ color: "var(--text-secondary)" }}
              className="text-xs"
            >
              You are suspending access for{" "}
              <strong className="text-white">{selectedUserForBlock.name || selectedUserForBlock.email}</strong>.
            </p>

            <div>
              <label
                style={{ color: "var(--text-secondary)" }}
                className="block text-[11px] font-semibold uppercase tracking-wider mb-1"
              >
                Reason for Suspension
              </label>
              <textarea
                rows={3}
                placeholder="e.g., Terms violation or abusive profile"
                value={blockReasonInput}
                onChange={(e) => setBlockReasonInput(e.target.value)}
                style={{
                  backgroundColor: "rgba(255, 255, 255, 0.04)",
                  borderColor: "var(--border-color)",
                  color: "var(--text-primary)",
                }}
                className="w-full p-2.5 text-xs rounded-xl border focus:outline-none focus:ring-1 focus:ring-rose-500"
              />
            </div>

            <div
              style={{ borderColor: "var(--border-color)" }}
              className="flex items-center justify-end gap-2 pt-2 border-t"
            >
              <button
                onClick={() => {
                  setSelectedUserForBlock(null);
                  setBlockReasonInput("");
                }}
                disabled={isSubmitting}
                className="px-4 py-2 text-xs font-semibold opacity-70 hover:opacity-100 transition"
              >
                Cancel
              </button>
              <button
                onClick={handleConfirmBlock}
                disabled={isSubmitting}
                className="px-4 py-2 text-xs font-semibold rounded-xl bg-rose-600 hover:bg-rose-500 text-white shadow-md transition active:scale-95"
              >
                {isSubmitting ? "Suspending..." : "Confirm & Block"}
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Footer */}
      <footer
        style={{ color: "var(--text-secondary)" }}
        className="w-full border-t border-white/5 py-4 text-center text-xs font-mono opacity-60"
      >
        <p>FocusForge Admin Moderation Console</p>
      </footer>
    </div>
  );
}
