import { useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Button } from "@/components/ui/button";
import { useToast } from "@/components/ui/use-toast";
import { Loader2 } from "lucide-react";
import { generatePortfolio } from "@/api/resume";

interface PortfolioGeneratorProps {
  resumeData: any;
}

const PortfolioGenerator = ({ resumeData }: PortfolioGeneratorProps) => {
  const [isGenerating, setIsGenerating] = useState(false);
  const [portfolio, setPortfolio] = useState<any>(null);
  const { toast } = useToast();

  const handleGenerate = async () => {
    setIsGenerating(true);
    try {
      const result = await generatePortfolio(resumeData);
      setPortfolio(result.data);
      toast({
        title: "Portfolio Generated",
        description: "Your professional portfolio has been created successfully.",
      });
    } catch (error) {
      toast({
        title: "Generation Failed",
        description: error instanceof Error ? error.message : "Failed to generate portfolio",
        variant: "destructive",
      });
    } finally {
      setIsGenerating(false);
    }
  };

  return (
    <div className="space-y-6">
      <Card>
        <CardHeader>
          <CardTitle>Professional Portfolio</CardTitle>
          <CardDescription>
            Generate a comprehensive portfolio based on your resume
          </CardDescription>
        </CardHeader>
        <CardContent>
          <Button 
            onClick={handleGenerate} 
            disabled={isGenerating}
            className="w-full"
          >
            {isGenerating ? (
              <>
                <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                Generating Portfolio...
              </>
            ) : (
              'Generate Portfolio'
            )}
          </Button>
        </CardContent>
      </Card>

      {portfolio && (
        <Card>
          <CardHeader>
            <CardTitle>Your Portfolio</CardTitle>
            <CardDescription>
              A comprehensive showcase of your professional journey
            </CardDescription>
          </CardHeader>
          <CardContent>
            <Tabs defaultValue="about" className="w-full">
              <TabsList className="grid w-full grid-cols-4">
                <TabsTrigger value="about">About</TabsTrigger>
                <TabsTrigger value="projects">Projects</TabsTrigger>
                <TabsTrigger value="skills">Skills</TabsTrigger>
                <TabsTrigger value="experience">Experience</TabsTrigger>
              </TabsList>

              <TabsContent value="about">
                <div className="space-y-4">
                  <h3 className="text-lg font-semibold">Professional Summary</h3>
                  <p className="text-muted-foreground">{portfolio.summary}</p>
                  
                  <h3 className="text-lg font-semibold mt-6">Career Highlights</h3>
                  <ul className="list-disc list-inside space-y-2">
                    {portfolio.highlights?.map((highlight: string, index: number) => (
                      <li key={index} className="text-muted-foreground">{highlight}</li>
                    ))}
                  </ul>
                </div>
              </TabsContent>

              <TabsContent value="projects">
                <div className="space-y-6">
                  {portfolio.projects?.map((project: any, index: number) => (
                    <div key={index} className="space-y-2">
                      <h3 className="text-lg font-semibold">{project.title}</h3>
                      <p className="text-muted-foreground">{project.description}</p>
                      <div className="flex flex-wrap gap-2 mt-2">
                        {project.technologies?.map((tech: string, techIndex: number) => (
                          <span
                            key={techIndex}
                            className="px-2 py-1 bg-primary/10 text-primary rounded-full text-sm"
                          >
                            {tech}
                          </span>
                        ))}
                      </div>
                    </div>
                  ))}
                </div>
              </TabsContent>

              <TabsContent value="skills">
                <div className="space-y-6">
                  {Object.entries(portfolio.skills || {}).map(([category, skills]: [string, any]) => (
                    <div key={category} className="space-y-2">
                      <h3 className="text-lg font-semibold capitalize">{category}</h3>
                      <div className="flex flex-wrap gap-2">
                        {skills.map((skill: string, index: number) => (
                          <span
                            key={index}
                            className="px-3 py-1 bg-primary/10 text-primary rounded-full text-sm"
                          >
                            {skill}
                          </span>
                        ))}
                      </div>
                    </div>
                  ))}
                </div>
              </TabsContent>

              <TabsContent value="experience">
                <div className="space-y-6">
                  {portfolio.experience?.map((exp: any, index: number) => (
                    <div key={index} className="space-y-2">
                      <div className="flex justify-between items-start">
                        <div>
                          <h3 className="text-lg font-semibold">{exp.role}</h3>
                          <p className="text-muted-foreground">{exp.company}</p>
                        </div>
                        <p className="text-sm text-muted-foreground">{exp.duration}</p>
                      </div>
                      <ul className="list-disc list-inside space-y-1">
                        {exp.achievements?.map((achievement: string, achIndex: number) => (
                          <li key={achIndex} className="text-muted-foreground">{achievement}</li>
                        ))}
                      </ul>
                    </div>
                  ))}
                </div>
              </TabsContent>
            </Tabs>
          </CardContent>
        </Card>
      )}
    </div>
  );
};

export default PortfolioGenerator; 