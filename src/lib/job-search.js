// lib/job-search.js
import { fetchRemoteOK } from './jobs/sources/remoteok.js';
import { fetchGreenhouseAll } from './jobs/sources/greenhouse.js';
import { fetchLeverAll } from './jobs/sources/lever.js';
import { fetchRemotive } from './jobs/sources/remotive.js';
import { dedupe, tokenize, unique, JOB_FETCH } from './jobs/utils.js';

// Fallback job data when APIs fail
const FALLBACK_JOBS = [
  {
    id: "fallback_1",
    title: "Senior Frontend Engineer",
    company: "TechCorp",
    location: "San Francisco, CA",
    remote: true,
    tags: ["React", "TypeScript", "JavaScript"],
    summary: "Build scalable frontend applications using modern technologies.",
    url: "https://example.com/job1"
  },
  {
    id: "fallback_2", 
    title: "Full Stack Developer",
    company: "StartupXYZ",
    location: "Remote",
    remote: true,
    tags: ["Node.js", "React", "MongoDB"],
    summary: "Join our growing team to build innovative web applications.",
    url: "https://example.com/job2"
  },
  {
    id: "fallback_3",
    title: "Software Engineer",
    company: "BigTech Inc",
    location: "New York, NY", 
    remote: false,
    tags: ["Python", "AWS", "Docker"],
    summary: "Develop backend services and infrastructure for our platform.",
    url: "https://example.com/job3"
  }
];

// Jaccard similarity
const jaccard = (a, b) => {
  const A = new Set(a), B = new Set(b);
  const inter = [...A].filter(x => B.has(x)).length;
  const uni = new Set([...a, ...b]).size;
  return uni === 0 ? 0 : inter / uni;
};

// Score job against resume
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
  if (!resume.openToRemote && resume.preferredLocations?.length) {
    const hit = resume.preferredLocations.some(l => (job.location || "").toLowerCase().includes(l.toLowerCase()));
    if (hit) s += 0.05;
  }
  if (!job.remote && resume.preferredLocations?.length) {
    const miss = !resume.preferredLocations.some(l => (job.location || "").toLowerCase().includes(l.toLowerCase()));
    if (miss) s -= 0.05;
  }
  
  return s;
}

// Helper function to test company slugs
export async function testCompanySlug(slug) {
  try {
    const res = await fetch(`https://boards-api.greenhouse.io/v1/boards/${encodeURIComponent(slug)}/jobs`, {
      headers: { "User-Agent": "careerboost-job-crawler/1.0" }
    });
    return res.ok;
  } catch {
    return false;
  }
}

// Main job aggregation function
export async function aggregateJobs({ limit = JOB_FETCH.globalLimit } = {}) {
  console.log("🚀 Starting job aggregation...");
  
  const startTime = Date.now();
  
  // Fetch from all sources concurrently
  const sources = [
    { name: "RemoteOK", fn: () => fetchRemoteOK({ limit: Math.floor(limit / 4) }) },
    { name: "Remotive", fn: () => fetchRemotive({ limit: Math.floor(limit / 4) }) },
    { name: "Greenhouse", fn: () => fetchGreenhouseAll({ limit: Math.floor(limit / 4) }) },
    { name: "Lever", fn: () => fetchLeverAll({ limit: Math.floor(limit / 4) }) }
  ];
  
  const results = await Promise.allSettled(sources.map(source => source.fn()));
  
  // Process results
  const sourceStats = {};
  const allJobs = [];
  
  results.forEach((result, index) => {
    const sourceName = sources[index].name;
    if (result.status === 'fulfilled') {
      sourceStats[sourceName] = result.value.length;
      allJobs.push(...result.value);
      console.log(`✅ ${sourceName}: ${result.value.length} jobs`);
    } else {
      sourceStats[sourceName] = 0;
      console.log(`❌ ${sourceName} failed:`, result.reason);
    }
  });
  
  console.log(`📊 Raw jobs before deduplication: ${allJobs.length}`);
  
  // Deduplicate
  const uniqueJobs = dedupe(allJobs);
  console.log(`📊 Total unique jobs after deduplication: ${uniqueJobs.length}`);
  
  // Add fallback jobs if we got very few results
  if (uniqueJobs.length < 50) {
    console.log(`⚠️ Only ${uniqueJobs.length} jobs found, adding fallback data`);
    const withFallback = dedupe([...uniqueJobs, ...FALLBACK_JOBS]);
    console.log(`📊 Total with fallback: ${withFallback.length}`);
  }
  
  const duration = Date.now() - startTime;
  console.log(`⏱️ Job aggregation completed in ${duration}ms`);
  console.log(`📈 Source breakdown:`, sourceStats);
  
  return {
    jobs: uniqueJobs,
    stats: {
      total: uniqueJobs.length,
      bySource: sourceStats,
      duration,
      timestamp: new Date().toISOString()
    }
  };
}

// Legacy function for backward compatibility
export async function searchJobsForResume(resume, opts = {}) {
  const limit = opts.limit ?? 50;
  
  console.log(`🔍 Fetching jobs for resume matching...`);
  
  const { jobs } = await aggregateJobs({ limit: JOB_FETCH.globalLimit });
  
  if (jobs.length === 0) {
    console.log(`⚠️ No jobs found, returning fallback`);
    return FALLBACK_JOBS.slice(0, limit);
  }
  
  console.log(`📊 Scoring ${jobs.length} jobs against resume...`);
  
  const scored = jobs.map(j => ({ j, s: scoreJobAgainstResume(j, resume) }));
  const sorted = scored.sort((a, b) => b.s - a.s);
  
  console.log(`🏆 Top 5 scores:`, sorted.slice(0, 5).map(({ j, s }) => `${j.title} (${s.toFixed(3)})`));
  
  return sorted.slice(0, limit).map(({ j }) => j);
}
