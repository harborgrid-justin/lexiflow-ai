import { useApiRequest, useApiMutation } from '../services/hooks';
import { EntityLink } from '../types';
import { enzymeLinkingService } from '../services/linking.service';

export const useLinking = (entityId?: string) => {
  const { data: links = [], isLoading, refetch } = useApiRequest<EntityLink[]>({
    endpoint: '/links',
    options: {
      enabled: !!entityId,
      params: { entityId },
    },
  });

  const { data: suggestedLinks = [] } = useApiRequest<EntityLink[]>({
    endpoint: '/links/suggest',
    options: {
      enabled: !!entityId,
      params: { entityId },
    },
  });

  const { mutateAsync: createLink } = useApiMutation<EntityLink, Partial<EntityLink>>({
    mutationFn: (link) => enzymeLinkingService.createLink(link),
    invalidateQueries: ['/links'],
  });

  const { mutateAsync: deleteLink } = useApiMutation<void, string>({
    mutationFn: (id) => enzymeLinkingService.deleteLink(id),
    invalidateQueries: ['/links'],
  });

  const { mutateAsync: createDeepLink } = useApiMutation<string, { documentId: string; selection: any }>({
    mutationFn: ({ documentId, selection }) => enzymeLinkingService.createDeepLink(documentId, selection),
  });

  const { mutateAsync: findCrossMatterLinks } = useApiMutation<EntityLink[], string>({
    mutationFn: (id) => enzymeLinkingService.findCrossMatterLinks(id),
  });

  const { mutateAsync: resolveEntities } = useApiMutation<any[], string>({
    mutationFn: (text) => enzymeLinkingService.resolveEntities(text),
  });

  const { mutateAsync: checkLinkHealth } = useApiMutation<{ broken: number; total: number; details: any[] }, string>({
    mutationFn: (caseId) => enzymeLinkingService.checkLinkHealth(caseId),
  });

  const { mutateAsync: getVisualizationData } = useApiMutation<any, string>({
    mutationFn: (caseId) => enzymeLinkingService.getVisualizationData(caseId),
  });

  return {
    links,
    suggestedLinks,
    isLoading,
    refetch,
    createLink,
    deleteLink,
    createDeepLink,
    findCrossMatterLinks,
    resolveEntities,
    checkLinkHealth,
    getVisualizationData,
  };
};
