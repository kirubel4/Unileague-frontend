import { ApiResponse } from '@/lib/utils';
import { NextRequest, NextResponse } from 'next/server';

export async function POST(request: NextRequest) {
  try {
    const username = request.cookies.get('uName')?.value;
    const token = request.cookies.get("aToken")?.value;
    if (!username) {
      return NextResponse.json(
        { message: 'Missing username' },
        { status: 400 }
      );
    }

    const { currentPassword, newPassword } = await request.json();

    const backend = process.env.NEXT_PUBLIC_BACKEND_URL;
    if (!backend) {
      return NextResponse.json(
        { message: 'Missing NEXT_PUBLIC_BACKEND_URL' },
        { status: 500 }
      );
    }
    const res = await fetch(`${backend}/auth/changePassword`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${token}`
      },

      body: JSON.stringify({
        username: username,
        currentPassword: currentPassword,
        newPassword: newPassword,
      }),
    });

    const data = await res.json();
    return NextResponse.json(data, { status: res.status });
  } catch (error) {
    console.error('Proxy create error:', error);
    return NextResponse.json(
      { message: 'Internal Server Error', error: String(error) },
      { status: 500 }
    );
  }
}
