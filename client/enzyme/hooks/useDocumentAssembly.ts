import {
  useLatestCallback,
  useIsMounted,
  useTrackEvent,
  useSafeState,
} from '../index';
import { OpenAIService } from '../../services/openAIService';
import { LegalDocument } from '../../types';

export const useDocumentAssembly = (caseTitle: string) => {
  const trackEvent = useTrackEvent();
  const isMounted = useIsMounted();

  const [step, setStep] = useSafeState(1);
  const [template, setTemplate] = useSafeState('');
  const [formData, setFormData] = useSafeState({ recipient: '', date: '', mainPoint: '' });
  const [result, setResult] = useSafeState('');
  const [loading, setLoading] = useSafeState(false);

  const generate = useLatestCallback(async () => {
    setLoading(true);
    trackEvent('document_assembly_generation_started', {
      template,
      caseTitle,
      hasRecipient: !!formData.recipient,
      hasMainPoint: !!formData.mainPoint
    });

    const context = `Template: ${template}. Case: ${caseTitle}. Recipient: ${formData.recipient}. Point: ${formData.mainPoint}.`;
    
    try {
      const text = await OpenAIService.generateDraft(context, 'Document');

      if (isMounted()) {
        setResult(text);
        setLoading(false);
        setStep(3);
        trackEvent('document_assembly_generated', {
          template,
          resultLength: text.length,
          caseTitle
        });
      }
    } catch (error) {
      if (isMounted()) {
        setLoading(false);
        console.error('Document generation failed:', error);
      }
    }
  });

  const handleSave = useLatestCallback((onSave?: (doc: LegalDocument) => void) => {
    if (onSave && result) {
      const newDoc: LegalDocument = {
        id: `gen-${Date.now()}`,
        caseId: 'current', // In a real app this would be passed down
        title: `${template} - ${new Date().toLocaleDateString()}`,
        type: 'Generated',
        content: result,
        uploadDate: new Date().toLocaleDateString(),
        lastModified: new Date().toLocaleDateString(),
        tags: ['AI Generated', template],
        versions: []
      };
      onSave(newDoc);
      trackEvent('document_assembly_saved', {
        template,
        caseTitle,
        documentLength: result.length
      });
    }
  });

  // Create a wrapper for setTemplate that also tracks the event
  const setTemplateWithTracking = useLatestCallback((newTemplate: string) => {
    setTemplate(newTemplate);
    if (newTemplate) {
      trackEvent('document_assembly_template_selected', {
        template: newTemplate,
        caseTitle
      });
    }
  });

  return {
    step,
    setStep,
    template,
    setTemplate: setTemplateWithTracking,
    formData,
    setFormData,
    result,
    setResult,
    loading,
    generate,
    handleSave
  };
};
