/**
 * AI Insight Card
 * Display AI-generated insights, suggestions, and analysis
 */

import React, { useState } from 'react';
import {
  Sparkles,
  FileText,
  Scale,
  Lightbulb,
  AlertTriangle,
  Target,
  ChevronDown,
  ChevronUp,
  ExternalLink,
} from 'lucide-react';
import type { AIInsight } from '../api/research.types';

interface AIInsightCardProps {
  insight: AIInsight;
  onViewSource?: (citationId: string) => void;
  collapsible?: boolean;
  defaultExpanded?: boolean;
}

export const AIInsightCard: React.FC<AIInsightCardProps> = ({
  insight,
  onViewSource,
  collapsible = false,
  defaultExpanded = true,
}) => {
  const [isExpanded, setIsExpanded] = useState(defaultExpanded);

  const getInsightConfig = (type: AIInsight['type']) => {
    const configs = {
      summary: {
        icon: FileText,
        color: 'text-blue-600',
        bg: 'bg-blue-50',
        border: 'border-blue-200',
        label: 'Summary',
      },
      key_point: {
        icon: Lightbulb,
        color: 'text-yellow-600',
        bg: 'bg-yellow-50',
        border: 'border-yellow-200',
        label: 'Key Point',
      },
      opposing_view: {
        icon: Scale,
        color: 'text-purple-600',
        bg: 'bg-purple-50',
        border: 'border-purple-200',
        label: 'Opposing View',
      },
      similar_case: {
        icon: FileText,
        color: 'text-green-600',
        bg: 'bg-green-50',
        border: 'border-green-200',
        label: 'Similar Case',
      },
      warning: {
        icon: AlertTriangle,
        color: 'text-red-600',
        bg: 'bg-red-50',
        border: 'border-red-200',
        label: 'Warning',
      },
      strategy: {
        icon: Target,
        color: 'text-indigo-600',
        bg: 'bg-indigo-50',
        border: 'border-indigo-200',
        label: 'Strategy',
      },
    };
    return configs[type] || configs.summary;
  };

  const config = getInsightConfig(insight.type);
  const Icon = config.icon;

  const getConfidenceColor = (confidence: number) => {
    if (confidence >= 0.8) return 'text-green-600';
    if (confidence >= 0.6) return 'text-yellow-600';
    return 'text-orange-600';
  };

  const getConfidenceLabel = (confidence: number) => {
    if (confidence >= 0.8) return 'High';
    if (confidence >= 0.6) return 'Medium';
    return 'Low';
  };

  return (
    <div className={`rounded-lg border ${config.border} ${config.bg} overflow-hidden`}>
      {/* Header */}
      <div className="p-4">
        <div className="flex items-start justify-between gap-3">
          <div className="flex items-start gap-3 flex-1 min-w-0">
            <div className={`p-2 rounded-lg bg-white ${config.color}`}>
              <Icon className="w-5 h-5" />
            </div>
            <div className="flex-1 min-w-0">
              <div className="flex items-center gap-2 mb-1">
                <h4 className="font-semibold text-gray-900 text-sm">
                  {insight.title}
                </h4>
                <div className="flex items-center gap-1">
                  <Sparkles className="w-3 h-3 text-purple-500" />
                  <span className="text-xs text-gray-500">AI</span>
                </div>
              </div>
              <div className="flex items-center gap-3 text-xs">
                <span className={`px-2 py-0.5 rounded-full ${config.bg} ${config.color} font-medium`}>
                  {config.label}
                </span>
                <span className={`font-medium ${getConfidenceColor(insight.confidence)}`}>
                  {getConfidenceLabel(insight.confidence)} Confidence
                </span>
                {insight.tags && insight.tags.length > 0 && (
                  <div className="flex items-center gap-1">
                    {insight.tags.slice(0, 2).map(tag => (
                      <span
                        key={tag}
                        className="px-2 py-0.5 bg-gray-100 text-gray-600 rounded-full"
                      >
                        {tag}
                      </span>
                    ))}
                  </div>
                )}
              </div>
            </div>
          </div>
          {collapsible && (
            <button
              onClick={() => setIsExpanded(!isExpanded)}
              className="p-1 hover:bg-white/50 rounded transition-colors"
            >
              {isExpanded ? (
                <ChevronUp className="w-5 h-5 text-gray-400" />
              ) : (
                <ChevronDown className="w-5 h-5 text-gray-400" />
              )}
            </button>
          )}
        </div>
      </div>

      {/* Content */}
      {isExpanded && (
        <div className="px-4 pb-4 space-y-4">
          {/* Main Content */}
          <div className="text-sm text-gray-700 leading-relaxed">
            {insight.content}
          </div>

          {/* Sources */}
          {insight.sources && insight.sources.length > 0 && (
            <div className="pt-3 border-t border-gray-200">
              <h5 className="text-xs font-semibold text-gray-700 mb-2">Sources</h5>
              <div className="space-y-2">
                {insight.sources.map(source => (
                  <div
                    key={source.id}
                    className="flex items-start gap-2 p-2 bg-white rounded hover:shadow-sm transition-shadow"
                  >
                    <Scale className="w-4 h-4 text-gray-400 mt-0.5 flex-shrink-0" />
                    <div className="flex-1 min-w-0">
                      <div className="text-xs font-medium text-gray-900 line-clamp-1">
                        {source.title || source.text}
                      </div>
                      <div className="text-xs text-gray-500 font-mono">
                        {source.citation}
                      </div>
                    </div>
                    {onViewSource && (
                      <button
                        onClick={() => onViewSource(source.id)}
                        className="p-1 hover:bg-gray-100 rounded transition-colors"
                      >
                        <ExternalLink className="w-3 h-3 text-gray-400" />
                      </button>
                    )}
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Confidence Meter */}
          <div className="pt-3 border-t border-gray-200">
            <div className="flex items-center justify-between text-xs mb-1">
              <span className="text-gray-600">AI Confidence</span>
              <span className={`font-medium ${getConfidenceColor(insight.confidence)}`}>
                {Math.round(insight.confidence * 100)}%
              </span>
            </div>
            <div className="h-1.5 bg-gray-200 rounded-full overflow-hidden">
              <div
                className={`h-full transition-all duration-300 ${
                  insight.confidence >= 0.8
                    ? 'bg-green-500'
                    : insight.confidence >= 0.6
                    ? 'bg-yellow-500'
                    : 'bg-orange-500'
                }`}
                style={{ width: `${insight.confidence * 100}%` }}
              />
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

/**
 * AI Insight List - Display multiple insights
 */
export const AIInsightList: React.FC<{
  insights: AIInsight[];
  onViewSource?: (citationId: string) => void;
  title?: string;
}> = ({ insights, onViewSource, title = 'AI Insights' }) => {
  if (insights.length === 0) {
    return null;
  }

  return (
    <div className="space-y-4">
      <div className="flex items-center gap-2">
        <Sparkles className="w-5 h-5 text-purple-500" />
        <h3 className="text-lg font-semibold text-gray-900">{title}</h3>
        <span className="px-2 py-0.5 bg-purple-100 text-purple-700 text-xs font-medium rounded-full">
          {insights.length}
        </span>
      </div>
      <div className="space-y-3">
        {insights.map(insight => (
          <AIInsightCard
            key={insight.id}
            insight={insight}
            onViewSource={onViewSource}
            collapsible={true}
            defaultExpanded={false}
          />
        ))}
      </div>
    </div>
  );
};
