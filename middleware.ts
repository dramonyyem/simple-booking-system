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
  const token = req.cookies.get("token")?.value;

  if (!token) {
    return NextResponse.rewrite(new URL("/", req.url));
  }

  let payload: Payload;

  try {
    const result = await jwtVerify(token, SECRET);
    payload = result.payload as Payload;
  } catch (err) {
    return NextResponse.rewrite(new URL("/", req.url));
  }

  const adminPaths = ["/bookings", "/users", "/api/bookings", "/api/users"];

  if (adminPaths.some(path => req.nextUrl.pathname.startsWith(path)) && !payload.isAdmin) {
    return NextResponse.rewrite(new URL("/", req.url));
  }

  return NextResponse.next();
}

export const config = {
  matcher: [
    "/((?!_next/static|_next/image|favicon.ico|auth|api/auth|check_available|api/check_available).*)",
  ],
};
