import { Link, NavLink, Outlet } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Helmet } from "react-helmet-async";
import { useEffect, useState } from "react";

const navItems = [
  { to: "/resume", label: "Resume" },
  { to: "/jobs", label: "Jobs" },
  { to: "/courses", label: "Courses" },
  { to: "/dashboard", label: "Dashboard" },
  { to: "/blog", label: "Blog" },
];

export default function Layout() {
  const [scrolled, setScrolled] = useState(false);
  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 8);
    window.addEventListener("scroll", onScroll);
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  return (
    <div className="min-h-screen flex flex-col">
      <Helmet>
        <title>CareerBoost – AI Resume, Jobs & Courses</title>
        <meta name="description" content="CareerBoost: AI resume builder, job search automation, and curated courses." />
      </Helmet>
      <header className={`sticky top-0 z-40 backdrop-blur supports-[backdrop-filter]:bg-background/70 ${scrolled ? 'border-b' : ''}`}>
        <div className="container mx-auto flex h-16 items-center justify-between">
          <Link to="/" className="font-semibold">CareerBoost</Link>
          <nav className="hidden md:flex items-center gap-6 text-sm">
            {navItems.map((item) => (
              <NavLink
                key={item.to}
                to={item.to}
                className={({ isActive }) => isActive ? 'text-foreground' : 'text-muted-foreground hover:text-foreground'}
              >
                {item.label}
              </NavLink>
            ))}
          </nav>
          <div className="flex items-center gap-2">
            <Button asChild variant="outline" size="sm">
              <Link to="/resume">Get Started</Link>
            </Button>
            <Button asChild variant="hero" size="sm">
              <Link to="#upgrade">Upgrade</Link>
            </Button>
          </div>
        </div>
      </header>
      <main className="flex-1">
        <Outlet />
      </main>
      <footer className="border-t py-8 text-sm text-muted-foreground">
        <div className="container mx-auto flex flex-col md:flex-row items-center justify-between gap-4">
          <p>© {new Date().getFullYear()} CareerBoost</p>
          <div className="flex gap-4">
            <Link to="/blog" className="hover:text-foreground">Blog</Link>
            <a href="#upgrade" className="hover:text-foreground">Pricing</a>
          </div>
        </div>
      </footer>
    </div>
  );
}
