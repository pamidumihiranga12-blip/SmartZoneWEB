import { create } from 'zustand';
import { persist } from 'zustand/middleware';

export interface Product {
  _id: string;
  name: string;
  description: string;
  price: number;
  originalPrice?: number;
  category: string;
  images: string[];
  stock: number;
  sku: string;
  featured: boolean;
  rating: number;
  reviewCount: number;
  specifications?: Record<string, string>;
  createdAt: string;
}

export interface CartItem {
  product: Product;
  quantity: number;
}

export interface User {
  _id: string;
  name: string;
  email: string;
  phone?: string;
  address?: string;
  role: 'customer' | 'admin';
  token: string;
}

export interface Order {
  _id: string;
  orderNumber: string;
  user: string | User;
  items: { product: Product; quantity: number; price: number }[];
  total: number;
  status: 'pending' | 'processing' | 'shipped' | 'delivered' | 'cancelled';
  shippingAddress: {
    name: string;
    phone: string;
    address: string;
    city: string;
  };
  paymentMethod: string;
  trackingNumber?: string;
  notes?: string;
  createdAt: string;
}

export interface SiteSettings {
  heroBannerTitle: string;
  heroBannerSubtitle: string;
  heroBannerImage: string;
  specialOffer?: {
    title: string;
    description: string;
    discount: string;
    active: boolean;
    bgColor: string;
  };
  aboutText: string;
  contactEmail: string;
  contactPhone: string;
  contactAddress: string;
  socialLinks: {
    facebook?: string;
    instagram?: string;
    twitter?: string;
    whatsapp?: string;
  };
  announcementBar?: {
    text: string;
    active: boolean;
    bgColor: string;
  };
}

interface StoreState {
  // Auth
  user: User | null;
  setUser: (user: User | null) => void;
  logout: () => void;

  // Cart
  cart: CartItem[];
  addToCart: (product: Product, quantity?: number) => void;
  removeFromCart: (productId: string) => void;
  updateQuantity: (productId: string, quantity: number) => void;
  clearCart: () => void;
  getCartTotal: () => number;
  getCartCount: () => number;

  // Site Settings (cached)
  siteSettings: SiteSettings | null;
  setSiteSettings: (settings: SiteSettings) => void;
}

export const useStore = create<StoreState>()(
  persist(
    (set, get) => ({
      // Auth
      user: null,
      setUser: (user) => set({ user }),
      logout: () => set({ user: null }),

      // Cart
      cart: [],
      addToCart: (product, quantity = 1) => {
        const cart = get().cart;
        const existing = cart.find((item) => item.product._id === product._id);
        if (existing) {
          set({
            cart: cart.map((item) =>
              item.product._id === product._id
                ? { ...item, quantity: item.quantity + quantity }
                : item
            ),
          });
        } else {
          set({ cart: [...cart, { product, quantity }] });
        }
      },
      removeFromCart: (productId) =>
        set({ cart: get().cart.filter((item) => item.product._id !== productId) }),
      updateQuantity: (productId, quantity) => {
        if (quantity <= 0) {
          get().removeFromCart(productId);
          return;
        }
        set({
          cart: get().cart.map((item) =>
            item.product._id === productId ? { ...item, quantity } : item
          ),
        });
      },
      clearCart: () => set({ cart: [] }),
      getCartTotal: () =>
        get().cart.reduce((total, item) => total + item.product.price * item.quantity, 0),
      getCartCount: () =>
        get().cart.reduce((count, item) => count + item.quantity, 0),

      // Site Settings
      siteSettings: null,
      setSiteSettings: (settings) => set({ siteSettings: settings }),
    }),
    {
      name: 'smartzone-store',
      partialize: (state) => ({
        user: state.user,
        cart: state.cart,
      }),
    }
  )
);
