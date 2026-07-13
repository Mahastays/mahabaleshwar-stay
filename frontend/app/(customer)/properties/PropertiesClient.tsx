'use client';

import { useState, useMemo } from 'react';
import PropertyCard from '@/components/PropertyCard';
import { Filter, Star, Home, Building2, Tent, Search } from 'lucide-react';
import { Property } from './page';

interface PropertiesClientProps {
  initialProperties: Property[];
}

const PROPERTY_TYPES = ['Villa', 'Resort', 'Homestay', 'Hotel', 'Cottage', 'Tent'];

export default function PropertiesClient({ initialProperties }: PropertiesClientProps) {
  const [searchQuery, setSearchQuery] = useState('');
  const [maxPrice, setMaxPrice] = useState<number>(20000);
  const [minRating, setMinRating] = useState<number>(0);
  const [selectedTypes, setSelectedTypes] = useState<string[]>([]);
  const [showMobileFilters, setShowMobileFilters] = useState(false);

  // Filter properties based on state
  const filteredProperties = useMemo(() => {
    return initialProperties.filter((prop) => {
      // Search
      const matchesSearch = prop.title.toLowerCase().includes(searchQuery.toLowerCase()) || 
                            prop.distance.toLowerCase().includes(searchQuery.toLowerCase());
      
      // Price
      const matchesPrice = prop.rawPrice <= maxPrice;
      
      // Rating
      const matchesRating = prop.rating >= minRating;
      
      // Type
      const matchesType = selectedTypes.length === 0 || selectedTypes.includes(prop.category);

      return matchesSearch && matchesPrice && matchesRating && matchesType;
    });
  }, [initialProperties, searchQuery, maxPrice, minRating, selectedTypes]);

  const toggleType = (type: string) => {
    setSelectedTypes(prev => 
      prev.includes(type) ? prev.filter(t => t !== type) : [...prev, type]
    );
  };

  return (
    <div className="flex flex-col lg:flex-row gap-8">
      
      {/* Mobile Filter Toggle */}
      <button 
        onClick={() => setShowMobileFilters(!showMobileFilters)}
        className="lg:hidden flex items-center justify-center gap-2 bg-gray-100 p-3 rounded-xl w-full font-medium"
      >
        <Filter size={20} />
        {showMobileFilters ? 'Hide Filters' : 'Show Filters'}
      </button>

      {/* Sidebar Filters */}
      <div className={`lg:w-1/4 flex-shrink-0 space-y-8 ${showMobileFilters ? 'block' : 'hidden lg:block'}`}>
        
        {/* Search */}
        <div>
          <h3 className="text-lg font-semibold mb-3">Search</h3>
          <div className="relative">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" size={18} />
            <input 
              type="text" 
              placeholder="Search places, titles..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full pl-10 pr-4 py-2.5 border rounded-xl focus:outline-none focus:ring-2 focus:ring-brand-red"
            />
          </div>
        </div>

        {/* Price Filter */}
        <div className="border-t pt-6">
          <h3 className="text-lg font-semibold mb-4">Price Range (per night)</h3>
          <input 
            type="range" 
            min="500" 
            max="30000" 
            step="500"
            value={maxPrice}
            onChange={(e) => setMaxPrice(Number(e.target.value))}
            className="w-full h-2 bg-gray-200 rounded-lg appearance-none cursor-pointer accent-brand-red"
          />
          <div className="flex justify-between text-sm text-gray-600 mt-2">
            <span>₹500</span>
            <span className="font-semibold text-gray-900">Up to ₹{maxPrice}</span>
          </div>
        </div>

        {/* Property Type */}
        <div className="border-t pt-6">
          <h3 className="text-lg font-semibold mb-4">Property Type</h3>
          <div className="space-y-3">
            {PROPERTY_TYPES.map((type) => (
              <label key={type} className="flex items-center gap-3 cursor-pointer group">
                <div className={`w-5 h-5 rounded border flex items-center justify-center transition-colors
                  ${selectedTypes.includes(type) ? 'bg-brand-red border-brand-red' : 'border-gray-300 group-hover:border-brand-red'}
                `}>
                  {selectedTypes.includes(type) && <div className="w-2.5 h-2.5 bg-white rounded-sm" />}
                </div>
                <span className="text-gray-700">{type}</span>
              </label>
            ))}
          </div>
        </div>

        {/* Star Rating */}
        <div className="border-t pt-6">
          <h3 className="text-lg font-semibold mb-4">Minimum Rating</h3>
          <div className="flex flex-wrap gap-2">
            {[0, 3, 4, 4.5].map((rating) => (
              <button
                key={rating}
                onClick={() => setMinRating(rating)}
                className={`px-4 py-2 rounded-full border text-sm flex items-center gap-1 transition-colors
                  ${minRating === rating 
                    ? 'bg-gray-900 text-white border-gray-900' 
                    : 'bg-white text-gray-700 border-gray-300 hover:border-gray-900'
                  }
                `}
              >
                {rating === 0 ? 'Any' : (
                  <>
                    <span>{rating}+</span>
                    <Star size={14} className={minRating === rating ? 'fill-white' : 'fill-gray-700'} />
                  </>
                )}
              </button>
            ))}
          </div>
        </div>
        
        {/* Reset Filters */}
        <div className="border-t pt-6">
          <button 
            onClick={() => {
              setSearchQuery('');
              setMaxPrice(20000);
              setMinRating(0);
              setSelectedTypes([]);
            }}
            className="w-full py-2.5 text-brand-red font-medium hover:bg-green-50 rounded-xl transition-colors"
          >
            Reset All Filters
          </button>
        </div>

      </div>

      {/* Main Grid */}
      <div className="lg:w-3/4 flex-1">
        <div className="mb-6 flex justify-between items-center">
          <p className="text-gray-600">Showing {filteredProperties.length} {filteredProperties.length === 1 ? 'stay' : 'stays'}</p>
        </div>

        {filteredProperties.length > 0 ? (
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 xl:grid-cols-4 gap-6">
            {filteredProperties.map((prop) => (
              <div key={prop.id}>
                <PropertyCard {...prop} />
              </div>
            ))}
          </div>
        ) : (
          <div className="flex flex-col items-center justify-center py-20 text-center bg-gray-50 rounded-2xl border border-dashed border-gray-200">
            <div className="w-16 h-16 bg-gray-100 rounded-full flex items-center justify-center mb-4">
              <Search className="text-gray-400" size={24} />
            </div>
            <h3 className="text-xl font-semibold text-gray-900 mb-2">No exact matches</h3>
            <p className="text-gray-500 max-w-sm">Try changing your filters, expanding your price range, or searching for a different area.</p>
            <button 
              onClick={() => {
                setSearchQuery('');
                setMaxPrice(20000);
                setMinRating(0);
                setSelectedTypes([]);
              }}
              className="mt-6 px-6 py-2.5 bg-gray-900 text-white rounded-xl hover:bg-gray-800 transition-colors font-medium"
            >
              Clear filters
            </button>
          </div>
        )}
      </div>

    </div>
  );
}
