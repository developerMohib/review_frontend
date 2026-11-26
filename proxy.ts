import { NextResponse } from "next/server";
import { NextRequest } from "next/server";
import { getCurrentUser } from "./lib/apiServices/authService";
const authRoutes = ["/login", "/register"];
type Role = keyof typeof roleBasedRoutes;
const roleBasedRoutes = {
  mentor: [/^\/dashboard/],
  admin: [/^\/dashboard/],
  student: [/^\/dashboard/],
};
export default async function proxy(request: NextRequest) {
  const { pathname } = request.nextUrl;
  const userInfo = await getCurrentUser();
  if (!userInfo) {
    if (authRoutes.includes(pathname)) {
      return NextResponse.next();
    } else {
      return NextResponse.redirect(
        new URL(
          `${request.nextUrl.origin}/login?callbackUrl=${encodeURIComponent(pathname)}`,
          request.url,
        ),
      );
    }
  }
  if (userInfo?.role && roleBasedRoutes[userInfo?.role as Role]) {
    const routes = roleBasedRoutes[userInfo?.role as Role];
    if (routes.some((route) => pathname.match(route))) {
      return NextResponse.next();
    }
  }
  return NextResponse.redirect(new URL("/", request.url));
}

export const config = {
  matcher: ["/dashboard/:path*"],
};
