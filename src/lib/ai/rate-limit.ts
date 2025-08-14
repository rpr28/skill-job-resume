interface RateLimitBucket {
  tokens: number;
  lastRefill: number;
}

class RateLimiter {
  private buckets: Map<string, RateLimitBucket> = new Map();
  private capacity: number;
  private refillRate: number; // tokens per second
  private refillInterval: number; // milliseconds

  constructor(capacity: number = 10, refillRate: number = 1, refillInterval: number = 1000) {
    this.capacity = capacity;
    this.refillRate = refillRate;
    this.refillInterval = refillInterval;
  }

  private getBucket(key: string): RateLimitBucket {
    const now = Date.now();
    const bucket = this.buckets.get(key);
    
    if (!bucket) {
      const newBucket: RateLimitBucket = {
        tokens: this.capacity,
        lastRefill: now,
      };
      this.buckets.set(key, newBucket);
      return newBucket;
    }

    // Refill tokens
    const timePassed = now - bucket.lastRefill;
    const tokensToAdd = Math.floor((timePassed / this.refillInterval) * this.refillRate);
    
    if (tokensToAdd > 0) {
      bucket.tokens = Math.min(this.capacity, bucket.tokens + tokensToAdd);
      bucket.lastRefill = now;
    }

    return bucket;
  }

  consume(key: string): boolean {
    const bucket = this.getBucket(key);
    
    if (bucket.tokens > 0) {
      bucket.tokens--;
      return true;
    }
    
    return false;
  }

  getRemaining(key: string): number {
    const bucket = this.getBucket(key);
    return bucket.tokens;
  }
}

// Create rate limiters for different endpoints
export const rewriteLimiter = new RateLimiter(5, 1, 1000); // 5 requests per second
export const extractLimiter = new RateLimiter(3, 1, 2000); // 3 requests per 2 seconds
export const summaryLimiter = new RateLimiter(3, 1, 2000);
export const coverLimiter = new RateLimiter(2, 1, 3000); // 2 requests per 3 seconds
export const atsLimiter = new RateLimiter(10, 2, 1000); // 10 requests per second

export function getClientIP(request: Request): string {
  // Try to get IP from various headers
  const forwarded = request.headers.get('x-forwarded-for');
  const realIP = request.headers.get('x-real-ip');
  const cfConnectingIP = request.headers.get('cf-connecting-ip');
  
  if (forwarded) {
    return forwarded.split(',')[0].trim();
  }
  if (realIP) {
    return realIP;
  }
  if (cfConnectingIP) {
    return cfConnectingIP;
  }
  
  // Fallback to a default for local development
  return '127.0.0.1';
}
