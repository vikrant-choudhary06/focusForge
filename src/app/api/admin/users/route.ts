import { NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions, ADMIN_EMAILS } from "@/lib/auth";
import { db } from "@/lib/db";

export async function GET() {
  try {
    const session = await getServerSession(authOptions);

    if (!session?.user?.email) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const userEmail = session.user.email.toLowerCase().trim();
    const isDesignatedAdmin = ADMIN_EMAILS.some(
      (email) => email.toLowerCase().trim() === userEmail
    );

    // Verify requesting user is ADMIN
    const currentUser = await db.user.findUnique({
      where: { email: userEmail },
      select: { role: true },
    });

    if (currentUser?.role !== "ADMIN" && !isDesignatedAdmin) {
      return NextResponse.json(
        { error: "Forbidden: Admin privileges required." },
        { status: 403 }
      );
    }

    // Fetch all users with focus sessions & daily stats
    const users = await db.user.findMany({
      orderBy: { createdAt: "desc" },
      include: {
        focusSessions: {
          select: { duration: true },
        },
        dailyStats: {
          orderBy: { date: "desc" },
          take: 1,
          select: { streakCount: true },
        },
      },
    });

    let systemTotalSeconds = 0;
    let blockedCount = 0;
    let activeCount = 0;

    const formattedUsers = users.map((u) => {
      const userTotalSeconds = u.focusSessions.reduce((sum, s) => sum + s.duration, 0);
      systemTotalSeconds += userTotalSeconds;

      if (u.isBlocked) {
        blockedCount++;
      } else {
        activeCount++;
      }

      const activeStreak = u.dailyStats[0]?.streakCount || 0;
      const allTimeFocusMinutes = Math.floor(userTotalSeconds / 60);

      return {
        id: u.id,
        name: u.name,
        email: u.email,
        image: u.image,
        role: u.role,
        isBlocked: u.isBlocked,
        blockedReason: u.blockedReason,
        createdAt: u.createdAt.toISOString(),
        totalFocusSeconds: userTotalSeconds,
        allTimeFocusMinutes,
        focusSessionCount: u.focusSessions.length,
        activeStreak,
      };
    });

    const totalSystemHours = (systemTotalSeconds / 3600).toFixed(1);

    return NextResponse.json({
      systemStats: {
        totalSystemHours,
        totalUsers: users.length,
        activeCount,
        blockedCount,
      },
      users: formattedUsers,
    });
  } catch (error) {
    console.error("GET /api/admin/users error:", error);
    return NextResponse.json({ error: "Internal Server Error" }, { status: 500 });
  }
}

export async function PATCH(req: Request) {
  try {
    const session = await getServerSession(authOptions);

    if (!session?.user?.email) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const userEmail = session.user.email.toLowerCase().trim();
    const isDesignatedAdmin = ADMIN_EMAILS.some(
      (email) => email.toLowerCase().trim() === userEmail
    );

    const currentAdmin = await db.user.findUnique({
      where: { email: userEmail },
      select: { id: true, role: true },
    });

    if (currentAdmin?.role !== "ADMIN" && !isDesignatedAdmin) {
      return NextResponse.json(
        { error: "Forbidden: Admin privileges required." },
        { status: 403 }
      );
    }

    const body = await req.json();
    const { userId, role, isBlocked, blockedReason } = body;

    if (!userId) {
      return NextResponse.json({ error: "User ID is required." }, { status: 400 });
    }

    // Prevent blocking self or designated admin
    if (currentAdmin && userId === currentAdmin.id && isBlocked === true) {
      return NextResponse.json(
        { error: "You cannot block your own administrator account." },
        { status: 400 }
      );
    }

    const targetUser = await db.user.findUnique({ where: { id: userId } });
    if (
      targetUser &&
      ADMIN_EMAILS.some((e) => e.toLowerCase().trim() === targetUser.email?.toLowerCase().trim()) &&
      isBlocked === true
    ) {
      return NextResponse.json(
        { error: "Designated Super Admin cannot be blocked." },
        { status: 400 }
      );
    }

    const updateData: {
      role?: "USER" | "ADMIN";
      isBlocked?: boolean;
      blockedReason?: string | null;
    } = {};

    if (role !== undefined) updateData.role = role;
    if (isBlocked !== undefined) {
      updateData.isBlocked = isBlocked;
      updateData.blockedReason = isBlocked
        ? blockedReason || "Account suspended by administrator."
        : null;
    }

    const updated = await db.user.update({
      where: { id: userId },
      data: updateData,
    });

    return NextResponse.json({
      success: true,
      message: "User status updated successfully.",
      user: {
        id: updated.id,
        name: updated.name,
        email: updated.email,
        role: updated.role,
        isBlocked: updated.isBlocked,
        blockedReason: updated.blockedReason,
      },
    });
  } catch (error) {
    console.error("PATCH /api/admin/users error:", error);
    return NextResponse.json({ error: "Failed to update user status." }, { status: 500 });
  }
}
