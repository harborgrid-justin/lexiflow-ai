import React from 'react';

interface FormSectionProps {
  title?: string;
  children: React.ReactNode;
  className?: string;
  showBorder?: boolean;
}

export const FormSection: React.FC<FormSectionProps> = ({
  title,
  children,
  className = '',
  showBorder = true
}) => {
  return (
    <div className={`${showBorder ? 'border-t pt-4' : ''} ${className}`}>
      {title && (
        <h4 className="text-sm font-semibold text-slate-700 mb-3">{title}</h4>
      )}
      {children}
    </div>
  );
};