import { ApiResponse, forwardApiResponse } from "@/lib/utils";
import { NextRequest, NextResponse } from "next/server";
export async function GET(req: NextRequest, res: NextResponse) {
  try {
    //tournament id should be from the session
    const id = "fb1c80f4-7ffc-4b84-b329-d08511349fa2";
    const res = await fetch(
      `${process.env.NEXT_PUBLIC_BACKEND_URL}/tournaments/${id}/players`,
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
