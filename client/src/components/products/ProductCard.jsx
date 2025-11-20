const assetBase =
  import.meta.env.VITE_API_URL?.replace('/api', '') || 'http://localhost:5000';

const resolveImage = (url) => {
  if (!url) return null;
  return url.startsWith('http') ? url : `${assetBase}${url}`;
};

const ProductCard = ({ product }) => {
  const cover = resolveImage(product.images?.[0]?.url);

  return (
    <a
      href={`/product/${product._id}`}
      className="rounded-2xl border border-white/60 bg-white shadow-sm transition hover:-translate-y-1 hover:shadow-lg"
    >
      <div className="aspect-square overflow-hidden rounded-t-2xl bg-brand-light">
        {cover ? (
          <img
            src={cover}
            alt={product.title}
            className="h-full w-full object-cover"
          />
        ) : (
          <div className="flex h-full items-center justify-center text-brand-pink">
            No Image
          </div>
        )}
      </div>
      <div className="space-y-2 p-4">
        <p className="text-xs uppercase tracking-wide text-brand-pink">
          {product.category || 'General'}
        </p>
        <h3 className="text-lg font-semibold text-brand-dark">{product.title}</h3>
        <p className="text-sm text-brand-dark/70">{product.description}</p>
        <div className="flex items-center justify-between pt-2">
          <span className="text-xl font-bold text-brand-pink">
            ₹{Number(product.price).toLocaleString()}
          </span>
          <span className="text-xs uppercase tracking-wide text-gray-400">
            {product.condition?.replace('-', ' ') || 'used'}
          </span>
        </div>
      </div>
    </a>
  );
};

export default ProductCard;

