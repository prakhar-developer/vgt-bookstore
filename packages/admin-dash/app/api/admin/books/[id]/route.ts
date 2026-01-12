import { NextRequest, NextResponse } from 'next/server';
import { connectDB, Book, verifyToken, extractTokenFromHeader } from '@/lib/shared';

export async function PUT(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    // Verify authentication
    const token = extractTokenFromHeader(request.headers.get('authorization'));
    if (!token || !verifyToken(token)) {
      return NextResponse.json(
        { success: false, error: 'Unauthorized' },
        { status: 401 }
      );
    }

    await connectDB();

    const body = await request.json();

    const book = await Book.findByIdAndUpdate(
      params.id,
      body,
      { new: true, runValidators: true }
    );

    if (!book) {
      return NextResponse.json(
        { success: false, error: 'Book not found' },
        { status: 404 }
      );
    }

    return NextResponse.json({
      success: true,
      data: book,
    });
  } catch (error: any) {
    console.error('Error updating book:', error);
    return NextResponse.json(
      { success: false, error: error.message || 'Failed to update book' },
      { status: 500 }
    );
  }
}

export async function DELETE(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    // Verify authentication
    const token = extractTokenFromHeader(request.headers.get('authorization'));
    if (!token || !verifyToken(token)) {
      return NextResponse.json(
        { success: false, error: 'Unauthorized' },
        { status: 401 }
      );
    }

    await connectDB();

    const book = await Book.findByIdAndDelete(params.id);

    if (!book) {
      return NextResponse.json(
        { success: false, error: 'Book not found' },
        { status: 404 }
      );
    }

    return NextResponse.json({
      success: true,
      message: 'Book deleted successfully',
    });
  } catch (error: any) {
    console.error('Error deleting book:', error);
    return NextResponse.json(
      { success: false, error: error.message || 'Failed to delete book' },
      { status: 500 }
    );
  }
}
