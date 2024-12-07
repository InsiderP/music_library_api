import { NextResponse } from 'next/server';

export async function POST() {
  try {
    // Since we're using JWT, we just return success
    // Client-side should handle token removal
    return NextResponse.json(
      { message: 'Logged out successfully' },
      { status: 200 }
    );
  } catch (error) {
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}
