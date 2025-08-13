"use client";

import { useState, useEffect } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { useAuth } from "@/contexts/AuthContext";
import { User, FileText, Briefcase, BookOpen, LogOut } from 'lucide-react';
import Link from 'next/link';

export default function DashboardPage() {
  const { user, isAuthenticated, logout } = useAuth();
  const [resume, setResume] = useState(null);
  
  // Load saved resume on component mount
  useEffect(() => {
    const lastResume = typeof window !== 'undefined' ? localStorage.getItem('cb:resume:last') : null;
    if (lastResume) {
      try {
        const resumeData = JSON.parse(lastResume);
        
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
  }, []);

  const jobAlerts = typeof window !== 'undefined' ? localStorage.getItem('cb:jobs:alerts') : null;

  if (!isAuthenticated) {
    return (
      <div className="min-h-screen">
        {/* Hero Section */}
        <section className="bg-gradient-to-br from-blue-50 to-indigo-100 py-20">
          <div className="container mx-auto px-4 text-center">
            <div className="max-w-4xl mx-auto">
              <h1 className="text-5xl md:text-6xl font-bold tracking-tight mb-6">
                <span className="text-gray-900">Your Career</span>
                <br />
                <span className="text-blue-600">Dashboard</span>
              </h1>
              <p className="text-xl md:text-2xl text-gray-600 mb-12 max-w-3xl mx-auto leading-relaxed">
                Track your progress, manage job alerts, and access personalized recommendations all in one place.
              </p>
            </div>
          </div>
        </section>

        {/* Sign In Required */}
        <section className="py-16 bg-white">
          <div className="container mx-auto px-4">
            <Card className="max-w-md mx-auto border-amber-200 bg-amber-50">
              <CardHeader>
                <CardTitle className="text-amber-800">🔐 Sign In Required</CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-sm text-amber-700 mb-4">
                  To access your personalized dashboard, please sign in to your account.
                </p>
                <Button asChild variant="outline" className="border-amber-300 text-amber-700 w-full">
                  <Link href="/">Sign In</Link>
                </Button>
              </CardContent>
            </Card>
          </div>
        </section>
      </div>
    );
  }

  return (
    <div className="min-h-screen">
      {/* Hero Section */}
      <section className="bg-gradient-to-br from-blue-50 to-indigo-100 py-20">
        <div className="container mx-auto px-4 text-center">
          <div className="max-w-4xl mx-auto">
            <h1 className="text-5xl md:text-6xl font-bold tracking-tight mb-6">
              <span className="text-gray-900">Your Career</span>
              <br />
              <span className="text-blue-600">Dashboard</span>
            </h1>
            <p className="text-xl md:text-2xl text-gray-600 mb-12 max-w-3xl mx-auto leading-relaxed">
              Track your progress, manage job alerts, and access personalized recommendations all in one place.
            </p>
          </div>
        </div>
      </section>

      {/* Dashboard Content */}
      <section className="py-16 bg-white">
        <div className="container mx-auto px-4">
          {/* User Info */}
          <Card className="mb-8 border-blue-200 bg-blue-50">
            <CardHeader>
              <CardTitle className="text-blue-800 flex items-center gap-2">
                <User className="w-5 h-5" />
                Welcome back, {user?.name || 'User'}!
              </CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-blue-700">
                Email: {user?.email}
              </p>
            </CardContent>
          </Card>

          {/* Quick Actions */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
            <Card className="hover:shadow-lg transition-shadow">
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <FileText className="w-5 h-5" />
                  Resume Builder
                </CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-gray-600 mb-4">Create or update your professional resume</p>
                <Button asChild className="w-full">
                  <Link href="/resume">Go to Resume</Link>
                </Button>
              </CardContent>
            </Card>

            <Card className="hover:shadow-lg transition-shadow">
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Briefcase className="w-5 h-5" />
                  Job Search
                </CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-gray-600 mb-4">Find relevant job opportunities</p>
                <Button asChild className="w-full">
                  <Link href="/jobs">Search Jobs</Link>
                </Button>
              </CardContent>
            </Card>

            <Card className="hover:shadow-lg transition-shadow">
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <BookOpen className="w-5 h-5" />
                  Courses
                </CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-gray-600 mb-4">Upskill with recommended courses</p>
                <Button asChild className="w-full">
                  <Link href="/courses">Browse Courses</Link>
                </Button>
              </CardContent>
            </Card>
          </div>

          {/* Resume Status */}
          {resume && (
            <Card className="mb-8 border-green-200 bg-green-50">
              <CardHeader>
                <CardTitle className="text-green-800">📝 Resume Status</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-2">
                  <p className="text-green-700">
                    <strong>Name:</strong> {resume.name || 'Not specified'}
                  </p>
                  <p className="text-green-700">
                    <strong>Title:</strong> {resume.title || 'Not specified'}
                  </p>
                  <p className="text-green-700">
                    <strong>Skills:</strong> {resume.skills?.length || 0} skills added
                  </p>
                  <p className="text-green-700">
                    <strong>Last Updated:</strong> {new Date().toLocaleDateString()}
                  </p>
                </div>
                <Button asChild variant="outline" className="mt-4 border-green-300 text-green-700">
                  <Link href="/resume">Edit Resume</Link>
                </Button>
              </CardContent>
            </Card>
          )}

          {/* Job Alerts */}
          {jobAlerts && (
            <Card className="mb-8 border-orange-200 bg-orange-50">
              <CardHeader>
                <CardTitle className="text-orange-800">🔔 Job Alerts</CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-orange-700">
                  You have active job alerts set up. Check your email for new opportunities.
                </p>
                <Button asChild variant="outline" className="mt-4 border-orange-300 text-orange-700">
                  <Link href="/jobs">Manage Alerts</Link>
                </Button>
              </CardContent>
            </Card>
          )}

          {/* Sign Out */}
          <Card className="border-gray-200">
            <CardHeader>
              <CardTitle className="text-gray-800">Account</CardTitle>
            </CardHeader>
            <CardContent>
              <Button 
                variant="outline" 
                onClick={logout}
                className="flex items-center gap-2"
              >
                <LogOut className="w-4 h-4" />
                Sign Out
              </Button>
            </CardContent>
          </Card>
        </div>
      </section>
    </div>
  );
}

