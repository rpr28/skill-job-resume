"use client";

import { useEffect, useState } from "react";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Badge } from "@/components/ui/badge";
import { toast } from "@/hooks/use-toast";
import { useAuth } from "@/lib/auth/client";
import { api } from "@/lib/api";
import { SavedToggle } from "@/components/jobs/SavedToggle";
import { Search, MapPin, Briefcase, ChevronLeft, ChevronRight } from "lucide-react";

function useJobs(params) {
  const { q, location, remote, page, pageSize } = params;
  const [data, setData] = useState({ items: [], total: 0, totalPages: 1, page });
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    const qs = new URLSearchParams();
    if (q) qs.set("q", q);
    if (location) qs.set("location", location);
    if (remote) qs.set("remote", remote);
    qs.set("page", String(page));
    qs.set("pageSize", String(pageSize));

    setLoading(true);
    fetch(`/api/jobs?${qs.toString()}`)
      .then((r) => r.json())
      .then((json) => setData(json))
      .catch((error) => {
        console.error("Failed to fetch jobs:", error);
        setData({ items: [], total: 0, totalPages: 1, page });
      })
      .finally(() => setLoading(false));
  }, [q, location, remote, page, pageSize]);

  return { ...data, loading };
}

const Jobs = () => {
  const { isAuthenticated } = useAuth();
  const [q, setQ] = useState("");
  const [location, setLocation] = useState("all");
  const [remote, setRemote] = useState("all");
  const [page, setPage] = useState(1);
  const pageSize = 10;

  const { items, total, totalPages, loading } = useJobs({ q, location, remote, page, pageSize });

  // Reset page to 1 when filters change
  useEffect(() => { 
    setPage(1); 
  }, [q, location, remote]);

  // Calculate page numbers for pagination
  const numbers = (() => {
    const windowSize = 5;
    const start = Math.max(1, page - 2);
    const end = Math.min(totalPages, start + windowSize - 1);
    const actualStart = Math.max(1, end - windowSize + 1);
    return Array.from({ length: end - actualStart + 1 }, (_, i) => actualStart + i);
  })();

  // Handle save/unsave toggle
  const handleSaveToggle = (jobId, saved) => {
    // This would typically update the saved jobs state
    // For now, just show a toast
    toast({ 
      title: saved ? "Job saved!" : "Job removed", 
      description: saved ? "Added to your saved jobs" : "Removed from saved jobs" 
    });
  };

  return (
    <div className="min-h-screen">
      {/* Hero Section */}
      <section className="bg-gradient-to-br from-blue-50 to-indigo-100 py-20">
        <div className="container mx-auto px-4 text-center">
          <div className="max-w-4xl mx-auto">
            <h1 className="text-5xl md:text-6xl font-bold tracking-tight mb-6">
              <span className="text-gray-900">Find Your Dream</span>
              <br />
              <span className="text-blue-600">Job</span>
            </h1>
            <p className="text-xl md:text-2xl text-gray-600 mb-12 max-w-3xl mx-auto leading-relaxed">
              Search thousands of job opportunities and get matched with roles that fit your skills and career goals.
            </p>
            
            {/* Job Search Section */}
            <div className="max-w-4xl mx-auto">
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
                <div className="relative">
                  <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
                  <Input
                    type="text"
                    placeholder="Job title or keyword"
                    value={q}
                    onChange={(e) => setQ(e.target.value)}
                    className="pl-10 py-4 text-lg border-0 shadow-lg"
                  />
                </div>
                <div className="relative">
                  <MapPin className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
                  <Select value={location} onValueChange={setLocation}>
                    <SelectTrigger className="pl-10 py-4 text-lg border-0 shadow-lg">
                      <SelectValue placeholder="Location" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="all">All Locations</SelectItem>
                      <SelectItem value="remote">Remote</SelectItem>
                      <SelectItem value="usa">USA</SelectItem>
                      <SelectItem value="europe">Europe</SelectItem>
                      <SelectItem value="india">India</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                <div className="relative">
                  <Briefcase className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
                  <Select value={remote} onValueChange={setRemote}>
                    <SelectTrigger className="pl-10 py-4 text-lg border-0 shadow-lg">
                      <SelectValue placeholder="Work Type" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="all">All Types</SelectItem>
                      <SelectItem value="remote">Remote</SelectItem>
                      <SelectItem value="onsite">Onsite</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Main Content */}
      <section className="py-16 bg-white">
        <div className="container mx-auto px-4">
          {/* Search Results Header */}
          <div className="mb-8">
            <div className="text-sm text-muted-foreground mb-4">
              {loading ? "Loading…" : `Showing ${items.length} of ${total} results`}
            </div>
          </div>

          {/* Job Results */}
          {items.length > 0 ? (
            <div className="mb-12">
              <div className="grid md:grid-cols-2 gap-4">
                {items.map((job) => (
                  <Card key={job.id} className="transition duration-200 hover:shadow-sm">
                    <CardHeader className="pb-2">
                      <CardTitle className="text-base">{job.title}</CardTitle>
                    </CardHeader>
                    <CardContent className="text-sm text-muted-foreground">
                      <div className="flex items-center gap-2 mb-3">
                        <span className="font-medium text-foreground">{job.company}</span>
                        <span>·</span>
                        <span>{job.location || "—"}</span>
                        <span>·</span>
                        <span className={`px-2 py-0.5 rounded border text-xs ${
                          job.remote ? "border-green-600 text-green-700" : "border-slate-400"
                        }`}>
                          {job.remote ? "Remote" : "Onsite"}
                        </span>
                      </div>

                      {job.tags?.length > 0 && (
                        <div className="flex gap-2 flex-wrap mb-3">
                          {job.tags.slice(0, 5).map((tag) => (
                            <span key={tag} className="px-2 py-1 rounded-md bg-secondary text-secondary-foreground text-xs">
                              {tag}
                            </span>
                          ))}
                        </div>
                      )}

                      <div className="flex items-center justify-between">
                        <a 
                          href={job.url} 
                          target="_blank" 
                          rel="noreferrer" 
                          className="text-primary underline text-sm"
                        >
                          Apply
                        </a>
                        {isAuthenticated && (
                          <SavedToggle 
                            job={job}
                            isSaved={false}
                            onToggle={(saved) => handleSaveToggle(job.id, saved)}
                          />
                        )}
                      </div>
                    </CardContent>
                  </Card>
                ))}
              </div>
              
              {/* Pagination */}
              {totalPages > 1 && (
                <div className="flex items-center justify-center gap-2 pt-8">
                  <Button 
                    variant="outline" 
                    size="sm" 
                    onClick={() => setPage((p) => Math.max(1, p - 1))} 
                    disabled={page <= 1 || loading}
                  >
                    <ChevronLeft className="w-4 h-4 mr-1" />
                    Prev
                  </Button>

                  {numbers.map((n) => (
                    <Button
                      key={n}
                      size="sm"
                      variant={n === page ? "default" : "outline"}
                      onClick={() => setPage(n)}
                      disabled={loading}
                    >
                      {n}
                    </Button>
                  ))}

                  <Button 
                    variant="outline" 
                    size="sm" 
                    onClick={() => setPage((p) => Math.min(totalPages, p + 1))} 
                    disabled={page >= totalPages || loading}
                  >
                    Next
                    <ChevronRight className="w-4 h-4 ml-1" />
                  </Button>
                </div>
              )}
            </div>
          ) : (
            <div className="text-center py-12">
              <h2 className="text-2xl font-bold text-gray-900 mb-4">No Jobs Found</h2>
              <p className="text-gray-600 mb-6">
                {loading ? "Searching for jobs..." : "Try searching with different keywords or browse all available jobs."}
              </p>
              {!loading && (
                <Button 
                  variant="outline"
                  onClick={() => {
                    setQ("software engineer");
                    setPage(1);
                  }}
                >
                  Load Sample Jobs
                </Button>
              )}
            </div>
          )}
        </div>
      </section>
    </div>
  );
};

export default Jobs;
