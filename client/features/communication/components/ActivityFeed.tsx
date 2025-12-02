/**
 * ActivityFeed Component
 *
 * Global activity stream with filtering and real-time updates
 */

import React, { useState } from 'react';
import { Filter, RefreshCw, Calendar, User, Briefcase } from 'lucide-react';
import { ActivityType, ActivityFilters } from '../api/communication.types';
import { useActivityFeed } from '../api/notifications.api';
import { ActivityItem } from './ActivityItem';
import { LoadingSpinner } from '../../../components/common';

interface ActivityFeedProps {
  caseId?: string;
  userId?: string;
  showFilters?: boolean;
  maxHeight?: string;
  onActivityClick?: (activityId: string, resourceType: string, resourceId: string) => void;
  className?: string;
}

export const ActivityFeed: React.FC<ActivityFeedProps> = ({
  caseId,
  userId,
  showFilters = true,
  maxHeight = '600px',
  onActivityClick,
  className = '',
}) => {
  const [filters, setFilters] = useState<ActivityFilters>({
    caseId,
    actorId: userId,
  });
  const [showFilterPanel, setShowFilterPanel] = useState(false);
  const [page, setPage] = useState(1);
  const limit = 20;

  // Query
  const { data, isLoading, refetch, isFetching } = useActivityFeed(filters, { page, limit });

  const activities = data?.activities || [];
  const hasMore = data?.hasMore || false;

  const handleRefresh = () => {
    setPage(1);
    refetch();
  };

  const handleLoadMore = () => {
    setPage((prev) => prev + 1);
  };

  const handleFilterChange = (newFilters: Partial<ActivityFilters>) => {
    setFilters((prev) => ({ ...prev, ...newFilters }));
    setPage(1);
  };

  const hasActiveFilters = Boolean(
    filters.type?.length ||
    filters.actorId ||
    filters.caseId ||
    filters.dateFrom ||
    filters.dateTo
  );

  const activityTypeOptions: Array<{ value: ActivityType; label: string }> = [
    { value: 'case_created', label: 'Case Created' },
    { value: 'case_updated', label: 'Case Updated' },
    { value: 'case_status_changed', label: 'Status Changed' },
    { value: 'document_uploaded', label: 'Document Uploaded' },
    { value: 'document_updated', label: 'Document Updated' },
    { value: 'task_created', label: 'Task Created' },
    { value: 'task_completed', label: 'Task Completed' },
    { value: 'time_entry_created', label: 'Time Entry' },
    { value: 'comment_added', label: 'Comment Added' },
  ];

  return (
    <div className={`flex flex-col bg-white rounded-lg border border-slate-200 ${className}`}>
      {/* Header */}
      <div className="flex-shrink-0 p-4 border-b border-slate-200">
        <div className="flex items-center justify-between mb-3">
          <h3 className="text-lg font-semibold text-slate-900">Activity Feed</h3>
          <div className="flex items-center gap-2">
            <button
              onClick={handleRefresh}
              disabled={isFetching}
              className="p-2 text-slate-600 hover:bg-slate-100 rounded-lg transition-colors disabled:opacity-50"
              title="Refresh"
            >
              <RefreshCw className={`w-5 h-5 ${isFetching ? 'animate-spin' : ''}`} />
            </button>
            {showFilters && (
              <button
                onClick={() => setShowFilterPanel(!showFilterPanel)}
                className={`p-2 rounded-lg transition-colors relative ${
                  hasActiveFilters
                    ? 'bg-blue-100 text-blue-600'
                    : 'text-slate-600 hover:bg-slate-100'
                }`}
                title="Filters"
              >
                <Filter className="w-5 h-5" />
                {hasActiveFilters && (
                  <span className="absolute top-1 right-1 w-2 h-2 bg-blue-600 rounded-full" />
                )}
              </button>
            )}
          </div>
        </div>

        {/* Real-time indicator */}
        <div className="flex items-center gap-2 text-xs text-slate-500">
          <div className="w-2 h-2 bg-green-500 rounded-full animate-pulse" />
          <span>Live updates</span>
        </div>

        {/* Filter Panel */}
        {showFilterPanel && (
          <div className="mt-3 p-3 bg-slate-50 rounded-lg space-y-3">
            {/* Activity Type Filter */}
            <div className="space-y-2">
              <label className="text-xs font-medium text-slate-600">Activity Type</label>
              <div className="flex flex-wrap gap-1">
                {activityTypeOptions.map((option) => {
                  const isSelected = filters.type?.includes(option.value);
                  return (
                    <button
                      key={option.value}
                      onClick={() => {
                        const currentTypes = filters.type || [];
                        const newTypes = isSelected
                          ? currentTypes.filter((t) => t !== option.value)
                          : [...currentTypes, option.value];
                        handleFilterChange({ type: newTypes.length > 0 ? newTypes : undefined });
                      }}
                      className={`
                        px-2 py-1 text-xs rounded transition-colors
                        ${isSelected
                          ? 'bg-blue-600 text-white'
                          : 'bg-white text-slate-600 hover:bg-slate-100 border border-slate-200'
                        }
                      `}
                    >
                      {option.label}
                    </button>
                  );
                })}
              </div>
            </div>

            {/* Date Range Filter */}
            <div className="grid grid-cols-2 gap-2">
              <div className="space-y-1">
                <label className="text-xs font-medium text-slate-600">From Date</label>
                <input
                  type="date"
                  value={filters.dateFrom || ''}
                  onChange={(e) => handleFilterChange({ dateFrom: e.target.value || undefined })}
                  className="w-full px-2 py-1.5 text-sm border border-slate-300 rounded focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
              </div>
              <div className="space-y-1">
                <label className="text-xs font-medium text-slate-600">To Date</label>
                <input
                  type="date"
                  value={filters.dateTo || ''}
                  onChange={(e) => handleFilterChange({ dateTo: e.target.value || undefined })}
                  className="w-full px-2 py-1.5 text-sm border border-slate-300 rounded focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
              </div>
            </div>

            {/* Clear Filters */}
            {hasActiveFilters && (
              <button
                onClick={() => {
                  setFilters({ caseId, actorId: userId });
                  setPage(1);
                }}
                className="w-full px-3 py-1.5 text-sm text-blue-600 hover:bg-blue-50 rounded transition-colors"
              >
                Clear filters
              </button>
            )}
          </div>
        )}
      </div>

      {/* Activity List */}
      <div className="flex-1 overflow-y-auto" style={{ maxHeight }}>
        {isLoading && page === 1 ? (
          <div className="flex items-center justify-center h-32">
            <LoadingSpinner />
          </div>
        ) : activities.length === 0 ? (
          <div className="flex flex-col items-center justify-center h-48 px-4 text-center">
            <div className="w-16 h-16 bg-slate-100 rounded-full flex items-center justify-center mb-3">
              <Calendar className="w-8 h-8 text-slate-400" />
            </div>
            <p className="text-slate-600 mb-1">No activity yet</p>
            <p className="text-sm text-slate-500">
              {hasActiveFilters
                ? 'Try adjusting your filters'
                : 'Activity will appear here as it happens'
              }
            </p>
          </div>
        ) : (
          <>
            <div className="divide-y divide-slate-200">
              {activities.map((activity) => (
                <ActivityItem
                  key={activity.id}
                  activity={activity}
                  onClick={
                    onActivityClick
                      ? () => onActivityClick(activity.id, activity.resourceType, activity.resourceId)
                      : undefined
                  }
                />
              ))}
            </div>

            {/* Load More */}
            {hasMore && (
              <div className="p-4 text-center border-t border-slate-200">
                <button
                  onClick={handleLoadMore}
                  disabled={isFetching}
                  className="px-4 py-2 text-sm text-blue-600 hover:bg-blue-50 rounded-lg transition-colors disabled:opacity-50"
                >
                  {isFetching ? 'Loading...' : 'Load more'}
                </button>
              </div>
            )}
          </>
        )}
      </div>
    </div>
  );
};

interface ActivitySidebarProps {
  caseId?: string;
  className?: string;
}

/**
 * Compact activity sidebar for case details
 */
export const ActivitySidebar: React.FC<ActivitySidebarProps> = ({ caseId, className = '' }) => {
  const { data, isLoading } = useActivityFeed(
    { caseId },
    { page: 1, limit: 10 }
  );

  const activities = data?.activities || [];

  return (
    <div className={`bg-white rounded-lg border border-slate-200 ${className}`}>
      <div className="p-3 border-b border-slate-200">
        <h4 className="text-sm font-semibold text-slate-900">Recent Activity</h4>
      </div>

      <div className="divide-y divide-slate-200">
        {isLoading ? (
          <div className="flex items-center justify-center h-20">
            <LoadingSpinner />
          </div>
        ) : activities.length === 0 ? (
          <div className="p-4 text-center text-sm text-slate-500">
            No recent activity
          </div>
        ) : (
          activities.slice(0, 5).map((activity) => (
            <div key={activity.id} className="p-2">
              <p className="text-xs font-medium text-slate-900">{activity.title}</p>
              <p className="text-xs text-slate-500 mt-0.5">
                {activity.actorName} • {new Date(activity.createdAt).toLocaleDateString()}
              </p>
            </div>
          ))
        )}
      </div>

      {activities.length > 5 && (
        <div className="p-2 border-t border-slate-200">
          <button className="w-full text-xs text-blue-600 hover:text-blue-700 font-medium">
            View all activity
          </button>
        </div>
      )}
    </div>
  );
};
