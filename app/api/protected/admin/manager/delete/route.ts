import { NextRequest, NextResponse } from 'next/server';

export async function DELETE(
  req: NextRequest,

) {
  const  id  = req.nextUrl.searchParams.get("id");

  if (!id) {
    return NextResponse.json(
      { success: false, message: 'Admin ID is required' },
      { status: 400 }
    );
  }

  try {
    const res = await fetch(`${process.env.NEXT_PUBLIC_BACKEND_URL}/admin/deleteAdmin/${id}`, {
      method: 'DELETE',
      headers: { 'Content-Type': 'application/json' },
    });

    const data = await res.json();

    return NextResponse.json({
      success: true,
      data,
      message: 'Admin deleted',
    });
  } catch (err) {
    console.error(err);
    return NextResponse.json(
      { success: false, message: 'Failed to delete admin' },
      { status: 500 }
    );
  }
}
