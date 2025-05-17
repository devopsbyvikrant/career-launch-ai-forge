import { useMutation, useQuery } from '@tanstack/react-query';
import { careerApi, CareerQuery } from '@/lib/api';
import { useToast } from '@/components/ui/use-toast';

export const useCareerAdvice = () => {
  const { toast } = useToast();

  const testConnection = useQuery({
    queryKey: ['testCareerInteractions'],
    queryFn: careerApi.testCareerInteractions,
    retry: false,
  });

  const getAdvice = useMutation({
    mutationFn: (query: CareerQuery) => careerApi.getCareerAdvice(query),
    onError: (error) => {
      toast({
        title: 'Error',
        description: 'Failed to get career advice. Please try again.',
        variant: 'destructive',
      });
    },
  });

  return {
    testConnection,
    getAdvice,
    isLoading: getAdvice.isPending,
    isError: getAdvice.isError,
    data: getAdvice.data,
  };
}; 