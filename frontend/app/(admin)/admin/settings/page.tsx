'use client';

import { useState } from 'react';
import { CheckCircle2 } from 'lucide-react';

export default function AdminSettingsPage() {
  const [platformName, setPlatformName] = useState('Maha Stay');
  const [supportEmail, setSupportEmail] = useState('support@mahastay.com');
  const [vendorCommission, setVendorCommission] = useState('15');
  const [guestServiceFee, setGuestServiceFee] = useState('5');
  const [saved, setSaved] = useState(false);

  const handleSave = () => {
    // Save settings to localStorage for now (no backend API exists for this)
    const settings = {
      platformName,
      supportEmail,
      vendorCommission,
      guestServiceFee,
      updatedAt: new Date().toISOString(),
    };
    localStorage.setItem('adminSettings', JSON.stringify(settings));
    setSaved(true);
    setTimeout(() => setSaved(false), 3000);
  };

  // Load settings from localStorage on mount
  useState(() => {
    if (typeof window !== 'undefined') {
      const stored = localStorage.getItem('adminSettings');
      if (stored) {
        try {
          const parsed = JSON.parse(stored);
          setPlatformName(parsed.platformName || 'Maha Stay');
          setSupportEmail(parsed.supportEmail || 'support@mahastay.com');
          setVendorCommission(parsed.vendorCommission || '15');
          setGuestServiceFee(parsed.guestServiceFee || '5');
        } catch { /* ignore parse errors */ }
      }
    }
  });

  return (
    <div className="max-w-4xl space-y-8">
      <div>
        <h2 className="text-2xl font-bold text-gray-900">Platform Settings</h2>
        <p className="text-gray-500 text-sm mt-1">Configure global application settings and platform fees.</p>
      </div>

      {saved && (
        <div className="flex items-center gap-3 p-4 bg-green-50 border border-green-200 rounded-2xl animate-in fade-in">
          <CheckCircle2 className="w-5 h-5 text-green-600 flex-shrink-0" />
          <p className="text-sm font-medium text-green-800">Settings saved successfully!</p>
        </div>
      )}

      <div className="bg-white border border-gray-200 rounded-2xl shadow-sm overflow-hidden">
        <div className="px-6 py-5 border-b border-gray-200 bg-gray-50">
          <h3 className="text-lg font-semibold text-gray-900">General Settings</h3>
        </div>
        <div className="p-6 space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Platform Name</label>
              <input 
                type="text" 
                value={platformName}
                onChange={(e) => setPlatformName(e.target.value)}
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-500 outline-none transition-all" 
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Support Email</label>
              <input 
                type="email" 
                value={supportEmail}
                onChange={(e) => setSupportEmail(e.target.value)}
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-500 outline-none transition-all" 
              />
            </div>
          </div>
        </div>
      </div>

      <div className="bg-white border border-gray-200 rounded-2xl shadow-sm overflow-hidden">
        <div className="px-6 py-5 border-b border-gray-200 bg-gray-50">
          <h3 className="text-lg font-semibold text-gray-900">Financial Settings</h3>
        </div>
        <div className="p-6 space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Vendor Commission Rate (%)</label>
              <input 
                type="number" 
                value={vendorCommission}
                onChange={(e) => setVendorCommission(e.target.value)}
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-500 outline-none transition-all" 
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Guest Service Fee (%)</label>
              <input 
                type="number" 
                value={guestServiceFee}
                onChange={(e) => setGuestServiceFee(e.target.value)}
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-500 outline-none transition-all" 
              />
            </div>
          </div>
          <div className="pt-4 flex justify-end">
            <button 
              onClick={handleSave}
              className="px-6 py-2.5 bg-indigo-600 text-white font-medium rounded-lg hover:bg-indigo-700 transition-colors active:scale-[0.98]"
            >
              Save All Settings
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
