import { ApiResponse } from "@/lib/utils";
import { NextRequest, NextResponse } from "next/server";

export async function POST(request: NextRequest) {
  try {
    const mid = request.cookies.get("mid")?.value;
    const tid = request.cookies.get("tid")?.value;
    if (!mid || !tid) {
      return NextResponse.json(
        { message: "Missing parameters" },
        { status: 500 }
      );
    }
    const token = request.cookies.get("aToken")?.value;

    const formData = await request.formData();
    formData.append("tournamentId", tid);
    formData.append("managerId", mid);

    const backend = process.env.NEXT_PUBLIC_BACKEND_URL;
    if (!backend) {
      return NextResponse.json(
        { message: "Missing NEXT_PUBLIC_BACKEND_URL" },
        { status: 500 }
      );
    }

    const res = await fetch(`${backend}/manager/news/create`, {
      method: "POST",
      body: formData,
      headers: { Authorization: `Bearer ${token}` },
    });
    console.log(res);
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
