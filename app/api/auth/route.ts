import { NextRequest, NextResponse } from "next/server";
import { ApiResponse } from "@/lib/utils";

export async function POST(req: NextRequest) {
  try {
    const { username, password } = await req.json();

    const res = await fetch(
      `${process.env.NEXT_PUBLIC_BACKEND_URL}/auth/login`,
      {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ username, password }),
      }
    );

    const apiResponse: ApiResponse = await res.json();

    if (apiResponse.success && apiResponse.data) {
      const response = NextResponse.json(apiResponse);
      response.cookies.set("aToken", apiResponse.data.aToken, {
        httpOnly: true,
        secure: process.env.NODE_ENV === "production",
        sameSite: process.env.NODE_ENV === "production" ? "none" : "lax",
        path: "/",
        maxAge: 60 * 120, // 2 hours
      });
      response.cookies.set("rToken", apiResponse.data.rToken, {
        httpOnly: true,
        secure: process.env.NODE_ENV === "production",
        sameSite: process.env.NODE_ENV === "production" ? "none" : "lax",
        path: "/",
        maxAge: 60 * 120, // 2 hours
      });
      if (apiResponse.data.role === "tournamentManager")
        response.cookies.set("tid", apiResponse.data.tid, {
          httpOnly: true,
          secure: process.env.NODE_ENV === "production",
          sameSite: process.env.NODE_ENV === "production" ? "none" : "lax",
          path: "/",
          maxAge: 60 * 120, // 2 hours
        });
      response.cookies.set("mid", apiResponse.data.id, { path: "/" });
      response.cookies.set("uName", apiResponse.data.uName, { path: "/" });
      response.cookies.set("role", apiResponse.data.role, { path: "/" });
      return response;
    }

    return NextResponse.json(apiResponse, { status: res.status });
  } catch (error: any) {
    return NextResponse.json(
      { message: "Connect to internet" },
      { status: 500 }
    );
  }
}
