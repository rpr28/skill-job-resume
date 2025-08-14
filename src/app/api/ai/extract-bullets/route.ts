import { NextRequest, NextResponse } from 'next/server';
import { z } from 'zod';
import { generate } from '@/lib/ai/client';
import { SYSTEM_EXTRACT, mkExtractBulletsPrompt } from '@/lib/ai/prompts';
import { extractLimiter, getClientIP } from '@/lib/ai/rate-limit';

const ExtractBulletsSchema = z.object({
  raw: z.string().min(10).max(2000),
  role: z.string().optional(),
});

export async function POST(request: NextRequest) {
  try {
    // Rate limiting
    const clientIP = getClientIP(request);
    if (!extractLimiter.consume(clientIP)) {
      return NextResponse.json(
        { ok: false, error: 'Rate limit exceeded. Please try again later.' },
        { status: 429 }
      );
    }

    // Parse and validate input
    const body = await request.json();
    const validatedData = ExtractBulletsSchema.parse(body);

    // Set timeout
    const controller = new AbortController();
    const timeoutId = setTimeout(() => controller.abort(), 20000);

    try {
      const prompt = mkExtractBulletsPrompt(validatedData.raw, validatedData.role);
      const response = await generate({
        system: SYSTEM_EXTRACT,
        prompt,
        maxTokens: 400,
        temperature: 0.7,
      });

      // Parse the response to extract bullet points
      const bullets = response
        .split('\n')
        .map(line => line.trim())
        .filter(line => line.startsWith('- '))
        .map(line => line.substring(2))
        .filter(line => line.length > 0 && line.length <= 100)
        .slice(0, 8); // Limit to 8 bullets max

      clearTimeout(timeoutId);
      return NextResponse.json({ ok: true, data: { bullets } });
    } catch (error) {
      clearTimeout(timeoutId);
      throw error;
    }
  } catch (error) {
    console.error('Extract bullets error:', error);
    
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
      { ok: false, error: 'Failed to extract bullets' },
      { status: 500 }
    );
  }
}
