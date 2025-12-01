import React, { useEffect, useState, useRef } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import {
  HydrationProvider,
  HydrationBoundary,
} from '@missionfabric-js/enzyme/hydration';
import { DOMContextProvider } from '@missionfabric-js/enzyme/layouts';
import { ArrowLeft, Save, X, AlertCircle, CheckCircle2, Loader2, Search, ChevronDown } from 'lucide-react';
import { Case } from '../../types';
import { useApiRequest, useApiMutation } from '../../services/enzyme';
import { useDebouncedValue } from '@missionfabric-js/enzyme/hooks';

// Form validation schema with Zod
const caseSchema = z.object({
  title: z.string()
    .min(3, 'Case title must be at least 3 characters')
    .max(200, 'Case title must be less than 200 characters'),
  client_name: z.string()
    .min(2, 'Client name must be at least 2 characters'),
  status: z.enum(['Active', 'Pending', 'Closed', 'On Hold']),
  description: z.string().optional(),
  value: z.number().min(0, 'Case value must be positive').optional(),
});

type CaseFormData = z.infer<typeof caseSchema>;


interface EditCaseDemoProps {
  caseId: string;
  onBack: () => void;
}

// Client type for autocomplete
interface Client {
  id: string;
  name: string;
  email?: string;
  company?: string;
}

// Form Fields Component using React Hook Form with Enzyme autocomplete
function CaseFormFields({ register, errors, clients, setValue, watch, clientsLoading }: {
  register: any;
  errors: any;
  clients: Client[];
  setValue: any;
  watch: any;
  clientsLoading?: boolean;
}) {
  const [showClientDropdown, setShowClientDropdown] = useState(false);
  const [clientSearch, setClientSearch] = useState('');
  const clientInputRef = useRef<HTMLInputElement>(null);
  const dropdownRef = useRef<HTMLDivElement>(null);
  
  // ✅ ENZYME HOOK: Debounce search input
  const debouncedSearch = useDebouncedValue(clientSearch, 300);
  
  // Filter clients based on search
  const filteredClients = clients.filter(client =>
    client.name.toLowerCase().includes(debouncedSearch.toLowerCase()) ||
    client.company?.toLowerCase().includes(debouncedSearch.toLowerCase())
  ).slice(0, 10);
  
  const _currentClientName = watch('client_name');
  
  // Handle clicks outside to close dropdown
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (
        dropdownRef.current && 
        !dropdownRef.current.contains(event.target as Node) &&
        clientInputRef.current &&
        !clientInputRef.current.contains(event.target as Node)
      ) {
        setShowClientDropdown(false);
      }
    };
    
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);
  
  const selectClient = (client: Client) => {
    setValue('client_name', client.name, { shouldValidate: true });
    setClientSearch(client.name);
    setShowClientDropdown(false);
  };
  return (
    <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
      {/* Case Title - Full Width */}
      <div className="md:col-span-2">
        <label className="block text-sm font-medium text-slate-700 mb-2">
          Case Title
        </label>
        <input
          type="text"
          {...register('title')}
          className={`w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent ${
            errors.title ? 'border-red-500' : 'border-slate-300'
          }`}
          placeholder="Enter case title"
        />
        {errors.title && (
          <p className="mt-1 text-sm text-red-600 flex items-center gap-1">
            <AlertCircle className="w-4 h-4" />
            {errors.title.message}
          </p>
        )}
      </div>

      {/* Client Name - Full Width with Enzyme Autocomplete */}
      <div className="md:col-span-2 relative">
        <label className="block text-sm font-medium text-slate-700 mb-2">
          Client Name
          <span className="ml-2 text-xs text-blue-600 font-normal">✨ Enzyme Autocomplete</span>
        </label>
        <div className="relative">
          <input
            type="text"
            value={clientSearch}
            ref={clientInputRef}
            onFocus={() => setShowClientDropdown(true)}
            onChange={(e) => {
              const value = e.target.value;
              setClientSearch(value);
              setValue('client_name', value, { shouldValidate: true });
              setShowClientDropdown(true);
            }}
            onKeyDown={(e) => {
              if (e.key === 'Escape') {
                setShowClientDropdown(false);
              }
            }}
            className={`w-full px-4 py-2 pr-10 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent ${
              errors.client_name ? 'border-red-500' : 'border-slate-300'
            }`}
            placeholder="Search for a client..."
            autoComplete="off"
          />
          <div className="absolute right-3 top-1/2 -translate-y-1/2 flex items-center gap-1">
            {clientsLoading ? (
              <Loader2 className="w-4 h-4 text-blue-500 animate-spin" />
            ) : clients.length > 0 ? (
              <Search className="w-4 h-4 text-slate-400" />
            ) : null}
            <ChevronDown className="w-4 h-4 text-slate-400" />
          </div>
        </div>
        
        {/* Autocomplete Dropdown */}
        {showClientDropdown && filteredClients.length > 0 && (
          <div 
            ref={dropdownRef}
            className="absolute z-50 w-full mt-1 bg-white border border-slate-300 rounded-lg shadow-lg max-h-60 overflow-y-auto"
          >
            <div className="p-2 text-xs text-slate-500 border-b bg-slate-50">
              {filteredClients.length} client{filteredClients.length !== 1 ? 's' : ''} found
            </div>
            {filteredClients.map((client) => (
              <button
                key={client.id}
                type="button"
                onMouseDown={(e) => {
                  e.preventDefault(); // Prevent input blur
                  selectClient(client);
                }}
                className="w-full text-left px-4 py-2.5 hover:bg-blue-50 transition-colors border-b border-slate-100 last:border-0"
              >
                <div className="font-medium text-slate-900">{client.name}</div>
                {client.company && (
                  <div className="text-xs text-slate-500 mt-0.5">{client.company}</div>
                )}
                {client.email && (
                  <div className="text-xs text-slate-400 mt-0.5">{client.email}</div>
                )}
              </button>
            ))}
          </div>
        )}
        
        {/* Show message when no results */}
        {showClientDropdown && clientSearch && filteredClients.length === 0 && !clientsLoading && (
          <div 
            ref={dropdownRef}
            className="absolute z-50 w-full mt-1 bg-white border border-slate-300 rounded-lg shadow-lg p-4"
          >
            <p className="text-sm text-slate-500 text-center">
              No clients found matching "{clientSearch}"
            </p>
            <p className="text-xs text-slate-400 text-center mt-1">
              You can still type any client name
            </p>
          </div>
        )}
        
        {errors.client_name && (
          <p className="mt-1 text-sm text-red-600 flex items-center gap-1">
            <AlertCircle className="w-4 h-4" />
            {errors.client_name.message}
          </p>
        )}
      </div>

      {/* Status - Full Width */}
      <div className="md:col-span-2">
        <label className="block text-sm font-medium text-slate-700 mb-2">
          Status
        </label>
        <select
          {...register('status')}
          className="w-full px-4 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
        >
          <option value="Active">Active</option>
          <option value="Pending">Pending</option>
          <option value="Closed">Closed</option>
          <option value="On Hold">On Hold</option>
        </select>
      </div>

      {/* Description - Full Width */}
      <div className="md:col-span-2">
        <label className="block text-sm font-medium text-slate-700 mb-2">
          Description
        </label>
        <textarea
          {...register('description')}
          rows={4}
          className="w-full px-4 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
          placeholder="Enter case description"
        />
      </div>

      {/* Case Value - Full Width */}
      <div className="md:col-span-2">
        <label className="block text-sm font-medium text-slate-700 mb-2">
          Case Value ($)
        </label>
        <input
          type="number"
          {...register('value', { valueAsNumber: true })}
          className="w-full px-4 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
          placeholder="0.00"
          min="0"
          step="0.01"
        />
      </div>
    </div>
  );
}

// Action Buttons Component
function ActionButtons({ onSave, onCancel, isSaving, isValid, isDirty }: {
  onSave: () => void;
  onCancel: () => void;
  isSaving: boolean;
  isValid: boolean;
  isDirty: boolean;
}) {
  return (
    <div className="flex items-center justify-end gap-3">
      <button
        onClick={onCancel}
        type="button"
        disabled={isSaving}
        className="px-6 py-2 border border-slate-300 text-slate-700 rounded-lg hover:bg-slate-50 transition-colors disabled:opacity-50 disabled:cursor-not-allowed flex items-center gap-2"
      >
        <X className="w-4 h-4" />
        Cancel
      </button>
      <button
        onClick={onSave}
        type="button"
        disabled={isSaving || !isDirty || !isValid}
        className="px-6 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors disabled:opacity-50 disabled:cursor-not-allowed flex items-center gap-2"
      >
        {isSaving ? (
          <>
            <Loader2 className="w-4 h-4 animate-spin" />
            Saving...
          </>
        ) : (
          <>
            <Save className="w-4 h-4" />
            Save Changes
          </>
        )}
      </button>
    </div>
  );
}

export function EditCaseDemo({ caseId, onBack }: EditCaseDemoProps) {
  const [saveSuccess, setSaveSuccess] = React.useState(false);

  // ✅ ENZYME: Fetch case data
  const { data: caseData, isLoading, error } = useApiRequest<Case>(`/cases/${caseId}`);
  
  // ✅ ENZYME: Fetch clients for autocomplete (prefetched on hover from demo page)
  const { data: clientsData, isLoading: clientsLoading } = useApiRequest<Client[]>('/clients', {
    enabled: true, // Always fetch for autocomplete
  });
  
  const clients = clientsData || [];

  // React Hook Form with Zod validation
  const { register, handleSubmit, formState: { errors, isValid, isDirty }, reset, setValue, watch } = useForm<CaseFormData>({
    resolver: zodResolver(caseSchema),
    mode: 'onChange', // Validate on change for real-time feedback
  });

  // Update mutation with Enzyme
  const updateMutation = useApiMutation<Case, CaseFormData>(`/cases/${caseId}`, {
    method: 'PATCH',
    onSuccess: () => {
      setSaveSuccess(true);
      setTimeout(() => setSaveSuccess(false), 3000);
    },
    onError: (error) => {
      console.error('Save failed:', error);
      console.error('Error details:', (error as any).details);
      console.error('Error code:', (error as any).code);
      console.error('Full error object:', JSON.stringify(error, null, 2));
    },
  });

  // Initialize form data when case loads
  useEffect(() => {
    if (caseData) {
      reset({
        title: caseData.title,
        client_name: caseData.client,
        status: caseData.status,
        description: caseData.description || '',
        value: caseData.value || 0,
      });
    }
  }, [caseData, reset]);

  const onSubmit = (data: CaseFormData) => {
    updateMutation.mutate(data);
  };

  if (isLoading) {
    return (
      <div className="flex items-center justify-center h-full">
        <Loader2 className="w-8 h-8 animate-spin text-blue-600" />
      </div>
    );
  }

  if (error) {
    return (
      <div className="flex items-center justify-center h-full">
        <div className="text-center">
          <AlertCircle className="w-12 h-12 text-red-500 mx-auto mb-4" />
          <p className="text-slate-600">Failed to load case</p>
          <button
            onClick={onBack}
            className="mt-4 px-4 py-2 bg-slate-600 text-white rounded-lg hover:bg-slate-700"
          >
            Go Back
          </button>
        </div>
      </div>
    );
  }

  return (
    <DOMContextProvider>
      <HydrationProvider>
        <div className="h-full overflow-auto bg-slate-50">
          <div className="max-w-4xl mx-auto p-6 space-y-6">
            <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
              {/* Header */}
              <HydrationBoundary priority="critical" trigger="immediate" id="edit-header">
                <div className="bg-white rounded-lg border border-slate-200 p-6">
                  <button
                    type="button"
                    onClick={onBack}
                    className="flex items-center gap-2 text-slate-600 hover:text-slate-900 mb-4 transition-colors"
                  >
                    <ArrowLeft className="w-4 h-4" />
                    <span>Back to Demo</span>
                  </button>
                  
                  <div className="flex items-center justify-between">
                    <div>
                      <h1 className="text-2xl font-bold text-slate-900">Edit Case</h1>
                      <p className="text-slate-600 mt-1">
                        Case #{caseData?.caseNumber} - React Hook Form + Zod + Enzyme
                      </p>
                    </div>
                    {saveSuccess && (
                      <div className="flex items-center gap-2 text-green-600 bg-green-50 px-4 py-2 rounded-lg">
                        <CheckCircle2 className="w-5 h-5" />
                        <span className="font-medium">Saved successfully!</span>
                      </div>
                    )}
                  </div>
                </div>
              </HydrationBoundary>

              {/* Form */}
              <HydrationBoundary priority="normal" trigger="visible" id="form-fields">
                <div className="bg-white rounded-lg border border-slate-200 p-6">
                  <h2 className="text-lg font-semibold text-slate-900 mb-6">Case Details</h2>
                  <CaseFormFields 
                    register={register} 
                    errors={errors} 
                    clients={clients}
                    setValue={setValue}
                    watch={watch}
                    clientsLoading={clientsLoading}
                  />
                </div>
              </HydrationBoundary>

              {/* Actions */}
              <HydrationBoundary priority="normal" trigger="visible" id="action-buttons">
                <div className="bg-white rounded-lg border border-slate-200 p-6">
                  <ActionButtons
                    onSave={handleSubmit(onSubmit)}
                    onCancel={onBack}
                    isSaving={updateMutation.isLoading}
                    isValid={isValid}
                    isDirty={isDirty}
                  />
                </div>
              </HydrationBoundary>

              {/* Error Display */}
              {updateMutation.error && (
                <HydrationBoundary priority="low" trigger="idle" id="error-display">
                  <div className="bg-red-50 border border-red-200 rounded-lg p-4">
                    <div className="flex items-start gap-3">
                      <AlertCircle className="w-5 h-5 text-red-600 flex-shrink-0 mt-0.5" />
                      <div className="flex-1 min-w-0">
                        <h3 className="font-semibold text-red-800 mb-1">Failed to save changes</h3>
                        
                        {/* Main error message */}
                        <p className="text-sm text-red-700 mb-2">
                          {updateMutation.error.message || 'An unexpected error occurred'}
                        </p>
                        
                        {/* Error code if available */}
                        {(updateMutation.error as any).code && (
                          <p className="text-xs text-red-600 font-mono mb-2">
                            Error Code: {(updateMutation.error as any).code}
                          </p>
                        )}
                        
                        {/* Validation errors from details.validationErrors */}
                        {(updateMutation.error as any).details?.validationErrors && (
                          <div className="mt-3 bg-red-100 rounded p-3">
                            <p className="text-sm font-semibold text-red-800 mb-2">Validation Issues:</p>
                            <ul className="text-sm text-red-700 space-y-1">
                              {(updateMutation.error as any).details.validationErrors.map((err: any, idx: number) => (
                                <li key={idx} className="flex items-start gap-2">
                                  <span className="text-red-400">•</span>
                                  <span>
                                    {err.field && <strong className="font-medium">{err.field}:</strong>}{' '}
                                    {err.message || (err.constraints ? Object.values(err.constraints).join(', ') : JSON.stringify(err))}
                                  </span>
                                </li>
                              ))}
                            </ul>
                          </div>
                        )}
                        
                        {/* Nested errors array */}
                        {(updateMutation.error as any).errors && Array.isArray((updateMutation.error as any).errors) && (
                          <div className="mt-3 bg-red-100 rounded p-3">
                            <p className="text-sm font-semibold text-red-800 mb-2">Multiple Errors:</p>
                            <ul className="text-sm text-red-700 space-y-1">
                              {(updateMutation.error as any).errors.map((err: any, idx: number) => (
                                <li key={idx} className="flex items-start gap-2">
                                  <span className="text-red-400">•</span>
                                  <span>{err.message || JSON.stringify(err)}</span>
                                </li>
                              ))}
                            </ul>
                          </div>
                        )}
                        
                        {/* Additional details */}
                        {(updateMutation.error as any).details && !(updateMutation.error as any).details.validationErrors && (
                          <details className="mt-3">
                            <summary className="text-sm text-red-600 cursor-pointer hover:text-red-800">
                              View technical details
                            </summary>
                            <pre className="mt-2 text-xs text-red-600 bg-red-100 rounded p-2 overflow-auto max-h-40">
                              {JSON.stringify((updateMutation.error as any).details, null, 2)}
                            </pre>
                          </details>
                        )}
                        
                        {/* Help URL if available */}
                        {(updateMutation.error as any).helpUrl && (
                          <a 
                            href={(updateMutation.error as any).helpUrl}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="text-sm text-red-600 hover:text-red-800 underline mt-2 inline-block"
                          >
                            Learn more about this error →
                          </a>
                        )}
                      </div>
                    </div>
                  </div>
                </HydrationBoundary>
              )}

              {/* Feature Showcase */}
              <HydrationBoundary priority="low" trigger="idle" id="feature-showcase">
                <div className="bg-blue-50 border border-blue-200 rounded-lg p-6">
                  <h3 className="text-sm font-semibold text-blue-900 mb-3">
                    🧬 Enzyme Features + Best Practices:
                  </h3>
                  <ul className="space-y-2 text-sm text-blue-800">
                    <li>✓ <strong>Hydration:</strong> Progressive hydration with priority-based loading</li>
                    <li>✓ <strong>DOM Context:</strong> DOMContextProvider for context tracking</li>
                    <li>✓ <strong>API Hooks:</strong> useApiRequest + useApiMutation for data fetching</li>
                    <li>✓ <strong>Autocomplete:</strong> useDebouncedValue for client search with 300ms debounce</li>
                    <li>✓ <strong>Smart Forms:</strong> Auto-populated client dropdown from API</li>
                    <li>✓ <strong>Routing:</strong> Dynamic case ID routing with back navigation</li>
                    <li>✓ <strong>React Hook Form:</strong> Form state management with useForm</li>
                    <li>✓ <strong>Zod Validation:</strong> Schema-based validation with real-time feedback</li>
                    <li>✓ <strong>Performance:</strong> Progressive loading with HydrationBoundary priorities</li>
                  </ul>
                </div>
              </HydrationBoundary>
            </form>
          </div>
        </div>
      </HydrationProvider>
    </DOMContextProvider>
  );
}


