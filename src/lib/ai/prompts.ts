// System prompts for different AI tasks
export const SYSTEM_REWRITE = `You are a résumé rewriting assistant. Never invent facts. Prefer strong action verbs, numbers, tools. Keep to one line, ≤28 words, past tense, US spelling, remove pronouns.`;

export const SYSTEM_SUMMARY = `Executive summary, 2–3 crisp lines, role, years, domains, signature strengths. No fluff.`;

export const SYSTEM_COVER = `150–220 words, company- and role-specific, 2 paragraphs + 3 bullet highlights. No generic filler.`;

export const SYSTEM_EXTRACT = `Extract 5-8 STAR-style bullet points from raw experience text. Focus on achievements, metrics, and impact. Use past tense, strong action verbs.`;

// Prompt builders
export function mkRewritePrompt(bullet: string, context?: { role?: string; seniority?: string; stack?: string[] }): string {
  let prompt = `Rewrite this bullet point to be more impactful:\n"${bullet}"`;
  
  if (context) {
    if (context.role) prompt += `\nTarget role: ${context.role}`;
    if (context.seniority) prompt += `\nSeniority level: ${context.seniority}`;
    if (context.stack && context.stack.length > 0) {
      prompt += `\nRelevant technologies: ${context.stack.join(', ')}`;
    }
  }
  
  prompt += `\n\nProvide 2-3 alternatives, each on a new line starting with "- ".`;
  return prompt;
}

export function mkExtractBulletsPrompt(raw: string, role?: string): string {
  let prompt = `Extract 5-8 STAR-style bullet points from this experience:\n\n"${raw}"`;
  
  if (role) {
    prompt += `\n\nTarget role: ${role}`;
  }
  
  prompt += `\n\nProvide bullet points, each on a new line starting with "- ". Focus on achievements, metrics, and impact.`;
  return prompt;
}

export function mkSummaryPrompt(profile: {
  name?: string;
  title?: string;
  years?: number;
  skills?: string[];
  domains?: string[];
  achievements?: string[];
}): string {
  let prompt = `Create a professional summary for:\n`;
  
  if (profile.name) prompt += `Name: ${profile.name}\n`;
  if (profile.title) prompt += `Title: ${profile.title}\n`;
  if (profile.years) prompt += `Years of experience: ${profile.years}\n`;
  if (profile.skills && profile.skills.length > 0) {
    prompt += `Key skills: ${profile.skills.join(', ')}\n`;
  }
  if (profile.domains && profile.domains.length > 0) {
    prompt += `Domains: ${profile.domains.join(', ')}\n`;
  }
  if (profile.achievements && profile.achievements.length > 0) {
    prompt += `Key achievements: ${profile.achievements.join(', ')}\n`;
  }
  
  prompt += `\nWrite a 2-3 line executive summary.`;
  return prompt;
}

export function mkCoverPrompt(profile: any, job: { title: string; company: string; description: string }): string {
  let prompt = `Write a cover letter for:\n`;
  prompt += `Position: ${job.title}\n`;
  prompt += `Company: ${job.company}\n`;
  prompt += `Job Description: ${job.description}\n\n`;
  
  if (profile.name) prompt += `Candidate: ${profile.name}\n`;
  if (profile.title) prompt += `Current role: ${profile.title}\n`;
  if (profile.years) prompt += `Experience: ${profile.years} years\n`;
  if (profile.skills && profile.skills.length > 0) {
    prompt += `Skills: ${profile.skills.join(', ')}\n`;
  }
  
  prompt += `\nWrite a 150-220 word cover letter with 2 paragraphs and 3 bullet highlights.`;
  return prompt;
}
