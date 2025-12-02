/**
 * WorkflowBuilderPage Component
 * Visual workflow template builder with drag-and-drop
 */

import React, { useState } from 'react';
import { WorkflowCanvas } from '../components/WorkflowCanvas';
import { useWorkflowBuilderStore } from '../store/workflow.store';
import { useCreateWorkflow, useUpdateWorkflow } from '../api/workflows.api';
import {
  AssigneeRuleType,
  DueDateRuleType,
  WorkflowStage as WorkflowStageType,
} from '../types';

export const WorkflowBuilderPage: React.FC = () => {
  const {
    stages,
    selectedStageId,
    templateMetadata,
    setTemplateMetadata,
    addStage,
    updateStage,
    removeStage,
    clearCanvas,
  } = useWorkflowBuilderStore();

  const createWorkflow = useCreateWorkflow();
  const updateWorkflow = useUpdateWorkflow();
  const [isSaving, setIsSaving] = useState(false);

  const selectedStage = stages.find((s) => s.id === selectedStageId);

  // Stage Templates
  const stageTemplates = [
    {
      name: 'Review & Approval',
      description: 'Review stage with approval gate',
      assigneeRule: { type: 'role_based' as AssigneeRuleType, role: 'Attorney' },
      dueDateRule: { type: 'days_from_previous' as DueDateRuleType, daysOffset: 3 },
      requiresApproval: true,
    },
    {
      name: 'Document Preparation',
      description: 'Prepare required documents',
      assigneeRule: { type: 'role_based' as AssigneeRuleType, role: 'Paralegal' },
      dueDateRule: { type: 'days_from_previous' as DueDateRuleType, daysOffset: 5 },
    },
    {
      name: 'Client Communication',
      description: 'Communicate with client',
      assigneeRule: { type: 'case_attorney' as AssigneeRuleType },
      dueDateRule: { type: 'days_from_start' as DueDateRuleType, daysOffset: 2 },
    },
    {
      name: 'Filing',
      description: 'File documents with court',
      assigneeRule: { type: 'specific_user' as AssigneeRuleType },
      dueDateRule: { type: 'fixed_date' as DueDateRuleType },
    },
  ];

  const handleAddStage = (template: typeof stageTemplates[0]) => {
    addStage({
      workflowId: 'temp',
      name: template.name,
      description: template.description,
      order: stages.length,
      position: {
        x: 100 + (stages.length % 3) * 300,
        y: 100 + Math.floor(stages.length / 3) * 250,
      },
      assigneeRule: template.assigneeRule,
      dueDateRule: template.dueDateRule,
      requiresApproval: template.requiresApproval,
    } as Omit<WorkflowStageType, 'id'>);
  };

  const handleSaveWorkflow = async () => {
    if (!templateMetadata.name.trim()) {
      alert('Please enter a workflow name');
      return;
    }

    if (stages.length === 0) {
      alert('Please add at least one stage to the workflow');
      return;
    }

    setIsSaving(true);
    try {
      await createWorkflow.mutateAsync({
        name: templateMetadata.name,
        description: templateMetadata.description,
        category: templateMetadata.category || 'General',
        stages: stages,
        isActive: true,
        isPublic: false,
        createdBy: 'current-user-id', // This should come from auth context
      });

      alert('Workflow saved successfully!');
      clearCanvas();
    } catch (error) {
      console.error('Failed to save workflow:', error);
      alert('Failed to save workflow');
    } finally {
      setIsSaving(false);
    }
  };

  return (
    <div className="h-screen flex flex-col bg-gray-50">
      {/* Header */}
      <div className="flex-shrink-0 bg-white border-b">
        <div className="px-6 py-4">
          <div className="flex items-center justify-between">
            <div className="flex-1 max-w-xl">
              <input
                type="text"
                placeholder="Workflow Name"
                value={templateMetadata.name}
                onChange={(e) => setTemplateMetadata({ name: e.target.value })}
                className="text-2xl font-bold text-gray-900 border-none focus:ring-0 focus:outline-none w-full px-0"
              />
              <input
                type="text"
                placeholder="Description (optional)"
                value={templateMetadata.description}
                onChange={(e) => setTemplateMetadata({ description: e.target.value })}
                className="text-sm text-gray-600 border-none focus:ring-0 focus:outline-none w-full px-0 mt-1"
              />
            </div>

            <div className="flex items-center gap-3">
              <button
                onClick={clearCanvas}
                className="px-4 py-2 text-gray-700 hover:text-gray-900 font-medium text-sm"
              >
                Clear All
              </button>
              <button
                onClick={handleSaveWorkflow}
                disabled={isSaving || !templateMetadata.name.trim() || stages.length === 0}
                className="px-6 py-2 bg-blue-600 text-white rounded-lg font-medium hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed"
              >
                {isSaving ? 'Saving...' : 'Save Workflow'}
              </button>
            </div>
          </div>

          {/* Metadata */}
          <div className="flex items-center gap-4 mt-3 text-sm text-gray-500">
            <select
              value={templateMetadata.category}
              onChange={(e) => setTemplateMetadata({ category: e.target.value })}
              className="px-3 py-1.5 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 text-sm"
            >
              <option value="">Select Category</option>
              <option value="Litigation">Litigation</option>
              <option value="Corporate">Corporate</option>
              <option value="Real Estate">Real Estate</option>
              <option value="IP">Intellectual Property</option>
              <option value="General">General</option>
            </select>
            <span>•</span>
            <span>{stages.length} stage{stages.length !== 1 ? 's' : ''}</span>
          </div>
        </div>
      </div>

      {/* Main Content */}
      <div className="flex-1 flex overflow-hidden">
        {/* Stage Library Sidebar */}
        <div className="w-80 flex-shrink-0 bg-white border-r overflow-y-auto">
          <div className="p-4">
            <h3 className="font-semibold text-gray-900 mb-4">Stage Library</h3>

            {/* Stage Templates */}
            <div className="space-y-3">
              {stageTemplates.map((template, idx) => (
                <div
                  key={idx}
                  className="border border-gray-200 rounded-lg p-3 hover:border-blue-500 hover:shadow-md transition-all cursor-pointer"
                  onClick={() => handleAddStage(template)}
                >
                  <div className="flex items-start justify-between mb-2">
                    <h4 className="font-medium text-sm text-gray-900">{template.name}</h4>
                    <button className="text-blue-600 hover:text-blue-700 text-xs font-medium">
                      + Add
                    </button>
                  </div>
                  <p className="text-xs text-gray-600 mb-2">{template.description}</p>
                  <div className="flex flex-wrap gap-1">
                    {template.requiresApproval && (
                      <span className="inline-block px-2 py-0.5 bg-purple-100 text-purple-700 rounded text-[10px] font-medium">
                        Approval
                      </span>
                    )}
                    <span className="inline-block px-2 py-0.5 bg-blue-100 text-blue-700 rounded text-[10px] font-medium">
                      {template.assigneeRule.type.replace('_', ' ')}
                    </span>
                  </div>
                </div>
              ))}
            </div>

            {/* Instructions */}
            <div className="mt-6 p-4 bg-blue-50 rounded-lg">
              <h4 className="font-medium text-sm text-blue-900 mb-2">💡 Tips</h4>
              <ul className="text-xs text-blue-800 space-y-1">
                <li>• Click a stage template to add it to canvas</li>
                <li>• Drag stages to reposition them</li>
                <li>• Click a stage to edit its properties</li>
                <li>• Use Ctrl + Scroll to zoom</li>
              </ul>
            </div>
          </div>
        </div>

        {/* Canvas */}
        <div className="flex-1 relative">
          <WorkflowCanvas />
        </div>

        {/* Properties Panel */}
        {selectedStage && (
          <div className="w-96 flex-shrink-0 bg-white border-l overflow-y-auto">
            <div className="p-6">
              <div className="flex items-center justify-between mb-6">
                <h3 className="font-semibold text-gray-900">Stage Properties</h3>
                <button
                  onClick={() => removeStage(selectedStage.id)}
                  className="text-red-600 hover:text-red-700 text-sm font-medium"
                >
                  Delete
                </button>
              </div>

              {/* Stage Name */}
              <div className="mb-4">
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Stage Name
                </label>
                <input
                  type="text"
                  value={selectedStage.name}
                  onChange={(e) =>
                    updateStage(selectedStage.id, { name: e.target.value })
                  }
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                />
              </div>

              {/* Description */}
              <div className="mb-4">
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Description
                </label>
                <textarea
                  value={selectedStage.description || ''}
                  onChange={(e) =>
                    updateStage(selectedStage.id, { description: e.target.value })
                  }
                  rows={3}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 resize-none"
                />
              </div>

              {/* Assignee Rule */}
              <div className="mb-4">
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Assignment Rule
                </label>
                <select
                  value={selectedStage.assigneeRule.type}
                  onChange={(e) =>
                    updateStage(selectedStage.id, {
                      assigneeRule: { type: e.target.value as AssigneeRuleType },
                    })
                  }
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                >
                  <option value="specific_user">Specific User</option>
                  <option value="role_based">Role Based</option>
                  <option value="round_robin">Round Robin</option>
                  <option value="case_attorney">Case Attorney</option>
                  <option value="manual">Manual Assignment</option>
                </select>
              </div>

              {/* Due Date Rule */}
              <div className="mb-4">
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Due Date Rule
                </label>
                <select
                  value={selectedStage.dueDateRule.type}
                  onChange={(e) =>
                    updateStage(selectedStage.id, {
                      dueDateRule: { type: e.target.value as DueDateRuleType },
                    })
                  }
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                >
                  <option value="fixed_date">Fixed Date</option>
                  <option value="days_from_start">Days from Workflow Start</option>
                  <option value="days_from_previous">Days from Previous Stage</option>
                  <option value="business_days">Business Days</option>
                </select>

                {(selectedStage.dueDateRule.type === 'days_from_start' ||
                  selectedStage.dueDateRule.type === 'days_from_previous') && (
                  <input
                    type="number"
                    value={selectedStage.dueDateRule.daysOffset || 0}
                    onChange={(e) =>
                      updateStage(selectedStage.id, {
                        dueDateRule: {
                          ...selectedStage.dueDateRule,
                          daysOffset: parseInt(e.target.value),
                        },
                      })
                    }
                    className="w-full mt-2 px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                    placeholder="Number of days"
                    min="0"
                  />
                )}
              </div>

              {/* Approval Required */}
              <div className="mb-4">
                <label className="flex items-center gap-2 cursor-pointer">
                  <input
                    type="checkbox"
                    checked={selectedStage.requiresApproval || false}
                    onChange={(e) =>
                      updateStage(selectedStage.id, { requiresApproval: e.target.checked })
                    }
                    className="rounded border-gray-300 text-blue-600 focus:ring-blue-500"
                  />
                  <span className="text-sm font-medium text-gray-700">
                    Requires Approval
                  </span>
                </label>
              </div>

              {/* Required Fields */}
              <div className="mb-4">
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Required Fields (comma-separated)
                </label>
                <input
                  type="text"
                  value={selectedStage.requiredFields?.join(', ') || ''}
                  onChange={(e) => {
                    const fields = e.target.value.split(',').map((f) => f.trim()).filter(Boolean);
                    updateStage(selectedStage.id, { requiredFields: fields });
                  }}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                  placeholder="e.g., client_signature, document_upload"
                />
              </div>

              {/* Stage Info */}
              <div className="mt-6 pt-6 border-t">
                <div className="space-y-2 text-sm">
                  <div className="flex justify-between">
                    <span className="text-gray-500">Stage Order:</span>
                    <span className="font-medium text-gray-900">{selectedStage.order + 1}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-gray-500">Connections:</span>
                    <span className="font-medium text-gray-900">
                      {selectedStage.nextStages?.length || 0} outgoing
                    </span>
                  </div>
                </div>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};
