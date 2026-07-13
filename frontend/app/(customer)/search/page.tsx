import PropertyCard from "@/components/PropertyCard";

interface Property {
  id: string;
  image: string;
  isFavorite: boolean;
  title: string;
  distance: string;
  dateRange: string;
  price: string;
  rating: number;
}

async function searchProperties(query: string): Promise<Property[]> {
  try {
    const res = await fetch('http://localhost:5000/api/properties', { cache: 'no-store' });
    if (!res.ok) return [];
    const data = await res.json();
    
    let properties = data.map((p: any) => ({
      id: p._id,
      image: p.images?.[0]
        ? (p.images[0].startsWith('/') ? `http://localhost:5000${p.images[0]}` : p.images[0])
        : 'https://images.unsplash.com/photo-1542314831-c6a4d14d8c53?auto=format&fit=crop&q=80',
      isFavorite: false,
      title: p.title,
      distance: p.location,
      dateRange: 'Any week',
      price: `₹${p.price}`,
      rating: p.rating || 0,
    }));

    // Client-side filtering by query
    if (query) {
      properties = properties.filter(
        (p: Property) => p.title?.toLowerCase().includes(query) || p.distance?.toLowerCase().includes(query)
      );
    }

    return properties;
  } catch (error) {
    console.error('Failed to search properties:', error);
    return [];
  }
}

export default async function SearchPage({
  searchParams,
}: {
  searchParams: Promise<{ query?: string; checkin?: string; guests?: string }>;
}) {
  const resolvedParams = await searchParams;
  const query = resolvedParams.query?.toLowerCase() || "";
  
  const properties = await searchProperties(query);

  return (
    <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10 min-h-[70vh]">
      <div className="mb-8 border-b border-gray-200 pb-6">
        <h1 className="text-3xl font-bold tracking-tight text-gray-900 mb-2">Search Results</h1>
        <p className="text-gray-500">
          Showing {properties.length} stays {query ? `for "${query}"` : ""}
          {resolvedParams.checkin ? ` starting ${resolvedParams.checkin}` : ""}
        </p>
      </div>

      {properties.length > 0 ? (
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 2xl:grid-cols-6 gap-6">
          {properties.map((prop) => (
            <div key={prop.id} className="w-full">
              <PropertyCard {...prop} />
            </div>
          ))}
        </div>
      ) : (
        <div className="text-center py-24 bg-gray-50 rounded-2xl border border-gray-100">
          <h2 className="text-2xl font-bold text-gray-900 mb-2">No exact matches</h2>
          <p className="text-gray-500 mb-6">Try changing or removing some of your filters.</p>
        </div>
      )}
    </main>
  );
}
