import { NextRequest, NextResponse } from "next/server";

export async function POST(req: NextRequest) {
  try {
    const response = NextResponse.json({ message: "Logout successfully" });

    // Clear cookies properly
    response.cookies.set("token", "", { maxAge: -1, path: "/" });
    response.cookies.set("id", "", { maxAge: -1, path: "/" });
    response.cookies.set("role", "", { maxAge: -1, path: "/" });

    return response; // ✅ Return this directly
  } catch (error) {
    console.error(error);
    return NextResponse.json(
      { message: "Internal Server Error" },
      { status: 500 }
    );
  }
}
