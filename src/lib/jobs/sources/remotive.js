import { backoffFetch, normalizeJob, extractTags, JOB_FETCH } from "../utils.js";

export async function fetchRemotive({ limit = JOB_FETCH.perSourceLimit } = {}) {
  try {
    console.log("Fetching Remotive jobs...");
    
    const response = await backoffFetch("https://remotive.com/api/remote-jobs");
    const data = await response.json();
    
    if (!data || !Array.isArray(data.jobs)) {
      console.log("Remotive: No jobs found or invalid response");
      return [];
    }
    
    const jobs = data.jobs.slice(0, limit).map(job => {
      const tags = extractTags(job.description, job.tags || []);
      
      return normalizeJob({
        id: `remotive_${job.id}`,
        title: job.title,
        company: job.company_name,
        location: job.candidate_required_location || "Remote",
        remote: true, // Remotive is remote-focused
        tags: tags,
        summary: job.description || "",
        url: job.url || job.job_url || "",
        employmentType: job.job_type || "",
        source: "remotive",
        postedAt: job.publication_date || ""
      });
    });
    
    console.log(`Remotive: Fetched ${jobs.length} jobs`);
    return jobs;
  } catch (error) {
    console.error("Remotive fetch error:", error.message);
    return [];
  }
}
