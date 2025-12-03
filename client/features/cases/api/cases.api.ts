/**
 * Case Management API Layer
 * TanStack Query hooks for case data fetching and mutations
 */

import { useQuery, useMutation, useQueryClient, UseQueryOptions } from '@tanstack/react-query';
import { enzymeCasesService, CaseListParams } from '../../../enzyme/services/cases.service';
import { Case } from '../../../types';
import {
  CaseListParams as ApiCaseListParams,
  CaseListResponse,
  TimelineEvent,
  CaseDetail,
  CreateCasePayload,
  UpdateCasePayload,
  CaseFilters,
  CaseMetrics,
} from './cases.types';

// ==================== Query Keys ====================

export const casesKeys = {
  all: ['cases'] as const,
  lists: () => [...casesKeys.all, 'list'] as const,
  list: (params: any) => [...casesKeys.lists(), params] as const,
  details: () => [...casesKeys.all, 'detail'] as const,
  detail: (id: string) => [...casesKeys.details(), id] as const,
  stats: () => [...casesKeys.all, 'stats'] as const,
  documents: (id: string) => [...casesKeys.detail(id), 'documents'] as const,
  team: (id: string) => [...casesKeys.detail(id), 'team'] as const,
  workflow: (id: string) => [...casesKeys.detail(id), 'workflow'] as const,
  timeline: (id: string) => [...casesKeys.detail(id), 'timeline'] as const,
  motions: (id: string) => [...casesKeys.detail(id), 'motions'] as const,
  discovery: (id: string) => [...casesKeys.detail(id), 'discovery'] as const,
  evidence: (id: string) => [...casesKeys.detail(id), 'evidence'] as const,
  billing: (id: string) => [...casesKeys.detail(id), 'billing'] as const,
  parties: (id: string) => [...casesKeys.detail(id), 'parties'] as const,
  members: (id: string) => [...casesKeys.detail(id), 'members'] as const,
  metrics: (id: string) => [...casesKeys.detail(id), 'metrics'] as const,
};

/**
 * Hook to fetch paginated case list with filters
 */
export const useCases = (params?: ApiCaseListParams) => {
  const { page = 1, limit = 20, filters, sortBy, sortOrder } = params || {};

  const serviceParams: CaseListParams = {
    page,
    limit,
    sortBy: sortBy as string,
    sortOrder,
    search: filters?.search,
    status: filters?.status?.join(','),
    practiceArea: filters?.practiceArea?.join(','),
    attorney: filters?.attorney?.join(','),
    client: filters?.client?.join(','),
    court: filters?.court?.join(','),
    jurisdiction: filters?.jurisdiction?.join(','),
    dateFrom: filters?.dateFrom,
    dateTo: filters?.dateTo,
    priority: filters?.priority?.join(','),
  };

  const query = useQuery({
    queryKey: casesKeys.list(serviceParams),
    queryFn: () => enzymeCasesService.getAll(serviceParams),
    staleTime: 2 * 60 * 1000,
  });

  return {
    cases: query.data?.cases || [],
    total: query.data?.total || 0,
    page: query.data?.page || 1,
    limit: query.data?.limit || 20,
    totalPages: query.data?.totalPages || 0,
    isLoading: query.isLoading,
    error: query.error,
    refetch: query.refetch,
  };
};

/**
 * Hook to fetch a single case by ID
 */
export const useCase = (id: string | undefined) => {
  const query = useQuery({
    queryKey: casesKeys.detail(id!),
    queryFn: () => enzymeCasesService.getById(id!),
    enabled: !!id,
    staleTime: 5 * 60 * 1000,
  });

  return {
    case: query.data,
    isLoading: query.isLoading,
    error: query.error,
    refetch: query.refetch,
  };
};

/**
 * Hook to create a new case
 */
export const useCreateCase = () => {
  const queryClient = useQueryClient();
  
  const mutation = useMutation({
    mutationFn: async (data: CreateCasePayload) => {
      const caseData: Partial<Case> = {
        title: data.title,
        client: data.client,
        matterType: data.matterType,
        description: data.description,
        court: data.court,
        jurisdiction: data.jurisdiction,
        judge: data.judge,
        opposingCounsel: data.opposingCounsel,
        filingDate: data.filingDate,
        status: data.status || 'Active',
        billingModel: data.billingModel,
        value: data.value,
        ownerOrgId: data.ownerOrgId,
      };
      return enzymeCasesService.create(caseData);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: casesKeys.lists() });
    },
  });

  return {
    createCase: mutation.mutateAsync,
    isLoading: mutation.isPending,
    error: mutation.error,
  };
};

/**
 * Hook to update an existing case
 */
export const useUpdateCase = () => {
  const queryClient = useQueryClient();

  const mutation = useMutation({
    mutationFn: async ({ id, data }: { id: string; data: Partial<UpdateCasePayload> }) => {
      const caseData: Partial<Case> = {
        title: data.title,
        client: data.client,
        matterType: data.matterType,
        description: data.description,
        court: data.court,
        jurisdiction: data.jurisdiction,
        judge: data.judge,
        opposingCounsel: data.opposingCounsel,
        filingDate: data.filingDate,
        status: data.status,
        billingModel: data.billingModel,
        value: data.value,
      };
      return enzymeCasesService.update(id, caseData);
    },
    onSuccess: (_, { id }) => {
      queryClient.invalidateQueries({ queryKey: casesKeys.detail(id) });
      queryClient.invalidateQueries({ queryKey: casesKeys.lists() });
    },
  });

  return {
    updateCase: (id: string, data: Partial<UpdateCasePayload>) => mutation.mutateAsync({ id, data }),
    isLoading: mutation.isPending,
    error: mutation.error,
  };
};

/**
 * Hook to delete a case
 */
export const useDeleteCase = () => {
  const queryClient = useQueryClient();

  const mutation = useMutation({
    mutationFn: (id: string) => enzymeCasesService.delete(id),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: casesKeys.lists() });
    },
  });

  return {
    deleteCase: mutation.mutateAsync,
    isLoading: mutation.isPending,
    error: mutation.error,
  };
};

/**
 * Hook to fetch case timeline
 */
export const useCaseTimeline = (caseId: string | undefined) => {
  const query = useQuery({
    queryKey: casesKeys.timeline(caseId!),
    queryFn: () => enzymeCasesService.getTimeline(caseId!),
    enabled: !!caseId,
    staleTime: 1 * 60 * 1000,
  });

  return {
    timeline: query.data || [],
    isLoading: query.isLoading,
    error: query.error,
    refetch: query.refetch,
  };
};

/**
 * Hook to fetch case parties
 */
export const useCaseParties = (caseId: string | undefined) => {
  const query = useQuery({
    queryKey: casesKeys.parties(caseId!),
    queryFn: () => enzymeCasesService.getParties(caseId!),
    enabled: !!caseId,
    staleTime: 5 * 60 * 1000,
  });

  return {
    parties: query.data || [],
    isLoading: query.isLoading,
    error: query.error,
    refetch: query.refetch,
  };
};

/**
 * Hook to fetch case documents
 */
export const useCaseDocuments = (caseId: string | undefined) => {
  const query = useQuery({
    queryKey: casesKeys.documents(caseId!),
    queryFn: () => enzymeCasesService.getDocuments(caseId!),
    enabled: !!caseId,
    staleTime: 3 * 60 * 1000,
  });

  return {
    documents: query.data || [],
    isLoading: query.isLoading,
    error: query.error,
    refetch: query.refetch,
  };
};

/**
 * Hook to fetch case members
 */
export const useCaseMembers = (caseId: string | undefined) => {
  const query = useQuery({
    queryKey: casesKeys.members(caseId!),
    queryFn: () => enzymeCasesService.getTeam(caseId!),
    enabled: !!caseId,
    staleTime: 5 * 60 * 1000,
  });

  return {
    members: query.data || [],
    isLoading: query.isLoading,
    error: query.error,
    refetch: query.refetch,
  };
};

/**
 * Hook to fetch case metrics
 */
export const useCaseMetrics = (caseId: string | undefined) => {
  const query = useQuery({
    queryKey: casesKeys.metrics(caseId!),
    queryFn: () => enzymeCasesService.getMetrics(caseId!),
    enabled: !!caseId,
    staleTime: 10 * 60 * 1000,
  });

  return {
    metrics: query.data,
    isLoading: query.isLoading,
    error: query.error,
    refetch: query.refetch,
  };
};

// Placeholders for unimplemented hooks
export const useAddParty = () => ({ addParty: async () => {}, isLoading: false });
export const useRemoveParty = () => ({ removeParty: async () => {}, isLoading: false });
export const useBulkCaseOperation = () => ({ performBulkOperation: async () => {}, isLoading: false });
export const useExportCases = () => ({ exportCases: async () => new Blob(), isLoading: false });
