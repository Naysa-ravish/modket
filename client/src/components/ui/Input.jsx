import clsx from 'clsx';

const Input = ({ label, className, error, ...props }) => (
  <label className="flex flex-col gap-1 text-sm font-medium text-brand-dark">
    {label}
    <input
      className={clsx(
        'rounded-lg border border-gray-200 px-3 py-2 focus:border-brand-pink focus:outline-none focus:ring-2 focus:ring-brand-pink/30',
        className,
      )}
      {...props}
    />
    {error && <span className="text-xs text-red-500">{error}</span>}
  </label>
);

export default Input;

