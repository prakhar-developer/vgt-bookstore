import Stripe from 'stripe';
import { NextRequest, NextResponse } from 'next/server';
import { connectDB, Order, User, Book, Event } from '@/lib/shared';

function buildStripeClient() {
  if (!process.env.STRIPE_SECRET_KEY) {
    return null;
  }

  return new Stripe(process.env.STRIPE_SECRET_KEY);
}

export async function POST(request: NextRequest) {
  try {
    const stripe = buildStripeClient();
    if (!stripe) {
      return NextResponse.json({ success: false, error: 'Stripe is not configured' }, { status: 400 });
    }

    await connectDB();

    const { sessionId, orderId } = await request.json();
    if (!sessionId || !orderId) {
      return NextResponse.json({ success: false, error: 'Missing payment confirmation details' }, { status: 400 });
    }

    const session = await stripe.checkout.sessions.retrieve(sessionId);
    if (session.payment_status !== 'paid') {
      return NextResponse.json({ success: false, error: 'Payment has not completed' }, { status: 400 });
    }

    const order = await Order.findOneAndUpdate(
      { orderId },
      {
        paymentStatus: 'paid',
        status: 'verified',
        paymentReference: session.id,
      },
      { new: true }
    );

    if (order) {
      const books = await Book.find({ _id: { $in: (order.items || []).map((item: any) => item.bookId) } }).lean();
      const bookMap = new Map(books.map((book) => [book._id.toString(), book]));

      const customerFilter = order.customerId ? { _id: order.customerId } : { email: order.customerEmail.toLowerCase() };
      const existingCustomer = await User.findOne(customerFilter);

      if (existingCustomer) {
        await User.findByIdAndUpdate(existingCustomer._id, {
          name: order.customerName,
          email: order.customerEmail.toLowerCase(),
          phone: order.customerPhone,
          address: order.customerAddress,
          status: existingCustomer.status === 'registered' ? 'registered' : 'guest',
          lastOrderAt: new Date(),
          $inc: { orderCount: 1, totalSpent: order.totalAmount || order.price || 0 },
          $addToSet: {
            preferredCategories: (order.items || []).map((item: any) => item.category),
            favoriteAuthors: (order.items || []).map((item: any) => item.author),
          },
        });
      }

      await Event.create({
        type: 'purchase',
        customerId: order.customerId || existingCustomer?._id?.toString(),
        sessionId,
        quantity: (order.items || []).reduce((sum: number, item: any) => sum + item.quantity, 0),
        metadata: { orderId, totalAmount: order.totalAmount || order.price || 0 },
      });

      for (const item of order.items || []) {
        const book = bookMap.get(item.bookId);
        if (!book) {
          continue;
        }

        const currentQuantity = Number(book.quantity ?? 0);
        const nextQuantity = Math.max(0, currentQuantity - item.quantity);
        await Book.findByIdAndUpdate(book._id, {
          quantity: nextQuantity,
          inStock: nextQuantity > 0,
        });
      }
    }

    return NextResponse.json({ success: true, data: order });
  } catch (error: any) {
    console.error('Stripe confirmation error:', error);
    return NextResponse.json(
      { success: false, error: error.message || 'Failed to confirm payment' },
      { status: 500 }
    );
  }
}