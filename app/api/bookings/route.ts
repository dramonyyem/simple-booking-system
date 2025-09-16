import { NextRequest, NextResponse } from "next/server";
import Booking from "@/models/Booking";
import jwt from "jsonwebtoken"
import connectDB from "@/lib/db";


const SECRET = process.env.JWT_TOKEN || "";

type Payload = {
  email: string;
  isAdmin: boolean;
  userId: string;
};


export async function GET(req: NextRequest) {
    const token = req.cookies.get("token")?.value;
    if (!token) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    try {
        const payload = await jwt.verify(token, SECRET);
         if(!payload){
            return NextResponse.json({ error: "No token found" }, { status: 401 });
        }
        await connectDB();
        const bookings = await Booking.find({});

        return NextResponse.json({bookings});
    } catch (error) {
        console.log(error)
    }
   
}
export async function POST(req: NextRequest) {
    const token = req.cookies.get("token")?.value;

    if (!token) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

    try {
        const {dateInput, time, note} = await req.json();

        const payload = await jwt.verify(token, SECRET) as Payload;
        if(!payload){
            return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
        }

        if(dateInput === "" || time === ""){
            return NextResponse.json({ message: "Pleaae fill in Date and time" }, { status: 401 });
        }

        await connectDB();
        const checkIfTimePrevent = await Booking.findOne({
            date: dateInput,
            time: time
        });

        if(checkIfTimePrevent){
            return NextResponse.json({ message: "Booking Time Unavailable" }, { status: 401 });
        }
        const user  = payload.userId;
        const booking = new Booking({
            date: dateInput,
            time: time,
            note: note,
            user: user
        });
        await booking.save();

        return NextResponse.json({message: "booking Add Successful"}, { status: 200 });
    } catch (error) {
        console.log(error);
    }
}

