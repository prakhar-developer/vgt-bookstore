export interface IBook {
  _id: string;
  title: string;
  author: string;
  description: string;
  price: number;
  category: string;
  coverImage: string;
  language: string;
  pages: number;
  publisher: string;
  isbn?: string;
  featured: boolean;
  inStock: boolean;
  createdAt: Date;
  updatedAt: Date;
}

export interface ICategory {
  _id: string;
  name: string;
  slug: string;
  icon: string;
  description?: string;
  createdAt: Date;
  updatedAt: Date;
}

export interface IOrder {
  _id: string;
  orderId: string;
  bookId: string;
  customerName: string;
  customerEmail: string;
  customerPhone: string;
  customerAddress: string;
  price: number;
  paymentScreenshot: string;
  status: 'pending' | 'verified' | 'dispatched' | 'delivered' | 'cancelled';
  trackingNumber?: string;
  notes?: string;
  createdAt: Date;
  updatedAt: Date;
}

export interface IAdmin {
  _id: string;
  email: string;
  password: string;
  name: string;
  role: 'admin' | 'super_admin';
  createdAt: Date;
  updatedAt: Date;
}
