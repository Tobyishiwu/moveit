import dotenv from "dotenv";
dotenv.config();
import mongoose from "mongoose";
import Order from "./models/Order.model.js";

mongoose.connect(process.env.MONGO_URI).then(async () => {
  const result = await Order.updateMany(
    { weightKg: { $exists: false } },
    { $set: { weightKg: 1 } }
  );
  console.log(`Matched: ${result.matchedCount}, Modified: ${result.modifiedCount}`);
  process.exit();
});
