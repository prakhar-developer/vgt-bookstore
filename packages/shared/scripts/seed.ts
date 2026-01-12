import connectDB from '../lib/mongodb';
import { Admin, Category } from '../models';
import { hashPassword } from '../lib/auth';

const ADMIN_EMAIL = process.env.ADMIN_EMAIL || 'admin.vgt@gmail.com';
const ADMIN_PASSWORD = process.env.ADMIN_PASSWORD || 'Admin@12345';

const defaultCategories = [
  {
    name: 'Fiction',
    slug: 'fiction',
    icon: 'BookOpen',
    description: 'Explore fictional stories and novels'
  },
  {
    name: 'Non-Fiction',
    slug: 'non-fiction',
    icon: 'Book',
    description: 'Real stories and educational content'
  },
  {
    name: 'Science & Technology',
    slug: 'science-technology',
    icon: 'Atom',
    description: 'Books about science and technology'
  },
  {
    name: 'Self-Help',
    slug: 'self-help',
    icon: 'Heart',
    description: 'Personal development and motivation'
  },
  {
    name: 'Business & Economics',
    slug: 'business-economics',
    icon: 'TrendingUp',
    description: 'Business strategies and economic theories'
  },
  {
    name: 'History',
    slug: 'history',
    icon: 'Clock',
    description: 'Historical events and biographies'
  }
];

async function seed() {
  try {
    console.log('🌱 Starting database seeding...');

    // Connect to MongoDB
    await connectDB();

    // Create admin user
    const existingAdmin = await Admin.findOne({ email: ADMIN_EMAIL });
    
    if (!existingAdmin) {
      const hashedPassword = await hashPassword(ADMIN_PASSWORD);
      await Admin.create({
        email: ADMIN_EMAIL,
        password: hashedPassword,
        name: 'VGT Admin',
        role: 'super_admin'
      });
      console.log('✅ Admin user created');
      console.log(`   Email: ${ADMIN_EMAIL}`);
      console.log(`   Password: ${ADMIN_PASSWORD}`);
    } else {
      console.log('ℹ️  Admin user already exists');
    }

    // Create categories
    for (const category of defaultCategories) {
      const existingCategory = await Category.findOne({ slug: category.slug });
      
      if (!existingCategory) {
        await Category.create(category);
        console.log(`✅ Category created: ${category.name}`);
      } else {
        console.log(`ℹ️  Category already exists: ${category.name}`);
      }
    }

    console.log('🎉 Database seeding completed successfully!');
    process.exit(0);
  } catch (error) {
    console.error('❌ Error seeding database:', error);
    process.exit(1);
  }
}

seed();
