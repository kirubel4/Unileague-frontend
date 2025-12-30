import { ApiResponse } from "@/lib/utils";
import { NextRequest, NextResponse } from "next/server";

export async function POST(request: NextRequest) {
  try {
    const mid = request.cookies.get("mid")?.value;
    if (!mid) {
      return NextResponse.json({ message: "Missing id" }, { status: 400 });
    }
    const body = await request.json();
    const backend = process.env.NEXT_PUBLIC_BACKEND_URL;
    if (!backend) {
      return NextResponse.json(
        { message: "Missing NEXT_PUBLIC_BACKEND_URL" },
        { status: 500 }
      );
    }
    const res = await fetch(`${backend}/auth/user/update`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        id: mid,
        data: body, // ✅ MATCHES backend
      }),
    });

    const data: ApiResponse = await res.json();
    if (data.success) {
    }
    return NextResponse.json(data, { status: res.status });
  } catch (error) {
    console.error("Proxy create error:", error);
    return NextResponse.json(
      { message: "Internal Server Error", error: String(error) },
      { status: 500 }
    );
  }
}
