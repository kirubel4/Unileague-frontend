import { NextResponse } from 'next/server';

export async function POST(req: Request) {
  try {
    const body = await req.json();
    console.log(body)
    const backendRes = await fetch(
    
      'http://localhost:4000/api/v1/admin/tournament/create',
      {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(body),
      }
    );

    const data = await backendRes.json();
    return NextResponse.json(data, { status: backendRes.status });
  } catch (error) {
    console.error('Error in Next.js route:', error);
    return NextResponse.json(
      { ok: false, error: 'Internal API error' },
      { status: 500 }
    );
  }
}
