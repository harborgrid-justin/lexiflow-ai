
import React, { useState } from 'react';
import { Sidebar } from './components/Sidebar';
import { Dashboard } from './components/Dashboard';
import { CaseList } from './components/CaseList';
import { ResearchTool } from './components/ResearchTool';
import { CaseDetail } from './components/CaseDetail';
import { DocumentManager } from './components/DocumentManager';
import { CalendarView } from './components/CalendarView';
import { ClauseLibrary } from './components/ClauseLibrary';
import { BillingDashboard } from './components/BillingDashboard';
import { ClientCRM } from './components/ClientCRM';
import { KnowledgeBase } from './components/KnowledgeBase';
import { AnalyticsDashboard } from './components/AnalyticsDashboard';
import { ComplianceDashboard } from './components/ComplianceDashboard';
import { AdminPanel } from './components/AdminPanel';
import { DiscoveryPlatform } from './components/DiscoveryPlatform';
import { EvidenceVault } from './components/EvidenceVault';
import { SecureMessenger } from './components/SecureMessenger';
import { JurisdictionManager } from './components/JurisdictionManager';
import { MasterWorkflow } from './components/MasterWorkflow';
import { ErrorBoundary } from './components/common/ErrorBoundary';
import { Case } from './types';
import { Bell, User as UserIcon, Search, Menu, HelpCircle } from 'lucide-react';
import { MOCK_USERS } from './data/mockUsers';
import { MOCK_CASES } from './data/mockCases';

const App: React.FC = () => {
  const [activeView, setActiveView] = useState('dashboard');
  const [selectedCase, setSelectedCase] = useState<Case | null>(null);
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);
  const [currentUserIndex, setCurrentUserIndex] = useState(0);
  const [globalSearch, setGlobalSearch] = useState('');

  const currentUser = MOCK_USERS[currentUserIndex];

  const handleSelectCaseById = (caseId: string) => {
    const found = MOCK_CASES.find(c => c.id === caseId);
    if (found) {
      setSelectedCase(found);
    }
  };

  const handleGlobalSearch = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === 'Enter' && globalSearch) {
        const foundCase = MOCK_CASES.find(c => 
            c.id.toLowerCase().includes(globalSearch.toLowerCase()) || 
            c.title.toLowerCase().includes(globalSearch.toLowerCase())
        );
        if (foundCase) {
            setSelectedCase(foundCase);
            setGlobalSearch('');
        } else {
            alert("No matching case found.");
        }
    }
  };

  const renderContent = () => {
    if (selectedCase) return <CaseDetail caseData={selectedCase} onBack={() => setSelectedCase(null)} />;
    
    // Core Routing Switch - Matches Sidebar IDs exactly
    switch (activeView) {
      case 'dashboard': return <Dashboard onSelectCase={handleSelectCaseById} />;
      case 'cases': return <CaseList onSelectCase={setSelectedCase} />;
      case 'workflows': return <MasterWorkflow onSelectCase={handleSelectCaseById} />;
      case 'messages': return <SecureMessenger />;
      case 'discovery': return <DiscoveryPlatform />;
      case 'evidence': return <EvidenceVault onNavigateToCase={handleSelectCaseById} />;
      case 'jurisdiction': return <JurisdictionManager currentUser={currentUser} />;
      case 'calendar': return <CalendarView />;
      case 'billing': return <BillingDashboard navigateTo={setActiveView} />;
      case 'crm': return <ClientCRM />;
      case 'research': return <ResearchTool />;
      case 'documents': return <DocumentManager currentUserRole={currentUser.role} />;
      case 'library': return <KnowledgeBase />;
      case 'clauses': return <ClauseLibrary />;
      case 'analytics': return <AnalyticsDashboard />;
      // Restricted Modules (RBAC)
      case 'compliance': return <ComplianceDashboard />;
      case 'admin': return <AdminPanel />;
      default: return (
        <div className="flex flex-col justify-center items-center h-full text-slate-400">
            <div className="bg-slate-100 p-4 rounded-full mb-4">
                <HelpCircle className="h-10 w-10 text-slate-300"/>
            </div>
            <p className="text-xl font-semibold">Under Construction</p>
            <p className="text-sm mt-2">The requested module <span className="font-mono bg-slate-100 px-1 rounded text-slate-600">"{activeView}"</span> is not yet available.</p>
        </div>
      );
    }
  };

  return (
    <div className="flex h-screen bg-slate-50 font-sans text-slate-900 overflow-hidden">
      {isSidebarOpen && <div className="fixed inset-0 bg-slate-900/50 z-40 md:hidden backdrop-blur" onClick={() => setIsSidebarOpen(false)} />}
      
      <Sidebar 
        activeView={selectedCase ? 'cases' : activeView} 
        setActiveView={(v) => { 
            setActiveView(v); 
            setSelectedCase(null); 
            setIsSidebarOpen(false); 
        }} 
        isOpen={isSidebarOpen} 
        onClose={() => setIsSidebarOpen(false)} 
        currentUser={currentUser} 
        onSwitchUser={() => setCurrentUserIndex((prev) => (prev + 1) % MOCK_USERS.length)} 
      />
      
      <div className="flex-1 flex flex-col md:ml-64 h-full transition-all w-full">
        <header className="h-16 bg-white border-b border-slate-200 flex items-center justify-between px-4 md:px-8 shadow-sm z-30 shrink-0">
          <div className="flex items-center flex-1 gap-4">
            <button onClick={() => setIsSidebarOpen(true)} className="md:hidden p-2 -ml-2 text-slate-500 hover:bg-slate-100 rounded"><Menu className="h-6 w-6" /></button>
            <div className="relative w-full hidden sm:block max-w-xl">
                <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-slate-400" />
                <input 
                    type="text" 
                    placeholder="Search Cases..." 
                    className="w-full pl-10 pr-4 py-2 bg-slate-100 border-transparent focus:bg-white focus:ring-2 focus:ring-blue-200 rounded text-sm outline-none transition-all" 
                    value={globalSearch}
                    onChange={(e) => setGlobalSearch(e.target.value)}
                    onKeyDown={handleGlobalSearch}
                />
            </div>
          </div>
          <div className="flex items-center space-x-6">
            <button className="relative p-2 text-slate-400 hover:text-slate-600"><Bell className="h-5 w-5" /><span className="absolute top-1.5 right-1.5 h-2 w-2 bg-red-500 rounded-full border border-white"></span></button>
            <div className="flex items-center space-x-3 border-l pl-6 cursor-pointer hover:bg-slate-50 p-1 rounded" onClick={() => setCurrentUserIndex((prev) => (prev + 1) % MOCK_USERS.length)}>
                <div className="text-right hidden md:block">
                    <p className="text-sm font-semibold">{currentUser.name}</p>
                    <p className="text-xs text-slate-500">{currentUser.role}</p>
                </div>
                <div className="h-9 w-9 bg-blue-100 rounded-full flex items-center justify-center text-blue-700 font-bold border border-blue-200"><UserIcon className="h-5 w-5" /></div>
            </div>
          </div>
        </header>
        <main className="flex-1 overflow-x-hidden overflow-y-auto bg-slate-50 p-4 md:p-8 relative">
            <div className="max-w-7xl mx-auto h-full">
                <ErrorBoundary>
                    {renderContent()}
                </ErrorBoundary>
            </div>
        </main>
      </div>
    </div>
  );
};
export default App;
