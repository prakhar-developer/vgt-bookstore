import { NextRequest, NextResponse } from 'next/server';
import { connectDB, Event } from '@/lib/shared';

export async function POST(request: NextRequest) {
  try {
    await connectDB();

    const body = await request.json();
    const { type, bookId, customerId, sessionId, quantity, metadata } = body;

    if (!type) {
      return NextResponse.json({ success: false, error: 'Event type is required' }, { status: 400 });
    }

    await Event.create({
      type,
      bookId,
      customerId,
      sessionId,
      quantity: quantity || 1,
      metadata: metadata || {},
    });

    return NextResponse.json({ success: true });
  } catch (error: any) {
    console.error('Failed to track event:', error);
    return NextResponse.json(
      { success: false, error: error.message || 'Failed to track event' },
      { status: 500 }
    );
  }
}