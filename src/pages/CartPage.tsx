import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { ShoppingCart, Plus, Minus, ArrowRight, Tag, X } from 'lucide-react';
import { useApp } from '../context/AppContext';
import toast from 'react-hot-toast';

const CartPage: React.FC = () => {
  const { cart, removeFromCart, updateCartQuantity, cartTotal, currentUser, placeOrder } = useApp();
  const navigate = useNavigate();
  const [step, setStep] = useState<'cart' | 'checkout' | 'success'>('cart');
  const [shippingAddress, setShippingAddress] = useState(currentUser?.address || '');
  const [name, setName] = useState(currentUser?.name || '');
  const [phone, setPhone] = useState(currentUser?.phone || '');
  const [_orderId, setOrderId] = useState('');
  const [trackingNum, setTrackingNum] = useState('');

  const shipping = cartTotal >= 5000 ? 0 : 350;
  const totalWithShipping = cartTotal + shipping;

  const handleCheckout = () => {
    if (!currentUser) { navigate('/login'); return; }
    setStep('checkout');
  };

  const handlePlaceOrder = () => {
    if (!shippingAddress.trim() || !name.trim() || !phone.trim()) {
      toast.error('Please fill all fields'); return;
    }
    const result = placeOrder(`${name}, ${phone}, ${shippingAddress}`);
    if (result.success) {
      setOrderId(result.orderId);
      const order = JSON.parse(localStorage.getItem('sz_orders') || '[]').find((o: any) => o.id === result.orderId);
      setTrackingNum(order?.trackingNumber || '');
      setStep('success');
    }
  };

  if (step === 'success') {
    return (
      <div className="bg-[#070714] min-h-screen flex items-center justify-center px-4">
        <div className="text-center max-w-md">
          <div className="w-24 h-24 bg-green-500/10 border-2 border-green-500/30 rounded-full flex items-center justify-center mx-auto mb-6 animate-bounce">
            <span className="text-5xl">✅</span>
          </div>
          <h2 className="text-white text-3xl font-black mb-3">Order Placed!</h2>
          <p className="text-gray-400 mb-6">Your order has been successfully placed. We'll notify you when it's shipped.</p>
          <div className="bg-[#0d0d2b] border border-white/10 rounded-2xl p-6 mb-6">
            <p className="text-gray-400 text-sm mb-2">Your Tracking Number</p>
            <p className="text-blue-400 text-2xl font-black tracking-widest">{trackingNum}</p>
            <p className="text-gray-500 text-xs mt-2">Save this for tracking your order</p>
          </div>
          <div className="flex gap-3">
            <Link to="/tracking" className="flex-1 bg-blue-600 hover:bg-blue-500 text-white py-3 rounded-2xl font-bold text-center transition-colors">Track Order</Link>
            <Link to="/products" className="flex-1 bg-white/5 hover:bg-white/10 border border-white/10 text-white py-3 rounded-2xl font-bold text-center transition-colors">Continue Shopping</Link>
          </div>
        </div>
      </div>
    );
  }

  if (step === 'checkout') {
    return (
      <div className="bg-[#070714] min-h-screen py-10 px-4">
        <div className="max-w-2xl mx-auto">
          <button onClick={() => setStep('cart')} className="flex items-center gap-2 text-gray-400 hover:text-white mb-6 transition-colors">
            ← Back to Cart
          </button>
          <h1 className="text-3xl font-black text-white mb-8">Checkout</h1>
          <div className="bg-[#0d0d2b] border border-white/10 rounded-2xl p-6 mb-6 space-y-4">
            <h2 className="text-white font-bold text-lg mb-4">Shipping Details</h2>
            <div>
              <label className="text-gray-400 text-sm block mb-1.5">Full Name</label>
              <input value={name} onChange={e => setName(e.target.value)} placeholder="Your full name"
                className="w-full bg-white/5 border border-white/10 focus:border-blue-500 rounded-xl px-4 py-3 text-white placeholder-gray-500 outline-none transition-colors" />
            </div>
            <div>
              <label className="text-gray-400 text-sm block mb-1.5">Phone Number</label>
              <input value={phone} onChange={e => setPhone(e.target.value)} placeholder="Your phone number"
                className="w-full bg-white/5 border border-white/10 focus:border-blue-500 rounded-xl px-4 py-3 text-white placeholder-gray-500 outline-none transition-colors" />
            </div>
            <div>
              <label className="text-gray-400 text-sm block mb-1.5">Delivery Address</label>
              <textarea value={shippingAddress} onChange={e => setShippingAddress(e.target.value)} rows={3} placeholder="Street, City, Province"
                className="w-full bg-white/5 border border-white/10 focus:border-blue-500 rounded-xl px-4 py-3 text-white placeholder-gray-500 outline-none transition-colors resize-none" />
            </div>
          </div>

          {/* Order Summary */}
          <div className="bg-[#0d0d2b] border border-white/10 rounded-2xl p-6 mb-6">
            <h2 className="text-white font-bold text-lg mb-4">Order Summary</h2>
            <div className="space-y-3 mb-4">
              {cart.map(item => (
                <div key={item.product.id} className="flex items-center gap-3">
                  <img src={item.product.image} alt={item.product.name} className="w-12 h-12 object-cover rounded-xl" />
                  <div className="flex-1">
                    <p className="text-white text-sm font-medium">{item.product.name}</p>
                    <p className="text-gray-500 text-xs">x{item.quantity}</p>
                  </div>
                  <span className="text-white font-bold text-sm">Rs. {(item.product.price * item.quantity).toLocaleString()}</span>
                </div>
              ))}
            </div>
            <div className="border-t border-white/10 pt-4 space-y-2">
              <div className="flex justify-between text-gray-400 text-sm">
                <span>Subtotal</span><span className="text-white">Rs. {cartTotal.toLocaleString()}</span>
              </div>
              <div className="flex justify-between text-gray-400 text-sm">
                <span>Shipping</span><span className={shipping === 0 ? 'text-green-400' : 'text-white'}>{shipping === 0 ? 'FREE' : `Rs. ${shipping}`}</span>
              </div>
              <div className="flex justify-between text-white font-black text-lg pt-2 border-t border-white/10">
                <span>Total</span><span className="text-blue-400">Rs. {totalWithShipping.toLocaleString()}</span>
              </div>
            </div>
          </div>

          <div className="bg-blue-500/10 border border-blue-500/20 rounded-xl p-4 mb-6">
            <p className="text-blue-300 text-sm">💳 <strong>Cash on Delivery</strong> — Pay when your order arrives</p>
          </div>

          <button onClick={handlePlaceOrder}
            className="w-full bg-gradient-to-r from-blue-600 to-cyan-600 hover:from-blue-500 hover:to-cyan-500 text-white font-black text-lg py-4 rounded-2xl transition-all shadow-2xl shadow-blue-500/25">
            Place Order
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="bg-[#070714] min-h-screen py-10 px-4">
      <div className="max-w-6xl mx-auto">
        <h1 className="text-4xl font-black text-white mb-8 flex items-center gap-3">
          <ShoppingCart size={32} /> Shopping Cart
          {cart.length > 0 && <span className="text-lg text-gray-500 font-normal">({cart.length} items)</span>}
        </h1>

        {cart.length === 0 ? (
          <div className="text-center py-24">
            <ShoppingCart size={64} className="text-gray-700 mx-auto mb-6" />
            <h2 className="text-white text-2xl font-bold mb-3">Your cart is empty</h2>
            <p className="text-gray-500 mb-8">Add some products to get started!</p>
            <Link to="/products" className="inline-flex items-center gap-2 bg-blue-600 hover:bg-blue-500 text-white px-8 py-4 rounded-2xl font-bold transition-colors">
              Browse Products <ArrowRight size={18} />
            </Link>
          </div>
        ) : (
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            {/* Items */}
            <div className="lg:col-span-2 space-y-4">
              {cart.map(item => (
                <div key={item.product.id} className="bg-[#0d0d2b] border border-white/8 hover:border-white/15 rounded-2xl p-4 flex gap-4 transition-all">
                  <img src={item.product.image} alt={item.product.name} className="w-24 h-24 object-cover rounded-xl flex-shrink-0" />
                  <div className="flex-1 min-w-0">
                    <div className="flex justify-between items-start mb-1">
                      <h3 className="text-white font-bold text-sm pr-2 line-clamp-2">{item.product.name}</h3>
                      <button onClick={() => removeFromCart(item.product.id)} className="text-gray-600 hover:text-red-400 transition-colors flex-shrink-0">
                        <X size={18} />
                      </button>
                    </div>
                    <p className="text-blue-400 text-xs font-medium mb-3">{item.product.category}</p>
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-2 bg-white/5 border border-white/10 rounded-xl p-1">
                        <button onClick={() => updateCartQuantity(item.product.id, item.quantity - 1)}
                          className="w-7 h-7 flex items-center justify-center text-gray-400 hover:text-white rounded-lg hover:bg-white/10 transition-all">
                          <Minus size={14} />
                        </button>
                        <span className="text-white font-bold text-sm w-6 text-center">{item.quantity}</span>
                        <button onClick={() => updateCartQuantity(item.product.id, item.quantity + 1)}
                          className="w-7 h-7 flex items-center justify-center text-gray-400 hover:text-white rounded-lg hover:bg-white/10 transition-all">
                          <Plus size={14} />
                        </button>
                      </div>
                      <span className="text-white font-black">Rs. {(item.product.price * item.quantity).toLocaleString()}</span>
                    </div>
                  </div>
                </div>
              ))}
            </div>

            {/* Summary */}
            <div>
              <div className="bg-[#0d0d2b] border border-white/10 rounded-2xl p-6 sticky top-24">
                <h2 className="text-white font-bold text-lg mb-5">Order Summary</h2>
                <div className="space-y-3 mb-5">
                  <div className="flex justify-between text-gray-400 text-sm">
                    <span>Subtotal ({cart.reduce((s, i) => s + i.quantity, 0)} items)</span>
                    <span className="text-white">Rs. {cartTotal.toLocaleString()}</span>
                  </div>
                  <div className="flex justify-between text-gray-400 text-sm">
                    <span>Shipping</span>
                    <span className={shipping === 0 ? 'text-green-400 font-semibold' : 'text-white'}>
                      {shipping === 0 ? '🎉 FREE' : `Rs. ${shipping}`}
                    </span>
                  </div>
                  {shipping > 0 && (
                    <p className="text-xs text-gray-600 bg-white/3 rounded-lg p-2">
                      <Tag size={10} className="inline mr-1" />
                      Add Rs. {(5000 - cartTotal).toLocaleString()} more for free shipping
                    </p>
                  )}
                </div>
                <div className="border-t border-white/10 pt-4 mb-6">
                  <div className="flex justify-between text-white font-black text-xl">
                    <span>Total</span>
                    <span className="text-blue-400">Rs. {totalWithShipping.toLocaleString()}</span>
                  </div>
                </div>
                <button onClick={handleCheckout}
                  className="w-full bg-gradient-to-r from-blue-600 to-cyan-600 hover:from-blue-500 hover:to-cyan-500 text-white font-bold py-4 rounded-2xl transition-all flex items-center justify-center gap-2 shadow-2xl shadow-blue-500/20">
                  Proceed to Checkout <ArrowRight size={18} />
                </button>
                <Link to="/products" className="block text-center text-gray-500 hover:text-gray-300 text-sm mt-3 transition-colors">
                  ← Continue Shopping
                </Link>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default CartPage;
