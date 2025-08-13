import { NextResponse } from "next/server";
import { testCompanySlug } from "@/lib/job-search";

export async function GET() {
  const companies = [
    "notion", "openai", "nvidia", "airbnb", "dropbox", "github", 
    "lyft", "pinterest", "shopify", "spotify", "uber", "netflix", 
    "slack", "twilio", "coursera", "stripe"
  ];
  
  const results = await Promise.all(
    companies.map(async (company) => ({
      company,
      works: await testCompanySlug(company)
    }))
  );
  
  return NextResponse.json({ 
    results,
    working: results.filter(r => r.works).map(r => r.company),
    failing: results.filter(r => !r.works).map(r => r.company)
  });
}

