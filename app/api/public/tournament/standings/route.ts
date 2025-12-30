import { ApiResponse, forwardApiResponse } from "@/lib/utils";
import { NextRequest, NextResponse } from "next/server";
export async function GET(req: NextRequest, res: NextResponse) {
  try {
    let tid;
    const cookiId = req.cookies.get("tid")?.value;
    const paramId = req.nextUrl.searchParams.get("id");
    console.log(paramId);
    if (cookiId) {
      tid = cookiId;
    } else if (paramId) {
      tid = paramId;
    } else {
      tid = "fb1c80f4-7ffc-4b84-b329-d08511349fa";
    }
    const res = await fetch(
      `${process.env.NEXT_PUBLIC_BACKEND_URL}/tournaments/${tid}/standings`,
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
