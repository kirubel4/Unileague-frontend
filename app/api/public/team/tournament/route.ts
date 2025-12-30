import { ApiResponse, forwardApiResponse } from "@/lib/utils";
import { NextRequest, NextResponse } from "next/server";
export async function GET(req: NextRequest, res: NextResponse) {
  try {
    // fr manager we get the id form the session fro public we accept id from the params
    let tid;
    const cookiId = req .cookies.get('tid')?.value;
    const paramId = req.nextUrl.searchParams.get('tid');
    console.log(paramId)
    if (cookiId) {
      tid = cookiId;
    } else if (paramId) {
      tid = paramId;
    } else {
      tid = '11111111-1111-1111-1111-111111111111';
    }

    
    const res = await fetch(
      `${process.env.NEXT_PUBLIC_BACKEND_URL}/tournaments/${tid}/teams`,
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
