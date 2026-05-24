import { useState, useEffect } from 'react';
import { useParams, Link, useNavigate } from 'react-router-dom';
import { ShoppingCart, Star, Truck, Shield, RefreshCw, CheckCircle, Minus, Plus, Share2 } from 'lucide-react';
import { productService } from '../services/db';
import { Product, useStore } from '../store/useStore';
import toast from 'react-hot-toast';
import ProductCard from '../components/ProductCard';

export default function ProductDetailPage() {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const { addToCart, user } = useStore();
  const [product, setProduct] = useState<Product | null>(null);
  const [relatedProducts, setRelatedProducts] = useState<Product[]>([]);
  const [selectedImage, setSelectedImage] = useState(0);
  const [quantity, setQuantity] = useState(1);
  const [loading, setLoading] = useState(true);
  const [activeTab, setActiveTab] = useState<'description' | 'specs'>('description');

  useEffect(() => {
    if (!id) return;
    setLoading(true);
    const p = productService.getById(id);
    if (p) {
      setProduct(p);
      setRelatedProducts(
        productService.getAll({ category: p.category }).filter((rp) => rp._id !== id).slice(0, 4)
      );
    }
    setLoading(false);
    window.scrollTo(0, 0);
  }, [id]);

  const handleAddToCart = () => {
    if (!user) {
      toast.error('Please login to add items to cart');
      navigate('/login');
      return;
    }
    if (!product) return;
    addToCart(product, quantity);
    toast.success(`${product.name} added to cart!`);
  };

  const handleBuyNow = () => {
    if (!user) {
      toast.error('Please login to continue');
      navigate('/login');
      return;
    }
    if (!product) return;
    addToCart(product, quantity);
    navigate('/cart');
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="animate-spin w-10 h-10 border-4 border-blue-600 border-t-transparent rounded-full" />
      </div>
    );
  }

  if (!product) {
    return (
      <div className="min-h-screen bg-gray-50 flex flex-col items-center justify-center gap-4">
        <p className="text-5xl">😕</p>
        <h2 className="text-xl font-semibold text-gray-900">Product not found</h2>
        <Link to="/products" className="text-blue-600 hover:underline">Back to Products</Link>
      </div>
    );
  }

  const discount = product.originalPrice
    ? Math.round(((product.originalPrice - product.price) / product.originalPrice) * 100)
    : 0;

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
        {/* Breadcrumb */}
        <div className="flex items-center gap-2 text-sm text-gray-500 mb-6">
          <Link to="/" className="hover:text-blue-600">Home</Link>
          <span>/</span>
          <Link to="/products" className="hover:text-blue-600">Products</Link>
          <span>/</span>
          <Link to={`/products?category=${product.category}`} className="hover:text-blue-600">{product.category}</Link>
          <span>/</span>
          <span className="text-gray-900 font-medium truncate max-w-48">{product.name}</span>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 bg-white rounded-2xl p-6 shadow-sm border border-gray-100">
          {/* Images */}
          <div>
            <div className="aspect-square bg-gray-50 rounded-xl overflow-hidden mb-3">
              <img
                src={product.images[selectedImage] || 'https://images.unsplash.com/photo-1505740420928-5e560c06d30e?w=600'}
                alt={product.name}
                className="w-full h-full object-cover"
                onError={(e) => {
                  (e.target as HTMLImageElement).src = 'https://images.unsplash.com/photo-1505740420928-5e560c06d30e?w=600';
                }}
              />
            </div>
            {product.images.length > 1 && (
              <div className="flex gap-2 flex-wrap">
                {product.images.map((img, i) => (
                  <button
                    key={i}
                    onClick={() => setSelectedImage(i)}
                    className={`w-16 h-16 rounded-lg overflow-hidden border-2 transition-colors ${
                      selectedImage === i ? 'border-blue-600' : 'border-transparent'
                    }`}
                  >
                    <img src={img} alt="" className="w-full h-full object-cover" />
                  </button>
                ))}
              </div>
            )}
          </div>

          {/* Product Info */}
          <div>
            <div className="flex items-start justify-between gap-2 mb-2">
              <span className="text-sm text-blue-600 font-semibold bg-blue-50 px-3 py-1 rounded-full">
                {product.category}
              </span>
              <button
                onClick={() => {
                  navigator.clipboard?.writeText(window.location.href);
                  toast.success('Link copied!');
                }}
                className="p-2 text-gray-400 hover:text-gray-600 hover:bg-gray-100 rounded-lg transition-colors"
              >
                <Share2 size={16} />
              </button>
            </div>

            <h1 className="text-2xl sm:text-3xl font-black text-gray-900 mb-3 leading-tight">{product.name}</h1>

            {/* Rating */}
            <div className="flex items-center gap-2 mb-4">
              <div className="flex">
                {[...Array(5)].map((_, i) => (
                  <Star key={i} size={16} className={i < Math.floor(product.rating) ? 'text-yellow-400 fill-yellow-400' : 'text-gray-200 fill-gray-200'} />
                ))}
              </div>
              <span className="text-sm font-medium text-gray-700">{product.rating}</span>
              <span className="text-sm text-gray-500">({product.reviewCount} reviews)</span>
            </div>

            {/* Price */}
            <div className="bg-gray-50 rounded-xl p-4 mb-5">
              <div className="flex items-baseline gap-3">
                <span className="text-3xl font-black text-gray-900">Rs. {product.price.toLocaleString()}</span>
                {product.originalPrice && (
                  <span className="text-lg text-gray-400 line-through">Rs. {product.originalPrice.toLocaleString()}</span>
                )}
              </div>
              {discount > 0 && (
                <div className="mt-1 inline-flex items-center gap-1 bg-red-100 text-red-600 text-sm font-semibold px-2 py-0.5 rounded">
                  You save Rs. {(product.originalPrice! - product.price).toLocaleString()} ({discount}% off)
                </div>
              )}
            </div>

            {/* Stock Status */}
            <div className={`flex items-center gap-2 mb-5 text-sm font-medium ${product.stock > 0 ? 'text-green-600' : 'text-red-500'}`}>
              <CheckCircle size={16} />
              {product.stock > 0 ? `In Stock (${product.stock} available)` : 'Out of Stock'}
            </div>

            {/* SKU */}
            <p className="text-xs text-gray-400 mb-5">SKU: {product.sku}</p>

            {/* Quantity */}
            {product.stock > 0 && (
              <div className="flex items-center gap-4 mb-5">
                <span className="text-sm font-medium text-gray-700">Quantity:</span>
                <div className="flex items-center gap-0">
                  <button
                    onClick={() => setQuantity(Math.max(1, quantity - 1))}
                    className="w-9 h-9 rounded-l-xl border border-gray-200 flex items-center justify-center hover:bg-gray-50 transition-colors"
                  >
                    <Minus size={14} />
                  </button>
                  <span className="w-12 h-9 border-t border-b border-gray-200 flex items-center justify-center text-sm font-semibold">
                    {quantity}
                  </span>
                  <button
                    onClick={() => setQuantity(Math.min(product.stock, quantity + 1))}
                    className="w-9 h-9 rounded-r-xl border border-gray-200 flex items-center justify-center hover:bg-gray-50 transition-colors"
                  >
                    <Plus size={14} />
                  </button>
                </div>
              </div>
            )}

            {/* Buttons */}
            <div className="flex gap-3 mb-6">
              <button
                onClick={handleAddToCart}
                disabled={product.stock === 0}
                className="flex-1 flex items-center justify-center gap-2 border-2 border-blue-600 text-blue-600 hover:bg-blue-50 disabled:border-gray-300 disabled:text-gray-400 py-3 rounded-xl font-semibold transition-colors"
              >
                <ShoppingCart size={18} /> Add to Cart
              </button>
              <button
                onClick={handleBuyNow}
                disabled={product.stock === 0}
                className="flex-1 bg-blue-600 hover:bg-blue-700 disabled:bg-gray-300 text-white py-3 rounded-xl font-semibold transition-colors shadow-lg shadow-blue-200"
              >
                Buy Now
              </button>
            </div>

            {/* Features */}
            <div className="grid grid-cols-3 gap-2 border-t border-gray-100 pt-5">
              {[
                { icon: <Truck size={16} />, text: 'Fast Delivery' },
                { icon: <Shield size={16} />, text: 'Warranty' },
                { icon: <RefreshCw size={16} />, text: '7-Day Return' },
              ].map((f) => (
                <div key={f.text} className="text-center">
                  <div className="w-9 h-9 bg-blue-50 text-blue-600 rounded-lg flex items-center justify-center mx-auto mb-1">
                    {f.icon}
                  </div>
                  <p className="text-xs text-gray-500">{f.text}</p>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Tabs */}
        <div className="bg-white rounded-2xl p-6 shadow-sm border border-gray-100 mt-6">
          <div className="flex gap-4 border-b border-gray-100 mb-5">
            {(['description', 'specs'] as const).map((tab) => (
              <button
                key={tab}
                onClick={() => setActiveTab(tab)}
                className={`pb-3 text-sm font-semibold capitalize border-b-2 transition-colors ${
                  activeTab === tab ? 'border-blue-600 text-blue-600' : 'border-transparent text-gray-500 hover:text-gray-700'
                }`}
              >
                {tab === 'specs' ? 'Specifications' : 'Description'}
              </button>
            ))}
          </div>

          {activeTab === 'description' ? (
            <p className="text-gray-700 leading-relaxed">{product.description}</p>
          ) : (
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              {product.specifications && Object.entries(product.specifications).map(([key, val]) => (
                <div key={key} className="flex items-start gap-2 bg-gray-50 rounded-lg p-3">
                  <span className="text-xs font-semibold text-gray-500 min-w-24 uppercase tracking-wide">{key}</span>
                  <span className="text-sm text-gray-900">{val}</span>
                </div>
              ))}
            </div>
          )}
        </div>

        {/* Related Products */}
        {relatedProducts.length > 0 && (
          <div className="mt-10">
            <h2 className="text-xl font-black text-gray-900 mb-5">Related Products</h2>
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
              {relatedProducts.map((p) => (
                <ProductCard key={p._id} product={p} />
              ))}
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
