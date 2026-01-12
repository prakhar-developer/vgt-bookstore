# 📚 VGT Bookstore - Complete E-commerce Platform

A complete, production-ready bookstore platform built with Next.js 14, MongoDB, and TypeScript. This monorepo includes a customer-facing e-commerce site and an admin dashboard for managing books, orders, and categories.

## 🎯 Features

### Customer E-commerce Site (vgt-ecomm)
- 🏠 **Home Page**: Hero section, featured categories, featured books, and trust badges
- 📖 **Browse Books**: Advanced filtering by category, price range, search, and sorting
- 📝 **Book Details**: Comprehensive book information with metadata
- 💳 **QR Payment Checkout**: Secure checkout with UPI QR code payment
- 📸 **Payment Screenshot Upload**: Cloudinary integration for payment proof
- ✉️ **Email Notifications**: Order confirmation emails via Resend
- 📱 **Responsive Design**: Mobile-first design that works on all devices

### Admin Dashboard (admin-dash)
- 🔐 **Secure Login**: JWT-based authentication
- 📊 **Dashboard**: Statistics and recent orders overview
- 📚 **Books Management**: Full CRUD operations with image upload
- 📦 **Orders Management**: View, filter, and update order status
- 🏷️ **Categories Management**: Create, edit, and delete categories
- 🎨 **Dark Sidebar**: Professional admin interface

## 🛠️ Tech Stack

- **Frontend**: Next.js 14 (App Router), React 18, TypeScript
- **Styling**: Tailwind CSS, Radix UI components
- **Backend**: Next.js API Routes (Serverless)
- **Database**: MongoDB with Mongoose ODM
- **Authentication**: JWT + bcryptjs
- **State Management**: Zustand with persistence
- **File Upload**: Cloudinary
- **Email**: Resend
- **HTTP Client**: Axios

## 📁 Project Structure

```
vgt-bookstore/
├── packages/
│   ├── shared/               # Shared code across applications
│   │   ├── types/           # TypeScript interfaces
│   │   ├── models/          # Mongoose models
│   │   ├── lib/             # Utilities (MongoDB, Auth)
│   │   └── scripts/         # Database seeder
│   ├── vgt-ecomm/           # Customer e-commerce site (Port 3000)
│   │   ├── app/             # Next.js 14 app directory
│   │   ├── components/      # React components
│   │   └── lib/             # Client utilities
│   └── admin-dash/          # Admin dashboard (Port 3001)
│       ├── app/             # Next.js 14 app directory
│       ├── components/      # React components
│       └── lib/             # Client utilities & store
├── package.json             # Root package with workspaces
├── README.md                # This file
├── DEPLOYMENT.md            # Deployment guide
└── API_DOCUMENTATION.md     # API endpoints documentation
```

## 🚀 Getting Started

### Prerequisites

- Node.js 18+ and npm
- MongoDB database (local or MongoDB Atlas)
- Cloudinary account (for image uploads)
- Resend account (for emails)

### Installation

1. **Clone the repository**
   ```bash
   git clone https://github.com/prakhar-developer/vgt-bookstore.git
   cd vgt-bookstore
   ```

2. **Install dependencies**
   ```bash
   npm install
   ```

3. **Setup environment variables**

   For **vgt-ecomm** (packages/vgt-ecomm/.env):
   ```env
   MONGODB_URI=your_mongodb_connection_string
   NEXT_PUBLIC_CLOUDINARY_CLOUD_NAME=your_cloudinary_cloud_name
   NEXT_PUBLIC_CLOUDINARY_UPLOAD_PRESET=your_cloudinary_upload_preset
   RESEND_API_KEY=your_resend_api_key
   NEXT_PUBLIC_BASE_URL=http://localhost:3000
   ```

   For **admin-dash** (packages/admin-dash/.env):
   ```env
   MONGODB_URI=your_mongodb_connection_string
   NEXT_PUBLIC_CLOUDINARY_CLOUD_NAME=your_cloudinary_cloud_name
   NEXT_PUBLIC_CLOUDINARY_UPLOAD_PRESET=your_cloudinary_upload_preset
   JWT_SECRET=your_jwt_secret_key_change_in_production
   ADMIN_EMAIL=admin.vgt@gmail.com
   ADMIN_PASSWORD=Admin@12345
   NEXT_PUBLIC_BASE_URL=http://localhost:3001
   ```

4. **Seed the database**
   ```bash
   npm run seed
   ```

   This will create:
   - Default admin user (admin.vgt@gmail.com / Admin@12345)
   - Default categories (Fiction, Non-Fiction, Science & Technology, etc.)

5. **Run the applications**

   Start the e-commerce site:
   ```bash
   npm run dev:ecomm
   ```
   Open [http://localhost:3000](http://localhost:3000)

   Start the admin dashboard (in a new terminal):
   ```bash
   npm run dev:admin
   ```
   Open [http://localhost:3001](http://localhost:3001)

## 🔑 Default Credentials

**Admin Dashboard:**
- Email: `admin.vgt@gmail.com`
- Password: `Admin@12345`

## 🎨 Design System

**Color Palette:**
- Primary: #636B2F (Olive Green)
- Dark: #3D4127
- Surface: #BAC095
- Highlight: #D4DE95
- Background: #FFFFFF / #FAFAFA

**Typography:**
- Font Family: Inter
- Design Rule: 80% neutral colors + 20% brand colors

## 📦 Available Scripts

```bash
# Development
npm run dev:ecomm       # Start e-commerce site (port 3000)
npm run dev:admin       # Start admin dashboard (port 3001)

# Build
npm run build:ecomm     # Build e-commerce site
npm run build:admin     # Build admin dashboard

# Database
npm run seed            # Seed database with initial data
```

## 🔒 Security Features

- JWT token authentication (7-day expiry)
- Password hashing with bcrypt (10 rounds)
- Protected admin API routes with token verification
- Input validation on all forms
- MongoDB connection string in environment variables
- Secure file upload to Cloudinary

## 📝 API Endpoints

### Public APIs (E-commerce)
- `GET /api/books` - Get all books with filters
- `GET /api/books/[id]` - Get single book
- `GET /api/categories` - Get all categories
- `POST /api/orders` - Create new order

### Protected Admin APIs
- `POST /api/auth/login` - Admin login
- `GET /api/admin/books` - Get all books
- `POST /api/admin/books` - Create book
- `PUT /api/admin/books/[id]` - Update book
- `DELETE /api/admin/books/[id]` - Delete book
- `GET /api/admin/orders` - Get all orders
- `PATCH /api/admin/orders/[id]` - Update order status
- `GET /api/admin/categories` - Get all categories
- `POST /api/admin/categories` - Create category
- `PUT /api/admin/categories/[id]` - Update category
- `DELETE /api/admin/categories/[id]` - Delete category

See [API_DOCUMENTATION.md](./API_DOCUMENTATION.md) for detailed API documentation.

## 🚀 Deployment

See [DEPLOYMENT.md](./DEPLOYMENT.md) for detailed deployment instructions for Vercel.

## 🤝 Contributing

Contributions are welcome! Please feel free to submit a Pull Request.

## 📄 License

This project is licensed under the MIT License.

## 👨‍💻 Author

**VGT Bookstore Team**

---

**Built with ❤️ using Next.js 14, MongoDB, and TypeScript**
