"use client";

import { useEffect, useState } from "react";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { toast } from "@/hooks/use-toast";
import { courses } from "@/data/courses";
import { Search, MapPin, Briefcase, ChevronLeft, ChevronRight, Bookmark, BookmarkCheck } from "lucide-react";

const Jobs = () => {
  const [q, setQ] = useState("");
  const [location, setLocation] = useState("all");
  const [remote, setRemote] = useState("all");
  const [email, setEmail] = useState("");
  const [webhookUrl, setWebhookUrl] = useState("");

  const [loading, setLoading] = useState(false);
  const [jobs, setJobs] = useState([]);
  const [resume, setResume] = useState(null);
  const [recommendedCourses, setRecommendedCourses] = useState([]);
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [currentPage, setCurrentPage] = useState(1);
  const [totalJobs, setTotalJobs] = useState(0);
  const [nextCursor, setNextCursor] = useState(null);
  const [prevCursor, setPrevCursor] = useState(null);
  const [cursorHistory, setCursorHistory] = useState([]);
  const [savedJobs, setSavedJobs] = useState(new Set());
  const [authToken, setAuthToken] = useState(null);

  // Check authentication status
  useEffect(() => {
    const token = localStorage.getItem('cb:auth:token');
    const user = localStorage.getItem('cb:auth:user');
    if (token && user) {
      setIsAuthenticated(true);
      setAuthToken(token);
      
      // Load saved jobs
      loadSavedJobs(token);
      
      const savedResume = localStorage.getItem('cb:resume:last');
      if (savedResume) {
        try {
          const resumeData = JSON.parse(savedResume);
          
          // Ensure all required fields exist with defaults
          const completeResumeData = {
            name: "",
            title: "",
            email: "",
            phone: "",
            location: "",
            summary: "",
            skills: [],
            titles: [],
            domains: [],
            openToRemote: true,
            preferredLocations: [],
            experience: [],
            education: [],
            ...resumeData // Override with saved data
          };
          
          setResume(completeResumeData);
        } catch (e) {
          console.error('Failed to parse saved resume:', e);
        }
      }
    }
  }, []);

  // Load saved jobs
  const loadSavedJobs = async (token) => {
    try {
      const res = await fetch("/api/applications", {
        headers: { 
          "Authorization": `Bearer ${token}`,
          "Content-Type": "application/json"
        }
      });
      
      if (res.ok) {
        const data = await res.json();
        const savedJobIds = new Set(data.applications.map(app => app.job.id));
        setSavedJobs(savedJobIds);
      }
    } catch (error) {
      console.error("Failed to load saved jobs:", error);
    }
  };

  // Load saved alert prefs
  useEffect(() => {
    if (isAuthenticated) {
      const saved = localStorage.getItem("cb:jobs:alerts");
      if (saved) {
        try {
          const parsed = JSON.parse(saved);
          setEmail(parsed.email || "");
          setWebhookUrl(parsed.webhookUrl || "");
        } catch {}
      }
    }
  }, [isAuthenticated]);

  // Load default jobs when page loads
  useEffect(() => {
    loadDefaultJobs();
  }, []); // Empty dependency array to run only once on mount

  // Load default jobs
  const loadDefaultJobs = async () => {
    setLoading(true);
    try {
      const res = await fetch("/api/jobs", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ 
          q: "", 
          limit: 20 
        }),
      });
      
      if (!res.ok) {
        throw new Error(`HTTP error! status: ${res.status}`);
      }
      
      const data = await res.json();
      
      if (data.jobs && Array.isArray(data.jobs) && data.jobs.length > 0) {
        setJobs(data.jobs);
        setTotalJobs(data.total || data.jobs.length);
        setNextCursor(data.nextCursor);
        setCurrentPage(1);
        setCursorHistory([]);
      } else {
        setJobs([]);
      }
    } catch (error) {
      console.error('Failed to load default jobs:', error);
      setJobs([]);
    } finally {
      setLoading(false);
    }
  };

  // Generate course recommendations based on resume skills
  const generateCourseRecommendations = (resumeData) => {
    if (!resumeData?.skills?.length) return [];
    
    const skillKeywords = resumeData.skills.map(skill => skill.toLowerCase());
    
    const recommendations = courses
      .filter(course => {
        const courseText = `${course.title} ${course.category || ''}`.toLowerCase();
        return skillKeywords.some(skill => courseText.includes(skill));
      })
      .slice(0, 6);
    
    setRecommendedCourses(recommendations);
    return recommendations;
  };

  // Search jobs
  const searchJobs = async () => {
    if (!q.trim()) {
      toast({ title: "Please enter a job title or keyword", variant: "destructive" });
      return;
    }

    setLoading(true);
    try {
      const requestBody = { 
        q, 
        locations: location === "all" ? [] : [location],
        remote: remote === "all" ? "all" : remote,
        resume: resume || {},
        limit: 20 
      };
      
      const res = await fetch("/api/jobs", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(requestBody),
      });
      
      if (!res.ok) {
        throw new Error(`HTTP error! status: ${res.status}`);
      }
      
      const data = await res.json();
      
      if (data.jobs && Array.isArray(data.jobs)) {
        setJobs(data.jobs);
        setTotalJobs(data.total || data.jobs.length);
        setNextCursor(data.nextCursor);
        setCurrentPage(1);
        setCursorHistory([]);
      } else {
        setJobs([]);
      }
      
      // Generate course recommendations
      if (resume?.skills?.length) {
        generateCourseRecommendations(resume);
      }
      
      toast({ 
        title: `Found ${data.jobs?.length || 0} jobs`, 
        description: `Total available: ${data.total || 0}` 
      });
    } catch (error) {
      console.error("Job search failed:", error);
      toast({ title: "Search failed", description: "Please try again.", variant: "destructive" });
      setJobs([]);
    } finally {
      setLoading(false);
    }
  };

  // Load more jobs (Load More button)
  const loadMoreJobs = async () => {
    if (!nextCursor) return;
    
    setLoading(true);
    try {
      const requestBody = { 
        q, 
        locations: location === "all" ? [] : [location],
        remote: remote === "all" ? "all" : remote,
        resume: resume || {},
        limit: 20,
        cursor: nextCursor
      };
      
      const res = await fetch("/api/jobs", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(requestBody),
      });
      
      if (res.ok) {
        const data = await res.json();
        if (data.jobs && Array.isArray(data.jobs)) {
          setJobs(prevJobs => [...prevJobs, ...data.jobs]);
          setTotalJobs(data.total || data.jobs.length);
          setNextCursor(data.nextCursor);
          setCurrentPage(currentPage + 1);
        }
      }
    } catch (error) {
      console.error("Failed to load more jobs:", error);
      toast({ title: "Failed to load more jobs", description: "Please try again.", variant: "destructive" });
    } finally {
      setLoading(false);
    }
  };

  // Save job
  const saveJob = async (job) => {
    if (!isAuthenticated || !authToken) {
      toast({ title: "Please sign in to save jobs", variant: "destructive" });
      return;
    }

    try {
      const res = await fetch("/api/applications", {
        method: "POST",
        headers: { 
          "Authorization": `Bearer ${authToken}`,
          "Content-Type": "application/json"
        },
        body: JSON.stringify({ job, status: "saved" }),
      });
      
      if (res.ok) {
        setSavedJobs(prev => new Set([...prev, job.id]));
        toast({ title: "Job saved successfully!" });
      } else if (res.status === 409) {
        toast({ title: "Job already saved", variant: "destructive" });
      } else {
        throw new Error("Failed to save job");
      }
    } catch (error) {
      console.error("Failed to save job:", error);
      toast({ title: "Failed to save job", description: "Please try again.", variant: "destructive" });
    }
  };

  // Unsave job
  const unsaveJob = async (job) => {
    if (!isAuthenticated || !authToken) {
      toast({ title: "Please sign in to manage saved jobs", variant: "destructive" });
      return;
    }

    try {
      // Find the application ID for this job
      const res = await fetch("/api/applications", {
        headers: { 
          "Authorization": `Bearer ${authToken}`,
          "Content-Type": "application/json"
        }
      });
      
      if (res.ok) {
        const data = await res.json();
        const application = data.applications.find(app => app.job.id === job.id);
        
        if (application) {
          const deleteRes = await fetch(`/api/applications/${application.id}`, {
            method: "DELETE",
            headers: { 
              "Authorization": `Bearer ${authToken}`,
              "Content-Type": "application/json"
            }
          });
          
          if (deleteRes.ok) {
            setSavedJobs(prev => {
              const newSet = new Set(prev);
              newSet.delete(job.id);
              return newSet;
            });
            toast({ title: "Job removed from saved jobs" });
          } else {
            throw new Error("Failed to remove job");
          }
        }
      }
    } catch (error) {
      console.error("Failed to unsave job:", error);
      toast({ title: "Failed to remove job", description: "Please try again.", variant: "destructive" });
    }
  };

  // Save job alerts
  const saveAlerts = () => {
    if (!email) {
      toast({ title: "Email required", description: "Please enter your email address.", variant: "destructive" });
      return;
    }

    const alertData = { email, webhookUrl, q, location, remote };
    localStorage.setItem("cb:jobs:alerts", JSON.stringify(alertData));
    
    toast({ 
      title: "Alerts saved!", 
      description: "You'll be notified of new job opportunities." 
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
              Search thousands of job opportunities, set up personalized alerts, and get matched with roles that fit your skills and career goals.
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
                      <SelectItem value="hybrid">Hybrid</SelectItem>
                      <SelectItem value="on-site">On-Site</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </div>
              <div className="flex flex-col sm:flex-row gap-4 justify-center">
                <Button 
                  size="lg" 
                  className="px-8 py-4 text-lg font-semibold w-full md:w-auto"
                  onClick={searchJobs}
                  disabled={loading}
                >
                  {loading ? "Searching..." : "Search Jobs"}
                </Button>
                <Button 
                  variant="outline"
                  size="lg" 
                  className="px-8 py-4 text-lg font-semibold w-full md:w-auto"
                  onClick={loadDefaultJobs}
                  disabled={loading}
                >
                  Browse All Jobs
                </Button>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Main Content */}
      <section className="py-16 bg-white">
        <div className="container mx-auto px-4">
          {/* Job Results */}
          {jobs.length > 0 ? (
            <div className="mb-12">
              <h2 className="text-2xl font-bold text-gray-900 mb-6">
                {jobs.length} Jobs Found
              </h2>
              <div className="grid gap-6">
                {jobs.map((job, index) => (
                  <Card key={index} className="hover:shadow-lg transition-shadow">
                    <CardHeader>
                      <CardTitle className="text-xl text-blue-600">{job.title}</CardTitle>
                      <div className="flex items-center gap-4 text-sm text-gray-600">
                        <span className="font-medium">{job.company}</span>
                        {job.location && (
                          <>
                            <span>•</span>
                            <span>{job.location || 'Location not specified'}</span>
                          </>
                        )}
                        <span>•</span>
                        <span className={`px-2 py-1 rounded-full text-xs ${
                          job.remote ? 'bg-green-100 text-green-800' : 'bg-gray-100 text-gray-800'
                        }`}>
                          {job.remote ? 'Remote' : 'On-site'}
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
                            Apply Now
                          </a>
                        </Button>
                        {savedJobs.has(job.id) ? (
                          <Button 
                            variant="outline" 
                            size="sm"
                            onClick={() => unsaveJob(job)}
                            className="text-green-600 border-green-600 hover:bg-green-50"
                          >
                            <BookmarkCheck className="w-4 h-4 mr-1" />
                            Saved
                          </Button>
                        ) : (
                          <Button 
                            variant="outline" 
                            size="sm"
                            onClick={() => saveJob(job)}
                          >
                            <Bookmark className="w-4 h-4 mr-1" />
                            Save Job
                          </Button>
                        )}
                      </div>
                    </CardContent>
                  </Card>
                ))}
              </div>
              
              {/* Load More Button */}
              {nextCursor && (
                <div className="flex justify-center mt-8">
                  <Button
                    onClick={loadMoreJobs}
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
              <h2 className="text-2xl font-bold text-gray-900 mb-4">No Jobs Found</h2>
              <p className="text-gray-600 mb-6">
                {loading ? "Searching for jobs..." : "Try searching with different keywords or browse all available jobs."}
              </p>
              {!loading && (
                <div className="flex flex-col sm:flex-row gap-4 justify-center">
                  <Button onClick={loadDefaultJobs}>
                    Browse All Jobs
                  </Button>
                  <Button 
                    variant="outline"
                    onClick={() => {
                      setQ("software engineer");
                      searchJobs();
                    }}
                  >
                    Load Sample Jobs
                  </Button>
                </div>
              )}
            </div>
          )}

          {/* Job Alerts Setup */}
          {isAuthenticated && (
            <Card className="border-blue-200 bg-blue-50">
              <CardHeader>
                <CardTitle className="text-blue-800">🔔 Set Up Job Alerts</CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-sm text-blue-700 mb-4">
                  Get notified when new jobs matching your criteria are posted.
                </p>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
                  <Input
                    type="email"
                    placeholder="Email address"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                  />
                  <Input
                    type="url"
                    placeholder="Webhook URL (optional)"
                    value={webhookUrl}
                    onChange={(e) => setWebhookUrl(e.target.value)}
                  />
                </div>
                <Button onClick={saveAlerts} className="bg-blue-600 hover:bg-blue-700">
                  Save Alert Preferences
                </Button>
              </CardContent>
            </Card>
          )}

          {/* Course Recommendations */}
          {recommendedCourses.length > 0 && (
            <Card className="mt-8 border-green-200 bg-green-50">
              <CardHeader>
                <CardTitle className="text-green-800">💡 Upskill for Better Opportunities</CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-sm text-green-700 mb-4">
                  These courses can help you qualify for more job opportunities:
                </p>
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                  {recommendedCourses.map((course) => (
                    <a
                      key={course.id}
                      href={course.url}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="block p-4 bg-white rounded-lg border border-green-200 hover:border-green-300 transition-colors"
                    >
                      <div className="font-medium text-green-800 mb-1">{course.title}</div>
                      <div className="text-sm text-green-600 mb-2">{course.platform} • {course.level}</div>
                      <div className="text-xs text-green-500">{course.duration}</div>
                    </a>
                  ))}
                </div>
              </CardContent>
            </Card>
          )}
        </div>
      </section>
    </div>
  );
};

export default Jobs;
