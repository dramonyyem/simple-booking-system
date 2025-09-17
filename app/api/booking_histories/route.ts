import { NextRequest, NextResponse } from "next/server";
import jwt from "jsonwebtoken";

import Booking from "@/models/Booking";
import connectDB from "@/lib/db";

const SECRET = process.env.JWT_TOKEN || "";

type Payload = {
  email: string;
  isAdmin: boolean;
  userId: string;
};

export async function GET(req: NextRequest) {
  const token = req.cookies.get("token")?.value;

  if (!token)
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  try {
    const payload = (await jwt.verify(token, SECRET)) as Payload;

    if (!payload) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }
    const user = payload.userId;

    await connectDB();

    let bookings = await Booking.find({ user: user });

    if (payload.isAdmin) {
      bookings = await Booking.find().populate("user", "username email");
    }

    return NextResponse.json({ bookings });
  } catch (error) {
    console.log(error);
  }
}
