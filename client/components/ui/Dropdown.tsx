import * as React from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Check, ChevronRight } from 'lucide-react';
import { cn } from '../../lib/utils';

export interface DropdownMenuItem {
  label: string;
  value: string;
  icon?: React.ReactNode;
  disabled?: boolean;
  destructive?: boolean;
  separator?: boolean;
  shortcut?: string;
  submenu?: DropdownMenuItem[];
}

export interface DropdownProps {
  children: React.ReactElement;
  items: DropdownMenuItem[];
  onSelect?: (value: string) => void;
  side?: 'top' | 'right' | 'bottom' | 'left';
  align?: 'start' | 'center' | 'end';
  className?: string;
}

const Dropdown: React.FC<DropdownProps> = ({
  children,
  items,
  onSelect,
  side = 'bottom',
  align = 'start',
  className,
}) => {
  const [isOpen, setIsOpen] = React.useState(false);
  const [position, setPosition] = React.useState({ top: 0, left: 0 });
  const [activeSubmenu, setActiveSubmenu] = React.useState<string | null>(null);
  const triggerRef = React.useRef<HTMLElement>(null);
  const dropdownRef = React.useRef<HTMLDivElement>(null);

  const calculatePosition = React.useCallback(() => {
    if (!triggerRef.current) return;

    const triggerRect = triggerRef.current.getBoundingClientRect();
    const offset = 8;

    let top = 0;
    let left = 0;

    switch (side) {
      case 'top':
        top = triggerRect.top - offset;
        break;
      case 'bottom':
        top = triggerRect.bottom + offset;
        break;
      case 'left':
        top = triggerRect.top;
        left = triggerRect.left - offset;
        break;
      case 'right':
        top = triggerRect.top;
        left = triggerRect.right + offset;
        break;
    }

    if (side === 'bottom' || side === 'top') {
      switch (align) {
        case 'start':
          left = triggerRect.left;
          break;
        case 'center':
          left = triggerRect.left + triggerRect.width / 2;
          break;
        case 'end':
          left = triggerRect.right;
          break;
      }
    }

    setPosition({ top, left });
  }, [side, align]);

  React.useEffect(() => {
    if (isOpen) {
      calculatePosition();
      window.addEventListener('resize', calculatePosition);
      window.addEventListener('scroll', calculatePosition);
    }

    return () => {
      window.removeEventListener('resize', calculatePosition);
      window.removeEventListener('scroll', calculatePosition);
    };
  }, [isOpen, calculatePosition]);

  React.useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (
        dropdownRef.current &&
        !dropdownRef.current.contains(event.target as Node) &&
        triggerRef.current &&
        !triggerRef.current.contains(event.target as Node)
      ) {
        setIsOpen(false);
        setActiveSubmenu(null);
      }
    };

    if (isOpen) {
      document.addEventListener('mousedown', handleClickOutside);
    }

    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, [isOpen]);

  const handleItemClick = (item: DropdownMenuItem) => {
    if (item.disabled) return;
    if (item.submenu) {
      setActiveSubmenu(activeSubmenu === item.value ? null : item.value);
      return;
    }
    onSelect?.(item.value);
    setIsOpen(false);
    setActiveSubmenu(null);
  };

  const handleTriggerClick = () => {
    setIsOpen(!isOpen);
    setActiveSubmenu(null);
  };

  return (
    <>
      {React.cloneElement(children, {
        ref: triggerRef,
        onClick: handleTriggerClick,
      })}

      <AnimatePresence>
        {isOpen && (
          <motion.div
            ref={dropdownRef}
            className={cn(
              'fixed z-[var(--z-dropdown)] min-w-[200px] rounded-md border border-border',
              'bg-popover text-popover-foreground shadow-lg p-1',
              className
            )}
            style={{
              top: position.top,
              left: position.left,
            }}
            initial={{ opacity: 0, scale: 0.95, y: -10 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.95, y: -10 }}
            transition={{ duration: 0.15 }}
          >
            {items.map((item, index) => (
              <React.Fragment key={item.value}>
                {item.separator && index > 0 && (
                  <div className="my-1 h-px bg-border" />
                )}
                <button
                  className={cn(
                    'relative flex w-full cursor-pointer select-none items-center',
                    'rounded-sm px-2 py-1.5 text-sm outline-none transition-colors',
                    'hover:bg-accent hover:text-accent-foreground',
                    item.disabled && 'pointer-events-none opacity-50',
                    item.destructive &&
                      'text-destructive hover:bg-destructive/10'
                  )}
                  onClick={() => handleItemClick(item)}
                  disabled={item.disabled}
                >
                  {item.icon && (
                    <span className="mr-2 h-4 w-4 inline-flex">{item.icon}</span>
                  )}
                  <span className="flex-1 text-left">{item.label}</span>
                  {item.shortcut && (
                    <span className="ml-auto text-xs tracking-widest text-muted-foreground">
                      {item.shortcut}
                    </span>
                  )}
                  {item.submenu && (
                    <ChevronRight className="ml-auto h-4 w-4" />
                  )}
                </button>

                {/* Submenu */}
                {item.submenu && activeSubmenu === item.value && (
                  <motion.div
                    className={cn(
                      'absolute left-full top-0 ml-1 min-w-[200px]',
                      'rounded-md border border-border bg-popover shadow-lg p-1'
                    )}
                    initial={{ opacity: 0, x: -10 }}
                    animate={{ opacity: 1, x: 0 }}
                    exit={{ opacity: 0, x: -10 }}
                    transition={{ duration: 0.15 }}
                  >
                    {item.submenu.map((subItem) => (
                      <button
                        key={subItem.value}
                        className={cn(
                          'relative flex w-full cursor-pointer select-none items-center',
                          'rounded-sm px-2 py-1.5 text-sm outline-none transition-colors',
                          'hover:bg-accent hover:text-accent-foreground',
                          subItem.disabled && 'pointer-events-none opacity-50',
                          subItem.destructive &&
                            'text-destructive hover:bg-destructive/10'
                        )}
                        onClick={() => {
                          if (!subItem.disabled) {
                            onSelect?.(subItem.value);
                            setIsOpen(false);
                            setActiveSubmenu(null);
                          }
                        }}
                        disabled={subItem.disabled}
                      >
                        {subItem.icon && (
                          <span className="mr-2 h-4 w-4 inline-flex">
                            {subItem.icon}
                          </span>
                        )}
                        <span className="flex-1 text-left">{subItem.label}</span>
                        {subItem.shortcut && (
                          <span className="ml-auto text-xs tracking-widest text-muted-foreground">
                            {subItem.shortcut}
                          </span>
                        )}
                      </button>
                    ))}
                  </motion.div>
                )}
              </React.Fragment>
            ))}
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
};

Dropdown.displayName = 'Dropdown';

export { Dropdown };
