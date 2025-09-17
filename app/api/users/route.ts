import { NextResponse } from "next/server";

import connectDB from "@/lib/db";
import User from "@/models/User";

const SECRET = process.env.JWT_TOKEN || "";

export async function GET() {
  try {
    await connectDB();
    const users = await User.find({});

    return NextResponse.json(users);
  } catch (error) {}
}

export async function POST(req: Request) {
  try {
    const { username, password, email } = await req.json();

    return NextResponse.json({ username, password, email });
  } catch (error) {}
}

export async function PATCH(req: Request) {
  try {
    await connectDB();

    const { userId, email, firstName, lastName, title, address, phone } =
      await req.json();

    if (!userId) {
      return NextResponse.json(
        { error: "User ID is required" },
        { status: 400 },
      );
    }

    const user = await User.findById(userId);

    if (!user) {
      return NextResponse.json({ error: "User not found" }, { status: 404 });
    }

    if (email !== undefined) user.email = email;
    if (firstName !== undefined) user.firstName = firstName;
    if (lastName !== undefined) user.lastName = lastName;
    if (title !== undefined) user.title = title;
    if (address !== undefined) user.address = address;
    if (phone !== undefined) user.phone = phone;

    await user.save();

    const { password: _, ...userWithoutPassword } = user.toObject();

    return NextResponse.json(userWithoutPassword, { status: 200 });
  } catch (error) {
    console.error("PATCH /users error:", error);

    return NextResponse.json(
      { error: "Failed to update user" },
      { status: 500 },
    );
  }
}
