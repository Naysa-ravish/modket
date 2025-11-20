import { useEffect } from 'react';
import { useForm } from 'react-hook-form';
import { useAuth } from '../../context/AuthContext';
import Input from '../../components/ui/Input';
import Textarea from '../../components/ui/Textarea';
import Button from '../../components/ui/Button';
import authService from '../../services/authService';

const Profile = () => {
  const { user, refreshProfile } = useAuth();
  const { register, handleSubmit, reset, formState } = useForm({
    defaultValues: user,
  });

  useEffect(() => {
    reset(user);
  }, [user, reset]);

  const onSubmit = async (values) => {
    try {
      await authService.updateProfile(values);
      await refreshProfile();
      alert('Profile updated');
    } catch (error) {
      alert(error.message);
    }
  };

  const toggleSeller = async () => {
    try {
      await authService.toggleSeller();
      await refreshProfile();
    } catch (error) {
      alert(error.message);
    }
  };

  return (
    <section className="space-y-6">
      <h1 className="text-3xl font-bold text-brand-dark">Profile</h1>
      <form
        onSubmit={handleSubmit(onSubmit)}
        className="space-y-4 rounded-3xl border border-brand-light bg-white p-6 shadow-sm"
      >
        <div className="grid gap-4 md:grid-cols-2">
          <Input label="Name" {...register('name')} />
          <Input label="Phone" {...register('phone')} />
        </div>
        <Textarea label="Bio" rows={4} {...register('bio')} />
        <div className="rounded-2xl bg-brand-light/60 p-4">
          <p className="text-sm uppercase tracking-wide text-gray-500">
            Seller mode
          </p>
          <p className="text-lg font-semibold">
            {user?.isSeller ? 'Enabled' : 'Disabled'}
          </p>
          <Button type="button" className="mt-3" onClick={toggleSeller}>
            {user?.isSeller ? 'Disable seller mode' : 'Become a seller'}
          </Button>
        </div>
        <Button disabled={formState.isSubmitting}>
          {formState.isSubmitting ? 'Saving...' : 'Save changes'}
        </Button>
      </form>
    </section>
  );
};

export default Profile;

