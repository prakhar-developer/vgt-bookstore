import { NextRequest, NextResponse } from 'next/server';
import connectDB from '../../../../../../shared/lib/mongodb';
import Book from '../../../../../../shared/models/Book';

export async function GET(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    await connectDB();

    const book = await Book.findById(params.id).lean();

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
    console.error('Error fetching book:', error);
    return NextResponse.json(
      { success: false, error: error.message || 'Failed to fetch book' },
      { status: 500 }
    );
  }
}
