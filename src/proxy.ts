import { withAuth } from "next-auth/middleware";
import { NextResponse } from "next/server";

export default withAuth(
  function middleware(req) {
    const isApiRoute = req.nextUrl.pathname.startsWith("/api");
    const isGetMethod = req.method === "GET";

    // Allow public GET requests to API
    if (isApiRoute && isGetMethod) {
      return NextResponse.next();
    }

    // Auth logic handled by withAuth for all other matches
    return NextResponse.next();
  },
  {
    callbacks: {
      authorized: ({ token, req }) => {
        // Require token for matches
        return !!token;
      },
    },
    pages: {
      signIn: "/admin/login",
    },
  },
);

export const config = {
  // Protect all /admin routes and all non-GET /api routes (except auth)
  matcher: [
    // "/admin/:path*",
    // "/api/admin/:path*",
    "/api/hero/:path*",
    "/api/about/:path*",
    "/api/achievements/:path*",
    "/api/blogs/:path*",
    "/api/contact/:path*",
    "/api/projects/:path*",
    "/api/skill-categories/:path*",
    "/api/skills/:path*",
    "/api/testimonials/:path*",
    "/api/timeline/:path*",
  ],
};
