import React, { useState, useEffect } from 'react';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { generatePortfolio, getLatestResume } from '@/api/resume';
import { toast } from 'sonner';

interface LocationState {
  resumeData: any;
  portfolioData: any;
}

interface PortfolioTemplate {
  html: string;
  style: string;
  preview_url: string;
}

interface PortfolioData {
  minimal: PortfolioTemplate;
  creative: PortfolioTemplate;
  professional: PortfolioTemplate;
  dynamic: PortfolioTemplate;
}

const PortfolioBuilder: React.FC = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const [isGenerating, setIsGenerating] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  const [resumeData, setResumeData] = useState<any>(null);
  const [portfolioData, setPortfolioData] = useState<PortfolioData | null>(null);
  
  useEffect(() => {
    const fetchLatestResume = async () => {
      try {
        const state = location.state as LocationState;
        if (state?.resumeData) {
          setResumeData(state.resumeData);
          if (state.portfolioData) {
            setPortfolioData(state.portfolioData);
            sessionStorage.setItem('portfolioData', JSON.stringify(state.portfolioData));
            toast.success('Portfolio data loaded successfully!');
          }
          setIsLoading(false);
          return;
        }

        const response = await getLatestResume();
        if (response.status === 'success' && response.data) {
          setResumeData(response.data.extracted_data);
          toast.success('Resume data loaded from database');
        } else {
          toast.error('No resume found. Please upload a resume first.');
          navigate('/upload-resume');
        }
      } catch (error) {
        console.error('Error fetching resume:', error);
        toast.error('Failed to load resume data');
        navigate('/upload-resume');
      } finally {
        setIsLoading(false);
      }
    };

    fetchLatestResume();
  }, [location, navigate]);

  const handleGenerate = async () => {
    if (!resumeData) {
      toast.error('Please upload a resume first.');
      navigate('/upload-resume');
      return;
    }
    
    setIsGenerating(true);
    
    try {
      const result = await generatePortfolio(resumeData);
      const portfolioData = result.data.data;
      setPortfolioData(portfolioData);
      
      // Store portfolio data in session storage
      sessionStorage.setItem('portfolioData', JSON.stringify(portfolioData));
      
      toast.success('Portfolio generated successfully! Click any of the buttons below to view your portfolios.');
    } catch (error) {
      toast.error('Failed to generate portfolio. Please try again.');
      console.error('Error generating portfolio:', error);
    } finally {
      setIsGenerating(false);
    }
  };

  const handleViewPortfolio = (style: string) => {
    if (!portfolioData) {
      toast.error('No portfolio data available');
      return;
    }
    navigate(`/portfolio/${style}`);
  };

  if (isLoading) {
    return (
      <div className="container mx-auto py-8 px-4 flex items-center justify-center min-h-[60vh]">
        <div className="text-center">
          <div className="inline-block animate-spin rounded-full h-8 w-8 border-t-2 border-b-2 border-purple mb-4"></div>
          <p className="text-gray-600">Loading resume data...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="container mx-auto py-8 px-4 animate-fade-in">
      <div className="mb-8">
        <h1 className="text-3xl font-bold mb-2">AI Portfolio Builder</h1>
        <p className="text-gray-600">
          Create professional portfolio websites in minutes
        </p>
      </div>
      
      {!portfolioData && (
        <Card className="mb-8">
          <CardHeader>
            <CardTitle>Generate Your Portfolio</CardTitle>
            <CardDescription>
              Create four unique portfolio styles based on your resume
            </CardDescription>
          </CardHeader>
          <CardContent>
            <Button 
              onClick={handleGenerate} 
              className="w-full bg-purple hover:bg-purple-dark text-white"
              disabled={isGenerating}
            >
              {isGenerating ? (
                <>
                  <div className="animate-spin mr-2 h-4 w-4 border-2 border-white border-t-transparent rounded-full"></div>
                  Generating Portfolios...
                </>
              ) : (
                'Generate Portfolios'
              )}
            </Button>
          </CardContent>
        </Card>
      )}

      {portfolioData && (
        <div className="space-y-8">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {Object.entries(portfolioData).map(([style, template]) => (
              <Card key={style} className="overflow-hidden">
                <div className="aspect-video bg-gray-100 relative">
                  <iframe
                    srcDoc={template.html}
                    className="w-full h-full"
                    title={`${style} Portfolio Preview`}
                  />
                </div>
                <CardContent className="p-4">
                  <h3 className="text-lg font-semibold capitalize mb-2">{style}</h3>
                  <p className="text-sm text-muted-foreground mb-4">{template.style}</p>
                  <div className="space-y-2">
                    <Button
                      onClick={() => handleViewPortfolio(style)}
                      className="w-full bg-purple hover:bg-purple-dark text-white"
                    >
                      View Full Portfolio
                    </Button>
                    <Button
                      onClick={() => window.open(`/portfolio/${style}`, '_blank')}
                      variant="outline"
                      className="w-full"
                    >
                      Open in New Tab
                    </Button>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>

          <div className="text-center space-y-4">
            <div className="flex flex-wrap justify-center gap-4">
              {Object.keys(portfolioData).map((style) => (
                <Button
                  key={style}
                  onClick={() => handleViewPortfolio(style)}
                  className="bg-purple hover:bg-purple-dark text-white"
                >
                  View {style.charAt(0).toUpperCase() + style.slice(1)} Portfolio
                </Button>
              ))}
            </div>
            <Button
              onClick={handleGenerate}
              variant="outline"
              className="mt-4"
            >
              Regenerate Portfolios
            </Button>
          </div>
        </div>
      )}
    </div>
  );
};

export default PortfolioBuilder;
