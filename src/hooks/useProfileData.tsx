
import { useState, useEffect } from 'react';
import { toast } from 'sonner';
import { supabase } from "@/integrations/supabase/client";

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
    const fetchProfileData = async () => {
      try {
        setIsLoading(true);
        
        const { data: { session } } = await supabase.auth.getSession();
        
        if (!session) {
          // No logged in user, use mock data for now
          setProfileData(mockProfileData);
          setIsLoading(false);
          return;
        }

        // Fetch profile data from Supabase
        const { data: profile, error: profileError } = await supabase
          .from('profiles')
          .select('*')
          .eq('id', session.user.id)
          .single();
          
        if (profileError) {
          console.error('Error fetching profile:', profileError);
          // Fall back to mock data if there's an error
          setProfileData(mockProfileData);
          setIsLoading(false);
          return;
        }

        // Fetch skills
        const { data: skills, error: skillsError } = await supabase
          .from('skills')
          .select('*')
          .eq('profile_id', session.user.id);
          
        if (skillsError) {
          console.error('Error fetching skills:', skillsError);
        }

        // Fetch work experience
        const { data: workExperience, error: workError } = await supabase
          .from('work_experience')
          .select('*')
          .eq('profile_id', session.user.id);
          
        if (workError) {
          console.error('Error fetching work experience:', workError);
        }

        // Fetch education
        const { data: education, error: educationError } = await supabase
          .from('education')
          .select('*')
          .eq('profile_id', session.user.id);
          
        if (educationError) {
          console.error('Error fetching education:', educationError);
        }

        // Fetch projects and their technologies
        const { data: projects, error: projectsError } = await supabase
          .from('projects')
          .select('*')
          .eq('profile_id', session.user.id);
          
        if (projectsError) {
          console.error('Error fetching projects:', projectsError);
        }

        // For each project, fetch its technologies
        const projectsWithTechnologies = await Promise.all(
          (projects || []).map(async (project) => {
            const { data: technologies } = await supabase
              .from('technologies')
              .select('name')
              .eq('project_id', project.id);
              
            return {
              name: project.name,
              description: project.description || '',
              url: project.url,
              technologies: technologies ? technologies.map(tech => tech.name) : []
            };
          })
        );

        // Transform the data to match our ProfileData interface
        const userData: ProfileData = {
          fullName: profile?.full_name || '',
          email: profile?.email || '',
          phone: profile?.phone || '',
          targetRole: profile?.target_role || '',
          linkedInUrl: profile?.linkedin_url || '',
          skills: skills ? skills.map(skill => skill.name) : [],
          workExperience: workExperience ? workExperience.map(work => ({
            company: work.company,
            position: work.position,
            startDate: work.start_date ? new Date(work.start_date).toISOString().substring(0, 7) : '',
            endDate: work.is_current ? 'Present' : (work.end_date ? new Date(work.end_date).toISOString().substring(0, 7) : ''),
            description: work.description || ''
          })) : [],
          education: education ? education.map(edu => ({
            institution: edu.institution,
            degree: edu.degree,
            fieldOfStudy: edu.field_of_study || '',
            graduationYear: edu.graduation_year || ''
          })) : [],
          projects: projectsWithTechnologies
        };

        setProfileData(userData);
        setIsLoading(false);
      } catch (err) {
        console.error('Error in useProfileData:', err);
        setError('Failed to load profile data');
        // Fall back to mock data
        setProfileData(mockProfileData);
        setIsLoading(false);
      }
    };

    fetchProfileData();
  }, []);

  const updateProfileData = async (newData: Partial<ProfileData>) => {
    try {
      const { data: { session } } = await supabase.auth.getSession();
      
      if (!session) {
        // No logged in user, just update local state
        setProfileData(prev => prev ? { ...prev, ...newData } : { ...newData } as ProfileData);
        toast.success('Profile updated in development mode');
        return;
      }

      const userId = session.user.id;

      // Update profile table
      if (newData.fullName || newData.email || newData.phone || newData.targetRole || newData.linkedInUrl) {
        await supabase
          .from('profiles')
          .update({
            full_name: newData.fullName,
            email: newData.email,
            phone: newData.phone,
            target_role: newData.targetRole,
            linkedin_url: newData.linkedInUrl,
            updated_at: new Date().toISOString()
          })
          .eq('id', userId);
      }

      // Update skills if provided
      if (newData.skills) {
        // Delete existing skills
        await supabase
          .from('skills')
          .delete()
          .eq('profile_id', userId);
          
        // Insert new skills
        if (newData.skills.length > 0) {
          const skillsToInsert = newData.skills.map(skill => ({
            profile_id: userId,
            name: skill
          }));
          
          await supabase
            .from('skills')
            .insert(skillsToInsert);
        }
      }

      // Update work experience if provided
      if (newData.workExperience) {
        // Delete existing work experience
        await supabase
          .from('work_experience')
          .delete()
          .eq('profile_id', userId);
          
        // Insert new work experience
        if (newData.workExperience.length > 0) {
          const workToInsert = newData.workExperience.map(work => ({
            profile_id: userId,
            company: work.company,
            position: work.position,
            start_date: work.startDate ? work.startDate + '-01' : null,
            end_date: work.endDate && work.endDate !== 'Present' ? work.endDate + '-01' : null,
            is_current: work.endDate === 'Present',
            description: work.description
          }));
          
          await supabase
            .from('work_experience')
            .insert(workToInsert);
        }
      }

      // Update education if provided
      if (newData.education) {
        // Delete existing education
        await supabase
          .from('education')
          .delete()
          .eq('profile_id', userId);
          
        // Insert new education
        if (newData.education.length > 0) {
          const educationToInsert = newData.education.map(edu => ({
            profile_id: userId,
            institution: edu.institution,
            degree: edu.degree,
            field_of_study: edu.fieldOfStudy,
            graduation_year: edu.graduationYear
          }));
          
          await supabase
            .from('education')
            .insert(educationToInsert);
        }
      }

      // Update projects if provided
      if (newData.projects) {
        // Get existing projects to find their IDs
        const { data: existingProjects } = await supabase
          .from('projects')
          .select('*')
          .eq('profile_id', userId);
          
        // Delete existing projects
        await supabase
          .from('projects')
          .delete()
          .eq('profile_id', userId);
          
        // Insert new projects and their technologies
        if (newData.projects.length > 0) {
          for (const project of newData.projects) {
            // Insert project
            const { data: insertedProject, error: projectError } = await supabase
              .from('projects')
              .insert({
                profile_id: userId,
                name: project.name,
                description: project.description,
                url: project.url
              })
              .select()
              .single();
              
            if (projectError) {
              console.error('Error inserting project:', projectError);
              continue;
            }

            // Insert technologies for this project
            if (project.technologies.length > 0) {
              const technologiesToInsert = project.technologies.map(tech => ({
                project_id: insertedProject.id,
                name: tech
              }));
              
              await supabase
                .from('technologies')
                .insert(technologiesToInsert);
            }
          }
        }
      }

      // Update local state
      setProfileData(prev => prev ? { ...prev, ...newData } : { ...newData } as ProfileData);
      toast.success('Profile updated successfully');
    } catch (err) {
      console.error('Error updating profile:', err);
      toast.error('Failed to update profile');
    }
  };

  return { profileData, isLoading, error, updateProfileData };
}
