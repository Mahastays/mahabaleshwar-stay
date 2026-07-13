'use client';

export default function VendorSettingsPage() {
  return (
    <div className="max-w-4xl space-y-8">
      <div>
        <h2 className="text-2xl font-bold text-gray-900">Account Settings</h2>
        <p className="text-gray-500 text-sm mt-1">Manage your vendor profile and preferences.</p>
      </div>

      <div className="bg-white border border-gray-200 rounded-2xl shadow-sm overflow-hidden">
        <div className="px-6 py-5 border-b border-gray-200 bg-gray-50">
          <h3 className="text-lg font-semibold text-gray-900">Profile Information</h3>
        </div>
        <div className="p-6 space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Full Name</label>
              <input type="text" defaultValue="Vendor Name" className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-gray-900/20 focus:border-gray-900 outline-none transition-all" />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Email Address</label>
              <input type="email" defaultValue="vendor@example.com" className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-gray-900/20 focus:border-gray-900 outline-none transition-all" />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Phone Number</label>
              <input type="tel" defaultValue="+91 9876543210" className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-gray-900/20 focus:border-gray-900 outline-none transition-all" />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Business Name</label>
              <input type="text" defaultValue="MahaStays Hospitality" className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-gray-900/20 focus:border-gray-900 outline-none transition-all" />
            </div>
          </div>
          <div className="pt-4 flex justify-end">
            <button className="px-6 py-2.5 bg-gray-900 text-white font-medium rounded-lg hover:bg-gray-800 transition-colors">
              Save Changes
            </button>
          </div>
        </div>
      </div>

      <div className="bg-white border border-gray-200 rounded-2xl shadow-sm overflow-hidden">
        <div className="px-6 py-5 border-b border-gray-200 bg-gray-50">
          <h3 className="text-lg font-semibold text-gray-900">Notification Preferences</h3>
        </div>
        <div className="p-6 space-y-4">
          {[
            { id: 'email-book', label: 'Email on new booking', defaultChecked: true },
            { id: 'sms-book', label: 'SMS on new booking', defaultChecked: true },
            { id: 'email-cancel', label: 'Email on cancellation', defaultChecked: true },
            { id: 'promo', label: 'Marketing updates & promotions', defaultChecked: false },
          ].map((setting) => (
            <label key={setting.id} className="flex items-center justify-between cursor-pointer group">
              <span className="text-gray-700 font-medium group-hover:text-gray-900 transition-colors">{setting.label}</span>
              <div className="relative">
                <input type="checkbox" className="sr-only peer" defaultChecked={setting.defaultChecked} />
                <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-gray-900"></div>
              </div>
            </label>
          ))}
        </div>
      </div>
    </div>
  );
}
