import { NextResponse } from 'next/server';

export function middleware(request) {
  // Check if the request is for an admin route
  if (request.nextUrl.pathname.startsWith('/admin') || request.nextUrl.pathname.startsWith('/api/admin')) {
    const authHeader = request.headers.get('authorization');

    // Get credentials from environment variables
    const validUsername = process.env.ADMIN_USERNAME;
    const validPassword = process.env.ADMIN_PASSWORD;

    if (!authHeader || !authHeader.startsWith('Basic ')) {
      return new NextResponse(null, {
        status: 401,
        headers: {
          'WWW-Authenticate': 'Basic realm="Admin Access Required"'
        }
      });
    }

    try {
      // Extract and verify credentials
      const base64Credentials = authHeader.split(' ')[1];
      const credentials = Buffer.from(base64Credentials, 'base64').toString('ascii');
      const [username, password] = credentials.split(':');

      if (username !== validUsername || password !== validPassword) {
        return new NextResponse(null, {
          status: 401,
          headers: {
            'WWW-Authenticate': 'Basic realm="Admin Access Required"'
          }
        });
      }

      // If authentication successful, allow the request to proceed
      return NextResponse.next();
    } catch (error) {
      console.error('Authentication error:', error);
      return new NextResponse(null, { status: 401 });
    }
  }

  // For non-admin routes, allow the request to proceed
  return NextResponse.next();
}

export const config = {
  matcher: [
    '/admin/:path*',
    '/api/admin/:path*'
  ]
};