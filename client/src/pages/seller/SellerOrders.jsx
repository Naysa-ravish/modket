import { useCallback, useEffect, useState } from 'react';
import orderService from '../../services/orderService';
import Button from '../../components/ui/Button';
import LoadingSpinner from '../../components/ui/LoadingSpinner';

const SellerOrders = () => {
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);

  const load = useCallback(async () => {
    setLoading(true);
    try {
      const data = await orderService.sellerOrders();
      setOrders(data);
    } catch (error) {
      alert(error.message);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    load();
  }, [load]);

  const approve = async (id) => {
    try {
      await orderService.approve(id);
      load();
    } catch (error) {
      alert(error.message);
    }
  };

  const cancel = async (id) => {
    try {
      await orderService.cancel(id);
      load();
    } catch (error) {
      alert(error.message);
    }
  };

  if (loading) return <LoadingSpinner />;

  return (
    <section className="space-y-6">
      <h1 className="text-3xl font-bold text-brand-dark">Order approvals</h1>
      <div className="space-y-4">
        {orders.map((order) => (
          <div
            key={order._id}
            className="rounded-2xl border border-brand-light bg-white p-4 shadow-sm"
          >
            <div className="flex flex-wrap items-center justify-between gap-4">
              <div>
                <p className="text-sm text-gray-500">
                  Buyer: {order.buyer?.name} ({order.buyer?.email})
                </p>
                <p className="text-lg font-semibold">{order.product?.title}</p>
                <p className="text-sm text-gray-500">{order.note}</p>
              </div>
              <div className="flex gap-2">
                {order.status === 'pending' && (
                  <>
                    <Button variant="secondary" onClick={() => cancel(order._id)}>
                      Reject
                    </Button>
                    <Button onClick={() => approve(order._id)}>Approve</Button>
                  </>
                )}
                {order.status !== 'pending' && (
                  <span className="rounded-full bg-brand-light px-3 py-1 text-sm">
                    {order.status}
                  </span>
                )}
              </div>
            </div>
          </div>
        ))}
        {!orders.length && <p>No orders yet.</p>}
      </div>
    </section>
  );
};

export default SellerOrders;

