'use client';

import { useState, useEffect } from 'react';
import { Users, TrendingUp, CalendarCheck, MapPin, Loader2 } from "lucide-react";
import { useAuth } from "@/context/AuthContext";
import api from "@/lib/api";
import Link from "next/link";

interface PropertyData {
  _id: string;
  title: string;
  status: string;
  price: number;
}

interface BookingData {
  _id: string;
  property: { _id: string; title: string };
  user: { name: string; email: string; phoneNumber: string };
  checkInDate: string;
  checkOutDate: string;
  totalPrice: number;
  status: string;
}

export default function VendorDashboard() {
  const { user, loading: authLoading } = useAuth();
  const [properties, setProperties] = useState<PropertyData[]>([]);
  const [bookings, setBookings] = useState<BookingData[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchData = async () => {
      if (!user) return;
      try {
        const [propsRes, bookingsRes] = await Promise.all([
          api.get('/properties/host'),
          api.get('/bookings/host')
        ]);
        
        setProperties(propsRes.data);
        setBookings(bookingsRes.data);
      } catch (error) {
        console.error('Error fetching vendor data:', error);
      } finally {
        setLoading(false);
      }
    };
    if (!authLoading) fetchData();
  }, [user, authLoading]);

  const handleDeleteProperty = async (id: string) => {
    if (!window.confirm('Are you sure you want to delete this property? This action cannot be undone.')) {
      return;
    }
    
    try {
      await api.delete(`/properties/${id}`);
      setProperties(properties.filter(p => p._id !== id));
      alert('Property deleted successfully');
    } catch (error) {
      console.error('Error deleting property:', error);
      alert('Failed to delete property');
    }
  };

  if (authLoading || loading) {
    return (
      <div className="flex items-center justify-center min-h-[60vh]">
        <Loader2 className="w-8 h-8 animate-spin text-gray-400" />
      </div>
    );
  }

  const handleUpgradeToHost = async () => {
    try {
      await api.put('/users/upgrade-to-host');
      window.location.reload();
    } catch (err) {
      console.error(err);
      alert('Failed to upgrade account');
    }
  };

  if (!user) {
    return (
      <div className="flex flex-col items-center justify-center min-h-[60vh] gap-4">
        <p className="text-gray-500">Please login to access the vendor dashboard.</p>
        <Link href="/login" className="px-6 py-2 bg-gray-900 text-white rounded-lg font-medium hover:bg-gray-800 transition-colors">Login</Link>
      </div>
    );
  }

  if (user.role === 'user') {
    return (
      <div className="flex flex-col items-center justify-center min-h-[60vh] gap-6 max-w-lg mx-auto text-center px-4">
        <div className="w-24 h-24 bg-red-50 text-brand-red rounded-full flex items-center justify-center mb-2">
          <MapPin size={48} strokeWidth={1.5} />
        </div>
        <h2 className="text-3xl font-bold text-gray-900 tracking-tight">Become a Host Today</h2>
        <p className="text-gray-600 text-lg leading-relaxed">
          Unlock your host dashboard to start listing properties, managing your bookings, and earning money with MahaStays.
        </p>
        <button 
          onClick={handleUpgradeToHost}
          className="mt-4 px-8 py-4 bg-brand-red text-white text-lg font-bold rounded-full hover:bg-red-600 transition-colors shadow-lg hover:shadow-xl hover:-translate-y-0.5"
        >
          Upgrade My Account Now
        </button>
      </div>
    );
  }

  const totalEarnings = bookings.filter(b => b.status === 'confirmed').reduce((sum, b) => sum + b.totalPrice, 0);
  const activeBookings = bookings.filter(b => b.status === 'pending' || b.status === 'confirmed').length;

  return (
    <div className="max-w-6xl mx-auto space-y-8">
      {/* Stats Area */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
        <div className="bg-white p-6 rounded-2xl border border-gray-200 shadow-sm">
          <div className="flex justify-between items-start">
            <div>
              <p className="text-sm font-medium text-gray-500 mb-1">Total Earnings</p>
              <h3 className="text-2xl font-bold text-gray-900">₹{totalEarnings.toLocaleString()}</h3>
            </div>
            <div className="p-2 bg-green-100 text-green-700 rounded-lg"><TrendingUp className="w-5 h-5" /></div>
          </div>
          <p className="mt-4 text-xs font-medium text-green-600">From confirmed bookings</p>
        </div>
        
        <div className="bg-white p-6 rounded-2xl border border-gray-200 shadow-sm">
          <div className="flex justify-between items-start">
            <div>
              <p className="text-sm font-medium text-gray-500 mb-1">Active Bookings</p>
              <h3 className="text-2xl font-bold text-gray-900">{activeBookings}</h3>
            </div>
            <div className="p-2 bg-brand-brown/20 text-brand-brown rounded-lg"><CalendarCheck className="w-5 h-5" /></div>
          </div>
          <p className="mt-4 text-xs font-medium text-brand-brown">Pending + Confirmed</p>
        </div>

        <div className="bg-white p-6 rounded-2xl border border-gray-200 shadow-sm">
          <div className="flex justify-between items-start">
            <div>
              <p className="text-sm font-medium text-gray-500 mb-1">Total Guests</p>
              <h3 className="text-2xl font-bold text-gray-900">{bookings.length}</h3>
            </div>
            <div className="p-2 bg-orange-100 text-orange-700 rounded-lg"><Users className="w-5 h-5" /></div>
          </div>
          <p className="mt-4 text-xs font-medium text-gray-500">Across all properties</p>
        </div>

        <div className="bg-white p-6 rounded-2xl border border-gray-200 shadow-sm">
          <div className="flex justify-between items-start">
            <div>
              <p className="text-sm font-medium text-gray-500 mb-1">Properties</p>
              <h3 className="text-2xl font-bold text-gray-900">{properties.length}</h3>
            </div>
            <div className="p-2 bg-purple-100 text-purple-700 rounded-lg"><MapPin className="w-5 h-5" /></div>
          </div>
          <p className="mt-4 text-xs font-medium text-gray-500">
            {properties.filter(p => p.status === 'approved').length} approved, {properties.filter(p => p.status === 'pending').length} pending
          </p>
        </div>
      </div>

      {/* My Properties */}
      <div className="bg-white border border-gray-200 rounded-2xl shadow-sm overflow-hidden">
        <div className="px-6 py-5 border-b border-gray-200 flex items-center justify-between">
          <h3 className="text-lg font-semibold text-gray-900">My Properties</h3>
          <Link href="/vendor/properties/add" className="px-4 py-2 bg-gray-900 text-white text-sm font-medium rounded-lg hover:bg-gray-800 transition-colors">
            + Add New
          </Link>
        </div>
        {properties.length > 0 ? (
          <div className="overflow-x-auto">
            <table className="w-full text-sm text-left">
              <thead className="bg-gray-50 border-b border-gray-200 text-gray-500 uppercase text-xs font-bold tracking-wider">
                <tr>
                  <th className="px-6 py-4">Title</th>
                  <th className="px-6 py-4">Price/Night</th>
                  <th className="px-6 py-4">Status</th>
                  <th className="px-6 py-4 text-right">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-200 text-gray-700">
                {properties.map((prop) => (
                  <tr key={prop._id} className="hover:bg-gray-50 transition-colors">
                    <td className="px-6 py-4 font-medium text-gray-900">{prop.title}</td>
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
                      <div className="flex justify-end gap-3">
                        <Link 
                          href={`/vendor/properties/${prop._id}/edit`}
                          className="text-gray-500 hover:text-gray-900 transition-colors font-medium text-xs border border-gray-200 px-3 py-1.5 rounded-lg"
                        >
                          Edit
                        </Link>
                        <button 
                          onClick={() => handleDeleteProperty(prop._id)}
                          className="text-red-500 hover:text-white hover:bg-red-500 transition-colors font-medium text-xs border border-red-200 hover:border-red-500 px-3 py-1.5 rounded-lg"
                        >
                          Delete
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
            <p>No properties yet. Add your first property to start receiving bookings!</p>
          </div>
        )}
      </div>

      {/* Recent Bookings */}
      <div className="bg-white border border-gray-200 rounded-2xl shadow-sm overflow-hidden">
        <div className="px-6 py-5 border-b border-gray-200">
          <h3 className="text-lg font-semibold text-gray-900">Recent Bookings</h3>
        </div>
        {bookings.length > 0 ? (
          <div className="overflow-x-auto">
            <table className="w-full text-sm text-left">
              <thead className="bg-gray-50 border-b border-gray-200 text-gray-500 uppercase text-xs font-bold tracking-wider">
                <tr>
                  <th className="px-6 py-4">Property</th>
                  <th className="px-6 py-4">Guest</th>
                  <th className="px-6 py-4">Dates</th>
                  <th className="px-6 py-4">Amount</th>
                  <th className="px-6 py-4">Status</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-200 text-gray-700">
                {bookings.map((booking) => (
                  <tr key={booking._id} className="hover:bg-gray-50 transition-colors">
                    <td className="px-6 py-4 font-medium text-gray-900">{booking.property?.title || 'N/A'}</td>
                    <td className="px-6 py-4">
                      <div className="flex items-center gap-2">
                        <div className="w-6 h-6 rounded-full bg-gray-200 flex items-center justify-center text-[10px] font-bold text-gray-600">
                          {booking.user?.name?.charAt(0) || '?'}
                        </div>
                        {booking.user?.name || 'Guest'}
                      </div>
                    </td>
                    <td className="px-6 py-4">{new Date(booking.checkInDate).toLocaleDateString()} - {new Date(booking.checkOutDate).toLocaleDateString()}</td>
                    <td className="px-6 py-4 font-medium">₹{booking.totalPrice.toLocaleString()}</td>
                    <td className="px-6 py-4">
                      <span className={`px-2.5 py-1 rounded-full text-[10px] font-bold uppercase tracking-wider ${
                        booking.status === 'confirmed' ? 'bg-green-100 text-green-700' :
                        booking.status === 'pending' ? 'bg-yellow-100 text-yellow-700' :
                        'bg-red-100 text-red-700'
                      }`}>
                        {booking.status}
                      </span>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        ) : (
          <div className="p-10 text-center text-gray-500">
            <p>No bookings yet. Once your properties are approved, guests can start booking!</p>
          </div>
        )}
      </div>
    </div>
  );
}
