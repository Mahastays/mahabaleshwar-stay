"use client";

import { useState } from "react";
import { UploadCloud, CheckCircle2, Image as ImageIcon } from "lucide-react";
import api from "@/lib/api";

export default function AddPropertyForm() {
  const [formData, setFormData] = useState({
    title: "",
    description: "",
    price: "",
    type: "Resort",
    location: "",
    amenities: "",
    lat: "",
    lng: "",
  });

  const [images, setImages] = useState<string[]>([]);
  const [uploading, setUploading] = useState(false);
  const [success, setSuccess] = useState(false);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const uploadFileHandler = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    const fileData = new FormData();
    fileData.append("image", file);

    setUploading(true);

    try {
      const res = await api.post("/upload", fileData, {
        headers: {
          "Content-Type": "multipart/form-data",
        },
      });

      const imagePath = res.data; // api returns data directly
      setImages((prev) => [...prev, imagePath]);
      setUploading(false);
    } catch (error: any) {
      console.error(error);
      setUploading(false);
      alert(`Error uploading image: ${error.response?.data || error.message || 'Unknown error'}`);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (images.length === 0) {
      alert("Please upload at least one image");
      return;
    }

    try {
      const propertyData = {
        ...formData,
        price: Number(formData.price),
        amenities: formData.amenities.split(",").map((item) => item.trim()),
        images,
        coordinates: formData.lat && formData.lng ? {
          lat: Number(formData.lat),
          lng: Number(formData.lng)
        } : undefined,
      };
      const res = await api.post("/properties", propertyData);

      setSuccess(true);
      // Reset form
      setFormData({
        title: "",
        description: "",
        price: "",
        type: "Resort",
        location: "",
        amenities: "",
        lat: "",
        lng: "",
      });
      setImages([]);

      setTimeout(() => setSuccess(false), 3000);
    } catch (error) {
      console.error(error);
      alert("Error adding property");
    }
  };

  return (
    <div className="bg-white p-8 rounded-2xl shadow-sm border border-gray-200">
      {success && (
        <div className="mb-6 p-4 bg-green-50 text-green-700 rounded-xl flex items-center gap-3">
          <CheckCircle2 className="w-5 h-5" />
          <p className="font-medium">Property added successfully!</p>
        </div>
      )}

      <form onSubmit={handleSubmit} className="space-y-6">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div className="space-y-2">
            <label className="text-sm font-medium text-gray-700">Property Title</label>
            <input
              type="text"
              name="title"
              value={formData.title}
              onChange={handleChange}
              required
              className="w-full px-4 py-3 rounded-xl border border-gray-200 focus:ring-2 focus:ring-brand-brown focus:border-transparent outline-none transition-all"
              placeholder="e.g. Sunset View Villa"
            />
          </div>

          <div className="space-y-2">
            <label className="text-sm font-medium text-gray-700">Price per Night (₹)</label>
            <input
              type="number"
              name="price"
              value={formData.price}
              onChange={handleChange}
              required
              className="w-full px-4 py-3 rounded-xl border border-gray-200 focus:ring-2 focus:ring-brand-brown focus:border-transparent outline-none transition-all"
              placeholder="5000"
            />
          </div>

          <div className="space-y-2">
            <label className="text-sm font-medium text-gray-700">Property Type</label>
            <select
              name="type"
              value={formData.type}
              onChange={handleChange}
              className="w-full px-4 py-3 rounded-xl border border-gray-200 focus:ring-2 focus:ring-brand-brown focus:border-transparent outline-none transition-all bg-white"
            >
              <option value="Resort">Resort</option>
              <option value="Homestay">Homestay</option>
              <option value="Hotel">Hotel</option>
              <option value="Tent">Tent</option>
              <option value="Villa">Villa</option>
              <option value="Hostel">Hostel</option>
            </select>
          </div>

          <div className="space-y-2">
            <label className="text-sm font-medium text-gray-700">Location</label>
            <input
              type="text"
              name="location"
              value={formData.location}
              onChange={handleChange}
              required
              className="w-full px-4 py-3 rounded-xl border border-gray-200 focus:ring-2 focus:ring-brand-brown focus:border-transparent outline-none transition-all"
              placeholder="e.g. Panchgani Road"
            />
          </div>

          <div className="space-y-2">
            <label className="text-sm font-medium text-gray-700">Latitude (Optional)</label>
            <input
              type="number"
              step="any"
              name="lat"
              value={formData.lat}
              onChange={handleChange}
              className="w-full px-4 py-3 rounded-xl border border-gray-200 focus:ring-2 focus:ring-brand-brown focus:border-transparent outline-none transition-all"
              placeholder="e.g. 17.9237"
            />
          </div>

          <div className="space-y-2">
            <label className="text-sm font-medium text-gray-700">Longitude (Optional)</label>
            <input
              type="number"
              step="any"
              name="lng"
              value={formData.lng}
              onChange={handleChange}
              className="w-full px-4 py-3 rounded-xl border border-gray-200 focus:ring-2 focus:ring-brand-brown focus:border-transparent outline-none transition-all"
              placeholder="e.g. 73.6586"
            />
          </div>
        </div>

        <div className="space-y-2">
          <label className="text-sm font-medium text-gray-700">Description</label>
          <textarea
            name="description"
            value={formData.description}
            onChange={handleChange}
            required
            rows={4}
            className="w-full px-4 py-3 rounded-xl border border-gray-200 focus:ring-2 focus:ring-brand-brown focus:border-transparent outline-none transition-all resize-none"
            placeholder="Describe the property and its unique features..."
          />
        </div>

        <div className="space-y-2">
          <label className="text-sm font-medium text-gray-700">Amenities (Comma separated)</label>
          <input
            type="text"
            name="amenities"
            value={formData.amenities}
            onChange={handleChange}
            className="w-full px-4 py-3 rounded-xl border border-gray-200 focus:ring-2 focus:ring-brand-brown focus:border-transparent outline-none transition-all"
            placeholder="e.g. Free WiFi, Pool, Breakfast Included"
          />
        </div>

        <div className="space-y-4">
          <label className="text-sm font-medium text-gray-700">Property Images</label>
          
          <div className="flex items-center justify-center w-full">
            <label htmlFor="dropzone-file" className="flex flex-col items-center justify-center w-full h-32 border-2 border-gray-300 border-dashed rounded-xl cursor-pointer bg-gray-50 hover:bg-gray-100 transition-colors">
              <div className="flex flex-col items-center justify-center pt-5 pb-6">
                <UploadCloud className="w-8 h-8 mb-3 text-gray-400" />
                <p className="mb-2 text-sm text-gray-500"><span className="font-semibold">Click to upload</span></p>
                <p className="text-xs text-gray-500">SVG, PNG, JPG or GIF</p>
              </div>
              <input id="dropzone-file" type="file" className="hidden" onChange={uploadFileHandler} accept="image/*" />
            </label>
          </div>
          
          {uploading && <p className="text-sm text-brand-brown font-medium">Uploading image...</p>}

          {images.length > 0 && (
            <div className="grid grid-cols-4 gap-4 mt-4">
              {images.map((img, idx) => (
                <div key={idx} className="relative h-24 rounded-lg overflow-hidden border border-gray-200 flex items-center justify-center bg-gray-100">
                  {/* Fallback to full URL for uploaded images in dev environment if they start with / */}
                  {img.startsWith('/') ? (
                    <img src={img.startsWith('http') ? img : `${process.env.NEXT_PUBLIC_API_URL?.replace('/api', '') || 'http://localhost:5000'}${img}`} alt={`Preview ${idx}`} className="object-cover w-full h-full" />
                  ) : (
                    <img src={img} alt={`Preview ${idx}`} className="object-cover w-full h-full" />
                  )}
                </div>
              ))}
            </div>
          )}
        </div>

        <div className="pt-4 border-t border-gray-100">
          <button
            type="submit"
            className="w-full md:w-auto px-8 py-3 bg-gray-900 text-white rounded-xl font-medium hover:bg-gray-800 transition-colors shadow-sm"
          >
            List Property
          </button>
        </div>
      </form>
    </div>
  );
}
