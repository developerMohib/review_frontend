import { NextRequest, NextResponse } from 'next/server';

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const apiUrl = process.env.API_URL ?? process.env.NEXT_PUBLIC_API_URL;

    if (!apiUrl) {
      throw new Error("API_URL or NEXT_PUBLIC_API_URL must be configured");
    }

    const response = await fetch(`${apiUrl}/auth/login`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(body),
    });
    const data = await response.json();
    if (!response.ok) {
      return NextResponse.json(data, { status: response.status });
    }

    const res = NextResponse.json({
      success: data.success,
      message: data.message,
      data: { user: data.data.user },
    });

    res.cookies.set('token', data.data.token, {
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production',
      sameSite: 'lax',
      maxAge: 60 * 60 * 24 * 7, // ৭ দিন
      path: '/',
    });

    return res;
  } catch (error) {
    console.error('Login proxy error:', error);
    return NextResponse.json({ message: 'Unable to reach the authentication service' }, { status: 502 });
  }
}