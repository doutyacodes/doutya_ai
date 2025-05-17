import { NextResponse } from 'next/server';
import { jwtVerify } from 'jose';

export async function middleware(req) {
  const res = NextResponse.next({
    headers: {
      'Cache-Control': 'no-store',
    },
  });

  const path = req.nextUrl.pathname;

  // ✅ Allow public access to:
  if (
    path === '/' ||
    // path === '/about' ||
    // path === '/contact' ||
    path === '/newstech' ||
    path === '/newstech/login'
  ) {
    return res;
  }

  // 🔐 Protect all other /newstech/* routes
  if (path.startsWith('/newstech')) {
    const token = req.cookies.get('auth_token')?.value;

    if (!token) {
      console.log("No token for protected newstech path, redirecting...");
      return NextResponse.redirect(new URL('/newstech/login', req.url));
    }

    try {
      const secret = new TextEncoder().encode(process.env.JWT_SECRET);
      const { payload } = await jwtVerify(token, secret);

      // Optional: Add role-based protection here if needed
      return res;
    } catch (error) {
      console.log("JWT verification failed:", error);
      return NextResponse.redirect(new URL('/newstech/login', req.url));
    }
  }

  // ✅ For all other routes outside /newstech (e.g. user pages), allow access
  return res;
}

export const config = {
  matcher: [
    '/((?!api|_next/static|_next/image|favicon.ico).*)',
  ],
};
