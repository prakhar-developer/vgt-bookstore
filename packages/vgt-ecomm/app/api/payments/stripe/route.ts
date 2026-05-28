import Stripe from 'stripe';
import { NextRequest, NextResponse } from 'next/server';
import { connectDB, Book, Order } from '@/lib/shared';

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

    const body = await request.json();
    const { items = [], customerName, customerEmail, customerPhone, customerAddress, customerId } = body;

    if (!Array.isArray(items) || items.length === 0) {
      return NextResponse.json({ success: false, error: 'Cart is empty' }, { status: 400 });
    }

    const bookIds = items.map((item: any) => item.bookId);
    const books = await Book.find({ _id: { $in: bookIds } }).lean();
    const bookMap = new Map(books.map((book) => [book._id.toString(), book]));

    const normalizedItems = items.map((item: any) => {
      const book = bookMap.get(item.bookId);
      if (!book) {
        throw new Error(`Book not found: ${item.bookId}`);
      }

      const availableQuantity = Number(book.quantity ?? 0);
      if (availableQuantity < Number(item.quantity) || availableQuantity <= 0) {
        throw new Error(`Book is out of stock: ${book.title}`);
      }

      return {
        bookId: book._id.toString(),
        title: book.title,
        author: book.author,
        coverImage: book.coverImage,
        category: book.category,
        price: book.price,
        quantity: Number(item.quantity) || 1,
      };
    });

    const subtotal = normalizedItems.reduce((sum: number, item: any) => sum + item.price * item.quantity, 0);
    const shippingFee = subtotal >= 999 ? 0 : subtotal > 0 ? 49 : 0;
    const totalAmount = subtotal + shippingFee;
    const orderId = `VGT-${Date.now().toString(36).toUpperCase()}-${Math.random().toString(36).slice(2, 7).toUpperCase()}`;

    const order = await Order.create({
      orderId,
      bookId: normalizedItems[0].bookId,
      customerId,
      items: normalizedItems,
      customerName,
      customerEmail,
      customerPhone,
      customerAddress,
      price: totalAmount,
      subtotal,
      shippingFee,
      totalAmount,
      paymentMethod: 'stripe',
      paymentProvider: 'stripe',
      paymentStatus: 'pending',
      status: 'pending',
    });

    const session = await stripe.checkout.sessions.create({
      mode: 'payment',
      customer_email: customerEmail,
      metadata: {
        orderId: order.orderId,
      },
      line_items: normalizedItems.map((item: any) => ({
        quantity: item.quantity,
        price_data: {
          currency: 'inr',
          product_data: {
            name: item.title,
            description: `${item.author} • ${item.category}`,
            images: [item.coverImage],
          },
          unit_amount: Math.round(item.price * 100),
        },
      })),
      shipping_options: shippingFee > 0
        ? [
            {
              shipping_rate_data: {
                type: 'fixed_amount',
                fixed_amount: {
                  amount: shippingFee * 100,
                  currency: 'inr',
                },
                display_name: 'Standard shipping',
              },
            },
          ]
        : [],
      success_url: `${process.env.NEXT_PUBLIC_BASE_URL || 'http://localhost:3000'}/order-success?orderId=${order.orderId}&session_id={CHECKOUT_SESSION_ID}`,
      cancel_url: `${process.env.NEXT_PUBLIC_BASE_URL || 'http://localhost:3000'}/checkout?canceled=true`,
    });

    return NextResponse.json({
      success: true,
      data: {
        orderId: order.orderId,
        url: session.url,
      },
    });
  } catch (error: any) {
    console.error('Stripe checkout error:', error);
    return NextResponse.json(
      { success: false, error: error.message || 'Failed to create payment session' },
      { status: 500 }
    );
  }
}