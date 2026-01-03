import { ApiResponse, forwardApiResponse } from "@/lib/utils";
import { NextRequest, NextResponse } from "next/server";
export async function GET(req: NextRequest) {
  try {
    let tid;
    const token = req.cookies.get("aToken")?.value;
    const cookieId = req.cookies.get("tid")?.value;
    const paramId = req.nextUrl.searchParams.get("id");
    if (cookieId) {
      tid = cookieId;
    } else if (paramId) {
      tid = paramId;
    } else {
      tid = "fb1c80f4-7ffc-4b84-b329-d08511349fa2";
    }

    const res = await fetch(
      `${process.env.NEXT_PUBLIC_BACKEND_URL}/manager/gallery/${tid}/tournament`,
      {
        method: "GET",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
      }
    );

    const data: ApiResponse = await res.json();

    return NextResponse.json(data);
  } catch (error) {
    return NextResponse.json("Internal Server Error", { status: 500 });
  }
}
