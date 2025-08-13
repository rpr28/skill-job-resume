"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { useAuth } from "@/lib/auth/client";
import { FileText, Briefcase, BookOpen, TrendingUp, Users, Zap } from "lucide-react";
import Link from "next/link";

export default function HomePage() {
  const { user, isAuthenticated } = useAuth();
  const [email, setEmail] = useState("");

  const handleGetStarted = () => {
    if (email.trim()) {
      // Store email for potential use
      localStorage.setItem("cb:email", email);
      // Redirect to resume builder
      window.location.href = "/resume";
    }
  };

  return (
    <div className="min-h-screen">
      {/* Hero Section */}
      <section className="bg-gradient-to-br from-blue-50 to-indigo-100 py-20">
        <div className="container mx-auto px-4 text-center">
          <div className="max-w-4xl mx-auto">
            <h1 className="text-5xl md:text-6xl font-bold tracking-tight mb-6">
              <span className="text-gray-900">Boost Your Career</span>
              <br />
              <span className="text-blue-600">with AI-Powered Tools</span>
            </h1>
            <p className="text-xl md:text-2xl text-gray-600 mb-12 max-w-3xl mx-auto leading-relaxed">
              Create ATS-friendly resumes, discover relevant job opportunities, and access curated courses to advance your professional journey.
            </p>
            
            {!isAuthenticated ? (
              <div className="flex flex-col sm:flex-row gap-4 justify-center items-center">
                <div className="flex w-full max-w-md">
                  <Input
                    type="email"
                    placeholder="Enter your email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    className="rounded-r-none"
                  />
                  <Button 
                    onClick={handleGetStarted}
                    className="rounded-l-none px-6"
                  >
                    Get Started
                  </Button>
                </div>
              </div>
            ) : (
              <div className="flex flex-col sm:flex-row gap-4 justify-center">
                <Button asChild size="lg" className="px-8 py-3">
                  <Link href="/resume">Build Resume</Link>
                </Button>
                <Button asChild variant="outline" size="lg" className="px-8 py-3">
                  <Link href="/jobs">Find Jobs</Link>
                </Button>
              </div>
            )}
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section className="py-20 bg-white">
        <div className="container mx-auto px-4">
          <div className="text-center mb-16">
            <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4">
              Everything You Need to Succeed
            </h2>
            <p className="text-xl text-gray-600 max-w-2xl mx-auto">
              Our comprehensive platform provides all the tools and resources to accelerate your career growth.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            <Card className="hover:shadow-lg transition-shadow">
              <CardHeader>
                <div className="w-12 h-12 bg-blue-100 rounded-lg flex items-center justify-center mb-4">
                  <FileText className="w-6 h-6 text-blue-600" />
                </div>
                <CardTitle>AI Resume Builder</CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-gray-600">
                  Create professional, ATS-optimized resumes with our intelligent builder. Choose from multiple templates and export as PDF.
                </p>
              </CardContent>
            </Card>

            <Card className="hover:shadow-lg transition-shadow">
              <CardHeader>
                <div className="w-12 h-12 bg-green-100 rounded-lg flex items-center justify-center mb-4">
                  <Briefcase className="w-6 h-6 text-green-600" />
                </div>
                <CardTitle>Smart Job Matching</CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-gray-600">
                  Get personalized job recommendations based on your resume and preferences. Set up alerts for new opportunities.
                </p>
              </CardContent>
            </Card>

            <Card className="hover:shadow-lg transition-shadow">
              <CardHeader>
                <div className="w-12 h-12 bg-purple-100 rounded-lg flex items-center justify-center mb-4">
                  <BookOpen className="w-6 h-6 text-purple-600" />
                </div>
                <CardTitle>Curated Courses</CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-gray-600">
                  Access carefully selected courses to enhance your skills and stay competitive in your field.
                </p>
              </CardContent>
            </Card>

            <Card className="hover:shadow-lg transition-shadow">
              <CardHeader>
                <div className="w-12 h-12 bg-orange-100 rounded-lg flex items-center justify-center mb-4">
                  <TrendingUp className="w-6 h-6 text-orange-600" />
                </div>
                <CardTitle>Career Analytics</CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-gray-600">
                  Track your progress, analyze job market trends, and make data-driven career decisions.
                </p>
              </CardContent>
            </Card>

            <Card className="hover:shadow-lg transition-shadow">
              <CardHeader>
                <div className="w-12 h-12 bg-red-100 rounded-lg flex items-center justify-center mb-4">
                  <Users className="w-6 h-6 text-red-600" />
                </div>
                <CardTitle>Professional Network</CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-gray-600">
                  Connect with industry professionals, mentors, and peers to expand your professional network.
                </p>
              </CardContent>
            </Card>

            <Card className="hover:shadow-lg transition-shadow">
              <CardHeader>
                <div className="w-12 h-12 bg-indigo-100 rounded-lg flex items-center justify-center mb-4">
                  <Zap className="w-6 h-6 text-indigo-600" />
                </div>
                <CardTitle>AI-Powered Insights</CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-gray-600">
                  Leverage artificial intelligence to get personalized career advice and market insights.
                </p>
              </CardContent>
            </Card>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-20 bg-gray-50">
        <div className="container mx-auto px-4 text-center">
          <div className="max-w-3xl mx-auto">
            <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-6">
              Ready to Transform Your Career?
            </h2>
            <p className="text-xl text-gray-600 mb-8">
              Join thousands of professionals who have already accelerated their career growth with CareerBoost.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Button asChild size="lg" className="px-8 py-3">
                <Link href="/resume">Start Building Your Resume</Link>
              </Button>
              <Button asChild variant="outline" size="lg" className="px-8 py-3">
                <Link href="/jobs">Explore Job Opportunities</Link>
              </Button>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}

