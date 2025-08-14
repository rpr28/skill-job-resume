import { NextResponse } from "next/server";
import { cacheGet } from "../../../lib/redis";
import { aggregateJobs } from "../../../lib/job-search";

export async function GET() {
  try {
    // Try to get cached stats first
    let stats = await cacheGet("jobs:stats:v1");
    
    if (!stats) {
      // If no cached stats, run a fresh aggregation
      console.log("📊 No cached stats found, running fresh aggregation...");
      const result = await aggregateJobs();
      stats = result.stats;
    }
    
    return NextResponse.json({
      total: stats.total || 0,
      bySource: stats.bySource || {},
      lastRun: stats.timestamp,
      duration: stats.duration
    });
  } catch (error) {
    console.error("Stats API error:", error);
    return NextResponse.json({
      total: 0,
      bySource: {},
      error: "Failed to fetch stats"
    });
  }
}
