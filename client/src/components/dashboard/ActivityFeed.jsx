const icons = {
  'product.create': '🛒',
  'order.create': '📩',
  'order.approve': '✅',
  'question.ask': '❓',
  'question.answer': '💬',
  'image.upload': '📷',
};

const ActivityFeed = ({ items = [] }) => (
  <div className="rounded-2xl border border-brand-light bg-white p-4 shadow-sm">
    <h3 className="mb-4 text-lg font-semibold text-brand-dark">Activity</h3>
    <div className="space-y-3">
      {items.map((item) => (
        <div key={item._id} className="flex items-start gap-3 text-sm">
          <span className="text-xl">{icons[item.type] || '✨'}</span>
          <div>
            <p className="font-medium text-brand-dark">{item.type}</p>
            <p className="text-gray-500">
              {item.actor?.name || 'System'} •{' '}
              {new Date(item.createdAt).toLocaleString()}
            </p>
          </div>
        </div>
      ))}
      {!items.length && <p className="text-gray-500">No activity yet</p>}
    </div>
  </div>
);

export default ActivityFeed;

