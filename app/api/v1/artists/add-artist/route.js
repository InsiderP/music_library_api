import { NextResponse } from 'next/server';
import connectDB from '@/lib/db';
import Artist from '@/lib/models/Artist';
import { checkPermissions } from '@/lib/auth';
import { formatResponse } from '@/lib/utils';

export async function POST(request) {
  try {
    await connectDB();
    const user = request.user;

    if (!checkPermissions(user.role, 'Editor')) {
      return NextResponse.json(
        { error: 'Unauthorized' },
        { status: 401 }
      );
    }

    const { name, grammy } = await request.json();
    if (!name) {
      return NextResponse.json(
        { error: 'Name is required' },
        { status: 400 }
      );
    }

    const artist = await Artist.create({
      name,
      grammy: grammy || false
    });

    return NextResponse.json(
      formatResponse(artist),
      { status: 201 }
    );
  } catch (error) {
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}


