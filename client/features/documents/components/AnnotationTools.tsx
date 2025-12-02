/**
 * AnnotationTools Component
 * Toolbar for document annotation tools
 */

import React from 'react';
import {
  Highlighter,
  MessageSquare,
  Square,
  ArrowRight,
  StickyNote,
  MousePointer,
  Undo,
  Redo,
  Trash2,
} from 'lucide-react';

export type AnnotationTool =
  | 'select'
  | 'highlight'
  | 'comment'
  | 'rectangle'
  | 'arrow'
  | 'note';

interface AnnotationToolsProps {
  activeTool: AnnotationTool;
  onToolChange: (tool: AnnotationTool) => void;
  onUndo?: () => void;
  onRedo?: () => void;
  onDelete?: () => void;
  canUndo?: boolean;
  canRedo?: boolean;
  hasSelection?: boolean;
}

export const AnnotationTools: React.FC<AnnotationToolsProps> = ({
  activeTool,
  onToolChange,
  onUndo,
  onRedo,
  onDelete,
  canUndo = false,
  canRedo = false,
  hasSelection = false,
}) => {
  const tools: Array<{ id: AnnotationTool; icon: React.ReactNode; label: string }> = [
    { id: 'select', icon: <MousePointer className="h-4 w-4" />, label: 'Select' },
    { id: 'highlight', icon: <Highlighter className="h-4 w-4" />, label: 'Highlight' },
    { id: 'comment', icon: <MessageSquare className="h-4 w-4" />, label: 'Comment' },
    { id: 'rectangle', icon: <Square className="h-4 w-4" />, label: 'Rectangle' },
    { id: 'arrow', icon: <ArrowRight className="h-4 w-4" />, label: 'Arrow' },
    { id: 'note', icon: <StickyNote className="h-4 w-4" />, label: 'Sticky Note' },
  ];

  return (
    <div className="flex items-center gap-2 p-2 bg-white border border-slate-200 rounded-lg shadow-sm">
      {/* Tool Buttons */}
      <div className="flex items-center gap-1 pr-2 border-r border-slate-200">
        {tools.map((tool) => (
          <button
            key={tool.id}
            onClick={() => onToolChange(tool.id)}
            className={`p-2 rounded transition-colors ${
              activeTool === tool.id
                ? 'bg-blue-100 text-blue-700'
                : 'hover:bg-slate-100 text-slate-600'
            }`}
            title={tool.label}
          >
            {tool.icon}
          </button>
        ))}
      </div>

      {/* History Controls */}
      <div className="flex items-center gap-1 pr-2 border-r border-slate-200">
        {onUndo && (
          <button
            onClick={onUndo}
            disabled={!canUndo}
            className={`p-2 rounded transition-colors ${
              canUndo
                ? 'hover:bg-slate-100 text-slate-600'
                : 'text-slate-300 cursor-not-allowed'
            }`}
            title="Undo"
          >
            <Undo className="h-4 w-4" />
          </button>
        )}
        {onRedo && (
          <button
            onClick={onRedo}
            disabled={!canRedo}
            className={`p-2 rounded transition-colors ${
              canRedo
                ? 'hover:bg-slate-100 text-slate-600'
                : 'text-slate-300 cursor-not-allowed'
            }`}
            title="Redo"
          >
            <Redo className="h-4 w-4" />
          </button>
        )}
      </div>

      {/* Delete Button */}
      {onDelete && (
        <button
          onClick={onDelete}
          disabled={!hasSelection}
          className={`p-2 rounded transition-colors ${
            hasSelection
              ? 'hover:bg-red-100 text-red-600'
              : 'text-slate-300 cursor-not-allowed'
          }`}
          title="Delete annotation"
        >
          <Trash2 className="h-4 w-4" />
        </button>
      )}

      {/* Color Picker (for highlights/shapes) */}
      {(activeTool === 'highlight' ||
        activeTool === 'rectangle' ||
        activeTool === 'arrow' ||
        activeTool === 'note') && (
        <div className="flex items-center gap-1 pl-2 border-l border-slate-200">
          {['#fef08a', '#86efac', '#7dd3fc', '#c084fc', '#fda4af'].map((color) => (
            <button
              key={color}
              className="w-6 h-6 rounded border-2 border-slate-200 hover:border-slate-400 transition-colors"
              style={{ backgroundColor: color }}
              title={`Color: ${color}`}
            />
          ))}
        </div>
      )}
    </div>
  );
};
