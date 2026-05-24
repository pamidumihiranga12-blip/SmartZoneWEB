import { useState, useEffect } from 'react';
import { MessageSquare, Mail, Phone, Trash2, Eye, X } from 'lucide-react';
import { messageService, ContactMessage } from '../../services/db';
import toast from 'react-hot-toast';

export default function AdminMessagesPage() {
  const [messages, setMessages] = useState<ContactMessage[]>([]);
  const [selected, setSelected] = useState<ContactMessage | null>(null);
  const [deleteConfirm, setDeleteConfirm] = useState<string | null>(null);

  const load = () => setMessages(messageService.getAll());

  useEffect(load, []);

  const openMessage = (msg: ContactMessage) => {
    if (!msg.read) {
      messageService.markRead(msg._id);
      load();
    }
    setSelected(msg);
  };

  const handleDelete = (id: string) => {
    messageService.delete(id);
    load();
    if (selected?._id === id) setSelected(null);
    setDeleteConfirm(null);
    toast.success('Message deleted');
  };

  const unread = messages.filter((m) => !m.read).length;

  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-xl font-black text-gray-900">Messages</h2>
        <p className="text-gray-500 text-sm">
          {messages.length} messages {unread > 0 && <span className="text-blue-600 font-medium">({unread} unread)</span>}
        </p>
      </div>

      {messages.length === 0 ? (
        <div className="bg-white rounded-2xl shadow-sm border border-gray-100 py-16 text-center text-gray-400">
          <MessageSquare size={40} className="mx-auto mb-3 opacity-50" />
          <p className="text-sm">No messages yet</p>
        </div>
      ) : (
        <div className="space-y-2">
          {messages.map((msg) => (
            <div
              key={msg._id}
              className={`bg-white rounded-2xl shadow-sm border p-4 flex items-start gap-4 cursor-pointer hover:shadow-md transition-all ${
                !msg.read ? 'border-blue-200 bg-blue-50/30' : 'border-gray-100'
              }`}
              onClick={() => openMessage(msg)}
            >
              <div className={`w-10 h-10 rounded-full flex items-center justify-center text-white font-bold text-sm flex-shrink-0 ${!msg.read ? 'bg-blue-600' : 'bg-gray-400'}`}>
                {msg.name.charAt(0).toUpperCase()}
              </div>
              <div className="flex-1 min-w-0">
                <div className="flex items-center justify-between gap-2">
                  <div className="flex items-center gap-2">
                    <p className={`text-sm font-semibold ${!msg.read ? 'text-blue-900' : 'text-gray-900'}`}>{msg.name}</p>
                    {!msg.read && <span className="w-2 h-2 bg-blue-600 rounded-full flex-shrink-0" />}
                  </div>
                  <p className="text-xs text-gray-400 flex-shrink-0">
                    {new Date(msg.createdAt).toLocaleDateString('en-US', { month: 'short', day: 'numeric' })}
                  </p>
                </div>
                <p className="text-xs text-gray-500 mt-0.5">{msg.subject}</p>
                <p className="text-xs text-gray-400 mt-1 truncate">{msg.message}</p>
              </div>
              <div className="flex items-center gap-1 flex-shrink-0">
                <button
                  onClick={(e) => { e.stopPropagation(); openMessage(msg); }}
                  className="p-1.5 text-blue-500 hover:bg-blue-100 rounded-lg"
                >
                  <Eye size={13} />
                </button>
                <button
                  onClick={(e) => { e.stopPropagation(); setDeleteConfirm(msg._id); }}
                  className="p-1.5 text-red-400 hover:bg-red-50 rounded-lg"
                >
                  <Trash2 size={13} />
                </button>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Delete Confirm */}
      {deleteConfirm && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50">
          <div className="bg-white rounded-2xl p-6 max-w-sm w-full shadow-2xl">
            <h3 className="font-bold text-gray-900 mb-2">Delete Message?</h3>
            <div className="flex gap-3 mt-5">
              <button onClick={() => setDeleteConfirm(null)} className="flex-1 py-2.5 border border-gray-200 rounded-xl text-sm font-medium">Cancel</button>
              <button onClick={() => handleDelete(deleteConfirm)} className="flex-1 py-2.5 bg-red-600 text-white rounded-xl text-sm font-medium">Delete</button>
            </div>
          </div>
        </div>
      )}

      {/* Message Detail Modal */}
      {selected && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50 backdrop-blur-sm">
          <div className="bg-white rounded-2xl w-full max-w-lg shadow-2xl">
            <div className="flex items-center justify-between px-6 py-4 border-b border-gray-100">
              <h2 className="font-black text-gray-900">{selected.subject}</h2>
              <button onClick={() => setSelected(null)} className="text-gray-400 hover:text-gray-600">
                <X size={20} />
              </button>
            </div>
            <div className="p-6 space-y-4">
              <div className="flex items-start gap-3">
                <div className="w-10 h-10 bg-blue-600 rounded-full flex items-center justify-center text-white font-bold">
                  {selected.name.charAt(0)}
                </div>
                <div>
                  <p className="font-semibold text-gray-900">{selected.name}</p>
                  <div className="flex flex-wrap gap-3 mt-0.5">
                    <a href={`mailto:${selected.email}`} className="flex items-center gap-1 text-xs text-blue-600 hover:underline">
                      <Mail size={11} /> {selected.email}
                    </a>
                    {selected.phone && (
                      <a href={`tel:${selected.phone}`} className="flex items-center gap-1 text-xs text-blue-600 hover:underline">
                        <Phone size={11} /> {selected.phone}
                      </a>
                    )}
                  </div>
                </div>
                <p className="ml-auto text-xs text-gray-400 flex-shrink-0">
                  {new Date(selected.createdAt).toLocaleString()}
                </p>
              </div>

              <div className="bg-gray-50 rounded-xl p-4">
                <p className="text-sm text-gray-800 leading-relaxed whitespace-pre-wrap">{selected.message}</p>
              </div>

              <div className="flex gap-3">
                <a
                  href={`mailto:${selected.email}?subject=Re: ${selected.subject}`}
                  className="flex-1 text-center py-2.5 bg-blue-600 text-white rounded-xl text-sm font-medium hover:bg-blue-700 transition-colors"
                >
                  Reply via Email
                </a>
                {selected.phone && (
                  <a
                    href={`https://wa.me/94${selected.phone.replace(/^0/, '')}?text=Hi ${selected.name}! Regarding your message: "${selected.subject}"`}
                    target="_blank"
                    rel="noreferrer"
                    className="flex-1 text-center py-2.5 bg-green-600 text-white rounded-xl text-sm font-medium hover:bg-green-700 transition-colors"
                  >
                    WhatsApp
                  </a>
                )}
                <button
                  onClick={() => setDeleteConfirm(selected._id)}
                  className="px-4 py-2.5 text-red-600 border border-red-200 rounded-xl text-sm font-medium hover:bg-red-50 transition-colors"
                >
                  Delete
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
