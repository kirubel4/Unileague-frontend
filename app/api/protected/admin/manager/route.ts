import { NextResponse } from "next/server";
export async function GET(req: NextResponse) {
  try {
    const token = req.cookies.get("aToken")?.value;

    const result = await fetch(
      `${process.env.NEXT_PUBLIC_BACKEND_URL}/admin/managers`,
      {
        method: "GET",
        headers: {
          Authorization: `Bearer ${token}`,
        },
      }
    );
    const data = await result.json();

    return NextResponse.json({
      ok: true,
      data: data.data,
    });
  } catch (error) {
    return NextResponse.json(
      { ok: false, error: "backend error" },
      { status: 500 }
    );
  }
}
