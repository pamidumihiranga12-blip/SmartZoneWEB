import { useState, useEffect } from 'react';
import { useSearchParams } from 'react-router-dom';
import { Package, Truck, CheckCircle, Clock, Search, MapPin, XCircle, RefreshCw } from 'lucide-react';
import { orderService } from '../services/db';
import { Order } from '../store/useStore';

const steps = [
  { key: 'pending', label: 'Order Placed', icon: Package, desc: 'Your order has been received' },
  { key: 'processing', label: 'Processing', icon: RefreshCw, desc: 'We are preparing your order' },
  { key: 'shipped', label: 'Shipped', icon: Truck, desc: 'Your order is on the way' },
  { key: 'delivered', label: 'Delivered', icon: CheckCircle, desc: 'Order successfully delivered' },
];

const statusOrder: Record<string, number> = {
  pending: 0,
  processing: 1,
  shipped: 2,
  delivered: 3,
  cancelled: -1,
};

export default function TrackingPage() {
  const [searchParams] = useSearchParams();
  const [query, setQuery] = useState(searchParams.get('order') || '');
  const [order, setOrder] = useState<Order | null>(null);
  const [searched, setSearched] = useState(false);
  const [notFound, setNotFound] = useState(false);

  useEffect(() => {
    const orderNum = searchParams.get('order');
    if (orderNum) {
      setQuery(orderNum);
      doSearch(orderNum);
    }
  }, []);

  const doSearch = (q?: string) => {
    const searchTerm = (q || query).trim().toUpperCase();
    if (!searchTerm) return;
    setSearched(true);
    const result = orderService.getByOrderNumber(searchTerm);
    if (result) {
      setOrder(result);
      setNotFound(false);
    } else {
      setOrder(null);
      setNotFound(true);
    }
  };

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    doSearch();
  };

  const currentStep = order ? statusOrder[order.status] : -1;

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <div className="bg-gradient-to-r from-blue-700 to-blue-900 text-white">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-14 text-center">
          <div className="w-14 h-14 bg-white/20 rounded-2xl flex items-center justify-center mx-auto mb-4">
            <Truck size={28} />
          </div>
          <h1 className="text-3xl sm:text-4xl font-black mb-3">Track Your Order</h1>
          <p className="text-blue-200 text-lg mb-8">Enter your order number to see real-time status</p>

          <form onSubmit={handleSearch} className="flex gap-2 max-w-lg mx-auto">
            <div className="relative flex-1">
              <Search size={18} className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400" />
              <input
                type="text"
                value={query}
                onChange={(e) => setQuery(e.target.value.toUpperCase())}
                placeholder="Enter order number (e.g. SZ12345678)"
                className="w-full pl-12 pr-4 py-3.5 rounded-xl text-gray-900 text-sm focus:outline-none focus:ring-2 focus:ring-blue-300"
              />
            </div>
            <button
              type="submit"
              className="bg-yellow-400 hover:bg-yellow-500 text-yellow-900 font-bold px-6 py-3.5 rounded-xl transition-colors shadow-lg"
            >
              Track
            </button>
          </form>
        </div>
      </div>

      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-10">
        {!searched && (
          <div className="text-center py-12">
            <Package size={56} className="text-gray-300 mx-auto mb-4" />
            <p className="text-gray-500">Enter your order number above to track your order</p>
            <p className="text-xs text-gray-400 mt-2">Order numbers start with "SZ" followed by 8 digits</p>
          </div>
        )}

        {notFound && (
          <div className="text-center py-12">
            <XCircle size={56} className="text-red-300 mx-auto mb-4" />
            <h3 className="text-lg font-semibold text-gray-900 mb-2">Order Not Found</h3>
            <p className="text-gray-500">No order found with number "{query}"</p>
            <p className="text-sm text-gray-400 mt-2">Please check your order number and try again</p>
          </div>
        )}

        {order && (
          <div className="space-y-6">
            {/* Order Info */}
            <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-5 sm:p-6">
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 mb-4">
                <div>
                  <h2 className="text-xl font-black text-gray-900">Order #{order.orderNumber}</h2>
                  <p className="text-sm text-gray-500 mt-0.5">
                    Placed on {new Date(order.createdAt).toLocaleDateString('en-US', {
                      weekday: 'long', year: 'numeric', month: 'long', day: 'numeric'
                    })}
                  </p>
                </div>
                <div className={`inline-flex items-center gap-1.5 px-4 py-2 rounded-full font-semibold text-sm ${
                  order.status === 'delivered' ? 'bg-green-100 text-green-700' :
                  order.status === 'cancelled' ? 'bg-red-100 text-red-700' :
                  order.status === 'shipped' ? 'bg-purple-100 text-purple-700' :
                  order.status === 'processing' ? 'bg-blue-100 text-blue-700' :
                  'bg-yellow-100 text-yellow-700'
                }`}>
                  {order.status === 'delivered' ? <CheckCircle size={14} /> :
                   order.status === 'cancelled' ? <XCircle size={14} /> :
                   order.status === 'shipped' ? <Truck size={14} /> :
                   <Clock size={14} />}
                  {order.status.charAt(0).toUpperCase() + order.status.slice(1)}
                </div>
              </div>

              {order.trackingNumber && (
                <div className="bg-blue-50 border border-blue-200 rounded-xl p-3 mb-4">
                  <p className="text-sm text-blue-700 font-medium">
                    🚚 Tracking Number: <span className="font-black">{order.trackingNumber}</span>
                  </p>
                </div>
              )}

              {/* Progress Steps */}
              {order.status !== 'cancelled' && (
                <div className="mt-6">
                  <div className="flex items-center justify-between relative">
                    {/* Progress Line */}
                    <div className="absolute left-0 right-0 top-5 h-1 bg-gray-200 z-0">
                      <div
                        className="h-full bg-blue-600 transition-all duration-700"
                        style={{ width: `${(currentStep / 3) * 100}%` }}
                      />
                    </div>

                    {steps.map((step, i) => {
                      const isCompleted = i <= currentStep;
                      const isCurrent = i === currentStep;
                      const Icon = step.icon;
                      return (
                        <div key={step.key} className="flex flex-col items-center z-10 flex-1">
                          <div className={`w-10 h-10 rounded-full flex items-center justify-center border-2 transition-all mb-2 ${
                            isCompleted ? 'bg-blue-600 border-blue-600 text-white' :
                            'bg-white border-gray-300 text-gray-400'
                          } ${isCurrent ? 'ring-4 ring-blue-200 scale-110' : ''}`}>
                            <Icon size={16} />
                          </div>
                          <p className={`text-xs font-semibold text-center hidden sm:block ${isCompleted ? 'text-blue-600' : 'text-gray-400'}`}>
                            {step.label}
                          </p>
                        </div>
                      );
                    })}
                  </div>

                  {/* Current step description */}
                  <div className="text-center mt-6 bg-blue-50 rounded-xl p-4">
                    <p className="font-semibold text-blue-900">{steps[currentStep]?.label}</p>
                    <p className="text-sm text-blue-700 mt-0.5">{steps[currentStep]?.desc}</p>
                  </div>
                </div>
              )}

              {order.status === 'cancelled' && (
                <div className="bg-red-50 border border-red-200 rounded-xl p-4 text-center">
                  <XCircle size={24} className="text-red-500 mx-auto mb-2" />
                  <p className="font-semibold text-red-700">This order has been cancelled</p>
                  <p className="text-sm text-red-600 mt-0.5">Please contact us for more information</p>
                </div>
              )}
            </div>

            {/* Delivery Info */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-5">
                <h3 className="font-bold text-gray-900 mb-3 flex items-center gap-2">
                  <MapPin size={16} className="text-blue-600" /> Delivery Address
                </h3>
                <p className="font-medium text-gray-900">{order.shippingAddress.name}</p>
                <p className="text-gray-600 text-sm">{order.shippingAddress.phone}</p>
                <p className="text-gray-600 text-sm">{order.shippingAddress.address}</p>
                <p className="text-gray-600 text-sm">{order.shippingAddress.city}</p>
              </div>

              <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-5">
                <h3 className="font-bold text-gray-900 mb-3 flex items-center gap-2">
                  <Package size={16} className="text-blue-600" /> Order Summary
                </h3>
                <div className="space-y-1.5">
                  {order.items.map((item, i) => (
                    <div key={i} className="flex justify-between text-sm">
                      <span className="text-gray-600 truncate mr-2">{item.product.name} × {item.quantity}</span>
                      <span className="text-gray-900 font-medium flex-shrink-0">Rs. {(item.price * item.quantity).toLocaleString()}</span>
                    </div>
                  ))}
                  <div className="border-t border-gray-100 pt-2 flex justify-between font-bold text-sm">
                    <span>Total</span>
                    <span>Rs. {order.total.toLocaleString()}</span>
                  </div>
                </div>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
