import { useEffect, useState } from 'react';
import productService from '../../services/productService';
import orderService from '../../services/orderService';
import activityService from '../../services/activityService';
import StatsCard from '../../components/dashboard/StatsCard';
import ActivityFeed from '../../components/dashboard/ActivityFeed';
import LoadingSpinner from '../../components/ui/LoadingSpinner';

const SellerDashboard = () => {
  const [products, setProducts] = useState([]);
  const [orders, setOrders] = useState([]);
  const [activities, setActivities] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const load = async () => {
      try {
        const [productData, orderData, activityData] = await Promise.all([
          productService.mine(),
          orderService.sellerOrders(),
          activityService.recent(),
        ]);
        setProducts(productData);
        setOrders(orderData);
        setActivities(activityData);
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

  const approvedOrders = orders.filter((o) => o.status === 'approved').length;

  return (
    <section className="space-y-8">
      <h1 className="text-3xl font-bold text-brand-dark">Seller dashboard</h1>
      <div className="grid gap-4 md:grid-cols-3">
        <StatsCard label="Active listings" value={products.length} icon="📦" />
        <StatsCard
          label="Pending orders"
          value={orders.filter((o) => o.status === 'pending').length}
          icon="⏳"
        />
        <StatsCard label="Sold items" value={approvedOrders} icon="✅" />
      </div>
      <ActivityFeed items={activities} />
    </section>
  );
};

export default SellerDashboard;

