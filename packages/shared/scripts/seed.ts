import mongoose from "mongoose"
import bcrypt from "bcryptjs"
import dotenv from "dotenv"
import path from "path"

// Load environment variables
dotenv.config({ path: path.resolve(__dirname, "../.env") })

import { Admin, Category, User } from "../models"

const MONGODB_URI = process.env.MONGODB_URI

if (!MONGODB_URI) {
  console.error("❌ Error:  MONGODB_URI not found in environment variables")
  process.exit(1)
}

async function seed() {
  try {
    console.log("🌱 Starting database seeding...")
    
    // Connect to MongoDB
    await mongoose.connect(MONGODB_URI as string)
    console.log("✅ Connected to MongoDB")

    // Create Admin User
    const existingAdmin = await Admin.findOne({ email: "admin.vgt@gmail.com" })
    if (!existingAdmin) {
      const hashedPassword = await bcrypt. hash("Admin@12345", 10)
      await Admin.create({
        email: "admin.vgt@gmail.com",
        password: hashedPassword,
        name: "VGT Admin",
        role: "super_admin",
      })
      console.log("✅ Admin user created")
      console.log("   Email: admin.vgt@gmail.com")
      console.log("   Password: Admin@12345")
    } else {
      console.log("ℹ️  Admin user already exists")
    }

    // Create Demo Customer
    const existingCustomer = await User.findOne({ email: "reader.vgt@gmail.com" })
    if (!existingCustomer) {
      const hashedPassword = await bcrypt.hash("Reader@12345", 10)
      await User.create({
        email: "reader.vgt@gmail.com",
        password: hashedPassword,
        name: "VGT Reader",
        status: "registered",
        phone: "+91 90000 90000",
        address: "Mumbai, India",
        preferredCategories: ["Programming", "Self Growth"],
        favoriteAuthors: ["Robert C. Martin"],
      })
      console.log("✅ Demo customer created")
      console.log("   Email: reader.vgt@gmail.com")
      console.log("   Password: Reader@12345")
    } else {
      console.log("ℹ️  Demo customer already exists")
    }

    // Create Categories
    const categories = [
      {
        name: "Competitive Exams",
        slug: "competitive-exams",
        icon: "trophy",
        description: "Books for competitive exam preparation",
      },
      {
        name:  "Programming",
        slug: "programming",
        icon: "code",
        description: "Programming and software development books",
      },
      {
        name: "School & College",
        slug: "school-college",
        icon: "graduation-cap",
        description: "Academic textbooks and study materials",
      },
      {
        name: "Self Growth",
        slug: "self-growth",
        icon: "sparkles",
        description: "Personal development and self-help books",
      },
    ]

    for (const cat of categories) {
      const existing = await Category.findOne({ slug: cat.slug })
      if (!existing) {
        await Category.create(cat)
        console.log(`✅ Category created: ${cat.name}`)
      } else {
        console. log(`ℹ️  Category already exists: ${cat.name}`)
      }
    }

    console.log("\n🎉 Database seeded successfully!")
    console.log("\n📝 Next Steps:")
    console.log("1. Run e-commerce site:  cd ../vgt-ecomm && npm run dev")
    console.log("2. Run admin dashboard: cd ../admin-dash && npm run dev")
    console.log("3. Login to admin:  http://localhost:3001/login")
    console.log("   Email: admin.vgt@gmail.com")
    console.log("   Password: Admin@12345")
    
    process.exit(0)
  } catch (error) {
    console.error("❌ Error seeding database:", error)
    process.exit(1)
  }
}

seed()