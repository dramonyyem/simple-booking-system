import { NextResponse } from "next/server";
import mongoose from "mongoose";

import Booking from "@/models/Booking";
import connectDB from "@/lib/db";

const getIdFromRequest = (req: Request) => {
  const url = new URL(req.url);
  const segments = url.pathname.split("/"); // e.g., ['', 'api', 'bookings', '123']

  return segments[segments.length - 1];
};

export async function GET(req: Request) {
  try {
    const id = getIdFromRequest(req);

    if (!mongoose.Types.ObjectId.isValid(id)) {
      return NextResponse.json(
        { success: false, error: "Invalid booking id" },
        { status: 400 },
      );
    }

    await connectDB();

    const booking = await Booking.findById(id);

    if (!booking) {
      return NextResponse.json(
        { success: false, error: "Booking not found" },
        { status: 404 },
      );
    }

    return NextResponse.json({ success: true, booking });
  } catch (err) {
    console.error("GET booking error:", err);

    return NextResponse.json({ error: "Server error" }, { status: 500 });
  }
}

export async function PUT(req: Request) {
  try {
    const id = getIdFromRequest(req);

    if (!mongoose.Types.ObjectId.isValid(id)) {
      return NextResponse.json(
        { success: false, error: "Invalid booking id" },
        { status: 400 },
      );
    }

    const body = await req.json();
    const { date, time, note } = body;

    await connectDB();

    const booking = await Booking.findByIdAndUpdate(
      id,
      { date, time, note },
      { new: true }, // return updated document
    );

    if (!booking) {
      return NextResponse.json(
        { success: false, error: "Booking not found" },
        { status: 404 },
      );
    }

    return NextResponse.json({
      success: true,
      message: "Booking updated successfully",
      booking,
    });
  } catch (err) {
    console.error("PUT booking error:", err);

    return NextResponse.json({ error: "Server error" }, { status: 500 });
  }
}
