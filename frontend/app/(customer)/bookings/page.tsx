'use client';

import { useState, useEffect } from 'react';
import { useAuth } from '@/context/AuthContext';
import api from '@/lib/api';
import Link from 'next/link';
import { Calendar, MapPin, Loader2, Luggage } from 'lucide-react';

interface BookingItem {
  _id: string;
  property: { _id: string; title: string; images: string[]; location: string };
  checkInDate: string;
  checkOutDate: string;
  guests: number;
  totalPrice: number;
  status: string;
}

export default function MyBookingsPage() {
  const { user, loading: authLoading } = useAuth();
  const [bookings, setBookings] = useState<BookingItem[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchBookings = async () => {
      if (!user) { setLoading(false); return; }
      try {
        const res = await api.get('/bookings/mybookings');
        setBookings(res.data);
      } catch (error) {
        console.error('Error fetching bookings:', error);
      } finally {
        setLoading(false);
      }
    };
    if (!authLoading) fetchBookings();
  }, [user, authLoading]);

  if (authLoading || loading) {
    return (
      <div className="flex items-center justify-center min-h-[60vh]">
        <Loader2 className="w-8 h-8 animate-spin text-gray-400" />
      </div>
    );
  }

  if (!user) {
    return (
      <div className="flex flex-col items-center justify-center min-h-[60vh] gap-4">
        <Luggage className="w-16 h-16 text-gray-300" />
        <h2 className="text-xl font-bold text-gray-900">Login to see your trips</h2>
        <p className="text-gray-500">You need to be logged in to view your bookings.</p>
        <Link href="/login" className="px-6 py-2 bg-gray-900 text-white rounded-lg font-medium hover:bg-gray-800 transition-colors">Login</Link>
      </div>
    );
  }

  return (
    <main className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 py-10 min-h-[70vh]">
      <div className="mb-8">
        <h1 className="text-3xl font-bold tracking-tight text-gray-900">My Trips</h1>
        <p className="text-gray-500 mt-1">{bookings.length} booking{bookings.length !== 1 ? 's' : ''}</p>
      </div>

      {bookings.length > 0 ? (
        <div className="space-y-6">
          {bookings.map((booking) => {
            const propertyImage = booking.property?.images?.[0]
              ? (booking.property.images[0].startsWith('/') ? `http://localhost:5000${booking.property.images[0]}` : booking.property.images[0])
              : 'https://images.unsplash.com/photo-1542314831-c6a4d14d8c53?auto=format&fit=crop&q=80';

            return (
              <div key={booking._id} className="bg-white border border-gray-200 rounded-2xl shadow-sm overflow-hidden hover:shadow-md transition-shadow">
                <div className="flex flex-col sm:flex-row">
                  {/* Image */}
                  <div className="sm:w-48 h-40 sm:h-auto flex-shrink-0">
                    <img src={propertyImage} alt={booking.property?.title || 'Property'} className="w-full h-full object-cover" />
                  </div>

                  {/* Details */}
                  <div className="flex-1 p-6">
                    <div className="flex items-start justify-between mb-3">
                      <div>
                        <h3 className="text-lg font-bold text-gray-900">
                          <Link href={`/properties/${booking.property?._id}`} className="hover:underline">
                            {booking.property?.title || 'Property'}
                          </Link>
                        </h3>
                        <p className="text-sm text-gray-500 flex items-center gap-1 mt-1">
                          <MapPin className="w-3.5 h-3.5" /> {booking.property?.location || 'Mahabaleshwar'}
                        </p>
                      </div>
                      <span className={`px-3 py-1 rounded-full text-xs font-bold uppercase tracking-wider ${
                        booking.status === 'confirmed' ? 'bg-green-100 text-green-700' :
                        booking.status === 'pending' ? 'bg-yellow-100 text-yellow-700' :
                        'bg-red-100 text-red-700'
                      }`}>
                        {booking.status}
                      </span>
                    </div>

                    <div className="flex items-center gap-6 text-sm text-gray-600 mt-4">
                      <span className="flex items-center gap-1.5">
                        <Calendar className="w-4 h-4 text-gray-400" />
                        {new Date(booking.checkInDate).toLocaleDateString()} — {new Date(booking.checkOutDate).toLocaleDateString()}
                      </span>
                      <span>{booking.guests} guest{booking.guests !== 1 ? 's' : ''}</span>
                    </div>

                    <div className="mt-4 pt-4 border-t border-gray-100 flex items-center justify-between">
                      <span className="text-lg font-bold text-gray-900">₹{booking.totalPrice.toLocaleString()}</span>
                    </div>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      ) : (
        <div className="text-center py-24 bg-gray-50 rounded-2xl border border-gray-100">
          <Luggage className="w-16 h-16 text-gray-300 mx-auto mb-4" />
          <h2 className="text-2xl font-bold text-gray-900 mb-2">No trips yet</h2>
          <p className="text-gray-500 mb-6">When you book a stay, it will appear here.</p>
          <Link href="/" className="px-6 py-3 bg-gray-900 text-white rounded-xl font-medium hover:bg-gray-800 transition-colors">
            Explore stays
          </Link>
        </div>
      )}
    </main>
  );
}
