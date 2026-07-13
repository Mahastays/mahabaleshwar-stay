"use client";

import { Home, Castle, MountainSnow, Waves, TreePine, Droplet, LayoutGrid } from 'lucide-react';
import { useRouter } from 'next/navigation';

const categories = [
  { name: 'All', icon: LayoutGrid },
  { name: 'Villas', icon: Home },
  { name: 'Heritage', icon: Castle },
  { name: 'Valley View', icon: MountainSnow },
  { name: 'Near Venna Lake', icon: Waves },
  { name: 'Forest Stays', icon: TreePine },
  { name: 'Pools', icon: Droplet },
];

export default function CategoryScroller({ activeCategory = 'All' }: { activeCategory?: string }) {
  const router = useRouter();

  const handleSelect = (category: string) => {
    router.push(`/?category=${category}`);
  };

  return (
    <div className="max-w-[2520px] mx-auto xl:px-20 md:px-10 sm:px-2 px-4 mt-4 mb-2">
      <div className="flex space-x-10 overflow-x-auto no-scrollbar py-2">
        {categories.map((cat, index) => {
          const isActive = cat.name === activeCategory;
          return (
            <div 
              key={index} 
              onClick={() => handleSelect(cat.name)}
              className={`flex flex-col items-center justify-center min-w-max cursor-pointer text-sm gap-2 pb-2 transition border-b-2 ${
                isActive ? 'border-gray-900 text-gray-900' : 'border-transparent text-gray-500 hover:text-gray-900 hover:border-gray-300'
              }`}
            >
              <cat.icon size={24} strokeWidth={isActive ? 2 : 1.5} />
              <span className={`font-semibold ${!isActive && 'font-medium'}`}>{cat.name}</span>
            </div>
          );
        })}
      </div>
    </div>
  );
}
