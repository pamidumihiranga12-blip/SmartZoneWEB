import React, { useState, useEffect } from 'react';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import { ShoppingCart, User, Menu, X, Search, Phone, MapPin, LogOut, Settings, Package, ChevronDown } from 'lucide-react';
import { useApp } from '../context/AppContext';

const Navbar: React.FC = () => {
  const { currentUser, isAdmin, logout, cartCount, products } = useApp();
  const navigate = useNavigate();
  const location = useLocation();
  const [menuOpen, setMenuOpen] = useState(false);
  const [searchOpen, setSearchOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const [searchResults, setSearchResults] = useState<typeof products>([]);
  const [scrolled, setScrolled] = useState(false);
  const [userDropdown, setUserDropdown] = useState(false);

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 20);
    window.addEventListener('scroll', onScroll);
    return () => window.removeEventListener('scroll', onScroll);
  }, []);

  useEffect(() => { setMenuOpen(false); setUserDropdown(false); }, [location.pathname]);

  const handleSearch = (q: string) => {
    setSearchQuery(q);
    if (q.length > 1) {
      setSearchResults(products.filter(p => p.name.toLowerCase().includes(q.toLowerCase()) || p.category.toLowerCase().includes(q.toLowerCase())).slice(0, 5));
    } else setSearchResults([]);
  };

  const handleLogout = () => { logout(); navigate('/'); setUserDropdown(false); };

  const categories = ['Smartphones', 'Laptops', 'Tablets', 'Audio', 'Wearables', 'Accessories'];

  return (
    <>
      {/* Top Bar */}
      <div className="bg-[#0a0a1a] text-gray-300 text-xs py-1.5 hidden md:block">
        <div className="max-w-7xl mx-auto px-4 flex justify-between items-center">
          <div className="flex items-center gap-6">
            <span className="flex items-center gap-1.5"><Phone size={11} /> 0786800086</span>
            <span className="flex items-center gap-1.5"><MapPin size={11} /> Anuradhapura, Sri Lanka</span>
          </div>
          <div className="flex items-center gap-4">
            <Link to="/tracking" className="hover:text-blue-400 transition-colors">Track Order</Link>
            {!currentUser && <Link to="/login" className="hover:text-blue-400 transition-colors">Sign In</Link>}
            {!currentUser && <Link to="/register" className="hover:text-blue-400 transition-colors">Register</Link>}
          </div>
        </div>
      </div>

      {/* Main Nav */}
      <nav className={`sticky top-0 z-50 transition-all duration-300 ${scrolled ? 'bg-[#0d0d2b]/95 backdrop-blur-xl shadow-2xl' : 'bg-[#0d0d2b]'}`}>
        <div className="max-w-7xl mx-auto px-4">
          <div className="flex items-center justify-between h-16">
            {/* Logo */}
            <Link to="/" className="flex items-center gap-2 group">
              <div className="w-9 h-9 bg-gradient-to-br from-blue-500 to-cyan-400 rounded-xl flex items-center justify-center shadow-lg shadow-blue-500/30 group-hover:shadow-blue-500/50 transition-all">
                <span className="text-white font-black text-sm">SZ</span>
              </div>
              <div>
                <span className="text-white font-black text-xl tracking-tight">Smart<span className="text-blue-400">Zone</span></span>
                <div className="text-[9px] text-blue-300/70 -mt-1 tracking-widest font-medium">ELECTRONICS</div>
              </div>
            </Link>

            {/* Desktop Nav Links */}
            <div className="hidden md:flex items-center gap-1">
              <Link to="/" className={`px-3 py-2 rounded-lg text-sm font-medium transition-all ${location.pathname === '/' ? 'text-blue-400 bg-blue-500/10' : 'text-gray-300 hover:text-white hover:bg-white/5'}`}>Home</Link>
              <div className="relative group">
                <button className="px-3 py-2 rounded-lg text-sm font-medium text-gray-300 hover:text-white hover:bg-white/5 transition-all flex items-center gap-1">
                  Products <ChevronDown size={14} />
                </button>
                <div className="absolute top-full left-0 mt-1 w-48 bg-[#1a1a3e] border border-white/10 rounded-xl shadow-2xl opacity-0 invisible group-hover:opacity-100 group-hover:visible transition-all duration-200 py-2">
                  <Link to="/products" className="block px-4 py-2 text-sm text-gray-300 hover:text-white hover:bg-white/5 transition-colors">All Products</Link>
                  {categories.map(cat => (
                    <Link key={cat} to={`/products?category=${cat}`} className="block px-4 py-2 text-sm text-gray-300 hover:text-white hover:bg-white/5 transition-colors">{cat}</Link>
                  ))}
                </div>
              </div>
              <Link to="/tracking" className={`px-3 py-2 rounded-lg text-sm font-medium transition-all ${location.pathname === '/tracking' ? 'text-blue-400 bg-blue-500/10' : 'text-gray-300 hover:text-white hover:bg-white/5'}`}>Track Order</Link>
              <Link to="/contact" className={`px-3 py-2 rounded-lg text-sm font-medium transition-all ${location.pathname === '/contact' ? 'text-blue-400 bg-blue-500/10' : 'text-gray-300 hover:text-white hover:bg-white/5'}`}>Contact</Link>
            </div>

            {/* Right Side */}
            <div className="flex items-center gap-2">
              {/* Search */}
              <div className="relative hidden md:block">
                <button onClick={() => setSearchOpen(!searchOpen)} className="p-2 text-gray-400 hover:text-white transition-colors">
                  <Search size={20} />
                </button>
                {searchOpen && (
                  <div className="absolute right-0 top-full mt-2 w-80 bg-[#1a1a3e] border border-white/10 rounded-xl shadow-2xl">
                    <div className="p-3">
                      <input
                        autoFocus
                        value={searchQuery}
                        onChange={e => handleSearch(e.target.value)}
                        placeholder="Search products..."
                        className="w-full bg-white/5 border border-white/10 rounded-lg px-4 py-2 text-white text-sm placeholder-gray-500 outline-none focus:border-blue-500"
                      />
                    </div>
                    {searchResults.length > 0 && (
                      <div className="border-t border-white/5 pb-2">
                        {searchResults.map(p => (
                          <button key={p.id} onClick={() => { navigate(`/products/${p.id}`); setSearchOpen(false); setSearchQuery(''); setSearchResults([]); }}
                            className="w-full flex items-center gap-3 px-4 py-2 hover:bg-white/5 transition-colors text-left">
                            <img src={p.image} alt={p.name} className="w-10 h-10 object-cover rounded-lg" />
                            <div>
                              <div className="text-white text-sm font-medium">{p.name}</div>
                              <div className="text-blue-400 text-xs">Rs. {p.price.toLocaleString()}</div>
                            </div>
                          </button>
                        ))}
                      </div>
                    )}
                  </div>
                )}
              </div>

              {/* Cart */}
              <Link to="/cart" className="relative p-2 text-gray-400 hover:text-white transition-colors">
                <ShoppingCart size={22} />
                {cartCount > 0 && (
                  <span className="absolute -top-0.5 -right-0.5 w-5 h-5 bg-blue-500 text-white text-xs rounded-full flex items-center justify-center font-bold animate-bounce">
                    {cartCount > 9 ? '9+' : cartCount}
                  </span>
                )}
              </Link>

              {/* User */}
              {currentUser ? (
                <div className="relative">
                  <button onClick={() => setUserDropdown(!userDropdown)}
                    className="flex items-center gap-2 bg-white/5 hover:bg-white/10 border border-white/10 rounded-xl px-3 py-1.5 transition-all">
                    <div className="w-7 h-7 bg-gradient-to-br from-blue-500 to-cyan-400 rounded-full flex items-center justify-center text-xs font-bold text-white">
                      {currentUser.name.charAt(0).toUpperCase()}
                    </div>
                    <span className="text-white text-sm font-medium hidden md:block">{currentUser.name.split(' ')[0]}</span>
                    <ChevronDown size={14} className="text-gray-400 hidden md:block" />
                  </button>
                  {userDropdown && (
                    <div className="absolute right-0 top-full mt-2 w-52 bg-[#1a1a3e] border border-white/10 rounded-xl shadow-2xl py-2 z-50">
                      <div className="px-4 py-2 border-b border-white/10">
                        <div className="text-white text-sm font-semibold">{currentUser.name}</div>
                        <div className="text-gray-400 text-xs">{currentUser.email}</div>
                      </div>
                      {isAdmin && (
                        <Link to="/admin" className="flex items-center gap-3 px-4 py-2.5 text-sm text-yellow-400 hover:bg-white/5 transition-colors">
                          <Settings size={16} /> Admin Panel
                        </Link>
                      )}
                      <Link to="/orders" className="flex items-center gap-3 px-4 py-2.5 text-sm text-gray-300 hover:text-white hover:bg-white/5 transition-colors">
                        <Package size={16} /> My Orders
                      </Link>
                      <button onClick={handleLogout} className="w-full flex items-center gap-3 px-4 py-2.5 text-sm text-red-400 hover:bg-white/5 transition-colors">
                        <LogOut size={16} /> Sign Out
                      </button>
                    </div>
                  )}
                </div>
              ) : (
                <Link to="/login" className="hidden md:flex items-center gap-2 bg-blue-600 hover:bg-blue-500 text-white px-4 py-2 rounded-xl text-sm font-medium transition-all shadow-lg shadow-blue-500/20">
                  <User size={16} /> Sign In
                </Link>
              )}

              {/* Mobile Menu Button */}
              <button onClick={() => setMenuOpen(!menuOpen)} className="md:hidden p-2 text-gray-400 hover:text-white transition-colors">
                {menuOpen ? <X size={22} /> : <Menu size={22} />}
              </button>
            </div>
          </div>
        </div>

        {/* Mobile Menu */}
        {menuOpen && (
          <div className="md:hidden bg-[#0d0d2b] border-t border-white/5 px-4 pb-4">
            <div className="pt-3 space-y-1">
              <Link to="/" className="block px-4 py-3 text-gray-300 hover:text-white hover:bg-white/5 rounded-xl transition-colors">Home</Link>
              <Link to="/products" className="block px-4 py-3 text-gray-300 hover:text-white hover:bg-white/5 rounded-xl transition-colors">All Products</Link>
              <Link to="/tracking" className="block px-4 py-3 text-gray-300 hover:text-white hover:bg-white/5 rounded-xl transition-colors">Track Order</Link>
              <Link to="/contact" className="block px-4 py-3 text-gray-300 hover:text-white hover:bg-white/5 rounded-xl transition-colors">Contact</Link>
              {!currentUser && <Link to="/login" className="block px-4 py-3 text-blue-400 hover:bg-blue-500/10 rounded-xl transition-colors">Sign In</Link>}
              {!currentUser && <Link to="/register" className="block px-4 py-3 text-blue-400 hover:bg-blue-500/10 rounded-xl transition-colors">Register</Link>}
              {currentUser && isAdmin && <Link to="/admin" className="block px-4 py-3 text-yellow-400 hover:bg-yellow-500/10 rounded-xl transition-colors">Admin Panel</Link>}
              {currentUser && <Link to="/orders" className="block px-4 py-3 text-gray-300 hover:bg-white/5 rounded-xl transition-colors">My Orders</Link>}
              {currentUser && <button onClick={handleLogout} className="w-full text-left px-4 py-3 text-red-400 hover:bg-red-500/10 rounded-xl transition-colors">Sign Out</button>}
            </div>
          </div>
        )}
      </nav>
    </>
  );
};

export default Navbar;
