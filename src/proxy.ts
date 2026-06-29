import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";
import { getToken } from "next-auth/jwt";

const secret = process.env.NEXTAUTH_SECRET;

async function middleware(req: NextRequest) {
  const token = await getToken({ req, secret });
  
  const isApiRoute = req.nextUrl.pathname.startsWith("/api");
  const isAdminRoute = req.nextUrl.pathname.startsWith("/admin");
  const isLoginRoute = req.nextUrl.pathname === "/admin/login";
  
  if (isLoginRoute) {
    return NextResponse.next();
  }
  
  if (isAdminRoute && !token) {
    return NextResponse.redirect(new URL("/admin/login", req.url));
  }
  
  const isAuthRoute = req.nextUrl.pathname.startsWith("/api/auth");
  if (isAuthRoute) {
    return NextResponse.next();
  }
  
  const isLoginApiRoute = req.nextUrl.pathname.includes("/api/auth");
  if (isLoginApiRoute) {
    return NextResponse.next();
  }
  
  const protectedApiPaths = [
    "/api/hero/", "/api/about/", "/api/achievements/",
    "/api/blogs/", "/api/contact/", "/api/projects/",
    "/api/skills/", "/api/testimonials/", "/api/timeline/",
    "/api/skill-categories/"
  ];
  
  const isProtectedApi = protectedApiPaths.some(path => 
    req.nextUrl.pathname.startsWith(path)
  );
  
  if (isProtectedApi && !token) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }
  
  return NextResponse.next();
}

export default middleware;

export const config = {
  matcher: [
    "/admin/:path*",
    "/api/hero/:path*",
    "/api/about/:path*",
    "/api/achievements/:path*",
    "/api/blogs/:path*",
    "/api/contact/:path*",
    "/api/projects/:path*",
    "/api/skills/:path*",
    "/api/testimonials/:path*",
    "/api/timeline/:path*",
    "/api/skill-categories/:path*",
  ],
};
