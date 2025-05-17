import { useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { useToast } from "@/components/ui/use-toast";
import { Loader2, Download } from "lucide-react";
import { generateCoverLetter } from "@/api/resume";

interface CoverLetterGeneratorProps {
  resumeData: any;
}

const COVER_LETTER_STYLES = [
  { value: 'professional', label: 'Professional' },
  { value: 'creative', label: 'Creative' },
  { value: 'modern', label: 'Modern' },
  { value: 'traditional', label: 'Traditional' },
];

const CoverLetterGenerator = ({ resumeData }: CoverLetterGeneratorProps) => {
  const [isGenerating, setIsGenerating] = useState(false);
  const [jobDescription, setJobDescription] = useState('');
  const [selectedStyle, setSelectedStyle] = useState('professional');
  const [coverLetter, setCoverLetter] = useState<any>(null);
  const { toast } = useToast();

  const handleGenerate = async () => {
    if (!jobDescription.trim()) {
      toast({
        title: "Missing Information",
        description: "Please provide a job description to generate a cover letter.",
        variant: "destructive",
      });
      return;
    }

    setIsGenerating(true);
    try {
      const result = await generateCoverLetter(resumeData, jobDescription, selectedStyle);
      setCoverLetter(result.data);
      toast({
        title: "Cover Letter Generated",
        description: "Your cover letter has been created successfully.",
      });
    } catch (error) {
      toast({
        title: "Generation Failed",
        description: error instanceof Error ? error.message : "Failed to generate cover letter",
        variant: "destructive",
      });
    } finally {
      setIsGenerating(false);
    }
  };

  const handleDownload = () => {
    if (!coverLetter) return;

    const element = document.createElement('a');
    const file = new Blob([coverLetter.content], { type: 'text/plain' });
    element.href = URL.createObjectURL(file);
    element.download = `cover-letter-${selectedStyle}.txt`;
    document.body.appendChild(element);
    element.click();
    document.body.removeChild(element);
  };

  return (
    <div className="space-y-6">
      <Card>
        <CardHeader>
          <CardTitle>Cover Letter Generator</CardTitle>
          <CardDescription>
            Generate a professional cover letter tailored to your job application
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="space-y-2">
            <label className="text-sm font-medium">Select Style</label>
            <Select value={selectedStyle} onValueChange={setSelectedStyle}>
              <SelectTrigger>
                <SelectValue placeholder="Select a style" />
              </SelectTrigger>
              <SelectContent>
                {COVER_LETTER_STYLES.map((style) => (
                  <SelectItem key={style.value} value={style.value}>
                    {style.label}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
          
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
                Generating Cover Letter...
              </>
            ) : (
              'Generate Cover Letter'
            )}
          </Button>
        </CardContent>
      </Card>

      {coverLetter && (
        <Card>
          <CardHeader>
            <div className="flex justify-between items-center">
              <div>
                <CardTitle>Your Cover Letter</CardTitle>
                <CardDescription>
                  {COVER_LETTER_STYLES.find(s => s.value === selectedStyle)?.label} style
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
                <TabsTrigger value="highlights">Highlights</TabsTrigger>
                <TabsTrigger value="suggestions">Suggestions</TabsTrigger>
              </TabsList>

              <TabsContent value="content">
                <div className="space-y-4">
                  <div className="whitespace-pre-wrap font-mono text-sm">
                    {coverLetter.content}
                  </div>
                </div>
              </TabsContent>

              <TabsContent value="highlights">
                <div className="space-y-4">
                  <h3 className="text-lg font-semibold">Key Highlights</h3>
                  <ul className="list-disc list-inside space-y-2">
                    {coverLetter.highlights?.map((highlight: string, index: number) => (
                      <li key={index} className="text-muted-foreground">{highlight}</li>
                    ))}
                  </ul>
                </div>
              </TabsContent>

              <TabsContent value="suggestions">
                <div className="space-y-4">
                  <h3 className="text-lg font-semibold">Customization Suggestions</h3>
                  <ul className="list-disc list-inside space-y-2">
                    {coverLetter.suggestions?.map((suggestion: string, index: number) => (
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

export default CoverLetterGenerator; 