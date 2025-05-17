
import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';

interface LinkedInInputProps {
  onSubmit: (url: string) => void;
}

const LinkedInInput: React.FC<LinkedInInputProps> = ({ onSubmit }) => {
  const [linkedInUrl, setLinkedInUrl] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState('');

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    
    if (!linkedInUrl.trim()) {
      setError('Please enter a LinkedIn URL');
      return;
    }
    
    if (!linkedInUrl.includes('linkedin.com/')) {
      setError('Please enter a valid LinkedIn URL');
      return;
    }
    
    setIsLoading(true);
    
    // Simulate API call to process LinkedIn URL
    setTimeout(() => {
      setIsLoading(false);
      onSubmit(linkedInUrl);
    }, 2000);
  };
  
  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <div className="space-y-2">
        <Label htmlFor="linkedin-url">LinkedIn Profile URL</Label>
        <Input
          id="linkedin-url"
          type="text"
          placeholder="https://www.linkedin.com/in/yourprofile"
          value={linkedInUrl}
          onChange={(e) => setLinkedInUrl(e.target.value)}
          className={error ? 'border-red-500' : ''}
        />
        {error && <p className="text-sm text-red-500">{error}</p>}
      </div>
      
      <Button 
        type="submit" 
        className="w-full bg-purple hover:bg-purple-dark"
        disabled={isLoading}
      >
        {isLoading ? 'Processing...' : 'Import LinkedIn Profile'}
      </Button>
      
      <p className="text-xs text-gray-500 text-center">
        We'll extract your experience, skills, and education from your public LinkedIn profile.
      </p>
    </form>
  );
};

export default LinkedInInput;
