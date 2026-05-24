import React, { useState } from 'react';
import { useParams, useNavigate, Link } from 'react-router-dom';
import { Star, ShoppingCart, ArrowLeft, Shield, Truck, RefreshCw, Plus, Minus, ChevronRight, Zap } from 'lucide-react';
import { useApp } from '../context/AppContext';
import toast from 'react-hot-toast';

const ProductDetailPage: React.FC = () => {
  const { id } = useParams();
  const { products, addToCart, currentUser } = useApp();
  const navigate = useNavigate();
  const [quantity, setQuantity] = useState(1);
  const [activeTab, setActiveTab] = useState<'description' | 'specs'>('description');

  const product = products.find(p => p.id === id);
  const relatedProducts = products.filter(p => p.category === product?.category && p.id !== id).slice(0, 4);

  if (!product) {
    return (
      <div className="bg-[#070714] min-h-screen flex items-center justify-center">
        <div className="text-center">
          <div className="text-6xl mb-4">😕</div>
          <h2 className="text-white text-2xl font-bold mb-4">Product not found</h2>
          <Link to="/products" className="text-blue-400 hover:text-blue-300 font-medium">← Back to Products</Link>
        </div>
      </div>
    );
  }

  const discount = product.originalPrice ? Math.round((1 - product.price / product.originalPrice) * 100) : null;

  const handleAddToCart = () => {
    if (!currentUser) { navigate('/login'); return; }
    addToCart(product, quantity);
    toast.success(`${product.name} added to cart!`, { style: { background: '#1a1a3e', color: '#fff', border: '1px solid rgba(255,255,255,0.1)' } });
  };

  const handleBuyNow = () => {
    if (!currentUser) { navigate('/login'); return; }
    addToCart(product, quantity);
    navigate('/cart');
  };

  return (
    <div className="bg-[#070714] min-h-screen">
      <div className="max-w-7xl mx-auto px-4 py-10">
        {/* Breadcrumb */}
        <nav className="flex items-center gap-2 text-sm text-gray-500 mb-8">
          <Link to="/" className="hover:text-gray-300 transition-colors">Home</Link>
          <ChevronRight size={14} />
          <Link to="/products" className="hover:text-gray-300 transition-colors">Products</Link>
          <ChevronRight size={14} />
          <Link to={`/products?category=${product.category}`} className="hover:text-gray-300 transition-colors">{product.category}</Link>
          <ChevronRight size={14} />
          <span className="text-gray-300 truncate max-w-xs">{product.name}</span>
        </nav>

        <button onClick={() => navigate(-1)} className="flex items-center gap-2 text-gray-400 hover:text-white text-sm mb-6 transition-colors">
          <ArrowLeft size={16} /> Back
        </button>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 mb-16">
          {/* Image */}
          <div className="space-y-4">
            <div className="relative rounded-3xl overflow-hidden bg-gradient-to-br from-[#1a1a3e] to-[#0d0d2b] aspect-square flex items-center justify-center border border-white/10">
              <img src={product.image} alt={product.name} className="w-full h-full object-cover" />
              {product.badge && (
                <span className="absolute top-5 left-5 bg-gradient-to-r from-blue-600 to-blue-500 text-white font-bold px-4 py-1.5 rounded-full text-sm">
                  {product.badge}
                </span>
              )}
              {discount && (
                <span className="absolute top-5 right-5 bg-red-500 text-white font-bold px-4 py-1.5 rounded-full text-sm">
                  -{discount}% OFF
                </span>
              )}
            </div>
          </div>

          {/* Details */}
          <div>
            <span className="text-blue-400 text-sm font-semibold bg-blue-500/10 px-3 py-1 rounded-full">{product.category}</span>
            <h1 className="text-3xl md:text-4xl font-black text-white mt-4 mb-3 leading-tight">{product.name}</h1>

            {/* Rating */}
            <div className="flex items-center gap-3 mb-4">
              <div className="flex items-center gap-1">
                {[...Array(5)].map((_, i) => (
                  <Star key={i} size={16} fill={i < Math.floor(product.rating) ? '#f59e0b' : 'none'} className="text-yellow-400" />
                ))}
              </div>
              <span className="text-white font-bold">{product.rating}</span>
              <span className="text-gray-500 text-sm">({product.reviews} reviews)</span>
            </div>

            {/* Price */}
            <div className="flex items-end gap-4 mb-6">
              <span className="text-4xl font-black text-white">Rs. {product.price.toLocaleString()}</span>
              {product.originalPrice && (
                <div>
                  <span className="text-gray-500 text-lg line-through">Rs. {product.originalPrice.toLocaleString()}</span>
                  <span className="text-green-400 text-sm font-bold ml-2">Save Rs. {(product.originalPrice - product.price).toLocaleString()}</span>
                </div>
              )}
            </div>

            {/* Stock */}
            <div className={`inline-flex items-center gap-2 px-3 py-1.5 rounded-full text-sm font-semibold mb-6 ${product.stock > 5 ? 'bg-green-500/10 text-green-400' : product.stock > 0 ? 'bg-orange-500/10 text-orange-400' : 'bg-red-500/10 text-red-400'}`}>
              <span className={`w-2 h-2 rounded-full ${product.stock > 5 ? 'bg-green-400' : product.stock > 0 ? 'bg-orange-400 animate-pulse' : 'bg-red-400'}`} />
              {product.stock > 5 ? 'In Stock' : product.stock > 0 ? `Only ${product.stock} left!` : 'Out of Stock'}
            </div>

            {/* Quantity */}
            <div className="flex items-center gap-4 mb-6">
              <span className="text-gray-400 text-sm font-medium">Quantity</span>
              <div className="flex items-center gap-2 bg-white/5 border border-white/10 rounded-xl p-1">
                <button onClick={() => setQuantity(q => Math.max(1, q - 1))} className="w-8 h-8 flex items-center justify-center text-gray-400 hover:text-white transition-colors rounded-lg hover:bg-white/10">
                  <Minus size={16} />
                </button>
                <span className="text-white font-bold w-8 text-center">{quantity}</span>
                <button onClick={() => setQuantity(q => Math.min(product.stock, q + 1))} className="w-8 h-8 flex items-center justify-center text-gray-400 hover:text-white transition-colors rounded-lg hover:bg-white/10">
                  <Plus size={16} />
                </button>
              </div>
            </div>

            {/* Buttons */}
            <div className="flex gap-3 mb-8">
              <button onClick={handleAddToCart} disabled={product.stock === 0}
                className="flex-1 flex items-center justify-center gap-2 bg-white/5 hover:bg-white/10 border border-white/20 hover:border-blue-500/50 text-white font-bold py-4 rounded-2xl transition-all disabled:opacity-50 disabled:cursor-not-allowed">
                <ShoppingCart size={20} /> Add to Cart
              </button>
              <button onClick={handleBuyNow} disabled={product.stock === 0}
                className="flex-1 flex items-center justify-center gap-2 bg-gradient-to-r from-blue-600 to-cyan-600 hover:from-blue-500 hover:to-cyan-500 text-white font-bold py-4 rounded-2xl transition-all shadow-2xl shadow-blue-500/25 disabled:opacity-50 disabled:cursor-not-allowed">
                <Zap size={20} /> Buy Now
              </button>
            </div>

            {/* Guarantees */}
            <div className="grid grid-cols-3 gap-3">
              {[
                { icon: Shield, text: '1 Year Warranty' },
                { icon: Truck, text: 'Fast Delivery' },
                { icon: RefreshCw, text: '7-Day Return' },
              ].map(({ icon: Icon, text }) => (
                <div key={text} className="flex flex-col items-center gap-2 bg-white/3 border border-white/8 rounded-xl py-3 px-2 text-center">
                  <Icon size={18} className="text-blue-400" />
                  <span className="text-gray-400 text-xs font-medium">{text}</span>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Tabs */}
        <div className="mb-6">
          <div className="flex gap-1 bg-white/3 border border-white/8 rounded-2xl p-1 w-fit mb-6">
            {(['description', 'specs'] as const).map(tab => (
              <button key={tab} onClick={() => setActiveTab(tab)}
                className={`px-6 py-2.5 rounded-xl text-sm font-semibold capitalize transition-all ${activeTab === tab ? 'bg-blue-600 text-white shadow-lg' : 'text-gray-400 hover:text-white'}`}>
                {tab === 'specs' ? 'Specifications' : 'Description'}
              </button>
            ))}
          </div>
          <div className="bg-[#0d0d2b] border border-white/8 rounded-2xl p-6">
            {activeTab === 'description' ? (
              <p className="text-gray-300 leading-relaxed text-base">{product.description}</p>
            ) : (
              <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                {product.specs?.map((spec: { label: string; value: string }) => (
                  <div key={spec.label} className="flex gap-3">
                    <span className="text-gray-500 text-sm font-medium min-w-24">{spec.label}:</span>
                    <span className="text-white text-sm">{spec.value}</span>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>

        {/* Related Products */}
        {relatedProducts.length > 0 && (
          <div className="mt-16">
            <h2 className="text-2xl font-black text-white mb-6">Related Products</h2>
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
              {relatedProducts.map(p => (
                <div key={p.id} onClick={() => navigate(`/products/${p.id}`)}
                  className="group bg-[#0d0d2b] border border-white/8 hover:border-blue-500/40 rounded-2xl overflow-hidden cursor-pointer transition-all hover:-translate-y-1">
                  <img src={p.image} alt={p.name} className="w-full h-36 object-cover group-hover:scale-105 transition-transform duration-500" />
                  <div className="p-3">
                    <p className="text-white text-sm font-semibold line-clamp-1">{p.name}</p>
                    <p className="text-blue-400 text-sm font-bold mt-1">Rs. {p.price.toLocaleString()}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default ProductDetailPage;
