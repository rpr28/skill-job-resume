import { Helmet } from "react-helmet-async";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { useMemo, useState } from "react";
import { courses as COURSES, Course } from "@/data/courses";

const Courses = () => {
  const [q, setQ] = useState("");
  const [category, setCategory] = useState<string>("all");

  const results = useMemo(() => {
    return COURSES.filter((c) =>
      (q ? (c.title + c.platform + (c.category || '')).toLowerCase().includes(q.toLowerCase()) : true) &&
      (category === 'all' ? true : (c.category || '').toLowerCase() === category.toLowerCase())
    );
  }, [q, category]);

  const categories = useMemo(() => Array.from(new Set(COURSES.map(c => c.category).filter(Boolean))) as string[], []);

  return (
    <div className="container mx-auto py-10">
      <Helmet>
        <title>Course Directory – CareerBoost</title>
        <meta name="description" content="Search curated courses from Coursera, Udemy, NPTEL and more." />
        <link rel="canonical" href={typeof window !== 'undefined' ? window.location.href : '/courses'} />
      </Helmet>
      <h1 className="sr-only">Upskill Courses – curated directory</h1>
      <div className="grid gap-6">
        <div className="grid md:grid-cols-3 gap-3">
          <Input placeholder="Search courses" value={q} onChange={(e) => setQ(e.target.value)} />
          <Select value={category} onValueChange={setCategory}>
            <SelectTrigger>
              <SelectValue placeholder="Category" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">All categories</SelectItem>
              {categories.map((cat) => (
                <SelectItem key={cat} value={cat.toLowerCase()}>{cat}</SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>
        <section className="grid md:grid-cols-3 gap-4">
          {results.map((c) => (
            <Card key={c.id} className="transition duration-200 hover:shadow-md">
              <CardHeader>
                <CardTitle className="text-base">{c.title}</CardTitle>
              </CardHeader>
              <CardContent className="text-sm text-muted-foreground space-y-2">
                <p>{c.platform} · {c.level} · {c.duration}</p>
                {c.category && <p>Category: {c.category}</p>}
                <div className="pt-2">
                  <a href={c.affiliate_url || c.url} target="_blank" rel="noreferrer" className="text-primary underline">View</a>
                </div>
              </CardContent>
            </Card>
          ))}
        </section>
      </div>
    </div>
  );
};

export default Courses;
