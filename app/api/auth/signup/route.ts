import { NextResponse } from "next/server";

import User from "@/models/User";
import connectDB from "@/lib/db";
import { hashPassword } from "@/lib/auth";

export async function POST(req: Request) {
  try {
    const { username, email, password } = await req.json();

    await connectDB();

    const hashed = await hashPassword(password);
    const user = new User({
      username: username,
      email: email,
      password: hashed,
      isAdmin: false,
    });

    await user.save();

    return NextResponse.json({ msg: "User Insert Successfully" });
  } catch (error) {
    console.log(error);
  }
}
