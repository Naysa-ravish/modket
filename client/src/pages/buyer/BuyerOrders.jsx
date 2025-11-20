import { useEffect, useState } from 'react';
import orderService from '../../services/orderService';
import LoadingSpinner from '../../components/ui/LoadingSpinner';

const statusColors = {
  pending: 'bg-yellow-100 text-yellow-700',
  approved: 'bg-green-100 text-green-700',
  cancelled: 'bg-gray-100 text-gray-600',
};

const BuyerOrders = () => {
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const load = async () => {
      try {
        const data = await orderService.buyerOrders();
        setOrders(data);
      } catch (error) {
        alert(error.message);
      } finally {
        setLoading(false);
      }
    };
    load();
  }, []);

  if (loading) {
    return <LoadingSpinner />;
  }

  return (
    <section className="space-y-6">
      <h1 className="text-3xl font-bold text-brand-dark">My orders</h1>
      <div className="space-y-4">
        {orders.map((order) => (
          <div
            key={order._id}
            className="rounded-2xl border border-brand-light bg-white p-4 shadow-sm"
          >
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm uppercase tracking-wide text-gray-500">
                  {order.product?.category}
                </p>
                <p className="text-xl font-semibold text-brand-dark">
                  {order.product?.title}
                </p>
              </div>
              <span
                className={`rounded-full px-3 py-1 text-xs font-semibold ${
                  statusColors[order.status] || 'bg-gray-100 text-gray-500'
                }`}
              >
                {order.status}
              </span>
            </div>
            <p className="mt-2 text-sm text-gray-500">
              Seller: {order.seller?.name || 'Seller'}
            </p>
            <p className="text-sm text-gray-500">
              Ordered on {new Date(order.createdAt).toLocaleString()}
            </p>
          </div>
        ))}
        {!orders.length && <p>No orders yet.</p>}
      </div>
    </section>
  );
};

export default BuyerOrders;

