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
    const token = request.cookies.get("token")?.value;
    const response = await fetch(`${apiUrl}/auth/logout`, {
      method: "POST",
      headers: token ? { Cookie: `token=${token}` } : undefined,
      cache: "no-store",
    });
    const data = await response.json();
    const res = NextResponse.json(data, { status: response.status });

    if (response.ok) {
      res.cookies.delete("token");
    }

    return res;
  } catch (error) {
    console.error("Logout proxy error:", error);
    return NextResponse.json(
      { success: false, message: "Unable to reach the authentication service" },
      { status: 502 },
    );
  }
}
