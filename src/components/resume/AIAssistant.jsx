"use client";

import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "../ui/card";
import { Button } from "../ui/button";
import { Textarea } from "../ui/textarea";
import { Badge } from "../ui/badge";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "../ui/dialog";
import { Collapsible, CollapsibleContent, CollapsibleTrigger } from "../ui/collapsible";
import { ChevronDown, ChevronUp, Sparkles, Copy, Check } from "lucide-react";
import { useAIRewrite } from "../../hooks/useAIRewrite";
import { useAIExtract } from "../../hooks/useAIExtract";
import { useAISummary } from "../../hooks/useAISummary";
import { useAICover } from "../../hooks/useAICover";
import { useATSScore } from "../../hooks/useATSScore";

export default function AIAssistant({ data, setData }) {
  const [isOpen, setIsOpen] = useState(false);
  const [rawExperience, setRawExperience] = useState("");
  const [jobDescription, setJobDescription] = useState("");
  const [atsResult, setAtsResult] = useState(null);
  const [coverLetter, setCoverLetter] = useState("");
  const [showCoverDialog, setShowCoverDialog] = useState(false);
  const [copied, setCopied] = useState(false);

  const { rewrite, loading: rewriteLoading, error: rewriteError } = useAIRewrite();
  const { extract, loading: extractLoading, error: extractError } = useAIExtract();
  const { summarize, loading: summaryLoading, error: summaryError } = useAISummary();
  const { generate: generateCover, loading: coverLoading, error: coverError } = useAICover();
  const { score, loading: scoreLoading, error: scoreError } = useATSScore();

  const handleExtractBullets = async () => {
    if (!rawExperience.trim()) return;

    try {
      const bullets = await extract(rawExperience, data.title);
      
      // Add extracted bullets to experience
      const newExperience = {
        company: "Extracted Experience",
        title: "Role",
        startDate: "",
        endDate: "",
        description: bullets.join('\n'),
      };

      setData({
        ...data,
        experience: [...data.experience, newExperience],
      });
      setRawExperience("");
    } catch (error) {
      console.error('Failed to extract bullets:', error);
    }
  };

  const handleRewriteBullet = async (bulletIndex, experienceIndex) => {
    const bullet = data.experience[experienceIndex].description.split('\n')[bulletIndex];
    
    try {
      const variants = await rewrite([bullet], { role: data.title });
      if (variants && variants[0]) {
        const newBullets = data.experience[experienceIndex].description.split('\n');
        newBullets[bulletIndex] = variants[0].v1;
        
        const newExperience = [...data.experience];
        newExperience[experienceIndex] = {
          ...newExperience[experienceIndex],
          description: newBullets.join('\n'),
        };

        setData({
          ...data,
          experience: newExperience,
        });
      }
    } catch (error) {
      console.error('Failed to rewrite bullet:', error);
    }
  };

  const handleGenerateSummary = async () => {
    try {
      const summary = await summarize({
        name: data.name,
        title: data.title,
        skills: data.skills,
      });

      setData({
        ...data,
        summary,
      });
    } catch (error) {
      console.error('Failed to generate summary:', error);
    }
  };

  const handleCalculateATSScore = async () => {
    if (!jobDescription.trim()) return;

    try {
      const resumeText = `${data.name} ${data.title} ${data.summary} ${data.skills.join(' ')} ${data.experience.map(exp => exp.description).join(' ')}`;
      const result = await score(resumeText, jobDescription);
      setAtsResult(result);
    } catch (error) {
      console.error('Failed to calculate ATS score:', error);
    }
  };

  const handleGenerateCoverLetter = async () => {
    if (!jobDescription.trim()) return;

    try {
      const jobInfo = {
        title: "Software Engineer", // This could be extracted from job description
        company: "Company Name",
        description: jobDescription,
      };

      const letter = await generateCover(
        {
          name: data.name,
          title: data.title,
          skills: data.skills,
        },
        jobInfo
      );

      setCoverLetter(letter);
      setShowCoverDialog(true);
    } catch (error) {
      console.error('Failed to generate cover letter:', error);
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
                <Sparkles className="h-5 w-5 text-blue-600" />
                AI Resume Assistant
              </CardTitle>
              {isOpen ? <ChevronUp className="h-4 w-4" /> : <ChevronDown className="h-4 w-4" />}
            </div>
          </CardHeader>
        </CollapsibleTrigger>
        
        <CollapsibleContent>
          <CardContent className="space-y-6">
            {/* Extract Bullets */}
            <div className="space-y-3">
              <h4 className="font-medium">Extract Bullets from Raw Experience</h4>
              <Textarea
                placeholder="Paste your raw experience here..."
                value={rawExperience}
                onChange={(e) => setRawExperience(e.target.value)}
                rows={3}
              />
              <Button 
                onClick={handleExtractBullets}
                disabled={!rawExperience.trim() || extractLoading}
                className="w-full"
              >
                {extractLoading ? "Extracting..." : "Extract Bullets"}
              </Button>
            </div>

            {/* Rewrite Existing Bullets */}
            {data.experience.length > 0 && (
              <div className="space-y-3">
                <h4 className="font-medium">Polish Existing Bullets</h4>
                {data.experience.map((exp, expIndex) => (
                  <div key={expIndex} className="space-y-2">
                    <h5 className="text-sm font-medium">{exp.company}</h5>
                    {exp.description.split('\n').map((bullet, bulletIndex) => (
                      <div key={bulletIndex} className="flex items-start gap-2">
                        <span className="text-sm flex-1">• {bullet}</span>
                        <Button
                          size="sm"
                          variant="outline"
                          onClick={() => handleRewriteBullet(bulletIndex, expIndex)}
                          disabled={rewriteLoading}
                        >
                          Polish
                        </Button>
                      </div>
                    ))}
                  </div>
                ))}
              </div>
            )}

            {/* Generate Summary */}
            <div className="space-y-3">
              <h4 className="font-medium">Generate Summary</h4>
              <Button 
                onClick={handleGenerateSummary}
                disabled={summaryLoading}
                className="w-full"
              >
                Generate Summary
              </Button>
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
