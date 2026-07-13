import dotenv from "dotenv";
dotenv.config();
import mongoose from "mongoose";
import User from "./models/User.model.js";

mongoose.connect(process.env.MONGO_URI).then(async () => {
  const users = await User.find().select("name email role");
  users.forEach(u => console.log(`${u.email} | role: ${u.role} | name: ${u.name}`));
  process.exit();
});
