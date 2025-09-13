'use client';

import { useState, useEffect } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '../../components/ui/card';
import { Button } from '../../components/ui/button';
import { Input } from '../../components/ui/input';
import { Label } from '../../components/ui/label';
import { Badge } from '../../components/ui/badge';
import { Progress } from '../../components/ui/progress';
import { Alert, AlertDescription } from '../../components/ui/alert';
import { Upload, FileText, CheckCircle, Clock, AlertCircle } from 'lucide-react';

export default function SkillVerificationPage() {
  const [step, setStep] = useState('upload'); // upload, test, results
  const [resumeFile, setResumeFile] = useState(null);
  const [extractedSkills, setExtractedSkills] = useState([]);
  const [tests, setTests] = useState([]);
  const [currentTest, setCurrentTest] = useState(null);
  const [testAnswers, setTestAnswers] = useState({});
  const [timeLeft, setTimeLeft] = useState(0);
  const [tabSwitches, setTabSwitches] = useState(0);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  // Anti-cheat: Track tab switches
  useEffect(() => {
    const handleVisibilityChange = () => {
      if (document.hidden) {
        setTabSwitches(prev => prev + 1);
      }
    };

    document.addEventListener('visibilitychange', handleVisibilityChange);
    return () => document.removeEventListener('visibilitychange', handleVisibilityChange);
  }, []);

  // Timer for tests
  useEffect(() => {
    if (timeLeft > 0) {
      const timer = setTimeout(() => setTimeLeft(timeLeft - 1), 1000);
      return () => clearTimeout(timer);
    } else if (timeLeft === 0 && currentTest) {
      handleSubmitTest();
    }
  }, [timeLeft]);

  const handleFileUpload = async (event) => {
    const file = event.target.files[0];
    if (!file) return;

    setResumeFile(file);
    setLoading(true);
    setError('');

    try {
      const formData = new FormData();
      formData.append('resume', file);

      const response = await fetch('/api/skills/upload-resume', {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${localStorage.getItem('token')}`
        },
        body: formData
      });

      const data = await response.json();
      
      if (response.ok) {
        setExtractedSkills(data.extractedSkills);
        setStep('test');
      } else {
        setError(data.error || 'Failed to upload resume');
      }
    } catch (err) {
      setError('Failed to upload resume');
    } finally {
      setLoading(false);
    }
  };

  const generateTests = async () => {
    setLoading(true);
    setError('');

    try {
      const skills = extractedSkills.map(skill => skill.name);
      const response = await fetch('/api/skills/generate-test', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${localStorage.getItem('token')}`
        },
        body: JSON.stringify({ skills, difficulty: 'intermediate' })
      });

      const data = await response.json();
      
      if (response.ok) {
        setTests(data.tests);
        if (data.tests.length > 0) {
          startTest(data.tests[0]);
        }
      } else {
        setError(data.error || 'Failed to generate tests');
      }
    } catch (err) {
      setError('Failed to generate tests');
    } finally {
      setLoading(false);
    }
  };

  const startTest = async (test) => {
    setCurrentTest(test);
    setTimeLeft(test.timeLimit * 60); // Convert to seconds
    setTestAnswers({});
    setTabSwitches(0);
    
    // Fetch test details
    try {
      const response = await fetch(`/api/skills/tests/${test.testId}`);
      const data = await response.json();
      if (response.ok) {
        setCurrentTest({ ...test, questions: data.questions });
      }
    } catch (err) {
      console.error('Failed to fetch test details:', err);
    }
  };

  const handleAnswerChange = (questionId, answer) => {
    setTestAnswers(prev => ({
      ...prev,
      [questionId]: answer
    }));
  };

  const handleSubmitTest = async () => {
    if (!currentTest) return;

    setLoading(true);
    setError('');

    try {
      const response = await fetch('/api/skills/submit-test', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${localStorage.getItem('token')}`
        },
        body: JSON.stringify({
          testId: currentTest.testId,
          answers: testAnswers,
          timeSpent: (currentTest.timeLimit * 60) - timeLeft,
          tabSwitches
        })
      });

      const data = await response.json();
      
      if (response.ok) {
        // Move to next test or show results
        const currentIndex = tests.findIndex(t => t.testId === currentTest.testId);
        if (currentIndex < tests.length - 1) {
          startTest(tests[currentIndex + 1]);
        } else {
          setStep('results');
        }
      } else {
        setError(data.error || 'Failed to submit test');
      }
    } catch (err) {
      setError('Failed to submit test');
    } finally {
      setLoading(false);
    }
  };

  const formatTime = (seconds) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins}:${secs.toString().padStart(2, '0')}`;
  };

  return (
    <div className="container mx-auto px-4 py-8 max-w-4xl">
      <div className="mb-8">
        <h1 className="text-3xl font-bold mb-2">Skill Verification</h1>
        <p className="text-gray-600">
          Upload your resume and take skill assessments to verify your technical abilities.
        </p>
      </div>

      {error && (
        <Alert className="mb-6" variant="destructive">
          <AlertCircle className="h-4 w-4" />
          <AlertDescription>{error}</AlertDescription>
        </Alert>
      )}

      {step === 'upload' && (
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Upload className="h-5 w-5" />
              Upload Resume
            </CardTitle>
            <CardDescription>
              Upload your resume to automatically extract skills and generate assessments.
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              <div>
                <Label htmlFor="resume">Resume File</Label>
                <Input
                  id="resume"
                  type="file"
                  accept=".pdf,.docx,.txt"
                  onChange={handleFileUpload}
                  disabled={loading}
                />
                <p className="text-sm text-gray-500 mt-1">
                  Supported formats: PDF, DOCX, TXT
                </p>
              </div>
              
              {resumeFile && (
                <div className="flex items-center gap-2 text-sm text-green-600">
                  <FileText className="h-4 w-4" />
                  {resumeFile.name}
                </div>
              )}
            </div>
          </CardContent>
        </Card>
      )}

      {step === 'test' && extractedSkills.length > 0 && (
        <div className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle>Extracted Skills</CardTitle>
              <CardDescription>
                We found these skills in your resume. You'll be tested on them.
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="flex flex-wrap gap-2">
                {extractedSkills.map((skill, index) => (
                  <Badge key={index} variant="secondary">
                    {skill.name}
                  </Badge>
                ))}
              </div>
              <Button 
                onClick={generateTests} 
                className="mt-4"
                disabled={loading}
              >
                {loading ? 'Generating Tests...' : 'Start Skill Assessment'}
              </Button>
            </CardContent>
          </Card>

          {currentTest && (
            <Card>
              <CardHeader>
                <div className="flex justify-between items-center">
                  <div>
                    <CardTitle>{currentTest.title}</CardTitle>
                    <CardDescription>
                      {currentTest.questionCount} questions • {currentTest.timeLimit} minutes
                    </CardDescription>
                  </div>
                  <div className="text-right">
                    <div className="flex items-center gap-2 text-sm">
                      <Clock className="h-4 w-4" />
                      {formatTime(timeLeft)}
                    </div>
                    <div className="text-xs text-gray-500">
                      Tab switches: {tabSwitches}
                    </div>
                  </div>
                </div>
                <Progress 
                  value={((currentTest.timeLimit * 60 - timeLeft) / (currentTest.timeLimit * 60)) * 100} 
                  className="w-full"
                />
              </CardHeader>
              <CardContent>
                <div className="space-y-6">
                  {currentTest.questions?.map((question, index) => (
                    <div key={question.id} className="border rounded-lg p-4">
                      <h3 className="font-semibold mb-3">
                        Question {index + 1}: {question.question}
                      </h3>
                      
                      {question.type === 'mcq' ? (
                        <div className="space-y-2">
                          {question.options.map((option, optIndex) => (
                            <label key={optIndex} className="flex items-center space-x-2">
                              <input
                                type="radio"
                                name={question.id}
                                value={optIndex}
                                checked={testAnswers[question.id] === optIndex}
                                onChange={(e) => handleAnswerChange(question.id, parseInt(e.target.value))}
                                className="rounded"
                              />
                              <span>{option}</span>
                            </label>
                          ))}
                        </div>
                      ) : (
                        <div>
                          <textarea
                            value={testAnswers[question.id]?.code || ''}
                            onChange={(e) => handleAnswerChange(question.id, { code: e.target.value })}
                            placeholder="Write your code here..."
                            className="w-full h-32 p-3 border rounded-md font-mono text-sm"
                          />
                        </div>
                      )}
                    </div>
                  ))}
                </div>
                
                <div className="flex justify-end mt-6">
                  <Button 
                    onClick={handleSubmitTest}
                    disabled={loading}
                  >
                    {loading ? 'Submitting...' : 'Submit Test'}
                  </Button>
                </div>
              </CardContent>
            </Card>
          )}
        </div>
      )}

      {step === 'results' && (
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <CheckCircle className="h-5 w-5 text-green-500" />
              Assessment Complete
            </CardTitle>
            <CardDescription>
              Your skill verification results have been saved.
            </CardDescription>
          </CardHeader>
          <CardContent>
            <p className="text-gray-600">
              You can view your results in the dashboard or take additional assessments.
            </p>
            <div className="flex gap-4 mt-4">
              <Button onClick={() => setStep('upload')}>
                Take Another Assessment
              </Button>
              <Button variant="outline" onClick={() => window.location.href = '/dashboard'}>
                Go to Dashboard
              </Button>
            </div>
          </CardContent>
        </Card>
      )}
    </div>
  );
}
