import { NextRequest, NextResponse } from "next/server";

export async function GET(request: NextRequest) {
  const token = request.cookies.get("token")?.value;

  if (!token) {
    return NextResponse.json(
      { success: false, message: "Unauthorized" },
      { status: 401 },
    );
  }

  const apiUrl = process.env.API_URL ?? process.env.NEXT_PUBLIC_API_URL;
  if (!apiUrl) {
    console.error("API_URL or NEXT_PUBLIC_API_URL must be configured");
    return NextResponse.json(
      { success: false, message: "Authentication service is not configured" },
      { status: 500 },
    );
  }

  try {
    const response = await fetch(`${apiUrl}/auth/me`, {
      headers: { Cookie: `token=${token}` },
      cache: "no-store",
    });
    const data = await response.json();

    return NextResponse.json(data, {
      status: response.status,
      headers: { "Cache-Control": "no-store" },
    });
  } catch (error) {
    console.error("Get current user proxy error:", error);
    return NextResponse.json(
      { success: false, message: "Unable to reach the authentication service" },
      { status: 502 },
    );
  }
}
