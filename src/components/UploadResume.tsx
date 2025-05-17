import React, { useState, useCallback } from 'react';
import { useNavigate } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Card } from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import GeneratedContent from './GeneratedContent';
import { toast } from 'sonner';

interface ResumeData {
  personalInfo: {
    name: string;
    email: string;
    phone: string;
    location: string;
  };
  education: Array<{
    degree: string;
    institution: string;
    year: string;
    gpa?: string;
  }>;
  workExperience: Array<{
    company: string;
    position: string;
    duration: string;
    responsibilities: string[];
  }>;
  skills: {
    technical: string[];
    soft: string[];
  };
  projects: Array<{
    name: string;
    description: string;
    technologies: string[];
  }>;
  certifications: string[];
}

interface GeneratedContent {
  portfolio: any;
  atsResume: any;
  coverLetter: any;
}

const UploadResume: React.FC = () => {
  const navigate = useNavigate();
  const [isDragging, setIsDragging] = useState(false);
  const [file, setFile] = useState<File | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [resumeData, setResumeData] = useState<ResumeData | null>(null);
  const [jobDescription, setJobDescription] = useState('');
  const [generatedContent, setGeneratedContent] = useState<GeneratedContent | null>(null);
  const [activeTab, setActiveTab] = useState('portfolio');
  const [processingStep, setProcessingStep] = useState<string>('');

  const handleDragEnter = useCallback((e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    setIsDragging(true);
  }, []);

  const handleDragLeave = useCallback((e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    setIsDragging(false);
  }, []);

  const handleDragOver = useCallback((e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    if (!isDragging) {
      setIsDragging(true);
    }
  }, [isDragging]);

  const handleDrop = useCallback((e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    setIsDragging(false);

    const files = e.dataTransfer.files;
    if (files && files.length > 0) {
      processFile(files[0]);
    }
  }, []);

  const handleFileChange = useCallback((e: React.ChangeEvent<HTMLInputElement>) => {
    e.preventDefault();
    const files = e.target.files;
    if (files && files.length > 0) {
      processFile(files[0]);
    }
  }, []);

  const processFile = async (selectedFile: File) => {
    if (!selectedFile) return;
    
    const fileExt = selectedFile.name.split('.').pop()?.toLowerCase();
    if (fileExt !== 'pdf' && fileExt !== 'docx') {
      setError('Please upload a PDF or DOCX file.');
      return;
    }

    // Check file size (max 5MB)
    if (selectedFile.size > 5 * 1024 * 1024) {
      setError('File size should be less than 5MB');
      return;
    }
    
    setFile(selectedFile);
    setIsLoading(true);
    setError(null);
    setProcessingStep('Processing resume...');

    try {
      const formData = new FormData();
      formData.append('file', selectedFile);

      // Process resume
      const processResponse = await fetch('http://localhost:8000/api/resume/process', {
        method: 'POST',
        body: formData,
      });
      
      if (!processResponse.ok) {
        const errorData = await processResponse.json();
        throw new Error(errorData.detail || 'Failed to process resume');
      }
      
      const { data: extractedData } = await processResponse.json();
      setResumeData(extractedData);
      setProcessingStep('Generating portfolio...');

      // Generate portfolio
      const portfolioResponse = await fetch('http://localhost:8000/api/resume/generate-portfolio', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(extractedData),
      });
      
      if (!portfolioResponse.ok) {
        const errorData = await portfolioResponse.json();
        throw new Error(errorData.detail || 'Failed to generate portfolio');
      }
      
      const { data: portfolioData } = await portfolioResponse.json();
      
      setGeneratedContent(prev => ({
        ...prev,
        portfolio: portfolioData,
      }));

      // Show success message and redirect
      toast.success('Resume processed successfully!');
      navigate('/portfolio-builder', { 
        state: { 
          resumeData: extractedData,
          portfolioData: portfolioData 
        }
      });

    } catch (error) {
      console.error('Error processing resume:', error);
      setError(error instanceof Error ? error.message : 'Error processing resume. Please try again.');
      toast.error('Failed to process resume. Please try again.');
    } finally {
      setIsLoading(false);
      setProcessingStep('');
    }
  };

  const generateATSResume = async () => {
    if (!resumeData || !jobDescription) return;
    
    setIsLoading(true);
    setProcessingStep('Generating ATS Resume...');
    try {
      const response = await fetch('http://localhost:8000/api/resume/generate-ats', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          resume_data: resumeData,
          job_description: { description: jobDescription }
        }),
      });
      
      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.detail || 'Failed to generate ATS resume');
      }
      
      const { data: atsData } = await response.json();
      setGeneratedContent(prev => ({
        ...prev,
        atsResume: atsData,
      }));
      setActiveTab('ats');
    } catch (error) {
      console.error('Error generating ATS resume:', error);
      setError(error instanceof Error ? error.message : 'Error generating ATS resume. Please try again.');
    } finally {
      setIsLoading(false);
      setProcessingStep('');
    }
  };

  const generateCoverLetter = async () => {
    if (!resumeData || !jobDescription) return;
    
    setIsLoading(true);
    setProcessingStep('Generating Cover Letter...');
    try {
      const response = await fetch('http://localhost:8000/api/resume/generate-cover-letter', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          resume_data: resumeData,
          job_description: { description: jobDescription }
        }),
      });
      
      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.detail || 'Failed to generate cover letter');
      }
      
      const { data: coverLetterData } = await response.json();
      setGeneratedContent(prev => ({
        ...prev,
        coverLetter: coverLetterData,
      }));
      setActiveTab('cover-letter');
    } catch (error) {
      console.error('Error generating cover letter:', error);
      setError(error instanceof Error ? error.message : 'Error generating cover letter. Please try again.');
    } finally {
      setIsLoading(false);
      setProcessingStep('');
    }
  };

  return (
    <div className="space-y-8">
      <form onSubmit={(e) => e.preventDefault()} className="space-y-8">
        <div 
          className={`border-2 border-dashed rounded-lg p-8 text-center transition-colors
          ${isDragging ? 'border-purple bg-purple-light/20' : 'border-gray-200 hover:border-purple-light'}`}
          onDragEnter={handleDragEnter}
          onDragLeave={handleDragLeave}
          onDragOver={handleDragOver}
          onDrop={handleDrop}
        >
          <div className="space-y-6">
            <div className="flex flex-col items-center justify-center space-y-2">
              <div className="bg-purple-light rounded-full p-3">
                <svg 
                  xmlns="http://www.w3.org/2000/svg" 
                  className="h-8 w-8 text-purple"
                  fill="none" 
                  viewBox="0 0 24 24" 
                  stroke="currentColor"
                >
                  <path 
                    strokeLinecap="round" 
                    strokeLinejoin="round" 
                    strokeWidth={2} 
                    d="M7 16a4 4 0 01-.88-7.903A5 5 0 1115.9 6L16 6a5 5 0 011 9.9M15 13l-3-3m0 0l-3 3m3-3v12" 
                  />
                </svg>
              </div>
              <div>
                <p className="text-lg font-medium">
                  {file ? file.name : 'Drag and drop your résumé'}
                </p>
                <p className="text-sm text-gray-500">
                  {file ? `${(file.size / 1024).toFixed(2)} KB` : 'Support for PDF, DOCX files (max 5MB)'}
                </p>
              </div>
            </div>
            
            <div className="flex flex-col space-y-2">
              <div className="relative">
                <Label htmlFor="resume-upload" className="sr-only">Choose file</Label>
                <Input
                  id="resume-upload"
                  type="file"
                  className="hidden"
                  onChange={handleFileChange}
                  accept=".pdf,.docx"
                />
                <Button
                  type="button"
                  variant="outline"
                  className="w-full border-purple text-purple hover:bg-purple-light"
                  onClick={() => document.getElementById('resume-upload')?.click()}
                  disabled={isLoading}
                >
                  {isLoading ? 'Processing...' : 'Upload Résumé'}
                </Button>
              </div>
              
              {isLoading && (
                <div className="space-y-2">
                  <p className="text-sm text-gray-600">{processingStep}</p>
                  <div className="h-1 w-full bg-purple-light overflow-hidden rounded">
                    <div className="h-full bg-purple w-1/2 animate-pulse"></div>
                  </div>
                </div>
              )}

              {error && (
                <div className="text-red-500 text-sm mt-2">
                  {error}
                </div>
              )}
            </div>
          </div>
        </div>

        {resumeData && (
          <div className="space-y-6">
            <div className="space-y-4">
              <Label htmlFor="job-description">Job Description (for ATS Resume and Cover Letter)</Label>
              <Textarea
                id="job-description"
                value={jobDescription}
                onChange={(e) => setJobDescription(e.target.value)}
                placeholder="Paste the job description here..."
                className="min-h-[200px]"
              />
              <div className="flex space-x-4">
                <Button
                  type="button"
                  onClick={generateATSResume}
                  disabled={isLoading || !jobDescription}
                  className="bg-purple hover:bg-purple-dark"
                >
                  Generate ATS Resume
                </Button>
                <Button
                  type="button"
                  onClick={generateCoverLetter}
                  disabled={isLoading || !jobDescription}
                  className="bg-purple hover:bg-purple-dark"
                >
                  Generate Cover Letter
                </Button>
              </div>
            </div>

            {generatedContent && (
              <Tabs value={activeTab} onValueChange={setActiveTab}>
                <TabsList className="grid w-full grid-cols-3">
                  <TabsTrigger value="portfolio">Portfolio</TabsTrigger>
                  <TabsTrigger value="ats">ATS Resume</TabsTrigger>
                  <TabsTrigger value="cover-letter">Cover Letter</TabsTrigger>
                </TabsList>
                
                <TabsContent value="portfolio">
                  <Card className="p-6">
                    <GeneratedContent content={generatedContent.portfolio} type="portfolio" />
                  </Card>
                </TabsContent>
                
                <TabsContent value="ats">
                  <Card className="p-6">
                    <GeneratedContent content={generatedContent.atsResume} type="ats" />
                  </Card>
                </TabsContent>
                
                <TabsContent value="cover-letter">
                  <Card className="p-6">
                    <GeneratedContent content={generatedContent.coverLetter} type="cover-letter" />
                  </Card>
                </TabsContent>
              </Tabs>
            )}
          </div>
        )}
      </form>
    </div>
  );
};

export default UploadResume;
