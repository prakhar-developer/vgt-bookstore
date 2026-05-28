import { NextRequest, NextResponse } from 'next/server';
import { connectDB, Order, Book, User, extractTokenFromHeader, verifyToken } from '@/lib/shared';

export async function GET(request: NextRequest) {
  try {
    const token = extractTokenFromHeader(request.headers.get('authorization'));

    if (!token || !verifyToken(token)) {
      return NextResponse.json(
        { success: false, error: 'Unauthorized' },
        { status: 401 }
      );
    }

    await connectDB();

    const payload = verifyToken(token) as { id?: string; email?: string } | null;
    if (!payload?.id && !payload?.email) {
      return NextResponse.json(
        { success: false, error: 'Unauthorized' },
        { status: 401 }
      );
    }

    const customer = payload.id
      ? await User.findById(payload.id).lean()
      : await User.findOne({ email: payload.email?.toLowerCase() }).lean();

    if (!customer) {
      return NextResponse.json(
        { success: false, error: 'Customer not found' },
        { status: 404 }
      );
    }

    const orders = await Order.find({
      $or: [
        { customerId: customer._id.toString() },
        { customerEmail: customer.email },
      ],
    })
      .sort({ createdAt: -1 })
      .lean();

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
    console.error('Error fetching order history:', error);
    return NextResponse.json(
      { success: false, error: error.message || 'Failed to fetch order history' },
      { status: 500 }
    );
  }
}