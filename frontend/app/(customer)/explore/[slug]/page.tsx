import Link from 'next/link';
import { notFound } from 'next/navigation';
import {
  MapPin, Clock, Ticket, ArrowLeft, CheckCircle2,
  Calendar, Home, ChevronRight,
} from 'lucide-react';

interface ExplorePlace {
  _id: string;
  name: string;
  slug: string;
  tagline: string;
  description: string;
  history: string;
  images: string[];
  bestTime: string;
  thingsToDo: string[];
  category: string;
  entryFee: string;
  distance: string;
  isFeatured: boolean;
}

interface Property {
  _id: string;
  title: string;
  price: number;
  rating: number;
  images: string[];
  location: string;
  type: string;
}

async function fetchPlace(slug: string): Promise<ExplorePlace | null> {
  try {
    const res = await fetch(`http://localhost:5000/api/explore/${slug}`, {
      cache: 'no-store',
    });
    if (!res.ok) return null;
    return await res.json();
  } catch {
    return null;
  }
}

async function fetchNearbyProperties(): Promise<Property[]> {
  try {
    const res = await fetch('http://localhost:5000/api/properties', {
      cache: 'no-store',
    });
    if (!res.ok) return [];
    const data = await res.json();
    return data.slice(0, 4);
  } catch {
    return [];
  }
}

export async function generateMetadata({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;
  const place = await fetchPlace(slug);
  if (!place) return { title: 'Place Not Found | Mahastays' };
  return {
    title: `${place.name} – Explore Mahabaleshwar | Mahastays`,
    description: place.description.slice(0, 160),
  };
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

export default async function ExploreDetailPage({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;
  const [place, nearbyProperties] = await Promise.all([
    fetchPlace(slug),
    fetchNearbyProperties(),
  ]);

  if (!place) return notFound();

  return (
    <main className="pb-20">
      {/* ── Hero Image Gallery ── */}
      <section className="relative">
        {/* Main image */}
        <div className="relative h-[55vh] min-h-[400px] overflow-hidden">
          <img
            src={place.images[0]}
            alt={place.name}
            className="w-full h-full object-cover"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent" />

          {/* Breadcrumb */}
          <div className="absolute top-6 left-6 flex items-center gap-2 text-white/80 text-sm">
            <Link href="/" className="hover:text-white transition-colors">Home</Link>
            <ChevronRight className="w-4 h-4" />
            <Link href="/explore" className="hover:text-white transition-colors">Explore</Link>
            <ChevronRight className="w-4 h-4" />
            <span className="text-white font-medium">{place.name}</span>
          </div>

          {/* Back button */}
          <Link
            href="/explore"
            className="absolute top-6 right-6 flex items-center gap-2 bg-white/90 backdrop-blur-sm text-gray-800 px-4 py-2 rounded-full text-sm font-semibold hover:bg-white transition-colors shadow-md"
          >
            <ArrowLeft className="w-4 h-4" /> Back
          </Link>

          {/* Hero text */}
          <div className="absolute bottom-0 left-0 right-0 p-6 md:px-20 md:pb-12">
            <span
              className={`inline-block px-3 py-1 rounded-full text-xs font-bold uppercase tracking-wider mb-3 ${
                CATEGORY_COLORS[place.category] || 'bg-gray-100 text-gray-700'
              }`}
            >
              {place.category}
            </span>
            <h1 className="text-4xl md:text-6xl font-extrabold text-white mb-2 drop-shadow-lg">
              {place.name}
            </h1>
            <p className="text-gray-200 text-lg md:text-xl max-w-2xl">{place.tagline}</p>
          </div>
        </div>

        {/* Secondary images */}
        {place.images.length > 1 && (
          <div className="flex gap-2 px-4 md:px-20 mt-2">
            {place.images.slice(1).map((img, i) => (
              <div
                key={i}
                className="flex-1 h-32 md:h-48 overflow-hidden rounded-xl"
              >
                <img
                  src={img}
                  alt={`${place.name} ${i + 2}`}
                  className="w-full h-full object-cover hover:scale-105 transition-transform duration-500"
                />
              </div>
            ))}
          </div>
        )}
      </section>

      {/* ── Quick Info Pills ── */}
      <section className="max-w-7xl mx-auto px-4 md:px-20 mt-8">
        <div className="flex flex-wrap gap-4">
          <div className="flex items-center gap-2 bg-white border border-gray-200 rounded-2xl px-5 py-3 shadow-sm">
            <MapPin className="w-5 h-5 text-brand-red" />
            <div>
              <p className="text-xs text-gray-500 font-medium">Distance</p>
              <p className="text-sm font-bold text-gray-900">{place.distance}</p>
            </div>
          </div>
          <div className="flex items-center gap-2 bg-white border border-gray-200 rounded-2xl px-5 py-3 shadow-sm">
            <Ticket className="w-5 h-5 text-brand-brown" />
            <div>
              <p className="text-xs text-gray-500 font-medium">Entry Fee</p>
              <p className="text-sm font-bold text-gray-900">{place.entryFee}</p>
            </div>
          </div>
          <div className="flex items-center gap-2 bg-white border border-gray-200 rounded-2xl px-5 py-3 shadow-sm">
            <Calendar className="w-5 h-5 text-sky-500" />
            <div>
              <p className="text-xs text-gray-500 font-medium">Best Time</p>
              <p className="text-sm font-bold text-gray-900">{place.bestTime.split('.')[0]}</p>
            </div>
          </div>
        </div>
      </section>

      {/* ── Main Content ── */}
      <section className="max-w-7xl mx-auto px-4 md:px-20 mt-12 grid grid-cols-1 lg:grid-cols-3 gap-12">
        {/* Left: About + History */}
        <div className="lg:col-span-2 space-y-12">
          {/* About */}
          <div>
            <h2 className="text-2xl font-bold text-gray-900 mb-4 flex items-center gap-3">
              <span className="w-8 h-1 bg-brand-red rounded-full inline-block" />
              About {place.name}
            </h2>
            <p className="text-gray-600 leading-relaxed text-lg">{place.description}</p>
          </div>

          {/* History */}
          <div className="bg-amber-50 border border-amber-200 rounded-3xl p-8">
            <h2 className="text-2xl font-bold text-gray-900 mb-4 flex items-center gap-3">
              <Clock className="w-6 h-6 text-brand-brown" />
              History & Heritage
            </h2>
            <p className="text-gray-700 leading-relaxed text-base">{place.history}</p>
          </div>

          {/* Best Time */}
          <div className="bg-sky-50 border border-sky-200 rounded-3xl p-8">
            <h2 className="text-2xl font-bold text-gray-900 mb-4 flex items-center gap-3">
              <Calendar className="w-6 h-6 text-sky-500" />
              Best Time to Visit
            </h2>
            <p className="text-gray-700 leading-relaxed text-base">{place.bestTime}</p>
          </div>

          {/* Things To Do */}
          {place.thingsToDo && place.thingsToDo.length > 0 && (
            <div>
              <h2 className="text-2xl font-bold text-gray-900 mb-6 flex items-center gap-3">
                <span className="w-8 h-1 bg-brand-red rounded-full inline-block" />
                Things To Do
              </h2>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                {place.thingsToDo.map((item, i) => (
                  <div
                    key={i}
                    className="flex items-start gap-3 bg-white border border-gray-100 rounded-2xl p-4 shadow-sm hover:shadow-md transition-shadow"
                  >
                    <div className="flex-shrink-0 w-8 h-8 bg-brand-red/10 rounded-full flex items-center justify-center mt-0.5">
                      <CheckCircle2 className="w-4 h-4 text-brand-red" />
                    </div>
                    <p className="text-gray-700 text-sm font-medium leading-snug">{item}</p>
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>

        {/* Right: Sidebar — Nearby Stays */}
        <aside className="space-y-6">
          <div className="sticky top-28">
            <div className="bg-white border border-gray-200 rounded-3xl p-6 shadow-sm">
              <div className="flex items-center gap-2 mb-5">
                <Home className="w-5 h-5 text-brand-red" />
                <h3 className="text-lg font-bold text-gray-900">Nearby Stays</h3>
              </div>
              <p className="text-sm text-gray-500 mb-5">
                Stay close to {place.name} and wake up to nature every morning.
              </p>

              {nearbyProperties.length > 0 ? (
                <div className="space-y-4">
                  {nearbyProperties.map((prop) => {
                    const img = prop.images?.[0]
                      ? prop.images[0].startsWith('/')
                        ? `http://localhost:5000${prop.images[0]}`
                        : prop.images[0]
                      : 'https://images.unsplash.com/photo-1542314831-c6a4d14d8c53?auto=format&fit=crop&q=80';
                    return (
                      <Link
                        key={prop._id}
                        href={`/properties/${prop._id}`}
                        className="flex gap-3 group hover:bg-gray-50 rounded-2xl p-2 -mx-2 transition-colors"
                      >
                        <div className="w-20 h-16 rounded-xl overflow-hidden flex-shrink-0">
                          <img
                            src={img}
                            alt={prop.title}
                            className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                          />
                        </div>
                        <div className="flex flex-col justify-center min-w-0">
                          <p className="font-semibold text-gray-900 text-sm truncate group-hover:text-brand-red transition-colors">
                            {prop.title}
                          </p>
                          <p className="text-gray-400 text-xs truncate">{prop.location}</p>
                          <p className="text-gray-900 text-sm font-bold mt-1">
                            ₹{prop.price.toLocaleString()}
                            <span className="text-gray-400 text-xs font-normal"> / night</span>
                          </p>
                        </div>
                      </Link>
                    );
                  })}
                </div>
              ) : (
                <p className="text-gray-400 text-sm text-center py-4">
                  No properties available yet.
                </p>
              )}

              <Link
                href="/"
                className="mt-6 w-full flex items-center justify-center gap-2 bg-brand-red text-white py-3 rounded-2xl font-semibold hover:bg-brand-red/90 transition-colors text-sm"
              >
                View All Stays
              </Link>
            </div>

            {/* Map placeholder */}
            <div className="mt-4 bg-gray-100 rounded-3xl overflow-hidden h-52 relative">
              <img
                src={`https://maps.googleapis.com/maps/api/staticmap?center=Mahabaleshwar&zoom=12&size=400x200&maptype=roadmap&style=element:geometry|color:0xe9f5e1&style=element:labels.text.fill|color:0x2D5A27&key=YOUR_KEY`}
                alt="Map"
                className="w-full h-full object-cover opacity-0"
              />
              <div className="absolute inset-0 flex flex-col items-center justify-center text-gray-500">
                <MapPin className="w-8 h-8 text-brand-red mb-2" />
                <p className="text-sm font-semibold text-gray-700">{place.name}</p>
                <p className="text-xs text-gray-400 mt-1">{place.distance}</p>
              </div>
            </div>
          </div>
        </aside>
      </section>

      {/* ── More Places ── */}
      <section className="max-w-7xl mx-auto px-4 md:px-20 mt-16">
        <div className="flex items-center justify-between mb-6">
          <h2 className="text-2xl font-bold text-gray-900">More Places to Explore</h2>
          <Link
            href="/explore"
            className="text-brand-red font-semibold text-sm hover:underline flex items-center gap-1"
          >
            See all <ChevronRight className="w-4 h-4" />
          </Link>
        </div>
        <div className="bg-brand-red/5 border border-brand-red/20 rounded-3xl p-6 text-center">
          <p className="text-gray-600 mb-4">
            There's so much more to discover in and around Mahabaleshwar.
          </p>
          <Link
            href="/explore"
            className="inline-flex items-center gap-2 bg-brand-red text-white px-6 py-3 rounded-full font-semibold hover:bg-brand-red/90 transition-colors text-sm"
          >
            Explore All Places <ChevronRight className="w-4 h-4" />
          </Link>
        </div>
      </section>
    </main>
  );
}
