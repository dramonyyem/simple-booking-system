import { NextRequest, NextResponse } from "next/server";

import User from "@/models/User";
import connectDB from "@/lib/db";
import { hashPassword } from "@/lib/auth";

export async function POST(req: NextRequest) {
  try {
    const { username, email, password } = await req.json();

    await connectDB();

    const existingUser = await User.findOne({
      $or: [{ email }, { username }],
    });

    if (existingUser) {
      if (existingUser.username === username) {
        return NextResponse.json(
          { success: false, message: "Username already exists" },
          { status: 400 },
        );
      }
      if (existingUser.email === email) {
        return NextResponse.json(
          { success: false, message: "Email already exists" },
          { status: 400 },
        );
      }
    }

    const hashed = await hashPassword(password);

    const user = new User({
      username,
      email,
      password: hashed,
      isAdmin: false,
      firstName: "",
      lastName: "",
      title: "",
      address: "",
      phone: "",
    });

    await user.save();

    return NextResponse.json(
      { success: true, message: "User created successfully" },
      { status: 201 },
    );
  } catch (error) {
    console.error("POST /api/auth/signup error:", error);

    return NextResponse.json(
      { success: false, message: "Failed to create user" },
      { status: 500 },
    );
  }
}
