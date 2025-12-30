import { NextRequest, NextResponse } from 'next/server';

export async function GET(
  req: NextRequest,

) {
  const  id  = req.nextUrl.searchParams.get("id");

  if (!id) {
    return NextResponse.json(
      { success: false, message: 'Tournament ID is required' },
      { status: 400 }
    );
  }

  try {
    const res = await fetch(`${process.env.NEXT_PUBLIC_BACKEND_URL}/tournaments/${id}`, {
      method: 'GET',
      headers: { 'Content-Type': 'application/json' },
    });

    const data = await res.json();

    return NextResponse.json({
      success: true,
      data,
      message: 'tournament gets',
    });
  } catch (err) {
    console.error(err);
    return NextResponse.json(
      { success: false, message: 'Failed to get tournament status' },
      { status: 500 }
    );
  }
}
