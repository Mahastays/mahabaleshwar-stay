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
  const [selectedRoom, setSelectedRoom] = useState(rooms && rooms.length > 0 ? rooms[0].name : '');

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
              selectedRoom={selectedRoom} 
              onSelectRoom={setSelectedRoom} 
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
          externalSelectedRoom={selectedRoom} 
          onExternalRoomChange={setSelectedRoom} 
        />
      </div>
    </div>
  );
}
