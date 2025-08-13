const stripHtml = (h="") => h.replace(/<[^>]*>/g," ").replace(/\s+/g," ").trim();
const tokenize = (s="") => s.toLowerCase().replace(/[^a-z0-9+.#/\- ]+/g," ").split(/\s+/).filter(Boolean);
const unique = (a=[]) => Array.from(new Set(a));
export function mkId(prefix, s){ return `${prefix}_${Buffer.from(String(s)).toString("base64").slice(0,24)}`; }
export function normalizeJob(raw){
  return {
    id: String(raw.id || mkId("job", raw.url || Math.random())),
    title: String(raw.title||"").trim(),
    company: String(raw.company||"").trim(),
    location: String(raw.location||""),
    remote: Boolean(raw.remote),
    tags: unique((raw.tags||[]).map(t=>String(t).trim()).filter(Boolean)),
    summary: stripHtml(String(raw.summary || raw.description || "")),
    url: String(raw.url||""),
    employmentType: String(raw.employmentType||""),
    source: String(raw.source||""),
    postedAt: String(raw.postedAt||""),
  };
}
export function dedupe(jobs){
  const m = new Map();
  for(const j of jobs){
    const k = `${(j.company||"").toLowerCase()}::${(j.title||"").toLowerCase()}::${(j.location||"").toLowerCase()}::${(j.url||"").toLowerCase()}`;
    if(!m.has(k)) m.set(k,j);
  }
  return [...m.values()];
}
export function encodeCursor(n){ return Buffer.from(String(n)).toString("base64"); }
export function decodeCursor(c){ if(!c) return 0; const s=Buffer.from(c,"base64").toString(); const n=parseInt(s,10); return Number.isFinite(n)?n:0; }
export function scoreJob(job, resume={}){
  const uniq = (xs=[])=>unique(xs.flatMap(tokenize));
  const jt = unique([...tokenize(job.title), ...tokenize(job.company), ...(job.tags||[]).flatMap(tokenize), ...tokenize(job.summary)]);
  const jac = (a,b)=>{const A=new Set(a),B=new Set(b); const inter=[...A].filter(x=>B.has(x)).length; const uni=new Set([...a,...b]).size; return uni===0?0:inter/uni;};
  let s=0;
  s += 0.6*jac(uniq(resume.skills||[]), jt);
  s += 0.25*jac(uniq(resume.titles||[]), jt);
  s += 0.15*jac(uniq(resume.domains||[]), jt);
  if(resume.openToRemote && job.remote) s += 0.05;
  if(Array.isArray(resume.preferredLocations) && resume.preferredLocations.length){
    const hit = resume.preferredLocations.some(l => (job.location||"").toLowerCase().includes(String(l).toLowerCase()));
    if(hit) s += 0.05;
  }
  return s;
}
