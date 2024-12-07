import { NextResponse } from 'next/server';
import { verifyToken } from './lib/auth';

export async function middleware(request) {
  // Exclude auth routes from middleware
  if (request.nextUrl.pathname.startsWith('/api/v1/auth')) {
    return NextResponse.next();
  }

  const token = request.headers.get('authorization')?.split(' ')[1];

  if (!token) {
    return NextResponse.json(
      { error: 'Authentication required' },
      { status: 401 }
    );
  }

  try {
    const decoded = await verifyToken(token);
    request.user = decoded;
    return NextResponse.next();
  } catch (error) {
    return NextResponse.json(
      { error: 'Invalid token' },
      { status: 401 }
    );
  }
}

export const config = {
  matcher: '/api/v1/:path*',
};
