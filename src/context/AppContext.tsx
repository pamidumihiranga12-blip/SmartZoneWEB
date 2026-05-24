import React, { createContext, useContext, useState, useEffect, useCallback } from 'react';
import { v4 as uuidv4 } from 'uuid';

// ─── Types ────────────────────────────────────────────────────────────────────
export interface Product {
  id: string;
  name: string;
  price: number;
  originalPrice?: number;
  category: string;
  description: string;
  image: string;
  stock: number;
  rating: number;
  reviews: number;
  featured: boolean;
  badge?: string;
  specs?: { label: string; value: string }[];
}

export interface CartItem {
  product: Product;
  quantity: number;
}

export interface User {
  id: string;
  name: string;
  email: string;
  phone: string;
  address: string;
  createdAt: string;
}

export interface Order {
  id: string;
  userId: string;
  userName: string;
  userEmail: string;
  items: CartItem[];
  total: number;
  status: 'Processing' | 'Shipped' | 'Out for Delivery' | 'Delivered' | 'Cancelled';
  trackingNumber: string;
  createdAt: string;
  shippingAddress: string;
}

export interface SiteSettings {
  heroBannerTitle: string;
  heroBannerSubtitle: string;
  heroBannerImage: string;
  specialOfferText: string;
  specialOfferEnabled: boolean;
  specialOfferBg: string;
  announcementText: string;
  announcementEnabled: boolean;
  featuredSectionTitle: string;
  aboutText: string;
  promoBannerImage: string;
  promoBannerTitle: string;
  promoBannerSubtitle: string;
}

export interface AppContextType {
  // Auth
  currentUser: User | null;
  isAdmin: boolean;
  login: (email: string, password: string) => { success: boolean; message: string };
  adminLogin: (email: string, password: string) => { success: boolean; message: string };
  register: (name: string, email: string, phone: string, address: string, password: string) => { success: boolean; message: string };
  logout: () => void;

  // Products
  products: Product[];
  addProduct: (product: Omit<Product, 'id'>) => void;
  updateProduct: (id: string, product: Partial<Product>) => void;
  deleteProduct: (id: string) => void;

  // Cart
  cart: CartItem[];
  addToCart: (product: Product, quantity?: number) => void;
  removeFromCart: (productId: string) => void;
  updateCartQuantity: (productId: string, quantity: number) => void;
  clearCart: () => void;
  cartTotal: number;
  cartCount: number;

  // Orders
  orders: Order[];
  placeOrder: (shippingAddress: string) => { success: boolean; orderId: string };
  updateOrderStatus: (orderId: string, status: Order['status']) => void;
  getOrderByTracking: (trackingNumber: string) => Order | undefined;

  // Settings
  siteSettings: SiteSettings;
  updateSiteSettings: (settings: Partial<SiteSettings>) => void;

  // Users (admin)
  users: (User & { password: string })[];
  deleteUser: (userId: string) => void;
}

// ─── Default Data ─────────────────────────────────────────────────────────────
const defaultProducts: Product[] = [
  {
    id: uuidv4(),
    name: 'Samsung Galaxy S24 Ultra',
    price: 189900,
    originalPrice: 210000,
    category: 'Smartphones',
    description: 'Experience the ultimate Samsung flagship with a built-in S Pen, 200MP camera, and AI-powered features.',
    image: '/images/product-phone.jpg',
    stock: 15,
    rating: 4.8,
    reviews: 342,
    featured: true,
    badge: 'Best Seller',
    specs: [
      { label: 'Display', value: '6.8" Dynamic AMOLED' },
      { label: 'Processor', value: 'Snapdragon 8 Gen 3' },
      { label: 'RAM', value: '12GB' },
      { label: 'Storage', value: '256GB' },
      { label: 'Battery', value: '5000mAh' },
      { label: 'Camera', value: '200MP + 12MP + 10MP + 10MP' },
    ]
  },
  {
    id: uuidv4(),
    name: 'MacBook Pro 14" M3',
    price: 379900,
    originalPrice: 420000,
    category: 'Laptops',
    description: 'Supercharged by the M3 chip, MacBook Pro delivers incredible performance in a stunning design.',
    image: '/images/product-laptop.jpg',
    stock: 8,
    rating: 4.9,
    reviews: 218,
    featured: true,
    badge: 'New Arrival',
    specs: [
      { label: 'Chip', value: 'Apple M3 Pro' },
      { label: 'RAM', value: '18GB Unified Memory' },
      { label: 'Storage', value: '512GB SSD' },
      { label: 'Display', value: '14.2" Liquid Retina XDR' },
      { label: 'Battery', value: 'Up to 18 hours' },
    ]
  },
  {
    id: uuidv4(),
    name: 'iPad Pro 12.9" M4',
    price: 159900,
    originalPrice: 175000,
    category: 'Tablets',
    description: 'The ultimate iPad experience with M4 chip, Liquid Retina XDR display, and Apple Pencil Pro support.',
    image: '/images/product-tablet.jpg',
    stock: 12,
    rating: 4.7,
    reviews: 165,
    featured: true,
    badge: 'Hot Deal',
    specs: [
      { label: 'Chip', value: 'Apple M4' },
      { label: 'Display', value: '12.9" Liquid Retina XDR' },
      { label: 'Storage', value: '256GB' },
      { label: 'Battery', value: 'Up to 10 hours' },
    ]
  },
  {
    id: uuidv4(),
    name: 'Sony WH-1000XM5',
    price: 49900,
    originalPrice: 65000,
    category: 'Audio',
    description: 'Industry-leading noise cancellation with exceptional sound quality and up to 30-hour battery life.',
    image: '/images/product-headphones.jpg',
    stock: 25,
    rating: 4.8,
    reviews: 521,
    featured: true,
    badge: 'Top Rated',
    specs: [
      { label: 'Driver Size', value: '30mm' },
      { label: 'Battery', value: '30 hours' },
      { label: 'Charging', value: 'USB-C, 3hr full charge' },
      { label: 'ANC', value: 'Industry-leading' },
    ]
  },
  {
    id: uuidv4(),
    name: 'Apple Watch Ultra 2',
    price: 129900,
    originalPrice: 145000,
    category: 'Wearables',
    description: 'Built for endurance athletes with precision dual-frequency GPS, 36-hour battery, and titanium case.',
    image: '/images/product-watch.jpg',
    stock: 10,
    rating: 4.9,
    reviews: 287,
    featured: false,
    badge: 'Premium',
    specs: [
      { label: 'Case', value: '49mm Titanium' },
      { label: 'Display', value: '2000 nits LTPO OLED' },
      { label: 'GPS', value: 'Dual-frequency L1 & L5' },
      { label: 'Water Resistance', value: '100m' },
      { label: 'Battery', value: 'Up to 36 hours' },
    ]
  },
  {
    id: uuidv4(),
    name: 'iPhone 15 Pro Max',
    price: 219900,
    originalPrice: 240000,
    category: 'Smartphones',
    description: 'Titanium design with Action Button, 48MP main camera with 5x optical zoom, and A17 Pro chip.',
    image: '/images/product-phone.jpg',
    stock: 20,
    rating: 4.9,
    reviews: 612,
    featured: false,
    badge: 'Premium',
    specs: [
      { label: 'Chip', value: 'A17 Pro' },
      { label: 'Display', value: '6.7" Super Retina XDR' },
      { label: 'Camera', value: '48MP + 12MP + 12MP' },
      { label: 'Storage', value: '256GB' },
    ]
  },
];

const defaultSettings: SiteSettings = {
  heroBannerTitle: 'Your Smart Tech Destination',
  heroBannerSubtitle: 'Discover the latest smartphones, laptops, tablets & more at SmartZone — Anuradhapura\'s #1 electronics store.',
  heroBannerImage: '/images/hero-bg.jpg',
  specialOfferText: '🔥 MEGA SALE: Up to 30% OFF on all Apple products this week only! Shop now and save big!',
  specialOfferEnabled: true,
  specialOfferBg: '#1a1a2e',
  announcementText: '🚀 Free delivery in Anuradhapura for orders above Rs. 5,000 | Call us: 0786800086',
  announcementEnabled: true,
  featuredSectionTitle: 'Featured Products',
  aboutText: 'SmartZone is Anuradhapura\'s leading electronics retail store, offering the latest gadgets, smartphones, laptops, and accessories at the best prices.',
  promoBannerImage: '/images/banner-promo.jpg',
  promoBannerTitle: 'New Season, New Tech',
  promoBannerSubtitle: 'Explore the latest arrivals and exclusive deals',
};

// ─── Context ──────────────────────────────────────────────────────────────────
const AppContext = createContext<AppContextType | undefined>(undefined);

export const AppProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [currentUser, setCurrentUser] = useState<User | null>(() => {
    const stored = localStorage.getItem('sz_currentUser');
    return stored ? JSON.parse(stored) : null;
  });
  const [isAdmin, setIsAdmin] = useState<boolean>(() => {
    return localStorage.getItem('sz_isAdmin') === 'true';
  });
  const [products, setProducts] = useState<Product[]>(() => {
    const stored = localStorage.getItem('sz_products');
    return stored ? JSON.parse(stored) : defaultProducts;
  });
  const [cart, setCart] = useState<CartItem[]>(() => {
    const stored = localStorage.getItem('sz_cart');
    return stored ? JSON.parse(stored) : [];
  });
  const [orders, setOrders] = useState<Order[]>(() => {
    const stored = localStorage.getItem('sz_orders');
    return stored ? JSON.parse(stored) : [];
  });
  const [siteSettings, setSiteSettings] = useState<SiteSettings>(() => {
    const stored = localStorage.getItem('sz_settings');
    return stored ? { ...defaultSettings, ...JSON.parse(stored) } : defaultSettings;
  });
  const [users, setUsers] = useState<(User & { password: string })[]>(() => {
    const stored = localStorage.getItem('sz_users');
    return stored ? JSON.parse(stored) : [];
  });

  // Persist to localStorage
  useEffect(() => { localStorage.setItem('sz_products', JSON.stringify(products)); }, [products]);
  useEffect(() => { localStorage.setItem('sz_cart', JSON.stringify(cart)); }, [cart]);
  useEffect(() => { localStorage.setItem('sz_orders', JSON.stringify(orders)); }, [orders]);
  useEffect(() => { localStorage.setItem('sz_settings', JSON.stringify(siteSettings)); }, [siteSettings]);
  useEffect(() => { localStorage.setItem('sz_users', JSON.stringify(users)); }, [users]);
  useEffect(() => {
    if (currentUser) localStorage.setItem('sz_currentUser', JSON.stringify(currentUser));
    else localStorage.removeItem('sz_currentUser');
  }, [currentUser]);
  useEffect(() => { localStorage.setItem('sz_isAdmin', String(isAdmin)); }, [isAdmin]);

  // ─── Auth ─────────────────────────────────────────────────────────────────
  const register = useCallback((name: string, email: string, phone: string, address: string, password: string) => {
    const exists = users.find(u => u.email.toLowerCase() === email.toLowerCase());
    if (exists) return { success: false, message: 'Email already registered.' };
    const newUser: User & { password: string } = {
      id: uuidv4(), name, email, phone, address, password,
      createdAt: new Date().toISOString(),
    };
    setUsers(prev => [...prev, newUser]);
    const { password: _, ...userWithoutPassword } = newUser;
    setCurrentUser(userWithoutPassword);
    setIsAdmin(false);
    return { success: true, message: 'Registered successfully!' };
  }, [users]);

  const login = useCallback((email: string, password: string) => {
    const user = users.find(u => u.email.toLowerCase() === email.toLowerCase() && u.password === password);
    if (!user) return { success: false, message: 'Invalid email or password.' };
    const { password: _, ...userWithoutPassword } = user;
    setCurrentUser(userWithoutPassword);
    setIsAdmin(false);
    return { success: true, message: 'Logged in successfully!' };
  }, [users]);

  const adminLogin = useCallback((email: string, password: string) => {
    if (email === 'smartzonelk101@gmail.com' && password === 'admin') {
      setCurrentUser({ id: 'admin', name: 'Admin', email, phone: '0786800086', address: 'Anuradhapura', createdAt: new Date().toISOString() });
      setIsAdmin(true);
      return { success: true, message: 'Admin logged in!' };
    }
    return { success: false, message: 'Invalid admin credentials.' };
  }, []);

  const logout = useCallback(() => {
    setCurrentUser(null);
    setIsAdmin(false);
  }, []);

  // ─── Products ─────────────────────────────────────────────────────────────
  const addProduct = useCallback((product: Omit<Product, 'id'>) => {
    setProducts(prev => [...prev, { ...product, id: uuidv4() }]);
  }, []);

  const updateProduct = useCallback((id: string, updates: Partial<Product>) => {
    setProducts(prev => prev.map(p => p.id === id ? { ...p, ...updates } : p));
  }, []);

  const deleteProduct = useCallback((id: string) => {
    setProducts(prev => prev.filter(p => p.id !== id));
  }, []);

  // ─── Cart ─────────────────────────────────────────────────────────────────
  const addToCart = useCallback((product: Product, quantity = 1) => {
    setCart(prev => {
      const existing = prev.find(i => i.product.id === product.id);
      if (existing) return prev.map(i => i.product.id === product.id ? { ...i, quantity: i.quantity + quantity } : i);
      return [...prev, { product, quantity }];
    });
  }, []);

  const removeFromCart = useCallback((productId: string) => {
    setCart(prev => prev.filter(i => i.product.id !== productId));
  }, []);

  const updateCartQuantity = useCallback((productId: string, quantity: number) => {
    if (quantity < 1) return;
    setCart(prev => prev.map(i => i.product.id === productId ? { ...i, quantity } : i));
  }, []);

  const clearCart = useCallback(() => setCart([]), []);

  const cartTotal = cart.reduce((sum, i) => sum + i.product.price * i.quantity, 0);
  const cartCount = cart.reduce((sum, i) => sum + i.quantity, 0);

  // ─── Orders ───────────────────────────────────────────────────────────────
  const placeOrder = useCallback((shippingAddress: string) => {
    if (!currentUser || cart.length === 0) return { success: false, orderId: '' };
    const trackingNumber = 'SZ' + Date.now().toString().slice(-8).toUpperCase();
    const order: Order = {
      id: uuidv4(),
      userId: currentUser.id,
      userName: currentUser.name,
      userEmail: currentUser.email,
      items: [...cart],
      total: cartTotal,
      status: 'Processing',
      trackingNumber,
      createdAt: new Date().toISOString(),
      shippingAddress,
    };
    setOrders(prev => [...prev, order]);
    clearCart();
    return { success: true, orderId: order.id };
  }, [currentUser, cart, cartTotal, clearCart]);

  const updateOrderStatus = useCallback((orderId: string, status: Order['status']) => {
    setOrders(prev => prev.map(o => o.id === orderId ? { ...o, status } : o));
  }, []);

  const getOrderByTracking = useCallback((trackingNumber: string) => {
    return orders.find(o => o.trackingNumber.toLowerCase() === trackingNumber.toLowerCase());
  }, [orders]);

  // ─── Settings ─────────────────────────────────────────────────────────────
  const updateSiteSettings = useCallback((settings: Partial<SiteSettings>) => {
    setSiteSettings(prev => ({ ...prev, ...settings }));
  }, []);

  const deleteUser = useCallback((userId: string) => {
    setUsers(prev => prev.filter(u => u.id !== userId));
  }, []);

  return (
    <AppContext.Provider value={{
      currentUser, isAdmin, login, adminLogin, register, logout,
      products, addProduct, updateProduct, deleteProduct,
      cart, addToCart, removeFromCart, updateCartQuantity, clearCart, cartTotal, cartCount,
      orders, placeOrder, updateOrderStatus, getOrderByTracking,
      siteSettings, updateSiteSettings,
      users, deleteUser,
    }}>
      {children}
    </AppContext.Provider>
  );
};

export const useApp = () => {
  const ctx = useContext(AppContext);
  if (!ctx) throw new Error('useApp must be used within AppProvider');
  return ctx;
};
