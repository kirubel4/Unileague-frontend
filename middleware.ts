import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";

export function middleware(req: NextRequest) {
  const token = req.cookies.get("aToken")?.value;
  const role = req.cookies.get("role")?.value;
  const url = req.nextUrl.clone();
  if (url.pathname.startsWith("/admin")) {
    if (!token) {
      console.log("No token found, redirecting to login");
      url.pathname = "/auth/";
      return NextResponse.redirect(url);
    }
    if (role !== "superAdmin") {
      url.pathname = "/unauthorized";
      return NextResponse.redirect(url);
    }
    // Not admin → redirect to unauthorized page
  }
  if (url.pathname.startsWith("/manager")) {
    if (!token) {
      console.log("No token found, redirecting to login");
      // Not logged in → redirect to login
      url.pathname = "/auth/";
      return NextResponse.redirect(url);
    }
    if (role !== "tournamentManager") {
      url.pathname = "/unauthorized";
      return NextResponse.redirect(url);
    }
  }
  if (url.pathname.startsWith("/tournaments/register/player")) {
    if (!token) {
      url.pathname = "/tournaments";
      return NextResponse.redirect(url);
    }
  }
  if (url.pathname.startsWith("/coach")) {
    if (!token || role !== "coach") {
      console.log("No token found, redirecting to login");
      url.pathname = "/auth";
      return NextResponse.redirect(url);
    }
  }
  return NextResponse.next();
}

export const config = {
  matcher: [
    "/admin/:path*",
    "/manager/:path*",
    "/coach/:path*",
    "/tournaments/register/player/:path*",
  ],
};
