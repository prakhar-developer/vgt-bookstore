import mongoose, { Schema, Model } from 'mongoose';
import { IBook } from '../types';

const BookSchema = new Schema<IBook>(
  {
    title: {
      type: String,
      required: [true, 'Title is required'],
      trim: true,
      maxlength: [200, 'Title cannot exceed 200 characters']
    },
    author: {
      type: String,
      required: [true, 'Author is required'],
      trim: true,
      maxlength: [100, 'Author name cannot exceed 100 characters']
    },
    description: {
      type: String,
      required: [true, 'Description is required'],
      trim: true
    },
    price: {
      type: Number,
      required: [true, 'Price is required'],
      min: [0, 'Price cannot be negative']
    },
    category: {
      type: String,
      required: [true, 'Category is required'],
      trim: true
    },
    coverImage: {
      type: String,
      required: [true, 'Cover image is required']
    },
    language: {
      type: String,
      required: [true, 'Language is required'],
      default: 'English'
    },
    pages: {
      type: Number,
      required: [true, 'Number of pages is required'],
      min: [1, 'Pages must be at least 1']
    },
    publisher: {
      type: String,
      required: [true, 'Publisher is required'],
      trim: true
    },
    isbn: {
      type: String,
      trim: true,
      sparse: true
    },
    featured: {
      type: Boolean,
      default: false
    },
    inStock: {
      type: Boolean,
      default: true
    }
  },
  {
    timestamps: true
  }
);

// Create indexes for better query performance
BookSchema.index({ title: 'text', author: 'text' });
BookSchema.index({ category: 1 });
BookSchema.index({ featured: 1 });
BookSchema.index({ price: 1 });

const Book: Model<IBook> = mongoose.models.Book || mongoose.model<IBook>('Book', BookSchema);

export default Book;
