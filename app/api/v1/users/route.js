import { NextResponse } from 'next/server';
import connectDB from '@/lib/db';
import User from '@/lib/models/User';
import { checkPermissions } from '@/lib/auth';
import { formatResponse } from '@/lib/utils';

export async function GET(request) {
  try {
    await connectDB();
    
    const user = request.user;
    if (!checkPermissions(user.role, 'Admin')) {
      return NextResponse.json(
        { error: 'Unauthorized' },
        { status: 401 }
      );
    }

    const users = await User.find({}, '-password');
    return NextResponse.json(formatResponse(users));
  } catch (error) {
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
} 