import { NextAuthOptions, DefaultSession } from "next-auth";
import GoogleProvider from "next-auth/providers/google";
import { PrismaAdapter } from "@next-auth/prisma-adapter";
import { db } from "@/lib/db";

export const ADMIN_EMAILS = ["vdevlekar81@gmail.com"];

declare module "next-auth" {
  interface Session {
    user: {
      id: string;
      role: "USER" | "ADMIN";
      isBlocked: boolean;
      blockedReason?: string | null;
      image?: string | null;
    } & DefaultSession["user"];
  }

  interface User {
    role?: "USER" | "ADMIN";
    isBlocked?: boolean;
    blockedReason?: string | null;
  }
}

declare module "next-auth/jwt" {
  interface JWT {
    id?: string;
    role?: "USER" | "ADMIN";
    isBlocked?: boolean;
    blockedReason?: string | null;
    image?: string | null;
  }
}

export const authOptions: NextAuthOptions = {
  adapter: PrismaAdapter(db),
  providers: [
    GoogleProvider({
      clientId: process.env.GOOGLE_CLIENT_ID || "",
      clientSecret: process.env.GOOGLE_CLIENT_SECRET || "",
    }),
  ],
  secret: process.env.NEXTAUTH_SECRET,
  session: {
    strategy: "jwt",
  },
  pages: {
    signIn: "/login",
    error: "/login",
  },
  events: {
    async createUser({ user }) {
      if (user.email && ADMIN_EMAILS.some((e) => e.toLowerCase().trim() === user.email?.toLowerCase().trim())) {
        await db.user.update({
          where: { id: user.id },
          data: { role: "ADMIN" },
        });
      }
    },
  },
  callbacks: {
    async signIn({ user, account, profile }) {
      if (!user.email) return false;

      const userEmail = user.email.toLowerCase().trim();
      const isAdminEmail = ADMIN_EMAILS.some(
        (adminEmail) => adminEmail.toLowerCase().trim() === userEmail
      );

      // Check existing user record in DB
      const existingUser = await db.user.findUnique({
        where: { email: userEmail },
      });

      // If user is blocked, reject sign-in and redirect to /blocked
      if (existingUser?.isBlocked) {
        return "/blocked";
      }

      // Automatically promote designated admin email to Role.ADMIN
      if (isAdminEmail) {
        if (existingUser && existingUser.role !== "ADMIN") {
          await db.user.update({
            where: { email: userEmail },
            data: { role: "ADMIN" },
          });
        }
        user.role = "ADMIN";
      }

      return true;
    },

    async jwt({ token, user, trigger, session }) {
      if (user) {
        token.id = user.id;
        token.role = user.role || (ADMIN_EMAILS.includes(user.email || "") ? "ADMIN" : "USER");
        token.isBlocked = user.isBlocked || false;
        token.blockedReason = user.blockedReason || null;
        token.image = user.image;
      }

      // Handle client-side session update triggers (e.g. avatar change)
      if (trigger === "update" && session?.image) {
        token.image = session.image;
      }

      // Refresh role and blocked status from DB
      if (token.email) {
        const userEmail = token.email.toLowerCase().trim();
        const isAdminEmail = ADMIN_EMAILS.some(
          (adminEmail) => adminEmail.toLowerCase().trim() === userEmail
        );

        const dbUser = await db.user.findUnique({
          where: { email: userEmail },
          select: { id: true, role: true, isBlocked: true, blockedReason: true, image: true },
        });

        if (dbUser) {
          // If designated admin email, guarantee ADMIN role in DB and token
          if (isAdminEmail && dbUser.role !== "ADMIN") {
            await db.user.update({
              where: { email: userEmail },
              data: { role: "ADMIN" },
            });
            token.role = "ADMIN";
          } else {
            token.role = dbUser.role as "USER" | "ADMIN";
          }

          token.id = dbUser.id;
          token.isBlocked = dbUser.isBlocked;
          token.blockedReason = dbUser.blockedReason;
          token.image = dbUser.image || token.image;
        } else if (isAdminEmail) {
          token.role = "ADMIN";
        }
      }

      return token;
    },

    async session({ session, token }) {
      if (session.user) {
        session.user.id = token.id || token.sub || "";
        session.user.role = (token.role as "USER" | "ADMIN") || "USER";
        session.user.isBlocked = !!token.isBlocked;
        session.user.blockedReason = token.blockedReason || null;
        if (token.image) {
          session.user.image = token.image;
        }
      }
      return session;
    },
  },
};
