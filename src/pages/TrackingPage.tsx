import React, { useState } from 'react';
import { Search, Package, Truck, CheckCircle, Clock, XCircle, MapPin } from 'lucide-react';
import { useApp } from '../context/AppContext';

const statusSteps = ['Processing', 'Shipped', 'Out for Delivery', 'Delivered'];

const statusConfig = {
  Processing: { icon: Clock, color: 'blue', bg: 'bg-blue-500/10', text: 'text-blue-400', border: 'border-blue-500/30' },
  Shipped: { icon: Package, color: 'purple', bg: 'bg-purple-500/10', text: 'text-purple-400', border: 'border-purple-500/30' },
  'Out for Delivery': { icon: Truck, color: 'orange', bg: 'bg-orange-500/10', text: 'text-orange-400', border: 'border-orange-500/30' },
  Delivered: { icon: CheckCircle, color: 'green', bg: 'bg-green-500/10', text: 'text-green-400', border: 'border-green-500/30' },
  Cancelled: { icon: XCircle, color: 'red', bg: 'bg-red-500/10', text: 'text-red-400', border: 'border-red-500/30' },
};

const TrackingPage: React.FC = () => {
  const { getOrderByTracking, currentUser, orders } = useApp();
  const [trackingNumber, setTrackingNumber] = useState('');
  const [trackedOrder, setTrackedOrder] = useState<ReturnType<typeof getOrderByTracking>>(undefined);
  const [notFound, setNotFound] = useState(false);
  const [searched, setSearched] = useState(false);

  const userOrders = currentUser ? orders.filter(o => o.userId === currentUser.id) : [];

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    if (!trackingNumber.trim()) return;
    const order = getOrderByTracking(trackingNumber.trim());
    setTrackedOrder(order);
    setNotFound(!order);
    setSearched(true);
  };

  const currentStepIndex = (status: string) => statusSteps.indexOf(status as any);

  return (
    <div className="bg-[#070714] min-h-screen py-12 px-4">
      <div className="max-w-3xl mx-auto">
        {/* Header */}
        <div className="text-center mb-12">
          <div className="inline-flex w-16 h-16 bg-blue-500/10 border border-blue-500/20 rounded-2xl items-center justify-center mb-4">
            <Package size={28} className="text-blue-400" />
          </div>
          <h1 className="text-4xl font-black text-white mb-3">Track Your Order</h1>
          <p className="text-gray-500">Enter your tracking number to see the status of your order</p>
        </div>

        {/* Search */}
        <form onSubmit={handleSearch} className="mb-8">
          <div className="flex gap-3">
            <div className="relative flex-1">
              <Search size={18} className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-500" />
              <input
                value={trackingNumber}
                onChange={e => setTrackingNumber(e.target.value.toUpperCase())}
                placeholder="Enter tracking number (e.g. SZ12345678)"
                className="w-full bg-[#0d0d2b] border border-white/10 focus:border-blue-500 rounded-2xl pl-12 pr-4 py-4 text-white placeholder-gray-600 outline-none transition-colors font-mono"
              />
            </div>
            <button type="submit"
              className="bg-gradient-to-r from-blue-600 to-blue-500 hover:from-blue-500 hover:to-cyan-500 text-white font-bold px-8 py-4 rounded-2xl transition-all shadow-lg shadow-blue-500/20">
              Track
            </button>
          </div>
        </form>

        {/* Result */}
        {searched && notFound && (
          <div className="bg-red-500/5 border border-red-500/20 rounded-2xl p-8 text-center mb-8">
            <XCircle size={40} className="text-red-400 mx-auto mb-3" />
            <h3 className="text-white font-bold text-xl mb-1">Order Not Found</h3>
            <p className="text-gray-500 text-sm">Double-check your tracking number and try again</p>
          </div>
        )}

        {trackedOrder && (
          <OrderTracker order={trackedOrder} currentStepIndex={currentStepIndex} />
        )}

        {/* My Orders (logged in) */}
        {currentUser && userOrders.length > 0 && (
          <div className="mt-12">
            <h2 className="text-2xl font-black text-white mb-6">My Orders</h2>
            <div className="space-y-4">
              {userOrders.map(order => {
                const cfg = statusConfig[order.status] || statusConfig.Processing;
                const Icon = cfg.icon;
                return (
                  <div key={order.id}
                    onClick={() => { setTrackingNumber(order.trackingNumber); setTrackedOrder(order); setNotFound(false); setSearched(true); }}
                    className="bg-[#0d0d2b] border border-white/8 hover:border-blue-500/30 rounded-2xl p-5 cursor-pointer transition-all hover:-translate-y-0.5">
                    <div className="flex items-center justify-between mb-3">
                      <div>
                        <p className="text-white font-bold">{order.items.length} item(s)</p>
                        <p className="text-gray-500 text-xs font-mono mt-0.5">{order.trackingNumber}</p>
                      </div>
                      <div className={`flex items-center gap-2 px-3 py-1.5 rounded-full text-xs font-bold ${cfg.bg} ${cfg.text} border ${cfg.border}`}>
                        <Icon size={12} /> {order.status}
                      </div>
                    </div>
                    <div className="flex items-center justify-between text-sm">
                      <span className="text-gray-500">{new Date(order.createdAt).toLocaleDateString()}</span>
                      <span className="text-white font-bold">Rs. {order.total.toLocaleString()}</span>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

const OrderTracker: React.FC<{ order: any; currentStepIndex: (s: string) => number }> = ({ order, currentStepIndex }) => {
  const cfg = statusConfig[order.status as keyof typeof statusConfig] || statusConfig.Processing;
  const Icon = cfg.icon;
  const stepIdx = currentStepIndex(order.status);

  return (
    <div className="bg-[#0d0d2b] border border-white/10 rounded-3xl overflow-hidden">
      {/* Top */}
      <div className={`p-6 ${cfg.bg} border-b border-white/5`}>
        <div className="flex items-center justify-between">
          <div>
            <p className="text-gray-400 text-sm mb-1">Tracking Number</p>
            <p className="text-white font-mono font-black text-xl tracking-widest">{order.trackingNumber}</p>
          </div>
          <div className={`flex items-center gap-2 px-4 py-2 rounded-full font-bold ${cfg.bg} ${cfg.text} border ${cfg.border}`}>
            <Icon size={16} /> {order.status}
          </div>
        </div>
      </div>

      {/* Progress */}
      {order.status !== 'Cancelled' && (
        <div className="px-6 py-6 border-b border-white/5">
          <div className="flex items-center">
            {statusSteps.map((step, idx) => (
              <React.Fragment key={step}>
                <div className="flex flex-col items-center gap-1.5">
                  <div className={`w-10 h-10 rounded-full flex items-center justify-center text-sm font-bold transition-all
                    ${idx <= stepIdx ? 'bg-blue-600 text-white shadow-lg shadow-blue-500/30' : 'bg-white/5 border border-white/10 text-gray-600'}`}>
                    {idx < stepIdx ? '✓' : idx + 1}
                  </div>
                  <span className={`text-xs font-medium text-center hidden md:block max-w-[70px] leading-tight
                    ${idx <= stepIdx ? 'text-blue-400' : 'text-gray-600'}`}>{step}</span>
                </div>
                {idx < statusSteps.length - 1 && (
                  <div className={`flex-1 h-0.5 mx-1 ${idx < stepIdx ? 'bg-blue-600' : 'bg-white/10'}`} />
                )}
              </React.Fragment>
            ))}
          </div>
        </div>
      )}

      {/* Details */}
      <div className="p-6 space-y-4">
        <div className="grid grid-cols-2 gap-4">
          <div>
            <p className="text-gray-500 text-xs mb-1">Order Date</p>
            <p className="text-white font-semibold">{new Date(order.createdAt).toLocaleDateString()}</p>
          </div>
          <div>
            <p className="text-gray-500 text-xs mb-1">Total Amount</p>
            <p className="text-white font-black">Rs. {order.total.toLocaleString()}</p>
          </div>
          <div className="col-span-2">
            <p className="text-gray-500 text-xs mb-1 flex items-center gap-1"><MapPin size={10} /> Shipping To</p>
            <p className="text-white font-medium text-sm">{order.shippingAddress}</p>
          </div>
        </div>

        {/* Items */}
        <div className="border-t border-white/5 pt-4">
          <p className="text-gray-400 text-sm font-bold mb-3">Order Items</p>
          <div className="space-y-3">
            {order.items.map((item: any) => (
              <div key={item.product.id} className="flex items-center gap-3">
                <img src={item.product.image} alt={item.product.name} className="w-12 h-12 object-cover rounded-xl" />
                <div className="flex-1">
                  <p className="text-white text-sm font-medium">{item.product.name}</p>
                  <p className="text-gray-500 text-xs">Qty: {item.quantity}</p>
                </div>
                <p className="text-white font-bold text-sm">Rs. {(item.product.price * item.quantity).toLocaleString()}</p>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};

export default TrackingPage;
