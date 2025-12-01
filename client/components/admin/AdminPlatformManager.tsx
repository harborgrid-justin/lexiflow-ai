import React, { useState, useEffect } from 'react';
import { Users, Briefcase, FileText, Book, Building } from 'lucide-react';
import { ApiService } from '../../services/apiService';
import { EntitySidebar } from './platform/EntitySidebar';
import { EntityToolbar } from './platform/EntityToolbar';
import { EntityTable } from './platform/EntityTable';
import { EntityCardList } from './platform/EntityCardList';
import { EntityModal } from './platform/EntityModal';

type Category = 'users' | 'cases' | 'clients' | 'clauses' | 'documents';

export const AdminPlatformManager: React.FC = () => {
  const [data, setData] = useState<Record<Category, any[]>>({
    users: [],
    cases: [],
    clients: [],
    clauses: [],
    documents: [],
  });

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
        setData({
          users: u,
          cases: c,
          clients: cl,
          clauses,
          documents: d,
        });
      } catch (error) {
        console.error('Failed to fetch platform data', error);
      }
    };
    fetchData();
  }, []);

  const [activeCategory, setActiveCategory] = useState<Category>('users');
  const [searchTerm, setSearchTerm] = useState('');
  const [editingItem, setEditingItem] = useState<any>(null);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isNewItem, setIsNewItem] = useState(false);

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

  const handleEdit = (item: any) => {
    setEditingItem({ ...item });
    setIsNewItem(false);
    setIsModalOpen(true);
  };

  const handleCreate = () => {
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
  };

  const handleDelete = (id: string) => {
    if (confirm('Are you sure you want to delete this record? This action cannot be undone.')) {
      setData(prev => ({
        ...prev,
        [activeCategory]: (prev[activeCategory] as any[]).filter(item => item.id !== id)
      }));
    }
  };

  const handleSave = () => {
    if (!editingItem) return;
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
  };

  const listItems = getCurrentList();

  return (
    <div className="flex flex-col h-full bg-slate-50 rounded-lg overflow-hidden border border-slate-200">
      <EntityModal
        isOpen={isModalOpen}
        title={isNewItem ? 'Create Record' : 'Edit Record'}
        item={editingItem}
        onClose={() => setIsModalOpen(false)}
        onChange={(key, value) => setEditingItem(prev => (prev ? { ...prev, [key]: value } : prev))}
        onSave={handleSave}
      />

      <div className="flex flex-col md:flex-row flex-1 overflow-hidden">
        <EntitySidebar
          categories={categories}
          activeCategory={activeCategory}
          data={data}
          onSelect={setActiveCategory}
        />

        <div className="flex-1 flex flex-col bg-white overflow-hidden">
          <EntityToolbar
            searchTerm={searchTerm}
            placeholder={`Search ${activeCategory}...`}
            onSearchChange={setSearchTerm}
            onCreate={handleCreate}
          />

          <div className="flex-1 overflow-auto p-0 md:p-4">
            <EntityTable
              items={listItems}
              activeCategory={activeCategory}
              onEdit={handleEdit}
              onDelete={handleDelete}
            />
            <EntityCardList items={listItems} onEdit={handleEdit} onDelete={handleDelete} />
          </div>
        </div>
      </div>
    </div>
  );
};
