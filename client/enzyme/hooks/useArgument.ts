import { useApiRequest, useApiMutation } from '../services/hooks';
import { Argument } from '../types';
import { enzymeArgumentService } from '../services/argument.service';

export const useArgument = (caseId?: string) => {
  const { data: argumentsList = [], isLoading, refetch } = useApiRequest<Argument[]>({
    endpoint: '/arguments',
    options: {
      enabled: !!caseId,
      params: { caseId },
    },
  });

  const { mutateAsync: createArgument } = useApiMutation<Argument, Partial<Argument>>({
    mutationFn: (data) => enzymeArgumentService.create(data),
  });

  const { mutateAsync: updateArgument } = useApiMutation<Argument, { id: string; data: Partial<Argument> }>({
    mutationFn: ({ id, data }) => enzymeArgumentService.update(id, data),
  });

  const { mutateAsync: deleteArgument } = useApiMutation<void, string>({
    mutationFn: (id) => enzymeArgumentService.delete(id),
  });

  const { mutateAsync: generateArgument } = useApiMutation<string, { caseId: string; topic: string; stance: string }>({
    mutationFn: (params) => enzymeArgumentService.generate(params),
  });

  return {
    argumentsList,
    isLoading,
    refetch,
    createArgument,
    updateArgument,
    deleteArgument,
    generateArgument,
  };
};
