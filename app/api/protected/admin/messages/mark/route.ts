import { ApiResponse } from "@/lib/utils";
import { NextRequest, NextResponse } from "next/server";

export async function POST(request: NextRequest) {
  try {
    const id = request.nextUrl.searchParams.get("id");
    const token = request.cookies.get("aToken")?.value;

    const backend = process.env.NEXT_PUBLIC_BACKEND_URL;
    if (!backend) {
      return NextResponse.json(
        { message: "Missing NEXT_PUBLIC_BACKEND_URL" },
        { status: 500 }
      );
    }
    const res = await fetch(`${backend}/admin/message/mark/read/${id}`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`,
      },
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
