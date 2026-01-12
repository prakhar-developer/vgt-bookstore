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
    paymentScreenshot: {
      type: String,
      required: [true, "Payment screenshot is required"],
    },
    status: {
      type: String,
      enum: ["pending", "verified", "dispatched", "delivered", "cancelled"],
      default: "pending",
    },
    trackingNumber:  {
      type: String,
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