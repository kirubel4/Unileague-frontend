import { ApiResponse } from "@/lib/utils";
import { NextRequest, NextResponse } from "next/server";

export async function POST(request: NextRequest) {
  try {
    // manager id and tournament id form the cookie now we are doing it hardcoded till auth is implemented
    const token = request.cookies.get("aToken")?.value;

    const mid = request.cookies.get("mid")?.value;
    const tid = request.cookies.get("tid")?.value;
    if (!mid || !tid) {
      return NextResponse.json(
        { message: "Missing parameters" },
        { status: 500 }
      );
    }

    const body = await request.json();
    const val = {
      ...body,
      tournamentId: tid,
      managerId: mid,
    };

    const backend = process.env.NEXT_PUBLIC_BACKEND_URL;
    if (!backend) {
      return NextResponse.json(
        { message: "Missing NEXT_PUBLIC_BACKEND_URL" },
        { status: 500 }
      );
    }

    const res = await fetch(`${backend}/manager/player/transfer`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`,
      },
      body: JSON.stringify(val),
    });

    const data: ApiResponse = await res.json();
    console.log("Proxy response data:", data.message);
    return NextResponse.json(data, { status: res.status });
  } catch (error) {
    console.error("Proxy create error:", error);
    return NextResponse.json(
      { message: "Internal Server Error", error: String(error) },
      { status: 500 }
    );
  }
}
