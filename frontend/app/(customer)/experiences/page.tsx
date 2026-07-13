import ActivitiesSection from "@/components/ActivitiesSection";
import BlogSection from "@/components/BlogSection";
import Link from "next/link";
import { Compass, Leaf, Utensils, Mountain } from 'lucide-react';

export const metadata = {
  title: "Experiences in Mahabaleshwar | Maha Stay",
  description: "Discover stories and amazing activities to experience in Mahabaleshwar.",
};

export default function ExperiencesPage() {
  return (
    <main className="pb-16">
      {/* Hero Section */}
      <section className="relative h-[60vh] min-h-[500px] flex items-center justify-center bg-gray-900 overflow-hidden">
        <div className="absolute inset-0">
          <img 
            src="https://images.unsplash.com/photo-1596401057633-54a8fe8ef647?ixlib=rb-4.0.3&auto=format&fit=crop&w=2000&q=80" 
            alt="Mahabaleshwar Hills" 
            className="w-full h-full object-cover opacity-60"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-gray-900 via-transparent to-transparent" />
        </div>
        
        <div className="relative z-10 text-center px-4 max-w-4xl mx-auto mt-16">
          <h1 className="text-4xl md:text-6xl font-extrabold text-white mb-6 drop-shadow-lg">
            Experience the Magic of Mahabaleshwar
          </h1>
          <p className="text-xl md:text-2xl text-gray-200 font-medium drop-shadow-md mb-8">
            From misty mornings over the Sahyadris to picking fresh strawberries, write your own story in Maharashtra's crown jewel.
          </p>
        </div>
      </section>

      {/* Stories & Lore Section */}
      <section className="py-20 bg-white">
        <div className="max-w-[1200px] mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-[#3a1b5c] text-3xl md:text-5xl font-bold mb-6">The Story of the Misty Hills</h2>
            <div className="w-24 h-1.5 bg-brand-red mx-auto rounded-full mb-8"></div>
            <p className="text-lg text-gray-600 leading-relaxed max-w-3xl mx-auto">
              Once a summer capital of the Bombay Province during the British Raj, Mahabaleshwar is steeped in colonial heritage and Maratha history. The stories of Shivaji Maharaj's valor echo through the nearby Pratapgad Fort, while the evergreen forests hold the mythical origins of five sacred rivers at the ancient Panchganga Temple. Every winding road and panoramic viewpoint has a tale to tell.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
            <div className="p-6 bg-brand-red/10 rounded-2xl text-center hover:-translate-y-2 transition-transform duration-300">
              <div className="w-16 h-16 bg-white rounded-full flex items-center justify-center mx-auto mb-4 text-brand-red shadow-sm">
                <Mountain size={28} />
              </div>
              <h3 className="text-xl font-bold text-gray-900 mb-2">Majestic Viewpoints</h3>
              <p className="text-gray-600 text-sm">Over 14 major viewpoints offering breathtaking vistas of valleys and sunsets.</p>
            </div>
            
            <div className="p-6 bg-brand-brown/10 rounded-2xl text-center hover:-translate-y-2 transition-transform duration-300">
              <div className="w-16 h-16 bg-white rounded-full flex items-center justify-center mx-auto mb-4 text-brand-brown/100 shadow-sm">
                <Leaf size={28} />
              </div>
              <h3 className="text-xl font-bold text-gray-900 mb-2">Evergreen Forests</h3>
              <p className="text-gray-600 text-sm">Trek through dense, rare evergreen forests that stay vibrant year-round.</p>
            </div>
            
            <div className="p-6 bg-green-50 rounded-2xl text-center hover:-translate-y-2 transition-transform duration-300">
              <div className="w-16 h-16 bg-white rounded-full flex items-center justify-center mx-auto mb-4 text-green-600 shadow-sm">
                <Compass size={28} />
              </div>
              <h3 className="text-xl font-bold text-gray-900 mb-2">Historical Trails</h3>
              <p className="text-gray-600 text-sm">Explore trails leading to ancient temples and centuries-old forts.</p>
            </div>
            
            <div className="p-6 bg-orange-50 rounded-2xl text-center hover:-translate-y-2 transition-transform duration-300">
              <div className="w-16 h-16 bg-white rounded-full flex items-center justify-center mx-auto mb-4 text-orange-500 shadow-sm">
                <Utensils size={28} />
              </div>
              <h3 className="text-xl font-bold text-gray-900 mb-2">Strawberry Picking</h3>
              <p className="text-gray-600 text-sm">Pluck farm-fresh strawberries and indulge in iconic cream desserts.</p>
            </div>
          </div>
        </div>
      </section>

      {/* Activities Section */}
      <div className="bg-gray-50 pt-8 pb-4">
        <div className="max-w-[2520px] mx-auto xl:px-20 md:px-10 sm:px-2 px-4 mb-4">
          <div className="flex flex-col md:flex-row justify-between items-center mb-8">
            <div className="text-center md:text-left">
              <h2 className="text-[#3a1b5c] text-3xl md:text-5xl font-bold mb-4">What You Can Experience</h2>
              <p className="text-gray-600 text-lg max-w-2xl">From thrilling speed boat rides on Venna Lake to serene pony rides through the woods, curate your perfect itinerary.</p>
            </div>
            <div className="mt-6 md:mt-0">
              <Link href="/experiences/new" className="bg-brand-red hover:bg-green-700 text-white font-semibold py-3 px-6 rounded-lg transition shadow-md whitespace-nowrap">
                + Submit Experience
              </Link>
            </div>
          </div>
        </div>
        <ActivitiesSection />
      </div>

      {/* Blog & Guides Section */}
      <div className="pt-12">
        <BlogSection />
      </div>

    </main>
  );
}
