import { NextRequest, NextResponse } from "next/server";
import jwt from "jsonwebtoken";
import bcrypt from "bcryptjs";

import User from "@/models/User";
import connectDB from "@/lib/db";

const SECRET = process.env.JWT_TOKEN || "";

type Payload = {
  email: string;
  isAdmin: boolean;
  userId: string;
};

export async function GET(req: NextRequest) {
  const token = req.cookies.get("token")?.value;

  if (!token) {
    return NextResponse.rewrite(new URL("/", req.url));
  }

  try {
    const payload = jwt.verify(token, SECRET) as Payload;

    if (!payload) {
      return NextResponse.json({ error: "No token found" }, { status: 401 });
    }

    await connectDB();
    const user = await User.findById(payload.userId).select("-password");

    return NextResponse.json({ user, payload, token });
  } catch (error) {
    console.error("GET /api/users error:", error);

    return NextResponse.json(
      { error: "Invalid or expired token" },
      { status: 401 },
    );
  }
}

export async function PATCH(req: Request) {
  try {
    await connectDB();

    const { userId, password, username, ...updates } = await req.json();

    if (!userId) {
      return NextResponse.json(
        { error: "User ID is required" },
        { status: 400 },
      );
    }

    // Check for duplicate username
    if (username) {
      const existingUser = await User.findOne({
        username,
        _id: { $ne: userId },
      });

      if (existingUser) {
        return NextResponse.json(
          { error: "Username already exists" },
          { status: 409 },
        );
      }
      updates.username = username;
    }

    // Hash password if provided
    if (password && password.trim() !== "") {
      const salt = await bcrypt.genSalt(10);
      const hashedPassword = await bcrypt.hash(password, salt);

      updates.password = hashedPassword;
    }

    const user = await User.findByIdAndUpdate(
      userId,
      { $set: updates },
      { new: true },
    ).select("-password");

    if (!user) {
      return NextResponse.json({ error: "User not found" }, { status: 404 });
    }

    return NextResponse.json({ user }, { status: 200 });
  } catch (err: any) {
    console.error("PATCH /api/users error:", err);

    // Handle MongoDB duplicate key error
    if (err.code === 11000) {
      return NextResponse.json(
        { error: "Duplicate field value detected" },
        { status: 409 },
      );
    }

    return NextResponse.json(
      { error: "Failed to update user" },
      { status: 500 },
    );
  }
}
