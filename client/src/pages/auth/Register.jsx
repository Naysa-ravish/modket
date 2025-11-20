import { useForm } from 'react-hook-form';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import Input from '../../components/ui/Input';
import Button from '../../components/ui/Button';

const Register = () => {
  const { register: registerUser } = useAuth();
  const navigate = useNavigate();
  const {
    register,
    handleSubmit,
    watch,
    formState: { errors, isSubmitting },
  } = useForm();

  const onSubmit = async (values) => {
    try {
      await registerUser(values);
      navigate('/');
    } catch (error) {
      alert(error.message);
    }
  };

  return (
    <section className="mx-auto max-w-md rounded-3xl border border-brand-light bg-white/90 p-8 shadow-lg">
      <h1 className="mb-6 text-3xl font-bold text-brand-dark">Join Modket</h1>
      <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
        <Input
          label="Full name"
          {...register('name', { required: 'Name is required' })}
          error={errors.name?.message}
        />
        <Input
          label="Campus email"
          type="email"
          placeholder="you@modyuniversity.ac.in"
          {...register('email', {
            required: 'Email is required',
            validate: (value) =>
              value.endsWith('@modyuniversity.ac.in') ||
              'Use your modyuniversity.ac.in email',
          })}
          error={errors.email?.message}
        />
        <Input
          label="Password"
          type="password"
          {...register('password', {
            required: 'Password is required',
            minLength: { value: 6, message: 'At least 6 characters' },
          })}
          error={errors.password?.message}
        />
        <Input
          label="Confirm password"
          type="password"
          {...register('confirmPassword', {
            validate: (value) => value === watch('password') || 'Passwords mismatch',
          })}
          error={errors.confirmPassword?.message}
        />
        <Button className="w-full" disabled={isSubmitting}>
          {isSubmitting ? 'Creating account...' : 'Sign up'}
        </Button>
      </form>
      <p className="mt-4 text-center text-sm text-gray-500">
        Already have an account?{' '}
        <button
          type="button"
          className="text-brand-pink underline"
          onClick={() => navigate('/login')}
        >
          Login
        </button>
      </p>
    </section>
  );
};

export default Register;

