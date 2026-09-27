'use client';

import { useState } from 'react';
import BlogSection from '@/components/BlogSection';

export default function AdminStoriesPage() {
  return (
    <div className="p-8 max-w-7xl mx-auto bg-gray-50 min-h-screen">
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-gray-900 mb-2">Manage Stories & Tips</h1>
        <p className="text-gray-600">Add, edit, or remove stories, tips, and guides shown to customers.</p>
      </div>

      <div className="bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden -mx-4 sm:mx-0">
        <BlogSection />
      </div>
    </div>
  );
}
