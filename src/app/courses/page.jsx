"use client";

import { Input } from "../../components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "../../components/ui/select";
import { Card, CardContent, CardHeader, CardTitle } from "../../components/ui/card";
import { useMemo, useState, useEffect } from "react";
import { courses as COURSES } from "../../data/courses";
import { Button } from "../../components/ui/button";
import { Search } from "lucide-react";

const Courses = () => {
  const [q, setQ] = useState("");
  const [category, setCategory] = useState("all");
  const [resume, setResume] = useState(null);
  const [personalizedCourses, setPersonalizedCourses] = useState([]);
  const [isAuthenticated, setIsAuthenticated] = useState(false);

  // Load saved resume on component mount
  useEffect(() => {
    const token = localStorage.getItem('cb:auth:token');
    const user = localStorage.getItem('cb:auth:user');
    if (token && user) {
      setIsAuthenticated(true);
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
          
          // Generate personalized course recommendations
          if (completeResumeData?.skills?.length) {
            const skillKeywords = completeResumeData.skills.map(skill => skill.toLowerCase());
            const personalized = COURSES
              .filter(course => {
                const courseText = `${course.title} ${course.category || ''}`.toLowerCase();
                return skillKeywords.some(skill => courseText.includes(skill));
              })
              .slice(0, 6);
            setPersonalizedCourses(personalized);
          }
        } catch (e) {
          console.error('Failed to parse saved resume:', e);
        }
      }
    }
  }, []);

  const results = useMemo(() => {
    if (!q && category === "all") return COURSES;
    
    return COURSES.filter(course => {
      const matchesQuery = !q || course.title.toLowerCase().includes(q.toLowerCase()) ||
                          course.description?.toLowerCase().includes(q.toLowerCase()) ||
                          course.platform?.toLowerCase().includes(q.toLowerCase());
      const matchesCategory = category === "all" || course.category === category;
      return matchesQuery && matchesCategory;
    });
  }, [q, category]);

  return (
    <div className="min-h-screen">
      {/* Hero Section */}
      <section className="bg-gradient-to-br from-blue-50 to-indigo-100 py-20">
        <div className="container mx-auto px-4 text-center">
          <div className="max-w-4xl mx-auto">
            <h1 className="text-5xl md:text-6xl font-bold tracking-tight mb-6">
              <span className="text-gray-900">Upskill & Advance Your</span>
              <br />
              <span className="text-blue-600">Career</span>
            </h1>
            <p className="text-xl md:text-2xl text-gray-600 mb-12 max-w-3xl mx-auto leading-relaxed">
              Discover curated courses from top platforms like Coursera, Udemy, and NPT. Learn new skills and stay ahead in your career.
            </p>
            
            {/* Search Section */}
            <div className="max-w-3xl mx-auto">
              <div className="flex flex-col sm:flex-row gap-4">
                <div className="relative flex-1">
                  <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
                  <Input
                    type="text"
                    placeholder="Search courses, skills, or instructors..."
                    value={q}
                    onChange={(e) => setQ(e.target.value)}
                    className="pl-10 py-4 text-lg border-0 shadow-lg"
                  />
                </div>
                <Button size="lg" className="px-8 py-4 text-lg font-semibold">
                  <Search className="mr-2 h-5 w-5" />
                  Search Courses
                </Button>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Main Content */}
      <section className="py-16 bg-white">
        <div className="container mx-auto px-4">
          {/* Filters */}
          <div className="flex flex-col sm:flex-row gap-4 mb-8">
            <Select value={category} onValueChange={setCategory}>
              <SelectTrigger className="w-full sm:w-48">
                <SelectValue placeholder="All Categories" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Categories</SelectItem>
                <SelectItem value="programming">Programming</SelectItem>
                <SelectItem value="design">Design</SelectItem>
                <SelectItem value="business">Business</SelectItem>
                <SelectItem value="marketing">Marketing</SelectItem>
                <SelectItem value="data-science">Data Science</SelectItem>
              </SelectContent>
            </Select>
          </div>

          {/* Personalized Recommendations */}
          {isAuthenticated && personalizedCourses.length > 0 && (
            <div className="mb-12">
              <h2 className="text-2xl font-bold text-gray-900 mb-6">Recommended for You</h2>
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {personalizedCourses.map((course) => (
                  <Card key={course.id} className="hover:shadow-lg transition-shadow">
                    <CardHeader>
                      <CardTitle className="text-lg">{course.title}</CardTitle>
                    </CardHeader>
                    <CardContent>
                      <p className="text-gray-600 mb-4">{course.description}</p>
                      <div className="flex items-center justify-between text-sm text-gray-500">
                        <span>{course.platform}</span>
                        <span>{course.duration}</span>
                      </div>
                      <Button asChild className="w-full mt-4">
                        <a href={course.url} target="_blank" rel="noopener noreferrer">
                          View Course
                        </a>
                      </Button>
                    </CardContent>
                  </Card>
                ))}
              </div>
            </div>
          )}

          {/* All Courses */}
          <div>
            <h2 className="text-2xl font-bold text-gray-900 mb-6">
              {results.length} Courses Found
            </h2>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {results.map((course) => (
                <Card key={course.id} className="hover:shadow-lg transition-shadow">
                  <CardHeader>
                    <CardTitle className="text-lg">{course.title}</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <p className="text-gray-600 mb-4">{course.description}</p>
                    <div className="flex items-center justify-between text-sm text-gray-500">
                      <span>{course.platform}</span>
                      <span>{course.duration}</span>
                    </div>
                    <Button asChild className="w-full mt-4">
                      <a href={course.url} target="_blank" rel="noopener noreferrer">
                        View Course
                      </a>
                    </Button>
                  </CardContent>
                </Card>
              ))}
            </div>
          </div>
        </div>
      </section>
    </div>
  );
};

export default Courses;
