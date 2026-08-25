'use client';

import { useState, useEffect, useRef } from 'react';
import Link from 'next/link';

interface BookingWidgetProps {
  propertyId: string;
  pricePerNight: number;
  rooms?: { name: string; price: number; quantity: number }[];
}

export default function BookingWidget({ propertyId, pricePerNight, rooms = [] }: BookingWidgetProps) {
  // Set default dates: checkin today, checkout tomorrow (1 night)
  const today = new Date();
  const tomorrow = new Date(today);
  tomorrow.setDate(today.getDate() + 1);

  const formatDate = (date: Date) => date.toISOString().split('T')[0];

  const [checkin, setCheckin] = useState(formatDate(today));
  const [checkout, setCheckout] = useState(formatDate(tomorrow));
  const [guests, setGuests] = useState('1 guest');
  const [nights, setNights] = useState(1);
  const [adults, setAdults] = useState(1);
  const [children, setChildren] = useState(0);
  const [guestDropdownOpen, setGuestDropdownOpen] = useState(false);
  const guestDropdownRef = useRef<HTMLDivElement>(null);

  const [selectedRoom, setSelectedRoom] = useState(rooms.length > 0 ? rooms[0].name : '');
  const [currentPrice, setCurrentPrice] = useState(rooms.length > 0 ? rooms[0].price : pricePerNight);

  useEffect(() => {
    if (selectedRoom && rooms.length > 0) {
      const room = rooms.find(r => r.name === selectedRoom);
      if (room) {
        setCurrentPrice(room.price);
      }
    }
  }, [selectedRoom, rooms]);

  useEffect(() => {
    const totalGuests = adults + children;
    setGuests(`${totalGuests} guest${totalGuests > 1 ? 's' : ''}`);
  }, [adults, children]);

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (guestDropdownRef.current && !guestDropdownRef.current.contains(event.target as Node)) {
        setGuestDropdownOpen(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  // Automatically adjust checkout date if user picks a checkin date that is after or equal to checkout
  const handleCheckinChange = (newCheckin: string) => {
    setCheckin(newCheckin);
    const start = new Date(newCheckin);
    const end = new Date(checkout);
    if (end <= start || isNaN(end.getTime())) {
      const nextDay = new Date(start);
      nextDay.setDate(start.getDate() + 1);
      setCheckout(formatDate(nextDay));
    }
  };

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

  const subtotal = currentPrice * nights;
  const total = subtotal;

  // URL parameters for passing data to checkout
  const checkoutUrl = `/checkout/${propertyId}?checkin=${checkin}&checkout=${checkout}&guests=${encodeURIComponent(guests)}&price=${currentPrice}${selectedRoom ? `&roomName=${encodeURIComponent(selectedRoom)}` : ''}`;

  return (
    <div className="sticky top-24 bg-white border border-gray-200 rounded-2xl p-6 shadow-xl shadow-gray-200/50">
      <div className="flex items-end justify-between mb-6">
        <div className="flex items-baseline gap-1">
          <span className="text-2xl font-bold text-gray-900">₹{currentPrice.toLocaleString()}</span>
          <span className="text-gray-600">/ night</span>
        </div>
      </div>

      {rooms && rooms.length > 0 && (
        <div className="mb-4">
          <label className="text-xs font-bold uppercase tracking-wider text-gray-900 mb-1.5 block">Select Room Type</label>
          <div className="relative">
            <select 
              value={selectedRoom}
              onChange={(e) => setSelectedRoom(e.target.value)}
              className="w-full appearance-none bg-white border border-gray-300 rounded-xl px-4 py-3 text-sm font-medium text-gray-900 outline-none focus:border-gray-900 focus:ring-1 focus:ring-gray-900 cursor-pointer shadow-sm transition-all"
            >
              {rooms.map((r, idx) => (
                <option key={idx} value={r.name}>{r.name} - ₹{r.price}/night</option>
              ))}
            </select>
            <div className="pointer-events-none absolute inset-y-0 right-0 flex items-center px-4 text-gray-500">
              <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" /></svg>
            </div>
          </div>
        </div>
      )}

      <div className="border border-gray-300 rounded-xl mb-4">
        <div className="flex border-b border-gray-300">
          <div className="w-1/2 p-3 border-r border-gray-300 hover:bg-gray-50 cursor-pointer transition-colors relative rounded-tl-xl">
            <label className="text-[10px] font-bold uppercase tracking-wider text-gray-900">Check-in</label>
            <input 
              type="date" 
              className="w-full text-sm outline-none bg-transparent cursor-pointer font-medium text-gray-800" 
              value={checkin} 
              onChange={(e) => handleCheckinChange(e.target.value)}
              min={formatDate(new Date())}
            />
          </div>
          <div className="w-1/2 p-3 hover:bg-gray-50 cursor-pointer transition-colors relative rounded-tr-xl">
            <label className="text-[10px] font-bold uppercase tracking-wider text-gray-900">Checkout</label>
            <input 
              type="date" 
              className="w-full text-sm outline-none bg-transparent cursor-pointer font-medium text-gray-800" 
              value={checkout} 
              onChange={(e) => setCheckout(e.target.value)}
              min={checkin}
            />
          </div>
        </div>
        <div 
          className="p-3 hover:bg-gray-50 cursor-pointer transition-colors relative rounded-b-xl"
          ref={guestDropdownRef}
        >
          <div onClick={() => setGuestDropdownOpen(!guestDropdownOpen)} className="w-full h-full flex items-center justify-between">
            <div>
              <label className="text-[10px] font-bold uppercase tracking-wider text-gray-900 cursor-pointer">Guests</label>
              <div className="w-full text-sm mt-1 font-medium text-gray-800">
                {guests}
              </div>
            </div>
            <div className="text-gray-500 mr-2 pointer-events-none">
              <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="m6 9 6 6 6-6"/></svg>
            </div>
          </div>
          
          {guestDropdownOpen && (
            <div 
              onClick={(e) => e.stopPropagation()} 
              className="absolute right-0 top-full mt-2 bg-white border border-gray-200 rounded-3xl shadow-[0_10px_40px_rgba(0,0,0,0.14)] p-6 w-[320px] z-50 animate-in fade-in zoom-in-95 duration-150 cursor-default"
            >
              {/* Adults */}
              <div className="flex items-center justify-between py-3 border-b border-gray-100">
                <div className="flex flex-col">
                  <span className="text-[15px] font-bold text-gray-900">Adults</span>
                  <span className="text-[12px] text-gray-500">Ages 13 or above</span>
                </div>
                <div className="flex items-center gap-3">
                  <button
                    type="button"
                    onClick={() => setAdults(Math.max(1, adults - 1))}
                    disabled={adults <= 1}
                    className="w-8 h-8 rounded-full border border-gray-300 flex items-center justify-center text-gray-700 hover:border-gray-900 transition-all disabled:opacity-30 disabled:cursor-not-allowed text-base font-bold bg-white cursor-pointer shadow-sm"
                  >
                    -
                  </button>
                  <span className="w-5 text-center font-bold text-gray-900 text-base">{adults}</span>
                  <button
                    type="button"
                    onClick={() => setAdults(adults + 1)}
                    className="w-8 h-8 rounded-full border border-gray-300 flex items-center justify-center text-gray-700 hover:border-gray-900 transition-all text-base font-bold bg-white cursor-pointer shadow-sm"
                  >
                    +
                  </button>
                </div>
              </div>

              {/* Children */}
              <div className="flex items-center justify-between py-3">
                <div className="flex flex-col">
                  <span className="text-[15px] font-bold text-gray-900">Children</span>
                  <span className="text-[12px] text-gray-500">Ages 2–12</span>
                </div>
                <div className="flex items-center gap-3">
                  <button
                    type="button"
                    onClick={() => setChildren(Math.max(0, children - 1))}
                    disabled={children === 0}
                    className="w-8 h-8 rounded-full border border-gray-300 flex items-center justify-center text-gray-700 hover:border-gray-900 transition-all disabled:opacity-30 disabled:cursor-not-allowed text-base font-bold bg-white cursor-pointer shadow-sm"
                  >
                    -
                  </button>
                  <span className="w-5 text-center font-bold text-gray-900 text-base">{children}</span>
                  <button
                    type="button"
                    onClick={() => setChildren(children + 1)}
                    className="w-8 h-8 rounded-full border border-gray-300 flex items-center justify-center text-gray-700 hover:border-gray-900 transition-all text-base font-bold bg-white cursor-pointer shadow-sm"
                  >
                    +
                  </button>
                </div>
              </div>

              <div className="mt-2 pt-2 border-t border-gray-100 flex justify-end">
                <button 
                  type="button"
                  onClick={() => setGuestDropdownOpen(false)}
                  className="text-[13px] font-bold text-gray-900 hover:text-brand-red underline transition-colors px-2 py-1 cursor-pointer"
                >
                  Done
                </button>
              </div>
            </div>
          )}
        </div>
      </div>

      {nights > 0 ? (
        <Link href={checkoutUrl} className="block text-center w-full bg-brand-red text-white font-semibold py-3.5 rounded-xl hover:bg-red-600 transition-colors shadow-md shadow-brand-red/20 active:scale-[0.98] cursor-pointer">
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
              <span className="underline cursor-pointer">₹{currentPrice.toLocaleString()} x {nights} {nights === 1 ? 'night' : 'nights'}</span>
              <span>₹{subtotal.toLocaleString()}</span>
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
