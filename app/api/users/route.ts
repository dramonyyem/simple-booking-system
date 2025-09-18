import { NextRequest, NextResponse } from "next/server";
import jwt from "jsonwebtoken";

import connectDB from "@/lib/db";
import User from "@/models/User";

const SECRET = process.env.JWT_TOKEN || "";

export async function GET(req: NextRequest) {
  const token = req.cookies.get("token")?.value;

  if (!token)
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  try {
    const payload = await jwt.verify(token, SECRET);

    if (!payload) {
      return NextResponse.json({ error: "No token found" }, { status: 401 });
    }
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
