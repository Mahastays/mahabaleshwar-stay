'use client';

import { ChevronLeft, ChevronRight, Edit3, Trash2, Plus, X } from 'lucide-react';
import Link from 'next/link';
import { useEffect, useState } from 'react';
import api from '../lib/api';
import { useAuth } from '../context/AuthContext';

interface Story {
  _id: string;
  image: string;
  category: string;
  title: string;
  excerpt: string;
  content?: string;
}

export default function BlogSection() {
  const { user } = useAuth();
  const [stories, setStories] = useState<Story[]>([]);
  const [loading, setLoading] = useState(true);

  // Admin Modal State
  const [modalOpen, setModalOpen] = useState(false);
  const [editingId, setEditingId] = useState<string | null>(null);
  const [formData, setFormData] = useState({
    title: '',
    category: 'TOURIST SPOTS',
    image: 'https://images.unsplash.com/photo-1623862660144-88001712a2aa?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80',
    excerpt: '',
  });
  const [saving, setSaving] = useState(false);

  const fetchStories = async () => {
    try {
      setLoading(true);
      const res = await api.get('/stories');
      setStories(res.data);
    } catch (err) {
      console.error('Failed to fetch stories:', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchStories();
  }, []);

  const handleOpenAddModal = () => {
    setEditingId(null);
    setFormData({
      title: '',
      category: 'TOURIST SPOTS',
      image: 'https://images.unsplash.com/photo-1623862660144-88001712a2aa?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80',
      excerpt: '',
    });
    setModalOpen(true);
  };

  const handleOpenEditModal = (story: Story, e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    setEditingId(story._id);
    setFormData({
      title: story.title || '',
      category: story.category || 'TOURIST SPOTS',
      image: story.image || '',
      excerpt: story.excerpt || '',
    });
    setModalOpen(true);
  };

  const handleDelete = async (id: string, e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    if (!window.confirm('Are you sure you want to permanently delete this story?')) return;
    try {
      await api.delete(`/stories/${id}`);
      setStories((prev) => prev.filter((s) => s._id !== id));
    } catch (err: any) {
      alert('Error deleting story: ' + (err.response?.data?.message || err.message));
    }
  };

  const handleSave = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      setSaving(true);
      if (editingId) {
        await api.put(`/stories/${editingId}`, formData);
      } else {
        await api.post('/stories', formData);
      }
      setModalOpen(false);
      fetchStories();
    } catch (err: any) {
      alert('Error saving story: ' + (err.response?.data?.message || err.message));
    } finally {
      setSaving(false);
    }
  };

  if (loading) {
    return <div className="py-16 text-center text-gray-400 font-semibold">Loading Mahabaleshwar Stories & Guides...</div>;
  }

  return (
    <section className="py-16 bg-[#fdfdfd] mb-12 relative">
      <div className="max-w-[2520px] mx-auto xl:px-20 md:px-10 sm:px-2 px-4">
        
        {/* Header */}
        <div className="flex flex-wrap justify-between items-center gap-4 mb-10">
          <div>
            <h2 className="text-[#3a1b5c] text-3xl md:text-4xl font-bold">Stories, Tips, and Guides</h2>
            <p className="text-gray-500 text-sm mt-1">Exclusive travel stories, itineraries, and expert recommendations</p>
          </div>
          
          <div className="flex items-center gap-3">
            {/* ONLY ADMIN sees this button */}
            {user?.role === 'admin' && (
              <button 
                onClick={handleOpenAddModal}
                className="bg-[#3a1b5c] text-white px-5 py-2.5 rounded-full text-sm font-bold flex items-center gap-2 shadow hover:shadow-lg hover:bg-[#4a2375] transition-all cursor-pointer"
              >
                <Plus size={18} /> Publish Story (Admin)
              </button>
            )}
            <div className="hidden md:flex gap-2">
              <button className="p-2 rounded-full border border-gray-200 hover:bg-gray-50 transition text-gray-500 hover:text-gray-900 cursor-pointer">
                <ChevronLeft size={20} />
              </button>
              <button className="p-2 rounded-full border border-gray-200 hover:bg-gray-50 transition text-gray-500 hover:text-gray-900 cursor-pointer">
                <ChevronRight size={20} />
              </button>
            </div>
          </div>
        </div>
        
        {/* Grid of Stories */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
          {stories.map((post) => (
            <div 
              key={post._id} 
              className="group flex flex-col bg-white rounded-2xl shadow-[0_2px_15px_rgb(0,0,0,0.06)] border border-gray-100 overflow-hidden hover:shadow-[0_8px_30px_rgb(0,0,0,0.12)] transition-all duration-300 relative"
            >
              {/* ADMIN CONTROLS: Strictly ONLY visible to Admin users */}
              {user?.role === 'admin' && (
                <div className="absolute top-3 right-3 flex gap-2 z-20">
                  <button 
                    onClick={(e) => handleOpenEditModal(post, e)} 
                    title="Edit Story (Admin Only)"
                    className="bg-white/95 text-blue-600 p-2 rounded-full shadow-md hover:bg-blue-600 hover:text-white transition-all cursor-pointer flex items-center gap-1 font-semibold text-[11px] px-3"
                  >
                    <Edit3 size={14} /> Edit
                  </button>
                  <button 
                    onClick={(e) => handleDelete(post._id, e)} 
                    title="Delete Story (Admin Only)"
                    className="bg-white/95 text-red-600 p-2 rounded-full shadow-md hover:bg-red-600 hover:text-white transition-all cursor-pointer"
                  >
                    <Trash2 size={15} />
                  </button>
                </div>
              )}

              <Link href="#" className="flex-1 flex flex-col">
                <div className="h-48 overflow-hidden bg-gray-100">
                  <img 
                    src={post.image} 
                    alt={post.title} 
                    className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                    onError={(e: any) => {
                      e.target.onerror = null;
                      e.target.src = 'https://images.unsplash.com/photo-1623862660144-88001712a2aa?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80';
                    }}
                  />
                </div>
                <div className="p-6 flex flex-col flex-1">
                  <div className="flex items-center gap-2 mb-3">
                    <div className="w-1.5 h-1.5 rounded-full bg-brand-red"></div>
                    <span className="text-[11px] font-extrabold text-brand-red tracking-wider uppercase">{post.category}</span>
                  </div>
                  <h4 className="text-[18px] font-bold text-[#3a1b5c] mb-3 leading-snug group-hover:text-brand-red transition-colors">
                    {post.title}
                  </h4>
                  <p className="text-gray-500 text-[14px] leading-relaxed line-clamp-4">
                    {post.excerpt}
                  </p>
                </div>
              </Link>
            </div>
          ))}
        </div>
      </div>

      {/* Admin Add / Edit Modal */}
      {modalOpen && (
        <div className="fixed inset-0 bg-gray-900/60 backdrop-blur-sm z-50 flex items-center justify-center p-4 animate-fade-in-scale">
          <div className="bg-white rounded-3xl max-w-lg w-full p-6 sm:p-8 shadow-2xl relative max-h-[90vh] overflow-y-auto">
            <div className="flex justify-between items-center border-b border-gray-100 pb-4 mb-5">
              <h3 className="text-xl font-extrabold text-[#3a1b5c]">
                {editingId ? 'Edit Story / Guide (Admin)' : 'Publish New Story (Admin Only)'}
              </h3>
              <button onClick={() => setModalOpen(false)} className="text-gray-400 hover:text-gray-700 p-1 rounded-full">
                <X size={22} />
              </button>
            </div>

            <form onSubmit={handleSave} className="space-y-4">
              <div>
                <label className="block text-xs font-bold text-gray-700 uppercase tracking-wide mb-1">Title</label>
                <input 
                  type="text" 
                  required 
                  value={formData.title} 
                  onChange={(e) => setFormData({...formData, title: e.target.value})}
                  placeholder="e.g. 5 Secret Waterfalls in Panchgani"
                  className="w-full px-4 py-2.5 rounded-xl border border-gray-300 focus:outline-none focus:ring-2 focus:ring-[#3a1b5c] text-sm font-medium"
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-gray-700 uppercase tracking-wide mb-1">Category Badge</label>
                <input 
                  type="text" 
                  required 
                  value={formData.category} 
                  onChange={(e) => setFormData({...formData, category: e.target.value})}
                  placeholder="e.g. TOURIST SPOTS or TRAVEL TIPS"
                  className="w-full px-4 py-2.5 rounded-xl border border-gray-300 focus:outline-none focus:ring-2 focus:ring-[#3a1b5c] text-sm font-medium"
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-gray-700 uppercase tracking-wide mb-1">Image URL</label>
                <input 
                  type="url" 
                  required 
                  value={formData.image} 
                  onChange={(e) => setFormData({...formData, image: e.target.value})}
                  placeholder="https://images.unsplash.com/..."
                  className="w-full px-4 py-2.5 rounded-xl border border-gray-300 focus:outline-none focus:ring-2 focus:ring-[#3a1b5c] text-sm font-medium"
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-gray-700 uppercase tracking-wide mb-1">Excerpt / Summary Content</label>
                <textarea 
                  required 
                  rows={4}
                  value={formData.excerpt} 
                  onChange={(e) => setFormData({...formData, excerpt: e.target.value})}
                  placeholder="Write a captivating summary or guide details here..."
                  className="w-full px-4 py-2.5 rounded-xl border border-gray-300 focus:outline-none focus:ring-2 focus:ring-[#3a1b5c] text-sm font-medium leading-relaxed"
                />
              </div>

              <div className="flex justify-end gap-3 pt-4 border-t border-gray-100">
                <button 
                  type="button" 
                  onClick={() => setModalOpen(false)}
                  className="px-5 py-2.5 rounded-xl border border-gray-300 font-bold text-gray-700 hover:bg-gray-100 transition text-sm cursor-pointer"
                >
                  Cancel
                </button>
                <button 
                  type="submit" 
                  disabled={saving}
                  className="px-6 py-2.5 rounded-xl bg-[#3a1b5c] text-white font-bold text-sm hover:bg-[#4a2375] shadow-md transition disabled:opacity-50 cursor-pointer"
                >
                  {saving ? 'Publishing...' : editingId ? 'Update Story' : 'Publish Story'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </section>
  );
}
