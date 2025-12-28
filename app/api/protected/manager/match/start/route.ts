import { ApiResponse } from "@/lib/utils";
import { NextRequest, NextResponse } from "next/server";

export async function PUT(request: NextRequest) {
  try {
    const matchId = request.nextUrl.searchParams.get("id");

    if (!matchId) {
      return NextResponse.json(
        { message: "matchId is required" },
        { status: 400 }
      );
    }
    const backend = process.env.NEXT_PUBLIC_BACKEND_URL;
    if (!backend) {
      return NextResponse.json(
        { message: "Missing NEXT_PUBLIC_BACKEND_URL" },
        { status: 500 }
      );
    }

    const res = await fetch(`${backend}/manager/match/${matchId}/start`, {
      method: "PUT",
      headers: { "Content-Type": "application/json" },
    });

    const data: ApiResponse = await res.json();

    return NextResponse.json(data, { status: res.status });
  } catch (error) {
    console.error("Proxy create error:", error);
    return NextResponse.json(
      { message: "Internal Server Error", error: String(error) },
      { status: 500 }
    );
  }
}
