import mongoose, { Schema, Model } from 'mongoose';
import { IOrder } from '../types';

const OrderSchema = new Schema<IOrder>(
  {
    orderId: {
      type: String,
      required: [true, 'Order ID is required'],
      unique: true,
      trim: true
    },
    bookId: {
      type: String,
      required: [true, 'Book ID is required']
    },
    customerName: {
      type: String,
      required: [true, 'Customer name is required'],
      trim: true,
      maxlength: [100, 'Customer name cannot exceed 100 characters']
    },
    customerEmail: {
      type: String,
      required: [true, 'Customer email is required'],
      trim: true,
      lowercase: true,
      match: [/^\S+@\S+\.\S+$/, 'Please provide a valid email address']
    },
    customerPhone: {
      type: String,
      required: [true, 'Customer phone is required'],
      trim: true
    },
    customerAddress: {
      type: String,
      required: [true, 'Customer address is required'],
      trim: true
    },
    price: {
      type: Number,
      required: [true, 'Price is required'],
      min: [0, 'Price cannot be negative']
    },
    paymentScreenshot: {
      type: String,
      required: [true, 'Payment screenshot is required']
    },
    status: {
      type: String,
      enum: ['pending', 'verified', 'dispatched', 'delivered', 'cancelled'],
      default: 'pending'
    },
    trackingNumber: {
      type: String,
      trim: true
    },
    notes: {
      type: String,
      trim: true
    }
  },
  {
    timestamps: true
  }
);

// Create indexes
OrderSchema.index({ orderId: 1 });
OrderSchema.index({ customerEmail: 1 });
OrderSchema.index({ status: 1 });
OrderSchema.index({ createdAt: -1 });

const Order: Model<IOrder> = mongoose.models.Order || mongoose.model<IOrder>('Order', OrderSchema);

export default Order;
