import { NextRequest, NextResponse } from "next/server";
import Booking from "@/models/Booking";
import jwt from "jsonwebtoken";

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
    const bookings = await Booking.find({ user: user }).populate(
      "user",
      "username email",
    );
    return NextResponse.json({ bookings });
  } catch (error) {
    console.log(error);
  }
}
