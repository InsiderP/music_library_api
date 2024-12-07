import { NextResponse } from 'next/server';
import connectDB from '@/lib/db';
import Album from '@/lib/models/Album';
import { formatResponse } from '@/lib/utils';

export async function GET(request) {
  try {
    await connectDB();
    const albums = await Album.find({ hidden: false })
      .populate('artistId', 'name');
    return NextResponse.json(formatResponse(albums));
  } catch (error) {
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}


