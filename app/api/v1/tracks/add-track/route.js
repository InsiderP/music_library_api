import { NextResponse } from 'next/server';
import connectDB from '@/lib/db';
import Track from '@/lib/models/Track';
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

    const { name, duration, albumId, artistId } = await request.json();
    
    if (!name || !duration || !albumId || !artistId) {
      return NextResponse.json(
        { error: 'All fields are required' },
        { status: 400 }
      );
    }

    const [album, artist] = await Promise.all([
      Album.findById(albumId),
      Artist.findById(artistId)
    ]);

    if (!album || !artist) {
      return NextResponse.json(
        { error: 'Album or Artist not found' },
        { status: 404 }
      );
    }

    const track = await Track.create({
      name,
      duration,
      albumId,
      artistId
    });

    return NextResponse.json(
      formatResponse(track),
      { status: 201 }
    );
  } catch (error) {
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}


