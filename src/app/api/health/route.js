import { NextResponse } from "next/server";
export async function GET(){ return NextResponse.json({ ok:true, ts: Date.now(), version: process.env.VERCEL_GIT_COMMIT_SHA || "dev" }); }







