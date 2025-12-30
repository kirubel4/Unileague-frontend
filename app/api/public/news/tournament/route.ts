import { ApiResponse, forwardApiResponse } from "@/lib/utils";
import { NextRequest, NextResponse } from "next/server";
export async function GET(req: NextRequest, res: NextResponse) {
  try {
    // fr manager we get the id form the session fro public we accept id from the params

    //this mock id
     
    const tid = req.cookies.get('tid')?.value;
    if (!tid) {
      return NextResponse.json(
        { message: 'Missing parameters' },
        { status: 500 }
      );
    }
    const res = await fetch(
      `${process.env.NEXT_PUBLIC_BACKEND_URL}/notification/${tid}/tournament`,
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
