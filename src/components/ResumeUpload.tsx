import React, { useState, useCallback } from 'react';
import { useDropzone } from 'react-dropzone';
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Progress } from "@/components/ui/progress";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { Loader2, Upload, FileText, CheckCircle2, AlertCircle } from "lucide-react";
import { useToast } from '@/components/ui/use-toast';
import { analyzeResume, type ResumeAnalysisResult } from '@/api/resume';

interface ResumeUploadProps {
  onAnalysisComplete: (result: ResumeAnalysisResult) => void;
}

const ResumeUpload = ({ onAnalysisComplete }: ResumeUploadProps) => {
  const [uploadProgress, setUploadProgress] = useState(0);
  const [isUploading, setIsUploading] = useState(false);
  const { toast } = useToast();

  const onDrop = useCallback(async (acceptedFiles: File[]) => {
    const file = acceptedFiles[0];
    if (!file) return;

    // Validate file type
    const validTypes = ['application/pdf', 'application/vnd.openxmlformats-officedocument.wordprocessingml.document', 'text/plain'];
    if (!validTypes.includes(file.type)) {
      toast({
        title: "Invalid file type",
        description: "Please upload a PDF, DOCX, or TXT file.",
        variant: "destructive",
      });
      return;
    }

    // Validate file size (max 5MB)
    if (file.size > 5 * 1024 * 1024) {
      toast({
        title: "File too large",
        description: "Please upload a file smaller than 5MB.",
        variant: "destructive",
      });
      return;
    }

    setIsUploading(true);
    setUploadProgress(0);

    try {
      // Simulate upload progress
      const progressInterval = setInterval(() => {
        setUploadProgress((prev) => {
          if (prev >= 90) {
            clearInterval(progressInterval);
            return prev;
          }
          return prev + 10;
        });
      }, 500);

      const result = await analyzeResume(file);
      clearInterval(progressInterval);
      setUploadProgress(100);
      onAnalysisComplete(result);
    } catch (error) {
      toast({
        title: "Upload failed",
        description: error instanceof Error ? error.message : "There was an error analyzing your resume. Please try again.",
        variant: "destructive",
      });
    } finally {
      setIsUploading(false);
    }
  }, [onAnalysisComplete, toast]);

  const { getRootProps, getInputProps, isDragActive } = useDropzone({
    onDrop,
    accept: {
      'application/pdf': ['.pdf'],
      'application/vnd.openxmlformats-officedocument.wordprocessingml.document': ['.docx'],
      'text/plain': ['.txt'],
    },
    maxFiles: 1,
    disabled: isUploading,
  });

  return (
    <Card className="w-full max-w-2xl mx-auto">
      <CardHeader>
        <CardTitle>Upload Your Resume</CardTitle>
        <CardDescription>
          Upload your resume in PDF format for AI-powered analysis
        </CardDescription>
      </CardHeader>
      <CardContent>
        <div
          {...getRootProps()}
          className={`border-2 border-dashed rounded-lg p-8 text-center cursor-pointer transition-colors
            ${isDragActive ? 'border-primary bg-primary/5' : 'border-muted-foreground/25 hover:border-primary/50'}
            ${isUploading ? 'opacity-50 cursor-not-allowed' : ''}`}
        >
          <input {...getInputProps()} />
          <div className="flex flex-col items-center gap-4">
            {isUploading ? (
              <>
                <FileText className="h-12 w-12 text-primary" />
                <div className="space-y-2 w-full max-w-xs">
                  <p className="text-sm text-muted-foreground">Uploading and analyzing your resume...</p>
                  <Progress value={uploadProgress} className="w-full" />
                </div>
              </>
            ) : (
              <>
                <Upload className="h-12 w-12 text-primary" />
                <div className="space-y-2">
                  <p className="text-lg font-medium">
                    {isDragActive ? 'Drop your resume here' : 'Drag and drop your resume here'}
                  </p>
                  <p className="text-sm text-muted-foreground">
                    or click to select a file
                  </p>
                  <p className="text-xs text-muted-foreground">
                    Supported formats: PDF, DOCX, TXT (max 5MB)
                  </p>
                </div>
              </>
            )}
          </div>
        </div>

        {isUploading && (
          <div className="mt-4 flex items-center gap-2 text-sm text-muted-foreground">
            <AlertCircle className="h-4 w-4" />
            <span>Please wait while we analyze your resume...</span>
          </div>
        )}

        <div className="mt-4 flex justify-end">
          <Button
            disabled={isUploading}
          >
            {isUploading ? (
              <>
                <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                Uploading...
              </>
            ) : (
              'Upload Resume'
            )}
          </Button>
        </div>
      </CardContent>
    </Card>
  );
};

export default ResumeUpload; 