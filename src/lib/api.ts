import axios from 'axios';

const API_BASE_URL = import.meta.env.VITE_API_URL || 'http://localhost:8000';

const api = axios.create({
  baseURL: API_BASE_URL,
  headers: {
    'Content-Type': 'application/json',
  },
});

export interface CareerQuery {
  query: string;
  user_id?: string;
}

export interface CareerResponse {
  response: string;
  suggestions: string[];
}

export const careerApi = {
  getCareerAdvice: async (query: CareerQuery): Promise<CareerResponse> => {
    const response = await api.post('/api/career-advice', query);
    return response.data;
  },

  testCareerInteractions: async () => {
    const response = await api.get('/api/test-career-interactions');
    return response.data;
  },
};

export default api; 