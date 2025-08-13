"use client";

import Link from "next/link";
import { Button } from "@/components/ui/button";
import { useAuth } from "@/contexts/AuthContext";

export default function Header() {
  const { user, isAuthenticated, logout } = useAuth();

  return (
    <header className="w-full border-b border-gray-200 bg-white">
      <div className="container mx-auto px-4">
        <div className="flex items-center justify-between h-16">
          {/* Logo */}
          <Link href="/" className="text-xl font-bold text-blue-600">
            CareerBoost
          </Link>

          {/* Navigation */}
          <nav className="hidden md:flex items-center space-x-8">
            <Link href="/resume" className="text-gray-600 hover:text-blue-600 transition-colors">
              Resume
            </Link>
            <Link href="/jobs" className="text-gray-600 hover:text-blue-600 transition-colors">
              Jobs
            </Link>
            <Link href="/courses" className="text-gray-600 hover:text-blue-600 transition-colors">
              Courses
            </Link>
            <Link href="/blog" className="text-gray-600 hover:text-blue-600 transition-colors">
              Blog
            </Link>
          </nav>

          {/* Auth Buttons */}
          <div className="flex items-center space-x-4">
            {isAuthenticated ? (
              <div className="flex items-center space-x-4">
                <span className="text-sm text-gray-600">Welcome, {user?.name || 'User'}</span>
                <Button variant="outline" onClick={logout}>
                  Logout
                </Button>
              </div>
            ) : (
              <div className="flex items-center space-x-2">
                <Button variant="outline" asChild>
                  <Link href="/auth?mode=signin">Sign In</Link>
                </Button>
                <Button asChild>
                  <Link href="/auth?mode=signup">Sign Up</Link>
                </Button>
              </div>
            )}
          </div>
        </div>
      </div>
    </header>
  );
}
