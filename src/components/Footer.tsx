import React from 'react';
import { Link } from 'react-router-dom';
import { Phone, MapPin, Mail, ArrowRight, Shield, Truck, RefreshCw, Headphones } from 'lucide-react';

const Footer: React.FC = () => {
  return (
    <footer className="bg-[#050510] text-gray-400 mt-auto">
      {/* Features Bar */}
      <div className="border-t border-white/5 bg-[#0a0a1a]">
        <div className="max-w-7xl mx-auto px-4 py-8 grid grid-cols-2 md:grid-cols-4 gap-6">
          {[
            { icon: Truck, title: 'Free Delivery', desc: 'On orders above Rs. 5,000' },
            { icon: Shield, title: 'Secure Payment', desc: '100% secure transactions' },
            { icon: RefreshCw, title: 'Easy Returns', desc: '7-day hassle-free returns' },
            { icon: Headphones, title: '24/7 Support', desc: 'Always here to help you' },
          ].map(({ icon: Icon, title, desc }) => (
            <div key={title} className="flex items-center gap-3">
              <div className="w-10 h-10 bg-blue-500/10 rounded-xl flex items-center justify-center flex-shrink-0">
                <Icon size={20} className="text-blue-400" />
              </div>
              <div>
                <div className="text-white font-semibold text-sm">{title}</div>
                <div className="text-xs text-gray-500">{desc}</div>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Main Footer */}
      <div className="max-w-7xl mx-auto px-4 py-12 grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-10">
        {/* Brand */}
        <div>
          <div className="flex items-center gap-2 mb-4">
            <div className="w-9 h-9 bg-gradient-to-br from-blue-500 to-cyan-400 rounded-xl flex items-center justify-center">
              <span className="text-white font-black text-sm">SZ</span>
            </div>
            <div>
              <span className="text-white font-black text-xl">Smart<span className="text-blue-400">Zone</span></span>
              <div className="text-[9px] text-blue-300/70 -mt-1 tracking-widest">ELECTRONICS</div>
            </div>
          </div>
          <p className="text-sm leading-relaxed mb-5">
            Anuradhapura's #1 electronics destination. We bring you the latest in technology at unbeatable prices.
          </p>
          <div className="flex gap-3">
            {['f', 'in', 'tw', 'yt'].map((s, i) => (
              <a key={i} href="#" className="w-9 h-9 bg-white/5 hover:bg-blue-500/20 border border-white/10 hover:border-blue-500/50 rounded-xl flex items-center justify-center transition-all group">
                <span className="text-gray-500 group-hover:text-blue-400 transition-colors text-xs font-bold">{s}</span>
              </a>
            ))}
          </div>
        </div>

        {/* Quick Links */}
        <div>
          <h3 className="text-white font-bold mb-5 text-sm uppercase tracking-widest">Quick Links</h3>
          <ul className="space-y-3">
            {[
              { to: '/', label: 'Home' },
              { to: '/products', label: 'All Products' },
              { to: '/tracking', label: 'Track My Order' },
              { to: '/contact', label: 'Contact Us' },
              { to: '/admin/login', label: 'Admin Portal' },
            ].map(({ to, label }) => (
              <li key={to}>
                <Link to={to} className="flex items-center gap-2 hover:text-white hover:gap-3 transition-all text-sm group">
                  <ArrowRight size={12} className="text-blue-500 opacity-0 group-hover:opacity-100 transition-all" />
                  {label}
                </Link>
              </li>
            ))}
          </ul>
        </div>

        {/* Categories */}
        <div>
          <h3 className="text-white font-bold mb-5 text-sm uppercase tracking-widest">Categories</h3>
          <ul className="space-y-3">
            {['Smartphones', 'Laptops', 'Tablets', 'Audio', 'Wearables', 'Accessories'].map(cat => (
              <li key={cat}>
                <Link to={`/products?category=${cat}`} className="flex items-center gap-2 hover:text-white hover:gap-3 transition-all text-sm group">
                  <ArrowRight size={12} className="text-blue-500 opacity-0 group-hover:opacity-100 transition-all" />
                  {cat}
                </Link>
              </li>
            ))}
          </ul>
        </div>

        {/* Contact */}
        <div>
          <h3 className="text-white font-bold mb-5 text-sm uppercase tracking-widest">Contact Us</h3>
          <ul className="space-y-4">
            <li className="flex items-start gap-3">
              <MapPin size={16} className="text-blue-400 mt-0.5 flex-shrink-0" />
              <span className="text-sm">Anuradhapura, Sri Lanka</span>
            </li>
            <li className="flex items-center gap-3">
              <Phone size={16} className="text-blue-400 flex-shrink-0" />
              <a href="tel:0786800086" className="text-sm hover:text-white transition-colors">0786800086</a>
            </li>
            <li className="flex items-center gap-3">
              <Mail size={16} className="text-blue-400 flex-shrink-0" />
              <a href="mailto:smartzonelk101@gmail.com" className="text-sm hover:text-white transition-colors break-all">smartzonelk101@gmail.com</a>
            </li>
          </ul>

          {/* Newsletter */}
          <div className="mt-6">
            <p className="text-sm text-white font-semibold mb-2">Newsletter</p>
            <div className="flex gap-2">
              <input
                type="email"
                placeholder="Your email"
                className="flex-1 bg-white/5 border border-white/10 rounded-xl px-3 py-2 text-sm text-white placeholder-gray-600 outline-none focus:border-blue-500 transition-colors"
              />
              <button className="bg-blue-600 hover:bg-blue-500 text-white px-3 py-2 rounded-xl transition-colors">
                <ArrowRight size={16} />
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* Bottom Bar */}
      <div className="border-t border-white/5">
        <div className="max-w-7xl mx-auto px-4 py-5 flex flex-col md:flex-row justify-between items-center gap-2 text-xs">
          <span>© 2026 SmartZone. All rights reserved.</span>
          <span className="text-blue-400/70">Anuradhapura's Smart Choice 🇱🇰</span>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
