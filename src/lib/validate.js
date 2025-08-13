import { z } from "zod";

export const resumeSchema = z.object({
  name: z.string().optional(),
  titles: z.array(z.string()).optional(),
  yearsExperience: z.number().int().nonnegative().optional(),
  location: z.string().optional(),
  openToRemote: z.boolean().optional(),
  preferredLocations: z.array(z.string()).optional(),
  skills: z.array(z.string()).optional(),
  domains: z.array(z.string()).optional(),
});

export const jobsQuerySchema = z.object({
  resume: resumeSchema.optional(),
  q: z.string().max(120).optional(),
  location: z.string().max(60).optional(),
  remote: z.enum(["all","remote","onsite"]).optional(),
  limit: z.number().int().min(1).max(100).optional(),
  cursor: z.string().optional(), // for future pagination
});

export function parseBody(schema, body) {
  const r = schema.safeParse(body);
  if (!r.success) { 
    const e = r.error.flatten(); 
    const msg = Object.values(e.fieldErrors).flat().join("; "); 
    throw new Error(`ValidationError: ${msg}`); 
  }
  return r.data;
}







