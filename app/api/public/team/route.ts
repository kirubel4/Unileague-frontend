import { ApiResponse, forwardApiResponse } from "@/lib/utils";
import { NextRequest, NextResponse } from "next/server";
export async function GET(req: NextRequest) {
  try {
    console.log("hii");
    const res = await fetch(`${process.env.NEXT_PUBLIC_BACKEND_URL}/teams`, {
      method: "GET",
      headers: {
        "Content-Type": "application/json",
      },
    });
    const data: ApiResponse = await res.json();
    console.log(data);
    return NextResponse.json(data);
  } catch (error) {
    return NextResponse.json("Internal Server Error", { status: 500 });
  }
}
