import { NextResponse } from "next/server";
import { aggregateJobs } from "@/lib/jobs/service";
import { cacheSet } from "@/lib/redis";
export async function POST(req){
  const key = req.headers.get("x-cron-key");
  if(!key || key !== (process.env.CRON_SECRET || "dev-cron")) return NextResponse.json({ error:"Unauthorized" }, { status: 401 });
  const all = await aggregateJobs();
  await cacheSet("jobs:base:v1", all, 15*60);
  return NextResponse.json({ ok:true, count: all.length, ts: Date.now() });
}


