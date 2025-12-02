import { createFileRoute, useNavigate } from '@tanstack/react-router';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { useRegister } from '@api/hooks';
import { Link } from '@tanstack/react-router';

const registerSchema = z.object({
  name: z.string().min(2, 'Name must be at least 2 characters'),
  email: z.string().email('Invalid email address'),
  password: z.string().min(8, 'Password must be at least 8 characters'),
  confirmPassword: z.string(),
}).refine((data) => data.password === data.confirmPassword, {
  message: "Passwords don't match",
  path: ['confirmPassword'],
});

type RegisterFormData = z.infer<typeof registerSchema>;

export const Route = createFileRoute('/auth/register')({
  component: RegisterPage,
});

function RegisterPage() {
  const navigate = useNavigate();
  const registerMutation = useRegister();

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<RegisterFormData>({
    resolver: zodResolver(registerSchema),
  });

  const onSubmit = async (data: RegisterFormData) => {
    try {
      await registerMutation.mutateAsync({
        name: data.name,
        email: data.email,
        password: data.password,
      });
      navigate({ to: '/dashboard' });
    } catch (error) {
      console.error('Register error:', error);
    }
  };

  return (
    <div className="w-full max-w-md space-y-8">
      <div className="text-center">
        <h2 className="text-3xl font-bold text-dark-text">Create your account</h2>
        <p className="mt-2 text-dark-text-muted">
          Get started with LexiFlow AI
        </p>
      </div>

      <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
        <div>
          <label htmlFor="name" className="block text-sm font-medium text-dark-text mb-2">
            Full name
          </label>
          <input
            {...register('name')}
            type="text"
            id="name"
            className="w-full px-4 py-2 bg-dark-elevated border border-dark-border rounded-enterprise text-dark-text placeholder:text-dark-text-muted focus:outline-none focus:ring-2 focus:ring-primary-500"
            placeholder="John Doe"
          />
          {errors.name && (
            <p className="mt-1 text-sm text-red-500">{errors.name.message}</p>
          )}
        </div>

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

        <div>
          <label htmlFor="confirmPassword" className="block text-sm font-medium text-dark-text mb-2">
            Confirm password
          </label>
          <input
            {...register('confirmPassword')}
            type="password"
            id="confirmPassword"
            className="w-full px-4 py-2 bg-dark-elevated border border-dark-border rounded-enterprise text-dark-text placeholder:text-dark-text-muted focus:outline-none focus:ring-2 focus:ring-primary-500"
            placeholder="••••••••"
          />
          {errors.confirmPassword && (
            <p className="mt-1 text-sm text-red-500">{errors.confirmPassword.message}</p>
          )}
        </div>

        {registerMutation.error && (
          <div className="p-3 bg-red-500/10 border border-red-500/20 rounded-enterprise">
            <p className="text-sm text-red-500">
              {(registerMutation.error as Error).message}
            </p>
          </div>
        )}

        <button
          type="submit"
          disabled={registerMutation.isPending}
          className="w-full px-4 py-2 bg-primary-600 hover:bg-primary-700 text-white rounded-enterprise font-medium transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
        >
          {registerMutation.isPending ? 'Creating account...' : 'Create account'}
        </button>
      </form>

      <p className="text-center text-sm text-dark-text-muted">
        Already have an account?{' '}
        <Link to="/auth/login" className="text-primary-500 hover:text-primary-400">
          Sign in
        </Link>
      </p>
    </div>
  );
}
