import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { toast } from 'sonner';

interface LinkedInInputProps {
  onSubmit: (url: string) => void;
}

const LinkedInInput: React.FC<LinkedInInputProps> = ({ onSubmit }) => {
  const [isLoading, setIsLoading] = useState(false);

  const handleLinkedInAuth = async () => {
    setIsLoading(true);
    
    try {
      // In a real app, this would open LinkedIn OAuth flow
      const linkedInAuthWindow = window.open(
        'https://www.linkedin.com/oauth/v2/authorization' +
        '?response_type=code' +
        '&client_id=YOUR_CLIENT_ID' +
        '&redirect_uri=YOUR_REDIRECT_URI' +
        '&scope=r_liteprofile r_emailaddress',
        'LinkedIn Login',
        'width=600,height=600'
      );

      // Simulate OAuth success for demo
      setTimeout(() => {
        setIsLoading(false);
        if (linkedInAuthWindow) linkedInAuthWindow.close();
        onSubmit('linkedin-auth-success');
      }, 2000);
    } catch (error) {
      console.error('LinkedIn auth error:', error);
      toast.error('Failed to authenticate with LinkedIn');
      setIsLoading(false);
    }
  };
  
  return (
    <Button 
      variant="outline" 
      className="w-full"
      onClick={handleLinkedInAuth}
      disabled={isLoading}
    >
      {isLoading ? (
        <div className="flex items-center">
          <div className="animate-spin mr-2 h-4 w-4 border-2 border-purple border-t-transparent rounded-full"></div>
          Connecting to LinkedIn...
        </div>
      ) : (
        <>
          <svg className="w-5 h-5 mr-2" viewBox="0 0 24 24">
            <path
              fill="currentColor"
              d="M19 3a2 2 0 0 1 2 2v14a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h14m-.5 15.5v-5.3a3.26 3.26 0 0 0-3.26-3.26c-.85 0-1.84.52-2.32 1.3v-1.11h-2.79v8.37h2.79v-4.93c0-.77.62-1.4 1.39-1.4a1.4 1.4 0 0 1 1.4 1.4v4.93h2.79M6.88 8.56a1.68 1.68 0 0 0 1.68-1.68c0-.93-.75-1.69-1.68-1.69a1.69 1.69 0 0 0-1.69 1.69c0 .93.76 1.68 1.69 1.68m1.39 9.94v-8.37H5.5v8.37h2.77z"
            />
          </svg>
          Continue with LinkedIn
        </>
      )}
    </Button>
  );
};

export default LinkedInInput;