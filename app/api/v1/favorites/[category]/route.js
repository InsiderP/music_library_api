import { NextResponse } from 'next/server';
import connectDB from '@/lib/db';
import Favorite from '@/lib/models/Favorite';
import { formatResponse } from '@/lib/utils';

export async function GET(request, { params }) {
  try {
    await connectDB();
    const userId = request.user.userId;
    const { category } = params;

    if (!['Artist', 'Album', 'Track'].includes(category)) {
      return NextResponse.json(
        { error: 'Invalid category' },
        { status: 400 }
      );
    }

    const favorites = await Favorite.find({ 
      userId, 
      itemType: category 
    }).populate('itemId');

    return NextResponse.json(formatResponse(favorites));
  } catch (error) {
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }}