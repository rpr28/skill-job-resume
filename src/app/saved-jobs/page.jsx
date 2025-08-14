"use client";

import { useEffect, useState } from "react";
import { Button } from "../../components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "../../components/ui/card";
import { toast } from "../../hooks/use-toast";
import { useAuth } from "../../lib/auth/client";
import { api } from "../../lib/api";
import { BookmarkCheck, ExternalLink, Trash2 } from "lucide-react";

const SavedJobs = () => {
  const { isAuthenticated, user } = useAuth();
  const [jobs, setJobs] = useState([]);
  const [loading, setLoading] = useState(false);
  const [nextCursor, setNextCursor] = useState(null);
  const [currentPage, setCurrentPage] = useState(1);

  // Load saved jobs
  const loadSavedJobs = async (cursor = null) => {
    if (!isAuthenticated) return;
    
    setLoading(true);
    try {
      const params = new URLSearchParams();
      if (cursor) params.append('cursor', cursor);
      params.append('limit', '20');
      
      const response = await api.get(`/api/applications?${params}`);
      
      if (cursor) {
        setJobs(prev => [...prev, ...response.applications]);
      } else {
        setJobs(response.applications);
      }
      
      setNextCursor(response.nextCursor);
    } catch (error) {
      console.error('Failed to load saved jobs:', error);
      toast({ title: "Failed to load saved jobs", description: error.message, variant: "destructive" });
    } finally {
      setLoading(false);
    }
  };

  // Load jobs on mount
  useEffect(() => {
    if (isAuthenticated) {
      loadSavedJobs();
    }
  }, [isAuthenticated]);

  // Unsave job with optimistic update
  const unsaveJob = async (applicationId, jobId) => {
    // Optimistically remove from UI
    const originalJobs = [...jobs];
    setJobs(prev => prev.filter(job => job.id !== applicationId));
    
    try {
      await api.delete(`/api/applications/${applicationId}`);
      toast({ title: "Job removed from saved jobs" });
    } catch (error) {
      // Revert on error
      setJobs(originalJobs);
      toast({ title: "Failed to remove job", description: error.message, variant: "destructive" });
    }
  };

  // Load more jobs
  const loadMore = () => {
    if (nextCursor) {
      loadSavedJobs(nextCursor);
      setCurrentPage(prev => prev + 1);
    }
  };

  if (!isAuthenticated) {
    return (
      <div className="min-h-screen bg-gray-50">
        <div className="container mx-auto px-4 py-16">
          <div className="max-w-2xl mx-auto text-center">
            <h1 className="text-3xl font-bold text-gray-900 mb-4">Saved Jobs</h1>
            <p className="text-gray-600 mb-8">Please sign in to view your saved jobs.</p>
            <Button>Sign In</Button>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Hero Section */}
      <section className="bg-gradient-to-br from-blue-50 to-indigo-100 py-20">
        <div className="container mx-auto px-4 text-center">
          <div className="max-w-4xl mx-auto">
            <h1 className="text-5xl md:text-6xl font-bold tracking-tight mb-6">
              <span className="text-gray-900">Your Saved</span>
              <br />
              <span className="text-blue-600">Jobs</span>
            </h1>
            <p className="text-xl md:text-2xl text-gray-600 mb-8 max-w-3xl mx-auto leading-relaxed">
              Keep track of the jobs you're interested in and manage your applications.
            </p>
            {user && (
              <p className="text-lg text-gray-700">
                Welcome back, {user.name || user.email}!
              </p>
            )}
          </div>
        </div>
      </section>

      {/* Main Content */}
      <section className="py-16">
        <div className="container mx-auto px-4">
          {jobs.length > 0 ? (
            <div>
              <h2 className="text-2xl font-bold text-gray-900 mb-6">
                {jobs.length} Saved Job{jobs.length !== 1 ? 's' : ''}
              </h2>
              <div className="grid gap-6">
                {jobs.map((application) => {
                  const job = application.job;
                  return (
                    <Card key={application.id} className="hover:shadow-lg transition-shadow">
                      <CardHeader>
                        <CardTitle className="text-xl text-blue-600">{job.title}</CardTitle>
                        <div className="flex items-center gap-4 text-sm text-gray-600">
                          <span className="font-medium">{job.company}</span>
                          {job.location && (
                            <>
                              <span>•</span>
                              <span>{job.location}</span>
                            </>
                          )}
                          <span>•</span>
                          <span className={`px-2 py-1 rounded-full text-xs ${
                            job.remote ? 'bg-green-100 text-green-800' : 'bg-gray-100 text-gray-800'
                          }`}>
                            {job.remote ? 'Remote' : 'On-site'}
                          </span>
                          <span>•</span>
                          <span className="text-xs text-gray-500">
                            Saved {new Date(application.createdAt).toLocaleDateString()}
                          </span>
                        </div>
                      </CardHeader>
                      <CardContent>
                        {job.summary && (
                          <p className="text-gray-700 mb-4">{job.summary}</p>
                        )}
                        {job.tags && job.tags.length > 0 && (
                          <div className="flex flex-wrap gap-2 mb-4">
                            {job.tags.slice(0, 6).map((tag, tagIndex) => (
                              <span 
                                key={tagIndex} 
                                className="px-2 py-1 bg-blue-100 text-blue-800 text-xs rounded-full"
                              >
                                {tag}
                              </span>
                            ))}
                          </div>
                        )}
                        <div className="flex items-center gap-2">
                          <Button asChild size="sm">
                            <a href={job.url} target="_blank" rel="noopener noreferrer">
                              <ExternalLink className="w-4 h-4 mr-1" />
                              Open Job
                            </a>
                          </Button>
                          <Button 
                            variant="outline" 
                            size="sm"
                            onClick={() => unsaveJob(application.id, job.id)}
                            className="text-red-600 border-red-600 hover:bg-red-50"
                          >
                            <Trash2 className="w-4 h-4 mr-1" />
                            Remove
                          </Button>
                        </div>
                      </CardContent>
                    </Card>
                  );
                })}
              </div>
              
              {/* Load More Button */}
              {nextCursor && (
                <div className="flex justify-center mt-8">
                  <Button
                    onClick={loadMore}
                    disabled={loading}
                    className="px-8 py-3"
                  >
                    {loading ? "Loading..." : "Load More Jobs"}
                  </Button>
                </div>
              )}
            </div>
          ) : (
            <div className="text-center py-12">
              <BookmarkCheck className="w-16 h-16 text-gray-400 mx-auto mb-4" />
              <h2 className="text-2xl font-bold text-gray-900 mb-4">No Saved Jobs Yet</h2>
              <p className="text-gray-600 mb-6">
                Start saving jobs you're interested in to keep track of them here.
              </p>
              <Button asChild>
                <a href="/jobs">Browse Jobs</a>
              </Button>
            </div>
          )}
        </div>
      </section>
    </div>
  );
};

export default SavedJobs;
