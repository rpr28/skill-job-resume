import { Helmet } from "react-helmet-async";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import ResumeForm, { ResumeData } from "@/components/resume/ResumeForm";
import ModernMinimal from "@/components/resume/templates/ModernMinimal";
import ClassicClean from "@/components/resume/templates/ClassicClean";
import { useRef, useState } from "react";
import { useReactToPrint } from "react-to-print";

const Resume = () => {
  const [data, setData] = useState<ResumeData>({
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

  const printRef = useRef<HTMLDivElement>(null);
  const handlePrint = useReactToPrint({ contentRef: printRef });

  return (
    <div className="container mx-auto py-10">
      <Helmet>
        <title>Resume Builder – CareerBoost</title>
        <meta name="description" content="Create ATS-friendly resumes from clean templates and export to PDF." />
        <link rel="canonical" href={typeof window !== 'undefined' ? window.location.href : '/resume'} />
      </Helmet>
      <h1 className="sr-only">Resume Builder – ATS-friendly templates</h1>
      <div className="grid md:grid-cols-2 gap-8">
        <Card>
          <CardHeader>
            <CardTitle>Resume Details</CardTitle>
          </CardHeader>
          <CardContent>
            <ResumeForm value={data} onChange={setData} />
            <div className="flex gap-2 mt-6">
              <Button variant="secondary" onClick={() => {
                localStorage.setItem('cb:resume:last', JSON.stringify(data));
              }}>Save</Button>
              <Button variant="hero" onClick={handlePrint}>Export PDF</Button>
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardHeader>
            <CardTitle>Preview</CardTitle>
          </CardHeader>
          <CardContent>
            <Tabs defaultValue="modern">
              <TabsList>
                <TabsTrigger value="modern">Modern Minimal</TabsTrigger>
                <TabsTrigger value="classic">Classic Clean</TabsTrigger>
              </TabsList>
              <div ref={printRef} className="bg-white text-black p-6">
                <TabsContent value="modern">
                  <ModernMinimal data={data} />
                </TabsContent>
                <TabsContent value="classic">
                  <ClassicClean data={data} />
                </TabsContent>
              </div>
            </Tabs>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default Resume;
