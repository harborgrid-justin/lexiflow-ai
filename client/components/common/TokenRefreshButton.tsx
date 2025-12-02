/**
 * Token Refresh Button Component
 *
 * A floating button that allows developers to manually refresh their
 * authentication token without affecting other user settings. This is
 * particularly useful when:
 * - Switching between development servers
 * - Debugging CORS issues
 * - Testing token expiry scenarios
 *
 * The button is only shown when FEATURE_FLAGS.SHOW_TOKEN_REFRESH_BUTTON is enabled.
 *
 * @see /config/app.config.ts for feature flag configuration
 */

import React, { useState } from 'react';
import { RefreshCw, Check, AlertCircle, X } from 'lucide-react';
import { useAuth } from '@/contexts/AuthContext';
import { FEATURE_FLAGS } from '@/config';

interface TokenRefreshButtonProps {
  /** Position on screen */
  position?: 'bottom-right' | 'bottom-left' | 'top-right' | 'top-left';
  /** Additional CSS classes */
  className?: string;
}

type RefreshState = 'idle' | 'loading' | 'success' | 'error';

export const TokenRefreshButton: React.FC<TokenRefreshButtonProps> = ({
  position = 'bottom-right',
  className = '',
}) => {
  const { refreshToken, isDevBypassMode, error: authError, clearError } = useAuth();
  const [state, setState] = useState<RefreshState>('idle');
  const [isExpanded, setIsExpanded] = useState(false);

  // Don't render if feature flag is disabled
  if (!FEATURE_FLAGS.SHOW_TOKEN_REFRESH_BUTTON) {
    return null;
  }

  const positionClasses: Record<typeof position, string> = {
    'bottom-right': 'bottom-4 right-4',
    'bottom-left': 'bottom-4 left-4',
    'top-right': 'top-4 right-4',
    'top-left': 'top-4 left-4',
  };

  const handleRefresh = async () => {
    setState('loading');
    clearError();

    try {
      const success = await refreshToken();
      setState(success ? 'success' : 'error');

      // Reset to idle after showing result
      setTimeout(() => {
        setState('idle');
      }, 2000);
    } catch {
      setState('error');
      setTimeout(() => setState('idle'), 3000);
    }
  };

  const getIcon = () => {
    switch (state) {
      case 'loading':
        return <RefreshCw className="w-5 h-5 animate-spin" />;
      case 'success':
        return <Check className="w-5 h-5" />;
      case 'error':
        return <AlertCircle className="w-5 h-5" />;
      default:
        return <RefreshCw className="w-5 h-5" />;
    }
  };

  const getButtonColor = () => {
    switch (state) {
      case 'success':
        return 'bg-green-600 hover:bg-green-700';
      case 'error':
        return 'bg-red-600 hover:bg-red-700';
      default:
        return isDevBypassMode
          ? 'bg-purple-600 hover:bg-purple-700'
          : 'bg-blue-600 hover:bg-blue-700';
    }
  };

  const getMessage = () => {
    if (isDevBypassMode) return 'Dev Bypass Active';
    switch (state) {
      case 'loading':
        return 'Refreshing...';
      case 'success':
        return 'Token Refreshed!';
      case 'error':
        return authError || 'Refresh Failed';
      default:
        return 'Refresh Token';
    }
  };

  return (
    <div
      className={`fixed ${positionClasses[position]} z-50 flex flex-col items-end gap-2 ${className}`}
    >
      {/* Expanded panel with info */}
      {isExpanded && (
        <div className="bg-white rounded-lg shadow-lg border border-slate-200 p-4 mb-2 w-64 animate-in fade-in slide-in-from-bottom-2 duration-200">
          <div className="flex items-center justify-between mb-3">
            <h3 className="text-sm font-semibold text-slate-800">Token Management</h3>
            <button
              onClick={() => setIsExpanded(false)}
              className="p-1 hover:bg-slate-100 rounded"
            >
              <X className="w-4 h-4 text-slate-500" />
            </button>
          </div>

          {isDevBypassMode && (
            <div className="bg-purple-50 border border-purple-200 rounded-md p-2 mb-3">
              <p className="text-xs text-purple-700">
                🔓 <strong>Dev Bypass Mode</strong>
                <br />
                Login is bypassed. You're logged in as a dev admin user.
              </p>
            </div>
          )}

          <div className="space-y-2">
            <button
              onClick={handleRefresh}
              disabled={state === 'loading'}
              className={`w-full px-3 py-2 rounded-md text-white text-sm font-medium transition-colors ${getButtonColor()} disabled:opacity-50`}
            >
              <span className="flex items-center justify-center gap-2">
                {getIcon()}
                {getMessage()}
              </span>
            </button>

            {authError && state === 'error' && (
              <p className="text-xs text-red-600 mt-2">{authError}</p>
            )}

            <p className="text-xs text-slate-500 mt-2">
              Refreshes your auth token without logging you out or affecting your settings.
            </p>
          </div>
        </div>
      )}

      {/* Main floating button */}
      <button
        onClick={() => setIsExpanded(!isExpanded)}
        className={`w-12 h-12 rounded-full shadow-lg transition-all duration-200 flex items-center justify-center text-white ${getButtonColor()} hover:scale-105 active:scale-95`}
        title={getMessage()}
      >
        {getIcon()}
      </button>

      {/* Dev bypass indicator */}
      {isDevBypassMode && !isExpanded && (
        <div className="absolute -top-1 -right-1 w-4 h-4 bg-purple-500 rounded-full border-2 border-white animate-pulse" />
      )}
    </div>
  );
};

export default TokenRefreshButton;
