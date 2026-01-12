import { NextResponse } from 'next/server';
import { connectDB, Category } from '@/lib/shared';

export async function GET() {
  try {
    await connectDB();

    const categories = await Category.find({})
      .sort({ name: 1 })
      .lean();

    return NextResponse.json({
      success: true,
      data: categories,
    });
  } catch (error: any) {
    console.error('Error fetching categories:', error);
    return NextResponse.json(
      { success: false, error: error.message || 'Failed to fetch categories' },
      { status: 500 }
    );
  }
}
