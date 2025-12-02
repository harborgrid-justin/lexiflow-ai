import React, { Suspense, lazy } from 'react';
import { Case, User } from '../types';

// ✅ ENZYME: Progressive hydration with lazy loading
const CaseDetail = lazy(() => import('./CaseDetail').then(m => ({ default: m.CaseDetail })));

interface CaseDetailWithHydrationProps {
  caseData: Case;
  onBack: () => void;
  currentUser?: User;
  hideHeader?: boolean;
}

export const CaseDetailWithHydration: React.FC<CaseDetailWithHydrationProps> = (props) => {
  return (
    <Suspense fallback={
      <div className="flex items-center justify-center h-64">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
        <span className="ml-3 text-slate-600">Loading case details...</span>
      </div>
    }>
      <CaseDetail {...props} />
    </Suspense>
  );
};
