import React, { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { toast } from 'sonner';

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

const PortfolioView: React.FC = () => {
  const { style } = useParams<{ style: string }>();
  const navigate = useNavigate();
  const [portfolioHtml, setPortfolioHtml] = useState<string>('');
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const loadPortfolio = () => {
      try {
        // Get portfolio data from session storage
        const portfolioData = sessionStorage.getItem('portfolioData');
        if (!portfolioData) {
          toast.error('No portfolio data found');
          navigate('/portfolio-builder');
          return;
        }

        const data = JSON.parse(portfolioData) as PortfolioData;
        if (!style || !data[style as keyof PortfolioData]) {
          toast.error('Portfolio style not found');
          navigate('/portfolio-builder');
          return;
        }

        setPortfolioHtml(data[style as keyof PortfolioData].html);
        setIsLoading(false);
      } catch (error) {
        console.error('Error loading portfolio:', error);
        toast.error('Failed to load portfolio');
        navigate('/portfolio-builder');
      }
    };

    loadPortfolio();
  }, [style, navigate]);

  if (isLoading) {
    return (
      <div className="min-h-screen bg-white flex items-center justify-center">
        <div className="text-center">
          <div className="inline-block animate-spin rounded-full h-8 w-8 border-t-2 border-b-2 border-purple mb-4"></div>
          <p className="text-gray-600">Loading portfolio...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-white">
      <div className="fixed top-4 left-4 z-50">
        <Button
          onClick={() => navigate('/portfolio-builder')}
          variant="outline"
          className="bg-white/80 backdrop-blur-sm"
        >
          ← Back to Portfolio Builder
        </Button>
      </div>
      <div dangerouslySetInnerHTML={{ __html: portfolioHtml }} />
    </div>
  );
};

export default PortfolioView; 