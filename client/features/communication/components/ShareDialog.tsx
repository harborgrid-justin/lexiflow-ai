/**
 * ShareDialog Component
 *
 * Secure document/case sharing with permission controls and expiration
 */

import React, { useState } from 'react';
import {
  X,
  Share2,
  Mail,
  Link as LinkIcon,
  Shield,
  Calendar,
  Eye,
  MessageSquare,
  Edit,
  Copy,
  Check,
  Settings,
} from 'lucide-react';
import {
  SharePermission,
  ShareRecipientType,
  ShareRecipient,
  ShareSettings,
  CreateShareInput,
} from '../api/communication.types';
import { Modal, Button } from '../../../components/common';

interface ShareDialogProps {
  isOpen: boolean;
  onClose: () => void;
  resourceType: 'case' | 'document' | 'folder';
  resourceId: string;
  resourceName: string;
  onShare: (input: CreateShareInput) => Promise<void>;
  className?: string;
}

export const ShareDialog: React.FC<ShareDialogProps> = ({
  isOpen,
  onClose,
  resourceType,
  resourceId,
  resourceName,
  onShare,
  className = '',
}) => {
  const [recipients, setRecipients] = useState<Array<{
    email: string;
    permission: SharePermission;
    type: ShareRecipientType;
  }>>([]);
  const [newRecipientEmail, setNewRecipientEmail] = useState('');
  const [newRecipientType, setNewRecipientType] = useState<ShareRecipientType>('internal');
  const [newRecipientPermission, setNewRecipientPermission] = useState<SharePermission>('view');
  const [showAdvanced, setShowAdvanced] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [shareLink, setShareLink] = useState<string | null>(null);
  const [linkCopied, setLinkCopied] = useState(false);

  // Advanced settings
  const [settings, setSettings] = useState<Partial<ShareSettings>>({
    requireLogin: true,
    requirePassword: false,
    trackAccess: true,
    notifyOwner: true,
    allowDownload: true,
    allowPrint: true,
    allowCopy: true,
    applyWatermark: false,
  });

  const handleAddRecipient = () => {
    const email = newRecipientEmail.trim();
    if (!email || !email.includes('@')) return;

    // Check if already added
    if (recipients.some((r) => r.email === email)) {
      alert('This recipient has already been added');
      return;
    }

    setRecipients([
      ...recipients,
      {
        email,
        permission: newRecipientPermission,
        type: newRecipientType,
      },
    ]);

    // Reset form
    setNewRecipientEmail('');
  };

  const handleRemoveRecipient = (email: string) => {
    setRecipients(recipients.filter((r) => r.email !== email));
  };

  const handleUpdateRecipient = (email: string, permission: SharePermission) => {
    setRecipients(
      recipients.map((r) => (r.email === email ? { ...r, permission } : r))
    );
  };

  const handleShare = async () => {
    if (recipients.length === 0) {
      alert('Please add at least one recipient');
      return;
    }

    setIsSubmitting(true);
    try {
      await onShare({
        resourceType,
        resourceId,
        recipients,
        settings,
      });

      // Generate mock share link (in real implementation, this would come from the API)
      const mockLink = `${window.location.origin}/shared/${resourceType}/${resourceId}`;
      setShareLink(mockLink);
    } catch (error) {
      console.error('Failed to share:', error);
      alert('Failed to share. Please try again.');
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleCopyLink = () => {
    if (shareLink) {
      navigator.clipboard.writeText(shareLink);
      setLinkCopied(true);
      setTimeout(() => setLinkCopied(false), 2000);
    }
  };

  const handleClose = () => {
    // Reset state
    setRecipients([]);
    setNewRecipientEmail('');
    setShareLink(null);
    setShowAdvanced(false);
    onClose();
  };

  const permissionOptions: Array<{ value: SharePermission; label: string; description: string; icon: React.ComponentType<{ className?: string }> }> = [
    {
      value: 'view',
      label: 'View Only',
      description: 'Can view but not edit or comment',
      icon: Eye,
    },
    {
      value: 'comment',
      label: 'Comment',
      description: 'Can view and add comments',
      icon: MessageSquare,
    },
    {
      value: 'edit',
      label: 'Edit',
      description: 'Can view, comment, and edit',
      icon: Edit,
    },
  ];

  return (
    <Modal isOpen={isOpen} onClose={handleClose} className={className}>
      <div className="w-full max-w-2xl">
        {/* Header */}
        <div className="flex items-center justify-between p-6 border-b border-slate-200">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 bg-blue-100 rounded-lg flex items-center justify-center">
              <Share2 className="w-5 h-5 text-blue-600" />
            </div>
            <div>
              <h2 className="text-lg font-semibold text-slate-900">
                Share {resourceType}
              </h2>
              <p className="text-sm text-slate-600">{resourceName}</p>
            </div>
          </div>
          <button
            onClick={handleClose}
            className="p-2 text-slate-400 hover:text-slate-600 hover:bg-slate-100 rounded-lg transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Content */}
        <div className="p-6 space-y-6 max-h-[600px] overflow-y-auto">
          {!shareLink ? (
            <>
              {/* Add Recipients */}
              <div className="space-y-3">
                <label className="block text-sm font-medium text-slate-700">
                  Add people
                </label>
                <div className="flex gap-2">
                  <input
                    type="email"
                    placeholder="Email address"
                    value={newRecipientEmail}
                    onChange={(e) => setNewRecipientEmail(e.target.value)}
                    onKeyPress={(e) => e.key === 'Enter' && handleAddRecipient()}
                    className="flex-1 px-3 py-2 border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                  />
                  <select
                    value={newRecipientType}
                    onChange={(e) => setNewRecipientType(e.target.value as ShareRecipientType)}
                    className="px-3 py-2 border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                  >
                    <option value="internal">Internal</option>
                    <option value="external_counsel">External Counsel</option>
                    <option value="client">Client</option>
                  </select>
                  <select
                    value={newRecipientPermission}
                    onChange={(e) => setNewRecipientPermission(e.target.value as SharePermission)}
                    className="px-3 py-2 border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                  >
                    <option value="view">View</option>
                    <option value="comment">Comment</option>
                    <option value="edit">Edit</option>
                  </select>
                  <Button onClick={handleAddRecipient} variant="primary">
                    Add
                  </Button>
                </div>
              </div>

              {/* Recipients List */}
              {recipients.length > 0 && (
                <div className="space-y-2">
                  <label className="block text-sm font-medium text-slate-700">
                    People with access
                  </label>
                  <div className="space-y-2">
                    {recipients.map((recipient) => (
                      <div
                        key={recipient.email}
                        className="flex items-center justify-between p-3 border border-slate-200 rounded-lg"
                      >
                        <div className="flex-1">
                          <p className="text-sm font-medium text-slate-900">
                            {recipient.email}
                          </p>
                          <p className="text-xs text-slate-500 capitalize">
                            {recipient.type.replace('_', ' ')}
                          </p>
                        </div>
                        <div className="flex items-center gap-2">
                          <select
                            value={recipient.permission}
                            onChange={(e) =>
                              handleUpdateRecipient(recipient.email, e.target.value as SharePermission)
                            }
                            className="px-2 py-1 text-sm border border-slate-300 rounded focus:outline-none focus:ring-2 focus:ring-blue-500"
                          >
                            <option value="view">View</option>
                            <option value="comment">Comment</option>
                            <option value="edit">Edit</option>
                          </select>
                          <button
                            onClick={() => handleRemoveRecipient(recipient.email)}
                            className="p-1.5 text-slate-400 hover:text-red-600 hover:bg-red-50 rounded transition-colors"
                          >
                            <X className="w-4 h-4" />
                          </button>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {/* Advanced Settings */}
              <div>
                <button
                  onClick={() => setShowAdvanced(!showAdvanced)}
                  className="flex items-center gap-2 text-sm text-blue-600 hover:text-blue-700 font-medium"
                >
                  <Settings className="w-4 h-4" />
                  <span>Advanced settings</span>
                  <svg
                    className={`w-4 h-4 transition-transform ${showAdvanced ? 'rotate-180' : ''}`}
                    fill="none"
                    viewBox="0 0 24 24"
                    stroke="currentColor"
                  >
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                  </svg>
                </button>

                {showAdvanced && (
                  <div className="mt-4 space-y-3 p-4 bg-slate-50 rounded-lg">
                    <label className="flex items-center gap-2 cursor-pointer">
                      <input
                        type="checkbox"
                        checked={settings.requireLogin}
                        onChange={(e) => setSettings({ ...settings, requireLogin: e.target.checked })}
                        className="rounded border-slate-300 text-blue-600 focus:ring-blue-500"
                      />
                      <div>
                        <p className="text-sm font-medium text-slate-900">Require login</p>
                        <p className="text-xs text-slate-500">Recipients must sign in to access</p>
                      </div>
                    </label>

                    <label className="flex items-center gap-2 cursor-pointer">
                      <input
                        type="checkbox"
                        checked={settings.trackAccess}
                        onChange={(e) => setSettings({ ...settings, trackAccess: e.target.checked })}
                        className="rounded border-slate-300 text-blue-600 focus:ring-blue-500"
                      />
                      <div>
                        <p className="text-sm font-medium text-slate-900">Track access</p>
                        <p className="text-xs text-slate-500">Log who views this item</p>
                      </div>
                    </label>

                    <label className="flex items-center gap-2 cursor-pointer">
                      <input
                        type="checkbox"
                        checked={settings.allowDownload}
                        onChange={(e) => setSettings({ ...settings, allowDownload: e.target.checked })}
                        className="rounded border-slate-300 text-blue-600 focus:ring-blue-500"
                      />
                      <div>
                        <p className="text-sm font-medium text-slate-900">Allow downloads</p>
                        <p className="text-xs text-slate-500">Recipients can download files</p>
                      </div>
                    </label>

                    <label className="flex items-center gap-2 cursor-pointer">
                      <input
                        type="checkbox"
                        checked={settings.applyWatermark}
                        onChange={(e) => setSettings({ ...settings, applyWatermark: e.target.checked })}
                        className="rounded border-slate-300 text-blue-600 focus:ring-blue-500"
                      />
                      <div>
                        <p className="text-sm font-medium text-slate-900">Apply watermark</p>
                        <p className="text-xs text-slate-500">Add watermark to documents</p>
                      </div>
                    </label>

                    <div className="space-y-1">
                      <label className="text-sm font-medium text-slate-900">Expiration date</label>
                      <input
                        type="date"
                        value={settings.expiresAt || ''}
                        onChange={(e) => setSettings({ ...settings, expiresAt: e.target.value })}
                        className="w-full px-3 py-2 text-sm border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                      />
                    </div>
                  </div>
                )}
              </div>
            </>
          ) : (
            /* Share Link Success */
            <div className="space-y-4">
              <div className="flex items-center gap-3 p-4 bg-green-50 border border-green-200 rounded-lg">
                <div className="w-10 h-10 bg-green-100 rounded-full flex items-center justify-center">
                  <Check className="w-6 h-6 text-green-600" />
                </div>
                <div>
                  <p className="text-sm font-medium text-green-900">
                    Shared successfully!
                  </p>
                  <p className="text-xs text-green-700">
                    {recipients.length} {recipients.length === 1 ? 'person' : 'people'} will receive access
                  </p>
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium text-slate-700 mb-2">
                  Share link
                </label>
                <div className="flex gap-2">
                  <input
                    type="text"
                    value={shareLink}
                    readOnly
                    className="flex-1 px-3 py-2 bg-slate-50 border border-slate-300 rounded-lg text-sm"
                  />
                  <Button onClick={handleCopyLink} variant="secondary">
                    {linkCopied ? (
                      <>
                        <Check className="w-4 h-4 mr-2" />
                        Copied
                      </>
                    ) : (
                      <>
                        <Copy className="w-4 h-4 mr-2" />
                        Copy
                      </>
                    )}
                  </Button>
                </div>
              </div>
            </div>
          )}
        </div>

        {/* Footer */}
        <div className="flex items-center justify-between p-6 border-t border-slate-200">
          <div className="flex items-center gap-2 text-sm text-slate-600">
            <Shield className="w-4 h-4" />
            <span>Secure sharing with access logging</span>
          </div>
          <div className="flex gap-3">
            <Button onClick={handleClose} variant="secondary">
              Cancel
            </Button>
            {!shareLink && (
              <Button
                onClick={handleShare}
                variant="primary"
                disabled={recipients.length === 0 || isSubmitting}
              >
                {isSubmitting ? 'Sharing...' : 'Share'}
              </Button>
            )}
            {shareLink && (
              <Button onClick={handleClose} variant="primary">
                Done
              </Button>
            )}
          </div>
        </div>
      </div>
    </Modal>
  );
};
