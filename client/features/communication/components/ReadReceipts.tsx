/**
 * ReadReceipts Component
 *
 * Displays read status and receipts for messages
 */

import React from 'react';
import { Check, CheckCheck } from 'lucide-react';
import { MessageStatus } from '../api/communication.types';

interface ReadReceiptsProps {
  status: MessageStatus;
  readBy?: Array<{ userId: string; readAt: string }>;
  showDetails?: boolean;
  className?: string;
}

export const ReadReceipts: React.FC<ReadReceiptsProps> = ({
  status,
  readBy = [],
  showDetails = false,
  className = '',
}) => {
  const renderIcon = () => {
    switch (status) {
      case 'sending':
        return (
          <div className="w-4 h-4 border-2 border-slate-300 border-t-slate-600 rounded-full animate-spin" />
        );
      case 'sent':
        return <Check className="w-4 h-4 text-slate-400" />;
      case 'delivered':
        return <CheckCheck className="w-4 h-4 text-slate-400" />;
      case 'read':
        return <CheckCheck className="w-4 h-4 text-blue-500" />;
      case 'failed':
        return (
          <svg className="w-4 h-4 text-red-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
          </svg>
        );
      default:
        return null;
    }
  };

  const getStatusText = () => {
    switch (status) {
      case 'sending':
        return 'Sending...';
      case 'sent':
        return 'Sent';
      case 'delivered':
        return 'Delivered';
      case 'read':
        return readBy.length > 0 ? `Read by ${readBy.length}` : 'Read';
      case 'failed':
        return 'Failed to send';
      default:
        return '';
    }
  };

  return (
    <div className={`inline-flex items-center gap-1.5 ${className}`} title={getStatusText()}>
      {renderIcon()}
      {showDetails && (
        <span className="text-xs text-slate-500">
          {getStatusText()}
        </span>
      )}
    </div>
  );
};

interface ReadReceiptListProps {
  readBy: Array<{
    userId: string;
    userName?: string;
    readAt: string;
  }>;
  className?: string;
}

/**
 * Detailed read receipt list showing who read and when
 */
export const ReadReceiptList: React.FC<ReadReceiptListProps> = ({ readBy, className = '' }) => {
  if (readBy.length === 0) {
    return (
      <div className={`text-sm text-slate-500 ${className}`}>
        No one has read this message yet
      </div>
    );
  }

  const formatReadTime = (timestamp: string) => {
    const date = new Date(timestamp);
    const now = new Date();
    const diffMs = now.getTime() - date.getTime();
    const diffMins = Math.floor(diffMs / 60000);

    if (diffMins < 1) return 'Just now';
    if (diffMins < 60) return `${diffMins}m ago`;
    if (diffMins < 1440) return `${Math.floor(diffMins / 60)}h ago`;
    return date.toLocaleDateString();
  };

  return (
    <div className={`space-y-2 ${className}`}>
      <div className="text-sm font-medium text-slate-700">
        Read by {readBy.length} {readBy.length === 1 ? 'person' : 'people'}
      </div>
      <ul className="space-y-1.5">
        {readBy.map((receipt) => (
          <li key={receipt.userId} className="flex items-center justify-between text-sm">
            <span className="text-slate-700">{receipt.userName || 'Unknown'}</span>
            <span className="text-slate-500">{formatReadTime(receipt.readAt)}</span>
          </li>
        ))}
      </ul>
    </div>
  );
};
