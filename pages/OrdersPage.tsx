import { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { Package, ChevronRight, Clock, Truck, CheckCircle, XCircle, RefreshCw } from 'lucide-react';
import { db } from '../services/db'; // Firebase සම්බන්ධතාවය
import { collection, query, where, getDocs, orderBy } from 'firebase/firestore'; 
import { Order, useStore } from '../store/useStore';

const statusConfig = {
  pending: { label: 'Pending', color: 'text-yellow-700 bg-yellow-100', icon: <Clock size={14} /> },
  processing: { label: 'Processing', color: 'text-blue-700 bg-blue-100', icon: <RefreshCw size={14} /> },
  shipped: { label: 'Shipped', color: 'text-purple-700 bg-purple-100', icon: <Truck size={14} /> },
  delivered: { label: 'Delivered', color: 'text-green-700 bg-green-100', icon: <CheckCircle size={14} /> },
  cancelled: { label: 'Cancelled', color: 'text-red-700 bg-red-100', icon: <XCircle size={14} /> },
};

export default function OrdersPage() {
  const { user } = useStore();
  const navigate = useNavigate();
  const [orders, setOrders] = useState<any[]>([]); // Firestore දත්ත සඳහා
  const [selectedOrder, setSelectedOrder] = useState<any | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!user) {
      navigate('/login');
      return;
    }

    // Firestore එකෙන් අදාළ පාරිභෝගිකයාගේ ඇණවුම් ලබා ගැනීම
    const fetchOrders = async () => {
      try {
        setLoading(true);
        const q = query(
          collection(db, "orders"),
          where("customerEmail", "==", user.email), // Email එක අනුව Filter කිරීම
          orderBy("createdAt", "desc") // අලුත්ම ඒවා උඩට ගැනීම
        );

        const querySnapshot = await getDocs(q);
        const ordersList = querySnapshot.docs.map(doc => ({
          id: doc.id,
          ...doc.data()
        }));

        setOrders(ordersList);
      } catch (error) {
        console.error("Orders fetching error: ", error);
      } finally {
        setLoading(false);
      }
    };

    fetchOrders();
  }, [user, navigate]);

  if (!user) return null;

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <h1 className="text-2xl font-black text-gray-900 mb-6 flex items-center gap-2">
          <Package size={24} className="text-blue-600" />
          My Orders
        </h1>

        {loading ? (
          <div className="text-center py-16">
             <div className="animate-spin w-8 h-8 border-4 border-blue-600 border-t-transparent rounded-full mx-auto mb-4"></div>
             <p className="text-gray-500">Loading your orders...</p>
          </div>
        ) : orders.length === 0 ? (
          <div className="text-center py-16 bg-white rounded-2xl shadow-sm border border-gray-100">
            <Package size={56} className="text-gray-300 mx-auto mb-4" />
            <h3 className="text-lg font-semibold text-gray-900 mb-2">No orders yet</h3>
            <p className="text-gray-500 mb-6">Start shopping to see your orders here</p>
            <Link
              to="/products"
              className="inline-flex items-center gap-2 bg-blue-600 text-white px-6 py-2.5 rounded-xl font-medium hover:bg-blue-700 transition-colors"
            >
              Shop Now
            </Link>
          </div>
        ) : (
          <div className="space-y-4">
            {orders.map((order) => {
              // Status එකක් නොමැති නම් default ලෙස 'pending' ගනු ලැබේ
              const statusKey = (order.status || 'pending') as keyof typeof statusConfig;
              const status = statusConfig[statusKey];
              
              return (
                <div
                  key={order.id}
                  className="bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden"
                >
                  <div className="p-4 sm:p-5 flex flex-col sm:flex-row sm:items-center justify-between gap-3">
                    <div>
                      <div className="flex items-center gap-2 mb-1">
                        <span className="font-bold text-gray-900">#{order.orderNumber || order.id.slice(0, 8)}</span>
                        <span className={`inline-flex items-center gap-1 text-xs font-medium px-2.5 py-1 rounded-full ${status.color}`}>
                          {status.icon} {status.label}
                        </span>
                      </div>
                      <p className="text-xs text-gray-500">
                        Placed on {order.createdAt?.seconds 
                          ? new Date(order.createdAt.seconds * 1000).toLocaleDateString()
                          : new Date(order.createdAt).toLocaleDateString()}
                      </p>
                    </div>
                    <div className="text-right">
                      <p className="font-bold text-lg text-gray-900">Rs. {order.totalAmount?.toLocaleString() || order.total?.toLocaleString()}</p>
                      <p className="text-xs text-gray-500">{order.items?.length || 0} item(s)</p>
                    </div>
                  </div>

                  <div className="px-4 sm:px-5 pb-4">
                    <div className="flex items-center justify-between mt-3">
                      <div className="text-xs text-gray-500">
                        Ship to: {order.shippingAddress?.name || user.name}
                      </div>
                      <button
                        onClick={() => setSelectedOrder(selectedOrder?.id === order.id ? null : order)}
                        className="text-xs text-blue-600 font-medium hover:text-blue-700 flex items-center gap-1"
                      >
                        {selectedOrder?.id === order.id ? 'Hide Details' : 'View Details'} <ChevronRight size={12} />
                      </button>
                    </div>
                  </div>

                  {selectedOrder?.id === order.id && (
                    <div className="border-t border-gray-100 p-4 sm:p-5 bg-gray-50">
                      <h4 className="font-semibold text-sm text-gray-900 mb-3">Order Summary</h4>
                      <div className="text-sm space-y-1">
                         <p><span className="text-gray-500">Contact:</span> {order.phone}</p>
                         <p><span className="text-gray-500">Address:</span> {order.address || order.shippingAddress?.address}</p>
                         <p><span className="text-gray-500">Payment Method:</span> {order.paymentMethod}</p>
                      </div>
                    </div>
                  )}
                </div>
              );
            })}
          </div>
        )}
      </div>
    </div>
  );
}