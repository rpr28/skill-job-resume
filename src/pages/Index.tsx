import { Button } from "@/components/ui/button";
import Link from "next/link";
import { ArrowRight, FileText, Briefcase, BookOpen } from "lucide-react";

const Index = () => {
  return (
    <main className="min-h-screen">
      <section className="container mx-auto py-24 md:py-32">
        <div className="max-w-3xl mx-auto text-center">
          <h1 className="text-4xl md:text-6xl font-semibold tracking-tight mb-6">CareerBoost</h1>
          <p className="text-lg md:text-xl text-muted-foreground mb-10">Build ATS‑friendly resumes, automate job search alerts, and upskill with curated courses — in one minimal workspace.</p>
          <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
            <Button asChild variant="hero" size="lg">
              <Link href="/resume" aria-label="Start Resume Builder">
                <FileText className="mr-2" /> Build Resume <ArrowRight className="ml-2" />
              </Link>
            </Button>
            <Button asChild variant="outline" size="lg">
              <Link href="/jobs" aria-label="Find Jobs">
                <Briefcase className="mr-2" /> Find Jobs
              </Link>
            </Button>
            <Button asChild variant="secondary" size="lg">
              <Link href="/courses" aria-label="Browse Courses">
                <BookOpen className="mr-2" /> Browse Courses
              </Link>
            </Button>
          </div>
        </div>
      </section>
    </main>
  );
};

export default Index;
