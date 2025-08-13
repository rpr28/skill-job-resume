import { backoffFetch, normalizeJob, extractTags, JOB_FETCH } from "../utils.js";

const ENDPOINT = "https://remoteok.com/api";

export async function fetchRemoteOK({ limit = JOB_FETCH.perSourceLimit } = {}) {
  try {
    console.log("Fetching RemoteOK jobs...");
    
    const response = await backoffFetch(ENDPOINT);
    const data = await response.json();
    
    if (!Array.isArray(data)) {
      console.log("RemoteOK: No jobs found or invalid response");
      return [];
    }
    
    const jobs = data
      .filter(d => d?.id && d?.position && d?.company)
      .slice(0, limit)
      .map(d => {
        const tags = extractTags(d.description || "", d.tags || []);
        
        return normalizeJob({
          id: `remoteok_${d.id}`,
          title: d.position,
          company: d.company,
          location: d.location || (d?.remote ? "Remote" : ""),
          remote: Boolean(d.remote) || String(d.location || "").toLowerCase().includes("remote"),
          tags: tags,
          summary: d.description || "",
          url: d.url || d.apply_url || d.slug || "",
          employmentType: d.job_type || "",
          source: "remoteok",
          postedAt: d.date || ""
        });
      });
    
    console.log(`RemoteOK: Fetched ${jobs.length} jobs`);
    return jobs;
  } catch (error) {
    console.error("RemoteOK fetch error:", error.message);
    return [];
  }
}
