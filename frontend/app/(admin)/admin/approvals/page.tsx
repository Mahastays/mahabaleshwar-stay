'use client';

import { useState, useEffect } from 'react';
import { CheckCircle2, XCircle, Loader2 } from 'lucide-react';
import Link from 'next/link';
import { useAuth } from '@/context/AuthContext';
import api from '@/lib/api';

interface PendingProperty {
  _id: string;
  title: string;
  type: string;
  location: string;
  price: number;
  host: { name: string; email: string } | string;
  createdAt: string;
  status: string;
}

interface PendingVendor {
  _id: string;
  user: { _id: string; name: string; email: string; phoneNumber: string };
  businessName: string;
  taxId: string;
  address: string;
  bankDetails?: {
    accountName: string;
    accountNumber: string;
    ifscCode: string;
    bankName: string;
  };
  status: string;
  createdAt: string;
}

export default function AdminApprovalsPage() {
  const { user, loading: authLoading } = useAuth();
  const [pendingProperties, setPendingProperties] = useState<PendingProperty[]>([]);
  const [pendingVendors, setPendingVendors] = useState<PendingVendor[]>([]);
  const [loading, setLoading] = useState(true);
  const [actionLoading, setActionLoading] = useState<string | null>(null);
  const [vendorActionLoading, setVendorActionLoading] = useState<string | null>(null);

  useEffect(() => {
    const fetchPending = async () => {
      if (!user || user.role !== 'admin') { setLoading(false); return; }
      try {
        const [propsRes, vendorsRes] = await Promise.all([
          api.get('/properties/admin/all'),
          api.get('/vendors/admin/requests').catch(() => ({ data: [] }))
        ]);
        
        // Filter only pending properties
        const pendingProps = propsRes.data.filter((p: PendingProperty) => p.status === 'pending');
        setPendingProperties(pendingProps);

        // Filter only pending vendors
        const pendingVends = vendorsRes.data.filter((v: PendingVendor) => v.status === 'pending');
        setPendingVendors(pendingVends);
      } catch (error) {
        console.warn('Error fetching pending items:', error);
      } finally {
        setLoading(false);
      }
    };
    if (!authLoading) fetchPending();
  }, [user, authLoading]);

  const handleAction = async (id: string, action: 'approve' | 'reject') => {
    if (!window.confirm(`Are you sure you want to ${action} this property?`)) return;
    setActionLoading(id);
    try {
      const newStatus = action === 'approve' ? 'approved' : 'rejected';
      await api.put(`/properties/${id}/status`, { status: newStatus });
      setPendingProperties(prev => prev.filter(p => p._id !== id));
    } catch (error) {
      console.warn(`Error ${action}ing property:`, error);
      alert(`Failed to ${action} property.`);
    } finally {
      setActionLoading(null);
    }
  };

  const handleVendorAction = async (id: string, action: 'approve' | 'reject') => {
    if (!window.confirm(`Are you sure you want to ${action} this vendor application?`)) return;
    setVendorActionLoading(id);
    try {
      const newStatus = action === 'approve' ? 'approved' : 'rejected';
      await api.put(`/vendors/admin/requests/${id}`, { status: newStatus });
      setPendingVendors(prev => prev.filter(v => v._id !== id));
    } catch (error) {
      console.warn(`Error ${action}ing vendor:`, error);
      alert(`Failed to ${action} vendor.`);
    } finally {
      setVendorActionLoading(null);
    }
  };

  const getHostName = (host: PendingProperty['host']) => {
    if (typeof host === 'string') return host;
    return host?.name || 'Unknown';
  };

  if (authLoading || loading) {
    return (
      <div className="flex items-center justify-center min-h-[60vh]">
        <Loader2 className="w-8 h-8 animate-spin text-gray-400" />
      </div>
    );
  }

  return (
    <div className="max-w-6xl mx-auto space-y-8">
      <div>
        <h2 className="text-2xl font-bold text-gray-900">Approvals Queue</h2>
        <p className="text-gray-500 text-sm mt-1">Review new vendor applications and property submissions.</p>
      </div>

      {/* Vendor Approvals Table */}
      <div className="bg-white border border-gray-200 rounded-2xl shadow-sm overflow-hidden">
        <div className="p-4 border-b border-gray-200 flex items-center justify-between">
          <h3 className="font-semibold text-gray-900">Pending Host Applications ({pendingVendors.length})</h3>
        </div>
        
        <div className="overflow-x-auto">
          <table className="w-full text-sm text-left">
            <thead className="bg-gray-50 border-b border-gray-200 text-gray-500 uppercase text-xs font-bold tracking-wider">
              <tr>
                <th className="px-6 py-4">User</th>
                <th className="px-6 py-4">Business Name</th>
                <th className="px-6 py-4">Tax ID / Bank</th>
                <th className="px-6 py-4">Submitted On</th>
                <th className="px-6 py-4 text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-200 text-gray-700">
              {pendingVendors.length > 0 ? pendingVendors.map((vendor) => (
                <tr key={vendor._id} className="hover:bg-gray-50 transition-colors">
                  <td className="px-6 py-4">
                    <p className="font-medium text-gray-900">{vendor.user?.name}</p>
                    <p className="text-xs text-gray-500">{vendor.user?.email}</p>
                  </td>
                  <td className="px-6 py-4 font-medium">{vendor.businessName}</td>
                  <td className="px-6 py-4">
                    <p className="font-medium text-gray-900">{vendor.taxId}</p>
                    {vendor.bankDetails && (
                      <div className="mt-1 text-xs text-gray-500">
                        <p>{vendor.bankDetails.bankName}</p>
                        <p>A/C: {vendor.bankDetails.accountNumber}</p>
                        <p>IFSC: {vendor.bankDetails.ifscCode}</p>
                      </div>
                    )}
                  </td>
                  <td className="px-6 py-4">{new Date(vendor.createdAt).toLocaleDateString()}</td>
                  <td className="px-6 py-4 text-right">
                    <div className="flex items-center justify-end gap-3">
                      <button 
                        onClick={() => handleVendorAction(vendor._id, 'approve')} 
                        disabled={vendorActionLoading === vendor._id}
                        className="text-gray-400 hover:text-green-600 transition-colors disabled:opacity-50" 
                        title="Approve Host"
                      >
                        {vendorActionLoading === vendor._id ? (
                          <Loader2 className="w-5 h-5 animate-spin" />
                        ) : (
                          <CheckCircle2 className="w-5 h-5" />
                        )}
                      </button>
                      <button 
                        onClick={() => handleVendorAction(vendor._id, 'reject')} 
                        disabled={vendorActionLoading === vendor._id}
                        className="text-gray-400 hover:text-red-600 transition-colors disabled:opacity-50" 
                        title="Reject Host"
                      >
                        <XCircle className="w-5 h-5" />
                      </button>
                    </div>
                  </td>
                </tr>
              )) : (
                <tr>
                  <td colSpan={5} className="px-6 py-8 text-center text-gray-500">
                    <p>No host applications pending approval right now.</p>
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>

      {/* Property Approvals Table */}
      <div className="bg-white border border-gray-200 rounded-2xl shadow-sm overflow-hidden">
        <div className="p-4 border-b border-gray-200 flex items-center justify-between">
          <h3 className="font-semibold text-gray-900">Pending Property Listings ({pendingProperties.length})</h3>
        </div>
        
        <div className="overflow-x-auto">
          <table className="w-full text-sm text-left">
            <thead className="bg-gray-50 border-b border-gray-200 text-gray-500 uppercase text-xs font-bold tracking-wider">
              <tr>
                <th className="px-6 py-4">Title</th>
                <th className="px-6 py-4">Host</th>
                <th className="px-6 py-4">Type</th>
                <th className="px-6 py-4">Price/Night</th>
                <th className="px-6 py-4">Submitted On</th>
                <th className="px-6 py-4 text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-200 text-gray-700">
              {pendingProperties.length > 0 ? pendingProperties.map((prop) => (
                <tr key={prop._id} className="hover:bg-gray-50 transition-colors">
                  <td className="px-6 py-4 font-medium text-gray-900">{prop.title}</td>
                  <td className="px-6 py-4">{getHostName(prop.host)}</td>
                  <td className="px-6 py-4">{prop.type}</td>
                  <td className="px-6 py-4">₹{prop.price.toLocaleString()}</td>
                  <td className="px-6 py-4">{new Date(prop.createdAt).toLocaleDateString()}</td>
                  <td className="px-6 py-4 text-right">
                    <div className="flex items-center justify-end gap-3">
                      <button 
                        onClick={() => handleAction(prop._id, 'approve')} 
                        disabled={actionLoading === prop._id}
                        className="text-gray-400 hover:text-green-600 transition-colors disabled:opacity-50" 
                        title="Approve Property"
                      >
                        {actionLoading === prop._id ? (
                          <Loader2 className="w-5 h-5 animate-spin" />
                        ) : (
                          <CheckCircle2 className="w-5 h-5" />
                        )}
                      </button>
                      <button 
                        onClick={() => handleAction(prop._id, 'reject')} 
                        disabled={actionLoading === prop._id}
                        className="text-gray-400 hover:text-red-600 transition-colors disabled:opacity-50" 
                        title="Reject Property"
                      >
                        <XCircle className="w-5 h-5" />
                      </button>
                      <Link href={`/properties/${prop._id}`} target="_blank" className="px-3 py-1.5 text-xs font-medium border border-gray-300 rounded-lg hover:bg-gray-100 transition-colors text-gray-700">
                        Review
                      </Link>
                    </div>
                  </td>
                </tr>
              )) : (
                <tr>
                  <td colSpan={6} className="px-6 py-8 text-center text-gray-500">
                    <p>No property listings pending approval right now.</p>
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
