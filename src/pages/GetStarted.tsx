
import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import UploadResume from '@/components/UploadResume';
import LinkedInInput from '@/components/LinkedInInput';
import QAForm, { QAFormData } from '@/components/QAForm';
import { toast } from 'sonner';

const GetStarted: React.FC = () => {
  const navigate = useNavigate();
  const [isProcessing, setIsProcessing] = useState(false);
  
  const handleResumeUpload = (fileData: string) => {
    setIsProcessing(true);
    
    // Simulate processing delay
    setTimeout(() => {
      setIsProcessing(false);
      localStorage.setItem('onboardingMethod', 'resume');
      localStorage.setItem('resumeData', fileData);
      
      toast.success('Resume processed successfully!');
      navigate('/dashboard');
    }, 2000);
  };
  
  const handleLinkedInSubmit = (url: string) => {
    setIsProcessing(true);
    
    // Simulate processing delay
    setTimeout(() => {
      setIsProcessing(false);
      localStorage.setItem('onboardingMethod', 'linkedin');
      localStorage.setItem('linkedinUrl', url);
      
      toast.success('LinkedIn profile imported successfully!');
      navigate('/dashboard');
    }, 2000);
  };
  
  const handleQAFormComplete = (data: QAFormData) => {
    setIsProcessing(true);
    
    // Simulate processing delay
    setTimeout(() => {
      setIsProcessing(false);
      localStorage.setItem('onboardingMethod', 'qa');
      localStorage.setItem('qaFormData', JSON.stringify(data));
      
      toast.success('Profile created successfully!');
      navigate('/dashboard');
    }, 2000);
  };
  
  return (
    <div className="container mx-auto py-12 px-4 animate-fade-in">
      <div className="max-w-4xl mx-auto">
        <div className="text-center mb-8">
          <h1 className="text-3xl md:text-4xl font-bold mb-4">Get Started with PortfolioAI</h1>
          <p className="text-xl text-gray-600">
            Choose how you want to create your profile
          </p>
        </div>
        
        <Tabs defaultValue="resume" className="w-full">
          <TabsList className="grid grid-cols-3 mb-8">
            <TabsTrigger value="resume">Upload Resume</TabsTrigger>
            <TabsTrigger value="linkedin">LinkedIn Profile</TabsTrigger>
            <TabsTrigger value="qa">Answer Questions</TabsTrigger>
          </TabsList>
          
          <TabsContent value="resume">
            <Card>
              <CardHeader>
                <CardTitle>Upload Your Resume</CardTitle>
                <CardDescription>
                  Upload your existing resume and we'll extract your experience, skills, and education.
                </CardDescription>
              </CardHeader>
              <CardContent>
                <UploadResume onUploadComplete={handleResumeUpload} />
              </CardContent>
            </Card>
          </TabsContent>
          
          <TabsContent value="linkedin">
            <Card>
              <CardHeader>
                <CardTitle>Import from LinkedIn</CardTitle>
                <CardDescription>
                  Connect your LinkedIn profile to quickly import your professional experience.
                </CardDescription>
              </CardHeader>
              <CardContent>
                <LinkedInInput onSubmit={handleLinkedInSubmit} />
              </CardContent>
            </Card>
          </TabsContent>
          
          <TabsContent value="qa">
            <QAForm onComplete={handleQAFormComplete} />
          </TabsContent>
        </Tabs>
        
        {isProcessing && (
          <div className="mt-8 text-center">
            <div className="inline-block animate-spin rounded-full h-8 w-8 border-t-2 border-b-2 border-purple"></div>
            <p className="mt-2 text-gray-600">Processing your information...</p>
          </div>
        )}
      </div>
    </div>
  );
};

export default GetStarted;
