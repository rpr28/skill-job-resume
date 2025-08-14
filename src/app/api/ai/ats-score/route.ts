import { NextRequest, NextResponse } from 'next/server';
import { z } from 'zod';
import { scoreMatch } from '@/lib/ai/embeddings-server';
import { atsLimiter, getClientIP } from '@/lib/ai/rate-limit';

const ATSScoreSchema = z.object({
  resumeText: z.string().min(10).max(10000),
  jobText: z.string().min(10).max(10000),
});

// Simple keyword extraction function
function extractKeywords(text: string, maxKeywords: number = 30): string[] {
  // Convert to lowercase and split into words
  const words = text.toLowerCase()
    .replace(/[^\w\s]/g, ' ')
    .split(/\s+/)
    .filter(word => word.length > 2);

  // Create bigrams
  const bigrams: string[] = [];
  for (let i = 0; i < words.length - 1; i++) {
    bigrams.push(`${words[i]} ${words[i + 1]}`);
  }

  // Count frequencies
  const wordFreq: { [key: string]: number } = {};
  const bigramFreq: { [key: string]: number } = {};

  words.forEach(word => {
    wordFreq[word] = (wordFreq[word] || 0) + 1;
  });

  bigrams.forEach(bigram => {
    bigramFreq[bigram] = (bigramFreq[bigram] || 0) + 1;
  });

  // Get top keywords (words and bigrams)
  const allKeywords = [
    ...Object.entries(wordFreq).map(([word, freq]) => ({ text: word, freq })),
    ...Object.entries(bigramFreq).map(([bigram, freq]) => ({ text: bigram, freq }))
  ];

  // Sort by frequency and take top keywords
  const topKeywords = allKeywords
    .sort((a, b) => b.freq - a.freq)
    .slice(0, maxKeywords)
    .map(item => item.text);

  return topKeywords;
}

// Check if keywords are present in resume
function checkKeywordPresence(keywords: string[], resumeText: string): { token: string; inResume: boolean }[] {
  const resumeLower = resumeText.toLowerCase();
  return keywords.map(keyword => ({
    token: keyword,
    inResume: resumeLower.includes(keyword.toLowerCase())
  }));
}

export async function POST(request: NextRequest) {
  try {
    // Rate limiting
    const clientIP = getClientIP(request);
    if (!atsLimiter.consume(clientIP)) {
      return NextResponse.json(
        { ok: false, error: 'Rate limit exceeded. Please try again later.' },
        { status: 429 }
      );
    }

    // Parse and validate input
    const body = await request.json();
    const validatedData = ATSScoreSchema.parse(body);

    // Set timeout
    const controller = new AbortController();
    const timeoutId = setTimeout(() => controller.abort(), 20000);

    try {
      // Calculate semantic similarity score
      const { score } = await scoreMatch(validatedData.resumeText, validatedData.jobText);

      // Extract keywords from job description
      const keywords = extractKeywords(validatedData.jobText, 30);
      const keywordResults = checkKeywordPresence(keywords, validatedData.resumeText);

      clearTimeout(timeoutId);
      return NextResponse.json({ 
        ok: true, 
        data: { 
          score, 
          keywords: keywordResults 
        } 
      });
    } catch (error) {
      clearTimeout(timeoutId);
      throw error;
    }
  } catch (error) {
    console.error('ATS score error:', error);
    
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
      { ok: false, error: 'Failed to calculate ATS score' },
      { status: 500 }
    );
  }
}
