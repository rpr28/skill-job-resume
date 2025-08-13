const ClassicClean = ({ data }) => {
  return (
    <div className="max-w-4xl mx-auto bg-white p-8 font-serif">
      {/* Header */}
      <header className="text-center mb-8">
        <h1 className="text-4xl font-bold text-gray-900 mb-2 uppercase tracking-wide">{data.name || "Your Name"}</h1>
        <p className="text-xl text-gray-700 font-medium mb-3">{data.title || "Professional Title"}</p>
        <div className="flex justify-center space-x-8 text-gray-600 text-sm">
          {data.email && <span>{data.email}</span>}
          {data.phone && <span>{data.phone}</span>}
          {data.location && <span>{data.location}</span>}
        </div>
      </header>

      {/* Summary */}
      {data.summary && (
        <section className="mb-8">
          <h2 className="text-xl font-bold text-gray-900 mb-3 uppercase tracking-wide border-b-2 border-gray-800 pb-1">Professional Summary</h2>
          <p className="text-gray-700 leading-relaxed text-justify">{data.summary}</p>
        </section>
      )}

      {/* Skills */}
      {data.skills && data.skills.length > 0 && (
        <section className="mb-8">
          <h2 className="text-xl font-bold text-gray-900 mb-3 uppercase tracking-wide border-b-2 border-gray-800 pb-1">Core Competencies</h2>
          <div className="grid grid-cols-2 gap-2">
            {data.skills.map((skill, index) => (
              <div key={index} className="flex items-center">
                <span className="w-2 h-2 bg-gray-800 rounded-full mr-3"></span>
                <span className="text-gray-700">{skill}</span>
              </div>
            ))}
          </div>
        </section>
      )}

      {/* Experience */}
      {data.experience && data.experience.length > 0 && (
        <section className="mb-8">
          <h2 className="text-xl font-bold text-gray-900 mb-4 uppercase tracking-wide border-b-2 border-gray-800 pb-1">Professional Experience</h2>
          <div className="space-y-6">
            {data.experience.map((exp, index) => (
              <div key={index} className="border-l-4 border-gray-300 pl-6">
                <div className="flex justify-between items-start mb-2">
                  <h3 className="text-lg font-bold text-gray-900">{exp.title || "Job Title"}</h3>
                  <span className="text-gray-600 text-sm font-medium">{exp.duration || "Duration"}</span>
                </div>
                <p className="text-gray-700 font-semibold mb-2 italic">{exp.company || "Company"}</p>
                <p className="text-gray-700 leading-relaxed">{exp.description || "Job description"}</p>
              </div>
            ))}
          </div>
        </section>
      )}

      {/* Education */}
      {data.education && data.education.length > 0 && (
        <section className="mb-8">
          <h2 className="text-xl font-bold text-gray-900 mb-4 uppercase tracking-wide border-b-2 border-gray-800 pb-1">Education</h2>
          <div className="space-y-4">
            {data.education.map((edu, index) => (
              <div key={index} className="flex justify-between items-start">
                <div>
                  <h3 className="text-lg font-bold text-gray-900">{edu.degree || "Degree"}</h3>
                  <p className="text-gray-700 font-semibold">{edu.institution || "Institution"}</p>
                  {edu.description && <p className="text-gray-600 text-sm mt-1 italic">{edu.description}</p>}
                </div>
                <span className="text-gray-600 text-sm font-medium">{edu.year || "Year"}</span>
              </div>
            ))}
          </div>
        </section>
      )}
    </div>
  );
};

export default ClassicClean;


