'use client';

import { useState } from 'react';
import { PlusCircle, Search, Edit2, Trash2 } from 'lucide-react';
import Link from 'next/link';

interface Property {
  _id: string;
  title: string;
  type: string;
  price: number;
  status: 'approved' | 'pending' | 'rejected';
}

const DUMMY_PROPERTIES: Property[] = [
  { _id: 'p1', title: 'Luxury Villa in Mahabaleshwar', type: 'Villa', price: 5000, status: 'approved' },
  { _id: 'p2', title: 'Cozy Forest Tent', type: 'Tent', price: 1500, status: 'pending' },
  { _id: 'p3', title: 'Heritage Resort Stay', type: 'Resort', price: 12000, status: 'approved' },
];

export default function VendorPropertiesPage() {
  const [properties, setProperties] = useState<Property[]>(DUMMY_PROPERTIES);
  const [search, setSearch] = useState('');

  const filteredProperties = properties.filter(p => 
    p.title.toLowerCase().includes(search.toLowerCase())
  );

  const handleDelete = (id: string) => {
    if (window.confirm('Are you sure you want to delete this property?')) {
      setProperties(properties.filter(p => p._id !== id));
    }
  };

  return (
    <div className="max-w-6xl mx-auto space-y-6">
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h2 className="text-2xl font-bold text-gray-900">My Properties</h2>
          <p className="text-gray-500 text-sm mt-1">Manage your listings and track their approval status.</p>
        </div>
        <Link 
          href="/vendor/properties/add" 
          className="flex items-center gap-2 px-4 py-2 bg-gray-900 text-white rounded-lg hover:bg-gray-800 transition-colors"
        >
          <PlusCircle className="w-5 h-5" />
          <span>Add New Property</span>
        </Link>
      </div>

      <div className="bg-white border border-gray-200 rounded-2xl shadow-sm overflow-hidden">
        <div className="p-4 border-b border-gray-200 flex items-center justify-between">
          <div className="relative w-full max-w-sm">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
            <input 
              type="text" 
              placeholder="Search properties..." 
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="w-full pl-10 pr-4 py-2 bg-gray-50 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-gray-900/20 focus:border-gray-900 transition-all text-sm"
            />
          </div>
        </div>
        
        <div className="overflow-x-auto">
          <table className="w-full text-sm text-left">
            <thead className="bg-gray-50 border-b border-gray-200 text-gray-500 uppercase text-xs font-bold tracking-wider">
              <tr>
                <th className="px-6 py-4">Title</th>
                <th className="px-6 py-4">Type</th>
                <th className="px-6 py-4">Price/Night</th>
                <th className="px-6 py-4">Status</th>
                <th className="px-6 py-4 text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-200 text-gray-700">
              {filteredProperties.length > 0 ? filteredProperties.map((prop) => (
                <tr key={prop._id} className="hover:bg-gray-50 transition-colors">
                  <td className="px-6 py-4 font-medium text-gray-900">{prop.title}</td>
                  <td className="px-6 py-4">{prop.type}</td>
                  <td className="px-6 py-4">₹{prop.price.toLocaleString()}</td>
                  <td className="px-6 py-4">
                    <span className={`px-2.5 py-1 rounded-full text-[10px] font-bold uppercase tracking-wider ${
                      prop.status === 'approved' ? 'bg-green-100 text-green-700' :
                      prop.status === 'pending' ? 'bg-yellow-100 text-yellow-700' :
                      'bg-red-100 text-red-700'
                    }`}>
                      {prop.status}
                    </span>
                  </td>
                  <td className="px-6 py-4 text-right">
                    <div className="flex items-center justify-end gap-2">
                      <button className="p-1.5 text-gray-400 hover:text-gray-900 transition-colors" title="Edit">
                        <Edit2 className="w-4 h-4" />
                      </button>
                      <button 
                        onClick={() => handleDelete(prop._id)}
                        className="p-1.5 text-red-400 hover:text-red-600 transition-colors" 
                        title="Delete"
                      >
                        <Trash2 className="w-4 h-4" />
                      </button>
                    </div>
                  </td>
                </tr>
              )) : (
                <tr>
                  <td colSpan={5} className="px-6 py-8 text-center text-gray-500">
                    No properties found matching your search.
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
