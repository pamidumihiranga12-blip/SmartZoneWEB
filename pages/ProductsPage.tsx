import { useState, useEffect } from 'react';
import { useSearchParams } from 'react-router-dom';
import { SlidersHorizontal, X, ChevronDown } from 'lucide-react';
import { productService } from '../services/db';
import { Product } from '../store/useStore';
import ProductCard from '../components/ProductCard';

export default function ProductsPage() {
  const [searchParams, setSearchParams] = useSearchParams();
  const [products, setProducts] = useState<Product[]>([]);
  const [categories, setCategories] = useState<string[]>([]);
  const [loading, setLoading] = useState(true);
  const [filtersOpen, setFiltersOpen] = useState(false);

  const selectedCategory = searchParams.get('category') || '';
  const searchQuery = searchParams.get('search') || '';
  const sortBy = searchParams.get('sortBy') || 'newest';
  const priceMax = parseInt(searchParams.get('priceMax') || '500000');
  const priceMin = parseInt(searchParams.get('priceMin') || '0');

  useEffect(() => {
    setCategories(productService.getCategories());
  }, []);

  useEffect(() => {
    setLoading(true);
    let results = productService.getAll({
      category: selectedCategory || undefined,
      search: searchQuery || undefined,
      sortBy,
    });
    results = results.filter((p) => p.price >= priceMin && p.price <= priceMax);
    setProducts(results);
    setLoading(false);
  }, [selectedCategory, searchQuery, sortBy, priceMin, priceMax]);

  const updateParam = (key: string, value: string) => {
    const params = new URLSearchParams(searchParams);
    if (value) params.set(key, value);
    else params.delete(key);
    setSearchParams(params);
  };

  const clearFilters = () => {
    setSearchParams({});
  };

  const hasActiveFilters = selectedCategory || searchQuery || sortBy !== 'newest';

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <div className="bg-white border-b border-gray-200">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
          <h1 className="text-2xl font-black text-gray-900 mb-1">
            {searchQuery ? `Search: "${searchQuery}"` : selectedCategory || 'All Products'}
          </h1>
          <p className="text-gray-500 text-sm">{products.length} products found</p>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
        {/* Filters Bar */}
        <div className="flex flex-wrap items-center gap-3 mb-6">
          {/* Categories */}
          <div className="flex flex-wrap gap-2">
            <button
              onClick={() => updateParam('category', '')}
              className={`px-4 py-1.5 rounded-full text-sm font-medium border transition-colors ${
                !selectedCategory ? 'bg-blue-600 text-white border-blue-600' : 'bg-white text-gray-600 border-gray-200 hover:border-blue-300'
              }`}
            >
              All
            </button>
            {categories.map((cat) => (
              <button
                key={cat}
                onClick={() => updateParam('category', cat)}
                className={`px-4 py-1.5 rounded-full text-sm font-medium border transition-colors ${
                  selectedCategory === cat ? 'bg-blue-600 text-white border-blue-600' : 'bg-white text-gray-600 border-gray-200 hover:border-blue-300'
                }`}
              >
                {cat}
              </button>
            ))}
          </div>

          {/* Sort & Filter */}
          <div className="ml-auto flex items-center gap-2">
            {hasActiveFilters && (
              <button
                onClick={clearFilters}
                className="flex items-center gap-1.5 px-3 py-1.5 text-sm text-red-600 border border-red-200 rounded-full hover:bg-red-50 transition-colors"
              >
                <X size={14} /> Clear
              </button>
            )}

            <div className="relative">
              <select
                value={sortBy}
                onChange={(e) => updateParam('sortBy', e.target.value)}
                className="appearance-none bg-white border border-gray-200 rounded-full px-4 py-1.5 pr-8 text-sm font-medium text-gray-700 cursor-pointer focus:outline-none focus:ring-2 focus:ring-blue-500"
              >
                <option value="newest">Newest First</option>
                <option value="price_asc">Price: Low to High</option>
                <option value="price_desc">Price: High to Low</option>
                <option value="rating">Top Rated</option>
              </select>
              <ChevronDown size={14} className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-500 pointer-events-none" />
            </div>

            <button
              onClick={() => setFiltersOpen(!filtersOpen)}
              className="flex items-center gap-1.5 px-4 py-1.5 bg-white border border-gray-200 rounded-full text-sm font-medium text-gray-700 hover:border-blue-300 transition-colors"
            >
              <SlidersHorizontal size={14} /> Filters
            </button>
          </div>
        </div>

        {/* Advanced Filters Panel */}
        {filtersOpen && (
          <div className="bg-white rounded-xl border border-gray-200 p-5 mb-6 shadow-sm">
            <h3 className="font-semibold text-gray-900 mb-4">Price Range</h3>
            <div className="flex items-center gap-3">
              <div>
                <label className="text-xs text-gray-500 mb-1 block">Min Price (Rs.)</label>
                <input
                  type="number"
                  value={priceMin}
                  onChange={(e) => updateParam('priceMin', e.target.value)}
                  className="w-32 border border-gray-200 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
              </div>
              <span className="text-gray-400 mt-4">—</span>
              <div>
                <label className="text-xs text-gray-500 mb-1 block">Max Price (Rs.)</label>
                <input
                  type="number"
                  value={priceMax}
                  onChange={(e) => updateParam('priceMax', e.target.value)}
                  className="w-32 border border-gray-200 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
              </div>
            </div>
          </div>
        )}

        {/* Products Grid */}
        {loading ? (
          <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-4 sm:gap-6">
            {[...Array(8)].map((_, i) => (
              <div key={i} className="bg-white rounded-2xl overflow-hidden shadow-sm animate-pulse">
                <div className="bg-gray-200 aspect-square" />
                <div className="p-4 space-y-2">
                  <div className="h-3 bg-gray-200 rounded w-1/3" />
                  <div className="h-4 bg-gray-200 rounded" />
                  <div className="h-4 bg-gray-200 rounded w-3/4" />
                  <div className="h-5 bg-gray-200 rounded w-1/2 mt-3" />
                </div>
              </div>
            ))}
          </div>
        ) : products.length === 0 ? (
          <div className="text-center py-20">
            <p className="text-6xl mb-4">🔍</p>
            <h3 className="text-xl font-semibold text-gray-900 mb-2">No Products Found</h3>
            <p className="text-gray-500 mb-6">Try adjusting your filters or search query</p>
            <button
              onClick={clearFilters}
              className="px-6 py-2.5 bg-blue-600 text-white rounded-xl font-medium hover:bg-blue-700 transition-colors"
            >
              Clear Filters
            </button>
          </div>
        ) : (
          <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-4 sm:gap-6">
            {products.map((product) => (
              <ProductCard key={product._id} product={product} />
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
