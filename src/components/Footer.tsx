
import React from 'react';
import { NavLink } from 'react-router-dom';

const Footer = () => {
  return (
    <footer className="bg-gray-50 border-t border-border">
      <div className="container mx-auto py-8 px-4">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
          <div className="col-span-1">
            <h4 className="text-lg font-semibold mb-4">PortfolioAI</h4>
            <p className="text-gray-600">
              AI-powered career tools to help you land your dream job.
            </p>
          </div>
          
          <div className="col-span-1">
            <h5 className="font-medium mb-4">Features</h5>
            <ul className="space-y-2">
              <li><NavLink to="/portfolio" className="text-gray-600 hover:text-purple">Portfolio Builder</NavLink></li>
              <li><NavLink to="/resume" className="text-gray-600 hover:text-purple">Resume Generator</NavLink></li>
              <li><NavLink to="/cover-letter" className="text-gray-600 hover:text-purple">Cover Letter Writer</NavLink></li>
              <li><NavLink to="/interview" className="text-gray-600 hover:text-purple">Interview Practice</NavLink></li>
            </ul>
          </div>
          
          <div className="col-span-1">
            <h5 className="font-medium mb-4">Resources</h5>
            <ul className="space-y-2">
              <li><NavLink to="/blog" className="text-gray-600 hover:text-purple">Career Blog</NavLink></li>
              <li><NavLink to="/jobs" className="text-gray-600 hover:text-purple">Job Alerts</NavLink></li>
            </ul>
          </div>
          
          <div className="col-span-1">
            <h5 className="font-medium mb-4">Company</h5>
            <ul className="space-y-2">
              <li><NavLink to="/about" className="text-gray-600 hover:text-purple">About</NavLink></li>
              <li><NavLink to="/privacy" className="text-gray-600 hover:text-purple">Privacy Policy</NavLink></li>
              <li><NavLink to="/terms" className="text-gray-600 hover:text-purple">Terms of Service</NavLink></li>
            </ul>
          </div>
        </div>
        
        <div className="border-t border-border mt-8 pt-8 text-center text-gray-600">
          <p>© {new Date().getFullYear()} PortfolioAI. All rights reserved.</p>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
