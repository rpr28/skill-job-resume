const ModernMinimal = ({ data }) => {
  return (
    <div className="max-w-4xl mx-auto bg-white p-8 font-sans">
      {/* Header */}
      <header className="text-center border-b-2 border-blue-600 pb-6 mb-8">
        <h1 className="text-4xl font-bold text-gray-900 mb-2">{data.name || "Your Name"}</h1>
        <p className="text-xl text-blue-600 font-medium mb-2">{data.title || "Professional Title"}</p>
        <div className="flex justify-center space-x-6 text-gray-600">
          {data.email && <span>{data.email}</span>}
          {data.phone && <span>{data.phone}</span>}
          {data.location && <span>{data.location}</span>}
        </div>
      </header>

      {/* Summary */}
      {data.summary && (
        <section className="mb-8">
          <h2 className="text-2xl font-bold text-gray-900 mb-4 border-b border-gray-300 pb-2">Professional Summary</h2>
          <p className="text-gray-700 leading-relaxed">{data.summary}</p>
        </section>
      )}

      {/* Skills */}
      {data.skills && data.skills.length > 0 && (
        <section className="mb-8">
          <h2 className="text-2xl font-bold text-gray-900 mb-4 border-b border-gray-300 pb-2">Skills</h2>
          <div className="flex flex-wrap gap-2">
            {data.skills.map((skill, index) => (
              <span key={index} className="bg-blue-100 text-blue-800 px-3 py-1 rounded-full text-sm font-medium">
                {skill}
              </span>
            ))}
          </div>
        </section>
      )}

      {/* Experience */}
      {data.experience && data.experience.length > 0 && (
        <section className="mb-8">
          <h2 className="text-2xl font-bold text-gray-900 mb-4 border-b border-gray-300 pb-2">Professional Experience</h2>
          <div className="space-y-6">
            {data.experience.map((exp, index) => (
              <div key={index} className="border-l-4 border-blue-600 pl-6">
                <div className="flex justify-between items-start mb-2">
                  <h3 className="text-lg font-semibold text-gray-900">{exp.title || "Job Title"}</h3>
                  <span className="text-gray-600 text-sm">{exp.duration || "Duration"}</span>
                </div>
                <p className="text-blue-600 font-medium mb-2">{exp.company || "Company"}</p>
                <p className="text-gray-700 leading-relaxed">{exp.description || "Job description"}</p>
              </div>
            ))}
          </div>
        </section>
      )}

      {/* Education */}
      {data.education && data.education.length > 0 && (
        <section className="mb-8">
          <h2 className="text-2xl font-bold text-gray-900 mb-4 border-b border-gray-300 pb-2">Education</h2>
          <div className="space-y-4">
            {data.education.map((edu, index) => (
              <div key={index} className="flex justify-between items-start">
                <div>
                  <h3 className="text-lg font-semibold text-gray-900">{edu.degree || "Degree"}</h3>
                  <p className="text-blue-600 font-medium">{edu.institution || "Institution"}</p>
                  {edu.description && <p className="text-gray-700 text-sm mt-1">{edu.description}</p>}
                </div>
                <span className="text-gray-600 text-sm">{edu.year || "Year"}</span>
              </div>
            ))}
          </div>
        </section>
      )}
    </div>
  );
};

export default ModernMinimal;


