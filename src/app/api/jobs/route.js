// app/api/jobs/route.js
import { NextResponse } from "next/server";
import { cacheGet } from "../../../lib/redis";
import { aggregateJobs } from "../../../lib/job-search";
import { tokenize, unique } from "../../../lib/jobs/utils";

// Project job to minimal fields for pagination
function project(job) {
  return {
    id: job.id,
    title: job.title,
    company: job.company,
    location: job.location || "",
    remote: Boolean(job.remote),
    tags: (job.tags || []).filter((t) => /^[a-z0-9.+#/\- ]{2,}$/i.test(t)).slice(0, 5),
    url: job.url || "",
  };
}

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

// Filter and rank jobs
function filterAndRankJobs(jobs, { q, locations, remote, tags, companies, employmentType, resume, start = 0, limit = 20 }) {
  let filtered = jobs;
  
  // Text search
  if (q && q.trim()) {
    const query = q.toLowerCase();
    filtered = filtered.filter(job => 
      job.title.toLowerCase().includes(query) ||
      job.company.toLowerCase().includes(query) ||
      job.summary.toLowerCase().includes(query) ||
      job.tags.some(tag => tag.toLowerCase().includes(query))
    );
  }
  
  // Location filter
  if (locations && locations.length > 0) {
    filtered = filtered.filter(job => 
      locations.some(loc => 
        job.location.toLowerCase().includes(loc.toLowerCase())
      )
    );
  }
  
  // Remote filter
  if (remote && remote !== "all") {
    if (remote === "remote") {
      filtered = filtered.filter(job => job.remote);
    } else if (remote === "onsite") {
      filtered = filtered.filter(job => !job.remote);
    }
  }
  
  // Tags filter
  if (tags && tags.length > 0) {
    filtered = filtered.filter(job => 
      tags.some(tag => 
        job.tags.some(jobTag => 
          jobTag.toLowerCase().includes(tag.toLowerCase())
        )
      )
    );
  }
  
  // Companies filter
  if (companies && companies.length > 0) {
    filtered = filtered.filter(job => 
      companies.some(company => 
        job.company.toLowerCase().includes(company.toLowerCase())
      )
    );
  }
  
  // Employment type filter
  if (employmentType && employmentType.length > 0) {
    filtered = filtered.filter(job => 
      employmentType.some(type => 
        job.employmentType.toLowerCase().includes(type.toLowerCase())
      )
    );
  }
  
  // Score jobs if resume provided
  if (resume) {
    filtered = filtered.map(job => {
      const score = scoreJobAgainstResume(job, resume);
      return { ...job, score };
    }).sort((a, b) => (b.score || 0) - (a.score || 0));
  }
  
  const total = filtered.length;
  const items = filtered.slice(start, start + limit);
  const nextCursor = start + limit < total ? Buffer.from(String(start + limit)).toString("base64") : null;
  
  return { items, nextCursor, total };
}

// Score job against resume (simplified version)
function scoreJobAgainstResume(job, resume) {
  const skill = unique((resume.skills || []).flatMap(tokenize));
  const title = unique((resume.titles || []).flatMap(tokenize));
  const domain = unique((resume.domains || []).flatMap(tokenize));
  const jt = unique([...tokenize(job.title), ...tokenize(job.company), ...job.tags.flatMap(tokenize), ...tokenize(job.summary)]);
  
  let s = 0;
  s += 0.6 * jaccard(skill, jt);
  s += 0.25 * jaccard(title, jt);
  s += 0.15 * jaccard(domain, jt);
  
  if (resume.openToRemote && job.remote) s += 0.05;
  
  return s;
}

// Jaccard similarity
function jaccard(a, b) {
  const A = new Set(a), B = new Set(b);
  const inter = [...A].filter(x => B.has(x)).length;
  const uni = new Set([...a, ...b]).size;
  return uni === 0 ? 0 : inter / uni;
}

export async function GET(req) {
  try {
    const { searchParams } = new URL(req.url);

    const q = searchParams.get("q") || "";
    const location = searchParams.get("location") || "all";
    const remote = searchParams.get("remote") || "all";

    const page = Math.max(1, parseInt(searchParams.get("page") || "1", 10));
    const pageSize = Math.min(50, Math.max(1, parseInt(searchParams.get("pageSize") || "10", 10)));

    // Try to get jobs from cache or live aggregation
    let base = await cacheGet("jobs:base:v1");
    if (!base || base.length < 10) {
      try {
        const result = await aggregateJobs();
        base = result.jobs;
      } catch (error) {
        console.log("Live aggregation failed, using sample data:", error.message);
        base = SAMPLE_JOBS;
      }
    }
    
    // If still no jobs, use sample data
    if (!base || base.length === 0) {
      base = SAMPLE_JOBS;
    }

    // Apply filters
    const filtered = base.filter((j) => {
      const qOk = q ? (j.title + " " + j.company).toLowerCase().includes(q.toLowerCase()) : true;
      const locOk = location === "all" ? true : (j.location || "").toLowerCase().includes(location.toLowerCase());
      const remOk = remote === "all" ? true : (remote === "remote" ? j.remote : !j.remote);
      return qOk && locOk && remOk;
    });

    const total = filtered.length;
    const totalPages = Math.max(1, Math.ceil(total / pageSize));
    const start = (page - 1) * pageSize;
    const end = start + pageSize;

    const items = filtered.slice(start, end).map(project);

    return NextResponse.json({ page, pageSize, total, totalPages, items });
  } catch (e) {
    console.error("JOBS_API_ERR", e);
    // Fallback to sample data on error
    const page = 1;
    const pageSize = 10;
    const items = SAMPLE_JOBS.slice(0, pageSize).map(project);
    return NextResponse.json({
      page,
      pageSize,
      total: SAMPLE_JOBS.length,
      totalPages: Math.ceil(SAMPLE_JOBS.length / pageSize),
      items
    }, { status: 200 });
  }
}

export async function POST(req) {
  try {
    const body = await req.json();
    const { q, locations, remote = "all", tags, companies, employmentType, limit = 20, cursor, resume } = body;
    
    // Try to get jobs from cache or live aggregation
    let base = await cacheGet("jobs:base:v1");
    if (!base || base.length < 10) {
      try {
        const result = await aggregateJobs();
        base = result.jobs;
      } catch (error) {
        console.log("Live aggregation failed, using sample data:", error.message);
        base = SAMPLE_JOBS;
      }
    }
    
    // If still no jobs, use sample data
    if (!base || base.length === 0) {
      base = SAMPLE_JOBS;
    }
    
    const start = cursor ? (Number(Buffer.from(cursor, "base64").toString()) || 0) : 0;
    const res = filterAndRankJobs(base, { q, locations, remote, tags, companies, employmentType, resume, start, limit });
    
    return NextResponse.json({
      jobs: res.items,
      nextCursor: res.nextCursor,
      total: res.total
    });
  } catch (e) {
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
