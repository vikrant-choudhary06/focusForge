import { withAuth } from "next-auth/middleware";
import { NextResponse } from "next/server";

export default withAuth(
  function middleware(req) {
    const token = req.nextauth.token;
    const isBlocked = !!token?.isBlocked;
    const isAdmin = token?.role === "ADMIN";
    const pathname = req.nextUrl.pathname;

    // 1. If user is suspended/blocked, redirect to /blocked
    if (isBlocked && pathname !== "/blocked") {
      return NextResponse.redirect(new URL("/blocked", req.url));
    }

    // 2. Guard /admin routes: allow access ONLY if role === 'ADMIN'
    if (pathname.startsWith("/admin") && !isAdmin) {
      return NextResponse.redirect(new URL("/dashboard", req.url));
    }

    return NextResponse.next();
  },
  {
    callbacks: {
      authorized: ({ token, req }) => {
        const pathname = req.nextUrl.pathname;
        // Require authentication for /dashboard and /admin routes
        if (pathname.startsWith("/dashboard") || pathname.startsWith("/admin")) {
          return !!token;
        }
        return true;
      },
    },
    pages: {
      signIn: "/login",
    },
  }
);

export const config = {
  matcher: ["/dashboard/:path*", "/admin/:path*"],
};
