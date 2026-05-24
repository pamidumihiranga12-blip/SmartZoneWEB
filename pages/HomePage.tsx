import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { ArrowRight, Truck, Shield, Headphones, RefreshCw, Star, ChevronRight, Zap } from 'lucide-react';
import { productService, settingsService } from '../services/db';
import { Product, SiteSettings } from '../store/useStore';
import { useStore } from '../store/useStore';
import ProductCard from '../components/ProductCard';

export default function HomePage() {
  const [featuredProducts, setFeaturedProducts] = useState<Product[]>([]);
  const [newArrivals, setNewArrivals] = useState<Product[]>([]);
  const [settings, setSettings] = useState<SiteSettings | null>(null);
  const { setSiteSettings } = useStore();

  useEffect(() => {
    const s = settingsService.get();
    setSettings(s);
    setSiteSettings(s);
    setFeaturedProducts(productService.getAll({ featured: true }));
    setNewArrivals(productService.getAll({ sortBy: 'newest' }).slice(0, 8));
  }, []);

  const categories = [
    { name: 'Smartphones', image: '/images/category-phones.jpg', icon: '📱', color: 'from-blue-500 to-blue-600' },
    { name: 'Laptops', image: '/images/category-laptops.jpg', icon: '💻', color: 'from-purple-500 to-purple-600' },
    { name: 'Accessories', image: '/images/category-accessories.jpg', icon: '🎧', color: 'from-green-500 to-green-600' },
    { name: 'TVs', image: '/images/promo-banner.jpg', icon: '📺', color: 'from-orange-500 to-orange-600' },
  ];

  const features = [
    { icon: <Truck size={22} />, title: 'Free Delivery', desc: 'On orders above Rs. 5,000' },
    { icon: <Shield size={22} />, title: 'Warranty Assured', desc: 'Official brand warranty' },
    { icon: <Headphones size={22} />, title: '24/7 Support', desc: 'Call us anytime' },
    { icon: <RefreshCw size={22} />, title: 'Easy Returns', desc: '7-day hassle-free returns' },
  ];

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Hero Section */}
      <section className="relative overflow-hidden">
        <div
          className="relative min-h-[600px] flex items-center"
          style={{
            background: 'linear-gradient(135deg, #0f172a 0%, #1e3a5f 50%, #1e40af 100%)',
          }}
        >
          {/* Background Image */}
          <div
            className="absolute inset-0 opacity-20 bg-cover bg-center"
            style={{ backgroundImage: `url(${settings?.heroBannerImage || '/images/hero-bg.jpg'})` }}
          />
          {/* Grid pattern overlay */}
          <div className="absolute inset-0 opacity-10"
            style={{
              backgroundImage: 'radial-gradient(circle, #60a5fa 1px, transparent 1px)',
              backgroundSize: '30px 30px',
            }}
          />

          <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-20">
            <div className="max-w-2xl">
              {/* Badge */}
              <div className="inline-flex items-center gap-2 bg-blue-600/30 border border-blue-400/30 text-blue-300 px-4 py-1.5 rounded-full text-sm font-medium mb-6 backdrop-blur-sm">
                <Zap size={14} />
                <span>Sri Lanka's Smart Electronics Store</span>
              </div>

              <h1 className="text-5xl sm:text-6xl font-black text-white leading-tight mb-6">
                {settings?.heroBannerTitle || 'Welcome to SmartZone'}
              </h1>
              <p className="text-lg text-blue-100 mb-8 leading-relaxed">
                {settings?.heroBannerSubtitle || 'Your trusted destination for premium electronics & smart gadgets in Anuradhapura'}
              </p>
              <div className="flex flex-wrap gap-4">
                <Link
                  to="/products"
                  className="inline-flex items-center gap-2 bg-blue-600 hover:bg-blue-500 text-white px-8 py-3.5 rounded-xl font-semibold text-base transition-all shadow-lg shadow-blue-900/50 hover:shadow-xl hover:-translate-y-0.5"
                >
                  Shop Now <ArrowRight size={18} />
                </Link>
                <Link
                  to="/tracking"
                  className="inline-flex items-center gap-2 bg-white/10 hover:bg-white/20 text-white border border-white/20 px-8 py-3.5 rounded-xl font-semibold text-base transition-all backdrop-blur-sm"
                >
                  Track Order
                </Link>
              </div>

              {/* Stats */}
              <div className="flex gap-8 mt-12 pt-8 border-t border-white/10">
                {[
                  { value: '500+', label: 'Products' },
                  { value: '10K+', label: 'Happy Customers' },
                  { value: '5★', label: 'Rating' },
                ].map((stat) => (
                  <div key={stat.label}>
                    <p className="text-2xl font-black text-white">{stat.value}</p>
                    <p className="text-sm text-blue-300">{stat.label}</p>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Special Offer Banner */}
      {settings?.specialOffer?.active && (
        <section className="py-6 px-4">
          <div className="max-w-7xl mx-auto">
            <div
              className="rounded-2xl p-6 sm:p-8 flex flex-col sm:flex-row items-center justify-between gap-4 text-white overflow-hidden relative"
              style={{ backgroundColor: settings.specialOffer.bgColor || '#1e40af' }}
            >
              <div
                className="absolute inset-0 opacity-10"
                style={{
                  backgroundImage: 'radial-gradient(circle, white 1px, transparent 1px)',
                  backgroundSize: '20px 20px',
                }}
              />
              <div className="relative text-center sm:text-left">
                <h2 className="text-2xl sm:text-3xl font-black mb-1">{settings.specialOffer.title}</h2>
                <p className="text-white/80 text-sm sm:text-base">{settings.specialOffer.description}</p>
              </div>
              <Link
                to="/products"
                className="relative flex-shrink-0 bg-white text-blue-700 hover:bg-blue-50 font-bold px-8 py-3 rounded-xl text-sm transition-colors shadow-lg"
              >
                Shop Now →
              </Link>
            </div>
          </div>
        </section>
      )}

      {/* Features */}
      <section className="py-8 px-4">
        <div className="max-w-7xl mx-auto grid grid-cols-2 lg:grid-cols-4 gap-4">
          {features.map((f) => (
            <div key={f.title} className="bg-white rounded-xl p-4 flex items-center gap-3 shadow-sm border border-gray-100">
              <div className="w-10 h-10 bg-blue-100 text-blue-600 rounded-xl flex items-center justify-center flex-shrink-0">
                {f.icon}
              </div>
              <div>
                <p className="font-semibold text-gray-900 text-sm">{f.title}</p>
                <p className="text-xs text-gray-500">{f.desc}</p>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* Categories */}
      <section className="py-10 px-4">
        <div className="max-w-7xl mx-auto">
          <div className="flex items-center justify-between mb-6">
            <h2 className="text-2xl font-black text-gray-900">Shop by Category</h2>
            <Link to="/products" className="text-blue-600 text-sm font-medium hover:text-blue-700 flex items-center gap-1">
              View All <ChevronRight size={16} />
            </Link>
          </div>
          <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
            {categories.map((cat) => (
              <Link
                key={cat.name}
                to={`/products?category=${cat.name}`}
                className="group relative overflow-hidden rounded-2xl aspect-[4/3] flex items-end shadow-md hover:shadow-xl transition-all"
              >
                <img
                  src={cat.image}
                  alt={cat.name}
                  className="absolute inset-0 w-full h-full object-cover group-hover:scale-110 transition-transform duration-500"
                />
                <div className={`absolute inset-0 bg-gradient-to-t ${cat.color} opacity-70 group-hover:opacity-80 transition-opacity`} />
                <div className="relative p-4 w-full">
                  <p className="text-2xl mb-1">{cat.icon}</p>
                  <p className="text-white font-bold text-lg">{cat.name}</p>
                  <p className="text-white/80 text-xs flex items-center gap-1 mt-0.5">
                    Explore <ArrowRight size={12} />
                  </p>
                </div>
              </Link>
            ))}
          </div>
        </div>
      </section>

      {/* Featured Products */}
      {featuredProducts.length > 0 && (
        <section className="py-10 px-4">
          <div className="max-w-7xl mx-auto">
            <div className="flex items-center justify-between mb-6">
              <div>
                <h2 className="text-2xl font-black text-gray-900">Featured Products</h2>
                <p className="text-gray-500 text-sm mt-0.5">Handpicked premium products just for you</p>
              </div>
              <Link to="/products?featured=true" className="text-blue-600 text-sm font-medium hover:text-blue-700 flex items-center gap-1">
                View All <ChevronRight size={16} />
              </Link>
            </div>
            <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-4 sm:gap-6">
              {featuredProducts.slice(0, 8).map((product) => (
                <ProductCard key={product._id} product={product} />
              ))}
            </div>
          </div>
        </section>
      )}

      {/* New Arrivals */}
      <section className="py-10 px-4 bg-white">
        <div className="max-w-7xl mx-auto">
          <div className="flex items-center justify-between mb-6">
            <div>
              <h2 className="text-2xl font-black text-gray-900">New Arrivals</h2>
              <p className="text-gray-500 text-sm mt-0.5">The latest tech just landed in store</p>
            </div>
            <Link to="/products?sortBy=newest" className="text-blue-600 text-sm font-medium hover:text-blue-700 flex items-center gap-1">
              View All <ChevronRight size={16} />
            </Link>
          </div>
          <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-4 sm:gap-6">
            {newArrivals.map((product) => (
              <ProductCard key={product._id} product={product} />
            ))}
          </div>
        </div>
      </section>

      {/* Testimonials */}
      <section className="py-14 px-4 bg-gradient-to-br from-blue-50 to-indigo-50">
        <div className="max-w-7xl mx-auto text-center mb-10">
          <h2 className="text-2xl font-black text-gray-900 mb-2">What Our Customers Say</h2>
          <p className="text-gray-500">Trusted by thousands of happy customers across Sri Lanka</p>
        </div>
        <div className="max-w-7xl mx-auto grid grid-cols-1 sm:grid-cols-3 gap-6">
          {[
            { name: 'Kasun Perera', review: 'Excellent service and genuine products! Got my iPhone within 2 days. Highly recommend SmartZone!', rating: 5, location: 'Colombo' },
            { name: 'Nimasha Silva', review: 'Best electronics shop in Anuradhapura. The staff is very helpful and prices are competitive.', rating: 5, location: 'Anuradhapura' },
            { name: 'Ravindu Fernando', review: 'Ordered my MacBook and it came with full warranty. The website is easy to use and delivery was fast.', rating: 5, location: 'Kandy' },
          ].map((t) => (
            <div key={t.name} className="bg-white rounded-2xl p-6 shadow-sm border border-gray-100">
              <div className="flex gap-0.5 mb-3">
                {[...Array(t.rating)].map((_, i) => (
                  <Star key={i} size={14} className="text-yellow-400 fill-yellow-400" />
                ))}
              </div>
              <p className="text-gray-700 text-sm leading-relaxed mb-4">"{t.review}"</p>
              <div className="flex items-center gap-3">
                <div className="w-9 h-9 rounded-full bg-blue-600 flex items-center justify-center text-white font-bold text-sm">
                  {t.name.charAt(0)}
                </div>
                <div>
                  <p className="font-semibold text-gray-900 text-sm">{t.name}</p>
                  <p className="text-gray-400 text-xs">{t.location}</p>
                </div>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-16 px-4 bg-gradient-to-r from-blue-700 to-blue-900 text-white">
        <div className="max-w-3xl mx-auto text-center">
          <h2 className="text-3xl sm:text-4xl font-black mb-4">Ready to Shop Smart?</h2>
          <p className="text-blue-200 text-lg mb-8">
            Browse our full collection of premium electronics and get the best deals in Sri Lanka.
          </p>
          <div className="flex flex-wrap justify-center gap-4">
            <Link
              to="/products"
              className="inline-flex items-center gap-2 bg-white text-blue-700 hover:bg-blue-50 px-8 py-3.5 rounded-xl font-bold text-base transition-colors shadow-lg"
            >
              Browse Products <ArrowRight size={18} />
            </Link>
            <Link
              to="/contact"
              className="inline-flex items-center gap-2 border border-white/30 hover:bg-white/10 text-white px-8 py-3.5 rounded-xl font-bold text-base transition-colors"
            >
              Contact Us
            </Link>
          </div>
        </div>
      </section>
    </div>
  );
}
