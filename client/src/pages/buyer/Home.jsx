import { useEffect, useState } from 'react';
import productService from '../../services/productService';
import ProductCard from '../../components/products/ProductCard';
import LoadingSpinner from '../../components/ui/LoadingSpinner';

const Home = () => {
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const load = async () => {
      try {
        const data = await productService.list();
        setProducts(data);
      } catch (error) {
        alert(error.message);
      } finally {
        setLoading(false);
      }
    };
    load();
  }, []);

  return (
    <section className="space-y-8">
      <div className="rounded-3xl bg-gradient-to-r from-brand-pink to-purple-500 p-10 text-white shadow-lg">
        <p className="mb-2 text-sm font-semibold uppercase tracking-wide">
          Mody University Market
        </p>
        <h1 className="text-4xl font-black">
          Buy & sell everything inside campus with Modket
        </h1>
        <p className="mt-4 text-lg text-white/80">
          Verified students, direct approvals, camera uploads, and real-time Q&A.
        </p>
      </div>
      {loading ? (
        <LoadingSpinner />
      ) : (
        <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
          {products.map((product) => (
            <ProductCard key={product._id} product={product} />
          ))}
        </div>
      )}
    </section>
  );
};

export default Home;

