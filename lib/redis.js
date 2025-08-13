import { Redis } from "@upstash/redis";
export const redis = (process.env.UPSTASH_REDIS_REST_URL && process.env.UPSTASH_REDIS_REST_TOKEN)
  ? new Redis({ url: process.env.UPSTASH_REDIS_REST_URL, token: process.env.UPSTASH_REDIS_REST_TOKEN })
  : null;

export async function cacheGet(k){ if(!redis) return null; return await redis.get(k); }
export async function cacheSet(k,v,ttl){ if(!redis) return; await redis.set(k,v,{ ex: ttl }); }
export async function rateLimit(key, limit=180, windowSec=60){
  if(!redis) return true;
  const bucket = `rl:${key}:${Math.floor(Date.now()/(windowSec*1000))}`;
  const c = await redis.incr(bucket);
  if(c===1) await redis.expire(bucket, windowSec);
  return c <= limit;
}
export async function idemCheck(key, ttl=3600){ if(!redis) return false; const ok = await redis.set(`idem:${key}`,"1",{ nx:true, ex: ttl }); return ok === "OK"; }
