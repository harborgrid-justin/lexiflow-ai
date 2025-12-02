import * as React from 'react';
import { motion } from 'framer-motion';
import { ChevronRight, Home } from 'lucide-react';
import { cn } from '../lib/utils';

export interface BreadcrumbItem {
  label: string;
  href?: string;
  icon?: React.ReactNode;
  onClick?: () => void;
}

export interface BreadcrumbsProps {
  items: BreadcrumbItem[];
  separator?: React.ReactNode;
  showHome?: boolean;
  onHomeClick?: () => void;
  className?: string;
  maxItems?: number;
}

const Breadcrumbs: React.FC<BreadcrumbsProps> = ({
  items,
  separator = <ChevronRight className="h-4 w-4" />,
  showHome = true,
  onHomeClick,
  className,
  maxItems,
}) => {
  const displayItems = React.useMemo(() => {
    if (!maxItems || items.length <= maxItems) {
      return items;
    }

    // Show first item, ellipsis, and last (maxItems - 1) items
    const firstItem = items[0];
    const lastItems = items.slice(-(maxItems - 1));

    return [
      firstItem,
      {
        label: '...',
        onClick: undefined,
      },
      ...lastItems,
    ];
  }, [items, maxItems]);

  const handleItemClick = (item: BreadcrumbItem, e: React.MouseEvent) => {
    if (item.onClick) {
      e.preventDefault();
      item.onClick();
    }
  };

  return (
    <nav
      className={cn('flex items-center space-x-1 text-sm', className)}
      aria-label="Breadcrumb"
    >
      <ol className="flex items-center space-x-1">
        {showHome && (
          <>
            <li>
              <motion.button
                type="button"
                className={cn(
                  'inline-flex items-center gap-1 px-2 py-1 rounded-md',
                  'text-muted-foreground hover:text-foreground hover:bg-accent',
                  'transition-colors focus:outline-none focus:ring-2 focus:ring-ring'
                )}
                onClick={onHomeClick}
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
              >
                <Home className="h-4 w-4" />
                <span className="sr-only">Home</span>
              </motion.button>
            </li>
            {items.length > 0 && (
              <li className="flex items-center text-muted-foreground">
                {separator}
              </li>
            )}
          </>
        )}

        {displayItems.map((item, index) => {
          const isLast = index === displayItems.length - 1;
          const isEllipsis = item.label === '...';

          return (
            <React.Fragment key={index}>
              <li>
                {isEllipsis ? (
                  <span className="px-2 py-1 text-muted-foreground">...</span>
                ) : item.href || item.onClick ? (
                  <motion.a
                    href={item.href}
                    onClick={(e) => handleItemClick(item, e)}
                    className={cn(
                      'inline-flex items-center gap-1 px-2 py-1 rounded-md',
                      'transition-colors focus:outline-none focus:ring-2 focus:ring-ring',
                      isLast
                        ? 'text-foreground font-medium cursor-default'
                        : 'text-muted-foreground hover:text-foreground hover:bg-accent cursor-pointer'
                    )}
                    aria-current={isLast ? 'page' : undefined}
                    whileHover={!isLast ? { scale: 1.05 } : {}}
                    whileTap={!isLast ? { scale: 0.95 } : {}}
                  >
                    {item.icon && (
                      <span className="inline-flex">{item.icon}</span>
                    )}
                    <span>{item.label}</span>
                  </motion.a>
                ) : (
                  <span
                    className={cn(
                      'inline-flex items-center gap-1 px-2 py-1',
                      isLast
                        ? 'text-foreground font-medium'
                        : 'text-muted-foreground'
                    )}
                    aria-current={isLast ? 'page' : undefined}
                  >
                    {item.icon && (
                      <span className="inline-flex">{item.icon}</span>
                    )}
                    <span>{item.label}</span>
                  </span>
                )}
              </li>
              {!isLast && (
                <li className="flex items-center text-muted-foreground">
                  {separator}
                </li>
              )}
            </React.Fragment>
          );
        })}
      </ol>
    </nav>
  );
};

Breadcrumbs.displayName = 'Breadcrumbs';

export { Breadcrumbs };
