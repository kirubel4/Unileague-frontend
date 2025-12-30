import { ApiResponse } from '@/lib/utils';
import { NextRequest, NextResponse } from 'next/server';

export async function POST(request: NextRequest) {
  try {
    let tid;
    const cookiId = request.cookies.get('tid')?.value;
   
    if (cookiId) {
      tid = cookiId;
    }  else {
      tid = '11111111-1111-1111-1111-111111111111';
    }
    const formData = await request.formData();
    formData.append('tournamentId', tid);
    const backend = process.env.NEXT_PUBLIC_BACKEND_URL;
    if (!backend) {
      return NextResponse.json(
        { message: 'Missing NEXT_PUBLIC_BACKEND_URL' },
        { status: 500 }
      );
    }

    const res = await fetch(`${backend}/manager/team/create`, {
      method: 'POST',
      body: formData,
    });

    const data: ApiResponse = await res.json();
    console.log(data);
    return NextResponse.json(data, { status: res.status });
  } catch (error) {
    console.error('Proxy create error:', error);
    return NextResponse.json(
      { message: 'Internal Server Error', error: String(error) },
      { status: 500 }
    );
  }
}
