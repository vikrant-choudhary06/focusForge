import { NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { db } from "@/lib/db";

export async function POST(req: Request) {
  try {
    const session = await getServerSession(authOptions);

    if (!session?.user?.email) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const body = await req.json();
    const { image } = body;

    if (!image || typeof image !== "string") {
      return NextResponse.json(
        { error: "Valid image data or URL is required." },
        { status: 400 }
      );
    }

    // Update user avatar in PostgreSQL
    const updatedUser = await db.user.update({
      where: { email: session.user.email },
      data: { image },
      select: { id: true, name: true, email: true, image: true, role: true },
    });

    return NextResponse.json({
      success: true,
      message: "Avatar updated successfully.",
      user: updatedUser,
      image: updatedUser.image,
    });
  } catch (error) {
    console.error("Error updating avatar:", error);
    return NextResponse.json(
      { error: "Failed to update profile avatar." },
      { status: 500 }
    );
  }
}
