const breakers = new Map(); // key -> { failures, openUntil }

export async function rfetch(url, init={}, { tries=2, timeoutMs=12000, breakerKey } = {}) {
  const key = breakerKey || new URL(url).host;
  const b = breakers.get(key);
  if (b && b.openUntil && Date.now() < b.openUntil) throw new Error(`CircuitOpen:${key}`);
  
  let lastErr;
  for(let i=0;i<tries;i++){
    const ctl = new AbortController(); 
    const t = setTimeout(()=>ctl.abort(), timeoutMs);
    try{
      const res = await fetch(url, { ...init, signal: ctl.signal });
      clearTimeout(t);
      if(res.ok){ 
        breakers.set(key,{ failures:0, openUntil:0 }); 
        return res; 
      }
      lastErr = new Error(`HTTP ${res.status}`); 
    }catch(e){ 
      lastErr = e; 
    }
    await new Promise(r=>setTimeout(r, 300*(i+1) + Math.floor(Math.random()*200)));
  }
  
  const f = breakers.get(key)?.failures || 0;
  const openMs = Math.min(60_000, 2_000 * Math.pow(2, f));
  breakers.set(key,{ failures: f+1, openUntil: Date.now()+openMs });
  throw lastErr;
}







