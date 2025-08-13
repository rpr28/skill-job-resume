import { JOB_FETCH } from './config.js';

// Re-export JOB_FETCH for convenience
export { JOB_FETCH };

// HTML stripping
export const stripHtml = (html = "") => {
  return html.replace(/<[^>]*>/g, " ").replace(/\s+/g, " ").trim();
};

// Text tokenization
export const tokenize = (text = "") => {
  return text.toLowerCase()
    .replace(/[^a-z0-9+.#/\- ]+/g, " ")
    .split(/\s+/)
    .filter(Boolean);
};

// Unique array
export const unique = (arr = []) => Array.from(new Set(arr));

// Generate job ID
export const mkId = (prefix, value) => {
  return `${prefix}_${Buffer.from(String(value)).toString("base64").slice(0, 24)}`;
};

// Normalize job data
export const normalizeJob = (raw) => {
  const location = String(raw.location || "").trim();
  const isRemote = location.toLowerCase().includes("remote") || 
                   location.toLowerCase().includes("anywhere") ||
                   location.toLowerCase().includes("global") ||
                   Boolean(raw.remote);

  return {
    id: String(raw.id || mkId("job", raw.url || Math.random())),
    title: String(raw.title || "").trim(),
    company: String(raw.company || "").trim(),
    location: location,
    remote: isRemote,
    tags: unique((raw.tags || []).map(t => String(t).trim()).filter(Boolean)),
    summary: stripHtml(String(raw.summary || raw.description || "")),
    url: String(raw.url || ""),
    employmentType: String(raw.employmentType || ""),
    source: String(raw.source || ""),
    postedAt: String(raw.postedAt || ""),
  };
};

// Deduplicate jobs
export const dedupe = (jobs) => {
  const seen = new Map();
  const urlSeen = new Set();
  
  for (const job of jobs) {
    // Skip exact URL duplicates
    if (urlSeen.has(job.url.toLowerCase())) continue;
    urlSeen.add(job.url.toLowerCase());
    
    // Use company::title::location as dedupe key
    const key = `${(job.company || "").toLowerCase()}::${(job.title || "").toLowerCase()}::${(job.location || "").toLowerCase()}`;
    
    if (!seen.has(key)) {
      seen.set(key, job);
    }
  }
  
  return Array.from(seen.values());
};

// Exponential backoff with jitter
const getBackoffDelay = (attempt) => {
  const baseDelay = JOB_FETCH.backoffBaseMs * Math.pow(2, attempt);
  const jitter = Math.random() * 0.1 * baseDelay;
  return Math.min(baseDelay + jitter, JOB_FETCH.backoffMaxMs);
};

// Backoff fetch with retries
export const backoffFetch = async (url, options = {}) => {
  let lastError;
  
  for (let attempt = 0; attempt <= JOB_FETCH.maxRetries; attempt++) {
    try {
      const controller = new AbortController();
      const timeoutId = setTimeout(() => controller.abort(), JOB_FETCH.timeoutMs);
      
      const response = await fetch(url, {
        ...options,
        headers: {
          'User-Agent': JOB_FETCH.userAgent,
          ...options.headers,
        },
        signal: controller.signal,
      });
      
      clearTimeout(timeoutId);
      
      if (response.status === 429 || response.status >= 500) {
        throw new Error(`HTTP ${response.status}`);
      }
      
      return response;
    } catch (error) {
      lastError = error;
      
      if (attempt === JOB_FETCH.maxRetries) {
        throw error;
      }
      
      const delay = getBackoffDelay(attempt);
      await new Promise(resolve => setTimeout(resolve, delay));
    }
  }
  
  throw lastError;
};

// Concurrency limiter
export const limitConcurrency = (tasks, concurrency) => {
  const results = [];
  const executing = new Set();
  
  return new Promise((resolve, reject) => {
    let index = 0;
    
    const runTask = async () => {
      if (index >= tasks.length) {
        if (executing.size === 0) {
          resolve(results);
        }
        return;
      }
      
      const taskIndex = index++;
      const task = tasks[taskIndex];
      
      executing.add(taskIndex);
      
      try {
        const result = await task();
        results[taskIndex] = result;
      } catch (error) {
        results[taskIndex] = { error };
      } finally {
        executing.delete(taskIndex);
        runTask();
      }
    };
    
    // Start initial tasks
    for (let i = 0; i < Math.min(concurrency, tasks.length); i++) {
      runTask();
    }
  });
};

// Extract tags from description
export const extractTags = (description, existingTags = []) => {
  const text = stripHtml(description).toLowerCase();
  const commonTech = [
    'javascript', 'typescript', 'react', 'vue', 'angular', 'node', 'python', 'java', 'go', 'rust',
    'aws', 'azure', 'gcp', 'docker', 'kubernetes', 'postgres', 'mysql', 'mongodb', 'redis',
    'graphql', 'rest', 'api', 'microservices', 'serverless', 'ci/cd', 'git', 'agile', 'scrum',
    'machine learning', 'ai', 'data science', 'devops', 'frontend', 'backend', 'full stack',
    'mobile', 'ios', 'android', 'flutter', 'react native', 'cloud', 'saas', 'startup'
  ];
  
  const found = commonTech.filter(tech => text.includes(tech));
  const allTags = [...existingTags, ...found];
  
  return unique(allTags).slice(0, 12);
};
