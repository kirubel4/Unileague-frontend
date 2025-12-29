import { ApiResponse } from "@/lib/utils";
import { NextRequest, NextResponse } from "next/server";

export async function POST(request: NextRequest) {
  try {
    let tid;
    const cookieId = request.cookies.get("tid")?.value;
    const paramId = request.nextUrl.searchParams.get("id");
    if (cookieId) {
      tid = cookieId;
    } else if (paramId) {
      tid = paramId;
    } else {
      tid = "fb1c80f4-7ffc-4b84-b329-d08511349fa2";
    }

    const body = await request.json();
    if (Array.isArray(body)) {
      // Iterate over each item in the array and add tournamentId
      body.forEach((item) => {
        item.tournamentId = tid;
      });
    } else {
      // If body is not an array, you might want to handle it differently
      // For example, if it's a single object, just add tournamentId directly
      body.tournamentId = tid;
    }

    const backend = process.env.NEXT_PUBLIC_BACKEND_URL;
    if (!backend) {
      return NextResponse.json(
        { message: "Missing NEXT_PUBLIC_BACKEND_URL" },
        { status: 500 }
      );
    }

    const res = await fetch(`${backend}/manager/match/create`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(body),
    });

    const data: ApiResponse = await res.json();
    console.log(data);
    return NextResponse.json(data, { status: res.status });
  } catch (error) {
    console.error("Proxy create error:", error);
    return NextResponse.json(
      { message: "Internal Server Error", error: String(error) },
      { status: 500 }
    );
  }
}
