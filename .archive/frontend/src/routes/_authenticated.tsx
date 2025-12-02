import { createFileRoute, Outlet, redirect } from '@tanstack/react-router';
import { useAuthStore } from '@stores/auth.store';
import RootLayout from '@layouts/RootLayout';

export const Route = createFileRoute('/_authenticated')({
  beforeLoad: () => {
    const { isAuthenticated } = useAuthStore.getState();
    if (!isAuthenticated) {
      throw redirect({ to: '/auth/login' });
    }
  },
  component: AuthenticatedLayout,
});

function AuthenticatedLayout() {
  return (
    <RootLayout>
      <Outlet />
    </RootLayout>
  );
}
