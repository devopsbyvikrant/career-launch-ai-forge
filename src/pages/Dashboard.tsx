
import React from 'react';
import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { NavLink } from 'react-router-dom';
import { useProfileData } from '@/hooks/useProfileData';

const Dashboard: React.FC = () => {
  const { profileData, isLoading } = useProfileData();
  
  if (isLoading) {
    return (
      <div className="container mx-auto py-12 px-4 flex items-center justify-center min-h-[60vh]">
        <div className="text-center">
          <div className="inline-block animate-spin rounded-full h-8 w-8 border-t-2 border-b-2 border-purple mb-4"></div>
          <p className="text-gray-600">Loading your dashboard...</p>
        </div>
      </div>
    );
  }
  
  return (
    <div className="container mx-auto py-8 px-4 animate-fade-in">
      <div className="mb-8">
        <h1 className="text-3xl font-bold mb-2">Welcome, {profileData?.fullName || 'User'}</h1>
        <p className="text-gray-600">
          Let's build your professional brand and help you land your dream job.
        </p>
      </div>
      
      {/* Profile Completion Card */}
      <Card className="p-6 bg-purple-light border-purple border mb-8">
        <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
          <div>
            <h2 className="text-xl font-semibold">Your Profile: 70% Complete</h2>
            <p className="text-gray-700">Complete your profile to get the most out of PortfolioAI</p>
          </div>
          <Button asChild className="bg-purple hover:bg-purple-dark">
            <NavLink to="/profile">Complete Profile</NavLink>
          </Button>
        </div>
        <div className="mt-4 h-2 w-full bg-white rounded-full">
          <div className="bg-purple h-2 rounded-full" style={{ width: '70%' }}></div>
        </div>
      </Card>
      
      {/* Features Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mb-8">
        {/* Portfolio Card */}
        <Card className="feature-card">
          <div className="flex flex-col h-full">
            <div className="mb-4 text-purple">
              <svg xmlns="http://www.w3.org/2000/svg" className="h-10 w-10" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9.75 17L9 20l-1 1h8l-1-1-.75-3M3 13h18M5 17h14a2 2 0 002-2V5a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
              </svg>
            </div>
            <h3 className="text-xl font-bold mb-2">Portfolio Builder</h3>
            <p className="text-gray-600 mb-4 flex-grow">
              Create a professional portfolio website to showcase your work and experience.
            </p>
            <Button asChild variant="outline" className="w-full border-purple text-purple hover:bg-purple-light">
              <NavLink to="/portfolio">Create Portfolio</NavLink>
            </Button>
          </div>
        </Card>
        
        {/* Resume Card */}
        <Card className="feature-card">
          <div className="flex flex-col h-full">
            <div className="mb-4 text-purple">
              <svg xmlns="http://www.w3.org/2000/svg" className="h-10 w-10" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
              </svg>
            </div>
            <h3 className="text-xl font-bold mb-2">Resume Generator</h3>
            <p className="text-gray-600 mb-4 flex-grow">
              Generate an ATS-friendly resume tailored for your target roles.
            </p>
            <Button asChild variant="outline" className="w-full border-purple text-purple hover:bg-purple-light">
              <NavLink to="/resume">Generate Resume</NavLink>
            </Button>
          </div>
        </Card>
        
        {/* Cover Letter Card */}
        <Card className="feature-card">
          <div className="flex flex-col h-full">
            <div className="mb-4 text-purple">
              <svg xmlns="http://www.w3.org/2000/svg" className="h-10 w-10" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
              </svg>
            </div>
            <h3 className="text-xl font-bold mb-2">Cover Letter Writer</h3>
            <p className="text-gray-600 mb-4 flex-grow">
              Create personalized cover letters for any job application in seconds.
            </p>
            <Button asChild variant="outline" className="w-full border-purple text-purple hover:bg-purple-light">
              <NavLink to="/cover-letter">Write Cover Letter</NavLink>
            </Button>
          </div>
        </Card>
        
        {/* Resume Optimizer Card */}
        <Card className="feature-card">
          <div className="flex flex-col h-full">
            <div className="mb-4 text-purple">
              <svg xmlns="http://www.w3.org/2000/svg" className="h-10 w-10" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2" />
              </svg>
            </div>
            <h3 className="text-xl font-bold mb-2">Resume Optimizer</h3>
            <p className="text-gray-600 mb-4 flex-grow">
              Get feedback on your resume and optimize it for specific job postings.
            </p>
            <Button asChild variant="outline" className="w-full border-purple text-purple hover:bg-purple-light">
              <NavLink to="/resume-optimizer">Optimize Resume</NavLink>
            </Button>
          </div>
        </Card>
        
        {/* Mock Interview Card */}
        <Card className="feature-card">
          <div className="flex flex-col h-full">
            <div className="mb-4 text-purple">
              <svg xmlns="http://www.w3.org/2000/svg" className="h-10 w-10" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 10h.01M12 10h.01M16 10h.01M9 16H5a2 2 0 01-2-2V6a2 2 0 012-2h14a2 2 0 012 2v8a2 2 0 01-2 2h-5l-5 5v-5z" />
              </svg>
            </div>
            <h3 className="text-xl font-bold mb-2">Mock Interviewer</h3>
            <p className="text-gray-600 mb-4 flex-grow">
              Practice for interviews with our AI interviewer and receive real-time feedback.
            </p>
            <Button asChild variant="outline" className="w-full border-purple text-purple hover:bg-purple-light">
              <NavLink to="/interview">Practice Interviews</NavLink>
            </Button>
          </div>
        </Card>
        
        {/* Job Alerts Card */}
        <Card className="feature-card">
          <div className="flex flex-col h-full">
            <div className="mb-4 text-purple">
              <svg xmlns="http://www.w3.org/2000/svg" className="h-10 w-10" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 17h5l-1.405-1.405A2.032 2.032 0 0118 14.158V11a6.002 6.002 0 00-4-5.659V5a2 2 0 10-4 0v.341C7.67 6.165 6 8.388 6 11v3.159c0 .538-.214 1.055-.595 1.436L4 17h5m6 0v1a3 3 0 11-6 0v-1m6 0H9" />
              </svg>
            </div>
            <h3 className="text-xl font-bold mb-2">Job Alerts</h3>
            <p className="text-gray-600 mb-4 flex-grow">
              Get personalized job recommendations that match your skills and experience.
            </p>
            <Button asChild variant="outline" className="w-full border-purple text-purple hover:bg-purple-light">
              <NavLink to="/jobs">View Jobs</NavLink>
            </Button>
          </div>
        </Card>
      </div>
      
      {/* Recent Activity */}
      <div className="mb-8">
        <h2 className="text-2xl font-bold mb-4">Recent Activity</h2>
        <Card className="p-6">
          <div className="text-center py-8 text-gray-500">
            <svg xmlns="http://www.w3.org/2000/svg" className="h-16 w-16 mx-auto mb-4 text-gray-300" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
            </svg>
            <p className="text-lg mb-2">No recent activity</p>
            <p className="max-w-md mx-auto">Start building your portfolio, resume, or cover letter to see your activity here.</p>
          </div>
        </Card>
      </div>
    </div>
  );
};

export default Dashboard;
