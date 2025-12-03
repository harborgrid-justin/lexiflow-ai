import { useApiRequest, useApiMutation } from '../services/hooks';
import { FormattingTemplate } from '../types';
import { enzymeFormattingService } from '../services/formatting.service';

export const useFormatting = () => {
  const { data: templates = [], isLoading } = useApiRequest<FormattingTemplate[]>({
    endpoint: '/formatting/templates',
  });

  const { mutateAsync: applyFormat } = useApiMutation<string, { content: string; templateId: string }>({
    mutationFn: ({ content, templateId }) => enzymeFormattingService.applyFormat(content, templateId),
  });

  const { mutateAsync: generateTableOfAuthorities } = useApiMutation<string, string>({
    mutationFn: (documentId) => enzymeFormattingService.generateTableOfAuthorities(documentId),
  });

  const { mutateAsync: generatePleadingPaper } = useApiMutation<string, { caseId: string; content: string }>({
    mutationFn: ({ caseId, content }) => enzymeFormattingService.generatePleadingPaper(caseId, content),
  });

  const { mutateAsync: redactDocument } = useApiMutation<string, { documentId: string; terms: string[] }>({
    mutationFn: ({ documentId, terms }) => enzymeFormattingService.redactDocument(documentId, terms),
  });

  const { mutateAsync: convertDocument } = useApiMutation<string, { documentId: string; format: 'pdf' | 'docx' | 'txt' }>({
    mutationFn: ({ documentId, format }) => enzymeFormattingService.convertDocument(documentId, format),
  });

  const { mutateAsync: validateFormatting } = useApiMutation<{ valid: boolean; errors: string[] }, { content: string; ruleset: string }>({
    mutationFn: ({ content, ruleset }) => enzymeFormattingService.validateFormatting(content, ruleset),
  });

  return {
    templates,
    isLoading,
    applyFormat,
    generateTableOfAuthorities,
    generatePleadingPaper,
    redactDocument,
    convertDocument,
    validateFormatting,
  };
};
