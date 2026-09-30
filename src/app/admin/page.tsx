import { redirect } from "next/navigation";
import { getServerSession } from "next-auth";
import { authOptions, ADMIN_EMAILS } from "@/lib/auth";
import { AdminClient } from "./AdminClient";

export const metadata = {
  title: "FocusForge | Admin Control Console",
  description: "Administrative oversight, system analytics, and scholar moderation.",
};

export default async function AdminPage() {
  const session = await getServerSession(authOptions);

  if (!session?.user?.email) {
    redirect("/login");
  }

  const userEmail = session.user.email.toLowerCase().trim();
  const isDesignatedAdmin = ADMIN_EMAILS.some(
    (email) => email.toLowerCase().trim() === userEmail
  );

  // Allow access ONLY if session.user.role === 'ADMIN' or is designated admin
  if (session.user.role !== "ADMIN" && !isDesignatedAdmin) {
    redirect("/dashboard");
  }

  return <AdminClient currentUser={session.user} />;
}
