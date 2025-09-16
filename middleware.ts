// middleware.ts
import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";
import { jwtVerify } from "jose";

const SECRET = new TextEncoder().encode(process.env.JWT_TOKEN);

type Payload = {
  userId: string;
  email: string;
  isAdmin: boolean;
};


export async function middleware(req: NextRequest) {
    const token = req.cookies.get("token")?.value as string;
    if(!token){
        return NextResponse.rewrite(new URL("/", req.url));
    }
  
    const { payload } = await jwtVerify(token, SECRET);
    // console.log(payload.isAdmin);
    if(!payload){
        return NextResponse.json({ error: "No token found" }, { status: 401 });
    }
    if (req.nextUrl.pathname.startsWith("/bookings") && !payload.isAdmin) {
        return NextResponse.rewrite(new URL("/", req.url));
    }
    if (req.nextUrl.pathname.startsWith("/users") && !payload.isAdmin) {
        return NextResponse.rewrite(new URL("/", req.url));
    }

    // API Protect
    if (req.nextUrl.pathname.startsWith("/api/bookings") && !payload.isAdmin) {
        return NextResponse.rewrite(new URL("/", req.url));
    }
    if (req.nextUrl.pathname.startsWith("/api/users") && !payload.isAdmin) {
        return NextResponse.rewrite(new URL("/", req.url));
    }
    return NextResponse.next();
}

export const config = {
  matcher: [
    "/((?!_next/static|_next/image|favicon.ico|check_available|api/check_available|auth|api/auth).*)",
  ],
};