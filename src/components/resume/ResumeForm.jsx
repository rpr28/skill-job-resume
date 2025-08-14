"use client";

import { Input } from "../../components/ui/input";
import { Button } from "../../components/ui/button";
import { Textarea } from "../../components/ui/textarea";
import { useState } from "react";

const ResumeForm = ({ value, onChange }) => {
  const [skillInput, setSkillInput] = useState("");
  const [titleInput, setTitleInput] = useState("");
  const [domainInput, setDomainInput] = useState("");
  const [locationInput, setLocationInput] = useState("");

  const addSkill = () => {
    if (skillInput.trim() && !value.skills.includes(skillInput.trim())) {
      onChange({
        ...value,
        skills: [...value.skills, skillInput.trim()]
      });
      setSkillInput("");
    }
  };

  const addTitle = () => {
    if (titleInput.trim() && !value.titles.includes(titleInput.trim())) {
      onChange({
        ...value,
        titles: [...value.titles, titleInput.trim()]
      });
      setTitleInput("");
    }
  };

  const addDomain = () => {
    if (domainInput.trim() && !value.domains.includes(domainInput.trim())) {
      onChange({
        ...value,
        domains: [...value.domains, domainInput.trim()]
      });
      setDomainInput("");
    }
  };

  const addPreferredLocation = () => {
    if (locationInput.trim() && !value.preferredLocations.includes(locationInput.trim())) {
      onChange({
        ...value,
        preferredLocations: [...value.preferredLocations, locationInput.trim()]
      });
      setLocationInput("");
    }
  };

  const removeSkill = (index) => {
    onChange({
      ...value,
      skills: value.skills.filter((_, i) => i !== index)
    });
  };

  const removeTitle = (index) => {
    onChange({
      ...value,
      titles: value.titles.filter((_, i) => i !== index)
    });
  };

  const removeDomain = (index) => {
    onChange({
      ...value,
      domains: value.domains.filter((_, i) => i !== index)
    });
  };

  const removePreferredLocation = (index) => {
    onChange({
      ...value,
      preferredLocations: value.preferredLocations.filter((_, i) => i !== index)
    });
  };

  const addExperience = () => {
    onChange({
      ...value,
      experience: [...value.experience, { title: "", company: "", duration: "", description: "" }]
    });
  };

  const removeExperience = (index) => {
    onChange({
      ...value,
      experience: value.experience.filter((_, i) => i !== index)
    });
  };

  const updateExperience = (index, field, val) => {
    const newExperience = [...value.experience];
    newExperience[index] = { ...newExperience[index], [field]: val };
    onChange({ ...value, experience: newExperience });
  };

  const addEducation = () => {
    onChange({
      ...value,
      education: [...value.education, { degree: "", institution: "", year: "", description: "" }]
    });
  };

  const removeEducation = (index) => {
    onChange({
      ...value,
      education: value.education.filter((_, i) => i !== index)
    });
  };

  const updateEducation = (index, field, val) => {
    const newEducation = [...value.education];
    newEducation[index] = { ...newEducation[index], [field]: val };
    onChange({ ...value, education: newEducation });
  };

  return (
    <div className="space-y-6">
      {/* Basic Information */}
      <div className="space-y-4">
        <h3 className="text-lg font-semibold">Basic Information</h3>
        <div className="grid grid-cols-2 gap-4">
          <Input
            placeholder="Full Name"
            value={value.name}
            onChange={(e) => onChange({ ...value, name: e.target.value })}
          />
          <Input
            placeholder="Job Title"
            value={value.title}
            onChange={(e) => onChange({ ...value, title: e.target.value })}
          />
        </div>
        <div className="grid grid-cols-2 gap-4">
          <Input
            placeholder="Email"
            type="email"
            value={value.email}
            onChange={(e) => onChange({ ...value, email: e.target.value })}
          />
          <Input
            placeholder="Phone"
            value={value.phone}
            onChange={(e) => onChange({ ...value, phone: e.target.value })}
          />
        </div>
        <Input
          placeholder="Location"
          value={value.location}
          onChange={(e) => onChange({ ...value, location: e.target.value })}
        />
      </div>

      {/* Summary */}
      <div className="space-y-4">
        <h3 className="text-lg font-semibold">Professional Summary</h3>
        <Textarea
          placeholder="Write a brief summary of your professional background and career objectives..."
          value={value.summary}
          onChange={(e) => onChange({ ...value, summary: e.target.value })}
          rows={4}
        />
      </div>

      {/* Skills */}
      <div className="space-y-4">
        <h3 className="text-lg font-semibold">Skills</h3>
        <div className="flex gap-2">
          <Input
            placeholder="Add a skill"
            value={skillInput}
            onChange={(e) => setSkillInput(e.target.value)}
            onKeyPress={(e) => e.key === 'Enter' && addSkill()}
          />
          <Button type="button" onClick={addSkill}>Add</Button>
        </div>
        <div className="flex flex-wrap gap-2">
          {value.skills.map((skill, index) => (
            <div key={index} className="flex items-center gap-2 bg-blue-100 text-blue-800 px-3 py-1 rounded-full">
              <span>{skill}</span>
              <button
                type="button"
                onClick={() => removeSkill(index)}
                className="text-blue-600 hover:text-blue-800"
              >
                ×
              </button>
            </div>
          ))}
        </div>
      </div>

      {/* Job Titles of Interest */}
      <div className="space-y-4">
        <h3 className="text-lg font-semibold">Job Titles of Interest</h3>
        <div className="flex gap-2">
          <Input
            placeholder="Add a job title you're interested in"
            value={titleInput}
            onChange={(e) => setTitleInput(e.target.value)}
            onKeyPress={(e) => e.key === 'Enter' && addTitle()}
          />
          <Button type="button" onClick={addTitle}>Add</Button>
        </div>
        <div className="flex flex-wrap gap-2">
          {value.titles.map((title, index) => (
            <div key={index} className="flex items-center gap-2 bg-green-100 text-green-800 px-3 py-1 rounded-full">
              <span>{title}</span>
              <button
                type="button"
                onClick={() => removeTitle(index)}
                className="text-green-600 hover:text-green-800"
              >
                ×
              </button>
            </div>
          ))}
        </div>
      </div>

      {/* Industry Domains */}
      <div className="space-y-4">
        <h3 className="text-lg font-semibold">Industry Domains</h3>
        <div className="flex gap-2">
          <Input
            placeholder="Add an industry domain (e.g., SaaS, Healthcare, Finance)"
            value={domainInput}
            onChange={(e) => setDomainInput(e.target.value)}
            onKeyPress={(e) => e.key === 'Enter' && addDomain()}
          />
          <Button type="button" onClick={addDomain}>Add</Button>
        </div>
        <div className="flex flex-wrap gap-2">
          {value.domains.map((domain, index) => (
            <div key={index} className="flex items-center gap-2 bg-purple-100 text-purple-800 px-3 py-1 rounded-full">
              <span>{domain}</span>
              <button
                type="button"
                onClick={() => removeDomain(index)}
                className="text-purple-600 hover:text-purple-800"
              >
                ×
              </button>
            </div>
          ))}
        </div>
      </div>

      {/* Work Preferences */}
      <div className="space-y-4">
        <h3 className="text-lg font-semibold">Work Preferences</h3>
        <div className="space-y-3">
          <div className="flex items-center space-x-2">
            <input
              type="checkbox"
              id="openToRemote"
              checked={value.openToRemote}
              onChange={(e) => onChange({ ...value, openToRemote: e.target.checked })}
              className="rounded"
            />
            <label htmlFor="openToRemote" className="text-sm font-medium">
              Open to remote work
            </label>
          </div>
          
          <div className="space-y-2">
            <label className="text-sm font-medium">Preferred Locations</label>
            <div className="flex gap-2">
              <Input
                placeholder="Add a preferred location"
                value={locationInput}
                onChange={(e) => setLocationInput(e.target.value)}
                onKeyPress={(e) => e.key === 'Enter' && addPreferredLocation()}
              />
              <Button type="button" onClick={addPreferredLocation}>Add</Button>
            </div>
            <div className="flex flex-wrap gap-2">
              {value.preferredLocations.map((location, index) => (
                <div key={index} className="flex items-center gap-2 bg-orange-100 text-orange-800 px-3 py-1 rounded-full">
                  <span>{location}</span>
                  <button
                    type="button"
                    onClick={() => removePreferredLocation(index)}
                    className="text-orange-600 hover:text-orange-800"
                  >
                    ×
                  </button>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>

      {/* Experience */}
      <div className="space-y-4">
        <div className="flex items-center justify-between">
          <h3 className="text-lg font-semibold">Work Experience</h3>
          <Button type="button" variant="outline" onClick={addExperience}>Add Experience</Button>
        </div>
        {value.experience.map((exp, index) => (
          <div key={index} className="border rounded-lg p-4 space-y-3">
            <div className="grid grid-cols-2 gap-3">
              <Input
                placeholder="Job Title"
                value={exp.title}
                onChange={(e) => updateExperience(index, 'title', e.target.value)}
              />
              <Input
                placeholder="Company"
                value={exp.company}
                onChange={(e) => updateExperience(index, 'company', e.target.value)}
              />
            </div>
            <Input
              placeholder="Duration (e.g., 2020-2023)"
              value={exp.duration}
              onChange={(e) => updateExperience(index, 'duration', e.target.value)}
            />
            <Textarea
              placeholder="Job description and achievements..."
              value={exp.description}
              onChange={(e) => updateExperience(index, 'description', e.target.value)}
              rows={3}
            />
            <Button
              type="button"
              variant="destructive"
              size="sm"
              onClick={() => removeExperience(index)}
            >
              Remove
            </Button>
          </div>
        ))}
      </div>

      {/* Education */}
      <div className="space-y-4">
        <div className="flex items-center justify-between">
          <h3 className="text-lg font-semibold">Education</h3>
          <Button type="button" variant="outline" onClick={addEducation}>Add Education</Button>
        </div>
        {value.education.map((edu, index) => (
          <div key={index} className="border rounded-lg p-4 space-y-3">
            <div className="grid grid-cols-2 gap-3">
              <Input
                placeholder="Degree"
                value={edu.degree}
                onChange={(e) => updateEducation(index, 'degree', e.target.value)}
              />
              <Input
                placeholder="Institution"
                value={edu.institution}
                onChange={(e) => updateEducation(index, 'institution', e.target.value)}
              />
            </div>
            <Input
              placeholder="Year"
              value={edu.year}
              onChange={(e) => updateEducation(index, 'year', e.target.value)}
            />
            <Textarea
              placeholder="Additional details..."
              value={edu.description}
              onChange={(e) => updateEducation(index, 'description', e.target.value)}
              rows={2}
            />
            <Button
              type="button"
              variant="destructive"
              size="sm"
              onClick={() => removeEducation(index)}
            >
              Remove
            </Button>
          </div>
        ))}
      </div>
    </div>
  );
};

export default ResumeForm;
