import { backoffFetch, normalizeJob, extractTags, limitConcurrency, JOB_FETCH } from "../utils.js";
import { LEVER_SLUGS as LV } from "./config.js";

export async function fetchLever(slug, { limit = JOB_FETCH.perSourceLimit } = {}) {
  try {
    const url = `https://api.lever.co/v0/postings/${encodeURIComponent(slug)}?mode=json`;
    const response = await backoffFetch(url);
    const data = await response.json();
    
    if (!Array.isArray(data)) {
      return [];
    }
    
    const jobs = data.slice(0, limit).map(posting => {
      const summary = (posting?.lists || []).map(l => l?.text).join(" ") || posting?.description || "";
      const tags = extractTags(summary, posting?.tags || []);
      
      return normalizeJob({
        id: `lever_${slug}_${posting.id}`,
        title: posting.text || posting.title || "",
        company: posting?.categories?.team || slug,
        location: posting?.categories?.location || "",
        remote: /remote/i.test(posting?.categories?.location || "") || JSON.stringify(posting || {}).toLowerCase().includes("remote"),
        tags: tags,
        summary: summary,
        url: posting.hostedUrl || posting.applyUrl || "",
        employmentType: posting?.categories?.commitment || "",
        source: "lever",
        postedAt: ""
      });
    });
    
    return jobs;
  } catch (error) {
    console.error(`Lever ${slug} fetch error:`, error.message);
    return [];
  }
}

export async function fetchLeverAll({ limit = JOB_FETCH.perSourceLimit } = {}) {
  console.log(`Fetching Lever jobs from ${LV.length} companies...`);
  
  const tasks = LV.map(slug => () => fetchLever(slug, { limit }));
  const results = await limitConcurrency(tasks, JOB_FETCH.concurrency);
  
  const allJobs = results.flat().filter(job => job && !job.error);
  console.log(`Lever: Fetched ${allJobs.length} jobs from ${results.filter(r => r && r.length > 0).length} companies`);
  
  return allJobs;
}
