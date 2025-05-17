import { useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { useToast } from "@/components/ui/use-toast";
import { Loader2, Download } from "lucide-react";
import { generateATSResume } from "@/api/resume";

interface ATSResumeGeneratorProps {
  resumeData: any;
}

const ATSResumeGenerator = ({ resumeData }: ATSResumeGeneratorProps) => {
  const [isGenerating, setIsGenerating] = useState(false);
  const [jobDescription, setJobDescription] = useState('');
  const [atsResume, setAtsResume] = useState<any>(null);
  const { toast } = useToast();

  const handleGenerate = async () => {
    if (!jobDescription.trim()) {
      toast({
        title: "Missing Information",
        description: "Please provide a job description to optimize your resume.",
        variant: "destructive",
      });
      return;
    }

    setIsGenerating(true);
    try {
      const result = await generateATSResume(resumeData, jobDescription);
      setAtsResume(result.data);
      toast({
        title: "Resume Generated",
        description: "Your ATS-optimized resume has been created successfully.",
      });
    } catch (error) {
      toast({
        title: "Generation Failed",
        description: error instanceof Error ? error.message : "Failed to generate ATS resume",
        variant: "destructive",
      });
    } finally {
      setIsGenerating(false);
    }
  };

  const handleDownload = () => {
    if (!atsResume) return;

    const element = document.createElement('a');
    const file = new Blob([atsResume.content], { type: 'text/plain' });
    element.href = URL.createObjectURL(file);
    element.download = 'ats-optimized-resume.txt';
    document.body.appendChild(element);
    element.click();
    document.body.removeChild(element);
  };

  return (
    <div className="space-y-6">
      <Card>
        <CardHeader>
          <CardTitle>ATS Resume Optimizer</CardTitle>
          <CardDescription>
            Generate an ATS-optimized resume based on a job description
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <Textarea
            placeholder="Paste the job description here..."
            value={jobDescription}
            onChange={(e) => setJobDescription(e.target.value)}
            className="min-h-[200px]"
          />
          <Button 
            onClick={handleGenerate} 
            disabled={isGenerating || !jobDescription.trim()}
            className="w-full"
          >
            {isGenerating ? (
              <>
                <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                Generating ATS Resume...
              </>
            ) : (
              'Generate ATS Resume'
            )}
          </Button>
        </CardContent>
      </Card>

      {atsResume && (
        <Card>
          <CardHeader>
            <div className="flex justify-between items-center">
              <div>
                <CardTitle>Optimized Resume</CardTitle>
                <CardDescription>
                  ATS-optimized version of your resume
                </CardDescription>
              </div>
              <Button onClick={handleDownload} variant="outline">
                <Download className="mr-2 h-4 w-4" />
                Download
              </Button>
            </div>
          </CardHeader>
          <CardContent>
            <Tabs defaultValue="content" className="w-full">
              <TabsList className="grid w-full grid-cols-3">
                <TabsTrigger value="content">Content</TabsTrigger>
                <TabsTrigger value="keywords">Keywords</TabsTrigger>
                <TabsTrigger value="suggestions">Suggestions</TabsTrigger>
              </TabsList>

              <TabsContent value="content">
                <div className="space-y-4">
                  <div className="whitespace-pre-wrap font-mono text-sm">
                    {atsResume.content}
                  </div>
                </div>
              </TabsContent>

              <TabsContent value="keywords">
                <div className="space-y-4">
                  <div>
                    <h3 className="text-lg font-semibold mb-2">Matched Keywords</h3>
                    <div className="flex flex-wrap gap-2">
                      {atsResume.keywords?.matched?.map((keyword: string, index: number) => (
                        <span
                          key={index}
                          className="px-3 py-1 bg-green-100 text-green-800 rounded-full text-sm"
                        >
                          {keyword}
                        </span>
                      ))}
                    </div>
                  </div>
                  <div>
                    <h3 className="text-lg font-semibold mb-2">Missing Keywords</h3>
                    <div className="flex flex-wrap gap-2">
                      {atsResume.keywords?.missing?.map((keyword: string, index: number) => (
                        <span
                          key={index}
                          className="px-3 py-1 bg-red-100 text-red-800 rounded-full text-sm"
                        >
                          {keyword}
                        </span>
                      ))}
                    </div>
                  </div>
                </div>
              </TabsContent>

              <TabsContent value="suggestions">
                <div className="space-y-4">
                  <h3 className="text-lg font-semibold">Optimization Suggestions</h3>
                  <ul className="list-disc list-inside space-y-2">
                    {atsResume.suggestions?.map((suggestion: string, index: number) => (
                      <li key={index} className="text-muted-foreground">{suggestion}</li>
                    ))}
                  </ul>
                </div>
              </TabsContent>
            </Tabs>
          </CardContent>
        </Card>
      )}
    </div>
  );
};

export default ATSResumeGenerator; 