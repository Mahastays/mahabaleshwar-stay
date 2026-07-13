'use client';

import { ChevronLeft, ChevronRight, MapPin, Star, Clock, Heart } from 'lucide-react';
import Link from 'next/link';

import { useEffect, useState } from 'react';
import api from '../lib/api';

interface Activity {
  _id: string;
  image: string;
  location: string;
  title: string;
  rating: number;
  reviews: number;
  price: number;
  duration: string;
}

export default function ActivitiesSection() {
  const [activities, setActivities] = useState<Activity[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchExperiences = async () => {
      try {
        const res = await api.get('/experiences');
        setActivities(res.data);
      } catch (error) {
        console.error('Error fetching experiences:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchExperiences();
  }, []);

  if (loading) {
    return <div className="py-16 text-center">Loading experiences...</div>;
  }

  return (
    <section className="py-16 bg-white mb-12">
      <div className="max-w-[2520px] mx-auto xl:px-20 md:px-10 sm:px-2 px-4">
        <div className="flex justify-between items-center mb-10">
          <h2 className="text-[#3a1b5c] text-3xl md:text-4xl font-bold">Activities</h2>
          
          <div className="hidden md:flex gap-3">
            <button className="p-2 rounded-full border border-gray-200 hover:bg-gray-50 transition text-gray-500 hover:text-gray-900">
              <ChevronLeft size={20} />
            </button>
            <button className="p-2 rounded-full border border-gray-200 hover:bg-gray-50 transition text-gray-500 hover:text-gray-900">
              <ChevronRight size={20} />
            </button>
          </div>
        </div>
        
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
          {activities.map((activity) => (
            <div key={activity._id} className="group flex flex-col bg-white rounded-2xl border border-gray-100 overflow-hidden hover:shadow-[0_8px_30px_rgb(0,0,0,0.1)] transition-all duration-300">
              {/* Image Section */}
              <div className="relative h-56 overflow-hidden bg-gray-100">
                <img 
                  src={activity.image} 
                  alt={activity.title} 
                  className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                />
                <button className="absolute top-4 right-4 text-gray-300 hover:text-brand-red transition-colors bg-white/50 backdrop-blur-sm p-1.5 rounded-full">
                  <Heart size={22} className="fill-current" />
                </button>
              </div>

              {/* Content Section */}
              <div className="p-6 flex flex-col flex-1">
                <div className="flex items-start gap-1.5 mb-3 text-gray-500">
                  <MapPin size={16} className="mt-0.5 shrink-0" />
                  <p className="text-[13px] leading-tight line-clamp-2">{activity.location}</p>
                </div>
                
                <h4 className="text-[20px] font-bold text-[#3a1b5c] mb-2">
                  {activity.title}
                </h4>
                
                <div className="flex items-center gap-1.5 mb-4 text-sm font-semibold text-[#f5a623]">
                  <Star size={16} className="fill-current" />
                  <span>{activity.rating}</span>
                  <span className="text-gray-400 font-normal ml-1">({activity.reviews === 0 ? 'No Review' : `${activity.reviews} Reviews`})</span>
                </div>

                <div className="border-t border-gray-100 mt-auto pt-4 flex items-end justify-between">
                  <div className="flex flex-col">
                    <span className="text-gray-500 text-xs mb-0.5">From</span>
                    <span className="text-gray-900 font-bold text-[18px]">
                      ₹ {activity.price.toLocaleString('en-IN', { minimumFractionDigits: 2 })}
                    </span>
                  </div>
                  <div className="flex items-center gap-1.5 text-gray-500">
                    <Clock size={14} />
                    <span className="text-[12px]">{activity.duration}</span>
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
