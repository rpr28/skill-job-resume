import { NextRequest, NextResponse } from 'next/server';
import { z } from 'zod';
import { generate } from '@/lib/ai/client';
import { SYSTEM_COVER, mkCoverPrompt } from '@/lib/ai/prompts';
import { coverLimiter, getClientIP } from '@/lib/ai/rate-limit';

const CoverLetterSchema = z.object({
  profile: z.object({
    name: z.string().optional(),
    title: z.string().optional(),
    years: z.number().optional(),
    skills: z.array(z.string()).optional(),
  }),
  job: z.object({
    title: z.string().min(1),
    company: z.string().min(1),
    description: z.string().min(10),
  }),
});

export async function POST(request: NextRequest) {
  try {
    // Rate limiting
    const clientIP = getClientIP(request);
    if (!coverLimiter.consume(clientIP)) {
      return NextResponse.json(
        { ok: false, error: 'Rate limit exceeded. Please try again later.' },
        { status: 429 }
      );
    }

    // Parse and validate input
    const body = await request.json();
    const validatedData = CoverLetterSchema.parse(body);

    // Set timeout
    const controller = new AbortController();
    const timeoutId = setTimeout(() => controller.abort(), 20000);

    try {
      const prompt = mkCoverPrompt(validatedData.profile, validatedData.job);
      const response = await generate({
        system: SYSTEM_COVER,
        prompt,
        maxTokens: 400,
        temperature: 0.7,
      });

      // Clean up the response
      const letter = response
        .trim()
        .replace(/\n+/g, '\n')
        .substring(0, 1000); // Limit length

      clearTimeout(timeoutId);
      return NextResponse.json({ ok: true, data: { letter } });
    } catch (error) {
      clearTimeout(timeoutId);
      throw error;
    }
  } catch (error) {
    console.error('Cover letter generation error:', error);
    
    if (error instanceof z.ZodError) {
      return NextResponse.json(
        { ok: false, error: 'Invalid input data' },
        { status: 400 }
      );
    }

    if (error instanceof Error && error.name === 'AbortError') {
      return NextResponse.json(
        { ok: false, error: 'Request timeout' },
        { status: 408 }
      );
    }

    return NextResponse.json(
      { ok: false, error: 'Failed to generate cover letter' },
      { status: 500 }
    );
  }
}
