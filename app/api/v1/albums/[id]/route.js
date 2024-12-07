import { NextResponse } from 'next/server';
import connectDB from '@/lib/db';
import Album from '@/lib/models/Album';
import { checkPermissions } from '@/lib/auth';
import { formatResponse } from '@/lib/utils';

export async function GET(request, { params }) {
  try {
    await connectDB();
    const album = await Album.findOne({ _id: params.id, hidden: false })
      .populate('artistId', 'name');
    
    if (!album) {
      return NextResponse.json(
        { error: 'Album not found' },
        { status: 404 }
      );
    }

    return NextResponse.json(formatResponse(album));
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

    const { name, year, artistId, hidden } = await request.json();
    const album = await Album.findById(params.id);

    if (!album) {
      return NextResponse.json(
        { error: 'Album not found' },
        { status: 404 }
      );
    }

    await Album.findByIdAndUpdate(params.id, {
      name: name || album.name,
      year: year || album.year,
      artistId: artistId || album.artistId,
      hidden: hidden !== undefined ? hidden : album.hidden
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

    if (!checkPermissions(user.role, 'Admin')) {
      return NextResponse.json(
        { error: 'Unauthorized' },
        { status: 403 }
      );
    }

    const album = await Album.findById(params.id);
    if (!album) {
      return NextResponse.json(
        { error: 'Album not found' },
        { status: 404 }
      );
    }

    await Album.findByIdAndDelete(params.id);
    return NextResponse.json(
      { message: 'Album deleted successfully' }
    );
  } catch (error) {
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}
