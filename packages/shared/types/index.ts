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
  sku?: string;
  quantity?: number;
  createdAt: Date;
  updatedAt: Date;
}

export interface IOrderItem {
  bookId: string;
  title: string;
  author: string;
  coverImage: string;
  category: string;
  price: number;
  quantity: number;
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
  customerId?: string;
  items: IOrderItem[];
  customerName: string;
  customerEmail: string;
  customerPhone: string;
  customerAddress: string;
  price: number;
  subtotal: number;
  shippingFee: number;
  totalAmount: number;
  paymentMethod: 'qr' | 'stripe';
  paymentProvider: 'manual' | 'stripe' | 'qr';
  paymentScreenshot?: string;
  paymentReference?: string;
  paymentStatus: 'pending' | 'paid' | 'failed';
  status: 'pending' | 'verified' | 'dispatched' | 'delivered' | 'cancelled';
  trackingNumber?: string;
  shippingStatus?: 'pending' | 'packed' | 'shipped' | 'delivered' | 'returned';
  refundStatus?: 'none' | 'requested' | 'approved' | 'rejected' | 'processed';
  notes?: string;
  createdAt: Date;
  updatedAt: Date;
}

export interface IEvent {
  _id: string;
  type: 'page_view' | 'view_book' | 'add_to_cart' | 'remove_from_cart' | 'begin_checkout' | 'purchase';
  bookId?: string;
  customerId?: string;
  sessionId?: string;
  quantity?: number;
  metadata?: Record<string, any>;
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

export interface IUser {
  _id: string;
  name: string;
  email: string;
  password?: string;
  phone?: string;
  address?: string;
  status: 'guest' | 'registered';
  orderCount: number;
  totalSpent: number;
  preferredCategories: string[];
  favoriteAuthors: string[];
  lastOrderAt?: Date;
  viewedBookIds?: string[];
  cartBookIds?: string[];
  createdAt: Date;
  updatedAt: Date;
}
