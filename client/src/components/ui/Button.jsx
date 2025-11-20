import clsx from 'clsx';

const Button = ({ children, variant = 'primary', className, ...props }) => {
  const base =
    'inline-flex items-center justify-center rounded-lg px-4 py-2 text-sm font-semibold transition focus:outline-none focus:ring-2 focus:ring-offset-2';
  const variants = {
    primary:
      'bg-brand-pink text-white hover:bg-pink-600 focus:ring-brand-pink focus:ring-offset-brand-light',
    secondary:
      'bg-white text-brand-pink border border-brand-pink hover:bg-brand-light focus:ring-brand-pink focus:ring-offset-brand-light',
    ghost: 'text-brand-pink hover:bg-brand-light focus:ring-brand-light',
  };

  return (
    <button className={clsx(base, variants[variant], className)} {...props}>
      {children}
    </button>
  );
};

export default Button;

