import { useApiRequest, useApiMutation } from '../services/hooks';
import { Citation } from '../types';
import { enzymeCitationService } from '../services/citation.service';

export const useCitation = (caseId?: string) => {
  const { data: citations = [], isLoading, refetch } = useApiRequest<Citation[]>({
    endpoint: '/citations',
    options: {
      enabled: !!caseId,
      params: { caseId },
    },
  });

  const { mutateAsync: verifyCitation } = useApiMutation<{ isValid: boolean; corrections?: string[] }, string>({
    mutationFn: (citation) => enzymeCitationService.verify(citation),
  });

  const { mutateAsync: formatCitation } = useApiMutation<string, { citation: string; style: string }>({
    mutationFn: ({ citation, style }) => enzymeCitationService.format(citation, style),
  });

  const { mutateAsync: extractCitations } = useApiMutation<Citation[], string>({
    mutationFn: (text) => enzymeCitationService.extractFromText(text),
  });

  const { mutateAsync: batchVerify } = useApiMutation<any[], string[]>({
    mutationFn: (citations) => enzymeCitationService.batchVerify(citations),
  });

  const { mutateAsync: shepardize } = useApiMutation<any, string>({
    mutationFn: (citationId) => enzymeCitationService.shepardize(citationId),
  });

  const { mutateAsync: autoCorrect } = useApiMutation<{ corrected: string; confidence: number }, string>({
    mutationFn: (citation) => enzymeCitationService.autoCorrect(citation),
  });

  const { mutateAsync: fetchJurisdictionRules } = useApiMutation<any, string>({
    mutationFn: (jurisdiction) => enzymeCitationService.getJurisdictionRules(jurisdiction),
  });

  const { mutateAsync: generateLinks } = useApiMutation<Record<string, string>, { citations: string[]; provider: 'westlaw' | 'lexis' | 'bloomberg' }>({
    mutationFn: ({ citations, provider }) => enzymeCitationService.generateLinks(citations, provider),
  });

  return {
    citations,
    isLoading,
    refetch,
    verifyCitation,
    formatCitation,
    extractCitations,
    batchVerify,
    shepardize,
    autoCorrect,
    fetchJurisdictionRules,
    generateLinks,
  };
};
