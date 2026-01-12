import mongoose, { Schema, Model } from "mongoose"
import { ICategory } from "../types"

const CategorySchema = new Schema<ICategory>(
  {
    name: {
      type: String,
      required: [true, "Category name is required"],
      trim: true,
    },
    slug: {
      type: String,
      required:  true,
      lowercase: true,
      // Remove unique from here
    },
    icon: {
      type: String,
      required: true,
    },
    description: {
      type: String,
    },
  },
  {
    timestamps:  true,
  }
)

// Define indexes separately
CategorySchema.index({ name: 1 }, { unique: true })
CategorySchema.index({ slug: 1 }, { unique: true })

const Category: Model<ICategory> =
  mongoose.models.Category || mongoose.model<ICategory>("Category", CategorySchema)

export default Category