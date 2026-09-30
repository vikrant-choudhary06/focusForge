import { redirect } from "next/navigation";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { DashboardClient } from "./DashboardClient";

export const metadata = {
  title: "FocusForge | Focus Workspace & Forge",
  description: "Tactile, aesthetic deep work timer, streak tracking, and ambient study soundscapes.",
};

export default async function DashboardPage() {
  const session = await getServerSession(authOptions);

  // Restrict access for unauthenticated users
  if (!session?.user) {
    redirect("/login");
  }

  // Redirect blocked/suspended users
  if (session.user.isBlocked) {
    redirect("/blocked");
  }

  return <DashboardClient user={session.user} />;
}
