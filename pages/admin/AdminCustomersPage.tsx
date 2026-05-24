import { useState, useEffect } from 'react';
import { Search, Users, Trash2, Mail, Phone } from 'lucide-react';
import { userService } from '../../services/db';
import toast from 'react-hot-toast';

export default function AdminCustomersPage() {
  const [customers, setCustomers] = useState<any[]>([]);
  const [search, setSearch] = useState('');
  const [deleteConfirm, setDeleteConfirm] = useState<string | null>(null);

  const load = () => {
    let all = userService.getAll().filter((u) => u.role === 'customer');
    if (search) {
      const q = search.toLowerCase();
      all = all.filter(
        (u) => u.name.toLowerCase().includes(q) || u.email.toLowerCase().includes(q) || u.phone?.includes(q)
      );
    }
    setCustomers(all);
  };

  useEffect(load, [search]);

  const handleDelete = (id: string) => {
    userService.delete(id);
    load();
    setDeleteConfirm(null);
    toast.success('Customer removed');
  };

  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-xl font-black text-gray-900">Customers</h2>
        <p className="text-gray-500 text-sm">{customers.length} registered customers</p>
      </div>

      {/* Search */}
      <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-4">
        <div className="relative">
          <Search size={16} className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
          <input
            type="text"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder="Search customers..."
            className="w-full pl-9 pr-4 py-2 border border-gray-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
          />
        </div>
      </div>

      {/* Customers */}
      <div className="bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden">
        {customers.length === 0 ? (
          <div className="py-12 text-center text-gray-400">
            <Users size={32} className="mx-auto mb-2 opacity-50" />
            <p className="text-sm">No customers found</p>
          </div>
        ) : (
          <div className="divide-y divide-gray-50">
            {customers.map((customer) => (
              <div key={customer._id} className="flex items-center gap-4 p-4 hover:bg-gray-50 transition-colors">
                <div className="w-10 h-10 bg-blue-600 rounded-full flex items-center justify-center text-white font-bold text-sm flex-shrink-0">
                  {customer.name.charAt(0).toUpperCase()}
                </div>
                <div className="flex-1 min-w-0">
                  <p className="font-semibold text-gray-900 text-sm">{customer.name}</p>
                  <div className="flex flex-wrap gap-3 mt-0.5">
                    <a href={`mailto:${customer.email}`} className="flex items-center gap-1 text-xs text-gray-500 hover:text-blue-600">
                      <Mail size={11} /> {customer.email}
                    </a>
                    {customer.phone && (
                      <a href={`tel:${customer.phone}`} className="flex items-center gap-1 text-xs text-gray-500 hover:text-blue-600">
                        <Phone size={11} /> {customer.phone}
                      </a>
                    )}
                  </div>
                  {customer.address && (
                    <p className="text-xs text-gray-400 mt-0.5 truncate">📍 {customer.address}</p>
                  )}
                </div>
                <div className="flex-shrink-0 text-right">
                  <p className="text-xs text-gray-400">
                    Joined {new Date(customer.createdAt || Date.now()).toLocaleDateString()}
                  </p>
                  <button
                    onClick={() => setDeleteConfirm(customer._id)}
                    className="mt-1 p-1.5 text-red-400 hover:bg-red-50 hover:text-red-600 rounded-lg transition-colors"
                  >
                    <Trash2 size={13} />
                  </button>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>

      {/* Delete Confirm */}
      {deleteConfirm && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50">
          <div className="bg-white rounded-2xl p-6 max-w-sm w-full shadow-2xl">
            <h3 className="font-bold text-gray-900 mb-2">Remove Customer?</h3>
            <p className="text-gray-500 text-sm mb-5">This will permanently delete this customer account.</p>
            <div className="flex gap-3">
              <button
                onClick={() => setDeleteConfirm(null)}
                className="flex-1 py-2.5 border border-gray-200 rounded-xl text-sm font-medium text-gray-700 hover:bg-gray-50"
              >
                Cancel
              </button>
              <button
                onClick={() => handleDelete(deleteConfirm)}
                className="flex-1 py-2.5 bg-red-600 text-white rounded-xl text-sm font-medium hover:bg-red-700"
              >
                Remove
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
