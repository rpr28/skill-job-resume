"use client";

import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "../../components/ui/card";
import { Button } from "../../components/ui/button";
import { Input } from "../../components/ui/input";
import { Textarea } from "../../components/ui/textarea";
import AIAssistant from "../../components/resume/AIAssistant";

export default function ResumePage() {
  const [data, setData] = useState({
    name: "",
    title: "",
    email: "",
    phone: "",
    location: "",
    summary: "",
    skills: [],
    experience: [],
    education: [],
  });

  const [skillInput, setSkillInput] = useState("");

  const addSkill = () => {
    if (skillInput.trim() && !data.skills.includes(skillInput.trim())) {
      setData({
        ...data,
        skills: [...data.skills, skillInput.trim()]
      });
      setSkillInput("");
    }
  };

  const removeSkill = (index) => {
    setData({
      ...data,
      skills: data.skills.filter((_, i) => i !== index)
    });
  };

  const handleSave = () => {
    localStorage.setItem('cb:resume:last', JSON.stringify(data));
    alert('Resume saved!');
  };

  return (
    <div className="min-h-screen">
      {/* Hero Section */}
      <section className="bg-gradient-to-br from-blue-50 to-indigo-100 py-20">
        <div className="container mx-auto px-4 text-center">
          <div className="max-w-4xl mx-auto">
            <h1 className="text-5xl md:text-6xl font-bold tracking-tight mb-6">
              <span className="text-gray-900">Build Your Perfect</span>
              <br />
              <span className="text-blue-600">Resume</span>
            </h1>
            <p className="text-xl md:text-2xl text-gray-600 mb-12 max-w-3xl mx-auto leading-relaxed">
              Create ATS-friendly resumes with our AI-powered builder. Choose from professional templates and export as PDF in minutes.
            </p>
          </div>
        </div>
      </section>

      {/* Resume Builder */}
      <section className="py-16 bg-gray-50">
        <div className="container mx-auto px-4">
          <div className="grid lg:grid-cols-3 gap-8">
            {/* Resume Builder */}
            <Card>
              <CardHeader>
                <CardTitle>Resume Details</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-6">
                  {/* Basic Information */}
                  <div className="space-y-4">
                    <h3 className="text-lg font-semibold">Basic Information</h3>
                    <div className="grid grid-cols-2 gap-4">
                      <Input
                        placeholder="Full Name"
                        value={data.name}
                        onChange={(e) => setData({ ...data, name: e.target.value })}
                      />
                      <Input
                        placeholder="Job Title"
                        value={data.title}
                        onChange={(e) => setData({ ...data, title: e.target.value })}
                      />
                    </div>
                    <div className="grid grid-cols-2 gap-4">
                      <Input
                        placeholder="Email"
                        type="email"
                        value={data.email}
                        onChange={(e) => setData({ ...data, email: e.target.value })}
                      />
                      <Input
                        placeholder="Phone"
                        value={data.phone}
                        onChange={(e) => setData({ ...data, phone: e.target.value })}
                      />
                    </div>
                    <Input
                      placeholder="Location"
                      value={data.location}
                      onChange={(e) => setData({ ...data, location: e.target.value })}
                    />
                  </div>

                  {/* Summary */}
                  <div className="space-y-4">
                    <h3 className="text-lg font-semibold">Professional Summary</h3>
                    <Textarea
                      placeholder="Write a brief summary of your professional background and career objectives..."
                      value={data.summary}
                      onChange={(e) => setData({ ...data, summary: e.target.value })}
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
                      {data.skills.map((skill, index) => (
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

                  <Button onClick={handleSave} className="w-full">
                    Save Resume
                  </Button>
                </div>
              </CardContent>
            </Card>

            {/* Resume Preview */}
            <Card>
              <CardHeader>
                <CardTitle>Preview</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="bg-white text-black p-6 space-y-4">
                  <div className="text-center border-b pb-4">
                    <h1 className="text-2xl font-bold">{data.name || 'Your Name'}</h1>
                    <p className="text-lg text-gray-600">{data.title || 'Job Title'}</p>
                    <p className="text-sm text-gray-500">{data.email} • {data.phone} • {data.location}</p>
                  </div>
                  {data.summary && (
                    <div>
                      <h2 className="text-lg font-semibold mb-2">Summary</h2>
                      <p className="text-sm">{data.summary}</p>
                    </div>
                  )}
                  {data.skills.length > 0 && (
                    <div>
                      <h2 className="text-lg font-semibold mb-2">Skills</h2>
                      <div className="flex flex-wrap gap-2">
                        {data.skills.map((skill, index) => (
                          <span key={index} className="bg-gray-100 px-2 py-1 rounded text-sm">{skill}</span>
                        ))}
                      </div>
                    </div>
                  )}
                </div>
              </CardContent>
            </Card>

            {/* AI Assistant */}
            <div className="lg:col-span-1">
              <AIAssistant data={data} setData={setData} />
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}
