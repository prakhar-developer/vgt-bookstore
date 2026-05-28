import { NextRequest, NextResponse } from 'next/server';
import { connectDB, Book, Order, User, Event, extractTokenFromHeader, verifyToken } from '@/lib/shared';

export async function GET(request: NextRequest) {
  try {
    const token = extractTokenFromHeader(request.headers.get('authorization'));
    if (!token || !verifyToken(token)) {
      return NextResponse.json({ success: false, error: 'Unauthorized' }, { status: 401 });
    }

    await connectDB();

    const [books, orders, customers, events] = await Promise.all([
      Book.find({}).lean(),
      Order.find({}).lean(),
      User.find({}).lean(),
      Event.find({}).sort({ createdAt: -1 }).limit(500).lean(),
    ]);

    const lowStockBooks = books.filter((book: any) => (book.quantity ?? 0) <= 5 && (book.quantity ?? 0) > 0);
    const outOfStockBooks = books.filter((book: any) => (book.quantity ?? 0) === 0 || book.inStock === false);

    const segmentCounts = {
      new: customers.filter((customer: any) => (customer.orderCount || 0) === 0).length,
      returning: customers.filter((customer: any) => (customer.orderCount || 0) >= 1 && (customer.orderCount || 0) < 5).length,
      vip: customers.filter((customer: any) => (customer.totalSpent || 0) >= 5000 || (customer.orderCount || 0) >= 5).length,
    };

    const topCategories = orders.reduce<Record<string, number>>((acc, order: any) => {
      (order.items || []).forEach((item: any) => {
        acc[item.category] = (acc[item.category] || 0) + item.quantity;
      });
      return acc;
    }, {});

    const revenue = orders.reduce((sum: number, order: any) => sum + (order.totalAmount || order.price || 0), 0);
    const pendingRefunds = orders.filter((order: any) => order.refundStatus === 'requested').length;

    return NextResponse.json({
      success: true,
      data: {
        metrics: {
          totalBooks: books.length,
          totalOrders: orders.length,
          totalCustomers: customers.length,
          revenue,
          lowStockBooks: lowStockBooks.length,
          outOfStockBooks: outOfStockBooks.length,
          totalEvents: events.length,
          pendingRefunds,
        },
        segments: segmentCounts,
        topCategories: Object.entries(topCategories)
          .sort((left, right) => right[1] - left[1])
          .slice(0, 6)
          .map(([category, quantity]) => ({ category, quantity })),
        lowStockBooks: lowStockBooks.slice(0, 10),
        recentEvents: events.slice(0, 20),
      },
    });
  } catch (error: any) {
    console.error('Error loading analytics:', error);
    return NextResponse.json(
      { success: false, error: error.message || 'Failed to load analytics' },
      { status: 500 }
    );
  }
}