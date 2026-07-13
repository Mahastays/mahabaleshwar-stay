'use client';

import { useState } from 'react';
import { TrendingUp, Wallet, ArrowUpRight, ArrowDownRight, X, Building, CheckCircle2 } from 'lucide-react';

export default function VendorEarningsPage() {
  const [showModal, setShowModal] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [success, setSuccess] = useState(false);

  const dummyPayouts = [
    { id: '1', date: '01 Aug 2026', amount: 45000, status: 'processed' },
    { id: '2', date: '15 Jul 2026', amount: 32000, status: 'processed' },
    { id: '3', date: '01 Jul 2026', amount: 58000, status: 'processed' },
  ];

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);
    // Simulate API delay
    setTimeout(() => {
      setIsSubmitting(false);
      setSuccess(true);
      setTimeout(() => {
        setSuccess(false);
        setShowModal(false);
      }, 2000);
    }, 1500);
  };

  return (
    <div className="max-w-6xl mx-auto space-y-8 relative">
      <div>
        <h2 className="text-2xl font-bold text-gray-900">Earnings</h2>
        <p className="text-gray-500 text-sm mt-1">Track your revenue and payout history.</p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <div className="bg-white p-6 rounded-2xl border border-gray-200 shadow-sm relative overflow-hidden">
          <p className="text-sm font-medium text-gray-500 mb-2">Available for Payout</p>
          <h3 className="text-4xl font-bold text-gray-900 mb-4">₹18,500</h3>
          <button 
            onClick={() => setShowModal(true)}
            className="w-full py-2 bg-gray-900 text-white rounded-lg font-medium hover:bg-gray-800 transition-colors text-sm"
          >
            Withdraw Funds
          </button>
        </div>
        
        <div className="bg-white p-6 rounded-2xl border border-gray-200 shadow-sm">
          <p className="text-sm font-medium text-gray-500 mb-2">Total Earned (YTD)</p>
          <h3 className="text-3xl font-bold text-gray-900 mb-4">₹1,35,000</h3>
          <div className="flex items-center gap-1 text-sm text-green-600 font-medium">
            <TrendingUp className="w-4 h-4" />
            <span>+12.5% from last year</span>
          </div>
        </div>

        <div className="bg-white p-6 rounded-2xl border border-gray-200 shadow-sm">
          <p className="text-sm font-medium text-gray-500 mb-2">Pending Clearance</p>
          <h3 className="text-3xl font-bold text-gray-900 mb-4">₹5,000</h3>
          <div className="flex items-center gap-1 text-sm text-gray-500 font-medium">
            <ArrowDownRight className="w-4 h-4" />
            <span>Expected in 3-5 days</span>
          </div>
        </div>
      </div>

      <div className="bg-white border border-gray-200 rounded-2xl shadow-sm overflow-hidden">
        <div className="px-6 py-5 border-b border-gray-200">
          <h3 className="text-lg font-semibold text-gray-900">Recent Payouts</h3>
        </div>
        <div className="overflow-x-auto">
          <table className="w-full text-sm text-left">
            <thead className="bg-gray-50 border-b border-gray-200 text-gray-500 uppercase text-xs font-bold tracking-wider">
              <tr>
                <th className="px-6 py-4">Transaction ID</th>
                <th className="px-6 py-4">Date</th>
                <th className="px-6 py-4">Amount</th>
                <th className="px-6 py-4">Status</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-200 text-gray-700">
              {dummyPayouts.map((payout) => (
                <tr key={payout.id} className="hover:bg-gray-50 transition-colors">
                  <td className="px-6 py-4 font-medium text-gray-500">TXN-{payout.id}98234A</td>
                  <td className="px-6 py-4">{payout.date}</td>
                  <td className="px-6 py-4 font-bold text-gray-900">₹{payout.amount.toLocaleString()}</td>
                  <td className="px-6 py-4">
                    <span className="px-2.5 py-1 rounded-full text-[10px] font-bold uppercase tracking-wider bg-green-100 text-green-700">
                      {payout.status}
                    </span>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* Bank Account Modal */}
      {showModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 backdrop-blur-sm p-4">
          <div className="bg-white rounded-2xl shadow-2xl w-full max-w-md overflow-hidden relative animate-in fade-in zoom-in-95 duration-200">
            <button 
              onClick={() => !isSubmitting && setShowModal(false)}
              className="absolute right-4 top-4 text-gray-400 hover:text-gray-900 transition-colors"
            >
              <X className="w-5 h-5" />
            </button>
            
            <div className="p-6">
              {success ? (
                <div className="text-center py-8">
                  <CheckCircle2 className="w-16 h-16 text-green-500 mx-auto mb-4" />
                  <h3 className="text-xl font-bold text-gray-900 mb-2">Request Submitted!</h3>
                  <p className="text-gray-500">Your ₹18,500 withdrawal is processing and will hit your account in 2-3 business days.</p>
                </div>
              ) : (
                <>
                  <div className="flex items-center gap-3 mb-6">
                    <div className="p-2 bg-gray-100 rounded-lg text-gray-900">
                      <Building className="w-6 h-6" />
                    </div>
                    <div>
                      <h3 className="text-xl font-bold text-gray-900">Link Bank Account</h3>
                      <p className="text-xs text-gray-500">Withdraw ₹18,500 to this account.</p>
                    </div>
                  </div>

                  <form onSubmit={handleSubmit} className="space-y-4">
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">Bank Name</label>
                      <input required type="text" placeholder="e.g. HDFC Bank" className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-gray-900/20 focus:border-gray-900 outline-none transition-all" />
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">Account Holder Name</label>
                      <input required type="text" placeholder="John Doe" className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-gray-900/20 focus:border-gray-900 outline-none transition-all" />
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">Account Number</label>
                      <input required type="password" placeholder="••••••••" className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-gray-900/20 focus:border-gray-900 outline-none transition-all" />
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">IFSC Code</label>
                      <input required type="text" placeholder="HDFC0001234" className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-gray-900/20 focus:border-gray-900 outline-none transition-all uppercase" />
                    </div>
                    <div className="pt-2">
                      <button 
                        type="submit" 
                        disabled={isSubmitting}
                        className={`w-full py-3 bg-gray-900 text-white rounded-lg font-medium hover:bg-gray-800 transition-colors flex justify-center items-center ${isSubmitting ? 'opacity-70 cursor-not-allowed' : ''}`}
                      >
                        {isSubmitting ? 'Processing...' : 'Confirm & Withdraw'}
                      </button>
                    </div>
                  </form>
                </>
              )}
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
