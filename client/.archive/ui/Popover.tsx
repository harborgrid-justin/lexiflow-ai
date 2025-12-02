import * as React from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { cn } from '../../lib/utils';

export interface PopoverProps {
  children: React.ReactElement;
  content: React.ReactNode;
  side?: 'top' | 'right' | 'bottom' | 'left';
  align?: 'start' | 'center' | 'end';
  open?: boolean;
  onOpenChange?: (open: boolean) => void;
  className?: string;
  triggerClassName?: string;
}

const Popover: React.FC<PopoverProps> = ({
  children,
  content,
  side = 'bottom',
  align = 'center',
  open: controlledOpen,
  onOpenChange,
  className,
  triggerClassName,
}) => {
  const [internalOpen, setInternalOpen] = React.useState(false);
  const [position, setPosition] = React.useState({ top: 0, left: 0 });
  const triggerRef = React.useRef<HTMLElement>(null);
  const popoverRef = React.useRef<HTMLDivElement>(null);

  const isOpen = controlledOpen !== undefined ? controlledOpen : internalOpen;
  const setIsOpen = onOpenChange || setInternalOpen;

  const calculatePosition = React.useCallback(() => {
    if (!triggerRef.current) return;

    const triggerRect = triggerRef.current.getBoundingClientRect();
    const offset = 8;

    let top = 0;
    let left = 0;

    // Calculate based on side
    switch (side) {
      case 'top':
        top = triggerRect.top - offset;
        break;
      case 'bottom':
        top = triggerRect.bottom + offset;
        break;
      case 'left':
        top = triggerRect.top;
        break;
      case 'right':
        top = triggerRect.top;
        break;
    }

    // Calculate based on alignment
    switch (align) {
      case 'start':
        left = side === 'left' || side === 'right' ? triggerRect.left : triggerRect.left;
        break;
      case 'center':
        left =
          side === 'left' || side === 'right'
            ? triggerRect.left
            : triggerRect.left + triggerRect.width / 2;
        break;
      case 'end':
        left =
          side === 'left' || side === 'right'
            ? triggerRect.left
            : triggerRect.right;
        break;
    }

    if (side === 'left') left = triggerRect.left - offset;
    if (side === 'right') left = triggerRect.right + offset;

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
        popoverRef.current &&
        !popoverRef.current.contains(event.target as Node) &&
        triggerRef.current &&
        !triggerRef.current.contains(event.target as Node)
      ) {
        setIsOpen(false);
      }
    };

    if (isOpen) {
      document.addEventListener('mousedown', handleClickOutside);
    }

    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, [isOpen, setIsOpen]);

  const handleTriggerClick = () => {
    setIsOpen(!isOpen);
  };

  const sideTransforms = {
    top: { y: 10 },
    bottom: { y: -10 },
    left: { x: 10 },
    right: { x: -10 },
  };

  const transformOrigin = {
    top: 'bottom',
    bottom: 'top',
    left: 'right',
    right: 'left',
  };

  return (
    <>
      {React.cloneElement(children, {
        ref: triggerRef,
        onClick: handleTriggerClick,
        className: cn(triggerClassName, children.props.className),
      })}

      <AnimatePresence>
        {isOpen && content && (
          <motion.div
            ref={popoverRef}
            className={cn(
              'fixed z-[var(--z-popover)] rounded-md border border-border',
              'bg-popover text-popover-foreground shadow-lg',
              'min-w-[200px] max-w-md',
              className
            )}
            style={{
              top: position.top,
              left: position.left,
              transformOrigin: transformOrigin[side],
            }}
            initial={{
              opacity: 0,
              scale: 0.95,
              ...sideTransforms[side],
            }}
            animate={{
              opacity: 1,
              scale: 1,
              x: 0,
              y: 0,
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

Popover.displayName = 'Popover';

export { Popover };
