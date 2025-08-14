import { NextRequest, NextResponse } from 'next/server';
import { z } from 'zod';
import { generate } from '../../../../lib/ai/client';
import { SYSTEM_SUMMARY, mkSummaryPrompt } from '../../../../lib/ai/prompts';
import { summaryLimiter, getClientIP } from '../../../../lib/ai/rate-limit';

const SummarySchema = z.object({
  profile: z.object({
    name: z.string().optional(),
    title: z.string().optional(),
    years: z.number().optional(),
    skills: z.array(z.string()).optional(),
    domains: z.array(z.string()).optional(),
    achievements: z.array(z.string()).optional(),
  }),
});

export async function POST(request: NextRequest) {
  try {
    // Rate limiting
    const clientIP = getClientIP(request);
    if (!summaryLimiter.consume(clientIP)) {
      return NextResponse.json(
        { ok: false, error: 'Rate limit exceeded. Please try again later.' },
        { status: 429 }
      );
    }

    // Parse and validate input
    const body = await request.json();
    const validatedData = SummarySchema.parse(body);

    // Set timeout
    const controller = new AbortController();
    const timeoutId = setTimeout(() => controller.abort(), 20000);

    try {
      const prompt = mkSummaryPrompt(validatedData.profile);
      const response = await generate({
        system: SYSTEM_SUMMARY,
        prompt,
        maxTokens: 200,
        temperature: 0.7,
      });

      // Clean up the response
      const summary = response
        .trim()
        .replace(/\n+/g, '\n')
        .substring(0, 500); // Limit length

      clearTimeout(timeoutId);
      return NextResponse.json({ ok: true, data: { summary } });
    } catch (error) {
      clearTimeout(timeoutId);
      throw error;
    }
  } catch (error) {
    console.error('Summary generation error:', error);
    
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
      { ok: false, error: 'Failed to generate summary' },
      { status: 500 }
    );
  }
}
