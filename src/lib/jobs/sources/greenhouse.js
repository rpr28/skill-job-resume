import { backoffFetch, normalizeJob, extractTags, limitConcurrency, JOB_FETCH } from "../utils.js";
import { GREENHOUSE_SLUGS as GH } from "./config.js";

export async function fetchGreenhouse(slug, { limit = JOB_FETCH.perSourceLimit } = {}) {
  try {
    const url = `https://boards-api.greenhouse.io/v1/boards/${encodeURIComponent(slug)}/jobs`;
    const response = await backoffFetch(url);
    const data = await response.json();
    
    if (!data || !Array.isArray(data.jobs)) {
      return [];
    }
    
    const jobs = data.jobs.slice(0, limit).map(job => {
      const tags = extractTags(job.content || "", [
        ...(job?.departments?.map(d => d?.name) || []),
        ...(job?.offices?.map(o => o?.name) || [])
      ]);
      
      return normalizeJob({
        id: `gh_${slug}_${job.id}`,
        title: job.title || "",
        company: slug,
        location: job?.location?.name || "",
        remote: /remote/i.test(job?.location?.name || "") || JSON.stringify(job || {}).toLowerCase().includes("remote"),
        tags: tags,
        summary: job?.content || "",
        url: job.absolute_url || `https://boards.greenhouse.io/${slug}/jobs/${job.id}`,
        employmentType: "",
        source: "greenhouse",
        postedAt: ""
      });
    });
    
    return jobs;
  } catch (error) {
    console.error(`Greenhouse ${slug} fetch error:`, error.message);
    return [];
  }
}

export async function fetchGreenhouseAll({ limit = JOB_FETCH.perSourceLimit } = {}) {
  console.log(`Fetching Greenhouse jobs from ${GH.length} companies...`);
  
  const tasks = GH.map(slug => () => fetchGreenhouse(slug, { limit }));
  const results = await limitConcurrency(tasks, JOB_FETCH.concurrency);
  
  const allJobs = results.flat().filter(job => job && !job.error);
  console.log(`Greenhouse: Fetched ${allJobs.length} jobs from ${results.filter(r => r && r.length > 0).length} companies`);
  
  return allJobs;
}
