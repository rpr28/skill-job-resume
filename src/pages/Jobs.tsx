"use client";

import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { useEffect, useMemo, useState } from "react";
import { jobs as JOBS, Job } from "@/data/jobs";
import { toast } from "@/hooks/use-toast";

const Jobs = () => {
  const [q, setQ] = useState("");
  const [location, setLocation] = useState<string>("all");
  const [remote, setRemote] = useState<string>("all");
  const [email, setEmail] = useState("");
  const [webhookUrl, setWebhookUrl] = useState("");

  const results = useMemo(() => {
    return JOBS.filter((j) =>
      (q ? (j.title + j.company).toLowerCase().includes(q.toLowerCase()) : true) &&
      (location === 'all' ? true : j.location.toLowerCase().includes(location.toLowerCase())) &&
      (remote === 'all' ? true : (remote === 'remote' ? j.remote : !j.remote))
    );
  }, [q, location, remote]);

  useEffect(() => {
    const saved = localStorage.getItem('cb:jobs:alerts');
    if (saved) {
      try { const parsed = JSON.parse(saved); setEmail(parsed.email || ""); setWebhookUrl(parsed.webhookUrl || ""); } catch {}
    }
  }, []);

  const onSubscribe = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!email) {
      toast({ title: "Email required", description: "Please enter your email to subscribe.", });
      return;
    }
    localStorage.setItem('cb:jobs:alerts', JSON.stringify({ email, webhookUrl, q, location, remote }));

    if (webhookUrl) {
      try {
        await fetch(webhookUrl, {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          mode: 'no-cors',
          body: JSON.stringify({
            timestamp: new Date().toISOString(),
            email,
            query: { q, location, remote },
            type: 'careerboost_job_alert_subscription',
          }),
        });
        toast({ title: "Subscribed", description: "Alert request sent. Check your Zapier/Make history." });
      } catch (err) {
        console.error(err);
        toast({ title: "Subscription error", description: "We couldn't reach the webhook.", variant: 'destructive' });
      }
    } else {
      toast({ title: "Subscribed", description: "You'll receive alerts based on your filters." });
    }
  };

  return (
    <div className="container mx-auto py-10">
      <h1 className="sr-only">Job Search – filters and alerts</h1>
      <div className="grid gap-6">
        <Card>
          <CardHeader>
            <CardTitle>Search Jobs</CardTitle>
          </CardHeader>
          <CardContent className="grid md:grid-cols-4 gap-3">
            <Input placeholder="Role or company" value={q} onChange={(e) => setQ(e.target.value)} />
            <Select value={location} onValueChange={setLocation}>
              <SelectTrigger>
                <SelectValue placeholder="Location" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All locations</SelectItem>
                <SelectItem value="remote">Remote</SelectItem>
                <SelectItem value="usa">USA</SelectItem>
                <SelectItem value="europe">Europe</SelectItem>
                <SelectItem value="india">India</SelectItem>
              </SelectContent>
            </Select>
            <Select value={remote} onValueChange={setRemote}>
              <SelectTrigger>
                <SelectValue placeholder="Remote" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">Remote + Onsite</SelectItem>
                <SelectItem value="remote">Remote only</SelectItem>
                <SelectItem value="onsite">Onsite only</SelectItem>
              </SelectContent>
            </Select>
            <Button>Search</Button>
          </CardContent>
        </Card>

        <section className="grid md:grid-cols-2 gap-4">
          {results.map((job) => (
            <Card key={job.id} className="transition duration-200 hover:shadow-md">
              <CardHeader>
                <CardTitle className="text-base">{job.title} · {job.company}</CardTitle>
              </CardHeader>
              <CardContent className="text-sm text-muted-foreground space-y-2">
                <p>{job.location} · {job.remote ? 'Remote' : 'Onsite'}</p>
                <p>{job.summary}</p>
                <div className="flex gap-2 flex-wrap">
                  {job.tags.map((t) => (
                    <span key={t} className="px-2 py-1 rounded-md bg-secondary text-secondary-foreground text-xs">{t}</span>
                  ))}
                </div>
                <div className="pt-2">
                  <a href={job.url} target="_blank" rel="noreferrer" className="text-primary underline">View</a>
                </div>
              </CardContent>
            </Card>
          ))}
        </section>

        <Card>
          <CardHeader>
            <CardTitle>Subscribe to Alerts</CardTitle>
          </CardHeader>
          <CardContent>
            <form onSubmit={onSubscribe} className="grid md:grid-cols-3 gap-3">
              <Input type="email" placeholder="Your email" value={email} onChange={(e) => setEmail(e.target.value)} />
              <Input placeholder="Zapier/Make webhook URL (optional)" value={webhookUrl} onChange={(e) => setWebhookUrl(e.target.value)} />
              <Button type="submit" variant="hero">Subscribe</Button>
            </form>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default Jobs;
