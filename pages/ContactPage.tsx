import { useState } from 'react';
import { Phone, Mail, MapPin, Clock, Send, MessageCircle } from 'lucide-react';
import { messageService } from '../services/db';
import { useStore } from '../store/useStore';
import toast from 'react-hot-toast';

export default function ContactPage() {
  const { siteSettings, user } = useStore();
  const [form, setForm] = useState({
    name: user?.name || '',
    email: user?.email || '',
    phone: user?.phone || '',
    subject: '',
    message: '',
  });
  const [sending, setSending] = useState(false);
  const [sent, setSent] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!form.name || !form.email || !form.subject || !form.message) {
      toast.error('Please fill all required fields');
      return;
    }
    setSending(true);
    try {
      messageService.create({
        name: form.name,
        email: form.email,
        phone: form.phone,
        subject: form.subject,
        message: form.message,
      });
      setSent(true);
      toast.success('Message sent successfully! We\'ll get back to you soon.');
      setForm({ name: '', email: '', phone: '', subject: '', message: '' });
    } catch {
      toast.error('Failed to send message. Please try again.');
    } finally {
      setSending(false);
    }
  };

  const phone = siteSettings?.contactPhone || '0786800086';
  const email = siteSettings?.contactEmail || 'smartzonelk101@gmail.com';
  const address = siteSettings?.contactAddress || 'Anuradhapura, Sri Lanka';

  const contactCards = [
    {
      icon: <Phone size={22} />,
      title: 'Call / WhatsApp',
      desc: 'Mon-Sat, 8AM - 8PM',
      value: phone,
      action: `tel:${phone}`,
      color: 'bg-blue-600',
    },
    {
      icon: <Mail size={22} />,
      title: 'Email Us',
      desc: 'We reply within 24 hours',
      value: email,
      action: `mailto:${email}`,
      color: 'bg-purple-600',
    },
    {
      icon: <MapPin size={22} />,
      title: 'Visit Us',
      desc: 'Come see us in person',
      value: address,
      action: '#',
      color: 'bg-green-600',
    },
    {
      icon: <Clock size={22} />,
      title: 'Working Hours',
      desc: 'We\'re here for you',
      value: 'Mon-Sat: 8AM – 8PM',
      action: '#',
      color: 'bg-orange-600',
    },
  ];

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Hero */}
      <div className="bg-gradient-to-r from-blue-700 to-blue-900 text-white">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-14 text-center">
          <div className="w-14 h-14 bg-white/20 rounded-2xl flex items-center justify-center mx-auto mb-4">
            <MessageCircle size={28} />
          </div>
          <h1 className="text-3xl sm:text-4xl font-black mb-3">Get in Touch</h1>
          <p className="text-blue-200 text-lg">We're here to help you with anything you need</p>
        </div>
      </div>

      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        {/* Contact Cards */}
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 mb-12">
          {contactCards.map((card) => (
            <a
              key={card.title}
              href={card.action}
              className="bg-white rounded-2xl p-5 shadow-sm border border-gray-100 hover:shadow-md transition-shadow group"
            >
              <div className={`w-11 h-11 ${card.color} rounded-xl flex items-center justify-center text-white mb-3 group-hover:scale-110 transition-transform`}>
                {card.icon}
              </div>
              <h3 className="font-bold text-gray-900 text-sm mb-0.5">{card.title}</h3>
              <p className="text-xs text-gray-500 mb-2">{card.desc}</p>
              <p className="text-sm font-medium text-gray-700 break-all">{card.value}</p>
            </a>
          ))}
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          {/* Contact Form */}
          <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-6 sm:p-8">
            <h2 className="text-xl font-black text-gray-900 mb-6">Send Us a Message</h2>

            {sent ? (
              <div className="text-center py-10">
                <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-4">
                  <Send size={28} className="text-green-600" />
                </div>
                <h3 className="text-lg font-bold text-gray-900 mb-2">Message Sent! ✓</h3>
                <p className="text-gray-500 mb-4">Thank you for reaching out. We'll get back to you within 24 hours.</p>
                <button
                  onClick={() => setSent(false)}
                  className="text-blue-600 font-medium hover:text-blue-700"
                >
                  Send another message
                </button>
              </div>
            ) : (
              <form onSubmit={handleSubmit} className="space-y-4">
                <div className="grid grid-cols-2 gap-3">
                  <div>
                    <label className="block text-sm font-semibold text-gray-700 mb-1">Name *</label>
                    <input
                      type="text"
                      required
                      value={form.name}
                      onChange={(e) => setForm({ ...form, name: e.target.value })}
                      className="w-full border border-gray-200 rounded-xl px-3 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
                      placeholder="Your name"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-semibold text-gray-700 mb-1">Phone</label>
                    <input
                      type="tel"
                      value={form.phone}
                      onChange={(e) => setForm({ ...form, phone: e.target.value })}
                      className="w-full border border-gray-200 rounded-xl px-3 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
                      placeholder="07X XXX XXXX"
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-sm font-semibold text-gray-700 mb-1">Email *</label>
                  <input
                    type="email"
                    required
                    value={form.email}
                    onChange={(e) => setForm({ ...form, email: e.target.value })}
                    className="w-full border border-gray-200 rounded-xl px-3 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
                    placeholder="your@email.com"
                  />
                </div>

                <div>
                  <label className="block text-sm font-semibold text-gray-700 mb-1">Subject *</label>
                  <select
                    required
                    value={form.subject}
                    onChange={(e) => setForm({ ...form, subject: e.target.value })}
                    className="w-full border border-gray-200 rounded-xl px-3 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
                  >
                    <option value="">Select a subject</option>
                    <option>Order Inquiry</option>
                    <option>Product Question</option>
                    <option>Return / Refund</option>
                    <option>Technical Support</option>
                    <option>Warranty Claim</option>
                    <option>General Inquiry</option>
                  </select>
                </div>

                <div>
                  <label className="block text-sm font-semibold text-gray-700 mb-1">Message *</label>
                  <textarea
                    required
                    rows={5}
                    value={form.message}
                    onChange={(e) => setForm({ ...form, message: e.target.value })}
                    className="w-full border border-gray-200 rounded-xl px-3 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 resize-none"
                    placeholder="How can we help you?"
                  />
                </div>

                <button
                  type="submit"
                  disabled={sending}
                  className="w-full bg-blue-600 hover:bg-blue-700 disabled:bg-gray-400 text-white py-3 rounded-xl font-semibold transition-colors shadow-lg shadow-blue-200 flex items-center justify-center gap-2"
                >
                  {sending ? (
                    <>
                      <span className="animate-spin w-4 h-4 border-2 border-white border-t-transparent rounded-full" />
                      Sending...
                    </>
                  ) : (
                    <>
                      <Send size={16} /> Send Message
                    </>
                  )}
                </button>
              </form>
            )}
          </div>

          {/* Map / Info */}
          <div className="space-y-4">
            {/* Map Placeholder */}
            <div className="bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden">
              <div className="bg-gradient-to-br from-blue-100 to-indigo-100 h-64 flex items-center justify-center relative">
                <div className="text-center">
                  <div className="w-16 h-16 bg-blue-600 rounded-full flex items-center justify-center mx-auto mb-3 shadow-lg animate-pulse">
                    <MapPin size={28} className="text-white" />
                  </div>
                  <p className="font-bold text-gray-900">SmartZone Store</p>
                  <p className="text-gray-600 text-sm">{address}</p>
                </div>
                {/* Grid dots */}
                <div
                  className="absolute inset-0 opacity-20"
                  style={{
                    backgroundImage: 'radial-gradient(circle, #6366f1 1px, transparent 1px)',
                    backgroundSize: '20px 20px',
                  }}
                />
              </div>
              <div className="p-4">
                <p className="text-sm text-gray-600 text-center">
                  📍 Visit us in <strong>Anuradhapura, Sri Lanka</strong>
                </p>
                <a
                  href={`https://maps.google.com/?q=Anuradhapura+Sri+Lanka`}
                  target="_blank"
                  rel="noreferrer"
                  className="mt-2 block text-center text-blue-600 text-sm font-medium hover:text-blue-700"
                >
                  Open in Google Maps →
                </a>
              </div>
            </div>

            {/* WhatsApp Quick Contact */}
            {siteSettings?.socialLinks?.whatsapp && (
              <a
                href={siteSettings.socialLinks.whatsapp}
                target="_blank"
                rel="noreferrer"
                className="flex items-center gap-4 bg-green-600 hover:bg-green-700 text-white p-5 rounded-2xl shadow-md transition-colors group"
              >
                <div className="w-12 h-12 bg-white/20 rounded-xl flex items-center justify-center flex-shrink-0 group-hover:scale-110 transition-transform">
                  <MessageCircle size={24} />
                </div>
                <div>
                  <p className="font-bold text-lg">Chat on WhatsApp</p>
                  <p className="text-green-200 text-sm">Quick responses guaranteed</p>
                </div>
              </a>
            )}

            {/* FAQ */}
            <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-5">
              <h3 className="font-bold text-gray-900 mb-4">Frequently Asked Questions</h3>
              <div className="space-y-3">
                {[
                  { q: 'Do you offer warranty?', a: 'Yes! All products come with official brand warranty.' },
                  { q: 'What is your return policy?', a: 'We offer 7-day hassle-free returns for defective products.' },
                  { q: 'Do you deliver island-wide?', a: 'Yes, we deliver across Sri Lanka with fast shipping.' },
                ].map((faq, i) => (
                  <div key={i} className="border-b border-gray-100 last:border-0 pb-3 last:pb-0">
                    <p className="font-medium text-gray-900 text-sm">{faq.q}</p>
                    <p className="text-gray-500 text-xs mt-0.5">{faq.a}</p>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
