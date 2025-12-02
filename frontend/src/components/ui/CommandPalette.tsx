import { useEffect, useState } from 'react';
import { useNavigate } from '@tanstack/react-router';
import { useUIStore } from '@stores/ui.store';
import { Command } from 'cmdk';
import {
  LayoutDashboard,
  Briefcase,
  FileText,
  Search,
  Receipt,
  Settings,
  FileSearch,
  Users,
  Calendar,
} from 'lucide-react';

interface CommandItem {
  id: string;
  label: string;
  group: string;
  icon: React.ComponentType<{ className?: string }>;
  action: () => void;
}

export default function CommandPalette() {
  const { commandPaletteOpen, setCommandPaletteOpen } = useUIStore();
  const [search, setSearch] = useState('');
  const navigate = useNavigate();

  const commands: CommandItem[] = [
    {
      id: 'dashboard',
      label: 'Go to Dashboard',
      group: 'Navigation',
      icon: LayoutDashboard,
      action: () => navigate({ to: '/dashboard' }),
    },
    {
      id: 'cases',
      label: 'Go to Cases',
      group: 'Navigation',
      icon: Briefcase,
      action: () => navigate({ to: '/cases' }),
    },
    {
      id: 'documents',
      label: 'Go to Documents',
      group: 'Navigation',
      icon: FileText,
      action: () => navigate({ to: '/documents' }),
    },
    {
      id: 'research',
      label: 'Go to Research',
      group: 'Navigation',
      icon: Search,
      action: () => navigate({ to: '/research' }),
    },
    {
      id: 'billing',
      label: 'Go to Billing',
      group: 'Navigation',
      icon: Receipt,
      action: () => navigate({ to: '/billing' }),
    },
    {
      id: 'settings',
      label: 'Go to Settings',
      group: 'Navigation',
      icon: Settings,
      action: () => navigate({ to: '/settings' }),
    },
    {
      id: 'new-case',
      label: 'Create New Case',
      group: 'Actions',
      icon: Briefcase,
      action: () => {
        navigate({ to: '/cases' });
        // TODO: Open create case modal
      },
    },
    {
      id: 'upload-document',
      label: 'Upload Document',
      group: 'Actions',
      icon: FileSearch,
      action: () => {
        navigate({ to: '/documents' });
        // TODO: Open upload document modal
      },
    },
    {
      id: 'new-research',
      label: 'Start New Research',
      group: 'Actions',
      icon: Search,
      action: () => navigate({ to: '/research' }),
    },
  ];

  // Handle keyboard shortcuts
  useEffect(() => {
    const down = (e: KeyboardEvent) => {
      if (e.key === 'k' && (e.metaKey || e.ctrlKey)) {
        e.preventDefault();
        setCommandPaletteOpen(!commandPaletteOpen);
      }
    };

    document.addEventListener('keydown', down);
    return () => document.removeEventListener('keydown', down);
  }, [commandPaletteOpen, setCommandPaletteOpen]);

  if (!commandPaletteOpen) return null;

  const handleSelect = (action: () => void) => {
    action();
    setCommandPaletteOpen(false);
    setSearch('');
  };

  return (
    <div className="fixed inset-0 z-50 flex items-start justify-center pt-20 px-4">
      {/* Backdrop */}
      <div
        className="fixed inset-0 bg-black/50 backdrop-blur-sm"
        onClick={() => setCommandPaletteOpen(false)}
      />

      {/* Command palette */}
      <Command
        className="relative w-full max-w-2xl bg-dark-elevated border border-dark-border rounded-enterprise shadow-enterprise-xl overflow-hidden"
        shouldFilter={true}
      >
        <div className="flex items-center border-b border-dark-border px-4">
          <Search className="w-5 h-5 text-dark-text-muted mr-3" />
          <Command.Input
            value={search}
            onValueChange={setSearch}
            placeholder="Search for commands, pages, or actions..."
            className="w-full py-4 bg-transparent border-0 outline-none text-dark-text placeholder:text-dark-text-muted"
          />
        </div>

        <Command.List className="max-h-96 overflow-y-auto p-2">
          <Command.Empty className="py-6 text-center text-sm text-dark-text-muted">
            No results found.
          </Command.Empty>

          {/* Group by category */}
          {['Navigation', 'Actions'].map((group) => (
            <Command.Group
              key={group}
              heading={group}
              className="[&_[cmdk-group-heading]]:px-3 [&_[cmdk-group-heading]]:py-2 [&_[cmdk-group-heading]]:text-xs [&_[cmdk-group-heading]]:font-semibold [&_[cmdk-group-heading]]:text-dark-text-muted [&_[cmdk-group-heading]]:uppercase [&_[cmdk-group-heading]]:tracking-wider"
            >
              {commands
                .filter((cmd) => cmd.group === group)
                .map((cmd) => {
                  const Icon = cmd.icon;
                  return (
                    <Command.Item
                      key={cmd.id}
                      onSelect={() => handleSelect(cmd.action)}
                      className="flex items-center px-3 py-2.5 rounded-enterprise cursor-pointer text-dark-text hover:bg-primary-600 hover:text-white transition-colors aria-selected:bg-primary-600 aria-selected:text-white"
                    >
                      <Icon className="w-5 h-5 mr-3" />
                      <span>{cmd.label}</span>
                    </Command.Item>
                  );
                })}
            </Command.Group>
          ))}
        </Command.List>

        <div className="flex items-center justify-between px-4 py-3 border-t border-dark-border bg-dark-surface/50">
          <div className="flex items-center space-x-4 text-xs text-dark-text-muted">
            <span className="flex items-center">
              <kbd className="px-2 py-1 bg-dark-elevated border border-dark-border rounded mr-1">
                ↑↓
              </kbd>
              Navigate
            </span>
            <span className="flex items-center">
              <kbd className="px-2 py-1 bg-dark-elevated border border-dark-border rounded mr-1">
                ↵
              </kbd>
              Select
            </span>
            <span className="flex items-center">
              <kbd className="px-2 py-1 bg-dark-elevated border border-dark-border rounded mr-1">
                Esc
              </kbd>
              Close
            </span>
          </div>
        </div>
      </Command>
    </div>
  );
}
