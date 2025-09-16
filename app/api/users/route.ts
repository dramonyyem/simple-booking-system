import connectDB from "@/lib/db";
import { NextRequest, NextResponse } from "next/server";
import User from "@/models/User";
import jwt from "jsonwebtoken"

const SECRET = process.env.JWT_TOKEN || "";

export async function GET() {
    try{
        await connectDB();
        const users = await User.find({});
        return NextResponse.json(users);
    }catch(error){
        
    }
    
   
}

export async function POST(req: Request) {
    try {
        const {username, password, email} = await req.json();
        return NextResponse.json({username,password, email});
    } catch (error) {
        console.log(error);
    }
}