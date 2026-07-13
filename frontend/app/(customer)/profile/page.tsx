'use client';

import { useState, useEffect } from 'react';
import { useAuth } from '@/context/AuthContext';
import api from '@/lib/api';
import ProtectedRoute from '@/components/ProtectedRoute';
import { Loader2, User as UserIcon, Mail, Phone, CheckCircle2 } from 'lucide-react';

export default function ProfilePage() {
  const { user, syncUserWithBackend } = useAuth();
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [phoneNumber, setPhoneNumber] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState(false);

  useEffect(() => {
    if (user) {
      setName(user.name || '');
      setEmail(user.email || '');
      setPhoneNumber(user.phoneNumber || '');
    }
  }, [user]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setSuccess(false);
    setLoading(true);

    try {
      const res = await api.put('/users/profile', {
        name,
        email,
        phoneNumber,
      });

      if (res.data) {
        setSuccess(true);
        // Force sync user context with the updated token/data
        if (typeof window !== 'undefined') {
            const adminToken = localStorage.getItem('adminToken');
            if(!adminToken && (window as any).firebaseAuthToken) {
               // Normal sync logic, actually the AuthContext automatically listens to Firebase
               // But here we might just reload or assume the backend is updated.
            }
        }
      }
    } catch (err: any) {
      setError(err.response?.data?.message || 'Failed to update profile. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <ProtectedRoute>
      <div className="max-w-2xl mx-auto py-12 px-4 sm:px-6 lg:px-8">
        <div className="bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden">
          <div className="bg-gray-950 p-6 flex items-center gap-4 text-white">
            <div className="w-16 h-16 rounded-full bg-white text-gray-900 flex items-center justify-center text-2xl font-bold uppercase shadow-inner">
              {user?.name?.charAt(0) || 'U'}
            </div>
            <div>
              <h1 className="text-2xl font-bold">{user?.name || 'My Profile'}</h1>
              <p className="text-gray-400 text-sm">{user?.role === 'admin' ? 'Administrator' : user?.role === 'host' ? 'Host/Vendor' : 'Customer'}</p>
            </div>
          </div>

          <div className="p-8">
            <h2 className="text-lg font-bold text-gray-900 mb-6">Personal Information</h2>
            
            {success && (
              <div className="mb-6 flex items-center gap-3 p-4 bg-green-50 border border-green-200 rounded-xl text-green-700">
                <CheckCircle2 className="w-5 h-5 shrink-0" />
                <p className="font-medium">Profile updated successfully!</p>
              </div>
            )}

            {error && (
              <div className="mb-6 p-4 bg-red-50 border border-red-200 rounded-xl text-red-700 text-sm">
                {error}
              </div>
            )}

            <form onSubmit={handleSubmit} className="space-y-5">
              <div>
                <label className="text-sm font-medium text-gray-700 block mb-1">Full Name</label>
                <div className="relative">
                  <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                    <UserIcon className="h-5 w-5 text-gray-400" />
                  </div>
                  <input
                    type="text"
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                    required
                    className="pl-10 w-full px-4 py-3 rounded-xl border border-gray-200 focus:ring-2 focus:ring-brand-brown focus:border-transparent outline-none transition-all text-sm"
                  />
                </div>
              </div>

              <div>
                <label className="text-sm font-medium text-gray-700 block mb-1">Email Address</label>
                <div className="relative">
                  <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                    <Mail className="h-5 w-5 text-gray-400" />
                  </div>
                  <input
                    type="email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    required
                    disabled={user?.role === 'admin'}
                    className="pl-10 w-full px-4 py-3 rounded-xl border border-gray-200 focus:ring-2 focus:ring-brand-brown focus:border-transparent outline-none transition-all text-sm disabled:bg-gray-50 disabled:text-gray-500"
                  />
                </div>
                {user?.role === 'admin' && (
                  <p className="mt-1 text-xs text-gray-500">Admin email cannot be changed here.</p>
                )}
              </div>

              <div>
                <label className="text-sm font-medium text-gray-700 block mb-1">Phone Number</label>
                <div className="relative">
                  <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                    <Phone className="h-5 w-5 text-gray-400" />
                  </div>
                  <input
                    type="tel"
                    value={phoneNumber}
                    onChange={(e) => setPhoneNumber(e.target.value)}
                    placeholder="+91 "
                    className="pl-10 w-full px-4 py-3 rounded-xl border border-gray-200 focus:ring-2 focus:ring-brand-brown focus:border-transparent outline-none transition-all text-sm"
                  />
                </div>
              </div>

              <div className="pt-4 border-t border-gray-100">
                <button
                  type="submit"
                  disabled={loading}
                  className="px-6 py-3 bg-gray-900 text-white rounded-xl font-semibold hover:bg-gray-800 transition-colors flex items-center justify-center gap-2 disabled:opacity-60"
                >
                  {loading ? (
                    <>
                      <Loader2 className="w-4 h-4 animate-spin" />
                      Saving...
                    </>
                  ) : (
                    'Save Changes'
                  )}
                </button>
              </div>
            </form>
          </div>
        </div>
      </div>
    </ProtectedRoute>
  );
}
