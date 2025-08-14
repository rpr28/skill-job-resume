"use client";

import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "../ui/card";
import { Button } from "../ui/button";
import { Textarea } from "../ui/textarea";
import { Badge } from "../ui/badge";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "../ui/dialog";
import { Collapsible, CollapsibleContent, CollapsibleTrigger } from "../ui/collapsible";
import { ChevronDown, ChevronUp, Sparkles, Copy, Check, FileText } from "lucide-react";
import { useAIRewrite } from "../../hooks/useAIRewrite";
import { useAIExtract } from "../../hooks/useAIExtract";
import { useAISummary } from "../../hooks/useAISummary";
import { useAICover } from "../../hooks/useAICover";
import { useATSScore } from "../../hooks/useATSScore";

export default function LaTeXAIAssistant() {
  const [isOpen, setIsOpen] = useState(false);
  const [rawExperience, setRawExperience] = useState("");
  const [jobDescription, setJobDescription] = useState("");
  const [atsResult, setAtsResult] = useState(null);
  const [coverLetter, setCoverLetter] = useState("");
  const [showCoverDialog, setShowCoverDialog] = useState(false);
  const [copied, setCopied] = useState(false);
  const [generatedContent, setGeneratedContent] = useState("");
  const [showContentDialog, setShowContentDialog] = useState(false);

  const { rewrite, loading: rewriteLoading, error: rewriteError } = useAIRewrite();
  const { extract, loading: extractLoading, error: extractError } = useAIExtract();
  const { summarize, loading: summaryLoading, error: summaryError } = useAISummary();
  const { generate: generateCover, loading: coverLoading, error: coverError } = useAICover();
  const { score, loading: scoreLoading, error: scoreError } = useATSScore();

  const handleExtractBullets = async () => {
    if (!rawExperience.trim()) return;

    try {
      const bullets = await extract(rawExperience, "Software Engineer");
      
      // Format as LaTeX bullet points for RenderCV
      const latexBullets = bullets.map(bullet => `                \\item ${bullet}`).join('\n');
      const latexContent = `            \\begin{highlights}\n${latexBullets}\n            \\end{highlights}`;
      
      setGeneratedContent(latexContent);
      setShowContentDialog(true);
      setRawExperience("");
    } catch (error) {
      console.error('Failed to extract bullets:', error);
    }
  };

  const handleRewriteBullet = async () => {
    if (!rawExperience.trim()) return;

    try {
      const variants = await rewrite([rawExperience], { role: "Software Engineer" });
      if (variants && variants[0]) {
        const latexBullets = [
          `                \\item ${variants[0].v1}`,
          `                \\item ${variants[0].v2}`,
          variants[0].v3 ? `                \\item ${variants[0].v3}` : null
        ].filter(Boolean).join('\n');
        
        const latexContent = `            \\begin{highlights}\n${latexBullets}\n            \\end{highlights}`;
        setGeneratedContent(latexContent);
        setShowContentDialog(true);
      }
    } catch (error) {
      console.error('Failed to rewrite bullet:', error);
    }
  };

  const handleGenerateExperienceEntry = async () => {
    if (!rawExperience.trim()) return;

    try {
      const bullets = await extract(rawExperience, "Software Engineer");
      const latexBullets = bullets.map(bullet => `                \\item ${bullet}`).join('\n');
      
      const latexContent = `        \\begin{twocolentry}{
            Cupertino, CA

        June 2005 – Aug 2007
        }
            \\textbf{Apple}, Software Engineer
            \\begin{highlights}
${latexBullets}
            \\end{highlights}
        \\end{twocolentry}`;
      
      setGeneratedContent(latexContent);
      setShowContentDialog(true);
      setRawExperience("");
    } catch (error) {
      console.error('Failed to generate experience entry:', error);
    }
  };

  const handleGenerateProjectEntry = async () => {
    if (!rawExperience.trim()) return;

    try {
      const bullets = await extract(rawExperience, "Software Engineer");
      const latexBullets = bullets.map(bullet => `                \\item ${bullet}`).join('\n');
      
      const latexContent = `        \\begin{twocolentry}{
            \\href{https://github.com/sinaatalay/rendercv}{github.com/name/repo}
        }
            \\textbf{Multi-User Drawing Tool}
            \\begin{highlights}
${latexBullets}
            \\end{highlights}
        \\end{twocolentry}`;
      
      setGeneratedContent(latexContent);
      setShowContentDialog(true);
      setRawExperience("");
    } catch (error) {
      console.error('Failed to generate project entry:', error);
    }
  };

  const handleGenerateEducationEntry = async () => {
    if (!rawExperience.trim()) return;

    try {
      const bullets = await extract(rawExperience, "Student");
      const latexBullets = bullets.map(bullet => `                \\item ${bullet}`).join('\n');
      
      const latexContent = `        \\begin{threecolentry}{\\textbf{BS}}{
            Sept 2000 – May 2005
        }
            \\textbf{University of Pennsylvania}, Computer Science
            \\begin{highlights}
${latexBullets}
            \\end{highlights}
        \\end{threecolentry}`;
      
      setGeneratedContent(latexContent);
      setShowContentDialog(true);
      setRawExperience("");
    } catch (error) {
      console.error('Failed to generate education entry:', error);
    }
  };

  const handleCalculateATSScore = async () => {
    if (!jobDescription.trim()) return;

    try {
      // For ATS scoring, we'd need the full resume text
      const sampleResumeText = "Software Engineer with experience in C++, Java, JavaScript, React, Node.js, SQL, and various technologies. Led development of multiple applications and mentored junior developers.";
      const result = await score(sampleResumeText, jobDescription);
      setAtsResult(result);
    } catch (error) {
      console.error('Failed to calculate ATS score:', error);
    }
  };

  const handleGenerateCoverLetter = async () => {
    if (!jobDescription.trim()) return;

    try {
      const jobInfo = {
        title: "Software Engineer",
        company: "Company Name",
        description: jobDescription,
      };

      const letter = await generateCover(
        {
          name: "John Doe",
          title: "Software Engineer",
          skills: ["C++", "Java", "JavaScript", "React", "Node.js"],
        },
        jobInfo
      );

      setCoverLetter(letter);
      setShowCoverDialog(true);
    } catch (error) {
      console.error('Failed to generate cover letter:', error);
    }
  };

  const handleCopyContent = async () => {
    try {
      await navigator.clipboard.writeText(generatedContent);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    } catch (error) {
      console.error('Failed to copy:', error);
    }
  };

  const handleCopyCoverLetter = async () => {
    try {
      await navigator.clipboard.writeText(coverLetter);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    } catch (error) {
      console.error('Failed to copy:', error);
    }
  };

  return (
    <Card className="w-full">
      <Collapsible open={isOpen} onOpenChange={setIsOpen}>
        <CollapsibleTrigger asChild>
          <CardHeader className="cursor-pointer hover:bg-gray-50">
            <div className="flex items-center justify-between">
              <CardTitle className="flex items-center gap-2">
                <FileText className="h-5 w-5 text-blue-600" />
                LaTeX AI Assistant
              </CardTitle>
              {isOpen ? <ChevronUp className="h-4 w-4" /> : <ChevronDown className="h-4 w-4" />}
            </div>
          </CardHeader>
        </CollapsibleTrigger>
        
        <CollapsibleContent>
          <CardContent className="space-y-6">
            {/* Extract LaTeX Bullets */}
            <div className="space-y-3">
              <h4 className="font-medium">Generate LaTeX Bullets</h4>
              <Textarea
                placeholder="Paste your raw experience here..."
                value={rawExperience}
                onChange={(e) => setRawExperience(e.target.value)}
                rows={3}
              />
              <div className="flex gap-2">
                <Button 
                  onClick={handleExtractBullets}
                  disabled={!rawExperience.trim() || extractLoading}
                  className="flex-1"
                >
                  {extractLoading ? "Generating..." : "Extract Bullets"}
                </Button>
                <Button 
                  onClick={handleRewriteBullet}
                  disabled={!rawExperience.trim() || rewriteLoading}
                  className="flex-1"
                >
                  {rewriteLoading ? "Rewriting..." : "Rewrite Bullet"}
                </Button>
              </div>
            </div>

            {/* Generate LaTeX Entries */}
            <div className="space-y-3">
              <h4 className="font-medium">Generate LaTeX Entries</h4>
              <div className="grid grid-cols-2 gap-2">
                <Button 
                  onClick={handleGenerateExperienceEntry}
                  disabled={!rawExperience.trim() || extractLoading}
                  className="flex-1"
                >
                  Experience Entry
                </Button>
                <Button 
                  onClick={handleGenerateProjectEntry}
                  disabled={!rawExperience.trim() || extractLoading}
                  className="flex-1"
                >
                  Project Entry
                </Button>
                <Button 
                  onClick={handleGenerateEducationEntry}
                  disabled={!rawExperience.trim() || extractLoading}
                  className="flex-1"
                >
                  Education Entry
                </Button>
              </div>
            </div>

            {/* ATS Score */}
            <div className="space-y-3">
              <h4 className="font-medium">ATS Match Score</h4>
              <Textarea
                placeholder="Paste job description here..."
                value={jobDescription}
                onChange={(e) => setJobDescription(e.target.value)}
                rows={3}
              />
              <Button 
                onClick={handleCalculateATSScore}
                disabled={!jobDescription.trim() || scoreLoading}
                className="w-full"
              >
                Calculate Score
              </Button>
              
              {atsResult && (
                <div className="space-y-2">
                  <div className="flex items-center gap-2">
                    <span className="text-sm font-medium">Match Score:</span>
                    <Badge variant={atsResult.score >= 70 ? "default" : atsResult.score >= 50 ? "secondary" : "destructive"}>
                      {atsResult.score}%
                    </Badge>
                  </div>
                  
                  <div className="space-y-1">
                    <span className="text-sm font-medium">Keywords:</span>
                    <div className="flex flex-wrap gap-1">
                      {atsResult.keywords.slice(0, 10).map((keyword, index) => (
                        <Badge 
                          key={index} 
                          variant={keyword.inResume ? "default" : "outline"}
                          className="text-xs"
                        >
                          {keyword.token}
                        </Badge>
                      ))}
                    </div>
                  </div>
                </div>
              )}
            </div>

            {/* Cover Letter */}
            <div className="space-y-3">
              <h4 className="font-medium">Cover Letter</h4>
              <Button 
                onClick={handleGenerateCoverLetter}
                disabled={!jobDescription.trim() || coverLoading}
                className="w-full"
              >
                Generate Cover Letter
              </Button>
            </div>

            {/* Error Display */}
            {(rewriteError || extractError || summaryError || coverError || scoreError) && (
              <div className="text-red-600 text-sm">
                {rewriteError || extractError || summaryError || coverError || scoreError}
              </div>
            )}
          </CardContent>
        </CollapsibleContent>
      </Collapsible>

      {/* Generated LaTeX Content Dialog */}
      <Dialog open={showContentDialog} onOpenChange={setShowContentDialog}>
        <DialogContent className="max-w-4xl max-h-[80vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle>Generated LaTeX Content</DialogTitle>
          </DialogHeader>
          <div className="space-y-4">
            <div className="bg-gray-50 p-4 rounded-lg">
              <pre className="text-sm whitespace-pre-wrap font-mono">{generatedContent}</pre>
            </div>
            <Button 
              onClick={handleCopyContent}
              className="w-full"
              variant="outline"
            >
              {copied ? (
                <>
                  <Check className="h-4 w-4 mr-2" />
                  Copied!
                </>
              ) : (
                <>
                  <Copy className="h-4 w-4 mr-2" />
                  Copy LaTeX Code
                </>
              )}
            </Button>
          </div>
        </DialogContent>
      </Dialog>

      {/* Cover Letter Dialog */}
      <Dialog open={showCoverDialog} onOpenChange={setShowCoverDialog}>
        <DialogContent className="max-w-2xl max-h-[80vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle>Generated Cover Letter</DialogTitle>
          </DialogHeader>
          <div className="space-y-4">
            <div className="whitespace-pre-wrap text-sm">{coverLetter}</div>
            <Button 
              onClick={handleCopyCoverLetter}
              className="w-full"
              variant="outline"
            >
              {copied ? (
                <>
                  <Check className="h-4 w-4 mr-2" />
                  Copied!
                </>
              ) : (
                <>
                  <Copy className="h-4 w-4 mr-2" />
                  Copy to Clipboard
                </>
              )}
            </Button>
          </div>
        </DialogContent>
      </Dialog>
    </Card>
  );
}
