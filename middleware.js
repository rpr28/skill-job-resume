import { NextResponse } from "next/server";

export function middleware(req) {
  const res = NextResponse.next();
  
  // Basic security headers
  res.headers.set("X-Content-Type-Options","nosniff");
  res.headers.set("X-Frame-Options","DENY");
  res.headers.set("Referrer-Policy","strict-origin-when-cross-origin");
  
  // Minimal CSP; tune later
  res.headers.set("Content-Security-Policy","default-src 'self'; img-src 'self' data: https:; script-src 'self' 'unsafe-inline'; style-src 'self' 'unsafe-inline'");
  
  return res;
}

export const config = { matcher: ["/((?!_next/static|_next/image|favicon.ico).*)"] };







