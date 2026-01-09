import { NextRequest, NextResponse } from "next/server";
import { ApiResponse } from "@/lib/utils";

export async function POST(req: NextRequest) {
  try {
    const { key } = await req.json();

    const res = await fetch(
      `${process.env.NEXT_PUBLIC_BACKEND_URL}/auth/player`,
      {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ key }),
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
        maxAge: 10 * 120,
      });
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
