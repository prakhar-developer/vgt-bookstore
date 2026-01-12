import { NextRequest, NextResponse } from "next/server"
import connectDB from "../../../../../shared/lib/mongodb"
import { Admin } from "../../../../../shared/models"
import { comparePassword, generateToken } from "../../../../../shared/lib/auth"

export async function POST(req: NextRequest) {
  try {
    await connectDB()

    const { email, password } = await req.json()

    // Validate input
    if (!email || !password) {
      return NextResponse. json(
        { success: false, error: "Email and password are required" },
        { status: 400 }
      )
    }

    // Find admin and EXPLICITLY SELECT PASSWORD (important!)
    const admin = await Admin.findOne({ email: email. toLowerCase() }).select("+password")

    if (!admin) {
      return NextResponse.json(
        { success: false, error: "Invalid credentials" },
        { status: 401 }
      )
    }

    // Check if password exists
    if (!admin.password) {
      console.error("Admin password not found in database")
      return NextResponse. json(
        { success: false, error: "Invalid credentials" },
        { status:  401 }
      )
    }

    // Compare password
    const isPasswordValid = await comparePassword(password, admin.password)

    if (!isPasswordValid) {
      return NextResponse.json(
        { success: false, error: "Invalid credentials" },
        { status:  401 }
      )
    }

    // Generate JWT token
    const token = generateToken({
      id: admin._id. toString(),
      email: admin. email,
      role: admin. role,
    })

    // Return success with token and admin info
    return NextResponse.json({
      success: true,
      data: {
        token,
        admin: {
          id: admin._id,
          email: admin.email,
          name: admin.name,
          role: admin.role,
        },
      },
    })
  } catch (error:  any) {
    console.error("Login error:", error)
    return NextResponse.json(
      {
        success: false,
        error: error.message || "Login failed",
      },
      { status: 500 }
    )
  }
}