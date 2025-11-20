import { useCallback, useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import productService from '../../services/productService';
import Button from '../../components/ui/Button';
import LoadingSpinner from '../../components/ui/LoadingSpinner';

const SellerProducts = () => {
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);

  const loadProducts = useCallback(async () => {
    setLoading(true);
    try {
      const data = await productService.mine();
      setProducts(data);
    } catch (error) {
      alert(error.message);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    loadProducts();
  }, [loadProducts]);

  const deleteProduct = async (id) => {
    try {
      await productService.remove(id);
      loadProducts();
    } catch (error) {
      alert(error.message);
    }
  };

  if (loading) return <LoadingSpinner />;

  return (
    <section className="space-y-6">
      <div className="flex items-center justify-between">
        <h1 className="text-3xl font-bold text-brand-dark">My products</h1>
        <Link to="/seller/create">
          <Button>Add product</Button>
        </Link>
      </div>
      <div className="space-y-4">
        {products.map((product) => (
          <div
            key={product._id}
            className="flex flex-col gap-4 rounded-2xl border border-brand-light bg-white p-4 shadow-sm md:flex-row md:items-center md:justify-between"
          >
            <div>
              <p className="text-xs uppercase tracking-wide text-gray-500">
                {product.category}
              </p>
              <p className="text-xl font-semibold text-brand-dark">
                {product.title}
              </p>
              <p className="text-sm text-gray-500">{product.status}</p>
            </div>
            <div className="flex gap-2">
              <Button variant="secondary" onClick={() => deleteProduct(product._id)}>
                Remove
              </Button>
            </div>
          </div>
        ))}
        {!products.length && <p>No products yet.</p>}
      </div>
    </section>
  );
};

export default SellerProducts;

