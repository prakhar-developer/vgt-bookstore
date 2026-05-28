import mongoose, { Schema, Model } from "mongoose"
import { IOrder } from "../types"

const OrderSchema = new Schema<IOrder>(
  {
    orderId: {
      type: String,
      required: true,
      // Remove unique from here
    },
    bookId: {
      type: String,
      required: true,
      ref: "Book",
    },
    customerId: {
      type: String,
      ref: "User",
    },
    items: {
      type: [
        {
          bookId: { type: String, required: true, ref: 'Book' },
          title: { type: String, required: true },
          author: { type: String, required: true },
          coverImage: { type: String, required: true },
          category: { type: String, required: true },
          price: { type: Number, required: true, min: 0 },
          quantity: { type: Number, required: true, min: 1 },
        },
      ],
      default: [],
    },
    customerName: {
      type: String,
      required: [true, "Customer name is required"],
      trim: true,
    },
    customerEmail: {
      type: String,
      required: [true, "Customer email is required"],
      lowercase: true,
      trim: true,
    },
    customerPhone: {
      type: String,
      required: [true, "Customer phone is required"],
    },
    customerAddress: {
      type: String,
      required: [true, "Customer address is required"],
    },
    price: {
      type: Number,
      required: true,
      min: 0,
    },
    subtotal: {
      type: Number,
      required: true,
      min: 0,
    },
    shippingFee: {
      type: Number,
      default: 0,
      min: 0,
    },
    totalAmount: {
      type: Number,
      required: true,
      min: 0,
    },
    paymentMethod: {
      type: String,
      enum: ['qr', 'stripe'],
      default: 'qr',
    },
    paymentProvider: {
      type: String,
      enum: ['manual', 'stripe', 'qr'],
      default: 'manual',
    },
    paymentScreenshot: {
      type: String,
    },
    paymentReference: {
      type: String,
    },
    paymentStatus: {
      type: String,
      enum: ['pending', 'paid', 'failed'],
      default: 'pending',
    },
    status: {
      type: String,
      enum: ["pending", "verified", "dispatched", "delivered", "cancelled"],
      default: "pending",
    },
    trackingNumber:  {
      type: String,
    },
    shippingStatus: {
      type: String,
      enum: ['pending', 'packed', 'shipped', 'delivered', 'returned'],
      default: 'pending',
    },
    refundStatus: {
      type: String,
      enum: ['none', 'requested', 'approved', 'rejected', 'processed'],
      default: 'none',
    },
    notes: {
      type: String,
    },
  },
  {
    timestamps:  true,
  }
)

// Define index separately
OrderSchema.index({ orderId: 1 }, { unique: true })

const Order: Model<IOrder> =
  mongoose.models.Order || mongoose.model<IOrder>("Order", OrderSchema)

export default Order