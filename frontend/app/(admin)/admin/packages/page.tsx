'use client';

import { useState, useEffect } from 'react';
import { PlusCircle, Edit2, Trash2, Loader2, Package as PackageIcon } from 'lucide-react';
import { useAuth } from '@/context/AuthContext';
import api from '@/lib/api';

interface Package {
  _id: string;
  title: string;
  description: string;
  price: number;
  duration: string;
  isActive: boolean;
  isFeatured: boolean;
  images: string[];
}

export default function AdminPackagesPage() {
  const { user, loading: authLoading } = useAuth();
  const [packages, setPackages] = useState<Package[]>([]);
  const [loading, setLoading] = useState(true);
  const [actionLoading, setActionLoading] = useState<string | null>(null);
  
  // Basic form state for MVP
  const [isFormOpen, setIsFormOpen] = useState(false);
  const [formData, setFormData] = useState({
    title: '',
    description: '',
    price: '',
    duration: '',
    images: '',
    properties: '',
    experiences: ''
  });

  const fetchPackages = async () => {
    try {
      setLoading(true);
      const res = await api.get('/packages');
      setPackages(res.data);
    } catch (error) {
      console.warn('Error fetching packages:', error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (!authLoading && user?.role === 'admin') {
      fetchPackages();
    } else if (!authLoading) {
      setLoading(false);
    }
  }, [user, authLoading]);

  const handleDelete = async (id: string) => {
    if (!window.confirm('Are you sure you want to delete this package?')) return;
    
    setActionLoading(id);
    try {
      await api.delete(`/packages/${id}`);
      setPackages((prev) => prev.filter((p) => p._id !== id));
    } catch (error) {
      console.warn('Error deleting package:', error);
      alert('Failed to delete package');
    } finally {
      setActionLoading(null);
    }
  };

  const handleCreate = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      const payload = {
        ...formData,
        price: Number(formData.price),
        images: formData.images.split(',').map(i => i.trim()).filter(Boolean),
        properties: formData.properties.split(',').map(i => i.trim()).filter(Boolean),
        experiences: formData.experiences.split(',').map(i => i.trim()).filter(Boolean),
      };
      await api.post('/packages', payload);
      setIsFormOpen(false);
      setFormData({ title: '', description: '', price: '', duration: '', images: '', properties: '', experiences: '' });
      fetchPackages();
    } catch (error) {
      console.error(error);
      alert('Error creating package. Make sure property and experience IDs are valid.');
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
    return <div className="text-center p-10 text-gray-500">Access Denied.</div>;
  }

  return (
    <div className="max-w-6xl mx-auto space-y-8">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-2xl font-bold text-gray-900">Packages CMS</h2>
          <p className="text-gray-500 text-sm mt-1">Manage all combo packages (Hotels + Activities).</p>
        </div>
        <button 
          onClick={() => setIsFormOpen(!isFormOpen)}
          className="flex items-center gap-2 px-4 py-2 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700 transition-colors"
        >
          {isFormOpen ? 'Close Form' : <><PlusCircle className="w-5 h-5" /><span>Add Package</span></>}
        </button>
      </div>

      {isFormOpen && (
        <div className="bg-white p-6 rounded-2xl shadow-sm border border-gray-200">
          <h3 className="text-lg font-bold mb-4">Create New Package</h3>
          <form onSubmit={handleCreate} className="space-y-4">
            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700">Title</label>
                <input required type="text" value={formData.title} onChange={e => setFormData({...formData, title: e.target.value})} className="mt-1 w-full border border-gray-300 rounded-md p-2" />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700">Price (₹)</label>
                <input required type="number" value={formData.price} onChange={e => setFormData({...formData, price: e.target.value})} className="mt-1 w-full border border-gray-300 rounded-md p-2" />
              </div>
              <div className="col-span-2">
                <label className="block text-sm font-medium text-gray-700">Description</label>
                <textarea required value={formData.description} onChange={e => setFormData({...formData, description: e.target.value})} className="mt-1 w-full border border-gray-300 rounded-md p-2" />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700">Duration (e.g. 2 Days, 1 Night)</label>
                <input required type="text" value={formData.duration} onChange={e => setFormData({...formData, duration: e.target.value})} className="mt-1 w-full border border-gray-300 rounded-md p-2" />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700">Image URLs (comma separated)</label>
                <input required type="text" value={formData.images} onChange={e => setFormData({...formData, images: e.target.value})} className="mt-1 w-full border border-gray-300 rounded-md p-2" />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700">Property IDs (comma separated)</label>
                <input type="text" value={formData.properties} onChange={e => setFormData({...formData, properties: e.target.value})} className="mt-1 w-full border border-gray-300 rounded-md p-2" placeholder="e.g. 64abc123..." />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700">Experience IDs (comma separated)</label>
                <input type="text" value={formData.experiences} onChange={e => setFormData({...formData, experiences: e.target.value})} className="mt-1 w-full border border-gray-300 rounded-md p-2" placeholder="e.g. 64def456..." />
              </div>
            </div>
            <button type="submit" className="w-full bg-brand-red text-white py-2 rounded-lg font-bold hover:bg-red-600">Save Package</button>
          </form>
        </div>
      )}

      {/* Packages List */}
      <div className="bg-white border border-gray-200 rounded-2xl shadow-sm overflow-hidden">
        <div className="px-6 py-5 border-b border-gray-200">
          <h3 className="text-lg font-semibold text-gray-900">All Packages ({packages.length})</h3>
        </div>
        {packages.length > 0 ? (
          <div className="overflow-x-auto">
            <table className="w-full text-sm text-left">
              <thead className="bg-gray-50 border-b border-gray-200 text-gray-500 uppercase text-xs font-bold tracking-wider">
                <tr>
                  <th className="px-6 py-4">Title</th>
                  <th className="px-6 py-4">Duration</th>
                  <th className="px-6 py-4">Price</th>
                  <th className="px-6 py-4 text-right">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-200 text-gray-700">
                {packages.map((pkg) => (
                  <tr key={pkg._id} className="hover:bg-gray-50 transition-colors">
                    <td className="px-6 py-4 font-medium text-gray-900">{pkg.title}</td>
                    <td className="px-6 py-4">{pkg.duration}</td>
                    <td className="px-6 py-4">₹{pkg.price}</td>
                    <td className="px-6 py-4 text-right">
                      <div className="flex items-center justify-end gap-2">
                        <button 
                          onClick={() => handleDelete(pkg._id)}
                          disabled={actionLoading === pkg._id}
                          className="p-1.5 text-red-400 hover:text-red-600 transition-colors disabled:opacity-50" 
                          title="Delete"
                        >
                          <Trash2 className="w-4 h-4" />
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        ) : (
          <div className="p-10 text-center text-gray-500">
            <PackageIcon className="w-10 h-10 mx-auto mb-3 text-gray-300" />
            <p>No packages created yet.</p>
          </div>
        )}
      </div>
    </div>
  );
}
