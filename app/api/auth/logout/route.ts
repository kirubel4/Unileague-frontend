import { NextResponse } from "next/server";

export async function POST() {
  try {
    const response = NextResponse.json({
      success: true,
      message: "Logged out successfully",
    });

    const cookieOptions = {
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      sameSite: (process.env.NODE_ENV === "production" ? "none" : "lax") as
        | "none"
        | "lax",
      path: "/",
      maxAge: 0, // 🔑 correct way to delete
    };

    // httpOnly cookies
    response.cookies.set("aToken", "", cookieOptions);
    response.cookies.set("rToken", "", cookieOptions);
    response.cookies.set("tid", "", cookieOptions);

    // non-httpOnly cookies
    response.cookies.set("mid", "", { path: "/", maxAge: 0 });
    response.cookies.set("uName", "", { path: "/", maxAge: 0 });
    response.cookies.set("role", "", { path: "/", maxAge: 0 });

    return response;
  } catch (error) {
    console.error("Logout error:", error);
    return NextResponse.json(
      { success: false, message: "Internal Server Error" },
      { status: 500 }
    );
  }
}
