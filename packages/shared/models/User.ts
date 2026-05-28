import mongoose, { Schema, Model } from 'mongoose';
import { IUser } from '../types';

const UserSchema = new Schema<IUser>(
  {
    name: {
      type: String,
      required: [true, 'Name is required'],
      trim: true,
      maxlength: [100, 'Name cannot exceed 100 characters'],
    },
    email: {
      type: String,
      required: [true, 'Email is required'],
      lowercase: true,
      trim: true,
      unique: true,
      index: true,
      validate: {
        validator: function (value: string) {
          return /^[\w-.]+@([\w-]+\.)+[\w-]{2,4}$/.test(value);
        },
        message: 'Please provide a valid email address',
      },
    },
    password: {
      type: String,
      select: false,
    },
    phone: {
      type: String,
      trim: true,
    },
    address: {
      type: String,
      trim: true,
    },
    status: {
      type: String,
      enum: ['guest', 'registered'],
      default: 'guest',
    },
    orderCount: {
      type: Number,
      default: 0,
    },
    totalSpent: {
      type: Number,
      default: 0,
    },
    preferredCategories: {
      type: [String],
      default: [],
    },
    favoriteAuthors: {
      type: [String],
      default: [],
    },
    lastOrderAt: {
      type: Date,
    },
  },
  {
    timestamps: true,
  }
);

const User: Model<IUser> = mongoose.models.User || mongoose.model<IUser>('User', UserSchema);

export default User;