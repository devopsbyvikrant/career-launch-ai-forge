import React, { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { toast } from 'sonner';
import { useAuth } from '@/hooks/useAuth';

interface LinkedInInputProps {
  onSubmit: (url: string) => void;
}

const LinkedInInput: React.FC<LinkedInInputProps> = ({ onSubmit }) => {
  const [isLoading, setIsLoading] = useState(false);
  const { signIn } = useAuth();

  useEffect(() => {
    // Handle OAuth callback
    const handleCallback = async () => {
      const urlParams = new URLSearchParams(window.location.search);
      const code = urlParams.get('code');
      const error = urlParams.get('error');

      if (error) {
        toast.error('LinkedIn authentication failed: ' + error);
        return;
      }

      if (code) {
        setIsLoading(true);
        try {
          // Exchange code for access token
          const response = await fetch('http://localhost:8000/api/linkedin/callback', {
            method: 'POST',
            headers: {
              'Content-Type': 'application/json',
            },
            body: JSON.stringify({ code }),
          });

          if (!response.ok) {
            const errorData = await response.json();
            throw new Error(errorData.detail || 'Failed to authenticate with LinkedIn');
          }

          const data = await response.json();
          
          // Sign in with the LinkedIn data
          const { error: signInError } = await signIn(data.email, data.password);
          if (signInError) throw signInError;

          toast.success('Successfully authenticated with LinkedIn');
          onSubmit(data.linkedinUrl);
        } catch (error) {
          console.error('LinkedIn auth error:', error);
          toast.error(error instanceof Error ? error.message : 'Failed to authenticate with LinkedIn');
        } finally {
          setIsLoading(false);
        }
      }
    };

    handleCallback();
  }, [signIn, onSubmit]);

  const handleLinkedInAuth = async () => {
    setIsLoading(true);
    
    try {
      const clientId = import.meta.env.VITE_LINKEDIN_CLIENT_ID;
      
      if (!clientId) {
        throw new Error('LinkedIn Client ID is not configured');
      }

      const redirectUri = `${window.location.origin}/auth/linkedin/callback`;
      const scope = 'r_liteprofile r_emailaddress';
      
      // First check if LinkedIn is accessible
      try {
        const checkResponse = await fetch('https://www.linkedin.com/robots.txt');
        if (!checkResponse.ok) {
          throw new Error('LinkedIn services are currently unavailable');
        }
      } catch (error) {
        throw new Error('Unable to connect to LinkedIn. Please try again later.');
      }
      
      const authUrl = `https://www.linkedin.com/oauth/v2/authorization?response_type=code&client_id=${clientId}&redirect_uri=${encodeURIComponent(redirectUri)}&scope=${scope}`;
      
      // Open in a new window instead of redirecting
      const authWindow = window.open(authUrl, 'LinkedIn Login', 'width=600,height=600');
      
      if (!authWindow) {
        throw new Error('Please allow popups for LinkedIn authentication');
      }

      // Check if the window was closed
      const checkWindow = setInterval(() => {
        if (authWindow.closed) {
          clearInterval(checkWindow);
          setIsLoading(false);
        }
      }, 1000);

    } catch (error) {
      console.error('LinkedIn auth error:', error);
      toast.error(error instanceof Error ? error.message : 'Failed to start LinkedIn authentication');
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