import { ResumeData } from "../ResumeForm";

export default function RenderCV({ data }: { data: ResumeData }) {
  const contacts = [data.location, data.email, data.phone].filter(Boolean);

  return (
    <article className="max-w-[800px] mx-auto">
      <header className="text-center">
        <h2 className="text-3xl font-semibold">{data.name || "Your Name"}</h2>
        {data.title && (
          <p className="mt-1 italic text-sm text-neutral-700">{data.title}</p>
        )}
        {contacts.length > 0 && (
          <div className="mt-2 text-xs text-neutral-700 flex flex-wrap items-center justify-center gap-2">
            {contacts.map((item, i) => (
              <span key={i} className="flex items-center">
                {i > 0 && <span aria-hidden className="mx-2">|</span>}
                <span>{item}</span>
              </span>
            ))}
          </div>
        )}
      </header>

      <section className="mt-4">
        <h3 className="text-sm font-semibold tracking-wide needspace border-b pb-1">Welcome</h3>
        <p className="text-sm mt-2 leading-6">
          {data.summary || "Concise professional summary highlighting your impact."}
        </p>
      </section>

      {data.education.length > 0 && (
        <section className="mt-4">
          <h3 className="text-sm font-semibold border-b pb-1">Education</h3>
          <ul className="mt-2 space-y-1">
            {data.education.map((line, i) => (
              <li key={i} className="text-sm leading-6">• {line}</li>
            ))}
          </ul>
        </section>
      )}

      {data.experience.length > 0 && (
        <section className="mt-4">
          <h3 className="text-sm font-semibold border-b pb-1">Experience</h3>
          <ul className="mt-2 space-y-2">
            {data.experience.map((line, i) => (
              <li key={i} className="text-sm leading-6">• {line}</li>
            ))}
          </ul>
        </section>
      )}

      {data.skills.length > 0 && (
        <section className="mt-4">
          <h3 className="text-sm font-semibold border-b pb-1">Technologies & Skills</h3>
          <p className="text-sm mt-2 leading-6">{data.skills.join(" • ")}</p>
        </section>
      )}
    </article>
  );
}
