import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';

// ⚠️ Next.js 16-তে proxy ফাংশনকে 'default' export করতে হয়
export default function proxy(request: NextRequest) {
  const token = request.cookies.get('token')?.value;
  if (!token) {
    return NextResponse.redirect(new URL('/login', request.url));
  }
  return NextResponse.next();
}

export const config = {
  matcher: ['/dashboard/:path*'],
};