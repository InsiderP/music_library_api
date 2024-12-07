import { NextResponse } from 'next/server';
import connectDB from '@/lib/db';
import User from '@/lib/models/User';
import { checkPermissions } from '@/lib/auth';

export async function DELETE(request, { params }) {
  try {
    await connectDB();
    const currentUser = request.user;

    if (!checkPermissions(currentUser.role, 'Admin')) {
      return NextResponse.json(
        { error: 'Unauthorized' },
        { status: 403 }
      );
    }

    const userToDelete = await User.findById(params.id);
    if (!userToDelete) {
      return NextResponse.json(
        { error: 'User not found' },
        { status: 404 }
      );
    }

    if (userToDelete.role === 'Admin') {
      return NextResponse.json(
        { error: 'Cannot delete admin user' },
        { status: 403 }
      );
    }

    await User.findByIdAndDelete(params.id);
    return NextResponse.json(
      { message: 'User deleted successfully' }
    );
  } catch (error) {
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}


