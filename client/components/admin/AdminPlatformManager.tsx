/**
 * ENZYME MIGRATION - AdminPlatformManager
 *
 * This component has been migrated to use the Enzyme framework for:
 * - Progressive hydration with HydrationBoundary
 * - Page view tracking via usePageView
 * - Event tracking for admin actions via useTrackEvent
 * - Stable callbacks with useLatestCallback
 * - Safe async operations with useIsMounted
 *
 * Tracked Events:
 * - admin_category_changed: When user switches between entity categories
 * - admin_record_edit: When user opens edit modal for an entity
 * - admin_record_create: When user opens create modal
 * - admin_record_delete: When user deletes an entity
 * - admin_record_saved: When user saves changes (create or update)
 *
 * Migration Date: 2025-12-01
 * Agent: Agent 10 (Wave 2)
 */

import React, { useState, useEffect } from 'react';
import { Users, Briefcase, FileText, Book, Building } from 'lucide-react';
import { ApiService } from '../../services/apiService';
import { EntitySidebar } from './platform/EntitySidebar';
import { EntityToolbar } from './platform/EntityToolbar';
import { EntityTable } from './platform/EntityTable';
import { EntityCardList } from './platform/EntityCardList';
import { EntityModal } from './platform/EntityModal';
import {
  useLatestCallback,
  useTrackEvent,
  usePageView,
  useIsMounted,
  HydrationBoundary
} from '../../enzyme';

type Category = 'users' | 'cases' | 'clients' | 'clauses' | 'documents';

export const AdminPlatformManager: React.FC = () => {
  // Enzyme: Page view tracking
  usePageView('admin_platform_manager');

  // Enzyme: Event tracking
  const trackEvent = useTrackEvent();

  // Enzyme: Safe async state updates
  const isMounted = useIsMounted();
  const [data, setData] = useState<Record<Category, any[]>>({
    users: [],
    cases: [],
    clients: [],
    clauses: [],
    documents: [],
  });

  // Enzyme: Safe data fetching with isMounted check
  useEffect(() => {
    const fetchData = async () => {
      try {
        const [u, c, cl, clauses, d] = await Promise.all([
          ApiService.getUsers(),
          ApiService.getCases(),
          ApiService.getClients(),
          ApiService.getClauses(),
          ApiService.getDocuments(),
        ]);

        // Only update state if component is still mounted
        if (isMounted()) {
          setData({
            users: u,
            cases: c,
            clients: cl,
            clauses,
            documents: d,
          });
        }
      } catch (error) {
        console.error('Failed to fetch platform data', error);
      }
    };
    fetchData();
  }, [isMounted]);

  const [activeCategory, setActiveCategoryState] = useState<Category>('users');
  const [searchTerm, setSearchTerm] = useState('');
  const [editingItem, setEditingItem] = useState<any>(null);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isNewItem, setIsNewItem] = useState(false);

  // Enzyme: Stable callback with tracking for category changes
  const setActiveCategory = useLatestCallback((category: Category) => {
    const previousCategory = activeCategory;
    trackEvent('admin_category_changed', {
      from: previousCategory,
      to: category
    });
    setActiveCategoryState(category);
  });

  const categories: { id: Category; label: string; icon: React.ComponentType<{ className?: string }> }[] = [
    { id: 'users', label: 'Users', icon: Users },
    { id: 'cases', label: 'Cases', icon: Briefcase },
    { id: 'clients', label: 'Clients', icon: Building },
    { id: 'clauses', label: 'Clauses', icon: Book },
    { id: 'documents', label: 'Docs', icon: FileText },
  ];

  // Helper to get current list based on category and search
  const getCurrentList = () => {
    const list = data[activeCategory] as any[];
    if (!searchTerm) return list;
    return list.filter(item => 
      Object.values(item).some(val => 
        String(val).toLowerCase().includes(searchTerm.toLowerCase())
      )
    );
  };

  // Enzyme: Stable callback with tracking for edit action
  const handleEdit = useLatestCallback((item: any) => {
    trackEvent('admin_record_edit', {
      category: activeCategory,
      recordId: item.id
    });
    setEditingItem({ ...item });
    setIsNewItem(false);
    setIsModalOpen(true);
  });

  // Enzyme: Stable callback with tracking for create action
  const handleCreate = useLatestCallback(() => {
    trackEvent('admin_record_create', {
      category: activeCategory
    });

    // Create empty template based on category
    const templates: any = {
      users: { id: `u-${Date.now()}`, name: '', role: 'Associate', office: '' },
      cases: { id: `C-${Date.now()}`, title: '', client: '', status: 'Discovery', value: 0 },
      clients: { id: `cli-${Date.now()}`, name: '', industry: '', status: 'Active', totalBilled: 0 },
      clauses: { id: `cl-${Date.now()}`, name: '', category: '', riskRating: 'Low', content: '' },
      documents: { id: `doc-${Date.now()}`, title: '', type: 'General', uploadDate: new Date().toISOString().split('T')[0] },
    };
    setEditingItem(templates[activeCategory]);
    setIsNewItem(true);
    setIsModalOpen(true);
  });

  // Enzyme: Stable callback with tracking for delete action
  const handleDelete = useLatestCallback((id: string) => {
    if (confirm('Are you sure you want to delete this record? This action cannot be undone.')) {
      trackEvent('admin_record_delete', {
        category: activeCategory,
        recordId: id
      });
      setData(prev => ({
        ...prev,
        [activeCategory]: (prev[activeCategory] as any[]).filter(item => item.id !== id)
      }));
    }
  });

  // Enzyme: Stable callback with tracking for save action
  const handleSave = useLatestCallback(() => {
    if (!editingItem) return;

    trackEvent('admin_record_saved', {
      category: activeCategory,
      recordId: editingItem.id,
      isNew: isNewItem
    });

    if (isNewItem) {
      setData(prev => ({
        ...prev,
        [activeCategory]: [editingItem, ...(prev[activeCategory] as any[])]
      }));
    } else {
      setData(prev => ({
        ...prev,
        [activeCategory]: (prev[activeCategory] as any[]).map(item => item.id === editingItem.id ? editingItem : item)
      }));
    }
    setIsModalOpen(false);
  });

  const listItems = getCurrentList();

  return (
    <div className="flex flex-col h-full bg-slate-50 rounded-lg overflow-hidden border border-slate-200">
      {/* Enzyme: Modal hydrated on-demand when opened */}
      <EntityModal
        isOpen={isModalOpen}
        title={isNewItem ? 'Create Record' : 'Edit Record'}
        item={editingItem}
        onClose={() => setIsModalOpen(false)}
        onChange={(key, value) => setEditingItem(prev => (prev ? { ...prev, [key]: value } : prev))}
        onSave={handleSave}
      />

      <div className="flex flex-col md:flex-row flex-1 overflow-hidden">
        {/* Enzyme: Sidebar hydrated immediately (critical navigation) */}
        <HydrationBoundary id="admin-sidebar" priority="high" trigger="immediate">
          <EntitySidebar
            categories={categories}
            activeCategory={activeCategory}
            data={data}
            onSelect={setActiveCategory}
          />
        </HydrationBoundary>

        <div className="flex-1 flex flex-col bg-white overflow-hidden">
          {/* Enzyme: Toolbar hydrated immediately (critical actions) */}
          <HydrationBoundary id="admin-toolbar" priority="high" trigger="immediate">
            <EntityToolbar
              searchTerm={searchTerm}
              placeholder={`Search ${activeCategory}...`}
              onSearchChange={setSearchTerm}
              onCreate={handleCreate}
            />
          </HydrationBoundary>

          {/* Enzyme: Data table hydrated when visible (main content) */}
          <HydrationBoundary id="admin-data-table" priority="normal" trigger="visible">
            <div className="flex-1 overflow-auto p-0 md:p-4">
              <EntityTable
                items={listItems}
                activeCategory={activeCategory}
                onEdit={handleEdit}
                onDelete={handleDelete}
              />
              <EntityCardList items={listItems} onEdit={handleEdit} onDelete={handleDelete} />
            </div>
          </HydrationBoundary>
        </div>
      </div>
    </div>
  );
};
