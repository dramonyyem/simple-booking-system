import { NextRequest, NextResponse } from "next/server";
import jwt from "jsonwebtoken";
import nodemailer from "nodemailer";

import Booking from "@/models/Booking";
import connectDB from "@/lib/db";

const SECRET = process.env.JWT_TOKEN || "";

type Payload = {
  email: string;
  isAdmin: boolean;
  userId: string;
};

function generateBookingHtmlTable(booking: any) {
  return `
    <table style="border-collapse: collapse; width: 100%; font-family: Arial, sans-serif; margin-top: 10px;">
      <tr style="background-color: #f5f5f5;">
        <td style="padding: 10px; font-weight: bold;">Date</td>
        <td style="padding: 10px;">${booking.date}</td>
      </tr>
      <tr>
        <td style="padding: 10px; font-weight: bold;">Time</td>
        <td style="padding: 10px;">${booking.time}</td>
      </tr>
      <tr style="background-color: #f5f5f5;">
        <td style="padding: 10px; font-weight: bold;">Note</td>
        <td style="padding: 10px;">${booking.note || "-"}</td>
      </tr>
      <tr>
        <td style="padding: 10px; font-weight: bold;">Booking ID</td>
        <td style="padding: 10px;">${booking._id}</td>
      </tr>
    </table>
  `;
}

// Helper to send email via Mailtrap
async function sendBookingEmail(to: string, booking: any) {
  const transporter = nodemailer.createTransport({
    host: "smtp.mailtrap.io",
    port: 587,
    auth: {
      user: process.env.MAILTRAP_USER,
      pass: process.env.MAILTRAP_PASS,
    },
  });

  const html = `
    <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto; background-color: #ffffff; padding: 20px; border-radius: 8px; box-shadow: 0 2px 8px rgba(0,0,0,0.1);">
      
      <div style="text-align: center; background-color: #6b46c1; color: #ffffff; padding: 20px; border-radius: 8px 8px 0 0;">
        <h1 style="margin: 0; font-size: 24px;">Booking Confirmation</h1>
      </div>

      <div style="padding: 20px; color: #333;">
        <p>Dear Customer,</p>
        <p>Thank you for booking with our system! Here are your booking details:</p>
        ${generateBookingHtmlTable(booking)}
        <p style="margin-top: 20px;">We look forward to seeing you!</p>
        <p style="margin-top: 20px; font-size: 12px; color: #999;">If you did not make this booking, please contact our support immediately.</p>
      </div>

      <div style="text-align: center; font-size: 12px; color: #777; margin-top: 20px;">
        &copy; ${new Date().getFullYear()} Simple Booking System. All rights reserved.
      </div>
    </div>
  `;

  await transporter.sendMail({
    from: '"Simple Booking System" <no-reply@example.com>',
    to,
    subject: "Your Booking Confirmation",
    html,
  });
}

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

    const bookings = await Booking.find({});

    return NextResponse.json({ bookings });
  } catch (error) {
    console.log(error);
  }
}
export async function POST(req: NextRequest) {
  const token = req.cookies.get("token")?.value;

  if (!token)
    return NextResponse.json({ message: "Unauthorized", status: 401 });

  try {
    const { dateInput, time, note } = await req.json();

    const payload = (await jwt.verify(token, SECRET)) as Payload;

    if (!payload) {
      return NextResponse.json({ message: "Unauthorized", status: 401 });
    }
    if (dateInput == "" || time == null) {
      return NextResponse.json({
        message: "Pleaae fill in Date and time",
        status: 401,
      });
    }

    await connectDB();
    const checkIfTimePrevent = await Booking.findOne({
      date: dateInput,
      time: time,
    });

    if (checkIfTimePrevent) {
      return NextResponse.json({
        message: "Booking Time Unavailable",
        status: 401,
      });
    }
    const user = payload.userId;

    const booking = new Booking({
      date: dateInput,
      time: time,
      note: note,
      user: user,
    });

    await booking.save();

    await sendBookingEmail(payload.email, booking);

    return NextResponse.json({
      message: "Booking Added Successfully",
      status: 200,
      booking,
    });
  } catch (error) {}
}

export async function DELETE(req: NextRequest) {
  const { searchParams } = new URL(req.url);
  const id = searchParams.get("id");

  if (!id) {
    return NextResponse.json({ message: "Booking ID required", status: 400 });
  }

  try {
    await connectDB();
    await Booking.findByIdAndDelete(id);

    return NextResponse.json({
      message: "Booking deleted successfully",
      status: 200,
    });
  } catch (error) {
    console.error(error);

    return NextResponse.json({ message: "Delete failed", status: 500 });
  }
}
