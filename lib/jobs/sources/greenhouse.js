import { normalizeJob, mkId } from "../normalize";
import { GREENHOUSE_SLUGS as GH } from "./config";
export async function fetchGreenhouse(slug){
  try{
    const res = await fetch(`https://boards-api.greenhouse.io/v1/boards/${encodeURIComponent(slug)}/jobs`, { headers: { "User-Agent":"careerboost/1.0" } });
    if(!res.ok) throw new Error(`gh ${slug} ${res.status}`);
    const data = await res.json();
    const jobs = Array.isArray(data?.jobs) ? data.jobs : [];
    return jobs.map(j => normalizeJob({
      id: mkId("gh", `${slug}_${j.id}`), title: j.title || "", company: slug,
      location: j?.location?.name || "", remote:/remote/i.test(j?.location?.name||"") || JSON.stringify(j||{}).toLowerCase().includes("remote"),
      tags: [...(j?.departments?.map(d=>d?.name)||[]), ...(j?.offices?.map(o=>o?.name)||[])],
      summary: j?.content || "", url: j.absolute_url || `https://boards.greenhouse.io/${slug}/jobs/${j.id}`,
      employmentType: "", source: "greenhouse", postedAt: ""
    }));
  }catch{ return []; }
}
export async function fetchGreenhouseAll(){
  const batches = await Promise.allSettled(GH.map(fetchGreenhouse));
  return batches.filter(b=>b.status==="fulfilled").flatMap(b=>b.value);
}
