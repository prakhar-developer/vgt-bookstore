import { NextRequest, NextResponse } from 'next/server';
import { connectDB, Review, Book, verifyToken, extractTokenFromHeader } from '@/lib/shared';

export async function GET(request: NextRequest) {
  try {
    const token = extractTokenFromHeader(request.headers.get('authorization'));
    if (!token || !verifyToken(token)) {
      return NextResponse.json({ success: false, error: 'Unauthorized' }, { status: 401 });
    }

    await connectDB();

    const reviews = await Review.find({})
      .sort({ createdAt: -1 })
      .lean();

    const bookIds = reviews.map((review: any) => review.bookId).filter(Boolean);
    const books = await Book.find({ _id: { $in: bookIds } }).lean();
    const bookMap = new Map(books.map((book) => [book._id.toString(), book]));

    const data = reviews.map((review: any) => ({
      ...review,
      title: review.title || review.comment || 'Review',
      photoUrl: review.photoUrl || '',
      book: bookMap.get(review.bookId?.toString?.() || review.bookId) || null,
    }));

    return NextResponse.json({ success: true, data });
  } catch (error: any) {
    console.error('Error fetching reviews:', error);
    return NextResponse.json({ success: false, error: error.message || 'Failed to fetch reviews' }, { status: 500 });
  }
}

export async function PATCH(request: NextRequest) {
  try {
    const token = extractTokenFromHeader(request.headers.get('authorization'));
    if (!token || !verifyToken(token)) {
      return NextResponse.json({ success: false, error: 'Unauthorized' }, { status: 401 });
    }

    await connectDB();

    const { reviewId, approved } = await request.json();
    if (!reviewId || typeof approved !== 'boolean') {
      return NextResponse.json({ success: false, error: 'reviewId and approved are required' }, { status: 400 });
    }

    const review = await Review.findByIdAndUpdate(reviewId, { approved }, { new: true }).lean();
    if (!review) {
      return NextResponse.json({ success: false, error: 'Review not found' }, { status: 404 });
    }

    return NextResponse.json({ success: true, data: review });
  } catch (error: any) {
    console.error('Error updating review:', error);
    return NextResponse.json({ success: false, error: error.message || 'Failed to update review' }, { status: 500 });
  }
}

export async function DELETE(request: NextRequest) {
  try {
    const token = extractTokenFromHeader(request.headers.get('authorization'));
    if (!token || !verifyToken(token)) {
      return NextResponse.json({ success: false, error: 'Unauthorized' }, { status: 401 });
    }

    await connectDB();

    const { searchParams } = new URL(request.url);
    const reviewId = searchParams.get('reviewId');
    if (!reviewId) {
      return NextResponse.json({ success: false, error: 'reviewId is required' }, { status: 400 });
    }

    const review = await Review.findByIdAndDelete(reviewId);
    if (!review) {
      return NextResponse.json({ success: false, error: 'Review not found' }, { status: 404 });
    }

    return NextResponse.json({ success: true, message: 'Review deleted successfully' });
  } catch (error: any) {
    console.error('Error deleting review:', error);
    return NextResponse.json({ success: false, error: error.message || 'Failed to delete review' }, { status: 500 });
  }
}