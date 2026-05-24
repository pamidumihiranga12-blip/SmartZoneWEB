import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { ArrowRight, Star, ShoppingCart, Zap, ChevronLeft, ChevronRight, Sparkles, TrendingUp, Gift } from 'lucide-react';
import { useApp } from '../context/AppContext';

const HomePage: React.FC = () => {
  const { products, siteSettings, addToCart, currentUser } = useApp();
  const navigate = useNavigate();
  const [_currentSlide, setCurrentSlide] = useState(0);

  const featuredProducts = products.filter(p => p.featured);
  const allProducts = products.slice(0, 6);

  const categories = [
    { name: 'Smartphones', emoji: '📱', color: 'from-blue-500 to-blue-700' },
    { name: 'Laptops', emoji: '💻', color: 'from-purple-500 to-purple-700' },
    { name: 'Tablets', emoji: '📟', color: 'from-cyan-500 to-cyan-700' },
    { name: 'Audio', emoji: '🎧', color: 'from-pink-500 to-pink-700' },
    { name: 'Wearables', emoji: '⌚', color: 'from-orange-500 to-orange-700' },
    { name: 'Accessories', emoji: '🔌', color: 'from-green-500 to-green-700' },
  ];

  const handleAddToCart = (product: typeof products[0]) => {
    if (!currentUser) { navigate('/login'); return; }
    addToCart(product);
  };

  return (
    <div className="bg-[#070714] min-h-screen">
      {/* Announcement Bar */}
      {siteSettings.announcementEnabled && (
        <div className="bg-gradient-to-r from-blue-900 via-blue-800 to-blue-900 text-blue-100 text-center py-2.5 text-sm font-medium px-4">
          {siteSettings.announcementText}
        </div>
      )}

      {/* Special Offer Banner */}
      {siteSettings.specialOfferEnabled && (
        <div className="text-center py-3 px-4 text-sm font-semibold" style={{ backgroundColor: siteSettings.specialOfferBg }}>
          <span className="text-yellow-300">{siteSettings.specialOfferText}</span>
        </div>
      )}

      {/* Hero Section */}
      <section className="relative overflow-hidden min-h-[88vh] flex items-center">
        {/* Background */}
        <div className="absolute inset-0">
          <img src={siteSettings.heroBannerImage} alt="Hero" className="w-full h-full object-cover opacity-25" />
          <div className="absolute inset-0 bg-gradient-to-r from-[#070714] via-[#070714]/80 to-transparent" />
          <div className="absolute inset-0 bg-gradient-to-t from-[#070714] via-transparent to-transparent" />
        </div>

        {/* Floating orbs */}
        <div className="absolute top-20 right-20 w-96 h-96 bg-blue-600/20 rounded-full blur-3xl animate-pulse" />
        <div className="absolute bottom-20 right-40 w-64 h-64 bg-cyan-500/15 rounded-full blur-3xl animate-pulse delay-1000" />
        <div className="absolute top-40 left-1/3 w-48 h-48 bg-purple-600/10 rounded-full blur-2xl animate-pulse delay-500" />

        <div className="relative max-w-7xl mx-auto px-4 py-20 w-full">
          <div className="max-w-2xl">
            <div className="inline-flex items-center gap-2 bg-blue-500/10 border border-blue-500/30 rounded-full px-4 py-1.5 text-blue-400 text-sm font-medium mb-6">
              <Sparkles size={14} />
              Sri Lanka's Premier Tech Store
            </div>
            <h1 className="text-5xl md:text-7xl font-black text-white leading-[1.05] mb-6 tracking-tight">
              {siteSettings.heroBannerTitle.split(' ').slice(0, -2).join(' ')}{' '}
              <span className="bg-gradient-to-r from-blue-400 to-cyan-400 bg-clip-text text-transparent">
                {siteSettings.heroBannerTitle.split(' ').slice(-2).join(' ')}
              </span>
            </h1>
            <p className="text-lg text-gray-300 mb-10 leading-relaxed max-w-xl">
              {siteSettings.heroBannerSubtitle}
            </p>
            <div className="flex flex-wrap gap-4">
              <Link to="/products" className="inline-flex items-center gap-2 bg-gradient-to-r from-blue-600 to-blue-500 hover:from-blue-500 hover:to-cyan-500 text-white px-8 py-4 rounded-2xl font-bold text-lg transition-all shadow-2xl shadow-blue-500/30 hover:shadow-blue-400/40 hover:-translate-y-0.5">
                Shop Now <ArrowRight size={20} />
              </Link>
              <Link to="/tracking" className="inline-flex items-center gap-2 bg-white/5 hover:bg-white/10 border border-white/15 text-white px-8 py-4 rounded-2xl font-bold text-lg transition-all backdrop-blur-sm">
                Track Order
              </Link>
            </div>

            {/* Stats */}
            <div className="flex gap-8 mt-14 pt-8 border-t border-white/10">
              {[
                { num: '5,000+', label: 'Happy Customers' },
                { num: '500+', label: 'Products' },
                { num: '4.9★', label: 'Rating' },
              ].map(s => (
                <div key={s.label}>
                  <div className="text-2xl font-black text-white">{s.num}</div>
                  <div className="text-gray-500 text-sm">{s.label}</div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* Categories */}
      <section className="py-16 px-4 max-w-7xl mx-auto">
        <div className="flex items-center justify-between mb-8">
          <div>
            <h2 className="text-3xl font-black text-white">Shop by Category</h2>
            <p className="text-gray-500 mt-1">Find exactly what you're looking for</p>
          </div>
          <Link to="/products" className="text-blue-400 hover:text-blue-300 text-sm font-medium flex items-center gap-1 transition-colors">
            View All <ArrowRight size={14} />
          </Link>
        </div>
        <div className="grid grid-cols-3 md:grid-cols-6 gap-4">
          {categories.map(cat => (
            <Link key={cat.name} to={`/products?category=${cat.name}`}
              className="group flex flex-col items-center gap-3 bg-white/3 hover:bg-white/8 border border-white/8 hover:border-blue-500/40 rounded-2xl p-4 transition-all hover:-translate-y-1">
              <div className={`w-14 h-14 rounded-2xl bg-gradient-to-br ${cat.color} flex items-center justify-center text-2xl shadow-lg group-hover:scale-110 transition-transform`}>
                {cat.emoji}
              </div>
              <span className="text-gray-300 group-hover:text-white text-xs font-semibold text-center transition-colors">{cat.name}</span>
            </Link>
          ))}
        </div>
      </section>

      {/* Featured Products */}
      <section className="py-16 px-4 max-w-7xl mx-auto">
        <div className="flex items-center justify-between mb-8">
          <div className="flex items-center gap-3">
            <div className="w-8 h-8 bg-yellow-500/20 rounded-xl flex items-center justify-center">
              <Zap size={18} className="text-yellow-400" />
            </div>
            <div>
              <h2 className="text-3xl font-black text-white">{siteSettings.featuredSectionTitle}</h2>
              <p className="text-gray-500 text-sm mt-0.5">Handpicked top products</p>
            </div>
          </div>
          <div className="flex gap-2">
            <button onClick={() => setCurrentSlide(s => Math.max(0, s - 1))}
              className="w-10 h-10 bg-white/5 hover:bg-white/10 border border-white/10 rounded-xl flex items-center justify-center text-gray-400 hover:text-white transition-all">
              <ChevronLeft size={18} />
            </button>
            <button onClick={() => setCurrentSlide(s => Math.min(featuredProducts.length - 1, s + 1))}
              className="w-10 h-10 bg-white/5 hover:bg-white/10 border border-white/10 rounded-xl flex items-center justify-center text-gray-400 hover:text-white transition-all">
              <ChevronRight size={18} />
            </button>
          </div>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
          {featuredProducts.map(product => (
            <ProductCard key={product.id} product={product} onAddToCart={() => handleAddToCart(product)} />
          ))}
        </div>
      </section>

      {/* Promo Banner */}
      <section className="px-4 max-w-7xl mx-auto my-8">
        <div className="relative rounded-3xl overflow-hidden min-h-[280px] flex items-center">
          <img src={siteSettings.promoBannerImage} alt="Promo" className="absolute inset-0 w-full h-full object-cover opacity-40" />
          <div className="absolute inset-0 bg-gradient-to-r from-blue-900/90 to-purple-900/70" />
          <div className="relative z-10 px-8 md:px-16 py-12">
            <div className="inline-flex items-center gap-2 bg-yellow-400/20 border border-yellow-400/40 rounded-full px-3 py-1 text-yellow-400 text-xs font-bold mb-4">
              <Gift size={12} /> EXCLUSIVE DEAL
            </div>
            <h2 className="text-4xl md:text-5xl font-black text-white mb-3">{siteSettings.promoBannerTitle}</h2>
            <p className="text-gray-300 text-lg mb-6">{siteSettings.promoBannerSubtitle}</p>
            <Link to="/products" className="inline-flex items-center gap-2 bg-white text-blue-900 px-6 py-3 rounded-2xl font-bold hover:bg-blue-50 transition-colors">
              Explore Now <ArrowRight size={18} />
            </Link>
          </div>
        </div>
      </section>

      {/* All Products */}
      <section className="py-16 px-4 max-w-7xl mx-auto">
        <div className="flex items-center justify-between mb-8">
          <div className="flex items-center gap-3">
            <div className="w-8 h-8 bg-blue-500/20 rounded-xl flex items-center justify-center">
              <TrendingUp size={18} className="text-blue-400" />
            </div>
            <div>
              <h2 className="text-3xl font-black text-white">All Products</h2>
              <p className="text-gray-500 text-sm mt-0.5">Browse our full collection</p>
            </div>
          </div>
          <Link to="/products" className="text-blue-400 hover:text-blue-300 text-sm font-medium flex items-center gap-1 transition-colors">
            See All <ArrowRight size={14} />
          </Link>
        </div>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {allProducts.map(product => (
            <ProductCard key={product.id} product={product} onAddToCart={() => handleAddToCart(product)} large />
          ))}
        </div>
      </section>
    </div>
  );
};

// Product Card Component
const ProductCard: React.FC<{ product: any; onAddToCart: () => void; large?: boolean }> = ({ product, onAddToCart, large }) => {
  const navigate = useNavigate();
  const discount = product.originalPrice ? Math.round((1 - product.price / product.originalPrice) * 100) : null;

  return (
    <div className={`group bg-[#0d0d2b] border border-white/8 hover:border-blue-500/40 rounded-2xl overflow-hidden transition-all hover:-translate-y-1 hover:shadow-2xl hover:shadow-blue-500/10 flex flex-col`}>
      {/* Image */}
      <div className={`relative overflow-hidden ${large ? 'h-56' : 'h-48'} bg-gradient-to-br from-[#1a1a3e] to-[#0d0d2b]`}>
        <img src={product.image} alt={product.name} className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500" />
        <div className="absolute inset-0 bg-gradient-to-t from-[#0d0d2b] via-transparent to-transparent opacity-60" />
        {product.badge && (
          <span className="absolute top-3 left-3 bg-gradient-to-r from-blue-600 to-blue-500 text-white text-xs font-bold px-2.5 py-1 rounded-full">
            {product.badge}
          </span>
        )}
        {discount && (
          <span className="absolute top-3 right-3 bg-red-500 text-white text-xs font-bold px-2.5 py-1 rounded-full">
            -{discount}%
          </span>
        )}
      </div>

      {/* Content */}
      <div className="p-4 flex flex-col flex-1">
        <div className="flex items-center gap-1 mb-1">
          <span className="text-xs text-blue-400 font-medium">{product.category}</span>
        </div>
        <h3 className="text-white font-bold text-sm mb-1 group-hover:text-blue-300 transition-colors line-clamp-2">{product.name}</h3>
        <div className="flex items-center gap-1 mb-3">
          <Star size={12} fill="#f59e0b" className="text-yellow-400" />
          <span className="text-yellow-400 text-xs font-semibold">{product.rating}</span>
          <span className="text-gray-600 text-xs">({product.reviews})</span>
        </div>
        <div className="mt-auto">
          <div className="flex items-center gap-2 mb-3">
            <span className="text-white font-black text-lg">Rs. {product.price.toLocaleString()}</span>
            {product.originalPrice && (
              <span className="text-gray-600 text-sm line-through">Rs. {product.originalPrice.toLocaleString()}</span>
            )}
          </div>
          <div className="flex gap-2">
            <button onClick={() => navigate(`/products/${product.id}`)}
              className="flex-1 bg-white/5 hover:bg-white/10 border border-white/10 text-white text-xs font-semibold py-2.5 rounded-xl transition-all">
              View Details
            </button>
            <button onClick={onAddToCart}
              className="flex-1 bg-gradient-to-r from-blue-600 to-blue-500 hover:from-blue-500 hover:to-cyan-500 text-white text-xs font-semibold py-2.5 rounded-xl transition-all flex items-center justify-center gap-1.5">
              <ShoppingCart size={13} /> Add to Cart
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default HomePage;
