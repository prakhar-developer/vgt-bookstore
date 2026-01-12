import { NextRequest, NextResponse } from 'next/server';
import connectDB from '../../../../../shared/lib/mongodb';
import Order from '../../../../../shared/models/Order';
import Book from '../../../../../shared/models/Book';
import { Resend } from 'resend';

const resend = new Resend(process.env.RESEND_API_KEY);

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
      customerName,
      customerEmail,
      customerPhone,
      customerAddress,
      paymentScreenshot,
    } = body;

    // Validate required fields
    if (!bookId || !customerName || !customerEmail || !customerPhone || !customerAddress || !paymentScreenshot) {
      return NextResponse.json(
        { success: false, error: 'All fields are required' },
        { status: 400 }
      );
    }

    // Fetch book details
    const book = await Book.findById(bookId);
    if (!book) {
      return NextResponse.json(
        { success: false, error: 'Book not found' },
        { status: 404 }
      );
    }

    if (!book.inStock) {
      return NextResponse.json(
        { success: false, error: 'Book is out of stock' },
        { status: 400 }
      );
    }

    // Generate order ID
    const orderId = generateOrderId();

    // Create order
    const order = await Order.create({
      orderId,
      bookId,
      customerName,
      customerEmail,
      customerPhone,
      customerAddress,
      price: book.price,
      paymentScreenshot,
      status: 'pending',
    });

    // Send confirmation email
    try {
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
              <p><strong>Book:</strong> ${book.title}</p>
              <p><strong>Author:</strong> ${book.author}</p>
              <p><strong>Price:</strong> ₹${book.price}</p>
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

    return NextResponse.json({
      success: true,
      data: {
        orderId: order.orderId,
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
