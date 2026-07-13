"use client";

import { useState, useEffect } from "react";
import { X, Loader2 } from "lucide-react";
import api from "@/lib/api";

interface ExplorePlace {
  _id?: string;
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

interface ExploreModalProps {
  isOpen: boolean;
  onClose: () => void;
  place?: ExplorePlace | null;
  onSuccess: () => void;
}

const CATEGORIES = ['Viewpoint', 'Lake', 'Fort', 'Temple', 'Nature', 'Market', 'Adventure'];

export default function ExploreModal({ isOpen, onClose, place, onSuccess }: ExploreModalProps) {
  const [formData, setFormData] = useState({
    name: "",
    tagline: "",
    description: "",
    history: "",
    images: "",
    bestTime: "",
    thingsToDo: "",
    category: "Nature",
    entryFee: "Free",
    distance: "Within Mahabaleshwar",
  });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  useEffect(() => {
    if (place) {
      setFormData({
        name: place.name,
        tagline: place.tagline,
        description: place.description,
        history: place.history,
        images: place.images.join(", "),
        bestTime: place.bestTime,
        thingsToDo: place.thingsToDo.join(", "),
        category: place.category,
        entryFee: place.entryFee || "Free",
        distance: place.distance || "Within Mahabaleshwar",
      });
    } else {
      setFormData({
        name: "",
        tagline: "",
        description: "",
        history: "",
        images: "",
        bestTime: "",
        thingsToDo: "",
        category: "Nature",
        entryFee: "Free",
        distance: "Within Mahabaleshwar",
      });
    }
  }, [place, isOpen]);

  if (!isOpen) return null;

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError("");

    // Prepare payload
    const payload = {
      ...formData,
      images: formData.images.split(",").map((s) => s.trim()).filter(Boolean),
      thingsToDo: formData.thingsToDo.split(",").map((s) => s.trim()).filter(Boolean),
    };

    try {
      if (place && place._id) {
        await api.put(`/explore/${place._id}/update`, payload);
      } else {
        await api.post("/explore", payload);
      }
      onSuccess();
      onClose();
    } catch (err: any) {
      setError(err.response?.data?.message || "Failed to save explore place");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50 backdrop-blur-sm overflow-y-auto">
      <div className="bg-white rounded-2xl w-full max-w-2xl overflow-hidden shadow-xl my-8">
        <div className="flex items-center justify-between p-6 border-b border-gray-100">
          <h2 className="text-xl font-semibold text-gray-900">
            {place ? "Edit Explore Place" : "Add Explore Place"}
          </h2>
          <button
            onClick={onClose}
            className="p-2 text-gray-400 hover:text-gray-600 hover:bg-gray-100 rounded-full transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        <form onSubmit={handleSubmit} className="p-6 space-y-4 max-h-[70vh] overflow-y-auto">
          {error && (
            <div className="p-3 text-sm text-red-600 bg-red-50 rounded-lg">
              {error}
            </div>
          )}

          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Name</label>
              <input
                type="text"
                required
                value={formData.name}
                onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-600 outline-none"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Tagline</label>
              <input
                type="text"
                required
                value={formData.tagline}
                onChange={(e) => setFormData({ ...formData, tagline: e.target.value })}
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-600 outline-none"
              />
            </div>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Category</label>
            <select
              value={formData.category}
              onChange={(e) => setFormData({ ...formData, category: e.target.value })}
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-600 outline-none"
            >
              {CATEGORIES.map(cat => <option key={cat} value={cat}>{cat}</option>)}
            </select>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Description</label>
            <textarea
              required
              rows={3}
              value={formData.description}
              onChange={(e) => setFormData({ ...formData, description: e.target.value })}
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-600 outline-none resize-none"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">History</label>
            <textarea
              required
              rows={2}
              value={formData.history}
              onChange={(e) => setFormData({ ...formData, history: e.target.value })}
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-600 outline-none resize-none"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Images (comma separated URLs)</label>
            <textarea
              required
              rows={2}
              value={formData.images}
              onChange={(e) => setFormData({ ...formData, images: e.target.value })}
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-600 outline-none resize-none"
            />
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Best Time to Visit</label>
              <input
                type="text"
                required
                value={formData.bestTime}
                onChange={(e) => setFormData({ ...formData, bestTime: e.target.value })}
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-600 outline-none"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Things To Do (comma separated)</label>
              <input
                type="text"
                value={formData.thingsToDo}
                onChange={(e) => setFormData({ ...formData, thingsToDo: e.target.value })}
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-600 outline-none"
              />
            </div>
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Entry Fee</label>
              <input
                type="text"
                value={formData.entryFee}
                onChange={(e) => setFormData({ ...formData, entryFee: e.target.value })}
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-600 outline-none"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Distance</label>
              <input
                type="text"
                value={formData.distance}
                onChange={(e) => setFormData({ ...formData, distance: e.target.value })}
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-600 outline-none"
              />
            </div>
          </div>

        </form>
        
        <div className="p-6 border-t border-gray-100 flex justify-end gap-3 bg-gray-50">
            <button
              type="button"
              onClick={onClose}
              className="px-5 py-2 text-sm font-medium text-gray-700 bg-white border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors"
            >
              Cancel
            </button>
            <button
              onClick={handleSubmit}
              disabled={loading}
              className="px-5 py-2 text-sm font-medium text-white bg-indigo-600 rounded-lg hover:bg-indigo-700 transition-colors disabled:opacity-50 flex items-center gap-2"
            >
              {loading && <Loader2 className="w-4 h-4 animate-spin" />}
              {place ? "Save Changes" : "Add Place"}
            </button>
        </div>
      </div>
    </div>
  );
}
