import { NextResponse } from 'next/server';
import connectDB from '@/lib/db';
import Album from '@/lib/models/Album';
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
        { status: 403 }
      );
    }

    const { name, year, artistId } = await request.json();
    if (!name || !year || !artistId) {
      return NextResponse.json(
        { error: 'All fields are required' },
        { status: 400 }
      );
    }

    const artist = await Artist.findById(artistId);
    if (!artist) {
      return NextResponse.json(
        { error: 'Artist not found' },
        { status: 404 }
      );
    }

    const album = await Album.create({
      name,
      year,
      artistId
    });

    return NextResponse.json(
      formatResponse(album),
      { status: 201 }
    );
  } catch (error) {
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}

