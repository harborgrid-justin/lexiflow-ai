import { useApiRequest, useApiMutation } from '../../../enzyme/services/hooks';
import { enzymeMotionsService } from '../../../enzyme/services/motions.service';
import type { Motion } from '../../../types';
import type { MotionFilters } from './motions.types';

export const motionKeys = {
  all: ['motions'] as const,
  lists: () => [...motionKeys.all, 'list'] as const,
  list: (filters: MotionFilters) => [...motionKeys.lists(), { filters }] as const,
  details: () => [...motionKeys.all, 'detail'] as const,
  detail: (id: string) => [...motionKeys.details(), id] as const,
};

export function useMotions(filters: MotionFilters = {}) {
  return useApiRequest<Motion[]>({
    endpoint: '/motions',
    options: {
      params: filters,
      staleTime: 5 * 60 * 1000,
    }
  });
}

export function useMotion(id: string) {
  return useApiRequest<Motion>({
    endpoint: `/motions/${id}`,
    options: {
      enabled: !!id,
    }
  });
}

export function useCreateMotion() {
  return useApiMutation<Motion, Partial<Motion>>({
    mutationFn: (data) => enzymeMotionsService.create(data)
  });
}

export function useUpdateMotion() {
  return useApiMutation<Motion, { id: string; data: Partial<Motion> }>({
    mutationFn: ({ id, data }) => enzymeMotionsService.update(id, data)
  });
}

export function useDeleteMotion() {
  return useApiMutation<void, string>({
    mutationFn: (id) => enzymeMotionsService.delete(id)
  });
}
