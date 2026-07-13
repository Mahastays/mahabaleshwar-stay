'use client';

import { useState } from 'react';
import { Search, Filter } from 'lucide-react';

interface Booking {
  _id: string;
  property: string;
  guest: string;
  dates: string;
  amount: number;
  status: 'confirmed' | 'pending' | 'cancelled';
}

const DUMMY_BOOKINGS: Booking[] = [
  { _id: 'b1', property: 'Luxury Villa', guest: 'Rahul Sharma', dates: '12 Aug - 15 Aug 2026', amount: 15000, status: 'confirmed' },
  { _id: 'b2', property: 'Cozy Forest Tent', guest: 'Priya Patel', dates: '20 Aug - 22 Aug 2026', amount: 3000, status: 'pending' },
  { _id: 'b3', property: 'Heritage Resort Stay', guest: 'Amit Kumar', dates: '01 Sep - 05 Sep 2026', amount: 48000, status: 'confirmed' },
  { _id: 'b4', property: 'Luxury Villa', guest: 'Sneha Gupta', dates: '10 Sep - 12 Sep 2026', amount: 10000, status: 'cancelled' },
];

export default function VendorBookingsPage() {
  const [bookings] = useState<Booking[]>(DUMMY_BOOKINGS);
  const [filter, setFilter] = useState<'all' | 'confirmed' | 'pending' | 'cancelled'>('all');

  const filteredBookings = bookings.filter(b => filter === 'all' || b.status === filter);

  return (
    <div className="max-w-6xl mx-auto space-y-6">
      <div>
        <h2 className="text-2xl font-bold text-gray-900">Bookings</h2>
        <p className="text-gray-500 text-sm mt-1">View and manage all guest reservations.</p>
      </div>

      <div className="bg-white border border-gray-200 rounded-2xl shadow-sm overflow-hidden">
        <div className="p-4 border-b border-gray-200 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
          <div className="relative w-full max-w-xs">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
            <input 
              type="text" 
              placeholder="Search guest or property..." 
              className="w-full pl-10 pr-4 py-2 bg-gray-50 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-gray-900/20 text-sm"
            />
          </div>
          <div className="flex gap-2 w-full sm:w-auto overflow-x-auto pb-2 sm:pb-0">
            {['all', 'confirmed', 'pending', 'cancelled'].map(f => (
              <button 
                key={f}
                onClick={() => setFilter(f as any)}
                className={`px-4 py-1.5 rounded-full text-xs font-bold uppercase tracking-wider whitespace-nowrap transition-colors ${
                  filter === f 
                    ? 'bg-gray-900 text-white' 
                    : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
                }`}
              >
                {f}
              </button>
            ))}
          </div>
        </div>
        
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
              {filteredBookings.length > 0 ? filteredBookings.map((booking) => (
                <tr key={booking._id} className="hover:bg-gray-50 transition-colors">
                  <td className="px-6 py-4 font-medium text-gray-900">{booking.property}</td>
                  <td className="px-6 py-4">{booking.guest}</td>
                  <td className="px-6 py-4">{booking.dates}</td>
                  <td className="px-6 py-4 font-medium">₹{booking.amount.toLocaleString()}</td>
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
              )) : (
                <tr>
                  <td colSpan={5} className="px-6 py-8 text-center text-gray-500">
                    No bookings found for the selected filter.
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
