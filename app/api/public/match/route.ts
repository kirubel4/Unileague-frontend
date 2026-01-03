import { ApiResponse, forwardApiResponse } from "@/lib/utils";
import { NextRequest, NextResponse } from "next/server";
export async function GET(req: NextRequest) {
  try {
    let tid;
    const cookiId = req.cookies.get("tid")?.value;
    const paramId = req.nextUrl.searchParams.get("id");

    if (paramId) {
      tid = paramId;
    } else if (cookiId) {
      tid = cookiId;
    }
    console.log(tid);
    const res = await fetch(
      `${process.env.NEXT_PUBLIC_BACKEND_URL}/matches/all/${tid}`,
      {
        method: "GET",
        headers: {
          "Content-Type": "application/json",
        },
      }
    );
    const data: ApiResponse = await res.json();

    return NextResponse.json(data);
  } catch (error) {
    return NextResponse.json("Internal Server Error", { status: 500 });
  }
}
