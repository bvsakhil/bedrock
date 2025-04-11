// app/api/subscribe/route.ts
import { NextRequest, NextResponse } from 'next/server';

const CMS_API_URL = process.env.NEXT_PUBLIC_CMS_API_URL || 'http://localhost:3001';

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();

    const cmsRes = await fetch(`${CMS_API_URL}/api/subscribers/subscribe`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(body),
    });

    const data = await cmsRes.json();

    if (!cmsRes.ok) {
      return NextResponse.json({ message: data.message || 'Subscription failed.' }, {
        status: cmsRes.status,
      });
    }

    return NextResponse.json(data);
  } catch (error: any) {
    console.error('Proxy error:', error);
    return NextResponse.json({ message: 'Internal server error' }, { status: 500 });
  }
}
