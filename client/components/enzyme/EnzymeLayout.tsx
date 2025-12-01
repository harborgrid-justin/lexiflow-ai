import React from 'react';
import { DOMContextProvider, AdaptiveLayout } from '@missionfabric-js/enzyme/layouts';

interface EnzymeLayoutProps {
  children: React.ReactNode;
}

/**
 * EnzymeLayout uses native Enzyme layout providers:
 * - DOMContextProvider: Tracks DOM ancestry, viewport awareness, scroll containers
 * - AdaptiveLayout: Content-aware layout computation with FLIP animations
 */
export const EnzymeLayout: React.FC<EnzymeLayoutProps> = ({ children }) => {
  return (
    <DOMContextProvider>
      <AdaptiveLayout
        initialMode="grid"
        config={{
          contentAware: true,
          resizeDebounceMs: 150,
        }}
        transitionConfig={{
          duration: 300,
          easing: 'cubic-bezier(0.4, 0, 0.2, 1)',
        }}
        clsConfig={{
          enabled: true,
        }}
      >
        <div className="h-full overflow-auto bg-slate-50">
          {children}
        </div>
      </AdaptiveLayout>
    </DOMContextProvider>
  );
};
