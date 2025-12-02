/**
 * Case Management API Layer
 * TanStack Query hooks for case data fetching and mutations
 */

import { useApiRequest, useApiMutation } from '../../../enzyme';
import { useLatestCallback } from '@missionfabric-js/enzyme/hooks';
import { casesService } from '../../../services/api/cases.service';
import { Case } from '../../../types';
import {
  CaseListParams,
  CaseListResponse,
  TimelineEvent,
  CaseDetail,
  CreateCasePayload,
  UpdateCasePayload,
  CaseFilters,
  CaseMetrics,
} from './cases.types';

/**
 * Hook to fetch paginated case list with filters
 * @param params - List parameters (pagination, filters, sorting)
 */
export const useCases = (params?: CaseListParams) => {
  const { page = 1, limit = 20, filters, sortBy, sortOrder } = params || {};

  // Build query string from params
  const queryParams = new URLSearchParams();
  queryParams.set('page', page.toString());
  queryParams.set('limit', limit.toString());

  if (sortBy) queryParams.set('sortBy', sortBy);
  if (sortOrder) queryParams.set('sortOrder', sortOrder);

  // Add filters to query string
  if (filters) {
    if (filters.status?.length) queryParams.set('status', filters.status.join(','));
    if (filters.practiceArea?.length) queryParams.set('practiceArea', filters.practiceArea.join(','));
    if (filters.attorney?.length) queryParams.set('attorney', filters.attorney.join(','));
    if (filters.client?.length) queryParams.set('client', filters.client.join(','));
    if (filters.court?.length) queryParams.set('court', filters.court.join(','));
    if (filters.jurisdiction?.length) queryParams.set('jurisdiction', filters.jurisdiction.join(','));
    if (filters.dateFrom) queryParams.set('dateFrom', filters.dateFrom);
    if (filters.dateTo) queryParams.set('dateTo', filters.dateTo);
    if (filters.search) queryParams.set('search', filters.search);
    if (filters.priority?.length) queryParams.set('priority', filters.priority.join(','));
  }

  const endpoint = `/api/v1/cases?${queryParams.toString()}`;

  const {
    data: response,
    isLoading,
    error,
    refetch,
  } = useApiRequest<CaseListResponse>({
    endpoint,
    options: {
      staleTime: 2 * 60 * 1000, // 2 minutes - cases change frequently
      refetchOnWindowFocus: true,
      enabled: true,
    },
  });

  return {
    cases: response?.cases || [],
    total: response?.total || 0,
    page: response?.page || 1,
    limit: response?.limit || 20,
    totalPages: response?.totalPages || 0,
    isLoading,
    error,
    refetch,
  };
};

/**
 * Hook to fetch a single case by ID with full details
 * @param id - Case ID
 */
export const useCase = (id: string | undefined) => {
  const {
    data: caseData,
    isLoading,
    error,
    refetch,
  } = useApiRequest<Case>({
    endpoint: `/api/v1/cases/${id}`,
    options: {
      enabled: !!id,
      staleTime: 5 * 60 * 1000, // 5 minutes
      refetchOnWindowFocus: true,
    },
  });

  return {
    case: caseData,
    isLoading,
    error,
    refetch,
  };
};

/**
 * Hook to create a new case
 */
export const useCreateCase = () => {
  const createCase = useLatestCallback(async (data: CreateCasePayload): Promise<Case> => {
    // Transform frontend payload to API format
    const apiPayload = {
      title: data.title,
      case_number: data.caseNumber,
      client_name: data.client,
      matter_type: data.matterType,
      practice_area: data.practiceArea,
      description: data.description,
      court: data.court,
      jurisdiction: data.jurisdiction,
      judge: data.judge,
      opposing_counsel: data.opposingCounsel,
      filing_date: data.filingDate,
      status: data.status || 'Active',
      priority: data.priority,
      billing_model: data.billingModel,
      value: data.value,
      owner_org_id: data.ownerOrgId,
    };

    // Clean undefined values
    const cleanPayload = Object.fromEntries(
      Object.entries(apiPayload).filter(([_, v]) => v !== undefined)
    );

    const newCase = await casesService.create(cleanPayload);

    // If attorneys are assigned, add them as case members
    if (data.assignedAttorneys && data.assignedAttorneys.length > 0) {
      // TODO: Call case members API to assign attorneys
      console.log('Assigning attorneys:', data.assignedAttorneys);
    }

    // If parties are provided, add them
    if (data.parties && data.parties.length > 0) {
      // TODO: Call parties API to add parties
      console.log('Adding parties:', data.parties);
    }

    return newCase;
  });

  return {
    createCase,
    isLoading: false, // We'll handle loading in the calling component
  };
};

/**
 * Hook to update an existing case
 */
export const useUpdateCase = () => {
  const updateCase = useLatestCallback(async (id: string, data: Partial<UpdateCasePayload>): Promise<Case> => {
    // Transform frontend payload to API format
    const apiPayload = {
      title: data.title,
      case_number: data.caseNumber,
      client_name: data.client,
      matter_type: data.matterType,
      practice_area: data.practiceArea,
      description: data.description,
      court: data.court,
      jurisdiction: data.jurisdiction,
      judge: data.judge,
      opposing_counsel: data.opposingCounsel,
      filing_date: data.filingDate,
      status: data.status,
      priority: data.priority,
      billing_model: data.billingModel,
      value: data.value,
    };

    // Clean undefined values
    const cleanPayload = Object.fromEntries(
      Object.entries(apiPayload).filter(([_, v]) => v !== undefined)
    );

    return casesService.update(id, cleanPayload);
  });

  return {
    updateCase,
    isLoading: false,
  };
};

/**
 * Hook to delete a case
 */
export const useDeleteCase = () => {
  const deleteCase = useLatestCallback(async (id: string): Promise<void> => {
    return casesService.delete(id);
  });

  return {
    deleteCase,
    isLoading: false,
  };
};

/**
 * Hook to fetch case timeline/activity feed
 * @param caseId - Case ID
 */
export const useCaseTimeline = (caseId: string | undefined) => {
  const {
    data: timeline,
    isLoading,
    error,
    refetch,
  } = useApiRequest<TimelineEvent[]>({
    endpoint: `/api/v1/cases/${caseId}/timeline`,
    options: {
      enabled: !!caseId,
      staleTime: 1 * 60 * 1000, // 1 minute - timeline updates frequently
      refetchOnWindowFocus: true,
    },
  });

  return {
    timeline: timeline || [],
    isLoading,
    error,
    refetch,
  };
};

/**
 * Hook to fetch parties for a case
 * @param caseId - Case ID
 */
export const useCaseParties = (caseId: string | undefined) => {
  const {
    data: parties,
    isLoading,
    error,
    refetch,
  } = useApiRequest<any[]>({
    endpoint: `/api/v1/cases/${caseId}/parties`,
    options: {
      enabled: !!caseId,
      staleTime: 5 * 60 * 1000, // 5 minutes
      refetchOnWindowFocus: true,
    },
  });

  return {
    parties: parties || [],
    isLoading,
    error,
    refetch,
  };
};

/**
 * Hook to fetch case documents
 * @param caseId - Case ID
 */
export const useCaseDocuments = (caseId: string | undefined) => {
  const {
    data: documents,
    isLoading,
    error,
    refetch,
  } = useApiRequest<any[]>({
    endpoint: `/api/v1/documents?caseId=${caseId}`,
    options: {
      enabled: !!caseId,
      staleTime: 3 * 60 * 1000, // 3 minutes
      refetchOnWindowFocus: true,
    },
  });

  return {
    documents: documents || [],
    isLoading,
    error,
    refetch,
  };
};

/**
 * Hook to fetch case members (assigned attorneys/staff)
 * @param caseId - Case ID
 */
export const useCaseMembers = (caseId: string | undefined) => {
  const {
    data: members,
    isLoading,
    error,
    refetch,
  } = useApiRequest<any[]>({
    endpoint: `/api/v1/cases/${caseId}/members`,
    options: {
      enabled: !!caseId,
      staleTime: 5 * 60 * 1000, // 5 minutes
      refetchOnWindowFocus: true,
    },
  });

  return {
    members: members || [],
    isLoading,
    error,
    refetch,
  };
};

/**
 * Hook to fetch case metrics and statistics
 * @param caseId - Case ID
 */
export const useCaseMetrics = (caseId: string | undefined) => {
  const {
    data: metrics,
    isLoading,
    error,
    refetch,
  } = useApiRequest<CaseMetrics>({
    endpoint: `/api/v1/cases/${caseId}/metrics`,
    options: {
      enabled: !!caseId,
      staleTime: 10 * 60 * 1000, // 10 minutes - metrics don't change often
      refetchOnWindowFocus: false,
    },
  });

  return {
    metrics,
    isLoading,
    error,
    refetch,
  };
};

/**
 * Hook to add a party to a case
 */
export const useAddParty = () => {
  const addParty = useLatestCallback(async (caseId: string, party: any): Promise<any> => {
    // TODO: Implement party creation API
    console.log('Adding party to case:', caseId, party);
    throw new Error('Not implemented');
  });

  return {
    addParty,
    isLoading: false,
  };
};

/**
 * Hook to remove a party from a case
 */
export const useRemoveParty = () => {
  const removeParty = useLatestCallback(async (caseId: string, partyId: string): Promise<void> => {
    // TODO: Implement party deletion API
    console.log('Removing party from case:', caseId, partyId);
    throw new Error('Not implemented');
  });

  return {
    removeParty,
    isLoading: false,
  };
};

/**
 * Hook for bulk case operations
 */
export const useBulkCaseOperation = () => {
  const performBulkOperation = useLatestCallback(
    async (operation: string, caseIds: string[], payload?: any): Promise<void> => {
      // TODO: Implement bulk operations API
      console.log('Performing bulk operation:', operation, caseIds, payload);
      throw new Error('Not implemented');
    }
  );

  return {
    performBulkOperation,
    isLoading: false,
  };
};

/**
 * Hook to export cases
 */
export const useExportCases = () => {
  const exportCases = useLatestCallback(
    async (caseIds: string[], format: 'csv' | 'xlsx' | 'pdf'): Promise<Blob> => {
      // TODO: Implement export API
      console.log('Exporting cases:', caseIds, format);
      throw new Error('Not implemented');
    }
  );

  return {
    exportCases,
    isLoading: false,
  };
};
