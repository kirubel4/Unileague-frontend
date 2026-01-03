import { ApiResponse } from "@/lib/utils";
import { NextRequest, NextResponse } from "next/server";

export async function GET(req: NextRequest) {
  let tid;
  const cookiId = req.cookies.get("tid")?.value;
  const paramId = req.nextUrl.searchParams.get("id");

  if (paramId) {
    tid = paramId;
  } else if (cookiId) {
    tid = cookiId;
  }
  if (!tid) {
    return NextResponse.json(
      { success: false, message: "Tournament ID is required" },
      { status: 400 }
    );
  }

  try {
    const res = await fetch(
      `${process.env.NEXT_PUBLIC_BACKEND_URL}/tournaments/${tid}`,
      {
        method: "GET",
        headers: { "Content-Type": "application/json" },
      }
    );

    const data: ApiResponse = await res.json();
    return NextResponse.json(data);
  } catch (err) {
    console.error(err);
    return NextResponse.json(
      { success: false, message: "Failed to get tournament status" },
      { status: 500 }
    );
  }
}
