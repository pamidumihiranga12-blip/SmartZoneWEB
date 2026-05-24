import { useState, useEffect } from 'react';
import { Search, ChevronDown, Package, Eye, X, Truck } from 'lucide-react';
import { orderService } from '../../services/db';
import { Order } from '../../store/useStore';
import toast from 'react-hot-toast';

const statusColors: Record<string, string> = {
  pending: 'text-yellow-700 bg-yellow-100 border-yellow-200',
  processing: 'text-blue-700 bg-blue-100 border-blue-200',
  shipped: 'text-purple-700 bg-purple-100 border-purple-200',
  delivered: 'text-green-700 bg-green-100 border-green-200',
  cancelled: 'text-red-700 bg-red-100 border-red-200',
};

export default function AdminOrdersPage() {
  const [orders, setOrders] = useState<Order[]>([]);
  const [search, setSearch] = useState('');
  const [statusFilter, setStatusFilter] = useState('');
  const [selectedOrder, setSelectedOrder] = useState<Order | null>(null);
  const [trackingNumber, setTrackingNumber] = useState('');

  const load = () => {
    let all = orderService.getAll();
    if (statusFilter) all = all.filter((o) => o.status === statusFilter);
    if (search) {
      const q = search.toLowerCase();
      all = all.filter(
        (o) =>
          o.orderNumber.toLowerCase().includes(q) ||
          o.shippingAddress?.name?.toLowerCase().includes(q) ||
          o.shippingAddress?.phone?.includes(q)
      );
    }
    setOrders(all);
  };

  useEffect(load, [search, statusFilter]);

  const handleStatusChange = (orderId: string, status: Order['status'], tracking?: string) => {
    orderService.updateStatus(orderId, status, tracking);
    load();
    if (selectedOrder?._id === orderId) {
      setSelectedOrder(orderService.getAll().find((o) => o._id === orderId) || null);
    }
    toast.success(`Order status updated to ${status}`);
  };

  const openDetail = (order: Order) => {
    setSelectedOrder(order);
    setTrackingNumber(order.trackingNumber || '');
  };

  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-xl font-black text-gray-900">Orders</h2>
        <p className="text-gray-500 text-sm">{orders.length} orders found</p>
      </div>

      {/* Filters */}
      <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-4 flex flex-col sm:flex-row gap-3">
        <div className="relative flex-1">
          <Search size={16} className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
          <input
            type="text"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder="Search by order # or customer name..."
            className="w-full pl-9 pr-4 py-2 border border-gray-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
          />
        </div>
        <div className="relative">
          <select
            value={statusFilter}
            onChange={(e) => setStatusFilter(e.target.value)}
            className="appearance-none border border-gray-200 rounded-xl px-4 py-2 pr-8 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
          >
            <option value="">All Status</option>
            <option value="pending">Pending</option>
            <option value="processing">Processing</option>
            <option value="shipped">Shipped</option>
            <option value="delivered">Delivered</option>
            <option value="cancelled">Cancelled</option>
          </select>
          <ChevronDown size={14} className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 pointer-events-none" />
        </div>
      </div>

      {/* Orders Table */}
      <div className="bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead>
              <tr className="bg-gray-50 border-b border-gray-100">
                <th className="text-left px-5 py-3 text-xs font-semibold text-gray-500 uppercase tracking-wide">Order</th>
                <th className="text-left px-4 py-3 text-xs font-semibold text-gray-500 uppercase tracking-wide hidden sm:table-cell">Customer</th>
                <th className="text-left px-4 py-3 text-xs font-semibold text-gray-500 uppercase tracking-wide">Total</th>
                <th className="text-left px-4 py-3 text-xs font-semibold text-gray-500 uppercase tracking-wide">Status</th>
                <th className="text-left px-4 py-3 text-xs font-semibold text-gray-500 uppercase tracking-wide hidden md:table-cell">Date</th>
                <th className="text-right px-5 py-3 text-xs font-semibold text-gray-500 uppercase tracking-wide">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-50">
              {orders.length === 0 ? (
                <tr>
                  <td colSpan={6} className="text-center py-12 text-gray-400">
                    <Package size={32} className="mx-auto mb-2 opacity-50" />
                    <p className="text-sm">No orders found</p>
                  </td>
                </tr>
              ) : (
                orders.map((order) => (
                  <tr key={order._id} className="hover:bg-gray-50 transition-colors">
                    <td className="px-5 py-3">
                      <p className="font-bold text-sm text-gray-900">#{order.orderNumber}</p>
                      <p className="text-xs text-gray-400">{order.items.length} items</p>
                    </td>
                    <td className="px-4 py-3 hidden sm:table-cell">
                      <p className="text-sm font-medium text-gray-900">{order.shippingAddress?.name}</p>
                      <p className="text-xs text-gray-500">{order.shippingAddress?.phone}</p>
                    </td>
                    <td className="px-4 py-3">
                      <p className="font-bold text-sm text-gray-900">Rs. {order.total.toLocaleString()}</p>
                      <p className="text-xs text-gray-400">{order.paymentMethod}</p>
                    </td>
                    <td className="px-4 py-3">
                      <span className={`inline-flex text-xs font-semibold px-2.5 py-1 rounded-full border ${statusColors[order.status]}`}>
                        {order.status}
                      </span>
                    </td>
                    <td className="px-4 py-3 hidden md:table-cell">
                      <p className="text-xs text-gray-500">
                        {new Date(order.createdAt).toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' })}
                      </p>
                    </td>
                    <td className="px-5 py-3 text-right">
                      <button
                        onClick={() => openDetail(order)}
                        className="inline-flex items-center gap-1.5 text-xs font-medium text-blue-600 hover:text-blue-700 bg-blue-50 hover:bg-blue-100 px-3 py-1.5 rounded-lg transition-colors"
                      >
                        <Eye size={13} /> View
                      </button>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>

      {/* Order Detail Modal */}
      {selectedOrder && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50 backdrop-blur-sm">
          <div className="bg-white rounded-2xl w-full max-w-lg shadow-2xl max-h-[90vh] overflow-y-auto">
            <div className="sticky top-0 bg-white px-6 py-4 border-b border-gray-100 flex items-center justify-between">
              <div>
                <h2 className="font-black text-gray-900">Order #{selectedOrder.orderNumber}</h2>
                <p className="text-xs text-gray-500">{new Date(selectedOrder.createdAt).toLocaleString()}</p>
              </div>
              <button onClick={() => setSelectedOrder(null)} className="text-gray-400 hover:text-gray-600">
                <X size={20} />
              </button>
            </div>

            <div className="p-6 space-y-5">
              {/* Customer Info */}
              <div>
                <h3 className="font-semibold text-sm text-gray-700 mb-2">Customer Details</h3>
                <div className="bg-gray-50 rounded-xl p-3 text-sm space-y-1">
                  <p><span className="text-gray-500">Name:</span> <span className="font-medium">{selectedOrder.shippingAddress?.name}</span></p>
                  <p><span className="text-gray-500">Phone:</span> <span className="font-medium">{selectedOrder.shippingAddress?.phone}</span></p>
                  <p><span className="text-gray-500">Address:</span> <span className="font-medium">{selectedOrder.shippingAddress?.address}, {selectedOrder.shippingAddress?.city}</span></p>
                  <p><span className="text-gray-500">Payment:</span> <span className="font-medium">{selectedOrder.paymentMethod}</span></p>
                  {selectedOrder.notes && <p><span className="text-gray-500">Notes:</span> <span className="font-medium">{selectedOrder.notes}</span></p>}
                </div>
              </div>

              {/* Order Items */}
              <div>
                <h3 className="font-semibold text-sm text-gray-700 mb-2">Order Items</h3>
                <div className="space-y-2">
                  {selectedOrder.items.map((item, i) => (
                    <div key={i} className="flex items-center gap-3 bg-gray-50 rounded-xl p-3">
                      <img src={item.product.images?.[0]} alt="" className="w-10 h-10 rounded-lg object-cover bg-gray-200" />
                      <div className="flex-1 min-w-0">
                        <p className="text-sm font-medium text-gray-900 truncate">{item.product.name}</p>
                        <p className="text-xs text-gray-500">Qty: {item.quantity} × Rs. {item.price.toLocaleString()}</p>
                      </div>
                      <p className="font-bold text-sm text-gray-900 flex-shrink-0">Rs. {(item.price * item.quantity).toLocaleString()}</p>
                    </div>
                  ))}
                </div>
                <div className="mt-2 flex justify-between font-bold text-sm bg-gray-50 rounded-xl p-3">
                  <span>Total</span>
                  <span>Rs. {selectedOrder.total.toLocaleString()}</span>
                </div>
              </div>

              {/* Update Status */}
              <div>
                <h3 className="font-semibold text-sm text-gray-700 mb-2">Update Order Status</h3>
                <div className="grid grid-cols-2 sm:grid-cols-3 gap-2">
                  {(['pending', 'processing', 'shipped', 'delivered', 'cancelled'] as Order['status'][]).map((s) => (
                    <button
                      key={s}
                      onClick={() => handleStatusChange(selectedOrder._id, s)}
                      className={`py-2 px-3 rounded-xl text-xs font-semibold border transition-all ${
                        selectedOrder.status === s
                          ? statusColors[s]
                          : 'border-gray-200 text-gray-600 hover:border-blue-300 hover:text-blue-600'
                      }`}
                    >
                      {selectedOrder.status === s ? '✓ ' : ''}{s.charAt(0).toUpperCase() + s.slice(1)}
                    </button>
                  ))}
                </div>
              </div>

              {/* Tracking Number */}
              <div>
                <h3 className="font-semibold text-sm text-gray-700 mb-2 flex items-center gap-1">
                  <Truck size={14} /> Tracking Number
                </h3>
                <div className="flex gap-2">
                  <input
                    type="text"
                    value={trackingNumber}
                    onChange={(e) => setTrackingNumber(e.target.value)}
                    placeholder="Enter tracking number"
                    className="flex-1 border border-gray-200 rounded-xl px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
                  />
                  <button
                    onClick={() => {
                      handleStatusChange(selectedOrder._id, selectedOrder.status, trackingNumber);
                      toast.success('Tracking number saved!');
                    }}
                    className="px-4 py-2 bg-blue-600 text-white rounded-xl text-sm font-medium hover:bg-blue-700"
                  >
                    Save
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
