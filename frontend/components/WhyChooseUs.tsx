import { MapPin, Banknote, Map, Plane, PlaneLanding, Smile } from 'lucide-react';

const features = [
  {
    icon: MapPin,
    title: 'Discover the possibilities',
    description: "With nearly half a million attractions, hotels & more, you're sure to find joy."
  },
  {
    icon: Banknote,
    title: 'Enjoy deals & delights',
    description: 'Quality activities. Great prices. Plus, earn Havezic credits to save more.'
  },
  {
    icon: Map,
    title: 'Exploring made easy',
    description: 'Book last minute, skip lines & get free cancellation for easier exploring.'
  },
  {
    icon: Plane,
    title: 'Travel you can trust',
    description: "Read reviews & get reliable customer support. We're with you at every step."
  },
  {
    icon: PlaneLanding,
    title: '100% guaranteed departures',
    description: "Pack those bags and don't break a sweat because we guarantee every single one..."
  },
  {
    icon: Smile,
    title: 'Flexibility, freedom, fun',
    description: 'No matter the Travel Style, our tours balance well-planned itineraries with the...'
  }
];

export default function WhyChooseUs() {
  return (
    <section className="py-16 mb-8">
      <div className="max-w-[2520px] mx-auto xl:px-20 md:px-10 sm:px-2 px-4">
        <div className="mb-10">
          <h3 className="text-[#e85d38] font-serif italic text-2xl mb-2">Why Choose Us</h3>
          <h2 className="text-[#3a1b5c] text-3xl md:text-4xl font-bold">Why book with Maha Stay?</h2>
        </div>
        
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {features.map((feature, index) => (
            <div 
              key={index} 
              className="bg-white p-8 rounded-2xl shadow-[0_4px_20px_rgb(0,0,0,0.05)] border border-gray-50 hover:shadow-[0_4px_25px_rgb(0,0,0,0.08)] transition-shadow"
            >
              <div className="bg-[#eef5f9] w-16 h-16 rounded-full flex items-center justify-center mb-6">
                <feature.icon className="text-[#e85d38]" size={28} strokeWidth={2.5} />
              </div>
              <h4 className="text-xl font-bold text-gray-900 mb-3">{feature.title}</h4>
              <p className="text-gray-500 leading-relaxed text-[15px]">
                {feature.description}
              </p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
