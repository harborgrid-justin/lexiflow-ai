import * as React from 'react';
import { LucideIcon, LucideProps } from 'lucide-react';
import { cn } from '../../lib/utils';

export interface IconProps extends Omit<LucideProps, 'ref'> {
  icon: LucideIcon;
  size?: 'xs' | 'sm' | 'md' | 'lg' | 'xl';
}

const Icon = React.forwardRef<SVGSVGElement, IconProps>(
  ({ icon: IconComponent, size = 'md', className, ...props }, ref) => {
    const sizes = {
      xs: 'h-3 w-3',
      sm: 'h-4 w-4',
      md: 'h-5 w-5',
      lg: 'h-6 w-6',
      xl: 'h-8 w-8',
    };

    return (
      <IconComponent
        ref={ref}
        className={cn(sizes[size], className)}
        {...props}
      />
    );
  }
);

Icon.displayName = 'Icon';

export { Icon };
