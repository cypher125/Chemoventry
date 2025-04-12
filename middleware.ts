import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';

const API_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:8000';

export function middleware(request: NextRequest) {
  const url = request.nextUrl;
  const { pathname } = url;
  
  // Authentication handling
  const isAuthPage = pathname === '/login';
  const token = request.cookies.get('token')?.value;
  
  // Forward API requests to the Django backend
  if (pathname.startsWith('/api/')) {
    const apiUrl = new URL(pathname + url.search, API_URL);
    return NextResponse.rewrite(apiUrl);
  }
  
  // Handle report generation requests and forward them to our backend
  if (pathname.startsWith('/report/')) {
    const reportType = pathname.split('/')[2]; // Extract report type from URL
    const apiUrl = new URL(`/api/report/${reportType}${url.search}`, API_URL);
    console.log('Proxying report request to:', apiUrl.toString());
    
    return NextResponse.rewrite(apiUrl);
  }
  
  // If trying to access auth page while logged in, redirect to dashboard
  if (isAuthPage && token) {
    return NextResponse.redirect(new URL('/chemoventry', request.url));
  }

  // If trying to access protected page while not logged in, redirect to login
  if (!isAuthPage && !token && !pathname.startsWith('/_next') && !pathname.startsWith('/api/')) {
    return NextResponse.redirect(new URL('/login', request.url));
  }
  
  return NextResponse.next();
}

// Only run middleware on auth-related and API routes and our new report path
export const config = {
  matcher: [
    '/api/:path*', 
    '/report/:path*', 
    '/((?!_next/static|_next/image|favicon.ico|public).*)' // For auth checks
  ],
};
