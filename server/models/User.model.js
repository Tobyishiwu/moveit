import mongoose from "mongoose";

const userSchema = new mongoose.Schema(
  {
    name: { type: String, required: true, trim: true },
    email: { type: String, required: true, unique: true, lowercase: true, trim: true },
    password: { type: String, required: true },
    phone: { type: String, required: true },
    role: {
      type: String,
      enum: ["customer", "rider", "admin"],
      default: "customer",
    },
    avatar: { type: String, default: "" },

    // Rider-specific fields (null for customers/admins)
    vehicleType: { type: String, enum: ["bike", "car", "van", null], default: null },
    licenseNumber: { type: String, default: null },
    isAvailable: { type: Boolean, default: false },
    isVerified: { type: Boolean, default: false },
    rating: { type: Number, default: 5.0 },
    currentLocation: {
      type: { type: String, enum: ["Point"], default: "Point" },
      coordinates: { type: [Number], default: [0, 0] }, // [lng, lat]
    },
  },
  { timestamps: true }
);

userSchema.index({ currentLocation: "2dsphere" });

const User = mongoose.model("User", userSchema);
export default User;
