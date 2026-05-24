import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { ShoppingBag, Package, Users, DollarSign, Clock, TrendingUp, ArrowRight, CheckCircle, Truck } from 'lucide-react';
import { orderService } from '../../services/db';
import { Order } from '../../store/useStore';

interface Stats {
  totalOrders: number;
  pendingOrders: number;
  totalRevenue: number;
  totalProducts: number;
  totalCustomers: number;
  recentOrders: Order[];
}

const statusColors: Record<string, string> = {
  pending: 'text-yellow-700 bg-yellow-100',
  processing: 'text-blue-700 bg-blue-100',
  shipped: 'text-purple-700 bg-purple-100',
  delivered: 'text-green-700 bg-green-100',
  cancelled: 'text-red-700 bg-red-100',
};

export default function DashboardPage() {
  const [stats, setStats] = useState<Stats | null>(null);

  useEffect(() => {
    setStats(orderService.getStats() as Stats);
  }, []);

  if (!stats) return <div className="animate-pulse">Loading...</div>;

  const statCards = [
    {
      label: 'Total Revenue',
      value: `Rs. ${stats.totalRevenue.toLocaleString()}`,
      icon: <DollarSign size={20} />,
      color: 'bg-blue-600',
      lightColor: 'bg-blue-50 text-blue-600',
      change: '+12% this month',
    },
    {
      label: 'Total Orders',
      value: stats.totalOrders,
      icon: <ShoppingBag size={20} />,
      color: 'bg-purple-600',
      lightColor: 'bg-purple-50 text-purple-600',
      change: `${stats.pendingOrders} pending`,
    },
    {
      label: 'Products',
      value: stats.totalProducts,
      icon: <Package size={20} />,
      color: 'bg-green-600',
      lightColor: 'bg-green-50 text-green-600',
      change: 'In stock',
    },
    {
      label: 'Customers',
      value: stats.totalCustomers,
      icon: <Users size={20} />,
      color: 'bg-orange-600',
      lightColor: 'bg-orange-50 text-orange-600',
      change: 'Registered users',
    },
  ];

  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-xl font-black text-gray-900">Dashboard Overview</h2>
        <p className="text-gray-500 text-sm mt-0.5">Welcome back! Here's what's happening at SmartZone.</p>
      </div>

      {/* Stat Cards */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        {statCards.map((card) => (
          <div key={card.label} className="bg-white rounded-2xl p-5 shadow-sm border border-gray-100">
            <div className="flex items-start justify-between mb-3">
              <div className={`w-10 h-10 ${card.lightColor} rounded-xl flex items-center justify-center`}>
                {card.icon}
              </div>
              <TrendingUp size={14} className="text-green-500" />
            </div>
            <p className="text-2xl font-black text-gray-900">{card.value}</p>
            <p className="text-xs font-medium text-gray-500 mt-0.5">{card.label}</p>
            <p className="text-xs text-green-600 mt-1">{card.change}</p>
          </div>
        ))}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Recent Orders */}
        <div className="lg:col-span-2 bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden">
          <div className="flex items-center justify-between p-5 border-b border-gray-100">
            <h3 className="font-bold text-gray-900">Recent Orders</h3>
            <Link to="/admin/orders" className="text-blue-600 text-sm font-medium hover:text-blue-700 flex items-center gap-1">
              View All <ArrowRight size={14} />
            </Link>
          </div>
          <div className="divide-y divide-gray-50">
            {stats.recentOrders.length === 0 ? (
              <div className="p-8 text-center text-gray-400">
                <ShoppingBag size={32} className="mx-auto mb-2 opacity-50" />
                <p className="text-sm">No orders yet</p>
              </div>
            ) : (
              stats.recentOrders.map((order) => (
                <div key={order._id} className="p-4 flex items-center gap-3 hover:bg-gray-50 transition-colors">
                  <div className="w-10 h-10 bg-blue-100 rounded-xl flex items-center justify-center flex-shrink-0">
                    <ShoppingBag size={16} className="text-blue-600" />
                  </div>
                  <div className="flex-1 min-w-0">
                    <p className="font-semibold text-sm text-gray-900">#{order.orderNumber}</p>
                    <p className="text-xs text-gray-500 truncate">{order.shippingAddress?.name}</p>
                  </div>
                  <div className="text-right flex-shrink-0">
                    <p className="font-bold text-sm text-gray-900">Rs. {order.total.toLocaleString()}</p>
                    <span className={`text-xs px-2 py-0.5 rounded-full font-medium ${statusColors[order.status]}`}>
                      {order.status}
                    </span>
                  </div>
                </div>
              ))
            )}
          </div>
        </div>

        {/* Quick Actions */}
        <div className="space-y-4">
          <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-5">
            <h3 className="font-bold text-gray-900 mb-4">Quick Actions</h3>
            <div className="space-y-2">
              {[
                { to: '/admin/products', label: 'Add New Product', icon: '📦', color: 'bg-blue-50 hover:bg-blue-100' },
                { to: '/admin/orders', label: 'Manage Orders', icon: '🛒', color: 'bg-purple-50 hover:bg-purple-100' },
                { to: '/admin/settings', label: 'Edit Site Settings', icon: '⚙️', color: 'bg-green-50 hover:bg-green-100' },
                { to: '/admin/messages', label: 'View Messages', icon: '💬', color: 'bg-orange-50 hover:bg-orange-100' },
              ].map((action) => (
                <Link
                  key={action.to}
                  to={action.to}
                  className={`flex items-center gap-3 p-3 rounded-xl ${action.color} transition-colors group`}
                >
                  <span className="text-xl">{action.icon}</span>
                  <span className="text-sm font-medium text-gray-700 group-hover:text-gray-900">{action.label}</span>
                  <ArrowRight size={14} className="ml-auto text-gray-400 group-hover:text-gray-600" />
                </Link>
              ))}
            </div>
          </div>

          {/* Order Status Summary */}
          <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-5">
            <h3 className="font-bold text-gray-900 mb-4">Order Status</h3>
            <div className="space-y-3">
              {[
                { label: 'Pending', value: stats.pendingOrders, icon: <Clock size={14} />, color: 'text-yellow-600 bg-yellow-100' },
                { label: 'Processing', value: orderService.getAll().filter(o => o.status === 'processing').length, icon: <Package size={14} />, color: 'text-blue-600 bg-blue-100' },
                { label: 'Shipped', value: orderService.getAll().filter(o => o.status === 'shipped').length, icon: <Truck size={14} />, color: 'text-purple-600 bg-purple-100' },
                { label: 'Delivered', value: orderService.getAll().filter(o => o.status === 'delivered').length, icon: <CheckCircle size={14} />, color: 'text-green-600 bg-green-100' },
              ].map((s) => (
                <div key={s.label} className="flex items-center justify-between">
                  <div className={`flex items-center gap-2 text-xs font-medium px-2.5 py-1 rounded-full ${s.color}`}>
                    {s.icon} {s.label}
                  </div>
                  <span className="font-bold text-gray-900">{s.value}</span>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
