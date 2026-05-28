import { NextRequest, NextResponse } from 'next/server';
import { connectDB, User, hashPassword, generateToken } from '@/lib/shared';

export async function POST(request: NextRequest) {
  try {
    await connectDB();

    const { name, email, password, phone, address } = await request.json();

    if (!name || !email || !password) {
      return NextResponse.json(
        { success: false, error: 'Name, email and password are required' },
        { status: 400 }
      );
    }

    const normalizedEmail = email.toLowerCase();
    const existingUser = await User.findOne({ email: normalizedEmail });

    if (existingUser && existingUser.password) {
      return NextResponse.json(
        { success: false, error: 'An account with this email already exists' },
        { status: 409 }
      );
    }

    const hashedPassword = await hashPassword(password);

    const user = existingUser
      ? await User.findByIdAndUpdate(
          existingUser._id,
          {
            name,
            password: hashedPassword,
            phone: phone || existingUser.phone,
            address: address || existingUser.address,
            status: 'registered',
          },
          { new: true }
        )
      : await User.create({
          name,
          email: normalizedEmail,
          password: hashedPassword,
          phone,
          address,
          status: 'registered',
        });

    if (!user) {
      return NextResponse.json(
        { success: false, error: 'Failed to create user account' },
        { status: 500 }
      );
    }

    const token = generateToken({
      id: user._id.toString(),
      email: user.email,
      role: 'customer',
    });

    return NextResponse.json({
      success: true,
      data: {
        token,
        customer: {
          id: user._id,
          name: user.name,
          email: user.email,
          phone: user.phone,
          address: user.address,
          status: user.status,
          orderCount: user.orderCount,
        },
      },
    });
  } catch (error: any) {
    console.error('Registration error:', error);
    return NextResponse.json(
      { success: false, error: error.message || 'Registration failed' },
      { status: 500 }
    );
  }
}