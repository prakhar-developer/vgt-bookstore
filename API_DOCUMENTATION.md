# 📖 API Documentation - VGT Bookstore

Complete API reference for the VGT Bookstore platform.

## 🌐 Base URLs

- **E-commerce Site**: `http://localhost:3000` (dev) / `https://your-ecomm-site.vercel.app` (prod)
- **Admin Dashboard**: `http://localhost:3001` (dev) / `https://your-admin-dash.vercel.app` (prod)

## 📋 Response Format

All API responses follow this consistent format:

**Success Response:**
```json
{
  "success": true,
  "data": { ... }
}
```

**Error Response:**
```json
{
  "success": false,
  "error": "Error message"
}
```

## 🔓 Public APIs (E-commerce)

### 1. Get All Books

Retrieve a list of books with optional filtering and pagination.

**Endpoint:** `GET /api/books`

**Query Parameters:**
- `category` (string, optional): Filter by category slug
- `search` (string, optional): Search in title and author
- `featured` (boolean, optional): Filter featured books
- `minPrice` (number, optional): Minimum price filter
- `maxPrice` (number, optional): Maximum price filter
- `inStock` (boolean, optional): Filter in-stock books only
- `sort` (string, optional): Sort field (default: `-createdAt`)
  - Options: `price`, `-price`, `title`, `-title`, `createdAt`, `-createdAt`
- `page` (number, optional): Page number (default: 1)
- `limit` (number, optional): Items per page (default: 12)

**Example Request:**
```bash
curl -X GET "http://localhost:3000/api/books?category=fiction&minPrice=100&maxPrice=500&page=1&limit=12"
```

**Example Response:**
```json
{
  "success": true,
  "data": [
    {
      "_id": "60d5ec49f1b2c8b1f8e4e1a1",
      "title": "The Great Gatsby",
      "author": "F. Scott Fitzgerald",
      "description": "A classic American novel...",
      "price": 299,
      "category": "fiction",
      "coverImage": "https://res.cloudinary.com/...",
      "language": "English",
      "pages": 180,
      "publisher": "Scribner",
      "isbn": "9780743273565",
      "featured": true,
      "inStock": true,
      "createdAt": "2023-06-25T10:30:00.000Z",
      "updatedAt": "2023-06-25T10:30:00.000Z"
    }
  ],
  "pagination": {
    "page": 1,
    "limit": 12,
    "total": 45,
    "pages": 4
  }
}
```

---

### 2. Get Single Book

Retrieve details of a specific book.

**Endpoint:** `GET /api/books/:id`

**Path Parameters:**
- `id` (string, required): Book ID

**Example Request:**
```bash
curl -X GET "http://localhost:3000/api/books/60d5ec49f1b2c8b1f8e4e1a1"
```

**Example Response:**
```json
{
  "success": true,
  "data": {
    "_id": "60d5ec49f1b2c8b1f8e4e1a1",
    "title": "The Great Gatsby",
    "author": "F. Scott Fitzgerald",
    "description": "A classic American novel set in the Jazz Age...",
    "price": 299,
    "category": "fiction",
    "coverImage": "https://res.cloudinary.com/...",
    "language": "English",
    "pages": 180,
    "publisher": "Scribner",
    "isbn": "9780743273565",
    "featured": true,
    "inStock": true,
    "createdAt": "2023-06-25T10:30:00.000Z",
    "updatedAt": "2023-06-25T10:30:00.000Z"
  }
}
```

---

### 3. Get All Categories

Retrieve all book categories.

**Endpoint:** `GET /api/categories`

**Example Request:**
```bash
curl -X GET "http://localhost:3000/api/categories"
```

**Example Response:**
```json
{
  "success": true,
  "data": [
    {
      "_id": "60d5ec49f1b2c8b1f8e4e1a2",
      "name": "Fiction",
      "slug": "fiction",
      "icon": "BookOpen",
      "description": "Explore fictional stories and novels",
      "createdAt": "2023-06-25T10:30:00.000Z",
      "updatedAt": "2023-06-25T10:30:00.000Z"
    },
    {
      "_id": "60d5ec49f1b2c8b1f8e4e1a3",
      "name": "Non-Fiction",
      "slug": "non-fiction",
      "icon": "Book",
      "description": "Real stories and educational content",
      "createdAt": "2023-06-25T10:30:00.000Z",
      "updatedAt": "2023-06-25T10:30:00.000Z"
    }
  ]
}
```

---

### 4. Create Order

Create a new order with payment screenshot.

**Endpoint:** `POST /api/orders`

**Headers:**
- `Content-Type: application/json`

**Request Body:**
```json
{
  "bookId": "60d5ec49f1b2c8b1f8e4e1a1",
  "customerName": "John Doe",
  "customerEmail": "john@example.com",
  "customerPhone": "+91 9876543210",
  "customerAddress": "123 Main St, New Delhi, India 110001",
  "paymentScreenshot": "https://res.cloudinary.com/..."
}
```

**Example Request:**
```bash
curl -X POST "http://localhost:3000/api/orders" \
  -H "Content-Type: application/json" \
  -d '{
    "bookId": "60d5ec49f1b2c8b1f8e4e1a1",
    "customerName": "John Doe",
    "customerEmail": "john@example.com",
    "customerPhone": "+91 9876543210",
    "customerAddress": "123 Main St, New Delhi, India 110001",
    "paymentScreenshot": "https://res.cloudinary.com/..."
  }'
```

**Example Response:**
```json
{
  "success": true,
  "data": {
    "orderId": "VGT-L8K9J7H6F5",
    "message": "Order placed successfully"
  }
}
```

**Notes:**
- Payment screenshot must be uploaded to Cloudinary first
- An email confirmation is sent automatically
- Order status is set to "pending" by default

---

## 🔒 Protected Admin APIs

All admin APIs require authentication. Include the JWT token in the Authorization header:

```
Authorization: Bearer your_jwt_token
```

### 5. Admin Login

Authenticate admin user and receive JWT token.

**Endpoint:** `POST /api/auth/login`

**Headers:**
- `Content-Type: application/json`

**Request Body:**
```json
{
  "email": "admin.vgt@gmail.com",
  "password": "Admin@12345"
}
```

**Example Request:**
```bash
curl -X POST "http://localhost:3001/api/auth/login" \
  -H "Content-Type: application/json" \
  -d '{
    "email": "admin.vgt@gmail.com",
    "password": "Admin@12345"
  }'
```

**Example Response:**
```json
{
  "success": true,
  "data": {
    "admin": {
      "_id": "60d5ec49f1b2c8b1f8e4e1a4",
      "email": "admin.vgt@gmail.com",
      "name": "VGT Admin",
      "role": "super_admin"
    },
    "token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9..."
  }
}
```

**Notes:**
- Token expires in 7 days
- Store token securely in client

---

### 6. Get All Books (Admin)

Retrieve all books (admin view).

**Endpoint:** `GET /api/admin/books`

**Headers:**
- `Authorization: Bearer your_jwt_token`

**Example Request:**
```bash
curl -X GET "http://localhost:3001/api/admin/books" \
  -H "Authorization: Bearer your_jwt_token"
```

**Example Response:**
```json
{
  "success": true,
  "data": [
    {
      "_id": "60d5ec49f1b2c8b1f8e4e1a1",
      "title": "The Great Gatsby",
      "author": "F. Scott Fitzgerald",
      "description": "A classic American novel...",
      "price": 299,
      "category": "fiction",
      "coverImage": "https://res.cloudinary.com/...",
      "language": "English",
      "pages": 180,
      "publisher": "Scribner",
      "isbn": "9780743273565",
      "featured": true,
      "inStock": true,
      "createdAt": "2023-06-25T10:30:00.000Z",
      "updatedAt": "2023-06-25T10:30:00.000Z"
    }
  ]
}
```

---

### 7. Create Book

Create a new book.

**Endpoint:** `POST /api/admin/books`

**Headers:**
- `Authorization: Bearer your_jwt_token`
- `Content-Type: application/json`

**Request Body:**
```json
{
  "title": "1984",
  "author": "George Orwell",
  "description": "A dystopian social science fiction novel...",
  "price": 349,
  "category": "fiction",
  "coverImage": "https://res.cloudinary.com/...",
  "language": "English",
  "pages": 328,
  "publisher": "Penguin Books",
  "isbn": "9780451524935",
  "featured": true,
  "inStock": true
}
```

**Example Request:**
```bash
curl -X POST "http://localhost:3001/api/admin/books" \
  -H "Authorization: Bearer your_jwt_token" \
  -H "Content-Type: application/json" \
  -d '{
    "title": "1984",
    "author": "George Orwell",
    "description": "A dystopian social science fiction novel...",
    "price": 349,
    "category": "fiction",
    "coverImage": "https://res.cloudinary.com/...",
    "language": "English",
    "pages": 328,
    "publisher": "Penguin Books",
    "isbn": "9780451524935",
    "featured": true,
    "inStock": true
  }'
```

**Example Response:**
```json
{
  "success": true,
  "data": {
    "_id": "60d5ec49f1b2c8b1f8e4e1a5",
    "title": "1984",
    "author": "George Orwell",
    // ... rest of book data
  }
}
```

---

### 8. Update Book

Update an existing book.

**Endpoint:** `PUT /api/admin/books/:id`

**Headers:**
- `Authorization: Bearer your_jwt_token`
- `Content-Type: application/json`

**Path Parameters:**
- `id` (string, required): Book ID

**Request Body:** (same as create book, all fields optional)

**Example Request:**
```bash
curl -X PUT "http://localhost:3001/api/admin/books/60d5ec49f1b2c8b1f8e4e1a1" \
  -H "Authorization: Bearer your_jwt_token" \
  -H "Content-Type: application/json" \
  -d '{
    "price": 399,
    "inStock": false
  }'
```

**Example Response:**
```json
{
  "success": true,
  "data": {
    "_id": "60d5ec49f1b2c8b1f8e4e1a1",
    "title": "The Great Gatsby",
    "price": 399,
    "inStock": false,
    // ... rest of updated book data
  }
}
```

---

### 9. Delete Book

Delete a book.

**Endpoint:** `DELETE /api/admin/books/:id`

**Headers:**
- `Authorization: Bearer your_jwt_token`

**Path Parameters:**
- `id` (string, required): Book ID

**Example Request:**
```bash
curl -X DELETE "http://localhost:3001/api/admin/books/60d5ec49f1b2c8b1f8e4e1a1" \
  -H "Authorization: Bearer your_jwt_token"
```

**Example Response:**
```json
{
  "success": true,
  "message": "Book deleted successfully"
}
```

---

### 10. Get All Orders (Admin)

Retrieve all orders with populated book details.

**Endpoint:** `GET /api/admin/orders`

**Headers:**
- `Authorization: Bearer your_jwt_token`

**Example Request:**
```bash
curl -X GET "http://localhost:3001/api/admin/orders" \
  -H "Authorization: Bearer your_jwt_token"
```

**Example Response:**
```json
{
  "success": true,
  "data": [
    {
      "_id": "60d5ec49f1b2c8b1f8e4e1a6",
      "orderId": "VGT-L8K9J7H6F5",
      "bookId": "60d5ec49f1b2c8b1f8e4e1a1",
      "customerName": "John Doe",
      "customerEmail": "john@example.com",
      "customerPhone": "+91 9876543210",
      "customerAddress": "123 Main St, New Delhi, India 110001",
      "price": 299,
      "paymentScreenshot": "https://res.cloudinary.com/...",
      "status": "pending",
      "trackingNumber": null,
      "notes": null,
      "book": {
        "_id": "60d5ec49f1b2c8b1f8e4e1a1",
        "title": "The Great Gatsby",
        "coverImage": "https://res.cloudinary.com/..."
      },
      "createdAt": "2023-06-25T10:30:00.000Z",
      "updatedAt": "2023-06-25T10:30:00.000Z"
    }
  ]
}
```

---

### 11. Update Order Status

Update order status, tracking number, and notes.

**Endpoint:** `PATCH /api/admin/orders/:id`

**Headers:**
- `Authorization: Bearer your_jwt_token`
- `Content-Type: application/json`

**Path Parameters:**
- `id` (string, required): Order ID

**Request Body:**
```json
{
  "status": "verified",
  "trackingNumber": "TRK123456789",
  "notes": "Payment verified, preparing for dispatch"
}
```

**Status Options:**
- `pending` - Order received, awaiting verification
- `verified` - Payment verified
- `dispatched` - Order shipped
- `delivered` - Order delivered
- `cancelled` - Order cancelled

**Example Request:**
```bash
curl -X PATCH "http://localhost:3001/api/admin/orders/60d5ec49f1b2c8b1f8e4e1a6" \
  -H "Authorization: Bearer your_jwt_token" \
  -H "Content-Type: application/json" \
  -d '{
    "status": "dispatched",
    "trackingNumber": "TRK123456789"
  }'
```

**Example Response:**
```json
{
  "success": true,
  "data": {
    "_id": "60d5ec49f1b2c8b1f8e4e1a6",
    "orderId": "VGT-L8K9J7H6F5",
    "status": "dispatched",
    "trackingNumber": "TRK123456789",
    // ... rest of order data
  }
}
```

---

### 12. Get All Categories (Admin)

Retrieve all categories (admin view).

**Endpoint:** `GET /api/admin/categories`

**Headers:**
- `Authorization: Bearer your_jwt_token`

**Example Request:**
```bash
curl -X GET "http://localhost:3001/api/admin/categories" \
  -H "Authorization: Bearer your_jwt_token"
```

**Example Response:** (same as public categories endpoint)

---

### 13. Create Category

Create a new category.

**Endpoint:** `POST /api/admin/categories`

**Headers:**
- `Authorization: Bearer your_jwt_token`
- `Content-Type: application/json`

**Request Body:**
```json
{
  "name": "Mystery",
  "slug": "mystery",
  "icon": "Search",
  "description": "Mystery and thriller novels"
}
```

**Example Request:**
```bash
curl -X POST "http://localhost:3001/api/admin/categories" \
  -H "Authorization: Bearer your_jwt_token" \
  -H "Content-Type: application/json" \
  -d '{
    "name": "Mystery",
    "slug": "mystery",
    "icon": "Search",
    "description": "Mystery and thriller novels"
  }'
```

**Example Response:**
```json
{
  "success": true,
  "data": {
    "_id": "60d5ec49f1b2c8b1f8e4e1a7",
    "name": "Mystery",
    "slug": "mystery",
    "icon": "Search",
    "description": "Mystery and thriller novels",
    "createdAt": "2023-06-25T10:30:00.000Z",
    "updatedAt": "2023-06-25T10:30:00.000Z"
  }
}
```

---

### 14. Update Category

Update an existing category.

**Endpoint:** `PUT /api/admin/categories/:id`

**Headers:**
- `Authorization: Bearer your_jwt_token`
- `Content-Type: application/json`

**Path Parameters:**
- `id` (string, required): Category ID

**Request Body:** (same as create category, all fields optional)

**Example Request:**
```bash
curl -X PUT "http://localhost:3001/api/admin/categories/60d5ec49f1b2c8b1f8e4e1a2" \
  -H "Authorization: Bearer your_jwt_token" \
  -H "Content-Type: application/json" \
  -d '{
    "description": "Updated description"
  }'
```

**Example Response:**
```json
{
  "success": true,
  "data": {
    "_id": "60d5ec49f1b2c8b1f8e4e1a2",
    "name": "Fiction",
    "slug": "fiction",
    "icon": "BookOpen",
    "description": "Updated description",
    "createdAt": "2023-06-25T10:30:00.000Z",
    "updatedAt": "2023-06-25T11:30:00.000Z"
  }
}
```

---

### 15. Delete Category

Delete a category.

**Endpoint:** `DELETE /api/admin/categories/:id`

**Headers:**
- `Authorization: Bearer your_jwt_token`

**Path Parameters:**
- `id` (string, required): Category ID

**Example Request:**
```bash
curl -X DELETE "http://localhost:3001/api/admin/categories/60d5ec49f1b2c8b1f8e4e1a2" \
  -H "Authorization: Bearer your_jwt_token"
```

**Example Response:**
```json
{
  "success": true,
  "message": "Category deleted successfully"
}
```

---

## ❌ Error Responses

### 400 Bad Request
```json
{
  "success": false,
  "error": "All fields are required"
}
```

### 401 Unauthorized
```json
{
  "success": false,
  "error": "Unauthorized"
}
```

### 404 Not Found
```json
{
  "success": false,
  "error": "Book not found"
}
```

### 500 Internal Server Error
```json
{
  "success": false,
  "error": "Failed to fetch books"
}
```

---

## 🔐 Authentication Flow

1. **Login**: POST `/api/auth/login` with credentials
2. **Receive Token**: Store the JWT token securely
3. **Make Requests**: Include token in `Authorization: Bearer {token}` header
4. **Token Expiry**: Token expires after 7 days, login again

---

## 📝 Notes

- All timestamps are in ISO 8601 format
- All prices are in Indian Rupees (₹)
- Images must be uploaded to Cloudinary before creating/updating records
- JWT tokens are required for all admin endpoints
- Rate limiting may apply in production

---

**For Postman Collection:** See `VGT-Bookstore.postman_collection.json` in the repository root.
