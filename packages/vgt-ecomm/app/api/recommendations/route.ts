import { NextRequest, NextResponse } from 'next/server';
import { connectDB, Book, Order, User, Event, extractTokenFromHeader, verifyToken } from '@/lib/shared';

function unique(values: string[]) {
  return [...new Set(values.filter(Boolean))];
}

function tokenize(value?: string) {
  return unique(
    (value || '')
      .toLowerCase()
      .split(/[^a-z0-9]+/)
      .filter((token) => token.length > 2)
  );
}

function overlapScore(left: string[], right: string[]) {
  if (left.length === 0 || right.length === 0) {
    return 0;
  }

  const matches = left.filter((item) => right.includes(item));
  return matches.length / Math.max(left.length, right.length);
}

function behaviorScore(events: any[], bookId: string) {
  return events
    .filter((event) => event.bookId === bookId)
    .reduce((score, event) => {
      if (event.type === 'view_book') return score + 1;
      if (event.type === 'add_to_cart') return score + 3 * (event.quantity || 1);
      if (event.type === 'purchase') return score + 5 * (event.quantity || 1);
      return score;
    }, 0);
}

export async function GET(request: NextRequest) {
  try {
    await connectDB();

    const { searchParams } = new URL(request.url);
    const limit = Number(searchParams.get('limit')) || 8;
    const bookId = searchParams.get('bookId');
    const email = searchParams.get('email');

    const token = extractTokenFromHeader(request.headers.get('authorization'));
    const payload = token ? verifyToken(token) as { id?: string; email?: string } | null : null;

    const customer = payload?.id
      ? await User.findById(payload.id)
      : email
      ? await User.findOne({ email: email.toLowerCase() })
      : null;

    const purchasedFilter = customer
      ? { $or: [{ customerId: customer._id.toString() }, { customerEmail: customer.email }] }
      : email
      ? { customerEmail: email.toLowerCase() }
      : null;

    const purchasedOrders = purchasedFilter
      ? await Order.find(purchasedFilter).sort({ createdAt: -1 }).lean()
      : [];

    const recentBehaviorEvents = customer
      ? await Event.find({
          customerId: customer._id.toString(),
          type: { $in: ['view_book', 'add_to_cart', 'purchase'] },
        })
          .sort({ createdAt: -1 })
          .limit(150)
          .lean()
      : [];

    const purchasedBookIds = unique(purchasedOrders.map((order) => order.bookId));
    const purchasedBooks = purchasedBookIds.length
      ? await Book.find({ _id: { $in: purchasedBookIds } }).lean()
      : [];

    const currentBook = bookId ? await Book.findById(bookId).lean() : null;

    const popularityCounts = await Order.aggregate([
      {
        $group: {
          _id: '$bookId',
          totalOrders: { $sum: 1 },
        },
      },
    ]);

    const popularityMap = new Map<string, number>(
      popularityCounts.map((item) => [item._id, item.totalOrders])
    );

    const behaviorCounts = await Event.aggregate([
      {
        $match: {
          type: { $in: ['view_book', 'add_to_cart', 'purchase'] },
        },
      },
      {
        $group: {
          _id: '$bookId',
          weightedScore: {
            $sum: {
              $switch: {
                branches: [
                  { case: { $eq: ['$type', 'view_book'] }, then: 1 },
                  { case: { $eq: ['$type', 'add_to_cart'] }, then: 3 },
                  { case: { $eq: ['$type', 'purchase'] }, then: 5 },
                ],
                default: 0,
              },
            },
          },
        },
      },
    ]);

    const behaviorMap = new Map<string, number>(
      behaviorCounts.map((item) => [item._id, item.weightedScore])
    );

    const recentPreferredCategories = unique(
      purchasedBooks.slice(0, 5).map((book) => book.category)
    );
    const recentPreferredAuthors = unique(
      purchasedBooks.slice(0, 5).map((book) => book.author)
    );
    const preferredPrice = purchasedBooks.length
      ? purchasedBooks.reduce((sum, book) => sum + book.price, 0) / purchasedBooks.length
      : currentBook?.price || 0;

    const preferredCategories = unique([
      ...(customer?.preferredCategories || []),
      ...purchasedBooks.map((book) => book.category),
      ...(currentBook ? [currentBook.category] : []),
    ]);

    const preferredAuthors = unique([
      ...(customer?.favoriteAuthors || []),
      ...purchasedBooks.map((book) => book.author),
      ...(currentBook ? [currentBook.author] : []),
    ]);

    const excludedIds = unique([
      ...purchasedBookIds,
      ...(bookId ? [bookId] : []),
    ]);

    const candidates = await Book.find({
      inStock: true,
      _id: { $nin: excludedIds },
    })
      .sort({ featured: -1, createdAt: -1 })
      .lean();

    const scoredRecommendations = candidates
      .map((candidate) => {
        const candidateTokens = tokenize(candidate.title);
        const currentTokens = tokenize(currentBook?.title);
        const categoryMatch = preferredCategories.includes(candidate.category) ? 1 : 0;
        const recentCategoryMatch = recentPreferredCategories.includes(candidate.category) ? 1 : 0;
        const authorMatch = preferredAuthors.includes(candidate.author) ? 1 : 0;
        const recentAuthorMatch = recentPreferredAuthors.includes(candidate.author) ? 1 : 0;
        const currentBookCategoryMatch = currentBook && candidate.category === currentBook.category ? 1 : 0;
        const currentBookAuthorMatch = currentBook && candidate.author === currentBook.author ? 1 : 0;
        const titleSimilarity = currentBook ? overlapScore(candidateTokens, currentTokens) : 0;
        const priceSimilarity = preferredPrice
          ? Math.max(0, 1 - Math.abs(candidate.price - preferredPrice) / Math.max(preferredPrice, 1))
          : 0;
        const popularityScore = Math.log10((popularityMap.get(candidate._id.toString()) || 0) + 1);
        const aggregateBehaviorScore = Math.log10((behaviorMap.get(candidate._id.toString()) || 0) + 1);
        const personalBehaviorScore = behaviorScore(recentBehaviorEvents, candidate._id.toString());

        const score = (
          categoryMatch * 5 +
          recentCategoryMatch * 2.5 +
          authorMatch * 4 +
          recentAuthorMatch * 2 +
          currentBookCategoryMatch * 6 +
          currentBookAuthorMatch * 5 +
          titleSimilarity * 2.5 +
          priceSimilarity * 1.25 +
          (candidate.featured ? 1.5 : 0) +
          popularityScore * 1.2 +
          aggregateBehaviorScore * 2 +
          personalBehaviorScore * 0.75
        );

        const reasons = unique([
          categoryMatch || recentCategoryMatch || currentBookCategoryMatch ? 'matched category' : '',
          authorMatch || recentAuthorMatch || currentBookAuthorMatch ? 'matched author' : '',
          titleSimilarity > 0 ? 'similar title' : '',
          priceSimilarity > 0.75 ? 'close price' : '',
          candidate.featured ? 'featured book' : '',
          popularityScore > 0 ? 'popular with readers' : '',
          aggregateBehaviorScore > 0 ? 'popular in browsing data' : '',
          personalBehaviorScore > 0 ? 'your recent activity matched' : '',
        ]);

        return {
          candidate,
          score,
          reasons,
        };
      })
      .sort((left, right) => right.score - left.score)
      .slice(0, limit);

    const recommendations = scoredRecommendations.map(({ candidate, reasons }) => ({
      ...candidate,
      recommendationReasons: reasons,
    }));

    return NextResponse.json({
      success: true,
      data: recommendations,
      meta: {
        personalized: Boolean(customer || currentBook || purchasedOrders.length),
        purchasedCount: purchasedOrders.length,
      },
    });
  } catch (error: any) {
    console.error('Recommendation error:', error);
    return NextResponse.json(
      { success: false, error: error.message || 'Failed to load recommendations' },
      { status: 500 }
    );
  }
}