import { normalizeJob, mkId } from "../normalize";
const ENDPOINT = "https://remoteok.com/api";
export async function fetchRemoteOK(){
  try{
    const res = await fetch(ENDPOINT, { headers: { "User-Agent":"careerboost/1.0" } });
    if(!res.ok) throw new Error(`remoteok ${res.status}`);
    const data = await res.json();
    if(!Array.isArray(data)) return [];
    return data.filter(d=>d?.id && d?.position && d?.company).map(d => normalizeJob({
      id: mkId("remoteok", d.id), title: d.position, company: d.company,
      location: d.location || (d?.remote ? "Remote" : ""),
      remote: Boolean(d.remote) || String(d.location||"").toLowerCase().includes("remote"),
      tags: Array.isArray(d.tags)? d.tags : [],
      summary: d.description || "", url: d.url || d.apply_url || d.slug || "",
      employmentType: d.job_type || "", source: "remoteok", postedAt: d.date || ""
    }));
  }catch{ return []; }
}
