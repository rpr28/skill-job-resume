import { dedupe, normalizeJob, encodeCursor, decodeCursor, scoreJob } from "./normalize";
import { fetchRemoteOK } from "./sources/remoteok";
import { fetchGreenhouseAll } from "./sources/greenhouse";
import { fetchLeverAll } from "./sources/lever";
// import { fetchRSS } from "./sources/rss";
import { matchesRegionToken } from "./../jobs/geo";

const SOURCES = [fetchRemoteOK, fetchGreenhouseAll, fetchLeverAll /*, fetchRSS*/];

export async function aggregateJobs(){
  const batches = await Promise.allSettled(SOURCES.map(fn => fn()));
  const ok = batches.filter(b=>b.status==="fulfilled").flatMap(b=>b.value);
  return dedupe(ok.map(normalizeJob));
}

export function filterAndRank({ jobs, q, locations, remote, tags, companies, employmentType, resume, start=0, limit=40 }){
  const norm = (s="")=>s.toLowerCase();
  const locTokens = (locations||[]).map(norm);
  const tagz = (tags||[]).map(norm);
  const comps= (companies||[]).map(norm);
  const et   = (employmentType||[]).map(norm);

  let pool = jobs.filter(j=>{
    const hay = norm(`${j.title} ${j.company} ${j.summary} ${(j.tags||[]).join(" ")}`);
    const qOk = q ? hay.includes(norm(q)) : true;
    const lOk = locTokens.length ? matchesRegionToken(j.location, locTokens) : true;
    const rOk = remote === "all" ? true : (remote === "remote" ? j.remote : !j.remote);
    const tOk = tagz.length ? (j.tags||[]).map(norm).some(t => tagz.includes(t) || tagz.some(x => t.includes(x))) : true;
    const cOk = comps.length ? comps.some(c => norm(j.company).includes(c)) : true;
    const eOk = et.length ? et.includes(norm(j.employmentType)) : true;
    return qOk && lOk && rOk && tOk && cOk && eOk;
  });

  const scored = pool.map(j => ({ j, s: resume ? scoreJob(j, resume) : 0 }));
  scored.sort((a,b)=> b.s - a.s);

  const slice = scored.slice(start, start+limit).map(x=>x.j);
  const nextCursor = (start + limit) < scored.length ? encodeCursor(start + limit) : null;
  return { items: slice, nextCursor, total: scored.length };
}
