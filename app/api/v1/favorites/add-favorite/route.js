import { NextResponse } from 'next/server';
import connectDB from '@/lib/db';
import Favorite from '@/lib/models/Favorite';
import Artist from '@/lib/models/Artist';
import Album from '@/lib/models/Album';
import Track from '@/lib/models/Track';
import { checkPermissions } from '@/lib/auth';
import { formatResponse } from '@/lib/utils';

export async function POST(request) {
  try {
    await connectDB();
    const user = request.user;

    // Check if user has permission
    if (!checkPermissions(user.role, 'Viewer')) {
      return NextResponse.json(
        { error: 'Unauthorized' },
        { status: 401 }
      );
    }

    const { itemId, itemType } = await request.json();

    // Validate required fields
    if (!itemId || !itemType) {
      return NextResponse.json(
        { error: 'Item ID and type are required' },
        { status: 400 }
      );
    }

    // Validate item type
    const validTypes = ['Artist', 'Album', 'Track'];
    if (!validTypes.includes(itemType)) {
      return NextResponse.json(
        { error: 'Invalid item type. Must be Artist, Album, or Track' },
        { status: 400 }
      );
    }

    // Validate ID format
    if (itemId.length !== 24) {
      return NextResponse.json(
        { error: 'Invalid item ID format' },
        { status: 400 }
      );
    }

    // Check if item exists based on type
    let item;
    switch (itemType) {
      case 'Artist':
        item = await Artist.findOne({ _id: itemId, hidden: false });
        break;
      case 'Album':
        item = await Album.findOne({ _id: itemId, hidden: false });
        break;
      case 'Track':
        item = await Track.findOne({ _id: itemId, hidden: false });
        break;
    }

    if (!item) {
      return NextResponse.json(
        { error: `${itemType} not found or is hidden` },
        { status: 404 }
      );
    }

    // Check if already favorited
    const existingFavorite = await Favorite.findOne({
      userId: user.userId,
      itemId,
      itemType
    });

    if (existingFavorite) {
      return NextResponse.json(
        { error: `This ${itemType} is already in your favorites` },
        { status: 403 }
      );
    }

    // Create new favorite
    const favorite = await Favorite.create({
      userId: user.userId,
      itemId,
      itemType
    });

    // Format response
    const response = {
      id: favorite._id,
      itemId: favorite.itemId,
      itemType: favorite.itemType,
      userId: favorite.userId,
      createdAt: favorite.createdAt
    };

    return NextResponse.json(response, { status: 201 });

  } catch (error) {
    console.error('Add favorite error:', error);

    if (error.name === 'CastError') {
      return NextResponse.json(
        { error: 'Invalid ID format' },
        { status: 400 }
      );
    }

    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}