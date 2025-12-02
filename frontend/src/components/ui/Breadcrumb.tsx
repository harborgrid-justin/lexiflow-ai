import { Link } from '@tanstack/react-router';
import { useAppStore } from '@stores/app.store';
import { ChevronRight, Home } from 'lucide-react';
import { cn } from '@lib/utils';

export default function Breadcrumb() {
  const { breadcrumbs } = useAppStore();

  if (breadcrumbs.length === 0) return null;

  return (
    <nav className="flex items-center space-x-2 text-sm text-dark-text-muted mb-6">
      <Link
        to="/dashboard"
        className="flex items-center hover:text-dark-text transition-colors"
      >
        <Home className="w-4 h-4" />
      </Link>

      {breadcrumbs.map((item, index) => (
        <div key={index} className="flex items-center space-x-2">
          <ChevronRight className="w-4 h-4" />
          {item.href ? (
            <Link
              to={item.href}
              className={cn(
                'hover:text-dark-text transition-colors',
                index === breadcrumbs.length - 1 && 'text-dark-text font-medium'
              )}
            >
              {item.label}
            </Link>
          ) : (
            <span
              className={cn(
                index === breadcrumbs.length - 1 && 'text-dark-text font-medium'
              )}
            >
              {item.label}
            </span>
          )}
        </div>
      ))}
    </nav>
  );
}
