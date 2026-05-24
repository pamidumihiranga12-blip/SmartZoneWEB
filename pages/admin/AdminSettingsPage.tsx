import { useState, useEffect } from 'react';
import { Save, Globe, Bell, Image, Star, Phone, Mail, MapPin } from 'lucide-react';
import { settingsService } from '../../services/db';
import { SiteSettings, useStore } from '../../store/useStore';
import toast from 'react-hot-toast';

export default function AdminSettingsPage() {
  const { setSiteSettings } = useStore();
  const [settings, setSettings] = useState<SiteSettings | null>(null);
  const [saving, setSaving] = useState(false);
  const [activeTab, setActiveTab] = useState<'general' | 'banner' | 'special' | 'announcement' | 'social'>('general');

  useEffect(() => {
    setSettings(settingsService.get());
  }, []);

  const handleSave = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!settings) return;
    setSaving(true);
    try {
      const updated = settingsService.update(settings);
      setSiteSettings(updated);
      toast.success('Settings saved successfully!');
    } catch (err: any) {
      toast.error(err.message || 'Failed to save settings');
    } finally {
      setSaving(false);
    }
  };

  if (!settings) return <div className="animate-pulse text-gray-400">Loading settings...</div>;

  const tabs = [
    { key: 'general', label: 'General', icon: <Globe size={15} /> },
    { key: 'banner', label: 'Hero Banner', icon: <Image size={15} /> },
    { key: 'special', label: 'Special Offer', icon: <Star size={15} /> },
    { key: 'announcement', label: 'Announcement', icon: <Bell size={15} /> },
    { key: 'social', label: 'Social Links', icon: <Phone size={15} /> },
  ];

  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-xl font-black text-gray-900">Site Settings</h2>
        <p className="text-gray-500 text-sm">Manage your website content and appearance</p>
      </div>

      <form onSubmit={handleSave}>
        {/* Tabs */}
        <div className="bg-white rounded-2xl shadow-sm border border-gray-100 mb-4">
          <div className="flex overflow-x-auto border-b border-gray-100">
            {tabs.map((tab) => (
              <button
                key={tab.key}
                type="button"
                onClick={() => setActiveTab(tab.key as any)}
                className={`flex items-center gap-1.5 px-5 py-3.5 text-sm font-medium whitespace-nowrap border-b-2 transition-colors flex-shrink-0 ${
                  activeTab === tab.key
                    ? 'border-blue-600 text-blue-600'
                    : 'border-transparent text-gray-500 hover:text-gray-700'
                }`}
              >
                {tab.icon} {tab.label}
              </button>
            ))}
          </div>
        </div>

        {/* Content */}
        <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-6">
          {/* General */}
          {activeTab === 'general' && (
            <div className="space-y-5">
              <h3 className="font-bold text-gray-900">General Information</h3>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div className="sm:col-span-2">
                  <label className="block text-sm font-semibold text-gray-700 mb-1.5">About Text</label>
                  <textarea
                    rows={3}
                    value={settings.aboutText}
                    onChange={(e) => setSettings({ ...settings, aboutText: e.target.value })}
                    className="w-full border border-gray-200 rounded-xl px-3 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 resize-none"
                    placeholder="Brief description of your store..."
                  />
                </div>
                <div>
                  <label className="block text-sm font-semibold text-gray-700 mb-1.5 flex items-center gap-1">
                    <Phone size={13} /> Contact Phone
                  </label>
                  <input
                    type="tel"
                    value={settings.contactPhone}
                    onChange={(e) => setSettings({ ...settings, contactPhone: e.target.value })}
                    className="w-full border border-gray-200 rounded-xl px-3 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
                  />
                </div>
                <div>
                  <label className="block text-sm font-semibold text-gray-700 mb-1.5 flex items-center gap-1">
                    <Mail size={13} /> Contact Email
                  </label>
                  <input
                    type="email"
                    value={settings.contactEmail}
                    onChange={(e) => setSettings({ ...settings, contactEmail: e.target.value })}
                    className="w-full border border-gray-200 rounded-xl px-3 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
                  />
                </div>
                <div className="sm:col-span-2">
                  <label className="block text-sm font-semibold text-gray-700 mb-1.5 flex items-center gap-1">
                    <MapPin size={13} /> Address
                  </label>
                  <input
                    type="text"
                    value={settings.contactAddress}
                    onChange={(e) => setSettings({ ...settings, contactAddress: e.target.value })}
                    className="w-full border border-gray-200 rounded-xl px-3 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
                  />
                </div>
              </div>
            </div>
          )}

          {/* Hero Banner */}
          {activeTab === 'banner' && (
            <div className="space-y-5">
              <h3 className="font-bold text-gray-900">Hero Banner Settings</h3>
              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-1.5">Banner Title</label>
                <input
                  type="text"
                  value={settings.heroBannerTitle}
                  onChange={(e) => setSettings({ ...settings, heroBannerTitle: e.target.value })}
                  className="w-full border border-gray-200 rounded-xl px-3 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
                  placeholder="Main hero headline"
                />
              </div>
              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-1.5">Banner Subtitle</label>
                <textarea
                  rows={2}
                  value={settings.heroBannerSubtitle}
                  onChange={(e) => setSettings({ ...settings, heroBannerSubtitle: e.target.value })}
                  className="w-full border border-gray-200 rounded-xl px-3 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 resize-none"
                  placeholder="Supporting text below the title"
                />
              </div>
              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-1.5">Banner Background Image URL</label>
                <input
                  type="url"
                  value={settings.heroBannerImage}
                  onChange={(e) => setSettings({ ...settings, heroBannerImage: e.target.value })}
                  className="w-full border border-gray-200 rounded-xl px-3 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
                  placeholder="https://..."
                />
                {settings.heroBannerImage && (
                  <div className="mt-2 rounded-xl overflow-hidden h-32">
                    <img src={settings.heroBannerImage} alt="Preview" className="w-full h-full object-cover" />
                  </div>
                )}
              </div>
            </div>
          )}

          {/* Special Offer */}
          {activeTab === 'special' && (
            <div className="space-y-5">
              <div className="flex items-center justify-between">
                <h3 className="font-bold text-gray-900">Special Offer Banner</h3>
                <label className="flex items-center gap-2 cursor-pointer">
                  <div
                    onClick={() => setSettings({
                      ...settings,
                      specialOffer: { ...settings.specialOffer!, active: !settings.specialOffer?.active }
                    })}
                    className={`w-10 h-6 rounded-full transition-colors relative ${settings.specialOffer?.active ? 'bg-blue-600' : 'bg-gray-300'}`}
                  >
                    <div className={`w-4 h-4 bg-white rounded-full absolute top-1 transition-transform shadow ${settings.specialOffer?.active ? 'translate-x-5' : 'translate-x-1'}`} />
                  </div>
                  <span className="text-sm font-medium text-gray-700">{settings.specialOffer?.active ? 'Active' : 'Hidden'}</span>
                </label>
              </div>
              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-1.5">Offer Title</label>
                <input
                  type="text"
                  value={settings.specialOffer?.title || ''}
                  onChange={(e) => setSettings({ ...settings, specialOffer: { ...settings.specialOffer!, title: e.target.value } })}
                  className="w-full border border-gray-200 rounded-xl px-3 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
                  placeholder="🔥 Special Offer Title"
                />
              </div>
              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-1.5">Offer Description</label>
                <textarea
                  rows={2}
                  value={settings.specialOffer?.description || ''}
                  onChange={(e) => setSettings({ ...settings, specialOffer: { ...settings.specialOffer!, description: e.target.value } })}
                  className="w-full border border-gray-200 rounded-xl px-3 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 resize-none"
                />
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-semibold text-gray-700 mb-1.5">Discount Text</label>
                  <input
                    type="text"
                    value={settings.specialOffer?.discount || ''}
                    onChange={(e) => setSettings({ ...settings, specialOffer: { ...settings.specialOffer!, discount: e.target.value } })}
                    className="w-full border border-gray-200 rounded-xl px-3 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
                    placeholder="e.g. 30%"
                  />
                </div>
                <div>
                  <label className="block text-sm font-semibold text-gray-700 mb-1.5">Background Color</label>
                  <div className="flex gap-2">
                    <input
                      type="color"
                      value={settings.specialOffer?.bgColor || '#1e40af'}
                      onChange={(e) => setSettings({ ...settings, specialOffer: { ...settings.specialOffer!, bgColor: e.target.value } })}
                      className="w-10 h-10 border border-gray-200 rounded-lg cursor-pointer"
                    />
                    <input
                      type="text"
                      value={settings.specialOffer?.bgColor || '#1e40af'}
                      onChange={(e) => setSettings({ ...settings, specialOffer: { ...settings.specialOffer!, bgColor: e.target.value } })}
                      className="flex-1 border border-gray-200 rounded-xl px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
                    />
                  </div>
                </div>
              </div>

              {/* Preview */}
              {settings.specialOffer?.active && (
                <div className="mt-2">
                  <p className="text-xs text-gray-500 mb-2">Preview:</p>
                  <div
                    className="rounded-xl p-4 text-white text-center"
                    style={{ backgroundColor: settings.specialOffer.bgColor || '#1e40af' }}
                  >
                    <p className="font-bold">{settings.specialOffer.title}</p>
                    <p className="text-sm opacity-80">{settings.specialOffer.description}</p>
                  </div>
                </div>
              )}
            </div>
          )}

          {/* Announcement Bar */}
          {activeTab === 'announcement' && (
            <div className="space-y-5">
              <div className="flex items-center justify-between">
                <h3 className="font-bold text-gray-900">Announcement Bar (Top of page)</h3>
                <label className="flex items-center gap-2 cursor-pointer">
                  <div
                    onClick={() => setSettings({
                      ...settings,
                      announcementBar: { ...settings.announcementBar!, active: !settings.announcementBar?.active }
                    })}
                    className={`w-10 h-6 rounded-full transition-colors relative ${settings.announcementBar?.active ? 'bg-blue-600' : 'bg-gray-300'}`}
                  >
                    <div className={`w-4 h-4 bg-white rounded-full absolute top-1 transition-transform shadow ${settings.announcementBar?.active ? 'translate-x-5' : 'translate-x-1'}`} />
                  </div>
                  <span className="text-sm font-medium text-gray-700">{settings.announcementBar?.active ? 'Active' : 'Hidden'}</span>
                </label>
              </div>
              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-1.5">Announcement Text</label>
                <input
                  type="text"
                  value={settings.announcementBar?.text || ''}
                  onChange={(e) => setSettings({ ...settings, announcementBar: { ...settings.announcementBar!, text: e.target.value } })}
                  className="w-full border border-gray-200 rounded-xl px-3 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
                  placeholder="🚀 Free delivery on orders above Rs. 5,000!"
                />
              </div>
              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-1.5">Background Color</label>
                <div className="flex gap-2">
                  <input
                    type="color"
                    value={settings.announcementBar?.bgColor || '#1e40af'}
                    onChange={(e) => setSettings({ ...settings, announcementBar: { ...settings.announcementBar!, bgColor: e.target.value } })}
                    className="w-10 h-10 border border-gray-200 rounded-lg cursor-pointer"
                  />
                  <input
                    type="text"
                    value={settings.announcementBar?.bgColor || '#1e40af'}
                    onChange={(e) => setSettings({ ...settings, announcementBar: { ...settings.announcementBar!, bgColor: e.target.value } })}
                    className="flex-1 border border-gray-200 rounded-xl px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
                  />
                </div>
              </div>
            </div>
          )}

          {/* Social Links */}
          {activeTab === 'social' && (
            <div className="space-y-5">
              <h3 className="font-bold text-gray-900">Social Media Links</h3>
              {[
                { key: 'facebook', label: '📘 Facebook URL', placeholder: 'https://facebook.com/yourpage' },
                { key: 'instagram', label: '📸 Instagram URL', placeholder: 'https://instagram.com/yourpage' },
                { key: 'whatsapp', label: '💬 WhatsApp Link', placeholder: 'https://wa.me/94XXXXXXXXX' },
                { key: 'twitter', label: '🐦 Twitter URL', placeholder: 'https://twitter.com/yourpage' },
              ].map((social) => (
                <div key={social.key}>
                  <label className="block text-sm font-semibold text-gray-700 mb-1.5">{social.label}</label>
                  <input
                    type="url"
                    value={(settings.socialLinks as any)[social.key] || ''}
                    onChange={(e) => setSettings({
                      ...settings,
                      socialLinks: { ...settings.socialLinks, [social.key]: e.target.value }
                    })}
                    className="w-full border border-gray-200 rounded-xl px-3 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
                    placeholder={social.placeholder}
                  />
                </div>
              ))}
            </div>
          )}
        </div>

        {/* Save Button */}
        <div className="mt-4 flex justify-end">
          <button
            type="submit"
            disabled={saving}
            className="inline-flex items-center gap-2 bg-blue-600 hover:bg-blue-700 disabled:bg-gray-400 text-white px-8 py-3 rounded-xl font-semibold transition-colors shadow-lg shadow-blue-200"
          >
            {saving ? (
              <span className="animate-spin w-4 h-4 border-2 border-white border-t-transparent rounded-full" />
            ) : (
              <Save size={16} />
            )}
            {saving ? 'Saving...' : 'Save All Settings'}
          </button>
        </div>
      </form>
    </div>
  );
}
