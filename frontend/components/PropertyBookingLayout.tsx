"use client";

import { useState } from 'react';
import BookingWidget from '@/components/BookingWidget';
import RoomSelectionList from '@/components/RoomSelectionList';
import ReviewSection from '@/components/ReviewSection';

interface PropertyBookingLayoutProps {
  propertyId: string;
  pricePerNight: number;
  rooms?: { name: string; price: number; quantity: number }[];
  children: React.ReactNode;
  rating: number;
  reviews: number;
}

export default function PropertyBookingLayout({ propertyId, pricePerNight, rooms, children, rating, reviews }: PropertyBookingLayoutProps) {
  const [selectedRooms, setSelectedRooms] = useState<string[]>(rooms && rooms.length > 0 ? [rooms[0].name] : []);

  const handleSelectRoom = (name: string) => {
    setSelectedRooms(prev => {
      if (prev.includes(name)) {
        // Prevent deselecting the last room
        if (prev.length === 1) return prev;
        return prev.filter(r => r !== name);
      } else {
        return [...prev, name];
      }
    });
  };

  return (
    <div className="grid grid-cols-1 lg:grid-cols-3 gap-12 relative">
      {/* Main Content */}
      <div className="lg:col-span-2 space-y-10">
        {children}

        {/* Room Selection List */}
        {rooms && rooms.length > 0 && (
          <div className="border-t pt-8 pb-8">
            <RoomSelectionList 
              rooms={rooms} 
              selectedRooms={selectedRooms} 
              onSelectRoom={handleSelectRoom} 
            />
          </div>
        )}

        {/* Reviews Section */}
        <ReviewSection
          propertyId={propertyId}
          avgRating={rating}
          totalReviews={reviews}
        />
      </div>

      {/* Booking Widget Sidebar */}
      <div className="lg:col-span-1 border-t lg:border-t-0 pt-8 lg:pt-0">
        <BookingWidget 
          propertyId={propertyId} 
          pricePerNight={pricePerNight} 
          rooms={rooms} 
          externalSelectedRooms={selectedRooms} 
          onExternalRoomChange={handleSelectRoom} 
        />
      </div>
    </div>
  );
}
