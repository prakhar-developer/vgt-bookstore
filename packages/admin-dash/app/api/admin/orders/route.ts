import { NextRequest, NextResponse } from 'next/server';
import { connectDB, Order, Book, verifyToken, extractTokenFromHeader } from '@/lib/shared';

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

    const orders = await Order.find({}).sort({ createdAt: -1 }).lean();

    // Populate book details for each order
    const ordersWithBooks = await Promise.all(
      orders.map(async (order) => {
        const book = await Book.findById(order.bookId).lean();
        return {
          ...order,
          book,
        };
      })
    );

    return NextResponse.json({
      success: true,
      data: ordersWithBooks,
    });
  } catch (error: any) {
    console.error('Error fetching orders:', error);
    return NextResponse.json(
      { success: false, error: error.message || 'Failed to fetch orders' },
      { status: 500 }
    );
  }
}
