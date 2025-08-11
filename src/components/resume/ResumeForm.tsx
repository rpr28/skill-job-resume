import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { useEffect, useState } from "react";

export type ResumeData = {
  name: string;
  title: string;
  email: string;
  phone: string;
  location: string;
  summary: string;
  skills: string[];
  experience: string[]; // each line e.g., Company — Role — Dates — Impact
  education: string[];  // each line e.g., Degree — School — Dates
};

export default function ResumeForm({ value, onChange }: { value: ResumeData; onChange: (v: ResumeData) => void; }) {
  const [skillsText, setSkillsText] = useState("");
  const [expText, setExpText] = useState("");
  const [eduText, setEduText] = useState("");

  useEffect(() => {
    setSkillsText(value.skills.join(", "));
    setExpText(value.experience.join("\n"));
    setEduText(value.education.join("\n"));
  }, []);

  return (
    <div className="grid gap-4">
      <div className="grid md:grid-cols-2 gap-4">
        <div>
          <Label htmlFor="name">Full Name</Label>
          <Input id="name" value={value.name} onChange={(e) => onChange({ ...value, name: e.target.value })} />
        </div>
        <div>
          <Label htmlFor="title">Headline / Title</Label>
          <Input id="title" value={value.title} onChange={(e) => onChange({ ...value, title: e.target.value })} />
        </div>
        <div>
          <Label htmlFor="email">Email</Label>
          <Input id="email" value={value.email} onChange={(e) => onChange({ ...value, email: e.target.value })} />
        </div>
        <div>
          <Label htmlFor="phone">Phone</Label>
          <Input id="phone" value={value.phone} onChange={(e) => onChange({ ...value, phone: e.target.value })} />
        </div>
        <div className="md:col-span-2">
          <Label htmlFor="location">Location</Label>
          <Input id="location" value={value.location} onChange={(e) => onChange({ ...value, location: e.target.value })} />
        </div>
        <div className="md:col-span-2">
          <Label htmlFor="summary">Professional Summary</Label>
          <textarea id="summary" className="w-full h-28 rounded-md border border-input bg-background px-3 py-2 text-sm" value={value.summary} onChange={(e) => onChange({ ...value, summary: e.target.value })} />
        </div>
        <div className="md:col-span-2">
          <Label htmlFor="skills">Skills (comma separated)</Label>
          <Input id="skills" value={skillsText} onChange={(e) => {
            setSkillsText(e.target.value);
            onChange({ ...value, skills: e.target.value.split(',').map(s => s.trim()).filter(Boolean) });
          }} />
        </div>
        <div className="md:col-span-2">
          <Label htmlFor="experience">Experience (one per line)</Label>
          <textarea id="experience" className="w-full h-36 rounded-md border border-input bg-background px-3 py-2 text-sm" value={expText} onChange={(e) => {
            setExpText(e.target.value);
            onChange({ ...value, experience: e.target.value.split('\n').map(s => s.trim()).filter(Boolean) });
          }} />
        </div>
        <div className="md:col-span-2">
          <Label htmlFor="education">Education (one per line)</Label>
          <textarea id="education" className="w-full h-28 rounded-md border border-input bg-background px-3 py-2 text-sm" value={eduText} onChange={(e) => {
            setEduText(e.target.value);
            onChange({ ...value, education: e.target.value.split('\n').map(s => s.trim()).filter(Boolean) });
          }} />
        </div>
      </div>
    </div>
  );
}
