import React, { useState, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import {
  LayoutDashboard, Package, ShoppingBag, Users, Settings,
  Plus, Pencil, Trash2, Save, X, Upload, Eye,
  TrendingUp, DollarSign, Star, AlertCircle, Check, ToggleLeft, ToggleRight, LogOut
} from 'lucide-react';
import { useApp, Product } from '../context/AppContext';
import toast from 'react-hot-toast';

type Tab = 'dashboard' | 'products' | 'orders' | 'users' | 'settings' | 'homepage';

const AdminPage: React.FC = () => {
  const { currentUser, isAdmin, logout, orders } = useApp();
  const navigate = useNavigate();
  const [tab, setTab] = useState<Tab>('dashboard');

  if (!currentUser || !isAdmin) {
    return (
      <div className="bg-[#070714] min-h-screen flex items-center justify-center">
        <div className="text-center">
          <div className="text-6xl mb-4">🔐</div>
          <h2 className="text-white text-2xl font-bold mb-4">Admin Access Required</h2>
          <button onClick={() => navigate('/admin/login')} className="bg-yellow-600 text-white px-6 py-3 rounded-xl font-bold">Go to Admin Login</button>
        </div>
      </div>
    );
  }

  const totalRevenue = orders.reduce((s, o) => s + o.total, 0);
  const pendingOrders = orders.filter(o => o.status === 'Processing').length;

  const navItems: { id: Tab; label: string; icon: React.ElementType }[] = [
    { id: 'dashboard', label: 'Dashboard', icon: LayoutDashboard },
    { id: 'products', label: 'Products', icon: Package },
    { id: 'orders', label: 'Orders', icon: ShoppingBag },
    { id: 'users', label: 'Customers', icon: Users },
    { id: 'homepage', label: 'Homepage', icon: Eye },
    { id: 'settings', label: 'Settings', icon: Settings },
  ];

  return (
    <div className="bg-[#070714] min-h-screen flex">
      {/* Sidebar */}
      <div className="w-64 bg-[#0a0a1a] border-r border-white/5 flex flex-col fixed h-screen z-40">
        <div className="p-5 border-b border-white/5">
          <div className="flex items-center gap-2">
            <div className="w-9 h-9 bg-gradient-to-br from-yellow-500 to-yellow-600 rounded-xl flex items-center justify-center">
              <span className="text-white font-black text-sm">SZ</span>
            </div>
            <div>
              <span className="text-white font-black">Admin Panel</span>
              <div className="text-yellow-400/70 text-xs">SmartZone</div>
            </div>
          </div>
        </div>
        <nav className="flex-1 p-3 space-y-1 overflow-y-auto">
          {navItems.map(({ id, label, icon: Icon }) => (
            <button key={id} onClick={() => setTab(id)}
              className={`w-full flex items-center gap-3 px-4 py-3 rounded-xl text-sm font-medium transition-all ${tab === id ? 'bg-yellow-500/10 text-yellow-400 border border-yellow-500/20' : 'text-gray-400 hover:text-white hover:bg-white/5'}`}>
              <Icon size={18} /> {label}
              {id === 'orders' && pendingOrders > 0 && (
                <span className="ml-auto bg-red-500 text-white text-xs px-1.5 py-0.5 rounded-full">{pendingOrders}</span>
              )}
            </button>
          ))}
        </nav>
        <div className="p-3 border-t border-white/5">
          <div className="px-4 py-2 mb-2">
            <div className="text-white text-sm font-semibold">{currentUser.name}</div>
            <div className="text-yellow-400 text-xs">Administrator</div>
          </div>
          <button onClick={() => { logout(); navigate('/'); }}
            className="w-full flex items-center gap-3 px-4 py-3 rounded-xl text-sm text-red-400 hover:bg-red-500/10 transition-all">
            <LogOut size={18} /> Sign Out
          </button>
        </div>
      </div>

      {/* Content */}
      <div className="ml-64 flex-1 p-8 overflow-auto min-h-screen">
        {tab === 'dashboard' && <DashboardTab totalRevenue={totalRevenue} pendingOrders={pendingOrders} />}
        {tab === 'products' && <ProductsTab />}
        {tab === 'orders' && <OrdersTab />}
        {tab === 'users' && <UsersTab />}
        {tab === 'homepage' && <HomepageTab />}
        {tab === 'settings' && <SettingsTab />}
      </div>
    </div>
  );
};

// ─── Dashboard Tab ─────────────────────────────────────────────────────────────
const DashboardTab: React.FC<{ totalRevenue: number; pendingOrders: number }> = ({ totalRevenue, pendingOrders }) => {
  const { products, orders, users } = useApp();
  const recentOrders = [...orders].reverse().slice(0, 5);

  const stats = [
    { label: 'Total Revenue', value: `Rs. ${totalRevenue.toLocaleString()}`, icon: DollarSign, color: 'green', change: '+12%' },
    { label: 'Total Orders', value: orders.length, icon: ShoppingBag, color: 'blue', change: `${pendingOrders} pending` },
    { label: 'Products', value: products.length, icon: Package, color: 'purple', change: 'in catalog' },
    { label: 'Customers', value: users.length, icon: Users, color: 'cyan', change: 'registered' },
  ];

  return (
    <div>
      <h1 className="text-3xl font-black text-white mb-8">Dashboard</h1>
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5 mb-8">
        {stats.map(({ label, value, icon: Icon, color, change }) => (
          <div key={label} className={`bg-[#0d0d2b] border border-white/8 rounded-2xl p-5 hover:border-${color}-500/30 transition-all`}>
            <div className="flex items-center justify-between mb-4">
              <div className={`w-10 h-10 bg-${color}-500/10 rounded-xl flex items-center justify-center`}>
                <Icon size={20} className={`text-${color}-400`} />
              </div>
              <span className="text-green-400 text-xs font-semibold">{change}</span>
            </div>
            <div className="text-2xl font-black text-white mb-1">{value}</div>
            <div className="text-gray-500 text-sm">{label}</div>
          </div>
        ))}
      </div>

      {/* Recent Orders */}
      <div className="bg-[#0d0d2b] border border-white/8 rounded-2xl p-6">
        <h2 className="text-white font-bold text-lg mb-5 flex items-center gap-2">
          <TrendingUp size={18} className="text-blue-400" /> Recent Orders
        </h2>
        {recentOrders.length === 0 ? (
          <p className="text-gray-500 text-center py-8">No orders yet</p>
        ) : (
          <div className="space-y-3">
            {recentOrders.map(order => (
              <div key={order.id} className="flex items-center gap-4 p-3 bg-white/3 rounded-xl border border-white/5">
                <div className="flex-1 min-w-0">
                  <p className="text-white font-semibold text-sm">{order.userName}</p>
                  <p className="text-gray-500 text-xs font-mono">{order.trackingNumber}</p>
                </div>
                <span className={`px-2.5 py-1 rounded-full text-xs font-bold ${
                  order.status === 'Delivered' ? 'bg-green-500/10 text-green-400' :
                  order.status === 'Shipped' ? 'bg-blue-500/10 text-blue-400' :
                  order.status === 'Cancelled' ? 'bg-red-500/10 text-red-400' :
                  'bg-yellow-500/10 text-yellow-400'
                }`}>{order.status}</span>
                <span className="text-white font-bold text-sm">Rs. {order.total.toLocaleString()}</span>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

// ─── Products Tab ──────────────────────────────────────────────────────────────
const emptyProduct: Omit<Product, 'id'> = {
  name: '', price: 0, originalPrice: undefined, category: 'Smartphones',
  description: '', image: '/images/product-phone.jpg', stock: 0,
  rating: 4.5, reviews: 0, featured: false, badge: '', specs: [],
};

const ProductsTab: React.FC = () => {
  const { products, addProduct, updateProduct, deleteProduct } = useApp();
  const [showForm, setShowForm] = useState(false);
  const [editId, setEditId] = useState<string | null>(null);
  const [form, setForm] = useState<Omit<Product, 'id'>>(emptyProduct);
  const [specInput, setSpecInput] = useState({ label: '', value: '' });
  const fileRef = useRef<HTMLInputElement>(null);

  const categories = ['Smartphones', 'Laptops', 'Tablets', 'Audio', 'Wearables', 'Accessories'];

  const update = (k: string, v: any) => setForm(prev => ({ ...prev, [k]: v }));

  const handleEdit = (product: Product) => {
    setForm({ name: product.name, price: product.price, originalPrice: product.originalPrice, category: product.category, description: product.description, image: product.image, stock: product.stock, rating: product.rating, reviews: product.reviews, featured: product.featured, badge: product.badge || '', specs: product.specs || [] });
    setEditId(product.id);
    setShowForm(true);
  };

  const handleSave = () => {
    if (!form.name || !form.price) { toast.error('Name and price are required'); return; }
    if (editId) { updateProduct(editId, form); toast.success('Product updated!', { style: { background: '#1a1a3e', color: '#fff' } }); }
    else { addProduct(form); toast.success('Product added!', { style: { background: '#1a1a3e', color: '#fff' } }); }
    setShowForm(false); setEditId(null); setForm(emptyProduct);
  };

  const handleDelete = (id: string) => {
    if (window.confirm('Delete this product?')) { deleteProduct(id); toast.success('Product deleted'); }
  };

  const handleImageUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    const reader = new FileReader();
    reader.onload = () => update('image', reader.result as string);
    reader.readAsDataURL(file);
  };

  const addSpec = () => {
    if (!specInput.label || !specInput.value) return;
    update('specs', [...(form.specs || []), specInput]);
    setSpecInput({ label: '', value: '' });
  };

  return (
    <div>
      <div className="flex items-center justify-between mb-8">
        <h1 className="text-3xl font-black text-white">Products ({products.length})</h1>
        <button onClick={() => { setShowForm(true); setEditId(null); setForm(emptyProduct); }}
          className="flex items-center gap-2 bg-blue-600 hover:bg-blue-500 text-white px-5 py-2.5 rounded-xl font-semibold transition-colors">
          <Plus size={18} /> Add Product
        </button>
      </div>

      {/* Product Form */}
      {showForm && (
        <div className="fixed inset-0 bg-black/70 backdrop-blur-sm z-50 flex items-center justify-center p-4">
          <div className="bg-[#0d0d2b] border border-white/10 rounded-3xl w-full max-w-2xl max-h-[90vh] overflow-y-auto">
            <div className="flex items-center justify-between p-6 border-b border-white/10">
              <h2 className="text-white font-bold text-xl">{editId ? 'Edit Product' : 'Add New Product'}</h2>
              <button onClick={() => { setShowForm(false); setEditId(null); }} className="text-gray-400 hover:text-white">
                <X size={24} />
              </button>
            </div>
            <div className="p-6 space-y-4">
              {/* Image Upload */}
              <div>
                <label className="text-gray-400 text-sm font-medium block mb-2">Product Image</label>
                <div className="relative">
                  {form.image && (
                    <img src={form.image} alt="Preview" className="w-full h-40 object-cover rounded-xl mb-2 border border-white/10" />
                  )}
                  <input type="file" ref={fileRef} onChange={handleImageUpload} accept="image/*" className="hidden" />
                  <button onClick={() => fileRef.current?.click()}
                    className="flex items-center gap-2 bg-white/5 border border-white/10 hover:border-blue-500 text-gray-400 hover:text-white px-4 py-2 rounded-xl transition-all text-sm">
                    <Upload size={16} /> Upload Image
                  </button>
                  <p className="text-gray-600 text-xs mt-1">Or enter image URL:</p>
                  <input value={form.image} onChange={e => update('image', e.target.value)} placeholder="https://... or /images/..."
                    className="w-full bg-white/5 border border-white/10 focus:border-blue-500 rounded-xl px-3 py-2 text-white placeholder-gray-600 outline-none text-sm mt-1" />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div className="col-span-2">
                  <label className="text-gray-400 text-sm font-medium block mb-1.5">Product Name *</label>
                  <input value={form.name} onChange={e => update('name', e.target.value)} placeholder="e.g. Samsung Galaxy S24"
                    className="w-full bg-white/5 border border-white/10 focus:border-blue-500 rounded-xl px-4 py-3 text-white placeholder-gray-600 outline-none text-sm" />
                </div>
                <div>
                  <label className="text-gray-400 text-sm font-medium block mb-1.5">Price (Rs.) *</label>
                  <input type="number" value={form.price} onChange={e => update('price', +e.target.value)}
                    className="w-full bg-white/5 border border-white/10 focus:border-blue-500 rounded-xl px-4 py-3 text-white outline-none text-sm" />
                </div>
                <div>
                  <label className="text-gray-400 text-sm font-medium block mb-1.5">Original Price (Rs.)</label>
                  <input type="number" value={form.originalPrice || ''} onChange={e => update('originalPrice', +e.target.value || undefined)}
                    className="w-full bg-white/5 border border-white/10 focus:border-blue-500 rounded-xl px-4 py-3 text-white outline-none text-sm" />
                </div>
                <div>
                  <label className="text-gray-400 text-sm font-medium block mb-1.5">Category</label>
                  <select value={form.category} onChange={e => update('category', e.target.value)}
                    className="w-full bg-[#1a1a3e] border border-white/10 focus:border-blue-500 rounded-xl px-4 py-3 text-white outline-none text-sm">
                    {categories.map(c => <option key={c}>{c}</option>)}
                  </select>
                </div>
                <div>
                  <label className="text-gray-400 text-sm font-medium block mb-1.5">Stock</label>
                  <input type="number" value={form.stock} onChange={e => update('stock', +e.target.value)}
                    className="w-full bg-white/5 border border-white/10 focus:border-blue-500 rounded-xl px-4 py-3 text-white outline-none text-sm" />
                </div>
                <div>
                  <label className="text-gray-400 text-sm font-medium block mb-1.5">Badge</label>
                  <input value={form.badge} onChange={e => update('badge', e.target.value)} placeholder="e.g. New Arrival, Sale"
                    className="w-full bg-white/5 border border-white/10 focus:border-blue-500 rounded-xl px-4 py-3 text-white placeholder-gray-600 outline-none text-sm" />
                </div>
                <div className="col-span-2">
                  <label className="text-gray-400 text-sm font-medium block mb-1.5">Description</label>
                  <textarea value={form.description} onChange={e => update('description', e.target.value)} rows={3} placeholder="Product description..."
                    className="w-full bg-white/5 border border-white/10 focus:border-blue-500 rounded-xl px-4 py-3 text-white placeholder-gray-600 outline-none text-sm resize-none" />
                </div>

                {/* Specs */}
                <div className="col-span-2">
                  <label className="text-gray-400 text-sm font-medium block mb-1.5">Specifications</label>
                  <div className="space-y-2">
                    {(form.specs || []).map((spec, i) => (
                      <div key={i} className="flex gap-2 text-sm">
                        <span className="bg-blue-500/10 text-blue-400 px-2 py-1 rounded-lg">{spec.label}: {spec.value}</span>
                        <button onClick={() => update('specs', (form.specs || []).filter((_, j) => j !== i))} className="text-red-400 hover:text-red-300">
                          <X size={14} />
                        </button>
                      </div>
                    ))}
                    <div className="flex gap-2">
                      <input value={specInput.label} onChange={e => setSpecInput(s => ({ ...s, label: e.target.value }))} placeholder="Label (e.g. RAM)"
                        className="flex-1 bg-white/5 border border-white/10 rounded-lg px-3 py-2 text-white text-sm outline-none" />
                      <input value={specInput.value} onChange={e => setSpecInput(s => ({ ...s, value: e.target.value }))} placeholder="Value (e.g. 8GB)"
                        className="flex-1 bg-white/5 border border-white/10 rounded-lg px-3 py-2 text-white text-sm outline-none" />
                      <button onClick={addSpec} className="bg-blue-600 text-white px-3 py-2 rounded-lg text-sm font-semibold">Add</button>
                    </div>
                  </div>
                </div>

                {/* Featured Toggle */}
                <div className="col-span-2 flex items-center gap-3">
                  <button onClick={() => update('featured', !form.featured)} className={`transition-colors ${form.featured ? 'text-blue-400' : 'text-gray-600'}`}>
                    {form.featured ? <ToggleRight size={28} /> : <ToggleLeft size={28} />}
                  </button>
                  <span className="text-gray-300 text-sm">Featured Product</span>
                </div>
              </div>
            </div>
            <div className="p-6 border-t border-white/10 flex gap-3">
              <button onClick={() => { setShowForm(false); setEditId(null); }}
                className="flex-1 bg-white/5 border border-white/10 text-white py-3 rounded-xl font-semibold hover:bg-white/10 transition-colors">Cancel</button>
              <button onClick={handleSave}
                className="flex-1 bg-blue-600 hover:bg-blue-500 text-white py-3 rounded-xl font-semibold transition-colors flex items-center justify-center gap-2">
                <Save size={18} /> {editId ? 'Update' : 'Add'} Product
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Products Table */}
      <div className="bg-[#0d0d2b] border border-white/8 rounded-2xl overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead>
              <tr className="border-b border-white/10">
                <th className="text-left text-gray-500 text-xs font-bold uppercase tracking-wider px-5 py-4">Product</th>
                <th className="text-left text-gray-500 text-xs font-bold uppercase tracking-wider px-5 py-4">Category</th>
                <th className="text-left text-gray-500 text-xs font-bold uppercase tracking-wider px-5 py-4">Price</th>
                <th className="text-left text-gray-500 text-xs font-bold uppercase tracking-wider px-5 py-4">Stock</th>
                <th className="text-left text-gray-500 text-xs font-bold uppercase tracking-wider px-5 py-4">Featured</th>
                <th className="text-right text-gray-500 text-xs font-bold uppercase tracking-wider px-5 py-4">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-white/5">
              {products.map(product => (
                <tr key={product.id} className="hover:bg-white/3 transition-colors">
                  <td className="px-5 py-4">
                    <div className="flex items-center gap-3">
                      <img src={product.image} alt={product.name} className="w-10 h-10 object-cover rounded-xl" />
                      <div>
                        <p className="text-white font-medium text-sm">{product.name}</p>
                        {product.badge && <span className="text-blue-400 text-xs">{product.badge}</span>}
                      </div>
                    </div>
                  </td>
                  <td className="px-5 py-4 text-gray-400 text-sm">{product.category}</td>
                  <td className="px-5 py-4">
                    <p className="text-white font-bold text-sm">Rs. {product.price.toLocaleString()}</p>
                    {product.originalPrice && <p className="text-gray-600 text-xs line-through">Rs. {product.originalPrice.toLocaleString()}</p>}
                  </td>
                  <td className="px-5 py-4">
                    <span className={`px-2 py-1 rounded-full text-xs font-semibold ${product.stock > 5 ? 'bg-green-500/10 text-green-400' : product.stock > 0 ? 'bg-orange-500/10 text-orange-400' : 'bg-red-500/10 text-red-400'}`}>
                      {product.stock}
                    </span>
                  </td>
                  <td className="px-5 py-4">
                    {product.featured ? <Star size={16} fill="#f59e0b" className="text-yellow-400" /> : <span className="text-gray-700">—</span>}
                  </td>
                  <td className="px-5 py-4 text-right">
                    <div className="flex items-center justify-end gap-2">
                      <button onClick={() => handleEdit(product)} className="p-2 bg-blue-500/10 text-blue-400 hover:bg-blue-500/20 rounded-lg transition-colors">
                        <Pencil size={14} />
                      </button>
                      <button onClick={() => handleDelete(product.id)} className="p-2 bg-red-500/10 text-red-400 hover:bg-red-500/20 rounded-lg transition-colors">
                        <Trash2 size={14} />
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};

// ─── Orders Tab ────────────────────────────────────────────────────────────────
const OrdersTab: React.FC = () => {
  const { orders, updateOrderStatus } = useApp();
  const [filter, setFilter] = useState('all');

  const filtered = filter === 'all' ? orders : orders.filter(o => o.status.toLowerCase() === filter.toLowerCase());
  const statusOptions = ['Processing', 'Shipped', 'Out for Delivery', 'Delivered', 'Cancelled'] as const;

  return (
    <div>
      <h1 className="text-3xl font-black text-white mb-8">Orders ({orders.length})</h1>

      {/* Filter Tabs */}
      <div className="flex gap-2 flex-wrap mb-6">
        {['all', 'Processing', 'Shipped', 'Out for Delivery', 'Delivered', 'Cancelled'].map(s => (
          <button key={s} onClick={() => setFilter(s)}
            className={`px-4 py-2 rounded-xl text-sm font-semibold capitalize transition-all ${filter === s ? 'bg-blue-600 text-white' : 'bg-white/5 text-gray-400 hover:text-white border border-white/10'}`}>
            {s}
          </button>
        ))}
      </div>

      {filtered.length === 0 ? (
        <div className="text-center py-16 text-gray-500">No orders found</div>
      ) : (
        <div className="space-y-4">
          {[...filtered].reverse().map(order => (
            <div key={order.id} className="bg-[#0d0d2b] border border-white/8 rounded-2xl p-5">
              <div className="flex flex-wrap items-center justify-between gap-3 mb-4">
                <div>
                  <p className="text-white font-bold">{order.userName}</p>
                  <p className="text-gray-500 text-xs">{order.userEmail}</p>
                  <p className="text-blue-400 text-xs font-mono mt-0.5">#{order.trackingNumber}</p>
                </div>
                <div className="flex items-center gap-3">
                  <select value={order.status} onChange={e => updateOrderStatus(order.id, e.target.value as any)}
                    className="bg-[#1a1a3e] border border-white/10 text-white rounded-xl px-3 py-2 text-sm outline-none">
                    {statusOptions.map(s => <option key={s}>{s}</option>)}
                  </select>
                  <span className="text-white font-black">Rs. {order.total.toLocaleString()}</span>
                </div>
              </div>
              <div className="flex flex-wrap gap-2 mb-3">
                {order.items.map((item: any) => (
                  <div key={item.product.id} className="flex items-center gap-2 bg-white/3 rounded-xl px-3 py-1.5">
                    <img src={item.product.image} alt="" className="w-8 h-8 rounded-lg object-cover" />
                    <span className="text-gray-300 text-xs">{item.product.name} x{item.quantity}</span>
                  </div>
                ))}
              </div>
              <p className="text-gray-500 text-xs flex items-center gap-1">
                <AlertCircle size={11} /> {order.shippingAddress} — {new Date(order.createdAt).toLocaleDateString()}
              </p>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

// ─── Users Tab ─────────────────────────────────────────────────────────────────
const UsersTab: React.FC = () => {
  const { users, deleteUser } = useApp();

  return (
    <div>
      <h1 className="text-3xl font-black text-white mb-8">Customers ({users.length})</h1>
      {users.length === 0 ? (
        <div className="text-center py-16 text-gray-500">No customers registered yet</div>
      ) : (
        <div className="bg-[#0d0d2b] border border-white/8 rounded-2xl overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead>
                <tr className="border-b border-white/10">
                  {['Name', 'Email', 'Phone', 'Address', 'Joined', 'Actions'].map(h => (
                    <th key={h} className="text-left text-gray-500 text-xs font-bold uppercase tracking-wider px-5 py-4">{h}</th>
                  ))}
                </tr>
              </thead>
              <tbody className="divide-y divide-white/5">
                {users.map(user => (
                  <tr key={user.id} className="hover:bg-white/3 transition-colors">
                    <td className="px-5 py-4">
                      <div className="flex items-center gap-3">
                        <div className="w-8 h-8 bg-gradient-to-br from-blue-500 to-cyan-400 rounded-full flex items-center justify-center text-xs font-bold text-white">
                          {user.name.charAt(0).toUpperCase()}
                        </div>
                        <span className="text-white font-medium text-sm">{user.name}</span>
                      </div>
                    </td>
                    <td className="px-5 py-4 text-gray-400 text-sm">{user.email}</td>
                    <td className="px-5 py-4 text-gray-400 text-sm">{user.phone}</td>
                    <td className="px-5 py-4 text-gray-400 text-sm">{user.address}</td>
                    <td className="px-5 py-4 text-gray-500 text-xs">{new Date(user.createdAt).toLocaleDateString()}</td>
                    <td className="px-5 py-4">
                      <button onClick={() => { if (window.confirm('Delete this customer?')) deleteUser(user.id); }}
                        className="p-2 bg-red-500/10 text-red-400 hover:bg-red-500/20 rounded-lg transition-colors">
                        <Trash2 size={14} />
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}
    </div>
  );
};

// ─── Homepage Tab ──────────────────────────────────────────────────────────────
const HomepageTab: React.FC = () => {
  const { siteSettings, updateSiteSettings } = useApp();
  const [settings, setSettings] = useState(siteSettings);
  const heroFileRef = useRef<HTMLInputElement>(null);
  const promoFileRef = useRef<HTMLInputElement>(null);

  const update = (k: string, v: any) => setSettings(prev => ({ ...prev, [k]: v }));

  const handleSave = () => {
    updateSiteSettings(settings);
    toast.success('Homepage updated!', { style: { background: '#1a1a3e', color: '#fff' } });
  };

  const handleImageUpload = (key: string, e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    const reader = new FileReader();
    reader.onload = () => update(key, reader.result as string);
    reader.readAsDataURL(file);
  };

  return (
    <div>
      <div className="flex items-center justify-between mb-8">
        <h1 className="text-3xl font-black text-white">Homepage Editor</h1>
        <button onClick={handleSave} className="flex items-center gap-2 bg-green-600 hover:bg-green-500 text-white px-5 py-2.5 rounded-xl font-semibold transition-colors">
          <Save size={18} /> Save Changes
        </button>
      </div>

      <div className="space-y-6">
        {/* Announcement */}
        <Section title="📢 Announcement Bar">
          <div className="flex items-center gap-3 mb-3">
            <button onClick={() => update('announcementEnabled', !settings.announcementEnabled)}
              className={settings.announcementEnabled ? 'text-blue-400' : 'text-gray-600'}>
              {settings.announcementEnabled ? <ToggleRight size={28} /> : <ToggleLeft size={28} />}
            </button>
            <span className="text-gray-300 text-sm">Show announcement bar</span>
          </div>
          <input value={settings.announcementText} onChange={e => update('announcementText', e.target.value)}
            placeholder="Announcement text..."
            className="w-full bg-white/5 border border-white/10 focus:border-blue-500 rounded-xl px-4 py-3 text-white placeholder-gray-600 outline-none text-sm" />
        </Section>

        {/* Special Offer */}
        <Section title="🔥 Special Offer Banner">
          <div className="flex items-center gap-3 mb-3">
            <button onClick={() => update('specialOfferEnabled', !settings.specialOfferEnabled)}
              className={settings.specialOfferEnabled ? 'text-blue-400' : 'text-gray-600'}>
              {settings.specialOfferEnabled ? <ToggleRight size={28} /> : <ToggleLeft size={28} />}
            </button>
            <span className="text-gray-300 text-sm">Show special offer banner</span>
          </div>
          <div className="space-y-3">
            <input value={settings.specialOfferText} onChange={e => update('specialOfferText', e.target.value)}
              placeholder="Special offer text..."
              className="w-full bg-white/5 border border-white/10 focus:border-blue-500 rounded-xl px-4 py-3 text-white placeholder-gray-600 outline-none text-sm" />
            <div className="flex items-center gap-3">
              <label className="text-gray-400 text-sm">Background Color:</label>
              <input type="color" value={settings.specialOfferBg} onChange={e => update('specialOfferBg', e.target.value)}
                className="w-10 h-10 rounded-lg cursor-pointer bg-transparent border border-white/10" />
              <span className="text-gray-500 text-sm">{settings.specialOfferBg}</span>
            </div>
          </div>
        </Section>

        {/* Hero Banner */}
        <Section title="🖼️ Hero Banner">
          <div className="space-y-4">
            <div>
              <label className="text-gray-400 text-sm block mb-1.5">Hero Image</label>
              {settings.heroBannerImage && (
                <img src={settings.heroBannerImage} alt="Hero" className="w-full h-32 object-cover rounded-xl mb-2 border border-white/10" />
              )}
              <input type="file" ref={heroFileRef} onChange={e => handleImageUpload('heroBannerImage', e)} accept="image/*" className="hidden" />
              <div className="flex gap-2">
                <button onClick={() => heroFileRef.current?.click()}
                  className="flex items-center gap-2 bg-white/5 border border-white/10 hover:border-blue-500 text-gray-400 hover:text-white px-4 py-2 rounded-xl text-sm transition-all">
                  <Upload size={14} /> Upload Hero Image
                </button>
              </div>
              <input value={settings.heroBannerImage} onChange={e => update('heroBannerImage', e.target.value)} placeholder="/images/hero-bg.jpg"
                className="w-full mt-2 bg-white/5 border border-white/10 focus:border-blue-500 rounded-xl px-4 py-2 text-white placeholder-gray-600 outline-none text-sm" />
            </div>
            <div>
              <label className="text-gray-400 text-sm block mb-1.5">Hero Title</label>
              <input value={settings.heroBannerTitle} onChange={e => update('heroBannerTitle', e.target.value)}
                className="w-full bg-white/5 border border-white/10 focus:border-blue-500 rounded-xl px-4 py-3 text-white outline-none text-sm" />
            </div>
            <div>
              <label className="text-gray-400 text-sm block mb-1.5">Hero Subtitle</label>
              <textarea value={settings.heroBannerSubtitle} onChange={e => update('heroBannerSubtitle', e.target.value)} rows={2}
                className="w-full bg-white/5 border border-white/10 focus:border-blue-500 rounded-xl px-4 py-3 text-white outline-none text-sm resize-none" />
            </div>
          </div>
        </Section>

        {/* Promo Banner */}
        <Section title="🎯 Promo Banner">
          <div className="space-y-4">
            <div>
              <label className="text-gray-400 text-sm block mb-1.5">Promo Image</label>
              {settings.promoBannerImage && (
                <img src={settings.promoBannerImage} alt="Promo" className="w-full h-32 object-cover rounded-xl mb-2 border border-white/10" />
              )}
              <input type="file" ref={promoFileRef} onChange={e => handleImageUpload('promoBannerImage', e)} accept="image/*" className="hidden" />
              <button onClick={() => promoFileRef.current?.click()}
                className="flex items-center gap-2 bg-white/5 border border-white/10 hover:border-blue-500 text-gray-400 hover:text-white px-4 py-2 rounded-xl text-sm transition-all">
                <Upload size={14} /> Upload Promo Image
              </button>
              <input value={settings.promoBannerImage} onChange={e => update('promoBannerImage', e.target.value)} placeholder="/images/banner-promo.jpg"
                className="w-full mt-2 bg-white/5 border border-white/10 focus:border-blue-500 rounded-xl px-4 py-2 text-white placeholder-gray-600 outline-none text-sm" />
            </div>
            <div>
              <label className="text-gray-400 text-sm block mb-1.5">Promo Title</label>
              <input value={settings.promoBannerTitle} onChange={e => update('promoBannerTitle', e.target.value)}
                className="w-full bg-white/5 border border-white/10 focus:border-blue-500 rounded-xl px-4 py-3 text-white outline-none text-sm" />
            </div>
            <div>
              <label className="text-gray-400 text-sm block mb-1.5">Promo Subtitle</label>
              <input value={settings.promoBannerSubtitle} onChange={e => update('promoBannerSubtitle', e.target.value)}
                className="w-full bg-white/5 border border-white/10 focus:border-blue-500 rounded-xl px-4 py-3 text-white outline-none text-sm" />
            </div>
          </div>
        </Section>

        {/* Featured Section */}
        <Section title="⭐ Featured Section">
          <div>
            <label className="text-gray-400 text-sm block mb-1.5">Section Title</label>
            <input value={settings.featuredSectionTitle} onChange={e => update('featuredSectionTitle', e.target.value)}
              className="w-full bg-white/5 border border-white/10 focus:border-blue-500 rounded-xl px-4 py-3 text-white outline-none text-sm" />
          </div>
        </Section>

        <div className="flex justify-end">
          <button onClick={handleSave}
            className="flex items-center gap-2 bg-green-600 hover:bg-green-500 text-white px-8 py-3 rounded-2xl font-bold transition-colors shadow-lg shadow-green-500/20">
            <Check size={18} /> Save All Changes
          </button>
        </div>
      </div>
    </div>
  );
};

// ─── Settings Tab ──────────────────────────────────────────────────────────────
const SettingsTab: React.FC = () => {
  const { siteSettings, updateSiteSettings } = useApp();
  const [about, setAbout] = useState(siteSettings.aboutText);

  return (
    <div>
      <h1 className="text-3xl font-black text-white mb-8">Settings</h1>
      <div className="space-y-6">
        <div className="bg-[#0d0d2b] border border-white/8 rounded-2xl p-6">
          <h2 className="text-white font-bold mb-5">Store Information</h2>
          <div className="space-y-4">
            <InfoRow label="Business Name" value="SmartZone" />
            <InfoRow label="Phone" value="0786800086" />
            <InfoRow label="Address" value="Anuradhapura, Sri Lanka" />
            <InfoRow label="Email" value="smartzonelk101@gmail.com" />
          </div>
        </div>

        <div className="bg-[#0d0d2b] border border-white/8 rounded-2xl p-6">
          <h2 className="text-white font-bold mb-4">About Us Text</h2>
          <textarea value={about} onChange={e => setAbout(e.target.value)} rows={4}
            className="w-full bg-white/5 border border-white/10 focus:border-blue-500 rounded-xl px-4 py-3 text-white outline-none text-sm resize-none mb-3" />
          <button onClick={() => { updateSiteSettings({ aboutText: about }); toast.success('Saved!'); }}
            className="flex items-center gap-2 bg-blue-600 hover:bg-blue-500 text-white px-5 py-2.5 rounded-xl font-semibold transition-colors">
            <Save size={16} /> Save
          </button>
        </div>

        <div className="bg-[#0d0d2b] border border-white/8 rounded-2xl p-6">
          <h2 className="text-white font-bold mb-2">Admin Credentials</h2>
          <p className="text-gray-500 text-sm mb-4">Admin login credentials are fixed for security.</p>
          <InfoRow label="Admin Email" value="smartzonelk101@gmail.com" />
          <InfoRow label="Password" value="••••••" />
        </div>
      </div>
    </div>
  );
};

const InfoRow: React.FC<{ label: string; value: string }> = ({ label, value }) => (
  <div className="flex gap-4 py-2 border-b border-white/5">
    <span className="text-gray-500 text-sm w-36 flex-shrink-0">{label}</span>
    <span className="text-white text-sm font-medium">{value}</span>
  </div>
);

const Section: React.FC<{ title: string; children: React.ReactNode }> = ({ title, children }) => (
  <div className="bg-[#0d0d2b] border border-white/8 rounded-2xl p-6">
    <h2 className="text-white font-bold text-base mb-5">{title}</h2>
    {children}
  </div>
);

export default AdminPage;
