import { ResumeData } from "../ResumeForm";

export default function ModernMinimal({ data }: { data: ResumeData }) {
  return (
    <article className="max-w-[800px] mx-auto">
      <header className="border-b pb-4">
        <h2 className="text-2xl font-semibold">{data.name || 'Your Name'}</h2>
        <p className="text-sm text-neutral-700">{data.title}</p>
        <p className="text-xs text-neutral-600 mt-1">{[data.email, data.phone, data.location].filter(Boolean).join(' · ')}</p>
      </header>
      <section className="mt-4">
        <h3 className="text-sm font-semibold uppercase tracking-wide">Summary</h3>
        <p className="text-sm mt-1 leading-6">{data.summary || 'Concise professional summary highlighting your impact.'}</p>
      </section>
      {data.skills.length > 0 && (
        <section className="mt-4">
          <h3 className="text-sm font-semibold uppercase tracking-wide">Skills</h3>
          <p className="text-sm mt-1 leading-6">{data.skills.join(' • ')}</p>
        </section>
      )}
      {data.experience.length > 0 && (
        <section className="mt-4">
          <h3 className="text-sm font-semibold uppercase tracking-wide">Experience</h3>
          <ul className="mt-1 space-y-2">
            {data.experience.map((line, i) => (
              <li key={i} className="text-sm leading-6">• {line}</li>
            ))}
          </ul>
        </section>
      )}
      {data.education.length > 0 && (
        <section className="mt-4">
          <h3 className="text-sm font-semibold uppercase tracking-wide">Education</h3>
          <ul className="mt-1 space-y-1">
            {data.education.map((line, i) => (
              <li key={i} className="text-sm leading-6">• {line}</li>
            ))}
          </ul>
        </section>
      )}
    </article>
  );
}
