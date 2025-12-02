import { createFileRoute, Outlet, redirect } from '@tanstack/react-router';
import { useAuthStore } from '@stores/auth.store';
import AuthLayout from '@layouts/AuthLayout';

export const Route = createFileRoute('/auth')({
  beforeLoad: () => {
    const { isAuthenticated } = useAuthStore.getState();
    if (isAuthenticated) {
      throw redirect({ to: '/dashboard' });
    }
  },
  component: AuthLayoutWrapper,
});

function AuthLayoutWrapper() {
  return (
    <AuthLayout>
      <Outlet />
    </AuthLayout>
  );
}
