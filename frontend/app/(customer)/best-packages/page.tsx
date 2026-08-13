import Link from "next/link";
import { Star } from "lucide-react";

export const revalidate = 60; // Revalidate every 60 seconds

async function fetchPackages() {
  try {
    let apiUrl = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:5000/api';
    let serverApiUrl = apiUrl;
    if (typeof window === 'undefined') {
      if (serverApiUrl.startsWith('/')) {
        serverApiUrl = process.env.NEXT_PUBLIC_BACKEND_URL || 'http://localhost:5000/api';
      }
      if (serverApiUrl.includes('localhost')) {
        serverApiUrl = serverApiUrl.replace('localhost', '127.0.0.1');
      }
    }
    
    const res = await fetch(`${serverApiUrl}/packages`, { next: { revalidate: 60 } });
    if (!res.ok) {
      return { packages: [], error: 'Failed to fetch packages' };
    }
    const data = await res.json();
    return { packages: data, error: null };
  } catch (error: any) {
    return { packages: [], error: error.message || 'Unknown network error' };
  }
}

export default async function BestPackagesPage() {
  const { packages, error } = await fetchPackages();

  return (
    <main className="max-w-[2520px] mx-auto xl:px-20 md:px-10 sm:px-2 px-4 py-8">
      <div className="mb-8">
        <h1 className="text-4xl font-extrabold text-gray-900 mb-2">Best Packages in Mahabaleshwar</h1>
        <p className="text-lg text-gray-600">Curated combinations of the best stays and activities.</p>
      </div>

      {error && (
        <div className="text-center py-24">
          <h2 className="text-2xl font-bold text-gray-900 mb-2">Oops, something went wrong</h2>
          <p className="text-gray-500">{error}</p>
        </div>
      )}

      {packages && packages.length > 0 ? (
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
          {packages.map((pkg: any) => (
            <Link href={`/best-packages/${pkg._id}`} key={pkg._id} className="group cursor-pointer">
              <div className="relative aspect-square overflow-hidden rounded-2xl mb-3">
                <img
                  src={pkg.images[0] || 'https://images.unsplash.com/photo-1512917774080-9991f1c4c750?auto=format&fit=crop&q=80'}
                  alt={pkg.title}
                  className="object-cover w-full h-full transition-transform duration-500 group-hover:scale-105"
                />
                <div className="absolute top-3 left-3 bg-white/95 backdrop-blur-sm px-2.5 py-1 rounded-full shadow-sm text-xs font-bold text-brand-red flex items-center gap-1">
                  <Star size={12} className="fill-brand-red" />
                  Package Deal
                </div>
              </div>
              <div className="flex flex-col gap-1">
                <div className="flex justify-between items-start">
                  <h3 className="text-[15px] font-bold text-gray-900 leading-tight">{pkg.title}</h3>
                </div>
                <p className="text-[14px] text-gray-500 truncate">{pkg.duration}</p>
                <div className="mt-1 flex items-baseline gap-1">
                  <span className="text-[15px] font-bold text-gray-900">₹{pkg.price.toLocaleString()}</span>
                  <span className="text-[14px] text-gray-900">total</span>
                </div>
              </div>
            </Link>
          ))}
        </div>
      ) : (
        !error && (
          <div className="text-center py-24">
            <h2 className="text-2xl font-bold text-gray-900 mb-2">No packages available</h2>
            <p className="text-gray-500">Check back later for exciting combo deals.</p>
          </div>
        )
      )}
    </main>
  );
}
