const StatsCard = ({ label, value, sublabel, icon }) => (
  <div className="rounded-2xl border border-brand-light bg-white p-4 shadow-sm">
    <div className="flex items-center justify-between">
      <div>
        <p className="text-sm uppercase tracking-wide text-gray-500">{label}</p>
        <p className="text-3xl font-bold text-brand-dark">{value}</p>
        {sublabel && <p className="text-sm text-gray-500">{sublabel}</p>}
      </div>
      <span className="text-3xl">{icon}</span>
    </div>
  </div>
);

export default StatsCard;

