import dotenv from "dotenv";
dotenv.config();
import mongoose from "mongoose";
import User from "./models/User.model.js";

const TARGET_EMAIL = "test@moveit.com"; // change this if needed

mongoose.connect(process.env.MONGO_URI).then(async () => {
  const user = await User.findOneAndUpdate(
    { email: TARGET_EMAIL },
    { role: "admin" },
    { new: true }
  );
  if (!user) {
    console.log("No user found with that email");
  } else {
    console.log(`Success: ${user.email} is now role: ${user.role}`);
  }
  process.exit();
});
