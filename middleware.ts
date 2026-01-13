import { getToken } from "next-auth/jwt";
import { NextRequest, NextResponse } from "next/server";

export async function middleware(req: NextRequest) {
  const { pathname } = req.nextUrl;
  const token = await getToken({ req, secret: process.env.NEXTAUTH_SECRET });

  console.log("Middleware Path:", pathname);
  console.log("Token exists:", !!token);

  const protectedRoutes = ["/workspace", "/builder", "/project", "/admin"];
  const isProtectedRoute = protectedRoutes.some((route) =>
    pathname.startsWith(route)
  );

  // If user is not logged in and tries to access a protected route
  if (isProtectedRoute && !token) {
    const url = new URL("/login", req.url);
    url.searchParams.set("callbackUrl", req.url);
    return NextResponse.redirect(url);
  }

  // Logic for logged in users
  if (token) {
    // If logged in and trying to access login page -> redirect to workspace
    if (pathname === "/login") {
      return NextResponse.redirect(new URL("/workspace", req.url));
    }

    // Protect admin routes
    if (pathname.startsWith("/admin") && (token as any).role !== "ADMIN") {
      return NextResponse.redirect(new URL("/workspace", req.url));
    }
  }

  // Redirect root to login
  if (pathname === "/") {
    return NextResponse.redirect(new URL("/login", req.url));
  }

  return NextResponse.next();
}

export const config = {
  matcher: [
    "/",
    "/workspace/:path*",
    "/builder/:path*",
    "/project/:path*",
    "/admin/:path*",
    "/login",
  ],
};
