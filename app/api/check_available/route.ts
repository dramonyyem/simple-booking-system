import connectDB from "@/lib/db";
import Booking from "@/models/Booking";
import { NextRequest, NextResponse } from "next/server";

export async function POST(req: NextRequest) {
  try {
    const { dateInput } = await req.json();

    await connectDB();
    
    const allTimes = [
      { key: "02:00 PM", label: "02:00 PM" },
      { key: "04:00 PM", label: "04:00 PM" },
      { key: "06:00 PM", label: "06:00 PM" },
      { key: "08:00 PM", label: "08:00 PM" },
    ];
    const bookings = await Booking.find({date:dateInput}).select("time");

    const bookedTimes = bookings.map((b) => b.time);

    const time = allTimes.filter((t) => !bookedTimes.includes(t.key));

    return NextResponse.json({ time, bookings });
  } catch (error) {
  }
  
}
