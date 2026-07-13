'use client';

import { useState, useEffect } from 'react';
import { Search, Eye, Trash2, Loader2 } from 'lucide-react';
import Link from 'next/link';
import { useAuth } from '@/context/AuthContext';
import api from '@/lib/api';

interface Property {
  _id: string;
  title: string;
  type: string;
  host: { name: string; email: string } | string;
  price: number;
  status: 'approved' | 'pending' | 'rejected';
}

export default function AdminPropertiesPage() {
  const { user, loading: authLoading } = useAuth();
  const [properties, setProperties] = useState<Property[]>([]);
  const [search, setSearch] = useState('');
  const [loading, setLoading] = useState(true);
  const [deleteLoading, setDeleteLoading] = useState<string | null>(null);

  useEffect(() => {
    const fetchProperties = async () => {
      if (!user || user.role !== 'admin') { setLoading(false); return; }
      try {
        const res = await api.get('/properties/admin/all');
        setProperties(res.data);
      } catch (error) {
        console.error('Error fetching properties:', error);
      } finally {
        setLoading(false);
      }
    };
    if (!authLoading) fetchProperties();
  }, [user, authLoading]);

  const handleDelete = async (id: string, title: string) => {
    if (!window.confirm(`Are you sure you want to permanently delete "${title}"? This cannot be undone.`)) return;
    setDeleteLoading(id);
    try {
      await api.delete(`/properties/${id}`);
      setProperties(prev => prev.filter(p => p._id !== id));
    } catch (error) {
      console.error('Error deleting property:', error);
      alert('Failed to delete property.');
    } finally {
      setDeleteLoading(null);
    }
  };

  const getHostName = (host: Property['host']) => {
    if (typeof host === 'string') return host;
    return host?.name || 'Unknown';
  };

  const filteredProperties = properties.filter(p =>
    p.title.toLowerCase().includes(search.toLowerCase()) ||
    getHostName(p.host).toLowerCase().includes(search.toLowerCase())
  );

  if (authLoading || loading) {
    return (
      <div className="flex items-center justify-center min-h-[60vh]">
        <Loader2 className="w-8 h-8 animate-spin text-gray-400" />
      </div>
    );
  }

  return (
    <div className="max-w-6xl mx-auto space-y-6">
      <div>
        <h2 className="text-2xl font-bold text-gray-900">All Properties</h2>
        <p className="text-gray-500 text-sm mt-1">Global view of all properties listed on the platform.</p>
      </div>

      <div className="bg-white border border-gray-200 rounded-2xl shadow-sm overflow-hidden">
        <div className="p-4 border-b border-gray-200">
          <div className="relative w-full max-w-sm">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
            <input 
              type="text" 
              placeholder="Search by title or host..." 
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="w-full pl-10 pr-4 py-2 bg-gray-50 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-500 transition-all text-sm"
            />
          </div>
        </div>
        
        <div className="overflow-x-auto">
          <table className="w-full text-sm text-left">
            <thead className="bg-gray-50 border-b border-gray-200 text-gray-500 uppercase text-xs font-bold tracking-wider">
              <tr>
                <th className="px-6 py-4">Title</th>
                <th className="px-6 py-4">Host</th>
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
                  <td className="px-6 py-4">{getHostName(prop.host)}</td>
                  <td className="px-6 py-4">{prop.type}</td>
                  <td className="px-6 py-4">₹{prop.price.toLocaleString()}</td>
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
                    <div className="flex items-center justify-end gap-2">
                      <Link href={`/properties/${prop._id}`} className="p-1.5 text-gray-400 hover:text-indigo-600 transition-colors" title="View Property">
                        <Eye className="w-4 h-4" />
                      </Link>
                      <button 
                        onClick={() => handleDelete(prop._id, prop.title)}
                        disabled={deleteLoading === prop._id}
                        className="p-1.5 text-red-400 hover:text-red-600 transition-colors disabled:opacity-50" 
                        title="Delete Property"
                      >
                        {deleteLoading === prop._id ? (
                          <Loader2 className="w-4 h-4 animate-spin" />
                        ) : (
                          <Trash2 className="w-4 h-4" />
                        )}
                      </button>
                    </div>
                  </td>
                </tr>
              )) : (
                <tr>
                  <td colSpan={6} className="px-6 py-8 text-center text-gray-500">
                    No properties found matching your search.
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
