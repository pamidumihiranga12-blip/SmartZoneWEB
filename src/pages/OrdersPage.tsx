import React from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { Package, Clock, Truck, CheckCircle, XCircle } from 'lucide-react';
import { useApp } from '../context/AppContext';

const statusConfig: Record<string, { icon: React.ElementType; bg: string; text: string; border: string }> = {
  Processing: { icon: Clock, bg: 'bg-blue-500/10', text: 'text-blue-400', border: 'border-blue-500/20' },
  Shipped: { icon: Package, bg: 'bg-purple-500/10', text: 'text-purple-400', border: 'border-purple-500/20' },
  'Out for Delivery': { icon: Truck, bg: 'bg-orange-500/10', text: 'text-orange-400', border: 'border-orange-500/20' },
  Delivered: { icon: CheckCircle, bg: 'bg-green-500/10', text: 'text-green-400', border: 'border-green-500/20' },
  Cancelled: { icon: XCircle, bg: 'bg-red-500/10', text: 'text-red-400', border: 'border-red-500/20' },
};

const OrdersPage: React.FC = () => {
  const { currentUser, orders } = useApp();
  const navigate = useNavigate();

  if (!currentUser) {
    return (
      <div className="bg-[#070714] min-h-screen flex items-center justify-center">
        <div className="text-center">
          <Package size={64} className="text-gray-700 mx-auto mb-4" />
          <h2 className="text-white text-2xl font-bold mb-3">Sign In Required</h2>
          <p className="text-gray-500 mb-6">Please sign in to view your orders</p>
          <Link to="/login" className="bg-blue-600 hover:bg-blue-500 text-white px-6 py-3 rounded-xl font-bold transition-colors">Sign In</Link>
        </div>
      </div>
    );
  }

  const userOrders = orders.filter(o => o.userId === currentUser.id).reverse();

  return (
    <div className="bg-[#070714] min-h-screen py-12 px-4">
      <div className="max-w-4xl mx-auto">
        <h1 className="text-4xl font-black text-white mb-8">My Orders</h1>

        {userOrders.length === 0 ? (
          <div className="text-center py-24">
            <Package size={64} className="text-gray-700 mx-auto mb-4" />
            <h2 className="text-white text-2xl font-bold mb-3">No orders yet</h2>
            <p className="text-gray-500 mb-8">Your orders will appear here once you make a purchase</p>
            <Link to="/products" className="bg-blue-600 hover:bg-blue-500 text-white px-8 py-4 rounded-2xl font-bold transition-colors">Start Shopping</Link>
          </div>
        ) : (
          <div className="space-y-5">
            {userOrders.map(order => {
              const cfg = statusConfig[order.status] || statusConfig.Processing;
              const Icon = cfg.icon;
              return (
                <div key={order.id} className="bg-[#0d0d2b] border border-white/8 hover:border-white/15 rounded-2xl p-6 transition-all">
                  {/* Header */}
                  <div className="flex flex-wrap items-center justify-between gap-3 mb-5">
                    <div>
                      <div className="flex items-center gap-3 mb-1">
                        <p className="text-white font-bold">Order #{order.trackingNumber}</p>
                        <div className={`flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-bold ${cfg.bg} ${cfg.text} border ${cfg.border}`}>
                          <Icon size={12} /> {order.status}
                        </div>
                      </div>
                      <p className="text-gray-500 text-sm">{new Date(order.createdAt).toLocaleDateString('en-GB', { year: 'numeric', month: 'long', day: 'numeric' })}</p>
                    </div>
                    <div className="text-right">
                      <p className="text-white font-black text-xl">Rs. {order.total.toLocaleString()}</p>
                      <button onClick={() => navigate(`/tracking?tracking=${order.trackingNumber}`)}
                        className="text-blue-400 hover:text-blue-300 text-sm font-medium transition-colors">
                        Track Order →
                      </button>
                    </div>
                  </div>

                  {/* Items */}
                  <div className="space-y-3 border-t border-white/5 pt-4">
                    {order.items.map((item: any) => (
                      <div key={item.product.id} className="flex items-center gap-4">
                        <img src={item.product.image} alt={item.product.name} className="w-14 h-14 object-cover rounded-xl flex-shrink-0" />
                        <div className="flex-1 min-w-0">
                          <p className="text-white font-semibold text-sm truncate">{item.product.name}</p>
                          <p className="text-gray-500 text-xs">Qty: {item.quantity} × Rs. {item.product.price.toLocaleString()}</p>
                        </div>
                        <p className="text-white font-bold text-sm">Rs. {(item.product.price * item.quantity).toLocaleString()}</p>
                      </div>
                    ))}
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </div>
    </div>
  );
};

export default OrdersPage;
