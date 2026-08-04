'use client';

import { useState, useEffect } from 'react';
import { PlusCircle, Search, Edit2, Trash2, Loader2, AlertCircle } from 'lucide-react';
import Link from 'next/link';
import api from '@/lib/api';
import { useAuth } from '@/context/AuthContext';

interface Property {
  _id: string;
  title: string;
  type: string;
  price: number;
  status: 'approved' | 'pending' | 'rejected' | string;
}

export default function VendorPropertiesPage() {
  const { user, loading: authLoading } = useAuth();
  const [properties, setProperties] = useState<Property[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [search, setSearch] = useState('');

  useEffect(() => {
    const fetchProperties = async () => {
      if (!user) return;
      try {
        setLoading(true);
        const res = await api.get('/properties/host');
        setProperties(res.data);
      } catch (err: any) {
        console.error('Error fetching properties:', err);
        setError(err.response?.data?.message || 'Failed to fetch your properties');
      } finally {
        setLoading(false);
      }
    };

    if (!authLoading) {
      fetchProperties();
    }
  }, [user, authLoading]);

  const filteredProperties = properties.filter(p => 
    p.title.toLowerCase().includes(search.toLowerCase())
  );

  const handleDelete = async (id: string) => {
    if (window.confirm('Are you sure you want to delete this property? This action cannot be undone.')) {
      try {
        await api.delete(`/properties/${id}`);
        setProperties(properties.filter(p => p._id !== id));
        alert('Property deleted successfully');
      } catch (err: any) {
        console.error('Error deleting property:', err);
        alert('Failed to delete property. Please try again.');
      }
    }
  };

  if (authLoading || loading) {
    return (
      <div className="flex items-center justify-center min-h-[50vh]">
        <Loader2 className="w-8 h-8 animate-spin text-gray-400" />
      </div>
    );
  }

  return (
    <div className="max-w-6xl mx-auto space-y-6">
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h2 className="text-2xl font-bold text-gray-900">My Properties</h2>
          <p className="text-gray-500 text-sm mt-1">Manage your listings, edit property details, and track their approval status.</p>
        </div>
        <Link 
          href="/vendor/properties/add" 
          className="flex items-center gap-2 px-4 py-2 bg-gray-900 text-white rounded-lg hover:bg-gray-800 transition-colors shadow-sm"
        >
          <PlusCircle className="w-5 h-5" />
          <span>Add New Property</span>
        </Link>
      </div>

      {error && (
        <div className="p-4 bg-red-50 border border-red-200 text-red-700 rounded-xl flex items-center gap-3 text-sm">
          <AlertCircle className="w-5 h-5 flex-shrink-0" />
          <span>{error}</span>
        </div>
      )}

      <div className="bg-white border border-gray-200 rounded-2xl shadow-sm overflow-hidden">
        <div className="p-4 border-b border-gray-200 flex items-center justify-between">
          <div className="relative w-full max-w-sm">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
            <input 
              type="text" 
              placeholder="Search properties..." 
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="w-full pl-10 pr-4 py-2 bg-gray-50 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-gray-900/20 focus:border-gray-900 transition-all text-sm"
            />
          </div>
        </div>
        
        <div className="overflow-x-auto">
          <table className="w-full text-sm text-left">
            <thead className="bg-gray-50 border-b border-gray-200 text-gray-500 uppercase text-xs font-bold tracking-wider">
              <tr>
                <th className="px-6 py-4">Title</th>
                <th className="px-6 py-4">Type</th>
                <th className="px-6 py-4">Price/Night</th>
                <th className="px-6 py-4">Status</th>
                <th className="px-6 py-4 text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-200 text-gray-700">
              {filteredProperties.length > 0 ? filteredProperties.map((prop) => (
                <tr key={prop._id} className="hover:bg-gray-50 transition-colors">
                  <td className="px-6 py-4 font-medium text-gray-900">{prop.title}</td>
                  <td className="px-6 py-4">{prop.type || 'N/A'}</td>
                  <td className="px-6 py-4">₹{prop.price ? prop.price.toLocaleString() : '0'}</td>
                  <td className="px-6 py-4">
                    <span className={`px-2.5 py-1 rounded-full text-[10px] font-bold uppercase tracking-wider ${
                      prop.status === 'approved' ? 'bg-green-100 text-green-700' :
                      prop.status === 'pending' ? 'bg-yellow-100 text-yellow-700' :
                      'bg-red-100 text-red-700'
                    }`}>
                      {prop.status}
                    </span>
                  </td>
                  <td className="px-6 py-4 text-right">
                    <div className="flex items-center justify-end gap-3">
                      <Link 
                        href={`/vendor/properties/${prop._id}/edit`}
                        className="p-1.5 text-gray-500 hover:text-gray-900 transition-colors border border-gray-200 rounded-lg flex items-center gap-1 text-xs px-2.5 py-1.5" 
                        title="Edit Property"
                      >
                        <Edit2 className="w-3.5 h-3.5" />
                        <span>Edit</span>
                      </Link>
                      <button 
                        onClick={() => handleDelete(prop._id)}
                        className="p-1.5 text-red-500 hover:text-white hover:bg-red-500 transition-colors border border-red-200 hover:border-red-500 rounded-lg flex items-center gap-1 text-xs px-2.5 py-1.5" 
                        title="Delete Property"
                      >
                        <Trash2 className="w-3.5 h-3.5" />
                        <span>Delete</span>
                      </button>
                    </div>
                  </td>
                </tr>
              )) : (
                <tr>
                  <td colSpan={5} className="px-6 py-8 text-center text-gray-500">
                    {search ? 'No properties found matching your search.' : 'You have not added any properties yet.'}
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

