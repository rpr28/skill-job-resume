import { NextResponse } from "next/server";

export async function GET(){
  const bySource = { "sample": 8 };
  return NextResponse.json({ total: 8, bySource });
}
