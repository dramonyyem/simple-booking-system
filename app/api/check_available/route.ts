import { NextRequest, NextResponse } from "next/server";

export async function POST(req: NextRequest) {
  const time = [
    { key: "02:00 PM", label: "02:00 PM" },
    { key: "04:00 PM", label: "04:00 PM" },
  ];
  return NextResponse.json({ time });
}
