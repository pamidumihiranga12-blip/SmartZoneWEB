import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { Minus, Plus, Trash2, ShoppingBag, ArrowRight, Tag } from 'lucide-react';
import { useStore } from '../store/useStore';
import { orderService } from '../services/db';
import toast from 'react-hot-toast';

export default function CartPage() {
  const { cart, removeFromCart, updateQuantity, getCartTotal, clearCart, user } = useStore();
  const navigate = useNavigate();
  const [checkoutOpen, setCheckoutOpen] = useState(false);
  const [placing, setPlacing] = useState(false);
  const [form, setForm] = useState({
    name: user?.name || '',
    phone: user?.phone || '',
    address: user?.address || '',
    city: '',
    paymentMethod: 'Cash on Delivery',
    notes: '',
  });

  const shipping = getCartTotal() >= 5000 ? 0 : 350;
  const total = getCartTotal() + shipping;

  const handleCheckout = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!user) {
      toast.error('Please login to place an order');
      navigate('/login');
      return;
    }
    if (!form.name || !form.phone || !form.address || !form.city) {
      toast.error('Please fill all required fields');
      return;
    }

    setPlacing(true);
    try {
      const order = orderService.create({
        userId: user._id,
        items: cart.map((item) => ({
          product: item.product,
          quantity: item.quantity,
          price: item.product.price,
        })),
        total,
        shippingAddress: {
          name: form.name,
          phone: form.phone,
          address: form.address,
          city: form.city,
        },
        paymentMethod: form.paymentMethod,
        notes: form.notes,
      });
      clearCart();
      toast.success(`Order #${order.orderNumber} placed successfully!`);
      navigate(`/orders`);
    } catch (error: any) {
      toast.error(error.message || 'Failed to place order');
    } finally {
      setPlacing(false);
    }
  };

  if (cart.length === 0) {
    return (
      <div className="min-h-screen bg-gray-50 flex flex-col items-center justify-center px-4 text-center">
        <ShoppingBag size={64} className="text-gray-300 mb-4" />
        <h2 className="text-2xl font-black text-gray-900 mb-2">Your cart is empty</h2>
        <p className="text-gray-500 mb-6">Add some awesome products to get started!</p>
        <Link
          to="/products"
          className="inline-flex items-center gap-2 bg-blue-600 text-white px-8 py-3 rounded-xl font-semibold hover:bg-blue-700 transition-colors"
        >
          Browse Products <ArrowRight size={18} />
        </Link>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <h1 className="text-2xl font-black text-gray-900 mb-6 flex items-center gap-2">
          <ShoppingBag size={24} className="text-blue-600" />
          Shopping Cart ({cart.length} {cart.length === 1 ? 'item' : 'items'})
        </h1>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Cart Items */}
          <div className="lg:col-span-2 space-y-3">
            {cart.map((item) => (
              <div key={item.product._id} className="bg-white rounded-2xl p-4 shadow-sm border border-gray-100 flex gap-4">
                <Link to={`/products/${item.product._id}`} className="flex-shrink-0">
                  <img
                    src={item.product.images[0] || 'https://images.unsplash.com/photo-1505740420928-5e560c06d30e?w=200'}
                    alt={item.product.name}
                    className="w-20 h-20 object-cover rounded-xl bg-gray-100"
                  />
                </Link>

                <div className="flex-1 min-w-0">
                  <div className="flex items-start justify-between gap-2">
                    <div>
                      <p className="text-xs text-blue-600 font-medium mb-0.5">{item.product.category}</p>
                      <Link to={`/products/${item.product._id}`}>
                        <h3 className="font-semibold text-gray-900 text-sm leading-snug hover:text-blue-600 transition-colors">
                          {item.product.name}
                        </h3>
                      </Link>
                    </div>
                    <button
                      onClick={() => removeFromCart(item.product._id)}
                      className="text-red-400 hover:text-red-600 hover:bg-red-50 p-1 rounded-lg transition-colors flex-shrink-0"
                    >
                      <Trash2 size={15} />
                    </button>
                  </div>

                  <div className="flex items-center justify-between mt-3">
                    <div className="flex items-center gap-0">
                      <button
                        onClick={() => updateQuantity(item.product._id, item.quantity - 1)}
                        className="w-8 h-8 rounded-l-lg border border-gray-200 flex items-center justify-center hover:bg-gray-50 transition-colors text-gray-600"
                      >
                        <Minus size={12} />
                      </button>
                      <span className="w-10 h-8 border-t border-b border-gray-200 flex items-center justify-center text-sm font-semibold">
                        {item.quantity}
                      </span>
                      <button
                        onClick={() => updateQuantity(item.product._id, item.quantity + 1)}
                        className="w-8 h-8 rounded-r-lg border border-gray-200 flex items-center justify-center hover:bg-gray-50 transition-colors text-gray-600"
                      >
                        <Plus size={12} />
                      </button>
                    </div>

                    <div className="text-right">
                      <p className="font-bold text-gray-900">Rs. {(item.product.price * item.quantity).toLocaleString()}</p>
                      <p className="text-xs text-gray-400">Rs. {item.product.price.toLocaleString()} each</p>
                    </div>
                  </div>
                </div>
              </div>
            ))}

            <Link
              to="/products"
              className="inline-flex items-center gap-2 text-blue-600 hover:text-blue-700 text-sm font-medium"
            >
              ← Continue Shopping
            </Link>
          </div>

          {/* Order Summary */}
          <div className="space-y-4">
            <div className="bg-white rounded-2xl p-5 shadow-sm border border-gray-100">
              <h2 className="font-bold text-gray-900 mb-4">Order Summary</h2>

              <div className="space-y-2.5 text-sm">
                <div className="flex justify-between text-gray-600">
                  <span>Subtotal ({cart.reduce((s, i) => s + i.quantity, 0)} items)</span>
                  <span>Rs. {getCartTotal().toLocaleString()}</span>
                </div>
                <div className="flex justify-between text-gray-600">
                  <span>Shipping</span>
                  <span className={shipping === 0 ? 'text-green-600 font-medium' : ''}>
                    {shipping === 0 ? 'FREE' : `Rs. ${shipping}`}
                  </span>
                </div>
                {shipping > 0 && (
                  <p className="text-xs text-gray-400">
                    Add Rs. {(5000 - getCartTotal()).toLocaleString()} more for free shipping
                  </p>
                )}
                <div className="border-t border-gray-100 pt-2.5 flex justify-between font-bold text-gray-900 text-base">
                  <span>Total</span>
                  <span>Rs. {total.toLocaleString()}</span>
                </div>
              </div>

              {!user ? (
                <div className="mt-4 space-y-2">
                  <p className="text-sm text-gray-600 text-center">Please login to checkout</p>
                  <Link
                    to="/login"
                    className="block w-full text-center bg-blue-600 hover:bg-blue-700 text-white py-3 rounded-xl font-semibold transition-colors"
                  >
                    Login to Checkout
                  </Link>
                </div>
              ) : (
                <button
                  onClick={() => setCheckoutOpen(true)}
                  className="mt-4 w-full bg-blue-600 hover:bg-blue-700 text-white py-3 rounded-xl font-semibold transition-colors shadow-lg shadow-blue-200 flex items-center justify-center gap-2"
                >
                  Proceed to Checkout <ArrowRight size={18} />
                </button>
              )}
            </div>

            <div className="bg-green-50 border border-green-200 rounded-xl p-3 flex items-center gap-2">
              <Tag size={14} className="text-green-600 flex-shrink-0" />
              <p className="text-xs text-green-700">Free shipping on orders above Rs. 5,000</p>
            </div>
          </div>
        </div>
      </div>

      {/* Checkout Modal */}
      {checkoutOpen && (
        <div className="fixed inset-0 z-50 flex items-end sm:items-center justify-center p-4 bg-black/50 backdrop-blur-sm">
          <div className="bg-white rounded-2xl w-full max-w-lg shadow-2xl max-h-[90vh] overflow-y-auto">
            <div className="sticky top-0 bg-white border-b border-gray-100 px-6 py-4 flex items-center justify-between">
              <h2 className="font-bold text-gray-900 text-lg">Checkout Details</h2>
              <button onClick={() => setCheckoutOpen(false)} className="text-gray-400 hover:text-gray-600 p-1">✕</button>
            </div>

            <form onSubmit={handleCheckout} className="p-6 space-y-4">
              <div className="grid grid-cols-2 gap-3">
                <div className="col-span-2">
                  <label className="block text-sm font-medium text-gray-700 mb-1">Full Name *</label>
                  <input
                    type="text"
                    required
                    value={form.name}
                    onChange={(e) => setForm({ ...form, name: e.target.value })}
                    className="w-full border border-gray-300 rounded-xl px-3 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
                    placeholder="Your full name"
                  />
                </div>
                <div className="col-span-2">
                  <label className="block text-sm font-medium text-gray-700 mb-1">Phone Number *</label>
                  <input
                    type="tel"
                    required
                    value={form.phone}
                    onChange={(e) => setForm({ ...form, phone: e.target.value })}
                    className="w-full border border-gray-300 rounded-xl px-3 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
                    placeholder="07X XXX XXXX"
                  />
                </div>
                <div className="col-span-2">
                  <label className="block text-sm font-medium text-gray-700 mb-1">Delivery Address *</label>
                  <input
                    type="text"
                    required
                    value={form.address}
                    onChange={(e) => setForm({ ...form, address: e.target.value })}
                    className="w-full border border-gray-300 rounded-xl px-3 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
                    placeholder="House no, Street, Area"
                  />
                </div>
                <div className="col-span-2">
                  <label className="block text-sm font-medium text-gray-700 mb-1">City *</label>
                  <input
                    type="text"
                    required
                    value={form.city}
                    onChange={(e) => setForm({ ...form, city: e.target.value })}
                    className="w-full border border-gray-300 rounded-xl px-3 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
                    placeholder="City"
                  />
                </div>
                <div className="col-span-2">
                  <label className="block text-sm font-medium text-gray-700 mb-1">Payment Method</label>
                  <select
                    value={form.paymentMethod}
                    onChange={(e) => setForm({ ...form, paymentMethod: e.target.value })}
                    className="w-full border border-gray-300 rounded-xl px-3 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
                  >
                    <option>Cash on Delivery</option>
                    <option>Bank Transfer</option>
                    <option>Card Payment</option>
                  </select>
                </div>
                <div className="col-span-2">
                  <label className="block text-sm font-medium text-gray-700 mb-1">Order Notes (Optional)</label>
                  <textarea
                    value={form.notes}
                    onChange={(e) => setForm({ ...form, notes: e.target.value })}
                    rows={2}
                    className="w-full border border-gray-300 rounded-xl px-3 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 resize-none"
                    placeholder="Any special instructions..."
                  />
                </div>
              </div>

              {/* Order Summary in Modal */}
              <div className="bg-gray-50 rounded-xl p-4 space-y-2">
                <p className="font-semibold text-gray-900 text-sm mb-2">Order Summary</p>
                {cart.map((item) => (
                  <div key={item.product._id} className="flex justify-between text-xs text-gray-600">
                    <span>{item.product.name} × {item.quantity}</span>
                    <span>Rs. {(item.product.price * item.quantity).toLocaleString()}</span>
                  </div>
                ))}
                <div className="border-t border-gray-200 pt-2 flex justify-between font-bold text-sm text-gray-900">
                  <span>Total</span>
                  <span>Rs. {total.toLocaleString()}</span>
                </div>
              </div>

              <button
                type="submit"
                disabled={placing}
                className="w-full bg-blue-600 hover:bg-blue-700 disabled:bg-gray-400 text-white py-3.5 rounded-xl font-semibold transition-colors shadow-lg shadow-blue-200 flex items-center justify-center gap-2"
              >
                {placing ? (
                  <span className="flex items-center gap-2">
                    <span className="animate-spin w-4 h-4 border-2 border-white border-t-transparent rounded-full" />
                    Placing Order...
                  </span>
                ) : (
                  <>Place Order - Rs. {total.toLocaleString()} <ArrowRight size={18} /></>
                )}
              </button>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
