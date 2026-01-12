import { NextRequest, NextResponse } from 'next/server';
import connectDB from '../../../../../../shared/lib/mongodb';
import Book from '../../../../../../shared/models/Book';
import { verifyToken, extractTokenFromHeader } from '../../../../../../shared/lib/auth';

export async function GET(request: NextRequest) {
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

    const books = await Book.find({}).sort({ createdAt: -1 }).lean();

    return NextResponse.json({
      success: true,
      data: books,
    });
  } catch (error: any) {
    console.error('Error fetching books:', error);
    return NextResponse.json(
      { success: false, error: error.message || 'Failed to fetch books' },
      { status: 500 }
    );
  }
}

export async function POST(request: NextRequest) {
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

    const book = await Book.create(body);

    return NextResponse.json({
      success: true,
      data: book,
    });
  } catch (error: any) {
    console.error('Error creating book:', error);
    return NextResponse.json(
      { success: false, error: error.message || 'Failed to create book' },
      { status: 500 }
    );
  }
}
