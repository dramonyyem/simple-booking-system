import mongoose from "mongoose";
import User from "@/models/User";

const MONGODB_URI = process.env.MONGODB_URI as string;

if (!MONGODB_URI) {
  throw new Error(
    "⚠️ Please define the MONGODB_URI environment variable inside .env.local",
  );
}

let isConnected = false;

export default async function connectDB() {
  if (isConnected) return;

  try {
    await mongoose.connect(MONGODB_URI);
    isConnected = true;
    console.log("DB connected");

    // const user = new User({
    //     username: "daramony",
    //     password: '',
    //     email: ''
    // })
    // await user.save();
  } catch (error) {
    console.log(error);
  }
}
