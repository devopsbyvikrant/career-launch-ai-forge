import React, { useEffect, useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
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

const ResumeViewer: React.FC = () => {
  const [resumeData, setResumeData] = useState<ResumeData | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchResume = async () => {
      try {
        const response = await fetch('http://localhost:8000/api/resume/latest');
        if (!response.ok) {
          throw new Error('Failed to fetch resume data');
        }
        const { data } = await response.json();
        setResumeData(data.extracted_data);
      } catch (err) {
        setError(err instanceof Error ? err.message : 'Error fetching resume data');
        toast.error('Failed to fetch resume data');
      } finally {
        setIsLoading(false);
      }
    };

    fetchResume();
  }, []);

  if (isLoading) {
    return (
      <div className="flex items-center justify-center min-h-[60vh]">
        <div className="text-center">
          <div className="inline-block animate-spin rounded-full h-8 w-8 border-t-2 border-b-2 border-purple mb-4"></div>
          <p className="text-gray-600">Loading resume data...</p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="text-center py-8">
        <p className="text-red-500">{error}</p>
      </div>
    );
  }

  if (!resumeData) {
    return (
      <div className="text-center py-8">
        <p className="text-gray-500">No resume data available</p>
      </div>
    );
  }

  return (
    <div className="container mx-auto py-8 px-4">
      <Card>
        <CardHeader>
          <CardTitle>Extracted Resume Data</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-8">
            {/* Personal Information */}
            <section>
              <h2 className="text-xl font-semibold mb-4">Personal Information</h2>
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <p className="text-sm text-gray-500">Name</p>
                  <p className="font-medium">{resumeData.personalInfo.name}</p>
                </div>
                <div>
                  <p className="text-sm text-gray-500">Email</p>
                  <p>{resumeData.personalInfo.email}</p>
                </div>
                <div>
                  <p className="text-sm text-gray-500">Phone</p>
                  <p>{resumeData.personalInfo.phone}</p>
                </div>
                <div>
                  <p className="text-sm text-gray-500">Location</p>
                  <p>{resumeData.personalInfo.location}</p>
                </div>
              </div>
            </section>

            {/* Education */}
            <section>
              <h2 className="text-xl font-semibold mb-4">Education</h2>
              <div className="space-y-4">
                {resumeData.education.map((edu, index) => (
                  <div key={index} className="border-l-2 border-purple pl-4">
                    <p className="font-medium">{edu.degree}</p>
                    <p className="text-gray-600">{edu.institution}</p>
                    <p className="text-sm text-gray-500">{edu.year}</p>
                    {edu.gpa && <p className="text-sm">GPA: {edu.gpa}</p>}
                  </div>
                ))}
              </div>
            </section>

            {/* Work Experience */}
            <section>
              <h2 className="text-xl font-semibold mb-4">Work Experience</h2>
              <div className="space-y-6">
                {resumeData.workExperience.map((exp, index) => (
                  <div key={index} className="border-l-2 border-purple pl-4">
                    <p className="font-medium">{exp.position}</p>
                    <p className="text-gray-600">{exp.company}</p>
                    <p className="text-sm text-gray-500">{exp.duration}</p>
                    <ul className="list-disc list-inside mt-2 space-y-1">
                      {exp.responsibilities.map((resp, idx) => (
                        <li key={idx} className="text-sm">{resp}</li>
                      ))}
                    </ul>
                  </div>
                ))}
              </div>
            </section>

            {/* Skills */}
            <section>
              <h2 className="text-xl font-semibold mb-4">Skills</h2>
              <div className="space-y-4">
                <div>
                  <h3 className="text-sm font-medium text-gray-500 mb-2">Technical Skills</h3>
                  <div className="flex flex-wrap gap-2">
                    {resumeData.skills.technical.map((skill, index) => (
                      <span key={index} className="bg-purple-light text-purple-dark px-3 py-1 rounded-full text-sm">
                        {skill}
                      </span>
                    ))}
                  </div>
                </div>
                <div>
                  <h3 className="text-sm font-medium text-gray-500 mb-2">Soft Skills</h3>
                  <div className="flex flex-wrap gap-2">
                    {resumeData.skills.soft.map((skill, index) => (
                      <span key={index} className="bg-purple-light text-purple-dark px-3 py-1 rounded-full text-sm">
                        {skill}
                      </span>
                    ))}
                  </div>
                </div>
              </div>
            </section>

            {/* Projects */}
            <section>
              <h2 className="text-xl font-semibold mb-4">Projects</h2>
              <div className="space-y-6">
                {resumeData.projects.map((project, index) => (
                  <div key={index} className="border-l-2 border-purple pl-4">
                    <p className="font-medium">{project.name}</p>
                    <p className="text-gray-600 mt-1">{project.description}</p>
                    <div className="flex flex-wrap gap-2 mt-2">
                      {project.technologies.map((tech, idx) => (
                        <span key={idx} className="bg-gray-100 text-gray-700 px-2 py-1 rounded text-xs">
                          {tech}
                        </span>
                      ))}
                    </div>
                  </div>
                ))}
              </div>
            </section>

            {/* Certifications */}
            {resumeData.certifications.length > 0 && (
              <section>
                <h2 className="text-xl font-semibold mb-4">Certifications</h2>
                <div className="space-y-2">
                  {resumeData.certifications.map((cert, index) => (
                    <p key={index} className="text-gray-600">{cert}</p>
                  ))}
                </div>
              </section>
            )}
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default ResumeViewer; 