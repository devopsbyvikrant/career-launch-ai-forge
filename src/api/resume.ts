import axios from 'axios';

const API_BASE_URL = import.meta.env.VITE_API_BASE_URL || 'http://localhost:8000';

export interface ResumeAnalysisResult {
  extractedText: string;
  analysis: {
    skills: string[];
    experience: string[];
    education: string[];
    recommendations: string[];
  };
}

export interface PortfolioTemplate {
  html: string;
  style: string;
  preview_url: string;
}

export interface PortfolioResult {
  data: {
    minimal: PortfolioTemplate;
    creative: PortfolioTemplate;
    professional: PortfolioTemplate;
    dynamic: PortfolioTemplate;
  };
}

export interface ATSResumeResult {
  content: string;
  keywords: {
    matched: string[];
    missing: string[];
  };
  suggestions: string[];
}

export interface CoverLetterResult {
  content: string;
  highlights: string[];
  suggestions: string[];
}

export const analyzeResume = async (file: File): Promise<ResumeAnalysisResult> => {
  const formData = new FormData();
  formData.append('resume', file);

  try {
    const response = await axios.post(`${API_BASE_URL}/api/resume/analyze`, formData, {
      headers: {
        'Content-Type': 'multipart/form-data',
      },
    });

    return response.data;
  } catch (error) {
    if (axios.isAxiosError(error)) {
      throw new Error(error.response?.data?.detail || 'Failed to analyze resume');
    }
    throw error;
  }
};

export const generatePortfolio = async (resumeData: any): Promise<{ data: PortfolioResult }> => {
  try {
    const response = await axios.post(`${API_BASE_URL}/api/resume/generate-portfolio`, resumeData);
    return response.data;
  } catch (error) {
    if (axios.isAxiosError(error)) {
      throw new Error(error.response?.data?.detail || 'Failed to generate portfolio');
    }
    throw error;
  }
};

export const generateATSResume = async (
  resumeData: any,
  jobDescription: string
): Promise<{ data: ATSResumeResult }> => {
  try {
    const response = await axios.post(`${API_BASE_URL}/api/resume/generate-ats`, {
      resume_data: resumeData,
      job_description: jobDescription,
    });
    return response.data;
  } catch (error) {
    if (axios.isAxiosError(error)) {
      throw new Error(error.response?.data?.detail || 'Failed to generate ATS resume');
    }
    throw error;
  }
};

export const generateCoverLetter = async (
  resumeData: any,
  jobDescription: string,
  style: string
): Promise<{ data: CoverLetterResult }> => {
  try {
    const response = await axios.post(`${API_BASE_URL}/api/resume/generate-cover-letter`, {
      resume_data: resumeData,
      job_description: jobDescription,
      style,
    });
    return response.data;
  } catch (error) {
    if (axios.isAxiosError(error)) {
      throw new Error(error.response?.data?.detail || 'Failed to generate cover letter');
    }
    throw error;
  }
};

export const getResumeHistory = async () => {
  try {
    const response = await axios.get(`${API_BASE_URL}/api/resume/history`);
    return response.data;
  } catch (error) {
    if (axios.isAxiosError(error)) {
      throw new Error(error.response?.data?.detail || 'Failed to fetch resume history');
    }
    throw error;
  }
};

export const getResumeAnalysis = async (id: string) => {
  try {
    const response = await axios.get(`${API_BASE_URL}/api/resume/analysis/${id}`);
    return response.data;
  } catch (error) {
    if (axios.isAxiosError(error)) {
      throw new Error(error.response?.data?.detail || 'Failed to fetch resume analysis');
    }
    throw error;
  }
};

export const getLatestResume = async () => {
  try {
    const response = await axios.get(`${API_BASE_URL}/api/resume/latest`);
    return response.data;
  } catch (error) {
    if (axios.isAxiosError(error)) {
      throw new Error(error.response?.data?.detail || 'Failed to fetch latest resume');
    }
    throw error;
  }
}; 