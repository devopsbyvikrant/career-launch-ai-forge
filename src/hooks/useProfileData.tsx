
import { useState, useEffect } from 'react';

// Define the profile data structure
export interface ProfileData {
  fullName: string;
  email: string;
  phone: string;
  targetRole: string;
  skills: string[];
  workExperience: WorkExperience[];
  education: Education[];
  projects: Project[];
  linkedInUrl?: string;
  resumeFile?: string;
}

export interface WorkExperience {
  company: string;
  position: string;
  startDate: string;
  endDate: string;
  description: string;
}

export interface Education {
  institution: string;
  degree: string;
  fieldOfStudy: string;
  graduationYear: string;
}

export interface Project {
  name: string;
  description: string;
  technologies: string[];
  url?: string;
}

// Mock data for development purposes
const mockProfileData: ProfileData = {
  fullName: "Vikrant Nalawade",
  email: "vikrant@example.com",
  phone: "+91 9876543210",
  targetRole: "Frontend Developer",
  skills: ["React", "TypeScript", "JavaScript", "HTML/CSS", "Tailwind CSS", "Node.js", "Git"],
  workExperience: [
    {
      company: "Tech Innovators Pvt Ltd",
      position: "Junior Developer",
      startDate: "2023-01",
      endDate: "Present",
      description: "Developing and maintaining web applications using React and TypeScript. Collaborating with cross-functional teams to deliver high-quality software solutions."
    },
    {
      company: "Digital Solutions Inc",
      position: "Intern",
      startDate: "2022-05",
      endDate: "2022-12",
      description: "Assisted in front-end development tasks and learned web development best practices."
    }
  ],
  education: [
    {
      institution: "University of Technology",
      degree: "Bachelor of Engineering",
      fieldOfStudy: "Computer Science",
      graduationYear: "2022"
    }
  ],
  projects: [
    {
      name: "E-commerce Platform",
      description: "Developed a responsive e-commerce website with product catalog, shopping cart, and payment integration.",
      technologies: ["React", "Node.js", "Express", "MongoDB"],
      url: "https://github.com/example/ecommerce"
    },
    {
      name: "Task Management App",
      description: "Created a task management application with user authentication and real-time updates.",
      technologies: ["React", "Firebase", "Tailwind CSS"],
      url: "https://github.com/example/taskmaster"
    }
  ]
};

export function useProfileData() {
  const [profileData, setProfileData] = useState<ProfileData | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    // Simulate API call to fetch profile data
    const fetchProfileData = async () => {
      try {
        setIsLoading(true);
        // In a real app, this would be an API call
        await new Promise(resolve => setTimeout(resolve, 500));
        
        // Check if there's saved data in localStorage
        const savedProfile = localStorage.getItem('portfolioAI_profile');
        
        if (savedProfile) {
          setProfileData(JSON.parse(savedProfile));
        } else {
          // Use mock data for demo
          setProfileData(mockProfileData);
          
          // In a real app, you might not want to save mock data to localStorage
          localStorage.setItem('portfolioAI_profile', JSON.stringify(mockProfileData));
        }
        
        setIsLoading(false);
      } catch (err) {
        setError('Failed to load profile data');
        setIsLoading(false);
      }
    };

    fetchProfileData();
  }, []);

  const updateProfileData = (newData: Partial<ProfileData>) => {
    setProfileData(prev => {
      const updated = prev ? { ...prev, ...newData } : { ...newData } as ProfileData;
      localStorage.setItem('portfolioAI_profile', JSON.stringify(updated));
      return updated;
    });
  };

  return { profileData, isLoading, error, updateProfileData };
}
