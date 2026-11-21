import { NextResponse } from "next/server";
import { NextRequest } from "next/server";
import { getCurrentUser } from "./lib/apiServices/authService";
const authRoutes = ["/login", "/register"];
type Role = keyof typeof roleBasedRoutes;
const roleBasedRoutes = {
  mentor: [/^\/dashboard\/mentor/],
  admin: [/^\/dashboard\/admin/],
  user: [/^\/dashboard\/user/],
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
          `${request.nextUrl.origin}/login?redirect=${encodeURIComponent(pathname)}`,
          request.url,
        ),
      );
    }
  }
  //  else {
  //   return NextResponse.redirect(new URL(`${request.nextUrl.origin}/dashboard`, request.url));
  // }
  if (userInfo?.role && roleBasedRoutes[userInfo?.role as Role]) {
    const routes = roleBasedRoutes[userInfo?.role as Role];
    if(routes.some(route=>pathname.match(route))){
      return NextResponse.next()
    }
  }
}

export const config = {
  matcher: ["/dashboard/:path*"],
};
