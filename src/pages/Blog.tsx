import { Helmet } from "react-helmet-async";

const posts = [
  {
    id: 'p1',
    title: 'Ace the ATS: Resume Tips That Actually Work',
    excerpt: 'Learn how to tailor your resume to pass Applicant Tracking Systems without losing your voice.',
    datePublished: '2024-01-10',
    url: '/blog/ats-tips'
  },
  {
    id: 'p2',
    title: 'Finding Hidden Jobs: Smarter Search Strategies',
    excerpt: 'Use filters, alerts, and niche boards to uncover roles before they go mainstream.',
    datePublished: '2024-02-18',
    url: '/blog/hidden-jobs'
  },
  {
    id: 'p3',
    title: 'Upgrading Skills Without Overwhelm',
    excerpt: 'A minimal approach to upskilling with curated courses that deliver real ROI.',
    datePublished: '2024-03-05',
    url: '/blog/upskilling-minimal'
  }
];

const Blog = () => {
  const jsonLd = {
    "@context": "https://schema.org",
    "@type": "Blog",
    "name": "CareerBoost Blog",
    "url": typeof window !== 'undefined' ? window.location.origin + '/blog' : '/blog',
    "blogPosts": posts.map(p => ({
      "@type": "BlogPosting",
      "headline": p.title,
      "datePublished": p.datePublished,
      "url": p.url,
      "description": p.excerpt
    }))
  } as const;

  return (
    <div className="container mx-auto py-10">
      <Helmet>
        <title>Career Tips Blog – CareerBoost</title>
        <meta name="description" content="Actionable tips on resumes, job search, and upskilling." />
        <link rel="canonical" href={typeof window !== 'undefined' ? window.location.href : '/blog'} />
        <script type="application/ld+json">{JSON.stringify(jsonLd)}</script>
      </Helmet>
      <h1 className="text-2xl font-semibold mb-6">Career Tips</h1>
      <div className="grid md:grid-cols-3 gap-6">
        {posts.map((p) => (
          <article key={p.id} className="p-6 border rounded-lg">
            <h2 className="text-lg font-medium">{p.title}</h2>
            <p className="text-sm text-muted-foreground mt-2">{p.excerpt}</p>
            <a href={p.url} className="text-primary underline mt-3 inline-block">Read more</a>
          </article>
        ))}
      </div>
    </div>
  );
};

export default Blog;
