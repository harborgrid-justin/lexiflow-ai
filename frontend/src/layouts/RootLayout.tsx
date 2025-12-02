import { useUIStore } from '@stores/ui.store';
import Sidebar from '@components/ui/Sidebar';
import Header from '@components/ui/Header';
import CommandPalette from '@components/ui/CommandPalette';
import Breadcrumb from '@components/ui/Breadcrumb';
import { cn } from '@lib/utils';

interface RootLayoutProps {
  children: React.ReactNode;
}

export default function RootLayout({ children }: RootLayoutProps) {
  const { sidebarState } = useUIStore();
  const isExpanded = sidebarState === 'expanded';

  return (
    <div className="min-h-screen bg-dark-bg">
      <Sidebar />
      <Header />
      <CommandPalette />

      {/* Main content */}
      <main
        className={cn(
          'pt-16 transition-all duration-300',
          isExpanded ? 'ml-60' : 'ml-16'
        )}
      >
        <div className="p-6 max-w-[1920px] mx-auto">
          <Breadcrumb />
          {children}
        </div>
      </main>
    </div>
  );
}
