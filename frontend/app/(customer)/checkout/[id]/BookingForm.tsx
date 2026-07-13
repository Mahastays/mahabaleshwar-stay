"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { Loader2, MessageCircle, ShieldCheck } from "lucide-react";
import { useAuth } from "@/context/AuthContext";
import api from "@/lib/api";

export default function BookingForm({ 
  totalAmount, 
  propertyId,
  checkin,
  checkout,
  guests
}: { 
  totalAmount: number, 
  propertyId: string,
  checkin: string,
  checkout: string,
  guests: string
}) {
  const [isPending, setIsPending] = useState(false);
  const [error, setError] = useState('');
  const router = useRouter();
  const { user } = useAuth();

  // You can update this to your actual WhatsApp Business Number
  const WHATSAPP_NUMBER = "917741002157"; 

  // Load Razorpay Script
  const loadRazorpayScript = () => {
    return new Promise((resolve) => {
      const script = document.createElement("script");
      script.src = "https://checkout.razorpay.com/v1/checkout.js";
      script.onload = () => resolve(true);
      script.onerror = () => resolve(false);
      document.body.appendChild(script);
    });
  };

  const handleBooking = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');

    if (!user) {
      setError('Please login to book a property.');
      return;
    }

    if (totalAmount <= 0) {
      setError('Invalid booking amount. Please select valid dates.');
      return;
    }

    setIsPending(true);

    try {
      const isScriptLoaded = await loadRazorpayScript();
      if (!isScriptLoaded) {
        setError('Failed to load payment gateway. Are you online?');
        setIsPending(false);
        return;
      }

      // Step 1: Create Order
      const orderRes = await api.post('/payment/create-order', { 
        propertyId, 
        checkInDate: checkin, 
        checkOutDate: checkout, 
        guests 
      });
      const { orderId, amount, currency, keyId } = orderRes.data;

      // Step 2: Open Razorpay Checkout
      const options = {
        key: keyId,
        amount: amount,
        currency: currency,
        name: "Mahastays",
        description: `Booking for ${propertyId}`,
        order_id: orderId,
        handler: async function (response: any) {
          try {
            // Step 3: Verify Payment & Create Booking
            await api.post('/payment/verify', {
              razorpay_payment_id: response.razorpay_payment_id,
              razorpay_order_id: response.razorpay_order_id,
              razorpay_signature: response.razorpay_signature,
              propertyId,
              checkInDate: checkin,
              checkOutDate: checkout,
              guests,
              totalPrice: totalAmount,
            });

            router.push('/checkout/success');
          } catch (verifyErr: any) {
            console.error('Payment verification failed:', verifyErr);
            setError('Payment verification failed. If money was deducted, contact support.');
            setIsPending(false);
          }
        },
        prefill: {
          name: user.name,
          email: user.email,
        },
        theme: {
          color: "#3a1b5c",
        },
        modal: {
          ondismiss: function () {
            setIsPending(false);
          }
        }
      };

      const paymentObject = new (window as any).Razorpay(options);
      paymentObject.open();

    } catch (err: any) {
      console.error('Payment initialization error:', err);
      setError('Payment initialization failed. Please try again.');
      setIsPending(false);
    }
  };

  return (
    <form onSubmit={handleBooking} className="border border-gray-200 rounded-2xl p-6 mb-8">
      {error && (
        <div className="mb-4 p-3 bg-red-50 text-red-700 rounded-lg text-sm border border-red-200">
          {error}
        </div>
      )}

      {!user && (
        <div className="mb-6 p-4 bg-yellow-50 border border-yellow-200 rounded-xl text-sm text-yellow-800">
          You need to <a href="/login" className="font-bold underline">login</a> before you can book a property.
        </div>
      )}

      <div className="space-y-6">
        <div className="bg-gray-50 rounded-xl p-4 border border-gray-100">
          <h3 className="font-semibold text-gray-900 mb-3">Booking Summary</h3>
          <div className="text-sm text-gray-600 space-y-2">
            <div className="flex justify-between">
              <span>Check-in</span>
              <span className="font-medium text-gray-900">{checkin}</span>
            </div>
            <div className="flex justify-between">
              <span>Check-out</span>
              <span className="font-medium text-gray-900">{checkout}</span>
            </div>
            <div className="flex justify-between">
              <span>Guests</span>
              <span className="font-medium text-gray-900">{decodeURIComponent(guests)}</span>
            </div>
            <div className="flex justify-between pt-2 border-t border-gray-200 mt-2">
              <span className="font-bold text-gray-900">Total (INR)</span>
              <span className="font-bold text-lg text-gray-900">₹{totalAmount.toLocaleString()}</span>
            </div>
          </div>
        </div>

        {/* Trust badges */}
        <div className="flex items-center gap-4 p-3 bg-green-50 border border-green-100 rounded-xl">
          <ShieldCheck className="w-5 h-5 text-green-600 shrink-0" />
          <p className="text-xs text-green-700">
            100% secure payment via Razorpay. Your details are safe with us.
          </p>
        </div>

        <div className="pt-2">
          <p className="text-xs text-gray-500 mb-4">
            By selecting the button below, I agree to the House Rules, Ground rules for guests, and the Cancellation policy.
          </p>

          <button 
            type="submit" 
            disabled={isPending || !user}
            className={`flex items-center justify-center gap-2 w-full bg-[#3a1b5c] text-white font-bold py-4 px-8 rounded-xl hover:bg-[#2a1342] transition-all shadow-md shadow-purple-600/20 active:scale-[0.98] ${isPending || !user ? 'opacity-70 cursor-not-allowed' : 'cursor-pointer'}`}
          >
            {isPending ? (
              <><Loader2 className="w-5 h-5 animate-spin" /> Processing...</>
            ) : (
              <>Pay Securely (₹{totalAmount.toLocaleString()})</>
            )}
          </button>
        </div>
      </div>
    </form>
  );
}
