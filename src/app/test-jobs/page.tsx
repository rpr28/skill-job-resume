"use client";

import { useState } from "react";
import { type Resume } from "@/lib/job-search";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";

export default function TestJobsPage() {
  const [resume, setResume] = useState<Resume>({
    skills: ["React", "TypeScript", "JavaScript"],
    titles: ["Frontend Engineer", "Software Developer"],
    openToRemote: true,
    preferredLocations: ["San Francisco", "New York"]
  });
  const [jobs, setJobs] = useState<any[]>([]);
  const [loading, setLoading] = useState(false);
  const [status, setStatus] = useState<string>("");

  const testJobSearch = async () => {
    setLoading(true);
    setStatus("Searching for jobs...");
    try {
      console.log("Testing job search with resume:", resume);
      const response = await fetch('/api/jobs', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ resume, limit: 10 })
      });
      
      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }
      
      const data = await response.json();
      console.log("Job search results:", data.jobs);
      console.log("Number of jobs found:", data.jobs?.length || 0);
      setJobs(data.jobs || []);
      setStatus(`Found ${data.jobs?.length || 0} jobs`);
    } catch (error) {
      console.error("Job search error:", error);
      setStatus(`Error: ${error.message}`);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="container mx-auto py-10">
      <h1 className="text-2xl font-semibold mb-6">Job Search Engine Test</h1>
      
      <Card className="mb-6">
        <CardHeader>
          <CardTitle>Test Resume</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div>
            <Label>Skills (comma separated)</Label>
            <Input 
              value={resume.skills?.join(", ")} 
              onChange={(e) => setResume({
                ...resume, 
                skills: e.target.value.split(",").map(s => s.trim()).filter(Boolean)
              })}
              placeholder="React, TypeScript, JavaScript"
            />
          </div>
          <div>
            <Label>Titles (comma separated)</Label>
            <Input 
              value={resume.titles?.join(", ")} 
              onChange={(e) => setResume({
                ...resume, 
                titles: e.target.value.split(",").map(s => s.trim()).filter(Boolean)
              })}
              placeholder="Frontend Engineer, Software Developer"
            />
          </div>
          <Button onClick={testJobSearch} disabled={loading}>
            {loading ? "Searching..." : "Test Job Search"}
          </Button>
          {status && (
            <p className="text-sm text-muted-foreground">{status}</p>
          )}
        </CardContent>
      </Card>

      {jobs.length > 0 && (
        <Card>
          <CardHeader>
            <CardTitle>Search Results ({jobs.length} jobs)</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {jobs.map((job) => (
                <div key={job.id} className="border rounded-lg p-4">
                  <h3 className="font-semibold">{job.title}</h3>
                  <p className="text-sm text-muted-foreground">{job.company} • {job.location} {job.remote ? '• Remote' : ''}</p>
                  <p className="text-sm mt-2">{job.summary}</p>
                  <div className="flex gap-2 mt-2">
                    {job.tags?.slice(0, 3).map((tag: string) => (
                      <span key={tag} className="px-2 py-1 bg-secondary text-secondary-foreground text-xs rounded">
                        {tag}
                      </span>
                    ))}
                  </div>
                  {job.url && (
                    <div className="mt-3">
                      <Button 
                        variant="outline" 
                        size="sm"
                        onClick={() => window.open(job.url, '_blank')}
                      >
                        View Job
                      </Button>
                      <p className="text-xs text-muted-foreground mt-1">URL: {job.url}</p>
                    </div>
                  )}
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      )}
    </div>
  );
}
