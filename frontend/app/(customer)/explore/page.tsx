import Link from 'next/link';
import { MapPin, Clock, Ticket, ArrowRight, Star } from 'lucide-react';

export const metadata = {
  title: 'Explore Mahabaleshwar | Mahastays',
  description:
    'Discover the iconic places, viewpoints, forts, lakes, and hidden gems of Mahabaleshwar. Plan your perfect itinerary with Mahastays.',
};

interface ExplorePlace {
  _id: string;
  name: string;
  slug: string;
  tagline: string;
  description: string;
  images: string[];
  category: string;
  entryFee: string;
  distance: string;
  bestTime: string;
  isFeatured: boolean;
}

async function fetchPlaces(): Promise<ExplorePlace[]> {
  try {
    const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL || 'http://localhost:5000/api'}/explore`, { cache: 'no-store' });
    if (!res.ok) return [];
    return await res.json();
  } catch (error) {
    console.error('Failed to fetch places:', error);
    return [];
  }
}

const CATEGORY_COLORS: Record<string, string> = {
  Viewpoint: 'bg-sky-100 text-sky-700',
  Lake: 'bg-blue-100 text-blue-700',
  Fort: 'bg-amber-100 text-amber-700',
  Temple: 'bg-orange-100 text-orange-700',
  Nature: 'bg-emerald-100 text-emerald-700',
  Market: 'bg-purple-100 text-purple-700',
  Adventure: 'bg-red-100 text-red-700',
};

export default async function ExplorePage() {
  const places = await fetchPlaces();
  const featured = places.filter((p) => p.isFeatured);
  const rest = places.filter((p) => !p.isFeatured);

  return (
    <main className="pb-20">
      {/* ── Hero ── */}
      <section className="relative h-[60vh] min-h-[480px] flex items-end justify-start overflow-hidden">
        <img
          src="https://images.unsplash.com/photo-1506905925346-21bda4d32df4?auto=format&fit=crop&w=2000&q=80"
          alt="Mahabaleshwar landscape"
          className="absolute inset-0 w-full h-full object-cover"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/30 to-transparent" />
        <div className="relative z-10 px-6 md:px-20 pb-16 max-w-4xl">
          <p className="text-brand-red font-semibold tracking-widest text-sm uppercase mb-3">
            Discover • Explore • Experience
          </p>
          <h1 className="text-5xl md:text-7xl font-extrabold text-white leading-tight mb-4">
            Mahabaleshwar
            <br />
            <span className="text-brand-red">Awaits You</span>
          </h1>
          <p className="text-gray-200 text-lg md:text-xl max-w-2xl leading-relaxed">
            From misty viewpoints and ancient forts to strawberry farms and sacred
            rivers — every corner of this hill town has a story to tell.
          </p>
        </div>
      </section>

      {/* ── Stats Bar ── */}
      <section className="bg-white border-b border-gray-200">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-20 py-6 grid grid-cols-2 md:grid-cols-4 gap-6 text-center">
          {[
            { value: '1,353m', label: 'Altitude' },
            { value: '14+', label: 'Viewpoints' },
            { value: '5', label: 'Sacred Rivers' },
            { value: '300+', label: 'Years of History' },
          ].map((s) => (
            <div key={s.label}>
              <p className="text-3xl font-extrabold text-brand-red">{s.value}</p>
              <p className="text-sm text-gray-500 mt-1 font-medium">{s.label}</p>
            </div>
          ))}
        </div>
      </section>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-20 mt-16">
        {/* ── Featured Places ── */}
        {featured.length > 0 && (
          <section className="mb-20">
            <div className="flex items-center gap-3 mb-8">
              <Star className="w-6 h-6 fill-brand-red text-brand-red" />
              <h2 className="text-3xl font-bold text-gray-900">Must-Visit Places</h2>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
              {featured.map((place, i) => (
                <Link
                  key={place._id}
                  href={`/explore/${place.slug}`}
                  className={`group relative overflow-hidden rounded-3xl shadow-lg hover:shadow-2xl transition-shadow duration-300 ${
                    i === 0 ? 'md:col-span-2' : ''
                  }`}
                >
                  <div className={`relative ${i === 0 ? 'h-[420px]' : 'h-[300px]'}`}>
                    <img
                      src={place.images[0]}
                      alt={place.name}
                      className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-black/75 via-black/20 to-transparent" />
                  </div>
                  <div className="absolute bottom-0 left-0 right-0 p-6 md:p-8">
                    <span
                      className={`inline-block px-3 py-1 rounded-full text-xs font-bold uppercase tracking-wider mb-3 ${
                        CATEGORY_COLORS[place.category] || 'bg-gray-100 text-gray-700'
                      }`}
                    >
                      {place.category}
                    </span>
                    <h3 className="text-2xl md:text-3xl font-bold text-white mb-1">
                      {place.name}
                    </h3>
                    <p className="text-gray-300 text-sm md:text-base mb-4 line-clamp-2">
                      {place.tagline}
                    </p>
                    <div className="flex items-center gap-6 text-gray-300 text-xs">
                      <span className="flex items-center gap-1.5">
                        <MapPin className="w-3.5 h-3.5" />
                        {place.distance}
                      </span>
                      <span className="flex items-center gap-1.5">
                        <Ticket className="w-3.5 h-3.5" />
                        {place.entryFee}
                      </span>
                    </div>
                  </div>
                  <div className="absolute top-4 right-4 bg-white/90 backdrop-blur-sm text-gray-900 text-sm font-semibold px-4 py-2 rounded-full flex items-center gap-1.5 opacity-0 group-hover:opacity-100 transition-opacity duration-300">
                    Explore <ArrowRight className="w-4 h-4" />
                  </div>
                </Link>
              ))}
            </div>
          </section>
        )}

        {/* ── All Places ── */}
        {rest.length > 0 && (
          <section className="mb-20">
            <h2 className="text-3xl font-bold text-gray-900 mb-8">More to Discover</h2>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
              {rest.map((place) => (
                <Link
                  key={place._id}
                  href={`/explore/${place.slug}`}
                  className="group bg-white rounded-2xl overflow-hidden border border-gray-200 hover:shadow-xl transition-shadow duration-300"
                >
                  <div className="relative h-52 overflow-hidden">
                    <img
                      src={place.images[0]}
                      alt={place.name}
                      className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                    />
                    <span
                      className={`absolute top-3 left-3 px-3 py-1 rounded-full text-xs font-bold uppercase tracking-wider ${
                        CATEGORY_COLORS[place.category] || 'bg-gray-100 text-gray-700'
                      }`}
                    >
                      {place.category}
                    </span>
                  </div>
                  <div className="p-5">
                    <h3 className="font-bold text-gray-900 text-lg mb-1 group-hover:text-brand-red transition-colors">
                      {place.name}
                    </h3>
                    <p className="text-gray-500 text-sm mb-4 line-clamp-2">
                      {place.tagline}
                    </p>
                    <div className="flex items-center justify-between text-xs text-gray-400">
                      <span className="flex items-center gap-1">
                        <MapPin className="w-3 h-3" /> {place.distance}
                      </span>
                      <span className="flex items-center gap-1">
                        <Ticket className="w-3 h-3" /> {place.entryFee}
                      </span>
                    </div>
                  </div>
                </Link>
              ))}
            </div>
          </section>
        )}

        {/* Empty state */}
        {places.length === 0 && (
          <div className="text-center py-32">
            <MapPin className="w-16 h-16 text-gray-300 mx-auto mb-4" />
            <h2 className="text-2xl font-bold text-gray-900 mb-2">No places yet</h2>
            <p className="text-gray-500">
              Explore places will appear here once the admin adds them.
            </p>
          </div>
        )}

        {/* ── CTA Banner ── */}
        <section className="bg-brand-red rounded-3xl p-10 md:p-16 text-center text-white mb-4">
          <h2 className="text-3xl md:text-4xl font-extrabold mb-4">
            Ready to experience Mahabaleshwar?
          </h2>
          <p className="text-green-100 text-lg mb-8 max-w-xl mx-auto">
            Find the perfect stay close to the places you love. Browse our handpicked
            properties across Mahabaleshwar and Panchgani.
          </p>
          <Link
            href="/"
            className="inline-flex items-center gap-2 bg-white text-brand-red font-bold px-8 py-4 rounded-full hover:bg-gray-100 transition-colors text-sm"
          >
            Browse Stays <ArrowRight className="w-4 h-4" />
          </Link>
        </section>
      </div>
    </main>
  );
}
