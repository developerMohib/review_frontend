import { NextRequest, NextResponse } from "next/server";

type RouteContext = {
  params: Promise<{ path?: string[] }>;
};

async function proxySubmissionRequest(
  request: NextRequest,
  { params }: RouteContext,
) {
  const apiUrl = process.env.API_URL ?? process.env.NEXT_PUBLIC_API_URL;
  if (!apiUrl) {
    console.error("API_URL or NEXT_PUBLIC_API_URL must be configured");
    return NextResponse.json(
      { success: false, message: "Submission service is not configured" },
      { status: 500 },
    );
  }

  const token = request.cookies.get("token")?.value;
  if (!token) {
    const response = NextResponse.json(
      { success: false, message: "Unauthorized" },
      { status: 401 },
    );
    response.cookies.delete("token");
    return response;
  }

  try {
    const { path = [] } = await params;
    const resourcePath = path.map(encodeURIComponent).join("/");
    const submissionPath = resourcePath ? `/submissions/${resourcePath}` : "/submissions";
    const targetUrl = `${apiUrl.replace(/\/$/, "")}${submissionPath}${request.nextUrl.search}`;
    const headers: Record<string, string> = {
      Cookie: `token=${token}`,
    };

    const contentType = request.headers.get("content-type");
    if (contentType) {
      headers["Content-Type"] = contentType;
    }

    const method = request.method;
    const response = await fetch(targetUrl, {
      method,
      headers,
      body: method === "GET" ? undefined : await request.text(),
      cache: "no-store",
    });

    const proxyResponse = new NextResponse(response.body, {
      status: response.status,
      headers: {
        "Content-Type":
          response.headers.get("content-type") ?? "application/json",
        "Cache-Control": "no-store",
      },
    });
    if (response.status === 401) {
      proxyResponse.cookies.delete("token");
    }

    return proxyResponse;
  } catch (error) {
    console.error("Submission proxy error:", error);
    return NextResponse.json(
      { success: false, message: "Unable to reach the submission service" },
      { status: 502 },
    );
  }
}

export const GET = proxySubmissionRequest;
export const POST = proxySubmissionRequest;
export const PATCH = proxySubmissionRequest;
