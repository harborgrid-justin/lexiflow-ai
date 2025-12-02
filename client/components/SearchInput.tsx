import * as React from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Search, X, Loader2 } from 'lucide-react';
import { cn } from '../lib/utils';

export interface SearchSuggestion {
  id: string;
  label: string;
  value: string;
  category?: string;
  icon?: React.ReactNode;
}

export interface SearchInputProps
  extends Omit<React.InputHTMLAttributes<HTMLInputElement>, 'onChange'> {
  value: string;
  onChange: (value: string) => void;
  onSearch?: (value: string) => void;
  suggestions?: SearchSuggestion[];
  loading?: boolean;
  onSuggestionSelect?: (suggestion: SearchSuggestion) => void;
  showSuggestions?: boolean;
  containerClassName?: string;
}

const SearchInput = React.forwardRef<HTMLInputElement, SearchInputProps>(
  (
    {
      className,
      value,
      onChange,
      onSearch,
      suggestions = [],
      loading = false,
      onSuggestionSelect,
      showSuggestions = true,
      containerClassName,
      placeholder = 'Search...',
      ...props
    },
    ref
  ) => {
    const [isFocused, setIsFocused] = React.useState(false);
    const [selectedIndex, setSelectedIndex] = React.useState(-1);
    const inputRef = React.useRef<HTMLInputElement>(null);
    const containerRef = React.useRef<HTMLDivElement>(null);

    React.useImperativeHandle(ref, () => inputRef.current!);

    const showDropdown = isFocused && showSuggestions && suggestions.length > 0;

    React.useEffect(() => {
      const handleClickOutside = (event: MouseEvent) => {
        if (
          containerRef.current &&
          !containerRef.current.contains(event.target as Node)
        ) {
          setIsFocused(false);
        }
      };

      document.addEventListener('mousedown', handleClickOutside);
      return () => document.removeEventListener('mousedown', handleClickOutside);
    }, []);

    React.useEffect(() => {
      setSelectedIndex(-1);
    }, [suggestions]);

    const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
      if (!showDropdown) {
        if (e.key === 'Enter' && onSearch) {
          onSearch(value);
        }
        return;
      }

      switch (e.key) {
        case 'ArrowDown':
          e.preventDefault();
          setSelectedIndex((prev) =>
            prev < suggestions.length - 1 ? prev + 1 : 0
          );
          break;
        case 'ArrowUp':
          e.preventDefault();
          setSelectedIndex((prev) =>
            prev > 0 ? prev - 1 : suggestions.length - 1
          );
          break;
        case 'Enter':
          e.preventDefault();
          if (selectedIndex >= 0) {
            onSuggestionSelect?.(suggestions[selectedIndex]);
            setIsFocused(false);
          } else if (onSearch) {
            onSearch(value);
          }
          break;
        case 'Escape':
          e.preventDefault();
          setIsFocused(false);
          inputRef.current?.blur();
          break;
      }
    };

    const handleClear = () => {
      onChange('');
      inputRef.current?.focus();
    };

    const handleSuggestionClick = (suggestion: SearchSuggestion) => {
      onSuggestionSelect?.(suggestion);
      setIsFocused(false);
    };

    // Group suggestions by category
    const groupedSuggestions = React.useMemo(() => {
      const groups: Record<string, SearchSuggestion[]> = {};
      suggestions.forEach((suggestion) => {
        const category = suggestion.category || 'default';
        if (!groups[category]) groups[category] = [];
        groups[category].push(suggestion);
      });
      return groups;
    }, [suggestions]);

    return (
      <div ref={containerRef} className={cn('relative w-full', containerClassName)}>
        <div className="relative">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
          <input
            ref={inputRef}
            type="text"
            className={cn(
              'flex h-10 w-full rounded-md border border-input bg-background',
              'pl-10 pr-10 py-2 text-sm',
              'ring-offset-background placeholder:text-muted-foreground',
              'focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2',
              'disabled:cursor-not-allowed disabled:opacity-50',
              'transition-all duration-200',
              className
            )}
            value={value}
            onChange={(e) => onChange(e.target.value)}
            onFocus={() => setIsFocused(true)}
            onKeyDown={handleKeyDown}
            placeholder={placeholder}
            {...props}
          />
          <div className="absolute right-3 top-1/2 -translate-y-1/2 flex items-center gap-2">
            {loading && <Loader2 className="h-4 w-4 animate-spin text-muted-foreground" />}
            {value && !loading && (
              <button
                type="button"
                className="text-muted-foreground hover:text-foreground transition-colors"
                onClick={handleClear}
              >
                <X className="h-4 w-4" />
              </button>
            )}
          </div>
        </div>

        <AnimatePresence>
          {showDropdown && (
            <motion.div
              className={cn(
                'absolute z-50 mt-2 w-full rounded-md border border-border',
                'bg-popover shadow-lg max-h-[300px] overflow-y-auto'
              )}
              initial={{ opacity: 0, y: -10 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -10 }}
              transition={{ duration: 0.15 }}
            >
              <div className="p-1">
                {Object.entries(groupedSuggestions).map(([category, items]) => (
                  <div key={category}>
                    {category !== 'default' && (
                      <div className="px-2 py-1.5 text-xs font-semibold text-muted-foreground">
                        {category}
                      </div>
                    )}
                    {items.map((suggestion, index) => {
                      const globalIndex = suggestions.indexOf(suggestion);
                      const isSelected = globalIndex === selectedIndex;

                      return (
                        <button
                          key={suggestion.id}
                          type="button"
                          className={cn(
                            'flex w-full items-center gap-3 rounded-sm px-2 py-1.5',
                            'text-sm transition-colors cursor-pointer',
                            'hover:bg-accent hover:text-accent-foreground',
                            isSelected && 'bg-accent text-accent-foreground'
                          )}
                          onClick={() => handleSuggestionClick(suggestion)}
                          onMouseEnter={() => setSelectedIndex(globalIndex)}
                        >
                          {suggestion.icon && (
                            <span className="flex h-4 w-4 items-center justify-center flex-shrink-0">
                              {suggestion.icon}
                            </span>
                          )}
                          <span className="flex-1 text-left">{suggestion.label}</span>
                        </button>
                      );
                    })}
                  </div>
                ))}
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    );
  }
);

SearchInput.displayName = 'SearchInput';

export { SearchInput };
