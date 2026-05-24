import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { Eye, EyeOff, UserPlus } from 'lucide-react';
import { useApp } from '../context/AppContext';
import toast from 'react-hot-toast';

const RegisterPage: React.FC = () => {
  const { register } = useApp();
  const navigate = useNavigate();
  const [form, setForm] = useState({ name: '', email: '', phone: '', address: '', password: '', confirm: '' });
  const [showPass, setShowPass] = useState(false);
  const [loading, setLoading] = useState(false);

  const update = (k: string, v: string) => setForm(prev => ({ ...prev, [k]: v }));

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (form.password !== form.confirm) { toast.error("Passwords don't match"); return; }
    if (form.password.length < 6) { toast.error('Password must be at least 6 characters'); return; }
    setLoading(true);
    setTimeout(() => {
      const result = register(form.name, form.email, form.phone, form.address, form.password);
      if (result.success) {
        toast.success('Account created successfully!', { style: { background: '#1a1a3e', color: '#fff' } });
        navigate('/');
      } else {
        toast.error(result.message, { style: { background: '#1a1a3e', color: '#fff' } });
      }
      setLoading(false);
    }, 600);
  };

  return (
    <div className="bg-[#070714] min-h-screen flex items-center justify-center px-4 py-16">
      <div className="w-full max-w-md">
        {/* Logo */}
        <div className="text-center mb-8">
          <div className="inline-flex items-center gap-2 mb-4">
            <div className="w-12 h-12 bg-gradient-to-br from-blue-500 to-cyan-400 rounded-2xl flex items-center justify-center shadow-lg shadow-blue-500/30">
              <span className="text-white font-black text-lg">SZ</span>
            </div>
            <div className="text-left">
              <span className="text-white font-black text-2xl">Smart<span className="text-blue-400">Zone</span></span>
              <div className="text-[9px] text-blue-300/70 -mt-1 tracking-widest">ELECTRONICS</div>
            </div>
          </div>
          <h1 className="text-3xl font-black text-white">Create Account</h1>
          <p className="text-gray-500 mt-2">Join SmartZone for the best tech deals</p>
        </div>

        <div className="bg-[#0d0d2b] border border-white/10 rounded-3xl p-8">
          <form onSubmit={handleSubmit} className="space-y-4">
            <div className="grid grid-cols-2 gap-3">
              <div className="col-span-2">
                <label className="text-gray-400 text-sm font-medium block mb-1.5">Full Name</label>
                <input value={form.name} onChange={e => update('name', e.target.value)} required placeholder="John Doe"
                  className="w-full bg-white/5 border border-white/10 focus:border-blue-500 rounded-xl px-4 py-3 text-white placeholder-gray-600 outline-none transition-colors text-sm" />
              </div>
              <div className="col-span-2">
                <label className="text-gray-400 text-sm font-medium block mb-1.5">Email Address</label>
                <input type="email" value={form.email} onChange={e => update('email', e.target.value)} required placeholder="you@example.com"
                  className="w-full bg-white/5 border border-white/10 focus:border-blue-500 rounded-xl px-4 py-3 text-white placeholder-gray-600 outline-none transition-colors text-sm" />
              </div>
              <div>
                <label className="text-gray-400 text-sm font-medium block mb-1.5">Phone</label>
                <input value={form.phone} onChange={e => update('phone', e.target.value)} required placeholder="07XXXXXXXX"
                  className="w-full bg-white/5 border border-white/10 focus:border-blue-500 rounded-xl px-4 py-3 text-white placeholder-gray-600 outline-none transition-colors text-sm" />
              </div>
              <div>
                <label className="text-gray-400 text-sm font-medium block mb-1.5">City/Address</label>
                <input value={form.address} onChange={e => update('address', e.target.value)} required placeholder="Anuradhapura"
                  className="w-full bg-white/5 border border-white/10 focus:border-blue-500 rounded-xl px-4 py-3 text-white placeholder-gray-600 outline-none transition-colors text-sm" />
              </div>
              <div className="col-span-2">
                <label className="text-gray-400 text-sm font-medium block mb-1.5">Password</label>
                <div className="relative">
                  <input type={showPass ? 'text' : 'password'} value={form.password} onChange={e => update('password', e.target.value)} required placeholder="Min 6 characters"
                    className="w-full bg-white/5 border border-white/10 focus:border-blue-500 rounded-xl px-4 py-3 text-white placeholder-gray-600 outline-none transition-colors pr-12 text-sm" />
                  <button type="button" onClick={() => setShowPass(!showPass)} className="absolute right-4 top-1/2 -translate-y-1/2 text-gray-500 hover:text-gray-300">
                    {showPass ? <EyeOff size={16} /> : <Eye size={16} />}
                  </button>
                </div>
              </div>
              <div className="col-span-2">
                <label className="text-gray-400 text-sm font-medium block mb-1.5">Confirm Password</label>
                <input type="password" value={form.confirm} onChange={e => update('confirm', e.target.value)} required placeholder="Repeat password"
                  className="w-full bg-white/5 border border-white/10 focus:border-blue-500 rounded-xl px-4 py-3 text-white placeholder-gray-600 outline-none transition-colors text-sm" />
              </div>
            </div>
            <button type="submit" disabled={loading}
              className="w-full bg-gradient-to-r from-blue-600 to-blue-500 hover:from-blue-500 hover:to-cyan-500 text-white font-bold py-4 rounded-2xl transition-all flex items-center justify-center gap-2 mt-2 shadow-lg shadow-blue-500/20 disabled:opacity-70">
              {loading ? (
                <div className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin" />
              ) : (
                <><UserPlus size={18} /> Create Account</>
              )}
            </button>
          </form>
          <div className="mt-5 text-center">
            <p className="text-gray-500 text-sm">
              Already have an account?{' '}
              <Link to="/login" className="text-blue-400 hover:text-blue-300 font-semibold transition-colors">Sign In</Link>
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default RegisterPage;
