'use client';

import { useState, useEffect } from 'react';
import { Users, Banknote, Home, ArrowUpRight, CheckCircle2, XCircle, Loader2, Eye } from "lucide-react";
import { useAuth } from "@/context/AuthContext";
import api from "@/lib/api";
import Link from "next/link";

interface PendingProperty {
  _id: string;
  title: string;
  type: string;
  location: string;
  price: number;
  host: { name: string; email: string } | string;
  createdAt: string;
  status: string;
  images: string[];
  isFeatured?: boolean;
}

export default function AdminDashboard() {
  const { user, loading: authLoading } = useAuth();
  const [pendingProperties, setPendingProperties] = useState<PendingProperty[]>([]);
  const [loading, setLoading] = useState(true);
  const [actionLoading, setActionLoading] = useState<string | null>(null);

  useEffect(() => {
    const fetchPending = async () => {
      if (!user || user.role !== 'admin') { setLoading(false); return; }
      try {
        const res = await api.get('/properties/admin/all');
        setPendingProperties(res.data);
      } catch (error) {
        console.warn('Error fetching admin data:', error);
      } finally {
        setLoading(false);
      }
    };
    if (!authLoading) fetchPending();
  }, [user, authLoading]);

  const handleStatusUpdate = async (propertyId: string, newStatus: string) => {
    setActionLoading(propertyId);
    try {
      await api.put(`/properties/${propertyId}/status`, { status: newStatus });
      setPendingProperties(prev =>
        prev.map(p => p._id === propertyId ? { ...p, status: newStatus } : p)
      );
    } catch (error) {
      console.warn('Error updating property status:', error);
      alert('Failed to update property status');
    } finally {
      setActionLoading(null);
    }
  };

  const handleToggleFeatured = async (propertyId: string) => {
    setActionLoading(propertyId + '-featured');
    try {
      const res = await api.put(`/properties/${propertyId}/featured`);
      const updatedProp = res.data;
      setPendingProperties(prev =>
        prev.map(p => p._id === propertyId ? { ...p, isFeatured: updatedProp.isFeatured } : p)
      );
    } catch (error) {
      console.warn('Error toggling featured status:', error);
      alert('Failed to toggle featured status');
    } finally {
      setActionLoading(null);
    }
  };

  if (authLoading || loading) {
    return (
      <div className="flex items-center justify-center min-h-[60vh]">
        <Loader2 className="w-8 h-8 animate-spin text-gray-400" />
      </div>
    );
  }

  if (!user || user.role !== 'admin') {
    return (
      <div className="flex flex-col items-center justify-center min-h-[60vh] gap-4">
        <p className="text-gray-500 text-lg">Access Denied. Admin privileges required.</p>
        <Link href="/login" className="px-6 py-2 bg-gray-900 text-white rounded-lg font-medium hover:bg-gray-800 transition-colors">Login</Link>
      </div>
    );
  }

  const pending = pendingProperties.filter(p => p.status === 'pending');
  const approved = pendingProperties.filter(p => p.status === 'approved');
  const rejected = pendingProperties.filter(p => p.status === 'rejected');

  return (
    <div className="max-w-6xl mx-auto space-y-8">
      {/* Platform Stats Area */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <div className="bg-white p-6 rounded-2xl border border-gray-200 shadow-sm relative overflow-hidden">
          <div className="absolute top-0 right-0 p-6 opacity-5">
            <Home className="w-24 h-24" />
          </div>
          <p className="text-sm font-medium text-gray-500 mb-2">Total Properties</p>
          <h3 className="text-3xl font-bold text-gray-900 mb-4">{pendingProperties.length}</h3>
          <div className="flex items-center gap-2 text-sm">
            <span className="flex items-center text-green-600 font-medium">
              {approved.length} approved
            </span>
          </div>
        </div>
        
        <div className="bg-white p-6 rounded-2xl border border-gray-200 shadow-sm relative overflow-hidden">
          <div className="absolute top-0 right-0 p-6 opacity-5">
            <Users className="w-24 h-24" />
          </div>
          <p className="text-sm font-medium text-gray-500 mb-2">Pending Approvals</p>
          <h3 className="text-3xl font-bold text-gray-900 mb-4">{pending.length}</h3>
          <div className="flex items-center gap-2 text-sm">
            <span className="text-orange-600 font-medium">Needs review</span>
          </div>
        </div>

        <div className="bg-white p-6 rounded-2xl border border-gray-200 shadow-sm relative overflow-hidden">
          <div className="absolute top-0 right-0 p-6 opacity-5">
            <Banknote className="w-24 h-24" />
          </div>
          <p className="text-sm font-medium text-gray-500 mb-2">Rejected</p>
          <h3 className="text-3xl font-bold text-gray-900 mb-4">{rejected.length}</h3>
          <div className="flex items-center gap-2 text-sm">
            <span className="text-red-600 font-medium">Properties rejected</span>
          </div>
        </div>
      </div>

      {/* Pending Approvals Area */}
      <div className="bg-white border border-gray-200 rounded-2xl shadow-sm overflow-hidden">
        <div className="px-6 py-5 border-b border-gray-200 flex items-center justify-between mt-2">
          <div>
            <h3 className="text-lg font-semibold text-gray-900">Pending Property Approvals</h3>
            <p className="text-sm text-gray-500 mt-1">Properties waiting for your review before going live.</p>
          </div>
          {pending.length > 0 && (
            <span className="bg-orange-100 text-orange-700 px-3 py-1 rounded-full text-xs font-bold tracking-wider uppercase">
              {pending.length} Pending
            </span>
          )}
        </div>
        {pending.length > 0 ? (
          <div className="overflow-x-auto">
            <table className="w-full text-sm text-left">
              <thead className="bg-gray-50 border-b border-gray-200 text-gray-500 uppercase text-xs font-bold tracking-wider">
                <tr>
                  <th className="px-6 py-4">Property Name</th>
                  <th className="px-6 py-4">Type</th>
                  <th className="px-6 py-4">Location</th>
                  <th className="px-6 py-4">Price/Night</th>
                  <th className="px-6 py-4">Submitted On</th>
                  <th className="px-6 py-4 text-right">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-200 text-gray-700">
                {pending.map((prop) => (
                  <tr key={prop._id} className="hover:bg-gray-50 transition-colors">
                    <td className="px-6 py-4 font-medium text-gray-900">{prop.title}</td>
                    <td className="px-6 py-4">{prop.type}</td>
                    <td className="px-6 py-4">{prop.location}</td>
                    <td className="px-6 py-4">₹{prop.price.toLocaleString()}</td>
                    <td className="px-6 py-4">{new Date(prop.createdAt).toLocaleDateString()}</td>
                    <td className="px-6 py-4">
                      <div className="flex items-center justify-end gap-3">
                        <button
                          onClick={() => handleStatusUpdate(prop._id, 'approved')}
                          disabled={actionLoading === prop._id}
                          className="text-gray-500 hover:text-green-600 transition-colors disabled:opacity-50"
                          title="Approve"
                        >
                          <CheckCircle2 className="w-6 h-6" />
                        </button>
                        <button
                          onClick={() => handleStatusUpdate(prop._id, 'rejected')}
                          disabled={actionLoading === prop._id}
                          className="text-gray-500 hover:text-red-600 transition-colors disabled:opacity-50"
                          title="Reject"
                        >
                          <XCircle className="w-6 h-6" />
                        </button>
                        <Link
                          href={`/properties/${prop._id}`}
                          className="px-3 py-1.5 text-xs font-medium border border-gray-300 rounded-lg hover:bg-gray-100 transition-colors"
                        >
                          Review
                        </Link>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        ) : (
          <div className="p-10 text-center text-gray-500">
            <CheckCircle2 className="w-10 h-10 mx-auto mb-3 text-green-400" />
            <p className="font-medium">All caught up! No properties pending review.</p>
          </div>
        )}
      </div>

      {/* All Approved Properties */}
      <div className="bg-white border border-gray-200 rounded-2xl shadow-sm overflow-hidden">
        <div className="px-6 py-5 border-b border-gray-200">
          <h3 className="text-lg font-semibold text-gray-900">Approved Properties ({approved.length})</h3>
        </div>
        {approved.length > 0 ? (
          <div className="overflow-x-auto">
            <table className="w-full text-sm text-left">
              <thead className="bg-gray-50 border-b border-gray-200 text-gray-500 uppercase text-xs font-bold tracking-wider">
                <tr>
                  <th className="px-6 py-4">Property Name</th>
                  <th className="px-6 py-4">Type</th>
                  <th className="px-6 py-4">Location</th>
                  <th className="px-6 py-4">Price/Night</th>
                  <th className="px-6 py-4">Status</th>
                  <th className="px-6 py-4 text-right">Featured</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-200 text-gray-700">
                {approved.map((prop) => (
                  <tr key={prop._id} className="hover:bg-gray-50 transition-colors">
                    <td className="px-6 py-4 font-medium text-gray-900">{prop.title}</td>
                    <td className="px-6 py-4">{prop.type}</td>
                    <td className="px-6 py-4">{prop.location}</td>
                    <td className="px-6 py-4">₹{prop.price.toLocaleString()}</td>
                    <td className="px-6 py-4">
                      <span className="bg-green-100 text-green-700 px-2.5 py-1 rounded-full text-[10px] font-bold uppercase tracking-wider">
                        Approved
                      </span>
                    </td>
                    <td className="px-6 py-4 text-right">
                      <button
                        onClick={() => handleToggleFeatured(prop._id)}
                        disabled={actionLoading === prop._id + '-featured'}
                        className={`relative inline-flex h-6 w-11 items-center rounded-full transition-colors ${
                          prop.isFeatured ? 'bg-brand-red' : 'bg-gray-300'
                        }`}
                      >
                        <span
                          className={`inline-block h-4 w-4 transform rounded-full bg-white transition-transform ${
                            prop.isFeatured ? 'translate-x-6' : 'translate-x-1'
                          }`}
                        />
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        ) : (
          <div className="p-10 text-center text-gray-500">
            <p>No approved properties yet.</p>
          </div>
        )}
      </div>
    </div>
  );
}
