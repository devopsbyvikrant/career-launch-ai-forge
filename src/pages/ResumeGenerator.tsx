
import React, { useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { useProfileData } from '@/hooks/useProfileData';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { toast } from 'sonner';
import { NavLink } from 'react-router-dom';

const ResumeGenerator: React.FC = () => {
  const { profileData, isLoading } = useProfileData();
  const [selectedTemplate, setSelectedTemplate] = useState('standard');
  const [fileFormat, setFileFormat] = useState('pdf');
  const [isGenerating, setIsGenerating] = useState(false);
  
  const resumeTemplates = [
    { id: 'standard', name: 'Standard', description: 'Traditional resume layout' },
    { id: 'modern', name: 'Modern', description: 'Contemporary design with clean layout' },
    { id: 'minimal', name: 'Minimal', description: 'Simple design with focus on content' },
    { id: 'professional', name: 'Professional', description: 'Classic format for corporate roles' },
  ];
  
  const handleGenerate = () => {
    if (!profileData) {
      toast.error('Please complete your profile first.');
      return;
    }
    
    setIsGenerating(true);
    
    // Simulate resume generation
    setTimeout(() => {
      setIsGenerating(false);
      toast.success(`Resume generated successfully in ${fileFormat.toUpperCase()} format!`);
      // In a real app, this would trigger a download
    }, 2000);
  };
  
  if (isLoading) {
    return (
      <div className="container mx-auto py-12 px-4 flex items-center justify-center min-h-[60vh]">
        <div className="text-center">
          <div className="inline-block animate-spin rounded-full h-8 w-8 border-t-2 border-b-2 border-purple mb-4"></div>
          <p className="text-gray-600">Loading resume generator...</p>
        </div>
      </div>
    );
  }
  
  return (
    <div className="container mx-auto py-8 px-4 animate-fade-in">
      <div className="mb-8">
        <h1 className="text-3xl font-bold mb-2">ATS Resume Generator</h1>
        <p className="text-gray-600">
          Create an ATS-optimized resume tailored for your target roles
        </p>
      </div>
      
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        <div className="lg:col-span-2">
          <Card>
            <CardHeader>
              <CardTitle>Choose a Template</CardTitle>
              <CardDescription>
                Select a resume template that best suits your professional style
              </CardDescription>
            </CardHeader>
            <CardContent>
              <Tabs defaultValue="standard" onValueChange={setSelectedTemplate}>
                <TabsList className="grid grid-cols-4 mb-8">
                  {resumeTemplates.map(template => (
                    <TabsTrigger key={template.id} value={template.id}>
                      {template.name}
                    </TabsTrigger>
                  ))}
                </TabsList>
                
                {resumeTemplates.map(template => (
                  <TabsContent key={template.id} value={template.id} className="space-y-4">
                    <div className="aspect-[3/4] bg-gray-100 rounded-lg overflow-hidden border border-gray-200">
                      <div className="w-full h-full flex items-center justify-center bg-purple-light/30">
                        <div className="text-center">
                          <h3 className="text-xl font-medium text-purple">{template.name}</h3>
                          <p className="text-gray-600 text-sm mt-2">{template.description}</p>
                        </div>
                      </div>
                    </div>
                  </TabsContent>
                ))}
              </Tabs>
              
              <div className="mt-8 space-y-6">
                <div className="space-y-2">
                  <Label htmlFor="file-format">File Format</Label>
                  <Select defaultValue="pdf" onValueChange={setFileFormat}>
                    <SelectTrigger>
                      <SelectValue placeholder="Select file format" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="pdf">PDF</SelectItem>
                      <SelectItem value="docx">Word (DOCX)</SelectItem>
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
                      Generating Resume...
                    </>
                  ) : (
                    'Generate Resume'
                  )}
                </Button>
              </div>
            </CardContent>
          </Card>
        </div>
        
        <div className="lg:col-span-1">
          <Card>
            <CardHeader>
              <CardTitle>Resume Information</CardTitle>
              <CardDescription>
                Based on your profile information
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                <div>
                  <h4 className="text-sm font-medium text-gray-500">Contact Information</h4>
                  <p className="font-medium">{profileData?.fullName}</p>
                  <p className="text-sm">{profileData?.email}</p>
                  <p className="text-sm">{profileData?.phone}</p>
                </div>
                
                <div>
                  <h4 className="text-sm font-medium text-gray-500">Target Role</h4>
                  <p>{profileData?.targetRole}</p>
                </div>
                
                <div>
                  <h4 className="text-sm font-medium text-gray-500">Work Experience</h4>
                  <ul className="mt-1 space-y-2">
                    {profileData?.workExperience.map((exp, index) => (
                      <li key={index} className="text-sm">
                        <div className="font-medium">{exp.position}</div>
                        <div className="text-gray-500">{exp.company}</div>
                      </li>
                    ))}
                  </ul>
                </div>
                
                <div>
                  <h4 className="text-sm font-medium text-gray-500">Education</h4>
                  <ul className="mt-1 space-y-2">
                    {profileData?.education.map((edu, index) => (
                      <li key={index} className="text-sm">
                        <div className="font-medium">{edu.degree}</div>
                        <div className="text-gray-500">{edu.institution}, {edu.graduationYear}</div>
                      </li>
                    ))}
                  </ul>
                </div>
              </div>
              
              <div className="mt-8 border-t border-border pt-4">
                <Button asChild variant="outline" className="w-full">
                  <NavLink to="/profile">Edit Profile Information</NavLink>
                </Button>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
};

export default ResumeGenerator;
