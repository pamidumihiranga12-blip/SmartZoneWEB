import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { Eye, EyeOff, LogIn } from 'lucide-react';
import { useApp } from '../context/AppContext';
import toast from 'react-hot-toast';

const LoginPage: React.FC = () => {
  const { login } = useApp();
  const navigate = useNavigate();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [showPass, setShowPass] = useState(false);
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setTimeout(() => {
      const result = login(email, password);
      if (result.success) {
        toast.success('Welcome back!', { style: { background: '#1a1a3e', color: '#fff' } });
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
        <div className="text-center mb-10">
          <div className="inline-flex items-center gap-2 mb-4">
            <div className="w-12 h-12 bg-gradient-to-br from-blue-500 to-cyan-400 rounded-2xl flex items-center justify-center shadow-lg shadow-blue-500/30">
              <span className="text-white font-black text-lg">SZ</span>
            </div>
            <div className="text-left">
              <span className="text-white font-black text-2xl">Smart<span className="text-blue-400">Zone</span></span>
              <div className="text-[9px] text-blue-300/70 -mt-1 tracking-widest">ELECTRONICS</div>
            </div>
          </div>
          <h1 className="text-3xl font-black text-white">Welcome Back</h1>
          <p className="text-gray-500 mt-2">Sign in to your account to continue</p>
        </div>

        <div className="bg-[#0d0d2b] border border-white/10 rounded-3xl p-8">
          <form onSubmit={handleSubmit} className="space-y-5">
            <div>
              <label className="text-gray-400 text-sm font-medium block mb-2">Email Address</label>
              <input type="email" value={email} onChange={e => setEmail(e.target.value)} required
                placeholder="you@example.com"
                className="w-full bg-white/5 border border-white/10 focus:border-blue-500 rounded-xl px-4 py-3.5 text-white placeholder-gray-600 outline-none transition-colors" />
            </div>
            <div>
              <label className="text-gray-400 text-sm font-medium block mb-2">Password</label>
              <div className="relative">
                <input type={showPass ? 'text' : 'password'} value={password} onChange={e => setPassword(e.target.value)} required
                  placeholder="Your password"
                  className="w-full bg-white/5 border border-white/10 focus:border-blue-500 rounded-xl px-4 py-3.5 text-white placeholder-gray-600 outline-none transition-colors pr-12" />
                <button type="button" onClick={() => setShowPass(!showPass)}
                  className="absolute right-4 top-1/2 -translate-y-1/2 text-gray-500 hover:text-gray-300 transition-colors">
                  {showPass ? <EyeOff size={18} /> : <Eye size={18} />}
                </button>
              </div>
            </div>
            <button type="submit" disabled={loading}
              className="w-full bg-gradient-to-r from-blue-600 to-blue-500 hover:from-blue-500 hover:to-cyan-500 text-white font-bold py-4 rounded-2xl transition-all flex items-center justify-center gap-2 shadow-lg shadow-blue-500/20 disabled:opacity-70">
              {loading ? (
                <div className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin" />
              ) : (
                <><LogIn size={18} /> Sign In</>
              )}
            </button>
          </form>

          <div className="mt-6 text-center">
            <p className="text-gray-500 text-sm">
              Don't have an account?{' '}
              <Link to="/register" className="text-blue-400 hover:text-blue-300 font-semibold transition-colors">Create Account</Link>
            </p>
          </div>
        </div>

        <div className="mt-4 text-center">
          <Link to="/admin/login" className="text-gray-600 hover:text-gray-400 text-xs transition-colors">
            🔐 Admin Portal
          </Link>
        </div>
      </div>
    </div>
  );
};

export default LoginPage;
