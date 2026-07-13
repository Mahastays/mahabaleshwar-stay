'use client';

import { useState, useEffect } from 'react';
import { PlusCircle, Edit2, Trash2, Loader2 } from 'lucide-react';
import { useAuth } from '@/context/AuthContext';
import api from '@/lib/api';
import ExploreModal from '@/components/ExploreModal';

interface ExplorePlace {
  _id: string;
  name: string;
  tagline: string;
  description: string;
  history: string;
  images: string[];
  bestTime: string;
  thingsToDo: string[];
  category: string;
  entryFee: string;
  distance: string;
  isFeatured?: boolean;
}

export default function AdminExplorePage() {
  const { user, loading: authLoading } = useAuth();
  const [places, setPlaces] = useState<ExplorePlace[]>([]);
  const [loading, setLoading] = useState(true);
  const [actionLoading, setActionLoading] = useState<string | null>(null);

  // Modal state
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [selectedPlace, setSelectedPlace] = useState<ExplorePlace | null>(null);

  const fetchPlaces = async () => {
    try {
      setLoading(true);
      const res = await api.get('/explore');
      setPlaces(res.data);
    } catch (error) {
      console.error('Error fetching explore places:', error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (!authLoading && user?.role === 'admin') {
      fetchPlaces();
    } else if (!authLoading) {
      setLoading(false);
    }
  }, [user, authLoading]);

  const handleDelete = async (id: string) => {
    if (!window.confirm('Are you sure you want to delete this place?')) return;
    
    setActionLoading(id);
    try {
      await api.delete(`/explore/${id}/delete`);
      setPlaces((prev) => prev.filter((place) => place._id !== id));
    } catch (error) {
      console.error('Error deleting place:', error);
      alert('Failed to delete place');
    } finally {
      setActionLoading(null);
    }
  };

  const openAddModal = () => {
    setSelectedPlace(null);
    setIsModalOpen(true);
  };

  const openEditModal = (place: ExplorePlace) => {
    setSelectedPlace(place);
    setIsModalOpen(true);
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
    <div className="max-w-6xl mx-auto space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-2xl font-bold text-gray-900">Explore Places CMS</h2>
          <p className="text-gray-500 text-sm mt-1">Manage the tourist destinations shown on the Explore page.</p>
        </div>
        <button 
          onClick={openAddModal}
          className="flex items-center gap-2 px-4 py-2 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700 transition-colors"
        >
          <PlusCircle className="w-5 h-5" />
          <span>Add Place</span>
        </button>
      </div>

      <div className="bg-white border border-gray-200 rounded-2xl shadow-sm overflow-hidden">
        {places.length > 0 ? (
          <div className="overflow-x-auto">
            <table className="w-full text-sm text-left">
              <thead className="bg-gray-50 border-b border-gray-200 text-gray-500 uppercase text-xs font-bold tracking-wider">
                <tr>
                  <th className="px-6 py-4">Place Name</th>
                  <th className="px-6 py-4">Category</th>
                  <th className="px-6 py-4">Distance</th>
                  <th className="px-6 py-4 text-right">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-200 text-gray-700">
                {places.map((place) => (
                  <tr key={place._id} className="hover:bg-gray-50 transition-colors">
                    <td className="px-6 py-4 font-medium text-gray-900">{place.name}</td>
                    <td className="px-6 py-4">{place.category}</td>
                    <td className="px-6 py-4">{place.distance}</td>
                    <td className="px-6 py-4 text-right">
                      <div className="flex items-center justify-end gap-2">
                        <button 
                          onClick={() => openEditModal(place)}
                          className="p-1.5 text-gray-400 hover:text-indigo-600 transition-colors" 
                          title="Edit"
                        >
                          <Edit2 className="w-4 h-4" />
                        </button>
                        <button 
                          onClick={() => handleDelete(place._id)}
                          disabled={actionLoading === place._id}
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
            <p>No explore places added yet.</p>
          </div>
        )}
      </div>

      <ExploreModal 
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        place={selectedPlace}
        onSuccess={fetchPlaces}
      />
    </div>
  );
}
