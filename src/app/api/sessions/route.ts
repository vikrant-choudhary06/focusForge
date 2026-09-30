import { NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { db } from "@/lib/db";
import { calculateAndUpdateStreak } from "@/lib/streak";
import { startOfDay, subDays } from "date-fns";

export async function GET() {
  try {
    const session = await getServerSession(authOptions);

    if (!session?.user?.email) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const user = await db.user.findUnique({
      where: { email: session.user.email },
    });

    if (!user) {
      return NextResponse.json({ error: "User not found" }, { status: 404 });
    }

    if (user.isBlocked) {
      return NextResponse.json(
        { error: "Account suspended: " + (user.blockedReason || "Access restricted.") },
        { status: 403 }
      );
    }

    const todayDate = startOfDay(new Date());

    // 1. Fetch Today's DailyStat
    const todayStat = await db.dailyStat.findUnique({
      where: {
        userId_date: {
          userId: user.id,
          date: todayDate,
        },
      },
    });

    // 2. Fetch last 30 days of stats for contribution heatmap
    const thirtyDaysAgo = startOfDay(subDays(todayDate, 29));
    const recentHistory = await db.dailyStat.findMany({
      where: {
        userId: user.id,
        date: {
          gte: thirtyDaysAgo,
        },
      },
      orderBy: { date: "asc" },
    });

    // 3. Fetch recent focus sessions
    const recentSessions = await db.focusSession.findMany({
      where: { userId: user.id },
      orderBy: { startedAt: "desc" },
      take: 10,
    });

    const totalSeconds = todayStat?.totalSeconds ?? 0;
    const targetSeconds = todayStat?.targetSeconds ?? 7200; // default 2 hours
    const streakCount = todayStat?.streakCount ?? 0;
    const progressPercentage = Math.min(
      Math.round((totalSeconds / targetSeconds) * 100),
      100
    );
    const isGoalMet = totalSeconds >= targetSeconds;

    return NextResponse.json({
      todayStats: {
        totalSeconds,
        targetSeconds,
        streakCount,
        progressPercentage,
        isGoalMet,
      },
      recentHistory,
      recentSessions,
    });
  } catch (error) {
    console.error("GET /api/sessions error:", error);
    return NextResponse.json(
      { error: "Internal Server Error" },
      { status: 500 }
    );
  }
}

export async function POST(req: Request) {
  try {
    const session = await getServerSession(authOptions);

    if (!session?.user?.email) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const user = await db.user.findUnique({
      where: { email: session.user.email },
    });

    if (!user) {
      return NextResponse.json({ error: "User not found" }, { status: 404 });
    }

    if (user.isBlocked) {
      return NextResponse.json(
        { error: "Account suspended: " + (user.blockedReason || "Access restricted.") },
        { status: 403 }
      );
    }

    const body = await req.json();
    const { duration, startedAt, endedAt } = body;

    // Requirement: Prevent saving accidental clicks shorter than 10 seconds
    if (typeof duration !== "number" || duration < 10) {
      return NextResponse.json(
        { error: "Session duration must be at least 10 seconds to log." },
        { status: 400 }
      );
    }

    const startDate = startedAt ? new Date(startedAt) : new Date(Date.now() - duration * 1000);
    const endDate = endedAt ? new Date(endedAt) : new Date();
    const todayDate = startOfDay(new Date());

    // 1. Create the FocusSession record
    const focusSession = await db.focusSession.create({
      data: {
        userId: user.id,
        duration: Math.round(duration),
        startedAt: startDate,
        endedAt: endDate,
      },
    });

    // 2. Upsert Today's DailyStat
    const dailyStat = await db.dailyStat.upsert({
      where: {
        userId_date: {
          userId: user.id,
          date: todayDate,
        },
      },
      update: {
        totalSeconds: { increment: Math.round(duration) },
      },
      create: {
        userId: user.id,
        date: todayDate,
        totalSeconds: Math.round(duration),
        targetSeconds: 7200, // 2 hours default
        streakCount: 0,
      },
    });

    // 3. Compute and update streak continuity
    const activeStreak = await calculateAndUpdateStreak(
      user.id,
      todayDate,
      dailyStat.totalSeconds,
      dailyStat.targetSeconds
    );

    return NextResponse.json({
      success: true,
      focusSession,
      todayTotalSeconds: dailyStat.totalSeconds,
      activeStreak,
    });
  } catch (error) {
    console.error("POST /api/sessions error:", error);
    return NextResponse.json(
      { error: "Internal Server Error" },
      { status: 500 }
    );
  }
}
