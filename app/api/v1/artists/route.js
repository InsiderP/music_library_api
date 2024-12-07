import { NextResponse } from 'next/server';
import connectDB from '@/lib/db';
import Artist from '@/lib/models/Artist';
import { formatResponse } from '@/lib/utils';

export async function GET(request) {
  try {
    await connectDB();
    const artists = await Artist.find({ hidden: false });
    return NextResponse.json(formatResponse(artists));
  } catch (error) {
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}
