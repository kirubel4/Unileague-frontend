import { ApiResponse, forwardApiResponse } from "@/lib/utils";
import { NextRequest, NextResponse } from "next/server";
export async function GET(req: NextRequest, res: NextResponse) {
  try {
    const mid = req.cookies.get("mid")?.value;
    if (!mid) {
      return NextResponse.json("re-login bro", { status: 403 });
    }
    const res = await fetch(
      `${process.env.NEXT_PUBLIC_BACKEND_URL}/auth/user/me/${mid}`,
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
