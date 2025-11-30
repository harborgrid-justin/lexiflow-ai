
import React, { useState } from 'react';
import { Modal } from './common/Modal';
import { Button } from './common/Button';
import { GeminiService } from '../services/geminiService';
import { ArrowRight } from 'lucide-react';
import { ParsedDocketPreview } from './docket/ParsedDocketPreview';

interface DocketImportModalProps {
  isOpen: boolean;
  onClose: () => void;
  onImport: (data: any) => void;
}

export const DocketImportModal: React.FC<DocketImportModalProps> = ({ isOpen, onClose, onImport }) => {
  const [step, setStep] = useState(1);
  const [rawText, setRawText] = useState('');
  const [isParsing, setIsParsing] = useState(false);
  const [parsedData, setParsedData] = useState<any>(null);

  const handleParse = async () => {
    if (!rawText.trim()) return;
    setIsParsing(true);
    const result = await GeminiService.parseDocket(rawText);
    setParsedData(result);
    setIsParsing(false);
    if (result) setStep(2);
  };

  const handleFinish = () => {
    onImport(parsedData);
    onClose();
    // Reset state
    setTimeout(() => {
      setStep(1);
      setRawText('');
      setParsedData(null);
    }, 500);
  };

  return (
    <Modal isOpen={isOpen} onClose={onClose} title="Import Federal Docket" size="lg">
      <div className="p-6">
        {step === 1 && (
          <div className="space-y-4">
            <p className="text-sm text-slate-500">
              Paste the full text from a PACER docket sheet, PDF, or court website. AI will extract case details, parties, and schedule events.
            </p>
            <textarea
              className="w-full h-64 p-4 border border-slate-300 rounded-lg font-mono text-xs focus:ring-2 focus:ring-blue-500 outline-none"
              placeholder="Paste docket text here..."
              value={rawText}
              onChange={(e) => setRawText(e.target.value)}
            />
            <div className="flex justify-end pt-2">
              <Button onClick={handleParse} disabled={isParsing || !rawText.trim()} icon={isParsing ? undefined : ArrowRight} isLoading={isParsing}>
                {isParsing ? 'Analyzing Docket...' : 'Parse & Extract Entities'}
              </Button>
            </div>
          </div>
        )}

        {step === 2 && parsedData && (
          <ParsedDocketPreview 
            parsedData={parsedData} 
            setStep={setStep} 
            handleFinish={handleFinish} 
          />
        )}
      </div>
    </Modal>
  );
};
