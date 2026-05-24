import React, { useState, useMemo } from 'react';
import { useNavigate, useSearchParams } from 'react-router-dom';
import { Search, SlidersHorizontal, Star, ShoppingCart, X } from 'lucide-react';
import { useApp } from '../context/AppContext';

const ProductsPage: React.FC = () => {
  const { products, addToCart, currentUser } = useApp();
  const navigate = useNavigate();
  const [searchParams, setSearchParams] = useSearchParams();
  const [searchQuery, setSearchQuery] = useState('');
  const [sortBy, setSortBy] = useState('default');
  const [priceRange, setPriceRange] = useState([0, 500000]);
  const [filtersOpen, setFiltersOpen] = useState(false);

  const selectedCategory = searchParams.get('category') || '';
  const categories = ['All', ...Array.from(new Set(products.map(p => p.category)))];

  const filtered = useMemo(() => {
    let result = [...products];
    if (selectedCategory) result = result.filter(p => p.category === selectedCategory);
    if (searchQuery) result = result.filter(p => p.name.toLowerCase().includes(searchQuery.toLowerCase()) || p.category.toLowerCase().includes(searchQuery.toLowerCase()));
    result = result.filter(p => p.price >= priceRange[0] && p.price <= priceRange[1]);
    switch (sortBy) {
      case 'price-asc': return result.sort((a, b) => a.price - b.price);
      case 'price-desc': return result.sort((a, b) => b.price - a.price);
      case 'rating': return result.sort((a, b) => b.rating - a.rating);
      case 'newest': return result.reverse();
      default: return result;
    }
  }, [products, selectedCategory, searchQuery, sortBy, priceRange]);

  const handleAddToCart = (product: typeof products[0]) => {
    if (!currentUser) { navigate('/login'); return; }
    addToCart(product);
  };

  return (
    <div className="bg-[#070714] min-h-screen">
      <div className="max-w-7xl mx-auto px-4 py-10">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-4xl font-black text-white">
            {selectedCategory ? selectedCategory : 'All Products'}
          </h1>
          <p className="text-gray-500 mt-1">{filtered.length} products found</p>
        </div>

        {/* Search & Filter Bar */}
        <div className="flex flex-col md:flex-row gap-3 mb-8">
          <div className="relative flex-1">
            <Search size={18} className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-500" />
            <input
              value={searchQuery}
              onChange={e => setSearchQuery(e.target.value)}
              placeholder="Search products..."
              className="w-full bg-white/5 border border-white/10 focus:border-blue-500 rounded-2xl pl-12 pr-4 py-3 text-white placeholder-gray-500 outline-none transition-colors"
            />
          </div>
          <select
            value={sortBy}
            onChange={e => setSortBy(e.target.value)}
            className="bg-white/5 border border-white/10 text-white rounded-2xl px-4 py-3 outline-none focus:border-blue-500 transition-colors md:w-48"
          >
            <option value="default" className="bg-[#1a1a3e]">Default</option>
            <option value="price-asc" className="bg-[#1a1a3e]">Price: Low to High</option>
            <option value="price-desc" className="bg-[#1a1a3e]">Price: High to Low</option>
            <option value="rating" className="bg-[#1a1a3e]">Best Rated</option>
            <option value="newest" className="bg-[#1a1a3e]">Newest</option>
          </select>
          <button onClick={() => setFiltersOpen(!filtersOpen)}
            className="flex items-center gap-2 bg-white/5 border border-white/10 text-white rounded-2xl px-4 py-3 hover:bg-white/10 transition-colors">
            <SlidersHorizontal size={18} /> Filters
          </button>
        </div>

        {/* Category Tabs */}
        <div className="flex gap-2 flex-wrap mb-8">
          {categories.map(cat => (
            <button key={cat}
              onClick={() => cat === 'All' ? setSearchParams({}) : setSearchParams({ category: cat })}
              className={`px-4 py-2 rounded-xl text-sm font-semibold transition-all ${(cat === 'All' && !selectedCategory) || cat === selectedCategory ? 'bg-blue-600 text-white shadow-lg shadow-blue-500/20' : 'bg-white/5 text-gray-400 hover:text-white hover:bg-white/10 border border-white/10'}`}>
              {cat}
            </button>
          ))}
        </div>

        {/* Filter Panel */}
        {filtersOpen && (
          <div className="bg-[#0d0d2b] border border-white/10 rounded-2xl p-6 mb-8">
            <div className="flex justify-between items-center mb-4">
              <h3 className="text-white font-bold">Price Range</h3>
              <button onClick={() => setFiltersOpen(false)}><X size={18} className="text-gray-400" /></button>
            </div>
            <div className="flex items-center gap-4">
              <div className="flex-1">
                <label className="text-gray-400 text-xs mb-1 block">Min Price</label>
                <input type="range" min={0} max={500000} step={5000} value={priceRange[0]}
                  onChange={e => setPriceRange([+e.target.value, priceRange[1]])}
                  className="w-full accent-blue-500" />
                <span className="text-blue-400 text-sm">Rs. {priceRange[0].toLocaleString()}</span>
              </div>
              <div className="flex-1">
                <label className="text-gray-400 text-xs mb-1 block">Max Price</label>
                <input type="range" min={0} max={500000} step={5000} value={priceRange[1]}
                  onChange={e => setPriceRange([priceRange[0], +e.target.value])}
                  className="w-full accent-blue-500" />
                <span className="text-blue-400 text-sm">Rs. {priceRange[1].toLocaleString()}</span>
              </div>
            </div>
          </div>
        )}

        {/* Products Grid */}
        {filtered.length === 0 ? (
          <div className="text-center py-24">
            <div className="text-6xl mb-4">🔍</div>
            <h3 className="text-white text-2xl font-bold mb-2">No products found</h3>
            <p className="text-gray-500">Try adjusting your filters or search query</p>
          </div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
            {filtered.map(product => (
              <ProductGridCard key={product.id} product={product}
                onAddToCart={() => handleAddToCart(product)}
                onView={() => navigate(`/products/${product.id}`)} />
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

const ProductGridCard: React.FC<{ product: any; onAddToCart: () => void; onView: () => void }> = ({ product, onAddToCart, onView }) => {
  const discount = product.originalPrice ? Math.round((1 - product.price / product.originalPrice) * 100) : null;
  return (
    <div className="group bg-[#0d0d2b] border border-white/8 hover:border-blue-500/40 rounded-2xl overflow-hidden transition-all hover:-translate-y-1 hover:shadow-2xl hover:shadow-blue-500/10 flex flex-col">
      <div className="relative h-52 overflow-hidden bg-gradient-to-br from-[#1a1a3e] to-[#0d0d2b] cursor-pointer" onClick={onView}>
        <img src={product.image} alt={product.name} className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500" />
        {product.badge && (
          <span className="absolute top-3 left-3 bg-gradient-to-r from-blue-600 to-blue-500 text-white text-xs font-bold px-2.5 py-1 rounded-full">
            {product.badge}
          </span>
        )}
        {discount && (
          <span className="absolute top-3 right-3 bg-red-500 text-white text-xs font-bold px-2.5 py-1 rounded-full">-{discount}%</span>
        )}
        {product.stock < 5 && <span className="absolute bottom-3 left-3 bg-orange-500/90 text-white text-xs px-2 py-0.5 rounded-full">Only {product.stock} left!</span>}
      </div>
      <div className="p-4 flex flex-col flex-1">
        <span className="text-xs text-blue-400 font-medium mb-1">{product.category}</span>
        <h3 onClick={onView} className="text-white font-bold text-sm mb-1 cursor-pointer hover:text-blue-300 transition-colors line-clamp-2">{product.name}</h3>
        <div className="flex items-center gap-1 mb-3">
          <Star size={11} fill="#f59e0b" className="text-yellow-400" />
          <span className="text-yellow-400 text-xs font-semibold">{product.rating}</span>
          <span className="text-gray-600 text-xs">({product.reviews})</span>
        </div>
        <div className="mt-auto">
          <div className="flex items-center gap-2 mb-3">
            <span className="text-white font-black">Rs. {product.price.toLocaleString()}</span>
            {product.originalPrice && <span className="text-gray-600 text-xs line-through">Rs. {product.originalPrice.toLocaleString()}</span>}
          </div>
          <div className="flex gap-2">
            <button onClick={onView} className="flex-1 bg-white/5 hover:bg-white/10 border border-white/10 text-white text-xs font-semibold py-2.5 rounded-xl transition-all">Details</button>
            <button onClick={onAddToCart} className="flex-1 bg-gradient-to-r from-blue-600 to-blue-500 hover:from-blue-500 hover:to-cyan-500 text-white text-xs font-semibold py-2.5 rounded-xl transition-all flex items-center justify-center gap-1.5">
              <ShoppingCart size={12} /> Add
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ProductsPage;
