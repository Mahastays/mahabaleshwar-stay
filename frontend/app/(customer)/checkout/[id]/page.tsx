// Checkout page - fetches real property data from the API
import Link from 'next/link';
import { ChevronLeft, Star } from 'lucide-react';
import BookingForm from './BookingForm';
import { notFound } from 'next/navigation';

interface PropertyDetail {
  _id: string;
  title: string;
  price: number;
  rating: number;
  images: string[];
  type: string;
  location: string;
}

async function fetchProperty(id: string): Promise<PropertyDetail | null> {
  try {
    const res = await fetch(`http://localhost:5000/api/properties/${id}`, { cache: 'no-store' });
    if (!res.ok) return null;
    return await res.json();
  } catch (error) {
    console.error('Failed to fetch property:', error);
    return null;
  }
}

export default async function CheckoutPage({ 
  params,
  searchParams
}: { 
  params: Promise<{ id: string }>,
  searchParams: Promise<{ checkin?: string; checkout?: string; guests?: string; price?: string }>
}) {
  const resolvedParams = await params;
  const resolvedSearchParams = await searchParams;
  const propId = resolvedParams.id;
  const property = await fetchProperty(propId);

  if (!property) return notFound();

  const checkin = resolvedSearchParams.checkin || 'Not selected';
  const checkout = resolvedSearchParams.checkout || 'Not selected';
  const guests = resolvedSearchParams.guests || '1 guest';

  let nights = 0;
  if (checkin !== 'Not selected' && checkout !== 'Not selected') {
    const start = new Date(checkin);
    const end = new Date(checkout);
    const diffDays = Math.ceil(Math.abs(end.getTime() - start.getTime()) / (1000 * 60 * 60 * 24));
    nights = diffDays;
  } else {
    nights = 5;
  }

  const priceNum = resolvedSearchParams.price ? parseInt(resolvedSearchParams.price) : property.price;
  const subtotal = priceNum * nights;
  const cleaningFee = 1500;
  const serviceFee = 3800;
  const total = nights > 0 ? subtotal + cleaningFee + serviceFee : 0;

  const propertyImage = property.images?.[0]
    ? (property.images[0].startsWith('/') ? `http://localhost:5000${property.images[0]}` : property.images[0])
    : 'https://images.unsplash.com/photo-1542314831-c6a4d14d8c53?auto=format&fit=crop&q=80';

  return (
    <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10">
      <div className="mb-8">
        <Link href={`/properties/${propId}`} className="inline-flex items-center text-sm font-medium text-gray-600 hover:text-gray-900 mb-6 transition-colors">
          <ChevronLeft className="w-4 h-4 mr-1" />
          Request to book
        </Link>
        <h1 className="text-3xl font-bold tracking-tight text-gray-900">Confirm your reservation</h1>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-12">
        {/* Left Side: Forms */}
        <div className="lg:col-span-7 space-y-10">
          <section>
            <h2 className="text-xl font-bold mb-4">Your trip</h2>
            <div className="flex justify-between mb-4">
              <div>
                <p className="font-semibold text-gray-900">Dates</p>
                <p className="text-gray-600">{checkin} to {checkout}</p>
              </div>
              <Link href={`/properties/${propId}`} className="text-md font-semibold underline text-gray-900 hover:text-gray-700">Edit</Link>
            </div>
            <div className="flex justify-between">
              <div>
                <p className="font-semibold text-gray-900">Guests</p>
                <p className="text-gray-600">{decodeURIComponent(guests)}</p>
              </div>
              <Link href={`/properties/${propId}`} className="text-md font-semibold underline text-gray-900 hover:text-gray-700">Edit</Link>
            </div>
          </section>

          <hr className="border-gray-200" />

          <section>
            <h2 className="text-xl font-bold mb-6">Confirm booking</h2>
            <BookingForm 
              totalAmount={total} 
              propertyId={propId}
              checkin={checkin}
              checkout={checkout}
              guests={guests}
            />
          </section>
        </div>

        {/* Right Side: Order Summary */}
        <div className="lg:col-span-5">
          <div className="sticky top-28 bg-white border border-gray-200 rounded-2xl p-6 shadow-xl shadow-gray-200/50">
            <div className="flex gap-4 pb-6 border-b border-gray-200">
              <div className="w-28 h-24 relative rounded-xl overflow-hidden flex-shrink-0">
                <img src={propertyImage} alt={property.title} className="w-full h-full object-cover" />
              </div>
              <div className="flex flex-col flex-1">
                <span className="text-xs text-gray-500 font-medium uppercase tracking-wider mb-1">{property.type}</span>
                <h3 className="font-medium text-gray-900 text-sm leading-tight mb-2">{property.title}</h3>
                <div className="flex items-center gap-1 text-xs text-gray-900 mt-auto">
                  <Star className="w-3.5 h-3.5 fill-current" />
                  <span className="font-semibold">{property.rating.toFixed(2)}</span>
                </div>
              </div>
            </div>

            <div className="pt-6">
              <h3 className="text-lg font-bold mb-4">Price details</h3>
              <div className="space-y-4 text-gray-600">
                <div className="flex justify-between">
                  <span>₹{priceNum.toLocaleString()} x {nights} nights</span>
                  <span>₹{subtotal.toLocaleString()}</span>
                </div>
                <div className="flex justify-between">
                  <span>Cleaning fee</span>
                  <span>₹{cleaningFee.toLocaleString()}</span>
                </div>
                <div className="flex justify-between">
                  <span>Service fee</span>
                  <span>₹{serviceFee.toLocaleString()}</span>
                </div>
              </div>

              <div className="border-t border-gray-200 pt-4 mt-6">
                <div className="flex justify-between font-bold text-gray-900 text-lg">
                  <span>Total (INR)</span>
                  <span>₹{total.toLocaleString()}</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </main>
  );
}
