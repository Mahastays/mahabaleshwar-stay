"use client";

import { Heart, Star } from 'lucide-react';
import Link from 'next/link';
import Image from 'next/image';
import { useTransition, useMemo } from 'react';
import { toggleFavoriteProperty } from '@/lib/actions';
import { useGeolocation } from '@/hooks/useGeolocation';
import { calculateDistance } from '@/lib/utils';

interface PropertyProps {
  id: number | string;
  image: string;
  isFavorite: boolean;
  title: string;
  distance: string;
  dateRange: string;
  price: string;
  rating: number;
  coordinates?: { lat: number; lng: number };
}

export default function PropertyCard({ id, image, isFavorite, title, distance, dateRange, price, rating, coordinates }: PropertyProps) {
  const [isPending, startTransition] = useTransition();
  const locationState = useGeolocation();

  const displayDistance = useMemo(() => {
    if (coordinates && coordinates.lat && coordinates.lng && locationState.coordinates) {
      const dist = calculateDistance(
        locationState.coordinates.lat,
        locationState.coordinates.lng,
        coordinates.lat,
        coordinates.lng
      );
      return `${dist.toFixed(1)} km away`;
    }
    return distance;
  }, [coordinates, locationState.coordinates, distance]);

  const handleFavoriteClick = (e: React.MouseEvent) => {
    e.preventDefault(); // Stop Link propagation
    startTransition(async () => {
      await toggleFavoriteProperty(id);
    });
  };

  return (
    <Link href={`/properties/${id}`} className="group cursor-pointer flex flex-col gap-3">
      {/* Image Container */}
      <div className="relative aspect-square w-full overflow-hidden rounded-xl bg-gray-200">
        <Image 
          src={image} 
          alt={title} 
          fill
          sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
          className="object-cover transition-transform duration-300 group-hover:scale-105"
        />
        
        {/* Badges and Icons */}
        {isFavorite && (
          <div className="absolute top-3 left-3 bg-white/90 backdrop-blur-sm px-3 py-1 rounded-full shadow-sm">
            <span className="text-sm font-semibold text-gray-900">Guest favorite</span>
          </div>
        )}
        <div 
          onClick={handleFavoriteClick}
          className="absolute top-3 right-3 text-white cursor-pointer z-10"
        >
          <Heart 
            size={28} 
            strokeWidth={1.5} 
            className={`transition-all hover:scale-110 active:scale-95 ${
              isFavorite ? 'fill-brand-red text-brand-red' : 'fill-black/40 hover:fill-brand-red hover:text-brand-red'
            } ${isPending ? 'opacity-50 scale-90' : ''}`} 
          />
        </div>
      </div>
      
      {/* Details */}
      <div className="flex flex-col text-sm">
        <div className="flex justify-between items-start">
          <h3 className="font-semibold text-gray-900 truncate pr-4">{title}</h3>
          <div className="flex items-center gap-1 shrink-0 text-gray-900">
            <Star size={14} className="fill-gray-900" />
            <span>{rating.toFixed(2)}</span>
          </div>
        </div>
        <span className="text-gray-500">{displayDistance}</span>
        <span className="text-gray-500">{dateRange}</span>
        <span className="mt-1 text-gray-900"><span className="font-semibold">{price}</span> / night</span>
      </div>
    </Link>
  );
}
