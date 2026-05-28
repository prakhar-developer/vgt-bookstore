import { NextRequest, NextResponse } from 'next/server';
import { connectDB, User, extractTokenFromHeader, verifyToken } from '@/lib/shared';

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

    const customers = await User.find({}).sort({ lastOrderAt: -1, createdAt: -1 }).lean();

    return NextResponse.json({
      success: true,
      data: customers,
      meta: {
        total: customers.length,
        registered: customers.filter((customer) => customer.status === 'registered').length,
        guests: customers.filter((customer) => customer.status === 'guest').length,
      },
    });
  } catch (error: any) {
    console.error('Error fetching customers:', error);
    return NextResponse.json(
      { success: false, error: error.message || 'Failed to fetch customers' },
      { status: 500 }
    );
  }
}