
import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';

interface UploadResumeProps {
  onUploadComplete: (fileData: string) => void;
}

const UploadResume: React.FC<UploadResumeProps> = ({ onUploadComplete }) => {
  const [isDragging, setIsDragging] = useState(false);
  const [file, setFile] = useState<File | null>(null);
  const [isLoading, setIsLoading] = useState(false);

  const handleDragEnter = (e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    setIsDragging(true);
  };

  const handleDragLeave = (e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    setIsDragging(false);
  };

  const handleDragOver = (e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    if (!isDragging) {
      setIsDragging(true);
    }
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    setIsDragging(false);

    const files = e.dataTransfer.files;
    if (files && files.length > 0) {
      processFile(files[0]);
    }
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = e.target.files;
    if (files && files.length > 0) {
      processFile(files[0]);
    }
  };

  const processFile = (selectedFile: File) => {
    if (!selectedFile) return;
    
    // Check if the file is a PDF or DOCX
    const fileExt = selectedFile.name.split('.').pop()?.toLowerCase();
    if (fileExt !== 'pdf' && fileExt !== 'docx') {
      alert('Please upload a PDF or DOCX file.');
      return;
    }
    
    setFile(selectedFile);
    
    // In a real application, this would send the file to a server for processing
    // For the MVP, we'll simulate this process
    setIsLoading(true);
    setTimeout(() => {
      setIsLoading(false);
      // Simulate successful upload and processing
      onUploadComplete(`processed-${selectedFile.name}`);
    }, 2000);
  };

  return (
    <div 
      className={`border-2 border-dashed rounded-lg p-8 text-center transition-colors
      ${isDragging ? 'border-purple bg-purple-light/20' : 'border-gray-200 hover:border-purple-light'}`}
      onDragEnter={handleDragEnter}
      onDragLeave={handleDragLeave}
      onDragOver={handleDragOver}
      onDrop={handleDrop}
    >
      <div className="space-y-6">
        <div className="flex flex-col items-center justify-center space-y-2">
          <div className="bg-purple-light rounded-full p-3">
            <svg 
              xmlns="http://www.w3.org/2000/svg" 
              className="h-8 w-8 text-purple"
              fill="none" 
              viewBox="0 0 24 24" 
              stroke="currentColor"
            >
              <path 
                strokeLinecap="round" 
                strokeLinejoin="round" 
                strokeWidth={2} 
                d="M7 16a4 4 0 01-.88-7.903A5 5 0 1115.9 6L16 6a5 5 0 011 9.9M15 13l-3-3m0 0l-3 3m3-3v12" 
              />
            </svg>
          </div>
          <div>
            <p className="text-lg font-medium">
              {file ? file.name : 'Drag and drop your résumé'}
            </p>
            <p className="text-sm text-gray-500">
              {file ? `${(file.size / 1024).toFixed(2)} KB` : 'Support for PDF, DOCX files'}
            </p>
          </div>
        </div>
        
        <div className="flex flex-col space-y-2">
          <div className="relative">
            <Label htmlFor="resume-upload" className="sr-only">Choose file</Label>
            <Input
              id="resume-upload"
              type="file"
              className="hidden"
              onChange={handleFileChange}
              accept=".pdf,.docx"
            />
            <Button
              type="button"
              variant="outline"
              className="w-full border-purple text-purple hover:bg-purple-light"
              onClick={() => document.getElementById('resume-upload')?.click()}
              disabled={isLoading}
            >
              {isLoading ? 'Processing...' : 'Upload Résumé'}
            </Button>
          </div>
          
          {isLoading && (
            <div className="py-2">
              <div className="h-1 w-full bg-purple-light overflow-hidden rounded">
                <div className="h-full bg-purple w-1/2 animate-pulse"></div>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default UploadResume;
