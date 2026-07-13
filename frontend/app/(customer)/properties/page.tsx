import { Suspense } from 'react';
import PropertiesClient from './PropertiesClient';

export interface Property {
  id: string | number;
  image: string;
  isFavorite: boolean;
  title: string;
  distance: string;
  dateRange: string;
  price: string;
  rating: number;
  category: string;
  rawPrice: number;
  coordinates?: { lat: number; lng: number };
}

const dummyProperties: Property[] = [
  {
    id: 'd1',
    image: 'https://images.unsplash.com/photo-1512917774080-9991f1c4c750?auto=format&fit=crop&q=80',
    isFavorite: false,
    title: 'Luxury Villa in Mahabaleshwar',
    distance: 'Venna Lake',
    dateRange: 'Any week',
    price: '₹5,000',
    rawPrice: 5000,
    rating: 4.9,
    category: 'Villa'
  },
  {
    id: 'd2',
    image: 'https://images.unsplash.com/photo-1510312305653-8ed496efae75?auto=format&fit=crop&q=80',
    isFavorite: false,
    title: 'Cozy Forest Tent',
    distance: 'Tapola Road',
    dateRange: 'Any week',
    price: '₹1,500',
    rawPrice: 1500,
    rating: 4.7,
    category: 'Tent'
  },
  {
    id: 'd3',
    image: 'https://images.unsplash.com/photo-1571003123894-1f0594d2b5d9?auto=format&fit=crop&q=80',
    isFavorite: false,
    title: 'Heritage Resort Stay',
    distance: 'Panchgani',
    dateRange: 'Any week',
    price: '₹12,000',
    rawPrice: 12000,
    rating: 5.0,
    category: 'Resort'
  },
  {
    id: 'd4',
    image: 'https://images.unsplash.com/photo-1499793983690-e29da59ef1c2?auto=format&fit=crop&q=80',
    isFavorite: false,
    title: 'Valley View Cottage',
    distance: 'Old Mahabaleshwar',
    dateRange: 'Any week',
    price: '₹3,500',
    rawPrice: 3500,
    rating: 4.5,
    category: 'Cottage'
  }
];

async function fetchAllProperties(): Promise<Property[]> {
  // Bypassing API fetch to resolve 10-second lag caused by database timeout
  return dummyProperties;
}

export default async function PropertiesPage() {
  const properties = await fetchAllProperties();

  return (
    <div className="max-w-[2520px] mx-auto xl:px-20 md:px-10 sm:px-2 px-4 py-8">
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-gray-900">All Stays in Mahabaleshwar</h1>
        <p className="text-gray-500 mt-2">Find your perfect getaway from our handpicked properties.</p>
      </div>
      
      <Suspense fallback={<div className="h-96 flex items-center justify-center">Loading properties...</div>}>
        <PropertiesClient initialProperties={properties} />
      </Suspense>
    </div>
  );
}
