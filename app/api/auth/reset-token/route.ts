// app/api/auth/reset-token/route.ts
import { NextRequest, NextResponse } from "next/server";
import jwt from "jsonwebtoken";

import User from "@/models/User";
import connectDB from "@/lib/db";

const SECRET = process.env.JWT_TOKEN || "";

export async function POST(req: NextRequest) {
  try {
    await connectDB();

    const token = req.cookies.get("token")?.value;

    if (!token) {
      return NextResponse.json({ message: "Unauthorized" }, { status: 401 });
    }

    let decoded: { userId: string; email?: string; isAdmin?: boolean };

    try {
      decoded = jwt.verify(token, SECRET) as { userId: string };
    } catch {
      return NextResponse.json({ message: "Invalid token" }, { status: 401 });
    }

    const user = await User.findById(decoded.userId);

    if (!user) {
      return NextResponse.json({ message: "User not found" }, { status: 404 });
    }

    const newToken = jwt.sign(
      { userId: user._id, email: user.email, isAdmin: user.isAdmin },
      SECRET,
      { expiresIn: "1d" },
    );

    const res = NextResponse.json({
      message: "Token reset successful",
      token: newToken,
    });

    res.cookies.set("token", newToken, {
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      path: "/",
      maxAge: 60 * 60 * 24,
    });

    return res;
  } catch (err) {
    console.error("Reset token error:", err);

    return NextResponse.json(
      { message: "Failed to reset token" },
      { status: 500 },
    );
  }
}
