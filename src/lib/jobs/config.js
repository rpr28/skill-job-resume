export const JOB_FETCH = {
  concurrency: 8,
  perSourceLimit: 2000, // safety max per adapter
  globalLimit: 5000,    // safety max per run
  backoffBaseMs: 600,
  backoffMaxMs: 5000,
  userAgent: "careerboost-job-crawler/1.0",
  timeoutMs: 10000,
  maxRetries: 3,
};
