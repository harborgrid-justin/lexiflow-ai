import React from 'react';
import { Button } from './Button';

export interface ActionButton {
  label: string;
  onClick: () => void;
  variant?: 'primary' | 'secondary' | 'outline' | 'ghost' | 'danger';
  size?: 'sm' | 'md' | 'lg';
  icon?: React.ElementType;
  disabled?: boolean;
  loading?: boolean;
}

interface ActionButtonGroupProps {
  actions: ActionButton[];
  className?: string;
  justify?: 'start' | 'center' | 'end' | 'between';
  direction?: 'row' | 'col';
}

export const ActionButtonGroup: React.FC<ActionButtonGroupProps> = ({
  actions,
  className = '',
  justify = 'start',
  direction = 'row'
}) => {
  const justifyClasses = {
    start: 'justify-start',
    center: 'justify-center',
    end: 'justify-end',
    between: 'justify-between'
  };

  const directionClasses = {
    row: 'flex-row',
    col: 'flex-col'
  };

  return (
    <div className={`flex gap-2 ${directionClasses[direction]} ${justifyClasses[justify]} ${className}`}>
      {actions.map((action, index) => (
        <Button
          key={index}
          variant={action.variant || 'secondary'}
          size={action.size || 'md'}
          icon={action.icon}
          onClick={action.onClick}
          disabled={action.disabled}
          className={action.loading ? 'opacity-50 cursor-not-allowed' : ''}
        >
          {action.loading ? 'Loading...' : action.label}
        </Button>
      ))}
    </div>
  );
};