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
  selectedRooms: string[];
  onSelectRoom: (name: string) => void;
}

export default function RoomSelectionList({ rooms, selectedRooms, onSelectRoom }: RoomSelectionListProps) {
  const [modalImage, setModalImage] = useState<string | null>(null);

  return (
    <div className="space-y-4">
      <h3 className="text-xl font-bold tracking-tight mb-6">Select a Room</h3>
      <div className="space-y-4">
        {rooms.map((room, idx) => {
          const isSelected = selectedRooms.includes(room.name);
          return (
            <div 
              key={idx} 
              className={`border rounded-2xl p-5 flex flex-col md:flex-row gap-6 items-center justify-between transition-all cursor-pointer ${
                isSelected ? 'border-brand-red bg-red-50/20 shadow-md shadow-brand-red/10' : 'border-gray-200 hover:border-gray-300'
              }`}
              onClick={() => onSelectRoom(room.name)}
            >
              <div className="flex gap-4 items-center flex-1 w-full">
                <div className="pt-1">
                  <div className={`w-6 h-6 rounded-md border flex items-center justify-center transition-colors ${isSelected ? 'bg-brand-red border-brand-red' : 'border-gray-300 bg-white'}`}>
                    {isSelected && <svg className="w-4 h-4 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={3} d="M5 13l4 4L19 7" /></svg>}
                  </div>
                </div>
                {room.image ? (
                  <div 
                    className="w-48 h-48 rounded-xl overflow-hidden flex-shrink-0 bg-gray-100 hidden sm:block cursor-zoom-in hover:opacity-90 transition-opacity"
                    onClick={(e) => { e.stopPropagation(); setModalImage(room.image!.startsWith('/') && !room.image!.startsWith('http') ? `${process.env.NEXT_PUBLIC_API_URL?.replace('/api', '') || 'http://localhost:5000'}${room.image}` : room.image!); }}
                  >
                    <img 
                      src={room.image.startsWith('/') && !room.image.startsWith('http') ? `${process.env.NEXT_PUBLIC_API_URL?.replace('/api', '') || 'http://localhost:5000'}${room.image}` : room.image} 
                      alt={room.name} 
                      className="w-full h-full object-cover" 
                    />
                  </div>
                ) : (
                  <div className="w-48 h-48 rounded-xl flex-shrink-0 bg-gray-100 items-center justify-center hidden sm:flex">
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
                  <div className="flex items-center gap-3 text-xs text-gray-500 mt-2 font-medium">
                    <span className="flex items-center gap-1"><svg className="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 8V4m0 0h4M4 4l5 5m11-1V4m0 0h-4m4 0l-5 5M4 16v4m0 0h4m-4 0l5-5m11 5l-5-5m5 5v-4m0 4h-4" /></svg> 250 sq ft</span>
                    <span className="flex items-center gap-1"><svg className="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 3v4M3 5h4M6 17v4m-2-2h4m5-16l2.286 6.857L21 12l-5.714 2.143L13 21l-2.286-6.857L5 12l5.714-2.143L13 3z" /></svg> Double Bed</span>
                  </div>
                </div>
              </div>
              
              <div className="flex flex-col items-end gap-3 min-w-[140px]">
                <div className="text-right">
                  <div className="text-xl font-bold text-gray-900">₹{room.price.toLocaleString()}</div>
                  <div className="text-xs text-gray-500">/ night</div>
                </div>
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
