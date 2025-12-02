/**
 * AdvancedEditor Component
 *
 * ENZYME MIGRATION - Agent 22 (Wave 3)
 * Migration Date: December 2, 2025
 *
 * Enzyme Features Implemented:
 * 1. Analytics Tracking (useTrackEvent):
 *    - editor_selection_made: When user selects text for AI editing
 *    - editor_ai_edit_started: When AI edit operation begins
 *    - editor_ai_edit_completed: When AI edit operation completes
 *    - editor_saved: When document content is saved
 *
 * 2. Stable Callbacks (useLatestCallback):
 *    - handleAiEdit: AI-powered text refinement with tracking
 *    - handleSelection: Text selection handler with tracking
 *    - handleSave: Document save handler with tracking
 *
 * 3. Safe Async Operations (useIsMounted):
 *    - Prevents state updates after component unmount in async AI edit
 *
 * Performance Characteristics:
 * - ContentEditable rich text editor with AI-powered refinement
 * - Inline toolbar for text selection with AI prompt input
 * - Word count statistics tracking
 *
 * @see /client/enzyme/MIGRATION_SCRATCHPAD.md
 * @see /client/enzyme/LESSONS_LEARNED.md
 */

import React, { useState, useRef, useEffect } from 'react';
import { Wand2, RotateCcw } from 'lucide-react';
import { OpenAIService } from '../services/openAIService';
import { EditorToolbar } from './common/EditorToolbar';
import { useTrackEvent, useLatestCallback, useIsMounted } from '../enzyme';

interface AdvancedEditorProps {
  initialContent: string;
  onSave?: (content: string) => void;
  placeholder?: string;
  onInsertRequest?: () => void;
}

export const AdvancedEditor: React.FC<AdvancedEditorProps> = ({ initialContent, onSave, placeholder, _onInsertRequest }) => {
  // Enzyme hooks
  const trackEvent = useTrackEvent();
  const isMounted = useIsMounted();

  // Component state
  const editorRef = useRef<HTMLDivElement>(null);
  const [showAiToolbar, setShowAiToolbar] = useState(false);
  const [selectionRange, setSelectionRange] = useState<Range | null>(null);
  const [aiPrompt, setAiPrompt] = useState('');
  const [isAiLoading, setIsAiLoading] = useState(false);
  const [wordCount, setWordCount] = useState(0);

  const updateStats = () => {
    if (editorRef.current) {
        const text = editorRef.current.innerText || '';
        setWordCount(text.trim().split(/\s+/).filter(w => w.length > 0).length);
    }
  };

  useEffect(() => {
    if (editorRef.current && initialContent && !editorRef.current.innerHTML) {
      editorRef.current.innerHTML = initialContent.includes('<') ? initialContent : `<p>${initialContent.replace(/\n/g, '<br/>')}</p>`;
      // eslint-disable-next-line react-hooks/set-state-in-effect
      updateStats();
    }
  }, [initialContent]);

  const execCmd = (command: string, value: string | undefined = undefined) => {
    document.execCommand(command, false, value);
    editorRef.current?.focus();
    updateStats();
  };

  const handleSelection = useLatestCallback(() => {
    const selection = window.getSelection();
    if (selection && selection.rangeCount > 0 && !selection.isCollapsed) {
      const range = selection.getRangeAt(0);
      const container = editorRef.current;
      if (container && container.contains(range.commonAncestorContainer)) {
        setSelectionRange(range);
        setShowAiToolbar(true);
        // Track text selection for AI editing
        trackEvent('editor_selection_made', {
          selectedTextLength: range.toString().length,
          hasContent: range.toString().trim().length > 0
        });
      }
    } else {
      setShowAiToolbar(false);
    }
    updateStats();
  });

  const handleAiEdit = useLatestCallback(async () => {
    if (!selectionRange || !aiPrompt) return;

    const selectedText = selectionRange.toString();
    const promptText = aiPrompt;

    // Track AI edit started
    trackEvent('editor_ai_edit_started', {
      selectedTextLength: selectedText.length,
      promptLength: promptText.length,
      prompt: promptText
    });

    setIsAiLoading(true);

    try {
      const refinedText = await OpenAIService.generateDraft(
        `Rewrite this legal text: "${selectedText}". Instruction: ${promptText}`,
        'Text Fragment'
      );

      // Only update state if component is still mounted
      if (!isMounted()) return;

      selectionRange.deleteContents();
      const newNode = document.createTextNode(refinedText);
      selectionRange.insertNode(newNode);

      window.getSelection()?.removeAllRanges();
      setIsAiLoading(false);
      setShowAiToolbar(false);
      setAiPrompt('');
      updateStats();

      // Track AI edit completed
      trackEvent('editor_ai_edit_completed', {
        originalLength: selectedText.length,
        refinedLength: refinedText.length,
        prompt: promptText
      });
    } catch (error) {
      // Only update state if component is still mounted
      if (!isMounted()) return;

      setIsAiLoading(false);
      console.error('AI edit failed:', error);
    }
  });

  // Handler for saving with tracking
  const handleSave = useLatestCallback(() => {
    const content = editorRef.current?.innerHTML || '';

    // Track save event
    trackEvent('editor_saved', {
      contentLength: content.length,
      wordCount: wordCount
    });

    if (onSave) {
      onSave(content);
    }
  });

  useEffect(() => {
  }, [initialContent]);

  return (
    <div className="flex flex-col h-full border border-slate-200 rounded-lg bg-white shadow-sm overflow-hidden">
      <EditorToolbar
        wordCount={wordCount}
        onCmd={execCmd}
        onSave={onSave ? handleSave : undefined}
      />

      <div className="relative flex-1 bg-white overflow-hidden group">
         <div 
            ref={editorRef}
            className="h-full w-full p-8 outline-none overflow-y-auto prose prose-slate max-w-none focus:bg-slate-50/10 transition-colors"
            contentEditable
            onMouseUp={handleSelection}
            onKeyUp={handleSelection}
            onInput={updateStats}
            spellCheck={false}
         />
         
         {!wordCount && placeholder && (
            <div className="absolute top-8 left-8 text-slate-300 pointer-events-none text-lg">
                {placeholder}
            </div>
         )}
         
         {showAiToolbar && (
            <div className="absolute bottom-6 left-1/2 -translate-x-1/2 w-96 bg-white rounded-lg shadow-2xl border border-slate-200 p-2 flex gap-2 animate-in fade-in slide-in-from-bottom-2 z-20">
                <div className="flex-1 relative">
                    <Wand2 className="absolute left-2.5 top-1/2 -translate-y-1/2 h-4 w-4 text-purple-600"/>
                    <input 
                        className="w-full pl-9 pr-3 py-2 text-sm border border-slate-200 rounded bg-slate-50 focus:bg-white focus:ring-2 focus:ring-purple-500 focus:border-transparent outline-none transition-all"
                        placeholder="Ask AI to rewrite selection..."
                        value={aiPrompt}
                        onChange={(e) => setAiPrompt(e.target.value)}
                        onKeyDown={(e) => e.key === 'Enter' && handleAiEdit()}
                        autoFocus
                    />
                </div>
                <button 
                    onClick={handleAiEdit}
                    disabled={isAiLoading}
                    className="px-4 py-2 bg-gradient-to-r from-purple-600 to-indigo-600 text-white rounded text-xs font-bold hover:shadow-lg disabled:opacity-50 transition-all flex items-center"
                >
                    {isAiLoading ? <RotateCcw className="h-3 w-3 animate-spin"/> : 'Refine'}
                </button>
            </div>
         )}
      </div>
    </div>
  );
};
