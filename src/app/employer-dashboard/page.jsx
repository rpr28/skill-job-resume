'use client';

import { useState, useEffect } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { CheckCircle, XCircle, Search, User, Award, Clock } from 'lucide-react';

export default function EmployerDashboard() {
  const [candidates, setCandidates] = useState([]);
  const [selectedCandidate, setSelectedCandidate] = useState(null);
  const [searchTerm, setSearchTerm] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  useEffect(() => {
    fetchCandidates();
  }, []);

  const fetchCandidates = async () => {
    setLoading(true);
    try {
      const response = await fetch('/api/skills/candidates', {
        headers: {
          'Authorization': `Bearer ${localStorage.getItem('token')}`
        }
      });
      
      const data = await response.json();
      if (response.ok) {
        setCandidates(data.candidates);
      } else {
        setError(data.error || 'Failed to fetch candidates');
      }
    } catch (err) {
      setError('Failed to fetch candidates');
    } finally {
      setLoading(false);
    }
  };

  const fetchCandidateResults = async (candidateId) => {
    setLoading(true);
    try {
      const response = await fetch(`/api/skills/results/${candidateId}`, {
        headers: {
          'Authorization': `Bearer ${localStorage.getItem('token')}`
        }
      });
      
      const data = await response.json();
      if (response.ok) {
        setSelectedCandidate(data);
      } else {
        setError(data.error || 'Failed to fetch candidate results');
      }
    } catch (err) {
      setError('Failed to fetch candidate results');
    } finally {
      setLoading(false);
    }
  };

  const filteredCandidates = candidates.filter(candidate =>
    candidate.name?.toLowerCase().includes(searchTerm.toLowerCase()) ||
    candidate.email?.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const getVerificationStatus = (verified, score) => {
    if (verified) {
      return (
        <Badge variant="default" className="bg-green-500">
          <CheckCircle className="h-3 w-3 mr-1" />
          Verified ({score}%)
        </Badge>
      );
    }
    return (
      <Badge variant="secondary">
        <XCircle className="h-3 w-3 mr-1" />
        Not Verified ({score}%)
      </Badge>
    );
  };

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="mb-8">
        <h1 className="text-3xl font-bold mb-2">Employer Dashboard</h1>
        <p className="text-gray-600">
          View candidate skill verification results and assessments.
        </p>
      </div>

      {error && (
        <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded mb-6">
          {error}
        </div>
      )}

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Candidates List */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <User className="h-5 w-5" />
              Candidates
            </CardTitle>
            <CardDescription>
              Select a candidate to view their skill verification results.
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              <div className="relative">
                <Search className="absolute left-3 top-3 h-4 w-4 text-gray-400" />
                <Input
                  placeholder="Search candidates..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="pl-10"
                />
              </div>

              <div className="space-y-2 max-h-96 overflow-y-auto">
                {filteredCandidates.map((candidate) => (
                  <div
                    key={candidate.id}
                    className={`p-3 border rounded-lg cursor-pointer hover:bg-gray-50 ${
                      selectedCandidate?.candidate?.id === candidate.id ? 'bg-blue-50 border-blue-200' : ''
                    }`}
                    onClick={() => fetchCandidateResults(candidate.id)}
                  >
                    <div className="flex justify-between items-start">
                      <div>
                        <h3 className="font-semibold">{candidate.name || 'Unknown'}</h3>
                        <p className="text-sm text-gray-600">{candidate.email}</p>
                        <p className="text-xs text-gray-500">
                          Joined: {new Date(candidate.createdAt).toLocaleDateString()}
                        </p>
                      </div>
                      <div className="text-right">
                        <div className="text-sm font-medium">
                          {candidate.skillCount || 0} skills
                        </div>
                        <div className="text-xs text-gray-500">
                          {candidate.verifiedCount || 0} verified
                        </div>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Candidate Results */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Award className="h-5 w-5" />
              Skill Verification Results
            </CardTitle>
            <CardDescription>
              {selectedCandidate ? 
                `Results for ${selectedCandidate.candidate?.name}` : 
                'Select a candidate to view results'
              }
            </CardDescription>
          </CardHeader>
          <CardContent>
            {selectedCandidate ? (
              <div className="space-y-4">
                {/* Summary */}
                <div className="grid grid-cols-3 gap-4 p-4 bg-gray-50 rounded-lg">
                  <div className="text-center">
                    <div className="text-2xl font-bold text-blue-600">
                      {selectedCandidate.summary?.totalSkills || 0}
                    </div>
                    <div className="text-sm text-gray-600">Total Skills</div>
                  </div>
                  <div className="text-center">
                    <div className="text-2xl font-bold text-green-600">
                      {selectedCandidate.summary?.verifiedSkills || 0}
                    </div>
                    <div className="text-sm text-gray-600">Verified</div>
                  </div>
                  <div className="text-center">
                    <div className="text-2xl font-bold text-orange-600">
                      {Math.round(selectedCandidate.summary?.averageScore || 0)}%
                    </div>
                    <div className="text-sm text-gray-600">Avg Score</div>
                  </div>
                </div>

                {/* Skills Table */}
                <div className="border rounded-lg">
                  <Table>
                    <TableHeader>
                      <TableRow>
                        <TableHead>Skill</TableHead>
                        <TableHead>Category</TableHead>
                        <TableHead>Status</TableHead>
                        <TableHead>Score</TableHead>
                        <TableHead>Verified</TableHead>
                      </TableRow>
                    </TableHeader>
                    <TableBody>
                      {selectedCandidate.skillVerifications?.map((skill, index) => (
                        <TableRow key={index}>
                          <TableCell className="font-medium">{skill.skill}</TableCell>
                          <TableCell>
                            <Badge variant="outline">{skill.category}</Badge>
                          </TableCell>
                          <TableCell>
                            {getVerificationStatus(skill.verified, skill.score)}
                          </TableCell>
                          <TableCell>{skill.score || 0}%</TableCell>
                          <TableCell>
                            {skill.verifiedAt ? (
                              <div className="flex items-center gap-1 text-sm text-gray-600">
                                <Clock className="h-3 w-3" />
                                {new Date(skill.verifiedAt).toLocaleDateString()}
                              </div>
                            ) : (
                              <span className="text-gray-400">Not verified</span>
                            )}
                          </TableCell>
                        </TableRow>
                      ))}
                    </TableBody>
                  </Table>
                </div>

                {/* Test Details */}
                {selectedCandidate.skillVerifications?.some(s => s.testResult) && (
                  <div className="mt-4">
                    <h4 className="font-semibold mb-2">Test Details</h4>
                    <div className="space-y-2">
                      {selectedCandidate.skillVerifications
                        .filter(s => s.testResult)
                        .map((skill, index) => (
                          <div key={index} className="p-3 border rounded-lg">
                            <div className="flex justify-between items-center">
                              <span className="font-medium">{skill.skill}</span>
                              <div className="flex gap-4 text-sm text-gray-600">
                                <span>Time: {Math.floor(skill.testResult.timeSpent / 60)}m {skill.testResult.timeSpent % 60}s</span>
                                <span>Tab switches: {skill.testResult.tabSwitches}</span>
                                <span>Submitted: {new Date(skill.testResult.submittedAt).toLocaleDateString()}</span>
                              </div>
                            </div>
                          </div>
                        ))}
                    </div>
                  </div>
                )}
              </div>
            ) : (
              <div className="text-center text-gray-500 py-8">
                Select a candidate to view their skill verification results
              </div>
            )}
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
