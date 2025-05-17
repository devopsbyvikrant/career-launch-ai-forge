
import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { useProfileData } from '@/hooks/useProfileData';
import { toast } from 'sonner';

const PortfolioBuilder: React.FC = () => {
  const navigate = useNavigate();
  const { profileData, isLoading } = useProfileData();
  const [selectedTemplate, setSelectedTemplate] = useState('minimal');
  const [isGenerating, setIsGenerating] = useState(false);
  
  const templateOptions = [
    { id: 'minimal', name: 'Minimal', description: 'Clean, simple design with focus on content' },
    { id: 'modern', name: 'Modern', description: 'Contemporary layout with bold typography' },
    { id: 'creative', name: 'Creative', description: 'Unique design with creative elements' },
    { id: 'professional', name: 'Professional', description: 'Traditional portfolio for corporate roles' },
  ];
  
  const handleGenerate = () => {
    if (!profileData) {
      toast.error('Please complete your profile first.');
      navigate('/profile');
      return;
    }
    
    setIsGenerating(true);
    
    // Simulate portfolio generation
    setTimeout(() => {
      setIsGenerating(false);
      toast.success('Portfolio generated successfully!');
      navigate('/portfolio-preview');
    }, 3000);
  };
  
  if (isLoading) {
    return (
      <div className="container mx-auto py-12 px-4 flex items-center justify-center min-h-[60vh]">
        <div className="text-center">
          <div className="inline-block animate-spin rounded-full h-8 w-8 border-t-2 border-b-2 border-purple mb-4"></div>
          <p className="text-gray-600">Loading portfolio builder...</p>
        </div>
      </div>
    );
  }
  
  return (
    <div className="container mx-auto py-8 px-4 animate-fade-in">
      <div className="mb-8">
        <h1 className="text-3xl font-bold mb-2">AI Portfolio Builder</h1>
        <p className="text-gray-600">
          Create a professional portfolio website in minutes
        </p>
      </div>
      
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        <div className="lg:col-span-2">
          <Card>
            <CardHeader>
              <CardTitle>Choose a Template</CardTitle>
              <CardDescription>
                Select a template that best represents your professional style
              </CardDescription>
            </CardHeader>
            <CardContent>
              <Tabs defaultValue="minimal" onValueChange={setSelectedTemplate}>
                <TabsList className="grid grid-cols-4 mb-8">
                  {templateOptions.map(template => (
                    <TabsTrigger key={template.id} value={template.id}>
                      {template.name}
                    </TabsTrigger>
                  ))}
                </TabsList>
                
                {templateOptions.map(template => (
                  <TabsContent key={template.id} value={template.id} className="space-y-4">
                    <div className="aspect-video bg-gray-100 rounded-lg overflow-hidden border border-gray-200">
                      <div className="w-full h-full flex items-center justify-center bg-purple-light/30">
                        <div className="text-center">
                          <h3 className="text-xl font-medium text-purple">{template.name}</h3>
                          <p className="text-gray-600 text-sm mt-2">{template.description}</p>
                        </div>
                      </div>
                    </div>
                    <p className="text-gray-600">
                      {template.description} template with sections for your experience, skills, projects, and education.
                    </p>
                  </TabsContent>
                ))}
              </Tabs>
              
              <div className="mt-8">
                <Button 
                  onClick={handleGenerate} 
                  className="w-full bg-purple hover:bg-purple-dark"
                  disabled={isGenerating}
                >
                  {isGenerating ? (
                    <>
                      <div className="animate-spin mr-2 h-4 w-4 border-2 border-white border-t-transparent rounded-full"></div>
                      Generating Portfolio...
                    </>
                  ) : (
                    'Generate Portfolio'
                  )}
                </Button>
              </div>
            </CardContent>
          </Card>
        </div>
        
        <div className="lg:col-span-1">
          <Card>
            <CardHeader>
              <CardTitle>Portfolio Preview</CardTitle>
              <CardDescription>
                Based on your profile information
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                <div>
                  <h4 className="text-sm font-medium text-gray-500">Name</h4>
                  <p className="font-medium">{profileData?.fullName || 'Not provided'}</p>
                </div>
                
                <div>
                  <h4 className="text-sm font-medium text-gray-500">Target Role</h4>
                  <p>{profileData?.targetRole || 'Not specified'}</p>
                </div>
                
                <div>
                  <h4 className="text-sm font-medium text-gray-500">Skills</h4>
                  <div className="flex flex-wrap gap-2 mt-1">
                    {profileData?.skills.map((skill, index) => (
                      <span key={index} className="bg-purple-light text-purple-dark px-2 py-1 rounded-full text-xs">
                        {skill}
                      </span>
                    ))}
                  </div>
                </div>
                
                <div>
                  <h4 className="text-sm font-medium text-gray-500">Work Experience</h4>
                  <ul className="mt-1 space-y-2">
                    {profileData?.workExperience.map((exp, index) => (
                      <li key={index} className="text-sm">
                        <span className="font-medium">{exp.position}</span>
                        <span className="text-gray-500"> at {exp.company}</span>
                      </li>
                    ))}
                  </ul>
                </div>
                
                <div>
                  <h4 className="text-sm font-medium text-gray-500">Education</h4>
                  <ul className="mt-1 space-y-2">
                    {profileData?.education.map((edu, index) => (
                      <li key={index} className="text-sm">
                        <span className="font-medium">{edu.degree}</span>
                        <span className="text-gray-500"> from {edu.institution}</span>
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

export default PortfolioBuilder;
