'use client';

import { useState, useEffect } from 'react';
import { useAuth } from '@/context/AuthContext';
import api from '@/lib/api';
import Link from 'next/link';
import { MapPin, CheckCircle2, Clock, Loader2, ArrowRight } from 'lucide-react';
import { useRouter } from 'next/navigation';

export default function BecomeHostPage() {
  const { user, loading: authLoading } = useAuth();
  const router = useRouter();

  const [loading, setLoading] = useState(true);
  const [requestStatus, setRequestStatus] = useState<string | null>(null);
  
  const [formData, setFormData] = useState({
    businessName: '',
    taxId: '',
    address: '',
    bankDetails: {
      accountName: '',
      accountNumber: '',
      ifscCode: '',
      bankName: '',
    },
  });
  const [submitting, setSubmitting] = useState(false);

  useEffect(() => {
    const fetchStatus = async () => {
      if (!user) {
        setLoading(false);
        return;
      }
      if (user.role === 'host' || user.role === 'admin') {
        router.push('/vendor');
        return;
      }

      try {
        const res = await api.get('/vendors/request/me');
        if (res.data) {
          setRequestStatus(res.data.status);
        }
      } catch (error: any) {
        if (error.response?.status !== 404) {
          console.error('Error fetching request status:', error);
        }
      } finally {
        setLoading(false);
      }
    };

    if (!authLoading) {
      fetchStatus();
    }
  }, [user, authLoading, router]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!user) {
      router.push('/login');
      return;
    }

    setSubmitting(true);
    try {
      await api.post('/vendors/request', formData);
      setRequestStatus('pending');
    } catch (error: any) {
      console.error(error);
      alert(error.response?.data?.message || 'Failed to submit request');
    } finally {
      setSubmitting(false);
    }
  };

  if (authLoading || loading) {
    return (
      <div className="flex items-center justify-center min-h-[70vh]">
        <Loader2 className="w-10 h-10 animate-spin text-brand-red" />
      </div>
    );
  }

  if (!user) {
    return (
      <div className="flex flex-col items-center justify-center min-h-[70vh] text-center px-4">
        <MapPin className="w-16 h-16 text-brand-red mb-4" />
        <h1 className="text-3xl font-bold text-gray-900 mb-2">Join MahaStays as a Host</h1>
        <p className="text-gray-600 mb-6 max-w-md">Please log in to your account to apply for a Host profile.</p>
        <Link href="/login" className="px-8 py-3 bg-brand-red text-white font-bold rounded-full hover:bg-red-600 transition">
          Log in or Sign up
        </Link>
      </div>
    );
  }

  if (requestStatus === 'pending') {
    return (
      <div className="flex flex-col items-center justify-center min-h-[70vh] text-center px-4 max-w-lg mx-auto">
        <div className="w-24 h-24 bg-yellow-50 text-yellow-500 rounded-full flex items-center justify-center mb-6">
          <Clock size={48} strokeWidth={1.5} />
        </div>
        <h1 className="text-3xl font-bold text-gray-900 tracking-tight mb-4">Application Under Review</h1>
        <p className="text-gray-600 text-lg leading-relaxed mb-8">
          Thank you for applying to be a host! Our team is currently reviewing your details. We will notify you once your application is approved.
        </p>
        <Link href="/" className="px-8 py-3 border-2 border-gray-900 text-gray-900 font-bold rounded-full hover:bg-gray-50 transition">
          Back to Home
        </Link>
      </div>
    );
  }

  if (requestStatus === 'rejected') {
    return (
      <div className="flex flex-col items-center justify-center min-h-[70vh] text-center px-4 max-w-lg mx-auto">
        <div className="w-24 h-24 bg-red-50 text-red-500 rounded-full flex items-center justify-center mb-6">
          <MapPin size={48} strokeWidth={1.5} />
        </div>
        <h1 className="text-3xl font-bold text-gray-900 tracking-tight mb-4">Application Rejected</h1>
        <p className="text-gray-600 text-lg leading-relaxed mb-8">
          Unfortunately, your previous application to become a host was not approved. You can try submitting a new application below.
        </p>
        <button 
          onClick={() => setRequestStatus(null)}
          className="px-8 py-3 bg-brand-red text-white font-bold rounded-full hover:bg-red-600 transition shadow-lg"
        >
          Re-apply Now
        </button>
      </div>
    );
  }

  return (
    <div className="max-w-3xl mx-auto px-4 py-16">
      <div className="text-center mb-12">
        <div className="w-16 h-16 bg-red-50 text-brand-red rounded-full flex items-center justify-center mx-auto mb-4">
          <MapPin size={32} strokeWidth={2} />
        </div>
        <h1 className="text-4xl font-extrabold text-gray-900 tracking-tight mb-4">Become a Host</h1>
        <p className="text-xl text-gray-600">Earn money by listing your property on MahaStays. Tell us a bit about your business to get started.</p>
      </div>

      <div className="bg-white border border-gray-200 rounded-2xl shadow-sm overflow-hidden">
        <div className="p-8">
          <form onSubmit={handleSubmit} className="space-y-6">
            
            <div className="space-y-2">
              <label htmlFor="businessName" className="block text-sm font-bold text-gray-900">
                Business / Property Name <span className="text-red-500">*</span>
              </label>
              <input
                type="text"
                id="businessName"
                required
                value={formData.businessName}
                onChange={(e) => setFormData({...formData, businessName: e.target.value})}
                className="w-full px-4 py-3 rounded-xl border border-gray-300 focus:ring-2 focus:ring-brand-red focus:border-brand-red outline-none transition-all"
                placeholder="E.g., Royal Villas Mahabaleshwar"
              />
            </div>

            <div className="space-y-2">
              <label htmlFor="taxId" className="block text-sm font-bold text-gray-900">
                Government ID / Tax ID <span className="text-red-500">*</span>
              </label>
              <input
                type="text"
                id="taxId"
                required
                value={formData.taxId}
                onChange={(e) => setFormData({...formData, taxId: e.target.value})}
                className="w-full px-4 py-3 rounded-xl border border-gray-300 focus:ring-2 focus:ring-brand-red focus:border-brand-red outline-none transition-all"
                placeholder="PAN, GSTIN, or Aadhar Number"
              />
              <p className="text-xs text-gray-500 mt-1">This is required for verification purposes and will be kept secure.</p>
            </div>

            <div className="space-y-2">
              <label htmlFor="address" className="block text-sm font-bold text-gray-900">
                Business Address <span className="text-red-500">*</span>
              </label>
              <textarea
                id="address"
                required
                rows={3}
                value={formData.address}
                onChange={(e) => setFormData({...formData, address: e.target.value})}
                className="w-full px-4 py-3 rounded-xl border border-gray-300 focus:ring-2 focus:ring-brand-red focus:border-brand-red outline-none transition-all resize-none"
                placeholder="Full address of your primary property or business office"
              />
            </div>

            <hr className="border-gray-200" />
            <h3 className="text-lg font-bold text-gray-900">Bank Account Details</h3>
            <p className="text-sm text-gray-500 mb-4">Required so we can process your payouts for bookings.</p>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="space-y-2">
                <label htmlFor="accountName" className="block text-sm font-bold text-gray-900">
                  Account Holder Name <span className="text-red-500">*</span>
                </label>
                <input
                  type="text"
                  id="accountName"
                  required
                  value={formData.bankDetails.accountName}
                  onChange={(e) => setFormData({...formData, bankDetails: {...formData.bankDetails, accountName: e.target.value}})}
                  className="w-full px-4 py-3 rounded-xl border border-gray-300 focus:ring-2 focus:ring-brand-red focus:border-brand-red outline-none transition-all"
                  placeholder="Name on Bank Account"
                />
              </div>

              <div className="space-y-2">
                <label htmlFor="accountNumber" className="block text-sm font-bold text-gray-900">
                  Account Number <span className="text-red-500">*</span>
                </label>
                <input
                  type="text"
                  id="accountNumber"
                  required
                  value={formData.bankDetails.accountNumber}
                  onChange={(e) => setFormData({...formData, bankDetails: {...formData.bankDetails, accountNumber: e.target.value}})}
                  className="w-full px-4 py-3 rounded-xl border border-gray-300 focus:ring-2 focus:ring-brand-red focus:border-brand-red outline-none transition-all"
                  placeholder="Bank Account Number"
                />
              </div>

              <div className="space-y-2">
                <label htmlFor="ifscCode" className="block text-sm font-bold text-gray-900">
                  IFSC Code <span className="text-red-500">*</span>
                </label>
                <input
                  type="text"
                  id="ifscCode"
                  required
                  value={formData.bankDetails.ifscCode}
                  onChange={(e) => setFormData({...formData, bankDetails: {...formData.bankDetails, ifscCode: e.target.value}})}
                  className="w-full px-4 py-3 rounded-xl border border-gray-300 focus:ring-2 focus:ring-brand-red focus:border-brand-red outline-none transition-all"
                  placeholder="e.g. HDFC0001234"
                />
              </div>

              <div className="space-y-2">
                <label htmlFor="bankName" className="block text-sm font-bold text-gray-900">
                  Bank Name <span className="text-red-500">*</span>
                </label>
                <input
                  type="text"
                  id="bankName"
                  required
                  value={formData.bankDetails.bankName}
                  onChange={(e) => setFormData({...formData, bankDetails: {...formData.bankDetails, bankName: e.target.value}})}
                  className="w-full px-4 py-3 rounded-xl border border-gray-300 focus:ring-2 focus:ring-brand-red focus:border-brand-red outline-none transition-all"
                  placeholder="e.g. HDFC Bank"
                />
              </div>
            </div>

            <div className="pt-4 border-t border-gray-100">
              <button
                type="submit"
                disabled={submitting}
                className="w-full py-4 bg-brand-red text-white text-lg font-bold rounded-xl hover:bg-red-600 transition-colors shadow-md disabled:opacity-70 flex justify-center items-center gap-2"
              >
                {submitting ? (
                  <Loader2 className="w-6 h-6 animate-spin" />
                ) : (
                  <>Submit Application <ArrowRight size={20} /></>
                )}
              </button>
            </div>
            
          </form>
        </div>
      </div>
    </div>
  );
}
