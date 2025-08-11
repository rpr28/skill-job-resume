"use client";

import Link from "next/link";
import { Button } from "@/components/ui/button";
import { useEffect, useState } from "react";

const navItems = [
  { to: "/resume", label: "Resume" },
  { to: "/jobs", label: "Jobs" },
  { to: "/courses", label: "Courses" },
  { to: "/dashboard", label: "Dashboard" },
  { to: "/blog", label: "Blog" },
];

export default function Layout({ children }: { children: React.ReactNode }) {
  const [scrolled, setScrolled] = useState(false);
  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 8);
    window.addEventListener("scroll", onScroll);
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  return (
    <div className="min-h-screen flex flex-col">
      <header className={`sticky top-0 z-40 backdrop-blur supports-[backdrop-filter]:bg-background/70 ${scrolled ? 'border-b' : ''}`}>
        <div className="container mx-auto flex h-16 items-center justify-between">
          <Link href="/" className="font-semibold">CareerBoost</Link>
          <nav className="hidden md:flex items-center gap-6 text-sm">
            {navItems.map((item) => (
              <Link
                key={item.to}
                href={item.to}
                className="text-muted-foreground hover:text-foreground"
              >
                {item.label}
              </Link>
            ))}
          </nav>
          <div className="flex items-center gap-2">
            <Button asChild variant="outline" size="sm">
              <Link href="/resume">Get Started</Link>
            </Button>
            <Button asChild variant="hero" size="sm">
              <Link href="#upgrade">Upgrade</Link>
            </Button>
          </div>
        </div>
      </header>
      <main className="flex-1">
        {children}
      </main>
      <footer className="border-t py-8 text-sm text-muted-foreground">
        <div className="container mx-auto flex flex-col md:flex-row items-center justify-between gap-4">
          <p>© {new Date().getFullYear()} CareerBoost</p>
          <div className="flex gap-4">
            <Link href="/blog" className="hover:text-foreground">Blog</Link>
            <a href="#upgrade" className="hover:text-foreground">Pricing</a>
          </div>
        </div>
      </footer>
    </div>
  );
}
