import { NextResponse } from 'next/server';
import connectDB from '@/lib/db';
import Favorite from '@/lib/models/Favorite';
import { checkPermissions } from '@/lib/auth';

export async function DELETE(request, { params }) {
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

    // Validate ID format
    if (!params.id || params.id.length !== 24) {
      return NextResponse.json(
        { error: 'Invalid favorite ID' },
        { status: 400 }
      );
    }

    // Find favorite
    const favorite = await Favorite.findOne({
      _id: params.id,
      userId: user.userId
    });

    if (!favorite) {
      return NextResponse.json(
        { error: 'Favorite not found' },
        { status: 404 }
      );
    }

    // Check if user owns the favorite
    if (favorite.userId.toString() !== user.userId) {
      return NextResponse.json(
        { error: 'Forbidden - Cannot delete other users favorites' },
        { status: 403 }
      );
    }

    // Delete favorite
    await Favorite.findByIdAndDelete(params.id);

    return NextResponse.json({
      message: 'Favorite removed successfully',
      id: params.id
    }, { status: 200 });

  } catch (error) {
    console.error('Remove favorite error:', error);
    
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