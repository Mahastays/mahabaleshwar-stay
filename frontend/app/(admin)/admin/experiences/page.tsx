'use client';

import { useState, useEffect } from 'react';
import { PlusCircle, Edit2, Trash2, CheckCircle2, XCircle, Loader2 } from 'lucide-react';
import { useAuth } from '@/context/AuthContext';
import api from '@/lib/api';
import ExperienceModal from '@/components/ExperienceModal';

interface Experience {
  _id: string;
  title: string;
  location: string;
  image: string;
  price: number;
  duration: string;
  status: string;
  user?: { name: string; email: string };
}

export default function AdminExperiencesPage() {
  const { user, loading: authLoading } = useAuth();
  const [experiences, setExperiences] = useState<Experience[]>([]);
  const [loading, setLoading] = useState(true);
  const [actionLoading, setActionLoading] = useState<string | null>(null);

  // Modal state
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [selectedExperience, setSelectedExperience] = useState<Experience | null>(null);

  const fetchExperiences = async () => {
    try {
      setLoading(true);
      const res = await api.get('/experiences/admin/all');
      setExperiences(res.data);
    } catch (error) {
      console.warn('Error fetching experiences:', error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (!authLoading && user?.role === 'admin') {
      fetchExperiences();
    } else if (!authLoading) {
      setLoading(false);
    }
  }, [user, authLoading]);

  const handleStatusUpdate = async (id: string, newStatus: string) => {
    setActionLoading(id);
    try {
      await api.put(`/experiences/${id}/status`, { status: newStatus });
      setExperiences((prev) =>
        prev.map((exp) => (exp._id === id ? { ...exp, status: newStatus } : exp))
      );
    } catch (error) {
      console.warn('Error updating status:', error);
      alert('Failed to update status');
    } finally {
      setActionLoading(null);
    }
  };

  const handleDelete = async (id: string) => {
    if (!window.confirm('Are you sure you want to delete this experience?')) return;
    
    setActionLoading(id);
    try {
      await api.delete(`/experiences/${id}`);
      setExperiences((prev) => prev.filter((exp) => exp._id !== id));
    } catch (error) {
      console.warn('Error deleting experience:', error);
      alert('Failed to delete experience');
    } finally {
      setActionLoading(null);
    }
  };

  const openAddModal = () => {
    setSelectedExperience(null);
    setIsModalOpen(true);
  };

  const openEditModal = (exp: Experience) => {
    setSelectedExperience(exp);
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

  const pending = experiences.filter((e) => e.status === 'pending');
  const approved = experiences.filter((e) => e.status === 'approved');

  return (
    <div className="max-w-6xl mx-auto space-y-8">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-2xl font-bold text-gray-900">Experiences CMS</h2>
          <p className="text-gray-500 text-sm mt-1">Manage all activities and experiences offered to guests.</p>
        </div>
        <button 
          onClick={openAddModal}
          className="flex items-center gap-2 px-4 py-2 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700 transition-colors"
        >
          <PlusCircle className="w-5 h-5" />
          <span>Add Experience</span>
        </button>
      </div>

      {/* Pending Approvals */}
      <div className="bg-white border border-gray-200 rounded-2xl shadow-sm overflow-hidden">
        <div className="px-6 py-5 border-b border-gray-200 flex items-center justify-between mt-2">
          <div>
            <h3 className="text-lg font-semibold text-gray-900">Pending Experiences</h3>
            <p className="text-sm text-gray-500 mt-1">Experiences waiting for your review.</p>
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
                  <th className="px-6 py-4">Title</th>
                  <th className="px-6 py-4">Location</th>
                  <th className="px-6 py-4">Duration</th>
                  <th className="px-6 py-4">Price</th>
                  <th className="px-6 py-4 text-right">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-200 text-gray-700">
                {pending.map((exp) => (
                  <tr key={exp._id} className="hover:bg-gray-50 transition-colors">
                    <td className="px-6 py-4 font-medium text-gray-900">{exp.title}</td>
                    <td className="px-6 py-4">{exp.location}</td>
                    <td className="px-6 py-4">{exp.duration}</td>
                    <td className="px-6 py-4">₹{exp.price}</td>
                    <td className="px-6 py-4">
                      <div className="flex items-center justify-end gap-3">
                        <button
                          onClick={() => handleStatusUpdate(exp._id, 'approved')}
                          disabled={actionLoading === exp._id}
                          className="text-gray-500 hover:text-green-600 transition-colors disabled:opacity-50"
                          title="Approve"
                        >
                          <CheckCircle2 className="w-6 h-6" />
                        </button>
                        <button
                          onClick={() => handleStatusUpdate(exp._id, 'rejected')}
                          disabled={actionLoading === exp._id}
                          className="text-gray-500 hover:text-red-600 transition-colors disabled:opacity-50"
                          title="Reject"
                        >
                          <XCircle className="w-6 h-6" />
                        </button>
                        <button 
                          onClick={() => openEditModal(exp)}
                          className="p-1.5 text-gray-400 hover:text-indigo-600 transition-colors" 
                          title="Edit"
                        >
                          <Edit2 className="w-4 h-4" />
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
            <CheckCircle2 className="w-10 h-10 mx-auto mb-3 text-green-400" />
            <p className="font-medium">No experiences pending review.</p>
          </div>
        )}
      </div>

      {/* Approved Experiences */}
      <div className="bg-white border border-gray-200 rounded-2xl shadow-sm overflow-hidden">
        <div className="px-6 py-5 border-b border-gray-200">
          <h3 className="text-lg font-semibold text-gray-900">Approved Experiences ({approved.length})</h3>
        </div>
        {approved.length > 0 ? (
          <div className="overflow-x-auto">
            <table className="w-full text-sm text-left">
              <thead className="bg-gray-50 border-b border-gray-200 text-gray-500 uppercase text-xs font-bold tracking-wider">
                <tr>
                  <th className="px-6 py-4">Title</th>
                  <th className="px-6 py-4">Location</th>
                  <th className="px-6 py-4">Duration</th>
                  <th className="px-6 py-4">Price</th>
                  <th className="px-6 py-4 text-right">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-200 text-gray-700">
                {approved.map((exp) => (
                  <tr key={exp._id} className="hover:bg-gray-50 transition-colors">
                    <td className="px-6 py-4 font-medium text-gray-900">{exp.title}</td>
                    <td className="px-6 py-4">{exp.location}</td>
                    <td className="px-6 py-4">{exp.duration}</td>
                    <td className="px-6 py-4">₹{exp.price}</td>
                    <td className="px-6 py-4 text-right">
                      <div className="flex items-center justify-end gap-2">
                        <button 
                          onClick={() => openEditModal(exp)}
                          className="p-1.5 text-gray-400 hover:text-indigo-600 transition-colors" 
                          title="Edit"
                        >
                          <Edit2 className="w-4 h-4" />
                        </button>
                        <button 
                          onClick={() => handleDelete(exp._id)}
                          disabled={actionLoading === exp._id}
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
            <p>No approved experiences yet.</p>
          </div>
        )}
      </div>

      <ExperienceModal 
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        experience={selectedExperience}
        onSuccess={fetchExperiences}
      />
    </div>
  );
}
