import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { Eye, EyeOff, User, Mail, Phone, MapPin, Lock } from 'lucide-react';
import { db } from '../services/db'; // Firebase db එක import කිරීම
import { collection, addDoc } from 'firebase/firestore'; // Firestore functions
import { useStore } from '../store/useStore';
import toast from 'react-hot-toast';

export default function RegisterPage() {
  const navigate = useNavigate();
  const { setUser } = useStore();
  const [form, setForm] = useState({
    name: '',
    email: '',
    phone: '',
    address: '',
    password: '',
    confirmPassword: '',
  });
  const [showPass, setShowPass] = useState(false);
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    // මූලික පරීක්ෂාවන්
    if (!form.name || !form.email || !form.password) {
      toast.error('Please fill all required fields');
      return;
    }
    if (form.password !== form.confirmPassword) {
      toast.error('Passwords do not match');
      return;
    }
    if (form.password.length < 6) {
      toast.error('Password must be at least 6 characters');
      return;
    }

    setLoading(true);

    try {
      // 1. Firebase Firestore වෙත දත්ත යැවීම
      const docRef = await addDoc(collection(db, "users"), {
        name: form.name,
        email: form.email,
        phone: form.phone,
        address: form.address,
        createdAt: new Date().toISOString()
      });

      // 2. Local Store එකට User දත්ත ඇතුළත් කිරීම
      const newUser = {
        id: docRef.id,
        name: form.name,
        email: form.email,
        phone: form.phone,
        address: form.address,
      };
      
      setUser(newUser);

      toast.success(`Welcome to SmartZone, ${form.name}! 🎉`);
      navigate('/');
    } catch (err: any) {
      console.error("Firebase Error: ", err);
      toast.error(err.message || 'Registration failed');
    } finally {
      setLoading(false);
    }
  };

  const fields = [
    { key: 'name', label: 'Full Name *', type: 'text', icon: <User size={16} />, placeholder: 'Your full name' },
    { key: 'email', label: 'Email Address *', type: 'email', icon: <Mail size={16} />, placeholder: 'you@email.com' },
    { key: 'phone', label: 'Phone Number', type: 'tel', icon: <Phone size={16} />, placeholder: '07X XXX XXXX' },
    { key: 'address', label: 'Address', type: 'text', icon: <MapPin size={16} />, placeholder: 'Your delivery address' },
  ];

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 flex items-center justify-center px-4 py-12">
      <div className="w-full max-w-md">
        {/* Header */}
        <div className="text-center mb-8">
          <Link to="/" className="inline-flex items-center gap-2 mb-6">
            <div className="w-10 h-10 bg-blue-600 rounded-xl flex items-center justify-center">
              <span className="text-white font-black text-xl">S</span>
            </div>
            <span className="text-2xl font-black text-gray-900">Smart<span className="text-blue-600">Zone</span></span>
          </Link>
          <h1 className="text-2xl font-black text-gray-900 mb-1">Create Account</h1>
          <p className="text-gray-500 text-sm">Join SmartZone and start shopping smart!</p>
        </div>

        {/* Form */}
        <div className="bg-white rounded-2xl shadow-xl p-8 border border-gray-100">
          <form onSubmit={handleSubmit} className="space-y-4">
            {fields.map((field) => (
              <div key={field.key}>
                <label className="block text-sm font-semibold text-gray-700 mb-1.5">{field.label}</label>
                <div className="relative">
                  <span className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400">{field.icon}</span>
                  <input
                    type={field.type}
                    required={field.label.includes('*')}
                    value={form[field.key as keyof typeof form]}
                    onChange={(e) => setForm({ ...form, [field.key]: e.target.value })}
                    className="w-full pl-10 pr-4 py-3 border border-gray-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    placeholder={field.placeholder}
                  />
                </div>
              </div>
            ))}

            {/* Password */}
            <div>
              <label className="block text-sm font-semibold text-gray-700 mb-1.5">Password *</label>
              <div className="relative">
                <Lock size={16} className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
                <input
                  type={showPass ? 'text' : 'password'}
                  required
                  value={form.password}
                  onChange={(e) => setForm({ ...form, password: e.target.value })}
                  className="w-full pl-10 pr-12 py-3 border border-gray-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  placeholder="Min. 6 characters"
                />
                <button
                  type="button"
                  onClick={() => setShowPass(!showPass)}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600"
                >
                  {showPass ? <EyeOff size={16} /> : <Eye size={16} />}
                </button>
              </div>
            </div>

            {/* Confirm Password */}
            <div>
              <label className="block text-sm font-semibold text-gray-700 mb-1.5">Confirm Password *</label>
              <div className="relative">
                <Lock size={16} className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
                <input
                  type={showPass ? 'text' : 'password'}
                  required
                  value={form.confirmPassword}
                  onChange={(e) => setForm({ ...form, confirmPassword: e.target.value })}
                  className="w-full pl-10 pr-4 py-3 border border-gray-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  placeholder="Re-enter your password"
                />
              </div>
            </div>

            <button
              type="submit"
              disabled={loading}
              className="w-full bg-blue-600 hover:bg-blue-700 disabled:bg-gray-400 text-white py-3 rounded-xl font-semibold transition-colors shadow-lg shadow-blue-200 flex items-center justify-center gap-2"
            >
              {loading ? (
                <>
                  <span className="animate-spin w-4 h-4 border-2 border-white border-t-transparent rounded-full" />
                  Creating Account...
                </>
              ) : (
                'Create Account 🎉'
              )}
            </button>
          </form>

          <div className="mt-6 text-center">
            <p className="text-sm text-gray-500">
              Already have an account?{' '}
              <Link to="/login" className="text-blue-600 font-semibold hover:text-blue-700">
                Login
              </Link>
            </p>
          </div>
        </div>

        <p className="text-center text-xs text-gray-400 mt-6">
          By registering you agree to our Terms of Service and Privacy Policy
        </p>
      </div>
    </div>
  );
}