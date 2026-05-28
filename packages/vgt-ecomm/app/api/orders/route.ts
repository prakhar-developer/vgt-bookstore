import { NextRequest, NextResponse } from 'next/server';
import { connectDB, Order, Book, User, Event } from '@/lib/shared';
import { Resend } from 'resend';

function generateOrderId(): string {
  const timestamp = Date.now().toString(36);
  const random = Math.random().toString(36).substring(2, 7);
  return `VGT-${timestamp}-${random}`.toUpperCase();
}

export async function POST(request: NextRequest) {
  try {
    await connectDB();

    const body = await request.json();
    const {
      bookId,
      items: rawItems,
      customerId,
      customerName,
      customerEmail,
      customerPhone,
      customerAddress,
      paymentScreenshot,
      paymentMethod = 'qr',
      paymentReference,
      shippingFee,
    } = body;

    if (!customerName || !customerEmail || !customerPhone || !customerAddress) {
      return NextResponse.json(
        { success: false, error: 'All fields are required' },
        { status: 400 }
      );
    }

    const incomingItems = Array.isArray(rawItems) && rawItems.length > 0
      ? rawItems
      : bookId
      ? [{ bookId, quantity: 1 }]
      : [];

    if (incomingItems.length === 0) {
      return NextResponse.json(
        { success: false, error: 'Cart items are required' },
        { status: 400 }
      );
    }

    const bookIds = incomingItems.map((item: any) => item.bookId);
    const books = await Book.find({ _id: { $in: bookIds } });
    const bookMap = new Map(books.map((book) => [book._id.toString(), book]));

    const normalizedItems = incomingItems.map((item: any) => {
      const book = bookMap.get(item.bookId);
      if (!book) {
        throw new Error(`Book not found: ${item.bookId}`);
      }

      const quantity = Math.max(1, Number(item.quantity) || 1);
      const availableQuantity = Number(book.quantity ?? 10);
      if (!book.inStock || availableQuantity < quantity) {
        throw new Error(`Book is out of stock: ${book.title}`);
      }

      return {
        bookId: book._id.toString(),
        title: book.title,
        author: book.author,
        coverImage: book.coverImage,
        category: book.category,
        price: book.price,
        quantity,
      };
    });

    const subtotal = normalizedItems.reduce((sum: number, item: any) => sum + item.price * item.quantity, 0);
    const finalShippingFee = typeof shippingFee === 'number' ? shippingFee : subtotal >= 999 ? 0 : subtotal > 0 ? 49 : 0;
    const totalAmount = subtotal + finalShippingFee;

    // Generate order ID
    const orderId = generateOrderId();

    // Create order
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
      shippingFee: finalShippingFee,
      totalAmount,
      paymentMethod,
      paymentProvider: paymentMethod === 'stripe' ? 'stripe' : paymentScreenshot ? 'qr' : 'manual',
      paymentScreenshot,
      paymentReference,
      paymentStatus: paymentMethod === 'stripe' ? 'paid' : paymentScreenshot ? 'pending' : 'pending',
      status: 'pending',
    });

    for (const item of normalizedItems) {
      const book = bookMap.get(item.bookId);
      if (!book) {
        continue;
      }

      const nextQuantity = Math.max(0, Number(book.quantity ?? 10) - item.quantity);
      await Book.findByIdAndUpdate(book._id, {
        quantity: nextQuantity,
        inStock: nextQuantity > 0,
      });
    }

    const normalizedEmail = customerEmail.toLowerCase();
    const customerFilter = customerId
      ? { _id: customerId }
      : { email: normalizedEmail };

    const existingCustomer = await User.findOne(customerFilter);
    const customerPayload = {
      name: customerName,
      email: normalizedEmail,
      phone: customerPhone,
      address: customerAddress,
      status: customerId || existingCustomer?.status === 'registered' ? 'registered' : 'guest',
      lastOrderAt: new Date(),
    } as const;

    if (existingCustomer) {
      await User.findByIdAndUpdate(existingCustomer._id, {
        ...customerPayload,
        $inc: { orderCount: 1, totalSpent: totalAmount },
        $addToSet: {
          preferredCategories: normalizedItems.map((item: any) => item.category),
          favoriteAuthors: normalizedItems.map((item: any) => item.author),
        },
      });
    } else {
      await User.create({
        ...customerPayload,
        orderCount: 1,
        totalSpent: totalAmount,
        preferredCategories: normalizedItems.map((item: any) => item.category),
        favoriteAuthors: normalizedItems.map((item: any) => item.author),
      });
    }

    await Event.create({
      type: 'purchase',
      customerId: customerId || existingCustomer?._id?.toString(),
      sessionId: undefined,
      quantity: normalizedItems.reduce((sum: number, item: any) => sum + item.quantity, 0),
      metadata: { orderId, totalAmount },
    });

    // Send confirmation email
    if (process.env.RESEND_API_KEY) {
      try {
        const resend = new Resend(process.env.RESEND_API_KEY);
        await resend.emails.send({
          from: 'VGT Bookstore <onboarding@resend.dev>',
          to: customerEmail,
          subject: `Order Confirmation - ${orderId}`,
          html: `
            <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
              <h2 style="color: #636B2F;">Order Confirmation</h2>
              <p>Dear ${customerName},</p>
              <p>Thank you for your order! Your order has been received and is being processed.</p>
              
              <div style="background: #f5f5f5; padding: 20px; border-radius: 8px; margin: 20px 0;">
                <h3>Order Details</h3>
                <p><strong>Order ID:</strong> ${orderId}</p>
                <p><strong>Items:</strong> ${normalizedItems.length}</p>
                <p><strong>Total:</strong> ₹${totalAmount}</p>
                <p><strong>Status:</strong> Pending Verification</p>
              </div>
              
              <p>We will verify your payment and update you on the order status shortly.</p>
              <p>If you have any questions, please don't hesitate to contact us.</p>
              
              <p>Best regards,<br/>VGT Bookstore Team</p>
            </div>
          `,
        });
      } catch (emailError) {
        console.error('Error sending email:', emailError);
        // Continue even if email fails
      }
    }

    return NextResponse.json({
      success: true,
      data: {
        orderId: order.orderId,
        totalAmount,
        items: normalizedItems,
        message: 'Order placed successfully',
      },
    });
  } catch (error: any) {
    console.error('Error creating order:', error);
    return NextResponse.json(
      { success: false, error: error.message || 'Failed to create order' },
      { status: 500 }
    );
  }
}
