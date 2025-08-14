"use client";

import Link from "next/link";
import { Button } from "./ui/button";
import { useAuth } from "../lib/auth/client";
import { LoginDialog } from "./auth/LoginDialog";
import { SignupDialog } from "./auth/SignupDialog";
import { LogOut, User } from "lucide-react";

const Header = () => {
  const { user, isAuthenticated, logout } = useAuth();

  return (
    <header className="border-b bg-white/95 backdrop-blur supports-[backdrop-filter]:bg-white/60">
      <div className="container mx-auto px-4">
        <div className="flex h-16 items-center justify-between">
          {/* Logo */}
          <Link href="/" className="flex items-center space-x-2">
            <div className="h-8 w-8 rounded-lg bg-gradient-to-br from-blue-600 to-indigo-600 flex items-center justify-center">
              <span className="text-white font-bold text-sm">CB</span>
            </div>
            <span className="font-bold text-xl text-gray-900">CareerBoost</span>
          </Link>

          {/* Navigation */}
          <nav className="hidden md:flex items-center space-x-8">
            <Link href="/jobs" className="text-gray-600 hover:text-gray-900 transition-colors">
              Jobs
            </Link>
            <Link href="/resume" className="text-gray-600 hover:text-gray-900 transition-colors">
              Resume
            </Link>
            <Link href="/courses" className="text-gray-600 hover:text-gray-900 transition-colors">
              Courses
            </Link>
            <Link href="/blog" className="text-gray-600 hover:text-gray-900 transition-colors">
              Blog
            </Link>
            {isAuthenticated && (
              <Link href="/saved-jobs" className="text-gray-600 hover:text-gray-900 transition-colors">
                Saved Jobs
              </Link>
            )}
          </nav>

          {/* Auth Buttons */}
          <div className="flex items-center space-x-4">
            {isAuthenticated ? (
              <div className="flex items-center space-x-4">
                <span className="text-sm text-gray-600">
                  Hi, {user?.name || user?.email}
                </span>
                <Button
                  variant="outline"
                  size="sm"
                  onClick={logout}
                  className="flex items-center space-x-2"
                >
                  <LogOut className="w-4 h-4" />
                  <span>Logout</span>
                </Button>
              </div>
            ) : (
              <div className="flex items-center space-x-2">
                <LoginDialog />
                <SignupDialog />
              </div>
            )}
          </div>
        </div>
      </div>
    </header>
  );
};

export default Header;
