import { NextRequest, NextResponse } from "next/server";

export async function POST(request: NextRequest) {
  const apiUrl = process.env.API_URL ?? process.env.NEXT_PUBLIC_API_URL;
  if (!apiUrl) {
    console.error("API_URL or NEXT_PUBLIC_API_URL must be configured");
    return NextResponse.json(
      { success: false, message: "Authentication service is not configured" },
      { status: 500 },
    );
  }

  try {
    const body = await request.json();
    const response = await fetch(`${apiUrl}/auth/register`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(body),
    });
    const result = await response.json();

    return NextResponse.json(result, { status: response.status });
  } catch (error) {
    console.error("Registration proxy error:", error);
    return NextResponse.json(
      { success: false, message: "Unable to reach the authentication service" },
      { status: 502 },
    );
  }
}
