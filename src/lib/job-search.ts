// lib/job-search.ts

// Fallback job data when APIs fail
const FALLBACK_JOBS: Job[] = [
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

export type Job = {
  id: string; title: string; company: string; location: string;
  remote: boolean; tags: string[]; summary: string; url: string;
};

export type Resume = {
  name?: string;
  titles?: string[];
  yearsExperience?: number;
  location?: string;
  openToRemote?: boolean;
  preferredLocations?: string[];
  skills?: string[];
  domains?: string[];
};

export type SearchOptions = { limit?: number; companies?: string[]; offlineSeed?: Job[] };

const GREENHOUSE_COMPANIES: Record<string,string> = {
  coursera:"coursera", 
  stripe:"stripe",
  // Working companies - tested and verified
  airbnb:"airbnb",
  dropbox:"dropbox", 
  github:"github",
  lyft:"lyft",
  pinterest:"pinterest",
  shopify:"shopify",
  spotify:"spotify",
  uber:"uber",
  // These return 404 - need correct slugs
  // notion:"notion", openai:"openai", nvidia:"nvidia",
};
const LEVER_COMPANIES: Record<string,string> = {
  // Lever companies - different API format
  netflix:"netflix",
  slack:"slack",
  twilio:"twilio",
  // Add more as needed
};
const REMOTEOK_ENDPOINT = "https://remoteok.com/api";

const stripHtml = (h:string)=>h.replace(/<[^>]*>/g," ").replace(/\s+/g," ").trim();
const tokenize = (s:string)=> (s||"").toLowerCase().replace(/[^a-z0-9+.#/\- ]+/g," ").split(/\s+/).filter(Boolean);
const unique = <T,>(a:T[])=>Array.from(new Set(a));
const jaccard = (a:string[],b:string[])=>{
  const A=new Set(a),B=new Set(b);
  const inter=[...A].filter(x=>B.has(x)).length; const uni=new Set([...a,...b]).size;
  return uni===0?0:inter/uni;
};

function hasRemoteInMetadata(obj:any){ return JSON.stringify(obj||{}).toLowerCase().includes("remote"); }
function extractTagsFromGreenhouse(j:any){ const dept=j?.departments?.map((d:any)=>d?.name)||[]; const off=j?.offices?.map((o:any)=>o?.name)||[]; const title=(j?.title||"").split(/[ /|,]+/).slice(0,5); return unique([...dept,...off,...title].filter(Boolean)); }
function summarizeGreenhouseContent(j:any){ return stripHtml(String(j?.content||"")).slice(0,280); }
function extractTagsFromLever(p:any){ const cat=p?.categories||{}; const bits=[cat.commitment,cat.team,cat.location,p?.tags?.join(" ")].filter(Boolean).join(" "); return unique(tokenize(bits).slice(0,12)); }
function summarizeLeverContent(p:any){ const desc=stripHtml(String(p?.lists?.map((l:any)=>l?.text).join(" ")||p?.description||"")); return desc.slice(0,280); }

function normalizeJob(j:Job):Job{
  return { id:j.id, title:j.title?.trim()||"", company:j.company?.trim()||"", location:j.location?.trim()||"",
    remote:!!j.remote, tags:unique((j.tags||[]).map(t=>String(t).trim()).filter(Boolean)), summary:(j.summary||"").trim(), url:j.url||"" };
}
function dedupe(jobs:Job[]):Job[]{ const m=new Map<string,Job>(); for(const j of jobs){ const k=`${j.company.toLowerCase()}::${j.title.toLowerCase()}::${(j.location||"").toLowerCase()}`; if(!m.has(k)) m.set(k,j);} return [...m.values()]; }

async function fetchRemoteOK():Promise<Job[]>{
  try{
    console.log("🌐 Fetching from RemoteOK...");
    const res=await fetch(REMOTEOK_ENDPOINT,{headers:{ "User-Agent":"job-matcher/1.0"}});
    if(!res.ok) throw new Error(`RemoteOK ${res.status}`);
    const data=await res.json(); if(!Array.isArray(data)) return [];
    const jobs = data.filter((d:any)=>d?.id && d?.position && d?.company).map((d:any):Job=>({
      id:`remoteok_${d.id}`, title:d.position, company:d.company, location:d.location || (d?.remote?"Remote":""), remote:Boolean(d.remote) || String(d.location||"").toLowerCase().includes("remote"),
      tags:Array.isArray(d.tags)?d.tags:[], summary:d.description?stripHtml(String(d.description)).slice(0,280):"", url:d.url || d.apply_url || d.slug || ""
    }));
    console.log(`✅ RemoteOK: ${jobs.length} jobs`);
    return jobs;
  }catch(error){
    console.log(`❌ RemoteOK failed:`, error);
    return []; 
  }
}
async function fetchGreenhouse(slug:string):Promise<Job[]>{
  try{
    console.log(`🏢 Fetching from Greenhouse (${slug})...`);
    const res=await fetch(`https://boards-api.greenhouse.io/v1/boards/${encodeURIComponent(slug)}/jobs`,{headers:{ "User-Agent":"job-matcher/1.0"}});
    if(!res.ok) throw new Error(`GH ${slug} ${res.status}`);
    const data=await res.json(); const jobs:any[]=Array.isArray(data?.jobs)?data.jobs:[];
    const result = jobs.map((j:any):Job=>({ id:`greenhouse_${slug}_${j.id}`, title:j.title||"", company:slug, location:j?.location?.name||"",
      remote:/remote/i.test(j?.location?.name||"") || hasRemoteInMetadata(j), tags:extractTagsFromGreenhouse(j),
      summary:summarizeGreenhouseContent(j), url:j.absolute_url || `https://boards.greenhouse.io/${slug}/jobs/${j.id}` }));
    console.log(`✅ Greenhouse (${slug}): ${result.length} jobs`);
    return result;
  }catch(error){
    console.log(`❌ Greenhouse (${slug}) failed:`, error);
    return []; 
  }
}
async function fetchLever(slug:string):Promise<Job[]>{
  try{
    const res=await fetch(`https://api.lever.co/v0/postings/${encodeURIComponent(slug)}?mode=json`,{headers:{ "User-Agent":"job-matcher/1.0"}});
    if(!res.ok) throw new Error(`Lever ${slug} ${res.status}`);
    const data=await res.json(); if(!Array.isArray(data)) return [];
    return data.map((p:any):Job=>({ id:`lever_${slug}_${p.id}`, title:p.text||p.title||"", company:p?.categories?.team||slug, location:p?.categories?.location||"",
      remote:/remote/i.test(p?.categories?.location||"") || hasRemoteInMetadata(p), tags:extractTagsFromLever(p),
      summary:summarizeLeverContent(p), url:p.hostedUrl || p.applyUrl || "" }));
  }catch{ return []; }
}

function scoreJobAgainstResume(job:Job, resume:Resume){
  const skill=unique((resume.skills||[]).flatMap(tokenize));
  const title=unique((resume.titles||[]).flatMap(tokenize));
  const domain=unique((resume.domains||[]).flatMap(tokenize));
  const jt=unique([...tokenize(job.title), ...tokenize(job.company), ...job.tags.flatMap(tokenize), ...tokenize(job.summary)]);
  let s=0;
  s+=0.6*jaccard(skill,jt);
  s+=0.25*jaccard(title,jt);
  s+=0.15*jaccard(domain,jt);
  if(resume.openToRemote && job.remote) s+=0.05;
  if(!resume.openToRemote && resume.preferredLocations?.length){
    const hit=resume.preferredLocations.some(l=>(job.location||"").toLowerCase().includes(l.toLowerCase()));
    if(hit) s+=0.05;
  }
  if(!job.remote && resume.preferredLocations?.length){
    const miss=!resume.preferredLocations.some(l=>(job.location||"").toLowerCase().includes(l.toLowerCase()));
    if(miss) s-=0.05;
  }
  return s;
}

// Helper function to test company slugs
export async function testCompanySlug(slug: string): Promise<boolean> {
  try {
    const res = await fetch(`https://boards-api.greenhouse.io/v1/boards/${encodeURIComponent(slug)}/jobs`, {
      headers: { "User-Agent": "job-matcher/1.0" }
    });
    return res.ok;
  } catch {
    return false;
  }
}

export async function searchJobsForResume(resume:Resume, opts:SearchOptions={}):Promise<Job[]>{
  const limit=opts.limit ?? 50;
  const batches:Promise<Job[]>[]=[fetchRemoteOK()];
  for(const slug of Object.values(GREENHOUSE_COMPANIES)) batches.push(fetchGreenhouse(slug));
  for(const slug of Object.values(LEVER_COMPANIES)) batches.push(fetchLever(slug));
  
  console.log(`🔍 Fetching jobs from ${batches.length} sources...`);
  
  const fetched = opts.offlineSeed ? [opts.offlineSeed] : await Promise.allSettled(batches);
  
  if (!opts.offlineSeed) {
    const results = fetched as PromiseSettledResult<Job[]>[];
    results.forEach((result, index) => {
      if (result.status === 'fulfilled') {
        console.log(`✅ Source ${index}: ${result.value.length} jobs`);
      } else {
        console.log(`❌ Source ${index} failed:`, result.reason);
      }
    });
  }
  
  const successfulResults = opts.offlineSeed ? 
    fetched : 
    (fetched as PromiseSettledResult<Job[]>[])
      .filter((result): result is PromiseFulfilledResult<Job[]> => result.status === 'fulfilled')
      .map(result => result.value);
  
  let all = dedupe(successfulResults.flat()).map(normalizeJob);
  
  // Add fallback jobs if we got very few results
  if (all.length < 10 && !opts.offlineSeed) {
    console.log(`⚠️ Only ${all.length} jobs found, adding fallback data`);
    all = dedupe([...all, ...FALLBACK_JOBS]).map(normalizeJob);
  }
  console.log(`📊 Total unique jobs after deduplication: ${all.length}`);
  
  const scored = all.map(j=>({j,s:scoreJobAgainstResume(j,resume)}));
  const sorted = scored.sort((a,b)=>b.s-a.s);
  console.log(`🏆 Top 5 scores:`, sorted.slice(0,5).map(({j,s})=>`${j.title} (${s.toFixed(3)})`));
  
  return sorted.slice(0,limit).map(({j})=>j);
}
