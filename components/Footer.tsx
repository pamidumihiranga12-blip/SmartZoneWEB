import { Link } from 'react-router-dom';
import { Phone, Mail, MapPin, Zap } from 'lucide-react';
import { useStore } from '../store/useStore';

function FacebookIcon({ size = 16 }: { size?: number }) {
  return (
    <svg width={size} height={size} viewBox="0 0 24 24" fill="currentColor">
      <path d="M18 2h-3a5 5 0 0 0-5 5v3H7v4h3v8h4v-8h3l1-4h-4V7a1 1 0 0 1 1-1h3z" />
    </svg>
  );
}

function InstagramIcon({ size = 16 }: { size?: number }) {
  return (
    <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <rect x="2" y="2" width="20" height="20" rx="5" ry="5" />
      <path d="M16 11.37A4 4 0 1 1 12.63 8 4 4 0 0 1 16 11.37z" />
      <line x1="17.5" y1="6.5" x2="17.51" y2="6.5" />
    </svg>
  );
}

function WhatsAppIcon({ size = 16 }: { size?: number }) {
  return (
    <svg width={size} height={size} viewBox="0 0 24 24" fill="currentColor">
      <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 0 1-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 0 1-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 0 1 2.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0 0 12.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 0 0 5.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 0 0-3.48-8.413Z" />
    </svg>
  );
}

export default function Footer() {
  const { siteSettings } = useStore();
  const phone = siteSettings?.contactPhone || '0786800086';
  const email = siteSettings?.contactEmail || 'smartzonelk101@gmail.com';
  const address = siteSettings?.contactAddress || 'Anuradhapura, Sri Lanka';

  return (
    <footer className="bg-gray-900 text-white">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-14 pb-8">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-10">
          {/* Brand */}
          <div>
            <div className="flex items-center gap-2 mb-4">
              <div className="w-9 h-9 bg-blue-600 rounded-lg flex items-center justify-center">
                <span className="text-white font-black text-lg">S</span>
              </div>
              <span className="text-xl font-black">
                Smart<span className="text-blue-400">Zone</span>
              </span>
            </div>
            <p className="text-gray-400 text-sm leading-relaxed mb-5">
              {siteSettings?.aboutText || "Your trusted destination for premium electronics & smart gadgets in Anuradhapura."}
            </p>
            <div className="flex gap-3">
              {siteSettings?.socialLinks?.facebook && (
                <a href={siteSettings.socialLinks.facebook} target="_blank" rel="noreferrer"
                  className="w-9 h-9 bg-gray-800 rounded-lg flex items-center justify-center text-gray-400 hover:bg-blue-600 hover:text-white transition-all">
                  <FacebookIcon size={16} />
                </a>
              )}
              {siteSettings?.socialLinks?.instagram && (
                <a href={siteSettings.socialLinks.instagram} target="_blank" rel="noreferrer"
                  className="w-9 h-9 bg-gray-800 rounded-lg flex items-center justify-center text-gray-400 hover:bg-pink-600 hover:text-white transition-all">
                  <InstagramIcon size={16} />
                </a>
              )}
              {siteSettings?.socialLinks?.whatsapp && (
                <a href={siteSettings.socialLinks.whatsapp} target="_blank" rel="noreferrer"
                  className="w-9 h-9 bg-gray-800 rounded-lg flex items-center justify-center text-gray-400 hover:bg-green-600 hover:text-white transition-all">
                  <WhatsAppIcon size={16} />
                </a>
              )}
            </div>
          </div>

          {/* Quick Links */}
          <div>
            <h3 className="font-bold text-sm uppercase tracking-wider text-gray-300 mb-5">Quick Links</h3>
            <ul className="space-y-3">
              {[
                { to: '/', label: 'Home' },
                { to: '/products', label: 'All Products' },
                { to: '/products?category=Smartphones', label: 'Smartphones' },
                { to: '/products?category=Laptops', label: 'Laptops' },
                { to: '/products?category=Accessories', label: 'Accessories' },
                { to: '/products?category=TVs', label: 'Smart TVs' },
              ].map((link) => (
                <li key={link.to}>
                  <Link to={link.to} className="text-gray-400 hover:text-white text-sm transition-colors">
                    {link.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Customer Service */}
          <div>
            <h3 className="font-bold text-sm uppercase tracking-wider text-gray-300 mb-5">Customer Service</h3>
            <ul className="space-y-3">
              {[
                { to: '/tracking', label: 'Track Order' },
                { to: '/orders', label: 'My Orders' },
                { to: '/account', label: 'My Account' },
                { to: '/cart', label: 'Shopping Cart' },
                { to: '/contact', label: 'Contact Us' },
                { to: '/login', label: 'Login / Register' },
              ].map((link) => (
                <li key={link.to}>
                  <Link to={link.to} className="text-gray-400 hover:text-white text-sm transition-colors">
                    {link.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Contact */}
          <div>
            <h3 className="font-bold text-sm uppercase tracking-wider text-gray-300 mb-5">Contact Us</h3>
            <ul className="space-y-4">
              <li className="flex items-start gap-3">
                <div className="w-8 h-8 bg-blue-600/20 rounded-lg flex items-center justify-center flex-shrink-0 mt-0.5">
                  <Phone size={14} className="text-blue-400" />
                </div>
                <div>
                  <p className="text-xs text-gray-500 mb-0.5">Phone / WhatsApp</p>
                  <a href={`tel:${phone}`} className="text-sm text-white hover:text-blue-400 transition-colors font-medium">
                    {phone}
                  </a>
                </div>
              </li>
              <li className="flex items-start gap-3">
                <div className="w-8 h-8 bg-blue-600/20 rounded-lg flex items-center justify-center flex-shrink-0 mt-0.5">
                  <Mail size={14} className="text-blue-400" />
                </div>
                <div>
                  <p className="text-xs text-gray-500 mb-0.5">Email</p>
                  <a href={`mailto:${email}`} className="text-sm text-white hover:text-blue-400 transition-colors font-medium break-all">
                    {email}
                  </a>
                </div>
              </li>
              <li className="flex items-start gap-3">
                <div className="w-8 h-8 bg-blue-600/20 rounded-lg flex items-center justify-center flex-shrink-0 mt-0.5">
                  <MapPin size={14} className="text-blue-400" />
                </div>
                <div>
                  <p className="text-xs text-gray-500 mb-0.5">Address</p>
                  <p className="text-sm text-white font-medium">{address}</p>
                </div>
              </li>
            </ul>
          </div>
        </div>

        {/* Bottom */}
        <div className="mt-10 pt-8 border-t border-gray-800 flex flex-col sm:flex-row items-center justify-between gap-4">
          <p className="text-gray-500 text-sm">
            © {new Date().getFullYear()} SmartZone. All rights reserved.
          </p>
          <div className="flex items-center gap-2 text-gray-500 text-sm">
            <Zap size={14} className="text-blue-400" />
            <span>Built with passion for tech lovers</span>
          </div>
        </div>
      </div>
    </footer>
  );
}
