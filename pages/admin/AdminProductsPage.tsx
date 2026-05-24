import { useState, useEffect } from 'react';
import { Plus, Search, Edit2, Trash2, Package, X, Save } from 'lucide-react';
import { productService } from '../../services/db';
import { Product } from '../../store/useStore';
import toast from 'react-hot-toast';

const emptyProduct = {
  name: '',
  description: '',
  price: 0,
  originalPrice: 0,
  category: '',
  images: [''],
  stock: 0,
  sku: '',
  featured: false,
  rating: 4.5,
  reviewCount: 0,
  specifications: {} as Record<string, string>,
};

export default function AdminProductsPage() {
  const [products, setProducts] = useState<Product[]>([]);
  const [search, setSearch] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('');
  const [categories, setCategories] = useState<string[]>([]);
  const [modalOpen, setModalOpen] = useState(false);
  const [editingProduct, setEditingProduct] = useState<Partial<Product> | null>(null);
  const [form, setForm] = useState(emptyProduct);
  const [specKey, setSpecKey] = useState('');
  const [specValue, setSpecValue] = useState('');
  const [saving, setSaving] = useState(false);
  const [deleteConfirm, setDeleteConfirm] = useState<string | null>(null);

  const load = () => {
    setProducts(productService.getAll({ search: search || undefined, category: selectedCategory || undefined }));
    setCategories(productService.getCategories());
  };

  useEffect(load, [search, selectedCategory]);

  const openAdd = () => {
    setEditingProduct(null);
    setForm({ ...emptyProduct, images: [''] });
    setModalOpen(true);
  };

  const openEdit = (p: Product) => {
    setEditingProduct(p);
    setForm({
      name: p.name,
      description: p.description,
      price: p.price,
      originalPrice: p.originalPrice || 0,
      category: p.category,
      images: p.images.length > 0 ? p.images : [''],
      stock: p.stock,
      sku: p.sku,
      featured: p.featured,
      rating: p.rating,
      reviewCount: p.reviewCount,
      specifications: p.specifications || {},
    });
    setModalOpen(true);
  };

  const handleSave = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!form.name || !form.category || !form.price) {
      toast.error('Please fill required fields');
      return;
    }
    setSaving(true);
    try {
      const data = {
        ...form,
        images: form.images.filter((img) => img.trim()),
        originalPrice: form.originalPrice || undefined,
      } as any;

      if (editingProduct?._id) {
        productService.update(editingProduct._id, data);
        toast.success('Product updated successfully!');
      } else {
        productService.create({ ...data, createdAt: new Date().toISOString() });
        toast.success('Product added successfully!');
      }
      load();
      setModalOpen(false);
    } catch (err: any) {
      toast.error(err.message || 'Failed to save product');
    } finally {
      setSaving(false);
    }
  };

  const handleDelete = (id: string) => {
    productService.delete(id);
    load();
    setDeleteConfirm(null);
    toast.success('Product deleted');
  };

  const addSpec = () => {
    if (specKey && specValue) {
      setForm({ ...form, specifications: { ...form.specifications, [specKey]: specValue } });
      setSpecKey('');
      setSpecValue('');
    }
  };

  const removeSpec = (key: string) => {
    const specs = { ...form.specifications };
    delete specs[key];
    setForm({ ...form, specifications: specs });
  };

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h2 className="text-xl font-black text-gray-900">Products</h2>
          <p className="text-gray-500 text-sm">{products.length} products total</p>
        </div>
        <button
          onClick={openAdd}
          className="inline-flex items-center gap-2 bg-blue-600 hover:bg-blue-700 text-white px-5 py-2.5 rounded-xl font-semibold text-sm transition-colors shadow-md"
        >
          <Plus size={16} /> Add Product
        </button>
      </div>

      {/* Filters */}
      <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-4 flex flex-col sm:flex-row gap-3">
        <div className="relative flex-1">
          <Search size={16} className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
          <input
            type="text"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder="Search products..."
            className="w-full pl-9 pr-4 py-2 border border-gray-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
          />
        </div>
        <select
          value={selectedCategory}
          onChange={(e) => setSelectedCategory(e.target.value)}
          className="border border-gray-200 rounded-xl px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
        >
          <option value="">All Categories</option>
          {categories.map((c) => <option key={c}>{c}</option>)}
        </select>
      </div>

      {/* Products Table */}
      <div className="bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead>
              <tr className="bg-gray-50 border-b border-gray-100">
                <th className="text-left px-5 py-3 text-xs font-semibold text-gray-500 uppercase tracking-wide">Product</th>
                <th className="text-left px-4 py-3 text-xs font-semibold text-gray-500 uppercase tracking-wide hidden sm:table-cell">Category</th>
                <th className="text-left px-4 py-3 text-xs font-semibold text-gray-500 uppercase tracking-wide">Price</th>
                <th className="text-left px-4 py-3 text-xs font-semibold text-gray-500 uppercase tracking-wide hidden md:table-cell">Stock</th>
                <th className="text-left px-4 py-3 text-xs font-semibold text-gray-500 uppercase tracking-wide hidden lg:table-cell">Featured</th>
                <th className="text-right px-5 py-3 text-xs font-semibold text-gray-500 uppercase tracking-wide">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-50">
              {products.length === 0 ? (
                <tr>
                  <td colSpan={6} className="text-center py-12 text-gray-400">
                    <Package size={32} className="mx-auto mb-2 opacity-50" />
                    <p className="text-sm">No products found</p>
                  </td>
                </tr>
              ) : (
                products.map((p) => (
                  <tr key={p._id} className="hover:bg-gray-50 transition-colors">
                    <td className="px-5 py-3">
                      <div className="flex items-center gap-3">
                        <div className="w-10 h-10 bg-gray-100 rounded-lg overflow-hidden flex-shrink-0">
                          <img
                            src={p.images[0]}
                            alt={p.name}
                            className="w-full h-full object-cover"
                            onError={(e) => (e.currentTarget.style.display = 'none')}
                          />
                        </div>
                        <div>
                          <p className="font-semibold text-gray-900 text-sm">{p.name}</p>
                          <p className="text-xs text-gray-400">{p.sku}</p>
                        </div>
                      </div>
                    </td>
                    <td className="px-4 py-3 hidden sm:table-cell">
                      <span className="text-xs bg-gray-100 text-gray-700 px-2 py-1 rounded-lg font-medium">{p.category}</span>
                    </td>
                    <td className="px-4 py-3">
                      <p className="font-bold text-sm text-gray-900">Rs. {p.price.toLocaleString()}</p>
                      {p.originalPrice && (
                        <p className="text-xs text-gray-400 line-through">Rs. {p.originalPrice.toLocaleString()}</p>
                      )}
                    </td>
                    <td className="px-4 py-3 hidden md:table-cell">
                      <span className={`text-xs font-semibold ${p.stock > 5 ? 'text-green-600' : p.stock > 0 ? 'text-yellow-600' : 'text-red-600'}`}>
                        {p.stock > 0 ? `${p.stock} left` : 'Out of Stock'}
                      </span>
                    </td>
                    <td className="px-4 py-3 hidden lg:table-cell">
                      <span className={`text-xs font-medium px-2 py-1 rounded-full ${p.featured ? 'bg-blue-100 text-blue-700' : 'bg-gray-100 text-gray-500'}`}>
                        {p.featured ? '⭐ Featured' : 'Standard'}
                      </span>
                    </td>
                    <td className="px-5 py-3 text-right">
                      <div className="flex items-center justify-end gap-1.5">
                        <button
                          onClick={() => openEdit(p)}
                          className="p-1.5 text-blue-600 hover:bg-blue-50 rounded-lg transition-colors"
                          title="Edit"
                        >
                          <Edit2 size={15} />
                        </button>
                        <button
                          onClick={() => setDeleteConfirm(p._id)}
                          className="p-1.5 text-red-500 hover:bg-red-50 rounded-lg transition-colors"
                          title="Delete"
                        >
                          <Trash2 size={15} />
                        </button>
                      </div>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>

      {/* Delete Confirm */}
      {deleteConfirm && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50">
          <div className="bg-white rounded-2xl p-6 max-w-sm w-full shadow-2xl">
            <h3 className="font-bold text-gray-900 mb-2">Delete Product?</h3>
            <p className="text-gray-500 text-sm mb-5">This action cannot be undone.</p>
            <div className="flex gap-3">
              <button
                onClick={() => setDeleteConfirm(null)}
                className="flex-1 py-2.5 border border-gray-200 rounded-xl text-sm font-medium text-gray-700 hover:bg-gray-50"
              >
                Cancel
              </button>
              <button
                onClick={() => handleDelete(deleteConfirm)}
                className="flex-1 py-2.5 bg-red-600 text-white rounded-xl text-sm font-medium hover:bg-red-700"
              >
                Delete
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Add/Edit Modal */}
      {modalOpen && (
        <div className="fixed inset-0 z-50 flex items-end sm:items-center justify-center p-4 bg-black/50 backdrop-blur-sm">
          <div className="bg-white rounded-2xl w-full max-w-2xl shadow-2xl max-h-[90vh] flex flex-col">
            <div className="flex items-center justify-between px-6 py-4 border-b border-gray-100">
              <h2 className="font-black text-gray-900">{editingProduct ? 'Edit Product' : 'Add New Product'}</h2>
              <button onClick={() => setModalOpen(false)} className="text-gray-400 hover:text-gray-600">
                <X size={20} />
              </button>
            </div>

            <form onSubmit={handleSave} className="overflow-y-auto flex-1">
              <div className="p-6 space-y-4">
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div className="sm:col-span-2">
                    <label className="block text-sm font-semibold text-gray-700 mb-1">Product Name *</label>
                    <input
                      type="text"
                      required
                      value={form.name}
                      onChange={(e) => setForm({ ...form, name: e.target.value })}
                      className="w-full border border-gray-200 rounded-xl px-3 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
                      placeholder="e.g. Samsung Galaxy S24"
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-semibold text-gray-700 mb-1">Category *</label>
                    <input
                      type="text"
                      required
                      value={form.category}
                      onChange={(e) => setForm({ ...form, category: e.target.value })}
                      list="categories-list"
                      className="w-full border border-gray-200 rounded-xl px-3 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
                      placeholder="Smartphones, Laptops..."
                    />
                    <datalist id="categories-list">
                      {categories.map((c) => <option key={c} value={c} />)}
                      <option value="Smartphones" />
                      <option value="Laptops" />
                      <option value="Accessories" />
                      <option value="TVs" />
                      <option value="Gaming" />
                    </datalist>
                  </div>

                  <div>
                    <label className="block text-sm font-semibold text-gray-700 mb-1">SKU</label>
                    <input
                      type="text"
                      value={form.sku}
                      onChange={(e) => setForm({ ...form, sku: e.target.value })}
                      className="w-full border border-gray-200 rounded-xl px-3 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
                      placeholder="e.g. SAM-S24-001"
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-semibold text-gray-700 mb-1">Price (Rs.) *</label>
                    <input
                      type="number"
                      required
                      min="0"
                      value={form.price}
                      onChange={(e) => setForm({ ...form, price: parseFloat(e.target.value) || 0 })}
                      className="w-full border border-gray-200 rounded-xl px-3 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-semibold text-gray-700 mb-1">Original Price (Rs.)</label>
                    <input
                      type="number"
                      min="0"
                      value={form.originalPrice}
                      onChange={(e) => setForm({ ...form, originalPrice: parseFloat(e.target.value) || 0 })}
                      className="w-full border border-gray-200 rounded-xl px-3 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
                      placeholder="For showing discount"
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-semibold text-gray-700 mb-1">Stock Quantity *</label>
                    <input
                      type="number"
                      required
                      min="0"
                      value={form.stock}
                      onChange={(e) => setForm({ ...form, stock: parseInt(e.target.value) || 0 })}
                      className="w-full border border-gray-200 rounded-xl px-3 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-semibold text-gray-700 mb-1">Rating</label>
                    <input
                      type="number"
                      min="1"
                      max="5"
                      step="0.1"
                      value={form.rating}
                      onChange={(e) => setForm({ ...form, rating: parseFloat(e.target.value) || 4.5 })}
                      className="w-full border border-gray-200 rounded-xl px-3 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
                    />
                  </div>

                  <div className="sm:col-span-2">
                    <label className="block text-sm font-semibold text-gray-700 mb-1">Description</label>
                    <textarea
                      rows={3}
                      value={form.description}
                      onChange={(e) => setForm({ ...form, description: e.target.value })}
                      className="w-full border border-gray-200 rounded-xl px-3 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 resize-none"
                      placeholder="Product description..."
                    />
                  </div>

                  {/* Images */}
                  <div className="sm:col-span-2">
                    <label className="block text-sm font-semibold text-gray-700 mb-1">Product Images (URLs)</label>
                    <div className="space-y-2">
                      {form.images.map((img, i) => (
                        <div key={i} className="flex gap-2">
                          <input
                            type="url"
                            value={img}
                            onChange={(e) => {
                              const imgs = [...form.images];
                              imgs[i] = e.target.value;
                              setForm({ ...form, images: imgs });
                            }}
                            className="flex-1 border border-gray-200 rounded-xl px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
                            placeholder="https://example.com/image.jpg"
                          />
                          {form.images.length > 1 && (
                            <button
                              type="button"
                              onClick={() => setForm({ ...form, images: form.images.filter((_, idx) => idx !== i) })}
                              className="p-2 text-red-500 hover:bg-red-50 rounded-lg"
                            >
                              <X size={14} />
                            </button>
                          )}
                        </div>
                      ))}
                      <button
                        type="button"
                        onClick={() => setForm({ ...form, images: [...form.images, ''] })}
                        className="text-blue-600 text-sm font-medium hover:text-blue-700 flex items-center gap-1"
                      >
                        <Plus size={14} /> Add another image URL
                      </button>
                    </div>
                  </div>

                  {/* Specifications */}
                  <div className="sm:col-span-2">
                    <label className="block text-sm font-semibold text-gray-700 mb-2">Specifications</label>
                    {Object.entries(form.specifications).map(([key, val]) => (
                      <div key={key} className="flex items-center gap-2 mb-1.5">
                        <span className="text-xs bg-gray-100 px-2 py-1 rounded font-medium text-gray-700 flex-shrink-0">{key}</span>
                        <span className="text-xs text-gray-600 flex-1">{val}</span>
                        <button type="button" onClick={() => removeSpec(key)} className="text-red-400 hover:text-red-600">
                          <X size={12} />
                        </button>
                      </div>
                    ))}
                    <div className="flex gap-2 mt-2">
                      <input
                        type="text"
                        value={specKey}
                        onChange={(e) => setSpecKey(e.target.value)}
                        placeholder="Key (e.g. RAM)"
                        className="flex-1 border border-gray-200 rounded-lg px-3 py-2 text-xs focus:outline-none focus:ring-2 focus:ring-blue-500"
                      />
                      <input
                        type="text"
                        value={specValue}
                        onChange={(e) => setSpecValue(e.target.value)}
                        placeholder="Value (e.g. 8GB)"
                        className="flex-1 border border-gray-200 rounded-lg px-3 py-2 text-xs focus:outline-none focus:ring-2 focus:ring-blue-500"
                      />
                      <button type="button" onClick={addSpec} className="px-3 py-2 bg-blue-600 text-white rounded-lg text-xs font-medium hover:bg-blue-700">
                        Add
                      </button>
                    </div>
                  </div>

                  {/* Featured toggle */}
                  <div className="sm:col-span-2">
                    <label className="flex items-center gap-3 cursor-pointer">
                      <div
                        onClick={() => setForm({ ...form, featured: !form.featured })}
                        className={`w-12 h-6 rounded-full transition-colors relative ${form.featured ? 'bg-blue-600' : 'bg-gray-300'}`}
                      >
                        <div className={`w-5 h-5 bg-white rounded-full absolute top-0.5 transition-transform shadow-sm ${form.featured ? 'translate-x-6' : 'translate-x-0.5'}`} />
                      </div>
                      <div>
                        <p className="text-sm font-semibold text-gray-700">Featured Product</p>
                        <p className="text-xs text-gray-400">Show on home page featured section</p>
                      </div>
                    </label>
                  </div>
                </div>
              </div>

              <div className="px-6 pb-6">
                <div className="flex gap-3">
                  <button
                    type="button"
                    onClick={() => setModalOpen(false)}
                    className="flex-1 py-3 border border-gray-200 rounded-xl text-sm font-medium text-gray-700 hover:bg-gray-50"
                  >
                    Cancel
                  </button>
                  <button
                    type="submit"
                    disabled={saving}
                    className="flex-1 bg-blue-600 hover:bg-blue-700 text-white py-3 rounded-xl text-sm font-semibold transition-colors flex items-center justify-center gap-2"
                  >
                    {saving ? <span className="animate-spin w-4 h-4 border-2 border-white border-t-transparent rounded-full" /> : <Save size={15} />}
                    {saving ? 'Saving...' : editingProduct ? 'Update Product' : 'Add Product'}
                  </button>
                </div>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
