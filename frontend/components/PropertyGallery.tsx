"use client";

import { useState, useEffect, useCallback } from "react";
import Image from "next/image";
import { X, ChevronLeft, ChevronRight, Grid } from "lucide-react";

interface PropertyGalleryProps {
  images: string[];
  title: string;
}

export default function PropertyGallery({ images, title }: PropertyGalleryProps) {
  const [isOpen, setIsOpen] = useState(false);
  const [currentIndex, setCurrentIndex] = useState(0);

  const openGallery = (index = 0) => {
    setCurrentIndex(index);
    setIsOpen(true);
  };

  const closeGallery = useCallback(() => {
    setIsOpen(false);
  }, []);

  const handlePrevious = useCallback((e?: React.MouseEvent) => {
    if (e) e.stopPropagation();
    setCurrentIndex((prev) => (prev === 0 ? images.length - 1 : prev - 1));
  }, [images.length]);

  const handleNext = useCallback((e?: React.MouseEvent) => {
    if (e) e.stopPropagation();
    setCurrentIndex((prev) => (prev === images.length - 1 ? 0 : prev + 1));
  }, [images.length]);

  // Keyboard navigation & locking body scroll
  useEffect(() => {
    if (!isOpen) {
      document.body.style.overflow = "unset";
      return;
    }
    document.body.style.overflow = "hidden";

    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === "Escape") closeGallery();
      if (e.key === "ArrowLeft") handlePrevious();
      if (e.key === "ArrowRight") handleNext();
    };

    window.addEventListener("keydown", handleKeyDown);
    return () => {
      document.body.style.overflow = "unset";
      window.removeEventListener("keydown", handleKeyDown);
    };
  }, [isOpen, closeGallery, handlePrevious, handleNext]);

  if (!images || images.length === 0) return null;

  return (
    <>
      {/* Photo Grid on Property Details Page */}
      <div className="relative grid grid-cols-1 md:grid-cols-4 gap-2.5 rounded-3xl overflow-hidden mb-12 h-[45vh] md:h-[60vh] shadow-xl shadow-gray-900/5 bg-gray-100 group">
        {/* Main large left photo */}
        <div 
          onClick={() => openGallery(0)}
          className="md:col-span-2 md:row-span-2 relative w-full h-full overflow-hidden cursor-pointer bg-gray-200"
        >
          <Image 
            src={images[0]} 
            alt={`${title} main view`} 
            fill 
            sizes="(max-width: 768px) 100vw, 50vw"
            className="object-cover hover:scale-[1.03] transition-transform duration-500 ease-out" 
          />
          <div className="absolute inset-0 bg-black/0 hover:bg-black/10 transition-colors duration-300" />
        </div>

        {/* Up to 4 secondary photos on desktop */}
        {images.slice(1, 5).map((img, idx) => (
          <div 
            key={idx} 
            onClick={() => openGallery(idx + 1)}
            className="relative w-full h-full hidden md:block overflow-hidden cursor-pointer bg-gray-200"
          >
            <Image 
              src={img} 
              alt={`${title} view ${idx + 2}`} 
              fill 
              sizes="25vw"
              className="object-cover hover:scale-[1.05] transition-transform duration-500 ease-out" 
            />
            <div className="absolute inset-0 bg-black/0 hover:bg-black/10 transition-colors duration-300" />
          </div>
        ))}

        {/* Floating "Show all photos" button */}
        <button
          onClick={() => openGallery(0)}
          className="absolute bottom-5 right-5 z-10 bg-white/95 hover:bg-white text-gray-900 font-bold px-4 py-2.5 rounded-xl shadow-lg shadow-black/10 backdrop-blur-md flex items-center gap-2 text-sm sm:text-base transition-all duration-300 hover:scale-105 active:scale-95 cursor-pointer border border-gray-100"
        >
          <Grid className="w-4 h-4 text-gray-800" />
          <span>Show all photos ({images.length})</span>
        </button>
      </div>

      {/* Fullscreen Interactive Lightbox Preview Modal */}
      {isOpen && (
        <div 
          className="fixed inset-0 z-[200] bg-black/95 backdrop-blur-2xl flex flex-col justify-between p-4 sm:p-6 select-none animate-in fade-in duration-200"
          onClick={closeGallery}
        >
          {/* Top Bar */}
          <div 
            className="flex items-center justify-between text-white z-10 max-w-7xl mx-auto w-full pt-2"
            onClick={(e) => e.stopPropagation()}
          >
            <span className="text-sm font-semibold tracking-wide bg-white/10 px-3.5 py-1.5 rounded-full backdrop-blur-md">
              {currentIndex + 1} / {images.length}
            </span>
            <button 
              onClick={closeGallery}
              className="p-2.5 bg-white/10 hover:bg-white/20 active:scale-95 text-white rounded-full transition-all duration-200 cursor-pointer"
              title="Close preview (Esc)"
            >
              <X className="w-5 h-5" />
            </button>
          </div>

          {/* Center Image Area */}
          <div 
            className="relative flex-1 flex items-center justify-center my-4 overflow-hidden"
            onClick={(e) => e.stopPropagation()}
          >
            {/* Left Arrow */}
            {images.length > 1 && (
              <button
                onClick={handlePrevious}
                className="absolute left-2 sm:left-4 z-20 p-3 bg-white/15 hover:bg-white text-white hover:text-gray-900 rounded-full transition-all duration-300 shadow-lg cursor-pointer hover:scale-110 active:scale-95"
                title="Previous photo (Left arrow)"
              >
                <ChevronLeft className="w-6 h-6 stroke-[2.5]" />
              </button>
            )}

            <div className="relative w-full h-full max-h-[75vh] flex items-center justify-center">
              <img
                src={images[currentIndex]}
                alt={`${title} full preview ${currentIndex + 1}`}
                className="max-w-full max-h-full object-contain drop-shadow-2xl rounded-lg transition-all duration-300 pointer-events-auto"
                style={{ maxHeight: "72vh", maxWidth: "90vw" }}
              />
            </div>

            {/* Right Arrow */}
            {images.length > 1 && (
              <button
                onClick={handleNext}
                className="absolute right-2 sm:right-4 z-20 p-3 bg-white/15 hover:bg-white text-white hover:text-gray-900 rounded-full transition-all duration-300 shadow-lg cursor-pointer hover:scale-110 active:scale-95"
                title="Next photo (Right arrow)"
              >
                <ChevronRight className="w-6 h-6 stroke-[2.5]" />
              </button>
            )}
          </div>

          {/* Bottom Thumbnail Carousel Strip */}
          {images.length > 1 && (
            <div 
              className="flex items-center justify-center gap-2.5 overflow-x-auto py-2 z-10 max-w-5xl mx-auto px-2"
              onClick={(e) => e.stopPropagation()}
            >
              {images.map((img, idx) => (
                <button
                  key={idx}
                  onClick={() => setCurrentIndex(idx)}
                  className={`relative w-16 h-12 sm:w-20 sm:h-14 rounded-lg overflow-hidden shrink-0 transition-all duration-300 cursor-pointer ${
                    currentIndex === idx 
                      ? "ring-2 ring-white scale-105 opacity-100 shadow-lg shadow-white/10" 
                      : "opacity-45 hover:opacity-80 scale-95"
                  }`}
                >
                  <Image 
                    src={img} 
                    alt={`Thumbnail ${idx + 1}`} 
                    fill 
                    sizes="80px"
                    className="object-cover" 
                  />
                </button>
              ))}
            </div>
          )}
        </div>
      )}
    </>
  );
}
