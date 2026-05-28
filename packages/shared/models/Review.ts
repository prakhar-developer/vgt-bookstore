import mongoose, { Schema, models, model, Document } from 'mongoose';

export interface IReview extends Document {
  bookId: mongoose.Types.ObjectId;
  customerId?: mongoose.Types.ObjectId;
  customerName: string;
  rating: number;
  title?: string;
  photoUrl?: string;
  verifiedPurchase: boolean;
  approved: boolean;
  createdAt: Date;
  updatedAt: Date;
}

const reviewSchema = new Schema<IReview>(
  {
    bookId: { type: Schema.Types.ObjectId, ref: 'Book', required: true, index: true },
    customerId: { type: Schema.Types.ObjectId, ref: 'User' },
    customerName: { type: String, required: true },
    rating: { type: Number, required: true, min: 1, max: 5 },
    title: { type: String, required: true, trim: true },
    photoUrl: { type: String, trim: true },
    verifiedPurchase: { type: Boolean, default: false },
    approved: { type: Boolean, default: true, index: true },
  },
  { timestamps: true }
);

reviewSchema.index({ bookId: 1, approved: 1, createdAt: -1 });

export default models.Review || model<IReview>('Review', reviewSchema);