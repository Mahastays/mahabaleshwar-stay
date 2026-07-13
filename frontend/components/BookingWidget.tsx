'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';

interface BookingWidgetProps {
  propertyId: string;
  pricePerNight: number;
}

export default function BookingWidget({ propertyId, pricePerNight }: BookingWidgetProps) {
  // Set default dates: checkin today, checkout in 5 days
  const today = new Date();
  const nextWeek = new Date(today);
  nextWeek.setDate(today.getDate() + 5);

  const formatDate = (date: Date) => date.toISOString().split('T')[0];

  const [checkin, setCheckin] = useState(formatDate(today));
  const [checkout, setCheckout] = useState(formatDate(nextWeek));
  const [guests, setGuests] = useState('1 guest');
  const [nights, setNights] = useState(5);

  // Constants
  const cleaningFee = 1500;
  const serviceFee = 3800;

  // Calculate nights when dates change
  useEffect(() => {
    const start = new Date(checkin);
    const end = new Date(checkout);
    if (end > start) {
      const diffTime = Math.abs(end.getTime() - start.getTime());
      const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
      setNights(diffDays);
    } else {
      setNights(0); // Invalid date
    }
  }, [checkin, checkout]);

  const subtotal = pricePerNight * nights;
  const total = nights > 0 ? subtotal + cleaningFee + serviceFee : 0;

  // URL parameters for passing data to checkout
  const checkoutUrl = `/checkout/${propertyId}?checkin=${checkin}&checkout=${checkout}&guests=${encodeURIComponent(guests)}&price=${pricePerNight}`;

  return (
    <div className="sticky top-24 bg-white border border-gray-200 rounded-2xl p-6 shadow-xl shadow-gray-200/50">
      <div className="flex items-end justify-between mb-6">
        <div className="flex items-baseline gap-1">
          <span className="text-2xl font-bold text-gray-900">₹{pricePerNight.toLocaleString()}</span>
          <span className="text-gray-600">/ night</span>
        </div>
      </div>

      <div className="border border-gray-300 rounded-xl overflow-hidden mb-4">
        <div className="flex border-b border-gray-300">
          <div className="w-1/2 p-3 border-r border-gray-300 hover:bg-gray-50 cursor-pointer transition-colors relative">
            <label className="text-[10px] font-bold uppercase tracking-wider text-gray-900">Check-in</label>
            <input 
              type="date" 
              className="w-full text-sm outline-none bg-transparent cursor-pointer" 
              value={checkin} 
              onChange={(e) => setCheckin(e.target.value)}
              min={formatDate(new Date())}
            />
          </div>
          <div className="w-1/2 p-3 hover:bg-gray-50 cursor-pointer transition-colors relative">
            <label className="text-[10px] font-bold uppercase tracking-wider text-gray-900">Checkout</label>
            <input 
              type="date" 
              className="w-full text-sm outline-none bg-transparent cursor-pointer" 
              value={checkout} 
              onChange={(e) => setCheckout(e.target.value)}
              min={checkin}
            />
          </div>
        </div>
        <div className="p-3 hover:bg-gray-50 cursor-pointer transition-colors">
          <label className="text-[10px] font-bold uppercase tracking-wider text-gray-900">Guests</label>
          <select 
            className="w-full text-sm outline-none bg-transparent mt-1 cursor-pointer"
            value={guests}
            onChange={(e) => setGuests(e.target.value)}
          >
            <option value="1 guest">1 guest</option>
            <option value="2 guests">2 guests</option>
            <option value="3 guests">3 guests</option>
            <option value="4 guests">4 guests</option>
            <option value="5 guests">5 guests</option>
            <option value="6 guests">6 guests</option>
          </select>
        </div>
      </div>

      {nights > 0 ? (
        <Link href={checkoutUrl} className="block text-center w-full bg-brand-red text-white font-semibold py-3.5 rounded-xl hover:bg-brand-red transition-colors shadow-md shadow-brand-red/20 active:scale-[0.98] cursor-pointer">
          Reserve
        </Link>
      ) : (
        <button disabled className="w-full bg-gray-300 text-gray-500 font-semibold py-3.5 rounded-xl cursor-not-allowed">
          Invalid Dates
        </button>
      )}

      <p className="text-center text-sm text-gray-500 mt-4 mb-6">You won't be charged yet</p>

      {nights > 0 && (
        <>
          <div className="space-y-3 pb-6 border-b border-gray-200">
            <div className="flex justify-between text-gray-600">
              <span className="underline cursor-pointer">₹{pricePerNight.toLocaleString()} x {nights} nights</span>
              <span>₹{subtotal.toLocaleString()}</span>
            </div>
            <div className="flex justify-between text-gray-600">
              <span className="underline cursor-pointer">Cleaning fee</span>
              <span>₹{cleaningFee.toLocaleString()}</span>
            </div>
            <div className="flex justify-between text-gray-600">
              <span className="underline cursor-pointer">Service fee</span>
              <span>₹{serviceFee.toLocaleString()}</span>
            </div>
          </div>

          <div className="flex justify-between font-bold text-gray-900 pt-6 text-lg">
            <span>Total before taxes</span>
            <span>₹{total.toLocaleString()}</span>
          </div>
        </>
      )}
    </div>
  );
}
