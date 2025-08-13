import { NextResponse } from "next/server";
import { aggregateJobs } from "@/lib/job-search";
import { cacheSet } from "@/lib/redis";

export async function POST(req) {
  const key = req.headers.get("x-cron-key");
  if (!key || key !== (process.env.CRON_SECRET || "dev-cron")) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }
  
  try {
    console.log("🔄 Starting job ingestion...");
    const { jobs, stats } = await aggregateJobs();
    
    // Cache the jobs
    await cacheSet("jobs:base:v1", jobs, 15 * 60);
    
    // Cache the stats
    await cacheSet("jobs:stats:v1", stats, 15 * 60);
    
    console.log(`✅ Ingestion complete: ${jobs.length} jobs cached`);
    console.log("📊 Stats:", stats);
    
    return NextResponse.json({
      ok: true,
      count: jobs.length,
      stats: stats,
      ts: Date.now()
    });
  } catch (error) {
    console.error("❌ Ingestion failed:", error);
    return NextResponse.json({ error: "Ingestion failed" }, { status: 500 });
  }
}


