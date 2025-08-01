import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import Header from "./components/Header";
import Footer from "./components/Footer";
import LandingPage from "./pages/LandingPage";
import NotFound from "./pages/NotFound";
import GetStarted from "./pages/GetStarted";
import Dashboard from "./pages/Dashboard";
import PortfolioBuilder from "./pages/PortfolioBuilder";
import ResumeGenerator from "./pages/ResumeGenerator";
import CoverLetterWriter from "./pages/CoverLetterWriter";
import InterviewPractice from "./pages/InterviewPractice";
import Auth from "./pages/Auth";
import { AuthProvider } from "./hooks/useAuth";
import ResumeViewer from "./components/ResumeViewer";
import { ResumeAnalysis } from '@/pages/ResumeAnalysis';
import PortfolioView from '@/pages/PortfolioView';

const queryClient = new QueryClient();

const App = () => (
  <QueryClientProvider client={queryClient}>
    <AuthProvider>
      <TooltipProvider>
        <Toaster />
        <Sonner />
        <BrowserRouter>
          <div className="flex flex-col min-h-screen">
            <Header />
            <main className="flex-grow">
              <Routes>
                <Route path="/" element={<LandingPage />} />
                <Route path="/auth" element={<Auth />} />
                <Route path="/get-started" element={<GetStarted />} />
                <Route path="/dashboard" element={<Dashboard />} />
                <Route path="/portfolio-builder" element={<PortfolioBuilder />} />
                <Route path="/portfolio/:style" element={<PortfolioView />} />
                <Route path="/resume" element={<ResumeGenerator />} />
                <Route path="/cover-letter" element={<CoverLetterWriter />} />
                <Route path="/interview" element={<InterviewPractice />} />
                <Route path="/resume-viewer" element={<ResumeViewer />} />
                <Route path="/resume-analysis" element={<ResumeAnalysis />} />
                <Route path="*" element={<NotFound />} />
              </Routes>
            </main>
            <Footer />
          </div>
        </BrowserRouter>
      </TooltipProvider>
    </AuthProvider>
  </QueryClientProvider>
);

export default App;