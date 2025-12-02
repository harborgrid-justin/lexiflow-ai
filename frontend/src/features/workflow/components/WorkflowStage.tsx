/**
 * WorkflowStage Component
 * Visual representation of a workflow stage node
 */

import React from 'react';
import { WorkflowStage as WorkflowStageType } from '../types';

interface WorkflowStageProps {
  stage: WorkflowStageType;
  isSelected: boolean;
  onSelect: () => void;
  onDragStart: (e: React.DragEvent) => void;
  onDragEnd: (e: React.DragEvent) => void;
  onDrag: (e: React.DragEvent) => void;
}

export const WorkflowStage: React.FC<WorkflowStageProps> = ({
  stage,
  isSelected,
  onSelect,
  onDragStart,
  onDragEnd,
  onDrag,
}) => {
  const hasApproval = stage.requiresApproval;
  const hasConditional = stage.conditionalBranching && stage.conditionalBranching.length > 0;

  return (
    <div
      className={`absolute cursor-move`}
      style={{
        left: stage.position?.x || 0,
        top: stage.position?.y || 0,
        width: '240px',
      }}
      draggable
      onDragStart={onDragStart}
      onDragEnd={onDragEnd}
      onDrag={onDrag}
      onClick={(e) => {
        e.stopPropagation();
        onSelect();
      }}
    >
      <div
        className={`bg-white rounded-lg shadow-md border-2 transition-all ${
          isSelected ? 'border-blue-500 shadow-lg' : 'border-gray-300'
        }`}
      >
        {/* Stage Header */}
        <div className="bg-gradient-to-r from-blue-500 to-blue-600 text-white px-4 py-3 rounded-t-lg">
          <div className="flex items-center justify-between">
            <div className="flex-1">
              <div className="flex items-center gap-2 mb-1">
                {hasApproval && <span title="Requires Approval">✓</span>}
                {hasConditional && <span title="Has Conditional Branching">⚡</span>}
                <h3 className="font-semibold text-sm">{stage.name}</h3>
              </div>
              <p className="text-xs text-blue-100">Stage {stage.order + 1}</p>
            </div>
            <div className="flex items-center gap-1">
              {/* Connection Points */}
              <div className="w-3 h-3 bg-white rounded-full border-2 border-blue-300" />
            </div>
          </div>
        </div>

        {/* Stage Body */}
        <div className="px-4 py-3 space-y-2">
          {/* Description */}
          {stage.description && (
            <p className="text-xs text-gray-600 line-clamp-2">{stage.description}</p>
          )}

          {/* Assignee Rule */}
          <div className="flex items-center gap-2 text-xs">
            <span className="text-gray-500">👤</span>
            <span className="text-gray-700">
              {stage.assigneeRule.type === 'specific_user'
                ? 'Specific User'
                : stage.assigneeRule.type === 'role_based'
                ? `Role: ${stage.assigneeRule.role}`
                : stage.assigneeRule.type === 'round_robin'
                ? 'Round Robin'
                : stage.assigneeRule.type === 'case_attorney'
                ? 'Case Attorney'
                : 'Manual Assignment'}
            </span>
          </div>

          {/* Due Date Rule */}
          <div className="flex items-center gap-2 text-xs">
            <span className="text-gray-500">📅</span>
            <span className="text-gray-700">
              {stage.dueDateRule.type === 'fixed_date'
                ? 'Fixed Date'
                : stage.dueDateRule.type === 'days_from_start'
                ? `${stage.dueDateRule.daysOffset} days from start`
                : stage.dueDateRule.type === 'days_from_previous'
                ? `${stage.dueDateRule.daysOffset} days from previous`
                : stage.dueDateRule.businessDaysOnly
                ? 'Business Days'
                : 'Flexible'}
            </span>
          </div>

          {/* Required Fields */}
          {stage.requiredFields && stage.requiredFields.length > 0 && (
            <div className="flex items-center gap-2 text-xs">
              <span className="text-gray-500">⚠️</span>
              <span className="text-gray-700">{stage.requiredFields.length} required fields</span>
            </div>
          )}

          {/* Approval Chain */}
          {hasApproval && stage.approvalChain && (
            <div className="flex items-center gap-2 text-xs">
              <span className="text-gray-500">✓</span>
              <span className="text-gray-700">{stage.approvalChain.length} approvers</span>
            </div>
          )}
        </div>

        {/* Stage Footer */}
        <div className="border-t px-4 py-2 bg-gray-50 rounded-b-lg">
          <div className="flex items-center justify-between text-xs text-gray-500">
            <span>
              {stage.nextStages?.length || 0} connection{(stage.nextStages?.length || 0) !== 1 ? 's' : ''}
            </span>
            {stage.status && (
              <span
                className={`px-2 py-0.5 rounded-full text-[10px] font-medium ${
                  stage.status === 'Completed'
                    ? 'bg-green-100 text-green-700'
                    : stage.status === 'Active'
                    ? 'bg-blue-100 text-blue-700'
                    : stage.status === 'Skipped'
                    ? 'bg-gray-100 text-gray-700'
                    : 'bg-yellow-100 text-yellow-700'
                }`}
              >
                {stage.status}
              </span>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};
