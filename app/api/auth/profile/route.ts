import { NextRequest, NextResponse } from "next/server";
import jwt from "jsonwebtoken";

import User from "@/models/User";

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
    const payload = (await jwt.verify(token, SECRET)) as Payload;

    if (!payload) {
      return NextResponse.json({ error: "No token found" }, { status: 401 });
    }
    const userId = payload.userId;

    const user = await User.findOne({ _id: userId });

    return NextResponse.json({ user, payload, token });
  } catch (error) {}
}
