// @desc    Property Detail Page - Fetches real data from API
import Link from 'next/link';
import Image from 'next/image';
import { Star, MapPin, Share, Heart, ChevronLeft } from 'lucide-react';
import PropertyMapWrapper from '@/components/PropertyMapWrapper';
import BookingWidget from '@/components/BookingWidget';
import ReviewSection from '@/components/ReviewSection';

interface PropertyDetail {
  _id: string;
  title: string;
  description: string;
  price: number;
  rating: number;
  reviews: number;
  images: string[];
  amenities: string[];
  type: string;
  location: string;
  coordinates?: { lat: number; lng: number };
}

async function fetchProperty(id: string): Promise<PropertyDetail | null> {
  try {
    const apiUrl = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:5000/api';
    const res = await fetch(`${apiUrl}/properties/${id}`, { next: { revalidate: 60 } });
    if (!res.ok) return null;
    return await res.json();
  } catch (error) {
    console.error('Failed to fetch property:', error);
    return null;
  }
}

export default async function PropertyDetailsPage({ params }: { params: Promise<{ id: string }> }) {
  const resolvedParams = await params;
  const propId = resolvedParams.id;
  const property = await fetchProperty(propId);

  // Fallback images for the gallery if property doesn't have enough
  const fallbackImages = [
    'https://images.unsplash.com/photo-1542314831-c6a4d27ce66b?auto=format&fit=crop&w=1200&q=80',
    'https://images.unsplash.com/photo-1600596542815-ffad4c1539a9?auto=format&fit=crop&w=600&q=80',
    'https://images.unsplash.com/photo-1512917774080-9991f1c4c750?auto=format&fit=crop&w=600&q=80',
    'https://images.unsplash.com/photo-1560185127-6ed189bf02f4?auto=format&fit=crop&w=600&q=80',
    'https://images.unsplash.com/photo-1584622650111-993a426fbf0a?auto=format&fit=crop&w=600&q=80',
  ];

  if (!property) {
    return (
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <Link href="/" className="inline-flex items-center text-sm font-medium text-gray-600 hover:text-gray-900 mb-4 transition-colors">
          <ChevronLeft className="w-4 h-4 mr-1" /> Back to all properties
        </Link>
        <div className="text-center py-24">
          <h2 className="text-2xl font-bold text-gray-900 mb-2">Property not found</h2>
          <p className="text-gray-500">This property may have been removed or doesn't exist.</p>
        </div>
      </main>
    );
  }

  const baseUrl = (process.env.NEXT_PUBLIC_API_URL || 'http://localhost:5000/api').replace('/api', '');
  const galleryImages = property.images.length > 0
    ? [...property.images.map(img => img.startsWith('/') ? `${baseUrl}${img}` : img), ...fallbackImages].slice(0, 5)
    : fallbackImages;

  return (
    <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      {/* Breadcrumbs */}
      <div className="mb-6">
        <Link href="/" className="inline-flex items-center text-sm font-medium text-gray-600 hover:text-gray-900 mb-4 transition-colors">
          <ChevronLeft className="w-4 h-4 mr-1" /> Back to all properties
        </Link>
        <h1 className="text-3xl sm:text-4xl font-bold tracking-tight text-gray-900">{property.title}</h1>
        <div className="flex items-center justify-between mt-2 flex-wrap gap-4">
          <div className="flex items-center gap-4 text-sm text-gray-600 font-medium">
            <span className="flex items-center gap-1"><Star className="w-4 h-4 fill-current text-gray-900" /> {property.rating.toFixed(2)} ({property.reviews} reviews)</span>
            <span className="flex items-center gap-1"><MapPin className="w-4 h-4" /> {property.location}</span>
          </div>
          <div className="flex items-center gap-4 text-sm font-medium">
            <button className="flex items-center gap-2 hover:bg-gray-100 px-3 py-2 rounded-lg transition-colors cursor-pointer">
              <Share className="w-4 h-4" /> Share
            </button>
            <button className="flex items-center gap-2 hover:bg-gray-100 px-3 py-2 rounded-lg transition-colors cursor-pointer">
              <Heart className="w-4 h-4" /> Save
            </button>
          </div>
        </div>
      </div>

      {/* Image Gallery Grid */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-2 rounded-2xl overflow-hidden mb-12 h-[50vh] md:h-[60vh]">
        <div className="md:col-span-2 md:row-span-2 relative w-full h-full">
          <Image src={galleryImages[0]} alt="Main View" fill className="object-cover hover:scale-105 transition-transform duration-500 cursor-pointer" />
        </div>
        {galleryImages.slice(1, 5).map((img, idx) => (
          <div key={idx} className="relative w-full h-full hidden md:block">
            <Image src={img} alt={`View ${idx + 2}`} fill className="object-cover hover:scale-105 transition-transform duration-500 cursor-pointer" />
          </div>
        ))}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-12 relative">
        {/* Main Content */}
        <div className="lg:col-span-2 space-y-10">
          <div className="flex items-center justify-between border-b pb-8">
            <div>
              <h2 className="text-2xl font-bold tracking-tight text-gray-900 mb-2">{property.type} in {property.location}</h2>
              <p className="text-gray-600">Hosted on Mahastays</p>
            </div>
          </div>

          <div className="space-y-6">
            <h3 className="text-xl font-bold tracking-tight">About this space</h3>
            <p className="text-gray-600 leading-relaxed">{property.description}</p>
          </div>

          {property.amenities && property.amenities.length > 0 && (
            <div className="border-t pt-8">
              <h3 className="text-xl font-bold tracking-tight mb-6">What this place offers</h3>
              <div className="grid grid-cols-2 gap-y-4 gap-x-8 text-gray-700">
                {property.amenities.map((amenity, idx) => (
                  <div key={idx} className="flex items-center gap-3">
                    <span className="w-6 h-6 rounded-full bg-gray-100 flex items-center justify-center text-xs font-bold text-gray-500">✓</span>
                    {amenity}
                  </div>
                ))}
              </div>
            </div>
          )}

          <div className="border-t pt-8 pb-8">
            <h3 className="text-xl font-bold tracking-tight mb-6">Where you'll be</h3>
            <PropertyMapWrapper 
              location={property.coordinates || { lat: 17.9237, lng: 73.6538 }} 
              title={property.title} 
            />
            <p className="mt-4 text-sm text-gray-600">{property.location}, Mahabaleshwar, Maharashtra, India</p>
          </div>

          {/* Reviews Section */}
          <ReviewSection
            propertyId={propId}
            avgRating={property.rating}
            totalReviews={property.reviews}
          />
        </div>

        {/* Booking Widget Sidebar */}
        <div className="lg:col-span-1 border-t lg:border-t-0 pt-8 lg:pt-0">
          <BookingWidget propertyId={propId} pricePerNight={property.price} />
        </div>
      </div>
    </main>
  );
}
