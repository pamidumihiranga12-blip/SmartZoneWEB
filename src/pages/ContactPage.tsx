import React, { useState } from 'react';
import { Phone, Mail, MapPin, Send, Clock, MessageSquare } from 'lucide-react';
import toast from 'react-hot-toast';

const ContactPage: React.FC = () => {
  const [form, setForm] = useState({ name: '', email: '', phone: '', subject: '', message: '' });
  const [sent, setSent] = useState(false);

  const update = (k: string, v: string) => setForm(prev => ({ ...prev, [k]: v }));

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setSent(true);
    toast.success('Message sent! We\'ll get back to you shortly.', { style: { background: '#1a1a3e', color: '#fff' } });
    setForm({ name: '', email: '', phone: '', subject: '', message: '' });
    setTimeout(() => setSent(false), 4000);
  };

  return (
    <div className="bg-[#070714] min-h-screen py-12 px-4">
      <div className="max-w-6xl mx-auto">
        {/* Header */}
        <div className="text-center mb-14">
          <h1 className="text-5xl font-black text-white mb-4">Get In Touch</h1>
          <p className="text-gray-500 text-lg max-w-xl mx-auto">
            Have a question or need help? We're here for you. Reach out and we'll respond as quickly as possible.
          </p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Info Cards */}
          <div className="space-y-4">
            {[
              {
                icon: Phone,
                title: 'Phone',
                lines: ['0786800086'],
                note: 'Mon–Sat, 9am–7pm',
                color: 'blue',
                href: 'tel:0786800086',
              },
              {
                icon: Mail,
                title: 'Email',
                lines: ['smartzonelk101@gmail.com'],
                note: 'We reply within 24 hours',
                color: 'purple',
                href: 'mailto:smartzonelk101@gmail.com',
              },
              {
                icon: MapPin,
                title: 'Location',
                lines: ['Anuradhapura,', 'Sri Lanka'],
                note: 'Visit our showroom',
                color: 'cyan',
                href: '#',
              },
              {
                icon: Clock,
                title: 'Business Hours',
                lines: ['Mon–Sat: 9:00 AM – 7:00 PM', 'Sunday: 10:00 AM – 5:00 PM'],
                note: '',
                color: 'orange',
                href: '#',
              },
            ].map(({ icon: Icon, title, lines, note, color }) => (
              <div key={title} className={`bg-[#0d0d2b] border border-white/8 rounded-2xl p-5 flex gap-4 items-start hover:border-${color}-500/30 transition-all`}>
                <div className={`w-11 h-11 bg-${color}-500/10 rounded-xl flex items-center justify-center flex-shrink-0`}>
                  <Icon size={20} className={`text-${color}-400`} />
                </div>
                <div>
                  <h3 className="text-white font-bold mb-1">{title}</h3>
                  {lines.map((l, i) => <p key={i} className="text-gray-400 text-sm">{l}</p>)}
                  {note && <p className="text-gray-600 text-xs mt-1">{note}</p>}
                </div>
              </div>
            ))}
          </div>

          {/* Contact Form */}
          <div className="lg:col-span-2 bg-[#0d0d2b] border border-white/10 rounded-3xl p-8">
            <div className="flex items-center gap-3 mb-7">
              <div className="w-10 h-10 bg-blue-500/10 rounded-xl flex items-center justify-center">
                <MessageSquare size={20} className="text-blue-400" />
              </div>
              <div>
                <h2 className="text-white font-bold text-xl">Send a Message</h2>
                <p className="text-gray-500 text-sm">Fill in the form and we'll get back to you</p>
              </div>
            </div>

            {sent ? (
              <div className="text-center py-16">
                <div className="text-6xl mb-4">✅</div>
                <h3 className="text-white text-2xl font-bold mb-2">Message Sent!</h3>
                <p className="text-gray-500">We'll reach out to you at {form.email || 'your email'} soon.</p>
              </div>
            ) : (
              <form onSubmit={handleSubmit} className="space-y-4">
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div>
                    <label className="text-gray-400 text-sm font-medium block mb-1.5">Full Name *</label>
                    <input value={form.name} onChange={e => update('name', e.target.value)} required placeholder="Your name"
                      className="w-full bg-white/5 border border-white/10 focus:border-blue-500 rounded-xl px-4 py-3 text-white placeholder-gray-600 outline-none transition-colors text-sm" />
                  </div>
                  <div>
                    <label className="text-gray-400 text-sm font-medium block mb-1.5">Phone Number</label>
                    <input value={form.phone} onChange={e => update('phone', e.target.value)} placeholder="07XXXXXXXX"
                      className="w-full bg-white/5 border border-white/10 focus:border-blue-500 rounded-xl px-4 py-3 text-white placeholder-gray-600 outline-none transition-colors text-sm" />
                  </div>
                </div>
                <div>
                  <label className="text-gray-400 text-sm font-medium block mb-1.5">Email Address *</label>
                  <input type="email" value={form.email} onChange={e => update('email', e.target.value)} required placeholder="you@example.com"
                    className="w-full bg-white/5 border border-white/10 focus:border-blue-500 rounded-xl px-4 py-3 text-white placeholder-gray-600 outline-none transition-colors text-sm" />
                </div>
                <div>
                  <label className="text-gray-400 text-sm font-medium block mb-1.5">Subject *</label>
                  <select value={form.subject} onChange={e => update('subject', e.target.value)} required
                    className="w-full bg-white/5 border border-white/10 focus:border-blue-500 rounded-xl px-4 py-3 text-white outline-none transition-colors text-sm">
                    <option value="" className="bg-[#1a1a3e]">Select a subject</option>
                    <option value="order" className="bg-[#1a1a3e]">Order Inquiry</option>
                    <option value="product" className="bg-[#1a1a3e]">Product Question</option>
                    <option value="warranty" className="bg-[#1a1a3e]">Warranty & Returns</option>
                    <option value="delivery" className="bg-[#1a1a3e]">Delivery Status</option>
                    <option value="other" className="bg-[#1a1a3e]">Other</option>
                  </select>
                </div>
                <div>
                  <label className="text-gray-400 text-sm font-medium block mb-1.5">Message *</label>
                  <textarea value={form.message} onChange={e => update('message', e.target.value)} required rows={5} placeholder="Describe how we can help you..."
                    className="w-full bg-white/5 border border-white/10 focus:border-blue-500 rounded-xl px-4 py-3 text-white placeholder-gray-600 outline-none transition-colors resize-none text-sm" />
                </div>
                <button type="submit"
                  className="w-full bg-gradient-to-r from-blue-600 to-blue-500 hover:from-blue-500 hover:to-cyan-500 text-white font-bold py-4 rounded-2xl transition-all flex items-center justify-center gap-2 shadow-lg shadow-blue-500/20">
                  <Send size={18} /> Send Message
                </button>
              </form>
            )}
          </div>
        </div>

        {/* Map placeholder */}
        <div className="mt-10 bg-[#0d0d2b] border border-white/8 rounded-3xl overflow-hidden h-64 flex items-center justify-center">
          <div className="text-center">
            <MapPin size={40} className="text-blue-400 mx-auto mb-3" />
            <p className="text-white font-bold">SmartZone Electronics</p>
            <p className="text-gray-500 text-sm">Anuradhapura, Sri Lanka</p>
            <a href="https://maps.google.com/?q=Anuradhapura+Sri+Lanka" target="_blank" rel="noopener noreferrer"
              className="inline-block mt-3 text-blue-400 hover:text-blue-300 text-sm font-medium transition-colors">
              Open in Google Maps →
            </a>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ContactPage;
