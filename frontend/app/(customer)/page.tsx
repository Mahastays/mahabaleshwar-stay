import CategoryScroller from "@/components/CategoryScroller";
import PropertyCard from "@/components/PropertyCard";
import ActivitiesSection from "@/components/ActivitiesSection";
import WhyChooseUs from "@/components/WhyChooseUs";
import BlogSection from "@/components/BlogSection";
import SupportSection from "@/components/SupportSection";

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
  isFeatured: boolean;
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
    rating: 4.9,
    category: 'Villa',
    isFeatured: true,
  },
  {
    id: 'd2',
    image: 'https://images.unsplash.com/photo-1510312305653-8ed496efae75?auto=format&fit=crop&q=80',
    isFavorite: false,
    title: 'Cozy Forest Tent',
    distance: 'Tapola Road',
    dateRange: 'Any week',
    price: '₹1,500',
    rating: 4.7,
    category: 'Tent',
    isFeatured: false,
  },
  {
    id: 'd3',
    image: 'https://images.unsplash.com/photo-1571003123894-1f0594d2b5d9?auto=format&fit=crop&q=80',
    isFavorite: false,
    title: 'Heritage Resort Stay',
    distance: 'Panchgani',
    dateRange: 'Any week',
    price: '₹12,000',
    rating: 5.0,
    category: 'Resort',
    isFeatured: true,
  },
  {
    id: 'd4',
    image: 'https://images.unsplash.com/photo-1499793983690-e29da59ef1c2?auto=format&fit=crop&q=80',
    isFavorite: false,
    title: 'Valley View Cottage',
    distance: 'Old Mahabaleshwar',
    dateRange: 'Any week',
    price: '₹3,500',
    rating: 4.5,
    category: 'Cottage',
    isFeatured: false,
  },
  {
    id: 'd5',
    image: 'https://images.unsplash.com/photo-1476514525535-07fb3b4ae5f1?auto=format&fit=crop&q=80',
    isFavorite: false,
    title: 'Lakeside Wooden Cabin',
    distance: 'Shivsagar Lake',
    dateRange: 'Any week',
    price: '₹2,800',
    rating: 4.8,
    category: 'Cottage',
    isFeatured: false,
  },
  {
    id: 'd6',
    image: 'https://images.unsplash.com/photo-1522708323590-d24dbb6b0267?auto=format&fit=crop&q=80',
    isFavorite: false,
    title: 'Modern Apartment',
    distance: 'City Center',
    dateRange: 'Any week',
    price: '₹4,000',
    rating: 4.2,
    category: 'Homestay',
    isFeatured: false,
  },
  {
    id: 'd7',
    image: 'https://images.unsplash.com/photo-1502672260266-1c1de2d9d000?auto=format&fit=crop&q=80',
    isFavorite: false,
    title: 'Boutique Hotel Suite',
    distance: 'Parsi Point',
    dateRange: 'Any week',
    price: '₹8,500',
    rating: 4.6,
    category: 'Hotel',
    isFeatured: false,
  }
];

async function fetchProperties(): Promise<{ properties: Property[], error: boolean }> {
  try {
    let apiUrl = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:5000/api';
    
    let serverApiUrl = apiUrl;
    if (typeof window === 'undefined') {
      // Fix for Node fetch requiring absolute URLs during SSR (AWS Amplify)
      if (serverApiUrl.startsWith('/')) {
        serverApiUrl = process.env.BACKEND_URL || 'http://localhost:5000/api';
      }
      // Fix for Next.js 14+ server-side fetch on Windows resolving localhost to ::1 instead of 127.0.0.1
      if (serverApiUrl.includes('localhost')) {
        serverApiUrl = serverApiUrl.replace('localhost', '127.0.0.1');
      }
    }
    
    const baseUrl = apiUrl.replace('/api', '');
    const res = await fetch(`${serverApiUrl}/properties`, { next: { revalidate: 60 } });
    if (!res.ok) return { properties: dummyProperties, error: false };
    const data = await res.json();
    
    if (!data || data.length === 0) {
      return { properties: dummyProperties, error: false };
    }
    
    const properties = data.map((p: any) => ({
      id: p._id,
      image: p.images[0] ? (p.images[0].startsWith('/') ? `${baseUrl}${p.images[0]}` : p.images[0]) : '',
      isFavorite: false,
      title: p.title,
      distance: p.location,
      dateRange: 'Any week',
      price: `₹${p.price.toLocaleString()}`,
      rating: p.rating,
      category: p.type,
      isFeatured: p.isFeatured,
      coordinates: p.coordinates
    }));
    return { properties, error: false };
  } catch (error) {
    console.error('Failed to fetch properties:', error);
    return { properties: dummyProperties, error: false };
  }
}

// Helper component for rendering a dense grid section
function PropertyRow({ title, items }: { title: string; items: Property[] }) {
  if (items.length === 0) return null;
  return (
    <div className="flex flex-col mb-12">
      <div className="flex justify-between items-center mb-6 cursor-pointer group">
        <h2 className="text-2xl sm:text-3xl font-semibold text-gray-900 flex items-center">
          {title}
        </h2>
      </div>
      {/* 5 or 6 column grid for luxury feel and smaller cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 2xl:grid-cols-6 gap-6">
        {items.map((prop) => (
          <div key={prop.id}>
            <PropertyCard {...prop} />
          </div>
        ))}
      </div>
    </div>
  );
}

// Allow Next.js to await searchParams
export default async function Home({
  searchParams,
}: {
  searchParams: Promise<{ category?: string }>;
}) {
  const resolvedParams = await searchParams;
  const category = resolvedParams.category || 'All';
  const { properties: allProperties, error } = await fetchProperties();
  
  const properties = category === 'All' 
    ? allProperties 
    : allProperties.filter(p => p.category === category);

  return (
    <main>
      <CategoryScroller activeCategory={category} />
      <div className="max-w-[2520px] mx-auto xl:px-20 md:px-10 sm:px-2 px-4 py-4">
        {error ? (
          <div className="text-center py-24">
            <h2 className="text-2xl font-bold text-gray-900 mb-2">Oops, something went wrong</h2>
            <p className="text-gray-500">We couldn't load the properties. Please try again later.</p>
          </div>
        ) : properties.length > 0 ? (
          <div className="space-y-10">
            {category === 'All' ? (
              <>
                {properties.filter(p => p.isFeatured).length > 0 && (
                  <PropertyRow title="Featured Stays in Mahabaleshwar" items={properties.filter(p => p.isFeatured)} />
                )}
                <PropertyRow title="Popular homes in Mahabaleshwar" items={properties.filter(p => !p.isFeatured).slice(0, 6)} />
                <PropertyRow title="Available in Panchgani this weekend" items={properties.filter(p => !p.isFeatured).slice(6, 12)} />
              </>
            ) : (
              <PropertyRow title={`Explore ${category} in Mahabaleshwar`} items={properties} />
            )}
          </div>
        ) : (
          <div className="text-center py-24">
            <h2 className="text-2xl font-bold text-gray-900 mb-2">No properties found</h2>
            <p className="text-gray-500">We couldn't find any stays for the selected category.</p>
          </div>
        )}
      </div>

      <ActivitiesSection />
      <WhyChooseUs />
      <BlogSection />
      <SupportSection />
    </main>
  );
}
