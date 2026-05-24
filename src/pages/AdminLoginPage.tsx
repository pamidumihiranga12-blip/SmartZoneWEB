import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Shield, Eye, EyeOff } from 'lucide-react';
import { useApp } from '../context/AppContext';
import toast from 'react-hot-toast';

const AdminLoginPage: React.FC = () => {
  const { adminLogin } = useApp();
  const navigate = useNavigate();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [showPass, setShowPass] = useState(false);
  const [loading, setLoading] = useState(false);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setTimeout(() => {
      const result = adminLogin(email, password);
      if (result.success) {
        toast.success('Admin access granted!', { style: { background: '#1a1a3e', color: '#fff' } });
        navigate('/admin');
      } else {
        toast.error(result.message, { style: { background: '#1a1a3e', color: '#fff' } });
      }
      setLoading(false);
    }, 600);
  };

  return (
    <div className="bg-[#070714] min-h-screen flex items-center justify-center px-4">
      <div className="w-full max-w-md">
        <div className="text-center mb-10">
          <div className="inline-flex w-16 h-16 bg-yellow-500/10 border-2 border-yellow-500/30 rounded-2xl items-center justify-center mb-4">
            <Shield size={28} className="text-yellow-400" />
          </div>
          <h1 className="text-3xl font-black text-white">Admin Portal</h1>
          <p className="text-gray-500 mt-2">SmartZone — Administrator Access</p>
        </div>

        <div className="bg-[#0d0d2b] border border-yellow-500/20 rounded-3xl p-8">
          <div className="bg-yellow-500/5 border border-yellow-500/10 rounded-xl p-3 mb-6 text-center">
            <p className="text-yellow-400/80 text-xs">🔐 Restricted Area — Authorized Personnel Only</p>
          </div>
          <form onSubmit={handleSubmit} className="space-y-5">
            <div>
              <label className="text-gray-400 text-sm font-medium block mb-2">Admin Email</label>
              <input type="email" value={email} onChange={e => setEmail(e.target.value)} required placeholder="admin@example.com"
                className="w-full bg-white/5 border border-white/10 focus:border-yellow-500 rounded-xl px-4 py-3.5 text-white placeholder-gray-600 outline-none transition-colors" />
            </div>
            <div>
              <label className="text-gray-400 text-sm font-medium block mb-2">Password</label>
              <div className="relative">
                <input type={showPass ? 'text' : 'password'} value={password} onChange={e => setPassword(e.target.value)} required placeholder="Admin password"
                  className="w-full bg-white/5 border border-white/10 focus:border-yellow-500 rounded-xl px-4 py-3.5 text-white placeholder-gray-600 outline-none transition-colors pr-12" />
                <button type="button" onClick={() => setShowPass(!showPass)} className="absolute right-4 top-1/2 -translate-y-1/2 text-gray-500 hover:text-gray-300">
                  {showPass ? <EyeOff size={18} /> : <Eye size={18} />}
                </button>
              </div>
            </div>
            <button type="submit" disabled={loading}
              className="w-full bg-gradient-to-r from-yellow-600 to-yellow-500 hover:from-yellow-500 hover:to-amber-400 text-white font-bold py-4 rounded-2xl transition-all flex items-center justify-center gap-2 shadow-lg shadow-yellow-500/20 disabled:opacity-70">
              {loading ? <div className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin" /> : <><Shield size={18} /> Access Admin Panel</>}
            </button>
          </form>
        </div>
      </div>
    </div>
  );
};

export default AdminLoginPage;
