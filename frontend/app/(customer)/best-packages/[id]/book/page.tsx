'use client';

import { useState, useEffect } from 'react';
import { useRouter, useParams } from 'next/navigation';
import { useAuth } from '@/context/AuthContext';
import { ArrowLeft, Loader2, Calendar, Users, CreditCard } from 'lucide-react';
import api from '@/lib/api';

export default function PackageBookingPage() {
  const router = useRouter();
  const params = useParams();
  const { id } = params;
  const { user, loading: authLoading } = useAuth();
  
  const [pkg, setPkg] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [bookingLoading, setBookingLoading] = useState(false);
  const [startDate, setStartDate] = useState('');
  const [adults, setAdults] = useState(1);
  const [children, setChildren] = useState(0);

  useEffect(() => {
    const fetchPkg = async () => {
      try {
        const res = await api.get(`/packages/${id}`);
        setPkg(res.data);
      } catch (err) {
        console.error('Failed to fetch package', err);
        router.push('/best-packages');
      } finally {
        setLoading(false);
      }
    };
    if (id) fetchPkg();
  }, [id, router]);

  if (authLoading || loading) {
    return (
      <div className="flex items-center justify-center min-h-[60vh]">
        <Loader2 className="w-8 h-8 animate-spin text-gray-400" />
      </div>
    );
  }

  if (!user) {
    router.push(`/login?redirect=/best-packages/${id}/book`);
    return null;
  }

  const handleBooking = async () => {
    if (!startDate) {
      alert('Please select a start date');
      return;
    }
    setBookingLoading(true);
    try {
      // In a real app, this would integrate with Razorpay and call a booking endpoint
      // We'll mock the success for now as we haven't built the PackageBooking endpoints yet
      await new Promise(resolve => setTimeout(resolve, 2000)); 
      alert('Booking successful! Admin will contact you shortly.');
      router.push('/bookings');
    } catch (err) {
      alert('Booking failed');
      setBookingLoading(false);
    }
  };

  return (
    <main className="max-w-[1120px] mx-auto px-4 sm:px-8 py-8 md:py-12">
      <button onClick={() => router.back()} className="flex items-center gap-2 font-bold text-gray-900 mb-8 hover:bg-gray-100 p-2 rounded-full w-fit -ml-2 transition">
        <ArrowLeft size={20} />
      </button>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-12 lg:gap-24">
        {/* Left Column: Form */}
        <div>
          <h1 className="text-[32px] font-extrabold text-gray-900 tracking-tight mb-8">Request to book</h1>

          <div className="space-y-8">
            <section>
              <h2 className="text-xl font-bold text-gray-900 mb-4">Your trip</h2>
              
              <div className="flex justify-between items-start mb-6">
                <div>
                  <h3 className="font-bold text-gray-900">Dates</h3>
                  <p className="text-gray-500 mt-1">Select your start date</p>
                </div>
                <input 
                  type="date" 
                  min={new Date().toISOString().split('T')[0]}
                  value={startDate}
                  onChange={(e) => setStartDate(e.target.value)}
                  className="font-semibold underline cursor-pointer bg-transparent outline-none p-1 border-b border-gray-900"
                />
              </div>

              <div className="flex justify-between items-start">
                <div>
                  <h3 className="font-bold text-gray-900">Guests</h3>
                  <p className="text-gray-500 mt-1">{adults} adult{adults > 1 ? 's' : ''}, {children} child{children !== 1 ? 'ren' : ''}</p>
                </div>
                <div className="flex flex-col gap-2">
                  <div className="flex items-center gap-2">
                    <span className="text-xs w-10">Adults</span>
                    <button onClick={() => setAdults(Math.max(1, adults - 1))} className="w-6 h-6 rounded-full border border-gray-300 flex items-center justify-center">-</button>
                    <span className="w-4 text-center text-sm">{adults}</span>
                    <button onClick={() => setAdults(adults + 1)} className="w-6 h-6 rounded-full border border-gray-300 flex items-center justify-center">+</button>
                  </div>
                  <div className="flex items-center gap-2">
                    <span className="text-xs w-10">Kids</span>
                    <button onClick={() => setChildren(Math.max(0, children - 1))} className="w-6 h-6 rounded-full border border-gray-300 flex items-center justify-center">-</button>
                    <span className="w-4 text-center text-sm">{children}</span>
                    <button onClick={() => setChildren(children + 1)} className="w-6 h-6 rounded-full border border-gray-300 flex items-center justify-center">+</button>
                  </div>
                </div>
              </div>
            </section>
            
            <hr className="border-gray-200" />
            
            <section>
              <h2 className="text-xl font-bold text-gray-900 mb-4 flex items-center gap-2">
                <CreditCard className="w-5 h-5 text-gray-700" />
                Pay with
              </h2>
              <div className="border border-gray-900 rounded-xl p-4 flex justify-between items-center bg-gray-50 cursor-pointer">
                <div className="flex items-center gap-3">
                  <div className="w-8 h-5 bg-gray-300 rounded"></div>
                  <span className="font-semibold text-gray-900 text-sm">Credit or debit card / UPI</span>
                </div>
              </div>
            </section>

            <hr className="border-gray-200" />
            
            <p className="text-xs text-gray-500 leading-relaxed font-medium">
              By selecting the button below, I agree to the Host's House Rules, Ground rules for guests, MahaStays's Rebooking and Refund Policy, and that MahaStays can charge my payment method if I'm responsible for damage.
            </p>

            <button 
              onClick={handleBooking}
              disabled={bookingLoading}
              className="w-full md:w-auto bg-brand-red text-white py-3.5 px-8 rounded-xl font-bold text-lg hover:bg-red-600 transition shadow-md active:scale-95 disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2"
            >
              {bookingLoading && <Loader2 size={20} className="animate-spin" />}
              {bookingLoading ? 'Processing...' : 'Confirm and pay'}
            </button>
          </div>
        </div>

        {/* Right Column: Order Summary */}
        <div className="relative">
          <div className="sticky top-28 bg-white border border-gray-200 rounded-2xl shadow-xl p-6">
            <div className="flex gap-4 mb-6">
              <img src={pkg.images[0]} className="w-28 h-24 object-cover rounded-xl border border-gray-200 shadow-sm" alt="Package" />
              <div className="flex flex-col justify-between py-1">
                <div>
                  <span className="text-xs text-gray-500 font-semibold mb-1 block uppercase tracking-wider">{pkg.duration}</span>
                  <h3 className="font-bold text-gray-900 leading-tight text-sm">{pkg.title}</h3>
                </div>
              </div>
            </div>

            <hr className="border-gray-200 my-6" />
            
            <h2 className="text-xl font-bold text-gray-900 mb-4">Price details</h2>
            
            <div className="space-y-4 font-medium text-[15px] text-gray-700">
              <div className="flex justify-between">
                <span>Package Base Price</span>
                <span>₹{pkg.price.toLocaleString()}</span>
              </div>
              <div className="flex justify-between text-brand-red">
                <span>Combo Discount</span>
                <span>-₹{(pkg.price * 0.1).toLocaleString()}</span>
              </div>
              <div className="flex justify-between">
                <span className="underline cursor-pointer">Taxes</span>
                <span>₹{((pkg.price * 0.9) * 0.18).toLocaleString()}</span>
              </div>
            </div>
            
            <hr className="border-gray-200 my-6" />
            
            <div className="flex justify-between font-extrabold text-gray-900 text-[17px]">
              <span>Total (INR)</span>
              <span>₹{((pkg.price * 0.9) * 1.18).toLocaleString()}</span>
            </div>
          </div>
        </div>
      </div>
    </main>
  );
}
