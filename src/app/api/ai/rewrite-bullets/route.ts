import { NextRequest, NextResponse } from 'next/server';
import { z } from 'zod';
import { generate } from '../../../../lib/ai/client';
import { SYSTEM_REWRITE, mkRewritePrompt } from '../../../../lib/ai/prompts';
import { rewriteLimiter, getClientIP } from '../../../../lib/ai/rate-limit';

const RewriteBulletsSchema = z.object({
  bullets: z.array(z.string().min(1).max(500)).min(1).max(10),
  context: z.object({
    role: z.string().optional(),
    seniority: z.string().optional(),
    stack: z.array(z.string()).optional(),
  }).optional(),
});

export async function POST(request: NextRequest) {
  try {
    // Rate limiting
    const clientIP = getClientIP(request);
    if (!rewriteLimiter.consume(clientIP)) {
      return NextResponse.json(
        { ok: false, error: 'Rate limit exceeded. Please try again later.' },
        { status: 429 }
      );
    }

    // Parse and validate input
    const body = await request.json();
    const validatedData = RewriteBulletsSchema.parse(body);

    // Set timeout
    const controller = new AbortController();
    const timeoutId = setTimeout(() => controller.abort(), 20000);

    try {
      const variants = await Promise.all(
        validatedData.bullets.map(async (bullet) => {
          const prompt = mkRewritePrompt(bullet, validatedData.context);
          const response = await generate({
            system: SYSTEM_REWRITE,
            prompt,
            maxTokens: 200,
            temperature: 0.7,
          });

          // Parse the response to extract variants
          const lines = response
            .split('\n')
            .map(line => line.trim())
            .filter(line => line.startsWith('- '))
            .map(line => line.substring(2))
            .filter(line => line.length > 0 && line.length <= 28);

          return {
            original: bullet,
            v1: lines[0] || bullet,
            v2: lines[1] || bullet,
            v3: lines[2] || undefined,
          };
        })
      );

      clearTimeout(timeoutId);
      return NextResponse.json({ ok: true, data: { variants } });
    } catch (error) {
      clearTimeout(timeoutId);
      throw error;
    }
  } catch (error) {
    console.error('Rewrite bullets error:', error);
    
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
      { ok: false, error: 'Failed to rewrite bullets' },
      { status: 500 }
    );
  }
}
