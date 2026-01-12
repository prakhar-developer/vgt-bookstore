import mongoose, { Schema, Model } from "mongoose"
import { IAdmin } from "../types"

const AdminSchema = new Schema<IAdmin>(
  {
    email: {
      type: String,
      required: [true, "Email is required"],
      lowercase: true,
      trim: true,
      validate: {
        validator: function (v: string) {
          return /^[\w-\.]+@([\w-]+\.)+[\w-]{2,4}$/.test(v)
        },
        message: "Please provide a valid email address",
      },
    },
    password: {
      type: String,
      required: [true, "Password is required"],
      // REMOVE select: false OR keep it and use .select('+password') in queries
    },
    name: {
      type: String,
      required:  [true, "Name is required"],
      trim: true,
    },
    role: {
      type:  String,
      enum: ["admin", "super_admin"],
      default: "admin",
    },
  },
  {
    timestamps: true,
  }
)

// Add index separately
AdminSchema.index({ email: 1 }, { unique: true })

const Admin: Model<IAdmin> =
  mongoose.models.Admin || mongoose.model<IAdmin>("Admin", AdminSchema)

export default Admin