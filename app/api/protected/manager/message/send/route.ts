import { ApiResponse } from "@/lib/utils";
import { NextRequest, NextResponse } from "next/server";

export async function POST(request: NextRequest) {
  try {
    const cookieMid = request.cookies.get("mid")?.value;

    if (!cookieMid) {
      return NextResponse.json(
        { message: "Missing parameters please Re-login" },
        { status: 400 }
      );
    }
    let body: any = {};
    try {
      body = await request.json();
    } catch (err) {
      return NextResponse.json(
        { message: "Invalid request body" },
        { status: 400 }
      );
    }
    body.senderId = cookieMid;
    const backend = process.env.NEXT_PUBLIC_BACKEND_URL;
    if (!backend) {
      return NextResponse.json(
        { message: "Missing NEXT_PUBLIC_BACKEND_URL" },
        { status: 500 }
      );
    }
    const res = await fetch(`${backend}/manager/message/send`, {
      method: "POST",
      headers: { "Content-Type": "application/json" }, // important!
      body: JSON.stringify(body),
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
