
import React, { useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Label } from '@/components/ui/label';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { useProfileData } from '@/hooks/useProfileData';
import { toast } from 'sonner';

const CoverLetterWriter: React.FC = () => {
  const { profileData, isLoading } = useProfileData();
  const [companyName, setCompanyName] = useState('');
  const [jobTitle, setJobTitle] = useState('');
  const [jobDescription, setJobDescription] = useState('');
  const [tone, setTone] = useState('professional');
  const [isGenerating, setIsGenerating] = useState(false);
  const [coverLetter, setCoverLetter] = useState<string | null>(null);
  
  const handleGenerate = () => {
    if (!companyName || !jobTitle) {
      toast.error('Please provide both company name and job title.');
      return;
    }
    
    setIsGenerating(true);
    setCoverLetter(null);
    
    // Simulate cover letter generation
    setTimeout(() => {
      setIsGenerating(false);
      
      // Generate a mock cover letter for the MVP
      const generatedLetter = `
Dear Hiring Manager,

I am writing to express my interest in the ${jobTitle} position at ${companyName}. With my background in web development and experience working on various projects, I believe I would be a valuable addition to your team.

${profileData?.workExperience[0]?.company ? `During my time at ${profileData?.workExperience[0].company} as a ${profileData?.workExperience[0].position}, I developed skills in ${profileData?.skills.slice(0, 3).join(', ')}, which align perfectly with the requirements of this role.` : ''}

${jobDescription ? `I was particularly excited to see that you're looking for someone with expertise in ${jobDescription.split(' ').slice(0, 10).join(' ')}... This aligns perfectly with my experience and passion.` : ''}

I am impressed by ${companyName}'s commitment to innovation and excellence in the industry. I am confident that my skills and enthusiasm make me well-suited for this position, and I would welcome the opportunity to contribute to your team.

Thank you for considering my application. I look forward to the possibility of discussing how my background and skills would be beneficial to ${companyName}.

Sincerely,
${profileData?.fullName}
      `;
      
      setCoverLetter(generatedLetter);
      toast.success('Cover letter generated successfully!');
    }, 2000);
  };
  
  if (isLoading) {
    return (
      <div className="container mx-auto py-12 px-4 flex items-center justify-center min-h-[60vh]">
        <div className="text-center">
          <div className="inline-block animate-spin rounded-full h-8 w-8 border-t-2 border-b-2 border-purple mb-4"></div>
          <p className="text-gray-600">Loading cover letter writer...</p>
        </div>
      </div>
    );
  }
  
  return (
    <div className="container mx-auto py-8 px-4 animate-fade-in">
      <div className="mb-8">
        <h1 className="text-3xl font-bold mb-2">AI Cover Letter Writer</h1>
        <p className="text-gray-600">
          Create personalized cover letters for any job in seconds
        </p>
      </div>
      
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        <Card>
          <CardHeader>
            <CardTitle>Job Information</CardTitle>
            <CardDescription>
              Provide details about the job you're applying for
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-6">
              <div className="space-y-2">
                <Label htmlFor="company-name">Company Name</Label>
                <Input
                  id="company-name"
                  placeholder="e.g., Google, Amazon"
                  value={companyName}
                  onChange={(e) => setCompanyName(e.target.value)}
                />
              </div>
              
              <div className="space-y-2">
                <Label htmlFor="job-title">Job Title</Label>
                <Input
                  id="job-title"
                  placeholder="e.g., Frontend Developer, Product Manager"
                  value={jobTitle}
                  onChange={(e) => setJobTitle(e.target.value)}
                />
              </div>
              
              <div className="space-y-2">
                <Label htmlFor="job-description">Job Description (Optional)</Label>
                <Textarea
                  id="job-description"
                  placeholder="Paste the job description or key requirements here"
                  rows={5}
                  value={jobDescription}
                  onChange={(e) => setJobDescription(e.target.value)}
                />
                <p className="text-sm text-gray-500">
                  Adding the job description helps our AI tailor the cover letter to specific requirements
                </p>
              </div>
              
              <div className="space-y-2">
                <Label htmlFor="tone">Tone of Voice</Label>
                <Select defaultValue="professional" onValueChange={setTone}>
                  <SelectTrigger>
                    <SelectValue placeholder="Select tone" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="professional">Professional</SelectItem>
                    <SelectItem value="enthusiastic">Enthusiastic</SelectItem>
                    <SelectItem value="confident">Confident</SelectItem>
                    <SelectItem value="friendly">Friendly</SelectItem>
                    <SelectItem value="formal">Formal</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              
              <Button 
                onClick={handleGenerate} 
                className="w-full bg-purple hover:bg-purple-dark"
                disabled={isGenerating}
              >
                {isGenerating ? (
                  <>
                    <div className="animate-spin mr-2 h-4 w-4 border-2 border-white border-t-transparent rounded-full"></div>
                    Generating Cover Letter...
                  </>
                ) : (
                  'Generate Cover Letter'
                )}
              </Button>
            </div>
          </CardContent>
        </Card>
        
        <Card>
          <CardHeader>
            <CardTitle>Your Cover Letter</CardTitle>
            <CardDescription>
              Edit your generated cover letter as needed
            </CardDescription>
          </CardHeader>
          <CardContent>
            {coverLetter ? (
              <div className="space-y-6">
                <Textarea
                  value={coverLetter}
                  onChange={(e) => setCoverLetter(e.target.value)}
                  rows={15}
                  className="h-[500px] font-mono text-sm"
                />
                <div className="flex justify-between">
                  <Button variant="outline">
                    Copy Text
                  </Button>
                  <Button variant="default" className="bg-purple hover:bg-purple-dark">
                    Download PDF
                  </Button>
                </div>
              </div>
            ) : (
              <div className="h-[500px] flex items-center justify-center border border-dashed border-gray-300 rounded-lg">
                <div className="text-center px-4">
                  <svg xmlns="http://www.w3.org/2000/svg" className="h-10 w-10 mx-auto text-gray-400 mb-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                  </svg>
                  <p className="text-gray-600 mb-2">No cover letter generated yet</p>
                  <p className="text-sm text-gray-500 max-w-md">
                    Fill in the job details and click "Generate Cover Letter" to create your personalized cover letter
                  </p>
                </div>
              </div>
            )}
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default CoverLetterWriter;
