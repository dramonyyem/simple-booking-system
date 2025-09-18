import { NextResponse } from "next/server";
import mongoose from "mongoose";

import User from "@/models/User";
import connectDB from "@/lib/db";

const getIdFromRequest = (req: Request) => {
  const url = new URL(req.url);
  const segments = url.pathname.split("/");

  return segments[segments.length - 1];
};

export async function GET(req: Request) {
  try {
    const id = getIdFromRequest(req);

    if (!mongoose.Types.ObjectId.isValid(id)) {
      return NextResponse.json(
        { success: false, error: "Invalid user id" },
        { status: 400 },
      );
    }

    await connectDB();

    const user = await User.findById(id);

    if (!user) {
      return NextResponse.json(
        { success: false, error: "User not found" },
        { status: 404 },
      );
    }

    return NextResponse.json({ success: true, user });
  } catch (err) {
    console.error("GET booking error:", err);

    return NextResponse.json({ error: "Server error" }, { status: 500 });
  }
}
