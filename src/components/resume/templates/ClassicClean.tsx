import { ResumeData } from "../ResumeForm";

export default function ClassicClean({ data }: { data: ResumeData }) {
  return (
    <article className="max-w-[800px] mx-auto">
      <header className="pb-4">
        <h2 className="text-3xl font-semibold">{data.name || 'Your Name'}</h2>
        <div className="flex flex-wrap gap-2 text-xs text-neutral-700 mt-2">
          {data.email && <span>{data.email}</span>}
          {data.phone && <span>· {data.phone}</span>}
          {data.location && <span>· {data.location}</span>}
        </div>
      </header>
      {data.title && (
        <p className="text-sm italic text-neutral-700">{data.title}</p>
      )}
      <section className="mt-4">
        <h3 className="text-sm font-semibold border-b pb-1">Professional Summary</h3>
        <p className="text-sm mt-2 leading-6">{data.summary || 'Results-driven professional with a track record of delivering measurable outcomes.'}</p>
      </section>
      {data.experience.length > 0 && (
        <section className="mt-4">
          <h3 className="text-sm font-semibold border-b pb-1">Experience</h3>
          <ul className="mt-2 space-y-2">
            {data.experience.map((line, i) => (
              <li key={i} className="text-sm leading-6">— {line}</li>
            ))}
          </ul>
        </section>
      )}
      {data.education.length > 0 && (
        <section className="mt-4">
          <h3 className="text-sm font-semibold border-b pb-1">Education</h3>
          <ul className="mt-2 space-y-1">
            {data.education.map((line, i) => (
              <li key={i} className="text-sm leading-6">— {line}</li>
            ))}
          </ul>
        </section>
      )}
      {data.skills.length > 0 && (
        <section className="mt-4">
          <h3 className="text-sm font-semibold border-b pb-1">Skills</h3>
          <p className="text-sm mt-2 leading-6">{data.skills.join(', ')}</p>
        </section>
      )}
    </article>
  );
}
