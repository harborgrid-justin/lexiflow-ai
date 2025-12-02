import { createFileRoute, useNavigate } from '@tanstack/react-router';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { useLogin } from '@api/hooks';
import { Link } from '@tanstack/react-router';

const loginSchema = z.object({
  email: z.string().email('Invalid email address'),
  password: z.string().min(8, 'Password must be at least 8 characters'),
});

type LoginFormData = z.infer<typeof loginSchema>;

export const Route = createFileRoute('/auth/login')({
  component: LoginPage,
});

function LoginPage() {
  const navigate = useNavigate();
  const loginMutation = useLogin();

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<LoginFormData>({
    resolver: zodResolver(loginSchema),
  });

  const onSubmit = async (data: LoginFormData) => {
    try {
      await loginMutation.mutateAsync(data);
      navigate({ to: '/dashboard' });
    } catch (error) {
      console.error('Login error:', error);
    }
  };

  return (
    <div className="w-full max-w-md space-y-8">
      <div className="text-center">
        <h2 className="text-3xl font-bold text-dark-text">Sign in to LexiFlow AI</h2>
        <p className="mt-2 text-dark-text-muted">
          Enterprise Legal Research Platform
        </p>
      </div>

      <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
        <div>
          <label htmlFor="email" className="block text-sm font-medium text-dark-text mb-2">
            Email address
          </label>
          <input
            {...register('email')}
            type="email"
            id="email"
            className="w-full px-4 py-2 bg-dark-elevated border border-dark-border rounded-enterprise text-dark-text placeholder:text-dark-text-muted focus:outline-none focus:ring-2 focus:ring-primary-500"
            placeholder="you@example.com"
          />
          {errors.email && (
            <p className="mt-1 text-sm text-red-500">{errors.email.message}</p>
          )}
        </div>

        <div>
          <label htmlFor="password" className="block text-sm font-medium text-dark-text mb-2">
            Password
          </label>
          <input
            {...register('password')}
            type="password"
            id="password"
            className="w-full px-4 py-2 bg-dark-elevated border border-dark-border rounded-enterprise text-dark-text placeholder:text-dark-text-muted focus:outline-none focus:ring-2 focus:ring-primary-500"
            placeholder="••••••••"
          />
          {errors.password && (
            <p className="mt-1 text-sm text-red-500">{errors.password.message}</p>
          )}
        </div>

        {loginMutation.error && (
          <div className="p-3 bg-red-500/10 border border-red-500/20 rounded-enterprise">
            <p className="text-sm text-red-500">
              {(loginMutation.error as Error).message}
            </p>
          </div>
        )}

        <button
          type="submit"
          disabled={loginMutation.isPending}
          className="w-full px-4 py-2 bg-primary-600 hover:bg-primary-700 text-white rounded-enterprise font-medium transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
        >
          {loginMutation.isPending ? 'Signing in...' : 'Sign in'}
        </button>
      </form>

      <p className="text-center text-sm text-dark-text-muted">
        Don't have an account?{' '}
        <Link to="/auth/register" className="text-primary-500 hover:text-primary-400">
          Sign up
        </Link>
      </p>
    </div>
  );
}
