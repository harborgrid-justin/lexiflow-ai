
import React from 'react';
import { LayoutDashboard, Briefcase, FileText, Search, ShieldCheck, Scale, X, Calendar, ChevronDown, Book, DollarSign, Users, BarChart3, Settings, FileQuestion, Fingerprint, MessageSquare, Globe, GitGraph, ScrollText, Zap } from 'lucide-react';
import { User as UserType } from '../types';

interface SidebarProps {
  activeView: string; setActiveView: (view: string) => void; isOpen: boolean; onClose: () => void;
  currentUser: UserType; onSwitchUser: () => void;
}

export const Sidebar: React.FC<SidebarProps> = ({ activeView, setActiveView, isOpen, onClose, currentUser, onSwitchUser }) => {
  const baseMenuItems = [
    { id: 'dashboard', label: 'Dashboard', icon: LayoutDashboard },
    { id: 'cases', label: 'Case Management', icon: Briefcase },
    { id: 'workflows', label: 'Workflows & Processes', icon: GitGraph },
    { id: 'messages', label: 'Secure Messenger', icon: MessageSquare },
    { id: 'discovery', label: 'Discovery Center', icon: FileQuestion },
    { id: 'evidence', label: 'Evidence Vault', icon: Fingerprint },
    { id: 'jurisdiction', label: 'Jurisdiction', icon: Globe },
    { id: 'analytics', label: 'Analytics & Prediction', icon: BarChart3 },
    { id: 'calendar', label: 'Calendar', icon: Calendar },
    { id: 'billing', label: 'Billing & Finance', icon: DollarSign },
    { id: 'crm', label: 'Client CRM', icon: Users },
    { id: 'documents', label: 'Documents', icon: FileText },
    { id: 'library', label: 'Knowledge Base', icon: Book },
    { id: 'clauses', label: 'Clause Library', icon: ScrollText },
    { id: 'research', label: 'Legal Research', icon: Search },
    { id: 'enzyme-demo', label: 'Enzyme Demo', icon: Zap },
  ];

  // RBAC Logic: Only Admins and Senior Partners see Compliance & Admin
  if (currentUser.role === 'Administrator' || currentUser.role === 'Senior Partner') {
    baseMenuItems.push(
      { id: 'compliance', label: 'Risk & Compliance', icon: ShieldCheck },
      { id: 'admin', label: 'Admin & Security', icon: Settings }
    );
  }

  return (
    <div className={`fixed inset-y-0 left-0 z-50 w-64 bg-slate-900 text-white flex flex-col h-screen border-r border-slate-700 transform transition-transform duration-300 ease-in-out ${isOpen ? 'translate-x-0' : '-translate-x-full'} md:translate-x-0`}>
      <div className="p-6 flex items-center justify-between border-b border-slate-700">
        <div className="flex items-center space-x-3"><Scale className="h-8 w-8 text-blue-400" /><div><h1 className="text-xl font-bold">LexiFlow</h1><p className="text-xs text-slate-400">Enterprise Legal Suite</p></div></div>
        <button onClick={onClose} className="md:hidden text-slate-400 hover:text-white"><X className="h-6 w-6" /></button>
      </div>
      <nav className="flex-1 p-4 space-y-1 overflow-y-auto">
        {baseMenuItems.map((item) => {
          const Icon = item.icon;
          return (
            <button key={item.id} onClick={() => setActiveView(item.id)} className={`w-full flex items-center space-x-3 px-4 py-3 rounded-md transition-colors text-sm font-medium ${activeView === item.id ? 'bg-blue-600 text-white' : 'text-slate-400 hover:bg-slate-800 hover:text-white'}`}>
              <Icon className="h-5 w-5" /><span>{item.label}</span>
            </button>
          );
        })}
      </nav>
      <div className="p-4 border-t border-slate-800 bg-slate-900">
        <button onClick={onSwitchUser} className="w-full flex items-center p-2 rounded hover:bg-slate-800 border border-slate-700">
          <div className="h-8 w-8 bg-indigo-500 rounded-full flex items-center justify-center text-xs font-bold">{currentUser?.name?.charAt(0) || '?'}</div>
          <div className="ml-3 text-left flex-1 min-w-0"><p className="text-sm font-medium truncate">{currentUser?.name || 'Unknown'}</p><p className="text-xs text-slate-400 truncate">{currentUser?.role || 'No role'}</p></div>
          <ChevronDown className="h-4 w-4 text-slate-500" />
        </button>
      </div>
    </div>
  );
};
