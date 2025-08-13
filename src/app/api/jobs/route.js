// app/api/jobs/route.js
import { NextResponse } from "next/server";
import { cacheGet } from "@/lib/redis";
import { aggregateJobs, filterAndRank } from "@/lib/jobs/service";
import { parseJobsQuery } from "@/lib/jobs/schemas";

// Sample jobs for fallback
const SAMPLE_JOBS = [
  {
    id: "sample_1",
    title: "Senior React Developer",
    company: "TechCorp",
    location: "San Francisco, CA",
    remote: true,
    tags: ["react", "javascript", "typescript"],
    summary: "We're looking for a senior React developer to join our team.",
    url: "https://example.com/job1",
    employmentType: "Full-time",
    source: "sample",
    postedAt: "2025-01-13"
  },
  {
    id: "sample_2", 
    title: "Frontend Engineer",
    company: "StartupXYZ",
    location: "Remote",
    remote: true,
    tags: ["react", "vue", "frontend"],
    summary: "Join our growing team as a frontend engineer.",
    url: "https://example.com/job2",
    employmentType: "Full-time",
    source: "sample",
    postedAt: "2025-01-12"
  },
  {
    id: "sample_3",
    title: "Full Stack Developer",
    company: "BigTech Inc",
    location: "New York, NY",
    remote: false,
    tags: ["react", "node", "python"],
    summary: "Full stack role with React and Node.js experience required.",
    url: "https://example.com/job3",
    employmentType: "Full-time",
    source: "sample",
    postedAt: "2025-01-11"
  },
  {
    id: "sample_4",
    title: "DevOps Engineer",
    company: "CloudTech",
    location: "Austin, TX",
    remote: true,
    tags: ["aws", "docker", "kubernetes"],
    summary: "Join our DevOps team to build scalable infrastructure.",
    url: "https://example.com/job4",
    employmentType: "Full-time",
    source: "sample",
    postedAt: "2025-01-10"
  },
  {
    id: "sample_5",
    title: "Data Scientist",
    company: "AnalyticsPro",
    location: "Boston, MA",
    remote: false,
    tags: ["python", "machine learning", "sql"],
    summary: "Help us build predictive models and insights.",
    url: "https://example.com/job5",
    employmentType: "Full-time",
    source: "sample",
    postedAt: "2025-01-09"
  },
  {
    id: "sample_6",
    title: "Product Manager",
    company: "InnovateCorp",
    location: "Seattle, WA",
    remote: true,
    tags: ["product", "agile", "user experience"],
    summary: "Lead product strategy and development.",
    url: "https://example.com/job6",
    employmentType: "Full-time",
    source: "sample",
    postedAt: "2025-01-08"
  },
  {
    id: "sample_7",
    title: "UX Designer",
    company: "DesignStudio",
    location: "Los Angeles, CA",
    remote: true,
    tags: ["design", "figma", "user research"],
    summary: "Create beautiful and intuitive user experiences.",
    url: "https://example.com/job7",
    employmentType: "Full-time",
    source: "sample",
    postedAt: "2025-01-07"
  },
  {
    id: "sample_8",
    title: "Backend Engineer",
    company: "APITech",
    location: "Denver, CO",
    remote: false,
    tags: ["node", "postgres", "redis"],
    summary: "Build robust backend services and APIs.",
    url: "https://example.com/job8",
    employmentType: "Full-time",
    source: "sample",
    postedAt: "2025-01-06"
  }
];

export async function POST(req){
  try{
    const body = await req.json();
    const { q, locations, remote="all", tags, companies, employmentType, limit=20, cursor, resume } = parseJobsQuery(body);
    
    // Try to get jobs from cache or live aggregation
    let base = await cacheGet("jobs:base:v1");
    if(!base || base.length < 10) {
      try {
        base = await aggregateJobs();
      } catch (error) {
        console.log("Live aggregation failed, using sample data:", error.message);
        base = SAMPLE_JOBS;
      }
    }
    
    // If still no jobs, use sample data
    if(!base || base.length === 0) {
      base = SAMPLE_JOBS;
    }
    
    const start = cursor ? (Number(Buffer.from(cursor,"base64").toString()) || 0) : 0;
    const res = filterAndRank({ jobs: base, q, locations, remote, tags, companies, employmentType, resume, start, limit });
    
    return NextResponse.json({ 
      jobs: res.items, 
      nextCursor: res.nextCursor, 
      total: res.total 
    });
  }catch(e){
    console.error("JOBS_API_ERR", e);
    // Fallback to sample data on error
    const start = 0;
    const limit = 20;
    const slice = SAMPLE_JOBS.slice(start, start + limit);
    return NextResponse.json({ 
      jobs: slice, 
      nextCursor: null, 
      total: SAMPLE_JOBS.length 
    }, { status: 200 });
  }
}
