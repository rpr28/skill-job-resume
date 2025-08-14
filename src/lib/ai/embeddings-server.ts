// Server-side embeddings using a simpler approach
// This avoids the @xenova/transformers issues in Next.js

// Simple TF-IDF based similarity scoring
function tokenize(text: string): string[] {
  return text.toLowerCase()
    .replace(/[^\w\s]/g, ' ')
    .split(/\s+/)
    .filter(word => word.length > 2);
}

function calculateTFIDF(text: string, allTexts: string[]): { [key: string]: number } {
  const tokens = tokenize(text);
  const tf: { [key: string]: number } = {};
  
  // Calculate term frequency
  tokens.forEach(token => {
    tf[token] = (tf[token] || 0) + 1;
  });
  
  // Normalize by document length
  const docLength = tokens.length;
  Object.keys(tf).forEach(token => {
    tf[token] = tf[token] / docLength;
  });
  
  // Calculate IDF (simplified)
  const allTokens = allTexts.flatMap(t => tokenize(t));
  const uniqueTokens = new Set(allTokens);
  const idf: { [key: string]: number } = {};
  
  uniqueTokens.forEach(token => {
    const docsWithToken = allTexts.filter(t => 
      tokenize(t).includes(token)
    ).length;
    idf[token] = Math.log(allTexts.length / (docsWithToken + 1));
  });
  
  // Calculate TF-IDF
  const tfidf: { [key: string]: number } = {};
  Object.keys(tf).forEach(token => {
    tfidf[token] = tf[token] * (idf[token] || 0);
  });
  
  return tfidf;
}

function cosineSimilarity(vec1: { [key: string]: number }, vec2: { [key: string]: number }): number {
  const allKeys = new Set([...Object.keys(vec1), ...Object.keys(vec2)]);
  
  let dotProduct = 0;
  let norm1 = 0;
  let norm2 = 0;
  
  allKeys.forEach(key => {
    const val1 = vec1[key] || 0;
    const val2 = vec2[key] || 0;
    dotProduct += val1 * val2;
    norm1 += val1 * val1;
    norm2 += val2 * val2;
  });
  
  if (norm1 === 0 || norm2 === 0) return 0;
  
  return dotProduct / (Math.sqrt(norm1) * Math.sqrt(norm2));
}

export async function scoreMatch(resumeText: string, jobText: string): Promise<{ score: number }> {
  try {
    const tfidf1 = calculateTFIDF(resumeText, [resumeText, jobText]);
    const tfidf2 = calculateTFIDF(jobText, [resumeText, jobText]);
    
    const similarity = cosineSimilarity(tfidf1, tfidf2);
    
    // Convert similarity to percentage (0-100)
    const score = Math.round(Math.max(0, Math.min(100, similarity * 100)));
    
    return { score };
  } catch (error) {
    console.error('Score calculation failed:', error);
    return { score: 0 };
  }
}
