import { NextResponse } from "next/server";
import { checkPassword } from "@/lib/auth";
import User from "@/models/User";
import connectDB from "@/lib/db";
import jwt from "jsonwebtoken";

const SECRET = process.env.JWT_TOKEN || "";

export async function POST(req: Request) {
    try {
        
        const {username, password} = await req.json();

        await connectDB();
        
        const user = await User.findOne({username: username});
        if (!user) {
            return NextResponse.json({ message: "User not found" }, { status: 404 });
        }
        const isAuth : boolean = await checkPassword(password, user.password)
        
        if (!isAuth) {
            return NextResponse.json({ message: "Invalid credentials" });
        }

        const token = jwt.sign(
            { userId: user._id, email: user.email, isAdmin: user.isAdmin },
                SECRET,
            { expiresIn: "1d" }
        );
        const res = NextResponse.json({ message: "Login successful" });

        res.cookies.set("token", token, {
            httpOnly: true,
            secure: process.env.NODE_ENV === "production",
            path: "/",
            maxAge: 60 * 60 * 24,
        });

        return res;
    } catch (error) {
        console.log(error);
    }
    
}