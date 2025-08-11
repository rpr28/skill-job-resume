// app/api/jobs/route.ts
import { NextResponse } from "next/server";
import { searchJobsForResume, type Resume } from "@/lib/job-search";

export async function POST(req: Request) {
  const { resume, companies, limit } = await req.json();
  const r = (resume || {}) as Resume;
  const jobs = await searchJobsForResume(r, { companies, limit });
  return NextResponse.json({ jobs });
}
