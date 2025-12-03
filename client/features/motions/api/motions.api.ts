import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
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
  return useQuery({
    queryKey: motionKeys.list(filters),
    queryFn: () => enzymeMotionsService.getAll(filters),
    staleTime: 5 * 60 * 1000,
  });
}

export function useMotion(id: string) {
  return useQuery({
    queryKey: motionKeys.detail(id),
    queryFn: () => enzymeMotionsService.getById(id),
    enabled: !!id,
  });
}

export function useCreateMotion() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (data: Partial<Motion>) => enzymeMotionsService.create(data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: motionKeys.lists() });
    },
  });
}

export function useUpdateMotion() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({ id, data }: { id: string; data: Partial<Motion> }) =>
      enzymeMotionsService.update(id, data), // Note: Service needs update method
    onSuccess: (_, { id }) => {
      queryClient.invalidateQueries({ queryKey: motionKeys.detail(id) });
      queryClient.invalidateQueries({ queryKey: motionKeys.lists() });
    },
  });
}

export function useDeleteMotion() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (id: string) => enzymeMotionsService.delete(id), // Note: Service needs delete method
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: motionKeys.lists() });
    },
  });
}
