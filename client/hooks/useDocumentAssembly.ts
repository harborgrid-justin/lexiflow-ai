/**
 * ENZYME MIGRATION: useDocumentAssembly
 *
 * Migrated to use Enzyme's advanced hooks for safer state management and callbacks.
 *
 * Changes:
 * - Replaced useState with useSafeState for all state variables (step, template, formData, result, loading)
 * - Wrapped generate with useLatestCallback to prevent stale closures
 * - Added useIsMounted guard in generate to prevent state updates after unmount
 * - Wrapped handleSave with useLatestCallback for consistent callback identity
 * - Added useTrackEvent for analytics tracking throughout the document assembly flow
 *
 * Analytics Events:
 * - document_assembly_template_selected: Tracks when a template is selected
 * - document_assembly_generation_started: Tracks when AI generation begins
 * - document_assembly_generated: Tracks successful generation with result metrics
 * - document_assembly_saved: Tracks when a document is saved
 */
import { OpenAIService } from '../services/openAIService';
import { LegalDocument } from '../types';
import {
  useLatestCallback,
  useSafeState,
  useIsMounted,
  useTrackEvent,
} from '../enzyme';

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
    loading,
    generate,
    handleSave
  };
};