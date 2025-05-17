
import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';

interface QAFormProps {
  onComplete: (data: QAFormData) => void;
}

export interface QAFormData {
  fullName: string;
  email: string;
  phone: string;
  targetRole: string;
  skills: string;
  workExperience: string;
  education: string;
  projects: string;
}

const QAForm: React.FC<QAFormProps> = ({ onComplete }) => {
  const [currentStep, setCurrentStep] = useState(1);
  const totalSteps = 4;
  
  const [formData, setFormData] = useState<QAFormData>({
    fullName: '',
    email: '',
    phone: '',
    targetRole: '',
    skills: '',
    workExperience: '',
    education: '',
    projects: '',
  });
  
  const updateForm = (key: keyof QAFormData, value: string) => {
    setFormData(prev => ({ ...prev, [key]: value }));
  };
  
  const handleNext = () => {
    if (currentStep < totalSteps) {
      setCurrentStep(currentStep + 1);
    } else {
      onComplete(formData);
    }
  };
  
  const handleBack = () => {
    if (currentStep > 1) {
      setCurrentStep(currentStep - 1);
    }
  };
  
  return (
    <Card className="w-full">
      <CardHeader>
        <CardTitle>
          <div className="flex items-center justify-between">
            <span>Complete Your Profile</span>
            <span className="text-sm text-gray-500">Step {currentStep} of {totalSteps}</span>
          </div>
        </CardTitle>
        <div className="w-full bg-gray-200 h-2 rounded-full mt-2">
          <div 
            className="bg-purple h-2 rounded-full transition-all"
            style={{ width: `${(currentStep / totalSteps) * 100}%` }}
          ></div>
        </div>
      </CardHeader>
      <CardContent>
        {currentStep === 1 && (
          <div className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="fullName">Full Name</Label>
              <Input
                id="fullName"
                value={formData.fullName}
                onChange={(e) => updateForm('fullName', e.target.value)}
                placeholder="John Doe"
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="email">Email</Label>
              <Input
                id="email"
                type="email"
                value={formData.email}
                onChange={(e) => updateForm('email', e.target.value)}
                placeholder="john@example.com"
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="phone">Phone Number</Label>
              <Input
                id="phone"
                value={formData.phone}
                onChange={(e) => updateForm('phone', e.target.value)}
                placeholder="+91 9876543210"
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="targetRole">Target Role</Label>
              <Input
                id="targetRole"
                value={formData.targetRole}
                onChange={(e) => updateForm('targetRole', e.target.value)}
                placeholder="Software Engineer, Product Manager, etc."
              />
            </div>
          </div>
        )}
        
        {currentStep === 2 && (
          <div className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="skills">Skills</Label>
              <Textarea
                id="skills"
                value={formData.skills}
                onChange={(e) => updateForm('skills', e.target.value)}
                placeholder="List your technical and soft skills (e.g., JavaScript, React, Team leadership)"
                rows={5}
              />
              <p className="text-sm text-gray-500">Separate each skill with a comma</p>
            </div>
          </div>
        )}
        
        {currentStep === 3 && (
          <div className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="workExperience">Work Experience</Label>
              <Textarea
                id="workExperience"
                value={formData.workExperience}
                onChange={(e) => updateForm('workExperience', e.target.value)}
                placeholder="Company Name, Position, Duration, Responsibilities"
                rows={5}
              />
              <p className="text-sm text-gray-500">Describe your most relevant positions</p>
            </div>
            
            <div className="space-y-2">
              <Label htmlFor="education">Education</Label>
              <Textarea
                id="education"
                value={formData.education}
                onChange={(e) => updateForm('education', e.target.value)}
                placeholder="Degree, Institution, Year of Graduation"
                rows={3}
              />
            </div>
          </div>
        )}
        
        {currentStep === 4 && (
          <div className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="projects">Projects</Label>
              <Textarea
                id="projects"
                value={formData.projects}
                onChange={(e) => updateForm('projects', e.target.value)}
                placeholder="Project Name, Description, Technologies Used, Your Role"
                rows={6}
              />
              <p className="text-sm text-gray-500">List your most impressive or relevant projects</p>
            </div>
          </div>
        )}
        
        <div className="flex justify-between mt-8">
          <Button
            type="button"
            variant="outline"
            onClick={handleBack}
            disabled={currentStep === 1}
            className="px-8"
          >
            Back
          </Button>
          
          <Button
            type="button"
            onClick={handleNext}
            className="bg-purple hover:bg-purple-dark px-8"
          >
            {currentStep === totalSteps ? 'Submit' : 'Next'}
          </Button>
        </div>
      </CardContent>
    </Card>
  );
};

export default QAForm;
