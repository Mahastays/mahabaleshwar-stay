import Link from "next/link";
import { CheckCircle, Calendar, MapPin, ArrowRight } from "lucide-react";
import DownloadPdfButton from "@/components/DownloadPdfButton";

export default async function CheckoutSuccessPage({ searchParams }: { searchParams: Promise<{ bookingId?: string, checkin?: string, checkout?: string, guests?: string, total?: string }> }) {
  const resolvedParams = await searchParams;
  const bookingId = resolvedParams.bookingId || "BOK-9999";
  const checkin = resolvedParams.checkin || "Apr 15, 2026";
  const checkout = resolvedParams.checkout || "Apr 20, 2026";
  const guests = resolvedParams.guests || "1 guest";
  const total = resolvedParams.total || "0";

  return (
    <main className="min-h-[80vh] flex items-center justify-center py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-md w-full space-y-8 bg-white border border-gray-200 p-8 sm:p-10 rounded-3xl shadow-xl shadow-green-100 relative overflow-hidden">
        
        {/* Success Decoration */}
        <div className="absolute top-0 right-0 p-8 opacity-5">
          <CheckCircle className="w-32 h-32" />
        </div>

        <div className="text-center">
          <div className="mx-auto flex items-center justify-center h-20 w-20 rounded-full bg-green-100 mb-6">
            <CheckCircle className="h-10 w-10 text-green-600" />
          </div>
          <h2 className="text-3xl font-bold text-gray-900 tracking-tight">Booking Confirmed!</h2>
          <p className="mt-3 text-gray-500">Your reservation has been successfully placed. We've sent a confirmation email with all the details.</p>
        </div>

        <div className="bg-gray-50 rounded-2xl p-6 border border-gray-100 mt-8 relative z-10">
          <h3 className="text-xs font-bold uppercase tracking-wider text-gray-500 mb-4">Reservation Details</h3>
          
          <div className="space-y-4">
            <div className="flex justify-between items-center pb-4 border-b border-gray-200">
              <span className="text-gray-500">Booking ID</span>
              <span className="font-mono font-bold text-gray-900">{bookingId}</span>
            </div>
            
            <div className="flex items-start gap-4">
              <div className="p-2 bg-white rounded-lg border border-gray-200 shadow-sm">
                <Calendar className="w-5 h-5 text-gray-500" />
              </div>
              <div>
                <p className="font-semibold text-gray-900">{checkin} to {checkout}</p>
                <p className="text-sm text-gray-500">Check-in at 2:00 PM</p>
              </div>
            </div>

            <div className="flex items-start gap-4">
              <div className="p-2 bg-white rounded-lg border border-gray-200 shadow-sm">
                <MapPin className="w-5 h-5 text-gray-500" />
              </div>
              <div>
                <p className="font-semibold text-gray-900">Mahabaleshwar, India</p>
                <p className="text-sm text-gray-500">Exact address sent to email</p>
              </div>
            </div>
          </div>
        </div>

        <div className="flex flex-col gap-3 mt-8 relative z-10">
          <Link href="/" className="flex items-center justify-center gap-2 w-full bg-gray-900 text-white py-3.5 rounded-xl font-bold hover:bg-gray-800 transition-colors shadow-md">
            Return to Home
            <ArrowRight className="w-4 h-4" />
          </Link>
          <Link href="/bookings" className="flex items-center justify-center w-full bg-white border border-gray-300 text-gray-700 py-3.5 rounded-xl font-bold hover:bg-gray-50 transition-colors">
            View my trips
          </Link>
          <DownloadPdfButton bookingId={bookingId} checkin={checkin} checkout={checkout} guests={guests} total={total} />
        </div>
      </div>
    </main>
  );
}
