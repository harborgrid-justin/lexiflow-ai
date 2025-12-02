import * as React from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { cn } from '../../lib/utils';

export interface TooltipProps {
  children: React.ReactElement;
  content: React.ReactNode;
  side?: 'top' | 'right' | 'bottom' | 'left';
  align?: 'start' | 'center' | 'end';
  delayDuration?: number;
  className?: string;
}

const Tooltip: React.FC<TooltipProps> = ({
  children,
  content,
  side = 'top',
  align = 'center',
  delayDuration = 200,
  className,
}) => {
  const [isOpen, setIsOpen] = React.useState(false);
  const [position, setPosition] = React.useState({ top: 0, left: 0 });
  const triggerRef = React.useRef<HTMLElement>(null);
  const timeoutRef = React.useRef<NodeJS.Timeout>();

  const calculatePosition = React.useCallback(() => {
    if (!triggerRef.current) return;

    const triggerRect = triggerRef.current.getBoundingClientRect();
    const offset = 8; // Distance from trigger element

    let top = 0;
    let left = 0;

    // Calculate based on side
    switch (side) {
      case 'top':
        top = triggerRect.top - offset;
        left = triggerRect.left + triggerRect.width / 2;
        break;
      case 'bottom':
        top = triggerRect.bottom + offset;
        left = triggerRect.left + triggerRect.width / 2;
        break;
      case 'left':
        top = triggerRect.top + triggerRect.height / 2;
        left = triggerRect.left - offset;
        break;
      case 'right':
        top = triggerRect.top + triggerRect.height / 2;
        left = triggerRect.right + offset;
        break;
    }

    setPosition({ top, left });
  }, [side]);

  const handleMouseEnter = () => {
    timeoutRef.current = setTimeout(() => {
      calculatePosition();
      setIsOpen(true);
    }, delayDuration);
  };

  const handleMouseLeave = () => {
    if (timeoutRef.current) {
      clearTimeout(timeoutRef.current);
    }
    setIsOpen(false);
  };

  React.useEffect(() => {
    return () => {
      if (timeoutRef.current) {
        clearTimeout(timeoutRef.current);
      }
    };
  }, []);

  const sideTransforms = {
    top: { y: [10, 0], x: '-50%' },
    bottom: { y: [-10, 0], x: '-50%' },
    left: { x: [10, 0], y: '-50%' },
    right: { x: [-10, 0], y: '-50%' },
  };

  const sideOrigin = {
    top: 'bottom',
    bottom: 'top',
    left: 'right',
    right: 'left',
  };

  return (
    <>
      {React.cloneElement(children, {
        ref: triggerRef,
        onMouseEnter: handleMouseEnter,
        onMouseLeave: handleMouseLeave,
        onFocus: handleMouseEnter,
        onBlur: handleMouseLeave,
      })}

      <AnimatePresence>
        {isOpen && content && (
          <motion.div
            className={cn(
              'fixed z-[var(--z-tooltip)] px-3 py-2 text-sm',
              'bg-popover text-popover-foreground rounded-md shadow-lg border border-border',
              'pointer-events-none select-none',
              'max-w-xs',
              className
            )}
            style={{
              top: position.top,
              left: position.left,
              transformOrigin: sideOrigin[side],
            }}
            initial={{
              opacity: 0,
              scale: 0.95,
              ...sideTransforms[side],
            }}
            animate={{
              opacity: 1,
              scale: 1,
              ...(side === 'top' || side === 'bottom'
                ? { y: 0, x: '-50%' }
                : { x: 0, y: '-50%' }),
            }}
            exit={{
              opacity: 0,
              scale: 0.95,
            }}
            transition={{ duration: 0.15 }}
          >
            {content}
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
};

Tooltip.displayName = 'Tooltip';

export { Tooltip };
