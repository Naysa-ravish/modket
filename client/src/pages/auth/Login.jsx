import { useForm } from 'react-hook-form';
import { useNavigate, useLocation } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import Input from '../../components/ui/Input';
import Button from '../../components/ui/Button';

const Login = () => {
  const { login } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();
  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
  } = useForm();

  const onSubmit = async (values) => {
    try {
      await login(values);
      const redirectTo = location.state?.from?.pathname || '/';
      navigate(redirectTo, { replace: true });
    } catch (error) {
      alert(error.message);
    }
  };

  return (
    <section className="mx-auto max-w-md rounded-3xl border border-brand-light bg-white/80 p-8 shadow-lg">
      <h1 className="mb-6 text-3xl font-bold text-brand-dark">Welcome back</h1>
      <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
        <Input
          label="Campus email"
          type="email"
          placeholder="you@modyuniversity.ac.in"
          {...register('email', { required: 'Email is required' })}
          error={errors.email?.message}
        />
        <Input
          label="Password"
          type="password"
          {...register('password', { required: 'Password is required' })}
          error={errors.password?.message}
        />
        <Button className="w-full" disabled={isSubmitting}>
          {isSubmitting ? 'Signing in...' : 'Login'}
        </Button>
      </form>
      <p className="mt-4 text-center text-sm text-gray-500">
        New here?{' '}
        <button
          type="button"
          className="text-brand-pink underline"
          onClick={() => navigate('/signup')}
        >
          Create an account
        </button>
      </p>
    </section>
  );
};

export default Login;

