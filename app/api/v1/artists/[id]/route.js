import { NextResponse } from 'next/server';
import connectDB from '@/lib/db';
import Artist from '@/lib/models/Artist';
import { checkPermissions } from '@/lib/auth';
import { formatResponse } from '@/lib/utils';

export async function GET(request, { params }) {
  try {
    await connectDB();
    const artist = await Artist.findOne({ _id: params.id, hidden: false });
    
    if (!artist) {
      return NextResponse.json(
        { error: 'Artist not found' },
        { status: 404 }
      );
    }

    return NextResponse.json(formatResponse(artist));
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

    const { name, grammy, hidden } = await request.json();
    const artist = await Artist.findById(params.id);

    if (!artist) {
      return NextResponse.json(
        { error: 'Artist not found' },
        { status: 404 }
      );
    }

    await Artist.findByIdAndUpdate(params.id, {
      name: name || artist.name,
      grammy: grammy !== undefined ? grammy : artist.grammy,
      hidden: hidden !== undefined ? hidden : artist.hidden
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

    const artist = await Artist.findById(params.id);
    if (!artist) {
      return NextResponse.json(
        { error: 'Artist not found' },
        { status: 404 }
      );
    }

    await Artist.findByIdAndDelete(params.id);
    return NextResponse.json(
      { message: 'Artist deleted successfully' }
    );
  } catch (error) {
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}


