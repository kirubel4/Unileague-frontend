import { ApiResponse, forwardApiResponse } from "@/lib/utils";
import { NextRequest, NextResponse } from "next/server";
export async function GET(req: NextRequest) {
  try {
    const tid = req.cookies.get("tMid")?.value;
    if (!tid) {
      return NextResponse.json("Team Id is required", { status: 400 });
    }
    const res = await fetch(
      `${process.env.NEXT_PUBLIC_BACKEND_URL}/coach/match/line-up/history/${tid}`,
      {
        method: "GET",
        headers: {
          "Content-Type": "application/json",
        },
      },
    );
    const data: ApiResponse = await res.json();

    return NextResponse.json(data);
  } catch (error) {
    return NextResponse.json("Internal Server Error", { status: 500 });
  }
}
