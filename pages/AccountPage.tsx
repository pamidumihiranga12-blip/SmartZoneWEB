import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { User as UserIcon, Mail, Phone, MapPin, Save, LogOut, Lock } from 'lucide-react';
import { useStore } from '../store/useStore';
import { db } from '../services/db'; // Firebase සම්බන්ධතාවය
import { doc, updateDoc } from 'firebase/firestore'; 
import toast from 'react-hot-toast';

export default function AccountPage() {
  const { user, setUser, logout } = useStore();
  const navigate = useNavigate();

  const [form, setForm] = useState({
    name: user?.name || '',
    email: user?.email || '',
    phone: user?.phone || '',
    address: user?.address || '',
  });
  const [saving, setSaving] = useState(false);

  if (!user) {
    navigate('/login');
    return null;
  }

  const handleSave = async (e: React.FormEvent) => {
    e.preventDefault();
    
    // Firestore හි සේව් කර ඇති පරිශීලකයාගේ ID එක තිබිය යුතුය
    if (!user.id) {
      toast.error("User ID not found. Please re-login.");
      return;
    }

    setSaving(true);
    try {
      // 1. Firestore හි ඇති අදාළ Document එක ලබා ගැනීම
      const userRef = doc(db, "users", user.id);

      // 2. දත්ත යාවත්කාලීන කිරීම (Update)
      const updatedData = {
        name: form.name,
        phone: form.phone,
        address: form.address,
      };

      await updateDoc(userRef, updatedData);

      // 3. Local Store එක (State) යාවත්කාලීන කිරීම
      setUser({ ...user, ...updatedData });
      
      toast.success('Profile updated successfully!');
    } catch (err: any) {
      console.error("Profile update error:", err);
      toast.error(err.message || 'Failed to update profile');
    } finally {
      setSaving(false);
    }
  };

  const handleLogout = () => {
    logout();
    navigate('/');
    toast.success('Logged out successfully');
  };

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <h1 className="text-2xl font-black text-gray-900 mb-6">My Account</h1>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {/* Sidebar */}
          <div className="md:col-span-1">
            <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-5 text-center">
              <div className="w-20 h-20 bg-blue-600 rounded-full flex items-center justify-center mx-auto mb-3">
                <span className="text-white font-black text-3xl">{user.name.charAt(0).toUpperCase()}</span>
              </div>
              <h2 className="font-bold text-gray-900">{user.name}</h2>
              <p className="text-sm text-gray-500 mt-0.5">{user.email}</p>
              <div className={`inline-flex items-center gap-1 mt-2 px-3 py-1 rounded-full text-xs font-medium ${
                user.role === 'admin' ? 'bg-blue-100 text-blue-700' : 'bg-gray-100 text-gray-600'
              }`}>
                {user.role === 'admin' ? '⚡ Admin' : '👤 Customer'}
              </div>

              <div className="mt-4 space-y-2 text-left border-t border-gray-100 pt-4">
                <button
                  onClick={() => navigate('/orders')}
                  className="w-full text-left px-3 py-2 text-sm text-gray-700 hover:bg-gray-50 rounded-lg flex items-center gap-2 transition-colors"
                >
                  📦 My Orders
                </button>
                <button
                  onClick={() => navigate('/tracking')}
                  className="w-full text-left px-3 py-2 text-sm text-gray-700 hover:bg-gray-50 rounded-lg flex items-center gap-2 transition-colors"
                >
                  🚚 Track Order
                </button>
                {user.role === 'admin' && (
                  <button
                    onClick={() => navigate('/admin')}
                    className="w-full text-left px-3 py-2 text-sm text-blue-600 hover:bg-blue-50 rounded-lg flex items-center gap-2 transition-colors"
                  >
                    ⚙️ Admin Panel
                  </button>
                )}
                <button
                  onClick={handleLogout}
                  className="w-full text-left px-3 py-2 text-sm text-red-600 hover:bg-red-50 rounded-lg flex items-center gap-2 transition-colors"
                >
                  <LogOut size={14} /> Logout
                </button>
              </div>
            </div>
          </div>

          {/* Profile Form */}
          <div className="md:col-span-2">
            <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-6">
              <h2 className="font-bold text-gray-900 mb-5 flex items-center gap-2">
                <UserIcon size={18} className="text-blue-600" /> Profile Information
              </h2>

              <form onSubmit={handleSave} className="space-y-4">
                <div>
                  <label className="block text-sm font-semibold text-gray-700 mb-1.5">Full Name</label>
                  <div className="relative">
                    <UserIcon size={15} className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
                    <input
                      type="text"
                      value={form.name}
                      onChange={(e) => setForm({ ...form, name: e.target.value })}
                      className="w-full pl-10 pr-4 py-2.5 border border-gray-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-sm font-semibold text-gray-700 mb-1.5">Email Address</label>
                  <div className="relative">
                    <Mail size={15} className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
                    <input
                      type="email"
                      value={form.email}
                      disabled
                      className="w-full pl-10 pr-4 py-2.5 border border-gray-200 rounded-xl text-sm bg-gray-50 text-gray-500 cursor-not-allowed"
                    />
                  </div>
                  <p className="text-xs text-gray-400 mt-1">Email cannot be changed</p>
                </div>

                <div>
                  <label className="block text-sm font-semibold text-gray-700 mb-1.5">Phone Number</label>
                  <div className="relative">
                    <Phone size={15} className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
                    <input
                      type="tel"
                      value={form.phone}
                      onChange={(e) => setForm({ ...form, phone: e.target.value })}
                      placeholder="07X XXX XXXX"
                      className="w-full pl-10 pr-4 py-2.5 border border-gray-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-sm font-semibold text-gray-700 mb-1.5">Delivery Address</label>
                  <div className="relative">
                    <MapPin size={15} className="absolute left-3 top-3 text-gray-400" />
                    <textarea
                      value={form.address}
                      onChange={(e) => setForm({ ...form, address: e.target.value })}
                      rows={2}
                      placeholder="Your default delivery address"
                      className="w-full pl-10 pr-4 py-2.5 border border-gray-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 resize-none"
                    />
                  </div>
                </div>

                <button
                  type="submit"
                  disabled={saving}
                  className="flex items-center gap-2 bg-blue-600 hover:bg-blue-700 disabled:bg-gray-400 text-white px-6 py-2.5 rounded-xl font-semibold text-sm transition-colors"
                >
                  {saving ? (
                    <span className="animate-spin w-4 h-4 border-2 border-white border-t-transparent rounded-full" />
                  ) : (
                    <Save size={15} />
                  )}
                  {saving ? 'Saving...' : 'Save Changes'}
                </button>
              </form>
            </div>

            {/* Account Security */}
            <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-6 mt-4">
              <h2 className="font-bold text-gray-900 mb-2 flex items-center gap-2">
                <Lock size={18} className="text-blue-600" /> Account Security
              </h2>
              <p className="text-sm text-gray-500 mb-4">Keep your account secure with a strong password</p>
              <div className="bg-gray-50 rounded-xl p-4 flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-gray-900">Password</p>
                  <p className="text-xs text-gray-500">Last changed: Unknown</p>
                </div>
                <button className="text-blue-600 text-sm font-medium hover:text-blue-700 border border-blue-200 px-3 py-1.5 rounded-lg hover:bg-blue-50 transition-colors">
                  Change
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}