/**
 * Create Case Dialog Component
 * Multi-step wizard for creating a new case
 */

import React, { useState } from 'react';
import { X, ChevronLeft, ChevronRight, Check } from 'lucide-react';
import { CreateCasePayload, CaseStatusType, PracticeArea, CasePriority } from '../api/cases.types';

interface CreateCaseDialogProps {
  isOpen: boolean;
  onClose: () => void;
  onSubmit: (caseData: CreateCasePayload) => Promise<void>;
  availableAttorneys?: Array<{ id: string; name: string }>;
}

const STEPS = [
  { id: 1, name: 'Basic Info', description: 'Case title, number, and type' },
  { id: 2, name: 'Client & Parties', description: 'Client and involved parties' },
  { id: 3, name: 'Court & Jurisdiction', description: 'Court and legal jurisdiction' },
  { id: 4, name: 'Key Dates', description: 'Important dates and deadlines' },
  { id: 5, name: 'Team', description: 'Assign attorneys and staff' },
  { id: 6, name: 'Review', description: 'Review and create case' },
];

const PRACTICE_AREAS: PracticeArea[] = [
  'Litigation',
  'Commercial Litigation',
  'M&A',
  'IP',
  'Real Estate',
  'Criminal Defense',
  'Family Law',
  'Immigration',
  'Employment Law',
  'Tax Law',
  'Bankruptcy',
  'Personal Injury',
];

const STATUSES: CaseStatusType[] = ['Active', 'Pending', 'Discovery', 'Trial', 'On Hold'];

const PRIORITIES: CasePriority[] = ['Low', 'Medium', 'High', 'Urgent'];

export const CreateCaseDialog: React.FC<CreateCaseDialogProps> = ({
  isOpen,
  onClose,
  onSubmit,
  availableAttorneys = [],
}) => {
  const [currentStep, setCurrentStep] = useState(1);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [formData, setFormData] = useState<CreateCasePayload>({
    title: '',
    caseNumber: '',
    client: '',
    matterType: 'Litigation',
    practiceArea: 'Litigation',
    description: '',
    court: '',
    jurisdiction: '',
    judge: '',
    opposingCounsel: '',
    filingDate: '',
    status: 'Active',
    priority: 'Medium',
    billingModel: 'Hourly',
    value: undefined,
    assignedAttorneys: [],
  });

  const updateFormData = (updates: Partial<CreateCasePayload>) => {
    setFormData((prev) => ({ ...prev, ...updates }));
  };

  const validateStep = (step: number): boolean => {
    switch (step) {
      case 1:
        return !!(formData.title && formData.client && formData.matterType);
      case 2:
        return !!formData.client;
      case 3:
        return true; // Optional fields
      case 4:
        return true; // Optional fields
      case 5:
        return true; // Optional fields
      case 6:
        return !!(formData.title && formData.client);
      default:
        return true;
    }
  };

  const canProceed = validateStep(currentStep);

  const handleNext = () => {
    if (canProceed && currentStep < STEPS.length) {
      setCurrentStep(currentStep + 1);
    }
  };

  const handleBack = () => {
    if (currentStep > 1) {
      setCurrentStep(currentStep - 1);
    }
  };

  const handleSubmit = async () => {
    if (!validateStep(6)) return;

    setIsSubmitting(true);
    try {
      await onSubmit(formData);
      onClose();
      // Reset form
      setFormData({
        title: '',
        caseNumber: '',
        client: '',
        matterType: 'Litigation',
        practiceArea: 'Litigation',
        description: '',
        court: '',
        jurisdiction: '',
        judge: '',
        opposingCounsel: '',
        filingDate: '',
        status: 'Active',
        priority: 'Medium',
        billingModel: 'Hourly',
        value: undefined,
        assignedAttorneys: [],
      });
      setCurrentStep(1);
    } catch (error) {
      console.error('Failed to create case:', error);
    } finally {
      setIsSubmitting(false);
    }
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-lg shadow-xl max-w-4xl w-full max-h-[90vh] flex flex-col">
        {/* Header */}
        <div className="flex items-center justify-between p-6 border-b border-slate-200">
          <div>
            <h2 className="text-2xl font-bold text-slate-900">Create New Case</h2>
            <p className="text-sm text-slate-500 mt-1">
              Step {currentStep} of {STEPS.length}: {STEPS[currentStep - 1].description}
            </p>
          </div>
          <button onClick={onClose} className="text-slate-400 hover:text-slate-600">
            <X className="w-6 h-6" />
          </button>
        </div>

        {/* Progress Steps */}
        <div className="px-6 py-4 border-b border-slate-200 bg-slate-50">
          <div className="flex items-center justify-between">
            {STEPS.map((step, index) => (
              <React.Fragment key={step.id}>
                <div className="flex flex-col items-center flex-1">
                  <div
                    className={`w-8 h-8 rounded-full flex items-center justify-center text-sm font-semibold ${
                      step.id < currentStep
                        ? 'bg-green-100 text-green-700'
                        : step.id === currentStep
                        ? 'bg-blue-600 text-white'
                        : 'bg-slate-200 text-slate-500'
                    }`}
                  >
                    {step.id < currentStep ? <Check className="w-4 h-4" /> : step.id}
                  </div>
                  <span className="text-xs text-slate-600 mt-1 text-center">{step.name}</span>
                </div>
                {index < STEPS.length - 1 && (
                  <div
                    className={`flex-1 h-0.5 mx-2 ${
                      step.id < currentStep ? 'bg-green-500' : 'bg-slate-200'
                    }`}
                  ></div>
                )}
              </React.Fragment>
            ))}
          </div>
        </div>

        {/* Content */}
        <div className="flex-1 overflow-y-auto p-6">
          {/* Step 1: Basic Info */}
          {currentStep === 1 && (
            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-slate-700 mb-1">
                  Case Title *
                </label>
                <input
                  type="text"
                  value={formData.title}
                  onChange={(e) => updateFormData({ title: e.target.value })}
                  className="w-full px-3 py-2 border border-slate-300 rounded-md focus:ring-2 ring-blue-500 outline-none"
                  placeholder="Enter case title"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-slate-700 mb-1">
                  Case Number
                </label>
                <input
                  type="text"
                  value={formData.caseNumber}
                  onChange={(e) => updateFormData({ caseNumber: e.target.value })}
                  className="w-full px-3 py-2 border border-slate-300 rounded-md focus:ring-2 ring-blue-500 outline-none"
                  placeholder="e.g., CV-2024-001"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-slate-700 mb-1">
                  Matter Type *
                </label>
                <input
                  type="text"
                  value={formData.matterType}
                  onChange={(e) => updateFormData({ matterType: e.target.value })}
                  className="w-full px-3 py-2 border border-slate-300 rounded-md focus:ring-2 ring-blue-500 outline-none"
                  placeholder="e.g., Litigation, M&A, IP"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-slate-700 mb-1">
                  Practice Area
                </label>
                <select
                  value={formData.practiceArea}
                  onChange={(e) => updateFormData({ practiceArea: e.target.value as PracticeArea })}
                  className="w-full px-3 py-2 border border-slate-300 rounded-md focus:ring-2 ring-blue-500 outline-none"
                >
                  {PRACTICE_AREAS.map((area) => (
                    <option key={area} value={area}>
                      {area}
                    </option>
                  ))}
                </select>
              </div>
              <div>
                <label className="block text-sm font-medium text-slate-700 mb-1">
                  Description
                </label>
                <textarea
                  value={formData.description}
                  onChange={(e) => updateFormData({ description: e.target.value })}
                  rows={4}
                  className="w-full px-3 py-2 border border-slate-300 rounded-md focus:ring-2 ring-blue-500 outline-none"
                  placeholder="Brief description of the case"
                />
              </div>
            </div>
          )}

          {/* Step 2: Client & Parties */}
          {currentStep === 2 && (
            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-slate-700 mb-1">
                  Client Name *
                </label>
                <input
                  type="text"
                  value={formData.client}
                  onChange={(e) => updateFormData({ client: e.target.value })}
                  className="w-full px-3 py-2 border border-slate-300 rounded-md focus:ring-2 ring-blue-500 outline-none"
                  placeholder="Client or organization name"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-slate-700 mb-1">
                  Opposing Counsel
                </label>
                <input
                  type="text"
                  value={formData.opposingCounsel}
                  onChange={(e) => updateFormData({ opposingCounsel: e.target.value })}
                  className="w-full px-3 py-2 border border-slate-300 rounded-md focus:ring-2 ring-blue-500 outline-none"
                  placeholder="Opposing counsel name or firm"
                />
              </div>
              <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
                <p className="text-sm text-blue-800">
                  Additional parties can be added after case creation from the case detail page.
                </p>
              </div>
            </div>
          )}

          {/* Step 3: Court & Jurisdiction */}
          {currentStep === 3 && (
            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-slate-700 mb-1">Court</label>
                <input
                  type="text"
                  value={formData.court}
                  onChange={(e) => updateFormData({ court: e.target.value })}
                  className="w-full px-3 py-2 border border-slate-300 rounded-md focus:ring-2 ring-blue-500 outline-none"
                  placeholder="e.g., Superior Court of California"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-slate-700 mb-1">
                  Jurisdiction
                </label>
                <input
                  type="text"
                  value={formData.jurisdiction}
                  onChange={(e) => updateFormData({ jurisdiction: e.target.value })}
                  className="w-full px-3 py-2 border border-slate-300 rounded-md focus:ring-2 ring-blue-500 outline-none"
                  placeholder="e.g., Los Angeles County, CA"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-slate-700 mb-1">Judge</label>
                <input
                  type="text"
                  value={formData.judge}
                  onChange={(e) => updateFormData({ judge: e.target.value })}
                  className="w-full px-3 py-2 border border-slate-300 rounded-md focus:ring-2 ring-blue-500 outline-none"
                  placeholder="Presiding judge name"
                />
              </div>
            </div>
          )}

          {/* Step 4: Key Dates */}
          {currentStep === 4 && (
            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-slate-700 mb-1">
                  Filing Date
                </label>
                <input
                  type="date"
                  value={formData.filingDate}
                  onChange={(e) => updateFormData({ filingDate: e.target.value })}
                  className="w-full px-3 py-2 border border-slate-300 rounded-md focus:ring-2 ring-blue-500 outline-none"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-slate-700 mb-1">Status</label>
                <select
                  value={formData.status}
                  onChange={(e) => updateFormData({ status: e.target.value as CaseStatusType })}
                  className="w-full px-3 py-2 border border-slate-300 rounded-md focus:ring-2 ring-blue-500 outline-none"
                >
                  {STATUSES.map((status) => (
                    <option key={status} value={status}>
                      {status}
                    </option>
                  ))}
                </select>
              </div>
              <div>
                <label className="block text-sm font-medium text-slate-700 mb-1">Priority</label>
                <select
                  value={formData.priority}
                  onChange={(e) => updateFormData({ priority: e.target.value as CasePriority })}
                  className="w-full px-3 py-2 border border-slate-300 rounded-md focus:ring-2 ring-blue-500 outline-none"
                >
                  {PRIORITIES.map((priority) => (
                    <option key={priority} value={priority}>
                      {priority}
                    </option>
                  ))}
                </select>
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-slate-700 mb-1">
                    Billing Model
                  </label>
                  <select
                    value={formData.billingModel}
                    onChange={(e) => updateFormData({ billingModel: e.target.value })}
                    className="w-full px-3 py-2 border border-slate-300 rounded-md focus:ring-2 ring-blue-500 outline-none"
                  >
                    <option value="Hourly">Hourly</option>
                    <option value="Fixed">Fixed Fee</option>
                    <option value="Contingency">Contingency</option>
                    <option value="Hybrid">Hybrid</option>
                  </select>
                </div>
                <div>
                  <label className="block text-sm font-medium text-slate-700 mb-1">
                    Case Value ($)
                  </label>
                  <input
                    type="number"
                    value={formData.value || ''}
                    onChange={(e) =>
                      updateFormData({ value: e.target.value ? Number(e.target.value) : undefined })
                    }
                    className="w-full px-3 py-2 border border-slate-300 rounded-md focus:ring-2 ring-blue-500 outline-none"
                    placeholder="0"
                  />
                </div>
              </div>
            </div>
          )}

          {/* Step 5: Team */}
          {currentStep === 5 && (
            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-slate-700 mb-2">
                  Assign Attorneys
                </label>
                {availableAttorneys.length > 0 ? (
                  <div className="space-y-2 max-h-64 overflow-y-auto border border-slate-200 rounded-md p-3">
                    {availableAttorneys.map((attorney) => (
                      <label key={attorney.id} className="flex items-center gap-2 cursor-pointer">
                        <input
                          type="checkbox"
                          checked={formData.assignedAttorneys?.includes(attorney.id)}
                          onChange={(e) => {
                            const current = formData.assignedAttorneys || [];
                            updateFormData({
                              assignedAttorneys: e.target.checked
                                ? [...current, attorney.id]
                                : current.filter((id) => id !== attorney.id),
                            });
                          }}
                          className="w-4 h-4 text-blue-600 border-slate-300 rounded focus:ring-blue-500"
                        />
                        <span className="text-sm text-slate-900">{attorney.name}</span>
                      </label>
                    ))}
                  </div>
                ) : (
                  <div className="bg-slate-50 border border-slate-200 rounded-lg p-4 text-center">
                    <p className="text-sm text-slate-500">No attorneys available</p>
                  </div>
                )}
              </div>
              <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
                <p className="text-sm text-blue-800">
                  You can modify team assignments later from the case detail page.
                </p>
              </div>
            </div>
          )}

          {/* Step 6: Review */}
          {currentStep === 6 && (
            <div className="space-y-6">
              <div className="bg-slate-50 border border-slate-200 rounded-lg p-4">
                <h3 className="font-semibold text-slate-900 mb-4">Review Case Details</h3>
                <div className="grid grid-cols-2 gap-4 text-sm">
                  <div>
                    <span className="text-slate-500">Title:</span>
                    <p className="font-medium text-slate-900">{formData.title}</p>
                  </div>
                  {formData.caseNumber && (
                    <div>
                      <span className="text-slate-500">Case Number:</span>
                      <p className="font-medium text-slate-900">{formData.caseNumber}</p>
                    </div>
                  )}
                  <div>
                    <span className="text-slate-500">Client:</span>
                    <p className="font-medium text-slate-900">{formData.client}</p>
                  </div>
                  <div>
                    <span className="text-slate-500">Matter Type:</span>
                    <p className="font-medium text-slate-900">{formData.matterType}</p>
                  </div>
                  {formData.court && (
                    <div>
                      <span className="text-slate-500">Court:</span>
                      <p className="font-medium text-slate-900">{formData.court}</p>
                    </div>
                  )}
                  {formData.jurisdiction && (
                    <div>
                      <span className="text-slate-500">Jurisdiction:</span>
                      <p className="font-medium text-slate-900">{formData.jurisdiction}</p>
                    </div>
                  )}
                  <div>
                    <span className="text-slate-500">Status:</span>
                    <p className="font-medium text-slate-900">{formData.status}</p>
                  </div>
                  <div>
                    <span className="text-slate-500">Priority:</span>
                    <p className="font-medium text-slate-900">{formData.priority}</p>
                  </div>
                </div>
              </div>
              <div className="bg-green-50 border border-green-200 rounded-lg p-4">
                <p className="text-sm text-green-800">
                  Click "Create Case" to finalize and create this case.
                </p>
              </div>
            </div>
          )}
        </div>

        {/* Footer */}
        <div className="flex items-center justify-between p-6 border-t border-slate-200 bg-slate-50">
          <button
            onClick={handleBack}
            disabled={currentStep === 1}
            className="px-4 py-2 text-sm font-medium text-slate-600 hover:text-slate-900 disabled:opacity-50 disabled:cursor-not-allowed flex items-center gap-2"
          >
            <ChevronLeft className="w-4 h-4" />
            Back
          </button>
          <div className="flex gap-2">
            <button
              onClick={onClose}
              className="px-4 py-2 text-sm font-medium text-slate-600 hover:bg-slate-100 rounded-md"
            >
              Cancel
            </button>
            {currentStep < STEPS.length ? (
              <button
                onClick={handleNext}
                disabled={!canProceed}
                className="px-4 py-2 text-sm font-medium text-white bg-blue-600 hover:bg-blue-700 rounded-md disabled:opacity-50 disabled:cursor-not-allowed flex items-center gap-2"
              >
                Next
                <ChevronRight className="w-4 h-4" />
              </button>
            ) : (
              <button
                onClick={handleSubmit}
                disabled={!canProceed || isSubmitting}
                className="px-6 py-2 text-sm font-medium text-white bg-green-600 hover:bg-green-700 rounded-md disabled:opacity-50 disabled:cursor-not-allowed"
              >
                {isSubmitting ? 'Creating...' : 'Create Case'}
              </button>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};
