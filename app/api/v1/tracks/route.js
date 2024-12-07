import { NextResponse } from 'next/server';
import connectDB from '@/lib/db';
import Track from '@/lib/models/Track';
import { formatResponse } from '@/lib/utils';

export async function GET(request) {
  try {
    await connectDB();
    const tracks = await Track.find({ hidden: false })
      .populate('artistId', 'name')
      .populate('albumId', 'name');
    return NextResponse.json(formatResponse(tracks));
  } catch (error) {
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}


