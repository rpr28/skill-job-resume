import { NextResponse } from "next/server";
import { cacheGet } from "@/lib/redis";
import { aggregateJobs } from "@/lib/jobs/service";

export async function GET() {
  try {
    // Try to get jobs from cache or live aggregation
    let base = await cacheGet("jobs:base:v1");
    if (!base || base.length < 10) {
      try {
        base = await aggregateJobs();
      } catch (error) {
        console.log("Live aggregation failed, using sample data:", error.message);
        // Use sample data for suggestions
        base = [
          {
            id: "sample_1",
            title: "Senior React Developer",
            company: "TechCorp",
            location: "San Francisco, CA",
            remote: true,
            tags: ["react", "javascript", "typescript"],
            summary: "We're looking for a senior React developer to join our team.",
            url: "https://example.com/job1",
            employmentType: "Full-time",
            source: "sample",
            postedAt: "2025-01-13"
          },
          {
            id: "sample_2",
            title: "Frontend Engineer",
            company: "StartupXYZ",
            location: "Remote",
            remote: true,
            tags: ["react", "vue", "frontend"],
            summary: "Join our growing team as a frontend engineer.",
            url: "https://example.com/job2",
            employmentType: "Full-time",
            source: "sample",
            postedAt: "2025-01-12"
          },
          {
            id: "sample_3",
            title: "Full Stack Developer",
            company: "BigTech Inc",
            location: "New York, NY",
            remote: false,
            tags: ["react", "node", "python"],
            summary: "Full stack role with React and Node.js experience required.",
            url: "https://example.com/job3",
            employmentType: "Full-time",
            source: "sample",
            postedAt: "2025-01-11"
          },
          {
            id: "sample_4",
            title: "DevOps Engineer",
            company: "CloudTech",
            location: "Austin, TX",
            remote: true,
            tags: ["aws", "docker", "kubernetes"],
            summary: "Join our DevOps team to build scalable infrastructure.",
            url: "https://example.com/job4",
            employmentType: "Full-time",
            source: "sample",
            postedAt: "2025-01-10"
          },
          {
            id: "sample_5",
            title: "Data Scientist",
            company: "AnalyticsPro",
            location: "Boston, MA",
            remote: false,
            tags: ["python", "machine learning", "sql"],
            summary: "Help us build predictive models and insights.",
            url: "https://example.com/job5",
            employmentType: "Full-time",
            source: "sample",
            postedAt: "2025-01-09"
          }
        ];
      }
    }

    // Extract suggestions from jobs
    const tags = new Set();
    const companies = new Set();
    const locations = new Set();

    base.forEach(job => {
      // Add tags
      if (job.tags && Array.isArray(job.tags)) {
        job.tags.forEach(tag => tags.add(tag.toLowerCase()));
      }
      
      // Add company
      if (job.company) {
        companies.add(job.company);
      }
      
      // Add location
      if (job.location) {
        locations.add(job.location);
      }
    });

    // Convert to arrays and limit to top suggestions
    const suggestions = {
      tags: Array.from(tags).slice(0, 10),
      companies: Array.from(companies).slice(0, 10),
      locations: Array.from(locations).slice(0, 10)
    };

    return NextResponse.json(suggestions);
  } catch (error) {
    console.error("Suggestions API error:", error);
    // Fallback suggestions
    return NextResponse.json({
      tags: ["react", "javascript", "python", "node", "aws", "docker", "kubernetes", "machine learning", "frontend", "backend"],
      companies: ["TechCorp", "StartupXYZ", "BigTech Inc", "CloudTech", "AnalyticsPro"],
      locations: ["San Francisco, CA", "Remote", "New York, NY", "Austin, TX", "Boston, MA"]
    });
  }
}
