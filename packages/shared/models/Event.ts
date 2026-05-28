import mongoose, { Schema, Model } from 'mongoose';
import { IEvent } from '../types';

const EventSchema = new Schema<IEvent>(
  {
    type: {
      type: String,
      enum: ['page_view', 'view_book', 'add_to_cart', 'remove_from_cart', 'begin_checkout', 'purchase'],
      required: true,
      index: true,
    },
    bookId: {
      type: String,
      ref: 'Book',
      index: true,
    },
    customerId: {
      type: String,
      ref: 'User',
      index: true,
    },
    sessionId: {
      type: String,
      index: true,
    },
    quantity: {
      type: Number,
      default: 1,
    },
    metadata: {
      type: Schema.Types.Mixed,
      default: {},
    },
  },
  { timestamps: true }
);

EventSchema.index({ type: 1, createdAt: -1 });

const Event: Model<IEvent> = mongoose.models.Event || mongoose.model<IEvent>('Event', EventSchema);

export default Event;