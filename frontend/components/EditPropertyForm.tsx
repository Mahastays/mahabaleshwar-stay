"use client";

import { useState, useEffect } from "react";
import { UploadCloud, CheckCircle2, Image as ImageIcon } from "lucide-react";
import api from "@/lib/api";
import { useRouter } from "next/navigation";

export default function EditPropertyForm({ propertyId }: { propertyId: string }) {
  const router = useRouter();
  const [formData, setFormData] = useState({
    title: "",
    description: "",
    price: "",
    type: "Hotel",
    location: "",
    amenities: "",
    lat: "",
    lng: "",
  });

  const [images, setImages] = useState<string[]>([]);
  const [uploading, setUploading] = useState(false);
  const [success, setSuccess] = useState(false);
  const [loading, setLoading] = useState(true);
  const [rooms, setRooms] = useState([{ name: "", price: "", quantity: "" }]);

  useEffect(() => {
    const fetchProperty = async () => {
      try {
        const res = await api.get(`/properties/${propertyId}`);
        const data = res.data;
        
        setFormData({
          title: data.title,
          description: data.description,
          price: data.price.toString(),
          type: data.type,
          location: data.location,
          amenities: data.amenities.join(", "),
          lat: data.coordinates?.lat?.toString() || "",
          lng: data.coordinates?.lng?.toString() || "",
        });
        setImages(data.images || []);
        if (data.rooms && data.rooms.length > 0) {
          setRooms(data.rooms.map((r: any) => ({ name: r.name, price: r.price.toString(), quantity: r.quantity.toString() })));
        }
      } catch (error) {
        console.error(error);
        alert("Error loading property data");
      } finally {
        setLoading(false);
      }
    };
    fetchProperty();
  }, [propertyId]);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const uploadFileHandler = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    setUploading(true);

    try {
      // 1. Get a Signed URL from the backend
      const res = await api.get('/upload/url', {
        params: {
          filename: file.name,
          contentType: file.type
        }
      });
      
      const { uploadUrl, publicUrl } = res.data;

      // 2. Upload the file directly to Google Cloud Storage (Firebase) using the Signed URL
      const uploadRes = await fetch(uploadUrl, {
        method: 'PUT',
        body: file,
        headers: {
          'Content-Type': file.type,
        },
      });

      if (!uploadRes.ok) {
        throw new Error('Failed to upload image to the secure link');
      }

      // 3. Save the public URL
      setImages((prev) => [...prev, publicUrl]);
      setUploading(false);
    } catch (error: any) {
      console.error(error);
      setUploading(false);
      alert(`Error uploading image: ${error.message || 'Unknown error'}`);
    }
  };

  const removeImage = (indexToRemove: number) => {
    setImages(images.filter((_, idx) => idx !== indexToRemove));
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
        rooms: (formData.type === 'Hotel' || formData.type === 'Resort') 
          ? rooms.map(r => ({ name: r.name, price: Number(r.price), quantity: Number(r.quantity) }))
          : [],
      };

      const res = await api.put(`/properties/${propertyId}`, propertyData);

      setSuccess(true);
      setTimeout(() => {
        setSuccess(false);
        router.push("/vendor/properties");
      }, 2000);
    } catch (error) {
      console.error(error);
      alert("Error updating property");
    }
  };

  if (loading) {
    return <div className="p-8 text-center text-gray-500">Loading property details...</div>;
  }

  return (
    <div className="bg-white p-8 rounded-2xl shadow-sm border border-gray-200">
      {success && (
        <div className="mb-6 p-4 bg-green-50 text-green-700 rounded-xl flex items-center gap-3">
          <CheckCircle2 className="w-5 h-5" />
          <p className="font-medium">Property updated successfully!</p>
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
            />
          </div>

          <div className="space-y-2">
            <label className="text-sm font-medium text-gray-700">{formData.type === 'Hotel' || formData.type === 'Resort' ? 'Base Price / Starting Price (₹)' : 'Price per Night (₹)'}</label>
            <input
              type="number"
              name="price"
              value={formData.price}
              onChange={handleChange}
              required
              className="w-full px-4 py-3 rounded-xl border border-gray-200 focus:ring-2 focus:ring-brand-brown focus:border-transparent outline-none transition-all"
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
              <option value="Hotel">Hotel</option>
              <option value="Villa">Villa</option>
              <option value="Resort">Resort</option>
            </select>
          </div>

          <div className="space-y-2">
            <label className="text-sm font-medium text-gray-700">Location</label>
            <select
              name="location"
              value={formData.location}
              onChange={handleChange}
              required
              className="w-full px-4 py-3 rounded-xl border border-gray-200 focus:ring-2 focus:ring-brand-brown focus:border-transparent outline-none transition-all bg-white"
            >
              <option value="" disabled>Select a location</option>
              <option value="Main Market Mahableshwar">Main Market Mahableshwar</option>
              <option value="Venna Lake">Venna Lake</option>
              <option value="Main Road Satara">Main Road Satara</option>
              <option value="Panchgani">Panchgani</option>
              <option value="Bhilar">Bhilar</option>
              <option value="Bhoise">Bhoise</option>
              <option value="Lingmala Waterfall">Lingmala Waterfall</option>
              <option value="Wilson Point">Wilson Point</option>
            </select>
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

        {(formData.type === 'Hotel' || formData.type === 'Resort') && (
          <div className="space-y-4 p-5 border border-gray-200 rounded-xl bg-gray-50/50">
            <div className="flex justify-between items-center">
              <label className="text-sm font-bold text-gray-900">Room Types & Inventory</label>
              <button 
                type="button" 
                onClick={() => setRooms([...rooms, { name: "", price: "", quantity: "" }])} 
                className="text-xs font-bold text-brand-red bg-white border border-gray-200 px-3 py-1.5 rounded-lg shadow-sm hover:shadow-md transition-all active:scale-95"
              >
                + Add Room Type
              </button>
            </div>
            {rooms.map((room, idx) => (
              <div key={idx} className="flex flex-col md:flex-row gap-3">
                <input 
                  type="text" 
                  placeholder="Room Name (e.g. Deluxe Suite)" 
                  value={room.name} 
                  onChange={(e) => { const newRooms = [...rooms]; newRooms[idx].name = e.target.value; setRooms(newRooms); }} 
                  className="flex-[2] px-3 py-2 rounded-lg border border-gray-300 text-sm outline-none focus:ring-1 focus:ring-gray-900" 
                  required 
                />
                <input 
                  type="number" 
                  placeholder="Price (₹)" 
                  value={room.price} 
                  onChange={(e) => { const newRooms = [...rooms]; newRooms[idx].price = e.target.value; setRooms(newRooms); }} 
                  className="flex-1 px-3 py-2 rounded-lg border border-gray-300 text-sm outline-none focus:ring-1 focus:ring-gray-900" 
                  required 
                />
                <div className="flex flex-1 gap-2">
                  <input 
                    type="number" 
                    placeholder="Qty (e.g. 5)" 
                    value={room.quantity} 
                    onChange={(e) => { const newRooms = [...rooms]; newRooms[idx].quantity = e.target.value; setRooms(newRooms); }} 
                    className="w-full px-3 py-2 rounded-lg border border-gray-300 text-sm outline-none focus:ring-1 focus:ring-gray-900" 
                    required 
                    min="1" 
                  />
                  {rooms.length > 1 && (
                    <button 
                      type="button" 
                      onClick={() => { const newRooms = [...rooms]; newRooms.splice(idx, 1); setRooms(newRooms); }} 
                      className="p-2 text-red-500 hover:bg-red-50 rounded-lg transition-colors font-bold flex-shrink-0"
                    >
                      ×
                    </button>
                  )}
                </div>
              </div>
            ))}
          </div>
        )}

        <div className="space-y-2">
          <label className="text-sm font-medium text-gray-700">Description</label>
          <textarea
            name="description"
            value={formData.description}
            onChange={handleChange}
            required
            rows={4}
            className="w-full px-4 py-3 rounded-xl border border-gray-200 focus:ring-2 focus:ring-brand-brown focus:border-transparent outline-none transition-all resize-none"
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
                <div key={idx} className="relative h-24 rounded-lg overflow-hidden border border-gray-200 group bg-gray-100">
                  {img.startsWith('/') ? (
                    <img src={img.startsWith('http') ? img : `${process.env.NEXT_PUBLIC_API_URL?.replace('/api', '') || 'http://localhost:5000'}${img}`} alt={`Preview ${idx}`} className="object-cover w-full h-full" />
                  ) : (
                    <img src={img} alt={`Preview ${idx}`} className="object-cover w-full h-full" />
                  )}
                  <button
                    type="button"
                    onClick={() => removeImage(idx)}
                    className="absolute top-1 right-1 bg-white/90 p-1 rounded-full text-red-600 opacity-0 group-hover:opacity-100 transition-opacity shadow-sm text-xs font-bold w-6 h-6 flex items-center justify-center"
                  >
                    ×
                  </button>
                </div>
              ))}
            </div>
          )}
        </div>

        <div className="pt-4 border-t border-gray-100 flex gap-4">
          <button
            type="submit"
            className="px-8 py-3 bg-gray-900 text-white rounded-xl font-medium hover:bg-gray-800 transition-colors shadow-sm"
          >
            Update Property
          </button>
          <button
            type="button"
            onClick={() => router.push('/vendor/properties')}
            className="px-8 py-3 bg-gray-100 text-gray-700 rounded-xl font-medium hover:bg-gray-200 transition-colors shadow-sm"
          >
            Cancel
          </button>
        </div>
      </form>
    </div>
  );
}
