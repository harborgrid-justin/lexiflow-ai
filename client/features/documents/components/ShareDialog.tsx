/**
 * ShareDialog Component
 * Dialog for sharing documents with permissions
 */

import React, { useState } from 'react';
import { Link, Mail, Copy, Check, Lock, Calendar } from 'lucide-react';
import type { SharePermissions } from '../api/documents.types';
import { Modal, Button, Input } from '../../../components/common';

interface ShareDialogProps {
  isOpen: boolean;
  onClose: () => void;
  onShare: (permissions: SharePermissions, options: ShareOptions) => void;
  documentTitle: string;
}

interface ShareOptions {
  expiresAt?: string;
  password?: string;
  shareWith?: string[];
}

export const ShareDialog: React.FC<ShareDialogProps> = ({
  isOpen,
  onClose,
  onShare,
  documentTitle,
}) => {
  const [permissions, setPermissions] = useState<SharePermissions>({
    view: true,
    edit: false,
    comment: true,
    share: false,
  });

  const [shareMethod, setShareMethod] = useState<'link' | 'email'>('link');
  const [emails, setEmails] = useState<string>('');
  const [expiresIn, setExpiresIn] = useState<string>('never');
  const [password, setPassword] = useState<string>('');
  const [shareLink, setShareLink] = useState<string>('');
  const [copied, setCopied] = useState(false);

  const handleGenerateLink = () => {
    const link = `https://lexiflow.com/share/${Math.random().toString(36).substring(7)}`;
    setShareLink(link);
  };

  const handleCopyLink = () => {
    navigator.clipboard.writeText(shareLink);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const handleShare = () => {
    const options: ShareOptions = {};

    if (expiresIn !== 'never') {
      const date = new Date();
      date.setDate(date.getDate() + parseInt(expiresIn));
      options.expiresAt = date.toISOString();
    }

    if (password) {
      options.password = password;
    }

    if (shareMethod === 'email' && emails) {
      options.shareWith = emails.split(',').map(e => e.trim()).filter(Boolean);
    }

    onShare(permissions, options);
  };

  return (
    <Modal isOpen={isOpen} onClose={onClose} title="Share Document" size="md">
      <div className="p-6 space-y-6">
        {/* Document Info */}
        <div className="p-3 bg-slate-50 rounded-lg">
          <p className="text-sm font-medium text-slate-900">{documentTitle}</p>
        </div>

        {/* Share Method */}
        <div>
          <label className="block text-sm font-medium text-slate-700 mb-2">Share via</label>
          <div className="flex gap-2">
            <button
              onClick={() => setShareMethod('link')}
              className={`flex-1 px-4 py-2 rounded-lg border-2 transition-colors ${
                shareMethod === 'link'
                  ? 'border-blue-500 bg-blue-50 text-blue-700'
                  : 'border-slate-200 hover:bg-slate-50'
              }`}
            >
              <Link className="h-4 w-4 mx-auto mb-1" />
              <span className="text-sm font-medium">Link</span>
            </button>
            <button
              onClick={() => setShareMethod('email')}
              className={`flex-1 px-4 py-2 rounded-lg border-2 transition-colors ${
                shareMethod === 'email'
                  ? 'border-blue-500 bg-blue-50 text-blue-700'
                  : 'border-slate-200 hover:bg-slate-50'
              }`}
            >
              <Mail className="h-4 w-4 mx-auto mb-1" />
              <span className="text-sm font-medium">Email</span>
            </button>
          </div>
        </div>

        {/* Email Input */}
        {shareMethod === 'email' && (
          <div>
            <label className="block text-sm font-medium text-slate-700 mb-1">
              Email addresses
            </label>
            <Input
              value={emails}
              onChange={(e) => setEmails(e.target.value)}
              placeholder="email1@example.com, email2@example.com"
            />
            <p className="text-xs text-slate-500 mt-1">Separate multiple emails with commas</p>
          </div>
        )}

        {/* Permissions */}
        <div>
          <label className="block text-sm font-medium text-slate-700 mb-2">Permissions</label>
          <div className="space-y-2">
            <label className="flex items-center gap-2">
              <input
                type="checkbox"
                checked={permissions.view}
                onChange={(e) =>
                  setPermissions({ ...permissions, view: e.target.checked })
                }
                className="w-4 h-4 rounded border-slate-300 text-blue-600 focus:ring-blue-500"
                disabled
              />
              <span className="text-sm text-slate-700">View (required)</span>
            </label>
            <label className="flex items-center gap-2">
              <input
                type="checkbox"
                checked={permissions.comment}
                onChange={(e) =>
                  setPermissions({ ...permissions, comment: e.target.checked })
                }
                className="w-4 h-4 rounded border-slate-300 text-blue-600 focus:ring-blue-500"
              />
              <span className="text-sm text-slate-700">Comment</span>
            </label>
            <label className="flex items-center gap-2">
              <input
                type="checkbox"
                checked={permissions.edit}
                onChange={(e) =>
                  setPermissions({ ...permissions, edit: e.target.checked })
                }
                className="w-4 h-4 rounded border-slate-300 text-blue-600 focus:ring-blue-500"
              />
              <span className="text-sm text-slate-700">Edit</span>
            </label>
            <label className="flex items-center gap-2">
              <input
                type="checkbox"
                checked={permissions.share}
                onChange={(e) =>
                  setPermissions({ ...permissions, share: e.target.checked })
                }
                className="w-4 h-4 rounded border-slate-300 text-blue-600 focus:ring-blue-500"
              />
              <span className="text-sm text-slate-700">Share with others</span>
            </label>
          </div>
        </div>

        {/* Expiration */}
        <div>
          <label className="block text-sm font-medium text-slate-700 mb-1">
            <Calendar className="h-4 w-4 inline mr-1" />
            Expires
          </label>
          <select
            value={expiresIn}
            onChange={(e) => setExpiresIn(e.target.value)}
            className="w-full px-3 py-2 border border-slate-300 rounded-md text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
          >
            <option value="never">Never</option>
            <option value="1">1 day</option>
            <option value="7">7 days</option>
            <option value="30">30 days</option>
            <option value="90">90 days</option>
          </select>
        </div>

        {/* Password Protection */}
        <div>
          <label className="block text-sm font-medium text-slate-700 mb-1">
            <Lock className="h-4 w-4 inline mr-1" />
            Password protection (optional)
          </label>
          <Input
            type="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            placeholder="Enter password"
          />
        </div>

        {/* Share Link (if generated) */}
        {shareMethod === 'link' && !shareLink && (
          <Button onClick={handleGenerateLink} variant="secondary" className="w-full">
            Generate Share Link
          </Button>
        )}

        {shareMethod === 'link' && shareLink && (
          <div>
            <label className="block text-sm font-medium text-slate-700 mb-1">Share Link</label>
            <div className="flex gap-2">
              <Input value={shareLink} readOnly className="flex-1" />
              <Button onClick={handleCopyLink} icon={copied ? Check : Copy} variant="secondary">
                {copied ? 'Copied!' : 'Copy'}
              </Button>
            </div>
          </div>
        )}

        {/* Actions */}
        <div className="flex items-center gap-2 pt-4 border-t border-slate-200">
          <Button onClick={handleShare} variant="primary" className="flex-1">
            {shareMethod === 'email' ? 'Send Email' : 'Create Share Link'}
          </Button>
          <Button onClick={onClose} variant="secondary">
            Cancel
          </Button>
        </div>
      </div>
    </Modal>
  );
};
