import { NextResponse } from 'next/server';
import connectDB from '@/lib/db';
import Track from '@/lib/models/Track';
import { checkPermissions } from '@/lib/auth';
import { formatResponse } from '@/lib/utils';

export async function GET(request, { params }) {
  try {
    await connectDB();
    const track = await Track.findOne({ _id: params.id, hidden: false })
      .populate('artistId', 'name')
      .populate('albumId', 'name');
    
    if (!track) {
      return NextResponse.json(
        { error: 'Track not found' },
        { status: 404 }
      );
    }

    return NextResponse.json(formatResponse(track));
  } catch (error) {
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}

export async function PUT(request, { params }) {
  try {
    await connectDB();
    const user = request.user;

    if (!checkPermissions(user.role, 'Editor')) {
      return NextResponse.json(
        { error: 'Unauthorized' },
        { status: 403 }
      );
    }

    const { name, duration, albumId, artistId, hidden } = await request.json();
    const track = await Track.findById(params.id);

    if (!track) {
      return NextResponse.json(
        { error: 'Track not found' },
        { status: 404 }
      );
    }

    await Track.findByIdAndUpdate(params.id, {
      name: name || track.name,
      duration: duration || track.duration,
      albumId: albumId || track.albumId,
      artistId: artistId || track.artistId,
      hidden: hidden !== undefined ? hidden : track.hidden
    });

    return new NextResponse(null, { status: 204 });
  } catch (error) {
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}

export async function DELETE(request, { params }) {
  try {
    await connectDB();
    const user = request.user;

    if (!checkPermissions(user.role, 'Editor')) {
      return NextResponse.json(
        { error: 'Unauthorized' },
        { status: 403 }
      );
    }

    const track = await Track.findById(params.id);

    if (!track) {
      return NextResponse.json(
        { error: 'Track not found' },
        { status: 404 }
      );
    }

    await Track.findByIdAndDelete(params.id);

    return new NextResponse(null, { status: 204 });
  } catch (error) {
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}
