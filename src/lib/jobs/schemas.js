import { z } from "zod";
export const JobSchema = z.object({
  id: z.string(), title: z.string(), company: z.string(),
  location: z.string().optional().default(""),
  remote: z.boolean().optional().default(false),
  tags: z.array(z.string()).optional().default([]),
  summary: z.string().optional().default(""),
  url: z.string().optional().default(""),
  employmentType: z.string().optional().default(""),
  source: z.string().optional().default(""),
  postedAt: z.string().optional().default(""),
});
export const JobsQuerySchema = z.object({
  q: z.string().max(160).optional(),
  locations: z.array(z.string()).optional(),
  remote: z.enum(["all","remote","onsite"]).optional().default("all"),
  tags: z.array(z.string()).optional(),
  companies: z.array(z.string()).optional(),
  employmentType: z.array(z.string()).optional(),
  limit: z.number().int().min(1).max(100).optional().default(40),
  cursor: z.string().optional(),
  resume: z.any().optional()
});
export function parseJobsQuery(body){ const r = JobsQuerySchema.safeParse(body||{}); if(!r.success) throw new Error("ValidationError"); return r.data; }
