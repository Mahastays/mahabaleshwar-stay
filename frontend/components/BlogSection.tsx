import { ChevronLeft, ChevronRight } from 'lucide-react';
import Link from 'next/link';

const blogPosts = [
  {
    id: 1,
    image: 'https://images.unsplash.com/photo-1601058268499-e52658b8bb88?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80',
    category: 'TOURIST SPOTS',
    title: 'Temples of Mahabaleshwar',
    excerpt: 'Mahabaleshwar, known for its temples and natural beauty, offers spiritual solace and rich historical significance, particularly through the Mahabaleshwar Temple.'
  },
  {
    id: 2,
    image: 'https://images.unsplash.com/photo-1623862660144-88001712a2aa?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80',
    category: 'TOURIST SPOTS',
    title: 'Mahabaleshwar Hill Station',
    excerpt: 'Mahabaleshwar, a scenic hill station in Maharashtra, offers beautiful landscapes, adventure activities, and rich cultural heritage.'
  },
  {
    id: 3,
    image: 'https://images.unsplash.com/photo-1616053896425-c63bf7246ecf?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80',
    category: 'TOURIST SPOTS',
    title: 'Mahabaleshwar Tiger Spring Point',
    excerpt: 'Tiger Spring Point in Mahabaleshwar offers serene beauty, clear waters, and rich mythology, attracting nature lovers and travelers.'
  },
  {
    id: 4,
    image: 'https://images.unsplash.com/photo-1592659762303-90081d34b277?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80',
    category: 'UNCATEGORIZED',
    title: 'Mahabaleshwar Connaught Peak',
    excerpt: 'Connaught Peak in Mahabaleshwar offers stunning views, rich biodiversity, and serenity, perfect for nature lovers and trekkers.'
  }
];

export default function BlogSection() {
  return (
    <section className="py-16 bg-[#fdfdfd] mb-12">
      <div className="max-w-[2520px] mx-auto xl:px-20 md:px-10 sm:px-2 px-4">
        <div className="flex justify-between items-center mb-10">
          <h2 className="text-[#3a1b5c] text-3xl md:text-4xl font-bold">Stories, Tips, and Guides</h2>
          
          <div className="hidden md:flex gap-3">
            <button className="p-2 rounded-full border border-gray-200 hover:bg-gray-50 transition text-gray-500 hover:text-gray-900">
              <ChevronLeft size={20} />
            </button>
            <button className="p-2 rounded-full border border-gray-200 hover:bg-gray-50 transition text-gray-500 hover:text-gray-900">
              <ChevronRight size={20} />
            </button>
          </div>
        </div>
        
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
          {blogPosts.map((post) => (
            <Link href="#" key={post.id} className="group flex flex-col bg-white rounded-2xl shadow-[0_2px_15px_rgb(0,0,0,0.06)] border border-gray-100 overflow-hidden hover:shadow-[0_8px_30px_rgb(0,0,0,0.12)] transition-all duration-300">
              <div className="h-48 overflow-hidden">
                <img 
                  src={post.image} 
                  alt={post.title} 
                  className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                />
              </div>
              <div className="p-6 flex flex-col flex-1">
                <div className="flex items-center gap-2 mb-3">
                  <div className="w-1.5 h-1.5 rounded-full bg-gray-900"></div>
                  <span className="text-[11px] font-bold text-gray-900 tracking-wider uppercase">{post.category}</span>
                </div>
                <h4 className="text-[18px] font-bold text-[#3a1b5c] mb-3 leading-snug group-hover:text-brand-red transition-colors">
                  {post.title}
                </h4>
                <p className="text-gray-500 text-[14px] leading-relaxed line-clamp-4">
                  {post.excerpt}
                </p>
              </div>
            </Link>
          ))}
        </div>
      </div>
    </section>
  );
}
