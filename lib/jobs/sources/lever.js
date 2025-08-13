import { normalizeJob, mkId } from "../normalize";
import { LEVER_SLUGS as LV } from "./config";
export async function fetchLever(slug){
  try{
    const res = await fetch(`https://api.lever.co/v0/postings/${encodeURIComponent(slug)}?mode=json`, { headers: { "User-Agent":"careerboost/1.0" } });
    if(!res.ok) throw new Error(`lever ${slug} ${res.status}`);
    const data = await res.json();
    if(!Array.isArray(data)) return [];
    return data.map(p => normalizeJob({
      id: mkId("lever", `${slug}_${p.id}`),
      title: p.text || p.title || "", company: p?.categories?.team || slug,
      location: p?.categories?.location || "",
      remote:/remote/i.test(p?.categories?.location||"") || JSON.stringify(p||{}).toLowerCase().includes("remote"),
      tags: (p?.tags || []),
      summary: (p?.lists || []).map(l=>l?.text).join(" ") || p?.description || "",
      url: p.hostedUrl || p.applyUrl || "",
      employmentType: p?.categories?.commitment || "", source: "lever", postedAt: ""
    }));
  }catch{ return []; }
}
export async function fetchLeverAll(){
  const batches = await Promise.allSettled(LV.map(fetchLever));
  return batches.filter(b=>b.status==="fulfilled").flatMap(b=>b.value);
}
