import mongoose from "mongoose";
import bcrypt from "bcrypt";
import User from "./models/User.js";
import dotenv from "dotenv";
dotenv.config();

mongoose.connect(process.env.MONGO_URI)
  .then(() => console.log("DB Connected"))
  .catch(err => console.log(err));

async function createOwner() {
  const hashedPassword = await bcrypt.hash("Owner@123", 10);

  const ownerExists = await User.findOne({ email: "owner@example.com" });
  if (ownerExists) {
    console.log("Owner already exists!");
    process.exit();
  }

  await User.create({
    name: "Main Owner",
    email: "owner@example.com",
    password: hashedPassword,
    role: "owner",
  });

  console.log("Owner created successfully!");
  process.exit();
}

createOwner();
