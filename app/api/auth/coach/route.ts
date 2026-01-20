import { NextRequest, NextResponse } from "next/server";
import { ApiResponse } from "@/lib/utils";

export async function POST(req: NextRequest) {
  try {
    const { teamName, password } = await req.json();

    const res = await fetch(
      `${process.env.NEXT_PUBLIC_BACKEND_URL}/auth/coach/login`,
      {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ teamName, password }),
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
        maxAge: 60 * 120, // 2 hours-
      });

      if (apiResponse.data.role === "coach")
        response.cookies.set("tMid", apiResponse.data.tMid, {
          httpOnly: true,
          secure: process.env.NODE_ENV === "production",
          sameSite: process.env.NODE_ENV === "production" ? "none" : "lax",
          path: "/",
          maxAge: 60 * 120, // 2 hours
        });
      response.cookies.set("mid", apiResponse.data.id, { path: "/" });
      response.cookies.set("TeamName", apiResponse.data.TeamName, { path: "/" });
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
