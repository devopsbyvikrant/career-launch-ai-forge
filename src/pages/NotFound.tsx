
import React, { useEffect } from 'react';
import { useLocation, NavLink } from 'react-router-dom';
import { Button } from '@/components/ui/button';

const NotFound = () => {
  const location = useLocation();

  useEffect(() => {
    console.error(
      "404 Error: User attempted to access non-existent route:",
      location.pathname
    );
  }, [location.pathname]);

  return (
    <div className="min-h-screen flex flex-col items-center justify-center bg-gray-50 px-4">
      <div className="text-center max-w-md">
        <div className="bg-purple-light h-24 w-24 rounded-full flex items-center justify-center mx-auto mb-6">
          <span className="text-4xl font-bold text-purple">404</span>
        </div>
        <h1 className="text-4xl font-bold mb-4">Page Not Found</h1>
        <p className="text-xl text-gray-600 mb-8">
          The page you are looking for doesn't exist or has been moved.
        </p>
        <Button asChild className="bg-purple hover:bg-purple-dark">
          <NavLink to="/">Return to Home</NavLink>
        </Button>
      </div>
    </div>
  );
};

export default NotFound;
