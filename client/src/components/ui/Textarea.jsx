const Textarea = ({ label, error, className, ...props }) => (
  <label className="flex flex-col gap-1 text-sm font-medium text-brand-dark">
    {label}
    <textarea
      className={`rounded-lg border border-gray-200 px-3 py-2 focus:border-brand-pink focus:outline-none focus:ring-2 focus:ring-brand-pink/30 ${className}`}
      rows={4}
      {...props}
    />
    {error && <span className="text-xs text-red-500">{error}</span>}
  </label>
);

export default Textarea;

