import { NextRequest, NextResponse } from 'next/server';
import { connectDB, Review, User, verifyToken, extractTokenFromHeader } from '@/lib/shared';

export async function GET(request: NextRequest) {
  try {
    await connectDB();
    const bookId = request.nextUrl.searchParams.get('bookId');

    if (!bookId) {
      return NextResponse.json({ success: false, error: 'Book id is required' }, { status: 400 });
    }

    const reviews = await Review.find({ bookId, approved: true }).sort({ createdAt: -1 }).lean();
    const normalizedReviews = reviews.map((review: any) => ({
      ...review,
      title: review.title || review.comment || 'Review',
      photoUrl: review.photoUrl || '',
    }));
    const averageRating = normalizedReviews.length
      ? normalizedReviews.reduce((sum, review: any) => sum + review.rating, 0) / normalizedReviews.length
      : 0;

    return NextResponse.json({
      success: true,
      data: {
        reviews: normalizedReviews,
        averageRating,
        totalReviews: normalizedReviews.length,
      },
    });
  } catch (error: any) {
    return NextResponse.json({ success: false, error: error.message || 'Failed to load reviews' }, { status: 500 });
  }
}

export async function POST(request: NextRequest) {
  try {
    await connectDB();
    const body = await request.json();
    const token = extractTokenFromHeader(request.headers.get('authorization'));
    const payload = token ? verifyToken(token) : null;

    const { bookId, rating, title, photoUrl } = body;

    if (!payload?.id) {
      return NextResponse.json({ success: false, error: 'Login required to submit a review' }, { status: 401 });
    }

    if (!bookId || !rating || !title) {
      return NextResponse.json({ success: false, error: 'bookId, rating, and title are required' }, { status: 400 });
    }

    const customer = await User.findById(payload.id);
    if (!customer) {
      return NextResponse.json({ success: false, error: 'Customer not found' }, { status: 404 });
    }

    const existingReview = await Review.findOne({ bookId, customerId: customer._id });
    if (existingReview) {
      return NextResponse.json({ success: false, error: 'You have already reviewed this book' }, { status: 409 });
    }

    const review = await Review.create({
      bookId,
      customerId: customer?._id,
      customerName: customer.name,
      rating,
      title,
      photoUrl: photoUrl || '',
      verifiedPurchase: Boolean(customer && (customer.orderCount || 0) > 0),
      approved: true,
    });

    return NextResponse.json({ success: true, data: review });
  } catch (error: any) {
    return NextResponse.json({ success: false, error: error.message || 'Failed to save review' }, { status: 500 });
  }
}