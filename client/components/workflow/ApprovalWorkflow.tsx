/**
 * ApprovalWorkflow Component
 *
 * ENZYME MIGRATION:
 * - Added useLatestCallback for async handlers to prevent stale closures
 * - Added useTrackEvent for analytics tracking of approval actions
 * - Added useIsMounted for safe async state updates
 * - Tracks: chain creation, approve/reject actions, comment additions, step navigation
 *
 * @migrated Agent 29, Wave 4
 */

import React, { useState, useEffect } from 'react';
import { UserCheck, CheckCircle, XCircle, Clock } from 'lucide-react';
import { useWorkflowEngine } from '../../hooks/useWorkflowEngine';
import { Button } from '../common/Button';
import { Card } from '../common/Card';
import type { ApprovalChain, ApprovalStep } from '../../types/workflow-engine';
import {
  useLatestCallback,
  useTrackEvent,
  useIsMounted
} from '../../enzyme';

interface ApprovalWorkflowProps {
  taskId: string;
  taskTitle: string;
  currentUserId: string;
  users: Array<{ id: string; name: string; role: string }>;
  onUpdate?: () => void;
}

export const ApprovalWorkflow: React.FC<ApprovalWorkflowProps> = ({
  taskId,
  _taskTitle,
  currentUserId,
  users,
  onUpdate
}) => {
  const {
    getApprovalChain,
    createApprovalChain,
    processApproval,
    loading
  } = useWorkflowEngine();

  const trackEvent = useTrackEvent();
  const isMounted = useIsMounted();

  const [approvalChain, setApprovalChain] = useState<ApprovalChain | null>(null);
  const [selectedApprovers, setSelectedApprovers] = useState<string[]>([]);
  const [isCreating, setIsCreating] = useState(false);
  const [comments, setComments] = useState('');

  const loadApprovalChain = useLatestCallback(async () => {
    trackEvent('approval_chain_load_started', {
      taskId,
      source: 'approval_workflow'
    });

    const chain = await getApprovalChain(taskId);

    if (!isMounted()) return;

    if (chain) {
      setApprovalChain(chain);
      trackEvent('approval_chain_loaded', {
        taskId,
        chainId: chain.id,
        status: chain.status,
        currentStep: chain.currentStep,
        totalSteps: chain.steps.length
      });
    } else {
      trackEvent('approval_chain_not_found', {
        taskId
      });
    }
  });

  useEffect(() => {
    loadApprovalChain();
  }, [loadApprovalChain]);

  const handleCreateChain = useLatestCallback(async () => {
    if (selectedApprovers.length > 0) {
      trackEvent('approval_chain_create_started', {
        taskId,
        approversCount: selectedApprovers.length,
        approvers: selectedApprovers
      });

      try {
        await createApprovalChain(taskId, selectedApprovers);

        if (!isMounted()) return;

        await loadApprovalChain();
        setIsCreating(false);
        setSelectedApprovers([]);
        onUpdate?.();

        trackEvent('approval_chain_created', {
          taskId,
          approversCount: selectedApprovers.length
        });
      } catch (error) {
        if (!isMounted()) return;

        trackEvent('approval_chain_create_failed', {
          taskId,
          error: error instanceof Error ? error.message : 'Unknown error',
          approversCount: selectedApprovers.length
        });
      }
    }
  });

  const handleApprove = useLatestCallback(async (action: 'approve' | 'reject') => {
    if (approvalChain) {
      trackEvent('approval_action_started', {
        taskId,
        chainId: approvalChain.id,
        action,
        currentUserId,
        currentStep: approvalChain.currentStep,
        hasComments: comments.length > 0,
        commentsLength: comments.length
      });

      try {
        await processApproval(taskId, currentUserId, action, comments);

        if (!isMounted()) return;

        await loadApprovalChain();
        setComments('');
        onUpdate?.();

        trackEvent('approval_action_completed', {
          taskId,
          chainId: approvalChain.id,
          action,
          currentUserId,
          hadComments: comments.length > 0
        });
      } catch (error) {
        if (!isMounted()) return;

        trackEvent('approval_action_failed', {
          taskId,
          chainId: approvalChain.id,
          action,
          error: error instanceof Error ? error.message : 'Unknown error'
        });
      }
    }
  });

  const getStepIcon = (step: ApprovalStep) => {
    switch (step.status) {
      case 'approved':
        return <CheckCircle className="h-5 w-5 text-green-600" />;
      case 'rejected':
        return <XCircle className="h-5 w-5 text-red-600" />;
      default:
        return <Clock className="h-5 w-5 text-slate-400" />;
    }
  };

  const currentStep = approvalChain?.steps[approvalChain.currentStep];
  const isCurrentApprover = currentStep?.approverId === currentUserId;

  return (
    <Card>
      <div className="p-4 border-b border-slate-200">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <UserCheck className="h-5 w-5 text-slate-500" />
            <h3 className="font-semibold text-slate-900">Approval Workflow</h3>
          </div>
          {!approvalChain && !isCreating && (
            <Button
              variant="secondary"
              size="sm"
              onClick={() => {
                trackEvent('approval_chain_creation_initiated', {
                  taskId,
                  usersCount: users.length
                });
                setIsCreating(true);
              }}
            >
              Create Approval Chain
            </Button>
          )}
        </div>
      </div>

      <div className="p-4 space-y-4">
        {/* Existing Chain */}
        {approvalChain && (
          <div className="space-y-4">
            <div className={`p-3 rounded-lg ${
              approvalChain.status === 'approved'
                ? 'bg-green-50 border border-green-200'
                : approvalChain.status === 'rejected'
                ? 'bg-red-50 border border-red-200'
                : 'bg-blue-50 border border-blue-200'
            }`}>
              <p className="text-sm font-medium">
                Status: {approvalChain.status?.charAt(0).toUpperCase() + approvalChain.status?.slice(1) || 'Unknown'}
              </p>
              <p className="text-xs mt-1 opacity-75">
                Step {approvalChain.currentStep + 1} of {approvalChain.steps.length}
              </p>
            </div>

            <div className="space-y-2">
              {approvalChain.steps.map((step, index) => {
                const user = users.find(u => u.id === step.approverId);
                const isCurrent = index === approvalChain.currentStep;
                
                return (
                  <div
                    key={step.id}
                    className={`p-3 rounded-lg border ${
                      isCurrent ? 'border-blue-300 bg-blue-50' : 'border-slate-200'
                    }`}
                  >
                    <div className="flex items-center gap-3">
                      {getStepIcon(step)}
                      <div className="flex-1">
                        <div className="flex items-center justify-between">
                          <span className="text-sm font-medium">
                            {user?.name || step.approverId}
                          </span>
                          <span className="text-xs text-slate-500">
                            Step {step.order}
                          </span>
                        </div>
                        {step.approverRole && (
                          <p className="text-xs text-slate-500">{step.approverRole}</p>
                        )}
                        {step.comments && (
                          <div className="mt-2 p-2 bg-white rounded border border-slate-200">
                            <p className="text-xs text-slate-600">{step.comments}</p>
                          </div>
                        )}
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>

            {/* Action Buttons for Current Approver */}
            {isCurrentApprover && approvalChain.status === 'pending' && (
              <div className="space-y-3 pt-4 border-t border-slate-200">
                <div>
                  <label className="block text-sm font-medium text-slate-700 mb-2">
                    Comments (optional)
                  </label>
                  <textarea
                    value={comments}
                    onChange={(e) => {
                      const newComments = e.target.value;
                      setComments(newComments);

                      // Track when user adds first comment
                      if (comments.length === 0 && newComments.length > 0) {
                        trackEvent('approval_comment_started', {
                          taskId,
                          chainId: approvalChain?.id,
                          currentStep: approvalChain?.currentStep
                        });
                      }
                    }}
                    onBlur={() => {
                      if (comments.length > 0) {
                        trackEvent('approval_comment_added', {
                          taskId,
                          chainId: approvalChain?.id,
                          commentsLength: comments.length,
                          currentStep: approvalChain?.currentStep
                        });
                      }
                    }}
                    className="w-full px-3 py-2 border border-slate-300 rounded-lg text-sm"
                    rows={3}
                    placeholder="Add your comments..."
                  />
                </div>
                <div className="flex gap-2">
                  <Button
                    variant="primary"
                    size="sm"
                    onClick={() => handleApprove('approve')}
                    disabled={loading}
                    icon={CheckCircle}
                    className="flex-1"
                  >
                    Approve
                  </Button>
                  <Button
                    variant="error"
                    size="sm"
                    onClick={() => handleApprove('reject')}
                    disabled={loading}
                    icon={XCircle}
                    className="flex-1"
                  >
                    Reject
                  </Button>
                </div>
              </div>
            )}
          </div>
        )}

        {/* Create Chain */}
        {isCreating && (
          <div className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-slate-700 mb-2">
                Select Approvers (in order)
              </label>
              <div className="space-y-1 max-h-64 overflow-y-auto border rounded-lg p-2">
                {users.map(user => (
                  <div
                    key={user.id}
                    className="flex items-center gap-2 p-2 rounded hover:bg-slate-50 cursor-pointer"
                    onClick={() => {
                      const isSelected = selectedApprovers.includes(user.id);
                      trackEvent('approval_approver_toggled', {
                        taskId,
                        userId: user.id,
                        userName: user.name,
                        userRole: user.role,
                        action: isSelected ? 'removed' : 'added',
                        currentApproversCount: selectedApprovers.length,
                        newPosition: isSelected ? null : selectedApprovers.length + 1
                      });

                      setSelectedApprovers(prev =>
                        prev.includes(user.id)
                          ? prev.filter(id => id !== user.id)
                          : [...prev, user.id]
                      );
                    }}
                  >
                    <input
                      type="checkbox"
                      checked={selectedApprovers.includes(user.id)}
                      onChange={() => {}}
                      className="h-4 w-4 text-blue-600 rounded"
                    />
                    <div className="flex-1">
                      <p className="text-sm font-medium">{user.name}</p>
                      <p className="text-xs text-slate-500">{user.role}</p>
                    </div>
                    {selectedApprovers.includes(user.id) && (
                      <span className="text-xs bg-blue-100 text-blue-800 px-2 py-0.5 rounded">
                        #{selectedApprovers.indexOf(user.id) + 1}
                      </span>
                    )}
                  </div>
                ))}
              </div>
            </div>

            <div className="flex gap-2">
              <Button
                variant="secondary"
                size="sm"
                onClick={() => {
                  trackEvent('approval_chain_creation_cancelled', {
                    taskId,
                    approversSelected: selectedApprovers.length
                  });
                  setIsCreating(false);
                  setSelectedApprovers([]);
                }}
              >
                Cancel
              </Button>
              <Button
                variant="primary"
                size="sm"
                onClick={handleCreateChain}
                disabled={loading || selectedApprovers.length === 0}
              >
                Create Chain
              </Button>
            </div>
          </div>
        )}
      </div>
    </Card>
  );
};
