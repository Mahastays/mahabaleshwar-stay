import Link from "next/link";
import { Star, Home, MapPin, CheckCircle } from "lucide-react";

async function fetchPackageDetails(id: string) {
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
    
    const res = await fetch(`${serverApiUrl}/packages/${id}`, { next: { revalidate: 60 } });
    if (!res.ok) {
      return { pkg: null, error: 'Failed to fetch package details' };
    }
    const data = await res.json();
    return { pkg: data, error: null };
  } catch (error: any) {
    return { pkg: null, error: error.message || 'Unknown network error' };
  }
}

export default async function PackageDetailsPage({ params }: { params: Promise<{ id: string }> }) {
  const resolvedParams = await params;
  const { pkg, error } = await fetchPackageDetails(resolvedParams.id);

  if (error || !pkg) {
    return (
      <div className="text-center py-24">
        <h2 className="text-2xl font-bold text-gray-900 mb-2">Package not found</h2>
        <p className="text-gray-500">We couldn't load the details for this package.</p>
        <Link href="/best-packages" className="text-brand-red underline mt-4 inline-block">Back to Packages</Link>
      </div>
    );
  }

  return (
    <main className="max-w-[1120px] mx-auto px-4 sm:px-8 py-8">
      <div className="mb-6">
        <h1 className="text-3xl font-extrabold text-gray-900">{pkg.title}</h1>
        <div className="flex items-center gap-4 text-sm text-gray-600 mt-2 font-medium">
          <span className="flex items-center gap-1"><Star size={16} className="fill-brand-red text-brand-red" /> Package Deal</span>
          <span className="underline">{pkg.duration}</span>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-10 h-[400px]">
        {pkg.images.length > 0 && (
          <img src={pkg.images[0]} alt="Package Image 1" className="w-full h-full object-cover rounded-l-2xl" />
        )}
        {pkg.images.length > 1 && (
          <div className="grid grid-cols-2 gap-4">
            {pkg.images.slice(1, 5).map((img: string, i: number) => (
              <img key={i} src={img} alt={`Package Image ${i + 2}`} className={`w-full h-[192px] object-cover ${i === 1 ? 'rounded-tr-2xl' : ''} ${i === 3 ? 'rounded-br-2xl' : ''}`} />
            ))}
          </div>
        )}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-12 relative">
        <div className="col-span-1 lg:col-span-2 space-y-8">
          <section>
            <h2 className="text-2xl font-semibold mb-4">About this package</h2>
            <p className="text-gray-700 whitespace-pre-line leading-relaxed">{pkg.description}</p>
          </section>
          
          <hr className="border-gray-200" />

          {pkg.properties && pkg.properties.length > 0 && (
            <section>
              <h2 className="text-2xl font-semibold mb-4">Included Stays</h2>
              <div className="space-y-4">
                {pkg.properties.map((prop: any) => (
                  <div key={prop._id} className="flex gap-4 p-4 border border-gray-200 rounded-xl hover:shadow-md transition">
                    <img src={prop.images?.[0]} className="w-24 h-24 rounded-lg object-cover" alt="Hotel" />
                    <div>
                      <h4 className="font-bold text-lg">{prop.title}</h4>
                      <p className="text-gray-500 text-sm flex items-center gap-1 mt-1"><MapPin size={14} /> {prop.location}</p>
                    </div>
                  </div>
                ))}
              </div>
            </section>
          )}

          {pkg.experiences && pkg.experiences.length > 0 && (
            <section>
              <h2 className="text-2xl font-semibold mb-4">Included Activities</h2>
              <div className="space-y-4">
                {pkg.experiences.map((exp: any) => (
                  <div key={exp._id} className="flex gap-4 p-4 border border-gray-200 rounded-xl hover:shadow-md transition">
                    <img src={exp.image} className="w-24 h-24 rounded-lg object-cover" alt="Activity" />
                    <div>
                      <h4 className="font-bold text-lg">{exp.title}</h4>
                      <p className="text-gray-500 text-sm flex items-center gap-1 mt-1"><MapPin size={14} /> {exp.location}</p>
                      <p className="text-gray-500 text-sm mt-1">{exp.duration}</p>
                    </div>
                  </div>
                ))}
              </div>
            </section>
          )}
        </div>

        <div className="col-span-1 relative">
          <div className="sticky top-28 bg-white border border-gray-200 rounded-2xl shadow-xl p-6">
            <div className="mb-4">
              <span className="text-2xl font-bold text-gray-900">₹{pkg.price.toLocaleString()}</span>
              <span className="text-gray-500 ml-1">total</span>
            </div>

            <div className="border border-gray-300 rounded-xl overflow-hidden mb-4">
              <div className="p-3 border-b border-gray-300 text-center bg-gray-50">
                <span className="text-xs font-bold uppercase tracking-wider text-gray-700">{pkg.duration}</span>
              </div>
            </div>

            <Link 
              href={`/best-packages/${pkg._id}/book`}
              className="w-full block text-center bg-brand-red text-white py-3.5 rounded-xl font-bold text-lg hover:bg-red-600 transition shadow-md active:scale-[0.98]"
            >
              Book Package
            </Link>
            
            <p className="text-center text-sm text-gray-500 mt-4">You won't be charged yet</p>
            
            <div className="mt-6 space-y-3">
              <div className="flex items-center justify-between text-gray-700 text-sm">
                <span className="underline">Package deal discount</span>
                <span className="text-green-600 font-medium">Applied</span>
              </div>
            </div>
            
            <hr className="my-4 border-gray-200" />
            
            <div className="flex items-center justify-between font-bold text-lg">
              <span>Total</span>
              <span>₹{pkg.price.toLocaleString()}</span>
            </div>
          </div>
        </div>
      </div>
    </main>
  );
}
