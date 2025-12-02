import * as React from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Search } from 'lucide-react';
import { cn } from '../../lib/utils';

export interface CommandItem {
  id: string;
  label: string;
  value: string;
  icon?: React.ReactNode;
  keywords?: string[];
  onSelect?: () => void;
  group?: string;
}

export interface CommandProps {
  open?: boolean;
  onOpenChange?: (open: boolean) => void;
  items: CommandItem[];
  placeholder?: string;
  emptyMessage?: string;
  className?: string;
}

const Command: React.FC<CommandProps> = ({
  open = false,
  onOpenChange,
  items,
  placeholder = 'Search...',
  emptyMessage = 'No results found.',
  className,
}) => {
  const [search, setSearch] = React.useState('');
  const [selectedIndex, setSelectedIndex] = React.useState(0);
  const inputRef = React.useRef<HTMLInputElement>(null);

  const filteredItems = React.useMemo(() => {
    if (!search) return items;

    const searchLower = search.toLowerCase();
    return items.filter(
      (item) =>
        item.label.toLowerCase().includes(searchLower) ||
        item.value.toLowerCase().includes(searchLower) ||
        item.keywords?.some((keyword) =>
          keyword.toLowerCase().includes(searchLower)
        )
    );
  }, [items, search]);

  const groupedItems = React.useMemo(() => {
    const groups: Record<string, CommandItem[]> = {};
    filteredItems.forEach((item) => {
      const group = item.group || 'default';
      if (!groups[group]) groups[group] = [];
      groups[group].push(item);
    });
    return groups;
  }, [filteredItems]);

  React.useEffect(() => {
    setSelectedIndex(0);
  }, [search]);

  React.useEffect(() => {
    if (open) {
      inputRef.current?.focus();
      setSearch('');
      setSelectedIndex(0);
    }
  }, [open]);

  React.useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (!open) {
        // Open command palette with Cmd+K or Ctrl+K
        if ((e.metaKey || e.ctrlKey) && e.key === 'k') {
          e.preventDefault();
          onOpenChange?.(true);
        }
        return;
      }

      switch (e.key) {
        case 'Escape':
          e.preventDefault();
          onOpenChange?.(false);
          break;
        case 'ArrowDown':
          e.preventDefault();
          setSelectedIndex((prev) =>
            prev < filteredItems.length - 1 ? prev + 1 : 0
          );
          break;
        case 'ArrowUp':
          e.preventDefault();
          setSelectedIndex((prev) =>
            prev > 0 ? prev - 1 : filteredItems.length - 1
          );
          break;
        case 'Enter':
          e.preventDefault();
          const selectedItem = filteredItems[selectedIndex];
          if (selectedItem) {
            selectedItem.onSelect?.();
            onOpenChange?.(false);
          }
          break;
      }
    };

    document.addEventListener('keydown', handleKeyDown);
    return () => document.removeEventListener('keydown', handleKeyDown);
  }, [open, filteredItems, selectedIndex, onOpenChange]);

  const handleBackdropClick = () => {
    onOpenChange?.(false);
  };

  const handleItemClick = (item: CommandItem) => {
    item.onSelect?.();
    onOpenChange?.(false);
  };

  return (
    <AnimatePresence>
      {open && (
        <>
          {/* Backdrop */}
          <motion.div
            className="fixed inset-0 z-[var(--z-modal-backdrop)] bg-background/80 backdrop-blur-sm"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.15 }}
            onClick={handleBackdropClick}
          />

          {/* Command Palette */}
          <div className="fixed inset-0 z-[var(--z-modal)] flex items-start justify-center pt-[20vh] px-4">
            <motion.div
              className={cn(
                'w-full max-w-2xl rounded-lg border border-border',
                'bg-popover shadow-2xl overflow-hidden',
                className
              )}
              initial={{ opacity: 0, scale: 0.95, y: -20 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.95, y: -20 }}
              transition={{ duration: 0.15 }}
              onClick={(e) => e.stopPropagation()}
            >
              {/* Search Input */}
              <div className="flex items-center border-b border-border px-4">
                <Search className="h-5 w-5 text-muted-foreground" />
                <input
                  ref={inputRef}
                  type="text"
                  className={cn(
                    'flex-1 bg-transparent px-4 py-4 text-sm outline-none',
                    'placeholder:text-muted-foreground'
                  )}
                  placeholder={placeholder}
                  value={search}
                  onChange={(e) => setSearch(e.target.value)}
                />
                <kbd className="pointer-events-none inline-flex h-5 select-none items-center gap-1 rounded border border-border bg-muted px-1.5 font-mono text-xs text-muted-foreground">
                  ESC
                </kbd>
              </div>

              {/* Results */}
              <div className="max-h-[400px] overflow-y-auto p-2">
                {filteredItems.length === 0 ? (
                  <div className="py-12 text-center text-sm text-muted-foreground">
                    {emptyMessage}
                  </div>
                ) : (
                  Object.entries(groupedItems).map(([group, groupItems]) => (
                    <div key={group} className="mb-2">
                      {group !== 'default' && (
                        <div className="px-2 py-1.5 text-xs font-semibold text-muted-foreground">
                          {group}
                        </div>
                      )}
                      <div className="space-y-1">
                        {groupItems.map((item, index) => {
                          const globalIndex = filteredItems.indexOf(item);
                          const isSelected = globalIndex === selectedIndex;

                          return (
                            <button
                              key={item.id}
                              className={cn(
                                'flex w-full items-center gap-3 rounded-md px-3 py-2',
                                'text-sm transition-colors',
                                'hover:bg-accent hover:text-accent-foreground',
                                isSelected && 'bg-accent text-accent-foreground'
                              )}
                              onClick={() => handleItemClick(item)}
                              onMouseEnter={() => setSelectedIndex(globalIndex)}
                            >
                              {item.icon && (
                                <span className="flex h-5 w-5 items-center justify-center">
                                  {item.icon}
                                </span>
                              )}
                              <span className="flex-1 text-left">{item.label}</span>
                            </button>
                          );
                        })}
                      </div>
                    </div>
                  ))
                )}
              </div>

              {/* Footer */}
              <div className="flex items-center justify-between border-t border-border px-4 py-2 text-xs text-muted-foreground">
                <div className="flex items-center gap-4">
                  <span className="flex items-center gap-1">
                    <kbd className="rounded border border-border bg-muted px-1.5 py-0.5">↑↓</kbd>
                    Navigate
                  </span>
                  <span className="flex items-center gap-1">
                    <kbd className="rounded border border-border bg-muted px-1.5 py-0.5">↵</kbd>
                    Select
                  </span>
                </div>
                <span className="flex items-center gap-1">
                  <kbd className="rounded border border-border bg-muted px-1.5 py-0.5">
                    ⌘K
                  </kbd>
                  Toggle
                </span>
              </div>
            </motion.div>
          </div>
        </>
      )}
    </AnimatePresence>
  );
};

Command.displayName = 'Command';

export { Command };
