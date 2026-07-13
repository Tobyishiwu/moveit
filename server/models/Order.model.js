import mongoose from "mongoose";

const orderSchema = new mongoose.Schema(
  {
    customer: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true },
    rider: { type: mongoose.Schema.Types.ObjectId, ref: "User", default: null },

    pickupAddress: { type: String, required: true },
    pickupLocation: {
      type: { type: String, enum: ["Point"], default: "Point" },
      coordinates: { type: [Number], required: true },
    },

    dropoffAddress: { type: String, required: true },
    dropoffLocation: {
      type: { type: String, enum: ["Point"], default: "Point" },
      coordinates: { type: [Number], required: true },
    },

    packageDescription: { type: String, required: true },
    packageSize: { type: String, enum: ["small", "medium", "large"], default: "small" },
    weightKg: { type: Number, required: true, min: 0.1 },

    fare: { type: Number, required: true },
    distanceKm: { type: Number, default: 0 },

    status: {
      type: String,
      enum: ["pending", "accepted", "picked_up", "in_transit", "delivered", "cancelled"],
      default: "pending",
    },
    statusHistory: [
      {
        status: String,
        timestamp: { type: Date, default: Date.now },
      },
    ],

    paymentMethod: { type: String, enum: ["cash", "card", "wallet"], default: "cash" },
    paymentStatus: { type: String, enum: ["pending", "paid"], default: "pending" },
  },
  { timestamps: true }
);

orderSchema.index({ pickupLocation: "2dsphere" });
orderSchema.index({ dropoffLocation: "2dsphere" });

const Order = mongoose.model("Order", orderSchema);
export default Order;
