"use client";
import { useState } from "react";

interface Room {
  name: string;
  price: number;
  quantity: number;
  image?: string;
  breakfastIncluded?: boolean;
}

interface RoomSelectionListProps {
  rooms: Room[];
  selectedRoom: string;
  onSelectRoom: (name: string) => void;
}

export default function RoomSelectionList({ rooms, selectedRoom, onSelectRoom }: RoomSelectionListProps) {
  const [modalImage, setModalImage] = useState<string | null>(null);

  return (
    <div className="space-y-4">
      <h3 className="text-xl font-bold tracking-tight mb-6">Select a Room</h3>
      <div className="space-y-4">
        {rooms.map((room, idx) => {
          const isSelected = selectedRoom === room.name;
          return (
            <div 
              key={idx} 
              className={`border rounded-2xl p-5 flex flex-col md:flex-row gap-6 items-center justify-between transition-all ${
                isSelected ? 'border-brand-red bg-red-50/20 shadow-md shadow-brand-red/10' : 'border-gray-200 hover:border-gray-300'
              }`}
            >
              <div className="flex gap-4 items-center flex-1">
                {room.image ? (
                  <div 
                    className="w-48 h-48 rounded-xl overflow-hidden flex-shrink-0 bg-gray-100 hidden sm:block cursor-pointer hover:opacity-90 transition-opacity"
                    onClick={() => setModalImage(room.image!.startsWith('/') && !room.image!.startsWith('http') ? `${process.env.NEXT_PUBLIC_API_URL?.replace('/api', '') || 'http://localhost:5000'}${room.image}` : room.image!)}
                  >
                    <img 
                      src={room.image.startsWith('/') && !room.image.startsWith('http') ? `${process.env.NEXT_PUBLIC_API_URL?.replace('/api', '') || 'http://localhost:5000'}${room.image}` : room.image} 
                      alt={room.name} 
                      className="w-full h-full object-cover" 
                    />
                  </div>
                ) : (
                  <div className="w-48 h-48 rounded-xl flex-shrink-0 bg-gray-100 flex items-center justify-center hidden sm:flex">
                    <span className="text-gray-400 text-sm font-medium text-center px-2">No image</span>
                  </div>
                )}
                
                <div className="space-y-1">
                  <h4 className="text-lg font-bold text-gray-900">{room.name}</h4>
                  <p className="text-sm text-gray-500">Only {room.quantity} left at this price</p>
                  {room.breakfastIncluded && (
                    <div className="inline-flex items-center gap-1.5 px-2 py-1 mt-1 bg-green-50 text-green-700 text-xs font-semibold rounded-md border border-green-200">
                      <span>☕</span> Breakfast Included
                    </div>
                  )}
                  {/* As per user request, omitted extra mock details like sq ft, bed type, etc. */}
                </div>
              </div>
              
              <div className="flex flex-col items-end gap-3 min-w-[140px]">
                <div className="text-right">
                  <div className="text-xl font-bold text-gray-900">₹{room.price.toLocaleString()}</div>
                  <div className="text-xs text-gray-500">/ night</div>
                </div>
                
                <button
                  onClick={() => onSelectRoom(room.name)}
                  className={`w-full py-2.5 px-6 rounded-xl font-bold text-sm transition-all ${
                    isSelected 
                      ? 'bg-brand-red text-white shadow-md shadow-brand-red/20' 
                      : 'bg-white text-brand-red border-2 border-brand-red hover:bg-red-50'
                  }`}
                >
                  {isSelected ? 'SELECTED' : 'SELECT ROOM'}
                </button>
              </div>
            </div>
          );
        })}
      </div>

      {/* Image Modal */}
      {modalImage && (
        <div 
          className="fixed inset-0 z-50 flex items-center justify-center bg-black/80 backdrop-blur-sm p-4"
          onClick={() => setModalImage(null)}
        >
          <div className="relative max-w-4xl w-full max-h-[90vh] flex flex-col items-center justify-center">
            <button 
              className="absolute -top-12 right-0 text-white hover:text-gray-300 text-3xl font-bold"
              onClick={() => setModalImage(null)}
            >
              ×
            </button>
            <img 
              src={modalImage} 
              alt="Room view" 
              className="max-w-full max-h-[85vh] object-contain rounded-lg shadow-2xl" 
            />
          </div>
        </div>
      )}
    </div>
  );
}
