
import React from 'react';
import { Button } from '@/components/ui/button';
import { NavLink } from 'react-router-dom';
import Testimonial from '@/components/Testimonial';

const LandingPage: React.FC = () => {
  return (
    <div className="animate-fade-in">
      {/* Hero Section */}
      <section className="py-20 bg-gradient-to-b from-purple-light to-white">
        <div className="container mx-auto px-4">
          <div className="flex flex-col items-center text-center">
            <h1 className="text-5xl md:text-6xl font-bold mb-6">
              Become <span className="text-purple">Job-Ready</span> with AI
            </h1>
            <p className="text-xl md:text-2xl text-gray-700 mb-8 max-w-3xl">
              PortfolioAI transforms your résumé into a polished portfolio, ATS-optimized CV, 
              and personalized cover letters in minutes.
            </p>
            <div className="flex flex-col sm:flex-row gap-4">
              <Button asChild size="lg" className="bg-purple hover:bg-purple-dark text-lg">
                <NavLink to="/get-started">Build Your Portfolio</NavLink>
              </Button>
              <Button asChild size="lg" variant="outline" className="border-purple text-purple hover:bg-purple-light text-lg">
                <NavLink to="/demo">See Examples</NavLink>
              </Button>
            </div>
          </div>
        </div>
      </section>
      
      {/* Features Section */}
      <section className="py-16">
        <div className="container mx-auto px-4">
          <div className="text-center mb-16">
            <h2 className="text-3xl md:text-4xl font-bold mb-4">All-in-One Career Toolkit</h2>
            <p className="text-xl text-gray-600 max-w-2xl mx-auto">
              Everything you need to launch your career and land your dream job.
            </p>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {/* Feature Card 1 */}
            <div className="feature-card">
              <div className="h-14 w-14 bg-purple-light rounded-lg flex items-center justify-center mb-4">
                <svg xmlns="http://www.w3.org/2000/svg" className="h-8 w-8 text-purple" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9.75 17L9 20l-1 1h8l-1-1-.75-3M3 13h18M5 17h14a2 2 0 002-2V5a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
                </svg>
              </div>
              <h3 className="text-xl font-bold mb-2">AI Portfolio Builder</h3>
              <p className="text-gray-600 mb-4">
                Upload your résumé or LinkedIn profile and get a professional portfolio website in minutes.
              </p>
              <NavLink to="/portfolio" className="text-purple font-medium hover:underline">Learn More →</NavLink>
            </div>
            
            {/* Feature Card 2 */}
            <div className="feature-card">
              <div className="h-14 w-14 bg-purple-light rounded-lg flex items-center justify-center mb-4">
                <svg xmlns="http://www.w3.org/2000/svg" className="h-8 w-8 text-purple" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                </svg>
              </div>
              <h3 className="text-xl font-bold mb-2">ATS Resume Generator</h3>
              <p className="text-gray-600 mb-4">
                Create ATS-friendly résumés that pass screening systems and catch recruiters' attention.
              </p>
              <NavLink to="/resume" className="text-purple font-medium hover:underline">Learn More →</NavLink>
            </div>
            
            {/* Feature Card 3 */}
            <div className="feature-card">
              <div className="h-14 w-14 bg-purple-light rounded-lg flex items-center justify-center mb-4">
                <svg xmlns="http://www.w3.org/2000/svg" className="h-8 w-8 text-purple" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
                </svg>
              </div>
              <h3 className="text-xl font-bold mb-2">Cover Letter Writer</h3>
              <p className="text-gray-600 mb-4">
                Generate customized cover letters for any job in seconds with our AI-powered tool.
              </p>
              <NavLink to="/cover-letter" className="text-purple font-medium hover:underline">Learn More →</NavLink>
            </div>
            
            {/* Feature Card 4 */}
            <div className="feature-card">
              <div className="h-14 w-14 bg-purple-light rounded-lg flex items-center justify-center mb-4">
                <svg xmlns="http://www.w3.org/2000/svg" className="h-8 w-8 text-purple" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2" />
                </svg>
              </div>
              <h3 className="text-xl font-bold mb-2">Resume Optimizer</h3>
              <p className="text-gray-600 mb-4">
                Get instant feedback and suggestions to improve your résumé and match job requirements.
              </p>
              <NavLink to="/resume-optimizer" className="text-purple font-medium hover:underline">Learn More →</NavLink>
            </div>
            
            {/* Feature Card 5 */}
            <div className="feature-card">
              <div className="h-14 w-14 bg-purple-light rounded-lg flex items-center justify-center mb-4">
                <svg xmlns="http://www.w3.org/2000/svg" className="h-8 w-8 text-purple" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 10h.01M12 10h.01M16 10h.01M9 16H5a2 2 0 01-2-2V6a2 2 0 012-2h14a2 2 0 012 2v8a2 2 0 01-2 2h-5l-5 5v-5z" />
                </svg>
              </div>
              <h3 className="text-xl font-bold mb-2">AI Mock Interviewer</h3>
              <p className="text-gray-600 mb-4">
                Practice for interviews with our AI interviewer and receive instant feedback to improve.
              </p>
              <NavLink to="/interview" className="text-purple font-medium hover:underline">Learn More →</NavLink>
            </div>
            
            {/* Feature Card 6 */}
            <div className="feature-card">
              <div className="h-14 w-14 bg-purple-light rounded-lg flex items-center justify-center mb-4">
                <svg xmlns="http://www.w3.org/2000/svg" className="h-8 w-8 text-purple" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 17h5l-1.405-1.405A2.032 2.032 0 0118 14.158V11a6.002 6.002 0 00-4-5.659V5a2 2 0 10-4 0v.341C7.67 6.165 6 8.388 6 11v3.159c0 .538-.214 1.055-.595 1.436L4 17h5m6 0v1a3 3 0 11-6 0v-1m6 0H9" />
                </svg>
              </div>
              <h3 className="text-xl font-bold mb-2">Job Alerts</h3>
              <p className="text-gray-600 mb-4">
                Receive personalized job alerts tailored to your skills and career goals.
              </p>
              <NavLink to="/jobs" className="text-purple font-medium hover:underline">Learn More →</NavLink>
            </div>
          </div>
        </div>
      </section>
      
      {/* Testimonials Section */}
      <section className="py-16 bg-gray-50">
        <div className="container mx-auto px-4">
          <div className="text-center mb-16">
            <h2 className="text-3xl md:text-4xl font-bold mb-4">What Our Users Say</h2>
            <p className="text-xl text-gray-600 max-w-2xl mx-auto">
              See how PortfolioAI has helped professionals land their dream jobs.
            </p>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            <Testimonial
              quote="I was struggling to get interviews until I used PortfolioAI. Within a week of creating my portfolio and optimizing my résumé, I landed three interviews and one job offer!"
              author="Ananya Sharma"
              role="Frontend Developer"
            />
            
            <Testimonial
              quote="The mock interview feature helped me prepare for tough technical questions. I went into my interviews feeling confident and well-prepared."
              author="Rohit Mehra"
              role="Recent CS Graduate"
            />
            
            <Testimonial
              quote="As someone switching from teaching to tech, I wasn't sure how to present my skills. PortfolioAI helped me highlight my transferable abilities and I got hired within a month!"
              author="Priya Nair"
              role="Former Teacher, Now UI/UX Designer"
            />
          </div>
        </div>
      </section>
      
      {/* CTA Section */}
      <section className="py-20 bg-purple">
        <div className="container mx-auto px-4">
          <div className="text-center">
            <h2 className="text-3xl md:text-4xl font-bold mb-4 text-white">Ready to Accelerate Your Career?</h2>
            <p className="text-xl text-white/90 max-w-2xl mx-auto mb-8">
              Join thousands of professionals who have transformed their job search with PortfolioAI.
            </p>
            <Button asChild size="lg" variant="secondary" className="text-lg">
              <NavLink to="/get-started">Get Started For Free</NavLink>
            </Button>
          </div>
        </div>
      </section>
    </div>
  );
};

export default LandingPage;
