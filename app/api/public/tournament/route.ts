// app/api/public/tournament/route.ts
import { NextRequest, NextResponse } from "next/server";

export async function GET(req: NextRequest) {
  try {
    // Example: fetch from your real backend
    const response = await fetch(`${process.env.NEXT_PUBLIC_BACKEND_URL}/tournaments`);
    const data = await response.json();

    return NextResponse.json(data, { status: 200 });
  } catch (error) {
    console.error(error);
    return NextResponse.json({ success: false, message: "Internal Server Error" }, { status: 500 });
  }
}
