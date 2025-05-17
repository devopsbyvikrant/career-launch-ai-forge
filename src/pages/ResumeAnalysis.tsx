import { useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import ResumeUpload from '@/components/ResumeUpload';
import { useToast } from "@/components/ui/use-toast";

interface AnalysisResult {
  extractedText: string;
  analysis: {
    skills: string[];
    experience: string[];
    education: string[];
    recommendations: string[];
  };
}

export const ResumeAnalysis = () => {
  const [analysisResult, setAnalysisResult] = useState<AnalysisResult | null>(null);
  const { toast } = useToast();

  const handleAnalysisComplete = (result: AnalysisResult) => {
    setAnalysisResult(result);
    toast({
      title: "Analysis Complete",
      description: "Your resume has been successfully analyzed.",
    });
  };

  return (
    <div className="container mx-auto py-8 px-4">
      <h1 className="text-4xl font-bold mb-8 text-center gradient-text">Resume Analysis</h1>
      
      <div className="grid gap-8">
        <Card>
          <CardHeader>
            <CardTitle>Upload Your Resume</CardTitle>
            <CardDescription>
              Upload your resume in PDF, DOCX, or TXT format to get started with the analysis.
            </CardDescription>
          </CardHeader>
          <CardContent>
            <ResumeUpload onAnalysisComplete={handleAnalysisComplete} />
          </CardContent>
        </Card>

        {analysisResult && (
          <Card>
            <CardHeader>
              <CardTitle>Analysis Results</CardTitle>
              <CardDescription>
                Detailed breakdown of your resume analysis
              </CardDescription>
            </CardHeader>
            <CardContent>
              <Tabs defaultValue="skills" className="w-full">
                <TabsList className="grid w-full grid-cols-4">
                  <TabsTrigger value="skills">Skills</TabsTrigger>
                  <TabsTrigger value="experience">Experience</TabsTrigger>
                  <TabsTrigger value="education">Education</TabsTrigger>
                  <TabsTrigger value="recommendations">Recommendations</TabsTrigger>
                </TabsList>
                
                <TabsContent value="skills">
                  <div className="space-y-4">
                    <h3 className="text-lg font-semibold">Identified Skills</h3>
                    <div className="flex flex-wrap gap-2">
                      {analysisResult.analysis.skills.map((skill, index) => (
                        <span
                          key={index}
                          className="px-3 py-1 bg-primary/10 text-primary rounded-full text-sm"
                        >
                          {skill}
                        </span>
                      ))}
                    </div>
                  </div>
                </TabsContent>

                <TabsContent value="experience">
                  <div className="space-y-4">
                    <h3 className="text-lg font-semibold">Work Experience</h3>
                    <div className="space-y-4">
                      {analysisResult.analysis.experience.map((exp, index) => (
                        <div key={index} className="p-4 bg-muted rounded-lg">
                          {exp}
                        </div>
                      ))}
                    </div>
                  </div>
                </TabsContent>

                <TabsContent value="education">
                  <div className="space-y-4">
                    <h3 className="text-lg font-semibold">Education</h3>
                    <div className="space-y-4">
                      {analysisResult.analysis.education.map((edu, index) => (
                        <div key={index} className="p-4 bg-muted rounded-lg">
                          {edu}
                        </div>
                      ))}
                    </div>
                  </div>
                </TabsContent>

                <TabsContent value="recommendations">
                  <div className="space-y-4">
                    <h3 className="text-lg font-semibold">Recommendations</h3>
                    <div className="space-y-4">
                      {analysisResult.analysis.recommendations.map((rec, index) => (
                        <div key={index} className="p-4 bg-muted rounded-lg">
                          {rec}
                        </div>
                      ))}
                    </div>
                  </div>
                </TabsContent>
              </Tabs>
            </CardContent>
          </Card>
        )}
      </div>
    </div>
  );
};

export default ResumeAnalysis; 