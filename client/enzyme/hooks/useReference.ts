import { useApiRequest, useApiMutation } from '../services/hooks';
import { Reference } from '../types';
import { enzymeReferenceService } from '../services/reference.service';

export const useReference = () => {
  const { mutateAsync: lookupReference } = useApiMutation<Reference | null, string>({
    mutationFn: (query) => enzymeReferenceService.lookup(query),
  });

  const { mutateAsync: findCrossReferences } = useApiMutation<Reference[], string>({
    mutationFn: (documentId) => enzymeReferenceService.findCrossReferences(documentId),
  });

  const { mutateAsync: semanticSearch } = useApiMutation<Reference[], string>({
    mutationFn: (query) => enzymeReferenceService.semanticSearch(query),
  });

  const { mutateAsync: generateBibliography } = useApiMutation<string, { referenceIds: string[]; style: string }>({
    mutationFn: ({ referenceIds, style }) => enzymeReferenceService.generateBibliography(referenceIds, style),
  });

  const { mutateAsync: getKnowledgeGraph } = useApiMutation<any, string>({
    mutationFn: (id) => enzymeReferenceService.getKnowledgeGraph(id),
  });

  const { mutateAsync: checkAuthority } = useApiMutation<{ status: string; reason: string }, string>({
    mutationFn: (id) => enzymeReferenceService.checkAuthority(id),
  });

  const { mutateAsync: getReferenceNetwork } = useApiMutation<any, string>({
    mutationFn: (id) => enzymeReferenceService.getReferenceNetwork(id),
  });

  return {
    lookupReference,
    findCrossReferences,
    semanticSearch,
    generateBibliography,
    getKnowledgeGraph,
    checkAuthority,
    getReferenceNetwork,
  };
};
