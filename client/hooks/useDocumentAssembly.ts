import { useState } from 'react';
import { OpenAIService } from '../services/openAIService';
import { LegalDocument } from '../types';

export const useDocumentAssembly = (caseTitle: string) => {
  const [step, setStep] = useState(1);
  const [template, setTemplate] = useState('');
  const [formData, setFormData] = useState({ recipient: '', date: '', mainPoint: '' });
  const [result, setResult] = useState('');
  const [loading, setLoading] = useState(false);

  const generate = async () => {
    setLoading(true);
    const context = `Template: ${template}. Case: ${caseTitle}. Recipient: ${formData.recipient}. Point: ${formData.mainPoint}.`;
    const text = await OpenAIService.generateDraft(context, 'Document');
    setResult(text);
    setLoading(false);
    setStep(3);
  };

  const handleSave = (onSave?: (doc: LegalDocument) => void) => {
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
    }
  };

  return {
    step,
    setStep,
    template,
    setTemplate,
    formData,
    setFormData,
    result,
    loading,
    generate,
    handleSave
  };
};